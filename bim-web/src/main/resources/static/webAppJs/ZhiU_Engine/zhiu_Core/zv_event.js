

(function() {

	"use strict";

	var zv = ZhiUTech.Viewing;

	/**
	 * Fired when the ESC key is pressed.
	 * @event ZhiUTech.Viewing.Viewer3D#ESCAPE_EVENT
	 */
	zv.ESCAPE_EVENT = 'escape';
	/**
	 * Fired repeatedly throughout the process of opening a model/drawing.
	 * @event ZhiUTech.Viewing.Viewer3D#PROGRESS_UPDATE_EVENT
	 * @property {number} percent - Estimated progress.
	 * @property {number} state - Value from ZhiUTech.Viewing.ProgressState, providing details on the progress state.
	 */
	zv.PROGRESS_UPDATE_EVENT = 'progress';
	/**
	 * Fired when the screen mode changes.
	 * @event ZhiUTech.Viewing.Viewer3D#FULLSCREEN_MODE_EVENT
	 * @property {ZhiUTech.Viewing.ScreenMode} mode - New screen mode.
	 */
	zv.FULLSCREEN_MODE_EVENT = 'fullScreenMode';
	/**
	 * Fired then the navigation tool changes.
	 * @event ZhiUTech.Viewing.Viewer3D#NAVIGATION_MODE_CHANGED_EVENT
	 * @property {string} id - Tool identifier.
	 */
	zv.NAVIGATION_MODE_CHANGED_EVENT = 'navmode';
	/**
	 * Fired when the viewer state is restored.
	 * @event ZhiUTech.Viewing.Viewer3D#VIEWER_STATE_RESTORED_EVENT
	 * @property {bool} value - Success of the state restoration.
	 */
	zv.VIEWER_STATE_RESTORED_EVENT = 'viewerStateRestored';
	/**
	 * Fired when the viewer size changes.
	 * @event ZhiUTech.Viewing.Viewer3D#VIEWER_RESIZE_EVENT
	 * @property {number} width - New width of the viewer.
	 * @property {number} height - New height of the viewer.
	 */
	zv.VIEWER_RESIZE_EVENT = 'viewerResize';
	/**
	 * Fired when the viewer is fully initialized.
	 * @event ZhiUTech.Viewing.Viewer3D#VIEWER_INITIALIZED
	 */
	zv.VIEWER_INITIALIZED = 'viewerInitialized';
	/**
	 * Fired when the viewer is fully uninitialized.
	 * @event ZhiUTech.Viewing.Viewer3D#VIEWER_UNINITIALIZED
	 */
	zv.VIEWER_UNINITIALIZED = 'viewerUninitialized';

	/**
	 * Fired when the model/drawing finishes loading.
	 * @event ZhiUTech.Viewing.Viewer3D#GEOMETRY_LOADED_EVENT
	 * @property {object} model - Model data.
	 */
	zv.GEOMETRY_LOADED_EVENT = 'geometryLoaded';
	/**
	 * Fired when the layers of the model are successfully loaded.
	 * @event ZhiUTech.Viewing.Viewer3D#MODEL_LAYERS_LOADED_EVENT
	 * @property {object} root - Model layers root.
	 * @property {object} model - Model data.
	 */
	zv.MODEL_LAYERS_LOADED_EVENT = 'modelLayersLoaded';
	/**
	 * Fired when a viewer extension is successfully loaded.
	 * @event ZhiUTech.Viewing.Viewer3D#EXTENSION_LOADED_EVENT
	 * @property {string} extensionId - Extension identifier.
	 */
	zv.EXTENSION_LOADED_EVENT = 'extensionLoaded';
	/**
	 * Fired when a viewer extension is successfully unloaded.
	 * @event ZhiUTech.Viewing.Viewer3D#EXTENSION_UNLOADED_EVENT
	 * @property {string} extensionId - Extension identifier.
	 */
	zv.EXTENSION_UNLOADED_EVENT = 'extensionUnloaded';

	/**
	 * Fired when the list of selected objects changes.
	 * @event ZhiUTech.Viewing.Viewer3D#SELECTION_CHANGED_EVENT
	 * @property {number[]} fragIdsArray - Fragment IDs of selected objects.
	 * @property {number[]} dbIdArray - dbIDs of selected objects.
	 * @property {number[]} nodeArray - Same as dbIdArray.
	 * @property {object} model - Model data.
	 */
	zv.SELECTION_CHANGED_EVENT = 'selection';
	/**
	 * Fired when the list of selected objects changes in a multi-model context.
	 * @event ZhiUTech.Viewing.Viewer3D#AGGREGATE_SELECTION_CHANGED_EVENT
	 * @property {object[]} selections - List of objects containing the typical selection properties
	 *   of {@link ZhiUTech.Viewing.Viewer3D#SELECTION_CHANGED_EVENT} for each model.
	 */
	zv.AGGREGATE_SELECTION_CHANGED_EVENT = 'aggregateSelection';
	/**
	 * Fired when the viewer isolates a set of objects (i.e., makes everything else invisible or ghosted).
	 * @event ZhiUTech.Viewing.Viewer3D#ISOLATE_EVENT
	 * @property {number[]} nodeIdArray - List of isolated node IDs.
	 * @property {object} model - Model data.
	 */
	zv.ISOLATE_EVENT = 'isolate';
	/**
	 * Fired when the list of isolated objects changes in a multi-model context.
	 * @event ZhiUTech.Viewing.Viewer3D#AGGREGATE_ISOLATION_CHANGED_EVENT
	 * @property {object[]} isolation - List of objects containing the typical selection properties
	 *   of {@link ZhiUTech.Viewing.Viewer3D#ISOLATE_EVENT} for each model.
	 */
	zv.AGGREGATE_ISOLATION_CHANGED_EVENT = 'aggregateIsolation';
	/**
	 * Fired when the viewer hides a set of objects.
	 * @event ZhiUTech.Viewing.Viewer3D#HIDE_EVENT
	 * @property {number[]} nodeIdArray - List of hidden node IDs.
	 * @property {object} model - Model data.
	 */
	zv.HIDE_EVENT = 'hide';
	/**
	 * Fired when the viewer shows a set of objects.
	 * @event ZhiUTech.Viewing.Viewer3D#SHOW_EVENT
	 * @property {number[]} nodeIdArray - List of shown node IDs.
	 * @property {object} model - Model data.
	 */
	zv.SHOW_EVENT = 'show';

	/**
	 * Fired when a camera changes.
	 * @event ZhiUTech.Viewing.Viewer3D#CAMERA_CHANGE_EVENT
	 * @property {object} camera - Affected camera.
	 */
	zv.CAMERA_CHANGE_EVENT = 'cameraChanged';
	/**
	 * Fired whenever the Explode tool is used.
	 * @event ZhiUTech.Viewing.Viewer3D#EXPLODE_CHANGE_EVENT
	 * @property {number} scale - Scale of the current exploded state.
	 */
	zv.EXPLODE_CHANGE_EVENT = 'explodeChanged';
	/**
	 * Fired when a ``fitToView`` operation is applied.
	 * @event ZhiUTech.Viewing.Viewer3D#FIT_TO_VIEW_EVENT
	 * @property {boolean} immediate - True if the change was immediate.
	 * @property {number[]} nodeIdArray - List of node IDs fitted. Array is empty when fitting to the whole model.
	 * @property {object} model - Model data.
	 */
	zv.FIT_TO_VIEW_EVENT = 'fitToView';
	/**
	 * Fired when ``fitToView`` operation is applied, supports multi-model contexts.
	 * @event ZhiUTech.Viewing.Viewer3D#AGGREGATE_FIT_TO_VIEW_EVENT
	 * @property {object[]} selection - List of objects each containing a ``model`` instance and a ``selection`` array of ids.
	 */
	zv.AGGREGATE_FIT_TO_VIEW_EVENT = 'aggregateFitToView';
	/**
	 * Fired when the cutting planes change.
	 * @event ZhiUTech.Viewing.Viewer3D#CUTPLANES_CHANGE_EVENT
	 * @property {object[]} planes - List of cutplanes.
	 */
	zv.CUTPLANES_CHANGE_EVENT = 'cutplanesChanged';
	/**
	 * Fired when a tool is activated or deactivated.
	 * @event ZhiUTech.Viewing.Viewer3D#TOOL_CHANGE_EVENT
	 * @property {string} toolName - Name of a specific mode of a tool.
	 * @property {object} tool - Tool object.
	 * @property {bool} active - Current status of the tool.
	 */
	zv.TOOL_CHANGE_EVENT = 'toolChanged';
	/**
	 * Fired when rendering options change.
	 * @event ZhiUTech.Viewing.Viewer3D#RENDER_OPTION_CHANGED_EVENT
	 */
	zv.RENDER_OPTION_CHANGED_EVENT = 'renderOptionChanged';
	/**
	 * Fired when the render frame shown by the Viewer is final or complete (it has
	 * no more pending geometry or post processing effects which delay incoming frames),
	 * or when the Viewer stops showing final frames. The name refers to when the
	 * state changes from busy to idle for the renderer, or vice versa. To know
	 * when all geometry is fully displayed, also check for GEOMETRY_LOADED_EVENT.
	 *
	 * @event ZhiUTech.Viewing.Viewer3D#FINAL_FRAME_RENDERED_CHANGED_EVENT
	 * @property {bool} finalFrame - final frame is displayed this tick.
	 */
	zv.FINAL_FRAME_RENDERED_CHANGED_EVENT = 'finalFrameRenderedChanged';
	/**
	 * Fired when the render has presented to the screen.
	 * @event ZhiUTech.Viewing.Viewer3D#RENDER_PRESENTED_EVENT
	 */
	zv.RENDER_PRESENTED_EVENT = 'renderPresented';
	/**
	 * Fired when visibility of a 2D layer changes.
	 * @event ZhiUTech.Viewing.Viewer3D#LAYER_VISIBILITY_CHANGED_EVENT
	 */
	zv.LAYER_VISIBILITY_CHANGED_EVENT = 'layerVisibility';
	/**
	 * Fired when a model is reset to its initial configuration.
	 * @deprecated
	 * @event ZhiUTech.Viewing.Viewer3D#RESET_EVENT
	 */
	zv.RESET_EVENT = 'reset';

	/**
	 * Fired when a user preference property changes.
	 * @event ZhiUTech.Viewing.Viewer3D#PREF_CHANGED_EVENT
	 * @property {string} name - Property name.
	 * @property {object} value - New property value.
	 */
	zv.PREF_CHANGED_EVENT = 'PrefChanged';
	/**
	 * Fired when a user preference property is reset.
	 * @event ZhiUTech.Viewing.Viewer3D#PREF_RESET_EVENT
	 * @property {string} name - Property name.
	 * @property {object} value - New property value.
	 */
	zv.PREF_RESET_EVENT = 'PrefReset';

	/**
	 * Fired when the user clicks on the UI for restoring default settings.
	 * Will get fired after all other ZhiUTech.Viewing.PREF_CHANGED_EVENT get fired.
	 * @event ZhiUTech.Viewing.Viewer3D#RESTORE_DEFAULT_SETTINGS_EVENT
	 */
	zv.RESTORE_DEFAULT_SETTINGS_EVENT = 'restoreDefaultSettings';

	/**
	 * Fired when animations are successfully initialized.
	 * @event ZhiUTech.Viewing.Viewer3D#ANIMATION_READY_EVENT
	 */
	zv.ANIMATION_READY_EVENT = 'animationReady';

	/**
	 * Fired whenever a camera transition is finished, such as Focus, Go to Home View,
	 * Restore State, restore Named Views, and others.
	 * @event ZhiUTech.Viewing.Private.Autocam#CAMERA_TRANSITION_COMPLETED
	 */
	zv.CAMERA_TRANSITION_COMPLETED = 'cameraTransitionCompleted';

	/**
	 * Fired when user clicks on a hyperlink embedded in the model.
	 * @event ZhiUTech.Viewing.Viewer3D#HYPERLINK_EVENT
	 * @property {object} data - Hyperlink data.
	 */
	zv.HYPERLINK_EVENT = 'hyperlink';

	zv.LOAD_GEOMETRY_EVENT = 'load_geometry';

})();;