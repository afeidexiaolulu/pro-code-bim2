
(function() {
	'use strict';

	/**
     * These are extensions that get built into their own bundles,
     * which are not part of the main zuv3D.js bundle.
	 */

	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.Viewing.Wireframes', 'extensions/Wireframes/Wireframes.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.Viewing.MarkupsCore', 'extensions/Markups/Markups.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.Viewing.MarkupsGui', 'extensions/Markups/MarkupsGui.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.Billboard', 'extensions/Billboard/Billboard.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.BillboardGui', 'extensions/Billboard/Billboard.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.Viewing.Comments', 'extensions/Comments/Comments.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.InViewerSearch', 'extensions/InViewerSearch/InViewerSearch.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.Viewing.WebVR', 'extensions/WebVR/WebVR.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.Viewing.MemoryManager', 'extensions/MemoryManager/MemoryManager.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.Viewing.MemoryManager', 'extensions/MemoryManager/MemoryManager.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.Beeline', 'extensions/Beeline/Beeline.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.FirstPerson', 'extensions/FirstPerson/FirstPerson.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.BimWalk', 'extensions/BimWalk/BimWalk.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.Viewing.ScalarisSimulation', 'extensions/ScalarisSimulation/ScalarisSimulation.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.Debug', 'extensions/Debug/Debug.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.ModelStructure', 'extensions/ModelStructure/ModelStructure.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.LayerManager', 'extensions/LayerManager/LayerManager.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.ViewerSettings', 'extensions/ViewerSettings/ViewerSettings.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.PropertiesManager', 'extensions/PropertiesManager/PropertiesManager.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.FullScreen', 'extensions/FullScreen/FullScreen.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.Explode', 'extensions/Explode/Explode.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.Section', 'extensions/Section/Section.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.Measure', 'extensions/Measure/Measure.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.Hyperlink', 'extensions/Hyperlink/Hyperlink.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.Viewing.PixelCompare', 'extensions/PixelCompare/PixelCompare.js');
	ZhiUTech.Viewing.theExtensionManager.registerExternalExtension('ZhiUTech.Moldflow', 'extensions/Moldflow/Moldflow.js');
	ZhiUTech.Viewing.theExtensionManager.registerExtension('ZhiUTech.Markup3D', 'extensions/Viewing.Extension.Markup3D/Markup3D/Markup3D.js');
	

	// When adding a file here, you'll have to update the following files.
	//
	// If the extension is JS only, then look only at the files that say JS.
	// Similar treatment if the extension has a CSS file that get downloaded with `zvp.injectCSS()`
	//
	// concat.js    ------------------- JS and CSS
	// uglify.json -------------------- only JS 
	// cssmin.json -------------------- only CSS
	// javascript.js ------------------ only JS
	// Gruntfile.js ------------------- JS and CSS
	// string-replace.json ------------ JS and CSS
	//
	//

})();;
(function() {

	'use strict';

	var ns = ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.CAM360');

	function CAM360Extension(viewer, options) {
		ZhiUTech.Viewing.Extension.call(this, viewer, options);
		this.name = 'cam360';
	}

	CAM360Extension.prototype = Object.create(ZhiUTech.Viewing.Extension.prototype);
	CAM360Extension.prototype.constructor = CAM360Extension;

	CAM360Extension.prototype.load = function() {
		var viewer = this.viewer;

		var modelStructurePanel = new ns.CAMModelStructurePanel(this.viewer, 'CAM Model Structure Loading', {});
		viewer.setModelStructurePanel(modelStructurePanel);

		// Change these viewer settings for CAM files.
		//
		viewer.hideLines(false);
		viewer.setGhosting(false);
		viewer.setQualityLevel(false, true);

		// Wait till the geometry has loaded before changing the light preset, to ensure that
		// our light preset is the last applied.
		//
		function setLightPresetToSimpleGrey() {
			viewer.impl.setLightPreset(0, true);
			viewer.removeEventListener(ZhiUTech.Viewing.GEOMETRY_LOADED_EVENT, setLightPresetToSimpleGrey);
		}
		viewer.addEventListener(ZhiUTech.Viewing.GEOMETRY_LOADED_EVENT, setLightPresetToSimpleGrey);

		return true;
	};

	CAM360Extension.prototype.unload = function() {
		// Remove the panel from the viewer.
		//
		this.viewer.setModelStructurePanel(null);
	};

	CAM360Extension.prototype.activate = function() {
		if(!this.activeStatus) {
			this.viewer.showModelStructurePanel(true);
			this.activeStatus = true;
		}
		return true;
	};

	CAM360Extension.prototype.deactivate = function() {
		if(this.activeStatus) {
			this.viewer.showModelStructurePanel(false);
			this.activeStatus = false;
		}
		return true;
	};

	ns.CAM360Extension = CAM360Extension;

	ZhiUTech.Viewing.theExtensionManager.registerExtension('ZhiUTech.CAM360', ns.CAM360Extension);

})();;
(function() {

	'use strict';

	var ns = ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.CAM360');
	var ave = ZhiUTech.Viewing.Extensions;

	/**
	 * This extension supports only 1 model.
	 * 
	 * @param {*} viewer 
	 * @param {*} title 
	 * @param {*} options 
	 */
	function CAMModelStructurePanel(viewer, title, options) {
		ave.ViewerModelStructurePanel.call(this, viewer, title, options);
		this.viewer = viewer;

		this.delegate = null;
		this.instanceTree = null;
		this.model = null;

		this.camNodes = [];
		this.camModelNodes = [];
		this.camSetupNodes = [];
		this.camStockNodes = [];
		this.camOperationNodes = [];
		this.camToolNodes = [];
		this.camFolderNodes = [];
	}

	CAMModelStructurePanel.prototype = Object.create(ave.ViewerModelStructurePanel.prototype);
	CAMModelStructurePanel.prototype.constructor = CAMModelStructurePanel;

	CAMModelStructurePanel.prototype.sortCamNodes = function(instanceTree, onCamNodesSorted) {
		var that = this;

		// Find all of the nodes to process.
		//
		var nodeIdsToProcess = [];

		instanceTree.enumNodeChildren(instanceTree.getRootId(), function(dbId) {
			nodeIdsToProcess.push(dbId);
		}, true);

		nodeIdsToProcess.shift(); //take out the root

		function processNodeId(node, onNodeProcessed) {

			// Gets the p
			function getPropertyValue(properties, propertyName) {
				for(var i = 0; i < properties.length; ++i) {
					var property = properties[i];
					if(property.displayName === propertyName) {
						return property.displayValue;
					}
				}
				return null;
			}

			function onPropertiesRetrieved(result) {
				// Sort the nodes into the proper containers here.
				//
				var name = getPropertyValue(result.properties, '9429B915-D020-4CEB-971B-6ADD0A5D4BFA');

				if(name) {
					if(name == 'CAM_Setup') {
						that.camSetupNodes.push(node);
					} else if(name == 'CAM_Operation') {
						that.camOperationNodes.push(node);
					} else if(name === 'CAM_Tool') { // Check this.
						that.camToolNodes.push(node);
					} else if(name === 'CAM_Stock') { // Check this.
						that.camStockNodes.push(node);
					} else if(name == 'CAM_Folder') {
						that.camFolderNodes.push(node);
					}

					that.camNodes.push(node);

				} else {
					that.camModelNodes.push(node);
				}

				onNodeProcessed();
			}

			function onError(status, message, data) {
				onNodeProcessed();
			}

			that.viewer.getProperties(node, onPropertiesRetrieved, onError);

		}

		// Process the nodes one by one.
		//
		function processNext() {
			if(nodeIdsToProcess.length > 0) {
				processNodeId(nodeIdsToProcess.shift(), processNext);
			} else {
				// No more nodes to process - call the provided callback.
				//
				onCamNodesSorted();
			}
		}
		processNext();
	};

	CAMModelStructurePanel.prototype.addModel = function(model) {
		this.model = model;
		this.setVisible(true);
		ave.ViewerModelStructurePanel.prototype.addModel.call(this, model);
	}

	CAMModelStructurePanel.prototype.setInstanceTree = function(delegate, instanceTree) {
		ave.ViewerModelStructurePanel.prototype.setInstanceTree.call(this, delegate, instanceTree);

		if(!instanceTree)
			return;

		// Keep a reference to a delegate because we only support single model.
		this.delegate = delegate;
		this.instanceTree = instanceTree;

		// Sort all of the cam nodes.  Once done, call setModel on the base class to build the UI, and
		// set the visibilities properly.
		var that = this;
		that.sortCamNodes(instanceTree, function() {
			that.SetCAMNodeVisible(false);
			that.setVisible(true);

			// expand the setup node, and resize to fit.
			that.ExpandSetupNodes();
			that.resizeToContent();
		});
	};

	CAMModelStructurePanel.prototype.initialize = function() {
		ave.ViewerModelStructurePanel.prototype.initialize.call(this);

		var that = this;

		function onGeometryLoaded(e) {
			that.SetCAMNodeVisible(false);
			that.removeEventListener(that.viewer, ZhiUTech.Viewing.GEOMETRY_LOADED_EVENT, onGeometryLoaded);
		}

		if(!this.viewer.model || !this.viewer.model.isLoadDone()) {
			that.addEventListener(that.viewer, ZhiUTech.Viewing.GEOMETRY_LOADED_EVENT, onGeometryLoaded);
		}

		that.addEventListener(that.viewer, ZhiUTech.Viewing.SHOW_EVENT,
			function(e) {
				var nodes = e.nodeIdArray;
				if(nodes) {
					for(var k = 0; k < nodes.length; k++)
						that.setCamNodeVisibility(nodes[k]);
				}
			});

		that.addEventListener(that.viewer, ZhiUTech.Viewing.SELECTION_CHANGED_EVENT,
			function(e) {
				var nodes = e.nodeArray;
				if(nodes) {
					for(var k = 0; k < nodes.length; k++)
						that.HideHightlightCAMNode(nodes[k]);
				}
			});

		that.addEventListener(that.viewer, ZhiUTech.Viewing.ISOLATE_EVENT,
			function(e) {
				var nodes = e.nodeIdArray;
				if(nodes) {
					// show all
					if(nodes.length == 0) {
						that.SetModelVisible();
						that.SetCAMNodeVisible(true);
					} else {
						for(var k = 0; k < nodes.length; k++)
							that.setCamNodeVisibility(nodes[k]);
					}
				}
			});
	};

	CAMModelStructurePanel.prototype.IsCAMNode = function(node) {
		return this.camNodes.indexOf(node) !== -1;
	};

	CAMModelStructurePanel.prototype.IsCAMSetupNode = function(node) {
		return this.camSetupNodes.indexOf(node) !== -1;
	};

	CAMModelStructurePanel.prototype.IsCAMStockNode = function(node) {
		return this.camStockNodes.indexOf(node) !== -1;
	};

	CAMModelStructurePanel.prototype.IsCAMToolNode = function(node) {
		return this.camToolNodes.indexOf(node) !== -1;
	};

	CAMModelStructurePanel.prototype.IsCAMOperationNode = function(node) {
		return this.camOperationNodes.indexOf(node) !== -1;
	};

	CAMModelStructurePanel.prototype.IsCAMFolderNode = function(node) {
		return this.camFolderNodes.indexOf(node) !== -1;
	};

	CAMModelStructurePanel.prototype.shouldInclude = function(node) {
		// Exclude all stock nodes.
		//
		return !this.IsCAMStockNode(node);
	};

	CAMModelStructurePanel.prototype.isGroupNode = function(node) {
		// We consider cam operation nodes leaf nodes.
		//
		return this.IsCAMOperationNode(node) ? false : ave.ViewerModelStructurePanel.prototype.isGroupNode.call(this, node);
	};

	CAMModelStructurePanel.prototype.setNodeVisibility = function(node, visible) {
		if(visible) {
			this.viewer.show(node);
		} else {
			this.viewer.hide(node)
		}
	};

	CAMModelStructurePanel.prototype.SetModelVisible = function() {
		if(!this.camModelNodes) return;

		for(var k = 0; k < this.camModelNodes.length; k++)
			this.setNodeVisibility(this.camModelNodes[k], true);
	};

	CAMModelStructurePanel.prototype.SetCAMNodeVisible = function(visible) {
		if(!this.camNodes) return;

		for(var k = 0; k < this.camNodes.length; k++) {
			this.setNodeVisibility(this.camNodes[k], visible);
		}
		this.SetToolNodeVisible(false);
	};

	CAMModelStructurePanel.prototype.SetToolNodeVisible = function(visible) {
		if(!this.camToolNodes) return;

		for(var k = 0; k < this.camToolNodes.length; k++)
			this.setNodeVisibility(this.camToolNodes[k], visible);
	};

	CAMModelStructurePanel.prototype.HideHightlightNode = function(node) {

		var viewer = this.viewer.impl;
		var that = this;

		that.instanceTree.enumNodeFragments(node, function(fragId) {
			viewer.highlightFragment(that.model, fragId, false);
		}, true);
	};

	// this is to hide the specific child node
	CAMModelStructurePanel.prototype.HideHightlightCAMNode = function(node) {

		var isCamSetupNode = this.IsCAMSetupNode(node);
		var isCamOperaNode = this.IsCAMOperationNode(node);
		var isCamFolderNode = this.IsCAMFolderNode(node);

		var that = this;

		that.instanceTree.enumNodeChildren(node, function(dbId) {
			if(isCamSetupNode) {
				if(!that.IsCAMStockNode(dbId))
					that.HideHightlightNode(dbId);
			} else if(isCamOperaNode) {
				if(that.IsCAMToolNode(dbId))
					that.HideHightlightNode(dbId);
			} else if(isCamFolderNode) {
				that.HideHightlightNode(dbId);
			}
		}, false);

	};

	CAMModelStructurePanel.prototype.setCamNodeVisibility = function(nodeId) {
		var isCamSetupNode = this.IsCAMSetupNode(nodeId);
		var isCamOperaNode = this.IsCAMOperationNode(nodeId);
		var isCamFolderNode = this.IsCAMFolderNode(nodeId);
		var that = this;

		if(isCamSetupNode) {
			this.instanceTree.enumNodeChildren(nodeId, function(childNodeId) {
				var bStock = that.IsCAMStockNode(childNodeId);
				that.setNodeVisibility(childNodeId, bStock);
			});
		} else if(isCamOperaNode) {
			// hide the tool node
			this.instanceTree.enumNodeChildren(nodeId, function(childNodeId) {
				if(that.IsCAMToolNode(childNodeId)) {
					that.setNodeVisibility(childNodeId, false);
				}
			});
		} else if(isCamFolderNode) {
			this.instanceTree.enumNodeChildren(nodeId, function(childNodeId) {
				that.setNodeVisibility(childNodeId, false);
			});
		}

	};

	CAMModelStructurePanel.prototype.onClick = function(node, event) {
		ave.ViewerModelStructurePanel.prototype.onClick.call(this, node, event);

		this.SetModelVisible();

		this.setCamNodeVisibility(node);

		this.viewer.fitToView();
	};

	CAMModelStructurePanel.prototype.ExpandSetupNodes = function() {

		if(!this.camSetupNodes) return;

		for(var k = 0; k < this.camSetupNodes.length; k++)
			this.tree.setCollapsed(this.delegate, this.camSetupNodes[k], false);
	};

	ns.CAMModelStructurePanel = CAMModelStructurePanel;

})();;
(function() {

	'use strict';

	var zv = ZhiUTech.Viewing,
		AVU = zv.UI;

	zv.ANIMATION_PLAY_EVENT = 'animationPlayEvent';
	zv.ANIMATION_PAUSE_EVENT = 'animationPauseEvent';
	zv.ANIMATION_SEEK_EVENT = 'animationSeekEvent';
	zv.ANIMATION_PREVIOUS_FRAME_EVENT = 'animationPreviousFrameEvent';
	zv.ANIMATION_NEXT_FRAME_EVENT = 'animationNextFrameEvent';
	zv.ANIMATION_TRACK_UPDATE_EVENT = 'animationTrackUpdateEvent';
	zv.ANIMATION_TOOLBAR_CLOSE_EVENT = 'animationToolbarCloseEvent';

	/**
	 * AnimationExtension adds a toolbar with buttons (play/pause/forward/backward/goto start/end)
	 * and timeline scrubber to control animation playback.
	 */
	var AnimationExtension = function(viewer, options) {
		zv.Extension.call(this, viewer, options);
		this.viewer = viewer;
		this.animTools = null;
		this.animToolsId = "animationTools";
		this.playButton = null;
		this.playButtonIsPaused = true;
		this.prevAnimationTime = -1;
		this.name = 'fusionanimation';
	};

	AnimationExtension.prototype = Object.create(zv.Extension.prototype);
	AnimationExtension.prototype.constructor = AnimationExtension;

	/**
	 * Converts seconds into Hours:Minutes:Seconds String
	 * @param {Number} time in seconds
	 * @returns {string}
	 * @private
	 */
	function convertSecsToHMS(time) {
		var sign = "";
		if(time < 0) {
			sign = "-";
			time = -time;
		}
		var hrs = ~~(time / 3600);
		var mins = ~~((time % 3600) / 60);
		var secs = time % 60;
		var ret = sign;
		if(hrs > 0)
			ret += hrs + ":" + (mins < 10 ? "0" : "");
		ret += mins + ":" + (secs < 10 ? "0" : "");
		ret += secs.toFixed(2);
		return ret;
	}

	AnimationExtension.prototype.load = function() {
		var viewer = this.viewer;

		this.onPlayCallbackBinded = this.onPlayCallback.bind(this);
		this.onCameraChangeBinded = this.onCameraChange.bind(this);
		this.onExplodeBinded = this.onExplode.bind(this);
		this.onResizeBinded = this.onResize.bind(this);
		this.onEscapeBinded = this.onEscape.bind(this);

		viewer.addEventListener(ZhiUTech.Viewing.CAMERA_CHANGE_EVENT, this.onCameraChangeBinded);
		viewer.addEventListener(ZhiUTech.Viewing.EXPLODE_CHANGE_EVENT, this.onExplodeBinded);
		viewer.addEventListener(ZhiUTech.Viewing.VIEWER_RESIZE_EVENT, this.onResizeBinded);
		viewer.addEventListener(ZhiUTech.Viewing.ESCAPE_EVENT, this.onEscapeBinded);

		// init animations after object tree created and geometry loaded
		if(viewer.model && viewer.model.isObjectTreeCreated()) {
			this.onAnimationReady();
		} else {
			this.onAnimationReadyBinded = this.onAnimationReady.bind(this);
			viewer.addEventListener(ZhiUTech.Viewing.ANIMATION_READY_EVENT, this.onAnimationReadyBinded);
		}

		return true;
	};

	AnimationExtension.prototype.unload = function() {
		var viewer = this.viewer;

		if(this.onAnimationReadyBinded) {
			viewer.removeEventListener(ZhiUTech.Viewing.ANIMATION_READY_EVENT, this.onAnimationReadyBinded);
			this.onAnimationReadyBinded = null;
		}

		// stop animations
		this.rewind();
		viewer.impl.invalidate(true, true, true); // Required to reset animations when Extension unloads and viewer remains.

		this.onPlayCallbackBinded = null;

		if(this.animTools) {
			this.animTools.removeControl(this.animTools.timeText.getId());
			this.animTools.removeControl(this.animTools.timeline.getId());
			this.animTools.removeControl(this.animTools.timeLeftText.getId());
			this.animTools.removeControl(this.animTools.forwardButton.getId());
			this.animTools.removeControl(this.animTools.backwardButton.getId());
			this.animTools.removeControl(this.animTools.closeButton.getId());
		}

		if(this.toolbar) {
			this.toolbar.removeControl(this.animTools);
			this.toolbar.container.parentNode.removeChild(this.toolbar.container);
			this.toolbar = null;
		}

		if(this.playButton) {
			var toolbar = viewer.getToolbar(false);
			if(toolbar) {
				toolbar.getControl(zv.TOOLBAR.MODELTOOLSID).removeControl(this.playButton.getId());
			}
		}

		// Remove event listeners
		viewer.removeEventListener(zv.CAMERA_CHANGE_EVENT, this.onCameraChangeBinded);
		viewer.removeEventListener(zv.EXPLODE_CHANGE_EVENT, this.onExplodeBinded);
		viewer.removeEventListener(zv.VIEWER_RESIZE_EVENT, this.onResizeBinded);
		viewer.removeEventListener(zv.ESCAPE_EVENT, this.onEscapeBinded);

		if(this.onToolbarCreatedBinded) {
			viewer.removeEventListener(zv.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
			this.onToolbarCreatedBinded = null;
		}

		return true;
	};

	/**
	 * Plays the animation. Invoke pause() to stop the animation.
	 */
	AnimationExtension.prototype.play = function() {

		if(this.isPlaying()) {
			return;
		}

		this.resetExplode(0, true);

		var viewer = this.viewer;
		var animator = viewer.impl.keyFrameAnimator;
		if(!animator) return;

		// restore previous animation if set
		if(this.prevAnimationTime > 0) {
			animator.goto(this.prevAnimationTime);
			this.prevAnimationTime = -1;
		}

		animator.play(0, this.onPlayCallbackBinded);

		this.updatePlayButton(animator.isPaused);

		if(this.animTools) {
			this.animTools.setVisible(true);
			if(!this.animTools.isPositionAdjusted) {
				this.adjustToolbarPosition();
				this.animTools.isPositionAdjusted = true;
			}
		}
	};

	/**
	 * Pauses an active animation. Can resume by calling play()
	 */
	AnimationExtension.prototype.pause = function() {

		if(this.isPaused()) {
			return;
		}

		var animator = this.viewer.impl.keyFrameAnimator;
		if(!animator) return;
		animator.pause();

		// UI stuff
		this.updatePlayButton(animator.isPaused);
	};

	/**
	 * Whether the animation is currently playing.
	 * Always returns the opposite of isPaused()
	 * @returns {Boolean}
	 */
	AnimationExtension.prototype.isPlaying = function() {

		var animator = this.viewer.impl.keyFrameAnimator;
		if(!animator) return false;
		return animator.isPlaying && !animator.isPaused;
	};

	/**
	 * Wether the animation is currently paused.
	 * Always returns the opposite of isPlaying()
	 * @returns {Boolean}
	 */
	AnimationExtension.prototype.isPaused = function() {

		var animator = this.viewer.impl.keyFrameAnimator;
		if(!animator) return false;
		return animator.isPaused;
	};

	/**
	 * Pauses and rewinds the animation.
	 */
	AnimationExtension.prototype.rewind = function() {
		this.setTimelineValue(0);
	};

	/**
	 * Sets the animation at the very beginning (0), at the end(1) or anywhere in between.
	 * For example, use value 0.5 to set the animation half way through it's completion.
	 * Will pause a playing animation.
	 *
	 * @param {Number} scale - value between 0 and 1
	 */
	AnimationExtension.prototype.setTimelineValue = function(scale) {
		var animator = this.viewer.impl.keyFrameAnimator;
		if(!animator) return;
		scale = Math.min(Math.max(0, scale), 1);
		var time = scale * animator.duration;
		animator.goto(time);
		this.updateUI();
	};

	/**
	 * Sets animation onto the previous keyframe.
	 * Will pause the animation if playing.
	 */
	AnimationExtension.prototype.prevKeyframe = function() {
		var animator = this.viewer.impl.keyFrameAnimator;
		if(!animator) return;
		animator.prev();
		this.updateUI();
	};

	/**
	 * Sets animation onto the next keyframe.
	 * Will pause the animation if playing.
	 */
	AnimationExtension.prototype.nextKeyframe = function() {
		var animator = this.viewer.impl.keyFrameAnimator;
		if(!animator) return;
		animator.next();
		this.updateUI();
	};

	/**
	 * Returns how many seconds does the animation take to complete.
	 * See also:
	 * - getDurationLabel()
	 * - getCurrentTime()
	 * @return {Number}
	 */
	AnimationExtension.prototype.getDuration = function() {
		var animator = this.viewer.impl.keyFrameAnimator;
		if(!animator) return 0;
		return animator.duration;
	};

	/**
	 * Returns duration as a formatted String h:mm:ss (hours:minutes:seconds)
	 * See also:
	 * - getDuration()
	 * - getCurrentTimeLabel()
	 * @returns {string}
	 */
	AnimationExtension.prototype.getDurationLabel = function() {
		return convertSecsToHMS(this.getDuration());
	};

	/**
	 * Returns the elapsed time (in seconds) of the animation.
	 * See also:
	 * - getDuration()
	 * - getCurrentTimeLabel()
	 * @return {Number}
	 */
	AnimationExtension.prototype.getCurrentTime = function() {
		var animator = this.viewer.impl.keyFrameAnimator;
		if(!animator) return 0;
		return animator.currentTime;
	};

	/**
	 * Returns the current animation time as a formatted String h:mm:ss (hours:minutes:seconds)
	 * See also:
	 * - getCurrentTime()
	 * - getDurationLabel()
	 * @returns {string}
	 */
	AnimationExtension.prototype.getCurrentTimeLabel = function() {
		return convertSecsToHMS(this.getCurrentTime());
	};

	/**
	 * @private
	 */
	AnimationExtension.prototype.onAnimationReady = function() {
		var viewer = this.viewer;

		if(this.onAnimationReadyBinded) {
			viewer.removeEventListener(ZhiUTech.Viewing.ANIMATION_READY_EVENT, this.onAnimationReadyBinded);
			this.onAnimationReadyBinded = null;
		}

		// Check for animator class
		if(!viewer.impl.keyFrameAnimator)
			return;

		// Add the ui only if an animation is available.
		if(viewer.toolbar && viewer.modelTools) {
			this.onToolbarCreated();
		} else {
			this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
			viewer.addEventListener(zv.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
		}
	};

	/**
	 *
	 * @private
	 */
	AnimationExtension.prototype.updateUI = function() {

		var animator = this.viewer.impl.keyFrameAnimator;
		if(!this.animTools || !animator) {
			return;
		}
		this.animTools.input.value = animator.duration > 0 ? animator.currentTime / animator.duration * 100 : 0;
		this.animTools.lapse.value = convertSecsToHMS(animator.currentTime);
		this.animTools.lapseLeft.value = convertSecsToHMS(animator.duration);
		this.updatePlayButton(animator.isPaused);
		this.updateToolbarBackground();
	};

	/**
	 * @private
	 */
	AnimationExtension.prototype.onPlayCallback = function(value) {

		// TODO: We should be able to replace this whole method body with a call to update().
		// The only problem for now is taht we would also need to change KeyFrameAnimator because
		// the onPlayCallback() is being invoked BEFORE the animation is paused.
		if(!this.animTools) return;

		var animator = this.viewer.impl.keyFrameAnimator;
		this.viewer.dispatchEvent({
			type: zv.ANIMATION_TRACK_UPDATE_EVENT,
			data: {
				time: animator.currentTime,
				duration: animator.duration
			}
		});
		this.animTools.input.value = value;
		this.animTools.lapse.value = convertSecsToHMS(animator.currentTime);
		this.animTools.lapseLeft.value = convertSecsToHMS(animator.duration);

		if(value >= 100) {
			this.updatePlayButton(true);
		}
		this.updateToolbarBackground();
	};

	/**
	 *
	 * @param isPaused
	 * @private
	 */
	AnimationExtension.prototype.updatePlayButton = function(isPaused) {
		if(!this.playButton) {
			return;
		}

		if(isPaused === this.playButtonIsPaused) {
			return;
		}

		this.playButtonIsPaused = isPaused;
		var animator = this.viewer.impl.keyFrameAnimator;

		if(isPaused) {
			this.playButton.setIcon('toolbar-animation-play-icon');
			this.playButton.setToolTip('Play');
			this.viewer.dispatchEvent({
				type: zv.ANIMATION_PAUSE_EVENT,
				data: {
					time: animator.currentTime,
					duration: animator.duration
				}
			});

		} else {
			this.playButton.setIcon('toolbar-animation-pause-icon');
			this.playButton.setToolTip('Pause');
			this.viewer.dispatchEvent({
				type: zv.ANIMATION_PLAY_EVENT,
				data: {
					time: animator.currentTime,
					duration: animator.duration
				}
			});
		}
	};

	/**
	 * Helper function that resets model explosion.
	 * @param value
	 * @param setSlider
	 * @private
	 */
	AnimationExtension.prototype.resetExplode = function(value, setSlider) {
		var viewer = this.viewer;
		if(!viewer.model.is2d() && viewer.getExplodeScale() !== 0) {
			if(setSlider && viewer.explodeSlider) { // explodeSlider is only in GuiViewer3D instances
				viewer.explodeSlider.value = value;
			}
			viewer.explode(value);
		}
	};

	/**
	 * @private
	 */
	AnimationExtension.prototype.adjustToolbarPosition = function() {
		// set timeline width
		var viewer = this.viewer;
		if(!viewer.toolbar) return;
		var fullwidth = viewer.toolbar.getDimensions().width;
		var viewportWidth = viewer.container.getBoundingClientRect().width;
		if(fullwidth > viewportWidth)
			fullwidth = viewer.modelTools.getDimensions().width;
		var inputWidth = fullwidth - (2 *
			this.animTools.backwardButton.getDimensions().width + 3 *
			this.animTools.timeText.getDimensions().width + this.animTools.closeButton.getDimensions().width + 20);
		this.animTools.input.style.width = inputWidth + 'px';
	};

	/**
	 * @private
	 */
	AnimationExtension.prototype.hideAnimateToolbar = function() {
		if(this.animTools) {
			this.animTools.setVisible(false);
		}
	};

	/**
	 * @private
	 */
	AnimationExtension.prototype.updateToolbarBackground = function() {
		if(!this.animTools) return;
		var input = this.animTools.input;
		var percentage = input.value;
		var col1 = "#ffffff",
			col2 = "#393939";
		input.style.background = "-webkit-linear-gradient(left," + col1 + " " + percentage + "%, " + col2 + " " + percentage + "%)";
		input.style.background = "-moz-linear-gradient(left," + col1 + " " + percentage + "%, " + col2 + " " + percentage + "%)";
		input.style.background = "-ms-linear-gradient(left," + col1 + " " + percentage + "%, " + col2 + " " + percentage + "%)";
		input.style.background = "-o-linear-gradient(left," + col1 + " " + percentage + "%, " + col2 + " " + percentage + "%)";
		input.style.background = "linear-gradient(to right," + col1 + " " + percentage + "%, " + col2 + " " + percentage + "%)";
	};

	/**
	 * @private
	 */
	AnimationExtension.prototype.onCameraChange = function() {
		if(this.viewer.toolController.cameraUpdated) {
			var animator = this.viewer.impl.keyFrameAnimator;
			if(!animator) return;
			if(animator.isPlaying && !animator.isPaused) {
				animator.pause();
				this.updatePlayButton(animator.isPaused);
			}
		}
	};

	/**
	 * @private
	 */
	AnimationExtension.prototype.onResize = function() {
		if(!this.toolbar) return;
		if(this.viewer.container.clientWidth < (zv.isTouchDevice() ? 560 : 600)) {
			this.toolbar.setCollapsed(true);
		} else {
			this.toolbar.setCollapsed(false);
			this.adjustToolbarPosition();
		}
	};

	/**
	 * @private
	 */
	AnimationExtension.prototype.onEscape = function() {

		if(this.isPlaying()) {
			this.pause();
		} else {
			this.hideAnimateToolbar();
		}
	};

	/**
	 * @private
	 */
	AnimationExtension.prototype.onExplode = function() {
		// reset animation
		var animator = this.viewer.impl.keyFrameAnimator;
		if(animator) {
			if(animator.currentTime !== 0) {
				this.prevAnimationTime = animator.currentTime;
				animator.goto(0);
			}
			this.updatePlayButton(true);
		}
		this.hideAnimateToolbar();
	};

	/**
	 * @private
	 */
	AnimationExtension.prototype.onToolbarCreated = function() {

		var viewer = this.viewer;
		var that = this;

		if(this.onToolbarCreatedBinded) {
			viewer.removeEventListener(zv.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
			this.onToolbarCreatedBinded = null;
		}

		this.toolbar = new AVU.ToolBar('animation-toolbar');
		this.toolbar.addClass('toolbar-animation-subtoolbar');
		viewer.container.appendChild(this.toolbar.container);

		this.animTools = new AVU.ControlGroup(this.animToolsId);
		this.animTools.setVisible(false);
		this.toolbar.addControl(this.animTools);

		// play button at first of modelTools
		this.playButton = new AVU.Button('toolbar-animationPlay');
		this.playButton.setIcon('toolbar-animation-play-icon');
		this.playButton.setToolTip('Play');
		this.playButton.onClick = function() {
			if(that.isPaused()) {
				that.activate();
			} else {
				that.deactivate();
			}
		};
		viewer.modelTools.addControl(this.playButton);

		// override reset button's onClick method
		if(viewer.modelTools.resetModelButton) {
			viewer.modelTools.resetModelButton.onClick = function(e) {
				viewer.showAll();
				var animator = viewer.impl.keyFrameAnimator;
				if(animator) {
					animator.goto(0);
					input.value = 0;
					lapse.value = convertSecsToHMS(0);
					lapseLeft.value = convertSecsToHMS(animator.duration);
					that.updatePlayButton(true);
				}
				that.resetExplode(0, true);
				that.updateToolbarBackground();
			};
		}

		// backward button
		this.animTools.backwardButton = new AVU.Button('toolbar-animationBackward');
		this.animTools.backwardButton.setToolTip('Previous keyframe');
		this.animTools.backwardButton.onClick = function(e) {
			var animator = viewer.impl.keyFrameAnimator;
			if(animator !== undefined && animator) {
				animator.prev();
				viewer.dispatchEvent({
					type: zv.ANIMATION_PREVIOUS_FRAME_EVENT,
					data: {
						time: animator.currentTime,
						duration: animator.duration
					}
				});
				that.updateUI();
			}
		};
		this.animTools.backwardButton.addClass('toolbar-animation-button');
		this.animTools.backwardButton.setIcon('toolbar-animation-backward-icon');
		this.animTools.addControl(this.animTools.backwardButton);

		// forward button
		this.animTools.forwardButton = new AVU.Button('toolbar-animationForward');
		this.animTools.forwardButton.setToolTip('Next keyframe');
		this.animTools.forwardButton.onClick = function(e) {
			var animator = viewer.impl.keyFrameAnimator;
			if(animator !== undefined && animator) {
				animator.next();
				viewer.dispatchEvent({
					type: zv.ANIMATION_NEXT_FRAME_EVENT,
					data: {
						time: animator.currentTime,
						duration: animator.duration
					}
				});
				that.updateUI();
			}
		};
		this.animTools.forwardButton.addClass('toolbar-animation-button');
		this.animTools.forwardButton.setIcon('toolbar-animation-forward-icon');
		this.animTools.addControl(this.animTools.forwardButton);

		// current time lapse
		this.animTools.timeText = new AVU.Control('toolbar-animation-time-lapse');
		var lapse = this.animTools.lapse = document.createElement("input");
		lapse.type = "text";
		lapse.value = "0";
		lapse.className = "animation-time-lapse";
		lapse.disabled = true;
		this.animTools.timeText.container.appendChild(lapse);
		this.animTools.timeText.addClass('toolbar-animation-button');
		this.animTools.addControl(this.animTools.timeText);

		// timeline
		this.animTools.timeline = new AVU.Control('toolbar-animation-timeline');
		var input = this.animTools.input = document.createElement("input");
		input.type = "range";
		input.value = "0";
		input.className = "animation-timeline";
		if(zv.isIE11) {
			// In IE11, the input type=range has a weird default layout...
			input.style['padding-top'] = '0';
			input.style['padding-bottom'] = '0';
			input.style['margin-top'] = '10px';
		}
		this.animTools.timeline.container.appendChild(input);
		// oninput doesn't work on IE11, use onchange instead
		input.addEventListener(zv.isIE11 ? "change" : "input", function(e) {
			var animator = viewer.impl.keyFrameAnimator;
			if(animator !== undefined && animator) {
				var time = input.value * animator.duration / 100;
				lapse.value = convertSecsToHMS(time);
				lapseLeft.value = convertSecsToHMS(animator.duration);
				animator.goto(time);
				viewer.dispatchEvent({
					type: zv.ANIMATION_SEEK_EVENT,
					data: {
						time: time,
						duration: animator.duration
					}
				});
				that.updatePlayButton(animator.isPaused);
				that.updateToolbarBackground();
			}
		});
		// tooltip for slider
		var inputTooltip = document.createElement("div");
		inputTooltip.className = "zu-control-tooltip";
		inputTooltip.textContent = ZhiUTech.Viewing.i18n.translate("Click-drag to scrub");
		this.animTools.timeline.container.appendChild(inputTooltip);
		input.addEventListener("mouseover", function(event) {
			if(event.target === input)
				inputTooltip.style.visibility = "visible";
		});
		input.addEventListener("mouseout", function(event) {
			if(event.target === input)
				inputTooltip.style.visibility = "hidden";
		});

		this.animTools.timeline.addClass('toolbar-animation-button');
		this.animTools.timeline.addClass('toolbar-animation-timeline');
		this.animTools.addControl(this.animTools.timeline);

		// remaining time lapse
		this.animTools.timeLeftText = new AVU.Control('toolbar-animationRemainingTime');
		var lapseLeft = this.animTools.lapseLeft = document.createElement("input");
		lapseLeft.type = "text";
		lapseLeft.value = "0";
		lapseLeft.className = "animation-time-lapse";
		lapseLeft.disabled = true;
		this.animTools.timeLeftText.container.appendChild(lapseLeft);
		this.animTools.timeLeftText.addClass('toolbar-animation-button');
		this.animTools.addControl(this.animTools.timeLeftText);

		// close button
		this.animTools.closeButton = new AVU.Button('toolbar-animation-Close');
		this.animTools.closeButton.addClass('docking-panel-close');
		this.animTools.closeButton.addClass('toolbar-animation-button');
		this.animTools.closeButton.addClass('toolbar-animation-close-button');
		this.animTools.closeButton.onClick = function() {
			that.hideAnimateToolbar();
			viewer.dispatchEvent({
				type: zv.ANIMATION_TOOLBAR_CLOSE_EVENT
			});
		};

		this.animTools.addControl(this.animTools.closeButton);
	};

	AnimationExtension.prototype.activate = function() {
		this.play();
		return true;
	};

	AnimationExtension.prototype.deactivate = function() {
		this.pause();
		return true;
	};

	AnimationExtension.prototype.isActive = function() {
		return this.isPlaying();
	}

	//TODO: Is it really necessary to expose it other than to ExtensionManager?
	ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.Fusion360');
	ZhiUTech.Viewing.Extensions.Fusion360.AnimationExtension = AnimationExtension;

	zv.theExtensionManager.registerExtension('ZhiUTech.Fusion360.Animation', AnimationExtension);

})();;
ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.Collaboration');

(function() {

	var zv = ZhiUTech.Viewing,
		zvp = zv.Private,
		ave = zv.Extensions,
		avec = ave.Collaboration;

	avec.InteractionInterceptor = function(viewtx) {

		this.getNames = function() {
			return ["intercept"];
		};

		this.getName = function() {
			return "intercept";
		};

		this.activate = function(name) {};
		this.deactivate = function(name) {};
		this.update = function(timeStamp) {
			return false;
		};

		this.handleSingleClick = function(event, button) {
			return false;
		};
		this.handleDoubleClick = function(event, button) {
			return false;
		};
		this.handleSingleTap = function(tap) {
			return false;
		};
		this.handleDoubleTap = function(tap1, tap2) {
			return false;
		};
		this.handleKeyDown = function(event, keyCode) {
			return false;
		};
		this.handleKeyUp = function(event, keyCode) {
			return false;
		};

		this.handleWheelInput = function(delta) {
			viewtx.takeControl();
			return false;
		};

		this.handleButtonDown = function(event, button) {
			viewtx.takeControl();
			return false;
		};

		this.handleButtonUp = function(event, button) {
			return false;
		};
		this.handleMouseMove = function(event) {
			viewtx.updatePointer(event);
			return false;
		};

		this.handleGesture = function(event) {
			viewtx.takeControl();
			return false;
		};

		this.handleBlur = function(event) {
			return false;
		};
		this.handleResize = function() {};
	};

	avec.ViewTransceiver = function(client) {

		var _this = this;
		var _viewer = this.viewer = null;
		var _blockEvents = false;
		var _haveControl = false;
		var _isDisconnected = false;
		var _lastInControl;
		var _client = this.client = client;
		var _ray = new THREE.Ray();
		var _pointer = null;
		var _pointerOn = false;

		this.channelId = null;

		var _viewerState;
		var VIEWER_STATE_FILTER = {
			seedURN: false,
			objectSet: true,
			viewport: false,
			cutplanes: true,
			renderOptions: {
				environment: false,
				ambientOcclusion: false,
				toneMap: {
					exposure: false
				},
				appearance: false
			}
		};

		function onViewerState(evt) {
			_blockEvents = true;
			var state = JSON.parse(evt.data.msg);
			_viewerState.restoreState(state);
			_viewer.impl.invalidate(true, false, true);
			_blockEvents = false;
		}

		function reduceBits(v) {
			return Math.round(v * 1000) / 1000;
		}

		function reduceBitsV(v) {
			for(var i = 0; i < v.length; i++)
				v[i] = reduceBits(v[i]);
		}

		function onCamera(e) {
			var v = e.data.msg;

			if(v[1] === true || _isDisconnected) {
				return;
			}

			if(v[0] != _lastInControl) {
				_lastInControl = v[0];
				e.data.lastInControl = v[0];
				_this.dispatchEvent({
					type: "controlChange",
					channelId: _this.channelId,
					data: e.data
				});
			}

			//For now, automatically relinquish camera control if we receive a remote command to move the camera
			_haveControl = false;

			/*
			            viewer.navigation.setRequestTransitionWithUp(true, new THREE.Vector3().set(v[1+0],v[1+1],v[1+2]),
			                                                                new THREE.Vector3().set(v[1+3],v[1+4],v[1+5]),
			                                                                _viewer.navigation.getCamera().fov,
			                                                                new THREE.Vector3().set(v[1+6],v[1+7],v[1+8]));
			*/

			_viewer.navigation.setView(new THREE.Vector3().set(v[2 + 0], v[2 + 1], v[2 + 2]),
				new THREE.Vector3().set(v[2 + 3], v[2 + 4], v[2 + 5]));
			_viewer.navigation.setCameraUpVector(new THREE.Vector3().set(v[2 + 6], v[2 + 7], v[2 + 8]));
		}

		function sendCamera(evt) {
			if(!_haveControl && !_isDisconnected)
				return;

			var c = evt.camera;
			var camParams = [c.position.x, c.position.y, c.position.z,
				c.target.x, c.target.y, c.target.z,
				c.up.x, c.up.y, c.up.z
			];

			reduceBitsV(camParams);
			camParams.unshift(_isDisconnected);
			camParams.unshift(client.getLocalId());

			_client.sendMessage("camera", camParams, _this.channelId);

			if(_lastInControl != camParams[0]) {
				_lastInControl = camParams[0];
				_this.dispatchEvent({
					type: "controlChange",
					channelId: _this.channelId,
					data: {
						lastInControl: _lastInControl
					}
				});
			}
		}

		function showPointer(show, x, y) {

			if(show && !_pointer) {
				_pointer = document.createElement("div");
				_pointer.classList.add("collabPointer");
			}

			if(show && !_pointerOn) {
				_viewer.container.appendChild(_pointer);
				_pointerOn = true;
			} else if(!show && _pointerOn) {
				_viewer.container.removeChild(_pointer);
				_pointerOn = false;
			}

			if(show) {
				//Note the 4px is half the width/height specified in the CSS,
				//so that the pointer is centered.
				_pointer.style.left = (x - 6) + "px";
				_pointer.style.top = (y - 6) + "px";
			}

		}

		function onPointer(e) {

			if(_haveControl)
				return; //shouldn't get here in theory, but let's check just in case

			if(_isDisconnected)
				return; //we can't show the pointer if the views don't match

			var v = e.data.msg;
			_ray.origin.set(v[1], v[2], v[3]);
			_ray.direction.set(v[4], v[5], v[6]);

			var pt = _ray.at(_viewer.getCamera().near);
			pt.project(_viewer.getCamera());

			pt = _viewer.impl.viewportToClient(pt.x, pt.y);

			//console.log(pt.x + " " + pt.y);
			showPointer(true, pt.x, pt.y);
		}

		function sendPointer(evt) {
			if(!_haveControl)
				return;

			//Note canvasX/Y are set by the ToolController to clientX/Y - canvas left/top.
			var vpVec = _viewer.impl.clientToViewport(evt.canvasX, evt.canvasY);
			_viewer.impl.viewportToRay(vpVec, _ray);

			var rayParams = [_ray.origin.x, _ray.origin.y, _ray.origin.z,
				_ray.direction.x, _ray.direction.y, _ray.direction.z
			];

			reduceBitsV(rayParams);
			rayParams.unshift(client.getLocalId());

			_client.sendMessage("pointer", rayParams, _this.channelId);
		}

		function sendViewerState(e) {
			//if (!_haveControl)
			//    return;
			if(_blockEvents)
				return;

			var state = _viewerState.getState(VIEWER_STATE_FILTER);

			// TODO: if we kill the socket.io code path, this could be optimized
			// too by removing the JSON.stringify of the state. Pubnub automatically
			// does JSON serialization for us, with optimizations accordingly to their manual.
			client.sendMessage("state", JSON.stringify(state), _this.channelId);
		}

		this.takeControl = function() {
			_haveControl = true;
			showPointer(false);
		};

		this.updatePointer = function(e) {
			sendPointer(e);
		};

		this.connectCamera = function(set) {
			_isDisconnected = !set;
		};

		this.attach = function(viewer) {

			if(_viewer)
				this.detach();

			this.viewer = _viewer = viewer;
			_viewerState = new zvp.ViewerState(_viewer);

			_client.addEventListener("cameraChange", onCamera);
			_client.addEventListener("pointerMove", onPointer);
			_client.addEventListener("viewerState", onViewerState);

			if(!_viewer.hasEventListener(zv.CAMERA_CHANGE_EVENT, sendCamera))
				_viewer.addEventListener(zv.CAMERA_CHANGE_EVENT, sendCamera);

			if(!_viewer.hasEventListener(zv.SELECTION_CHANGED_EVENT, sendViewerState)) {
				_viewer.addEventListener(zv.SELECTION_CHANGED_EVENT, sendViewerState);
				_viewer.addEventListener(zv.ISOLATE_EVENT, sendViewerState);
				_viewer.addEventListener(zv.HIDE_EVENT, sendViewerState);
				_viewer.addEventListener(zv.SHOW_EVENT, sendViewerState);
				_viewer.addEventListener(zv.EXPLODE_CHANGE_EVENT, sendViewerState);
				_viewer.addEventListener(zv.LAYER_VISIBILITY_CHANGED_EVENT, sendViewerState);
				_viewer.addEventListener(zv.CUTPLANES_CHANGE_EVENT, sendViewerState);
			}
		};

		this.detach = function() {

			if(_client) {
				_client.removeEventListener("cameraChange", onCamera);
				_client.removeEventListener("viewerState", onViewerState);
			}

			if(_viewer) {
				_viewer.removeEventListener(zv.CAMERA_CHANGE_EVENT, sendCamera);

				_viewer.removeEventListener(zv.SELECTION_CHANGED_EVENT, sendViewerState);
				_viewer.removeEventListener(zv.ISOLATE_EVENT, sendViewerState);
				_viewer.removeEventListener(zv.HIDE_EVENT, sendViewerState);
				_viewer.removeEventListener(zv.SHOW_EVENT, sendViewerState);
				_viewer.removeEventListener(zv.EXPLODE_CHANGE_EVENT, sendViewerState);
				_viewer.removeEventListener(zv.LAYER_VISIBILITY_CHANGED_EVENT, sendViewerState);
				_viewer.removeEventListener(zv.CUTPLANES_CHANGE_EVENT, sendViewerState);

				this.viewer = _viewer = null;
				_viewerState = null;
			}
		};

	};

	avec.ViewTransceiver.prototype.constructor = avec.ViewTransceiver;
	ZhiUTech.Viewing.EventDispatcher.prototype.apply(avec.ViewTransceiver.prototype);

})();;
ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.Collaboration');

(function() {

	var zv = ZhiUTech.Viewing,
		ave = zv.Extensions,
		zvp = zv.Private,
		avu = zv.UI,
		avec = ave.Collaboration;

	//==================================================================================
	//Extension interface

	/** @constructor */
	ave.Collaboration.Collaboration = function(viewer, options) {
		zv.Extension.call(this, viewer, options);
		if(options && options.rtc && options.rtc.disableRTCToolbarButton) {
			this.disableRTCToolbarButton = true;
		}
		this.name = 'collaboration';
	};

	ave.Collaboration.Collaboration.prototype = Object.create(zv.Extension.prototype);
	ave.Collaboration.Collaboration.prototype.constructor = ave.Collaboration.Collaboration;

	var proto = ave.Collaboration.Collaboration.prototype;

	proto.initNetwork = function(force) {

		if(this.p2p && !force)
			return;

		this.viewtx = new avec.ViewTransceiver(this.client);
		this.interceptor = new avec.InteractionInterceptor(this.viewtx);
		this.viewer.toolController.registerTool(this.interceptor);

		this.p2p = new zvp.P2PClient(this.client);
	};

	proto.createUI = function() {

		var scope = this;
		var viewer = this.viewer;

		this.initNetwork(false);

		this.panel = new avec.DockingCollabPanel(this.viewer, this.client, this.p2p, this.viewtx);
		ave.Collaboration.Collaboration.Panel = this.panel;

		// Create a comment toolbar button.
		this.collabButton = new avu.Button('toolbar-collaborateTool');
		this.collabButton.setToolTip('Live review');
		this.collabButton.setIcon("zu-icon-live-review");
		this.collabButton.onClick = function(e) {
			var isVisible = scope.panel.isVisible();

			// Prevent instantiating multiple 'enter your name' box by
			// spamming collab button.
			if(document.getElementById("collabBox")) {
				return;
			}
			if(!isVisible && !scope.inviteDivInstantiated && !scope.activeStatus) {
				scope.activate();
			} else {
				scope.deactivate();
			}
		};
		if(this.disableRTCToolbarButton) {
			this.collabButton.setVisible(false, true);
		}

		this.panel.addVisibilityListener(function(state) {
			if(state) {

				if(viewer.model) {
					var esd = viewer.model.getData();

					scope.viewtx.channelId = esd.basePath;
					scope.viewtx.attach(viewer);

					scope.client.connect(scope.viewtx.channelId); //use the just the URN as load balancer session ID for now.
					scope.client.join(scope.viewtx.channelId);
				}

				viewer.toolController.activateTool(scope.interceptor.getName());

				var getColumbusURL = function() {
					var ret;
					switch(window.location.hostname) {
						case "columbus-dev.zhiutech.com":
							ret = "http://columbus-dev.zhiutech.com/collab.html?";
							break;
						case "columbus-staging.zhiutech.com":
							ret = "http://columbus-staging.zhiutech.com/collab-stg.html?";
							break;
						default:
							ret = "http://columbus-dev.zhiutech.com/collab.html?";
					}

					return ret + "document=urn:";
				};

				var generateSharedURL = function() {
					var baseURL = getColumbusURL();
					var urn = viewer.model.getData().urn;
					var ret = baseURL + urn;
					if(zvp.comment2Token) {
						ret += ("&comment2Token=" + encodeURIComponent(zvp.comment2Token));
					}
					return ret;
				};

				/*
				window.prompt("Send this URL to people you want to share and collaborate on this file!",
				  generateSharedURL());
				*/

				scope.collabButton.setState(avu.Button.State.ACTIVE);

				zvp.logger.track({
					category: "viewer_rtc_start"
				});
			} else {

				if(zvp.logger && scope.client.isConnected())
					zvp.logger.track({
						category: "viewer_rtc_stop"
					});

				scope.p2p.hangup();
				scope.viewtx.detach(viewer);
				scope.viewtx.channelId = null;
				scope.client.disconnect();
				scope.panel.reset();
				viewer.toolController.deactivateTool(scope.interceptor.getName());

				scope.collabButton.setState(avu.Button.State.INACTIVE);
			}
		});

		viewer.modelTools.addControl(this.collabButton);

		if(ZhiUTech.Viewing.Private.getParameterByName("invited")) {
			var w = new CollabPromptBox();
			var container = viewer.container;
			w.start(container, function() {
				scope.panel.setVisible(true, true);
			}, "Join a Live Review", "Join Review");
		}
	};

	proto.close = function() {
		this.panel.setVisible(false, true);
		this.panel.reset();
	};

	proto.load = function() {
		var viewer = this.viewer;
		var scope = this;

		function init() {

			scope.client = zvp.MessageClient.GetInstance(scope.options ? scope.options.messageServerURL : undefined);

			scope.socketErrorHandler = function(evt) {
				zvp.ErrorHandler.reportError(viewer.container, ZhiUTech.Viewing.ErrorCodes.RTC_ERROR, evt.data);
				scope.close();
			};

			scope.client.addEventListener("socketError", scope.socketErrorHandler);

			scope.presenceChannelId = window.location.host;

			if(scope.client.isConnected()) {
				//If the client is already connected, we assume that a presence service
				//is already joined by the embedding application.
				/*
				scope.client.addEventListener("userListChange", function(e) {
				    if (e.data.user && e.channelId == scope.presenceChannelId)
				        console.log(e.data.user.name + " is online.");
				    else if (e.userStatus == "left")
				        console.log(e.data.user.name + " went offline.");
				});
				*/
			} else {
				//Standalone configuration, where no embedding application exists
				//Used for testing.
				//Moved to launch of the collaboration panel so we can connect with session ID for load balancing
				//this.client.connect();
				//this.client.join(this.presenceChannelId);
			}

			// add the button to the toolbar
			if(viewer.modelTools) {
				scope.createUI();
			} else {
				viewer.addEventListener(ZhiUTech.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated);
			}

			function onToolbarCreated(e) {
				viewer.removeEventListener(ZhiUTech.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated);
				scope.createUI();
			}
		}

		//Load the socket.io library if needed
		zvp.loadDependency("lmv_io", "socket.io-1.3.5.js", init);

		return true;
	};

	proto.unload = function() {

		var viewer = this.viewer;

		this.client.removeEventListener("socketError", this.socketErrorHandler);
		this.socketErrorHandler = null;

		this.p2p.hangup();
		this.viewtx.detach(viewer);
		this.client.disconnect();

		if(this.panel) {
			this.panel.reset();
			this.panel.setVisible(false);
			this.panel.uninitialize();
			this.panel = null;
		}

		viewer.toolController.deactivateTool(this.interceptor.getName());
		this.interceptor = null;

		viewer.modelTools.removeControl(this.collabButton.getId());
		this.collabButton = null;

		return true;
	};

	proto.activate = function() {
		if(!this.activeStatus) {
			var viewer = this.viewer;
			var w = new avec.CollabPromptBox();
			var container = viewer.container;
			w.start(container, function() {
				this.panel.setVisible(true, true);
			}.bind(this), "Start a Live Review", "Start Review");
			this.activeStatus = true;
		}
		return true;
	};

	proto.deactivate = function() {
		if(this.activeStatus) {
			this.panel.setVisible(false, true);
			this.panel.reset();
			this.activeStatus = false;
		}
		return true;
	};
	zv.theExtensionManager.registerExtension('ZhiUTech.Viewing.Collaboration', ave.Collaboration.Collaboration);

})(); // closure
;
ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.Collaboration');

(function() {

	var zv = ZhiUTech.Viewing,
		ave = zv.Extensions,
		zvp = zv.Private,
		avu = zv.UI,
		avec = ave.Collaboration;

	/**
	 *  Start a Live Review Session.
	 */
	ZhiUTech.Viewing.startLiveReviewSession = function() {
		if(!avec.Panel) return;
		avec.Panel.startSession();
	};

	/**
	 *  End a Live Review Session.
	 */
	ZhiUTech.Viewing.endLiveReviewSession = function() {
		if(!avec.Panel) return;
		avec.Panel.endSession();
	};

	var USE_PRESENCE = true;

	//==================================================================================

	function DockingCollabPanel(viewer, client, p2p, viewtx) {

		this.viewer = viewer;
		this.client = client;
		this.p2p = p2p;
		this.viewtx = viewtx;

		var panelId = 'CollabPanel';
		zv.UI.DockingPanel.call(this, viewer.container, panelId, 'Live review');

		this.container.classList.add('collabPanel');

		this.container.style.height = "auto";
		this.container.dockRight = true;

		this.content = document.createElement("div");
		this.container.appendChild(this.content);
		this.content.classList.add("collabPanelContent");

		//Users list
		this.tableContainer = document.createElement("div");
		this.tableContainer.classList.add("userListTable", "docking-panel-scroll");

		this.table = document.createElement("table");
		this.table.classList.add("zu-lmv-tftable");
		this.tbody = document.createElement("tbody");
		this.table.appendChild(this.tbody);

		this.tableContainer.appendChild(this.table);
		this.content.appendChild(this.tableContainer);

		// Invite button
		this.inviteDiv = document.createElement('div');
		this.inviteDiv.className = 'collabBoxOK';
		this.inviteDiv.style.float = 'left';
		this.inviteDiv.style.width = '232px';
		this.inviteDiv.setAttribute("data-i18n", "Invite");
		this.inviteDiv.textContent = ZhiUTech.Viewing.i18n.translate("Invite");
		this.content.appendChild(this.inviteDiv);
		this.inviteDiv.addEventListener("click", function(event) {
			var w = new CollabPromptBox();
			var container = viewer.container;
			w.start(container, function() {
				var subject = ZhiUTech.Viewing.i18n.translate("Please Join My Live Review");
				document.location.href = "mailto:?subject=" + subject;
			}, "Invite Others", "Email Invite", true);
		});

		//Chat history
		this.chatHistory = document.createElement("div");
		this.chatHistory.classList.add("chatHistory");
		this.chatHistory.classList.add("textEntry");
		this.chatHistory.classList.add("docking-panel-scroll");
		this.content.appendChild(this.chatHistory);

		//Text input entry
		this.chatPanel = document.createElement("div");
		this.chatPanel.classList.add("chatPanel");

		this.textInput = document.createElement("input");
		this.textInput.type = "text";
		this.textInput.classList.add("textEntry");
		this.textInput.placeholder = ZhiUTech.Viewing.i18n.translate("Type a message");
		this.chatPanel.appendChild(this.textInput);

		this.content.appendChild(this.chatPanel);

		this.isCameraConnected = true;

		var scope = this;

		this.addEventListener(client, "userListChange", function(e) {

			//Collab panel only cares about events on the collaboration channel
			if(e.channelId && e.channelId !== scope.viewtx.channelId)
				return;

			var ci = scope.client.getChannelInfo(scope.viewtx.channelId);
			if(!ci)
				return;

			scope.updateUsers(ci.users);
		});

		this.addEventListener(this.viewtx, "controlChange", function(e) {

			//Collab panel only cares about events on the collaboration channel
			if(e.channelId !== scope.viewtx.channelId)
				return;

			scope.updateUserInControl(e.data.lastInControl);
		});

		this.addEventListener(client, "chatReceived", function(e) {

			//Collab panel only cares about events on the collaboration channel
			if(e.channelId !== scope.viewtx.channelId)
				return;

			scope.updateChatHistory(e);
		});

		this.textInput.onkeyup = function(e) {
			scope.handleChatInput(e);
		};

		this.addEventListener(this.p2p, "remoteStreamAdded", function(e) {
			if(!scope.videoPanel)
				scope.createVideoPanel();

			scope.remoteVideo.src = window.URL.createObjectURL(e.data);
		});

		this.addEventListener(this.p2p, "localStreamAdded", function(e) {
			if(!scope.videoPanel)
				scope.createVideoPanel();

			scope.localVideo.src = window.URL.createObjectURL(e.data);
		});

		this.addEventListener(this.p2p, "remoteHangup", function(e) {
			scope.removeVideoPanel();
		});
	}

	DockingCollabPanel.prototype = Object.create(zv.UI.DockingPanel.prototype);
	DockingCollabPanel.prototype.constructor = DockingCollabPanel;

	DockingCollabPanel.prototype.startSession = function() {
		var scope = this;
		var isVisible = this.isVisible();
		if(isVisible) return;
		var w = new CollabPromptBox();
		var container = this.viewer.container;
		w.start(container, function() {
			scope.setVisible(true, true);
		}, "Start a Live Review", "Start Review");
	};

	DockingCollabPanel.prototype.endSession = function() {
		var isVisible = this.isVisible();
		if(!isVisible) return;
		this.setVisible(false, true);
		this.reset();
	};

	DockingCollabPanel.prototype.updateUsers = function(users) {

		var scope = this;

		var tbody = document.createElement("tbody");

		for(var i = 0; i < users.length; i++) {
			var row = tbody.insertRow(-1);
			row.id = users[i].id;

			var statusCell = row.insertCell(0);
			statusCell.style.width = "14px";
			statusCell.style.cursor = "default";
			var statusIcon = document.createElement("div");
			statusIcon.classList.add("statusBase");
			statusIcon.classList.add("statusNormal");
			statusIcon.innerHTML = "&#9679";
			statusCell.appendChild(statusIcon);

			var nameCell = row.insertCell(1);
			nameCell.textContent = users[i].name;

			//Video calling disabled.
			/*
			if (!users[i].isSelf) {
			    var callCell = row.insertCell(2);
			    callCell.classList.add("callButton");
			    callCell.innerHTML = "&#9742";
			    callCell.title = "Start audio/video call";

			    callCell.onclick = function(e) {
			        var targetId = e.target.parentNode.id;

			        if (scope.p2p.getCurrentCallTarget() == targetId)
			            return;

			        if (scope.videoPanel) {
			            scope.p2p.hangup();
			            scope.removeVideoPanel();
			        }

			        scope.createVideoPanel();
			        scope.p2p.callUser(targetId);
			    };
			} else {
			    var callCell = row.insertCell(2);
			    callCell.classList.add(scope.isCameraConnected ? "cameraButton" : "cameraDisconnectButton");
			    callCell.innerHTML = "&#9788";
			    callCell.title = "Connect/Disconnect Camera";

			    callCell.onclick = function(e) {
			        var targetParent = e.target.parentNode;
			        var targetClassList = e.target.classList;

			        if (scope.isCameraConnected) {
			            targetClassList.remove("cameraButton");
			            targetClassList.add("cameraDisconnectButton");
			        } else {
			            targetClassList.remove("cameraDisconnectButton");
			            targetClassList.add("cameraButton");
			        }

			        scope.isCameraConnected = !scope.isCameraConnected;
			        scope.viewtx.connectCamera(scope.isCameraConnected);
			    };
			}
			*/
		}

		this.table.replaceChild(tbody, this.tbody);
		this.tbody = tbody;

		this.fixComponentPlacement();
	};

	DockingCollabPanel.prototype.updateUserInControl = function(id) {
		for(var i = 0; i < this.tbody.rows.length; i++) {
			var r = this.tbody.rows[i];
			var icon = r.cells[0].childNodes[0];
			if(r.id == id) {
				icon.classList.remove("statusNormal");
				icon.classList.add("statusInControl");
				icon.innerHTML = "&#9784";
				r.cells[1].style.color = "#4CBA36";
			} else {
				icon.classList.remove("statusInControl");
				icon.classList.add("statusNormal");
				icon.innerHTML = "&#9679";
				r.cells[1].style.color = "#ffffff";
			}

		}
	};

	DockingCollabPanel.prototype.updateChatHistory = function(e) {

		var user = this.client.getUserById(e.data.from, e.channelId);

		//skip command strings
		if(e.data.msg.charAt(0) == "/")
			return;

		//        var line = user.name + ": " + e.data.msg;

		if(this.chatHistory.lastUser != user.name) {

			var pEl = document.createElement("p");

			var nameEl = document.createElement("div");
			nameEl.classList.add("heading");
			nameEl.style.float = "left";
			nameEl.style.fontStyle = "normal";
			nameEl.style.color = "#857E7E";
			nameEl.textContent = user.name;
			pEl.appendChild(nameEl);

			var timeEl = document.createElement("div");
			timeEl.classList.add("heading");
			timeEl.style.textAlign = "right";
			timeEl.style.fontStyle = "normal";
			timeEl.style.color = "#857E7E";
			timeEl.textContent = new Date().toLocaleTimeString();
			pEl.appendChild(timeEl);

			this.chatHistory.appendChild(pEl);

			this.chatHistory.lastUser = user.name;
		} else {
			var br = document.createElement("br");
			this.chatHistory.appendChild(br);
		}

		var msgEl = document.createElement("span");
		msgEl.classList.add("messageText");
		msgEl.textContent = e.data.msg;
		this.chatHistory.appendChild(msgEl);

		this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
	};

	DockingCollabPanel.prototype.handleChatInput = function(e) {
		if(e.which != 13)
			return;
		if(this.textInput.value.length == 0)
			return;

		this.client.sendChatMessage(this.textInput.value, this.viewtx.channelId);
		this.textInput.value = "";
		this.textInput.placeholder = "";
	};

	DockingCollabPanel.prototype.fixComponentPlacement = function(e) {

		var heightAdj = this.tableContainer.offsetHeight + this.chatPanel.offsetHeight;

		if(this.videoPanel) {
			heightAdj += this.videoPanel.offsetHeight;
			this.chatHistory.style.height = "calc(100% - " + heightAdj + "px)";
		} else {
			this.chatHistory.style.height = "calc(100% - " + heightAdj + "px)";
		}

	};

	DockingCollabPanel.prototype.createVideoPanel = function(e) {
		this.videoPanel = document.createElement("div");
		this.videoPanel.classList.add("videoPanel");

		this.localVideo = document.createElement("video");
		this.localVideo.autoplay = true;
		this.localVideo.muted = true;
		this.localVideo.classList.add("videoInset");
		this.videoPanel.appendChild(this.localVideo);

		this.remoteVideo = document.createElement("video");
		this.remoteVideo.autoplay = true;
		this.remoteVideo.classList.add("videoMain");
		this.videoPanel.appendChild(this.remoteVideo);

		var scope = this;
		var closer = document.createElement("div");
		closer.classList.add("docking-panel-close");
		closer.innerHTML = "&times";
		closer.title = ZhiUTech.Viewing.i18n.translate("End video call");
		closer.onclick = function(e) {
			scope.p2p.hangup();
			scope.removeVideoPanel();
		};
		this.videoPanel.appendChild(closer);

		this.content.insertBefore(this.videoPanel, this.chatHistory);

		this.fixComponentPlacement();
	};

	DockingCollabPanel.prototype.removeCollabPrompt = function() {
		var box = document.getElementById("collabBox")
		if(box) {
			box.style.visibility = "hidden";
			this.viewer.container.removeChild(box);
		}
	};

	DockingCollabPanel.prototype.removeVideoPanel = function() {
		if(this.videoPanel)
			this.content.removeChild(this.videoPanel);
		this.videoPanel = null;
	};

	DockingCollabPanel.prototype.reset = function(e) {
		if(this.tbody) {
			var empty = document.createElement("tbody");
			this.table.replaceChild(empty, this.tbody);
			this.tbody = empty;
		}
		this.chatHistory.textContent = "";
		this.textInput.value = "";
		this.removeVideoPanel();
		this.removeCollabPrompt();
	};

	CollabPromptBox = function() {};
	CollabPromptBox.prototype.start = function(container, cb, titleText, buttonText, isInviteWindow) {
		if(!container) return;

		// Prevent multiple instantiations of invite boxes by spamming the 'Invite' button in collab panel.
		if(document.getElementById("collabBox")) {
			return;
		}

		var box = document.createElement("div");
		// If you change this id, make sure this.collabButton.onClick also updated to reflect new id.
		box.id = "collabBox";
		box.className = "collabBox";
		container.appendChild(box);

		var title = document.createElement("div");
		title.className = "collabBoxTitle";
		title.textContent = ZhiUTech.Viewing.i18n.translate(
			titleText, {
				"defaultValue": titleText
			});
		box.appendChild(title);

		var text = document.createElement("span");
		text.className = "collabBoxText";
		var label = "Enter your name";
		if(isInviteWindow) {
			label = "Review URL";
		}
		text.textContent = ZhiUTech.Viewing.i18n.translate(
			label, {
				"defaultValue": label
			});
		box.appendChild(text);

		var inputContainer = document.createElement("span");
		inputContainer.className = "collabBoxInputContainer";
		box.appendChild(inputContainer);
		var input = document.createElement("input");
		input.type = "text";
		input.className = "collabBoxInputText";
		if(isInviteWindow) {
			var url = window.location.toString();
			if(url.indexOf("?") == -1) {
				url += "?invited=true";
			} else {
				url += "&invited=true";
			}
			if(ZhiUTech.Viewing.Private.docItemId) {
				url += "&itemid=" + ZhiUTech.Viewing.Private.docItemId;
			}

			//Prevent Helios forwarding to Mobile app when the link is for RTC session (no RTC on Mobile)
			url += "&doNotRedirect=true";

			input.value = url;
		}
		inputContainer.appendChild(input);

		input.onkeyup = function(e) {
			if(e.keyCode == 13) {
				box.style.visibility = "hidden";
				container.removeChild(box);
				zvp.setUserName(input.value);
				cb();
			}
		};

		var close = document.createElement("div");
		close.className = "collabBoxClose";
		close.innerHTML = "&times;";
		close.addEventListener("click", function(event) {
			box.style.visibility = "hidden";
			container.removeChild(box);
		});
		box.appendChild(close);

		if(isInviteWindow) {
			/*
			var copy = document.createElement("div");
			copy.className = "collabBoxCopy";
			copy.textContent = ZhiUTech.Viewing.i18n.translate( "Copy", { "defaultValue" : "Copy" } );
			copy.addEventListener("click", function(event) {

			});
			box.appendChild(copy);
			*/
			var text = document.createElement("span");
			text.className = "collabBoxText";
			text.style.marginTop = "0px";
			var label = "Copy and send this URL to invite others";

			text.textContent = ZhiUTech.Viewing.i18n.translate(
				label, {
					"defaultValue": label
				});
			box.appendChild(text);
		} else {
			var ok = document.createElement("div");
			ok.className = "collabBoxOK";
			ok.textContent = ZhiUTech.Viewing.i18n.translate(buttonText, {
				"defaultValue": buttonText
			});

			ok.addEventListener("click", function(event) {
				box.style.visibility = "hidden";
				container.removeChild(box);
				if(input.value.trim() !== "") {
					zvp.setUserName(input.value);
				}
				cb();
			});
			box.appendChild(ok);
		}
		box.style.visibility = "visible";

		input.focus();
		if(isInviteWindow)
			input.select();
	};

	avec.DockingCollabPanel = DockingCollabPanel;
	avec.CollabPromptBox = CollabPromptBox;

})();;

(function() {

	'use strict';

	var avet = ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.DefaultTools');

	var zv = ZhiUTech.Viewing,
		AVU = zv.UI;

	var NavToolsExtension = function(viewer, options) {
		zv.Extension.call(this, viewer, options);
		this.name = 'navtools';
		this.modes = ['pan', 'dolly', 'freeorbit', 'orbit', 'fov', 'worldup', 'fittoview'];
	};

	NavToolsExtension.prototype = Object.create(zv.Extension.prototype);
	NavToolsExtension.prototype.constructor = NavToolsExtension;

	var proto = NavToolsExtension.prototype;

	function createNavToggler(self, button, name) {
		return function() {
			var state = button.getState();
			if(state === AVU.Button.State.INACTIVE) {
				self.activate(name);
				button.setState(AVU.Button.State.ACTIVE);
			} else if(state === AVU.Button.State.ACTIVE) {
				self.deactivate();
				button.setState(AVU.Button.State.INACTIVE);
			}
		};
	};

	proto.load = function() {
		var viewer = this.viewer;

		// Register tools
		var fovtool = new zv.FovTool(viewer);
		var rolltool = new zv.WorldUpTool(viewer.impl, viewer);

		viewer.toolController.registerTool(fovtool);
		viewer.toolController.registerTool(rolltool);

		this.createUI();
		this.initCameraStateMachine();
		this.initFocalLengthOverlay();

		return true;
	};

	proto.createUI = function() {
		// Adds the UI for the default navigation tools (orbit, pan, dolly, camera controls)
		var viewer = this.viewer;
		var toolbar = viewer.getToolbar(true);
		var navTools = toolbar.getControl(zv.TOOLBAR.NAVTOOLSID);
		var navActionDisplayMode = function(action) {
			return viewer.navigation.isActionEnabled(action) ? 'block' : 'none'
		};

		if(viewer.model.is3d()) {
			var orbitToolsButton = new AVU.ComboButton('toolbar-orbitTools');
			orbitToolsButton.setToolTip('Orbit');
			orbitToolsButton.setIcon("zu-icon-orbit-constrained");
			orbitToolsButton.setDisplay(navActionDisplayMode('orbit'));

			this.createOrbitSubmenu(orbitToolsButton);

			navTools.addControl(orbitToolsButton);
			navTools.orbittoolsbutton = orbitToolsButton;
			orbitToolsButton.setState(AVU.Button.State.ACTIVE);

			navTools.returnToDefault = function() {
				orbitToolsButton.setState(AVU.Button.State.ACTIVE);
			};
		}

		var panButton = new AVU.Button('toolbar-panTool');
		panButton.setToolTip('Pan');
		panButton.setIcon("zu-icon-pan");
		panButton.onClick = createNavToggler(this, panButton, 'pan');
		panButton.setDisplay(navActionDisplayMode('pan'));

		navTools.addControl(panButton);
		navTools.panbutton = panButton;

		if(viewer.model.is2d()) {
			navTools.returnToDefault = function() {
				panButton.setState(AVU.Button.State.ACTIVE);
			};
			navTools.returnToDefault(); // Assume 'pan' is the default navigation tool.
		};

		var dollyButton = new AVU.Button('toolbar-zoomTool');
		dollyButton.setToolTip('Zoom');
		dollyButton.setIcon("zu-icon-zoom");
		dollyButton.onClick = createNavToggler(this, dollyButton, 'dolly');
		dollyButton.setDisplay(navActionDisplayMode('zoom'));

		navTools.addControl(dollyButton);
		navTools.dollybutton = dollyButton;

		var cameraButton = new AVU.ComboButton('toolbar-cameraSubmenuTool');
		cameraButton.setToolTip('Camera interactions');
		cameraButton.setIcon("zu-icon-camera");
		cameraButton.saveAsDefault();
		this.createCameraSubmenu(cameraButton);
		navTools.addControl(cameraButton);
		navTools.camerabutton = cameraButton;
	};

	proto.createOrbitSubmenu = function(parentButton) {
		var viewer = this.viewer;
		var toolbar = viewer.getToolbar(true);
		var navTools = toolbar.getControl(zv.TOOLBAR.NAVTOOLSID);

		var freeOrbitButton = new AVU.Button('toolbar-freeOrbitTool');
		freeOrbitButton.setToolTip('Free orbit');
		freeOrbitButton.setIcon("zu-icon-orbit-free");
		freeOrbitButton.onClick = createNavToggler(this, freeOrbitButton, 'freeorbit');

		parentButton.addControl(freeOrbitButton);
		navTools.freeorbitbutton = freeOrbitButton;

		var orbitButton = new AVU.Button('toolbar-orbitTool');
		orbitButton.setToolTip('Orbit');
		orbitButton.setIcon("zu-icon-orbit-constrained");
		orbitButton.onClick = createNavToggler(this, orbitButton, 'orbit');

		parentButton.addControl(orbitButton);
		navTools.orbitbutton = orbitButton;

		parentButton.onClick = orbitButton.onClick; // default

	};

	proto.createCameraSubmenu = function(parentButton) {
		var self = this;
		var viewer = this.viewer;
		var toolbar = viewer.getToolbar(true);
		var navTools = toolbar.getControl(zv.TOOLBAR.NAVTOOLSID);
		var navActionDisplayMode = function(action) {
			return viewer.navigation.isActionEnabled(action) ? 'block' : 'none'
		};

		if(zv.isTouchDevice()) {
			var homeButton = new AVU.Button('toolbar-homeTool');
			homeButton.setToolTip('Home');
			homeButton.setIcon("zu-icon-home");
			homeButton.onClick = function() {
				viewer.navigation.setRequestHomeView(true);
				var defaultNavToolName = viewer.getDefaultNavigationToolName();
				self.activate(defaultNavToolName);
				parentButton.restoreDefault();
			};
			homeButton.setDisplay(navActionDisplayMode('gotoview'));

			parentButton.addControl(homeButton);
			navTools.homebutton = homeButton;
		}

		//options = { defaultTooltipValue : "Fit to view (F)" };
		var fitToViewButton = new AVU.Button('toolbar-fitToViewTool');
		fitToViewButton.setToolTip('Fit to view');
		fitToViewButton.setIcon("zu-icon-fit-to-view");
		fitToViewButton.onClick = function(e) {
			viewer.impl.fitToView(viewer.impl.selector.getAggregateSelection());
			var defaultNavToolName = viewer.getDefaultNavigationToolName();
			viewer.setActiveNavigationTool(defaultNavToolName);
			parentButton.restoreDefault();
		};
		fitToViewButton.setDisplay(navActionDisplayMode('gotoview'));

		parentButton.addControl(fitToViewButton);
		navTools.fovbutton = fitToViewButton;

		if(viewer.model.is3d()) {
			//options.defaultTooltipValue = "Focal length (Ctrl+Shift drag)";
			var fovButton = new AVU.Button('toolbar-focalLengthTool');
			fovButton.setToolTip('Focal length');
			fovButton.setIcon("zu-icon-fov");
			fovButton.onClick = createNavToggler(this, fovButton, 'fov');
			fovButton.setDisplay(navActionDisplayMode('fov'));

			parentButton.addControl(fovButton);
			navTools.fovbutton = fovButton;
		}

		//options.defaultTooltipValue = "Roll (Alt+Shift drag)";
		var rollButton = new AVU.Button('toolbar-rollTool');
		rollButton.setToolTip('Roll');
		rollButton.setIcon("zu-icon-roll");
		rollButton.onClick = createNavToggler(this, rollButton, 'worldup');
		rollButton.setDisplay(navActionDisplayMode('roll'));

		parentButton.addControl(rollButton);
		navTools.rollbutton = rollButton;
	};

	proto.initCameraStateMachine = function(mode) {
		var self = this;
		var viewer = this.viewer;
		var toolbar = viewer.getToolbar(true);
		var navTools = toolbar.getControl(zv.TOOLBAR.NAVTOOLSID);

		this.toolChangedHandler = function(e) {
			if(e.toolName === "fov") {
				self.showFocalLengthOverlay(e.active);
			}
		};
		viewer.addEventListener(zv.TOOL_CHANGE_EVENT, this.toolChangedHandler);

		this.navChangedHandler = function(e) {
			if(viewer.getDefaultNavigationToolName() === e.id)
				navTools.returnToDefault();
		};
		viewer.addEventListener(zv.NAVIGATION_MODE_CHANGED_EVENT, this.navChangedHandler);
	};

	proto.initFocalLengthOverlay = function() {

		var container = this.focallength = document.createElement("div");

		container.classList.add("message-panel");
		container.classList.add("docking-panel");
		container.classList.add("focal-length");
		container.classList.add("docking-panel-container-solid-color-b");

		var table = document.createElement("table");
		var tbody = document.createElement("tbody");
		table.appendChild(tbody);

		container.appendChild(table);
		this.viewer.container.appendChild(container);

		var row = tbody.insertRow(-1);
		var cell = row.insertCell(0);
		cell.classList.add("name");
		cell.setAttribute("data-i18n", "Focal Length");
		cell.textContent = ZhiUTech.Viewing.i18n.translate("Focal Length");

		cell = row.insertCell(1);
		cell.classList.add("value");
		cell.textContent = '';
		this.fovCell = cell;

		container.style.visibility = "hidden";
	};

	proto.showFocalLengthOverlay = function(state) {
		var self = this;
		var viewer = this.viewer;
		var myFocalLength = 0;

		function showFovHudMessage(yes) {
			if(yes) {
				// Display a hud messages.
				var messageSpecs = {
					"msgTitleKey": "Orthographic View Set",
					"messageKey": "The view is set to Orthographic",
					"messageDefaultValue": "The view is set to Orthographic. Changing the focal length will switch to Perspective."
				};
				zv.Private.HudMessage.displayMessage(viewer.container, messageSpecs);
			} else {
				zv.Private.HudMessage.dismiss();
			}
		}

		function showFov(yes) {
			if(yes) updateFOV();

			if(self.focallength)
				self.focallength.style.visibility = yes ? "visible" : "hidden";
		}

		function updateFOV() {
			var camFocalLength = viewer.getFocalLength();
			if(myFocalLength !== camFocalLength) {
				myFocalLength = camFocalLength;
				self.fovCell.textContent = camFocalLength.toString() + " mm";
			}
		}

		function watchFOV(e) {
			updateFOV();
			// If camera changed to ORTHO and we are still in FOV mode
			// put up the warning message that the system will switch to perspective.
			//
			if(viewer.toolController.getActiveToolName() === "fov") {
				var camera = viewer.navigation.getCamera();
				var isOrtho = camera && !camera.isPerspective;

				showFov(!isOrtho);
				showFovHudMessage(isOrtho);
			}
		}
		var camera = viewer.navigation.getCamera();
		var isOrtho = camera && !camera.isPerspective;

		showFov(state && !isOrtho);
		showFovHudMessage(state && isOrtho);

		if(state) {
			viewer.addEventListener(zv.CAMERA_CHANGE_EVENT, watchFOV);
		} else {
			viewer.removeEventListener(zv.CAMERA_CHANGE_EVENT, watchFOV);
		}
	};

	proto.unload = function() {
		this.destroyUI();

		return true;
	};

	proto.destroyUI = function() {
		// Removes the UI created in createUI
		var viewer = this.viewer;
		var toolbar = viewer.getToolbar(false);

		if(!toolbar) {
			return true;
		}

		var navTools = toolbar.getControl(zv.TOOLBAR.NAVTOOLSID);

		if(!navTools) {
			return true;
		}

		if(viewer.model && viewer.model.is3d()) {
			navTools.orbittoolsbutton.subMenu.removeEventListener(AVU.RadioButtonGroup.Event.ACTIVE_BUTTON_CHANGED, navTools.orbittoolsbutton.subMenuActiveButtonChangedHandler(navTools));
			navTools.removeControl(navTools.orbittoolsbutton.getId());
			navTools.orbittoolsbutton = null;
			navTools.orbitbutton.onClick = null;
			navTools.orbitbutton = null;
			navTools.freeorbitbutton.onClick = null;
			navTools.freeorbitbutton = null;
		}

		navTools.removeControl(navTools.panbutton.getId());
		navTools.panbutton.onClick = null;
		navTools.panbutton = null;

		navTools.removeControl(navTools.dollybutton.getId());
		navTools.dollybutton.onClick = null;
		navTools.dollybutton = null;

		navTools.camerabutton.subMenu.removeEventListener(AVU.RadioButtonGroup.Event.ACTIVE_BUTTON_CHANGED, navTools.camerabutton.subMenuActiveButtonChangedHandler(navTools));
		navTools.removeControl(navTools.camerabutton.getId());
		navTools.camerabutton.onClick = null;
		navTools.camerabutton = null;

		navTools.rollbutton.onClick = null;
		navTools.rollbutton = null;
		navTools.fovbutton.onClick = null;
		navTools.fovbutton = null;

		this.focallength = null;

		// Remove Listeners
		viewer.removeEventListener(zv.TOOL_CHANGE_EVENT, this.toolChangedHandler);
		this.toolChangedHandler = null;
		viewer.removeEventListener(zv.NAVIGATION_MODE_CHANGED_EVENT, this.navChangedHandler);
		this.navChangedHandler = null;

		return true;
	};

	proto.activate = function(mode) {
		if(this.activeStatus && this.mode === mode) {
			return;
		}
		var defaultNavToolName = this.viewer.getDefaultNavigationToolName();
		switch(mode) {
			default:
				case 'pan':
				this.viewer.setActiveNavigationTool('pan');
			this.mode = 'pan';
			break;
			case 'dolly':
					case 'orbit':
					case 'freeorbit':
					case 'fov':
					case 'worldup':
					this.viewer.setActiveNavigationTool(mode);
				this.mode = mode;
				break;
			case 'fittoview':
					this.viewer.impl.fitToView(this.viewer.impl.selector.getAggregateSelection());
				this.viewer.setActiveNavigationTool(defaultNavToolName);
				this.mode = 'fittoview';
				break;
		}
		this.activeStatus = true;
		return true;
	};

	proto.deactivate = function() {
		if(this.activeStatus) {
			this.viewer.setActiveNavigationTool();
			this.activeStatus = false;
		}
		return true;
	};

	avet.NavToolsExtension = NavToolsExtension;

	zv.theExtensionManager.registerExtension('ZhiUTech.DefaultTools.NavTools', NavToolsExtension);

})();;
(function() {
	'use strict';

	var namespace = ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.ZoomWindow');

	function ZoomWindow(viewer, options) {
		ZhiUTech.Viewing.Extension.call(this, viewer, options);
		this.createUIBound = function() {
			viewer.removeEventListener(zv.TOOLBAR_CREATED_EVENT, this.createUIBound);
			this.createUI(this.viewer.getToolbar(false));
		}.bind(this);
		this.name = 'zoomwindow';
		this.modes = ['zoomwindow', 'dolly'];
	}

	ZoomWindow.prototype = Object.create(ZhiUTech.Viewing.Extension.prototype);
	ZoomWindow.prototype.constructor = ZoomWindow;

	var proto = ZoomWindow.prototype;

	proto.load = function() {
		var viewer = this.viewer;

		// Init & Register tool
		this.tool = new namespace.ZoomWindowTool(viewer);
		viewer.toolController.registerTool(this.tool);

		// Add the ui to the viewer.
		this.createUI(viewer.getToolbar(false));
		return true;
	};

	proto.createUI = function(toolbar) {
		var navTools;
		if(!toolbar || !(navTools = toolbar.getControl(ZhiUTech.Viewing.TOOLBAR.NAVTOOLSID)) || !navTools.dollybutton) {
			// tool bars aren't built yet, wait until they are
			this.viewer.addEventListener(zv.TOOLBAR_CREATED_EVENT, this.createUIBound);
			return;
		}

		var self = this;
		// remove default zoom tool
		navTools.removeControl(navTools.dollybutton.getId());
		this.defaultDollyButton = navTools.dollybutton;

		// add combo button for zoom tool
		this.zoomWindowToolButton = new ZhiUTech.Viewing.UI.ComboButton('toolbar-zoomTools');
		this.zoomWindowToolButton.setIcon('zoomwindowtoolicon-zoom-window');
		this.zoomWindowToolButton.setToolTip('Zoom window');
		this.createZoomSubmenu(this.zoomWindowToolButton);
		navTools.addControl(this.zoomWindowToolButton);

		// Escape hotkey to exit tool.
		//
		var hotkeys = [{
			keycodes: [
				ZhiUTech.Viewing.theHotkeyManager.KEYCODES.ESCAPE
			],
			onRelease: function() {
				if(self.zoomWindowToolButton.getState() === ZhiUTech.Viewing.UI.Button.State.ACTIVE) {
					self.viewer.setActiveNavigationTool();
					self.zoomWindowToolButton.setState(ZhiUTech.Viewing.UI.Button.State.INACTIVE);
				}
			}
		}];
		ZhiUTech.Viewing.theHotkeyManager.pushHotkeys(this.escapeHotkeyId, hotkeys);
	};

	proto.destroyUI = function() {
		var viewer = this.viewer;
		var toolbar = viewer.getToolbar(false);
		if(toolbar) {
			var navTools = toolbar.getControl(ZhiUTech.Viewing.TOOLBAR.NAVTOOLSID);
			if(navTools) {
				if(this.zoomWindowToolButton) {
					this.zoomWindowToolButton.subMenu.removeEventListener(
						ZhiUTech.Viewing.UI.RadioButtonGroup.Event.ACTIVE_BUTTON_CHANGED,
						this.zoomWindowToolButton.subMenuActiveButtonChangedHandler(navTools));
					navTools.removeControl(this.zoomWindowToolButton.getId());
				}
				this.zoomWindowToolButton = null;
				// set back dolly button
				if(navTools.panbutton && this.defaultDollyButton) {
					navTools.addControl(this.defaultDollyButton);
				} else {
					this.defaultDollyButton = null;
				}
			}
		}
		ZhiUTech.Viewing.theHotkeyManager.popHotkeys(this.escapeHotkeyId);
	};

	proto.createZoomSubmenu = function(parentButton) {

		var createNavToggler = function(self, button, name) {
			return function() {
				var state = button.getState();
				if(state === ZhiUTech.Viewing.UI.Button.State.INACTIVE) {
					self.activate(name);
					button.setState(ZhiUTech.Viewing.UI.Button.State.ACTIVE);
				} else if(state === ZhiUTech.Viewing.UI.Button.State.ACTIVE) {
					self.deactivate();
					button.setState(ZhiUTech.Viewing.UI.Button.State.INACTIVE);
				}
			};
		}

		var viewer = this.viewer;
		var toolbar = viewer.getToolbar(true);
		var navTools = toolbar.getControl(ZhiUTech.Viewing.TOOLBAR.NAVTOOLSID);

		// zoom window
		var zoomWindowToolBut = new ZhiUTech.Viewing.UI.Button('toolbar-zoomWindowTool');
		zoomWindowToolBut.setToolTip(ZhiUTech.Viewing.i18n.translate("Zoom window"));
		zoomWindowToolBut.setIcon('zoomwindowtoolicon-zoom-window');
		zoomWindowToolBut.onClick = createNavToggler(this, zoomWindowToolBut, 'zoomwindow');
		parentButton.addControl(zoomWindowToolBut);
		// zoom
		var dollyBut = new ZhiUTech.Viewing.UI.Button('toolbar-zoomTool');
		dollyBut.setToolTip('Zoom');
		dollyBut.setIcon('zu-icon-zoom');
		dollyBut.onClick = createNavToggler(this, dollyBut, 'dolly');
		parentButton.addControl(dollyBut);
	};

	proto.unload = function() {
		var viewer = this.viewer;
		if(viewer.getActiveNavigationTool() === "dolly" ||
			viewer.getActiveNavigationTool() === "zoomwindow") {
			viewer.setActiveNavigationTool();
		}
		// Remove the UI
		this.destroyUI();
		// Deregister tool
		viewer.toolController.deregisterTool(this.tool);
		this.tool = null;

		return true;
	};

	proto.activate = function(mode) {
		if(this.activeStatus && this.mode === mode) {
			return;
		}
		switch(mode) {
			default:
				case 'zoomwindow':
				this.viewer.setActiveNavigationTool('zoomwindow');
			this.mode = 'zoomwindow';
			break;
			case 'dolly':
					this.viewer.setActiveNavigationTool('dolly');
				this.mode = 'dolly';
				break;
		}
		this.activeStatus = true;
		return true;
	};

	proto.deactivate = function() {
		if(this.activeStatus) {
			this.viewer.setActiveNavigationTool();
			this.activeStatus = false;
		}
		return true;
	};

	ZhiUTech.Viewing.theExtensionManager.registerExtension('ZhiUTech.Viewing.ZoomWindow', ZoomWindow);
})();;
(function() {
	'use strict';

	ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.ZoomWindow');

	var _DEG_TO_RAD = 0.017453292519943295769;
	var _CROSS_MAX_WIDTH = 20;

	/**
	 *
	 * @constructor
	 */
	function ZoomWindowTool(viewer) {
		var _names = ["zoomwindow"];
		var _isActive = false;
		var _isDragging = false;
		var _mouseStart = new THREE.Vector3(0, 0, -10);
		var _mouseEnd = new THREE.Vector3(0, 0, -10);

		var materialLine = null;
		var lineGeom = null;
		var crossGeomX = null;
		var crossGeomY = null;

		var rectGroup = null;
		var _camera = viewer.navigation.getCamera();

		this.isActive = function() {
			return _isActive;
		};

		this.getNames = function() {
			return _names;
		};

		this.getName = function() {
			return _names[0];
		};

		this.onResize = function() {
			rectGroup = null;
			var canvas = viewer.canvas;
			var canvasWidth = canvas.clientWidth;
			var canvasHeight = canvas.clientHeight;
			var camera = new THREE.OrthographicCamera(0, canvasWidth, 0, canvasHeight, 1, 1000);
			viewer.impl.overlayScenes["ZoomWindowRect"].camera = camera;
		};

		this.activate = function(name) {
			_isActive = true;
			// predefine material for rect
			if(materialLine === null) {
				// for 2d file draw rectangle in black
				var rectColor = null;
				if(viewer.navigation.getIs2D()) {
					rectColor = new THREE.Color(0x000000);
				} else {
					rectColor = new THREE.Color(0xffffff);
				}
				materialLine = new THREE.LineBasicMaterial({
					color: rectColor,
					opacity: .6,
					linewidth: 1,
					depthTest: false,
					depthWrite: false,
				});
			}
			// create overlay scene, with orthographic Camera
			var canvas = viewer.canvas;
			var canvasWidth = canvas.clientWidth;
			var canvasHeight = canvas.clientHeight;
			var camera = new THREE.OrthographicCamera(0, canvasWidth, 0, canvasHeight, 1, 1000);

			viewer.impl.createOverlayScene("ZoomWindowRect", materialLine, materialLine, camera);
			viewer.impl.api.addEventListener(ZhiUTech.Viewing.VIEWER_RESIZE_EVENT, this.onResize);

			// ??? In zoom window tool, we let orbitDollyPanTool to handle
			// ??? pan and dolly. And also we need get correct cursor info
			// ??? in orbitDollyPanTool. But in 2D, orbitDollyPanTool's default
			// ??? cursor is pan, then we have no idea whether orbitDollyPanTool
			// ??? is handling the message.
			// ??? So set orbit tool as active tool when zoom window tool active.
			// ??? On deactive we need set back the correct active tool to orbitDollyPanTool
			var tool = viewer.toolController.getTool("dolly");
			tool.activate("orbit");
		};

		this.deactivate = function(name) {
			rectGroup = null;
			viewer.impl.removeOverlayScene("ZoomWindowRect");
			_isActive = false;
			_isDragging = false;
			_mouseStart.set(0, 0, -10);
			_mouseEnd.set(0, 0, -10);
			viewer.impl.api.removeEventListener(ZhiUTech.Viewing.VIEWER_RESIZE_EVENT, this.onResize);

			// ??? Refer to the comments in activate
			var tool = viewer.toolController.getTool("dolly");
			tool.deactivate("orbit");
		};

		this.getCursor = function() {
			var tool = viewer.toolController.getTool("dolly");
			var mode = tool.getTriggeredMode();
			switch(mode) {
				case "dolly":
					return "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAgVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8mJiYAAADNzc2/v7+fn59paWlPT08MDAwICAj6+vqpqak7Ozv29vby8vLp6em2traAgIBkZGRZWVlAQEAaGhpISEgkS7tbAAAAFHRSTlMAOvhpZD8mkQWegMy9qY1YVE01EYiqlE0AAADZSURBVCjPbY9ZloMgEAAbEbfsmRZZXbJn7n/AAX2RQVN/VD26AXLOeZLDGo6IbfI9tHq8cdxuj1HwvgCoaiHqKoRk+M3hB9jueUW8PnfsE/bJ3vms7nCkq7NoE3s99AXxoh8vFoXCpknrn5faAuJCenT0xPkYqnxQFJaU0gdZrsKm8aHZrAIffBj40mc1jsTfIJRWegq6opTMvlfqLqYg7kr1ZB7jFgeaMC59N//8O4WZ1IiPF8b5wMHcJn8zB4g4mc77zpxgAbMSUVoGK4iV0hL4wrksz+H0Bw5+E+HrniDQAAAAAElFTkSuQmCC), auto";
				case "pan":
					return "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAABHVBMVEUAAABPTk4AAAAAAAAJCQkRERE0MzQQEBAODg4QEBB4d3dbWlo9PDw/Pj4vLy8sLCwZGBgWFhYcHBwKCgoSEhIAAAAKCgoICAgKCgoQEBAODg4EBAQICAgPDw8REREMDAx2dnY0NDQvLy9QUFAaGhomJSYjIyM7OjokJCQNDA0mJiYNDQ0AAAAUFBQJCQkQEBAEBAQNDQ0PDw8VFRX///+amJkAAAD5+fnz8/PKycn9/f339vbi4eLR0dDNzMyAgIB8e3xycHH7+/vw7+/o6OjX1ta7urq4t7iwsLCnp6eioqKbmppva21OTk74+Pjl5eXc3Nzb29vLy8vDw8PDwsKrqqqdnZ2WlpaSkpKTkZKMiouEg4NkZGRISEgxLzBpgbsEAAAANHRSTlMA+fiQXgngKSYG/vX17uvBuqackpCNg3BpUkpAPBwTDvj18+vl0s/NwrOwoZZ+TDg4NBkBGrzX8QAAAP5JREFUKM99j9Vuw0AQRdeuKZyGkyZNmbnXDLHDVGb8/8/oy7paK1bO0+oc7WiGnGiaxq+QRTQAOh8f9Jv4H/Ge8PZPrCdlvkxfYluUT2WyyCq3mZ7unwlKVLcqOzA/Mf71j0TWJ/Ym6rPeca05Ni4iIevYc7yoUD2zQFhq71BdI9nvBeBabFDSPe8DswlUc1Riw3VxbH0NHBUPQ0jrbDnPYDjALQBMq9E7nkC5y7VDKTZlUg8Q0lmjvl74zlYErgvKa42GPKf3/a0kQmYCDY1SYMDosqMoiWrGwz/uAbNvc/fNon4kXRKGq+PUo2Mb96afV0iUxqGU2s4VBbKUP65NL/LKF+7ZAAAAAElFTkSuQmCC), auto";
			}
			return "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAADWSURBVEiJ1ZVNEsIwCEYfTg/UjTPuemcvojfCRRMlNKGdKguZyaLkK4/8EERVybQJQERCUU3C63p+n/Bk9QHDRtbIX2GqKh6woRfxLdL0/M1KzYRaA+7AXDW9wN5fvrXEWud6AOABLD7QwREDgCdw7WV6ZjSAsi0Lzn4JmEcHeHbYWxQXw3FTEWmvaWY1X9Iie4CIKHE1fwfIsnSAZD/X/79FGbdISyzA9QMDG3axTTTVwx3NaNbm5B2dRHY1DWCUyd4qIs0bUB8nuz32/11Cu+KPM7sOXlrOS4sOkzb1AAAAAElFTkSuQmCC), auto";
		};

		function getEventModifierState(event) {
			return true;
		}

		/////////////////////////////////////////////////////////////////////////
		// Tool event handler callbacks - can use "this".

		this.handleGesture = function(event) {
			switch(event.type) {
				case "dragstart":
					return this.handleButtonDown(event, 0);

				case "dragmove":
					return this.handleMouseMove(event);

				case "dragend":
					return this.handleButtonUp(event, 0);
			}
			return false;
		};

		this.handleSingleClick = function(event, button) {
			return true;
		};

		this.startDrag = function(event) {
			if(_isDragging === false) {
				// begin dragging
				_isDragging = true;
				_mouseStart.x = event.canvasX;
				_mouseStart.y = event.canvasY;
				_mouseEnd.x = event.canvasX;
				_mouseEnd.y = event.canvasY;
				if(rectGroup === null) {
					lineGeom = new THREE.Geometry();
					// rectangle of zoom window
					lineGeom.vertices.push(
						_mouseStart.clone(),
						_mouseStart.clone(),
						_mouseStart.clone(),
						_mouseStart.clone(),
						_mouseStart.clone());
					// cross for identify zoom window center.
					crossGeomX = new THREE.Geometry();
					crossGeomX.vertices.push(
						_mouseStart.clone(),
						_mouseStart.clone());
					crossGeomY = new THREE.Geometry();
					crossGeomY.vertices.push(
						_mouseStart.clone(),
						_mouseStart.clone());

					// add geom to group
					var line_mesh = new THREE.Line(lineGeom, materialLine, THREE.LineStrip);
					var line_cross_x = new THREE.Line(crossGeomX, materialLine, THREE.LineStrip);
					var line_cross_y = new THREE.Line(crossGeomY, materialLine, THREE.LineStrip);

					rectGroup = new THREE.Group();
					rectGroup.add(line_mesh);
					rectGroup.add(line_cross_x);
					rectGroup.add(line_cross_y);
				} else {
					lineGeom.vertices[0] = _mouseStart.clone();
					lineGeom.vertices[1] = _mouseStart.clone();
					lineGeom.vertices[2] = _mouseStart.clone();
					lineGeom.vertices[3] = _mouseStart.clone();
					lineGeom.vertices[4] = _mouseStart.clone();

					crossGeomX.vertices[0] = _mouseStart.clone();
					crossGeomX.vertices[1] = _mouseStart.clone();
					crossGeomY.vertices[0] = _mouseStart.clone();
					crossGeomY.vertices[1] = _mouseStart.clone();

					crossGeomX.verticesNeedUpdate = true;
					crossGeomY.verticesNeedUpdate = true;
					lineGeom.verticesNeedUpdate = true;
				}
				viewer.impl.addOverlay("ZoomWindowRect", rectGroup);
			}
		};

		this.handleButtonDown = function(event, button) {
			// only handle left button down
			if(button === 0) {
				this.startDrag(event);
				return true;
			}
			return false;
		};

		this.handleMouseMove = function(event) {
			if(lineGeom && _isDragging) {
				_mouseEnd.x = event.canvasX;
				_mouseEnd.y = event.canvasY;
				return true;
			}

			return false; // Eat all these so default tools don't screw with view
		};

		this.endDrag = function(event) {
			if(_isDragging === true) {
				viewer.impl.removeOverlay("ZoomWindowRect", rectGroup);
				_isDragging = false;

			}
		};

		this.handleButtonUp = function(event, button) {
			if(button === 0) {
				this.endDrag();
				return true;
			}
			return false;
		};

		this.handleKeyDown = function(event, keyCode) {
			return false;
		};

		this.handleKeyUp = function(event, keyCode) {
			return false;
		};

		this.handleWheelInput = function(delta) {
			return false;
		};

		this.handleSingleClick = function(event, button) {
			return false;
		};

		this.handleDoubleClick = function(event, button) {
			return false;
		};

		this.handleSingleTap = function(even) {
			return false;
		};

		this.handleDoubleTap = function(event) {
			return false;
		};

		this.handleBlur = function(event) {
			return false;
		};

		this.update = function() {
			//
			if(!this.isActive())
				return;

			if(lineGeom && _isDragging) {
				// draw rectangle
				lineGeom.vertices[1].x = _mouseStart.x;
				lineGeom.vertices[1].y = _mouseEnd.y;
				lineGeom.vertices[2] = _mouseEnd.clone();
				lineGeom.vertices[3].x = _mouseEnd.x;
				lineGeom.vertices[3].y = _mouseStart.y;
				lineGeom.vertices[4] = lineGeom.vertices[0];

				// draw cross
				var width = Math.abs(_mouseEnd.x - _mouseStart.x);
				var height = Math.abs(_mouseEnd.y - _mouseStart.y);
				var length = width > height ? height : width;
				if(length > _CROSS_MAX_WIDTH) {
					length = _CROSS_MAX_WIDTH;
				}
				var half_length = length * 0.5;

				var cross_center = [(_mouseEnd.x + _mouseStart.x) * 0.5,
					(_mouseEnd.y + _mouseStart.y) * 0.5
				];

				crossGeomX.vertices[0].x = cross_center[0] - half_length;
				crossGeomX.vertices[0].y = cross_center[1];
				crossGeomX.vertices[1].x = cross_center[0] + half_length;
				crossGeomX.vertices[1].y = cross_center[1];

				crossGeomY.vertices[0].x = cross_center[0];
				crossGeomY.vertices[0].y = cross_center[1] - half_length;
				crossGeomY.vertices[1].x = cross_center[0];
				crossGeomY.vertices[1].y = cross_center[1] + half_length;

				crossGeomX.verticesNeedUpdate = true;
				crossGeomY.verticesNeedUpdate = true;
				lineGeom.verticesNeedUpdate = true;
				// only redraw overlay
				viewer.impl.invalidate(false, false, true);
			} else {
				return this.zoomWindow();
			}

			return false;
		};

		this.getPivot = function(mouseX, mouseY, screenWidth, screenHeight, camera) {
			// Convert mouse coordinates to clip space (-1 to 1)
			mouseX = 2 * mouseX / screenWidth - 1;
			mouseY = 1 - 2 * mouseY / screenHeight;

			// Get the ray through mouseX, mouseY
			var start = new THREE.Vector3(mouseX, mouseY, -1);
			var dir = new THREE.Vector3(mouseX, mouseY, 1);
			start.unproject(camera);
			dir.unproject(camera);
			dir.sub(start);

			// Now project the ray onto the plane perpendicular to the view direction
			// that contains the camera target. To do this we solve these equations:
			// viewDir.dot(pivot) == viewDir.dot(target), because the pivot is in the plane of the target
			// pivot = start + t * dir for some t, because pivot is on the ray through mouseX, mouseY
			// The solution goes like this:
			// Substitute pivot from the second equation to the first
			// viewDir.dot(start + t * dir) == viewDir.dot(target)
			// Distribut dot()
			// viewDir.dot(start) + t * viewDir.dot(dir) == view.dot(target)
			// t = (viewDir.dot(target) - viewDir.dot(start)) / view.dot(dir)
			var eye = camera.position;
			var target = camera.target;
			var viewDir = target.clone().sub(eye).normalize();
			var t = (viewDir.dot(target) - viewDir.dot(start)) / viewDir.dot(dir);
			start.add(dir.multiplyScalar(t));
			return start;
		};

		this.queryMouseRaySceneIntersection = function(centerX, centerY) {
			if(viewer == null)
				return null;

			if(viewer.model == null)
				return null;

			if(viewer.model.is2d()) {
				return null;
			}

			var result = viewer.impl.hitTest(centerX, centerY, false);
			return result ? result.intersectPoint : null;
		};

		var _getCameraPlane = function(pos, nor) {
			var planeNor = nor || pos.clone().sub(_camera.position).normalize();
			return new THREE.Plane(
				planeNor, -planeNor.x * pos.x - planeNor.y * pos.y - planeNor.z * pos.z
			);
		};

		this.zoomWindow = function() {
			var camera = _camera;
			var canvasWidth = viewer.canvas.clientWidth;
			var canvasHeight = viewer.canvas.clientHeight;
			var rectMinX = _mouseStart.x;
			var rectMinY = _mouseStart.y;
			var rectMaxX = _mouseEnd.x;
			var rectMaxY = _mouseEnd.y;

			var rectWidth = Math.abs(rectMaxX - rectMinX);
			var rectHeight = Math.abs(rectMaxY - rectMinY);
			if(rectWidth === 0 || rectHeight === 0) {
				return false;
			}

			_mouseEnd.copy(_mouseStart);

			if(viewer.navigation.getIs2D()) {
				var vpVec = {
					x: (rectMinX + rectMaxX) * 0.5,
					y: (rectMinY + rectMaxY) * 0.5
				};

				// Pan to the center of the zoom window first.
				var distance = viewer.navigation.getEyeVector().length();
				var delta = viewer.impl.clientToViewport(vpVec.x, vpVec.y);
				var on = viewer.impl.clientToViewport(canvasWidth / 2, canvasHeight / 2);
				delta.subVectors(delta, on);
				viewer.navigation.panRelative(delta.x / 2, delta.y / 2, distance);

				// Get scale
				var scaleX = rectWidth / canvasWidth;
				var scaleY = rectHeight / canvasHeight;
				var scale = scaleX > scaleY ? scaleX : scaleY;

				// Dolly
				distance = viewer.navigation.getEyeVector().length();
				var dollyTarget = viewer.navigation.getWorldPoint(0.5, 0.5);
				viewer.navigation.dollyFromPoint(distance * (scale - 1), dollyTarget);

				return true;
			}

			// ??? Should pick with rect first but currently LMV doesn't support rectangle selection
			// ??? So, do hit test only
			var hit = false;
			var pivot = null;
			// if pick up nothing, try ray pick
			if(!hit) {
				var centerX = (rectMinX + rectMaxX) * 0.5;
				var centerY = (rectMinY + rectMaxY) * 0.5;
				pivot = this.queryMouseRaySceneIntersection(centerX, centerY);
				// if pick up nothing, set pivot as intersection point from screen ray to project plane.
				if(pivot === null) {
					pivot = this.getPivot(centerX, centerY, canvasWidth, canvasHeight, _camera);
				}
			}

			// calculate the basis vectors for the camera frame
			var eye = camera.position;
			var viewDir = camera.target.clone().sub(eye);
			viewDir.normalize();

			// calculate z camera translation for pan and zoom
			var scaleFactor = Math.min(canvasWidth / rectWidth, canvasHeight / rectHeight);
			var distEye2Pivot = pivot.distanceTo(eye);
			var zoomDist = distEye2Pivot * 1 / scaleFactor;

			// Calculate the new eye. The pivot is the new target.
			viewDir.multiplyScalar(-zoomDist);
			viewDir.add(pivot);

			camera.position.set(viewDir.x, viewDir.y, viewDir.z);
			camera.target.set(pivot.x, pivot.y, pivot.z);
			camera.dirty = true;

			return true;
		};
	}

	ZhiUTech.Viewing.Extensions.ZoomWindow.ZoomWindowTool = ZoomWindowTool;
})();;
(function() {

	"use strict";

	ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.FusionOrbit');

	var zv = ZhiUTech.Viewing,
		avu = zv.UI,
		avef = zv.Extensions.FusionOrbit;

	var FusionOrbitExtension = function(viewer, options) {
		zv.Extension.call(this, viewer, options);
		this.name = 'fusionorbit';
		this.modes = ['fusionorbit', 'fusionfreeorbit'];
	};

	FusionOrbitExtension.prototype = Object.create(zv.Extension.prototype);
	FusionOrbitExtension.prototype.constructor = FusionOrbitExtension;

	var proto = FusionOrbitExtension.prototype;

	proto.load = function() {
		var self = this;
		var viewer = this.viewer;
		var toolbar = viewer.getToolbar ? viewer.getToolbar(true) : undefined;

		this.tool = new avef.FusionOrbitTool();
		this.tool.setViewer(viewer);
		viewer.toolController.registerTool(this.tool);

		function onToolbarCreated() {
			viewer.removeEventListener(zv.TOOLBAR_CREATED_EVENT, onToolbarCreated);
			self.createUI();
		}

		if(toolbar) {
			var navTools = toolbar.getControl(zv.TOOLBAR.NAVTOOLSID);
			if(navTools && navTools.getNumberOfControls() > 0) {
				onToolbarCreated();
			} else {
				viewer.addEventListener(zv.TOOLBAR_CREATED_EVENT, onToolbarCreated);
			}
		} else {
			viewer.addEventListener(zv.TOOLBAR_CREATED_EVENT, onToolbarCreated);
		}

		return true;
	};

	proto.createUI = function() {
		var self = this;
		var viewer = this.viewer;

		var toolbar = viewer.getToolbar(false);
		var navTools = toolbar.getControl(zv.TOOLBAR.NAVTOOLSID);

		// save button behaviors, before modifying them
		this.classicBehavior = {};
		this.classicBehavior.orbitOnClick = navTools.orbitbutton.onClick;
		this.classicBehavior.freeorbitOnClick = navTools.freeorbitbutton.onClick;
		this.classicBehavior.returnToDefault = navTools.returnToDefault;

		navTools.freeorbitbutton.onClick = function(e) {
			var state = navTools.freeorbitbutton.getState();
			if(state === avu.Button.State.INACTIVE) {
				self.activate('fusionfreeorbit');
				navTools.freeorbitbutton.setState(avu.Button.State.ACTIVE);
			} else if(state === avu.Button.State.ACTIVE) {
				self.deactivate();
				navTools.freeorbitbutton.setState(avu.Button.State.INACTIVE);
			}
		};

		navTools.orbitbutton.onClick = function(e) {
			var state = navTools.orbitbutton.getState();
			if(state === avu.Button.State.INACTIVE) {
				self.activate('fusionorbit');
				navTools.orbitbutton.setState(avu.Button.State.ACTIVE);
			} else if(state === avu.Button.State.ACTIVE) {
				self.deactivate();
				navTools.orbitbutton.setState(avu.Button.State.INACTIVE);
			}
		};

		navTools.returnToDefault = function() {
			// clear active button
			navTools.orbittoolsbutton.setState(avu.Button.State.ACTIVE);
			navTools.orbittoolsbutton.setState(avu.Button.State.INACTIVE);
		};

		// set combo button
		navTools.orbittoolsbutton.setState(avu.Button.State.INACTIVE);
		if(viewer.prefs.fusionOrbitConstrained) {
			navTools.orbittoolsbutton.onClick = navTools.orbitbutton.onClick;
			navTools.orbittoolsbutton.setIcon(navTools.orbitbutton.iconClass);
			viewer.setDefaultNavigationTool("orbit");
		} else {
			navTools.orbittoolsbutton.onClick = navTools.freeorbitbutton.onClick;
			navTools.orbittoolsbutton.setIcon(navTools.freeorbitbutton.iconClass);
			viewer.setDefaultNavigationTool("freeorbit");
		}

		// reset
		viewer.setActiveNavigationTool();
		navTools.returnToDefault();
	};

	proto.unload = function() {
		var viewer = this.viewer;
		var toolbar = viewer.getToolbar(false);
		var navTools = toolbar.getControl(zv.TOOLBAR.NAVTOOLSID);

		// restore LMV Classic button behaviors
		if(navTools) {
			if(navTools.orbitbutton)
				navTools.orbitbutton.onClick = this.classicBehavior.orbitOnClick;

			if(navTools.freeorbitbutton)
				navTools.freeorbitbutton.onClick = this.classicBehavior.freeorbitOnClick;

			navTools.returnToDefault = this.classicBehavior.returnToDefault;

			if(navTools.orbittoolsbutton) { // can be null when switching sheets
				if(navTools.orbitbutton)
					navTools.orbittoolsbutton.onClick = navTools.orbitbutton.onClick;
				else
					navTools.orbittoolsbutton.onClick = null;
				navTools.orbittoolsbutton.setIcon("zu-icon-orbit-constrained");
				navTools.orbittoolsbutton.setState(avu.Button.State.ACTIVE);
			}
		}
		viewer.setActiveNavigationTool("orbit");
		viewer.setDefaultNavigationTool("orbit");

		// Deregister tool
		viewer.toolController.deregisterTool(this.tool);
		this.tool.setViewer(null);
		this.tool = null;

		return true;
	};

	proto.activate = function(mode) {
		if(this.activeStatus && this.mode === mode) {
			return;
		}
		switch(mode) {
			default:
				case 'fusionorbit':
				this.viewer.setActiveNavigationTool("fusion orbit constrained");
			this.mode = 'fusionorbit';
			break;
			case 'fusionfreeorbit':
					this.viewer.setActiveNavigationTool("fusion orbit");
				this.mode = 'fusionfreeorbit';
				break;
		}
		this.activeStatus = true;
		return true;
	};

	proto.deactivate = function() {
		if(this.activeStatus) {
			this.viewer.setActiveNavigationTool();
			this.activeStatus = false;
		}
		return true;
	};

	avef.FusionOrbitExtension = FusionOrbitExtension;

	zv.theExtensionManager.registerExtension('ZhiUTech.Viewing.FusionOrbit', FusionOrbitExtension);

})(); // closure;ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.FusionOrbit');

ZhiUTech.Viewing.Extensions.FusionOrbit.html = [
	'<div class="orbit-gizmo noselect">',
	'<div class="outside"></div>',
	'<div class="ring"></div>',
	'<div class="layout-hor">',
	'<div class="edgemark-area"><div class="edgemark"></div></div>',
	'</div>',
	'<div class="layout-mid">',
	'<div class="layout-ver">',
	'<div class="edgemark-area"><div class="edgemark"></div></div>',
	'</div>',
	'<div class="circle">',
	'<div class="crosshair-area">',
	'<div class="crosshair-v"></div>',
	'<div class="crosshair-h"></div>',
	'</div>',
	'</div>',
	'<div class="layout-ver">',
	'<div class="edgemark-area"><div class="edgemark"></div></div>',
	'</div>',
	'</div>',
	'<div class="layout-hor">',
	'<div class="edgemark-area"><div class="edgemark"></div></div>',
	'</div>',
	'</div>',
].join("\n");

ZhiUTech.Viewing.Extensions.FusionOrbit.FusionOrbitTool = function() {

	var zv = ZhiUTech.Viewing;
	var zvp = ZhiUTech.Viewing.Private;

	var _names = ["fusion orbit", "fusion orbit constrained"];

	var _PERCENT_SIZE = 0.8;
	var _EXIT_PERCENT_SIZE = 1.2;
	var _CIRCLE_CURSOR_STYLE = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAt1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AAAAzMzP6+vri4uISEhKKioqtra2dnZ2EhIR9fX10dHRkZGQdHR3t7e3Hx8e5ubm1tbWoqKhWVlZKSko4ODgICAjv7+/o6OjMzMyxsbFOTk4pKSkXFxcEBAT29vbW1tZ6enpISEgLCwvhzeX+AAAAGXRSTlMANRO0nHRJHfnskIxQRKh89syDVwTWZjEJxPFEswAAAOFJREFUKM+1j+lygkAQhIflEAJe0Rw9u4CCeKKoSTTX+z9XoMJWWeX+ssrvZ3f19DQ5zOw/0DUMQPlmQ72bE2adBp8/Rp3CQUi3ILx+bxj4fjDs9T1Bmo6bbPPN8aDU4bjJt4nb+de789kSFyxn826jW3ICLNZZKU8nWWbrBTCRVm04U8TpjquRFf1Go0d7l8aYOrUR7FGEFr1S9LGymwthgX2gE/Kl0cHPOtF2xOWZ5QpIC93RflW4InkDoPRXesd5LJIMQPzV7tCMa7f6BvhJL79AVDmYTNQ1NhnxbI/uwB8H5Bjd4zQPBAAAAABJRU5ErkJggg==), auto";

	var _orbitModes = {
		HORIZONTAL: 0,
		VERTICAL: 1,
		ROLL: 2
	};

	var _orbitSpeeds = {
		HORIZONTAL: 0.005,
		VERTICAL: 0.005,
		ROLL: 1.0
	};

	var _gizmoElem, _gizmoRect = {},
		_ringElem, _outsideElem;
	var _isConstrained;
	var _camera;
	var _isTouch = zv.isTouchDevice();
	var _isClickToExit = false;

	var _mouse = {
		buttons: [],
		src: undefined,
		x: 0,
		y: 0,
		dx: 0,
		dy: 0,
		firstMove: true, // for dx/dy calc
		mode: undefined
	};

	var _this = this;

	this.setViewer = function(viewer) {
		this.viewer = viewer;
		this.navapi = viewer ? viewer.navigation : null;
	};

	// PRIVATE FUNCTIONS

	var _onMouseDown = function(e) {
		_mouse.buttons[e.touches ? 0 : e.button] = true;
		_mouse.src = e.target.className;
		_mouse.x = 0;
		_mouse.y = 0;
		_mouse.dx = 0;
		_mouse.dy = 0;
		_mouse.firstMove = true;
		_mouse.mode = undefined;

		if(_mouse.src === "ring") {
			_mouse.mode = _orbitModes.ROLL;
		} else if(_mouse.src === "edgemark-area") {
			if(e.target.parentNode.className === "layout-ver")
				_mouse.mode = _orbitModes.HORIZONTAL;
			else if(e.target.parentNode.className === "layout-hor")
				_mouse.mode = _orbitModes.VERTICAL;
		}

		_centerPivot();

		e.stopPropagation();
	};

	var _onMouseUp = function(e) {
		_mouse.buttons[e.touches ? 0 : e.button] = false;
		_mouse.src = undefined;
	};

	var _onMouseMove = function(e) {
		if(!_mouse.buttons[0]) return;

		_updateMousePos(e);
		_updateCamera();

		_mouse.firstMove = false;
	};

	var _updateMousePos = function(e) {
		var pageX = e.touches ? e.touches[0].pageX : e.pageX;
		var pageY = e.touches ? e.touches[0].pageY : e.pageY;

		if(!_mouse.firstMove) {
			_mouse.dx = pageX - _mouse.x;
			_mouse.dy = pageY - _mouse.y;
		}
		_mouse.x = pageX;
		_mouse.y = pageY;
	};

	var _updateCamera = function() {

		// if (_mouse.dx === 0 && _mouse.dy === 0) return;
		switch(_mouse.mode) {
			case _orbitModes.ROLL:
				if(!_this.navapi.isActionEnabled('roll')) {
					return;
				}
				break;
			case _orbitModes.HORIZONTAL:
			case _orbitModes.VERTICAL:
				if(!_this.navapi.isActionEnabled('orbit')) {
					return;
				}
				break;
		}

		var eyeVec = _camera.target.clone().sub(_camera.position).normalize();
		var rightVec = eyeVec.clone().cross(_camera.up).normalize();
		var upVec = rightVec.clone().cross(eyeVec).normalize();
		_camera.up.copy(upVec); // update camera.up

		if(_mouse.mode === _orbitModes.ROLL) {
			var start = new THREE.Vector3(_mouse.x - _gizmoRect.center.x, _mouse.y - _gizmoRect.center.y, 0);
			var end = (new THREE.Vector3(_mouse.dx, _mouse.dy, 0)).add(start);
			start.normalize();
			end.normalize();
			var cross = start.clone().cross(end);
			var angle = Math.asin(cross.z);
			_camera.up.applyAxisAngle(eyeVec, -angle * _orbitSpeeds.ROLL);
		} else {
			var rotAxis, rotAmount;

			if(_mouse.mode === _orbitModes.HORIZONTAL) {
				rotAmount = -_mouse.dx * _orbitSpeeds.HORIZONTAL;
				if(_isConstrained)
					_camera.up = ZhiUTech.Viewing.Navigation.snapToAxis(_camera.up.clone()); // snap up vec
				rotAxis = _camera.up;
			} else if(_mouse.mode === _orbitModes.VERTICAL) {
				rotAmount = -_mouse.dy * _orbitSpeeds.VERTICAL;
				if(_isConstrained) {
					if(_mouse.firstMove) // first time move, snap
						_camera.up = ZhiUTech.Viewing.Navigation.snapToAxis(_camera.up.clone());
					rotAxis = eyeVec.clone().cross(_camera.up).normalize(); // new right vec
				} else {
					rotAxis = rightVec;
				}
				_camera.up.applyAxisAngle(rotAxis, rotAmount);
			}

			var pivot = _this.navapi.getPivotPoint();
			var newPivotToCam = _camera.position.clone().sub(pivot);
			newPivotToCam.applyAxisAngle(rotAxis, rotAmount);
			_camera.position.addVectors(pivot, newPivotToCam); // orbit position

			var newPivotToTarget = _camera.target.clone().sub(pivot);
			newPivotToTarget.applyAxisAngle(rotAxis, rotAmount);
			_camera.target.addVectors(pivot, newPivotToTarget); // orbit target
		}

		_camera.dirty = true;

	};

	// may return camera.target, do not modify
	var _findTarget = function() {
		var eyeVec = _camera.target.clone().sub(_camera.position).normalize();
		var hit = _this.viewer.impl.rayIntersect(new THREE.Ray(_camera.position, eyeVec));
		return(hit && hit.intersectPoint) ?
			hit.intersectPoint :
			_camera.target;
	};

	var _getCameraPlane = function(pos, nor) {
		var planeNor = nor || pos.clone().sub(_camera.position).normalize();
		return new THREE.Plane(
			planeNor, -planeNor.x * pos.x - planeNor.y * pos.y - planeNor.z * pos.z
		);
	};

	var _centerPivot = function() {
		// find distance pivot to camera plane
		// set new pivot to be that distance along eye vector
		var eyeVec = _camera.target.clone().sub(_camera.position).normalize();
		var plane = _getCameraPlane(_camera.position, eyeVec);
		var dist = plane.distanceToPoint(_camera.pivot);
		_camera.pivot.copy(eyeVec).multiplyScalar(dist).add(_camera.position);
	};

	var _onMouseDownCircle = function(e) {
		if(!e.touches && e.button === 0)
			_centerPivot(); // center pivot before passing thru to orbit tool
	};

	var _clickToExit = function(e) {
		if(_isClickToExit)
			_this.viewer.setActiveNavigationTool();
	};

	var _clickToFocus = function(x, y) {
		var hit = _this.viewer.impl.hitTest(x, y);
		var newTarget;

		if(hit && hit.intersectPoint) {
			newTarget = hit.intersectPoint;
		} else {
			// intersect camera plane
			var ray = _this.viewer.impl.viewportToRay(_this.viewer.impl.clientToViewport(x, y));
			newTarget = ray.intersectPlane(_getCameraPlane(_camera.target));
		}

		var newCamPos = _camera.position.clone().sub(_findTarget()).add(newTarget);
		_this.navapi.setRequestTransition(true, newCamPos, newTarget, _camera.fov);
	};

	// TOOL INTERFACE

	this.register = function() {
		_gizmoElem = zvp.stringToDOM(ZhiUTech.Viewing.Extensions.FusionOrbit.html);
		_gizmoElem.style.display = "none";
		this.viewer.canvasWrap.insertBefore(_gizmoElem, this.viewer.canvasWrap.firstChild);

		_ringElem = _gizmoElem.querySelector(".ring");
		_ringElem.addEventListener("mousedown", _onMouseDown);

		Array.prototype.forEach.call(_gizmoElem.querySelectorAll(".edgemark-area"), function(elem, i) {
			elem.addEventListener("mousedown", _onMouseDown);
			if(_isTouch) elem.addEventListener("touchstart", _onMouseDown);
		});

		window.addEventListener("mouseup", _onMouseUp);
		window.addEventListener("mousemove", _onMouseMove);

		// click to exit
		_outsideElem = _gizmoElem.querySelector(".outside");
		_outsideElem.addEventListener("mousedown", _clickToExit);

		// before passing thru to orbit (default) tool
		var circleElem = _gizmoElem.querySelector(".circle");
		circleElem.addEventListener("mousedown", _onMouseDownCircle);

		if(_isTouch) {
			_ringElem.addEventListener("touchstart", _onMouseDown);
			window.addEventListener("touchend", _onMouseUp);
			window.addEventListener("touchmove", _onMouseMove);
			_outsideElem.addEventListener("touchstart", _clickToExit);
			circleElem.addEventListener("touchstart", _onMouseDownCircle);
		}

		_camera = this.viewer.impl.camera;
	};

	this.deregister = function() {
		window.removeEventListener("mouseup", _onMouseUp);
		window.removeEventListener("mousemove", _onMouseMove);
		_outsideElem.removeEventListener("mousedown", _clickToExit);

		if(_isTouch) {
			window.removeEventListener("touchend", _onMouseUp);
			window.removeEventListener("touchmove", _onMouseMove);
			_outsideElem.removeEventListener("touchstart", _clickToExit);
		}

		this.viewer.canvasWrap.removeChild(_gizmoElem);

		_gizmoElem = undefined;
		_ringElem = undefined;
		_outsideElem = undefined;
	};

	this.activate = function(name) {
		_gizmoElem.style.display = "";

		this.handleResize();

		_isConstrained = (name === "fusion orbit constrained");

		var hyperlink = this.viewer.toolController.isToolActivated("hyperlink");

		// Need to make Hyperlink sit on top of default navigation tool
		if(hyperlink)
			this.viewer.toolController.deactivateTool("hyperlink");

		if(_isConstrained) {
			this.viewer.setDefaultNavigationTool("orbit");
			this.viewer.prefs.set("fusionOrbitConstrained", true);
		} else {
			this.viewer.setDefaultNavigationTool("freeorbit");
			this.viewer.prefs.set("fusionOrbitConstrained", false);
		}

		if(hyperlink)
			this.viewer.toolController.activateTool("hyperlink");

		this.viewer.navigation.setZoomTowardsPivot(true);
	};

	this.deactivate = function(name) {
		_gizmoElem.style.display = "none";
		this.viewer.navigation.setZoomTowardsPivot(this.viewer.prefs.zoomTowardsPivot);
	};

	this.getNames = function() {
		return _names;
	};

	this.getName = function() {
		return _names[0];
	};

	this.update = function() {
		return false;
	};

	this.handleSingleClick = function(event, button) {
		_clickToFocus(event.canvasX, event.canvasY);
		return true;
	};

	this.handleDoubleClick = function(event, button) {
		return true; // disabled, does not play nice with SingleClick
	};

	this.handleSingleTap = function(event) {
		_clickToFocus(event.canvasX, event.canvasY);
		return true;
	};

	this.handleDoubleTap = function(event) {
		return false; // enabled, DoubleTap doesn't register the first SingleTap
	};

	this.handleKeyDown = function(event, keyCode) {
		return false;
	};

	this.handleKeyUp = function(event, keyCode) {
		return false;
	};

	this.handleWheelInput = function(delta) {
		return false;
	};

	this.handleButtonDown = function(event, button) {
		return false;
	};

	this.handleButtonUp = function(event, button) {
		return false;
	};

	this.handleMouseMove = function(event) {
		var rect = this.viewer.impl.getCanvasBoundingClientRect();
		var vp;
		if(rect.width > rect.height) {
			vp = new THREE.Vector2(
				(((event.canvasX + 0.5) / rect.width) * 2 - 1) * rect.width / rect.height, -((event.canvasY + 0.5) / rect.height) * 2 + 1
			);
		} else {
			vp = new THREE.Vector2(
				(((event.canvasX + 0.5) / rect.width) * 2 - 1),
				(-((event.canvasY + 0.5) / rect.height) * 2 + 1) * rect.height / rect.width
			);
		}

		var radius = vp.length();

		var isOutside = radius > _EXIT_PERCENT_SIZE;
		if(_isClickToExit !== isOutside) {
			if(isOutside)
				_outsideElem.style.cursor = "";
			else
				_outsideElem.style.cursor = _CIRCLE_CURSOR_STYLE;
			_isClickToExit = isOutside;
			// console.log("click exit: " + _isClickToExit);
		}

		return false;
	};

	this.handleGesture = function(event) {
		_centerPivot();
		return false;
	};

	this.handleBlur = function(event) {
		return false;
	};

	this.handleResize = function() {
		// for mouse roll
		var rect = _gizmoElem.getBoundingClientRect();
		_gizmoRect.left = rect.left + window.pageXOffset;
		_gizmoRect.top = rect.top + window.pageYOffset;
		_gizmoRect.width = rect.width;
		_gizmoRect.height = rect.height;
		_gizmoRect.center = {};
		_gizmoRect.center.x = _gizmoRect.left + _gizmoRect.width / 2;
		_gizmoRect.center.y = _gizmoRect.top + _gizmoRect.height / 2;

		// resize gizmo
		var dim = (window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth) * _PERCENT_SIZE;
		_gizmoElem.style.width = _gizmoElem.style.height = "" + dim + "px";
		_gizmoElem.style.top = _gizmoElem.style.left = "calc(50% - " + (dim / 2) + "px)";
		_ringElem.style.borderWidth = "" + (dim * 0.1) + "px";
	};
};;
ZhiUTechNamespace('ZhiUTech.Viewing.Private.Collaboration');

(function() {

	var zv = ZhiUTech.Viewing,
		ave = zv.Extensions,
		zvp = zv.Private,
		avu = zv.UI,
		zvpc = zvp.Collaboration;

	function RemoteControllerTool(viewer, client, p2p) {

		var _stick1 = new THREE.Vector2();
		var _stick2 = new THREE.Vector2();
		var _explodeSpeed = 0;
		var _flydir = null;
		var _camera;
		var _viewer = viewer;

		var MOVE_SCALE = 0.02;
		var AUTOMOVE_SCALE = 0.002;
		var LOOK_SCALE = 0.05;
		var EXPLODE_SCALE = 0.01;
		var _modelScale = 1.0;

		var _viewerState;
		var _savepoints = [];
		var _nextsavepoint = 0;
		var VIEWER_STATE_FILTER = {
			seedURN: false,
			objectSet: true,
			viewport: true,
			renderOptions: {
				environment: false,
				ambientOcclusion: false,
				toneMap: {
					exposure: false
				},
				appearance: false
			}
		};

		var initScale = function() {
			if(!viewer.impl.model.is2d()) {
				var size = viewer.impl.model.getData().bbox.size();
				var diagLength = size.length();
				MOVE_SCALE *= diagLength;
				AUTOMOVE_SCALE *= diagLength;
				viewer.removeEventListener(ZhiUTech.Viewing.PROGRESS_UPDATE_EVENT, initScale);
			}
		};

		viewer.addEventListener(ZhiUTech.Viewing.MODEL_ROOT_LOADED_EVENT, initScale);

		//viewtx.client.addEventListener("joystick", this.onJoystick);

		this.getNames = function() {
			return ["joystick"];
		};

		this.getName = function() {
			return "joystick";
		};

		this.activate = function(name) {
			client.addEventListener("joystick", onJoystick);
			p2p.addEventListener("joystick", onJoystick);
			_camera = _viewer.navigation.getCamera();

			if(_viewer.model) {
				var box = _viewer.model.getBoundingBox();
				_modelScale = box.size().length() * 0.001;
				_viewerState = new zvp.ViewerState(_viewer);
			}
		};

		this.deactivate = function(name) {
			client.removeEventListener("joystick", onJoystick);
			p2p.removeEventListener("joystick", onJoystick);
			_camera = null;
			_viewerState = null;
			_savepoints.length = 0;
		};

		this.update = function(timeStamp) {

			//the "go home" call may change the camera back to ortho... and we can't do ortho while walking...
			//HACK: Really, the home view should be set once when launch the extension, then set it back.
			if(!_camera.isPerspective)
				viewer.navigation.toPerspective();

			if(_flydir) {
				var automove = _flydir.clone().multiplyScalar(AUTOMOVE_SCALE);
				_camera.position.add(automove);
				_camera.target.add(automove);
			}

			if(_explodeSpeed != 0) {
				var ns = viewer.getExplodeScale() + _explodeSpeed * EXPLODE_SCALE;
				if(ns > 1) ns = 1;
				if(ns < 0) ns = 0;
				viewer.explode(ns);
			}

			if(_stick1.x == 0 && _stick1.y == 0 && _stick2.x == 0 && _stick2.y == 0)
				return !!(_flydir || _explodeSpeed);

			var direction = _camera.target.clone().sub(_camera.position);
			var distance = direction.length();
			direction.multiplyScalar(1.0 / distance);
			var right = direction.clone().cross(_camera.up).normalize();

			var forwardMove = direction.clone().multiplyScalar(_stick1.y * MOVE_SCALE);
			_camera.position.add(forwardMove);
			_camera.target.add(forwardMove);

			var strafeMove = right.clone().multiplyScalar(_stick1.x * MOVE_SCALE);
			_camera.position.add(strafeMove);
			_camera.target.add(strafeMove);

			var lookUpDown = new THREE.Quaternion();
			lookUpDown.setFromAxisAngle(right, _stick2.y * LOOK_SCALE);
			var ndir = direction.clone().applyQuaternion(lookUpDown);
			_camera.up.applyQuaternion(lookUpDown);

			var lookLeftRight = new THREE.Quaternion();
			lookLeftRight.setFromAxisAngle(_camera.worldup, -_stick2.x * LOOK_SCALE);
			ndir.applyQuaternion(lookLeftRight);
			_camera.up.applyQuaternion(lookLeftRight);

			ndir.multiplyScalar(distance);
			_camera.target.copy(_camera.position).add(ndir);

			// update automove direction
			if(_flydir)
				_flydir.copy(_camera.target).sub(_camera.position).normalize();

			return true;
		};

		this.handleSingleClick = function(event, button) {
			return false;
		};
		this.handleDoubleClick = function(event, button) {
			return false;
		};
		this.handleSingleTap = function(tap) {
			return false;
		};
		this.handleDoubleTap = function(tap1, tap2) {
			return false;
		};
		this.handleKeyDown = function(event, keyCode) {
			return false;
		};
		this.handleKeyUp = function(event, keyCode) {
			return false;
		};
		this.handleWheelInput = function(delta) {
			return false;
		};
		this.handleButtonDown = function(event, button) {
			return false;
		};
		this.handleButtonUp = function(event, button) {
			return false;
		};
		this.handleMouseMove = function(event) {
			return false;
		};
		this.handleGesture = function(event, touches) {
			return false;
		};
		this.handleTouchChange = function(event, touches) {
			return false;
		};
		this.handleBlur = function(event) {
			return false;
		};
		this.handleResize = function() {};

		function onJoystick(e) {
			var state = e.data.msg;
			_stick1.x = state.x1;
			_stick1.y = state.y1;
			_stick2.x = state.x2;
			_stick2.y = state.y2;
			_explodeSpeed = state.explode;

			if(state.command) {
				if(state.command == "gohome") {
					_stick1.x = _stick1.y = 0;
					_stick2.x = _stick2.y = 0;
					viewer.navigation.setRequestHomeView(true);
					viewer.showAll();
					viewer.impl.selector.clearSelection();
					viewer.explode(0);
					_flydir = null;
				} else if(state.command == "select") {
					var res = viewer.impl.hitTestViewport(new THREE.Vector3(0, 0, 0));

					if(res) {
						viewer.impl.selector.toggleSelection(res.dbId, res.model);
					} else {
						viewer.impl.selector.clearSelection();
					}

				} else if(state.command == "hide") {
					var res = viewer.impl.hitTestViewport(new THREE.Vector3(0, 0, 0));

					if(res) {
						viewer.hide(res.dbId);
					}
				} else if(state.command == "fly") {
					if(!_flydir) {
						_flydir = _camera.target.clone().sub(_camera.position).normalize();
					} else {
						_flydir = null;
					}
				} else if(state.command == "savepoint") {
					var state = _viewerState.getState(VIEWER_STATE_FILTER);
					_savepoints.push(state);
					alertify.success("Savepoint created.");
				} else if(state.command == "nextsavepoint") {
					if(_savepoints.length) {
						if(_nextsavepoint >= _savepoints.length)
							_nextsavepoint = 0;

						_viewerState.restoreState(_savepoints[_nextsavepoint++]);
					}
				}
			}

			//console.log(state);
		};

	};

	//==================================================================================
	//Extension interface

	/** @constructor */
	ave.RemoteControl = function(viewer, options) {
		zv.Extension.call(this, viewer, options);

		this.viewer = viewer;
		this.client = zvp.MessageClient.GetInstance();
		this.p2p = new zvp.P2PClient(this.client);
		this.controllerTool = new RemoteControllerTool(viewer, this.client, this.p2p);
		viewer.toolController.registerTool(this.controllerTool);
		this.name = 'remotecontrol';
	};

	ave.RemoteControl.prototype = Object.create(zv.Extension.prototype);
	ave.RemoteControl.prototype.constructor = ave.RemoteControl;

	ave.RemoteControl.prototype.createUI = function() {
		var scope = this;
		var viewer = this.viewer;

		this.controlButton = new avu.Button('toolbar-remoteControlTool');
		this.controlButton.setToolTip('Pair with controller device');
		this.controlButton.onClick = function() {
			if(this.getState() === avu.Button.State.INACTIVE) {
				scope.activate();
				this.setState(avu.Button.State.ACTIVE);
			} else {
				scope.deactivate();
				this.setState(avu.Button.State.INACTIVE);
			}
		};

		this.controlButton.setIcon("zu-icon-game-controller");
		viewer.modelTools.addControl(this.controlButton);

		this.panel = new ZhiUTech.Viewing.UI.DockingPanel(viewer.container, "remote-panel", "Remote Control");
		this.panel.width = 300;
		this.panel.height = 375;
		this.panel.container.style.width = this.panel.width + "px";
		this.panel.container.style.height = this.panel.height + "px";
		this.panel.container.style.top = (window.innerHeight - this.panel.height) / 2 + "px";
		this.panel.container.style.left = (window.innerWidth - this.panel.width) / 2 + "px";
		this.panel.body = document.createElement("div");
		this.panel.body.classList.add("body");
		this.panel.container.appendChild(this.panel.body);
		var text1 = ZhiUTech.Viewing.i18n.translate("Go to this link");
		var text2 = ZhiUTech.Viewing.i18n.translate("Scan the QR code with your device");
		var text3 = ZhiUTech.Viewing.i18n.translate("or");
		this.panel.body.innerHTML = [
			'<p data-i18n="' + text1 + '">' + text1 + '</p>',
			'<p><a class="url" target="_blank" href="#">Link</a></p>',
			'<p data-i18n="' + text3 + '">' + text3 + '</p>',
			'<p data-i18n="' + text2 + '">' + text2 + '</p>',
			'<img class="qr-img" src="">',
		].join("\n");
		this.panel.link = this.panel.container.querySelector(".url");
		this.panel.code = this.panel.container.querySelector(".code");
		this.panel.qrImg = this.panel.container.querySelector(".qr-img");
	};

	ave.RemoteControl.prototype.load = function() {
		var viewer = this.viewer;
		var scope = this;

		// add the button to the toolbar
		if(viewer.modelTools && viewer.modelTools.getNumberOfControls() > 0) {
			scope.createUI();
		} else {
			viewer.addEventListener(ZhiUTech.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated);
		}

		function onToolbarCreated(e) {
			viewer.removeEventListener(ZhiUTech.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated);
			scope.createUI();
		}

		return true;
	};

	ave.RemoteControl.prototype.unload = function() {

		var viewer = this.viewer;

		this.p2p.hangup();
		this.client.disconnect();

		viewer.toolController.deactivateTool(this.controllerTool.getName());

		if(this.panel) {
			this.panel.setVisible(false);
			this.panel = null;
		}

		// TODO_HACK: Find out why removing the button fails
		if(this.controlButton) {
			try {
				viewer.modelTools.removeControl(this.controlButton);
				this.controlButton = null;
			} catch(err) {
				zvp.logger.error('RemoteControlReceiver - Failed to remove controlButton');
				this.controlButton = null;
			}
		}

		return true;
	};

	ave.RemoteControl.prototype.addCrosshair = function() {
		this.crosshair = zvp.stringToDOM('<div id="remote-crosshair"><div class="crosshair-v"></div><div class="crosshair-h"></div></div>');
		this.viewer.canvasWrap.appendChild(this.crosshair);
	};

	ave.RemoteControl.prototype.removeCrosshair = function() {
		if(this.crosshair) this.crosshair.remove();
	};

	ave.RemoteControl.prototype.connect = function(cb) {
		if(this.client.isConnected()) {
			console.log("RemoteControl already connected");
			return;
		}

		var scope = this;
		zvp.loadDependency("lmv_io", "socket.io-1.3.5.js", function() {
			scope.connectAux(cb);
		});
	};

	ave.RemoteControl.prototype.connectAux = function(cb) {
		var scope = this;
		var viewer = this.viewer;
		scope.client.addEventListener("connectSucceeded", function(e) {
			zvp.logger.log("connect succeeded");
			var sessionId = e.data.id + "rc";
			scope.client.join(sessionId);

			var rcURL = (LMV_RESOURCE_ROOT.length ? LMV_RESOURCE_ROOT : window.location.origin + "/") + "rc.html?sessionId=" + sessionId + "&env=" + zvp.env;

			var qrImgURL = "http://chart.googleapis.com/chart?cht=qr&chs=200x200&choe=UTF-8&chld=H|0&chl=" + escape(rcURL);

			var panel = scope.panel;
			if(panel) {
				panel.link.href = rcURL;
				panel.link.innerHTML = (LMV_RESOURCE_ROOT.length ? LMV_RESOURCE_ROOT : window.location.origin + "/") + "rc.html";
				panel.qrImg.src = qrImgURL;
				panel.setVisible(true);
			}

			function popupRemover() {
				if(panel) panel.setVisible(false);
				scope.p2p.removeEventListener("dataChannelAdded", popupRemover);
				scope.addCrosshair();
			}
			scope.p2p.addEventListener("dataChannelAdded", popupRemover);

			if(cb && cb instanceof Function)
				cb(rcURL);
		});

		viewer.navigation.toPerspective();
		scope.client.connect();

		viewer.toolController.activateTool(scope.controllerTool.getName());
	};

	ave.RemoteControl.prototype.disconnect = function() {
		this.p2p.hangup();
		this.client.disconnect();
		this.viewer.toolController.deactivateTool(this.controllerTool.getName());
		this.removeCrosshair();
		this.panel.setVisible(false);
	};

	ave.RemoteControl.prototype.activate = function() {
		if(!this.activeStatus) {
			this.connect();
			this.activeStatus = true;
		}
		return true;
	};

	ave.RemoteControl.prototype.deactivate = function() {
		if(this.activeStatus) {
			this.disconnect();
			this.activeStatus = false;
		}
		return true;
	};

	zv.theExtensionManager.registerExtension('ZhiUTech.Viewing.RemoteControl', ave.RemoteControl);

})();;
(function() {

	ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.GamepadModule');

	/***
	 * GamepadModule is a tool (not an extension) that reacts to input from
	 * a gamepad controller plugged into the hosting machine.
	 *
	 * @param viewerapi
	 * @constructor
	 */
	ZhiUTech.Viewing.Extensions.GamepadModule = function(viewerapi) {

		var zvp = ZhiUTech.Viewing.Private;

		var _navapi = viewerapi.navigation;
		var _container = viewerapi.container;
		var _camera = _navapi.getCamera();

		var _modelScaleFactor = 1.0;

		var _explodeSpeed = 0;

		var _THRESHOLD = 0.1;
		var _SPEED_ADJUST = 5.5,
			_INITIAL_SPEED_SCALAR = 6,
			_speed_scalar = _INITIAL_SPEED_SCALAR;

		var _btnPressMap = {};
		var _gamepad;
		var _hudMessageStartShowTime;
		var _hudMessageShowTime;
		var _viewerState;
		var _savepoints;
		var _nextsavepoint;

		//Nav mode toggle
		var _lockInPlane;

		var _clock = new THREE.Clock(true);

		var VIEWER_STATE_FILTER = {
			seedURN: false,
			objectSet: true,
			viewport: true,
			renderOptions: {
				environment: false,
				ambientOcclusion: false,
				toneMap: {
					exposure: false
				},
				appearance: false
			}
		};
		var _actualMoveSpeed;
		var _movementSpeed = 2.0;
		var _INITIAL_FOV = 75;
		var _ZOOM_SCALAR = -45; //smaller => closer zoom
		var _altitudeLockCoord;
		var _currentTool;

		/*Face Buttons*/
		var _BUTTONS = {
			SOUTH_BTN: 0,
			EAST_BTN: 1,
			WEST_BTN: 2,
			NORTH_BTN: 3,

			/*Shoulder and trigger buttons*/
			LEFT_SHOULDER: 4,
			RIGHT_SHOULDER: 5,
			LEFT_TRIGGER: 6, //ANALOG
			RIGHT_TRIGGER: 7, //ANALOG

			/*directional pad (DPad)*/
			SOUTH_DPAD: 13,
			EAST_DPAD: 15,
			WEST_DPAD: 14,
			NORTH_DPAD: 12,

			/*Joystick buttons (press joystick in)*/
			LEFT_STICK_BUTTON: 10,
			RIGHT_STICK_BUTTON: 11

		};

		var _STICKS = {
			//Axis//
			/*Left and right joysticks*/
			LEFT_STICK_X: 0, //ANALOG
			LEFT_STICK_Y: 1, //ANALOG
			RIGHT_STICK_X: 2, //ANALOG
			RIGHT_STICK_Y: 3 //ANALOG
		};

		var _BLANK_FUNC = function() {};
		var _BUTTON_MAPPING = {};
		for(var k in _BUTTONS) {
			if(_BUTTONS.hasOwnProperty(k))
				_BUTTON_MAPPING[_BUTTONS[k]] = _BLANK_FUNC;
		}

		var init = function() {

		};

		this.activate = function(toolName) {
			// Calculate a movement scale factor based on the model bounds.
			var boundsSize = viewerapi.model.getBoundingBox().size();
			_modelScaleFactor = Math.max(Math.min(Math.min(boundsSize.x, boundsSize.y), boundsSize.z) / 10.0, 0.0001);
			_gamepad = navigator.getGamepads()[0];
			_viewerState = new ZhiUTech.Viewing.Private.ViewerState(viewerapi);
			_savepoints = [];
			_nextsavepoint = 0;
			_currentTool = toolName;
			setMapping(toolName);
		};

		this.deactivate = function() {
			//console.log("DEACTIVATE");
			_currentTool = null;
			_viewerState = null;
		};

		this.update = function(delta, camera) {

			if(camera)
				_camera = camera;
			delta = _clock.getDelta();

			//poll for gamepad connection
			_gamepad = navigator.getGamepads()[0];

			if(_hudMessageStartShowTime > -1) {
				var curTime = new Date().getTime();
				if(curTime - _hudMessageStartShowTime > _hudMessageShowTime) { // seconds
					hideHUD();
				}
			}

			if(_gamepad) {
				_actualMoveSpeed = delta * _movementSpeed * _modelScaleFactor * _speed_scalar; // (_gamepad.buttons[_BUTTONS.RIGHT_TRIGGER].value > _THRESHOLD ? _SPEED_ADJUST * _gamepad.buttons[_BUTTONS.RIGHT_TRIGGER].value + _MAX_SPEED_SCALAR : _MAX_SPEED_SCALAR);
				// From the Collaboration extension:
				//the "go home" call may change the camera back to ortho... and we can't do ortho while walking...
				//HACK: Really, the home view should be set once when launch the extension, then set it back.
				if(!_camera.isPerspective) {
					//console.log("Lost perspective mode: resetting view.");
					_navapi.toPerspective();
				}
				if(_gamepad) { //TODO test for connection (change of state?)
					if(inputDetected()) { //need to update camera scene
						// console.log("needs update");
						_camera.dirty = true;
						if(_lockInPlane) {
							_altitudeLockCoord = _camera.position.z;
						}

						var direction = _camera.target.clone().sub(_camera.position);
						var distance = direction.length();
						direction.multiplyScalar(1.0 / distance);
						var right = direction.clone().cross(_camera.up).normalize();
						if(Math.abs(_gamepad.axes[_STICKS.LEFT_STICK_Y]) > _THRESHOLD) {
							var forwardMove = direction.clone().multiplyScalar(-_gamepad.axes[_STICKS.LEFT_STICK_Y] * _actualMoveSpeed);
							_camera.position.add(forwardMove);
							_camera.target.add(forwardMove);
						}

						if(Math.abs(_gamepad.axes[_STICKS.LEFT_STICK_X]) > _THRESHOLD) {
							var strafeMove = right.clone().multiplyScalar(_gamepad.axes[_STICKS.LEFT_STICK_X] * _actualMoveSpeed);
							_camera.position.add(strafeMove);
							_camera.target.add(strafeMove);
						}

						var lookUpDown = new THREE.Quaternion();
						var ndir = direction;
						if(Math.abs(_gamepad.axes[_STICKS.RIGHT_STICK_Y]) > _THRESHOLD) {

							var tempCam = _camera.clone(); //modify this camera to see if it will be in viable range
							var tempDir = direction.clone();

							lookUpDown.setFromAxisAngle(right, -_gamepad.axes[_STICKS.RIGHT_STICK_Y] * _actualMoveSpeed / 2); //lookscale

							tempDir.applyQuaternion(lookUpDown);
							tempCam.up.applyQuaternion(lookUpDown);
							var vertical = tempCam.worldup.clone();
							var vertAngle = tempDir.angleTo(vertical);
							var vertLimit = THREE.Math.degToRad(5);

							// If new angle is within limits then update values; otherwise ignore
							if(vertAngle >= vertLimit && vertAngle <= (Math.PI - vertLimit)) {
								ndir = direction.clone().applyQuaternion(lookUpDown);
								_camera.up.applyQuaternion(lookUpDown);
							}
						}

						var lookLeftRight = new THREE.Quaternion();
						if(Math.abs(_gamepad.axes[_STICKS.RIGHT_STICK_X]) > _THRESHOLD) {
							lookLeftRight.setFromAxisAngle(_camera.worldup, -_gamepad.axes[_STICKS.RIGHT_STICK_X] * _actualMoveSpeed / 2); //lookscale
							ndir.applyQuaternion(lookLeftRight);
							_camera.up.applyQuaternion(lookLeftRight);
						}

						/*HANDLE ALL BUTTON INPUTS*/
						handleGamepadFaceButtons();
						/**************************/

						if(_lockInPlane)
							_camera.position.z = _altitudeLockCoord;

						ndir.multiplyScalar(distance);
						_camera.target.copy(_camera.position).add(ndir);
					}
				}
			}
			return _camera;
		};

		// Show a HUD for a specific amount of time (showDelay > 0) or until closed.
		var showHUD = function(messageSpecs, showDelay, closeCB, buttonCB, checkboxCB) {
			ZhiUTech.Viewing.Private.HudMessage.displayMessage(_container, messageSpecs, closeCB, buttonCB, checkboxCB);

			if(showDelay > 0) {
				_hudMessageStartShowTime = new Date().getTime();
				_hudMessageShowTime = showDelay;
			} else {
				_hudMessageStartShowTime = -1;
				_hudMessageShowTime = 0;
			}
		};

		var hideHUD = function() {
			ZhiUTech.Viewing.Private.HudMessage.dismiss(); // in case it's still visible
			_hudMessageStartShowTime = -1;
		};

		var showDPadHud = function(direction) {
			hideHUD();
			var message;
			switch(direction) {
				case "up":
					message = _lockInPlane ? "Vertical Lock Mode" : "Fly mode";
					break;
				case "left":
					break;
				case "right":
					break;
				case "down":
					break;
			}

			var messageSpecs = {
				"msgTitleKey": "View Orientation Drag Mode Toggled",
				"messageKey": "View Orientation Drag Mode Toggled",
				"messageDefaultValue": message

			};
			showHUD(messageSpecs, 2000); //show hud for 2secs

		};

		//checks for any button doing anything important
		function inputDetected() {
			//check to see if we pressed a button last frame
			//loop through mapping to only check buttons we care about
			for(var btn in _BUTTON_MAPPING) {
				if(_BUTTON_MAPPING.hasOwnProperty(btn)) {
					if(_gamepad.buttons[btn].pressed) {
						if(_gamepad.buttons[btn].value != 0.5) {
							_btnPressMap[btn] = true; //its pressed!
							return true;
						}
					}
				}
			}
			for(var btn in _btnPressMap) {
				if(_btnPressMap.hasOwnProperty(btn)) {
					if(_btnPressMap[btn]) {
						//_btnPressMap[btn] = false;//
						return true;
					}
				}
			}
			//now check movement
			return !(Math.abs(_gamepad.axes[_STICKS.LEFT_STICK_X]) < _THRESHOLD &&
				Math.abs(_gamepad.axes[_STICKS.LEFT_STICK_Y]) < _THRESHOLD &&
				Math.abs(_gamepad.axes[_STICKS.RIGHT_STICK_X]) < _THRESHOLD &&
				Math.abs(_gamepad.axes[_STICKS.RIGHT_STICK_Y]) < _THRESHOLD);

		}

		/*
		will check face buttons (including Directional Pad) for input
		 */
		function handleGamepadFaceButtons() {
			for(var btn in _BUTTONS) {
				if(_BUTTONS.hasOwnProperty(btn)) {
					handleGamepadButton(_BUTTONS[btn]);
				}
			}
		}

		function handleGamepadButton(buttonIdx) {
			//buttons in first IF are testing for being held (good for analog inputs and held down buttons)
			//ELSE IF will activate upon RELEASE of a button
			if(_gamepad.buttons[buttonIdx].value > _THRESHOLD) {
				_btnPressMap[buttonIdx] = true; //set was_pressed
				switch(buttonIdx) {
					case _BUTTONS.LEFT_SHOULDER:
						_BUTTON_MAPPING[buttonIdx]();
						break;
					case _BUTTONS.RIGHT_SHOULDER:
						_BUTTON_MAPPING[buttonIdx]();
						break;
					case _BUTTONS.LEFT_TRIGGER:
						_BUTTON_MAPPING[buttonIdx](_gamepad.buttons[_BUTTONS.LEFT_TRIGGER].value);
						break;
					case _BUTTONS.RIGHT_TRIGGER:
						_BUTTON_MAPPING[buttonIdx](_gamepad.buttons[_BUTTONS.RIGHT_TRIGGER].value);
						break;
				}
			}
			//ON RELEASE
			else if(_btnPressMap[buttonIdx]) {
				_btnPressMap[buttonIdx] = false;
				switch(buttonIdx) {
					case _BUTTONS.SOUTH_BTN:
						_BUTTON_MAPPING[buttonIdx]();
						break;
					case _BUTTONS.EAST_BTN:
						_BUTTON_MAPPING[buttonIdx]();
						break;
					case _BUTTONS.WEST_BTN:
						_BUTTON_MAPPING[buttonIdx]();
						break;
					case _BUTTONS.NORTH_BTN:
						_BUTTON_MAPPING[buttonIdx]();
						break;
					case _BUTTONS.NORTH_DPAD:
						_BUTTON_MAPPING[buttonIdx]();
						break;
					case _BUTTONS.SOUTH_DPAD:
						_BUTTON_MAPPING[buttonIdx]();
						break;
					case _BUTTONS.WEST_DPAD:
						_BUTTON_MAPPING[buttonIdx]();
						break;
					case _BUTTONS.EAST_DPAD:
						_BUTTON_MAPPING[buttonIdx]();
						break;
					case _BUTTONS.RIGHT_STICK_BUTTON:
						_BUTTON_MAPPING[buttonIdx]();
						break;
					case _BUTTONS.LEFT_STICK_BUTTON:
						_BUTTON_MAPPING[buttonIdx]();
						break;
					case _BUTTONS.LEFT_TRIGGER:
						_BUTTON_MAPPING[buttonIdx](_gamepad.buttons[_BUTTONS.LEFT_TRIGGER].value);
						break;
					case _BUTTONS.RIGHT_TRIGGER:
						_BUTTON_MAPPING[buttonIdx](_gamepad.buttons[_BUTTONS.RIGHT_TRIGGER].value);
						break;
				}
			}
		}

		var setMapping = function(mapping) {
			switch(mapping) {
				case "headtracker":
					_BUTTON_MAPPING[_BUTTONS.SOUTH_BTN] = selectObject;
					_BUTTON_MAPPING[_BUTTONS.SOUTH_DPAD] = goHome;
					_BUTTON_MAPPING[_BUTTONS.NORTH_DPAD] = toggleNavMode;
					_BUTTON_MAPPING[_BUTTONS.WEST_BTN] = hideObject;
					_BUTTON_MAPPING[_BUTTONS.LEFT_SHOULDER] = decAltitude;
					_BUTTON_MAPPING[_BUTTONS.RIGHT_SHOULDER] = incAltitude;
					_BUTTON_MAPPING[_BUTTONS.LEFT_TRIGGER] = explode;
					_BUTTON_MAPPING[_BUTTONS.RIGHT_TRIGGER] = fineSpeedAdjust;
					_BUTTON_MAPPING[_BUTTONS.RIGHT_STICK_BUTTON] = deselectAll;
					_BUTTON_MAPPING[_BUTTONS.LEFT_STICK_BUTTON] = unhideAll;
					break;
				default:
					_BUTTON_MAPPING[_BUTTONS.SOUTH_BTN] = selectObject;
					_BUTTON_MAPPING[_BUTTONS.EAST_BTN] = createSavePoint;
					_BUTTON_MAPPING[_BUTTONS.WEST_BTN] = hideObject;
					_BUTTON_MAPPING[_BUTTONS.NORTH_BTN] = showPropertyPanel;
					_BUTTON_MAPPING[_BUTTONS.SOUTH_DPAD] = goHome;
					_BUTTON_MAPPING[_BUTTONS.WEST_DPAD] = previousSavePoint;
					_BUTTON_MAPPING[_BUTTONS.EAST_DPAD] = nextSavePoint;
					_BUTTON_MAPPING[_BUTTONS.NORTH_DPAD] = toggleNavMode;
					_BUTTON_MAPPING[_BUTTONS.LEFT_SHOULDER] = decAltitude;
					_BUTTON_MAPPING[_BUTTONS.RIGHT_SHOULDER] = incAltitude;
					_BUTTON_MAPPING[_BUTTONS.LEFT_TRIGGER] = triggerZoom;
					_BUTTON_MAPPING[_BUTTONS.RIGHT_TRIGGER] = fineSpeedAdjust;
					_BUTTON_MAPPING[_BUTTONS.RIGHT_STICK_BUTTON] = deselectAll;
					_BUTTON_MAPPING[_BUTTONS.LEFT_STICK_BUTTON] = unhideAll;
					break;
			}
		};

		//things buttons can do below
		var goHome = function() {
			viewerapi.navigation.setRequestHomeView(true);
			viewerapi.showAll();
			viewerapi.impl.selector.clearSelection();
			viewerapi.explode(0);
		};

		//Shoulder buttons and triggers
		var decAltitude = function() {
			if(_lockInPlane)
				_altitudeLockCoord += (-_gamepad.buttons[_BUTTONS.LEFT_SHOULDER].pressed) * _actualMoveSpeed;
			else
				_camera.translateY(-_gamepad.buttons[_BUTTONS.LEFT_SHOULDER].pressed * _actualMoveSpeed);
		};

		var incAltitude = function() {
			if(_lockInPlane)
				_altitudeLockCoord += (_gamepad.buttons[_BUTTONS.RIGHT_SHOULDER].pressed) * _actualMoveSpeed;
			else
				_camera.translateY(_gamepad.buttons[_BUTTONS.RIGHT_SHOULDER].pressed * _actualMoveSpeed);
		};

		var explode = function(analog_value) {
			if(analog_value > _THRESHOLD) {
				if(analog_value == 0.5) { //not set yet
					viewerapi.explode(0);
					return;
				}
				_explodeSpeed = analog_value;
				var ns = _explodeSpeed;
				if(ns > 1) ns = 1;
				if(ns < 0) ns = 0;
				viewerapi.explode(ns);
			} else
				viewerapi.explode(0);
		};

		//Triggers are analog, so pass in value of trigger
		var triggerZoom = function(analog_value) {
			if(analog_value > _THRESHOLD) {
				if(analog_value == 0.5) {
					_camera.fov = _INITIAL_FOV;
					_btnPressMap[_BUTTONS.LEFT_TRIGGER] = false;
					return;
				}
				//linear interp: y = -40x + 75
				///75 is original fov angle. smaller slope = greater max zoom.
				// equation will interpolate between based on trigger pressure (analog)
				_camera.fov = _ZOOM_SCALAR * analog_value + _INITIAL_FOV;
			} else {
				_camera.fov = _INITIAL_FOV; //originally 75
			}
		};

		var fineSpeedAdjust = function(analog_value) {
			if(analog_value > _THRESHOLD) {
				if(analog_value == 0.5) { //ignore
					//TODO set speed correctly before input received AND have whole speedadjust down here!!
					_btnPressMap[_BUTTONS.RIGHT_TRIGGER] = false;
					return;
				}
				_speed_scalar = -(_SPEED_ADJUST * analog_value) + _INITIAL_SPEED_SCALAR;
			} else {
				_speed_scalar = _INITIAL_SPEED_SCALAR;
			}

		};

		var createSavePoint = function() {
			var state = _viewerState.getState(VIEWER_STATE_FILTER);
			_savepoints.push(state);
			zvp.logger.log("Savepoint created.");
		};

		var previousSavePoint = function() {
			if(_savepoints.length) {
				_nextsavepoint--;
				if(_nextsavepoint < 0)
					_nextsavepoint = _savepoints.length - 1;
				_viewerState.restoreState(_savepoints[_nextsavepoint]);
			}
		};

		var nextSavePoint = function() {
			if(_savepoints.length) {
				_nextsavepoint++;
				if(_nextsavepoint >= _savepoints.length)
					_nextsavepoint = 0;
				_viewerState.restoreState(_savepoints[_nextsavepoint]);
			}
		};

		var selectObject = function() {
			var res = viewerapi.impl.hitTestViewport(new THREE.Vector3(0, 0, 0));
			if(_currentTool == "headtracker") {
				//vr tool forgets to do this, necessary for center selection
				_camera.updateMatrixWorld();
			}
			if(res) {
				viewerapi.impl.selector.toggleSelection(res.dbId, res.model);
				//viewerapi.fitToView(res.dbId);
			} else {
				viewerapi.impl.selector.clearSelection();
			}
		};

		var deselectAll = function() {
			viewerapi.impl.selector.clearSelection();
		};

		var unhideAll = function() {
			viewerapi.showAll();
			viewerapi.impl.selector.clearSelection();
			viewerapi.explode(0);
		};

		var hideObject = function() {
			var res = viewerapi.impl.hitTestViewport(new THREE.Vector3(0, 0, 0), false);
			if(res) {
				if(res.dbId in viewerapi.getHiddenNodes())
					viewerapi.show(res.dbId);
				else
					viewerapi.hide(res.dbId);
			}
		};

		var showPropertyPanel = function() {
			viewerapi.getPropertyPanel(true).setVisible(!viewerapi.getPropertyPanel(true).isVisible());
		};

		var toggleNavMode = function() {
			_lockInPlane = !_lockInPlane;
			if(_lockInPlane)
				_altitudeLockCoord = _camera.position.z;
			showDPadHud("up");
		};

		init();
	};

})(); // closure
;
(function() {
	'use strict';

	ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.Fusion360Sim');
	var SimulationDef = (function() {
		function SimulationDef() {
			var that = this;
			that.SimulationStudies = {
				LSS: "SimCaseLSS",
				MODAL: "SimCaseModalFrequencies",
				BUCKLING: "SimCaseStructuralBuckling",
				THERMAL: "SimCaseThermalSteady",
				THERMALSTRESS: "SimCaseThermalStress",
				SHAPEGENERATOR: "SimCaseTopOpt",
				NAMES: {
					UNKNOWN: "Unknown",
					LSS: "Static Stress",
					MODAL: "Modal Frequencies",
					BUCKLING: "Structural Buckling",
					THERMAL: "Thermal",
					THERMALSTRESS: "Thermal Stress",
					SHAPEGENERATOR: "Shape Optimization"
				}
			};
			that.studyNode;
			that.loadCases = {};
			that.pointMasssesNode = -1;
			that.pointMassNodes = [];
			that.connectorsNode = -1;
			that.connectorNodes = [];
			that.activeLoadCaseKey = null;
			that.modelNodes = [];
			that.analysisType = that.SimulationStudies.LSS;
			that.modelStructurePanel = null;
			that.simExt = null;
			that.simNodes = [];
		}

		SimulationDef.prototype = {
			constructor: SimulationDef
		};
		var prototype = SimulationDef.prototype;
		prototype.studyName = function() {
			var name = this.SimulationStudies.NAMES.UNKNOWN;
			if(this.analysisType === this.SimulationStudies.LSS)
				name = this.SimulationStudies.NAMES.LSS;
			else if(this.analysisType === this.SimulationStudies.MODAL)
				name = this.SimulationStudies.NAMES.MODAL;
			else if(this.analysisType === this.SimulationStudies.BUCKLING)
				name = this.SimulationStudies.NAMES.BUCKLING;
			else if(this.analysisType === this.SimulationStudies.THERMAL)
				name = this.SimulationStudies.NAMES.THERMAL;
			else if(this.analysisType === this.SimulationStudies.THERMALSTRESS)
				name = this.SimulationStudies.NAMES.THERMALSTRESS;
			else if(this.analysisType === this.SimulationStudies.SHAPEGENERATOR)
				name = this.SimulationStudies.NAMES.SHAPEGENERATOR;
			return name;
		}
		prototype.reset = function() {
			var that = this;
			that.studyNode = -1;
			that.modelNodes = [];
			that.analysisType = that.SimulationStudies.LSS;
			that.loadCases = {};
			that.pointMasssesNode = -1;
			that.pointMassNodes = [];
			that.connectorsNode = -1;
			that.connectorNodes = [];
			that.activeLoadCaseKey = null;
			that.simNodes = [];
			that.modelStructurePanel = null;
		};
		prototype.addLoadCase = function(loadCaseName, loadCaseID, loadCaseNode) {
			var that = this;
			var loadCaseDef = new aves.Fusion360Sim.SimulationLoadCaseDef();
			loadCaseDef.loadCase = loadCaseNode;
			loadCaseDef.loadCaseName = loadCaseName;
			//if initialization so set active the first one
			that.loadCases["SIM_LOAD_CASE" + loadCaseID] = loadCaseDef;
			if(Object.keys(that.loadCases).length === 1)
				that.activeLoadCaseKey = "SIM_LOAD_CASE" + loadCaseID;

			return loadCaseDef;
		};

		prototype.shouldDisplayInTree = function(node) {
			var that = this;
			var nodeId = node.dbId;
			if(that.simNodes.indexOf(nodeId) < 0) return false;
			if(that.studyNode === nodeId) return true;
			if(that.activeLoadCaseKey === null) return false;

			if(that.pointMasssesNode === nodeId) return true;
			if(that.pointMassNodes.indexOf(nodeId) !== -1) return true;

			if(that.connectorNodes.indexOf(nodeId) !== -1) return true;
			if(that.connectorsNode === nodeId) return true;

			var groupKeys = Object.keys(that.loadCases);
			for(var i = 0; i < groupKeys.length; i++) {
				var loadCase = that.loadCases[groupKeys[i]];
				if(loadCase.isImportant(nodeId))
					return loadCase.shouldDisplayInTree(nodeId);
			}

			//var activeLoadCase = that.loadCases[that.activeLoadCaseKey];
			//if(activeLoadCase === null) return false;
			//var visible = activeLoadCase.isImportant(node);

			return false;
		}

		return SimulationDef;
	})();
	ZhiUTech.Viewing.Extensions.Fusion360Sim.SimulationDef = SimulationDef;

	var SimulationLoadCaseDef = (function() {
		function SimulationLoadCaseDef() {
			var that = this;

			that.loadCase = -1;
			that.loadCaseName = "";
			that.constraintsNode = -1;
			that.constraintNodes = [];
			that.loadsNode = -1;
			that.loadNodes = [];
			that.resultsNode = -1;
			that.undeformedResults = -1;
			that.resultTypes = {};
			that.resultGroups = {};
			that.modalResults = {};
		}

		SimulationLoadCaseDef.prototype = {
			constructor: SimulationLoadCaseDef
		};

		var prototype = SimulationLoadCaseDef.prototype;
		prototype.associateResult = function(resultName, resultNode) {
			this.resultTypes[resultNode] = resultName;
		};

		prototype.associateResultGroup = function(resultGroupName, resultGroupNode) {
			this.resultGroups[resultGroupNode] = resultGroupName;
		};

		prototype.associateModalResult = function(resultName, resultNode) {
			var subResultNode = [];
			subResultNode = this.modalResults[resultName];
			if(!subResultNode) {
				var subNode = [];
				subNode.push(resultNode);
				subResultNode = subNode;
			} else {
				subResultNode.push(resultNode);
			}
			this.modalResults[resultName] = subResultNode;
		};

		prototype.isImportant = function(nodeId) {
			var that = this;
			if(that.loadCase === nodeId) return true;
			if(that.loadNodes.indexOf(nodeId) !== -1) return true;
			if(that.constraintNodes.indexOf(nodeId) !== -1) return true;

			//do not show///
			if(that.resultsNode === nodeId) return true;
			////////////
			if(that.constraintsNode === nodeId) return true;
			if(that.loadsNode === nodeId) return true;

			return false;
		};

		prototype.shouldDisplayInTree = function(nodeId) {
			var that = this;
			if(that.loadCase === nodeId) return true;
			if(that.loadNodes.indexOf(nodeId) !== -1) return true;
			if(that.constraintNodes.indexOf(nodeId) !== -1) return true;

			//do not show///
			if(that.resultsNode === nodeId) return false;
			////////////
			if(that.constraintsNode === nodeId) return true;
			if(that.loadsNode === nodeId) return true;

			return false;
		};

		prototype.reset = function() {
			var that = this;
			that.constraintsNode = -1;
			that.constraintNodes = [];
			that.loadsNode = -1;
			that.loadNodes = [];
			that.resultsNode = -1;
			that.undeformedResults = -1;
			that.resultTypes = {};
			that.resultGroups = {};
			that.modalResults = {};
		};
		return SimulationLoadCaseDef;
	})();
	ZhiUTech.Viewing.Extensions.Fusion360Sim.SimulationLoadCaseDef = SimulationLoadCaseDef;

})();;
(function() {
	'use strict';

	ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.Fusion360Sim');

	var zv = ZhiUTech.Viewing;
	var _ave = zv.Extension;
	var aves = zv.Extensions;
	var avu = zv.UI;
	var i18n = zv.i18n;

	var GalleryPanel = (function() {
		// helper methods
		function styleBuilder(element, styleObject) {
			if(!element || !styleObject) return;
			var cssText = element.style.cssText.trim();
			var colon = ";";
			var isEndingWithColon = cssText.substring(cssText.length - 1) === ";";
			if(!isEndingWithColon) {
				cssText = cssText + ";";
			}
			var styleString = [];
			for(var style in styleObject) {
				styleString[styleString.length] = [style, styleObject[style]].join(':');
			}
			styleString = styleString.join(';');
			element.style.cssText = styleString;
		}

		function preparePanel() {
			var that = this,
				labelUndeformed, optUndeformed, resultGroup, legend, resultTypes, divColorScale, colorScale, colorScaleTopText, colorScaleBottomText, /*line1,*/ line2, tbl, tblBody;
			avu.DockingPanel.prototype.initialize.call(that);
			var container = that.container;
			container.classList.add('property-panel', 'simulation-container', 'position-' + (that.position || "left") + '-corner');
			container.dockRight = true;

			legend = that.legend = document.createElement('div');
			var docfrag = document.createDocumentFragment();

			//results div//////////
			var divResults = document.createElement('div');
			divResults.classList.add('sim-div-Results');

			resultGroup = that.resultsGroup = document.createElement("select");
			resultGroup.classList.add('simulation-resultGroup');
			divResults.appendChild(resultGroup);

			resultTypes = that.resultTypes = document.createElement("select");
			resultTypes.classList.add('simulation-resultTypes');
			divResults.appendChild(resultTypes);
			docfrag.appendChild(divResults);
			///////////////////////
			//sim options
			var divResultsOption = document.createElement('div');
			divResultsOption.classList.add('sim-div-options');
			optUndeformed = that.optUndeformed = document.createElement("input");
			optUndeformed.classList.add('sim-undeformedOption');
			optUndeformed.setAttribute("type", "checkbox");
			optUndeformed.setAttribute("name", "optUndeformed");
			optUndeformed.setAttribute("id", "Undeformed");
			optUndeformed.addEventListener('change', function(e) { // When someone clicks on it
				var activeLoadCase = that.simDef.loadCases[that.simDef.activeLoadCaseKey];
				if(activeLoadCase === null) return;
				if(activeLoadCase.undeformedResults === -1)
					return;
				if(that.optUndeformed.checked) {
					//show undeformed state
					that.viewer.show(activeLoadCase.undeformedResults);
				} else {
					that.viewer.hide(activeLoadCase.undeformedResults);
				}
			});

			optUndeformed.checked = false;
			divResultsOption.appendChild(optUndeformed);
			//do this after you append it
			optUndeformed.checked = false;

			labelUndeformed = that.labelUndeformed = document.createElement('label');
			labelUndeformed.classList.add('sim-undeformedOptionText');
			labelUndeformed.htmlFor = "Undeformed";
			labelUndeformed.setAttribute("data-i18n", "Show Undeformed Model");
			labelUndeformed.textContent = i18n.translate("Show Undeformed Model");
			divResultsOption.appendChild(labelUndeformed);
			docfrag.appendChild(divResultsOption);
			///////////////////////

			//      line1 = that.line1 = document.createElement("hr");
			//      line1.classList.add('sim-line1');
			//      docfrag.appendChild(line1);

			//color scale div
			divColorScale = that.divColorScale = document.createElement("div");
			divColorScale.classList.add('sim-div-colorscale');
			divColorScale.classList.add('sim-div-colorscale-top1');
			colorScale = that.colorScale = document.createElement("div");
			colorScale.classList.add('simulation-colorscale');
			divColorScale.appendChild(colorScale);

			colorScaleTopText = that.colorScaleTopText = document.createElement("div");
			colorScaleTopText.classList.add('sim-colorScaleTopText');
			colorScaleTopText.innerHTML = "- 3333";
			divColorScale.appendChild(colorScaleTopText);

			colorScaleBottomText = that.colorScaleBottomText = document.createElement("div");
			colorScaleBottomText.classList.add('sim-colorScaleBottomText');
			colorScaleBottomText.innerHTML = "- 3333";
			divColorScale.appendChild(colorScaleBottomText);
			docfrag.appendChild(divColorScale);
			////////////////////////////////////

			line2 = that.line2 = document.createElement("hr");
			line2.classList.add('sim-line2');
			docfrag.appendChild(line2);

			var divTable = document.createElement('div');
			divTable.classList.add('sim-div-Table');
			divTable.addEventListener('click', function(e) { // When someone clicks on it
				divTable.classList.add('sim-div-Table-Collapse');
				container.classList.add('simulation-container-Collapse');
				divColorScale.classList.add('sim-div-colorscale-Collapse');
			});

			divColorScale.addEventListener('click', function(e) { // When someone clicks on it
				divTable.classList.remove('sim-div-Table-Collapse');
				container.classList.remove('simulation-container-Collapse');
				divColorScale.classList.remove('sim-div-colorscale-Collapse');
			});

			tbl = that.tbl = document.createElement("table");
			tblBody = that.tblBody = document.createElement("tbody");
			tbl.appendChild(tblBody);
			tbl.classList.add('sim-table');
			divTable.appendChild(tbl);
			docfrag.appendChild(divTable);

			legend.appendChild(docfrag);

			container.appendChild(legend);
		}

		function getPropertyValue(properties, propertyName) {
			for(var i = 0; i < properties.length; ++i) {
				var property = properties[i];
				if(property.displayName === propertyName) {
					return property.displayValue;
				}
			}
			return null;
		}

		function toggleDisable(element, len) {
			var resultGroupDisable = false;
			var style = '""';
			if(len <= 1) {
				resultGroupDisable = true;
				style = "none";
			}
			element.disabled = resultGroupDisable;
			styleBuilder(element, {
				"-webkit-appearance": style,
				"-moz-appearance": style,
				appearance: style
			});
		}

		// GalleryPanel class
		function GalleryPanel(viewer, options) {
			var that = this;
			options = options || {};
			that.viewer = viewer;
			that.simDef = null;
			avu.DockingPanel.call(that, viewer.container, 'Simulation-Panel', 'Simulation Results');
			// panel position configuration.
			that.position = options.position || "right";
		}

		GalleryPanel.prototype = Object.create(avu.DockingPanel.prototype);
		var prototype = GalleryPanel.prototype;
		prototype.constructor = GalleryPanel;

		prototype.initialize = function() {
			var that = this;
			preparePanel.call(that);
			that.resultsGroup.addEventListener('change', function(event) {
				var simDef = that.simDef;
				var activeLoadCase = simDef.loadCases[that.simDef.activeLoadCaseKey];
				that.viewer.hide(activeLoadCase.resultsNode);
				var caller = 'fillResultTypes';
				if(simDef.modalAnalysis) {
					caller = 'fillModalResultTypes';
				}
				that[caller](simDef.activeLoadCaseKey, that.resultsGroup.value);
				setTimeout(function() {
					that.setSimObjectsVisibility();
				}, 100);
			});
			that.resultTypes.addEventListener('change', function() {
				var activeLoadCase = that.simDef.loadCases[that.simDef.activeLoadCaseKey];
				that.viewer.hide(activeLoadCase.resultsNode);
				that.setSimObjectsVisibility();
			});
		};

		prototype.setSimulationDef = function(simDef) {
			var that = this,
				studyNode, loadCase, studyName, tblBody, resultsGroup, viewer;
			that.simDef = simDef;
			studyNode = simDef.studyNode * 1;

			function onStudyPropertiesRetrieved(studyNode) {
				var name = getPropertyValue(studyNode.properties, "Name");
				that.setTitle(name);
			}

			//hide undeformed option if neccessary
			if(simDef.undeformedResults === -1) {
				that.optUndeformed.classList.add('sim-hide');
				that.labelUndeformed.classList.add('sim-hide');
				that.divColorScale.classList.remove('sim-div-colorscale-top1');
				that.divColorScale.classList.add('sim-div-colorscale-top2');
			}

			function onError(status, message, data) {}

			that.viewer.getProperties(studyNode, onStudyPropertiesRetrieved, onError);
			//result groups
			studyName = i18n.translate(simDef.studyName());
			// info: Analysis type
			tblBody = that.tblBody;
			if(!that.rowType) {
				var rowsToInsert = [{
						name: 'rowType',
						content: [i18n.translate("Analysis Type"), studyName]
					},
					{
						name: 'rowNodes',
						content: [i18n.translate("Nodes"), '1872']
					},
					{
						name: 'rowElements',
						content: [i18n.translate("Elements"), '1084']
					},
					{
						name: 'rowMin',
						content: [i18n.translate("Min"), '0.000E+02 MPa']
					},
					{
						name: 'rowMax',
						content: [i18n.translate("Max"), '5.117E+02 MPa']
					}
				];
				rowsToInsert.forEach(function(row) {
					that[row.name] = tblBody.insertRow(-1);
					row.content.forEach(function(cellValue) {
						that[row.name].insertCell(-1).innerHTML = cellValue;
					});
				});
			} else {
				that.rowType.cells[1].innerHTML = studyName;
			}

			viewer = that.viewer;

			viewer.model.getObjectTree(function(instanceTree) {
				that.instanceTree = instanceTree;
				that.fillResultsGroup(that.simDef.activeLoadCaseKey);
				var callee = simDef.analysisType === simDef.SimulationStudies.MODAL || simDef.analysisType === simDef.SimulationStudies.BUCKLING ? 'fillModalResultTypes' : 'fillResultTypes';
				that[callee](that.simDef.activeLoadCaseKey, that.resultsGroup.value);
				setTimeout(function() {
					simDef.simExt.showResultsDlg(true);
					simDef.simExt.applySettings();
					that.setSimObjectsVisibility();
				}, 500);
			});

			//elements & nodes
			var resultsNode = +that.simDef.resultsNode;

			function onResultsPropertiesRetrieved(resultsNode) {
				var elements = getPropertyValue(resultsNode.properties, "Elements");
				var nodes = getPropertyValue(resultsNode.properties, "Nodes");
				that.rowElements.cells[1].innerText = elements;
				that.rowNodes.cells[1].innerText = nodes;
			}

			viewer.getProperties(resultsNode, onResultsPropertiesRetrieved, onError);
		};

		prototype.processNodes = function(instanceTree, onProcessed) {
			var that = this;
			var nodeIdsToProcess = [];
			var simDef = that.simDef;
			var viewer = that.viewer;
			var loadCase = null;
			if(!simDef) {
				simDef = new aves.Fusion360Sim.SimulationDef();
			} else {
				simDef.reset();
			}
			instanceTree.enumNodeChildren(instanceTree.getRootId(), function(dbId) {
				nodeIdsToProcess[nodeIdsToProcess.length] = dbId;
			}, true);

			function processNodeId(node, onNodeProcessed) {
				function onPropertiesRetrieved(result) {
					//force to hide until all init. that.viewer.hide(node);
					var properties = result.properties;
					var name = getPropertyValue(result.properties, 'A1C6011B-E1A6-4ADF-975D-A0003C592F87');
					if(name) {
						var bSimNode = true;
						switch(name) {
							case "SIM_STUDY":
								simDef.studyNode = node;
								var type = getPropertyValue(result.properties, "Study Type");
								simDef.analysisType = type;
								break;
							case "SIM_POINT_MASSES":
								simDef.pointMasssesNode = node;
								break;
							case "SIM_POINT_MASS":
								simDef.pointMassNodes.push(node);
								break;
							case "SIM_CONNECTORS":
								simDef.connectorsNode = node;
								break;
							case "SIM_CONNECTOR":
								//case "SIM_BOLT_CONNECTOR":
								//case "SIM_SPRING_CONNECTOR":
								simDef.connectorNodes.push(node);
								break;
							case "SIM_LOAD_CASE":
								loadCase = simDef.addLoadCase(getPropertyValue(result.properties, 'Name'), node, node);
								break;
							case "SIM_CONSTRAINTS":
								if(loadCase == null) {
									loadCase = simDef.addLoadCase(i18n.translate("Load Case:1"), 0, 0);
								}
								loadCase.constraintsNode = node;
								break;
							case "SIM_CONSTRAINT":
								loadCase.constraintNodes.push(node);
								break;
							case "SIM_LOADS":
								if(loadCase == null) {
									loadCase = simDef.addLoadCase(i18n.translate("Load Case:1"), 0, 0);
								}
								loadCase.loadsNode = node;
								break;
							case "SIM_LOAD":
								loadCase.loadNodes.push(node);
								break;
							case "SIM_RESULTS_SCALAR_PLOT":
								if(loadCase == null) {
									loadCase = simDef.addLoadCase(i18n.translate("Load Case:1"), 0, 0);
								}
								if(simDef.analysisType === simDef.SimulationStudies.LSS || simDef.analysisType === simDef.SimulationStudies.THERMAL ||
									simDef.analysisType === simDef.SimulationStudies.THERMALSTRESS || simDef.analysisType === simDef.SimulationStudies.SHAPEGENERATOR) {
									loadCase.associateResult(getPropertyValue(properties, "Name"), node);
								} else { //Buckling, Modal
									loadCase.associateModalResult(getPropertyValue(properties, "Name"), node);
								}
								break;
							case "SIM_RESULTS_GROUP":
								if(loadCase == null) {
									loadCase = simDef.addLoadCase(i18n.translate("Load Case:1"), 0, 0);
								}
								if(simDef.analysisType === simDef.SimulationStudies.LSS || simDef.analysisType === simDef.SimulationStudies.THERMAL ||
									simDef.analysisType === simDef.SimulationStudies.THERMALSTRESS || simDef.analysisType === simDef.SimulationStudies.SHAPEGENERATOR) {
									loadCase.associateResultGroup(getPropertyValue(properties, "Name"), node);
								}
								break;
							case "SIM_RESULTS":
								if(loadCase == null) {
									loadCase = simDef.addLoadCase(i18n.translate("Load Case:1"), 0, 0);
								}
								loadCase.resultsNode = node;
								//viewer.hide(node);
								break;
							case "SIM_RESULTS_UNDEFORMED_FEATURE_EDGES_PLOT":
								if(loadCase == null) {
									loadCase = simDef.addLoadCase(i18n.translate("Load Case:1"), 0, 0);
								}
								loadCase.undeformedResults = node;
								//viewer.hide(node);
								break;
							case "SIM_RESULTS_SCALAR_PLOT_BODY":
							case "SIM_RESULTS_SAMPLE":
								// Nothing for now!
								break;
						}
						if(bSimNode === true) {
							simDef.simNodes.push(node);
						}
					} else {
						simDef.modelNodes.push(node);
					}
					onNodeProcessed();
				}

				function onError(status, message, data) {
					onNodeProcessed();
				}

				if(node && viewer) {
					viewer.getProperties(node, onPropertiesRetrieved, onError);
				}
			}

			// Process the nodes one by one.
			function processNext() {
				if(nodeIdsToProcess.length > 0) {
					processNodeId(nodeIdsToProcess.shift(), processNext);
				} else {
					// No more nodes to process - call the provided callback.
					onProcessed(simDef);
				}
			}

			processNext();
		};

		prototype.initModel = function(instanceTree, simExt) {
			var that = this;
			var viewer = that.viewer;
			if(!viewer) return;
			that.processNodes(instanceTree, function(simDef) {
				simDef.simExt = simExt;
				that.setSimulationDef(simDef);
			});
			that.addEventListener(that.viewer, zv.SELECTION_CHANGED_EVENT, function(e) {
				var nodes = e.nodeArray;
				if(nodes) {
					that.handleClick(nodes[0]);

					//     for (var k = 0; k < nodes.length; k++)
					//     {
					//         if(that.isModelNode(nodes[k]))
					//         {
					//           that.viewer.hide(that.simDef.resultsNode);
					//           break;
					//         }
					//      }
				}
			});
		};

		prototype.fillResultsGroup = function(loadCaseKey) {
			var that = this;
			var simDef = that.simDef;
			var loadCase = simDef.loadCases[loadCaseKey];
			var resultsGroup = that.resultsGroup;

			resultsGroup.options.length = 0;
			var groupKeys = Object.keys(simDef.analysisType === simDef.SimulationStudies.MODAL || simDef.analysisType === simDef.SimulationStudies.BUCKLING ? loadCase.modalResults : loadCase.resultGroups);
			for(var i = 0; i < groupKeys.length; i++) {
				var item = document.createElement("option");
				item.value = groupKeys[i];
				var name = simDef.analysisType === simDef.SimulationStudies.MODAL || simDef.analysisType === simDef.SimulationStudies.BUCKLING ? groupKeys[i] : loadCase.resultGroups[groupKeys[i]];
				item.setAttribute("data-i18n", name);
				item.textContent = i18n.translate(name);
				resultsGroup.add(item);
			}

			toggleDisable(resultsGroup, resultsGroup.options.length, false);
		};

		prototype.fillResultTypes = function(loadCaseKey, resultGroupKey) {
			var that = this;
			var viewer = that.viewer;
			var resultTypes = that.resultTypes;
			var resultsGroup = that.resultsGroup;
			var loadCase = that.simDef.loadCases[loadCaseKey];

			resultTypes.options.length = 0;
			var node = +resultGroupKey;

			function onError(status, message, data) {
				// onNodeProcessed();
			}

			function onGroupPropertiesRetrieved(groupResult) {
				var key = "Result group";
				var resultGroup = getPropertyValue(groupResult.properties, key);

				function onResultPropertiesRetrieved(resultType) {
					var resultTypeGroup = getPropertyValue(resultType.properties, key);
					if(resultTypeGroup === resultGroup) {
						var item = document.createElement("option");
						item.value = resultType.dbId;
						var name = loadCase.resultTypes[resultType.dbId];
						item.setAttribute("data-i18n", name);
						item.textContent = i18n.translate(name);
						resultTypes.add(item);
						toggleDisable(resultTypes, resultTypes.options.length, resultsGroup.options.length === 0);
					}
				}

				//result types
				var keys = Object.keys(loadCase.resultTypes);
				for(var i = 0; i < keys.length; i++) {
					var resultNode = +keys[i];
					viewer.getProperties(resultNode, onResultPropertiesRetrieved, onError);
				}
			}

			viewer.getProperties(node, onGroupPropertiesRetrieved, onError);
		};

		prototype.fillModalResultTypes = function(loadCaseKey, resultGroupKey) {
			var that = this;
			var resultTypes = that.resultTypes;
			var resultsGroup = that.resultsGroup;
			var loadCase = that.simDef.loadCases[loadCaseKey];

			resultTypes.options.length = 0;
			var resultGroup = resultGroupKey;

			function onResultPropertiesRetrieved(resultType) {
				var resultTypeGroup = getPropertyValue(resultType.properties, "Result type");
				if(resultTypeGroup === resultGroup) {
					var item = document.createElement("option");
					item.value = resultType.dbId;
					var resultMode = getPropertyValue(resultType.properties, "Mode");
					var name = resultMode;
					item.setAttribute("data-i18n", name);
					item.textContent = name; //ZhiUTech.Viewing.i18n.translate(name); //Mode 1: 200 Hz -> result from translate 200 Hz -> not acceptable
					that.resultTypes.add(item);
					//that.simDef.associateResult(name, resultType.dbId);
					toggleDisable(resultTypes, resultTypes.options.length, resultsGroup.options.length === 0);
				}
			}

			function onError(status, message, data) {
				// onNodeProcessed();
			}

			//result types
			var keys = loadCase.modalResults[resultGroup] || [];
			for(var i = 0; i < keys.length; i++) {
				var resultNode = +keys[i];
				that.viewer.getProperties(resultNode, onResultPropertiesRetrieved, onError);
			}

		};

		prototype.uninitialize = function() {
			avu.DockingPanel.prototype.uninitialize.call(this);
			this.viewer = null;
		};

		prototype.setTitle = function(title, options) {
			if(!title) {
				title = 'Simulations';
				options = options || {};
				options.localizeTitle = true;
			}
			avu.DockingPanel.prototype.setTitle.call(this, title, options);
		};

		prototype.setModelNodesVisible = function(bVisible) {
			var that = this;
			var viewer = that.viewer;
			if(!that.simDef) return;
			var modelNodes = that.simDef.modelNodes;
			if(modelNodes && modelNodes.length > 0) {
				for(var k = 0; k < modelNodes.length; k++) {
					viewer[bVisible ? "show" : "hide"](modelNodes[k]);
				}
			}
		};

		//    prototype.isModelNode = function (node) {
		//      var that = this;
		//      if(!that.simDef) return;
		//      var modelNodes = that.simDef.modelNodes;
		//      if (!modelNodes || modelNodes.length === 0) {
		//        return;
		//      }
		//      return modelNodes.indexOf(node) !== -1;
		//    };

		prototype.setNodeVisibility = function(node, visible) {
			this.viewer[visible ? "show" : "hide"](node);
		};

		prototype.isSimStudyNode = function(node) {
			if(!this.simDef.studyNode) return false;
			return this.simDef.studyNode === node;
		};

		prototype.handleClick = function(nodeId) {
			var that = this;
			if(that.simDef === null) return false;
			var activeLoadCase = that.simDef.loadCases[that.simDef.activeLoadCaseKey];
			if(activeLoadCase === null) return false;
			//if(!activeLoadCase.isImportant(node)) return false;
			var groupKeys = Object.keys(that.simDef.loadCases);
			for(var i = 0; i < groupKeys.length; i++) {
				var loadCase = that.simDef.loadCases[groupKeys[i]];
				if(loadCase.isImportant(nodeId) && activeLoadCase !== loadCase) {
					//hide old load case items
					if(activeLoadCase.loadsNode !== -1) that.viewer.hide(activeLoadCase.loadsNode);
					if(activeLoadCase.constraintsNode !== -1) that.viewer.hide(activeLoadCase.constraintsNode);
					if(activeLoadCase.undeformedResults !== -1) that.viewer.hide(activeLoadCase.undeformedResults);
					if(activeLoadCase.resultsNode !== -1) that.viewer.hide(activeLoadCase.resultsNode);
					if(that.simDef.connectorsNode !== -1) that.viewer.hide(that.simDef.connectorsNode);
					//set new active load case
					that.simDef.activeLoadCaseKey = groupKeys[i];
					//fill results group cbo with new items
					that.fillResultsGroup(that.simDef.activeLoadCaseKey);
					var callee = that.simDef.analysisType === that.simDef.SimulationStudies.MODAL || that.simDef.analysisType === that.simDef.SimulationStudies.BUCKLING ? 'fillModalResultTypes' : 'fillResultTypes';
					//fill results type cbo with new items
					that[callee](that.simDef.activeLoadCaseKey, that.resultsGroup.value);
					//sets the visibility of new items
					setTimeout(function() {
						that.simDef.simExt.showResultsDlg(true);
						that.setSimObjectsVisibility();
					}, 500);
					return true;
				}
			}

			return false;
		};

		prototype.setSimObjectsVisibility = function(node) {
			var that = this;
			//if no results and no active load then show model and hide results panel
			var activeLoadCase = that.simDef.loadCases[that.simDef.activeLoadCaseKey];
			if(!that.resultTypes || that.resultTypes.options.length === 0 || activeLoadCase === null) {
				that.setModelNodesVisible(true);
				that.simDef.simExt.showResultsDlg(false);
				return;
			}

			var resultNode = +that.resultTypes.value;
			//hide models
			that.setModelNodesVisible(false);
			//show result
			if(resultNode !== -1) that.viewer.show(resultNode);
			//show loads of active load case
			if(activeLoadCase.loadsNode !== -1) that.viewer.show(activeLoadCase.loadsNode);
			//show constraints of active load case
			if(activeLoadCase.constraintsNode !== -1) that.viewer.show(activeLoadCase.constraintsNode);
			//show undeformed style if
			if(that.optUndeformed.checked && activeLoadCase.undeformedResults !== -1)
				that.viewer.show(activeLoadCase.undeformedResults);
			//show connectors
			if(that.simDef.connectorsNode !== -1) that.viewer.show(that.simDef.connectorsNode);

			//this.viewer.fitToView();
			function onResultPropertiesRetrieved(resultType) {
				var minValue = getPropertyValue(resultType.properties, "Minimal value");
				var maxValue = getPropertyValue(resultType.properties, "Maximal value");
				var reversed = getPropertyValue(resultType.properties, "Scale reversed");
				var unit = getPropertyValue(resultType.properties, "Unit");
				that.rowMin.cells[1].innerText = minValue + " " + unit;
				that.rowMax.cells[1].innerText = maxValue + " " + unit;

				var minRefValue = getPropertyValue(resultType.properties, "Lower referential value");
				var maxRefValue = getPropertyValue(resultType.properties, "Upper referential value");
				if(reversed === "True") {
					//var temp = maxRefValue;
					//maxRefValue = minRefValue;
					//minRefValue = temp;
					that.colorScale.style.transform = "rotate(90deg)";
					that.colorScale.style.moztransform = "rotate(90deg)";
					that.colorScale.style.webkittransform = "rotate(90deg)";
				} else {
					that.colorScale.style.transform = "rotate(-90deg)";
					that.colorScale.style.moztransform = "rotate(-90deg)";
					that.colorScale.style.webkittransform = "rotate(-90deg)";
				}
				that.colorScaleTopText.innerHTML = "- " + maxRefValue + " " + unit;
				that.colorScaleBottomText.innerHTML = "- " + minRefValue + " " + unit;
			}

			function onError(status, message, data) {
				// onNodeProcessed();
			}

			that.viewer.getProperties(resultNode, onResultPropertiesRetrieved, onError);
		};

		return GalleryPanel;
	})();

	aves.Fusion360Sim.GalleryPanel = GalleryPanel;

})();;
(function() {
	'use strict';

	ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.Fusion360Sim');

	ZhiUTech.Viewing.Extensions.Fusion360Sim.SimModelStructurePanel = function(ext, title, options) {
		ZhiUTech.Viewing.Extensions.ViewerModelStructurePanel.call(this, ext.viewer, title, options);
		this.viewer = ext.viewer;
		this.ext = ext;
	};

	ZhiUTech.Viewing.Extensions.Fusion360Sim.SimModelStructurePanel.prototype = Object.create(ZhiUTech.Viewing.Extensions.ViewerModelStructurePanel.prototype);
	ZhiUTech.Viewing.Extensions.Fusion360Sim.SimModelStructurePanel.prototype.constructor = ZhiUTech.Viewing.Extensions.Fusion360Sim.SimModelStructurePanel;

	ZhiUTech.Viewing.Extensions.Fusion360Sim.SimModelStructurePanel.prototype.setGallery = function(gallery) {
		this.simGalleryPanel = gallery;
	};

	ZhiUTech.Viewing.Extensions.Fusion360Sim.SimModelStructurePanel.prototype.initialize = function() {
		ZhiUTech.Viewing.Extensions.ViewerModelStructurePanel.prototype.initialize.call(this);
	};

	ZhiUTech.Viewing.Extensions.Fusion360Sim.SimModelStructurePanel.prototype.isSimResultsNode = function(node) {
		if(!this.simGalleryPanel || !this.simGalleryPanel.simDef || !this.simGalleryPanel.simDef.resultsNode) return false;
		return this.simGalleryPanel.simDef.resultsNode == node;
	};

	ZhiUTech.Viewing.Extensions.Fusion360Sim.SimModelStructurePanel.prototype.isSimStudyNode = function(node) {
		if(!this.simGalleryPanel || !this.simGalleryPanel.simDef || !this.simGalleryPanel.simDef.studyNode) return false;
		return this.simGalleryPanel.simDef.studyNode == node;
	};

	ZhiUTech.Viewing.Extensions.Fusion360Sim.SimModelStructurePanel.prototype.isModelNode = function(node) {
		if(!this.simGalleryPanel || !this.simGalleryPanel.simDef || !this.simGalleryPanel.simDef.modelNodes || this.simGalleryPanel.simDef.modelNodes.length == 0)
			return false;

		return this.simGalleryPanel.simDef.modelNodes.indexOf(node) !== -1;
	};

	ZhiUTech.Viewing.Extensions.Fusion360Sim.SimModelStructurePanel.prototype.shouldInclude = function(node) {
		var that = this;
		if(!that.simGalleryPanel || !that.simGalleryPanel.simDef) return false;
		if(that.isModelNode(node)) return true;
		if(that.isSimStudyNode(node)) return true;

		var simDef = that.simGalleryPanel.simDef;
		var groupKeys = Object.keys(simDef.loadCases);
		for(var i = 0; i < groupKeys.length; i++) {
			var loadCase = simDef.loadCases[groupKeys[i]];
			if(loadCase.resultsNode === node) return false;
		}

		return true;
	}

	ZhiUTech.Viewing.Extensions.Fusion360Sim.SimModelStructurePanel.prototype.onClick = function(node, event) {
		ZhiUTech.Viewing.Extensions.ViewerModelStructurePanel.prototype.onClick.call(this, node, event);

		this.simGalleryPanel.handleClick(node);
	};

	ZhiUTech.Viewing.Extensions.Fusion360Sim.SimModelStructurePanel.prototype.expandStudyNode = function() {
		if(!this.simGalleryPanel.simDef.studyNode) return;
		this.tree.setCollapsed(this.simGalleryPanel.simDef.studyNode, false);
	};

})();;
(function() {
	'use strict';

	ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.Fusion360Sim');

	var zv = ZhiUTech.Viewing;

	zv.GEOMETRY_LOAD_START = 'geometryLoadStarted'; // Ehhh, what?

	var Simulation = (function() {

		var defaults = {};
		var loadSimulationExtension = false;

		function Simulation(viewer, options) {
			var that = this;
			options = options || {};
			// Check options, else override with defaults.
			for(var i in defaults) {
				options[i] = options[i] || defaults[i];
			}
			zv.Extension.call(that, viewer, options);
			this.name = 'fusionsim';

			viewer.addEventListener(zv.GEOMETRY_LOAD_START, function(event) {
				//if extension is already loadded
				//need to unload it first
				if(loadSimulationExtension)
					that.unload();
				var extension = event.data.extensions;
				if(extension === 'ZhiUTech.Fusion360.Simulation') {
					loadSimulationExtension = true;
				} else {
					that.unload();
					loadSimulationExtension = false;
				}
			});
			viewer.addEventListener(zv.GEOMETRY_LOADED_EVENT, function(event) {
				//  if (loadSimulationExtension) {
				that.load();
				//   }
			});
		}

		Simulation.prototype = Object.create(zv.Extension.prototype);
		var prototype = Simulation.prototype;
		prototype.constructor = Simulation;

		prototype.load = function() {
			var that = this;
			var viewer = that.viewer;
			if(!viewer.model) return true;
			that.galleryPanel = new zv.Extensions.Fusion360Sim.GalleryPanel(that.viewer);
			that.viewer.addPanel(that.galleryPanel);
			that.simButton = new zv.UI.Button('toolbar-simulation');
			that.simButton.setVisible(false);
			that.simButton.setToolTip('Simulation Results');
			that.simButton.onClick = function(e) {
				var visible = that.galleryPanel.isVisible();
				if(!visible) {
					that.activate(that.galleryPanel);
				} else {
					that.deactivate(that.galleryPanel);
				}
				that.simButton.setState(!visible ? zv.UI.Button.State.ACTIVE : zv.UI.Button.State.INACTIVE);
			};
			that.simButton.setIcon('toolbar-simulationIcon');
			viewer.settingsTools.addControl(that.simButton, {
				index: 1
			});

			// Change these viewer settings for SIM files.
			// keep defaults
			that.hideLines = viewer.prefs.get("lineRendering");
			that.ghosting = viewer.prefs.get("ghosting");
			that.ambientShadow = viewer.prefs.get("ambientShadows");
			that.antialiazing = viewer.prefs.get("antialiasing");
			that.lightPreset = viewer.prefs.get("lightPreset");
			viewer.model.getObjectTree(function(instanceTree) {
				setTimeout(function() {
					that.galleryPanel.initModel(instanceTree, that);
					that.initModelBrowser();
				}, 100);
			});
			return true;
		};
		prototype.unload = function() {
			var that = this;
			if(!that.viewer.model) return;
			that.showResultsDlg(false);
			that.viewer.settingsTools.removeControl(this.simButton);
			that.viewer.removePanel(this.galleryPanel);
			that.galleryPanel.uninitialize();
			// restore viewer settings back.
			that.viewer.hideLines(!that.hideLines);
			that.viewer.setGhosting(that.ghosting);
			that.viewer.setQualityLevel(that.ambientShadow, that.antialiazing);
			that.viewer.setLightPreset(that.lightPreset);
			return true;
		};

		prototype.initModelBrowser = function() {
			var that = this;
			setTimeout(function() {
				that.options = that.options || {};
				that.options.addFooter = true;
				that.modelStructurePanel = new ZhiUTech.Viewing.Extensions.Fusion360Sim.SimModelStructurePanel(that, 'Simulation Model Structure Loading', that.options);
				that.viewer.setModelStructurePanel(that.modelStructurePanel);
				that.modelStructurePanel.setGallery(that.galleryPanel);
			}, 100);
		};

		prototype.showResultsDlg = function(show) {
			var that = this;
			that.simButton.setState(show ? zv.UI.Button.State.ACTIVE : zv.UI.Button.State.INACTIVE);
			that.simButton.setVisible(show);
			that.galleryPanel.setVisible(show);
		};
		prototype.applySettings = function() {
			var viewer = this.viewer;
			viewer.hideLines(false);
			viewer.setGhosting(false);
			viewer.setQualityLevel(false, true);
			viewer.setLightPreset(4);
		};
		prototype.simData = function() {
			return this.galleryPanel.simDef;
		};

		prototype.activate = function(galleryPanel) {
			if(!this.activeStatus) {
				galleryPanel.setVisible(true);
				this.activeStatus = true;
			}
			return true;

		};

		prototype.deactivate = function(galleryPanel) {
			if(this.activeStatus) {
				galleryPanel.setVisible(false);
				this.activeStatus = false;
			}
			return true;
		};

		return Simulation;
	})();

	zv.Extensions.Simulation = Simulation;
	zv.theExtensionManager.registerExtension('ZhiUTech.Fusion360.Simulation', zv.Extensions.Simulation);

})();;
(function() {

	"use strict";
	var namespace = ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.Explode');

	function ExplodeExtension(viewer, options) {
		ZhiUTech.Viewing.Extension.call(this, viewer, options);
		this.viewer = viewer;
		this.options = options;
		this.name = "explode";
		this.slider = viewer.explodeSubmenu.querySelector(".explode-slider");
		this.explodeButton = viewer.modelTools.getControl('toolbar-explodeTool');

	}
	ExplodeExtension.prototype = Object.create(ZhiUTech.Viewing.Extension.prototype);
	ExplodeExtension.prototype.constructor = ExplodeExtension;

	var proto = ExplodeExtension.prototype;

	proto.activate = function() {
		if(!this.activeStatus) {
			this.viewer.explodeSubmenu.style.display = "";
			this.activeStatus = true;
		}
		return true;
	};

	proto.deactivate = function() {
		if(this.activeStatus) {
			this.slider.parentNode.style.display = "none";
			this.viewer.explode(0);
			this.viewer.explodeSlider.value = 0;
			this.activeStatus = false;
		}
		return true;
	};

	namespace.ExplodeExtension = ExplodeExtension;
	ZhiUTech.Viewing.theExtensionManager.registerExtension('ZhiUTech.Explode', namespace.ExplodeExtension);

})();;
(function() {

	"use strict";
	var namespace = ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.FullScreen');

	function FullScreenExtension(viewer, options) {
		ZhiUTech.Viewing.Extension.call(this, viewer, options);
		this.viewer = viewer;
		this.options = options;
		this.name = "fullscreen";
	}
	FullScreenExtension.prototype = Object.create(ZhiUTech.Viewing.Extension.prototype);
	FullScreenExtension.prototype.constructor = FullScreenExtension;

	var proto = FullScreenExtension.prototype;

	proto.activate = function() {
		if(!this.activeStatus) {
			this.viewer.nextScreenMode();
			this.activeStatus = true;
		}
		return true;
	};

	proto.deactivate = function() {
		if(this.activeStatus) {
			this.viewer.escapeScreenMode();
			this.activeStatus = false;
		}
		return true;
	};

	namespace.FullScreenExtension = FullScreenExtension;
	ZhiUTech.Viewing.theExtensionManager.registerExtension('ZhiUTech.FullScreen', namespace.FullScreenExtension);

})();;
(function() {

	"use strict";
	var namespace = ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.GoHome');

	function GoHomeExtension(viewer, options) {
		ZhiUTech.Viewing.Extension.call(this, viewer, options);
		this.viewer = viewer;
		this.options = options;
		this.name = "gohome";
	}
	GoHomeExtension.prototype = Object.create(ZhiUTech.Viewing.Extension.prototype);
	GoHomeExtension.prototype.constructor = GoHomeExtension;

	var proto = GoHomeExtension.prototype;

	proto.activate = function() {
		this.viewer.navigation.setRequestHomeView(true);
		return true;
	};

	proto.deactivate = function() {
		return false;
	};

	namespace.GoHomeExtension = GoHomeExtension;
	ZhiUTech.Viewing.theExtensionManager.registerExtension('ZhiUTech.GoHome', namespace.GoHomeExtension);

})();;
(function() {

	"use strict";
	var namespace = ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.LayerManager');
	var ave = ZhiUTech.Viewing.Extensions;

	function LayerManagerExtension(viewer, options) {
		ZhiUTech.Viewing.Extension.call(this, viewer, options);
		this.viewer = viewer;
		this.options = options;
		this.name = "layermanager";
	}
	LayerManagerExtension.prototype = Object.create(ZhiUTech.Viewing.Extension.prototype);
	LayerManagerExtension.prototype.constructor = LayerManagerExtension;

	var proto = LayerManagerExtension.prototype;

	proto.activate = function() {
		if(!this.activeStatus) {
			if(!this.viewer.layersPanel) {
				this.viewer.setLayersPanel(new ave.ViewerLayersPanel(this.viewer));
			}
			this.viewer.showLayerManager(true);
			this.activeStatus = true;
		}
		return true;
	};

	proto.deactivate = function() {
		if(this.activeStatus) {
			if(!this.viewer.layersPanel) {
				this.viewer.setLayersPanel(new ave.ViewerLayersPanel(this.viewer));
			}
			this.viewer.showLayerManager(false);
			this.activeStatus = false;
		}
		return true;
	};

	namespace.LayerManagerExtension = LayerManagerExtension;
	ZhiUTech.Viewing.theExtensionManager.registerExtension('ZhiUTech.LayerManager', namespace.LayerManagerExtension);

})();;
(function() {

	"use strict";
	var namespace = ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.ModelStructure');

	function ModelStructureExtension(viewer, options) {
		ZhiUTech.Viewing.Extension.call(this, viewer, options);
		this.viewer = viewer;
		this.options = options;
		this.name = "modelstructure";
	}
	ModelStructureExtension.prototype = Object.create(ZhiUTech.Viewing.Extension.prototype);
	ModelStructureExtension.prototype.constructor = ModelStructureExtension;

	var proto = ModelStructureExtension.prototype;

	proto.activate = function() {
		if(!this.activeStatus) {
			this.viewer.showModelStructurePanel(true);
			this.activeStatus = true;
		}
		return true;
	};

	proto.deactivate = function() {
		if(this.activeStatus) {
			this.viewer.showModelStructurePanel(false);
			this.activeStatus = false;
		}
		return true;
	};

	namespace.ModelStructureExtension = ModelStructureExtension;
	ZhiUTech.Viewing.theExtensionManager.registerExtension('ZhiUTech.ModelStructure', namespace.ModelStructureExtension);

})();;
(function() {

	"use strict";
	var namespace = ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.PropertiesManager');

	function PropertiesManagerExtension(viewer, options) {
		ZhiUTech.Viewing.Extension.call(this, viewer, options);
		this.viewer = viewer;
		this.options = options;
		this.propertyPanel = this.viewer.getPropertyPanel(true);
		this.name = "propertiesmanager";
	}
	PropertiesManagerExtension.prototype = Object.create(ZhiUTech.Viewing.Extension.prototype);
	PropertiesManagerExtension.prototype.constructor = PropertiesManagerExtension;

	var proto = PropertiesManagerExtension.prototype;

	proto.activate = function() {
		if(!this.activeStatus) {
			this.propertyPanel.setVisible(true);
			this.activeStatus = true;
		}
		return true;
	};

	proto.deactivate = function() {
		if(this.activeStatus) {
			this.propertyPanel.setVisible(false);
			this.activeStatus = false;
		}
		return true;
	};

	namespace.PropertiesManagerExtension = PropertiesManagerExtension;
	ZhiUTech.Viewing.theExtensionManager.registerExtension('ZhiUTech.PropertiesManager', namespace.PropertiesManagerExtension);

})();;
(function() {

	"use strict";
	var namespace = ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.ViewerSettings');
	var ave = ZhiUTech.Viewing.Extensions;

	function ViewerSettingsExtension(viewer, options) {
		ZhiUTech.Viewing.Extension.call(this, viewer, options);
		this.viewer = viewer;
		this.options = options;
		this.name = "viewersettings";
	}
	ViewerSettingsExtension.prototype = Object.create(ZhiUTech.Viewing.Extension.prototype);
	ViewerSettingsExtension.prototype.constructor = ViewerSettingsExtension;

	var proto = ViewerSettingsExtension.prototype;

	proto.activate = function() {
		if(!this.activeStatus) {
			this.viewer.showViewer3dOptions(true);
			var panel = this.viewer.getSettingsPanel(true);
			panel.selectTab(ave.ViewerSettingTab.Performance);
			this.activeStatus = true;
		}
		return true;
	};

	proto.deactivate = function() {
		if(this.activeStatus) {
			this.viewer.showViewer3dOptions(false);
			this.activeStatus = false;
		}
		return true;
	};

	namespace.ViewerSettingsExtension = ViewerSettingsExtension;
	ZhiUTech.Viewing.theExtensionManager.registerExtension('ZhiUTech.ViewerSettings', namespace.ViewerSettingsExtension);

})();;