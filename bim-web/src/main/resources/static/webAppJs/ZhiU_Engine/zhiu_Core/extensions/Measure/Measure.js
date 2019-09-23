
(function() {

'use strict';

var avem = ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.Measure'),
    av = ZhiUTech.Viewing,
    avu = av.UI;
var MeasureCommon = ZhiUTech.Viewing.MeasureCommon;

var NONE = 0;
var MEASURE_TOOL = 1;
var CALIBRATION_TOOL = 2;

var DEFAULT_MEASUREMENT_TYPE = MeasureCommon.MeasurementTypes.MEASUREMENT_DISTANCE;

/**
 * Extension used to support distance and angle measure for 2d and 3d models.
 * @constructor
 * @tutorial feature_measure
 * @param {ZhiUTech.Viewing.Viewer3D} viewer - Viewer to be extended.
 * @param {object} options - An optional dictionary of options for this extension.
 * @memberof ZhiUTech.Viewing.Extensions.Measure
 * @alias ZhiUTech.Viewing.Extensions.Measure.MeasureExtension
 * @category Extensions
*/
var MeasureExtension = function(viewer, options) {
    ZhiUTech.Viewing.Extension.call(this, viewer, options);
    this.modes = ['distance','angle','area','calibrate'];
    this.name = 'measure';
};

MeasureExtension.prototype = Object.create(ZhiUTech.Viewing.Extension.prototype);
MeasureExtension.prototype.constructor = MeasureExtension;


MeasureExtension.prototype.onToolbarCreated = function() {
    this.viewer.removeEventListener(av.TOOLBAR_CREATED_EVENT, this.bindedOnToolbarCreated);
    this.bindedOnToolbarCreated = null;
    this.createUI();
};

/**
 * Load the measure extension.
 * @returns {boolean} True if measure extension is loaded successfully.
*/
MeasureExtension.prototype.load = function() {

    var self   = this;
    var viewer = this.viewer;
    this.hasUI = ZhiUTech.Viewing.Private.GuiViewer3D && viewer instanceof ZhiUTech.Viewing.Private.GuiViewer3D;

    this.escapeHotkeyId = 'ZhiUTech.Measure.Hotkeys.Escape';

    // Register the Measure tool
    if (!viewer.toolController){
        return false;
    }

    this.options = this.options || {};
    var measureToolOptions = {};

    measureToolOptions.onCloseCallback = function() {
        self.enableMeasureTool(false);
    };

    // Shared State with measureTool & calibrationTool.
    // Gets populated when a model is received.
    this.sharedMeasureConfig = { 
        units: null,
        precision: null,
        calibrationFactor: null
    };

	measureToolOptions.snapperOptions = this.options.snapperOptions;

    this.forceCalibrate = this.options.forceCalibrate;

    this.isCalibrated = (this.options.calibrationFactor != null);

    this.snapper = new MeasureCommon.Snapper(viewer);
    viewer.toolController.registerTool(this.snapper);

    this.measureTool = new avem.MeasureTool(viewer, measureToolOptions, this.sharedMeasureConfig, this.snapper);
    viewer.toolController.registerTool(this.measureTool);

    this.calibrationTool = new ZhiUTech.Viewing.Extensions.Measure.CalibrationTool(viewer, this.options, this.sharedMeasureConfig, this.snapper);
    viewer.toolController.registerTool(this.calibrationTool);

    this.magnifyingGlass = new ZhiUTech.Viewing.Extensions.Measure.MagnifyingGlass(viewer);
    viewer.toolController.registerTool(this.magnifyingGlass);

    this.onFinishedCalibration = function() {
        if (self.measureToolbar) {
            self.measureToolbar.updateSettingsPanel();
        }

        self.activateInitiator && self.activateInitiator();
    };

    viewer.addEventListener('finished-calibration', this.onFinishedCalibration);

    this.onMeasurementChanged = function(event) {
        var type = event.data;
        self.changeMeasurementType(type);
    };

    viewer.addEventListener(MeasureCommon.Events.MEASUREMENT_CHANGED_EVENT, this.onMeasurementChanged);

    if (viewer.model) {
        onModelLoaded(this, viewer.model);
    } else {
        viewer.addEventListener(av.MODEL_ROOT_LOADED_EVENT, function(event){
            onModelLoaded(self, event.model);
        }, { once: true });
    }

    return true;
};

function onModelLoaded(measureExt, model) {
    populateSharedMeasureConfig(measureExt, model);

    if (measureExt.viewer.toolbar) {
        measureExt.createUI();
    } else {
        measureExt.bindedOnToolbarCreated = measureExt.onToolbarCreated.bind(measureExt);
        measureExt.viewer.addEventListener(av.TOOLBAR_CREATED_EVENT, measureExt.bindedOnToolbarCreated);
    }
}


function populateSharedMeasureConfig(measureExt, model) {
    measureExt.sharedMeasureConfig.units = model.getDisplayUnit();
    measureExt.sharedMeasureConfig.precision = model.is2d() ? 3 : 1;
    measureExt.sharedMeasureConfig.calibrationFactor = measureExt.options.calibrationFactor;
}

/**
 * Unload the measure extension.
 * @returns {boolean} True if measure extension is unloaded successfully.
*/
MeasureExtension.prototype.unload = function () {
    var viewer = this.viewer;

    // Remove the ui from the viewer.
    this.destroyUI();
    if (this.bindedOnToolbarCreated) {
        this.viewer.removeEventListener(av.TOOLBAR_CREATED_EVENT, this.bindedOnToolbarCreated);
        this.bindedOnToolbarCreated = null;
    }

    viewer.removeEventListener('finished-calibration', this.onFinishedCalibration);
    viewer.removeEventListener(MeasureCommon.Events.MEASUREMENT_CHANGED_EVENT, this.onMeasurementChanged);

    viewer.toolController.deregisterTool(this.snapper);
    this.snapper = null;

    viewer.toolController.deregisterTool(this.measureTool);
    this.measureTool = null;

    viewer.toolController.deregisterTool(this.calibrationTool);
    this.calibrationTool = null;

    viewer.toolController.deregisterTool(this.magnifyingGlass);
    this.magnifyingGlass = null;

    return true;
};

/**
 * Enable/disable the measure tool.
 * @param {boolean} active - True to activate, false to deactivate.
 * @returns {boolean} True if a change in activeness occurred.
 */
MeasureExtension.prototype.setActive = function(active) {
    return this.enableMeasureTool(active);
};

/**
 * Toggles activeness of the measure tool.
 * @return {boolean} Whether the tool is active.
 */
MeasureExtension.prototype.toggle = function() {
    if (this.isActive()) {
        this.enableMeasureTool(false);
    } else {
        this.enableMeasureTool(true);
    }
    return this.isActive();
};

/**
 * Get the current measurement in the measure tool.
 * @param {string} unitType - Optional measure unit: "decimal-ft", "ft", "ft-and-decimal-in", "decimal-in", "fractional-in", "m", "cm", "mm" or "m-and-cm".
 * @param {number} precision - Optional measure precision index (0: 0, 1: 0.1, 2: 0.01, 3: 0.001, 4: 0.0001, 5: 0.00001).
 * When units type is "ft", "in" or "fractional-in", then the precisions are 0: 1, 1: 1/2, 2: 1/4, 3: 1/8, 4: 1/16, 5: 1/32, 6: 1/64.
 * @returns {object|null} Object with properties of the current measurement, or null.
 */
MeasureExtension.prototype.getMeasurement = function(unitType, precision) {
    var measurement = null;
    if (this.measureTool.isActive()) {
        measurement = this.measureTool.getMeasurement(unitType, precision);
    }
    return measurement;
};

/**
 * Get all available units in measure tool.
 * @returns {object[]} Array of all available units.
*/
MeasureExtension.prototype.getUnitOptions = function() {
    var units = [
        { name: 'Unknown', type: '' },
        { name: 'Decimal feet', type: 'decimal-ft' },
        { name: 'Feet and fractional inches', type: 'ft' },
        { name: 'Feet and decimal inches', type: 'ft-and-decimal-in' },
        { name: 'Decimal inches', type: 'decimal-in' },
        { name: 'Fractional inches', type: 'fractional-in' },
        { name: 'Meters', type: 'm' },
        { name: 'Centimeters', type: 'cm' },
        { name: 'Millimeters', type: 'mm' },
        { name: 'Meters and centimeters', type: 'm-and-cm' }
    ];

    return units;
};

/**
 * Get all available precisions in measure tool.
 * @param {boolean} isFractional - Set true to get fractional precisions.
 * @return {string[]} List of all available precisions.
*/
MeasureExtension.prototype.getPrecisionOptions = function(isFractional) {

    var precisions;

    if (isFractional)
        precisions = ['1', '1/2', '1/4', '1/8', '1/16', '1/32', '1/64'];
    else
        precisions = ['0', '0.1', '0.01', '0.001', '0.0001', '0.00001'];

    return precisions;
};

/**
 * Get the default measure unit in measure tool.
 * @returns {string} The default measure unit.
*/
MeasureExtension.prototype.getDefaultUnit = function() {
    var unit = this.viewer.model.getDisplayUnit();

    return unit;
};

MeasureExtension.prototype.openCalibrationRequiredDialog = function (initiator) {
    if (this.hasUI) {
        if (!this.CalibrationRequiredDialog) {
            this.CalibrationRequiredDialog = new ZhiUTech.Viewing.Extensions.Measure.CalibrationRequiredDialog(this, this.viewer, "calibration-required", "Calibration Required", this.options );
        }

        this.CalibrationRequiredDialog.setVisible(true);
    }
    else {
        this.viewer.dispatchEvent({ type: avem.CALIBRATION_REQUIRED_EVENT });
    }

    if (initiator === 'measure') {
        this.activateInitiator = function() {
            this.enableMeasureTool(true, DEFAULT_MEASUREMENT_TYPE);
            this.activateInitiator = null;
        };
    } else if (initiator === 'dimension') {
        this.activateInitiator = function() {
            this.viewer.dispatchEvent({ type: ZhiUTech.Viewing.Extensions.Markups.Core.FINISHED_CALIBRATION_FOR_DIMENSION_EVENT });
            this.activateInitiator = null;
        };
    }
};
/**
 * @param mode Measurement Mode
 * @returns {boolean}
 */

MeasureExtension.prototype.activate = function (mode) {
    if (this.activeStatus && this.mode === mode) {
        return;
    }
    this.enterMeasurementMode();
    switch (mode) {
        default:
        case 'distance':
            this.enableMeasureTool(true, MeasureCommon.MeasurementTypes.MEASUREMENT_DISTANCE);
            this.mode = 'distance';
            break;
        case 'angle':
            this.enableMeasureTool(true, MeasureCommon.MeasurementTypes.MEASUREMENT_ANGLE);
            this.mode = 'angle';
            break;
        case 'area':
            if(!this.viewer.model.is2d()) {
                console.warn('Area mode is applicable on 3D models only');
            } else {
                this.enableMeasureTool(true, MeasureCommon.MeasurementTypes.MEASUREMENT_AREA);
                this.mode = 'area';
            }
            break;
        case 'calibrate':
            this.enableCalibrationTool(true);
            this.mode = 'calibrate';
            break;
    }
    this.activeStatus = true;
    return true;
};

/**
 *
 * @param mode Measurement Mode
 * @returns {boolean}
 */
MeasureExtension.prototype.deactivate = function () {
    if(this.activeStatus) {
        this.exitMeasurementMode();
        this.activeStatus = false;
    }
    return true;
};

/**
 * Enable/disable the measure tool.
 * @param {boolean} enable - True to enable, false to disable.
 * @returns {boolean} True if the tool state was changed.
 * @private
 */
MeasureExtension.prototype.enableMeasureTool = function(enable, measurementType) {
    if (measurementType === MeasureCommon.MeasurementTypes.MEASUREMENT_AREA && this.viewer.model && !this.viewer.model.is2d()) {
        return false;
    }

    var toolController = this.viewer.toolController,
        isActive = (this.selectedTool === MEASURE_TOOL);

    if (!this.viewer.model || (!enable && isActive)) {
        if (this.measureTool.isActive()) {
            toolController.deactivateTool("measure");

            if (this.measureToolbar) {
                this.measureToolbar.deactivateAllButtons();
            }
        }

        this.selectedTool = NONE;

        return true;
    }

    this.forceCalibrate |= this.viewer.model.getData().isLeaflet;

    if (!measurementType) {
        measurementType = DEFAULT_MEASUREMENT_TYPE;
    }

    if (enable && !isActive) {
        // Fetch topology when opening Measure tool for the first time.
        this.checkAndFetchTopology(toolController.getTool('measure'));

        if (!this.forceCalibrate || (this.forceCalibrate && this.calibrationTool.isCalibrated()) || measurementType === MeasureCommon.MeasurementTypes.MEASUREMENT_ANGLE) {
            if (this.calibrationTool.isActive()) {
                toolController.deactivateTool("calibration");
            }
            
            if (this.measureToolbar) {
                this.measureToolbar.updateSettingsPanel();
            }

            toolController.activateTool("measure");

            this.selectedTool = MEASURE_TOOL;

            

            this.changeMeasurementType(measurementType);
            return true;
        }
        else {
            this.viewer.addEventListener(avem.OPEN_TOOL_AFTER_CALIBRAION, function(){
                this.enableMeasureTool(true);                
            }.bind(this), {once: true});
            
            this.openCalibrationRequiredDialog('measure');
            return false;
        }

    } else if (enable && isActive) {
        if (!this.forceCalibrate || (this.forceCalibrate && this.calibrationTool.isCalibrated()) || measurementType === MeasureCommon.MeasurementTypes.MEASUREMENT_ANGLE) {
            this.changeMeasurementType(measurementType);
            return true;
        }
        else {
            this.openCalibrationRequiredDialog('measure');
            return false;
        }
    }

    return false;
};

MeasureExtension.prototype.changeMeasurementType = function(measurementType) {
    this.measureTool.changeMeasurementType(measurementType);
    if (this.measureToolbar) {
        this.measureToolbar.deactivateAllButtons();
        this.measureToolbar.activateButtonByType(measurementType);
    }
};

/**
 * Enable/disable the measure tool.
 * @param {boolean} enable - True to enable, false to disable.
 * @returns {boolean} True if the tool state was changed.
 * @private
 */
MeasureExtension.prototype.enableCalibrationTool = function(enable) {
    var toolController = this.viewer.toolController,
        isActive = (this.selectedTool == CALIBRATION_TOOL);

    if (enable && !isActive) {
        if (this.measureTool.isActive()) {
            toolController.deactivateTool("measure");
        }
        
        toolController.activateTool("calibration");
        this.viewer.dispatchEvent({ type: MeasureCommon.Events.UNITS_CALIBRATION_STARTS_EVENT });
        
        if (this.measureToolbar) {
            this.measureToolbar.deactivateAllButtons();
            this.measureToolbar.activateButtonByType(MeasureCommon.MeasurementTypes.CALIBRATION);
        }

        this.selectedTool = CALIBRATION_TOOL;
        return true;

    } else if (!enable && isActive) {
        if (this.calibrationTool.isActive()) {
            this.mode = '';
            toolController.deactivateTool("calibration");
            if (this.measureToolbar) {
                this.measureToolbar.deactivateAllButtons();
            }
        }

        this.selectedTool = NONE;
        return true;
    }
    return false;
};

/**
 * @private
 */
MeasureExtension.prototype.enterMeasurementMode = function() {

    if (this._measurementMode) return;
    this._measurementMode = true;

    var toolbar = this.viewer.getToolbar(false);    
    var viewerToolbarContainer = toolbar.container;
    var viewerContainerChildrenCount = viewerToolbarContainer.children.length;
    for(var i = 0; i < viewerContainerChildrenCount; ++i) {
        viewerToolbarContainer.children[i].style.display = "none";
    }

    this.navigationControls = toolbar.getControl(ZhiUTech.Viewing.TOOLBAR.NAVTOOLSID);
    this.navigationControls.setVisible(true);// LJason 原生
    // this.navigationControls.setVisible(false);// LJason 修改
    this.navigationControls.container.style.display = '';

    this.measureControls = toolbar.getControl(ZhiUTech.Viewing.TOOLBAR.MEASURETOOLSID);
    this.measureControls.setVisible(true);
    this.measureControls.container.style.display = '';
    
    var modelTools = toolbar.getControl(av.TOOLBAR.MODELTOOLSID);
    var measureButtonId = this.measurementToolbarButton.getId();
    this.measurementToolbarButton.index = modelTools.indexOf(measureButtonId);
    modelTools.removeControl(measureButtonId);

    this.measureToolbar.toggleVisible();

    if (this.viewer.centerToolBar) {
        this.viewer.centerToolBar();
    }

    this.enableMeasureTool(true, DEFAULT_MEASUREMENT_TYPE);
};

/**
 * @private
 */
MeasureExtension.prototype.exitMeasurementMode = function() {
    if (!this._measurementMode) return;
    this.measureToolbar.closeToolbar();
    this._measurementMode = false;
};

/**
 * Create measure button in toolbar.
 * @private
*/
MeasureExtension.prototype.createUI = function()
{
    var self   = this;
    var viewer = this.viewer;

    var toolbar = viewer.getToolbar(true);

    // Add Measure button to toolbar
    var modelTools = toolbar.getControl(av.TOOLBAR.MODELTOOLSID);
    this.measurementToolbarButton = new avu.Button('toolbar-measurementSubmenuTool');
    this.measurementToolbarButton.setToolTip('Measure');
    this.measurementToolbarButton.setIcon("zu-icon-measure");
    modelTools.measurementToolbarButton = this.measurementToolbarButton;
    modelTools.addControl(this.measurementToolbarButton, {index:0});

    this.measureToolbar = new ZhiUTech.Viewing.Extensions.Measure.MeasureToolbar(this);
    this.measureToolbar.init();

    this.measurementToolbarButton.onClick = this.activate.bind(this);

    // Escape hotkey to exit tool.
    //
    var hotkeys = [{
        keycodes: [
            av.theHotkeyManager.KEYCODES.ESCAPE
        ],
        onRelease: function () {
            if (self._measurementMode) {
                self.exitMeasurementMode();
                return true;
            }
        }
    }];
    av.theHotkeyManager.pushHotkeys(this.escapeHotkeyId, hotkeys);

    // Finally
    this.uiCreated = true;
};


/**
 * @private
 */
MeasureExtension.prototype.checkAndFetchTopology = function(tool) {

    if (!this.uiCreated || !this.viewer.model.is3d()) {
        tool && tool.setNoTopology();
        return;
    }

    if (this.viewer.modelHasTopology()){
        tool && tool.setTopologyAvailable();
        return;
    }

    // Fetch topology from backend.
    tool && tool.setFetchingTopology();
    this.viewer.model.fetchTopology()
    .then(function(topoData){
        tool && tool.setTopologyAvailable();
    })
    .catch(function(err){
        zvp.logger.log(err); // No topology
        tool && tool.setNoTopology();
    });
};

/**
 * Destroy measure button in toolbar.
 * @private
*/
MeasureExtension.prototype.destroyUI = function()
{
    var viewer = this.viewer;    

    var toolbar = viewer && viewer.getToolbar && viewer.getToolbar(false);
    if (toolbar) {
        var modelTools = toolbar.getControl(av.TOOLBAR.MODELTOOLSID);
        if (modelTools) {
            var submenu = null;
            
            if (this.measurementToolbarButton) {
                submenu = modelTools.getControl("toolbar-inspectSubMenu");
                if (submenu) {
                    submenu.removeControl(this.measurementToolbarButton.getId());
                } else {
                    modelTools.removeControl(this.measurementToolbarButton.getId());
                }
            }

            this.measurementToolbarButton = null;
        }
    }

    av.theHotkeyManager.popHotkeys(this.escapeHotkeyId);
};

MeasureExtension.prototype.setUnits = function(units) {
    this.measureTool.setUnits(units);
};

MeasureExtension.prototype.getUnits = function() {
    return this.measureTool.getUnits();
};

MeasureExtension.prototype.setPrecision = function(precision) {
    this.measureTool.setPrecision(precision);
};

MeasureExtension.prototype.getPrecision = function() {
    return this.measureTool.getPrecision();
};

MeasureExtension.prototype.calibrate = function(requestedUnits, requestedSize) {
    this.calibrationTool.calibrate(requestedUnits, requestedSize);
};

MeasureExtension.prototype.calibrateByScale = function(requestedUnits, requestedScale) {
    this.calibrationTool.calibrateByScale(requestedUnits, requestedScale);
};

MeasureExtension.prototype.isCalibrationValid = function(requestedUnits, requestedSize) { 
    return this.calibrationTool.isCalibrationValid(requestedUnits, requestedSize); 
};

MeasureExtension.prototype.getCalibrationFactor = function() {
    return this.calibrationTool.getCalibrationFactor();
};

MeasureExtension.prototype.showAddCalibrationLabel = function() {
    this.calibrationTool.showAddCalibrationLabel();
};

MeasureExtension.prototype.deleteCurrentMeasurement = function() {
    this.measureTool.deleteCurrentMeasurement();
};

avem.MeasureExtension = MeasureExtension;
av.theExtensionManager.registerExtension('ZhiUTech.Measure', MeasureExtension);


})();

(function(){ 'use strict';

    var av = ZhiUTech.Viewing;
    var avem = ZhiUTech.Viewing.Extensions.Measure;
    var MeasureCommon = ZhiUTech.Viewing.MeasureCommon;

    // /** @constructor */
    function MeasurementsManager(viewer)
    {   
        this.viewer = viewer;
        this.init();
    }

    var proto = MeasurementsManager.prototype;

    proto.getCurrentMeasurement = function() {
        return this.currentMeasurement;
    };

    proto.selectMeasurementById = function(id) {
        var measurement = this.measurementsList[id];
        
        if (measurement) {
            this.changeCurrentMeasurement(measurement);
            return this.currentMeasurement;    
        }

        return false;
    };

    proto.createMeasurement = function(measurementType) {
        var id = this.measurementsCounter;
        var measurement = new MeasureCommon.Measurement(measurementType, id);
        this.measurementsList[id] = measurement;
        this.measurementsCounter++;
        this.changeCurrentMeasurement(measurement);
        return this.currentMeasurement;
    };

    proto.changeCurrentMeasurement = function(measurement) {
        this.currentMeasurement = measurement;
        this.viewer.dispatchEvent({ type: MeasureCommon.Events.MEASUREMENT_CHANGED_EVENT, data: measurement.measurementType });
    };

    proto.removeCurrentMeasurement = function() { 
        // Remove current measurement from the list
        if (Object.keys(this.measurementsList).length > 0) {
            delete this.measurementsList[this.currentMeasurement.id];
        }
    };

    proto.init = function() {
        this.reset();
    };

    proto.destroy = function() {
        this.reset();
    };

    proto.reset = function() {
        this.currentMeasurement = null;
        this.measurementsList = {};
        this.measurementsCounter = 0;
    };

    ZhiUTech.Viewing.Extensions.Measure.MeasurementsManager = MeasurementsManager;

})();

(function(){ 'use strict';

    var av = ZhiUTech.Viewing;
    var MeasureCommon = av.MeasureCommon;
    
    /**
     * Base class for an indicator.
     */

    ZhiUTech.Viewing.Extensions.Measure.Indicator = function(viewer, measurement, tool)
    {
        this.viewer = viewer;
        this.measurement = measurement;
        this.tool = tool;
        this.snapper = tool.getSnapper();
        this.materialExtensionLine = null;
        this.materialExtensionFace = null;
        this.extensionLines = [];
        this.extensionFaces = [];
        this.grayOutPlane = [];
        this.materialPoint = null;
        this.materialLine = null;
        this.materialAngle = null;
        this.materialAngleOutline = null;
        this.materialGreyOutPlane = null;
        this.materialFace = null;
        this.angleArc = null;
        this.angleOutline = [];
        this.showMeasureResult = false;
        this.visibleLabels = [];
        this.overlayName = 'measure-indicator-overlay-' + (measurement.id || '');
        this.xAxis = this.viewer.autocam.getWorldRightVector();
        this.yAxis = this.viewer.autocam.getWorldUpVector();
        this.zAxis = this.viewer.autocam.getWorldFrontVector();
    };



    var proto = ZhiUTech.Viewing.Extensions.Measure.Indicator.prototype;

    proto.init = function() {
        return false;
    };

    proto.updateDistance = function() {
        return false;
    };

    proto.updateAngle = function() {
        return false;
    };

    proto.clear = function() {
        return false;
    };

    proto.updateLabelsPosition = function() {
        return false;
    };

    // Renders the measurement and the labels.
    proto.render = function(picks, showMeasureResult) {

        this.showMeasureResult = showMeasureResult;

        this.clear();

        for (var i = 1; i <= Object.keys(picks).length; i++) {
            if (this.measurement.hasPick(i)) {
                this.renderPick(i);
            }
        }
            
        this.renderRubberband(picks);
        
        this.updateLabelsPosition();
    };

    proto.changeEndpointOnEditStyle = function(endpointNumber, isEditing) {
        return false;
    };

    proto.handleResize = function() {
        return false;
    };

    proto.setNoTopology = function() {
        return false;
    };

    proto.setFetchingTopology = function() {
        return false;
    };

    proto.setTopologyAvailable = function() {
        return false;
    };

    proto.clientToCanvasCoords = function(event) {
        var rect = this.viewer.impl.getCanvasBoundingClientRect();
        var res = {};
        if( event.hasOwnProperty("center") )
        {
            event.canvasX = res.x = event.center.x - rect.left;
            event.canvasY = res.y = event.center.y - rect.top;
        }
        else
        {
            event.canvasX = res.x = event.pointers[0].clientX - rect.left;
            event.canvasY = res.y = event.pointers[0].clientY - rect.top;
        }

        return res;
    };

    proto.initLabelMobileGestures = function(label, pointNumber) {
        var magnifyingGlass = this.viewer.toolController.getTool("magnifyingGlass");

        this.hammer = new Hammer.Manager(label, {
                recognizers: [
                    av.GestureRecognizers.drag,
                    av.GestureRecognizers.singletap
                ],
                inputClass: av.isIE11 ? Hammer.PointerEventInput : Hammer.TouchInput
            });

        this.onSingleTapBinded = function(event) { 
                                    var pos = this.clientToCanvasCoords(event);
                                    this.snapper.onMouseDown(pos);
                                    this.tool.editEndpoint(event, pointNumber, this.measurement.id); 
                                }.bind(this);

        this.onDragStartBinded = function(event) { 
                                    var pos = this.clientToCanvasCoords(event);
                                    this.snapper.onMouseDown(pos);
                                    this.tool.editEndpoint(event, pointNumber, this.measurement.id);
                                    this.tool.editByDrag = true;

                                    // Activate Magnifying Glass and tool by faking press event.
                                    event.type = "press";
                                    magnifyingGlass.handlePressHold(event);
                                    this.tool.handlePressHold(event);
                                    event.type = "dragstart";
                                    magnifyingGlass.handleGesture(event);
                                    this.tool.handleGesture(event);
                                }.bind(this);

        this.onDragMoveBinded = function(event){ 
                                    var pos = this.clientToCanvasCoords(event);
                                    this.snapper.onMouseDown(pos);

                                    magnifyingGlass.handleGesture(event);
                                    this.tool.handleGesture(event);
                                }.bind(this);

        this.onDragEndBinded = function(event){ 
                                    var pos = this.clientToCanvasCoords(event);
                                    this.snapper.onMouseDown(pos);
                                    
                                    // Deactivate Magnifying Glass and tool by faking pressup event.
                                    magnifyingGlass.handleGesture(event);
                                    this.tool.handleGesture(event);
                                    event.type = "pressup";
                                    magnifyingGlass.handlePressHold(event);
                                    this.tool.handlePressHold(event);

                                    this.tool.handleButtonUp(event);
                                }.bind(this);

        this.hammer.on("singletap", this.onSingleTapBinded);
        this.hammer.on("dragstart", this.onDragStartBinded);
        this.hammer.on("dragmove", this.onDragMoveBinded);
        this.hammer.on("dragend", this.onDragEndBinded);
    };

    proto.clearLabelMobileGestures = function() {
        if (this.hammer) {
            this.hammer.off("singletap", this.onSingleTapBinded);
            this.hammer.off("dragstart", this.onDragStartBinded);
            this.hammer.off("dragmove", this.onDragMoveBinded);
            this.hammer.off("dragend", this.onDragEndBinded);
            this.hammer = null;
        }
    };

    proto.updateVisibleLabelsArray = function(label, isVisible) {
        if (isVisible) {
            if (!(this.visibleLabels.indexOf(label) > -1)) {
                this.visibleLabels.push(label);        
            }
        } else {
            // remove from array
            var index = this.visibleLabels.indexOf(label);
            if (index > -1) {
                this.visibleLabels.splice(index, 1);
            }
        }
    };

    proto.hideEndpoints = function() {
        for (var name in this.endpoints) {
            if (this.endpoints.hasOwnProperty(name)) {
                var endpoint = this.endpoints[name];
                if (endpoint.label) {
                    this.hideLabel(endpoint.label);
                }
            }
        }
    };

    proto.showEndpoints = function() {
        for (var name in this.endpoints) {
            if (this.endpoints.hasOwnProperty(name)) {
                var endpoint = this.endpoints[name];
                if (this.measurement.hasPick(name) && endpoint.label) {
                    this.showLabel(endpoint.label);
                }
            }
        }
    };

    proto.hideLabel = function(label) {
        if (label) {
            MeasureCommon.safeToggle(label, 'visible', false);
            this.updateVisibleLabelsArray(label, false);      
        }
    };

    proto.showLabel = function(label) {
        if (label) {
            MeasureCommon.safeToggle(label, 'visible', true);
            this.updateVisibleLabelsArray(label, true);
        }
    };

    proto.changeEndpointOnEditStyle = function(endpointNumber, isEditing) {
        if (this.endpoints[endpointNumber] && this.endpoints[endpointNumber].label) {
            MeasureCommon.safeToggle(this.endpoints[endpointNumber].label, 'on-edit', isEditing);
        }
    };

    proto.changeEndpointEditableStyle = function(endpointNumber, isEditable) {
        if (this.endpoints[endpointNumber] && this.endpoints[endpointNumber].label) {
            MeasureCommon.safeToggle(this.endpoints[endpointNumber].label, 'editable', isEditable);
        }
    };

    proto.changeAllEndpointsEditableStyle = function(isEditable) {
        for (var name in this.endpoints) {
            if (this.endpoints.hasOwnProperty(name)) {
                this.changeEndpointEditableStyle(name, isEditable);    
            }
        }
    };

    proto.changeAllEndpointsOnEditStyle = function(isEditing) {
        for (var name in this.endpoints) {
            if (this.endpoints.hasOwnProperty(name)) {
                this.changeEndpointOnEditStyle(name, isEditing);
            }
        }
    };

    proto.hideLabelsOutsideOfView = function() {
        // For each label, check if it's inside the camera viewport.
        if (this.viewer.model && !this.viewer.model.is2d()) {
            this.visibleLabels.forEach(function(label) {
                var show = this.viewer.navigation.isPointVisible(label.point);

                if ((label.classList.contains('visible') && !show) || (!label.classList.contains('visible') && show)) {
                    label.classList.toggle('visible', show);    
                } 

            }.bind(this));
        }
    };

    proto.showClick = function(pickNumber) {
        if (this.tool.getActivePointIndex() !== pickNumber) {
            this.showLabel(this.endpoints[pickNumber].label);
        }
    };

    proto.hideClick = function(pickNumber) {

        if (this.endpoints[pickNumber]) {
            this.hideLabel(this.endpoints[pickNumber].label);    
        }
    };

    proto.renderPick = function(pickNumber) {
        if (!this.endpoints[pickNumber]) {
            this.createEndpoint(pickNumber);
        }

        this.renderEndpointGeometry(pickNumber);
        this.showClick(pickNumber);
    };

    proto.renderEndpointGeometry = function(pickNumber) {
        var geometry = MeasureCommon.getSnapResultPosition(this.measurement.getPick(pickNumber), this.viewer);
        this.endpoints[pickNumber].position = geometry.clone();
    };


    // This is a workaround to deal with the limitation on linewidth on Windows due to the ANGLE library
    proto.drawEdgeAsCylinder = function(geom, material, linewidth, type, cylinderGeometry) {

        // The array for all cylinders
        var edge = [];
        var cylinder;

        if (type == 1) { // LinePieces
            for (var i = 0; i < geom.vertices.length; i += 2) {
                cylinder = this.cylinderMesh(geom.vertices[i], geom.vertices[i + 1], material, linewidth, cylinderGeometry);
                this.setCylinderScale(cylinder, geom.vertices[i], geom.vertices[i + 1]);
                edge.push(cylinder);
            }
        }
        else { // LineStrip
            for (var i = 0; i < geom.vertices.length - 1; i++) {
                cylinder = this.cylinderMesh(geom.vertices[i], geom.vertices[i + 1], material, linewidth, cylinderGeometry);
                this.setCylinderScale(cylinder, geom.vertices[i], geom.vertices[i + 1]);
                edge.push(cylinder);
            }
        }


        return edge;
    };

    proto.drawDashedLine = function(p1, p2, dashSize, gapSize, material, width, overlayName) {

        var geometry = new THREE.Geometry();
        var line = new THREE.Vector3().subVectors(p2, p1);
        var lineLength = line.length() - gapSize;
        var lineDirection = line.normalize();
        
        var i = 0;
        var pos = p1.clone();
        var currLength = 0;

        while (currLength < lineLength) {
            var isPointVisible = this.viewer.navigation.isPointVisible(pos);
            
            if (isPointVisible) {
                geometry.vertices[i] = pos.clone();
                i++;
            }
            
            pos.addVectors(pos, lineDirection.clone().multiplyScalar(dashSize));
            
            if (isPointVisible) {
                geometry.vertices[i] = pos.clone();
                i++;
            }
            
            pos.addVectors(pos, lineDirection.clone().multiplyScalar(gapSize));

            currLength += dashSize + gapSize;
        }
        
        line = this.drawEdgeAsCylinder(geometry, material, width, 1, this.getNewCylinderGeometry());
        this.viewer.impl.addMultipleOverlays(overlayName, line);

        return line;
    };

    // This is a workaround to deal with the limitation on linewidth on Windows due to the ANGLE library
    proto.drawLineAsCylinder = function(geom, material, linewidth, overlayName) {

        var line;

        if (geom.vertices.length == 2) {
            line = this.cylinderMesh(geom.vertices[0], geom.vertices[1], material, linewidth, this.getNewCylinderGeometry());
            this.setCylinderScale(line, geom.vertices[0], geom.vertices[1]);
            this.viewer.impl.addOverlay(overlayName, line);
        }

        return line;
    };

    proto.getNewCylinderGeometry = function() {
        return new THREE.CylinderGeometry(0.1, 0.1, 1, 8, 1, true);
    };


    proto.cylinderMesh = function(pointX, pointY, material, linewidth, cylinderGeometry) {

        var direction = new THREE.Vector3().subVectors(pointY, pointX);
        var orientation = new THREE.Matrix4();
        orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
        orientation.multiply(new THREE.Matrix4().set(linewidth, 0, 0, 0,
            0, 0, linewidth, 0,
            0, -direction.length(), 0, 0,
            0, 0, 0, 1));

        var edge = new THREE.Mesh(cylinderGeometry, material);
        edge.applyMatrix(orientation);
        edge.lmv_line_width = linewidth;
        edge.position.x = (pointY.x + pointX.x) / 2;
        edge.position.y = (pointY.y + pointX.y) / 2;
        edge.position.z = (pointY.z + pointX.z) / 2;

        return edge;
    };

    // Set scale for cylinder
    proto.setCylinderScale = function(cylinderMesh, p1, p2) {
        var scale;

        if (p1 && p2) {
            var point = MeasureCommon.nearestPointInPointToSegment(this.viewer.navigation.getPosition(), p1, p2);
            scale = this.setScale(point);    
        } else {
            scale = this.setScale(cylinderMesh.position);
        }

        if (cylinderMesh.hasOwnProperty("lmv_line_width"))
            scale *= cylinderMesh.lmv_line_width;
        cylinderMesh.scale.x = scale;
        cylinderMesh.scale.z = scale;
    };


    // Set scale for vertex and extension dashed line
    proto.setScale = function(point) {

        var pixelSize = 5;

        var navapi = this.viewer.navigation;
        var camera = navapi.getCamera();
        var position = navapi.getPosition();

        var p = point.clone();

        var distance = camera.isPerspective ? p.sub(position).length()
            : navapi.getEyeVector().length();

        var fov = navapi.getVerticalFov();
        var worldHeight = 2.0 * distance * Math.tan(THREE.Math.degToRad(fov * 0.5));

        var viewport = navapi.getScreenViewport();
        var scale = pixelSize * worldHeight / viewport.height;

        return scale;
    };

    proto.alignLabelWithLine = function(label, p1, p2, offset, viewer){
        var camUpVector = viewer.navigation.getCameraUpVector();
        var worldUpVec = new THREE.Vector3(0,1,0);
        var cameraAngle = worldUpVec.angleTo(camUpVector) * 180 / Math.PI;

        cameraAngle = camUpVector.x >= 0 ? cameraAngle : -cameraAngle;
        
        var angle = null;

        var deltaX = p1.x - p2.x;
        var deltaY = p1.y - p2.y;

        if (p1.x < p2.x) {
            angle =  Math.atan2(-deltaY , -deltaX) * 180 / Math.PI;    
        } 
        else {
            angle =  Math.atan2(deltaY , deltaX) * 180 / Math.PI;    
        }

        angle = -(angle + cameraAngle);

        if (Math.abs(angle) > 90){
            angle = angle + 180;
        }

        label.style.transform = 'rotate('+ angle +'deg) translate(0px, ' + offset + 'px)';
    };

    proto.destroy = function() {
        this.materialPoint = null;
        this.materialFace = null;
        this.materialLine = null;
        this.materialAngle = null;

        if (av.isMobileDevice()) {
            this.clearLabelMobileGestures();    
        }

        for (var name in this.endpoints) {
            if (this.endpoints.hasOwnProperty(name)) {
                var endPoint = this.endpoints[name];

                if (endPoint.label) {
                    endPoint.label.removeEventListener('mousewheel', this.viewer.toolController.mousewheel);
                    endPoint.label.parentNode.removeChild(endPoint.label);
                    endPoint.label = null;
                }
            }
        }

        this.visibleLabels = [];
    };

    proto.renderRubberband = function(picks) {

        switch (this.measurement.measurementType) {
            case MeasureCommon.MeasurementTypes.MEASUREMENT_DISTANCE:
                var previewsPick = picks[1];
                var activePick = picks[2];
                var start = MeasureCommon.getSnapResultPosition(previewsPick, this.viewer);
                var end = MeasureCommon.getSnapResultPosition(activePick, this.viewer);
                
                if (start && end) {
                    this.renderDistanceMeasurement(start, end);
                }
                break;

            case MeasureCommon.MeasurementTypes.MEASUREMENT_ANGLE:
                this.renderAngleMeasurement(picks);
                break;

            case MeasureCommon.MeasurementTypes.MEASUREMENT_AREA:
                this.renderAreaMeasurement(picks);
                break;
        }
    };

})();

(function(){ 'use strict';

    var av = ZhiUTech.Viewing;
    var avem = ZhiUTech.Viewing.Extensions.Measure;
    var MeasureCommon = ZhiUTech.Viewing.MeasureCommon;


    // /** @constructor */
    function MeasureToolIndicator( viewer, measurement, measureTool )
    {
        avem.Indicator.call(this, viewer, measurement, measureTool);
        this.measureTool = measureTool;
        this.endpoints = [];
        this.lines = { 
            xyz: {axis: false, material: createLineMaterial('FFFF00'), className: 'zu-icon-axis-delta' + '-xyz measure-label-axis-delta' + ' measure-label-axis-xyz'},
            x:   {axis: true,  material: createLineMaterial('DC143C'), className: 'zu-icon-axis-delta' + '-x measure-label-axis-delta' + ' measure-label-axis-x', iconText: 'X='},
            y:   {axis: true,  material: createLineMaterial('00FF7F'), className: 'zu-icon-axis-delta' + '-y measure-label-axis-delta' + ' measure-label-axis-y', iconText: 'Y='},
            z:   {axis: true,  material: createLineMaterial('00FFFF'), className: 'zu-icon-axis-delta' + '-z measure-label-axis-delta' + ' measure-label-axis-z', iconText: 'Z='}
        };
        this.segments = [];
        this.dashedLine = {};
        this.simple = false;
        this.angleLabel = {};
        this.areaLabel = {};
        this.labels = [];
        this.isLeaflet = false;
        this.topologyStatus = TOPOLOGY_NOT_AVAILABLE;
        this.tmpVector = new THREE.Vector3();
        this.surfaceColor = new THREE.MeshBasicMaterial({
            color: parseInt('005BCE', 16),
            opacity: 0.15,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            side: THREE.DoubleSide
        });   
    }

    MeasureToolIndicator.prototype = Object.create(avem.Indicator.prototype);
    MeasureToolIndicator.prototype.constructor = MeasureToolIndicator;
    var proto = MeasureToolIndicator.prototype;

    function createLineMaterial(color) {
        return new THREE.MeshBasicMaterial({
            color: parseInt(color, 16),
            depthTest: false,
            depthWrite: false,
            side: THREE.DoubleSide
        });   
    }

    var _labelsSpace = 4;
    var _angleLabelOffset = 5;
    var TOPOLOGY_NOT_AVAILABLE = 0;
    var TOPOLOGY_FETCHING = 1; 
    var TOPOLOGY_AVAILABLE = 2;
    var _selectorAreaSize = 15;

    var _tipHeight = 1;
    var _tipWidth = 2;
    var _segmentWidth = 2;
    var _dashedSegmentWidth = 3;
    var _axisLineWidth = 3;
    var _dashSize = 2;
    var _gapSize = 1;

    var _angleArcWidth = 2;

    function isVisible(label) {
        return label.classList.contains('visible');
    }

    proto.init = function() {
        this.isLeaflet = this.viewer.model.getData().isLeaflet;
        // Create HTML Labels
        var currLabel;

        this.onSelectionAreaClickedBinded = this.onSelectionAreaClicked.bind(this);

        // Line
        if (!this.lines.xyz.label) {
            currLabel = this.lines.xyz.label = this.createMeasurementLabel(); // Measurement result
            currLabel.addEventListener('mousewheel', this.viewer.toolController.mousewheel);
            currLabel.addEventListener('click', this.onSelectionAreaClickedBinded);
            this.viewer.container.appendChild(currLabel);
        }
        switch (this.topologyStatus) {
            case TOPOLOGY_FETCHING:
                this.setFetchingTopology();
                break;
            case TOPOLOGY_AVAILABLE:
                this.setTopologyAvailable();
                break;
            case TOPOLOGY_NOT_AVAILABLE:
                this.setNoTopology();
                break;
        }

        this.showMeasureResult = false;

        this.onCameraChangeBinded = this.onCameraChange.bind(this);
        this.viewer.addEventListener(av.CAMERA_CHANGE_EVENT, this.onCameraChangeBinded);

        this.handleButtonUpBinded = this.measureTool.handleButtonUp.bind(this.measureTool);
        window.addEventListener('mouseup', this.handleButtonUpBinded);
    };

    proto.createEndpoint = function(index) {
        this.endpoints[index] = {};
        var currLabel = this.endpoints[index].label = this.createSnapResultLabel(index);
        this.viewer.container.appendChild(currLabel);    
    };

    proto.updateLabelsPosition = function() {

        var point,
            xy,
            label,
            key;


        for (key in this.endpoints) {
            if (this.endpoints.hasOwnProperty(key)) {
                    label = this.endpoints[key].label;
                    point = this.endpoints[key].position;

                if (label && point && isVisible(label)) {
                    xy = MeasureCommon.project(point, this.viewer);

                    xy.x = xy.x - label.getBoundingClientRect().width / 2;
                    xy.y = xy.y - label.getBoundingClientRect().height / 2;
                    
                    label.style.top  = xy.y + 'px';
                    label.style.left = xy.x + 'px';
                    label.point = point;
                    this.labels.push(label);
                }
            }
        }

        for (var name in this.lines) {
            if (this.lines.hasOwnProperty(name)) {
                var item = this.lines[name];
                    label = item.label;

                if (label && item.p1 && item.p2 && isVisible(label)) {
                    
                    item.line.visible = item.visible;

                    point = { x: (item.p1.x + item.p2.x)/2, y: (item.p1.y + item.p2.y)/2, z: (item.p1.z + item.p2.z)/2 };
                    
                    xy = MeasureCommon.project(point, this.viewer);
                    label.style.top  = xy.y - Math.floor(label.clientHeight / 2) + 'px';
                    label.style.left = xy.x - Math.floor(label.clientWidth / 2) + 'px';

                    if (this.viewer.model && this.viewer.model.is2d()) {
                        var offset = item === this.lines.xyz ? 0 : label.clientHeight;

                        var p1Projected = MeasureCommon.project(item.p1, this.viewer);
                        var p2Projected = MeasureCommon.project(item.p2, this.viewer);

                        if (label.clientWidth >= p1Projected.distanceTo(p2Projected) - this.endpoints[1].label.clientWidth) {
                            if (item === this.lines.xyz) {
                                offset = label.clientHeight;
                            } else {
                                // Hide all axis labels and quit the loop
                            
                                this.lines.x.line.visible = false;
                                this.lines.y.line.visible = false;

                                this.viewer.impl.invalidate(false, false, /*overlayDirty=*/true);

                                for (name in this.lines) {
                                    if (this.lines.hasOwnProperty(name)) {
                                        if (this.lines[name] !== this.lines.xyz) {
                                            var currLabel = this.lines[name].label;
                                            if (currLabel) {
                                                currLabel.style.opacity = 0;
                                            }
                                        }
                                    }
                                }

                                break;
                                
                            }
                        }

                        if (item !== this.lines.xyz) {
                            var xyzDirection = new THREE.Vector3();
                            var itemDirection = new THREE.Vector3();
                            xyzDirection.subVectors(this.lines.xyz.p1, this.lines.xyz.p2).normalize();
                            itemDirection.subVectors(item.p1, item.p2).normalize();
                            var normal = xyzDirection.cross(this.viewer.navigation.getEyeVector()).normalize();
                            var angle = normal.dot(itemDirection);
                            
                            if (angle < 0) {
                                offset = -offset;
                            }
                        }

                        this.alignLabelWithLine(label, item.p1, item.p2, offset, this.viewer);
                    }

                    label.style.opacity = 1;
                    label.point = point;
                    this.labels.push(label);
                }
            }
        }

        if (this.angleLabel) {

            label = this.angleLabel.label;

            if (label && this.angleLabel.p1 && this.angleLabel.p2 && isVisible(label)) {
                point = { x: (this.angleLabel.p1.x + this.angleLabel.p2.x)/2, y: (this.angleLabel.p1.y + this.angleLabel.p2.y)/2, z: (this.angleLabel.p1.z + this.angleLabel.p2.z)/2 };
                xy = MeasureCommon.project(point, this.viewer, _angleLabelOffset);
                label.style.top = xy.y - Math.floor(label.clientHeight / 2) + 'px';
                label.style.left = xy.x - Math.floor(label.clientWidth / 2) + 'px';
                label.point = point;
                this.labels.push(label);
            }
        }

        if (this.areaLabel) {

            label = this.areaLabel.label;

            if (label && this.areaLabel.p1 && this.areaLabel.p2 && isVisible(label)) {
                point = { x: (this.areaLabel.p1.x + this.areaLabel.p2.x)/2, y: (this.areaLabel.p1.y + this.areaLabel.p2.y)/2, z: (this.areaLabel.p1.z + this.areaLabel.p2.z)/2 };
                xy = MeasureCommon.project(point, this.viewer);
                label.style.top  = xy.y - Math.floor(label.clientHeight / 2) + 'px';
                label.style.left = xy.x - Math.floor(label.clientWidth / 2) + 'px';
                label.point = point;
                this.labels.push(label);
            }
        }

        if (this.viewer.model && !this.viewer.model.is2d()) {
    
            var needToStackLabels = false;
            this.labelsStacked = false;
            var currentLabel, i;

            // Backup lable's positions in case of the need of stacking them later
            var backupPositions = [];
            for (i = 0; i < this.labels.length; i++) {
                backupPositions.push({left: this.labels[i].style.left, top:this.labels[i].style.top});
            }

            // Detect and move in case of overlapping.
            for (i = 0; i < this.labels.length && !needToStackLabels; i++) {
                currentLabel = this.labels[i];
                needToStackLabels = this.labelsOverlapDetection(currentLabel, this.labels);
            }

            // If we found out that the labels need to be stacked, restore their positions from the backup first, and then start again.
            if (needToStackLabels) {

                for (i = 0; i < this.labels.length; i++) {
                    this.labels[i].style.left = backupPositions[i].left;
                    this.labels[i].style.top = backupPositions[i].top;
                }

                this.stackLabels(this.labels);

                for (i = 0; i < this.labels.length; i++) {
                    currentLabel = this.labels[i];
                    this.labelsOverlapDetection(currentLabel, this.labels);
                }
            } 
        }

        this.labels = [];
        
    };

    function isLeftIntersect(current, other) {
        return current.right >= other.left && current.right <= other.right;
    }

    function isRightIntersect(current, other) {
        return current.left >= other.left && current.left <= other.right;
    }

    function isMiddleIntersect(current, other) {
        return current.left <= other.left && current.right >= other.right;
    }

    function isVerticalIntersect(current, other) {
        return current.top < other.bottom && current.bottom > other.top;
    }

    function moveLeft(currentLabel, currentRect, otherRect) {
        currentLabel.style.left = parseInt(currentLabel.style.left, 10) - (currentRect.right - otherRect.left) + 'px';
    }

    function moveRight(currentLabel, currentRect, otherRect) {
        currentLabel.style.left = parseInt(currentLabel.style.left, 10) + (otherRect.right - currentRect.left) + 'px';
    }

    function moveDown(currentLabel, currentRect, otherRect) {
        currentLabel.style.top = parseInt(currentLabel.style.top, 10) + (otherRect.bottom - currentRect.top) + 'px';
    }


    proto.labelsOverlapDetection = function(staticLabel, labelsList) {

        var needToStackLabels = false;

        for (var i = 0; i < labelsList.length ; i++) {

            var dynamicLabel = labelsList[i];
            var moved = false;

            if (staticLabel !== dynamicLabel) {
                var staticRect = staticLabel.getBoundingClientRect();
                var dynamicRect = dynamicLabel.getBoundingClientRect();

                if (isVerticalIntersect(dynamicRect, staticRect)) {

                    if (isLeftIntersect(dynamicRect, staticRect)) {
                        moveLeft(dynamicLabel, dynamicRect, staticRect);
                        moved = true;
                    }
                    else if (isRightIntersect(dynamicRect, staticRect)) {
                        moveRight(dynamicLabel, dynamicRect, staticRect);
                        moved = true;
                    }
                    else if (isMiddleIntersect(dynamicRect, staticRect)) {
                        moveDown(dynamicLabel, dynamicRect, staticRect);
                        moved = true;
                    }

                    if (moved) {
                        var newList = labelsList.slice(0);
                        newList.splice(newList.indexOf(staticLabel), 1);
                        this.labelsOverlapDetection(dynamicLabel, newList);    
                        
                        if (dynamicLabel.causeStacking && staticLabel.causeStacking) {
                            needToStackLabels = true;
                        }

                        // We don't want that after the labels have been stacked, only one of them will move alone.
                        if (dynamicLabel.causeStacking && this.labelsStacked) {
                            this.stackLabels(this.labels);
                        }
                    }
                }
            }
        }

        return needToStackLabels;
    };

    proto.stackLabels = function(labels) { 
        var topLabel = this.lines.xyz.label;

        for (var i = 1; i < labels.length; i++) {
            if (labels[i].causeStacking) {
                labels[i].style.left = topLabel.style.left;
            
                var rect = labels[i-1].getBoundingClientRect();
                var space = (labels[i-1] == topLabel) ? _labelsSpace : 0;
                var top = (labels[i] === topLabel) ? topLabel.style.top : labels[i-1].style.top;
                labels[i].style.top = parseInt(top, 10) + rect.height + space + 'px';
            }
            labels[i].style.transform = '';
        }

        this.labelsStacked = true;
    };

    proto.drawXYZLine = function(item) {
        var self = this;

        var p1 = item.p1;
        var p2 = item.p2;

        if (!p1 || !p2)
            return;

        var tmpVec = new THREE.Vector3();
        var geometry = item.geometry = new THREE.Geometry();
        var direction = new THREE.Vector3().subVectors(p2, p1).normalize();
        var normal = direction.clone().cross(self.viewer.navigation.getEyeVector()).normalize();
        var point = MeasureCommon.nearestPointInPointToSegment(self.viewer.navigation.getPosition(), p1, p2);
        var scale = self.setScale(point);

        item.line = this.drawLineSegment(p1, p2, _segmentWidth, item.material);
        item.visible = true;

        this.segments.push(item);
        
        function drawTip(p) {
            geometry.vertices = [];

            // Edge
            tmpVec.addVectors(p, normal.clone().multiplyScalar(_tipHeight * scale));
            geometry.vertices[0] = tmpVec.clone();
            tmpVec.subVectors(p, normal.clone().multiplyScalar(_tipHeight * scale));
            geometry.vertices[1] = tmpVec.clone();
            var line = self.drawLineAsCylinder(geometry, item.material, _tipWidth, self.overlayName);
            self.setCylinderScale(line, p1 ,p2);
            line.visible = true;
            item.tips.push(line);
        }

        if (self.showMeasureResult) {
            item.tips = [];

            drawTip(p1);
            drawTip(p2);    
        }        
    };

    proto.redrawDashedLine = function() {
        if (!this.dashedLine.p1 || !this.dashedLine.p2)
            return;

        this.viewer.impl.removeMultipleOverlays(this.overlayName, this.dashedLine.line);
        
        var p1Scale = this.setScale(this.dashedLine.p2);
        var dashSize = _dashSize * p1Scale;
        var gapSize = _gapSize * p1Scale;
        this.dashedLine.line = this.drawDashedLine(this.dashedLine.p2, this.dashedLine.p1, dashSize, gapSize, this.lines.xyz.material, _dashedSegmentWidth, this.overlayName);

        return this.dashedLine.line;
    }; 

    proto.drawLineSegment = function(p1, p2, width, material, isDashedLine) {
        var line;

        if (isDashedLine) {
            this.dashedLine.p1 = p1;
            this.dashedLine.p2 = p2;
            line = this.redrawDashedLine();
        } else {
            var geometry = new THREE.Geometry();
            geometry.vertices.push(p1);
            geometry.vertices.push(p2);
            line = this.drawLineAsCylinder(geometry, material, width, this.overlayName);
            this.setCylinderScale(line, p1, p2);
        }

        line.visible = true;

        return line;
    };

    proto.drawSurface = function(points) {

        var shape = new THREE.Shape();

        shape.moveTo( points[0].x, points[0].y );

        for (var i = 1; i < points.length; i++) {
            shape.lineTo( points[i].x, points[i].y);    
        }

        // Close shape.
        shape.lineTo( points[0].x, points[0].y);    

        var geometry = new THREE.ShapeGeometry( shape );
        var face = new THREE.Mesh(geometry, this.surfaceColor);

        this.viewer.impl.addOverlay(this.overlayName, face);
    };

    proto.drawSegmentAndPush = function(p1, p2, isDashedLine) {
        if (!p1 || !p2) {
            return;
        }

         var line = this.drawLineSegment(p1, p2, _segmentWidth, this.lines.xyz.material, isDashedLine);
            
        if (!isDashedLine) {
            var item = { line: line, p1: p1, p2: p2 };
            this.segments.push(item);    
        }
    };

    proto.renderAreaMeasurement = function(picks) {

        var count = this.measurement.countPicks();
        var p1, p2;

        var points = [];
        
        for (var i = 1; i < count; i++) {
            p1 = MeasureCommon.getSnapResultPosition(picks[i], this.viewer);
            p2 = MeasureCommon.getSnapResultPosition(picks[i + 1], this.viewer);

            this.drawSegmentAndPush(p1, p2);
            points.push(p1);
        }

        if (count > 2) {
            // Draw last line
            p1 = MeasureCommon.getSnapResultPosition(picks[1], this.viewer);
            this.drawSegmentAndPush(p1, p2, !this.measurement.closedArea);
            
            if(!MeasureCommon.isEqualVectors(p1,p2,MeasureCommon.EPSILON)){
                points.push(p2);
            }
            
            if (MeasureCommon.isPolygonSimple(points) && this.measurement.area !== 0) {
                this.drawSurface(points);    
                this.showAreaLabel(MeasureCommon.getPolygonVisualCenter(points));
                this.updateArea();
            }
        }        
    };

    proto.clearAngleMeshes = function() {
        if (this.angleArc) {
            this.viewer.impl.removeOverlay(this.overlayName, this.angleArc);
            this.angleArc = null;
        }
        if (this.angleOutline.length > 0) {
            this.viewer.impl.removeMultipleOverlays(this.overlayName, this.angleOutline);
            this.angleOutline.length = 0;
        }
    };

    proto.drawAngle = function(p, ep1, ep2, n, angle, midPoint) {

        var smallNum = 0.001;

        if (!this.materialAngle) {

            this.materialAngle = new THREE.MeshPhongMaterial({
                    color: 0x999999,
                    ambient: 0x999999,
                    opacity: 0.5,
                    transparent: true,
                    depthTest: false,
                    depthWrite: false,
                    side: THREE.DoubleSide
                }
            );

            this.materialAngleOutline = new THREE.MeshBasicMaterial({
                color: 0xFF9900,
                depthTest: false,
                depthWrite: false
            });

        }

        MeasureCommon.createCommonOverlay(this.viewer, this.overlayName);
        this.clearAngleMeshes();

        // draw arc of angle
        var radius = Math.min(p.distanceTo(ep1), p.distanceTo(ep2)) / 4;
        var segments = 100;
        //angle = angle * Math.PI / 180;

        var circleGeometry = new THREE.CircleGeometry(radius, segments, 0, angle * Math.PI / 180);
        var arc = new THREE.Mesh(circleGeometry, this.surfaceColor);

        var center = arc.geometry.vertices[0].clone();
        arc.geometry.vertices.push(center);


        // Translate and rotate the arc to the plane where it should lie in
        arc.position.set(p.x, p.y, p.z);
        var V = arc.position.clone();
        V.add(n);
        arc.lookAt(V);
        arc.updateMatrixWorld();


        // Rotate the arc in the plane to the right place
        var vA = arc.geometry.vertices[1].clone();
        var vB = arc.geometry.vertices[arc.geometry.vertices.length - 2].clone();
        vA.applyMatrix4(arc.matrixWorld);
        vB.applyMatrix4(arc.matrixWorld);

        var v1 = new THREE.Vector3();
        var v2 = new THREE.Vector3();
        var v3 = new THREE.Vector3();
        var v4 = new THREE.Vector3();
        v1.subVectors(vA, p);
        v2.subVectors(vB, p);
        v3.subVectors(ep1, p);
        v4.subVectors(ep2, p);

        var a13 = v1.angleTo(v3);
        var a14 = v1.angleTo(v4);
        var a23 = v2.angleTo(v3);
        var a24 = v2.angleTo(v4);

        //console.log(a13 * 180 / Math.PI + " " + a14 * 180 / Math.PI + " " + a23 * 180 / Math.PI + " " + a24 * 180 / Math.PI);

        var ra;
        // The arc is in the right place
        if (((a13 <= smallNum && a13 >= -smallNum) || (a14 <= smallNum && a14 >= -smallNum))
            && ((a23 <= smallNum && a23 >= -smallNum) || (a24 <= smallNum && a24 >= -smallNum))) {

            ra =0;
        }
        // The arc needs to be rotated 180 degree to the right place
        else if (((a13 <= Math.PI + smallNum && a13 >= Math.PI - smallNum) || (a14 <= Math.PI + smallNum && a14 >= Math.PI - smallNum))
            && ((a23 <= Math.PI + smallNum && a23 >= Math.PI - smallNum) || (a24 <= Math.PI + smallNum && a24 >= Math.PI - smallNum))) {

            ra = Math.PI;
        }
        // The arc needs to be rotated a13 radian
        else if ((a13 <= a23 + smallNum && a13 >= a23 - smallNum) || (a13 <= a24 + smallNum && a13 >= a24 - smallNum)) {

            ra = a13;
        }
        // The arc needs to be rotated a14 radian
        else {

            ra = a14;
        }

        var rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(n, ra);
        //arc.matrix.multiply(rotWorldMatrix);
        rotWorldMatrix.multiply(arc.matrix);
        arc.matrix = rotWorldMatrix;
        arc.rotation.setFromRotationMatrix(arc.matrix);

        // Check if rotate to the wrong direction, if so, rotate back twice of the degree
        arc.updateMatrixWorld();
        vA = arc.geometry.vertices[1].clone();
        vB = arc.geometry.vertices[arc.geometry.vertices.length - 2].clone();
        vA.applyMatrix4(arc.matrixWorld);
        vB.applyMatrix4(arc.matrixWorld);

        v1.subVectors(vA, p);
        v2.subVectors(vB, p);

        a13 = v1.angleTo(v3);
        a14 = v1.angleTo(v4);
        a23 = v2.angleTo(v3);
        a24 = v2.angleTo(v4);

        //console.log(a13 * 180 / Math.PI + " " + a14 * 180 / Math.PI + " " + a23 * 180 / Math.PI + " " + a24 * 180 / Math.PI);

        if (a13 >= smallNum && a14 >= smallNum) {

            rotWorldMatrix = new THREE.Matrix4();
            rotWorldMatrix.makeRotationAxis(n, - ra * 2);
            //arc.matrix.multiply(rotWorldMatrix);
            rotWorldMatrix.multiply(arc.matrix);
            arc.matrix = rotWorldMatrix;
            arc.rotation.setFromRotationMatrix(arc.matrix);
        }

        // draw outline of the arc
        var outlineGeometry = new THREE.CircleGeometry(radius, segments, 0, angle * Math.PI / 180);
        outlineGeometry.vertices.splice(0, 1);
        arc.updateMatrixWorld();
        outlineGeometry.applyMatrix(arc.matrixWorld);
        this.angleOutline = this.drawEdgeAsCylinder(outlineGeometry, this.lines.xyz.material, _angleArcWidth, 0, this.getNewCylinderGeometry());

        this.angleArc = arc;
        this.viewer.impl.addOverlay(this.overlayName, this.angleArc);
        this.viewer.impl.addMultipleOverlays(this.overlayName, this.angleOutline);

        // This is used for angle label's position
        midPoint.copy(arc.geometry.vertices[Math.round(arc.geometry.vertices.length / 2) - 1]);
        midPoint.applyMatrix4(arc.matrixWorld);
        var dir = new THREE.Vector3();
        dir.subVectors(midPoint, p).normalize();
        dir.multiplyScalar(radius / 2);
        midPoint.add(dir);
    };

    proto.renderAngleMeasurement = function(picks) {

        var count = this.measurement.countPicks();
        var p1, p2;

        var points = [];
        
        for (var i = 1; i < count; i++) {
            p1 = MeasureCommon.getSnapResultPosition(picks[i], this.viewer);
            p2 = MeasureCommon.getSnapResultPosition(picks[i + 1], this.viewer);

            this.drawSegmentAndPush(p1, p2);

            if (p1) {
                points.push(p1);    
            }
        }

        if (p2) {
            points.push(p2);
        }
        
        if (points.length === 3 && this.measurement.angle) {
            var n = new THREE.Vector3();
            var v1 = new THREE.Vector3();
            var v2 = new THREE.Vector3();
            v1.subVectors(points[0], points[1]);
            v2.subVectors(points[1], points[2]);
            n.crossVectors(v1, v2);
            n.normalize();

            var midPoint = new THREE.Vector3();
            this.drawAngle(points[1], points[0], points[2], n, this.measurement.angle, midPoint);
            this.showAngleLabel(midPoint);
            this.updateAngle();
        }        
    };

    proto.createDistanceLabel = function(item) {
        var label = item.label = this.createMeasurementLabel();
        
        setVisibilityMeasurementLabelText(label, item === this.lines.xyz);

        // Override main label when displaying only an axis label (X, Y or Z)
        if (item.axis) {
            label.className = item.className;
            var axisIcon = document.createElement('div');
            axisIcon.className = 'measure-label-axis-icon ' + item.iconText;
            axisIcon.innerText = item.iconText;
            label.insertBefore(axisIcon, label.firstChild);

            if (!av.isMobileDevice()) {
                MeasureCommon.safeToggle(label, 'enableTransition', true);
            }
        }

        this.viewer.container.appendChild(label);

        return label;
    };

    // Draw distance measurement
    proto.renderDistanceMeasurement = function(p1, p2)
    {
        var self = this;

        function updateLine(item, x1, y1, z1, x2, y2, z2, showAxis) {
            var line = item.line,
                label = item.label,
                p1 = new THREE.Vector3(x1, y1, z1),
                p2 = new THREE.Vector3(x2, y2, z2);

            // Swap points if needed to have consistent axis directions.
            var tmpVec;
            if (item === self.lines.x && p2.x > p1.x) {
                tmpVec = p1.clone();
                p1 = p2.clone();
                p2 = tmpVec.clone();
            } 
            else if (item === self.lines.y && p2.y > p1.y) {
                tmpVec = p1.clone();
                p1 = p2.clone();
                p2 = tmpVec.clone();
            } 
            else if (item === self.lines.z && p2.z > p1.z) {
                tmpVec = p1.clone();
                p1 = p2.clone();
                p2 = tmpVec.clone();
            }

            item.line = null;            

            if (!label) {
                label = self.createDistanceLabel(item);
            }
            else {
                self.hideLabel(label);
            }
            
            if (((self.isLeaflet && item !== self.lines.z) || (p1.distanceTo(p2) >= MeasureCommon.EPSILON)) && showAxis) {

                item.p1 = p1;
                item.p2 = p2;

                if (item === self.lines.xyz) {
                    self.drawXYZLine(item);
                    self.showLabel(label);
                    self.updateDistance();
                }
                else {
                    line = item.line = self.drawLineSegment(p1, p2, _axisLineWidth, item.material);
                    var show = !self.simple && self.showMeasureResult;

                    line.visible = show;
                    item.visible = show;

                    if (show) {
                        self.showLabel(label);
                    }
                    else {
                        self.hideLabel(label);
                    }
                }
            }
        }

        // If the line aligns with one of axis, then don't show axis
        function displayAxis(p1, p2) {
            self.tmpVector.subVectors(p1, p2);
            self.tmpVector.normalize();

            return !MeasureCommon.isParallel(self.tmpVector, self.xAxis) && !MeasureCommon.isParallel(self.tmpVector, self.yAxis) && !MeasureCommon.isParallel(self.tmpVector, self.zAxis);
        }

        updateLine(this.lines.xyz, p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, true);

        var up = this.viewer.navigation.getAlignedUpVector(),
            x = Math.abs(up.x),
            y = Math.abs(up.y),
            z = Math.abs(up.z);

        var showAxis = displayAxis(p1, p2);

        if (z > x && z > y) { // z up
            updateLine(this.lines.x, p1.x, p1.y, p1.z, p2.x, p1.y, p1.z, showAxis);
            updateLine(this.lines.y, p2.x, p1.y, p1.z, p2.x, p2.y, p1.z, showAxis);
            updateLine(this.lines.z, p2.x, p2.y, p1.z, p2.x, p2.y, p2.z, showAxis);

        } else if (y > x && y > z) { // y up
            updateLine(this.lines.x, p1.x, p1.y, p1.z, p2.x, p1.y, p1.z, showAxis);
            updateLine(this.lines.z, p2.x, p1.y, p1.z, p2.x, p1.y, p2.z, showAxis);
            updateLine(this.lines.y, p2.x, p1.y, p2.z, p2.x, p2.y, p2.z, showAxis);

        } else { // x up - do we ever see this?
            updateLine(this.lines.y, p1.x, p1.y, p1.z, p1.x, p2.y, p1.z, showAxis);
            updateLine(this.lines.z, p1.x, p2.y, p1.z, p1.x, p2.y, p2.z, showAxis);
            updateLine(this.lines.x, p1.x, p2.y, p2.z, p2.x, p2.y, p2.z, showAxis);
        }

    };

    proto.updateResults = function() {
        this.updateDistance();
        this.updateAngle();
        this.updateArea();
        
        setTimeout(function(){
            this.updateLabelsPosition();
        }.bind(this), 0);
    };

    // Update distance measurement label
    proto.updateDistance = function() {

        function setWidth(label, value) {
            if (!label) return;
            label.style.width = value;
        }

        function getWidth(label) {
            return label ? label.clientWidth : 0;
        }

        Object.keys(this.lines).forEach(function(name) {
            setWidth(this.lines[name].label, '');
        }.bind(this));
        
        setDeltaMeasurementLabelText(this.lines.x.label, this.measureTool.getDistanceX(this.measurement));
        setDeltaMeasurementLabelText(this.lines.y.label, this.measureTool.getDistanceY(this.measurement));
        setDeltaMeasurementLabelText(this.lines.z.label, this.measureTool.getDistanceZ(this.measurement));
        setValueMeasurementLabelText(this.lines.xyz.label, this.measureTool.getDistanceXYZ(this.measurement));

        if (this.viewer.model && this.viewer.model.is3d()) {
            setTimeout(function(){
                var maxWidth = Math.max(getWidth(this.lines.x.label), getWidth(this.lines.y.label), getWidth(this.lines.z.label), getWidth(this.lines.xyz.label));                
                Object.keys(this.lines).forEach(function(name) {
                    setWidth(this.lines[name].label, maxWidth + 'px');
                }.bind(this));
            }.bind(this), 0);
        }
    };

    // Update angle measurement label
    proto.updateAngle = function() {
        setValueMeasurementLabelText(this.angleLabel.label, "~ " + this.measureTool.getAngle(this.measurement));
    };

    // Update area measurement label
    proto.updateArea = function() {
        setValueMeasurementLabelText(this.areaLabel.label, "~ " + this.measureTool.getArea(this.measurement));
    };

    // Set if collapse or expand the xyz delta distance
    proto.setSimple = function(simple) {
        if (this.simple != simple) {
            this.simple = simple;

            var isVisible = !simple;
            this.setLineVisible(this.lines.x, isVisible);
            this.setLineVisible(this.lines.y, isVisible);
            this.setLineVisible(this.lines.z, isVisible);

            this.updateLabelsPosition();

            this.viewer.impl.invalidate(false, false, /*overlayDirty=*/true);
        }
    };

    proto.setLineVisible = function(item, isVisible) {
        if (item.line) {
            item.line.visible = isVisible;
            item.visible = isVisible;

            if (item.label) {
                if (isVisible) {
                    this.showLabel(item.label);
                }
                else {
                    this.hideLabel(item.label);
                    item.label.style.opacity = 0;
                }
            }
        }
    };

    proto.enableLabelsTouchEvents = function(enable) {
        var value = enable ? 'all' : 'none';

        if (this.lines.xyz.label) {
            this.lines.xyz.label.style.pointerEvents = value;   
        }

        if (this.angleLabel.label) {
            this.angleLabel.label.style.pointerEvents = value;   
        }

        if (this.areaLabel.label) {
            this.areaLabel.label.style.pointerEvents = value;
        }
    };

    proto.setLabelsZIndex = function(zIndex) {
        for (var name in this.lines) {
            if (this.lines.hasOwnProperty(name)) {
                var item = this.lines[name];
                if (item.label) {
                    item.label.style.zIndex = zIndex;
                }
            }
        }

        if (this.angleLabel && this.angleLabel.label) {
            this.angleLabel.label.style.zIndex = zIndex;    
        }

        if (this.areaLabel && this.areaLabel.label) {
            this.areaLabel.label.style.zIndex = zIndex;    
        }

        for (name in this.endpoints) {
            if (this.endpoints.hasOwnProperty(name)) {
                var endpoint = this.endpoints[name];
                if (endpoint.label) {
                    endpoint.label.style.zIndex = zIndex - 1;
                }
            }
        }
    };

    proto.focusLabels = function() {
        this.setLabelsZIndex(3);
    };

    proto.unfocusLabels = function() {
        this.setLabelsZIndex(2);
    };

    proto.clear = function() {
        var name;

        for (name in this.endpoints) {
            if (this.endpoints.hasOwnProperty(name)) {
                var endpoint = this.endpoints[name];
                if (endpoint.label) {
                    this.hideLabel(endpoint.label);
                }
            }
        }

        for (name in this.lines) {
            if (this.lines.hasOwnProperty(name)) {
                var item = this.lines[name];
                if (item.line) {
                    item.line.visible = false;
                    item.visible = false;

                    item.tips && item.tips.forEach(function(tip) {
                        tip.visible = false;
                    });
                }
                if (item.label) {
                    this.hideLabel(item.label);
                    item.label.style.opacity = 0;
                    item.label.style.zIndex = 2;
                }
            }
        }

        if (this.angleLabel && this.angleLabel.label) {
            this.hideLabel(this.angleLabel.label);
        }

        if (this.areaLabel && this.areaLabel.label) {
            this.hideLabel(this.areaLabel.label);
        }
        
        this.clearSelectionAreas();

        this.segments = [];
        this.dashedLine = {};

        this.viewer.impl.clearOverlay(this.overlayName);
        MeasureCommon.createCommonOverlay(this.viewer, this.overlayName);
    };

    proto.hideClick = function(pickNumber) {

        avem.Indicator.prototype.hideClick.call(this, pickNumber);

        for (var name in this.lines) {
            if (this.lines.hasOwnProperty(name)) {
                var item = this.lines[name];
                if (item.line) {
                    item.line.visible = false;
                    item.visible = false;

                    item.tips && item.tips.forEach(function(tip) {
                        tip.visible = false;
                    });
                }
                if (item.label) {
                    this.hideLabel(item.label);
                    item.label.style.opacity = 0;
                }
            }
        }

        if (this.angleLabel && this.angleLabel.label) {
            this.hideLabel(this.angleLabel.label);
        }

        if (this.areaLabel && this.areaLabel.label) {
            this.hideLabel(this.areaLabel.label);
        }

        this.enableSelectionAreas(item.selectionArea, false);
    };

    proto.destroy = function() {
        var name;

        avem.Indicator.prototype.destroy.call(this);

        for (name in this.lines) {
            if (this.lines.hasOwnProperty(name)) {
                var item = this.lines[name];
                if (item.line) {
                    this.viewer.impl.clearOverlay(self.overlayName);
                    item.material = item.line = item.geometry = null;
                }

                if (item.label) {
                    if (name === 'xyz') {
                        item.label.addEventListener('mousewheel', this.viewer.toolController.mousewheel);
                        item.label.removeEventListener('click', this.onSelectionAreaClickedBinded);    
                    }

                    item.label.parentNode.removeChild(item.label);
                    item.label = null;
                }
                item.material = item.line = item.geometry = item.label = item.p1 = item.p2 = null;
            }
        }

        this.clearAngleMeshes();
        
        if (this.angleLabel && this.angleLabel.label) {
            this.angleLabel.label.parentNode.removeChild(this.angleLabel.label);
            this.angleLabel.label.removeEventListener('mousewheel', this.viewer.toolController.mousewheel);
            this.angleLabel.label.removeEventListener('click', this.onSelectionAreaClickedBinded);
             this.angleLabel.label = this.angleLabel.p1 = this.angleLabel.p2 = null;
        }

        

        if (this.areaLabel && this.areaLabel.label) {
            this.areaLabel.label.parentNode.removeChild(this.areaLabel.label);
            this.areaLabel.label.removeEventListener('mousewheel', this.viewer.toolController.mousewheel);
            this.areaLabel.label.removeEventListener('click', this.onSelectionAreaClickedBinded);
            this.areaLabel.label = this.areaLabel.p1 = this.areaLabel.p2 = null;
        }
        
        

        if (this.viewer.impl.overlayScenes[this.overlayName]){
            this.viewer.impl.removeOverlayScene(this.overlayName);
        }

        this.viewer.removeEventListener(av.CAMERA_CHANGE_EVENT, this.onCameraChangeBinded);
        window.removeEventListener('mouseup', this.handleButtonUpBinded);
    };

    proto.clearXYZLine = function() {
        this.viewer.impl.removeOverlay(this.overlayName, this.lines.xyz.line);

        this.lines.xyz.tips && this.lines.xyz.tips.forEach(function(tip) {
            this.viewer.impl.removeOverlay(this.overlayName, tip);
        }.bind(this));
    };

    // Update scale for vertex, edge, line and extension dash line
    proto.updateScale = function() {
        var name;
        
        MeasureCommon.forAll(this.angleOutline, function(cylinderMesh) {
            this.setCylinderScale(cylinderMesh);
        }.bind(this));

        for (name in this.lines) {
            if (this.lines.hasOwnProperty(name)) {
                var item = this.lines[name];
                if (item.line && item !== this.lines.xyz) {
                    this.setCylinderScale(item.line, item.p1, item.p2);
                }
            }
        }
        
        for (name in this.segments) {
            if (this.segments.hasOwnProperty(name)) {
                var segment = this.segments[name];
                if (segment.line) {
                    this.setCylinderScale(segment.line, segment.p1, segment.p2);
                } 
            }
        }
        
        if (this.measurement.measurementType === MeasureCommon.MeasurementTypes.MEASUREMENT_DISTANCE) {
            if (this.measurement.isComplete()) {
                this.clearXYZLine();
                this.drawXYZLine(this.lines.xyz);
            }
        }
    };

    proto.setNoTopology = function(){
        this.topologyStatus = TOPOLOGY_NOT_AVAILABLE;
        if (this.lines.xyz.label) {
            setVisibilityMeasurementLabelSpinner(this.lines.xyz.label, false, this.topologyStatus);
            this.lines.xyz.label.classList.remove('fetching-topology');
        }
    };
    proto.setFetchingTopology = function() {
        this.topologyStatus = TOPOLOGY_FETCHING;
        if (this.lines.xyz.label) {
            setVisibilityMeasurementLabelSpinner(this.lines.xyz.label, true, this.topologyStatus);
                this.lines.xyz.label.classList.add('fetching-topology');
        }
    };
    proto.setTopologyAvailable = function() {
        this.topologyStatus = TOPOLOGY_AVAILABLE;
        if (this.lines.xyz.label) {
            setVisibilityMeasurementLabelSpinner(this.lines.xyz.label, false, this.topologyStatus);
            this.lines.xyz.label.classList.remove('fetching-topology');
        }
    };

    proto.createMeasurementLabel = function() {
        
        var label = document.createElement('div');
        label.className = 'measure-length';
        
        var spinner = document.createElement('div');
        spinner.className = 'measure-fetching-topology';
        spinner.style.display = 'none';
        label.appendChild(spinner);

        var text = document.createElement('div');
        text.className = 'measure-length-text';
        label.appendChild(text);    

        var delta = document.createElement('div');
        delta.className = 'measure-delta-text';
        label.appendChild(delta);

        label.causeStacking = true;
        
        if (!av.isMobileDevice()) {
            MeasureCommon.safeToggle(label, 'enable-hover', true);
        }

        return label;
    };

    // Receives an object created with createMeasurementLabel()
    function setVisibilityMeasurementLabelText(label, isVisible) {
        var div = label.querySelector('.measure-length-text');
        div && (div.style.display = isVisible ? '' : 'none');
    }

    // Receives an object created with createMeasurementLabel()
    function setValueMeasurementLabelText(label, strValue) {
        if (!label) return;
        var div = label.querySelector('.measure-length-text');
        div && (div.textContent = strValue);
    }

    // Receives an object created with createMeasurementLabel()
    function setDeltaMeasurementLabelText(label, strValue) {
        if (!label) return;
        var div = label.querySelector('.measure-delta-text');
        div && (div.textContent = strValue);
    }

    // Receives an object created with createMeasurementLabel()
    function setVisibilityMeasurementLabelSpinner(label, isVisible, topologyStatus) {
        if (!label) return;
        var div = label.querySelector('.measure-fetching-topology');
        div && (div.style.display = 
            (isVisible && topologyStatus === TOPOLOGY_FETCHING) ? 'inline-block' : 'none');
    }

    /**
     * Helper function that creates the label used for (1) and (2),
     * which are the 2 mouse clicks for the measurement.
     */
    proto.createSnapResultLabel = function(pointNumber) {
        
        var label = document.createElement('div');
        label.className = 'measure-label';

        var label_icon = document.createElement('div');
        label_icon.className = 'measure-label-icon';
        label.appendChild(label_icon);

        if (av.isMobileDevice()) {
            this.initLabelMobileGestures(label, pointNumber, this.measureTool);
            var hitArea = document.createElement('div');
            hitArea.className = 'measure-label-hit-area';
            label.appendChild(hitArea);
        } 
        else {
            label.addEventListener('mousedown', function(event) {
                event.canvasX = event.clientX;
                event.canvasY = event.clientY;
                this.measureTool.editEndpoint(event, pointNumber, this.measurement.id); 
             }.bind(this));

            label.addEventListener('mousewheel', this.viewer.toolController.mousewheel);
            MeasureCommon.safeToggle(label, 'enable-hover', true);
        }
        
        label.causeStacking = false;

        return label;
    };

    proto.showAngleLabel = function(midPoint) {

            var label = this.angleLabel.label;

            if (!label) {
                label = this.angleLabel.label = this.createMeasurementLabel();
                this.viewer.container.appendChild(label);
                label.addEventListener('mousewheel', this.viewer.toolController.mousewheel);
                label.addEventListener('click', this.onSelectionAreaClickedBinded);
            }

            this.updateAngle();
            this.showLabel(label);

            this.angleLabel.p1 = midPoint.clone();
            this.angleLabel.p2 = midPoint.clone();

    };

    proto.showAreaLabel = function(midPoint) {

            var label = this.areaLabel.label;

            if (!label) {
                label = this.areaLabel.label = this.createMeasurementLabel();
                this.viewer.container.appendChild(label);
                label.addEventListener('mousewheel', this.viewer.toolController.mousewheel);
                label.addEventListener('click', this.onSelectionAreaClickedBinded);
            }

            this.updateArea();
            this.showLabel(label);

            this.areaLabel.p1 = midPoint;
            this.areaLabel.p2 = midPoint;

    };

    proto.onSelectionAreaClicked = function() {
        this.measureTool.selectMeasurementById(this.measurement.id);
    };

    proto.createSelectionArea = function() {
        var selectionArea = document.createElement('div');
        selectionArea.id = 'measurement-selection-area-' + this.measurement.id;
        this.viewer.container.appendChild(selectionArea);
        selectionArea.className = 'measure-selection-area';
        selectionArea.style.display = 'none';
        selectionArea.addEventListener('mousewheel', this.viewer.toolController.mousewheel);
        selectionArea.addEventListener('click', this.onSelectionAreaClickedBinded);
        return selectionArea;
    };

    proto.updateSelectionArea = function() {

        this.segments.forEach(function(item) 
        {
            if (item.p1 && item.p2) {
                var p1 = MeasureCommon.project(item.p1, this.viewer);
                var p2 = MeasureCommon.project(item.p2, this.viewer);

                if (!item.selectionArea) {
                    item.selectionArea = this.createSelectionArea();
                }

                var selectionArea = item.selectionArea;

                var v = new THREE.Vector2();

                selectionArea.style.top = (p1.y - (_selectorAreaSize / 2)) + 'px';
                selectionArea.style.left = p1.x  + 'px';
                selectionArea.style.width = v.subVectors(p1, p2).length() + 'px';
                selectionArea.style.height = _selectorAreaSize + 'px';

                var angle = null;
                var deltaX = p1.x - p2.x;
                var deltaY = p1.y - p2.y;

                angle =  Math.atan2(-deltaY , -deltaX) * 180 / Math.PI;    

                selectionArea.style.transform = 'rotate('+ angle +'deg)';
                selectionArea.style.transformOrigin = '0px ' + (_selectorAreaSize / 2) + 'px';
            }
        }.bind(this));

        if (this.measureTool.areAllPicksSet()) {
            this.enableSelectionAreas(true);    
        }
    };

    proto.clearSelectionAreas = function() {
        this.segments.forEach(function(item) 
        {  
            if (item.selectionArea) {
                item.selectionArea.removeEventListener('mousewheel', this.viewer.toolController.mousewheel);
                item.selectionArea.removeEventListener('click', this.onSelectionAreaClickedBinded);
                var element = document.getElementById('measurement-selection-area-' + this.measurement.id);
                if (element) {
                    element.parentNode.removeChild(element);
                }
                item.selectionArea = null;
            }
        }.bind(this));
    };

    proto.enableSelectionAreas = function(enable) {
        this.segments.forEach(function(item) 
        {   
            if (item.selectionArea) {
                if (enable) {
                    item.selectionArea.style.display = 'block';
                } 
                else {
                    item.selectionArea.style.display = 'none';
                }
            }
        }.bind(this));
    };

    proto.render = function(picks, showMeasureResult) {
        avem.Indicator.prototype.render.call(this, picks, showMeasureResult);

        this.updateSelectionArea();
    };

    proto.onCameraChange = function() {
        this.redrawDashedLine();
        this.updateSelectionArea();
        this.hideLabelsOutsideOfView();
        this.updateLabelsPosition();
    };

    proto.handleResize = function() {
        this.redrawDashedLine();
        this.updateSelectionArea();
        this.updateLabelsPosition();
    };

    ZhiUTech.Viewing.Extensions.Measure.MeasureToolIndicator = MeasureToolIndicator;

})();

(function(){ 'use strict';

ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.Measure');

//
// /** @constructor */
//
//
ZhiUTech.Viewing.Extensions.Measure.MeasureTool = function( viewer, options, sharedMeasureConfig, snapper )
{
    var tool = this;

    var _viewer  = viewer;
    var _options = options || {};
    var _names  = ["measure"];
    var _priority = 50;

    // Shared State with CalibrationTool and Indicator
    var _sharedMeasureConfig = sharedMeasureConfig;

    var av = ZhiUTech.Viewing;
    var avem = ZhiUTech.Viewing.Extensions.Measure;
    var MeasureCommon = ZhiUTech.Viewing.MeasureCommon;
    
    // Not shared with Indicator.js
    var _active = false;
    var _isDragging = false;
    var _endpointMoved = false;
    var _activePoint = 0;
    var _consumeSingleClick = false;
    var _singleClickHandled = false;
    var _downX = null;
    var _downY = null;
    var _isolateMeasure = false;

    var _measurementsManager = new ZhiUTech.Viewing.Extensions.Measure.MeasurementsManager(_viewer);
    var _currentMeasurement = null;
    var _onIndicatorCreatedCB = null;

    var _cursor = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOHSURBVFhH7ZZdSBRRFMed9QOMSkiCniwIejcNQqK2iD4geu2pIiQoaoOyiMjaqCCKXirwpSfpIXpSENeQwKCHUIiIrBVcQhY0U3d1cW2/d/r/7z0z7rpj7a5JD/mDw8w9X/fMuXfuTMUa/z2GXBWmaVbhsk2PisMwjIDcEtfAwECL2+1+h/unkBuw/1SWYkABDZCSQBiLJlVTU1OnRW3xDGLZ/wycSypgbm7uHMIqKZFIxJPNZiNiyqVXJS8GOOcWsAtSbQmSv6HSIhQKtXq9XhfCjJmZmVNQZbTFkSH6qUl+BxxzC2gU3aZMJtOpVaaJQuaj0egVmPjkrtnZWbvtyWTyA3QbqY/FYmegCmmLiutG3BbYlgd+dgFIthMXPv0rpRDQ9rNwVZMnEolbojYXFhZ8fX191gY24vH4Ydhvw5TUHqqIHr/fXy8+hcDHLgAJm3D5rEea0dHRfXBTbU+lUo+gspOj4EvUMw82415M9gPybXx8vEVcFND56eMI7I6bEEHzwWDwEH2Gh4drsCTtYiJpjDtUAiEQCByBLir2pUyKWyEwFhSARN/xRCdg5pPTx6stGtgfUw8MDI9DTuK+BhvzoXLI5y2kuCUQ4mNjY0dh4prTbm9G4QL1wEin060YhyHsSDvW/67yWOQ1pEH8naGDchXa2tq2Qq3WFcMuSFYZNJxQdYV4PJ7N2AdftMlMQWL6VvEJUiuuywMnVQCeJtjf398MFdtaB3lOvcC1vaojVMxu7PgduHUh7oXyyGdQexYBnOvw/t7DRtuPYSXGfA3z2o72nofN6spl6vBGfGWcQ9sZW03fUmCAteEGVRoBkxyg3gKqRm1xhF2rE9fSQGAthOtmEcMpdlBs7Mw1iNoDkKUbl/ukSyUqBwQzIXesggcKWsvX0Gr7dW1Rh48HS3JRhhad9CsLBNdD+K5aJMLh8DGY7A8JdHnnwBK84lYeSDCp82h8Pt92qK0nf4mfjfW4cmPepD0Xvvs8JelbNjynJZ9iZGSkeXp6egNuO7TGNCcmJpow2QMZkiS/Cwi3u1Q2/FKhiB5JTJL4KN3BBO9lXAC/iAi1D6QVw282iuiW/NyEYRRxH0V8FJUN/wUQ8vcmz4En4JCexpEM/4Lop91XCUzUq+dbBB3B71/EA7P6QK0qmK8Kwj9bG/75wlT8n+5KwZzrIE84OV7DPVCtypqv8Y+oqPgFmh+VkdqVJeIAAAAASUVORK5CYII=), auto";

    // Snapper
    var _snapper = snapper;
    
    var _isPressing = false;

    var _picksBackup = [];
    var _cursorPosition = null;

    var _closeAreaSnapRange = 25;
    var _preMeasureIsolatedNodes = [];
    var _preMeasureHiddenNodes = [];

    var _measurementType = MeasureCommon.MeasurementTypes.MEASUREMENT_DISTANCE;

    ZhiUTech.Viewing.Private.injectCSS('extensions/Measure/Measure.css');

    function getActivePick()
    {   
        if(!_currentMeasurement)
            return null;

        var index;

        if (_activePoint === 0) {
            return null;
        } else if (_activePoint === _currentMeasurement.getMaxNumberOfPicks() + 1) {
            index = _currentMeasurement.countPicks();
        } else {
               index = _activePoint;
        }

        return _currentMeasurement.getPick(index);
    }

    function getPreviousPick()
    {
        if(!_currentMeasurement)
            return null;

        var index;

        if (_activePoint === 0) {
            return null;
        } else if (_activePoint === 1) {
            index = _currentMeasurement.countPicks();
        } else if (_activePoint === _currentMeasurement.getMaxNumberOfPicks() + 1) {
            index = _currentMeasurement.countPicks() - 1;
        } else {
            index = _activePoint - 1;
        }
        
        return _currentMeasurement.getPick(index);
    }

    function hasPreviousPick()
    {
        if(!_currentMeasurement)
            return false;

        var index;

        if (_activePoint === 0) {
            return false;
        } else if (_activePoint === 1) {
            index = _currentMeasurement.countPicks();
        } else if (_activePoint === _currentMeasurement.getMaxNumberOfPicks() + 1) {
            index = _currentMeasurement.countPicks() - 1;
        } else {
            index = _activePoint - 1;
        }
        
        return _currentMeasurement.hasPick(index);
    }

    function noPicksSet() {
        _activePoint = 0;
    }

    function allPicksSet() {
        _activePoint = _currentMeasurement.countPicks() + 1;
        enableMeasurementsTouchEvents(true);
        _currentMeasurement.indicator.enableSelectionAreas(true);
    }

    function isNoPicksSet() {
        return _activePoint === 0 || !_currentMeasurement;
    }

    this.areAllPicksSet = function() {
        return _currentMeasurement && (_activePoint === _currentMeasurement.getMaxNumberOfPicks() + 1);
    };

    this.register = function()
    {

    };

    this.deregister = function()
    {
        this.deactivate();
    };

    this.isActive = function()
    {
        return _active;
    };

    this.getNames = function()
    {
        return _names;
    };

    this.getName = function()
    {
        return _names[0];
    };

    this.getPriority = function()
    {
        return _priority;
    };

    this.getCursor = function() {
        return _isDragging ? null : _cursor;
    };

    this.getCurrentMeasurementRaw = function() {
        return _currentMeasurement;
    };

    this.getActivePointIndex = function() {
        return _activePoint;
    };


    this.startNewMeasurement = function() {

        _currentMeasurement = _measurementsManager.createMeasurement(_measurementType);
        _currentMeasurement.attachIndicator(_viewer, this, avem.MeasureToolIndicator);

        if (_onIndicatorCreatedCB instanceof Function) {
            _onIndicatorCreatedCB();
            _onIndicatorCreatedCB = null;
        }

        enableMeasurementsTouchEvents(false);
    };

    this.changeMeasurementType = function(type) {
        _measurementType = type;
    };

    this.activate = function()
    {
        _active = true;
        _measurementsManager.init();

        noPicksSet();
        _isDragging = false;
        this.isEditingEndpoint = false;
        this.editByDrag = false;

        _viewer.impl.pauseHighlight(true);
        _preMeasureIsolatedNodes = _viewer.getIsolatedNodes();
        _preMeasureHiddenNodes = _viewer.getHiddenNodes();

        _viewer.clearSelection();
        _viewer.toolController.activateTool("snapper");
        _viewer.toolController.activateTool("magnifyingGlass");
 
       this.onMeasurementChangedBinded = this.onMeasurementChanged.bind(this);
       _viewer.addEventListener(MeasureCommon.Events.MEASUREMENT_CHANGED_EVENT, this.onMeasurementChangedBinded);
       _viewer.addEventListener(av.CAMERA_CHANGE_EVENT, this.onCameraChange);
       _viewer.addEventListener(av.ISOLATE_EVENT, this.onIsolate);
    };

    this.deactivate = function()
    {
        if (!_active)
            return;

        _active = false;

        while (Object.keys(_measurementsManager.measurementsList).length > 0) {
            _currentMeasurement = _measurementsManager.measurementsList[Object.keys(_measurementsManager.measurementsList)[0]];
            _measurementsManager.changeCurrentMeasurement(_currentMeasurement);
            this.clearCurrentMeasurement();
            _currentMeasurement = null;
        }

        if(_snapper && _snapper.isActive()) {
            _viewer.toolController.deactivateTool("snapper");
        }

        _viewer.toolController.deactivateTool("magnifyingGlass");

        _viewer.impl.pauseHighlight(false);
        _preMeasureIsolatedNodes = [];
        _preMeasureHiddenNodes = [];

        _measurementsManager.destroy();
        _viewer.removeEventListener(av.CAMERA_CHANGE_EVENT, this.onCameraChange);
        _viewer.removeEventListener(MeasureCommon.Events.MEASUREMENT_CHANGED_EVENT, this.onMeasurementChangedBinded);
        _viewer.removeEventListener(av.ISOLATE_EVENT, this.onIsolate);
    };

    this.update = function()
    {
        return false;
    };

    this.getUnits = function() {
        return _sharedMeasureConfig.units;
    };

    this.setUnits = function( units )
    {
        if (_sharedMeasureConfig.units !== units ) {
            _sharedMeasureConfig.units = units;

            for (var key in _measurementsManager.measurementsList) {
                if (_measurementsManager.measurementsList.hasOwnProperty(key)) {
                    // Update UI
                    var measurement = _measurementsManager.measurementsList[key];
                    if (measurement.indicator) {
                        measurement.indicator.updateResults();
                    }
                }
            }
        }
    };

    this.getPrecision = function() {
        return _sharedMeasureConfig.precision;
    };

    this.setPrecision = function( precision ) {

        if (_sharedMeasureConfig.precision !== precision ) {
            _sharedMeasureConfig.precision = precision;

            for (var key in _measurementsManager.measurementsList) {
                if (_measurementsManager.measurementsList.hasOwnProperty(key)) {
                    // Update UI
                    var measurement = _measurementsManager.measurementsList[key];
                    if (measurement.indicator) {
                        measurement.indicator.updateResults();
                    }
                }
            }
        }
    };

    this.getDistanceXYZ = function(measurement) {
        if (!measurement) {
            measurement = _currentMeasurement;
        }
        return this.getDistanceAux(measurement.distanceXYZ);
    };
    this.getDistanceX = function(measurement) {
        if (!measurement) {
            measurement = _currentMeasurement;
        }
        return this.getDistanceAux(measurement.distanceX);
    };
    this.getDistanceY = function(measurement) {
        if (!measurement) {
            measurement = _currentMeasurement;
        }
        return this.getDistanceAux(measurement.distanceY);
    };
    this.getDistanceZ = function(measurement) {
        if (!measurement) {
            measurement = _currentMeasurement;
        }
        return this.getDistanceAux(measurement.distanceZ);
    };

    /**
     * @private
     */
    this.getDistanceAux = function (measurementDistance) {

        if (_viewer.model) {
            var d = ZhiUTech.Viewing.Private.convertUnits(_viewer.model.getUnitString(), _sharedMeasureConfig.units, _sharedMeasureConfig.calibrationFactor, measurementDistance || 0);
            return ZhiUTech.Viewing.Private.formatValueWithUnits(d, _sharedMeasureConfig.units, 3, _sharedMeasureConfig.precision);
        }
    };

    this.getAngle = function(measurement) {

        if (!measurement) {
            measurement = _currentMeasurement;
        }
        var angle = measurement.angle;
        return ZhiUTech.Viewing.Private.formatValueWithUnits(angle, String.fromCharCode(0xb0), 3, _sharedMeasureConfig.precision);
    };

    this.getArea = function(measurement) { 

        if (_viewer.model) {

            if (!measurement) {
                measurement = _currentMeasurement;
            }

            var area = ZhiUTech.Viewing.Private.convertUnits(viewer.model.getUnitString(), _sharedMeasureConfig.units, _sharedMeasureConfig.calibrationFactor, measurement.area, 'square');

            if (_sharedMeasureConfig.units) {
                return ZhiUTech.Viewing.Private.formatValueWithUnits(area, _sharedMeasureConfig.units+'^2', 3, _sharedMeasureConfig.precision);
            }
            else {
                return ZhiUTech.Viewing.Private.formatValueWithUnits(area, null, 3, _sharedMeasureConfig.precision);
            }
        }
    };

    function snapToFirstPick(currentPick, forceSnap) {
        if (_currentMeasurement.hasPick(1) && _activePoint > 3 && !_currentMeasurement.closedArea) {
            var firstPick = _currentMeasurement.getPick(1);
            var firstPickPoint = MeasureCommon.getSnapResultPosition(firstPick, _viewer);
            var firstPickPosition = MeasureCommon.project(firstPickPoint, viewer);
            var currentPickPoint = MeasureCommon.getSnapResultPosition(currentPick, _viewer);
            var currentPickPosition = MeasureCommon.project(currentPickPoint, viewer);
            
            if (forceSnap || currentPickPosition.distanceTo(firstPickPosition) < _closeAreaSnapRange) {
                _snapper.onMouseMove(firstPickPosition);
                firstPick.copyTo(currentPick);
            }
        }
    }

    function render(showResult) {

        var hasResult = _currentMeasurement.computeResult(_currentMeasurement.picks, _viewer, _snapper);

        _currentMeasurement.indicator.render(_currentMeasurement.picks, _consumeSingleClick || !!showResult);

        return hasResult;
    }

    /**
     * TODO: We need to flesh out the return value here.
     *
     * @param unitType
     * @param precision
     * @returns {Object}
     */
    this.getMeasurement = function(unitType, precision) {

        _sharedMeasureConfig.units = unitType || _sharedMeasureConfig.units;
        _sharedMeasureConfig.precision = precision || _sharedMeasureConfig.precision;

        var geomTypes = ['Vertex', 'Edge', 'Face', 'Circular Arc', 'Curved Edge', 'Curved Face'];

        var measurement = {
            from: geomTypes[_currentMeasurement.getGeometry(1).type],
            to: geomTypes[_currentMeasurement.getGeometry(2).type],
            distance: this.getDistanceXYZ(),
            deltaX: this.getDistanceX(),
            deltaY: this.getDistanceY(),
            deltaZ: this.getDistanceZ(),
            angle: this.getAngle(),
            unitType: _sharedMeasureConfig.units,
            precision: _sharedMeasureConfig.precision
        };

        return measurement;
    };

    this.clearCurrentMeasurement = function() {
        if (_currentMeasurement) {
            noPicksSet();

            for (var key in _currentMeasurement.picks) {
                if (_currentMeasurement.picks.hasOwnProperty(key)) {
                    this.clearPick(key);    
                }
            }
            
            this.updateViewportId(true);

            if (_isolateMeasure) {
                this.clearIsolate();    
            }

            _currentMeasurement.indicator.clear();
            _currentMeasurement.indicator.destroy();
            _currentMeasurement = _measurementsManager.removeCurrentMeasurement();
            _currentMeasurement = null;
        }

        enableMeasurementsTouchEvents(true);
    };

    this.clearPick = function(pickNumber) {
        if (_currentMeasurement && _currentMeasurement.hasPick(pickNumber)) {
            _currentMeasurement.clearPick(pickNumber);
            _currentMeasurement.indicator.hideClick(pickNumber);
        }
    };

    this.setIsolateMeasure = function(enable) {
        _isolateMeasure = enable;
    };

    this.isolateMeasurement = function () {
        if (_currentMeasurement) {
            var isolationGroup = [];
        
            for (var key in _currentMeasurement.picks) {
                if (_currentMeasurement.picks.hasOwnProperty(key)) {
                    isolationGroup.push(_currentMeasurement.getPick(key).snapNode);
                }
            }
            _viewer.removeEventListener(av.ISOLATE_EVENT, this.onIsolate);
            _viewer.isolate(isolationGroup);
            _viewer.addEventListener(av.ISOLATE_EVENT, this.onIsolate);
        }
    };

    this.clearIsolate = function() {
        _viewer.removeEventListener(av.ISOLATE_EVENT, this.onIsolate);
        _viewer.showAll();
        _viewer.isolate(_preMeasureIsolatedNodes);
        _viewer.hide(_preMeasureHiddenNodes);
        _viewer.addEventListener(av.ISOLATE_EVENT, this.onIsolate);

    };

    this.onIsolate = function (event) {
        // Isolation group is empty. Should enter only when 'Show all objects' is being called.
        if (!event.nodeIdArray.length) {
            _preMeasureIsolatedNodes = [];
            _preMeasureHiddenNodes = [];
        }
    };

    this.deselectAllMeasurements = function() {
        if (_currentMeasurement && !this.areAllPicksSet()) {
            if (this.isEditingEndpoint) {
                this.undoEditEndpoint();
            }
            else {
                this.clearCurrentMeasurement();
            }
        }

        for (var key in _measurementsManager.measurementsList) {
            if (_measurementsManager.measurementsList.hasOwnProperty(key)) {
                var measurement = _measurementsManager.measurementsList[key];
                if (measurement.indicator) {
                    measurement.indicator.setSimple(true);        
                    measurement.indicator.hideEndpoints();
                    measurement.indicator.unfocusLabels();
                }
            }
        }

        _currentMeasurement = null;
    };

    this.onMeasurementChanged = function() {
        
        this.deselectAllMeasurements();

        _currentMeasurement = _measurementsManager.getCurrentMeasurement();
        
        if (_currentMeasurement.isComplete()) {
            _currentMeasurement.indicator.setSimple(false);        
            allPicksSet();
            render(true); 
            this.updateResults();
        }
    };

    this.selectMeasurementById = function(measurementId) {
        if (!_currentMeasurement) {
            _currentMeasurement = _measurementsManager.selectMeasurementById(measurementId);
        }

        if (_currentMeasurement.id !== measurementId) {
            if (!this.areAllPicksSet()) {
                if (this.isEditingEndpoint) {
                    this.undoEditEndpoint();
                }
                else {
                    this.clearCurrentMeasurement();
                }
            }
            
            _currentMeasurement = _measurementsManager.selectMeasurementById(measurementId);
        }
    };

    function enableMeasurementsTouchEvents(enable) {
        for (var key in _measurementsManager.measurementsList) {
            if (_measurementsManager.measurementsList.hasOwnProperty(key)) {
                var measurement = _measurementsManager.measurementsList[key];
                measurement.indicator.changeAllEndpointsEditableStyle(enable);   
                measurement.indicator.enableSelectionAreas(enable);
                measurement.indicator.enableLabelsTouchEvents(enable);
            }
        }
    }

    this.editEndpoint = function(event, endpointNumber, measurementId) {
        if (_currentMeasurement.id === measurementId && _activePoint === endpointNumber) {
            _currentMeasurement.indicator.changeEndpointOnEditStyle(endpointNumber, false);
            this.undoEditEndpoint();
            return;
        }

        this.selectMeasurementById(measurementId);

        _activePoint = endpointNumber;
        this.isEditingEndpoint = true;

        _currentMeasurement.indicator.changeEndpointOnEditStyle(endpointNumber, true);
        enableMeasurementsTouchEvents(false);

        for (var key in _currentMeasurement.picks) {
            if (_currentMeasurement.picks.hasOwnProperty(key)) {
                _picksBackup[key] = _currentMeasurement.getPick(key).clone();
            }
        }

        this.updateViewportId();

        if (_isolateMeasure) {
            this.clearIsolate();    
        }

        if(!av.isMobileDevice()) {
            this._handleMouseEvent(event);
        }
    };

    function canCloseArea() {
        return _currentMeasurement.countPicks() > 3;
    }

    this.undoEditEndpoint = function() {
        _currentMeasurement.indicator.clear();

        for (var key in _currentMeasurement.picks) {
            if (_currentMeasurement.picks.hasOwnProperty(key)) {
                _currentMeasurement.setPick(key, _picksBackup[key].clone());
            }
        }
        
        _currentMeasurement.indicator.changeEndpointOnEditStyle(_activePoint, false);
        
        this.isEditingEndpoint = false;
        this.updateViewportId(true);
        allPicksSet();
        render(true);
    };

    this.updateResults = function() {

        _currentMeasurement.indicator.updateResults();
        _currentMeasurement.indicator.showEndpoints();
        _currentMeasurement.indicator.focusLabels();

        if (_isolateMeasure && _currentMeasurement.isComplete()) {
            this.isolateMeasurement();
        }
    };

    this.deleteCurrentMeasurement = function() {
        this.clearCurrentMeasurement();
        this.isEditingEndpoint = false;
        this.editByDrag = false;
        _isDragging = false;
    };

    this.deleteCurrentPick = function() {

        var pick = getActivePick();
        var id = pick.id;

        while (_currentMeasurement.hasPick(id + 1)) {
            _currentMeasurement.setPick(id, _currentMeasurement.getPick(id + 1));
            id++;
        }

        delete _currentMeasurement.picks[id];
        
        
        
        var count = _currentMeasurement.countPicks();
        
        _activePoint--;
        
        if (_activePoint <= 0) {
            _activePoint = count;
        }

        if (this.isEditingEndpoint) {
            if (count == 2) {
                this.deleteCurrentMeasurement();
                return;
            }

            _currentMeasurement.indicator.changeAllEndpointsOnEditStyle(false);
            this.isEditingEndpoint = false;
            this.updateViewportId(true);
            allPicksSet();
            render();
        } else {
            this._handleMouseEvent();    
        }
    };

    this.updateViewportId = function(clear) {
        if (_viewer.model && _viewer.model.is2d()) {
            if (clear || isNoPicksSet()) {
                _viewer.impl.updateViewportId(0);
                _snapper.setViewportId(null);
            }
            else if (!_isPressing) {
                var viewport = getPreviousPick().viewportIndex2d || getActivePick().viewportIndex2d;
                
                // Pass viewport Id to LineShader to make all other geometries with different viewport transparent
                _viewer.impl.updateViewportId(viewport);
                if (_snapper)
                    _snapper.setViewportId(viewport);  
            
            }
        }
    };

    this.setNoTopology = function() {
        if (_currentMeasurement && _currentMeasurement.indicator) {
            _currentMeasurement.indicator.setNoTopology();
        }
        else {
            _onIndicatorCreatedCB = function() { _currentMeasurement.indicator.setNoTopology(); };
        }
    };
    this.setFetchingTopology = function() {
        if (_currentMeasurement && _currentMeasurement.indicator) {
            _currentMeasurement.indicator.setFetchingTopology();
        }
        else {
            _onIndicatorCreatedCB = function() { _currentMeasurement.indicator.setFetchingTopology(); };
        }
    };
    this.setTopologyAvailable = function() {
        if (_currentMeasurement && _currentMeasurement.indicator) {
            _currentMeasurement.indicator.setTopologyAvailable();
        }
        else {
            _onIndicatorCreatedCB = function() { _currentMeasurement.indicator.setTopologyAvailable(); };
        }
    };

    this.getSnapper = function() {
        return _snapper;
    };

    this.correctPickPosition = function() {
        
        var active = getActivePick();
        
        if (!active.getGeometry() && _cursorPosition) {
            active.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
            active.geomVertex = _cursorPosition;
            active.intersectPoint = _cursorPosition;
        }

        if (hasPreviousPick()) {
            var passive = getPreviousPick();
            var corrected = MeasureCommon.correctPerpendicularPicks(passive, active, viewer, _snapper);
            if (!corrected) {

                // get next pick in case of closed loop measurement.
                var id = (active.id + 1) % (_currentMeasurement.countPicks() + 1);
                
                if (id === 0)
                    id = 1;

                if (id !== active.id && _currentMeasurement.hasPick(id)) {
                    var nextPick = _currentMeasurement.getPick(id);   
                    MeasureCommon.correctPerpendicularPicks(nextPick, active, viewer, _snapper);
                }
            }
            
            if (_currentMeasurement.measurementType == MeasureCommon.MeasurementTypes.MEASUREMENT_AREA) {
                snapToFirstPick(active);    
            }
        }
    };

    this._handleMouseEvent = function (event) {

        var valid = false;

        if (_snapper.isSnapped()) {
            
            // User picked a new point after two points where already set (or none) - Start a new measurement.
            if (this.areAllPicksSet() || isNoPicksSet()) {
                this.startNewMeasurement();
                
                if (_isolateMeasure) { 
                    this.clearIsolate();
                }

                _activePoint = 1;
            }

            _snapper.copyResults(getActivePick());

            valid = true;

        } 
        else { 
            // In order to draw rubber-band, set the cursor position, so the indicator will use it as active point.
            if (event && _viewer.model.is2d()) {
                var viewport = _viewer.container.getBoundingClientRect();
                var x = event.canvasX || event.clientX - viewport.left;
                var y = event.canvasY || event.clientY - viewport.top;

                if (x && y) {
                    _cursorPosition = MeasureCommon.inverseProject({ x:x, y:y }, _viewer);
                }
            }

            // In case a measurement is set, and the user clicks on a blank spot - don't do nothing.
            if (_consumeSingleClick && _currentMeasurement && !this.isEditingEndpoint) {
                if (_activePoint === _currentMeasurement.getMaxNumberOfPicks() + 1) {
                    return true;
                }
            }

            var lastPick = getActivePick();
            if (lastPick) {
                lastPick.clear();
            }
        }

        if (_currentMeasurement) {
            this.correctPickPosition();
            
            if (_consumeSingleClick) {
                this._doConsumeSingleClick();
            }

            if (!isNoPicksSet()) {
                var renderSucceeded = render();
                
                // If it's the first pick, we don't expect the render of the rubberband to be succeeded.
                // So enter here only if it's not the first pick.
                if (_currentMeasurement.hasPick(2)) {
                    valid &= renderSucceeded;
                }
            }
        }

        // If valid is false, the last pick is not revelant, and will clear it in case of a click.
        return valid;
    };

    this._doConsumeSingleClick = function() {
        // In case the measurement is a closed loop, eliminate the last pick.
        if (_currentMeasurement.measurementType === MeasureCommon.MeasurementTypes.MEASUREMENT_AREA && !_currentMeasurement.closedArea) {
            var length = _currentMeasurement.countPicks();
            var firstPick = _currentMeasurement.getPick(1);
            var lastPick = _currentMeasurement.getPick(length);

            if (length >= 3 && _currentMeasurement.hasEqualPicks(firstPick, lastPick)) {
                lastPick.clear();
                delete _currentMeasurement.picks[length];
                _currentMeasurement.closedArea = true;
            }
        }

        this.updateResults();

        var measurementComplete = _currentMeasurement.isComplete();
        this.updateViewportId(measurementComplete);
    };


    this.handleButtonDown = function (event, button) {
        if (av.isMobileDevice()) 
            return false;

        _isDragging = true;
        if (button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
            _consumeSingleClick = true;
            _downX = event.canvasX;
            _downY = event.canvasY;
        }
        return false;
    };

    this.handleMouseMove = function (event) {

        if (av.isMobileDevice())
            return false;

        if (event.canvasX !== _downX || event.canvasY !== _downY) {
            _consumeSingleClick = false;    
        } 

        _endpointMoved = this.isEditingEndpoint;

        if (!isNoPicksSet() && !this.areAllPicksSet()) {
            this.clearPick(_activePoint);
            this._handleMouseEvent(event);
        }

        _snapper.indicator.render();

        return false;
    };

    this.restoreMouseListeners = function () {

        // When a press event has happend, the default behavior of firefly.js is to disable other mouse events,
        // So they won't be triggered as well.
        // The solution is to enable them after the end of the pressing.

        _viewer.toolController.getTool("gestures").controller.enableMouseButtons(true);
    };

    this.handlePressHold = function (event) {
        _consumeSingleClick = false;

        if (av.isMobileDevice()) {
            switch( event.type )
            {
                case "press":
                    _isPressing = true;

                    if (this.areAllPicksSet() || isNoPicksSet()) {
                        this.startNewMeasurement();

                        if (_isolateMeasure) { 
                            this.clearIsolate();
                        }

                        _activePoint = 1;
                    }

                    this._handleMouseEvent(event);
                    _snapper.indicator.render();

                    return true;

                case "pressup":
                    _consumeSingleClick = true;
                    this.restoreMouseListeners();
                    _singleClickHandled = !_singleClickHandled;
                    this.handleSingleClick(event);
                    _isPressing = false;
                    return true;
            }
        }
        return false;

    };



    this.handleGesture = function( event )
    {   
        if (av.isMobileDevice()){
            
            _consumeSingleClick = false;
        
            if (_isPressing) {
                
                this.clearPick(_activePoint);

                switch( event.type )
                {
                    case "dragstart":
                        this._handleMouseEvent(event);
                        _snapper.indicator.render();

                        return true;

                    case "dragmove":
                        this._handleMouseEvent(event);
                        _snapper.indicator.render();

                        return true;

                    case "dragend":
                        _isPressing = false;
                        _consumeSingleClick = true;

                        if (!this.editByDrag) {
                            _singleClickHandled = !_singleClickHandled;
                            this.handleSingleClick(event);    
                        }

                        this.editByDrag = false;
                        this.restoreMouseListeners();
                        return true;

                    case "pinchstart":
                        this._handleMouseEvent(event);
                        _snapper.indicator.render();

                        break;

                    case "pinchmove":
                        this._handleMouseEvent(event);
                        _snapper.indicator.render();

                        break;

                    case "pinchend":
                        _consumeSingleClick = true;
                        _singleClickHandled = !_singleClickHandled;
                        this.handleSingleClick(event);
                        this.restoreMouseListeners();
                        return true;
                }
            }

            if (event.type.indexOf('pinch') !== -1) {
                for (var key in _measurementsManager.measurementsList) {
                    if (_measurementsManager.measurementsList.hasOwnProperty(key)) {
                        var measurement = _measurementsManager.measurementsList[key];
                        measurement.indicator.updateScale();    
                    }
                }
            }
        }

        return false;
    };

    this.handleButtonUp = function (event, button) {
        _isDragging = false;
        _downX = null;
        _downY = null;
        
        if (_endpointMoved) {
            _consumeSingleClick = true;
            _singleClickHandled = !_singleClickHandled;
            this.handleSingleClick(event);
            _endpointMoved = false;
        }

        return false;
    };

    this.handleSingleClick = function (event, button) {
        if (_consumeSingleClick) {

            _snapper.indicator.clearOverlays();

            if (_currentMeasurement) {
                _currentMeasurement.indicator.changeEndpointOnEditStyle(_activePoint, false);    
            }

            if (this._handleMouseEvent(event)) {
                this.updateResults();
                _activePoint++;
            }
            else {
                if (this.isEditingEndpoint) {
                    this.undoEditEndpoint();
                }
                else {
                    if (_currentMeasurement && _currentMeasurement.measurementType === MeasureCommon.MeasurementTypes.MEASUREMENT_AREA && canCloseArea()) {
                        snapToFirstPick(getActivePick(), true);
                        this._handleMouseEvent();
                    } else {
                        this.clearCurrentMeasurement();    
                    }
                }
            }

            if (_currentMeasurement && _currentMeasurement.isComplete()) {
                allPicksSet();
            }

            _consumeSingleClick = false;
            _singleClickHandled = !_singleClickHandled;
            this.isEditingEndpoint = false;

            _snapper.clearSnapped();
        }
        return true;
    };

    this.handleDoubleClick = function(event) {
        return true;
    };

    this.onCameraChange = function () {
        for (var key in _measurementsManager.measurementsList) {
            if (_measurementsManager.measurementsList.hasOwnProperty(key)) {
                var measurement = _measurementsManager.measurementsList[key];
                measurement.indicator.updateScale();
            }
        }

        _snapper.indicator.onCameraChange();
    };

    this.handleSingleTap = function (event) {
        if (!_singleClickHandled) {
            _consumeSingleClick = true;
            _snapper.onMouseDown({x: event.canvasX, y:event.canvasY});
            this.handleSingleClick(event);
        }
        _singleClickHandled = !_singleClickHandled;

        return true;
    };

    this.handleDoubleTap = function(event) {
        if (_currentMeasurement && _currentMeasurement.measurementType === MeasureCommon.MeasurementTypes.MEASUREMENT_AREA && _currentMeasurement.countPicks() > 2) {
            // fake single click over the first handle, to close the area.
            var firstPick = _currentMeasurement.getPick(1);
            var firstPickPoint = MeasureCommon.getSnapResultPosition(firstPick, _viewer);
            var firstPickPosition = MeasureCommon.project(firstPickPoint, viewer);
            event.canvasX = firstPickPosition.x;
            event.canvasY = firstPickPosition.y;
            _consumeSingleClick = true;
            _snapper.onMouseDown(firstPickPosition);
            this.handleSingleClick(event);
            _singleClickHandled = !_singleClickHandled;
        }

        return true;
    };

    this.handleResize = function() {
        for (var key in _measurementsManager.measurementsList) {
            if (_measurementsManager.measurementsList.hasOwnProperty(key)) {
                var measurement = _measurementsManager.measurementsList[key];
                if (measurement.indicator) {
                    measurement.indicator.handleResize();
                }
            }
        }
    };

    this.handleKeyDown = function(event, keyCode) {
        switch (keyCode) {
            case ZhiUTech.Viewing.KeyCode.BACKSPACE:
            case ZhiUTech.Viewing.KeyCode.DELETE:
            if (_currentMeasurement && _currentMeasurement.measurementType === MeasureCommon.MeasurementTypes.MEASUREMENT_AREA && !this.areAllPicksSet()) {
                if (_currentMeasurement.countPicks() > 2 ) {
                    this.deleteCurrentPick();
                } else {
                    this.deleteCurrentMeasurement();    
                }
            } else {
                this.deleteCurrentMeasurement();
            }

            return true;
        }

        return false;
    };
};

})();

(function(){ 'use strict';

    var av = ZhiUTech.Viewing;
    var MeasureCommon = ZhiUTech.Viewing.MeasureCommon;

    // /** @constructor */
    function CalibrationToolIndicator(viewer, measurement, calibrationTool)
    {
        ZhiUTech.Viewing.Extensions.Measure.Indicator.call(this, viewer, measurement, calibrationTool);
        this.calibrationTool = calibrationTool;
        this.calibrationLabel = null;
        this.endpoints = null;
        this.tmpVector = new THREE.Vector3();
        this.p1 = null;
        this.p2 = null;

        this.rubberbandDefaultMaterial = new THREE.MeshBasicMaterial({
            color: 0xe8b22c,
            opacity: 1,
            transparent: false,
            depthTest: false,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        this.rubberbandSnappedMaterial = new THREE.MeshBasicMaterial({
            color: 0x005BCE,
            opacity: 1,
            transparent: false,
            depthTest: false,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        this.rubberbandTipMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            opacity: 1,
            transparent: false,
            depthTest: false,
            depthWrite: false,
            side: THREE.DoubleSide
        });

    }

    CalibrationToolIndicator.prototype = Object.create(ZhiUTech.Viewing.Extensions.Measure.Indicator.prototype);
    CalibrationToolIndicator.prototype.constructor = CalibrationToolIndicator;
    var proto = CalibrationToolIndicator.prototype;
    
    var kEndpointOffset = 15;
    
    var kCrossWidth = 1.5;
    var kTipXWidth = 2;
    var kLineWidth = 3;

    var kTipXLength = 3;
    var kCrossLength = 5;

    var kDashSize = 2;
    var kGapSize = 1;

    proto.createEndpoint = function(name) {
        this.endpoints[name] = {};
        this.endpoints[name].position = null;

        var label = this.endpoints[name].label = document.createElement('div');
        label.className = 'calibration-endpoint';

        this.viewer.container.appendChild(label);

        var text = document.createElement('div');
        text.className = 'calibration-endpoint-text';
        text.textContent = name.toString();
        label.appendChild(text);
        
        // Disable hover for mobile devices
        if (av.isMobileDevice()) {
            this.initLabelMobileGestures(label, name, this.calibrationTool);
        }
        else {
            MeasureCommon.safeToggle(label, 'enable-hover', true);

            label.addEventListener('mousedown', function(event){ 
                event.canvasX = event.clientX;
                event.canvasY = event.clientY;
                this.calibrationTool.editEndpoint(event, name); 
            }.bind(this));

            label.addEventListener('mousewheel', this.viewer.toolController.mousewheel);
        }
    };

    proto.init = function() {

        MeasureCommon.createCommonOverlay(this.viewer, this.overlayName);
        
        if (!this.calibrationLabel) {
            this.calibrationLabel = document.createElement('div');
            this.calibrationLabel.className = 'calibration-label';
            this.hideLabel(this.calibrationLabel);
            this.viewer.container.appendChild(this.calibrationLabel);
            this.calibrationLabel.addEventListener('mousewheel', this.viewer.toolController.mousewheel);

            var text = document.createElement('div');
            text.className = 'calibration-label-text';
            this.calibrationLabel.appendChild(text);
        }

        this.endpoints = [];

        this.handleButtonUpBinded = this.calibrationTool.handleButtonUp.bind(this.calibrationTool);
        window.addEventListener('mouseup', this.handleButtonUpBinded);

        this.onCameraChangeBinded = this.onCameraChange.bind(this);
        this.viewer.addEventListener(av.CAMERA_CHANGE_EVENT, this.onCameraChangeBinded);
    };

    proto.destroy = function() {
        this.clear();

        ZhiUTech.Viewing.Extensions.Measure.Indicator.prototype.destroy.call(this);

        if (this.calibrationLabel) {
            this.calibrationLabel.removeEventListener('mousewheel', this.viewer.toolController.mousewheel);
            this.viewer.container.removeChild(this.calibrationLabel);
            this.calibrationLabel = null;
        }

        
        this.viewer.impl.clearOverlay(this.overlayName);
        this.viewer.impl.removeOverlayScene(this.overlayName);
        
        window.removeEventListener('mouseup', this.handleButtonUpBinded);
        this.viewer.removeEventListener(av.CAMERA_CHANGE_EVENT, this.onCameraChangeBinded);
    };

    proto.clearRubberband = function() {
        this.viewer.impl.clearOverlay(this.overlayName);
    };

    proto.clear = function() {

        this.clearRubberband();
        
        this.hideLabel(this.calibrationLabel);
        
        for (var name in this.endpoints) {
            if (this.endpoints.hasOwnProperty(name)) {
                this.hideClick(name);
                this.endpoints[name].position = null;
            }
        }
    };

    proto.updateLabelValue = function(text) {
        if (!text || text === "") {
            this.calibrationLabel.childNodes[0].textContent = null;
            this.hideLabel(this.calibrationLabel);
        }
        else {
            this.calibrationLabel.childNodes[0].setAttribute("data-i18n", text);
            this.calibrationLabel.childNodes[0].textContent = av.i18n.translate(text);
            this.showLabel(this.calibrationLabel);
            this.calibrationTool.render();
        }
    };

    proto.changeLabelClickableMode = function(clickable) {
        if (clickable) {
            this.calibrationLabel.childNodes[0].style.pointerEvents='all';
        }
        else {
            this.calibrationLabel.childNodes[0].style.pointerEvents='none';
        }
    };

    proto.showAddCalibrationLabel = function() {
        var self = this;
        this.updateLabelValue("Add Calibration");
        this.changeLabelClickableMode(true);
        this.calibrationTool.render();
        
        this.calibrationLabel.addEventListener("click", function onClick() {
            self.calibrationLabel.childNodes[0].style.pointerEvents = 'none';
            self.calibrationTool.render();
            self.updateLabelValue(null);
            self.calibrationTool.showPanel();
            self.calibrationLabel.removeEventListener("click", onClick);
        });    
    };

    proto.updateLabelsPosition = function() {
        for (var i = 1; i <= Object.keys(this.endpoints).length; i++) {
            if (this.endpoints[i].position) {
                var label = this.endpoints[i].label;
                var pos = MeasureCommon.project(this.endpoints[i].position, this.viewer, kEndpointOffset);
                label.style.left = (pos.x - parseInt(label.clientWidth) / 2) + 'px';
                label.style.top = (pos.y - parseInt(label.clientHeight) / 2) + 'px';
                label.point = this.endpoints[i].position;

                // Detect and move in case of overlapping.
                this.labelsOverlapDetection(this.endpoints[i].label, this.endpoints);
            }
        }

        this.hideLabelsOutsideOfView();
    };

    function isLeftIntersect(current, other) {
        return current.right >= other.left && current.right <= other.right;
    }

    function isRightIntersect(current, other) {
        return current.left >= other.left && current.left <= other.right;
    }

    function isMiddleIntersect(current, other) {
        return current.left <= other.left && current.right >= other.right;
    }

    function isVerticalIntersect(current, other) {
        return current.top < other.bottom && current.bottom > other.top;
    }

    function moveLeft(currentLabel, currentRect, otherRect) {
        currentLabel.style.left = parseInt(currentLabel.style.left, 10) - (currentRect.right - otherRect.left) + 'px';
    }

    function moveRight(currentLabel, currentRect, otherRect) {
        currentLabel.style.left = parseInt(currentLabel.style.left, 10) + (otherRect.right - currentRect.left) + 'px';
    }

    function moveDown(currentLabel, currentRect, otherRect) {
        currentLabel.style.top = parseInt(currentLabel.style.top, 10) + (otherRect.bottom - currentRect.top) + 'px';
    }


    proto.labelsOverlapDetection = function(staticLabel, labelsList) {

        for (var i = 1; i <= Object.keys(labelsList).length ; i++) {

            var dynamicLabel = labelsList[i].label;

            if (staticLabel !== dynamicLabel) {
                var staticRect = staticLabel.getBoundingClientRect();
                var dynamicRect = dynamicLabel.getBoundingClientRect();

                if (isVerticalIntersect(dynamicRect, staticRect)) {

                    if (isLeftIntersect(dynamicRect, staticRect)) {
                        moveLeft(dynamicLabel, dynamicRect, staticRect);
                    }
                    else if (isRightIntersect(dynamicRect, staticRect)) {
                        moveRight(dynamicLabel, dynamicRect, staticRect);
                    }
                    else if (isMiddleIntersect(dynamicRect, staticRect)) {
                        moveDown(dynamicLabel, dynamicRect, staticRect);
                    }
                }
            }
        }
    };

    proto.renderCalibrationLabel = function() {

        if (this.showMeasureResult && this.calibrationLabel && this.p1 && this.p2) {
            
            var point = { x: (this.p1.x + this.p2.x)/2, y: (this.p1.y + this.p2.y)/2, z: (this.p1.z + this.p2.z)/2 };
            var mid = MeasureCommon.project(point, this.viewer);

            this.labelPosition = new THREE.Vector2(mid.x, mid.y);

            if (this.calibrationLabel.childNodes[0].textContent) {
                this.showLabel(this.calibrationLabel);
            }

            this.calibrationLabel.style.top  = this.labelPosition.y - Math.floor(this.calibrationLabel.clientHeight / 2) + 'px';
            this.calibrationLabel.style.left = this.labelPosition.x - Math.floor(this.calibrationLabel.clientWidth / 2) + 'px' ;
            this.calibrationLabel.point = point;

            if (this.viewer.model.is2d()) {
                this.alignLabelWithLine(this.calibrationLabel, this.p1, this.p2, this.calibrationLabel.clientHeight, this.viewer);
            }
        }
    };

    proto.drawMeasurementLineTip = function(point, direction, normal, flip) {

        var tmpVec = new THREE.Vector3();
        var geometry = new THREE.Geometry();
        var p1Scale = this.setScale(point);

        flip = flip ? -1 : 1;

        var tipMaterial = (this.snapper.isSnapped() && !this.showMeasureResult) ? this.rubberbandSnappedMaterial : this.rubberbandTipMaterial;

        // black tip
        tmpVec.addVectors(point, normal.clone().multiplyScalar(kCrossLength * p1Scale));
        geometry.vertices[0] = tmpVec.clone();
        tmpVec.subVectors(point, normal.clone().multiplyScalar(kCrossLength * p1Scale));
        geometry.vertices[1] = tmpVec.clone();
        this.drawLineAsCylinder(geometry, tipMaterial, kCrossWidth, this.overlayName);

        geometry.vertices[0] = point;
        tmpVec.subVectors(point, direction.clone().multiplyScalar(kCrossLength * p1Scale * flip));
        geometry.vertices[1] = tmpVec.clone();
        this.drawLineAsCylinder(geometry, tipMaterial, kCrossWidth, this.overlayName);

        // yellow tip
        tmpVec.addVectors(point, normal.clone().multiplyScalar(kTipXLength * p1Scale));
        geometry.vertices[0] = tmpVec.clone();
        tmpVec.subVectors(point, normal.clone().multiplyScalar(kTipXLength * p1Scale));
        geometry.vertices[1] = tmpVec.clone();
        this.drawLineAsCylinder(geometry, this.rubberbandDefaultMaterial, kTipXWidth, this.overlayName);

        tmpVec.addVectors(point, normal.clone().multiplyScalar(kTipXLength * p1Scale));
        tmpVec.addVectors(tmpVec, direction.clone().multiplyScalar(kTipXLength * p1Scale));
        geometry.vertices[0] = tmpVec.clone();
        tmpVec.subVectors(point, normal.clone().multiplyScalar(kTipXLength * p1Scale));
        tmpVec.subVectors(tmpVec, direction.clone().multiplyScalar(kTipXLength * p1Scale));
        geometry.vertices[1] = tmpVec.clone();
        this.drawLineAsCylinder(geometry, this.rubberbandDefaultMaterial, kTipXWidth, this.overlayName);
    };

    proto.renderDistanceMeasurement = function(p1, p2) {

        this.viewer.impl.clearOverlay(this.overlayName);

        if (!p1 || !p2)
            return;

        var geometry = new THREE.Geometry();
        var lineDirection = new THREE.Vector3().subVectors(p2, p1).normalize();
        var lineNormal = lineDirection.clone().cross(this.viewer.navigation.getEyeVector()).normalize();
        var p1Scale = this.setScale(p1);
        
        var dashSize = kDashSize * p1Scale;
        var gapSize = kGapSize * p1Scale;

        // Main line
        
        var lineMaterial = ((Math.abs(p1.x - p2.x) <= 0.1 || Math.abs(p1.y - p2.y) <= 0.1 
                            || this.snapper.getSnapResult().isPerpendicular) && !this.showMeasureResult) 
                            ? this.rubberbandSnappedMaterial : this.rubberbandDefaultMaterial;

        if (this.showMeasureResult) {
            // Single solid line.
            geometry.vertices[0] = p1;
            geometry.vertices[1] = p2;
            this.drawLineAsCylinder(geometry, lineMaterial, kLineWidth, this.overlayName);
        }
        else {
            this.drawDashedLine(p1, p2, dashSize, gapSize, lineMaterial, kLineWidth, this.overlayName); 
        }
        
        this.drawMeasurementLineTip(p1, lineDirection, lineNormal, false);
        
        if (this.showMeasureResult) {
            this.drawMeasurementLineTip(p2, lineDirection, lineNormal, true);
        }

        this.p1 = p1;
        this.p2 = p2;

        this.renderCalibrationLabel();
    };

    proto.onCameraChange = function() {
        if (this.measurement.isComplete()) {
            this.renderDistanceMeasurement(this.p1, this.p2);
        }   
        this.updateLabelsPosition();         
    };

    ZhiUTech.Viewing.Extensions.Measure.CalibrationToolIndicator = CalibrationToolIndicator;

})();

ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.Measure');

//
// /** @constructor */
//
//
ZhiUTech.Viewing.Extensions.Measure.CalibrationTool = function( viewer, options, sharedMeasureConfig, snapper)
{   
    var av = ZhiUTech.Viewing;
    var avem = ZhiUTech.Viewing.Extensions.Measure;
    var MeasureCommon = ZhiUTech.Viewing.MeasureCommon;

    var _names  = ["calibration"];
    var _priority = 50;
    var _viewer  = viewer;
    var _measurement = new MeasureCommon.Measurement(MeasureCommon.MeasurementTypes.MEASUREMENT_DISTANCE);
    var _options = options || {};

    // Shared State with MeasureTool and Indicator
    var _sharedMeasureConfig = sharedMeasureConfig;

    var _maxPrecision = options.maxPrecision || 5;
    var _isCalibrated = (sharedMeasureConfig.calibrationFactor != null); // True when the user set the calibration, or used a Previous calibration factor.
    
    var _snapper = snapper;

    var _active = false;
    var _isDragging = false;
    var _isPressing = false;

    var _distance = null; // The length of the current measurement.
    var _calibrationTaken = false; // True when the user selected two valid points and set the calibration.
    var _selectedSize = null;
    var _selectedUnits = null;
    var _selectedP1 = null;
    var _selectedP2 = null;
    var _waitingForInput = false; // True when the user selected two valid points.
    var _picksBackup = [];
    var _cursorPosition = null;

    var _activePoint = 0;
    
    var _endpointMoved = false;

    var _consumeSingleClick = false;
    var _singleClickHandled = false;
    var _downX = null;
    var _downY = null;

    // GUI.
    var _calibrationPanel = null;
    var _cursor = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAYCAYAAAD+vg1LAAAAAXNSR0IArs4c6QAAAwZJREFUSA2tVEtLW0EUvjGJefoqSY0x0WBSiY+oNWiUINkU6ioLaaAlG1eudNVFoT+grgopiCkEIbUK1o0lusmurRSEWmmKG6MNtNhNosWqyU2CZPpN8cr15nFD7YHDzHnON2fOGYZhmHkw4XEW+wD4xkT4lMvl6CE0+Y2ohh+dz+cZn89HVS/5+n/d/wVMkXq9Xor2v5SBgsmymQwZHx+vOqlKpXKDXWI3eU6Tg+kqSjSh3W4/s9lsvzUajaNcAK3xY7Dyci3nd6WXSCS60dHRvMfjSRcKBfWV4SYbrVarB8p0PB5nY7HYmdVq/aDX67WlckpKKcvpOjs7X09OTvoPDw8z2Wy2Bu+imJqa+npycnJXGHOt3YRGoSyVSvvMZrNkYWFBs7GxkaoBAXFJcDJhcCW5rq5ur62trQ/EOhyOBhDT2Nj4qVKMqA31ve1yub7Rfufo/PycDA4OxpuamhqECaouhVqtfuD3+1tqa2uZQCCQDoVCWTwknVQDDvIKE1clI1ja09Ozg0cjx8fHpL+/P+50OhMU8f7+Punt7f2I5NdqXRXi9fV1z9jYWCuIWV5eziSTyWAqlXq1urqaw6AwOMiCG4lOYtEturu732xubhK0FQHSvfr6+lsog4HWPIPvIBqNErRiqCiwkkKpVFowZd8xZSQYDLImk+kJ52+xWJ4tLS3hU8yTkZGRBD2Ms4mu6Nun4XA4f3p6SoaGhuJ0+rgg/Bsmt9udYFmWzM3NZdDT05ztWsE5JV0R1AqUCfTt0fb2tjESiRRmZmaOUOcI3w9DY5mdnb03PDzMoDQ/MZFRzM20lO/E38vl8vt46UdAq0WNJWixlEwmu8B1bXioOxwjpgXJ0hMTE1og1qysrDghf+HnKtoD7c7u7i5ZXFzMGY3GF7iFuRR3dHTMr62tXWxtbZH29vZ3RYmECozu54ODAzpdP2hphHZOVigUVjChvgMDA+85fdm1q6vrrU6n+4WR9Zd1ujQ0Nzc/NBgMScSExXwZ2j5oL5Wo46UD/ZvxUemo+AdW1zJzUYr16wAAAABJRU5ErkJggg==), auto";
    var _hasUI = ZhiUTech.Viewing.Private.GuiViewer3D && viewer instanceof ZhiUTech.Viewing.Private.GuiViewer3D;

    var MeasureCommon = ZhiUTech.Viewing.MeasureCommon;
    avem.CALIBRATION_REQUIRED_EVENT = 'calibration-required';
    avem.OPEN_CALIBRATION_PANEL_EVENT = 'open-calibration-panel';
    avem.CLOSE_CALIBRATION_PANEL_EVENT = 'close-calibration-panel';
    avem.CLEAR_CALIBRATION_SIZE_EVENT = 'clear-calibration-size';

    function getActivePick()
    {
        switch (_activePoint) {
            case 0:
            case 1:
            case 2:
                return _measurement.getPick(_activePoint);
            case 3:
                return _measurement.getPick(_measurement.countPicks());
        }
    }

    function getPreviousPick()
    {
        switch (_activePoint) {
            case 0:
                return null;
            case 1:
                return _measurement.getPick(_measurement.countPicks());
            case 2:
            case 3:
                return _measurement.getPick(1);
        }
    }

    function hasPreviousPick()
    {
        switch (_activePoint) {
            case 0:
                return false;
            case 1:
                return _measurement.hasPick(_measurement.countPicks());
            case 2:
            case 3:
                return _measurement.hasPick(1);
        }
    }

    function noPicksSet() {
        _activePoint = 0;
    }

    function allPicksSet() {
        _activePoint = 3;
        _measurement.indicator.changeAllEndpointsEditableStyle(true);
    }

    function isNoPicksSet() {
        return _activePoint === 0;
    }

    function areAllPicksSet() {
        return _activePoint === 3;   
    }

    this.register = function()
    {
        if (_hasUI && !_calibrationPanel) {
            _calibrationPanel = new ZhiUTech.Viewing.Extensions.Measure.CalibrationPanel( this, _viewer, "calibration-panel", "Calibration", _options );
            _viewer.addPanel(_calibrationPanel);
        }

        this.onCameraChangeBinded = this.onCameraChange.bind(this);
        this.screenSizeChangedBinded = this.screenSizeChanged.bind(this);
    };

    this.deregister = function()
    {   
        this.deactivate();
        
        if (_calibrationPanel) {
            _viewer.removePanel( _calibrationPanel );
            _calibrationPanel.uninitialize();
            _calibrationPanel = null;
        }
    };

    this.isActive = function()
    {
        return _active;
    };

    this.getNames = function()
    {
        return _names;
    };

    this.getName = function()
    {
        return _names[0];
    };

    this.getPriority = function()
    {
        return _priority;
    };

    this.getCursor = function() {
        return _isDragging ? null : _cursor;
    };

    this.activate = function()
    {
        _active = true;
        _isDragging = false;
        this.isEditingEndpoint = false;
        this.editByDrag = false;
        noPicksSet();

        _viewer.toolController.activateTool(_snapper.getName());
        _viewer.toolController.activateTool("magnifyingGlass");


        if (!_measurement.indicator) {
            _measurement.attachIndicator(_viewer, this, avem.CalibrationToolIndicator);
        }

        _measurement.indicator.clear();

        if (_calibrationTaken && _selectedP1 && _selectedP2) {
            _measurement.setPick(1, _selectedP1.clone());
            _measurement.setPick(2, _selectedP2.clone());

            allPicksSet();

            var parsedRequestedSize = ZhiUTech.Viewing.Private.UnitParser.parsePositiveNumber(_selectedSize, _selectedUnits);
            _measurement.indicator.updateLabelValue(ZhiUTech.Viewing.Private.formatValueWithUnits(parsedRequestedSize, _selectedUnits, 3, _sharedMeasureConfig.precision));
            _distance = _measurement.distanceXYZ;
            _measurement.indicator.changeLabelClickableMode(false);
            _waitingForInput = true;
            var valid = this.render();
            _measurement.indicator.changeAllEndpointsEditableStyle(true);

            if (valid) {
                if (_calibrationPanel) {
                    _calibrationPanel.setPanelValue(_selectedSize);
                }
                
                this.showPanel();
            }
        }

        _viewer.addEventListener(ZhiUTech.Viewing.CAMERA_CHANGE_EVENT, this.onCameraChangeBinded);
        _viewer.addEventListener(ZhiUTech.Viewing.VIEWER_RESIZE_EVENT, this.screenSizeChangedBinded);
    };

    this.deactivate = function()
    {   
        if (!_active)
            return;

        _active = false;

        this.hidePanel();
        this.updateViewportId(true);
        _waitingForInput = false;
        _measurement.clearAllPicks();

        if(_snapper && _snapper.isActive()) {
            _viewer.toolController.deactivateTool(_snapper.getName());
        }

        _viewer.toolController.deactivateTool("magnifyingGlass");

        if (_measurement.indicator) {
            _measurement.indicator.clear();
            _measurement.indicator.destroy();
            _measurement.indicator = null;
        }

        _viewer.removeEventListener(ZhiUTech.Viewing.CAMERA_CHANGE_EVENT, this.onCameraChangeBinded);
        _viewer.removeEventListener(ZhiUTech.Viewing.VIEWER_RESIZE_EVENT, this.screenSizeChangedBinded);
    };

    this.getActivePointIndex = function() {
        return _activePoint;
    };

    this.setCalibrationFactor = function ( calibrationFactor ) {
        _sharedMeasureConfig.calibrationFactor = calibrationFactor;
    };

    this.getCalibrationFactor = function () {
        return _sharedMeasureConfig.calibrationFactor;
    };

    this.updateLabelValue = function (value) {
        _measurement.indicator.updateLabelValue(value);
    };

    this.isCalibrationValid = function(requestedUnits, requestedSize) { 
        var parsedRequestedSize = ZhiUTech.Viewing.Private.UnitParser.parsePositiveNumber(requestedSize, requestedUnits); 
        return !isNaN(parsedRequestedSize); 
    };

    this.calibrate = function(requestedUnits, requestedSize)
    {

        var calibrationFactor = null;
        
        var parsedRequestedSize = ZhiUTech.Viewing.Private.UnitParser.parsePositiveNumber(requestedSize, requestedUnits);

        if (!isNaN(parsedRequestedSize)) {
            var currentSize = ZhiUTech.Viewing.Private.convertUnits(_viewer.model.getUnitString(), requestedUnits, 1, _distance);
            if (currentSize !== 0 && !isNaN(currentSize)) {
                calibrationFactor = parsedRequestedSize / currentSize;
                _sharedMeasureConfig.calibrationFactor = calibrationFactor;
                _sharedMeasureConfig.units = requestedUnits;
                var defualtPrecision = _viewer.model.is2d() ? 3 : 1;
                var requestedPrecision = ZhiUTech.Viewing.Private.calculatePrecision(requestedSize);
                _sharedMeasureConfig.precision = Math.max((_sharedMeasureConfig.precision ? _sharedMeasureConfig.precision : defualtPrecision), requestedPrecision);
                _selectedSize = requestedSize;
                _selectedUnits = requestedUnits;
                _isCalibrated = true;
                _calibrationTaken = true;
                _selectedP1 = _measurement.getPick(1).clone();
                _selectedP2 = _measurement.getPick(2).clone();
            }
        }
        
        if (calibrationFactor) {
            _viewer.getExtension('ZhiUTech.Measure').enableCalibrationTool(false);
            _viewer.dispatchEvent({ type: 'finished-calibration' });
        }
    };

    this.calibrateByScale = function(requestedUnits, requestedScale) {
        _sharedMeasureConfig.calibrationFactor = requestedScale;
        
        if (_sharedMeasureConfig.units !== requestedUnits ) {
            _sharedMeasureConfig.units = requestedUnits;
            _selectedUnits = requestedUnits;
        }

        _isCalibrated = true;
    };

    this.getCurrentUnits = function () {
        return _sharedMeasureConfig.units;
    };

    this.hidePanel = function() {
        if (_calibrationPanel) {
            _calibrationPanel.setVisible(false);
        }
        else {
            _viewer.dispatchEvent({ type: avem.CLOSE_CALIBRATION_PANEL_EVENT });
        }
    };

    this.showPanel = function() {

        var self = this;

        if (_calibrationPanel) {
            window.setTimeout(function () { _calibrationPanel.requestedSizeTextbox.focus();}, 0);
            _calibrationPanel.setVisible(true);
            _calibrationPanel.updatePanelPosition(_measurement.indicator.labelPosition, _measurement.indicator.p1, _measurement.indicator.p2, _measurement.indicator.calibrationLabel.clientHeight);
            window.addEventListener("keyup", function onKeyUp(e){
                var key = e.key || String.fromCharCode(e.keyCode);
                if (key == "Escape" && self.isActive()) {
                    self.hidePanel();
                    self.clearSize();
                    self.showAddCalibrationLabel();
                    
                    window.removeEventListener("keyup", onKeyUp);
                }
            });
        }
        else {
            _viewer.dispatchEvent({ type: avem.OPEN_CALIBRATION_PANEL_EVENT, data: {size: _selectedSize, units: _selectedUnits } });
        }
    };

    this.showAddCalibrationLabel = function() {
        _measurement.indicator.showAddCalibrationLabel();
    };

    this.isCalibrated = function() {
        return _isCalibrated;
    };

    this.clearSize = function () {
        _measurement.indicator.updateLabelValue(null);

        if (_calibrationPanel) {
            _calibrationPanel.requestedSizeTextbox.value = "";   
        }
        else {
            _viewer.dispatchEvent({ type: avem.CLEAR_CALIBRATION_SIZE_EVENT });
        }
    };

    this.getMaxPrecision = function() {
        return _maxPrecision;
    };
    
    this.clearMeasurement = function() {

        noPicksSet();

        this.clearPick(1);
        this.clearPick(2);

        _measurement.indicator.clear();
        
        this.updateViewportId(true);
        this.hidePanel();

        _waitingForInput = false;
    };

    this.clearPick = function(pickNumber) {
        if (_measurement.hasPick(pickNumber)) {
            _measurement.clearPick(pickNumber);
            _measurement.indicator.hideClick(pickNumber);
        }
    };

    this.repickEndpoint = function(pickNumber) {
        this.clearPick(pickNumber);
        this.editEndpoint(null, pickNumber);
    };

    this.getSnapper = function() {
        return _snapper;
    };

    this._handleMouseEvent = function (event) {

        var valid = false;

        if (_snapper.isSnapped()) {

            // User picked a new point after two points where already set (or none) - Start a new measurement.
            if (areAllPicksSet() || isNoPicksSet()) {
                this.clearMeasurement();
                _activePoint = 1;
            }
            
            _snapper.copyResults(getActivePick());

            valid = true;

        } 
        else { 
            // In order to draw rubber-band, set the cursor position, so the indicator will use it as active point.
            if (event && _viewer.model.is2d()) {
                var viewport = _viewer.container.getBoundingClientRect();
                var x = event.canvasX || event.clientX - viewport.left;
                var y = event.canvasY || event.clientY - viewport.top;

                if (x && y) {
                    _cursorPosition = MeasureCommon.inverseProject({ x:x, y:y }, _viewer);
                }
            }

            // In case a measurement is set, and the user clicks on a blank spot - don't do nothing.
            if (_consumeSingleClick && _measurement && !this.isEditingEndpoint) {
                if (_activePoint === _measurement.getMaxNumberOfPicks() + 1) {
                    return true;
                }
            }

            var lastPick = getActivePick();
            if (lastPick) {
                lastPick.clear();
            }
        }

        this.correctPickPosition();

        if (_consumeSingleClick) {
            this._doConsumeSingleClick(valid);
        }
        
        if (!isNoPicksSet()) {
            var renderSucceeded = this.render();

            // If it's the first pick, we don't expect the render of the rubberband to be succeeded.
            // So enter here only if it's not the first pick.
            if (_measurement.hasPick(2)) {
                valid &= renderSucceeded;
            }
        }

        if (_consumeSingleClick) {
            if (_measurement.isComplete() && valid) {
                _distance = _measurement.distanceXYZ;
                this.clearSize();
                this.showPanel();
                _waitingForInput = true;
            }
            else {
                this.hidePanel();
                _measurement.indicator.updateLabelValue(null);
                _waitingForInput = false;
            }
        }

        // If valid is false, the last pick is not revelant, and will clear it in case of a click.
        return valid;
    };

    this.updateViewportId = function(clear) {
        if (_viewer.model && _viewer.model.is2d()) {
            if (clear || isNoPicksSet()) {
                viewer.impl.updateViewportId(0);
                _snapper.setViewportId(null);
            }
            else if (!_isPressing) {
                var viewport = getPreviousPick().viewportIndex2d || getActivePick().viewportIndex2d;
                
                // Pass viewport Id to LineShader to make all other geometries with different viewport transparent
                viewer.impl.updateViewportId(viewport);
                if (_snapper)
                    _snapper.setViewportId(viewport);  
            
            }
        }
    };

    this._doConsumeSingleClick = function(valid) {

        this.updateViewportId(_measurement.isComplete());

        _measurement.indicator.clear();
    };


    this.handleButtonDown = function (event, button) {
        if (av.isMobileDevice()) 
            return false;

        _isDragging = true;
        if (button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
            _consumeSingleClick = true;
            _downX = event.canvasX;
            _downY = event.canvasY;
        }
        return false;
    };

    this.handleMouseMove = function (event) {
        if (av.isMobileDevice())
            return false;

        if (event.canvasX !== _downX || event.canvasY !== _downY) {
            _consumeSingleClick = false;    
        }

        _endpointMoved = this.isEditingEndpoint;    

        if (!isNoPicksSet() && !areAllPicksSet()) {
            this.clearPick(_activePoint);
            this._handleMouseEvent(event);
        }

        _snapper.indicator.render();
        
        return false;
    };

    this.restoreMouseListeners = function () {

        // When a press event has happend, the default behavior of firefly.js is to disable other mouse events,
        // So they won't be triggered as well.
        // The solution is to enable them after the end of the pressing.

        _viewer.toolController.getTool("gestures").controller.enableMouseButtons(true);
    };

    this.handlePressHold = function (event) {
        _consumeSingleClick = false;

        if (av.isMobileDevice()) {
            switch( event.type )
            {
                case "press":
                    _isPressing = true;
                    if (areAllPicksSet()) {
                        this.clearMeasurement();
                    } else {
                        this.clearPick(_activePoint);
                    }
                    this._handleMouseEvent(event);
                    _snapper.indicator.render();

                    return true;

                case "pressup":
                    _consumeSingleClick = true;
                    this.restoreMouseListeners();
                    _singleClickHandled = !_singleClickHandled;
                    this.handleSingleClick(event);
                    _isPressing = false;
                    return true;
            }
        }
        return false;

    };

    this.correctPickPosition = function() {
        
        var active = getActivePick();
            
        if (!active.getGeometry() && _cursorPosition) {
            active.geomType = MeasureCommon.SnapType.SNAP_VERTEX;
            active.geomVertex = _cursorPosition;
            active.intersectPoint = _cursorPosition;
        }

        if (hasPreviousPick()) {
            var passive = getPreviousPick();
            MeasureCommon.correctPerpendicularPicks(passive, active, viewer, _snapper);
        }
    };

    this.render = function() {

        var hasResult = _measurement.computeResult(_measurement.picks, _viewer, _snapper);
        _measurement.indicator.render(_measurement.picks, _consumeSingleClick || _waitingForInput);

        return hasResult;
    };

    this.editEndpoint = function(event, endpointNumber) {
        if (_activePoint === endpointNumber) {
            _measurement.indicator.changeEndpointOnEditStyle(endpointNumber, false);
            this.undoEditEndpoint();
            return;
        }

        _activePoint = endpointNumber;
        this.isEditingEndpoint = true;

        _measurement.indicator.changeEndpointOnEditStyle(endpointNumber, true);
        _measurement.indicator.changeAllEndpointsEditableStyle(false);

        for (var key in _measurement.picks) {
            if (_measurement.picks.hasOwnProperty(key)) {
                _picksBackup[key] = _measurement.getPick(key).clone();
            }
        }

        this.updateViewportId();

        this.hidePanel();
        _measurement.indicator.updateLabelValue(null);
        _waitingForInput = false;

        if(!av.isMobileDevice()) {
            this._handleMouseEvent(event);
        }
    };

    this.undoEditEndpoint = function() {
        _measurement.indicator.clear();

        for (var key in _measurement.picks) {
            if (_measurement.picks.hasOwnProperty(key)) {
                _measurement.setPick(key, _picksBackup[key].clone());
            }
        }
        
        this.updateViewportId(true);
        this.isEditingEndpoint = false;
        _waitingForInput = true;

        allPicksSet();
        var valid = this.render();
        
        if (valid) {
            this.showPanel();
        }
    };

    this.handleGesture = function(event)
    {   
        if (av.isMobileDevice()){
            
            _consumeSingleClick = false;
        
            if (_isPressing) {
                
                this.clearPick(_activePoint);

                switch( event.type )
                {
                    case "dragstart":
                        this._handleMouseEvent(event);
                        _snapper.indicator.render();

                        return true;

                    case "dragmove":
                        this._handleMouseEvent(event);
                        _snapper.indicator.render();

                        return true;

                    case "dragend":
                        _isPressing = false;
                        _consumeSingleClick = true;

                        if (!this.editByDrag) {
                            _singleClickHandled = !_singleClickHandled;
                            this.handleSingleClick(event);    
                        }

                        this.editByDrag = false;
                        this.restoreMouseListeners();
                        return true;

                    case "pinchend":
                        _consumeSingleClick = true;
                        _singleClickHandled = !_singleClickHandled;
                        this.handleSingleClick(event);
                        this.restoreMouseListeners();
                        return true;
                }
            }
        }

        return false;
    };

    this.handleButtonUp = function (event) {
        _isDragging = false;
        _downX = null;
        _downY = null;
        
        if (_endpointMoved) {
            _consumeSingleClick = true;
            _singleClickHandled = !_singleClickHandled;
            this.handleSingleClick(event);
            _endpointMoved = false;
        }

        return false;
    };

    this.handleSingleClick = function (event) {
        if (_consumeSingleClick) {
            
            _snapper.indicator.clearOverlays();

            _measurement.indicator.changeEndpointOnEditStyle(_activePoint, false);

            if (this._handleMouseEvent(event)) {
                _measurement.indicator.showEndpoints();
                _measurement.indicator.updateLabelsPosition();
                _activePoint++;
            }
            else {
                if (this.isEditingEndpoint) {
                    this.undoEditEndpoint();
                }
                else {
                    this.clearMeasurement();
                }
            }

            if (_measurement.isComplete()) {
                allPicksSet();
            }

            _consumeSingleClick = false;
            _singleClickHandled = !_singleClickHandled;
            this.isEditingEndpoint = false;

            _snapper.clearSnapped();
        }
        return true;
    };

    this.handleDoubleClick = function() {
        return true;
    };

    this.handleSingleTap = function (event) {
        if (!_singleClickHandled) {
            _consumeSingleClick = true;
            _snapper.onMouseDown({x: event.canvasX, y:event.canvasY});
            this.handleSingleClick(event);
        }
        _singleClickHandled = !_singleClickHandled;

        return true;
    };

    this.handleDoubleTap = function() {
        return true;
    };

    this.handleResize = function() {
        if (_measurement.indicator) {
            _measurement.indicator.handleResize();
        }
    };

    this.onCameraChange = function() {
        if (_snapper.indicator) {
            _snapper.indicator.onCameraChange();
        }
    };

    this.screenSizeChanged = function(event) {
        this.onCameraChange();
    };
};


(function() {

    "use strict";

    var avem = ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.Measure'),
        av = ZhiUTech.Viewing,
        ave = ZhiUTech.Viewing.Extensions,
        zvp = ZhiUTech.Viewing.Private,
        avu = ZhiUTech.Viewing.UI,
        MeasureCommon = ZhiUTech.Viewing.MeasureCommon;

    //
    // /** @constructor */
    //
    //
    var CalibrationPanel = function(calibrationTool, viewer, id, title, options)
    {
        var self = this;

        options = options || {};
        options.addFooter = false;

        avu.DockingPanel.call(this, viewer.container, id, title, options);

        this.viewer = viewer;
        this.calibrationTool = calibrationTool;
        this.parentContainer = viewer.container;
        this.container.style.left = '0px';
        this.container.style.top = '0px';
        this.container.style.resize = 'none';

        this.container.classList.add('calibration-panel');

        this.addEventListener( this.closer, "click", function(e) {
            self.setVisible(false);
            self.calibrationTool.clearSize();
            self.calibrationTool.showAddCalibrationLabel();
        });

        if (!options.heightAdjustment)
            options.heightAdjustment = 50;
        if (!options.marginTop)
            options.marginTop = 0;
        options.left = false;

        this.createScrollContainer(options);

        this.calibrationMenu = document.createElement("div");

        this.scrollContainer.appendChild( this.calibrationMenu );

        // Table
        this.table = document.createElement("table");
        this.table.className = "zu-lmv-tftable calibration-table";
        this.tbody = document.createElement("tbody");
        this.table.appendChild(this.tbody);
        this.calibrationMenu.appendChild(this.table);

        // Define Size Row
        this.row = this.tbody.insertRow(0);
        this.requestedSizeTextbox = document.createElement('input');
        this.requestedSizeTextbox.className = 'docking-panel-textbox';
        this.requestedSizeTextbox.type = 'text';
        this.requestedSizeTextbox.autofocus= 'true';

        this.addEventListener(this.requestedSizeTextbox, "keyup", function(e) {
            var value = self.requestedSizeTextbox.value;
            if (value !== "" && value.split(".")[0] === "") {
                self.requestedSizeTextbox.value = "0" + value;
            }
            self.updateLabel();
        });


        this.addEventListener(this.requestedSizeTextbox, "keypress", function(e) {
            var key = e.key || String.fromCharCode(e.keyCode);
            // Handling backspace and arrows for firefox
            if (key == "Backspace" || key == "ArrowLeft" || key == "ArrowRight"){
                return;
            }

            // Escape (For IE11)
            if (e.keyCode == av.KeyCode.ESCAPE) {
                self.setVisible(false);
                self.calibrationTool.clearSize();
                self.calibrationTool.showAddCalibrationLabel();
                return;
            }

            var requestedSize = self.requestedSizeTextbox.value;
            var cursorIndex = self.requestedSizeTextbox.selectionStart;
            requestedSize = [requestedSize.slice(0, cursorIndex), key, requestedSize.slice(cursorIndex)].join('');
            
            if (requestedSize == ".") {
                return;
            }

            var isSimple = self.units[self.unitList.selectedIndex].simpleInput;
        
            if (!isPositiveNumber(requestedSize) || (isSimple && (!isSimpleDecimal(requestedSize) || ZhiUTech.Viewing.Private.calculatePrecision(requestedSize) > self.calibrationTool.getMaxPrecision()))) {
                 e.preventDefault();
            }
        });

        var caption = "Define Size";
        var cell = this.row.insertCell(0);
        this.caption = document.createElement("div");
        this.caption.setAttribute("data-i18n", caption);
        this.caption.textContent = av.i18n.translate(caption);
        cell.appendChild(this.caption);

        cell = this.row.insertCell(1);
        cell.appendChild(this.requestedSizeTextbox);

        // Unit Type Row
        this.units = [
            { name: 'Feet and fractional inches', units: 'ft-and-fractional-in', matches: ['ft-and-fractional-in'], simpleInput: false },
            { name: 'Feet and decimal inches', units: 'ft-and-decimal-in', matches: ['ft-and-decimal-in'], simpleInput: false },
            { name: 'Meters', units: 'm', matches: ['m'], simpleInput: true },
            { name: 'Centimeters', units: 'cm', matches: ['cm'], simpleInput: true },
            { name: 'Millimeters', units: 'mm', matches: ['mm'], simpleInput: true }
        ];

        var unitNames = [];
        for (var i = 0; i < this.units.length; ++i) {
            unitNames.push(this.units[i].name);
        }
        this.unitList = new zvp.OptionDropDown("Unit type", this.tbody, unitNames, 0);
        this.addEventListener(this.unitList, "change", function(e) {
            self.updateLabel();
        });

        // Set Calibration button
        var setCalibration = document.createElement('div');
        setCalibration.classList.add('docking-panel-primary-button');
        setCalibration.classList.add('calibration-button');

        setCalibration.setAttribute("data-i18n", "Set Calibration");
        setCalibration.textContent = av.i18n.translate("Set Calibration");

        setCalibration.addEventListener('click', function () {
            var index = self.unitList.selectedIndex;
            var requestedUnits = self.units[index].units;
            self.calibrationTool.calibrate(requestedUnits, self.requestedSizeTextbox.value);
        }, false);

        this.calibrationMenu.appendChild(setCalibration);
        

    }; // end constructor

    var isPositiveNumber = function (n) {
        // The first character of the string has to be a digit.
        return n.match(/^(\d+)/);
    };

    var isSimpleDecimal = function (n) {
        // Add "0" to the end of the string, to check if there are trailing spaces.
        n += '0';
        return !isNaN(parseFloat(n)) && !isNaN(+n) && parseFloat(n) >= 0;
    };

    CalibrationPanel.prototype = Object.create(avu.DockingPanel.prototype);
    ave.ViewerPanelMixin.call(CalibrationPanel.prototype);


    CalibrationPanel.prototype.uninitialize = function uninitialize() {
        this.viewer = null;
        avu.DockingPanel.prototype.uninitialize.call(this);
    };

    CalibrationPanel.prototype.findUnits = function findUnits() {
        var i,
            j,
            selectedUnits = this.calibrationTool.getCurrentUnits();
        for (i = 0; i < this.units.length; ++i) {
            var matches = this.units[i].matches;
            if (matches) {
                for (j = 0; j < matches.length; ++j) {
                    if (matches[j] === selectedUnits) {
                        return i;
                    }
                }
            }
        }
        return 0;
    };

    CalibrationPanel.prototype.setPanelValue = function(size) {
        this.unitList.setSelectedIndex(this.findUnits());
        this.requestedSizeTextbox.value = size;
    };

    CalibrationPanel.prototype.updateLabel = function() {
        var index = this.unitList.selectedIndex;
        var requestedUnits = this.units[index].units;
        var size = this.requestedSizeTextbox.value;
        var parsedNumber = ZhiUTech.Viewing.Private.UnitParser.parsePositiveNumber(size, requestedUnits);
        var text = ZhiUTech.Viewing.Private.formatValueWithUnits(parsedNumber, requestedUnits, 3, ZhiUTech.Viewing.Private.calculatePrecision(size));

        if (size === "") {
            this.calibrationTool.updateLabelValue(null);
        } else if (!isNaN(parsedNumber)) {
            this.calibrationTool.updateLabelValue(text);
        }
    };

    CalibrationPanel.prototype.updatePanelPosition = function (labelPosition, p1, p2, labelOffset) {

        var width = parseInt(this.container.getBoundingClientRect().width);
        var height = parseInt(this.container.getBoundingClientRect().height);

        var cornerX;
        var cornerY;

        if (!labelPosition || !p1 || !p2) {
            cornerX = Math.floor((this.viewer.canvas.clientWidth - width) / 2);
            cornerY = Math.floor((this.viewer.canvas.clientHeight - height) / 2);
        }
        else {
            p1 = MeasureCommon.project(p1, this.viewer);
            p2 = MeasureCommon.project(p2, this.viewer);
            var rubberbandDirection = new THREE.Vector2().copy(p1).sub(p2).normalize();

            var normal;
            if (p1.x < p2.x) {
                normal = new THREE.Vector2(rubberbandDirection.y, -rubberbandDirection.x);
            } else {
                normal = new THREE.Vector2(-rubberbandDirection.y, rubberbandDirection.x);
            }

            var offset = labelOffset + Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;

            normal = normal.multiplyScalar(offset);
            var pos =  labelPosition.sub(normal);

            cornerX = pos.x - Math.floor(width / 2);
            cornerY = pos.y - Math.floor(height / 2);

            // if panel exceeds screen bounds, just put the panel in the center of the screen.
            if ((cornerX < 0) || (cornerX + width > this.viewer.canvas.clientWidth) || (cornerY < 0) || (cornerY + height > this.viewer.canvas.clientHeight)) {
                cornerX = Math.floor((this.viewer.canvas.clientWidth - width) / 2);
                cornerY = Math.floor((this.viewer.canvas.clientHeight - height) / 2);
            }
        }

        this.container.style.left = cornerX + 'px';
        this.container.style.top  = cornerY + 'px';
    };

    //
    // /** @constructor */
    //
    //
    var CalibrationRequiredDialog = function(measureExt, viewer, id, title, options)
    {
        var self = this;

        options = options || {};
        options.addFooter = false;

        avu.DockingPanel.call(this, viewer.container, id, title, options);

        this.viewer = viewer;
        this.measureExt = measureExt;
        this.parentContainer = viewer.container;
        this.container.classList.add('calibration-panel');
        this.container.style.width = "380px";
        this.container.style.height = "190px";
        
        if (!options.heightAdjustment)
            options.heightAdjustment = 70;
        if (!options.marginTop)
            options.marginTop = 0;
        options.left = false;

        this.createScrollContainer(options);
        this.dialogBox = document.createElement("div");
        this.scrollContainer.appendChild( this.dialogBox );

        // text
        var calibrateNow = document.createElement('div');
        calibrateNow.className = 'calibration-text';
        var text = "Calibration Message";
        calibrateNow.setAttribute("data-i18n", text);
        calibrateNow.textContent = av.i18n.translate(text);
        this.dialogBox.appendChild(calibrateNow);

        var buttonsWrapper = document.createElement('div');
        buttonsWrapper.className = 'calibration-buttons-wrapper';
        this.dialogBox.appendChild(buttonsWrapper);
        
        // Cancel button
        var cancel = document.createElement('div');
        cancel.classList.add('docking-panel-secondary-button');
        cancel.classList.add('calibration-button-left');
        cancel.setAttribute("data-i18n", "Cancel");
        cancel.textContent = av.i18n.translate("Cancel");
        cancel.addEventListener('click', function () {
            self.setVisible(false);
        }, false);
        buttonsWrapper.appendChild(cancel);

        // Calibrate-Now button
        var calibrateNowButton = document.createElement('div');
        calibrateNowButton.classList.add('docking-panel-primary-button');
        calibrateNowButton.classList.add('calibration-button-right');
        calibrateNowButton.setAttribute("data-i18n", "Calibrate Now");
        calibrateNowButton.textContent = av.i18n.translate("Calibrate Now");
        calibrateNowButton.addEventListener('click', function () {
            self.measureExt.enableCalibrationTool(true);
            self.setVisible(false);
        }, false);
        buttonsWrapper.appendChild(calibrateNowButton);
        

    }; // end constructor

    CalibrationRequiredDialog.prototype = Object.create(avu.DockingPanel.prototype);
    ave.ViewerPanelMixin.call(CalibrationRequiredDialog.prototype);


    CalibrationRequiredDialog.prototype.uninitialize = function uninitialize() {
        this.viewer = null;
        avu.DockingPanel.prototype.uninitialize.call(this);
    };

    avem.CalibrationPanel = CalibrationPanel;
    avem.CalibrationRequiredDialog = CalibrationRequiredDialog;

})();

ZhiUTechNamespace('ZhiUTech.Viewing.Extensions.Measure');

ZhiUTech.Viewing.Extensions.Measure.MagnifyingGlass = function(viewer) {

    var _viewer = viewer;
    var _active = false;
    var _names = ["magnifyingGlass"];
    var _priority = 70;
    var _isPressing = false;
    var _radius = 60;
    var _zoom = 2;
    var _offset = 15;
    var _magnifyingGlassCanvas = null;
    var _imageData = null;
    var _imageBuffer = null;
    var _clientX = null;
    var _clientY = null;
    var _needsClear = false;

    this.isActive = function() {

        return _active;
    };

    this.activate = function() {

        _active = true;
        this.updateMagnifyingGlassBinded = this.updateMagnifyingGlass.bind(this);
    };

    this.updateMagnifyingGlass = function() {
        if (_needsClear) {
            _magnifyingGlassCanvas && _magnifyingGlassCanvas.classList.remove('visible');
            _needsClear = false;
        }
        else {
            var pixelRatio = window.devicePixelRatio;
            var diameter = 2 * _radius;
            var normlizedDiameter = diameter * pixelRatio;
            var x = pixelRatio * (_clientX - (_radius  / _zoom));
            var y = pixelRatio * (_clientY - (_radius  / _zoom));
            
            if (!_magnifyingGlassCanvas) {
                _magnifyingGlassCanvas = document.createElement("canvas");
                _magnifyingGlassCanvas.className = 'magnifying-glass';
                _magnifyingGlassCanvas.width = normlizedDiameter;
                _magnifyingGlassCanvas.height = normlizedDiameter;
                _magnifyingGlassCanvas.style.width = diameter + 'px';
                _magnifyingGlassCanvas.style.height = diameter + 'px';

                // Swap canvas
                _magnifyingGlassCanvas.getContext("2d").translate(0, normlizedDiameter);
                _magnifyingGlassCanvas.getContext("2d").scale(1,-1);

                _viewer.container.appendChild(_magnifyingGlassCanvas);
                _imageData = new ImageData(Math.ceil(normlizedDiameter / _zoom), Math.ceil(normlizedDiameter / _zoom));
                _imageBuffer = new Uint8Array(_imageData.data.buffer);
            }

            var ctx = _magnifyingGlassCanvas.getContext("2d");
            
            // Read the pixels from the frame buffer
            var gl = _viewer.canvas.getContext("webgl");
            gl.readPixels(x, _viewer.canvas.height - y - _imageData.height, _imageData.width, _imageData.height, gl.RGBA, gl.UNSIGNED_BYTE, _imageBuffer);
            // Put the pixel into the magnifying context.
            ctx.putImageData(_imageData, 0, 0);
            // Scale the image
            ctx.drawImage(_magnifyingGlassCanvas, 0, 0, _imageData.width, _imageData.height, 0, 0, normlizedDiameter, normlizedDiameter);
            this.setGlassPosition(_magnifyingGlassCanvas, _clientX, _clientY, diameter, _offset); 

            _magnifyingGlassCanvas.classList.toggle('visible', true);
        }

        _viewer.removeEventListener(ZhiUTech.Viewing.RENDER_PRESENTED_EVENT, this.updateMagnifyingGlassBinded);
    };

    this.deactivate = function() {

        _active = false;
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

    this.setGlassPosition = function(canvas, x, y, diameter, offset) {
            
        // check the left border of canvas
        canvas.style.left = (x - diameter/2) + 'px';

        // check the top border of canvas
        if (y - diameter - offset > 0) {
            canvas.style.top  = (y - diameter - offset) + 'px';    
        }
        else {
            canvas.style.top = (y + offset) + 'px';    
        }
    };

    this.requestUpdate = function() {
        if(!_viewer.hasEventListener(ZhiUTech.Viewing.RENDER_PRESENTED_EVENT, this.updateMagnifyingGlassBinded)) {
            _viewer.addEventListener(ZhiUTech.Viewing.RENDER_PRESENTED_EVENT, this.updateMagnifyingGlassBinded);
        }
    };

    this.drawMagnifyingGlass = function(clientX, clientY) {
        _clientX = clientX;
        _clientY = clientY;
        _viewer.impl.invalidate(false, false, true);
        this.requestUpdate();
    };

    this.clearMagnifyingGlass = function () {
        _needsClear = true;
        this.requestUpdate();
    };

    this.handlePressHold = function (event) {

        if (av.isMobileDevice()) {
            switch( event.type )
            {
                case "press":
                    _isPressing = true;
                    this.drawMagnifyingGlass(event.canvasX, event.canvasY);
                    break;

                case "pressup":
                    this.clearMagnifyingGlass();
                    _isPressing = false;
                    break;
            }
        }
        return false;

    };

    this.handleGesture = function(event) {

        if (_isPressing && av.isMobileDevice()) {
            switch( event.type )
            {
                case "dragstart":
                    this.drawMagnifyingGlass(event.canvasX, event.canvasY);
                    break;

                case "dragmove":
                    this.drawMagnifyingGlass(event.canvasX, event.canvasY);
                    break;

                case "dragend":
                    this.clearMagnifyingGlass();
                    _isPressing = false;
                    break;

                case "pinchstart":
                    this.drawMagnifyingGlass(event.canvasX, event.canvasY);
                    break;

                case "pinchmove":
                    this.drawMagnifyingGlass(event.canvasX, event.canvasY);
                    break;

                case "pinchend":
                    this.clearMagnifyingGlass();
                    break;
            }
        }

        return false;
    };

    this.handleMouseMove = function (event) {
        return false;
    };

    this.handleWheelInput = function (delta) {
        return false;
    };

    this.handleButtonUp = function (event, button) {
        return false;
    };

};

(function(){ 'use strict';

    var av = ZhiUTech.Viewing;
    var avu = ZhiUTech.Viewing.UI;
    var zvp = ZhiUTech.Viewing.Private;
    var MeasureCommon = ZhiUTech.Viewing.MeasureCommon;

    // /** @constructor */
    function MeasureToolbar(measureExtension)
    {
        this.measureExtension = measureExtension;
        this.measureTool = this.measureExtension.measureTool;
        this.viewer = this.measureExtension.viewer;
        this.visible = false;
        this.buttonsList = [];
    }

    var proto = MeasureToolbar.prototype;

    proto.init = function() {
        var self = this;

        // Add Measure tool toolbar to main toolbar
        var toolbar = this.viewer.getToolbar(true);
        var navigationBar = toolbar.getControl(ZhiUTech.Viewing.TOOLBAR.NAVTOOLSID);
        var toolbarOptions = {};
        toolbarOptions.index = toolbar.indexOf(navigationBar) + 1;
        this.measureToolbar = new avu.ControlGroup(ZhiUTech.Viewing.TOOLBAR.MEASURETOOLSID);
        toolbar.addControl(this.measureToolbar, toolbarOptions);
    

        // Create a button for the measure simple distance.
        this.measureSimpleDistanceBtn = new avu.Button("toolbar-measureTool-simple-distance");
        this.measureSimpleDistanceBtn.setToolTip("Distance");
        this.measureSimpleDistanceBtn.setIcon("zu-icon-measure-distance-new");
        this.measureSimpleDistanceBtn.onClick = function() {
            var enable = self.measureSimpleDistanceBtn.getState() !== avu.Button.State.ACTIVE;
            if (enable) {
                self.measureExtension.activate('distance');
            } else {
                self.measureTool.deselectAllMeasurements();
                self.setButtonInactive(self.measureSimpleDistanceBtn);
            }
        };

        this.measureToolbar.addControl(this.measureSimpleDistanceBtn);
        this.buttonsList[MeasureCommon.MeasurementTypes.MEASUREMENT_DISTANCE] = this.measureSimpleDistanceBtn;


        // Create a button for the measure Angle.
        this.measureAngleBtn = new avu.Button("toolbar-measureTool-angle");
        this.measureAngleBtn.setToolTip("Angle");
        this.measureAngleBtn.setIcon("zu-icon-measure-angle-new");
        this.measureAngleBtn.onClick = function () {
            var enable = self.measureAngleBtn.getState() !== avu.Button.State.ACTIVE;
            if (enable) {
                self.measureExtension.activate('angle');
            } else {
                self.measureTool.deselectAllMeasurements();
                self.setButtonInactive(self.measureAngleBtn);
            }
        };
        this.measureToolbar.addControl(this.measureAngleBtn);
        this.buttonsList[MeasureCommon.MeasurementTypes.MEASUREMENT_ANGLE] = this.measureAngleBtn;

        if (this.viewer.model && this.viewer.model.is2d()) {
            // Create a button for the measure distance.
            this.measureAreaBtn = new avu.Button("toolbar-measureTool-area");
            this.measureAreaBtn.setToolTip("Area");
            this.measureAreaBtn.setIcon("zu-icon-measure-area-new");
            this.measureAreaBtn.onClick = function() {
                var enable = self.measureAreaBtn.getState() !== avu.Button.State.ACTIVE;
                if (enable) {
                    self.measureExtension.activate('area');
                } else {
                    self.measureTool.deselectAllMeasurements();
                    self.setButtonInactive(self.measureAreaBtn);
                }
            };

            this.measureToolbar.addControl(this.measureAreaBtn);
            this.buttonsList[MeasureCommon.MeasurementTypes.MEASUREMENT_AREA] = this.measureAreaBtn;
        }

        // Create a button for the Calibration tool.
        this.calibrationToolBtn = new avu.Button( "toolbar-calibrationTool");
        this.calibrationToolBtn.setToolTip("Calibrate");
        this.calibrationToolBtn.setIcon("zu-icon-measure-calibration");
        this.calibrationToolBtn.onClick = function(e) {
            var enable = self.calibrationToolBtn.getState() !== avu.Button.State.ACTIVE;
            if(enable) {
                self.measureExtension.activate('calibrate');
            } else  {
                self.measureExtension.enableCalibrationTool(false);
            }
        };

        this.measureToolbar.addControl(this.calibrationToolBtn);
        this.buttonsList[MeasureCommon.MeasurementTypes.CALIBRATION] = this.calibrationToolBtn;

        var separator = document.createElement('div');
        separator.className = 'measure-toolbar-seperator';

        this.measureToolbar.container.appendChild(separator);
        

        // Create a button for the Trash.
        this.deleteBtn = new avu.Button( "toolbar-delete");
        this.deleteBtn.setToolTip("Delete measurement");
        this.deleteBtn.setIcon("zu-icon-measure-trash");
        this.deleteBtn.onClick = function() {
            self.measureExtension.deleteCurrentMeasurement();
        };

        this.measureToolbar.addControl(this.deleteBtn);

        // Create a button for the Settings panel.
        this.settingsBtn = new avu.Button( "toolbar-settings");
        this.settingsBtn.setToolTip("Measure settings");
        this.settingsBtn.setIcon("zu-icon-measure-settings");

        this.settingsControlPanel = document.createElement('div');
        this.settingsControlPanel.classList.add('docking-panel');
        this.settingsControlPanel.classList.add('docking-panel-container-solid-color-b');
        this.settingsControlPanel.classList.add('measure-settings-popup');
        this.settingsControlPanel.style.display = 'none';

        this.settingsBtn.onClick = function (event) {
            if (this.settingsControlPanel.style.display == 'none') {
                this.settingsControlPanel.style.display = 'block';
                this.setButtonActive(this.settingsBtn);
            }
            else {
                this.settingsControlPanel.style.display = 'none';
                this.setButtonInactive(this.settingsBtn);
            }
        }.bind(this);

        this.measureToolbar.container.appendChild(this.settingsControlPanel);
        this.settingsControlPanel.root = this.settingsBtn;
        this.measureToolbar.addControl(this.settingsBtn);


        // Settings Panel
        this.table = document.createElement("table");
        this.table.classList.add("zu-lmv-tftable");
        this.table.classList.add("calibration-table");

        this.tbody = document.createElement("tbody");
        this.table.appendChild(this.tbody);
        this.settingsControlPanel.appendChild(this.table);

        this.units = [
            { name: 'Unknown', units: '', matches: [''] },                                      // localized in OptionDropDown() call below
            { name: 'Decimal feet', units: 'decimal-ft', matches: ['ft', 'decimal-ft'] },             // localized in OptionDropDown() call below
            { name: 'Feet and fractional inches', units: 'ft-and-fractional-in', matches: ['ft-and-fractional-in'] },         // localized in OptionDropDown() call below
            { name: 'Feet and decimal inches', units: 'ft-and-decimal-in', matches: ['ft-and-decimal-in'] }, // localized in OptionDropDown() call below
            { name: 'Decimal inches', units: 'decimal-in', matches: ['in', 'decimal-in'] },           // localized in OptionDropDown() call below
            { name: 'Fractional inches', units: 'fractional-in', matches: ['fractional-in'] },  // localized in OptionDropDown() call below
            { name: 'Meters', units: 'm', matches: ['m'] },                                     // localized in OptionDropDown() call below
            { name: 'Centimeters', units: 'cm', matches: ['cm'] },                              // localized in OptionDropDown() call below
            { name: 'Millimeters', units: 'mm', matches: ['mm'] },                              // localized in OptionDropDown() call below
            { name: 'Meters and centimeters', units: 'm-and-cm', matches: ['m-and-cm'] }        // localized in OptionDropDown() call below
        ];

        var initialIndex = this.findUnits(),
            unitNames = [];
        
        // It is not possible to hide elements in Safari.
        if (av.isSafari() && this.viewer.model.getDisplayUnit()){
            // We will remove the 'Unknown' unit from the units array.
            this.units.shift();
        }
        
        for (var i = 0; i < this.units.length; ++i) {
            unitNames.push(this.units[i].name);
        }

        this.unitList = new zvp.OptionDropDown("Unit type", this.tbody, unitNames, initialIndex);
        this.unitList.addEventListener("change", function(e) {
            var index = self.unitList.selectedIndex;
            var toUnits = self.units[index].units;
            self.measureTool.setUnits(toUnits);
            self.setupPrecision();
            zvp.logger.track({ category: 'pref_changed', name: 'measure/units', value: toUnits });
        });

        this.precisionList = new zvp.OptionDropDown("Precision", this.tbody, [], -1);
        this.precisionList.addEventListener("change", function(e) {
            var index = self.precisionList.selectedIndex;
            self.measureTool.setPrecision(index);
            zvp.logger.track({ category: 'pref_changed', name: 'measure/precision', value: index });
        });

        this.isolate = new zvp.OptionCheckbox("Isolate measurement", this.tbody, false);
        this.isolate.addEventListener("change", function(e) {
            var enable = self.isolate.checked;
            self.measureTool.setIsolateMeasure(enable);
            if (enable) {
                self.measureTool.isolateMeasurement();
            }
            else {
                self.measureTool.clearIsolate();
            }
            zvp.logger.track({ category: 'pref_changed', name: 'measure/isolate', value: enable });
        });

        this.setupPrecision();

        this.updateSettingsPanel();

        if (this.viewer.model && this.viewer.model.is2d()) {
            this.isolate.setVisibility(false);
            this.settingsControlPanel.classList.add('measure-settings-popup-small');
        }

        if (!this.measureExtension.sharedMeasureConfig.units) {
            this.disableUnitOption();
        }
        // Only disable option if the browser is not Safari
        else if (!ZhiUTech.Viewing.isSafari()){
            this.disableUnitOption(0);  // disable "Unknown" option when the model has units
        }


        // Create a button for 'Done'.
        this.measureDoneBtn = new avu.Button("toolbar-measureTool-done");
        var doneText = ZhiUTech.Viewing.i18n.translate('Done');
        this.measureDoneBtn.setToolTip(doneText);
        var cancelLabel = document.createElement('label');
        cancelLabel.textContent = doneText;
        var btnContainer = this.measureDoneBtn.container;
        btnContainer.appendChild(cancelLabel);
        btnContainer.classList.add('zu-label-button');
        var iconEle = btnContainer.getElementsByClassName('zu-button-icon');
        iconEle && iconEle[0] && (iconEle[0].style.display = 'none');

        this.measureDoneBtn.onClick = function() {
            this.measureExtension.exitMeasurementMode();
        }.bind(this);
        this.measureToolbar.addControl(this.measureDoneBtn);

        // this.settingsControlPanel.style.width = this.measureToolbar.container.getBoundingClientRect().width + 'px';
        this.measureToolbar.setVisible(false);

    };

    proto.closeToolbar = function() {

        this.measureExtension.enableMeasureTool(false);
        this.measureExtension.enableCalibrationTool(false);
        this.toggleVisible();

        var toolbar = this.viewer.getToolbar(false);
        var viewerToolbarContainer = toolbar.container;
        var viewerContainerChildrenCount = viewerToolbarContainer.children.length;
        
        for(var i = 0; i < viewerContainerChildrenCount; ++i) {
            viewerToolbarContainer.children[i].style.display = "";
        }

        var modelTools = toolbar.getControl(av.TOOLBAR.MODELTOOLSID);
        modelTools.addControl(this.measureExtension.measurementToolbarButton, {index: this.measureExtension.measurementToolbarButton.index });
    };

    proto.toggleVisible = function() {
        this.visible = !this.visible;
        this.measureToolbar.setVisible(this.visible);
        if (!this.visible) {
            this.settingsControlPanel.style.display = 'none';
            this.setButtonInactive(this.settingsBtn);
        }
    };

    proto.setButtonActive = function(button) {
        button.setState(avu.Button.State.ACTIVE);
    };

    proto.setButtonInactive = function(button) {
        button.setState(avu.Button.State.INACTIVE);
    };

    proto.deactivateAllButtons = function() {
        for (var key in this.buttonsList) {
            if (this.buttonsList.hasOwnProperty(key)) {
                var button = this.buttonsList[key];
                this.setButtonInactive(button);   
            }
        }
    };

    proto.activateButtonByType = function(measurementType) {
        this.setButtonActive(this.buttonsList[measurementType]);
    };            

    proto.setupPrecision = function() {
        while (this.precisionList.dropdownElement.lastChild) {
            this.precisionList.dropdownElement.removeChild(this.precisionList.dropdownElement.lastChild);
        }

        var selectedUnits = this.measureTool.getUnits(),
            precisions;

        if (selectedUnits === 'ft-and-fractional-in' || selectedUnits === 'fractional-in') {
            precisions = ['1', '1/2', '1/4', '1/8', '1/16', '1/32', '1/64'];
        } else {
            precisions = ['0', '0.1', '0.01', '0.001', '0.0001', '0.00001'];
        }

        for (var i = 0; i < precisions.length; ++i) {
            var elem = document.createElement('option');
            elem.value = i;
            elem.textContent = precisions[i];
            this.precisionList.dropdownElement.appendChild(elem);
        }

        var selectedIndex = this.measureTool.getPrecision();
        if (precisions.length <= selectedIndex) {
            selectedIndex = precisions.length - 1;
            this.measureTool.setPrecision(selectedIndex);
        }
        this.precisionList.dropdownElement.selectedIndex = selectedIndex;
    };

    proto.findUnits = function() {
        var i,
            j,
            selectedUnits = this.measureTool.getUnits();
        for (i = 0; i < this.units.length; ++i) {
            var matches = this.units[i].matches;
            if (matches) {
                for (j = 0; j < matches.length; ++j) {
                    if (matches[j] === selectedUnits) {
                        return i;
                    }
                }
            }
        }
        return 0;
    };

    proto.disableUnitOption = function( index ) {
        if (index != null) {
            this.unitList.dropdownElement.children[index].style.display = "none";
            if (av.isIE11) {
                // IE11 can't hide <option> elements...
                this.unitList.dropdownElement.children[index].disabled = true;
                this.unitList.dropdownElement.children[index].style.visibility = "hidden";
            }
        } else {  // disable all options
            this.unitList.dropdownElement.disabled = true;
        }
    };

    proto.updateSettingsPanel = function() {
        this.unitList.dropdownElement.selectedIndex = this.findUnits();
        this.precisionList.dropdownElement.selectedIndex = this.measureTool.getPrecision();
        this.setupPrecision();
    };

    ZhiUTech.Viewing.Extensions.Measure.MeasureToolbar = MeasureToolbar;

})();