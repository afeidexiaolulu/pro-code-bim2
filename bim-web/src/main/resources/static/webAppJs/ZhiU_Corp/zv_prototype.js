
// Viewer3D offers public methods for developers to use.
// Viewer3DImpl is the implementation file for Viewer3D and is only used by Viewer3D.js
// 
// Viewer3D does things like parameter validation.
// Viewer3DImpl does the actual work, by interfacing with other internal components, such as the MaterialManager.

(function() {

	"use strict";

	var zv = ZhiUTech.Viewing,
		zvp = zv.Private;

	/**
	 * Navigation mode constants.
	 *
	 * These constants are used to define the Navigation mode.
	 *
	 * @enum {number}
	 * @readonly
	 * @deprecated
	 */
	zv.NAVIGATION_MODE = {
		ORBIT: 0,
		PAN: 1,
		DOLLY: 2,
		ROLL: 3,
		FOV: 4,
		TOUCH_PAN_DOLLY: 5,
		TOUCH_ROLL: 6,
		OTHER: 7
	};

	var isMobile = zv.isMobileDevice();

	var nextViewerId = 0;

	zv.DefaultSettings = {
		"ambientShadows": false,
		"antialiasing": !isMobile,
		"groundShadow": false,
		"groundReflection": false,
		"progressiveRendering": true,
		"renderCache": false,
		"swapBlackAndWhite": false,
		"openPropertiesOnSelect": false,
		"ghosting": true,
		"viewCube": true,
		"lineRendering": false,
		"pointRendering": false,
		"edgeRendering": false,
		"lightPreset": zvp.DefaultLightPreset,
		"backgroundColorPreset": null,
		"reverseMouseZoomDir": true,
		"reverseHorizontalLookDirection": false,
		"reverseVerticalLookDirection": false,
		"alwaysUsePivot": false,
		"zoomTowardsPivot": false,
		"orbitPastWorldPoles": true,
		"leftHandedMouseSetup": false,
		"clickToSetCOI": false,
		"optimizeNavigation": isMobile,
		"fusionOrbit": true,
		"fusionOrbitConstrained": true,
		"envMapBackground": false,
		"useFirstPersonPrototype": false,
		"firstPersonToolPopup": false,
		"bimWalkToolPopup": false
//		"ambientShadows": true,
//		"antialiasing": !isMobile,
//		"groundShadow": true,
//		"groundReflection": false,
//		"progressiveRendering": true,
//		"renderCache": false,
//		"swapBlackAndWhite": false,
//		"openPropertiesOnSelect": false,
//		"ghosting": true,
//		"viewCube": !isMobile,
//		"lineRendering": true,
//		"pointRendering": true,
//		"edgeRendering": false,
//		"lightPreset": zvp.DefaultLightPreset,
//		"backgroundColorPreset": null,
//		"reverseMouseZoomDir": false,
//		"reverseHorizontalLookDirection": false,
//		"reverseVerticalLookDirection": false,
//		"alwaysUsePivot": false,
//		"zoomTowardsPivot": false,
//		"orbitPastWorldPoles": true,
//		"leftHandedMouseSetup": false,
//		"clickToSetCOI": false,
//		"optimizeNavigation": isMobile,
//		"fusionOrbit": true,
//		"fusionOrbitConstrained": true,
//		"envMapBackground": false,
//		"useFirstPersonPrototype": false,
//		"firstPersonToolPopup": true,
//		"bimWalkToolPopup": true
	};

	zvp.isRightClick = function(event, navigation) {
		if(!(event instanceof MouseEvent))
			return false;

		var button = event.button;

		// Check for Firefox spoof: Control+LMB converted to RMB.
		// The "buttons" property in Firefox will include 1 for LMB and 2 for RMB.
		if("buttons" in event) {
			// For button down the 1 bit will be on indicating LMB.
			// For button up it's off so check the flag to see if we
			// switched the down event.
			if(zvp.__firefoxLMBfix && !(event.buttons & 1)) { // Button up?
				zvp.__firefoxLMBfix = false;
				button = 0;
				// zvp.logger.log("FIREFOX UP!!!");
			} else if((button === 2) && (event.buttons & 1)) {
				button = 0; // Convert back to reality.
				zvp.__firefoxLMBfix = true;
				// zvp.logger.log("FIREFOX SUX!!!");
			}
		}

		var useLeftHandedInput = navigation ? navigation.getUseLeftHandedInput() : false;
		var rightButton = useLeftHandedInput ? 0 : 2;

		return button === rightButton;
	};

	/**
	 * Base class for all viewer implementations.
	 *
	 * It contains everything that is needed to connect to the ZhiUTech viewing service and display 3D models.
	 * It also includes basic navigation support, and context menu and extension APIs.
	 * @constructor
	 * @param {HTMLElement} container - The viewer container.
	 * @param {object} config - The initial settings object.
	 * @param {boolean} [config.startOnInitialize=true] - Set this to false if you want to defer the run to a later time
	 * by calling run() explicitly.
	 * @param {string} [config.theme='dark-theme'] - Set this to 'light-theme' if you want to use the light ui theme. Themes can
	 * be changed during execution by calling setTheme() and passing the theme's name.
	 * @property {ZhiUTech.Viewing.Navigation} navigation - The navigation api object.
	 * @property {ZhiUTech.Viewing.ToolController} toolController - The tool controller object.
	 * @property {ZhiUTech.Viewing.ViewingUtilities} utilities - The viewing utilities object.
	 * @alias ZhiUTech.Viewing.Viewer3D
	 * @category Core
	 */
	var Viewer3D = function(container, config) {
		if(typeof THREE === 'undefined') {
			zvp.logger.warn('Initializing LMV without the THREE.js dependency is not supported.',
				'Call ZhiUTech.Viewing.Initializer() first or preload the dependencies manually.');
		}

		if(container) {
			this.clientContainer = container;
			this.container = document.createElement("div");
			this.container.classList.add("zu-viewing-viewer");
			this.container.style.height = "100%";
			this.container.style.width = "100%";
			this.container.style.overflow = "hidden";

			this.container.classList.add(zv.isTouchDevice() ? "touch" : "notouch");

			this.clientContainer.appendChild(this.container);

			this.config = config || zv.createViewerConfig();
			this.contextMenu = null;
			this.contextMenuCallbacks = {};
			this.__firefoxLMBfix = false;
			this.started = false;

			// Set the UI theme.
			this.theme = this.config.theme || 'dark-theme';
			this.container.classList.add(this.theme);

			if(zv.isChrome()) {
				this.container.classList.add('quality-text');
			}

			// Create the canvas if it doesn't already exist
			if(this.container.nodeName === "CANVAS") {
				throw 'Viewer must be initialized on a div [temporary]';
			} else {
				this.canvasWrap = document.createElement("div");
				this.canvasWrap.classList.add("canvas-wrap");

				this.canvas = document.createElement("canvas");
				this.canvas.tabIndex = 0;
				this.canvas.setAttribute('data-viewer-canvas', 'true');

				this.canvasWrap.appendChild(this.canvas);
				this.container.appendChild(this.canvasWrap);
			}

			this.canvas.viewer = this; //store a pointer to the viewer in the canvas

			var prefOptions = {
				// Preferences. Prefix is a bit odd, but a legacy result after refactoring.
				prefix: 'ZhiUTech.Viewing.Private.GuiViewer3D.SavedSettings.',
				localStorage: true
			};
			this.prefs = new zvp.Preferences(this, prefOptions);

		}

		this.extensionCache = null; // Reference passed from ViewingApplication
		this.running = false;
		this._pushedTool = '';
		this._defaultNavigationTool = '';
		this.id = nextViewerId++;
		this.impl = new zvp.Viewer3DImpl(this.canvas, this);
		this.onResetEvent = this.onResetEvent.bind(this);
		//ADP
		this.trackADPTimer = [];
	};

	Viewer3D.populateConfigOptions = function( /*config*/ ) {};

	Viewer3D.prototype.constructor = Viewer3D;

	zv.EventDispatcher.prototype.apply(Viewer3D.prototype);
	zv.ScreenModeMixin.prototype.apply(Viewer3D.prototype);
	zv.ExtensionMixin.prototype.apply(Viewer3D.prototype);

	/**
	 * @deprecated
	 * Use {@link ZhiUTech.Viewing.ScreenMode} instead.
	 */
	Viewer3D.ScreenMode = zv.ScreenMode;

	/**
	 * Need to keep track of viewers in document so we know when it is safe
	 * to call WGS.clearPropertyWorkerCache()
	 */
	Viewer3D.ViewerCount = 0;

	/**
	 * Default (and supported) values for how the viewer canvas will respond to click interaction.
	 * If also provides a location to disable certain canvas features, such as:
	 * "disableSpinner", "disableMouseWheel" and "disableTwoFingerSwipe".
	 *
	 * Refer to setCanvasClickBehavior() for additional info.
	 */
	Viewer3D.kDefaultCanvasConfig = {
		"click": {
			"onObject": ["selectOnly"],
			"offObject": ["deselectAll"]
		},
		"clickAlt": {
			"onObject": ["setCOI"],
			"offObject": ["setCOI"]
		},
		"clickCtrl": {
			"onObject": ["selectToggle"]
			// don't deselect if user has control key down https://jira.zhiutech.com/browse/LMV-1852
			//"offObject": ["deselectAll"]
		},
		"clickShift": {
			"onObject": ["selectToggle"]
			// don't deselect if user has shift key down https://jira.zhiutech.com/browse/LMV-1852
			//"offObject": ["deselectAll"]
		},

		// Features that support disabling
		"disableSpinner": false,
		"disableMouseWheel": false,
		"disableTwoFingerSwipe": false
	};

	/**
	 * Initializes the viewer and loads any extensions specified in the constructor's
	 * config parameter. If the optional parameters are specified, the start() function will
	 * use an optimized initialization sequence that results in faster model load.
	 * The parameters are the same as the ones for Viewer3D.loadModel and you do not need to call loadModel
	 * subsequently if the model is loaded via the call to start().
	 *
	 * @param {string} [url] - Optional URN or filepath to load on start.
	 * @param {string} [options] - Optional path to shared property database.
	 * @param {function} [onSuccessCallback] - Method that gets called when initial loading is done
	 * and streaming starts.
	 * @param {function} [onErrorCallback] - Method that gets called when initial loading ends with an error.
	 * @returns {number} 0 if the viewer has started, an error code (same as that returned by initialize()) otherwise.
	 */
	Viewer3D.prototype.start = function(url, options, onSuccessCallback, onErrorCallback) {
		if(this.started) {
			return 0;
		}
		this.started = true;

		var viewer = this;

		// Initialize the renderer and related stuff
		var result = viewer.initialize();
		if(result !== 0) {
			if(onErrorCallback) {
				setTimeout(function() {
					onErrorCallback(result);
				}, 1);
			}
			return result;
		}

		//load extensions and set navigation overrides, etc.
		//Delayed so that it runs a frame after the long initialize() call.
		setTimeout(function() {
			viewer.setUp(viewer.config);
		}, 1);

		//If a model URL was given, kick off loading first, then initialize, otherwise just continue
		//with initialization immediately.
		if(url)
			this.loadModel(url, options, onSuccessCallback, onErrorCallback);

		return 0;
	};

	/**
	 * Initializes the viewer and loads any extensions specified in the constructor's
	 * config parameter. If the optional parameters are specified, the start() function will
	 * use an optimized initialization sequence that results in faster model load.
	 * The parameters are the same as the ones for Viewer3D.loadModel and you do not need to call loadModel
	 * subsequently if the model is loaded via the call to start().
	 * 
	 * @param {Document} [document] - The Document instance holding the current derivative manifest
	 * @param {BubbleNode} [manifestNode] - The manifest node to load model for.
	 * @param {Object} [options] - Extra initialization options to override the defaults. Normally not needed.
	 * @returns {Promise} - Resolves on success, rejects on any kind of initialization failure.
	 */
	Viewer3D.prototype.startWithDocumentNode = function(avDocument, manifestNode, options) {

		var viewer = this;

		return new Promise(function(resolve, reject) {

			if(viewer.started) {
				return 0;
			}
			viewer.started = true;

			// Initialize the renderer and related stuff
			var result = viewer.initialize();
			if(result !== 0) {
				setTimeout(function() {
					reject(result);
				}, 1);
				return;
			}

			//load extensions and set navigation overrides, etc.
			//Delayed so that it runs a frame after the long initialize() call.
			setTimeout(function() {
				viewer.setUp(viewer.config);
			}, 1);

			//If a model URL was given, kick off loading first, then initialize, otherwise just continue
			//with initialization immediately.
			var prom = viewer.loadDocumentNode(avDocument, manifestNode, options);
			prom.then(resolve).catch(reject);
		});
	};

	Viewer3D.prototype.registerUniversalHotkeys = function() {
		var self = this;

		var onPress;
		var onRelease;
		var previousTool;
		var keys = zv.theHotkeyManager.KEYCODES;

		/*
		// useful for debugging, when you want to force a redraw, hit "u"
		// search on ""ZhiUTech.ForceUpdate" below and uncomment that popHotkeys line, too.
		// Add force update hotkey
		onPress = function() {
		    // _spectorDump: the fourth "true" gets Spector to dump, if uncommented in Viewer3DImpl.js
		    self.impl.invalidate(true,true,true,true);
		    return true;
		};
		zv.theHotkeyManager.pushHotkeys("ZhiUTech.ForceUpdate", [
		    {
		        keycodes: [keys.u],
		        onPress: onPress
		    }
		]);
		*/

		// Add Fit to view hotkey
		onPress = function() {
			self.navigation.setRequestFitToView(true);
			return true;
		};
		zv.theHotkeyManager.pushHotkeys("ZhiUTech.FitToView", [{
			keycodes: [keys.f],
			onPress: onPress
		}]);

		// Add home hotkey
		onPress = function() {
			self.navigation.setRequestHomeView(true);
			return true;
		};
		zv.theHotkeyManager.pushHotkeys("ZhiUTech.Home", [{
				keycodes: [keys.h],
				onPress: onPress
			},
			{
				keycodes: [keys.HOME],
				onPress: onPress
			}
		]);

		// Escape
		onRelease = function() {
			// handle internal GUI components before firing the event to the client
			if(self.objectContextMenu && self.objectContextMenu.hide()) {
				return true;
			}

			// TODO: Could this all be unified somehow? If event listeners had priorities,
			//       we could intersperse listeners from the client and the viewer, which
			//       I think will eventually be required.

			self.dispatchEvent({
				type: zv.ESCAPE_EVENT
			});
			return true;
		};

		zv.theHotkeyManager.pushHotkeys("ZhiUTech.Escape", [{
			keycodes: [keys.ESCAPE],
			onRelease: onRelease
		}]);

		// Pan
		onPress = function() {
			previousTool = self.getActiveNavigationTool();
			return self.setActiveNavigationTool("pan");
		};
		onRelease = function() {
			return self.setActiveNavigationTool(previousTool);
		};
		var hotkeys = [{
				keycodes: [keys.SHIFT],
				onPress: onPress,
				onRelease: onRelease
			},
			{
				keycodes: [keys.SPACE],
				onPress: onPress,
				onRelease: onRelease
			}
		];
		zv.theHotkeyManager.pushHotkeys("ZhiUTech.Pan", hotkeys, {
			tryUntilSuccess: true
		});
	};

	Viewer3D.prototype.createControls = function() {
		var self = this;
		var impl = self.impl;

		self.navigation = new zv.Navigation(impl.camera);
		self.__initAutoCam(impl);

		self.utilities = new zv.ViewingUtilities(impl, self.autocam, self.navigation);
		self.clickHandler = new zv.DefaultHandler(impl, self.navigation, self.utilities);
		self.toolController = new zv.ToolController(impl, self, self.autocam, self.utilities, self.clickHandler);
		self.toolController.registerTool(new zv.GestureHandler(self));

		self.toolController.registerTool(zv.theHotkeyManager);
		self.toolController.activateTool(zv.theHotkeyManager.getName());

		self.registerUniversalHotkeys();

		self.toolController.registerTool(new zv.OrbitDollyPanTool(impl, self));

		return self.toolController;
	};

	/**
	 * Create any DOM and canvas elements, and setup WebGL.
	 *
	 * @returns {number} 0 if initialization was successful, {@link ZhiUTech.Viewing.ErrorCode} otherwise.
	 */
	Viewer3D.prototype.initialize = function() {

		//Set up the private viewer implementation
		this.setScreenModeDelegate(this.config ? this.config.screenModeDelegate : undefined);

		var dimensions = this.getDimensions();
		this.canvas.width = dimensions.width;
		this.canvas.height = dimensions.height;

		// For Safari and WKWebView and UIWebView on ios device with retina display,
		// needs to manually rescale our canvas to get the right scaling. viewport metatag
		// alone would not work.
		if(zv.isIOSDevice() && window.devicePixelRatio) {
			this.canvas.width /= window.devicePixelRatio;
			this.canvas.height /= window.devicePixelRatio;
		}

		//Call this after setting canvas size above...
		this.impl.initialize();

		//Only run the WebGL failure logic if the renderer failed to initialize (otherwise
		//we don't have to spend time creating a GL context here, since we know it worked already
		if(!this.impl.glrenderer()) {
			var webGL = zv.detectWebGL();
			if(webGL <= 0) { // WebGL error.
				return webGL === -1 ? zv.ErrorCodes.BROWSER_WEBGL_NOT_SUPPORTED : zv.ErrorCodes.BROWSER_WEBGL_DISABLED;
			}
		}

		var self = this;

		// Add a callback for the panels to resize when the viewer resizes.
		// For some reason, Safari iOS updates the DOM dimensions *after* the resize event,
		// so in that case we handle the resizing asynchronously.
		if(zv.isIOSDevice()) {
			var _resizeTimer;
			this.onResizeCallback = function(e) {
				clearTimeout(_resizeTimer);
				_resizeTimer = setTimeout(self.resize.bind(self), 500);
			};
		} else {
			this.onResizeCallback = function(e) {
				var oldWidth = self.impl.camera.clientWidth;
				var oldHeight = self.impl.camera.clientHeight;
				var newWidth = self.container.clientWidth;
				var newHeight = self.container.clientHeight;

				if(oldWidth !== newWidth ||
					oldHeight !== newHeight) {
					self.resize();
				}
			};
		}
		window.addEventListener('resize', this.onResizeCallback, false);

		this.onScrollCallback = function(e) {
			self.impl.canvasBoundingclientRectDirty = true;
		};
		window.addEventListener('scroll', this.onScrollCallback);

		this.initContextMenu();

		// Localize the viewer.
		this.localize();

		this.impl.controls = this.createControls();
		this.setDefaultNavigationTool("orbit");
		this.model = null;

		if(this.impl.controls)
			this.impl.controls.setAutocam(this.autocam);

		var canvasConfig = (this.config && this.config.canvasConfig) ? this.config.canvasConfig : Viewer3D.kDefaultCanvasConfig;
		this.setCanvasClickBehavior(canvasConfig);

		// Allow clients not load the spinner. This is needed for embedding viewer in a WebView on mobile,
		// where the spinner makes the UI looks less 'native'.
		if(!canvasConfig.disableSpinner) {

			// Create a div containing an image: this will be a
			// spinner (aka activity indicator) that tells the user
			// that the file is loading.
			//
			this.loadSpinner = document.createElement("div");
			this.loadSpinner.className = "spinner";
			this.container.appendChild(this.loadSpinner);

			// Generate circles for spinner
			for(var i = 1; i <= 3; i++) {
				var spinnerContainer = document.createElement("div");
				spinnerContainer.className = "bounce" + i;
				this.loadSpinner.appendChild(spinnerContainer);
			}
		}

		// Setup of AO, Ghosting, Env Lighting etc.
		this.initSettings();

		// Auxiliary class to get / restore the viewer state.
		this.viewerState = new zvp.ViewerState(this);

		// The default behavior is to run the main loop immediately, unless startOnInitialize
		// is provided and is false.
		//
		if(!this.config || !this.config.hasOwnProperty("startOnInitialize") || this.config.startOnInitialize) {
			this.run();
		}

		// window.NOP_VIEWER = this;

		this.addEventListener(zv.RESTORE_DEFAULT_SETTINGS_EVENT, this.onResetEvent);
		this.dispatchEvent(zv.VIEWER_INITIALIZED);

		this.trackADPSettingsOptions();
		this.trackADPExtensionsLoaded();

		Viewer3D.ViewerCount++;

		// These calls are useful for Internet Explorer's use of spector.
		// Uncomment this code, and add the https://spectorcdn.babylonjs.com/spector.bundle.js script
		// in viewer3d.html, and Spector's menu shows up in the application itself.
		/*
		var spector = new SPECTOR.Spector();
		window.spector = spector;
		spector.displayUI();    // comment this line out if you instead want to use _spectorDump and the "u" key
		spector.spyCanvases();
		*/

		return 0; // No Error initializing.
	};

	Viewer3D.prototype.setUp = function(config) {

		this.config = config;

		// Load the extensions specified in the config.
		//
		if(this.config && this.config.hasOwnProperty('extensions')) {
			var extensions = this.config.extensions;
			for(var i = 0; i < extensions.length; ++i) {
				this.loadExtension(extensions[i], this.config);
			}
		}

		//load debug ext by query param
		var debugConfig = zvp.getParameterByName("lmv_viewer_debug");
		if(debugConfig == "true") {
			this.loadExtension("ZhiUTech.Debug", this.config);
		}

		var canvasConfig = (this.config && this.config.canvasConfig) ? this.config.canvasConfig : Viewer3D.kDefaultCanvasConfig;
		this.setCanvasClickBehavior(canvasConfig);
	};

	Viewer3D.prototype.tearDown = function() {
		this.clearSelection();

		if(this.loadedExtensions) {
			for(var extensionId in this.loadedExtensions) {
				try {
					// Extensions that fail to unload will end up terminating
					// the viewer tearDown process.  Thus we protect from it
					// here and log it (if available).
					this.unloadExtension(extensionId);
				} catch(err) {
					zvp.logger.error("Failed to unload extension: " + extensionId, err, zv.errorCodeString(zv.ErrorCodes.VIEWER_INTERNAL_ERROR));
					zvp.logger.track({
						category: "error_unload_extension",
						extensionId: extensionId,
						error_message: err.message,
						call_stack: err.stack
					});
				}
			}
			this.loadedExtensions = null;
		}

		// Deactivate mouse events and touch gestures. If a new model will be loaded, it will be enabled again (activateDefaultNavigationTools).
		if(this.toolController) {
			this.toolController.enableMouseButtons(false);
			this.toolController.deactivateTool("gestures");
		}

		zvp.logger.reportRuntimeStats(true);

		if(this.loadSpinner)
			this.loadSpinner.style.display = "block";
		this.model = null;

		if(this.liveReviewClient) {
			this.liveReviewClient.destroy();
			this.liveReviewClient = null;
		}

		//Stop ADP tracking
		while(this.trackADPTimer.length > 0) {
			clearTimeout(this.trackADPTimer.pop());
		}

		this.impl.unloadCurrentModel();
	};

	Viewer3D.prototype.run = function() {
		if(!this.running) {
			this.resize();
			this.running = true;
			this.impl.run();
		}
	};

	/**
	 * Localize the viewer. This method can be overwritten so that the subclasses
	 * can localize any additional elements.
	 */
	Viewer3D.prototype.localize = function() {
		zv.i18n.localize();
	};

	Viewer3D.prototype.__initAutoCam = function(impl) {
		var self = this;

		var ourCamera = impl.camera;

		if(!ourCamera.pivot)
			ourCamera.pivot = new THREE.Vector3(0, 0, 0);

		if(!ourCamera.target)
			ourCamera.target = new THREE.Vector3(0, 0, 0);

		if(!ourCamera.worldup)
			ourCamera.worldup = ourCamera.up.clone();

		function autocamChange(upChanged) {
			if(self.autocamCamera.isPerspective !== ourCamera.isPerspective) {
				if(self.autocamCamera.isPerspective)
					self.navigation.toPerspective();
				else
					self.navigation.toOrthographic();
			}
			self.navigation.setVerticalFov(self.autocamCamera.fov, false);
			self.navigation.setView(self.autocamCamera.position, self.autocamCamera.target);
			self.navigation.setPivotPoint(self.autocamCamera.pivot);
			self.navigation.setCameraUpVector(self.autocamCamera.up);
			if(upChanged)
				self.navigation.setWorldUpVector(self.autocamCamera.worldup);

			self.impl.syncCamera(upChanged);
		}

		function pivotDisplay(state) {
			if(self.utilities)
				self.utilities.pivotActive(state, false);
			else
				self.impl.controls.pivotActive(state, false);
		}

		function onTransitionCompleted() {
			self.fireEvent({
				type: zv.CAMERA_TRANSITION_COMPLETED
			});
		}

		self.autocamCamera = ourCamera.clone();
		self.autocamCamera.target = ourCamera.target.clone();
		self.autocamCamera.pivot = ourCamera.pivot.clone();
		self.autocamCamera.worldup = ourCamera.worldup.clone();

		self.autocam = new zvp.Autocam(self.autocamCamera, self.navigation, self.canvas);
		self.autocam.registerCallbackCameraChanged(autocamChange);
		self.autocam.registerCallbackPivotDisplay(pivotDisplay);
		self.autocam.registerCallbackTransitionCompleted(onTransitionCompleted);

		self.addEventListener("cameraChanged", function(evt) {
			var ourCamera = evt.camera;
			self.autocam.sync(ourCamera);
		});

		self.autocam.sync(ourCamera);
	};

	/**
	 * Removes all created DOM elements and performs any GL uninitialization that is needed.
	 */
	Viewer3D.prototype.uninitialize = function() {

		window.removeEventListener('resize', this.onResizeCallback, false);
		this.onResizeCallback = null;

		window.removeEventListener('scroll', this.onScrollCallback);
		this.onScrollCallback = null;

		this.canvas.parentNode.removeChild(this.canvas);
		this.canvas.viewer = null;
		this.canvas = null;
		this.canvasWrap = null;

		this.viewerState = null;

		zvp.logger.reportRuntimeStats();
		zvp.logger.track({
			category: "viewer_destroy"
		}, true);

		if(this.toolController) {
			this.toolController.uninitialize();
			this.toolController = null;
			this.clickHandler = null;
			this.utilities = null;
		}

		if(this.navigation) {
			this.navigation.uninitialize();
			this.navigation = null;
		}

		if(this.impl) {
			this.impl.dtor();
			this.impl = null;
		}

		this.loadSpinner = null;
		this.model = null;
		this.prefs = null;

		this.autocam.dtor();
		this.autocam = null;
		this.autocamCamera = null;

		// the other line needed for the "u" key, _spectorDump
		//zv.theHotkeyManager.popHotkeys("ZhiUTech.ForceUpdate");
		zv.theHotkeyManager.popHotkeys("ZhiUTech.FitToView");
		zv.theHotkeyManager.popHotkeys("ZhiUTech.Home");
		zv.theHotkeyManager.popHotkeys("ZhiUTech.Escape");
		zv.theHotkeyManager.popHotkeys("ZhiUTech.Pan");
		zv.theHotkeyManager.popHotkeys("ZhiUTech.Orbit");

		Viewer3D.ViewerCount--;
		if(Viewer3D.ViewerCount === 0) {
			WGS.clearPropertyWorkerCache();
		}

		if(this.onDefaultContextMenu) {
			this.container.removeEventListener('contextmenu', this.onDefaultContextMenu, false);
			this.onDefaultContextMenu = null;
		}

		if(this.screenModeDelegate) {
			this.screenModeDelegate.uninitialize();
			this.screenModeDelegate = null;
		}

		this.extensionCache = null;
		this.clientContainer = null;
		this.config = null;
		this.listeners = {};
		this.contextMenu = null;
		this.contextMenuCallbacks = null;

		if(this.viewCubeUi) {
			this.viewCubeUi.uninitialize();
			this.viewCubeUi = null;
		}

		if(this.container && this.container.parentNode)
			this.container.parentNode.removeChild(this.container);
		this.container = null;

		this.dispatchEvent(zv.VIEWER_UNINITIALIZED);

		//forget all event listeners
		this.listeners = {};

		zvp.logger.log("viewer destroy");
	};

	/**
	 * Unloads any loaded extensions and then uninitializes the viewer.
	 */
	Viewer3D.prototype.finish = function() {
		this.tearDown();
		this.uninitialize();
	};

	/**
	 * @deprecated Use {@link ZhiUTech.Viewing.Viewer3D#loadModel} instead.
	 * Load the file from the cloud or locally.
	 * Asynchronously loads the document given its esdURN.
	 * - on success: calls onDocumentLoadedCallback.
	 * - on error: displays an error AlertBox.
	 * @param {string} esdURN - The URN or filepath to load.
	 * @param {string} [sharedPropertyDbPath] - Optional path to shared property database.
	 * @param {function} [onSuccessCallback] - Method that gets called when initial loading is done
	 * and streaming starts.
	 * @param {function} [onErrorCallback] - Method that gets called when initial loading ends with an error.
	 * @param {object} [loadOptions] - Optional load options passed to the model loader.
	 */
	Viewer3D.prototype.load = function(esdURN, sharedPropertyDbPath, onSuccessCallback, onErrorCallback, acmSessionId, loadOptions) {
		zvp.logger.warn('viewer.load() is deprecated. Please use viewer.loadModel() instead.');
		var options = {
			ids: null,
			sharedPropertyDbPath: sharedPropertyDbPath,
			acmSessionId: acmSessionId,
			loadOptions: loadOptions
		};
		return this.loadModel(esdURN, options, onSuccessCallback, onErrorCallback);
	};

	Viewer3D.prototype.setLoadHeuristics = function(options) {

		//Check for source file extension -- Revit and Navisworks are AEC/BIM models
		var bubbleNode = options.bubbleNode;
		if(bubbleNode && !options.hasOwnProperty("isAEC")) {
			var viewable = bubbleNode.findViewableParent();
			if(viewable) {
				var fileName = viewable.name();
				var fileExt = fileName.slice(fileName.length - 3).toLowerCase();
				if(fileExt === "rvt" || fileExt === "nwd" || fileExt === "nwc") {
					options.isAEC = true;
				}
			}
		}

		//If it's an AEC model, use mesh conslidation unless explicitly turned off
		if(options.isAEC) {
			if(typeof options.useConsolidation === "undefined") {
				options.useConsolidation = !zv.isMobileDevice();
			}
			if(typeof options.createWireframe === "undefined") {
				options.createWireframe = !zv.isMobileDevice();
			}
		}

		//Make it possible to use multithreaded consolidation
		if(options.useConsolidation) {
			WGS.ConsolidationUtils.registerWorkerSupport(zvp.createWorkerWithIntercept);
		}

		// When using consolidation, a too fine-grained bvh would eliminate the performance gain.
		// To avoid that, we use larger default settings when activating consolidation.
		//
		// Doing this for consolidation only is done to minimize the scope of potential side effects whenever consolidation is not used.
		// It might generally be useful to increase these values, but this requires more investigation of potential performance impact first.
		if(options.useConsolidation && !options.bvhOptions) {
			options.bvhOptions = {
				frags_per_leaf_node: 256,
				max_polys_per_node: 50000
			};
		}

	};

	/**
	 * ADP
	 */

	Viewer3D.prototype.trackADPSettingsOptions = function() {
		var self = this;
		this.trackADPTimer.push(setTimeout(function() {
			var settingOptionsStatus = {
				category: "settingOptionsStatus",
				switchSheetColorWhiteToBlack: self.prefs.swapBlackAndWhite,
				newFirstPersonToolPrototype: self.prefs.useFirstPersonPrototype,
				leftHandedMouseSetup: self.prefs.leftHandedMouseSetup,
				openPropertiesOnSelect: self.prefs.openPropertiesOnSelect,
				orbitPastWorldPoles: self.prefs.orbitPastWorldPoles,
				reverseMouseZoomDirection: self.prefs.reverseMouseZoomDir,
				fusionStyleOrbit: self.prefs.fusionOrbit,
				setPivotWithLeftMouseButton: self.prefs.clickToSetCOI,
				zoomTowardPivot: self.prefs.zoomTowardsPivot,
				viewCubeActsOnPivot: self.prefs.alwaysUsePivot,
				showViewCube: self.prefs.viewCube,
				environmentImageVisible: self.prefs.envMapBackground,
				displayEdges: self.prefs.edgeRendering,
				displayPoints: self.prefs.pointRendering,
				displayLines: self.prefs.lineRendering,
				ghostHiddenObjects: self.prefs.ghosting,
				groundReflection: self.prefs.groundReflection,
				groundShadow: self.prefs.groundShadow,
				ambientShadows: self.prefs.ambientShadows,
				antiAliasing: self.prefs.antialiasing,
				progressiveModelDisplay: self.prefs.progressiveRendering,
				smoothNavigation: self.prefs.optimizeNavigation
			};
			zvp.logger.track(settingOptionsStatus);
		}, 30000));

	};

	Viewer3D.prototype.trackADPExtensionsLoaded = function() {
		var self = this;
		var extensionList = {};
		extensionList.category = "loaded_extensions";
		this.trackADPTimer.push(setTimeout(function() {
			if(self.loadedExtensions) {
				for(var extensionId in self.loadedExtensions) {
					extensionList[extensionId] = extensionId;
				}
			}
			zvp.logger.track(extensionList);
		}, 30000));
	};

	/**
	 * Loads a model into the viewer.
	 * @param {string} url - The url to the model.
	 * @param {object} [options] - An optional dictionary of options.
	 * @param {ZhiUTech.Viewing.FileLoader} [options.fileLoader] - The file loader to use for this url.
	 * @param {object} [options.loadOptions] - May contain params that are specific for certain loaders/filetypes.
	 * @param {string} [options.sharedPropertyDbPath] - Optional path to shared property database.
	 * @param {string} [options.ids] - A list of object IDs to load.
	 * @param {string} [options.modelNameOverride] - Allows host application to override model name used in UI.
	 * @param {function} [onSuccessCallback] - A method that gets called when initial loading is done
	 * and streaming starts.
	 * @param {function} [onErrorCallback] - A method that gets called when loading fails.
	 */
	Viewer3D.prototype.loadModel = function(url, options, onSuccessCallback, onErrorCallback, onWorkerStart) {
		var self = this;

		options = options || {};

		function registerDimensionSpecificHotkeys() {
			if(!zv.theHotkeyManager)
				return;

			if(self.model.is2d()) {
				// Remove 3D specific hotkeys
				zv.theHotkeyManager.popHotkeys("ZhiUTech.Orbit");
			} else {
				// Add 3D specific hotkeys
				// Orbit
				var previousTool;
				var onPress = function() {
					previousTool = self.getActiveNavigationTool();
					return self.setActiveNavigationTool("orbit");
				};
				var onRelease = function() {
					return self.setActiveNavigationTool(previousTool);
				};
				var hotkeys = [{
					keycodes: [zv.theHotkeyManager.KEYCODES.ALT],
					onPress: onPress,
					onRelease: onRelease
				}];
				zv.theHotkeyManager.pushHotkeys("ZhiUTech.Orbit", hotkeys, {
					tryUntilSuccess: true
				});
			}
		}

		function activateDefaultNavigationTools() {
			if(zv.isNodeJS)
				return;
			var defaultNavTool = (self.model.is2d()) ? "pan" : "orbit";
			self.setActiveNavigationTool(defaultNavTool);
			self.setDefaultNavigationTool(defaultNavTool);

			if(self.toolController) {
				self.toolController.enableMouseButtons(true);
				self.toolController.activateTool("gestures");
			}
		}

		var loaderInstance;

		function onDone(error, model) {
			self.impl._removeLoadingFile(loaderInstance);
			if(error) {
				onError(error.code, error.msg, error.args);
				return;
			}

			var isFirstModel = false;
			if(!self.model) {
				self.model = model;
				isFirstModel = true;
			}
			self.impl.addModel(model);

			if(self.loadSpinner)
				self.loadSpinner.style.display = "None";

			if(isFirstModel) {
				if(model.is2d()) {
					self.activateLayerState("Initial");
					self.impl.setSelectionColor(0x0000FF);
				}
				registerDimensionSpecificHotkeys();
				activateDefaultNavigationTools();
			}

			if(onSuccessCallback) {
				onSuccessCallback(model);
			}
		}

		function onError(errorCode, errorMessage, errorArgs) {
			if(self.loadSpinner)
				self.loadSpinner.style.display = "None";
			if(onErrorCallback)
				onErrorCallback(errorCode, errorMessage, errorArgs);
		}

		// Force a repaint when a file is fully done loading
		function forceRepaint() {
			self.impl.needsRender = true;
			self.removeEventListener(zv.GEOMETRY_LOADED_EVENT, forceRepaint);
		}
		this.addEventListener(zv.GEOMETRY_LOADED_EVENT, forceRepaint);

		var match = url.toLowerCase().match(/\.([a-z0-9]+)(\?|$)/),
			fileExtension = match ? match[1] : null;

		var loader;
		if(options && options.fileLoader) {
			loader = options.fileLoader;
		} else {
			loader = zv.FileLoaderManager.getFileLoaderForExtension(fileExtension);
		}

		// if there's no loader, don't try to create it and cause an error.
		if(!loader) {

			zvp.logger.error("File extension not supported:" + fileExtension, zv.errorCodeString(zv.ErrorCodes.UNSUPORTED_FILE_EXTENSION));
			onError(zv.ErrorCodes.UNSUPORTED_FILE_EXTENSION, "File extension not supported", 0, fileExtension);
			return false;
		}

		//Run some heuristics to adapt the viewing experience to the model we are about to display
		this.setLoadHeuristics(options);

		zvp.processMemoryOptions(this.config);
		loaderInstance = new loader(this.impl._loaderDelegate, this.config);
		var returnValue = loaderInstance.loadFile(url, options, onDone, onWorkerStart);

		//If we know that the model is going to use a specific light preset, trigger the environment map
		//change as early as possible (i.e. not on addModel ) in order to avoid a flash from the old map to the new
		//one that happens if the change is delayed until addModel.
		if(options.isAEC && loaderInstance.is3d())
			this.impl.setLightPresetForAec();

		this.impl.setRenderingPrefsFor2D(!loaderInstance.is3d());

		return returnValue;
	};

	/**
	 * 
	 * @param {Document} avDocument - The Document instance, which owns the model being loaded
	 * @param {BubbleNode} manifestNode - The specific manifest node to load (within the Document) 
	 * @param {Object} options - Options to pass to Viewer3D.loadModel. Will be initialized internally if not specified. Leave empty in most cases.
	 */
	Viewer3D.prototype.loadDocumentNode = function(avDocument, manifestNode, options) {

		var bubbleNode = (manifestNode instanceof zv.BubbleNode) ? manifestNode : avDocument.getRoot().search({
			guid: manifestNode.guid
		})[0];

		var designNode = bubbleNode.findViewableParent().parent;
		var acmSessionId = designNode.urn();

		//var modelRootUrl = bubbleNode.getViewableRootPath();
		var leafletOptions = {};
		var modelRootUrl = avDocument.getViewableUrn(bubbleNode, leafletOptions);
		var sharedDbPath = bubbleNode.findPropertyDbPath();

		var isLocalPath = false;
		if(modelRootUrl.indexOf("$file$") === 0) {
			modelRootUrl = avDocument.getFullPath(modelRootUrl);
			sharedDbPath = avDocument.getFullPath(sharedDbPath);
			isLocalPath = true;
		}

		var otgNode = bubbleNode.getOtgGraphicsNode();
		if(!isLocalPath) {
			if(otgNode && !otgNode.error) {
				//LMV is configured with the Fluent endpoint by default.
				modelRootUrl = zv.endpoint.getItemApi(null, modelRootUrl);
				sharedDbPath = zv.endpoint.getItemApi(null, sharedDbPath);
			} else {
				if(zv.endpoint.getApiFlavor() === zv.endpoint.ENDPOINT_API_FLUENT) {
					//If LMV is configured with the Fluent endpoint by default, so in this case
					//we have to explicitly initialize a DS /items API URL instead of relying on the
					//built in logic.
					modelRootUrl = zv.endpoint.getItemApi(zv.endpoint.getApiEndpoint(), modelRootUrl, 'derivativeV2');
					sharedDbPath = zv.endpoint.getItemApi(zv.endpoint.getApiEndpoint(), sharedDbPath, 'derivativeV2');
				} else {
					//Fluent disabled -- going through usual DS endpoints, automatic URL construction

					//Find the bubbleNode's manifest's acm session id
					var root = bubbleNode;
					while(root.parent) root = root.parent;

					acmSessionId = root.acmSessionId;
				}
			}
		}

		var loadOptions = {
			sharedPropertyDbPath: sharedDbPath,
			acmSessionId: acmSessionId,
			isAEC: true,
			bubbleNode: bubbleNode,
			applyRefPoint: true,
			loadOptions: leafletOptions
		};

		options = options || {};

		for(var p in loadOptions) {
			if(!options.hasOwnProperty(p))
				options[p] = loadOptions[p];
		}

		if(!options.keepCurrentModels) {
			this.impl.unloadCurrentModel();
			this.impl.model = null;
			this.model = null;
		}

		var that = this;
		return new Promise(function(resolve, reject) {
			that.loadModel(modelRootUrl, options,
				function onSuccess(model) {
					resolve(model);
				},
				function onFailure(error) {
					reject(error);
				}
			);
		});
	};

	/**
	 * @returns {object} Client rectangle bounds.
	 */
	Viewer3D.prototype.getDimensions = function() {
		if(this.container) {
			// NB: Getting dimensions of the client container instead of the container.
			//     At least in IE11, getting dimensions on the dynamically created
			//     child of the dynamically created parent returns a 0 height.
			var rect = {};
			if(this.getScreenMode() === zv.ScreenMode.kFullScreen) {
				rect.width = screen.width;
				rect.height = screen.height;
			} else {
				rect = this.container.getBoundingClientRect();
			}

			return {
				width: rect.width,
				height: rect.height
			};
		}

		return null;
	};

	/**
	 * Resizes the viewer.
	 */
	Viewer3D.prototype.resize = function() {
		this.impl.resize(this.container.clientWidth, this.container.clientHeight);
	};

	/**
	 * Gets the camera so it can be modified by the client.
	 * @returns {THREE.Camera} The active camera.
	 */
	Viewer3D.prototype.getCamera = function() {
		return this.impl.camera;
	};

	/**
	 * Gets the view state as a plain object.
	 *
	 * @param {object} [filter] - Specifies which viewer values to get.
	 * @returns {object} Viewer state.
	 */
	Viewer3D.prototype.getState = function(filter) {
		return this.viewerState.getState(filter);
	};

	/**
	 * Restores the viewer state from a given object.
	 * @param {Object} viewerState
	 * @param {Object} [filter] - Similar in structure to viewerState used to filter out values
	 * that should not be restored.
	 * @param {boolean} [immediate] - Whether the new view is applied with (true) or without transition (false).
	 * @returns {boolean} True if restore operation was successful.
	 */
	Viewer3D.prototype.restoreState = function(viewerState, filter, immediate) {
		var success = this.viewerState.restoreState(viewerState, filter, immediate);
		if(success) {
			this.dispatchEvent({
				type: zv.VIEWER_STATE_RESTORED_EVENT,
				value: success
			});
		}
		return success;
	};

	/**
	 * Sets the view from an array of parameters.
	 * @param {array} params - View parameters:
	 * - position-x
	 * - position-y
	 * - position-z
	 * - target-x
	 * - target-y
	 * - target-z
	 * - up-x
	 * - up-y
	 * - up-z
	 * - aspect
	 * - fov (radians)
	 * - orthoScale
	 * - isPerspective (0=perspective, 1=ortho)
	 */
	Viewer3D.prototype.setViewFromArray = function(params, name) {
		//TODO: It might be best to get rid of the setViewFromArray API as it's not
		//very descriptive, and move the params->camera conversion to the bubble-reading
		//logic in ViewingApplication.

		//Make sure to apply any internal translation offset to the input camera
		var off = this.model ? this.model.getData().globalOffset : {
			x: 0,
			y: 0,
			z: 0
		};
		var camera = {
			position: new THREE.Vector3(params[0] - off.x, params[1] - off.y, params[2] - off.z),
			target: new THREE.Vector3(params[3] - off.x, params[4] - off.y, params[5] - off.z),
			up: new THREE.Vector3(params[6], params[7], params[8]),
			aspect: params[9],
			fov: THREE.Math.radToDeg(params[10]),
			orthoScale: params[11],
			isPerspective: !params[12]
		};

		this.impl.setViewFromCamera(camera);
	};

	/**
	 * Sets the view from an array representing a view box.
	 *
	 * Not applicable to 3D.
	 *
	 * @param {array} viewbox - View parameters:
	 * - min-x
	 * - min-y
	 * - max-x
	 * - max-y
	 * @param {string} [name] - Optional named view name to also set the layer visibility state
	 * associated with this view.
	 */
	Viewer3D.prototype.setViewFromViewBox = function(viewbox, name) {
		var model = this.model;

		if(model && !model.is2d()) {
			zvp.logger.warn("Viewer3D.setViewFromViewBox is not applicable to 3D");
			return;
		}

		//set the layer state if any
		//It's annoying to search the views and states as arrays,
		//but this is the only place we do this, so converting them
		//to hashmaps is not necessary (yet).
		if(name && name.length) {
			var metadata = model.getData().metadata;
			var views = metadata.views;

			var i;
			for(i = 0; i < views.length; i++) {
				if(views[i].name == name)
					break;
			}

			if(i < views.length) {
				var state_name = views[i].layer_state;
				if(state_name)
					this.activateLayerState(state_name);
			}
		}

		//Finally set the camera
		this.impl.setViewFromViewBox(this.model, viewbox, name, false);
	};

	/**
	 * Changes the active layer state.
	 * Get a list of all available layerStates and their active status through
	 * {@link ZhiUTech.Viewing.Viewer3D#getLayerStates}.
	 *
	 * @param {string} stateName - Name of the layer state to activate.
	 */
	Viewer3D.prototype.activateLayerState = function(stateName) {
		this.impl.layers.activateLayerState(stateName);
		this.dispatchEvent({
			type: zv.LAYER_VISIBILITY_CHANGED_EVENT
		});
	};

	/**
	 * Returns information for each layer state: name, description, active.
	 * Activate a state through {@link ZhiUTech.Viewing.Viewer3D#activateLayerState}.
	 * @returns {array}
	 */
	Viewer3D.prototype.getLayerStates = function() {

		return this.impl.layers.getLayerStates();
	};

	/**
	 * Sets the view using the default view in the source file.
	 */
	Viewer3D.prototype.setViewFromFile = function() {
		this.setActiveNavigationTool();
		this.impl.setViewFromFile(this.model);
	};

	/**
	 * Gets the properties for an ID. Once the properties are returned,
	 * the method raises a onPropertiesReady event.
	 * @param {number} dbid
	 * @param {function} [onSuccessCallback] - Call this callback once the properties are found.
	 * @param {function} [onErrorCallback] - Call this callback if the properties are not found,
	 * or another error occurs.
	 */
	Viewer3D.prototype.getProperties = function(dbid, onSuccessCallback, onErrorCallback) {
		if(this.model) {
			this.model.getProperties(dbid, onSuccessCallback, onErrorCallback);
		} else {
			if(onErrorCallback)
				onErrorCallback(zv.ErrorCodes.BAD_DATA, "Properties failed to load since model does not exist");
		}
	};

	/**
	 * Gets the viewer model object tree. Once the tree is received it will invoke the specified callback function.
	 *
	 * You can use the model object tree to get information about items in the model.  The tree is made up
	 * of nodes, which correspond to model components such as assemblies or parts.
	 *
	 * @param {function} [onSuccessCallback] - Call this callback once the object tree is loaded.
	 * @param {function} [onErrorCallback] - Call this callback if the object tree is not found.
	 */
	Viewer3D.prototype.getObjectTree = function(onSuccessCallback, onErrorCallback) {
		if(this.model) {
			this.model.getObjectTree(onSuccessCallback, onErrorCallback);
		} else {
			if(onErrorCallback)
				onErrorCallback(zv.ErrorCodes.BAD_DATA, "ObjectTree failed to load since model does not exist");
		}
	};

	/**
	 * Sets the click behavior on the canvas to follow config.
	 * This is used to change the behavior of events such as selection or COI changed.
	 * @example
	 *  {
	 *       "click": {
	 *           "onObject": [ACTIONS],
	 *           "offObject": [ACTIONS]
	 *       },
	 *       "clickCtrl": {
	 *           "onObject": [ACTIONS],
	 *           "offObject": [ACTIONS]
	 *       },
	 *       "clickShift": {
	 *           ...
	 *       },
	 *       "clickCtrlShift": {
	 *           ...
	 *       },
	 *       "disableSpinner": BOOLEAN
	 *       "disableMouseWheel": BOOLEAN,
	 *       "disableTwoFingerSwipe": BOOLEAN
	 *  }
	 *
	 * Actions can be any of the following:
	 * - selectOnly
	 * - selectToggle
	 * - deselectAll
	 * - isolate
	 * - showAll
	 * - setCOI
	 * - focus
	 * - hide
	 * @param {object} config - Parameter object that meets the above layout.
	 */
	Viewer3D.prototype.setCanvasClickBehavior = function(config) {
		if(this.impl.controls.hasOwnProperty("setClickBehavior"))
			this.impl.controls.setClickBehavior(config);

		if(this.clickHandler)
			this.clickHandler.setClickBehavior(config);

		if(config && config.disableMouseWheel) {
			this.toolController.setMouseWheelInputEnabled(false);
		}

		if(config && config.disableTwoFingerSwipe) {
			var gestureHandler = this.toolController.getTool("gestures");
			if(gestureHandler) {
				gestureHandler.disableTwoFingerSwipe();
			}
		}
	};

	/**
	 * Searches the elements for the given text. When the search is complete,
	 * the callback onResultsReturned(idArray) is invoked.
	 * @param {string} text - The search term (not case sensitive).
	 * @param {function} onSuccessCallback - The callback to invoke when search is complete.
	 * @param {function} onErrorCallback - The callback to invoke when search is complete.
	 * @param {string[]} [attributeNames] - Restricts search to specific attribute names.
	 */
	Viewer3D.prototype.search = function(text, onSuccessCallback, onErrorCallback, attributeNames, completeInfo) {
		this.searchText = text;

		if(this.model) {
			this.model.search(text, onSuccessCallback, onErrorCallback, attributeNames, completeInfo);
		} else {
			if(onErrorCallback)
				onErrorCallback(zv.ErrorCodes.BAD_DATA, "Search failed since model does not exist");
		}
	};

	/**
	 * Returns an array of the IDs of the currently hidden nodes.
	 * When isolation is in place, there are no hidden nodes returned because
	 * all nodes that are not isolated are considered hidden.
	 *
	 * @returns {array} Array of nodes that are currently hidden, when no isolation is in place.
	 */
	Viewer3D.prototype.getHiddenNodes = function() {
		return this.impl.visibilityManager.getHiddenNodes();
	};

	/**
	 * Returns an array of the IDs of the currently isolated nodes.
	 *
	 * Not yet implemented for 2D.
	 *
	 * @returns {array} Array of nodes that are currently isolated.
	 */
	Viewer3D.prototype.getIsolatedNodes = function() {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.getIsolatedNodes is not yet implemented for 2D");
			return [];
		}

		return this.impl.visibilityManager.getIsolatedNodes();
	};

	/**
	 * Isolates one of many sub-elements. You can pass in a node or an array of nodes to isolate.
	 * Pass in null to reset isolation.
	 *
	 * @param {number[]|number} node - A node ID or array of node IDs from the model tree {@link BaseViewer#getObjectTree}.
	 * @param {ZhiUTech.Viewing.Model} [model] - the model that contains the node id. Defaults to the first loaded model.
	 */
	Viewer3D.prototype.isolate = function(node, model) {
		model = model || this.model;
		if(!model) {
			return;
		}

		var data = model.getData();
		this.impl.visibilityManager.isolate(node, model);
	};

	/**
	 * @deprecated Isolates one of many sub-elements. You can pass in a dbid or an array of dbid to isolate.
	 *
	 * Not yet implemented for 2D.
	 *
	 * @param {array|number} dbids - Either an array or a single integer.
	 */
	Viewer3D.prototype.isolateById = function(dbIds) {

		zvp.logger.warn("isolateById() is deprecated. Use isolate() instead.");
		return this.isolate(dbIds);

	};

	/**
	 * Sets the background color.
	 * @param {number} red
	 * @param {number} green
	 * @param {number} blue
	 * @param {number} red2
	 * @param {number} green2
	 * @param {number} blue2
	 */
	Viewer3D.prototype.setBackgroundColor = function(red, green, blue, red2, green2, blue2) {
		this.impl.setClearColors(red, green, blue, red2, green2, blue2);
	};

	/**
	 * Toggles the selection for a given dbid.
	 * If it was unselected, it is selected.
	 * If it was selected, it is unselected.
	 * 
	 * Not yet implemented for 2D.
	 *
	 * @param {number} dbid
	 * @param {ZhiUTech.Viewing.Model} [model] - the model that contains the dbId. Uses the initial model loaded by default.
	 */
	Viewer3D.prototype.toggleSelect = function(dbid, model) {
		model = model || this.model;
		if(model && model.is2d()) {
			// Fails because Model.getNodeById is not supported.
			zvp.logger.warn("Viewer3D.toggleSelect is not yet implemented for 2D");
			return;
		}

		this.impl.selector.toggleSelection(dbid, model);
	};

	/**
	 * Selects the array of ids. You can also just pass in a single id instead of an array.
	 * 
	 * @param {number[]|number} dbids element or array of elements to select.
	 * @param {object} [model] the model instance containing the ids.
	 */
	Viewer3D.prototype.select = function(dbids, model) {
		if(typeof dbids === "number") {
			dbids = [dbids];
		}

		model = model || this.model;
		this.impl.selector.setSelection(dbids, model);
	};

	/**
	 * Clears the selection.
	 */
	Viewer3D.prototype.clearSelection = function() {
		this.impl.selector.clearSelection();
	};

	/**
	 * Returns information about the visibility of the current selection.
	 * @returns {object} `{hasVisible:boolean, hasHidden:boolean}`
	 */
	Viewer3D.prototype.getSelectionVisibility = function() {
		return this.impl.selector.getSelectionVisibility();
	};

	/**
	 * Returns the number of nodes in the current selection.
	 * @returns {number}
	 */
	Viewer3D.prototype.getSelectionCount = function() {
		return this.impl.selector.getSelectionLength();
	};

	/**
	 * Sets selection granularity mode. Supported values are:
	 * - ZhiUTech.Viewing.SelectionMode.LEAF_OBJECT
	 *   - Always select the leaf objects in the hierarchy.
	 * - ZhiUTech.Viewing.SelectionMode.FIRST_OBJECT
	 *   - For a given node, selects the first non-composite (layer, collection, model)
	 *   on the path from the root to the given node, and all children.
	 * - ZhiUTech.Viewing.SelectionMode.LAST_OBJECT
	 *   - For a given node, selects the nearest ancestor composite node and all children.
	 *   Selects the input node itself in case there is no composite node in the path to the root node.
	 */
	Viewer3D.prototype.setSelectionMode = function(mode) {
		this.impl.selector.setSelectionMode(mode);
	};

	/**
	 * Returns the current selection.
	 * @returns {number[]} Array of the IDs of the currently selected nodes.
	 */
	Viewer3D.prototype.getSelection = function() {
		return this.impl.selector.getSelection();
	};

	/**
	 * Returns the selected items from all loaded models.
	 * @param {function} [callback] - Optional callback to receive enumerated pairs of model and dbId
	 * for each selected object. If no callback is given, an array of objects is returned.
	 * @returns {object[]} An array of objects with a model and selectionSet properties for each model
	 * that has selected items in the scene.
	 */
	Viewer3D.prototype.getAggregateSelection = function(callback) {
		var res = this.impl.selector.getAggregateSelection();

		if(callback) {
			for(var i = 0; i < res.length; i++) {
				for(var j = 0; j < res[i].selection.length; j++) {
					callback(res[i].model, res[i].selection[j]);
				}
			}
		}

		return res;
	};

	/**
	 * Returns the isolated items from all loaded models.
	 * 
	 * @returns {object[]} An array of objects with a `model` and the isolated `ids` in that model.
	 */
	Viewer3D.prototype.getAggregateIsolation = function() {

		var res = this.impl.visibilityManager.getAggregateIsolatedNodes();
		return res;
	};

	/**
	 * Returns the hidden nodes for all loaded models.
	 * 
	 * @returns {object[]} An array of objects with a `model` and the hidden `ids` in that model. 
	 */
	Viewer3D.prototype.getAggregateHiddenNodes = function() {

		var res = this.impl.visibilityManager.getAggregateHiddenNodes();
		return res;
	};

	/**
	 * Ensures the passed in dbid / ids are hidden.
	 *
	 * @param {number[]|number} node - An array of dbids or just an id
	 * @param {ZhiUTech.Viewing.Model} [model] - The model that contains the dbId. By default uses the initial model loaded into the scene. 
	 */
	Viewer3D.prototype.hide = function(node, model) {
		model = model || this.model;
		this.impl.visibilityManager.hide(node, model);
	};

	/**
	 * Ensures the passed in dbid / ids are shown.
	 *
	 * @param {number[]|number} node
	 * @param {ZhiUTech.Viewing.Model} [model] - The model that contains the dbId. By default uses the initial model loaded into the scene. 
	 */
	Viewer3D.prototype.show = function(node, model) {
		model = model || this.model;
		this.impl.visibilityManager.show(node, model);
	};

	/**
	 * Ensures everything is visible. Clears all node isolation (3D) and turns on all layers (2D).
	 */
	Viewer3D.prototype.showAll = function() {
		this.impl.visibilityManager.aggregateIsolate([]);
		this.impl.layers.showAllLayers();
	};

	/**
	 * Toggles the visibility of the given node.
	 *
	 * Not yet implemented for 2D.
	 *
	 * @param {number} dbId - the object's identifier.
	 * @param {ZhiUTech.Viewing.Model} [model] - the model that contains the dbId. By default uses the initial model loaded into the scene.
	 */
	Viewer3D.prototype.toggleVisibility = function(dbId, model) {
		this.impl.visibilityManager.toggleVisibility(dbId, model);
	};

	/**
	 * Returns true if every node is visible.
	 * @returns {boolean}
	 */
	Viewer3D.prototype.areAllVisible = function() {
		return this.impl.isWholeModelVisible(this.model);
	};

	/**
	 * Returns true if the specified node is visible.
	 * The model argument is required only when in multi-model scenarios.
	 *
	 * @param {number} nodeId - Geometry node to check if visible.
	 * @param {ZhiUTech.Viewing.Model} [model] - The model that contains the specified ``nodeId``.
	 * 
	 * @returns {boolean}
	 */
	Viewer3D.prototype.isNodeVisible = function(nodeId, model) {
		model = model || this.model;
		return this.impl.isNodeVisible(nodeId, model);
	};

	/**
	 * Explodes the model from the center of gravity.
	 *
	 * Not applicable to 2D.
	 *
	 * @param {number} scale - A value from 0.0-1.0 to indicate how much to explode.
	 */
	Viewer3D.prototype.explode = function(scale) {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.explode is not applicable to 2D");
			return;
		}

		zvp.logger.track({
			name: 'explode_count',
			aggregate: 'count'
		});

		this.impl.explode(scale);
	};

	/**
	 * Returns the explode scale.
	 *
	 * Not applicable to 2D.
	 *
	 * @returns {number} - A value from 0.0-1.0 indicating how exploded the model is.
	 */
	Viewer3D.prototype.getExplodeScale = function() {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.getExplodeScale is not applicable to 2D");
			return 0;
		}

		return this.impl.getExplodeScale();
	};

	/**
	 * Enables or disables the high quality rendering settings.
	 *
	 * Not applicable to 2D.
	 *
	 * @param {boolean} useSAO - True or false to enable screen space ambient occlusion.
	 * @param {boolean} useFXAA - True or false to enable fast approximate anti-aliasing.
	 */
	Viewer3D.prototype.setQualityLevel = function(useSAO, useFXAA) {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.setQualityLevel is not applicable to 2D");
			return;
		}

		this.prefs.set('ambientShadows', useSAO);
		this.prefs.set('antialiasing', useFXAA);
		this.impl.togglePostProcess(useSAO, useFXAA);
	};

	/**
	 * Toggles ghosting during search and isolate.
	 *
	 * Not applicable to 2D.
	 *
	 * @param {boolean} value - Indicates whether ghosting is on or off.
	 */
	Viewer3D.prototype.setGhosting = function(value) {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.setGhosting is not applicable to 2D");
			return;
		}

		this.prefs.set('ghosting', value);
		this.impl.toggleGhosting(value);
	};

	/**
	 * Toggles ground shadow.
	 *
	 * Not applicable to 2D.
	 *
	 * @param {boolean} value - Indicates whether shadow is on or off.
	 */
	Viewer3D.prototype.setGroundShadow = function(value) {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.setGroundShadow is not applicable to 2D");
			return;
		} else if(this.getMemoryInfo()) {
			zvp.logger.warn("Viewer3D.setGroundShadow is not available when memory is limited");
			return;
		}

		this.prefs.set('groundShadow', value);
		this.impl.toggleGroundShadow(value);
	};

	/**
	 * Toggles ground reflection.
	 *
	 * Not applicable to 2D.
	 *
	 * @param {boolean} value - Indicates whether reflection is on or off.
	 */
	Viewer3D.prototype.setGroundReflection = function(value) {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.setGroundReflection is not applicable to 2D");
			return;
		} else if(this.getMemoryInfo()) {
			zvp.logger.warn("Viewer3D.setGroundReflection is not available when memory is limited");
			return;
		}

		this.prefs.set('groundReflection', value);
		this.impl.toggleGroundReflection(value);
	};

	/**
	 * Toggles environment map for background.
	 *
	 * Not applicable to 2D.
	 *
	 * @param {boolean} value - Indicates whether environment map for background is on or off.
	 */
	Viewer3D.prototype.setEnvMapBackground = function(value) {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.setEnvMapBackground is not applicable to 2D");
			return;
		}

		this.prefs.set('envMapBackground', value);
		this.impl.toggleEnvMapBackground(value);
	};

	/**
	 * Toggles first person tool popup.
	 *
	 * Not applicable to 2D.
	 *
	 * @param {boolean} value - Indicates whether first person tool popup is showed or not.
	 */
	Viewer3D.prototype.setFirstPersonToolPopup = function(value) {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.setFirstPersonToolPopup is not applicable to 2D");
			return;
		}

		this.prefs.set('firstPersonToolPopup', value);
	};

	/**
	 * Returns the state of First Person Walk tool popup
	 *
	 * Not applicable to 2D.
	 *
	 * @returns {boolean} true if the First Person Walk tool popup appears, false if the First Person Walk tool popup does not appear.
	 */
	Viewer3D.prototype.getFirstPersonToolPopup = function() {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.getFirstPersonToolPopup is not applicable to 2D");
			return;
		}

		return this.prefs.firstPersonToolPopup;
	};

	/**
	 * Toggles the bimwalk tool popup.
	 *
	 * Not applicable to 2D.
	 *
	 * @param {boolean} value - Indicates whether first person tool popup is showed or not.
	 */
	Viewer3D.prototype.setBimWalkToolPopup = function(value) {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.setBimWalkToolPopup is not applicable to 2D");
			return;
		}

		this.prefs.set('bimWalkToolPopup', value);
	};

	/**
	 * Toggles the rendercache feature.
	 *
	 * Not applicable to 2D.
	 *
	 * @param {boolean} value - true if render cache is active, false if render cache is not active.
	 */
	Viewer3D.prototype.setRenderCache = function(value) {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.setRenderCache is not applicable to 2D");
			return;
		}

		this.impl.toggleVizBuffer(value);
		this.prefs.set('renderCache', value);
	};

	/**
	 * Returns the state of First Person Walk tool popup
	 *
	 * Not applicable to 2D.
	 *
	 * @returns {boolean} true if the First Person Walk tool popup appears, false if the First Person Walk tool popup does not appear.
	 */
	Viewer3D.prototype.getBimWalkToolPopup = function() {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.getBimWalkToolPopup is not applicable to 2D");
			return;
		}

		return this.prefs.bimWalkToolPopup;
	};

	/**
	 * Toggles whether progressive rendering is used. Warning: turning progressive rendering off
	 * will have serious performance implications.
	 * @param {boolean} value whether it is on or off
	 */
	Viewer3D.prototype.setProgressiveRendering = function(value) {
		this.prefs.set('progressiveRendering', value);
		this.impl.toggleProgressive(value);
	};

	/**
	 * AutoCAD drawings are commonly displayed with white lines on a black background. Setting reverse swaps (just)
	 * these two colors.
	 * @param {boolean} value whether it is on or off
	 */
	Viewer3D.prototype.setSwapBlackAndWhite = function(value) {
		this.prefs.set('swapBlackAndWhite', value);
		this.impl.toggleSwapBlackAndWhite(value);
	};

	/**
	 * Toggles whether the navigation should be optimized for performance. If set
	 * to true, anti-aliasing and ambient shadows will be off while navigating.
	 *
	 * Not applicable to 2D.
	 *
	 * @param {boolean} value whether it is on or off
	 */
	Viewer3D.prototype.setOptimizeNavigation = function(value) {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.setOptimizeNaviation is not applicable to 2D");
			return;
		}

		this.prefs.set('optimizeNavigation', value);
		this.impl.setOptimizeNavigation(value);
	};

	/**
	 * Locks or unlocks navigation controls.
	 *
	 * When navigation is locked, certain operations (for example, orbit, pan, or fit-to-view)
	 * are disabled.
	 *
	 * @param {boolean} value True if the navigation should be locked.
	 *
	 * @see {@link ZhiUTech.Viewing.Viewer3D#setNavigationLockSettings}
	 */
	Viewer3D.prototype.setNavigationLock = function(value) {
		if(this.navigation.getIsLocked() !== value) {
			this.navigation.setIsLocked(value);
			this.dispatchEvent({
				type: zv.NAVIGATION_MODE_CHANGED_EVENT,
				id: this.getActiveNavigationTool()
			});
		}
	};

	/**
	 * Gets the current state of the navigation lock.
	 * @returns {boolean} True if the navigation controls are currently locked.
	 */
	Viewer3D.prototype.getNavigationLock = function() {
		return this.navigation.getIsLocked();
	};

	/**
	 * Updates the configuration of the navigation lock,
	 * i.e., which actions are available when navigation is locked.
	 *
	 * The configurable actions are 'orbit', 'pan', 'zoom', 'roll', 'fov', 'walk', or 'gotoview'.
	 * By default, none of the actions are enabled when the navigation is locked.
	 *
	 * @param {object} settings Map of <action>:<boolean> pairs specifying
	 * whether the given action is *enabled* even when the navigation is locked.
	 *
	 * @see {@link ZhiUTech.Viewing.Viewer3D#setNavigationLock}
	 */
	Viewer3D.prototype.setNavigationLockSettings = function(settings) {
		this.navigation.setLockSettings(settings);
		this.dispatchEvent({
			type: zv.NAVIGATION_MODE_CHANGED_EVENT,
			id: this.getActiveNavigationTool()
		});
	};

	/**
	 * Gets the current configuration of the navigation lock.
	 *  @returns {object} Map of <action>:<boolean> pairs specifying
	 * whether the given action is *enabled* even when the navigation is locked.
	 */
	Viewer3D.prototype.getNavigationLockSettings = function() {
		return this.navigation.getLockSettings();
	};

	/**
	 * Swaps the current navigation tool for the tool with the provided name.
	 * Will trigger NAVIGATION_MODE_CHANGED event if the mode actually changes.
	 *
	 * @param {string} [toolName] - The name of the tool to activate. By default it will switch to the default tool.
	 *
	 * @returns {boolean} - True if the tool was set successfully. False otherwise.
	 *
	 * @see {@link Viewer3D#getActiveNavigationTool|getActiveNavigationTool()}
	 */
	Viewer3D.prototype.setActiveNavigationTool = function(toolName) {
		if(toolName === this._pushedTool || (!toolName && !this._pushedTool))
			return true;

		if(this._pushedTool) {
			if(!this.impl.controls.deactivateTool(this._pushedTool)) {
				return false;
			}

			// Need to reset the activeName of the default tool, since "orbit",
			// "freeorbit", "dolly" and "pan" share the same instance.
			this.impl.controls.setToolActiveName(this.getDefaultNavigationToolName());
			this._pushedTool = null;
		}

		var isDefault = !toolName || toolName === this.getDefaultNavigationToolName();

		if(isDefault && this._pushedTool === null) {
			this.dispatchEvent({
				type: zv.NAVIGATION_MODE_CHANGED_EVENT,
				id: this.getDefaultNavigationToolName()
			});
			return true;
		}

		if(this.impl.controls.activateTool(toolName)) {
			this._pushedTool = toolName;
			this.dispatchEvent({
				type: zv.NAVIGATION_MODE_CHANGED_EVENT,
				id: this._pushedTool
			});
			return true;
		}

		return false;
	};

	/**
	 * Returns the name of the active navigation tool.
	 * @returns {string} - The tool's name.
	 *
	 * @see {@link Viewer3D#setActiveNavigationTool|setActiveNavigationTool()}
	 */
	Viewer3D.prototype.getActiveNavigationTool = function() {
		return this._pushedTool ? this._pushedTool : this._defaultNavigationTool;
	};

	/**
	 * Sets the default navigation tool. This tool will always sit beneath the navigation tool on the tool stack.
	 *
	 * @param {string} toolName - The name of the new default navigation tool.
	 */
	Viewer3D.prototype.setDefaultNavigationTool = function(toolName) {
		if(this._defaultNavigationTool) {
			this.impl.controls.deactivateTool(this._defaultNavigationTool);
		}

		if(this._pushedTool) {
			this.impl.controls.deactivateTool(this._pushedTool);
		}

		this.impl.controls.activateTool(toolName);
		this._defaultNavigationTool = toolName;

		if(this._pushedTool) {
			this.impl.controls.activateTool(this._pushedTool);
		}
	};

	/**
	 * Returns the default navigation tool
	 *
	 * @returns {Object} - The default navigation tool.
	 */
	Viewer3D.prototype.getDefaultNavigationToolName = function() {
		return this._defaultNavigationTool;
	};

	/**
	 * Gets the current camera vertical field of view.
	 * @returns { number } - the field of view in degrees.
	 */
	Viewer3D.prototype.getFOV = function() {
		return this.navigation.getVerticalFov();
	};

	/**
	 * Sets the current cameras vertical field of view.
	 * @param { number } degrees - Field of view in degrees.
	 */
	Viewer3D.prototype.setFOV = function(degrees) {
		this.navigation.setVerticalFov(degrees, true);
	};

	/**
	 * Gets the current camera focal length.
	 * @returns { number } - the focal length in millimetres.
	 */
	Viewer3D.prototype.getFocalLength = function() {
		return this.navigation.getFocalLength();
	};

	/**
	 * Sets the current cameras focal length.
	 * @param { number } mm - Focal length in millimetres
	 */
	Viewer3D.prototype.setFocalLength = function(mm) {
		this.navigation.setFocalLength(mm, true);
	};

	/**
	 * Hides all lines in the scene.
	 * @param {boolean} hide
	 */
	Viewer3D.prototype.hideLines = function(hide) {
		this.prefs.set('lineRendering', !hide);
		var that = this;

		function onGeometryLoaded(e) {
			//Only hide lines on model load if hide is false -- the default
			//visibility for all objects should be true, so we don't need
			//to call in such case.
			if(hide)
				e.model.hideLines(hide);

			that.removeEventListener(zv.GEOMETRY_LOADED_EVENT, onGeometryLoaded);
		}

		if(!this.impl.hideLines(hide)) {
			this.addEventListener(zv.GEOMETRY_LOADED_EVENT, onGeometryLoaded);
		}
	};

	/**
	 * Hides all points in the scene.
	 * @param {boolean} hide
	 */
	Viewer3D.prototype.hidePoints = function(hide) {
		this.prefs.set('pointRendering', !hide);
		var that = this;

		function onGeometryLoaded(e) {
			//Only hide lines on model load if hide is false -- the default
			//visibility for all objects should be true, so we don't need
			//to call in such case.
			if(hide)
				e.model.hidePoints(hide);

			that.removeEventListener(zv.GEOMETRY_LOADED_EVENT, onGeometryLoaded);
		}

		if(!this.impl.hidePoints(hide)) {
			this.addEventListener(zv.GEOMETRY_LOADED_EVENT, onGeometryLoaded);
		}
	};

	/**
	 * Turns edge topology display on/off (where available)
	 * @param {boolean} show - true to turn edge topology display on, false to turn edge topology display off
	 */
	Viewer3D.prototype.setDisplayEdges = function(show) {
		this.prefs.set('edgeRendering', show);
		this.impl.setDisplayEdges(show);
	};

	/**
	 * @deprecated
	 * Applies the camera to the current viewer's camera.
	 * @param {THREE.Camera} camera - the camera to apply.
	 * @param {boolean} [fit=false] - Do a fit to view after transition.
	 */
	Viewer3D.prototype.applyCamera = function(camera, fit) {
		this.impl.setViewFromCamera(camera, true);
		if(fit)
			this.fitToView();
	};

	/**
	 * Fits camera to objects by ID. It fits the entire model if no ID is provided.
	 * Operation will fit to the model's bounding box when its object tree is not available.
	 * 
	 * @param {array| int} [objectIds] array of Ids, or null.
	 * @param {model} [model] - The model containing the ``objectIds``.
	 * @param {boolean} [immediate] - true to avoid the default transition.
	 */
	Viewer3D.prototype.fitToView = function(objectIds, model, immediate) {

		var selection = [];
		if(objectIds) {
			if(objectIds.length > 0 && objectIds[0].model) {
				// Aggregated selection being passed in.
				selection = objectIds;
			} else if(objectIds.length > 0) {
				// Backwards compatibility interface for single model.
				selection.push({
					model: (model || this.model),
					selection: objectIds
				});
			}
		}

		this.impl.fitToView(selection, immediate);
		// Event gets fired from `impl`   
	};

	/**
	 * Modifies a click action configuration entry.
	 * @param {string} what - which click config to modify (one of "click", "clickAlt", "clickCtrl", "clickShift", "clickCtrlShift").
	 * @param {string} where - hit location selector (one of "onObject", "offObject").
	 * @param {array|string} newAction - action list (containing any of "setCOI", "selectOnly", "selectToggle", "deselectAll", "deselectAll", "isolate", "showAll", "hide", "focus").
	 * @returns {boolean} False if specified entry is not found, otherwise true.
	 */
	Viewer3D.prototype.setClickConfig = function(what, where, newAction) {
		var config = this.clickHandler ? this.clickHandler.getClickBehavior() :
			this.impl.controls.getClickBehavior();

		if(what in config) {
			var actions = config[what];
			if(where in actions) {
				actions[where] = newAction;
				return true;
			}
		}
		return false;
	};

	/**
	 * Fetch a click action configuration entry.
	 * @param {string} what - which click config to fetch (one of "click", "clickAlt", "clickCtrl", "clickShift", "clickCtrlShift").
	 * @param {string} where - hit location selector (one of "onObject", "offObject").
	 * @returns {array} action list for the given entry or null if not found.
	 */
	Viewer3D.prototype.getClickConfig = function(what, where) {
		var config = this.clickHandler ? this.clickHandler.getClickBehavior() :
			this.impl.controls.getClickBehavior();

		if(what in config) {
			var actions = config[what];
			if(where in actions)
				return actions[where];
		}
		return null;
	};

	/**
	 * Modify the default click behaviour for the viewer.
	 * @param {boolean} state - If true the default is to set the center of interest. If false the default is single select.
	 * @param {boolean} [updatePrefs=true] - If true, the user preferences will be updated.
	 */
	Viewer3D.prototype.setClickToSetCOI = function(state, updatePrefs) {
		if(updatePrefs !== false)
			this.prefs.set('clickToSetCOI', state);

		var currentOn = this.getClickConfig("click", "onObject");
		if(state) {
			if(currentOn.indexOf("setCOI") === -1) // Not already set?
			{
				this.setClickConfig("click", "onObject", ["setCOI"]);
			}
		} else if(currentOn.indexOf("setCOI") >= 0) // Is currently set?
		{
			this.setClickConfig("click", "onObject", ["selectOnly"]);
		}
	};

	/**
	 * Initializes all gui settings to their defaults or to the session stored setting
	 * This gives session stored settings priority
	 */
	Viewer3D.prototype.initSettings = function() {

		this.prefs.load(zv.DefaultSettings);

		this.prefs.tag('3d');
		this.prefs.tag('2d');
		this.prefs.untag('2d', [ // 3d only
			'viewCube',
			'alwaysUsePivot',
			'zoomTowardsPivot',
			'reverseHorizontalLookDirection',
			'reverseVerticalLookDirection',
			'orbitPastWorldPoles',
			'clickToSetCOI',
			'ghosting',
			'optimizeNavigation',
			'renderCache',
			'ambientShadows',
			'antialiasing',
			'groundShadow',
			'groundReflection',
			'lineRendering',
			'edgeRendering',
			'lightPreset',
			'envMapBackground',
			'firstPersonToolPopup',
			'bimWalkToolPopup'
		]);
		this.prefs.untag('3d', [ // 2d only
			'swapBlackAndWhite'
		]);

		// Apply settings
		this.setQualityLevel(this.prefs.ambientShadows, this.prefs.antialiasing);
		this.setGroundShadow(this.prefs.groundShadow);
		this.setGroundReflection(this.prefs.groundReflection);
		this.setGhosting(this.prefs.ghosting);
		this.setProgressiveRendering(this.prefs.progressiveRendering);
		this.setSwapBlackAndWhite(this.prefs.swapBlackAndWhite);
		this.setClickToSetCOI(this.prefs.clickToSetCOI);
		this.setOptimizeNavigation(this.prefs.optimizeNavigation);
		this.hideLines(!this.prefs.lineRendering);
		this.hidePoints(!this.prefs.pointRendering);
		this.setDisplayEdges(this.prefs.edgeRendering);
		this.setEnvMapBackground(this.prefs.envMapBackground);
		this.setFirstPersonToolPopup(this.prefs.firstPersonToolPopup);
		this.setBimWalkToolPopup(this.prefs.bimWalkToolPopup);
		this.setRenderCache(this.prefs.renderCache);

		this.navigation.setUsePivotAlways(this.prefs.alwaysUsePivot);
		this.navigation.setReverseZoomDirection(this.prefs.reverseMouseZoomDir);
		this.navigation.setReverseHorizontalLookDirection(this.prefs.reverseHorizontalLookDirection);
		this.navigation.setReverseVerticalLookDirection(this.prefs.reverseVerticalLookDirection);
		this.navigation.setZoomTowardsPivot(this.prefs.zoomTowardsPivot);
		this.navigation.setOrbitPastWorldPoles(this.prefs.orbitPastWorldPoles);
		this.navigation.setUseLeftHandedInput(this.prefs.leftHandedMouseSetup);

		var bacStr = this.prefs.backgroundColorPreset;
		if(bacStr) {
			try {
				var bac = JSON.parse(bacStr);
				this.impl.setClearColors(bac[0], bac[1], bac[2], bac[3], bac[4], bac[5]);
			} catch(e) {
				this.prefs.set("backgroundColorPreset", null);
			}
		}

		// done last, so that if the environment has a background color, it
		// overrides any previous background color preference.
		var lightPreset = /*viewer.model.is2d() ? zvp.DefaultLightPreset2d :*/ this.prefs.lightPreset;
		this.impl.setLightPreset(lightPreset);
	};

	/**
	 * Sets the Light Presets (Environments) for the Viewer.
	 *
	 * Not applicable to 2D.
	 *
	 * Sets the preference in the UI
	 * @param {Number} index - where
	 * - 0 Simple Grey
	 * - 1 Sharp Highlights
	 * - 2 Dark Sky
	 * - 3 Grey Room
	 * - 4 Photo Booth
	 * - 5 Tranquility
	 * - 6 Infinity Pool
	 * - 7 Simple White
	 * - 8 Riverbank
	 * - 9 Contrast
	 * - 10 Rim Highlights
	 * - 11 Cool Light
	 * - 12 Warm Light
	 * - 13 Soft Light
	 * - 14 Grid Light
	 * - 15 Plaza
	 * - 16 Snow Field
	 * @note this list is copied from the ones in Environments.js
	 */

	Viewer3D.prototype.setLightPreset = function(index) {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.setLightPreset is not applicable to 2D");
			return;
		}

		this.prefs.set('lightPreset', index);

		this.impl.setLightPreset(index);
	};

	/**
	 *  Set or unset a view navigation option which requests that orbit controls always orbit around the currently set pivot point.
	 *
	 *  Sets the preference in the UI
	 *  @param {boolean} value - value of the option, true to request use of the pivot point. When false some controls may pivot around the center of the view. (Currently applies only to the view-cube orbit controls.)
	 */
	Viewer3D.prototype.setUsePivotAlways = function(value) {
		this.prefs.set('alwaysUsePivot', value);
		this.navigation.setUsePivotAlways(value);
	};

	/**
	 * Set or unset a view navigation option to reverse the default direction for camera dolly (zoom) operations.
	 *
	 *  Sets the preference in the UI
	 *  @param {boolean} value - value of the option, true for reverse, false for default
	 */
	Viewer3D.prototype.setReverseZoomDirection = function(value) {
		this.prefs.set('reverseMouseZoomDir', value);
		this.navigation.setReverseZoomDirection(value);
	};

	/**
	 * Set or unset a view navigation option to reverse the default direction for horizontal look operations.
	 *
	 * Not applicable to 2D.
	 *
	 *  Sets the preference in the UI
	 *  @param {boolean} value - value of the option, true for reverse, false for default
	 */
	Viewer3D.prototype.setReverseHorizontalLookDirection = function(value) {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.setReverseHorizontalLookDirection is not applicable to 2D");
			return;
		}

		this.prefs.set('reverseHorizontalLookDirection', value);
		this.navigation.setReverseHorizontalLookDirection(value);
	};

	/**
	 * Set or unset a view navigation option to reverse the default direction for vertical look operations.
	 *
	 * Not applicable to 2D.
	 *
	 *  Sets the preference in the UI
	 *  @param {boolean} value - value of the option, true for reverse, false for default
	 */
	Viewer3D.prototype.setReverseVerticalLookDirection = function(value) {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.setReverseVerticalLookDirection is not applicable to 2D");
			return;
		}

		this.prefs.set('reverseVerticalLookDirection', value);
		this.navigation.setReverseVerticalLookDirection(value);
	};

	/**
	 * Get the state of the view navigation option that requests the default direction for camera dolly (zoom) operations to be towards the camera pivot point.
	 *
	 *  Sets the preference in the UI
	 *  @param {boolean} value - value of the option, true for towards the pivot, false for default
	 */
	Viewer3D.prototype.setZoomTowardsPivot = function(value) {
		this.prefs.set('zoomTowardsPivot', value);
		this.navigation.setZoomTowardsPivot(value);
	};

	/**
	 * Set or unset a view navigation option to allow the orbit controls to move the camera beyond the north and south poles (world up/down direction). In other words, when set the orbit control will allow the camera to rotate into an upside down orientation. When unset orbit navigation should stop when the camera view direction reaches the up/down direction.
	 *
	 * Not applicable to 2D.
	 *
	 *  Sets the preference in the UI
	 *  @param {boolean} value - value of the option, true to allow orbiting past the poles.
	 */
	Viewer3D.prototype.setOrbitPastWorldPoles = function(value) {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.setOrbitPastWorldPoles is not applicable to 2D");
			return;
		}

		this.prefs.set('orbitPastWorldPoles', value);
		this.navigation.setOrbitPastWorldPoles(value);
	};

	/**
	 * Set or unset a view navigation option which requests that mouse buttons be reversed from their default assignment. i.e. Left mouse operation becomes right mouse and vice versa.
	 *
	 *  Sets the preference in the UI
	 *  @param {boolean} value - value of the option, true to request reversal of mouse button assignments.
	 */
	Viewer3D.prototype.setUseLeftHandedInput = function(value) {
		this.prefs.set('leftHandedMouseSetup', value);
		this.navigation.setUseLeftHandedInput(value);
	};

	/**
	 * Set visibility for a single layer, or for all layers.
	 *
	 * @param {?Array} nodes - An array of layer nodes, or a single layer node, or null for all layers
	 * @param {boolean} visible - true to show the layer, false to hide it
	 * @param {boolean=} [isolate] - true to isolate the layer
	 */
	Viewer3D.prototype.setLayerVisible = function(nodes, visible, isolate) {

		var layers = this.impl.layers;
		if(nodes === null) {
			if(visible) {
				layers.showAllLayers();
			} else {
				layers.hideAllLayers();
			}
		} else {

			if(!Array.isArray(nodes)) {
				nodes = [nodes];
			}

			if(isolate) {
				layers.hideAllLayers();
			}

			this.impl.setLayerVisible(nodes, visible);
		}
		this.dispatchEvent({
			type: zv.LAYER_VISIBILITY_CHANGED_EVENT
		});
	};

	/**
	 * Returns true if the layer is visible.
	 *
	 * @param {Object} node - Layer node
	 * @returns {boolean} true if the layer is visible
	 */
	Viewer3D.prototype.isLayerVisible = function(node) {
		return !!(node && node.isLayer && this.impl.isLayerVisible(node));
	};

	/**
	 * Returns true if any layer is hidden.
	 * 
	 * @returns {boolean} true if any layer is hidden
	 */
	Viewer3D.prototype.anyLayerHidden = function() {

		var layers = this.impl.getLayersRoot().children;
		var layersCount = layers.length;

		for(var i = 0; i < layersCount; ++i) {
			if(!this.impl.layers.isLayerVisible(layers[i])) {
				return true;
			}
		}

		return false;
	};

	/**
	 * Returns true if all layers are hiden.
	 * 
	 * @returns {boolean} true if all layers are hidden
	 */
	Viewer3D.prototype.allLayersHidden = function() {

		var layers = this.impl.getLayersRoot().children;
		var layersCount = layers.length;

		for(var i = 0; i < layersCount; ++i) {
			if(this.impl.layers.isLayerVisible(layers[i])) {
				return false;
			}
		}

		return true;
	};

	/**
	 * If enabled, set ground shadow color
	 *
	 * Not applicable to 2D
	 *
	 * @param {THREE.Color} color
	 */
	Viewer3D.prototype.setGroundShadowColor = function(color) {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.setGroundShadowColor is not applicable to 2D");
			return;
		}

		this.impl.setGroundShadowColor(color);
	};

	/**
	 * If enabled, set ground shadow alpha
	 *
	 * Not applicable to 2D
	 *
	 * @param {float} alpha
	 */
	Viewer3D.prototype.setGroundShadowAlpha = function(alpha) {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.setGroundShadowAlpha is not applicable to 2D");
			return;
		}

		this.impl.setGroundShadowAlpha(alpha);
	};

	/**
	 * If enabled, set ground reflection color. This is reset to default when reflections toggled off.
	 *
	 * Not applicable to 2D
	 *
	 * @param {THREE.Color} color
	 */
	Viewer3D.prototype.setGroundReflectionColor = function(color) {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.setGroundReflectionColor is not applicable to 2D");
			return;
		}

		this.impl.setGroundReflectionColor(color);
	};

	/**
	 * If enabled, set ground reflection alpha. This is reset to default when reflections toggled off.
	 *
	 * Not applicable to 2D
	 *
	 * @param {float} alpha
	 */
	Viewer3D.prototype.setGroundReflectionAlpha = function(alpha) {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.setGroundReflectionAlpha is not applicable to 2D");
			return;
		}

		this.impl.setGroundReflectionAlpha(alpha);
	};

	/**
	 * Returns a list of active cut planes
	 *
	 * Not applicable to 2D
	 *
	 * @return {THREE.Vector4[]} List of Vector4 plane representation {x:a, y:b, z:c, w:d}
	 */
	Viewer3D.prototype.getCutPlanes = function() {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.getCutPlanes is not applicable to 2D");
			return [];
		}

		return this.impl.getCutPlanes();
	};

	/**
	 * Apply a list of cut planes
	 *
	 * Not applicable to 2D
	 *
	 * @param {THREE.Vector4[]} planes - List of Vector4 plane representation: {x:a, y:b, z:c, w:d}
	 * Plane general equation: ax + by + cz + d = 0 where a, b, and c are not all zero
	 * Passing an empty list or null is equivalent to setting zero cut planes
	 */
	Viewer3D.prototype.setCutPlanes = function(planes) {
		if(this.model && this.model.is2d()) {
			zvp.logger.warn("Viewer3D.getCutPlanes is not applicable to 2D");
			return;
		}

		this.impl.setCutPlanes(planes);
	};

	/**
	 * Captures the current screen image as Blob URL
	 * Blob URL can be used like a regular image url (e.g., window.open, img.src, etc)
	 * If width and height are 0, returns asynchronously and calls the callback with an image as Blob URL with dimensions equal to current canvas dimensions
	 * If width and height are given, returns asynchronously and calls the callback with the resized image as Blob URL
	 * If no callback is given, displays the image in a new window.<br>
	 * See also [getScreenShotBuffer()]{@link ZhiUTech.Viewing.Viewer3D#getScreenShotBuffer}.
	 * @param  {int}      [w]  width of the requested image
	 * @param  {int}      [h]  height of the requested image
	 * @param  {Function} [cb] callback
	 * @return {DOMString}     screenshot image Blob URL, if no parameters are given
	 */
	Viewer3D.prototype.getScreenShot = function(w, h, cb) {
		return this.impl.getScreenShot(w, h, cb);
	};

	/**
	 * Alternative call to [getScreenShot()]{@link ZhiUTech.Viewing.Viewer3D#getScreenShot}
	 * which internally uses additional steps (more processing) to generate the screenshot.
	 * @param  {int}      [w]  width of the requested image
	 * @param  {int}      [h]  height of the requested image
	 * @param  {Function} [cb] callback
	 */
	Viewer3D.prototype.getScreenShotBuffer = function(w, h, cb) {
		return this.impl.getScreenShotBuffer(w, h, cb);
	};

	/**
	 * Sets the object context menu.
	 * @param {?ObjectContextMenu=} [contextMenu]
	 */
	Viewer3D.prototype.setContextMenu = function(contextMenu) {

		if(this.contextMenu) {

			// Hide the current context menu, just in case it's open right now.
			// This does nothing if the context menu is not open.
			//
			this.contextMenu.hide();
		}

		this.contextMenu = contextMenu || null; // to avoid undefined
	};

	/**
	 * Activates the default context menu.<br>
	 * Contains options Isolate, Hide selected, Show all objects, Focus and Clear selection.
	 *
	 * @returns {boolean} Whether the default context menu was successfully set (true) or not (false)
	 */
	Viewer3D.prototype.setDefaultContextMenu = function() {

		var ave = ZhiUTech.Viewing.Extensions;
		if(ave && ave.ViewerObjectContextMenu) {
			this.setContextMenu(new ave.ViewerObjectContextMenu(this));
			return true;
		}
		return false;
	};

	Viewer3D.prototype.triggerContextMenu = function(event) {
		if(this.config && this.config.onTriggerContextMenuCallback) {
			this.config.onTriggerContextMenuCallback(event);
		}

		if(this.contextMenu) {
			this.contextMenu.show(event);
			return true;
		}
		return false;
	};

	Viewer3D.prototype.triggerSelectionChanged = function(dbId) {
		if(this.config && this.config.onTriggerSelectionChangedCallback) {
			this.config.onTriggerSelectionChangedCallback(dbId);
		}
	};

	Viewer3D.prototype.triggerDoubleTapCallback = function(event) {
		if(this.config && this.config.onTriggerDoubleTapCallback) {
			this.config.onTriggerDoubleTapCallback(event);
		}
	};

	Viewer3D.prototype.triggerSingleTapCallback = function(event) {
		if(this.config && this.config.onTriggerSingleTapCallback) {
			this.config.onTriggerSingleTapCallback(event);
		}
	};

	Viewer3D.prototype.initContextMenu = function() {

		// Disable the browser's default context menu by default, or if explicitly specified.
		//
		var disableBrowserContextMenu = !this.config || (this.config.hasOwnProperty("disableBrowserContextMenu") ? this.config.disableBrowserContextMenu : true);
		if(disableBrowserContextMenu) {
			this.onDefaultContextMenu = function(e) {
				e.preventDefault();
			};
			this.container.addEventListener('contextmenu', this.onDefaultContextMenu, false);
		}

		var self = this;

		var canvas = this.canvas || this.container;

		canvas.addEventListener('mousedown',
			function(event) {
				if(zvp.isRightClick(event, self.navigation)) {
					self.startX = event.clientX;
					self.startY = event.clientY;
				}
			});

		canvas.addEventListener('mouseup',
			function(event) {
				if(zvp.isRightClick(event, self.navigation) && event.clientX === self.startX && event.clientY === self.startY) {
					self.triggerContextMenu(event);
				}
				return true;
			}, false);
	};

	/**
	 * Registers a new callback that modifies the context menu.
	 * This allows extensions and others to add, remove, or change items in the context menu.
	 * Extensions that call registerContextMenuCallback() should call unregisterContextMenuCallback() in their unload().
	 * @param {string} id - Unique id to identify this callback. Used by unregisterContextMenuCallback().
	 * @param {function(Array, Object)} callback - Will be called before the context menu is displayed.
	 * @see Viewer.unregisterContextMenuCallback
	 * @see ObjectContextMenu.buildMenu
	 *
	 * @example
	 * // Here's an example that appends a new context menu item:
	 *
	 * viewer.registerContextMenuCallback('MyExtensionName', function (menu, status) {
	 *     if (status.hasSelected) {
	 *         menu.push({
	 *             title: 'My new context menu item with selected objects',
	 *             target: function () {
	 *                 alert('Do something with selected objects');
	 *         }});
	 *     } else {
	 *         menu.push({
	 *             title: 'My new context menu item, no selected objects',
	 *             target: function () {
	 *                 alert('Do something else');
	 *         }});
	 *     }
	 * });
	 */
	Viewer3D.prototype.registerContextMenuCallback = function(id, callback) {
		this.contextMenuCallbacks[id] = callback;
	};

	/**
	 * Unregisters an existing callback that modifies the context menu.
	 * Extensions that call registerContextMenuCallback() should call unregisterContextMenuCallback() in their unload().
	 * @param {string} id - Unique id to identify this callback.
	 * @returns {boolean} true if the callback was unregistered successfully.
	 * @see Viewer.registerContextMenuCallback
	 */
	Viewer3D.prototype.unregisterContextMenuCallback = function(id) {
		if(id in this.contextMenuCallbacks) {
			delete this.contextMenuCallbacks[id];
			return true;
		}
		return false;
	};

	/**
	 * Runs all registered context menu callbacks.
	 * @param {array} menu - Context menu items.
	 * @param {Object} status - Information about nodes.
	 * @see ObjectContextMenu.buildMenu
	 * @private
	 */
	Viewer3D.prototype.runContextMenuCallbacks = function(menu, status) {
		for(var id in this.contextMenuCallbacks) {
			if(this.contextMenuCallbacks.hasOwnProperty(id)) {
				this.contextMenuCallbacks[id](menu, status);
			}
		}
	};

	/**
	 * Play animation if animation data is available as part of model data.
	 * If the model data does not contain any animation, this function call is a no op.
	 * @param  {Function} [callback] Callback function that would be invoked at each frame of the animation.
	 * The callback function takes a single input value, with value range between 0 and 100, inclusive, with value
	 * 100 indicates the animation has finished playing.
	 * @example
	 * Here is an example of callback function.
	 * function(value) {
	 *     if (value < 100)
	 *         console.log("Animation progress: " + value + "%.");
	 *     else
	 *         console.log("Animation finished.");
	 * }
	 */
	Viewer3D.prototype.playAnimation = function(callback) {
		var animator = this.impl.keyFrameAnimator;
		if(animator) {
			animator.play(0, callback);
		}
	};

	/**
	 * Join a live review session.
	 *
	 * @param {string} [sessionId] - The live review session id to join.
	 */
	Viewer3D.prototype.joinLiveReview = function(sessionId) {
		if(!this.liveReviewClient) {
			this.liveReviewClient = new zvp.LiveReviewClient(this);
		}

		var liveReviewClient = this.liveReviewClient;
		zvp.loadDependency("lmv_io", "socket.io-1.3.5.js", function() {
			liveReviewClient.joinLiveReviewSession(sessionId);
		});
	};

	/**
	 * Leave a live review session.
	 */
	Viewer3D.prototype.leaveLiveReview = function() {
		if(this.liveReviewClient) {
			this.liveReviewClient.leaveLiveReviewSession();
		}
	};

	/**
	 * Set model units
	 * @param Model units
	 */
	Viewer3D.prototype.setModelUnits = function(modelUnits) {
		if(this.model) {
			this.model.getData().overriddenUnits = modelUnits;
		}
	};

	/**
	 * Calculates the pixel position in client space coordinates of a point in world space.<br>
	 * See also
	 * [clientToWorld()]{@link ZhiUTech.Viewing.Viewer3D#clientToWorld}.
	 * @param {THREE.Vector3} point Point in world space coordinates.
	 * @returns {THREE.Vector3} Point transformed and projected into client space coordinates. Z value is 0.
	 */
	Viewer3D.prototype.worldToClient = function(point) {
		return this.impl.worldToClient(point);
	};

	/**
	 * Given coordinates in pixel screen space it returns information of the underlying geometry node.
	 * Hidden nodes will not be taken into account. Returns null if there is no geometry in the specified location.
	 * For 2d models, it will return null outside the paper.<br>
	 * See also
	 * [worldToClient()]{@link ZhiUTech.Viewing.Viewer3D#worldToClient}.
	 *
	 * @param {Number} clientX - X coordinate where 0 is left
	 * @param {Number} clientY - Y coordinate where 0 is top
	 * @param {Boolean} [ignoreTransparent] - Ignores transparent materials
	 * @returns {Object|null} contains point attribute. 3d models have additional attributes.
	 */
	Viewer3D.prototype.clientToWorld = function(clientX, clientY, ignoreTransparent) {

		return this.impl.clientToWorld(clientX, clientY, ignoreTransparent);
	};

	/**
	 * Expose if the model has topology information downloaded.
	 * Only applicable to 3D models.
	 * @returns {boolean} value - Indicates whether the model has topology information.
	 */
	Viewer3D.prototype.modelHasTopology = function() {

		if(this.model && this.model.hasTopology()) {
			return true;
		}

		return false;
	};

	/**
	 * Changes the color of the selection for a particular selection type.
	 * 
	 * @example
	 *  viewer.setSelectionColor(new THREE.Color(0xFF0000)); // red color
	 * @param {THREE.Color} color
	 */
	Viewer3D.prototype.setSelectionColor = function(color, selectionType) {
		this.impl.setSelectionColor(color, selectionType);
	};

	/**
	 * Create ViewCube.
	 */
	Viewer3D.prototype.createViewCube = function() {

		if(!this.viewCubeUi) {
			this.viewCubeUi = new zvp.ViewCubeUi(this);
			this.viewCubeUi.create();
		}
	};

	/**
	 * Display ViewCube.
	 * @param {boolean} display - Display or hide the ViewCube.
	 */
	Viewer3D.prototype.displayViewCube = function(display) {

		if(this.viewCubeUi) {
			this.viewCubeUi.displayViewCube(display, false);
		}
	};

	/**
	 * Display ViewCube.
	 * @param {boolean} display - Display or hide the ViewCube with home and info buttons.
	 */
	Viewer3D.prototype.displayViewCubeUI = function(display) {

		if(this.viewCubeUi) {
			this.viewCubeUi.setVisible(display);
		}
	};

	/**
	 * Set the face of ViewCube and apply camera transformation according to it.
	 * @param {string} face - The face name of ViewCube. The name can contain multiple face names,
	 * the format should be `"[front/back], [top/bottom], [left/right]"`.
	 */
	Viewer3D.prototype.setViewCube = function(face) {

		if(this.viewCubeUi && this.viewCubeUi.cube) {
			this.viewCubeUi.cube.cubeRotateTo(face);
		}
	};

	/**
	 * Sets the current UI theme of the viewer.
	 * @param {string} name - Name of the theme, it will be added to the viewer's container class list.
	 */
	Viewer3D.prototype.setTheme = function(name) {

		var classList = this.container.classList;

		// Remove previous themes.
		for(var i = 0; i < classList.length; ++i) {
			var index = classList[i].indexOf('-theme');
			if(index !== -1) {
				classList.remove(classList[i--]);
			}
		}

		// Set current theme.
		classList.add(name);
	}

	/**
	 * Highlight an object with a theming color that is blended with the original object's material.
	 * @param {number} dbId
	 * @param {THREE.Vector4} color - (r, g, b, intensity), all in [0,1].
	 * @param {ZhiUTech.Viewing.RenderModel} [model] - For multi-model support.
	 */
	Viewer3D.prototype.setThemingColor = function(dbId, color, model) {
		// use default RenderModel by default
		model = model || this.model;

		model.setThemingColor(dbId, color);

		// we changed the scene to apply theming => trigger re-render
		this.impl.invalidate(true);
	};

	/**
	 * Restore original colors for all themed shapes.
	 * @param {ZhiUTech.Viewing.RenderModel} [model] - For multi-model support.
	 */
	Viewer3D.prototype.clearThemingColors = function(model) {
		// use default RenderModel by default
		model = model || this.model;

		model.clearThemingColors();

		// we changed the scene to apply theming => trigger re-render
		this.impl.invalidate(true);
	};

	/**
	 * Transfer model from this viewer to another one - including state of selection, ghosting, and theming.
	 */
	Viewer3D.prototype.transferModel = function(modelId, viewer) {

		var model = this.impl.findModel(modelId);
		if(!model) {
			// unknown modeId
			return;
		}

		// collect all selected db ids for this model
		var selectedIds = [];
		this.getAggregateSelection(function(model, dbId) {
			if(model.id == modelId) {
				selectedIds.push(dbId);
			}
		});

		// collect isolated/hidden nodes
		var isolatedIds = this.impl.visibilityManager.getIsolatedNodes(model);
		var hiddenIds = this.impl.visibilityManager.getHiddenNodes(model);

		// export all materials and textures to MaterialManager of the other viewer
		// Note: Getting the materials from MaterialManager directly is the safest way for consistent state between both viewers.
		// E.g., enumerating the materials of the RenderModel instead would not work for 2 reasons:
		//  a) If the model is still loading, some materials would get lost: SvfLoader adds all materials in onModelRootLoadDone() already.
		//     But, RenderModel only knows materials for meshes that have been already loaded.
		//  b) The material hashes are only known to MaterialManager
		var modelMaterials = this.impl.matman().exportModelMaterials(model);

		// The unloadModel() call below also stops/destroys the model loader. Normally, this is wanted. Just in this case,
		// we want to keep the loader alive, so that the other viewer can load the rest of the model. Therefore,
		// we temporarily decouple it from the model and attach it again after transferring the model.
		var loader = model.loader;
		model.loader = null;

		// detach model from this viewer and discard all GPU resources.
		this.impl.unloadModel(model);

		// re-attach loader to model
		model.loader = loader;

		// pass model to other viewer
		viewer.model = model;
		viewer.impl.addModel(model);

		// import materials to new viewer
		// Note that it is essential to do export/import of materials in separate steps:
		//  - Exporting materials must be done before removing the model. After removeModel(),
		//    MaterialManager would not contain the material of this model anymore.
		//  - Importing materials must be done after adding the model to make sure that everything is properly initialized.
		//    E.g., the layerTexture would not be initialized otherwise.
		viewer.impl.matman().importModelMaterials(modelMaterials);

		// if the other viewer had no model before, make sure that the loadSpinner disappears.
		if(viewer.loadSpinner) {
			viewer.loadSpinner.style.display = "None";
		}

		// link running loader to new viewer
		if(loader) {
			if(loader.delegate && loader.delegate.eventTarget === this) {
				loader.transferToDelegate(viewer.impl._loaderDelegate);
			} else if(loader.zuv3DImpl === this.impl) {
				loader.zuv3DImpl = viewer.impl;
			}
		}

		// if model is still loading, the worker will call onLoadComplete later. If the model is still loaded,
		// we do it immediately.
		if(model.getData().loadDone) {
			viewer.impl.onLoadComplete(model);
		}

		// recover selection
		viewer.impl.selector.setSelection(selectedIds, model);

		// recover isolated/hidden nodes (Note that hiddenIds are only used if no node is isolated)
		if(isolatedIds.length != 0) viewer.impl.visibilityManager.isolate(isolatedIds, model);
		else if(hiddenIds.length != 0) viewer.impl.visibilityManager.hide(hiddenIds, model);
	};

	/**
	 * Temporarily remove a model from the Viewer, but keep loaders, materials, and geometry alive.
	 *
	 * @param modelId
	 * @returns {boolean} true indicates success, i.e., modelId referred to a visible model that is now hidden
	 */
	Viewer3D.prototype.hideModel = function(modelId) {

		// find visible model with this id
		var scene = this.impl.modelQueue();
		var model = scene.findModel(modelId);
		if(!model) {
			return false;
		}

		// remove model from viewer - but without discarding materials
		this.impl.removeModel(model);

		// make this model available for later showModel() calls
		scene.addHiddenModel(model);

		// Keep this.model in-sync. We should eliminate this.model to avoid that.
		this.model = this.impl.model;

		return true;
	};

	/**
	 * Make a previously hidden model visible again.
	 *
	 * @param modelId
	 * @returns {boolean} true indicates success, i.e., ``modelId`` referred to a hidden model that is now visible
	 */
	Viewer3D.prototype.showModel = function(modelId) {

		var scene = this.impl.modelQueue();
		var model = scene.findHiddenModel(modelId);
		if(!model) {
			// modelId does not refer to any hidden model
			return false;
		}

		// remove model from list of hidden ones
		scene.removeHiddenModel(model);

		// add it to the viewer.
		this.impl.addModel(model);

		// Keep this.model in-sync. We should eliminate this.model to avoid that.
		this.model = this.impl.model;

		return true;
	};

	/**
	 * @returns {RenderModel[]}
	 */
	Viewer3D.prototype.getHiddenModels = function() {
		var scene = this.impl.modelQueue();
		return scene.getHiddenModels();
	};

	/**
	 * Get the memory stats when using on demand loading.
	 * @returns {object|null} Object containing the total limit and total loaded memory usage for all models.
	 *                        Return null if no model is being loaded on demand.
	 */
	Viewer3D.prototype.getMemoryInfo = function() {
		var q = this.impl.modelQueue();
		return q ? q.getMemoryInfo() : null;
	};

	/**
	 * @private
	 */
	Viewer3D.prototype.onResetEvent = function() {
		var model = this.model;
		this.impl.setupLighting(model);
		if(model.isAEC() && model.is3d()) {
			this.impl.setLightPresetForAec();
		}

		this.impl.setRenderingPrefsFor2D(!model.is3d());

	};

	/**
	 * disable mouse-over highlight.
	 * @param {boolean} disable - Indicates whether highlighting should be on or off. True to disable highlights, false to enable them.
	 */

	Viewer3D.prototype.disableHighlight = function(disable) {
		this.impl.disableHighlight(disable);
	};

	/**
	 * disable the selection of a loaded model.
	 * @param {boolean} disable - true to disable selection, false to enable selection.
	 */

	Viewer3D.prototype.disableSelection = function(disable) {
		if(disable) {
			this.clearSelection();
		}
		this.impl.disableSelection(disable);
	};

	/**
	 * check if the mouse-over highlight is disabled or not
	 */

	Viewer3D.prototype.isHighlightDisabled = function() {
		return this.impl.selector.highlightDisabled;
	};

	/**
	 * check if the mouse-over highlight is paused or not
	 */

	Viewer3D.prototype.isHighlightPaused = function() {
		return this.impl.selector.highlightPaused;
	};

	/**
	 * check if the mouse-over highlight is active or not
	 */

	Viewer3D.prototype.isHighlightActive = function() {
		return !(this.impl.selector.highlightDisabled || this.impl.selector.highlightPaused);
	};

	/**
	 * check if the selection of the loaded model is disabled or not
	 */

	Viewer3D.prototype.isSelectionDisabled = function() {
		return this.impl.selector.selectionDisabled;
	};

	/** Get editor for a model
	 * @param model The model to be edited. Uses this.model if model is falsey.
	 * @see WGS.ModelEditor for editor API
	 */

	Viewer3D.prototype.editModel = function(model) {
		// Assignment is intended here.
		if(!model && !(model = this.model)) {
			return;
		}

		if(!model._modelEditor) {
			model._modelEditor = new WGS.ModelEditor(model, this, this.impl.matman(), zvp.initLoadContext, this.impl.glrenderer());
		}

		return model._modelEditor;

	};

	/**
	 * Activates the extension based on the extensionID and mode given. By default it takes the first available mode in getmodes();
	 * @param extensionID
	 * @param mode
	 */
	Viewer3D.prototype.activateExtension = function(extensionID, mode) {
		if(this.loadedExtensions && extensionID in this.loadedExtensions) {
			var extension = this.loadedExtensions[extensionID];
			return extension.activate(mode);
		} else {
			zvp.logger.warn("Extension is not loaded or doesn't exist");
			return false;
		}
	};

	/**
	 * Dectivates the extension based on the extensionID specified.
	 * @param extensionID
	 */
	Viewer3D.prototype.deactivateExtension = function(extensionID) {
		if(this.loadedExtensions && extensionID in this.loadedExtensions) {
			var extension = this.loadedExtensions[extensionID];
			return extension.deactivate();
		} else {
			zvp.logger.warn("Extension is not loaded or doesn't exist");
			return false;
		}
	};

	/**
	 * Check if the extension is active or not by passing the extensionID.
	 * @param extensionID
	 * @param mode
	 */
	Viewer3D.prototype.isExtensionActive = function(extensionID, mode) {
		if(this.loadedExtensions && extensionID in this.loadedExtensions) {
			var extension = this.loadedExtensions[extensionID];
			var activeStatus = extension.isActive(mode);
			return activeStatus;

		} else {
			zvp.logger.warn("Extension is not loaded or doesn't exist");
			return false;
		}
	};

	/**
	 * Check if the extension is loaded or not by passing the extensionID.
	 * @param extensionID
	 */
	Viewer3D.prototype.isExtensionLoaded = function(extensionID) {
		return this.loadedExtensions && extensionID in this.loadedExtensions;
	};

	/**
	 * Get a list of all the extensions that are currently loaded.
	 * @returns {null}
	 */
	Viewer3D.prototype.getLoadedExtensions = function() {
		return this.loadedExtensions || [];
	};

	/**
	 * Get a list of all the modes that are available for the given extensionID.
	 * @param extensionID
	 */
	Viewer3D.prototype.getExtensionModes = function(extensionID) {
		if(this.loadedExtensions && extensionID in this.loadedExtensions) {
			var extension = this.loadedExtensions[extensionID];
			return extension.getModes();
		} else {
			console.warn("Extension is not loaded or doesn't exist");
			return [];
		}
	};

	ZhiUTech.Viewing.Viewer3D = Viewer3D;

})();;