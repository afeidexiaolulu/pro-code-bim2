
(function() {

	"use strict";

	var zv = ZhiUTech.Viewing;
	var zvp = ZhiUTech.Viewing.Private;

	/** Loader for leaflet image pyramids and simple image files. 
	 *   @param {Viewer3DImpl} parent
	 */
	function LeafletLoader(parent) {

		var _parent = parent.zuv3DImpl;

		// Parses a single file header of a zip file.
		//
		// @param {Array}         input                  input as bytes array of the entire zip file.
		// @param {Offset}        [options]              offset of the relevant file header.
		var parseFileHeader = function(input, offset) {

			var fileHeaderSignature = [0x50, 0x4b, 0x01, 0x02];
			var ip = offset;

			if(input[ip++] !== fileHeaderSignature[0] || input[ip++] !== fileHeaderSignature[1] || input[ip++] !== fileHeaderSignature[2] || input[ip++] !== fileHeaderSignature[3]) {
				zvp.logger.error('invalid file header signature');
				return null;
			}

			var fileHeader = {};

			// version made by
			fileHeader.version = input[ip++];

			// os version
			fileHeader.os = input[ip++];

			// version needed to extract
			fileHeader.needVersion = input[ip++] | (input[ip++] << 8);

			// general purpose bit flag
			fileHeader.flags = input[ip++] | (input[ip++] << 8);

			// compression method
			fileHeader.compression = input[ip++] | (input[ip++] << 8);

			// last mod file time
			fileHeader.time = input[ip++] | (input[ip++] << 8);

			//last mod file date
			fileHeader.date = input[ip++] | (input[ip++] << 8);

			// crc-32
			fileHeader.crc32 = ((input[ip++]) | (input[ip++] << 8) | (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;

			// compressed size
			fileHeader.compressedSize = ((input[ip++]) | (input[ip++] << 8) | (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;

			// uncompressed size
			fileHeader.plainSize = ((input[ip++]) | (input[ip++] << 8) | (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;

			// file name length
			fileHeader.fileNameLength = input[ip++] | (input[ip++] << 8);

			// extra field length
			fileHeader.extraFieldLength = input[ip++] | (input[ip++] << 8);

			// file comment length
			fileHeader.fileCommentLength = input[ip++] | (input[ip++] << 8);

			// disk number start
			fileHeader.diskNumberStart = input[ip++] | (input[ip++] << 8);

			// internal file attributes
			fileHeader.internalFileAttributes = input[ip++] | (input[ip++] << 8);

			// external file attributes
			fileHeader.externalFileAttributes = (input[ip++]) | (input[ip++] << 8) | (input[ip++] << 16) | (input[ip++] << 24);

			// relative offset of local header
			fileHeader.relativeOffset = ((input[ip++]) | (input[ip++] << 8) | (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;

			// file name
			fileHeader.filename = String.fromCharCode.apply(null, input.slice(ip, ip += fileHeader.fileNameLength));

			// extra field
			fileHeader.extraField = input.slice(ip, ip += fileHeader.extraFieldLength);

			// file comment
			fileHeader.comment = input.slice(ip, ip + fileHeader.fileCommentLength);

			// length of the entry
			fileHeader.length = ip - offset;

			return fileHeader;
		};

		// Parses a single local file header of a zip file.
		//
		// @param {Array}         input                  input as bytes array of the local file header.
		var parseLocalFileHeader = function(input) {

			var localFileHeaderSignature = [0x50, 0x4b, 0x03, 0x04];
			var ip = 0;

			// local file header signature
			if(input[ip++] !== localFileHeaderSignature[0] || input[ip++] !== localFileHeaderSignature[1] || input[ip++] !== localFileHeaderSignature[2] || input[ip++] !== localFileHeaderSignature[3]) {
				zvp.logger.error('invalid local file header signature');
				return null;
			}

			var localFileHeader = {};

			// version needed to extract
			localFileHeader.needVersion = input[ip++] | (input[ip++] << 8);

			// general purpose bit flag
			localFileHeader.flags = input[ip++] | (input[ip++] << 8);

			// compression method
			localFileHeader.compression = input[ip++] | (input[ip++] << 8);

			// last mod file time
			localFileHeader.time = input[ip++] | (input[ip++] << 8);

			//last mod file date
			localFileHeader.date = input[ip++] | (input[ip++] << 8);

			// crc-32
			localFileHeader.crc32 = ((input[ip++]) | (input[ip++] << 8) | (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;

			// compressed size
			localFileHeader.compressedSize = ((input[ip++]) | (input[ip++] << 8) | (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;

			// uncompressed size
			localFileHeader.plainSize = ((input[ip++]) | (input[ip++] << 8) | (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;

			// file name length
			localFileHeader.fileNameLength = input[ip++] | (input[ip++] << 8);

			// extra field length
			localFileHeader.extraFieldLength = input[ip++] | (input[ip++] << 8);

			// file name
			localFileHeader.filename = String.fromCharCode.apply(null, input.slice(ip, ip += localFileHeader.fileNameLength));

			// extra field
			localFileHeader.extraField = input.slice(ip, ip += localFileHeader.extraFieldLength);

			localFileHeader.length = ip;

			return localFileHeader;
		};

		// Extracts the data from the local file header, given as a bytes array.
		//
		// @param {Array}         data                  input as bytes array of the local file header.
		var extractImage = function(data) {

			var localFileHeader = parseLocalFileHeader(data);
			var imageOffset = localFileHeader.length;
			var imageLength = localFileHeader.compressedSize;
			var image = data.slice(imageOffset, imageOffset + imageLength);

			return image;
		};

		// Parses a zip's central directory, and returns a file table contains all the file headers.
		var parseCentralDirectory = function(input, centralDirOffset, centralDirEntriesNumber) {

			var ip = 0;
			var fileTable = [];
			var fileHeader, previousFileHeader = null;

			for(var i = 0; i < centralDirEntriesNumber; ++i) {
				fileHeader = parseFileHeader(input, ip);

				if(!fileHeader) {
					return null;
				}

				if(previousFileHeader) {
					previousFileHeader.contentSize = fileHeader.relativeOffset - previousFileHeader.relativeOffset;
				}

				ip += fileHeader.length;
				fileTable[fileHeader.filename] = fileHeader;

				previousFileHeader = fileHeader;
			}

			previousFileHeader.contentSize = centralDirOffset - previousFileHeader.relativeOffset;

			return fileTable;
		};

		var getCentralDirectory = function(urn, acmSessionId, offset, length, onSuccess, onError) {

			var queryParams = null;

			// If the zip file is offline, get entire zip.
			// Else, the zip is online, so get only the central dir from the zip, using ranged request, supported by backend.
			if(!zvp.offline) {

				if(acmSessionId) {
					queryParams = "acmsession=" + acmSessionId;
				}

				var rangeParams = 'start=' + offset + '&end=' + (length + offset);

				if(queryParams) {
					queryParams += '&' + rangeParams;
				} else {
					queryParams = rangeParams;
				}
			}

			var loadContext = zvp.initLoadContext({
				queryParams: queryParams
			});

			zvp.ViewingService.getItem(loadContext, urn, onSuccess, onError);
		};

		this.continueLoadFile = function(path, options, onDone, onWorkerStart, config, textureLoader) {

			var self = this;

			var pattern = options.loadOptions.loadFromZip ? '{z}/{x}_{y}.jpeg' : path;
			config.initFromLoadOptions(pattern, options.loadOptions, textureLoader);

			var iter = null;

			//The Leaflet loader has no long running worker thread initialization,
			//so we can call back the viewer to continue its renderer initialization.
			if(onWorkerStart)
				onWorkerStart();

			//The code below requires the renderer (and the materials manager in particular)
			//to exist, which happens when we call back onWorkerStart above.
			function onLoad() {

				// Create ModelData. Will be returned when calling model.getData() on the data model
				function LeafletModelData(loadOptions) {
					// used by Viewer3DImpl for initial camera adjustment     
					this.bbox = new THREE.Box3();

					this.basePath = path;

					// run viewer in 2D mode
					this.is2d = true;

					// get paper extent. If not specified in the load options, use the texture resolution so that
					// measurement works in pixels
					var paperWidth = (loadOptions && loadOptions.paperWidth >= 0.0) ? loadOptions.paperWidth : config.texWidth;
					var paperHeight = (loadOptions && loadOptions.paperHeight >= 0.0) ? loadOptions.paperHeight : config.texHeight;

					// transform for measurement tools
					this.pageToModelTransform = config.getPageToModelTransform(paperWidth, paperHeight);

					// make page dimensions available to viewer and tools. We store this in an own object metadata.page_dimensions.
					// This is done for consistency with F2D, so that functions like Model.getMetaData() and Model.getDisplayUnits() can use it.
					this.metadata = {};
					this.metadata.page_dimensions = {};
					var pd = this.metadata.page_dimensions;
					pd.page_width = paperWidth;
					pd.page_height = paperHeight;
					pd.page_units = loadOptions.paperUnits;

					// signal that the model is ready to use, e.g., to do measurements
					this.loadDone = true;
					this.isLeaflet = true;
					_parent.signalProgress(100, zv.ProgressState.LOADING);

					// Note: When just loading images, we don't know texWidth at this point, but must
					//       wait for the texture. Therefore, the zoomIn constraint is currently only applied
					//       if we know the size in advance.
					if(config.texWidth > 0) {
						// store hint to restrict zoom-in when we reach max resolution.
						this.maxPixelPerUnit = config.texWidth / config.getQuadWidth();
					}
				}

				var modelData = new LeafletModelData(options.loadOptions);
				// To be consistent with other loaders and expected by some code setions,
				// save loadOptions to the model data.
				modelData.loadOptions = options;

				iter.getVisibleBounds(modelData.bbox);

				// Create RenderModel with texQuad iterator
				var model = new zv.Model(modelData);
				model.initFromCustomIterator(iter);

				// Track loading time
				iter.callWhenRefined(function() {
					var t1 = Date.now();
					modelData.loadTime = t1 - self.t0;
					zvp.logger.log("SVF load: " + modelData.loadTime); // Use SVF to make output consistent with other loaders
				});

				onDone(null, model);
			}

			// if we have no leaflet params, handle it as a single image
			var isSimpleImage = !config.valid();
			if(isSimpleImage) {
				// when displaying a single image, we don't know the extents in advance.
				// But we need them to determine the bbox for the initial camera placement.
				// Therefore, we defer the loading for this case until the image is loaded.
				// The image dimensions are then derived from the image file.
				config.initForSimpleImage(path, onLoad);
			}

			// Set pixel ratio to the same values as used by WebGLRenderer. In this way, we make full
			// use of the available render target resolution.
			config.pixelRatio = _parent.glrenderer().getPixelRatio();

			// create iterator 
			iter = new zvp.ModelIteratorTexQuad(config, _parent.getMaterials());

			// when loading leaflets, we know texWidth/texHeight in advance and can
			// add finish loading right away. 
			if(!isSimpleImage) {
				onLoad();
			}
		};

		/** 
		 * @callback LoadSuccessCB
		 *   @param {RenderModel}
		 *
		 * @callback LoadErrorCB
		 *   @param {number} errorCode
		 *   @param {string} errorMsg
		 *   @param {number} statusCode
		 *   @param {string} statusText
		 */

		/*
		 * @param {string}        path
		 * @param {Object}        [options]              Dictionary with options parsed from query string. 
		 * @para  {Object}        [options.loadOptions]  For leaflets, this must contain additional params like tileSize, texWidth etc. (see TexQuadConfig.initFromLoadOptions)
		 * @param {number}        [options.acmSessionId] Required when requesting non-public image files. 
		 * @param {LoadDoneCB}    onDone 
		 */
		this.loadFile = function(path, options, onDone, onWorkerStart) {

			var self = this;

			this.t0 = Date.now();

			// get leaflet params from loader options. Note that it's no error if we don't find them,
			// because simple image files can be loaded without any extra options
			var config = new zvp.TexQuadConfig();

			var textureLoader = null;
			var acmSessionId = options.acmSessionId;

			if(options.loadOptions && options.loadOptions.loadFromZip) {

				textureLoader = function(imageURL, onSuccess, onError) {
					var currZip;
					var level = imageURL.split('/')[0] - config.levelOffset;

					// Find the relevant zip by the tile's level.
					for(var i = 0; i < config.zips.length; i++) {
						if(level <= config.zips[i].zipMaxLevel) {
							currZip = config.zips[i];
							break;
						}
					}

					if(!currZip) {
						onError('Failed loading texture - tile\'s level doesn\'t exists.');
						return false;
					}

					var fileHeader = currZip.fileTable[imageURL];

					if(!fileHeader) {
						onError('Failed loading texture - entry does not exist inside fileTable.');
						return false;
					}

					var options = {
						extractImage: extractImage
					};

					var start = fileHeader.relativeOffset;
					var end = fileHeader.relativeOffset + fileHeader.contentSize;

					// In case we already have the entire zip's raw data - we don't need to request the texture from the server.
					// Just load the texture's bytes from rawData.
					if(currZip.rawData) {
						options.rawData = currZip.rawData.slice(start, end);
					} else {
						var rangeParams = 'start=' + start + '&end=' + end;
						options.queryParams = rangeParams;
					}

					WGS.TextureLoader.loadTextureWithSecurity(currZip.urnZip, false, THREE.UVMapping, onSuccess, acmSessionId, zvp.initLoadContext, !config.valid(), options);
				};

				var areAllZipsParsed = function() {
					return options.loadOptions.zips.every(function(zip) {
						return !!zip.fileTable;
					});
				};

				options.loadOptions.zips.forEach(function(currZip) {
					// Load the central directory from the zip
					var centralDirOffset = currZip.centralDirOffset;
					var centralDirLength = currZip.centralDirLength;
					var numOfEntries = currZip.centralDirEntries;

					var onGetContentSuccess = function(rawBuffer) {
						if(zvp.offline) {
							currZip.rawData = rawBuffer;
							rawBuffer = rawBuffer.slice(centralDirOffset, centralDirOffset + centralDirLength);
						}

						var fileTable = parseCentralDirectory(rawBuffer, centralDirOffset, numOfEntries);

						if(!fileTable) {
							onDone('Failed parsing central directory of the zip.', null);
							return false;
						}

						currZip.fileTable = fileTable;

						if(areAllZipsParsed()) {
							self.continueLoadFile(path, options, onDone, onWorkerStart, config, textureLoader);
						}
					};

					var onGetContentError = function(error) {
						zvp.logger.error('Zip download failed: ' + error.statusText, zv.errorCodeString(zv.ErrorCodes.NETWORK_FAILURE));
						onDone('Zip download failed: ' + error.statusText, null);
					};

					getCentralDirectory(currZip.urnZip, acmSessionId, centralDirOffset, centralDirLength, onGetContentSuccess, onGetContentError);
				});

			} else {
				textureLoader = function(imageURL, onSuccess, onError) {
					WGS.TextureLoader.loadTextureWithSecurity(imageURL, false, THREE.UVMapping, onSuccess, acmSessionId, zvp.initLoadContext, !config.valid());
				};

				this.continueLoadFile(path, options, onDone, onWorkerStart, config, textureLoader);
			}
		};
	}

	// For standard leaflet hierarchies, the root level 0 is the only one with only one tile,
	// i.e., there are already 2-4 tiles at level 1. 
	// In contrast, the hierarchies produced by cloud translation start at a root resolution of 1x1,
	// thus containing several levels that we have to skip. The number of skipped levels is controlled 
	// by the 'levelOffset' parameter. 
	// The level offset that we need for a hierarchy with a root resolution of 1x1 resolution depends
	// on the tileSize and is computed by this function,
	LeafletLoader.computeLevelOffset = function(tileSize) {

		// when reaching this, we abort the loop, because there is something strange
		// with the tileSize parameter.
		var MaxCycles = 20;

		var pixelSize = 1;
		var level = 0;
		for(var i = 0; i < MaxCycles; i++) {
			// will the next level still fit into a single tile?
			pixelSize *= 2;

			// if no, stop here
			if(pixelSize > tileSize) {
				return level;
			}
			level++;
		}

		zvp.logger.log("unexpected leaflet tileSize");
		return 0;
	};

	LeafletLoader.prototype.is3d = function() {
		return false;
	};

	ZhiUTech.Viewing.Private.LeafletLoader = LeafletLoader;

	ZhiUTech.Viewing.FileLoaderManager.registerFileLoader("Leaflet", ["jpeg", "jpg", "png"], zvp.LeafletLoader);

})();;
(function() {

	"use strict";

	var zv = ZhiUTech.Viewing,
		zvp = zv.Private;

	var TAU = Math.PI * 2;

	var VBB_GT_TRIANGLE_INDEXED = 0,
		VBB_GT_LINE_SEGMENT = 1,
		VBB_GT_ARC_CIRCULAR = 2,
		VBB_GT_ARC_ELLIPTICAL = 3,
		VBB_GT_TEX_QUAD = 4,
		VBB_GT_ONE_TRIANGLE = 5;

	var VBB_INSTANCED_FLAG = 0, // this is intentionally 0 for the instancing case!
		VBB_SEG_START_RIGHT = 0, // this starts intentionally at 0!
		VBB_SEG_START_LEFT = 1,
		VBB_SEG_END_RIGHT = 2,
		VBB_SEG_END_LEFT = 3;

	var VBB_COLOR_OFFSET = 6,
		VBB_DBID_OFFSET = 7,
		VBB_FLAGS_OFFSET = 8,
		VBB_LAYER_VP_OFFSET = 9;

	var QUAD_TRIANGLE_INDICES = [0, 1, 3, 0, 3, 2];

	function VertexBufferBuilder(useInstancing, allocSize, fullCount) {
		var MAX_VCOUNT = allocSize || 65536;
		this.FULL_COUNT = (fullCount || 32767) | 0;

		this.useInstancing = useInstancing;

		//TODO: Temporarily expand the stride to the full one, in order to work around new
		//more strict WebGL validation which complains when a shader addresses attributes outside
		//the vertex buffer, even when it does not actually access them. We would need separate shader
		//configurations for each of the two possible vertex strides for the selection shader, which is
		//currently shared between all 2d geometries.
		//this.stride = 10;
		this.stride = 12;

		this.vb = new ArrayBuffer(this.stride * 4 * (this.useInstancing ? MAX_VCOUNT / 4 : MAX_VCOUNT));
		this.vbf = new Float32Array(this.vb);
		this.vbi = new Int32Array(this.vb);
		this.ib = this.useInstancing ? null : new Uint16Array(MAX_VCOUNT);
		this.reset(0);
	}

	VertexBufferBuilder.prototype.reset = function(vcount) {
		// This is used to restore the vcount when restoring stream state as well as at init time.
		this.vcount = vcount;

		this.icount = 0;

		this.minx = this.miny = Infinity;
		this.maxx = this.maxy = -Infinity;

		//Keeps track of objectIds referenced by geometry in the VB
		this.dbIds = {};

		this.numEllipticals = 0;
		this.numCirculars = 0;
		this.numTriangleGeoms = 0;
	}

	VertexBufferBuilder.prototype.expandStride = function() {
		// since we already set the stride to the current max value of 12 in the
		// constructor above, we don't need to do anything here right now...
		return;

		/*
		    //Currently hardcoded to expand by 4 floats.
		    var expandBy = 2;

		    var stride = this.stride;

		    if (stride >= 12)
		        return;

		    var nstride = this.stride + expandBy;

		    var nvb = new ArrayBuffer(nstride * (this.vb.byteLength / stride));

		    var src = new Uint8Array(this.vb);
		    var dst = new Uint8Array(nvb);

		    for (var i = 0, iEnd = this.vcount; i<iEnd; i++) {
		        var os = i * stride * 4;
		        var od = i * nstride * 4;

		        for (var j=0; j<stride * 4; j++)
		            dst[od+j] = src[os+j];
		    }

		    this.vb = nvb;
		    this.vbf = new Float32Array(nvb);
		    this.vbi = new Int32Array(nvb);
		    this.stride = nstride;
		*/
	};

	VertexBufferBuilder.prototype.addToBounds = function(x, y) {
		if(x < this.minx) this.minx = x;
		if(x > this.maxx) this.maxx = x;
		if(y < this.miny) this.miny = y;
		if(y > this.maxy) this.maxy = y;
	};

	VertexBufferBuilder.prototype.setCommonVertexAttribs = function(offset, vertexId, geomType, color, dbId, layerId, vpId, linePattern) {
		// align changes here with the "decodeCommonAttribs()" function in LineShader.js and VertexBufferReader.js!!!
		vertexId = (vertexId & 0xff); //  8 bit
		geomType = (geomType & 0xff); //  8 bit
		linePattern = (linePattern & 0xff); //  8 bit
		layerId = (layerId & 0xffff); // 16 bit
		vpId = (vpId & 0xffff); // 16 bit

		this.vbi[offset + VBB_FLAGS_OFFSET] = vertexId | (geomType << 8) | (linePattern << 16); // vertexId: int8; geomType: int8; linePattern: int8; ghostingFlag: int8
		this.vbi[offset + VBB_COLOR_OFFSET] = color;
		this.vbi[offset + VBB_DBID_OFFSET] = dbId;
		this.vbi[offset + VBB_LAYER_VP_OFFSET] = layerId | (vpId << 16); // layerId: int16; vpId: int16

		this.dbIds[dbId] = 1; // mark this feature as used
	}

	//Creates a non-indexed triangle geometry vertex (triangle vertex coords stored in single vertex structure)
	VertexBufferBuilder.prototype.addVertexTriangleGeom = function(x1, y1, x2, y2, x3, y3, color, dbId, layerId, vpId) {
		var vi = this.vcount;
		var vbf = this.vbf;

		var repeat = this.useInstancing ? 1 : 4;
		for(var i = 0; i < repeat; i++) {
			var offset = (vi + i) * this.stride;

			// align changes here with the "decodeTriangleData()" function in LineShader.js!!!
			vbf[offset] = x1;
			vbf[offset + 1] = y1;
			vbf[offset + 2] = x2;

			vbf[offset + 3] = y2;
			vbf[offset + 4] = x3;
			vbf[offset + 5] = y3;

			this.setCommonVertexAttribs(offset, VBB_SEG_START_RIGHT + i, VBB_GT_ONE_TRIANGLE, color, dbId, layerId, vpId, /*linePattern*/ 0);
			this.vcount++;
		}

		return vi;
	};

	VertexBufferBuilder.prototype.addVertexLine = function(x, y, angle, distanceAlong, totalDistance, lineWidth, color, dbId, layerId, vpId, lineType) {
		var vi = this.vcount;
		var vbf = this.vbf;

		var repeat = this.useInstancing ? 1 : 4;
		for(var i = 0; i < repeat; i++) {
			var offset = (vi + i) * this.stride;

			// align changes here with the "decodeSegmentData()" function in LineShader.js!!!
			vbf[offset] = x;
			vbf[offset + 1] = y;
			vbf[offset + 2] = angle;

			vbf[offset + 3] = distanceAlong;
			vbf[offset + 4] = lineWidth * 0.5; // we are storing only the half width (i.e., the radius)
			vbf[offset + 5] = totalDistance;

			this.setCommonVertexAttribs(offset, VBB_SEG_START_RIGHT + i, VBB_GT_LINE_SEGMENT, color, dbId, layerId, vpId, lineType);
			this.vcount++;
		}

		return vi;
	};

	VertexBufferBuilder.prototype.addVertexTexQuad = function(centerX, centerY, width, height, rotation, color, dbId, layerId, vpId) {
		var vi = this.vcount;
		var vbf = this.vbf;

		var repeat = this.useInstancing ? 1 : 4;
		for(var i = 0; i < repeat; i++) {
			var offset = (vi + i) * this.stride;

			// align changes here with the "decodeTexQuadData()" function in LineShader.js!!!
			vbf[offset] = centerX;
			vbf[offset + 1] = centerY;
			vbf[offset + 2] = rotation;

			vbf[offset + 3] = width;
			vbf[offset + 4] = height;

			this.setCommonVertexAttribs(offset, VBB_SEG_START_RIGHT + i, VBB_GT_TEX_QUAD, color, dbId, layerId, vpId, /*linePattern*/ 0);
			this.vcount++;
		}

		return vi;
	};

	VertexBufferBuilder.prototype.addVertexArc = function(x, y, startAngle, endAngle, major, minor, tilt, lineWidth, color, dbId, layerId, vpId) {
		var vi = this.vcount;
		var vbf = this.vbf;

		var geomType = (major == minor) ? VBB_GT_ARC_CIRCULAR : VBB_GT_ARC_ELLIPTICAL;

		var repeat = this.useInstancing ? 1 : 4;
		for(var i = 0; i < repeat; i++) {
			var offset = (vi + i) * this.stride;

			// align changes here with the "decodeArcData()" function in LineShader.js!!!
			vbf[offset] = x;
			vbf[offset + 1] = y;
			vbf[offset + 2] = startAngle;

			vbf[offset + 3] = endAngle;
			vbf[offset + 4] = lineWidth * 0.5; // we are storing only the half width (i.e., the radius)
			vbf[offset + 5] = major; // = radius for circular arcs

			if(geomType === VBB_GT_ARC_ELLIPTICAL) {
				vbf[offset + 10] = minor;
				vbf[offset + 11] = tilt;
			}

			this.setCommonVertexAttribs(offset, VBB_SEG_START_RIGHT + i, geomType, color, dbId, layerId, vpId, /*linePattern*/ 0);
			this.vcount++;
		}

		return vi;
	};

	//====================================================================================================
	//====================================================================================================
	// Indexed triangle code path can only be used when hardware instancing is not in use.
	// Otherwise, the addTriangleGeom operation should be used to add simple triangles to the buffer.
	//====================================================================================================
	//====================================================================================================

	VertexBufferBuilder.prototype.addVertex = function(x, y, color, dbId, layerId, vpId) {
		if(this.useInstancing)
			return; //not supported if instancing is used.

		var vi = this.vcount;
		var offset = this.stride * vi;
		var vbf = this.vbf;

		// align changes here with the "decodeTriangleData()" function in LineShader.js!!!
		vbf[offset] = x;
		vbf[offset + 1] = y;

		this.setCommonVertexAttribs(offset, /*vertexId*/ 0, VBB_GT_TRIANGLE_INDEXED, color, dbId, layerId, vpId, /*linePattern*/ 0);
		this.vcount++;

		return vi;
	};

	VertexBufferBuilder.prototype.addVertexPolytriangle = function(x, y, color, dbId, layerId, vpId) {
		if(this.useInstancing)
			return; //not supported if instancing is used.

		this.addVertex(x, y, color, dbId, layerId, vpId);

		this.addToBounds(x, y);
	};

	VertexBufferBuilder.prototype.addIndices = function(indices, vindex) {

		if(this.useInstancing)
			return; //not supported if instancing is used.

		var ib = this.ib;
		var ii = this.icount;

		if(ii + indices.length >= ib.length) {
			var ibnew = new Uint16Array(Math.max(indices.length, ib.length) * 2);
			for(var i = 0; i < ii; ++i) {
				ibnew[i] = ib[i];
			}
			this.ib = ib = ibnew;
		}

		for(var i = 0; i < indices.length; ++i) {
			ib[ii + i] = vindex + indices[i];
		}

		this.icount += indices.length;
	};

	//====================================================================================================
	//====================================================================================================
	// End indexed triangle code path.
	//====================================================================================================
	//====================================================================================================

	VertexBufferBuilder.prototype.finalizeQuad = function(vindex) {
		if(!this.useInstancing) {
			this.addIndices(QUAD_TRIANGLE_INDICES, vindex);
		}
	};

	VertexBufferBuilder.prototype.addSegment = function(x1, y1, x2, y2, totalDistance, lineWidth, color, dbId, layerId, vpId, lineType) {
		var dx = x2 - x1;
		var dy = y2 - y1;
		var angle = (dx || dy) ? Math.atan2(dy, dx) : 0.0;
		var segLen = (dx || dy) ? Math.sqrt(dx * dx + dy * dy) : 0.0;

		//Add four vertices for the bbox of this line segment
		//This call sets the stuff that's common for all four
		var v = this.addVertexLine(x1, y1, angle, segLen, totalDistance, lineWidth, color, dbId, layerId, vpId, lineType);

		this.finalizeQuad(v);
		this.addToBounds(x1, y1);
		this.addToBounds(x2, y2);
	};

	//Creates a non-indexed triangle geometry (triangle vertex coords stored in single vertex structure)
	VertexBufferBuilder.prototype.addTriangleGeom = function(x1, y1, x2, y2, x3, y3, color, dbId, layerId, vpId) {
		this.numTriangleGeoms++;

		var v = this.addVertexTriangleGeom(x1, y1, x2, y2, x3, y3, color, dbId, layerId, vpId);

		this.finalizeQuad(v);
		this.addToBounds(x1, y1);
		this.addToBounds(x2, y2);
		this.addToBounds(x3, y3);
	};

	VertexBufferBuilder.prototype.addArc = function(cx, cy, start, end, major, minor, tilt, lineWidth, color, dbId, layerId, vpId) {
		if(major == minor) {
			this.numCirculars++;
		} else {
			this.numEllipticals++;
		}

		// This is a workaround, when the circular arc has rotation, the extractor cannot handle it.
		// After the fix is deployed in extractor, this can be removed.
		var result = fixUglyArc(start, end);
		start = result.start;
		end = result.end;

		//If both start and end angles are exactly 0, it's a complete ellipse/circle
		//This is working around a bug in the F2D writer, where an fmod operation will potentially.
		//convert 2pi to 0.
		if(start == 0 && end == 0)
			end = TAU;

		//Add two zero length segments as round caps at the end points
		{
			//If it's a full ellipse, then we don't need caps
			var range = Math.abs(start - end);
			if(range > 0.0001 && Math.abs(range - TAU) > 0.0001) {
				var sx = cx + major * Math.cos(start);
				var sy = cy + minor * Math.sin(start);
				this.addSegment(sx, sy, sx, sy, 0, lineWidth, color, dbId, layerId, vpId);

				var ex = cx + major * Math.cos(end);
				var ey = cy + minor * Math.sin(end);
				this.addSegment(ex, ey, ex, ey, 0, lineWidth, color, dbId, layerId, vpId);

				//TODO: also must add all the vertices at all multiples of PI/2 in the start-end range to get exact bounds
			} else {
				this.addToBounds(cx - major, cy - minor);
				this.addToBounds(cx + major, cy + minor);
			}

			// Add the center of the circle / ellipse as a single transparent dot - So it wil be snappable.
			var c = this.addVertexLine(cx, cy, 0, 0.0001, 0, 0, 1, dbId, layerId, vpId);
			this.finalizeQuad(c);
		}

		var v = this.addVertexArc(cx, cy, start, end, major, minor, tilt, lineWidth, color, dbId, layerId, vpId);

		this.finalizeQuad(v);

		//Testing caps
		if(false) {
			//If it's a full ellipse, then we don't need caps
			var range = Math.abs(start - end);
			if(Math.abs(range - TAU) > 0.0001) {
				var sx = cx + major * Math.cos(start);
				var sy = cy + minor * Math.sin(start);
				this.addSegment(sx, sy, sx, sy, 0, lineWidth, 0xff00ffff, dbId, layerId, vpId);

				var ex = cx + major * Math.cos(end);
				var ey = cy + minor * Math.sin(end);
				this.addSegment(ex, ey, ex, ey, 0, lineWidth, 0xff00ffff, dbId, layerId, vpId);
			}
		}
	}

	VertexBufferBuilder.prototype.addTexturedQuad = function(centerX, centerY, width, height, rotation, color, dbId, layerId, vpId) {
		//Height is specified using the line weight field.
		//This will result in height being clamped to at least one pixel
		//but that's ok (zero height for an image would be rare).
		var v = this.addVertexTexQuad(centerX, centerY, width, height, rotation, color, dbId, layerId, vpId);

		this.finalizeQuad(v);

		var cos = 0.5 * Math.cos(rotation);
		var sin = 0.5 * Math.sin(rotation);
		var w = Math.abs(width * cos) + Math.abs(height * sin);
		var h = Math.abs(width * sin) + Math.abs(height * cos);
		this.addToBounds(centerX - w, centerY - h);
		this.addToBounds(centerX + w, centerY + h);
	};

	VertexBufferBuilder.prototype.isFull = function(addCount) {
		addCount = addCount || 3;
		var mult = this.useInstancing ? 4 : 1;

		return(this.vcount * mult + addCount > this.FULL_COUNT);
	};

	VertexBufferBuilder.prototype.toMesh = function() {
		var mesh = {};

		mesh.vb = new Float32Array(this.vb.slice(0, this.vcount * this.stride * 4));
		mesh.vbstride = this.stride;

		var d = this.useInstancing ? 1 : 0;

		mesh.vblayout = {
			"fields1": {
				offset: 0,
				itemSize: 3,
				bytesPerItem: 4,
				divisor: d,
				normalize: false
			},
			"fields2": {
				offset: 3,
				itemSize: 3,
				bytesPerItem: 4,
				divisor: d,
				normalize: false
			},
			"color4b": {
				offset: VBB_COLOR_OFFSET,
				itemSize: 4,
				bytesPerItem: 1,
				divisor: d,
				normalize: true
			},
			"dbId4b": {
				offset: VBB_DBID_OFFSET,
				itemSize: 4,
				bytesPerItem: 1,
				divisor: d,
				normalize: false
			},
			"flags4b": {
				offset: VBB_FLAGS_OFFSET,
				itemSize: 4,
				bytesPerItem: 1,
				divisor: d,
				normalize: false
			},
			"layerVp4b": {
				offset: VBB_LAYER_VP_OFFSET,
				itemSize: 4,
				bytesPerItem: 1,
				divisor: d,
				normalize: false
			}
		};

		//Are we using an expanded vertex layout -- then add the extra attribute to the layout
		if(this.stride > 10) {
			mesh.vblayout["extraParams"] = {
				offset: 10,
				itemSize: 2,
				bytesPerItem: 4,
				divisor: d,
				normalize: false
			};
		}

		if(this.useInstancing) {
			mesh.numInstances = this.vcount;

			//Set up trivial vertexId and index attributes

			var instFlags = new Int32Array([VBB_SEG_START_RIGHT, VBB_SEG_START_LEFT, VBB_SEG_END_RIGHT, VBB_SEG_END_LEFT]);
			mesh.vblayout.instFlags4b = {
				offset: 0,
				itemSize: 4,
				bytesPerItem: 1,
				divisor: 0,
				normalize: false
			};
			mesh.vblayout.instFlags4b.array = instFlags.buffer;

			var idx = mesh.indices = new Uint16Array(QUAD_TRIANGLE_INDICES);
		} else {
			mesh.indices = new Uint16Array(this.ib.buffer.slice(0, 2 * this.icount));
		}

		mesh.dbIds = this.dbIds;

		var w = this.maxx - this.minx;
		var h = this.maxy - this.miny;
		var sz = Math.max(w, h);

		mesh.boundingBox = {
			min: {
				x: this.minx,
				y: this.miny,
				z: -sz * 1e-3
			},
			max: {
				x: this.maxx,
				y: this.maxy,
				z: sz * 1e-3
			}
		};

		//Also compute a rough bounding sphere
		var bs = mesh.boundingSphere = {
			center: {
				x: 0.5 * (this.minx + this.maxx),
				y: 0.5 * (this.miny + this.maxy),
				z: 0.0
			},
			radius: 0.5 * Math.sqrt(w * w + h * h)
		};

		return mesh;
	};

	// The following logic attempts to "fix" imprecisions in arc definitions introduced
	// by Heidi's fixed point math, in case that the extractor doesn't handle it correctly.

	var fixUglyArc = function(start, end) {
		//Snap critical angles exactly
		function snapCritical() {
			function fuzzyEquals(a, b) {
				return(Math.abs(a - b) < 1e-3);
			}

			if(fuzzyEquals(start, 0)) start = 0.0;
			if(fuzzyEquals(end, 0)) end = 0.0;
			if(fuzzyEquals(start, TAU)) start = TAU;
			if(fuzzyEquals(end, TAU)) end = TAU;
		}

		snapCritical();

		//OK, in some cases the angles are both over-rotated...
		if(start > end) {
			while(start > TAU) {
				start -= TAU;
				end -= TAU;
			}
		} else {
			while(end > TAU) {
				start -= TAU;
				end -= TAU;
			}
		}

		//Snap critical angles exactly -- again
		snapCritical();

		//If the arc crosses the x axis, we have to make it clockwise...
		//This is a side effect of bringing over-rotated arcs in range above.
		//For example start = 5.0, end = 7.0 will result in start < 0 and end > 0,
		//so we have to make start > end in order to indicate we are crossing angle = 0.
		if(start < 0 && end > 0) {
			start += TAU;
		}

		return {
			start: start,
			end: end
		};
	};

	zvp.VertexBufferBuilder = VertexBufferBuilder;

})();;

(function() {

	"use strict";

	var zv = ZhiUTech.Viewing,
		zvp = ZhiUTech.Viewing.Private;

	var TAU = Math.PI * 2;

	//Constants duplicated from src/lmvtk/VertexBufferBuilder.js
	var VBB_GT_TRIANGLE_INDEXED = 0,
		VBB_GT_LINE_SEGMENT = 1,
		VBB_GT_ARC_CIRCULAR = 2,
		VBB_GT_ARC_ELLIPTICAL = 3,
		VBB_GT_TEX_QUAD = 4,
		VBB_GT_ONE_TRIANGLE = 5;

	var VBB_INSTANCED_FLAG = 0, // this is intentionally 0 for the instancing case!
		VBB_SEG_START_RIGHT = 0, // this starts intentionally at 0!
		VBB_SEG_START_LEFT = 1,
		VBB_SEG_END_RIGHT = 2,
		VBB_SEG_END_LEFT = 3;

	var VBB_COLOR_OFFSET = 6,
		VBB_DBID_OFFSET = 7,
		VBB_FLAGS_OFFSET = 8,
		VBB_LAYER_VP_OFFSET = 9;

	/**
	 * Initializes a "view" into a compacted interleaved vertex buffer array using our custom 2D vertex layout.
	 * See src/lmvtk/VertexBufferBuilder.js for more details.
	 */
	zvp.VertexBufferReader = function(geometry, useInstancing) {
		this.vb = geometry.vb.buffer;
		this.vbf = new Float32Array(this.vb);
		this.vbi = new Int32Array(this.vb);

		this.ib = geometry.ib;

		this.stride = geometry.vbstride;
		this.vcount = this.vbf.length / this.stride;

		this.useInstancing = !!useInstancing;
	};

	zvp.VertexBufferReader.prototype.getDbIdAt = function(vindex) {
		return this.vbi[vindex * this.stride + VBB_DBID_OFFSET];
	};

	zvp.VertexBufferReader.prototype.getVertexFlagsAt = function(vindex) {
		return this.vbi[vindex * this.stride + VBB_FLAGS_OFFSET];
	};

	zvp.VertexBufferReader.prototype.getLayerIndexAt = function(vindex) {
		return this.vbi[vindex * this.stride + VBB_LAYER_VP_OFFSET] & 0xffff;
	};

	zvp.VertexBufferReader.prototype.getViewportIndexAt = function(vindex) {
		return(this.vbi[vindex * this.stride + VBB_LAYER_VP_OFFSET] >> 16) & 0xffff;
	};

	zvp.VertexBufferReader.prototype.decodeLineAt = function(vindex, layer, vpId, callback) {
		if(!callback.onLineSegment) {
			return;
		}

		var baseOffset = this.stride * vindex;
		var x0 = this.vbf[baseOffset];
		var y0 = this.vbf[baseOffset + 1];
		var angle = this.vbf[baseOffset + 2];
		var distAlong = this.vbf[baseOffset + 3];

		var x1 = x0 + distAlong * Math.cos(angle);
		var y1 = y0 + distAlong * Math.sin(angle);

		callback.onLineSegment(x0, y0, x1, y1, vpId);
	};

	zvp.VertexBufferReader.prototype.decodeCircularArcAt = function(vindex, layer, vpId, callback) {
		if(!callback.onCircularArc) {
			return;
		}

		var baseOffset = this.stride * vindex;
		var cx = this.vbf[baseOffset];
		var cy = this.vbf[baseOffset + 1];
		var start = this.vbf[baseOffset + 2];
		var end = this.vbf[baseOffset + 3];
		var radius = this.vbf[baseOffset + 5];

		callback.onCircularArc(cx, cy, start, end, radius, vpId);
	};

	zvp.VertexBufferReader.prototype.decodeEllipticalArcAt = function(vindex, layer, vpId, callback) {
		if(!callback.onEllipticalArc) {
			return;
		}

		var baseOffset = this.stride * vindex;
		var cx = this.vbf[baseOffset];
		var cy = this.vbf[baseOffset + 1];
		var start = this.vbf[baseOffset + 2];
		var end = this.vbf[baseOffset + 3];
		var major = this.vbf[baseOffset + 5];
		var minor = this.vbf[baseOffset + 10];
		var tilt = this.vbf[baseOffset + 11];

		callback.onEllipticalArc(cx, cy, start, end, major, minor, tilt, vpId);
	};

	zvp.VertexBufferReader.prototype.decodeTexQuadAt = function(vindex, layer, vpId, callback) {
		if(!callback.onTexQuad) {
			return;
		}

		var baseOffset = this.stride * vindex;
		var centerX = this.vbf[baseOffset];
		var centerY = this.vbf[baseOffset + 1];
		// yes, this is in a different order than output, following VertexBufferBuilder's order
		var rotation = this.vbf[baseOffset + 2];
		var width = this.vbf[baseOffset + 3];
		var height = this.vbf[baseOffset + 4];

		callback.onTexQuad(centerX, centerY, width, height, rotation, vpId);
	};

	zvp.VertexBufferReader.prototype.decodeOneTriangleAt = function(vindex, layer, vpId, callback) {
		if(!callback.onOneTriangle) {
			return;
		}

		var baseOffset = this.stride * vindex;
		var x1 = this.vbf[baseOffset];
		var y1 = this.vbf[baseOffset + 1];
		var x2 = this.vbf[baseOffset + 2];
		var y2 = this.vbf[baseOffset + 3];
		var x3 = this.vbf[baseOffset + 4];
		var y3 = this.vbf[baseOffset + 5];

		callback.onOneTriangle(x1, y1, x2, y2, x3, y3, vpId);
	};

	zvp.VertexBufferReader.prototype.decodeTriangleIndexed = function(vi0, vi1, vi2, layer, vpId, callback) {
		if(!callback.onOneTriangle) {
			return;
		}

		var baseOffset = this.stride * vi0;
		var x1 = this.vbf[baseOffset];
		var y1 = this.vbf[baseOffset + 1];

		baseOffset = this.stride * vi1;
		var x2 = this.vbf[baseOffset];
		var y2 = this.vbf[baseOffset + 1];

		baseOffset = this.stride * vi2;
		var x3 = this.vbf[baseOffset];
		var y3 = this.vbf[baseOffset + 1];

		callback.onOneTriangle(x1, y1, x2, y2, x3, y3, vpId);
	};

	// used by the snapper and by the bounds finder
	zvp.VertexBufferReader.prototype.enumGeomsForObject = function(dbId, callback) {
		if(this.useInstancing) {

			//When instancing is used, each geometry primitive is encoded into a single vertex
			//and there is no index buffer.

			var i = 0;
			while(i < this.vcount) {
				var flag = this.getVertexFlagsAt(i);

				//var vertexId    = (flag >>  0) & 0xff;        //  8 bit
				var geomType = (flag >> 8) & 0xff; //  8 bit
				//var linePattern = (flag >> 16) & 0xff;        //  8 bit
				var layerId = this.getLayerIndexAt(i); // 16 bit
				var vpId = this.getViewportIndexAt(i); // 16 bit

				var visible = this.getDbIdAt(i) === dbId;
				if(visible) {
					switch(geomType) {
						case VBB_GT_LINE_SEGMENT:
							this.decodeLineAt(i, layerId, vpId, callback);
							break;
						case VBB_GT_ARC_CIRCULAR:
							this.decodeCircularArcAt(i, layerId, vpId, callback);
							break;
						case VBB_GT_ARC_ELLIPTICAL:
							this.decodeEllipticalArcAt(i, layerId, vpId, callback);
							break;
						case VBB_GT_TEX_QUAD:
							this.decodeTexQuadAt(i, layerId, vpId, callback);
							break;
						case VBB_GT_ONE_TRIANGLE:
							this.decodeOneTriangleAt(i, layerId, vpId, callback);
							break;
						default:
							break;
					}
				}

				//In the case of instancing, there is no vertex duplication and no index buffer, we just
				//move to the next vertex
				i += 1;
			}
		} else {

			var i = 0;
			while(i < this.ib.length) {
				var vi = this.ib[i];
				var flag = this.getVertexFlagsAt(vi);

				//var vertexId    = (flag >>  0) & 0xff;        //  8 bit
				var geomType = (flag >> 8) & 0xff; //  8 bit
				//var linePattern = (flag >> 16) & 0xff;        //  8 bit
				var layerId = this.getLayerIndexAt(vi); // 16 bit
				var vpId = this.getViewportIndexAt(vi); // 16 bit

				var visible = this.getDbIdAt(vi) === dbId;

				if(geomType === VBB_GT_TRIANGLE_INDEXED) {

					//Triangles are encoded in three vertices (like a simple mesh) instead of 4 like everything else

					if(visible) {
						this.decodeTriangleIndexed(this.ib[i], this.ib[i + 1], this.ib[i + 2], layerId, vpId, callback);
					}

					//Advance to the next primitive
					i += 3;

				} else {

					if(visible) {
						switch(geomType) {
							case VBB_GT_LINE_SEGMENT:
								this.decodeLineAt(vi, layerId, vpId, callback);
								break;
							case VBB_GT_ARC_CIRCULAR:
								this.decodeCircularArcAt(vi, layerId, vpId, callback);
								break;
							case VBB_GT_ARC_ELLIPTICAL:
								this.decodeEllipticalArcAt(vi, layerId, vpId, callback);
								break;
							case VBB_GT_TEX_QUAD:
								this.decodeTexQuadAt(vi, layerId, vpId, callback);
								break;
							case VBB_GT_ONE_TRIANGLE:
								this.decodeOneTriangleAt(vi, layerId, vpId, callback);
								break;
							default:
								break;
						}
					}

					//Skip duplicate vertices (when not using instancing and the geometry is not a simple polytriangle,
					//each vertex is listed four times with a different vertexId flag
					i += 6;
				}

			}
		}

	};

	/**
	 * Used by the bounds finder.
	 * @param {array[number]} layerIdsVisible - list of layer ids that are visible
	 * @param {function} callback
	 * @private
	 */
	zvp.VertexBufferReader.prototype.enumGeomsForVisibleLayer = function(layerIdsVisible, callback) {
		if(this.useInstancing) {

			//When instancing is used, each geometry primitive is encoded into a single vertex
			//and there is no index buffer.

			var i = 0;
			while(i < this.vcount) {
				var flag = this.getVertexFlagsAt(i);

				//var vertexId    = (flag >>  0) & 0xff;        //  8 bit
				var geomType = (flag >> 8) & 0xff; //  8 bit
				//var linePattern = (flag >> 16) & 0xff;        //  8 bit
				var layerId = this.getLayerIndexAt(i); // 16 bit
				var vpId = this.getViewportIndexAt(i); // 16 bit

				// Get the bounds of only the visible layers. Ignore layer 0, which is always the page.
				// If layerId visibility is not set, consider the layer visible.
				var visible = !layerIdsVisible || (layerId !== 0 && layerIdsVisible.indexOf(layerId) !== -1);
				if(visible) {
					switch(geomType) {
						case VBB_GT_LINE_SEGMENT:
							this.decodeLineAt(i, layerId, vpId, callback);
							break;
						case VBB_GT_ARC_CIRCULAR:
							this.decodeCircularArcAt(i, layerId, vpId, callback);
							break;
						case VBB_GT_ARC_ELLIPTICAL:
							this.decodeEllipticalArcAt(i, layerId, vpId, callback);
							break;
						case VBB_GT_TEX_QUAD:
							this.decodeTexQuadAt(i, layerId, vpId, callback);
							break;
						case VBB_GT_ONE_TRIANGLE:
							this.decodeOneTriangleAt(i, layerId, vpId, callback);
							break;
						default:
							break;
					}
				}

				//In the case of instancing, there is no vertex duplication and no index buffer, we just
				//move to the next vertex
				i += 1;
			}
		} else {

			var i = 0;
			while(i < this.ib.length) {
				var vi = this.ib[i];
				var flag = this.getVertexFlagsAt(vi);

				//var vertexId    = (flag >>  0) & 0xff;        //  8 bit
				var geomType = (flag >> 8) & 0xff; //  8 bit
				//var linePattern = (flag >> 16) & 0xff;        //  8 bit
				var layerId = this.getLayerIndexAt(vi); // 16 bit
				var vpId = this.getViewportIndexAt(vi); // 16 bit

				// Get the bounds of only the visible layers. Ignore layer 0, which is always the page.
				// If layerId visibility is not set, consider the layer visible.
				var visible = !layerIdsVisible || (layerId !== 0 && layerIdsVisible.indexOf(layerId) !== -1);

				if(geomType === VBB_GT_TRIANGLE_INDEXED) {

					//Triangles are encoded in three vertices (like a simple mesh) instead of 4 like everything else

					if(visible) {
						this.decodeTriangleIndexed(this.ib[i], this.ib[i + 1], this.ib[i + 2], layerId, vpId, callback);
					}

					//Advance to the next primitive
					i += 3;

				} else {

					if(visible) {
						switch(geomType) {
							case VBB_GT_LINE_SEGMENT:
								this.decodeLineAt(vi, layerId, vpId, callback);
								break;
							case VBB_GT_ARC_CIRCULAR:
								this.decodeCircularArcAt(vi, layerId, vpId, callback);
								break;
							case VBB_GT_ARC_ELLIPTICAL:
								this.decodeEllipticalArcAt(vi, layerId, vpId, callback);
								break;
							case VBB_GT_TEX_QUAD:
								this.decodeTexQuadAt(vi, layerId, vpId, callback);
								break;
							case VBB_GT_ONE_TRIANGLE:
								this.decodeOneTriangleAt(vi, layerId, vpId, callback);
								break;
							default:
								break;
						}
					}

					//Skip duplicate vertices (when not using instancing and the geometry is not a simple polytriangle,
					//each vertex is listed four times with a different vertexId flag
					i += 6;
				}

			}
		}

	};

	/**
	 * Callback class for calculating bounds of 2D objects via VertexBufferReader
	 * @private
	 */
	function BoundsCallback(bounds) {
		this.bounds = bounds;
		// workspace, so we don't reallocate this each time
		this.point = new THREE.Vector4();
		this.point.z = 0.0;
		this.point.w = 1.0; // it's a point, not a vector
	}

	BoundsCallback.prototype.onVertex = function(cx, cy, vpId) {
		this.point.x = cx;
		this.point.y = cy;
		this.bounds.expandByPoint(this.point);
	};

	BoundsCallback.prototype.onLineSegment = function(x1, y1, x2, y2, vpId) {
		this.onVertex(x1, y1);
		this.onVertex(x2, y2);
	};

	BoundsCallback.prototype.onCircularArc = function(cx, cy, start, end, radius, vpId) {
		this.onEllipticalArc(cx, cy, start, end, radius, radius, 0.0, vpId);
	};

	BoundsCallback.prototype.onEllipticalArc = function(cx, cy, start, end, major, minor, tilt, vpId) {
		if(tilt == 0.0) {
			// does start and end make a full ellipse?
			if((start <= 0) && (end >= 2.0 * Math.PI - 0.00001)) {
				// full way around, simply treat it like a rectangle
				this.onTexQuad(cx, cy, 2 * major, 2 * minor, tilt, vpId);
			} else {
				// Not a full ellipse. We take the start and end points and also figure
				// out the four "compass rose" points that are between these two locations.
				// The start and end locations often exist as separate vertices so would
				// already be included, but for some line types they may not exist, so we
				// include them here.
				this.point.x = cx + Math.cos(start) * major;
				this.point.y = cy + Math.sin(start) * minor;
				this.bounds.expandByPoint(this.point);
				this.point.x = cx + Math.cos(end) * major;
				this.point.y = cy + Math.sin(end) * minor;
				this.bounds.expandByPoint(this.point);

				// now check each NESW compass point, i.e., middle of each edge
				if(start > end) {
					// add right edge
					this.point.x = cx + major;
					this.point.y = cy;
					this.bounds.expandByPoint(this.point);
					// make start < end for the rest of the tests
					start -= 2.0 * Math.PI;
				}
				if(start < 0.5 * Math.PI && end > 0.5 * Math.PI) {
					// add top edge
					this.point.x = cx;
					this.point.y = cy + minor;
					this.bounds.expandByPoint(this.point);
				}
				if(start < Math.PI && end > Math.PI) {
					// add left edge
					this.point.x = cx - major;
					this.point.y = cy;
					this.bounds.expandByPoint(this.point);
				}
				if(start < 1.5 * Math.PI && end > 1.5 * Math.PI) {
					// add bottom edge
					this.point.x = cx;
					this.point.y = cy - minor;
					this.bounds.expandByPoint(this.point);
				}
			}
		} else {
			// Has a tilt.
			// From what we see, you should never reach here, as tilted ellipses are actually
			// always tessellated. So, we do a fallback: call the onTexQuad with the rotation.
			// This call will be a pretty good approximation, putting a rotated bounding box
			// around the whole ellipse. For more accuracy you would need to tessellate the
			// ellipse and get its points (especially if you don't have a full ellipse).
			this.onTexQuad(cx, cy, 2 * major, 2 * minor, tilt, vpId);

			// does start and end make a full ellipse?
			//if ( (start <= 0) && (end >= 2.0 * Math.PI - 0.00001) ) {
			//}
		}
	};

	// Currently this case does not actually come up, as textured quads, i.e., images, are
	// not something that can be selected, from what data I have tried. So I have not spent
	// any time on the rotated case.
	// TODO: this code is only partially tested: I had problems getting a selectable raster
	// object in a DWG convert to an F2D.
	BoundsCallback.prototype.onTexQuad = function(centerX, centerY, width, height, rotation, vpId) {
		var halfWidth = 0.5 * width;
		var halfHeight = 0.5 * width;
		if(rotation == 0.0) {
			this.onVertex(centerX - halfWidth, centerY - halfHeight);
			this.onVertex(centerX + halfWidth, centerY + halfHeight);
		} else {
			// A more complex rectangle, rotated. Take the four corners and rotate each
			// around the center.
			var rmtx = new THREE.Matrix4(); // Matrix3() does not have enough helper methods
			var mtx = new THREE.Matrix4();
			// Take a rectangle centered at the origin, rotate it, translate it to the final
			// position. Each corner is added to the bounds.
			rmtx.makeRotationZ(rotation);
			// put it into the final position:
			mtx.makeTranslation(centerX, centerY, 0.0);
			mtx.multiply(rmtx);

			for(var i = 0; i < 4; i++) {
				this.point.x = (((i % 2) == 1) ? halfWidth : -halfWidth);
				this.point.y = ((i >= 2) ? halfHeight : -halfHeight);
				this.point.applyMatrix4(mtx);
				this.bounds.expandByPoint(this.point);
			}
		}
	};

	BoundsCallback.prototype.onOneTriangle = function(x1, y1, x2, y2, x3, y3, vpId) {
		this.onVertex(x1, y1);
		this.onVertex(x2, y2);
		this.onVertex(x3, y3);
	};

	zvp.BoundsCallback = BoundsCallback;

})();;