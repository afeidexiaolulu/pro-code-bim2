(function() {

	"use strict";

	var zv = ZhiUTech.Viewing,
		endp = zv.endpoint = zv.endpoint || {},
		zvp = zv.Private;

	var global = zv.getGlobal();

	endp.PROTEIN_ROOT = null;
	endp.PRISM_ROOT = null;
	global.LOCALIZATION_REL_PATH = "";
	global.ZHIU_VERSION = "4.2"; // 版本号/package.json
	global.ZHIU_PATCH = "7"; // Gets replaced with build number from TeamCity
	global.LMV_BUILD_TYPE = "Production"; // 产品Either Development or Release/RELEASE
	global.LMV_RESOURCE_VERSION = null;
	global.LMV_RESOURCE_ROOT = "";

	if(ZHIU_VERSION.charAt(0) === 'v') {
		// remove prefixed 'v'
		// Required due to TeamCity build pipeline (LMV-1361)
		ZHIU_VERSION = ZHIU_VERSION.substr(1);
	}

	global.stderr = function() {
		console.warn('"stderr" is deprecated; 请使用 "ZhiUTech.Viewing.Private.logger" 代替');
	};

	zvp.env = null;
	// GUID of the current active document item.
	zvp.docItemId = null;

	zvp.token = {
		accessToken: null,
		getAccessToken: null,
		tokenRefreshInterval: null
	};

	// A list of resources that record the URL and necessary auxilary information (such as ACM headers and / or
	// session id) required to get the resource. This bag of collection will be passed from JS to native code so
	// all viewer consumable resources could be downloaded on native side for offline viewing.
	// zvp.assets = isAndroidDevice() ? [] : null;
	zvp.assets = [];
	// Set viewer in offline mode if set to true. In offline mode, viewer would ignore all URNs in bubble JSON
	// and assume the viewables are laid out in local file system path relative to the bubble.json.
	zvp.offline = false;
	// Offline resource prefix specified by viewer consumer (e.g. IOS web view). Used as prefix to concatenate with
	// each resource relative path to form the absolute path of each resource.
	zvp.offlineResourcePrefix = null;

	var LmvEndpoints = {
		local: {
			RTC: ['https://rtc-dev.api.zhiutech.com:443', 'https://lmv.zhiutech.com:443'] //port # is required here.
		},
		dev: {
			RTC: ['https://rtc-dev.api.zhiutech.com:443', 'https://lmv.zhiutech.com:443']
		},
		stg: {
			RTC: ['https://rtc-stg.api.zhiutech.com:443', 'https://lmv.zhiutech.com:443']
		},
		prod: {
			RTC: ['https://rtc.api.zhiutech.com:443', 'https://lmv.zhiutech.com:443']
		}
	};

	var DevApiUrls = {
		local: "",
		dev: "https://developer-dev.api.zhiutech.com",
		stg: "https://developer-stg.api.zhiutech.com",
		prod: "https://developer.api.zhiutech.com"
	};

	var FluentApiUrls = {
		dev: "https://fluent.zhiutech.com",
		stg: "https://dcs-stg.zhiutech.com",
		prod: "https://dcs.zhiutech.com"
	};

	// The apps on https://developer.zhiutech.com had to be created under an ADS account... Ask for brozp
	var AdpConfigs = {
		stg: {
			CLIENT_ID: 'lmv-stag',
			CLIENT_KEY: 'kjemi1rwAgsqIqyvDUtc9etPD6MsAzbV',
			ENDPOINT: 'https://ase-stg.zhiutech.com'
		},
		prod: {
			CLIENT_ID: 'lmv-prod',
			CLIENT_KEY: 'iaoUM2CRGydfn703yfPq4MAogZi8I5u4',
			ENDPOINT: 'https://ase.zhiutech.com'
		}
	};

	zvp.EnvironmentConfigurations = {
		Local: {
			ROOT: '',
			LMV: LmvEndpoints["local"]
		},
		Development: {
			ROOT: DevApiUrls["dev"],
			LMV: LmvEndpoints["dev"],
			bubbleManifest: true
		},
		Staging: {
			ROOT: DevApiUrls["stg"],
			LMV: LmvEndpoints["stg"],
			bubbleManifest: true
		},
		Production: {
			ROOT: DevApiUrls["prod"],
			LMV: LmvEndpoints["prod"],
			bubbleManifest: true
		},
		ZhiUTechDevelopment: {
			ROOT: DevApiUrls["dev"],
			LMV: LmvEndpoints["dev"]
		},
		ZhiUTechStaging: {
			ROOT: DevApiUrls["stg"],
			LMV: LmvEndpoints["stg"]
		},
		ZhiUTechProduction: {
			ROOT: DevApiUrls["prod"],
			LMV: LmvEndpoints["prod"]
		},
		FluentDev: {
			ROOT: FluentApiUrls["dev"],
			LMV: LmvEndpoints["dev"]
		},
		FluentStaging: {
			ROOT: FluentApiUrls["stg"],
			LMV: LmvEndpoints["stg"]
		},
		FluentProduction: {
			ROOT: FluentApiUrls["prod"],
			LMV: LmvEndpoints["prod"]
		}
	};

	zvp.initializeEnvironmentVariable = function(options) {
		var env;

		// Use the enviroment that was explicitly specified.
		//
		if(options && options.env) {
			env = options.env;
		}

		// If not available, check if the environment was specified in the query parameters.
		//
		if(!env) {
			env = zvp.getParameterByName("env");
		}

		if(options && options.offlineResourcePrefix) {
			zvp.offlineResourcePrefix = options.offlineResourcePrefix;
		}

		if(options && options.offline && options.offline === "true") {
			zvp.offline = true;
		}

		// If still not available, try to resolve the environment based on the url.
		//
		if(!env) {
			switch(window.location.hostname) {
				case "developer-dev.api.zhiutech.com":
					env = 'ZhiUTechDevelopment';
					break;
				case "developer-stg.api.zhiutech.com":
					env = 'ZhiUTechStaging';
					break;
				case "developer.api.zhiutech.com":
					env = 'ZhiUTechProduction';
					break;

				case "localhost.zhiutech.com":
					env = 'Local';
					break;
				case "": // IP addresses on Chrome.
					env = 'Local';
					break;
				case "127.0.0.1":
					env = 'Local';
					break;
				default:
					env = 'ZhiUTechProduction';
			}
		}

		zvp.env = env;

		if(typeof window !== "undefined") {
			zvp.logger.info("Host name : " + window.location.hostname);
		}
		zvp.logger.info("Environment initialized as : " + env);
	};

	zvp.initializeServiceEndPoints = function(options) {

		// Get endpoint.
		var endpoint = options.endpoint;
		if(!endpoint) {
			var config = zvp.EnvironmentConfigurations[zvp.env];
			endpoint = config['ROOT'];
		}

		// Get endpoint api.
		var api = options.api || zv.endpoint.ENDPOINT_API_DERIVATIVE_SERVICE_V2;

		zv.endpoint.setEndpointAndApi(endpoint, api);

		if(zv.isNodeJS)
			return;

		//Derive the root for static viewer resources based on the
		//location of the main viewer script
		var libList = [
			"zuv3D.js",
			"zuv3D.min.js",
			"zuv3D_Corp"
		];
		if(options && options.hasOwnProperty('libraryName'))
			libList.push(options.libraryName);

		var root;
		var scriptUrl;

		// TODO_NOP: this doesn't work for Polymer / Web Components
		for(var i = 0; i < libList.length; i++) {
			var script = zvp.getScript(libList[i]);
			scriptUrl = script ? script.src : "";
			var idx = scriptUrl.indexOf(libList[i]);
			if(idx >= 0) {
				root = scriptUrl.substr(0, idx);
				break;
			}
		}

		//Derive any custom version request
		LMV_RESOURCE_VERSION = "v" + ZHIU_VERSION;

		var version = zvp.getParameterByNameFromPath("v", scriptUrl);
		if(version && version.length && version != LMV_RESOURCE_VERSION) {
			zvp.logger.warn("Version string mismatch between requested and actual version: " + version + " vs. " + LMV_RESOURCE_VERSION + ". Using " + version);
			LMV_RESOURCE_VERSION = version;
		} else if(!version || !version.length) {
			LMV_RESOURCE_VERSION = null;
			zvp.logger.info("No viewer version specified, will implicitly use " + ZHIU_VERSION);
		}

		LMV_RESOURCE_ROOT = root || LMV_RESOURCE_ROOT;
	};

	zvp.initLoadContext = function(inputObj) {

		inputObj = inputObj || {};

		inputObj.auth = zv.endpoint.getUseCredentials();
		inputObj.endpoint = zv.endpoint.getApiEndpoint();

		if(!inputObj.headers)
			inputObj.headers = {};

		var endp = zv.endpoint;
		for(var p in endp.HTTP_REQUEST_HEADERS) {
			inputObj.headers[p] = endp.HTTP_REQUEST_HEADERS[p];
		}

		//This is done to avoid CORS errors on content served from proxy or browser cache
		//The cache will respond with a previously received response, but the Access-Control-Allow-Origin
		//response header might not match the current Origin header (e.g. localhost vs. developer.api.zhiutech.com)
		//which will cause a CORS error on the second request for the same resource.
		var domainParam = zv.endpoint.getDomainParam();
		if(domainParam) {
			if(inputObj.queryParams) {
				inputObj.queryParams += "&" + domainParam;
			} else {
				inputObj.queryParams = domainParam;
			}
		}

		//shared geometry/material storage
		inputObj.otg_cdn = endp.getCdnUrl();

		return inputObj;
	};

	//By now, the use of cookie is Fluent-specific only
	zvp.refreshCookie = function(token, onSuccess, onError) {

		// rawGet doesn't accept undefined onSuccess callbacks
		onSuccess = onSuccess || function() {};
		zvp.ViewingService.rawGet(zv.endpoint.getApiEndpoint(), null, "/auth/settoken", onSuccess, onError, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			withCredentials: true,
			postData: "access-token=" + token
		});
	};

	// Refresh the token in request header, in case that the third party cookie is disabled
	zvp.refreshRequestHeader = function(token) {

		zv.endpoint.HTTP_REQUEST_HEADERS["Authorization"] = "Bearer " + token;

	};

	zvp.refreshToken = function(token, onSuccess, onError) {

		// Store the token
		zvp.token.accessToken = token;

		//TODO: Fluent. Currently we need to use the cookie based approach,
		//until the server is fixed to respond to CORS pre-flight requests
		//with Authorization header.
		// At the beginning, try to store the token in cookie
		if(zvp.token.useCookie) {

			var wrapError = function(e) {
				zvp.logger.warn("Failed to set token in cookie. Will use header instead.");
				zvp.token.useCookie = false;
				zvp.refreshRequestHeader(token);
				onError && onError(e);
			};

			zvp.refreshCookie(token, onSuccess, wrapError);
		} else {
			zvp.refreshRequestHeader(token);
			onSuccess && onSuccess();
		}
	};

	zvp.initializeAuth = function(onSuccessCallback, options) {

		var shouldInitializeAuth = options ? options.shouldInitializeAuth : undefined;
		if(shouldInitializeAuth === undefined) {
			var p = zvp.getParameterByName("auth");
			shouldInitializeAuth = (p.toLowerCase() !== "false");
		}

		//Skip Auth in case we are serving the viewer locally
		if(zvp.env == "Local" || !shouldInitializeAuth) {
			setTimeout(onSuccessCallback, 0);
			zv.endpoint.setUseCredentials((typeof options.useCredentials !== "undefined") ? options.useCredentials : false);
			return zv.endpoint.getUseCredentials();
		}

		zv.endpoint.setUseCredentials((typeof options.useCredentials !== "undefined") ? options.useCredentials : true);

		zvp.token.useCookie = options.useCookie;

		//Must zero this out every time the initializer is called -- which could happen
		//several times with the same globally loaded LMV script/module
		if(zvp.token.tokenRefreshInterval) {
			clearTimeout(zvp.token.tokenRefreshInterval);
			zvp.token.tokenRefreshInterval = null;
		}

		var accessToken;

		function onGetAccessToken(token /* access token value. */ , expire /* expire time, in seconds. */ ) {
			accessToken = token;
			zvp.refreshToken(accessToken, zvp.token.tokenRefreshInterval ? null
				/* If this is a token refresh call,
				            don't invoke the onSuccessCallback which will loadDocument and so on. */
				:
				onSuccessCallback);
			var interval = expire - 60; // Refresh 1 minute before token expire.
			if(interval <= 0) {
				// We can't get a precise upper bound if the token is such a short lived one (expire in a minute),
				// so just use the original one.
				interval = expire;
			}
			zvp.token.tokenRefreshInterval = interval * 1000;
			setTimeout(function() {
				options.getAccessToken(onGetAccessToken)
			}, zvp.token.tokenRefreshInterval);
		}

		if(options && options.getAccessToken) {
			zvp.token.getAccessToken = options.getAccessToken;

			accessToken = options.getAccessToken(onGetAccessToken);

			//Backwards compatibility with the old synchronous API
			if(typeof accessToken === "string" && accessToken) {
				zvp.refreshToken(accessToken, onSuccessCallback);
			}

		} else if(options && options.accessToken) {
			accessToken = options.accessToken;
			zvp.refreshToken(accessToken, onSuccessCallback);
		} else {
			accessToken = zvp.getParameterByName("accessToken");
			if(!accessToken) {
				accessToken = "9AMaRKBoPCIBy61JmQ8OLLLyRblS";
				zvp.logger.warn("Warning : no access token is provided. Use built in token : " + accessToken);
			}
			zvp.refreshToken(accessToken, onSuccessCallback);
		}

		//TODO: this seems like a pointless thing to return
		return zv.endpoint.getUseCredentials();
	};

	zvp.initializeLogger = function(options) {

		zvp.logger.initialize(options);

		// ADP is opt-out
		if(options && options.hasOwnProperty('useADP') && options.useADP == false) {
			return;
		}
		//Also bail on ADP if we are a node module
		if(zv.isNodeJS)
			return;

		// Load ZhiUTech Data Platform client
		// (and if we're in RequireJS environment, use its APIs to avoid problems)
		var url = 'adp-web-analytics-sdk.js';
		var callback = function() {
			if(typeof(Adp) === 'undefined') {
				zvp.logger.warn('ZhiUTech Data Platform SDK not found');
				return;
			}

			var adpConfig;
			switch(LMV_BUILD_TYPE) {
				case 'Production':
					adpConfig = AdpConfigs['prod'];
					break;
				default:
					adpConfig = AdpConfigs['stg'];
					break;
			}
			var facets = {
				product: {
					name: 'LMV',
					line_name: 'LMV',
					key: adpConfig.CLIENT_ID,
					id: adpConfig.CLIENT_KEY,
					id_provider: 'appkey',
					build_id: ZHIU_VERSION + '.' + ZHIU_PATCH,
					build_tag: LMV_BUILD_TYPE
				}
			};
			var config = {
				server: adpConfig.ENDPOINT,
				enable_geo_data: false,
				enable_browser_data: true,
				enable_session_messages: true
			};
			zvp.logger.adp = new Adp(facets, config);
		};

		if(typeof require === 'function') {
			require([url], function(adp) {
				window.Adp = adp;
				callback();
			});
		} else {
			zvp.loadDependency('Adp', url, callback);
		}

	};

	var initializeCDN = function() {

		if(!endp.getCdnRedirectUrl())
			return;

		zvp.ViewingService.rawGet(endp.getCdnRedirectUrl(), null, null,
			function onSuccess(res) {
				if(res && res.length) {
					endp.setCdnUrl(res);
					zvp.logger.info("CDN_ROOT is: " + res);
				}
			},
			function onError() {}, {
				withCredentials: false,
				responseType: "text"
			}
		);
	};

	zvp.initializeProtein = function() {

		//For local work, don't redirect texture requests to the CDN,
		//because local ones will load much faster, presumably.
		if(zvp.ENABLE_DEBUG && zvp.env == "Local" && !zv.endpoint.getUseCredentials()
			/* when auth is true, the viewer is operating under
			       local mode but connect to remote server to get data. */
		)
			return;

		// In offline mode, viewer will get the texture from the locally cached SVF data sets, instead pinging texture
		// CDN.
		// TODO: this will break when translators stop including Protein into SVF.
		if(zvp.offline) {
			return;
		}

		var xhr1 = new XMLHttpRequest();
		xhr1.open("GET", "https://raas-assets.zhiutech.com/StaticContent/BaseAddress?family=protein", true);
		xhr1.responseType = "json";

		xhr1.onload = function(e) {
			var res = xhr1.response.url;
			if(res && res.length) {
				res = res.replace("http://", "https://");
				zv.endpoint.PROTEIN_ROOT = res + "/";
				zvp.logger.info("Protein root is: " + zv.endpoint.PROTEIN_ROOT);
			}
		};

		xhr1.send();

		var xhr2 = new XMLHttpRequest();
		xhr2.open("GET", "https://raas-assets.zhiutech.com/StaticContent/BaseAddress?family=prism", true);
		xhr2.responseType = "json";

		xhr2.onload = function(e) {
			var res = xhr2.response.url;
			if(res && res.length) {
				res = res.replace("http://", "https://");
				zv.endpoint.PRISM_ROOT = res + "/";
				zvp.logger.info("Prism root is: " + zv.endpoint.PRISM_ROOT);
			}
		};

		//xhr.onerror = ;
		//xhr.ontimeout = ;

		xhr2.send();
	};

	// Returns the query parameter value from window url
	zvp.getParameterByName = function(name) {
		if(typeof window === "undefined") {
			return "";
		}
		return zvp.getParameterByNameFromPath(name, window.location.href);
	};

	// return value of parameter from a url
	zvp.getParameterByNameFromPath = function(name, url) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(url);
		if(results == null)
			return "";
		else
			return decodeURIComponent(results[1].replace(/\+/g, " "));
	};

	/**
	 * Normalizes memory options passed into the viewer instance or stated in the URL
	 * The URL parameter to check is `viewermemory` and has a number value that represents
	 * the MegaByte memory limit.
	 * @example: 
	 *      ?viewermemory=500 ----- set memory limit of 500 MB
	 *      ?viewermemory=500f ---- force memory limit of 500 MB, which activates on-demand-loading mechanism (debug). 
	 * @private
	 */
	zvp.processMemoryOptions = function(config3d) {

		if(!config3d)
			return;

		var memLimit;
		// Verify memory values are valid/consistant
		if(config3d.memory) {
			memLimit = parseInt(config3d.memory.limit) | 0;
			var forced = (config3d.memory.debug && config3d.memory.debug.force) || false;
			if(forced && memLimit <= 0) {
				config3d.memory.force = false; // disable forced when the limit is not valid.
				zvp.logger.warn('config.memory.limit value is invalid: (' + config3d.memory.limit + ')');
			}
		}

		// If URL argument is passed in, override limit specified through code
		var urlValue = zvp.getParameterByName('viewermemory');
		memLimit = parseInt(urlValue);
		// If urlValue isn't a number, memLimit will be a NaN and comparison will fail.
		if(memLimit >= 0) {
			// Now, truncate memLimit to an integer.
			memLimit = memLimit | 0;
			// Only allow forced when memLimit > 0, memLimit == 0 disables the limit.
			var isForced = memLimit > 0 && urlValue.charAt(urlValue.length - 1).toLowerCase() === 'f'; // Check if there is an F at the end.
			config3d.memory = {
				limit: memLimit,
				debug: {
					force: isForced
				}
			};
			if(isForced) {
				zvp.logger.info('Forcing memory limit to URL param: (' + memLimit + ' MegaBytes).');
			} else {
				zvp.logger.info('Setting memory limit to URL param: (' + memLimit + ' MegaBytes).');
			}
		} else {
			// don't issue warning if viewermemory parameter (e.g., "&viewermemory=500") is not in URL at all
			if(urlValue !== "")
				zvp.logger.warn('Invalid viewermemory URL param value: (' + urlValue + ')');
		}
	};

	zvp.setLanguage = function(language, callback) {

		var options = {
			lng: language,
			resGetPath: 'res/locales/__lng__/__ns__.json',
			ns: {
				namespaces: ['allstrings'],
				defaultNs: 'allstrings'
			},
			fallbackLng: "en",
			debug: false
		};

		LOCALIZATION_REL_PATH = "res/locales/" + language + "/";
		ZhiUTech.Viewing.i18n.init(options, function(t) {
			ZhiUTech.Viewing.i18n.clearDebugLocString(); //Calls localize as well
			if(callback) {
				callback();
			}
		});
	};

	zvp.extendLocalization = function(locales) {
		if(locales !== null && typeof locales === "object") {
			Object.keys(locales).forEach(function(language) {
				ZhiUTech.Viewing.i18n.addResourceBundle(
					language,
					"allstrings",
					locales[language],
					true,
					true
				);
			});
			return true;
		}
		return false;
	};

	/**
	 * Initialize language for localization. The corresponding string files will get downloaded.
	 */
	zvp.initializeLocalization = function(options) {
		var language = (options && options.language) || navigator.language;
		var lang = zvp.Lang.getSupported(language);
		zvp.setLanguage(lang);
	};

	zvp.initializeUserInfo = function(options) {
		if(!options || !options.userInfo) return;
		zvp.setUserName(options.userInfo.name);
		if(options.comment2Token) {
			zvp.comment2Token = options.comment2Token;
		}
	};

	// TODO:  This is here for now, until we find a better place for it.
	//
	/**
	 * Returns the first source url found containing the given script name.
	 * @private
	 * @param {string} scriptName - Script name.
	 * @returns {HTMLScriptElement} The script element whose source location matches the input parameter.
	 */
	zvp.getScript = function(scriptName) {
		scriptName = scriptName.toLowerCase();
		var scripts = document.getElementsByTagName('SCRIPT');
		if(scripts && scripts.length > 0) {
			for(var i = 0; i < scripts.length; ++i) {
				if(scripts[i].src && scripts[i].src.toLowerCase().indexOf(scriptName) !== -1) {
					return scripts[i];
				}
			}
		}
		return null;
	};

	/**
	 * Returns the full url of a resource with version.
	 * The version will be determined from the ZHIU_VERSION variable.
	 * @private
	 * @param {string} resourceRelativePath - The path of the resource relative to LMV_RESOURCE_ROOT.
	 * @returns {string} The full resource path.
	 */
	zvp.getResourceUrl = function(resourceRelativePath) {
		var version = LMV_RESOURCE_VERSION;
		return LMV_RESOURCE_ROOT + resourceRelativePath + (version ? ('?v=' + version) : '');
	};

	/**
	 * @param {string} libNamespace - window property name expected to be loaded after library is on the document if it contains '://' will be use to resolve the url insted of libName.
	 * @param {string} libName - url to load the library from.
	 * @param {function} callback - success callback function
	 * @param {function} onError - error callback function
	 * @param {string} amdName - Should be the name module defined on the define function.
	 * @description  Loads a script (e.g. an external library JS) and calls the callback once loaded. Used for delayed loading of required libraries. Accepts both relative and absolute URLs.
	 */
	zvp.loadDependency = function(libNamespace, libName, callback, onError, amdName) {
		if(typeof window[libNamespace] === "undefined") {
			var s = document.createElement("SCRIPT");
			s.src = libName.indexOf('://') > 0 ? libName : zvp.getResourceUrl(libName);
			var clearCallbacks = function() {
				s.onerror = null;
				s.onload = null;
			};
			var errCallback = function() {
				clearCallbacks();
				onError && onError();
			};
			var successCallback = function() {
				clearCallbacks();
				//if there is a dependency which use amd and we are running on amd environment we load it through require
				if(typeof define === 'function' && define.amd && typeof require === 'function' && amdName) {
					require([amdName], function(moduleDefinition) {
						window[libNamespace] = moduleDefinition;
						callback && callback();
					}, errCallback);
				} else {
					callback && callback();
				}
			};
			s.onload = successCallback;
			s.onerror = errCallback;
			document.head.appendChild(s);
		} else if(callback)
			callback();
	};

	/**
	 * Inject a css file into the page. 
	 * There's a callback if you need to know when it gets downloaded (rare).
	 * Accepts both relative and absolute URLs.
	 */
	zvp.injectCSS = function(cssUrl, callback, onError) {
		var href = cssUrl.indexOf('://') > 0 ? cssUrl : zvp.getResourceUrl(cssUrl);

		// Verify that we haven't downloaded it already
		var results = document.getElementsByTagName('link');
		for(var i = 0, len = results.length; i < len; i++) {
			if(results[i].href === href) {
				// Already downloaded
				callback && callback();
				return;
			}
		}

		// else, download it
		var s = document.createElement("link");
		s.setAttribute('rel', "stylesheet");
		s.setAttribute('type', "text/css");
		s.setAttribute('href', href);
		if(callback) {
			s.onload = callback;
		}
		if(onError) {
			s.onerror = onError;
		}
		document.head.appendChild(s);
	};

	/**
	 * Download an HTML template. 
	 * If successful, will invoke callback(null, templateString)
	 * If failure, will invoke callback("some error", null)
	 */
	zvp.getHtmlTemplate = function(templateUrl, callback) {
		var href = templateUrl.indexOf('://') > 0 ? templateUrl : zvp.getResourceUrl(templateUrl);
		var request = new XMLHttpRequest();
		request.onload = requestLoad;
		request.onerror = requestError;
		request.ontimeout = requestError;
		request.open('GET', href, true);
		request.send();

		function requestError(err) {
			callback(err, null);
		}

		function requestLoad(event) {
			var content = event.currentTarget.responseText;
			callback(null, content);
		}

	};

	/**
	 * @typedef {Object} InitOptions
	 * @property {string} env 
	 *          Can be "ZhiUTechProduction" (default), "ZhiUTechStaging", or "ZhiUTechDevelopment".
	 * @property {string} api
	 *          Can be undefined (default), "derivativeV2", or "modelDerivativeV2".
	 * @property {function} getAccessToken
	 *          A function that provides an access token asynchronously.
	 *          The function signature is `getAccessToken(onSuccess)`, where onSuccess is a callback that getAccessToken
	 *          function should invoke when a token is granted, with the token being the first input parameter for the
	 *          onSuccess function, and the token expire time (in seconds) being the second input parameter for the
	 *          function. Viewer relies on both getAccessToken and the expire time to automatically renew token, so
	 *          it is critical that getAccessToken must be implemented as described here.
	 * @property {string} language
	 *          Preferred language code as defined in RFC 4646, such as "en", "de", "fr", etc.
	 *          If no language is set, viewer will pick it up from the browser. If language is not as defined in RFC,
	 *          viewer will fall back to "en" but the behavior is undefined.
	 * @property {number} logLevel
	 *          Specifies which types of messages will be logged into the console. 
	 *          Values are: 5 Debug, 4 Logs, 3 Info, 2 Warnings, 1 Errors, 0 None.
	 *          Defaults to (1) for Errors only.
	 *          All values can be found in ZhiUTech.Viewing.Private.LogLevels.
	 * @property {string} webGLHelpLink
	 *          A link url to a help page on webGL if it's disabled. Supported only
	 *          when using the GuiViewer3D instance; not supported in headless mode.
	 */

	/**
	 * Returns a new object that can be passed to ZhiUTech.Viewing.Initializer() for
	 * initialization. Developers should consider customizing attributes in this object
	 * before passing it to ZhiUTech.Viewing.Initializer().
	 * 
	 * Available since version 2.13
	 * 
	 * @returns {InitOptions} Can be passed into ZhiUTech.Viewing.Initializer()
	 * 
	 * @example
	 *  var options = ZhiUTech.Viewing.createInitializerOptions();
	 *  options.getAccessToken = function(onSuccess) {
	 *      var accessToken, expire;
	 *      // Code to retrieve and assign token value to
	 *      // accessToken and expire time in seconds.
	 *      onSuccess(accessToken, expire);
	 *  };
	 *  ZhiUTech.Viewing.Initializer(options, function() {
	 *      alert("initialization complete");
	 *  });
	 * 
	 * 
	 * @category Core
	 */
	ZhiUTech.Viewing.createInitializerOptions = function() {

		// Attributes fully supported
		// See @typedef {Object} InitOptions above for details on each one of these...
		var opts = {
			env: 'ZhiUTechProduction',
			// TODO: Use commented api when we deprecate useDerivativeServiceV2 flag and old endpoints.js.
			api: undefined /*zv.endpoint.ENDPOINT_API_DERIVATIVE_SERVICE_V2*/ ,
			getAccessToken: undefined,
			language: undefined,
			logLevel: zvp.LogLevels.ERROR,
			webGLHelpLink: null
		};

		// Attributes that exist, but we don't fully support (yet)
		// opts.offline: false,
		// opts.offlineResourcePrefix: 'data'

		return opts;
	};

	/**
	 * @typedef {Object} ViewerConfig
	 * @property {array} extensions 
	 *          Ids of extensions that need to be loaded always.
	 * @property {string} sharedPropertyDbPath
	 *          Some documents have a global Property Database file, which is shared across all
	 *          referenced 2D and 3D models. Use Document.getPropertyDbPath() to populate this field;
	 *          automatically populated when using a ViewingApplication instance.
	 * @property {Object} canvasConfig
	 *          Allows to modify the default user input interactions with the viewer. For example, one
	 *          could change the left-mouse click to isolate a node instead of selecting it.
	 * @property {boolean} startOnInitialize
	 *          True by default, whether viewer.run() gets invoked as soon as initialization is complete,
	 *          effectively commencing the viewer's main rendering loop. 
	 * @property {array} experimental
	 *          An interface to enable experimental features that are yet to be released.
	 *          Each feature is identified with a string. To enable a feature, remove the first two double dashes.
	 */

	/**
	 * Returns a new object that can be passed to a Viewer instance when created.
	 * 
	 * Available since version 2.13
	 * 
	 * @returns {ViewerConfig} 
	 *          Can be passed into a ViewingApplication's registerViewer() 3rd parameter,
	 *          or directly when constructing a Viewer instance.
	 * 
	 * @example
	 * var myConfig = ZhiUTech.Viewing.createViewerConfig();
	 * myConfig.extensions.push('MyAwesomeExtension');
	 * //
	 * // Direct usage...
	 * var myViewer = new ZhiUTech.Viewing.Viewer3D( myDiv, myConfig );
	 * //
	 * // ...or through a ViewingApplication
	 * viewerApp = new ZhiUTech.Viewing.ViewingApplication('MyViewerDiv');
	 * viewerApp.registerViewer(viewerApp.k3D, ZhiUTech.Viewing.Private.GuiViewer3D, myConfig);
	 * 
	 * 
	 * @category Core
	 */
	ZhiUTech.Viewing.createViewerConfig = function() {

		// Global Viewer configuration values
		var config = {

			extensions: [],
			// useConsolidation: false, // 100 MB -- Needs work before exposing (here or elsewhere)
			// consolidationMemoryLimit: 100 * 1024 * 1024, // 100 MB -- Needs work before exposing (here or elsewhere)
			sharedPropertyDbPath: undefined,
			// bubbleNode: undefined, -- Needs work before exposing here.
			canvasConfig: undefined, // TODO: Needs documentation or something.
			startOnInitialize: true,

			// Enables experimental, non-supported features
			experimental: []
		};

		// Ask each extension to register their default options
		ZhiUTech.Viewing.theExtensionManager.popuplateOptions(config);

		// Also ask the bundled viewers
		zv.Viewer3D && zv.Viewer3D.populateConfigOptions(config);
		zvp.GuiViewer3D && zvp.GuiViewer3D.populateConfigOptions(config);

		return config;
	};

	/**
	 * Checks whether an experimental flag has been set into the viewer's' `config` 
	 * object, which happens to be the same as the extension's `options` object. 
	 * @private
	 */
	zvp.isExperimentalFlagEnabled = function(flagName, config3d) {
		if(!config3d || !Array.isArray(config3d.experimental))
			return false;
		return config3d.experimental.indexOf(flagName) !== -1;
	};

	/**
	 * Helper class for initializing the viewer runtime.
	 *
	 * Includes:
	 *  - End points of cloud services the viewer uses, like viewing service and search service.
	 *  - Authentication and authorization cookie settings on the client side.
	 *  - Misc runtime environment variables and viewer configurations parameters.
	 *
	 * @constructor
	 * @param {object} options - The options object contains configuration parameters used to do initializations. If no
	 * access token or authentication callback is provided, the Initializer will fall back
	 * on an access token provided in the URL query string, or a previous access token stored in
	 * the cookie cache, if available. The static function ZhiUTech.Viewing.createInitializerOptions() can be used to create
	 * an object with all the supported attributes.
	 * @param {string} [options.env] - Can be "Development", "Staging" or "Production", for viewers running without PAAS
	 * endpoints. Can be "ZhiUTechDevelopment", "ZhiUTechStaging", or "ZhiUTechProduction"
	 * for viewers running with PAAS endpoints.
	 * @param {function} [options.getAccessToken] - An function that provides an access token asynchronously.
	 * The function signature is `getAccessToken(onSuccess)`, where onSuccess is a callback that getAccessToken
	 * function should invoke when a token is granted, with the token being the first input parameter for the
	 * onSuccess function, and the token expire time (in seconds) being the second input parameter for the
	 * function. Viewer relies on both getAccessToken and the expire time to automatically renew token, so
	 * it is critical that getAccessToken must be implemented as described here.
	 * @param {boolean} [options.useADP] - Whether to report analytics to ADP. True by default.
	 * @param {string} [options.accessToken] - An access token.
	 * @param {string} [options.webGLHelpLink] - A link to a help page on webGL if it's disabled.
	 * @param {string} [options.language] - Preferred language code as defined in RFC 4646, such as "en", "de", "fr", etc.
	 * If no language is set, viewer will pick it up from the browser. If language is not as defined in RFC,
	 * viewer will fall back to "en" but the behavior is undefined.
	 * @param {function} callback - A method the client executes when initialization is finished.
	 * @example
	 *  var options = {
	 *     env: "ZhiUTechProduction",
	 *     language: "en",
	 *     webGLHelpLink: "http://my.webgl.help.link",
	 *     getAccessToken: function(onSuccess) {
	 *         var accessToken, expire;
	 *         // Code to retrieve and assign token value to
	 *         // accessToken and expire time in seconds.
	 *         onSuccess(accessToken, expire);
	 *     }
	 *  };
	 *  var callback = function() {
	 *     alert("initialization complete");
	 *  };
	 *  ZhiUTech.Viewing.Initializer(options, callback);
	 * @category Core
	 */
	ZhiUTech.Viewing.Initializer = function(options, callback) {

		function init() {
			zvp.initializeLegacyNamespaces(false);

			// The OtgGeomCache requires that the worker script be
			// downloaded before it is constructed. Make sure it is.
			var count = 2;
			var waitInit = function() {
				if(--count <= 0) {
					callback();
				}
			};

			//Kick off a request for the web worker script, so it loads in parallel with three.js
			zvp.initWorkerScript(waitInit, waitInit);

			//Temporarily silence THREE.warn due to new builds of Chrome producing oodles of shader compile warnings.
			THREE.warn = zvp.logger.warn.bind(zvp.logger);

			zvp.initializeAuth(waitInit, options);
			zvp.initializeLocalization(options);
			zvp.initializeUserInfo(options);
			initializeCDN();
		}

		if(zv.isNodeJS) {

			zvp.initializeEnvironmentVariable(options);
			zvp.initializeServiceEndPoints(options);
			zvp.initializeLogger(options);
			//zvp.initializeProtein(); //TODO:NODE

			//init_three_dds_loader(); //TODO:NODE
			//init_three_pvr_loader(); //TODO:NODE
			zvp.initializeAuth(callback, options);
			initializeCDN();

		} else {

			zvp.WEBGL_HELP_LINK = options ? options.webGLHelpLink : null;
			zvp.initializeEnvironmentVariable(options);
			zvp.initializeServiceEndPoints(options);
			zvp.initializeLogger(options);
			// There were plans to have a common materials endpoint where shared textures are hosted.
			// However, decals (for example) or other user-assigned textures will not be found there.
			// So, we must comment this out, see https://jira.zhiutech.com/browse/LMV-2726
			//zvp.initializeProtein();
			zvp.disableDocumentTouchSafari();

			//Load Promise (IE11), three.js & wgs.js, then continue initialization
			zvp.loadDependency('Promise', 'es6-promise.min.js', function() { // Usually a no-op
				zvp.loadDependency('THREE', 'three.min.js', function() {
					zvp.loadDependency('WGS', 'wgs.js', init);
				});
			}, null, 'es6-promise-polyfill');
		}
	};

})();