
(function() {

	"use strict";

	var zv = ZhiUTech.Viewing,
		zvp = zv.Private;

	var WORKER_PARSE_F2D = "PARSE_F2D";
	var WORKER_STREAM_F2D = "STREAM_F2D";
	var WORKER_PARSE_F2D_FRAME = "PARSE_F2D_FRAME";

	var RENDER_BUFFER_REQUEST = 0x1;
	var PROMISE_BUFFER_REQUEST = 0x2;
	var ANY_BUFFER_REQUEST = 0x4;
	var BUFFER_SENT_TO_PARSER = 0x8;

	var MEGA = 1024 * 1024;
	var VERT_SIZE = 12 * 4; // 12 floats per vertex
	var INDEX_SIZE = 2;

	// Paging proxy object to manage on demand loading and paging logic, 
	// that is specific to the model loaded by esd loader.
	var F2DPagingProxy = function(loader, options) {

		var _extendObject = function(target, source) {
			for(var prop in source) {
				if(source.hasOwnProperty(prop)) {
					target[prop] = source[prop];
				}
			}
		};

		var _loader = loader;

		// Options of control memory management.
		// Options of control memory management.
		this.options = {
			onDemandLoading: false,
			pageOutGeometryEnabled: false
		};
		_extendObject(this.options, options);
		this.options.debug = {

			pageOutStart: .75,
			pageOutEnd: .50,
			pixelCullingEnable: false, // Not useful for 2D
			pixelCullingThreshold: WGS.PIXEL_CULLING_THRESHOLD
		};
		_extendObject(this.options.debug, options.debug);

		// Initialize members used by on demand loading
		var _pendingBuffers = [];
		var _pendingPromises = {};
		var _promiseQueue = [];
		var _pendingSize = 0;
		var _actualGeomSize = 0;
		var _lastBufferPending = -1;
		var _lastTraversed = -1;
		var _maxRequest = -1;
		var _canceled = 0;
		var _alternatePromise = true;
		var _bufferCount = 0;
		// Max size of a 2D buffer.
		var _maxBufferSize;
		if(_loader.useInstancing) {
			// If we are instancing, then everything is output as a quad, even triangles.
			// So we are limited by the max size the VertexBufferBuilder will allow.
			// When we are instancing the VertexBufferBuilder cuts the buffer size by 1/4.
			_maxBufferSize = ((zv.isMobileDevice() ? 16383 : 32767) / 4) | 0;
			// Don't use indices with instancing
			_maxBufferSize = _maxBufferSize * VERT_SIZE / MEGA;
		} else {
			// We can have polytris with 65535 verts Can only guess at the max index size,
			// since we don't get a stat for that so we guess an average of 6 indices per vert.
			_maxBufferSize = 65535 * (VERT_SIZE + INDEX_SIZE * 6) / MEGA;
		}
		var _finalFrame = false;
		var _culledGeom = [];

		// Need at least 10 MB to work
		this.options.limit = Math.max(this.options.limit, 10);
		this.options.debug.pageOutEnd = Math.min(this.options.debug.pageOutEnd, this.options.debug.pageOutStart);

		this.totalGeomSize = loader.totalGeomSize;

		// Viewer API - these methods are used by the viewer to handler
		// on demand loading and paging out geometry

		// Return true of false, whether on demand loading enabled.
		// This controls how the geometry buffers are going to load. 
		//
		// If false, then geometry buffers will load in sequence all at once.
		// if true, then only those geometry buffers that are request to render,
		//          can they start to load *on demand*
		this.onDemandLoadingEnabled = function() {
			return this.options.onDemandLoading;
		};

		this.pageOutGeometryEnabled = function() {
			return this.options.onDemandLoading;
		};

		this.pixelCullingEnable = function() {
			return this.options.debug.pixelCullingEnable;
		};

		this.pixelCullingThreshold = function() {
			return this.options.debug.pixelCullingThreshold;
		};

		/**
		 * Get the memory stats when using on demand loading.
		 * @returns {object|null} Object containing the limit and loaded memory usage for the model.
		 *                        Return null if the model isn't being loaded on demand.
		 */
		this.getMemoryInfo = function() {
			var geomSizeInMemory = 0;
			if(_loader.model) {
				var geoms = _loader.model.getGeometryList();
				if(geoms) {
					geomSizeInMemory = geoms.geomMemory / MEGA;
				}
			}

			return this.onDemandLoadingEnabled() ? {
				limit: this.options.limit,
				effectiveLimit: this.options.limit,
				loaded: geomSizeInMemory + _loader.fileMemorySize
			} : null;
		};

		function nextRenderRequest(nextReq) {
			while(++nextReq < _pendingBuffers.length) {
				// Continue until we find a buffer that is requested and not sent to the parser
				if((_pendingBuffers[nextReq] & (ANY_BUFFER_REQUEST | BUFFER_SENT_TO_PARSER)) == ANY_BUFFER_REQUEST)
					break;
			}
			return nextReq;
		}

		function scheduleMoreBuffers(options) {
			// request more buffers to draw.
			var geomSizeInMemory = 0;
			if(_loader.model) {
				var geoms = _loader.model.getGeometryList();
				if(geoms) {
					geomSizeInMemory = geoms.geomMemory / MEGA;
				}
			}

			// Schedule the geometry download. Alternate between promised buffers
			// and render buffers
			var nextReq = nextRenderRequest(_lastBufferPending);
			var currentMemSize = geomSizeInMemory + _loader.fileMemorySize + _maxBufferSize;
			while(currentMemSize + _pendingSize < options.limit) {
				// Find the next buffer to request. Alternate between promised buffers
				// and render buffer based on the last one requested.            
				var bufferId = -1;
				var promise = null;
				if(_promiseQueue.length > 0 && (_alternatePromise || nextReq > _pendingBuffers.length)) {
					// Get the promised buffer id and mark it as pending
					promise = _promiseQueue.shift();
					bufferId = promise.lmv_buffer_id;
					// Next time request a render buffer
					_alternatePromise == false;
				} else if(nextReq < _pendingBuffers.length) {
					// request a render buffer
					bufferId = nextReq;
					_lastBufferPending = nextReq;
					nextReq = nextRenderRequest(nextReq);
					_alternatePromise = true;
				} else
					break; // no more buffers to request

				// Request the next buffer. If this buffer was already sent to the
				// parser, then we make this request conditional.
				_loader.parsingWorker.doOperation({
					operation: WORKER_PARSE_F2D_FRAME,
					bufferId: bufferId,
					rendered: !!(_pendingBuffers[bufferId] & RENDER_BUFFER_REQUEST),
					promised: !!(_pendingBuffers[bufferId] & PROMISE_BUFFER_REQUEST),
					conditional: !!(_pendingBuffers[bufferId] & BUFFER_SENT_TO_PARSER)
				});
				if(!(_pendingBuffers[bufferId] & BUFFER_SENT_TO_PARSER)) {
					_pendingSize += _maxBufferSize;
					_pendingBuffers[bufferId] |= BUFFER_SENT_TO_PARSER;
				}
			}
		}

		this.loadPackFile = function(bufferId) {
			if(!this.onDemandLoadingEnabled())
				return false;

			// Request out of range
			if(bufferId < 0 || (_finalFrame && bufferId >= _bufferCount))
				return false;

			if(bufferId > _maxRequest)
				_maxRequest = bufferId;

			// If this buffer hasn't been requested for rendering, then check for
			// out of sequence ordering and mark it as requested.
			if(!(_pendingBuffers[bufferId] & RENDER_BUFFER_REQUEST)) {
				// reset if we get a request out of order
				if(bufferId <= _lastBufferPending)
					this.reset();
				// Mark as pending
				_pendingBuffers[bufferId] |= ANY_BUFFER_REQUEST | RENDER_BUFFER_REQUEST;
			}

			scheduleMoreBuffers(this.options);
			return true;
		};

		this.promisePackFile = function(bufferId) {
			if(!this.onDemandLoadingEnabled())
				return Promise.reject({
					reason: "Not supported"
				});

			// Request out of range
			if(bufferId < 0 || bufferId >= _bufferCount)
				return Promise.reject({
					reason: "Buffer id out of bounds"
				});

			// If this buffer hasn't been requested, then check for
			// out of sequence ordering and mark it as requested.
			var promise = _pendingPromises[bufferId];
			if(promise) {
				// We already have this buffer queue. We only keep one promise for
				// each buffer, so just return the one we already have
				scheduleMoreBuffers(this.options);
				return promise;
			}

			// Add to the pending promises. We do this carefully without making
			// any assumptions about when the argument to the Promise constructor,
			// might get called or when the buffer might be loaded.
			var lmv_resolve;
			var lmv_reject;
			// Create the promise, we keep the promise and the resolve and
			// reject functions in a state object, so we can separate the
			// download scheduler from the promise
			promise = new Promise(function(resolve, reject) {
				lmv_resolve = resolve;
				lmv_reject = reject;
			});

			// Add some properties to the promise, so we can download
			// the buffer, and resolve or reject the promise.
			promise.lmv_resolve = lmv_resolve;
			promise.lmv_reject = lmv_reject;
			promise.lmv_buffer_id = bufferId;

			// Put the promise in the pending promises list, and the
			// pending buffers. The pending promises list allows promised
			// geometry to run out of order.
			_promiseQueue.push(promise);
			_pendingPromises[bufferId] = promise;
			_pendingBuffers[bufferId] |= ANY_BUFFER_REQUEST | PROMISE_BUFFER_REQUEST;

			// schedule more buffers, if we can
			scheduleMoreBuffers(this.options);
			return promise;
		};

		this.cancelPromisedPackFile = function(promise) {
			// Not one of mine.
			if(!promise || !promise.hasOwnProperty("lmv_buffer_id") ||
				_pendingPromises[promise.lmv_buffer_id] != promise)
				return false;

			// Remove the promise, and reject it.
			var index = _promiseQueue.indexOf(promise);
			if(index >= 0)
				_promiseQueue.splice(index, 1);
			// Cancel it in the parser, if it has been requested
			var flags = _pendingBuffers[promise.lmv_buffer_id];
			if(flags & BUFFER_SENT_TO_PARSER) {
				_loader.parsingWorker.doOperation({
					operation: WORKER_PARSE_F2D_FRAME,
					cancelPromise: promise.lmv_buffer_id
				});
				if(!(flags & RENDER_BUFFER_REQUEST))
					_pendingSize -= _maxBufferSize;
			}
			if(flags & RENDER_BUFFER_REQUEST)
				flags &= ~PROMISE_BUFFER_REQUEST;
			else
				flags = 0;
			_pendingBuffers[promise.lmv_buffer_id] = flags;
			delete _pendingPromises[promise.lmv_buffer_id];
			if(promise.lmv_reject)
				promise.lmv_reject({
					canceled: true
				});

			// Schedule more buffers if we can.
			scheduleMoreBuffers(this.options);
			return true;
		};

		this.resetIterator = function( /*camera, resetType*/ ) {};

		this.reset = function() {
			// we need to cancel the parsing worker.
			_loader.parsingWorker.doOperation({
				operation: WORKER_PARSE_F2D_FRAME,
				cancel: true
			});
			_pendingSize = 0;
			for(var i = 0; i < _pendingBuffers.length; ++i) {
				// Clear render request if buffer is promised.
				// Otherwise we can clear everything.
				if(_pendingBuffers[i] & PROMISE_BUFFER_REQUEST) {
					_pendingBuffers[i] &= ~RENDER_BUFFER_REQUEST;
					if(_pendingBuffers[i] & BUFFER_SENT_TO_PARSER)
						_pendingSize += _maxBufferSize;
				} else
					_pendingBuffers[i] = 0;
			}
			this.lastPageOut = -1;
			_lastBufferPending = -1;
			_lastTraversed = -1;
			_culledGeom.length = 0;
			_maxRequest = _bufferCount - 1;
			++_canceled;
		};

		this.addGeomPackMissingLastFrame = function( /*packId*/ ) {
			return true; // Shouldn't be called
		};

		this.needResumeNextFrame = function() {
			return false;
		};

		this.pageOut = function(iterationDone, forcePageOut) {
			var geomList = _loader.model.getGeometryList();
			// If over the limit, start page out
			var size = geomList.geomMemory / MEGA + _loader.fileMemorySize;
			// Make sure we page out enough to load a new buffer
			var pageOutStart = Math.min(this.options.debug.pageOutStart * this.options.limit,
				this.options.limit - 1.1 * _maxBufferSize);
			var pageOutEnd = Math.min(this.options.debug.pageOutEnd * this.options.limit, pageOutStart);
			if(size > pageOutStart) {
				var i = 0; // tmp (see below)

				// Goal is to page out to limit - limit * percent
				var remaining = size - pageOutEnd;

				// Step 1: Remove untraversed geometries first
				while(i < _culledGeom.length && remaining > 0) {
					// remove culled geom
					remaining -= geomList.removeGeometry(_culledGeom[i++], _loader.zuv3DImpl.glrenderer()) / MEGA;
				}
				_culledGeom.splice(0, i);

				// Step 2: If not enough, continue to remove geometries aren't about to be traversed.
				for(i = geomList.geoms.length; --i > 0 && remaining > 0;) {
					if(i <= _lastTraversed || i > _lastBufferPending)
						remaining -= geomList.removeGeometry(i, _loader.zuv3DImpl.glrenderer()) / MEGA;
				}

				// Step 3: If existing geometries are still over the limitation, and force page out enabled,
				//         run through the whole list and page out as much as needed.
				if(forcePageOut) {
					remaining = geomList.geomMemory / MEGA - pageOutStart;
					for(i = _lastBufferPending; i > 0 && remaining > 0; --i) {
						remaining -= geomList.removeGeometry(i, _loader.zuv3DImpl.glrenderer()) / MEGA;
					}
					//THREE.log("[On Demand Loading] A force page out occur. ");
				}
				this.lastPageOut = size - geomList.geomMemory / MEGA;

				// When starting chrome with this JS flag: --js-flags="--expose-gc", then window.gc is defined and
				// can be used for doing a force GC. This is useful for testing purpose.
				if(window && window.gc) {
					window.gc();
				}
			}

			// If the iterator is finished and the file is still loading then
			// we request more buffers. This how buffers initially get loaded
			var newSize = geomList.geomMemory / MEGA;
			if(iterationDone && !_finalFrame) {
				var bufferSize = this.options.limit - newSize;
				if(bufferSize > 0) {
					var bufferId = _lastBufferPending;
					while((bufferSize -= _maxBufferSize) >= 0)
						this.loadPackFile(++bufferId);
				}
			}

			return WGS.PAGEOUT_SUCCESS;
		};

		this.onGeomTraversed = function(geometry) {
			// TODO Paging: refactor this to the proxy object of 2d loader.
			//              2d doesn't have multiple instance geometry, so 
			//              just record it as traversed.
			_lastTraversed = geometry.esdid - 1;
		};

		this.onGeomCulled = function(geometry) {
			// TODO Paging: refactor this to the proxy object of 2d loader.
			if(this.onDemandLoadingEnabled() && geometry) {
				_culledGeom.push(geometry.esdid - 1);
			}
		};

		this.onMeshReceived = function(mesh, mindex) {
			// Accept all meshes if not on demand loading
			if(!this.onDemandLoadingEnabled())
				return true;

			// If this buffer was promised, then signal that it is loaded
			// We will do this even if we are canceling render requests.
			var promise = _pendingPromises[mindex];
			if(promise) {
				// Signal that we loaded the buffer
				if(promise.lmv_resolve)
					promise.lmv_resolve();
				// delete the requests from the pending promises and the promise queue
				delete _pendingPromises[mindex];
				var index = _promiseQueue.indexOf(promise);
				if(index >= 0)
					_promiseQueue.splice(index, 1);
			}

			// If on demand loading don't process any meshes that aren't requested
			// Buffers can get queued after canceling all of the meshes, but promises aren't canceled
			if(!(_pendingBuffers[mindex] & BUFFER_SENT_TO_PARSER) ||
				(_canceled != 0 && !(_pendingBuffers[mindex] & PROMISE_BUFFER_REQUEST))) {
				return false;
			}

			// Keep track of the buffer count
			if(mindex >= _bufferCount) {
				_bufferCount = mindex + 1;
				_actualGeomSize += mesh.vb.byteLength + mesh.indices.byteLength + WGS.GEOMETRY_OVERHEAD;
			}

			// If on demand loading then we need to invalidate for each render mesh
			// is loaded to insure that the visibility flags are correctly updated.
			if(_pendingBuffers[mindex] & RENDER_BUFFER_REQUEST)
				_loader.zuv3DImpl.invalidate(false, true);

			// Keep track of pending buffers
			_pendingBuffers[mindex] = 0;
			_pendingSize -= _maxBufferSize;
			return true;
		};

		this.onFinalFrame = function() {
			// When we are done, reset
			if(this.onDemandLoadingEnabled()) {
				if(!_finalFrame)
					this.totalGeomSize = _actualGeomSize / MEGA + _loader.fileMemorySize;
				_finalFrame = true;
				_pendingBuffers.splice(_bufferCount, _pendingBuffers.length).forEach(function(pending) {
					if(pending & BUFFER_SENT_TO_PARSER)
						_pendingSize -= _maxBufferSize;
				});
			}
		};

		this.preparedPackFilesSize = function() {
			return _loader.fileMemorySize + _pendingSize +
				_loader.model.getGeometryList().geomMemory / MEGA;
		};

		this.cancelAcknowledged = function() {
			--_canceled;
		};
	};

	/** @constructor */
	function F2DLoader(delegate, config) {
		this.zuv3DImpl = delegate.zuv3DImpl;
		this.delegate = WGS.FileLoader.copyDelegate(this, delegate);
		this.loading = false;
		this.tmpMatrix = new THREE.Matrix4();

		this.logger = zvp.logger;
		this.loadTime = 0;
		this.useInstancing = this.zuv3DImpl.use2dInstancing;
	}

	F2DLoader.prototype.transferToDelegate = function(delegate) {
		// If loader dtor has been called, return
		if(this.delegate == null) {
			console.warn("Cannot transfer destroyed loader to new delegate");
			return false;
		}
		this.zuv3DImpl = delegate.zuv3DImpl;
		this.delegate = WGS.FileLoader.copyDelegate(this, delegate);
		// Also transfer the property Db loader if we have one.
		if(this.model && this.model.getData() && this.model.getData().propDbLoader) {
			this.model.getData().propDbLoader.transferToDelegate(this.delegate);
		}
		return true;
	};

	F2DLoader.prototype.dtor = function() {
		// Cancel all potential process on loading a file.

		// 1. init worker script can be cancelled. 
		// 
		if(this.initWorkerScriptToken) {
			this.initWorkerScriptToken.cancel();
			this.initWorkerScriptToken = null;
			zvp.logger.debug("F2D loader dtor: on init worker script.");
		}

		// 2. Streaming F2D data can be cancelled. 
		if(this.streamingWorker) {
			this.streamingWorker.terminate();
			this.streamingWorker = null;
			zvp.logger.debug("F2D loader dtor: on streaming worker.");
		}

		// 3. Parsing F2D geometry can be cancelled.
		if(this.parsingWorker) {
			this.parsingWorker.terminate();
			this.parsingWorker = null;
			zvp.logger.debug("F2D loader dtor: on parsing worker.");
		}

		// 4. Property loading can be cancelled.
		if(this.esd && this.esd.propDbLoader) {
			this.esd.propDbLoader.dtor();
			this.esd.propDbLoader = null;
		}

		// And clear metadata.
		this.zuv3DImpl = null;
		this.loading = false;
		this.tmpMatrix = null;
		this.logger = null;
		this.loadTime = 0;

		this.esd = null;
		this.options = null;
		this.pagingProxy = null;
	};

	F2DLoader.prototype.isValid = function() {
		return this.zuv3DImpl != null;
	};

	F2DLoader.prototype.loadFile = function(path, options, onDone, onWorkerStart) {
		if(!this.zuv3DImpl) {
			zvp.logger.log("F2D loader was already destructed. So no longer usable.");
			return false;
		}

		if(this.loading) {
			zvp.logger.log("Loading of F2D already in progress. Ignoring new request.");
			return false;
		}

		// Mark it as loading now.
		this.loading = true;
		this.zuv3DImpl._addLoadingFile(this);

		var index = path.indexOf('urn:');
		if(index != -1) {
			// Extract urn:zu.viewing:foo.bar.whateverjunks out of the path URL and bind it to logger.
			// From now on, we can send logs to viewing service, and logs are grouped by urn to make Splunk work.
			path = decodeURIComponent(path);
			var urn = path.substr(index, path.substr(index).indexOf('/'));
			zvp.logger.log("Extracted URN: " + urn);

			// Extract urn(just base64 code)
			var _index = urn.lastIndexOf(':');
			this.esdUrn = urn.substr(_index + 1);
		} else {
			this.esdUrn = path;
		}

		this.sharedDbPath = options.sharedPropertyDbPath;
		this.currentLoadPath = path;
		this.acmSessionId = options.acmSessionId;

		this.queryParams = "";
		if(this.acmSessionId) {
			this.queryParams = "acmsession=" + this.acmSessionId;
		}

		this.options = options;

		if(this.options.placementTransform) {
			//NOTE: The scale of the placement transform is not always sufficient to
			//determine the correct scale for line widths. This is because when a 2D model (in inches) is
			//loaded into a 3d scene in feet, the transform includes all the scaling needed to get into feet
			//but the model space line weight for the drawing is relative to the drawing itself, so an extra
			//factor of 12 would be needed in such case to cancel out the 1/12 needed for inch->foot.
			//This could probably be automatically derived, but in an error prone way, so I'm leaving it
			//up to the application layer that does the model aggregation to pass in the right model scale as an option.
			this.modelScale = this.options.modelScale || this.options.placementTransform.getMaxScaleOnAxis();
		} else {
			this.modelScale = this.options.modelScale || 1;
		}

		this.isf2d = true;
		var scope = this;

		zvp.processMemoryOptions(this.zuv3DImpl.api.config);
		var memSrcOpts = this.zuv3DImpl.api.config && this.zuv3DImpl.api.config.memory;
		var memoryOpts = this.memoryOpts = {
			onDemandLoading: false,
			debug: {}
		};
		if(memSrcOpts) {
			if(memSrcOpts.hasOwnProperty("limit")) {
				memoryOpts.limit = memSrcOpts.limit;
				memoryOpts.onDemandLoading = true;
				WGS.memoryOptimizedLoading = true; // Required for on demand loading
				memoryOpts.pageOutGeometryEnabled = true;
			}
			memoryOpts.debug = memSrcOpts.debug || {};
		}

		this.initWorkerScriptToken = this.delegate.workerScript.initWorkerScript(function() {
			scope.loadFydoCB(path, options, onDone, onWorkerStart);
		});

		return true;
	};

	var _fragLoadedEvent = {
		fragIds: []
	};

	function fireFragmentsLoadedEvent(loader, data) {
		function getFragIds() {
			if(this.fragIds)
				return fragIds;

			var rm = this.model;
			if(!rm || !this.data || !this.data.meshes)
				return null;

			var fragIds = this.fragIds = [];

			var meshIndex = this.data.baseIndex | 0;
			for(var i = 0; i < this.data.meshes.length; ++i)
				fragIds.push(meshIndex++);

			return fragIds;
		};

		loader.zuv3DImpl.api.dispatchEvent({
			type: zv.FRAGMENTS_LOADED_EVENT,
			model: loader.model,
			getFragIds: getFragIds,
			data: data,
		});
	};

	F2DLoader.prototype.loadFydoCB = function(path, options, onDone, onWorkerStart) {
		this.t0 = Date.now();

		var esdPath = WGS.pathToURL(path);

		// Streaming worker as data producer that generates fydo frame streams.
		this.streamingWorker = this.delegate.workerScript.createWorker();
		// Parsing worker as data consumer that consumes fydo frame streams and generate meshes.
		this.parsingWorker = this.delegate.workerScript.createWorker();
		var scope = this;
		var first = true;

		var terminateParser = function() {
			// The parse worker is only terminated when the loader is destroyed when we
			// are doing on demand loading. It is needed to supply buffers on demand.
			if(!scope.memoryOpts.onDemandLoading) {
				scope.parsingWorker.terminate();
				scope.parsingWorker = null;
			}
		};

		var onStream = function(ew) {

			if(!scope.isValid()) {
				return;
			}

			// Determine whether the current model should use on demand loading.
			// This can only be calculated after the metadata is read. We estimate
			// the number of vertex buffers we need to hold the data and turn it on
			// if there are too many.
			var shouldLoadOnDemand = function(metadata) {
				if(metadata) {
					var stats = metadata.geom_metrics;
					// Start counting segments, because most things are done as segments
					var verts = (stats.arcs + stats.circ_arcs) * 3; // 3 segments for arcs - 1 for the arc and 2 for caps
					verts += stats.circles; // 1 segment for a circle
					verts += (stats.pline_points - (stats.plines || 0)); // 1 segment for each line segment, stats.plines not always present
					verts += stats.rasters; // 1 segment for each raster
					verts += (stats.ptri_indices / 3) * 3; // max 3 per triangle for antialiased edges
					var indices;
					// Need to keep this in sync with the F2D parser in lmvtk.
					var vertsPerBuffer = zvp.isMobileDevice ? 16383 : 32767;
					if(scope.useInstancing) {
						// Triangles get one vertex when instanced
						verts += stats.ptri_indices / 3;
						indices = 0; // Don't use indices with instancing
						vertsPerBuffer /= 4;
					} else {
						indices = verts * 6 + stats.ptri_indices;
						verts *= 4;
						verts += stats.ptri_points; // verts in poly triangles
					}
					// Calculate memory needed in MB
					var memNeeded = (verts * (VERT_SIZE + WGS.GEOMETRY_OVERHEAD / vertsPerBuffer) + indices * INDEX_SIZE) / MEGA + scope.fileMemorySize;
					// TODO: get this from the loader
					var memoryOpts = scope.memoryOpts;
					if(memoryOpts.onDemandLoading && !memoryOpts.debug.force &&
						memNeeded < memoryOpts.limit) {
						memoryOpts.onDemandLoading = false;
						memoryOpts.pageOutGeometryEnabled = false;
					}
					scope.totalGeomSize = memNeeded;
				}
				return scope.memoryOpts.onDemandLoading;
			};

			if(first && onWorkerStart) {
				first = false;
				onWorkerStart();
			}

			var msg;
			if(ew.data && ew.data.type == "F2DBLOB") {
				if(ew.data.hasOwnProperty("f2dSize"))
					scope.fileMemorySize = ew.data.f2dSize / MEGA;
				shouldLoadOnDemand(ew.data.metadata);
				msg = {
					operation: WORKER_PARSE_F2D,
					data: ew.data.buffer,
					metadata: ew.data.metadata,
					manifest: ew.data.manifest,
					basePath: ew.data.basePath,
					f2dLoadOptions: {
						modelSpace: options.modelSpace,
						bgColor: options.bgColor,
						isMobile: zv.isMobileDevice(),
						useInstancing: scope.useInstancing,
						onDemandLoading: scope.memoryOpts.onDemandLoading
					},
					url: esdPath
				};
				scope.parsingWorker.doOperation(msg, [msg.data]);
				scope.streamingWorker.terminate();
				scope.streamingWorker = null;

			} else if(ew.data && ew.data.type == "F2DSTREAM") {
				// If we are streaming the file, then we need twice the
				// files size, because the stream worker and the parse
				// worker will keep a copy, until the stream worker is done
				if(ew.data.hasOwnProperty("f2dSize"))
					scope.fileMemorySize = 2 * ew.data.f2dSize / MEGA;
				shouldLoadOnDemand(ew.data.metadata);
				msg = {
					operation: WORKER_PARSE_F2D_FRAME,
					data: ew.data.frames,
					url: esdPath,
					f2dLoadOptions: {
						modelSpace: options.modelSpace,
						bgColor: options.bgColor,
						isMobile: zv.isMobileDevice(),
						useInstancing: scope.useInstancing,
						onDemandLoading: scope.memoryOpts.onDemandLoading
					}
				};

				//first frame
				if(ew.data.metadata) {
					msg.metadata = ew.data.metadata;
					msg.manifest = ew.data.manifest;
				}

				//last frame?
				if(ew.data.finalFrame) {
					msg.finalFrame = true;
					scope.streamingWorker.terminate();
					scope.streamingWorker = null;
					scope.fileMemorySize /= 2; // Only one copy of the file now
				}

				if(ew.data.progress)
					scope.zuv3DImpl.signalProgress(100 * ew.data.progress, zv.ProgressState.LOADING);

				scope.parsingWorker.doOperation(msg, msg.data ? [msg.data] : undefined);

			} else if(ew.data && ew.data.type == "F2DAssetURL") {
				zvp.assets = zvp.assets.concat(ew.data.urls);
			} else if(ew.data && ew.data.assetRequest) {
				zvp.assets.push(ew.data.assetRequest);
			} else if(ew.data && ew.data.progress) {
				//just ignore progress-only message, it's only needed by the initial worker start notification above
			} else if(ew.data && ew.data.debug) {
				zvp.logger.debug(ew.data.message);
			} else if(ew.data && ew.data.error) {
				scope.loading = false;
				scope.streamingWorker.terminate();
				scope.streamingWorker = null;
				if(onDone)
					onDone.call(this, ew.data.error);
			} else {
				zvp.logger.error("F2D download failed.", zv.errorCodeString(zv.ErrorCodes.NETWORK_FAILURE));
				scope.loading = false;
				scope.streamingWorker.terminate();
				scope.streamingWorker = null;
			}
		};

		var onParse = function(ew) {

			if(!scope.isValid()) {
				return;
			}

			if(first && onWorkerStart) {
				first = false;
				onWorkerStart();
			}

			var f, i;
			if(ew.data && ew.data.f2d) {
				f = scope.esd = ew.data.f2d;

				terminateParser();

				zvp.logger.info("Num polylines: " + f.numPolylines);
				zvp.logger.info("Line segments: " + f.numLineSegs);
				zvp.logger.info("Circular arcs: " + f.numCircles);
				zvp.logger.info("Ellipitcal arcs:" + f.numEllipses);
				zvp.logger.info("Plain triangles:" + f.numTriangles);
				zvp.logger.info("Total # of op codes generated by fydo.parse: " + f.opCount);

				scope.onModelRootLoadDone(scope.esd);

				if(onDone)
					onDone(null, scope.model);

				scope.zuv3DImpl.api.dispatchEvent({
					type: zv.MODEL_ROOT_LOADED_EVENT,
					esd: scope.esd,
					model: scope.model
				});

				for(i = 0; i < f.meshes.length; i++) {
					scope.processReceivedMesh2D(f.meshes[i], i);
				}

				f.meshes = null;

				scope.onGeomLoadDone();

				scope.loading = false;

			} else if(ew.data && ew.data.f2dframe) {
				var baseIndex = 0;

				if(!ew.data.meshes) {
					//First message from the worker
					scope.esd = ew.data.f2dframe;
					baseIndex = ew.data.baseIndex;
				} else {
					//Update the world box and current mesh index
					//on subsequent messages from the worker.
					var bbox = ew.data.bbox;
					scope.esd.bbox = new THREE.Box3(bbox.min, bbox.max);
					baseIndex = ew.data.baseIndex;
				}

				f = scope.esd;

				if(!f.fragments || !f.fragments.initialized) {
					//First message from the worker,
					//initialize the load states, fragment lists, etc.
					scope.onModelRootLoadDone(f);

					if(onDone) {
						onDone(null, scope.model);
					}
					scope.zuv3DImpl.api.dispatchEvent({
						type: zv.MODEL_ROOT_LOADED_EVENT,
						esd: f,
						model: scope.model
					});

				}

				if(ew.data.meshes && ew.data.meshes.length) {
					for(i = 0; i < ew.data.meshes.length; i++) {
						scope.processReceivedMesh2D(ew.data.meshes[i], baseIndex + i);
					}

					if(scope.pagingProxy && scope.pagingProxy.onDemandLoadingEnabled())
						fireFragmentsLoadedEvent(scope, ew.data);
				}

				if(ew.data.finalFrame) {
					//Update the F2D properties which are accumulated
					//while reading the F2D stream.
					var cumulativeProps = ew.data.cumulativeProps;
					for(var p in cumulativeProps) {
						f[p] = cumulativeProps[p];
					}

					terminateParser();

					scope.onGeomLoadDone();

					scope.loading = false;

					if(scope.pagingProxy)
						scope.pagingProxy.onFinalFrame();
				}

			} else if(ew.data && ew.data.progress) {
				//just ignore progress-only message, it's only needed by the initial worker start notification above
			} else if(ew.data && ew.data.debug) {
				zvp.logger.debug(ew.data.message);
			} else if(ew.data && ew.data.canceled && scope.pagingProxy) {
				scope.pagingProxy.cancelAcknowledged();
			} else if(ew.data && ew.data.error) {
				scope.loading = false;
				terminateParser();

				zvp.logger.error("Error while processing F2d: " + JSON.stringify(ew.data.error.args));

				if(onDone)
					onDone.call(this, ew.data.error);
			} else {
				zvp.logger.error("F2D download failed.", zv.errorCodeString(zv.ErrorCodes.NETWORK_FAILURE));
				//Download failed.
				scope.loading = false;
				terminateParser();
			}
		};

		this.streamingWorker.addEventListener('message', onStream, false);
		this.parsingWorker.addEventListener('message', onParse, false);

		var msg = {
			operation: WORKER_STREAM_F2D,
			url: esdPath,
			objectIds: options.ids,
			queryParams: this.queryParams
		}; // For CORS caching issue.

		this.streamingWorker.doOperation(zvp.initLoadContext(msg));

		return true;
	};

	F2DLoader.prototype.processReceivedMesh = function(mdata) {

		//Find all fragments that instance this mesh
		var meshid = mdata.packId + ":" + mdata.meshIndex;

		var esd = this.esd;
		var fragments = esd.fragments;

		var fragIndexes = fragments.mesh2frag[meshid];
		if(fragIndexes === undefined) {
			zvp.logger.warn("Mesh " + meshid + " was not referenced by any fragments.");
			return;
		}
		if(!Array.isArray(fragIndexes))
			fragIndexes = [fragIndexes];

		//Convert the received mesh to THREE buffer geometry
		zvp.BufferGeometryUtils.meshToGeometry(mdata);

		var numInstances = fragIndexes.length;

		var rm = this.model;

		//Reuse previous index of this geometry, if available
		rm.getGeometryList().addGeometry(mdata.geometry, numInstances, mdata.meshIndex + 1);

		var ib = mdata.geometry.attributes['index'].array || mdata.geometry.ib;
		var polyCount = ib.length / 3;

		//For each fragment, add a mesh instance to the renderer
		for(var i = 0; i < fragIndexes.length; i++) {
			var fragId = 0 | fragIndexes[i];

			//We get the matrix from the fragments and we set it back there
			//with the activateFragment call, but this is to maintain the
			//ability to add a plain THREE.Mesh -- otherwise it could be simpler
			rm.getFragmentList().getOriginalWorldMatrix(fragId, this.tmpMatrix);

			if(this.options.placementTransform) {
				this.tmpMatrix = new THREE.Matrix4().multiplyMatrices(this.options.placementTransform, this.tmpMatrix);
			}

			var materialId = fragments.materials[fragId].toString();

			if(fragments.polygonCounts)
				fragments.polygonCounts[fragId] = polyCount;

			var m = this.zuv3DImpl.setupMesh(this.model, mdata.geometry, materialId, this.tmpMatrix);
			rm.activateFragment(fragId, m);
		}

		//don't need this mapping anymore.
		fragments.mesh2frag[meshid] = null;

		//Repaint and progress reporting
		fragments.numLoaded += fragIndexes.length;

		fragments.numLoaded;
	};

	F2DLoader.prototype.processReceivedMesh2D = function(mesh, mindex) {

		if(this.pagingProxy && !this.pagingProxy.onMeshReceived(mesh, mindex))
			return;

		var mdata = {
			mesh: mesh,
			is2d: true,
			packId: "0",
			meshIndex: mindex
		};

		var meshId = "0:" + mindex;

		var frags = this.esd.fragments;

		// Only process the dbids the first time we process the fragment
		if(!frags.fragId2dbId[mindex]) {
			//Remember the list of all dbIds referenced by this mesh.
			//In the 2D case this is 1->many (1 frag = many dbIds) mapping instead of
			// 1 dbId -> many fragments like in the SVF 3D case.
			var dbIds = Object.keys(mdata.mesh.dbIds).map(function(item) {
				return parseInt(item);
			});
			frags.fragId2dbId[mindex] = dbIds;

			//TODO: dbId2fragId is not really necessary if we have a good instance tree for the 2D drawing (e.g. Revit, AutoCAD)
			//so we can get rid of this mapping if we can convert Viewer3DImpl.highlightFragment to use the same logic for 2D as for 3D.
			for(var j = 0; j < dbIds.length; j++) {
				var dbId = dbIds[j];
				var fragIds = frags.dbId2fragId[dbId];
				if(Array.isArray(fragIds))
					fragIds.push(mindex);
				else if(typeof fragIds !== "undefined") {
					frags.dbId2fragId[dbId] = [fragIds, mindex];
				} else {
					frags.dbId2fragId[dbId] = mindex;
				}
			}

			mesh.material.modelScale = this.modelScale;
			var viewer = this.zuv3DImpl;
			frags.materials[mindex] = this.zuv3DImpl.matman().create2DMaterial(this.model, mesh.material, false, false, function() {
				viewer.invalidate(false, true, false);
			});

			frags.length++;
		}
		frags.mesh2frag[meshId] = mindex;

		this.processReceivedMesh(mdata);

	};

	F2DLoader.prototype.onModelRootLoadDone = function(esd) {

		//In the 2d case we create and build up the fragments mapping
		//on the receiving end.
		esd.fragments = {};
		esd.fragments.mesh2frag = {};
		esd.fragments.materials = [];
		esd.fragments.fragId2dbId = [];
		esd.fragments.dbId2fragId = [];
		esd.fragments.length = 0;
		esd.fragments.initialized = true;

		esd.geomMemory = 0;
		esd.fragments.numLoaded = 0;
		esd.gpuNumMeshes = 0;
		esd.gpuMeshMemory = 0;

		esd.nextRepaintPolys = 10000;
		esd.numRepaints = 0;

		esd.urn = this.esdUrn;
		esd.acmSessionId = this.acmSessionId;

		esd.basePath = "";
		var lastSlash = this.currentLoadPath.lastIndexOf("/");
		if(lastSlash != -1)
			esd.basePath = this.currentLoadPath.substr(0, lastSlash + 1);

		esd.loadOptions = this.options;

		var t1 = Date.now();
		this.loadTime += t1 - this.t0;
		zvp.logger.log("SVF load: " + (t1 - this.t0));

		this.t0 = t1;

		//The BBox object loses knowledge of its
		//type when going across the worker thread boundary...
		esd.bbox = new THREE.Box3().copy(esd.bbox);

		//Create the API Model object and its render proxy
		var model = this.model = new zv.Model(esd);
		model.loader = this;

		// Let's set the options through for each model that control how memory saving mode start,
		// which decide how to load geometry pack files, and whether paging out if needed.
		// And assume the performance tuning options passed through viewer's config.
		var memoryOpts = this.memoryOpts;

		// So, for now do not support on paging for multiple models. 
		if(this.zuv3DImpl.modelQueue().getModels().length > 0) {
			// If already a model loaded into viewer, then disable paging for the other ones.
			memoryOpts.pageOutGeometryEnabled = false;
		}

		if(memoryOpts.onDemandLoading)
			this.pagingProxy = new F2DPagingProxy(this, memoryOpts);

		model.initialize(this.pagingProxy);

		//We would not load property db when we are on mobile device AND on demand loading is on (which
		//implies the model is not 'normal' in terms of its size.). This is only a temp solution that
		//allow big models loads on mobile without crash. Without property db loading selection could break.
		var shouldLoadPropertyDb = !(this.model.getFragmentList().onDemandLoadingEnabled() && (zv.isMobileDevice()));
		if(shouldLoadPropertyDb && !this.options.skipPropertyDb) {
			this.esd.propDbLoader = new WGS.PropDbLoader(this.sharedDbPath, this.model, this.delegate);
		}

		zvp.logger.log("scene bounds: " + JSON.stringify(esd.bbox));

		var metadataStats = {
			category: "metadata_load_stats",
			urn: esd.urn,
			layers: esd.layerCount
		};
		zvp.logger.track(metadataStats);

		this.zuv3DImpl.signalProgress(5, zv.ProgressState.ROOT_LOADED);
		this.zuv3DImpl.invalidate(false, false);
	};

	F2DLoader.prototype.onGeomLoadDone = function() {
		this.esd.loadDone = true;

		// Don't need these anymore
		this.esd.fragments.entityIndexes = null;
		if(!this.memoryOpts.onDemandLoading)
			this.esd.fragments.mesh2frag = null;

		var t1 = Date.now();
		var msg = "Fragments load time: " + (t1 - this.t0);
		this.loadTime += t1 - this.t0;

		//Load the property database after all geometry is loaded (2D case). For 2D,
		//the fragId->dbId mapping is only fully known once geometry is loaded, as
		//it's built on the fly.
		//TODO: As an optimization we can split the property db logic into two calls -- one to load the files
		//in parallel with the geometry and a second to do the processing.
		if(!this.options.skipPropertyDb)
			this.loadPropertyDb();

		zvp.logger.log(msg);

		var modelStats = {
			category: "model_load_stats",
			is_f2d: true,
			has_prism: this.zuv3DImpl.matman().hasPrism,
			load_time: this.loadTime,
			geometry_size: this.model.getGeometryList().geomMemory,
			meshes_count: this.model.getGeometryList().geoms.length,
			urn: this.esdUrn
		};
		zvp.logger.track(modelStats, true);

		function sendMessage(data) {
			if(zv.isBrowser) {
				var handler = window.webkit.messageHandlers.callbackHandler;
				if(!handler) {
					return;
				}

				// We add doOperation() function, but on some implementation
				// of the WebWorker, setting a new property on it is not allowed
				// so we fallback onto the wrapped function

				// The post message operation has to be called on the instance of handler.
				if(handler.doOperation) {
					handler.doOperation({
						'command': 'assets',
						data: data
					});
				} else if(handler.postMessage) {
					handler.postMessage({
						'command': 'assets',
						data: data
					});
				}

			}
		}

		if(zvp.assets) {
			// Callback to ios.
			if(zv.isBrowser && window.webkit) {
				sendMessage(zvp.assets);
				zvp.assets = null;
			}
		}

		this.currentLoadPath = null;
		this.isf2d = undefined;

		this.memoryOpts.onDemandLoading ? this.zuv3DImpl.onDemandLoadComplete(this.model) : this.zuv3DImpl.onLoadComplete(this.model);
	};

	F2DLoader.prototype.loadPropertyDb = function() {
		if(this.esd.propDbLoader)
			this.esd.propDbLoader.load();
	};

	F2DLoader.prototype.is3d = function() {
		return false;
	};

	zvp.F2DLoader = F2DLoader;
	zvp.F2DPagingProxy = F2DPagingProxy;

	zv.FileLoaderManager.registerFileLoader("f2d", ["f2d"], zvp.F2DLoader);

})();;
/*
 * ScalarisLoader
 *
 * Loads scalaris files. It is trigger by loading a file with .scalaris extension or by specifying the default file type
 * in the options to loadModel() method.
 *
 * For detailed information on Scalaris Data Model (â€œneutral format for Simulation & Forgeâ€), refer to the following links:
 * - https://wiki.zhiutech.com/display/NFDC/Scalaris+for+ZhiUTech+Generative+Design
 * - https://wiki.zhiutech.com/pages/viewpage.action?spaceKey=MPGART&title=Project+Scalaris
 * - https://pages.git.zhiutech.com/dmg-nfdc/ScalarisDataModel/documentation.html
 * - https://git.zhiutech.com/MPGART/Scalaris
 *
 * Authors: Parviz Rushenas (Parviz.Rushenas@zhiutech.com) & Ania Lipka (Ania.Lipka@zhiutech.com)
 */
(function() {

	"use strict";

	var WORKER_LOAD_SCALARIS = "LOAD_SCALARIS";
	var SCALARIS_PROTO_LOCATION = "res/protobuf/scalaris.proto";
	var MODEL_UNITS = "meter";
	var ROOT_NODE_NAME = "RootNode";
	var GEOMETRY_NODE_NAME = "Geometry";

	var scalarisLoader = function(delegate, config) {
		this.zuv3DImpl = delegate.zuv3DImpl;
		this.delegate = WGS.FileLoader.copyDelegate(this, delegate);
		this.loading = false;
	};

	scalarisLoader.prototype.transferToDelegate = function(delegate) {
		// If loader dtor has been called, return
		if(this.delegate == null) {
			console.warn("Cannot transfer destroyed loader to new delegate");
			return false;
		}
		this.zuv3DImpl = delegate.zuv3DImpl;
		this.delegate = WGS.FileLoader.copyDelegate(this, delegate);
		// Also transfer the property Db loader if we have one.
		if(this.model && this.model.getData() && this.model.getData().propDbLoader) {
			this.model.getData().propDbLoader.transferToDelegate(this.delegate);
		}
		return true;
	};

	scalarisLoader.prototype.dtor = function() {
		this.zuv3DImpl = null;
		this.model = null;
		this.esd = null;
		this.logger = null;
		this.loading = false;
	};

	scalarisLoader.prototype.isValid = function() {
		return this.zuv3DImpl != null;
	};

	scalarisLoader.prototype.loadFile = function(path, options, onDone, onWorkerStart) {
		if(!this.zuv3DImpl) {
			zvp.logger.log("Scalaris loader was already destructed. So no longer usable.");
			return false;
		}

		if(this.loading) {
			zvp.logger.log("Loading of Scalaris already in progress. Ignoring new request.");
			return false;
		}

		this.loading = true;
		this.zuv3DImpl._addLoadingFile(this);

		this.currentLoadPath = path;
		var basePath = "";
		var lastSlash = this.currentLoadPath.lastIndexOf("/");
		if(lastSlash != -1)
			basePath = this.currentLoadPath.substr(0, lastSlash + 1);
		this.basePath = basePath;

		this.options = options;
		this.options.debug = {};
		this.options.preserveView = true; // to preserve the view set by setViewCube

		var scope = this;

		this.initWorkerScriptToken = this.delegate.workerScript.initWorkerScript(function() {
			scope.loadScalarisCB(path, scope.options, onDone, onWorkerStart);
		});

		return true;
	};

	scalarisLoader.prototype.loadScalarisCB = function(path, options, onDone, onWorkerStart) {
		var first = true;
		var scope = this;
		var w = this.esdWorker = this.delegate.workerScript.createWorkerWithIntercept();

		var onScalarisLoad = function(ew) {
			var cleaner = function() {
				if(w) {
					w.clearAllEventListenerWithIntercept();
					w.terminate();
					scope.esdWorker = null;
					w = null;
				}
			};

			if(first && onWorkerStart) {
				first = false;
				onWorkerStart();
			}

			if(ew.data && ew.data.geometry) {
				// Decompression is done.
				var esd = scope.esd = ew.data.geometry;
				scope.onModelRootLoadDone(esd);

				if(onDone) {
					onDone(null, scope.model);
				}

				scope.zuv3DImpl.api.dispatchEvent({
					type: WGS.MODEL_ROOT_LOADED_EVENT,
					esd: esd,
					model: scope.model
				});
				scope.esd.loadDone = false;

			} else if(ew.data && ew.data.progress) {

				// Delay onGeomLoadDone so that UI has time to build.
				if(ew.data.progress == 1) {
					setTimeout(function() {
						scope.onGeomLoadDone();
						scope.loading = false;
						cleaner();
					}, 0);
				}
			} else if(ew.data && ew.data.error) {
				scope.loading = false;
				cleaner();
				if(onDone) {
					onDone(ew.data.error, null);
				}
			} else if(ew.data && ew.data.debug) {
				zvp.logger.debug(ew.data.message);
			} else {
				zvp.logger.error("Scalaris load failed.", zv.errorCodeString(zv.ErrorCodes.NETWORK_FAILURE));
				// Load failed.
				scope.loading = false;
				cleaner();
			}
		};

		w.addEventListenerWithIntercept(onScalarisLoad);

		var loadContext = {
			url: WGS.pathToURL(path),
			basePath: this.currentLoadPath,
			scalarisProtoPath: zvp.getResourceUrl(SCALARIS_PROTO_LOCATION)
		};

		loadContext.operation = WORKER_LOAD_SCALARIS;
		w.doOperation(zvp.initLoadContext(loadContext));

		return true;
	};

	scalarisLoader.prototype.onModelRootLoadDone = function(esd) {
		// Root model loading is done, and loader now is attached to model,
		// so can remove the direct reference to it from viewer impl.
		this.zuv3DImpl._removeLoadingFile(this);

		esd.basePath = this.basePath;
		esd.disableStreaming = true;
		esd.geomPolyCount = 0;
		esd.gpuNumMeshes = 0;
		esd.gpuMeshMemory = 0;

		esd.fragments = {
			length: esd.meshCount,
			numLoaded: 0,
			boxes: null,
			transforms: null,
			materials: null,

			fragId2dbId: null,
			entityIndexes: null,
			mesh2frag: null
		};

		esd.animations = null;
		esd.nodeToDbId = {};
		esd.loadOptions = this.options;

		esd.bbox = new THREE.Box3(esd.min, esd.max);

		// Create the API Model object and its render proxy
		var model = this.model = new zv.Model(esd);
		if(esd.urn) {
			model.setUUID(esd.urn);
		}
		model.initialize();
		model.loader = this;

		this.zuv3DImpl.signalProgress(5, zv.ProgressState.ROOT_LOADED);
		this.zuv3DImpl.invalidate(false, false);
	};

	scalarisLoader.prototype.onGeomLoadDone = function() {
		this.esd.loadDone = true;

		var fragLength = this.esd.fragments.length;
		this.esd.numGeoms = fragLength;

		this.esd.fragments.numLoaded = fragLength;
		this.esd.fragments.boxes = new Float32Array(fragLength * 6);
		this.esd.fragments.transforms = new Float32Array(fragLength * 12);
		this.esd.fragments.materials = new Int32Array(fragLength);
		this.esd.fragments.fragId2dbId = new Int32Array(fragLength);
		this.esd.fragments.mesh2frag = new Int32Array(fragLength);

		var ensureChunk = function(geometry) {
			if(geometry.offsets.length === 0) {
				var chunkSize = 21845;
				var numTris = geometry.attributes.index.array.length / 3;
				var offsets = numTris / chunkSize;
				for(var i = 0; i < offsets; i++) {
					var offset = {
						start: i * chunkSize * 3,
						count: Math.min(numTris - (i * chunkSize), chunkSize) * 3
					};
					geometry.addDrawCall(offset.start, offset.count);
				}
			}
		};

		var ensureNormals = function(geometry) {
			if(geometry.attributes.normal.array.length == 0) {
				geometry.attributes.normal.array = new Float32Array(geometry.attributes.position.array.length);
				geometry.computeVertexNormals();
			}
		};

		var commitGeometry = function(geometryData) {
			var geometry = new THREE.BufferGeometry();
			geometry.byteSize = 0;
			geometry.addAttribute('index', new THREE.BufferAttribute(new Uint32Array(geometryData.indices), 1));
			geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(geometryData.vertices), 3));
			geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(geometryData.normals), 3));

			if(geometryData.hasOwnProperty('uvs') && geometryData.uvs.byteLength > 0) {
				geometry.byteSize += geometryData.uvs.byteLength;
				geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(geometryData.uvs), 2));
			}

			geometry.hasColors = false;
			if(geometryData.hasOwnProperty('colors') && geometryData.colors.byteLength > 0) {
				geometry.byteSize += geometryData.colors.byteLength;
				geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(geometryData.colors), 3));
				geometry.hasColors = true;
				geometry.colorsNeedUpdate = true;
			}

			if(geometry.attributes.index.array.length > 0 && geometry.attributes.position.array.length > 0) {
				if(geometryData.hasOwnProperty('offsets') && geometryData.offsets.byteLength > 0) {
					geometry.byteSize += geometryData.offsets.byteLength;
					for(var i = 0; i < geometryData.offsets.length; i++) {
						var offset = geometryData.offsets[i];
						geometry.addDrawCall(offset.start, offset.count);
					}
				}

				if(geometryData.min) {
					geometry.boundingBox = new THREE.Box3(new THREE.Vector3(geometryData.min.x, geometryData.min.y, geometryData.min.z),
						new THREE.Vector3(geometryData.max.x, geometryData.max.y, geometryData.max.z));
				} else {
					geometry.computeBoundingBox();
				}
				geometryData.bbox.min = geometryData.min = geometry.boundingBox.min;
				geometryData.bbox.max = geometryData.max = geometry.boundingBox.max;

				ensureChunk(geometry);
				ensureNormals(geometry);

				geometry.byteSize += geometryData.indices.byteLength + geometryData.vertices.byteLength + geometryData.normals.byteLength;
				geometry.polyCount = geometry.attributes.index.array.length / 3;

				return geometry;
			}

			return null;
		};

		var esd = this.esd;

		// Get the THREE.BufferGeometry.
		var geometry = commitGeometry(esd);

		esd.geomPolyCount += geometry.polyCount;

		var meshId = 0;
		var fragId = 0;
		var matId = null; // no material info for now.

		this.createInstanceTree(fragId);

		var dbId = 2; // The id of the geometry node in the Instance tree (for this fragment).

		this.model.getGeometryList().addGeometry(geometry, 1 /*numOfInstances*/ , meshId);

		var matrix = new THREE.Matrix4();
		var mesh = this.zuv3DImpl.setupMesh(this.model, geometry, matId, matrix);

		esd.fragments.materials[fragId] = matId;
		esd.fragments.fragId2dbId[fragId] = dbId;
		esd.fragments.mesh2frag[meshId] = fragId;

		var bbox = esd.fragments.boxes;
		bbox[0] = esd.min.x;
		bbox[1] = esd.min.y;
		bbox[2] = esd.min.z;
		bbox[3] = esd.max.x;
		bbox[4] = esd.max.y;
		bbox[5] = esd.max.z;

		var trans = esd.fragments.transforms;
		for(var i = 0; i < 12; i++)
			trans[i] = 0;
		trans[0] = trans[4] = trans[8] = 1;

		this.model.activateFragment(fragId, mesh, !!esd.placementTransform);

		this.currentLoadPath = null;

		this.zuv3DImpl.api.setModelUnits(MODEL_UNITS);
		this.zuv3DImpl.onLoadComplete(this.model);

		if(this.zuv3DImpl.api.config.disabledExtensions.scalarisSimulation && geometry.hasColors && esd.colors.byteLength) {
			// Turn off the display of simulation data.
			var defMaterial = this.zuv3DImpl.getMaterials().defaultMaterial;
			defMaterial.vertexColors = THREE.NoColors;
			defMaterial.needsUpdate = true;
			this.zuv3DImpl.invalidate(true, true, false); // trigger re-render
		}

		this.zuv3DImpl.api.fitToView();
	};

	scalarisLoader.prototype.createInstanceTree = function(fragId) {
		var storage = new zvp.InstanceTreeStorage(2, 1);

		var rootDbId = 1; // dbId are 1-based.
		var geomDbId = 2;
		var rootChildrenDbIds = [geomDbId];
		var geomChildrenDbIds = [];

		storage.setNode(rootDbId, 0, ROOT_NODE_NAME, 0, rootChildrenDbIds, []);
		storage.setNode(geomDbId, rootDbId, GEOMETRY_NODE_NAME, 0, geomChildrenDbIds, [fragId]);

		var nodeAccess = new zvp.InstanceTreeAccess(storage, 0);
		nodeAccess.computeBoxes(this.esd.fragments.boxes);

		this.esd.instanceTree = new zvp.InstanceTree(nodeAccess, 1, 1);
	};

	scalarisLoader.prototype.is3d = function() {
		return true;
	};

	zv.ScalarisLoader = scalarisLoader;
	zv.FileLoaderManager.registerFileLoader("scalaris", ["scalaris"], zv.ScalarisLoader);
})();;