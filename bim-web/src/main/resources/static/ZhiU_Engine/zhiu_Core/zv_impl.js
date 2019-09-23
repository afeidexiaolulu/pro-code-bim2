


// Viewer3D offers public methods for developers to use.
// Viewer3DImpl is the implementation file for Viewer3D and is only used by Viewer3D.js
// 公共方法部分
// Viewer3D does things like parameter validation.
// Viewer3DImpl does the actual work, by interfacing with other internal components, such as the MaterialManager.

var zv = ZhiUTech.Viewing,
	zvp = ZhiUTech.Viewing.Private;

var ENABLE_DEBUG = false; // zvp.ENABLE_DEBUG || false;

(function() {

	"use strict";

	//default parameters for WebGL initialization
	zv.InitParametersSetting = {
		canvas: null,
		antialias: false,
		alpha: false,
		premultipliedAlpha: false,
		preserveDrawingBuffer: true,
		stencil: false,
		depth: false,
		devicePixelRatio: null
	};

	//progress state
	zv.ProgressState = {
		ROOT_LOADED: 0,
		LOADING: 1,
		RENDERING: 2
	};

	/** @constructor */
	function Viewer3DImpl(thecanvas, theapi) {
		var _this = this;

		//Frame time cutoffs in milliseconds. We target the middle value,
		//but adjust the CPU-side work in the give min/max range
		//once we measure actual frame times (including async GPU work, system load, etc).
		//NOTE: These are doubled for mobile devices at construction time (end of this file).
		var MAX_FRAME_BUDGET = 1000 / 15,
			TARGET_FRAME_TIME = 1000 / 30,
			MIN_FRAME_BUDGET = 1000 / 120; //We aren't hoping for 120 fps -- this is just how often tick() gets called
		//not counting GPU latency, etc.

		var _currentLightPreset = -1;
		var _oldLightPreset = -1;

		var _worldUp;
		var _worldUpName = "y";

		var _reqid, _needsResize, _newWidth, _newHeight, _materials;
		var _webglrender, _renderer;

		var _shadowMaps;

		// Default direction in world-space from which we get the most light from. Needed for shadow casting.
		// The default is only used if no direction is specified by light preset or model.
		var _shadowLightDirDefault = null; // {THREE.Vector3}
		var _shadowLightDir = null; //

		var _lightDirDefault = null;

		var _needsClear = false,
			_needsRender = false,
			_overlayDirty = false,
			_highlightDirty = false;
		//var _spectorDump = false;

		var _progressEvent = {
			type: ZhiUTech.Viewing.PROGRESS_UPDATE_EVENT,
			state: ZhiUTech.Viewing.ProgressState.LOADING,
			percent: 0
		};

		var _sceneDirty = false;

		// A "silent render" means to do a full, but interruptible, render in the background. Display the result on completion.
		// The idea is to make a good-quality render after a progressive render occurs, or after some new content has been loaded,
		// or some other situation where we don't want to "lose progress," that is, we don't want to do a progressive render but
		// rather want to add to or modify an existing render on the screen.
		var _deferredSilentRender = false;
		var _immediateSilentRender = false;

		var _cameraUpdated;

		var _explodeScale = 0;

		var _lastHighResTimeStamp = 0;

		var _frameTimeAvg = 1000.0 / 60.0;
		var _frameTimeSamples = 0;

		var _isLoading = true; // turned off in onLoadComplete()

		var _groundShadow, _groundReflection;

		var _envMapBackground = false;

		var _modelQueue;

		var _lightsInitialized = false;
		var _defaultLightIntensity = 1.0;
		var _defaultDirLightColor = null; // {THREE.Color}
		var _defaultAmbientColor = null; //

		var _lmvDisplay = zv.getGlobal(); // return 'window', or something else for NodeJs context that won't work anyways.

		// render command system
		var _rcs;

		var _memoryLimit;

		var _pagingOptions = {
			visibleIdCB: function() {
				return _renderer ? _renderer.copyOcclusionIds() : null;
			},
			occlusionTestCB: function(boxes, threshold, fragIds, useInstancing, packId) {
				return _renderer ? _renderer.occlusionTest(boxes, threshold, fragIds, useInstancing, packId) : Promise.resolve(true);
			}
		};

		// we assume the program starts in a "doing work" state
		var _workPreviousTick = true;
		var _workThisTick;

		if(thecanvas) {
			setInterval(function() {
				// Only start reporting the framerate to ADP when there's been "enough" samples
				if(_isLoading || _frameTimeSamples < 60) {
					return;
				}
				_this.track({
					name: 'fps',
					value: Number(_this.fps().toFixed(2)),
					aggregate: 'last'
				});
			}, 30000);
		}

		this.api = theapi;
		this.canvas = thecanvas;
		this.loader = null;
		this.canvasBoundingclientRectDirty = true;

		//Slower initialization pieces can be delayed until after
		//we start loading data, so they are separated out here.
		this.initialize = function() {

			_worldUp = new THREE.Vector3(0, 1, 0);
			_modelQueue = new zvp.RenderScene();

			//TODO: node webgl renderer
			_webglrender = createRenderer(thecanvas);
			if(!_webglrender && !zv.isNodeJS) {
				return;
			}

			_renderer = new zvp.RenderContext();
			_renderer.init(_webglrender, thecanvas ? thecanvas.clientWidth : 0, thecanvas ? thecanvas.clientHeight : 0);
			this.use2dInstancing = zv.isMobileDevice() && this.glrenderer().supportsInstancedArrays();

			_materials = new zvp.createMaterialManager(_webglrender);

			//this.camera = new THREE.CombinedCamera( w, h, VIEW_ANGLE, NEAR, FAR, NEAR, FAR);
			// this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, thecanvas.clientWidth/thecanvas.clientHeight, NEAR, FAR);
			// this.cameraChangedEvent = {type: ZhiUTech.Viewing.CAMERA_CHANGE_EVENT, camera: this.camera};
			//this.camera = new THREE.CombinedCamera( w, h, VIEW_ANGLE, NEAR, FAR, NEAR, FAR);
			zvp.init_UnifiedCamera(THREE);
			this.camera = new zv.UnifiedCamera(thecanvas ? thecanvas.clientWidth : 512, thecanvas ? thecanvas.clientHeight : 512);
			this.lightsOn = false;
			// we'll fill this in later, in initLights.
			this.lights = [];
			this.highlight_lights = [];
			// pass in when lightsOn is false;
			this.no_lights = [];

			_defaultDirLightColor = new THREE.Color().setRGB(1, 1, 1);
			_defaultAmbientColor = new THREE.Color().setRGB(1, 1, 1);

			// this.camera = this.unicam.getOrthographicCamera();
			this.cameraChangedEvent = {
				type: zv.CAMERA_CHANGE_EVENT,
				camera: this.camera
			};

			_shadowLightDirDefault = new THREE.Vector3(1, 1, 1); // which does not match the _lightDirDefault
			_shadowLightDir = new THREE.Vector3().copy(_shadowLightDirDefault);
			_lightDirDefault = new THREE.Vector3(-1, 0, 1); // a horizontal light, which is not a good default shadowd direction

			//This scene will just hold the camera and lights, while
			//we keep groups of progressively rendered geometry in
			//separate geometry scenes.
			this.scene = new THREE.Scene();
			this.sceneAfter = new THREE.Scene();
			this.sceneAfter.sortObjects = false;

			this.renderAfters = new zvp.RenderCallbacks();

			this.overlayScenes = {};

			this.selectionMaterial2d = null;

			setupSelectionHighlight();

			// no override materials for the scene for selected point clouds, because it overwrites the point size setting.
			// instead we overwrite the material for the duplicated geometry in this.highlightFragment()
			this.createOverlayScene("selection_points", null, null);

			this.selectionMeshes = {};

			this.fadeMaterial = new THREE.MeshPhongMaterial({
				color: 0xffffff,
				opacity: 0.1,
				reflectivity: 0,
				transparent: true,
				depthWrite: false
			});
			this.fadeMaterial.packedNormals = true;
			_materials.addInstancingSupport(this.fadeMaterial);
			_materials.addMaterial("__fadeMaterial__", this.fadeMaterial, true);

			this.setSelectionColor(0xFF8C00);

			//Settings exposed to GUI:
			this.progressiveRender = true;
			this.swapBlackAndWhite = false;

			this.targetFrameBudget = TARGET_FRAME_TIME;

			// How many ticks pass in between updates. Make this half as many for mobile because the frame budget is doubled.
			// 1 means that we display every frame
			this.frameDisplayRate = 5;
			if(zv.isMobileDevice()) {
				MAX_FRAME_BUDGET *= 2; // Increase to match TARGET_FRAME_TIME
				MIN_FRAME_BUDGET /= 2; // GPUs are slower on mobile, so allow the frame budget to be smaller
				TARGET_FRAME_TIME *= 2; // GPUs are slower on mobile use a longer target frame time
				this.targetFrameBudget /= 2; // Even though the target's doubled, start the budget smaller and have it work up to the target (ask Cleve)
				this.frameDisplayRate /= 2; // since time per tick is doubled (in the long run), halve the number of ticks to give the same wall-clock delay interval
			}
			// How much time between checks on a full frame for any interrupt signal.
			this.interruptBudget = 1e10;

			this.controls = {
				update: function(timeStamp) {
					this.camera.lookAt(this.camera.target);
					this.camera.updateProjectionMatrix();
					this.camera.dirty = false;
				},
				handleResize: function() {},
				recordHomeView: function() {},
				uninitialize: function() {},
				isToolActivated: function() {
					return false;
				}
			};

			this.selector = new zvp.MultiModelSelector(this);

			this.visibilityManager = new zvp.MultiModelVisibilityManager(this);

			this.showGhosting = true;
			this.showOverlaysWhileMoving = true;
			this.skipAOWhenMoving = false;

			this.keyFrameAnimator = null;
			this.zoomBoundsChanged = true;

			var cc = zvp.LightPresets[zvp.DefaultLightPreset].bgColorGradient;
			this.setClearColors(cc[0], cc[1], cc[2], cc[3], cc[4], cc[5]);

			_groundShadow = new zv.Shaders.GroundShadow(_webglrender);
			_groundShadow.enabled = true;

			_rcs = new RenderCommandSystem();

			// TODO_NOP: hack register materials for cutplanes
			_materials.addMaterialNonHDR("groundShadowDepthMaterial", _groundShadow.getDepthMaterial());
			_materials.addOverrideMaterial("normalsMaterial", _renderer.getDepthMaterial());
			_materials.addOverrideMaterial("edgeMaterial", _renderer.getEdgeMaterial());

			//just meant to do an initial clear to the background color we want.
			_renderer.beginScene(this.scene, this.camera, this.noLights, true);
			_renderer.composeFinalFrame(true, zv.isIE11);

			this._loaderDelegate = {
				// Object loader can use to fire events and listen for events
				eventTarget: this.api,
				// Web worker object
				workerScript: zvp.workerScript,
				// WebGLRenderer
				webGLRenderer: this.glrenderer(),
				// The material manager
				matman: this.matman(),
				// The render scene that will hold the loaded model
				renderScene: this.modelQueue(),
				// The model class
				model: zv.Model,

				// init geometry cache for OTG-files
				getGeomCache: function() {
					// In this function, this is the delegate itself or a copy of it
					return _this.geomCache ||
						(_this.geomCache = new WGS.OtgGeomCache(this, function() {
							return _this.camera;
						}));
				},
				// Initialize message to a web worker
				initLoadContext: zvp.initLoadContext,
				// Request that the application redraw the display.
				requestRedraw: function(needsClear) {
					_this.invalidate(needsClear, true);
				},
				// Report a network failure
				reportError: function(code, msg) {
					zvp.logger.error(msg, zv.errorCodeString(code));
				},
				// Signal progress of the load
				signalProgress: function(progress) {
					_this.signalProgress(progress, zv.ProgressState.LOADING);
				},
				// Load the property data base
				loadPropertyDb: function(sharedDbPath, model) {
					var esd = model.getData();
					esd.propDbLoader = new WGS.PropDbLoader(sharedDbPath, model, model.loader.delegate);
					esd.propDbLoader.load();
				},
				// Load the textures for a model
				loadModelTextures: function(model) {
					WGS.TextureLoader.loadModelTextures(model.loader.delegate, model);
				},
				toggleTwoSided: function(twoSided) {
					_renderer.toggleTwoSided(twoSided);
				},
				// Extra properties for loaders not converted to WGS
				zuv3DImpl: this,
			};

			this._loaderDelegate.eventTarget.addEventListener(WGS.FILE_LOAD_STARTED, function(event) {
				_this._addLoadingFile(event.loader);
			}, false);
			this._loaderDelegate.eventTarget.addEventListener(WGS.GEOMETRY_DOWNLOAD_COMPLETE, function(event) {
				if(event.memoryLimited)
					_this.onDemandLoadComplete(event.model);
				else
					_this.onLoadComplete(event.model);
			}, false);

			// Enable and disable feature based on whether we are memory limited.
			_memoryLimit = function() {
				// Are there any memory limited models in the scene.
				var memoryLimited = !!_modelQueue.getMemoryInfo();
				// Disable/enable features based on result.
				_materials.toggleDepthWriteTransparent(!memoryLimited);
				_renderer.setMemoryLimited(memoryLimited);
				if(memoryLimited) {
					this.toggleGroundReflection(false);
					this.toggleGroundShadow(false);
				}
			}.bind(this);
			this.api.addEventListener(ZhiUTech.Viewing.MODEL_ROOT_LOADED_EVENT, _memoryLimit);
			this.api.addEventListener(zv.MODEL_UNLOADED_EVENT, _memoryLimit);
		};

		function createRenderer(canvas) {

			if(!canvas)
				return null;

			//TODO: improve the pixel scale heuristics below
			var dpr = window.devicePixelRatio;
			if(!dpr) dpr = 1;

			//High density display -- turn off antialiasing since
			//it's not worth the slowdown in that case.
			//if (dpr >= 2.0)
			//    _settings.antialias = false;

			//Expose the pramaters to outside so that we could set these params on HTML.
			var params = zv.InitParametersSetting;
			params.canvas = canvas;
			params.devicePixelRatio = dpr;
			params.stencil = true;

			var renderer = new zvp.FireflyWebGLRenderer(params);

			if(!renderer.context)
				return null;

			renderer.autoClear = false;

			//Turn off scene sorting by THREE -- this is ok if we
			//do progressive draw in an order that makes sense
			//transparency-wise. If we start drawing using a frustum culling
			//r-tree or there are problems with transparency we'd have to turn on sorting.
			renderer.sortObjects = false;

			return renderer;
		}

		//Bridge between the render queue and render context
		//For passing pieces of model to the renderer during
		//timed progressive rendering, while also taking into account
		//the current rendering mode of the viewer
		function renderSomeCallback(scene) {

			//Ideally, here we only want the piece of the
			//render function that specifically renders geometries,
			//and none of the camera update stuff that we already do
			//once in beginProgressive() -- but this requires
			//some refactoring of THREE.WebGLRenderer.
			var phase = _rcs.phase;
			var wantColor = phase != zvp.RENDER_HIGHLIGHTED2;
			var wantSAO = phase == zvp.RENDER_NORMAL || phase == zvp.RENDER_HIGHLIGHTED1;
			var wantID = (_renderer.settings.idbuffer || _renderer.settings.occlusionid) && phase != zvp.RENDER_HIDDEN;
			var wantHighlight = (phase == zvp.RENDER_HIGHLIGHTED1 || phase == zvp.RENDER_HIGHLIGHTED2) ? 15 : 0;

			// Need to handle occlusion ids. If we need occlusionids, then don't include transparent objects
			if(wantID && _renderer.settings.occlusionid &&
				scene instanceof zvp.RenderBatch && scene.sortObjects) {
				wantID = false;
			}

			if(phase == zvp.RENDER_HIDDEN)
				scene.overrideMaterial = _this.fadeMaterial;

			_renderer.renderScenePart(scene, wantColor, wantSAO, wantID, wantHighlight);

			scene.overrideMaterial = null;

		}

		function updateFPS(highResTimeStamp) {
			_frameTimeSamples++;

			if((_lastHighResTimeStamp <= highResTimeStamp) && (_lastHighResTimeStamp > 0)) {
				_frameTimeAvg = _frameTimeAvg * 0.8 + (highResTimeStamp - _lastHighResTimeStamp) * 0.2;
			}

			if(_this.fpsCallback)
				_this.fpsCallback(_this.fps());
		}

		function updateAnimations(highResTimeStamp) {
			if(_this.keyFrameAnimator) {
				var delta = _lastHighResTimeStamp > 0 ? (highResTimeStamp - _lastHighResTimeStamp) / 1000 : 0;
				var updateFlags = _this.keyFrameAnimator.update(delta);
				if(updateFlags) {
					_this.sceneUpdated(true);
					if(updateFlags & _this.keyFrameAnimator.UPDATE_CAMERA)
						return true;
				}
			}
			return false;
		}

		function updateCanvasSize() {
			if(_needsResize) {
				_this.canvasBoundingclientRectDirty = true;
				_this.camera.aspect = _newWidth / _newHeight;
				_this.camera.clientWidth = _newWidth;
				_this.camera.clientHeight = _newHeight;
				_renderer.setSize(_newWidth, _newHeight);
				_this.controls.handleResize();
				if(_groundReflection)
					_groundReflection.setSize(_newWidth, _newHeight);
				_this.invalidate(true, true, true);
				_needsResize = false;
				_this.api.dispatchEvent({
					type: zv.VIEWER_RESIZE_EVENT,
					width: _newWidth,
					height: _newHeight
				});
			}
		}

		this.renderGroundShadow = function(target) {

			// If shadow maps are active, we don't use _groundShadow for the ground. Instead, the ground is
			// rendered using the shadow map as well.
			if(_shadowMaps) {
				if(_shadowMaps.state == zvp.SHADOWMAP_VALID) {
					_shadowMaps.renderGroundShadow(_this.camera, target || _renderer.getColorTarget());
				}
			} else {
				_groundShadow.renderShadow(_this.camera, target || _renderer.getColorTarget());
				_groundShadow.rendered = true;
			}
		};

		// Set any information needed for the ground plane reflection, drop shadow, or shadow map projection
		function updateGroundTransform() {
			// if we're not using the ground shadow or reflection, or it's a 2D drawing, return
			if(!_groundShadow.enabled && !_groundReflection || _this.is2d)
				return;

			// Get the box of all the scene's data
			var groundBox;
			if(_this.model && !_this.model.isLoadDone()) {
				groundBox = _this.model.getData().bbox;
			} else {
				groundBox = _this.getVisibleBounds(true, false);
			}
			// If there's nothing to see, return
			if(!groundBox)
				return;

			var camera = _this.camera;
			var bbox = groundBox.clone();

			var rightAxis = new THREE.Vector3(1, 0, 0);

			var shadowDir = _shadowLightDir.clone();

			// Transform bbox, rightAxis, and shadowDir using worldUpTransform. For the resulting box, we
			// can safely assume that y is the up-direction
			if(camera.worldUpTransform) {
				bbox.applyMatrix4(camera.worldUpTransform);
				rightAxis.applyMatrix4(camera.worldUpTransform);
				shadowDir.applyMatrix4(camera.worldUpTransform);
			}

			// expand the box downwards by 0.5%. The effect of this is just that the
			// ground plane does not touch the world box, but is slightly below it
			bbox.min.y -= 0.005 * (bbox.max.y - bbox.min.y);

			if(_shadowMaps) {
				_shadowMaps.expandByGroundShadow(bbox, shadowDir);
			}

			// get size and center
			var bsize = bbox.size();
			var bcenter = bbox.center();

			// apply some adjustments specific for drop-shadow
			if(!_shadowMaps) {
				// add some horizontal margin so that blurring is not clipped at the boundaries
				bsize.x *= 1.25;
				bsize.z *= 1.25;

				// expand to square, because the texture is squared as well
				bsize.x = bsize.z = Math.max(bsize.x, bsize.z);
			}

			// Rotate center back to world-coords.
			if(camera.worldUpTransform) {
				var worldUpInverse = new THREE.Matrix4().getInverse(camera.worldUpTransform);
				bcenter.applyMatrix4(worldUpInverse);

				// Note that we leave size vector as it is. I.e., only the center is transformed back to world-coords.
				// The size vector keeps as it is, i.e. the bbox defined by (center, size) is still aligned with
				// the rotated axes. In other worlds
				//  - size.x is the extent along worldUpTransform * (1,0,0) = rightAxis
				//  - size.y is the extent along worldUpTransform * (0,1,0) = camera.worldUp
				//  - size.z is the extent along worldUpTransform * (0,0,1)
			}

			_groundShadow.setTransform(
				bcenter,
				bsize,
				camera.worldup,
				rightAxis
			);

			if(_groundReflection) {
				var groundPos = (new THREE.Vector3()).subVectors(bcenter, camera.worldup.clone().multiplyScalar(bsize.y / 2));
				_groundReflection.setTransform(groundPos, camera.worldup, bsize);
			}

			if(_shadowMaps) {
				_shadowMaps.setGroundShadowTransform(bcenter, bsize, camera.worldup, rightAxis);
			}
		}

		function updateScene() {
			if(_sceneDirty) {
				// If the model had changed, the ground-plane, etc., may have changed, so recompute
				updateGroundTransform();
				_groundShadow.setDirty();
				_sceneDirty = false;
				return true;
			} else {
				return false;
			}
		}

		function updateOverlays(highResTimeStamp) {

			//Update the selection set cloned meshes
			for(var id in _this.selectionMeshes) {

				var m = _this.selectionMeshes[id];
				if(m.model) {
					var fragList = m.model.getFragmentList();

					// If the proxy uses original geometry of the fragment, update its matrix.
					// If the geometry does not match, it is a consolidated or instanced mesh.
					// For these, the matrix is already baked into vertex buffer or
					// index buffer. We don't support animation for these.
					if(m.geometry === fragList.getGeometry(m.fragId)) {
						fragList.getWorldMatrix(m.fragId, m.matrix);
					}
				}
			}

		}

		function invalidateShadowMap() {
			if(_shadowMaps) {
				_shadowMaps.state = zvp.SHADOWMAP_NEEDS_UPDATE;
			}
		}

		var _screenDrawnFlags = {
			NOTHING_DRAWN: 0,
			MODEL_DRAWN: 1,
			BACKGROUND_DRAWN: 2,
			OVERLAY_DRAWN: 4,
			REFLECTION_DRAWN: 8,
			ALL_DRAWN: 15
		};

		// The render command system is what actually does the render. The idea here is that each tick() checks if anything causes a new
		// render. If so, then we make a new list of commands to perform, then start performing them. For a full render without interruptions,
		// this is overkill - we could just lockstep execute them all. Where the command list comes into its own is that it can be continued.
		// For progressive rendering we want 
		// Rather than pepper the rendering sequence of the code with lots of "if" statements that
		function RenderCommandSystem() {
			this.highResTimeStamp = -1;
			// did something get rendered that would change the screen (almost always true when rendering occurs)?
			this.screenDrawn = _screenDrawnFlags.NOTHING_DRAWN;
			// did a Present get done?
			this.screenHasChanged = false;
			// how much time we are given to render things during each execution, in ms.
			this.frameBudget = 0;
			// how much time we have left to render stuff during this tick(), in ms.
			this.frameRemaining = 0;
			// what type of render is happening currently
			this.phase = zvp.RENDER_NORMAL;
			// Only use the stencil when we need to draw highlight pass
			this.useStencil = false;
			// show the amount of the scene rendered. TODO this doesn't really work right with ghosting or shadow mapping on, as those also affect it.
			this.signalProgressByRendering = false;

			// How many ticks have executed the current command list. Good for knowing if we're on the first frame (tick 0).
			this.tickCount = 0;
			// average time spent rendering a tick() TODO - needs to be revisited and thought through: if a batch is not loaded, it displays really fast!
			this.beginFrameAvg = 0;
			// exactly what it says, the time stamp passed in on the previous tick().
			this.lastBeginFrameTimeStamp = 0;

			// various types of rendering
			this.RENDERMODE_FULL = 0;
			this.RENDERMODE_PROGRESSIVE = 1;
			this.RENDERMODE_SILENT = 2;
			// type of rendering being done.
			this.renderType = this.RENDERMODE_FULL;

			// First frame budget
			// If it's progressive and the first frame, try to finish the ground shadow in the allocated time
			this.INITIAL_GROUND_SHADOW = 0.2;

			// Internal command iterator state
			// is there a command list to execute?
			this.cmdListActive = false;
			// what command we are executing
			this.cmdIndex = 0;
			// was execution terminated for this tick()?
			this.continueExecution = true;
			// are there "CMD_ALWAYS_DO" commands in the command list? If so, we need to traverse the whole command list each tick.
			this.encounteredAlwaysDo = false;
			// did the full render finish? If not, then ignore overlay and present updates until it has
			this.finishedFullRender = true;
			// did the ground shadow get computed in the post-process for deferred rendering?
			this.groundShadowInPost = false;
			// did any previous or current frame trigger the overlay to be drawn?
			this.drawOverlay = false;

			// true means parameters can be set on the command
			this.cmdIsOpen = false;

			// how long the array is (so that if new commands/params are needed, they get allocated first).
			this.allocArraySize = 0;
			// how many commands are in the active command list
			this.cmdListLength = 0;
			// the command and parameters set for the command
			this.cmdList = [];
			this.paramList = [];

			// command states
			this.CMD_NORMAL_SEQUENCE = 0;
			this.CMD_DO_AFTER = 1;
			this.CMD_ALWAYS_DO = 2;

			this.isActive = function() {
				return this.cmdListActive;
			};

			this.setFrame = function(timeBudget) {
				this.frameBudget = timeBudget;
			};

			// signal the beginning of a new set of commands
			this.beginCommandSet = function() {
				this.cmdListActive = true;
				this.cmdIndex = 0;
				this.cmdListLength = 0;
				this.encounteredAlwaysDo = false;
				this.tickCount = 0;
				this.screenDrawn = _screenDrawnFlags.NOTHING_DRAWN;
				this.screenHasChanged = false;
			};

			// signal the end
			this.endCommandSet = function() {
				if(this.cmdIsOpen) {
					this.cmdIsOpen = false;
					// close previous command - really, increment just to get the final count
					this.cmdListLength++;
				}
			};

			// Set the parameter on the currently-executed parameter. Meant for the commands above.
			this._internalSetParam = function(indexString, val) {
				this.paramList[this.cmdIndex][indexString] = val;
			};

			this.addCommand = function(func, executionLevel) {
				if(this.cmdIsOpen) {
					// close previous command
					this.cmdListLength++;
				}
				this.cmdIsOpen = true;
				while(this.allocArraySize <= this.cmdListLength) {
					this.cmdList[this.cmdListLength] = {};
					this.paramList[this.cmdListLength] = {};
					this.allocArraySize++;
				}
				this.cmdList[this.cmdListLength] = func;
				this.paramList[this.cmdListLength].executionLevel = executionLevel || this.CMD_NORMAL_SEQUENCE;
				this.encounteredAlwaysDo = this.encounteredAlwaysDo || (executionLevel === this.CMD_ALWAYS_DO);

				// return value so if we want to jump to this command, we know where to go.
				return this.cmdListLength;
			};

			// note that we're a bit sloppy with parameter setting. Since the parameter set at an index location
			// gets reused, you may see parameters in the parameter object that have nothing to do with this
			// command, since this parameter set might have been used for another command at some other time.
			// Basically, if a command doesn't use the parameter, then ignore it.
			this.setParam = function(indexString, val) {
				if(this.cmdIsOpen) {
					this.paramList[this.cmdListLength][indexString] = val;
				} else {
					if(ENABLE_DEBUG) {
						zvp.logger.error("ERROR: cannot set param when no command is open!");
					}
				}
			};

			// This method is meant for use during execution of a command, so gets the parameter from the currently-active command.
			this.getParam = function(indexString) {
				if(ENABLE_DEBUG) {
					if(this.paramList[this.cmdIndex][indexString] === undefined) {
						zvp.logger.error("ERROR: parameter " + indexString + " was never set for this command! Go fix it.");
					}
				}
				return this.paramList[this.cmdIndex][indexString];
			};

			// return true if done running all commands.
			this.executeCommandList = function() {
				if(_rcs.cmdListActive) {
					// go through command list, interrupting as needed.

					// set frame budget
					this.frameRemaining = this.frameBudget;

					if(ENABLE_DEBUG) {
						// reality check
						if(this.cmdIsOpen) {
							zvp.logger.error("ERROR: should call endCommandSet before executing");
						}
					}
					this.continueExecution = true;
					var restartIdx;
					// not at end of command list? We always go through the whole command list, as there may be "always do"
					// commands, such as a Present().
					if(ENABLE_DEBUG) {
						if(this.tickCount === 0) {
							console.log("===================");
						}
						console.log("Running commands for " + ((_rcs.renderType === _rcs.RENDERMODE_PROGRESSIVE) ? "progressive" :
								((_rcs.renderType === _rcs.RENDERMODE_FULL) ? "full" : "silent")) +
							" render, for tick count " + this.tickCount);
					}

					// Are there any "always do" commands in this command set, that must be done before we continue our command sequence?
					// Currently needed by smooth navigation, to turn off AO during the render sequence.
					if(this.encounteredAlwaysDo) {
						var idx = 0;
						while(idx < this.cmdIndex) {
							// Is this a command we should always do?
							if(this.paramList[idx].executionLevel >= _rcs.CMD_ALWAYS_DO) {
								// Commands we always do are assumed to never abort, so we don't check for failure.
								if(ENABLE_DEBUG) {
									console.log("  ALWAYS DO command " + idx + ": " + this.cmdList[idx].name);
								}
								this.cmdList[idx]();
							}
							idx++;
						}
					}

					while(this.cmdIndex < this.cmdListLength) {
						// if we are to continue execution, easy;
						// if not, then check if the next command is an "always do after", such as a Present().
						if(this.continueExecution ||
							(this.paramList[this.cmdIndex].executionLevel >= _rcs.CMD_DO_AFTER)) {
							// we're supposed to execute this command, so do it and see what it says
							if(ENABLE_DEBUG) {
								console.log("  command " + this.cmdIndex + ": " + this.cmdList[this.cmdIndex].name + " and " + _rcs.frameRemaining + " frame budget remaining");
							}

							if(this.cmdList[this.cmdIndex]()) {
								// true means stop executing, out of time (typically),
								// so restart execution at this command the next tick()
								if(ENABLE_DEBUG) {
									console.log("  >>> out of tick time with " + _rcs.frameRemaining);
								}
								restartIdx = this.cmdIndex;
								// signal to not execute any "normal sequence" commands for the rest of the command list.
								this.continueExecution = false;
							}
						}
						// Go to next command until we hit the end of the list;
						// we always continue, since there could be "always do" or "do after"
						// commands in the list that need to be executed.
						this.cmdIndex++;
					}

					// out of time or aborted for some other reason? We'll be back later...
					if(this.continueExecution) {
						// did all commands, so we're done
						this.cmdListActive = false;
					} else {
						// set where to continue the work next tick()
						this.cmdIndex = restartIdx;
					}
					this.tickCount++;

					return !this.continueExecution;
				} else {
					// not active, so "done"
					return true;
				}
			};
		}

		// Here's the system:
		// If ground shadow is done - well, that's easy, just blit it before beauty pass
		// If not done
		// 	If we are doing a full render
		//     Render the whole shadow first (possibly tick limited), blit it to screen, then continue to beauty pass
		//     Else we are doing progressive
		//        if this is the first frame:
		//           if the number of objects in the scene is low (10?),
		//              render the drop shadow, figuring we can rendering the rest of the scene in a single frame
		//           else
		//              don't bother rendering anything in later ticks (we used to waste time rendering a few each tick)	
		//        if this is a later frame:
		// 			 render just the beauty pass, until done. Don't bother with the shadow now, as it won't get used.
		//        When we get to the end of progressive:
		//           If needed, render the ground shadow until done. Once done, signal that a re-render is needed.
		// TODO - currently the on-demand loading system always does an ID map creation during rendering; it would be good to defer
		// this on non-MRT GPUs, i.e., do it after all normal rendering is done.
		function cmdGenerateGroundShadow() {
			// three cases: full render, quick out for progressive, continue as possible for progressive.
			if((_rcs.renderType === _rcs.RENDERMODE_PROGRESSIVE)) {
				if(_rcs.getParam("GenerateGroundShadow.afterBeauty")) {
					// Rendering the ground shadow after all progressive rendering is done. Signal redraw if it finishes.
					_rcs.frameRemaining = _groundShadow.prepareGroundShadow(_this.modelQueue(), 0, _rcs.frameRemaining);
					// was this the call that rendered it fully?
					if(_groundShadow.getStatus() == zvp.GROUND_RENDERED) {
						// Do we need to rerender? This needs to happen if we're not using reflection insertion.
						// TODO: someday perhaps make ground shadows more "full featured" and merge behind, like ground reflections do?
						if(_rcs.getParam("GenerateGroundShadow.signalRedraw")) {
							_this.requestSilentRender();
							if(ENABLE_DEBUG) {
								console.log(" $$$$ SIGNAL FULL GROUND SHADOW REDRAW");
							}
							// don't need to continue, since we know we need to fully redraw on next tick
							return true; // TODO could signal abort rest of command stream, since we know we invalidate. It's just a bit inefficient otherwise.
						}
						// note for ground reflection, so it can decide on deferred silent rendering.
						_rcs.groundShadowInPost = true;
					}
				} else {
					// If this is the first frame, try to render the drop shadow in a small amount of time.
					// Else, don't waste time on the drop shadow.
					if(_rcs.tickCount === 0) {
						// render 10 objects TODO - expose 10 as some other number?
						//_rcs.frameRemaining = 
						_groundShadow.prepareGroundShadow(_this.modelQueue(), 10);
						// TODO or this way, which does possibly give flicker:
						//_rcs.frameRemaining = _groundShadow.prepareGroundShadow(_this.modelQueue(), _rcs.frameRemaining, _rcs.INITIAL_GROUND_SHADOW);
						//var minRemaining = _rcs.frameBudget * (1-_rcs.INITIAL_GROUND_SHADOW);
						//if ( _rcs.frameRemaining < minRemaining ) {
						//     _rcs.frameRemaining = minRemaining;
						//}
					}
				}
			} else {
				// full render, just do it fully.
				_rcs.frameRemaining = _groundShadow.prepareGroundShadow(_this.modelQueue(), 0, _rcs.frameRemaining);
			}

			// rendering can continue if there's time left
			return(_rcs.frameRemaining < 0) && (_groundShadow.getStatus() === zvp.GROUND_UNFINISHED);
		}

		function cmdBlitGroundShadow() {
			//Render the ground shadow after screen clear
			if(_groundShadow.getStatus() !== zvp.GROUND_UNFINISHED)
				_this.renderGroundShadow();
			return false;
		}

		function cmdGenerateGroundReflection() {
			// three cases: full render, quick out for progressive, continue as possible for progressive.
			if((_rcs.renderType === _rcs.RENDERMODE_PROGRESSIVE)) {
				// is this pass happening after the beauty pass is completed?
				if(_rcs.getParam("GenerateGroundReflection.afterBeauty")) {
					// Rendering the ground reflection after all progressive rendering is done.
					_rcs.frameRemaining = _groundReflection.prepareGroundReflection(_groundShadow, _this, false, 0, _rcs.frameRemaining);
					// was this the call that rendered it fully?
					if(_groundReflection.getStatus() == zvp.GROUND_RENDERED) {
						_rcs.screenDrawn |= _screenDrawnFlags.REFLECTION_DRAWN;
						// If we're done, we should also check to see if a silent render is needed for ground shadows.
						// If ground shadows were finished in these post-render passes (rare - only on animation or explode,
						// for complex scenes), transparent objects in the scene will not show the shadows properly through
						// their transparent objects, LMV-2508.
						// TODO - nicer still would be to see if the scene actually has any transparent objects. If not,
						// then we don't need this separate re-render.
						// TODO Also, note this isn't a perfect system: in practice you really want to have the ground reflection
						// entirely done before rendering atop it, so that what is seen through transparent objects is fully
						// folded in. However, this problem is much less obvious in the scenes tested - missing ground shadows
						// are more obvious.
						if(_rcs.groundShadowInPost && _materials.hasTransparentMaterial()) {
							_this.requestDeferredSilentRender();
						}
					}
				} else {
					// If this is the first frame, try to render the reflection in a small amount of time.
					// Else, don't waste time on the reflection.
					if(_rcs.tickCount === 0) {
						// render 10 objects TODO - expose 10 as some other number? Or use a budget? Or...?
						//_rcs.frameRemaining =
						_groundReflection.prepareGroundReflection(_groundShadow, _this, true, 10);
						// TODO or this way, which does possibly give flicker:
						//_rcs.frameRemaining = _groundReflection.prepareGroundReflection(_this.modelQueue(), _rcs.frameRemaining, _rcs.INITIAL_GROUND_SHADOW);
						//var minRemaining = _rcs.frameBudget * (1-_rcs.INITIAL_GROUND_SHADOW);
						//if ( _rcs.frameRemaining < minRemaining ) {
						//     _rcs.frameRemaining = minRemaining;
						//}
					}
				}
			} else {
				// full render, just do it fully.
				_rcs.frameRemaining = _groundReflection.prepareGroundReflection(_groundShadow, _this, false, 0, _rcs.frameRemaining);
			}

			// rendering can continue if there's time left, or if we actually finished display and should present, even though we're out of time.
			// TODO we could revise commands to be of "takes time" and "doesn't take time", so that we abort if and only if we're out of time
			// and hit a "takes time" command.
			return(_rcs.frameRemaining < 0) && (_groundReflection.getStatus() === zvp.GROUND_UNFINISHED);
		}

		/**
		 * Progressive update of the shadow map:
		 *
		 *   a) For small models that can be rendered within a single frame, the shadow map will always be rendered first,
		 *      so that shadows will not flicker on and off during animations, on scene changes, or when changing the light direction.
		 *   b) For large models, seeing something is more important than shadows. Therefore, we render without shadows
		 *      first and only do work on the shadow map if everything else is finished.
		 *
		 *  Whether we take a) or b) is determined on-the-fly: We use a) if we succeed updating the whole ShadowMap
		 *  within a single frame time budget.
		 */
		function cmdUpdateShadowMap() {

			// We are either starting an update of the shadow map, or are continuing to render it in this tick.

			// This section is always entered in the first frame if the shadow map is not available yet.
			if(_shadowMaps.state === zvp.SHADOWMAP_NEEDS_UPDATE) {

				// start shadow map update. This call may end in two ways:
				//  - In case a), the shadowmap could already be finished within the startUpdate() call. Therefore, the
				//    shadow map will already be available and will be used in this frame.
				//    In this case, there is nothing more to do and all subsequent calls to updateShadowMap will
				//    do nothing.
				//  - in case b), the shadow map is not available. In this case, we first wait until the rendering
				//    without shadows is finished. (see next section)
				_rcs.frameRemaining = _shadowMaps.startUpdate(_modelQueue, _rcs.frameRemaining, _this.camera, _shadowLightDir, _materials);

			} else if(_shadowMaps.state == zvp.SHADOWMAP_INCOMPLETE) {

				// continue shadow map update as long as we have time
				_rcs.frameRemaining = _shadowMaps.continueUpdate(_modelQueue, _rcs.frameRemaining, _materials);

				// if we're done and this is a progressive render, then this shadow generation is happening at the end.
				// In such a case we need to re-render (similar to ground shadows and reflections).
				if(_shadowMaps.state == zvp.SHADOWMAP_VALID) {

					// TODO - may wish to make this a deferred silent render, so that reflection etc. is completed, then shadows come in later.
					_this.requestSilentRender();
					if(ENABLE_DEBUG) {
						console.log(" $$$$ SIGNAL FULL SHADOW MAP REDRAW");
					}
					// don't need to continue, since we know we need to fully redraw on next tick
					return true; // TODO could signal abort rest of command stream, since we know we invalidate. It's just a bit inefficient otherwise.
				}
			}
			return(_rcs.frameRemaining < 0.0) && (_shadowMaps.state !== zvp.SHADOWMAP_VALID);
		}

		function cmdResetShadowMap() {
			_shadowMaps.state = zvp.SHADOWMAP_NEEDS_UPDATE;
		}

		function cmdBeginScene() {
			if(_rcs.signalProgressByRendering)
				_this.signalProgress(0, zv.ProgressState.RENDERING); //zero out the progress bar for when rendering begins

			if((_rcs.renderType === _rcs.RENDERMODE_PROGRESSIVE)) {
				//Measure actual frame time between two consecutive initial frames.
				//This is used to correct measured per-scene times to what they actually take
				//once the async processing of the graphics thread is taken into account.
				if(_rcs.lastBeginFrameTimeStamp > 0) {
					var delta = _rcs.highResTimeStamp - _rcs.lastBeginFrameTimeStamp;
					_rcs.beginFrameAvg = 0.75 * _rcs.beginFrameAvg + 0.25 * delta;
				}
				_rcs.lastBeginFrameTimeStamp = _rcs.highResTimeStamp;

				//Adjust frame time allowance based on actual frame rate,
				//but stay within the given boundaries.
				if(_rcs.beginFrameAvg < TARGET_FRAME_TIME && _rcs.frameBudget < MAX_FRAME_BUDGET) {
					_this.targetFrameBudget += 1;
					if(_this.targetFrameBudget > MAX_FRAME_BUDGET) {
						_this.targetFrameBudget = MAX_FRAME_BUDGET;
					}
				} else if(_rcs.beginFrameAvg > TARGET_FRAME_TIME && _rcs.frameBudget > MIN_FRAME_BUDGET) {
					_this.targetFrameBudget -= 1;
					if(_this.targetFrameBudget < MIN_FRAME_BUDGET) {
						_this.targetFrameBudget = MIN_FRAME_BUDGET;
					}
				}
			}

			_this.updateCameraMatrices();

			// clear the color and depth targets
			var clear = _rcs.getParam("BeginScene.clear");
			_renderer.beginScene(_this.scene, _this.camera, _this.lightsOn ? _this.lights : _this.no_lights, clear);
			_this.toggleHighlightsLights(true);

			if(clear) {
				_rcs.screenDrawn |= _screenDrawnFlags.BACKGROUND_DRAWN;
			}

			// Check if the camera changed, and if so, signal.
			if(_rcs.getParam("BeginScene.signalCameraChanged")) {
				// Tells view cube to update, for example.
				_this.api.dispatchEvent(_this.cameraChangedEvent);
			}

			return false;
		}

		function cmdBeginPhase() {
			// If nothing is highlighted just skip the highlighted phase
			_rcs.phase = _rcs.getParam("BeginPhase.phase");
			_rcs.useStencil = _rcs.getParam("BeginPhase.useStencil");
			if(!_rcs.useStencil) {
				_renderer.setStencilEnabled(false);
			}

			if(ENABLE_DEBUG) {
				console.log("     render phase is now " + _rcs.phase);
			}

			// Start rendering the scene by resetting the rendering queue.
			// This sets up the view frustum intersector and begins scene iteration.
			_modelQueue.reset(_this.camera, _rcs.phase, _rcs.getParam("BeginPhase.moved"),
				_rcs.phase == zvp.RENDER_HIGHLIGHTED1 || _rcs.phase == zvp.RENDER_HIGHLIGHTED2);

			return false;
		}

		function cmdMainRender() {
			if(!_modelQueue.isEmpty() && !_modelQueue.isDone()) {

				if(_rcs.useStencil) {
					_renderer.setStencilEnabled(_rcs.phase <= zvp.RENDER_HIGHLIGHTED2);
				}
				_rcs.screenDrawn |= _screenDrawnFlags.MODEL_DRAWN;

				//Render some geometry with the current render mode (highlighted, normal, or ghosted)
				_rcs.frameRemaining = _modelQueue.renderSome(renderSomeCallback, _rcs.frameRemaining, _pagingOptions);

				// TODO - cmdMainRender gets used by a number of systems - what sort of progress should really happen here?
				if(_rcs.signalProgressByRendering) {
					_this.signalProgress(100.0 * _modelQueue.getRenderProgress(), zv.ProgressState.RENDERING);
					if(ENABLE_DEBUG) {
						console.log("  %%% percent done " + (100 * _modelQueue.getRenderProgress()));
					}
				}
				if(_rcs.useStencil) {
					_renderer.setStencilEnabled(false);
				}
			}
			// if there is time left, continue on (return false), else return true, which means "stop for now"
			return !_modelQueue.isDone();
		}

		// render sectioning, if any, and any additional buffers needed, such as ID.
		function cmdScenePartRender() {
			_rcs.phase = zvp.RENDER_FINISHED;
			_renderer.renderScenePart(_this.sceneAfter, true, true, true, 0);

			_this.renderAfters.render();

			// TODO: bad, renderScenePart does not return the amount of time used to render. It should, so we know the remaining budget.
			// TODO: to be honest, we should actually do a performance.now() at the beginning of any command list set, and
			// use *that* to track the time truly remaining. highResTimeStamp that is passed in is not trustworthy. But there's also the
			// "average batch time" that gets set, to minimize flicker. A creaky system that works, mostly.
			return false;
		}

		function cmdFinishAllRendering() {
			// in case some system is querying the phase
			_rcs.phase = zvp.RENDER_FINISHED;

			return false;
		}

		function cmdSignalProcessingDone() {
			//if (_rcs.signalProgressByRendering)
			_this.signalProgress(100.0, zv.ProgressState.RENDERING);
		}

		function cmdRenderOverlays() {
			// Render selection highlight / pivot / HUD overlays and other overlay geometry
			// This is stuff that goes into the separate overlay render buffer. It does rely on the z-buffer being properly populated,
			// so is normally rendered after the beauty pass (or highlighting pass) is performed. As such, we need to rerender it on
			// every progressive pass.

			// If there was an overlay dirty (i.e., someone hovered over something in the middle of a progressive render), note that the
			// overlay must now be drawn from here on out.
			if(_this.isOverlayDirty()) {
				// avoid having successive passes 
				_this.clearOverlayDirtyFlag();
				_rcs.drawOverlay = true;
			}

			// draw if needed
			if(_rcs.drawOverlay) {

				// If there is geometry, and we're done rendering it, OR we need to always render the overlay while moving, make the overlay
				if((!_modelQueue.isEmpty() && _modelQueue.isDone()) || _this.showOverlaysWhileMoving) {
					_this.renderOverlays();
					_rcs.screenDrawn |= _screenDrawnFlags.OVERLAY_DRAWN;
				} else {
					// overlay update not needed (no geometry, or to be done only at end): clear once, and turn off drawing it since we need to clear only once.
					_renderer.clearAllOverlays();
					_rcs.drawOverlay = false;
				}
			}

			return false;
		}

		// if we're fading in the rollover highlight, we just need to compose the final frame.
		// This command forces PostAndPresent to happen.
		function cmdForcePresent() {
			_rcs.screenDrawn |= _screenDrawnFlags.ALL_DRAWN;
		}

		function cmdPostAndPresent() {
			//Run post-processing and present to the front buffer
			if(_rcs.screenDrawn &&
				// present if we're done rendering, or if progressive and this is a displayable frame
				(_rcs.phase === zvp.RENDER_FINISHED || ((_rcs.tickCount % _this.frameDisplayRate) === 0))) {
				// Skip AO if we clear the screen and nothing else was drawn, or if
				// it was disabled when we created the command list.
				var skipAO = !_rcs.getParam("PostAndPresent.performAO") ||
					(_rcs.screenDrawn & (_screenDrawnFlags.BACKGROUND_DRAWN | _screenDrawnFlags.MODEL_DRAWN)) == _screenDrawnFlags.BACKGROUND_DRAWN;
				// present image
				_renderer.composeFinalFrame(skipAO);
				_rcs.screenHasChanged = true;
				// reset
				_rcs.screenDrawn = _screenDrawnFlags.NOTHING_DRAWN;

				updateFPS(_rcs.highResTimeStamp);

				_this.api.dispatchEvent({
					type: zv.RENDER_PRESENTED_EVENT
				});
			}

			return false; // TODO - could actually measure time at this point
		}

		// Smooth navigation overrides
		// TODO - I don't really like toggle SAO off and on during a single tick, it is a little
		// costly (how much?), but it's the safest option.
		function cmdSuppressAO() {
			if(ENABLE_DEBUG) {
				if(_renderer.getAOEnabled() === false) {
					// AO should be on and we should be suppressing it.
					zvp.logger.error("AO should be on at this point!");
				}
			}
			_renderer.setAOEnabled(false);
			return false;
		}

		function cmdRestoreAO() {
			if(ENABLE_DEBUG) {
				if(_renderer.getAOEnabled() === true) {
					// AO should be off and we should be restoring it.
					zvp.logger.error("AO should be off at this point!");
				}
			}
			_renderer.setAOEnabled(true);
			return false;
		}

		function cmdSignalRedraw() {
			_this.requestSilentRender();
			return false;
		}

		function cmdFinishedFullRender() {
			_rcs.finishedFullRender = true;
			return false;
		}

		//Main animation loop -- update camera,
		//advance animations, render if needed.
		function tick(highResTimeStamp) {
			// tick() does three main operations:
			// 1. Determine if anything has changed that would trigger a new render.
			// 2. If a new render of any sort is needed, set the command system to do it.
			// 3. Check if there is a command set to run, and if so, run it.

			// TODO We have a high-res time stamp from performance.now(), but, interestingly enough,
			// it comes in about 100 ticks later than whatever number we get when we call
			// performance.now() right here. TODO - how's that work? Why this mis-sync?

			_rcs.highResTimeStamp = highResTimeStamp = highResTimeStamp || 0; // TODO sometimes highResTimeStamp is zero. What?

			///////////////////////////////////////////////
			// Determine if anything has changed that would cause a new render to be performed

			// Texture uploads of newly received textures;
			// Any texture change causes a full redraw.
			var res = _materials.updateMaterials();
			_this.invalidate(res.needsClear, res.needsRender, res.overlayDirty);

			// Perform animations, return true if something animated -- this has to be done
			// before the scene update below
			var animationMoved = updateAnimations(highResTimeStamp);

			// update controls (e.g. view cube, home button, orbit, key press) and see if that has affected the view
			var controlsMoved = _this.controls.update(highResTimeStamp);

			// see if more data was loaded.
			var sceneChanged = _modelQueue && _modelQueue.update(highResTimeStamp);

			var moved = controlsMoved || animationMoved || _cameraUpdated || sceneChanged;
			_pagingOptions.moved = moved;
			// reset and record state of this frame
			_cameraUpdated = false;
			// Did the window resize since last tick?
			var canvasSizeUpdated = _needsResize;
			// checks _needsResize to see if an update is needed.
			updateCanvasSize();

			_needsClear = _needsClear || moved;
			_overlayDirty = _overlayDirty || moved;
			_highlightDirty = _highlightDirty || moved;
			//var needsPresent = false;

			var rollover = false;
			if(_overlayDirty) {
				// Update the selection set cloned meshes (does no rendering, yet)
				updateOverlays(highResTimeStamp);
			} else {
				// If the overlay is not dirty, fade in the overlay update over time (rollover highlighting becomes stronger).
				// If the value changes, the _blendPass needs to be redone - the overlay itself did not change, so
				// does not need to be rerendered.
				if(_renderer.overlayUpdate() && !_overlayDirty) {
					// special case where all that is needed is the rollover hightlight blend pass
					_overlayDirty = rollover = true;
				}
				//needsPresent = _renderer.overlayUpdate();
			}

			// TODO - what is this? By adding on demand loading geometry, the progress of rendering now
			// will proceed back and forth a few times.
			_rcs.signalProgressByRendering = _this.model && (_this.model.isLoadDone() ||
				(_this.model.getData().partPacksLoadDone === true)) && !_this.model.getData().isLeaflet;

			// Has the geometry changed since the last frame?
			// Note this is not the same as just the camera moving, it indicates
			// that meshes have changed position, e.g., during explode, animation, etc.
			// The main effect is that the ground plane and shadow bounds may have changed, so adjust their location and bounds.
			if(updateScene()) {
				// if the scene was indeed dirty, we'll need to render from the start
				_needsClear = true;
			}

			// If _needsClear is false at this point, nothing changed from outside. However, we might still
			// have to set _needsClear to true if the previous frame cannot be resumed. This happens when
			// when we rendered some transparent shapes before all opaque ones were rendered.
			var somethingChanged = _needsClear;
			var lastFrameValid = _modelQueue.frameResumePossible();
			_needsClear = _needsClear || !lastFrameValid;

			///////////////////////////////////////////////
			// If a new render of any sort is needed, set the command system to do it.
			//
			// Store parameters that should not change on successive ticks, but rather control function.
			//
			// Add Command related params:
			// CMD_ALWAYS_DO - always do, no matter what. Executed every tick.
			// CMD_DO_AFTER - used in the command loop; if a command times out, any commands immediately after the timeout will be
			//              executed. This then makes progressive rendering possible: we render, timeout, and the next command(s) such as blend and present will be done.
			//              If executed, it will be executed again later when we get the next tick.
			// CMD_NORMAL_SEQUENCE - execute until done, don't come back to it once it's fully executed in the command list.

			// Is there anything at all that triggers a rerender?
			// if this is an immediate silent render, go do it. Else, check if we're still rendering; if not, then a deferred silent render can launch.
			_immediateSilentRender = _immediateSilentRender || (_deferredSilentRender && !_rcs.cmdListActive);
			if(_highlightDirty && _rcs.cmdListActive) {
				// Bad news, I need to render the highlight, but the scene is dirty.
				_needsClear = true;
			}
			if(_needsClear || _needsRender || _overlayDirty || _highlightDirty || _immediateSilentRender) {

				// For rendering purposes, rcs.drawOverlay is set true whenever any (new) overlay dirty is noticed during progressive rendering.
				_rcs.drawOverlay = _overlayDirty;

				// uncomment all code with _spectorDump in order to have Spector.js dump a frame when "u" (update) is clicked
				/* 
				// This version is for Chrome and Firefox's extension.
				if ( _spectorDump ) {
				    _spectorDump = false;
				    if ( spector ) {
				        spector.clearMarker();
				        spector.captureNextFrame(_this.canvas);
				    }
				}
				*/
				/*
				// This version is for Internet Explorer, which does not support an extension. You must also uncomment the Spector code in Viewer3D.js.
				if (_spectorDump) {
				    _spectorDump = false;
				    /*
				    // use this and put a break on the jsonInString to grab the capture as text, for compare
				    // (this is a bug in Spector that should be fixed someday - right now IE doesn't allow storing the session)
				    window.spector.onCapture.add(function(capture) {
				        var jsonInString = JSON.stringify(capture);
				        // optional, doesn't really work: console.log(jsonInString);
				    });
				    window.spector.startCapture(_this.canvas);
				}
				*/

				// restart rendering?
				if(_needsClear || _needsRender || _immediateSilentRender) {

					// There are three types of render:
					// 1) full render - not (currently) interruptible, runs until completion, "locks" application
					// 2) progressive render - show a bit more each tick, runs unless interrupted by a move, control, etc.
					// 3) silent render - a full render that is done unless interrupted. Display at end if not interrupted by any other render request.
					var frameBudget;
					var movedStatus = somethingChanged ? WGS.RESET_RELOAD : (_needsClear ? WGS.RESET_REDRAW : WGS.RESET_NORMAL);
					if(_needsClear || _needsRender) {
						if(_this.progressiveRender) {
							_rcs.renderType = _rcs.RENDERMODE_PROGRESSIVE;
							frameBudget = _this.targetFrameBudget;
						} else {
							_rcs.renderType = _rcs.RENDERMODE_FULL;
							// How much time to spend rendering the data; 1e10 is an arbitrarily large number of milliseconds, i.e., progressive is off
							frameBudget = _this.interruptBudget;
						}
					} else {
						// Must be a silent render - really, it's the same as a full render, but has a time limit per tick
						_rcs.renderType = _rcs.RENDERMODE_SILENT;
						frameBudget = _this.targetFrameBudget;
						// we must clear, just as on a full render
						_needsClear = true;
						movedStatus = WGS.RESET_REDRAW;
					}

					//if (ENABLE_DEBUG) { console.log(" COMMAND CREATION: clearing: " + _needsClear + ", rendering: " + _needsRender); }

					_deferredSilentRender = _immediateSilentRender = false;

					_rcs.setFrame(frameBudget);

					// set to true when the render is truly done
					_rcs.finishedFullRender = false;

					_rcs.beginCommandSet();

					// Set up commands for the entire sequence of possible render states. The most important thing here is to not overthink it.
					// Each command gets executed. If it runs out of time, it returns "true". On the next tick command processing will continue
					// at the same command (it's up to the command itself to keep track of where it left off). The tricky part is if a command
					// needs to be run after renders every tick, "CMD_DO_AFTER", e.g. draw overlays and present when progressive rendering is on.

					// Otherwise, just lay out the worst-case scenario for drawing the scene, "if this didn't finish here, early on, do the rest
					// later". This happens with ground reflections, for example. There's some logic in the commands themselves that check if it's
					// the first tick, for example, or if it's a progressive tick or a full-render tick.

					// Ground shadow is computed separately, if needed, so check if the feature is in use at all.
					// It is if the flag is on, it's not 2D, and we're not loading (if we are loading, the ground shadow will change
					// anyway, so we don't render it then).
					var useGroundShadow = _groundShadow.enabled && !_this.is2d && !_isLoading;
					var useGroundReflection = (!!_groundReflection) && !_this.is2d && !_isLoading;

					// build a list to do the main full pass
					var cameraChanged = moved || canvasSizeUpdated;

					// Smooth Navigation: if it's on, and "moved" is happening, and AO is on, AO is temporarily turned off in the renderer.
					// We also note this status, and use a special CMD_DO_AFTER command to turn AO back on at the end of every command execution
					// (i.e., tick that this command set runs). This avoids headaches with some other system turning off AO in between ticks -
					// it can now safely do so, without the tick() turning it back on when execution is completed or aborted.
					var suppressAO = moved && _this.skipAOWhenMoving && _renderer.getAOEnabled();

					// -----------------------------------------------------------------------------
					// Start creation of a set of commands to execute over this and following ticks.

					// Highlighting from the model browser needed?
					_rcs.addCommand(cmdBeginScene);
					_rcs.setParam("BeginScene.signalCameraChanged", cameraChanged);
					_rcs.setParam("BeginScene.clear", _needsClear);

					// for Smooth Navigation - turned on later by cmdRestoreAO as an CMD_ALWAYS_DO.
					// We let the clear above clear the SAO buffer, since if we're using smooth navigation
					// we know the SAO there will be invalid. This avoids the case where we're in a long
					// smooth-navigation render which gets interrupted by a "needs present" render (a rollover
					// highlight) which stops the full render we signalled for from completing.
					if(suppressAO) {
						_rcs.addCommand(cmdSuppressAO, _rcs.CMD_ALWAYS_DO);
					}

					// is there any geometry to render?
					var needHighlight = false;
					if(_modelQueue) {

						// is shadow map needed? Generate only if not progressive.
						if(_shadowMaps && _shadowMaps.state !== zvp.SHADOWMAP_VALID) {
							_rcs.addCommand(cmdUpdateShadowMap);
						}

						// is ground shadow computed at this point? If not, and this is a full
						// render, or this is a progressive render and it looks likely to finish,
						// draw it.
						if(useGroundShadow) {
							_rcs.addCommand(cmdGenerateGroundShadow);
							_rcs.setParam("GenerateGroundShadow.afterBeauty", false);
							_rcs.setParam("GenerateGroundShadow.signalRedraw", false);
						}

						// if doing ground reflection, generate it now
						if(useGroundReflection) {
							// tell reflection system it needs to start from scratch once the commands start
							_groundReflection.setDirty();

							_rcs.addCommand(cmdGenerateGroundReflection);
							_rcs.setParam("GenerateGroundReflection.afterBeauty", false);
						}
						// Blit ground shadow first, if in use and ground reflection not in use.
						// If ground reflection is in use, the shadow is composited with its target instead.
						// If we are truly not clearing, then don't blit ground shadow, as it was already
						// displayed in the previous frame (possibly incorrect for this frame, but the user
						// asked to have no clear, so...). See LMV-2571
						else if(useGroundShadow) {
							//else if (useGroundShadow && !_needsClear) {
							_rcs.addCommand(cmdBlitGroundShadow);
						}

						needHighlight = _modelQueue.hasHighlighted();
						if(needHighlight) {
							// set phase and reset
							_rcs.addCommand(cmdBeginPhase);
							_rcs.setParam("BeginPhase.phase", zvp.RENDER_HIGHLIGHTED1);
							_rcs.setParam("BeginPhase.moved", movedStatus);
							_rcs.setParam("BeginPhase.useStencil", needHighlight);
							// need to gather frags for the iterator, etc. only once
							movedStatus = false;

							// draw the highlighting
							_rcs.addCommand(cmdMainRender);
						}

						// beauty pass
						_rcs.addCommand(cmdBeginPhase);
						_rcs.setParam("BeginPhase.phase", zvp.RENDER_NORMAL);
						_rcs.setParam("BeginPhase.moved", movedStatus);
						_rcs.setParam("BeginPhase.useStencil", needHighlight);
						// need to gather frags for the iterator, etc. only once
						movedStatus = false;
						_rcs.addCommand(cmdMainRender);

						// ghosting is done after the ground reflection is generated and merged, as it
						// draws transparent atop all.
						if(!_modelQueue.areAllVisible() && _this.showGhosting) {

							// if we are progressive rendering, and are generating ground reflections, we do ghosting
							// after the ground reflection is done. Else, do it now, as part of the full render, since
							// we know everything's done.
							// TODO I can imagine changing this logic - seems like we should have just one "ghosting
							// after everything" bit of code insertion. The reason there is a split is that for full
							// rendering we know the ground reflection is done at this point and can simply render atop,
							// directly. For progressive rendering we need to wait for the reflection to finish, blend it
							// in under, then ghost.
							if(!useGroundReflection || (_rcs.renderType !== _rcs.RENDERMODE_PROGRESSIVE)) {
								// show ghosting - highly transparent, so must be rendered last, atop everything else
								// TODO note that we don't do cmdScenePartRender here, though it might be nice to
								// show sectioning. I don't really understand, but if we do add it here, the ghosted objects
								// are drawn normally. I guess these objects need to be drawn again for sectioning?
								_rcs.addCommand(cmdBeginPhase);
								_rcs.setParam("BeginPhase.phase", zvp.RENDER_HIDDEN);
								_rcs.setParam("BeginPhase.moved", movedStatus);
								_rcs.setParam("BeginPhase.useStencil", needHighlight);

								_rcs.addCommand(cmdMainRender);
							}
							// note that all (possibly basic, for progressive) rendering is truly done.
							_rcs.addCommand(cmdFinishAllRendering);
						} else {
							// Render sectioning, if any, and any additional buffers needed, such as ID.
							// TODO for progressive rendering, it seems like we should do this *after* any Present(), if
							// the buffers are not needed immediately. This command also notes rendering is done.
							_rcs.addCommand(cmdScenePartRender);
						}

						if(_rcs.signalProgressByRendering) {
							_rcs.addCommand(cmdSignalProcessingDone);
						}
					}

					// Overlay is always rendered. In this way if we *do* get an overlay dirty while progressive rendering,
					// the overlay will get updated.
					// This must be done after the passes above, because our global rule is "draw if z-depth matches"
					// and the z-depths must be established before the highlighted objects get drawn.
					// render them. Always do this for progressive rendering, even if we stop early, since these are important.
					_rcs.addCommand(cmdRenderOverlays, (_rcs.renderType === _rcs.RENDERMODE_PROGRESSIVE) ? _rcs.CMD_DO_AFTER : _rcs.CMD_NORMAL_SEQUENCE);

					// We always need a present, since we know we're doing something. Also antialiasing and whatever blending is needed.
					// Always do this for progressive rendering.
					_rcs.addCommand(cmdPostAndPresent, (_rcs.renderType === _rcs.RENDERMODE_PROGRESSIVE) ? _rcs.CMD_DO_AFTER : _rcs.CMD_NORMAL_SEQUENCE);
					_rcs.setParam("PostAndPresent.performAO", _renderer.getAOEnabled() && !suppressAO);

					// If this is a progressive render, make the last thing to happen the ground shadow, which if not done by now will trigger
					// a rerender once it is fully created.
					if((_rcs.renderType === _rcs.RENDERMODE_PROGRESSIVE) && _modelQueue) {

						if(_shadowMaps && _shadowMaps.state !== zvp.SHADOWMAP_VALID) {
							// start shadow map generation from beginning
							_rcs.addCommand(cmdResetShadowMap);
							_rcs.addCommand(cmdUpdateShadowMap);
						}

						// Ground shadows are an entirely separate render, happening concurrently with the main renderer, and
						// done after the progressive render is performed, if not completed by then. The full render does it
						// as part of its rerender.

						// If we are done with progressive and the ground shadow is not done, do them now.
						if(useGroundShadow) {
							_rcs.addCommand(cmdGenerateGroundShadow);
							_rcs.setParam("GenerateGroundShadow.afterBeauty", true);
							// don't signal a redraw if the ground reflection is about to be finished and merged, too.
							_rcs.setParam("GenerateGroundShadow.signalRedraw", !useGroundReflection);
							// TODO really need to fix progress meter, but at least we should show 100% done
							if(_rcs.signalProgressByRendering) {
								_rcs.addCommand(cmdSignalProcessingDone);
							}
						}

						// if the ground shadows and reflection are not done, do them now.
						if(useGroundReflection) {
							_rcs.groundShadowInPost = false;

							// Note that ground shadow is guaranteed to be done at this point, so will be merged in correctly.
							_rcs.addCommand(cmdGenerateGroundReflection);
							_rcs.setParam("GenerateGroundReflection.afterBeauty", true);

							// ghosting is done after the ground reflection is generated and merged, as it
							// draws transparent atop all. Note that sectioning is already done.
							if(!_modelQueue.areAllVisible() && _this.showGhosting) {
								// show ghosting - highly transparent, so must be rendered last, atop everything else
								// TODO note that we don't do cmdScenePartRender here, though it might be nice to
								// show sectioning. I don't really understand, but if we do add it here, the ghosted objects
								// are drawn normally. I guess these objects need to be drawn again for sectioning?
								_rcs.addCommand(cmdBeginPhase);
								_rcs.setParam("BeginPhase.phase", zvp.RENDER_HIDDEN);
								_rcs.setParam("BeginPhase.moved", movedStatus);
								_rcs.setParam("BeginPhase.useStencil", needHighlight);

								_rcs.addCommand(cmdMainRender);
							}

							// if it's done, perform a present
							_rcs.addCommand(cmdFinishAllRendering);
							_rcs.addCommand(cmdPostAndPresent);
							_rcs.setParam("PostAndPresent.performAO", _renderer.getAOEnabled() && !suppressAO);
							if(_rcs.signalProgressByRendering) {
								_rcs.addCommand(cmdSignalProcessingDone);
							}
						}
					}

					// Smooth Navigation - if on, then we need to always turn the renderer back to AO at the end of any tick;
					// it will get turned back off the next tick by the renderer.
					if(suppressAO) {
						_rcs.addCommand(cmdRestoreAO, _rcs.CMD_ALWAYS_DO);
						// If we get to this command, we've done all we can during smooth navigation and should now signal for a full redraw
						// without smooth navigation. This works because "moved" should be false on the next tick (unless of course the
						// user moved the view) and so a full or progressive render will occurs with smooth navigation off.
						_rcs.addCommand(cmdSignalRedraw);
					}

					_rcs.addCommand(cmdFinishedFullRender);

					_rcs.endCommandSet();

					// if we reenter, by turning these off, we then will not rebuild the command list
					_needsClear = false;
					_needsRender = false;
					// Avoid having updateOverlays() called every tick during a progressive rendering by turning off the overlay dirty flag. 
					// If we get a later overlayDirty, this will trigger updateOverlays() at the start of tick(), and will als cause the
					// cmdRenderOverlays to trigger during a progressive render.
					_overlayDirty = false;
					_highlightDirty = false;

				}
				////////////////////////////////////////////////////////////////////////////

				// only case left is that overlay or highlight is dirty
				else {

					// Possibly draw the overlay, only.
					// Check if we've finished a render. If we are, we set up a short render to update the overlay.
					// We ignore overlay dirty if we're in the middle of a (more than one tick) render, since the render itself will update the overlay.
					if(_rcs.finishedFullRender) {

						_rcs.beginCommandSet();

						if(ENABLE_DEBUG) {
							console.log("=====\nOVERLAY DIRTY");
						}

						if(_highlightDirty) {

							// Add command to clear the highlight buffers
							_rcs.addCommand(_renderer.clearHighlight.bind(_renderer));

							if(_modelQueue.hasHighlighted()) {
								// set phase to draw highlight
								_rcs.addCommand(cmdBeginPhase);
								_rcs.setParam("BeginPhase.phase", zvp.RENDER_HIGHLIGHTED2);
								_rcs.setParam("BeginPhase.moved", WGS.RESET_REDRAW);
								_rcs.setParam("BeginPhase.useStencil", true);

								// draw the highlighting
								_rcs.addCommand(cmdMainRender);
							}
						}

						if(rollover) {
							// Do just the blend pass, having already adjusted the uniform for fading in.
							_rcs.addCommand(cmdForcePresent);

						} else {
							// full overlay render and display

							// just the overlay needs to be re-rendered
							_rcs.addCommand(cmdRenderOverlays, true);

						}

						// we always need a present, since we know we're doing something.
						_rcs.addCommand(cmdPostAndPresent, true);
						// don't need to think about AO, since we are just fading in.
						_rcs.setParam("PostAndPresent.performAO", _renderer.getAOEnabled());

						_rcs.endCommandSet();

						// Avoid having updateOverlays() called every tick during a progressive rendering by turning off the overlay dirty flag. 
						// If we get a later overlayDirty, this will trigger updateOverlays() at the start of tick(), and will als cause the
						// cmdRenderOverlays to trigger during a progressive render.
						// Note that if we get an overlayDirty and rendering is occurring, _overlayDirty won't get cleared, which is good:
						// we want the command system to detect this and turn on overlay rendering at that point.
						_overlayDirty = false;
						_highlightDirty = false;
					}
				}
			}

			///////////////////////////////////////////////
			// Run the command list, if any. Note whether there's any work to do, so we can see if this state has changed and send an event.
			_workThisTick = _rcs.cmdListActive;
			_rcs.executeCommandList();

			///////////////////////////////////////////////
			// Keep it simple: this tick either did rendering, or it did not. If this differs from last frame's state, signal.
			if(_workThisTick !== _workPreviousTick) {
				_this.api.dispatchEvent({
					type: zv.FINAL_FRAME_RENDERED_CHANGED_EVENT,
					value: {
						finalFrame: !_workThisTick
					}
				});
				// we're at the end of things, so the current state now becomes the "previous tick" state for testing next time.
				_workPreviousTick = _workThisTick;
			}

			// used to determine FPS
			_lastHighResTimeStamp = _rcs.highResTimeStamp;
		}

		// webVR has a requestAnimationFrame handler specific to HMD displays 
		this.setLmvDisplay = function(display) {
			_lmvDisplay = display;
		};

		this.run = function() {
			//Begin the render loop (but delay first repaint until the following frame, so that
			//data load gets kicked off as soon as possible
			_reqid = 0;
			setTimeout(function() {
				(function animloop(highResTimeStamp) {
					_reqid = _lmvDisplay.requestAnimationFrame(animloop);
					tick(highResTimeStamp);
				})();
			}, 1);
		};

		this.toggleProgressive = function(value) {
			this.progressiveRender = value;
			_needsClear = true;
		};

		/**
		 * Render visible meshes first, then hidden objects
		 * @param {Bool} enable
		 */
		this.toggleVizBuffer = function(value) {
			var renderer = this.glrenderer();
			if(renderer && this.isvizCacheEnabled !== value) {
				this.isvizCacheEnabled = value;
				if(this.model && renderer) {
					this.model.isvizCacheEnabled = value;
					this.model.readbackTargetIdCallback = this.renderer().readbackTargetId;
					renderer.setIdBufferSource(value ? WGS.FRAGMENT_ID : WGS.DB_ID);
				}
				_needsClear = true;
			}
		};

		this.toggleSwapBlackAndWhite = function(value) {
			this.swapBlackAndWhite = value;
			_renderer.toggleSwapBlackAndWhite(value);
			_needsClear = true;
		};

		this.toggleGhosting = function(value) {
			this.showGhosting = value;
			_needsClear = true;
		};

		this.toggleOverlaysWhileMoving = function(value) {
			this.showOverlaysWhileMoving = value;
		};

		this.togglePostProcess = function(useSAO, useFXAA) {
			_renderer.initPostPipeline(useSAO, useFXAA);
			this.fireRenderOptionChanged();
			_needsClear = true;
		};

		this.preloadPostProcessStyle = function(style) {
			_renderer.preloadPostProcessStyle(style);
		};

		this.setPostProcessParameter = function(token, value) {
			_renderer.setPostProcessParameter(token, value);
			this.fireRenderOptionChanged();
			// TODO just need the post-process to run, but there's no such mode, so must redraw all
			this.invalidate(true);
		};

		this.toggleGroundShadow = function(value) {
			if(_groundShadow.enabled === value)
				return;

			_groundShadow.enabled = value;
			_groundShadow.clear();
			if(value) {
				_groundShadow.setDirty();
			}
			// if we're turning on the ground shadow, we need to set up the ground plane
			updateGroundTransform();
			this.fireRenderOptionChanged();
			this.invalidate(true, false, false);
		};

		this.setGroundShadowColor = function(color) {
			if(!_groundShadow.enabled) return;

			_groundShadow.setColor(color);
			this.invalidate(true, false, false);
		};

		this.setGroundShadowAlpha = function(alpha) {
			if(!_groundShadow.enabled) return;

			_groundShadow.setAlpha(alpha);
			this.invalidate(true, false, false);
		};

		this.toggleGroundReflection = function(enable) {
			if((enable && !!_groundReflection) ||
				(!enable && !_groundReflection))
				return;

			if(enable) {
				_groundReflection = new zv.Shaders.GroundReflection(_webglrender, this.canvas.clientWidth, this.canvas.clientHeight, {
					clearPass: _renderer.getClearPass()
				});
				_groundReflection.setClearColors(this.clearColorTop, this.clearColorBottom, zv.isAndroidDevice() || zv.isIOSDevice());
				_groundReflection.toggleEnvMapBackground(_envMapBackground);
				_groundReflection.setEnvRotation(_renderer.getEnvRotation());
				// if we're turning on the ground reflection, we need to set up the ground plane
				updateGroundTransform();
			} else {
				_groundReflection.cleanup();
				_groundReflection = undefined;
			}

			this.fireRenderOptionChanged();
			this.invalidate(true, false, false);
		};

		this.setGroundReflectionColor = function(color) {
			if(!_groundReflection) return;

			_groundReflection.setColor(color);
			this.invalidate(true, false, false);
		};

		this.setGroundReflectionAlpha = function(alpha) {
			if(!_groundReflection) return;

			_groundReflection.setAlpha(alpha);
			this.invalidate(true, false, false);
		};

		this.toggleEnvMapBackground = function(value) {
			_envMapBackground = value;
			_renderer.toggleEnvMapBackground(value);

			if(_groundReflection) {
				_groundReflection.toggleEnvMapBackground(value);
			}
			this.invalidate(true, true, false);
		};

		this.isEnvMapBackground = function() {
			return _envMapBackground;
		};

		this.setOptimizeNavigation = function(value) {
			this.skipAOWhenMoving = value;
		};

		// If we have selection meshes, this function makes sure that they use exactly the same
		// geometry as we used in the main scene rendering. This is needed to avoid z-buffer artifacts
		// when using consolidation.
		function updateSelectionProxies() {
			for(var id in _this.selectionMeshes) {
				var proxy = _this.selectionMeshes[id];

				// Updating proxies is only relevant when using consolidtion. Otherwise, we always use the original
				// fragment geometry and can keep static proxy geometry.
				if(proxy.model && proxy.model.isConsolidated()) {
					proxy.model.updateRenderProxy(proxy, proxy.fragId);
				}
			}
		}

		this.renderOverlays = function() {

			updateSelectionProxies();

			//The overlays (selection, pivot, etc) get lighted using
			//the default lights, even if IBL is on
			var lightsOn = this.lightsOn;
			if(!lightsOn)
				this.toggleLights(true, true);

			var oldIntensity;
			if(this.dir_light1) {
				oldIntensity = this.dir_light1.intensity;
				this.dir_light1.intensity = 1;
			}

			_renderer.renderOverlays(this.overlayScenes, this.lightsOn ? this.lights : this.no_lights);

			if(!lightsOn)
				this.toggleLights(false, true);

			if(this.dir_light1)
				this.dir_light1.intensity = oldIntensity;
		};

		this.setLayerVisible = function(layerIndexes, visible) {
			this.layers.setLayerVisible(layerIndexes, visible);
		};

		this.isLayerVisible = function(layerIndex) {
			return this.layers.isLayerVisible(layerIndex);
		};

		this.getVisibleLayerIndices = function() {
			return this.layers.getVisibleLayerIndices();
		};

		// Find model's bounds, including ground plane, if needed.
		// Fit near and far planes to the model.
		this.updateCameraMatrices = (function() {

			var tmpCameraMatrix;
			var tmpViewMatrix;
			var tmpBox;

			function init_three() {
				tmpCameraMatrix = new THREE.Matrix4();
				tmpViewMatrix = new THREE.Matrix4();
				tmpBox = new THREE.Box3();
			}

			return function() {

				if(!tmpBox)
					init_three();

				var camera = this.camera;

				//NOTE: This is not computing the same matrix as what we use for rendering,
				//in cases where we are in ORTHO mode and the camera is inside the model,
				//which would result in negative near plane. For the purposes of computing
				//the near/far planes, we have to skip the logic that adjusts the view matrix
				//based on the near/far planes. See UnifiedCamera.updateMatrix for the related
				//adjustment to the view matrix.
				tmpCameraMatrix.compose(camera.position, camera.quaternion, camera.scale);
				tmpViewMatrix.getInverse(tmpCameraMatrix);

				//TODO: Would be nice if this got called by the world up tool instead,
				//so that we don't have to update it every frame.
				if(camera.worldup)
					this.setWorldUp(camera.worldup);

				//Fix near and far to fit the current view
				if(this.model) {
					var worldBox = this.getVisibleBounds(true, _overlayDirty);
					tmpBox.copy(worldBox);

					//If reflection is on, then we need to double the worldBox size in the Y
					//direction, the reflection direction, otherwise the reflected view can be
					//clipped.
					if(_groundReflection) {
						// Increase bounding box to include ground reflection geometry. The idea
						// here is to extend the bounding box in the direction of reflection, based
						// on the "up" vector.
						var tmpVecReflect = new THREE.Vector3();
						tmpVecReflect.multiplyVectors(tmpBox.max, camera.worldup);
						var tmpVecMin = new THREE.Vector3();
						tmpVecMin.multiplyVectors(tmpBox.min, camera.worldup);
						tmpVecReflect.sub(tmpVecMin);
						// tmpVecReflect holds how much to increase the bounding box.
						// Negative values means the "up" vector is upside down along that axis,
						// so we increase the maximum bounds of the bounding box in this case.
						if(tmpVecReflect.x >= 0.0) {
							tmpBox.min.x -= tmpVecReflect.x;
						} else {
							tmpBox.max.x -= tmpVecReflect.x;
						}
						if(tmpVecReflect.y >= 0.0) {
							tmpBox.min.y -= tmpVecReflect.y;
						} else {
							tmpBox.max.y -= tmpVecReflect.y;
						}
						if(tmpVecReflect.z >= 0.0) {
							tmpBox.min.z -= tmpVecReflect.z;
						} else {
							tmpBox.max.z -= tmpVecReflect.z;
						}
					}

					// Expand the bbox based on ground shadow. Note that the horizontal extent of the ground shadow
					// may be significantly larger for flat shadow light directions.
					if(_shadowMaps && _shadowMaps.groundShapeBox) {
						tmpBox.union(_shadowMaps.groundShapeBox);
					}

					//Transform the world bounds to camera space
					//to estimate the near/far planes we need for this frame
					tmpBox.applyMatrix4(tmpViewMatrix);

					//Expand the range by a small amount to avoid clipping when
					//the object is perfectly aligned with the axes and has faces at its boundaries.
					var sz = 1e-5 * (tmpBox.max.z - tmpBox.min.z);

					//TODO: expand for ground shadow. This just matches what the
					//ground shadow needs, but we need a better way to take into account
					//the ground shadow scene's bounds
					var expand = (tmpBox.max.y - tmpBox.min.y) * 0.5;

					var dMin = -(tmpBox.max.z + sz) - expand;
					var dMax = -(tmpBox.min.z - sz) + expand;

					//Camera is inside the model?
					if(camera.isPerspective) {
						// dMin might be OK, or might be negative. If it's negative,
						// give it a value of 1/10,000 of the entire scene's size relative to this view direction,
						// or 1, whichever is *smaller*. It's just a heuristic.
						dMin = Math.max(dMin, Math.min(1, Math.abs(dMax - dMin) * 1e-4));

						if(dMax < 0) {
							// near and far planes should always be positive numbers for perspective
							dMax = 1e-4;
						}
						// One more attempt to improve the near plane: make it 1/100,000 of the distance of the
						// far plane, if that's higher.
						// See https://wiki.zhiutech.com/display/LMVCORE/Z-Buffer+Fighting for reasoning.
						// 1e-4 is generally good below, but inside Silver Cross we get a lot of near clipping. So, 1e-5.
						dMin = Math.max(dMin, dMax * 1e-5);
					} else {
						//TODO:
						//Do nothing in case of ortho. While this "fixes" near plane clipping too aggressively,
						//it effectively disallows moving through walls to go inside the object.
						//So we may need some heuristic based on how big we want the object to be
						//on screen before we let it clip out.
						//dMin = Math.max(dMin, 0);
					}

					//The whole thing is behind us -- nothing will display anyway?
					dMax = Math.max(dMax, dMin);

					camera.near = dMin;
					camera.far = dMax;
					camera.updateProjectionMatrix();
					camera.updateMatrixWorld();

					//Update the line width scale with the
					//new pixels per unit scale
					var distance, pixelsPerUnit;
					if(this.model.is2d()) {
						//Here we base pixel scale on the point at the center of the view.
						//However, this might not always be the most appropriate point,
						//e.g. at oblique angles or when the drawing is off to one side.
						//It might make more sense to base the scale on the distance of the
						//camera to the nearest part of the world bounding box, which requires
						//a more generic ray-aabb test.
						var groundPt = this.intersectGroundViewport(new THREE.Vector3(0, 0, 1));

						if(groundPt)
							distance = camera.position.distanceTo(groundPt);
						else
							distance = camera.position.distanceTo(worldBox.center()); //degenerate case: camera direction is parallel to the ground plane

						//NOTE: In case of ortho projection, we set FOV such that tan(fov/2) = 0.5,
						//so here we don't need separate code path for ortho.
						pixelsPerUnit = _renderer.settings.deviceHeight / (2 * distance * Math.tan(THREE.Math.degToRad(camera.fov * 0.5)));

						//If we want to take into account devicePixelRatio for line weights (so that lines are not too thin)
						//we can do this here, but it's less esthetically pleasing:
						//pixelsPerUnit /= _webglrenderer.getPixelRatio();

						_materials.updatePixelScale(pixelsPerUnit);

						// AutoCAD drawings are commonly displayed with white lines on a black background. Setting reverse swaps (just)
						// these two colors.
						_materials.updateSwapBlackAndWhite(this.swapBlackAndWhite);
					} else {

						//If there is a cutting plane, get a point on that plane
						//for by the pixel scale computation.
						var cp = _materials.getCutPlanesRaw();

						var pt;
						if(cp && cp.length) {
							var p = cp[0];

							var dir = camera.target.clone().sub(camera.position).normalize();
							var denominator = dir.dot(p);

							if(denominator === 0)
								pt = worldBox.center();
							else {
								var t = -(camera.position.clone().dot(p) + p.w) / denominator;
								pt = worldBox.clampPoint(dir.multiplyScalar(t).add(camera.position));
							}
						} else {
							pt = worldBox.center();
						}

						distance = camera.position.distanceTo(pt);

						//NOTE: In case of ortho projection, we set FOV such that tan(fov/2) = 0.5,
						//so here we don't need separate code path for ortho.
						pixelsPerUnit = _renderer.settings.deviceHeight / (2 * distance * Math.tan(THREE.Math.degToRad(camera.fov * 0.5)));

						_materials.updatePixelScale(pixelsPerUnit);
					}

				}
			};
		})();

		this.initLights = function() {
			this.dir_light1 = new THREE.DirectionalLight(_defaultDirLightColor, _defaultLightIntensity);
			this.dir_light1.position.copy(_lightDirDefault);
			this.highlight_dir_light1 = new THREE.DirectionalLight(_defaultDirLightColor, _defaultLightIntensity);
			this.highlight_dir_light1.intensity = 1;
			this.highlight_dir_light1.position.copy(_lightDirDefault);

			//Note this color will be overridden by various light presets
			this.amb_light = new THREE.AmbientLight(_defaultAmbientColor);
			this.highlight_amb_light = new THREE.AmbientLight(_defaultAmbientColor);

			// Set this list only once, so that we're not constantly creating and deleting arrays each frame.
			// See https://www.scirra.com/blog/76/how-to-write-low-garbage-real-time-javascript for why.
			// use this.no_lights empty array if no lights are needed.
			this.lights = [this.dir_light1, this.amb_light];
			this.highlight_lights = [this.highlight_dir_light1, this.highlight_amb_light];

			//We do not add the lights to any scene, because we need to use them
			//in multiple scenes during progressive render.
			//this.scene.add(this.amb_light);

			// Attach the light to the camera, so that the light direction is applied in view-space.
			// Note:
			//
			//  1. For directional lights, the direction where the light comes from is determined by
			//     lightPosition - targetPosition, both in in world-space.
			//  2. The default target of dir lights is the world origin.
			//  3. Transforming the light object only affects the light position, but has no effect on the target.
			//
			// The goal is to rotate the lightDir with the camera, but keep it independent
			// of the camera position. Due to 3. above, we must also attach the light's target object to the camera.
			// Otherwise, the camera position would incorrectly be added to the light direction.
			this.camera.add(this.dir_light1);
			this.camera.add(this.dir_light1.target);
			this.camera.add(this.highlight_dir_light1);
			this.camera.add(this.highlight_dir_light1.target);

			_lightsInitialized = true;
		};

		var setLights = function(amb_light, dir_light1, state, isForOverlay) {
			//Update the light colors based on the current preset
			var preset = zvp.LightPresets[_currentLightPreset];
			var ac = preset.ambientColor;
			var dc = preset.directLightColor;

			ac = ac || _defaultAmbientColor.toArray();
			dc = dc || _defaultDirLightColor.toArray();

			if(state) {
				if(isForOverlay && amb_light)
					amb_light.color.setRGB(dc[0] * 0.5, dc[1] * 0.5, dc[2] * 0.5);
				else if(amb_light) {
					amb_light.color.setRGB(ac[0], ac[1], ac[2]);
				}

				if(dir_light1) {
					dir_light1.color.setRGB(dc[0], dc[1], dc[2]);
				}
			} else {
				//Restores the ambient for the main scene after drawing overlays
				if(amb_light && isForOverlay)
					amb_light.color.setRGB(ac[0], ac[1], ac[2]);
			}
		};

		this.toggleHighlightsLights = function(state) {

			//This can happen during initial construction
			if(!this.highlight_amb_light)
				return;

			// Don't create or remove arrays, as that's bad to do during rendering.
			// Instead, later use lightsOn to decide which array to use.
			this.highlightsOn = state;

			setLights(this.highlight_amb_light, this.highlight_dir_light1, state, true);
			_renderer.setHighlightLights(state ? this.highlight_lights : this.no_lights);
		};

		this.toggleLights = function(state, isForOverlay) {

			//This can happen during initial construction
			if(!this.amb_light)
				return;

			// Don't create or remove arrays, as that's bad to do during rendering.
			// Instead, later use lightsOn to decide which array to use.
			this.lightsOn = state;

			setLights(this.amb_light, this.dir_light1, state, isForOverlay);
		};

		//Forces the view controller to update when the camera
		//changes programmatically (instead of via mouse events).
		this.syncCamera = function(syncWorldUp) {
			this.camera.updateProjectionMatrix();

			if(syncWorldUp)
				this.setWorldUp(this.api.navigation.getWorldUpVector());

			_cameraUpdated = true;
		};

		this.setViewFromFile = function(model, skipTransition) {

			if(!model) {
				return;
			}

			var camera;

			var defaultCamera = model.getDefaultCamera();

			if(defaultCamera) {

				camera = defaultCamera;

			} else {

				//Model has no default view. Make one up based on the bounding box.

				camera = {};

				var bbox = model.getBoundingBox();
				var size = bbox.size();
				camera.target = bbox.center();

				if(!model.is2d()) {
					camera.isPerspective = true;
					camera.fov = this.camera.fov;
					camera.up = this.camera.up.clone();

					camera.position = camera.target.clone();
					camera.position.z += 1.5 * Math.max(size.x, size.y, size.z);
				} else {
					camera.isPerspective = false;

					var pageAspect = size.x / size.y;
					var screenAspect = this.camera.aspect;

					//Fit the page to the screen
					if(screenAspect > pageAspect)
						camera.orthoScale = size.y;
					else
						camera.orthoScale = size.x / screenAspect;

					//2D case -- ground plane / up vector is Z
					camera.up = new THREE.Vector3(0, 0, 1);

					camera.position = camera.target.clone();
					camera.position.z += camera.orthoScale;

					//This is to avoid freaking out the camera / controller with co-linear up and direction
					camera.target.y += 1e-6 * size.y;

				}

			}

			this.setViewFromCamera(camera, skipTransition);
		};

		//Camera is expected to have the properties of a THREE.Camera.
		this.adjustOrthoCamera = function(camera) {

			if(!camera.isPerspective && this.model) {
				var bbox = this.model.getBoundingBox();
				var size = bbox.size();

				var at = camera.target.clone().sub(camera.position);
				var targetDistance = at.length();
				if(targetDistance > 1000 * size.length()) {

					//Sometimes (Revit) the camera target is unspecified/infinite
					//for ortho. So we pick target and distance such that
					//initial view and orbit is about right by using a target point that is a similar
					//distance away as camera->bbox center, but is in the
					//direction of the at vector (which is not necessarily looking at the center)
					var dist = camera.position.distanceTo(bbox.center());
					camera.target.copy(camera.position).add(at.normalize().multiplyScalar(dist));
				} else {
					//UnifiedCamera does not actually look at the orthoScale property. It bases
					//the ortho projection on value derived from the position-target distance and an
					//assumed field of view. For a well defined ortho view, we expect that
					//the eye-target distance and ortho scale are equal. Some extractors have historically
					//defined only one of these in a sane way (e.g. the other code path in this if condition).

					if(Math.abs(targetDistance - camera.orthoScale) / targetDistance > 1e-5) {

						zvp.logger.warn("Ortho scale does not match eye-target distance. One of them is likely wrong, but which one?");

						//This checks for ortho camera views defined in Revit bubbles. Unlike the same view in the SVF,
						//the one in the bubble sets orthoHeight and FOV to trivial values that make no sense, while
						//target distance is correct.
						var isLikelyRevitView = (camera.fov === 0 && camera.orthoScale === 1);

						//Assume ortho scale is correct if we are not in the Revit situation above
						var orthoScaleIsCorrect = !isLikelyRevitView;
						if(orthoScaleIsCorrect) {
							//This line applies orthoScale (assumed correct) to target distance (incorrect)
							camera.position.copy(camera.target).add(at.normalize().multiplyScalar(-camera.orthoScale));
						} else {
							//do nothing, target distance is correct and will be used by UnifiedCamera
						}
					}

				}
			}
		};

		/**
		 * Switches to a new view based on a given camera. If the current orbiting mode is constrained,
		 * the up vector may be adjusted.
		 *
		 * @param {THREE.Camera} camera Input camera.
		 * @param {boolean} skipTransition Switch to the view immediately instead of transitioning.
		 */
		this.setViewFromCamera = function(camera, skipTransition) {
			this.adjustOrthoCamera(camera);

			// If the current orbiting mode is unconstrained (the 'freeorbit' tool),
			// use exact camera settings, otherwise (the 'orbit' tool) snap the up vector to a world axis.
			// However, if this is the initial load and the model has a free orbit navigation mode defined
			// we will use the exact camera settings no matter if the free orbit tool is active or not.
			// Note #1: that 'freeorbit' vs. 'orbit' tools are active even when the FusionOrbit extension is used.
			// Note #2: isToolActivated is not available in node-lmv, so we stub it to always return false
			var navModeHint = this.model.getMetadata('navigation hint', 'value', null);
			var useExactCamera = this.controls.isToolActivated('freeorbit') ||
				(skipTransition && navModeHint === "Freeorbit");

			var upVectorArray = this.model ? this.model.getUpVector() : null;

			var worldUp;
			if(upVectorArray) {
				worldUp = new THREE.Vector3().fromArray(upVectorArray);
			} else {
				worldUp = useExactCamera ? camera.up.clone() : zv.Navigation.snapToAxis(camera.up.clone());
			}

			if(useExactCamera) {
				if(this.api.prefs)
					this.api.prefs.set('fusionOrbitConstrained', worldUp.equals(camera.up));
			} else {
				camera.up = worldUp;
			}

			var navapi = this.api.navigation;
			if(navapi) {

				var tc = this.camera;

				if(!skipTransition) {
					tc.isPerspective = camera.isPerspective;

					if(!camera.isPerspective) {
						tc.saveFov = camera.fov; // Stash original fov
						camera.fov = zv.UnifiedCamera.ORTHO_FOV;
					}

					if(useExactCamera) {
						navapi.setRequestTransitionWithUp(true, camera.position, camera.target, camera.fov, camera.up, worldUp);
					} else {

						// Fix camera's target if it is not inside the scene's bounding box.
						var bbox = this.model.getData().bbox;
						if(!bbox.containsPoint(camera.target)) {
							camera.target.copy(bbox.center());
						}

						var up = navapi.computeOrthogonalUp(camera.position, camera.target);
						navapi.setRequestTransitionWithUp(true, camera.position, camera.target, camera.fov, up, worldUp);
					}
				} else {
					//This code path used during initial load -- it sets the view directly
					//without doing a transition. Transitions require that the camera is set explicitly

					tc.up.copy(camera.up);
					tc.position.copy(camera.position);
					tc.target.copy(camera.target);
					if(camera.isPerspective) {
						tc.fov = camera.fov;
					} else {
						tc.saveFov = camera.fov; // Stash original fov
						tc.fov = zv.UnifiedCamera.ORTHO_FOV;
					}
					tc.isPerspective = camera.isPerspective;
					tc.orthoScale = camera.orthoScale;
					tc.dirty = true;

					navapi.setWorldUpVector(useExactCamera ? worldUp : tc.up);
					navapi.setView(tc.position, tc.target);
					navapi.setPivotPoint(tc.target);

					this.syncCamera(true);
				}
			}
			_cameraUpdated = true;
		};

		this.setViewFromViewBox = function(model, viewbox, name, skipTransition) {
			if(!model.is2d()) {
				return;
			}

			var camera = {};

			var bbox = model.getBoundingBox();

			var box = {
				width: viewbox[2] - viewbox[0],
				height: viewbox[3] - viewbox[1]
			};
			box.aspect = box.width / box.height;
			box.centerX = viewbox[0] + box.width / 2;
			box.centerY = viewbox[1] + box.height / 2;

			var screenAspect = this.camera.aspect;

			//Fit the viewbox to the screen
			if(screenAspect > box.aspect)
				camera.orthoScale = box.height;
			else
				camera.orthoScale = box.width / screenAspect;

			camera.isPerspective = false;
			camera.position = new THREE.Vector3(box.centerX, box.centerY, bbox.center().z + camera.orthoScale);
			camera.target = new THREE.Vector3(box.centerX, box.centerY, bbox.center().z);
			camera.target.y += 1e-6 * box.height;

			camera.up = new THREE.Vector3(0, 0, 1);

			this.setViewFromCamera(camera, skipTransition);
		};

		this.setWorldUp = function(upVector) {

			if(_worldUp.equals(upVector))
				return;

			_worldUp.copy(upVector);

			// get the (max) up axis and sign
			var maxVal = Math.abs(upVector.x);
			_worldUpName = "x";
			if(Math.abs(upVector.y) > maxVal) {
				_worldUpName = "y";
				maxVal = Math.abs(upVector.y);
			}
			if(Math.abs(upVector.z) > maxVal) {
				_worldUpName = "z";
			}

			var getRotation = function(vFrom, vTo) {
				var rotAxis = (new THREE.Vector3()).crossVectors(vTo, vFrom).normalize(); // not sure why this is backwards
				var rotAngle = Math.acos(vFrom.dot(vTo));
				return(new THREE.Matrix4()).makeRotationAxis(rotAxis, rotAngle);
			};

			var identityUp = new THREE.Vector3(0, 1, 0);
			_this.camera.worldUpTransform = getRotation(identityUp, upVector);

			this.sceneUpdated(false);
		};

		this.addModel = function(model) {
			if(!model)
				return;

			//Is it the first model being loaded into the scene?
			var isOverlay = !!this.model;
			var is2d = model.is2d();

			if(!this.model) {
				this.model = model;

				if(!is2d)
					this.toggleVizBuffer(this.isvizCacheEnabled);
				_renderer.setUnitScale(model.getUnitScale());
			}

			// Initialize layers.
			if(!this.layers) {
				this.layers = new zvp.ModelLayers(this);
			}

			// TODO: Only single model supported, extend to support several.
			if(!this.layers.initialized) {
				this.layers.addModel(model);
			}

			//Create a render list for progressive rendering of the
			//scene fragments
			_modelQueue.addModel(model);
			this.selector.addModel(model);
			this.visibilityManager.addModel(model);

			// In case of a 2D drawing initialize the common line shader and the layers texture.
			if(is2d) {
				var data = model.getData();
				// Initialize the layers texture, but only if this is the first 2d model.
				var loadedModels = _modelQueue.getModels();
				for(var i = 0; i < loadedModels.length; ++i) {
					var mm = loadedModels[i];
					if(mm === model) {
						_materials.initLayersTexture(data.layerCount, data.layersMap);
						break;
					}
					if(mm.is2d()) {
						break;
					}
				}

				// The id material is not specific to a model, so don't make it a model material.
				// If the id material is attached to a model, you can get into this situation:
				// Load two models m1 first and then m2 into the same RenderContext and MaterialManager.
				// At the end of this the RenderContext's id material is attached to m2. Then transfer
				// m2 to a new RenderContext and MaterialManager. Because the id material is attached
				// to m2, it is transfered to the new context, but it is still the id material in the
				// first context, too. There isn't anything in the id material that is specific to a model,
				// so keeping the id material from being attached to a model, fixes that issue.
				var idMatName = _materials.create2DMaterial(null, {
					useInstancing: this.use2dInstancing
				}, true, false, function() {
					_this.invalidate(false, true, false);
				});
				var idMaterial = _materials.findMaterial(null, idMatName);

				_renderer.enter2DMode(idMaterial);

				if(!isOverlay) {
					this.is2d = true;

					//Rememeber the light preset so we can restore is
					//when we unload the 2d sheet -- the light preset for 2d
					//is not persisted.
					_oldLightPreset = _currentLightPreset;
					this.setLightPreset(zvp.DefaultLightPreset2d);

					var esd = model.getData();
					if(esd.hidePaper) {
						var bg = esd.bgColor;
						var r = (bg >> 16) & 0xff;
						var g = (bg >> 8) & 0xff;
						var b = bg & 0xff;
						this.setClearColors(r, g, b, r, g, b);
					}
				}
			}

			if(this.api.navigation) {
				this.api.navigation.setIs2D(is2d && !isOverlay);
				this.api.setActiveNavigationTool(); // use default nav tool

				// For leaflet, restrict 2D navigation, so that we cannot zoom/pan away from the image
				// and stop zoom-in when reaching max resolution.
				var modelData = model.getData();
				if(modelData.isLeaflet) {
					this.api.navigation.setConstraints2D(modelData.bbox, modelData.maxPixelPerUnit);
				} else {
					// If it is not a leaflet model, clear constrain 2d. 
					// Otherwise, it will leak to the next model that viewer could open up.
					this.api.navigation.setConstraints2D();
				}
			}

			if(!isOverlay && !model.getData().loadOptions.preserveView) {
				this.setViewFromFile(model, true);
				this.controls.recordHomeView();
			}

			this.setupLighting(model);
			syncIdTargetCount();

			this.fireRenderOptionChanged();
			this.invalidate(true);
		};

		this.setupLighting = function(model) {

			model = model || this.model;

			if(!model || model.is2d()) {
				return;
			}

			// grab the environment preset data from the file.
			//This will usually be set for Fusion files.
			if(!this.setLightPresetFromFile(model)) {
				//When switching from a 2D sheet back to a 3D view,
				//we restore the environment map that was used for the
				//last 3D view displayed. The operation is delayed until here
				//so that switching between 2D sheets does not incur this unnecessary overhead.
				if(_oldLightPreset >= 0) {
					this.setLightPreset(_oldLightPreset, true);
					_oldLightPreset = -1;
				} else {
					this.setLightPreset(_currentLightPreset, false);
				}
			}

			this.setAOHeuristics(model);
		};

		this.getSvfMaterialId = function(fragId) {
			return this.model.getFragmentList().getSvfMaterialId(fragId);
		};

		this.getMaterials = function() {
			return _materials;
		};

		//Creates a THREE.Mesh representation of a fragment. Currently this is only
		//used as vehicle for activating a fragment instance for rendering once its geometry is received
		//or changing the fragment data (matrix, material). So, it's mostly vestigial.
		this.setupMesh = function(model, threegeom, materialId, matrix) {

			var m = {
				geometry: threegeom,
				matrix: matrix,
				isLine: threegeom.isLines,
				isWideLine: threegeom.isWideLines,
				isPoint: threegeom.isPoints,
				is2d: threegeom.is2d
			};

			m.material = this.matman().setupMaterial(model, threegeom, materialId);

			return m;
		};

		function _initAnim(model) {

			var esd = model.getData();
			// Init animations
			function initAnimations() {
				if(esd.animations) {
					_this.keyFrameAnimator = new zvp.KeyFrameAnimator(_this, esd.animations.duration);
					for(var a in esd.animations.animations) {
						_this.keyFrameAnimator.add(esd.animations.animations[a]);
					}
					_this.keyFrameAnimator.goto(0);
					_this.api.dispatchEvent({
						type: zv.ANIMATION_READY_EVENT
					});
				}
				_this.api.removeEventListener(zv.OBJECT_TREE_CREATED_EVENT, initAnimations);
			}
			// init animations after object tree created and geometry loaded
			if(model.isObjectTreeCreated()) {
				initAnimations();
			} else {
				_this.api.addEventListener(zv.OBJECT_TREE_CREATED_EVENT, initAnimations);
			}

		}

		this.onDemandLoadComplete = function(model) {
			// This one will be called on an SVF file with the on demand loading enabled.
			// Quite similar as onLoadComplete, but with some difference,

			_isLoading = false;

			this.signalProgress(100, zv.ProgressState.LOADING);

			if((_groundShadow && _groundShadow.enabled) || _groundReflection) {
				// TODO: may need this instead - test with ground shadow
				//             this.sceneUpdated(false);
				this.invalidate(false, true);
			}

			//In the case of 2d drawing, initialize the dbIds texture
			//to be used for selection highlighting. Initially,
			//nothing is highlighted
			if(this.is2d) {
				var selectionTexture = _materials.initSelectionTexture(model.getData().maxObjectNumber);
				var selMatName = _materials.create2DMaterial(model, {
					useInstancing: this.use2dInstancing
				}, false, selectionTexture, function() {
					_this.invalidate(false, true, false);
				});
				this.selectionMaterial2d = _materials.findMaterial(model, selMatName);

				this.createOverlayScene("selection2d", this.selectionMaterial2d);
			}

			var esd = model.getData();
			_materials.togglePolygonOffset(true);
			_renderer.setDepthMaterialOffset(_materials.getPolygonOffsetOn(), _materials.getPolygonOffsetFactor(), _materials.getPolygonOffsetUnits());

			// do a silent render in case a transparent object got loaded and rendered ahead of an opaque one.
			if(_materials.hasTransparentMaterial()) {
				this.requestDeferredSilentRender();
			}

			// Init animations
			_initAnim(model);

			// Fire the event so we know the on demand requested geometry are loaded done.
			this.api.dispatchEvent({
				type: zv.GEOMETRY_LOADED_EVENT,
				model: model,
				onDemandLoad: true
			});
		};

		// Gets called by the active Loader
		this.onLoadComplete = function(model) {
			_isLoading = false;

			this.signalProgress(100, zv.ProgressState.LOADING);

			// Only if ground shadows or reflections are on do we need to emit a refresh.
			if((_groundShadow && _groundShadow.enabled) || _groundReflection) {
				this.sceneUpdated(false);
			}

			//In the case of 2d drawing, initialize the dbIds texture
			//to be used for selection highlighting. Initially,
			//nothing is highlighted
			if(this.is2d) {
				var selectionTexture = _materials.initSelectionTexture(model.getData().maxObjectNumber);
				var selMatName = _materials.create2DMaterial(model, {
					useInstancing: this.use2dInstancing
				}, false, selectionTexture, function() {
					_this.invalidate(false, true, false);
				});
				this.selectionMaterial2d = _materials.findMaterial(model, selMatName);

				this.createOverlayScene("selection2d", this.selectionMaterial2d);
			}

			var esd = model.getData();

			var geomList = _modelQueue.getGeometryList();
			if(geomList) {
				_modelQueue.getGeometryList().printStats();
			}

			//If the model has line geometries
			//set polygon offset on the solid materials
			//so that we avoid z-fighting between solids and
			//their outlines.
			_materials.togglePolygonOffset(true);
			_renderer.setDepthMaterialOffset(_materials.getPolygonOffsetOn(), _materials.getPolygonOffsetFactor(), _materials.getPolygonOffsetUnits());

			if(!model.hasGeometry()) {
				zvp.logger.warn("Loaded model has no geometry.");
			}
			// do a silent render in case a transparent object got loaded and rendered ahead of an opaque one.
			else if(_materials.hasTransparentMaterial()) {
				this.requestSilentRender();
			}

			// set initial visibility of nodes
			this.handleInitialVisibility(model);

			// Init animations
			_initAnim(model);

			// Fire the event so we know the geometry is done loading.
			this.api.dispatchEvent({
				type: zv.GEOMETRY_LOADED_EVENT,
				model: model
			});
		};

		this.onTextureLoadComplete = function(model) {
			// Fire the event so we know the textures for a model are done loading.
			this.api.dispatchEvent({
				type: zv.TEXTURES_LOADED_EVENT,
				model: model
			});
		};

		this.signalProgress = function(percent, progressState) {
			if(_progressEvent.percent === percent && _progressEvent.state === progressState)
				return;
			_progressEvent.percent = percent;
			_progressEvent.state = progressState;
			this.api.dispatchEvent(_progressEvent);
		};

		this.resize = function(w, h) {
			_needsResize = true;
			_newWidth = w;
			_newHeight = h;
		};

		this.unloadModel = function(model) {

			// If model was visible, remove it.
			// If it was hidden, it has already been removed from viewer and we just have to remove it from
			// the hiddenModels list in RenderScene.
			if(!this.removeModel(model) && !_modelQueue.removeHiddenModel(model)) {
				// If neither of this works, this model is unknown.
				return;
			}

			// Note that this just discards the GPU resources, not the model itself.
			model.dtor(this.glrenderer());
			_materials.cleanup(model);

			if(model.loader) {
				model.loader.dtor();
				model.loader = null;
			}

			this.api.dispatchEvent({
				type: zv.MODEL_UNLOADED_EVENT,
				model: model
			});
		};

		this._addLoadingFile = function(esdLoader) {
			if(!this.loaders) {
				this.loaders = [];
			}
			this.loaders.push(esdLoader);
		};

		this._removeLoadingFile = function(esdLoader) {
			if(this.loaders) {
				var idx = this.loaders.indexOf(esdLoader);
				if(idx >= 0) {
					this.loaders.splice(idx, 1);
				}
			}
		};

		/** Removes a model from this viewer, but (unlike unload) keeps the RenderModel usable,
		 *  so that it can be added to this or other viewers later.
		 *   @param {RenderModel}
		 *   @returns {bool} True if the model was known and has been successfully removed.
		 */
		this.removeModel = function(model) {

			if(!_modelQueue.removeModel(model)) {
				return false;
			}

			// TODO: Removing a single model should not destroy this whole thing.
			if(this.keyFrameAnimator) {
				this.keyFrameAnimator.destroy();
				this.keyFrameAnimator = null;
			}

			this.selector.removeModel(model);
			this.visibilityManager.removeModel(model);
			this.layers.removeModel(model);

			if(model === this.model) {
				this.model = null;

				if(!_modelQueue.isEmpty())
					this.model = _modelQueue.getModels()[0];
			}

			syncIdTargetCount();
			this.invalidate(true, true, true);

			return true;
		};

		function syncIdTargetCount() {
			if(zv.isMobileDevice())
				return;
			var sceneModelCount = _modelQueue.getModels().length;
			// To support more than 24 bits, the target count will have to be 2 from the get-go,
			// even for singl model usage.
			var bChanged = _renderer.setIdTargetCount(sceneModelCount);
			bChanged && _materials.toggleMRTSetting(_renderer.mrtFlags());
		}

		this.unloadCurrentModel = function() {
			//Before loading a new model, restore states back to what they
			//need to be when loading a new model. This means restoring transient
			//changes to the render state made when entering 2d mode,
			//like light preset, antialias and SAO settings,
			//and freeing GL objects specific to the old model.
			if(this.is2d) {
				this.is2d = undefined;
				this.selectionMaterial2d = null;
				this.removeOverlayScene("selection2d");
				_renderer.exit2DMode();

				//Restore the state, but do not actually switch it here, because
				//we don't want to spend the time on it
				//when switching from 2d to 2d. See corresponding
				//logic in addModel().
				_currentLightPreset = _oldLightPreset;
			}

			_renderer.beginScene(this.scene, this.camera, this.lightsOn ? this.lights : this.no_lights, true);
			_renderer.composeFinalFrame(true);

			// Destruct any ongoing loaders, in case the loading starts, but the model root hasn't created yet.
			if(this.loaders) {
				this.loaders.forEach(function(loader) {
					loader.dtor();
				});
				this.loaders = [];
			}

			var models = _modelQueue.getModels();
			for(var i = models.length - 1; i >= 0; i--)
				this.unloadModel(models[i]);
		};

		var setSelectionHighlightPasses = function(renderEdges) {
			// Tell the RenderContext about the highlight passes. Each entry in the
			// array defines a highlight pass using a specific material and drawing
			// to a specific highlight target. The passes to be drawn in renderScenePart
			// are identified by a bit mask passed in want_highlightTarget.
			var passes = [
				// Pass 1 is the visible base highlight
				{
					material: _this.selectionMaterialBase,
					target: 1,
					renderHidden: false
				},
				// Pass 2 draws over everything
				{
					material: _this.selectionMaterialTop,
					target: 0,
					renderHidden: true
				}
			];
			if(renderEdges) {
				// If we are rendering edges, then render edges in the selection.
				var edgeMaterial = _renderer.getEdgeMaterial();
				// Pass 2 renders visible edges, Pass 2 above moves to Pass 3
				passes.splice(1, 0, {
					material: edgeMaterial,
					target: 1,
					renderHidden: false
				});
				// Pass 4 renders hidden edges
				passes.push({
					material: edgeMaterial,
					target: 0,
					renderHidden: true
				});
			}
			_renderer.setSelectionMaterials(passes);
		};

		// Setup materials and stencil for selection
		var setupSelectionHighlight = function() {
			var materialPre = _this.selectionMaterialBase = new THREE.MeshPhongMaterial({
				specular: 0x080808,
				ambient: 0,
				opacity: 1.0,
				transparent: false
			});
			materialPre.packedNormals = true;
			materialPre.depthWrite = true;
			materialPre.depthTest = true;
			materialPre._polygonOffsetOn = true;
			materialPre._polygonOffsetFactor = 1;
			materialPre._polygonOffsetUnits = 0.075;
			materialPre.side = THREE.DoubleSide;

			var materialPost = _this.selectionMaterialTop = new THREE.MeshPhongMaterial({
				specular: 0x080808,
				ambient: 0,
				opacity: 0.15,
				transparent: true
			});
			materialPost.packedNormals = true;
			materialPost.depthWrite = false;
			materialPost.depthTest = false;
			materialPost.side = THREE.DoubleSide;

			// make selection material support instanced geometry
			_materials.addInstancingSupport(materialPre);
			_materials.addOverrideMaterial("selectionHighlightBase", materialPre);
			_materials.addInstancingSupport(materialPost);
			_materials.addOverrideMaterial("selectionHighlightTop", materialPost);

			setSelectionHighlightPasses(false);
		};

		this.createOverlayScene = function(name, materialPre, materialPost, camera) {
			if(materialPre) {
				_materials.addOverrideMaterial(name + "_pre", materialPre);
			}

			if(materialPost) {
				_materials.addOverrideMaterial(name + "_post", materialPost);
			}
			var s = new THREE.Scene();
			s.__lights = this.scene.__lights;
			this.overlayScenes[name] = {
				scene: s,
				camera: camera,
				materialPre: materialPre,
				materialPost: materialPost
			};
		};

		this.removeOverlayScene = function(name) {

			var overlay = this.overlayScenes[name];
			if(overlay) {
				delete this.overlayScenes[name];
				this.invalidate(false, false, true);
			}
		};

		this.addOverlay = function(overlayName, mesh) {
			this.overlayScenes[overlayName].scene.add(mesh);
			this.invalidate(false, false, true);
		};

		this.addMultipleOverlays = function(overlayName, meshes) {
			for(var i in meshes) {
				if(!meshes.hasOwnProperty(i)) continue;
				this.addOverlay(overlayName, meshes[i]);
			}
		};

		this.removeOverlay = function(overlayName, mesh) {
			if(this.overlayScenes[overlayName]) {
				this.overlayScenes[overlayName].scene.remove(mesh);
				this.invalidate(false, false, true);
			}
		};

		this.removeMultipleOverlays = function(overlayName, meshes) {
			for(var i in meshes) {
				if(!meshes.hasOwnProperty(i)) continue;
				this.removeOverlay(overlayName, meshes[i]);
			}
		};

		this.clearOverlay = function(overlayName) {

			if(!this.overlayScenes[overlayName])
				return;

			var scene = this.overlayScenes[overlayName].scene;
			var obj, i;
			for(i = scene.children.length - 1; i >= 0; --i) {
				obj = scene.children[i];
				if(obj) {
					scene.remove(obj);
				}
			}

			this.invalidate(false, false, true);
		};

		this.setClearColors = function(r, g, b, r2, g2, b2) {
			this.clearColorTop = new THREE.Vector3(r / 255.0, g / 255.0, b / 255.0);
			this.clearColorBottom = new THREE.Vector3(r2 / 255.0, g2 / 255.0, b2 / 255.0);

			//If we are using the background color as environment also,
			//create an environment map texture from the new colors
			//This is too magical and should not be necessary here -- it's done when calling setLightPreset with a light preset
			//that does not use explicit cube map.
			/*
			if (!_materials._reflectionMap || _materials._reflectionMap.isBgColor) { // TODO: don't access internal members of matman
			    var cubeMap = this.loadCubeMapFromColors(this.clearColorTop, this.clearColorBottom);
			    _renderer.setCubeMap(cubeMap);
			    _renderer.toggleEnvMapBackground(_envMapBackground);
			    this.invalidate(true);
			}
			*/

			_renderer.setClearColors(this.clearColorTop, this.clearColorBottom);
			if(_groundReflection) _groundReflection.setClearColors(this.clearColorTop, this.clearColorBottom, zv.isAndroidDevice() || zv.isIOSDevice());
			_needsClear = true;
			this.fireRenderOptionChanged();
		};

		//Similar to THREE.Box3.setFromObject, but uses the precomputed bboxes of the
		//objects instead of doing it per vertex.
		var _box3;

		function computeObjectBounds(dst, object) {

			_box3 = _box3 || new THREE.Box3();

			object.updateMatrixWorld(true);

			object.traverse(function(node) {

				var geometry = node.geometry;

				if(geometry !== undefined && geometry.visible) {

					if(!geometry.boundingBox)
						geometry.computeBoundingBox();

					_box3.copy(geometry.boundingBox);
					_box3.applyMatrix4(node.matrixWorld);
					dst.union(_box3);
				}

			});
		}

		function getOverlayBounds() {
			var bounds = new THREE.Box3();
			var overlays = _this.overlayScenes;

			for(var key in overlays) {
				if(!overlays.hasOwnProperty(key))
					continue;

				computeObjectBounds(bounds, overlays[key].scene);
			}

			//Also add the root scene -- people add overlays there too
			computeObjectBounds(bounds, _this.scene);

			return bounds;
		}

		this.getVisibleBounds = function(includeGhosted, includeOverlays) {
			var result = new THREE.Box3();
			if(!_modelQueue.isEmpty()) {
				computeObjectBounds(result, this.scene);
				result = _modelQueue.getVisibleBounds(includeGhosted).union(result);

				if(includeOverlays) {
					result = getOverlayBounds().union(result);
				}
			}
			return result;
		};

		this.getFitBounds = function(ignoreSelection) {
			var bounds;

			// If there is a valid selection, use its bounds
			if(!ignoreSelection && this.selector !== null) {
				bounds = this.selector.getSelectionBounds();
			}

			// Otherwise, if there is a valid isolation, use its bounds
			if(!bounds || bounds.empty()) {
				bounds = this.getVisibleBounds();
			}
			//console.log("  getFitBounds bounds are " + + bounds.min.x +", "+ bounds.min.y + " to " + bounds.max.x +", "+ bounds.max.y);

			return bounds;
		};

		this.getRenderProxy = function(model, fragId) {
			//currently there is a single model so the mapping
			//of fragId to render mesh is 1:1.
			return model.getFragmentList().getVizmesh(fragId);
		};

		this.getLayersRoot = function() {
			return this.layers.getRoot();
		};

		/**
		 * Create a promise for a mesh with downloaded geometry
		 * 
		 * When the promise fulfills the argument to the fulfillment function is an
		 * object with model and fragId properties that identify the mesh. We cannot
		 * fulfill using the mesh, because it may be shared and we can't guarantee
		 * execution order of independent promises.
		 * 
		 * Promises returned by this function can be canceled using
		 * Viewer3DImpl.cancelPromisedRenderProxy(promise). A canceled promise is always
		 * rejected. The canceled property of the argument to the rejection function
		 * is true when a promise is canceled.
		 * @param {Model} model - The model containing the fragment
		 * @param {number} fragId - Fragment ID.
		 * @returns {Promise} Promise for the mesh for the given fragment.
		 */
		this.promiseRenderProxy = function(model, fragId) {
			//currently there is a single model so the mapping
			//of fragId to render mesh is 1:1.
			var promise = model.getFragmentList().promiseVizmesh(fragId);
			promise.lmv_model = model;
			return promise;
		};

		/**
		 * Cancel a promise returned by promiseVizmesh
		 * 
		 * Canceled promised always rejects and the canceled property of the argument
		 * to the rejection function is set to true.
		 * @param {Promise} promise - Promise to be canceled
		 * @returns {boolean} - True if the promise is canceled. False if it isn't canceled.
		 */
		this.cancelPromisedRenderProxy = function(promise) {
			// Don't cancel a promise we didn't make
			if(!promise.lmv_model)
				return false;
			return promise.lmv_model.getFragmentList().cancelPromisedVizmesh(promise);
		};

		this.getFragmentProxy = function(model, fragId) {
			return new zvp.FragmentPointer(model.getFragmentList(), fragId);
		};

		this.getRenderProxyCount = function(model) {
			return model.getFragmentList().getCount();
		};

		this.getRenderProxyDbIds = function(model, fragId) {
			return model.getFragmentList().getDbIds(fragId);
		};

		this.isWholeModelVisible = function(model) {
			return _modelQueue ? _modelQueue.areAllVisible() : true;
		};

		this.isNodeVisible = function(nodeId, model) {
			return this.visibilityManager.isNodeVisible(model, nodeId); // swapped arguments
		};

		this.highlightObjectNode = function(model, dbId, value) {

			if(model.is2d()) {
				_materials.highlightObject2D(dbId, value); //update the 2d object id texture
				this.invalidate(false, false, true);
			}

			var scope = this;
			var map = model.getData().instanceTree || model.getData().fragmentMap;

			//TODO: There can be instance tree in the case of 2D drawing, but
			//we do not currently populate the node tree with the virtual fragment ids
			//that map 2d objects to 2d consolidated meshes, hence the use of dbId2fragId in the else condition
			if(map && !model.is2d()) {

				map.enumNodeFragments(dbId, function(fragId) {
					scope.highlightFragment(model, fragId, value);
				}, false);

			} else {
				var fragId = dbId;

				if(model.is2d())
					fragId = model.getData().fragments.dbId2fragId[dbId];

				if(Array.isArray(fragId))
					for(var i = 0; i < fragId.length; i++)
						scope.highlightFragment(model, fragId[i], value);
				else
					scope.highlightFragment(model, fragId, value);

			}

		};

		this.highlightFragment = function(model, fragId, value) {

			var mesh = this.getRenderProxy(model, fragId);

			if(!mesh)
				return;

			//And also add a mesh to the overlays in case we need that.
			//For 2D that is always the case, while for 3D it's done
			//for "fancy" single-selection where we draw an outline for the object
			//as post-processing step.
			var useOverlay = mesh.is2d || mesh.isPoint;

			var highlightId = model.id + ":" + fragId;

			if(useOverlay) {
				var overlayName = "selection";
				if(model.is2d()) overlayName += "2d";
				if(mesh.isPoint) overlayName += "_points";

				if(value) {
					// Make sure the geometry is in memory
					var promise = this.promiseRenderProxy(model, fragId);
					var _this = this;
					this.selectionMeshes[highlightId] = promise;
					promise.then(function(id) {
						// OK the geometry was downloaded
						var selectionProxy;
						var mesh = _this.getRenderProxy(id.model, id.fragId);
						// Make sure it all worked
						if(!mesh || !mesh.geometry)
							return;

						if(mesh.isPoint) {
							// using an override material would overwrite the point size for
							// each point cloud, so we apply the selection colour to the
							// duplicated geometry here instead by copying the material
							var selectionMaterial = mesh.material.clone();
							selectionMaterial.color = _this.selectionMaterialBase.color;
							selectionMaterial.needsUpdate = true;
							selectionProxy = new THREE.Mesh(mesh.geometry, selectionMaterial);
						} else {
							selectionProxy = new THREE.Mesh(mesh.geometry, mesh.material);
						}

						selectionProxy.matrix.copy(mesh.matrixWorld);
						selectionProxy.matrixAutoUpdate = false;
						selectionProxy.matrixWorldNeedsUpdate = true;

						selectionProxy.frustumCulled = false;
						selectionProxy.model = model;
						selectionProxy.fragId = fragId;

						id.model.getFragmentList().lockGeometry(fragId);
						_this.addOverlay(overlayName, selectionProxy);

						_this.selectionMeshes[highlightId] = selectionProxy;
					}).catch(function(error) {
						if(!error.canceled) {
							delete _this.selectionMeshes[highlightId];
						}
					});
				} else if(this.selectionMeshes.hasOwnProperty(highlightId)) {
					var proxy = this.selectionMeshes[highlightId];
					if(proxy instanceof Promise)
						this.cancelPromisedRenderProxy(proxy);
					else {
						model.getFragmentList().unlockGeometry(fragId);
						this.removeOverlay(overlayName, proxy);
					}
					delete this.selectionMeshes[highlightId];
				}
			}

			if(!useOverlay || !value) {
				//Case where highlighting was done directly in the primary render queue
				//and we need to repaint to clear it. This happens when multiple
				//nodes are highlighted using e.g. right click in the tree view
				if(model.setHighlighted(fragId, value)) //or update the vizflags in the render queue for 3D objects
					this.invalidateHighlight();
			}
		};

		this.explode = function(scale) {

			if(scale == _explodeScale)
				return;

			_explodeScale = scale;

			_modelQueue.explode(scale);

			//force a repaint and a clear
			this.sceneUpdated(true);

			this.api.dispatchEvent({
				type: zv.EXPLODE_CHANGE_EVENT,
				scale: scale
			});
		};

		/**
		 * Gets the last applied explode scale
		 */
		this.getExplodeScale = function() {
			return _explodeScale;
		};

		/* simple function to set the brightness of the ghosting.
		 * Simply sets another colour that is better for brighter environments
		 * 模型隔离后半透明物体颜色，原来第一个颜色为101010
		 */
		this.setGhostingBrightness = function(darkerFade) {
			if(darkerFade) {
				
				this.fadeMaterial.color = new THREE.Color(0xADD8E6);
			} else {
				this.fadeMaterial.color = new THREE.Color(0xffffff);
			}
			this.fadeMaterial.needsUpdate = true;
		};

		this.loadCubeMapFromColors = function(ctop, cbot) {
			var texture = zvp.CreateCubeMapFromColors(ctop, cbot);
			texture.isBgColor = true;
			_materials.setReflectionMap(texture);
			return texture;
		};

		this.loadCubeMap = function(path, exposure) {

			this._reflectionMapPath = path;

			var mapDecodeDone = function(map) {

				//If setCubeMap was called twice quickly, it's possible that
				//a texture map that is no longer desired loads after the one that was
				//set last. In such case, just make the undesirable disappear into the void.
				if(path !== _this._reflectionMapPath)
					return;

				_materials.setReflectionMap(map);
				_this.invalidate(true);

				if(!map) {
					_this.loadCubeMapFromColors(_this.clearColorTop, _this.clearColorBottom);
				} else if(!zvp.LightPresets[_currentLightPreset].useIrradianceAsBackground) {
					_renderer.setCubeMap(map);
				}
			};

			return WGS.TextureLoader.loadCubeMap(path, exposure, mapDecodeDone);
		};

		this.loadIrradianceMap = function(path, exposure) {

			this._irradianceMapPath = path;

			var mapDecodeDone = function(map) {

				//If setCubeMap was called twice quickly, it's possible that
				//a texture map that is no longer desired loads after the one that was
				//set last. In such case, just make the undesirable disappear into the void.
				if(path !== _this._irradianceMapPath)
					return;

				_materials.setIrradianceMap(map);
				_this.invalidate(true);

				if(zvp.LightPresets[_currentLightPreset].useIrradianceAsBackground)
					_renderer.setCubeMap(map);
			};

			return WGS.TextureLoader.loadCubeMap(path, exposure, mapDecodeDone);

		};

		this.setLightPreset = function(index, force) {
			// make sure that lights are created
			if(!_lightsInitialized) {
				this.initLights();
			}

			if(_currentLightPreset === index && !force)
				return;

			// Reset index in cases the index out of range.
			// This could happen, if we update the light preset list and user
			// has a local web storage which stores the last accessed preset index which is potentially
			// out of range with respect to the new preset list.
			if(index < 0 || zvp.LightPresets.length <= index) {
				index = zvp.DefaultLightPreset;
			}

			_currentLightPreset = index;
			var preset = zvp.LightPresets[index];

			//if the light preset has a specific background color, set that
			//This has to be done first, because the encironment map may use
			//the background colors in case no environment map is explicitly given.
			var c = preset.bgColorGradient;
			if(!c)
				c = zvp.BackgroundPresets["Custom"];
			this.setClearColors(c[0], c[1], c[2], c[3], c[4], c[5]);

			if(preset && preset.path) {

				var pathPrefix = "res/environments/" + preset.path;
				var reflPath = zvp.getResourceUrl(pathPrefix + "_mipdrop." + (preset.type || "") + ".dds");
				var irrPath = zvp.getResourceUrl(pathPrefix + "_irr." + (preset.type || "") + ".dds");

				this.loadIrradianceMap(irrPath, preset.E_bias);
				this.loadCubeMap(reflPath, preset.E_bias);

				//Set exposure that the environment was baked with.
				//This has to be known at baking time and is applied
				//by the shader.
				_materials.setEnvExposure(-preset.E_bias);
				_renderer.setEnvExposure(-preset.E_bias);

				this.setTonemapExposureBias(preset.E_bias);
				this.setTonemapMethod(preset.tonemap);

				this.setGhostingBrightness(preset.darkerFade);
			} else {
				var cubeMap = this.loadCubeMapFromColors(this.clearColorTop, this.clearColorBottom);
				_renderer.setCubeMap(cubeMap);
				_materials.setIrradianceMap(null);
				//_materials.setReflectionMap(cubeMap); //will be set by the loadCubeMapFromColors call

				//Set exposure that the environment was baked with.
				//This has to be known at baking time and is applied
				//by the shader.
				_materials.setEnvExposure(-preset.E_bias || 0);
				_renderer.setEnvExposure(-preset.E_bias || 0);

				this.setTonemapExposureBias(preset.E_bias || 0);
				this.setTonemapMethod(preset.tonemap || 0);

				this.setGhostingBrightness(preset.darkerFade);

				_renderer.toggleEnvMapBackground(_envMapBackground);

				this.invalidate(true);
			}

			//To begin with, get the SAO defaults from the shader uniforms definition
			//Note the scaling we apply to inverse scaling done by the setAOOptions API internally.
			//This is not pretty....
			var saoRadius = zv.Shaders.SAOShader.uniforms.radius.value;
			var saoIntensity = zv.Shaders.SAOShader.uniforms.intensity.value;

			//Check if the preset overrides the SAO settings
			if(preset.hasOwnProperty("saoRadius"))
				saoRadius = preset.saoRadius;
			if(preset.hasOwnProperty("saoIntensity"))
				saoIntensity = preset.saoIntensity;
			_renderer.setAOOptions(saoRadius, saoIntensity);

			var lightIntensity = _defaultLightIntensity;
			if(preset.lightMultiplier !== null && preset.lightMultiplier !== undefined) {
				lightIntensity = preset.lightMultiplier;
			}

			// init primary light direction used for shadows
			_shadowLightDir.copy(_shadowLightDirDefault);
			if(preset.lightDirection) {
				// The presets describe the direction away from the light, while _shadowLightDir
				// is the direction pointing to the light.
				_shadowLightDir.fromArray(preset.lightDirection).negate();
			}

			// changing the shadow light direction invalidates the shadow-map
			if(_shadowMaps) {
				invalidateShadowMap();
			}

			if(this.dir_light1) {
				this.dir_light1.intensity = lightIntensity;

				if(preset.lightDirection) {
					this.dir_light1.position.set(-preset.lightDirection[0], -preset.lightDirection[1], -preset.lightDirection[2]);
					this.highlight_dir_light1.position.set(-preset.lightDirection[0], -preset.lightDirection[1], -preset.lightDirection[2]);
				} else {
					// set to default, otherwise the environment will inherit the direction from whatever previous environment was chosen
					this.dir_light1.position.copy(_lightDirDefault);
					this.highlight_dir_light1.position.copy(_lightDirDefault);
				}

			}

			_materials.setEnvRotation(preset.rotation || 0.0);
			_renderer.setEnvRotation(preset.rotation || 0.0);

			if(_groundReflection) _groundReflection.setEnvRotation(preset.rotation || 0.0);

			// toggle lights on/off based on lightMultiplier
			this.toggleLights(lightIntensity !== 0.0);

			this.invalidate(true, false, true);

			this.fireRenderOptionChanged();
		};

		this.setLightPresetFromFile = function(model) {
			if(!model || model.is2d()) {
				return false;
			}

			var style = model.getMetadata('renderEnvironmentStyle', 'value', null);
			if((style === null) || (style === ""))
				return false;

			// TODO add more control for environments
			// the user cannot set anything expect the style from current UI
			// currently only the style can be selected.
			// TODO We cannot control these values so comment out for now
			var grndReflection = model.getMetadata('renderEnvironmentGroundReflection', 'value', null);
			if(grndReflection !== null) {
				if(this.api.prefs.hasTag('groundReflection', 'ignore-producer')) {
					zvp.logger.debug('setLightPresetFromFile(): groundReflection is locked. No changes.');
				} else {
					this.api.prefs.tag('no-storage', 'groundReflection');
					this.api.setGroundReflection(grndReflection);
				}
			}

			var grndShadow = model.getMetadata('renderEnvironmentGroundShadow', 'value', null);
			if(grndShadow !== null) {
				if(this.api.prefs.hasTag('groundShadow', 'ignore-producer')) {
					zvp.logger.debug('setLightPresetFromFile(): groundShadow is locked. No changes.');
				} else {
					this.api.prefs.tag('no-storage', 'groundShadow');
					this.api.setGroundShadow(grndShadow);
				}
			}
			var ambientShadows = model.getMetadata('renderEnvironmentAmbientShadows', 'value', null);
			if(ambientShadows !== null) {
				if(this.api.prefs.hasTag('ambientShadows', 'ignore-producer')) {
					zvp.logger.debug('setLightPresetFromFile(): ambientShadows is locked. No changes.');
				} else {
					this.api.prefs.tag('no-storage', 'ambientShadows');
					// kludgey, but maintains previous API linking these two different algorithms together
					this.api.setQualityLevel(ambientShadows, _renderer.getAntialiasing());
				}
			}
			var displayLines = model.getMetadata('renderEnvironmentDisplayLines', 'value', null);
			if(displayLines !== null) {
				if(this.api.prefs.hasTag('lineRendering', 'ignore-producer')) {
					zvp.logger.debug('setLightPresetFromFile(): lineRendering is locked. No changes.');
				} else {
					this.api.prefs.tag('no-storage', 'lineRendering');
					this.api.hideLines(!displayLines);
				}
			}
			var displayPoints = model.getMetadata('renderEnvironmentDisplayPoints', 'value', null);
			if(displayPoints !== null) {
				if(this.api.prefs.hasTag('pointRendering', 'ignore-producer')) {
					zvp.logger.debug('setLightPresetFromFile(): pointRendering is locked. No changes.');
				} else {
					this.api.prefs.tag('no-storage', 'pointRendering');
					this.api.hidePoints(!displayPoints);
				}
			}

			var preset = zvp.LightPresets.filter(function(lightPreset) {
				return lightPreset.name === style;
			});
			preset = preset[0] || null;
			if(preset) {
				if(this.api.prefs.hasTag('lightPreset', 'ignore-producer')) {
					zvp.logger.debug('setLightPresetFromFile(): lightPreset is locked. No changes.');
				} else {
					this.api.prefs.tag('no-storage', 'lightPreset');

					// Create an env based on an existing preset
					// and add it at the end of the official list
					var env = zvp.ModelSettingsEnvironment;
					if(!env) {
						env = zvp.ModelSettingsEnvironment = {};
						zvp.LightPresets.push(env);
					}

					// Copy existing Preset into custom Model-Loaded preset
					zvp.copyLightPreset(preset, env);

					// Override Name for use in UI
					env.name = '(Custom: Model defined)'; // TODO: Localize

					// Override Environment Exposure Values
					var exposureBias = model.getMetadata('renderEnvironmentExposureBias', 'value', null);
					var exposureBase = model.getMetadata('renderEnvironmentExposureBase', 'value', null);
					if(exposureBias !== null && exposureBase !== null) {
						env.E_bias = exposureBias + exposureBase;
					}

					// Override Environment Background Color
					// Note that there's a specific preset for background color
					var bgColor = model.getMetadata('renderEnvironmentBackgroundColor', 'value', null);
					if(this.api.prefs.hasTag('backgroundColorPreset', 'ignore-producer')) {
						zvp.logger.debug('setLightPresetFromFile(): backgroundColorPreset is locked. No changes.');
					} else if(bgColor) {
						env.bgColorGradient = [
							255.0 * bgColor[0], 255.0 * bgColor[1], 255.0 * bgColor[2],
							255.0 * bgColor[0], 255.0 * bgColor[1], 255.0 * bgColor[2]
						];
					}

					// Override Environment Rotation
					var envRotation = model.getMetadata('renderEnvironmentRotation', 'value', null); //assumed radians
					if(envRotation !== null) {
						env.rotation = envRotation;
					}

					var i = zvp.LightPresets.indexOf(env);
					this.setLightPreset(i, true);
				}
			}

			var bgEnvironment = model.getMetadata('renderEnvironmentBackgroundFromEnvironment', 'value', null);
			if(bgEnvironment !== null) {
				if(this.api.prefs.hasTag('envMapBackground', 'ignore-producer')) {
					zvp.logger.debug('setLightPresetFromFile(): envMapBackground is locked. No changes.');
				} else {
					this.api.prefs.tag('no-storage', 'envMapBackground');
					this.api.setEnvMapBackground(bgEnvironment);
				}
			}

			// Important to return the model defined preset
			return preset;
		};

		this.setLightPresetForAec = function() {

			//Find the AEC light preset
			var presetName = zvp.DefaultLightPresetAec || "Boardwalk";
			var idx = -1;
			for(var i = 0; i < zvp.LightPresets.length; i++) {
				if(zvp.LightPresets[i].name === presetName) {
					idx = i;
					break;
				}
			}

			if(idx >= 0) {
				if(this.api.prefs.hasTag('lightPreset', 'ignore-producer')) {
					zvp.logger.debug('setLightPresetForAec(): lightPreset is locked. No changes.');
				} else {
					this.api.prefs.tag('no-storage', 'lightPreset');

					this.setLightPreset(idx, true);
				}
			}

			//If allowed, display the environment as background (most likely the irradiance map will be used
			//by the AEC presets, so it will be almost like a color gradient)
			if(this.api.prefs.hasTag('envMapBackground', 'ignore-producer')) {
				zvp.logger.debug('setLightPresetForAec(): envMapBackground is locked. No changes.');
			} else {
				this.api.prefs.tag('no-storage', 'envMapBackground');
				this.api.setEnvMapBackground(true);
			}

			//If allowed, display edge topology
			if(this.api.prefs.hasTag('edgeRendering', 'ignore-producer')) {
				zvp.logger.debug('setLightPresetForAec(): edgeRendering is locked. No changes.');
			} else {
				this.api.prefs.tag('no-storage', 'edgeRendering');
				this.api.setDisplayEdges(!zv.isMobileDevice());
			}

			return true;
		};

		this.setAOHeuristics = function(model) {

			//Decide on what SSAO settings to use.

			//TODO: it may be better to integrate SAO settings into the
			//environment/light preset, however this would require knowledge of the model units.
			//Starting to take into account the units for existing data would change the AO
			//that people are used to seeing, so the choice here is to only take into account
			//units

			if(model.isAEC()) {
				var metersPerModelUnit = model.getUnitScale();
				var largeRadius = (metersPerModelUnit > 0.3);

				if(largeRadius) {
					//AEC model in meters or feet -- probably building
					//use room-sized radius
					_renderer.setAOOptions(4.0 / metersPerModelUnit, 1.0, 0.625);
				} else {
					//AEC model in inches or cm -- most likely a factory floor with lots
					//of small things / pipes / nuts / bolts, use smaller radius.
					_renderer.setAOOptions(0.25 / metersPerModelUnit, 1.0, 0.625);
				}
			} else {

				// Compute a rough size for the model, so that we can set a reasonable AO radius.
				// This simple approach is reasonable for mechanical models, but is probably too
				// large a value for architectural models, where the viewer is inside the model
				// and so the model itself is relatively large compared to the viewer.
				var bbox = model.getData().bbox;
				var diagonalLength = bbox.size().length();

				// 10 works well as a default for most models, including
				// architectural scenes. Surprising! But, for small models,
				// where for some reason the model is not in "human-sized units",
				// 0.05 says the ambient occlusion should extend 5% of the
				// diagonal length of the model.
				// The 10 here should match the SAOShader.js radius of 10.
				_renderer.setAOOptions(Math.min(10.0, 0.05 * diagonalLength));

			}

		};

		this.setTonemapMethod = function(index) {

			if(index == _renderer.getToneMapMethod())
				return;

			_renderer.setTonemapMethod(index);
			_materials.setTonemapMethod(index);

			this.fireRenderOptionChanged();
			this.invalidate(true);
		};

		this.setTonemapExposureBias = function(bias) {

			if(bias == _renderer.getExposureBias())
				return;

			_renderer.setTonemapExposureBias(bias);
			_materials.setTonemapExposureBias(bias);

			this.fireRenderOptionChanged();
			this.invalidate(true);
		};

		this.setRenderingPrefsFor2D = function(is2D) {

			if(!zv.isNodeJS) {
				var value = is2D ? false : !!this.api.prefs.envMapBackground;
				this.toggleEnvMapBackground(value);
			}
		};

		/**
		 * Unloads model, frees memory, as much as possible.
		 */
		this.dtor = function() {
			window.cancelAnimationFrame(_reqid);

			this.api.removeEventListener(ZhiUTech.Viewing.MODEL_ROOT_LOADED_EVENT, _memoryLimit);
			this.api.removeEventListener(zv.MODEL_UNLOADED_EVENT, _memoryLimit);

			this.unloadCurrentModel();

			// this.controls is uninitialized by Viewer3D, since it was initialized there
			this.controls = null;
			this.canvas = null;

			this.loader = null;

			this.selector.dtor();
			this.selector = null;

			this.model = null;
			this.layers = null;
			this.visibilityManager = null;

			if(this.geomCache) {
				this.geomCache.dtor();
				this.geomCache = null;
			}

			_modelQueue = null;
			_renderer = null;
			_materials.dtor();
			_materials = null;
		};

		this.hideLines = function(hide) {
			if(_modelQueue && !_modelQueue.isEmpty()) {
				_modelQueue.hideLines(hide);
				this.sceneUpdated(true);
				return true;
			}
			return false;
		};

		this.hidePoints = function(hide) {
			if(_modelQueue && !_modelQueue.isEmpty()) {
				_modelQueue.hidePoints(hide);
				this.sceneUpdated(true);
				return true;
			}
			return false;
		};

		this.setDisplayEdges = function(show) {

			_renderer.toggleEdges(show);
			setSelectionHighlightPasses(show);

			this.invalidateHighlight();
			this.invalidate(true);
		};

		this.getCutPlanes = function() {
			return _materials.getCutPlanes();
		};

		this.setCutPlanes = function(planes) {
			_materials.setCutPlanes(planes);
			this.sceneUpdated();
			this.api.dispatchEvent({
				type: zv.CUTPLANES_CHANGE_EVENT,
				planes: planes
			});
		};

		this.fireRenderOptionChanged = function() {

			//If SAO is changing and we are using multiple
			//render targets in the main material pass, we have
			//to update the materials accordingly.
			_materials.toggleMRTSetting(_renderer.mrtFlags());

			this.api.dispatchEvent({
				type: zv.RENDER_OPTION_CHANGED_EVENT
			});
		};

		this.viewportToRay = function(vpVec, ray) {
			var camera = this.camera;

			// set two vectors with opposing z values
			vpVec.z = -1.0;
			var end = new THREE.Vector3(vpVec.x, vpVec.y, 1.0);
			vpVec = vpVec.unproject(camera);
			end = end.unproject(camera);

			// find direction from vector to end
			end.sub(vpVec).normalize();

			if(!ray)
				ray = new THREE.Ray();

			ray.set(!camera.isPerspective ? vpVec : camera.position, end);

			return ray;
		};

		// Add "meshes" parameter, after we get meshes of the object using id buffer,
		// then we just need to ray intersect this object instead of all objects of the model.
		this.rayIntersect = function(ray, ignoreTransparent, dbIds, modelIds, intersections) {
			var result = _modelQueue.rayIntersect(ray.origin, ray.direction, ignoreTransparent, dbIds, modelIds, intersections);

			if(this.sceneAfter.children.length) {
				var raycaster = new THREE.Raycaster(ray.origin, ray.direction, this.camera.near, this.camera.far);
				var intersects = [];
				zvp.VBIntersector.intersectObject(this.sceneAfter, raycaster, intersects, true);

				if(intersects.length) {
					if(!result || intersects[0].distance < result.distance) {
						result = intersects[0];
					}
				}
			}

			if(!result)
				return null;

			var fragId = result.fragId,
				intersectPoint = result.point,
				face = result.face,
				model = result.model;

			var dbId = result.dbId;
			if(dbId === undefined && fragId !== undefined /* 0 is a valid fragId */ ) {

				dbId = model.getFragmentList().getDbIds(fragId);
				var fragmentMap = model.getData().instanceTree || model.getData().fragmentMap;

				if(!fragmentMap) {
					//Case where there is no dbid to fragment id map. Create a 'virtual' node
					//with node Id = fragment Id, so that selection works like
					//each scene fragment is a scene node by itself.
					dbId = fragId;
				}
			}

			return {
				dbId: dbId,
				fragId: fragId,
				"intersectPoint": intersectPoint,
				"face": face,
				"model": model
			};
		};

		this.castRayViewport = function() {

			var _ray;

			// Add "meshes" parameter, after we get meshes of the object using id buffer,
			// then we just need to ray intersect this object instead of all objects of the model.
			return function(vpVec, ignoreTransparent, dbIds, modelIds, intersections) {

				_ray = _ray || new THREE.Ray();

				if(!_modelQueue) {
					return {};
				}

				this.viewportToRay(vpVec, _ray);

				return this.rayIntersect(_ray, ignoreTransparent, dbIds, modelIds, intersections);
			};

		}();

		this.getCanvasBoundingClientRect = function() {
			if(this.canvasBoundingclientRectDirty) {
				this.canvasBoundingclientRectDirty = false;
				this.boundingClientRect = this.canvas.getBoundingClientRect();
			}
			return this.boundingClientRect;
		};

		this.clientToViewport = function(clientX, clientY) {
			var rect = this.getCanvasBoundingClientRect();
			return new THREE.Vector3(
				((clientX + 0.5) / rect.width) * 2 - 1, -((clientY + 0.5) / rect.height) * 2 + 1, 1);
		};

		this.viewportToClient = function(viewportX, viewportY) {
			var rect = this.getCanvasBoundingClientRect();
			return new THREE.Vector3(
				(viewportX + 1) * 0.5 * rect.width - 0.5,
				(viewportY - 1) * -0.5 * rect.height - 0.5, 0);
		};

		this.castRay = function(clientX, clientY, ignoreTransparent) {
			// Use the offsets based on the client rectangle, which is relative to the browser's client
			// rectangle, unlike offsetLeft and offsetTop, which are relative to a parent element.
			//
			return this.castRayViewport(this.clientToViewport(clientX, clientY), ignoreTransparent);
		};

		// Note: The camera world matrix must be up-to-date
		this.intersectGroundViewport = function(vpVec) {

			var camera = this.camera;

			var worldUp = "z";

			//In 2D mode, the roll tool can be used to change the orientation
			//of the sheet, which will also set the world up vector to the new orientation.
			//However, this is not what we want in case of a 2d sheet -- its ground plane is always Z.
			//TODO: It's not clear if checking here or in setWorldUp is better. Also I don't see
			//a way to generalize the math in a way to make it work without such check (e.g. by using camera up only).
			if(!this.is2d) {
				worldUp = _worldUpName;
			}

			var vector = vpVec;

			// set two vectors with opposing z values
			vector.z = -1.0;
			var end = new THREE.Vector3(vector.x, vector.y, 1.0);
			vector = vector.unproject(camera);
			end = end.unproject(camera);

			// find direction from vector to end
			end.sub(vector).normalize();

			var dir = end;

			//Is the direction parallel to the ground plane?
			//Then we fail.
			if(Math.abs(dir[worldUp]) < 1e-6)
				return null;

			var rayOrigin;
			if(camera.isPerspective) {
				rayOrigin = camera.position;
			} else {
				rayOrigin = vector;
			}

			var baseElev = this.model ? this.model.getBoundingBox().min[worldUp] : 0;

			var distance = (baseElev - rayOrigin[worldUp]) / dir[worldUp];

			//2D drawing, intersect the plane
			dir.multiplyScalar(distance);
			dir.add(rayOrigin);

			return dir;
		};

		this.intersectGround = function(clientX, clientY) {
			return this.intersectGroundViewport(this.clientToViewport(clientX, clientY));
		};

		this.hitTestViewport = function(vpVec, ignoreTransparent) {

			var result;

			if(_this.is2d) {

				var dbId;
				var ids = [];
				if(zv.isMobileDevice()) {
					// Set the detection area to 44*44 pixel rectangle according to Apple's iOS Human Interface Guidelines
					dbId = _renderer.idAtPixels(vpVec.x, vpVec.y, 45, ids);
				} else {
					// Set the detection area to 5*5 pixel search rectangle
					dbId = _renderer.idAtPixels(vpVec.x, vpVec.y, 5, ids);
				}

				if(dbId <= 0)
					return null;

				//Note this function will destructively modify vpVec,
				//so it's unusable after that.
				var point = this.intersectGroundViewport(vpVec);

				var model = _modelQueue.findModel(ids[1]) || _this.model;

				//var node = dbId ? { dbId : dbId, fragIds : _this.model.getData().fragments.dbId2fragId[dbId] } : null;
				result = {
					intersectPoint: point,
					dbId: dbId,
					fragId: model.getData().fragments.dbId2fragId[dbId],
					model: model
				};
			} else {

				result = this.castRayViewport(vpVec, ignoreTransparent);

			}

			return result;
		};

		this.hitTest = function(clientX, clientY, ignoreTransparent) {

			return _this.hitTestViewport(this.clientToViewport(clientX, clientY), ignoreTransparent);

		};

		this.snappingHitTestViewport = function(vpVec, ignoreTransparent) {

			var result, point, dbId;

			if(this.model && this.model.getData().isLeaflet) {
				point = this.intersectGroundViewport(vpVec);
				result = {
					intersectPoint: point
				};
			} else if(_this.is2d) {

				if(zv.isMobileDevice()) {
					//Set the detection area to 44*44 pixel rectangle according to Apple's iOS Human Interface Guidelines
					//Notice: The amount of pixels per line should correspond to pixelSize in setDetectRadius of Snapper.js,
					//the shape of detection area is square in idAtPixels, but circle in snapper, should make their areas match roughly.
					dbId = _renderer.idAtPixels(vpVec.x, vpVec.y, 101);
				} else {
					//Notice: The amount of pixels per line should correspond to pixelSize in setDetectRadius of Snapper.js,
					//the shape of detection area is square in idAtPixels, but circle in snapper, should make their areas match roughly.
					dbId = _renderer.idAtPixels(vpVec.x, vpVec.y, 17);
				}

				// Need to do hitTest in snapping when dbId = 0
				if(dbId < 0)
					return null;

				//Note this function will destructively modify vpVec,
				//so it's unusable after that.
				point = this.intersectGroundViewport(vpVec);

				// get fragment ID if there is a fragment list
				var fragments = _this.model.getData().fragments;
				var fragId = (fragments ? fragments.dbId2fragId[dbId] : -1);

				//var node = dbId ? { dbId : dbId, fragIds : _this.model.getData().fragments.dbId2fragId[dbId] } : null;
				result = {
					intersectPoint: point,
					dbId: dbId,
					fragId: fragId
				};

				if(dbId) {
					//result.node = ... get the node for the dbId here
				}

			} else {

				dbId = _renderer.idAtPixel(vpVec.x, vpVec.y);

				result = this.castRayViewport(vpVec, ignoreTransparent, dbId > 0 ? [dbId] : null);

			}

			return result;
		};

		// Used for snapping
		// firstly, find the intersect object using pre-computed ID buffer
		// secondly, find the intersect point and face using intersection test
		this.snappingHitTest = function(clientX, clientY, ignoreTransparent) {

			return this.snappingHitTestViewport(this.clientToViewport(clientX, clientY), ignoreTransparent);
		};

		//Used for rollover highlighting using pre-computed ID buffer
		//Currently only the 2D code path can do this.
		this.rolloverObjectViewport = function(vpVec) {

			//Not supported for 3d.
			//if (!this.is2d)
			//    return;
			if(this.model && this.model.getData().isLeaflet)
				return;

			if(_renderer.rolloverObjectViewport(vpVec.x, vpVec.y))
				this.invalidate(false, false, true);
		};

		this.rolloverObject = function(clientX, clientY) {

			if(!this.selector.highlightPaused && !this.selector.highlightDisabled)
				this.rolloverObjectViewport(this.clientToViewport(clientX, clientY));
		};

		//This method is intended to be used by Tools
		this.pauseHighlight = function(disable) {

			this.selector.highlightPaused = disable;
			if(disable) {
				_renderer.rolloverObjectId(-1);
				this.invalidate(false, false, true);
			}
		};

		this.disableHighlight = function(disable) {

			this.selector.highlightDisabled = disable;
			if(disable) {
				_renderer.rolloverObjectId(-1);
				this.invalidate(false, false, true);
			}
		};

		this.disableSelection = function(disable) {

			this.selector.selectionDisabled = disable;
		};

		this.rolloverObjectNode = function(dbId, model) {

			var dbIds = [];
			model = model || _this.model;
			var it = model ? model.getData().instanceTree : undefined;

			if(it) {

				it.enumNodeChildren(dbId, function(childId) {
					dbIds.push(childId);
				}, true);

				// Sort the array to get the dbIds range, it should exclude the first node which
				// is local root, since its dbId may not be serial number like its descendants.
				if(dbIds.length > 1) {
					var temp = dbIds.shift();
					dbIds.sort(function(a, b) {
						return a - b;
					});
					dbIds.unshift(temp);
				}

			} else {
				dbIds.push(dbId);
			}

			var modelId = model ? model.id : 0;
			if(_renderer.rolloverObjectId(dbId, dbIds, modelId))
				this.invalidate(false, false, true);
		};

		// https://github.com/ebidel/filer.js/blob/master/src/filer.js
		function dataURLToBlob(dataURL) {
			var BASE64_MARKER = ';base64,';
			var parts, contentType, raw;
			if(dataURL.indexOf(BASE64_MARKER) == -1) {
				parts = dataURL.split(',');
				contentType = parts[0].split(':')[1];
				raw = decodeURIComponent(parts[1]);

				return new Blob([raw], {
					type: contentType
				});
			}

			parts = dataURL.split(BASE64_MARKER);
			contentType = parts[0].split(':')[1];
			raw = window.atob(parts[1]);
			var rawLength = raw.length;

			var uInt8Array = new Uint8Array(rawLength);

			for(var i = 0; i < rawLength; ++i) {
				uInt8Array[i] = raw.charCodeAt(i);
			}

			return new Blob([uInt8Array], {
				type: contentType
			});
		}

		//this function get a blob object
		this.getScreenShotBuffer = function(w, h, cb) {
			_renderer.presentBuffer();
			var blobobj = _this.canvas.toDataURL("image/png");

			var flip = zv.isSafari();
			flip |= zv.isIOSDevice();
			if(flip) {
				w = w ? w : _newWidth;
				h = h ? h : _newHeight;
			}

			if(!w || !h)
				return blobobj;

			// calc resize and center
			var nw, nh, nx = 0,
				ny = 0;
			if(w > h || (_newWidth / _newHeight < w / h)) {
				nw = w;
				nh = _newHeight / _newWidth * w;
				ny = h / 2 - nh / 2;
			} else {
				nh = h;
				nw = _newWidth / _newHeight * h;
				nx = w / 2 - nw / 2;
			}

			var blobURL = window.URL.createObjectURL(dataURLToBlob(_this.canvas.toDataURL("image/png")));
			// new image from blobURL
			var img = new Image();
			img.src = blobURL;

			// create working canvas
			var tmpCanvas = document.createElement("canvas");
			var ctx = tmpCanvas.getContext("2d");
			tmpCanvas.width = w;
			tmpCanvas.height = h;

			// draw image on canvas
			img.onload = function() {
				if(flip) {
					ctx.translate(0, nh);
					ctx.scale(1, -1);
				}
				ctx.drawImage(img, nx, ny, nw, nh);
				var newobj = tmpCanvas.toDataURL("image/png");
				var newBlobURL = window.URL.createObjectURL(dataURLToBlob(tmpCanvas.toDataURL("image/png")));
				if(cb)
					cb(newobj);
				else
					window.open(newBlobURL);
			};
		};

		// we use Blob URL, Chrome crashes when opening dataURL that is too large
		// https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
		this.getScreenShot = function(w, h, cb) {

			function reframeBlob(blobURL, w, h, flip, cb) {

				if(!flip && (!w || !h)) {
					cb && cb(blobURL);
				} else {
					// calc resize and center
					var nw, nh, nx = 0,
						ny = 0;
					if(w > h || (_newWidth / _newHeight < w / h)) {
						nw = w;
						nh = _newHeight / _newWidth * w;
						ny = h / 2 - nh / 2;
					} else {
						nh = h;
						nw = _newWidth / _newHeight * h;
						nx = w / 2 - nw / 2;
					}

					// new image from blobURL
					var img = new Image();
					img.src = blobURL;

					// create working canvas
					var tmpCanvas = document.createElement("canvas");
					var ctx = tmpCanvas.getContext("2d");
					tmpCanvas.width = w;
					tmpCanvas.height = h;

					// draw image on canvas
					img.onload = function() {
						if(flip) {
							ctx.translate(0, nh);
							ctx.scale(1, -1);
						}
						ctx.drawImage(img, nx, ny, nw, nh);
						var newBlobURL = window.URL.createObjectURL(dataURLToBlob(tmpCanvas.toDataURL("image/png")));
						if(cb) {
							cb(newBlobURL);
						} else {
							window.open(newBlobURL);
						}
					};
				}
			}

			_renderer.presentBuffer();
			var blobURL = window.URL.createObjectURL(dataURLToBlob(_this.canvas.toDataURL("image/png")));

			// It seems there is not a better way to detect if the resulting image needs to be flipped.
			var flip = zv.isSafari();
			flip |= zv.isIOSDevice();
			if(flip) {
				w = w ? w : _newWidth;
				h = h ? h : _newHeight;
			}

			reframeBlob(blobURL, w, h, flip, cb);
		};

		//This accessor is only used for debugging purposes a.t.m.
		this.modelQueue = function() {
			return _modelQueue;
		};

		this.glrenderer = function() {
			return _webglrender;
		};

		this.renderer = function() {
			return _renderer;
		};

		// only for debugging purposes
		this.shadowMaps = function() {
			return _shadowMaps;
		};

		this.worldUp = function() {
			return _worldUp;
		};
		this.worldUpName = function() {
			return _worldUpName;
		};

		this.setUserRenderContext = function(ctx) {
			_renderer = (ctx) ? ctx : new zvp.RenderContext();
			_renderer.init(_webglrender, this.canvas.clientWidth, this.canvas.clientHeight);
			_renderer.setClearColors(this.clearColorTop, this.clearColorBottom);
			this.invalidate(true);
			this.sceneUpdated(false); //to reset world boxes needed by new RenderContext for shadows, etc
		};

		this.invalidate = function(needsClear, needsRender, overlayDirty) {
			//this.invalidate = function(needsClear, needsRender, overlayDirty, spectorDump) {
			_needsClear = needsClear || _needsClear;
			_needsRender = needsRender || _needsRender;
			_overlayDirty = overlayDirty || _overlayDirty;
			//_spectorDump = spectorDump || _spectorDump;
		};

		this.invalidateHighlight = function() {
			_highlightDirty = true;
			this.invalidate(false, false, true);
		};

		// needed for command system
		this.isOverlayDirty = function() {
			return _overlayDirty;
		};

		this.clearOverlayDirtyFlag = function() {
			_overlayDirty = false;
		};

		this.sceneUpdated = function(objectsMoved) {

			this.invalidate(true, false, true);

			// Mark the scene bounds for update
			if(_modelQueue && objectsMoved) {
				_modelQueue.invalidateVisibleBounds();
				this.zoomBoundsChanged = true;
			}

			_sceneDirty = true;

			invalidateShadowMap();
		};

		// immediately restart rendering, make it interruptible like progressive, displaying only when done
		this.requestSilentRender = function() {
			_deferredSilentRender = _immediateSilentRender = true;
		};

		// restart rendering only when the previous render is done, make it interruptible like progressive, itself displaying only when done
		this.requestDeferredSilentRender = function() {
			_deferredSilentRender = true; // but not immediate
		};

		this.currentLightPreset = function() {
			return _currentLightPreset;
		};

		this.matman = function() {
			return _materials;
		};

		this.fps = function() {
			return 1000.0 / _frameTimeAvg;
		};

		this.setFPSTargets = function(min, target, max) {
			MAX_FRAME_BUDGET = 1000 / max;
			MIN_FRAME_BUDGET = 1000 / min;
			TARGET_FRAME_TIME = 1000 / target;
			// TODO mismatch! Why / 4 here, and / 2 below (search on targetFrameBudget)?
			this.targetFrameBudget = zv.isMobileDevice() ? TARGET_FRAME_TIME / 4 : TARGET_FRAME_TIME;
		};

		//========================================================================

		// Record fragments transformation in explode mode for RaaS rendering
		//this.fragTransformConfig = [];

		this.track = function(event) {
			zvp.logger.track(event);
		};

		this.worldToClient = function(point) {
			var p = new THREE.Vector4(point.x, point.y, point.z, 1);
			p.applyMatrix4(this.camera.matrixWorldInverse);
			p.applyMatrix4(this.camera.projectionMatrix);

			// Don't want to mirror values with negative z (behind camera)
			if(p.w > 0) {
				p.x /= p.w;
				p.y /= p.w;
				p.z /= p.w;
			}

			return this.viewportToClient(p.x, p.y);
		};

		this.clientToWorld = function(clientX, clientY, ignoreTransparent) {

			var result = null;
			var model = this.model;
			var modelData = model.getData();

			if(model.is2d()) {

				var collision = this.intersectGround(clientX, clientY);
				if(collision) {
					collision.z = 0;
					var bbox = modelData.bbox;
					if(modelData.hidePaper || bbox.containsPoint(collision)) {
						result = {
							point: collision,
							model: model
						};
					}
				}
			} else {

				// hitTest handles multiple scenes
				result = this.hitTest(clientX, clientY, ignoreTransparent);
				if(result) {
					result.point = result.intersectPoint; // API expects attribute point to have the return value too.
				}
			}

			return result;
		};

		/**
		 *
		 * @param {THREE.Color} color
		 * @param {number} selectionType 
		 */
		this.setSelectionColor = function(color, selectionType) {
			var emissive = new THREE.Color(color);
			emissive.multiplyScalar(0.5);
			this.selectionMaterialBase.color.set(color);
			this.selectionMaterialTop.color.set(color);
			this.selectionMaterialBase.emissive.set(emissive);
			this.selectionMaterialTop.emissive.set(emissive);
			_renderer.setSelectionColor(color);
			_materials.set2dSelectionColor(color);
			this.invalidateHighlight();
			this.invalidate(false, false, true);
		};

		// Update the viewport Id for the first selection in 2d measure
		this.updateViewportId = function(vpId) {
			_materials.updateViewportId(vpId);
			this.invalidate(true);
		};

		/**
		 *  @param   {number} id
		 *  @returns {RenderModel|null}
		 */
		this.findModel = function(modelId) {
			return _modelQueue.findModel(modelId);
		};

		// get/set frame rate for progressive rendering, i.e, how many ticks go by before an update occurs
		/**
		 *  @returns {number}
		 */
		this.getFrameRate = function() {
			return this.frameDisplayRate;
		};

		/**
		 *  @param   {number} rate
		 */
		this.setFrameRate = function(rate) {
			// don't let rate < 1, just in case user sets 0.
			this.frameDisplayRate = (rate < 1) ? 1 : rate;
		};

		/**
		 *  For shadow casting, we assume a single directional light. Shadow light direction is the direction
		 *  that this light comes from, i.e., shadows are casted to the opposite direction.
		 *  This function changes the direction and triggers a shadow update.
		 *
		 *  Note that the directional light source is only assumed for shadow casting. The actual lighting usually comes from
		 *  several directions when using environment lighting, but we need a fixed direction for shadow mapping.
		 *
		 *   @param {THREE.Vector3} lightDir - direction in world space
		 */
		this.setShadowLightDirection = function(lightDir) {
			_shadowLightDir.copy(lightDir);
			invalidateShadowMap();
			this.invalidate(true, false, false);

			// update ground transform to make sure that the ground shape is large enough
			// to make the whole shadow visible.
			updateGroundTransform();
		};

		/**
		 *  The result is either returned as a new vector or written to 'target' (if specified)
		 *  @param [THREE.Vector3} [target]
		 *  @returns {THREE.Vector3} Either target object or new Vector3 instance.
		 */
		this.getShadowLightDirection = function(target) {
			var dir = (target ? target : new THREE.Vector3());
			dir.copy(_shadowLightDir);
			return dir;
		};

		/**
		 * @param {Bool} enable
		 * Note that viewer must be initialized first.
		 */
		this.toggleShadows = function(enable) {
			if(!!_shadowMaps == !!enable) {
				// no change
				return;
			}

			if(enable) {
				_shadowMaps = new zvp.ShadowMaps(_webglrender);
			} else {
				_shadowMaps.cleanup(_materials);
				_shadowMaps = null;
			}

			// Adjust ground plane box if the shadows are getting turned on.
			updateGroundTransform();

			this.invalidate(true, true, false);
		};

		this.showTransparencyWhenMoving = function(enabled) {
			_modelQueue.enableNonResumableFrames = enabled;
		};

		this.fitToView = function(aggregateSelection, immediate) {

			immediate = !!immediate;
			if(aggregateSelection.length === 0) {
				// If the array is empty, assume that we want
				// all models and no selection
				var allModels = _modelQueue.getModels();
				aggregateSelection = allModels.map(function(model) {
					return {
						model: model,
						selection: []
					};
				});
			}

			// Early exit if parameters are not right
			var count2d = 0;
			var count3d = 0;
			for(var i = 0; i < aggregateSelection.length; ++i) {

				var model = aggregateSelection[i].model;
				if(!model)
					return false;

				if(model.is2d()) {
					count2d++;
				} else {
					count3d++;
				}
			}

			// Start processing.
			var processed = false;
			if(count3d === aggregateSelection.length) {
				// Aggregate selection on 3d models.
				processed = this._fitToView3d(aggregateSelection, immediate);
			} else if(count2d === aggregateSelection.length) {
				// Aggregate selection on 2d models.
				processed = this._fitToView2d(aggregateSelection, immediate);
			} else { // 2d/3d Hybrid. not supported atm
				zvp.logger.warn('Hybrid 2d/3d fitToView() not supported.');
				return false;
			}

			if(!processed)
				return false;

			if(_modelQueue.getModels().length === 1) {
				// Single Model (backwards compatibility)
				this.api.dispatchEvent({
					type: zv.FIT_TO_VIEW_EVENT,
					nodeIdArray: aggregateSelection[0].selection,
					immediate: immediate,
					model: aggregateSelection[0].model
				});
			}

			// Dispatches in both single and multi-model context
			this.api.dispatchEvent({
				type: zv.AGGREGATE_FIT_TO_VIEW_EVENT,
				selection: aggregateSelection,
				immediate: immediate
			});

			return true;
		};

		/**
		 * Used internally only by Viewer3DImpl::fitToView()
		 * For now, only support a single 2D model.
		 * @private
		 */
		this._fitToView2d = function(aggregateSelection, immediate) {

			if(aggregateSelection.length > 1) {
				zvp.logger.warn('fitToView() doesn\'t support multiple 2D models. Using the first one...');
			}

			// Selection
			var model = aggregateSelection[0].model;
			var selection = aggregateSelection[0].selection;

			// Helpers
			var bounds = new THREE.Box3();
			var bc = new zvp.BoundsCallback(bounds);

			if(!selection || selection.length === 0) {
				if(this.api.anyLayerHidden()) {

					// Fit only to the visible layers
					var frags = model.getData().fragments;
					var visibleLayerIndices = this.getVisibleLayerIndices();
					for(i = 0; i < frags.length; i++) {
						find2DLayerBounds(model, i, visibleLayerIndices, this.use2dInstancing, bc);
					}

				} else {
					// Fit to the whole page
					bounds = this.getFitBounds(true);
				}
			} else {
				var dbId2fragId = model.getData().fragments.dbId2fragId;

				for(var i = 0; i < selection.length; i++) {
					var fragIds = dbId2fragId[selection[i]];
					// fragId is either a single vertex buffer or an array of vertex buffers
					if(Array.isArray(fragIds)) {
						for(var j = 0; j < fragIds.length; j++) {
							// go through each vertex buffer, looking for the object id
							find2DBounds(model, fragIds[j], selection[i], this.use2dInstancing, bc);
						}
					} else if(typeof fragIds === 'number') {
						// go through the specific vertex buffer, looking for the object id
						find2DBounds(model, fragIds, selection[i], this.use2dInstancing, bc);
					}
				}
			}

			if(!bounds.empty()) {
				this.api.navigation.fitBounds(immediate, bounds);
				return true;
			}

			// Unhandled 2D
			return false;
		};

		/**
		 * Used internally only by Viewer3DImpl::fitToView()
		 * Support multiple 3D models.
		 * @private
		 */
		this._fitToView3d = function(aggregateSelection, immediate) {

			// First, check if there's anything selected.
			var bNodeSelection = false;
			for(var j = 0; j < aggregateSelection.length; ++j) {
				if(aggregateSelection[j].selection.length > 0) {
					bNodeSelection = true;
					break;
				}
			}

			var bounds = new THREE.Box3();
			var box = new THREE.Box3();

			if(!bNodeSelection) {
				// When there is no node selection, then we need to fit to the whole model(s)
				bounds.union(this.getVisibleBounds(false, false));
			} else {

				// Fit to selected elements only
				for(var i = 0; i < aggregateSelection.length; ++i) {

					var selection = aggregateSelection[i].selection;
					if(selection.length === 0)
						continue;

					// Specific nodes
					var model = aggregateSelection[i].model;
					var fragmentMap = model.getFragmentMap();
					var fragList = model.getFragmentList();

					for(var s = 0; s < selection.length; ++s) {
						var dbId = parseInt(selection[s]);
						fragmentMap.enumNodeFragments(dbId, function(fragId) {
							fragList.getWorldBounds(fragId, box);
							bounds.union(box);
						}, true);
					}
				}

			}

			if(!bounds.empty()) {
				this.api.navigation.fitBounds(immediate, bounds);
				return true;
			}

			// Unhandled 3D
			return false;
		};

		/**
		 * Supports Fit-To-View for 2D models
		 * @private
		 */
		function find2DLayerBounds(model, fragId, visibleLayerIds, useInstancing, bc) {
			var mesh = model.getFragmentList().getVizmesh(fragId);
			var vbr = new zvp.VertexBufferReader(mesh.geometry, useInstancing);
			vbr.enumGeomsForVisibleLayer(visibleLayerIds, bc);
		}

		/**
		 * Supports Fit-To-View for 2D models
		 * @private
		 */
		function find2DBounds(model, fragId, dbId, useInstancing, bc) {
			var mesh = model.getFragmentList().getVizmesh(fragId);
			var vbr = new zvp.VertexBufferReader(mesh.geometry, useInstancing);
			vbr.enumGeomsForObject(dbId, bc);
		}

		/**
		 * Set initial visibility state of nodes
		 * This ensures the UI (Model Browser) matches the main display
		 * @private
		 */
		this.handleInitialVisibility = function(model) {
			var viewer = this.api;

			function hideInvisibleNodes(instanceTree) {
				// a node is visible if any of its fragments are
				// the LMVTK propagates visibility downwards, and doesn't allow the
				// visibility to be set for fragments directly, so we can infer the visibility
				// of the geometry node

				var frags = model.getFragmentList();
				if(frags.areAllVisible()) {
					return;
				}

				var map = model.getFragmentMap();
				var invisibleNodes = [];

				instanceTree.enumNodeChildren(model.getRootId(), function(dbId) {
					var visible = map.findNodeFragment(dbId, function(fragId) {
						return frags.isFragVisible(fragId);
					}, true);
					if(!visible) {
						invisibleNodes.push(dbId);
					}
				}, true);

				if(invisibleNodes.length) {
					viewer.hide(invisibleNodes, model);
				}
			}

			model.getObjectTree(hideInvisibleNodes);
		}

	}

	Viewer3DImpl.prototype.constructor = Viewer3DImpl;

	zvp.Viewer3DImpl = Viewer3DImpl;

})();;
/**
 * Class for creating and restoring viewer states.
 *
 * Main interactions come from methods
 * - {@link ZhiUTech.Viewing.Private.ViewerState#getState}
 * - {@link ZhiUTech.Viewing.Private.ViewerState#restoreState}
 * @tutorial viewer_state
 * @param {ZhiUTech.Viewing.Viewer3D} viewer - Viewer instance used to operate on.
 * @constructor
 * @category Core
 */
ZhiUTech.Viewing.Private.ViewerState = function(viewer) {
	var zvp = ZhiUTech.Viewing.Private;

	/**
	 * All-inclusive filter constant used when no filter is provided.
	 * @type {boolean}
	 * @private
	 */
	var FILTER_ALL = true;

	/**
	 * Returns a viewer state Object for the current viewer instance.
	 *
	 * @param {object} [filter] - Object with a structure similar to the output where
	 * values are replaced with Booleans true/false indicating whether they should be stored or not.
	 * @returns {object} Plain object describing the state of the viewer.
	 * @tutorial viewer_state
	 */
	this.getState = function(filter) {

		var nav = viewer.navigation;
		var viewerState = {};

		// Adding level-0 properties
		viewerState["seedURN"] = this.getSeedUrn();

		// Object set, contains selection, isolation and explode value.
		var objectSet = viewerState["objectSet"];
		if(!Array.isArray(objectSet)) {
			viewerState["objectSet"] = objectSet = [];
		}
		// Spec call for these elements to grouped in an Object at an Array's index 0.
		// 3d models attributes
		if(viewer.model && !viewer.model.is2d()) {
			objectSet[0] = {
				id: this.getSelectedNodes(),
				isolated: viewer.getIsolatedNodes(),
				hidden: viewer.getHiddenNodes(),
				explodeScale: viewer.getExplodeScale(),
				idType: 'lmv'
			};
		}
		// 2d models attributes
		if(viewer.model && viewer.model.is2d()) {
			objectSet[0] = {
				id: this.getSelectedNodes(), // Works for 2d and 3d
				isolated: this.getVisibleLayers2d(),
				allLayers: this.areAllLayersVisible(),
				hidden: [], // There's no hide feature for 2d.
				idType: 'lmv'
			};
		}

		// Viewport
		var viewport = viewerState["viewport"];
		if(!viewport) {
			viewport = viewerState["viewport"] = {};
		}

		var bPerspectiveCam = nzv.getCamera().isPerspective;
		viewport["name"] = ""; // TODO: Populate accordingly; Requested by the mobile team.
		viewport["eye"] = nzv.getPosition().toArray();
		viewport["target"] = nzv.getTarget().toArray();
		viewport["up"] = nzv.getCamera().up.toArray();
		viewport["worldUpVector"] = nzv.getWorldUpVector().toArray();
		viewport["pivotPoint"] = nzv.getPivotPoint().toArray();
		viewport["distanceToOrbit"] = nzv.getPivotPlaneDistance();
		viewport["aspectRatio"] = this.getAspectRatio();
		viewport["projection"] = bPerspectiveCam ? "perspective" : "orthographic";
		viewport["isOrthographic"] = !bPerspectiveCam;
		if(bPerspectiveCam) {
			viewport["fieldOfView"] = nzv.getVerticalFov();
		} else {
			viewport["orthographicHeight"] = this.getOrthographicHeight();
		}

		// Render Options
		var renderOptions = viewerState["renderOptions"];
		if(!renderOptions) {
			renderOptions = viewerState["renderOptions"] = {};
		}
		renderOptions["environment"] = zvp.LightPresets[viewer.impl.currentLightPreset()].name;
		renderOptions["ambientOcclusion"] = {
			enabled: viewer.impl.renderer().getAOEnabled(),
			radius: viewer.impl.renderer().getAORadius(),
			intensity: viewer.impl.renderer().getAOIntensity()
		};
		renderOptions["toneMap"] = {
			method: viewer.impl.renderer().getToneMapMethod(),
			exposure: viewer.impl.renderer().getExposureBias(),
			lightMultiplier: this.getToneMapIntensity()
		};
		renderOptions["appearance"] = {
			ghostHidden: viewer.impl.showGhosting,
			ambientShadow: viewer.prefs.ambientShadows,
			antiAliasing: viewer.impl.renderer().settings.antialias,
			progressiveDisplay: viewer.prefs.progressiveRendering,
			swapBlackAndWhite: viewer.prefs.swapBlackAndWhite,
			displayLines: viewer.prefs.lineRendering,
			displayPoints: viewer.prefs.pointRendering
		};

		// Cutplanes (aka: Sectioning) are a 3d-only feature.
		if(viewer.model && !viewer.model.is2d()) {
			var cutplanes = viewerState["cutplanes"] = [];
			var planes = viewer.getCutPlanes();
			for(var i = 0; i < planes.length; i++) {
				cutplanes.push(planes[i].toArray());
			}
		}

		// Allow extensions to inject their state data
		for(var extensionName in viewer.loadedExtensions) {
			var extension = viewer.loadedExtensions[extensionName];
			extension.getState && extension.getState(viewerState);
		}

		// Filter out values the user doesn't want to consume before returning.
		if(filter && filter !== FILTER_ALL) {
			this.applyFilter(viewerState, filter);
		}
		return viewerState;
	};

	/**
	 * Restores the associated viewer instance with the provided viewerState object.
	 *
	 * @param {object} viewerState
	 * @param {object} [filter] - Similar in structure to viewerState used to filter out values
	 * that should not be restored.
	 * @param {boolean} [immediate] - Whether the state should be apply with (false)
	 * or without (true) a smooth transition.
	 * @returns {boolean} True if the operation was successful.
	 * @tutorial viewer_state
	 */
	this.restoreState = function(viewerState, filter, immediate) {

		if(!viewerState) {
			zvp.logger.warn("restoreState has no viewer state to restore from.");
			return false;
		}

		if(!viewer || !viewer.model) {
			zvp.logger.warn("restoreState has no viewer or model to restore.");
			return false;
		}

		if(filter && filter !== FILTER_ALL) {
			// To avoid modifying viewerState passed in, we create a clone of it
			viewerState = JSON.parse(JSON.stringify(viewerState));
			this.applyFilter(viewerState, filter);
		}

		var nav = viewer.navigation;
		var isModel2d = viewer.model.is2d();
		var isModel3d = !isModel2d;

		// Objectset
		if(Array.isArray(viewerState.objectSet) && viewerState.objectSet.length > 0) {
			var objectSet = viewerState.objectSet[0];

			// Selection (2d and 3d)
			var selectionIds = objectSet.id;
			if(selectionIds) {
				selectionIds = this.toIntArray(selectionIds);
				viewer.select(selectionIds);
			}

			// Isolation / Hidden depends on whether it is 2d or 3d
			if(isModel2d) {

				// 2d Isolation is Layer visibility
				var visibleLayers = objectSet.isolated;
				if(Array.isArray(visibleLayers) && visibleLayers.length > 0) {
					// Only certain layers are visible
					viewer.setLayerVisible(null, false); // start by hiding all
					viewer.impl.setLayerVisible(visibleLayers, true);
				} else {
					// All layers are visible
					viewer.setLayerVisible(null, true);
				}
			} else {
				// 3d Isolation
				var isolatedIds = objectSet.isolated || [];
				isolatedIds = this.toIntArray(isolatedIds);
				viewer.isolate(isolatedIds);

				// 3d Hidden nodes (only when there's no isolation) (3d only)
				if(isolatedIds.length === 0) {
					var hiddenIds = objectSet.hidden || null;
					if(hiddenIds && hiddenIds.length > 0) {
						hiddenIds = this.toIntArray(hiddenIds);
						viewer.hide(hiddenIds);
					}
				}
			}

			// Explode scale (3d)
			if("explodeScale" in objectSet) {
				var explodeScale = parseFloat(objectSet.explodeScale);
				if(viewer.explode) {
					viewer.explode(explodeScale);
				}
			}
		}

		var viewport = viewerState.viewport;
		if(viewport) {

			var eye = this.getVector3FromArray(viewport.eye, nzv.getPosition());
			var up = this.getVector3FromArray(viewport.up, nzv.getCamera().up);
			var target = this.getVector3FromArray(viewport.target, nzv.getTarget());
			var fov = ("fieldOfView" in viewport) ? parseFloat(viewport.fieldOfView) : nzv.getVerticalFov();
			var worldUp = this.getVector3FromArray(viewport.worldUpVector, null);
			if(!worldUp) {
				var upVectorArray = viewer.model ? viewer.model.getUpVector() : null;
				if(upVectorArray) {
					worldUp = new THREE.Vector3().fromArray(upVectorArray);
				} else {
					worldUp = new THREE.Vector3(0, 1, 0); // TODO: Can we do better? Is it worth it?
				}
			}
			var pivot = this.getVector3FromArray(viewport.pivotPoint, nzv.getPivotPoint());

			// Retain current values if not available in restore object
			var isPerspective = nzv.getCamera().isPerspective;
			if('isOrthographic' in viewport) {
				isPerspective = !viewport.isOrthographic;
			}
			var orthoScale = this.getOrthographicHeight();
			if('orthographicHeight' in viewport) {
				orthoScale = Number(viewport.orthographicHeight);
			}

			var camera = {
				position: eye,
				target: target,
				up: up,
				worldup: worldUp,
				aspect: viewer.impl.camera.aspect,
				fov: fov,
				orthoScale: orthoScale,
				isPerspective: isPerspective,
				pivot: pivot
			};

			this.restoreCameraState(camera, immediate);
		}

		// Render option state
		var renderOptions = viewerState.renderOptions;
		if(renderOptions) {

			// current values
			var renderer = viewer.impl.renderer();
			var prefs = viewer.prefs;
			var saoEnabled = prefs.ambientShadows;
			var antiAliasing = prefs.antialiasing;

			var sao = renderOptions.ambientOcclusion;
			if(sao) {
				if("enabled" in sao) {
					saoEnabled = sao.enabled;
				}
				var saoRadius = ("radius" in sao) ? sao.radius : null;
				var saoIntensity = ("intensity" in sao) ? sao.intensity : null;
				if(saoRadius !== null && saoIntensity !== null) {
					if(saoRadius !== renderer.getAORadius() ||
						saoIntensity !== renderer.getAOIntensity()) {
						renderer.setAOOptions(saoRadius, saoIntensity);
						renderer.composeFinalFrame();
					}
				}
			}

			if("environment" in renderOptions) {
				var lightPresetIndex = this.getLightPresetIndex(renderOptions.environment);
				if(lightPresetIndex !== -1 && lightPresetIndex !== prefs.get('lightPreset') && isModel3d) {
					viewer.setLightPreset(lightPresetIndex);
				}
			}

			// ToneMap values are overrides to the environment settings.
			var toneMap = renderOptions.toneMap;
			if(toneMap) {
				var invalidate = false;
				var exposure = "exposure" in toneMap ? toneMap.exposure : null;
				var toneMapIntensity = "lightMultiplier" in toneMap ? toneMap.lightMultiplier : null;

				if(exposure !== null && exposure !== renderer.getExposureBias()) {
					renderer.setTonemapExposureBias(exposure);
					invalidate = true;
				}

				if(toneMapIntensity !== null && viewer.impl.dir_light1 && toneMapIntensity !== this.getToneMapIntensity()) {
					viewer.impl.dir_light1.intensity = Math.pow(2.0, toneMapIntensity);
					invalidate = true;
				}

				if(invalidate) {
					viewer.impl.invalidate(true);
				}
			}

			var appearance = renderOptions.appearance;
			if(appearance) {
				if("antiAliasing" in appearance) {
					antiAliasing = appearance.antiAliasing;
				}
				if("progressiveDisplay" in appearance && appearance.progressiveDisplay !== prefs.get('progressiveRendering')) {
					viewer.setProgressiveRendering(appearance.progressiveDisplay);
				}
				if("swapBlackAndWhite" in appearance && appearance.swapBlackAndWhite !== prefs.get('swapBlackAndWhite')) {
					viewer.setSwapBlackAndWhite(appearance.swapBlackAndWhite);
				}
				if(("ghostHidden" in appearance) && appearance.ghostHidden !== prefs.get('ghosting')) {
					isModel3d && viewer.setGhosting(appearance.ghostHidden);
				}
				if("displayLines" in appearance && appearance.displayLines !== prefs.get('lineRendering')) {
					viewer.hideLines(!appearance.displayLines);
				}
				if("displayPoints" in appearance && appearance.displayPoints !== prefs.get('pointRendering')) {
					viewer.hidePoints(!appearance.displayPoints);
				}
			}

			// SAO and AA at the end.
			if(isModel3d && saoEnabled !== prefs.ambientShadows && antiAliasing !== prefs.antialiasing) {
				viewer.setQualityLevel(saoEnabled, antiAliasing);
			}
		}

		// Restore cutplanes (aka: Sectioning) data only for 3d models.
		if(Array.isArray(viewerState.cutplanes) && viewer.model && isModel3d) {
			var cutplanes = [];
			for(var i = 0; i < viewerState.cutplanes.length; i++) {
				var plane = viewerState.cutplanes[i];
				if(Array.isArray(plane) && plane.length >= 4) {
					cutplanes.push(new THREE.Vector4(plane[0], plane[1], plane[2], plane[3]));
				}
			}
			viewer.setCutPlanes(cutplanes);
		}

		// Allow extensions to restore their data
		for(var extensionName in viewer.loadedExtensions) {
			var extension = viewer.loadedExtensions[extensionName];
			extension.restoreState && extension.restoreState(viewerState, immediate);
		}

		return true;
	};

	/**
	 * Restores camera states values back into the viewer.
	 * We avoid using methods such as setViewFromCamera() because those make some
	 * assumptions about the current state of the viewer. We need no such things.
	 *
	 * Note: Implementation based on Viewer3DImpl.setViewFromCamera()
	 *
	 * @param {object} camera
	 * @param {boolean} immediate
	 * @private
	 */
	this.restoreCameraState = function(camera, immediate) {

		viewer.impl.adjustOrthoCamera(camera);
		var navapi = viewer.navigation;

		if(!immediate) {
			// With animation
			viewer.impl.camera.isPerspective = camera.isPerspective;
			navapi.setRequestTransitionWithUp(true, camera.position, camera.target, camera.fov, camera.up, camera.worldup, camera.pivot);
		} else {
			// Instantaneous, no animation
			if(camera.isPerspective) {
				navapi.toPerspective();
			} else {
				navapi.toOrthographic();
			}
			navapi.setCameraUpVector(camera.up);
			navapi.setWorldUpVector(camera.worldup);
			navapi.setView(camera.position, camera.target);
			navapi.setPivotPoint(camera.pivot);
			navapi.setVerticalFov(camera.fov, false);

			viewer.impl.syncCamera(true);
		}
	};

	/**
	 * Return true if two viewer states are equal, it's possible to compare only a subset of the objects providing a filter
	 * as parameter.

	 * @param {object} viewerStateA
	 * @param {object} viewerStateB
	 * @param {object} [filter] - Similar in structure to viewerState used to filter out values to check.
	 * @returns {boolean} True if the states are equal.
	 * @tutorial viewer_state
	 */
	this.areEqual = function(viewerStateA, viewerStateB, filter) {

		function areArraysEqual(arrayA, arrayB) {

			arrayA = arrayA || [];
			arrayB = arrayB || [];

			if(arrayA.length !== arrayB.length) {
				return false;
			}

			for(var i = 0; i < arrayA.length; ++i) {
				if(arrayA[i] !== arrayB[i]) {
					return false;
				}
			}

			return true;
		}

		function areVectorsEqual(vectorA, vectorB, epsilon) {

			vectorA = vectorA || [];
			vectorB = vectorB || [];

			if(vectorA.length !== vectorB.length) {
				return false;
			}

			if(vectorA.length === 0) {
				return false;
			}

			return(
				areNumbersEqual(vectorA[0], vectorB[0], epsilon) ||
				areNumbersEqual(vectorA[1], vectorB[1], epsilon) ||
				areNumbersEqual(vectorA[2], vectorB[2], epsilon));

		}

		function areNumbersEqual(numberA, numberB, epsilon) {

			var parcedA = numberA ? parseFloat(numberA) : null;
			var parcedB = numberA ? parseFloat(numberB) : null;

			var typeOfA = typeof(parcedA);
			var typeOfB = typeof(parcedB);

			if(typeOfA === 'number' && typeOfB === 'number') {
				return(Math.abs(numberA - numberB) < epsilon);
			}

			numberA = numberA ? numberA : null;
			numberB = numberB ? numberB : null;

			return numberA === numberB;
		}

		var stateA = viewerStateA;
		var stateB = viewerStateB;
		var epsilon = 0.000000001;

		if(filter && filter !== true) {
			stateA = this.applyFilter(stateA, filter);
			stateB = this.applyFilter(stateB, filter);
		}

		if(stateA["seedURN"] !== stateB["seedURN"]) {
			return false;
		}

		// Check object set (only check first element, the one written by ViewerState).
		var objectSetA = stateA["objectSet"] || [];
		var objectSetB = stateB["objectSet"] || [];

		if(objectSetA.length !== objectSetB.length) {
			return false;
		}

		var objectA = objectSetA[0] || {};
		var objectB = objectSetB[0] || {};

		if(
			objectA.idType !== objectB.idType ||
			!areNumbersEqual(objectA.explodeScale, objectB.explodeScale, epsilon) ||
			!areArraysEqual(objectA.id, objectB.id) ||
			!areArraysEqual(objectA.isolated, objectB.isolated) ||
			!areArraysEqual(objectA.hidden, objectB.hidden)) {
			return false;
		}

		// Check Viewport.
		var viewportA = stateA["viewport"] || {};
		var viewportB = stateB["viewport"] || {};

		if(viewportA["name"] !== viewportB["name"] ||
			viewportA["projection"] !== viewportB["projection"] ||
			viewportA["isOrthographic"] !== viewportB["isOrthographic"] ||
			!areNumbersEqual(viewportA["distanceToOrbit"], viewportB["distanceToOrbit"], epsilon) ||
			// !areNumbersEqual(viewportA["aspectRatio"], viewportB["aspectRatio"], epsilon) ||
			!areNumbersEqual(viewportA["fieldOfView"], viewportB["fieldOfView"], epsilon) ||
			!areNumbersEqual(viewportA["orthographicHeight"], viewportB["orthographicHeight"], epsilon) ||
			!areVectorsEqual(viewportA["eye"], viewportB["eye"], epsilon) ||
			!areVectorsEqual(viewportA["target"], viewportB["target"], epsilon) ||
			!areVectorsEqual(viewportA["up"], viewportB["up"], epsilon) ||
			!areVectorsEqual(viewportA["worldUpVector"], viewportB["worldUpVector"], epsilon) ||
			!areVectorsEqual(viewportA["pivotPoint"], viewportB["pivotPoint"], epsilon)) {
			return false;
		}

		// Skip render options, cut planes and extension data.
		return true;
	};

	/**
	 * Helper method with the intent to change the type of an array with ids from String to ints.
	 * We need this method because we need to make sure that ids that get fed into the ViewerState
	 * are in the correct type.
	 *
	 * @param {Array} array - For example, `["45", "33", "1"]`.
	 * @returns {Array} For example, `[45, 33, 1]`.
	 * @private
	 */
	this.toIntArray = function(array) {
		var ret = [];
		if(Array.isArray(array)) {
			for(var i = 0, len = array.length; i < len; ++i) {
				ret.push(parseInt(array[i]));
			}
		}
		return ret;
	};

	/**
	 * Helper function that given a viewer state, extracts the selected nodes.
	 *
	 * @param {object} viewerState - For example, the result of this.getState().
	 * @returns {array} Array containing Number-typed ids of the selected nodes. Empty array when no 'selected'
	 *                 objectSet value is defined.
	 * @private
	 * @deprecated
	 */
	this.extractSelectedNodeIds = function(viewerState) {

		if(viewerState && Array.isArray(viewerState.objectSet) && viewerState.objectSet.length > 0) {
			var objectSet = viewerState.objectSet[0];
			return this.toIntArray(objectSet.id);
		}
		return [];
	};

	/**
	 * Helper function that given a viewer state, extracts the isolated nodes.
	 *
	 * @param {object} viewerState - For example, the result of this.getState().
	 * @return {array} Array containing Number-typed ids of the isolated nodes. Empty array when no 'isolated'
	 * objectSet value is defined.
	 * @private
	 * @deprecated
	 */
	this.extractIsolatedNodeIds = function(viewerState) {

		if(viewerState && Array.isArray(viewerState.objectSet) && viewerState.objectSet.length > 0) {
			var objectSet = viewerState.objectSet[0];
			return this.toIntArray(objectSet.isolated);
		}
		return [];
	};

	/**
	 * Helper method that constructs a Vector3 from a given Array.
	 * If Array is not well-formed, then the failValue is return instead.
	 *
	 * @param {array} array - An array with 3 values.
	 * @param {THREE.Vector3} failValue - If array param is invalid, failValue will be returned instead.
	 * @returns {THREE.Vector3} Either a new Vector with values coming from 'array' or failValue.
	 * @private
	 */
	this.getVector3FromArray = function(array, failValue) {

		if(array instanceof Array && array.length > 2) {

			// Some array values are exported as string-of-numbers. Fix that here.
			array[0] = parseFloat(array[0]);
			array[1] = parseFloat(array[1]);
			array[2] = parseFloat(array[2]);
			return new THREE.Vector3().fromArray(array);
		}
		return failValue;
	};

	/**
	 * Helper function that returns selected node ids in an array.
	 * @returns {array}
	 * @private
	 */
	this.getSelectedNodes = function() {

		return viewer.impl && viewer.impl.selector ? viewer.impl.selector.getSelection() : [];

	};

	/**
	 * Helper function that returns the index values of the isolated (visible) layers.
	 * Applies only to 2d models/blueprints
	 * @private
	 */
	this.getVisibleLayers2d = function() {
		var ret = [];
		var materialManager = viewer.impl.matman();
		var layersMap = materialManager._layersMap; // TODO: don't access internal members of matman
		for(var layerIndex in layersMap) {
			if(layersMap.hasOwnProperty(layerIndex)) {
				if(materialManager.isLayerVisible(layerIndex)) {
					ret.push(layerIndex);
				}
			}
		}
		return ret;
	};

	/**
	 * Helper function that returns true if all layers are visible.
	 * Applies only to 2d models/blueprints
	 * @private
	 */
	this.areAllLayersVisible = function() {
		var materialManager = viewer.impl.matman();
		var layersMap = materialManager._layersMap; // TODO: don't access internal members of matman
		for(var layerIndex in layersMap) {
			if(layersMap.hasOwnProperty(layerIndex)) {
				if(!materialManager.isLayerVisible(layerIndex)) {
					return false;
				}
			}
		}
		return true;
	};

	/**
	 * Gets the aspect ratio.
	 * @returns {number} Aspect ratio.
	 * @private
	 */
	this.getAspectRatio = function() {
		var viewport = viewer.navigation.getScreenViewport();
		var aspect = viewport.width / viewport.height;
		return aspect;
	};

	/**
	 * Returns world height when in orthographic camera mode.
	 * @returns {number} Orthographic height.
	 * @private
	 */
	this.getOrthographicHeight = function() {
		var cam = viewer.navigation.getCamera();
		if(cam.isPerspective) return 0;
		return Math.abs(2 * cam.orthographicCamera.top);
	};

	/**
	 * Returns the URN of the document model.
	 * @returns {string} Model URN.
	 */
	this.getSeedUrn = function() {
		if(viewer.model && viewer.model.loader) {
			return viewer.model.loader.esdUrn || "";
		}
		return "";
	};

	/**
	 * Returns the slider value for the viewer's current light intensity.
	 * @returns {number}
	 * @private
	 */
	this.getToneMapIntensity = function() {

		// Original code from RenderOptionsPanel.js
		// Should probably live elsewhere in the api.
		var intensity = 0.0;
		if(viewer.impl.dir_light1) {
			if(viewer.impl.dir_light1.intensity != 0)
				intensity = Math.log(viewer.impl.dir_light1.intensity) / Math.log(2.0);
			else
				intensity = -1e-20;
		}
		return intensity;
	};

	/**
	 * Returns the index of the LightPreset with a matching name value.
	 * @param environmentName
	 * @returns {number} Index of LightPreset, or -1 if not found.
	 * @private
	 */
	this.getLightPresetIndex = function(environmentName) {

		for(var i = 0; i < zvp.LightPresets.length; i++) {
			if(zvp.LightPresets[i].name === environmentName) {
				return i;
			}
		}
		return -1;
	};

	/**
	 * Filters out key/value pairs from the viewerState.
	 *
	 * To get all of the values available use FILTER_ALL. If no filter is provided FILTER_ALL will be used.
	 * It is encourage for consumers to define their specialized filters.
	 *
	 * @param {object} viewerState - Object to be filtered.
	 * @param {object} filter - Object with a similar structure to viewerState, where values are Booleans signaling which
	 * elements should be included (true) and which ones should not (false).
	 * If a viewerState key is not found in the filter, we assume that it is non-wanted.
	 * @private
	 */
	this.applyFilter = function(viewerState, filter) {

		// Check the 'ALL' filter
		if(filter === true) return;

		// Filtering only 1 level depth keys
		// Additional levels are checked recursively.
		for(var key in viewerState) {

			if(!viewerState.hasOwnProperty(key)) {
				continue;
			}

			// Try to find the key in the filter object
			var filterValue = filter[key];

			if(filterValue === undefined) {

				// key not enabled in filter, remove key/value pair from viewerState.
				delete viewerState[key];
				zvp.logger.log("[applyFilter] C - skipping key [" + key + "] from viewerState; unspecified in filter.");
			} else if(typeof(filterValue) === 'boolean') {

				if(filterValue === false) {
					// key explicitly flagged for removal, remove key/value pair from viewerState.
					delete viewerState[key];
					zvp.logger.log("[applyFilter] D - skipping key [" + key + "] from viewerState; explicit filtering.");
				}
			} else if(filterValue instanceof Object) {

				if(viewerState[key] instanceof Object) {
					// Both are Objects, recursive call on them.
					this.applyFilter(viewerState[key], filter[key]);
				} else {
					// This case signals a miss-match between filter and value.
					// Since it's an undefined case, we'll be inclusive for the time being.
					// *** Keep the value in viewerState ***
					zvp.logger.warn("[applyFilter] A - Invalid filter Object for key [" + key + "]");
				}
			} else {

				// Note: Every other value for filter is invalid.
				// For now, we'll keep the key/value in viewerState.
				zvp.logger.warn("[applyFilter] B - Invalid filter value for key [" + key + "]");
			}

		}
	};

};

ZhiUTech.Viewing.Private.ViewerState.prototype.constructor = ZhiUTech.Viewing.Private.ViewerState;;
