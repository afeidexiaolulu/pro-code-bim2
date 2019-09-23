(function() {

	function getGlobal() {
		return(typeof window !== "undefined" && window !== null) ?
			window :
			(typeof self !== "undefined" && self !== null) ?
			self :
			global;
	}

	/**
	 * Create namespace
	 * @param {string} s - namespace (e.g. 'ZhiUTech.Viewing')
	 * @return {Object} namespace
	 */
	function ZhiUTechNamespace(s) {
		var ns = getGlobal();

		var parts = s.split('.');
		for(var i = 0; i < parts.length; ++i) {
			ns[parts[i]] = ns[parts[i]] || {};
			ns = ns[parts[i]];
		}

		return ns;
	};

	// Define the most often used ones
	ZhiUTechNamespace("ZhiUTech.Viewing.Private");

	ZhiUTechNamespace("ZhiUTech.Viewing.Extensions");

	ZhiUTechNamespace("ZhiUTech.Viewing.Shaders");

	ZhiUTechNamespace('ZhiUTech.Viewing.UI');

	ZhiUTechNamespace('ZhiUTech.LMVTK');

	ZhiUTech.Viewing.getGlobal = getGlobal;
	ZhiUTech.Viewing.ZhiUTechNamespace = ZhiUTechNamespace;
	getGlobal().ZhiUTechNamespace = ZhiUTechNamespace;

})();; // Map wgs.js symbols back to ZhiUTech namespaces for backwards compatibility.
// If the worker parameter is true, only worker-specific symbols are mapped.
ZhiUTech.Viewing.Private.initializeLegacyNamespaces = function(worker) {
	var zv = ZhiUTech.Viewing;
	var zvs = zv.Shaders;
	var zvp = zv.Private;
	var lmv = zv.LMVTK;

	zv.ErrorCodes = WGS.ErrorCodes;
	zv.errorCodeString = WGS.errorCodeString;
	zv.getErrorCode = WGS.getErrorCode;

	zvp.InstanceTreeStorage = WGS.InstanceTreeStorage;
	zvp.InstanceTreeAccess = WGS.InstanceTreeAccess;
	zvp.BVHBuilder = WGS.BVHBuilder;
	zvp.NodeArray = WGS.NodeArray;

	zvp.ViewingService = WGS.ViewingService;
	WGS.ViewingService.setEndpoint(zv.endpoint);
	if(zvp.logger)
		WGS.setLogger(zvp.logger);

	if(worker)
		return;

	zv.FileLoaderManager.registerFileLoader("esd", ["esd", "gltf", "glb"], WGS.SvfLoader);
	zv.FileLoaderManager.registerFileLoader("json", ["json"], WGS.OtgLoader);
	zv.LOAD_MISSING_GEOMETRY = WGS.LOAD_MISSING_GEOMETRY;
	zv.MODEL_ROOT_LOADED_EVENT = WGS.MODEL_ROOT_LOADED_EVENT;
	zv.FRAGMENTS_LOADED_EVENT = WGS.FRAGMENTS_LOADED_EVENT;
	zv.OBJECT_TREE_CREATED_EVENT = WGS.OBJECT_TREE_CREATED_EVENT;
	zv.MODEL_UNLOADED_EVENT = WGS.MODEL_UNLOADED_EVENT;
	zv.OBJECT_TREE_UNAVAILABLE_EVENT = WGS.OBJECT_TREE_UNAVAILABLE_EVENT;
	zv.TEXTURES_LOADED_EVENT = WGS.TEXTURES_LOADED_EVENT;

	zvs.PackDepthShaderChunk = WGS.PackDepthShaderChunk;
	zvs.TonemapShaderChunk = WGS.TonemapShaderChunk;
	zvs.OrderedDitheringShaderChunk = WGS.OrderedDitheringShaderChunk;
	zvs.CutPlanesUniforms = WGS.CutPlanesUniforms;
	zvs.CutPlanesShaderChunk = WGS.CutPlanesShaderChunk;
	zvs.PackNormalsShaderChunk = WGS.PackNormalsShaderChunk;
	zvs.HatchPatternShaderChunk = WGS.HatchPatternShaderChunk;
	zvs.EnvSamplingShaderChunk = WGS.EnvSamplingShaderChunk;
	zvs.IdUniforms = WGS.IdUniforms;
	zvs.IdFragmentDeclaration = WGS.IdFragmentDeclaration;
	zvs.IdOutputShaderChunk = WGS.IdOutputShaderChunk;
	zvs.FinalOutputShaderChunk = WGS.FinalOutputShaderChunk;
	zvs.ThemingUniform = WGS.ThemingUniform;
	zvs.ThemingFragmentDeclaration = WGS.ThemingFragmentDeclaration;
	zvs.ThemingFragmentShaderChunk = WGS.ThemingFragmentShaderChunk;

	zvs.BackgroundShader = WGS.BackgroundShader;

	zvs.BlendShader = WGS.BlendShader;

	zvs.CelShader = WGS.CelShader;

	zvs.CopyShader = WGS.CopyShader;
	zvs.ClearShader = WGS.ClearShader;
	zvs.HighlightShader = WGS.HighlightShader;

	zvs.FXAAShader = WGS.FXAAShader;

	zvs.SAOBlurShader = WGS.SAOBlurShader;

	zvs.SAOMinifyFirstShader = WGS.SAOMinifyFirstShader;
	zvs.SAOMinifyShader = WGS.SAOMinifyShader;

	zvs.SAOShader = WGS.SAOShader;

	zvs.NormalsShader = WGS.NormalsShader;
	zvs.EdgeShader = WGS.EdgeShader;

	zvs.LineShader = WGS.LineShader;

	zvp.LineStyleDefs = WGS.LineStyleDefs;
	zvp.CreateLinePatternTexture = WGS.CreateLinePatternTexture;
	zvp.CreateCubeMapFromColors = WGS.CreateCubeMapFromColors;

	zvp.FloatToHalf = WGS.FloatToHalf;
	zvp.HalfToFloat = WGS.HalfToFloat;
	zvp.IntToHalf = WGS.IntToHalf;
	zvp.HalfToInt = WGS.HalfToInt;
	zvp.HalfTest = WGS.HalfTest;

	zvs.createShaderMaterial = WGS.createShaderMaterial;
	zvs.setMacro = WGS.setMacro;
	zvs.removeMacro = WGS.removeMacro;

	zvs.LmvShaderPass = WGS.ShaderPass;

	zvs.GaussianPass = WGS.GaussianPass;

	zvs.GroundShadow = WGS.GroundShadow;
	zvs.createGroundShape = WGS.createGroundShape;
	zvs.setGroundShapeTransform = WGS.setGroundShapeTransform;

	zvs.GroundReflection = WGS.GroundReflection;

	zvp.FireflyWebGLShader = WGS.WebGLShader;

	zvp.PrismMaps = WGS.PrismMaps;
	zvp.GetPrismMapChunk = WGS.GetPrismMapChunk;
	zvp.FireflyWebGLProgram = WGS.WebGLProgram;

	zvs.ShadowMapCommonUniforms = WGS.ShadowMapCommonUniforms;
	zvs.ShadowMapUniforms = WGS.ShadowMapUniforms;
	zvs.ShadowMapDeclareCommonUniforms = WGS.ShadowMapDeclareCommonUniforms;
	zvs.ShadowMapVertexDeclaration = WGS.ShadowMapVertexDeclaration;
	zvs.ShadowMapVertexShaderChunk = WGS.ShadowMapVertexShaderChunk;
	zvs.ShadowMapFragmentDeclaration = WGS.ShadowMapFragmentDeclaration;

	zvs.FireflyPhongShader = WGS.PhongShader;

	zvs.PrismShader = WGS.PrismShader;
	zvs.GetPrismMapUniforms = WGS.GetPrismMapUniforms;
	zvs.GetPrismMapSampleChunk = WGS.GetPrismMapSampleChunk;
	zvs.GetPrismMapUniformChunk = WGS.GetPrismMapUniformChunk;
	zvs.AverageOfFloat3 = WGS.AverageOfFloat3;
	zvp.createPrismMaterial = WGS.createPrismMaterial;
	zvp.clonePrismMaterial = WGS.clonePrismMaterial;

	zvp.ShadowMapShader = WGS.ShadowMapShader;
	zvp.GroundShadowShader = WGS.GroundShadowShader;
	zvp.ShadowMapOverrideMaterials = WGS.ShadowMapOverrideMaterials;
	zvp.SHADOWMAP_NEEDS_UPDATE = WGS.SHADOWMAP_NEEDS_UPDATE;
	zvp.SHADOWMAP_INCOMPLETE = WGS.SHADOWMAP_INCOMPLETE;
	zvp.SHADOWMAP_VALID = WGS.SHADOWMAP_VALID;
	zvp.ShadowConfig = WGS.ShadowConfig;
	zvp.ShadowRender = WGS.ShadowRender;
	zvp.ShadowMaps = WGS.ShadowMaps;

	zvp.FrustumIntersector = WGS.FrustumIntersector;
	zvp.OUTSIDE = WGS.OUTSIDE;
	zvp.INTERSECTS = WGS.INTERSECTS;
	zvp.CONTAINS = WGS.CONTAINS;

	zvp.VBIntersector = WGS.VBIntersector;
	zvp.VertexEnumerator = WGS.VertexEnumerator;

	zvp.GPU_MEMORY_LIMIT = WGS.GPU_MEMORY_LIMIT;
	zvp.GPU_OBJECT_LIMIT = WGS.GPU_OBJECT_LIMIT;

	zvp.PAGEOUT_SUCCESS = WGS.PAGEOUT_SUCCESS;
	zvp.PAGEOUT_FAIL = WGS.PAGEOUT_FAIL;
	zvp.PAGEOUT_NONE = WGS.PAGEOUT_NONE;

	zvp.GeometryList = WGS.GeometryList;

	zvp.MESH_VISIBLE = WGS.MESH_VISIBLE;
	zvp.MESH_HIGHLIGHTED = WGS.MESH_HIGHLIGHTED;
	zvp.MESH_HIDE = WGS.MESH_HIDE;
	zvp.MESH_ISLINE = WGS.MESH_ISLINE;
	zvp.MESH_ISWIDELINE = WGS.MESH_ISWIDELINE;
	zvp.MESH_ISPOINT = WGS.MESH_ISPOINT;
	zvp.MESH_MOVED = WGS.MESH_MOVED;
	zvp.MESH_TRAVERSED = WGS.MESH_TRAVERSED;
	zvp.MESH_DRAWN = WGS.MESH_DRAWN;
	zvp.MESH_RENDERFLAG = WGS.MESH_RENDERFLAG;
	zvp.FragmentPointer = WGS.FragmentPointer;
	zvp.FragmentList = WGS.FragmentList;

	zvp.RENDER_NORMAL = WGS.RENDER_NORMAL;
	zvp.RENDER_HIGHLIGHTED1 = WGS.RENDER_HIGHLIGHTED1;
	zvp.RENDER_HIGHLIGHTED2 = WGS.RENDER_HIGHLIGHTED2;
	zvp.RENDER_HIDDEN = WGS.RENDER_HIDDEN;
	zvp.RENDER_SHADOWMAP = WGS.RENDER_SHADOWMAP;
	zvp.RENDER_FINISHED = WGS.RENDER_FINISHED;

	zvp.GROUND_UNFINISHED = WGS.GROUND_UNFINISHED;
	zvp.GROUND_FINISHED = WGS.GROUND_FINISHED;
	zvp.GROUND_RENDERED = WGS.GROUND_RENDERED;

	zvp.RenderBatch = WGS.RenderBatch;

	zv.rescueFromPolymer = WGS.rescueFromPolymer;

	zvp.FireflyWebGLRenderer = WGS.WebGLRenderer;

	zvp.ModelIteratorLinear = WGS.ModelIteratorLinear;
	zvp.ModelIteratorBVH = WGS.ModelIteratorBVH;

	zvp.BufferGeometryUtils = WGS.BufferGeometryUtils;

	zvp.RenderScene = WGS.RenderScene;

	zvp.SortedList = WGS.SortedList;

	zvp.ModelIteratorTexQuad = WGS.ModelIteratorTexQuad;
	zvp.TexQuadConfig = WGS.TexQuadConfig;
	zvp.LeafletDiffIterator = WGS.LeafletDiffIterator;
	zvp.LeafletDiffModes = WGS.LeafletDiffModes;

	zvp.InstanceTree = WGS.InstanceTree;
	zv.SelectionMode = WGS.SelectionMode;

	zvp.MaterialConverter = WGS.MaterialConverter;
};;

function getGlobal() {
	return(typeof window !== "undefined" && window !== null) ?
		window :
		(typeof self !== "undefined" && self !== null) ?
		self :
		global;
}

var zv = ZhiUTech.Viewing,
	zvp = zv.Private;

zv.getGlobal = getGlobal;

var isBrowser = zv.isBrowser = (typeof navigator !== "undefined");

var isIE11 = zv.isIE11 = isBrowser && !!navigator.userAgent.match(/Edge|Trident\/7\./);

// fix IE events
if(typeof window !== "undefined" && isIE11) {
	(function() {
		function CustomEvent(event, params) {
			params = params || {
				bubbles: false,
				cancelable: false,
				detail: undefined
			};
			var evt = document.createEvent('CustomEvent');
			evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
			return evt;
		}

		CustomEvent.prototype = window.CustomEvent.prototype;

		window.CustomEvent = CustomEvent;
	})();
}

// IE does not implement ArrayBuffer slice. Handy!
if(!ArrayBuffer.prototype.slice) {
	ArrayBuffer.prototype.slice = function(start, end) {
		// Normalize start/end values
		if(!end || end > this.byteLength) {
			end = this.byteLength;
		} else if(end < 0) {
			end = this.byteLength + end;
			if(end < 0) end = 0;
		}
		if(start < 0) {
			start = this.byteLength + start;
			if(start < 0) start = 0;
		}

		if(end <= start) {
			return new ArrayBuffer();
		}

		// Bytewise copy- this will not be fast, but what choice do we have?
		var len = end - start;
		var view = new Uint8Array(this, start, len);
		var out = new Uint8Array(len);
		for(var i = 0; i < len; i++) {
			out[i] = view[i];
		}
		return out.buffer;
	};
}

// IE doesn't implement Math.log2
(function() {
	Math.log2 = Math.log2 || function(x) {
		return Math.log(x) / Math.LN2;
	};
})();

//The BlobBuilder object
if(typeof window !== "undefined")
	window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;

// Launch full screen on the given element with the available method
var launchFullscreen = zv.launchFullscreen = function(element, options) {
	if(element.requestFullscreen) {
		element.requestFullscreen(options);
	} else if(element.mozRequestFullScreen) {
		element.mozRequestFullScreen(options);
	} else if(element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen(options);
	} else if(element.msRequestFullscreen) {
		element.msRequestFullscreen(options);
	}
};

// Exit full screen with the available method
var exitFullscreen = zv.exitFullscreen = function() {
	if(document.exitFullscreen) {
		document.exitFullscreen();
	} else if(document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if(document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	} else if(document.msExitFullscreen) {
		document.msExitFullscreen();
	}
};

// Determines if the browser is in full screen
var inFullscreen = zv.inFullscreen = function() {

	// Special case for Ms-Edge that has webkitIsFullScreen with correct value
	// and fullscreenEnabled with wrong value (thanks MS)

	if("webkitIsFullScreen" in document) return !!(document.webkitIsFullScreen);
	if("fullscreenElement" in document) return !!(document.fullscreenElement);
	if("mozFullScreenElement" in document) return !!(document.mozFullScreenElement);
	if("msFullscreenElement" in document) return !!(document.msFullscreenElement);

	return !!(document.querySelector(".viewer-fill-browser")); // Fallback for iPad
};

var fullscreenElement = zv.fullscreenElement = function() {
	return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
};

var isFullscreenAvailable = zv.isFullscreenAvailable = function(element) {
	return element.requestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen || element.msRequestFullscreen;
};

// Get the version of the android device through user agent.
// Return the version string of android device, e.g. 4.4, 5.0...
var getAndroidVersion = zv.getAndroidVersion = function(ua) {
	ua = ua || navigator.userAgent;
	var match = ua.match(/Android\s([0-9\.]*)/);
	return match ? match[1] : false;
};

// Determine if this is a touch or notouch device.
var isTouchDevice = zv.isTouchDevice = function() {
	/*
	// Temporarily disable touch support through hammer on Android 5, to debug
	// some specific gesture issue with Chromium WebView when loading zuv3D.js.
	if (parseInt(getAndroidVersion()) == 5) {
	    return false;
	}
	*/

	return(typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0));
};

zv.isIOSDevice = function() {
	if(!isBrowser) return false;
	return /ip(ad|hone|od)/.test(navigator.userAgent.toLowerCase());
};

zv.isAndroidDevice = function() {
	if(!isBrowser) return false;
	return(navigator.userAgent.toLowerCase().indexOf('android') !== -1);
};

zv.isMobileDevice = function() {
	if(!isBrowser) return false;
	return zv.isIOSDevice() || zv.isAndroidDevice();
};

zv.isSafari = function() {
	if(!isBrowser) return false;
	var _ua = navigator.userAgent.toLowerCase();
	return(_ua.indexOf("safari") !== -1) && (_ua.indexOf("chrome") === -1);
};

zv.isFirefox = function() {
	if(!isBrowser) return false;
	var _ua = navigator.userAgent.toLowerCase();
	return(_ua.indexOf("firefox") !== -1);
};

zv.isChrome = function() {
	if(!isBrowser) return false;
	var _ua = navigator.userAgent.toLowerCase();
	return(_ua.indexOf("chrome") !== -1);
};

zv.isMac = function() {
	if(!isBrowser) return false;
	var _ua = navigator.userAgent.toLowerCase();
	return(_ua.indexOf("mac os") !== -1);
};

zv.isWindows = function() {
	if(!isBrowser) return false;
	var _ua = navigator.userAgent.toLowerCase();
	return(_ua.indexOf("win32") !== -1 || _ua.indexOf("windows") !== -1);
};

zv.ObjectAssign = function(des, src) {
	for(var key in src) {
		if(src.hasOwnProperty(key))
			des[key] = src[key];
	}
	return des;
};

// Hack to work around Safari's use of pinch and pan inside the viewer canvas.
zvp.disableTouchSafari = function(event) {
	var xOff = window.hasOwnProperty("pageXOffset") ? window.pageXOffset : document.documentElement.scrollLeft;
	var yOff = window.hasOwnProperty("pageYOffset") ? window.pageYOffset : document.documentElement.scrollTop;
	// If we aren't inside the canvas, then allow default propagation of the event
	var element = document.elementFromPoint(event.pageX - xOff, event.pageY - yOff);
	if(!element || element.nodeName !== 'CANVAS')
		return true;
	// If it's a CANVAS, check that it's owned by us
	if(element.getAttribute('data-viewer-canvas' !== 'true'))
		return true;
	// Inside the canvas, prevent the event from propagating to Safari'safely
	// standard handlers, which will pan and zoom the page.
	event.preventDefault();
	return false;
};

// Hack to work around Safari's use of pinch and pan inside the viewer canvas.
zvp.disableDocumentTouchSafari = function() {
	if(zv.isMobileDevice() && zv.isSafari()) {
		// Safari mobile disable default touch handling inside viewer canvas
		// Use capture to make sure Safari doesn't capture the touches and prevent
		// us from disabling them.
		document.documentElement.addEventListener('touchstart', zvp.disableTouchSafari, true);
		document.documentElement.addEventListener('touchmove', zvp.disableTouchSafari, true);
		document.documentElement.addEventListener('touchcanceled', zvp.disableTouchSafari, true);
		document.documentElement.addEventListener('touchend', zvp.disableTouchSafari, true);
	}
};

// Hack to work around Safari's use of pinch and pan inside the viewer canvas.
// This method is not being invoked explicitly.
zvp.enableDocumentTouchSafari = function() {
	if(zv.isMobileDevice() && zv.isSafari()) {
		// Safari mobile disable default touch handling inside viewer canvas
		// Use capture to make sure Safari doesn't capture the touches and prevent
		// us from disabling them.
		document.documentElement.removeEventListener('touchstart', zvp.disableTouchSafari, true);
		document.documentElement.removeEventListener('touchmove', zvp.disableTouchSafari, true);
		document.documentElement.removeEventListener('touchcanceled', zvp.disableTouchSafari, true);
		document.documentElement.removeEventListener('touchend', zvp.disableTouchSafari, true);
	}
};

/**
 * Detects if WebGL is enabled.
 *
 * @return { number } -1 for not Supported,
 *                    0 for disabled
 *                    1 for enabled
 */
var detectWebGL = zv.detectWebGL = function() {
	// Check for the webgl rendering context
	if(!!window.WebGLRenderingContext) {
		var canvas = document.createElement("canvas"),
			names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
			context = false;

		for(var i = 0; i < 4; i++) {
			try {
				context = canvas.getContext(names[i]);
				context = zv.rescueFromPolymer(context);
				if(context && typeof context.getParameter === "function") {
					// WebGL is enabled.
					//
					return 1;
				}
			} catch(e) {}
		}

		// WebGL is supported, but disabled.
		//
		return 0;
	}

	// WebGL not supported.
	//
	return -1;
};

// Convert touchstart event to click to remove the delay between the touch and
// the click event which is sent after touchstart with about 300ms deley.
// Should be used in UI elements on touch devices.
var touchStartToClick = zv.touchStartToClick = function(e) {
	// Buttons that activate fullscreen are a special case. The HTML5 fullscreen spec
	// requires the original user gesture signal to avoid a security issue.  See LMV-2396 and LMV-2326
	if((e.target.className.indexOf("fullscreen") > -1) || (e.target.className.indexOf("webvr") > -1))
		return;
	e.preventDefault(); // Stops the firing of delayed click event.
	e.stopPropagation();
	e.target.click(); // Maps to immediate click.
};

//Safari doesn't have the Performance object
//We only need the now() function, so that's easy to emulate.
(function() {
	var global = getGlobal();
	if(!global.performance)
		global.performance = Date;
})();

// Polyfill for IE and Safari
// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
Number.isInteger = Number.isInteger || function(value) {
	return typeof value === "number" &&
		isFinite(value) &&
		Math.floor(value) === value;
};

// Polyfill for IE
String.prototype.repeat = String.prototype.repeat || function(count) {
	if(count < 1) return '';
	var result = '',
		pattern = this.valueOf();
	while(count > 1) {
		if(count & 1) result += pattern;
		count >>= 1, pattern += pattern;
	}
	return result + pattern;
};

// Polyfill for IE
// It doesn't support negative values for start and end; it complicates the code using this function.
if(!Array.prototype.fill) {
	Object.defineProperty(Array.prototype, "fill", {
		enumerable: false,
		value: function(value, start, end) {
			start = (start === undefined) ? 0 : start;
			end = (end === undefined) ? this.length : end;
			for(var i = start; i < end; ++i)
				this[i] = value;
		}
	});
}
// Polyfill for IE
Int32Array.prototype.lastIndexOf = Int32Array.prototype.lastIndexOf || function(searchElement, fromIndex) {
	return Array.prototype.lastIndexOf.call(this, searchElement, fromIndex);
};

// Polyfill for IE
// It doesn't support negative values for start and end; it complicates the code using this function.
if(!Array.prototype.find) {
	Object.defineProperty(Array.prototype, "find", {
		enumerable: false,
		value: function(callback, _this) {
			var len = this.length;
			for(var i = 0; i < len; ++i) {
				var item = this[i];
				if(callback.call(_this, item, i, this))
					return item;
			}
			return undefined;
		}
	});
}

;
//This file is the first one when creating minified build
//and is used to set certain flags that are needed
//for the concatenated build.

var zv = ZhiUTech.Viewing;
var zvp = ZhiUTech.Viewing.Private;

//zvp.IS_CONCAT_BUILD = true; // Debugging source files without concatenation is no longer supported

/** @define {string} */
zvp.BUILD_LMV_WORKER_URL = "zumvworker.js";
zvp.LMV_WORKER_URL = zvp.BUILD_LMV_WORKER_URL;

zvp.ENABLE_DEBUG = zvp.ENABLE_DEBUG || false;
//zvp.DEBUG_SHADERS = zvp.DEBUG_SHADERS || false; // will be moved to wgs.js
zvp.ENABLE_INLINE_WORKER = true; // Use `false` for worker code debugging. 
;
(function() {

	"use strict";

	var zv = ZhiUTech.Viewing;
	var zvp = ZhiUTech.Viewing.Private;

	/**
	 * Logging levels. Higher number means more verbose logs,
	 * for example, with level 3, `info`, `warn`, or `error`
	 * logs will show up in the console but `debug` and `log` won't.
	 *
	 * Semantics of specific levels:
	 *  - debug: low-level debugging logs
	 *  - log: common, higher-level debugging logs
	 *  - info: helpful runtime information (even for stag/prod environments)
	 *  - warn: potentially problematic situations; handled exceptions
	 *  - error: definitely problematic situations; unhandled exceptions
	 * @readonly
	 * @enum {number}
	 */
	zvp.LogLevels = {
		DEBUG: 5,
		LOG: 4,
		INFO: 3,
		WARNING: 2,
		ERROR: 1,
		NONE: 0
	};

	function Logger() {
		this.adp = null;
		this.runtimeStats = {};
		this.level = -1;
		this.setLevel(zvp.LogLevels.ERROR);
	}

	Logger.prototype.initialize = function(options) {

		if(options.eventCallback)
			this.callback = options.eventCallback;

		this.sessionId = options.sessionId;
		if(!this.sessionId) {
			var now = Date.now() + "";
			this.sessionId = parseFloat(((Math.random() * 10000) | 0) + "" + now.substring(4));
		}

		// Initialize log level is passed in
		var logLevel = options.logLevel || options.loglevel; // typo-support
		if(typeof logLevel === 'number' && this.level !== logLevel) {
			this.setLevel(logLevel);
		}

		this.environmentInfo = {
			touch: zv.isTouchDevice(),
			env: zvp.env,
			referer: getReferer(),
			version: ZHIU_VERSION,
			patch: ZHIU_PATCH,
			build_type: LMV_BUILD_TYPE
		};

		//Kick off with a viewer start event
		var startEvent = {
			category: "viewer_start",
			touch: this.environmentInfo.touch,
			env: this.environmentInfo.env,
			referer: this.environmentInfo.referer,
			version: this.environmentInfo.version,
			patch: this.environmentInfo.patch,
			build_type: this.environmentInfo.build_type
		};
		this.track(startEvent);

		var _this = this;
		this.interval = setInterval(function() {
			_this.reportRuntimeStats();
		}, 60000);
	};

	Logger.prototype.shutdown = function() {
		clearInterval(this.interval);
		this.interval = undefined;
	};

	Logger.prototype.track = function(entry) {
		this.updateRuntimeStats(entry);

		if(zvp.offline || !this.sessionId) {
			return;
		}

		entry.timestamp = Date.now();
		entry.sessionId = this.sessionId;

		var sent = this.logToADP(entry);

		if(this.callback) {
			this.callback(entry, {
				adp: sent
			});
		}
	};

	Logger.prototype.logToADP = function(entry) {
		if(!this.adp) {
			return false;
		}

		// Map & log legacy events to ADP
		// TODO: move away from the legacy naming and avoid the awkward switch below
		var evType = '';
		var opType = '';
		switch(entry.category) {
			case 'tool_changed':
			case 'pref_changed':
				evType = 'CLICK_OPERATION';
				opType = entry.category + '/' + entry.name;
				break;
			case 'screen_mode':
				evType = 'CLICK_OPERATION';
				opType = 'pref_changed/' + entry.category;
				break;
			case 'metadata_load_stats':
				evType = 'DOCUMENT_START';
				opType = 'stats';
				entry.full_url = getReferer();
				break;
			case 'model_load_stats':
				evType = 'DOCUMENT_FULL';
				opType = 'stats';
				break;
			case 'tool_used':
				evType = 'BACKGROUND_CALL';
				opType = entry.category + '/' + entry.name;
				break;
			case 'settingOptionsStatus':
				evType = 'BACKGROUND_CALL';
				opType = entry.category + '/' + entry.list;
				break;
			case 'node_selected':
			case 'search_node':
				evType = 'CLICK_OPERATION';
				opType = entry.category + '/' + entry.name;
				break;
			case 'loaded_extensions':
				evType = 'BACKGROUND_CALL';
				opType = entry.category;
			case 'error':
				evType = 'BACKGROUND_CALL';
				opType = 'error';
				break;
		}

		if(!evType)
			return false;

		this.adp.trackEvent(evType, {
			operation: {
				id: entry.sessionId,
				type: opType,
				stage: '',
				status: 'C',
				meta: entry
			}
		});
		return true;
	};

	Logger.prototype.updateRuntimeStats = function(entry) {
		if(entry.hasOwnProperty('aggregate')) {
			switch(entry.aggregate) {
				case 'count':
					if(this.runtimeStats[entry.name] > 0) {
						this.runtimeStats[entry.name]++;
					} else {
						this.runtimeStats[entry.name] = 1;
					}
					this.runtimeStats._nonempty = true;
					break;
				case 'last':
					this.runtimeStats[entry.name] = entry.value;
					this.runtimeStats._nonempty = true;
					break;
				default:
					this.warn('unknown log aggregate type');
			}
		}
	};

	Logger.prototype.reportRuntimeStats = function() {
		if(this.runtimeStats._nonempty) {
			delete this.runtimeStats._nonempty;

			if(this.adp) {
				this.adp.trackEvent('BACKGROUND_CALL', {
					operation: {
						id: this.sessionId,
						type: 'stats',
						stage: '',
						status: 'C',
						meta: this.runtimeStats
					}
				});
			}

			this.runtimeStats.category = 'misc_stats';
			this.track(this.runtimeStats);
			this.runtimeStats = {};
		}
	};

	Logger.prototype.setLevel = function(level) {
		if(this.level === level)
			return;

		this.level = level;

		var nullFn = function() {};
		var zvpl = zvp.LogLevels;
		var self = this;

		var reportError = function() {
			if(self.callback) {
				var msg = Array.prototype.slice.call(arguments).join(' ');
				self.callback({
					category: 'error',
					message: msg
				}, {
					adp: false
				});
			}
			console.error.apply(console, arguments);
		};

		// Bind to console
		this.debug = level >= zvpl.DEBUG ? console.log.bind(console) : nullFn;
		this.log = level >= zvpl.LOG ? console.log.bind(console) : nullFn;
		this.info = level >= zvpl.INFO ? console.info.bind(console) : nullFn;
		this.warn = level >= zvpl.WARNING ? console.warn.bind(console) : nullFn;
		this.error = level >= zvpl.ERROR ? reportError : nullFn;
	};

	/**
	 * @private
	 */
	function getReferer() {
		// Wrapping href retrieval due to Fortify complains
		if(typeof window !== 'undefined') {
			return encodeURI(window.location.href);
		}
		return '';
	}

	ZhiUTech.Viewing.Private.logger = new Logger();

})();;
/*! Hammer.JS - v2.0.8 - 2016-04-23
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
(function(window, document, exportName, undefined) {
	'use strict';

	var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
	var TEST_ELEMENT = document.createElement('div');

	var TYPE_FUNCTION = 'function';

	var round = Math.round;
	var abs = Math.abs;
	var now = Date.now;

	/**
	 * set a timeout with a given scope
	 * @param {Function} fn
	 * @param {Number} timeout
	 * @param {Object} context
	 * @returns {number}
	 */
	function setTimeoutContext(fn, timeout, context) {
		return setTimeout(bindFn(fn, context), timeout);
	}

	/**
	 * if the argument is an array, we want to execute the fn on each entry
	 * if it aint an array we don't want to do a thing.
	 * this is used by all the methods that accept a single and array argument.
	 * @param {*|Array} arg
	 * @param {String} fn
	 * @param {Object} [context]
	 * @returns {Boolean}
	 */
	function invokeArrayArg(arg, fn, context) {
		if(Array.isArray(arg)) {
			each(arg, context[fn], context);
			return true;
		}
		return false;
	}

	/**
	 * walk objects and arrays
	 * @param {Object} obj
	 * @param {Function} iterator
	 * @param {Object} context
	 */
	function each(obj, iterator, context) {
		var i;

		if(!obj) {
			return;
		}

		if(obj.forEach) {
			obj.forEach(iterator, context);
		} else if(obj.length !== undefined) {
			i = 0;
			while(i < obj.length) {
				iterator.call(context, obj[i], i, obj);
				i++;
			}
		} else {
			for(i in obj) {
				obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
			}
		}
	}

	/**
	 * wrap a method with a deprecation warning and stack trace
	 * @param {Function} method
	 * @param {String} name
	 * @param {String} message
	 * @returns {Function} A new function wrapping the supplied method.
	 */
	function deprecate(method, name, message) {
		var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
		return function() {
			var e = new Error('get-stack-trace');
			var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
				.replace(/^\s+at\s+/gm, '')
				.replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

			var log = window.console && (window.console.warn || window.console.log);
			if(log) {
				log.call(window.console, deprecationMessage, stack);
			}
			return method.apply(this, arguments);
		};
	}

	/**
	 * extend object.
	 * means that properties in dest will be overwritten by the ones in src.
	 * @param {Object} target
	 * @param {...Object} objects_to_assign
	 * @returns {Object} target
	 */
	var assign = function assign(target) {
		if(target === undefined || target === null) {
			throw new TypeError('Cannot convert undefined or null to object');
		}

		var output = Object(target);
		for(var index = 1; index < arguments.length; index++) {
			var source = arguments[index];
			if(source !== undefined && source !== null) {
				for(var nextKey in source) {
					if(source.hasOwnProperty(nextKey)) {
						output[nextKey] = Array.isArray(source[nextKey]) ? source[nextKey].slice(0) : source[nextKey];
					}
				}
			}
		}
		return output;
	};

	/**
	 * extend object.
	 * means that properties in dest will be overwritten by the ones in src.
	 * @param {Object} dest
	 * @param {Object} src
	 * @param {Boolean} [merge=false]
	 * @returns {Object} dest
	 */
	var extend = deprecate(function extend(dest, src, merge) {
		var keys = Object.keys(src);
		var i = 0;
		while(i < keys.length) {
			if(!merge || (merge && dest[keys[i]] === undefined)) {
				dest[keys[i]] = src[keys[i]];
			}
			i++;
		}
		return dest;
	}, 'extend', 'Use `assign`.');

	/**
	 * merge the values from src in the dest.
	 * means that properties that exist in dest will not be overwritten by src
	 * @param {Object} dest
	 * @param {Object} src
	 * @returns {Object} dest
	 */
	var merge = deprecate(function merge(dest, src) {
		return extend(dest, src, true);
	}, 'merge', 'Use `assign`.');

	/**
	 * simple class inheritance
	 * @param {Function} child
	 * @param {Function} base
	 * @param {Object} [properties]
	 */
	function inherit(child, base, properties) {
		var baseP = base.prototype,
			childP;

		childP = child.prototype = Object.create(baseP);
		childP.constructor = child;
		childP._super = baseP;

		if(properties) {
			assign(childP, properties);
		}
	}

	/**
	 * simple function bind
	 * @param {Function} fn
	 * @param {Object} context
	 * @returns {Function}
	 */
	function bindFn(fn, context) {
		return function boundFn() {
			return fn.apply(context, arguments);
		};
	}

	/**
	 * let a boolean value also be a function that must return a boolean
	 * this first item in args will be used as the context
	 * @param {Boolean|Function} val
	 * @param {Array} [args]
	 * @returns {Boolean}
	 */
	function boolOrFn(val, args) {
		if(typeof val == TYPE_FUNCTION) {
			return val.apply(args ? args[0] || undefined : undefined, args);
		}
		return val;
	}

	/**
	 * use the val2 when val1 is undefined
	 * @param {*} val1
	 * @param {*} val2
	 * @returns {*}
	 */
	function ifUndefined(val1, val2) {
		return(val1 === undefined) ? val2 : val1;
	}

	/**
	 * addEventListener with multiple events at once
	 * @param {EventTarget} target
	 * @param {String} types
	 * @param {Function} handler
	 */
	function addEventListeners(target, types, handler) {
		each(splitStr(types), function(type) {
			target.addEventListener(type, handler, false);
		});
	}

	/**
	 * removeEventListener with multiple events at once
	 * @param {EventTarget} target
	 * @param {String} types
	 * @param {Function} handler
	 */
	function removeEventListeners(target, types, handler) {
		each(splitStr(types), function(type) {
			target.removeEventListener(type, handler, false);
		});
	}

	/**
	 * find if a node is in the given parent
	 * @method hasParent
	 * @param {HTMLElement} node
	 * @param {HTMLElement} parent
	 * @return {Boolean} found
	 */
	function hasParent(node, parent) {
		while(node) {
			if(node == parent) {
				return true;
			}
			node = node.parentNode;
		}
		return false;
	}

	/**
	 * small indexOf wrapper
	 * @param {String} str
	 * @param {String} find
	 * @returns {Boolean} found
	 */
	function inStr(str, find) {
		return str.indexOf(find) > -1;
	}

	/**
	 * split string on whitespace
	 * @param {String} str
	 * @returns {Array} words
	 */
	function splitStr(str) {
		return str.trim().split(/\s+/g);
	}

	/**
	 * find if a array contains the object using indexOf or a simple polyFill
	 * @param {Array} src
	 * @param {String} find
	 * @param {String} [findByKey]
	 * @return {Boolean|Number} false when not found, or the index
	 */
	function inArray(src, find, findByKey) {
		if(src.indexOf && !findByKey) {
			return src.indexOf(find);
		} else {
			var i = 0;
			while(i < src.length) {
				if((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
					return i;
				}
				i++;
			}
			return -1;
		}
	}

	/**
	 * convert array-like objects to real arrays
	 * @param {Object} obj
	 * @returns {Array}
	 */
	function toArray(obj) {
		return Array.prototype.slice.call(obj, 0);
	}

	/**
	 * unique array with objects based on a key (like 'id') or just by the array's value
	 * @param {Array} src [{id:1},{id:2},{id:1}]
	 * @param {String} [key]
	 * @param {Boolean} [sort=False]
	 * @returns {Array} [{id:1},{id:2}]
	 */
	function uniqueArray(src, key, sort) {
		var results = [];
		var values = [];
		var i = 0;

		while(i < src.length) {
			var val = key ? src[i][key] : src[i];
			if(inArray(values, val) < 0) {
				results.push(src[i]);
			}
			values[i] = val;
			i++;
		}

		if(sort) {
			if(!key) {
				results = results.sort();
			} else {
				results = results.sort(function sortUniqueArray(a, b) {
					return a[key] > b[key];
				});
			}
		}

		return results;
	}

	/**
	 * get the prefixed property
	 * @param {Object} obj
	 * @param {String} property
	 * @returns {String|Undefined} prefixed
	 */
	function prefixed(obj, property) {
		var prefix, prop;
		var camelProp = property[0].toUpperCase() + property.slice(1);

		var i = 0;
		while(i < VENDOR_PREFIXES.length) {
			prefix = VENDOR_PREFIXES[i];
			prop = (prefix) ? prefix + camelProp : property;

			if(prop in obj) {
				return prop;
			}
			i++;
		}
		return undefined;
	}

	/**
	 * get a unique id
	 * @returns {number} uniqueId
	 */
	var _uniqueId = 1;

	function uniqueId() {
		return _uniqueId++;
	}

	/**
	 * get the window object of an element
	 * @param {HTMLElement} element
	 * @returns {DocumentView|Window}
	 */
	function getWindowForElement(element) {
		var doc = element.ownerDocument || element;
		return(doc.defaultView || doc.parentWindow || window);
	}

	var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

	var SUPPORT_TOUCH = ('ontouchstart' in window);
	var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
	var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

	var INPUT_TYPE_TOUCH = 'touch';
	var INPUT_TYPE_PEN = 'pen';
	var INPUT_TYPE_MOUSE = 'mouse';
	var INPUT_TYPE_KINECT = 'kinect';

	var COMPUTE_INTERVAL = 25;

	var INPUT_START = 1;
	var INPUT_MOVE = 2;
	var INPUT_END = 4;
	var INPUT_CANCEL = 8;

	var DIRECTION_NONE = 1;
	var DIRECTION_LEFT = 2;
	var DIRECTION_RIGHT = 4;
	var DIRECTION_UP = 8;
	var DIRECTION_DOWN = 16;

	var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
	var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
	var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

	var PROPS_XY = ['x', 'y'];
	var PROPS_CLIENT_XY = ['clientX', 'clientY'];

	/**
	 * create new input type manager
	 * @param {Manager} manager
	 * @param {Function} callback
	 * @returns {Input}
	 * @constructor
	 */
	function Input(manager, callback) {
		var self = this;
		this.manager = manager;
		this.callback = callback;
		this.element = manager.element;
		this.target = manager.options.inputTarget;

		// smaller wrapper around the handler, for the scope and the enabled state of the manager,
		// so when disabled the input events are completely bypassed.
		this.domHandler = function(ev) {
			if(boolOrFn(manager.options.enable, [manager])) {
				self.handler(ev);
			}
		};

		this.init();

	}

	Input.prototype = {
		/**
		 * should handle the inputEvent data and trigger the callback
		 * @virtual
		 */
		handler: function() {},

		/**
		 * bind the events
		 */
		init: function() {
			this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
			this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
			this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
		},

		/**
		 * unbind the events
		 */
		destroy: function() {
			this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
			this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
			this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
		}
	};

	/**
	 * create new input type manager
	 * called by the Manager constructor
	 * @param {Hammer} manager
	 * @returns {Input}
	 */
	function createInputInstance(manager) {
		var Type;
		var inputClass = manager.options.inputClass;

		if(inputClass) {
			Type = inputClass;
		} else if(SUPPORT_POINTER_EVENTS) {
			Type = PointerEventInput;
		} else if(SUPPORT_ONLY_TOUCH) {
			Type = TouchInput;
		} else if(!SUPPORT_TOUCH) {
			Type = MouseInput;
		} else {
			Type = TouchMouseInput;
		}
		return new(Type)(manager, inputHandler);
	}

	/**
	 * handle input events
	 * @param {Manager} manager
	 * @param {String} eventType
	 * @param {Object} input
	 */
	function inputHandler(manager, eventType, input) {
		var pointersLen = input.pointers.length;
		var changedPointersLen = input.changedPointers.length;
		var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
		var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

		input.isFirst = !!isFirst;
		input.isFinal = !!isFinal;

		if(isFirst) {
			manager.session = {};
		}

		// source event is the normalized value of the domEvents
		// like 'touchstart, mouseup, pointerdown'
		input.eventType = eventType;

		// compute scale, rotation etc
		computeInputData(manager, input);

		// emit secret event
		manager.emit('hammer.input', input);

		manager.recognize(input);
		manager.session.prevInput = input;
	}

	/**
	 * extend the data with some usable properties like scale, rotate, velocity etc
	 * @param {Object} manager
	 * @param {Object} input
	 */
	function computeInputData(manager, input) {
		var session = manager.session;
		var pointers = input.pointers;
		var pointersLength = pointers.length;

		// store the first input to calculate the distance and direction
		if(!session.firstInput) {
			session.firstInput = simpleCloneInputData(input);
		}

		// to compute scale and rotation we need to store the multiple touches
		if(pointersLength > 1 && !session.firstMultiple) {
			session.firstMultiple = simpleCloneInputData(input);
		} else if(pointersLength === 1) {
			session.firstMultiple = false;
		}

		var firstInput = session.firstInput;
		var firstMultiple = session.firstMultiple;
		var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

		var center = input.center = getCenter(pointers);
		input.timeStamp = now();
		input.deltaTime = input.timeStamp - firstInput.timeStamp;

		input.angle = getAngle(offsetCenter, center);
		input.distance = getDistance(offsetCenter, center);

		computeDeltaXY(session, input);
		input.offsetDirection = getDirection(input.deltaX, input.deltaY);

		var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
		input.overallVelocityX = overallVelocity.x;
		input.overallVelocityY = overallVelocity.y;
		input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

		input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
		input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

		input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
			session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

		computeIntervalInputData(session, input);

		// find the correct target
		var target = manager.element;
		if(hasParent(input.srcEvent.target, target)) {
			target = input.srcEvent.target;
		}
		input.target = target;
	}

	function computeDeltaXY(session, input) {
		var center = input.center;
		var offset = session.offsetDelta || {};
		var prevDelta = session.prevDelta || {};
		var prevInput = session.prevInput || {};

		if(input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
			prevDelta = session.prevDelta = {
				x: prevInput.deltaX || 0,
				y: prevInput.deltaY || 0
			};

			offset = session.offsetDelta = {
				x: center.x,
				y: center.y
			};
		}

		input.deltaX = prevDelta.x + (center.x - offset.x);
		input.deltaY = prevDelta.y + (center.y - offset.y);
	}

	/**
	 * velocity is calculated every x ms
	 * @param {Object} session
	 * @param {Object} input
	 */
	function computeIntervalInputData(session, input) {
		var last = session.lastInterval || input,
			deltaTime = input.timeStamp - last.timeStamp,
			velocity, velocityX, velocityY, direction;

		if(input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
			var deltaX = input.deltaX - last.deltaX;
			var deltaY = input.deltaY - last.deltaY;

			var v = getVelocity(deltaTime, deltaX, deltaY);
			velocityX = v.x;
			velocityY = v.y;
			velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
			direction = getDirection(deltaX, deltaY);

			session.lastInterval = input;
		} else {
			// use latest velocity info if it doesn't overtake a minimum period
			velocity = last.velocity;
			velocityX = last.velocityX;
			velocityY = last.velocityY;
			direction = last.direction;
		}

		input.velocity = velocity;
		input.velocityX = velocityX;
		input.velocityY = velocityY;
		input.direction = direction;
	}

	/**
	 * create a simple clone from the input used for storage of firstInput and firstMultiple
	 * @param {Object} input
	 * @returns {Object} clonedInputData
	 */
	function simpleCloneInputData(input) {
		// make a simple copy of the pointers because we will get a reference if we don't
		// we only need clientXY for the calculations
		var pointers = [];
		var i = 0;
		while(i < input.pointers.length) {
			pointers[i] = {
				clientX: round(input.pointers[i].clientX),
				clientY: round(input.pointers[i].clientY)
			};
			i++;
		}

		return {
			timeStamp: now(),
			pointers: pointers,
			center: getCenter(pointers),
			deltaX: input.deltaX,
			deltaY: input.deltaY
		};
	}

	/**
	 * get the center of all the pointers
	 * @param {Array} pointers
	 * @return {Object} center contains `x` and `y` properties
	 */
	function getCenter(pointers) {
		var pointersLength = pointers.length;

		// no need to loop when only one touch
		if(pointersLength === 1) {
			return {
				x: round(pointers[0].clientX),
				y: round(pointers[0].clientY)
			};
		}

		var x = 0,
			y = 0,
			i = 0;
		while(i < pointersLength) {
			x += pointers[i].clientX;
			y += pointers[i].clientY;
			i++;
		}

		return {
			x: round(x / pointersLength),
			y: round(y / pointersLength)
		};
	}

	/**
	 * calculate the velocity between two points. unit is in px per ms.
	 * @param {Number} deltaTime
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Object} velocity `x` and `y`
	 */
	function getVelocity(deltaTime, x, y) {
		return {
			x: x / deltaTime || 0,
			y: y / deltaTime || 0
		};
	}

	/**
	 * get the direction between two points
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Number} direction
	 */
	function getDirection(x, y) {
		if(x === y) {
			return DIRECTION_NONE;
		}

		if(abs(x) >= abs(y)) {
			return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
		}
		return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
	}

	/**
	 * calculate the absolute distance between two points
	 * @param {Object} p1 {x, y}
	 * @param {Object} p2 {x, y}
	 * @param {Array} [props] containing x and y keys
	 * @return {Number} distance
	 */
	function getDistance(p1, p2, props) {
		if(!props) {
			props = PROPS_XY;
		}
		var x = p2[props[0]] - p1[props[0]],
			y = p2[props[1]] - p1[props[1]];

		return Math.sqrt((x * x) + (y * y));
	}

	/**
	 * calculate the angle between two coordinates
	 * @param {Object} p1
	 * @param {Object} p2
	 * @param {Array} [props] containing x and y keys
	 * @return {Number} angle
	 */
	function getAngle(p1, p2, props) {
		if(!props) {
			props = PROPS_XY;
		}
		var x = p2[props[0]] - p1[props[0]],
			y = p2[props[1]] - p1[props[1]];
		return Math.atan2(y, x) * 180 / Math.PI;
	}

	/**
	 * calculate the rotation degrees between two pointersets
	 * @param {Array} start array of pointers
	 * @param {Array} end array of pointers
	 * @return {Number} rotation
	 */
	function getRotation(start, end) {
		return getAngle(end[1], end[0], PROPS_CLIENT_XY) - getAngle(start[1], start[0], PROPS_CLIENT_XY);
	}

	/**
	 * calculate the scale factor between two pointersets
	 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
	 * @param {Array} start array of pointers
	 * @param {Array} end array of pointers
	 * @return {Number} scale
	 */
	function getScale(start, end) {
		return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
	}

	var MOUSE_INPUT_MAP = {
		mousedown: INPUT_START,
		mousemove: INPUT_MOVE,
		mouseup: INPUT_END
	};

	var MOUSE_ELEMENT_EVENTS = 'mousedown';
	var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

	/**
	 * Mouse events input
	 * @constructor
	 * @extends Input
	 */
	function MouseInput() {
		this.evEl = MOUSE_ELEMENT_EVENTS;
		this.evWin = MOUSE_WINDOW_EVENTS;

		this.pressed = false; // mousedown state

		Input.apply(this, arguments);
	}

	inherit(MouseInput, Input, {
		/**
		 * handle mouse events
		 * @param {Object} ev
		 */
		handler: function MEhandler(ev) {
			var eventType = MOUSE_INPUT_MAP[ev.type];

			// on start we want to have the left mouse button down
			if(eventType & INPUT_START && ev.button === 0) {
				this.pressed = true;
			}

			if(eventType & INPUT_MOVE && ev.which !== 1) {
				eventType = INPUT_END;
			}

			// mouse must be down
			if(!this.pressed) {
				return;
			}

			if(eventType & INPUT_END) {
				this.pressed = false;
			}

			this.callback(this.manager, eventType, {
				pointers: [ev],
				changedPointers: [ev],
				pointerType: INPUT_TYPE_MOUSE,
				srcEvent: ev
			});
		}
	});

	var POINTER_INPUT_MAP = {
		pointerdown: INPUT_START,
		pointermove: INPUT_MOVE,
		pointerup: INPUT_END,
		pointercancel: INPUT_CANCEL,
		pointerout: INPUT_CANCEL
	};

	// in IE10 the pointer types is defined as an enum
	var IE10_POINTER_TYPE_ENUM = {
		2: INPUT_TYPE_TOUCH,
		3: INPUT_TYPE_PEN,
		4: INPUT_TYPE_MOUSE,
		5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
	};

	var POINTER_ELEMENT_EVENTS = 'pointerdown';
	var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

	// IE10 has prefixed support, and case-sensitive
	if(window.MSPointerEvent && !window.PointerEvent) {
		POINTER_ELEMENT_EVENTS = 'MSPointerDown';
		POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
	}

	/**
	 * Pointer events input
	 * @constructor
	 * @extends Input
	 */
	function PointerEventInput() {
		this.evEl = POINTER_ELEMENT_EVENTS;
		this.evWin = POINTER_WINDOW_EVENTS;

		Input.apply(this, arguments);

		this.store = (this.manager.session.pointerEvents = []);
	}

	inherit(PointerEventInput, Input, {
		/**
		 * handle mouse events
		 * @param {Object} ev
		 */
		handler: function PEhandler(ev) {
			var store = this.store;
			var removePointer = false;

			var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
			var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
			var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

			var isTouch = (pointerType === INPUT_TYPE_TOUCH);
			var isMouse = (pointerType === INPUT_TYPE_MOUSE);

			// get index of the event in the store
			var storeIndex = inArray(store, ev.pointerId, 'pointerId');

			// start and mouse must be down
			if(eventType & INPUT_START && (ev.button === 0 || isTouch)) {
				if(storeIndex < 0) {
					store.push(ev);
					storeIndex = store.length - 1;
				}
			} else if(eventType & (INPUT_END | INPUT_CANCEL)) {
				removePointer = true;
			}

			// it not found, so the pointer hasn't been down (so it's probably a hover)
			if(storeIndex < 0) {
				return;
			}

			// update the event in the store
			store[storeIndex] = ev;

			// Filter out mouse events since we handle them in our own handlers
			if(!isMouse) {
				this.callback(this.manager, eventType, {
					pointers: store,
					changedPointers: [ev],
					pointerType: pointerType,
					srcEvent: ev
				});
			}

			if(removePointer) {
				// remove from the store
				store.splice(storeIndex, 1);
			}
		}
	});

	var SINGLE_TOUCH_INPUT_MAP = {
		touchstart: INPUT_START,
		touchmove: INPUT_MOVE,
		touchend: INPUT_END,
		touchcancel: INPUT_CANCEL
	};

	var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
	var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

	/**
	 * Touch events input
	 * @constructor
	 * @extends Input
	 */
	function SingleTouchInput() {
		this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
		this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
		this.started = false;

		Input.apply(this, arguments);
	}

	inherit(SingleTouchInput, Input, {
		handler: function TEhandler(ev) {
			var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

			// should we handle the touch events?
			if(type === INPUT_START) {
				this.started = true;
			}

			if(!this.started) {
				return;
			}

			var touches = normalizeSingleTouches.call(this, ev, type);

			// when done, reset the started state
			if(type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
				this.started = false;
			}

			this.callback(this.manager, type, {
				pointers: touches[0],
				changedPointers: touches[1],
				pointerType: INPUT_TYPE_TOUCH,
				srcEvent: ev
			});
		}
	});

	/**
	 * @this {TouchInput}
	 * @param {Object} ev
	 * @param {Number} type flag
	 * @returns {undefined|Array} [all, changed]
	 */
	function normalizeSingleTouches(ev, type) {
		var all = toArray(ev.touches);
		var changed = toArray(ev.changedTouches);

		if(type & (INPUT_END | INPUT_CANCEL)) {
			all = uniqueArray(all.concat(changed), 'identifier', true);
		}

		return [all, changed];
	}

	var TOUCH_INPUT_MAP = {
		touchstart: INPUT_START,
		touchmove: INPUT_MOVE,
		touchend: INPUT_END,
		touchcancel: INPUT_CANCEL
	};

	var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

	/**
	 * Multi-user touch events input
	 * @constructor
	 * @extends Input
	 */
	function TouchInput() {
		this.evTarget = TOUCH_TARGET_EVENTS;
		this.targetIds = {};

		Input.apply(this, arguments);
	}

	inherit(TouchInput, Input, {
		handler: function MTEhandler(ev) {
			var type = TOUCH_INPUT_MAP[ev.type];
			var touches = getTouches.call(this, ev, type);
			if(!touches) {
				return;
			}

			this.callback(this.manager, type, {
				pointers: touches[0],
				changedPointers: touches[1],
				pointerType: INPUT_TYPE_TOUCH,
				srcEvent: ev
			});
		}
	});

	/**
	 * @this {TouchInput}
	 * @param {Object} ev
	 * @param {Number} type flag
	 * @returns {undefined|Array} [all, changed]
	 */
	function getTouches(ev, type) {
		var allTouches = toArray(ev.touches);
		var targetIds = this.targetIds;

		// when there is only one touch, the process can be simplified
		if(type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
			targetIds[allTouches[0].identifier] = true;
			return [allTouches, allTouches];
		}

		var i,
			targetTouches,
			changedTouches = toArray(ev.changedTouches),
			changedTargetTouches = [],
			target = this.target;

		// get target touches from touches
		targetTouches = allTouches.filter(function(touch) {
			return hasParent(touch.target, target);
		});

		// collect touches
		if(type === INPUT_START) {
			i = 0;
			while(i < targetTouches.length) {
				targetIds[targetTouches[i].identifier] = true;
				i++;
			}
		}

		// filter changed touches to only contain touches that exist in the collected target ids
		i = 0;
		while(i < changedTouches.length) {
			if(targetIds[changedTouches[i].identifier]) {
				changedTargetTouches.push(changedTouches[i]);
			}

			// cleanup removed touches
			if(type & (INPUT_END | INPUT_CANCEL)) {
				delete targetIds[changedTouches[i].identifier];
			}
			i++;
		}

		if(!changedTargetTouches.length) {
			return;
		}

		return [
			// merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
			uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
			changedTargetTouches
		];
	}

	/**
	 * Combined touch and mouse input
	 *
	 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
	 * This because touch devices also emit mouse events while doing a touch.
	 *
	 * @constructor
	 * @extends Input
	 */

	var DEDUP_TIMEOUT = 2500;
	var DEDUP_DISTANCE = 25;

	function TouchMouseInput() {
		Input.apply(this, arguments);

		var handler = bindFn(this.handler, this);
		this.touch = new TouchInput(this.manager, handler);
		this.mouse = new MouseInput(this.manager, handler);

		this.primaryTouch = null;
		this.lastTouches = [];
	}

	inherit(TouchMouseInput, Input, {
		/**
		 * handle mouse and touch events
		 * @param {Hammer} manager
		 * @param {String} inputEvent
		 * @param {Object} inputData
		 */
		handler: function TMEhandler(manager, inputEvent, inputData) {
			var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
				isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

			if(isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
				return;
			}

			// when we're in a touch event, record touches to  de-dupe synthetic mouse event
			if(isTouch) {
				recordTouches.call(this, inputEvent, inputData);
			} else if(isMouse && isSyntheticEvent.call(this, inputData)) {
				return;
			}

			this.callback(manager, inputEvent, inputData);
		},

		/**
		 * remove the event listeners
		 */
		destroy: function destroy() {
			this.touch.destroy();
			this.mouse.destroy();
		}
	});

	function recordTouches(eventType, eventData) {
		if(eventType & INPUT_START) {
			this.primaryTouch = eventData.changedPointers[0].identifier;
			setLastTouch.call(this, eventData);
		} else if(eventType & (INPUT_END | INPUT_CANCEL)) {
			setLastTouch.call(this, eventData);
		}
	}

	function setLastTouch(eventData) {
		var touch = eventData.changedPointers[0];

		if(touch.identifier === this.primaryTouch) {
			var lastTouch = {
				x: touch.clientX,
				y: touch.clientY
			};
			this.lastTouches.push(lastTouch);
			var lts = this.lastTouches;
			var removeLastTouch = function() {
				var i = lts.indexOf(lastTouch);
				if(i > -1) {
					lts.splice(i, 1);
				}
			};
			setTimeout(removeLastTouch, DEDUP_TIMEOUT);
		}
	}

	function isSyntheticEvent(eventData) {
		var x = eventData.srcEvent.clientX,
			y = eventData.srcEvent.clientY;
		for(var i = 0; i < this.lastTouches.length; i++) {
			var t = this.lastTouches[i];
			var dx = Math.abs(x - t.x),
				dy = Math.abs(y - t.y);
			if(dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
				return true;
			}
		}
		return false;
	}

	var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
	var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

	// magical touchAction value
	var TOUCH_ACTION_COMPUTE = 'compute';
	var TOUCH_ACTION_AUTO = 'auto';
	var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
	var TOUCH_ACTION_NONE = 'none';
	var TOUCH_ACTION_PAN_X = 'pan-x';
	var TOUCH_ACTION_PAN_Y = 'pan-y';
	var TOUCH_ACTION_MAP = getTouchActionProps();

	/**
	 * Touch Action
	 * sets the touchAction property or uses the js alternative
	 * @param {Manager} manager
	 * @param {String} value
	 * @constructor
	 */
	function TouchAction(manager, value) {
		this.manager = manager;
		this.set(value);
	}

	TouchAction.prototype = {
		/**
		 * set the touchAction value on the element or enable the polyfill
		 * @param {String} value
		 */
		set: function(value) {
			// find out the touch-action by the event handlers
			if(value == TOUCH_ACTION_COMPUTE) {
				value = this.compute();
			}

			if(NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
				this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
			}
			this.actions = value.toLowerCase().trim();
		},

		/**
		 * just re-set the touchAction value
		 */
		update: function() {
			this.set(this.manager.options.touchAction);
		},

		/**
		 * compute the value for the touchAction property based on the recognizer's settings
		 * @returns {String} value
		 */
		compute: function() {
			var actions = [];
			each(this.manager.recognizers, function(recognizer) {
				if(boolOrFn(recognizer.options.enable, [recognizer])) {
					actions = actions.concat(recognizer.getTouchAction());
				}
			});
			return cleanTouchActions(actions.join(' '));
		},

		/**
		 * this method is called on each input cycle and provides the preventing of the browser behavior
		 * @param {Object} input
		 */
		preventDefaults: function(input) {
			var srcEvent = input.srcEvent;
			var direction = input.offsetDirection;

			// if the touch action did prevented once this session
			if(this.manager.session.prevented) {
				srcEvent.preventDefault();
				return;
			}

			var actions = this.actions;
			var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
			var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
			var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

			if(hasNone) {
				//do not prevent defaults if this is a tap gesture

				var isTapPointer = input.pointers.length === 1;
				var isTapMovement = input.distance < 2;
				var isTapTouchTime = input.deltaTime < 250;

				if(isTapPointer && isTapMovement && isTapTouchTime) {
					return;
				}
			}

			if(hasPanX && hasPanY) {
				// `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
				return;
			}

			if(hasNone ||
				(hasPanY && direction & DIRECTION_HORIZONTAL) ||
				(hasPanX && direction & DIRECTION_VERTICAL)) {
				return this.preventSrc(srcEvent);
			}
		},

		/**
		 * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
		 * @param {Object} srcEvent
		 */
		preventSrc: function(srcEvent) {
			this.manager.session.prevented = true;
			srcEvent.preventDefault();
		}
	};

	/**
	 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
	 * @param {String} actions
	 * @returns {*}
	 */
	function cleanTouchActions(actions) {
		// none
		if(inStr(actions, TOUCH_ACTION_NONE)) {
			return TOUCH_ACTION_NONE;
		}

		var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
		var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

		// if both pan-x and pan-y are set (different recognizers
		// for different directions, e.g. horizontal pan but vertical swipe?)
		// we need none (as otherwise with pan-x pan-y combined none of these
		// recognizers will work, since the browser would handle all panning
		if(hasPanX && hasPanY) {
			return TOUCH_ACTION_NONE;
		}

		// pan-x OR pan-y
		if(hasPanX || hasPanY) {
			return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
		}

		// manipulation
		if(inStr(actions, TOUCH_ACTION_MANIPULATION)) {
			return TOUCH_ACTION_MANIPULATION;
		}

		return TOUCH_ACTION_AUTO;
	}

	function getTouchActionProps() {
		if(!NATIVE_TOUCH_ACTION) {
			return false;
		}
		var touchMap = {};
		var cssSupports = window.CSS && window.CSS.supports;
		['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

			// If css.supports is not supported but there is native touch-action assume it supports
			// all values. This is the case for IE 10 and 11.
			touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
		});
		return touchMap;
	}

	/**
	 * Recognizer flow explained; *
	 * All recognizers have the initial state of POSSIBLE when a input session starts.
	 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
	 * Example session for mouse-input: mousedown -> mousemove -> mouseup
	 *
	 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
	 * which determines with state it should be.
	 *
	 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
	 * POSSIBLE to give it another change on the next cycle.
	 *
	 *               Possible
	 *                  |
	 *            +-----+---------------+
	 *            |                     |
	 *      +-----+-----+               |
	 *      |           |               |
	 *   Failed      Cancelled          |
	 *                          +-------+------+
	 *                          |              |
	 *                      Recognized       Began
	 *                                         |
	 *                                      Changed
	 *                                         |
	 *                                  Ended/Recognized
	 */
	var STATE_POSSIBLE = 1;
	var STATE_BEGAN = 2;
	var STATE_CHANGED = 4;
	var STATE_ENDED = 8;
	var STATE_RECOGNIZED = STATE_ENDED;
	var STATE_CANCELLED = 16;
	var STATE_FAILED = 32;

	/**
	 * Recognizer
	 * Every recognizer needs to extend from this class.
	 * @constructor
	 * @param {Object} options
	 */
	function Recognizer(options) {
		this.options = assign({}, this.defaults, options || {});

		this.id = uniqueId();

		this.manager = null;

		// default is enable true
		this.options.enable = ifUndefined(this.options.enable, true);

		this.state = STATE_POSSIBLE;

		this.simultaneous = {};
		this.requireFail = [];
	}

	Recognizer.prototype = {
		/**
		 * @virtual
		 * @type {Object}
		 */
		defaults: {},

		/**
		 * set options
		 * @param {Object} options
		 * @return {Recognizer}
		 */
		set: function(options) {
			assign(this.options, options);

			// also update the touchAction, in case something changed about the directions/enabled state
			this.manager && this.manager.touchAction.update();
			return this;
		},

		/**
		 * recognize simultaneous with an other recognizer.
		 * @param {Recognizer} otherRecognizer
		 * @returns {Recognizer} this
		 */
		recognizeWith: function(otherRecognizer) {
			if(invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
				return this;
			}

			var simultaneous = this.simultaneous;
			otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
			if(!simultaneous[otherRecognizer.id]) {
				simultaneous[otherRecognizer.id] = otherRecognizer;
				otherRecognizer.recognizeWith(this);
			}
			return this;
		},

		/**
		 * drop the simultaneous link. it doesnt remove the link on the other recognizer.
		 * @param {Recognizer} otherRecognizer
		 * @returns {Recognizer} this
		 */
		dropRecognizeWith: function(otherRecognizer) {
			if(invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
				return this;
			}

			otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
			delete this.simultaneous[otherRecognizer.id];
			return this;
		},

		/**
		 * recognizer can only run when an other is failing
		 * @param {Recognizer} otherRecognizer
		 * @returns {Recognizer} this
		 */
		requireFailure: function(otherRecognizer) {
			if(invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
				return this;
			}

			var requireFail = this.requireFail;
			otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
			if(inArray(requireFail, otherRecognizer) === -1) {
				requireFail.push(otherRecognizer);
				otherRecognizer.requireFailure(this);
			}
			return this;
		},

		/**
		 * drop the requireFailure link. it does not remove the link on the other recognizer.
		 * @param {Recognizer} otherRecognizer
		 * @returns {Recognizer} this
		 */
		dropRequireFailure: function(otherRecognizer) {
			if(invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
				return this;
			}

			otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
			var index = inArray(this.requireFail, otherRecognizer);
			if(index > -1) {
				this.requireFail.splice(index, 1);
			}
			return this;
		},

		/**
		 * has require failures boolean
		 * @returns {boolean}
		 */
		hasRequireFailures: function() {
			return this.requireFail.length > 0;
		},

		/**
		 * if the recognizer can recognize simultaneous with an other recognizer
		 * @param {Recognizer} otherRecognizer
		 * @returns {Boolean}
		 */
		canRecognizeWith: function(otherRecognizer) {
			return !!this.simultaneous[otherRecognizer.id];
		},

		/**
		 * You should use `tryEmit` instead of `emit` directly to check
		 * that all the needed recognizers has failed before emitting.
		 * @param {Object} input
		 */
		emit: function(input) {
			var self = this;
			var state = this.state;

			function emit(event) {
				self.manager.emit(event, input);
			}

			// 'panstart' and 'panmove'
			if(state < STATE_ENDED) {
				emit(self.options.event + stateStr(state));
			}

			emit(self.options.event); // simple 'eventName' events

			if(input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
				emit(input.additionalEvent);
			}

			// panend and pancancel
			if(state >= STATE_ENDED) {
				emit(self.options.event + stateStr(state));
			}
		},

		/**
		 * Check that all the require failure recognizers has failed,
		 * if true, it emits a gesture event,
		 * otherwise, setup the state to FAILED.
		 * @param {Object} input
		 */
		tryEmit: function(input) {
			if(this.canEmit()) {
				return this.emit(input);
			}
			// it's failing anyway
			this.state = STATE_FAILED;
		},

		/**
		 * can we emit?
		 * @returns {boolean}
		 */
		canEmit: function() {
			var i = 0;
			while(i < this.requireFail.length) {
				if(!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
					return false;
				}
				i++;
			}
			return true;
		},

		/**
		 * update the recognizer
		 * @param {Object} inputData
		 */
		recognize: function(inputData) {
			// make a new copy of the inputData
			// so we can change the inputData without messing up the other recognizers
			var inputDataClone = assign({}, inputData);

			// is is enabled and allow recognizing?
			if(!boolOrFn(this.options.enable, [this, inputDataClone])) {
				this.reset();
				this.state = STATE_FAILED;
				return;
			}

			// reset when we've reached the end
			if(this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
				this.state = STATE_POSSIBLE;
			}

			this.state = this.process(inputDataClone);

			// the recognizer has recognized a gesture
			// so trigger an event
			if(this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
				this.tryEmit(inputDataClone);
			}
		},

		/**
		 * return the state of the recognizer
		 * the actual recognizing happens in this method
		 * @virtual
		 * @param {Object} inputData
		 * @returns {Const} STATE
		 */
		process: function(inputData) {}, // jshint ignore:line

		/**
		 * return the preferred touch-action
		 * @virtual
		 * @returns {Array}
		 */
		getTouchAction: function() {},

		/**
		 * called when the gesture isn't allowed to recognize
		 * like when another is being recognized or it is disabled
		 * @virtual
		 */
		reset: function() {}
	};

	/**
	 * get a usable string, used as event postfix
	 * @param {Const} state
	 * @returns {String} state
	 */
	function stateStr(state) {
		if(state & STATE_CANCELLED) {
			return 'cancel';
		} else if(state & STATE_ENDED) {
			return 'end';
		} else if(state & STATE_CHANGED) {
			return 'move';
		} else if(state & STATE_BEGAN) {
			return 'start';
		}
		return '';
	}

	/**
	 * direction cons to string
	 * @param {Const} direction
	 * @returns {String}
	 */
	function directionStr(direction) {
		if(direction == DIRECTION_DOWN) {
			return 'down';
		} else if(direction == DIRECTION_UP) {
			return 'up';
		} else if(direction == DIRECTION_LEFT) {
			return 'left';
		} else if(direction == DIRECTION_RIGHT) {
			return 'right';
		}
		return '';
	}

	/**
	 * get a recognizer by name if it is bound to a manager
	 * @param {Recognizer|String} otherRecognizer
	 * @param {Recognizer} recognizer
	 * @returns {Recognizer}
	 */
	function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
		var manager = recognizer.manager;
		if(manager) {
			return manager.get(otherRecognizer);
		}
		return otherRecognizer;
	}

	/**
	 * This recognizer is just used as a base for the simple attribute recognizers.
	 * @constructor
	 * @extends Recognizer
	 */
	function AttrRecognizer() {
		Recognizer.apply(this, arguments);
	}

	inherit(AttrRecognizer, Recognizer, {
		/**
		 * @namespace
		 * @memberof AttrRecognizer
		 */
		defaults: {
			/**
			 * @type {Number}
			 * @default 1
			 */
			pointers: 1
		},

		/**
		 * Used to check if it the recognizer receives valid input, like input.distance > 10.
		 * @memberof AttrRecognizer
		 * @param {Object} input
		 * @returns {Boolean} recognized
		 */
		attrTest: function(input) {
			var optionPointers = this.options.pointers;
			return optionPointers === 0 || input.pointers.length === optionPointers;
		},

		/**
		 * Process the input and return the state for the recognizer
		 * @memberof AttrRecognizer
		 * @param {Object} input
		 * @returns {*} State
		 */
		process: function(input) {
			var state = this.state;
			var eventType = input.eventType;

			var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
			var isValid = this.attrTest(input);

			// on cancel input and we've recognized before, return STATE_CANCELLED
			if(isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
				return state | STATE_CANCELLED;
			} else if(isRecognized || isValid) {
				if(eventType & INPUT_END) {
					return state | STATE_ENDED;
				} else if(!(state & STATE_BEGAN)) {
					return STATE_BEGAN;
				}
				return state | STATE_CHANGED;
			}
			return STATE_FAILED;
		}
	});

	/**
	 * Pan
	 * Recognized when the pointer is down and moved in the allowed direction.
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function PanRecognizer() {
		AttrRecognizer.apply(this, arguments);

		this.pX = null;
		this.pY = null;
	}

	inherit(PanRecognizer, AttrRecognizer, {
		/**
		 * @namespace
		 * @memberof PanRecognizer
		 */
		defaults: {
			event: 'pan',
			threshold: 10,
			pointers: 1,
			direction: DIRECTION_ALL
		},

		getTouchAction: function() {
			var direction = this.options.direction;
			var actions = [];
			if(direction & DIRECTION_HORIZONTAL) {
				actions.push(TOUCH_ACTION_PAN_Y);
			}
			if(direction & DIRECTION_VERTICAL) {
				actions.push(TOUCH_ACTION_PAN_X);
			}
			return actions;
		},

		directionTest: function(input) {
			var options = this.options;
			var hasMoved = true;
			var distance = input.distance;
			var direction = input.direction;
			var x = input.deltaX;
			var y = input.deltaY;

			// lock to axis?
			if(!(direction & options.direction)) {
				if(options.direction & DIRECTION_HORIZONTAL) {
					direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
					hasMoved = x != this.pX;
					distance = Math.abs(input.deltaX);
				} else {
					direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
					hasMoved = y != this.pY;
					distance = Math.abs(input.deltaY);
				}
			}
			input.direction = direction;
			return hasMoved && distance > options.threshold && direction & options.direction;
		},

		attrTest: function(input) {
			return AttrRecognizer.prototype.attrTest.call(this, input) &&
				(this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
		},

		emit: function(input) {

			this.pX = input.deltaX;
			this.pY = input.deltaY;

			var direction = directionStr(input.direction);

			if(direction) {
				input.additionalEvent = this.options.event + direction;
			}
			this._super.emit.call(this, input);
		}
	});

	/**
	 * Pinch
	 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function PinchRecognizer() {
		AttrRecognizer.apply(this, arguments);
	}

	inherit(PinchRecognizer, AttrRecognizer, {
		/**
		 * @namespace
		 * @memberof PinchRecognizer
		 */
		defaults: {
			event: 'pinch',
			threshold: 0,
			pointers: 2
		},

		getTouchAction: function() {
			return [TOUCH_ACTION_NONE];
		},

		attrTest: function(input) {
			return this._super.attrTest.call(this, input) &&
				(Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
		},

		emit: function(input) {
			if(input.scale !== 1) {
				var inOut = input.scale < 1 ? 'in' : 'out';
				input.additionalEvent = this.options.event + inOut;
			}
			this._super.emit.call(this, input);
		}
	});

	/**
	 * Press
	 * Recognized when the pointer is down for x ms without any movement.
	 * @constructor
	 * @extends Recognizer
	 */
	function PressRecognizer() {
		Recognizer.apply(this, arguments);

		this._timer = null;
		this._input = null;
	}

	inherit(PressRecognizer, Recognizer, {
		/**
		 * @namespace
		 * @memberof PressRecognizer
		 */
		defaults: {
			event: 'press',
			pointers: 1,
			time: 251, // minimal time of the pointer to be pressed
			threshold: 9 // a minimal movement is ok, but keep it low
		},

		getTouchAction: function() {
			return [TOUCH_ACTION_AUTO];
		},

		process: function(input) {
			var options = this.options;
			var validPointers = input.pointers.length === options.pointers;
			var validMovement = input.distance < options.threshold;
			var validTime = input.deltaTime > options.time;

			this._input = input;

			// we only allow little movement
			// and we've reached an end event, so a tap is possible
			if(!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
				this.reset();
			} else if(input.eventType & INPUT_START) {
				this.reset();
				this._timer = setTimeoutContext(function() {
					this.state = STATE_RECOGNIZED;
					this.tryEmit();
				}, options.time, this);
			} else if(input.eventType & INPUT_END) {
				return STATE_RECOGNIZED;
			}
			return STATE_FAILED;
		},

		reset: function() {
			clearTimeout(this._timer);
		},

		emit: function(input) {
			if(this.state !== STATE_RECOGNIZED) {
				return;
			}

			if(input && (input.eventType & INPUT_END)) {
				this.manager.emit(this.options.event + 'up', input);
			} else {
				this._input.timeStamp = now();
				this.manager.emit(this.options.event, this._input);
			}
		}
	});

	/**
	 * Rotate
	 * Recognized when two or more pointer are moving in a circular motion.
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function RotateRecognizer() {
		AttrRecognizer.apply(this, arguments);
	}

	inherit(RotateRecognizer, AttrRecognizer, {
		/**
		 * @namespace
		 * @memberof RotateRecognizer
		 */
		defaults: {
			event: 'rotate',
			threshold: 0,
			pointers: 2
		},

		getTouchAction: function() {
			return [TOUCH_ACTION_NONE];
		},

		attrTest: function(input) {
			return this._super.attrTest.call(this, input) &&
				(Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
		}
	});

	/**
	 * Swipe
	 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function SwipeRecognizer() {
		AttrRecognizer.apply(this, arguments);
	}

	inherit(SwipeRecognizer, AttrRecognizer, {
		/**
		 * @namespace
		 * @memberof SwipeRecognizer
		 */
		defaults: {
			event: 'swipe',
			threshold: 10,
			velocity: 0.3,
			direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
			pointers: 1
		},

		getTouchAction: function() {
			return PanRecognizer.prototype.getTouchAction.call(this);
		},

		attrTest: function(input) {
			var direction = this.options.direction;
			var velocity;

			if(direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
				velocity = input.overallVelocity;
			} else if(direction & DIRECTION_HORIZONTAL) {
				velocity = input.overallVelocityX;
			} else if(direction & DIRECTION_VERTICAL) {
				velocity = input.overallVelocityY;
			}

			return this._super.attrTest.call(this, input) &&
				direction & input.offsetDirection &&
				input.distance > this.options.threshold &&
				input.maxPointers == this.options.pointers &&
				abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
		},

		emit: function(input) {
			var direction = directionStr(input.offsetDirection);
			if(direction) {
				this.manager.emit(this.options.event + direction, input);
			}

			this.manager.emit(this.options.event, input);
		}
	});

	/**
	 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
	 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
	 * a single tap.
	 *
	 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
	 * multi-taps being recognized.
	 * @constructor
	 * @extends Recognizer
	 */
	function TapRecognizer() {
		Recognizer.apply(this, arguments);

		// previous time and center,
		// used for tap counting
		this.pTime = false;
		this.pCenter = false;

		this._timer = null;
		this._input = null;
		this.count = 0;
	}

	inherit(TapRecognizer, Recognizer, {
		/**
		 * @namespace
		 * @memberof PinchRecognizer
		 */
		defaults: {
			event: 'tap',
			pointers: 1,
			taps: 1,
			interval: 300, // max time between the multi-tap taps
			time: 250, // max time of the pointer to be down (like finger on the screen)
			threshold: 9, // a minimal movement is ok, but keep it low
			posThreshold: 10 // a multi-tap can be a bit off the initial position
		},

		getTouchAction: function() {
			return [TOUCH_ACTION_MANIPULATION];
		},

		process: function(input) {
			var options = this.options;

			var validPointers = input.pointers.length === options.pointers;
			var validMovement = input.distance < options.threshold;
			var validTouchTime = input.deltaTime < options.time;

			this.reset();

			if((input.eventType & INPUT_START) && (this.count === 0)) {
				return this.failTimeout();
			}

			// we only allow little movement
			// and we've reached an end event, so a tap is possible
			if(validMovement && validTouchTime && validPointers) {
				if(input.eventType != INPUT_END) {
					return this.failTimeout();
				}

				var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
				var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

				this.pTime = input.timeStamp;
				this.pCenter = input.center;

				if(!validMultiTap || !validInterval) {
					this.count = 1;
				} else {
					this.count += 1;
				}

				this._input = input;

				// if tap count matches we have recognized it,
				// else it has began recognizing...
				var tapCount = this.count % options.taps;
				if(tapCount === 0) {
					// no failing requirements, immediately trigger the tap event
					// or wait as long as the multitap interval to trigger
					if(!this.hasRequireFailures()) {
						return STATE_RECOGNIZED;
					} else {
						this._timer = setTimeoutContext(function() {
							this.state = STATE_RECOGNIZED;
							this.tryEmit();
						}, options.interval, this);
						return STATE_BEGAN;
					}
				}
			}
			return STATE_FAILED;
		},

		failTimeout: function() {
			this._timer = setTimeoutContext(function() {
				this.state = STATE_FAILED;
			}, this.options.interval, this);
			return STATE_FAILED;
		},

		reset: function() {
			clearTimeout(this._timer);
		},

		emit: function() {
			if(this.state == STATE_RECOGNIZED) {
				this._input.tapCount = this.count;
				this.manager.emit(this.options.event, this._input);
			}
		}
	});

	/**
	 * Simple way to create a manager with a default set of recognizers.
	 * @param {HTMLElement} element
	 * @param {Object} [options]
	 * @constructor
	 */
	function Hammer(element, options) {
		options = options || {};
		options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
		return new Manager(element, options);
	}

	/**
	 * @const {string}
	 */
	Hammer.VERSION = '2.0.8';

	/**
	 * default settings
	 * @namespace
	 */
	Hammer.defaults = {
		/**
		 * set if DOM events are being triggered.
		 * But this is slower and unused by simple implementations, so disabled by default.
		 * @type {Boolean}
		 * @default false
		 */
		domEvents: false,

		/**
		 * The value for the touchAction property/fallback.
		 * When set to `compute` it will magically set the correct value based on the added recognizers.
		 * @type {String}
		 * @default compute
		 */
		touchAction: TOUCH_ACTION_COMPUTE,

		/**
		 * @type {Boolean}
		 * @default true
		 */
		enable: true,

		/**
		 * EXPERIMENTAL FEATURE -- can be removed/changed
		 * Change the parent input target element.
		 * If Null, then it is being set the to main element.
		 * @type {Null|EventTarget}
		 * @default null
		 */
		inputTarget: null,

		/**
		 * force an input class
		 * @type {Null|Function}
		 * @default null
		 */
		inputClass: null,

		/**
		 * Default recognizer setup when calling `Hammer()`
		 * When creating a new Manager these will be skipped.
		 * @type {Array}
		 */
		preset: [
			// RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
			[RotateRecognizer, {
				enable: false
			}],
			[PinchRecognizer, {
					enable: false
				},
				['rotate']
			],
			[SwipeRecognizer, {
				direction: DIRECTION_HORIZONTAL
			}],
			[PanRecognizer, {
					direction: DIRECTION_HORIZONTAL
				},
				['swipe']
			],
			[TapRecognizer],
			[TapRecognizer, {
					event: 'doubletap',
					taps: 2
				},
				['tap']
			],
			[PressRecognizer]
		],

		/**
		 * Some CSS properties can be used to improve the working of Hammer.
		 * Add them to this method and they will be set when creating a new Manager.
		 * @namespace
		 */
		cssProps: {
			/**
			 * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
			 * @type {String}
			 * @default 'none'
			 */
			userSelect: 'none',

			/**
			 * Disable the Windows Phone grippers when pressing an element.
			 * @type {String}
			 * @default 'none'
			 */
			touchSelect: 'none',

			/**
			 * Disables the default callout shown when you touch and hold a touch target.
			 * On iOS, when you touch and hold a touch target such as a link, Safari displays
			 * a callout containing information about the link. This property allows you to disable that callout.
			 * @type {String}
			 * @default 'none'
			 */
			touchCallout: 'none',

			/**
			 * Specifies whether zooming is enabled. Used by IE10>
			 * @type {String}
			 * @default 'none'
			 */
			contentZooming: 'none',

			/**
			 * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
			 * @type {String}
			 * @default 'none'
			 */
			userDrag: 'none',

			/**
			 * Overrides the highlight color shown when the user taps a link or a JavaScript
			 * clickable element in iOS. This property obeys the alpha value, if specified.
			 * @type {String}
			 * @default 'rgba(0,0,0,0)'
			 */
			tapHighlightColor: 'rgba(0,0,0,0)'
		}
	};

	var STOP = 1;
	var FORCED_STOP = 2;

	/**
	 * Manager
	 * @param {HTMLElement} element
	 * @param {Object} [options]
	 * @constructor
	 */
	function Manager(element, options) {
		this.options = assign({}, Hammer.defaults, options || {});

		this.options.inputTarget = this.options.inputTarget || element;

		this.handlers = {};
		this.session = {};
		this.recognizers = [];
		this.oldCssProps = {};

		this.element = element;
		this.input = createInputInstance(this);
		this.touchAction = new TouchAction(this, this.options.touchAction);

		toggleCssProps(this, true);

		each(this.options.recognizers, function(item) {
			var recognizer = this.add(new(item[0])(item[1]));
			item[2] && recognizer.recognizeWith(item[2]);
			item[3] && recognizer.requireFailure(item[3]);
		}, this);
	}

	Manager.prototype = {
		/**
		 * set options
		 * @param {Object} options
		 * @returns {Manager}
		 */
		set: function(options) {
			assign(this.options, options);

			// Options that need a little more setup
			if(options.touchAction) {
				this.touchAction.update();
			}
			if(options.inputTarget) {
				// Clean up existing event listeners and reinitialize
				this.input.destroy();
				this.input.target = options.inputTarget;
				this.input.init();
			}
			return this;
		},

		/**
		 * stop recognizing for this session.
		 * This session will be discarded, when a new [input]start event is fired.
		 * When forced, the recognizer cycle is stopped immediately.
		 * @param {Boolean} [force]
		 */
		stop: function(force) {
			this.session.stopped = force ? FORCED_STOP : STOP;
		},

		/**
		 * run the recognizers!
		 * called by the inputHandler function on every movement of the pointers (touches)
		 * it walks through all the recognizers and tries to detect the gesture that is being made
		 * @param {Object} inputData
		 */
		recognize: function(inputData) {
			var session = this.session;
			if(session.stopped) {
				return;
			}

			// run the touch-action polyfill
			this.touchAction.preventDefaults(inputData);

			var recognizer;
			var recognizers = this.recognizers;

			// this holds the recognizer that is being recognized.
			// so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
			// if no recognizer is detecting a thing, it is set to `null`
			var curRecognizer = session.curRecognizer;

			// reset when the last recognizer is recognized
			// or when we're in a new session
			if(!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
				curRecognizer = session.curRecognizer = null;
			}

			var i = 0;
			while(i < recognizers.length) {
				recognizer = recognizers[i];

				// find out if we are allowed try to recognize the input for this one.
				// 1.   allow if the session is NOT forced stopped (see the .stop() method)
				// 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
				//      that is being recognized.
				// 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
				//      this can be setup with the `recognizeWith()` method on the recognizer.
				if(session.stopped !== FORCED_STOP && ( // 1
						!curRecognizer || recognizer == curRecognizer || // 2
						recognizer.canRecognizeWith(curRecognizer))) { // 3
					recognizer.recognize(inputData);
				} else {
					recognizer.reset();
				}

				// if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
				// current active recognizer. but only if we don't already have an active recognizer
				if(!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
					curRecognizer = session.curRecognizer = recognizer;
				}
				i++;
			}
		},

		/**
		 * get a recognizer by its event name.
		 * @param {Recognizer|String} recognizer
		 * @returns {Recognizer|Null}
		 */
		get: function(recognizer) {
			if(recognizer instanceof Recognizer) {
				return recognizer;
			}

			var recognizers = this.recognizers;
			for(var i = 0; i < recognizers.length; i++) {
				if(recognizers[i].options.event == recognizer) {
					return recognizers[i];
				}
			}
			return null;
		},

		/**
		 * add a recognizer to the manager
		 * existing recognizers with the same event name will be removed
		 * @param {Recognizer} recognizer
		 * @returns {Recognizer|Manager}
		 */
		add: function(recognizer) {
			if(invokeArrayArg(recognizer, 'add', this)) {
				return this;
			}

			// remove existing
			var existing = this.get(recognizer.options.event);
			if(existing) {
				this.remove(existing);
			}

			this.recognizers.push(recognizer);
			recognizer.manager = this;

			this.touchAction.update();
			return recognizer;
		},

		/**
		 * remove a recognizer by name or instance
		 * @param {Recognizer|String} recognizer
		 * @returns {Manager}
		 */
		remove: function(recognizer) {
			if(invokeArrayArg(recognizer, 'remove', this)) {
				return this;
			}

			recognizer = this.get(recognizer);

			// let's make sure this recognizer exists
			if(recognizer) {
				var recognizers = this.recognizers;
				var index = inArray(recognizers, recognizer);

				if(index !== -1) {
					recognizers.splice(index, 1);
					this.touchAction.update();
				}
			}

			return this;
		},

		/**
		 * bind event
		 * @param {String} events
		 * @param {Function} handler
		 * @returns {EventEmitter} this
		 */
		on: function(events, handler) {
			if(events === undefined) {
				return;
			}
			if(handler === undefined) {
				return;
			}

			var handlers = this.handlers;
			each(splitStr(events), function(event) {
				handlers[event] = handlers[event] || [];
				handlers[event].push(handler);
			});
			return this;
		},

		/**
		 * unbind event, leave emit blank to remove all handlers
		 * @param {String} events
		 * @param {Function} [handler]
		 * @returns {EventEmitter} this
		 */
		off: function(events, handler) {
			if(events === undefined) {
				return;
			}

			var handlers = this.handlers;
			each(splitStr(events), function(event) {
				if(!handler) {
					delete handlers[event];
				} else {
					handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
				}
			});
			return this;
		},

		/**
		 * emit event to the listeners
		 * @param {String} event
		 * @param {Object} data
		 */
		emit: function(event, data) {
			// we also want to trigger dom events
			if(this.options.domEvents) {
				triggerDomEvent(event, data);
			}

			// no handlers, so skip it all
			var handlers = this.handlers[event] && this.handlers[event].slice();
			if(!handlers || !handlers.length) {
				return;
			}

			data.type = event;
			data.preventDefault = function() {
				data.srcEvent.preventDefault();
			};

			data.stopPropagation = function() {
				data.srcEvent.stopPropagation();
			};

			var i = 0;
			while(i < handlers.length) {
				handlers[i](data);
				i++;
			}
		},

		/**
		 * destroy the manager and unbinds all events
		 * it doesn't unbind dom events, that is the user own responsibility
		 */
		destroy: function() {
			this.element && toggleCssProps(this, false);

			this.handlers = {};
			this.session = {};
			this.input.destroy();
			this.element = null;
		}
	};

	/**
	 * add/remove the css properties as defined in manager.options.cssProps
	 * @param {Manager} manager
	 * @param {Boolean} add
	 */
	function toggleCssProps(manager, add) {
		var element = manager.element;
		if(!element.style) {
			return;
		}
		var prop;
		each(manager.options.cssProps, function(value, name) {
			prop = prefixed(element.style, name);
			if(add) {
				manager.oldCssProps[prop] = element.style[prop];
				element.style[prop] = value;
			} else {
				element.style[prop] = manager.oldCssProps[prop] || '';
			}
		});
		if(!add) {
			manager.oldCssProps = {};
		}
	}

	/**
	 * trigger dom event
	 * @param {String} event
	 * @param {Object} data
	 */
	function triggerDomEvent(event, data) {
		var gestureEvent = document.createEvent('Event');
		gestureEvent.initEvent(event, true, true);
		gestureEvent.gesture = data;
		data.target.dispatchEvent(gestureEvent);
	}

	assign(Hammer, {
		INPUT_START: INPUT_START,
		INPUT_MOVE: INPUT_MOVE,
		INPUT_END: INPUT_END,
		INPUT_CANCEL: INPUT_CANCEL,

		STATE_POSSIBLE: STATE_POSSIBLE,
		STATE_BEGAN: STATE_BEGAN,
		STATE_CHANGED: STATE_CHANGED,
		STATE_ENDED: STATE_ENDED,
		STATE_RECOGNIZED: STATE_RECOGNIZED,
		STATE_CANCELLED: STATE_CANCELLED,
		STATE_FAILED: STATE_FAILED,

		DIRECTION_NONE: DIRECTION_NONE,
		DIRECTION_LEFT: DIRECTION_LEFT,
		DIRECTION_RIGHT: DIRECTION_RIGHT,
		DIRECTION_UP: DIRECTION_UP,
		DIRECTION_DOWN: DIRECTION_DOWN,
		DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
		DIRECTION_VERTICAL: DIRECTION_VERTICAL,
		DIRECTION_ALL: DIRECTION_ALL,

		Manager: Manager,
		Input: Input,
		TouchAction: TouchAction,

		TouchInput: TouchInput,
		MouseInput: MouseInput,
		PointerEventInput: PointerEventInput,
		TouchMouseInput: TouchMouseInput,
		SingleTouchInput: SingleTouchInput,

		Recognizer: Recognizer,
		AttrRecognizer: AttrRecognizer,
		Tap: TapRecognizer,
		Pan: PanRecognizer,
		Swipe: SwipeRecognizer,
		Pinch: PinchRecognizer,
		Rotate: RotateRecognizer,
		Press: PressRecognizer,

		on: addEventListeners,
		off: removeEventListeners,
		each: each,
		merge: merge,
		extend: extend,
		assign: assign,
		inherit: inherit,
		bindFn: bindFn,
		prefixed: prefixed
	});

	// this prevents errors when Hammer is loaded in the presence of an AMD
	//  style loader but by script tag, not by the loader.
	var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
	freeGlobal.Hammer = Hammer;

	if(typeof define === 'function' && define.amd) {
		define(function() {
			return Hammer;
		});
	} else if(typeof module != 'undefined' && module.exports) {
		module.exports = Hammer;
	} else {
		window[exportName] = Hammer;
	}

})(window, document, 'Hammer');;
(function() {

	"use strict";

	var zv = ZhiUTech.Viewing;

	zv.EventDispatcher = function() {};

	zv.EventDispatcher.prototype = {

		constructor: zv.EventDispatcher,

		apply: function(object) {

			object.addEventListener = zv.EventDispatcher.prototype.addEventListener;
			object.hasEventListener = zv.EventDispatcher.prototype.hasEventListener;
			object.removeEventListener = zv.EventDispatcher.prototype.removeEventListener;
			object.clearListeners = zv.EventDispatcher.prototype.clearListeners;
			object.fireEvent = zv.EventDispatcher.prototype.fireEvent;
			object.dispatchEvent = zv.EventDispatcher.prototype.fireEvent;
			object.debugEvents = zv.EventDispatcher.prototype.debugEvents;
		},

		/**
		 * Adds an event listener.
		 * 
		 * @param {string} type - Event type identifier.
		 * @param {function} listener - Callback function, receives an event parameter.
		 * @param {object} [options] - Options object with characteristics about the event listener.
		 * @param {bool} [options.once] - When true, the event listener will only get invoked once. Defaults to false. 
		 */
		addEventListener: function(type, listener, options) {
			if(!type) return;
			if(this.listeners === undefined) this.listeners = {};

			if(typeof this.listeners[type] == "undefined") {
				this.listeners[type] = [];
			}

			this.listeners[type].push({
				callbackFn: listener,
				once: options ? !!options.once : false
			});
		},

		/**
		 * Returns true if the specified listener already exists, false otherwise.
		 * 
		 * @param {string} type - Event type identifier.
		 * @param {function} listener - Callback function to check if it will be already registered.
		 */
		hasEventListener: function(type, listener) {

			if(!type) return false;
			if(this.listeners === undefined) return false;

			var typeListeners = this.listeners[type];
			if(!typeListeners || typeListeners.length === 0)
				return false;

			for(var i = 0, len = typeListeners.length; i < len; ++i) {
				if(typeListeners[i].callbackFn === listener)
					return true;
			}

			return false;
		},

		/**
		 * Removes an event listener. 
		 * If the event listener is not registered then nothing happens.
		 * 
		 * @param {string} type - Event type identifier.
		 * @param {function} listener - Callback function to remove.
		 */
		removeEventListener: function(type, listener) {
			if(!type) return;
			if(this.listeners === undefined) {
				this.listeners = {};
				return;
			}

			var typeListeners = this.listeners[type];
			if(!typeListeners) return;

			for(var i = 0, len = typeListeners.length; i < len; ++i) {
				if(typeListeners[i].callbackFn === listener) {
					typeListeners.splice(i, 1);
					break;
				}
			}
		},

		/**
		 * Remove all listeners registered for all event types.
		 */
		clearListeners: function() {
			this.listeners = null;
		},

		/**
		 * Invokes all listeners registered to the event's type.
		 * 
		 * @param {(string | object)} event - Either a string type identifier or an object which 
		 * will get passed along to each listener. The event object must contain a ``type`` attribute.
		 */
		dispatchEvent: function(event) {
			if(this.listeners === undefined) {
				this.listeners = {};
				return;
			}

			if(typeof event == "string") {
				event = {
					type: event
				};
			}

			if(!event.target) {
				try {
					event.target = this;
				} catch(e) {}
			}

			if(!event.type) {
				throw new Error("event type unknown.");
			}

			if(this._doDebug) {
				console.log('Event: ' + event.type);
			}

			if(!Array.isArray(this.listeners[event.type]))
				return;

			var typeListeners = this.listeners[event.type].slice(); // shallow copy
			var oneShots = [];

			for(var i = 0, len = typeListeners.length; i < len; ++i) {
				typeListeners[i].callbackFn.call(this, event);
				if(typeListeners[i].once) {
					oneShots.push(typeListeners[i].callbackFn);
				}
			}

			for(var j = 0; j < oneShots.length; ++j) {
				this.removeEventListener(event.type, oneShots[j]);
			}
		},

		/**
		 * 
		 */
		debugEvents: function(enable) {
			this._doDebug = enable;
		}

	};

	// Legacy event routine needs to be deprecated.
	zv.EventDispatcher.prototype.fireEvent = zv.EventDispatcher.prototype.dispatchEvent;

})();;
(function() {
	'use strict';

	var zvp = ZhiUTech.Viewing.Private;
	var _supported = isLocalStorageSupported();

	/**
	 * Helper function that detects whether localStorage is available.
	 * @private
	 */
	function isLocalStorageSupported() {
		if(typeof window === "undefined")
			return false;

		try {
			var TEST_KEY = 'lmv_viewer_test_localStorage';
			var storage = window.localStorage; // This may assert if browsers disallow sites from setting data.
			if(!storage)
				return false;

			storage.setItem(TEST_KEY, '1');
			storage.removeItem(TEST_KEY);
			return true;

		} catch(error) {
			return false;
		}
	}

	function LocalStorage() {
		// nothing //
	}

	/**
	 * Get an item from localStorage.
	 * Returns null localStorage is not available.
	 */
	LocalStorage.prototype.getItem = function(key) {
		if(!_supported) return null;
		return window.localStorage.getItem(key);
	};

	/**
	 * Set an item into localStorage.
	 * Does nothing if localStorage is not available OR if
	 * the max quota is exceeded.
	 */
	LocalStorage.prototype.setItem = function(key, value) {
		if(!_supported) return;
		try {
			window.localStorage.setItem(key, value);
		} catch(eee) {
			zvp.logger.debug('zvp.LocalStorage: Failed to setItem()');
		}
	};

	/**
	 * Removes an item from localStorage.
	 * Does nothing if localStorage is not available.
	 */
	LocalStorage.prototype.removeItem = function(key) {
		if(!_supported) return;
		window.localStorage.removeItem(key);
	};

	/**
	 * Returns true is localStorage is supported.
	 */
	LocalStorage.prototype.isSupported = function() {
		return _supported;
	};

	/**
	 * Global instance for interacting with localStorage.
	 */
	ZhiUTech.Viewing.Private.LocalStorage = new LocalStorage();

})();;
/**
 * Base class for file loaders.
 *
 * It is highly recommended that file loaders use worker threads to perform the actual loading in order to keep the
 * UI thread free. Once loading is complete, the loader should call viewer.impl.onLoadComplete(). During loading,
 * the loader can use viewer.impl.signalProgress(int) to indicate how far along the process is.
 *
 * To add geometry to the viewer, `viewer.impl.addMeshInstance(geometry, meshId, materialId, matrix)` should be used.
 * Geometry must be THREE.BufferGeometry, meshId is a number, materialId is a string, and matrix is the THREE.Matrix4
 * transformation matrix to be applied to the geometry.
 *
 * Remember to add draw calls to the BufferGeometry if the geometry has more than 65535 faces.
 *
 * @param {ZhiUTech.Viewing.Viewer3D} viewer - The viewer instance.
 * @constructor
 * @abstract
 * @category Core
 */
ZhiUTech.Viewing.FileLoader = function(viewer) {
	this.viewer = viewer;
};

ZhiUTech.Viewing.FileLoader.prototype.constructor = ZhiUTech.Viewing.FileLoader;

/**
 * Initiates the loading of a file from the given URL.
 *
 * This method must be overridden.
 *
 * @param {string} url - The url for the file.
 * @param {object=} options - An optional dictionary of options.
 * @param {string=} options.ids - A list of object id to load.
 * @param {string=} options.sharedPropertyDbPath - Optional path to shared property database.
 * @param {function=} onSuccess - Callback function when the file begins loading successfully. Takes no arguments.
 * @param {function=} onError - Callback function when an error occurs. Passed an integer error code and a string description of the error.
 */
ZhiUTech.Viewing.FileLoader.prototype.loadFile = function(url, options, onSuccess, onError) {
	return false;
};

/**
 * Returns true only for a 3D models FileLoader implementation.
 */
ZhiUTech.Viewing.FileLoader.prototype.is3d = function() {
	return false;
};;
(function() {

	"use strict";

	/**
	 * The FileLoaderManager manages a set of file loaders available to the viewer.
	 * Register, retrieve, and unregister your file loaders using the singleton theFileLoader.
	 *
	 * @constructor
	 */
	var FileLoaderManager = function() {
		var fileLoaders = {};

		/**
		 * Registers a new file loader with the given id.
		 *
		 * @param {String} fileLoaderId - The string id of the file loader.
		 * @param {String[]} fileExtensions - The array of supported file extensions. Ex: ['stl', 'obj']
		 * @param {Function} fileLoaderClass - The file loader constructor.
		 * @returns {Boolean} - True if the file loader was successfully registered.
		 */
		function registerFileLoader(fileLoaderId, fileExtensions, fileLoaderClass) {
			if(!fileLoaders[fileLoaderId]) {
				fileLoaders[fileLoaderId] = {
					loader: fileLoaderClass,
					extensions: fileExtensions
				};
				return true;
			}
			return false;
		}

		/**
		 * Returns the file loader for a given ID.
		 *
		 * @param {String} fileLoaderId - The string id of the file loader.
		 * @returns {Function?} - The file loader constructor if one was registered; null otherwise.
		 */
		function getFileLoader(fileLoaderId) {
			if(fileLoaders[fileLoaderId]) {
				return fileLoaders[fileLoaderId].loader;
			}
			return null;
		}

		/**
		 * Unregisters an existing file loader with the given id.
		 *
		 * @param {String} fileLoaderId - The string id of the file loader.
		 * @returns {Boolean} - True if the file loader was successfully unregistered.
		 */
		function unregisterFileLoader(fileLoaderId) {
			if(fileLoaders[fileLoaderId]) {
				delete fileLoaders[fileLoaderId];
				return true;
			}
			return false;
		}

		/**
		 * Returns a file loader that supports the given extension.
		 *
		 * @param {String} fileExtension - The file extension.
		 *
		 * @returns {Function?} - The file loader constructor if one is found; null otherwise.
		 */
		function getFileLoaderForExtension(fileExtension) {
			fileExtension = fileExtension ? fileExtension.toLowerCase() : "";
			for(var fileLoaderId in fileLoaders) {
				var fileLoader = fileLoaders[fileLoaderId];
				if(fileLoader) {
					for(var i = 0; i < fileLoader.extensions.length; i++) {
						if(fileLoader.extensions[i].toLowerCase() === fileExtension) {
							return fileLoader.loader;
						}
					}
				}
			}

			return null;
		}

		return {
			registerFileLoader: registerFileLoader,
			getFileLoader: getFileLoader,
			getFileLoaderForExtension: getFileLoaderForExtension,
			unregisterFileLoader: unregisterFileLoader
		};
	};

	var zv = ZhiUTech.Viewing;
	zv.FileLoaderManager = new FileLoaderManager();

})();;
(function() {

	"use strict";

	var zv = ZhiUTech.Viewing,
		zvp = zv.Private;

	var fsNames = ['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange', 'MSFullscreenChange'];

	function addListener(listener) {
		for(var i = 0; i < fsNames.length; ++i)
			document.addEventListener(fsNames[i], listener, false);
	}

	function removeListener(listener) {
		for(var i = 0; i < fsNames.length; ++i)
			document.removeEventListener(fsNames[i], listener, false);
	}

	/**
	 * List of available screen modes: normal, full browser, and full screen.
	 * @readonly
	 * @memberof ZhiUTech.Viewing
	 * @enum {number}
	 */
	zv.ScreenMode = {
		kNormal: 0,
		kFullBrowser: 1,
		kFullScreen: 2
	};

	/**
	 * Virtual base class for screen mode manipulation.
	 *
	 * Derive from this class and use it to allow viewer to go full screen.
	 * @constructor
	 * @param {ZhiUTech.Viewing.Viewer3D} viewer - Viewer instance.
	 * @memberof ZhiUTech.Viewing
	 * @alias ZhiUTech.Viewing.ScreenModeDelegate
	 * @category Core
	 */
	function ScreenModeDelegate(viewer) {
		this.viewer = viewer;
		this.bindFullscreenEventListener = this.fullscreenEventListener.bind(this);

		if(this.getMode() === zv.ScreenMode.kFullScreen) {
			addListener(this.bindFullscreenEventListener);
		}
	}

	zv.ScreenModeDelegate = ScreenModeDelegate;

	/**
	 * Perform any cleanup required for a {@link ZhiUTech.Viewing.ScreenModeDelegate} instance.
	 */
	ScreenModeDelegate.prototype.uninitialize = function() {

		removeListener(this.bindFullscreenEventListener);
		this.viewer = null;
	};

	/**
	 * Is screen mode supported?
	 * Returning false for normal mode means no screen mode changes are supported.
	 * @param {ZhiUTech.Viewing.ScreenMode} mode - Desired screen mode.
	 * @returns {boolean} True if screen mode is supported.
	 */
	ScreenModeDelegate.prototype.isModeSupported = function(mode) {
		return true;
	};

	/**
	 * Set new screen mode.
	 * @param {ZhiUTech.Viewing.ScreenMode} mode - New screen mode.
	 * @returns {boolean} True if screen mode was changed.
	 */
	ScreenModeDelegate.prototype.setMode = function(mode) {
		var currentMode = this.getMode();
		if((mode !== currentMode) && this.isModeSupported(mode)) {
			this.doScreenModeChange(currentMode, mode);
			this.onScreenModeChanged(currentMode, mode);
			return true;
		}
		return false;
	};

	/**
	 * Override this method to get the current screen mode.
	 * @returns {ZhiUTech.Viewing.ScreenMode} Current screen mode.
	 */
	ScreenModeDelegate.prototype.getMode = function() {
		throw 'Implement getMode() in derived class';
	};

	/**
	 * Return next screen mode in sequence.
	 * Depending on what modes are supported, this may be a toggle or a 3-state.
	 * @returns {ZhiUTech.Viewing.ScreenMode|undefined} Next screen mode in sequence or undefined if no change.
	 */
	ScreenModeDelegate.prototype.getNextMode = function() {
		var currentMode = this.getMode(),
			newMode;

		var SM = zv.ScreenMode;

		if(currentMode === SM.kNormal &&
			this.isModeSupported(SM.kFullBrowser)) {

			newMode = SM.kFullBrowser;

		} else if(currentMode === SM.kNormal &&
			this.isModeSupported(SM.kFullScreen)) {

			newMode = SM.kFullScreen;

		} else if(currentMode === SM.kFullBrowser &&
			this.isModeSupported(SM.kFullScreen)) {

			newMode = SM.kFullScreen;

		} else if(currentMode === SM.kFullBrowser &&
			this.isModeSupported(SM.kNormal)) {

			newMode = SM.kNormal;

		} else if(currentMode === SM.kFullScreen &&
			this.isModeSupported(SM.kNormal)) {

			newMode = SM.kNormal;

		} else if(currentMode === SM.kFullScreen &&
			this.isModeSupported(SM.kFullBrowser)) {

			newMode = SM.kFullBrowser;
		}
		return newMode;
	};

	/**
	 * Return new screen mode on escape.
	 * @returns {ZhiUTech.Viewing.ScreenMode|undefined} New screen mode or undefined if no change.
	 */
	ScreenModeDelegate.prototype.getEscapeMode = function() {
		return(this.getMode() !== zv.ScreenMode.kNormal) ?
			zv.ScreenMode.kNormal : undefined;
	};

	/**
	 * Full screen event listener.
	 */
	ScreenModeDelegate.prototype.fullscreenEventListener = function() {
		if(zv.inFullscreen()) {
			this.viewer.resize();
		} else {
			var ScreenMode = zv.ScreenMode;
			this.doScreenModeChange(ScreenMode.kFullScreen, ScreenMode.kNormal);
			this.onScreenModeChanged(ScreenMode.kFullScreen, ScreenMode.kNormal);
		}
	};

	/**
	 * Override this method to make the screen mode change occur.
	 * @param {ZhiUTech.Viewing.ScreenMode} oldMode - Old screen mode.
	 * @param {ZhiUTech.Viewing.ScreenMode} newMode - New screen mode.
	 */
	ScreenModeDelegate.prototype.doScreenModeChange = function(oldMode, newMode) {
		throw 'Implement doScreenModeChange() in derived class';
	};

	/**
	 * Called after the screen mode changes.
	 * @param {ZhiUTech.Viewing.ScreenMode} oldMode - Old screen mode.
	 * @param {ZhiUTech.Viewing.ScreenMode} newMode - New screen mode.
	 */
	ScreenModeDelegate.prototype.onScreenModeChanged = function(oldMode, newMode) {
		if(oldMode === zv.ScreenMode.kFullScreen) {
			removeListener(this.bindFullscreenEventListener);
		} else if(newMode === zv.ScreenMode.kFullScreen) {
			addListener(this.bindFullscreenEventListener);
		}

		this.viewer.resize();
		this.viewer.dispatchEvent({
			type: zv.FULLSCREEN_MODE_EVENT,
			mode: newMode
		});
	};

	/**
	 * Screen mode delegate allowing the viewer to go full screen.
	 *
	 * Unlike ViewerScreenModeDelegate class, this delegate
	 * doesn't use the full browser state, and it takes the entire page full screen, not just
	 * the viewer.
	 * @constructor
	 * @extends ZhiUTech.Viewing.ScreenModeDelegate
	 * @memberof ZhiUTech.Viewing
	 * @alias ZhiUTech.Viewing.AppScreenModeDelegate
	 * @param {ZhiUTech.Viewing.Viewer3D} viewer - Viewer instance.
	 * @category Core
	 */
	zv.AppScreenModeDelegate = function(viewer) {
		zv.ScreenModeDelegate.call(this, viewer);
	};

	zv.AppScreenModeDelegate.prototype = Object.create(zv.ScreenModeDelegate.prototype);
	zv.AppScreenModeDelegate.prototype.constructor = zv.AppScreenModeDelegate;

	zv.AppScreenModeDelegate.prototype.isModeSupported = function(mode) {
		return mode !== zv.ScreenMode.kFullBrowser;
	};

	zv.AppScreenModeDelegate.prototype.getMode = function() {
		return zv.inFullscreen() ?
			zv.ScreenMode.kFullScreen :
			zv.ScreenMode.kNormal;
	};

	zv.AppScreenModeDelegate.prototype.doScreenModeChange = function(oldMode, newMode) {
		var container = this.viewer.container;
		if(newMode === zv.ScreenMode.kNormal) {
			container.classList.remove('viewer-fill-browser');
			zv.exitFullscreen();
		} else if(newMode === zv.ScreenMode.kFullScreen) {
			container.classList.add('viewer-fill-browser');
			zv.launchFullscreen(container);
		}
	};

	// Keep the old class name for backwards compatibility
	zv.ApplicationScreenModeDelegate = zv.AppScreenModeDelegate;

	/**
	 * Screen mode delegate with no full screen functionality.
	 * @constructor
	 * @extends ZhiUTech.Viewing.ScreenModeDelegate
	 * @memberof ZhiUTech.Viewing
	 * @alias ZhiUTech.Viewing.NullScreenModeDelegate
	 * @param {ZhiUTech.Viewing.Viewer3D} viewer - Viewer instance.
	 * @category Core
	 */
	zv.NullScreenModeDelegate = function(viewer) {
		zv.ScreenModeDelegate.call(this, viewer);
	};

	zv.NullScreenModeDelegate.prototype = Object.create(zv.ScreenModeDelegate.prototype);
	zv.NullScreenModeDelegate.prototype.constructor = zv.ScreenModeDelegate;

	zv.NullScreenModeDelegate.prototype.isModeSupported = function(mode) {
		return false; // No screen modes supported
	};

	zv.NullScreenModeDelegate.prototype.getMode = function() {
		return zv.ScreenMode.kNormal;
	};

	zv.ScreenModeMixin = function() {};

	zv.ScreenModeMixin.prototype = {

		/**
		 * Set new screen mode delegate.
		 * @param {ZhiUTech.Viewing.ScreenModeDelegate} delegate - New screen mode delegate class.
		 */
		setScreenModeDelegate: function(delegate) {
			if(this.screenModeDelegate) {
				this.screenModeDelegate.uninitialize();
				this.screenModeDelegate = null;
			}

			// null -> Fullscreen not available
			// undefined -> Use default AppScreenModeDelegate
			//
			if(delegate) {
				this.screenModeDelegateClass = delegate;
			} else if(delegate === null) {
				this.screenModeDelegateClass = zv.NullScreenModeDelegate;
			} else { // undefined
				this.screenModeDelegateClass = zv.AppScreenModeDelegate;
			}
		},

		/**
		 * Get current screen mode delegate.
		 * If no screen mode delegate has been set, then use {@link ZhiUTech.Viewing.ViewerScreenModeDelegate}.
		 * @returns {ZhiUTech.Viewing.ScreenModeDelegate} Current screen mode delegate.
		 */
		getScreenModeDelegate: function() {
			if(!this.screenModeDelegate) {
				this.screenModeDelegate = new this.screenModeDelegateClass(this);
			}
			return this.screenModeDelegate;
		},

		/**
		 * Is specified screen mode supported?
		 * @param {ZhiUTech.Viewing.ScreenMode} mode - Desired screen mode.
		 * @returns {boolean} True if screen mode is supported.
		 */
		isScreenModeSupported: function(mode) {
			return this.getScreenModeDelegate().isModeSupported(mode);
		},

		/**
		 * Is changing screen modes supported?
		 * @returns {boolean} True if viewer supports changing screen modes.
		 */
		canChangeScreenMode: function() {
			return this.isScreenModeSupported(ZhiUTech.Viewing.ScreenMode.kNormal);
		},

		/**
		 * Set new screen mode.
		 * @param {ZhiUTech.Viewing.ScreenMode} mode - New screen mode.
		 * @returns {boolean} True if screen mode was changed.
		 */
		setScreenMode: function(mode) {
			var msg = {
				category: "screen_mode",
				value: mode
			};
			zvp.logger.track(msg);

			return this.getScreenModeDelegate().setMode(mode);
		},

		/**
		 * Get current screen mode.
		 * @returns {ZhiUTech.Viewing.ScreenMode} Current screen mode.
		 */
		getScreenMode: function() {
			return this.getScreenModeDelegate().getMode();
		},

		/**
		 * Set screen mode to next in sequence.
		 * @returns {boolean} True if screen mode was changed.
		 */
		nextScreenMode: function() {
			var mode = this.getScreenModeDelegate().getNextMode();
			return(mode !== undefined) ? this.setScreenMode(mode) : false;
		},

		/**
		 * Screen mode escape key handler.
		 * @returns {boolean} True if screen mode was changed.
		 */
		escapeScreenMode: function() {
			var mode = this.getScreenModeDelegate().getEscapeMode();
			return(mode !== undefined) ? this.setScreenMode(mode) : false;
		},

		apply: function(object) {

			var p = zv.ScreenModeMixin.prototype;
			object.setScreenModeDelegate = p.setScreenModeDelegate;
			object.getScreenModeDelegate = p.getScreenModeDelegate;
			object.isScreenModeSupported = p.isScreenModeSupported;
			object.canChangeScreenMode = p.canChangeScreenMode;
			object.setScreenMode = p.setScreenMode;
			object.getScreenMode = p.getScreenMode;
			object.nextScreenMode = p.nextScreenMode;
			object.escapeScreenMode = p.escapeScreenMode;
		}

	};

})();;
(function() {

	"use strict";

	var zv = ZhiUTech.Viewing;
	var zvp = zv.Private;

	var ModelUnits = {
		METER: 'm',
		CENTIMETER: 'cm',
		MILLIMETER: 'mm',
		FOOT: 'ft',
		INCH: 'in'
	};

	zv.ModelUnits = ModelUnits;

	/**
	 * Core class representing the geometry.
	 *
	 * @constructor
	 * @memberof ZhiUTech.Viewing
	 * @alias ZhiUTech.Viewing.Model
	 * @category Core
	 */
	var Model = function(modelData) {
		WGS.RenderModel.call(this, modelData);
		this.topology = null;
		this.topologyPromise = null;
		this.esdUUID = null;
		this.defaultCameraHash = null;
		var HOMEVIEW_KEY = "ZhiUTech.Viewing.Private.HomeViewPFs.";

		// RenderModel overrides

		/**
		 * @returns {boolean} Whether the model is 3D.
		 */
		this.is3d = function() {
			return !this.is2d();
		};

		/**
		 * Helper functions for fastLoad
		 */
		this.getFastLoadList = function() {
			if(!this.esdUUID && zvp.LocalStorage.isSupported()) return;
			return JSON.parse(zvp.LocalStorage.getItem(HOMEVIEW_KEY + this.esdUUID));
		};

		this.setFastLoadList = function(vizFragIds, camera) {
			if(!zvp.LocalStorage.isSupported() || zvp.LocalStorage.getItem(HOMEVIEW_KEY + this.esdUUID))
				return;
			var homeCam = this.getDefaultCamera();
			if((camera.position.x + camera.position.z) == (homeCam.position.x + homeCam.position.z))
				zvp.LocalStorage.setItem(HOMEVIEW_KEY + this.esdUUID, JSON.stringify(vizFragIds));
		};
	};

	/*
	 * Don't set Model's prototype to RenderModel. It's not needed for now,
	 * and we would also have to defer the initialization of the prototype
	 * until WGS (an external dependency) is ready.
	 */
	//Model.prototype = Object.create(WGS.RenderModel.prototype);

	zv.EventDispatcher.prototype.apply(Model.prototype);
	Model.prototype.constructor = Model;

	/**
	 * Set a UUID to identify the SVF model
	 * @param {string} urn - Data that represents the geometry.
	 */
	Model.prototype.setUUID = function(urn) {
		this.esdUUID = btoa(WGS.pathToURL(urn));
	};

	/**
	 * Returns an object wrapping the bubble/manifest entry for the
	 * loaded geometry. Contains data such as the viewableID, guid, role...
	 */
	Model.prototype.getDocumentNode = function() {
		var data = this.getData();
		if(data.loadOptions) {
			return data.loadOptions.bubbleNode || null;
		}
		return null;
	};

	/**
	 * Returns the root of the geometry node graph.
	 * @returns {object} The root of the geometry node graph. Null if it doesn't exist.
	 */
	Model.prototype.getRoot = function() {
		var data = this.getData();
		if(data && data.instanceTree)
			return data.instanceTree.root;
		return null;
	};

	/**
	 * Returns the root of the geometry node graph.
	 * @returns {number} The ID of the root or null if it doesn't exist.
	 */
	Model.prototype.getRootId = function() {
		var data = this.getData();
		if(data) {
			if(data.instanceTree)
				return data.instanceTree.getRootId();
			if(data.fragmentMap)
				return data.fragmentMap.getRootId();
		}
		return 0;
	};

	/**
	 * Returns an object that contains the standard unit string (unitString) and the scale value (unitScale).
	 * @param {string} unit - Unit name from the metadata
	 * @returns {object} this object contains the standardized unit string (unitString) and a unit scaling value (unitScale)
	 */
	Model.prototype.getUnitData = function(unit) {
		var returnValue = {
			unitString: null,
			unitScale: 1.0
		};
		//Why are translators not using standard strings for those?!?!?!?
		switch(unit) {
			case 'meter':
			case 'meters':
			case 'm':
				returnValue.unitString = ModelUnits.METER;
				returnValue.unitScale = 1.0;
				return returnValue;
			case 'foot':
			case 'feet':
			case 'ft':
				returnValue.unitString = ModelUnits.FOOT;
				returnValue.unitScale = 0.3048;
				return returnValue;
			case 'feet and inches':
			case 'inch':
			case 'inches':
			case 'in':
				returnValue.unitString = ModelUnits.INCH;
				returnValue.unitScale = 0.0254;
				return returnValue;
			case 'centimeter':
			case 'centimeters':
			case 'cm':
				returnValue.unitString = ModelUnits.CENTIMETER;
				returnValue.unitScale = 0.01;
				return returnValue;
			case 'millimeter':
			case 'millimeters':
			case 'mm':
				returnValue.unitString = ModelUnits.MILLIMETER;
				returnValue.unitScale = 0.001;
				return returnValue;
			default:
				return returnValue;
		}
	};

	/**
	 * Returns the scale factor of model's distance unit to meters.
	 * @returns {number} The scale factor of the model's distance unit to meters or unity if the units aren't known.
	 */
	Model.prototype.getUnitScale = function() {
		var unit;

		if(!this.is2d()) {
			var data = this.getData();
			if(data && data.overriddenUnits) {
				// explicit override trumps all
				unit = data.overriddenUnits;
			} else if(data && data.scalingUnit) {
				unit = data.scalingUnit; // only using if scaling was actually applied
			} else {
				unit = this.getMetadata('distance unit', 'value', null);
			}
		} else {
			unit = this.getMetadata('page_dimensions', 'page_units', null);
		}

		if(unit)
			unit = unit.toLowerCase();

		return this.getUnitData(unit).unitScale;
	};

	/**
	 * Returns a standard string representation of the model's distance unit.
	 * @returns {string} Standard representation of model's unit distance or null if it is not known.
	 */
	Model.prototype.getUnitString = function() {

		var unit;

		if(!this.is2d()) {
			// Check if there's an overridden model units in bubble.json (this happens in Revit 3D files)
			var data = this.getData();
			if(data && data.overriddenUnits) {
				// explicit override trumps all
				unit = data.overriddenUnits;
			} else if(data && data.scalingUnit) {
				unit = data.scalingUnit; // only using if scaling was actually applied
			} else {
				unit = this.getMetadata('distance unit', 'value', null);
			}
		} else {
			// Model units will be used for calculating the initial distance.
			unit = this.getMetadata('page_dimensions', 'model_units', null) || this.getMetadata('page_dimensions', 'page_units', null);
		}

		if(unit)
			unit = unit.toLowerCase();

		return this.getUnitData(unit).unitString;
	};

	/**
	 * Returns a standard string representation of the model's display unit.
	 * @returns {string} Standard representation of model's display unit or null if it is not known.
	 */
	Model.prototype.getDisplayUnit = function() {
		var unit;

		if(!this.is2d()) {
			var data = this.getData();
			if(data && data.scalingUnit) {
				unit = data.scalingUnit; // only using if scaling was actually applied
			} else {
				unit = this.getMetadata('distance unit', 'value', null);
			}
		} else {

			// When model units is not set, it should be assumed to be the same as paper units.
			unit = this.getMetadata('page_dimensions', 'model_units', null) || this.getMetadata('page_dimensions', 'page_units', null);
		}

		if(unit)
			unit = unit.toLowerCase();

		return this.getUnitData(unit).unitString;
	};

	/**
	 * Return metadata value.
	 * @param {string} itemName - Metadata item name.
	 * @param {string} [subitemName] - Metadata subitem name.
	 * @param {*} [defaultValue] - Default value.
	 * @returns {*} Metadata value, or defaultValue if no metadata or metadata item/subitem does not exist.
	 */
	Model.prototype.getMetadata = function(itemName, subitemName, defaultValue) {
		var data = this.getData();
		if(data) {
			var metadata = data.metadata;
			if(metadata) {
				var item = metadata[itemName];
				if(item !== undefined) {
					if(subitemName) {
						var subitem = item[subitemName];
						if(subitem !== undefined) {
							return subitem;
						}
					} else {
						return item;
					}
				}
			}
		}
		return defaultValue;
	};

	/*
	Model.prototype.displayMetadata = function () {
	    zvp.logger.log('metadata:');
	    var data = this.getData();
	    if (data) {
	        var metadata = data.metadata;
	        if (metadata) {
	            for (itemName in metadata) {
	                if (metadata.hasOwnProperty(itemName)) {
	                    zvp.logger.log('  ' + itemName);
	                    var item = metadata[itemName];
	                    if (item) {
	                        for (subItemName in item) {
	                            if (item.hasOwnProperty(subItemName)) {
	                                zvp.logger.log('    ' + subItemName + '=' + JSON.stringify(item[subItemName]));
	                            }
	                        }
	                    }
	                }
	            }
	        }
	    }
	};
	*/

	/**
	 * Returns the default camera.
	 */
	Model.prototype.getDefaultCamera = function() {

		var myData = this.getData();

		if(!myData)
			return null;

		var defaultCamera = null;
		var numCameras = myData.cameras ? myData.cameras.length : 0;
		if(0 < numCameras) {
			// Choose a camera.
			// Use the default camera if specified by metadata.
			//
			var defaultCameraIndex = this.getMetadata('default camera', 'index', null);
			if(defaultCameraIndex !== null && myData.cameras[defaultCameraIndex]) {
				defaultCamera = myData.cameras[defaultCameraIndex];

			} else {

				// No default camera. Choose a perspective camera, if any.
				//
				for(var i = 0; i < numCameras; i++) {
					var camera = myData.cameras[i];
					if(camera.isPerspective) {
						defaultCamera = camera;
						break;
					}
				}

				// No perspective cameras, either. Choose the first camera.
				//
				if(!defaultCamera) {
					defaultCamera = myData.cameras[0];
				}
			}
		}

		return defaultCamera;
	};

	/**
	 * Returns whether the "AEC" loader settings were used when loading the model
	 */
	Model.prototype.isAEC = function() {
		return !!this.getData().loadOptions.isAEC;
	};

	/**
	 * Returns up vector as an array of 3.
	 */
	Model.prototype.getUpVector = function() {
		return this.getMetadata('world up vector', 'XYZ', null);
	};

	/**
	 * Returns the polygon count.
	 * @returns {number}
	 */
	Model.prototype.geomPolyCount = function() {

		var geomList = this.getGeometryList();
		if(!geomList) {
			return null;
		}

		return geomList.geomPolyCount;
	};

	/**
	 * Returns the instanced polygon count.
	 * @returns {number}
	 */
	Model.prototype.instancePolyCount = function() {

		var geomList = this.getGeometryList();
		if(!geomList) {
			return null;
		}

		return geomList.instancePolyCount;
	};

	/**
	 * Returns true if the model with all its geometries has loaded.
	 * @returns {boolean}
	 */
	Model.prototype.isLoadDone = function() {
		var data = this.getData();
		return !!(data && data.loadDone);
	};

	/**
	 * Returns true if the frag to node id mapping is done.
	 * @returns {boolean}
	 */
	Model.prototype.isObjectTreeCreated = function() {

		return !!(this.getData().instanceTree);

	};

	Model.prototype.getPropertyDb = function() {
		var data = this.getData();
		return data && data.propDbLoader;
	};

	/**
	 * Returns object properties.
	 * @param {int} dbId - ID of the node to return the properties for.
	 * @param {function} onSuccessCallback - This method is called when request for property db succeeds.
	 * @param {function} onErrorCallback - This method is called when request for property db fails.
	 */
	Model.prototype.getProperties = function(dbId, onSuccessCallback, onErrorCallback) {
		var pdb = this.getPropertyDb();

		// Negative dbIds will not have properties.
		// Negative dbIds are either paper (-1) or generated ids for 2d-texts
		// dbIds start at 1, so 0 can be skipped as well.
		if(!pdb || dbId <= 0) {
			onErrorCallback && onErrorCallback();
			return;
		}

		pdb.getProperties(dbId, onSuccessCallback, onErrorCallback);
	};

	/**
	 * Returns properties for multiple objects with an optional filter on which properties to retrieve.
	 *
	 * @param {int[]} dbIds - IDs of the nodes to return the properties for.
	 * @param {object|undefined} options - Dictionary with options.
	 * @param {string[]} [options.propFilter] - Array of property names to return values for. Use null for no filtering.
	 * Filter applies to "name" and "externalId" fields also.
	 * @param {boolean} [options.ignoreHidden] - Ignore hidden properties
	 * @param {function} onSuccessCallback - This method is called when request for property db succeeds.
	 * @param {function} onErrorCallback - This method is called when request for property db fails.
	 */
	Model.prototype.getBulkProperties = function(dbIds, options, onSuccessCallback, onErrorCallback) {
		if(Array.isArray(options)) {
			// backwards compatibility for when options was actually propFilter.
			options = {
				propFilter: options
			};
		}

		options = options || {};
		var propFilter = options.propFilter || null;
		var ignoreHidden = options.ignoreHidden || false;

		var pdb = this.getPropertyDb();
		if(!pdb) {
			onErrorCallback && onErrorCallback();
			return;
		}

		pdb.getBulkProperties(dbIds, propFilter, onSuccessCallback, onErrorCallback, ignoreHidden);
	};

	/**
	 * Returns an object with key values being dbNodeIds and values externalIds.
	 * Useful to map LMV node ids to Fusion node ids.
	 *
	 * @param {function} onSuccessCallback - This method is called when request for property db succeeds.
	 * @param {function} onErrorCallback - This method is called when request for property db fails.
	 */
	Model.prototype.getExternalIdMapping = function(onSuccessCallback, onErrorCallback) {
		var pdb = this.getPropertyDb();

		if(!pdb) {
			onErrorCallback && onErrorCallback();
			return;
		}

		pdb.getExternalIdMapping(onSuccessCallback, onErrorCallback);
	};

	/**
	 * Returns an object with key values being layer names, pointing to Arrays containing dbIds.
	 *
	 * @param {function} onSuccessCallback - This method is called when request for property db succeeds.
	 * @param {function} onErrorCallback - This method is called when request for property db fails.
	 */
	Model.prototype.getLayerToNodeIdMapping = function(onSuccessCallback, onErrorCallback) {
		var pdb = this.getPropertyDb();

		if(!pdb) {
			onErrorCallback && onErrorCallback();
			return;
		}

		pdb.getLayerToNodeIdMapping(onSuccessCallback, onErrorCallback);
	};

	/**
	 * Returns object tree.
	 *
	 * @param {function} onSuccessCallback - This method is called when request for object tree succeeds.
	 * @param {function} onErrorCallback - This method is called when request for object tree fails.
	 */
	Model.prototype.getObjectTree = function(onSuccessCallback, onErrorCallback) {
		var pdb = this.getPropertyDb();

		if(!pdb) {
			onErrorCallback && onErrorCallback();
			return;
		}

		pdb.getObjectTree(onSuccessCallback, onErrorCallback);
	};

	/**
	 * Returns ``true`` only when the object tree is loaded into memory.
	 * Will return ``false`` while the object tree is still loading,
	 * or when the object tree fails to load.
	 *
	 *
	 * @returns {boolean}
	 */
	Model.prototype.isObjectTreeLoaded = function() {
		var pdb = this.getPropertyDb();

		if(!pdb) {
			return false;
		}

		return pdb.isObjectTreeLoaded();
	};

	/**
	 * Searches the object property database.
	 *
	 * @param {string} text - The search term (not case sensitive).
	 * @param {function} onSuccessCallback - This method is called when request for search succeeds.
	 * @param {function} onErrorCallback - This method is called when request for search fails.
	 * @param {string[]} [attributeNames] - Restricts search to specific attribute names.
	 */
	Model.prototype.search = function(text, onSuccessCallback, onErrorCallback, attributeNames, completeInfo) {
		var pdb = this.getPropertyDb();

		if(!pdb) {
			onErrorCallback && onErrorCallback();
			return;
		}

		pdb.searchProperties(text, attributeNames, onSuccessCallback, onErrorCallback, completeInfo);
	};

	/**
	 * Searches the property database for all dbIds that contains a specific property name.
	 *
	 * @param {string} propertyName - The property name to search for (case sensitive).
	 * @returns {Promise} that resolves with an Array of dbIds containing the specified property.
	 */
	Model.prototype.findProperty = function(propertyName) {
		var pdb = this.getPropertyDb();

		if(!pdb) {
			return Promise.reject('Model doesn\'t have any properties.');
		}

		return pdb.findProperty(propertyName);
	};

	//========================================================
	// Utility functions used by page->model conversions below

	var repairViewportMatrix = function(elements) {
		// Sometimes the rows of matrix are swapped
		var precision = 1e-3;
		var e = elements;
		if(Math.abs(e[0]) < precision) {
			if(Math.abs(e[4]) > precision) {
				// swap row 1 and row 2
				for(var i = 0; i < 4; i++) {
					var temp = e[i];
					e[i] = e[i + 4];
					e[i + 4] = temp;
				}
			} else {
				// swap row 1 and row 3
				for(var i = 0; i < 4; i++) {
					var temp = e[i];
					e[i] = e[i + 8];
					e[i + 8] = temp;
				}
			}
		}
		if(Math.abs(e[5]) < precision) {
			// swap row 2 and row 3
			for(var i = 4; i < 8; i++) {
				var temp = e[i];
				e[i] = e[i + 4];
				e[i + 4] = temp;
			}
		}
	};

	var pointInContour = function(x, y, cntr, pts) {
		var yflag0, yflag1;
		var vtx0X, vtx0Y, vtx1X, vtx1Y;

		var inside_flag = false;

		// get the last point in the polygon
		vtx0X = pts[cntr[cntr.length - 1]].x;
		vtx0Y = pts[cntr[cntr.length - 1]].y;

		// get test bit for above/below X axis
		yflag0 = (vtx0Y >= y);

		for(var j = 0, jEnd = cntr.length; j < jEnd; ++j) {
			vtx1X = pts[cntr[j]].x;
			vtx1Y = pts[cntr[j]].y;

			yflag1 = (vtx1Y >= y);

			// Check if endpoints straddle (are on opposite sides) of X axis
			// (i.e. the Y's differ); if so, +X ray could intersect this edge.
			// The old test also checked whether the endpoints are both to the
			// right or to the left of the test point.  However, given the faster
			// intersection point computation used below, this test was found to
			// be a break-even proposition for most polygons and a loser for
			// triangles (where 50% or more of the edges which survive this test
			// will cross quadrants and so have to have the X intersection computed
			// anyway).  I credit Joseph Samosky with inspiring me to try dropping
			// the "both left or both right" part of my code.
			if(yflag0 != yflag1) {
				// Check intersection of pgon segment with +X ray.
				// Note if >= point's X; if so, the ray hits it.
				// The division operation is avoided for the ">=" test by checking
				// the sign of the first vertex wrto the test point; idea inspired
				// by Joseph Samosky's and Mark Haigh-Hutchinson's different
				// polygon inclusion tests.
				if(((vtx1Y - y) * (vtx0X - vtx1X) >=
						(vtx1X - x) * (vtx0Y - vtx1Y)) == yflag1) {
					inside_flag = !inside_flag;
				}
			}

			// move to the next pair of vertices, retaining info as possible
			yflag0 = yflag1;
			vtx0X = vtx1X;
			vtx0Y = vtx1Y;
		}

		return inside_flag;
	};

	Model.prototype.pointInPolygon = function(x, y, contours, points) {
		var inside = false;

		for(var i = 0; i < contours.length; i++) {

			if(pointInContour(x, y, contours[i], points))
				inside = !inside;
		}

		return inside;
	};

	Model.prototype.getPageToModelTransform = function(vpId) {

		var data = this.getData();
		if(data.pageToModelTransform) {
			return data.pageToModelTransform;
		}

		var f2d = data;
		var metadata = f2d.metadata;
		var pd = metadata.page_dimensions;

		var vp = f2d.viewports[vpId];
		if(!vp) {
			return new THREE.Matrix4();
		}

		if(!f2d.viewportTransforms)
			f2d.viewportTransforms = new Array(f2d.viewports.length);

		//See if we already cached the matrix
		var cached = f2d.viewportTransforms[vpId];
		if(cached)
			return cached;

		//Do the matrix composition in double precision using LmvMatrix,
		//which supports that optionally
		var pageToLogical = new WGS.LmvMatrix4(true).set(
			pd.logical_width / pd.page_width, 0, 0, pd.logical_offset_x,
			0, pd.logical_height / pd.page_height, 0, pd.logical_offset_y,
			0, 0, 1, 0,
			0, 0, 0, 1
		);

		var modelToLogicalArray = vp.transform.slice();

		repairViewportMatrix(modelToLogicalArray);

		var modelToLogical = new WGS.LmvMatrix4(true);
		modelToLogical.elements.set(modelToLogicalArray);

		var logicalToModel = new WGS.LmvMatrix4(true);
		logicalToModel.getInverse(modelToLogical);

		logicalToModel.multiply(pageToLogical);

		//Cache for future use
		f2d.viewportTransforms[vpId] = logicalToModel;

		return logicalToModel;
	};

	/**
	 * Paper coordinates to Model coordinates
	 */
	Model.prototype.pageToModel = function(point1, point2, vpId) {

		var vpXform = this.getPageToModelTransform(vpId);

		function applyToPoint(point) {
			if(point) {
				var modelPt = new THREE.Vector3().set(point.x, point.y, 0).applyMatrix4(vpXform);
				point.x = modelPt.x;
				point.y = modelPt.y;
			}
		}

		applyToPoint(point1);
		applyToPoint(point2);
	};

	/**
	 * Find the viewports that point lies in its bounds.
	 */
	Model.prototype.pointInClip = function(point, vpId) {

		var clips = this.getData().clips;
		var clipIds = []; // This will store ids of clip where point lies in

		// clip index starts at 1
		for(var i = 1; i < clips.length; i++) {
			// Don't need to check the point's own viewport's clip, it must be in that clip.
			if(i === vpId)
				continue;

			var contour = [];
			var contours = [];
			var contourCounts = clips[i].contourCounts;
			var points = clips[i].points;
			var index = 0;
			var pts = [];

			// Reorganize contour data
			for(var j = 0; j < contourCounts.length; j++) {
				for(var k = 0; k < contourCounts[j]; k++) {
					contour.push(index);
					index++;
				}
				contours.push(contour);
				contour = [];
			}
			for(var j = 0; j < points.length; j += 2) {
				var pt = {
					x: points[j],
					y: points[j + 1]
				};
				pts.push(pt);
			}

			var inside = this.pointInPolygon(point.x, point.y, contours, pts);
			if(inside)
				clipIds.push(i);
		}

		return clipIds;
	};

	Model.prototype.getClip = function(vpId) {

		var clips = this.getData().clips;

		var contour = [];
		var contours = [];
		var contourCounts = clips[vpId].contourCounts;
		var points = clips[vpId].points;
		var index = 0;
		var pts = [];

		// Reorganize contour data
		for(var j = 0; j < contourCounts.length; j++) {
			for(var k = 0; k < contourCounts[j]; k++) {
				contour.push(index);
				index++;
			}
			contours.push(contour);
			contour = [];
		}
		for(var j = 0; j < points.length; j += 2) {
			var pt = {
				x: points[j],
				y: points[j + 1]
			};
			pts.push(pt);
		}

		return {
			"contours": contours,
			"points": pts
		};
	};

	/**
	 * Return topology index of the fragment.
	 * @param {number} fragId - Fragment ID.
	 * @returns {number} Topology index.
	 */
	Model.prototype.getTopoIndex = function(fragId) {
		var data = this.getData();
		if(data && data.fragments) {
			var topoIndexes = data.fragments.topoIndexes;
			if(topoIndexes) {
				return topoIndexes[fragId];
			}
		}
	};

	/**
	 * Return topology data of one fragment.
	 * 
	 * Requires topology data to have been fetched with  
	 * [fetchTopology()]{@link ZhiUTech.Viewing.Model#fetchTopology}.
	 * 
	 * @param {number} index - Topology index.
	 * @returns {object} Topology data.
	 */
	Model.prototype.getTopology = function(index) {
		if(this.topology) {
			return this.topology[index];
		}
		return null;
	};

	/**
	 * See also [fetchTopology()]{@link ZhiUTech.Viewing.Model#fetchTopology}.
	 * @returns {boolean} true if topology data has been downloaded and is available in memory
	 */
	Model.prototype.hasTopology = function() {
		return !!this.topology;
	};

	/**
	 * Downloads the topology file, if one is available.
	 * The file may not get downloaded if the topology content size in memory is bigger
	 * than a specified limit (100 MB by default, 20 MB for mobile).
	 * 
	 * @param {number} maxSizeMB - Maximum uncompressed topology size allowed (in MegaBytes).
	 * 
	 * @returns {Promise} that resolves with the topology object.
	 */
	Model.prototype.fetchTopology = function(maxSizeMB) {

		// Debugging
		/*return new Promise(function(resolve, reject){
		     function aaa() {
		         if (zvp.debug_topo_yes) {
		             resolve([]);
		             return;
		         }
		         if (zvp.debug_topo_no) {
		             reject('Buuuu');
		             return;
		         }
		         requestAnimationFrame(aaa);
		     }
		     aaa();
		 });
		// */
		// Debugging end

		if(this.topology) // Already downloaded
			return Promise.resolve(this.topology);

		var data = this.getData();
		if(!data.topologyPath) // No path from where to download it
			return Promise.reject({
				error: "no-topology"
			});

		var maxTopologyFileSizeMB = maxSizeMB || (zv.isMobileDevice() ? 20 : 100); // MegaBytes; Non-gzipped
		if(data.topologySizeMB > maxTopologyFileSizeMB) // File is too big to download.
			return Promise.reject({
				error: "topology-too-big",
				limitMB: maxTopologyFileSizeMB,
				topologyMB: data.topologySizeMB
			});

		if(!this.topologyPromise) // Fetch it!
		{
			var that = this;
			this.topologyPromise = new Promise(function(resolve, reject) {
				that.loader.fetchTopologyFile(that.getData().topologyPath, function onComplete(topoData) {
					if(topoData && topoData.topology) {
						that.topology = topoData.topology;
						resolve(topoData.topology);
					} else {
						reject(topoData);
					}
				});
			});
		}

		return this.topologyPromise;
	};

	Model.prototype.hasGeometry = function() {
		var data = this.getData();
		if(data) {
			if(data.isLeaflet) { // see LeafletLoader.js
				return true;
			}
			return data.fragments.length > 0;
		}
		return false;
	};

	zv.Model = Model;

})();;
(function() {
	"use strict";

	var zv = ZhiUTech.Viewing;
	var zvp = zv.Private;
	var BatchSize = 1024;
	var ZeroLayers = {
		name: 'root',
		id: 'root',
		isLayer: false,
		children: [],
		childCount: 0
	};

	function ModelLayers(viewer) {

		this.viewer = viewer;
		this.matman = viewer.matman();
		this.model = null;
		this.root = null;
		this.initialized = false;

		this.layerToIndex = {};
		this.indexToLayer = [null];

		this.nodeToLayer = [];
	}

	var proto = ModelLayers.prototype;

	proto.addModel = function(model) {

		var onCreateLayers = function(root) {

			var data = this.model.getData();
			var tree = data.instanceTree;

			// Normalize children array, some roots come without children.
			root.children = root.children || [];
			root.childCount = root.children.length;

			// Layer to index, index to layer.
			this.indexToLayer = new Array(root.childCount + 1);
			this.indexToLayer[0] = null;

			for(var i = 0; i < root.childCount; ++i) {

				var layer = root.children[i];
				var name = layer.name;
				var id = layer.id;
				var index = layer.index;

				this.indexToLayer[index] = {
					name: name,
					id: id,
					index: index,
					visible: true
				};
				this.layerToIndex[name] = index;
			}

			// The rest is needed only for 3d models.        
			if(this.model.is2d()) {
				return;
			}

			// Map node ids witht their corresponding layers, only if present.
			if(root.childCount === 0) {
				return;
			}

			// Assign nodes to layers.
			this.nodeToLayer = (root.childCount <= 256 ?
				new Uint8Array(tree.nodeAccess.getNumNodes()) :
				new Uint16Array(tree.nodeAccess.getNumNodes())
			);

			var onLayerNodes = function(mapping) {

				if(!this.model)
					return;

				var data = this.model.getData();
				var tree = data.instanceTree;

				for(var layerName in mapping) {
					if(mapping.hasOwnProperty(layerName)) {
						var layerIndex = this.layerToIndex[layerName];
						var ids = mapping[layerName];
						for(var i = 0, len = ids.length; i < len; ++i) {
							var nodeIndex = tree.nodeAccess.getIndex(ids[i]);
							this.nodeToLayer[nodeIndex] = layerIndex;
						}
					}
				}
			}.bind(this);

			var onError = function() {
				zvp.logger.warn("ModelLayers error: coudn't get layers from property database.");
			}.bind(this);

			model.getLayerToNodeIdMapping(onLayerNodes, onError);
		}.bind(this);

		var onCreateLayersComplete = function(root) {
			this.root = root;
			this.initialized = true;
			this.activateLayerState("Initial");
			this.viewer.api.dispatchEvent({
				type: zv.MODEL_LAYERS_LOADED_EVENT,
				model: model,
				root: root
			});
		}.bind(this);

		this.model = model;
		(model.is2d() ? get2dLayers(model) : get3dLayers(model))
		.then(function(root) {
				onCreateLayers(root);
				onCreateLayersComplete(root);
			})
			.catch(function(error) {
				zvp.logger.warn(error);
				onCreateLayersComplete(ZeroLayers);
			});
	};

	proto.removeModel = function(model) {

		if(this.model !== model) {
			return;
		}

		this.model = null;
		this.root = null;
		this.initialized = false;

		this.layerToIndex = {};
		this.indexToLayer = [null];

		this.nodeToLayer = [];
	}

	proto.getRoot = function() {

		if(!this.initialized) {
			zvp.logger.warn("ZhiUTech.Viewing.ModelLayers.getRoot couldn't peform action, layers are still being loaded");
		}
		return this.root;
	};

	proto.showAllLayers = function() {

		showAllLayers(this, true);
	};

	proto.hideAllLayers = function() {

		showAllLayers(this, false);
	};

	proto.isLayerVisible = function(layer) {

		if(!this.initialized) {
			zvp.logger.warn("ZhiUTech.Viewing.ModelLayers.isLayerVisible couldn't peform action, layers are still being loaded");
			return false;
		}

		layer = getLayerIndex(this, layer);
		return this.indexToLayer[layer] && this.indexToLayer[layer].visible;
	};

	proto.setLayerVisible = function(layers, visible) {

		if(!this.initialized) {
			zvp.logger.warn("ZhiUTech.Viewing.ModelLayers.setLayersVisible couldn't peform action, layers are still being loaded");
			return;
		}

		// Get layer indices.
		var layerIndices = Array.isArray(layers) ? layers : [layers];
		layerIndices = layers.map(function(layer) {
			return getLayerIndex(this, layer);
		}.bind(this));

		// Hide / Show nodes.
		var model = this.model;
		var indexToLayer = this.indexToLayer;

		if(model.is2d()) {
			this.matman.setLayerVisible(layerIndices, visible);
			this.viewer.invalidate(true);
		} else {
			var skiptable = indexToLayer.map(function(layer) {
				return !!(layer === null || layerIndices.indexOf(layer.index) === -1 || layer.visible === visible);
			});

			var nodeIdBatch = [];
			var action = visible ?
				this.viewer.visibilityManager.show :
				this.viewer.visibilityManager.hide;

			forEachNode(this, function(dbId, layerIndex) {
				if(skiptable[layerIndex]) {
					return;
				}

				nodeIdBatch.push(dbId);

				if(nodeIdBatch.length === BatchSize) {
					action(nodeIdBatch, model);
					nodeIdBatch.length = 0;
				}
			});

			nodeIdBatch.length > 0 && action(nodeIdBatch, model);
		}

		// Mark layers as visible / invisible.
		var layerIndicesCount = layerIndices.length;
		for(var i = 0; i < layerIndicesCount; ++i) {
			var layer = this.indexToLayer[layerIndices[i]];
			if(layer) {
				layer.visible = visible;
			}
		}
	};

	proto.getVisibleLayerIndices = function() {

		if(!this.initialized) {
			zvp.logger.warn("ZhiUTech.Viewing.ModelLayers.getVisibleLayerIndices couldn't peform action, layers are still being loaded");
			return [];
		}

		var model = this.model;
		var visibleLayerIndices = [];

		var indexToLayer = this.indexToLayer;
		var indexTolayerCount = indexToLayer.length;

		for(var i = 1; i < indexTolayerCount; ++i) {
			var layer = indexToLayer[i];
			if(layer && layer.visible) {
				visibleLayerIndices.push(layer.index);
			}
		}

		return visibleLayerIndices;
	};

	/**
	 * Changes the active layer state.
	 * Get a list of all available layerStates and their active status through
	 *
	 * @param {string} stateName - Name of the layer state to activate.
	 */
	proto.activateLayerState = function(stateName) {

		if(!this.initialized) {
			zvp.logger.warn("ZhiUTech.Viewing.ModelLayers.activateLayerState couldn't peform action, layers are still being loaded");
			return;
		}

		var metadata = this.model.getData().metadata;
		var states = (metadata ? metadata.layer_states : null);

		if(this.model.is3d() || !states || !stateName) {
			return;
		}

		var j;
		for(j = 0; j < states.length; j++) {
			if(states[j].name === stateName) {
				break;
			}
		}

		if(j < states.length) {
			var layer_state = states[j];
			var visible = layer_state.visible_layers;

			var visibilityMap = {};
			if(visible && 0 < visible.length) {
				for(var k = 0; k < visible.length; k++)
					visibilityMap[visible[k]] = 1;
			}

			var onlayers = [];
			var offlayers = [];

			for(var l in metadata.layers) {
				var lname = metadata.layers[l].name;
				l = l | 0x0;
				if(visibilityMap[lname] === 1) {
					onlayers.push(l);
				} else {
					offlayers.push(l);
				}
			}

			this.setLayerVisible(onlayers, true);
			this.setLayerVisible(offlayers, false);
		}
	};

	/**
	 * Returns information for each layer state: name, description, active.
	 * Activate a state through {@link ZhiUTech.Viewing.Viewer3D#activateLayerState}.
	 * @returns {array}
	 */
	proto.getLayerStates = function() {

		// Shallow equal.
		function equal(a, b) {
			var aProps = Object.getOwnPropertyNames(a);
			var bProps = Object.getOwnPropertyNames(b);

			if(aProps.length !== bProps.length) {
				return false;
			}

			for(var i = 0; i < aProps.length; ++i) {
				var propName = aProps[i];
				if(a[propName] !== b[propName]) {
					return false;
				}
			}

			return true;
		}

		if(!this.initialized) {
			zvp.logger.warn("ZhiUTech.Viewing.ModelLayers.getLayerStates couldn't peform action, layers are still being loaded");
			return null;
		}

		var model = this.model;
		var metadata = model ? model.getData().metadata : null;
		var layers = metadata ? metadata.layers : null;
		var layer_states = metadata ? metadata.layer_states : null;

		// 3d model or no layers or no layer states? Nothing to do.
		if(this.model.is3d() || !layers || !layer_states) {
			return null;
		}

		// Which layers are currently visible?
		var layerName;
		var layerNames = {};
		var currentVisibleLayers = {};

		for(var layer in layers) {
			if(layers.hasOwnProperty(layer)) {
				var index = parseInt(layer);
				var defn = layers[layer];

				layerName = (typeof defn === 'string') ? defn : defn.name;
				layerNames[layerName] = true;

				if(this.isLayerVisible(index)) {
					currentVisibleLayers[layerName] = true;
				}
			}
		}

		var layerStates = [];
		for(var i = 0; i < layer_states.length; ++i) {
			var layer_state = layer_states[i];
			var visible_layers = layer_state.visible_layers;
			var layerStateVisibleLayers = {};

			// Ignore hidden layer states.
			if(!layer_state.hidden) {
				if(visible_layers && 0 < visible_layers.length) {
					for(var j = 0; j < visible_layers.length; ++j) {
						layerName = visible_layers[j];
						// Ignore layers we don't know about.
						if(layerNames.hasOwnProperty(layerName)) {
							layerStateVisibleLayers[layerName] = true;
						}
					}
				}

				layerStates.push({
					name: layer_state.name,
					description: layer_state.description,
					active: equal(currentVisibleLayers, layerStateVisibleLayers)
				});
			}
		}
		return(0 < layerStates.length) ? layerStates : null;
	};

	/**
	 * Retrieves layer root from model data.
	 *
	 * @returns {Promise} that resolves with an Array of layer objects.
	 */
	function get2dLayers(model) {

		var data = model.getData();
		var root = ZeroLayers;

		if(data && data.layersRoot) {
			root = data.layersRoot;
		}

		return Promise.resolve(root);
	};

	/**
	 * Scans the property database to find all available Layers.
	 * This feature is avilable for AutoCAD and DGN files.
	 *
	 * @returns {Promise} that resolves with an Array of layer objects.
	 */
	function get3dLayers(model) {

		var pdb = model.getPropertyDb();
		if(!pdb) {
			return Promise.resolve(ZeroLayers);
		}
		return pdb.findLayers();
	};

	function showAllLayers(self, show) {

		var model = self.model;
		var indexToLayer = self.indexToLayer;

		// Hide / Show nodes. 
		if(model.is2d()) {
			var layerIndices = [];
			for(var layer in self.layerToIndex) {
				layerIndices.push(self.layerToIndex[layer]);
			}
			self.matman.setLayerVisible(layerIndices, show);
			self.viewer.invalidate(true);
		} else {
			var nodeIdBatch = [];
			var action = show ?
				self.viewer.visibilityManager.show :
				self.viewer.visibilityManager.hide;

			forEachNode(self, function(dbId, layerIndex) {
				if(indexToLayer[layerIndex].visible === show) {
					return;
				}

				nodeIdBatch.push(dbId);

				if(nodeIdBatch.length === BatchSize) {
					action(nodeIdBatch, model);
					nodeIdBatch.length = 0;
				}
			});

			nodeIdBatch.length > 0 && action(nodeIdBatch, model);
		}

		// Update layers state.
		var indexToLayerCount = indexToLayer.length;
		for(var i = 1; i < indexToLayerCount; ++i) {
			var currentLayer = indexToLayer[i];
			if(currentLayer) {
				currentLayer.visible = show;
			}
		}
	};

	function forEachNode(self, callback) {

		var nodeToLayer = self.nodeToLayer;
		var nodeToLayerCount = nodeToLayer.length;
		var access = self.model.getData().instanceTree.nodeAccess;

		for(var dbId in access.dbIdToIndex) {
			var dbIdIndex = access.dbIdToIndex[dbId];
			var layerIndex = nodeToLayer[dbIdIndex] || 0;
			if(layerIndex !== 0) {
				callback(dbId | 0x0, layerIndex);
			}
		}
	};

	function getLayerIndex(self, layer) {

		return typeof layer === 'number' ? layer : self.layerToIndex[layer.name || layer] || 0;
	};

	zvp.ModelLayers = ModelLayers;
})();

; // WebRTC adapter (adapter.js) from Google

if(typeof window !== 'undefined') {

	var RTCPeerConnection = null;
	var getUserMedia = null;
	var attachMediaStream = null;
	var reattachMediaStream = null;
	var webrtcDetectedBrowser = null;
	var webrtcDetectedVersion = null;

	function trace(text) {
		// This function is used for logging.
		if(text[text.length - 1] == '\n') {
			text = text.substring(0, text.length - 1);
		}
		console.log((performance.now() / 1000).toFixed(3) + ": " + text);
	}

	if(navigator.mozGetUserMedia) {
		//console.log("This appears to be Firefox");

		webrtcDetectedBrowser = "firefox";

		webrtcDetectedVersion =
			parseInt(navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1]);

		// The RTCPeerConnection object.
		RTCPeerConnection = mozRTCPeerConnection;

		// The RTCSessionDescription object.
		RTCSessionDescription = mozRTCSessionDescription;

		// The RTCIceCandidate object.
		RTCIceCandidate = mozRTCIceCandidate;

		// Get UserMedia (only difference is the prefix).
		// Code from Adam Barth.
		getUserMedia = navigator.mozGetUserMedia.bind(navigator);

		// Creates iceServer from the url for FF.
		createIceServer = function(url, username, password) {
			var iceServer = null;
			var url_parts = url.split(':');
			if(url_parts[0].indexOf('stun') === 0) {
				// Create iceServer with stun url.
				iceServer = {
					'url': url
				};
			} else if(url_parts[0].indexOf('turn') === 0 &&
				(url.indexOf('transport=udp') !== -1 ||
					url.indexOf('?transport') === -1)) {
				// Create iceServer with turn url.
				// Ignore the transport parameter from TURN url.
				var turn_url_parts = url.split("?");
				iceServer = {
					'url': turn_url_parts[0],
					'credential': password,
					'username': username
				};
			}
			return iceServer;
		};

		// Attach a media stream to an element.
		attachMediaStream = function(element, stream) {
			console.log("Attaching media stream");
			element.mozSrcObject = stream;
			element.play();
		};

		reattachMediaStream = function(to, from) {
			console.log("Reattaching media stream");
			to.mozSrcObject = from.mozSrcObject;
			to.play();
		};

		// Fake get{Video,Audio}Tracks
		MediaStream.prototype.getVideoTracks = function() {
			return [];
		};

		MediaStream.prototype.getAudioTracks = function() {
			return [];
		};
	} else if(navigator.webkitGetUserMedia) {
		//console.log("This appears to be Chrome");

		var match = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);

		webrtcDetectedBrowser = "chrome";

		// need to check because this crashes on Chrome mobile emulation
		// 40 is an arbitrary version which the feature is available
		webrtcDetectedVersion = match ?
			parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]) : 40;

		// Creates iceServer from the url for Chrome.
		createIceServer = function(url, username, password) {
			var iceServer = null;
			var url_parts = url.split(':');
			if(url_parts[0].indexOf('stun') === 0) {
				// Create iceServer with stun url.
				iceServer = {
					'url': url
				};
			} else if(url_parts[0].indexOf('turn') === 0) {
				if(webrtcDetectedVersion < 28) {
					// For pre-M28 chrome versions use old TURN format.
					var url_turn_parts = url.split("turn:");
					iceServer = {
						'url': 'turn:' + username + '@' + url_turn_parts[1],
						'credential': password
					};
				} else {
					// For Chrome M28 & above use new TURN format.
					iceServer = {
						'url': url,
						'credential': password,
						'username': username
					};
				}
			}
			return iceServer;
		};

		// The RTCPeerConnection object.
		RTCPeerConnection = webkitRTCPeerConnection;

		// Get UserMedia (only difference is the prefix).
		// Code from Adam Barth.
		getUserMedia = navigator.webkitGetUserMedia.bind(navigator);

		// Attach a media stream to an element.
		attachMediaStream = function(element, stream) {
			if(typeof element.srcObject !== 'undefined') {
				element.srcObject = stream;
			} else if(typeof element.mozSrcObject !== 'undefined') {
				element.mozSrcObject = stream;
			} else if(typeof element.src !== 'undefined') {
				element.src = URL.createObjectURL(stream);
			} else {
				console.log('Error attaching stream to element.');
			}
		};

		reattachMediaStream = function(to, from) {
			to.src = from.src;
		};

		// The representation of tracks in a stream is changed in M26.
		// Unify them for earlier Chrome versions in the coexisting period.
		if(!webkitMediaStream.prototype.getVideoTracks) {
			webkitMediaStream.prototype.getVideoTracks = function() {
				return this.videoTracks;
			};
			webkitMediaStream.prototype.getAudioTracks = function() {
				return this.audioTracks;
			};
		}

		// New syntax of getXXXStreams method in M26.
		if(!webkitRTCPeerConnection.prototype.getLocalStreams) {
			webkitRTCPeerConnection.prototype.getLocalStreams = function() {
				return this.localStreams;
			};
			webkitRTCPeerConnection.prototype.getRemoteStreams = function() {
				return this.remoteStreams;
			};
		}
	} else {
		console.log("Browser does not appear to be WebRTC-capable");
	}

}

;
(function() {

	"use strict";

	var zv = ZhiUTech.Viewing,
		zvp = zv.Private;

	zvp.config = {
		userName: ""
	};

	zvp.setUserName = function(name) {
		zvp.config.userName = name;
	};

	var myio; //delay initialized pointer to socket.io library

	/** @constructor
	 *
	 *  MessageClient
	 *  Constructs a message client object, used for server-mediate publish/subscribe
	 *  message passing between connected users.
	 *
	 */
	function MessageClient(serverUrls, serverPath) {

		//Maps web socket commands to event types
		var MESSAGE_MAP = {
			"camera": "cameraChange",
			"pointer": "pointerMove",
			"joystick": "joystick",
			"state": "viewerState",
			"txt": "chatReceived",
			"joinok": "userListChange",
			"sessionId": "connectSucceeded",
			"joined": "userListChange",
			"left": "userListChange",
			"private": "privateMessage",
			"join_error": "socketError"
		};

		var _socket;
		var _myID = null;

		var _serverURL = Array.isArray(serverUrls) ? serverUrls : [serverUrls];
		var _currentServer = 0;

		var _pendingJoins = {};

		var _channels = {};

		var _this = this;

		function getUserName() {
			if(zvp.config.userName && zvp.config.userName.length)
				return zvp.config.userName;

			if(_myID)
				return _myID.slice(0, 5);

			return "Unknown";
		}

		function onRecv(msg) {

			//See if the message requires internal processing
			switch(msg.type) {

				case "txt":
					onChat(msg);
					break;

				case "joinok":
					onJoinOK(msg);
					break;

				case "join_error":
					break;

				case "sessionId":
					zvp.logger.info("Connect successful, your id is: " + msg.id);
					_myID = msg.id;
					break;

				case "joined":
					msg.userStatus = "joined";
					onJoined(msg);
					break;
				case "left":
					msg.userStatus = "left";
					onLeft(msg);
					break;
				case "camera":
				case "pointer":
					break;
				default:
					zvp.logger.log(msg);
					break;
			}

			//Determine what channel we are receiving the event on.
			//For example, a user list change can occur on either the collaboration channel (users in current session)
			//or on the presence channel (all users logged in), and the various GUI event handlers have to make decisions based
			//on that.
			var channelId = msg.roomId;

			//And send it to all listeners
			var evt = {
				type: MESSAGE_MAP[msg.type],
				data: msg,
				channelId: channelId
			};
			_this.dispatchEvent(evt);
		}

		function onJoined(evt) {
			if(!evt.user.name || !evt.user.name.length)
				evt.user.name = evt.user.id.slice(0, 5);

			if(evt.roomId) {
				var channel = _channels[evt.roomId];
				if(channel) {
					channel.users.push(evt.user);
					zvp.logger.info(evt.user + " joined room " + evt.roomId);
				} else {
					zvp.logger.warn("Channel " + evt.roomId + " does not exist for socket " + _myID);
				}
			}
		}

		function onLeft(evt) {
			zvp.logger.info(evt.user + " left room " + evt.room);
			for(var channelId in _channels) {
				var users = _channels[channelId].users;

				var idx = -1;
				for(var i = 0; i < users.length; i++) {
					if(users[i].id == evt.user) {
						idx = i;
						break;
					}
				}

				if(idx != -1)
					users.splice(idx, 1);

				delete _channels[channelId].userSet[evt.user];
			}
		}

		function onJoinOK(evt) {

			var channel = _channels[evt.roomId];

			zvp.logger.info("joined channel " + evt.roomId);

			if(evt.users && evt.users.length) {
				channel.users = evt.users;
			} else {
				channel.users = [];
			}

			for(var i = 0; i < channel.users.length; i++) {

				//Make up a user name if one is not known
				if(!channel.users[i].name || !channel.users[i].name.length) {
					channel.users[i].name = channel.users[i].id.slice(0, 5);
				}
			}

			var name = getUserName();
			var you = ZhiUTech.Viewing.i18n.translate("you");
			var me = {
				id: _myID,
				name: name + " (" + you + ")",
				isSelf: true,
				status: 0
			};
			if(!channel.userSet[_myID]) {
				channel.users.push(me);
				channel.userSet[_myID] = me;
			}

			//In case user name is already known, update the server.
			if(me.id.indexOf(name) != 0) {
				_this.sendChatMessage("/nick " + name, evt.roomId);
			}
		}

		function onChat(evt) {
			if(evt.msg.indexOf("/nick ") == 0) {
				var user = _this.getUserById(evt.from, evt.roomId);
				var newname = evt.msg.slice(6);

				if(newname.length) {
					user.name = newname;
					if(user.id == _myID) {
						var you = ZhiUTech.Viewing.i18n.translate("you");
						user.name += " (" + you + ")";
					}
				}

				_this.dispatchEvent({
					type: "userListChange",
					data: evt,
					channelId: evt.roomId
				});
			}
		}

		function onConnectError(evt) {

			//Attempt to connect to another server in case
			//the primary fails. If they all fail, then we give up.
			if(_currentServer < _serverURL.length) {

				zvp.logger.info("Connect failed, trying another server...");

				_socket.disconnect();
				_socket = null;
				_currentServer++;
				_this.connect(_this.sessionID);

			} else {

				_this.dispatchEvent({
					type: "socketError",
					data: evt
				});

			}
		}

		function onError(evt) {

			_this.dispatchEvent({
				type: "socketError",
				data: evt
			});

		}

		function onConnect(evt) {
			_currentServer = 0;

			//Join any channels that were delayed while the
			//connection is established.
			for(var p in _pendingJoins) {
				_this.join(p);
			}
		}

		/**
		 * Establish initial connection to the server specified when constructing the message client.
		 */
		this.connect = function(sessionID) {

			//TODO: Maintain multiple sockets to the same server, identifier by sessionID.

			if(_socket)
				return; //already connected to socket server.

			if(typeof window.WebSocket !== "undefined") {

				if(!myio)
					myio = (typeof lmv_io !== "undefined") ? lmv_io : io;

				this.sessionID = sessionID;

				_socket = myio.connect(_serverURL[_currentServer] + "?sessionID=" + sessionID, {
					path: serverPath,
					forceNew: true
				});
				_socket.on("connect", onConnect);
				_socket.on("message", onRecv);
				_socket.on("connect_error", onConnectError);
				_socket.on("error", onError);

				return true;
			} else {
				return false;
			}
		};

		/**
		 * Subscribe to a messaging channel. Requires connection to be active (i.e. connect() called before join()).
		 */
		this.join = function(channelId) {

			if(!_socket || !_socket.connected) {
				_pendingJoins[channelId] = 1;
				return;
			}

			delete _pendingJoins[channelId];

			_channels[channelId] = {
				id: channelId,
				users: [],
				userSet: {}
			};

			_socket.emit('join', {
				roomId: channelId,
				name: getUserName()
			});
		};

		/**
		 * Disconnect from message server.
		 */
		this.disconnect = function() {
			if(_socket) {
				_socket.disconnect();
				//_socket.close();
				_socket = null;
				_channels = {};
				_myID = null;
			}
		};

		/**
		 * Send a message of a specific type, containing given data object to a channel.
		 * Subscription (listening) to that channel is not required.
		 */
		this.sendMessage = function(type, data, channelId) {

			var evt = {
				type: type,
				from: _myID,
				msg: data,
				roomId: channelId
			};

			_socket.emit("message", evt);
		};

		/**
		 * Send a message object to an individual user.
		 */
		this.sendPrivateMessage = function(targetId, msg) {

			var evt = {
				type: "private",
				target: targetId,
				from: _myID,
				msg: msg
			};

			_socket.emit("message", evt);
		};

		/**
		 * A convenience wrapper of sendMessage to send a simple text chat message to a channel.
		 */
		this.sendChatMessage = function(msg, channelId) {

			var evt = {
				type: "txt",
				from: _myID,
				msg: msg,
				roomId: channelId
			};

			_socket.emit("message", evt);

			//This is done to handle /nick commands
			onRecv(evt);
		};

		/**
		 * Returns the user info object for a given user on a specific channel.
		 * User lists are maintained per channel.
		 */
		this.getUserById = function(id, channelId) {
			var users = _channels[channelId].users;
			for(var i = 0; i < users.length; i++) {
				if(users[i].id == id)
					return users[i];
			}
			return null;
		};

		/**
		 * Returns the local user's (randomly assigned) connection ID. Can be used to
		 * maintain hashmaps of users, since it's unique per server.
		 */
		this.getLocalId = function() {
			return _myID;
		};

		/**
		 * Returns a channel's info object.
		 */
		this.getChannelInfo = function(channelId) {
			return _channels[channelId];
		};

		this.isConnected = function() {
			return _socket;
		};
	};

	MessageClient.prototype.constructor = MessageClient;
	zv.EventDispatcher.prototype.apply(MessageClient.prototype);

	var _activeClients = {};

	MessageClient.GetInstance = function(serverUrls, path) {

		if(!serverUrls)
			serverUrls = zvp.EnvironmentConfigurations[zvp.env].LMV.RTC;

		if(!Array.isArray(serverUrls))
			serverUrls = [serverUrls];

		var mc = _activeClients[serverUrls[0]];
		if(mc)
			return mc;

		mc = new zvp.MessageClient(serverUrls, path);
		_activeClients[serverUrls[0]] = mc;
		return mc;
	};

	ZhiUTech.Viewing.Private.MessageClient = MessageClient;

})();;
ZhiUTechNamespace('ZhiUTech.Viewing.Private');

(function() {

	var zv = ZhiUTech.Viewing,
		zvp = zv.Private;

	//==================================================================================

	zvp.P2PClient = function(signalClient) {

		var _this = this;

		var _signalClient = signalClient;
		var _pc;
		var _isStarted = false;
		var _targetId;
		var _localStream;
		var _remoteStream;

		var _dataChannel;

		var _iceCandidates = [];

		var pc_config = {
			'iceServers': [{
				'url': 'stun:stun.l.google.com:19302'
			}]
		};

		var pc_constraints = {
			'optional': [{
				'DtlsSrtpKeyAgreement': true
			}]
		};

		// Set up audio and video regardless of what devices are present.

		var sdpConstraintsAll = {
			'mandatory': {
				'OfferToReceiveAudio': true,
				'OfferToReceiveVideo': true
			}
		};

		var sdpConstraintsNone = {
			'mandatory': {
				'OfferToReceiveAudio': false,
				'OfferToReceiveVideo': false
			}
		};

		_signalClient.addEventListener("privateMessage", onMessage);

		function createPeerConnection(wantDataChannel) {
			try {

				_pc = new RTCPeerConnection(pc_config);

				_pc.onicecandidate = function(event) {
					if(event.candidate) {
						_signalClient.sendPrivateMessage(_targetId, {
							type: 'candidate',
							label: event.candidate.sdpMLineIndex,
							id: event.candidate.sdpMid,
							candidate: event.candidate.candidate
						});
					} else {
						zvp.logger.log('End of candidates.');
					}
				};

				_pc.ondatachannel = function(event) {
					zvp.logger.log('Data channel added.');
					_dataChannel = event.channel;
					_dataChannel.onmessage = onDataMessage;
					_this.dispatchEvent({
						type: "dataChannelAdded",
						data: event.channel
					});
				};

				_pc.onaddstream = function(event) {
					zvp.logger.log('Remote stream added.');
					_remoteStream = event.stream;
					_this.dispatchEvent({
						type: "remoteStreamAdded",
						data: event.stream
					});
				};

				_pc.onremovestream = function(event) {
					zvp.logger.log('Remote stream removed. Event: ', event);
					_remoteStream = null;
					_this.dispatchEvent({
						type: "remoteStreamRemoved",
						data: event.stream
					});
				};

				if(wantDataChannel) {
					_dataChannel = _pc.createDataChannel("sendDataChannel", {
						reliable: false,
						ordered: false
					});
					_dataChannel.onmessage = onDataMessage;
				}
			} catch(e) {
				zvp.logger.error('Failed to create PeerConnection, exception: ' + e.message, zv.errorCodeString(zv.ErrorCodes.NETWORK_FAILURE));
				alert('Cannot create RTCPeerConnection object.');
				return;
			}
		}

		function handleCreateOfferError(event) {
			zvp.logger.error('createOffer() error: ', e, zv.errorCodeString(zv.ErrorCodes.UNKNOWN_FAILURE));
		}

		function setLocalAndSendMessage(sessionDescription) {
			// Set Opus as the preferred codec in SDP if Opus is present.
			//sessionDescription.sdp = preferOpus(sessionDescription.sdp);
			_pc.setLocalDescription(sessionDescription);
			//zvp.logger.log('setLocalAndSendMessage sending message' , sessionDescription);
			_signalClient.sendPrivateMessage(_targetId, sessionDescription);

			if(_iceCandidates.length) {
				for(var i = 0; i < _iceCandidates.length; i++)
					_pc.addIceCandidate(_iceCandidates[i]);
				_iceCandidates = [];
			}
		}
		/*
		        function requestTurn(turn_url) {
		          var turnExists = false;
		          for (var i in pc_config.iceServers) {
		            if (pc_config.iceServers[i].url.substr(0, 5) === 'turn:') {
		              turnExists = true;
		              turnReady = true;
		              break;
		            }
		          }
		          if (!turnExists) {
		            zvp.logger.log('Getting TURN server from ', turn_url);
		            // No TURN server. Get one from computeengineondemand.appspot.com:
		            var xhr = new XMLHttpRequest();
		            xhr.onreadystatechange = function(){
		              if (xhr.readyState === 4 && xhr.status === 200) {
		                var turnServer = JSON.parse(xhr.responseText);
		                zvp.logger.log('Got TURN server: ', turnServer);
		                pc_config.iceServers.push({
		                  'url': 'turn:' + turnServer.username + '@' + turnServer.turn,
		                  'credential': turnServer.password
		                });
		                turnReady = true;
		              }
		            };
		            xhr.open('GET', turn_url, true);
		            xhr.send();
		          }
		        }
		*/

		this.hangup = function() {
			zvp.logger.log('Hanging up.');
			if(_isStarted) {
				_signalClient.sendPrivateMessage(_targetId, 'bye');
				stop();
			}
		};

		this.initUserMedia = function(createConnectionCB) {
			function handleUserMedia(stream) {
				zvp.logger.log('Adding local stream.');
				if(createConnectionCB)
					createConnectionCB(stream);
				_this.dispatchEvent({
					type: "localStreamAdded",
					data: stream
				});
			}

			function handleUserMediaError(error) {
				zvp.logger.error('getUserMedia error: ', error, zv.errorCodeString(zv.ErrorCodes.NETWORK_SERVER_ERROR));
			}

			var constraints = {
				video: true,
				audio: true
			};
			window.getUserMedia(constraints, handleUserMedia, handleUserMediaError);

			zvp.logger.log('Getting user media with constraints', constraints);
		};

		this.callUser = function(userId, dataOnly) {
			if(_targetId) {
				zvp.logger.warn("Already in a call. Ignoring call request.");
				return;
			}

			_targetId = userId;

			zvp.logger.info("Calling user " + _targetId);

			if(dataOnly) {
				createPeerConnection(true);

				_isStarted = true;
				zvp.logger.log('Sending data channel offer to peer');
				_pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
			} else {
				this.initUserMedia(function(stream) {
					_localStream = stream;
					if(!_isStarted && typeof _localStream != 'undefined') {
						createPeerConnection(false);

						_pc.addStream(_localStream);
						_isStarted = true;
						zvp.logger.log('Sending audio/video offer to peer');
						_pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
					}
				});
			}
		};

		function isSDPDataOnly(sdp) {
			var lines = sdp.split("\n");
			var haveData = false;
			var haveAudio = false;
			var haveVideo = false;
			for(var i = 0; i < lines.length; i++) {
				if(lines[i].indexOf("a=mid:data") == 0) {
					haveData = true;
				}
				if(lines[i].indexOf("a=mid:video") == 0) {
					haveVideo = true;
				}
				if(lines[i].indexOf("a=mid:audio") == 0) {
					haveAudio = true;
				}
			}

			return haveData && !haveVideo && !haveAudio;
		}

		this.receiveCall = function(msg) {
			_targetId = msg.from;
			if(!_targetId)
				_targetId = msg.senderId;

			//Check if the caller wants audio/videio
			var sdp = msg.msg.sdp;
			if(isSDPDataOnly(sdp)) {
				createPeerConnection(true);
				_isStarted = true;

				_pc.setRemoteDescription(new RTCSessionDescription(msg.msg));
				zvp.logger.log('Sending data-only answer to peer.');
				_pc.createAnswer(setLocalAndSendMessage, null, sdpConstraintsNone);

			} else {
				this.initUserMedia(function(stream) {
					_localStream = stream;

					if(!_isStarted && typeof _localStream != 'undefined') {
						createPeerConnection(false);
						_pc.addStream(_localStream);
						_isStarted = true;
					}

					_pc.setRemoteDescription(new RTCSessionDescription(msg.msg));
					zvp.logger.log('Sending audio+video answer to peer.');
					_pc.createAnswer(setLocalAndSendMessage, null, sdpConstraintsAll);
				});
			}
		};

		function onDataMessage(evt) {
			var data = JSON.parse(evt.data);

			switch(data.type) {
				case "camera":
					_this.dispatchEvent({
						type: "cameraChange",
						data: data
					});
					break;
				case "joystick":
					_this.dispatchEvent({
						type: "joystick",
						data: data
					});
					break;
				case "state":
					_this.dispatchEvent({
						type: "viewerState",
						data: data
					});
					break;
				default:
					break;
			}
		}

		function onMessage(evt) {
			var message = evt.data.msg;
			zvp.logger.debug('Client received message:' + JSON.stringify(message));
			if(message.type == 'offer' && !_isStarted) {

				zvp.logger.log("Received offer. Accepting.");
				_this.receiveCall(evt.data);

			} else if(message.type === 'answer' && _isStarted) {

				_pc.setRemoteDescription(new RTCSessionDescription(message));

			} else if(message.type === 'candidate') {

				var candidate = new RTCIceCandidate({
					sdpMLineIndex: message.label,
					candidate: message.candidate
				});

				//If we receive ICE candidates before the local
				//session is started, we have to hold them in a temp list until
				//we create the answer
				if(_isStarted)
					_pc.addIceCandidate(candidate);
				else
					_iceCandidates.push(candidate);

			} else if(message === 'bye' && _isStarted) {

				_this.dispatchEvent({
					type: "remoteHangup",
					data: null
				});
				zvp.logger.info('Session terminated.');
				stop();
				// isInitiator = false;

			}
		}

		function stop() {
			_isStarted = false;
			// isAudioMuted = false;
			// isVideoMuted = false;
			_pc.close();
			_pc = null;
			_localStream = null;
			_remoteStream = null;
			_targetId = null;
		}

		this.getCurrentCallTarget = function() {
			return _targetId;
		}

		this.dataChannel = function() {
			return _dataChannel;
		}
	};

	zvp.P2PClient.prototype.constructor = zvp.P2PClient;
	ZhiUTech.Viewing.EventDispatcher.prototype.apply(zvp.P2PClient.prototype);

})();;
(function() {

	var zvp = ZhiUTech.Viewing.Private;

	ZhiUTech.Viewing.Private.LiveReviewClient = function(viewer) {

		this.viewer = viewer;
		this.messageClient = null;
		this.presenceChannelId = null;
		this.p2p = null;
		this.viewtx = null;
		this.interceptor = null;
	};

	ZhiUTech.Viewing.Private.LiveReviewClient.prototype.destroy = function() {
		this.leaveLiveReviewSession();
	};

	ZhiUTech.Viewing.Private.LiveReviewClient.prototype.joinLiveReviewSession = function(sessionId) {

		if(!this.messageClient)
			this.messageClient = zvp.MessageClient.GetInstance();
		if(!this.presenceChannelId)
			this.presenceChannelId = window.location.host;
		if(!this.messageClient.isConnected()) {
			this.messageClient.connect(sessionId);
		}

		if(!this.viewtx)
			this.viewtx = new zvp.ViewTransceiver(this.messageClient);
		this.viewtx.channelId = sessionId;
		this.viewtx.attach(this.viewer);

		if(!this.p2p)
			this.p2p = new zvp.P2PClient(this.messageClient);

		this.messageClient.join(this.viewtx.channelId);

		if(!this.interceptor)
			this.interceptor = new zvp.InteractionInterceptor(this.viewtx);
		this.viewer.toolController.registerTool(this.interceptor);
		this.viewer.toolController.activateTool(this.interceptor.getName());
	};

	ZhiUTech.Viewing.Private.LiveReviewClient.prototype.leaveLiveReviewSession = function() {
		this.p2p && this.p2p.hangup();
		this.viewtx && this.viewtx.detach(this.viewer);
		this.messageClient && this.messageClient.disconnect();
		if(this.interceptor) {
			this.viewer.toolController.deactivateTool(this.interceptor.getName());
		}

		this.p2p = null;
		this.viewtx = null;
		this.messageClient = null;
		this.interceptor = null;
	};

	var zv = ZhiUTech.Viewing,
		zvp = zv.Private;

	zvp.InteractionInterceptor = function(viewtx) {

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

	zvp.ViewTransceiver = function(client) {

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

			//zvp.logger.log(pt.x + " " + pt.y);
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

		this.attach = function(viewer, skipStateTracking) {

			if(_viewer)
				this.detach();

			this.viewer = _viewer = viewer;
			_viewerState = new zvp.ViewerState(_viewer);

			_client.addEventListener("cameraChange", onCamera);
			_client.addEventListener("pointerMove", onPointer);

			if(!_viewer.hasEventListener(zv.CAMERA_CHANGE_EVENT, sendCamera))
				_viewer.addEventListener(zv.CAMERA_CHANGE_EVENT, sendCamera);

			if(!skipStateTracking) {
				_client.addEventListener("viewerState", onViewerState);

				if(!_viewer.hasEventListener(zv.SELECTION_CHANGED_EVENT, sendViewerState)) {
					_viewer.addEventListener(zv.SELECTION_CHANGED_EVENT, sendViewerState);
					_viewer.addEventListener(zv.ISOLATE_EVENT, sendViewerState);
					_viewer.addEventListener(zv.HIDE_EVENT, sendViewerState);
					_viewer.addEventListener(zv.SHOW_EVENT, sendViewerState);
					_viewer.addEventListener(zv.EXPLODE_CHANGE_EVENT, sendViewerState);
					_viewer.addEventListener(zv.LAYER_VISIBILITY_CHANGED_EVENT, sendViewerState);
					_viewer.addEventListener(zv.CUTPLANES_CHANGE_EVENT, sendViewerState);
				}
			}
		};

		this.detach = function() {

			showPointer(false);

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

	zvp.ViewTransceiver.prototype.constructor = zvp.ViewTransceiver;
	ZhiUTech.Viewing.EventDispatcher.prototype.apply(zvp.ViewTransceiver.prototype);

})();;
var zvp = ZhiUTech.Viewing.Private;

/**
 * Autocam is the container for the view cube and steering wheel classes.
 * It contains math for camera transformations and most of the functions are retrieved from SampleCAM.
 * Refer to their documentation for explanation.
 */
zvp.Autocam = zvp.Autocam || function(camera, navApi, canvas) {

	var cam = this;
	var dropDownMenu = null;
	var cubeContainer = null;
	var _changing = false;

	this.cube = null;
	this.camera = camera;
	this.renderer = 'WEBGL';
	this.startState = {};
	this.navApi = navApi; // TODO: use this for camera sync.
	this.orthographicFaces = false;
	this.canvas = canvas;

	this.cameraChangedCallback = function() {};
	this.pivotDisplayCallback = function() {};
	this.transitionCompletedCallback = function() {};

	//delta Time
	var startTime = Date.now();
	var deltaTime;
	var setHomeDeferred = false;

	function changed(worldUpChanged) {
		_changing = true;
		camera.target.copy(cam.center);
		camera.pivot.copy(cam.pivot);

		if(camera.worldup)
			camera.worldup.copy(cam.sceneUpDirection);
		else
			camera.up.copy(cam.sceneUpDirection);

		cam.cameraChangedCallback(worldUpChanged);
		_changing = false;
	}

	this.dtor = function() {
		this.cube = null;
		this.cameraChangedCallback = null;
		this.pivotDisplayCallback = null;
		this.transitionCompletedCallback = null;
		this.canvas = null;
	};

	this.registerCallbackCameraChanged = function(callback) {
		this.cameraChangedCallback = callback;
	};
	this.registerCallbackPivotDisplay = function(callback) {
		this.pivotDisplayCallback = callback;
	};
	this.registerCallbackTransitionCompleted = function(callback) {
		this.transitionCompletedCallback = callback;
	};

	this.showPivot = function(state) {
		this.pivotDisplayCallback(state);
	};

	/*
    this.setViewCubeContainer = function( div )
    {
        cubeContainer = div;
    };
    */

	this.setWorldUpVector = function(newUp) {
		if(_changing)
			return;

		if(newUp && (newUp.lengthSq() > 0) && !newUp.normalize().equals(this.sceneUpDirection)) {
			// Changing up resets the front face:
			this.sceneUpDirection.copy(newUp);
			this.sceneFrontDirection.copy(this.getWorldFrontVector());
			this.cubeFront.copy(this.sceneFrontDirection).cross(this.sceneUpDirection).normalize();
			if(this.cube)
				requestAnimationFrame(this.cube.render);
		}
	};

	this.getWorldUpVector = function() {
		return this.sceneUpDirection.clone();
	};

	// Assumes sceneUpDirection is set.
	this.getWorldRightVector = function() {
		var vec = this.sceneUpDirection.clone();

		if(Math.abs(vec.z) <= Math.abs(vec.y)) {
			// Cross(Vertical, ZAxis)
			vec.set(vec.y, -vec.x, 0);
		} else if(vec.z >= 0) {
			// Cross(YAxis, Vertical)
			vec.set(vec.z, 0, -vec.x);
		} else {
			// Cross(Vertical, YAxis)
			vec.set(-vec.z, 0, vec.x);
		}
		return vec.normalize();
	};

	// Assumes sceneUpDirection is set.
	this.getWorldFrontVector = function() {
		var up = this.getWorldUpVector();
		return up.cross(this.getWorldRightVector()).normalize();
	};

	this.goToView = function(viewVector) {
		if(this.navApi.isActionEnabled('gotoview')) {
			var destination = {
				position: viewVector.position.clone(),
				up: viewVector.up.clone(),
				center: viewVector.center.clone(),
				pivot: viewVector.pivot.clone(),
				fov: viewVector.fov,
				worldUp: viewVector.worldUp.clone(),
				isOrtho: viewVector.isOrtho
			};
			cam.elapsedTime = 0;
			this.animateTransition(destination);
		}
	};

	this.getCurrentView = function() {
		return {
			position: camera.position.clone(),
			up: camera.up.clone(),
			center: this.center.clone(),
			pivot: this.pivot.clone(),
			fov: camera.fov,
			worldUp: this.sceneUpDirection.clone(),
			isOrtho: (camera.isPerspective === false)
		};
	};

	this.setCurrentViewAsHome = function(focusFirst) {
		if(focusFirst) {
			this.navApi.setRequestFitToView(true);
			setHomeDeferred = true;
		} else {
			this.homeVector = this.getCurrentView();
		}
	};

	// This method sets both the "current" home and the "original" home.
	// The latter is used for the "reset home" function.
	this.setHomeViewFrom = function(camera) {
		var pivot = camera.pivot ? camera.pivot : this.center;
		var center = camera.target ? camera.target : this.pivot;
		var worldup = camera.worldup ? camera.worldup : this.sceneUpDirection;

		this.homeVector = {
			position: camera.position.clone(),
			up: camera.up.clone(),
			center: center.clone(),
			pivot: pivot.clone(),
			fov: camera.fov,
			worldUp: worldup.clone(),
			isOrtho: (camera.isPerspective === false)
		};

		this.originalHomeVector = {
			position: camera.position.clone(),
			up: camera.up.clone(),
			center: center.clone(),
			pivot: pivot.clone(),
			fov: camera.fov,
			worldUp: worldup.clone(),
			worldFront: this.sceneFrontDirection.clone(), // Extra for reset orientation
			isOrtho: (camera.isPerspective === false)
		};
	};

	this.toPerspective = function() {
		if(!camera.isPerspective) {
			camera.toPerspective();
			changed(false);
		}
	};

	this.toOrthographic = function() {
		if(camera.isPerspective) {
			camera.toOrthographic();
			changed(false);
		}
	};

	this.setOrthographicFaces = function(state) {
		this.orthographicFaces = state;
	};

	this.goHome = function() {
		if(this.navApi.isActionEnabled('gotoview')) {
			this.navApi.setPivotSetFlag(false);
			this.goToView(this.homeVector);
		}
	};

	this.resetHome = function() {
		this.homeVector.position.copy(this.originalHomeVector.position);
		this.homeVector.up.copy(this.originalHomeVector.up);
		this.homeVector.center.copy(this.originalHomeVector.center);
		this.homeVector.pivot.copy(this.originalHomeVector.pivot);
		this.homeVector.fov = this.originalHomeVector.fov;
		this.homeVector.worldUp.copy(this.originalHomeVector.worldUp);
		this.homeVector.isOrtho = this.originalHomeVector.isOrtho;
		this.goHome();
	};

	this.getView = function() {
		return this.center.clone().sub(camera.position);
	};

	this.setCameraUp = function(up) {
		var view = this.dir.clone();
		var right = view.cross(up).normalize();
		if(right.lengthSq() === 0) {
			// Try again after perturbing eye direction:
			view.copy(this.dir);
			if(up.z > up.y)
				view.y += 0.0001;
			else
				view.z += 0.0001;

			right = view.cross(up).normalize();
		}
		// Orthogonal camera up direction:
		camera.up.copy(right).cross(this.dir).normalize();
	};

	/***
	this.render = function(){
	    //renderer.render( scene, camera );
	    //We need to remove all calls to this render
	    zvp.logger.log("Unrequired call to render within Autocam.js:17")
	};
	***/

	(function animate() {
		requestAnimationFrame(animate);
		// Is there an assumption here about the order of animation frame callbacks?
		var now = Date.now();
		deltaTime = now - startTime;
		startTime = now;
	}());

	//Control variables
	this.ortho = false;
	this.center = camera.target ? camera.target.clone() : new THREE.Vector3(0, 0, 0);
	this.pivot = camera.pivot ? camera.pivot.clone() : this.center.clone();

	this.sceneUpDirection = camera.worldup ? camera.worldup.clone() : camera.up.clone();
	this.sceneFrontDirection = this.getWorldFrontVector();

	//
	//dir, up, left vector
	this.dir = this.getView();

	// Compute "real" camera up:
	this.setCameraUp(camera.up);

	this.saveCenter = this.center.clone();
	this.savePivot = this.pivot.clone();
	this.saveEye = camera.position.clone();
	this.saveUp = camera.up.clone();
	var prevEye, prevCenter, prevUp, prevPivot;

	this.cubeFront = this.sceneFrontDirection.clone().cross(this.sceneUpDirection).normalize();

	this.setHomeViewFrom(camera);

	var rotInitial = new THREE.Quaternion();
	var rotFinal = new THREE.Quaternion();
	var rotTwist = new THREE.Quaternion();
	var rotSpin = new THREE.Quaternion();
	var distInitial;
	var distFinal;

	/**
	 * Holds the default pan speed multiplier of 0.5
	 * @type {number}
	 */
	this.userPanSpeed = 0.5;

	/**
	 * Holds the default look speed multiplier of 2.0
	 * @type {number}
	 */
	this.userLookSpeed = 2.0;

	/**
	 * Holds the default height speed multiplier of 5.0 (used in updown function)
	 * @type {number}
	 */
	this.userHeightSpeed = 5.0;

	/**
	 * Holds the current walk speed multiplier, which can be altered in the steering wheel drop down menu (between 0.24 and 8)
	 * @type {number}
	 */
	this.walkMultiplier = 1.0;

	/**
	 * Holds the default zoom speed multiplier of 1.015
	 * @type {number}
	 */
	this.userZoomSpeed = 1.015;

	/**
	 * Holds the orbit multiplier of 5.0
	 * @type {number}
	 */
	this.orbitMultiplier = 5.0;
	this.currentlyAnimating = false;

	//look
	camera.keepSceneUpright = true;

	//orbit
	this.preserveOrbitUpDirection = true;
	this.alignOrbitUpDirection = true;
	this.constrainOrbitHorizontal = false;
	this.constrainOrbitVertical = false;
	this.doCustomOrbit = false;
	this.snapOrbitDeadZone = 0.045;
	this.snapOrbitThresholdH = this.snapOrbitThresholdV = THREE.Math.degToRad(15.0);
	this.snapOrbitAccelerationAX = this.snapOrbitAccelerationAY = 1.5;
	this.snapOrbitAccelerationBX = this.snapOrbitAccelerationBY = 2.0;
	this.snapOrbitAccelerationPointX = this.snapOrbitAccelerationPointY = 0.5;
	this.alignDirTable = new Array(26);
	this.alignDirTable[0] = new THREE.Vector3(-1, 0, 0);
	this.alignDirTable[1] = new THREE.Vector3(1, 0, 0);
	this.alignDirTable[2] = new THREE.Vector3(0, -1, 0);
	this.alignDirTable[3] = new THREE.Vector3(0, 1, 0);
	this.alignDirTable[4] = new THREE.Vector3(0, 0, -1);
	this.alignDirTable[5] = new THREE.Vector3(0, 0, 1);

	// fill edges
	this.alignDirTable[6] = new THREE.Vector3(-1, -1, 0);
	this.alignDirTable[7] = new THREE.Vector3(-1, 1, 0);
	this.alignDirTable[8] = new THREE.Vector3(1, -1, 0);
	this.alignDirTable[9] = new THREE.Vector3(1, 1, 0);
	this.alignDirTable[10] = new THREE.Vector3(0, -1, -1);
	this.alignDirTable[11] = new THREE.Vector3(0, -1, 1);
	this.alignDirTable[12] = new THREE.Vector3(0, 1, -1);
	this.alignDirTable[13] = new THREE.Vector3(0, 1, 1);
	this.alignDirTable[14] = new THREE.Vector3(-1, 0, -1);
	this.alignDirTable[15] = new THREE.Vector3(1, 0, -1);
	this.alignDirTable[16] = new THREE.Vector3(-1, 0, 1);
	this.alignDirTable[17] = new THREE.Vector3(1, 0, 1);

	// fill corners
	this.alignDirTable[18] = new THREE.Vector3(-1, -1, -1);
	this.alignDirTable[19] = new THREE.Vector3(-1, -1, 1);
	this.alignDirTable[20] = new THREE.Vector3(-1, 1, -1);
	this.alignDirTable[21] = new THREE.Vector3(-1, 1, 1);
	this.alignDirTable[22] = new THREE.Vector3(1, -1, -1);
	this.alignDirTable[23] = new THREE.Vector3(1, -1, 1);
	this.alignDirTable[24] = new THREE.Vector3(1, 1, -1);
	this.alignDirTable[25] = new THREE.Vector3(1, 1, 1);

	this.combined = false;

	//variables used for snapping
	this.useSnap = false;
	this.lockDeltaX = 0.0;
	this.lockedX = false;
	this.lastSnapRotateX = 0.0;
	this.lockDeltaY = 0.0;
	this.lockedY = false;
	this.lastSnapRotateY = 0.0;
	this.lastSnapDir = new THREE.Vector3(0, 0, 0);

	//up-down
	this.topLimit = false;
	this.bottomLimit = false;
	this.minSceneBound = 0;
	this.maxSceneBound = 0;

	//shot
	var shotParams = {
		destinationPercent: 1.0,
		duration: 1.0,
		zoomToFitScene: true,
		useOffAxis: false
	};
	this.shotParams = shotParams; // Expose these for modification
	var camParamsInitial, camParamsFinal;

	//zoom
	this.zoomDelta = new THREE.Vector2();
	var unitAmount = 0.0;

	//walk
	var m_resetBiasX, m_resetBiasY, m_bias;

	//info about model object we need to save for fit to window
	var boundingBoxMin = new THREE.Vector3();
	var boundingBoxMax = new THREE.Vector3();

	/**
	 * Parameters to control the saving and displaying of the rewind timeline
	 * @example <caption> Changing the maximum number of stored rewind cameras from 25(default) to 50 </caption>
	 * cam.rewindParams.maxHistorySize = 50;
	 */
	this.rewindParams = {
		history: [],
		startTime: undefined,
		thumbnailSize: 56.0,
		thumbnailGapSize: 12.0,
		maxHistorySize: 25,
		snappingEnabled: true,
		timelineIndex: 0,
		timelineIndexSlide: 0,
		open: false,
		openLocation: new THREE.Vector2(0, 0),
		openBracket: new THREE.Vector2(0, 0),
		openBracketA: new THREE.Vector2(0, 0),
		openBracketB: new THREE.Vector2(0, 0),
		openLocationOrigin: new THREE.Vector2(0, 0),
		locationOffset: new THREE.Vector2(0, 0),
		snapOffset: new THREE.Vector2(0, 0),
		slideOffset: new THREE.Vector2(0, 0),
		snapped: true,
		resetWeights: false,
		recordEnabled: false,
		elementIsRecording: false
	};

	this.viewCubeMenuOpen = false;
	this.menuSize = new THREE.Vector2(0, 0);
	this.menuOrigin = new THREE.Vector2(0, 0);

	camera.lookAt(this.center);

	// function windowResize(){
	// refresh camera on size change

	// We handle this elsewhere
	/*
	    renderer.setSize( window.innerWidth, window.innerHeight );
	    camera.aspect = window.innerWidth / window.innerHeight;
	    camera.topFov = camera.bottomFov = camera.fov/2;
	    camera.leftFov = camera.rightFov = (camera.aspect * camera.fov)/2;
	    camera.updateProjectionMatrix();
	*/
	// }

	/***
	windowResize();
	window.addEventListener('resize', windowResize, false);
	***/

	this.setCube = function(viewcube) {
		this.cube = viewcube; // DOH!!!
	};

	/**
	 * Function which loads the JSON object to the scene
	 * @param {JSONObject} model - The correctly formatted JSON model
	 * @param {Vector3} scale - The scale multiplier for the input model
	 * @param {Vector3} position - Where to load the model
	 * @example <caption>Load an object called car.json to (0,0,0) with a scale of 50 </caption>
	 * cam.loadObject('Objects/car.json', new THREE.Vector3(50,50,50), new THREE.Vector3(0,0,0));
	 */
	this.loadObject = function(model, scale, position) {
		loader = new THREE.JSONLoader();
		loader.load(model, function(geometry, materials) {
			var faceMaterial = new THREE.MeshPhongMaterial(materials);
			mesh = new THREE.Mesh(geometry, faceMaterial);
			mesh.scale = scale;
			mesh.position.copy(position);
			mesh.geometry.computeBoundingBox();
			var bBox = mesh.geometry.boundingBox.clone();
			boundingBoxMax.set(bBox.max.x, bBox.max.y, bBox.max.z);
			boundingBoxMin.set(bBox.min.x, bBox.min.y, bBox.min.z);
			boundingBoxMax.multiply(scale);
			boundingBoxMin.multiply(scale);
			scene.add(mesh);
			objects.push(mesh);
		});
	};

	// Sync our local data from the given external camera:
	this.sync = function(clientCamera) {
		if(clientCamera.isPerspective !== camera.isPerspective) {
			if(clientCamera.isPerspective) {
				camera.toPerspective();
			} else {
				camera.toOrthographic();
				if(clientCamera.saveFov)
					camera.saveFov = clientCamera.saveFov;
			}
		}
		camera.fov = clientCamera.fov;
		camera.position.copy(clientCamera.position);

		if(clientCamera.target) {
			this.center.copy(clientCamera.target);
			camera.target.copy(clientCamera.target);
		}
		if(clientCamera.pivot) {
			this.pivot.copy(clientCamera.pivot);
			camera.pivot.copy(clientCamera.pivot);
		}
		this.dir.copy(this.center).sub(camera.position);

		this.setCameraUp(clientCamera.up);

		var worldUp = clientCamera.worldup ? clientCamera.worldup : clientCamera.up;
		if(worldUp.distanceToSquared(this.sceneUpDirection) > 0.0001) {
			this.setWorldUpVector(worldUp);
		}

		if(setHomeDeferred && !this.navApi.getTransitionActive()) {
			setHomeDeferred = false;
			this.setCurrentViewAsHome(false);
		}
		if(this.cube)
			requestAnimationFrame(this.cube.render);
	};

	this.refresh = function() {
		if(this.cube)
			this.cube.refreshCube();
	};

	/*        Prototyped Functions          */

	//extending Box2 to be used like AutoCam::Box2
	THREE.Box2.prototype.setCenter = function(center) {
		var halfSize = new THREE.Vector2((Math.abs(this.max.x - this.min.x) / 2.0), (Math.abs(this.max.y - this.min.y)) / 2.0);
		this.min.copy(center).sub(halfSize);
		this.max.copy(center).add(halfSize);
		return this;
	};

	//Using Box2 like an AutoCam::Icon2D
	THREE.Box2.prototype.getIcon2DCoords = function(Pscreen, PIcon2D) {
		var zero = this.center;
		PIcon2D.set((Pscreen.x - zero.x) / (this.size().x / 2.0), (Pscreen.y - zero.y) / (this.size().y / 2.0));
	};

	//so we dont need a matrix4 as an intermediate
	THREE.Matrix3.prototype.makeRotationFromQuaternion = function(q) {
		var te = this.elements;

		var x = q.x,
			y = q.y,
			z = q.z,
			w = q.w;
		var x2 = x + x,
			y2 = y + y,
			z2 = z + z;
		var xx = x * x2,
			xy = x * y2,
			xz = x * z2;
		var yy = y * y2,
			yz = y * z2,
			zz = z * z2;
		var wx = w * x2,
			wy = w * y2,
			wz = w * z2;

		te[0] = 1 - (yy + zz);
		te[3] = xy - wz;
		te[6] = xz + wy;

		te[1] = xy + wz;
		te[4] = 1 - (xx + zz);
		te[7] = yz - wx;

		te[2] = xz - wy;
		te[5] = yz + wx;
		te[8] = 1 - (xx + yy);

		return this;
	};

	// changed to accept a matrix3
	THREE.Quaternion.prototype.setFromRotationMatrix3 = function(m) {
		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

		var te = m.elements,
			m11 = te[0],
			m12 = te[3],
			m13 = te[6],
			m21 = te[1],
			m22 = te[4],
			m23 = te[7],
			m31 = te[2],
			m32 = te[5],
			m33 = te[8],

			trace = m11 + m22 + m33,
			s;

		if(trace > 0) {
			s = 0.5 / Math.sqrt(trace + 1.0);
			this.w = 0.25 / s;
			this.x = (m32 - m23) * s;
			this.y = (m13 - m31) * s;
			this.z = (m21 - m12) * s;
		} else if(m11 > m22 && m11 > m33) {
			s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
			this.w = (m32 - m23) / s;
			this.x = 0.25 * s;
			this.y = (m12 + m21) / s;
			this.z = (m13 + m31) / s;
		} else if(m22 > m33) {
			s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
			this.w = (m13 - m31) / s;
			this.x = (m12 + m21) / s;
			this.y = 0.25 * s;
			this.z = (m23 + m32) / s;
		} else {
			s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
			this.w = (m21 - m12) / s;
			this.x = (m13 + m31) / s;
			this.y = (m23 + m32) / s;
			this.z = 0.25 * s;
		}
		return this;
	};

	// NOTE: This modifies the incoming vector!!
	// TODO: Change all calls to use Vector3.applyQuaternion instead.
	THREE.Quaternion.prototype.rotate = function(vector) {
		//From AutoCamMath.h file
		var kRot = new THREE.Matrix4().makeRotationFromQuaternion(this);
		var e = kRot.elements;

		//converting 4d matrix to 3d
		var viewRot = new THREE.Matrix3().set(e[0], e[1], e[2], e[4], e[5], e[6], e[8], e[9], e[10]);

		return vector.applyMatrix3(viewRot);
	};

	THREE.Vector3.prototype.findAngleWith = function(b, axis) {
		var angle = 0.0;
		var cosAngle = this.clone().normalize().clone().dot(b.clone().normalize());

		var axisCheck = (this.clone().cross(b)).clone().normalize();
		if(axisCheck.clone().length() < Number.MIN_VALUE) {
			if(cosAngle > 0.0) {
				angle = 0.0;
			} else {
				angle = 180.0;
			}
		} else {

			var cosCheck = axisCheck.clone().dot(axis.clone().normalize());

			//check to make sure user specified axis is orthogonal to vectors.
			//If it isn't we take the closer of the two choices.
			axis = cosCheck > 0.0 ? axisCheck : -axisCheck;

			var cosAngleNextQuadrant = new THREE.Quaternion().setFromAxisAngle(axis, 90.0 * THREE.Math.degToRad);
			cosAngleNextQuadrant = ((cosAngleNextQuadrant.clone().rotate(b)).clone().normalize()).clone().dot(this);
			angle = Math.acos(cosAngle) * THREE.Math.radToDeg;

			if(Math.abs(angle - 90.0) < Number.MIN_VALUE)
				angle = 90.0;

			if((angle < 90.0 && cosAngle * cosAngleNextQuadrant > 0.0) ||
				(angle > 90.0 && cosAngle * cosAngleNextQuadrant < 0.0) ||
				(angle == 90.0 && cosAngleNextQuadrant > 0.0))
				angle = -1.0 * angle; //figure out whether we need to turn left or right
		}

		angle = THREE.Math.degToRad(angle);
		return angle;
	};

	if(!('contains' in String.prototype))
		String.prototype.contains = function(str, startIndex) {
			return -1 !== String.prototype.indexOf.call(this, str, startIndex);
		};

	Math.linearClamp = function(x, a, b) {
		if(x <= a) {
			return 0.0;
		}
		if(x >= b) {
			return 1.0;
		}

		return(x - a) / (b - a);
	};

	Math.easeClamp = function(x, a, b) {
		if(x <= a) {
			return 0.0;
		}
		if(x >= b) {
			return 1.0;
		}

		var t = (x - a) / (b - a);
		return 0.5 * (Math.sin((t - 0.5) * Math.PI) + 1.0);
	};

	Math.linearInterp = function(t, a, b) {
		return a * (1.0 - t) + b * t;
	};

	Math.equalityClamp = function(x, a, b) {
		if(x <= a) {
			return a;
		}
		if(x >= b) {
			return b;
		}

		return x;
	};

	Math.round2 = function(x) {
		return(Math.round(x * 100)) / 100;
	};

	Math.round1 = function(x) {
		return(Math.round(x * 10)) / 10;
	};

	/*      SHOT OPERATION      */

	//transitions smoothly to destination
	this.animateTransition = function(destination) {

		if(!destination) {
			return;
		}

		var worldUpChanged = false;
		var unitTime = 0.0;

		this.setCameraOrtho(destination.isOrtho);

		if(cam.elapsedTime >= shotParams.duration) {
			unitTime = 1.0;

			cam.center.copy(destination.center);
			cam.pivot.copy(destination.pivot);
			camera.position.copy(destination.position);
			camera.up.copy(destination.up);
			camera.target.copy(destination.center);
			if(!destination.isOrtho)
				camera.fov = destination.fov;
			camera.dirty = true;

			worldUpChanged = !destination.worldUp.equals(this.sceneUpDirection);
			if(worldUpChanged)
				this.setWorldUpVector(destination.worldUp);

			this.currentlyAnimating = false;
			changed(worldUpChanged);
			this.showPivot(false);
			if(this.cube)
				requestAnimationFrame(this.cube.render);

			this.addHistoryElement();
			this.navApi.setTransitionActive(false);
			this.transitionCompletedCallback();
			return;
		}
		this.currentlyAnimating = true;
		this.showPivot(true);
		this.navApi.setTransitionActive(true);

		var tMax = shotParams.destinationPercent;
		unitTime = Math.easeClamp(cam.elapsedTime / shotParams.duration, 0.0, tMax);
		var oneMinusTime = 1.0 - unitTime;
		cam.elapsedTime += deltaTime / 500;

		var center = (cam.center.clone().multiplyScalar(oneMinusTime)).add(destination.center.clone().multiplyScalar(unitTime));
		var position = (camera.position.clone().multiplyScalar(oneMinusTime)).add(destination.position.clone().multiplyScalar(unitTime));
		var up = (camera.up.clone().multiplyScalar(oneMinusTime)).add(destination.up.clone().multiplyScalar(unitTime));
		var pivot = (camera.pivot.clone().multiplyScalar(oneMinusTime)).add(destination.pivot.clone().multiplyScalar(unitTime));
		var worldUp = (this.sceneUpDirection.clone().multiplyScalar(oneMinusTime)).add(destination.worldUp.clone().multiplyScalar(unitTime));
		var fov = camera.fov * oneMinusTime + destination.fov * unitTime;

		cam.center.copy(center);
		cam.pivot.copy(pivot);
		camera.position.copy(position);
		camera.up.copy(up);
		camera.target.copy(center);
		if(!destination.isOrtho)
			camera.fov = fov;
		camera.dirty = true;

		worldUpChanged = (worldUp.distanceToSquared(this.sceneUpDirection) > 0.0001);
		if(worldUpChanged)
			this.setWorldUpVector(worldUp);

		camera.lookAt(cam.center);
		changed(worldUpChanged);

		if(this.cube)
			requestAnimationFrame(this.cube.render);

		requestAnimationFrame(function() {
			cam.animateTransition(destination);
		});
	};

	//used for view cube transforms, to see difference between this and linear interpolation watch
	//http://www.youtube.com/watch?v=uNHIPVOnt-Y
	this.sphericallyInterpolateTransition = function(completionCallback) {
		var center, position, up;
		var unitTime = 0.0;
		this.currentlyAnimating = true;
		this.navApi.setTransitionActive(true);

		if(cam.elapsedTime >= shotParams.duration) {
			unitTime = 1.0;
			this.currentlyAnimating = false;
		} else {
			var tMax = shotParams.destinationPercent;
			unitTime = Math.easeClamp(cam.elapsedTime / shotParams.duration, 0.0, tMax);
			cam.elapsedTime += deltaTime / 500;
		}

		// This seems to avoid some error in the rotation:
		if(unitTime === 1.0) {
			position = camParamsFinal.position;
			center = camParamsFinal.center;
			up = camParamsFinal.up;
		} else {
			var M = new THREE.Matrix3();
			var rot = rotInitial.clone();
			rot.slerp(rotFinal, (unitTime));
			M.makeRotationFromQuaternion(rot);
			var dist = Math.linearInterp(unitTime, distInitial, distFinal);

			var e = M.elements;

			center = camParamsInitial.center.clone().multiplyScalar(1.0 - unitTime).add(camParamsFinal.center.clone().multiplyScalar(unitTime));
			position = center.clone().sub(new THREE.Vector3(e[0], e[1], e[2]).multiplyScalar(dist));
			up = new THREE.Vector3(e[3], e[4], e[5]);
		}
		cam.center.copy(center);
		camera.position.copy(position);
		camera.up.copy(up);

		// The above code will have to change if we want the proper rotation
		// to occur about the pivot point instead of the center.
		if(!cam.navApi.getUsePivotAlways())
			cam.pivot.copy(center);

		camera.lookAt(cam.center);

		if(this.currentlyAnimating === true) {
			this.showPivot(true);
			requestAnimationFrame(function() {
				cam.sphericallyInterpolateTransition(completionCallback);
			});
		} else {
			this.navApi.setTransitionActive(false);
			this.showPivot(false);
			this.addHistoryElement();

			if(this.orthographicFaces && this.isFaceView())
				this.setCameraOrtho(true);

			if(completionCallback)
				completionCallback();
		}
		changed(false);
		if(this.cube)
			requestAnimationFrame(this.cube.render);
	};

	//This is used to determine the relation between camera up vector and scene direction, used to determine which
	//face to translate to when clicking on a viewcube arrow
	this.getOrientation = function() {
		if(!this.cube)
			return;

		var camX = Math.round1(camera.up.x);
		var camY = Math.round1(camera.up.y);
		var camZ = Math.round1(camera.up.z);
		var sceneFront = this.sceneFrontDirection.clone();
		var sceneUp = this.sceneUpDirection.clone();
		var sceneRight = this.sceneFrontDirection.clone().cross(this.sceneUpDirection).normalize();
		sceneFront.x = Math.round1(sceneFront.x);
		sceneFront.y = Math.round1(sceneFront.y);
		sceneFront.z = Math.round1(sceneFront.z);
		sceneUp.x = Math.round1(sceneUp.x);
		sceneUp.y = Math.round1(sceneUp.y);
		sceneUp.z = Math.round1(sceneUp.z);
		sceneRight.x = Math.round1(sceneRight.x);
		sceneRight.y = Math.round1(sceneRight.y);
		sceneRight.z = Math.round1(sceneRight.z);
		var sceneLeft = sceneRight.clone().multiplyScalar(-1);
		var sceneDown = sceneUp.clone().multiplyScalar(-1);
		var sceneBack = sceneFront.clone().multiplyScalar(-1);

		switch(this.cube.currentFace) {
			case "front":
				if(sceneUp.x == camX && sceneUp.y == camY && sceneUp.z == camZ)
					return "up";
				else if(sceneDown.x == camX && sceneDown.y == camY && sceneDown.z == camZ)
					return "down";
				else if(sceneRight.x == camX && sceneRight.y == camY && sceneRight.z == camZ)
					return "right";
				else if(sceneLeft.x == camX && sceneLeft.y == camY && sceneLeft.z == camZ)
					return "left"
				break;
			case "right":
				if(sceneUp.x == camX && sceneUp.y == camY && sceneUp.z == camZ)
					return "up";
				else if(sceneDown.x == camX && sceneDown.y == camY && sceneDown.z == camZ)
					return "down";
				else if(sceneBack.x == camX && sceneBack.y == camY && sceneBack.z == camZ)
					return "left";
				else if(sceneFront.x == camX && sceneFront.y == camY && sceneFront.z == camZ)
					return "right"
				break;
			case "left":
				if(sceneUp.x == camX && sceneUp.y == camY && sceneUp.z == camZ)
					return "up";
				else if(sceneDown.x == camX && sceneDown.y == camY && sceneDown.z == camZ)
					return "down";
				else if(sceneFront.x == camX && sceneFront.y == camY && sceneFront.z == camZ)
					return "left";
				else if(sceneBack.x == camX && sceneBack.y == camY && sceneBack.z == camZ)
					return "right"
				break;
			case "back":
				if(sceneUp.x == camX && sceneUp.y == camY && sceneUp.z == camZ)
					return "up";
				else if(sceneDown.x == camX && sceneDown.y == camY && sceneDown.z == camZ)
					return "down";
				else if(sceneLeft.x == camX && sceneLeft.y == camY && sceneLeft.z == camZ)
					return "right";
				else if(sceneRight.x == camX && sceneRight.y == camY && sceneRight.z == camZ)
					return "left"
				break;
			case "top":
				if(sceneBack.x == camX && sceneBack.y == camY && sceneBack.z == camZ)
					return "down";
				else if(sceneFront.x == camX && sceneFront.y == camY && sceneFront.z == camZ)
					return "up";
				else if(sceneRight.x == camX && sceneRight.y == camY && sceneRight.z == camZ)
					return "right";
				else if(sceneLeft.x == camX && sceneLeft.y == camY && sceneLeft.z == camZ)
					return "left"
				break;
			case "bottom":
				if(sceneFront.x == camX && sceneFront.y == camY && sceneFront.z == camZ)
					return "down";
				else if(sceneBack.x == camX && sceneBack.y == camY && sceneBack.z == camZ)
					return "up";
				else if(sceneRight.x == camX && sceneRight.y == camY && sceneRight.z == camZ)
					return "right";
				else if(sceneLeft.x == camX && sceneLeft.y == camY && sceneLeft.z == camZ)
					return "left"
				break;
		}
	};

	this.setCameraOrtho = function(yes) {
		if(yes && camera.isPerspective)
			camera.toOrthographic();

		if(!yes && !camera.isPerspective)
			camera.toPerspective();
	};

	this.resetOrientation = function() {
		this.setCameraOrtho(this.originalHomeVector.isOrtho);
		this.sceneUpDirection.copy(this.originalHomeVector.worldUp);
		this.sceneFrontDirection.copy(this.originalHomeVector.worldFront);
		this.cubeFront.copy(this.sceneFrontDirection).cross(this.sceneUpDirection).normalize();
		this.setCameraUp(this.sceneUpDirection);
		changed(true);
	};

	this.setCurrentViewAsFront = function() {
		if(this.cube)
			this.cube.currentFace = "front";

		this.sceneUpDirection.copy(camera.up.clone());
		this.sceneFrontDirection.copy(this.getView()).normalize();
		this.cubeFront.copy(this.sceneFrontDirection).cross(this.sceneUpDirection).normalize();

		if(this.orthographicFaces)
			this.setCameraOrtho(true);

		changed(true);
	};

	this.setCurrentViewAsTop = function() {
		if(this.cube)
			this.cube.currentFace = "top";

		this.sceneUpDirection.copy(this.getView()).multiplyScalar(-1).normalize();
		this.sceneFrontDirection.copy(camera.up);
		this.cubeFront.copy(this.sceneFrontDirection).cross(this.sceneUpDirection).normalize();
		changed(true);
	};

	this.calculateCubeTransform = function(faceString) {
		var worldUp = this.sceneUpDirection.clone();
		var worldFront = this.sceneFrontDirection.clone();
		var worldRight = this.sceneFrontDirection.clone().cross(this.sceneUpDirection).normalize();

		camParamsInitial = camera.clone();
		camParamsInitial.center = cam.center.clone();
		camParamsInitial.pivot = cam.pivot.clone();

		camParamsFinal = camera.clone();
		camParamsFinal.center = cam.center.clone();
		camParamsFinal.pivot = cam.pivot.clone();

		// find movement offset based on given boolean flags
		var offset = new THREE.Vector3(0, 0, 0);
		if(faceString.contains('back')) {
			offset = offset.add(worldFront);
		}
		if(faceString.contains('front')) {
			offset = offset.sub(worldFront);
		}
		if(faceString.contains('top')) {
			offset = offset.add(worldUp);
		}
		if(faceString.contains('bottom')) {
			offset = offset.sub(worldUp);
		}
		if(faceString.contains('right')) {
			offset = offset.add(worldRight);
		}
		if(faceString.contains('left')) {
			offset = offset.sub(worldRight);
		}
		var upDir = worldUp;

		// view looking at top or bottom chosen
		var test = offset.clone().normalize();

		if((1.0 - Math.abs(test.dot(worldUp))) < Number.MIN_VALUE) {
			//( offset == worldUp || offset == -worldUp )
			// find the principal view direction other than top/bottom closest to
			// the current view direction and use it as an up vector

			var viewDir = this.getView().normalize();
			var optUpDir = [worldFront.clone(), worldFront.clone().negate(), worldRight.clone(), worldRight.clone().negate()];

			// use both view and up vectors for test vector because transitioning from
			// top and bottom views, view direction is the same (but up direction is different)

			var sign = (test.dot(worldUp) > 0.0) ? +1.0 : -1.0; //( offset == worldUp ) ? +1.0 : -1.0;
			var testDir = viewDir.clone().add(camera.up.clone().multiplyScalar(sign)).normalize();

			var optValue = -2.0;

			for(var i = 0; i < 4; i++) {
				var value = testDir.dot(optUpDir[i]);

				if(value > optValue) {
					optValue = value;
					upDir = optUpDir[i].multiplyScalar(sign);
				}
			}
		}

		distFinal = distInitial = this.getView().length();
		// WHY? camParamsFinal.center = this.originalCenter;
		camParamsFinal.position.copy(camParamsFinal.center.clone().add(offset.multiplyScalar(distFinal / offset.length())));
		camParamsFinal.up.copy(upDir);

		var D = camParamsInitial.center.clone().sub(camParamsInitial.position).normalize();
		var R = D.clone().cross(camParamsInitial.up).normalize();
		var U = R.clone().cross(D).normalize();
		var M = new THREE.Matrix3();
		M.set(D.x, U.x, R.x, D.y, U.y, R.y, D.z, U.z, R.z);
		rotInitial.setFromRotationMatrix3(M);

		D = camParamsFinal.center.clone().sub(camParamsFinal.position).normalize();
		R = D.clone().cross(camParamsFinal.up).normalize();
		U = R.clone().cross(D).normalize();
		M.set(D.x, U.x, R.x, D.y, U.y, R.y, D.z, U.z, R.z);
		//TODO: figure out when these angles aren't supposed to be 0, works for now
		rotTwist.setFromAxisAngle(D, 0.0);
		rotSpin.setFromAxisAngle(U, 0.0);
		rotFinal.setFromRotationMatrix3(M);
		rotFinal.multiply(rotTwist).multiply(rotSpin).normalize();

	};

	//used for center operation from steering wheel and steering wheel menu
	this.centerShot = function(fromWheelMenu) {
		//TODO: investigate the problem where it is not animating sometimes (due to lag)

		if(!camParamsInitial || fromWheelMenu) {
			cam.elapsedTime = 0;
			camParamsInitial = camParamsFinal = camera.clone();
			camParamsInitial.center = cam.center;
		}

		var pWorld = cam.pivot.clone();
		var P = pWorld.clone().sub(camParamsInitial.position);
		var D = (camParamsInitial.center.clone().sub(camParamsInitial.position)).normalize();
		var U = camParamsInitial.up.clone();
		var R = (D.clone().cross(U)).normalize();
		U = (R.clone().cross(D)).normalize();

		var PprojR = R.clone().multiplyScalar(R.dot(P));
		var PprojU = U.clone().multiplyScalar(U.dot(P));
		var PprojRU = PprojR.clone().add(PprojU);

		camParamsFinal.position.copy(camParamsInitial.position.clone().add(PprojRU));

		camParamsFinal.center = pWorld;
		camParamsFinal.pivot = pWorld;

		var unitTime = 0.0;
		if(cam.elapsedTime >= shotParams.duration) {
			unitTime = 1.0;
		} else {
			var tMax = shotParams.destinationPercent;
			unitTime = Math.easeClamp(cam.elapsedTime / shotParams.duration, 0.0, tMax);
			cam.elapsedTime += deltaTime / 2000;
		}

		var position = (camera.position.clone().multiplyScalar(1.0 - unitTime)).add(camParamsFinal.position.clone().multiplyScalar(unitTime));
		var center = (cam.center.clone().multiplyScalar(1.0 - unitTime)).add(camParamsFinal.center.clone().multiplyScalar(unitTime));
		var pivot = (cam.pivot.clone().multiplyScalar(1.0 - unitTime)).add(camParamsFinal.pivot.clone().multiplyScalar(unitTime));
		camera.position.copy(position);
		cam.center.copy(center);
		cam.pivot.copy(pivot);

		camera.lookAt(cam.center);
		changed(false);

		if(unitTime === 1.0)
			this.addHistoryElement();
		else
			requestAnimationFrame(function() {
				cam.centerShot(false);
			});
	};

	//This is for the level camera operation in steering wheel menu
	//Integrated from ViewManager::LevelCamera
	this.levelShot = function() {

		var view = this.getView();
		var dist = view.length();
		var worldUp = this.sceneUpDirection.clone();
		var vUp = camera.up.clone().normalize();
		var vView = view.normalize();
		var dotView = vView.dot(worldUp);

		if((1.0 - Math.abs(dotView)) > Number.MIN_VALUE) {
			var vRight = vView.clone().cross(worldUp);
			vView = worldUp.clone().cross(vRight);
			vView.normalize();
		} else {
			vView = vUp.clone();
		}
		vView.multiplyScalar(dist);

		var destination = {
			center: vView.add(camera.position),
			up: worldUp,
			position: camera.position,
			pivot: cam.center.clone().add(vView),
			fov: camera.fov,
			worldUp: worldUp
		};
		cam.elapsedTime = 0;
		cam.animateTransition(destination);
	};

	//This is for the fit to window operation in the steering wheel drop down menu
	//Integrated from CameraOperations::FitBoundingBoxToView
	//Right now since we only load one mesh we can use the bounding box property of it, if multiple meshes loaded
	//we will need to find the bounding box around them
	this.fitToWindow = function() {

		var viewDir = this.getView();
		var upDir = camera.up.clone();
		viewDir.normalize();
		upDir.normalize();
		camParamsFinal = camera.clone();
		camParamsFinal.center = cam.center;

		upDir = getUpDirection(upDir, viewDir);
		upDir.normalize();
		camParamsFinal.up.copy(upDir);

		var rightDir = viewDir.clone().cross(upDir);
		rightDir.normalize();

		var boxMin = boundingBoxMin.clone();
		var boxMax = boundingBoxMax.clone();
		var boxPoints = [boxMin, boxMax];
		var boxMidpoint = new THREE.Vector3(boxMax.x - boxMin.x, boxMax.y - boxMin.y, boxMax.z - boxMin.z);

		boxPoints[2] = new THREE.Vector3(boxMax.x, boxMin.y, boxMax.z);
		boxPoints[3] = new THREE.Vector3(boxMax.x, boxMin.y, boxMin.z);
		boxPoints[4] = new THREE.Vector3(boxMax.x, boxMax.y, boxMin.z);
		boxPoints[5] = new THREE.Vector3(boxMin.x, boxMax.y, boxMax.z);
		boxPoints[6] = new THREE.Vector3(boxMin.x, boxMax.y, boxMin.z);
		boxPoints[7] = new THREE.Vector3(boxMin.x, boxMin.y, boxMax.z);

		//Move the box into camParams frame coordinates
		for(var j = 0; j < 8; j++) {
			var testVector = boxPoints[j].clone().sub(camera.position);

			boxPoints[j].setX(testVector.clone().dot(rightDir));
			boxPoints[j].setY(testVector.clone().dot(upDir));
			boxPoints[j].setZ(testVector.clone().dot(viewDir));
		}

		//This is to be used when ortho camera is implemented
		/*
		var minPointH = boxPoints[0], maxPointH = boxPoints[0], minPointV = boxPoints[0],maxPointV = boxPoints[0];

		//Solve for the eye position in ortho.  We take the position as the center point
		//Of the 2D projection.
		for(var k=0; k<8; k++){
		    var testVertex = boxPoints[k];
		    if(testVertex.x < minPointH.x){
		        minPointH = testVertex;
		    }else if(testVertex.x > maxPointH.x){
		        maxPointH = testVertex;
		    }

		    if(testVertex.y < minPointV.y){
		        minPointV = testVertex;
		    }else if(testVertex.y > maxPointV.y){
		        maxPointV = testVertex;
		    }
		}

		var geomWidth = maxPointH.x - minPointH.x;
		var geomHeight = maxPointV.y - minPointV.y;

		//Set ortho width and height
		if (geomWidth/geomHeight > camera.aspect){
		    camParams.orthoWidth = geomWidth;
		    camParams.orthoHeight = geomWidth/viewAspect;
		}else{
		    camParams.orthoWidth = geomHeight * viewAspect;
		    camParams.orthoHeight = geomHeight;
		}
		var orthoOffset = new THREE.Vector3((minPointH.x + maxPointH.x)/2.0,(minPointV.y + maxPointV.y)/2.0,0.0);
		*/

		//Find the eye position in perspective.
		//While working in 2D, find the equation of the line passing through each box corner of form z = mx + b
		//that is parallel to the sides of the viewing frustum.  Note that all of the coordinates of the box
		//are still defined in the camParams frame.  Compare the z intercept values (ie. b) to figure out which two lines
		//represent the outer edges of the bounding box, and solve for their intersection to find the desired eye (x,z) position
		//that would be required to make the object touch the left and right edges of the viewport (ie. the closest we can get
		//without losing horizontal view of the object).  Repeat with z = my + b to find the eye (y,z) position for the vertical frustum.

		//TODO:fovTop and fovBottom are ALWAYS the same b/c of camera declaration, this needs to change
		var fovTop = THREE.Math.degToRad(camera.topFov);
		var fovBottom = THREE.Math.degToRad(camera.bottomFov);
		var fovLeft = THREE.Math.degToRad(camera.leftFov);
		var fovRight = THREE.Math.degToRad(camera.rightFov);

		var BLeft, BRight, BTop, BBottom;

		BLeft = (fovLeft >= 0) ? Number.MAX_VALUE : Number.MIN_VALUE;
		BRight = (fovRight >= 0) ? Number.MAX_VALUE : Number.MIN_VALUE;
		BTop = (fovTop >= 0) ? Number.MAX_VALUE : Number.MIN_VALUE;
		BBottom = (fovBottom >= 0) ? Number.MAX_VALUE : Number.MIN_VALUE;

		var slopeRight = 1.0 / Math.tan(fovRight);
		var slopeLeft = -1.0 / Math.tan(fovLeft);
		var slopeTop = 1.0 / Math.tan(fovTop);
		var slopeBottom = -1.0 / Math.tan(fovBottom);

		for(var i = 0; i < 8; i++) {
			var testCorner = boxPoints[i].clone();
			var b = testCorner.z - (slopeLeft * testCorner.x);
			BLeft = (fovLeft >= 0) ? Math.min(BLeft, b) : Math.max(BLeft, b);

			b = testCorner.z - (slopeRight * testCorner.x);
			BRight = (fovRight >= 0) ? Math.min(BRight, b) : Math.max(BRight, b);

			//For vertical frustum
			b = testCorner.z - (slopeTop * testCorner.y);
			BTop = (fovTop >= 0) ? Math.min(BTop, b) : Math.max(BTop, b);

			b = testCorner.z - (slopeBottom * testCorner.y);
			BBottom = (fovBottom >= 0) ? Math.min(BBottom, b) : Math.max(BBottom, b);
		}

		//Solve for intersection of horizontal frustum
		var eyeX = (BRight - BLeft) / (slopeLeft - slopeRight);
		var eyeZH = (slopeLeft * eyeX) + BLeft;

		//Solve for intersection of vertical frustum
		var eyeY = (BBottom - BTop) / (slopeTop - slopeBottom);
		var eyeZV = slopeTop * eyeY + BTop;

		var eyeZ = 0.0;

		//With the two frustums solved, compare the two frustums to see which one is currently closer to the object based on z value.
		//Slide the closer frustum back along its median line (to ensure that the points stay within the frustum) until it's Z value
		//matches that of the further frustum. Take this as the final eye position.

		if(eyeZH <= eyeZV) {
			var medianAngleV = (fovTop - fovBottom) / 2.0;
			if(Math.abs(medianAngleV) > Number.MIN_VALUE) {
				var medianSlopeV = 1.0 / Math.tan(medianAngleV);
				eyeY = eyeY - eyeZV / medianSlopeV + eyeZH / medianSlopeV; //derived from z1 - my1 = z2 - my2
			}
			eyeZ = eyeZH;
		} else {
			var medianAngleH = (fovRight - fovLeft) / 2.0;
			if(Math.abs(medianAngleH) > Number.MIN_VALUE) {
				var medianSlopeH = 1.0 / Math.tan(medianAngleH);
				eyeX = eyeX - eyeZH / medianSlopeH + eyeZV / medianSlopeH;
			}
			eyeZ = eyeZV;
		}

		var eyeOffset = new THREE.Vector3(eyeX, eyeY, eyeZ);

		//Transform eyeoffset back into world frame
		var interim1 = (rightDir.clone().multiplyScalar(eyeOffset.x));
		var interim2 = (upDir.clone().multiplyScalar(eyeOffset.y));
		var interim3 = (viewDir.clone().multiplyScalar(eyeOffset.z));
		eyeOffset = interim1.clone().add(interim2.clone().add(interim3));

		camParamsFinal.position.add(eyeOffset);
		var interim = (boxMidpoint.clone().sub(camParamsFinal.position)).dot(viewDir);
		camParamsFinal.center = camParamsFinal.position.clone().add(viewDir.multiplyScalar(interim));
		camParamsFinal.pivot = boxMidpoint.clone();

		var destination = {
			center: camParamsFinal.center,
			up: camParamsFinal.up,
			position: camParamsFinal.position,
			pivot: camParamsFinal.pivot,
			fov: camera.fov,
			worldUp: cam.sceneUpDirection.clone()
		};
		cam.elapsedTime = 0;
		cam.animateTransition(destination);
	};

	/*         Functions for operation         */

	//used in fit to window
	function getUpDirection(upDir, viewDir) {
		var upp = upDir.clone();

		if((Math.abs(upp.clone().dot(viewDir))) < Number.MIN_VALUE) {
			upp.normalize();
			return upp;
		}

		upp = getProjectionOnPlane(upDir, viewDir);
		if(upp.length() < Number.MIN_VALUE) {
			upp = getEmpiricalUpDirection(viewDir);
		}
		upp.normalize();
		return upp;
	}

	//used in getUpDirection
	function getProjectionOnPlane(vector, normal) {
		normal.normalize();
		var projToNormal = vector.clone().dot(normal);
		var projection = normal.clone().multiplyScalar(projToNormal);
		projection = vector.clone().sub(projection);
		return projection;
	}

	//used in getUpDirection
	function getEmpiricalUpDirection(normal) {
		var zeros = new THREE.Vector3(0, 0, 0);
		var directions = [new THREE.Vector3(0, 1, 0),
			new THREE.Vector3(1, 0, 0),
			new THREE.Vector3(0, 0, 1),
			new THREE.Vector3(0, 1, 1),
			new THREE.Vector3(1, 0, 1),
			new THREE.Vector3(1, 1, 0),
			new THREE.Vector3(1, 1, 1)
		];

		for(var i = 0; i < 7; i++) {
			if(Math.abs(directions[i].dot(normal)) < Number.MIN_VALUE) {
				zeros = directions[i];
				break;
			}
		}
		return zeros;
	}

	//convert screen coords to window coords
	function convertCoordsToWindow(pixelX, pixelY) {
		var delta = new THREE.Vector2(0, 0);

		delta.x = pixelX / window.innerWidth;
		delta.y = pixelY / window.innerHeight;

		return delta;
	}

	//picking ray intersection with the empty scene(not on object)
	function getScreenRay(mouse) {
		mouse.y = Math.abs(mouse.y - window.innerHeight);
		var rayOrigin, rayDirection;
		var eye = camera.position;
		var center = cam.center;
		var eyeToCenter = center.clone().sub(eye);
		var up = camera.up;
		var right = eyeToCenter.clone().cross(up);
		var dist = eyeToCenter.clone().length();

		var frustumLeft = dist * Math.tan(THREE.Math.degToRad(camera.leftFov));
		var frustumRight = dist * Math.tan(THREE.Math.degToRad(camera.rightFov));
		var frustumTop = dist * Math.tan(THREE.Math.degToRad(camera.topFov));
		var frustumBottom = dist * Math.tan(THREE.Math.degToRad(camera.bottomFov));
		var frustumWidth = (frustumLeft + frustumRight);
		var frustumHeight = (frustumTop + frustumBottom);

		var rightLength = mouse.x * frustumWidth / window.innerWidth;
		var centerToRightLength = rightLength - frustumLeft;

		var upLength = mouse.y * frustumHeight / window.innerHeight;
		var centerToUpLength = upLength - frustumBottom;

		up = up.clone().normalize().clone().multiplyScalar(centerToUpLength);
		right = right.clone().normalize().clone().multiplyScalar(centerToRightLength);

		/*
		// PRH -- account for difference in aspect ratio between camera FOV and viewport --
		AutoCam::AdjustForAspectRatio( params, screenWidth, screenHeight, mouseXunit, mouseYunit );
		*/

		if(cam.ortho) {
			rayOrigin = eye.clone().add(right).clone().add(up);
			rayDirection = eyeToCenter;
		} else {
			rayOrigin = eye;
			rayDirection = eyeToCenter.clone().add(up).clone().add(right);
		}

		return {
			'rayO': rayOrigin,
			'rayD': rayDirection
		};
	}

	//get ray intersection point and set pivot
	this.updatePivotPosition = function(mouse) {
		//TODO: update pivot only when mouse down

		var raycaster;
		var intersects;
		//formula from online
		var direction = new THREE.Vector3((mouse.x / window.innerWidth) * 2 - 1, -(mouse.y / window.innerHeight) * 2 + 1, 0.5);

		direction = direction.unproject(camera);
		raycaster = new THREE.Raycaster(camera.position, direction.sub(camera.position).normalize());
		intersects = raycaster.intersectObjects(objects);

		if(cam.mode == 'zoom') {
			if(intersects[0] !== undefined) {
				var point = intersects[0].point;
				cam.pivot.copy(point);
			} else {
				var result = getScreenRay(mouse);
				cam.pivot.copy(result.rayO.clone().add(result.rayD));
			}

		} else if(intersects[0] !== undefined) {
			wheel.cursorImage('pivot');
			var point = intersects[0].point;
			if(!cam.isMouseDown) {
				cam.pivot.copy(point);
			}
		} else {
			wheel.cursorImage('SWInvalidArea');
		}
	};

	function getNextRotation(rotationType, snapAngle, lastDelta) {
		var threshold, accelerationA, accelerationB, shiftZone;
		threshold = accelerationA = accelerationB = shiftZone = 0.0;

		var next = 0.0;
		var lockedAxis = null;
		var lockDelta = null;

		var deadZone = cam.snapOrbitDeadZone;
		var orbitMultiplier = cam.orbitMultiplier;

		if(rotationType == 'h') {
			threshold = cam.snapOrbitThresholdH;
			accelerationA = cam.snapOrbitAccelerationAX;
			accelerationB = cam.snapOrbitAccelerationBX;
			shiftZone = 1.0 - cam.snapOrbitAccelerationPointX;
			lockDelta = cam.lockDeltaX;
			lockedAxis = cam.lockedX;
		} else {
			threshold = cam.snapOrbitThresholdV;
			accelerationA = cam.snapOrbitAccelerationAY;
			accelerationB = cam.snapOrbitAccelerationBY;
			shiftZone = 1.0 - cam.snapOrbitAccelerationPointY;
			lockDelta = cam.lockDeltaY;
			lockedAxis = cam.lockedY;
		}

		if(!lockedAxis) {
			if(Math.abs(snapAngle) > threshold) {
				next = lastDelta * orbitMultiplier;
			} else if(Math.abs(snapAngle) > shiftZone * threshold) {
				if(lastDelta * snapAngle > 0.0) {
					next = lastDelta * orbitMultiplier * accelerationA;
				} else {
					next = lastDelta * orbitMultiplier * 1.0 / accelerationA;
				}

			} else {
				if(lastDelta * snapAngle > 0.0) {
					next = lastDelta * orbitMultiplier * accelerationB;
				} else {
					next = lastDelta * orbitMultiplier * 1.0 / accelerationB;
				}

			}

			if(next * snapAngle > 0.0 && Math.abs(next) > Math.abs(snapAngle)) {
				this.lockDeltaX = this.lockDeltaY = 0.0; //want to reset both regardless of rotation axis
				lockedAxis = true;
				next = snapAngle;
			}

		} else {
			lockDelta += lastDelta;

			if(lockDelta < -deadZone) {
				next = (lockDelta + deadZone) * orbitMultiplier * 1.0 / accelerationB;
				lockedAxis = false;
			} else if(lockDelta > deadZone) {
				next = (lockDelta - deadZone) * orbitMultiplier * 1.0 / accelerationB;
				lockedAxis = false;
			}
		}
		return next;
	}

	function getClosestAlignDir(Dv, searchPrincipal) {
		var maxAngle = -Number.MAX_VALUE;
		var maxIndex = 0;

		for(var i = 0; i < (searchPrincipal ? 6 : 26); i++) {
			var Di = cam.alignDirTable[i].clone().multiplyScalar(-1);
			Di.normalize();

			var angle = Di.dot(Dv);

			if(angle > maxAngle) {
				maxAngle = angle;
				maxIndex = i;
			}
		}
		return cam.alignDirTable[maxIndex];
	}

	function snapToClosestView(up, snapAngleh, snapAnglev) {
		if(!cam.useSnap)
			return;

		if(cam.preserveOrbitUpDirection) {
			// Find closest view direction
			var lastViewDir = (cam.saveCenter.clone().sub(cam.saveEye)).clone().normalize();
			var snapDir = (getClosestAlignDir(lastViewDir, false)).clone().multiplyScalar(-1).clone().normalize();

			if(Math.abs(Math.abs(lastViewDir.clone().dot(up)) - 1.0) < Number.MIN_VALUE) {
				//topdown or bottom up case
				snapAnglev = 0.0;
				var snapUp = (getClosestAlignDir(cam.saveUp, true)).clone().multiplyScalar(-1).clone().normalize();
				snapAngleh = cam.saveUp.findAngleWith(snapUp, up);
			} else {
				var lastViewDirProj = lastViewDir.clone().sub(up).multiplyScalar(up.clone().dot(lastViewDir));
				var snapDirProj = snapDir.clone().sub(up).multiplyScalar(up.clone().dot(snapDir));
				snapAngleh = lastViewDirProj.clone().findAngleWith(snapDirProj, up);
				var testRotate = new THREE.Quaternion().setFromAxisAngle(up, snapAngleh);
				var transitionDir = testRotate.clone().rotate(lastViewDir);
				var transitionRight = testRotate.clone().rotate(lastViewDir.clone().cross(cam.saveUp));
				snapAnglev = transitionDir.clone().findAngleWith(snapDir, transitionRight);
			}

			if(snapDir != cam.lastSnapDir) {
				//If last and current snapDirs are not on the same plane, unlock vertical orbit
				if(Math.abs(snapDir.clone().dot(up) - cam.lastSnapDir.clone().dot(up)) > Number.MIN_VALUE) {
					cam.lockedY = false;
				}
				cam.lastSnapDir = snapDir;
			}
		} else {
			//Find closest view direction
			/*  var vDirView = cam.saveCenter.clone().sub(cam.saveEye);
			var vRight = vDirView.clone().cross( cam.saveUp );
			var snapDir = -getClosestAlignDir(vDirView, false).clone().normalize();
			var snapDirProj = snapDir.clone.sub(up.clone().multiplyScalar(up.clone().dot(snapDir)));
			snapAngleh = vDirView.findAngleWith(snapDirProj, up);

			var testRotate = new THREE.Quaternion().setFromAxisAngle(up,snapAngleh );
			var transitionDir = testRotate.clone().rotate(vDirView);
			var transitionRight = testRotate.clone().rotate(vRight);
			snapAnglev = transitionDir.findAngleWith(snapDir, transitionRight);

			if(snapDir != cam.lastSnapDir) {
			    cam.cam.lockedY = false;
			    cam.lockedX = false;
			    cam.lastSnapDir = snapDir;
			}*/
		}
	}

	/// Returns true if the operation belongs to a chain of combined operations; otherwise returns false.
	function IsCombined() {
		return cam.combined;
	}

	function isInDeadZone(currentCursor, startCursor) {

		var deadZone = 30;
		var res = false;

		var w = window.innerWidth;
		var x = currentCursor.x % w;

		var h = window.innerHeight;
		var y = currentCursor.y % h;

		var diffX = (x > 0) ? (x - startCursor.x) : (w + x - startCursor.x);
		var diffY = (y > 0) ? (y - startCursor.y) : (h + y - startCursor.y);

		if((Math.abs(diffX) < deadZone) && (Math.abs(diffY) < deadZone))
			res = true;

		return res;
	}

	function GetXYAndWrapCounts(currentCursor, startCursor, wrapCount) {
		wrapCount.x = (currentCursor.x - startCursor.x) / window.innerWidth;
		currentCursor.x = startCursor.x + (currentCursor.x - startCursor.x) % window.innerWidth;

		wrapCount.y = (currentCursor.y - startCursor.y) / window.innerHeight;
		currentCursor.y = startCursor.y + (currentCursor.y - startCursor.y) % window.innerHeight;
	}

	function setBias(set, currentCursor, startCursor) {
		if(m_bias && set) {
			return;

		} else if(set) {
			var deadZone = 30;
			var wrapCount = new THREE.Vector2();

			var x = currentCursor.x;
			var y = currentCursor.y;

			GetXYAndWrapCounts(currentCursor, startCursor, wrapCount);

			m_resetBiasX = window.innerWidth * wrapCount.x;
			m_resetBiasY = window.innerHeight * wrapCount.y;

			if(x < startCursor.x)
				x = x - 2 * deadZone;
			else
				x = x + 2 * deadZone;

			if(y < startCursor.y)
				y = y - 2 * deadZone;
			else
				y = y + 2 * deadZone;
		}
		m_bias = set;
	}

	function checkBoundaryConditions(amount, cursorOffset, m_amount) {
		if(cursorOffset === 0)
			return 0;

		var deltaAmount = amount;
		var eye = cam.saveEye.clone().sub(worldUp.clone().multiplyScalar(m_amount + deltaAmount));
		var prevEye = cam.saveEye.clone().sub(worldUp.clone().multiplyScalar(m_amount));

		var eyeHeight = 0.0;
		var epsilon = (cam.maxSceneBound - cam.minSceneBound) / 1000;

		//zvp.logger.log(m_amount);
		//zvp.logger.log(deltaAmount);

		if(cam.topLimit && (cursorOffset > 0)) {
			// Cursor was on the top of the slider, but now is moving down.
			// Bring eyeHeight below maxSceneBound.
			eyeHeight = cam.maxSceneBound - epsilon;
			cam.topLimit = false;
		} else if(cam.bottomLimit && (cursorOffset < 0)) {
			// Cursor was on the bottom of the slider, but now is moving up.
			// Bring eyeHeight above minSceneBound.
			eyeHeight = cam.minSceneBound + epsilon;
			cam.bottomLimit = false;
		} else {
			eyeHeight = eye.dot(worldUp);
		}

		var prevEyeHeight = prevEye.dot(worldUp);

		//zvp.logger.log(eyeHeight);

		if(eyeHeight < cam.minSceneBound) {
			if(prevEyeHeight < cam.minSceneBound) {
				// this limits how far under the min we can go
				cam.bottomLimit = true;
				deltaAmount = 0.0;
			}
		} else if(eyeHeight > cam.maxSceneBound) {
			if(prevEyeHeight > cam.maxSceneBound) {
				// This limits how far over the max we can go
				cam.topLimit = true;
				deltaAmount = 0.0;
			}
		}

		return deltaAmount;
	}

	function getMoveAmountFromCursorOffset(offset) {
		// Manipulating with power of 2 of cursor offset allows to amplify the visible change in the offset
		// when the offset is big to achieve the effect ofhigher sensitivity of the tool on small offsets
		// and lower sensitivity on big offsets.
		var derivedOffset = Math.pow(offset, 2.0);
		if(offset < 0) {
			derivedOffset = -derivedOffset;
		}

		//delta.y = derivedOffset;
		var delta = convertCoordsToWindow(0, derivedOffset);
		var sceneHeight = cam.maxSceneBound - cam.minSceneBound;

		// This empirical step provides a good motion of the scene when moving up/down.
		var p = sceneHeight * 0.01;
		delta.y *= p;

		var deltaAmount = cam.userHeightSpeed * delta.y;
		deltaAmount = checkBoundaryConditions(deltaAmount, offset, cam.m_amount);

		return deltaAmount;
	}

	//draw UI for up-down operation during mouse move
	this.onDrawHeight = function(mouse, pX, pY, dragged, path) {
		var sliderHeight = 86;
		var upDir = new THREE.Vector3(0, 1, 0);
		var h = camera.position.clone().dot(upDir);
		var unitHeight = Math.linearClamp(h, cam.minSceneBound, cam.maxSceneBound);
		var height = unitHeight - 0.5;
		if(cubeContainer) {
			cubeContainer.find("img#updownImageA").remove();
			cubeContainer.prepend('<img src="' + path + 'SWheighthandleA.png" id="updownImageA" style="position:fixed; z-index:9999; top:' + (pY - sliderHeight * height) + 'px; left:' + pX + 'px;"/>');

			if(!dragged) {
				cubeContainer.prepend('<img src="' + path + 'SWheighthandleI.png" id="updownImageI" style="position:fixed; z-index:9998; top:' + (pY - sliderHeight * height) + 'px; left:' + (pX) + 'px;"/>');
			}
		}
	};

	/**
	 * Draws a menu by appending an unordered list to the given container element.
	 * @param {Array} menuOptions - string array of menu options, null meaning seperator
	 * @param {Array} menuEnables - boolean array of menu enable flags indicating which corresponding menu entry in menuOptions should be enabled or disabled.
	 * @param {Number} mousex - the x coordinate of the menu trigger point, used to position menu
	 * @param {Number} mousey - the y coordinate of the menu trigger point, used to position menu
	 * @param {HTMLElement} container - the container element to add the menu to.
	 * @param {Object} position - object with x, y, w, h of the container element.
	 */
	this.drawDropdownMenu = function(menuOptions, menuEnables, menuCallbacks, mousex, mousey, container, position) {
		var itemID = 0;

		if(!dropDownMenu) {

			dropDownMenu = document.createElement('div');
			dropDownMenu.className = 'dropDownMenu';

			// Initialize the top and left with some approximate values
			// so that the correct width can be returned by gerBoudningClientRect().
			dropDownMenu.style.top = '100px';
			dropDownMenu.style.left = '-400px';

			var menuHeight = 0;
			var menuMinWidth = 0;
			for(var i = 0; i < menuOptions.length; i++) {
				var listItem;
				if(menuOptions[i] === null) { // menu separator
					listItem = document.createElement("li");
					listItem.style.height = '1px';
					menuHeight += 1;
					listItem.style.backgroundColor = "#E0E0E0";
				} else {
					var content = ZhiUTech.Viewing.i18n.translate(menuOptions[i]);
					menuMinWidth = content.length > menuMinWidth ? content.length : menuMinWidth;

					if(menuCallbacks[i]) {
						listItem = document.createElement("div");
						var check = document.createElement("input");
						var text = document.createElement("label");
						check.type = "radio";
						check.className = "dropDownMenuCheck";
						text.innerHTML = content;
						text.className = "dropDownMenuCheckText";
						listItem.appendChild(check);
						listItem.appendChild(text);
						listItem.className = "dropDownMenuCheckbox";
					} else {
						listItem = document.createElement("li");
						listItem.textContent = content;
						listItem.className = menuEnables[i] ? "dropDownMenuItem" : "dropDownMenuItemDisabled";
					}

					listItem.id = "menuItem" + itemID;
					itemID++;
					menuHeight += 25; // HACK!!!

					listItem.setAttribute("data-i18n", menuOptions[i]);
				}
				dropDownMenu.appendChild(listItem);
			}

			// Add the menu to the DOM before asking for boundingClientRect.
			// Otherwise, it will be zero.
			container.appendChild(dropDownMenu);

			dropDownMenu.style.minWidth = Math.max(256, menuMinWidth * 7.4) + 'px'; // approximate min width
			var menuWidth = dropDownMenu.getBoundingClientRect().width;

			this.menuSize.x = menuWidth;
			this.menuSize.y = menuHeight;
		} else {
			// Just add the drop down menu, It already exists.
			container.appendChild(dropDownMenu);
		}
		itemID = 0;
		for(var i = 0; i < menuOptions.length; i++) {
			if(menuOptions[i] === null)
				continue;

			if(menuCallbacks[i]) {
				var id = "menuItem" + itemID;
				var element = document.getElementById(id);
				if(element) {
					element.children[0].checked = menuCallbacks[i]();
				}
			}
			itemID++;
		}
		var top = mousey - 15; // 15 offset so list appears @ button
		var left = mousex + 1;

		var rect = this.canvas.getBoundingClientRect();

		if((left + this.menuSize.x) > rect.right)
			left = mousex - this.menuSize.x - 1;
		if((top + this.menuSize.y) > rect.bottom)
			top = rect.bottom - this.menuSize.y;

		// Make relative to container:
		top -= position.y;
		left -= position.x;

		dropDownMenu.style.top = top + 'px';
		dropDownMenu.style.left = left + 'px';

		this.menuOrigin.x = left;
		this.menuOrigin.y = top;
	};

	this.removeDropdownMenu = function(container) {
		container.removeChild(dropDownMenu);
	};

	function isAxisAligned(vec) {
		var sceneRight = cam.sceneFrontDirection.clone().cross(cam.sceneUpDirection);
		var checkUp = Math.abs(Math.abs(vec.dot(cam.sceneUpDirection)) - 1.0);
		var checkFront = Math.abs(Math.abs(vec.dot(cam.sceneFrontDirection)) - 1.0);
		var checkRight = Math.abs(Math.abs(vec.dot(sceneRight)) - 1.0);

		return(checkUp < 0.00001 || checkFront < 0.00001 || checkRight < 0.00001);
	}

	this.isFaceView = function() {
		var dir = this.center.clone().sub(camera.position).normalize();
		return isAxisAligned(dir) && isAxisAligned(camera.up);
	};

	this.startInteraction = function(x, y) {
		this.startCursor = new THREE.Vector2(x, y);

		this.startState = {
			saveCenter: this.center.clone(),
			saveEye: this.camera.position.clone(),
			savePivot: this.pivot.clone(),
			saveUp: this.camera.up.clone()
		};

		this.lockDeltaX = 0.0;
		this.lockedX = false;
		this.lastSnapRotateX = 0.0;
		this.lockDeltaY = 0.0;
		this.lockedY = false;
		this.lastSnapRotateY = 0.0;
		this.lastSnapDir = new THREE.Vector3(0, 0, 0);

		this.navApi.setTransitionActive(true);
	};

	this.orbit = function(currentCursor, startCursor, distance, startState) {
		if(!this.navApi.isActionEnabled('orbit') || this.currentlyAnimating === true)
			return;

		var mode = 'wheel';

		// If orthofaces is enabled, and camera is ortho
		// then switch to perspective
		if(cam.orthographicFaces && !camera.isPerspective) {
			camera.toPerspective();

			// Hack: update the start state with the new position:
			if(startState)
				startState.saveEye.copy(this.camera.position);
		}
		if(startState) {
			mode = 'cube';
		}
		if(mode == 'cube') {
			this.saveCenter.copy(startState.saveCenter);
			this.saveEye.copy(startState.saveEye);
			this.savePivot.copy(startState.savePivot);
			this.saveUp.copy(startState.saveUp);
			this.useSnap = true;
			this.doCustomOrbit = true;
		} else {
			this.saveCenter.copy(this.center);
			this.savePivot.copy(this.pivot);
			this.saveEye.copy(camera.position);
			this.saveUp.copy(camera.up);
			this.useSnap = false;
			this.doCustomOrbit = false;
		}

		if(IsCombined() && prevCenter == undefined) {
			prevCenter = this.saveCenter.clone();
			prevEye = this.saveEye.clone();
			prevPivot = this.savePivot.clone();
			prevUp = this.saveUp.clone();
		}

		// TODO: fold the two cases into one and prevent duplicate code
		if(this.preserveOrbitUpDirection) {

			var delta = convertCoordsToWindow(currentCursor.x - startCursor.x, currentCursor.y - startCursor.y);
			var lastDelta = convertCoordsToWindow(distance.x, distance.y);

			var worldUp = this.sceneUpDirection.clone();
			var worldFront = this.sceneFrontDirection.clone();
			var worldRight = this.sceneFrontDirection.clone().cross(this.sceneUpDirection).normalize();

			/* ????? WTF:
			var worldFront = new THREE.Vector3(1,0,0);
			var worldUp = new THREE.Vector3(0,1,0);
			*/

			//viewcube
			// if (this.doCustomOrbit ) {
			//     worldUp = new THREE.Vector3(0,1,0);
			//     worldFront = new THREE.Vector3(1,0,0);
			// }

			/* ?????? WTF:
			var worldR = worldFront.clone().cross( worldUp );
			worldUp = worldR.clone().cross(worldFront);
			worldUp.clone().normalize();
			*/

			var pivot = IsCombined() ? prevPivot : this.savePivot;
			var eye = IsCombined() ? prevEye : this.saveEye;
			var center = IsCombined() ? prevCenter : this.saveCenter;
			var camUp = IsCombined() ? prevUp : this.saveUp;

			var initViewDir = pivot.clone().sub(eye).normalize();
			var initViewDirV = center.clone().sub(eye).normalize();
			var initRightDir = initViewDirV.clone().cross(camUp);

			var fTargetDist = eye.clone().sub(pivot).length();
			var fTargetDistV = eye.clone().sub(center).length();

			var vLookUpdate = initViewDir.clone().multiplyScalar(-1);
			var vLookUpdateV = initViewDirV.clone().multiplyScalar(-1);
			var vRightUpdate = initRightDir;
			var vUpUpdate = camUp.clone();

			var snapAngleh = 0.0;
			var snapAnglev = 0.0;

			//viewcube

			// DOESN'T DO ANYTHING: snapToClosestView(worldUp, snapAngleh, snapAnglev);

			if(!this.constrainOrbitHorizontal) {
				// Need to check if:
				//  1. camera is "upside-down" (angle between world up and camera up is obtuse) or
				//  2. camera is in top view (camera up perpendicular to world up and view angle acute to world up)
				// These cases required a reversed rotation direction to maintain consistent mapping of tool:
				//  left->clockwise, right->counter-clockwise
				//
				//  PHB June 2014 - #2 above makes no sense to me. If the camera up is perpendicular to the
				//  world up then the view is parallel to world up (view dot up == 1). So the second test is
				//  meaningless. There is no good way to determine the rotation direction in this case. If you
				//  want it to feel like direct manipulation then it would be better to determine if the cursor
				//  is above or below the pivot in screen space.

				var worldUpDotCamUp = worldUp.dot(this.saveUp);
				// var worldUpDotView  = worldUp.dot(this.saveCenter.clone().sub(this.saveEye).normalize());

				// if ((worldUpDotCamUp < -Number.MIN_VALUE) ||
				//     ((Math.abs(worldUpDotCamUp) < Number.MIN_VALUE) && (worldUpDotView > 0.0)))
				//
				var kFlipTolerance = 0.009; // Must be flipped by more than about 0.5 degrees
				if(worldUpDotCamUp < -kFlipTolerance) {
					delta.x = -delta.x;
					lastDelta.x = -lastDelta.x;
				}

				var dHorzAngle = 0.0;
				if(IsCombined()) {
					dHorzAngle = lastDelta.x * this.orbitMultiplier;
				} else {
					dHorzAngle = this.useSnap ? this.lastSnapRotateX + getNextRotation('h', snapAngleh, -lastDelta.x) :
						delta.x * this.orbitMultiplier;
				}

				this.lastSnapRotateX = dHorzAngle;
				// Define rotation transformation

				var quatH = new THREE.Quaternion().setFromAxisAngle(worldUp, -dHorzAngle);

				vLookUpdate.applyQuaternion(quatH);
				vLookUpdateV.applyQuaternion(quatH);
				vRightUpdate.applyQuaternion(quatH);
				vUpUpdate.applyQuaternion(quatH);
			}

			if(!this.constrainOrbitVertical) {
				var vRightProjF = worldFront.clone().multiplyScalar(worldFront.dot(vRightUpdate));
				var vRightProjR = worldRight.clone().multiplyScalar(worldRight.dot(vRightUpdate));
				var vRightProj = vRightProjF.clone().add(vRightProjR);
				vRightProj.clone().normalize();

				var dVertAngle = 0.0;

				if(IsCombined()) {
					dVertAngle = lastDelta.y * this.orbitMultiplier;
				} else {
					var next = getNextRotation('v', snapAnglev, lastDelta.y);
					dVertAngle = this.useSnap ? this.lastSnapRotateY + next : delta.y * this.orbitMultiplier;
				}
				var quatV = new THREE.Quaternion().setFromAxisAngle(vRightProj, -dVertAngle);

				if(!this.navApi.getOrbitPastWorldPoles()) {

					var vUpUpdateTemp = vUpUpdate.clone();
					vUpUpdateTemp.applyQuaternion(quatV).normalize();

					// Check if we've gone over the north or south poles:
					var wDotC = worldUp.dot(vUpUpdateTemp);
					if(wDotC < 0.0) {
						var vLookUpdateVtemp = vLookUpdateV.clone();
						vLookUpdateVtemp.applyQuaternion(quatV).normalize();

						// How far past Up are we?
						var dVertAngle2 = vLookUpdateVtemp.angleTo(worldUp);
						if(Math.abs(dVertAngle2) > (Math.PI * 0.5))
							dVertAngle2 -= (dVertAngle2 > 0.0) ? Math.PI : -Math.PI;

						dVertAngle -= dVertAngle2;

						quatV.setFromAxisAngle(vRightProj, -dVertAngle);
						vLookUpdate.applyQuaternion(quatV).normalize();
						vLookUpdateV.applyQuaternion(quatV).normalize();
						vUpUpdate.applyQuaternion(quatV).normalize();

					} else {
						vLookUpdate.applyQuaternion(quatV).normalize();
						vLookUpdateV.applyQuaternion(quatV).normalize();
						vUpUpdate.applyQuaternion(quatV).normalize();
					}
				} else {
					vLookUpdate.applyQuaternion(quatV).normalize();
					vLookUpdateV.applyQuaternion(quatV).normalize();
					vUpUpdate.applyQuaternion(quatV).normalize();
				}
				this.lastSnapRotateY = dVertAngle;
			}

			// figure out new eye point
			var vNewEye = vLookUpdate.multiplyScalar(fTargetDist).add(pivot);

			camera.position.copy(vNewEye);
			camera.up.copy(vUpUpdate);
			this.center.copy(vNewEye);
			this.center.sub(vLookUpdateV.multiplyScalar(fTargetDistV));

			if(IsCombined()) {
				prevCenter.copy(this.center);
				prevEye.copy(camera.position);
				prevPivot.copy(this.pivot);
				prevUp.copy(camera.up);
			}
		} else {
			/*var lastDelta = convertCoordsToWindow(distance.x, distance.y);
			var vDir = prevPivot.clone().sub(prevEye);
			var vDirView = prevCenter.clone().sub(prevEye);
			var vRight = vDirView.clone().cross(prevUp);
			var vUp = vRight.clone().cross(vDirView);
			vUp.clone().normalize();

			var dist = (prevPivot.clone().sub(prevEye)).clone().length();
			var distView = (prevCenter.clone().sub(prevEye)).clone().length();

			var snapAngleh = 0.0;
			var snapAnglev = 0.0;

			//viewcube
			//snapToClosestView(vUp, snapAngleh, snapAnglev);

			if ( !this.constrainOrbitHorizontal ){

			var dHorzAngle = this.useSnap ? getNextRotation(HORIZONTAL, snapAngleh, lastDelta.x):
			lastDelta.x *this.orbitMultiplier;

			var quatH = new THREE.Quaternion().setFromAxisAngle( vUp.clone().normalize(), dHorzAngle );
			vDir = quatH.clone().rotate(vDir);
			vDirView = quatH.clone().rotate(vDirView);
			}

			if ( !this.constrainOrbitVertical ){
			var dVertAngle = this.useSnap ? getNextRotation(VERTICAL, snapAnglev, lastDelta.y) :
			lastDelta.y *this.orbitMultiplier;

			var quatV = new THREE.Quaternion().setFromAxisAngle( vRight.clone().normalize(), dVertAngle );
			vDir = quatV.clone().rotate(vDir);
			vDirView = quatV.clone().rotate(vDirView);
			vUp = quatV.clone().rotate(vUp);
			}

			camera.eye = this.pivot.clone().sub((vDir.clone().normalize()).clone().multiplyScalar(dist));
			this.center.copy(camera.eye.clone().add((vDirView.clone().normalize()).clone().multiplyScalar(distView)));
			camera.up.copy(vUp.clone().normalize());

			prevCenter = this.center;
			prevEye = camera.position;
			prevPivot = this.pivot;
			prevUp = camera.up;*/
		}
		camera.lookAt(this.center);
		changed(false);

		/*zvp.logger.log("Camera Position: ( "+camera.position.x +", "+camera.position.y+", "+camera.position.z+" )");
		zvp.logger.log("Up Vector: ( "+camera.up.x +", "+camera.up.y+", "+camera.up.z+" )");
		zvp.logger.log("Center: ( "+this.center.x +", "+this.center.y+", "+this.center.z+" )");
		*/
	};

	this.endInteraction = function() {

		this.navApi.setTransitionActive(false);
	};

	this.look = function(distance) {
		if(!this.navApi.isActionEnabled('walk'))
			return;

		var delta = convertCoordsToWindow(distance.x, distance.y);
		var multiplier = this.userLookSpeed;

		//if ( m_manager->GetApplicationParameters().lookInvertVerticalAxis ) { deltaY = -deltaY; }

		var eyeToCenter = this.getView();

		var camUp = camera.up;
		var camRight = eyeToCenter.clone().cross(camUp).normalize();
		var worldUp = this.sceneUpDirection.clone();

		// TODO: scale look by camera's FOV
		// vertical rotation around the camera right vector
		var angle = delta.clone();
		angle.x *= Math.PI;
		angle.y *= Math.PI / camera.aspect;
		angle.multiplyScalar(multiplier);
		var qRotY = new THREE.Quaternion().setFromAxisAngle(camRight, -angle.y);

		if(camera.keepSceneUpright && !this.navApi.getOrbitPastWorldPoles()) {
			var futureUp = camUp.clone();
			futureUp.applyQuaternion(qRotY).normalize();

			if(futureUp.dot(worldUp) < 0) {
				var futureEyeToCenter = eyeToCenter.clone();
				futureEyeToCenter.applyQuaternion(qRotY);

				var deltaAngle = futureEyeToCenter.angleTo(worldUp);

				if(Math.abs(deltaAngle) > (Math.PI * 0.5))
					deltaAngle -= (deltaAngle > 0.0) ? Math.PI : -Math.PI;

				angle.y -= deltaAngle;

				qRotY.setFromAxisAngle(camRight, -angle.y);
			}
		}

		eyeToCenter = qRotY.clone().rotate(eyeToCenter);
		camUp = qRotY.clone().rotate(camUp);
		camUp.normalize();

		var vertAxis = camera.keepSceneUpright ? worldUp : camUp;
		var qRotX = new THREE.Quaternion().setFromAxisAngle(vertAxis, -angle.x);

		eyeToCenter = qRotX.clone().rotate(eyeToCenter);
		camUp = qRotX.clone().rotate(camUp);

		this.center.copy(eyeToCenter.add(camera.position));
		camera.up.copy(camUp);

		camera.lookAt(this.center);
		changed(false);
	};

	this.pan = function(distance) {
		if(!this.navApi.isActionEnabled('pan'))
			return;

		distance = convertCoordsToWindow(distance.x, distance.y);

		var W = this.getView();
		var U = camera.up.clone().cross(W);
		var V = W.clone().cross(U);

		U.normalize();
		V.normalize();
		W.normalize();

		var Pscreen = this.pivot.clone().sub(camera.position);
		var screenW = W.clone().dot(Pscreen);
		var screenU = screenW * (Math.tan(THREE.Math.degToRad(camera.leftFov)) + Math.tan(THREE.Math.degToRad(camera.rightFov)));
		var screenV = screenW * (Math.tan(THREE.Math.degToRad(camera.topFov)) + Math.tan(THREE.Math.degToRad(camera.bottomFov)));

		var offsetU = distance.x * Math.abs(screenU);
		var offsetV = distance.y * Math.abs(screenV);

		var offset = new THREE.Vector3();
		var u = U.clone().multiplyScalar(offsetU);
		var v = V.clone().multiplyScalar(offsetV);

		offset = (u.clone().add(v)).clone().multiplyScalar(this.userPanSpeed);

		camera.position.add(offset);
		this.center.add(offset);

		camera.lookAt(this.center);
		changed(false);
	};

	this.zoom = function(zoomDelta) {
		if(!this.navApi.isActionEnabled('zoom'))
			return;

		//TODO: bug - when pivot is set outside the object, object zooms past the pivot point
		var zoomMin = 0.05;
		var zoomBase = this.userZoomSpeed;
		var distMax = Number.MAX_VALUE;
		var deltaXY = zoomDelta.x + zoomDelta.y;
		var dist = Math.pow(zoomBase, deltaXY);

		var zoomPosition = (this.pivot.clone().sub((this.pivot.clone().sub(this.saveEye).clone()).multiplyScalar(dist)));
		var zoomCenter = zoomPosition.clone().add(cam.D.clone().multiplyScalar(cam.D.clone().dot((this.pivot.clone().sub(zoomPosition)).clone())));

		if(dist >= distMax)
			return;

		if(deltaXY > 0.0) {
			var snapSize = 0;
			var dist2 = Math.pow(zoomBase, deltaXY - snapSize);

			// PERSP zoom out
			if(deltaXY < snapSize) {
				// inside the zoomout speedbump region
				unitAmount = 0.0;
				return;

			} else {
				camera.position.copy(zoomPosition);
				this.center.copy(zoomCenter);

				var EprojD = (zoomPosition.clone().sub(this.saveEye)).dot(cam.D);

				if(EprojD > distMax) {
					camera.position.copy((this.saveEye.sub(cam.D)).clone().multiplyScalar(distMax));
					unitAmount = (distMax > 0.0) ? -1.0 : 0.0;
				} else {
					unitAmount = -(EprojD / distMax);
				}
			}
		} else {

			camera.position.copy(zoomPosition);
			this.center.copy(zoomCenter);

			//Zoom In
			/*if ( dist < zoomMin) {
			    //exponential zoom moved in as far as it can
			    var zoomMinLinear = ( Math.log(zoomMin) / Math.log(zoomBase) );
			    var distLinearXY = Math.abs(deltaXY) - Math.abs(zoomMinLinear);
			    var snapSize = 0;

			    // do linear zoomin
			    if ( distLinearXY > snapSize ) {

			        var distLinearXY = distLinearXY - snapSize/window.innerHeight;
			        var amount = -distLinearXY;

			        var multiplier = this.userZoomSpeed;
			        var dist2 = amount * multiplier;

			        var Esnap = this.pivot.clone().sub((this.pivot.clone().sub(this.saveEye)).clone().multiplyScalar(zoomMin));
			        var E = Esnap.clone().sub((this.pivot.clone().sub(this.saveEye)).clone().multiplyScalar(dist2));

			        this.center.copy(E.clone().add(cam.D.clone().multiplyScalar(zoomMin)));
			        camera.position.copy(E);
			    }
			} else {
			    cam.D = (this.saveCenter.clone().sub(this.saveEye)).clone().normalize();
			    camera.position.copy(zoomPosition);
			    this.center.copy(zoomCenter);
			}*/
		}
		camera.lookAt(this.center);
		changed(false);
	};

	this.walk = function(currentCursor, startCursor, movementX, movementY, deltaTime) {
		if(!this.navApi.isActionEnabled('walk'))
			return;

		var worldUp = this.sceneUpDirection.clone();
		var worldFront = this.sceneFrontDirection.clone();
		var worldRight = this.sceneFrontDirection.clone().cross(this.sceneUpDirection);
		//TODO: figure out what deltaTime does

		var flyPlanarMotion = true;
		var flyUpDownSensitivity = 0.01;

		if(isInDeadZone(currentCursor, startCursor)) {
			wheel.cursorImage('SWWalk');
			setBias(true, currentCursor, startCursor);
			x = startCursor.x;
			y = startCursor.y;
		} else {
			setBias(false, currentCursor, startCursor);
		}

		//x = currentCursor.x - m_resetBiasX;
		//y = currentCursor.y - m_resetBiasY;
		x = currentCursor.x;
		y = currentCursor.y;

		var delta = convertCoordsToWindow(x - startCursor.x, y - startCursor.y);

		var fInitialMoveX = -delta.x;
		var fInitialMoveY = -delta.y;
		var fSignX = (fInitialMoveX < 0.0) ? -1.0 : 1.0;
		var fSignY = (fInitialMoveY < 0.0) ? -1.0 : 1.0;
		var fMoveX = Math.abs(fInitialMoveX);
		var fMoveY = Math.abs(fInitialMoveY);

		var deadzoneRadius = new THREE.Vector2(30, 30);
		deadzoneRadius = convertCoordsToWindow(deadzoneRadius.x, deadzoneRadius.y);

		fMoveX = (isInDeadZone(currentCursor, startCursor)) ? 0.0 : Math.abs(fInitialMoveX) - deadzoneRadius.x;
		fMoveY = (isInDeadZone(currentCursor, startCursor)) ? 0.0 : Math.abs(fInitialMoveY) - deadzoneRadius.y;

		var rampRadius = 0.25;
		fMoveX /= rampRadius;
		fMoveY /= rampRadius;

		fMoveX = (fMoveX < 1.0) ? Math.easeClamp(fMoveX, 0.0, 1.0) : Math.pow(fMoveX, 1.0);
		fMoveY = (fMoveY < 1.0) ? Math.easeClamp(fMoveY, 0.0, 1.0) : Math.pow(fMoveY, 1.0);

		// scale by time
		//fMoveX *= deltaTime;
		//fMoveY *= deltaTime;

		var fDeltaX = (fMoveX > 0.0) ? fMoveX * fSignX : 0.0;
		var fDeltaY = (fMoveY > 0.0) ? fMoveY * fSignY : 0.0;

		var vViewDir = this.getView();
		var fViewDist = vViewDir.length();
		vViewDir.normalize();

		var vRightDir = vViewDir.clone().cross(camera.up);
		vRightDir.normalize();

		// project vViewDir onto plane perpendicular to up direction to get
		// better walking inside houses, etc
		// (but prevents flying down to model from 3/4 view...)

		var vYViewDirRight = worldRight.clone().multiplyScalar(worldRight.clone().dot(vViewDir));
		var vYviewDirFront = worldFront.clone().multiplyScalar(worldFront.clone().dot(vViewDir));
		var vYViewDir = vYviewDirFront.clone().add(vYViewDirRight);

		vYViewDir = (vYViewDir.clone().length() > Number.MIN_VALUE) ? vYViewDir.normalize() : camera.up;

		var scale = 1.0;
		var fDollyDist = fDeltaY * (this.walkMultiplier * scale);

		var dir = flyPlanarMotion ? vYViewDir : vViewDir;

		// Free-flying or constrained walk?
		if(flyPlanarMotion) {
			// Constrained Walk
			// To avoid perceptually confusing motion, force a reversal of flying direction along a shifted axis

			// Angle to offset threshold from up-axis
			// TODO: make cos(0.65) into an AutoCam Parameter
			var dDirThreshold = Math.cos(0.65);

			if((dDirThreshold != 1) &&
				(((worldUp.clone().dot(camera.up) < -Number.MIN_VALUE) && (worldUp.clone().dot(vViewDir) < -dDirThreshold)) ||
					((worldUp.clone().dot(camera.up) > Number.MIN_VALUE) && (worldUp.clone().dot(vViewDir) > dDirThreshold)))) {
				dir = -dir;
			}
		}

		var fSpinAngle = -fDeltaX * this.walkMultiplier * 0.05;

		// rotate around world-up vector instead of CameraOperations up vector (more like head movement!)
		//Quaternion quat( m_cameraParams.up, (float)fSpinAngle );

		// Define rotation axis direction
		var vRotAxis = camera.up;

		// Free-flying or constrained walk?
		if(flyPlanarMotion) {
			// Constrained Walk
			// Need to check if:
			//  1. camera is "upside-down" (angle between world up and camera up is obtuse) or
			//  2. camera is in top view (camera up perpendicular to world up and view angle acute to world up)
			// These cases require a reversed rotation direction to maintain consistent mapping of tool:
			//  left->clockwise, right->counter-clockwise
			if((worldUp.clone().dot(camera.up) < -Number.MIN_VALUE) ||
				((Math.abs(worldUp.clone().dot(camera.up)) < Number.MIN_VALUE) &&
					(worldUp.clone().dot(vViewDir) > Number.MIN_VALUE))) {
				fSpinAngle = -fSpinAngle;
			}
			vRotAxis = worldUp;
		}

		// Define rotation transformation

		var quat = new THREE.Quaternion().setFromAxisAngle(vRotAxis, fSpinAngle);
		quat.normalize();

		vViewDir = quat.clone().rotate(vViewDir);
		vViewDir.normalize();
		camera.up.copy(quat.clone().rotate(camera.up));
		camera.up.normalize();

		camera.position.add(dir.clone().multiplyScalar(fDollyDist));
		this.center.copy(camera.position.clone().add(vViewDir.clone().multiplyScalar(fViewDist)));

		dir = flyPlanarMotion ? worldUp : camera.up;
		dir.normalize();

		if(fDollyDist === 0)
			fDollyDist = flyUpDownSensitivity;

		camera.lookAt(this.center);
		changed(false);
	};

	this.updown = function(movementY) {
		if(this.navApi.getIsLocked())
			return;

		var deltaCursor = movementY;
		var deltaAmount = getMoveAmountFromCursorOffset(deltaCursor);

		cam.m_amount += deltaAmount;

		var upDir = new THREE.Vector3(0, 1, 0);

		var eye = cam.saveEye.clone().sub(upDir.clone().multiplyScalar(cam.m_amount));
		var eyeHeight = eye.clone().dot(upDir);

		camera.position.copy(eye);

		if(eyeHeight < cam.minSceneBound) {
			camera.position.add(upDir.clone().multiplyScalar(cam.minSceneBound - eyeHeight));
		}

		if(eyeHeight > cam.maxSceneBound) {
			camera.position.add(upDir.clone().multiplyScalar(cam.maxSceneBound - eyeHeight));
		}

		this.center.copy(camera.position.clone().add(cam.saveCenter.clone().sub(cam.saveEye)));
		camera.lookAt(this.center);
		changed(false);
	};

	/*      REWIND FUNCTIONS */

	/**
	 * This takes a snapshot of the current camera passed into Autocam and saves it to the history. A screenshot
	 * is taken of the sceneContainer canvas
	 */
	this.addHistoryElement = function() {

		// --- We don't require history being saved ---

		// if (cam.rewindParams.maxHistorySize > 0 && cam.rewindParams.history.length >= cam.rewindParams.maxHistorySize){
		//     this.rewindParams.history.shift();
		// }

		// //reset previous 1 or 2 weights to 0
		// if (cam.rewindParams.history.length == 1){
		//     cam.rewindParams.history[0].weight = 0.0;
		// }else if (cam.rewindParams.history.length > 1){
		//     cam.rewindParams.history[cam.rewindParams.history.length -1].weight = 0.0;
		//     cam.rewindParams.history[cam.rewindParams.history.length -2].weight = 0.0;
		// }

		// var element = {};
		// element.thumbnail = document.getElementById("sceneContainer").toDataURL("image/png");
		// element.thumbnailBounds = new THREE.Box2(new THREE.Vector2(0,0),new THREE.Vector2(56,56));
		// element.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
		// element.camera.position = camera.position.clone();
		// element.camera.up = camera.up.clone();
		// element.camera.rotation = camera.rotation.clone();
		// element.camera.leftFov = camera.leftFov;
		// element.camera.rightFov = camera.rightFov;
		// element.camera.topFov = camera.topFov;
		// element.camera.bottomFov = camera.bottomFov;
		// element.camera.center = cam.center.clone();
		// element.camera.pivot = cam.pivot.clone();
		// element.weight = 1.0;
		// element.isEmptyScene = false;

		// //IF SCENE OUTSIDE VIEW SET ISEMPTYSCENE TO TRUE

		// cam.rewindParams.history.push(element);
		// cam.rewindParams.snapped = true;
		// cam.rewindParams.slideOffset.x=0;
		// cam.rewindParams.timelineIndex = cam.rewindParams.history.length - 1;
		// cam.rewindParams.timelineIndexSlide = cam.rewindParams.timelineIndex;
	}

	/**
	 * This handles any case where the user rewinds and then does any transformations, the history is sliced depending
	 * on where the user rewinds to
	 */
	this.addIntermediateHistoryElement = function() {

		if(this.rewindParams.snapped) {
			this.rewindParams.history = this.rewindParams.history.slice(0, this.rewindParams.timelineIndex);
		} else {
			if(this.rewindParams.slideOffset.x > 0) {
				this.rewindParams.history = this.rewindParams.history.slice(0, this.rewindParams.timelineIndex);
			} else {
				this.rewindParams.history = this.rewindParams.history.slice(0, this.rewindParams.timelineIndex + 1);
			}
		}
		this.addHistoryElement();
	};

	this.clearHistory = function() {
		this.rewindParams.history.length = 0;
		this.rewindParams.timelineIndex = 0;
		this.rewindParams.timelineIndexSlide = 0;
		this.rewindParams.resetWeights = true;
	};

	this.openTimeline = function(location) {
		this.rewindParams.timelineIndexSlide = this.rewindParams.timelineIndex;

		if(this.rewindParams.resetWeights) {
			this.rewindParams.slideOffset.x = 0;
			this.rewindParams.snapped = this.rewindParams.snappingEnabled;
		}

		//if haven't applied any transformations before clicking rewind
		if(this.rewindParams.history.length === 0) this.addHistoryElement();

		for(var i = 0; i < this.rewindParams.history.length; i++) {
			var index = i - this.rewindParams.timelineIndex;
			var size = this.rewindParams.thumbnailGapSize + this.rewindParams.thumbnailSize;

			this.rewindParams.history[i].thumbnailBounds.setCenter(new THREE.Vector2(location.x + index * size, location.y).add(this.rewindParams.slideOffset));

			if(this.rewindParams.resetWeights) {
				this.rewindParams.history[i].weight = (i == this.rewindParams.timelineIndex) ? 1.0 : 0.0;
			}
		}

		if(this.rewindParams.resetWeights) {
			this.rewindParams.resetWeights = false;
		}

		var size = (this.rewindParams.thumbnailGapSize + this.rewindParams.thumbnailSize) * 2.0;
		this.rewindParams.open = true;
		this.rewindParams.openLocation = location.clone();
		this.rewindParams.openLocationOrigin = location.clone();
		this.rewindParams.openBracket = location.clone();
		this.rewindParams.openBracketA = new THREE.Vector2(size, location.y);
		this.rewindParams.openBracketB = new THREE.Vector2(window.innerWidth - size, location.y);
		// make sure dead-zone is well formed ... i.e. A.x < B.x
		if(this.rewindParams.openBracketA.x > this.rewindParams.openBracketB.x) {
			var swap = this.rewindParams.openBracketA.x;
			this.rewindParams.openBracketA.x = this.rewindParams.openBracketB.x;
			this.rewindParams.openBracketB.x = swap;
		}
		this.rewindParams.locationOffset = new THREE.Vector2(0, 0);
		this.rewindParams.snapOffset = new THREE.Vector2(0, 0);
	};

	this.slideTimeline = function(location_) {
		/*
		 Basic Idea:
		 Behaviour of the current rewind timeline is similar to a tracking menu. There is a "deadzone"
		 region where cursor movement does not slide the thumbnails. As the cursor goes outside the
		 region, thumbnails slide to align the closest edge of the timeline to the cursor ('extent'
		 variable is this sliding amount). The edges of the deadzone region are stored in
		 'm_openBracketA/B' variables, and slide around with the timeline. Draw some icons at bracket
		 positions to visualize the process.
		 */

		if(!this.rewindParams.open || this.rewindParams.history.length === 0) {
			return;
		}

		var location = location_.clone().add(this.rewindParams.locationOffset);

		var size = (this.rewindParams.thumbnailGapSize + this.rewindParams.thumbnailSize) * 2.0;
		var bracketA = size;
		var bracketB = window.innerWidth - size;

		var edgeA = this.rewindParams.history[0].thumbnailBounds.center().x;
		var edgeB = this.rewindParams.history[this.rewindParams.history.length - 1].thumbnailBounds.center().x;

		var extent = 0.0;

		if(location.x < this.rewindParams.openBracketA.x) {
			extent = location.x - this.rewindParams.openBracketA.x;

			// don't slide thumbnails past the edge of the timeline
			var edgeAnew = edgeA - extent;

			if(bracketA < edgeAnew) {
				// only want to limit the influence of extent, not overshoot the other way
				extent = Math.min(extent + (edgeAnew - bracketA), 0.0);
			}
		}
		if(location.x > this.rewindParams.openBracketB.x) {
			extent = location.x - this.rewindParams.openBracketB.x;

			// don't slide thumbnails past the edge of the timeline
			var edgeBnew = edgeB - extent;

			if(bracketB > edgeBnew) {
				// only want to limit the influence of extent, not overshoot the other way
				extent = Math.max(extent + (edgeBnew - bracketB), 0.0);
			}
		}

		this.rewindParams.openLocation.x += extent;
		this.rewindParams.openBracketA.x += extent;
		this.rewindParams.openBracketB.x += extent;

		this.rewindParams.openBracket.x = location.x - (this.rewindParams.openLocation.x - this.rewindParams.openLocationOrigin.x);

		var iconOffset = new THREE.Vector2(-extent, 0.0);

		var L = location.clone().sub(this.rewindParams.openLocation.clone().sub(this.rewindParams.openLocationOrigin));

		// snapping

		iconOffset.x += this.rewindParams.snapOffset.x;
		this.rewindParams.snapOffset.x = 0.0;

		var snapped = false;

		if(this.rewindParams.snappingEnabled) {
			var kEnterSnapDistance = 4.0;
			var kLeaveSnapDistance = 16.0;

			for(var i = 0; i < this.rewindParams.history.length; i++) {
				var P = this.rewindParams.history[i].thumbnailBounds.center().add(iconOffset);
				if(Math.abs(P.x - L.x) < kEnterSnapDistance || (this.rewindParams.snapped && Math.abs(P.x - L.x) < kLeaveSnapDistance)) {
					snapped = true;
					if(extent !== 0.0) {
						this.rewindParams.snapOffset.x = P.x - L.x;
						iconOffset.x -= this.rewindParams.snapOffset.x;
					} else {
						this.rewindParams.openBracket.x += P.x - L.x;
					}
					L.x = P.x;
					break;
				}
			}
		}

		this.rewindParams.snapped = snapped;

		var weightMax = -1.0;
		var weightTotal = 0.0;
		for(var j = 0; j < this.rewindParams.history.length; j++) {
			var tempBox = this.rewindParams.history[j].thumbnailBounds.clone();

			// slide the thumbnails
			this.rewindParams.history[j].thumbnailBounds.setCenter(this.rewindParams.history[j].thumbnailBounds.center().add(iconOffset));

			if(this.rewindParams.history[j].thumbnail) {
				var leftEdge = this.rewindParams.history[j].thumbnailBounds.center().x - this.rewindParams.thumbnailSize / 2.0;
				$('#rewindFrame' + j).css('left', leftEdge);
				$('#rewindBorder' + j).css('left', (leftEdge - 4));
			}

			// grow the copied Icon2D to touch the center of its neighbor
			//think about adding offset for frames here
			var newSize = new THREE.Vector2((this.rewindParams.thumbnailGapSize + this.rewindParams.thumbnailSize) * 2.0, (this.rewindParams.thumbnailGapSize + this.rewindParams.thumbnailSize) * 2.0);
			tempBox.setFromCenterAndSize(tempBox.center(), newSize);

			var Icon2DCoords = new THREE.Vector2(0, 0);
			tempBox.getIcon2DCoords(L, Icon2DCoords);

			var weight = 1.0 - Math.abs(Math.equalityClamp(Icon2DCoords.x, -1.0, 1.0));
			this.rewindParams.history[j].weight = weight;

			// check for out-of-range cases
			if(j === 0 && L.x < tempBox.center().x) {
				this.rewindParams.history[j].weight = 1.0;
			}

			if(j === this.rewindParams.history.length - 1 && L.x > tempBox.center().x) {
				this.rewindParams.history[j].weight = 1.0;
			}

			weightTotal = weightTotal + this.rewindParams.history[j].weight;

			// find dominant thumbnail
			if(this.rewindParams.history[j].weight > weightMax) {
				weightMax = this.rewindParams.history[j].weight;
				if(this.rewindParams.snappingEnabled && this.rewindParams.history[j].weight == 1.0) {
					// snap to this element
					this.rewindParams.slideOffset.x = 0;
					this.rewindParams.snapped = true;
				} else {
					this.rewindParams.slideOffset.x = this.rewindParams.history[j].thumbnailBounds.center().x - L.x;
				}
				this.rewindParams.timelineIndexSlide = j;
			}
		}

		// normalize the weights just in case
		for(var k = 0; k < this.rewindParams.history.length; k++) {
			this.rewindParams.history[k].weight = this.rewindParams.history[k].weight / weightTotal;
		}

		// prevent the bracket from moving off the ends of the timeline
		var xBracketMin = this.rewindParams.history[0].thumbnailBounds.center().x;
		var xBracketMax = this.rewindParams.history[this.rewindParams.history.length - 1].thumbnailBounds.center().x;
		if(this.rewindParams.openBracket.x < xBracketMin) {
			this.rewindParams.locationOffset.x += xBracketMin - this.rewindParams.openBracket.x;
			this.rewindParams.openBracket.x = xBracketMin;
		} else if(this.rewindParams.openBracket.x > xBracketMax) {
			this.rewindParams.locationOffset.x += xBracketMax - this.rewindParams.openBracket.x;
			this.rewindParams.openBracket.x = xBracketMax;
		}
	};

	this.shiftBackOneElement = function() {
		if(this.rewindParams.history.length !== 0 && (this.rewindParams.timelineIndex > 0 || this.rewindParams.slideOffset.x !== 0)) {
			if(this.rewindParams.snapped || this.rewindParams.slideOffset.x > 0) {
				this.rewindParams.timelineIndex--;
			}
			this.rewindParams.timelineIndexSlide = this.rewindParams.timelineIndex;
			this.rewindParams.resetWeights = true;
			cam.elapsedTime = 0;
			this.animateToRewindIndex();
		}
	};

	this.animateToRewindIndex = function() {
		var currentTimelineIndex = this.rewindParams.timelineIndex;
		var unitTime = 0.0;
		if(cam.elapsedTime >= shotParams.duration) {
			unitTime = 1.0;
		} else {
			var tMax = shotParams.destinationPercent;
			unitTime = Math.easeClamp(cam.elapsedTime / shotParams.duration, 0.0, tMax);
			cam.elapsedTime += deltaTime / 500;
		}

		cam.center.copy((cam.center.clone().multiplyScalar(1.0 - unitTime)).clone().add(this.rewindParams.history[currentTimelineIndex].camera.center.clone().multiplyScalar(unitTime)));
		camera.position.copy((camera.position.clone().multiplyScalar(1.0 - unitTime)).clone().add(this.rewindParams.history[currentTimelineIndex].camera.position.clone().multiplyScalar(unitTime)));
		camera.up.copy(this.rewindParams.history[currentTimelineIndex].camera.up);
		cam.pivot.copy(cam.center);

		camera.lookAt(cam.center);
		changed(false);

		if(this.cube)
			requestAnimationFrame(this.cube.render);

		if(unitTime !== 1.0)
			requestAnimationFrame(function() {
				cam.animateToRewindIndex();
			});
	};

	this.closeTimeline = function() {
		if(this.rewindParams.timelineIndex != this.rewindParams.timelineIndexSlide) {
			this.rewindParams.timelineIndex = this.rewindParams.timelineIndexSlide;
		}
		this.rewindParams.open = false;
	};

	this.getInterpolatedCamera = function() {
		var interpolatedCam = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
		interpolatedCam.center = new THREE.Vector3(0, 0, 0);
		interpolatedCam.pivot = new THREE.Vector3(0, 0, 0);
		interpolatedCam.leftFov = 0;
		interpolatedCam.rightFov = 0;
		interpolatedCam.topFov = 0;
		interpolatedCam.bottomFov = 0;
		interpolatedCam.up.set(0, 0, 0);

		for(var i = 0; i < this.rewindParams.history.length; i++) {
			var frameCam = this.rewindParams.history[i].camera;
			var wi = this.rewindParams.history[i].weight;

			interpolatedCam.center.add(frameCam.center.clone().multiplyScalar(wi));
			interpolatedCam.position.add(frameCam.position.clone().multiplyScalar(wi));
			interpolatedCam.up.add(frameCam.up.clone().multiplyScalar(wi));
			interpolatedCam.rotation.add(frameCam.rotation.clone().multiplyScalar(wi));
			interpolatedCam.pivot.add(frameCam.pivot.clone().multiplyScalar(wi));
			interpolatedCam.leftFov += (frameCam.leftFov * wi);
			interpolatedCam.rightFov += (frameCam.rightFov * wi);
			interpolatedCam.topFov += (frameCam.topFov * wi);
			interpolatedCam.bottomFov += (frameCam.bottomFov * wi);
		}

		camera.position.copy(interpolatedCam.position);
		camera.up.copy(interpolatedCam.up);
		camera.rotation = interpolatedCam.rotation;
		camera.leftFov = interpolatedCam.leftFov;
		camera.rightFov = interpolatedCam.rightFov;
		camera.topFov = interpolatedCam.topFov;
		camera.bottomFov = interpolatedCam.bottomFov;
		cam.center.copy(interpolatedCam.center);
		cam.pivot.copy(interpolatedCam.pivot);
		camera.lookAt(cam.center);
		camera.up.normalize();
		changed(false);
	};

};;
var zv = ZhiUTech.Viewing;
var zvp = ZhiUTech.Viewing.Private;

/* All coordinates in three.js are right handed
 * when looking at the Front of the Cube in the regular upright position: */
/**
 * This is the view cube class subset of Autocam
 * this class renders and provides all functionality for the view cube
 * @class
 * @param {string} tagId - html tag id where you want the view cube to render - OBSOLETE
 * @param {Object} autocam - the autocam controller object
 * @param {HTMLDivElement} cubeContainer - the HTML element to contain the view cube
 * @param {string} localizeResourcePath - relative path to localized texture images
 * @param {Object} [options] - the optional options
 * @param {string} [options.showTriad] - whether to show the triad. 'up' is given by autocam's world up
 * */
zvp.Autocam.ViewCube = function(tagId, autocam, cubeContainer, localizeResourcePath, options) {

	var self = this;
	var cam = autocam;
	var camera = autocam.camera;
	autocam.setCube(this);

	// $("body").prepend("<div id='"+tagId+"' style='position: absolute; z-index: 1000; border: 2px solid red;'></div>");

	self.currentFace = "front";
	self.showTriad = options && options.showTriad;

	var edgeNames = ["top,front", "top right", "top,left", "top,back", "bottom,front", "bottom,right", "bottom,left", "bottom,back", "left,front", "front,right", "right,back", "back,left"];
	var cornerNames = ["front,top,right", "back,top,right", "front,top,left", "back,top,left", "front,bottom,right", "back,bottom,right", "front,bottom,left", "back,bottom,left"];

	/**
	 *  A string array which contains the options for the view cube menu. Use null to indicate a section separator
	 * @type {Array}
	 */
	var menuOptionList = [
		"Go Home", // localized by call to drawDropdownMenu
		null,
		"Orthographic", // localized by call to drawDropdownMenu
		"Perspective", // localized by call to drawDropdownMenu
		"Perspective with Ortho Faces", // localized by call to drawDropdownMenu
		null,
		"Set current view as Home", // localized by call to drawDropdownMenu
		"Focus and set as Home", // localized by call to drawDropdownMenu
		"Reset Home", // localized by call to drawDropdownMenu
		null,
		"Set current view as Front", // localized by call to drawDropdownMenu
		"Set current view as Top", // localized by call to drawDropdownMenu
		"Reset orientation" // localized by call to drawDropdownMenu
		/*
		null,
		"Properties...",
		null,
		"Help..."
		*/
	];
	var menuEnableList = [
		true,
		null,
		true,
		true,
		true,
		null,
		true,
		true,
		true,
		null,
		true,
		true,
		true
		/*
		null,
		"Properties...",
		null,
		"Help..."
		*/
	];
	var menuStateCallbackList = [
		null,
		null,
		function() {
			return !cam.orthographicFaces && !camera.isPerspective;
		},
		function() {
			return !cam.orthographicFaces && camera.isPerspective;
		},
		function() {
			return cam.orthographicFaces;
		},
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null
		/*
		null,
		"Properties...",
		null,
		"Help..."
		*/
	];

	// THREE.js Scenes
	var shadowScene, cubeScene, gridScene, lineScene, triadScene, controlScene;

	// An array of objects that need to always face the camera
	var sprites = [];

	var controlCamera;
	// self.camera = new THREE.PerspectiveCamera( camera.fov, window.innerWidth / window.innerHeight, 1, 10000 );
	// make two cameras to flip between, depending if perspective or orthographic view is used.
	// TODO: scale keeps the size of the view cube the same; 45 fov used to be the default FOV. Problem with this
	// idea is that you also then need to adjust the position (and not below - setting it there does nothing) and this
	// will change the look of the perspective cube.
	self.pcam = new THREE.PerspectiveCamera(45, 1.0, 1, 2000); // aspect gets truly set during Init()
	self.ocam = new THREE.OrthographicCamera(-265, 265, 265, -265, -1000, 1000);
	self.ocam.fov = self.pcam.fov;
	self.ocam.aspect = self.pcam.aspect;
	self.camera = camera.isPerspective ? self.pcam : self.ocam;
	self.camera.position.copy(camera.position);
	self.center = new THREE.Vector3(0, 0, 0);
	self.camera.lookAt(self.center);
	// var length = camera.position.length();

	// THREE.js Meshes
	var cube, line, home, shadow, context;
	var gridMeshes = [];
	var arrowGroup;

	// Sizes for Three.js renderers
	//var windowHalfX;
	//var windowHalfY;

	// Buffers and past INTERSECTS used for mouse picking
	var arrowBuffer = [];
	var intersectsFace = [];
	var controlBuffer = [];
	var cubeBuffer = [];
	var INTERSECTED = null;
	var INTERSECTED_F = null;
	var INTERSECTED_C = null;
	var rollLeftOffset, rollRightOffset, rollOffset;
	var homeOffset, menuOffset;

	// Size of cube in relation to HTML tag
	var cubeSize = 0;

	// Position of HTML element
	var position;

	// Used to wait for textures to load before rendering the View Cube
	var loadedTextureCount = 0;

	// Flags
	// Whether arrows (orthogonal and roll) are visible (i.e., you're directly facing a cube face).
	var _orthogonalView = true;
	var _havePointerLockFeature = false;
	var _havePointerLock = false;
	var _pointerLockMoveBugSPK865 = false;
	var _isChrome = (navigator.userAgent.search("Chrome") != -1);
	var _isWindows = (navigator.platform.search("Win32") != -1);
	var _dragged = false;
	var _transparent = false;

	// store all loaded textures here so we are not constantly re-downloading them
	var changingTextures = [];

	// Height and Width of the renderer
	// may be referred to as self.width and self.height
	this.width = 0;
	this.height = 0;

	// Public changeable values
	/**
	 * view cube animation speed (not 0 or negative),
	 * specified in time (milliseconds) to complete an animation
	 * @type {Number}
	 */
	this.animSpeed = 500;
	/**
	 * turn on and off animation
	 * @type {Boolean}
	 */
	this.animate = true;
	/**
	 * turn on and off ability to drag the view cube
	 * @type {Boolean}
	 */

	this.compass = false;
	this.viewScaleFactorCompass = 1.5;
	this.viewScale = 1; // Set in Init based on cubeSize

	this.draggable = true;

	/**
	 * turn on and off the availability of the home button;
	 * note, this is a "second", smaller home button, you probably
	 * do not want it.
	 * @type {Boolean}
	 */
	this.wantHomeButton = false;

	/**
	 * turn on and off the availability of the roll arrows
	 * @type {Boolean}
	 */
	this.wantRollArrows = true;

	/**
	 * turn on and off the availability of the menu icon
	 * @type {Boolean}
	 */
	this.wantContextMenu = true;

	/**
	 * opacity when inactive (transparency must be enabled)
	 * @type {Number}
	 */
	this.inactiveOpacity = 0.5;

	/** Function to get position of html element on screen
	 *
	 * @param element - HTML DOM element to find position of
	 * @return {Object} - object which specifies x and y screen coordinates of location of input element
	 */
	var getPosition = function(element) {
		var rect = element.getBoundingClientRect();
		return {
			x: rect.left,
			y: rect.top,
			w: rect.width,
			h: rect.height
		};

		/*
		var xPosition = window.pageXOffset;
		var yPosition = window.pageYOffset;

		while (element) {
		    xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
		    yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
		    element = element.offsetParent;
		}
		return { x:xPosition, y:yPosition };
		*/
	};

	/** Used by pointer lock API
	 *
	 * @param {Object} e - event object
	 */
	var pointerLockChange = function(e) {
		e.preventDefault();
		e.stopPropagation();

		_havePointerLock = (document.pointerLockElement === cubeContainer ||
			document.mozPointerLockElement === cubeContainer ||
			document.webkitPointerLockElement === cubeContainer);
	};

	var initTriad = function(triadLength, worldUp) {
		var offSet = triadLength / 2;
		var triadThickness = 10;
		var spriteSize = 50;
		var triadColors = {
			x: 0xff0000,
			y: 0x00ff00,
			z: 0x0000ff
		};
		var tempMatrix = new THREE.Matrix4(); // A matrix for temporary calculations

		var rotationMatrix = new THREE.Matrix4();
		if(worldUp.z === 1) {
			var rotationVector = new THREE.Vector3(0, 1, 0);
			// Rotate the triad so that z is up and the x and y axis lines point in the positive direction
			rotationMatrix.makeRotationAxis(rotationVector, Math.PI / 2);
			rotationVector.set(1, 1, 1).normalize();
			rotationMatrix.multiply(tempMatrix.makeRotationAxis(rotationVector, -Math.PI * 2 / 3));
		}

		var spriteGeometry = new THREE.PlaneBufferGeometry(spriteSize, spriteSize);
		var getTextSprite = function(text, color) {
			var textCanvas = document.createElement('canvas');
			textCanvas.width = textCanvas.height = 128;
			var ctx2d = textCanvas.getContext('2d');
			ctx2d.font = '128px Arial';
			ctx2d.fillStyle = "rgba(255,255,255,1)";
			ctx2d.textAlign = 'center';
			ctx2d.textBaseline = 'middle';
			ctx2d.fillText(text, textCanvas.width / 2, textCanvas.height / 2);

			var textTexture = new THREE.Texture(textCanvas);
			textTexture.needsUpdate = true;

			return new THREE.Mesh(
				spriteGeometry,
				new THREE.MeshBasicMaterial({
					map: textTexture,
					side: THREE.DoubleSide,
					transparent: true,
					color: color,
					depthWrite: false,
					depthTest: true
				})
			);
		};

		triadScene = new THREE.Scene();

		// Add the axes
		var triadGeom = new THREE.BoxGeometry(triadLength, triadThickness, triadThickness);
		var xAxis = new THREE.Mesh(triadGeom, new THREE.MeshBasicMaterial({
			color: triadColors.x,
			shading: THREE.SmoothShading
		}));
		var yAxis = new THREE.Mesh(triadGeom, new THREE.MeshBasicMaterial({
			color: triadColors.y,
			shading: THREE.SmoothShading
		}));
		var zAxis = new THREE.Mesh(triadGeom, new THREE.MeshBasicMaterial({
			color: triadColors.z,
			shading: THREE.SmoothShading
		}));

		xAxis.applyMatrix(tempMatrix.makeTranslation(triadThickness / 2, -offSet, -offSet));
		yAxis.applyMatrix(tempMatrix.makeRotationZ(Math.PI / 2));
		yAxis.applyMatrix(tempMatrix.makeTranslation(-offSet, triadThickness / 2, -offSet));
		zAxis.applyMatrix(tempMatrix.makeRotationY(Math.PI / 2));
		zAxis.applyMatrix(tempMatrix.makeTranslation(-offSet, -offSet, triadThickness / 2));

		// Rotate the triad to match the up direction
		xAxis.applyMatrix(rotationMatrix);
		yAxis.applyMatrix(rotationMatrix);
		zAxis.applyMatrix(rotationMatrix);

		triadScene.add(xAxis);
		triadScene.add(yAxis);
		triadScene.add(zAxis);

		// Add text
		var xSprite = getTextSprite('X', triadColors.x);
		var ySprite = getTextSprite('Y', triadColors.y);
		var zSprite = getTextSprite('Z', triadColors.z);

		var spriteSecondaryAxisOffSet = -(spriteSize + offSet) / 2 - 20;
		var spriteMainAxisOffset = offSet + spriteSize;
		xSprite.position.set(spriteMainAxisOffset, spriteSecondaryAxisOffSet, spriteSecondaryAxisOffSet);
		ySprite.position.set(spriteSecondaryAxisOffSet, spriteMainAxisOffset, spriteSecondaryAxisOffSet);
		zSprite.position.set(spriteSecondaryAxisOffSet, spriteSecondaryAxisOffSet, spriteMainAxisOffset);

		// Rotate the text to match the up direction. Only rotate the positions, otherwise orienting them to face the
		// camera becomes more complicated
		xSprite.position.applyMatrix4(rotationMatrix);
		ySprite.position.applyMatrix4(rotationMatrix);
		zSprite.position.applyMatrix4(rotationMatrix);

		// Add them to the list of sprites to keep them oriented correctly
		sprites.push(xSprite);
		sprites.push(ySprite);
		sprites.push(zSprite);

		triadScene.add(xSprite);
		triadScene.add(ySprite);
		triadScene.add(zSprite);
	};

	/** Create ViewCube and set up renderer and camera
	 * sets up all Three.js meshes for the View Cube
	 * and initializes all event handlers such as mousemove
	 * and mousedown and mouseup and pointerlock
	 */
	var Init = function() {

		// parentTag = document.getElementById(tagId);

		// var element = $('#'+tagId); // ?? Is this different than the above?
		// element.width(300);
		// element.height(300);

		var bounds = cubeContainer.getBoundingClientRect();
		self.width = bounds.width;
		self.height = bounds.height;

		position = getPosition(cubeContainer);

		//windowHalfX = self.width / 2;
		//windowHalfY = self.height / 2;

		//camera for home and arrow
		controlCamera = new THREE.PerspectiveCamera(70, self.height / self.width, 1, 10000);
		controlCamera.position.set(0, 0, 500);

		shadowScene = new THREE.Scene();
		cubeScene = new THREE.Scene();
		gridScene = new THREE.Scene();
		lineScene = new THREE.Scene();
		controlScene = new THREE.Scene();
		_orthogonalView = true;

		// This size means that the cube is (cubeSize)x(cubeSize)x(cubeSize) big
		cubeSize = 200;
		self.viewScale = cubeSize * 3.5;

		/******************************************Create the View Cube***********************************************/
		var filteringType = THREE.LinearFilter;

		// Load in the faceMap textures for 6 faces

		var getResourceUrl = ZhiUTech.Viewing.Private.getResourceUrl;
		var resRoot = 'res/textures/';

		//The face names texture is localized:
		var locTexPath = localizeResourcePath || resRoot;

		var texture = new THREE.DDSLoader().load(getResourceUrl(locTexPath + 'VCcrossRGBA8small.dds'));
		texture.minFilter = texture.maxFilter = filteringType;

		var shader = THREE.ShaderLib["cube"];

		var material = ZhiUTech.Viewing.Shaders.createShaderMaterial(shader);
		material.depthWrite = false;
		material.uniforms["tCube"].value = texture;

		var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize, 4, 4, 4);
		var cubeLine = new THREE.BoxGeometry(cubeSize + 1, cubeSize + 1, cubeSize + 1, 4, 4, 4);

		// Create a cube object mesh with specified geometry and faceMap materials
		cube = new THREE.Mesh(cubeGeometry, material);
		cube.position.set(0.0, 0, 0);
		cubeScene.add(cube);

		// Set up a line segment for the cube border
		var borderTexture = loadTexture(getResourceUrl(resRoot + 'VCedge1.png'));

		borderTexture.minFilter = borderTexture.maxFilter = filteringType;

		line = new THREE.Mesh(cubeLine, new THREE.MeshBasicMaterial({
			map: borderTexture,
			overdraw: false,
			transparent: true,
			shading: THREE.SmoothShading
		}));
		line.position.set(0.0, 0, 0);
		lineScene.add(line);

		// Set up the triad
		initTriad(cubeSize + 20, autocam.getWorldUpVector());

		/********************************************Set up the controls**********************************************/

		// Orthogonal Arrows

		var arrowDist = cubeSize;

		var arrowGeo = new THREE.Geometry();

		var v1 = new THREE.Vector3(-30, 0, 0);
		var v2 = new THREE.Vector3(30, 0, 0);
		var v3 = new THREE.Vector3(0, -30, 0);

		arrowGeo.vertices.push(v1);
		arrowGeo.vertices.push(v2);
		arrowGeo.vertices.push(v3);

		arrowGeo.faces.push(new THREE.Face3(1, 0, 2));
		arrowGeo.computeFaceNormals();

		var arrowMaterial1 = new THREE.MeshBasicMaterial({
			overdraw: true,
			color: 0xDDDDDD,
			transparent: false,
			opacity: 1,
			shading: THREE.FlatShading
		});
		var arrowMaterial2 = new THREE.MeshBasicMaterial({
			overdraw: true,
			color: 0xDDDDDD,
			transparent: false,
			opacity: 1,
			shading: THREE.FlatShading
		});
		var arrowMaterial3 = new THREE.MeshBasicMaterial({
			overdraw: true,
			color: 0xDDDDDD,
			transparent: false,
			opacity: 1,
			shading: THREE.FlatShading
		});
		var arrowMaterial4 = new THREE.MeshBasicMaterial({
			overdraw: true,
			color: 0xDDDDDD,
			transparent: false,
			opacity: 1,
			shading: THREE.FlatShading
		});

		var arrowSelection = new THREE.PlaneBufferGeometry(cubeSize * 0.5, cubeSize * 0.3, 2, 2);
		var arrowSelectionMat = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0.0
		});

		var upArrow = new THREE.Mesh(arrowGeo, arrowMaterial1);
		var upArrowSelect = new THREE.Mesh(arrowSelection, arrowSelectionMat);
		upArrow.position.set(0, arrowDist, 0.0);
		upArrowSelect.position.set(0, arrowDist * 0.9, 0.1);

		var downArrow = new THREE.Mesh(arrowGeo, arrowMaterial2);
		var downArrowSelect = new THREE.Mesh(arrowSelection, arrowSelectionMat);
		downArrow.position.set(0, -arrowDist, 0.0);
		downArrowSelect.position.set(0, -arrowDist * 0.9, 0.1);
		downArrow.rotation.z += Math.PI;
		downArrowSelect.rotation.z += Math.PI;

		var rightArrow = new THREE.Mesh(arrowGeo, arrowMaterial3);
		var rightArrowSelect = new THREE.Mesh(arrowSelection, arrowSelectionMat);
		rightArrow.position.set(arrowDist, 0, 0.0);
		rightArrowSelect.position.set(arrowDist * 0.9, 0, 0.1);
		rightArrow.rotation.z -= Math.PI / 2;
		rightArrowSelect.rotation.z -= Math.PI / 2;

		var leftArrow = new THREE.Mesh(arrowGeo, arrowMaterial4);
		var leftArrowSelect = new THREE.Mesh(arrowSelection, arrowSelectionMat);
		leftArrow.position.set(-arrowDist, 0, 0.0);
		leftArrowSelect.position.set(-arrowDist * 0.9, 0, 0.1);
		leftArrow.rotation.z += Math.PI / 2;
		leftArrowSelect.rotation.z += Math.PI / 2;

		arrowGroup = new THREE.Object3D();
		arrowGroup.position.set(0, 0, 0);
		arrowGroup.add(upArrow);
		arrowGroup.add(downArrow);
		arrowGroup.add(rightArrow);
		arrowGroup.add(leftArrow);

		controlScene.add(upArrowSelect);
		controlScene.add(downArrowSelect);
		controlScene.add(rightArrowSelect);
		controlScene.add(leftArrowSelect);
		controlScene.add(arrowGroup);

		arrowBuffer.push(upArrowSelect);
		arrowBuffer.push(downArrowSelect);
		arrowBuffer.push(rightArrowSelect);
		arrowBuffer.push(leftArrowSelect);

		// Home icon
		var homeGeo = new THREE.PlaneBufferGeometry(cubeSize / 3, cubeSize / 3, 2, 2);
		var homeMaterial = new THREE.MeshBasicMaterial({
			map: loadTexture(getResourceUrl(resRoot + 'VChome.png')),
			transparent: true,
			shading: THREE.FlatShading
		});
		//homeMaterial.needsUpdate = true;
		home = new THREE.Mesh(homeGeo, homeMaterial);
		home.position.set(-cubeSize, cubeSize, 0);

		homeOffset = controlBuffer.length;
		controlScene.add(home);
		controlBuffer.push(home);

		// Arrows for rolling
		var rollArrows = new THREE.PlaneBufferGeometry(cubeSize * 1.5, cubeSize * 1.5, 2, 2);
		var rollMaterial = new THREE.MeshBasicMaterial({
			map: loadTexture(getResourceUrl(resRoot + 'VCarrows.png')),
			shading: THREE.FlatShading,
			transparent: true
		});
		var roll = new THREE.Mesh(rollArrows, rollMaterial);
		roll.position.set(cubeSize * 0.5 + 20, cubeSize * 0.5 + 20, 0);

		var rollSelectionLeft = new THREE.PlaneBufferGeometry(cubeSize * 0.6, cubeSize * 0.45, 2, 2);
		var rollSelectionLeftMat = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0.0
		});
		var rollLeft = new THREE.Mesh(rollSelectionLeft, rollSelectionLeftMat);
		rollLeft.position.set(cubeSize * 0.5 + 20, cubeSize + 20, 0.1);

		var rollSelectionRight = new THREE.PlaneBufferGeometry(cubeSize * 0.45, cubeSize * 0.6, 2, 2);
		var rollSelectionRightMat = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0.0
		});
		var rollRight = new THREE.Mesh(rollSelectionRight, rollSelectionRightMat);
		rollRight.position.set(cubeSize + 20, cubeSize * 0.5 + 20, 0.1);

		controlScene.add(roll);
		controlScene.add(rollLeft);
		controlScene.add(rollRight);

		rollLeftOffset = controlBuffer.length;
		controlBuffer.push(rollLeft);
		rollRightOffset = controlBuffer.length;
		controlBuffer.push(rollRight);
		rollOffset = controlBuffer.length;
		controlBuffer.push(roll);

		//Menu Icon
		var contextGeo = new THREE.PlaneBufferGeometry(cubeSize / 2.3, cubeSize / 2.3, 2, 2);
		var contextMaterial = new THREE.MeshBasicMaterial({
			map: loadTexture(getResourceUrl(resRoot + 'VCcontext.png')),
			transparent: true,
			shading: THREE.FlatShading
		});
		//homeMaterial.needsUpdate = true;
		context = new THREE.Mesh(contextGeo, contextMaterial);
		context.position.set(cubeSize, -cubeSize, 0);

		menuOffset = controlBuffer.length;
		controlScene.add(context);
		controlBuffer.push(context);

		// Cube Shadow (Plane)

		var shadowGeo = new THREE.Geometry();

		shadowGeo.vertices.push(new THREE.Vector3(0, 0, 0));

		shadowGeo.vertices.push(new THREE.Vector3(-cubeSize / 2, -cubeSize / 2 - 20, -cubeSize / 2));
		shadowGeo.vertices.push(new THREE.Vector3(cubeSize / 2, -cubeSize / 2 - 20, -cubeSize / 2));
		shadowGeo.vertices.push(new THREE.Vector3(cubeSize / 2, -cubeSize / 2 - 20, cubeSize / 2));
		shadowGeo.vertices.push(new THREE.Vector3(-cubeSize / 2, -cubeSize / 2 - 20, cubeSize / 2));

		shadowGeo.faces.push(new THREE.Face3(4, 3, 2));
		shadowGeo.faces.push(new THREE.Face3(4, 2, 1));

		var shadowMat;

		// if(cam.renderer === 'WEBGL') {
		//     var vertexShader = "void main() {gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);}";
		//     var fragmentShader = "void main() {gl_FragColor = vec4(0, 0, 0, 0.5);}";
		//     shadowMat = new THREE.ShaderMaterial({vertexShader: vertexShader, fragmentShader: fragmentShader});
		// }else{
		//     shadowMat = new THREE.MeshBasicMaterial({color:0x000000, transparent:true, opacity: 0.5});
		// }
		shadowMat = new THREE.MeshBasicMaterial({
			color: 0x000000,
			transparent: true,
			opacity: 0.5
		});

		shadow = new THREE.Mesh(shadowGeo, shadowMat);
		shadowScene.add(shadow);

		createCubeGrid();

		if(cam.renderer.toUpperCase() === 'CANVAS') {
			self.renderer = new THREE.CanvasRenderer();

		} else if(cam.renderer.toUpperCase() === 'WEBGL') {
			self.renderer = new zvp.FireflyWebGLRenderer({
				alpha: true,
				antialias: false
			});

		} else {
			zvp.logger.warn("Incorrect use of Autocam.renderer property");
			self.renderer = new THREE.CanvasRenderer();
		}

		self.useTransparency(true);
		self.setSize(self.width, self.height);

		self.camera.topFov = self.camera.bottomFov = self.camera.fov / 2;
		self.camera.leftFov = self.camera.rightFov = (self.camera.aspect * self.camera.fov) / 2;
		// need to copy to camera templates - half of these statements do nothing, since the camera points at pcam or ocam, but simpler than an if statement.
		self.pcam.topFov = self.ocam.topFov = self.camera.topFov;
		self.pcam.bottomFov = self.ocam.bottomFov = self.camera.bottomFov;
		self.pcam.leftFov = self.ocam.leftFov = self.camera.leftFov;
		self.pcam.rightFov = self.ocam.rightFov = self.camera.rightFov;

		// Auto clear needed because of multiple scenes
		self.renderer.autoClear = false;
		self.renderer.setSize(self.width, self.height);
		self.renderer.sortObjects = false;
		cubeContainer.appendChild(self.renderer.domElement);

		// Initialize all event handlers
		cubeContainer.addEventListener('touchstart', onDocumentMouseDown, false);
		cubeContainer.addEventListener('mousedown', onDocumentMouseDown, false);
		cubeContainer.addEventListener('mousemove', onDocumentMouseMove, false);

		/*
		        _havePointerLockFeature = 'pointerLockElement' in document ||
		                                  'mozPointerLockElement' in document ||
		                                  'webkitPointerLockElement' in document;
		*/
		//Disabling this because it causes an intrusive browser pop-up asking
		//whether I want to allow full screen mode to happen (huh?)
		_havePointerLockFeature = false;

		if(_havePointerLockFeature) {
			document.exitPointerLock = document.exitPointerLock ||
				document.mozExitPointerLock ||
				document.webkitExitPointerLock;

			cubeContainer.requestPointerLock = cubeContainer.requestPointerLock ||
				cubeContainer.mozRequestPointerLock ||
				cubeContainer.webkitRequestPointerLock;

			// Hook pointer lock state change events
			document.addEventListener('pointerlockchange', pointerLockChange, false);
			document.addEventListener('mozpointerlockchange', pointerLockChange, false);
			document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
		}

		// Changing textures (blue highlighting for home and roll arrows)
		changingTextures.push(loadTexture(getResourceUrl(resRoot + 'VChomeS.png')));
		changingTextures.push(loadTexture(getResourceUrl(resRoot + 'VCarrowsS0.png')));
		changingTextures.push(loadTexture(getResourceUrl(resRoot + 'VCarrowsS1.png')));
		changingTextures.push(loadTexture(getResourceUrl(resRoot + 'VChome.png')));
		changingTextures.push(loadTexture(getResourceUrl(resRoot + 'VCarrows.png')));
		changingTextures.push(loadTexture(getResourceUrl(resRoot + 'VCcontext.png')));
		changingTextures.push(loadTexture(getResourceUrl(resRoot + 'VCcontextS.png')));
	};

	/** Used to make cube visible again when using the transparency option   */
	var mouseOverCube = function() {
		if(cam.navApi.isActionEnabled('orbit')) {
			cubeContainer.style.opacity = "1.0";
			_transparent = false;
		}
		requestAnimationFrame(self.render);
	};

	/** Used to fade in and out the cube when using the transparency option */
	var mouseMoveOverCube = function(event) {
		if(!_transparent && !cam.viewCubeMenuOpen && cam.navApi.isActionEnabled('orbit')) {
			var x = Math.max(Math.abs((event.clientX - position.x) / position.w - 0.5) * 4.0 - 1.0, 0);
			var y = Math.max(Math.abs((event.clientY - position.y) / position.h - 0.5) * 4.0 - 1.0, 0);
			var d = Math.max(0, Math.min(Math.sqrt(x * x + y * y), 1.0));
			cubeContainer.style.opacity = 1.0 - d * (1.0 - self.inactiveOpacity);
		} else if(cam.navApi.isActionEnabled('orbit')) {
			cubeContainer.style.opacity = 1.0;
		}
	};

	/** Used to make cube transparent when using the transparency option */
	var mouseOutCube = function() {
		if(cam.viewCubeMenuOpen) {
			return;
		}
		cubeContainer.style.opacity = self.inactiveOpacity;
		_transparent = true;
		requestAnimationFrame(self.render);
	};

	/** Takes in a image url and outputs a THREE.texture to be used
	 * by Three.js materials
	 * @param {string} url - path to the image you want to load as a texture
	 * @return {THREE.Texture}
	 */
	var loadTexture = function(url) {
		var image = new Image();
		var useCredentials = zv.endpoint.getUseCredentials() && (url.indexOf('://') === -1 || url.indexOf(window.location.host) !== -1);
		if(useCredentials) {
			image.crossOrigin = "use-credentials";
		} else {
			image.crossOrigin = "anonymous";
		}
		var texture = new THREE.Texture(image);
		image.onload = function() {
			texture.needsUpdate = true;
			loadedTextureCount++;
			if(loadedTextureCount >= 11) {
				// all textures are now loaded
				requestAnimationFrame(self.render);
			}
		};

		image.src = url;
		return texture;
	};

	/** Creates the click-able grid around the View Cube
	 *  by running functions to create Three.js meshes
	 */
	var createCubeGrid = function() {
		var currentGridLength;
		var cubeCorners = [];
		var cubeEdges = [];

		cubeCorners[0] = buildCubeCorner(0, 0);
		cubeCorners[1] = buildCubeCorner(0, Math.PI / 2);
		cubeCorners[2] = buildCubeCorner(0, -Math.PI / 2);
		cubeCorners[3] = buildCubeCorner(0, Math.PI);
		cubeCorners[4] = buildCubeCorner(Math.PI / 2, 0);
		cubeCorners[5] = buildCubeCorner(Math.PI / 2, Math.PI / 2);
		cubeCorners[6] = buildCubeCorner(Math.PI / 2, -Math.PI / 2);
		cubeCorners[7] = buildCubeCorner(Math.PI / 2, Math.PI);

		cubeEdges[0] = buildCubeEdge(0, 0, 0);
		cubeEdges[1] = buildCubeEdge(0, Math.PI / 2, 0);
		cubeEdges[2] = buildCubeEdge(0, -Math.PI / 2, 0);
		cubeEdges[3] = buildCubeEdge(0, Math.PI, 0);
		cubeEdges[4] = buildCubeEdge(Math.PI / 2, 0, 0);
		cubeEdges[5] = buildCubeEdge(Math.PI / 2, Math.PI / 2, 0);
		cubeEdges[6] = buildCubeEdge(Math.PI / 2, -Math.PI / 2, 0);
		cubeEdges[7] = buildCubeEdge(Math.PI / 2, Math.PI, 0);
		cubeEdges[8] = buildCubeEdge(0, 0, Math.PI / 2);
		cubeEdges[9] = buildCubeEdge(0, 0, -Math.PI / 2);
		cubeEdges[10] = buildCubeEdge(-Math.PI / 2, 0, -Math.PI / 2);
		cubeEdges[11] = buildCubeEdge(-Math.PI, 0, -Math.PI / 2);

		// Draw the front square on the grid
		gridMeshes.push(buildCubeFace(0, 0));
		gridMeshes[0].name = 'front';
		intersectsFace.push(gridMeshes[0]);
		cubeBuffer.push(gridMeshes[0]);
		gridScene.add(gridMeshes[0]);

		// Draw the right square on the grid
		gridMeshes.push(buildCubeFace(0, Math.PI / 2));
		gridMeshes[1].name = 'right';
		intersectsFace.push(gridMeshes[1]);
		cubeBuffer.push(gridMeshes[1]);
		gridScene.add(gridMeshes[1]);

		// Draw the back square on the grid
		gridMeshes.push(buildCubeFace(0, Math.PI));
		gridMeshes[2].name = 'back';
		intersectsFace.push(gridMeshes[2]);
		cubeBuffer.push(gridMeshes[2]);
		gridScene.add(gridMeshes[2]);

		// Draw the left grid
		gridMeshes.push(buildCubeFace(0, -Math.PI / 2));
		gridMeshes[3].name = 'left';
		intersectsFace.push(gridMeshes[3]);
		cubeBuffer.push(gridMeshes[3]);
		gridScene.add(gridMeshes[3]);

		// Draw the bottom grid
		gridMeshes.push(buildCubeFace(Math.PI / 2, 0));
		gridMeshes[4].name = 'bottom';
		intersectsFace.push(gridMeshes[4]);
		cubeBuffer.push(gridMeshes[4]);
		gridScene.add(gridMeshes[4]);

		// Draw the top grid
		gridMeshes.push(buildCubeFace(-Math.PI / 2, 0));
		gridMeshes[5].name = 'top';
		intersectsFace.push(gridMeshes[5]);
		cubeBuffer.push(gridMeshes[5]);
		gridScene.add(gridMeshes[5]);

		currentGridLength = gridMeshes.length;

		var i;
		for(i = 0; i < cubeCorners.length; i++) {
			gridMeshes.push(cubeCorners[i]);
			gridMeshes[currentGridLength + i].name = cornerNames[i];
			gridScene.add(gridMeshes[currentGridLength + i]);
			intersectsFace.push(gridMeshes[currentGridLength + i]);
			cubeBuffer.push(gridMeshes[currentGridLength + i]);
		}

		currentGridLength = gridMeshes.length;

		for(i = 0; i < cubeEdges.length; i++) {
			gridMeshes.push(cubeEdges[i]);
			gridMeshes[currentGridLength + i].name = edgeNames[i];
			gridScene.add(gridMeshes[currentGridLength + i]);
			intersectsFace.push(gridMeshes[currentGridLength + i]);
			cubeBuffer.push(gridMeshes[currentGridLength + i]);
		}
	};

	/**
	 * Get intersections between a mesh and mouse position (mouse picking)
	 * @param {THREE.Vector3} pickingVector - direction vector to find intersections
	 * @param {THREE.Camera} camera
	 * @param {THREE.Mesh[]} intersectionBuffer - an array of three.js meshes to check for intersections with these specific meshes
	 * @return {Object[]} - objects which were intersected
	 */
	var findPickingIntersects = function(pickingVector, camera, intersectionBuffer) {
		var raycaster;

		var direction = new THREE.Vector3();
		if(camera.type === "PerspectiveCamera") {
			direction.copy(pickingVector);
			// retrieve point on view plane to shoot ray through
			direction.unproject(camera);
			// direction is target point minus position
			raycaster = new THREE.Raycaster(camera.position, direction.sub(camera.position).normalize());
		} else {
			// orthographic
			var target = new THREE.Vector3();
			target.copy(pickingVector);
			// retrieve point on view plane to shoot ray through
			target.unproject(camera);

			// direction is constant, from position to origin.
			// direction is negative of position
			direction.copy(camera.position).negate().normalize();
			raycaster = new THREE.Raycaster(target, direction);
		}

		return raycaster.intersectObjects(intersectionBuffer);

	};

	var getPickVector = function(event, position) {
		var x = event.clientX - position.x;
		var y = event.clientY - position.y;

		x = (x / position.w * 2.0) - 1.0;
		y = ((position.h - y) / position.h * 2.0) - 1.0;

		return new THREE.Vector3(x, y, 0.5);
	};

	/* never used
	function isFullscreen() {
	    return document.fullscreenElement ||
	           document.webkitFullscreenElement ||
	           document.mozFullScreenElement ||
	           document.msFullscreenElement;
	}
	*/

	function getEventCoords(event, self) {
		var coords = {};

		if(event.type.indexOf("touch") === 0) {
			if(event.touches.length > 0) {
				coords.clientX = event.touches[0].clientX;
				coords.clientY = event.touches[0].clientY;
				coords.pageX = event.touches[0].pageX;
				coords.pageY = event.touches[0].pageY;
				coords.screenX = event.touches[0].screenX;
				coords.screenY = event.touches[0].screenY;
				coords.movementX = coords.screenX - self.prevX;
				coords.movementY = coords.screenY - self.prevY;
				coords.which = cam.navApi.getUseLeftHandedInput() ? 3 : 1;
			} else {
				coords = self.prevCoords;
			}
		} else {
			coords.clientX = event.clientX;
			coords.clientY = event.clientY;
			coords.pageX = event.pageX;
			coords.pageY = event.pageY;
			coords.screenX = event.screenX;
			coords.screenY = event.screenY;
			coords.which = event.which;

			if(_havePointerLockFeature) {
				coords.movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
				coords.movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
			} else {
				coords.movementX = coords.screenX - self.prevX;
				coords.movementY = coords.screenY - self.prevY;
			}
		}
		self.prevX = coords.screenX;
		self.prevY = coords.screenY;
		self.prevCoords = coords;

		return coords;
	}

	/** All functionality regarding cube clicks starts here
	 *
	 * @param {Object} event - event when mouse down occurs
	 */
	var onDocumentMouseDown = function(event) {
		event.preventDefault();
		event.stopPropagation();

		if(!cam.navApi.isActionEnabled('orbit'))
			return;

		if(cam.currentlyAnimating) {
			return;
		}

		var coords = getEventCoords(event, self);

		// Make sure our position is up to date...
		position = getPosition(cubeContainer);

		cubeContainer.removeEventListener('mousemove', onDocumentMouseMove, false);
		document.addEventListener('mouseup', onDocumentMouseUp, false);
		document.addEventListener('touchend', onDocumentMouseUp, false);
		// Not needed: document.addEventListener('mousemove', onDocumentMouseMove, false);

		if(!cam.navApi.getUsePivotAlways()) {
			// If the usePivot option is not on, we pivot around the center of the view:
			cam.pivot.copy(cam.center);
			cam.navApi.setPivotPoint(cam.center);
			// This also clears the pivot set flag:
			cam.navApi.setPivotSetFlag(false);
		}

		cam.startInteraction(coords.pageX, coords.pageY);

		// Since this mouse down is for dragging the cube we should not be able do this if the cube is animating already
		var intersectsWithCube;
		var pickingVector;

		//If cube is first thing clicked, add the current shot to rewind history
		if(cam.rewindParams.history.length == 0) cam.addHistoryElement();

		//If clicking cube from anywhere other then end of timeline update history accordingly
		if(!cam.rewindParams.snapped || cam.rewindParams.timelineIndex + 1 != cam.rewindParams.history.length) cam.addIntermediateHistoryElement();

		var rightMouse = cam.navApi.getUseLeftHandedInput() ? 1 : 3;
		if(coords.which === rightMouse) // Right mouse click, handled on mouse up
			return;

		if(self.animSpeed <= 0) {
			zvp.logger.error("animSpeed cannot be 0 or less, use ViewCube.animate flag to turn on and off animation", zv.errorCodeString(zv.ErrorCodes.VIEWER_INTERNAL_ERROR));
			return;
		}

		// get mouse picking intersections
		pickingVector = getPickVector(coords, position);
		intersectsWithCube = findPickingIntersects(pickingVector, self.camera, cubeBuffer);

		if(intersectsWithCube.length > 0) {

			hideArrows();
			if(self.draggable) {
				document.addEventListener('mousemove', onDocumentMouseMoveCube, false);
				document.addEventListener('touchmove', onDocumentMouseMoveCube, false);

				// Check if browser has pointer lock support
				if(_havePointerLockFeature) {
					// Ask the browser to lock the pointer
					cubeContainer.requestPointerLock();
					_pointerLockMoveBugSPK865 = (_isChrome && _isWindows);
				}
			}
		}
	};

	/** Used for dragging the cube,
	 * @param {Object} event - event when mouse move occurs (contains information about pointer position)
	 */
	var onDocumentMouseMoveCube = function(event) {

		event.preventDefault();
		event.stopPropagation();

		// This is an error if user puts in self.animSpeed = 0 or less
		if(self.animSpeed <= 0) {
			document.removeEventListener("mousemove", onDocumentMouseMoveCube, false);
			document.removeEventListener("touchmove", onDocumentMouseMoveCube, false);
			zvp.logger.error("animSpeed cannot be 0 or less", zv.errorCodeString(zv.ErrorCodes.VIEWER_INTERNAL_ERROR));
			return;
		}

		if(cam.currentlyAnimating) {
			return;
		}
		var coords = getEventCoords(event, self);

		if(_havePointerLockFeature) {
			// We skip the first movement event after requesting pointer lock
			// because Chrome on Windows sends out a bogus motion value.
			if(_pointerLockMoveBugSPK865) {
				_pointerLockMoveBugSPK865 = false;
				coords.movementX = coords.movementY = 0;
			}
		}

		if(_havePointerLock) {

			// Ignore erroneous data sent from pointer lock
			// not sure why erroneous data gets received
			// could be bug in pointer lock
			if(coords.movementX > 300 || coords.movementY > 300) {
				coords.movementX = 0;
				coords.movementY = 0;
			}
		}

		// If the mouse hasn't moved ignore this current movement (not sure why the mouse move event gets called)
		// Also used for ignoring erroneous data
		if(coords.movementX === coords.movementY && coords.movementX === 0) {
			cam.currentlyAnimating = false;
			return;
		}
		_orthogonalView = false;
		_dragged = true;
		cam.showPivot(true);
		cam.currentCursor = new THREE.Vector2(coords.pageX, coords.pageY);
		cam.orbit(cam.currentCursor, cam.startCursor, new THREE.Vector3(-coords.movementX, coords.movementY, 0), cam.startState);

		self.camera.lookAt(self.center);

		requestAnimationFrame(self.render);
	};

	var endMouseUp = function(stillNeedUp) {
		if(!stillNeedUp) {
			document.removeEventListener('mouseup', onDocumentMouseUp, false);
			document.removeEventListener('touchend', onDocumentMouseUp, false);
		}

		document.removeEventListener('mousemove', onDocumentMouseMoveCube, false);
		document.removeEventListener('touchmove', onDocumentMouseMoveCube, false);
		cubeContainer.addEventListener('mousemove', onDocumentMouseMove, false);

		if(_havePointerLock) {
			document.exitPointerLock();
		}

	};

	/** Rotates the cube when a division of the cube grid is clicked,
	 * also provides functionality for home button interaction, orthogonal arrows interaction,
	 * and roll arrows interaction
	 * @param {Object} event - event contains information about mouse position which is used in this function
	 */
	var onDocumentMouseUp = function(event) {
		event.preventDefault();
		event.stopPropagation();

		var cubeIntersects;
		var arrowIntersects;
		var controlIntersects;

		if(cam.currentlyAnimating || _dragged) {
			cam.endInteraction();
			cam.showPivot(false);
			_dragged = false;

			endMouseUp(false);
			return;
		}
		var coords = getEventCoords(event, self);

		if(cam.viewCubeMenuOpen) {
			var x = coords.clientX - position.x;
			var y = coords.clientY - position.y;

			//if clicked on the menu
			if((cam.menuOrigin.x <= x) && (x <= (cam.menuOrigin.x + cam.menuSize.x)) &&
				(cam.menuOrigin.y <= y) && (y <= (cam.menuOrigin.y + cam.menuSize.y))) {

				// HACK!!
				// TODO: make this a bit more robust. It doesn't take the menu separators
				// into account and makes a gross assumption about the menu entry size.
				var menuItemNumber = Math.floor(((y - 5) - cam.menuOrigin.y) / 25);

				var log = function(action) {
					zvp.logger.track({
						name: 'navigation/' + action,
						aggregate: 'count'
					});
				};

				switch(menuItemNumber) {
					case 0: //home
						log('home');
						cam.goHome();
						break;
					case 1: //orthographic
						log('setortho');
						cam.setOrthographicFaces(false);
						cam.toOrthographic();
						// change cube appearance
						self.camera = self.ocam;
						break;
					case 2: //perspective
						log('setpersp');
						cam.setOrthographicFaces(false);
						cam.toPerspective();
						// change cube appearance
						self.camera = self.pcam;
						break;
					case 3: //perspective with ortho faces
						cam.setOrthographicFaces(true);
						if(_orthogonalView) {
							cam.toOrthographic();
							// change cube appearance
							self.camera = self.ocam;
						} else {
							cam.toPerspective();
							// change cube appearance
							self.camera = self.pcam;
						}
						break;
					case 4: //set current view as home
						log('sethome');
						cam.setCurrentViewAsHome(false);
						break;
					case 5: //focus and set current view as home
						log('focushome');
						cam.setCurrentViewAsHome(true);
						break;
					case 6: //reset home
						log('resethome');
						cam.resetHome();
						break;
					case 7: //set current view as front
						log('setfront');
						cam.setCurrentViewAsFront();
						break;
					case 8: //set current view as top
						log('settop');
						cam.setCurrentViewAsTop();
						break;
					case 9: //reset orientation
						cam.resetOrientation();
						break;
				}
			}

			cam.viewCubeMenuOpen = false;
			cam.removeDropdownMenu(cubeContainer);

			//if clicked off the cube canvas
			if(coords.clientX < position.x || coords.clientX > (position.w + position.x) ||
				coords.clientY < position.y || coords.clientY > (position.h + position.y)) {
				mouseOutCube();
			}

			// In case something needs a highlight change:
			if(self.mouseMoveSave)
				self.processMouseMove(self.mouseMoveSave);

			// LMV-1876 and LMV-1986 - re-enable hotkeys, essentially
			cam.endInteraction();

			// remove event listeners
			endMouseUp(false);
			return;
		}
		var rightMouse = cam.navApi.getUseLeftHandedInput() ? 1 : 3;
		if(coords.which === rightMouse) {
			cam.viewCubeMenuOpen = true;
			cam.drawDropdownMenu(menuOptionList, menuEnableList, menuStateCallbackList, coords.clientX, coords.clientY, cubeContainer, position);
			endMouseUp(true);
			return;
		}
		var pickingVector = getPickVector(coords, position);
		cubeIntersects = findPickingIntersects(pickingVector, self.camera, cubeBuffer);
		arrowIntersects = findPickingIntersects(pickingVector, controlCamera, arrowBuffer);
		controlIntersects = findPickingIntersects(pickingVector, controlCamera, controlBuffer);

		// Apply logic for clicking on arrows
		if(arrowIntersects.length > 0 && _orthogonalView) {
			var orientation = cam.getOrientation();

			switch(self.currentFace) {
				case "front":
					switch(orientation) {
						case "up":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("top");
								self.currentFace = "top";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("bottom");
								self.currentFace = "bottom";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("right");
								self.currentFace = "right";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("left");
								self.currentFace = "left";
							}
							break;
						case "right":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("right");
								self.currentFace = "right";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("left");
								self.currentFace = "left";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("bottom");
								self.currentFace = "bottom";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("top");
								self.currentFace = "top";
							}
							break;
						case "down":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("bottom");
								self.currentFace = "bottom";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("top");
								self.currentFace = "top";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("left");
								self.currentFace = "left";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("right");
								self.currentFace = "right";
							}
							break;
						case "left":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("left");
								self.currentFace = "left";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("right");
								self.currentFace = "right";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("top");
								self.currentFace = "top";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("bottom");
								self.currentFace = "bottom";
							}
							break;
					}
					break;

				case "right":
					switch(orientation) {
						case "up":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("top");
								self.currentFace = "top";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("bottom");
								self.currentFace = "bottom";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("back");
								self.currentFace = "back";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("front");
								self.currentFace = "front";
							}
							break;
						case "right":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("back");
								self.currentFace = "back";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("front");
								self.currentFace = "front";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("bottom");
								self.currentFace = "bottom";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("top");
								self.currentFace = "top";
							}
							break;
						case "down":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("bottom");
								self.currentFace = "bottom";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("top");
								self.currentFace = "top";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("front");
								self.currentFace = "front";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("back");
								self.currentFace = "back";
							}
							break;
						case "left":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("front");
								self.currentFace = "front";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("back");
								self.currentFace = "back";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("top");
								self.currentFace = "top";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("bottom");
								self.currentFace = "bottom";
							}
							break;
					}
					break;

				case "left":
					switch(orientation) {
						case "up":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("top");
								self.currentFace = "top";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("bottom");
								self.currentFace = "bottom";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("front");
								self.currentFace = "front";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("back");
								self.currentFace = "back";
							}
							break;
						case "right":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("front");
								self.currentFace = "front";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("back");
								self.currentFace = "back";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("bottom");
								self.currentFace = "bottom";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("top");
								self.currentFace = "top";
							}
							break;
						case "down":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("bottom");
								self.currentFace = "bottom";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("top");
								self.currentFace = "top";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("back");
								self.currentFace = "back";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("front");
								self.currentFace = "front";
							}
							break;
						case "left":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("back");
								self.currentFace = "back";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("front");
								self.currentFace = "front";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("top");
								self.currentFace = "top";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("bottom");
								self.currentFace = "bottom";
							}
							break;
					}
					break;

				case "back":
					switch(orientation) {
						case "up":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("top");
								self.currentFace = "top";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("bottom");
								self.currentFace = "bottom";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("left");
								self.currentFace = "left";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("right");
								self.currentFace = "right";
							}
							break;
						case "right":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("left");
								self.currentFace = "left";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("right");
								self.currentFace = "right";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("bottom");
								self.currentFace = "bottom";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("top");
								self.currentFace = "top";
							}
							break;
						case "down":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("bottom");
								self.currentFace = "bottom";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("top");
								self.currentFace = "top";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("right");
								self.currentFace = "right";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("left");
								self.currentFace = "left";
							}
							break;
						case "left":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("right");
								self.currentFace = "right";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("left");
								self.currentFace = "left";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("top");
								self.currentFace = "top";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("bottom");
								self.currentFace = "bottom";
							}
							break;
					}
					break;

				case "top":
					switch(orientation) {
						case "up":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("back");
								self.currentFace = "back";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("front");
								self.currentFace = "front";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("right");
								self.currentFace = "right";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("left");
								self.currentFace = "left";
							}
							break;
						case "right":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("right");
								self.currentFace = "right";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("left");
								self.currentFace = "left";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("front");
								self.currentFace = "front";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("back");
								self.currentFace = "back";
							}
							break;
						case "down":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("front");
								self.currentFace = "front";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("back");
								self.currentFace = "back";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("left");
								self.currentFace = "left";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("right");
								self.currentFace = "right";
							}
							break;
						case "left":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("left");
								self.currentFace = "left";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("right");
								self.currentFace = "right";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("back");
								self.currentFace = "back";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("front");
								self.currentFace = "front";
							}
							break;
					}
					break;

				case "bottom":
					switch(orientation) {
						case "up":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("front");
								self.currentFace = "front";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("back");
								self.currentFace = "back";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("right");
								self.currentFace = "right";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("left");
								self.currentFace = "left";
							}
							break;
						case "right":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("right");
								self.currentFace = "right";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("left");
								self.currentFace = "left";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("back");
								self.currentFace = "back";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("front");
								self.currentFace = "front";
							}
							break;
						case "down":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("back");
								self.currentFace = "back";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("front");
								self.currentFace = "front";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("left");
								self.currentFace = "left";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("right");
								self.currentFace = "right";
							}
							break;
						case "left":
							if(arrowIntersects[0].object === arrowBuffer[0]) {
								cam.calculateCubeTransform("left");
								self.currentFace = "left";
							} else if(arrowIntersects[0].object === arrowBuffer[1]) {
								cam.calculateCubeTransform("right");
								self.currentFace = "right";
							} else if(arrowIntersects[0].object === arrowBuffer[2]) {
								cam.calculateCubeTransform("front");
								self.currentFace = "front";
							} else if(arrowIntersects[0].object === arrowBuffer[3]) {
								cam.calculateCubeTransform("back");
								self.currentFace = "back";
							}
							break;
					}
					break;
			}
			cam.elapsedTime = 0;
			cam.sphericallyInterpolateTransition();
		}

		if(controlIntersects.length > 0) {
			cam.elapsedTime = 0;

			if(self.wantHomeButton && controlIntersects[0].object === controlBuffer[homeOffset]) {
				cam.goHome();
				endMouseUp(false);
				return;
			}
			if(self.wantContextMenu && controlIntersects[0].object === controlBuffer[menuOffset]) {
				cam.viewCubeMenuOpen = true;
				cam.drawDropdownMenu(menuOptionList, menuEnableList, menuStateCallbackList, coords.clientX, coords.clientY, cubeContainer, position);
				endMouseUp(true);
				return;
			}
			if(self.wantRollArrows && _orthogonalView && (controlIntersects[0].object === controlBuffer[rollLeftOffset] || controlIntersects[0].object === controlBuffer[rollRightOffset])) {
				//TODO: when panning, dir changes -> position
				var clockwise = (controlIntersects[0].object === controlBuffer[rollRightOffset]);
				var destination = {
					center: cam.center.clone(),
					position: camera.position.clone(),
					pivot: camera.pivot.clone(),
					fov: camera.fov,
					worldUp: cam.sceneUpDirection.clone(),
					isOrtho: (camera.isPerspective === false)
				};
				var dir = cam.center.clone().sub(camera.position).normalize();

				if(clockwise) {
					destination.up = camera.up.clone().cross(dir);
				} else {
					destination.up = camera.up.clone().multiplyScalar(-1);
					destination.up.cross(dir);
				}
				destination.up.normalize();

				cam.elapsedTime = 0.0;
				cam.animateTransition(destination);
			}
		}
		if(cubeIntersects.length > 0) {
			var face = cubeIntersects[0].object.name;
			self.mouseMoveSave = event;
			self.cubeRotateTo(face);
		}
		endMouseUp(false);
	};

	this.cubeRotateTo = function(face) {
		self.currentFace = face;

		// If ortho faces is on and the target is not another face,
		// switch to perspective mode:
		if(cam.orthographicFaces && (self.currentFace.indexOf(',') !== -1)) {
			cam.setCameraOrtho(false);
		}
		cam.calculateCubeTransform(self.currentFace);

		cam.elapsedTime = 0;

		// After interpolating to the new target we may have to simulate
		// a mouse move event at the final location so that the appropriate
		// part of the cube is highlighted:
		cam.sphericallyInterpolateTransition(function() {
			if(self.mouseMoveSave)
				self.processMouseMove(self.mouseMoveSave);
		});
	};

	/** Used to highlight cube grid divisions/arrows/home
	 * @param {Object} event - event contains information about mouse position which is used in this function
	 */
	this.processMouseMove = function(event) {
		var intersectsFaces;
		var arrowIntersects;
		var controlIntersects;

		if(cam.viewCubeMenuOpen || cam.currentlyAnimating) {
			self.mouseMoveSave = event;
			return;
		}
		self.mouseMoveSave = null;

		var coords = getEventCoords(event, self);

		var pickingVector = getPickVector(coords, position);

		intersectsFaces = findPickingIntersects(pickingVector, self.camera, intersectsFace);
		arrowIntersects = findPickingIntersects(pickingVector, controlCamera, arrowBuffer);
		controlIntersects = findPickingIntersects(pickingVector, controlCamera, controlBuffer);

		/**********Highlight arrows when hovered over************/

		if(INTERSECTED && !_dragged) {
			INTERSECTED.material.color.setHex(0xDDDDDD);
			INTERSECTED = null;
			requestAnimationFrame(self.render);
		}

		if(arrowIntersects.length > 0 && !_dragged) {
			INTERSECTED = arrowIntersects[0].object;
			for(var i = arrowGroup.children.length; --i >= 0;) {
				if(INTERSECTED === arrowBuffer[i]) {
					INTERSECTED = arrowGroup.children[i];
					INTERSECTED.material.color.setHex(0x00afff);
					break;
				}
			}
			requestAnimationFrame(self.render);
		}

		/**************Highlight faces on cube******************/

		if(INTERSECTED_F && !_dragged) {
			// Make the previously selected face opacity: 0.0
			INTERSECTED_F.material.opacity = 0.0;
			INTERSECTED_F = null;
			requestAnimationFrame(self.render);
		}

		if(intersectsFaces.length > 0 && !_dragged) {
			// Make the currently selected face opacity: 0.3
			INTERSECTED_F = intersectsFaces[0].object;
			INTERSECTED_F.material.opacity = 0.3;
			requestAnimationFrame(self.render);
		}

		if(controlIntersects.length > 0 && !_dragged) {
			if(INTERSECTED_C !== controlIntersects[0].object) {
				// home mouse over
				if(self.wantHomeButton && controlIntersects[0].object === controlBuffer[homeOffset]) {
					INTERSECTED_C = controlIntersects[0].object;
					controlBuffer[homeOffset].material.map = changingTextures[0];
				}

				// Left roll arrow mouse over
				else if(self.wantRollArrows && controlIntersects[0].object === controlBuffer[rollLeftOffset]) {
					INTERSECTED_C = controlIntersects[0].object;
					controlBuffer[rollOffset].material.map = changingTextures[1];
				}

				// Right roll arrow mouse over
				else if(self.wantRollArrows && controlIntersects[0].object === controlBuffer[rollRightOffset]) {
					INTERSECTED_C = controlIntersects[0].object;
					controlBuffer[rollOffset].material.map = changingTextures[2];
				}

				// Menu Icon
				else if(self.wantContextMenu && controlIntersects[0].object === controlBuffer[menuOffset]) {
					INTERSECTED_C = controlIntersects[0].object;
					controlBuffer[menuOffset].material.map = changingTextures[6];
				} else {
					// home mouse over
					if(self.wantHomeButton && INTERSECTED_C === controlBuffer[homeOffset]) {
						INTERSECTED_C = null;
						controlBuffer[homeOffset].material.map = changingTextures[3];
					}

					// Left roll and Right roll arrow
					else if(self.wantRollArrows && (INTERSECTED_C === controlBuffer[rollLeftOffset] ||
							INTERSECTED_C === controlBuffer[rollRightOffset] || INTERSECTED_C === controlBuffer[rollOffset])) {
						INTERSECTED_C = null;
						controlBuffer[rollOffset].material.map = changingTextures[4];
					}

					// menu icon
					else if(self.wantContextMenu && INTERSECTED_C === controlBuffer[menuOffset]) {
						INTERSECTED_C = null;
						controlBuffer[menuOffset].material.map = changingTextures[5];
					}
				}
				requestAnimationFrame(self.render);
			}
		} else if(INTERSECTED_C !== null && !_dragged) {
			// home mouse over
			if(self.wantHomeButton && INTERSECTED_C === controlBuffer[homeOffset]) {
				INTERSECTED_C = null;
				controlBuffer[homeOffset].material.map = changingTextures[3];
			}

			// Left roll and Right roll arrow
			else if(self.wantRollArrows && (INTERSECTED_C === controlBuffer[rollLeftOffset] ||
					INTERSECTED_C === controlBuffer[rollRightOffset] || INTERSECTED_C === controlBuffer[rollOffset])) {
				INTERSECTED_C = null;
				controlBuffer[rollOffset].material.map = changingTextures[4];
			}

			// menu icon
			else if(self.wantContextMenu && INTERSECTED_C === controlBuffer[menuOffset]) {
				INTERSECTED_C = null;
				controlBuffer[menuOffset].material.map = changingTextures[5];
			}

			requestAnimationFrame(self.render);
		}
	};

	var onDocumentMouseMove = function(event) {
		if(cam.navApi.isActionEnabled('orbit'))
			self.processMouseMove(event);
	};

	/** Refreshes values so that renderer is correct size (in pixels) **/
	var onWindowResize = function() {
		position = getPosition(cubeContainer);

		// cubeContainer.style.width = self.width.toString() + "px";
		// cubeContainer.style.height = "inherit";

		self.width = cubeContainer.offsetWidth;
		self.height = cubeContainer.offsetHeight;

		//windowHalfX = self.width / 2;
		//windowHalfY = self.height / 2;

		//self.camera.aspect = self.width / self.height; - one of the two cameras has this aspect, so setting it there sets it here.
		self.pcam.aspect = self.ocam.aspect = self.width / self.height;
		//self.camera.updateProjectionMatrix(); - done by the two calls below:
		self.pcam.updateProjectionMatrix();
		self.ocam.updateProjectionMatrix();

		// PHB added. See Autocam.js windowResize
		self.camera.topFov = self.camera.bottomFov = self.camera.fov / 2;
		self.camera.leftFov = self.camera.rightFov = (self.camera.aspect * self.camera.fov) / 2;
		// need to copy to camera templates - half of these statements do nothing, since the camera points at pcam or ocam, but simpler than an if statement.
		self.pcam.aspect = self.ocam.aspect = self.camera.aspect;
		self.pcam.topFov = self.ocam.topFov = self.camera.topFov;
		self.pcam.bottomFov = self.ocam.bottomFov = self.camera.bottomFov;
		self.pcam.leftFov = self.ocam.leftFov = self.camera.leftFov;
		self.pcam.rightFov = self.ocam.rightFov = self.camera.rightFov;

		self.renderer.setSize(self.width, self.height);
		requestAnimationFrame(self.render);
	};

	/** Builds one square mesh of the grid (located on each face of the cube)
	 *
	 * @param {Number} rotationX - rotate shape by this amount in X
	 * @param {Number} rotationY - rotate shape by this amount in Y
	 * @return {THREE.Mesh} - mesh of the cube face (square part) rotated by params
	 */
	var buildCubeFace = function(rotationX, rotationY) {

		// These sizes may be changed if cube size is changed
		var material;
		var edge = 45;
		var square = 60;
		var masterCubeSize = edge + square;

		var geo = new THREE.Geometry();

		// Center of the cube
		var v0 = new THREE.Vector3(0, 0, 0);

		/******************FRONT OF CUBE********************/
		var v1 = new THREE.Vector3(square, -square, masterCubeSize);
		var v2 = new THREE.Vector3(square, square, masterCubeSize);
		var v3 = new THREE.Vector3(-square, square, masterCubeSize);
		var v4 = new THREE.Vector3(-square, -square, masterCubeSize);

		geo.vertices.push(v0);

		geo.vertices.push(v1);
		geo.vertices.push(v2);
		geo.vertices.push(v3);
		geo.vertices.push(v4);

		/******************FRONT FACE********************/

		// Front square
		geo.faces.push(new THREE.Face3(1, 2, 3));
		geo.faces.push(new THREE.Face3(1, 3, 4));

		// Apply matrix rotations for sides which are not the front
		geo.applyMatrix(new THREE.Matrix4().makeRotationX(rotationX));
		geo.applyMatrix(new THREE.Matrix4().makeRotationY(rotationY));

		geo.computeFaceNormals();
		geo.computeVertexNormals();

		material = new THREE.MeshBasicMaterial({
			overdraw: true,
			opacity: 0.0,
			color: 0x00afff,
			transparent: true
		});
		return new THREE.Mesh(geo, material);
	};

	/** Builds one edge mesh of the grid
	 *
	 * @param rotationX - rotate shape by this amount X
	 * @param rotationY - rotate shape by this amount Y
	 * @param rotationZ - rotate shape by this amount Z
	 * @return {THREE.Mesh} - mesh of the cube edge rotated by params
	 */
	var buildCubeEdge = function(rotationX, rotationY, rotationZ) {
		var material;
		var edge = 45;
		var square = 60;
		var masterCubeSize = edge + square;
		var meshReturn;

		var geo = new THREE.Geometry();

		var e0 = new THREE.Vector3(square, masterCubeSize, masterCubeSize);
		var e1 = new THREE.Vector3(-square, masterCubeSize, masterCubeSize);
		var e2 = new THREE.Vector3(-square, square, masterCubeSize);
		var e3 = new THREE.Vector3(square, square, masterCubeSize);

		var e4 = new THREE.Vector3(square, masterCubeSize, square);
		var e5 = new THREE.Vector3(-square, masterCubeSize, square);
		var e6 = new THREE.Vector3(-square, masterCubeSize, masterCubeSize);
		var e7 = new THREE.Vector3(square, masterCubeSize, masterCubeSize);

		geo.vertices.push(e0);
		geo.vertices.push(e1);
		geo.vertices.push(e2);
		geo.vertices.push(e3);

		geo.vertices.push(e4);
		geo.vertices.push(e5);
		geo.vertices.push(e6);
		geo.vertices.push(e7);

		geo.faces.push(new THREE.Face3(0, 1, 2));
		geo.faces.push(new THREE.Face3(0, 2, 3));

		geo.faces.push(new THREE.Face3(4, 5, 6));
		geo.faces.push(new THREE.Face3(4, 6, 7));

		geo.applyMatrix(new THREE.Matrix4().makeRotationX(rotationX));
		geo.applyMatrix(new THREE.Matrix4().makeRotationY(rotationY));
		geo.applyMatrix(new THREE.Matrix4().makeRotationZ(rotationZ));

		geo.computeFaceNormals();
		geo.computeVertexNormals();

		material = new THREE.MeshBasicMaterial({
			overdraw: true,
			opacity: 0.0,
			color: 0x00afff,
			transparent: true
		});
		meshReturn = new THREE.Mesh(geo, material);
		return meshReturn;
	};

	/** Builds one corner mesh of the grid
	 *
	 * @param {Number} rotationX - rotate shape by this amount in X
	 * @param {Number} rotationY - rotate shape by this amount in Y
	 * @return {THREE.Mesh} - the cube corner mesh rotated by params
	 */
	var buildCubeCorner = function(rotationX, rotationY) {
		var material;
		var edge = 45;
		var square = 60;
		var masterCubeSize = edge + square;
		var meshReturn;

		var geo = new THREE.Geometry();

		var c0 = new THREE.Vector3(masterCubeSize, masterCubeSize, masterCubeSize);
		var c1 = new THREE.Vector3(square, masterCubeSize, masterCubeSize);
		var c2 = new THREE.Vector3(square, square, masterCubeSize);
		var c3 = new THREE.Vector3(masterCubeSize, square, masterCubeSize);

		var c4 = new THREE.Vector3(masterCubeSize, masterCubeSize, square);
		var c5 = new THREE.Vector3(masterCubeSize, masterCubeSize, masterCubeSize);
		var c6 = new THREE.Vector3(masterCubeSize, square, masterCubeSize);
		var c7 = new THREE.Vector3(masterCubeSize, square, square);

		var c8 = new THREE.Vector3(masterCubeSize, masterCubeSize, masterCubeSize);
		var c9 = new THREE.Vector3(masterCubeSize, masterCubeSize, square);
		var c10 = new THREE.Vector3(square, masterCubeSize, square);
		var c11 = new THREE.Vector3(square, masterCubeSize, masterCubeSize);

		geo.vertices.push(c0);
		geo.vertices.push(c1);
		geo.vertices.push(c2);
		geo.vertices.push(c3);

		geo.vertices.push(c4);
		geo.vertices.push(c5);
		geo.vertices.push(c6);
		geo.vertices.push(c7);

		geo.vertices.push(c8);
		geo.vertices.push(c9);
		geo.vertices.push(c10);
		geo.vertices.push(c11);

		geo.faces.push(new THREE.Face3(0, 1, 2));
		geo.faces.push(new THREE.Face3(0, 2, 3));

		geo.faces.push(new THREE.Face3(4, 5, 6));
		geo.faces.push(new THREE.Face3(4, 6, 7));

		geo.faces.push(new THREE.Face3(8, 9, 10));
		geo.faces.push(new THREE.Face3(8, 10, 11));

		geo.applyMatrix(new THREE.Matrix4().makeRotationX(rotationX));
		geo.applyMatrix(new THREE.Matrix4().makeRotationY(rotationY));

		geo.computeFaceNormals();
		geo.computeVertexNormals();

		material = new THREE.MeshBasicMaterial({
			overdraw: true,
			opacity: 0.0,
			color: 0x00afff,
			transparent: true
		});
		meshReturn = new THREE.Mesh(geo, material);
		return meshReturn;
	};

	var changeBasisWorldToStandard = function(V) {
		var worldD = cam.cubeFront.clone();
		var worldU = cam.sceneUpDirection.clone();
		var worldR = worldD.clone().cross(worldU);
		worldU.copy(worldR).cross(worldD);

		worldD.normalize();
		worldU.normalize();
		worldR.normalize();

		var answer = new THREE.Vector3(worldD.x, worldU.x, worldR.x).multiplyScalar(V.x);
		answer.add(new THREE.Vector3(worldD.y, worldU.y, worldR.y).multiplyScalar(V.y));
		answer.add(new THREE.Vector3(worldD.z, worldU.z, worldR.z).multiplyScalar(V.z));

		return answer;
	};

	/** Render the View Cube scenes and perform checks for control visibility **/
	this.render = function() {
		// switch view cube to match whatever camera.isPerspective says to use.
		self.camera = camera.isPerspective ? self.pcam : self.ocam;

		var scale = self.compass ? self.viewScaleFactorCompass * self.viewScale : self.viewScale;
		var viewDir = cam.center.clone().sub(camera.position).normalize();
		var upDir = camera.up.normalize();
		var spriteRotationMatrix = new THREE.Matrix4();

		viewDir = changeBasisWorldToStandard(viewDir);
		upDir = changeBasisWorldToStandard(upDir);

		self.camera.position.copy(viewDir);
		self.camera.position.multiplyScalar(-scale / self.camera.position.length());
		self.camera.up = upDir.normalize();
		self.camera.lookAt(self.center);

		checkControlVisibility();

		var renderer = self.renderer;
		if(renderer) {
			// Orient any sprites to face the camera
			for(var i = 0; i < sprites.length; i++) {
				spriteRotationMatrix.lookAt(self.camera.position, sprites[i].position, self.camera.up);
				sprites[i].setRotationFromMatrix(spriteRotationMatrix);
			}

			renderer.clear();
			// There are 3 scenes: the first is the shadow, then the cube with textures, then the grid is on top
			renderer.render(shadowScene, self.camera);
			renderer.render(cubeScene, self.camera);
			renderer.render(lineScene, self.camera);
			if(self.renderTriad) {
				renderer.render(triadScene, self.camera);
			}
			renderer.render(gridScene, self.camera);

			// Different camera since these shouldn't move with the View Cube
			renderer.render(controlScene, controlCamera);
		}
	};

	/**
	 * checks whether arrows (orthogonal and roll), drop down menus, and home button should be visible or not at
	 * this current time
	 */
	var checkControlVisibility = function() {
		// Arrow Visibility

		_orthogonalView = cam.isFaceView();

		(_orthogonalView && !_transparent && !cam.currentlyAnimating) ? showArrows(): hideArrows();

		// Menu Visibility
		_transparent ? hideContext() : showContext();

		// Home Visibility
		_transparent ? hideHome() : showHome();
	};

	/** Hide View Cube Arrows **/
	var hideArrows = function() {
		controlScene.remove(arrowGroup);

		controlBuffer[rollOffset].material.opacity = 0.0;
		controlBuffer[menuOffset].material.opacity = 0.0;
	};

	/** Show View Cube Arrows **/
	var showArrows = function() {
		controlScene.add(arrowGroup);

		var opacity = self.wantRollArrows ? 1.0 : 0.0;
		controlBuffer[rollOffset].material.opacity = opacity;
		controlBuffer[menuOffset].material.opacity = opacity;
	};

	/** Hide the view cube menu button **/
	var hideContext = function() {
		context.material.opacity = (zv.isMobileDevice()) ? 1.0 : 0.0;
	};

	/** Show the view cube menu button **/
	var showContext = function() {
		context.material.opacity = self.wantContextMenu ? 1.0 : 0.0;
	};

	/** Hide the home button **/
	var hideHome = function() {
		home.material.opacity = 0.0;
	};

	/** Show the home button **/
	var showHome = function() {
		home.material.opacity = self.wantHomeButton ? 1.0 : 0.0;
	};

	/* Public Methods */
	/** Update the View Cube camera to a new camera view
	 * @public
	 * @this ViewCube
	 * @param {int[]} eye - client provided camera position (in their world coordinates)
	 * @param {int[]} centre - client provided pivot point or centre (where the camera is looking at in their world coordinates)
	 * @param {int[]} upVector - client provided up vector
	 */

	/** Refresh height and width renderer sizes
	 * @public
	 * @this ViewCube
	 */
	this.refreshCube = function() {
		onWindowResize();
	};

	/** Set the size of the View Cube
	 * @public
	 * @this ViewCube
	 * @param {int} width - in pixels
	 * @param {int} height - in pixels
	 */
	this.setSize = function(width, height) {
		self.width = width;
		self.height = height;

		if(cubeContainer.children.length > 1) {
			for(var i = 1; i < cubeContainer.children.length; i++)
				cubeContainer.children[i].style.bottom = (self.height / 5).toString() + "px";
		}

		onWindowResize();
	};

	/** Option to turn on and off transparency on mouse out for the view cube
	 * @public
	 * @this ViewCube
	 * @param {boolean} transparent - true to use transparency, false to turn it off
	 */
	this.useTransparency = function(transparent) {
		_transparent = transparent;
		if(transparent) {
			cubeContainer.onmouseover = mouseOverCube;
			cubeContainer.onmousemove = mouseMoveOverCube;
			cubeContainer.onmouseout = mouseOutCube;
			mouseOutCube();
		} else {
			cubeContainer.onmouseover = null;
			cubeContainer.onmouseout = null;
			cubeContainer.onmousemove = null;
			cubeContainer.style.opacity = "1.0";
		}
	};

	this.showTriad = function(show) {
		if(show !== self.renderTriad) {
			self.renderTriad = show;
			requestAnimationFrame(self.render);
		}
	};

	this.dtor = function() {
		this.renderer = null;
	};

	/* Build the cube */
	Init();
};;
ZhiUTechNamespace('ZhiUTech.Viewing');

ZhiUTech.Viewing.KeyCode = {
	BACKSPACE: 8,
	TAB: 9,
	ENTER: 13,
	SHIFT: 16,
	CONTROL: 17,
	ALT: 18,
	ESCAPE: 27,
	SPACE: 32,
	PAGEUP: 33,
	PAGEDOWN: 34,
	END: 35,
	HOME: 36,
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	INSERT: 45,
	DELETE: 46,
	ZERO: 48,
	SEMICOLONMOZ: 59,
	EQUALSMOZ: 61,
	a: 65,
	b: 66,
	c: 67,
	d: 68,
	e: 69,
	f: 70,
	g: 71,
	h: 72,
	i: 73,
	j: 74,
	k: 75,
	l: 76,
	m: 77,
	n: 78,
	o: 79,
	p: 80,
	q: 81,
	r: 82,
	s: 83,
	t: 84,
	u: 85,
	v: 86,
	w: 87,
	x: 88,
	y: 89,
	z: 90,
	LCOMMAND: 91,
	RCOMMAND: 93,
	PLUS: 107,
	PLUSMOZ: 171,
	DASHMOZ: 109,
	F1: 112,
	F2: 113,
	F3: 114,
	F4: 115,
	F5: 116,
	F6: 117,
	F7: 118,
	F8: 119,
	F9: 120,
	F10: 121,
	F11: 122,
	F12: 123,
	DASHMOZNEW: 173,
	SEMICOLON: 186,
	EQUALS: 187,
	COMMA: 188,
	DASH: 189,
	PERIOD: 190,
	SLASH: 191,
	LBRACKET: 219,
	RBRACKET: 221,
	SINGLEQUOTE: 222,
	COMMANDMOZ: 224
};

/**
 * Core interface to add and remove canvas interactions to the viewer.
 *
 * This class is created internally by the Viewer api and is available via the "toolController" property
 * of the Viewer3D api object. Client implementations should not normally instantiate this class directly.
 * @param {Object} viewerImpl - The viewer implementation object.
 * @param {Object} viewerApi - The viewer api object.
 * @param {Object} autocam - The Autocam interface object.
 * @param {Object} utilities - The ViewingUtilities object.
 * @param {Object} defaultHandler - The default event handling tool.
 * @constructor
 * @see ZhiUTech.Viewing.Viewer3D
 * @category Core
 */
ZhiUTech.Viewing.ToolController = function(viewerImpl, viewerApi, autocam, utilities, defaultHandler) {
	var zv = ZhiUTech.Viewing;
	var zvp = ZhiUTech.Viewing.Private;

	this.domElement = viewerApi.canvasWrap;
	this.selector = viewerImpl.selector;
	this.autocam = autocam;
	this.lastClickX = -1;
	this.lastClickY = -1;
	this.scrollInputEnabled = true;

	var isMac = (navigator.userAgent.search("Mac OS") != -1);
	var isFirefox = (navigator.userAgent.search("Firefox") != -1);
	var isChrome = (navigator.userAgent.search("Chrome") !== -1);
	var isSafari = (navigator.userAgent.search("Safari") !== -1 && !isChrome); // Chrome has both Safari and Chrome in the string

	var kMouseLeft = 0;
	var kMouseRight = 2;

	var kClickThreshold = 2; // Pixels
	var kDoubleClickDelayThreshold = 500; // ms

	var _tools = {};
	var _toolStack = [];
	var _lock = false;
	var _downX = -1;
	var _downY = -1;

	var _firefoxLMBfix = false;
	var _currentCursor = null;
	var _lastTouchedElement = null;
	var _mouseEnabled = false;

	// Save click parameters when clicking with right mouse button
	// and "Left handed mouse setup" is enabled so that we can
	// simulate a double-click with the right mouse button.
	//
	var _checkMouseDoubleClick = {};

	var _this = this;

	var _keys = ZhiUTech.Viewing.KeyCode;

	this.__registerToolByName = function(tool, toolName) {
		_tools[toolName] = tool;
	};

	/**
	 * This method registers an event handling tool with the controller.
	 * This makes the tool available for activation and deactivation.
	 * Tools are registered under one or more names which must be provided via their "getNames" method.
	 * The tools "getNames" method must return an array of one or more names.
	 * Typically a tool will only have one name but if it wishes to operate in different modes it can use
	 * different names to activate the modes. Registered tools have the properties named
	 * "utilities" and "controller" added to them which refer to the ViewingUtilities object and this controller
	 * respectively. Tools may not use the name "default" which is reserved.
	 *  @param {object} tool - The tool to be registered.
	 */
	this.registerTool = function(tool) {
		var names = tool.getNames();

		if(!names || names.length == 0) {
			zvp.logger.warn("Cannot register tool with no name.");
			return false;
		}
		var registered = false;
		for(var i = 0; i < names.length; ++i) {
			if(names[i] !== "default") {
				this.__registerToolByName(tool, names[i]);
				registered = true;
			}
		}

		tool.utilities = utilities;
		tool.controller = this;
		if(tool.register) tool.register();

		return registered;
	};

	/**
	 * This method deregisters an event handling tool with the controller afterwhich it will no longer
	 * be available for activation and deactivation. All names that the tool is registered under
	 * will be deregistered. If any tool is active at the time of deregistration will first be deactivated
	 * and it's "deactivate" method will be called.
	 *  @param {object} tool - The tool to be deregistered.
	 */
	this.deregisterTool = function(tool) {
		this.deactivateTool(tool.getName());

		var names = tool.getNames();

		if(!names || names.length == 0) {
			return false;
		}
		for(var i = names.length; --i >= 0;)
			this.__deregisterToolName(names[i]);

		if(tool.deregister) tool.deregister();
		tool.utilities = null;
		tool.controller = null;
		return true;
	};

	this.__deregisterToolName = function(name) {
		function cleanStack(name) {
			for(var i = _toolStack.length; --i >= 0;)
				if(_toolStack[i].activeName === name) {
					_tools[name].deactivate(name);
					_toolStack.splice(i, 1);
				}
		}
		if(name in _tools) {
			cleanStack(name);
			delete _tools[name];
		}
	};

	/**
	 * This method returns the tool registered under the given name.
	 * @param {string} name - The tool name to look up.
	 * @returns {object} The tool registered under the given name or undefined if not found.
	 */
	this.getTool = function(name) {
		return _tools[name];
	};

	/**
	 * This method returns the name of the topmost tool on the tool stack.
	 * If no tools are active the name of the default tool is returned (which is "default").
	 * @returns {string} The tool name to look up.
	 */
	this.getActiveToolName = function() {
		var l = _toolStack.length;
		return(l > 0) ? _toolStack[l - 1].activeName : "default";
	};

	/**
	 * This method returns the name of the topmost tool on the tool stack.
	 * If no tools are active the name of the default tool is returned (which is "default").
	 * @returns {string} The tool name to look up.
	 */
	this.getActiveTool = function() {
		var l = _toolStack.length;
		return(l > 0) ? _toolStack[l - 1] : _tools["default"];
	};

	this.isToolActivated = function(toolName) {
		for(var i = 0; i < _toolStack.length; i++) {

			if(_toolStack[i].activeName === toolName) {
				return true;
			}
		}
		return false;
	};

	this.setToolActiveName = function(toolName) {
		var tool = _tools[toolName];
		if(tool) {
			tool.activeName = toolName;
		}
	};

	function getPriority(tool) {
		return((tool.getPriority instanceof Function) && tool.getPriority()) || 0;
	}

	/**
	 * Activates the tool registered under the given name. Activation implies pushing the tool
	 * on a stack of "active" tools, each of which (starting from the top of the stack) is given
	 * the opportunity to handle incoming events. Tools may "consume" events by returning true
	 * from their event handling methods, or they may allow events to be passed down to the next tool
	 * on the stack by returning false from the handling methods.
	 * Upon activation the tools "activate" method is called with the name under which it has been activated.
	 * Activation is not allowed while the controller is in a "locked" state (see the methods "setIsLocked"
	 * and "getIsLocked"). Tools must be registered prior to activation (see the methods "registerTool"
	 * and "deregisterTool").
	 * Each tool has its own priority property (default 0), such that a tool with higher priority will get events first. 
	 * @param {string} toolName - The name of the tool to be activated.
	 * @returns {boolean} True if activation was successful.
	 */
	this.activateTool = function(toolName) {
		if(_lock)
			return false;

		var tool = _tools[toolName];
		if(tool) {
			if(tool.count === undefined)
				tool.count = 0;

			var interceptor = null;
			if(_toolStack.length && _toolStack[_toolStack.length - 1].activeName === "intercept") {
				interceptor = _toolStack.pop();
			}

			var indexToPush = 0;

			for(var i = 0; i < _toolStack.length; i++) {

				if(_toolStack[i] === tool) {
					tool.count++;
				}

				if(getPriority(_toolStack[i]) <= getPriority(tool)) {
					indexToPush = i + 1;
				}
			}

			tool.activeName = toolName;

			// If the tool belongs to a same instance in tool stack, then don't push it into stack.
			if(tool.count === 0) {
				tool.count++;
				_toolStack.splice(indexToPush, 0, tool);
			}

			tool.activate(toolName, viewerApi);
			if(interceptor) {
				_toolStack.push(interceptor);
			}

			viewerApi.dispatchEvent({
				type: ZhiUTech.Viewing.TOOL_CHANGE_EVENT,
				toolName: toolName,
				tool: tool,
				active: true
			});
			return true;
		}
		zvp.logger.warn("activateTool not found: " + toolName);
		return false;
	};

	/**
	 * The first tool found on the active stack with the given name is removed and its "deactivate" method
	 * is called. Once deactivated the tool will no longer receive events via its handler methods.
	 * Deactivation is not allowed while the controller is in a "locked" state (see the methods "setIsLocked"
	 * and "getIsLocked").
	 * @param {string} toolName - The name of the tool to be deactivated.
	 * @returns {boolean} True if deactivation was successful.
	 */
	this.deactivateTool = function(toolName) {
		if(_lock)
			return false;

		for(var i = _toolStack.length; --i >= 0;) {
			if(_toolStack[i].activeName === toolName) {
				if(_tools[toolName].count === 1)
					_toolStack.splice(i, 1);

				_tools[toolName].count--;

				_tools[toolName].deactivate(toolName);

				viewerApi.dispatchEvent({
					type: ZhiUTech.Viewing.TOOL_CHANGE_EVENT,
					toolName: toolName,
					tool: _toolStack[i],
					active: false
				});

				return true;
			}
		}
		zvp.logger.warn("deactivateTool not found: " + toolName);
		return false;
	};

	/**
	 * Obtain a list of all the currently registered tool names.
	 * @returns {array} List of all registered tool names.
	 */
	this.getToolNames = function() {
		return Object.keys(_tools);
	};

	/**
	 * Set the tool which will be requested to handle events if no other active tool handles them.
	 * @param {object} tool - The tool to be registered as the default.
	 */
	this.setDefaultTool = function(tool) {
		var current = this.getDefaultTool();
		if(tool && tool !== current) {
			this.__registerToolByName(tool, "default");
			if(current)
				current.deactivate("default");
			tool.activate("default");
			return true;
		}
		return false;
	};

	/**
	 * Get the tool which handle events if no other active tool handles them.
	 * @returns {object} The tool to be registered as the default.
	 */
	this.getDefaultTool = function() {
		return _tools["default"];
	};

	this.setDefaultTool(defaultHandler);

	/**
	 * Set the controller into a locked or unlocked state. While locked, tool activation and deactivation
	 * is not allowed. Locking the controller is sometimes necessary to force an interaction to remain
	 * active until it is fully completed.
	 * @param {boolean} state - The state of the controller lock.
	 * @returns {boolean} The previous state of the lock (this may be used to restore the lock
	 * to it's previous state).
	 */
	this.setIsLocked = function(state) {
		var prev = _lock;
		_lock = !!state;
		return prev;
	};

	/**
	 * Get the current state of the controller lock.
	 * @returns {boolean} The state of the lock.
	 */
	this.getIsLocked = function() {
		return _lock;
	};

	this.__checkCursor = function() {
		var cursor = null;
		for(var n = _toolStack.length; --n >= 0;) {
			var tool = _toolStack[n];
			if(tool.getCursor) {
				cursor = tool.getCursor();
				if(cursor)
					break;
			}
		}
		if(!cursor)
			cursor = "auto";

		if(_currentCursor != cursor) {
			viewerApi.canvas.style.cursor = cursor;
			_currentCursor = cursor;
		}
	};

	this.update = function(highResTimestamp) {
		this.__checkCursor();

		var refresh = false;

		if(utilities && utilities.update())
			refresh = true;

		for(var n = _toolStack.length; --n >= 0;) {
			var tool = _toolStack[n];
			if(tool.update && tool.update(highResTimestamp))
				refresh = true;
		}
		if(viewerApi.navigation.getCamera().dirty) {
			viewerApi.navigation.updateCamera();
			refresh = true;
			this.cameraUpdated = true;
		} else {
			this.cameraUpdated = false;
		}

		//Delay reporting stationary
		if(refresh) {
			viewerApi.navigation.updateCamera();
			this.moveDelay = Date.now() + 150; // Milliseconds
		} else if(this.moveDelay !== 0) {
			var delta = this.moveDelay - Date.now();
			if(delta > 0)
				refresh = true;
			else
				this.moveDelay = 0;
		}
		return refresh;
	};

	// ------------------------
	// Event handler callbacks:
	// These can use "this".

	this.__clientToCanvasCoords = function(event, normalized, screen) {
		var rect = viewerImpl.getCanvasBoundingClientRect();
		var width = rect.width;
		var height = rect.height;

		// Canvas coordinates: relative to the canvas element.
		// 0 = top left, +ve right and down.
		//
		var canvasX = event.clientX - rect.left;
		var canvasY = event.clientY - rect.top;
		event.canvasX = canvasX;
		event.canvasY = canvasY;

		// Normalized coordinates: [-1, +1].
		// 0 = center, +ve = right and up.
		//
		event.normalizedX = (canvasX / width) * 2.0 - 1.0;
		event.normalizedY = ((height - canvasY) / height) * 2.0 - 1.0;

		// Vector: [0, 1].
		// 0 = top left, +ve right and down.
		//
		if(normalized)
			normalized.set(canvasX / width, canvasY / height, 0.0);

		if(screen)
			screen.set(canvasX, canvasY);
	};

	this.__invokeStack = function(method, arg1, arg2) {
		for(var n = _toolStack.length; --n >= 0;) {
			var tool = _toolStack[n];

			if(tool[method] && tool[method](arg1, arg2)) {
				//zvp.logger.log(method + " consumed by " + tool.getName() + " = " + arg1.type);
				return true;
			}
		}
		var last = this.getDefaultTool();
		if(last[method] && last[method](arg1, arg2)) {
			//zvp.logger.log(method + " consumed by " + last.getName() + " = " + arg1.type);
			return true;
		}
		return false;
	};

	this.distributeEvent = function(methodName, arg1, arg2) {
		return this.__invokeStack(methodName, arg1, arg2);
	};

	this.handleResize = function() {
		viewerApi.navigation.setScreenViewport(viewerApi.container.getBoundingClientRect());

		// Call handleResize on all tools in case they need it:
		for(var n = _toolStack.length; --n >= 0;) {
			var tool = _toolStack[n];

			if(tool.handleResize)
				tool.handleResize();
		}
	};

	this.handleSingleClick = function(event) {
		var button = this.applyButtonMappings(event);
		this.lastClickX = event.clientX;
		this.lastClickY = event.clientY;

		if(this.__invokeStack("handleSingleClick", event, button)) {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	this.handleDoubleClick = function(event) {
		var button = this.applyButtonMappings(event);

		if(this.__invokeStack("handleDoubleClick", event, button)) {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	this.handleSingleTap = function(event) {
		this.lastClickX = event.canvasX;
		this.lastClickY = event.canvasY;

		if(this.__invokeStack("handleSingleTap", event)) {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	this.handleDoubleTap = function(event) {
		this.lastClickX = event.canvasX;
		this.lastClickY = event.canvasY;

		if(this.__invokeStack("handleDoubleTap", event)) {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	this.handleWheelInput = function(delta, event) {
		if(this.__invokeStack("handleWheelInput", delta)) {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	this.applyButtonMappings = function(event) {
		var button = event.button;

		// Check for Firefox spoof: Control+LMB converted to RMB.
		// The "buttons" property in Firefox will include 1 for LMB and 2 for RMB.
		if("buttons" in event) {
			// This method sometimes gets called more than once with
			// the same event:
			if(event.firefoxSpoof) {
				button = kMouseLeft;
			}
			// For button down the 1 bit will be on indicating LMB.
			// For button up it's off so check the flag to see if we
			// switched the down event.
			else if(_firefoxLMBfix && !(event.buttons & 1)) // Button up?
			{
				event.firefoxSpoof = true;
				_firefoxLMBfix = false;
				button = kMouseLeft;
			} else if((button === kMouseRight) && (event.buttons & 1)) {
				button = kMouseLeft; // Convert back to reality.
				event.firefoxSpoof = _firefoxLMBfix = true;
			}
		}
		if(viewerApi.navigation.getUseLeftHandedInput()) {
			button = (button === kMouseLeft) ? kMouseRight :
				(button === kMouseRight) ? kMouseLeft : button;
		}
		return button;
	};

	this.applyKeyMappings = function(event, state) {
		switch(event.keyCode) {
			case _keys.LCOMMAND:
			case _keys.RCOMMAND:
			case _keys.COMMANDMOZ:
				// Most likely is a Mac but check anyway.
				// We need to ignore Command + Shift combo:
				return(isMac && event.metaKey && event.shiftKey) ? null : _keys.CONTROL;

			case _keys.SHIFT:
				// We need to ignore Command + Shift combo:
				return(state && isMac && event.metaKey) ? null : _keys.SHIFT;

			case _keys.EQUALSMOZ:
				return _keys.EQUALS;

			case _keys.DASHMOZNEW:
			case _keys.DASHMOZ:
				return _keys.DASH;
		}
		return event.keyCode;
	};

	this.handleKeyDown = function(event) {
		var keyCode = this.applyKeyMappings(event, true);

		if(keyCode && this.__invokeStack("handleKeyDown", event, keyCode)) {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	this.handleKeyUp = function(event) {
		var keyCode = this.applyKeyMappings(event, true);

		if(keyCode && this.__invokeStack("handleKeyUp", event, keyCode)) {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	this.handleButtonDown = function(event, button) {
		if(this.__invokeStack("handleButtonDown", event, button)) {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	this.handleButtonUp = function(event, button) {
		if(this.__invokeStack("handleButtonUp", event, button)) {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	this.handleMouseMove = function(event) {
		if(this.__invokeStack("handleMouseMove", event)) {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	this.handleBlur = function(event) {
		if(this.__invokeStack("handleBlur", event)) {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	// ====================================================
	// Event handlers: (only use "_this" in these methods):

	this.keydown = function(event) {
		if(_lastTouchedElement && !_this.domElement.contains(_lastTouchedElement)) {
			return;
		}
		if(document.activeElement instanceof HTMLInputElement ||
			document.activeElement instanceof HTMLTextAreaElement ||
			document.activeElement instanceof HTMLSelectElement) {
			return;
		}

		// Support for HTML5 editable divs
		if(document.activeElement) {
			var divIsEditable = document.activeElement.getAttribute('contenteditable');
			if(divIsEditable === 'true' || divIsEditable === '') {
				// TODO: Proper handle of value 'inherit'
				return;
			}
		}

		// Ignore command key shortcuts on the mac.
		// We don't seem to get key up events for these keys.
		if(isMac && event.metaKey && (event.keyCode != _keys.LCOMMAND) && (event.keyCode != _keys.RCOMMAND)) {
			return;
		}

		_this.handleKeyDown(event);
	};

	this.keyup = function(event) {
		if(isMac && event.metaKey && (event.keyCode != _keys.LCOMMAND) && (event.keyCode != _keys.RCOMMAND))
			return;

		_this.handleKeyUp(event);
	};

	function shouldCheckDoubleClick(button, event) {
		return(viewerApi.navigation.getUseLeftHandedInput() && button === 0) || (isFirefox && button === 1) ||
			(isMac && !isSafari && button === 0 && event.ctrlKey);
	}

	this.mousedown = function(event) {
		// Don't do blur in full screen (IE issue)
		if(!(zv.isIE11 && zv.inFullscreen())) {
			document.activeElement && document.activeElement.blur && document.activeElement.blur();
		}

		_this.__clientToCanvasCoords(event);

		var buttonDown = _this.applyButtonMappings(event);
		_this.handleButtonDown(event, buttonDown);

		_downX = event.canvasX;
		_downY = event.canvasY;

		if(shouldCheckDoubleClick(buttonDown, event)) {
			var cmdc = _checkMouseDoubleClick;

			var delayOK = ((cmdc.time !== undefined) &&
				((event.timeStamp - cmdc.time) < kDoubleClickDelayThreshold));

			var positionOK = ((cmdc.x !== undefined && cmdc.y !== undefined) &&
				(Math.abs(cmdc.x - event.canvasX) <= kClickThreshold) &&
				(Math.abs(cmdc.y - event.canvasY) <= kClickThreshold));

			if(!delayOK || !positionOK || (cmdc.clickCount && 2 <= cmdc.clickCount)) {
				cmdc.clickCount = 0;
			}

			if(!cmdc.clickCount) {
				cmdc.clickCount = 1;
				cmdc.x = event.canvasX;
				cmdc.y = event.canvasY;
				cmdc.time = event.timeStamp;

			} else if(cmdc.clickCount === 1) {
				cmdc.clickCount = 2;
			}
		}

		function handleUp(event) {
			var buttonUp = _this.applyButtonMappings(event);
			if(buttonUp === buttonDown) {
				document.removeEventListener('mouseup', handleUp);
				_this.mouseup(event);
			}
		}

		document.addEventListener('mouseup', handleUp, false);

		_this.registerWindowMouseMove();
	};

	this.mousemove = function(event) {
		_this.__clientToCanvasCoords(event);

		var deltaX = _downX - event.canvasX;
		var deltaY = _downY - event.canvasY;
		if(Math.abs(deltaX) > kClickThreshold || Math.abs(deltaY) > kClickThreshold) {
			_downX = -1;
			_downY = -1;
		}
		_this.handleMouseMove(event);
	};

	this.mouseup = function(event) {
		_this.__clientToCanvasCoords(event);

		var buttonUp = _this.applyButtonMappings(event);
		_this.handleButtonUp(event, buttonUp);

		var deltaX = _downX - event.canvasX;
		var deltaY = _downY - event.canvasY;

		_downX = -1;
		_downY = -1;

		if(Math.abs(deltaX) <= kClickThreshold && Math.abs(deltaY) <= kClickThreshold)
			_this.handleSingleClick(event);

		if(shouldCheckDoubleClick(buttonUp, event)) {
			var cmdc = _checkMouseDoubleClick;
			if(cmdc.clickCount === 2) {
				_this.handleDoubleClick(event);

				cmdc.clickCount = 0;
				cmdc.x = undefined;
				cmdc.y = undefined;
				cmdc.time = undefined;
			}
		}

		_this.unregisterWindowMouseMove();
	};

	this.doubleclick = function(event) {
		_this.__clientToCanvasCoords(event);

		_downX = event.canvasX;
		_downY = event.canvasY;

		_this.handleDoubleClick(event);
	};

	this.mousewheel = function(event) {
		if(!_this.scrollInputEnabled) {
			return;
		}

		var delta = 0;

		if(event.wheelDelta) { // WebKit / Opera / Explorer 9
			delta = event.wheelDelta / 40;
		} else if(event.detail) { // Firefox
			delta = -event.detail;
		} else if(event.deltaY) { // Firefox / Explorer + event target is SVG.
			var factor = isFirefox ? 1 : 40;
			delta = -event.deltaY / factor;
		}

		_this.handleWheelInput(delta, event);
	};

	this.blur = function(event) {
		_this.handleBlur(event);
	};

	// ??? this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.mouseover = function(e) {
		_lastTouchedElement = e.target;
		// ??? if (_lastTouchedElement != viewerImpl.canvas) _this.autoMove(-1, false)
	};

	// to maintain drag continuity outside the canvas element
	// move mousemove/over listeners from canvas to window
	this.registerWindowMouseMove = function() {
		window.addEventListener('mousemove', _this.mousemove);
		window.addEventListener('mouseover', _this.mouseover);
		_this.domElement.removeEventListener('mousemove', _this.mousemove);
		_this.domElement.removeEventListener('mouseover', _this.mouseover);
	};

	this.unregisterWindowMouseMove = function() {
		window.removeEventListener('mousemove', _this.mousemove);
		window.removeEventListener('mouseover', _this.mouseover);
		_this.domElement.addEventListener('mousemove', _this.mousemove);
		_this.domElement.addEventListener('mouseover', _this.mouseover);
	};

	this.enableMouseButtons = function(state) {
		if(state && !_mouseEnabled) {
			this.domElement.addEventListener('mousedown', this.mousedown);
			this.domElement.addEventListener('dblclick', this.doubleclick);
			this.domElement.addEventListener('mousemove', this.mousemove);
			this.domElement.addEventListener('mouseover', this.mouseover);
		} else if(!state && _mouseEnabled) {
			this.domElement.removeEventListener('mousedown', this.mousedown);
			this.domElement.removeEventListener('dblclick', this.doubleclick);
			this.domElement.removeEventListener('mousemove', this.mousemove);
			this.domElement.removeEventListener('mouseover', this.mouseover);
		}
		var returnValue = _mouseEnabled;
		_mouseEnabled = state;

		return returnValue;
	};

	// If we want to continue listenting to mouse movements outside of the window
	// we need to tie our event listener to the window

	this.domElement.addEventListener('mousewheel', this.mousewheel, false);
	this.domElement.addEventListener('DOMMouseScroll', this.mousewheel, false); // firefox

	//** this.domElement.addEventListener( 'touchstart', function( event ) { _this.touchstart( event )}, false );
	//** this.domElement.addEventListener( 'touchmove', function( event ) { _this.touchmove( event )}, false );

	window.addEventListener('keydown', this.keydown, false);
	window.addEventListener('keyup', this.keyup, false);
	window.addEventListener('blur', this.blur, false);

	this.uninitialize = function() {
		if(_mouseEnabled) {
			// remove them all just to be sure, doesn't hurt
			this.domElement.removeEventListener('mousemove', this.mousemove);
			this.domElement.removeEventListener('mouseover', this.mouseover);
			window.removeEventListener('mousemove', _this.mousemove);
			window.removeEventListener('mouseover', _this.mouseover);
		}
		window.removeEventListener('keydown', this.keydown);
		window.removeEventListener('keyup', this.keyup);
		window.removeEventListener('blur', this.blur);

		this.domElement = null;
		this.selector = null;
		this.autocam = null;
		// Deactivate all active tools
		while(_toolStack.length > 0)
			this.deactivateTool(_toolStack[_toolStack.length - 1].activeName);
		_tools = null;
		_toolStack = null;
		_this = null;
		utilities = null;
		viewerApi = null;
		viewerImpl = null;
		_lastTouchedElement = null;
	};

	// Compatibility methods. TODO: eliminate these
	this.set2DMode = function(state) {};
	this.setAutocam = function(autocam) {};
	this.syncCamera = function() {};

	// TODO: implement this in navapi - then set autocam home from navapi values
	this.recordHomeView = function() {
		var camera = viewerApi.navigation.getCamera();
		autocam.sync(camera);
		autocam.setHomeViewFrom(camera);
	};

	/**
	 * Whether mouse scroll wheel (and/or two-finger vertical swipe) will trigger a camera zoom operation.
	 * @param {boolean} isEnabled
	 */
	this.setMouseWheelInputEnabled = function(isEnabled) {
		this.scrollInputEnabled = isEnabled;
	};
};;
ZhiUTechNamespace('ZhiUTech.Viewing');

/**
 * Variety of utilities convenient to navigation and tool development.
 *
 * This class is instantiated internally and made available to all registered interaction tools
 * via their "utilities" property.
 * @see {@link ZhiUTech.Viewing.ToolController}
 * @param {object} viewerImpl - The viewer implementation object.
 * @param {object} autocam - The Autocam interface object.
 * @param {object} navigation - The Navigation interface object.
 * @constructor
 * @category Core
 */
ZhiUTech.Viewing.ViewingUtilities = function(viewerImplIn, autocam, navapi) {
	this.autocam = autocam;
	this.viewerImpl = viewerImplIn;

	var kIndicatorPixelSize = 5; // Pixels
	var _camera = navapi.getCamera();
	var _savePivot = {};
	var _savePivotSet = {};

	function PivotIndicator(viewerImpl) {
		var kFadeTimeMilliseconds = 500;
		var kIndicatorColor = 0x007F00;
		var kIndicatorOpacity = 0.6;

		var myFadeTime = 0;
		var myGeometry = new THREE.SphereGeometry(1.0);
		var myMaterial = new THREE.MeshPhongMaterial({
			color: kIndicatorColor,
			ambient: kIndicatorColor,
			opacity: kIndicatorOpacity,
			transparent: true
		});
		var myMesh = new THREE.Mesh(myGeometry, myMaterial);
		var myViewerImpl = viewerImpl;
		var myPivotScale = 1.0;

		myViewerImpl.createOverlayScene("pivot");
		myMesh.visible = false;

		this.shown = function() {
			return myMesh.visible;
		};

		this.show = function(position, scale, fade) {
			myMesh.scale.x = scale * myPivotScale;
			myMesh.scale.y = scale * myPivotScale;
			myMesh.scale.z = scale * myPivotScale;

			myMesh.position.set(position.x, position.y, position.z);
			myMaterial.opacity = kIndicatorOpacity;

			myMesh.visible = true;
			myViewerImpl.addOverlay("pivot", myMesh);
			myViewerImpl.invalidate(false, false, true);

			if(fade) {
				myFadeTime = Date.now() + kFadeTimeMilliseconds;
			} else
				myFadeTime = 0;
		};

		this.hide = function() {
			if(myMesh.visible) {
				myMesh.visible = false;
				myViewerImpl.removeOverlay("pivot", myMesh);
				myViewerImpl.invalidate(false, false, true);
				myFadeTime = 0;
			}
		};

		this.fade = function() {
			if(myFadeTime > 0) {
				var fadeDelta = myFadeTime - Date.now();

				if(fadeDelta <= 0) {
					this.hide();
					return true;
				}
				var opacity = (fadeDelta / kFadeTimeMilliseconds) * kIndicatorOpacity;
				myMaterial.opacity = opacity;
				return true;
			}
			return false;
		};

		this.fading = function() {
			return(myFadeTime > 0);
		};

		/**
		 * Changes the pivot graphic size.
		 * Set default size with scale value of 1.
		 */
		this.setSize = function(scale) {
			myPivotScale = scale;
		};

		/**
		 * Change Pivot color.
		 * Example, red is 0xFF0000 
		 */
		this.setColor = function(color, opacity) {
			myMaterial.color = new THREE.Color(color);

			// opacity is optional
			if(opacity !== undefined) {
				kIndicatorOpacity = opacity;
				myMaterial.opacity = kIndicatorOpacity;
			}
		};
	}

	var _pivotIndicator = new PivotIndicator(this.viewerImpl);

	function computeOrthogonalUp(pos, coi, worldUp) {
		var eye = coi.clone().sub(pos);
		if(eye.lengthSq() === 0.0) // Invalid view?
			return eye.copy(worldUp);

		var right = eye.clone().cross(worldUp);
		if(right.lengthSq() === 0) {
			// If eye and up are colinear, perturb eye
			// to get a valid result:
			if(worldUp.z > worldUp.y)
				eye.y -= 0.0001;
			else
				eye.z -= 0.0001;

			right.crossVectors(eye, worldUp);
		}
		return right.cross(eye).normalize();
	}

	/**
	 * This method triggers a camera view transition as specified by the parameters.
	 *  @param {THREE.Vector3} pos - The new world space position of the camera.
	 *  @param {THREE.Vector3} coi - The new center of interest (look at point).
	 *  @param {number} fov - The new field of view for the camera in degrees.
	 *  @param {THREE.Vector3} up - The new camera up direction.
	 *  @param {THREE.Vector3} worldUp - The new world up direction.
	 *  @param {boolean} reorient - If true the given camera up parameter is ignored
	 *  and a new up direction will be calculated to be aligned with the given world up direction.
	 *  @param {THREE.Vector3} pivot - The new pivot point.
	 */
	this.transitionView = function(pos, coi, fov, up, worldUp, reorient, pivot) {
		worldUp = worldUp || navapi.getWorldUpVector();

		var upVec = reorient ? computeOrthogonalUp(pos, coi, worldUp) : up;
		if(!upVec)
			upVec = _camera.up;

		pivot = pivot || coi;

		var targetView = {
			position: pos,
			center: coi,
			pivot: pivot,
			fov: fov,
			up: upVec,
			worldUp: worldUp,
			isOrtho: (_camera.isPerspective === false)
		};
		autocam.goToView(targetView);
	};

	/**
	 * This method triggers a camera view transition to the registered home view for the current scene.
	 */
	this.goHome = function() {
		this.viewerImpl.track({
			name: 'navigation/home',
			aggregate: 'count'
		});
		autocam.goHome();
	};

	/**
	 * This method performs a hit test with the current model using a ray cast from the given screen coordinates.
	 *  @param {number} x - The normalized screen x coordinate in [0, 1].
	 *  @param {number} y - The normalized screen y coordinate in [0, 1].
	 *  @returns {THREE.Vector3} The world space hit position or null if no object was hit.
	 */
	this.getHitPoint = function(x, y) {
		y = 1.0 - y; // Invert Y so 0 == bottom.

		// Map to [-1, 1]
		x = x * 2.0 - 1.0;
		y = y * 2.0 - 1.0;

		var vpVec = new THREE.Vector3(x, y, 1);

		var result = this.viewerImpl.hitTestViewport(vpVec, false);
		return result ? result.intersectPoint : null;
	};

	/**
	 * This method activates the in scene pivot indicator.
	 * The pivot is positioned at the current camera's pivot point.
	 * @param {boolean} fadeIt - If true the indicator will be displayed and then fade away after a short period.
	 * @see {@link ZhiUTech.Viewing.Navigation}
	 */
	this.activatePivot = function(fadeIt) {
		// Only show pivot for 3D models
		if(!this.viewerImpl.model || this.viewerImpl.model.is2d())
			return;

		var distance = _camera.isPerspective ? navapi.getPivotPlaneDistance() :
			navapi.getEyeVector().length();
		var fov = navapi.getVerticalFov();
		var worldHeight = 2.0 * distance * Math.tan(THREE.Math.degToRad(fov * 0.5));

		var viewport = navapi.getScreenViewport();
		var devicePixelRatio = window.devicePixelRatio || 1;
		var indicatorSize = kIndicatorPixelSize * worldHeight / (viewport.height * devicePixelRatio);

		_pivotIndicator.show(navapi.getPivotPoint(), indicatorSize, fadeIt);
	};

	/**
	 * This method changes the display state of the in scene pivot indicator.
	 * If the current scene is 2D this method has no effect.
	 * @param {boolean} state - The requested display state for the indicator.
	 * @param {boolean} fadeIt - If true and "state" is also true, the indicator will be displayed
	 * and then fade away after a short period.
	 * @see {@link ZhiUTech.Viewing.Navigation}
	 */
	this.pivotActive = function(state, fadeIt) {
		state = state && !navapi.getIs2D(); // Currently disabled in 2D mode.

		fadeIt = fadeIt || false;

		if(!state && _pivotIndicator.shown()) {
			_pivotIndicator.hide();
			return;
		}
		if(state)
			this.activatePivot(fadeIt);
	};

	/**
	 * Invoke this method to refresh the pivot indicator and continue its fading action if required.
	 */
	this.pivotUpdate = function() {
		if(_pivotIndicator.shown() && _pivotIndicator.fade())
			this.viewerImpl.invalidate(false, false, true);
	};

	/**
	 * Set the current pivot point and pivot set flag.
	 * If the pivot indicator is active its position will be updated accordingly. If a temporary pivot was previously applied, its saved state will be cleared.
	 * @param {THREE.Vector3} newPivot - The world space position of the new pivot point.
	 * @param {boolean} preserveView - If false the camera's view direction will change
	 * to look at the new pivot point. If true the camera's view will not be changed.
	 * @param {boolean} isset - The new state of the pivot set flag.
	 * @see {@link ZhiUTech.Viewing.Navigation}
	 */
	this.setPivotPoint = function(newPivot, preserveView, isset) {
		navapi.setPivotPoint(newPivot);

		if(!preserveView)
			navapi.setTarget(newPivot);

		if(isset)
			navapi.setPivotSetFlag(true);

		this.setTemporaryPivot(null);

		// Disallow showing the pivot when in 2D.
		if(navapi.getIs2D())
			return;

		if(_pivotIndicator.shown()) // The pivot indicator location may need updating:
			this.activatePivot(_pivotIndicator.fading());
	};

	/**
	 * Save a copy of the current pivot point and pivot set flag.
	 * @param {string} name - Optional unique name of the saved location.
	 */
	this.savePivot = function(name) {
		if(!name)
			name = "default";

		_savePivot[name] = navapi.getPivotPoint();
		_savePivotSet[name] = navapi.getPivotSetFlag();
	};

	/**
	 * Restore the saved copy of the current pivot point and pivot set flag.
	 * Once restored the saved value is erased.
	 * @param {string} name - Optional unique name of the saved location.
	 */
	this.restorePivot = function(name) {
		if(!name)
			name = "default";

		if(_savePivot[name]) {
			var set = _savePivotSet[name]; // Get value before calling setPivotPoint
			this.setPivotPoint(_savePivot[name], true, set);
			if(!set) {
				// Force the flag off, setPivotPoint only turns it on.
				navapi.setPivotSetFlag(false);
			}
			delete(_savePivot[name]);
			delete(_savePivotSet[name]);
		}
	};

	/**
	 * Allows the caller to save the current pivot and replace it with a new location.
	 * If while the temporary pivot is active a new pivot is set via the setPivotPoint method,
	 * the saved pivot will be cleared to avoid restoring an out of date pivot location.
	 * @param {THREE.Vector3} newPivot - The new pivot to be assigned or null to clear any previously saved pivot.
	 */
	this.setTemporaryPivot = function(newPivot) {
		if(newPivot) {
			var pivot = navapi.getPivotPoint();
			var pivotSet = navapi.getPivotSetFlag();

			this.setPivotPoint(newPivot, true, pivotSet);

			_savePivot["TEMP"] = pivot;
			_savePivotSet["TEMP"] = pivotSet;
		} else {
			delete(_savePivot["TEMP"]);
			delete(_savePivotSet["TEMP"]);
		}
	};

	/**
	 * Restore a pivot value that was saved by a call to setTemporary Pivot.
	 */
	this.removeTemporaryPivot = function() {
		this.restorePivot("TEMP");
	};

	/**
	 * Changes the pivot graphic size.
	 * @param {Number} scale - Default size value is 1
	 */
	this.setPivotSize = function(scale) {
		_pivotIndicator.setSize(scale);
	};

	/**
	 * Change pivot color and opacity.
	 * Example, to get red 100% solid (non-transparent) use setPivotColor(0xFF0000, 1)
	 * @param {Number} color - RBG Hex color.
	 * @param {Number} [opacity] - Opacity value from 0 (transparent) to 1 (opaque).
	 */
	this.setPivotColor = function(color, opacity) {
		_pivotIndicator.setColor(color, opacity);
	};

	/**
	 * Return the bounding box of the current model or model selection.
	 * @param {boolean} ignoreSelection - If true the current selection is ignored and the model bounds is returned.
	 * @returns {THREE.Box3}
	 */
	this.getBoundingBox = function(ignoreSelection) {
		return this.viewerImpl.getFitBounds(ignoreSelection);
	};

	/**
	 * Request a camera transition to fit the current model or model selection into the view frustum.
	 * @param {boolean} immediate - If true the transition will be immediate,
	 * otherwise animated over a short time period.
	 * @returns {object} - Fit positioning information with properties "position" and "target".
	 */
	this.fitToView = function(immediate) {
		this.viewerImpl.track({
			name: 'navigation/fit',
			aggregate: 'count'
		});
		this.viewerImpl.fitToView(this.viewerImpl.selector.getAggregateSelection(), immediate);
		this.activatePivot(true);
	};

	this.update = function() {
		if(navapi.getRequestFitToView() && !navapi.getTransitionActive()) {
			navapi.setRequestFitToView(false);
			this.fitToView();
		}
		if(navapi.getRequestHomeView() && !navapi.getTransitionActive()) {
			navapi.setRequestHomeView(false);
			this.goHome();
		}
		var request = navapi.getRequestTransition();
		if(request && !navapi.getTransitionActive()) {
			navapi.setRequestTransition(false);
			this.transitionView(request.position, request.coi, request.fov, request.up, request.worldUp, request.reorient, request.pivot);
		}
		return false;
	};
};;
ZhiUTechNamespace('ZhiUTech.Viewing');
//
// This object handles the default click behaviour, some of which is controlled
// via the "setClickBehavior" configuration.
//
ZhiUTech.Viewing.DefaultHandler = function(viewerImpl, navapi, utilities) {
	this.clickConfig = null;

	this.getNames = function() {
		return ["default"];
	};

	this.getName = function() {
		return this.getNames()[0];
	};

	this.setClickBehavior = function(config) {
		this.clickConfig = config;
	};

	this.getClickBehavior = function() {
		return this.clickConfig;
	};

	this.activate = function(name) {};
	this.deactivate = function(name) {};

	this.handleAction = function(actionArray, rayData) {
		for(var i = 0; i < actionArray.length; ++i) {
			switch(actionArray[i]) {
				case "selectOnly":
					if(viewerImpl.selector) {
						if(rayData) {
							viewerImpl.selector.setSelection([rayData.dbId], rayData.model);
						}
					}
					break;
				case "deselectAll":
					if(viewerImpl.selector) {
						viewerImpl.selector.setSelection([]);
					}
					break;
				case "selectToggle":
					if(viewerImpl.selector) {
						if(rayData) {
							viewerImpl.selector.toggleSelection(rayData.dbId, rayData.model);
						}
					}
					break;
				case "isolate":
					if(rayData) {
						viewerImpl.isolate(rayData.dbId);
					}
					break;
				case "showAll":
					viewerImpl.showAll();
					break;
				case "setCOI":
					if(rayData && rayData.intersectPoint) {
						utilities.setPivotPoint(rayData.intersectPoint, true, true);
						utilities.pivotActive(true, true);
					}
					break;
				case "hide":
					if(rayData) {
						viewerImpl.hide(rayData.dbId);
					}
					break;
				case "show":
					if(rayData) {
						viewerImpl.show(rayData.dbId);
					}
					break;
				case "toggleVisibility":
					if(rayData) {
						viewerImpl.toggleVisibility(rayData.dbId);
					}
					break;
				case "focus":
					// As a side effect of focus we also select
					if(viewerImpl.selector) {
						if(rayData) {
							viewerImpl.selector.setSelection([rayData.dbId], rayData.model);
						} else {
							viewerImpl.selector.setSelection([]);
						}
						utilities.fitToView();
					}
					break;
			}
		}
	};

	this.handleSingleClick = function(event, button) {
		var control = event.ctrlKey || event.metaKey;
		var shift = event.shiftKey;
		var alt = event.altKey;

		if(button === 0) {
			var click = new THREE.Vector3(event.normalizedX, event.normalizedY, 1.0);
			var result = viewerImpl.hitTestViewport(click, false);
			var key = "click";

			if(control) key += "Ctrl";
			if(shift) key += "Shift";
			if(alt) key += "Alt";

			var objectKey = result ? "onObject" : "offObject";

			if(this.clickConfig && this.clickConfig[key] && this.clickConfig[key][objectKey]) {
				this.handleAction(this.clickConfig[key][objectKey], result);
				return true;
			}
		} else if(button === 1 && shift && !alt && !control) {
			var click = new THREE.Vector3(event.normalizedX, event.normalizedY, 1.0);
			var result = viewerImpl.hitTestViewport(click, false);
			if(result && result.intersectPoint) {
				utilities.setPivotPoint(result.intersectPoint, true, true);
				utilities.pivotActive(true, true);
				return true;
			}
		}
		return false;
	};

	this.handleDoubleClick = function(event, button) {
		if(viewerImpl.selector && button === 0) {
			var click = new THREE.Vector3(event.normalizedX, event.normalizedY, 1.0);
			var result = viewerImpl.hitTestViewport(click, false);
			if(result) {
				viewerImpl.selector.setSelection([result.dbId], result.model);
			} else {
				viewerImpl.selector.clearSelection();
			}
			utilities.fitToView();
			return true;
		}
		if(button === 1) {
			navapi.fitBounds(false, utilities.getBoundingBox(true));
			navapi.setPivotSetFlag(false);
			return true;
		}
		return false;
	};

	this.handleSingleTap = function(event) {
		event.clientX = event.pointers[0].clientX;
		event.clientY = event.pointers[0].clientY;
		viewerImpl.api.triggerSingleTapCallback(event);

		if(event.hasOwnProperty("pointers") && event.pointers.length === 2) {
			navapi.setRequestHomeView(true);
			return true;
		}
		if(viewerImpl.selector) {
			var vp = new THREE.Vector3(event.normalizedX, event.normalizedY, 1.0);
			var result = viewerImpl.hitTestViewport(vp, false);

			if(result) {
				viewerImpl.selector.setSelection([result.dbId], result.model);
				viewerImpl.api.triggerSelectionChanged([result.dbId]);
			} else {
				viewerImpl.selector.clearSelection();
				viewerImpl.api.triggerSelectionChanged(null);
			}
			return true;
		}
		return false;
	};

	this.handleDoubleTap = function(event) {
		event.clientX = event.pointers[0].clientX;
		event.clientY = event.pointers[0].clientY;
		viewerImpl.api.triggerDoubleTapCallback(event);

		var result = this.handleSingleTap(event, 0);
		utilities.fitToView();
		return result;
	};

	this.handlePressHold = function(event) {
		if(event.type === "press") {
			event.clientX = event.pointers[0].clientX;
			event.clientY = event.pointers[0].clientY;

			return viewerImpl.api.triggerContextMenu(event);
		}
		return false;
	}
};
ZhiUTechNamespace('ZhiUTech.Viewing');

ZhiUTech.Viewing.GestureRecognizers = {
	singletap: [Hammer.Tap, {
		event: 'singletap',
		threshold: 7.0,
		time: 400
	}],
	singletap2: [Hammer.Tap, {
		event: 'singletap2',
		pointers: 2,
		threshold: 7.0,
		time: 400
	}],
	press: [Hammer.Press, {
		event: 'press',
		time: 500,
		threshold: 50.0
	}],
	doubletap: [Hammer.Tap, {
		event: 'doubletap',
		taps: 2,
		interval: 300,
		threshold: 6,
		posThreshold: 30
	}],
	doubletap2: [Hammer.Tap, {
		event: 'doubletap2',
		pointers: 2,
		taps: 2,
		interval: 300,
		threshold: 6,
		posThreshold: 40
	}],
	drag: [Hammer.Pan, {
		event: 'drag',
		pointers: 1
	}],
	drag3: [Hammer.Pan, {
		event: 'drag3',
		pointers: 3,
		threshold: 15
	}],
	pan: [Hammer.Pan, {
		event: 'pan',
		pointers: 2,
		threshold: 20
	}],
	pinch: [Hammer.Pinch, {
		event: 'pinch',
		pointers: 2,
		enable: true,
		threshold: 0.05
	}],
	rotate: [Hammer.Rotate, {
		event: 'rotate',
		pointers: 2,
		enable: true,
		threshold: 7.0
	}]
};

ZhiUTech.Viewing.GestureHandler = function(viewerApi) {
	var zv = ZhiUTech.Viewing;

	var _navapi = viewerApi.navigation;
	var _names = ['gestures'];
	var _this = this;
	var _mouseEnabled = true;
	var _twoPointerSwipeEnabled = true;
	var hammer = null;
	var _isActive = false;

	var isTouch = zv.isTouchDevice();

	_navapi.setIsTouchDevice(isTouch);

	if(isTouch) {
		hammer = new Hammer.Manager(viewerApi.canvasWrap, {
			recognizers: [
				zv.GestureRecognizers.drag,
				zv.GestureRecognizers.doubletap,
				zv.GestureRecognizers.doubletap2,
				zv.GestureRecognizers.singletap,
				zv.GestureRecognizers.singletap2,
				zv.GestureRecognizers.press,
				zv.GestureRecognizers.drag3,

				// Note: These recognizers are active only when _twoPointerSwipeEnabled is true
				zv.GestureRecognizers.pan,
				zv.GestureRecognizers.pinch,
				zv.GestureRecognizers.rotate
			],
			inputClass: zv.isIE11 ? Hammer.PointerEventInput : Hammer.TouchInput
		});
		hammer.get('pinch').recognizeWith([hammer.get('drag')]);

		viewerApi.canvasWrap.addEventListener('touchstart', this.onTouchStart, false);
	}

	this.onTouchStart = function(event) {

		event.preventDefault();
	};

	this.getNames = function() {

		return _names;
	};

	this.getName = function() {

		return _names[0];
	};

	this.isActive = function() {

		return _isActive;
	};

	this.__clientToCanvasCoords = function(event) {

		var rect = viewerApi.impl.getCanvasBoundingClientRect();
		var width = rect.width;
		var height = rect.height;

		// Canvas coordinates: relative to the canvas element.
		// 0 = top left, +ve right and down.
		//
		var canvasX, canvasY;

		if(event.hasOwnProperty('center')) {
			canvasX = event.center.x - rect.left;
			canvasY = event.center.y - rect.top;
		} else {
			canvasX = event.pointers[0].clientX - rect.left;
			canvasY = event.pointers[0].clientY - rect.top;
		}
		event.canvasX = canvasX;
		event.canvasY = canvasY;

		// Normalized coordinates: [-1, +1].
		// 0 = center, +ve = right and up.
		//
		event.normalizedX = (canvasX / width) * 2.0 - 1.0;
		event.normalizedY = ((height - canvasY) / height) * 2.0 - 1.0;
	};

	this.distributeGesture = function(event) {

		_this.__clientToCanvasCoords(event);

		if(_this.controller.distributeEvent('handleGesture', event))
			event.preventDefault();
	};

	this.onSingleTap = function(event) {

		_this.__clientToCanvasCoords(event);

		if(_this.controller.distributeEvent('handleSingleTap', event))
			event.preventDefault();
	};

	this.onDoubleTap = function(event) {

		_this.__clientToCanvasCoords(event);

		if(_this.controller.distributeEvent('handleDoubleTap', event))
			event.preventDefault();
	};

	this.onPressHold = function(event) {

		_this.__clientToCanvasCoords(event);

		if(_this.controller.distributeEvent('handlePressHold', event))
			event.preventDefault();
	};

	// Hammer.js contains an event called hammer.input, which is emitted for
	// every touch event. This contains information of when the user started touching,
	// and when they ended. This provides a general mechanism when to disable mouse
	// buttons. Touch interactions should have priority, and there's no use-case for
	// handling mouse events while touch is being used.
	// This prevents cases (most prominent in IE11 / Edge) where a mouse down is emitted
	// while Hammer is still trying to determine what type of gesture was traced on screen.
	this.onHammerInput = function(event) {

		_this.setMouseDisabledWhenTouching(event);
	};

	this.setMouseDisabledWhenTouching = function(event) {

		if(event.isFirst) {
			_mouseEnabled = _this.controller.enableMouseButtons(false);
		} else if(event.isFinal) {
			setTimeout(function() {
				_this.controller.enableMouseButtons(_mouseEnabled);
			}, 10);
		}
	};

	this.activate = function(name) {

		if(hammer && !_isActive) {
			hammer.on('dragstart dragmove dragend', this.distributeGesture);
			hammer.on('singletap', this.onSingleTap);
			hammer.on('singletap2', this.onSingleTap);
			hammer.on('doubletap', this.onDoubleTap);
			hammer.on('doubletap2', this.onDoubleTap);
			hammer.on('press pressup', this.onPressHold);
			hammer.on('drag3start drag3move drag3end', this.distributeGesture);

			if(_twoPointerSwipeEnabled) {
				hammer.on('panstart panmove panend', this.distributeGesture);
				hammer.on('pinchstart pinchmove pinchend', this.distributeGesture);
				hammer.on('rotatestart rotatemove rotateend', this.distributeGesture);
			}

			hammer.on('hammer.input', this.onHammerInput);

			// we only want to trigger a tap, when we don't have detected a doubletap
			hammer.get('doubletap2').recognizeWith('doubletap');
			hammer.get('singletap2').recognizeWith('singletap');
			hammer.get('singletap').requireFailure('doubletap');
		}

		_isActive = true;
	};

	this.deactivate = function(name) {

		if(hammer && _isActive) {
			hammer.off('dragstart dragmove dragend', this.distributeGesture);
			hammer.off('singletap', this.onSingleTap);
			hammer.off('singletap2', this.onSingleTap);
			hammer.off('doubletap', this.onDoubleTap);
			hammer.off('doubletap2', this.onDoubleTap);
			hammer.off('press pressup', this.onPressHold);
			hammer.off('drag3start drag3move drag3end', this.distributeGesture);

			if(_twoPointerSwipeEnabled) {
				hammer.off('panstart panmove panend', this.distributeGesture);
				hammer.off('pinchstart pinchmove pinchend', this.distributeGesture);
				hammer.off('rotatestart rotatemove rotateend', this.distributeGesture);
			}

			hammer.off('hammer.input', this.onHammerInput);
		}

		_isActive = false;
	};

	this.update = function() {

		return false;
	};

	this.handleBlur = function(event) {

		return false;
	};

	/**
	 * Disables two finger swipe functionality (pan, rotate, zoom) so that a
	 * mobile user can scroll the page where the viewer is being embedded.
	 */
	this.disableTwoFingerSwipe = function() {

		_twoPointerSwipeEnabled = false;
		if(hammer) {
			hammer.remove(Hammer.Pan);
			hammer.remove(Hammer.Pinch);
			hammer.remove(Hammer.Rotate);
			hammer.off('panstart panmove panend', this.distributeGesture);
			hammer.off('pinchstart pinchmove pinchend', this.distributeGesture);
			hammer.off('rotatestart rotatemove rotateend', this.distributeGesture);
		}
	}
};;
ZhiUTechNamespace('ZhiUTech.Viewing');

// /** @constructor */
//
// TODO: Pass in the api instead of the impl, don't use the impl object.
//
ZhiUTech.Viewing.OrbitDollyPanTool = function(viewerImpl, viewerApi) {
	var zvp = ZhiUTech.Viewing.Private;

	var _this = this;
	var kScreenEpsilon = 0.001;
	var kEpsilon = 0.00001;
	var kAutoDeltaZ = 1.5; // Dolly increment
	var kAutoDeltaXY = 0.01;
	var kAutoScreenXY = 20;
	var kDollyDragScale = 100.0;
	var kDollyPinchScale = 0.5;
	var kOrbitScale = 2.0;

	var isMac = (navigator.userAgent.search("Mac OS") != -1);

	var _navapi = viewerApi.navigation;
	var _camera = _navapi.getCamera();
	var _names = ["orbit", "freeorbit", "dolly", "pan"];

	var _activeMode = _names[0];
	var _activations = [_activeMode]; // Safeguard
	var _activatedMode = _activeMode;

	var _touchType = null;
	var _pinchScale = 1.0;
	var _prevPinchScale = 1.0;
	var _prevPinchLength = 0;
	var _pinchLength = 0;
	var _deltaRoll = 0.0;
	var _prevRoll = 0.0;

	var _activeModeLocked = false;
	var _autoCamStartXY = null;
	var _interactionActive = false;
	var _lastMouseX, _lastMouseY;

	var _keys = {
		SHIFT: 16,
		CONTROL: 17,
		ALT: 18,
		SPACE: 32,
		PAGEUP: 33,
		PAGEDOWN: 34,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		ZERO: 48,
		EQUALS: 187,
		DASH: 189
	};

	// Interaction Triggers:
	var kNone = -5;
	var kKeyboard = -4;
	var kWheel = -1;
	var kMouseLeft = 0;
	var kMouseMiddle = 1;
	var kMouseRight = 2;
	var kTouch = 3;

	var _activeTrigger = kNone;
	var _startXYZ = new THREE.Vector3();
	var _moveXYZ = new THREE.Vector3();
	var _touchStartXY = new THREE.Vector2();
	var _startXY = new THREE.Vector2();
	var _moveXY = new THREE.Vector2();
	var _deltaXY = new THREE.Vector2();
	var _motionDelta = new THREE.Vector3();

	var _rotateStart = new THREE.Vector3();
	var _rotateEnd = new THREE.Vector3();
	var _pivotToEye = new THREE.Vector3();
	var _targetToEye = new THREE.Vector3();
	var _projVector = new THREE.Vector3();
	var _objectUp = new THREE.Vector3();
	var _mouseOnBall = new THREE.Vector3();
	var _rotateNormal = new THREE.Vector3();
	var _quaternion = new THREE.Quaternion();
	var _noRoll = false;
	var _staticMoving = true;
	var _dynamicDampingFactor = 0.2;

	var _autoMove = [false, false, false, false, false, false]; // left, right, up, down, in, out
	var _modifierState = {
		SHIFT: 0,
		ALT: 0,
		CONTROL: 0,
		SPACE: 0
	};

	// Remove rollover effect when mouse is not over the canvas.
	var _onMouseOut = function(event) {
		viewerImpl.renderer().rolloverObjectId(0, null, 0);
	};

	var kDampingFactor = 0.6;
	var kLookSpeedDefault = 5.0;
	var kDollySpeedDefault = 0.025;
	var kMinDollySpeed = 0.01;
	var kDollyScale = 0.6;

	var _trackingDistance = 1.0;
	var _boundingBox;

	var myLookSpeed = kLookSpeedDefault;
	var myDollySpeed = kDollySpeedDefault;

	this.getNames = function() {
		return _names;
	};

	this.getName = function() {
		return _names[0];
	};

	this.activate = function(name) {
		// zvp.logger.log("ACTIVATE: " + _activatedMode + " => " + name);
		_activations.push(name);
		_activatedMode = name;

		viewerImpl.canvas.addEventListener('mouseout', _onMouseOut);
	};

	this.deactivate = function(name) {
		var end = _activations.length - 1;
		if(end > 0 && _activations[end] === name) {
			_activations.pop();
			_activatedMode = _activations[end - 1];

			// zvp.logger.log("DEACTIVATE: " + name + " => " + _activatedMode );
		}

		if(_activations.length === 0) {
			viewerImpl.canvas.removeEventListener('mouseout', _onMouseOut);
		}
	};

	this.adjustDollyLookSpeed = function(direction) {
		if(direction === 0) {
			myDollySpeed = kDollySpeedDefault;
			myLookSpeed = kLookSpeedDefault;
		} else {
			myDollySpeed *= (direction > 0) ? 1.10 : 0.90;
			myLookSpeed *= (direction > 0) ? 1.10 : 0.90;

			// May need more appropriate minimums (and maximums) here.
			if(myDollySpeed < 0.000001)
				myDollySpeed = 0.000001;

			if(myLookSpeed < 0.000001)
				myLookSpeed = 0.000001;
		}
	};

	this.getDollySpeed = function(dollyTarget) {
		// Calculate the distance that one unit of virtual dolly will move:
		var view = _navapi.getEyeVector();
		var position = _navapi.getPosition();
		var projectedLength = dollyTarget.clone().sub(position).dot(view.normalize());
		var distance = projectedLength * myDollySpeed;
		return(Math.abs(distance) < kMinDollySpeed) ? ((distance < 0) ? -kMinDollySpeed : kMinDollySpeed) : distance;
	};

	this.getLookSpeed = function() {
		return myLookSpeed;
	};

	this.coiIsActive = function() {
		return _navapi.getPivotSetFlag() && _navapi.isPointVisible(_navapi.getPivotPoint());
	};

	this.adjustSpeed = function(direction) {
		this.adjustDollyLookSpeed(direction);

		if(this.utilities.autocam)
			this.utilities.autocam.orbitMultiplier = this.getLookSpeed();
	};

	this.getTriggeredMode = function() {
		// Fusion wants Shift+Middle to go back to orbit
		if((_activeTrigger === kMouseMiddle) && _modifierState.SHIFT)
			return _activations[1]; // TODO_NOP: return to chosen orbit behavior, don't use _activations

		return(isDolly() || _motionDelta.z !== 0.0) ? shouldPanOverrideDolly() ? "pan" : "dolly" :
			isTrack() ? "pan" :
			(_touchType === 'pan' || _touchType === 'pinch') ? "dollypan" :
			_activatedMode;
	}

	// TO DO: Where/when do we push/pop tool state?
	function isTrack() {
		var mod = _modifierState;
		return((_activeTrigger === kMouseRight) && !mod.SHIFT && !(mod.ALT ^ mod.CONTROL)) ||
			((_activeTrigger === kMouseRight) && mod.SHIFT && mod.CONTROL) ||
			((_activeTrigger === kMouseMiddle) && !mod.SHIFT && !mod.CONTROL) ||
			((_activeTrigger === kMouseMiddle) && mod.ALT) ||
			((_activeTrigger === kMouseMiddle) && mod.CONTROL && !mod.ALT) ||
			((_activeTrigger === kMouseLeft) && mod.SHIFT && !mod.CONTROL && !mod.ALT) ||
			((_activatedMode === "pan") && (_activeTrigger !== kMouseMiddle) && !mod.ALT && !(_touchType === "pinch")) ||
			(mod.SPACE);
	}

	function isDolly() {
		var mod = _modifierState;
		return((_activeTrigger === kMouseRight) && mod.SHIFT && !mod.ALT && !mod.CONTROL) ||
			((_activeTrigger === kMouseRight) && mod.ALT && !mod.SHIFT && !mod.CONTROL) ||
			((_activatedMode === "dolly") && !mod.ALT && !(_touchType === "pinch"))
	}

	function shouldPanOverrideDolly() {
		var mod = _modifierState;
		return !mod.CONTROL && !mod.ALT && !mod.SHIFT && (_activeTrigger === kMouseRight || _activeTrigger === kMouseMiddle);
	}

	this.initTracking = function(x, y) {
		var distance;

		if(!_camera.isPerspective) {
			distance = _navapi.getEyeVector().length();
		} else {
			// Decide what point in world space defines the plane
			// orthogonal to the view that will be used to track
			// the camera. If we get an intersection point use it,
			// otherwise if the pivot point is set use that. The
			// fallback is to use the mid-point of the view frustum.

			distance = (_camera.near + _camera.far) * 0.5;

			var p = this.utilities.getHitPoint(x, y);
			var position = _navapi.getPosition();
			if(p && p.sub) {
				// Calculate orthogonal distance along view vector:
				var hitToEye = p.sub(position);
				var view = _navapi.getEyeVector().normalize();
				distance = Math.abs(view.dot(hitToEye));
			} else {
				var usePivot = _navapi.getPivotSetFlag() && _navapi.isPointVisible(_navapi.getPivotPoint());
				if(usePivot) {
					var pivotDistance = _navapi.getPivotPlaneDistance();
					if(pivotDistance > kEpsilon) {
						distance = pivotDistance;
					}
				}
			}
		}
		_trackingDistance = distance;
	};

	function pivotIsBehind() {
		var cameraNear = _navapi.getCamera().near;
		var cameraPosition = cameraNear > 0 ?
			_navapi.getPosition() :
			_navapi.getEyeVector().normalize().multiplyScalar(cameraNear).add(_navapi.getPosition());

		var pivotVector = _navapi.getPivotPoint().sub(cameraPosition);
		return(pivotVector.dot(_navapi.getEyeVector()) <= 0.0);
	}

	this.initOrbit = function() {
		// If the pivot point is behind us we pivot around the center of the view:
		this.utilities.setTemporaryPivot(pivotIsBehind() ? _navapi.getTarget() : null);
	};

	this.getActiveMode = function() {
		return _activeMode;
	};

	this.getCursor = function() {
		switch(_activeMode) {
			case "freeorbit":
			case "orbit":
				return 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAA7pmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTgtMDgtMDNUMTU6NDg6NTIrMDg6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxOC0wOC0wNlQxNDo0MDozMSswODowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMTgtMDgtMDZUMTQ6NDA6MzErMDg6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6MTM0YTIzZTgtOTcwYy0yMjRjLWJjZDItNWU2NWJlMDliODI5PC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6YjViNjQyMjYtOTcwMi0xMWU4LWIxYzAtZGFhOWY5YmU3ZjZjPC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6NWU3MmVlNTAtNmZiZi1mNTQ1LTkwNjgtZTJhNTJlNzA0ZmE4PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjVlNzJlZTUwLTZmYmYtZjU0NS05MDY4LWUyYTUyZTcwNGZhODwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxOC0wOC0wM1QxNTo0ODo1MiswODowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDpmNTQ4ZmM1My1jZGNiLTdiNDctYWE1MS01ZTJjODM5M2ZhODM8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTgtMDgtMDNUMTc6NTE6MjcrMDg6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MTM0YTIzZTgtOTcwYy0yMjRjLWJjZDItNWU2NWJlMDliODI5PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE4LTA4LTA2VDE0OjQwOjMxKzA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+NjU1MzU8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjMyPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjMyPC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz7mSon+AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAWeSURBVHjaxNdpbBVVFMDx/70z8+a9eS1ULCoViStqI8YgqUYxuBRQFKVCkEVlKagEV0TFDQVEBYMaguJKBQVFjBTcEIoSYiLwoJSgsQG1iLZarSztW2e7fphnBPGBpTWeL3Mzk3PvL+fMvZkRjKncBpwKpAF5wHUvcCOIajwJms+hoYKLkCAM8ByQPigteKZUMNYcECaIToAXZL56UZDKmEoF1AGzABOoBh4DSpE8hS8fCgDefwbwgGXAsOysvYHVCLaj/HI8/StQj6GpGmBFNuug9dujAkuzgHHAq6A+R8oBuG4aad4NmedAPg5MQyrwZNCkdgLEgblAFbAWeBf8YfhK4XqFmKGfgZ0ISkDF8XTI6GDa2cVEmwEZ4CfgJGAhMB58cF0QTEI35uBpYxGqAqkgYwYViKRAqHYBVACjg9JzS1DXMGAAfiXEL0RpxSj2IBU4oQAQTrcbIAqcDNSilIcWAs3M9lctxN03EKX3QojvQYCjn4gt+mGkzgdVCCKDlHXo5mfgxhB+qrWAv3aVr4EVh3A8GCMG0lKwEl+bjxTTsL0xOPYUs4MZ7WiFdFOXeL4imXHZ15xK4lCLFZqI0Dag/KMAKAmRJIRSwdjTNPZ2eplj42U0yiY01b20ZxHDL+jKxWccQ5eOYZK2R21DC+9s/NH7pLpR2/1Li084PBFDvITfGoDKtt0Q4Gc3uiA4gPYl63Fk0RM39eThq7uTK3Y0JhhfUc36WD1Y5gMY+mx82QqAlj2EDwzHe8Bw/OnPji4J3V7ajSNFyvYZMj/Gx+t3QdS8Hy30DNL+Ny1Q2RfnoJO2G7bzQ/9Lilg1oTcADftTbK+P07+4c05Ec9plyPwYazb8CJHwZDQ1BxE6EkAcOpPr32VF9OffurUXZT1PAGBuVR33vB5jytDzmFmWux17EjYj529m1dZ6RFhOVsKakwOwPDcg4y3t2iVv6Pbpl1FgGQDs/j3FLa9t4dMtDUwqK2bWDcXoUv4j4vcWm1EVW/loUx2YHe5AFs4D92+AsR/mbmjGXXfaiZE+387qd9DthOMx4sUYO39NEJvah6ip55zi17jD+IpqVsZ2uaQ734wv3sayUYv6ZwHlK3MD0u7aU4vyLv9udt9DHjmeImV75Id1hDj8i7mrKcWgl9azbWNiK6GCq7EyP6s3r8oCRq3InWl7bxx/vDVq0yN96HZsmLbEyppfuG7aOiiwJiPEMrVg4O4AcNvq3Fm+N8JQexc/OaiXN3nAGVpbAL81Z7juxRhfbq1fgWmsUIuurwgAdy7LnaVER36SX59SHOmy7cG+Mj/aJgOPvP8NMxfU7CfPrFLvXD8kAAz/OHeGp0HCGEbnhrfLL+3Ba6PObRPg0eW1PPF6NXQwY2rJ4JIAcOVnh6sAhG2wmufh+xMfuqEHM8vOPmrA1OXfMGNBTYb80Dq1ZPCVAeCaqsMDpAcFKYnnvYLtlI+/pjvPDetB1GxdO2xXMfKVzby39tsviBgfqLeGzG4FIAmGFiJtv0DaHjdl+Lk8Obj4iNvvwFhX20T/WVU4qfyZKmMuVctLt7cSIMFTGspbiOuPvO/aM3l66DnIf4FQwE2LN7B42Xe2nji9r6c7m/1PeiePBgCoEFCBbY+4t6yYGYPOJmLI3KV3FI9X7uCpj2ogHZlKY/4MNB9VdQVHB/jzOxBVgWePHnrhyUy44hQuPavwkPRN3+9l7po6FlftgAJrEU2RcvZLF02h1pS2BZD9F3D16SSbJxA1Cq8t6cZ5XfOImhpJ22dnY5wlG+shkXSxzBeQ8n72RGz2abQfIB2FcEuJoalxIeGPTTQ5Gmk3+Kqy9N+KjjPXxG21sDmtVqNL2BOhfQEZC0ItkY4R2ef0TvqkLQ3uaSQzFiGRyLOMjWd11it3Njmr9qdVS06AUor/M/53wB8DAAx5/99ytcqUAAAAAElFTkSuQmCC), auto';

			case "dolly":
				return "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAA7pmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTgtMDgtMDNUMTU6NDg6NTIrMDg6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxOC0wOC0wNlQxNDo0MDozMSswODowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMTgtMDgtMDZUMTQ6NDA6MzErMDg6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6MTM0YTIzZTgtOTcwYy0yMjRjLWJjZDItNWU2NWJlMDliODI5PC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6YjViNjQyMjYtOTcwMi0xMWU4LWIxYzAtZGFhOWY5YmU3ZjZjPC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6NWU3MmVlNTAtNmZiZi1mNTQ1LTkwNjgtZTJhNTJlNzA0ZmE4PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjVlNzJlZTUwLTZmYmYtZjU0NS05MDY4LWUyYTUyZTcwNGZhODwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxOC0wOC0wM1QxNTo0ODo1MiswODowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDpmNTQ4ZmM1My1jZGNiLTdiNDctYWE1MS01ZTJjODM5M2ZhODM8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTgtMDgtMDNUMTc6NTE6MjcrMDg6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MTM0YTIzZTgtOTcwYy0yMjRjLWJjZDItNWU2NWJlMDliODI5PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE4LTA4LTA2VDE0OjQwOjMxKzA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+NjU1MzU8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjMyPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjMyPC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz7mSon+AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAWeSURBVHjaxNdpbBVVFMDx/70z8+a9eS1ULCoViStqI8YgqUYxuBRQFKVCkEVlKagEV0TFDQVEBYMaguJKBQVFjBTcEIoSYiLwoJSgsQG1iLZarSztW2e7fphnBPGBpTWeL3Mzk3PvL+fMvZkRjKncBpwKpAF5wHUvcCOIajwJms+hoYKLkCAM8ByQPigteKZUMNYcECaIToAXZL56UZDKmEoF1AGzABOoBh4DSpE8hS8fCgDefwbwgGXAsOysvYHVCLaj/HI8/StQj6GpGmBFNuug9dujAkuzgHHAq6A+R8oBuG4aad4NmedAPg5MQyrwZNCkdgLEgblAFbAWeBf8YfhK4XqFmKGfgZ0ISkDF8XTI6GDa2cVEmwEZ4CfgJGAhMB58cF0QTEI35uBpYxGqAqkgYwYViKRAqHYBVACjg9JzS1DXMGAAfiXEL0RpxSj2IBU4oQAQTrcbIAqcDNSilIcWAs3M9lctxN03EKX3QojvQYCjn4gt+mGkzgdVCCKDlHXo5mfgxhB+qrWAv3aVr4EVh3A8GCMG0lKwEl+bjxTTsL0xOPYUs4MZ7WiFdFOXeL4imXHZ15xK4lCLFZqI0Dag/KMAKAmRJIRSwdjTNPZ2eplj42U0yiY01b20ZxHDL+jKxWccQ5eOYZK2R21DC+9s/NH7pLpR2/1Li084PBFDvITfGoDKtt0Q4Gc3uiA4gPYl63Fk0RM39eThq7uTK3Y0JhhfUc36WD1Y5gMY+mx82QqAlj2EDwzHe8Bw/OnPji4J3V7ajSNFyvYZMj/Gx+t3QdS8Hy30DNL+Ny1Q2RfnoJO2G7bzQ/9Lilg1oTcADftTbK+P07+4c05Ec9plyPwYazb8CJHwZDQ1BxE6EkAcOpPr32VF9OffurUXZT1PAGBuVR33vB5jytDzmFmWux17EjYj529m1dZ6RFhOVsKakwOwPDcg4y3t2iVv6Pbpl1FgGQDs/j3FLa9t4dMtDUwqK2bWDcXoUv4j4vcWm1EVW/loUx2YHe5AFs4D92+AsR/mbmjGXXfaiZE+387qd9DthOMx4sUYO39NEJvah6ip55zi17jD+IpqVsZ2uaQ734wv3sayUYv6ZwHlK3MD0u7aU4vyLv9udt9DHjmeImV75Id1hDj8i7mrKcWgl9azbWNiK6GCq7EyP6s3r8oCRq3InWl7bxx/vDVq0yN96HZsmLbEyppfuG7aOiiwJiPEMrVg4O4AcNvq3Fm+N8JQexc/OaiXN3nAGVpbAL81Z7juxRhfbq1fgWmsUIuurwgAdy7LnaVER36SX59SHOmy7cG+Mj/aJgOPvP8NMxfU7CfPrFLvXD8kAAz/OHeGp0HCGEbnhrfLL+3Ba6PObRPg0eW1PPF6NXQwY2rJ4JIAcOVnh6sAhG2wmufh+xMfuqEHM8vOPmrA1OXfMGNBTYb80Dq1ZPCVAeCaqsMDpAcFKYnnvYLtlI+/pjvPDetB1GxdO2xXMfKVzby39tsviBgfqLeGzG4FIAmGFiJtv0DaHjdl+Lk8Obj4iNvvwFhX20T/WVU4qfyZKmMuVctLt7cSIMFTGspbiOuPvO/aM3l66DnIf4FQwE2LN7B42Xe2nji9r6c7m/1PeiePBgCoEFCBbY+4t6yYGYPOJmLI3KV3FI9X7uCpj2ogHZlKY/4MNB9VdQVHB/jzOxBVgWePHnrhyUy44hQuPavwkPRN3+9l7po6FlftgAJrEU2RcvZLF02h1pS2BZD9F3D16SSbJxA1Cq8t6cZ5XfOImhpJ22dnY5wlG+shkXSxzBeQ8n72RGz2abQfIB2FcEuJoalxIeGPTTQ5Gmk3+Kqy9N+KjjPXxG21sDmtVqNL2BOhfQEZC0ItkY4R2ef0TvqkLQ3uaSQzFiGRyLOMjWd11it3Njmr9qdVS06AUor/M/53wB8DAAx5/99ytcqUAAAAAElFTkSuQmCC), auto";

			case "pan":
				return "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAA7pmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTgtMDgtMDNUMTU6NDg6NTIrMDg6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxOC0wOC0wNlQxNDo0MDozMSswODowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMTgtMDgtMDZUMTQ6NDA6MzErMDg6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6MTM0YTIzZTgtOTcwYy0yMjRjLWJjZDItNWU2NWJlMDliODI5PC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6YjViNjQyMjYtOTcwMi0xMWU4LWIxYzAtZGFhOWY5YmU3ZjZjPC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6NWU3MmVlNTAtNmZiZi1mNTQ1LTkwNjgtZTJhNTJlNzA0ZmE4PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjVlNzJlZTUwLTZmYmYtZjU0NS05MDY4LWUyYTUyZTcwNGZhODwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxOC0wOC0wM1QxNTo0ODo1MiswODowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDpmNTQ4ZmM1My1jZGNiLTdiNDctYWE1MS01ZTJjODM5M2ZhODM8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTgtMDgtMDNUMTc6NTE6MjcrMDg6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MTM0YTIzZTgtOTcwYy0yMjRjLWJjZDItNWU2NWJlMDliODI5PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE4LTA4LTA2VDE0OjQwOjMxKzA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+NjU1MzU8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjMyPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjMyPC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz7mSon+AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAWeSURBVHjaxNdpbBVVFMDx/70z8+a9eS1ULCoViStqI8YgqUYxuBRQFKVCkEVlKagEV0TFDQVEBYMaguJKBQVFjBTcEIoSYiLwoJSgsQG1iLZarSztW2e7fphnBPGBpTWeL3Mzk3PvL+fMvZkRjKncBpwKpAF5wHUvcCOIajwJms+hoYKLkCAM8ByQPigteKZUMNYcECaIToAXZL56UZDKmEoF1AGzABOoBh4DSpE8hS8fCgDefwbwgGXAsOysvYHVCLaj/HI8/StQj6GpGmBFNuug9dujAkuzgHHAq6A+R8oBuG4aad4NmedAPg5MQyrwZNCkdgLEgblAFbAWeBf8YfhK4XqFmKGfgZ0ISkDF8XTI6GDa2cVEmwEZ4CfgJGAhMB58cF0QTEI35uBpYxGqAqkgYwYViKRAqHYBVACjg9JzS1DXMGAAfiXEL0RpxSj2IBU4oQAQTrcbIAqcDNSilIcWAs3M9lctxN03EKX3QojvQYCjn4gt+mGkzgdVCCKDlHXo5mfgxhB+qrWAv3aVr4EVh3A8GCMG0lKwEl+bjxTTsL0xOPYUs4MZ7WiFdFOXeL4imXHZ15xK4lCLFZqI0Dag/KMAKAmRJIRSwdjTNPZ2eplj42U0yiY01b20ZxHDL+jKxWccQ5eOYZK2R21DC+9s/NH7pLpR2/1Li084PBFDvITfGoDKtt0Q4Gc3uiA4gPYl63Fk0RM39eThq7uTK3Y0JhhfUc36WD1Y5gMY+mx82QqAlj2EDwzHe8Bw/OnPji4J3V7ajSNFyvYZMj/Gx+t3QdS8Hy30DNL+Ny1Q2RfnoJO2G7bzQ/9Lilg1oTcADftTbK+P07+4c05Ec9plyPwYazb8CJHwZDQ1BxE6EkAcOpPr32VF9OffurUXZT1PAGBuVR33vB5jytDzmFmWux17EjYj529m1dZ6RFhOVsKakwOwPDcg4y3t2iVv6Pbpl1FgGQDs/j3FLa9t4dMtDUwqK2bWDcXoUv4j4vcWm1EVW/loUx2YHe5AFs4D92+AsR/mbmjGXXfaiZE+387qd9DthOMx4sUYO39NEJvah6ip55zi17jD+IpqVsZ2uaQ734wv3sayUYv6ZwHlK3MD0u7aU4vyLv9udt9DHjmeImV75Id1hDj8i7mrKcWgl9azbWNiK6GCq7EyP6s3r8oCRq3InWl7bxx/vDVq0yN96HZsmLbEyppfuG7aOiiwJiPEMrVg4O4AcNvq3Fm+N8JQexc/OaiXN3nAGVpbAL81Z7juxRhfbq1fgWmsUIuurwgAdy7LnaVER36SX59SHOmy7cG+Mj/aJgOPvP8NMxfU7CfPrFLvXD8kAAz/OHeGp0HCGEbnhrfLL+3Ba6PObRPg0eW1PPF6NXQwY2rJ4JIAcOVnh6sAhG2wmufh+xMfuqEHM8vOPmrA1OXfMGNBTYb80Dq1ZPCVAeCaqsMDpAcFKYnnvYLtlI+/pjvPDetB1GxdO2xXMfKVzby39tsviBgfqLeGzG4FIAmGFiJtv0DaHjdl+Lk8Obj4iNvvwFhX20T/WVU4qfyZKmMuVctLt7cSIMFTGspbiOuPvO/aM3l66DnIf4FQwE2LN7B42Xe2nji9r6c7m/1PeiePBgCoEFCBbY+4t6yYGYPOJmLI3KV3FI9X7uCpj2ogHZlKY/4MNB9VdQVHB/jzOxBVgWePHnrhyUy44hQuPavwkPRN3+9l7po6FlftgAJrEU2RcvZLF02h1pS2BZD9F3D16SSbJxA1Cq8t6cZ5XfOImhpJ22dnY5wlG+shkXSxzBeQ8n72RGz2abQfIB2FcEuJoalxIeGPTTQ5Gmk3+Kqy9N+KjjPXxG21sDmtVqNL2BOhfQEZC0ItkY4R2ef0TvqkLQ3uaSQzFiGRyLOMjWd11it3Njmr9qdVS06AUor/M/53wB8DAAx5/99ytcqUAAAAAElFTkSuQmCC), auto";
		}
		return null;
	};

	this.getMotionDelta = function(dxyz, dxy) {
		// Add any offset triggered by key controls:
		// TODO: Change these to scale based on real time so fast frame
		// rate doesn't cause super fast motion.

		var autoDeltaZ = (_navapi && _navapi.getReverseZoomDirection()) ? -kAutoDeltaZ : kAutoDeltaZ;
		if(isMac)
			autoDeltaZ *= -1; // Match the "natural" scroll direction on Mac.

		if(_autoMove[0]) {
			_moveXYZ.x += kAutoDeltaXY;
			_moveXY.x += kAutoScreenXY;
		}
		if(_autoMove[1]) {
			_moveXYZ.x -= kAutoDeltaXY;
			_moveXY.x -= kAutoScreenXY;
		}
		if(_autoMove[2]) {
			_moveXYZ.y += kAutoDeltaXY;
			_moveXY.y += kAutoScreenXY;
		}
		if(_autoMove[3]) {
			_moveXYZ.y -= kAutoDeltaXY;
			_moveXY.y -= kAutoScreenXY;
		}
		if(_autoMove[4]) {
			_moveXYZ.z += autoDeltaZ;
		}
		if(_autoMove[5]) {
			_moveXYZ.z -= autoDeltaZ;
		}

		var deltaX = _moveXYZ.x - _startXYZ.x;
		var deltaY = _moveXYZ.y - _startXYZ.y;
		var deltaZ = _moveXYZ.z - _startXYZ.z;

		if(Math.abs(deltaX) < kScreenEpsilon) deltaX = 0.0;
		if(Math.abs(deltaY) < kScreenEpsilon) deltaY = 0.0;
		if(Math.abs(deltaZ) < kScreenEpsilon) deltaZ = 0.0;

		dxyz.set(deltaX, deltaY, deltaZ);

		if(dxy) {
			dxy.set(_moveXY.x - _startXY.x, _moveXY.y - _startXY.y);
		}
	};

	this.stepMotionDelta = function(delta, damped) {
		if(damped) {
			_startXYZ.x += delta.x * kDampingFactor;
			_startXYZ.y += delta.y * kDampingFactor;
			_startXYZ.z += delta.z * kDampingFactor;
		} else
			_startXYZ.copy(_moveXYZ);

		_startXY.copy(_moveXY);
	};

	function getMouseProjectionOnBall(pageX, pageY) {
		var viewport = {
			left: 0,
			top: 0,
			width: window.innerWidth,
			height: window.innerHeight
		};

		_mouseOnBall.set(
			(pageX - viewport.width * 0.5 - viewport.left) / (viewport.width * 0.5),
			(viewport.height * 0.5 + viewport.top - pageY) / (viewport.height * 0.5),
			0.0
		);

		var length = _mouseOnBall.length();
		if(_noRoll) {
			if(length < Math.SQRT1_2) {
				_mouseOnBall.z = Math.sqrt(1.0 - length * length);
			} else {
				_mouseOnBall.z = .5 / length;
			}
		} else if(length > 1.0) {
			_mouseOnBall.normalize();
		} else {
			_mouseOnBall.z = Math.sqrt(1.0 - length * length);
		}
		_pivotToEye.copy(_camera.position).sub(_camera.pivot);
		_projVector.copy(_camera.up).setLength(_mouseOnBall.y)
		_projVector.add(_objectUp.copy(_camera.up).cross(_pivotToEye).setLength(_mouseOnBall.x));
		_projVector.add(_pivotToEye.setLength(_mouseOnBall.z));
		return _projVector;
	}

	function freeOrbit() {
		if(!_navapi.isActionEnabled('orbit')) {
			return;
		}

		_pivotToEye.subVectors(_camera.position, _camera.pivot);
		_targetToEye.subVectors(_camera.position, _camera.target);
		var targetDist = _targetToEye.length();
		_targetToEye.normalize();

		var angle = Math.acos(_rotateStart.dot(_rotateEnd) / _rotateStart.length() / _rotateEnd.length());
		if(angle) {
			angle *= kOrbitScale;
			_rotateNormal.crossVectors(_rotateStart, _rotateEnd).normalize();
			_quaternion.setFromAxisAngle(_rotateNormal, -angle);

			_pivotToEye.applyQuaternion(_quaternion);
			_camera.up.applyQuaternion(_quaternion);
			_rotateEnd.applyQuaternion(_quaternion);
			_targetToEye.applyQuaternion(_quaternion);

			if(_staticMoving) {
				_rotateStart.copy(_rotateEnd);
			} else {
				_quaternion.setFromAxisAngle(_rotateNormal, angle * (_dynamicDampingFactor - 1.0));
				_rotateStart.applyQuaternion(_quaternion);
			}
		}

		_camera.position.addVectors(_camera.pivot, _pivotToEye);
		_camera.target.subVectors(_camera.position, _targetToEye.multiplyScalar(targetDist));
		_camera.dirty = true;
	}

	this.getFitBounds = function() {
		if(this.utilities.viewerImpl.zoomBoundsChanged) {
			_boundingBox = this.utilities.viewerImpl.getVisibleBounds(true);
			this.utilities.viewerImpl.zoomBoundsChanged = false;
		}

		return _boundingBox;
	};

	this.update = function() {
		var wheelEnded = false;
		var updatePivot = false;
		var viewport;

		this.getMotionDelta(_motionDelta, _deltaXY);

		var deltaX = _motionDelta.x;
		var deltaY = _motionDelta.y;
		var deltaZ = _motionDelta.z;

		if(!_activeModeLocked)
			this.checkInteractionMode();

		_activeModeLocked = (_activeTrigger > kWheel);

		if(_activeModeLocked)
			this.controller.setIsLocked(true);

		if(deltaX !== 0.0 || deltaY !== 0.0 || deltaZ !== 0.0) {
			switch(_activeMode) {
				case "orbit":
					if(this.utilities.autocam && this.utilities.autocam.startState) {
						_deltaXY.x = -_deltaXY.x;
						if(_autoCamStartXY)
							this.utilities.autocam.orbit(_moveXY, _autoCamStartXY, _deltaXY.multiplyScalar(kOrbitScale), this.utilities.autocam.startState);
					}
					break;

				case "freeorbit":
					freeOrbit();
					break;

				case "dolly":
					var dollyTarget, screenX, screenY;

					deltaZ *= kDollyScale;

					if(_activeTrigger >= kMouseLeft) {
						// Map XY movement to Z:
						deltaY = -deltaY; // Invert Y
						deltaZ = (Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY;

						if(_navapi.getReverseZoomDirection()) {
							deltaZ *= -1;
						}

						deltaZ *= kDollyDragScale;
						deltaX = 0.0;
						deltaY = 0.0;

						// Towards center of screen:
						screenX = screenY = 0.5;
					} else {
						// Towards cursor position:
						viewport = _navapi.getScreenViewport();
						if(_lastMouseX && _lastMouseY) {
							screenX = _lastMouseX / viewport.width;
							screenY = _lastMouseY / viewport.height;
						} else {
							screenX = screenY = 0.5;
						}
					}
					if(!_navapi.getIs2D() && _navapi.getZoomTowardsPivot()) {
						if(!this.coiIsActive()) {
							// Center of screen if pivot is not active
							dollyTarget = _navapi.getWorldPoint(0.5, 0.5);
						} else
							dollyTarget = _navapi.getPivotPoint();
					} else
						dollyTarget = _navapi.getWorldPoint(screenX, screenY);

					_navapi.dollyFromPoint(deltaZ * this.getDollySpeed(dollyTarget), dollyTarget, this.getFitBounds());
					break;

				case "pan":
					// Moving camera down/left moves the model up/right:
					_navapi.panRelative(-deltaX, deltaY, _trackingDistance);
					break;

				case "dollypan":

					if(deltaX !== 0.0 || deltaY !== 0.0)
						_navapi.panRelative(-deltaX, deltaY, _trackingDistance);

					// Towards cursor position:
					viewport = _navapi.getScreenViewport();
					screenX = _lastMouseX / viewport.width;
					screenY = _lastMouseY / viewport.height;

					dollyTarget = _navapi.getWorldPoint(screenX, screenY);
					var position = _navapi.getPosition();
					var distance = _navapi.getIs2D() ? position.sub(dollyTarget).length() : _trackingDistance;
					var touchScale = _prevPinchLength / _pinchLength - 1;

					var distanceDelta = touchScale * distance;

					_navapi.dollyFromPoint(distanceDelta, dollyTarget, this.getFitBounds());

					var vview = new THREE.Vector3();
					var qrotate = new THREE.Quaternion();

					var up = _navapi.getCameraUpVector();
					var view = vview.copy(_camera.position).sub(_camera.target).normalize();
					qrotate.setFromAxisAngle(view, _deltaRoll * 1.2);
					up.applyQuaternion(qrotate);
					if(!_navapi.getIs2D())
						_navapi.setCameraUpVector(up);

					_prevPinchLength = _pinchLength;
					_prevPinchScale = _pinchScale;
					_trackingDistance = distance + distanceDelta;
					break;
			}
			updatePivot = true;
		}
		this.stepMotionDelta(_motionDelta, (_activeMode !== "pan" && _activeMode !== 'dollypan'));

		// If a wheel event triggered this we've now handled it,
		if(_activeTrigger === kWheel && Math.abs(deltaZ) < kEpsilon) {
			this.interactionEnd(kWheel);
			wheelEnded = true;
			updatePivot = true;
		}

		// Show pivot if a clutch key is being held.
		if((_modifierState.SHIFT || _modifierState.ALT) && (_names.indexOf(viewerApi.getActiveNavigationTool()) !== -1)) {
			updatePivot = true;
		}

		// If the interaction has "ended" we can now forget the trigger.
		if(!_interactionActive && (wheelEnded || (_activeTrigger > kNone))) {
			if(_activeTrigger > kWheel) {
				// Kill any ongoing damped motion if we aren't using
				// the wheel.
				_startXYZ.copy(_moveXYZ);

				this.utilities.removeTemporaryPivot();
			}
			this.utilities.autocam.endInteraction();
			_activeTrigger = kNone;
			if(_activeModeLocked)
				this.controller.setIsLocked(false);
			_activeModeLocked = false;
			_autoCamStartXY = null;
			_touchType = null;
		}
		if(updatePivot)
			this.utilities.pivotActive(_navapi.getPivotSetFlag(), (_activeTrigger <= kWheel));
		else
			this.utilities.pivotUpdate();

		return _camera.dirty;
	};

	this.checkInteractionMode = function() {
		var newMode = this.getTriggeredMode();

		if(newMode !== _activeMode) {
			_activeMode = newMode;

			if((_activeMode === "pan" && _activeTrigger > kWheel) || (_activeMode === "dollypan"))
				this.initTracking(_startXYZ.x, _startXYZ.y);
		}
	};

	this.interactionStart = function(trigger, force) {
		// Just a simple way to give device input a sort of priority
		// so we don't have to track all active triggers. Just remember
		// the most recent with highest "priority".
		if(force || trigger > _activeTrigger) {
			// Perhaps we need to remember the modifier keys now.
			_activeTrigger = trigger;
			_interactionActive = true;

			if(trigger > kWheel) {
				if(_activeMode === "pan")
					this.initTracking(_startXYZ.x, _startXYZ.y);

				if(_activeMode === "orbit")
					this.initOrbit();
			}
			this.utilities.pivotActive(_navapi.getPivotSetFlag(), (trigger === kWheel));

			if(this.utilities.autocam) {
				this.utilities.autocam.sync(_camera);
				this.utilities.autocam.startInteraction(_startXY.x, _startXY.y);
				_autoCamStartXY = _startXY.clone();
			}
		}
	};

	this.interactionCheck = function() {
		// Restart keyboard interaction if certain keys are still down:
		//
		if(_autoMove[0] ||
			_autoMove[1] ||
			_autoMove[2] ||
			_autoMove[3] ||
			_autoMove[4] ||
			_autoMove[5] ||
			_modifierState.SHIFT ||
			_modifierState.CONTROL ||
			_modifierState.ALT ||
			_modifierState.SPACE) this.interactionStart(kKeyboard, true);
	};

	this.interactionEnd = function(trigger) {
		if(trigger === _activeTrigger) {
			if(trigger !== kWheel)
				this.utilities.pivotActive(false);

			// We have to leave the _activeTrigger set until the
			// next update occurs so the update will apply the correct
			// operation.
			_interactionActive = false;
		}
	};

	this.isInteractionActive = function() {
		return _interactionActive;
	};

	// ------------------------
	// Event handler callbacks:
	// These can use "this".

	this.handleWheelInput = function(delta) {
		if(this.isDragging)
			return false;

		//Auto-update the center of zoom (pivot) to center on the cursor
		//on mouse wheel.
		if(_navapi.getIs2D()) {
			// TODO: Perhaps this should be in the update method
			// to avoid unnecessary calls.
			var viewport = _navapi.getScreenViewport();
			var point = viewerImpl.intersectGround(_lastMouseX + viewport.width, _lastMouseY + viewport.height);
			this.utilities.setPivotPoint(point, true, true);
		}

		if(_navapi.getReverseZoomDirection())
			delta *= -1;

		_moveXYZ.z += delta;

		if(delta != 0.0)
			this.interactionStart(kWheel);

		return true;
	};

	this.resetKeys = function() {
		// Turn off any auto motion that may be stuck due to lost focus
		this.autoMove(-1, false);

		// Clear modifier states:
		_modifierState.SHIFT = 0;
		_modifierState.CONTROL = 0;
		_modifierState.ALT = 0;
		_modifierState.SPACE = 0;
	};

	this.autoMove = function(index, state) {
		if(!state || !this.isDragging) {
			if(index < 0)
				_autoMove[0] =
				_autoMove[1] =
				_autoMove[2] =
				_autoMove[3] =
				_autoMove[4] =
				_autoMove[5] = state;
			else
				_autoMove[index] = state;

			if(!state)
				this.interactionEnd(kKeyboard);

			this.interactionCheck();
		}
	};

	this.updateModifierState = function(event) {
		/* See SPK-930 and SPK-928
		_modifierState.CONTROL = ((isMac && event.metaKey) || (!isMac && event.ctrlKey)) ? 1 : 0;
		 */
		_modifierState.CONTROL = ((isMac && event.metaKey) || event.ctrlKey) ? 1 : 0;
		_modifierState.SHIFT = (event.shiftKey) ? 1 : 0;
		_modifierState.ALT = (event.altKey) ? 1 : 0;
	};

	this.handleKeyDown = function(event, keyCode) {
		this.updateModifierState(event);
		var handled = false;

		switch(keyCode) {
			case _keys.EQUALS:
				this.adjustSpeed(1);
				handled = true;
				break;
			case _keys.DASH:
				this.adjustSpeed(-1);
				handled = true;
				break;
			case _keys.ZERO:
				this.adjustSpeed(0);
				handled = true;
				break; // Reset dolly speed to default

			case _keys.LEFT:
				this.autoMove(0, true);
				handled = true;
				break;
			case _keys.RIGHT:
				this.autoMove(1, true);
				handled = true;
				break;
			case _keys.PAGEUP:
				this.autoMove(2, true);
				handled = true;
				break;
			case _keys.PAGEDOWN:
				this.autoMove(3, true);
				handled = true;
				break;
			case _keys.UP:
				this.autoMove(4, true);
				handled = true;
				break;
			case _keys.DOWN:
				this.autoMove(5, true);
				handled = true;
				break;

			default:
				return false;
		}
		if(!this.isDragging)
			this.interactionStart(kKeyboard);

		return handled;
	};

	this.handleKeyUp = function(event, keyCode) {
		this.updateModifierState(event);
		var handled = false;

		switch(keyCode) {
			case _keys.LEFT:
				this.autoMove(0, false);
				handled = true;
				break;
			case _keys.RIGHT:
				this.autoMove(1, false);
				handled = true;
				break;
			case _keys.PAGEUP:
				this.autoMove(2, false);
				handled = true;
				break;
			case _keys.PAGEDOWN:
				this.autoMove(3, false);
				handled = true;
				break;
			case _keys.UP:
				this.autoMove(4, false);
				handled = true;
				break;
			case _keys.DOWN:
				this.autoMove(5, false);
				handled = true;
				break;

			default:
				return false;
		}
		if(handled) {
			this.interactionEnd(kKeyboard);

			if(!_interactionActive)
				this.interactionCheck();
		}
		return handled;
	};

	function endsWith(str, suffix) {
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
	}

	function fingerSeparation(event) {
		var dx = event.pointers[1].clientX - event.pointers[0].clientX;
		var dy = event.pointers[1].clientY - event.pointers[0].clientY;
		return Math.sqrt(dx * dx + dy * dy);
	}

	this.handleDollyPan = function(event) {
		_lastMouseX = event.canvasX;
		_lastMouseY = event.canvasY;

		var viewport = _navapi.getScreenViewport();
		_moveXY.x = _lastMouseX;
		_moveXY.y = _lastMouseY;
		_moveXYZ.x = _moveXY.x / viewport.width;
		_moveXYZ.y = _moveXY.y / viewport.height;

		_pinchLength = fingerSeparation(event);

		var roll = THREE.Math.degToRad(event.rotation);
		_deltaRoll = roll - _prevRoll;
		if(Math.abs(_deltaRoll) > 1.0)
			_deltaRoll = 0;
		_prevRoll = roll;

		if(endsWith(event.type, "start")) {
			_prevPinchLength = _pinchLength;
			_prevPinchScale = 1.0;
			_deltaRoll = 0;
			_prevRoll = roll;
		}

		_pinchScale = event.scale;
	};

	this.handleGesture = function(event) {
		switch(event.type) {
			case "dragstart":
				_touchType = "drag";
				// Single touch, fake the mouse for now...
				return this.handleButtonDown(event, 0);

			case "dragmove":
				if(_touchType !== "drag") {
					this.handleButtonDown(event, 0);
					_touchType = "drag";
				}
				return this.handleMouseMove(event);

			case "dragend":
				// We seem to often get a lone dragend after a multi-touch.
				if(_touchType === "drag") {
					this.handleButtonUp(event, 0);
					_touchType = null;
					return true;
				}
				return false;

			case "panstart":
				_touchType = "pan";
				this.handlePanStart(event);
				this.handleDollyPan(event);
				return true;

			case "panmove":
				if(_touchType !== "pan") {
					_touchType = "pan";
					this.handlePanStart(event);
				}
				return this.handleDollyPan(event);

			case "panend":
				if(_touchType === "pan") {
					this.isDragging = false;
					this.handleDollyPan(event);
					this.interactionEnd(kTouch);
					return true;
				}
				return false;

			case "pinchstart":
				this.isDragging = true;
				_touchType = "pinch";

				_startXYZ.x = (event.normalizedX + 1.0) * 0.5;
				_startXYZ.y = 1.0 - (event.normalizedY + 1.0) * 0.5;

				_touchStartXY.set(event.canvasX, event.canvasY);
				_startXY.set(event.canvasX, event.canvasY);

				_activeModeLocked = false;
				this.interactionStart(kTouch);
				this.handleDollyPan(event);
				return true;

			case "pinchmove":
				return(_touchType === "pinch") ? this.handleDollyPan(event) : false;

			case "pinchend":
				if(_touchType === "pinch") {
					this.isDragging = false;
					this.handleDollyPan(event);
					this.interactionEnd(kTouch);
					return true;
				}
				return false;
		}
		return false
	};

	this.handleButtonDown = function(event, button) {
		this.updateModifierState(event);

		_startXYZ.x = (event.normalizedX + 1.0) * 0.5;
		_startXYZ.y = 1.0 - (event.normalizedY + 1.0) * 0.5;

		_startXY.set(event.canvasX, event.canvasY);
		_moveXYZ.copy(_startXYZ);
		_moveXY.copy(_startXY);

		_rotateStart.copy(getMouseProjectionOnBall(event.canvasX, event.canvasY));
		_rotateEnd.copy(_rotateStart);

		_lastMouseX = event.canvasX;
		_lastMouseY = event.canvasY;

		this.isDragging = true;

		this.interactionStart(button);
		return true;
	};

	this.handlePanStart = function(event) {
		this.isDragging = true;

		_startXYZ.x = (event.normalizedX + 1.0) * 0.5;
		_startXYZ.y = 1.0 - (event.normalizedY + 1.0) * 0.5;

		_touchStartXY.set(event.canvasX, event.canvasY);
		_startXY.set(event.canvasX, event.canvasY);

		this.interactionStart(kTouch);
		return true;
	};

	this.handleButtonUp = function(event, button) {
		this.updateModifierState(event);

		_moveXYZ.x = (event.normalizedX + 1.0) * 0.5;
		_moveXYZ.y = 1.0 - (event.normalizedY + 1.0) * 0.5;
		_moveXY.set(event.canvasX, event.canvasY);

		_rotateEnd.copy(getMouseProjectionOnBall(event.canvasX, event.canvasY));
		_rotateStart.copy(_rotateEnd);

		_lastMouseX = event.canvasX;
		_lastMouseY = event.canvasY;

		this.interactionEnd(button);

		this.isDragging = false;
		return true;
	};

	this.handleMouseMove = function(event) {
		this.updateModifierState(event);

		//Handles non-dragging mouse move over the canvas.
		//Updates the last known mouse point for
		//using during mouse wheel (as zoom center) and
		//will eventually be needed for mouse over highlighting
		if(!this.isDragging) {
			_startXYZ.x = (event.normalizedX + 1.0) * 0.5;
			_startXYZ.y = 1.0 - (event.normalizedY + 1.0) * 0.5;

			_startXY.set(event.canvasX, event.canvasY);
			_moveXYZ.x = _startXYZ.x;
			_moveXYZ.y = _startXYZ.y;
			_moveXY.copy(_startXY);

			_lastMouseX = event.canvasX;
			_lastMouseY = event.canvasY;

			//mouse over highlighting
			// TODO: Perhaps this should be in the update method
			// to avoid unnecessary calls.
			if(event.target === viewerImpl.canvas) {
				viewerImpl.rolloverObject(_lastMouseX, _lastMouseY);
			}

			return false;
		}
		_moveXYZ.x = (event.normalizedX + 1.0) * 0.5;
		_moveXYZ.y = 1.0 - (event.normalizedY + 1.0) * 0.5;
		_moveXY.set(event.canvasX, event.canvasY);

		_rotateEnd.copy(getMouseProjectionOnBall(event.canvasX, event.canvasY));

		_lastMouseX = event.canvasX;
		_lastMouseY = event.canvasY;

		return true;
	};

	this.handleBlur = function(event) {
		// Reset things when we lose focus...
		this.resetKeys();
		this.interactionEnd(_activeTrigger);
	};

	viewerApi.addEventListener(ZhiUTech.Viewing.ESCAPE_EVENT, function(event) {
		_this.handleBlur(event);
	});
};;



ZhiUTechNamespace('ZhiUTech.Viewing');

// /** @constructor */
//
// TODO: Pass in the api instead of the impl, don't use the impl object.
//
ZhiUTech.Viewing.HotGestureTool = function(viewerApi) {
	var isMac = (navigator.userAgent.search("Mac OS") != -1);
	var isActive = false;

	var _navapi = viewerApi.navigation;
	var _camera = _navapi.getCamera();
	var _names = ["hottouch"];

	var _modifierState = {
		SHIFT: 0,
		ALT: 0,
		CONTROL: 0
	};
	var _commandKeyDown = false;
	var _setMode = null;
	var _saveMode = null;
	var _fovActive = false;
	var _rollActive = false;
	var _startEvent = null;

	var _keys = {
		SHIFT: 16,
		CONTROL: 17,
		ALT: 18,
		ESCAPE: 27,
		LCOMMAND: 91,
		RCOMMAND: 93,
		COMMANDMOZ: 224
	};

	var ORBIT = "orbit";
	var ROLL = "worldup";
	var FOV = "fov";

	this.getNames = function() {
		return _names;
	};

	this.getName = function() {
		return _names[0];
	};

	this.activate = function(name) {};

	this.deactivate = function(name) {};

	this.__checkStart = function() {
		// Since the start event triggers the tool change we re-send the
		// start event so that the new tool can trigger from it.
		if(_startEvent) {
			this.controller.distributeEvent("handleGesture", _startEvent);
			_startEvent = null;
		}
	};

	this.update = function() {
		if(this.controller.getIsLocked())
			return false;

		var got = viewerApi.getActiveNavigationTool();
		var wantRoll = (_fovActive === false && _rollActive === true);
		var wantFov = (_fovActive === true && _rollActive === false);

		if(wantRoll || wantFov) {
			var want = wantRoll ? ROLL : FOV;

			if(got === want)
				return false;

			if(got === _setMode) // We set it we can change it
			{
				viewerApi.setActiveNavigationTool(want);
				_setMode = want;
				this.__checkStart();
				return false;
			}
			_saveMode = got;
			viewerApi.setActiveNavigationTool(want);
			_setMode = want;
			this.__checkStart();
		} else if(_setMode) {
			viewerApi.setActiveNavigationTool(_saveMode);
			_setMode = null;
			_saveMode = null;
		}
		return false;
	};

	this.resetKeys = function() {
		// Clear modifier states:
		_modifierState.SHIFT = 0;
		_modifierState.CONTROL = 0;
		_modifierState.ALT = 0;
	};

	this.updateModifierState = function(event) {
		_modifierState.CONTROL = event.ctrlKey ? 1 : 0;
		_modifierState.SHIFT = event.shiftKey ? 1 : 0;
		_modifierState.ALT = event.altKey ? 1 : 0;
	};

	this.handleGesture = function(event) {
		if(event === _startEvent)
			return false;

		switch(event.type) {
			case "drag3start":
				if(viewerApi.navigation.isActionEnabled('fov')) {
					_startEvent = event;
					_fovActive = true;
				}
				break;

			case "drag3move":
				break;

			case "drag3end":
				_fovActive = false;
				break;

			case "rotatestart":
				if(viewerApi.navigation.isActionEnabled('roll')) {
					_startEvent = event;
					_rollActive = true;
				}
				break;

			case "rotatemove":
				break;

			case "rotateend":
				_rollActive = false;
				break;
		}
		return false
	};

	this.handleKeyDown = function(event, keyCode) {
		this.updateModifierState(event);

		switch(keyCode) {
			// Do we need to consume these events?
			case _keys.SHIFT:
				_modifierState.SHIFT = 1;
				break;
			case _keys.CONTROL:
				_modifierState.CONTROL = 1;
				break;
			case _keys.ALT:
				_modifierState.ALT = 1;
				break;
		}
		return false;
	};

	this.handleKeyUp = function(event, keyCode) {
		this.updateModifierState(event);

		switch(keyCode) {
			// Do we need to consume these events?
			case _keys.SHIFT:
				_modifierState.SHIFT = 0;
				break;
			case _keys.CONTROL:
				_modifierState.CONTROL = 0;
				break;
			case _keys.ALT:
				_modifierState.ALT = 0;
				break;
		}
		return false;
	};

	this.handleButtonDown = function(event, button) {
		this.updateModifierState(event);
		return false;
	};

	this.handleButtonUp = function(event, button) {
		this.updateModifierState(event);
		return false;
	};

	this.handleMouseMove = function(event) {
		this.updateModifierState(event);
		return false;
	};

	this.handleBlur = function(event) {
		// Reset things when we lose focus...
		this.resetKeys();
		return false;
	};
};
'use strict';

ZhiUTechNamespace('ZhiUTech.Viewing.Private');

/**
 * @callback ZhiUTech.Viewing.HotkeyManager~onHotkeyPressCallback
 * @param {number[]} keycodes - The key combination that triggered this callback.
 * @returns {boolean} True if the press event was handled, false otherwise.
 */

/**
 * @callback ZhiUTech.Viewing.HotkeyManager~onHotkeyReleaseCallback
 * @param {number[]} keycodes - The key combination that triggered this callback.
 * @returns {boolean} True if the release event was handled, false otherwise.
 */

/**
 * @typedef {Object} ZhiUTech.Viewing.HotkeyManager~Hotkey
 * @property {number[]} keycodes - The keycode combination (order doesn't matter).
 * @property {ZhiUTech.Viewing.HotkeyManager~onHotkeyPressCallback} [onPress] - The callback used when the combination is engaged.
 * @property {ZhiUTech.Viewing.HotkeyManager~onHotkeyReleaseCallback} [onRelease] - The callback used when the combination is disengaged.
 */

/**
 * Management of hotkeys for the viewer.
 *
 * Access the members and methods via the singleton theHotkeyManager.
 * @constructor
 * @category Core
 */
ZhiUTech.Viewing.HotkeyManager = function() {
	var stack = []; // The hotkey stack

	var keys = []; // The keys that are currently held

	// Pending items
	var onPressQueue = [];
	var onReleaseQueue = [];

	/**
	 * Enum for keycodes.
	 * @readonly
	 * @enum {number}
	 */
	var KEYCODES = ZhiUTech.Viewing.KeyCode;

	var _names = ["hotkeys"];

	function getNames() {
		return _names;
	}

	function getName() {
		return _names[0];
	}

	// Apparently javascript sorts by string values by default so we need
	// our own sort function.
	function compare(a, b) {
		return a - b;
	}

	/**
	 * Pushes new hotkeys onto the stack.
	 *
	 * @param {string} id - The id for this hotkey set.
	 * @param {ZhiUTech.Viewing.HotkeyManager~Hotkey[]} hotkeys - The list of hotkeys.
	 * @param {object} [options] - An optional dictionary of options for this hotkey set.
	 * @param {boolean} [options.tryUntilSuccess] - When true, the onPress callback will be called until it returns true
	 * or the hotkey state changes. The onRelease callback will be called until it returns true or
	 * until the combination is reengaged. Stops propagation through the stack. Non-blocking.
	 * @returns {boolean} True if the hotkeys were successfully pushed.
	 */
	function pushHotkeys(id, hotkeys, options) {
		var idAlreadyUsed = stack.some(function(element) {
			return element.id === id;
		});

		if(idAlreadyUsed) {
			return false;
		}

		for(var i = 0; i < hotkeys.length; i++) {
			stack.push({
				id: id,
				keys: hotkeys[i].keycodes.sort(compare).join(),
				onPress: hotkeys[i].onPress,
				onRelease: hotkeys[i].onRelease,
				options: options || {}
			});
		}

		return true;
	}

	/**
	 * Removes hotkeys associated with an ID from the stack.
	 *
	 * @param {string} id - The id associated with the hotkeys.
	 * @returns {boolean} True if the hotkeys were successfully popped.
	 */
	function popHotkeys(id) {
		var found = false;
		for(var i = stack.length - 1; i >= 0; i--) {
			if(stack[i].id === id) {
				stack.splice(i, 1);
				found = true;
			}
		}

		return found;
	}

	function cleanQueues() {
		var index = keys.join();

		var item;
		var i;

		for(i = 0; i < onReleaseQueue.length;) {
			item = onReleaseQueue[i];
			if(item.keys === index) {
				onReleaseQueue.splice(i, 1);
			} else {
				i++;
			}
		}

		for(i = 0; i < onPressQueue.length;) {
			item = onPressQueue[i];
			if(item.keys !== index) {
				onPressQueue.splice(i, 1);
			} else {
				i++;
			}
		}
	}

	function handleKeyDown(event, keyCode) {
		if(keys.indexOf(keyCode) !== -1) {
			// Ignore duplicate key down events. (see ToolController.applyKeyMappings())
			return;
		}

		var currentIndex = keys.join();
		var currentKeys = keys.slice(0);

		var i = 0;
		while(i < keys.length && keys[i] < keyCode) {
			i++;
		}
		keys.splice(i, 0, keyCode);

		var newIndex = keys.join();
		var newKeys = keys.slice(0);

		cleanQueues();

		// Make sure onRelease is called before onPress
		var releaseHandlers = [];
		var pressHandlers = [];
		var item;

		for(i = stack.length - 1; i >= 0; i--) {
			item = stack[i];
			if(item.keys === currentIndex && item.onRelease) {
				releaseHandlers.unshift(item);
			} else if(item.keys === newIndex && item.onPress) {
				pressHandlers.unshift(item);
			}
		}

		for(i = releaseHandlers.length - 1; i >= 0; i--) {
			item = releaseHandlers[i];
			if(item.onRelease(currentKeys)) {
				break;
			} else if(item.options.tryUntilSuccess) {
				onReleaseQueue.unshift(item);
			}
		}

		for(i = pressHandlers.length - 1; i >= 0; i--) {
			item = pressHandlers[i];
			if(item.onPress(newKeys)) {
				break;
			} else if(item.options.tryUntilSuccess) {
				onPressQueue.unshift(item);
			}
		}
	}

	function handleKeyUp(event, keyCode) {
		var currentIndex = keys.join();
		var currentKeys = keys.slice(0);

		var i = keys.indexOf(keyCode);
		if(i > -1) {
			keys.splice(i, 1);
		}

		var newIndex = keys.join();
		var newKeys = keys.slice(0);

		cleanQueues();

		// Make sure onRelease is called before onPress
		var releaseHandlers = [];
		var pressHandlers = [];
		var item;

		for(i = stack.length - 1; i >= 0; i--) {
			item = stack[i];
			if(item.keys === currentIndex && item.onRelease) {
				releaseHandlers.unshift(item);
			} else if(item.keys === newIndex && item.onPress) {
				pressHandlers.unshift(item);
			}
		}

		for(i = releaseHandlers.length - 1; i >= 0; i--) {
			item = releaseHandlers[i];
			if(item.onRelease(currentKeys)) {
				break;
			} else if(item.options.tryUntilSuccess) {
				onReleaseQueue.unshift(item);
			}
		}

		for(i = pressHandlers.length - 1; i >= 0; i--) {
			item = pressHandlers[i];
			if(item.onPress(newKeys)) {
				break;
			} else if(item.options.tryUntilSuccess) {
				onPressQueue.unshift(item);
			}
		}
	}

	function update() {
		var item;
		var i;

		for(i = 0; i < onReleaseQueue.length;) {
			item = onReleaseQueue[i];
			if(item.onRelease(item.keys.split()) === true) {
				onReleaseQueue.splice(i, 1);
			} else {
				i++;
			}
		}

		for(i = 0; i < onPressQueue.length;) {
			item = onPressQueue[i];
			if(item.onPress(item.keys.split()) === true) {
				onPressQueue.splice(i, 1);
			} else {
				i++;
			}
		}

		return false;
	}

	function handleBlur() {
		// Release all keys.
		for(var i = keys.length - 1; i >= 0; i--) {
			handleKeyUp(null, keys[i]);
		}
	}

	return {
		pushHotkeys: pushHotkeys,
		popHotkeys: popHotkeys,
		handleKeyDown: handleKeyDown,
		handleKeyUp: handleKeyUp,
		handleBlur: handleBlur,
		getName: getName,
		getNames: getNames,
		activate: function() {},
		deactivate: function() {},
		update: update,
		KEYCODES: KEYCODES
	};
};

ZhiUTech.Viewing.theHotkeyManager = new ZhiUTech.Viewing.HotkeyManager();;
ZhiUTechNamespace('ZhiUTech.Viewing');

// /** @constructor */
//
// TODO: Pass in the api instead of the impl, don't use the impl object.
//
ZhiUTech.Viewing.FovTool = function(viewerApi) {
	var kScreenEpsilon = 0.001;
	var kEpsilon = 0.00001;
	var kFovDragScale = -1.0;
	var kDampingFactor = 0.6;
	var kWheelThresholdMs = 100;

	var _navapi = viewerApi.navigation;
	var _camera = _navapi.getCamera();
	var _names = ["fov"];

	var _interactionActive = false;

	var _wheelAccum = 0;
	var _wheelOldest = null;
	var _wheelNewest = null;
	var _wheelContinuous = false;

	var _mouseButtons = 0; // Track mouse buttons that are held

	// Interaction Triggers:
	var kNone = -5;
	var kWheel = -1;
	var kMouseLeft = 0;
	var kMouseMiddle = 1;
	var kMouseRight = 2;

	var _activeTrigger = kNone;
	var _startXYZ = new THREE.Vector3();
	var _moveXYZ = new THREE.Vector3();
	var _motionDelta = new THREE.Vector3();
	var _touchType = null;

	this.getNames = function() {
		return _names;
	};

	this.getName = function() {
		return _names[0];
	};

	this.activate = function(name) {
		_mouseButtons = 0;
	};

	this.deactivate = function(name) {
		_activeTrigger = kNone;
	};

	this.getCursor = function() {
		return _mouseButtons !== 0 && _activeTrigger === kNone ? null : "url(data:image/x-icon;base64,AAACAAEAGBgAAAAAAACICQAAFgAAACgAAAAYAAAAMAAAAAEAIAAAAAAAYAkAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlgAAAP8AAAD/AAAAlgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAACEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnAwMD/yEhIf8AAABmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAGknJyf/goKC/8/Pz/8aGhr/AAAALQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////AAAA/wAAAAAAAAAAAAAAAAAAAAAAAABTFBQU/2lpaf/MzMz///////////+Wlpb/AAAAlgAAAAAAAAAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAAAAAAlgAAAP8AAAD/AAAAlgAAAAAAAAAAAAAAOAAAAKFTU1P/t7e3////////////8PDw////////////AQEB/wAAAAEAAAAAAAAAFAAAAH0KCgr/AAAAYwAAAAAAAAAAAAAAlgAAAP8AAAD/AAAAlgAAAAAAAAAjCwsL/6Ghof/t7e3///////Dw8P9MTEz/LS0t//Pz8///////Ghoa/wAAABoAAAANDQ0N/319ff+rq6v/Y2Nj/wAAAK8AAABGAAAA////////////AAAA/wAAAF0hISH/jIyM////////////sLCw/xEREf8AAACHAAAArKysrP//////V1dX/wAAAFcAAABSUlJS//f39///////8PDw/6+vr/86Ojr/LS0t////////////FRUV/1xcXP/Gxsb/+Pj4//Hx8f9MTEz/AAAAsAAAAEcAAAAAAAAAZ2dnZ///////pKSk/wAAAKQAAACtra2t///////////////////////m5ub/kZGR/wAAAP8AAAD/q6ur//Hx8f//////vb29/x0dHf8AAACIAAAAAAAAAAAAAAAAAAAAOjo6Ov//////5+fn/wAAAOcAAADd3d3d////////////////////////////+/v7/9bW1v/i4uL//v7+//Pz8/9hYWH/AAAAvQAAAFQAAAAAAAAAAAAAAAAAAAAAAAAAJycnJ//6+vr//////wMDA/8AAADv7+/v/////////////////////////////////////////////////7y8vP8ODg7/AAAAKwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJiYmJv/6+vr//////wkJCf8AAADv7+/v//////////////////////////////////f39//9/f3//////+np6f+UlJT/GBgY/wAAAH0AAAACAAAAAAAAAAAAAAAAAAAAKSkpKf///////v7+/w0NDf8AAADd3d3d////////////////////////////29vb/39/f/+Xl5f/5+fn////////////5ubm/1RUVP8CAgL/AAAAPwAAAAAAAAAAAAAAOTk5Of//////8PDw/wgICP8AAAChoaGh/////////////////+np6f+YmJj/QkJC/wAAAP8AAAD/UFBQ/7e3t//39/f///////////+oqKj/EBAQ/wAAAIgAAAAAAAAAZ2dnZ///////29vb/wEBAf8AAAA4NTU1/9zc3P/t7e3/tbW1/01NTf8AAACYAAAA////////////AwMD/wsLC/9oaGj/y8vL////////////8fHx/zg4OP8AAACWAAAApaWlpf//////n5+f/wAAAJ8AAAAAAAAAczg4OP9LS0v/EhIS/wAAAE0AAAAAAAAA////////////FRUV/wAAABUAAABoJSUl/4GBgf/i4uL///////////9+fn7/Pz8///b29v//////SkpK/wAAAEoAAAAAAAAAAAAAADgAAABLAAAAEgAAAAAAAAAAAAAAlgAAAP8AAAD/AAAAlgAAAAAAAAAAAAAAJQAAAIE8PDz/np6e//z8/P/////////////////8/Pz/CQkJ/wAAAAkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlgAAAP8AAAD/AAAAlgAAAAAAAAAAAAAAAAAAAAAAAAA8DAwM/09PT/+7u7v///////////+QkJD/AAAAkwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////Dw8P/wAAAA8AAAAAAAAAAAAAAAAAAAAAAAAADAAAAFIYGBj/aGho/729vf8WFhb/AAAAJwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////FRUV/wAAABUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAQEB/w8PD/8AAABUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////DAwM/wAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlgAAAP8AAAD/AAAAlgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8x/h/nO/4fw1D+HwFy/h4BRu4YAHOGEABkAAAAXAAAIFwAAOBnAAHgIAAD4GUAAOB4AABgXAAAIGMAAABtggAAVMYYAHT+HgE7/g8BcP4Pw2/+D+dc/h//XP///2c=), auto";
	};

	this.getMotionDelta = function(dxyz) {
		var deltaX = _moveXYZ.x - _startXYZ.x;
		var deltaY = _moveXYZ.y - _startXYZ.y;
		var deltaZ = _moveXYZ.z - _startXYZ.z;

		if(Math.abs(deltaX) < kScreenEpsilon) deltaX = 0.0;
		if(Math.abs(deltaY) < kScreenEpsilon) deltaY = 0.0;
		if(Math.abs(deltaZ) < kScreenEpsilon) deltaZ = 0.0;

		dxyz.set(deltaX, deltaY, deltaZ);
	};

	this.stepMotionDelta = function(delta, damped) {
		if(damped) {
			_startXYZ.x += delta.x * kDampingFactor;
			_startXYZ.y += delta.y * kDampingFactor;
			_startXYZ.z += delta.z * kDampingFactor;
		} else
			_startXYZ.copy(_moveXYZ);
	};

	function promoteDelta(delta) {
		// promote a wheel delta to a full wheel stop (3)
		if(delta < 0 && delta > -3) {
			return -3;
		}
		return(delta > 0 && delta < 3) ? 3 : delta;
	}

	this.getAccumulatedWheelDelta = function() {
		var now = Date.now();
		var delta = 0;

		if(_wheelNewest && now - _wheelNewest > kWheelThresholdMs) {
			// Newest event in accumulator has aged out; assume wheel motion has stopped.
			delta = promoteDelta(_wheelAccum);
			_wheelAccum = 0;
			_wheelOldest = null;
			_wheelNewest = null;
			_wheelContinuous = false;
		} else if(_wheelOldest && (now - _wheelOldest) > kWheelThresholdMs) {
			// Oldest event in accumulator has aged out; process continuously.
			if(_wheelContinuous) {
				if(Math.abs(_wheelAccum) >= 3) {
					delta = _wheelAccum;
					_wheelAccum = 0;
				}
			} else {
				delta = promoteDelta(_wheelAccum);
				_wheelContinuous = true;
				_wheelAccum = 0;
			}
		}
		return delta;
	};

	this.update = function() {
		var wheelEnded = false;
		var updatePivot = _activeTrigger > kNone;

		if(_activeTrigger > kNone) {
			this.controller.setIsLocked(true);
			this.getMotionDelta(_motionDelta);

			var deltaX = _motionDelta.x;
			var deltaY = _motionDelta.y;
			var deltaZ = _motionDelta.z;

			if(deltaX !== 0.0 || deltaY !== 0.0 || deltaZ !== 0.0) {
				updatePivot = true;
				if(_activeTrigger >= kMouseLeft) {
					// Map XY movement to Z:
					deltaY = -deltaY; // Invert Y
					deltaZ = (Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY;
					if(deltaZ !== 0.0) {
						deltaZ *= kFovDragScale;
						_navapi.setVerticalFov(_navapi.getVerticalFov() * (1.0 + deltaZ), true);
					}
				} else {
					// Translate wheelAccum backwards to determine the number of wheel stops.
					var deltaFocalLength = this.getAccumulatedWheelDelta() / 3;
					if(deltaFocalLength !== 0.0)
						_navapi.setFocalLength(_navapi.getFocalLength() + deltaFocalLength, true);
				}
			}
			this.stepMotionDelta(_motionDelta, true);

			// If a wheel event triggered this we've now handled it,
			if(_activeTrigger === kWheel && Math.abs(deltaZ) < kEpsilon) {
				this.interactionEnd(kWheel);
				wheelEnded = true;
			}
		}

		if(updatePivot)
			this.utilities.pivotActive(_navapi.getPivotSetFlag(), true);
		else
			this.utilities.pivotUpdate();

		// If the interaction has "ended" we can now forget the trigger.
		if(!_interactionActive && (wheelEnded || (_activeTrigger > kNone))) {
			if(_activeTrigger > kWheel) {
				// Kill any ongoing damped motion if we aren't using
				// the wheel.
				_startXYZ.copy(_moveXYZ);
			}
			_activeTrigger = kNone;
			this.controller.setIsLocked(false);
		}
		return _camera.dirty;
	};

	this.interactionStart = function(trigger, force) {
		// Just a simple way to give device input a sort of priority 
		// so we don't have to track all active triggers. Just remember
		// the most recent with highest "priority".
		if(force || trigger > _activeTrigger) {
			// Perhaps we need to remember the modifier keys now.
			_activeTrigger = trigger;
			_interactionActive = true;
		}

		// Switch to perspective
		_navapi.toPerspective();
	};

	this.interactionEnd = function(trigger) {
		if(trigger === _activeTrigger) {
			if(trigger !== kWheel)
				this.utilities.pivotActive(false);

			// We have to leave the _activeTrigger set until the
			// next update occurs so the update will apply the correct
			// operation.
			_interactionActive = false;
		}
	};

	// ------------------------
	// Event handler callbacks:
	// These can use "this".

	this.handleWheelInput = function(delta) {
		if(_activeTrigger > kWheel)
			return false;

		// Match original reverse behaviour:
		if(_navapi.getReverseZoomDirection())
			delta *= -1;

		_moveXYZ.z += delta;
		_wheelAccum += delta;
		var now = Date.now();
		if(!_wheelOldest) {
			_wheelOldest = now;
		}
		_wheelNewest = now;

		if(delta != 0.0)
			this.interactionStart(kWheel);

		return true;
	};

	this.handleGesture = function(event) {
		switch(event.type) {
			case "dragstart":
				return this.handleButtonDown(event, 0);

			case "dragmove":
				return this.handleMouseMove(event);

			case "dragend":
				return this.handleButtonUp(event, 0);

			case "drag3start":
				_touchType = "drag";
				// Fake the mouse for now. Coord should be centroid.
				return this.handleButtonDown(event, 0);

			case "drag3move":
				return(_touchType === "drag") ? this.handleMouseMove(event) : false;

			case "drag3end":
				if(_touchType === "drag")
					this.handleButtonUp(event, 0);

				_touchType = null;
				// Sigh... minor hack
				// Can't consume the end event because the hot gesture
				// tool needs to see it to end the interaction.
				return false;
		}
		return false;
	};

	this.handleButtonDown = function(event, button) {
		_mouseButtons += 1 << button;

		if(button !== kMouseRight) {
			_startXYZ.x = (event.normalizedX + 1.0) * 0.5;
			_startXYZ.y = 1.0 - (event.normalizedY + 1.0) * 0.5;

			_moveXYZ.copy(_startXYZ);

			this.interactionStart(button);
			return true;
		}

		return false;
	};

	this.handleButtonUp = function(event, button) {
		_mouseButtons -= 1 << button;

		if(button !== kMouseRight) {
			_moveXYZ.x = (event.normalizedX + 1.0) * 0.5;
			_moveXYZ.y = 1.0 - (event.normalizedY + 1.0) * 0.5;

			this.interactionEnd(button);
			return true;
		}

		return false;
	};

	this.handleMouseMove = function(event) {
		_moveXYZ.x = (event.normalizedX + 1.0) * 0.5;
		_moveXYZ.y = 1.0 - (event.normalizedY + 1.0) * 0.5;
		return(_activeTrigger > kWheel);
	};

	this.handleBlur = function(event) {
		// Reset things when we lose focus...
		this.interactionEnd(_activeTrigger);
		return false;
	};

};;
ZhiUTechNamespace('ZhiUTech.Viewing');

// /** @constructor */
//
// TODO: Pass in the api instead of the impl, don't use the impl object.
//
ZhiUTech.Viewing.WorldUpTool = function(viewerImpl, viewerApi) {
	var kRingSizeMin = 0.35; // Proportion of screen height
	var kRingSizeMax = 0.80; // Proportion of screen height
	var kRingSizeDefault = 0.65; // Proportion of screen height

	var _navapi = viewerApi.navigation;
	var _camera = _navapi.getCamera();
	var _names = ["worldup"];
	var self = this;

	// Returns the projection of (x,y,z) onto the plane with this unit normal
	var projectAxis = function() {
		var projectionVec = new THREE.Vector3();

		return function(x, y, z, normal) {
			var vec = new THREE.Vector3(x, y, z);
			var projectionLength = normal.dot(vec);
			projectionVec.copy(normal);
			projectionVec.multiplyScalar(projectionLength);
			return vec.sub(projectionVec);
		}
	}();

	// /** @constructor */
	function RollInteraction(viewerImpl, camera) {
		var kRollColor = 0xBBBBBB;
		var kHudFov = 30;
		var kHudWorldScale = 2.0 * Math.tan(THREE.Math.degToRad(kHudFov * 0.5));

		var myMaterial = new THREE.MeshPhongMaterial({
			color: kRollColor,
			ambient: kRollColor,
			opacity: 0.5,
			transparent: true,
			depthTest: false,
			depthWrite: false,
		});

		// Preallocate these as work objects:
		var myVec1 = new THREE.Vector3();
		var myVec2 = new THREE.Vector3();
		var myRotate = new THREE.Quaternion();

		// Use our own camera for the Roll HUD:
		// var myCamera = camera.clone();   // There's a bug in Object3D.clone()
		var myCamera = new THREE.PerspectiveCamera(kHudFov, camera.aspect, camera.near, camera.far);
		var mySceneCamera = camera;
		var myRingScale = 1.0;
		var myRingSize = 1.0;
		var myLookAtPoint = null;
		var myReferenceCircle = null;
		var myReferenceXaxis = null;
		var myReferenceYaxis = null;
		var myReferenceZaxis = null;
		var myReferenceGeometry = null;
		var myReferenceUp = null;
		var mySnapPoints = null;
		var mySnapFlags = null;
		var mySnapAngles = new Array(6);
		var myClosestAngle = 0.0;
		var myRollAngle = 0.0;
		var myAnglesFlipped = false;
		var myCurrentlySnapped = true; // Assume initially true
		var mySnappedRoll = 0.0;
		var kSnapInThreshold = 5.0 * Math.PI / 180.0;
		var kSnapOutThreshold = 7.0 * Math.PI / 180.0;
		var myDistance = 1.0;

		var kNOSNAP = 1e3;
		var kAliasLengthThreshold = 0.1;

		viewerImpl.createOverlayScene("roll", null, null, myCamera);

		function angleDiff(a, b) {
			var diff = Math.abs(a - b);
			if(diff > kTwo_PI)
				return diff;

			return Math.min(kTwo_PI - diff, diff);
		}

		function isThisAxis(index, worldUp) {
			var snapVec = getSnapVector(index);
			if(snapVec.distanceToSquared(worldUp) < kEpsilon)
				return true;

			myVec2.set(-worldUp.x, -worldUp.y, -worldUp.z);
			return(snapVec.distanceToSquared(myVec2) < kEpsilon);
		}

		function filterSnapAngles(snapLengths, worldUp) {
			// For some rotation axes the snap angles for two axes can be close together.
			// Snapping to one or the other doesn't give expected results. This filters
			// the snap angles and removes one of the close angles. When two angles are
			// withing AliasSnapThreshold, one of the angles is removed. The one we keep
			// is the one with the longest projection length unless it happens to be the
			// current up direction.

			// This threshold should be greater than the snap out threshold plus the snap
			// in threshold so that when two snap points are close together there is room
			// to snap out of one and into the other.
			var kAliasSnapThreshold = kSnapInThreshold + kSnapOutThreshold + (2.0 * Math.PI / 180.0);

			for(var i = 0; i < 6; ++i) {
				if(mySnapAngles[i] === kNOSNAP)
					continue;

				for(var j = i + 1; j < 6; ++j) {
					if(mySnapAngles[j] === kNOSNAP)
						continue;

					var diff = angleDiff(mySnapAngles[i], mySnapAngles[j]);

					if(diff < kAliasSnapThreshold) {
						if((snapLengths[i] < snapLengths[j] && !isThisAxis(i, worldUp)) ||
							isThisAxis(j, worldUp)) {
							mySnapAngles[i] = kNOSNAP;
							break; // angle i is removed stop checking
						} else
							mySnapAngles[j] = kNOSNAP;
					}
				}
			}
		}

		// Calculate the opposite angle from angle. angle should be
		// from -PI to PI, or kNOSNAP
		function oppositeAngle(angle) {
			if(angle > kTwo_PI)
				return angle;
			if(angle <= 0.0)
				return angle + Math.PI;
			return angle - Math.PI;
		}

		function updateSnapPoints(viewVec, cameraUp, worldUp) {
			var normal = viewVec.clone().normalize();
			var snaps = new Array(3);
			var lengths = new Array(6);

			// Project the 6 axis vectors onto the view plane:
			snaps[0] = projectAxis(1.0, 0.0, 0.0, normal);
			snaps[1] = projectAxis(0.0, 1.0, 0.0, normal);
			snaps[2] = projectAxis(0.0, 0.0, 1.0, normal);

			var i;
			var left = cameraUp.clone().cross(normal).normalize();

			for(i = 0; i < 3; ++i) {
				var snap = snaps[i];
				lengths[i] = snap.length();

				// A short projection length means the axis was too close to
				// the view vector:
				if(lengths[i] < kAliasLengthThreshold) {
					mySnapAngles[i] = kNOSNAP;
				} else {
					snap.multiplyScalar(1.0 / lengths[i]);
					mySnapAngles[i] = Math.atan2(left.dot(snap), cameraUp.dot(snap));
				}
			}
			mySnapAngles[3] = oppositeAngle(mySnapAngles[0]);
			mySnapAngles[4] = oppositeAngle(mySnapAngles[1]);
			mySnapAngles[5] = oppositeAngle(mySnapAngles[2]);
			lengths[3] = lengths[0];
			lengths[4] = lengths[1];
			lengths[5] = lengths[2];

			filterSnapAngles(lengths, worldUp);

			for(i = 0; i < 6; ++i) {
				if(mySnapAngles[i] !== kNOSNAP) {
					var z = myVec2.set(0.0, 0.0, 1.0);
					myRotate.setFromAxisAngle(z, mySnapAngles[i]);
					// The radius of the circle is 0.5 so place the points
					// just outside the circle:
					var pos = myVec2.set(0.0, 0.54, 0.0);
					pos.applyQuaternion(myRotate);
					mySnapPoints[i].position.copy(pos);
					mySnapPoints[i].visible = true;
				} else
					mySnapPoints[i].visible = false;
			}
		}

		function buildReferenceGeometry() {
			myReferenceGeometry = new THREE.Object3D();

			// The roll hud geometry is built with unit diameter and then scaled
			// to world space later.
			var geom = new THREE.RingGeometry(0.5 - 0.01 * myRingScale, 0.5, 60);
			var circle = new THREE.Mesh(geom, myMaterial);

			myReferenceCircle = circle;

			var thick = 0.007 * myRingScale;
			var geomX = new THREE.BoxGeometry(0.930, thick, thick);
			var geomY = new THREE.BoxGeometry(thick, 0.930, thick);
			var geomZ = new THREE.BoxGeometry(thick, thick, 0.930);

			myReferenceXaxis = new THREE.Mesh(geomX, myMaterial);
			myReferenceYaxis = new THREE.Mesh(geomY, myMaterial);
			myReferenceZaxis = new THREE.Mesh(geomZ, myMaterial);

			myReferenceGeometry.add(myReferenceXaxis);
			myReferenceGeometry.add(myReferenceYaxis);
			myReferenceGeometry.add(myReferenceZaxis);

			myReferenceUp = new THREE.Mesh(new THREE.CircleGeometry(0.005), myMaterial);
			myReferenceGeometry.add(myReferenceUp);

			mySnapPoints = new Array(6);
			mySnapFlags = new Array(6);
			for(var i = 0; i < 6; ++i) {
				var r1 = 0.0050 * myRingScale;
				var r2 = 0.0025 * myRingScale;
				mySnapPoints[i] = new THREE.Mesh(new THREE.CircleGeometry(r1, 16), myMaterial);
				mySnapFlags[i] = new THREE.Mesh(new THREE.CircleGeometry(r2, 16), myMaterial);
				mySnapFlags[i].visible = false;
				mySnapPoints[i].add(mySnapFlags[i]);
				circle.add(mySnapPoints[i]);
			}
			myReferenceGeometry.add(circle);

			return myReferenceGeometry;
		}

		function getReferenceGeometry(scale, lookAtPoint, viewVec, worldUp, cameraUp) {
			if(!myReferenceGeometry)
				myReferenceGeometry = buildReferenceGeometry();

			_navapi.orient(myReferenceCircle, lookAtPoint, myCamera.position, worldUp);

			updateSnapPoints(viewVec, cameraUp, worldUp);

			myReferenceGeometry.scale.x = scale;
			myReferenceGeometry.scale.y = scale;
			myReferenceGeometry.scale.z = scale;

			myReferenceGeometry.position.copy(lookAtPoint);

			return myReferenceGeometry;
		}

		function getSnapVector(index) {
			myVec1.set(0.0, 0.0, 0.0);
			if(index >= 0) {
				var v = (index >= 3) ? -1 : 1;
				index %= 3;
				if(index === 0) myVec1.x = v;
				if(index === 1) myVec1.y = v;
				if(index === 2) myVec1.z = v;
			}
			if(myAnglesFlipped)
				myVec1.multiplyScalar(-1);

			return myVec1;
		}

		function closestSnap(dtheta, snapThresh) {
			var diff = angleDiff(mySnapAngles[0], dtheta);
			var closest = 0;
			for(var i = 1; i < 6; ++i) {
				var d = angleDiff(mySnapAngles[i], dtheta);
				if(d < diff) {
					diff = d;
					closest = i;
				}
			}
			myClosestAngle = diff;
			return(diff < snapThresh) ? closest : -1;
		}

		function setWorldUp(upvec) {
			_navapi.setWorldUpVector(upvec, true);
		}

		function applyRoll(angle) {
			if(angle === 0.0)
				return;

			var kStableRollThreshold = 30.0 * Math.PI / 180.0;
			var view = myVec2.copy(myCamera.position).sub(myLookAtPoint).normalize();

			// Create a quaterion rotation about the roll axis by the angle:
			myRotate.setFromAxisAngle(view, angle);

			// Check the angle between the view vector and the world up.
			// When we get close the roll about the view vector becomes unstable
			// so we jump the up vector to the camera's current vertical.
			// This should be OK because if we're here we know we aren't snapped.
			var up = _navapi.getWorldUpVector();
			var viewUpAngle = Math.abs(view.angleTo(up));
			if(viewUpAngle < kStableRollThreshold || (Math.PI - viewUpAngle) < kStableRollThreshold) {
				up.copy(_navapi.getCameraUpVector()); // This is the actual camera up
			}
			// Rotate the current up vector by that quaternion:
			up.applyQuaternion(myRotate);

			setWorldUp(up);
		}

		function justNowSnapped() {
			if(!myCurrentlySnapped) {
				var closest = closestSnap(myRollAngle, kSnapInThreshold);
				if(closest >= 0) {
					myClosestAngle = 0.0;
					myCurrentlySnapped = true;
					myRollAngle = mySnapAngles[closest];
					return getSnapVector(closest);
				}
			}
			return false;
		}

		function justNowUnsnapped() {
			if(myCurrentlySnapped) {
				var closest = closestSnap(myRollAngle, kSnapOutThreshold);
				if(closest < 0) {
					myCurrentlySnapped = false;
					return true;
				}
				myClosestAngle = 0.0;
			}
			return false;
		}

		function isReallySnapped(angle, threshold, i, worldUp) {
			var circleSnapped = (angle < threshold);
			if(circleSnapped) {
				// Check if the up direction really is the same:
				var snapUp = getSnapVector(i);
				return(snapUp.distanceToSquared(worldUp) < kEpsilon);
			}
			return false;
		}

		function updateIndicators(worldUp, cameraUp) {
			// Check if the camera is upside down. If so, up is down.
			var wDotC = worldUp.dot(cameraUp);
			var flipped = (wDotC < 0.0);
			if(flipped)
				cameraUp = cameraUp.clone().multiplyScalar(-1);

			// Need to re-orient and position the UP indicator.
			// The scalar is the middle radius of the ring geometry.
			_navapi.orient(myReferenceUp, myLookAtPoint, myCamera.position, cameraUp);
			myReferenceUp.position.copy(cameraUp.multiplyScalar(0.495));

			var isSnapped = false;
			var threshold = myCurrentlySnapped ? kSnapOutThreshold : kSnapInThreshold;
			for(var i = 0; i < 6; ++i) {
				var angle = angleDiff(mySnapAngles[i], myRollAngle);
				var snapped = isReallySnapped(angle, threshold, i, worldUp);
				if(snapped)
					isSnapped = true;
				var proximityScale = snapped ? 4.0 : (1.0 - 3.0 * angle / Math.PI) * 3.0;
				if(proximityScale < 1.0)
					proximityScale = 1.0;

				// Keep the snap point sizes independent of the ring size:
				proximityScale *= myRingScale;

				// This turns off/on the inner snap indicator circle within
				// each of the snap points:
				mySnapFlags[i].visible = snapped;
				var snap = mySnapPoints[i];
				snap.scale.x = proximityScale;
				snap.scale.y = proximityScale;
				snap.scale.z = proximityScale;
			}
			myReferenceXaxis.visible = isSnapped;
			myReferenceYaxis.visible = isSnapped;
			myReferenceZaxis.visible = isSnapped;

			return isSnapped;
		}

		this.updateRollCamera = function(size, distance) {
			myCamera.position.copy(mySceneCamera.position);
			myCamera.quaternion.copy(mySceneCamera.quaternion);
			myCamera.up.copy(mySceneCamera.up);
			myCamera.aspect = mySceneCamera.aspect;

			if(size && distance) {
				myCamera.near = distance - size;
				myCamera.far = distance + size;
			}
			myCamera.updateProjectionMatrix();
		};

		this.isSnapped = function() {
			return myCurrentlySnapped;
		};

		this.resize = function() {
			var worldHeight = myDistance * kHudWorldScale;
			var worldWidth = worldHeight * mySceneCamera.aspect;
			var worldSize = ((mySceneCamera.aspect < 1.0) ? worldWidth : worldHeight) * myRingSize;

			myReferenceGeometry.scale.x = worldSize;
			myReferenceGeometry.scale.y = worldSize;
			myReferenceGeometry.scale.z = worldSize;
		};

		// TODO: Check for rolled camera and re-orient to up before setting up HUD.
		this.start = function(lookAtPoint, ringSize) {
			this.updateHUD(lookAtPoint, ringSize);
			viewerImpl.addOverlay("roll", myReferenceGeometry);
		};

		this.updateHUD = function(lookAtPoint, ringSize) {
			myLookAtPoint = lookAtPoint;

			if(ringSize < kRingSizeMin)
				ringSize = kRingSizeMin;
			else if(ringSize > kRingSizeMax)
				ringSize = kRingSizeMax;

			myRingSize = ringSize;
			myRingScale = kRingSizeMax / ringSize;

			var viewVec = myVec1.copy(lookAtPoint).sub(mySceneCamera.position);
			myDistance = viewVec.length();

			var worldHeight = myDistance * kHudWorldScale;
			var worldWidth = worldHeight * mySceneCamera.aspect;
			var worldSize = ((mySceneCamera.aspect < 1.0) ? worldWidth : worldHeight) * ringSize;

			this.updateRollCamera(worldSize, myDistance);

			var worldUp = _navapi.getWorldUpVector();
			var cameraUp = _navapi.getCameraUpVector();
			getReferenceGeometry(worldSize, lookAtPoint, viewVec, worldUp, cameraUp);
			myRollAngle = 0.0;
			mySnappedRoll = 0.0;

			var wDotC = worldUp.dot(cameraUp);
			myAnglesFlipped = (wDotC < 0.0);

			myCurrentlySnapped = updateIndicators(worldUp, cameraUp);
		};

		this.handleRoll = function(dx, dy, p2) {
			this.updateRollCamera();

			updateIndicators(_navapi.getWorldUpVector(), _navapi.getCameraUpVector());

			if(dx !== 0.0 || dy !== 0.0) {
				// 2D vectors from the center of the screen (0.5, 0.5)
				var v1x = p2.x - dx - 0.5;
				var v1y = p2.y - dy - 0.5;
				var v2x = p2.x - 0.5;
				var v2y = p2.y - 0.5;

				// Angle between those to vectors is the rotation of the mouse
				// around the center of the screen:
				return handleRollByAngle(Math.atan2(v2y, v2x) - Math.atan2(v1y, v1x));
			}
			return false;
		};

		this.handleRollTouch = function(angle) {
			this.updateRollCamera();

			updateIndicators(_navapi.getWorldUpVector(), _navapi.getCameraUpVector());

			var delta = angle - myRollAngle;
			return(Math.abs(delta) > 0.001) ? handleRollByAngle(delta) : false;
		};

		function handleRollByAngle(angle) {
			// Make sure it's in the right range for comparison with the
			// snap angles:
			myRollAngle += angle;
			if(myRollAngle > Math.PI)
				myRollAngle = myRollAngle - kTwo_PI;
			else if(myRollAngle <= -Math.PI)
				myRollAngle = kTwo_PI + myRollAngle;

			var snappedUp = justNowSnapped();
			if(snappedUp) {
				mySnappedRoll = myRollAngle;
				setWorldUp(snappedUp);
			} else if(justNowUnsnapped()) {
				// Because the snap points are "sticky" the roll amount
				// in this case is the distance from the snap point:
				var deltaRoll = myRollAngle - mySnappedRoll;
				applyRoll(deltaRoll);
				mySnappedRoll = 0.0;
			} else if(!myCurrentlySnapped) {
				applyRoll(angle);
			} else
				return false;

			return true;
		}

		this.end = function() {
			viewerImpl.removeOverlay("roll", myReferenceGeometry);
		};
	}

	var kTwo_PI = 2.0 * Math.PI; // 360 degrees.
	var kScreenEpsilon = 0.001;
	var kEpsilon = 0.00001;

	var _isDragging = false;
	var _needNextRefresh = false;
	var _started = false;

	var _rollInteraction = new RollInteraction(viewerImpl, _camera);
	var _startXYZ = new THREE.Vector3();
	var _moveXYZ = new THREE.Vector3();
	var _motionDelta = new THREE.Vector3();
	var _touchType = null;
	var _touchAngle = 0.0;
	var _touchCenter = {
		x: 0.5,
		y: 0.5
	};
	var _touchDistance = 1.0;

	this.getNames = function() {
		return _names;
	};

	this.getName = function() {
		return _names[0];
	};

	this.activate = function(name) {
		viewerApi.addEventListener(ZhiUTech.Viewing.CAMERA_CHANGE_EVENT, this.handleCameraChange);
		_started = false;
	};

	this.deactivate = function(name) {
		_rollInteraction.end();
		viewerApi.removeEventListener(ZhiUTech.Viewing.CAMERA_CHANGE_EVENT, this.handleCameraChange);
		this.utilities.restorePivot();
		_touchType = null;

		_isDragging = false;
		_started = false;
	};

	this.getCursor = function() {
		return "auto";
	};

	this.getMotionDelta = function(dxyz) {
		var deltaX = _moveXYZ.x - _startXYZ.x;
		var deltaY = _moveXYZ.y - _startXYZ.y;
		var deltaZ = _moveXYZ.z - _startXYZ.z;

		if(Math.abs(deltaX) < kScreenEpsilon) deltaX = 0.0;
		if(Math.abs(deltaY) < kScreenEpsilon) deltaY = 0.0;
		if(Math.abs(deltaZ) < kScreenEpsilon) deltaZ = 0.0;

		dxyz.set(deltaX, deltaY, deltaZ);
	};

	this.stepMotionDelta = function() {
		_startXYZ.copy(_moveXYZ);
	};

	this.update = function() {
		if(!_started) {
			// Stash the current COI and while the interaction is active
			// use the center of the view as the pivot for rolling.
			//
			// Position the temporary COI half way between the near and far
			// clipping planes to avoid clipping problems:
			//
			var viewVec = _navapi.getEyeVector();
			var distance = (_camera.near + _camera.far) * 0.5;
			viewVec.normalize().multiplyScalar(distance);
			var target = viewVec.add(_camera.position);

			this.utilities.savePivot();
			this.utilities.setPivotPoint(target, true, true);
			this.utilities.pivotActive(true);

			// var ringSize = (_touchType === "roll") ? _touchDistance : kRingSizeDefault;
			var ringSize = kRingSizeDefault;
			_rollInteraction.start(target, ringSize);
			_started = true;
		}

		var moved = _needNextRefresh;

		this.getMotionDelta(_motionDelta);

		var deltaX = _motionDelta.x;
		var deltaY = _motionDelta.y;
		var deltaZ = _motionDelta.z;

		if(_needNextRefresh || _touchType === "roll" || _isDragging && (deltaX !== 0.0 || deltaY !== 0.0 || deltaZ !== 0.0)) {
			if(_touchType === "roll")
				_needNextRefresh = _rollInteraction.handleRollTouch(_touchAngle);
			else
				_needNextRefresh = _rollInteraction.handleRoll(deltaX, deltaY, _moveXYZ);
		}
		this.stepMotionDelta();

		if(_camera.dirty)
			moved = true;

		return moved;
	};

	this.handleResize = function() {
		_rollInteraction.resize();
		_needNextRefresh = true;
	};

	function fingerSeparation(event) {
		var dx = event.pointers[1].clientX - event.pointers[0].clientX;
		var dy = event.pointers[1].clientY - event.pointers[0].clientY;
		var dist = Math.sqrt(dx * dx + dy * dy);

		// Normalize:
		var vp = _navapi.getScreenViewport();
		return dist / Math.min(vp.width, vp.height);
	}

	this.handleGesture = function(event) {
		switch(event.type) {
			// Single touch, fake the mouse for now...
			case "dragstart":
				_touchType = "drag";
				return this.handleButtonDown(event, 0);

			case "dragmove":
				return this.handleMouseMove(event);

			case "dragend":
				_touchType = null;
				return this.handleButtonUp(event, 0);

				// Rotate gesture detected:
			case "rotatestart":
				viewerApi.removeEventListener(ZhiUTech.Viewing.CAMERA_CHANGE_EVENT, this.handleCameraChange);
				_touchType = "roll";
				_touchAngle = THREE.Math.degToRad(event.rotation);
				_touchCenter = {
					x: (event.normalizedX + 1.0) * 0.5,
					y: 1.0 - (event.normalizedY + 1.0) * 0.5
				};
				_touchDistance = fingerSeparation(event);
				return true;

			case "rotatemove":
				_touchAngle = THREE.Math.degToRad(event.rotation);
				return(_touchType === "roll");

			case "rotateend":
				viewerApi.addEventListener(ZhiUTech.Viewing.CAMERA_CHANGE_EVENT, this.handleCameraChange);
				_touchAngle = THREE.Math.degToRad(event.rotation);
				_touchType = null;

				// Sigh... minor hack
				// Can't consume the end event because the hot gesture
				// tool needs to see it to end the interaction.
				return false;
		}
		return false;
	};

	this.handleWheelInput = function(delta) {
		// Disable wheel while roll active:
		return true;
	};

	this.handleCameraChange = function() {
		var viewVec = _navapi.getEyeVector();
		var distance = (_camera.near + _camera.far) * 0.5;
		viewVec.normalize().multiplyScalar(distance);
		var target = viewVec.add(_camera.position);

		// Setting the pivot causes an infinite loop of camera changed events. Is it necessary to set it?
		//this.utilities.savePivot();
		//this.utilities.setPivotPoint( target, true, true );
		//this.utilities.pivotActive(true);

		_rollInteraction.updateHUD(target, kRingSizeDefault);
	};

	this.handleButtonDown = function(event, button) {
		_startXYZ.x = (event.normalizedX + 1.0) * 0.5;
		_startXYZ.y = 1.0 - (event.normalizedY + 1.0) * 0.5;

		_moveXYZ.copy(_startXYZ);

		_isDragging = true;
		_touchType = null;

		this.controller.setIsLocked(true);

		viewerApi.removeEventListener(ZhiUTech.Viewing.CAMERA_CHANGE_EVENT, self.handleCameraChange);

		return true;
	};

	this.handleButtonUp = function(event, button) {
		_moveXYZ.x = (event.normalizedX + 1.0) * 0.5;
		_moveXYZ.y = 1.0 - (event.normalizedY + 1.0) * 0.5;

		_isDragging = false;
		_needNextRefresh = true; // To accept final motion.

		this.controller.setIsLocked(false);

		viewerApi.addEventListener(ZhiUTech.Viewing.CAMERA_CHANGE_EVENT, self.handleCameraChange);

		return true;
	};

	this.handleMouseMove = function(event) {
		_moveXYZ.x = (event.normalizedX + 1.0) * 0.5;
		_moveXYZ.y = 1.0 - (event.normalizedY + 1.0) * 0.5;
		return true;
	};

	this.handleBlur = function(event) {
		_isDragging = false;
		_touchType = null;
		return false;
	};

};;
ZhiUTechNamespace('ZhiUTech.Viewing');

/**
 * Base class for new interaction tools.
 *
 * Can also be used simply as a template for creating a new tool.
 * @constructor
 * @see ZhiUTech.Viewing.ToolController
 * @category Core
 */
ZhiUTech.Viewing.ToolInterface = function() {
	this.names = ["unnamed"];

	/**
	 * This method should return an array containing the names of all tools implemented by this class.
	 * Often this would be a single name but it is possible to support multiple interactions with a single tool.
	 * When this tool is registered with the ToolController each name gets registered as an available tool.
	 * @returns {array} Array of strings. Should not be empty.
	 */
	this.getNames = function() {
		return this.names;
	};

	/**
	 * This is an optional convenience method to obtain the first name of this tool.
	 * @returns {string} The tools default name.
	 */
	this.getName = function() {
		return this.names[0];
	};

	/**
	 * This method should return the priority of the tool inside the tool stack.
	 * A tool with higher priority will get events first.
	 * @returns {number} The tool's priority.
	 */
	this.getPriority = function() {
		return 0;
	};

	/**
	 * This method is called by {@link ZhiUTech.Viewing.ToolController#registerTool}.
	 * Use this for initialization.
	 */
	this.register = function() {};

	/**
	 * This method is called by {@link ZhiUTech.Viewing.ToolController#deregisterTool}.
	 * Use this to clean up your tool.
	 */
	this.deregister = function() {};

	/**
	 * The activate method is called by the ToolController when it adds this tool to the list of those
	 * to receive event handling calls. Once activated, a tool's "handle*" methods may be called
	 * if no other higher priority tool handles the given event. Each active tool's "update" method also gets
	 * called once during each redraw loop.
	 * @param {string} name - The name under which the tool has been activated.
	 * @param {ZhiUTech.Viewing.Viewer3D} viewerApi - Viewer instance.
	 */
	this.activate = function(name, viewerApi) {};

	/**
	 * The deactivate method is called by the ToolController when it removes this tool from the list of those
	 * to receive event handling calls. Once deactivated, a tool's "handle*" methods and "update" method
	 * will no longer be called.
	 * @param {string} name - The name under which the tool has been deactivated.
	 */
	this.deactivate = function(name) {};

	/**
	 * The update method is called by the ToolController once per frame and provides each tool
	 * with the oportunity to make modifications to the scene or the view.
	 * @param {number} highResTimestamp - The process timestamp passed to requestAnimationFrame by the web browser.
	 * @returns {boolean} A state value indicating whether the tool has modified the view or the scene
	 * and a full refresh is required.
	 */
	this.update = function(highResTimestamp) {
		return false;
	};

	/**
	 * This method is called when a single mouse button click occurs.
	 * @param {MouseEvent} event - The event object that triggered this call.
	 * @param {number} button - The button number that was clicked (0, 1, 2 for Left, Middle, Right respectively).
	 * Note that the button parameter value may be different that the button value indicated in the event
	 * object due to button re-mapping preferences that may be applied. This value should be respected
	 * over the value in the event object.
	 * @returns {boolean} True if this tool wishes to consume the event and false to continue to pass
	 * the event to lower priority active tools.
	 */
	this.handleSingleClick = function(event, button) {
		return false;
	};

	/**
	 * This method is called when a double mouse button click occurs.
	 * @param {MouseEvent} event - The event object that triggered this call.
	 * @param {number} button - The button number that was clicked (0, 1, 2 for Left, Middle, Right respectively).
	 * Note that the button parameter value may be different that the button value indicated in the event
	 * object due to button re-mapping preferences that may be applied. This value should be respected
	 * over the value in the event object.
	 * @returns {boolean} True if this tool wishes to consume the event and false to continue to pass the event
	 * to lower priority active tools.
	 */
	this.handleDoubleClick = function(event, button) {
		return false;
	};

	/**
	 * This method is called when a single tap on a touch device occurs.
	 * @param {Event} event - The triggering event. For tap events the canvasX, canvasY properties contain
	 * the canvas relative device coordinates of the tap and the normalizedX, normalizedY properties contain
	 * the tap coordinates in the normalized [-1, 1] range. The event.pointers array will contain
	 * either one or two touch events depending on whether the tap used one or two fingers.
	 * @returns {boolean} True if this tool wishes to consume the event and false to continue to pass the event
	 * to lower priority active tools.
	 */
	this.handleSingleTap = function(event) {
		return false;
	};

	/**
	 * This method is called when a double tap on a touch device occurs.
	 * @param {Event} event - The triggering event. For tap events the canvasX, canvasY properties contain
	 * the canvas relative device coordinates of the tap and the normalizedX, normalizedY properties contain
	 * the tap coordinates in the normalized [-1, 1] range. The event.pointers array will contain
	 * either one or two touch events depending on whether the tap used one or two fingers.
	 * @returns {boolean} True if this tool wishes to consume the event and false to continue to pass the event
	 * to lower priority active tools.
	 */
	this.handleDoubleTap = function(event) {
		return false;
	};

	/**
	 * This method is called when a keyboard button is depressed.
	 * @param {KeyboardEvent} event - The event object that triggered this call.
	 * @param {number} keyCode - The numerical key code identifying the key that was depressed.
	 * Note that the keyCode parameter value may be different that the value indicated in the event object
	 * due to key re-mapping preferences that may be applied. This value should be respected
	 * over the value in the event object.
	 * @returns {boolean} True if this tool wishes to consume the event and false to continue to pass the event
	 * to lower priority active tools.
	 */
	this.handleKeyDown = function(event, keyCode) {
		return false;
	};

	/**
	 * This method is called when a keyboard button is released.
	 * @param {KeyboardEvent} event - The event object that triggered this call.
	 * @param {number} keyCode - The numerical key code identifying the key that was released.
	 * Note that the keyCode parameter value may be different that the value indicated in the event object
	 * due to key re-mapping preferences that may be applied. This value should be respected
	 * over the value in the event object.
	 * @returns {boolean} True if this tool wishes to consume the event and false to continue to pass the event
	 * to lower priority active tools.
	 */
	this.handleKeyUp = function(event, keyCode) {
		return false;
	};

	/**
	 * This method is called when a mouse wheel event occurs.
	 * @param {number} delta - A numerical value indicating the amount of wheel motion applied.
	 * Note that this value may be modified from the orignal event values so as to provide consistent results
	 * across browser families.
	 * @returns {boolean} True if this tool wishes to consume the event and false to continue to pass the event
	 * to lower priority active tools.
	 */
	this.handleWheelInput = function(delta) {
		return false;
	};

	/**
	 * This method is called when a mouse button is depressed.
	 * @param {MouseEvent} event - The event object that triggered this call.
	 * @param {Number} button - The button number that was depressed (0, 1, 2 for Left, Middle, Right respectively).
	 * Note that the button parameter value may be different that the button value indicated in the event object
	 * due to button re-mapping preferences that may be applied. This value should be respected
	 * over the value in the event object.
	 * @returns {boolean} True if this tool wishes to consume the event and false to continue to pass the event
	 * to lower priority active tools.
	 */
	this.handleButtonDown = function(event, button) {
		return false;
	};

	/**
	 * This method is called when a mouse button is released.
	 * @param {MouseEvent} event - The event object that triggered this call.
	 * @param {number} button - The button number that was released (0, 1, 2 for Left, Middle, Right respectively).
	 * Note that the button parameter value may be different that the button value indicated in the event object
	 * due to button re-mapping preferences that may be applied. This value should be respected
	 * over the value in the event object.
	 * @returns {boolean} True if this tool wishes to consume the event and false to continue to pass the event
	 * to lower priority active tools.
	 */
	this.handleButtonUp = function(event, button) {
		return false;
	};

	/**
	 * This method is called when a mouse motion event occurs.
	 * @param {MouseEvent} event - The event object that triggered this call.
	 * @returns {boolean} True if this tool wishes to consume the event and false to continue to pass the event
	 * to lower priority active tools.
	 */
	this.handleMouseMove = function(event) {
		return false;
	};

	/**
	 * This method is called when a touch gesture event occurs.
	 * @param {Event} event - The event object that triggered this call. The event.type attribute will indicate
	 * the gesture event type. This will be one of: dragstart, dragmove, dragend, panstart, panmove, panend,
	 * pinchstart, pinchmove, pinchend, rotatestart, rotatemove, rotateend, drag3start, drag3move, drag3end.
	 * The event.canvas[XY] attributes will contain the coresponding touch position.
	 * The event.scale and event.rotation attributes contain pinch scaling and two finger rotation quantities
	 * respectively. The deltaX and deltaY attributes will contain drag offsets.
	 * @returns {boolean} True if this tool wishes to consume the event and false to continue to pass the event
	 * to lower priority active tools.
	 */
	this.handleGesture = function(event) {
		return false;
	};

	/**
	 * This method is called when the canvas area loses focus.
	 * @param {FocusEvent} event - The event object that triggered this call.
	 * @returns {boolean} True if this tool wishes to consume the event and false to continue to pass the event
	 * to lower priority active tools.
	 */
	this.handleBlur = function(event) {
		return false;
	};

	/**
	 * This method is called on every active tool whenever the screen area changes.
	 * The new canvas area can be obtained from the Navigation interface via the getScreenViewport method.
	 * @see ZhiUTech.Viewing.Navigation
	 */
	this.handleResize = function() {};
};;