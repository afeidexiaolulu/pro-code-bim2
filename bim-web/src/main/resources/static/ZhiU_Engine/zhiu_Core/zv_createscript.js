
var zv = ZhiUTech.Viewing,
	zvp = ZhiUTech.Viewing.Private;

//Those are globals -- set by the build system.
var LMV_WORKER_URL = zvp.LMV_WORKER_URL || "src/workers/MainWorker-web.js";
var ENABLE_INLINE_WORKER = zvp.ENABLE_INLINE_WORKER || false;

(function() {

	"use strict";

	// A cache of entire worker script as data URL.
	var WORKER_DATA_URL = null;
	var WORKER_FETCHING_SCRIPT = false;
	var WORKER_FETCHING_CALLBACKS = [];

	zvp.workerScript = null;

	function createScript() {
		if(!zvp.workerScript) {
			var scriptURL = LMV_WORKER_URL;

			// We need to request the same version of the library for this worker.  Take the original
			// script url, which will already have the version string (if provided).
			//
			var originalScriptURL = zvp.getResourceUrl(LMV_WORKER_URL);

			if(originalScriptURL) {
				scriptURL = originalScriptURL;
			}

			zvp.workerScript = WGS.WebWorkerCreator ?
				new WGS.WebWorkerCreator(scriptURL, ENABLE_INLINE_WORKER) :
				new WGS.NodeWorkerCreator();
		}
		return zvp.workerScript;
	}

	// This mainly is used for testing.
	zvp.clearWorkerDataURL = function() {
		zvp.workerScript && zvp.workerScript.clearWorkerDataURL();
	};

	zvp.initWorkerScript = function(successCB, errorCB) {
		return createScript().initWorkerScript(successCB, errorCB);
	};

	// Create a web worker.
	zvp.createWorker = function() {
		return createScript().createWorker();
	};

	zvp.createWorkerWithIntercept = function() {
		return createScript().createWorkerWithIntercept();
	};

})();;