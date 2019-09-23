
(function() {

	"use strict";

	/** @constructor 
	 *
	 * @alias ZhiUTech.Viewing.Private.AlertBox
	 *
	 */
	var AlertBox = function() {};

	AlertBox.instances = [];

	// static
	AlertBox.displayError = function(container, msg, title, imgClass, hints) {

		var alertBox = document.createElement("div");
		alertBox.className = "alert-box error";
		container.appendChild(alertBox);

		// Create the image element.
		var errorImageClass = imgClass;
		if(!errorImageClass)
			errorImageClass = "img-item-not-found";

		var alertBoxImg = document.createElement("div");
		alertBoxImg.className = "alert-box-image " + errorImageClass;
		alertBox.appendChild(alertBoxImg);

		// Create the title & message element.
		var alertBoxMsg = document.createElement("div");
		alertBoxMsg.className = "alert-box-msg";
		alertBox.appendChild(alertBoxMsg);

		var errorTitle = title;
		if(!errorTitle)
			errorTitle = ZhiUTech.Viewing.i18n.translate("Error Occurred", {
				"defaultValue": "Error Occurred"
			});

		var alertBoxTitle = document.createElement("div");
		alertBoxTitle.className = "alert-box-title";
		alertBoxTitle.textContent = errorTitle;
		alertBoxTitle.setAttribute('data-i18n', errorTitle);
		alertBoxMsg.appendChild(alertBoxTitle);

		var alertBoxText = document.createElement("div");
		alertBoxText.className = "alert-box-text";
		alertBoxText.textContent = msg;
		alertBoxText.setAttribute('data-i18n', msg);
		alertBoxMsg.appendChild(alertBoxText);

		// Add additional content
		if(hints) {
			var content = document.createElement("div");
			content.className = "alert-box-content";
			alertBoxMsg.appendChild(content);

			var hintsElement = document.createElement("ul");
			hintsElement.className = "alert-box-content";
			for(var h = 0; h < hints.length; h++) {
				var hint = hints[h];
				if(!hint)
					continue;

				var hintElem = document.createElement("li");

				var result = this.extractList(hint);
				if(result.list.length) {
					var unorderedlist = this.generateListElement(list);
					hintsElement.appendChild(unorderedlist);
				}
				hintElem.innerHTML = result.msg;
				hintElem.setAttribute('data-i18n', result.msg);
				hintsElement.appendChild(hintElem);
			}
			content.appendChild(hintsElement);
		}

		var alertBoxOK = document.createElement("div");
		alertBoxOK.className = "alert-box-ok";
		alertBoxOK.textContent = ZhiUTech.Viewing.i18n.translate("OK", {
			"defaultValue": "OK"
		});

		var instance = {
			alertBox: alertBox,
			container: container
		};
		alertBoxOK.addEventListener("click", function(event) {
			alertBox.style.visibility = "hidden";
			container.removeChild(alertBox);
			AlertBox.instances.splice(AlertBox.instances.indexOf(instance), 1);
		});
		alertBox.appendChild(alertBoxOK);

		alertBox.style.visibility = "visible";

		AlertBox.instances.push(instance);
	};

	// static
	AlertBox.displayErrors = function(container, imgClass, errors) {

		var alertBox = document.createElement("div");
		alertBox.className = "alert-box errors";
		container.appendChild(alertBox);

		// Create the image element.
		var errorImageClass = imgClass;
		if(!errorImageClass)
			errorImageClass = "img-item-not-found";

		var alertBoxImg = document.createElement("div");
		alertBoxImg.className = "alert-box-image " + errorImageClass;
		alertBox.appendChild(alertBoxImg);

		// Create the title & message element.
		var alertBoxMsg = document.createElement("div");
		alertBoxMsg.className = "alert-box-msg errors";
		alertBox.appendChild(alertBoxMsg);

		for(var i = 0; i < errors.length; i++) {

			var errorTitle = errors[i].header;
			if(!errorTitle)
				errorTitle = ZhiUTech.Viewing.i18n.translate("Error", {
					"defaultValue": "Error"
				});

			var alertBoxTitle = document.createElement("div");
			alertBoxTitle.className = "alert-box-title errors";
			alertBoxTitle.textContent = errorTitle;
			alertBoxMsg.appendChild(alertBoxTitle);

			// Add message, there maybe a list of files at the end.
			var alertBoxText = document.createElement("div");
			alertBoxText.className = "alert-box-text errors";

			var msg = errors[i].msg;
			var result = this.extractList(msg);
			if(result.list.length) {
				var listElem = document.createElement("div");
				var unorderedlist = this.generateListElement(result.list);
				listElem.appendChild(unorderedlist);

				alertBoxText.textContent = result.msg;
				alertBoxText.appendChild(listElem);
			} else {
				alertBoxText.textContent = msg;
			}
			alertBoxMsg.appendChild(alertBoxText);

			// Add additional content
			if(errors[i].hints) {
				var hintsElement = document.createElement("ul");
				hintsElement.className = "alert-box-content";
				var hints = errors[i].hints;
				for(var h = 0; h < hints.length; h++) {
					var hint = hints[h];
					if(!hint)
						continue;

					var hintElem = document.createElement("li");
					hintsElement.appendChild(hintElem);

					var result = this.extractList(hint);
					if(result.list.length) {
						var unorderedlist = this.generateListElement(result.list);
						hintsElement.appendChild(unorderedlist);
					}
					hintElem.innerHTML = result.msg;
				}
				alertBoxMsg.appendChild(hintsElement);
			}
		}

		var alertBoxOK = document.createElement("div");
		alertBoxOK.className = "alert-box-ok";
		alertBoxOK.textContent = ZhiUTech.Viewing.i18n.translate("OK", {
			"defaultValue": "OK"
		});

		var instance = {
			alertBox: alertBox,
			container: container
		};
		alertBoxOK.addEventListener("click", function(event) {
			alertBox.style.visibility = "hidden";
			container.removeChild(alertBox);
			AlertBox.instances.splice(AlertBox.instances.indexOf(instance), 1);
		});
		alertBox.appendChild(alertBoxOK);

		alertBox.style.visibility = "visible";

		AlertBox.instances.push(instance);
	};

	AlertBox.extractList = function(msg) {
		var result = {
			"msg": msg,
			"list": []
		};

		if(msg && msg.indexOf("<ul>") != -1) {
			var parts = msg.split("<ul>");
			result.msg = parts[0];

			parts = parts[1].split("</ul>");
			result.list = parts[0].split(", ");
			if(result.list.length === 1) {
				// There maybe no spaces. Try just comma.
				result.list = parts[0].split(",");
			}
		}
		return result;
	};

	AlertBox.generateListElement = function(list) {
		var unorderedlist = document.createElement("ul");
		for(var l = 0; l < list.length; l++) {
			var listElement = document.createElement("li");
			listElement.textContent = list[l];
			listElement.setAttribute('data-i18n', list[l]);
			unorderedlist.appendChild(listElement);
		}

		return unorderedlist;
	};

	// static
	AlertBox.dismiss = function() {
		// dismiss the topmost alert box
		if(AlertBox.instances.length > 0) {
			var instance = AlertBox.instances.pop();
			instance.alertBox.style.visibility = "hidden";
			instance.container.removeChild(instance.alertBox);
			return true;
		}
		return false;
	};

	ZhiUTech.Viewing.Private.AlertBox = AlertBox;

})();;
(function() {

	"use strict";

	var zv = ZhiUTech.Viewing;

	/** @constructor */
	var HudMessage = function() {};

	HudMessage.instances = [];

	// static
	HudMessage.displayMessage = function(container, messageSpecs, closeCB, buttonCB, checkboxCB) {

		function getClientHeight(element) {
			var style = window.getComputedStyle(element);

			var margin = {
				top: parseInt(style["margin-top"]),
				bottom: parseInt(style["margin-bottom"])
			};

			var rect = element.getBoundingClientRect();
			return rect.height + margin.top + margin.bottom;
		};

		// If hud message is already up, return.
		if(HudMessage.instances.length > 0)
			return;

		var msgTitle = messageSpecs.msgTitleKey;
		var msgTitleDefault = messageSpecs.msgTitleDefaultValue || msgTitle;
		var message = messageSpecs.messageKey;
		var messageDefault = messageSpecs.messageDefaultValue || message;
		var buttonText = messageSpecs.buttonText;
		var checkboxChecked = messageSpecs.checkboxChecked || false;

		var hudMessage = document.createElement("div");
		hudMessage.classList.add("docking-panel");
		hudMessage.classList.add("hud");

		container.appendChild(hudMessage);

		var title = document.createElement("div");
		title.classList.add("docking-panel-title");
		title.classList.add("docking-panel-delimiter-shadow");
		title.textContent = zv.i18n.translate(msgTitle, {
			"defaultValue": msgTitleDefault
		});
		title.setAttribute("data-i18n", msgTitle);
		hudMessage.appendChild(title);

		if(closeCB) {
			var closeButton = document.createElement("div");
			closeButton.classList.add("docking-panel-close");
			closeButton.addEventListener('click', function(e) {
				HudMessage.dismiss();
				if(closeCB)
					closeCB(e);
			});
			hudMessage.appendChild(closeButton);
		}

		var client = document.createElement("div");
		client.classList.add("hud-client");
		client.classList.add("docking-panel-container-solid-color-b");

		hudMessage.appendChild(client);

		var text = document.createElement("div");
		text.className = "hud-message";
		text.textContent = zv.i18n.translate(message, {
			"defaultValue": messageDefault
		});
		text.setAttribute("data-i18n", messageDefault);
		client.appendChild(text);

		var clientHeight = getClientHeight(text);
		if(buttonCB) {
			var button = document.createElement("div");
			button.classList.add("docking-panel-primary-button");
			button.classList.add("hud-button");
			button.textContent = zv.i18n.translate(buttonText, {
				"defaultValue": buttonText
			});
			button.setAttribute("data-i18n", buttonText);
			button.addEventListener("click", buttonCB);
			client.appendChild(button);
			clientHeight += getClientHeight(button);
		}

		if(checkboxCB) {
			var checkbox = document.createElement("div");
			var cb = document.createElement("input");
			cb.className = "hud-checkbox";
			cb.type = "checkbox";
			cb.checked = checkboxChecked;
			checkbox.appendChild(cb);

			var checkboxText = "Do not show this message again"; // localized below

			var lbl = document.createElement("label");
			lbl.setAttribute('for', checkboxText);
			lbl.setAttribute("data-i18n", checkboxText);
			lbl.textContent = zv.i18n.translate(checkboxText, {
				"defaultValue": checkboxText
			});
			checkbox.appendChild(lbl);
			cb.addEventListener("change", checkboxCB);
			client.appendChild(checkbox);
			clientHeight += getClientHeight(checkboxCB);
		}

		client.style.height = clientHeight + 'px';
		hudMessage.style.height = (clientHeight + getClientHeight(title)) + 'px';

		var instance = {
			hudMessage: hudMessage,
			container: container
		};
		HudMessage.instances.push(instance);
	};

	HudMessage.dismiss = function() {
		// dismiss the topmost alert box
		if(HudMessage.instances.length > 0) {
			var instance = HudMessage.instances.pop();
			instance.hudMessage.style.visibility = "hidden";
			instance.container.removeChild(instance.hudMessage);
			return true;
		}
		return false;
	};

	ZhiUTech.Viewing.Private.HudMessage = HudMessage;

})();;
(function() {

	'use strict';

	var BrowserDelegate = function() {};

	var zv = ZhiUTech.Viewing;
	var zvp = ZhiUTech.Viewing.Private;

	BrowserDelegate.prototype.constructor = BrowserDelegate;

	BrowserDelegate.prototype.getNodeId = function(node) {
		throw 'getId is not implemented.'
	};

	BrowserDelegate.prototype.getNodeLabel = function(node) {
		return node.name;
	};

	BrowserDelegate.prototype.getNodeClass = function(node) {
		return '';
	};

	BrowserDelegate.prototype.hasThumbnail = function(node) {
		return false;
	};

	BrowserDelegate.prototype.getThumbnailOptions = function(node) {
		return null;
	};

	BrowserDelegate.prototype.getThumbnail = function(node) {
		return null;
	};

	BrowserDelegate.prototype.onNodeClick = function(browser, node, event) {};

	BrowserDelegate.prototype.onNodeHover = function(browser, node, event) {};

	BrowserDelegate.prototype.selectItem = function(id) {};

	BrowserDelegate.prototype.deselectItem = function(id) {};

	BrowserDelegate.prototype.hasContent = function(node) {
		return false;
	};

	BrowserDelegate.prototype.addContent = function(node, element) {};

	var Browser = function(delegate, items, parentContainerId) {
		this.myDelegate = delegate;
		this.mySelectedIds = [];

		var prefix = 'browserview';
		this.myRootContainerId = parentContainerId + '-' + prefix;

		this.idToElement = {};

		this.myRootContainer = document.createElement("div");
		this.myRootContainer.id = this.myRootContainerId;
		this.myRootContainer.classList.add(prefix);

		var parent = document.getElementById(parentContainerId);
		parent.appendChild(this.myRootContainer);

		this.createElements(items, this.myRootContainer);
	};

	Browser.prototype.constructor = Browser;

	Browser.prototype.show = function(show) {
		if(show) {
			this.myRootContainer.classList.remove("browserHidden");
			this.myRootContainer.classList.add("browserVisible");
			this.myRootContainer.style.display = "block";
		} else {
			this.myRootContainer.classList.remove("browserVisible");
			this.myRootContainer.classList.add("browserHidden");
			this.myRootContainer.style.display = "none";
		}
	};

	Browser.prototype.getRootContainer = function() {
		return this.myRootContainer;
	};

	Browser.prototype.delegate = function() {
		return this.myDelegate;
	};

	Browser.prototype.addToSelection = function(ids) {
		var browser = this;

		function addSingle(id) {
			var index = browser.mySelectedIds.indexOf(id);
			if(index == -1) {
				browser.mySelectedIds.push(id);
				return true;
			}
			return false;
		}

		for(var i = 0, len = ids.length; i < len; ++i) {
			var id = ids[i];
			if(addSingle(id)) {
				var item = browser.idToElement[id];
				if(item === undefined) {
					// Maybe the delegate knows what to do with it.
					browser.myDelegate.selectItem(id);
				} else {
					item.classList.add("selected");
				}
			}
		}
	};

	Browser.prototype.removeFromSelection = function(ids) {
		var browser = this;

		function removeSingle(id) {
			var index = browser.mySelectedIds.indexOf(id);
			if(index != -1) {
				browser.mySelectedIds.splice(index, 1);
				return true;
			}
			return false;
		}

		for(var i = ids.length - 1; i >= 0; --i) {
			var id = ids[i];
			if(removeSingle(id)) {
				var item = this.idToElement[id];
				if(item === undefined) {
					// Maybe the delegate knows what to do with it.
					browser.myDelegate.deselectItem(id);
				} else {
					item.classList.remove("selected");
				}
			}
		}
	};

	Browser.prototype.setSelection = function(ids) {
		this.removeFromSelection(this.mySelectedIds);
		this.addToSelection(ids);
		return this.mySelectedIds;
	};

	Browser.prototype.clearSelection = function() {
		this.removeFromSelection(this.mySelectedIds);
	};

	Browser.prototype.createElements = function(items, container) {
		if(!items)
			return;

		var browser = this;
		for(var nodeIndex = 0; nodeIndex < items.length; nodeIndex++) {
			var node = items[nodeIndex];
			browser.createElement(node, container);
		}
	};

	Browser.prototype.createElement = function(browserNode, container) {
		var browser = this;

		var id = browser.myDelegate.getNodeId(browserNode);

		var item = document.createElement("item");
		container.appendChild(item);
		this.idToElement[id] = item;

		item.onmouseover = function() {
			browser.myDelegate.onNodeHover(browser, browserNode);
		};
		item.onclick = function(e) {
			browser.myRootContainer.querySelector(".flipped").removeClass("flipped");
			browser.myDelegate.onNodeClick(browser, browserNode, e);
		};

		var card = document.createElement("div");
		card.classList.add("card");
		item.appendChild(card);

		var elemWrapper = document.createElement("div");
		elemWrapper.classList.add("browserElement");
		card.appendChild(elemWrapper);

		var label = browser.myDelegate.getNodeLabel(browserNode);
		var labelElem = document.createElement("label");
		labelElem.innerHTML = label;
		elemWrapper.appendChild(labelElem);
		labelElem.onclick = function(e) {
			browser.myDelegate.onNodeClick(browser, browserNode, e);
		};

		var thumbnailUrl = browser.myDelegate.getThumbnail(browserNode);
		if(thumbnailUrl) {
			var thumbElem = document.createElement("img");
			thumbElem.classList.add("thumb");

			// Code path for when cookies are disabled
			var thumbnailData = browser.myDelegate.getThumbnailOptions(browserNode);
			zv.Document.requestThumbnailWithSecurity(thumbnailData, function onThumbnailSuccess(err, response) {
				if(err) {
					zvp.logger.error("Failed to load thumbnail: " + thumbnailUrl, zv.errorCodeString(zv.ErrorCodes.NETWORK_FAILURE));
					return;
				}
				thumbElem.src = window.URL.createObjectURL(response);
				thumbElem.onload = function() {
					window.URL.revokeObjectURL(thumbElem.src);
				};
			});

			elemWrapper.appendChild(thumbElem);
			thumbElem.onclick = function(e) {
				browser.myDelegate.onNodeClick(browser, browserNode, e);
			};
		}

		if(browser.myDelegate.hasContent(browserNode)) {
			browser.myDelegate.addContent(browserNode, card);
		}

		item.classList.add(browser.myDelegate.getNodeClass(browserNode));
	};

	ZhiUTech.Viewing.Private.BrowserDelegate = BrowserDelegate;
	ZhiUTech.Viewing.Private.Browser = Browser;

})();;
ZhiUTechNamespace('ZhiUTech.Viewing.Private');

(function() {

	var zvp = ZhiUTech.Viewing.Private;

	zvp.WEBGL_HELP_LINK = null;

	zvp.ErrorInfoData = {
		// UNKNOWN FAILURE
		1: {
			'img': "img-reload", // "icons/error_reload_in_viewer.png",
			'globalized-msg': "Viewer-UnknownFailure",
			'default-msg': "<title> Sorry </title>" +
				"<message>We seem to have some technical difficulties and couldn't complete your request.</message>" +
				"<hint>Try loading the item again. </hint>" +
				"<hint>Please verify your Internet connection, and refresh the browser to see if that fixes the problem.</hint>"
		},

		// BAD DATA
		2: {
			'img': "img-unsupported", // "icons/error_unsupported_file_type.png",
			'globalized-msg': "Viewer-BadData",
			'default-msg': "<title> Sorry </title>" +
				"<message>The item you are trying to view was not processed completely. </message>" +
				"<hint>Try loading the item again.</hint>" +
				"<hint>Please upload the file again to see if that fixes the issue.</hint>"
		},

		// NETWORK ERROR
		3: {
			'img': "img-reload", // "icons/error_reload_in_viewer.png",
			'globalized-msg': "Viewer-NetworkError",
			'default-msg': "<title> Sorry </title>" +
				"<message>We seem to have some technical difficulties and couldn't complete your request.</message>" +
				"<hint> Try loading the item again.</hint>" +
				"<hint> Please verify your Internet connection, and refresh the browser to see if that fixes the problem.</hint>"
		},

		// NETWORK_ACCESS_DENIED
		4: {
			'img': "img-unloack", // "icons/error_unlock_upload.png",
			'globalized-msg': "Viewer-AccessDenied",
			'default-msg': "<title> No access </title>" +
				"<message>Sorry. You donâ€™t have the required privileges to access this item.</message>" +
				"<hint> Please contact the author</hint>"
		},

		// NETWORK_FILE_NOT_FOUND
		5: {
			'img': "img-item-not-found", //"icons/error_item_not_found.png",
			'globalized-msg': "Viewer-FileNotFound",
			'default-msg': "<title> Sorry </title>" +
				"<message>We canâ€™t display the item you are looking for. It may not have been processed yet. It may have been moved, deleted, or you may be using a corrupt file or unsupported file format.</message>" +
				"<hint> Try loading the item again.</hint>" +
				"<hint> Please upload the file again to see if that fixes the issue.</hint>" +
				'<hint> <a href="http://help.zhiutech.com/view/ZhiU/ENU/?guid=GUID-488804D0-B0B0-4413-8741-4F5EE0FACC4A" target="_blank">See a list of supported formats.</a></hint>'
		},

		// NETWORK_SERVER_ERROR
		6: {
			'img': "img-reload", // "icons/error_reload_in_viewer.png",
			'globalized-msg': "Viewer-ServerError",
			'default-msg': "<title> Sorry </title>" +
				"<message>We seem to have some technical difficulties and couldn't complete your request.</message>" +
				"<hint> Try loading the item again.</hint>" +
				"<hint> Please verify your Internet connection, and refresh the browser to see if that fixes the problem.</hint>"
		},

		// NETWORK_UNHANDLED_RESPONSE_CODE
		7: {
			'img': "img-reload", // "icons/error_reload_in_viewer.png",
			'globalized-msg': "Viewer-UnhandledResponseCode",
			'default-msg': "<title> Network problem </title>" +
				"<message>Sorry. We seem to have some technical difficulties and couldn't complete your request.</message>" +
				"<hint> Try loading the item again.</hint>" +
				"<hint> Please verify your Internet connection, and refresh the browser to see if that fixes the problem.</hint>"
		},

		// BROWSER_WEBGL_NOT_SUPPORTED
		8: {
			'img': "img-unsupported", // "icons/error_unsupported_file_type.png",
			'globalized-msg': "Viewer-WebGlNotSupported",
			'default-msg': "<title>Sorry</title><message>We can't show this item because this browser doesn't support WebGL.</message><hint>Try Google Chrome, Mozilla Firefox, or another browser that supports WebGL 3D graphics.</hint><hint>For more information, see the <a href=\"WEBGL_HELP\" target=\"_blank\">A360 browser reqirements.</a></hint>"
		},

		// BAD_DATA_NO_VIEWABLE_CONTENT
		9: {
			'img': "img-item-not-found", // "icons/error_item_not_found.png",
			'globalized-msg': "Viewer-NoViewable",
			'default-msg': "<title> No viewable content </title>" +
				"<message>Thereâ€™s nothing to display for this item. It may not have been processed or it may not have content we can display.</message>" +
				"<hint> Please contact the author.</hint>" +
				"<hint> Please upload the file again to see if that fixes the issue.</hint>"
		},

		// BROWSER_WEBGL_DISABLED
		10: {
			'img': "img-unsupported", // "icons/error_unsupported_file_type.png",
			'globalized-msg': "Viewer-WebGlDisabled",
			'default-msg': "<title>Sorry</title><message>We can't show this item because WebGL is disabled on this device.</message><hint> For more information see the <a href=\"WEBGL_HELP\" target=\"_blank\">A360 Help.</a></hint>"
		},

		// BAD_DATA_MODEL_IS_EMPTY
		11: {
			'img': "img-item-not-found", // "icons/error_item_not_found.png",
			'globalized-msg': "Viewer-ModeIsEmpty",
			'default-msg': "<title>Model is empty</title>" + "<message>Model is empty, there is no geometry for the viewer to show.</message>" +
				"<hint> Please contact the author.</hint>" +
				"<hint> Please upload the file again to see if that fixes the issue.</hint>"
		},

		// RTC_ERROR
		12: {
			'img': "img-unsupported", // "icons/error_unsupported_file_type.png",
			'globalized-msg': "Viewer-RTCError",
			'default-msg': "<title> Sorry </title>" +
				"<message>We couldnâ€™t connect to the Collaboration server.</message>" +
				"<hint> Please verify your Internet connection, and refresh the browser to see if that fixes the problem.</hint>"
		},

		// UNSUPORTED_FILE_EXTENSION
		13: {
			'img': "img-unsupported", // "icons/error_unsupported_file_type.png",
			'globalized-msg': "Viewer-FileExtNotSupported",
			'default-msg': {
				"title": "Sorry",
				"message": "The file extension loaded into the Viewer is not supported",
				"hints": [
					"Try a different file"
				]
			}
		}
	};

	zvp.currentError = null;
	zvp.currentErrors = null;

	zvp.ErrorHandler = function() {};

	zvp.ErrorHandler.prototype.constructor = zvp.ErrorHandler;

	zvp.ErrorHandler.reportError = function(container, errorCode, errorMsg, statusCode, statusText, errorType) {
		zvp.ErrorHandler.currentError = null;
		zvp.ErrorHandler.currentErrors = null;

		// If there is no errorCode, just return (otherwise an empty alert box is being shown)
		if(!errorCode)
			return;

		var errorLog = {
			category: "error",
			code: errorCode,
			message: errorMsg,
			httpStatusCode: statusCode,
			httpStatusText: statusText
		};
		zvp.logger.track(errorLog, true);

		zvp.ErrorHandler.currentError = [container, errorCode, errorMsg, errorType];

		var errorInfo = zvp.ErrorInfoData[errorCode];
		if(errorInfo) {
			var options = {
				"defaultValue": ""
			};

			options.defaultValue = errorInfo['default-msg'];
			var imgClass = errorInfo["img"];
			var errorGlobalizedMsg = errorInfo['globalized-msg'];

			var error = this.parseErrorString(errorGlobalizedMsg, options);

			if(errorCode === ZhiUTech.Viewing.ErrorCodes.BROWSER_WEBGL_DISABLED ||
				errorCode === ZhiUTech.Viewing.ErrorCodes.BROWSER_WEBGL_NOT_SUPPORTED) {
				var WEBGL_HELP_LINK = zvp.WEBGL_HELP_LINK || "http://www.zhiutech.com/a360-browsers";

				for(var i = 0; i < error.hints.length; i++) {
					var index = error.hints[i].indexOf('href="WEBGL_HELP"');
					if(index !== -1) {
						error.hints[i] = error.hints[i].replace('href="WEBGL_HELP"', 'href="' + WEBGL_HELP_LINK + '"');
					}
				}
			}

			zvp.AlertBox.displayError(container, error.msg, error.header, imgClass, error.hints);
		} else {
			var imgClass = "img-unsupported"; // "icons/error_unsupported_file_type.png";

			var options = {
				"defaultValue": "",
				"interpolationPrefix": "{",
				"interpolationSuffix": "}"
			};

			this.parseArguments(errorMsg, options);
			var error = this.parseErrorString(errorCode, options);

			if(!error.header)
				error.header = (errorType === "warning") ? ZhiUTech.Viewing.i18n.translate("header-warning") : "";
			zvp.AlertBox.displayError(container, error.msg, error.header, imgClass, error.hints);
		}
	};

	zvp.ErrorHandler.reportErrors = function(container, errors) {
		zvp.ErrorHandler.currentError = null;
		zvp.ErrorHandler.currentErrors = null;

		if(!errors)
			return;

		zvp.ErrorHandler.currentErrors = [container, errors];

		var options = {
			"defaultValue": "",
			"interpolationPrefix": "{",
			"interpolationSuffix": "}"
		};

		var formattedErrors = [];
		for(var i = 0; i < errors.length; i++) {
			if(!errors[i].code)
				continue;

			this.parseArguments(errors[i].message, options);

			var error = this.parseErrorString(errors[i].code, options);
			if(!error.header)
				error.header = (errors[0].type === "warning") ? ZhiUTech.Viewing.i18n.translate("header-warning", {
					"defaultValue": "Warning"
				}) : "";

			formattedErrors.push(error);

			var errorLog = {
				category: "error",
				code: errors[i].code,
				message: errors[i].message
			};
			zvp.logger.track(errorLog, true);
		}

		if(!formattedErrors.length)
			return;

		// Default image.
		var imgClass = "img-unsupported"; // "icons/error_unsupported_file_type.png";

		zvp.AlertBox.displayErrors(container, imgClass, formattedErrors);
	};

	zvp.ErrorHandler.parseArguments = function(errorMsg, options) {
		if(!errorMsg)
			return;

		// Add arguments
		if(typeof(errorMsg) === "string") {
			options.defaultValue = errorMsg;
		} else {
			// If there is an array, then there are arguments in the string.
			// Add them to the options (arguments are named: 0, 1, 2, ...
			options.defaultValue = errorMsg[0];
			for(var i = 1; i < errorMsg.length; i++) {
				var arg = i - 1;
				var argName = arg.toString();
				options[argName] = errorMsg[i];
			}
		}
	};

	zvp.ErrorHandler.parseErrorString = function(errorCode, options) {
		var error = {
			"msg": null,
			"msgList": null,
			"header": null,
			"hints": null
		};

		if(!errorCode)
			return error;

		// Support for "new" format that doesn't embed HTML tags into the localization strings.
		if(typeof options.defaultValue === 'object') {
			var obj = options.defaultValue;
			error.header = obj.title;
			error.msg = obj.message;
			error.hints = obj.hints.concat();
			return error;
		}

		// Translate the message.
		var msg = ZhiUTech.Viewing.i18n.translate(errorCode, options);
		if(!msg)
			return error;

		// Split into header, message and hints. The messages may have the following format
		//   <title>header</title>text of the error message. <hint> hint-1 <hint> hint-2 ... <hint> hint-n
		//

		// Get the header
		if(msg.indexOf("<title>") != -1) {
			var parts = msg.split("<title>")[1].split("</title>");
			error.header = parts[0];
			msg = parts[1];
		}

		// Extract the message last.
		if(msg && msg.indexOf("<message>") != -1) {
			var parts = msg.split("<message>")[1].split("</message>");
			error.msg = parts[0];
			msg = parts[1];
		} else {
			error.msg = msg;
		}

		// Extract the hints next.
		if(msg && msg.indexOf("<hint>") != -1) {
			// There are hints.
			error.hints = [];
			var hints = msg.split("<hint>");
			for(var h = 0; h < hints.length; h++) {
				var hint = hints[h].split("</hint")[0];
				error.hints.push(hint);
			}
		}

		return error;
	};

	zvp.ErrorHandler.localize = function() {
		if(zvp.AlertBox.instances.length > 0) {
			zvp.AlertBox.dismiss();

			if(zvp.ErrorHandler.currentError) {
				var container = zvp.ErrorHandler.currentError.shift();
				var error = zvp.ErrorHandler.currentError;
				zvp.ErrorHandler.reportError(container, error[0], error[1], error[2]);
			} else {
				var container = zvp.ErrorHandler.currentErrors.shift();
				var errors = zvp.ErrorHandler.currentErrors[0];
				zvp.ErrorHandler.reportErrors(container, errors);
			}
		}
	};

})();;
ZhiUTech.Viewing.Extensions.ViewerPanelMixin = function() {
	/**
	 * Returns the parent's container bounding rectangle.
	 *
	 * @returns {ClientRect} - bounding rectangle of the parent.
	 */
	this.getContainerBoundingRect = function() {
		var bounds = this.parentContainer.getBoundingClientRect();

		var toolbarBounds = {
			height: 0,
			width: 0,
			left: 0,
			bottom: 0,
			right: 0,
			top: 0
		};

		var toolbar = document.getElementsByClassName("toolbar-menu");
		if(toolbar && toolbar.length > 0) {
			toolbarBounds = toolbar[0].getBoundingClientRect();
		}

		// TODO: This assumes that toolbar is horizontal and at the bottom.
		// Once the toolbar can be positioned somewhere else (top, right, left)
		// this code will need to be expanded to return the right bounds for each case.
		return {
			height: bounds.height - toolbarBounds.height,
			width: bounds.width,
			left: bounds.left,
			bottom: bounds.bottom - toolbarBounds.height,
			right: bounds.right,
			top: bounds.top
		};
	};
};;