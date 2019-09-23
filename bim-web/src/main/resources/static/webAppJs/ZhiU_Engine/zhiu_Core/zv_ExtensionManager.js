
(function() {

	"use strict";

	var avu = ZhiUTech.Viewing.UI;
	var zvp = ZhiUTech.Viewing.Private;

	/**
	 * Constructs a ViewerObjectContextMenu object.
	 * @param {Viewer} viewer
	 * @constructor
	 */
	function ViewerObjectContextMenu(viewer) {
		avu.ObjectContextMenu.call(this, viewer);
	}

	ViewerObjectContextMenu.prototype = Object.create(avu.ObjectContextMenu.prototype);
	ViewerObjectContextMenu.prototype.constructor = ViewerObjectContextMenu;

	/**
	 * Builds the context menu to be displayed.
	 * @override
	 * @param {Event} event - Browser event that requested the context menu
	 * @param {Object} status - Information about nodes: numSelected, hasSelected, hasVisible, hasHidden.
	 * @returns {?Array} An array of menu items.
	 */
	ViewerObjectContextMenu.prototype.buildMenu = function(event, status) {
		var that = this,
			menu = [],
			nzv = this.viewer.navigation,
			is2d = this.viewer.model.is2d();

		// the title strings here are added to the viewer.loc.json for localization
		if(status.hasSelected) {
			menu.push({
				title: "Isolate",
				target: function() {
					var selection = that.viewer.getAggregateSelection();
					that.viewer.impl.visibilityManager.aggregateIsolate(selection);
					that.viewer.clearSelection();
					zvp.logger.track({
						name: 'isolate_count',
						aggregate: 'count'
					});
				}
			});
			if(status.hasVisible) {
				menu.push({
					title: "Hide Selected",
					target: function() {
                        // region LJason 新
                        var visMan = that.viewer.impl.visibilityManager;
                        var targets=that.viewer.getAggregateSelection();
                        for (let i = 0; i < targets.length; i++) {
                            visMan.hide(targets[i].selection, targets[i].model);
                        }
                        // endregion
					}
				});
			}
			if(status.hasHidden) {
				menu.push({
					title: "Show Selected",
					target: function() {
						// This is such a weird use case. Users can't select hidden nodes.
						// For this to work, selection must have been done through code.
						var selected = that.viewer.getSelection();
						that.viewer.clearSelection();
						that.viewer.show(selected);
					}
				});
			}
		}

		if(is2d) {
			menu.push({
				title: "Show All Layers",
				target: function() {
					that.viewer.setLayerVisible(null, true);
				}
			});
		}

		menu.push({
			title: "Show All Objects",
			target: function() {
				that.viewer.showAll();
				zvp.logger.track({
					name: 'showall',
					aggregate: 'count'
				});
			}
		});

		// Fit-to-view only work with selections from one model.
		var aggregateSelection = that.viewer.getAggregateSelection();
		if(!is2d && aggregateSelection.length === 1 && nzv.isActionEnabled('gotoview')) {
			menu.push({
				title: "Focus",
				target: function() {
					aggregateSelection = that.viewer.getAggregateSelection(); // Get the aggregate selection again
					if(aggregateSelection.length > 0) {
						var singleRes = aggregateSelection[0];
						that.viewer.fitToView(singleRes.selection, singleRes.model);
					} else if(aggregateSelection.length === 0) {
						that.viewer.fitToView(); // Fit to whole model, the first one loaded.
					}
					zvp.logger.track({
						name: 'fittoview',
						aggregate: 'count'
					});
				}
			});
		}

		if(status.hasSelected) {
			menu.push({
				title: "Clear Selection",
				target: function() {
					that.viewer.clearSelection();
					zvp.logger.track({
						name: 'clearselection',
						aggregate: 'count'
					});
				}
			});
		}

		return menu;
	};

	ZhiUTech.Viewing.Extensions.ViewerObjectContextMenu = ViewerObjectContextMenu;

})();;
(function() {

	"use strict";

	/**
	 * Base class for extending the functionality of the viewer.
	 *
	 * Derive from this class and implement the load and optionally the unload methods.
	 *
	 * Register this extension by calling:
	 * `ZhiUTech.Viewing.theExtensionManager.registerExtension('your_extension_id', ZhiUTech.Viewing.Extensions.<your_extension_class>); `
	 *
	 * Extensions are registered and loaded automatically by adding the Extension ID to the
	 * config object passed to the viewer constructor.
	 *
	 * An example Extension is available at derivativeservice/v2/viewers/SampleExtension/, and includes
	 * these files:
	 * * SampleExtension.js
	 * * SampleLayersPanel.js
	 * * SampleModelStructurePanel.js
	 * * SamplePropertyPanel.js
	 * * SampleLayersPanel.css
	 * * SampleModelStructurePanel.css
	 * * SamplePropertyPanel.css
	 *
	 * @constructor
	 * @alias ZhiUTech.Viewing.Extension
	 * @param {ZhiUTech.Viewing.Viewer3D} viewer - The viewer to be extended.
	 * @param {object} options - An optional dictionary of options for this extension.
	 * @category Core
	 */
	var Extension = function(viewer, options) {
		this.viewer = viewer;
		this.options = options;
		this.id = ''; // Populated by theExtensionManager
		this.modes = [];
		this.mode = '';
		this.name = '';
		this.activeStatus = false;
	};

	// Extension.prototype = Object.create(ZhiUTech.Viewing.ExtensionMixin.prototype);
	// Extension.prototype.constructor = Extension;

	/**
	 * Override the load method to add functionality to the viewer.
	 * Use the Viewer's APIs to add/modify/replace/delete UI, register event listeners, etc.
	 * @returns {boolean} True if the load was successful.
	 */
	Extension.prototype.load = function() {
		return true;
	};

	/**
	 * Override the unload method to perform some cleanup of operations that were done in load.
	 * @returns {boolean} True if the unload was successful.
	 */
	Extension.prototype.unload = function() {
		return true;
	};

	/**
	 * Override the activate method to enable the functionality of the extension.
	 * @param [mode] - An optional mode that indicates a different way the extension can function.
	 * @see {@link ZhiUTech.Viewing.Extension#getModes }
	 * @returns {boolean} True if the extension activation was successful.
	 */

	Extension.prototype.activate = function(mode) {
		return true;
	};

	/**
	 * Override the deactivate method to disable the functionality of the extension.
	 * @returns {boolean} True if the extension deactivation was successful.
	 */

	Extension.prototype.deactivate = function() {
		return true;
	};

	/**
	 * Gets the name of the extension.
	 * @returns {string} Returns the name of the extension.
	 */

	Extension.prototype.getName = function() {
		return this.name;
	};

	/**
	 * Gets an array of modes available for the extension.
	 * @returns {Array} Returns an array of modes.
	 */

	Extension.prototype.getModes = function() {
		return this.modes;
	};

	/**
	 * Check if the extension is active and optionally check if the specified mode is active for that extension.
	 * @param mode - An optional mode that indicates a different way the extension can function.
	 * @see {@link ZhiUTech.Viewing.Extension#getModes }
	 * @returns {boolean} Default - True if the extension is active.
	 * When optional argument mode is specified, returns true if both extension and the mode are active, false otherwise.
	 */

	Extension.prototype.isActive = function(mode) {
		if(mode) {
			return this.activeStatus && this.mode === mode;
		} else {
			return this.activeStatus;
		}
	};

	/**
	 * Gets the extension state as a plain object. Intended to be called when viewer state is requested.
	 * @param {object} viewerState - Object to inject extension values.
	 * @virtual
	 */
	Extension.prototype.getState = function(viewerState) {};

	/**
	 * Restores the extension state from a given object.
	 * @param {object} viewerState - Viewer state.
	 * @param {boolean} immediate - Whether the new view is applied with (true) or without transition (false).
	 * @returns {boolean} True if restore operation was successful.
	 * @virtual
	 */
	Extension.prototype.restoreState = function(viewerState, immediate) {
		return true;
	};

	/**
	 * Override the set of localized strings
	 * @param {object} locales The set of localized strings keyed by language
	 * @returns {boolean} True if localization was successfully updated
	 */
	Extension.prototype.extendLocalization = function(locales) {
		return ZhiUTech.Viewing.Private.extendLocalization(locales);
	};

	/**
	 * Returns an object that persists throughout an extension's unload->load
	 * operation sequence. Cache object is kept at ViewingApplication level.
	 * Cache object lives only in RAM, there is no localStorage persistence.
	 * @returns {object} The cache object for a given extension.
	 */
	Extension.prototype.getCache = function() {
		if(!this.viewer.extensionCache) {
			// Create one at runtime. It won't be useful, but it
			// will make the object easier to use.
			this.viewer.extensionCache = {};
			ZhiUTech.Viewing.Private.logger.warn('Extension cache runtime creation; missing ViewingApplication context.');
		}
		var cache = this.viewer.extensionCache[this.id];
		if(!cache) {
			cache = this.viewer.extensionCache[this.id] = {};
		}
		return cache;
	};

	ZhiUTech.Viewing.Extension = Extension;

})();;
(function() {

	"use strict";

	var zv = ZhiUTech.Viewing,
		zvp = zv.Private;

	/**
	 * The ExtensionManager manages a set of extensions available to the viewer.
	 * Register, retrieve, and unregister your extension using the singleton theExtensionManager.
	 *
	 * You can load/unload your registered extension into a Viewer by calling
	 * {@link ZhiUTech.Viewing.Viewer#loadExtension|viewer.loadExtension(id, options)} and
	 * {@link ZhiUTech.Viewing.Viewer#unloadExtension|viewer.unloadExtension(id)}, respectively.
	 * @constructor
	 */
	var ExtensionManager = function() {
		var extensions = {}; // Registered extenesions available in-memory
		var extensionsAsync = {}; // Extensions that need to get downloaded

		/**
		 * Registers a new extension with the given id.
		 *
		 * @param {string} extensionId - The string id of the extension.
		 * @param {Extension} extension - The Extension-derived class representing the extension.
		 * @returns {boolean} - True if the extension was successfully registered.
		 */
		function registerExtension(extensionId, extension) {
			if(extensions[extensionId]) {
				return false;
			}
			extensions[extensionId] = extension;
			return true;
		}

		/**
		 * Returns the class representing the extension with the given id.
		 *
		 * @param {string} extensionId - The string id of the extension.
		 * @returns {!Extension} - The Extension-derived class if one was registered; null otherwise.
		 */
		function getExtension(extensionId) {
			if(extensions.hasOwnProperty(extensionId)) {
				return extensions[extensionId];
			}
			return null;
		}

		/**
		 * Unregisters an existing extension with the given id.
		 *
		 * @param {string} extensionId - The string id of the extension.
		 * @returns {boolean} - True if the extension was successfully unregistered.
		 */
		function unregisterExtension(extensionId) {
			if(extensions.hasOwnProperty(extensionId)) {
				delete extensions[extensionId];
				return true;
			}
			return false;
		}

		/**
		 * Registers an extension that needs to be downloaded before using it.
		 * The Viewer ships with some extensions that are not bundled, but can be runtime-fetched.
		 *
		 * @param {string} extensionId - The string id of the extension.
		 * @param {string} urlPath - The url from where it needs to be pulled from. Can be a relative or an absolute path.
		 * @returns {boolean} - True if the extension was successfully registered.
		 */
		function registerExternalExtension(extensionId, urlPath) {
			if(extensionsAsync[extensionId]) {
				return false;
			}
			extensionsAsync[extensionId] = urlPath;
			return true;
		}

		/**
		 * Returns the url path from where to download the extension; null if not registered through registerExternalExtension().
		 *
		 * @param {string} extensionId - The string id of the extension.
		 * @returns {url|null} - The url from where to download the extension; null if not download is needed.
		 */
		function getExternalPath(extensionId) {
			if(extensionsAsync.hasOwnProperty(extensionId)) {
				return extensionsAsync[extensionId];
			}
			return null;
		}

		function unregisterExternalExtension(extensionId) {
			if(extensionsAsync.hasOwnProperty(extensionId)) {
				delete extensionsAsync[extensionId];
				return true;
			}
			return false;
		}

		/**
		 * Gets a list of all the extensions that are available for usage.
		 * Some are already available in memory, while others may require
		 * an additional file to be downloaded prior to its usage.
		 */
		function getRegisteredExtensions() {
			var extensionId;
			var ret = [];
			// in-memory extensions (might have been downloaded)
			for(extensionId in extensions) {
				if(extensions.hasOwnProperty(extensionId)) {
					ret.push({
						id: extensionId,
						inMemory: true,
						isAsync: (extensionId in extensionsAsync)
					});
				}
			}
			// Async extensions (some may already be in memory)
			for(extensionId in extensionsAsync) {
				if(extensionsAsync.hasOwnProperty(extensionId) && !(extensionId in extensions)) {
					ret.push({
						id: extensionId,
						inMemory: false,
						isAsync: true
					});
				}
			}
			return ret;
		}

		/**
		 * Iterates over each registered Extension class and invokes
		 * static method 'populateDefaultOptions' if available.
		 * 
		 * The objective is to gather all supported configuration options
		 * across all extensions.
		 */
		function popuplateOptions(options) {
			for(var ext in extensions) {
				if(extensions.hasOwnProperty(ext) && extensions[ext].hasOwnProperty('populateDefaultOptions')) {
					extensions[ext].populateDefaultOptions(options);
				}
			}
		}

		return {
			registerExtension: registerExtension,
			getExtension: getExtension,
			unregisterExtension: unregisterExtension,
			registerExternalExtension: registerExternalExtension,
			getExternalPath: getExternalPath,
			unregisterExternalExtension: unregisterExternalExtension,
			getRegisteredExtensions: getRegisteredExtensions,
			popuplateOptions: popuplateOptions
		};
	};

	var theExtensionManager = new ExtensionManager();

	/***
	 * Augments a class by extension load/unload functionality.
	 */
	var ExtensionMixin = function() {};

	ExtensionMixin.prototype = {

		/**
		 * Loads the extension with the given id and options.
		 * For internal use only.
		 *
		 * @param {string} extensionId - The string id of the extension.
		 * @param {Object} options - An optional dictionary of options.
		 *
		 * @returns {Promise} - Since 2.15, resolves with the extension requested. Before it would return true if the extension gets loaded.
		 */
		loadExtension: function(extensionId, options) {

			if(!this.loadedExtensions)
				this.loadedExtensions = {};

			// is it already loaded?
			var extension = this.getExtension(extensionId);
			if(extension) {
				return Promise.resolve(extension);
			}

			// Is the extension registered?
			var EXTENSION_CLASS = theExtensionManager.getExtension(extensionId);
			if(!EXTENSION_CLASS) {

				// Is it an extension that needs to be downloaded?
				var urlPath = theExtensionManager.getExternalPath(extensionId);
				if(urlPath) {
					return this.loadExtensionAsync(extensionId, urlPath, options);
				}

				// else...
				return Promise.reject('Extension not found: ' + extensionId + '. Has it been registered(1)?');
			}

			// Extension has been registered locally.
			return this.loadExtensionLocal(extensionId, options);
		},

		/**
		 * Returns the loaded extension.
		 * @param {string} extensionId - The string id of the extension.
		 * @returns {?Object} - Extension.
		 */
		getExtension: function(extensionId) {
			return(this.loadedExtensions && extensionId in this.loadedExtensions) ? this.loadedExtensions[extensionId] : null;
		},

		/**
		 * Unloads the extension with the given id.
		 * For internal use only.
		 *
		 * @param {string} extensionId - The string id of the extension.
		 * @returns {boolean} - True if the extension was successfully unloaded.
		 */
		unloadExtension: function(extensionId) {
			var success = false;
			var ext = this.getExtension(extensionId);
			if(ext) {
				success = ext.unload();
				zvp.logger.info('Extension unloaded: ' + extensionId);
				delete this.loadedExtensions[extensionId];
				this.dispatchEvent({
					type: zv.EXTENSION_UNLOADED_EVENT,
					extensionId: extensionId
				});
			} else {
				zvp.logger.warn('Extension not found: ' + extensionId);
			}
			return success;
		},

		/**
		 * Loads the extension with the given id and options.
		 * For internal use only.
		 * 
		 * Available from version 2.15
		 *
		 * @param {string} extensionId - The string id of the extension.
		 * @param {Object} options - An optional dictionary of options.
		 *
		 * @returns {Promise} - Resolves with the extension requested.
		 */
		loadExtensionLocal: function(extensionId, options) {

			var EXTENSION_CLASS = theExtensionManager.getExtension(extensionId);
			if(!EXTENSION_CLASS) {
				return Promise.reject('Extension not found: ' + extensionId + '. Has it been registered(2)?');
			}

			var extension = new EXTENSION_CLASS(this, options);
			extension.id = extensionId;
			var success = extension.load();
			if(success) {
				this.loadedExtensions[extensionId] = extension;
				zvp.logger.info('Extension loaded: ' + extensionId);
				this.dispatchEvent({
					type: zv.EXTENSION_LOADED_EVENT,
					extensionId: extensionId
				});
				return Promise.resolve(extension);
			}

			// else
			return Promise.reject('Extension failed to .load() : ' + extensionId);
		},

		/**
		 * Loads an extension JavaScript file from a URL. It will download the file, parse it and
		 * then invoke loadExtension().  Calling this function a second time will not download the
		 * file again.
		 * 
		 * Available from version 2.15
		 * 
		 * @example
		 *      viewer.loadExtensionAsync(
		 *          'MyExtensionId', 
		 *          'http://my.site.com/path/MyExtension.js', 
		 *          {}
		 *      ).then(function(ext){
		 *          ext.doSomething();
		 *      }).catch(function(error){
		 *          console.error(error);
		 *      });
		 * 
		 * @param {string} extensionId - The string id of the extension.
		 * @param {string} url - The url where the extension's JavaScript file is hosted. Can be a relative or absolute path.
		 * @param {Object} options - An optional dictionary of options, same as in loadExtension().
		 * 
		 * @returns {promise} - That resolves with the extension object.
		 */
		loadExtensionAsync: function(extensionName, url, options) {
			var that = this;
			return new Promise(function(resolve, reject) {
				zvp.loadDependency(extensionName, url,
					function() { // onSuccess
						that.loadExtension(extensionName, options);
						var ext = that.getExtension(extensionName);
						if(ext) {
							resolve(ext);
						} else {
							reject('Failed to getExtension(' + extensionName + ')');
						}
					},
					function() { // onError
						reject('Failed to loadExtensionAsync: (' + extensionName + ') from: (' + url + ')');
					}
				);
			});
		},

		apply: function(object) {

			var me = ExtensionMixin.prototype;

			object.loadExtension = me.loadExtension;
			object.getExtension = me.getExtension;
			object.unloadExtension = me.unloadExtension;
			object.loadExtensionLocal = me.loadExtensionLocal;
			object.loadExtensionAsync = me.loadExtensionAsync;

		}

	};

	ZhiUTech.Viewing.theExtensionManager = theExtensionManager;
	ZhiUTech.Viewing.ExtensionMixin = ExtensionMixin;

})();;