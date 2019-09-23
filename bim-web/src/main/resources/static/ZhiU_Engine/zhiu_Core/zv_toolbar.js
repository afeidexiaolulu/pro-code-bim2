
(function() {

	"use strict";

	var zv = ZhiUTech.Viewing;
	var zvp = ZhiUTech.Viewing.Private;

	/**
	 * Wrapper application for the viewer component.
	 *
	 * Attaches ViewingApplication to a div by ID and initializes common properties
	 * of the viewing application.
	 *
	 * @alias ZhiUTech.Viewing.ViewingApplication
	 * @param {string} containerId - The ID of the main container.
	 * @param {object} [options] - An optional dictionary of options.
	 * @param {boolean} [options.disableBrowserContextMenu=true] - Disables the browser's default context menu.
	 * @constructor
	 * @category Core
	 */
	var ViewingApplication = function(containerId, options) {
		this.appContainerId = containerId;
		this.container = document.getElementById(containerId);
		this.options = options || {};
		this.myRegisteredViewers = {};
		this.myDocument = null; // Deprecated. Keep around but don't use it.
		this.bubble = null; // Replacement for `myDocument`
		this.myCurrentViewer = null;
		this.urn = null;
		this.selectedItem = null;
		this.extensionCache = {}; // Cache for extensions to use for themselves

		var self = this;
		this.onHyperlinkHit = function(event) {
			var item = event.data.item;
			if(item) {
				self.selectItem(item);
			}
		};

		this.onLoadGeometry = function(event) {
			var data = event.data;
			self.selectItem(data.item, data.onSuccessCb, data.onErrorCb);
		}
	};

	/**
	 * Defines the 3D viewer type.
	 */
	ViewingApplication.prototype.k3D = '3D';

	/**
	 * Performs any necessary cleanup to allow the object to be garbage collected.
	 */
	ViewingApplication.prototype.finish = function() {
		if(this.myCurrentViewer) {
			this.myCurrentViewer.finish();
			this.myCurrentViewer = null;
		}
	};

	/**
	 * Register a Viewer to be used with this ViewingApplication.
	 *
	 * @param {number} viewableType - Currently must be ViewingApplication.k3D.
	 * @param {*} viewerClass
	 * @param {*} config
	 */
	ViewingApplication.prototype.registerViewer = function(viewableType, viewerClass, config) {

		if(viewableType !== this.k3D) {
			zvp.logger.error("The only acceptable viewer type is k3D.", zv.errorCodeString(zv.ErrorCodes.VIEWER_INTERNAL_ERROR));
			return;
		}

		// Pass the disableBrowserContextMenu option down to the viewer config.
		//
		config = config || {};
		if(this.options && this.options.hasOwnProperty("disableBrowserContextMenu")) {
			// Don't override if the option was already explicitly specified.
			//
			if(!config.hasOwnProperty("disableBrowserContextMenu")) {
				config.disableBrowserContextMenu = this.options.disableBrowserContextMenu;
			}
		}

		this.myRegisteredViewers[viewableType] = {};
		this.myRegisteredViewers[viewableType].class = viewerClass;
		this.myRegisteredViewers[viewableType].config = config;
	};

	ViewingApplication.prototype.getViewerClass = function(viewableType) {
		return this.myRegisteredViewers.hasOwnProperty(viewableType) ? this.myRegisteredViewers[viewableType].class : null;
	};

	/**
	 * Returns the container that will be used by the viewer.  By default uses the same container as the appContainer.
	 * This method can be overridden to specify a different sub container for the viewer.
	 * @returns {MemberExpression}
	 */
	ViewingApplication.prototype.getViewerContainer = function() {
		return document.getElementById(this.appContainerId);
	};

	function mergeConfigs(mergedConfig, config) {

		for(var name in config) {
			if(config.hasOwnProperty(name)) {

				var configValue = config[name],
					configValueIsArray = Array.isArray(configValue),
					mergedConfigValue = mergedConfig[name],
					mergedConfigValueIsArray = Array.isArray(mergedConfigValue);

				// If neither config value is an array, then the config value passed to
				// getViewer() overwrites the config value registered for this viewer.
				//
				if(!configValueIsArray || !mergedConfigValueIsArray) {
					mergedConfig[name] = configValue;

				} else {

					// But if one or the other config value is an array, then let's
					// concatenate them. We need to make them both arrays to do that:
					// they might be null/undefined, or they might be strings.
					//
					if(configValue) {
						if(!configValueIsArray) {
							configValue = [configValue];
						}
					} else {
						configValue = [];
					}
					if(mergedConfigValue) {
						if(!mergedConfigValueIsArray) {
							mergedConfigValue = [mergedConfigValue];
						}
					} else {
						mergedConfigValue = [];
					}
					mergedConfig[name] = mergedConfigValue.concat(configValue);

				}
			}
		}

	}

	/**
	 * Returns a new instance of a Viewer of requested type.
	 *
	 * @param {object} config - Viewer configuration override.
	 * @returns {ZhiUTech.Viewing.Viewer3D} Viewer instance or null.
	 */
	ViewingApplication.prototype.getViewer = function(config) {

		var registeredViewer = this.myRegisteredViewers[this.k3D];

		if(!registeredViewer)
			return null;

		// Merge the config object provided here with the config object provided
		// when the viewer type was registered. The former takes precedence.
		//
		var mergedConfig = {};
		var registeredViewerConfig = registeredViewer.config;

		mergeConfigs(mergedConfig, registeredViewerConfig);
		mergeConfigs(mergedConfig, config);

		var viewerClass = registeredViewer.class;

		if(this.myCurrentViewer && this.myCurrentViewer.__proto__.constructor === viewerClass) {
			this.myCurrentViewer.tearDown();
			this.myCurrentViewer.setUp(mergedConfig);
			return this.myCurrentViewer;
		}

		this.setCurrentViewer(null);

		// If previous viewer.initialize() failed, then clean it up now.
		// This might happen if, for instance, we had a 3d viewer but
		// WebGL is not supported.
		// TODO: need a better solution
		//
		var container = this.getViewerContainer();
		while(container.hasChildNodes()) {
			container.removeChild(container.lastChild);
		}

		var viewer = new viewerClass(container, mergedConfig);
		this.setCurrentViewer(viewer);
		return viewer;
	};

	/**
	 * Sets this ViewingApplication's viewer to the provided viewer.
	 * @param {ZhiUTech.Viewing.Viewer3D} viewer
	 */
	ViewingApplication.prototype.setCurrentViewer = function(viewer) {
		if(this.myCurrentViewer) {
			this.myCurrentViewer.removeEventListener(zv.HYPERLINK_EVENT, this.onHyperlinkHit);
			this.myCurrentViewer.removeEventListener(zv.LOAD_GEOMETRY_EVENT, this.onLoadGeometry);
			this.myCurrentViewer.finish();
		}
		this.myCurrentViewer = viewer;
		if(this.myCurrentViewer) {
			viewer.addEventListener(zv.HYPERLINK_EVENT, this.onHyperlinkHit);
			viewer.addEventListener(zv.LOAD_GEOMETRY_EVENT, this.onLoadGeometry);
			viewer.extensionCache = this.extensionCache;
		}
	};

	/**
	 * Returns the currently set Viewer.
	 * @return {ZhiUTech.Viewing.Viewer3D}
	 */
	ViewingApplication.prototype.getCurrentViewer = function() {
		return this.myCurrentViewer;
	};

	/**
	 * Initializes the ViewingApplication with an already downloaded manifest that is Forge hosted.
	 * There is no need to call loadDocument() when this function is used.
	 * 
	 * Available from version 2.15
	 * 
	 * @param {object} docManifest - A JavaScript object for the hosted manifest.
	 * @return {boolean} - true if the document was successfully initialized, false if the document was not successfully initialized.
	 */
	ViewingApplication.prototype.setDocument = function(docManifest) {
		if(!docManifest.urn || docManifest.urn === "$file$") {
			// Method doesn't support local bubbles (because it doesn't make sense to do so)
			zvp.logger.error('Unsupported Manifest urn: ' + docManifest.urn);
			return false;
		}
		var documentPath = zv.Document.getDocumentPath(docManifest.urn);
		this.myDocument = new zv.Document(docManifest, documentPath);
		this.bubble = this.myDocument.getRoot();
		this.onDocumentLoaded(this.myDocument);
		return true;
	};

	/**
	 * Asynchronously loads a document ({@link ZhiUTech.Viewing.BubbleNode}) given its ID.
	 * You can initialize a ViewingApplication with an already downloaded document using setDocument().
	 *
	 * @param {*} documentId Viewable document ID.
	 * @param {function} [onDocumentLoad] Called on success.
	 * @param {function} [onLoadFailed] Called on error.
	 * @param {object} [accessControlProperties] An optional list of key value pairs as access control properties,
	 * which includes a list of access control header name and values, and an OAuth 2.0 access token.
	 */
	ViewingApplication.prototype.loadDocument = function(documentId, onDocumentLoad, onLoadFailed, accessControlProperties) {

		zvp.logger.track({
			category: "load_document",
			urn: (documentId.indexOf("urn:") == 0) ? documentId.substring(4) : documentId
		});

		zv.Document.load(documentId,
			// onLoadCallback
			function(avDocument, errorsandwarnings) {
				// Almost the same as .setDocument() - but with the added errorsandwarnings, which needs to be revisited.
				this.myDocument = avDocument;
				this.bubble = avDocument.getRoot();
				this.onDocumentLoaded(avDocument, errorsandwarnings);
				if(onDocumentLoad) {
					onDocumentLoad(avDocument, errorsandwarnings);
				}
			}.bind(this),
			// onErrorCallback
			function(errorCode, errorMsg, statusCode, statusText, errors) {
				this.onDocumentFailedToLoad(errorCode, errorMsg, errors);
				if(onLoadFailed)
					onLoadFailed(errorCode, errorMsg, statusCode, statusText, errors);
			}.bind(this),
			accessControlProperties
		);
	};

	/**
	 * Default success callback for loadDocument.
	 * @param {*} document
	 */
	ViewingApplication.prototype.onDocumentLoaded = function(avDocument, errorsandwarnings) {
		zvp.logger.log(avDocument, errorsandwarnings);
	};

	/**
	 * Default success callback for documentFailedToLoad. Logs the document that was loaded on console.
	 * @param {string} errorCode - Globalized error code.
	 * @param {string} errorMsg - Error message to display.
	 * @param {array} errors - List of errors that come from other clients (translators).
	 */
	ViewingApplication.prototype.onDocumentFailedToLoad = function(errorCode, errorMsg, errors) {
		zvp.logger.error(zv.errorCodeString(errorCode), errorMsg, errors);
	};

	/**
	 * Given a list of geometry items, possibly fetched through ZhiUTech.Viewing.Document.getSubItemsWithProperties,
	 * it will return 1 single item from the list that should be the first one to be loaded.
	 * The method will attempt to find the item marked with attribute 'useAsDefault' with true.
	 * When none is found, it will return the first element from the list.
	 * @param {array} geometryItems
	 * @returns {object} Item element contained in geometryItems.
	 */
	ViewingApplication.prototype.getDefaultGeometry = function(geometryItems) {
		// Attempt to find the item marked with 'useAsDefault'
		for(var i = 0, len = geometryItems.length; i < len; ++i) {
			var isDefault = geometryItems[i]['useAsDefault'];
			if(isDefault === true || isDefault === 'true') {
				return geometryItems[i];
			}
		}
		return geometryItems[0];
	};

	/**
	 * Asynchronously loads an individual item from a document into the correct viewer.
	 * 
	 * As of version version 2.15, parameter item may be a BubbleNode instead of a raw JavaScript object.
	 * @param {*} item
	 * @param {function} onSuccessCallback - This call back is called when the item is selected.
	 * @param {function} onErrorCallback - This call back is called when the item fails to select.
	 * @returns {boolean}
	 */
	ViewingApplication.prototype.selectItem = function(item, onSuccessCallback, onErrorCallback) {

		// used to pass parameters from bubble items to the model loader.
		var loadOptions = {};

		// First class support of zv.BubbleNode:
		if(item instanceof ZhiUTech.Viewing.BubbleNode) {
			item = item.data;
		}

		var urnToLoad = this.myDocument.getViewablePath(item, loadOptions);

		// If the item to select is a view and there is no direct viewable (geometry), we assume
		// that this is a global view and simply use the current geometry, if there is one.
		if(!urnToLoad && item.type === 'view') {
			urnToLoad = this.urn;
		}

		if(!urnToLoad)
			return false;

		var viewItem, title, viewGeometryItem, canView = false;
		if(item.type === 'geometry' && item.role === '3d') {
			// This is for the case that initial view is a child of geometry in some DWF files
			// Set this view's camera as initial camera
			//var children = item.children;
			//if (children) {
			//    for (var i in children) {
			//        if (children.hasOwnProperty(i) && children[i].type === 'view') {
			//            viewItem = children[i];
			//            break;
			//        }
			//    }
			//}

			canView = true;
			title = item.name;
			viewGeometryItem = item;
		} else if(item.type === "view" && item.role === "3d") {
			viewItem = item;
			canView = true;
			viewGeometryItem = this.myDocument.getViewGeometry(item);
			if(viewGeometryItem) {
				title = viewGeometryItem.name;
			}
		} else if(item.type === 'geometry' && item.role === '2d') {
			var f2dItems = ZhiUTech.Viewing.Document.getSubItemsWithProperties(item, {
				'mime': 'application/zhiutech-f2d'
			}, false);
			var leafletItems = ZhiUTech.Viewing.Document.getSubItemsWithProperties(item, {
				'role': 'leaflet'
			}, false);
			var imageItems = ZhiUTech.Viewing.Document.getSubItemsWithProperties(item, {
				'role': 'image'
			}, false);

			if(f2dItems.length > 0 || leafletItems.length > 0 || imageItems.length > 0)
				canView = true;

			title = item.name;
			viewGeometryItem = item;
		} else if(item.type === 'view' && item.role === '2d') {
			viewItem = item;
			canView = true;
			viewGeometryItem = this.myDocument.getViewGeometry(item);
			if(viewGeometryItem) {
				title = viewGeometryItem.name;
			}
		}

		if(!canView)
			return false;

		var idx = urnToLoad.indexOf("urn:");
		zvp.logger.track({
			category: "load_viewable",
			role: item.role,
			type: item.type,
			urn: (idx !== -1) ? urnToLoad.substring(idx + 4) : urnToLoad
		});

		// Check if there are any warnign or errors from translators.
		// Exclude the global ones (ones from the root node).
		var messages = this.myDocument.getMessages(item, true);

		var self = this;
		var urnAlreadyLoaded = (this.myCurrentViewer && this.urn === urnToLoad);
		var onLoadCallback = function() {

			var viewer = self.myCurrentViewer;

			// set initial view
			if(viewItem && viewItem.camera) viewer.setViewFromArray(viewItem.camera, viewItem.name);
			else if(viewItem && viewItem.viewbox) viewer.setViewFromViewBox(viewItem.viewbox, viewItem.name);
			else if(urnAlreadyLoaded) viewer.setViewFromFile();

			if(onSuccessCallback) {
				onSuccessCallback(self.myCurrentViewer, item, messages);
			}
		};

		var onFailedToLoadCallback = function(errorCode, errorMsg, statusCode, statusText) {
			if(onErrorCallback)
				onErrorCallback(errorCode, errorMsg, statusCode, statusText, messages);
		};

		var loaded = false;

		if(urnAlreadyLoaded) {
			if(onLoadCallback) {
				onLoadCallback();
			}
			loaded = true;

		} else {
			this.urn = null;
			var config = {
				defaultModelStructureTitle: title,
				viewableName: title
			};

			// Add any extensions to the config.
			//
			if(item.hasOwnProperty('extensions')) {
				config.extensions = Array.isArray(item.extensions) ? item.extensions : [item.extensions];
			}

			var viewer = this.getViewer(config);
			if(viewer) {

				var options = {
					ids: null,
					bubbleNode: this.bubble ? this.bubble.findByGuid(item.guid) : null,
					sharedPropertyDbPath: this.myDocument.getPropertyDbPath(),
					acmSessionId: this.myDocument.acmSessionId,
					loadOptions: loadOptions,
					useConsolidation: this.options.useConsolidation,
					consolidationMemoryLimit: this.options.consolidationMemoryLimit || (100 * 1024 * 1024) // 100 MB
				};

				//If the viewer is not started, use the optimized start+load sequence by calling start with the model to load
				//while starting. Otherwise do normal load.
				if(viewer.started) {
					viewer.loadDocumentNode(this.myDocument, item, options).then(onLoadCallback).catch(onFailedToLoadCallback);
					loaded = true;
				} else {
					viewer.startWithDocumentNode(this.myDocument, item, options).then(onLoadCallback).catch(onFailedToLoadCallback);
					loaded = true;
				}

				this.urn = urnToLoad;
			}
		}

		if(loaded) {
			this.selectedItem = item;
			this.onItemSelected(item, viewGeometryItem);
			return true;
		}

		return false;
	};

	/**
	 * Called when selectItem successfully loads an item.
	 *
	 * @param {object} item - Can be either type 'view' or 'geometry'.
	 * @param {object} viewGeometryItem - Can only be type 'geometry'.
	 * Will be the same as item if item is type 'geometry'.
	 */
	ViewingApplication.prototype.onItemSelected = function(item, viewGeometryItem) {
		zvp.logger.log('Selected URL: http://' + location.host + location.pathname + '?document=urn:' + this.myDocument.getRootItem().guid + '&item=' + encodeURIComponent(item.guid));

		// notify observers a new item was selected.
		if(this.itemSelectedObservers) {
			var currentViewer = this.getCurrentViewer();
			for(var i = 0; i < this.itemSelectedObservers.length; ++i) {
				var observer = this.itemSelectedObservers[i];
				observer.onItemSelected && observer.onItemSelected(currentViewer, item, viewGeometryItem);
			}
		}
	};

	/**
	 * Adds objects to be notified when a new item is selected in the browser tree.
	 * @param {object} observer - Should implement function `onItemSelected(viewer)`.
	 */
	ViewingApplication.prototype.addItemSelectedObserver = function(observer) {

		if(!this.itemSelectedObservers) {
			this.itemSelectedObservers = [];
		}
		this.itemSelectedObservers.push(observer);
	};

	/**
	 * Finds the item within the current document and calls selectItem.
	 * @param {number} itemId
	 * @param {function} [onItemSelectedCallback] - This call back is called when the item is selected.
	 * @param {function} [onItemFailedToSelectCallback] - This call back is called when the item fails to select.
	 * @returns {boolean}
	 */
	ViewingApplication.prototype.selectItemById = function(itemId, onItemSelectedCallback, onItemFailedToSelectCallback) {
		var item = this.myDocument.getItemById(itemId);
		if(item) {
			return this.selectItem(item, onItemSelectedCallback, onItemFailedToSelectCallback);
		}
		return false;
	};

	/**
	 * Returns the node object containing metadata associated to the model currently loaded in the viewer.
	 * @returns {null|object}
	 */
	ViewingApplication.prototype.getSelectedItem = function() {
		return this.selectedItem;
	};

	/**
	 * Returns a list of named views for the Viewer. It will use getSelectedItem() or
	 * the item parameter, if available.
	 * 
	 * Users may call into setlectItem() with a value of the returned array.
	 * 
	 * Available from version 2.15
	 * 
	 * @param {object} [item] - The item to look for named views.
	 * @returns {array} - All named views, returns empty array if no named views are found.
	 */
	ViewingApplication.prototype.getNamedViews = function(item) {
		item = item || this.selectedItem;
		if(!item || !item.guid)
			return [];

		var bubbleNode = this.bubble.findByGuid(item.guid);

		// Need to make sure we are at a geometry level.
		if(item === this.selectedItem) {
			bubbleNode = bubbleNode.findParentGeom2Dor3D();
		}

		var views = bubbleNode.getNamedViews();
		return views;
	};

	zv.ViewingApplication = ViewingApplication;

})();;
ZhiUTechNamespace('ZhiUTech.Viewing.Private');

ZhiUTech.Viewing.Private.ViewCubeUi = function(viewer) {
	this.viewer = viewer;

	this.container = null;
	this.cube = null; // Autocam.ViewCube
	this.viewcube = null;
	this.homeViewContainer = null;
};

var zvp = ZhiUTech.Viewing.Private;

ZhiUTech.Viewing.Private.ViewCubeUi.prototype = {
	constructor: ZhiUTech.Viewing.UI.ViewCube,

	create: function() {
		var config = this.viewer.config;

		this.initContainer();
		this.initHomeButton();
	},

	initContainer: function() {
		this.container = document.createElement('div');
		this.container.className = "viewcube";
		this.viewer.container.appendChild(this.container);
	},

	initHomeButton: function() {
		if(this.homeViewContainer) {
			return;
		}

		var homeViewContainer = document.createElement('div');
		homeViewContainer.className = "homeViewWrapper";

		this.container.appendChild(homeViewContainer);
		this.homeViewContainer = homeViewContainer;

		var self = this;
		homeViewContainer.addEventListener("click", function(e) {
			self.viewer.navigation.setRequestHomeView(true);
		});
	},

	setVisible: function(show) {
		this.container.style.display = show ? 'block' : 'none';
	},

	showTriad: function(show) {
		if(this.cube)
			this.cube.showTriad(show);
	},

	displayViewCube: function(display, updatePrefs) {
		if(updatePrefs)
			this.viewer.prefs.set('viewCube', display);

		if(display && !this.cube) {
			this.viewcube = document.createElement("div");
			this.viewcube.className = "viewcube";
			this.container.appendChild(this.viewcube);
			this.cube = new zvp.Autocam.ViewCube("cube", this.viewer.autocam, this.viewcube, LOCALIZATION_REL_PATH);

			// Move sibling on top of the viewcube.
			this.container.appendChild(this.homeViewContainer);
		} else if(!this.cube) {
			this._positionHomeButton();
			return; //view cube is not existent and we want it off? Just do nothing.
		}

		this.viewcube.style.display = (display ? "block" : "none");

		this._positionHomeButton();

		if(display) {
			this.viewer.autocam.refresh();
		}
	},

	_positionHomeButton: function() {
		if(this.homeViewContainer) {
			var viewCubeVisible = this.cube && this.viewcube && (this.viewcube.style.display === 'block');
			if(viewCubeVisible) {
				this.homeViewContainer.classList.remove('no-viewcube');
			} else {
				this.homeViewContainer.classList.add('no-viewcube');
			}
		}
	},

	uninitialize: function() {
		if(this.container) {
			this.viewer.container.removeChild(this.container);
			this.viewcube = null;
		}

		if(this.cube) {
			this.cube.dtor();
			this.cube = null;
		}

		this.homeViewContainer = null;
		this.hideHomeViewMenu = null;
		this.viewer = null;
	}
};;
var zv = ZhiUTech.Viewing,
	zvp = ZhiUTech.Viewing.Private,
	avu = ZhiUTech.Viewing.UI,
	ave = ZhiUTech.Viewing.Extensions;

var stringToDOM = zvp.stringToDOM = function(str) {
	var d = document.createElement("div");
	d.innerHTML = str;
	return d.firstChild;
};
(function() {

	'use strict';

	zv.TOOLBAR_CREATED_EVENT = 'toolbarCreated';
	zv.VIEW_CUBE_CREATED_EVENT = 'viewCubeCreated';

	/**
	 * Viewer tools sets.
	 *
	 * These constants are used to define the standard set of tools.
	 *
	 * @enum {string}
	 * @readonly
	 * @memberof ZhiUTech.Viewing
	 */
	zv.TOOLBAR = {
		NAVTOOLSID: "navTools",
		MODELTOOLSID: "modelTools",
		SETTINGSTOOLSID: "settingsTools",
		MEASURETOOLSID: "measureTools",
	};

	/**
	 * Viewer component based on {@link ZhiUTech.Viewing.Viewer3D} with added UI.
	 *
	 * @constructor
	 * @param {HTMLElement} container - The viewer container.
	 * @param {object} config - The initial settings object. See base class for details.
	 * @alias ZhiUTech.Viewing.GuiViewer3D
	 * @extends ZhiUTech.Viewing.Viewer3D
	 * @category UI
	 */
	var GuiViewer3D = function(container, config) {
		if(!config) config = {};

		// Explicitly set startOnInitialize = false, as we want to finish some initialization
		// before starting the main loop.
		//
		config.startOnInitialize = false;

		zv.Viewer3D.call(this, container, config);

		this.toolbar = null;

		// Container for the UI docking panels
		this.dockingPanels = [];

		this.modelstructure = null;
		this.layersPanel = null;

	};

	// Static function
	/**
	 * @private
	 */
	GuiViewer3D.populateConfigOptions = function(config) {

		if(!config.hasOwnProperty('disabledExtensions'))
			config.disabledExtensions = {};

		// Supported features that can be disabled when using GuiViewer3D.
		[
			'measure',
			'hyperlink',
			'section',
		].forEach(function(extProp) {
			if(!config.disabledExtensions.hasOwnProperty(extProp))
				config.disabledExtensions[extProp] = false;
		});
	};

	GuiViewer3D.prototype = Object.create(zv.Viewer3D.prototype);
	GuiViewer3D.prototype.constructor = GuiViewer3D;

	GuiViewer3D.prototype.initialize = function() {
		var viewerErrorCode = zv.Viewer3D.prototype.initialize.call(this);

		if(viewerErrorCode > 0) // ErrorCode was returned.
		{
			zvp.ErrorHandler.reportError(this.container, viewerErrorCode); // Show UI dialog
			return viewerErrorCode;
		}

		var viewer = this;

		// Add padding to bottom to account for toolbar, when calling fitToView()
		// TODO: Use pixel size for setting these.
		//---this.navigation.FIT_TO_VIEW_VERTICAL_OFFSET = 0.03;
		//---this.navigation.FIT_TO_VIEW_VERTICAL_MARGIN = 0.0;

		if(this.toolController) {
			var hottouch = new zv.HotGestureTool(this);

			this.toolController.registerTool(hottouch);

			this.toolController.activateTool(hottouch.getName());
		}

		// Create toolbar that is attached to the bottom of the panel.
		this.getToolbar(true);

		this.addEventListener(zv.FULLSCREEN_MODE_EVENT, function(e) {
			viewer.resizePanels({
				viewer: viewer
			});
			viewer.updateFullscreenButton(e.mode);
		});

		// Context menu
		if(!this.contextMenu) {
			this.setDefaultContextMenu();
		}

		// Create a progress bar. Shows streaming.
		//
		this.progressbar = new zvp.ProgressBar(this.container);
		this.addEventListener(zv.PROGRESS_UPDATE_EVENT, function(e) {
			if(e.percent !== undefined) {
				viewer.progressbar.setPercent(e.percent);
			}
		}, false);

		// There is no way on the API to get the current selection (yet?)
		//
		// We need to know if there is anything selected in order to process the
		// Escape key workflow, so track it manually.
		this.selectionActive = false;
		this.addEventListener(zv.SELECTION_CHANGED_EVENT, function(event) {
			viewer.selectionActive = (event.dbIdArray.length > 0);

			if(viewer.prefs.openPropertiesOnSelect) {
				var propertyPanel = viewer.getPropertyPanel(true);
				propertyPanel.setVisible(viewer.selectionActive);
			}
		});

		this.addEventListener(zv.ISOLATE_EVENT, function(event) {
			if(viewer.prefs.openPropertiesOnSelect || event.nodeIdArray[0] === event.model.getRootId()) {
				if(viewer.propertygrid) {
					viewer.propertygrid.setVisible(event.nodeIdArray.length > 0 || viewer.selectionActive);
				}
			}
		});

		this.addEventListener(zv.VIEWER_STATE_RESTORED_EVENT, function(event) {
			if(viewer.renderoptions) {
				viewer.renderoptions.syncUI();
			}

			var settingsPanel = viewer.getSettingsPanel(true);
			if(settingsPanel)
				settingsPanel.syncUI();

			// We don't really need to update these 2 values, because the panel is usually closed.
			// Leaving code here just in case it becomes necessary.
			//this.envSelect.setSelectedIndex(viewer.impl.currentLightPreset());
			//this.viewerOptionButton.displayLines.setValue(viewer.prefs.lineRendering);
		});

		this.addEventListener(zv.VIEWER_RESIZE_EVENT, function(event) {

			viewer.resizePanels();

			if(viewer.viewCubeUi && viewer.viewCubeUi.cube)
				viewer.viewCubeUi.cube.refreshCube();

			viewer.updateToolbarButtons(event.width, event.height);
		});

		this.addEventListener(zv.NAVIGATION_MODE_CHANGED_EVENT, function(event) {
			viewer.updateToolbarButtons(viewer.container.clientWidth, viewer.container.clientHeight);
		});

		this.addEventListener(zv.MODEL_UNLOADED_EVENT, function(event) {
			viewer._onUnloadModel(event.model);
		});

		this.initEscapeHandlers();

		// Now that all the ui is created, localize it.
		this.localize();

		// Now that all of our initialization is done, start the main loop.
		//
		this.run();

		return 0; // No errors initializing.
	};

	GuiViewer3D.prototype.uninitialize = function() {

		if(this.viewerSettingsPanel) {
			this.viewerSettingsPanel.uninitialize();
			this.viewerSettingsPanel = null;
		}

		if(this.modelstructure) {
			this.modelstructure.uninitialize();
			this.modelstructure = null;
		}

		if(this.layersPanel) {
			this.layersPanel.uninitialize();
			this.layersPanel = null;
		}

		if(this.propertygrid) {
			this.propertygrid.uninitialize();
			this.propertygrid = null;
		}

		if(this.renderoptions) {
			this.renderoptions.uninitialize();
			this.renderoptions = null;
		}

		if(this.viewerOptionButton) {

			this.viewerOptionButton = null;
		}

		zv.theHotkeyManager.popHotkeys("ZhiUTech.ROLL");
		zv.theHotkeyManager.popHotkeys("ZhiUTech.FOV");

		this.removeEventListener(zv.RENDER_OPTION_CHANGED_EVENT, this.onRenderOptionChanged);
		this.onRenderOptionChanged = null;
		this.removeEventListener(zv.VIEWER_STATE_RESTORED_EVENT, this.onRestoreState);
		this.onRestoreState = null;

		this.progressbar = null;

		this.modelTools = null;
		this.navTools = null;
		this.settingsTools = null;
		this.debugMenu = null;
		this.modelStats = null;
		this.explodeSlider = null;
		this.explodeSubmenu = null;

		// Toolbar
		this.toolbar = null;

		zv.Viewer3D.prototype.uninitialize.call(this);
	};

	GuiViewer3D.prototype.setUp = function(config) {
		if(!config) config = {};

		// Explicitly set startOnInitialize = false, as we want to finish some initialization
		// before starting the main loop.
		//
		config.startOnInitialize = false;

		this.getToolbar(true);

		zv.Viewer3D.prototype.setUp.call(this, config);
	};

	GuiViewer3D.prototype.tearDown = function() {

		//TODO: this is unorthodox order of destruction, but we
		//need to call the super first so it unloads the extensions,
		//which need the GUI. We need to resolve this somehow.
		zv.Viewer3D.prototype.tearDown.call(this);

		if(this.toolbar) {
			this.toolbar.container.parentNode.removeChild(this.toolbar.container);
			this.toolbar = null;
		}

		if(this.modelstructure) {
			this.setModelStructurePanel(null);
		}
		if(this.propertygrid) {
			this.setPropertyPanel(null);
		}
		if(this.viewerSettingsPanel) {
			this.setSettingsPanel(null);
		}
		if(this.layersPanel) {
			this.setLayersPanel(null);
		}
		if(this.renderoptions) {
			this.removePanel(this.renderoptions);
			this.renderoptions.uninitialize();
			this.renderoptions = null;
		}

		// Need to remove this event listener, in case that viewcube will show up when
		// changing sheets from 3D to 2D and the 3D model doesn't fully loaded.
		this.removeEventListener(zv.GEOMETRY_LOADED_EVENT, this.initViewCube);
	};

	GuiViewer3D.prototype.loadModel = function(url, options, onSuccessCallback, onErrorCallback, initAfterWorker) {

		var viewer = this;

		function createUI(model) {
			if(!viewer.running) {
				zvp.logger.error("createUI expects the viewer to be running.", zv.errorCodeString(zv.ErrorCodes.VIEWER_INTERNAL_ERROR));
				return;
			}
			viewer.createUI(model);
		}

		function onSuccessChained(model) {

			//TODO: The exact timeout needs to be tuned for best
			//CPU utilization and shortest frame length during startup.
			setTimeout(function() {
				createUI(model);
				viewer._onLoadModel(model);

				if(onSuccessCallback)
					onSuccessCallback.call(onSuccessCallback, model);
			}, 1);
		}

		function onFailureChained(errorCode) {
			zvp.ErrorHandler.reportError(viewer.container, errorCode); // Show UI dialog
			onErrorCallback && onErrorCallback.apply(onErrorCallback, arguments);
		}

		var res = zv.Viewer3D.prototype.loadModel.call(this, url, options, onSuccessChained, onFailureChained, initAfterWorker);

		return res;
	};

	GuiViewer3D.prototype.createUI = function(model) {

		// We only support UI for initially loaded model.
		if(this.model !== model) {
			return;
		}

		var self = this;
		var viewer = this;

		this.initViewCube = function() {
			//Delay this to the next frame so that the current frame can render fast and display the geometry.
			setTimeout(function() {
				viewer.displayViewCube(viewer.prefs.viewCube);
				viewer.removeEventListener(zv.GEOMETRY_LOADED_EVENT, viewer.initViewCube);
			}, 1);
		};

		var disabledExtensions = this.config.disabledExtensions || {};

		this.initHotkeys(model);

		this.loadExtension('ZhiUTech.DefaultTools.NavTools', viewer.config);
		this.initModelTools(model);

		//Optional rendering options panel + button
		if(zvp.ENABLE_DEBUG) {
			this.initDebugTools();
		}

		// Dispatch a toolbar created event
		this.toolbar.container.style.display = 'block'; // Show toolbar before event fires
		this.dispatchEvent({
			type: zv.TOOLBAR_CREATED_EVENT
		});

		this.createViewCube();

		// Dispatch a view cube created event
		this.dispatchEvent({
			type: zv.VIEW_CUBE_CREATED_EVENT
		});

		this.initModality();

		this.resize();

		if(model.is2d()) {
			this.unloadExtension('ZhiUTech.BimWalk');
			this.unloadExtension('ZhiUTech.FirstPerson');

			// Make pan a default navigation tool.
			this.setDefaultNavigationTool("pan");

			// Make sure view cube and click to set COI are disabled (but don't update the preferences)
			this.setClickToSetCOI(false, false);
			this.displayViewCube(false, false);

			//Load relevant extensions (on the next frame, since creating the UI is already too slow)
			setTimeout(function() {
				if(!disabledExtensions.measure) {
					viewer.loadExtension('ZhiUTech.Measure', viewer.config);
				}

				if(!disabledExtensions.hyperlink) {
					viewer.loadExtension('ZhiUTech.Hyperlink', viewer.config);
				}
			}, 1);

		} else {
			// Make orbit a default navigation tool.
			if(this.getDefaultNavigationToolName().indexOf("orbit") === -1)
				this.setDefaultNavigationTool("orbit");

			//Load relevant extensions (on the next frame, since creating the UI is already too slow)
			setTimeout(function() {
				if(viewer.prefs.useFirstPersonPrototype) {
					viewer.loadExtension('ZhiUTech.BimWalk', viewer.config);
				} else {
					viewer.loadExtension('ZhiUTech.FirstPerson', viewer.config);
				}

				if(viewer.prefs.fusionOrbit)
					viewer.loadExtension('ZhiUTech.Viewing.FusionOrbit', viewer.config);

				if(!disabledExtensions.measure) {
					viewer.loadExtension('ZhiUTech.Measure', viewer.config);
				}

				if(!disabledExtensions.section) {
					viewer.loadExtension('ZhiUTech.Section', viewer.config);
				}

				if(!disabledExtensions.hyperlink) {
					viewer.loadExtension('ZhiUTech.Hyperlink', viewer.config);
				}

				if(!disabledExtensions.scalarisSimulation) {
					if(viewer.model.loader instanceof zv.ScalarisLoader) {
						viewer.loadExtension('ZhiUTech.Viewing.ScalarisSimulation', viewer.config);
					}
				}

				if(zvp.isExperimentalFlagEnabled('billboards', viewer.config)) {
					viewer.loadExtension('ZhiUTech.Comments', viewer.config); // TODO: Detach Comment extension from Billboard.
					viewer.loadExtension('ZhiUTech.BillboardGui', viewer.config);
				}
			}, 1);

			this.addEventListener(zv.GEOMETRY_LOADED_EVENT, this.initViewCube);
		}
	};

	GuiViewer3D.prototype._onLoadModel = function(model) {

		if(this.modelstructure) {
			this.modelstructure.addModel(model);
		}
	};

	GuiViewer3D.prototype._onUnloadModel = function(model) {
		if(this.modelstructure) {
			this.modelstructure.unloadModel(model);
		}
	};

	// "tooltip" string is localized by this method.
	GuiViewer3D.prototype.addOptionToggle = function(parent, tooltip, initialState, onchange, saveKey) {

		// Use the stored settings or defaults
		var storedState = saveKey ? this.prefs[saveKey] : null;
		initialState = (typeof storedState === 'boolean') ? storedState : initialState;

		var li = document.createElement("li");
		li.className = "toolbar-submenu-listitem";

		var cb = document.createElement("input");
		cb.className = "toolbar-submenu-checkbox";
		cb.type = "checkbox";
		cb.id = tooltip;
		li.appendChild(cb);

		var lbl = document.createElement("label");
		lbl.setAttribute('for', tooltip);
		lbl.setAttribute("data-i18n", tooltip);
		lbl.textContent = zv.i18n.translate(tooltip);
		li.appendChild(lbl);

		parent.appendChild(li);

		cb.checked = initialState;

		cb.addEventListener("touchstart", zv.touchStartToClick);
		lbl.addEventListener("touchstart", zv.touchStartToClick);
		li.addEventListener("touchstart", zv.touchStartToClick);

		cb.addEventListener("click", function(e) {
			onchange(cb.checked);
			e.stopPropagation();
		});

		lbl.addEventListener("click", function(e) {
			e.stopPropagation();
		});

		li.addEventListener("click", function(e) {
			onchange(!cb.checked);
			e.stopPropagation();
		});

		if(saveKey) {
			this.prefs.addListeners(saveKey, function(value) {
				cb.checked = value;
			}, function(value) {
				cb.checked = value;
				onchange(value);
			});
		}
		return cb;
	};

	// "label" string will be converted to localized string by this method
	GuiViewer3D.prototype.addOptionList = function(parent, label, optionList, initialIndex, onchange, saveKey) {

		// Use the stored settings or defaults
		var storedState = this.prefs[saveKey];
		initialIndex = (typeof storedState === 'number') ? storedState : initialIndex;

		// Wrap the onchange with the update to that setting
		var handler = function(e) {
			var selectedIndex = e.target.selectedIndex;
			onchange(selectedIndex);
			e.stopPropagation();
		};

		var selectElem = document.createElement("select");
		selectElem.className = 'option-drop-down';
		selectElem.id = "selectMenu_" + label;
		for(var i = 0; i < optionList.length; i++) {
			var item = document.createElement("option");
			item.value = i;
			item.setAttribute("data-i18n", optionList[i]);
			item.textContent = ZhiUTech.Viewing.i18n.translate(optionList[i]);
			selectElem.add(item);
		}

		var li = document.createElement("li");
		li.className = "toolbar-submenu-select";

		var lbl = document.createElement("div");
		lbl.className = "toolbar-submenu-selectlabel";
		lbl.setAttribute('for', label);
		lbl.setAttribute("data-i18n", label);
		lbl.textContent = zv.i18n.translate(label);
		li.appendChild(lbl);
		li.appendChild(selectElem);

		parent.appendChild(li);

		selectElem.selectedIndex = initialIndex;
		selectElem.onchange = handler;
		selectElem.addEventListener("touchstart", function(e) {
			e.stopPropagation();
		});
		selectElem.addEventListener("click", function(e) {
			e.stopPropagation();
		});

		if(saveKey) {
			this.prefs.addListeners(saveKey, function(value) {
				selectElem.selectedIndex = value;
			}, function(value) {
				selectElem.selectedIndex = value;
				onchange(value);
			});
		}

		return selectElem;
	};

	GuiViewer3D.prototype.showViewer3dOptions = function(show) {
		var settingsPanel = this.getSettingsPanel(true);
		if(show && settingsPanel.isVisible()) {
			settingsPanel.setVisible(false);
		}
		settingsPanel.setVisible(show);
	};

	GuiViewer3D.prototype.showRenderingOptions = function(show) {
		this.renderoptions.setVisible(show);
	};

	GuiViewer3D.prototype.showLayerManager = function(show) {
		this.layersPanel.setVisible(show);
	};

	GuiViewer3D.prototype.initHotkeys = function(model) {
		var viewer = this;
		var keys = zv.theHotkeyManager.KEYCODES;
		var onPress;
		var onRelease;

		if(!model.is2d()) {
			// Add FOV hotkey
			var previousToolForFOV;
			onPress = function() {
				if(viewer.toolController.getIsLocked() || !viewer.navigation.isActionEnabled('fov')) {
					return false;
				}

				previousToolForFOV = viewer.getActiveNavigationTool();
				viewer.setActiveNavigationTool("fov");
				return true;
			};
			onRelease = function() {
				if(viewer.toolController.getIsLocked() || !viewer.navigation.isActionEnabled('fov')) {
					return false;
				}

				viewer.setActiveNavigationTool(previousToolForFOV);
				return true;
			};
			zv.theHotkeyManager.pushHotkeys("ZhiUTech.FOV", [{
				keycodes: [keys.CONTROL, keys.SHIFT],
				onPress: onPress,
				onRelease: onRelease
			}], {
				tryUntilSuccess: true
			});
		}

		// Add Roll hotkey
		var previousToolForRoll;
		onPress = function() {
			if(viewer.toolController.getIsLocked() || !viewer.navigation.isActionEnabled('roll')) {
				return false;
			}

			previousToolForRoll = viewer.getActiveNavigationTool();
			viewer.setActiveNavigationTool("worldup");
			return true;
		};
		onRelease = function() {
			if(viewer.toolController.getIsLocked() || !viewer.navigation.isActionEnabled('roll')) {
				return false;
			}

			viewer.setActiveNavigationTool(previousToolForRoll);
			return true;
		};
		zv.theHotkeyManager.pushHotkeys("ZhiUTech.ROLL", [{
			keycodes: [keys.ALT, keys.SHIFT],
			onPress: onPress,
			onRelease: onRelease
		}], {
			tryUntilSuccess: true
		});
	};

	/**
	 * Sets the model structure panel for displaying the loaded model.
	 * Assumes that no model has yet been loaded into the scene.
	 * 
	 * @param {ZhiUTech.Viewing.UI.ModelStructurePanel} modelStructurePanel - The model structure panel to use, or null.
	 * @returns {boolean} True if the panel, or null, was set successfully; false otherwise.
	 */
	GuiViewer3D.prototype.setModelStructurePanel = function(modelStructurePanel) {

		if(modelStructurePanel === this.modelstructure)
			return false;

		var newPanel = false;
		if(this.modelstructure) {
			newPanel = true;
			this.modelstructure.setVisible(false); // This ensures the button is in the correct state.
			this.removePanel(this.modelstructure);
			this.modelstructure.uninitialize();
		}

		this.modelstructure = modelStructurePanel;
		if(!modelStructurePanel) {
			return true;
		}

		this.addPanel(this.modelstructure);

		// Notify of all models already loaded
		if(newPanel) {
			var models = this.impl.modelQueue().getModels();
			for(var i = 0; i < models.length; ++i) {
				this.modelstructure.addModel(models[i]);
			}
		}

		var self = this;
		modelStructurePanel.addVisibilityListener(function(visible) {
			if(visible) {
				self.onPanelVisible(modelStructurePanel, self);
			}
			self.settingsTools.structurebutton.setState(visible ? avu.Button.State.ACTIVE : avu.Button.State.INACTIVE);
		});
		return true;
	};

	/**
	 * Sets the layers panel for display 2d layers.
	 *
	 * @param {ZhiUTech.Viewing.UI.LayersPanel} layersPanel - The layers panel to use, or null.
	 * @returns {boolean} True if the panel or null was set successfully, and false otherwise.
	 */
	GuiViewer3D.prototype.setLayersPanel = function(layersPanel) {
		var self = this;

		if(this.model && !this.impl.getLayersRoot()) {
			return false;
		}

		if(layersPanel instanceof zv.UI.LayersPanel || !layersPanel) {
			if(this.layersPanel) {
				this.layersPanel.setVisible(false);
				this.removePanel(this.layersPanel);
				this.layersPanel.uninitialize();
			}

			this.layersPanel = layersPanel;
			if(layersPanel) {
				this.addPanel(layersPanel);

				layersPanel.addVisibilityListener(function(visible) {
					if(visible) {
						self.onPanelVisible(layersPanel, self);
					}
					self.settingsTools.layerButton.setState(visible ? avu.Button.State.ACTIVE : avu.Button.State.INACTIVE);
				});
			}
			return true;
		}
		return false;
	};

	/**
	 * Sets the property panel.
	 * @param {ZhiUTech.Viewing.UI.PropertyPanel} propertyPanel - The property panel to use, or null.
	 * @returns {boolean} True if the panel or null was set successfully, and false otherwise.
	 */
	GuiViewer3D.prototype.setPropertyPanel = function(propertyPanel) {
		var self = this;
		if(propertyPanel instanceof zv.UI.PropertyPanel || !propertyPanel) {
			if(this.propertygrid) {
				this.propertygrid.setVisible(false);
				this.removePanel(this.propertygrid);
				this.propertygrid.uninitialize();
			}

			this.propertygrid = propertyPanel;
			if(propertyPanel) {
				this.addPanel(propertyPanel);

				propertyPanel.addVisibilityListener(function(visible) {
					if(visible) {
						self.onPanelVisible(propertyPanel, self);
					}
					self.settingsTools.propertiesbutton.setState(visible ? avu.Button.State.ACTIVE : avu.Button.State.INACTIVE);
				});

			}
			return true;
		}
		return false;
	};

	GuiViewer3D.prototype.getPropertyPanel = function(createDefault) {
		if(!this.propertygrid && createDefault) {
			this.setPropertyPanel(new ave.ViewerPropertyPanel(this));
		}
		return this.propertygrid;
	};

	/**
	 * Sets the viewer's settings panel.
	 * @param {ZhiUTech.Viewing.UI.SettingsPanel} settingsPanel - The settings panel to use, or null.
	 * @returns {boolean} True if the panel or null was set successfully, and false otherwise.
	 */
	GuiViewer3D.prototype.setSettingsPanel = function(settingsPanel) {
		var self = this;
		if(settingsPanel instanceof zv.UI.SettingsPanel || !settingsPanel) {
			if(this.viewerSettingsPanel) {
				this.viewerSettingsPanel.setVisible(false);
				this.removePanel(this.viewerSettingsPanel);
				this.viewerSettingsPanel.uninitialize();
			}

			this.viewerSettingsPanel = settingsPanel;
			if(settingsPanel) {
				this.addPanel(settingsPanel);

				settingsPanel.addVisibilityListener(function(visible) {
					if(visible) {
						self.onPanelVisible(settingsPanel, self);
					}
					self.viewerOptionButton.setState(visible ? avu.Button.State.ACTIVE : avu.Button.State.INACTIVE);
				});
			}
			return true;
		}
		return false;
	};

	GuiViewer3D.prototype.getSettingsPanel = function(createDefault) {
		if(!this.viewerSettingsPanel && createDefault) {
			this.setSettingsPanel(new ave.ViewerSettingsPanel(this, this.model));
		}
		return this.viewerSettingsPanel;
	};

	GuiViewer3D.prototype.createSettingsPanel = function(model) {
		var settingsPanel = new ave.ViewerSettingsPanel(this, model);
		this.setSettingsPanel(settingsPanel);
		settingsPanel.syncUI();

		var viewerOptionButton = new avu.Button('toolbar-settingsTool');
		this.viewerOptionButton = viewerOptionButton;
		viewerOptionButton.setIcon("zu-icon-settings");
		viewerOptionButton.setToolTip("Settings");
		this.settingsTools.addControl(viewerOptionButton);
		this.createViewerOptionsMenu(model);
	};

	GuiViewer3D.prototype.initModelTools = function(model) {
		var viewer = this;

		//var resetTooltip = null;
		if(!model.is2d()) {
			if(!viewer.modelstructure) {
				var options = {
					docStructureConfig: viewer.config.docStructureConfig,
					hideSearch: zv.isMobileDevice()
					//TODO: visibility of search bar in browser panel
				};
				var modelTitle = this.config.defaultModelStructureTitle ? this.config.defaultModelStructureTitle : 'Browser';
				viewer.setModelStructurePanel(new ave.ViewerModelStructurePanel(viewer, modelTitle, options));
			}

			var structureButton = new avu.Button('toolbar-modelStructureTool');
			structureButton.setToolTip('Model browser');
			structureButton.setIcon("zu-icon-structure");
			structureButton.onClick = function(e) {
				viewer.showModelStructurePanel(!viewer.modelstructure.isVisible());
			};

			this.settingsTools.addControl(structureButton);
			this.settingsTools.structurebutton = structureButton;

			this.initExplodeSlider();
			// this.initInspectTools();  // NOTE_NOP: don't need this

			//TODO: show only after complete load?
			//viewer.showModelStructurePanel(true);

			//resetTooltip = "Reset model";
		}

		// Initialize model layers panel if any layers.
		var modelLayersInit = function() {
			if(viewer.impl.layers.getRoot().childCount > 0) {
				var layersPanel = new ave.ViewerLayersPanel(this);
				this.setLayersPanel(layersPanel);

				var layerButton = new avu.Button('toolbar-layers-tool');
				layerButton.setToolTip('Layer Manager');
				layerButton.setIcon("zu-icon-layers");
				layerButton.onClick = function(e) {
					if(!viewer.layersPanel) {
						viewer.setLayersPanel(new ave.ViewerLayersPanel(viewer));
					}
					viewer.showLayerManager(!viewer.layersPanel.isVisible());
				};

				var index = this.settingsTools.indexOf('toolbar-modelStructureTool');
				index = index !== -1 ? index : 0;

				this.settingsTools.addControl(layerButton, {
					index: index + 1
				});
				this.settingsTools.layerButton = layerButton;
			}
			viewer.removeEventListener(zv.MODEL_LAYERS_LOADED_EVENT, modelLayersInit);
		}.bind(this);

		if(viewer.impl.layers.initialized) {
			modelLayersInit();
		} else {
			this.addEventListener(zv.MODEL_LAYERS_LOADED_EVENT, modelLayersInit);
		}

		// NOTE_NOP: turn off reset button
		// var resetModelButton = new avu.Button('toolbar-resetTool');
		// resetModelButton.setToolTip(resetTooltip);
		// resetModelButton.setIcon("zu-icon-reset");
		// resetModelButton.onClick = function (e) {
		//     viewer.dispatchEvent({type: zv.RESET_EVENT});
		// };
		// this.modelTools.addControl(resetModelButton);
		// this.modelTools.resetModelButton = resetModelButton;

		viewer.addEventListener(zv.RESET_EVENT, function() {
			if(viewer.model && !viewer.model.is2d()) {
				viewer.explode(0);
				viewer.explodeSlider.value = 0;
			}
			viewer.showAll();
		});

		var propertiesButton = new avu.Button('toolbar-propertiesTool');
		propertiesButton.setToolTip('Properties');
		propertiesButton.setIcon("zu-icon-properties");
		propertiesButton.onClick = function(e) {
			var propertyPanel = viewer.getPropertyPanel(true);
			propertyPanel.setVisible(!propertyPanel.isVisible());
		};
		propertiesButton.setVisible(!viewer.prefs.openPropertiesOnSelect);
		this.settingsTools.addControl(propertiesButton);
		this.settingsTools.propertiesbutton = propertiesButton;

		// New viewer options' panel
		this.createSettingsPanel(model);

		if(zvp.ENABLE_DEBUG && !model.is2d()) {
			this.renderoptions = new zvp.RenderOptionsPanel(this);
			this.addPanel(this.renderoptions);

			var renderOptionsButton = new avu.Button('toolbar-renderOptionsTool');
			renderOptionsButton.setToolTip('Rendering options');
			renderOptionsButton.setIcon("zu-icon-settings-render");
			renderOptionsButton.onClick = function(e) {
				viewer.showRenderingOptions(!viewer.renderoptions.isVisible());
			};
			this.settingsTools.addControl(renderOptionsButton);
		}

		if(this.canChangeScreenMode()) {
			var fullscreenButton = new avu.Button('toolbar-fullscreenTool', {
				collapsible: false
			});
			fullscreenButton.setToolTip('Full screen');
			fullscreenButton.setIcon("zu-icon-fullscreen");
			fullscreenButton.onClick = function(e) {
				viewer.nextScreenMode();
			};
			this.settingsTools.addControl(fullscreenButton);
			this.settingsTools.fullscreenbutton = fullscreenButton;

			this.updateFullscreenButton(this.getScreenMode());
		}
	};

	GuiViewer3D.prototype.setPropertiesOnSelect = function(onSelect) {
		this.prefs.set('openPropertiesOnSelect', onSelect);
		this.settingsTools.propertiesbutton.setVisible(!onSelect);
	};

	GuiViewer3D.prototype.addDivider = function(parent) {
		var item = document.createElement("li");
		item.className = "toolbar-submenu-horizontal-divider";
		parent.appendChild(item);
		return item;
	};

	GuiViewer3D.prototype.createViewerOptionsMenu = function(model) {
		// TODO: Refactor this into a control
		var viewer = this;

		function show3dOptions(tab) {

			var panel = viewer.getSettingsPanel(true);
			if(!panel.isVisible()) {
				viewer.showViewer3dOptions(true);
				panel.selectTab(tab);
			} else {
				viewer.showViewer3dOptions(false);
			}
		}
		/* Comment the below code to make fusion-like */

		//this.viewerOptionButton.onMouseOver = function(e) {
		//    subMenu.classList.remove('zu-hidden');
		//};
		//
		//this.viewerOptionButton.onMouseOut = function(e) {
		//    subMenu.classList.add('zu-hidden');
		//};

		//if (zv.isTouchDevice()) {
		this.viewerOptionButton.onClick = function() {
			show3dOptions(ave.ViewerSettingTab.Performance);
		};

	};
	GuiViewer3D.prototype.initDebugTools = function() {
		var debugGroup = new avu.ControlGroup('debugTools');
		this.debugMenu = debugGroup;

		// Create the debug submenu button and attach submenu to it.
		var debugButton = new avu.Button('toolbar-debugTool');
		debugButton.setIcon("zu-icon-bug");
		debugGroup.addControl(debugButton);
		this.debugMenu.debugSubMenuButton = debugButton;

		this.createDebugSubmenu(this.debugMenu.debugSubMenuButton);

		this.toolbar.addControl(debugGroup);
	};

	GuiViewer3D.prototype.createDebugSubmenu = function(button) {
		// TODO: Refactor into a control
		var viewer = this;

		var subMenu = document.createElement('div');
		subMenu.id = 'toolbar-debugToolSubmenu';
		subMenu.classList.add('toolbar-submenu');
		subMenu.classList.add('toolbar-settings-sub-menu');
		subMenu.classList.add('zu-hidden');

		this.debugMenu.subMenu = subMenu;
		this.debugMenu.subMenu.style.minWidth = "180px";

		// Temp connect to the main container to calculate the correct width
		this.container.appendChild(subMenu);

		this.initModelStats();
		this.addDivider(subMenu);

		// Add the language setting
		this.addDivider(subMenu);
		var langs = zvp.Lang.getLanguages();
		var langNames = langs.map(function(elem) {
			return elem.label;
		});
		var langSymbols = langs.map(function(elem) {
			return elem.symbol;
		});

		function setLanguage() {
			viewer.localize();
		}

		var initialSelection = viewer.selectedLanguage ? viewer.selectedLanguage : 0;
		var langList = this.addOptionList(subMenu, "Language", langNames, initialSelection, function(selectedIndex) {
			var langSymb = langSymbols[selectedIndex];
			viewer.selectedLanguage = selectedIndex;
			zvp.setLanguage(langSymb, setLanguage);
		}, null);
		langList.parentNode.style.paddingBottom = "15px";

		// Add display of errors
		this.addDivider(this.debugMenu.subMenu);
		var errorNames = ["UNKNOWN FAILURE", "BAD DATA", "NETWORK ERROR", "NETWORK ACCESS DENIED",
			"NETWORK FILE NOT FOUND", "NETWORK SERVER ERROR", "NETWORK UNHANDLED RESPONSE CODE",
			"BROWSER WEBGL NOT SUPPORTED", "BAD DATA NO VIEWABLE CONTENT"
		];

		var errorList = this.addOptionList(subMenu, "Error", errorNames, 0, function(errorIndex) {
			var errorCode = errorIndex + 1;
			zvp.ErrorHandler.reportError(viewer.container, errorCode, "");
		}, null);
		errorList.parentNode.style.paddingBottom = "15px";

		var subMenuBounds = subMenu.getBoundingClientRect();
		this.debugMenu.subMenu.style.width = subMenuBounds.width + "px";
		this.container.removeChild(subMenu);
		button.container.appendChild(subMenu);

		// Check if the menu fits on the right site and if not, adjust the right edge.
		var right = subMenuBounds.left + subMenuBounds.width;
		var rightBoundary = this.container.getBoundingClientRect().right;
		if(right > rightBoundary) {
			var leftAdjustment = -(right - rightBoundary + 10) + "px";
			this.debugMenu.subMenu.style.left = leftAdjustment;
		}

		button.onMouseOver = function(e) {
			subMenu.classList.remove('zu-hidden');
		};

		button.onMouseOut = function(e) {
			subMenu.classList.add('zu-hidden');
		};

		if(zv.isTouchDevice()) {
			button.onClick = function(e) {
				subMenu.classList.toggle('zu-hidden')
			};
		}
	};

	GuiViewer3D.prototype.initModelStats = function() {

		var self = this;

		function updateModelStatContent(message) {
			var viewer = self.impl;
			var text = "";
			var model = self.model;
			if(model) {
				text += "Geom&nbsp;polys:&nbsp;" + viewer.modelQueue().getGeometryList().geomPolyCount + "<br>";
				text += "Instance&nbsp;polys:&nbsp;" + viewer.modelQueue().getGeometryList().instancePolyCount + "<br>";
				text += "Fragments:&nbsp;" + viewer.modelQueue().getFragmentList().getCount() + "<br>";
				text += "Geoms:&nbsp;" + viewer.modelQueue().getGeometryList().geoms.length + "<br>";
				text += "Loading&nbsp;time:&nbsp;" + (viewer.model.loader.loadTime / 1000).toFixed(2) + " s" + "<br>";
			}
			text += "# " + (message || "");

			self.modelStats.innerHTML = text;
		}

		// On progress update debug text.
		//
		function createModelStats() {
			self.modelStats = document.createElement("div");
			self.modelStats.className = "statspanel";
			self.container.appendChild(self.modelStats);

			self.addEventListener(zv.PROGRESS_UPDATE_EVENT, function(e) {
				if(e.message) {
					updateModelStatContent(e.message);
				}
			});

			self.fpsDisplay = document.createElement("div");
			self.fpsDisplay.className = "fps";
			self.container.appendChild(self.fpsDisplay);
		}

		this.addOptionToggle(this.debugMenu.subMenu, "Model statistics", false, function(checked) {

			if(checked && !self.modelStats) {
				createModelStats();
				updateModelStatContent("");
			}

			self.modelStats.style.visibility = (checked ? "visible" : "hidden");
			self.fpsDisplay.style.visibility = (checked ? "visible" : "hidden");

			if(checked) {
				self.impl.fpsCallback = function(fps) {
					self.fpsDisplay.textContent = "" + (0 | fps);
				}
			} else {
				self.impl.fpsCallback = null;
			}
		});

	};

	GuiViewer3D.prototype.initEscapeHandlers = function() {
		var viewer = this;

		this.addEventListener(zv.ESCAPE_EVENT, function(event) {
			if(viewer.contextMenu && viewer.contextMenu.hide()) {
				return;
			}

			// Render options isn't enabled in release, so don't try to manipulate it
			if(viewer.renderoptions) {
				// Close render settings panel
				if(viewer.renderoptions.isVisible()) {
					viewer.renderoptions.setVisible(false);
					return;
				}
			}

			// TODO: stop any active animation

			// Reset default navigation mode:
			if(viewer.getActiveNavigationTool() !== viewer.getDefaultNavigationToolName()) {
				// Force unlock active tool:
				if(viewer.toolController)
					viewer.toolController.setIsLocked(false);

				viewer.setActiveNavigationTool();
				zvp.HudMessage.dismiss();
				return;
			}

			// Deselect
			if(viewer.selectionActive) {
				viewer.clearSelection();
				return;
			}

			// Show all if anything is hidden
			if(!viewer.areAllVisible()) {
				viewer.showAll();
				return;
			}

			// Close open alert windows
			if(zvp.AlertBox.dismiss()) {
				return;
			}

			// Close open windows
			for(var i = 0; i < viewer.dockingPanels.length; ++i) {
				var panel = viewer.dockingPanels[i];
				if(panel.container.style.display !== "none" && panel.container.style.display !== "") {
					// NB: Since the document structure panel state is reflected
					//     in the toolbar, we need to update that as well.
					if(panel.container === viewer.modelstructure) {
						viewer.showModelStructurePanel(false);
					} else {
						panel.setVisible(false);
					}
					return;
				}
			}

			if(viewer.escapeScreenMode()) {
				return;
			}
		});
	};

	GuiViewer3D.prototype.showViewCubeUI = function(show) {
		this.viewCubeUi.setVisible(show);
	};

	GuiViewer3D.prototype.showViewCubeTriad = function(show) {
		this.viewCubeUi.showTriad(show);
	};

	GuiViewer3D.prototype.displayViewCube = function(display, updatePrefs) {
		this.viewCubeUi.displayViewCube(display, updatePrefs);
	};

	/**
	 * Hides the Home button next to the ViewCube.
	 * There is no info button any more.
	 * Please use `displayHomeButton(show)` instead.
	 * 
	 * @deprecated 
	 * @param {boolean} show 
	 */
	GuiViewer3D.prototype.displayHomeandInfoButton = function(show) { // show/hide home button.
		zvp.logger.info('viewer.displayHomeandInfoButton() is deprecated. Use viewer.displayHomeButton() instead.');
		this.displayHomeButton(show);
	};

	/**
	 * Hides the Home button next to the ViewCube.
	 * 
	 * @param {boolean} show 
	 */
	GuiViewer3D.prototype.displayHomeButton = function(show) { // show/hide home button.
		var home = this.container.querySelector('.homeViewWrapper');

		if(home) {
			home.style.display = show ? '' : 'none';
		}
	};

	/**
	 * Returns a toolbar.
	 * @param {boolean} create - If true and the toolbar does not exist, it will be created.
	 * @returns {ZhiUTech.Viewing.UI.ToolBar} Returns the toolbar.
	 */
	GuiViewer3D.prototype.getToolbar = function(create) {
		if(!this.toolbar) {
			if(create) {
				var AVU = zv.UI;
				this.toolbar = new AVU.ToolBar('guiviewer3d-toolbar');

				this.navTools = new AVU.RadioButtonGroup(zv.TOOLBAR.NAVTOOLSID);
				this.modelTools = new AVU.ControlGroup(zv.TOOLBAR.MODELTOOLSID);
				this.settingsTools = new AVU.ControlGroup(zv.TOOLBAR.SETTINGSTOOLSID);

				this.toolbar.addControl(this.navTools);
				this.toolbar.addControl(this.modelTools);
				this.toolbar.addControl(this.settingsTools);

				this.container.appendChild(this.toolbar.container);
				this.toolbar.container.style.display = 'none'; // Will make visible when TOOLBAR_CREATED_EVENT fires
			}
		}
		return this.toolbar;
	};

	GuiViewer3D.prototype.showModelStructurePanel = function(show) {
		this.modelstructure.setVisible(show);
	};

	GuiViewer3D.prototype.onPanelVisible = function(panel) {

		// Shift this window to the top of the list, so that it will be closed first
		//
		this.dockingPanels.splice(this.dockingPanels.indexOf(panel), 1);
		this.dockingPanels.splice(0, 0, panel);
	};

	GuiViewer3D.prototype.updateFullscreenButton = function(mode) {
		var cls = "zu-icon-fullscreen";

		switch(mode) {
			case zv.ScreenMode.kNormal:
				if(!this.isScreenModeSupported(zv.ScreenMode.kFullBrowser)) {
					cls = 'zu-icon-fullscreen';
				}
				break;
			case zv.ScreenMode.kFullBrowser:
				if(this.isScreenModeSupported(zv.ScreenMode.kFullScreen)) {
					cls = 'zu-icon-fullscreen';
				} else {
					cls = 'zu-icon-fullscreen-exit';
				}
				break;
			case zv.ScreenMode.kFullScreen:
				cls = 'zu-icon-fullscreen-exit';
				break;
		}

		this.settingsTools.fullscreenbutton.setIcon(cls);
	};

	GuiViewer3D.prototype.localize = function() {

		zv.i18n.localize();

		if(this.debugMenu && this.debugMenu.debugSubMenuButton) {
			this.debugMenu.debugSubMenuButton.container.removeChild(this.debugMenu.subMenu);
			this.createDebugSubmenu(this.debugMenu.debugSubMenuButton);
		}

		zvp.ErrorHandler.localize();
	};

	/**
	 * Adds a panel to the viewer. The panel will be moved and resized if the viewer
	 * is resized and the panel falls outside of the bounds of the viewer.
	 *
	 * @param {ZhiUTech.Viewing.UI.PropertyPanel} panel - The panel to add.
	 * @returns {boolean} True if panel was successfully added.
	 *
	 */
	GuiViewer3D.prototype.addPanel = function(panel) {
		var index = this.dockingPanels.indexOf(panel);
		if(index === -1) {
			this.dockingPanels.push(panel);
			return true;
		}
		return false;
	};

	/**
	 * Removes a panel from the viewer. The panel will no longer be moved and
	 * resized if the viewer is resized.
	 *
	 * @param {ZhiUTech.Viewing.UI.PropertyPanel} panel - The panel to remove.
	 * @returns {boolean} True if panel was successfully removed.
	 */
	GuiViewer3D.prototype.removePanel = function(panel) {
		var index = this.dockingPanels.indexOf(panel);
		if(index > -1) {
			this.dockingPanels.splice(index, 1);
			return true;
		}
		return false;
	};

	/**
	 * Resizes the panels currently held by the viewer.
	 * @param {object} [options] - An optional dictionary of options.
	 * @param {array} [options.dockingPanels=all] - A list of panels to resize.
	 * @param {object} [options.viewer] - The viewer to use, specify if this method is being used as a callback.
	 * @param {object} [options.dimensions] - The area for the panels to occupy.
	 * @param {number} options.dimensions.width - Width.
	 * @param {number} options.dimensions.height - Height.
	 */
	GuiViewer3D.prototype.resizePanels = function(options) {

		options = options || {};

		var toolbarHeight = this.toolbar.getDimensions().height;
		var dimensions = this.getDimensions();
		var maxHeight = dimensions.height;

		if(options.dimensions && options.dimensions.height) {
			maxHeight = options.dimensions.height;
		} else {
			options.dimensions = {
				height: dimensions.height,
				width: dimensions.width
			};
		}

		options.dimensions.height = maxHeight - toolbarHeight;

		var viewer = options ? options.viewer : null;
		if(!viewer) {
			viewer = this;
		}

		var dockingPanels = options ? options.dockingPanels : null;
		if(!dockingPanels) {
			dockingPanels = viewer.dockingPanels;
		}

		var viewerRect = viewer.container.getBoundingClientRect(),
			vt = viewerRect.top,
			vb = viewerRect.bottom,
			vl = viewerRect.left,
			vr = viewerRect.right,
			vw, vh;

		if(options && options.dimensions) {
			vw = options.dimensions.width;
			vh = options.dimensions.height;
			vb = options.dimensions.height;
		} else {
			vw = viewerRect.width;
			vh = viewerRect.height;
		}

		for(var i = 0; i < dockingPanels.length; ++i) {
			var panel = dockingPanels[i].container,
				panelRect = panel.getBoundingClientRect(),
				pt = panelRect.top,
				pb = panelRect.bottom,
				pl = panelRect.left,
				pr = panelRect.right,
				pw = panelRect.width,
				ph = panelRect.height;

			if(pw && ph) {

				// Panel width should not be greater than viewer width.
				//
				if(vw < pw) {
					pw = Math.round(vw);
					panel.style.width = pw + "px";
				}

				// Panel height should not be greater than viewer height.
				//
				if(vh < ph) {
					ph = Math.round(vh);
					panel.style.height = ph + "px";
				}

				// Adjust horizontally if panel extends beyond right edge of viewer or panel is docked.
				//
				if((vr < pr) || panel.dockRight) {
					pl = Math.round(vr - pw - vl);
					panel.style.left = pl + "px";
				}

				// Adjust vertically if panel extends beyond bottom edge of viewer or panel is docked.
				//
				if((vb < pb) || panel.dockBottom) {
					pt = Math.round(vb - ph - vt);
					if(pt < 0) {
						pt = 0;
					}
					panel.style.top = pt + "px";
				}

				// Set panel max width/height based upon viewer width/height.
				//
				panel.style.maxWidth = Math.round(vw) + "px";
				panel.style.maxHeight = Math.round(vh) + "px";
			}
		}

	};

	GuiViewer3D.prototype.initExplodeSlider = function() {
		var viewer = this;

		var explodeButton = new avu.Button('toolbar-explodeTool');
		explodeButton.setIcon("zu-icon-explode");
		explodeButton.setToolTip("Explode model");
		viewer.modelTools.addControl(explodeButton, {
			index: 0
		});

		var htmlString = '<div class="docking-panel docking-panel-container-solid-color-b explode-submenu" style="display:none"><input class="explode-slider" type="range" min="0" max="1" step="0.01" value="0"/></div>';
		this.explodeSubmenu = zvp.stringToDOM(htmlString);

		// hack fix for iOS bug
		// range input not draggable when nested under button
		var parentDom;
		if(ZhiUTech.Viewing.isIOSDevice()) {
			parentDom = document.querySelector("#toolbar-explodeTool").parentNode;
			this.explodeSubmenu.classList.add("ios");
		} else {
			parentDom = explodeButton.container;
		}
		parentDom.appendChild(this.explodeSubmenu);

		var slider = this.explodeSubmenu.querySelector(".explode-slider");
		viewer.explodeSlider = slider;
		slider.oninput = function(e) {
			viewer.explode(slider.value);
		};
		//oninput does not seem to work on IE11...
		slider.onchange = function(e) {
			viewer.explode(slider.value);
		};
		this.explodeSubmenu.onclick = function(e) {
			e.stopPropagation();
		};

		// hack to disable tooltip, actually also problem with ViewerSettingsPanel
		var tooltip = explodeButton.container.querySelector(".zu-control-tooltip");

		explodeButton.onClick = function(e) {
			var state = explodeButton.getState();
			if(state === avu.Button.State.INACTIVE) {
				explodeButton.setState(avu.Button.State.ACTIVE);
				tooltip.style.display = "none";
				viewer.explodeSubmenu.style.display = "";

				// Explode is not handled via ToolController; log it separately for now
				zvp.logger.track({
					category: 'tool_changed',
					name: 'explode'
				});
			} else if(state === avu.Button.State.ACTIVE) {
				explodeButton.setState(avu.Button.State.INACTIVE);
				tooltip.style.display = "";
				slider.parentNode.style.display = "none";
				viewer.explode(0);
				viewer.explodeSlider.value = 0;
			}
		};
	};

	GuiViewer3D.prototype.initInspectTools = function() {
		var viewer = this;

		var inspectToolsButton = new avu.Button("toolbar-inspectTools");
		inspectToolsButton.setToolTip("Inspect");
		inspectToolsButton.setIcon("measure");
		inspectToolsButton.setVisible(false);
		this.modelTools.addControl(inspectToolsButton);

		var inspectSubmenu = new avu.RadioButtonGroup('toolbar-inspectSubMenu');
		inspectSubmenu.addClass('toolbar-vertical-group');
		inspectSubmenu.setVisible(false);
		this.modelTools.addControl(inspectSubmenu);

		// Insert at the beginning so the CSS selector works.
		inspectToolsButton.container.insertBefore(inspectSubmenu.container, inspectToolsButton.container.firstChild);

		inspectToolsButton.onMouseOver = function() {
			inspectSubmenu.setVisible(true);
		};

		inspectToolsButton.onMouseOut = function() {
			inspectSubmenu.setVisible(false);
		};

		if(zv.isTouchDevice()) {
			inspectToolsButton.onClick = function(e) {
				inspectSubmenu.setVisible(!inspectSubmenu.isVisible());
			};
		}
	};

	GuiViewer3D.prototype.initModality = function() {

		function findToolbarParent(elem) {
			var MAX_DEPTH = 2; // arbitrary
			var depth = 0;
			while(depth < MAX_DEPTH && elem.parentElement) {
				var eid = elem.id;
				if(eid.indexOf("toolbar-") === 0) {
					// ignore arrow
					if(eid.indexOf("arrow") === eid.length - 5)
						return undefined;
					// check if submenu, if so, return root button
					var rootButton = findToolbarParent(elem.parentElement);
					return rootButton || elem;
				}
				elem = elem.parentElement;
				depth++;
			}
		}

		function getButtonName(elem) {
			return elem.id.substring(8, elem.id.length);
		}

		function getButtonActive(elem) {
			return elem.classList.contains("active");
		}

		function simulateClick(elem) {
			var event = document.createEvent('Event');
			event.initEvent('click', true, true); //can bubble, and is cancellable
			elem.dispatchEvent(event);
		}

		// tool names registered for modality management
		// this mapping determines what tools are allowed together
		// when a tool is activated, all other tools but the ones allowed here will be disabled
		var modalityMap = {
			orbitTools: {
				explodeTool: 1
			},
			panTool: {
				explodeTool: 1
			},
			zoomTool: {
				explodeTool: 1
			},
			beelineTool: {},
			sectionTool: {
				measureTool: 0,
				calibrateTool: 0
			},
			explodeTool: {
				measureTool: 0,
				calibrateTool: 0,
				firstPersonTool: 1,
				bimWalkTool: 1
			},
			measureTool: {
				section: 0
			},
			billboardTool: {},
			firstPersonTool: {
				explodeTool: 1
			},
			bimWalkTool: {
				explodeTool: 1
			}
		};

		var activeButtons = {};

		function registerButton(name, button, register) {
			activeButtons[name] = register ? button : undefined;
			// zvp.logger.log("modal "+ (register ? "+" : "-") +" " + name);
		}

		function handleModality(e) {

			var classes = (e.target.getAttribute("class") || "").split(/\s+/);

			if(classes.indexOf("clickoff") !== -1)
				return;

			var button = findToolbarParent(e.target);
			if(!button) return;

			var toolName = getButtonName(button);

			// not handled
			if(!modalityMap[toolName])
				return;

			// special case section button, do not handle if initial blank state
			// HACK: use icon class to detect this case
			if(toolName === "sectionTool" && (
					classes.indexOf("zu-icon-section-analysis") !== -1 ||
					e.target.querySelector(".zu-icon-section-analysis")))
				return;

			if(toolName === "measureTool" && (
					classes.indexOf("zu-icon-measure-menu") !== -1 ||
					e.target.querySelector(".zu-icon-measure-menu")))
				return;

			// if already registered as active
			if(activeButtons[toolName]) {
				registerButton(toolName, button, false);
			}

			// loop active buttons, deactivate (i.e., click again) if not allowed in map
			for(var k in activeButtons) {
				var b = activeButtons[k];
				if(!b)
					continue;
				var bname = getButtonName(b);
				if(!getButtonActive(b)) // button already inactive, we're is out of sync, so we just unregister
					registerButton(bname, b, false);
				else if(!modalityMap[toolName][bname]) // if not allowed by map
					simulateClick(b); // HACKY!
			}

			// finally, register active button
			registerButton(toolName, button, true);
		}

		this.toolbar.container.addEventListener("click", handleModality, true);
	};

	/**
	 * Changes visibility of buttons in toolbar to accommodate as many as possible
	 * given the available space.  Think of it as a media query applied to the viewer
	 * canvas only (as opposed to the whole website).
	 */
	GuiViewer3D.prototype.updateToolbarButtons = function(width, height) {

		var toolbar = this.getToolbar(false);
		if(!toolbar) return;

		//zvp.logger.log("resized " + width);
		var ctrl, display;

		// 310px threshold
		display = width > 310 ? "block" : "none";
		ctrl = this.modelTools.getControl('toolbar-explodeTool');
		if(ctrl) ctrl.setDisplay(display);

		// 380px threshold
		display = width > 380 ? "block" : "none";
		ctrl = this.modelTools.getControl('toolbar-collaborateTool');
		if(ctrl) ctrl.setDisplay(display);

		// 515px threshold
		display = width > 515 ? "block" : "none";
		var camMenu = this.navTools.getControl('toolbar-cameraSubmenuTool');
		if(camMenu) {
			camMenu.setDisplay(display);
			ctrl = camMenu.subMenu.getControl('toolbar-homeTool');
			if(ctrl) ctrl.setDisplay(this.navigation.isActionEnabled('gotoview') ? 'block' : 'none');
			ctrl = camMenu.subMenu.getControl('toolbar-fitToViewTool');
			if(ctrl) ctrl.setDisplay(this.navigation.isActionEnabled('gotoview') ? 'block' : 'none');
			ctrl = camMenu.subMenu.getControl('toolbar-focalLengthTool');
			if(ctrl) ctrl.setDisplay(this.navigation.isActionEnabled('fov') ? 'block' : 'none');
			ctrl = camMenu.subMenu.getControl('toolbar-rollTool');
			if(ctrl) ctrl.setDisplay(this.navigation.isActionEnabled('roll') ? 'block' : 'none');
		}

		// 700px threshold
		display = width > 700 ? "block" : "none";
		ctrl = this.modelTools.getControl('toolbar-measureTool');
		if(ctrl) ctrl.setDisplay(display);
		ctrl = this.modelTools.getControl('toolbar-sectionTool');
		if(ctrl) ctrl.setDisplay(display);

		// 740px threshold
		display = width > 740 ? "block" : "none";
		ctrl = this.navTools.getControl('toolbar-beelineTool');
		if(ctrl) ctrl.setDisplay(this.navigation.isActionEnabled('walk') ? display : 'none');
		ctrl = this.navTools.getControl('toolbar-firstPersonTool');
		if(ctrl) ctrl.setDisplay(this.navigation.isActionEnabled('walk') ? display : 'none');
		ctrl = this.navTools.getControl('toolbar-zoomTool');
		if(ctrl) ctrl.setDisplay(this.navigation.isActionEnabled('zoom') ? display : 'none');
		ctrl = this.navTools.getControl('toolbar-panTool');
		if(ctrl) ctrl.setDisplay(this.navigation.isActionEnabled('pan') ? display : 'none');
		ctrl = this.navTools.getControl('toolbar-orbitTools');
		if(ctrl) ctrl.setDisplay(this.navigation.isActionEnabled('orbit') ? display : 'none');
	};

	zvp.GuiViewer3D = GuiViewer3D;

})();;
(function() {

	"use strict";

	var zv = ZhiUTech.Viewing,
		avu = ZhiUTech.Viewing.UI;

	/**
	 * Base class for UI controls.
	 *
	 * It is abstract and should not be instantiated directly.
	 * @param {string} [id] - The id for this control. Optional.
	 * @param {object} [options] - An optional dictionary of options.
	 * @param {boolean} [options.collapsible=true] - Whether this control is collapsible.
	 * @constructor
	 * @abstract
	 * @memberof ZhiUTech.Viewing.UI
	 * @category UI
	 */
	function Control(id, options) {
		this._id = id;
		this._isCollapsible = !options || options.collapsible;

		this._toolTipElement = null;

		this._listeners = {};

		this.container = document.createElement('div');
		this.container.id = id;
		this.addClass('zu-control');
	};

	/**
	 * Enum for control event IDs.
	 * @readonly
	 * @enum {String}
	 */
	Control.Event = {
		VISIBILITY_CHANGED: 'Control.VisibilityChanged',
		COLLAPSED_CHANGED: 'Control.CollapsedChanged'
	};

	/**
	 * Event fired when the visibility of the control changes.
	 *
	 * @event ZhiUTech.Viewing.UI.Control#VISIBILITY_CHANGED
	 * @type {object}
	 * @property {string} controlId - The ID of the control that fired this event.
	 * @property {boolean} isVisible - True if the control is now visible.
	 */

	/**
	 * Event fired when the collapsed state of the control changes.
	 *
	 * @event ZhiUTech.Viewing.UI.Control#COLLAPSED_CHANGED
	 * @type {object}
	 * @property {string} controlId - The ID of the control that fired this event.
	 * @property {boolean} isCollapsed - True if the control is now collapsed.
	 */

	zv.EventDispatcher.prototype.apply(Control.prototype);
	Control.prototype.constructor = Control;

	/**
	 * The HTMLElement representing this control.
	 *
	 * @type {HTMLElement}
	 * @public
	 */
	Control.prototype.container = null;

	/**
	 * Gets this control's ID.
	 *
	 * @returns {string} The control's ID.
	 */
	Control.prototype.getId = function() {
		return this._id;
	};

	/**
	 * Sets the visibility of this control.
	 *
	 * @param {boolean} visible - The visibility value to set.
	 * @returns {boolean} True if the control's visibility changed.
	 * @fires ZhiUTech.Viewing.UI.Control#VISIBILITY_CHANGED
	 */
	Control.prototype.setVisible = function(visible) {
		var isVisible = !this.container.classList.contains('zu-hidden');

		if(isVisible === visible) {
			return false;
		}

		if(visible) {
			this.container.classList.remove('zu-hidden');
		} else {
			this.container.classList.add('zu-hidden');
		}

		var event = {
			type: Control.Event.VISIBILITY_CHANGED,
			target: this,
			controlId: this._id,
			isVisible: visible
		};

		this.dispatchEvent(event);

		return true;
	};

	/**
	 * Gets the visibility of this control.
	 * @returns {boolean} True if the this control is visible.
	 */
	Control.prototype.isVisible = function() {
		return !this.container.classList.contains('zu-hidden');
	};

	/**
	 * Sets the tooltip text for this control.
	 * @param {string} toolTipText - The text for the tooltip.
	 * @returns {boolean} True if the tooltip was successfully set.
	 */
	Control.prototype.setToolTip = function(toolTipText) {
		if(this._toolTipElement && this._toolTipElement.getAttribute("tooltipText") === toolTipText) {
			return false;
		}

		if(!this._toolTipElement) {
			this._toolTipElement = document.createElement('div');
			this._toolTipElement.id = this._id + '-tooltip';
			this._toolTipElement.classList.add('zu-control-tooltip');
			this.container.appendChild(this._toolTipElement);
		}

		this._toolTipElement.setAttribute("data-i18n", toolTipText);
		this._toolTipElement.setAttribute("tooltipText", toolTipText);
		this._toolTipElement.textContent = ZhiUTech.Viewing.i18n.translate(toolTipText, {
			defaultValue: toolTipText
		});

		return true;
	};

	/**
	 * Returns the tooltip text for this control.
	 * @returns {string} The tooltip text. Null if it's not set.
	 */
	Control.prototype.getToolTip = function() {
		return this._toolTipElement && this._toolTipElement.getAttribute("tooltipText");
	};

	/**
	 * Sets the collapsed state of this control.
	 * @param {boolean} collapsed - The collapsed value to set.
	 * @returns {boolean} True if the control's collapsed state changes.
	 * @fires ZhiUTech.Viewing.UI.Control#COLLAPSED_CHANGED
	 */
	Control.prototype.setCollapsed = function(collapsed) {
		if(!this._isCollapsible || this.isCollapsed() === collapsed) {
			return false;
		}

		if(collapsed) {
			this.container.classList.add('collapsed');
		} else {
			this.container.classList.remove('collapsed');
		}

		var event = {
			type: Control.Event.COLLAPSED_CHANGED,
			isCollapsed: collapsed
		};

		this.dispatchEvent(event);

		return true;
	};

	/**
	 * Gets the collapsed state of this control.
	 * @returns {boolean} True if this control is collapsed.
	 */
	Control.prototype.isCollapsed = function() {
		return !!this.container.classList.contains('collapsed');
	};

	/**
	 * Returns whether or not this control is collapsible.
	 * @returns {boolean} True if this control can be collapsed.
	 */
	Control.prototype.isCollapsible = function() {
		return this._isCollapsible;
	};

	/**
	 * Adds a CSS class to this control.
	 * @param {string} cssClass - The name of the CSS class.
	 *
	 */
	Control.prototype.addClass = function(cssClass) {
		this.container.classList.add(cssClass);
	};

	/**
	 * Removes a CSS class from this control.
	 * @param {string} cssClass - The name of the CSS class.
	 */
	Control.prototype.removeClass = function(cssClass) {

		this.container.classList.remove(cssClass);

	};

	/**
	 * Returns the position of this control relative to the canvas.
	 * @returns {object} The top and left values of the toolbar.
	 */
	Control.prototype.getPosition = function() {
		var clientRect = this.container.getBoundingClientRect();

		return {
			top: clientRect.top,
			left: clientRect.left
		};
	};

	/**
	 * Returns the dimensions of this control.
	 * @returns {object} The width and height of the toolbar.
	 */
	Control.prototype.getDimensions = function() {
		var clientRect = this.container.getBoundingClientRect();

		return {
			width: clientRect.width,
			height: clientRect.height
		};
	};

	Control.prototype.setDisplay = function(value) {
		this.container.style.display = value;
	};

	ZhiUTech.Viewing.UI.Control = Control;

})();;
(function() {

	"use strict";

	var avu = ZhiUTech.Viewing.UI;

	/**
	 * Class for grouping controls.
	 *
	 * @param {string} [id] - The id for this control group.
	 * @param {object} [options] - An optional dictionary of options.
	 * @param {boolean} [options.collapsible=true] - Whether this control group is collapsible.
	 * @constructor
	 * @augments ZhiUTech.Viewing.UI.Control
	 * @memberof ZhiUTech.Viewing.UI
	 * @category UI
	 */

	function ControlGroup(id, options) {
		avu.Control.call(this, id, options);

		var self = this;

		this._controls = [];

		this.addClass('zu-control-group');

		this.handleChildSizeChanged = function(event) {
			var sizeEvent = {
				type: ControlGroup.Event.SIZE_CHANGED,
				childEvent: event
			};
			self.dispatchEvent(sizeEvent);
		};
	};

	/**
	 * Enum for control group event IDs.
	 * @readonly
	 * @enum {String}
	 */
	ControlGroup.Event = {
		// Inherited from Control
		VISIBILITY_CHANGED: avu.Control.Event.VISIBILITY_CHANGED,
		COLLAPSED_CHANGED: avu.Control.Event.COLLAPSED_CHANGED,

		SIZE_CHANGED: 'ControlGroup.SizeChanged',
		CONTROL_ADDED: 'ControlGroup.ControlAdded',
		CONTROL_REMOVED: 'ControlGroup.ControlRemoved'
	};

	/**
	 * Event fired a control is added to the control group.
	 *
	 * @event ZhiUTech.Viewing.UI.ControlGroup#CONTROL_ADDED
	 * @type {object}
	 * @property {string} control - The control that was added.
	 * @property {number} index - The index at which the control was added.
	 */

	/**
	 * Event fired when a control is removed from the control group.
	 *
	 * @event ZhiUTech.Viewing.UI.ControlGroup#CONTROL_REMOVED
	 * @type {object}
	 * @property {string} control - The control that was removed.
	 * @property {number} index - The index at which the control was removed.
	 */

	/**
	 * Event fired when the size of the control group changes.
	 *
	 * @event ZhiUTech.Viewing.UI.ControlGroup#SIZE_CHANGED
	 * @type {object}
	 * @property {object} childEvent - The event that the child fired.
	 */

	ControlGroup.prototype = Object.create(avu.Control.prototype);
	ControlGroup.prototype.constructor = ControlGroup;

	/**
	 * Adds a control to this control group.
	 *
	 * @param {ZhiUTech.Viewing.UI.Control} control - The control to add.
	 * @param {object} [options] - An option dictionary of options.
	 * @param {object} [options.index] - The index to insert the control at.
	 * @returns {boolean} True if the control was successfully added.
	 * @fires ZhiUTech.Viewing.UI.ControlGroup#CONTROL_ADDED
	 * @fires ZhiUTech.Viewing.UI.ControlGroup#SIZE_CHANGED
	 */
	ControlGroup.prototype.addControl = function(control, options) {

		var index = (options && options.index !== undefined) ? options.index : this._controls.length;

		if(this.getControl(control.getId()) !== null) {
			return false;
		}

		var addedEvent = {
			type: ControlGroup.Event.CONTROL_ADDED,
			control: control,
			index: index
		};

		if(index < this._controls.length) {
			this.container.insertBefore(control.container, this._controls[index].container);
			this._controls.splice(index, 0, control);
		} else {
			this.container.appendChild(control.container);
			this._controls.push(control);
		}

		// Listen for events on the child controls that may trigger a change in out size
		control.addEventListener(avu.Control.Event.VISIBILITY_CHANGED, this.handleChildSizeChanged);
		control.addEventListener(avu.Control.Event.COLLAPSED_CHANGED, this.handleChildSizeChanged);
		if(control instanceof ControlGroup) {
			control.addEventListener(ControlGroup.Event.SIZE_CHANGED, this.handleChildSizeChanged);
		}

		this.dispatchEvent(addedEvent);
		this.dispatchEvent(ControlGroup.Event.SIZE_CHANGED);

		return true;
	};

	/**
	 * Returns the index of a control in this group. -1 if the item isn't found.
	 * @param {string|ZhiUTech.Viewing.UI.Control} control - The control ID or control instance to find.
	 * @returns {number} Index of a successfully removed control, otherwise -1.
	 */
	ControlGroup.prototype.indexOf = function(control) {
		for(var i = 0; i < this._controls.length; i++) {
			var c = this._controls[i];
			if(c === control || (typeof control === "string" && control === c.getId())) {
				return i;
			}
		}

		return -1;
	};

	/**
	 * Removes a control from this control group.
	 * @param {string|ZhiUTech.Viewing.UI.Control} control - The control ID or control instance to remove.
	 * @returns {boolean} True if the control was successfully removed.
	 * @fires ZhiUTech.Viewing.UI.ControlGroup#CONTROL_REMOVED
	 * @fires ZhiUTech.Viewing.UI.ControlGroup#SIZE_CHANGED
	 */
	ControlGroup.prototype.removeControl = function(control) {

		var thecontrol = (typeof control === "string") ? this.getControl(control) : control;

		if(!thecontrol) {
			return false;
		}

		var index = this._controls.indexOf(thecontrol);
		if(index === -1) {
			return false;
		}

		this._controls.splice(index, 1);
		this.container.removeChild(thecontrol.container);

		var addedEvent = {
			type: ControlGroup.Event.CONTROL_REMOVED,
			control: thecontrol,
			index: index
		};

		// Remove listeners from children
		thecontrol.removeEventListener(avu.Control.Event.VISIBILITY_CHANGED, this.handleChildSizeChanged);
		thecontrol.removeEventListener(avu.Control.Event.COLLAPSED_CHANGED, this.handleChildSizeChanged);
		if(thecontrol instanceof ControlGroup) {
			thecontrol.removeEventListener(ControlGroup.Event.SIZE_CHANGED, this.handleChildSizeChanged);
		}

		this.dispatchEvent(addedEvent);
		this.dispatchEvent(ControlGroup.Event.SIZE_CHANGED);

		return true;
	};

	/**
	 * Returns the control with the corresponding ID if it is in this control group.
	 * @param {string} controlId - The ID of the control.
	 * @returns {ZhiUTech.Viewing.UI.Control} The control or null if it doesn't exist.
	 */
	ControlGroup.prototype.getControl = function(controlId) {
		for(var i = 0; i < this._controls.length; i++) {
			if(controlId === this._controls[i].getId()) {
				return this._controls[i];
			}
		}

		return null;
	};

	/**
	 * Returns the control ID with for corresponding index if it is in this control group.
	 * @param {number} index - Index of the control.
	 * @returns {string} The ID of the control or null if it doesn't exist.
	 */
	ControlGroup.prototype.getControlId = function(index) {

		if(index < 0 || index >= this._controls.length) {
			return null;
		}
		return this._controls[index].getId();
	};

	/**
	 * Returns the number of controls in this control group.
	 * @returns {number} The number of controls.
	 */
	ControlGroup.prototype.getNumberOfControls = function() {
		return this._controls.length;
	};

	/**
	 * Sets the collapsed state of this control group. Iterates over the child controls and calls
	 * child.setCollapsed(collapsed).
	 * @param {boolean} collapsed - The collapsed value to set.
	 * @returns {boolean} True if at least one collapsible child's state changes.
	 * @fires ZhiUTech.Viewing.UI.Control#COLLAPSED_CHANGED
	 */
	ControlGroup.prototype.setCollapsed = function(collapsed) {
		if(!this._isCollapsible) {
			return false;
		}

		var childHasCollapsed = false;

		this._controls.forEach(function(control) {
			if(control.isCollapsible() && control.setCollapsed(collapsed)) {
				childHasCollapsed = true;
			}
		});

		if(childHasCollapsed) {
			if(collapsed) {
				this.container.classList.add('collapsed');
			} else {
				this.container.classList.remove('collapsed');
			}

			this.dispatchEvent({
				type: ControlGroup.Event.COLLAPSED_CHANGED,
				isCollapsed: collapsed
			});
		}

		return childHasCollapsed;
	};

	ZhiUTech.Viewing.UI.ControlGroup = ControlGroup;
})();

;
(function() {

	"use strict";

	var avu = ZhiUTech.Viewing.UI;

	/**
	 * Core class representing a toolbar UI.
	 *
	 * It consists of {@link ZhiUTech.Viewing.UI.ControlGroup} that group controls by functionality.
	 * @alias ZhiUTech.Viewing.UI.ToolBar
	 * @param {string} id - The id for this toolbar.
	 * @param {object} [options] - An optional dictionary of options.
	 * @param {boolean} [options.collapsible=true] - Whether this toolbar is collapsible.
	 * @constructor
	 * @augments ZhiUTech.Viewing.UI.ControlGroup
	 * @memberof ZhiUTech.Viewing.UI
	 * @category UI
	 */
	function ToolBar(id, options) {
		avu.ControlGroup.call(this, id, options);

		this.removeClass('zu-control-group');
		this.addClass('zu-toolbar');
	};

	/**
	 * Enum for toolbar event IDs.
	 * @readonly
	 * @enum {String}
	 */
	ToolBar.Event = {
		// Inherited from Control
		VISIBILITY_CHANGED: avu.Control.Event.VISIBILITY_CHANGED,
		COLLAPSED_CHANGED: avu.Control.Event.COLLAPSED_CHANGED,

		// Inherited from ControlGroup
		CONTROL_ADDED: avu.ControlGroup.Event.CONTROL_ADDED,
		CONTROL_REMOVED: avu.ControlGroup.Event.CONTROL_REMOVED,
		SIZE_CHANGED: avu.ControlGroup.Event.SIZE_CHANGED
	};

	ToolBar.prototype = Object.create(avu.ControlGroup.prototype);
	ToolBar.prototype.constructor = ToolBar;

	ZhiUTech.Viewing.UI.ToolBar = ToolBar;
})();;
(function() {

	"use strict";

	var zv = ZhiUTech.Viewing;
	var avu = ZhiUTech.Viewing.UI;

	/**
	 * Button control that can be added to toolbars.
	 *
	 * @param {string} [id] - The ID for this button. Optional.
	 * @param {object} [options] - An optional dictionary of options.
	 * @param {boolean} [options.collapsible=true] - Whether this button is collapsible.
	 * @constructor
	 * @augments ZhiUTech.Viewing.UI.Control
	 * @memberof ZhiUTech.Viewing.UI
	 * @category UI
	 */
	function Button(id, options) {
		avu.Control.call(this, id, options);

		var self = this;

		this._state = Button.State.INACTIVE;

		this.icon = document.createElement("div");
		this.icon.classList.add("zu-button-icon");
		this.container.appendChild(this.icon);

		this.container.addEventListener('click', function(event) {
			if(self.getState() !== Button.State.DISABLED) {
				self.dispatchEvent(Button.Event.CLICK);
				if(self.onClick)
					self.onClick(event);
			}
			event.stopPropagation();
		});

		// Add rollover only if this is not a touch device.
		if(!zv.isTouchDevice()) {
			this.container.addEventListener("mouseover", function(e) {
				self.onMouseOver(e);
			});

			this.container.addEventListener("mouseout", function(e) {
				self.onMouseOut(e);
			});
		} else {
			this.container.addEventListener("touchstart", zv.touchStartToClick);
		}

		this.addClass('zu-button');
		this.addClass(Button.StateToClassMap[this._state]);
	};

	/**
	 * Enum for button event IDs.
	 * @readonly
	 * @enum {String}
	 */
	Button.Event = {
		// Inherited from Control
		VISIBILITY_CHANGED: avu.Control.Event.VISIBILITY_CHANGED,
		COLLAPSED_CHANGED: avu.Control.Event.COLLAPSED_CHANGED,

		STATE_CHANGED: 'Button.StateChanged',
		CLICK: 'click'
	};

	/**
	 * Enum for button states
	 * @readonly
	 * @enum {Number}
	 */
	Button.State = {
		ACTIVE: 0,
		INACTIVE: 1,
		DISABLED: 2
	};

	/**
	 * @private
	 */
	Button.StateToClassMap = (function() {
		var state = Button.State;
		var map = {};

		map[state.ACTIVE] = 'active';
		map[state.INACTIVE] = 'inactive';
		map[state.DISABLED] = 'disabled';

		return map;
	}());

	/**
	 * Event fired when state of the button changes.
	 *
	 * @event ZhiUTech.Viewing.UI.Button#STATE_CHANGED
	 * @type {object}
	 * @property {string} buttonId - The ID of the button that fired this event.
	 * @property {ZhiUTech.Viewing.UI.Button.State} state - The new state of the button.
	 */

	Button.prototype = Object.create(avu.Control.prototype);
	Button.prototype.constructor = Button;

	/**
	 * Sets the state of this button.
	 *
	 * @param {ZhiUTech.Viewing.UI.Button.State} state - The state.
	 * @returns {boolean} True if the state was set successfully.
	 * @fires ZhiUTech.Viewing.UI.Button#STATE_CHANGED
	 */
	Button.prototype.setState = function(state) {
		if(state === this._state) {
			return false;
		}

		this.removeClass(Button.StateToClassMap[this._state]);
		this.addClass(Button.StateToClassMap[state]);
		this._state = state;

		var event = {
			type: Button.Event.STATE_CHANGED,
			state: state
		};

		this.dispatchEvent(event);

		return true;
	};

	/**
	 * Sets the icon for the button.
	 *
	 * @param {string} iconClass - The CSS class defining the appearance of the button icon (e.g. image background).
	 */
	Button.prototype.setIcon = function(iconClass) {
		if(this.iconClass)
			this.icon.classList.remove(this.iconClass);
		this.iconClass = iconClass;
		this.icon.classList.add(iconClass);
	};

	/**
	 * Returns the state of this button.
	 *
	 * @returns {ZhiUTech.Viewing.UI.Button.State} The state of the button.
	 */
	Button.prototype.getState = function() {
		return this._state;
	};

	/**
	 * Override this method to be notified when the user clicks on the button.
	 * @param {MouseEvent} event
	 */
	Button.prototype.onClick = function(event) {

	};

	/**
	 * Override this method to be notified when the mouse enters the button.
	 * @param {MouseEvent} event
	 */
	Button.prototype.onMouseOver = function(event) {

	};

	/**
	 * Override this method to be notified when the mouse leaves the button.
	 * @param {MouseEvent} event
	 */
	Button.prototype.onMouseOut = function(event) {

	};

	ZhiUTech.Viewing.UI.Button = Button;
})();;
(function() {

	"use strict";

	var avu = ZhiUTech.Viewing.UI;
	var zvp = ZhiUTech.Viewing.Private;

	/**
	 * ComboButton with submenu that can be added to toolbars.
	 *
	 * @param {string} [id] - The id for this comboButton. Optional.
	 * @param {object} [options] - An optional dictionary of options.
	 * @constructor
	 * @augments ZhiUTech.Viewing.UI.Button
	 * @memberof ZhiUTech.Viewing.UI
	 * @category UI
	 */
	function ComboButton(id, options) {
		avu.Button.call(this, id, options);

		this.arrowButton = new avu.Button(id + 'arrow');
		this.arrowButton.addClass('zu-button-arrow');
		this.arrowButton.removeClass('zu-button');

		this.subMenu = new avu.RadioButtonGroup(id + 'SubMenu');
		this.subMenu.addClass('toolbar-vertical-group');
		this.subMenu.setVisible(false);

		this.container.insertBefore(this.subMenu.container, this.container.firstChild);
		this.container.insertBefore(this.arrowButton.container, this.container.firstChild);

		var scope = this;
		this.arrowButton.onClick = function(e) {
			scope.subMenu.setVisible(!scope.subMenu.isVisible());
		};

		this.toggleFlyoutVisible = function() {
			scope.subMenu.setVisible(!scope.subMenu.isVisible());
		};

		this.onClick = function(e) {
			scope.subMenu.setVisible(!scope.subMenu.isVisible());
		};

		this.subMenuActiveButtonChangedHandler = function(event) {
			if(event.isActiveButton) {
				scope.setIcon(event.target.getActiveButton().iconClass);
				scope.setToolTip(event.target.getActiveButton().getToolTip());
				scope.setState(avu.Button.State.ACTIVE);
				scope.onClick = event.button.onClick;
			} else {
				scope.setState(avu.Button.State.INACTIVE);
			}
		};

		this.subMenu.addEventListener(avu.RadioButtonGroup.Event.ACTIVE_BUTTON_CHANGED, this.subMenuActiveButtonChangedHandler);

		// put up an invisible div to catch click-off close submenu
		var clickOff = zvp.stringToDOM('<div class="clickoff" style="position:fixed; top:0; left:0; width:100vw; height:100vh;"></div>');
		this.subMenu.container.insertBefore(clickOff, this.subMenu.container.firstChild);
		clickOff.addEventListener("click", function(e) {
			scope.subMenu.setVisible(false);
			e.stopPropagation();
		});

	};

	ComboButton.prototype = Object.create(avu.Button.prototype);
	ComboButton.prototype.constructor = ComboButton;

	/**
	 * Adds a new control to the combo fly-out.
	 */
	ComboButton.prototype.addControl = function(button) {
		/*
		    if (this.subMenu.getNumberOfControls() === 0)
		        this.onClick = button.onClick;
		*/
		this.subMenu.addControl(button);
		button.addEventListener(avu.Button.Event.CLICK, this.toggleFlyoutVisible);

	};

	ComboButton.prototype.removeControl = function(button) {

		button.removeEventListener(avu.Button.Event.CLICK, this.toggleFlyoutVisible);

	};

	ComboButton.prototype.setState = function(state) {

		//Overloaded to inactivate children when the parent is inactivated
		if(state === avu.Button.State.INACTIVE) {
			var ab = this.subMenu.getActiveButton();
			if(ab) {
				ab.setState(avu.Button.State.INACTIVE);
			}
		}

		//Also call super
		avu.Button.prototype.setState.call(this, state);
	};

	/**
	 * Copies tooltip (if any), icon and click handler into an internal attribute.
	 * Can be restored through restoreDefault().
	 */
	ComboButton.prototype.saveAsDefault = function() {
		this.defaultState = {};
		// Save tooltip
		if(this._toolTipElement && this._toolTipElement.getAttribute("tooltipText")) {
			this.defaultState.tooltip = this._toolTipElement.getAttribute("tooltipText");
		}
		// Save icon
		this.defaultState.icon = this.iconClass;
		// Save click handler
		this.defaultState.onClick = this.onClick;
	};

	/**
	 * Restores visual settings previously stored through saveAsDefault().
	 */
	ComboButton.prototype.restoreDefault = function() {
		if(!this.defaultState) return;
		if(this.defaultState.tooltip) {
			this.setToolTip(this.defaultState.tooltip);
		}
		if(this.defaultState.icon) {
			this.setIcon(this.defaultState.icon);
		}
		this.onClick = this.defaultState.onClick; // No check on this one.
		this.setState(avu.Button.State.INACTIVE);
	};

	ZhiUTech.Viewing.UI.ComboButton = ComboButton;

})();;
(function() {

	"use strict";

	var avu = ZhiUTech.Viewing.UI;

	/**
	 * Group of controls that act like a radio group.
	 *
	 * I.e., only one button may be active at a time. Only accepts {@link ZhiUTech.Viewing.UI.Button}.
	 * @param {string} id - The id for this control group.
	 * @param {object} [options] - An optional dictionary of options.
	 * @param {boolean} [options.collapsible=true] - Whether this control group is collapsible.
	 * @constructor
	 * @augments ZhiUTech.Viewing.UI.ControlGroup
	 * @memberof ZhiUTech.Viewing.UI
	 * @category UI
	 */
	function RadioButtonGroup(id, options) {
		avu.ControlGroup.call(this, id, options);

		var self = this;

		this._activeButton = null;

		this._handleButtonStateChange = function(event) {
			var states = avu.Button.State;

			if(event.state !== states.ACTIVE) {
				if(event.target === self._activeButton) {
					self._activeButton = null;
					self.dispatchEvent({
						type: RadioButtonGroup.Event.ACTIVE_BUTTON_CHANGED,
						button: event.target,
						isActiveButton: false
					});
				}
				return;
			} else {
				self._activeButton = event.target;
				self.dispatchEvent({
					type: RadioButtonGroup.Event.ACTIVE_BUTTON_CHANGED,
					button: event.target,
					isActiveButton: true
				});
			}

			self._controls.forEach(function(control) {
				if(control !== event.target && control.getState() !== states.DISABLED) {
					control.setState(states.INACTIVE);
				}
			});
		}
	};

	/**
	 * Enum for radio button group event IDs.
	 * @readonly
	 * @enum {String}
	 */
	RadioButtonGroup.Event = {
		ACTIVE_BUTTON_CHANGED: 'RadioButtonGroup.ActiveButtonChanged',

		// Inherited from Control
		VISIBILITY_CHANGED: avu.Control.Event.VISIBILITY_CHANGED,
		COLLAPSED_CHANGED: avu.Control.Event.COLLAPSED_CHANGED,

		// Inherited from ControlGroup
		CONTROL_ADDED: avu.ControlGroup.Event.CONTROL_ADDED,
		CONTROL_REMOVED: avu.ControlGroup.Event.CONTROL_REMOVED,
		SIZE_CHANGED: avu.ControlGroup.Event.SIZE_CHANGED
	};

	/**
	 * Event fired when active button for this radio group changes.
	 *
	 * @event ZhiUTech.Viewing.UI.RadioButtonGroup#ACTIVE_BUTTON_CHANGED
	 * @type {object}
	 * @property {ZhiUTech.Viewing.UI.Button} button - The button whose state is changing.
	 * @property {boolean} isActiveButton - Is the event target the currently active button.
	 */

	RadioButtonGroup.prototype = Object.create(avu.ControlGroup.prototype);
	RadioButtonGroup.prototype.constructor = RadioButtonGroup;

	/**
	 * Adds a control to this radio button group. The control must be a {@link ZhiUTech.Viewing.UI.Button|button}.
	 *
	 * @param {ZhiUTech.Viewing.UI.Button} control - The button to add.
	 * @param {object} [options] - An option dictionary of options.
	 * @param {object} [options.index] - The index to insert the control at.
	 * @returns {boolean} True if the button was successfully added.
	 * @fires ZhiUTech.Viewing.UI.ControlGroup#CONTROL_ADDED
	 * @fires ZhiUTech.Viewing.UI.ControlGroup#SIZE_CHANGED
	 */
	RadioButtonGroup.prototype.addControl = function(control, options) {
		if(!(control instanceof avu.Button)) {
			return false;
		}

		// Add listeners for radio functionality if we were successful
		if(avu.ControlGroup.prototype.addControl.call(this, control, options)) {
			control.addEventListener(avu.Button.Event.STATE_CHANGED, this._handleButtonStateChange);
			return true;
		}

		return false;
	};

	/**
	 * Removes a control from this control group.
	 *
	 * @param {string|ZhiUTech.Viewing.UI.Control} control - The control ID or control instance to remove.
	 * @returns {boolean} True if the control was successfully removed.
	 * @fires ZhiUTech.Viewing.UI.ControlGroup#CONTROL_REMOVED
	 * @fires ZhiUTech.Viewing.UI.ControlGroup#SIZE_CHANGED
	 */
	RadioButtonGroup.prototype.removeControl = function(control) {

		var thecontrol = (typeof control == "string") ? this.getControl(control) : control;

		// Remove listeners for radio functionality if we were successful
		if(thecontrol !== null && avu.ControlGroup.prototype.removeControl.call(this, thecontrol)) {
			thecontrol.removeEventListener(avu.Button.Event.STATE_CHANGED, this._handleButtonStateChange);
			return true;
		}

		return false;
	};

	/**
	 * Returns the active button in this radio button group.
	 *
	 * @returns {ZhiUTech.Viewing.UI.Button} The active button. Null if no button is active.
	 */
	RadioButtonGroup.prototype.getActiveButton = function() {
		return this._activeButton;
	};

	ZhiUTech.Viewing.UI.RadioButtonGroup = RadioButtonGroup;
})();;
(function() {
	"use strict";

	var zv = ZhiUTech.Viewing;
	var avu = ZhiUTech.Viewing.UI;

	/**
	 * Base class for UI controls.
	 *
	 * It is abstract and should not be instantiated directly.
	 * @param {string} [id] - The id for this control. Optional.
	 * @param {object} [options] - An optional dictionary of options.
	 * @abstract
	 * @memberof ZhiUTech.Viewing.UI
	 * @category UI
	 */
	function Searchbox(id, viewer, options) {

		this._id = id;
		this._listeners = {};
		this._options = options || {};
		this._searchFunction = this._options.searchFunction || function() {};

		this.container = document.createElement('div');
		this.container.id = id;
		this.addClass('zu-control');
		this.addClass('zu-searchbox');
		this.addClass("empty");

		var searchbox = document.createElement("input");
		searchbox.classList.add("search-box");
		searchbox.classList.add("docking-panel-delimiter-shadow");
		searchbox.type = "search";
		searchbox.results = [];

		searchbox.placeholder = zv.i18n.translate("Search");
		searchbox.setAttribute("data-i18n", "Search");

		searchbox.incremental = "incremental";
		searchbox.autosave = this.container.id + "search_autosave";
		this.container.insertBefore(searchbox, this.scrollContainer);
		this.searchbox = searchbox;

		var clearSearchBox = function() {
			self.searchbox.value = '';
			self.addClass("empty");
		};

		var closeSearchResults = function() {
			self.searchbox.classList.remove('searching');
			self.searchResults.setVisible(false);
		};

		var searchboxIcon = document.createElement("div");
		searchboxIcon.className = "search-box-icon";
		this.container.insertBefore(searchboxIcon, searchbox.nextSibling);

		var searchboxClose = document.createElement("div");
		searchboxClose.className = "search-box-close";
		searchboxClose.addEventListener("click", function() {
			clearSearchBox();
			closeSearchResults();
		});
		this.container.appendChild(searchboxClose);

		this.searchResults = new avu.SearchResults(this.container, options.excludeRoot, viewer);
		this.searchResults.addEventListener(avu.Searchbox.Events.ON_SEARCH_SELECTED, function(event) {
			clearSearchBox();
			closeSearchResults();
			self.fireEvent(event);
		});

		var self = this;
		//ADP
		var trackAdpFirstSearch = true;

		function doSearch() {

			var searchString = searchbox.value.trim();
			if(searchString.length === 0) {
				closeSearchResults();
				return;
			}

			if(trackAdpFirstSearch) {
				zvp.logger.track({
					category: 'search_node',
					name: 'model_browser_tool'
				});
				trackAdpFirstSearch = false;
			}

			// The search is actually a filter that displays results for node-names that contain the search string.
			searchbox.classList.add('searching');

			var resultIds = self._searchFunction(searchString);
			self.searchResults.setResults(searchString, resultIds);
			self.searchResults.setVisible(true);
		}

		var TIMEOUT = 800;
		var timeout;

		searchbox.addEventListener("keydown", function(e) {

			e = e || window.event;

			// Arrow down.
			if(e.keyCode === 38) {
				self.searchResults.selectPrevious();
				e.preventDefault();
			}

			// Arrow down.
			if(e.keyCode === 40) {
				self.searchResults.selectNext();
				e.preventDefault();
			}

			// Enter
			if(e.keyCode === 13) {
				var selection = self.searchResults.getSelection();
				if(!selection) {
					return false;
				}

				clearSearchBox();
				closeSearchResults();

				self.fireEvent({
					type: avu.Searchbox.Events.ON_SEARCH_SELECTED,
					id: selection.nodeId,
					modelId: selection.modelId
				});
				e.preventDefault();
			}
		});

		searchbox.addEventListener("input", function(e) { // delayed: as typing

			// Close the serach result panel, if opened.
			if(this.value.length === 0) {
				self.container.classList.add("empty");
				closeSearchResults();
				return;
			}

			self.container.classList.remove("empty");

			// prevent search while typing text that is too short.
			if(this.value.length < 3) {
				return;
			}

			clearTimeout(timeout);
			timeout = setTimeout(doSearch, TIMEOUT);
		});

		searchbox.addEventListener("change", function(e) { // immediate: press enter
			if(e.target === document.activeElement) {
				clearTimeout(timeout);
				doSearch();
			} else {
				// focus lost, don't search.
			}
		});

		searchbox.addEventListener("focus", function() {
			searchboxIcon.classList.add('focused');
		});

		searchbox.addEventListener("blur", function() {
			searchboxIcon.classList.remove('focused');
		});
	};

	Searchbox.prototype = Object.create(avu.Control.prototype);
	Searchbox.prototype.constructor = Searchbox;

	// Events fired
	Searchbox.Events = {
		ON_SEARCH_SELECTED: 'search-selected'
	};

	ZhiUTech.Viewing.UI.Searchbox = Searchbox;
})();;
(function() {
	"use strict";

	var zv = ZhiUTech.Viewing;
	var avu = ZhiUTech.Viewing.UI;

	/**
	 * Base class for UI controls.
	 *
	 * It is abstract and should not be instantiated directly.
	 * @param {string} [id] - The id for this control. Optional.
	 * @param {object} [options] - An optional dictionary of options.
	 * @abstract
	 * @memberof ZhiUTech.Viewing.UI
	 * @category UI
	 */
	function Filterbox(id, options) {

		this._id = id;
		this._listeners = {};
		this._options = options || {};
		this._filterFunction = this._options.filterFunction || function() {};

		this.container = document.createElement('div');
		this.container.id = id;
		this.addClass('zu-control');
		this.addClass('zu-filterbox');
		this.addClass("empty");

		var filterbox = document.createElement("input");
		filterbox.classList.add("filter-box");
		filterbox.classList.add("docking-panel-delimiter-shadow");
		filterbox.type = "search";

		filterbox.placeholder = zv.i18n.translate('Enter filter term');
		filterbox.setAttribute('data-i18n', 'Enter filter term');

		filterbox.incremental = "incremental";
		filterbox.autosave = this.container.id + "filter";
		this.container.appendChild(filterbox);
		this.filterbox = filterbox;

		var self = this;

		var clearFilterbox = function() {
			self.filterbox.value = '';
			self.addClass("empty");
		};

		var doFilter = function(text) {
			text = text.trim();

			if(text.length === 0) {
				self.container.classList.add("empty");
			} else {
				self.container.classList.remove("empty");
			}

			self._filterFunction && self._filterFunction(text);
		};

		var filterboxIcon = document.createElement("div");
		filterboxIcon.className = "filter-box-icon";
		this.container.insertBefore(filterboxIcon, filterbox.nextSibling);

		var filterboxClose = document.createElement("div");
		filterboxClose.className = "filter-box-close";
		filterboxClose.addEventListener("click", function() {
			clearFilterbox();
		});
		this.container.appendChild(filterboxClose);

		filterbox.addEventListener("keydown", function(e) {

			e = e || window.event;

			// Enter
			if(e.keyCode === 13) {
				self.filterbox.blur();
			}
		});

		filterbox.addEventListener("input", function(e) {
			doFilter(this.value);
		});

		filterbox.addEventListener("change", function(e) {
			doFilter(this.value);
		});

		filterbox.addEventListener("focus", function() {
			filterboxIcon.classList.add('focused');
		});

		filterbox.addEventListener("blur", function() {
			filterboxIcon.classList.remove('focused');
		});
	};

	Filterbox.prototype = Object.create(avu.Control.prototype);
	Filterbox.prototype.constructor = Filterbox;

	ZhiUTech.Viewing.UI.Filterbox = Filterbox;
})();;
(function() {

	"use strict";

	var zv = ZhiUTech.Viewing;
	var avu = ZhiUTech.Viewing.UI;
	var zvp = ZhiUTech.Viewing.Private;

	var ITEM_HEIGHT = 50; // pixels
	var FOOTER_HEIGHT = 20; // pixels
	var ELEMENT_POOL_LENGHT = 150; // count
	var SCROLL_SAFE_PADDING = 100; // pixels

	var SearchResults = function(parent, excludeRoot, viewer) {
		this.excludeRoot = excludeRoot;
		this.viewer = viewer;
		this.results = [];
		this.resultCount = 0;
		this.selectedIndex = -1;

		this.container = document.createElement('div');
		this.container.classList.add('docking-panel');
		this.container.classList.add('zu-search-results');

		this.container.results = document.createElement('div');
		this.container.results.classList.add('docking-panel-scroll');
		this.container.results.classList.add('docking-panel-container-solid-color-b');
		this.container.results.addEventListener('scroll', _onScroll.bind(this));
		this.container.appendChild(this.container.results);
		parent.insertBefore(this.container, parent.firstChild);

		this.scrollingContainer = document.createElement('div');
		this.scrollingContainer.classList.add('zu-search-results-scrolling-panel');
		this.scrollingContainer.addEventListener('click', _onClickResult.bind(this));
		this.container.results.appendChild(this.scrollingContainer);

		this.footer = new zvp.ResizeFooter(this.container, function() {
			var bounds = this.container.getBoundingClientRect();
			var viewerBounds = this.viewer.container.getBoundingClientRect();

			if(viewerBounds.right < bounds.right) {
				this.container.style.width = (viewerBounds.right - bounds.left) + 'px';
			}

			if(viewerBounds.bottom < bounds.bottom) {
				this.container.style.height = (viewerBounds.bottom - bounds.top) + 'px';
			}
		}.bind(this));

		this.divNoResults = createNoResultsDiv();
		this.scrollingContainer.appendChild(this.divNoResults);

		this.scrollY = 0;
		this.dirty = false;
		this.nextFrameId = 0;
		this.it = createIterator();

		// Creates element pools.
		this.elementsPool = [];
		this.elementsUsed = 0;
		for(var i = 0; i < ELEMENT_POOL_LENGHT; ++i) {
			this.elementsPool[i] = createPoolElement();
		}

		this.setVisible(false);
	}

	SearchResults.prototype.constructor = SearchResults;
	zv.EventDispatcher.prototype.apply(SearchResults.prototype);

	SearchResults.prototype.setPosition = function(left, top) {
		this.container.style.left = left + 'px';
		this.container.style.top = top + 'px';
	};

	SearchResults.prototype.setMinWidth = function(minWidth) {
		this.container.style.width = minWidth + 'px';
	};

	SearchResults.prototype.setMaxWidth = function(maxHeight) {
		this.container.style.maxHeight = maxHeight + 'px';
	};

	SearchResults.prototype.setVisible = function(visible) {
		this.container.style.display = visible ? '' : 'none';
	};

	SearchResults.prototype.setResults = function(searchString, results) {
		this.searchString = searchString;
		this.results = results;
		this.resultCount = getResultCount(results);
		this.selectedIndex = this.resultCount == 0 ? -1 : 0;
		this.container.style.height = (this.resultCount * ITEM_HEIGHT + FOOTER_HEIGHT) + 'px';
		this.container.results.scrollTop = 0;
		this.scrollY = 0;

		if(this.resultCount === 0) {
			this.container.classList.add('no-content');
		} else {
			this.container.classList.remove('no-content');
		}

		redraw(this);
	};

	SearchResults.prototype.getSelection = function() {
		var element = this.scrollingContainer.querySelector('.selected');
		if(!element) {
			return null;
		}

		var parts = this._getNodeAndModelIds(element);
		if(!parts) {
			return null;
		}

		return parts;
	};

	SearchResults.prototype.isRootExcluded = function() {
		if(this.results && this.results.length > 1) {
			return false;
		}
		return this.modelCount > 1 ? false : this.excludeRoot;
	};

	SearchResults.prototype.uninitialize = function() {
		this.setVisible(false);
		this.container = null;

		if(this.container.parentNode) {
			this.container.parentNode.removeChild(this.container);
		}

		cancelAnimationFrame(this.nextFrameId);
		this.clearListeners(); // from EventDispatcher
	};

	SearchResults.prototype.setDisplayNoResults = function(display) {
		this.divNoResults.style.display = display ? '' : 'none';
	};

	SearchResults.prototype.selectNext = function() {
		if(this.resultCount !== 0) {
			this.selectedIndex = Math.min(this.resultCount - 1, this.selectedIndex + 1);
			scrollToSelection(this.container.results, this.selectedIndex);
			redraw(this);
		}
	};

	SearchResults.prototype.selectPrevious = function() {
		if(this.resultCount !== 0) {
			this.selectedIndex = Math.max(0, this.selectedIndex - 1);
			scrollToSelection(this.container.results, this.selectedIndex);
			redraw(this);
		}
	};

	/**
	 * @private
	 * @param {*} div
	 * @returns {undefined|{nodeId:Number, modelId:Number}} 
	 */
	SearchResults.prototype._getNodeAndModelIds = function(div) {
		while(!div.hasAttribute('lmv-nodeId')) {
			div = div.parentNode;
			if(!div || div === this.scrollingContainer) {
				return undefined;
			}
		}
		var dbId = parseInt(div.getAttribute('lmv-nodeId'));
		var mdId = parseInt(div.getAttribute('lmv-modelId'));
		return {
			nodeId: dbId,
			modelId: mdId
		};
	};

	/**
	 * Binded to SearchResults instance.
	 * @private
	 */
	function _onClickResult(event) {
		var div = event.target;
		var parts = this._getNodeAndModelIds(div);

		if(!parts) {
			return;
		}

		this.fireEvent({
			type: avu.Searchbox.Events.ON_SEARCH_SELECTED,
			id: parts.nodeId,
			modelId: parts.modelId
		});
		event.preventDefault();
	};

	/**
	 * Binded to SearchResults instance.
	 * @private
	 */
	function _onScroll(event) {
		// Avoid re-building the tree unless we have scrolled far enough.
		var scrollY = this.container.results.scrollTop;
		if(Math.abs(this.scrollY - scrollY) >= SCROLL_SAFE_PADDING) {
			this.scrollY = scrollY;
			redraw(this);
		}
	};

	function redraw(panel, immediate) {
		// If the panel is not dirty, marked as dirty and schedule an update during next frame.
		if(panel.dirty && !immediate) {
			return;
		}

		if(immediate) {
			renderNow(panel);
		} else {
			panel.dirty = true;

			// All update requests are executed as one during next frame.
			panel.nextFrameId = requestAnimationFrame(function() {
				renderNow(panel);
			});
		}
	}

	function renderNow(panel) {
		panel.dirty = false;
		clearElements(panel);

		if(panel.resultCount === 0) {
			panel.setDisplayNoResults(true);
			return;
		}

		panel.setDisplayNoResults(false);
		createVisibleElements(panel);
	}

	function clearElements(panel) {

		var elementsUsed = panel.elementsUsed;
		var elementsPool = panel.elementsPool;

		// Return used elements to the elements pool.
		for(var i = 0; i < elementsUsed; ++i) {
			var element = elementsPool[i];
			cleanPoolElement(element);
		}

		panel.elementsUsed = 0
	}

	function createVisibleElements(panel) {
		var container = panel.container.results;
		var currY = 0;
		var idx = 0;

		var CONTAINER_HEIGHT = container.clientHeight;
		var currScroll = panel.scrollY;
		var it = panel.it.init(panel.results);

		// skip rows above the scrolling area
		var skipY = Math.max(0, panel.scrollY - SCROLL_SAFE_PADDING);
		var skipCount = Math.floor(skipY / ITEM_HEIGHT) | 0;
		var itemIndex = 0;
		currY = skipCount * ITEM_HEIGHT;
		while(skipCount) {
			skipCount--;
			itemIndex++;
			it.next();
		}
		var paddingElement = panel.elementsPool[panel.elementsUsed++];
		paddingElement.style.height = currY + 'px';
		panel.scrollingContainer.appendChild(paddingElement);

		// Start rendering items until we don't have any more vertical space.
		var adding = true;
		while(adding) {

			// Advance the iterator
			it.next();
			if(it.done()) {
				adding = false;
				break;
			}

			// Any more room vertically?
			if(currY > currScroll + CONTAINER_HEIGHT + SCROLL_SAFE_PADDING) {
				adding = false;
				break;
			}

			// Any more DIVs in the pool?
			if(panel.elementsUsed === panel.elementsPool.length) {
				adding = false;
				break;
			}

			var id = it.id();
			var delegate = it.delegate();
			var elemHeight = ITEM_HEIGHT;
			var elemTop = currY;
			var elemBtm = elemTop + elemHeight;

			var element = panel.elementsPool[panel.elementsUsed++];
			populateResultEntry(id, delegate, element, panel, itemIndex === panel.selectedIndex);

			panel.scrollingContainer.appendChild(element);

			// move height counter
			currY = elemBtm;
			itemIndex++;
		}

		// account for non-rendered elements at the bottom
		var totalY = panel.resultCount * ITEM_HEIGHT;
		panel.scrollingContainer.style.height = totalY + 'px';
	}

	/**
	 * @param {Array} results 
	 * @returns {Number} The amount of search results across all loaded models.
	 */
	function getResultCount(results) {
		var count = 0;
		for(var m = 0; m < results.length; ++m) {
			var modelResults = results[m];
			count += modelResults.ids.length;
		}
		return count;
	}

	/**
	 * Returns an iterator specialized for search results, which consists of an Array containing
	 * objects with { delegate:TreeDelegate, ids: Array<Number> } 
	 * 
	 * Must invoke init() before usage.
	 */
	function createIterator() {

		var iterator = {
			init: function(results) {
				this.isDone = false;
				this.results = results; // doesn't mutate it.
				this.indexRs = 0; // Index into `results`
				this.indexId = -1; // Index into `ids`
				return this;
			},
			done: function() {
				return this.isDone;
			},
			next: function() {
				if(this.isDone) {
					return this;
				}
				this.indexId++;
				while(this.results.length !== this.indexRs && this.indexId === this.results[this.indexRs].ids.length) {
					this.indexId = 0;
					this.indexRs++;
				}
				this.isDone = (this.indexRs === this.results.length);
				return this;
			},
			id: function() {
				return this.results[this.indexRs].ids[this.indexId];
			},
			delegate: function() {
				return this.results[this.indexRs].delegate;
			}
		};

		return iterator;
	}

	function populateResultEntry(id, delegate, element, panel, selected) {
		// Set the height, always.
		element.classList.add('search-result');

		// Add / Remove selection class.
		if(selected) {
			element.classList.add('selected');
		} else {
			element.classList.remove('selected');
		}

		// Attributes
		element.setAttribute("lmv-nodeId", id);
		element.setAttribute('lmv-modelId', delegate.model.id);
		element.style.height = ITEM_HEIGHT + 'px';

		// Get the label
		var nodeName = delegate.instanceTree.getNodeName(id);

		// Find the matching substring
		var searchString = panel.searchString;
		var index = nodeName.toLowerCase().indexOf(searchString.toLowerCase());

		var prefixStr = nodeName.substr(0, index);
		var matchStr = nodeName.substr(index, searchString.length);
		var sufixStr = nodeName.substr(index + searchString.length);

		element.domPrefix.innerText = prefixStr;
		element.domMatch.innerText = matchStr;
		element.domSufix.innerText = sufixStr;

		// Populate path
		var route = getParentLabels(id, delegate, panel);
		element.domPath.innerText = route.join(' > ');
	}

	function getParentLabels(id, delegate, panel) {
		var res = [];
		var rootId = delegate.getRootId();
		var excludeRoot = panel.isRootExcluded();
		var instanceTree = delegate.instanceTree;
		var parentId = id;
		var done = false;
		while(parentId && !done) {
			if(parentId === rootId) {
				// Include root and nothing else.
				// The root might be a doubleRoot, thus we need an explicit stop.
				done = true;
				if(excludeRoot) {
					break; // avoid including the root in this case.
				}
			}
			var label = instanceTree.getNodeName(parentId);
			res.unshift(label); // add to front
			parentId = instanceTree.getNodeParentId(parentId);
		}
		return res;
	}

	/**
	 * @private
	 */
	function createPoolElement() {
		var element = document.createElement('div');
		var innerElem = document.createElement('div');

		var prefix = document.createElement('span');
		var match = document.createElement('span');
		var sufix = document.createElement('span');
		var path = document.createElement('span');

		innerElem.classList.add('search-result-container');
		match.classList.add('search-match');
		path.classList.add('search-path');

		innerElem.appendChild(prefix);
		innerElem.appendChild(match);
		innerElem.appendChild(sufix);
		innerElem.appendChild(path);
		element.appendChild(innerElem);

		// Keep easy to access pointers
		element.domPrefix = prefix;
		element.domMatch = match;
		element.domSufix = sufix;
		element.domPath = path;
		element.domContainer = innerElem;

		return element;
	}

	/**
	 * @private
	 */
	function cleanPoolElement(element) {
		element.setAttribute('lmv-nodeId', '');
		element.setAttribute('lmv-modelId', '');
		element.domPrefix.innerText = '';
		element.domMatch.innerText = '';
		element.domSufix.innerText = '';
		element.domPath.innerText = '';
		element.style.height = '0';
	}

	/**
	 * @private
	 */
	function createNoResultsDiv() {

		var divNoResults = document.createElement('div');
		var divTitle = document.createElement('div');
		var divMessage = document.createElement('div');

		// container
		divNoResults.classList.add('no-results-container');
		divNoResults.style.display = 'none';

		// title
		var textTitle = 'No Results';
		divTitle.setAttribute('data-i18n', textTitle);
		divTitle.textContent = ZhiUTech.Viewing.i18n.translate(textTitle);
		divTitle.classList.add('no-results-title');

		// message
		var textMessage = 'Try another term';
		divMessage.setAttribute('data-i18n', textMessage);
		divMessage.textContent = ZhiUTech.Viewing.i18n.translate(textMessage);
		divMessage.classList.add('no-results-description');

		divNoResults.appendChild(divTitle);
		divNoResults.appendChild(divMessage);

		// Keep easy to access pointers
		divNoResults.domTitle = divTitle;
		divNoResults.domMessage = divMessage;

		return divNoResults;
	};

	/**
	 * @private
	 */
	function scrollToSelection(results, selectedIndex) {
		if((results.scrollTop + results.clientHeight) < (selectedIndex + 1) * ITEM_HEIGHT) {
			results.scrollTop += (selectedIndex + 1) * ITEM_HEIGHT - (results.scrollTop + results.clientHeight);
		}
		if(results.scrollTop / ITEM_HEIGHT > selectedIndex) {
			results.scrollTop = selectedIndex * ITEM_HEIGHT;
		}
	}

	// export
	avu.SearchResults = SearchResults;

})();;

(function() {

	/**
	 * Mobile callbacks wrapper, consolidating all calls to iOS and Android platforms
	 */
	ZhiUTechNamespace('ZhiUTech.Viewing');

	function MobileCallbacks() {
		this.ios = window.webkit;
		this.android = window.JSINTERFACE;

		this.iosSend = function(commandName, args) {
			return window.webkit.messageHandlers.callbackHandler.postMessage({
				'command': commandName,
				'data': args
			});
		};

		this.androidSend = window.JSINTERFACE;
	}

	var proto = MobileCallbacks.prototype;

	proto.animationReady = function() {
		if(this.ios)
			this.iosSend('animationReady');
		else if(this.android)
			this.androidSend.animationReady();
	};

	proto.onSelectionChanged = function(dbId) {
		if(this.ios)
			this.iosSend('selectionChanged', dbId);
		else if(this.android)
			this.androidSend.onSelectionChanged(dbId);
	};

	proto.onLongTap = function(clientX, clientY) {
		if(this.ios)
			this.iosSend('onLongTap', [clientX, clientY]);
		else if(this.android)
			this.androidSend.onLongTap(clientX, clientY);
	};

	proto.onSingleTap = function(clientX, clientY) {
		if(this.ios)
			this.iosSend('onSingleTap', [clientX, clientY]);
		else if(this.android)
			this.androidSend.onSingleTap(clientX, clientY);
	};

	proto.onDoubleTap = function(clientX, clientY) {
		if(this.ios)
			this.iosSend('onDoubleTap', [clientX, clientY]);
		else if(this.android)
			this.androidSend.onDoubleTap(clientX, clientY);
	};

	proto.setRTCSession = function(id) {
		if(this.ios)
			this.iosSend('setRTCSession', {
				'id': id
			});
		else if(this.android)
			this.androidSend.setRTCSessionID(id);
	};

	proto.putProperties = function(name, value) {
		if(this.ios)
			this.iosSend('putProperties', {
				'name': name,
				'value': value
			});
		else if(this.android)
			this.androidSend.putProperties(name, value);
	};

	proto.onPropertyRetrievedSuccess = function() {
		if(this.ios)
			this.iosSend('onPropertyRetrievedSuccess');
		else if(this.android)
			this.androidSend.onPropertyRetrievedSuccess();
	};

	proto.onPropertyRetrievedFailOrEmptyProperties = function() {
		if(this.ios)
			this.iosSend('onPropertyRetrievedFailOrEmptyProperties');
		else if(this.android)
			this.androidSend.onPropertyRetrievedFailOrEmptyProperties();
	};

	proto.resetAnimationStatus = function() {
		if(this.ios)
			this.iosSend('resetAnimationStatus');
		else if(this.android)
			this.androidSend.resetAnimationStatus();
	};

	proto.setPauseUI = function() {
		if(this.ios)
			this.iosSend('setPauseUI');
		else if(this.android)
			this.androidSend.setToPaused();
	};

	proto.getDeviceAvailableMemory = function() {
		// Returns a JSON in the format of:
		// {"platform": "Android", "device": "hammerhead", "model": "Nexus 5", "os": "6.0", "totalmem": 1945100288, "availbytes": 907812864}
		if(this.ios)
			return this.iosSend('getDeviceAvailableMemory');
		else if(this.android)
			return this.androidSend.getDeviceAvailableMemory();
	}

	proto.onDeviceMemoryInsufficient = function() {
		if(this.ios)
			return this.iosSend('onDeviceMemoryInsufficient');
		else if(this.android)
			return this.androidSend.onDeviceMemoryInsufficient();
	}

	proto.updateAnimationTime = function(time) {
		if(this.ios)
			this.iosSend('updateAnimationTime', time);
		else if(this.android)
			this.androidSend.updateAnimationTime(time);
	};

	proto.setLoadingProgress = function(state, progress) {
		if(this.ios)
			this.iosSend('setLoadingProgress', {
				'state': state,
				'progress': progress
			});
		else if(this.android)
			this.androidSend.setLoadingProgress(state, progress);
	};

	proto.objectTreeCreated = function() {
		if(this.ios)
			this.iosSend('objectTreeCreated');
		else if(this.android)
			this.androidSend.objectTreeCreated();
	};

	proto.geometryLoaded = function() {
		if(this.ios)
			this.iosSend('geometryLoaded');
		else if(this.android)
			this.androidSend.geometryLoaded();
	};

	proto.putSheets = function(geomName, geomGuid) {
		if(this.ios)
			this.iosSend('putSheets', [geomName, geomGuid]);
		else if(this.android)
			this.androidSend.putSheets(geomName, geomGuid);
	};

	proto.putAllSheets = function(sheets) {
		if(this.ios)
			this.iosSend('putAllSheets', sheets);
		else if(this.android)
			this.androidSend.putAllSheets(sheets);
	};

	proto.hideLoadingView = function() {
		if(this.android)
			this.androidSend.hideLoadingView();
	};

	proto.instanceTree = function(treeJson) {
		if(this.ios)
			this.iosSend('instanceTree', treeJson);
		else if(this.android)
			this.androidSend.instanceTree(treeJson);
	};

	proto.loadSheetFailed = function() {
		if(this.ios)
			this.iosSend('loadSheetFailed');
		else if(this.android)
			this.androidSend.loadSheetFailed();
	};

	proto.sheetSelected = function(sheet) {
		if(this.ios)
			this.iosSend('sheetSelected', sheet);
		else if(this.android)
			this.androidSend.sheetSelected(sheet);
	}

	ZhiUTech.Viewing.MobileCallbacks = MobileCallbacks;
	window.MobileCallbacks = MobileCallbacks; // Backwards compatibility. Consider removing.

})();; //Functional wrapper around a bubble manifest json providing common functionality needed by Fluent

(function() {

	"use strict";

	var nextId = 1;

	function checkForPropertyDb(item) {
		if(item.mime == "application/zhiutech-db" && item.urn) {
			//Of course, OSS is a storage system that mangles paths because why not,
			//so it needs special handling to extract the property database path
			if(item.urn.indexOf("urn:zu.objects:os.object") === 0)
				return item.urn.substr(0, item.urn.lastIndexOf("%2F") + 3);
			else
				return item.urn.substr(0, item.urn.lastIndexOf("/") + 1);
		}
		return null;
	}

	/**
	 * Wrapper and helper for "bubble" data.
	 *
	 * _Bubble_ is a container of various 2D or 3D viewables (and additional data)
	 * that may be generated from a single seed file. The bubble is a JSON structure
	 * of nodes that have different roles, for example, they may represent sheets,
	 * nested 2D/3D geometry, etc.
	 *
	 * This class wraps the internal representation of the bubble
	 * and adds a couple of helper methods.
	 *
	 * @constructor
	 * @memberof ZhiUTech.Viewing
	 * @alias ZhiUTech.Viewing.BubbleNode
	 * @param {object} rawNode Raw node from the bubble JSON.
	 * @param {object} [parent] Parent node from the bubble JSON.
	 * @category Core
	 */
	var BubbleNode = function(rawNode, parent) {

		this.parent = parent;

		//Just an integer ID for use in runtime hashmaps
		this.id = nextId++;

		//TODO: do we need to clone the data into outselves, or just keep pointer as is
		//would be a waste of space to copy...
		this.data = rawNode;

		//Now do some postprocessing / precomputation of things we will need
		//TODO: are there nodes with type==geometry where role isn't 3d nor 2d?
		this.isLeaf = (rawNode.type === "geometry" && (rawNode.role === "3d" || rawNode.role === "2d" || rawNode.role === "lod"));

		this.extractRevitMetadata();

		if(Array.isArray(rawNode.children)) {
			this.children = [];

			//Recurse
			var len = rawNode.children.length;

			for(var i = 0; i < len; i++) {
				this.children[i] = new BubbleNode(rawNode.children[i], this);
			}

			//Some more postprocessing / precomputation of things we will need
			//Some properties are determined by specific children. Look for those.
			for(var i = 0; i < len; i++) {
				//Find the node's shared property db path -- if there is one, it's one of the children
				var path = checkForPropertyDb(rawNode.children[i]);
				if(path)
					this.sharedPropertyDbPath = path;

				//Check if a child geometry is an LOD model
				//TODO: expect a change in the extractor to put the lod role in the node itself
				//so this check will be made on item instead of its children eventually.
				if(rawNode.children[i].role === "lod")
					this.lodNode = this.children[i];
			}
		}
	};

	BubbleNode.prototype.constructor = BubbleNode;

	/**
	 * @returns {bool} returns true if the bubble hierarchy contains an embedded otg manifest.
	 */
	BubbleNode.prototype.isOtg = function() {
		return !!this._getOtgManifest();
	};

	/**
	 * Find the embedded otg_manifest (if avaialble)
	 * @private
	 * @returns {Object|null}
	 */
	BubbleNode.prototype._getOtgManifest = function() {

		if((typeof DISABLE_OTG !== "undefined") && DISABLE_OTG)
			return null;

		var viewable = this.findViewableParent();

		if(!viewable)
			return null;

		var m = viewable.data.otg_manifest;

		//This falls back to no OTG in case OTG conversion
		//is still pending or failed, or otherwise not succeeded.
		//TODO: Probably not the right place for this check in case
		//the application needs to check on the conversion progress, etc...
		//if (!m || m.status !== "success")
		//	return null;

		return m;
	};

	// Returns the otg viewable from an otg manifest (if available, otherwise undef)
	BubbleNode.prototype.getOtgGraphicsNode = function() {
		var otgManifest = this._getOtgManifest();
		return otgManifest && otgManifest.views && otgManifest.views[this.guid()];
	};

	//Returns a list of property database files
	//Previously, for v1, this list was hardcoded in PropWorker/
	//This function knows about v2 and cross-version sharing of OTG property databases
	BubbleNode.prototype.getPropertyDbManifest = function() {
		var otgManifest = this._getOtgManifest();
		var result;

		if(otgManifest && otgManifest.pdb_manifest) {

			var pdbManifest = otgManifest.pdb_manifest;
			result = {};

			for(var i = 0; i < pdbManifest.assets.length; i++) {
				var asset = pdbManifest.assets[i];

				//OTG v2 property databases do not have a single root path.
				//They have shared (cross-version) components and also per-version
				//components. Construct the paths accordingly.
				var path;
				if(asset.isShared) {
					path = otgManifest.paths.shared_root + pdbManifest.pdb_shared_rel_path;
				} else {
					path = otgManifest.paths.version_root + pdbManifest.pdb_version_rel_path;
				}

				result[asset.tag] = [path + asset.uri];
			}

		} else {

			//relative to the shared property db path.
			//Same as the list hardcoded in PropWorker.
			//TODO: Get rid of the list hardcoded in the worker and use this one always.
			var path = this.findPropertyDbPath();

			if(path === null) {
				console.warn("Missing property database entry in manifest.");
				path = "";
			}

			result = {
				attrs: [path + "objects_attrs.json.gz"],
				values: [path + "objects_vals.json.gz"],
				zvs: [path + "objects_zvs.json.gz"],
				offsets: [path + "objects_offs.json.gz"],
				ids: [path + "objects_ids.json.gz"]
			};

		}

		return result;
	};

	/**
	 * @returns {ZhiUTech.Viewing.BubbleNode} Top-most bubble node.
	 */
	BubbleNode.prototype.getRootNode = function() {

		if(this.parent)
			return this.parent.getRootNode();

		return this;
	};

	/**
	 * Finds shared property DB if there is one.
	 *
	 * @returns {?string} Shared property DB path, or null.
	 */
	BubbleNode.prototype.findPropertyDbPath = function() {

		var otgManifest = this._getOtgManifest();
		var otgNode = otgManifest && otgManifest.views && otgManifest.views[this.guid()];
		if(otgNode && !otgNode.error) {
			var versionRoot = otgManifest.paths.version_root;
			return versionRoot;
			//var pdbRelPath  = otgManifest.pdb_manifest.pdb_version_rel_path;
			//return versionRoot + pdbRelPath;
		}

		if(this.sharedPropertyDbPath)
			return this.sharedPropertyDbPath;

		if(this.parent)
			return this.parent.findPropertyDbPath();

		return null;
	};

	// Deprecated. Avoid using this from the outside.
	BubbleNode.prototype._raw = function() {
		return this.data;
	};

	/**
	 * @returns {string} Node name.
	 */
	BubbleNode.prototype.name = function() {
		return this.data.name;
	};

	/**
	 * @returns {string} Node GUID.
	 */
	BubbleNode.prototype.guid = function() {
		return this.data.guid;
	};

	/**
	 * Retrieves the URN of the node or its closest ancestor.
	 *
	 * @param {boolean} searchParent If URN is not available for this node,
	 * search through its ancestors, too.
	 * @returns {string} Viewable URN.
	 */
	BubbleNode.prototype.urn = function(searchParent) {

		var urn = this.data.urn;

		if(!searchParent)
			return urn;

		var n = this.parent;
		while(!urn && n) {
			urn = n.data.urn;
			n = n.parent;
		}

		return urn;
	};

	/**
	 * Retrieves value of a node tag.
	 *
	 * @param {string} tag Tag name.
	 * @returns {*} Tag value.
	 */
	BubbleNode.prototype.getTag = function(tag) {
		return(this.data.tags ? this.data.tags : this.data)[tag];
	};

	/**
	 * Sets node tag value.
	 *
	 * @param {string} tag Tag name.
	 * @param {*} value Tag value.
	 */
	BubbleNode.prototype.setTag = function(tag, value) {
		if(this.data.tags)
			this.data.tags[tag] = value;
		else
			this.data[tag] = value;
	};

	/** @returns {boolean} Is this a geometry leaf node. */
	BubbleNode.prototype.isGeomLeaf = function() {
		return this.isLeaf;
	};

	/** @returns {boolean} Is this a viewable node. */
	BubbleNode.prototype.isViewable = function() {
		return this.data.role === "viewable";
	};

	/** @returns {boolean} Is this an LOD node. */
	BubbleNode.prototype.getLodNode = function() {
		return this.lodNode;
	};

	/** @returns {boolean} Is this a geometry node. */
	BubbleNode.prototype.isGeometry = function() {
		return this.data.type === "geometry";
	};

	/** @returns {boolean} Is this a view preset/camera definition node. */
	BubbleNode.prototype.isViewPreset = function() {
		return this.data.type === "view";
	};

	/** @returns {boolean} Is this a 2D node. */
	BubbleNode.prototype.is2D = function() {
		return this.data.role === "2d";
	};

	/** @returns {boolean} Is this a 3D node. */
	BubbleNode.prototype.is3D = function() {
		return this.data.role === "3d";
	};

	/** @returns {boolean} Is this a 2D geometry node. */
	BubbleNode.prototype.is2DGeom = function() {
		return this.isGeometry() && this.is2D();
	};

	/** @returns {boolean} Is this a 3D geometry node. */
	BubbleNode.prototype.is3DGeom = function() {
		return this.isGeometry() && this.is3D();
	};

	/** @returns {object} Placement transform of the node. */
	BubbleNode.prototype.getPlacementTransform = function() {

		if(this.is2DGeom()) {
			var sheet_placement = this.findViewableParent().data.sheet_placement;

			if(sheet_placement && sheet_placement.placements) {
				var sp = sheet_placement.placements[this.data.viewableID];
				if(sp)
					return sp;
			}
		} else
			return this.findViewableParent().getTag("placement");

	};

	/** @returns {boolean} Is this a metadata node. */
	BubbleNode.prototype.isMetadata = function() {
		//Certain nodes are not relevant for display purposes,
		//as they contain no graphics and provide extra information for
		//the graphics nodes.
		if(this.data.role) {
			if(this.data.role.indexOf("ZhiUTech.CloudPlatform.DesignDescription") !== -1)
				return true;
			if(this.data.role === "ZhiUTech.CloudPlatform.PropertyDatabase")
				return true;
		}

		return false;
	};

	/**
	 * @returns {?ZhiUTech.Viewing.BubbleNode} First parent in the hierarchy that is a viewable.
	 */
	BubbleNode.prototype.findViewableParent = function() {

		var p = this;
		while(p && !p.isViewable())
			p = p.parent;

		return p;
	};

	/**
	 * @returns {?ZhiUTech.Viewing.BubbleNode} First parent in the hierarchy that is a 2D or 3D geometry.
	 */
	BubbleNode.prototype.findParentGeom2Dor3D = function() {

		var p = this;
		while(p && !p.is2DGeom() && !p.is3DGeom())
			p = p.parent;

		return p;
	};

	/**
	 * Looks for the viewable root path in this node and all its children.
	 * @returns {?string} Viewable root path, or null.
	 */
	BubbleNode.prototype.getViewableRootPath = function() {

		if(!this.isGeomLeaf())
			return null;

		// If we have an embedded otg manifest, use it to get otg path
		//TODO: perhaps we can add the OTG node from the OTG manifest as a child
		//of this geometry node, and then we can use the search by mime type below in all cases.
		var otgGraphicsNode = this.getOtgGraphicsNode();
		if(otgGraphicsNode && !otgGraphicsNode.error) { // in case of translation error, ignore the otgNode
			var otgManifest = this._getOtgManifest();
			return otgManifest.paths.version_root + otgGraphicsNode.urn;
		}

		//prioritize Leaflet image pyramids over the blank F2Ds that they have alongside them
		if(this.is2D()) {
			var leafletItems = this.search({
				role: "leaflet"
			});
			if(leafletItems && leafletItems.length) {
				return leafletItems[0].urn();
			}
		}

		var mime = this.is2D() ? "application/zhiutech-f2d" : "application/zhiutech-esd";

		var items = this.search({
			mime: mime
		});

		if(items && items.length) {
			var path = items[0].data.urn;
			return path;
		}

		return null;
	};

	/**
	 * Returns all the named view in the viewable. Named views are obtained from the documentâ€™s manifest which contains camera information and a string identifier.
	 * 
	 * Available from version 2.15
	 * 
	 * @returns {array} All named views. Returns empty array if none are found.
	 */
	BubbleNode.prototype.getNamedViews = function() {
		var views = this.search({
			"type": "view"
		});
		// Only keep views that have names and camera info
		views = views.filter(function(bubbleNode) {
			if(!bubbleNode.data.name) return false;
			if(!Array.isArray(bubbleNode.data.camera)) return false;
			return true;
		});
		return views;
	};

	/**
	 * Returns first node from the bubble matching a GUID.
	 *
	 * Note that some GUIDs in the bubble are not unique, you have to be sure
	 * you are looking for a GUID that is unique if you want correct result
	 * from this function. Otherwise use the generic search.
	 *
	 * @param {string} guid Node GUID.
	 * @returns {?ZhiUTech.Viewing.BubbleNode} Matching bubble node, or null.
	 */
	BubbleNode.prototype.findByGuid = function(guid) {
		var item = null;

		this.traverse(function(node) {
			if(node.data.guid === guid) {
				item = node;
				return true;
			}
		});

		return item;
	};

	/**
	 * Finds nodes from the bubble matching one or more properties.
	 *
	 * @param {object} propsToMatch Filter criteria - matching nodes must have
	 * the same properties and values.
	 * @returns {?(ZhiUTech.Viewing.BubbleNode[])} Matching nodes, or null.
	 */
	BubbleNode.prototype.search = function(propsToMatch) {

		var result = [];

		this.traverse(function(node) {
			var found = true;
			for(var p in propsToMatch) {
				if(!node.data.hasOwnProperty(p) || node.data[p] !== propsToMatch[p]) {
					found = false;
					break;
				}
			}
			if(found)
				result.push(node);
		});

		return result;
	};

	//======================================================================================
	// Revit/Fluent specific functionality
	//======================================================================================

	/**
	 * Returns the contents of the AECModelData.json supplementary file, if available.
	 */
	BubbleNode.prototype.getAecModelData = function() {

		var viewable = this.findViewableParent();

		if(!viewable)
			return null;

		return viewable.data.aec_model_data;
	};

	/**
	 * Finds nodes from the bubble matching one or more tags.
	 *
	 * @param {object} tagsToMatch Filter criteria - matching nodes must have
	 * the same tags and values.
	 * @returns {?(ZhiUTech.Viewing.BubbleNode[])} Matching nodes, or null.
	 */
	BubbleNode.prototype.searchByTag = function(tagsToMatch) {

		var result = [];

		this.traverse(function(node) {
			var found = true;
			for(var p in tagsToMatch) {
				if(node.getTag(p) !== tagsToMatch[p]) {
					found = false;
					break;
				}
			}
			if(found)
				result.push(node);
		});

		return result.length ? result : null;
	};

	/**
	 * Recursively traverses the bubble, calling a callback function for each node,
	 * for as long as the callback function keeps returning false.
	 *
	 * @param {function} cb Callback function, accepts a bubble node as an argument,
	 * and returns true if the traversal should be terminated.
	 * @returns {boolean} Result of the last callback invokation.
	 */
	BubbleNode.prototype.traverse = function(cb) {

		//Allow the callback to exit early if it meets
		//some internal condition and returns true.
		if(cb(this)) return true;

		if(this.children) {

			for(var i = 0; i < this.children.length; i++) {

				if(this.children[i].traverse(cb))
					return true;

			}

		}

		return false;
	};

	BubbleNode.prototype.extractRevitMetadata = function() {

		var rawNode = this.data;

		//Collect information about building levels into the viewable root
		if(rawNode.hasOwnProperty("levelNumber")) {
			var lnum = rawNode.levelNumber;
			var lname = rawNode.levelName || lnum;

			var viewable = this.findViewableParent();
			if(viewable) {
				viewable.levelNumToName = viewable.levelNumToName || {};
				viewable.levelNameToNum = viewable.levelNameToNum || {};

				viewable.levelNumToName[lnum] = lname;
				viewable.levelNameToNum[lname] = lnum;
			}
		}

		//Placement offsets written by Revit for 2d sheets seem to have negated translation, correct this here (until fixed)
		//Eventually, we will be using the exact placement transform computed by our post-processing 2d sheet placement logic.
		if(rawNode.placement && rawNode.role === "2d") {
			//The Revit extractor only knows the base offset of a sheet, but not the scale,
			//so we detect this case only. If the scale is set correctly, we probably fixed the placement
			//using our post-processing step.
			var isUnit = true;
			for(var i = 0; i < 11; i++) {
				if(rawNode.placement[i] !== 0 && rawNode.placement[i] !== 1) {
					isUnit = false;
					break;
				}
			}

			if(isUnit) {
				rawNode.placement[12] *= -1;
				rawNode.placement[13] *= -1;
				rawNode.placement[14] *= -1;
			}

		}

	};

	//Returns the Revit Level/Floor of this bubble node.
	//Only relevant for 2d sheets coming from Revit at the moment.
	//Eventually Revit should tag the bubble nodes with this value,
	//currently it's just a guess done by Fluent.guessObjectLevels().
	BubbleNode.prototype.getLevel = function() {

		var level = this.data.levelNumber;

		//TODO: for now, return the first level if a sheet shows multiple levels,
		//since the UI code can't handle it.
		if(Array.isArray(level))
			return level[0];

		return level;
	};

	BubbleNode.prototype.getLevelName = function() {
		return this.data.levelName || this.getLevel();
	};

	//BubbleNode search patterns for often used nodes (yes, they are confusing, hence pre-defined to
	//help you not go insane).
	BubbleNode.MODEL_NODE = {
		"role": "3d",
		"type": "geometry"
	};
	BubbleNode.GEOMETRY_SVF_NODE = {
		"role": "graphics",
		"mime": "application/zhiutech-esd"
	};
	BubbleNode.SHEET_NODE = {
		"role": "2d",
		"type": "geometry"
	};
	BubbleNode.LEAFLET_NODE = {
		"role": "leaflet"
	};
	BubbleNode.IMAGE_NODE = {
		"role": "image"
	};
	BubbleNode.GEOMETRY_F2D_NODE = {
		"role": "graphics",
		"mime": "application/zhiutech-f2d"
	};
	BubbleNode.VIEWABLE_NODE = {
		"role": "viewable"
	};

	ZhiUTech.Viewing.BubbleNode = BubbleNode;

})();;

(function() {
	'use strict';

	var SnapType = {
		SNAP_VERTEX: 0,
		SNAP_MIDPOINT: 1,
		SNAP_CIRCLE_CENTER: 2,
		SNAP_EDGE: 3,
		SNAP_FACE: 4,
		SNAP_CIRCULARARC: 5,
		SNAP_CURVEDEDGE: 6,
		SNAP_CURVEDFACE: 7
	};

	// exports
	ZhiUTechNamespace("ZhiUTech.Viewing.MeasureCommon");
	ZhiUTech.Viewing.MeasureCommon.SnapType = SnapType;

})();;
(function() {
	'use strict';

	var MeasurementTypes = {
		MEASUREMENT_DISTANCE: 1, // Measurement from point to point, not matter what geometry it is.
		MEASUREMENT_ANGLE: 2,
		MEASUREMENT_AREA: 3,
		CALIBRATION: 4
	};

	// export
	ZhiUTech.Viewing.MeasureCommon.MeasurementTypes = MeasurementTypes;

})();;
(function() {
	'use strict';

	var Events = {

		MEASUREMENT_CHANGED_EVENT: 'measurement-changed',
		UNITS_CALIBRATION_STARTS_EVENT: 'units_calibration_starts_event'
	};

	// exports
	ZhiUTech.Viewing.MeasureCommon.Events = Events;

})();;
ZhiUTechNamespace('ZhiUTech.Viewing.Private');

/**
 * Formats a value with units
 * @param {number} value
 * @param {string} units - GNU units format
 * @param {number} type - For example: 1=boolean, 2=integer, 3=double, 20=string, 24=Position
 * @param {number} precision - required precision.
 * see https://git.zhiutech.com/A360/platform-translation-propertydb/blob/master/propertydb/PropertyDatabase.h
 * @returns {string} formatted value
 */
ZhiUTech.Viewing.Private.formatValueWithUnits = function(value, units, type, precision) {

	function modf(x) {
		var intPart = (0 <= x) ? Math.floor(x) : Math.ceil(x),
			fracPart = x - intPart;
		return {
			intPart: intPart,
			fracPart: fracPart
		};
	}

	function formatNumber(x, precision, needMinusSign) {
		var result = '';

		if(needMinusSign && x === 0) {
			result += '-';
		}

		//According to Shawn's request, do not truncate trailing .0's
		//if (modf(x).fracPart === 0) {
		//
		//    // No fractional part.
		//    //
		//    result += x;
		//
		//} else if (0 < precision) {
		if(0 < precision) {

			// Truncate any trailing .0's.
			//
			//var s = x.toFixed(precision);
			//var re = /^\-?([0-9]+)\.0+$/;
			//var m = re.exec(s);
			//if (m !== null) {
			//    result += m[1];
			//} else {
			//    result += s;
			//}

			result += x.toFixed(precision);

		} else {
			result += x.toFixed(0);
		}

		return result;
	}

	function formatFeet(value, precision, inchesOnly) {

		// Borrowed from AdCoreUnits PrimeDoublePrimeSymbol2::Format

		var result = '',
			radix = 12.0,
			denominator = 1.0,
			isNegative = (value < 0);

		for(var i = 0; i < precision; ++i) {
			denominator *= 2.0;
		}

		// round to the nearest 1/denominator
		if(value > 0) {
			value += 0.5 / denominator;
		} else {
			value -= 0.5 / denominator;
		}

		var primeValue, doublePrimeValue;

		if(!inchesOnly) {
			primeValue = modf(value / radix).intPart;
			result += formatNumber(primeValue, 0, isNegative) + '\' ';
			doublePrimeValue = value - (primeValue * radix);
			if(doublePrimeValue < 0) {
				doublePrimeValue = -doublePrimeValue;
			}

		} else {
			doublePrimeValue = value;
		}

		var intPart = modf(doublePrimeValue).intPart;
		var numerator = modf((doublePrimeValue - intPart) * denominator).intPart;

		if(numerator === 0 || intPart !== 0) {
			result += formatNumber(intPart, 0);
		}

		if(numerator !== 0) {
			if(intPart < 0 && numerator < 0) {
				numerator = -numerator;
			}
			while(numerator % 2 === 0) {
				numerator /= 2;
				denominator /= 2;
			}
			if(intPart !== 0) {
				result += '-';
			}
			result += formatNumber(numerator, 0) + '/' + formatNumber(denominator, 0);
		}

		result += '\"';
		return result;
	}

	function formatMeterAndCentimeter(value, precision) {
		var sign = '';
		if(value < 0) {
			sign = '-';
			value = Math.abs(value);
		}
		var modfValue = modf(value),
			mValue = modfValue.intPart,
			cmValue = modfValue.fracPart * 100.0;

		return sign + formatNumber(mValue, 0) + ' m ' + formatNumber(cmValue, precision) + ' cm';
	}

	function formatFeetAndDecimalInches(value, precision) {
		var sign = '';
		if(value < 0) {
			sign = '-';
			value = Math.abs(value);
		}
		var modfValue = modf(value),
			ftValue = modfValue.intPart,
			inValue = modfValue.fracPart * 12.0;

		return sign + formatNumber(ftValue, 0) + '\' ' + formatNumber(inValue, precision) + '\"';
	}

	var result;

	if(precision === null || precision === undefined) {
		precision = 3;
	}

	// TODO(go) - 20150504: Ideally this would be handled better: according to the git file at the top property types can be 0,1,2,3,10,11,20,21,22,23,24
	// TODO(go) - 20150504: The code below only handle Boolean (1) Integer (2) and double (3). Not sure how well the property types are assigned so using
	// TODO(go) - 20150504: try catch for now.
	try {

		if(type === 1) { // Boolean
			result = ZhiUTech.Viewing.i18n.translate(value ? 'Yes' : 'No');

		} else if(type === 24) { // Position
			var position = value.split(' ');
			result = [];

			for(var i = 0; i < position.length; ++i) {
				result.push(ZhiUTech.Viewing.Private.formatValueWithUnits(parseFloat(position[i]), units, 3, precision));
			}

			result = result.join(', ');

		} else if((type === 2 || type === 3) && isNaN(value)) {
			result = 'NaN';

		} else if(units === 'ft-and-fractional-in') {
			result = formatFeet(value * 12.0, precision);

		} else if(units === 'ft-and-fractional-in^2') {
			result = formatFeet(value * 12.0, precision) + ' ' + String.fromCharCode(0xb2);

		} else if(units === 'ft-and-decimal-in') {
			result = formatFeetAndDecimalInches(value, precision);

		} else if(units === 'ft-and-decimal-in^2') {
			result = formatFeetAndDecimalInches(value, precision) + ' ' + String.fromCharCode(0xb2);

		} else if(units === 'decimal-in' || units === 'in' || units === 'inch') {
			result = formatNumber(value, precision) + '\"';

		} else if(units === 'decimal-in^2' || units === 'in^2' || units === 'inch^2') {
			result = formatNumber(value, precision) + '\"' + ' ' + String.fromCharCode(0xb2);

		} else if(units === 'decimal-ft' || units === 'ft' || units === 'feet' || units === 'foot') {
			result = formatNumber(value, precision) + '\'';

		} else if(units === 'decimal-ft^2' || units === 'ft^2' || units === 'feet^2' || units === 'foot^2') {
			result = formatNumber(value, precision) + '\'' + ' ' + String.fromCharCode(0xb2);

		} else if(units === 'fractional-in') {
			result = formatFeet(value, precision, /*inchesOnly=*/ true);

		} else if(units === 'fractional-in^2') {
			result = formatFeet(value, precision, /*inchesOnly=*/ true) + ' ' + String.fromCharCode(0xb2);

		} else if(units === 'm-and-cm') {
			result = formatMeterAndCentimeter(value, precision);

		} else if(units === 'm-and-cm^2') {
			result = formatMeterAndCentimeter(value, precision) + ' ' + String.fromCharCode(0xb2);

		} else if(type === 3 && units) { // Double, with units
			units = units.replace("^2", String.fromCharCode(0xb2));
			units = units.replace("^3", String.fromCharCode(0xb3));
			result = formatNumber(value, precision) + ' ' + units;

		} else if(units) {
			result = value + ' ' + units;

		} else if(type === 3) { // Double, no units
			result = formatNumber(value, precision);

		} else {
			result = value;
		}

	} catch(e) {

		if(units) {
			result = value + ' ' + units;
		} else {
			result = value;
		}
	}

	return result;
};

/**
 * Convert distance from unit to unit.
 * @param {string} fromUnits - GNU units format - units to convert from
 * @param {string} toUnits - GNU units format - units to convert to
 * @param {number} calibrationFactor - Calibration Factor of the model
 * @param {number} d - distance to convert
 * @param {string} type - default for distance, "square" for area
 * @returns {number} - distance after conversion.
 */
ZhiUTech.Viewing.Private.convertUnits = function(fromUnits, toUnits, calibrationFactor, d, type) {

	calibrationFactor = calibrationFactor ? calibrationFactor : 1;

	if(fromUnits === toUnits && calibrationFactor == 1)
		return d;

	var toFactor = 1;
	switch(toUnits) {
		case "mm":
			toFactor = 1000;
			break;
		case "cm":
			toFactor = 100;
			break;
		case "m":
			toFactor = 1;
			break;
		case "in":
			toFactor = 39.37007874;
			break;
		case "ft":
			toFactor = 3.280839895;
			break;
		case "ft-and-fractional-in":
			toFactor = 3.280839895;
			break;
		case "ft-and-decimal-in":
			toFactor = 3.280839895;
			break;
		case "decimal-in":
			toFactor = 39.37007874;
			break;
		case "decimal-ft":
			toFactor = 3.280839895;
			break;
		case "fractional-in":
			toFactor = 39.37007874;
			break;
		case "m-and-cm":
			toFactor = 1;
			break;
	}

	var fromFactor = 1;
	switch(fromUnits) {
		case "mm":
			fromFactor = 0.001;
			break;
		case "cm":
			fromFactor = 0.01;
			break;
		case "m":
			fromFactor = 1;
			break;
		case "in":
			fromFactor = 0.0254;
			break;
		case "ft":
			fromFactor = 0.3048;
			break;
		case "ft-and-fractional-in":
			fromFactor = 0.3048;
			break;
		case "ft-and-decimal-in":
			fromFactor = 0.3048;
			break;
		case "decimal-in":
			fromFactor = 0.0254;
			break;
		case "decimal-ft":
			fromFactor = 0.3048;
			break;
		case "fractional-in":
			fromFactor = 0.0254;
			break;
		case "m-and-cm":
			fromFactor = 1;
			break;
	}

	if(type === "square") {

		return(d * Math.pow(toFactor * fromFactor * calibrationFactor, 2));
	}
	return(d * toFactor * fromFactor * calibrationFactor);
};

/**
 * Count the number of digits after the floating point of a given number.
 * If the numer is a fraction, count the power of 2 of the denominator.
 * @param {string | number} number.
 * @returns {number} - number of digits after the floating point of the given number.
 */

ZhiUTech.Viewing.Private.calculatePrecision = function(number) {

	if(!number)
		return 0;

	var digits = number.toString().split(".")[1];

	// Try fractional number
	if(!digits) {
		var denominatorStrRaw = number.toString().split("/")[1];
		var denominatorNumberStr = denominatorStrRaw && denominatorStrRaw.match(/\d+/);
		if(denominatorNumberStr) {
			var denominator = parseFloat(denominatorNumberStr);
			if(denominator && !isNaN(denominator)) {
				return Math.floor(Math.log2(denominator));
			}
		}

		return 0;
	}
	digits = digits.match(/\d+/);
	return(digits && digits[0] && digits[0].length) || 0;
};;
(function() {
	var UnitParser = ZhiUTechNamespace('ZhiUTech.Viewing.Private.UnitParser');

	// Based on https://github.com/dobriai/footinch/blob/master/lib/parse.js
	function _parse(strIn, base, bigUnitSigns, smallUnitsSigns) {
		if(!strIn) {
			return NaN;
		}

		strIn = strIn.toString();

		var str = strIn.trim();
		if(str.length == 0) {
			return NaN;
		}

		var lm;
		var bigUnits = bigUnitSigns.join('| *');
		var smallUnits = smallUnitsSigns.join('| *');

		// Try +-: 1/2", 11/16"; trailing space OK, but nothing else
		// Note: Trailing " is mandatory!
		{
			lm = str.match(new RegExp('^([+-]?\\d+)(?: *)\/(?: *)(\\d+)(?: *)(?:' + smallUnits + ') *$'));
			if(lm) {
				return(parseFloat(lm[1]) / parseFloat(lm[2])) / base;
			}
		}

		// Try +-: 1/2', 11/16; trailing space OK, but nothing else
		{
			lm = str.match(new RegExp('^([+-]?\\d+)(?: *)\/(?: *)(\\d+)(?: *)(?:' + bigUnits + ')? *$'));
			if(lm) {
				return(parseFloat(lm[1]) / parseFloat(lm[2]));
			}
		}

		// Try +-: 5, 1.2e7, .1e+2, 3e-1, 3.e1
		var firstFloat = NaN; {
			lm = str.match(/^[+-]? *(?:\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?/i);
			if(!lm) {
				return NaN;
			}
			firstFloat = parseFloat(lm[0].replace(/ */g, '')); // Clear spaces on the way
			str = str.slice(lm[0].length); // Don't trim just yet!
		}

		str = str.replace('-', ' ');

		if(str.length == 0 || isNaN(firstFloat)) {
			return firstFloat;
		}

		var sgn = Math.sign(firstFloat);
		if(sgn === 0) {
			sgn = 1;
		}

		// If inches, then end of story
		if(str.match(new RegExp('^(?: *)(?:' + smallUnits + ') *$', 'i'))) {
			return firstFloat / base;
		}

		{

			lm = str.match(new RegExp('^ +(\\d+)(?: *)\/(?: *)(\\d+)(?: *)(?:' + smallUnits + ') *$', 'i'));
			if(lm) {
				// If original input was: 7 11/16"
				return(firstFloat + sgn * parseFloat(lm[1]) / parseFloat(lm[2])) / base;
			}
		}

		{
			lm = str.match(new RegExp('^(?: *)(?:' + bigUnits + '|-| +-?) *', 'i')); // Order matters here!
			if(!lm) {
				return NaN;
			}
			str = str.slice(lm[0].length).trim();
			if(str.length == 0) {
				if(lm[0].match(/-/)) {
					return NaN; // Trailing dash - e.g. strIn was: 7-
				}
				return firstFloat;
			}
		}

		// Now we can only have left: 2, 2.3, 7/8, 2 7/8, with an optional " at the end
		{
			lm = str.match(new RegExp('^(\\d+(?:\\.\\d*)?)(?: *)(?:' + smallUnits + ')? *$'));
			if(lm) {
				return firstFloat + sgn * parseFloat(lm[1]) / base;
			}

			lm = str.match(new RegExp('^(\\d+)(?: *)\/(?: *)(\\d+)(?: *)(?:' + smallUnits + ')? *$'));
			if(lm) {
				return firstFloat + sgn * (parseFloat(lm[1]) / parseFloat(lm[2])) / base;
			}

			lm = str.match(new RegExp('^(\\d+) +(\\d+)(?: *)\/(?: *)(\\d+)(?: *)(?:' + smallUnits + ')? *$'));
			if(lm) {
				return firstFloat + sgn * (parseFloat(lm[1]) + parseFloat(lm[2]) / parseFloat(lm[3])) / base;
			}
		}

		return NaN;
	}

	/**
	 * Parses a string of fractional feet or decimal feet to a decimal feet number
	 * @param {string} input - input string of the number
	 * @returns {number} parsed value represented as a number
	 */
	UnitParser.parseFeet = function(input) {
		return _parse(input, 12.0, ['ft', 'feet', '\''], ['in', 'inch', '\\"', '\'\'']);
	};

	UnitParser.parseMeter = function(input) {
		return _parse(input, 100.0, ['m', 'meter'], ['cm', 'centimeter']);
	};

	/**
	 * Parses a string of fractional or decimal number into a decimal number.
	 * Valid input examples: 1, 1.2e3, -2, 2cm, 4", 4.1', 1 2/3, 1 2 3/4, 1 2-3/4, 1ft 2-3/4in, 1' 2-3/4"
	 * 
	 * @param {string} input - input string of the number.
	 * @param {string} inputUnits - the type of the units of the number.
	 * @returns {number} parsed value represented as a decimal number.
	 */
	UnitParser.parseNumber = function(input, inputUnits) {
		switch(inputUnits) {
			case 'ft':
			case 'decimal-ft':
			case 'ft-and-fractional-in':
			case 'ft-and-decimal-in':
			case 'decimal-in':
			case 'fractional-in':
				return UnitParser.parseFeet(input);

			case '':
			case 'm':
			case 'cm':
			case 'mm':
			case 'm-and-cm':
			default:
				return UnitParser.parseMeter(input);
		}
	};

	UnitParser.parsePositiveNumber = function(input, inputUnits) {
		var parsedNumber = UnitParser.parseNumber(input, inputUnits);
		return parsedNumber >= 0 ? parsedNumber : NaN;
	};

})();;
(function() {
	'use strict';

	// Measurement helper functions //
	var MeasureCommon = ZhiUTechNamespace("ZhiUTech.Viewing.MeasureCommon");

	MeasureCommon.EPSILON = 0.0001;

	MeasureCommon.getSnapResultPosition = function(pick, viewer) {
		if(!pick) {
			return null;
		}

		if(pick.isPerpendicular) {
			return pick.intersectPoint;
		}

		switch(pick.geomType) {
			case MeasureCommon.SnapType.SNAP_VERTEX:
			case MeasureCommon.SnapType.SNAP_MIDPOINT:
			case MeasureCommon.SnapType.SNAP_CIRCLE_CENTER:
				return pick.getGeometry();

			case MeasureCommon.SnapType.SNAP_EDGE:
				var eps = MeasureCommon.getEndPointsInEdge(pick.getGeometry());
				var p1 = eps[0].clone();
				var p2 = eps[1].clone();
				return MeasureCommon.nearestPointInPointToLine(pick.intersectPoint, p1, p2);

			case MeasureCommon.SnapType.SNAP_FACE:
				return MeasureCommon.nearestPointInPointToPlane(pick.intersectPoint, pick.getGeometry().vertices[0], pick.faceNormal);

			case MeasureCommon.SnapType.SNAP_CIRCULARARC:
				if(viewer && viewer.model && viewer.model.is2d()) {
					var point = MeasureCommon.nearestVertexInVertexToEdge(pick.intersectPoint, pick.getGeometry());
					pick.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
					pick.geomVertex = point;
					return point;

				} else {
					// For 3D models, currently we don't have the center geometry of the circle. 
					// So the only way to select the center is by selecting the perimeter.
					return pick.circularArcCenter;
				}

			case MeasureCommon.SnapType.SNAP_CURVEDEDGE:
				return MeasureCommon.nearestVertexInVertexToEdge(pick.intersectPoint, pick.getGeometry());

			case MeasureCommon.SnapType.SNAP_CURVEDFACE:
				return pick.intersectPoint;

			default:
				return null;
		}
	};

	MeasureCommon.correctPerpendicularPicks = function(firstPick, secondPick, viewer, snapper) {

		if(!firstPick || !secondPick || !firstPick.getGeometry() || !secondPick.getGeometry()) {
			return false;
		}

		var start = MeasureCommon.getSnapResultPosition(firstPick, viewer);

		if(snapper && viewer) {

			// Simple _ to Edge - Snap the second pick when it's 90 degrees.
			if(secondPick.geomType === MeasureCommon.SnapType.SNAP_EDGE) {
				var v2 = new THREE.Vector3();
				var v3 = new THREE.Vector3();

				var secondEdge = secondPick.getGeometry();

				v2.subVectors(secondPick.intersectPoint, start).normalize(); // rubberband vector
				v3.subVectors(secondEdge.vertices[0], secondEdge.vertices[1]).normalize();

				if(MeasureCommon.isPerpendicular(v2, v3, 0.05)) {

					var newPoint = MeasureCommon.nearestPointInPointToSegment(start, secondEdge.vertices[0], secondEdge.vertices[1], true);

					if(newPoint) {
						if(snapper.onMouseMove(MeasureCommon.project(newPoint, viewer))) {
							snapper.setPerpendicular(true);
						}

						secondPick.geomVertex = newPoint;
						secondPick.intersectPoint = newPoint;
						return true;
					}
				}
			}

			// Simple _ to Face - Snap the second pick when it's 90 degrees.
			else if(secondPick.geomType === MeasureCommon.SnapType.SNAP_FACE) {

				var v = new THREE.Vector3();

				var secondFace = secondPick.getGeometry();

				v.subVectors(secondPick.intersectPoint, start).normalize(); // rubberband vector

				if(MeasureCommon.isParallel(secondPick.faceNormal, v, 0.05)) {

					var newPoint = MeasureCommon.nearestPointInPointToPlane(start, secondFace.vertices[0], secondPick.faceNormal);
					if(snapper.onMouseMove(MeasureCommon.project(newPoint, viewer))) {
						snapper.setPerpendicular(true);
					}

					secondPick.geomVertex = newPoint;
					secondPick.intersectPoint = newPoint;
					return true;
				}
			}
		}
	};

	MeasureCommon.calculateDistance = function(firstPick, secondPick, dPrecision, viewer) {

		if(!firstPick || !secondPick || !firstPick.getGeometry() || !secondPick.getGeometry()) {
			return null;
		}

		var ep1 = MeasureCommon.getSnapResultPosition(firstPick, viewer);
		var ep2 = MeasureCommon.getSnapResultPosition(secondPick, viewer);

		if(!ep1 || !ep2) {
			return null;
		}

		if(MeasureCommon.isEqualVectors(ep1, ep2, MeasureCommon.EPSILON)) {
			return null;
		}

		var distanceXYZ, distanceX, distanceY, distanceZ;

		// Convert coords when in 2D
		if(viewer.model.is2d()) {
			ep1 = ep1.clone();
			ep2 = ep2.clone();
			viewer.model.pageToModel(ep1, ep2, firstPick.viewportIndex2d);
		}

		// Include resolution limits for high precision 2D-measurements, where available 
		if(dPrecision) {

			var n = Math.log(2.0 * dPrecision) / Math.log(10.0);
			var nd = Math.floor(n);

			// Increase one decimal to ensure being covered
			if(1.0 < (2.0 * dPrecision / Math.pow(10.0, nd)))
				nd++;

			dPrecision = Math.pow(10.0, nd);

			// Adjust the distances aligned by the precision
			var measurementDistance = ep1.distanceTo(ep2);
			var m = measurementDistance / dPrecision;
			distanceXYZ = Math.floor(m + 0.5) * dPrecision;

			measurementDistance = Math.abs(ep1.x - ep2.x);
			m = measurementDistance / dPrecision;
			distanceX = Math.floor(m + 0.5) * dPrecision;

			measurementDistance = Math.abs(ep1.y - ep2.y);
			m = measurementDistance / dPrecision;
			distanceY = Math.floor(m + 0.5) * dPrecision;

			return {
				distanceXYZ: distanceXYZ,
				distanceX: distanceX,
				distanceY: distanceY,
				distanceZ: 0,
				type: MeasureCommon.MeasurementTypes.MEASUREMENT_DISTANCE
			};
		}

		// Calculation for 3D models and 2D models without resolution limits
		distanceXYZ = ep1.distanceTo(ep2);
		distanceX = Math.abs(ep1.x - ep2.x);
		distanceY = Math.abs(ep1.y - ep2.y);
		distanceZ = Math.abs(ep1.z - ep2.z);
		return {
			distanceXYZ: distanceXYZ,
			distanceX: distanceX,
			distanceY: distanceY,
			distanceZ: distanceZ,
			type: MeasureCommon.MeasurementTypes.MEASUREMENT_DISTANCE
		};
	};

	MeasureCommon.getDpiPrecision = function(model, viewportIndex) {

		// Only do this for 2D models.
		if(model.is3d()) {
			return 0;
		}

		// Include resolution limits for high precision 2D-measurements, where available (TREX-575)
		var page_width = model.getMetadata('page_dimensions', 'page_width', null);
		var logical_width = model.getMetadata('page_dimensions', 'logical_width', null);
		var page_height = model.getMetadata('page_dimensions', 'page_height', null);
		var logical_height = model.getMetadata('page_dimensions', 'logical_height', null);
		if(!page_width || !logical_width || !page_height || !logical_height) {
			return 0;
		}

		// Retrieve the inverse DPI
		var invdpix = page_width / logical_width;
		var invdpiy = page_height / logical_height;

		// Calculate the graininess in model units
		var p1 = new THREE.Vector3(0.0, 0.0, 0.0);
		var p2 = new THREE.Vector3(invdpix, invdpiy, 0.0);
		model.pageToModel(p1, p2, viewportIndex);
		var dPrecision = p1.distanceTo(p2);

		return dPrecision;
	};

	MeasureCommon.isContainsEqualVectors = function(points) {
		for(var i = 0; i < points.length; i++) {
			for(var j = 0; j < points.length; j++) {
				if(i !== j && MeasureCommon.isEqualVectors(points[i], points[j], MeasureCommon.EPSILON)) {
					return true;
				}
			}
		}

		return false;
	};

	MeasureCommon.calculateAngle = function(picks, viewer) {
		var points = [];

		for(var key in picks) {
			if(picks.hasOwnProperty(key)) {
				var point = MeasureCommon.getSnapResultPosition(picks[key], viewer);
				if(point) {
					points.push(point);
				}
			}
		}

		if(points.length !== 3 || MeasureCommon.isContainsEqualVectors(points)) {
			return null;
		}

		var v1 = new THREE.Vector3();
		var v2 = new THREE.Vector3();

		v1.subVectors(points[0], points[1]);
		v2.subVectors(points[2], points[1]);

		return MeasureCommon.angleVectorToVector(v1, v2);
	};

	MeasureCommon.calculateArea = function(picks, viewer) {
		var points = [];

		for(var key in picks) {
			if(picks.hasOwnProperty(key)) {
				var point = MeasureCommon.getSnapResultPosition(picks[key], viewer);
				if(point) {
					points.push(point.clone());
				}
			}
		}

		var firstPoint = MeasureCommon.getSnapResultPosition(picks[1], viewer);
		if(firstPoint) {
			points.push(firstPoint.clone());
		}

		for(var i = 0; i < points.length; i += 2) {
			viewer.model.pageToModel(points[i], points[i + 1], picks[1].viewportIndex2d);
		}

		var sum1 = 0;
		var sum2 = 0;

		for(var i = 0; i < points.length - 1; i++) {
			sum1 += points[i].x * points[i + 1].y;
			sum2 += points[i].y * points[i + 1].x;
		}

		var area = Math.abs((sum1 - sum2) / 2);
		return area;

	};

	/**
	 * The main function for this file, which calculates a measurement result (either distance
	 * or angle) from a given measurement.
	 */
	MeasureCommon.computeResult = function(picks, measurementType, viewer) {

		switch(measurementType) {
			case MeasureCommon.MeasurementTypes.MEASUREMENT_DISTANCE:
				var firstPick = picks[1];
				var secondPick = picks[2];
				var dPrecision = MeasureCommon.getDpiPrecision(viewer.model, firstPick.viewportIndex2d);

				return MeasureCommon.calculateDistance(firstPick, secondPick, dPrecision, viewer);

			case MeasureCommon.MeasurementTypes.MEASUREMENT_ANGLE:
				var angle = MeasureCommon.calculateAngle(picks, viewer);
				return angle ? {
					angle: angle,
					type: measurementType
				} : null;

			case MeasureCommon.MeasurementTypes.MEASUREMENT_AREA:
				return {
					area: MeasureCommon.calculateArea(picks, viewer),
					type: measurementType
				};

			default:
				return null;

		}
	};

	MeasureCommon.getFaceArea = function(viewer, measurement, face, units, precision, calibrationFactor) {

		var area = 0;
		var vertices = face.vertices;
		var V1 = new THREE.Vector3();
		var V2 = new THREE.Vector3();

		for(var i = 0; i < vertices.length; i += 3) {

			V1.subVectors(vertices[i + 1], vertices[i]);
			V2.subVectors(vertices[i + 2], vertices[i]);

			area += V1.length() * V2.length() * Math.sin(V1.angleTo(V2)) / 2;
		}

		area = ZhiUTech.Viewing.Private.convertUnits(viewer.model.getUnitString(), units, calibrationFactor, area, 'square');

		if(units) {

			return ZhiUTech.Viewing.Private.formatValueWithUnits(area, units + '^2', 3, precision);
		} else {

			return ZhiUTech.Viewing.Private.formatValueWithUnits(area, null, 3, precision);
		}

	};

	MeasureCommon.getCircularArcRadius = function(viewer, measurement, edge, units, precision, calibrationFactor) {

		var radius = edge.radius;

		if(radius) {
			if(viewer.model.is2d()) {
				var pt1 = edge.center.clone();
				var pt2 = edge.vertices[0].clone();
				viewer.model.pageToModel(pt1, pt2, measurement.getPick(1).viewportIndex2d);
				radius = pt1.distanceTo(pt2);
			}

			radius = ZhiUTech.Viewing.Private.convertUnits(viewer.model.getUnitString(), units, calibrationFactor, radius);
			return ZhiUTech.Viewing.Private.formatValueWithUnits(radius, units, 3, precision);
		}
	};

	MeasureCommon.project = function(point, viewer, offset) {
		var camera = viewer.navigation.getCamera(),
			containerBounds = viewer.navigation.getScreenViewport(),
			p = new THREE.Vector3(point.x, point.y, point.z);

		p = p.project(camera);

		offset = offset || 0;

		return new THREE.Vector2(Math.round((p.x + 1) / 2 * containerBounds.width) + offset,
			Math.round((-p.y + 1) / 2 * containerBounds.height) + offset);
	};

	MeasureCommon.inverseProject = function(point, viewer) {

		var camera = viewer.navigation.getCamera(),
			containerBounds = viewer.navigation.getScreenViewport(),
			p = new THREE.Vector3();

		p.x = point.x / containerBounds.width * 2 - 1;
		p.y = -(point.y / containerBounds.height * 2 - 1);
		p.z = 0;

		p = p.unproject(camera);

		return p;
	};

	//***** Helper functions for calculations without state: ***** //

	// Get the nearest point on the line from point to line
	// inLine - whether to force the result to be inside the given line or not.
	MeasureCommon.nearestPointInPointToLine = function(point, lineStart, lineEnd) {

		var X0 = new THREE.Vector3();
		var X1 = new THREE.Vector3();
		var nearestPoint;
		var param;

		X0.subVectors(lineStart, point);
		X1.subVectors(lineEnd, lineStart);
		param = X0.dot(X1);
		X0.subVectors(lineEnd, lineStart);
		param = -param / X0.dot(X0);

		X0.subVectors(lineEnd, lineStart);
		X0.multiplyScalar(param);
		nearestPoint = X0.add(lineStart);

		return nearestPoint;
	};

	// Get the nearest point on the line segment from point to line segment
	MeasureCommon.nearestPointInPointToSegment = function(point, lineStart, lineEnd, forcePerpendicular) {

		var X0 = new THREE.Vector3();
		var X1 = new THREE.Vector3();
		var nearestPoint;
		var param;

		X0.subVectors(lineStart, point);
		X1.subVectors(lineEnd, lineStart);
		param = X0.dot(X1);
		X0.subVectors(lineEnd, lineStart);
		param = -param / X0.dot(X0);

		if(param < 0) {
			if(forcePerpendicular) {
				nearestPoint = null;
			} else {
				nearestPoint = lineStart;
			}
		} else if(param > 1) {
			if(forcePerpendicular) {
				nearestPoint = null;
			} else {
				nearestPoint = lineEnd;
			}
		} else {
			X0.subVectors(lineEnd, lineStart);
			X0.multiplyScalar(param);
			nearestPoint = X0.add(lineStart);
		}

		return nearestPoint;
	};

	MeasureCommon.isEqualVectors = function(v1, v2, precision) {
		if(!v1 || !v2) {
			return false;
		}

		if(Math.abs(v1.x - v2.x) <= precision && Math.abs(v1.y - v2.y) <= precision && Math.abs(v1.z - v2.z) <= precision) {
			return true;
		}
		return false;
	};

	MeasureCommon.isInverseVectors = function(v1, v2, precision) {
		if(Math.abs(v1.x + v2.x) <= precision && Math.abs(v1.y + v2.y) <= precision && Math.abs(v1.z + v2.z) <= precision) {
			return true;
		}
		return false;
	};

	MeasureCommon.getEndPointsInEdge = function(edge) {

		var vertices = edge.vertices;
		var endPoints = [];

		for(var i = 0; i < vertices.length; ++i) {

			var duplicate = false;

			for(var j = 0; j < vertices.length; ++j) {

				if(j !== i && vertices[j].equals(vertices[i])) {

					duplicate = true;
					break;
				}
			}

			if(!duplicate) {

				endPoints.push(vertices[i]);

			}
		}

		return endPoints;
	};

	MeasureCommon.angleVectorToVector = function(v1, v2) {
		return v1.angleTo(v2) * 180 / Math.PI;
	};

	// Get the two nearest endpoints between two line segments
	MeasureCommon.nearestPointsInSegmentToSegment = function(p1, p2, p3, p4) {

		var u = new THREE.Vector3();
		var v = new THREE.Vector3();
		var w = new THREE.Vector3();

		u.subVectors(p2, p1);
		v.subVectors(p4, p3);
		w.subVectors(p1, p3);

		var a = u.dot(u);
		var b = u.dot(v);
		var c = v.dot(v);
		var d = u.dot(w);
		var e = v.dot(w);
		var D = a * c - b * b;
		var sc, sN, sD = D;
		var tc, tN, tD = D;

		// Compute the line parameters of the two closest points
		if(D < MeasureCommon.EPSILON) { // the lines are almost parallel
			sN = 0.0; // for using point p1 on segment p1p2
			sD = 1.0; // to prevent possible division by 0.0 later
			tN = e;
			tD = c;
		} else { // get the closest points on the infinite lines
			sN = b * e - c * d;
			tN = a * e - b * d;
			if(sN < 0.0) { // sc < 0 => the s = 0 is visible
				sN = 0.0;
				tN = e;
				tD = c;
			} else if(sN > sD) { // sc > 1 => the s = 1 edge is visible
				sN = sD;
				tN = e + b;
				tD = c;
			}
		}

		if(tN < 0.0) { // tc < 0 => the t = 0 edge is visible
			tN = 0.0;
			// recompute sc for this edge
			if(-d < 0.0)
				sN = 0.0;
			else if(-d > a)
				sN = sD;
			else {
				sN = -d;
				sD = a;
			}
		} else if(tN > tD) { // tc > 1 => the t = 1 edge is visible
			tN = tD;
			// recompute sc for this edge
			if((-d + b) < 0.0)
				sN = 0;
			else if((-d + b) > a)
				sN = sD;
			else {
				sN = -d + b;
				sD = a;
			}
		}

		// finally do the division to get sc and tc
		sc = Math.abs(sN) < MeasureCommon.EPSILON ? 0.0 : sN / sD;
		tc = Math.abs(tN) < MeasureCommon.EPSILON ? 0.0 : tN / tD;

		// get the difference of the two closest points
		u.multiplyScalar(sc);
		v.multiplyScalar(tc);
		w.add(u);
		w.sub(v);

		//return w.length();

		u.add(p1);
		v.add(p3);
		return [u, v];
	};

	// Get the nearest point on edge from point to edge
	MeasureCommon.nearestPointInPointToEdge = function(edge, point) {

		var vertices = edge.vertices;
		var minDist = Number.MAX_VALUE;
		var nearestPoint = null;

		for(var i = 0; i < vertices.length; i += 2) {

			var nP = MeasureCommon.nearestPointInPointToSegment(point, vertices[i], vertices[i + 1]);
			var dist = point.distanceTo(nP);
			if(dist < minDist) {
				minDist = dist;
				nearestPoint = nP;
			}
		}

		return nearestPoint;
	};

	// Find the nearest point from point to plane
	MeasureCommon.nearestPointInPointToPlane = function(p1, p2, n) {

		var nearestPoint = new THREE.Vector3();
		var norm = n.clone();
		var X0 = new THREE.Vector3();
		X0.subVectors(p1, p2);

		var sn = -norm.dot(X0);
		var sd = norm.dot(norm);
		var sb = sn / sd;

		nearestPoint.addVectors(p1, norm.multiplyScalar(sb));
		return nearestPoint;
	};

	// Find the intersection point of two nonparallel lines
	MeasureCommon.intersectLineToLine = function(p1, v1, p2, v2) {

		var X0 = new THREE.Vector3();
		var X1 = new THREE.Vector3();

		X0.subVectors(p2, p1);
		X0.cross(v2);
		X1.crossVectors(v1, v2);

		var scalar = X0.divide(X1);

		X1 = v1.clone();
		X1.multiplyScalar(scalar);
		X0.addVectors(p1, X1);

		return X0;
	};

	// Returns true if v1 an v2 are parallel
	MeasureCommon.isParallel = function(v1, v2, precision) {
		precision = precision ? precision : MeasureCommon.EPSILON;
		return 1 - Math.abs(v1.dot(v2)) < precision;
	};

	MeasureCommon.isPerpendicular = function(v1, v2, precision) {
		precision = precision ? precision : MeasureCommon.EPSILON;
		return Math.abs(v1.dot(v2)) < precision;
	};

	// Find the intersection of two nonparallel planes
	MeasureCommon.intersectPlaneToPlane = function(p1, n1, p2, n2) {

		var u = new THREE.Vector3();
		u.crossVectors(n1, n2);
		var ax = (u.x >= 0 ? u.x : -u.x);
		var ay = (u.y >= 0 ? u.y : -u.y);
		var az = (u.z >= 0 ? u.z : -u.z);

		var maxc; // max coordinate
		if(ax > ay) {
			if(ax > az)
				maxc = 1;
			else
				maxc = 3;
		} else {
			if(ay > az)
				maxc = 2;
			else maxc = 3;
		}

		var iP = new THREE.Vector3(); // intersect point
		var d1, d2;
		d1 = -n1.dot(p1);
		d2 = -n2.dot(p2);

		switch(maxc) {

			case 1: // intersect with x = 0
				iP.x = 0;
				if(u.x !== 0) {
					iP.y = (d2 * n1.z - d1 * n2.z) / u.x;
					iP.z = (d1 * n2.y - d2 * n1.y) / u.x;
				} else {
					iP.y = -(d2 * n1.z) / (n1.z * n2.y);
					iP.z = -(d1 * n2.y) / (n1.z * n2.y);
				}
				break;
			case 2:
				iP.y = 0;
				if(u.y !== 0) {
					iP.x = (d1 * n2.z - d2 * n1.z) / u.y;
					iP.z = (d2 * n1.x - d1 * n2.x) / u.y;
				} else {
					iP.x = -(d1 * n2.z) / (n1.x * n2.z);
					iP.z = -(d2 * n1.x) / (n1.x * n2.z);
				}
				break;
			case 3:
				iP.z = 0;
				if(u.z !== 0) {
					iP.x = (d2 * n1.y - d1 * n2.y) / u.z;
					iP.y = (d1 * n2.x - d2 * n1.x) / u.z;
				} else {
					iP.x = -(d2 * n1.y) / (n1.y * n2.x);
					iP.y = -(d1 * n2.x) / (n1.y * n2.x);
				}
				break;
		}

		var iP2 = new THREE.Vector3();
		iP2.addVectors(iP, u.multiplyScalar(100));

		var vP1 = MeasureCommon.nearestPointInPointToLine(p1, iP, iP2);
		var vP2 = MeasureCommon.nearestPointInPointToLine(p2, iP, iP2);

		return [vP1, vP2];

	};

	// Find the nearest point from point to triangle
	MeasureCommon.nearestPointInPointToTriangle = function(point, a, b, c) {

		var nearestPoint;
		var minDist = Number.MAX_VALUE;

		nearestPoint = MeasureCommon.pointProjectsInTriangle(point, a, b, c);
		if(nearestPoint) {
			return nearestPoint;
		}

		var p = MeasureCommon.nearestPointInPointToSegment(point, a, b);
		if(point.distanceTo(p) < minDist) {
			minDist = point.distanceTo(p);
			nearestPoint = p.clone();
		}

		p = MeasureCommon.nearestPointInPointToSegment(point, a, c);
		if(point.distanceTo(p) < minDist) {
			minDist = point.distanceTo(p);
			nearestPoint = p.clone();
		}

		p = MeasureCommon.nearestPointInPointToSegment(point, b, c);
		if(point.distanceTo(p) < minDist) {

			nearestPoint = p.clone();
		}

		return nearestPoint;
	};

	MeasureCommon.pointProjectsInTriangle = function(point, a, b, c) {

		var u = new THREE.Vector3();
		var v = new THREE.Vector3();
		var w = new THREE.Vector3();
		var n = new THREE.Vector3();

		u.subVectors(b, a);
		v.subVectors(c, a);
		n.crossVectors(u, v);
		w.subVectors(point, a);

		u.cross(w);
		var r = u.dot(n) / n.dot(n);
		w.cross(v);
		var b = w.dot(n) / n.dot(n);
		var a = 1 - r - b;

		if(a >= 0 && a <= 1 && b >= 0 && b <= 1 && r >= 0 && r <= 1) {

			var normal = THREE.Triangle.normal(a, b, c);
			var nearestPoint = this.nearestPointInPointToPlane(point, a, normal);

			return nearestPoint;
		}
	};

	MeasureCommon.nearestPointsInLineSegmentToTriangle = function(p1, p2, a, b, c) {

		// The closest pair of points between a line segment and a triangle can always be found either
		// (a) between an endpoint of the segment an the triangle interior or
		// (b) between the segment and an edge of the triangle.

		var nearestPoints = [];
		var minDist = Number.MAX_VALUE;

		var p3, p4;

		var pp1 = MeasureCommon.pointProjectsInTriangle(p1, a, b, c);
		if(pp1 && p1.distanceTo(pp1) < minDist) {
			minDist = p1.distanceTo(pp1);
			nearestPoints[0] = p1;
			nearestPoints[1] = pp1;
		}

		var pp2 = MeasureCommon.pointProjectsInTriangle(p2, a, b, c);
		if(pp2 && p2.distanceTo(pp2) < minDist) {
			minDist = p2.distanceTo(pp2);
			nearestPoints[0] = p2;
			nearestPoints[1] = pp2;
		}

		p3 = a;
		p4 = b;
		var p = MeasureCommon.nearestPointsInSegmentToSegment(p1, p2, p3, p4);
		if(p[0].distanceTo(p[1]) < minDist) {
			minDist = p[0].distanceTo(p[1]);
			nearestPoints[0] = p[0].clone();
			nearestPoints[1] = p[1].clone();
		}

		p3 = a;
		p4 = c;
		p = MeasureCommon.nearestPointsInSegmentToSegment(p1, p2, p3, p4);
		if(p[0].distanceTo(p[1]) < minDist) {
			minDist = p[0].distanceTo(p[1]);
			nearestPoints[0] = p[0].clone();
			nearestPoints[1] = p[1].clone();
		}

		p3 = b;
		p4 = c;
		p = MeasureCommon.nearestPointsInSegmentToSegment(p1, p2, p3, p4);
		if(p[0].distanceTo(p[1]) < minDist) {

			nearestPoints[0] = p[0].clone();
			nearestPoints[1] = p[1].clone();
		}

		return nearestPoints;
	};

	// Find the two nearest points between triangle and triangle
	MeasureCommon.nearestPointsInTriangleToTriangle = function(a1, b1, c1, a2, b2, c2) {

		// A pair of closest points between two triangles can be found by computing the closest points between
		// segment and triangle for all six possible combinations of an edge from one triangle tested against
		// the other triangle. But segment-triangle distance tests are fairly expensive,  and thus a better
		// realization is that the closest pair of points between T1 and T2 can be found to occur either on
		// an edge from each triangle or as a vertex of one triangle and a point interior to the other triangle.
		// In all, six vertex-triangle tests and nine edge-edge tests are required.

		var nearestPoints = [];
		var minDist = Number.MAX_VALUE;

		function vertexToTriangleTest(point, a, b, c) {

			var p = MeasureCommon.pointProjectsInTriangle(point, a, b, c);
			if(p && point.distanceTo(p) < minDist) {
				minDist = point.distanceTo(p);
				nearestPoints[0] = point;
				nearestPoints[1] = p;
			}
		}

		function edgeToEdgeTest(p1, p2, p3, p4) {

			var p = MeasureCommon.nearestPointsInSegmentToSegment(p1, p2, p3, p4);
			if(p[0].distanceTo(p[1]) < minDist) {
				minDist = p[0].distanceTo(p[1]);
				nearestPoints = p;
			}
		}

		// a1
		vertexToTriangleTest(a1, a2, b2, c2);

		// b1
		vertexToTriangleTest(b1, a2, b2, c2);

		// c1
		vertexToTriangleTest(c1, a2, b2, c2);

		// a2
		vertexToTriangleTest(a2, a1, b1, c1);

		// b2
		vertexToTriangleTest(b2, a1, b1, c1);

		// c2
		vertexToTriangleTest(c2, a1, b1, c1);

		// edge a1b1 and a2b2
		edgeToEdgeTest(a1, b1, a2, b2);

		// edge a1b1 and a2c2
		edgeToEdgeTest(a1, b1, a2, c2);

		// edge a1b1 and b2c2
		edgeToEdgeTest(a1, b1, b2, c2);

		// edge a1c1 and a2b2
		edgeToEdgeTest(a1, c1, a2, b2);

		// edge a1c1 and a2c2
		edgeToEdgeTest(a1, c1, a2, c2);

		// edge a1c1 and b2c2
		edgeToEdgeTest(a1, c1, b2, c2);

		// edge b1c1 and a2b2
		edgeToEdgeTest(b1, c1, a2, b2);

		// edge b1c1 and a2c2
		edgeToEdgeTest(b1, c1, a2, c2);

		// edge b1c1 and b2c2
		edgeToEdgeTest(b1, c1, b2, c2);

		return nearestPoints;
	};

	// Find the two nearest points between edge and face
	MeasureCommon.nearestPointsInEdgeToFace = function(p1, p2, face) {

		var nearestPoints = [];
		var minDist = Number.MAX_VALUE;

		for(var i = 0; i < face.vertices.length; i += 3) {

			var tempPs = MeasureCommon.nearestPointsInLineSegmentToTriangle(p1, p2, face.vertices[i], face.vertices[i + 1], face.vertices[i + 2]);
			if(tempPs[0].distanceTo(tempPs[1]) < minDist) {
				minDist = tempPs[0].distanceTo(tempPs[1]);
				nearestPoints = tempPs;
			}
		}

		return nearestPoints;
	};

	// Get the angle between line and plane
	MeasureCommon.angleLineToPlane = function(v, n) {

		var angle = MeasureCommon.angleVectorToVector(v, n);

		if(angle > 90) {
			angle -= 90;
		} else {
			angle = 90 - angle;
		}

		return angle;
	};

	// Get the intersect point between line and plane
	MeasureCommon.intersectPointLineToPlane = function(p0, n0, p1, p2) {

		var u = new THREE.Vector3();
		var w = new THREE.Vector3();
		u.subVectors(p2, p1);
		w.subVectors(p1, p0);

		var D = n0.dot(u);
		var N = -n0.dot(w);

		if(Math.abs(D) < MeasureCommon.EPSILON) { // edge is parallel to plane
			if(N == 0) // edge lies in plane
				return null;
			else
				return null; // no intersection
		}

		// they are not parallel
		u.multiplyScalar(N / D); // compute segment intersect point
		u.add(p1);
		return u;
	};

	// Find the vertex need to draw For circular arc's radius
	MeasureCommon.nearestVertexInVertexToEdge = function(vertex, edge) {

		var nearestPoint;
		var minDist = Number.MAX_VALUE;

		for(var i = 0; i < edge.vertices.length; i++) {
			var dist = vertex.distanceTo(edge.vertices[i]);
			if(minDist > dist) {
				nearestPoint = edge.vertices[i];
				minDist = dist;
			}
		}

		return nearestPoint;
	};

	MeasureCommon.distancePointToLine = function(point, lineStart, lineEnd) {

		var X0 = new THREE.Vector3();
		var X1 = new THREE.Vector3();
		var distance;
		var param;

		X0.subVectors(lineStart, point);
		X1.subVectors(lineEnd, lineStart);
		param = X0.dot(X1);
		X0.subVectors(lineEnd, lineStart);
		param = -param / X0.dot(X0);

		if(param < 0) {
			distance = point.distanceTo(lineStart);
		} else if(param > 1) {
			distance = point.distanceTo(lineEnd);
		} else {
			X0.subVectors(point, lineStart);
			X1.subVectors(point, lineEnd);
			X0.cross(X1);
			X1.subVectors(lineEnd, lineStart);

			distance = Math.sqrt(X0.dot(X0)) / Math.sqrt(X1.dot(X1));
		}

		return distance;
	};

	// Helper to iterator over all properties in an object
	MeasureCommon.forAll = function(obj, func) {
		if(obj) {
			for(var i in obj) {
				if(obj.hasOwnProperty(i)) {
					var m = obj[i];
					if(m)
						func(m);
				}
			}
		}
	};

	MeasureCommon.createCommonOverlay = function(viewer, name) {
		if(!viewer.impl.overlayScenes[name])
			viewer.impl.createOverlayScene(name);
	};

	MeasureCommon.safeToggle = function(element, property, show) {
		// toggle only if it needs to. Necessary for IE11.

		if((element.classList.contains(property) && !show) || (!element.classList.contains(property) && show)) {
			element.classList.toggle(property, show);
		}
	};

	// Centroid of a polygon is the average of its points.
	MeasureCommon.getCentroidOfPolygon = function(points) {
		var centroid = new THREE.Vector3();
		var n = points.length;

		for(var i = 0; i < n; i++) {
			centroid.add(points[i]);
		}

		centroid.multiplyScalar(1 / n);
		return centroid;
	};

	// Algorithm taken from here:
	// https://www.codeproject.com/Tips/862988/Find-the-Intersection-Point-of-Two-Line-Segments
	MeasureCommon.isSegmentsIntersect = function(p1, p2, q1, q2) {
		var r = new THREE.Vector3();
		var s = new THREE.Vector3();
		var rxs = new THREE.Vector3();
		var tmp = new THREE.Vector3();

		r.subVectors(p2, p1);
		s.subVectors(q2, q1);
		rxs.crossVectors(r, s);

		// The two lines are parallel and non-intersecting.
		if(Math.abs(rxs.z) < MeasureCommon.EPSILON)
			return false;

		var t = tmp.subVectors(q1, p1).cross(s).z / rxs.z;
		var u = tmp.subVectors(q1, p1).cross(r).z / rxs.z;

		// the two line segments meet at the point p + t r = q + u s.
		if(!(Math.abs(rxs.z) < MeasureCommon.EPSILON) && (0 <= t && t <= 1) && (0 <= u && u <= 1)) {
			// An intersection was found.
			return true;
		}

		// 5. Otherwise, the two line segments are not parallel but do not intersect.
		return false;
	};

	// A polygon is a simple polygon if there are no intersection between its edges.
	MeasureCommon.isPolygonSimple = function(points) {
		var n = points.length;

		if(n === 3) {
			return true;
		}

		for(var i = 0; i < n; i++) {

			var p1 = points[i];
			var p2 = points[(i + 1) % n];

			for(var j = i + 2; j < n; j++) {

				var q1 = points[(j) % n];
				var q2 = points[(j + 1) % n];

				if(q2 === p1) {
					break;
				}

				if(MeasureCommon.isSegmentsIntersect(p1, p2, q1, q2)) {
					return false;
				}
			}
		}

		return true;
	};

	// Algorithm based on https://github.com/mapbox/polylabel
	MeasureCommon.getPolygonVisualCenter = function(polygon) {
		function compareMax(a, b) {
			return b.max - a.max;
		}

		function Cell(x, y, h, polygon) {
			this.x = x; // cell center x
			this.y = y; // cell center y
			this.h = h; // half the cell size
			this.d = pointToPolygonDist(x, y, polygon); // distance from cell center to polygon
			this.max = this.d + this.h * Math.SQRT2; // max distance to polygon within a cell
		}

		// signed distance from point to polygon outline (negative if point is outside)
		function pointToPolygonDist(x, y, polygon) {
			var inside = false;
			var minDistSq = Infinity;

			for(var k = 0; k < polygon.length; k++) {
				var ring = polygon[k];

				for(var i = 0, len = ring.length, j = len - 1; i < len; j = i++) {
					var a = ring[i];
					var b = ring[j];

					if((a.y > y !== b.y > y) &&
						(x < (b.x - a.x) * (y - a.y) / (b.y - a.y) + a.x)) inside = !inside;

					minDistSq = Math.min(minDistSq, getSegDistSq(x, y, a, b));
				}
			}

			return(inside ? 1 : -1) * Math.sqrt(minDistSq);
		}

		// get polygon centroid
		function getCentroidCell(polygon) {
			var area = 0;
			var x = 0;
			var y = 0;
			var points = polygon[0];

			for(var i = 0, len = points.length, j = len - 1; i < len; j = i++) {
				var a = points[i];
				var b = points[j];
				var f = a.x * b.y - b.x * a.y;
				x += (a.x + b.x) * f;
				y += (a.y + b.y) * f;
				area += f * 3;
			}
			if(area === 0) return new Cell(points[0].x, points[0].y, 0, polygon);
			return new Cell(x / area, y / area, 0, polygon);
		}

		// get squared distance from a point to a segment
		function getSegDistSq(px, py, a, b) {

			var x = a.x;
			var y = a.y;
			var dx = b.x - x;
			var dy = b.y - y;

			if(dx !== 0 || dy !== 0) {

				var t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);

				if(t > 1) {
					x = b.x;
					y = b.y;

				} else if(t > 0) {
					x += dx * t;
					y += dy * t;
				}
			}

			dx = px - x;
			dy = py - y;

			return dx * dx + dy * dy;
		}

		function TinyQueue(data, compare) {

			function defaultCompare(a, b) {
				return a < b ? -1 : a > b ? 1 : 0;
			}

			if(!(this instanceof TinyQueue)) return new TinyQueue(data, compare);

			this.data = data || [];
			this.length = this.data.length;
			this.compare = compare || defaultCompare;

			if(this.length > 0) {
				for(var i = (this.length >> 1); i >= 0; i--) this._down(i);
			}
		}

		TinyQueue.prototype = {

			push: function(item) {
				this.data.push(item);
				this.length++;
				this._up(this.length - 1);
			},

			pop: function() {
				if(this.length === 0) return undefined;

				var top = this.data[0];
				this.length--;

				if(this.length > 0) {
					this.data[0] = this.data[this.length];
					this._down(0);
				}
				this.data.pop();

				return top;
			},

			peek: function() {
				return this.data[0];
			},

			_up: function(pos) {
				var data = this.data;
				var compare = this.compare;
				var item = data[pos];

				while(pos > 0) {
					var parent = (pos - 1) >> 1;
					var current = data[parent];
					if(compare(item, current) >= 0) break;
					data[pos] = current;
					pos = parent;
				}

				data[pos] = item;
			},

			_down: function(pos) {
				var data = this.data;
				var compare = this.compare;
				var halfLength = this.length >> 1;
				var item = data[pos];

				while(pos < halfLength) {
					var left = (pos << 1) + 1;
					var right = left + 1;
					var best = data[left];

					if(right < this.length && compare(data[right], best) < 0) {
						left = right;
						best = data[right];
					}
					if(compare(best, item) >= 0) break;

					data[pos] = best;
					pos = left;
				}

				data[pos] = item;
			}
		};

		if(polygon.length === 3) {
			return MeasureCommon.getCentroidOfPolygon(polygon);
		}

		var precision = 0.01;
		polygon = [polygon];

		// find the bounding box of the outer ring
		var minX, minY, maxX, maxY;
		for(var i = 0; i < polygon[0].length; i++) {
			var p = polygon[0][i];
			if(!i || p.x < minX) minX = p.x;
			if(!i || p.y < minY) minY = p.y;
			if(!i || p.x > maxX) maxX = p.x;
			if(!i || p.y > maxY) maxY = p.y;
		}

		var width = maxX - minX;
		var height = maxY - minY;
		var cellSize = Math.min(width, height);
		var h = cellSize / 2;

		// a priority queue of cells in order of their "potential" (max distance to polygon)
		var cellQueue = new TinyQueue(null, compareMax);

		if(cellSize === 0) return [minX, minY];

		// cover polygon with initial cells
		for(var x = minX; x < maxX; x += cellSize) {
			for(var y = minY; y < maxY; y += cellSize) {
				cellQueue.push(new Cell(x + h, y + h, h, polygon));
			}
		}

		// take centroid as the first best guess
		var bestCell = getCentroidCell(polygon);

		// special case for rectangular polygons
		var bboxCell = new Cell(minX + width / 2, minY + height / 2, 0, polygon);
		if(bboxCell.d > bestCell.d) bestCell = bboxCell;

		while(cellQueue.length) {
			// pick the most promising cell from the queue
			var cell = cellQueue.pop();

			// update the best cell if we found a better one
			if(cell.d > bestCell.d) {
				bestCell = cell;
			}

			// do not drill down further if there's no chance of a better solution
			if(cell.max - bestCell.d <= precision) continue;

			// split the cell into four cells
			h = cell.h / 2;
			cellQueue.push(new Cell(cell.x - h, cell.y - h, h, polygon));
			cellQueue.push(new Cell(cell.x + h, cell.y - h, h, polygon));
			cellQueue.push(new Cell(cell.x - h, cell.y + h, h, polygon));
			cellQueue.push(new Cell(cell.x + h, cell.y + h, h, polygon));
		}

		return {
			x: bestCell.x,
			y: bestCell.y
		};
	};

})();;
(function() {
	'use strict';

	var MeasureCommon = ZhiUTech.Viewing.MeasureCommon;

	/**
	 * This is a DATA container class.
	 * No rendering should be attached to it.
	 * @private
	 */
	function Measurement(measurementType, id) {

		this.measurementType = measurementType;
		this.id = id;
		this.picks = [];
		this.closedArea = false;

		this.resetMeasureValues();
	}

	Measurement.prototype.resetMeasureValues = function() {

		this.angle = 0;
		this.distanceX = 0;
		this.distanceY = 0;
		this.distanceZ = 0;
		this.distanceXYZ = 0;
		this.result = null;
	};

	Measurement.prototype.setPick = function(index, value) {

		var pick = this.picks[index] = value;
		pick.id = parseInt(index);
		return pick;
	};

	Measurement.prototype.getPick = function(index) {

		var pick = this.picks[index];

		if(!pick) {
			pick = this.setPick(index, new MeasureCommon.SnapResult());
		}

		return pick;
	};

	Measurement.prototype.countPicks = function() {

		return Object.keys(this.picks).length;
	};

	Measurement.prototype.getMaxNumberOfPicks = function() {

		switch(this.measurementType) {
			case MeasureCommon.MeasurementTypes.MEASUREMENT_DISTANCE:
				return 2;

			case MeasureCommon.MeasurementTypes.MEASUREMENT_ANGLE:
				return 3;

			case MeasureCommon.MeasurementTypes.MEASUREMENT_AREA:
				return this.closedArea ? this.countPicks() : Number.MAX_VALUE - 1;
		}
	};

	Measurement.prototype.hasPick = function(pickNumber) {

		return this.picks[pickNumber] && !this.picks[pickNumber].isEmpty();
	};

	Measurement.prototype.isComplete = function() {
		var complete = this.countPicks() === this.getMaxNumberOfPicks();

		for(var key in this.picks) {
			if(this.picks.hasOwnProperty(key)) {
				complete = complete && this.hasPick(key);

				if(!complete)
					break;
			}
		}

		return complete;
	};

	Measurement.prototype.isEmpty = function() {
		var empty = true;

		for(var key in this.picks) {
			if(this.picks.hasOwnProperty(key)) {
				empty = empty && !this.hasPick(key);

				if(!empty)
					break;
			}
		}

		return empty;
	};

	Measurement.prototype.clearPick = function(pickNumber) {

		if(this.picks[pickNumber]) {
			this.picks[pickNumber].clear();
		}

		this.resetMeasureValues();
	};

	Measurement.prototype.clearAllPicks = function() {

		for(var key in this.picks) {
			if(this.picks.hasOwnProperty(key)) {
				this.clearPick(key);
			}
		}
	};

	Measurement.prototype.hasEqualPicks = function(firstPick, secondPick) {
		if(!firstPick || !secondPick)
			return false;

		if(firstPick.geomType === secondPick.geomType) {
			var first = MeasureCommon.getSnapResultPosition(firstPick);
			var second = MeasureCommon.getSnapResultPosition(secondPick);
			return MeasureCommon.isEqualVectors(first, second, MeasureCommon.EPSILON);
		}

		return false;
	};

	/**
	 * Calculates distance/angle based on the values of the picks
	 * and stores it in .result
	 */
	Measurement.prototype.computeResult = function(picks, viewer) {

		this.resetMeasureValues();

		if(!viewer.model) {
			this.result = null;
			return false;
		}

		// Compute and check if there's a result
		var result = this.result = MeasureCommon.computeResult(picks, this.measurementType, viewer);

		if(result === null) {
			return !this.isComplete();
		}

		switch(result.type) {
			case MeasureCommon.MeasurementTypes.MEASUREMENT_DISTANCE:
				this.distanceXYZ = result.distanceXYZ;
				this.distanceX = result.distanceX;
				this.distanceY = result.distanceY;
				this.distanceZ = result.distanceZ;
				return true;

			case MeasureCommon.MeasurementTypes.MEASUREMENT_ANGLE:
				this.angle = isNaN(result.angle) ? 0 : result.angle;
				return true;

			case MeasureCommon.MeasurementTypes.MEASUREMENT_AREA:
				this.area = result.area;
				return true;

			default:
				return false;
		}
	};

	Measurement.prototype.getGeometry = function(pickNumber) {
		return {
			"type": this.picks[pickNumber].geomType,
			"geometry": this.picks[pickNumber].getGeometry()
		};
	};

	// TODO: Move this method elsewhere. This is a data-only class.
	Measurement.prototype.attachIndicator = function(viewer, tool, indicatorClass) {
		this.indicator = new indicatorClass(viewer, this, tool);
		this.indicator.init();
	};

	// export
	MeasureCommon.Measurement = Measurement;

})();;
(function() {
	'use strict';

	var MeasureCommon = ZhiUTechNamespace("ZhiUTech.Viewing.MeasureCommon");

	MeasureCommon.SnapResult = function() {
		this.clear();
	};

	MeasureCommon.SnapResult.prototype.clear = function() {

		this.geomType = null; // int, such as { "NONE: -1", "VERTEX": 0, "EDGE": 1, "FACE": 2, ... }
		this.snapNode = null; // int, the dbId
		this.geomVertex = null; // THREE.Vector3
		this.geomEdge = null; // THREE.Geometry
		this.geomFace = null; // THREE.Geometry
		this.radius = null; // Number
		this.intersectPoint = null; // THREE.Vector3
		this.faceNormal = null; // THREE.Vector3
		this.viewportIndex2d = null; // int
		this.circularArcCenter = null;
		this.circularArcRadius = null;
		this.fromTopology = false;
		this.isPerpendicular = false;
	};

	MeasureCommon.SnapResult.prototype.copyTo = function(destiny) {
		// Shallow copies of THREE objects should be fine.
		destiny.snapNode = this.snapNode;
		destiny.geomVertex = this.geomVertex;
		destiny.geomFace = this.geomFace;
		destiny.geomEdge = this.geomEdge;
		destiny.radius = this.radius;
		destiny.geomType = this.geomType;
		destiny.intersectPoint = this.intersectPoint;
		destiny.faceNormal = this.faceNormal;
		destiny.viewportIndex2d = this.viewportIndex2d;
		destiny.circularArcCenter = this.circularArcCenter;
		destiny.circularArcRadius = this.circularArcRadius;
		destiny.fromTopology = this.fromTopology;
		destiny.isPerpendicular = this.isPerpendicular;
	};

	MeasureCommon.SnapResult.prototype.clone = function() {
		var theClone = new MeasureCommon.SnapResult();
		this.copyTo(theClone);
		return theClone;
	};

	MeasureCommon.SnapResult.prototype.isEmpty = function() {
		return !this.getGeometry();
	};

	MeasureCommon.SnapResult.prototype.getFace = function() {
		return this.geomFace;
	};

	MeasureCommon.SnapResult.prototype.getEdge = function() {
		return this.geomEdge;
	};

	MeasureCommon.SnapResult.prototype.getVertex = function() {
		return this.geomVertex;
	};

	MeasureCommon.SnapResult.prototype.getGeometry = function() {

		switch(this.geomType) {
			case MeasureCommon.SnapType.SNAP_VERTEX:
				return this.geomVertex;
			case MeasureCommon.SnapType.SNAP_MIDPOINT:
				return this.geomVertex;
			case MeasureCommon.SnapType.SNAP_CIRCLE_CENTER:
				return this.geomVertex;
			case MeasureCommon.SnapType.SNAP_EDGE:
				return this.geomEdge;
			case MeasureCommon.SnapType.SNAP_FACE:
				return this.geomFace;
			case MeasureCommon.SnapType.SNAP_CIRCULARARC:
				return this.geomEdge;
			case MeasureCommon.SnapType.SNAP_CURVEDEDGE:
				return this.geomEdge;
			case MeasureCommon.SnapType.SNAP_CURVEDFACE:
				return this.geomFace;
			default:
				break;
		}
		return null;
	};

	MeasureCommon.SnapResult.prototype.setGeometry = function(type, geometry) {

		switch(type) {
			case MeasureCommon.SnapType.SNAP_VERTEX:
				this.geomVertex = geometry;
				break;
			case MeasureCommon.SnapType.SNAP_MIDPOINT:
				this.geomVertex = geometry;
				break;
			case MeasureCommon.SnapType.SNAP_CIRCLE_CENTER:
				this.geomVertex = geometry;
				break;
			case MeasureCommon.SnapType.SNAP_EDGE:
				this.geomEdge = geometry;
				break;
			case MeasureCommon.SnapType.SNAP_FACE:
				this.geomFace = geometry;
				break;
			case MeasureCommon.SnapType.SNAP_CIRCULARARC:
				this.geomEdge = geometry;
				break;
			case MeasureCommon.SnapType.SNAP_CURVEDEDGE:
				this.geomEdge = geometry;
				break;
			case MeasureCommon.SnapType.SNAP_CURVEDFACE:
				this.geomFace = geometry;
				break;
			default:
				return;
		}
		this.geomType = type;
	};

})();;
(function() {

	var zv = ZhiUTech.Viewing;
	var zvp = ZhiUTech.Viewing.Private;

	var MeasureCommon = ZhiUTechNamespace("ZhiUTech.Viewing.MeasureCommon");

	var SNAP_PRECISION = 0.001;

	function isEqualWithPrecision(a, b) {
		return Math.abs(a - b) <= SNAP_PRECISION;
	}

	function isEqualVectorsWithPrecision(v1, v2) {
		return Math.abs(v1.x - v2.x) <= SNAP_PRECISION &&
			Math.abs(v1.y - v2.y) <= SNAP_PRECISION &&
			Math.abs(v1.z - v2.z) <= SNAP_PRECISION;
	}

	function isInverseVectorsWithPrecision(v1, v2) {
		return Math.abs(v1.x + v2.x) <= SNAP_PRECISION &&
			Math.abs(v1.y + v2.y) <= SNAP_PRECISION &&
			Math.abs(v1.z + v2.z) <= SNAP_PRECISION;
	}

	//
	// /** @constructor */
	//
	//
	function Snapper(viewer, options) {

		var _snapResult = new MeasureCommon.SnapResult();

		var _viewer = viewer;
		var _options = options || {};
		var _names;

		if(_options.markupMode) {
			_names = ["snapper-markup"];
		} else {
			_names = ["snapper"];
		}

		var _priority = 60;

		var _active = false;

		var _distanceToEdge = Number.MAX_VALUE;
		var _distanceToVertex = null;

		var _isDragging = false;
		var _isPressing = false;
		var _isSnapped = false;

		var _forcedVpId = null; // the viewport index of the first selection for 2D

		this.indicator = new MeasureCommon.SnapperIndicator(viewer, this);

		this.markupMode = _options.markupMode;

		this.isActive = function() {
			return _active;
		};

		this.getNames = function() {
			return _names;
		};

		this.getName = function() {
			return _names[0];
		};

		this.getPriority = function() {
			return _priority;
		};

		this.activate = function() {
			_active = true;

			if(!this.indicator) {
				this.indicator = new MeasureCommon.SnapperIndicator(viewer, this);
			}
		};

		this.deactivate = function() {
			_active = false;

			if(this.indicator) {
				this.indicator.destroy();
				this.indicator = null;
			}
		};

		this.copyResults = function(destiny) {
			_snapResult.copyTo(destiny);
		};

		this.getEdge = function() {
			return _snapResult.geomEdge;
		};

		this.getVertex = function() {
			return _snapResult.geomVertex;
		};

		this.getGeometry = function() {
			return _snapResult.getGeometry();
		};

		this.getGeometryType = function() {
			return _snapResult.geomType;
		};

		this.getIntersectPoint = function() {
			return _snapResult.intersectPoint;
		};

		this.getSnapResult = function() {
			return _snapResult;
		};

		this.isSnapped = function() {
			return _isSnapped;
		};

		this.clearSnapped = function() {
			_snapResult.clear();
			_isSnapped = false;
		};

		this.setViewportId = function(vpId) {
			_forcedVpId = vpId;
		};

		/**
		 * 3D Snapping
		 * @param result -Result of Hit Test.
		 */
		this.snapping3D = function(result) {

			_snapResult.snapNode = result.dbId;
			_snapResult.intersectPoint = result.intersectPoint;

			var face = result.face;
			var fragIds;

			if(!result.fragId || result.fragId.length === undefined) {
				fragIds = [result.fragId];
			} else {
				fragIds = result.fragId;
			}

			// This is for Fusion model with topology data
			_snapResult.hasTopology = result.model.hasTopology();
			if(_snapResult.hasTopology) {
				this.snapping3DwithTopology(face, fragIds, result.model);
			} else {
				this.snapping3DtoMesh(face, fragIds, result.model);
			}
		};

		/**
		 * Snapping order is: 1st vertices, 2nd edges, 3rd and final faces.
		 */
		this.snapping3DwithTopology = function(face, fragIds, model) {

			// Because edge topology data may be in other fragments with same dbId, need to iterate all of them.
			if(_snapResult.snapNode) {
				fragIds = [];

				model.getData().instanceTree.enumNodeFragments(_snapResult.snapNode, function(fragId) {
					fragIds.push(fragId);
				}, true);
			}

			_snapResult.geomFace = _snapResult.geomEdge = _snapResult.geomVertex = null;
			_distanceToEdge = Number.MAX_VALUE;

			for(var fi = 0; fi < fragIds.length; ++fi) {

				var fragId = fragIds[fi];
				var mesh = _viewer.impl.getRenderProxy(model, fragId);
				var geometry = mesh.geometry;

				var topoIndex = model.getTopoIndex(fragId);
				var topology = model.getTopology(topoIndex);
				var facesTopology = topology.faces;
				var edgesTopology = topology.edges;

				if(!_snapResult.geomFace) {
					_snapResult.geomFace = this.faceSnappingWithTopology(face, geometry, facesTopology, mesh);

					if(_snapResult.geomFace) {
						_snapResult.geomFace.fragId = fragId;
					}

					var normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
					_snapResult.faceNormal = face.normal.applyMatrix3(normalMatrix).normalize();
				}

				// Need to iterate all frags with same dbId, because when meshes are attached with each other, 
				// edge-topology data will only be on one mesh.
				this.edgeSnappingWithTopology(_snapResult.intersectPoint, geometry, edgesTopology, mesh);

			}

			_snapResult.geomVertex = this.vertexSnappingWithTopology(_snapResult.geomEdge, _snapResult.intersectPoint);

			if(_snapResult.geomFace) {

				// Determine which one should be drawn: face , edge or vertex
				_snapResult.radius = this.setDetectRadius(_snapResult.intersectPoint);

				if((_options.forceSnapVertices || _distanceToVertex < _snapResult.radius) && _snapResult.geomVertex) {
					_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
				} else if((_options.forceSnapEdges || _distanceToEdge < _snapResult.radius) && _snapResult.geomEdge) {

					var center = this.edgeIsCircle(_snapResult.geomEdge);
					if(center) {
						_snapResult.circularArcCenter = center;
						_snapResult.circularArcRadius = center.distanceTo(_snapResult.geomEdge.vertices[0]);
						_snapResult.geomEdge.center = _snapResult.circularArcCenter;
						_snapResult.geomEdge.radius = _snapResult.circularArcRadius;
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_CIRCULARARC;
					} else if(this.edgeIsCurved(_snapResult.geomEdge)) {
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_CURVEDEDGE;
					} else {
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_EDGE;
					}

				} else {

					if(this.faceIsCurved(_snapResult.geomFace)) {
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_CURVEDFACE;
					} else {
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_FACE;
					}

				}

				_isSnapped = true;
			}
		};

		this.snapping3DtoMesh = function(face, fragIds, model) {
			for(var fi = 0; fi < fragIds.length; ++fi) {

				var fragId = fragIds[fi];
				var mesh = _viewer.impl.getRenderProxy(model, fragId);
				var geometry = mesh.geometry;

				_snapResult.geomFace = this.faceSnapping(face, geometry);

				if(!_snapResult.geomFace)
					continue;

				_snapResult.geomFace.applyMatrix(mesh.matrixWorld);
				_snapResult.geomEdge = this.edgeSnapping(_snapResult.geomFace, _snapResult.intersectPoint);
				_snapResult.geomVertex = this.vertexSnapping(_snapResult.geomEdge, _snapResult.intersectPoint);

				var normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
				_snapResult.faceNormal = face.normal.applyMatrix3(normalMatrix).normalize();

				// Determine which one should be drawn: face , edge or vertex
				_snapResult.radius = this.setDetectRadius(_snapResult.intersectPoint);

				if((_options.forceSnapVertices || (_distanceToVertex < _snapResult.radius))) {
					_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
				} else if(_options.forceSnapEdges || (_distanceToEdge < _snapResult.radius)) {
					_snapResult.geomType = MeasureCommon.SnapType.SNAP_EDGE;
				} else {
					_snapResult.geomType = MeasureCommon.SnapType.SNAP_FACE;
				}

				_isSnapped = true;
				break;
			}
		};

		this.faceSnappingWithTopology = function(face, geometry, facesTopology, mesh) {

			var vA = new THREE.Vector3();
			var vB = new THREE.Vector3();
			var vC = new THREE.Vector3();

			var geom = new THREE.Geometry();

			var attributes = geometry.attributes;

			if(attributes.index !== undefined) {

				var positions = geometry.vb ? geometry.vb : attributes.position.array;
				var stride = geometry.vb ? geometry.vbstride : 3;

				// Find the index of face topology list which includes the intersect face(triangle)
				for(var i = 0; i < facesTopology.length; i++) {

					var indexList = facesTopology[i].indexList;
					var faceId = facesTopology[i].id;
					for(var j = 0; j < indexList.length; j += 3) {

						if(face.a === indexList[j]) {
							if((face.b === indexList[j + 1] && face.c === indexList[j + 2]) || (face.b === indexList[j + 2] && face.c === indexList[j + 1])) {
								break;
							}
						} else if(face.a === indexList[j + 1]) {
							if((face.b === indexList[j] && face.c === indexList[j + 2]) || (face.b === indexList[j + 2] && face.c === indexList[j])) {
								break;
							}
						} else if(face.a === indexList[j + 2]) {
							if((face.b === indexList[j] && face.c === indexList[j + 1]) || (face.b === indexList[j + 1] && face.c === indexList[j])) {
								break;
							}
						}
					}

					if(j < indexList.length) {
						break;
					}
				}

				if(i < facesTopology.length) {

					for(var j = 0; j < indexList.length; j += 3) {
						vA.set(
							positions[indexList[j] * stride],
							positions[indexList[j] * stride + 1],
							positions[indexList[j] * stride + 2]
						);
						vB.set(
							positions[indexList[j + 1] * stride],
							positions[indexList[j + 1] * stride + 1],
							positions[indexList[j + 1] * stride + 2]
						);
						vC.set(
							positions[indexList[j + 2] * stride],
							positions[indexList[j + 2] * stride + 1],
							positions[indexList[j + 2] * stride + 2]
						);

						var vIndex = geom.vertices.length;

						geom.vertices.push(vA.clone());
						geom.vertices.push(vB.clone());
						geom.vertices.push(vC.clone());

						geom.faces.push(new THREE.Face3(vIndex, vIndex + 1, vIndex + 2));
					}
				}
			}

			//console.log(face);

			if(geom.vertices.length > 0) {

				geom.faceId = faceId;
				geom.applyMatrix(mesh.matrixWorld);
				return geom;
			} else {

				return null;
			}

		};

		/**
		 * Find the closest face next to the cast ray
		 * @param face - the intersect triangle of Hit Test.
		 * @param geometry - the geometry of mesh
		 */
		this.faceSnapping = function(face, geometry) {

			var vA = new THREE.Vector3();
			var vB = new THREE.Vector3();
			var vC = new THREE.Vector3();

			var geom = new THREE.Geometry(); //Geometry which includes all the triangles on the same plane.

			var attributes = geometry.attributes;

			if(attributes.index !== undefined) {

				var indices = attributes.index.array || geometry.ib;
				var positions = geometry.vb ? geometry.vb : attributes.position.array;
				var stride = geometry.vb ? geometry.vbstride : 3;
				var offsets = geometry.offsets;

				if(!offsets || offsets.length === 0) {

					offsets = [{
						start: 0,
						count: indices.length,
						index: 0
					}];

				}

				for(var oi = 0; oi < offsets.length; ++oi) {

					var start = offsets[oi].start;
					var count = offsets[oi].count;
					var index = offsets[oi].index;

					for(var i = start; i < start + count; i += 3) {

						var a = index + indices[i];
						var b = index + indices[i + 1];
						var c = index + indices[i + 2];

						vA.set(
							positions[a * stride],
							positions[a * stride + 1],
							positions[a * stride + 2]
						);
						vB.set(
							positions[b * stride],
							positions[b * stride + 1],
							positions[b * stride + 2]
						);
						vC.set(
							positions[c * stride],
							positions[c * stride + 1],
							positions[c * stride + 2]
						);

						var faceNormal = THREE.Triangle.normal(vA, vB, vC);

						var va = new THREE.Vector3();
						va.set(
							positions[face.a * stride],
							positions[face.a * stride + 1],
							positions[face.a * stride + 2]
						);

						if(isEqualVectorsWithPrecision(faceNormal, face.normal) && isEqualWithPrecision(faceNormal.dot(vA), face.normal.dot(va))) {

							var vIndex = geom.vertices.length;

							geom.vertices.push(vA.clone());
							geom.vertices.push(vB.clone());
							geom.vertices.push(vC.clone());

							geom.faces.push(new THREE.Face3(vIndex, vIndex + 1, vIndex + 2));

						}
					}
				}
			}

			if(geom.vertices.length > 0) {

				return this.getTrianglesOnSameFace(geom, face, positions, stride);
			} else {

				return null;
			}
		};

		/**
		 * Find triangles on the same face with the triangle intersected with the cast ray
		 * @param geom -Geometry which includes all the triangles on the same plane.
		 * @param face -Triangle which intersects with the cast ray.
		 * @param positions -Positions of all vertices.
		 * @param stride -Stride for the interleaved buffer.
		 */
		this.getTrianglesOnSameFace = function(geom, face, positions, stride) {

			var isIncludeFace = false; // Check if the intersect face is in the mesh
			var vertexIndices = geom.vertices.slice();

			var va = new THREE.Vector3();
			va.set(
				positions[face.a * stride],
				positions[face.a * stride + 1],
				positions[face.a * stride + 2]
			);
			var vb = new THREE.Vector3();
			vb.set(
				positions[face.b * stride],
				positions[face.b * stride + 1],
				positions[face.b * stride + 2]
			);
			var vc = new THREE.Vector3();
			vc.set(
				positions[face.c * stride],
				positions[face.c * stride + 1],
				positions[face.c * stride + 2]
			);
			var intersectFace = new THREE.Geometry();
			intersectFace.vertices.push(va);
			intersectFace.vertices.push(vb);
			intersectFace.vertices.push(vc);
			intersectFace.faces.push(new THREE.Face3(0, 1, 2));

			var vCount = [];

			do {

				vCount = [];

				for(var j = 0; j < vertexIndices.length; j += 3) {

					// The triangle which is intersected with the ray
					if(vertexIndices[j].equals(va) && vertexIndices[j + 1].equals(vb) && vertexIndices[j + 2].equals(vc)) {

						isIncludeFace = true;
						vCount.push(j);
						continue;
					}

					for(var k = 0; k < intersectFace.vertices.length; k += 3) {

						// The triangles which are on the same face with the intersected triangle
						if(this.trianglesSharedEdge(vertexIndices[j], vertexIndices[j + 1], vertexIndices[j + 2],
								intersectFace.vertices[k], intersectFace.vertices[k + 1], intersectFace.vertices[k + 2])) {

							var vIndex = intersectFace.vertices.length;
							intersectFace.vertices.push(vertexIndices[j].clone());
							intersectFace.vertices.push(vertexIndices[j + 1].clone());
							intersectFace.vertices.push(vertexIndices[j + 2].clone());
							intersectFace.faces.push(new THREE.Face3(vIndex, vIndex + 1, vIndex + 2));

							vCount.push(j);
							break;
						}
					}
				}

				for(var ci = vCount.length - 1; ci >= 0; --ci) {

					vertexIndices.splice(vCount[ci], 3);

				}

			} while (vCount.length > 0);

			if(isIncludeFace) {
				return intersectFace;
			} else {
				return null;
			}

		};

		/**
		 * Check if the two triangle share edge, the inputs are their vertices
		 */
		this.trianglesSharedEdge = function(a1, a2, a3, b1, b2, b3) {

			var c1 = false;
			var c2 = false;
			var c3 = false;

			if(a1.equals(b1) || a1.equals(b2) || a1.equals(b3)) {
				c1 = true;
			}
			if(a2.equals(b1) || a2.equals(b2) || a2.equals(b3)) {
				c2 = true;
			}
			if(a3.equals(b1) || a3.equals(b2) || a3.equals(b3)) {
				c3 = true;
			}

			if(c1 & c2 || c1 & c3 || c2 & c3) {
				return true;
			}

			return false;
		};

		this.edgeSnappingWithTopology = function(intersectPoint, geometry, edgesTopology, mesh) {

			var edgeGeom = new THREE.Geometry();
			var minDistTopoIndex;
			var minDist = Number.MAX_VALUE;

			var vA = new THREE.Vector3();
			var vB = new THREE.Vector3();

			var attributes = geometry.attributes;

			if(attributes.index !== undefined && edgesTopology != undefined) {

				var positions = geometry.vb ? geometry.vb : attributes.position.array;
				var stride = geometry.vb ? geometry.vbstride : 3;

				// Find the index of edge topology list which includes the nearest edge segment to the intersect point
				for(var i = 0; i < edgesTopology.length; i++) {

					var indexList = edgesTopology[i].indexList;
					// In edges topology index list the type is LineStrip
					for(var j = 0; j < indexList.length - 1; j++) {
						vA.set(
							positions[indexList[j] * stride],
							positions[indexList[j] * stride + 1],
							positions[indexList[j] * stride + 2]
						);
						vB.set(
							positions[indexList[j + 1] * stride],
							positions[indexList[j + 1] * stride + 1],
							positions[indexList[j + 1] * stride + 2]
						);

						vA.applyMatrix4(mesh.matrixWorld);
						vB.applyMatrix4(mesh.matrixWorld);

						var dist = MeasureCommon.distancePointToLine(intersectPoint, vA, vB);
						if(dist < minDist) {
							minDist = dist;
							minDistTopoIndex = i;
						}
					}
				}

				if(minDistTopoIndex) {
					indexList = edgesTopology[minDistTopoIndex].indexList;
					for(var k = 0; k < indexList.length - 1; k++) {
						edgeGeom.vertices.push(new THREE.Vector3(positions[indexList[k] * stride], positions[indexList[k] * stride + 1], positions[indexList[k] * stride + 2]));
						// To make the line's type to LinePieces which is used by drawLine function
						edgeGeom.vertices.push(new THREE.Vector3(positions[indexList[k + 1] * stride], positions[indexList[k + 1] * stride + 1], positions[indexList[k + 1] * stride + 2]));
					}
				}
			}

			if(_distanceToEdge >= minDist && edgeGeom.vertices.length > 0) {

				_distanceToEdge = minDist;
				edgeGeom.applyMatrix(mesh.matrixWorld);
				_snapResult.geomEdge = edgeGeom;
			}
		};

		/**
		 * Find the closest edge next to the intersect point
		 * @param face -Face which is found by faceSnapping.
		 * @param intersectPoint -IntersectPoint between cast ray and face.
		 * @param mesh -The whole mesh of one fragment.
		 */
		this.edgeSnapping = function(face, intersectPoint) {

			var lineGeom = new THREE.Geometry();
			var isEdge_12 = true;
			var isEdge_13 = true;
			var isEdge_23 = true;

			for(var i = 0; i < face.vertices.length; i += 3) {

				for(var j = 0; j < face.vertices.length; j += 3) {

					if(i !== j) {
						// Check edge 12
						if((face.vertices[i].equals(face.vertices[j]) || face.vertices[i].equals(face.vertices[j + 1]) ||
								face.vertices[i].equals(face.vertices[j + 2])) &&
							(face.vertices[i + 1].equals(face.vertices[j]) || face.vertices[i + 1].equals(face.vertices[j + 1]) ||
								face.vertices[i + 1].equals(face.vertices[j + 2]))) {

							isEdge_12 = false;

						}
						// Check edge 13
						if((face.vertices[i].equals(face.vertices[j]) || face.vertices[i].equals(face.vertices[j + 1]) ||
								face.vertices[i].equals(face.vertices[j + 2])) &&
							(face.vertices[i + 2].equals(face.vertices[j]) || face.vertices[i + 2].equals(face.vertices[j + 1]) ||
								face.vertices[i + 2].equals(face.vertices[j + 2]))) {

							isEdge_13 = false;

						}
						// Check edge 23
						if((face.vertices[i + 1].equals(face.vertices[j]) || face.vertices[i + 1].equals(face.vertices[j + 1]) ||
								face.vertices[i + 1].equals(face.vertices[j + 2])) &&
							(face.vertices[i + 2].equals(face.vertices[j]) || face.vertices[i + 2].equals(face.vertices[j + 1]) ||
								face.vertices[i + 2].equals(face.vertices[j + 2]))) {

							isEdge_23 = false;

						}
					}
				}

				if(isEdge_12) {

					lineGeom.vertices.push(face.vertices[i].clone());
					lineGeom.vertices.push(face.vertices[i + 1].clone());

				}
				if(isEdge_13) {

					lineGeom.vertices.push(face.vertices[i].clone());
					lineGeom.vertices.push(face.vertices[i + 2].clone());

				}
				if(isEdge_23) {

					lineGeom.vertices.push(face.vertices[i + 1].clone());
					lineGeom.vertices.push(face.vertices[i + 2].clone());

				}

				isEdge_12 = true;
				isEdge_13 = true;
				isEdge_23 = true;

			}

			//return lineGeom;

			var edgeGeom = new THREE.Geometry();
			var minDistIndex;
			var minDist = Number.MAX_VALUE;

			for(var k = 0; k < lineGeom.vertices.length; k += 2) {

				var dist = MeasureCommon.distancePointToLine(intersectPoint, lineGeom.vertices[k], lineGeom.vertices[k + 1]);

				if(dist < minDist) {
					minDist = dist;
					minDistIndex = k;
				}

			}

			edgeGeom.vertices.push(lineGeom.vertices[minDistIndex].clone());
			edgeGeom.vertices.push(lineGeom.vertices[minDistIndex + 1].clone());

			edgeGeom.vertices = this.getConnectedLineSegmentsOnSameLine(lineGeom, edgeGeom.vertices);

			_distanceToEdge = minDist;

			return edgeGeom;

		};

		this.getConnectedLineSegmentsOnSameLine = function(lineGeom, edgeVertices) {

			var vertices = lineGeom.vertices.slice();
			var va = edgeVertices[0];
			var vb = edgeVertices[1];

			var vCount = [];

			do {

				vCount = [];

				for(var j = 0; j < vertices.length; j += 2) {

					// The line which has min distance to intersection point
					if(vertices[j].equals(va) && vertices[j + 1].equals(vb)) {

						continue;
					}

					for(var k = 0; k < edgeVertices.length; k += 2) {

						// The line segments which are connected on the same line
						if(vertices[j].equals(edgeVertices[k]) || vertices[j + 1].equals(edgeVertices[k]) ||
							vertices[j].equals(edgeVertices[k + 1]) || vertices[j + 1].equals(edgeVertices[k + 1])) {

							var V0 = new THREE.Vector3();
							var V1 = new THREE.Vector3();

							V0.subVectors(edgeVertices[k], edgeVertices[k + 1]);
							V0.normalize();
							V1.subVectors(vertices[j], vertices[j + 1]);
							V1.normalize();

							//if (V0.equals(V1) || V0.equals(V1.negate())) {
							if(isEqualVectorsWithPrecision(V0, V1) || isInverseVectorsWithPrecision(V0, V1)) {

								vCount.push(j);
								break;

							}
						}
					}
				}

				for(var ci = vCount.length - 1; ci >= 0; --ci) {

					edgeVertices.push(vertices[vCount[ci]]);
					edgeVertices.push(vertices[vCount[ci] + 1]);
					vertices.splice(vCount[ci], 2);

				}

			} while (vCount.length > 0);

			return edgeVertices;

		};

		this.vertexSnappingWithTopology = function(edge, intersectPoint) {

			var minDist = Number.MAX_VALUE;
			var point = new THREE.Vector3();

			if(edge && edge.vertices.length > 1) {
				var dist1 = intersectPoint.distanceTo(edge.vertices[0]);
				var dist2 = intersectPoint.distanceTo(edge.vertices[edge.vertices.length - 1]);

				if(dist1 <= dist2) {
					minDist = dist1;
					point = edge.vertices[0].clone();
				} else {
					minDist = dist2;
					point = edge.vertices[edge.vertices.length - 1].clone();
				}
			}

			_distanceToVertex = minDist;

			return point;
		};

		/**
		 * Find the closest vertex next to the intersect point
		 * @param edge -Edge which is found by edgeSnapping.
		 * @param intersectPoint -IntersectPoint between cast ray and face.
		 */
		this.vertexSnapping = function(edge, intersectPoint) {

			var minDist = Number.MAX_VALUE;
			var point = new THREE.Vector3();

			for(var i = 0; i < edge.vertices.length; ++i) {

				var dist = intersectPoint.distanceTo(edge.vertices[i]);

				if(dist < minDist - SNAP_PRECISION) {

					minDist = dist;
					point = edge.vertices[i].clone();

				}
			}

			_distanceToVertex = minDist;

			return point;
		};

		// This is only a workaround to detect if an edge is circle
		this.edgeIsCircle = function(edge) {

			var vertices = edge.vertices;

			// Exclude squares and regular polygons
			if(vertices.length < 8) {
				return false;
			}

			if(vertices[0].equals(vertices[vertices.length - 1])) {

				var center = new THREE.Vector3(0, 0, 0);
				for(var i = 0; i < vertices.length; i += 2) {
					center.add(vertices[i]);
				}
				center.divideScalar(vertices.length / 2.0);

				var radius = center.distanceTo(vertices[0]);
				for(var i = 0; i < vertices.length; i += 2) {
					if(Math.abs(center.distanceTo(vertices[i]) - radius) <= SNAP_PRECISION) {
						continue;
					} else {
						return false;
					}
				}
				return center;
			} else {
				return false;
			}
		};

		this.edgeIsCurved = function(edge) {

			var vertices = edge.vertices;

			if(vertices.length <= 2) {
				return false;
			} else if(vertices[0].equals(vertices[vertices.length - 1])) {
				return true;
			} else {
				var V1 = new THREE.Vector3();
				V1.subVectors(vertices[0], vertices[1]);

				var V2 = new THREE.Vector3();
				for(var i = 2; i < vertices.length; i += 2) {
					V2.subVectors(vertices[i], vertices[i + 1]);
					if(!isEqualVectorsWithPrecision(V1, V2)) {
						return true;
					}
				}

				return false;
			}
		};

		this.faceIsCurved = function(face) {

			var vertices = face.vertices;
			var faces = face.faces;

			if(faces.length <= 1) {
				return false;
			} else {
				var fN1 = THREE.Triangle.normal(vertices[faces[0].a], vertices[faces[0].b], vertices[faces[0].c]);
				var vA1 = vertices[faces[0].a];

				for(var i = 1; i < faces.length; i++) {
					var fN2 = THREE.Triangle.normal(vertices[faces[i].a], vertices[faces[i].b], vertices[faces[i].c]);
					var vA2 = vertices[faces[i].a];

					if(!isEqualVectorsWithPrecision(fN1, fN2) || !isEqualWithPrecision(fN1.dot(vA1), fN2.dot(vA2))) {
						return true;
					}
				}

				return false;
			}
		};

		this.angleVector2 = function(vector) {

			if(vector.x > 0 && vector.y >= 0) {
				return Math.atan(vector.y / vector.x);
			} else if(vector.x >= 0 && vector.y < 0) {
				return Math.atan(vector.y / vector.x) + Math.PI * 2;
			} else if(vector.x < 0 && vector.y <= 0) {
				return Math.atan(vector.y / vector.x) + Math.PI;
			} else if(vector.x <= 0 && vector.y > 0) {
				return Math.atan(vector.y / vector.x) + Math.PI;
			} else { // x = 0, y = 0
				return null;
			}
		};

		function GeometryCallback(viewer, snapper, aDetectRadius) {
			this.viewer = viewer;
			this.snapper = snapper;

			this.lineGeom = new THREE.Geometry();
			this.circularArc = null;
			this.circularArcCenter;
			this.circularArcRadius;
			this.ellipticalArc = null;
			this.ellipticalArcCenter;

			this.minDist = Number.MAX_VALUE;

			this.vpIdLine = null;
			this.vpIdCircular = null;
			this.vpIdElliptical = null;

			this.detectRadius = aDetectRadius;
		}

		GeometryCallback.prototype.onLineSegment = function(x1, y1, x2, y2, vpId) {
			var intersectPoint = this.snapper.getIntersectPoint();
			var vertices = this.lineGeom.vertices;
			var v1 = new THREE.Vector3(x1, y1, intersectPoint.z);
			var v2 = new THREE.Vector3(x2, y2, intersectPoint.z);

			var dist = MeasureCommon.distancePointToLine(intersectPoint, v1, v2);
			if(dist <= this.detectRadius && dist < this.minDist) {

				vertices.splice(0, 2, v1, v2);
				this.minDist = dist;

				this.vpIdLine = vpId;
			}
		};

		GeometryCallback.prototype.onCircularArc = function(cx, cy, start, end, radius, vpId) {
			var intersectPoint = this.snapper.getIntersectPoint();
			var point = new THREE.Vector2(intersectPoint.x, intersectPoint.y);

			var center = new THREE.Vector2(cx, cy);
			var dist = point.distanceTo(center);
			point.sub(center);

			var angle = this.snapper.angleVector2(point);

			if(Math.abs(dist - radius) <= this.detectRadius) {

				if(end > start && angle >= start && angle <= end) {
					var arc = new THREE.CircleGeometry(radius, 100, start, end - start);
				} else if(end < start && (angle >= start || angle <= end)) {
					var arc = new THREE.CircleGeometry(radius, 100, start, Math.PI * 2 - start + end);
				} else {
					return;
				}
				arc.vertices.splice(0, 1);
				arc.applyMatrix(new THREE.Matrix4().makeTranslation(cx, cy, intersectPoint.z));
				this.circularArc = arc;
				this.circularArcCenter = new THREE.Vector3(cx, cy, intersectPoint.z);
				this.circularArcRadius = radius;

				this.vpIdCircular = vpId;
			}
		};

		GeometryCallback.prototype.onEllipticalArc = function(cx, cy, start, end, major, minor, tilt, vpId) {
			var intersectPoint = this.snapper.getIntersectPoint();
			var point = new THREE.Vector2(intersectPoint.x, intersectPoint.y);

			var major1 = major - this.detectRadius;
			var minor1 = minor - this.detectRadius;
			var major2 = major + this.detectRadius;
			var minor2 = minor + this.detectRadius;

			var equation1 = (point.x - cx) * (point.x - cx) / (major1 * major1) + (point.y - cy) * (point.y - cy) / (minor1 * minor1);
			var equation2 = (point.x - cx) * (point.x - cx) / (major2 * major2) + (point.y - cy) * (point.y - cy) / (minor2 * minor2);

			var center = new THREE.Vector2(cx, cy);
			point.sub(center);
			point.x *= minor;
			point.y *= major;
			var angle = this.snapper.angleVector2(point);

			if(end > Math.PI * 2) {
				end = Math.PI * 2;
			}

			if(equation1 >= 1 && equation2 <= 1) {

				if((end > start && angle >= start && angle <= end) || (end < start && (angle >= start || angle <= end))) {
					var curve = new THREE.EllipseCurve(cx, cy, major, minor, start, end, false);
					var path = new THREE.Path(curve.getPoints(50));
					var arc = path.createPointsGeometry(50);

					if(!isEqualWithPrecision(end - start, Math.PI * 2)) {
						arc.vertices.pop();
					}
					arc.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, intersectPoint.z));
					this.ellipticalArc = arc;
					this.ellipticalArcCenter = new THREE.Vector3(cx, cy, intersectPoint.z);

					this.vpIdElliptical = vpId;
				}
			}
		};

		this.snapping2D = function(result) {

			if(!result) {
				return;
			}

			var intersectPoint = result.intersectPoint;
			var fragIds = result.fragId;

			if(typeof fragIds === "undefined") {
				return;
			} else if(!Array.isArray(fragIds)) {
				fragIds = [fragIds];
			}

			_snapResult.hasTopology = false;
			_snapResult.intersectPoint = intersectPoint;

			// Determine which one should be drawn: line, circular arc or elliptical arc
			_snapResult.radius = this.setDetectRadius(intersectPoint);

			// Geometry snapping is only possible if a fragment list is available to obtain geometry per fragment.
			var supportsGeomSnapping = (_viewer.model.getFragmentList() != null);
			if(!supportsGeomSnapping) {

				// If no snapping is available, just accept the hitpoint as a vertex hit. This allows to measure
				// distances between arbitrary points in rasters.
				_isSnapped = true;
				_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
				_snapResult.geomVertex = intersectPoint;

				return;
			}

			var gc = new GeometryCallback(_viewer, this, _snapResult.radius);

			for(var fi = 0; fi < fragIds.length; ++fi) {

				var mesh = _viewer.impl.getRenderProxy(_viewer.model, fragIds[fi]);

				if(mesh && mesh.geometry) {
					var vbr = new zvp.VertexBufferReader(mesh.geometry, _viewer.impl.use2dInstancing);
					vbr.enumGeomsForObject(result.dbId, gc);
				}

			}

			if(gc.circularArc) {

				_snapResult.viewportIndex2d = gc.vpIdCircular;

				// Only snap the geometries which belong to the same viewport as the first selection
				if(_forcedVpId !== null && _forcedVpId !== _snapResult.viewportIndex2d)
					return;

				if(intersectPoint.distanceTo(gc.circularArc.vertices[0]) < _snapResult.radius) {

					_snapResult.geomVertex = gc.circularArc.vertices[0];
					_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
				} else if(intersectPoint.distanceTo(gc.circularArc.vertices[gc.circularArc.vertices.length - 1]) < _snapResult.radius) {

					_snapResult.geomVertex = gc.circularArc.vertices[gc.circularArc.vertices.length - 1];
					_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
				} else {

					this.lineStripToPieces(gc.circularArc);
					_snapResult.geomEdge = gc.circularArc;
					_snapResult.circularArcCenter = gc.circularArcCenter;
					_snapResult.circularArcRadius = gc.circularArcRadius;
					_snapResult.geomType = MeasureCommon.SnapType.SNAP_CIRCULARARC;
				}

				_isSnapped = true;

			} else if(gc.ellipticalArc) {

				_snapResult.viewportIndex2d = gc.vpIdElliptical;

				// Only snap the geometries which belong to the same viewport as the first selection
				if(_forcedVpId !== null && _forcedVpId !== _snapResult.viewportIndex2d)
					return;

				if(intersectPoint.distanceTo(gc.ellipticalArc.vertices[0]) < _snapResult.radius) {

					_snapResult.geomVertex = gc.ellipticalArc.vertices[0];
					_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
				} else if(intersectPoint.distanceTo(gc.ellipticalArc.vertices[gc.ellipticalArc.vertices.length - 1]) < _snapResult.radius) {

					_snapResult.geomVertex = gc.ellipticalArc.vertices[gc.ellipticalArc.vertices.length - 1];
					_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
				} else {

					this.lineStripToPieces(gc.ellipticalArc);
					_snapResult.geomEdge = gc.ellipticalArc;
					// Before we have measure design for elliptical arc, measure the center for now
					_snapResult.circularArcCenter = gc.ellipticalArcCenter;
					_snapResult.circularArcRadius = null;
					_snapResult.geomType = MeasureCommon.SnapType.SNAP_CIRCULARARC;
				}

				_isSnapped = true;

			} else if(gc.lineGeom.vertices.length) {

				_snapResult.viewportIndex2d = gc.vpIdLine;

				// Only snap the geometries which belong to the same viewport as the first selection
				if(_forcedVpId !== null && _forcedVpId !== _snapResult.viewportIndex2d)
					return;

				if(this.markupMode) { // Markup mode
					var start = gc.lineGeom.vertices[0];
					var end = gc.lineGeom.vertices[1];
					var mid = new THREE.Vector3();
					mid.addVectors(start, end);
					mid.divideScalar(2);
					var md = intersectPoint.distanceTo(mid);
					var sd = intersectPoint.distanceTo(start);
					var ed = intersectPoint.distanceTo(end);

					// Store it for snapping to parallel/perpendicular of underlying vectors
					_snapResult.geomEdge = gc.lineGeom;

					if(md < _snapResult.radius) {
						_snapResult.geomVertex = mid;
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
					} else if(sd < _snapResult.radius) {
						_snapResult.geomVertex = start;
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
					} else if(ed < _snapResult.radius) {
						_snapResult.geomVertex = end;
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
					} else {
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_EDGE;
					}

					// Circle center
					if(gc.lineGeom.vertices[0].distanceTo(gc.lineGeom.vertices[1]) < MeasureCommon.EPSILON) {
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_CIRCLE_CENTER;
					}
				} else { // Measure mode
					if(intersectPoint.distanceTo(gc.lineGeom.vertices[0]) < _snapResult.radius) {

						if(gc.lineGeom.vertices[0].distanceTo(gc.lineGeom.vertices[1]) < MeasureCommon.EPSILON) {
							_snapResult.geomType = MeasureCommon.SnapType.SNAP_CIRCLE_CENTER;
						} else {
							_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
						}

						_snapResult.geomVertex = gc.lineGeom.vertices[0];
					} else if((_options.forceSnapVertices || (intersectPoint.distanceTo(gc.lineGeom.vertices[1]) < _snapResult.radius))) {

						_snapResult.geomVertex = gc.lineGeom.vertices[1];
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
					} else {

						_snapResult.geomEdge = gc.lineGeom;
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_EDGE;
					}
				}

				_isSnapped = true;
			}
		};

		this.snappingLeaflet = function(result) {
			if(!result) {
				return;
			}

			var intersectPoint = result.intersectPoint;
			_snapResult.intersectPoint = intersectPoint;
			_snapResult.hasTopology = false;

			// Determine which one should be drawn: line, circular arc or elliptical arc
			_snapResult.radius = this.setDetectRadius(intersectPoint);
			_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
			_snapResult.geomVertex = intersectPoint;
			_isSnapped = true;
		};

		this.snapMidpoint = function() {
			_snapResult.isMidpoint = false;

			// Snap midpoint for edge
			if(_isSnapped) {
				if(_snapResult.geomType === MeasureCommon.SnapType.SNAP_EDGE) {
					var edge = _snapResult.geomEdge;
					var p1 = edge.vertices[0];
					var p2 = edge.vertices[1];

					var midpoint = new THREE.Vector3((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, (p1.z + p2.z) / 2);

					if(_snapResult.intersectPoint.distanceTo(midpoint) < 2 * _snapResult.radius) {
						_snapResult.geomVertex = midpoint;
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_MIDPOINT;
					}
				}
			}
		};

		this.setPerpendicular = function(isPerpendicular) {
			_snapResult.isPerpendicular = isPerpendicular;
		};

		this.lineStripToPieces = function(geom) {

			var vertices = geom.vertices;
			for(var i = vertices.length - 2; i > 0; i--) {
				vertices.splice(i, 0, vertices[i]);
			}
		};

		this.setDetectRadius = function(point) {

			//Notice: The pixelSize should correspond to the amount of pixels per line in idAtPixels, the shape of
			//detection area is square in idAtPixels, but circle in snapper, should make their areas match roughly.
			var pixelSize = zv.isMobileDevice() ? 50 : 10;

			var navapi = _viewer.navigation;
			var camera = navapi.getCamera();
			var position = navapi.getPosition();

			var p = point.clone();

			var distance = camera.isPerspective ? p.sub(position).length() :
				navapi.getEyeVector().length();

			var fov = navapi.getVerticalFov();
			var worldHeight = 2.0 * distance * Math.tan(THREE.Math.degToRad(fov * 0.5));

			var viewport = navapi.getScreenViewport();
			var devicePixelRatio = window.devicePixelRatio || 1;
			var radius = pixelSize * worldHeight / (viewport.height * devicePixelRatio);

			return radius;
		};

		this.handleButtonDown = function(event, button) {
			_isDragging = true;
			return false;
		};

		this.handleButtonUp = function(event, button) {
			_isDragging = false;
			return false;
		};

		this.handleMouseMove = function(event) {

			if(_isDragging)
				return false;

			this.onMouseMove({
				x: event.canvasX,
				y: event.canvasY
			});

			return false;
		};

		this.handleSingleTap = function(event) {

			return this.handleMouseMove(event);
		};

		this.handlePressHold = function(event) {

			if(zv.isMobileDevice()) {
				switch(event.type) {
					case "press":
						_isPressing = true;
						this.onMouseMove({
							x: event.canvasX,
							y: event.canvasY
						});
						break;

					case "pressup":
						this.onMouseMove({
							x: event.canvasX,
							y: event.canvasY
						});
						_isPressing = false;
						break;
				}
			}
			return false;

		};

		this.handleGesture = function(event) {
			if(zv.isMobileDevice()) {
				if(_isPressing) {
					switch(event.type) {
						case "dragstart":
							this.onMouseMove({
								x: event.canvasX,
								y: event.canvasY
							});
							break;

						case "dragmove":
							this.onMouseMove({
								x: event.canvasX,
								y: event.canvasY
							});
							break;

						case "dragend":
							this.onMouseMove({
								x: event.canvasX,
								y: event.canvasY
							});
							_isPressing = false;
							break;

						case "pinchstart":

							break;

						case "pinchmove":
							break;

						case "pinchend":
							break;
					}
				}
			}

			return false;
		};

		/**
		 * Handler to mouse move events, used to snap in markup edit mode.
		 * @private
		 */
		this.onMouseDown = function(mousePosition) {
			return this.onMouseMove(mousePosition);
		};

		/**
		 * Handler to mouse move events, used to snap in markup edit mode.
		 * @private
		 */
		this.onMouseMove = function(mousePosition) {

			this.clearSnapped();

			var result = _viewer.impl.snappingHitTest(mousePosition.x, mousePosition.y, false);
			if(!result || !result.intersectPoint)
				return false;

			// 3D Snapping
			if(result.face) {
				this.snapping3D(result);
			}
			// 2D Snapping
			else if(result.dbId || result.dbId === 0) {
				this.snapping2D(result);
			}
			// PDF - Leaflet Snapping
			else {
				this.snappingLeaflet(result);
			}

			this.snapMidpoint();

			return true;
		};
	};

	// export
	MeasureCommon.Snapper = Snapper;

})();;
(function() {
	'use strict';

	var MeasureCommon = ZhiUTech.Viewing.MeasureCommon;

	var NO_OVERLAY = 0;
	var FACE_OVERLAY = 1;
	var EDGE_OVERLAY = 2;
	var POINT_OVERLAY = 3;

	var GEOMETRIES_OVERLAY = 'MeasureTool-snapper-geometries';
	var INDICATOR_OVERLAY = 'MeasureTool-snapper-indicator';

	var _geometryLineWidth = 0.3;
	var _indicatorLineWidth = 0.2;
	var _indicatorSize = 1.2;
	var _point = null;

	var _indicatorColor = 0xff7700;
	var _geometryColor = 0x00CC00;

	// /** @constructor */
	function SnapperIndicator(viewer, snapper) {
		this.viewer = viewer;
		this.snapper = snapper;
		this.overlayType = NO_OVERLAY;
		this.previewsIntersectPoint = null;

		this.viewer.impl.createOverlayScene(GEOMETRIES_OVERLAY);
		this.viewer.impl.createOverlayScene(INDICATOR_OVERLAY);

		this.geometryMaterial = new THREE.MeshPhongMaterial({
			color: _geometryColor,
			ambient: _geometryColor,
			opacity: 0.5,
			transparent: true,
			depthTest: false,
			depthWrite: false,
			side: THREE.DoubleSide
		});

		this.indicatorMaterial = new THREE.MeshBasicMaterial({
			color: _indicatorColor,
			ambient: _indicatorColor,
			opacity: 1,
			transparent: false,
			depthTest: false,
			depthWrite: false,
			side: THREE.DoubleSide
		});
	}

	SnapperIndicator.prototype.constructor = SnapperIndicator;
	var proto = SnapperIndicator.prototype;

	proto.render = function() {

		var snapResult = this.snapper.getSnapResult();

		if(!MeasureCommon.isEqualVectors(this.previewsIntersectPoint, snapResult.intersectPoint, MeasureCommon.EPSILON)) {
			this.clearOverlay(GEOMETRIES_OVERLAY);
		}

		this.clearOverlay(INDICATOR_OVERLAY);

		if(snapResult.isEmpty())
			return;

		// if (!this.snapper.markupMode) {
		this.renderIndicator(snapResult);
		// }
		// else {
		//     this.renderGeometry(snapResult);
		// }

		this.previewsIntersectPoint = snapResult.intersectPoint.clone();
	};

	proto.removeOverlay = function(overlayName) {

		this.viewer.impl.clearOverlay(overlayName);
		this.viewer.impl.removeOverlayScene(overlayName);

	};

	proto.clearOverlay = function(overlayName) {

		this.removeOverlay(overlayName);
		this.viewer.impl.createOverlayScene(overlayName);

	};

	proto.clearOverlays = function() {

		this.removeOverlay(GEOMETRIES_OVERLAY);
		this.viewer.impl.createOverlayScene(GEOMETRIES_OVERLAY);

		this.removeOverlay(INDICATOR_OVERLAY);
		this.viewer.impl.createOverlayScene(INDICATOR_OVERLAY);

		this.previewsIntersectPoint = null;

	};

	proto.addOverlay = function(overlayName, mesh) {

		this.viewer.impl.addOverlay(overlayName, mesh);

	};

	/**
	 * Draw the planar face
	 * @param geom -Geometry which needs to be draw.
	 * @param mesh -Mesh which is loaded.
	 */
	proto.drawFace = function(geom, material, overlayName) {

		var snapperPlane = new THREE.Mesh(geom, material, true);

		if(overlayName === GEOMETRIES_OVERLAY) {
			this.overlayType = FACE_OVERLAY;
		}

		this.addOverlay(overlayName, snapperPlane);

	};

	proto.cylinderMesh = function(pointX, pointY, material, width) {

		var direction = new THREE.Vector3().subVectors(pointY, pointX);
		var orientation = new THREE.Matrix4();
		orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
		orientation.multiply(new THREE.Matrix4().set(1, 0, 0, 0,
			0, 0, 1, 0,
			0, -direction.length(), 0, 0,
			0, 0, 0, 1));

		width = width || 0.5;
		var cylinder = new THREE.CylinderGeometry(width, width, 1.0, 8, 1, true);
		var edge = new THREE.Mesh(cylinder, material);
		cylinder = null;

		edge.applyMatrix(orientation);
		edge.position.x = (pointY.x + pointX.x) / 2;
		edge.position.y = (pointY.y + pointX.y) / 2;
		edge.position.z = (pointY.z + pointX.z) / 2;
		return edge;

	};

	proto.renderGeometry = function(snapResult) {

		if(MeasureCommon.isEqualVectors(this.previewsIntersectPoint, snapResult.intersectPoint, MeasureCommon.EPSILON)) {
			return;
		}

		switch(snapResult.geomType) {
			case MeasureCommon.SnapType.SNAP_VERTEX:
				this.drawPoint(snapResult.geomVertex, this.geometryMaterial, GEOMETRIES_OVERLAY);
				break;

			case MeasureCommon.SnapType.SNAP_EDGE:
			case MeasureCommon.SnapType.SNAP_CURVEDEDGE:
			case MeasureCommon.SnapType.SNAP_CIRCULARARC:
			case MeasureCommon.SnapType.SNAP_MIDPOINT:
				this.drawLine(snapResult.geomEdge, this.geometryMaterial, _geometryLineWidth, GEOMETRIES_OVERLAY);
				break;

			case MeasureCommon.SnapType.SNAP_FACE:
			case MeasureCommon.SnapType.SNAP_CURVEDFACE:
				this.drawFace(snapResult.geomFace, this.geometryMaterial, GEOMETRIES_OVERLAY);
				break;
		}
	};

	proto.renderVertexIndicator = function(snapResult) {

		var pos = MeasureCommon.getSnapResultPosition(snapResult, this.viewer);
		var scale = this.setScale(pos);
		var length = _indicatorSize * scale;

		var rightVec = this.viewer.navigation.getCameraRightVector().multiplyScalar(length);
		var upVec = this.viewer.navigation.getCameraUpVector().multiplyScalar(length);

		var geom = new THREE.Geometry();
		var p = new THREE.Vector3();

		// Upper line
		p.addVectors(pos, rightVec);
		p.addVectors(p, upVec);
		geom.vertices[0] = p.clone();
		p.subVectors(pos, rightVec);
		p.addVectors(p, upVec);
		geom.vertices[1] = p.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

		// Bottom line
		p.addVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[0] = p.clone();
		p.subVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[1] = p.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

		// Left line
		p.subVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[0] = p.clone();
		p.subVectors(pos, rightVec);
		p.addVectors(p, upVec);
		geom.vertices[1] = p.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

		// Right line
		p.addVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[0] = p.clone();
		p.addVectors(pos, rightVec);
		p.addVectors(p, upVec);
		geom.vertices[1] = p.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

	};

	proto.renderMidpointIndicator = function(snapResult) {

		var pos = snapResult.geomVertex;
		var scale = this.setScale(pos);
		var length = _indicatorSize * scale;

		var rightVec = this.viewer.navigation.getCameraRightVector().multiplyScalar(length);
		var upVec = this.viewer.navigation.getCameraUpVector().multiplyScalar(length);

		var geom = new THREE.Geometry();
		var p = new THREE.Vector3();

		// Bottom line
		p.addVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[0] = p.clone();
		p.subVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[1] = p.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

		// Left line
		p.subVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[0] = p.clone();
		p.addVectors(pos, upVec);
		geom.vertices[1] = p.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

		// Right line
		p.addVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[0] = p.clone();
		p.addVectors(pos, upVec);
		geom.vertices[1] = p.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

	};

	proto.renderEdgeIndicator = function(snapResult) {

		var pos = MeasureCommon.getSnapResultPosition(snapResult, this.viewer);
		var scale = this.setScale(pos);
		var length = _indicatorSize * scale;

		var rightVec = this.viewer.navigation.getCameraRightVector().multiplyScalar(length);
		var upVec = this.viewer.navigation.getCameraUpVector().multiplyScalar(length);

		var geom = new THREE.Geometry();
		var p = new THREE.Vector3();

		// Bottom line
		p.addVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[0] = p.clone();
		geom.vertices[1] = pos.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

		// Left line
		p.subVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[0] = p.clone();
		geom.vertices[1] = pos.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

		// Right line
		p.addVectors(pos, upVec);
		geom.vertices[0] = p.clone();
		geom.vertices[1] = pos.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

	};

	proto.renderCircleIndicator = function(snapResult) {

		var pos = MeasureCommon.getSnapResultPosition(snapResult, this.viewer);
		this.drawCircle(pos, this.indicatorMaterial, INDICATOR_OVERLAY);

	};

	proto.renderPerpendicular = function(snapResult) {

		var pos = MeasureCommon.getSnapResultPosition(snapResult, this.viewer);
		var scale = this.setScale(pos);
		var length = _indicatorSize * scale;

		var rightVec = this.viewer.navigation.getCameraRightVector().multiplyScalar(length);
		var upVec = this.viewer.navigation.getCameraUpVector().multiplyScalar(length);

		var geom = new THREE.Geometry();
		var p = new THREE.Vector3();

		// Upper line
		geom.vertices[0] = pos.clone();
		p.subVectors(pos, rightVec);
		geom.vertices[1] = p.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

		// Bottom line
		p.addVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[0] = p.clone();
		p.subVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[1] = p.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

		// Left line
		p.subVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[0] = p.clone();
		p.subVectors(pos, rightVec);
		p.addVectors(p, upVec);
		geom.vertices[1] = p.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

		// Right line
		geom.vertices[0] = pos.clone();
		p.subVectors(pos, upVec);
		geom.vertices[1] = p.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

	};

	proto.renderIndicator = function(snapResult) {

		if(snapResult.isPerpendicular) {
			this.renderPerpendicular(snapResult);
			return;
		}

		switch(snapResult.geomType) {
			case MeasureCommon.SnapType.SNAP_VERTEX:
				this.renderVertexIndicator(snapResult);
				break;

			case MeasureCommon.SnapType.SNAP_MIDPOINT:
				this.renderMidpointIndicator(snapResult);
				break;

			case MeasureCommon.SnapType.SNAP_CIRCLE_CENTER:
				this.renderCircleIndicator(snapResult);
				break;

			case MeasureCommon.SnapType.SNAP_EDGE:
			case MeasureCommon.SnapType.SNAP_CURVEDEDGE:
				this.renderEdgeIndicator(snapResult);
				break;

			case MeasureCommon.SnapType.SNAP_CIRCULARARC:
				if(this.viewer.model.is2d()) {
					this.renderVertexIndicator(snapResult);
				} else {
					this.renderCircleIndicator(snapResult);
				}
				break;

			case MeasureCommon.SnapType.SNAP_FACE:
			case MeasureCommon.SnapType.SNAP_CURVEDFACE:
				this.renderVertexIndicator(snapResult);
				break;
		}
	};

	proto.drawLine = function(geom, material, width, overlayName) {

		// Line Pieces
		if(overlayName === GEOMETRIES_OVERLAY) {
			this.overlayType = EDGE_OVERLAY;
		}

		for(var i = 0; i < geom.vertices.length; i += 2) {
			var cylinder = this.cylinderMesh(geom.vertices[i], geom.vertices[i + 1], material, width);
			this.setEdgeScale(cylinder);
			this.addOverlay(overlayName, cylinder);
		}
	};

	proto.drawPoint = function(point, material, overlayName) {

		// Because every point is snappable in PDFs, don't display the green dot for PDFs.
		if(this.viewer.model.getData().isLeaflet) {
			return;
		}

		if(!_point)
			_point = new THREE.SphereGeometry(1.0);

		var pointMesh = new THREE.Mesh(_point, material);
		pointMesh.position.set(point.x, point.y, point.z);

		this.setPointScale(pointMesh);

		if(overlayName === GEOMETRIES_OVERLAY) {
			this.overlayType = POINT_OVERLAY;
		}

		this.addOverlay(overlayName, pointMesh);

	};

	proto.drawCircle = function(point, material, overlayName) {

		var torus = new THREE.TorusGeometry(_indicatorSize, _indicatorLineWidth, 2, 20);
		var torusMesh = new THREE.Mesh(torus, material);
		torusMesh.lookAt(this.viewer.navigation.getEyeVector().normalize());
		torus = null;

		torusMesh.position.set(point.x, point.y, point.z);

		this.setCircleScale(torusMesh);

		this.addOverlay(overlayName, torusMesh);

	};

	proto.setScale = function(point) {

		var pixelSize = 5;

		var navapi = this.viewer.navigation;
		var camera = navapi.getCamera();
		var position = navapi.getPosition();

		var p = point.clone();

		var distance = camera.isPerspective ? p.sub(position).length() :
			navapi.getEyeVector().length();

		var fov = navapi.getVerticalFov();
		var worldHeight = 2.0 * distance * Math.tan(THREE.Math.degToRad(fov * 0.5));

		var viewport = navapi.getScreenViewport();
		var scale = pixelSize * worldHeight / viewport.height;

		return scale;

	};

	proto.setPointScale = function(pointMesh) {

		var scale = this.setScale(pointMesh.position);
		pointMesh.scale.x = scale;
		pointMesh.scale.y = scale;
		pointMesh.scale.z = scale;

	};

	proto.setCircleScale = function(torusMesh) {

		var scale = this.setScale(torusMesh.position);
		torusMesh.scale.x = scale;
		torusMesh.scale.y = scale;
	};

	proto.setEdgeScale = function(cylinderMesh) {

		var scale = this.setScale(cylinderMesh.position);
		cylinderMesh.scale.x = scale;
		cylinderMesh.scale.z = scale;
	};

	proto.updatePointScale = function(overlayName) {

		if(this.overlayType != POINT_OVERLAY)
			return;

		var overlay = this.viewer.impl.overlayScenes[overlayName];
		if(overlay) {
			var scene = overlay.scene;

			for(var i = 0; i < scene.children.length; i++) {
				var pointMesh = scene.children[i];
				if(pointMesh) {

					this.setPointScale(pointMesh);
				}
			}
		}
	};

	proto.updateEdgeScale = function(overlayName) {

		if(this.overlayType != EDGE_OVERLAY)
			return;

		var overlay = this.viewer.impl.overlayScenes[overlayName];
		if(overlay) {
			var scene = overlay.scene;

			for(var i = 0; i < scene.children.length; i++) {
				var cylinderMesh = scene.children[i];
				if(cylinderMesh) {

					this.setEdgeScale(cylinderMesh);
				}
			}
		}
	};

	proto.onCameraChange = function() {

		this.updatePointScale(GEOMETRIES_OVERLAY);
		this.updateEdgeScale(GEOMETRIES_OVERLAY);

		// if (!this.snapper.markupMode) {
		this.render();
		// }
	};

	proto.destroy = function() {

		this.removeOverlay(GEOMETRIES_OVERLAY);
		this.removeOverlay(INDICATOR_OVERLAY);

		if(_point) {
			_point.dispose();
			_point = null;
		}
	};

	MeasureCommon.SnapperIndicator = SnapperIndicator;

})();;
(function() {
	'use strict';

	var SnapType = {
		SNAP_VERTEX: 0,
		SNAP_MIDPOINT: 1,
		SNAP_CIRCLE_CENTER: 2,
		SNAP_EDGE: 3,
		SNAP_FACE: 4,
		SNAP_CIRCULARARC: 5,
		SNAP_CURVEDEDGE: 6,
		SNAP_CURVEDFACE: 7
	};

	// exports
	ZhiUTechNamespace("ZhiUTech.Viewing.MeasureCommon");
	ZhiUTech.Viewing.MeasureCommon.SnapType = SnapType;

})();;
(function() {
	'use strict';

	var MeasurementTypes = {
		MEASUREMENT_DISTANCE: 1, // Measurement from point to point, not matter what geometry it is.
		MEASUREMENT_ANGLE: 2,
		MEASUREMENT_AREA: 3,
		CALIBRATION: 4
	};

	// export
	ZhiUTech.Viewing.MeasureCommon.MeasurementTypes = MeasurementTypes;

})();;
(function() {
	'use strict';

	var Events = {

		MEASUREMENT_CHANGED_EVENT: 'measurement-changed',
		UNITS_CALIBRATION_STARTS_EVENT: 'units_calibration_starts_event'
	};

	// exports
	ZhiUTech.Viewing.MeasureCommon.Events = Events;

})();;
ZhiUTechNamespace('ZhiUTech.Viewing.Private');

/**
   * Formats a value with units
   * @param {number} value
   * @param {string} units - GNU units format
   * @param {number} type - For example: 1=boolean, 2=integer, 3=double, 20=string, 24=Position
   * @param {number} precision - required precision.
   * see https://git.zhiutech.com/A360/platform-translation-propertydb/blob/master/propertydb/PropertyDatabase.h
   * @returns {string} formatted value
   */
ZhiUTech.Viewing.Private.formatValueWithUnits = function(value, units, type, precision) {

	function modf(x) {
		var intPart = (0 <= x) ? Math.floor(x) : Math.ceil(x),
			fracPart = x - intPart;
		return {
			intPart: intPart,
			fracPart: fracPart
		};
	}

	function formatNumber(x, precision, needMinusSign) {
		var result = '';

		if(needMinusSign && x === 0) {
			result += '-';
		}

		//According to Shawn's request, do not truncate trailing .0's
		//if (modf(x).fracPart === 0) {
		//
		//    // No fractional part.
		//    //
		//    result += x;
		//
		//} else if (0 < precision) {
		if(0 < precision) {

			// Truncate any trailing .0's.
			//
			//var s = x.toFixed(precision);
			//var re = /^\-?([0-9]+)\.0+$/;
			//var m = re.exec(s);
			//if (m !== null) {
			//    result += m[1];
			//} else {
			//    result += s;
			//}

			result += x.toFixed(precision);

		} else {
			result += x.toFixed(0);
		}

		return result;
	}

	function formatFeet(value, precision, inchesOnly) {

		// Borrowed from AdCoreUnits PrimeDoublePrimeSymbol2::Format

		var result = '',
			radix = 12.0,
			denominator = 1.0,
			isNegative = (value < 0);

		for(var i = 0; i < precision; ++i) {
			denominator *= 2.0;
		}

		// round to the nearest 1/denominator
		if(value > 0) {
			value += 0.5 / denominator;
		} else {
			value -= 0.5 / denominator;
		}

		var primeValue, doublePrimeValue;

		if(!inchesOnly) {
			primeValue = modf(value / radix).intPart;
			result += formatNumber(primeValue, 0, isNegative) + '\' ';
			doublePrimeValue = value - (primeValue * radix);
			if(doublePrimeValue < 0) {
				doublePrimeValue = -doublePrimeValue;
			}

		} else {
			doublePrimeValue = value;
		}

		var intPart = modf(doublePrimeValue).intPart;
		var numerator = modf((doublePrimeValue - intPart) * denominator).intPart;

		if(numerator === 0 || intPart !== 0) {
			result += formatNumber(intPart, 0);
		}

		if(numerator !== 0) {
			if(intPart < 0 && numerator < 0) {
				numerator = -numerator;
			}
			while(numerator % 2 === 0) {
				numerator /= 2;
				denominator /= 2;
			}
			if(intPart !== 0) {
				result += '-';
			}
			result += formatNumber(numerator, 0) + '/' + formatNumber(denominator, 0);
		}

		result += '\"';
		return result;
	}

	function formatMeterAndCentimeter(value, precision) {
		var sign = '';
		if(value < 0) {
			sign = '-';
			value = Math.abs(value);
		}
		var modfValue = modf(value),
			mValue = modfValue.intPart,
			cmValue = modfValue.fracPart * 100.0;

		return sign + formatNumber(mValue, 0) + ' m ' + formatNumber(cmValue, precision) + ' cm';
	}

	function formatFeetAndDecimalInches(value, precision) {
		var sign = '';
		if(value < 0) {
			sign = '-';
			value = Math.abs(value);
		}
		var modfValue = modf(value),
			ftValue = modfValue.intPart,
			inValue = modfValue.fracPart * 12.0;

		return sign + formatNumber(ftValue, 0) + '\' ' + formatNumber(inValue, precision) + '\"';
	}

	var result;

	if(precision === null || precision === undefined) {
		precision = 3;
	}

	// TODO(go) - 20150504: Ideally this would be handled better: according to the git file at the top property types can be 0,1,2,3,10,11,20,21,22,23,24
	// TODO(go) - 20150504: The code below only handle Boolean (1) Integer (2) and double (3). Not sure how well the property types are assigned so using
	// TODO(go) - 20150504: try catch for now.
	try {

		if(type === 1) { // Boolean
			result = ZhiUTech.Viewing.i18n.translate(value ? 'Yes' : 'No');

		} else if(type === 24) { // Position
			var position = value.split(' ');
			result = [];

			for(var i = 0; i < position.length; ++i) {
				result.push(ZhiUTech.Viewing.Private.formatValueWithUnits(parseFloat(position[i]), units, 3, precision));
			}

			result = result.join(', ');

		} else if((type === 2 || type === 3) && isNaN(value)) {
			result = 'NaN';

		} else if(units === 'ft-and-fractional-in') {
			result = formatFeet(value * 12.0, precision);

		} else if(units === 'ft-and-fractional-in^2') {
			result = formatFeet(value * 12.0, precision) + ' ' + String.fromCharCode(0xb2);

		} else if(units === 'ft-and-decimal-in') {
			result = formatFeetAndDecimalInches(value, precision);

		} else if(units === 'ft-and-decimal-in^2') {
			result = formatFeetAndDecimalInches(value, precision) + ' ' + String.fromCharCode(0xb2);

		} else if(units === 'decimal-in' || units === 'in' || units === 'inch') {
			result = formatNumber(value, precision) + '\"';

		} else if(units === 'decimal-in^2' || units === 'in^2' || units === 'inch^2') {
			result = formatNumber(value, precision) + '\"' + ' ' + String.fromCharCode(0xb2);

		} else if(units === 'decimal-ft' || units === 'ft' || units === 'feet' || units === 'foot') {
			result = formatNumber(value, precision) + '\'';

		} else if(units === 'decimal-ft^2' || units === 'ft^2' || units === 'feet^2' || units === 'foot^2') {
			result = formatNumber(value, precision) + '\'' + ' ' + String.fromCharCode(0xb2);

		} else if(units === 'fractional-in') {
			result = formatFeet(value, precision, /*inchesOnly=*/ true);

		} else if(units === 'fractional-in^2') {
			result = formatFeet(value, precision, /*inchesOnly=*/ true) + ' ' + String.fromCharCode(0xb2);

		} else if(units === 'm-and-cm') {
			result = formatMeterAndCentimeter(value, precision);

		} else if(units === 'm-and-cm^2') {
			result = formatMeterAndCentimeter(value, precision) + ' ' + String.fromCharCode(0xb2);

		} else if(type === 3 && units) { // Double, with units
			units = units.replace("^2", String.fromCharCode(0xb2));
			units = units.replace("^3", String.fromCharCode(0xb3));
			result = formatNumber(value, precision) + ' ' + units;

		} else if(units) {
			result = value + ' ' + units;

		} else if(type === 3) { // Double, no units
			result = formatNumber(value, precision);

		} else {
			result = value;
		}

	} catch(e) {

		if(units) {
			result = value + ' ' + units;
		} else {
			result = value;
		}
	}

	return result;
};

/**
   * Convert distance from unit to unit.
   * @param {string} fromUnits - GNU units format - units to convert from
   * @param {string} toUnits - GNU units format - units to convert to
   * @param {number} calibrationFactor - Calibration Factor of the model
   * @param {number} d - distance to convert
   * @param {string} type - default for distance, "square" for area
   * @returns {number} - distance after conversion.
   */
ZhiUTech.Viewing.Private.convertUnits = function(fromUnits, toUnits, calibrationFactor, d, type) {

	calibrationFactor = calibrationFactor ? calibrationFactor : 1;

	if(fromUnits === toUnits && calibrationFactor == 1)
		return d;

	var toFactor = 1;
	switch(toUnits) {
		case "mm":
			toFactor = 1000;
			break;
		case "cm":
			toFactor = 100;
			break;
		case "m":
			toFactor = 1;
			break;
		case "in":
			toFactor = 39.37007874;
			break;
		case "ft":
			toFactor = 3.280839895;
			break;
		case "ft-and-fractional-in":
			toFactor = 3.280839895;
			break;
		case "ft-and-decimal-in":
			toFactor = 3.280839895;
			break;
		case "decimal-in":
			toFactor = 39.37007874;
			break;
		case "decimal-ft":
			toFactor = 3.280839895;
			break;
		case "fractional-in":
			toFactor = 39.37007874;
			break;
		case "m-and-cm":
			toFactor = 1;
			break;
	}

	var fromFactor = 1;
	switch(fromUnits) {
		case "mm":
			fromFactor = 0.001;
			break;
		case "cm":
			fromFactor = 0.01;
			break;
		case "m":
			fromFactor = 1;
			break;
		case "in":
			fromFactor = 0.0254;
			break;
		case "ft":
			fromFactor = 0.3048;
			break;
		case "ft-and-fractional-in":
			fromFactor = 0.3048;
			break;
		case "ft-and-decimal-in":
			fromFactor = 0.3048;
			break;
		case "decimal-in":
			fromFactor = 0.0254;
			break;
		case "decimal-ft":
			fromFactor = 0.3048;
			break;
		case "fractional-in":
			fromFactor = 0.0254;
			break;
		case "m-and-cm":
			fromFactor = 1;
			break;
	}

	if(type === "square") {

		return(d * Math.pow(toFactor * fromFactor * calibrationFactor, 2));
	}
	return(d * toFactor * fromFactor * calibrationFactor);
};

/**
   * Count the number of digits after the floating point of a given number.
   * If the numer is a fraction, count the power of 2 of the denominator.
   * @param {string | number} number.
   * @returns {number} - number of digits after the floating point of the given number.
   */

ZhiUTech.Viewing.Private.calculatePrecision = function(number) {

	if(!number)
		return 0;

	var digits = number.toString().split(".")[1];

	// Try fractional number
	if(!digits) {
		var denominatorStrRaw = number.toString().split("/")[1];
		var denominatorNumberStr = denominatorStrRaw && denominatorStrRaw.match(/\d+/);
		if(denominatorNumberStr) {
			var denominator = parseFloat(denominatorNumberStr);
			if(denominator && !isNaN(denominator)) {
				return Math.floor(Math.log2(denominator));
			}
		}

		return 0;
	}
	digits = digits.match(/\d+/);
	return(digits && digits[0] && digits[0].length) || 0;
};;
(function() {
	var UnitParser = ZhiUTechNamespace('ZhiUTech.Viewing.Private.UnitParser');

	// Based on https://github.com/dobriai/footinch/blob/master/lib/parse.js
	function _parse(strIn, base, bigUnitSigns, smallUnitsSigns) {
		if(!strIn) {
			return NaN;
		}

		strIn = strIn.toString();

		var str = strIn.trim();
		if(str.length == 0) {
			return NaN;
		}

		var lm;
		var bigUnits = bigUnitSigns.join('| *');
		var smallUnits = smallUnitsSigns.join('| *');

		// Try +-: 1/2", 11/16"; trailing space OK, but nothing else
		// Note: Trailing " is mandatory!
		{
			lm = str.match(new RegExp('^([+-]?\\d+)(?: *)\/(?: *)(\\d+)(?: *)(?:' + smallUnits + ') *$'));
			if(lm) {
				return(parseFloat(lm[1]) / parseFloat(lm[2])) / base;
			}
		}

		// Try +-: 1/2', 11/16; trailing space OK, but nothing else
		{
			lm = str.match(new RegExp('^([+-]?\\d+)(?: *)\/(?: *)(\\d+)(?: *)(?:' + bigUnits + ')? *$'));
			if(lm) {
				return(parseFloat(lm[1]) / parseFloat(lm[2]));
			}
		}

		// Try +-: 5, 1.2e7, .1e+2, 3e-1, 3.e1
		var firstFloat = NaN; {
			lm = str.match(/^[+-]? *(?:\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?/i);
			if(!lm) {
				return NaN;
			}
			firstFloat = parseFloat(lm[0].replace(/ */g, '')); // Clear spaces on the way
			str = str.slice(lm[0].length); // Don't trim just yet!
		}

		str = str.replace('-', ' ');

		if(str.length == 0 || isNaN(firstFloat)) {
			return firstFloat;
		}

		var sgn = Math.sign(firstFloat);
		if(sgn === 0) {
			sgn = 1;
		}

		// If inches, then end of story
		if(str.match(new RegExp('^(?: *)(?:' + smallUnits + ') *$', 'i'))) {
			return firstFloat / base;
		}

		{

			lm = str.match(new RegExp('^ +(\\d+)(?: *)\/(?: *)(\\d+)(?: *)(?:' + smallUnits + ') *$', 'i'));
			if(lm) {
				// If original input was: 7 11/16"
				return(firstFloat + sgn * parseFloat(lm[1]) / parseFloat(lm[2])) / base;
			}
		}

		{
			lm = str.match(new RegExp('^(?: *)(?:' + bigUnits + '|-| +-?) *', 'i')); // Order matters here!
			if(!lm) {
				return NaN;
			}
			str = str.slice(lm[0].length).trim();
			if(str.length == 0) {
				if(lm[0].match(/-/)) {
					return NaN; // Trailing dash - e.g. strIn was: 7-
				}
				return firstFloat;
			}
		}

		// Now we can only have left: 2, 2.3, 7/8, 2 7/8, with an optional " at the end
		{
			lm = str.match(new RegExp('^(\\d+(?:\\.\\d*)?)(?: *)(?:' + smallUnits + ')? *$'));
			if(lm) {
				return firstFloat + sgn * parseFloat(lm[1]) / base;
			}

			lm = str.match(new RegExp('^(\\d+)(?: *)\/(?: *)(\\d+)(?: *)(?:' + smallUnits + ')? *$'));
			if(lm) {
				return firstFloat + sgn * (parseFloat(lm[1]) / parseFloat(lm[2])) / base;
			}

			lm = str.match(new RegExp('^(\\d+) +(\\d+)(?: *)\/(?: *)(\\d+)(?: *)(?:' + smallUnits + ')? *$'));
			if(lm) {
				return firstFloat + sgn * (parseFloat(lm[1]) + parseFloat(lm[2]) / parseFloat(lm[3])) / base;
			}
		}

		return NaN;
	}

	/**
	 * Parses a string of fractional feet or decimal feet to a decimal feet number
	 * @param {string} input - input string of the number
	 * @returns {number} parsed value represented as a number
	 */
	UnitParser.parseFeet = function(input) {
		return _parse(input, 12.0, ['ft', 'feet', '\''], ['in', 'inch', '\\"', '\'\'']);
	};

	UnitParser.parseMeter = function(input) {
		return _parse(input, 100.0, ['m', 'meter'], ['cm', 'centimeter']);
	};

	/**
	 * Parses a string of fractional or decimal number into a decimal number.
	 * Valid input examples: 1, 1.2e3, -2, 2cm, 4", 4.1', 1 2/3, 1 2 3/4, 1 2-3/4, 1ft 2-3/4in, 1' 2-3/4"
	 * 
	 * @param {string} input - input string of the number.
	 * @param {string} inputUnits - the type of the units of the number.
	 * @returns {number} parsed value represented as a decimal number.
	 */
	UnitParser.parseNumber = function(input, inputUnits) {
		switch(inputUnits) {
			case 'ft':
			case 'decimal-ft':
			case 'ft-and-fractional-in':
			case 'ft-and-decimal-in':
			case 'decimal-in':
			case 'fractional-in':
				return UnitParser.parseFeet(input);

			case '':
			case 'm':
			case 'cm':
			case 'mm':
			case 'm-and-cm':
			default:
				return UnitParser.parseMeter(input);
		}
	};

	UnitParser.parsePositiveNumber = function(input, inputUnits) {
		var parsedNumber = UnitParser.parseNumber(input, inputUnits);
		return parsedNumber >= 0 ? parsedNumber : NaN;
	};

})();;
(function() {
	'use strict';

	// Measurement helper functions //
	var MeasureCommon = ZhiUTechNamespace("ZhiUTech.Viewing.MeasureCommon");

	MeasureCommon.EPSILON = 0.0001;

	MeasureCommon.getSnapResultPosition = function(pick, viewer) {
		if(!pick) {
			return null;
		}

		if(pick.isPerpendicular) {
			return pick.intersectPoint;
		}

		switch(pick.geomType) {
			case MeasureCommon.SnapType.SNAP_VERTEX:
			case MeasureCommon.SnapType.SNAP_MIDPOINT:
			case MeasureCommon.SnapType.SNAP_CIRCLE_CENTER:
				return pick.getGeometry();

			case MeasureCommon.SnapType.SNAP_EDGE:
				var eps = MeasureCommon.getEndPointsInEdge(pick.getGeometry());
				var p1 = eps[0].clone();
				var p2 = eps[1].clone();
				return MeasureCommon.nearestPointInPointToLine(pick.intersectPoint, p1, p2);

			case MeasureCommon.SnapType.SNAP_FACE:
				return MeasureCommon.nearestPointInPointToPlane(pick.intersectPoint, pick.getGeometry().vertices[0], pick.faceNormal);

			case MeasureCommon.SnapType.SNAP_CIRCULARARC:
				if(viewer && viewer.model && viewer.model.is2d()) {
					var point = MeasureCommon.nearestVertexInVertexToEdge(pick.intersectPoint, pick.getGeometry());
					pick.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
					pick.geomVertex = point;
					return point;

				} else {
					// For 3D models, currently we don't have the center geometry of the circle. 
					// So the only way to select the center is by selecting the perimeter.
					return pick.circularArcCenter;
				}

			case MeasureCommon.SnapType.SNAP_CURVEDEDGE:
				return MeasureCommon.nearestVertexInVertexToEdge(pick.intersectPoint, pick.getGeometry());

			case MeasureCommon.SnapType.SNAP_CURVEDFACE:
				return pick.intersectPoint;

			default:
				return null;
		}
	};

	MeasureCommon.correctPerpendicularPicks = function(firstPick, secondPick, viewer, snapper) {

		if(!firstPick || !secondPick || !firstPick.getGeometry() || !secondPick.getGeometry()) {
			return false;
		}

		var start = MeasureCommon.getSnapResultPosition(firstPick, viewer);

		if(snapper && viewer) {

			// Simple _ to Edge - Snap the second pick when it's 90 degrees.
			if(secondPick.geomType === MeasureCommon.SnapType.SNAP_EDGE) {
				var v2 = new THREE.Vector3();
				var v3 = new THREE.Vector3();

				var secondEdge = secondPick.getGeometry();

				v2.subVectors(secondPick.intersectPoint, start).normalize(); // rubberband vector
				v3.subVectors(secondEdge.vertices[0], secondEdge.vertices[1]).normalize();

				if(MeasureCommon.isPerpendicular(v2, v3, 0.05)) {

					var newPoint = MeasureCommon.nearestPointInPointToSegment(start, secondEdge.vertices[0], secondEdge.vertices[1], true);

					if(newPoint) {
						if(snapper.onMouseMove(MeasureCommon.project(newPoint, viewer))) {
							snapper.setPerpendicular(true);
						}

						secondPick.geomVertex = newPoint;
						secondPick.intersectPoint = newPoint;
						return true;
					}
				}
			}

			// Simple _ to Face - Snap the second pick when it's 90 degrees.
			else if(secondPick.geomType === MeasureCommon.SnapType.SNAP_FACE) {

				var v = new THREE.Vector3();

				var secondFace = secondPick.getGeometry();

				v.subVectors(secondPick.intersectPoint, start).normalize(); // rubberband vector

				if(MeasureCommon.isParallel(secondPick.faceNormal, v, 0.05)) {

					var newPoint = MeasureCommon.nearestPointInPointToPlane(start, secondFace.vertices[0], secondPick.faceNormal);
					if(snapper.onMouseMove(MeasureCommon.project(newPoint, viewer))) {
						snapper.setPerpendicular(true);
					}

					secondPick.geomVertex = newPoint;
					secondPick.intersectPoint = newPoint;
					return true;
				}
			}
		}
	};

	MeasureCommon.calculateDistance = function(firstPick, secondPick, dPrecision, viewer) {

		if(!firstPick || !secondPick || !firstPick.getGeometry() || !secondPick.getGeometry()) {
			return null;
		}

		var ep1 = MeasureCommon.getSnapResultPosition(firstPick, viewer);
		var ep2 = MeasureCommon.getSnapResultPosition(secondPick, viewer);

		if(!ep1 || !ep2) {
			return null;
		}

		if(MeasureCommon.isEqualVectors(ep1, ep2, MeasureCommon.EPSILON)) {
			return null;
		}

		var distanceXYZ, distanceX, distanceY, distanceZ;

		// Convert coords when in 2D
		if(viewer.model.is2d()) {
			ep1 = ep1.clone();
			ep2 = ep2.clone();
			viewer.model.pageToModel(ep1, ep2, firstPick.viewportIndex2d);
		}

		// Include resolution limits for high precision 2D-measurements, where available 
		if(dPrecision) {

			var n = Math.log(2.0 * dPrecision) / Math.log(10.0);
			var nd = Math.floor(n);

			// Increase one decimal to ensure being covered
			if(1.0 < (2.0 * dPrecision / Math.pow(10.0, nd)))
				nd++;

			dPrecision = Math.pow(10.0, nd);

			// Adjust the distances aligned by the precision
			var measurementDistance = ep1.distanceTo(ep2);
			var m = measurementDistance / dPrecision;
			distanceXYZ = Math.floor(m + 0.5) * dPrecision;

			measurementDistance = Math.abs(ep1.x - ep2.x);
			m = measurementDistance / dPrecision;
			distanceX = Math.floor(m + 0.5) * dPrecision;

			measurementDistance = Math.abs(ep1.y - ep2.y);
			m = measurementDistance / dPrecision;
			distanceY = Math.floor(m + 0.5) * dPrecision;

			return {
				distanceXYZ: distanceXYZ,
				distanceX: distanceX,
				distanceY: distanceY,
				distanceZ: 0,
				type: MeasureCommon.MeasurementTypes.MEASUREMENT_DISTANCE
			};
		}

		// Calculation for 3D models and 2D models without resolution limits
		distanceXYZ = ep1.distanceTo(ep2);
		distanceX = Math.abs(ep1.x - ep2.x);
		distanceY = Math.abs(ep1.y - ep2.y);
		distanceZ = Math.abs(ep1.z - ep2.z);
		return {
			distanceXYZ: distanceXYZ,
			distanceX: distanceX,
			distanceY: distanceY,
			distanceZ: distanceZ,
			type: MeasureCommon.MeasurementTypes.MEASUREMENT_DISTANCE
		};
	};

	MeasureCommon.getDpiPrecision = function(model, viewportIndex) {

		// Only do this for 2D models.
		if(model.is3d()) {
			return 0;
		}

		// Include resolution limits for high precision 2D-measurements, where available (TREX-575)
		var page_width = model.getMetadata('page_dimensions', 'page_width', null);
		var logical_width = model.getMetadata('page_dimensions', 'logical_width', null);
		var page_height = model.getMetadata('page_dimensions', 'page_height', null);
		var logical_height = model.getMetadata('page_dimensions', 'logical_height', null);
		if(!page_width || !logical_width || !page_height || !logical_height) {
			return 0;
		}

		// Retrieve the inverse DPI
		var invdpix = page_width / logical_width;
		var invdpiy = page_height / logical_height;

		// Calculate the graininess in model units
		var p1 = new THREE.Vector3(0.0, 0.0, 0.0);
		var p2 = new THREE.Vector3(invdpix, invdpiy, 0.0);
		model.pageToModel(p1, p2, viewportIndex);
		var dPrecision = p1.distanceTo(p2);

		return dPrecision;
	};

	MeasureCommon.isContainsEqualVectors = function(points) {
		for(var i = 0; i < points.length; i++) {
			for(var j = 0; j < points.length; j++) {
				if(i !== j && MeasureCommon.isEqualVectors(points[i], points[j], MeasureCommon.EPSILON)) {
					return true;
				}
			}
		}

		return false;
	};

	MeasureCommon.calculateAngle = function(picks, viewer) {
		var points = [];

		for(var key in picks) {
			if(picks.hasOwnProperty(key)) {
				var point = MeasureCommon.getSnapResultPosition(picks[key], viewer);
				if(point) {
					points.push(point);
				}
			}
		}

		if(points.length !== 3 || MeasureCommon.isContainsEqualVectors(points)) {
			return null;
		}

		var v1 = new THREE.Vector3();
		var v2 = new THREE.Vector3();

		v1.subVectors(points[0], points[1]);
		v2.subVectors(points[2], points[1]);

		return MeasureCommon.angleVectorToVector(v1, v2);
	};

	MeasureCommon.calculateArea = function(picks, viewer) {
		var points = [];

		for(var key in picks) {
			if(picks.hasOwnProperty(key)) {
				var point = MeasureCommon.getSnapResultPosition(picks[key], viewer);
				if(point) {
					points.push(point.clone());
				}
			}
		}

		var firstPoint = MeasureCommon.getSnapResultPosition(picks[1], viewer);
		if(firstPoint) {
			points.push(firstPoint.clone());
		}

		for(var i = 0; i < points.length; i += 2) {
			viewer.model.pageToModel(points[i], points[i + 1], picks[1].viewportIndex2d);
		}

		var sum1 = 0;
		var sum2 = 0;

		for(var i = 0; i < points.length - 1; i++) {
			sum1 += points[i].x * points[i + 1].y;
			sum2 += points[i].y * points[i + 1].x;
		}

		var area = Math.abs((sum1 - sum2) / 2);
		return area;

	};

	/**
	 * The main function for this file, which calculates a measurement result (either distance
	 * or angle) from a given measurement.
	 */
	MeasureCommon.computeResult = function(picks, measurementType, viewer) {

		switch(measurementType) {
			case MeasureCommon.MeasurementTypes.MEASUREMENT_DISTANCE:
				var firstPick = picks[1];
				var secondPick = picks[2];
				var dPrecision = MeasureCommon.getDpiPrecision(viewer.model, firstPick.viewportIndex2d);

				return MeasureCommon.calculateDistance(firstPick, secondPick, dPrecision, viewer);

			case MeasureCommon.MeasurementTypes.MEASUREMENT_ANGLE:
				var angle = MeasureCommon.calculateAngle(picks, viewer);
				return angle ? {
					angle: angle,
					type: measurementType
				} : null;

			case MeasureCommon.MeasurementTypes.MEASUREMENT_AREA:
				return {
					area: MeasureCommon.calculateArea(picks, viewer),
					type: measurementType
				};

			default:
				return null;

		}
	};

	MeasureCommon.getFaceArea = function(viewer, measurement, face, units, precision, calibrationFactor) {

		var area = 0;
		var vertices = face.vertices;
		var V1 = new THREE.Vector3();
		var V2 = new THREE.Vector3();

		for(var i = 0; i < vertices.length; i += 3) {

			V1.subVectors(vertices[i + 1], vertices[i]);
			V2.subVectors(vertices[i + 2], vertices[i]);

			area += V1.length() * V2.length() * Math.sin(V1.angleTo(V2)) / 2;
		}

		area = ZhiUTech.Viewing.Private.convertUnits(viewer.model.getUnitString(), units, calibrationFactor, area, 'square');

		if(units) {

			return ZhiUTech.Viewing.Private.formatValueWithUnits(area, units + '^2', 3, precision);
		} else {

			return ZhiUTech.Viewing.Private.formatValueWithUnits(area, null, 3, precision);
		}

	};

	MeasureCommon.getCircularArcRadius = function(viewer, measurement, edge, units, precision, calibrationFactor) {

		var radius = edge.radius;

		if(radius) {
			if(viewer.model.is2d()) {
				var pt1 = edge.center.clone();
				var pt2 = edge.vertices[0].clone();
				viewer.model.pageToModel(pt1, pt2, measurement.getPick(1).viewportIndex2d);
				radius = pt1.distanceTo(pt2);
			}

			radius = ZhiUTech.Viewing.Private.convertUnits(viewer.model.getUnitString(), units, calibrationFactor, radius);
			return ZhiUTech.Viewing.Private.formatValueWithUnits(radius, units, 3, precision);
		}
	};

	MeasureCommon.project = function(point, viewer, offset) {
		var camera = viewer.navigation.getCamera(),
			containerBounds = viewer.navigation.getScreenViewport(),
			p = new THREE.Vector3(point.x, point.y, point.z);

		p = p.project(camera);

		offset = offset || 0;

		return new THREE.Vector2(Math.round((p.x + 1) / 2 * containerBounds.width) + offset,
			Math.round((-p.y + 1) / 2 * containerBounds.height) + offset);
	};

	MeasureCommon.inverseProject = function(point, viewer) {

		var camera = viewer.navigation.getCamera(),
			containerBounds = viewer.navigation.getScreenViewport(),
			p = new THREE.Vector3();

		p.x = point.x / containerBounds.width * 2 - 1;
		p.y = -(point.y / containerBounds.height * 2 - 1);
		p.z = 0;

		p = p.unproject(camera);

		return p;
	};

	//***** Helper functions for calculations without state: ***** //

	// Get the nearest point on the line from point to line
	// inLine - whether to force the result to be inside the given line or not.
	MeasureCommon.nearestPointInPointToLine = function(point, lineStart, lineEnd) {

		var X0 = new THREE.Vector3();
		var X1 = new THREE.Vector3();
		var nearestPoint;
		var param;

		X0.subVectors(lineStart, point);
		X1.subVectors(lineEnd, lineStart);
		param = X0.dot(X1);
		X0.subVectors(lineEnd, lineStart);
		param = -param / X0.dot(X0);

		X0.subVectors(lineEnd, lineStart);
		X0.multiplyScalar(param);
		nearestPoint = X0.add(lineStart);

		return nearestPoint;
	};

	// Get the nearest point on the line segment from point to line segment
	MeasureCommon.nearestPointInPointToSegment = function(point, lineStart, lineEnd, forcePerpendicular) {

		var X0 = new THREE.Vector3();
		var X1 = new THREE.Vector3();
		var nearestPoint;
		var param;

		X0.subVectors(lineStart, point);
		X1.subVectors(lineEnd, lineStart);
		param = X0.dot(X1);
		X0.subVectors(lineEnd, lineStart);
		param = -param / X0.dot(X0);

		if(param < 0) {
			if(forcePerpendicular) {
				nearestPoint = null;
			} else {
				nearestPoint = lineStart;
			}
		} else if(param > 1) {
			if(forcePerpendicular) {
				nearestPoint = null;
			} else {
				nearestPoint = lineEnd;
			}
		} else {
			X0.subVectors(lineEnd, lineStart);
			X0.multiplyScalar(param);
			nearestPoint = X0.add(lineStart);
		}

		return nearestPoint;
	};

	MeasureCommon.isEqualVectors = function(v1, v2, precision) {
		if(!v1 || !v2) {
			return false;
		}

		if(Math.abs(v1.x - v2.x) <= precision && Math.abs(v1.y - v2.y) <= precision && Math.abs(v1.z - v2.z) <= precision) {
			return true;
		}
		return false;
	};

	MeasureCommon.isInverseVectors = function(v1, v2, precision) {
		if(Math.abs(v1.x + v2.x) <= precision && Math.abs(v1.y + v2.y) <= precision && Math.abs(v1.z + v2.z) <= precision) {
			return true;
		}
		return false;
	};

	MeasureCommon.getEndPointsInEdge = function(edge) {

		var vertices = edge.vertices;
		var endPoints = [];

		for(var i = 0; i < vertices.length; ++i) {

			var duplicate = false;

			for(var j = 0; j < vertices.length; ++j) {

				if(j !== i && vertices[j].equals(vertices[i])) {

					duplicate = true;
					break;
				}
			}

			if(!duplicate) {

				endPoints.push(vertices[i]);

			}
		}

		return endPoints;
	};

	MeasureCommon.angleVectorToVector = function(v1, v2) {
		return v1.angleTo(v2) * 180 / Math.PI;
	};

	// Get the two nearest endpoints between two line segments
	MeasureCommon.nearestPointsInSegmentToSegment = function(p1, p2, p3, p4) {

		var u = new THREE.Vector3();
		var v = new THREE.Vector3();
		var w = new THREE.Vector3();

		u.subVectors(p2, p1);
		v.subVectors(p4, p3);
		w.subVectors(p1, p3);

		var a = u.dot(u);
		var b = u.dot(v);
		var c = v.dot(v);
		var d = u.dot(w);
		var e = v.dot(w);
		var D = a * c - b * b;
		var sc, sN, sD = D;
		var tc, tN, tD = D;

		// Compute the line parameters of the two closest points
		if(D < MeasureCommon.EPSILON) { // the lines are almost parallel
			sN = 0.0; // for using point p1 on segment p1p2
			sD = 1.0; // to prevent possible division by 0.0 later
			tN = e;
			tD = c;
		} else { // get the closest points on the infinite lines
			sN = b * e - c * d;
			tN = a * e - b * d;
			if(sN < 0.0) { // sc < 0 => the s = 0 is visible
				sN = 0.0;
				tN = e;
				tD = c;
			} else if(sN > sD) { // sc > 1 => the s = 1 edge is visible
				sN = sD;
				tN = e + b;
				tD = c;
			}
		}

		if(tN < 0.0) { // tc < 0 => the t = 0 edge is visible
			tN = 0.0;
			// recompute sc for this edge
			if(-d < 0.0)
				sN = 0.0;
			else if(-d > a)
				sN = sD;
			else {
				sN = -d;
				sD = a;
			}
		} else if(tN > tD) { // tc > 1 => the t = 1 edge is visible
			tN = tD;
			// recompute sc for this edge
			if((-d + b) < 0.0)
				sN = 0;
			else if((-d + b) > a)
				sN = sD;
			else {
				sN = -d + b;
				sD = a;
			}
		}

		// finally do the division to get sc and tc
		sc = Math.abs(sN) < MeasureCommon.EPSILON ? 0.0 : sN / sD;
		tc = Math.abs(tN) < MeasureCommon.EPSILON ? 0.0 : tN / tD;

		// get the difference of the two closest points
		u.multiplyScalar(sc);
		v.multiplyScalar(tc);
		w.add(u);
		w.sub(v);

		//return w.length();

		u.add(p1);
		v.add(p3);
		return [u, v];
	};

	// Get the nearest point on edge from point to edge
	MeasureCommon.nearestPointInPointToEdge = function(edge, point) {

		var vertices = edge.vertices;
		var minDist = Number.MAX_VALUE;
		var nearestPoint = null;

		for(var i = 0; i < vertices.length; i += 2) {

			var nP = MeasureCommon.nearestPointInPointToSegment(point, vertices[i], vertices[i + 1]);
			var dist = point.distanceTo(nP);
			if(dist < minDist) {
				minDist = dist;
				nearestPoint = nP;
			}
		}

		return nearestPoint;
	};

	// Find the nearest point from point to plane
	MeasureCommon.nearestPointInPointToPlane = function(p1, p2, n) {

		var nearestPoint = new THREE.Vector3();
		var norm = n.clone();
		var X0 = new THREE.Vector3();
		X0.subVectors(p1, p2);

		var sn = -norm.dot(X0);
		var sd = norm.dot(norm);
		var sb = sn / sd;

		nearestPoint.addVectors(p1, norm.multiplyScalar(sb));
		return nearestPoint;
	};

	// Find the intersection point of two nonparallel lines
	MeasureCommon.intersectLineToLine = function(p1, v1, p2, v2) {

		var X0 = new THREE.Vector3();
		var X1 = new THREE.Vector3();

		X0.subVectors(p2, p1);
		X0.cross(v2);
		X1.crossVectors(v1, v2);

		var scalar = X0.divide(X1);

		X1 = v1.clone();
		X1.multiplyScalar(scalar);
		X0.addVectors(p1, X1);

		return X0;
	};

	// Returns true if v1 an v2 are parallel
	MeasureCommon.isParallel = function(v1, v2, precision) {
		precision = precision ? precision : MeasureCommon.EPSILON;
		return 1 - Math.abs(v1.dot(v2)) < precision;
	};

	MeasureCommon.isPerpendicular = function(v1, v2, precision) {
		precision = precision ? precision : MeasureCommon.EPSILON;
		return Math.abs(v1.dot(v2)) < precision;
	};

	// Find the intersection of two nonparallel planes
	MeasureCommon.intersectPlaneToPlane = function(p1, n1, p2, n2) {

		var u = new THREE.Vector3();
		u.crossVectors(n1, n2);
		var ax = (u.x >= 0 ? u.x : -u.x);
		var ay = (u.y >= 0 ? u.y : -u.y);
		var az = (u.z >= 0 ? u.z : -u.z);

		var maxc; // max coordinate
		if(ax > ay) {
			if(ax > az)
				maxc = 1;
			else
				maxc = 3;
		} else {
			if(ay > az)
				maxc = 2;
			else maxc = 3;
		}

		var iP = new THREE.Vector3(); // intersect point
		var d1, d2;
		d1 = -n1.dot(p1);
		d2 = -n2.dot(p2);

		switch(maxc) {

			case 1: // intersect with x = 0
				iP.x = 0;
				if(u.x !== 0) {
					iP.y = (d2 * n1.z - d1 * n2.z) / u.x;
					iP.z = (d1 * n2.y - d2 * n1.y) / u.x;
				} else {
					iP.y = -(d2 * n1.z) / (n1.z * n2.y);
					iP.z = -(d1 * n2.y) / (n1.z * n2.y);
				}
				break;
			case 2:
				iP.y = 0;
				if(u.y !== 0) {
					iP.x = (d1 * n2.z - d2 * n1.z) / u.y;
					iP.z = (d2 * n1.x - d1 * n2.x) / u.y;
				} else {
					iP.x = -(d1 * n2.z) / (n1.x * n2.z);
					iP.z = -(d2 * n1.x) / (n1.x * n2.z);
				}
				break;
			case 3:
				iP.z = 0;
				if(u.z !== 0) {
					iP.x = (d2 * n1.y - d1 * n2.y) / u.z;
					iP.y = (d1 * n2.x - d2 * n1.x) / u.z;
				} else {
					iP.x = -(d2 * n1.y) / (n1.y * n2.x);
					iP.y = -(d1 * n2.x) / (n1.y * n2.x);
				}
				break;
		}

		var iP2 = new THREE.Vector3();
		iP2.addVectors(iP, u.multiplyScalar(100));

		var vP1 = MeasureCommon.nearestPointInPointToLine(p1, iP, iP2);
		var vP2 = MeasureCommon.nearestPointInPointToLine(p2, iP, iP2);

		return [vP1, vP2];

	};

	// Find the nearest point from point to triangle
	MeasureCommon.nearestPointInPointToTriangle = function(point, a, b, c) {

		var nearestPoint;
		var minDist = Number.MAX_VALUE;

		nearestPoint = MeasureCommon.pointProjectsInTriangle(point, a, b, c);
		if(nearestPoint) {
			return nearestPoint;
		}

		var p = MeasureCommon.nearestPointInPointToSegment(point, a, b);
		if(point.distanceTo(p) < minDist) {
			minDist = point.distanceTo(p);
			nearestPoint = p.clone();
		}

		p = MeasureCommon.nearestPointInPointToSegment(point, a, c);
		if(point.distanceTo(p) < minDist) {
			minDist = point.distanceTo(p);
			nearestPoint = p.clone();
		}

		p = MeasureCommon.nearestPointInPointToSegment(point, b, c);
		if(point.distanceTo(p) < minDist) {

			nearestPoint = p.clone();
		}

		return nearestPoint;
	};

	MeasureCommon.pointProjectsInTriangle = function(point, a, b, c) {

		var u = new THREE.Vector3();
		var v = new THREE.Vector3();
		var w = new THREE.Vector3();
		var n = new THREE.Vector3();

		u.subVectors(b, a);
		v.subVectors(c, a);
		n.crossVectors(u, v);
		w.subVectors(point, a);

		u.cross(w);
		var r = u.dot(n) / n.dot(n);
		w.cross(v);
		var b = w.dot(n) / n.dot(n);
		var a = 1 - r - b;

		if(a >= 0 && a <= 1 && b >= 0 && b <= 1 && r >= 0 && r <= 1) {

			var normal = THREE.Triangle.normal(a, b, c);
			var nearestPoint = this.nearestPointInPointToPlane(point, a, normal);

			return nearestPoint;
		}
	};

	MeasureCommon.nearestPointsInLineSegmentToTriangle = function(p1, p2, a, b, c) {

		// The closest pair of points between a line segment and a triangle can always be found either
		// (a) between an endpoint of the segment an the triangle interior or
		// (b) between the segment and an edge of the triangle.

		var nearestPoints = [];
		var minDist = Number.MAX_VALUE;

		var p3, p4;

		var pp1 = MeasureCommon.pointProjectsInTriangle(p1, a, b, c);
		if(pp1 && p1.distanceTo(pp1) < minDist) {
			minDist = p1.distanceTo(pp1);
			nearestPoints[0] = p1;
			nearestPoints[1] = pp1;
		}

		var pp2 = MeasureCommon.pointProjectsInTriangle(p2, a, b, c);
		if(pp2 && p2.distanceTo(pp2) < minDist) {
			minDist = p2.distanceTo(pp2);
			nearestPoints[0] = p2;
			nearestPoints[1] = pp2;
		}

		p3 = a;
		p4 = b;
		var p = MeasureCommon.nearestPointsInSegmentToSegment(p1, p2, p3, p4);
		if(p[0].distanceTo(p[1]) < minDist) {
			minDist = p[0].distanceTo(p[1]);
			nearestPoints[0] = p[0].clone();
			nearestPoints[1] = p[1].clone();
		}

		p3 = a;
		p4 = c;
		p = MeasureCommon.nearestPointsInSegmentToSegment(p1, p2, p3, p4);
		if(p[0].distanceTo(p[1]) < minDist) {
			minDist = p[0].distanceTo(p[1]);
			nearestPoints[0] = p[0].clone();
			nearestPoints[1] = p[1].clone();
		}

		p3 = b;
		p4 = c;
		p = MeasureCommon.nearestPointsInSegmentToSegment(p1, p2, p3, p4);
		if(p[0].distanceTo(p[1]) < minDist) {

			nearestPoints[0] = p[0].clone();
			nearestPoints[1] = p[1].clone();
		}

		return nearestPoints;
	};

	// Find the two nearest points between triangle and triangle
	MeasureCommon.nearestPointsInTriangleToTriangle = function(a1, b1, c1, a2, b2, c2) {

		// A pair of closest points between two triangles can be found by computing the closest points between
		// segment and triangle for all six possible combinations of an edge from one triangle tested against
		// the other triangle. But segment-triangle distance tests are fairly expensive,  and thus a better
		// realization is that the closest pair of points between T1 and T2 can be found to occur either on
		// an edge from each triangle or as a vertex of one triangle and a point interior to the other triangle.
		// In all, six vertex-triangle tests and nine edge-edge tests are required.

		var nearestPoints = [];
		var minDist = Number.MAX_VALUE;

		function vertexToTriangleTest(point, a, b, c) {

			var p = MeasureCommon.pointProjectsInTriangle(point, a, b, c);
			if(p && point.distanceTo(p) < minDist) {
				minDist = point.distanceTo(p);
				nearestPoints[0] = point;
				nearestPoints[1] = p;
			}
		}

		function edgeToEdgeTest(p1, p2, p3, p4) {

			var p = MeasureCommon.nearestPointsInSegmentToSegment(p1, p2, p3, p4);
			if(p[0].distanceTo(p[1]) < minDist) {
				minDist = p[0].distanceTo(p[1]);
				nearestPoints = p;
			}
		}

		// a1
		vertexToTriangleTest(a1, a2, b2, c2);

		// b1
		vertexToTriangleTest(b1, a2, b2, c2);

		// c1
		vertexToTriangleTest(c1, a2, b2, c2);

		// a2
		vertexToTriangleTest(a2, a1, b1, c1);

		// b2
		vertexToTriangleTest(b2, a1, b1, c1);

		// c2
		vertexToTriangleTest(c2, a1, b1, c1);

		// edge a1b1 and a2b2
		edgeToEdgeTest(a1, b1, a2, b2);

		// edge a1b1 and a2c2
		edgeToEdgeTest(a1, b1, a2, c2);

		// edge a1b1 and b2c2
		edgeToEdgeTest(a1, b1, b2, c2);

		// edge a1c1 and a2b2
		edgeToEdgeTest(a1, c1, a2, b2);

		// edge a1c1 and a2c2
		edgeToEdgeTest(a1, c1, a2, c2);

		// edge a1c1 and b2c2
		edgeToEdgeTest(a1, c1, b2, c2);

		// edge b1c1 and a2b2
		edgeToEdgeTest(b1, c1, a2, b2);

		// edge b1c1 and a2c2
		edgeToEdgeTest(b1, c1, a2, c2);

		// edge b1c1 and b2c2
		edgeToEdgeTest(b1, c1, b2, c2);

		return nearestPoints;
	};

	// Find the two nearest points between edge and face
	MeasureCommon.nearestPointsInEdgeToFace = function(p1, p2, face) {

		var nearestPoints = [];
		var minDist = Number.MAX_VALUE;

		for(var i = 0; i < face.vertices.length; i += 3) {

			var tempPs = MeasureCommon.nearestPointsInLineSegmentToTriangle(p1, p2, face.vertices[i], face.vertices[i + 1], face.vertices[i + 2]);
			if(tempPs[0].distanceTo(tempPs[1]) < minDist) {
				minDist = tempPs[0].distanceTo(tempPs[1]);
				nearestPoints = tempPs;
			}
		}

		return nearestPoints;
	};

	// Get the angle between line and plane
	MeasureCommon.angleLineToPlane = function(v, n) {

		var angle = MeasureCommon.angleVectorToVector(v, n);

		if(angle > 90) {
			angle -= 90;
		} else {
			angle = 90 - angle;
		}

		return angle;
	};

	// Get the intersect point between line and plane
	MeasureCommon.intersectPointLineToPlane = function(p0, n0, p1, p2) {

		var u = new THREE.Vector3();
		var w = new THREE.Vector3();
		u.subVectors(p2, p1);
		w.subVectors(p1, p0);

		var D = n0.dot(u);
		var N = -n0.dot(w);

		if(Math.abs(D) < MeasureCommon.EPSILON) { // edge is parallel to plane
			if(N == 0) // edge lies in plane
				return null;
			else
				return null; // no intersection
		}

		// they are not parallel
		u.multiplyScalar(N / D); // compute segment intersect point
		u.add(p1);
		return u;
	};

	// Find the vertex need to draw For circular arc's radius
	MeasureCommon.nearestVertexInVertexToEdge = function(vertex, edge) {

		var nearestPoint;
		var minDist = Number.MAX_VALUE;

		for(var i = 0; i < edge.vertices.length; i++) {
			var dist = vertex.distanceTo(edge.vertices[i]);
			if(minDist > dist) {
				nearestPoint = edge.vertices[i];
				minDist = dist;
			}
		}

		return nearestPoint;
	};

	MeasureCommon.distancePointToLine = function(point, lineStart, lineEnd) {

		var X0 = new THREE.Vector3();
		var X1 = new THREE.Vector3();
		var distance;
		var param;

		X0.subVectors(lineStart, point);
		X1.subVectors(lineEnd, lineStart);
		param = X0.dot(X1);
		X0.subVectors(lineEnd, lineStart);
		param = -param / X0.dot(X0);

		if(param < 0) {
			distance = point.distanceTo(lineStart);
		} else if(param > 1) {
			distance = point.distanceTo(lineEnd);
		} else {
			X0.subVectors(point, lineStart);
			X1.subVectors(point, lineEnd);
			X0.cross(X1);
			X1.subVectors(lineEnd, lineStart);

			distance = Math.sqrt(X0.dot(X0)) / Math.sqrt(X1.dot(X1));
		}

		return distance;
	};

	// Helper to iterator over all properties in an object
	MeasureCommon.forAll = function(obj, func) {
		if(obj) {
			for(var i in obj) {
				if(obj.hasOwnProperty(i)) {
					var m = obj[i];
					if(m)
						func(m);
				}
			}
		}
	};

	MeasureCommon.createCommonOverlay = function(viewer, name) {
		if(!viewer.impl.overlayScenes[name])
			viewer.impl.createOverlayScene(name);
	};

	MeasureCommon.safeToggle = function(element, property, show) {
		// toggle only if it needs to. Necessary for IE11.

		if((element.classList.contains(property) && !show) || (!element.classList.contains(property) && show)) {
			element.classList.toggle(property, show);
		}
	};

	// Centroid of a polygon is the average of its points.
	MeasureCommon.getCentroidOfPolygon = function(points) {
		var centroid = new THREE.Vector3();
		var n = points.length;

		for(var i = 0; i < n; i++) {
			centroid.add(points[i]);
		}

		centroid.multiplyScalar(1 / n);
		return centroid;
	};

	// Algorithm taken from here:
	// https://www.codeproject.com/Tips/862988/Find-the-Intersection-Point-of-Two-Line-Segments
	MeasureCommon.isSegmentsIntersect = function(p1, p2, q1, q2) {
		var r = new THREE.Vector3();
		var s = new THREE.Vector3();
		var rxs = new THREE.Vector3();
		var tmp = new THREE.Vector3();

		r.subVectors(p2, p1);
		s.subVectors(q2, q1);
		rxs.crossVectors(r, s);

		// The two lines are parallel and non-intersecting.
		if(Math.abs(rxs.z) < MeasureCommon.EPSILON)
			return false;

		var t = tmp.subVectors(q1, p1).cross(s).z / rxs.z;
		var u = tmp.subVectors(q1, p1).cross(r).z / rxs.z;

		// the two line segments meet at the point p + t r = q + u s.
		if(!(Math.abs(rxs.z) < MeasureCommon.EPSILON) && (0 <= t && t <= 1) && (0 <= u && u <= 1)) {
			// An intersection was found.
			return true;
		}

		// 5. Otherwise, the two line segments are not parallel but do not intersect.
		return false;
	};

	// A polygon is a simple polygon if there are no intersection between its edges.
	MeasureCommon.isPolygonSimple = function(points) {
		var n = points.length;

		if(n === 3) {
			return true;
		}

		for(var i = 0; i < n; i++) {

			var p1 = points[i];
			var p2 = points[(i + 1) % n];

			for(var j = i + 2; j < n; j++) {

				var q1 = points[(j) % n];
				var q2 = points[(j + 1) % n];

				if(q2 === p1) {
					break;
				}

				if(MeasureCommon.isSegmentsIntersect(p1, p2, q1, q2)) {
					return false;
				}
			}
		}

		return true;
	};

	// Algorithm based on https://github.com/mapbox/polylabel
	MeasureCommon.getPolygonVisualCenter = function(polygon) {
		function compareMax(a, b) {
			return b.max - a.max;
		}

		function Cell(x, y, h, polygon) {
			this.x = x; // cell center x
			this.y = y; // cell center y
			this.h = h; // half the cell size
			this.d = pointToPolygonDist(x, y, polygon); // distance from cell center to polygon
			this.max = this.d + this.h * Math.SQRT2; // max distance to polygon within a cell
		}

		// signed distance from point to polygon outline (negative if point is outside)
		function pointToPolygonDist(x, y, polygon) {
			var inside = false;
			var minDistSq = Infinity;

			for(var k = 0; k < polygon.length; k++) {
				var ring = polygon[k];

				for(var i = 0, len = ring.length, j = len - 1; i < len; j = i++) {
					var a = ring[i];
					var b = ring[j];

					if((a.y > y !== b.y > y) &&
						(x < (b.x - a.x) * (y - a.y) / (b.y - a.y) + a.x)) inside = !inside;

					minDistSq = Math.min(minDistSq, getSegDistSq(x, y, a, b));
				}
			}

			return(inside ? 1 : -1) * Math.sqrt(minDistSq);
		}

		// get polygon centroid
		function getCentroidCell(polygon) {
			var area = 0;
			var x = 0;
			var y = 0;
			var points = polygon[0];

			for(var i = 0, len = points.length, j = len - 1; i < len; j = i++) {
				var a = points[i];
				var b = points[j];
				var f = a.x * b.y - b.x * a.y;
				x += (a.x + b.x) * f;
				y += (a.y + b.y) * f;
				area += f * 3;
			}
			if(area === 0) return new Cell(points[0].x, points[0].y, 0, polygon);
			return new Cell(x / area, y / area, 0, polygon);
		}

		// get squared distance from a point to a segment
		function getSegDistSq(px, py, a, b) {

			var x = a.x;
			var y = a.y;
			var dx = b.x - x;
			var dy = b.y - y;

			if(dx !== 0 || dy !== 0) {

				var t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);

				if(t > 1) {
					x = b.x;
					y = b.y;

				} else if(t > 0) {
					x += dx * t;
					y += dy * t;
				}
			}

			dx = px - x;
			dy = py - y;

			return dx * dx + dy * dy;
		}

		function TinyQueue(data, compare) {

			function defaultCompare(a, b) {
				return a < b ? -1 : a > b ? 1 : 0;
			}

			if(!(this instanceof TinyQueue)) return new TinyQueue(data, compare);

			this.data = data || [];
			this.length = this.data.length;
			this.compare = compare || defaultCompare;

			if(this.length > 0) {
				for(var i = (this.length >> 1); i >= 0; i--) this._down(i);
			}
		}

		TinyQueue.prototype = {

			push: function(item) {
				this.data.push(item);
				this.length++;
				this._up(this.length - 1);
			},

			pop: function() {
				if(this.length === 0) return undefined;

				var top = this.data[0];
				this.length--;

				if(this.length > 0) {
					this.data[0] = this.data[this.length];
					this._down(0);
				}
				this.data.pop();

				return top;
			},

			peek: function() {
				return this.data[0];
			},

			_up: function(pos) {
				var data = this.data;
				var compare = this.compare;
				var item = data[pos];

				while(pos > 0) {
					var parent = (pos - 1) >> 1;
					var current = data[parent];
					if(compare(item, current) >= 0) break;
					data[pos] = current;
					pos = parent;
				}

				data[pos] = item;
			},

			_down: function(pos) {
				var data = this.data;
				var compare = this.compare;
				var halfLength = this.length >> 1;
				var item = data[pos];

				while(pos < halfLength) {
					var left = (pos << 1) + 1;
					var right = left + 1;
					var best = data[left];

					if(right < this.length && compare(data[right], best) < 0) {
						left = right;
						best = data[right];
					}
					if(compare(best, item) >= 0) break;

					data[pos] = best;
					pos = left;
				}

				data[pos] = item;
			}
		};

		if(polygon.length === 3) {
			return MeasureCommon.getCentroidOfPolygon(polygon);
		}

		var precision = 0.01;
		polygon = [polygon];

		// find the bounding box of the outer ring
		var minX, minY, maxX, maxY;
		for(var i = 0; i < polygon[0].length; i++) {
			var p = polygon[0][i];
			if(!i || p.x < minX) minX = p.x;
			if(!i || p.y < minY) minY = p.y;
			if(!i || p.x > maxX) maxX = p.x;
			if(!i || p.y > maxY) maxY = p.y;
		}

		var width = maxX - minX;
		var height = maxY - minY;
		var cellSize = Math.min(width, height);
		var h = cellSize / 2;

		// a priority queue of cells in order of their "potential" (max distance to polygon)
		var cellQueue = new TinyQueue(null, compareMax);

		if(cellSize === 0) return [minX, minY];

		// cover polygon with initial cells
		for(var x = minX; x < maxX; x += cellSize) {
			for(var y = minY; y < maxY; y += cellSize) {
				cellQueue.push(new Cell(x + h, y + h, h, polygon));
			}
		}

		// take centroid as the first best guess
		var bestCell = getCentroidCell(polygon);

		// special case for rectangular polygons
		var bboxCell = new Cell(minX + width / 2, minY + height / 2, 0, polygon);
		if(bboxCell.d > bestCell.d) bestCell = bboxCell;

		while(cellQueue.length) {
			// pick the most promising cell from the queue
			var cell = cellQueue.pop();

			// update the best cell if we found a better one
			if(cell.d > bestCell.d) {
				bestCell = cell;
			}

			// do not drill down further if there's no chance of a better solution
			if(cell.max - bestCell.d <= precision) continue;

			// split the cell into four cells
			h = cell.h / 2;
			cellQueue.push(new Cell(cell.x - h, cell.y - h, h, polygon));
			cellQueue.push(new Cell(cell.x + h, cell.y - h, h, polygon));
			cellQueue.push(new Cell(cell.x - h, cell.y + h, h, polygon));
			cellQueue.push(new Cell(cell.x + h, cell.y + h, h, polygon));
		}

		return {
			x: bestCell.x,
			y: bestCell.y
		};
	};

})();;
(function() {
	'use strict';

	var MeasureCommon = ZhiUTech.Viewing.MeasureCommon;

	/**
	 * This is a DATA container class.
	 * No rendering should be attached to it.
	 * @private
	 */
	function Measurement(measurementType, id) {

		this.measurementType = measurementType;
		this.id = id;
		this.picks = [];
		this.closedArea = false;

		this.resetMeasureValues();
	}

	Measurement.prototype.resetMeasureValues = function() {

		this.angle = 0;
		this.distanceX = 0;
		this.distanceY = 0;
		this.distanceZ = 0;
		this.distanceXYZ = 0;
		this.result = null;
	};

	Measurement.prototype.setPick = function(index, value) {

		var pick = this.picks[index] = value;
		pick.id = parseInt(index);
		return pick;
	};

	Measurement.prototype.getPick = function(index) {

		var pick = this.picks[index];

		if(!pick) {
			pick = this.setPick(index, new MeasureCommon.SnapResult());
		}

		return pick;
	};

	Measurement.prototype.countPicks = function() {

		return Object.keys(this.picks).length;
	};

	Measurement.prototype.getMaxNumberOfPicks = function() {

		switch(this.measurementType) {
			case MeasureCommon.MeasurementTypes.MEASUREMENT_DISTANCE:
				return 2;

			case MeasureCommon.MeasurementTypes.MEASUREMENT_ANGLE:
				return 3;

			case MeasureCommon.MeasurementTypes.MEASUREMENT_AREA:
				return this.closedArea ? this.countPicks() : Number.MAX_VALUE - 1;
		}
	};

	Measurement.prototype.hasPick = function(pickNumber) {

		return this.picks[pickNumber] && !this.picks[pickNumber].isEmpty();
	};

	Measurement.prototype.isComplete = function() {
		var complete = this.countPicks() === this.getMaxNumberOfPicks();

		for(var key in this.picks) {
			if(this.picks.hasOwnProperty(key)) {
				complete = complete && this.hasPick(key);

				if(!complete)
					break;
			}
		}

		return complete;
	};

	Measurement.prototype.isEmpty = function() {
		var empty = true;

		for(var key in this.picks) {
			if(this.picks.hasOwnProperty(key)) {
				empty = empty && !this.hasPick(key);

				if(!empty)
					break;
			}
		}

		return empty;
	};

	Measurement.prototype.clearPick = function(pickNumber) {

		if(this.picks[pickNumber]) {
			this.picks[pickNumber].clear();
		}

		this.resetMeasureValues();
	};

	Measurement.prototype.clearAllPicks = function() {

		for(var key in this.picks) {
			if(this.picks.hasOwnProperty(key)) {
				this.clearPick(key);
			}
		}
	};

	Measurement.prototype.hasEqualPicks = function(firstPick, secondPick) {
		if(!firstPick || !secondPick)
			return false;

		if(firstPick.geomType === secondPick.geomType) {
			var first = MeasureCommon.getSnapResultPosition(firstPick);
			var second = MeasureCommon.getSnapResultPosition(secondPick);
			return MeasureCommon.isEqualVectors(first, second, MeasureCommon.EPSILON);
		}

		return false;
	};

	/**
	 * Calculates distance/angle based on the values of the picks
	 * and stores it in .result
	 */
	Measurement.prototype.computeResult = function(picks, viewer) {

		this.resetMeasureValues();

		if(!viewer.model) {
			this.result = null;
			return false;
		}

		// Compute and check if there's a result
		var result = this.result = MeasureCommon.computeResult(picks, this.measurementType, viewer);

		if(result === null) {
			return !this.isComplete();
		}

		switch(result.type) {
			case MeasureCommon.MeasurementTypes.MEASUREMENT_DISTANCE:
				this.distanceXYZ = result.distanceXYZ;
				this.distanceX = result.distanceX;
				this.distanceY = result.distanceY;
				this.distanceZ = result.distanceZ;
				return true;

			case MeasureCommon.MeasurementTypes.MEASUREMENT_ANGLE:
				this.angle = isNaN(result.angle) ? 0 : result.angle;
				return true;

			case MeasureCommon.MeasurementTypes.MEASUREMENT_AREA:
				this.area = result.area;
				return true;

			default:
				return false;
		}
	};

	Measurement.prototype.getGeometry = function(pickNumber) {
		return {
			"type": this.picks[pickNumber].geomType,
			"geometry": this.picks[pickNumber].getGeometry()
		};
	};

	// TODO: Move this method elsewhere. This is a data-only class.
	Measurement.prototype.attachIndicator = function(viewer, tool, indicatorClass) {
		this.indicator = new indicatorClass(viewer, this, tool);
		this.indicator.init();
	};

	// export
	MeasureCommon.Measurement = Measurement;

})();;
(function() {
	'use strict';

	var MeasureCommon = ZhiUTechNamespace("ZhiUTech.Viewing.MeasureCommon");

	MeasureCommon.SnapResult = function() {
		this.clear();
	};

	MeasureCommon.SnapResult.prototype.clear = function() {

		this.geomType = null; // int, such as { "NONE: -1", "VERTEX": 0, "EDGE": 1, "FACE": 2, ... }
		this.snapNode = null; // int, the dbId
		this.geomVertex = null; // THREE.Vector3
		this.geomEdge = null; // THREE.Geometry
		this.geomFace = null; // THREE.Geometry
		this.radius = null; // Number
		this.intersectPoint = null; // THREE.Vector3
		this.faceNormal = null; // THREE.Vector3
		this.viewportIndex2d = null; // int
		this.circularArcCenter = null;
		this.circularArcRadius = null;
		this.fromTopology = false;
		this.isPerpendicular = false;
	};

	MeasureCommon.SnapResult.prototype.copyTo = function(destiny) {
		// Shallow copies of THREE objects should be fine.
		destiny.snapNode = this.snapNode;
		destiny.geomVertex = this.geomVertex;
		destiny.geomFace = this.geomFace;
		destiny.geomEdge = this.geomEdge;
		destiny.radius = this.radius;
		destiny.geomType = this.geomType;
		destiny.intersectPoint = this.intersectPoint;
		destiny.faceNormal = this.faceNormal;
		destiny.viewportIndex2d = this.viewportIndex2d;
		destiny.circularArcCenter = this.circularArcCenter;
		destiny.circularArcRadius = this.circularArcRadius;
		destiny.fromTopology = this.fromTopology;
		destiny.isPerpendicular = this.isPerpendicular;
	};

	MeasureCommon.SnapResult.prototype.clone = function() {
		var theClone = new MeasureCommon.SnapResult();
		this.copyTo(theClone);
		return theClone;
	};

	MeasureCommon.SnapResult.prototype.isEmpty = function() {
		return !this.getGeometry();
	};

	MeasureCommon.SnapResult.prototype.getFace = function() {
		return this.geomFace;
	};

	MeasureCommon.SnapResult.prototype.getEdge = function() {
		return this.geomEdge;
	};

	MeasureCommon.SnapResult.prototype.getVertex = function() {
		return this.geomVertex;
	};

	MeasureCommon.SnapResult.prototype.getGeometry = function() {

		switch(this.geomType) {
			case MeasureCommon.SnapType.SNAP_VERTEX:
				return this.geomVertex;
			case MeasureCommon.SnapType.SNAP_MIDPOINT:
				return this.geomVertex;
			case MeasureCommon.SnapType.SNAP_CIRCLE_CENTER:
				return this.geomVertex;
			case MeasureCommon.SnapType.SNAP_EDGE:
				return this.geomEdge;
			case MeasureCommon.SnapType.SNAP_FACE:
				return this.geomFace;
			case MeasureCommon.SnapType.SNAP_CIRCULARARC:
				return this.geomEdge;
			case MeasureCommon.SnapType.SNAP_CURVEDEDGE:
				return this.geomEdge;
			case MeasureCommon.SnapType.SNAP_CURVEDFACE:
				return this.geomFace;
			default:
				break;
		}
		return null;
	};

	MeasureCommon.SnapResult.prototype.setGeometry = function(type, geometry) {

		switch(type) {
			case MeasureCommon.SnapType.SNAP_VERTEX:
				this.geomVertex = geometry;
				break;
			case MeasureCommon.SnapType.SNAP_MIDPOINT:
				this.geomVertex = geometry;
				break;
			case MeasureCommon.SnapType.SNAP_CIRCLE_CENTER:
				this.geomVertex = geometry;
				break;
			case MeasureCommon.SnapType.SNAP_EDGE:
				this.geomEdge = geometry;
				break;
			case MeasureCommon.SnapType.SNAP_FACE:
				this.geomFace = geometry;
				break;
			case MeasureCommon.SnapType.SNAP_CIRCULARARC:
				this.geomEdge = geometry;
				break;
			case MeasureCommon.SnapType.SNAP_CURVEDEDGE:
				this.geomEdge = geometry;
				break;
			case MeasureCommon.SnapType.SNAP_CURVEDFACE:
				this.geomFace = geometry;
				break;
			default:
				return;
		}
		this.geomType = type;
	};

})();;
(function() {

	var zv = ZhiUTech.Viewing;
	var zvp = ZhiUTech.Viewing.Private;

	var MeasureCommon = ZhiUTechNamespace("ZhiUTech.Viewing.MeasureCommon");

	var SNAP_PRECISION = 0.001;

	function isEqualWithPrecision(a, b) {
		return Math.abs(a - b) <= SNAP_PRECISION;
	}

	function isEqualVectorsWithPrecision(v1, v2) {
		return Math.abs(v1.x - v2.x) <= SNAP_PRECISION &&
			Math.abs(v1.y - v2.y) <= SNAP_PRECISION &&
			Math.abs(v1.z - v2.z) <= SNAP_PRECISION;
	}

	function isInverseVectorsWithPrecision(v1, v2) {
		return Math.abs(v1.x + v2.x) <= SNAP_PRECISION &&
			Math.abs(v1.y + v2.y) <= SNAP_PRECISION &&
			Math.abs(v1.z + v2.z) <= SNAP_PRECISION;
	}

	//
	// /** @constructor */
	//
	//
	function Snapper(viewer, options) {

		var _snapResult = new MeasureCommon.SnapResult();

		var _viewer = viewer;
		var _options = options || {};
		var _names;

		if(_options.markupMode) {
			_names = ["snapper-markup"];
		} else {
			_names = ["snapper"];
		}

		var _priority = 60;

		var _active = false;

		var _distanceToEdge = Number.MAX_VALUE;
		var _distanceToVertex = null;

		var _isDragging = false;
		var _isPressing = false;
		var _isSnapped = false;

		var _forcedVpId = null; // the viewport index of the first selection for 2D

		this.indicator = new MeasureCommon.SnapperIndicator(viewer, this);

		this.markupMode = _options.markupMode;

		this.isActive = function() {
			return _active;
		};

		this.getNames = function() {
			return _names;
		};

		this.getName = function() {
			return _names[0];
		};

		this.getPriority = function() {
			return _priority;
		};

		this.activate = function() {
			_active = true;

			if(!this.indicator) {
				this.indicator = new MeasureCommon.SnapperIndicator(viewer, this);
			}
		};

		this.deactivate = function() {
			_active = false;

			if(this.indicator) {
				this.indicator.destroy();
				this.indicator = null;
			}
		};

		this.copyResults = function(destiny) {
			_snapResult.copyTo(destiny);
		};

		this.getEdge = function() {
			return _snapResult.geomEdge;
		};

		this.getVertex = function() {
			return _snapResult.geomVertex;
		};

		this.getGeometry = function() {
			return _snapResult.getGeometry();
		};

		this.getGeometryType = function() {
			return _snapResult.geomType;
		};

		this.getIntersectPoint = function() {
			return _snapResult.intersectPoint;
		};

		this.getSnapResult = function() {
			return _snapResult;
		};

		this.isSnapped = function() {
			return _isSnapped;
		};

		this.clearSnapped = function() {
			_snapResult.clear();
			_isSnapped = false;
		};

		this.setViewportId = function(vpId) {
			_forcedVpId = vpId;
		};

		/**
		 * 3D Snapping
		 * @param result -Result of Hit Test.
		 */
		this.snapping3D = function(result) {

			_snapResult.snapNode = result.dbId;
			_snapResult.intersectPoint = result.intersectPoint;

			var face = result.face;
			var fragIds;

			if(!result.fragId || result.fragId.length === undefined) {
				fragIds = [result.fragId];
			} else {
				fragIds = result.fragId;
			}

			// This is for Fusion model with topology data
			_snapResult.hasTopology = result.model.hasTopology();
			if(_snapResult.hasTopology) {
				this.snapping3DwithTopology(face, fragIds, result.model);
			} else {
				this.snapping3DtoMesh(face, fragIds, result.model);
			}
		};

		/**
		 * Snapping order is: 1st vertices, 2nd edges, 3rd and final faces.
		 */
		this.snapping3DwithTopology = function(face, fragIds, model) {

			// Because edge topology data may be in other fragments with same dbId, need to iterate all of them.
			if(_snapResult.snapNode) {
				fragIds = [];

				model.getData().instanceTree.enumNodeFragments(_snapResult.snapNode, function(fragId) {
					fragIds.push(fragId);
				}, true);
			}

			_snapResult.geomFace = _snapResult.geomEdge = _snapResult.geomVertex = null;
			_distanceToEdge = Number.MAX_VALUE;

			for(var fi = 0; fi < fragIds.length; ++fi) {

				var fragId = fragIds[fi];
				var mesh = _viewer.impl.getRenderProxy(model, fragId);
				var geometry = mesh.geometry;

				var topoIndex = model.getTopoIndex(fragId);
				var topology = model.getTopology(topoIndex);
				var facesTopology = topology.faces;
				var edgesTopology = topology.edges;

				if(!_snapResult.geomFace) {
					_snapResult.geomFace = this.faceSnappingWithTopology(face, geometry, facesTopology, mesh);

					if(_snapResult.geomFace) {
						_snapResult.geomFace.fragId = fragId;
					}

					var normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
					_snapResult.faceNormal = face.normal.applyMatrix3(normalMatrix).normalize();
				}

				// Need to iterate all frags with same dbId, because when meshes are attached with each other, 
				// edge-topology data will only be on one mesh.
				this.edgeSnappingWithTopology(_snapResult.intersectPoint, geometry, edgesTopology, mesh);

			}

			_snapResult.geomVertex = this.vertexSnappingWithTopology(_snapResult.geomEdge, _snapResult.intersectPoint);

			if(_snapResult.geomFace) {

				// Determine which one should be drawn: face , edge or vertex
				_snapResult.radius = this.setDetectRadius(_snapResult.intersectPoint);

				if((_options.forceSnapVertices || _distanceToVertex < _snapResult.radius) && _snapResult.geomVertex) {
					_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
				} else if((_options.forceSnapEdges || _distanceToEdge < _snapResult.radius) && _snapResult.geomEdge) {

					var center = this.edgeIsCircle(_snapResult.geomEdge);
					if(center) {
						_snapResult.circularArcCenter = center;
						_snapResult.circularArcRadius = center.distanceTo(_snapResult.geomEdge.vertices[0]);
						_snapResult.geomEdge.center = _snapResult.circularArcCenter;
						_snapResult.geomEdge.radius = _snapResult.circularArcRadius;
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_CIRCULARARC;
					} else if(this.edgeIsCurved(_snapResult.geomEdge)) {
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_CURVEDEDGE;
					} else {
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_EDGE;
					}

				} else {

					if(this.faceIsCurved(_snapResult.geomFace)) {
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_CURVEDFACE;
					} else {
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_FACE;
					}

				}

				_isSnapped = true;
			}
		};

		this.snapping3DtoMesh = function(face, fragIds, model) {
			for(var fi = 0; fi < fragIds.length; ++fi) {

				var fragId = fragIds[fi];
				var mesh = _viewer.impl.getRenderProxy(model, fragId);
				var geometry = mesh.geometry;

				_snapResult.geomFace = this.faceSnapping(face, geometry);

				if(!_snapResult.geomFace)
					continue;

				_snapResult.geomFace.applyMatrix(mesh.matrixWorld);
				_snapResult.geomEdge = this.edgeSnapping(_snapResult.geomFace, _snapResult.intersectPoint);
				_snapResult.geomVertex = this.vertexSnapping(_snapResult.geomEdge, _snapResult.intersectPoint);

				var normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
				_snapResult.faceNormal = face.normal.applyMatrix3(normalMatrix).normalize();

				// Determine which one should be drawn: face , edge or vertex
				_snapResult.radius = this.setDetectRadius(_snapResult.intersectPoint);

				if((_options.forceSnapVertices || (_distanceToVertex < _snapResult.radius))) {
					_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
				} else if(_options.forceSnapEdges || (_distanceToEdge < _snapResult.radius)) {
					_snapResult.geomType = MeasureCommon.SnapType.SNAP_EDGE;
				} else {
					_snapResult.geomType = MeasureCommon.SnapType.SNAP_FACE;
				}

				_isSnapped = true;
				break;
			}
		};

		this.faceSnappingWithTopology = function(face, geometry, facesTopology, mesh) {

			var vA = new THREE.Vector3();
			var vB = new THREE.Vector3();
			var vC = new THREE.Vector3();

			var geom = new THREE.Geometry();

			var attributes = geometry.attributes;

			if(attributes.index !== undefined) {

				var positions = geometry.vb ? geometry.vb : attributes.position.array;
				var stride = geometry.vb ? geometry.vbstride : 3;

				// Find the index of face topology list which includes the intersect face(triangle)
				for(var i = 0; i < facesTopology.length; i++) {

					var indexList = facesTopology[i].indexList;
					var faceId = facesTopology[i].id;
					for(var j = 0; j < indexList.length; j += 3) {

						if(face.a === indexList[j]) {
							if((face.b === indexList[j + 1] && face.c === indexList[j + 2]) || (face.b === indexList[j + 2] && face.c === indexList[j + 1])) {
								break;
							}
						} else if(face.a === indexList[j + 1]) {
							if((face.b === indexList[j] && face.c === indexList[j + 2]) || (face.b === indexList[j + 2] && face.c === indexList[j])) {
								break;
							}
						} else if(face.a === indexList[j + 2]) {
							if((face.b === indexList[j] && face.c === indexList[j + 1]) || (face.b === indexList[j + 1] && face.c === indexList[j])) {
								break;
							}
						}
					}

					if(j < indexList.length) {
						break;
					}
				}

				if(i < facesTopology.length) {

					for(var j = 0; j < indexList.length; j += 3) {
						vA.set(
							positions[indexList[j] * stride],
							positions[indexList[j] * stride + 1],
							positions[indexList[j] * stride + 2]
						);
						vB.set(
							positions[indexList[j + 1] * stride],
							positions[indexList[j + 1] * stride + 1],
							positions[indexList[j + 1] * stride + 2]
						);
						vC.set(
							positions[indexList[j + 2] * stride],
							positions[indexList[j + 2] * stride + 1],
							positions[indexList[j + 2] * stride + 2]
						);

						var vIndex = geom.vertices.length;

						geom.vertices.push(vA.clone());
						geom.vertices.push(vB.clone());
						geom.vertices.push(vC.clone());

						geom.faces.push(new THREE.Face3(vIndex, vIndex + 1, vIndex + 2));
					}
				}
			}

			//console.log(face);

			if(geom.vertices.length > 0) {

				geom.faceId = faceId;
				geom.applyMatrix(mesh.matrixWorld);
				return geom;
			} else {

				return null;
			}

		};

		/**
		 * Find the closest face next to the cast ray
		 * @param face - the intersect triangle of Hit Test.
		 * @param geometry - the geometry of mesh
		 */
		this.faceSnapping = function(face, geometry) {

			var vA = new THREE.Vector3();
			var vB = new THREE.Vector3();
			var vC = new THREE.Vector3();

			var geom = new THREE.Geometry(); //Geometry which includes all the triangles on the same plane.

			var attributes = geometry.attributes;

			if(attributes.index !== undefined) {

				var indices = attributes.index.array || geometry.ib;
				var positions = geometry.vb ? geometry.vb : attributes.position.array;
				var stride = geometry.vb ? geometry.vbstride : 3;
				var offsets = geometry.offsets;

				if(!offsets || offsets.length === 0) {

					offsets = [{
						start: 0,
						count: indices.length,
						index: 0
					}];

				}

				for(var oi = 0; oi < offsets.length; ++oi) {

					var start = offsets[oi].start;
					var count = offsets[oi].count;
					var index = offsets[oi].index;

					for(var i = start; i < start + count; i += 3) {

						var a = index + indices[i];
						var b = index + indices[i + 1];
						var c = index + indices[i + 2];

						vA.set(
							positions[a * stride],
							positions[a * stride + 1],
							positions[a * stride + 2]
						);
						vB.set(
							positions[b * stride],
							positions[b * stride + 1],
							positions[b * stride + 2]
						);
						vC.set(
							positions[c * stride],
							positions[c * stride + 1],
							positions[c * stride + 2]
						);

						var faceNormal = THREE.Triangle.normal(vA, vB, vC);

						var va = new THREE.Vector3();
						va.set(
							positions[face.a * stride],
							positions[face.a * stride + 1],
							positions[face.a * stride + 2]
						);

						if(isEqualVectorsWithPrecision(faceNormal, face.normal) && isEqualWithPrecision(faceNormal.dot(vA), face.normal.dot(va))) {

							var vIndex = geom.vertices.length;

							geom.vertices.push(vA.clone());
							geom.vertices.push(vB.clone());
							geom.vertices.push(vC.clone());

							geom.faces.push(new THREE.Face3(vIndex, vIndex + 1, vIndex + 2));

						}
					}
				}
			}

			if(geom.vertices.length > 0) {

				return this.getTrianglesOnSameFace(geom, face, positions, stride);
			} else {

				return null;
			}
		};

		/**
		 * Find triangles on the same face with the triangle intersected with the cast ray
		 * @param geom -Geometry which includes all the triangles on the same plane.
		 * @param face -Triangle which intersects with the cast ray.
		 * @param positions -Positions of all vertices.
		 * @param stride -Stride for the interleaved buffer.
		 */
		this.getTrianglesOnSameFace = function(geom, face, positions, stride) {

			var isIncludeFace = false; // Check if the intersect face is in the mesh
			var vertexIndices = geom.vertices.slice();

			var va = new THREE.Vector3();
			va.set(
				positions[face.a * stride],
				positions[face.a * stride + 1],
				positions[face.a * stride + 2]
			);
			var vb = new THREE.Vector3();
			vb.set(
				positions[face.b * stride],
				positions[face.b * stride + 1],
				positions[face.b * stride + 2]
			);
			var vc = new THREE.Vector3();
			vc.set(
				positions[face.c * stride],
				positions[face.c * stride + 1],
				positions[face.c * stride + 2]
			);
			var intersectFace = new THREE.Geometry();
			intersectFace.vertices.push(va);
			intersectFace.vertices.push(vb);
			intersectFace.vertices.push(vc);
			intersectFace.faces.push(new THREE.Face3(0, 1, 2));

			var vCount = [];

			do {

				vCount = [];

				for(var j = 0; j < vertexIndices.length; j += 3) {

					// The triangle which is intersected with the ray
					if(vertexIndices[j].equals(va) && vertexIndices[j + 1].equals(vb) && vertexIndices[j + 2].equals(vc)) {

						isIncludeFace = true;
						vCount.push(j);
						continue;
					}

					for(var k = 0; k < intersectFace.vertices.length; k += 3) {

						// The triangles which are on the same face with the intersected triangle
						if(this.trianglesSharedEdge(vertexIndices[j], vertexIndices[j + 1], vertexIndices[j + 2],
								intersectFace.vertices[k], intersectFace.vertices[k + 1], intersectFace.vertices[k + 2])) {

							var vIndex = intersectFace.vertices.length;
							intersectFace.vertices.push(vertexIndices[j].clone());
							intersectFace.vertices.push(vertexIndices[j + 1].clone());
							intersectFace.vertices.push(vertexIndices[j + 2].clone());
							intersectFace.faces.push(new THREE.Face3(vIndex, vIndex + 1, vIndex + 2));

							vCount.push(j);
							break;
						}
					}
				}

				for(var ci = vCount.length - 1; ci >= 0; --ci) {

					vertexIndices.splice(vCount[ci], 3);

				}

			} while (vCount.length > 0);

			if(isIncludeFace) {
				return intersectFace;
			} else {
				return null;
			}

		};

		/**
		 * Check if the two triangle share edge, the inputs are their vertices
		 */
		this.trianglesSharedEdge = function(a1, a2, a3, b1, b2, b3) {

			var c1 = false;
			var c2 = false;
			var c3 = false;

			if(a1.equals(b1) || a1.equals(b2) || a1.equals(b3)) {
				c1 = true;
			}
			if(a2.equals(b1) || a2.equals(b2) || a2.equals(b3)) {
				c2 = true;
			}
			if(a3.equals(b1) || a3.equals(b2) || a3.equals(b3)) {
				c3 = true;
			}

			if(c1 & c2 || c1 & c3 || c2 & c3) {
				return true;
			}

			return false;
		};

		this.edgeSnappingWithTopology = function(intersectPoint, geometry, edgesTopology, mesh) {

			var edgeGeom = new THREE.Geometry();
			var minDistTopoIndex;
			var minDist = Number.MAX_VALUE;

			var vA = new THREE.Vector3();
			var vB = new THREE.Vector3();

			var attributes = geometry.attributes;

			if(attributes.index !== undefined && edgesTopology != undefined) {

				var positions = geometry.vb ? geometry.vb : attributes.position.array;
				var stride = geometry.vb ? geometry.vbstride : 3;

				// Find the index of edge topology list which includes the nearest edge segment to the intersect point
				for(var i = 0; i < edgesTopology.length; i++) {

					var indexList = edgesTopology[i].indexList;
					// In edges topology index list the type is LineStrip
					for(var j = 0; j < indexList.length - 1; j++) {
						vA.set(
							positions[indexList[j] * stride],
							positions[indexList[j] * stride + 1],
							positions[indexList[j] * stride + 2]
						);
						vB.set(
							positions[indexList[j + 1] * stride],
							positions[indexList[j + 1] * stride + 1],
							positions[indexList[j + 1] * stride + 2]
						);

						vA.applyMatrix4(mesh.matrixWorld);
						vB.applyMatrix4(mesh.matrixWorld);

						var dist = MeasureCommon.distancePointToLine(intersectPoint, vA, vB);
						if(dist < minDist) {
							minDist = dist;
							minDistTopoIndex = i;
						}
					}
				}

				if(minDistTopoIndex) {
					indexList = edgesTopology[minDistTopoIndex].indexList;
					for(var k = 0; k < indexList.length - 1; k++) {
						edgeGeom.vertices.push(new THREE.Vector3(positions[indexList[k] * stride], positions[indexList[k] * stride + 1], positions[indexList[k] * stride + 2]));
						// To make the line's type to LinePieces which is used by drawLine function
						edgeGeom.vertices.push(new THREE.Vector3(positions[indexList[k + 1] * stride], positions[indexList[k + 1] * stride + 1], positions[indexList[k + 1] * stride + 2]));
					}
				}
			}

			if(_distanceToEdge >= minDist && edgeGeom.vertices.length > 0) {

				_distanceToEdge = minDist;
				edgeGeom.applyMatrix(mesh.matrixWorld);
				_snapResult.geomEdge = edgeGeom;
			}
		};

		/**
		 * Find the closest edge next to the intersect point
		 * @param face -Face which is found by faceSnapping.
		 * @param intersectPoint -IntersectPoint between cast ray and face.
		 * @param mesh -The whole mesh of one fragment.
		 */
		this.edgeSnapping = function(face, intersectPoint) {

			var lineGeom = new THREE.Geometry();
			var isEdge_12 = true;
			var isEdge_13 = true;
			var isEdge_23 = true;

			for(var i = 0; i < face.vertices.length; i += 3) {

				for(var j = 0; j < face.vertices.length; j += 3) {

					if(i !== j) {
						// Check edge 12
						if((face.vertices[i].equals(face.vertices[j]) || face.vertices[i].equals(face.vertices[j + 1]) ||
								face.vertices[i].equals(face.vertices[j + 2])) &&
							(face.vertices[i + 1].equals(face.vertices[j]) || face.vertices[i + 1].equals(face.vertices[j + 1]) ||
								face.vertices[i + 1].equals(face.vertices[j + 2]))) {

							isEdge_12 = false;

						}
						// Check edge 13
						if((face.vertices[i].equals(face.vertices[j]) || face.vertices[i].equals(face.vertices[j + 1]) ||
								face.vertices[i].equals(face.vertices[j + 2])) &&
							(face.vertices[i + 2].equals(face.vertices[j]) || face.vertices[i + 2].equals(face.vertices[j + 1]) ||
								face.vertices[i + 2].equals(face.vertices[j + 2]))) {

							isEdge_13 = false;

						}
						// Check edge 23
						if((face.vertices[i + 1].equals(face.vertices[j]) || face.vertices[i + 1].equals(face.vertices[j + 1]) ||
								face.vertices[i + 1].equals(face.vertices[j + 2])) &&
							(face.vertices[i + 2].equals(face.vertices[j]) || face.vertices[i + 2].equals(face.vertices[j + 1]) ||
								face.vertices[i + 2].equals(face.vertices[j + 2]))) {

							isEdge_23 = false;

						}
					}
				}

				if(isEdge_12) {

					lineGeom.vertices.push(face.vertices[i].clone());
					lineGeom.vertices.push(face.vertices[i + 1].clone());

				}
				if(isEdge_13) {

					lineGeom.vertices.push(face.vertices[i].clone());
					lineGeom.vertices.push(face.vertices[i + 2].clone());

				}
				if(isEdge_23) {

					lineGeom.vertices.push(face.vertices[i + 1].clone());
					lineGeom.vertices.push(face.vertices[i + 2].clone());

				}

				isEdge_12 = true;
				isEdge_13 = true;
				isEdge_23 = true;

			}

			//return lineGeom;

			var edgeGeom = new THREE.Geometry();
			var minDistIndex;
			var minDist = Number.MAX_VALUE;

			for(var k = 0; k < lineGeom.vertices.length; k += 2) {

				var dist = MeasureCommon.distancePointToLine(intersectPoint, lineGeom.vertices[k], lineGeom.vertices[k + 1]);

				if(dist < minDist) {
					minDist = dist;
					minDistIndex = k;
				}

			}

			edgeGeom.vertices.push(lineGeom.vertices[minDistIndex].clone());
			edgeGeom.vertices.push(lineGeom.vertices[minDistIndex + 1].clone());

			edgeGeom.vertices = this.getConnectedLineSegmentsOnSameLine(lineGeom, edgeGeom.vertices);

			_distanceToEdge = minDist;

			return edgeGeom;

		};

		this.getConnectedLineSegmentsOnSameLine = function(lineGeom, edgeVertices) {

			var vertices = lineGeom.vertices.slice();
			var va = edgeVertices[0];
			var vb = edgeVertices[1];

			var vCount = [];

			do {

				vCount = [];

				for(var j = 0; j < vertices.length; j += 2) {

					// The line which has min distance to intersection point
					if(vertices[j].equals(va) && vertices[j + 1].equals(vb)) {

						continue;
					}

					for(var k = 0; k < edgeVertices.length; k += 2) {

						// The line segments which are connected on the same line
						if(vertices[j].equals(edgeVertices[k]) || vertices[j + 1].equals(edgeVertices[k]) ||
							vertices[j].equals(edgeVertices[k + 1]) || vertices[j + 1].equals(edgeVertices[k + 1])) {

							var V0 = new THREE.Vector3();
							var V1 = new THREE.Vector3();

							V0.subVectors(edgeVertices[k], edgeVertices[k + 1]);
							V0.normalize();
							V1.subVectors(vertices[j], vertices[j + 1]);
							V1.normalize();

							//if (V0.equals(V1) || V0.equals(V1.negate())) {
							if(isEqualVectorsWithPrecision(V0, V1) || isInverseVectorsWithPrecision(V0, V1)) {

								vCount.push(j);
								break;

							}
						}
					}
				}

				for(var ci = vCount.length - 1; ci >= 0; --ci) {

					edgeVertices.push(vertices[vCount[ci]]);
					edgeVertices.push(vertices[vCount[ci] + 1]);
					vertices.splice(vCount[ci], 2);

				}

			} while (vCount.length > 0);

			return edgeVertices;

		};

		this.vertexSnappingWithTopology = function(edge, intersectPoint) {

			var minDist = Number.MAX_VALUE;
			var point = new THREE.Vector3();

			if(edge && edge.vertices.length > 1) {
				var dist1 = intersectPoint.distanceTo(edge.vertices[0]);
				var dist2 = intersectPoint.distanceTo(edge.vertices[edge.vertices.length - 1]);

				if(dist1 <= dist2) {
					minDist = dist1;
					point = edge.vertices[0].clone();
				} else {
					minDist = dist2;
					point = edge.vertices[edge.vertices.length - 1].clone();
				}
			}

			_distanceToVertex = minDist;

			return point;
		};

		/**
		 * Find the closest vertex next to the intersect point
		 * @param edge -Edge which is found by edgeSnapping.
		 * @param intersectPoint -IntersectPoint between cast ray and face.
		 */
		this.vertexSnapping = function(edge, intersectPoint) {

			var minDist = Number.MAX_VALUE;
			var point = new THREE.Vector3();

			for(var i = 0; i < edge.vertices.length; ++i) {

				var dist = intersectPoint.distanceTo(edge.vertices[i]);

				if(dist < minDist - SNAP_PRECISION) {

					minDist = dist;
					point = edge.vertices[i].clone();

				}
			}

			_distanceToVertex = minDist;

			return point;
		};

		// This is only a workaround to detect if an edge is circle
		this.edgeIsCircle = function(edge) {

			var vertices = edge.vertices;

			// Exclude squares and regular polygons
			if(vertices.length < 8) {
				return false;
			}

			if(vertices[0].equals(vertices[vertices.length - 1])) {

				var center = new THREE.Vector3(0, 0, 0);
				for(var i = 0; i < vertices.length; i += 2) {
					center.add(vertices[i]);
				}
				center.divideScalar(vertices.length / 2.0);

				var radius = center.distanceTo(vertices[0]);
				for(var i = 0; i < vertices.length; i += 2) {
					if(Math.abs(center.distanceTo(vertices[i]) - radius) <= SNAP_PRECISION) {
						continue;
					} else {
						return false;
					}
				}
				return center;
			} else {
				return false;
			}
		};

		this.edgeIsCurved = function(edge) {

			var vertices = edge.vertices;

			if(vertices.length <= 2) {
				return false;
			} else if(vertices[0].equals(vertices[vertices.length - 1])) {
				return true;
			} else {
				var V1 = new THREE.Vector3();
				V1.subVectors(vertices[0], vertices[1]);

				var V2 = new THREE.Vector3();
				for(var i = 2; i < vertices.length; i += 2) {
					V2.subVectors(vertices[i], vertices[i + 1]);
					if(!isEqualVectorsWithPrecision(V1, V2)) {
						return true;
					}
				}

				return false;
			}
		};

		this.faceIsCurved = function(face) {

			var vertices = face.vertices;
			var faces = face.faces;

			if(faces.length <= 1) {
				return false;
			} else {
				var fN1 = THREE.Triangle.normal(vertices[faces[0].a], vertices[faces[0].b], vertices[faces[0].c]);
				var vA1 = vertices[faces[0].a];

				for(var i = 1; i < faces.length; i++) {
					var fN2 = THREE.Triangle.normal(vertices[faces[i].a], vertices[faces[i].b], vertices[faces[i].c]);
					var vA2 = vertices[faces[i].a];

					if(!isEqualVectorsWithPrecision(fN1, fN2) || !isEqualWithPrecision(fN1.dot(vA1), fN2.dot(vA2))) {
						return true;
					}
				}

				return false;
			}
		};

		this.angleVector2 = function(vector) {

			if(vector.x > 0 && vector.y >= 0) {
				return Math.atan(vector.y / vector.x);
			} else if(vector.x >= 0 && vector.y < 0) {
				return Math.atan(vector.y / vector.x) + Math.PI * 2;
			} else if(vector.x < 0 && vector.y <= 0) {
				return Math.atan(vector.y / vector.x) + Math.PI;
			} else if(vector.x <= 0 && vector.y > 0) {
				return Math.atan(vector.y / vector.x) + Math.PI;
			} else { // x = 0, y = 0
				return null;
			}
		};

		function GeometryCallback(viewer, snapper, aDetectRadius) {
			this.viewer = viewer;
			this.snapper = snapper;

			this.lineGeom = new THREE.Geometry();
			this.circularArc = null;
			this.circularArcCenter;
			this.circularArcRadius;
			this.ellipticalArc = null;
			this.ellipticalArcCenter;

			this.minDist = Number.MAX_VALUE;

			this.vpIdLine = null;
			this.vpIdCircular = null;
			this.vpIdElliptical = null;

			this.detectRadius = aDetectRadius;
		}

		GeometryCallback.prototype.onLineSegment = function(x1, y1, x2, y2, vpId) {
			var intersectPoint = this.snapper.getIntersectPoint();
			var vertices = this.lineGeom.vertices;
			var v1 = new THREE.Vector3(x1, y1, intersectPoint.z);
			var v2 = new THREE.Vector3(x2, y2, intersectPoint.z);

			var dist = MeasureCommon.distancePointToLine(intersectPoint, v1, v2);
			if(dist <= this.detectRadius && dist < this.minDist) {

				vertices.splice(0, 2, v1, v2);
				this.minDist = dist;

				this.vpIdLine = vpId;
			}
		};

		GeometryCallback.prototype.onCircularArc = function(cx, cy, start, end, radius, vpId) {
			var intersectPoint = this.snapper.getIntersectPoint();
			var point = new THREE.Vector2(intersectPoint.x, intersectPoint.y);

			var center = new THREE.Vector2(cx, cy);
			var dist = point.distanceTo(center);
			point.sub(center);

			var angle = this.snapper.angleVector2(point);

			if(Math.abs(dist - radius) <= this.detectRadius) {

				if(end > start && angle >= start && angle <= end) {
					var arc = new THREE.CircleGeometry(radius, 100, start, end - start);
				} else if(end < start && (angle >= start || angle <= end)) {
					var arc = new THREE.CircleGeometry(radius, 100, start, Math.PI * 2 - start + end);
				} else {
					return;
				}
				arc.vertices.splice(0, 1);
				arc.applyMatrix(new THREE.Matrix4().makeTranslation(cx, cy, intersectPoint.z));
				this.circularArc = arc;
				this.circularArcCenter = new THREE.Vector3(cx, cy, intersectPoint.z);
				this.circularArcRadius = radius;

				this.vpIdCircular = vpId;
			}
		};

		GeometryCallback.prototype.onEllipticalArc = function(cx, cy, start, end, major, minor, tilt, vpId) {
			var intersectPoint = this.snapper.getIntersectPoint();
			var point = new THREE.Vector2(intersectPoint.x, intersectPoint.y);

			var major1 = major - this.detectRadius;
			var minor1 = minor - this.detectRadius;
			var major2 = major + this.detectRadius;
			var minor2 = minor + this.detectRadius;

			var equation1 = (point.x - cx) * (point.x - cx) / (major1 * major1) + (point.y - cy) * (point.y - cy) / (minor1 * minor1);
			var equation2 = (point.x - cx) * (point.x - cx) / (major2 * major2) + (point.y - cy) * (point.y - cy) / (minor2 * minor2);

			var center = new THREE.Vector2(cx, cy);
			point.sub(center);
			point.x *= minor;
			point.y *= major;
			var angle = this.snapper.angleVector2(point);

			if(end > Math.PI * 2) {
				end = Math.PI * 2;
			}

			if(equation1 >= 1 && equation2 <= 1) {

				if((end > start && angle >= start && angle <= end) || (end < start && (angle >= start || angle <= end))) {
					var curve = new THREE.EllipseCurve(cx, cy, major, minor, start, end, false);
					var path = new THREE.Path(curve.getPoints(50));
					var arc = path.createPointsGeometry(50);

					if(!isEqualWithPrecision(end - start, Math.PI * 2)) {
						arc.vertices.pop();
					}
					arc.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, intersectPoint.z));
					this.ellipticalArc = arc;
					this.ellipticalArcCenter = new THREE.Vector3(cx, cy, intersectPoint.z);

					this.vpIdElliptical = vpId;
				}
			}
		};

		this.snapping2D = function(result) {

			if(!result) {
				return;
			}

			var intersectPoint = result.intersectPoint;
			var fragIds = result.fragId;

			if(typeof fragIds === "undefined") {
				return;
			} else if(!Array.isArray(fragIds)) {
				fragIds = [fragIds];
			}

			_snapResult.hasTopology = false;
			_snapResult.intersectPoint = intersectPoint;

			// Determine which one should be drawn: line, circular arc or elliptical arc
			_snapResult.radius = this.setDetectRadius(intersectPoint);

			// Geometry snapping is only possible if a fragment list is available to obtain geometry per fragment.
			var supportsGeomSnapping = (_viewer.model.getFragmentList() != null);
			if(!supportsGeomSnapping) {

				// If no snapping is available, just accept the hitpoint as a vertex hit. This allows to measure
				// distances between arbitrary points in rasters.
				_isSnapped = true;
				_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
				_snapResult.geomVertex = intersectPoint;

				return;
			}

			var gc = new GeometryCallback(_viewer, this, _snapResult.radius);

			for(var fi = 0; fi < fragIds.length; ++fi) {

				var mesh = _viewer.impl.getRenderProxy(_viewer.model, fragIds[fi]);

				if(mesh && mesh.geometry) {
					var vbr = new zvp.VertexBufferReader(mesh.geometry, _viewer.impl.use2dInstancing);
					vbr.enumGeomsForObject(result.dbId, gc);
				}

			}

			if(gc.circularArc) {

				_snapResult.viewportIndex2d = gc.vpIdCircular;

				// Only snap the geometries which belong to the same viewport as the first selection
				if(_forcedVpId !== null && _forcedVpId !== _snapResult.viewportIndex2d)
					return;

				if(intersectPoint.distanceTo(gc.circularArc.vertices[0]) < _snapResult.radius) {

					_snapResult.geomVertex = gc.circularArc.vertices[0];
					_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
				} else if(intersectPoint.distanceTo(gc.circularArc.vertices[gc.circularArc.vertices.length - 1]) < _snapResult.radius) {

					_snapResult.geomVertex = gc.circularArc.vertices[gc.circularArc.vertices.length - 1];
					_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
				} else {

					this.lineStripToPieces(gc.circularArc);
					_snapResult.geomEdge = gc.circularArc;
					_snapResult.circularArcCenter = gc.circularArcCenter;
					_snapResult.circularArcRadius = gc.circularArcRadius;
					_snapResult.geomType = MeasureCommon.SnapType.SNAP_CIRCULARARC;
				}

				_isSnapped = true;

			} else if(gc.ellipticalArc) {

				_snapResult.viewportIndex2d = gc.vpIdElliptical;

				// Only snap the geometries which belong to the same viewport as the first selection
				if(_forcedVpId !== null && _forcedVpId !== _snapResult.viewportIndex2d)
					return;

				if(intersectPoint.distanceTo(gc.ellipticalArc.vertices[0]) < _snapResult.radius) {

					_snapResult.geomVertex = gc.ellipticalArc.vertices[0];
					_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
				} else if(intersectPoint.distanceTo(gc.ellipticalArc.vertices[gc.ellipticalArc.vertices.length - 1]) < _snapResult.radius) {

					_snapResult.geomVertex = gc.ellipticalArc.vertices[gc.ellipticalArc.vertices.length - 1];
					_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
				} else {

					this.lineStripToPieces(gc.ellipticalArc);
					_snapResult.geomEdge = gc.ellipticalArc;
					// Before we have measure design for elliptical arc, measure the center for now
					_snapResult.circularArcCenter = gc.ellipticalArcCenter;
					_snapResult.circularArcRadius = null;
					_snapResult.geomType = MeasureCommon.SnapType.SNAP_CIRCULARARC;
				}

				_isSnapped = true;

			} else if(gc.lineGeom.vertices.length) {

				_snapResult.viewportIndex2d = gc.vpIdLine;

				// Only snap the geometries which belong to the same viewport as the first selection
				if(_forcedVpId !== null && _forcedVpId !== _snapResult.viewportIndex2d)
					return;

				if(this.markupMode) { // Markup mode
					var start = gc.lineGeom.vertices[0];
					var end = gc.lineGeom.vertices[1];
					var mid = new THREE.Vector3();
					mid.addVectors(start, end);
					mid.divideScalar(2);
					var md = intersectPoint.distanceTo(mid);
					var sd = intersectPoint.distanceTo(start);
					var ed = intersectPoint.distanceTo(end);

					// Store it for snapping to parallel/perpendicular of underlying vectors
					_snapResult.geomEdge = gc.lineGeom;

					if(md < _snapResult.radius) {
						_snapResult.geomVertex = mid;
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
					} else if(sd < _snapResult.radius) {
						_snapResult.geomVertex = start;
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
					} else if(ed < _snapResult.radius) {
						_snapResult.geomVertex = end;
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
					} else {
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_EDGE;
					}

					// Circle center
					if(gc.lineGeom.vertices[0].distanceTo(gc.lineGeom.vertices[1]) < MeasureCommon.EPSILON) {
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_CIRCLE_CENTER;
					}
				} else { // Measure mode
					if(intersectPoint.distanceTo(gc.lineGeom.vertices[0]) < _snapResult.radius) {

						if(gc.lineGeom.vertices[0].distanceTo(gc.lineGeom.vertices[1]) < MeasureCommon.EPSILON) {
							_snapResult.geomType = MeasureCommon.SnapType.SNAP_CIRCLE_CENTER;
						} else {
							_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
						}

						_snapResult.geomVertex = gc.lineGeom.vertices[0];
					} else if((_options.forceSnapVertices || (intersectPoint.distanceTo(gc.lineGeom.vertices[1]) < _snapResult.radius))) {

						_snapResult.geomVertex = gc.lineGeom.vertices[1];
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
					} else {

						_snapResult.geomEdge = gc.lineGeom;
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_EDGE;
					}
				}

				_isSnapped = true;
			}
		};

		this.snappingLeaflet = function(result) {
			if(!result) {
				return;
			}

			var intersectPoint = result.intersectPoint;
			_snapResult.intersectPoint = intersectPoint;
			_snapResult.hasTopology = false;

			// Determine which one should be drawn: line, circular arc or elliptical arc
			_snapResult.radius = this.setDetectRadius(intersectPoint);
			_snapResult.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
			_snapResult.geomVertex = intersectPoint;
			_isSnapped = true;
		};

		this.snapMidpoint = function() {
			_snapResult.isMidpoint = false;

			// Snap midpoint for edge
			if(_isSnapped) {
				if(_snapResult.geomType === MeasureCommon.SnapType.SNAP_EDGE) {
					var edge = _snapResult.geomEdge;
					var p1 = edge.vertices[0];
					var p2 = edge.vertices[1];

					var midpoint = new THREE.Vector3((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, (p1.z + p2.z) / 2);

					if(_snapResult.intersectPoint.distanceTo(midpoint) < 2 * _snapResult.radius) {
						_snapResult.geomVertex = midpoint;
						_snapResult.geomType = MeasureCommon.SnapType.SNAP_MIDPOINT;
					}
				}
			}
		};

		this.setPerpendicular = function(isPerpendicular) {
			_snapResult.isPerpendicular = isPerpendicular;
		};

		this.lineStripToPieces = function(geom) {

			var vertices = geom.vertices;
			for(var i = vertices.length - 2; i > 0; i--) {
				vertices.splice(i, 0, vertices[i]);
			}
		};

		this.setDetectRadius = function(point) {

			//Notice: The pixelSize should correspond to the amount of pixels per line in idAtPixels, the shape of
			//detection area is square in idAtPixels, but circle in snapper, should make their areas match roughly.
			var pixelSize = zv.isMobileDevice() ? 50 : 10;

			var navapi = _viewer.navigation;
			var camera = navapi.getCamera();
			var position = navapi.getPosition();

			var p = point.clone();

			var distance = camera.isPerspective ? p.sub(position).length() :
				navapi.getEyeVector().length();

			var fov = navapi.getVerticalFov();
			var worldHeight = 2.0 * distance * Math.tan(THREE.Math.degToRad(fov * 0.5));

			var viewport = navapi.getScreenViewport();
			var devicePixelRatio = window.devicePixelRatio || 1;
			var radius = pixelSize * worldHeight / (viewport.height * devicePixelRatio);

			return radius;
		};

		this.handleButtonDown = function(event, button) {
			_isDragging = true;
			return false;
		};

		this.handleButtonUp = function(event, button) {
			_isDragging = false;
			return false;
		};

		this.handleMouseMove = function(event) {

			if(_isDragging)
				return false;

			this.onMouseMove({
				x: event.canvasX,
				y: event.canvasY
			});

			return false;
		};

		this.handleSingleTap = function(event) {

			return this.handleMouseMove(event);
		};

		this.handlePressHold = function(event) {

			if(zv.isMobileDevice()) {
				switch(event.type) {
					case "press":
						_isPressing = true;
						this.onMouseMove({
							x: event.canvasX,
							y: event.canvasY
						});
						break;

					case "pressup":
						this.onMouseMove({
							x: event.canvasX,
							y: event.canvasY
						});
						_isPressing = false;
						break;
				}
			}
			return false;

		};

		this.handleGesture = function(event) {
			if(zv.isMobileDevice()) {
				if(_isPressing) {
					switch(event.type) {
						case "dragstart":
							this.onMouseMove({
								x: event.canvasX,
								y: event.canvasY
							});
							break;

						case "dragmove":
							this.onMouseMove({
								x: event.canvasX,
								y: event.canvasY
							});
							break;

						case "dragend":
							this.onMouseMove({
								x: event.canvasX,
								y: event.canvasY
							});
							_isPressing = false;
							break;

						case "pinchstart":

							break;

						case "pinchmove":
							break;

						case "pinchend":
							break;
					}
				}
			}

			return false;
		};

		/**
		 * Handler to mouse move events, used to snap in markup edit mode.
		 * @private
		 */
		this.onMouseDown = function(mousePosition) {
			return this.onMouseMove(mousePosition);
		};

		/**
		 * Handler to mouse move events, used to snap in markup edit mode.
		 * @private
		 */
		this.onMouseMove = function(mousePosition) {

			this.clearSnapped();

			var result = _viewer.impl.snappingHitTest(mousePosition.x, mousePosition.y, false);
			if(!result || !result.intersectPoint)
				return false;

			// 3D Snapping
			if(result.face) {
				this.snapping3D(result);
			}
			// 2D Snapping
			else if(result.dbId || result.dbId === 0) {
				this.snapping2D(result);
			}
			// PDF - Leaflet Snapping
			else {
				this.snappingLeaflet(result);
			}

			this.snapMidpoint();

			return true;
		};
	};

	// export
	MeasureCommon.Snapper = Snapper;

})();;
(function() {
	'use strict';

	var MeasureCommon = ZhiUTech.Viewing.MeasureCommon;

	var NO_OVERLAY = 0;
	var FACE_OVERLAY = 1;
	var EDGE_OVERLAY = 2;
	var POINT_OVERLAY = 3;

	var GEOMETRIES_OVERLAY = 'MeasureTool-snapper-geometries';
	var INDICATOR_OVERLAY = 'MeasureTool-snapper-indicator';

	var _geometryLineWidth = 0.3;
	var _indicatorLineWidth = 0.2;
	var _indicatorSize = 1.2;
	var _point = null;

	var _indicatorColor = 0xff7700;
	var _geometryColor = 0x00CC00;

	// /** @constructor */
	function SnapperIndicator(viewer, snapper) {
		this.viewer = viewer;
		this.snapper = snapper;
		this.overlayType = NO_OVERLAY;
		this.previewsIntersectPoint = null;

		this.viewer.impl.createOverlayScene(GEOMETRIES_OVERLAY);
		this.viewer.impl.createOverlayScene(INDICATOR_OVERLAY);

		this.geometryMaterial = new THREE.MeshPhongMaterial({
			color: _geometryColor,
			ambient: _geometryColor,
			opacity: 0.5,
			transparent: true,
			depthTest: false,
			depthWrite: false,
			side: THREE.DoubleSide
		});

		this.indicatorMaterial = new THREE.MeshBasicMaterial({
			color: _indicatorColor,
			ambient: _indicatorColor,
			opacity: 1,
			transparent: false,
			depthTest: false,
			depthWrite: false,
			side: THREE.DoubleSide
		});
	}

	SnapperIndicator.prototype.constructor = SnapperIndicator;
	var proto = SnapperIndicator.prototype;

	proto.render = function() {

		var snapResult = this.snapper.getSnapResult();

		if(!MeasureCommon.isEqualVectors(this.previewsIntersectPoint, snapResult.intersectPoint, MeasureCommon.EPSILON)) {
			this.clearOverlay(GEOMETRIES_OVERLAY);
		}

		this.clearOverlay(INDICATOR_OVERLAY);

		if(snapResult.isEmpty())
			return;

		// if (!this.snapper.markupMode) {
		this.renderIndicator(snapResult);
		// }
		// else {
		//     this.renderGeometry(snapResult);
		// }

		this.previewsIntersectPoint = snapResult.intersectPoint.clone();
	};

	proto.removeOverlay = function(overlayName) {

		this.viewer.impl.clearOverlay(overlayName);
		this.viewer.impl.removeOverlayScene(overlayName);

	};

	proto.clearOverlay = function(overlayName) {

		this.removeOverlay(overlayName);
		this.viewer.impl.createOverlayScene(overlayName);

	};

	proto.clearOverlays = function() {

		this.removeOverlay(GEOMETRIES_OVERLAY);
		this.viewer.impl.createOverlayScene(GEOMETRIES_OVERLAY);

		this.removeOverlay(INDICATOR_OVERLAY);
		this.viewer.impl.createOverlayScene(INDICATOR_OVERLAY);

		this.previewsIntersectPoint = null;

	};

	proto.addOverlay = function(overlayName, mesh) {

		this.viewer.impl.addOverlay(overlayName, mesh);

	};

	/**
	 * Draw the planar face
	 * @param geom -Geometry which needs to be draw.
	 * @param mesh -Mesh which is loaded.
	 */
	proto.drawFace = function(geom, material, overlayName) {

		var snapperPlane = new THREE.Mesh(geom, material, true);

		if(overlayName === GEOMETRIES_OVERLAY) {
			this.overlayType = FACE_OVERLAY;
		}

		this.addOverlay(overlayName, snapperPlane);

	};

	proto.cylinderMesh = function(pointX, pointY, material, width) {

		var direction = new THREE.Vector3().subVectors(pointY, pointX);
		var orientation = new THREE.Matrix4();
		orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
		orientation.multiply(new THREE.Matrix4().set(1, 0, 0, 0,
			0, 0, 1, 0,
			0, -direction.length(), 0, 0,
			0, 0, 0, 1));

		width = width || 0.5;
		var cylinder = new THREE.CylinderGeometry(width, width, 1.0, 8, 1, true);
		var edge = new THREE.Mesh(cylinder, material);
		cylinder = null;

		edge.applyMatrix(orientation);
		edge.position.x = (pointY.x + pointX.x) / 2;
		edge.position.y = (pointY.y + pointX.y) / 2;
		edge.position.z = (pointY.z + pointX.z) / 2;
		return edge;

	};

	proto.renderGeometry = function(snapResult) {

		if(MeasureCommon.isEqualVectors(this.previewsIntersectPoint, snapResult.intersectPoint, MeasureCommon.EPSILON)) {
			return;
		}

		switch(snapResult.geomType) {
			case MeasureCommon.SnapType.SNAP_VERTEX:
				this.drawPoint(snapResult.geomVertex, this.geometryMaterial, GEOMETRIES_OVERLAY);
				break;

			case MeasureCommon.SnapType.SNAP_EDGE:
			case MeasureCommon.SnapType.SNAP_CURVEDEDGE:
			case MeasureCommon.SnapType.SNAP_CIRCULARARC:
			case MeasureCommon.SnapType.SNAP_MIDPOINT:
				this.drawLine(snapResult.geomEdge, this.geometryMaterial, _geometryLineWidth, GEOMETRIES_OVERLAY);
				break;

			case MeasureCommon.SnapType.SNAP_FACE:
			case MeasureCommon.SnapType.SNAP_CURVEDFACE:
				this.drawFace(snapResult.geomFace, this.geometryMaterial, GEOMETRIES_OVERLAY);
				break;
		}
	};

	proto.renderVertexIndicator = function(snapResult) {

		var pos = MeasureCommon.getSnapResultPosition(snapResult, this.viewer);
		var scale = this.setScale(pos);
		var length = _indicatorSize * scale;

		var rightVec = this.viewer.navigation.getCameraRightVector().multiplyScalar(length);
		var upVec = this.viewer.navigation.getCameraUpVector().multiplyScalar(length);

		var geom = new THREE.Geometry();
		var p = new THREE.Vector3();

		// Upper line
		p.addVectors(pos, rightVec);
		p.addVectors(p, upVec);
		geom.vertices[0] = p.clone();
		p.subVectors(pos, rightVec);
		p.addVectors(p, upVec);
		geom.vertices[1] = p.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

		// Bottom line
		p.addVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[0] = p.clone();
		p.subVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[1] = p.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

		// Left line
		p.subVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[0] = p.clone();
		p.subVectors(pos, rightVec);
		p.addVectors(p, upVec);
		geom.vertices[1] = p.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

		// Right line
		p.addVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[0] = p.clone();
		p.addVectors(pos, rightVec);
		p.addVectors(p, upVec);
		geom.vertices[1] = p.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

	};

	proto.renderMidpointIndicator = function(snapResult) {

		var pos = snapResult.geomVertex;
		var scale = this.setScale(pos);
		var length = _indicatorSize * scale;

		var rightVec = this.viewer.navigation.getCameraRightVector().multiplyScalar(length);
		var upVec = this.viewer.navigation.getCameraUpVector().multiplyScalar(length);

		var geom = new THREE.Geometry();
		var p = new THREE.Vector3();

		// Bottom line
		p.addVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[0] = p.clone();
		p.subVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[1] = p.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

		// Left line
		p.subVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[0] = p.clone();
		p.addVectors(pos, upVec);
		geom.vertices[1] = p.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

		// Right line
		p.addVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[0] = p.clone();
		p.addVectors(pos, upVec);
		geom.vertices[1] = p.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

	};

	proto.renderEdgeIndicator = function(snapResult) {

		var pos = MeasureCommon.getSnapResultPosition(snapResult, this.viewer);
		var scale = this.setScale(pos);
		var length = _indicatorSize * scale;

		var rightVec = this.viewer.navigation.getCameraRightVector().multiplyScalar(length);
		var upVec = this.viewer.navigation.getCameraUpVector().multiplyScalar(length);

		var geom = new THREE.Geometry();
		var p = new THREE.Vector3();

		// Bottom line
		p.addVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[0] = p.clone();
		geom.vertices[1] = pos.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

		// Left line
		p.subVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[0] = p.clone();
		geom.vertices[1] = pos.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

		// Right line
		p.addVectors(pos, upVec);
		geom.vertices[0] = p.clone();
		geom.vertices[1] = pos.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

	};

	proto.renderCircleIndicator = function(snapResult) {

		var pos = MeasureCommon.getSnapResultPosition(snapResult, this.viewer);
		this.drawCircle(pos, this.indicatorMaterial, INDICATOR_OVERLAY);

	};

	proto.renderPerpendicular = function(snapResult) {

		var pos = MeasureCommon.getSnapResultPosition(snapResult, this.viewer);
		var scale = this.setScale(pos);
		var length = _indicatorSize * scale;

		var rightVec = this.viewer.navigation.getCameraRightVector().multiplyScalar(length);
		var upVec = this.viewer.navigation.getCameraUpVector().multiplyScalar(length);

		var geom = new THREE.Geometry();
		var p = new THREE.Vector3();

		// Upper line
		geom.vertices[0] = pos.clone();
		p.subVectors(pos, rightVec);
		geom.vertices[1] = p.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

		// Bottom line
		p.addVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[0] = p.clone();
		p.subVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[1] = p.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

		// Left line
		p.subVectors(pos, rightVec);
		p.subVectors(p, upVec);
		geom.vertices[0] = p.clone();
		p.subVectors(pos, rightVec);
		p.addVectors(p, upVec);
		geom.vertices[1] = p.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

		// Right line
		geom.vertices[0] = pos.clone();
		p.subVectors(pos, upVec);
		geom.vertices[1] = p.clone();
		this.drawLine(geom, this.indicatorMaterial, _indicatorLineWidth, INDICATOR_OVERLAY);

	};

	proto.renderIndicator = function(snapResult) {

		if(snapResult.isPerpendicular) {
			this.renderPerpendicular(snapResult);
			return;
		}

		switch(snapResult.geomType) {
			case MeasureCommon.SnapType.SNAP_VERTEX:
				this.renderVertexIndicator(snapResult);
				break;

			case MeasureCommon.SnapType.SNAP_MIDPOINT:
				this.renderMidpointIndicator(snapResult);
				break;

			case MeasureCommon.SnapType.SNAP_CIRCLE_CENTER:
				this.renderCircleIndicator(snapResult);
				break;

			case MeasureCommon.SnapType.SNAP_EDGE:
			case MeasureCommon.SnapType.SNAP_CURVEDEDGE:
				this.renderEdgeIndicator(snapResult);
				break;

			case MeasureCommon.SnapType.SNAP_CIRCULARARC:
				if(this.viewer.model.is2d()) {
					this.renderVertexIndicator(snapResult);
				} else {
					this.renderCircleIndicator(snapResult);
				}
				break;

			case MeasureCommon.SnapType.SNAP_FACE:
			case MeasureCommon.SnapType.SNAP_CURVEDFACE:
				this.renderVertexIndicator(snapResult);
				break;
		}
	};

	proto.drawLine = function(geom, material, width, overlayName) {

		// Line Pieces
		if(overlayName === GEOMETRIES_OVERLAY) {
			this.overlayType = EDGE_OVERLAY;
		}

		for(var i = 0; i < geom.vertices.length; i += 2) {
			var cylinder = this.cylinderMesh(geom.vertices[i], geom.vertices[i + 1], material, width);
			this.setEdgeScale(cylinder);
			this.addOverlay(overlayName, cylinder);
		}
	};

	proto.drawPoint = function(point, material, overlayName) {

		// Because every point is snappable in PDFs, don't display the green dot for PDFs.
		if(this.viewer.model.getData().isLeaflet) {
			return;
		}

		if(!_point)
			_point = new THREE.SphereGeometry(1.0);

		var pointMesh = new THREE.Mesh(_point, material);
		pointMesh.position.set(point.x, point.y, point.z);

		this.setPointScale(pointMesh);

		if(overlayName === GEOMETRIES_OVERLAY) {
			this.overlayType = POINT_OVERLAY;
		}

		this.addOverlay(overlayName, pointMesh);

	};

	proto.drawCircle = function(point, material, overlayName) {

		var torus = new THREE.TorusGeometry(_indicatorSize, _indicatorLineWidth, 2, 20);
		var torusMesh = new THREE.Mesh(torus, material);
		torusMesh.lookAt(this.viewer.navigation.getEyeVector().normalize());
		torus = null;

		torusMesh.position.set(point.x, point.y, point.z);

		this.setCircleScale(torusMesh);

		this.addOverlay(overlayName, torusMesh);

	};

	proto.setScale = function(point) {

		var pixelSize = 5;

		var navapi = this.viewer.navigation;
		var camera = navapi.getCamera();
		var position = navapi.getPosition();

		var p = point.clone();

		var distance = camera.isPerspective ? p.sub(position).length() :
			navapi.getEyeVector().length();

		var fov = navapi.getVerticalFov();
		var worldHeight = 2.0 * distance * Math.tan(THREE.Math.degToRad(fov * 0.5));

		var viewport = navapi.getScreenViewport();
		var scale = pixelSize * worldHeight / viewport.height;

		return scale;

	};

	proto.setPointScale = function(pointMesh) {

		var scale = this.setScale(pointMesh.position);
		pointMesh.scale.x = scale;
		pointMesh.scale.y = scale;
		pointMesh.scale.z = scale;

	};

	proto.setCircleScale = function(torusMesh) {

		var scale = this.setScale(torusMesh.position);
		torusMesh.scale.x = scale;
		torusMesh.scale.y = scale;
	};

	proto.setEdgeScale = function(cylinderMesh) {

		var scale = this.setScale(cylinderMesh.position);
		cylinderMesh.scale.x = scale;
		cylinderMesh.scale.z = scale;
	};

	proto.updatePointScale = function(overlayName) {

		if(this.overlayType != POINT_OVERLAY)
			return;

		var overlay = this.viewer.impl.overlayScenes[overlayName];
		if(overlay) {
			var scene = overlay.scene;

			for(var i = 0; i < scene.children.length; i++) {
				var pointMesh = scene.children[i];
				if(pointMesh) {

					this.setPointScale(pointMesh);
				}
			}
		}
	};

	proto.updateEdgeScale = function(overlayName) {

		if(this.overlayType != EDGE_OVERLAY)
			return;

		var overlay = this.viewer.impl.overlayScenes[overlayName];
		if(overlay) {
			var scene = overlay.scene;

			for(var i = 0; i < scene.children.length; i++) {
				var cylinderMesh = scene.children[i];
				if(cylinderMesh) {

					this.setEdgeScale(cylinderMesh);
				}
			}
		}
	};

	proto.onCameraChange = function() {

		this.updatePointScale(GEOMETRIES_OVERLAY);
		this.updateEdgeScale(GEOMETRIES_OVERLAY);

		// if (!this.snapper.markupMode) {
		this.render();
		// }
	};

	proto.destroy = function() {

		this.removeOverlay(GEOMETRIES_OVERLAY);
		this.removeOverlay(INDICATOR_OVERLAY);

		if(_point) {
			_point.dispose();
			_point = null;
		}
	};

	MeasureCommon.SnapperIndicator = SnapperIndicator;

})();;