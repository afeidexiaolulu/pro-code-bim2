
(function() {

	"use strict";

	var zv = ZhiUTech.Viewing;
	var zvp = ZhiUTech.Viewing.Private;

	/**
	 * Core model data class for all items and collections.
	 *
	 * It allows the client to load the model data from the cloud, it
	 * gives access to the root and provides a method for finding elements
	 * by id.
	 *
	 * Typically, you load the document from the Viewing Service, parse it for
	 * the required content (for example, 3d geometries), then pass this on to
	 * the viewer to display.  You can also get some information about the document,
	 * such as the number of views it contains and its thumbnail image.
	 *
	 * You can view the JSON structure of a {@link ZhiUTech.Viewing.Document} object
	 * by requesting it from the Model Derivative endpoints.
	 *
	 * @constructor
	 * @memberof ZhiUTech.Viewing
	 * @alias ZhiUTech.Viewing.Document
	 * @param {object} dataJSON - JSON data representing the document.
	 * @param {string} path - Path to the document.
	 * @param {string} acmsession - ACM session ID.
	 * @category Core
	 */
	var Document = function(dataJSON, path, acmsession) {
		this.myPath = path;
		this.myData = dataJSON;

		if(dataJSON)
			this.docRoot = new zv.BubbleNode(dataJSON);

		this.myViewGeometry = {};
		this.myNumViews = {};
		this.myPropertyDb = null;
		this.acmSessionId = acmsession;

		// Search bubble for type="view" role="3d" children of type="geometry" role="3d" items.
		// Add count of view-3d items to parent geometry-3d items.
		// Collect geometry items of camera view items referenced by guid.
		//
		var self = this;

		function annotateViews(item) {
			if(!item) {
				return;
			}

			var children = item.children || item.derivatives;
			var childCount = children ? children.length : 0;
			var i;

			if(item.type === "geometry" && childCount) {
				var viewCount = 0;
				for(i = 0; i < childCount; i++) {
					var child = children[i];
					if(child && child.type === "view") {
						self.myViewGeometry[child.guid] = item;
						viewCount++;
					}
				}

				self.myNumViews[item.guid] = viewCount;

			} else if(item.mime == "application/zhiutech-db" && item.urn) {
				//If there is a shared property database, remember its location

				//Of course, OSS is a storage system that mangles paths because why not,
				//so it needs special handling to extract the property database path
				if(item.urn.indexOf(zvp.ViewingService.OSS_PREFIX) === 0)
					self.myPropertyDb = item.urn.substr(0, item.urn.lastIndexOf("%2F") + 3);
				else
					self.myPropertyDb = item.urn.substr(0, item.urn.lastIndexOf("/") + 1);

			} else if(0 < childCount) {
				for(i = 0; i < childCount; i++) {
					annotateViews(children[i]);
				}
			}
		}
		annotateViews(dataJSON);

		// Traverse the document and populate the parent pointers (for each node, store its parent).
		//
		function traverse(item) {
			if(!item)
				return;

			var children = item.children || item.derivatives;
			var len = children ? children.length : 0;
			for(var i = 0; i < len; i++) {
				children[i].parent = item;
				traverse(children[i]);
			}
		}
		traverse(this.myData);
	};

	Document.prototype.constructor = Document;

	/**
	 * Static method to load the model data from the cloud.
	 *
	 * @example
	 *  // Load the model from the cloud
	 *  var urn = 'dXJuOmFkc2suczM6ZGVyaXZlZC5maWxlOnRyYW5zbGF0aW9uXzI1X3Rlc3RpbmcvRFdGL0Nhci5kd2Y=';
	 *  var seedFile  = "https://developer.api.zhiutech.com/modelderivative/v2/designdata/" + urn + "/manifest";
	 *  var jsonData = "";
	 *  ZhiUTech.Document.load( seedFile, function( doc ) { jsonData=doc }, function( ) { } );
	 *  var model = new ZhiUTech.Document(jsonData, 'path');
	 *  var root  = model.getRootItem(); // top item of the hierarchy of the model data
	 *  var item  = model.getItemById( "XXX02UUEs" );
	 *  var path = model.getFullPath(); // should be 'path'
	 *
	 * @param {string} documentId - The cloud URN of the file.
	 * @param {function(object)} onSuccessCallback - A function that is called when load succeeds.
	 * @param {function(int, string)} onErrorCallback - A function that is called when load fails.
	 * @param {object} accessControlProperties - An optional list of key value pairs as access control properties,
	 * which includes a list of access control header name and values, and an OAuth 2.0 access token.
	 */
	Document.load = function(documentId, onSuccessCallback, onErrorCallback, accessControlProperties) {
		function getViewableCount(modelDocument) {
			var viewableItems = Document.getViewableItems(modelDocument);
			var root = viewableItems[0];
			var geometryItems = Document.getSubItemsWithProperties(root, {
				'type': 'geometry'
			}, true);
			return geometryItems.length;
		}

		function getGlobalMessages(data, nestedKey) {

			var collectedmessages = [];
			var translateFailedCount = 0;
			var translateProgressCount = 0;
			nestedKey = nestedKey || "children";

			var traverse = function(obj) {
				var children = obj[nestedKey] || [];
				var messages = obj.messages || [];

				var errorMessages = messages.filter(function(msg) {
					return msg.type === 'error';
				});

				if(errorMessages.length > 0) {
					translateFailedCount += 1;
				}

				if(obj.status === 'inprogress') {
					translateProgressCount += 1;
				}

				Array.prototype.push.apply(collectedmessages, messages.slice(0));
				for(var i = children.length; i--; traverse(children[i]));
			};

			traverse(data);

			var progress = 'translated';

			progress = translateFailedCount > 0 ? "failed" : progress;
			progress = translateProgressCount > 0 ? 'processing' : progress;

			for(var i = collectedmessages.length; i--; collectedmessages[i].$translation = progress);

			return collectedmessages;

		}

		function doLoad(acmsession) {

			var documentPath = Document.getDocumentPath(documentId);
			var messages;

			function onSuccess(data) {
				var regex = /<[^>]*script/;
				if(regex.test(data)) {
					if(onErrorCallback)
						onErrorCallback(zv.ErrorCodes.BAD_DATA, "Malicious document content detected Abort loading");
					return;
				}

				var items = typeof(data) === 'string' ? JSON.parse(data) : data;

				// Fluent endpoint has a different form of acmsession, in where
				// the forge-urn also acts as the acmsession for their ACL checks.
				// The acmsession is not required for the fluent-manifest, but it 
				// is requied for all other forge-hosted derivatives.
				if(zv.endpoint.getApiFlavor() === zv.endpoint.ENDPOINT_API_FLUENT) {
					acmsession = items.urn;
				}

				var lmvDocument = new Document(items, documentPath, acmsession);
				var viewableCount = getViewableCount(lmvDocument);

				// Check if there are any viewables.
				if(viewableCount > 0) {
					messages = getGlobalMessages(lmvDocument.getRootItem());
					if(onSuccessCallback) {
						onSuccessCallback(lmvDocument, messages);
					}
				} else {
					// If there are no viewables, report an error.
					//
					if(onErrorCallback) {
						messages = getGlobalMessages(lmvDocument.getRootItem());
						var errorCode = zv.ErrorCodes.BAD_DATA_NO_VIEWABLE_CONTENT;
						var errorMsg = "No viewable content";
						onErrorCallback(errorCode, errorMsg, messages);
					}
				}
			}

			function onFailure(statusCode, statusText, data) {

				var messages = getGlobalMessages(data);
				if(onErrorCallback) {
					var errorMsg = "Error: " + statusCode + " (" + statusText + ")";
					var errorCode = zv.getErrorCode(statusCode);
					onErrorCallback(errorCode, errorMsg, statusCode, statusText, messages);
				}
			}

			var msg = {
				queryParams: acmsession ? "acmsession=" + acmsession : ""
			};

			zvp.ViewingService.getManifest(zvp.initLoadContext(msg), documentPath, onSuccess, onFailure);
		}

		if(accessControlProperties) {
			zvp.ViewingService.getACMSession(zv.endpoint.getApiEndpoint(), accessControlProperties, doLoad, onErrorCallback);
		} else {
			doLoad();
		}
	};

	/**
	 * Available from 2.15
	 * 
	 * @private
	 */
	Document.getDocumentPath = function(documentId) {
		// Handle local paths explicitly.
		//
		if(documentId.indexOf('urn:') === -1) {

			//Absolute URL
			if(documentId.indexOf("://") !== -1)
				return documentId;

			var relativePath = documentId;

			if(typeof window !== "undefined") {
				if(relativePath.indexOf('/') !== 0)
					relativePath = '/' + relativePath;
				return window.location.protocol + "//" + window.location.host + relativePath;
			} else {
				return relativePath;
			}
		}
		return documentId;
	}

	/**
	 * This function is only used when Authorization is through Bearer token; aka when cookies are disabled.
	 * @param {string} data - See {@link ZhiUTech.Viewing.Document#getThumbnailOptions}.
	 * @param {function} onComplete - Node style callback function `callback(err, response)`.
	 */
	Document.requestThumbnailWithSecurity = function(data, onComplete) {

		var onSuccess = function(response) {
			onComplete(null, response);
		};
		var onFailure = function() {
			onComplete('error', null);
		};

		var options = {
			responseType: 'blob',
			skipAssetCallback: true,
			size: data.width, //Ignore the height, they are the same.
			guid: data.guid
		};

		var urlpath = "urn:" + data.urn; //HACK: Adding urn: makes the ViewingServiceXhr accept this as a viewing service request.
		zvp.ViewingService.getThumbnail(zvp.initLoadContext(), urlpath, onSuccess, onFailure, options);
	};

	/**
	 * Returns the full path to the given URN.
	 * @param {string} urn - URN of the document.
	 * @returns {string}
	 */
	Document.prototype.getFullPath = function(urn) {

		if(!urn)
			return urn;

		var fullPath = urn;

		if(zvp.offline) {
			// If offline resource prefix is already added to path, then no need to add again.
			if(fullPath.indexOf(zv.Private.offlineResourcePrefix) == -1) {

				var ossIndex = fullPath.indexOf(zv.Private.ViewingService.OSS_PREFIX);
				if(ossIndex !== -1) {
					var ossObject = fullPath.substr(fullPath.indexOf("/") + 1);
					var decodeObject = decodeURIComponent(ossObject);
					var object = decodeObject.substr(decodeObject.indexOf("/"));
					fullPath = decodeURIComponent(zv.Private.offlineResourcePrefix) + object;
				} else {
					fullPath = decodeURIComponent(zv.Private.offlineResourcePrefix) + fullPath.substr(fullPath.indexOf('/'));
				}
			}
		} else if(urn.indexOf('urn') === 0) {
			// Use viewing service.
			fullPath = zv.endpoint.getItemApi(null, urn);
		}
		// Handle local bubble files.
		//
		else if(urn.indexOf('$file$') === 0) {
			fullPath = this.myPath.replace('/bubble.json', '') + urn.replace('$file$', '');
		}
		return fullPath;
	};

	/**
	 * Returns a plain object with properties used to fetch a thumbnail image.
	 * @param {object} item
	 * @param {number} width
	 * @param {number} height
	 * @returns {object} `{urn: string, width: number, height: number, guid: string, acmsession: (string)}`
	 */
	Document.prototype.getThumbnailOptions = function(item, width, height) {
		var requestedWidth = width ? width : 200;
		var requestedHeight = height ? height : 200;
		return {
			urn: this.myData.urn,
			width: requestedWidth,
			height: requestedHeight,
			guid: item.guid,
			acmsession: this.acmSessionId
		}
	};

	/**
	 * Returns the path to the thumbnail of the item with the given ID.
	 * @param {string} item - Document item.
	 * @param {int} width - The requested thumbnail width.
	 * @param {int} height - The requested thumbnail height.
	 * @returns {string}
	 */
	Document.prototype.getThumbnailPath = function(item, width, height) {
		var data = this.getThumbnailOptions(item, width, height);
		var ret = zv.endpoint.getThumbnailApi(null, data.urn) +
			"?guid=" + data.guid +
			"&width=" + data.width +
			"&height=" + data.height;

		if(data.acmsession) {
			ret += "&acmsession=" + data.acmsession;
		}
		return ret;
	};

	Document.prototype.getLeafletZipParams = function(outLoadOptions, geomItem) {
		var leafletZipItem = Document.getSubItemsWithProperties(geomItem, {
			'role': 'leaflet-zip'
		}, false);

		var currentZip;
		var zipParams;

		for(var i = 0; i < leafletZipItem.length; i++) {
			zipParams = {};
			currentZip = leafletZipItem[i];

			zipParams.urnZip = this.getFullPath(currentZip.urn);
			zipParams.centralDirOffset = currentZip.central_dir_offset;
			zipParams.centralDirLength = currentZip.central_dir_length;
			zipParams.centralDirEntries = currentZip.central_dir_entries;
			zipParams.zipMaxLevel = currentZip.max_level - outLoadOptions.levelOffset;
			zipParams.loadFromZip = !!(zipParams.urnZip && zipParams.centralDirOffset && zipParams.centralDirLength && zipParams.centralDirEntries);

			if(!outLoadOptions.zips) {
				outLoadOptions.zips = [];
			}

			outLoadOptions.zips.push(zipParams);
		}

		outLoadOptions.zips.sort(function(a, b) {
			return a.zipMaxLevel - b.zipMaxLevel;
		});
	};

	/**
	 * Extracts leaflet loader params from an item (if any).
	 * @param {object} outLoadOptions - Extracted params are stored in this object.
	 * @param {object} geomItem - Geometry item with role '2d' that contains
	 * the leaflet resource item.
	 * @param {string} leafletItem - The resource item with role 'leaflet' that
	 * contains the tile url pattern and some other params.
	 */
	Document.prototype.getLeafletParams = function(outLoadOptions, geomItem, leafletItem) {

		outLoadOptions.tileSize = leafletItem.tileSize ? leafletItem.tileSize : 512; // currently, bubbles use a fixed tile size of 512.
		outLoadOptions.texWidth = leafletItem.resolution[0];
		outLoadOptions.texHeight = leafletItem.resolution[1];
		outLoadOptions.paperWidth = leafletItem.paperWidth;
		outLoadOptions.paperHeight = leafletItem.paperHeight;
		outLoadOptions.paperUnits = leafletItem.paperUnits;
		outLoadOptions.urlPattern = leafletItem.urn;

		// hierarchies produced by cloud translation service start with a 1x1 miplevel at the root.
		// therefore, we have to skip some levels.
		outLoadOptions.levelOffset = zvp.LeafletLoader.computeLevelOffset(outLoadOptions.tileSize);

		this.getLeafletZipParams(outLoadOptions, geomItem);

		outLoadOptions.loadFromZip = outLoadOptions.zips && outLoadOptions.zips[0].loadFromZip;

		// By default, the number of hierarchy levels is computed automatically from texWidth/texHeight.
		// (see computeMaxLevel() in ModelIteratorTexQuad.js). However, the leaflet item also
		// contains a maxLevel value, which is usually smaller than the computed one. The purpose
		// of this value is to specify the (reduced) number of levels that we use when viewing
		// the leaflet in offline mode on mobile devices. Otherwise, we let maxLevel undefined, so
		// that the full resolution is used.
		if(outLoadOptions.zips && zvp.offline && zv.isMobileDevice()) {
			// maxLevel is stored in another resource item that references a zip-file with the tile-images.
			// the max_level value includes several levels with just one tile (1x1, 2x2, ...) which we skip.

			// Currently for mobile devices in offline mode, we assume they download only the first zip, 
			// due to data consumption and download time. 
			// If it will change, we don't need to slice the zips array, and need to change zips[0] to zips[zips.length-1].

			// Keep only first zip
			outLoadOptions.zips = outLoadOptions.zips.slice(0, 1);
			outLoadOptions.maxLevel = outLoadOptions.zips[0].zipMaxLevel;
		}
	};

	/**
	 * Returns the relative path to the viewable of the given item.
	 * @param {object} item - The item whose viewable is requested.
	 * @param {object} outLoadOptions - Output param: used to store some additional loader options.
	 * Needed to extract leaflet params from a bubble item.
	 * @returns {string}
	 */
	Document.prototype.getViewableUrn = function(item, outLoadOptions) {
		// Operate with a bubbleNode
		var bubbleNode = (item instanceof zv.BubbleNode) ? item : new zv.BubbleNode(item);

		if(bubbleNode.isGeometry()) {
			var items = [];
			if(bubbleNode.is3D()) {
				// delegate to BubbleNode, which has OTG support
				return bubbleNode.getViewableRootPath();
			} else if(bubbleNode.is2D()) {

				// check for a leaflet resource
				items = bubbleNode.search(zv.BubbleNode.LEAFLET_NODE);

				// found one? => extract its params
				if(items.length > 0 && outLoadOptions) {
					this.getLeafletParams(outLoadOptions, bubbleNode.data, items[0].data);
				}

				// if there is no leaflet...
				// check for single image source
				if(items.length === 0) {
					items = bubbleNode.search(zv.BubbleNode.IMAGE_NODE);
				}

				if(items.length === 0) {
					// check for vector and if does not exist for tiles.
					items = bubbleNode.search(zv.BubbleNode.GEOMETRY_F2D_NODE);
				}

			}
			if(items.length > 0) {
				return items[0].urn();
			}
		} else if(bubbleNode.isViewPreset()) {
			var geometryItem = this.getViewGeometry(bubbleNode.data);
			if(geometryItem)
				return this.getViewableUrn(geometryItem, outLoadOptions);
		}

		return '';
	};

	/**
	 * Returns the absolute path to the viewable of the given item, including server endpoint.
	 * @param {object} item - The item whose viewable is requested.
	 * @param {object} outLoadOptions - Output param: used to store some additional loader options.
	 * Needed to extract leaflet params from a bubble item.
	 * @returns {string}
	 */
	Document.prototype.getViewablePath = function(item, outLoadOptions) {
		var relPath = this.getViewableUrn(item, outLoadOptions);

		if(!relPath)
			return "";

		return this.getFullPath(relPath);
	};

	/**
	 * Returns the root path to a shared (across all sheets/views) property database's JSON files.
	 * @returns {string}
	 */
	Document.prototype.getPropertyDbPath = function() {
		return this.getFullPath(this.myPropertyDb);
	};

	/**
	 *  Returns the root of the model data hierarchy.
	 *  @returns {object}
	 */
	Document.prototype.getRootItem = function() {
		return this.myData;
	};

	/**
	 * Returns a BubbleNode instance, encapsulating the current document manifest JSON
	 * @returns {ZhiUTech.Viewing.BubbleNode}
	 */
	Document.prototype.getRoot = function() {
		return this.docRoot;
	};

	/**
	 *  Returns the id of this document.
	 *  @returns {string}
	 */
	Document.prototype.getPath = function() {
		return this.myPath;
	};

	/**
	 * Returns an item from the model data hierarchy with the given id.
	 * If the item is not found, null object is returned.
	 * @param {string} id - ID of the item to be found.
	 * @returns {object} Item with a given ID.
	 */
	Document.prototype.getItemById = function(id) {
		function traverse(data) {
			if(!data)
				return null;

			for(var key in data) {
				var val = data[key];
				if(key === 'guid' && val === id)
					return data;

				if(val !== null && typeof(val) === "object" && key !== "parent") {
					//going on step down in the object tree!!
					var item = traverse(val);
					if(item)
						return item;
				}
			}
			return null;
		}
		return traverse(this.myData);
	};

	/**
	 * Static method that returns an array of all items with given properties.
	 * @param {object} item - The document node to begin searching from.
	 * @param {object} properties - map/list of the properties to search for.
	 * @param {boolean} recursive - If true, searches recursively.
	 * @returns {object} List of items that have given properties.
	 * @example
	 *  // search the document starting from the root element for all 2d geometry items
	 *  geometryItems = Document.getSubItemsWithProperties(adocument.getRootItem(), {
	 *      'type' : 'geometry',
	 *      'role' : '2d'
	 *  }, true);
	 */
	Document.getSubItemsWithProperties = function(item, properties, recursive) {
		var subItems = [];
		if(!item) return [];

		function hasProperties(item, properties) {
			for(var p in properties) {
				if(!(p in item) || (properties[p] !== item[p]))
					return false;
			}
			return true;
		}

		var children = item.children || item.derivatives;
		var len = children ? children.length : 0;
		for(var i = 0; i < len; i++) {
			// Check if this child has this key and value.
			//
			var child = children[i];
			if(hasProperties(child, properties)) {
				subItems.push(child);
			}

			// Search the descendants if requested.
			//
			if(recursive) {
				subItems.push.apply(subItems, Document.getSubItemsWithProperties(child, properties, recursive));
			}
		}
		return subItems;
	};

	/**
	 *
	 * @param document
	 */
	Document.getViewableItems = function(document) {

		return(
			Document.getSubItemsWithProperties(document.getRootItem(), {
				'type': 'folder',
				'role': 'viewable'
			}, true).concat(
				Document.getSubItemsWithProperties(document.getRootItem(), {
					'outputType': 'esd'
				}, true)));
	};

	/**
	 * Returns the parent geometry item for a given view item.
	 * @param {object} item - View item.
	 * @returns {object} The parent geometry item.
	 */
	Document.prototype.getViewGeometry = function(item) {
		return this.myViewGeometry[item.guid];
	};

	/**
	 * Returns the number of view items underneath a geometry item.
	 * @param {object} item - Geometry item.
	 * @returns {number} The number of view items underneath the geometry item.
	 */
	Document.prototype.getNumViews = function(item) {
		return this.myNumViews[item.guid] || 0;
	};

	/**
	 * @deprecated Simply use item.parent instead.
	 * Returns parent ID of the given document node ID.
	 * @param {string} item - The node ID.
	 * @returns {string}
	 */
	Document.prototype.getParentId = function(itemId) {
		var item = this.getItemById(itemId);
		if(!item)
			return null;
		var parent = item.parent;
		return parent ? parent.guid : null;
	};

	/**
	 * Returns messages (error and warning messages) associated with a given item.
	 * It includes item's messages as well as messages of all its parents.
	 * @param {string} itemId - GUID of the item.
	 * @param {boolean} - If true, the top messages that apply to the whole file are excluded.
	 * @returns {object} Returns an array of messages.
	 */
	Document.prototype.getMessages = function(item, excludeGlobal) {

		var messages = [];
		if(!item)
			return messages;

		var root = null;
		if(excludeGlobal)
			root = this.getRootItem();

		var current = item;
		while(current) {

			if(excludeGlobal && parent === root)
				break;

			if(current.messages) {
				for(var i = 0; i < current.messages.length; i++) {
					messages.push(current.messages[i]);
				}
			}
			current = current.parent;
		}
		return messages;
	};

	zv.Document = Document;

})();;