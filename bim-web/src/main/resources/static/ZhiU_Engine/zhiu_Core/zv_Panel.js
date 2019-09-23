
(function() {
	"use strict";

	var zv = ZhiUTech.Viewing;
	var avu = ZhiUTech.Viewing.UI;

	// Output similar to: https://jsfiddle.net/mmsgxwvf/1/
	function LoadingSpinner(parentDiv) {

		this.parentDiv = parentDiv;
		this.container = document.createElement('div');
		this.container.innerHTML = [
			'<div class="path">',
			'<svg width="100%" height="100%" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
			'<path d="M2.5,50a47.5,47.5 0 1,0 95,0a47.5,47.5 0 1,0 -95,0" vector-effect="non-scaling-stroke"/>',
			'<path d="M 2.5 50 A 47.5 47.5 0 0 1 47.5 2.5" vector-effect="non-scaling-stroke"/>',
			'</svg>',
			'</div>',
			'<div class="message" data-i18n="Spinner Loading">LOADING</div>'
		].join('');
		this.container.className = 'loading-spinner';
	}

	LoadingSpinner.prototype.addClass = function(className) {
		this.container.classList.add(className);
	};

	LoadingSpinner.prototype.attachToDom = function() {
		if(!this.container.parentNode) {
			ZhiUTech.Viewing.i18n.localize(this.container);
			this.parentDiv.appendChild(this.container);
			return true;
		}
		return false;
	};

	LoadingSpinner.prototype.removeFromDom = function() {
		if(this.container.parentNode) {
			this.container.parentNode.removeChild(this.container);
			return true;
		}
		return false;
	};

	LoadingSpinner.prototype.setVisible = function(visible) {
		if(visible) {
			this.attachToDom();
		} else {
			this.removeFromDom();
		}
	};

	ZhiUTech.Viewing.UI.LoadingSpinner = LoadingSpinner;
})();;
(function() {
	'use strict';

	var avu = ZhiUTech.Viewing.UI,
		zv = ZhiUTech.Viewing,
		zvp = ZhiUTech.Viewing.Private;

	/**
	 * Tree view control delegate
	 * This class allows you to customize the behavior of a Tree view control.
	 * Override the methods you want and pass an instance of this class to
	 * the Tree constructor.
	 * @constructor
	 */
	var TreeDelegate = function() {};

	TreeDelegate.prototype.constructor = TreeDelegate;

	/**
	 * Override this method to specify whether or not a node is a group node
	 * @param {Object} node - Node in the model Document
	 * @returns {boolean} true if this node is a group node, false otherwise
	 */
	TreeDelegate.prototype.isTreeNodeGroup = function(node) {
		throw 'isTreeNodeGroup is not implemented.';
	};

	/**
	 * Override this method to specify the id for a node
	 * @param {Object} node - Node in the model Document
	 * @returns {string} Id of the tree node
	 */
	TreeDelegate.prototype.getTreeNodeId = function(node) {
		throw 'getTreeNodeId is not implemented.';
	};

	/**
	 * Override this method to specify the index for a node
	 * @param {Object} node - Node in the model Document
	 * @returns {string} Id of the tree node
	 */
	TreeDelegate.prototype.getTreeNodeIndex = function(node) {
		throw 'getTreeNodeIndex is not implemented.';
	};

	/**
	 * Override this method to specify the parent node id for a node
	 * @param {string} nodeId - Node in the model Document
	 * @returns {string} Id of the tree node
	 */
	TreeDelegate.prototype.getTreeNodeParentId = function(nodeId) {
		throw 'getTreeNodeParentId is not implemented.';
	}

	/**
	 * Override this method to specify the label for a node
	 * @param {Object} node - Node in the model Document
	 * @returns {string} Label of the tree node
	 */
	TreeDelegate.prototype.getTreeNodeLabel = function(node) {
		return node.name;
	};

	/**
	 * Override this method to specify the total number of nodes in the tree
	 * @returns {Number} Number of nodes in the tree.
	 */
	TreeDelegate.prototype.getTreeNodeCount = function() {
		throw 'getTreeNodeCount is not implemented.';
	};

	/**
	 * Override this method to specify if a tree node should be created for this node
	 * @param {Object} node - Node in the model Document
	 * @returns {boolean} true if a node should be created, false otherwise
	 */
	TreeDelegate.prototype.shouldCreateTreeNode = function(node) {
		return true;
	};

	/**
	 * Iterates over the children of a given node and calls the callback with each child.
	 */
	TreeDelegate.prototype.forEachChild = function(node, callback) {
		var childCount = node.children ? node.children.length : 0;
		for(var childIndex = 0; childIndex < childCount; ++childIndex) {
			var child = node.children[childIndex];
			callback(child);
		}
	};

	/**
	 * Override this to create the HTMLContent for this node for appending to the
	 * parent.  By default, a label is created.
	 *
	 * @param {Object} node - Node in the model Document
	 * @param {HTMLElement} parent - the parent for this content.
	 * @param {Object=} [options] - An optional dictionary of options.  Current parameters:
	 *                              {boolean} [localize] - when true, localization is attempted for the given node; false by default.
	 *
	 * @private
	 */
	TreeDelegate.prototype.createTreeNode = function(node, parent, options) {
		var label = document.createElement('label');
		parent.appendChild(label);

		var text = this.getTreeNodeLabel(node);
		if(options && options.localize) {
			label.setAttribute('data-i18n', text);
			text = ZhiUTech.Viewing.i18n.translate(text);
		}
		label.textContent = text;
	};

	/**
	 * Override this method to do something when the user clicks on a tree node
	 * @param {Tree} tree
	 * @param {Object} node - Node in the model Document
	 * @param {Event} event
	 */
	TreeDelegate.prototype.onTreeNodeClick = function(tree, node, event) {};

	/**
	 * Override this to do something when the user clicks on this tree node's icon.
	 * The default behavior is for the icons for group nodes to toggle the collapse/expand
	 * state of that group.
	 * @param {Tree} tree
	 * @param {Object} node - Node in the model Document
	 * @param {Event} event
	 */
	TreeDelegate.prototype.onTreeNodeIconClick = function(tree, node, event) {
		if(tree.delegate().isTreeNodeGroup(node)) {
			tree.setCollapsed(node, !tree.isCollapsed(node));
		}
	};

	/**
	 * Override this to do something when the user double-clicks on a tree node
	 * @param {Tree} tree
	 * @param {Object} node - Node in the model Document
	 * @param {Event} event
	 */
	TreeDelegate.prototype.onTreeNodeDoubleClick = function(tree, node, event) {};

	/**
	 * Override this to do something when the user right-clicks on a tree node
	 * @param {Tree} tree
	 * @param {Object} node - Node in the model Document
	 * @param {Event} event
	 */
	TreeDelegate.prototype.onTreeNodeRightClick = function(tree, node, event) {};

	/**
	 * Override this to do something when the tree control changes its size, 
	 * the event is fired by only TreeOnDemand objects.
	 * @param {Tree} tree
	 */
	TreeDelegate.prototype.onTreeNodeReized = function(tree) {};

	/**
	 * Override this to specify the type of a node. This way, in css, the designer
	 * can specify custom styling per type.
	 * @param {Object} node - Node in the model Document
	 * @returns {string} Class for the node
	 */
	TreeDelegate.prototype.getTreeNodeClass = function(node) {
		return '';
	};

	/**
	 * Override this to specify the maximum tree's container html size. This method is used by
	 * TreeOnDemand to calculate the amount of nodes it will create at any specific time.
	 * @param {Object} node - Node in the model Document
	 * @returns {Number} - HTMLELement for node height in pixels
	 */
	TreeDelegate.prototype.getTreeNodeParentMaxSize = function(node) {
		return {
			width: 0,
			height: 0
		};
	}

	/**
	 * Override this to specify the html element height of a node depending on its type.
	 * This method is used by TreeOnDemand to calculate the layout of the elements it creates at any specific time.
	 * @param {Object} node - Node in the model Document
	 * @returns {Number} - HTMLELement for node height in pixels
	 */
	TreeDelegate.prototype.getTreeNodeClientHeight = function(node) {
		return 0;
	}

	/**
	 * Override this to specify the left offset of a node depending on its type and depth level in the tree.
	 * This method is used by TreeOnDemand to calculate the layout of the elements it creates at any specific time.
	 * @param {Object} node - Node in the model Document
	 * @param {Number} depthLevel - Number of parents of in the hirarchy tree.
	 * @returns {Number} HTMLELement for node left offset position in pixels
	 */
	TreeDelegate.prototype.getTreeNodeDepthOffset = function(node, depthLevel) {
		return 0;
	}

	/**
	 * Override this method to do something when the user hovers on a tree node
	 * @param {Tree} tree
	 * @param {Object} node - Node in the model Document
	 * @param {Event} event
	 */
	TreeDelegate.prototype.onTreeNodeHover = function(tree, node, event) {};

	// Alias Tree/TreeDelegate from Private namespace into UI namespace.
	// This is temporary and should be removed eventually.
	zvp.TreeDelegate = avu.TreeDelegate = TreeDelegate;

})();;
(function() {

	'use strict';

	var avu = ZhiUTech.Viewing.UI,
		zv = ZhiUTech.Viewing,
		zvp = ZhiUTech.Viewing.Private;

	/**
	 * Tree view control
	 * 
	 * @constructor
	 * @param {TreeDelegate} delegate
	 * @param {Object} root - A node in the model Document
	 * @param {HTMLElement|string} parentContainer - Or parentContainerId
	 * @param {Object} options
	 */
	var Tree = function(delegate, root, parentContainer, options) {
		this.myDelegate = delegate;
		this.mySelectedNodes = [];
		this.myOptions = options || {};

		var className = 'treeview';

		this.myGroupNodes = []; // <group> HTML elements in the tree

		this.nodeToElement = {};
		this.nodeIdToNode = {};

		var rootContainer = this.myRootContainer = this.createHtmlElement_(parentContainer, 'div', className);

		var rootElem = this.rootElem = this.createElement_(root, rootContainer, options, 0);

		this.setInputHandlers_();

		if(options && options.excludeRoot) {
			rootElem.classList.add("exclude");
		}

	};

	Tree.prototype.constructor = Tree;

	/**
	 * Show/hide the tree control
	 * @param {boolean} show - true to show the tree control, false to hide it
	 */
	Tree.prototype.show = function(show) {
		var rootContainer = this.myRootContainer;
		if(show) {
			rootContainer.style.display = 'block'; // TODO: want fade in
		} else {
			rootContainer.style.display = 'none';
		}
	};

	/**
	 * Get the root container
	 * @nosideeffects
	 * @returns {string}
	 */
	Tree.prototype.getRootContainer = function() {
		return this.myRootContainer;
	};

	/**
	 * Get DOM element for a given logical tree node (or its integer id)
	 * @nosideeffects
	 * @returns {HTMLElement}
	 */
	Tree.prototype.getElementForNode = function(node) {

		//TODO: Remove this section once all places that hit it are gone
		if(typeof node !== "number" && typeof node !== "string") {
			//zvp.logger.warn("Node object used where node ID should have");
			node = this.myDelegate.getTreeNodeId(node);
		}

		return this.nodeToElement[node];
	};

	/**
	 * Get the tree delegate
	 * @nosideeffects
	 * @returns {TreeDelegate}
	 */
	Tree.prototype.delegate = function() {
		return this.myDelegate;
	};

	/**
	 * Is the given group node in the tree collapsed?
	 * @nosideeffects
	 * @param {Object} group -The group node
	 * @returns {boolean} true if group node is collapsed, false if expanded
	 */
	Tree.prototype.isCollapsed = function(group) {
		return this.hasClass(group, 'collapsed');
	};

	/**
	 * Collapse/expand the given group node in the tree
	 * @param {Object} group - the group node
	 * @param {boolean} collapsed - true to collapse the group node, false to expand it
	 */
	Tree.prototype.setCollapsed = function(group, collapsed, recursive) {
		if(collapsed) {
			this.addClass(group, 'collapsed', recursive);
			this.removeClass(group, 'expanded', recursive);
		} else {
			this.addClass(group, 'expanded', recursive);
			this.removeClass(group, 'collapsed', recursive);
		}
	};

	/**
	 * Collapse/expand all group nodes in the tree
	 * @param {boolean} collapsed - true to collapse tree, false to expand it
	 */
	Tree.prototype.setAllCollapsed = function(collapsed) {
		var wantNode, changeNode;

		if(collapsed) {
			wantNode = function(node) {
				return node.classList.contains('expanded');
			};
			changeNode = function(node) {
				node.classList.add('collapsed');
				node.classList.remove('expanded');
			};

		} else {
			wantNode = function(node) {
				return node.classList.contains('collapsed');
			};
			changeNode = function(node) {
				node.classList.add('expanded');
				node.classList.remove('collapsed');
			};
		}

		for(var i = 0; i < this.myGroupNodes.length; ++i) {
			var node = this.myGroupNodes[i];
			if(wantNode(node)) {
				changeNode(node);
			}
		}
	};

	/**
	 * Add the given nodes to the current selection
	 * @param {Array.<Object>} nodes - nodes to add to the current selection
	 */
	Tree.prototype.addToSelection = function(nodes) {
		var tree = this;

		function addSingle(node) {
			var index = tree.mySelectedNodes.indexOf(node);
			if(index === -1) {
				tree.mySelectedNodes.push(node);
				return true;
			}
			return false;
		}

		var numNodes = nodes.length;
		for(var i = 0; i < numNodes; ++i) {
			var node = nodes[i];
			if(addSingle(node)) {
				this.addClass(node, 'selected');
			}
		}
	};

	/**
	 * Remove the given nodes from the current selection
	 * @param {Array.<Object>} nodes - The nodes to remove from the current selection
	 */
	Tree.prototype.removeFromSelection = function(nodes) {
		var tree = this;

		function removeSingle(node) {
			var index = tree.mySelectedNodes.indexOf(node);
			if(index !== -1) {
				tree.mySelectedNodes.splice(index, 1);
				return true;
			}
			return false;
		}

		for(var i = nodes.length - 1; i >= 0; --i) {
			var node = nodes[i];
			if(removeSingle(node)) {
				this.removeClass(node, 'selected');
			}
		}
	};

	/**
	 * Set the current selection
	 * @param {Array.<Object>} nodes - nodes to make currently selected
	 */
	Tree.prototype.setSelection = function(nodes) {
		this.removeFromSelection(this.mySelectedNodes);
		this.addToSelection(nodes);
		return this.mySelectedNodes;
	};

	/**
	 * Clear the current selection
	 */
	Tree.prototype.clearSelection = function() {
		this.removeFromSelection(this.mySelectedNodes);
	};

	/**
	 * Is the given node selected?
	 * @nosideeffects
	 * @param {Object} node - The tree node
	 * @returns {boolean} - true if node is selected, false otherwise
	 */
	Tree.prototype.isSelected = function(node) {
		return this.hasClass(node, 'selected');
	};

	Tree.prototype.scrollTo = function(node) {
		var elem = this.getElementForNode(node);

		if(elem) {
			var total = elem.offsetTop;
			elem = elem.parentNode;
			while(elem && elem != this.myRootContainer) {
				total += elem.offsetTop;
				elem = elem.parentNode;
			}

			this.myRootContainer.parentNode.scrollTop = total;
		}
	};

	/**
	 * Add a class to a node
	 * @param {Number|Object} node - The tree node
	 * @param {string} className
	 * @returns {boolean} - true if the class was added, false otherwise
	 */
	Tree.prototype.addClass = function(node, className, recursive) {

		var elem = this.getElementForNode(node);
		if(elem) {

			if(recursive) {
				//It is intentional that the recursive add starts at the parent.
				elem = elem.parentNode;
				var top = this.myOptions.excludeRoot ? this.rootElem : this.myRootContainer;
				while(elem && elem !== top) {
					elem.classList.add(className);
					elem = elem.parentNode;
				}
			} else {
				elem.classList.add(className);
			}

			return true;
		}

		return false;
	};

	/**
	 * Remove a class from a node
	 * @param {Number|Object} node - The tree node or its dbId
	 * @param {string} className
	 * @returns {boolean} - true if the class was removed, false otherwise
	 */
	Tree.prototype.removeClass = function(node, className, recursive) {
		var elem = this.getElementForNode(node);
		if(elem) {

			if(recursive) {
				//It is intentional that the recursive add starts at the parent.
				elem = elem.parentNode;
				var top = this.myOptions.excludeRoot ? this.rootElem : this.myRootContainer;
				while(elem && elem !== top) {
					elem.classList.remove(className);
					elem = elem.parentNode;
				}
			} else {
				elem.classList.remove(className);
			}

			return true;
		}

		return false;
	};

	/**
	 * Does the node have the given class?
	 * @nosideeffects
	 * @param {Number|Object} node - The node or its dbId
	 * @param {string} className
	 * @returns {boolean} true if the node has the given class, false otherwise
	 */
	Tree.prototype.hasClass = function(node, className) {
		return this.getElementForNode(node).classList.contains(className);
	};

	/**
	 * Clears the contents of the tree
	 */
	Tree.prototype.clear = function() {

		var rootContainer = this.myRootContainer;
		while(rootContainer.hasChildNodes()) {
			rootContainer.removeChild(rootContainer.lastChild);
		}

		this.nodeToElement = {};
		this.nodeIdToNode = {};
	};

	/**
	 * Given a node, create the corresponding HTML elements for the node and all of its descendants
	 * @private
	 * @param {Object} node - Node in the model Document
	 * @param {HTMLElement} parentElement
	 * @param {Object=} [options] - An optional dictionary of options.  Current parameters:
	 *                              {boolean} [localize] - when true, localization is attempted for the given node; false by default.
	 * @param {Number} [depth]
	 */
	Tree.prototype.createElement_ = function(node, parentElement, options, depth) {
		if(node === undefined || node === null) {
			return null;
		}

		if(!this.myDelegate.shouldCreateTreeNode(node)) {
			return null;
		}

		var tree = this;
		var elem;

		function createElementForNode(parentElement, type, classes, theNode) {
			var root = tree.createHtmlElement_(parentElement, type, classes);
			var nodeId = tree.myDelegate.getTreeNodeId(theNode);
			root.setAttribute("lmv-nodeId", nodeId);

			var header = tree.createHtmlElement_(root, 'lmvheader');
			var icon = tree.createHtmlElement_(header, 'icon');

			icon.addEventListener('mousedown', function(e) {
				e.stopPropagation();
				e.preventDefault();
			}, false);

			icon.addEventListener('click', function(e) {
				tree.myDelegate.onTreeNodeIconClick(tree, node, e);
				e.stopPropagation();
				e.preventDefault();
			}, false);

			tree.myDelegate.createTreeNode(node, header, options);
			return root;
		}

		var nodeId = this.myDelegate.getTreeNodeId(node);

		if(tree.myDelegate.isTreeNodeGroup(node)) {
			elem = createElementForNode(parentElement, 'group', 'expanded', node);
			tree.nodeToElement[nodeId] = elem;
			tree.nodeIdToNode[nodeId] = node;

			var whichDepth = tree.myOptions.excludeRoot ? 1 : 0;

			if(depth == whichDepth)
				elem.style.left = "0px";

			// Remember this group node for use by setAllCollapsed().
			//
			tree.myGroupNodes.push(elem);

			tree.myDelegate.forEachChild(node, function(child) {
				tree.createElement_(child, elem, options, depth + 1);
			});

		} else {
			elem = createElementForNode(parentElement, 'leaf', 'expanded', node);
			tree.nodeToElement[nodeId] = elem;
			tree.nodeIdToNode[nodeId] = node;

			var whichDepth = tree.myOptions.excludeRoot ? 1 : 0;

			if(depth == whichDepth)
				elem.style.marginLeft = "0px";
		}

		var c = tree.myDelegate.getTreeNodeClass(node);
		if(c) {
			elem.classList.add(c);
		}

		return elem;
	};

	Tree.prototype.setInputHandlers_ = function() {

		var tree = this;
		var rootElem = this.myRootContainer;

		var NODE_NOT_FOUND = null;
		var getNodeFromElement = function(eventTarget) {
			var ret = null;
			var found = false;
			do {
				if(!eventTarget || eventTarget === rootElem) {
					ret = null;
					found = true; // not found
				} else if(eventTarget.hasAttribute("lmv-nodeId")) {
					ret = eventTarget;
					found = true;
				} else {
					eventTarget = eventTarget.parentElement;
				}
			} while (!found);

			if(ret) {
				var nodeId = ret.getAttribute("lmv-nodeId");
				return tree.nodeIdToNode[nodeId] || NODE_NOT_FOUND;
			}
			return NODE_NOT_FOUND;
		};

		if(zv.isTouchDevice()) {
			this.hammer = new Hammer.Manager(rootElem, {
				recognizers: [
					zv.GestureRecognizers.doubletap,
					zv.GestureRecognizers.press
				],
				inputClass: zv.isIE11 ? Hammer.PointerEventInput : Hammer.TouchInput
			});
			this.hammer.on("doubletap", function(event) {
				var node = getNodeFromElement(event.target);
				if(node === NODE_NOT_FOUND) return;
				tree.myDelegate.onTreeNodeDoubleClick(tree, node, event);
			});

			this.hammer.on('press', function(event) {
				var node = getNodeFromElement(event.target);
				if(node === NODE_NOT_FOUND) return;
				tree.myDelegate.onTreeNodeRightClick(tree, node, event);
			});
		}

		rootElem.addEventListener('click', function(event) {
			var node = getNodeFromElement(event.target);
			if(node === NODE_NOT_FOUND) return;
			tree.myDelegate.onTreeNodeClick(tree, node, event);
			event.stopPropagation();
			if(!event.target.classList.contains('propertyLink')) {
				event.preventDefault();
			}
		}, false);

		rootElem.addEventListener('dblclick', function(event) {
			var node = getNodeFromElement(event.target);
			if(node === NODE_NOT_FOUND) return;
			tree.myDelegate.onTreeNodeDoubleClick(tree, node, event);
			event.stopPropagation();
			event.preventDefault();
		}, false);

		rootElem.addEventListener('contextmenu', function(event) {
			var node = getNodeFromElement(event.target);
			if(node === NODE_NOT_FOUND) return;
			tree.myDelegate.onTreeNodeRightClick(tree, node, event);
			event.stopPropagation();
			event.preventDefault();
		}, false);

		rootElem.addEventListener('mouseover', function(event) {
			var node = getNodeFromElement(event.target);
			if(node === NODE_NOT_FOUND) return;
			tree.myDelegate.onTreeNodeHover(tree, node, event);
			event.stopPropagation();
			event.preventDefault();
		}, false);

		rootElem.addEventListener('mouseout', function(event) {
			// When the mouse leaves the element, set node to -1 (background), no highlight,
			// If the mouse out event is within the same element. don't do anything.
			var e = event.toElement || event.relatedTarget;
			if(getNodeFromElement(event.target) != getNodeFromElement(e)) {
				var node = -1;
				tree.myDelegate.onTreeNodeHover(tree, node, event);
				event.stopPropagation();
				event.preventDefault();
			}
		}, false);
	};

	/**
	 * Create an HTML element
	 * @private
	 * @param {HTMLElement} parent - Parent element of the new HTML element
	 * @param {string} tagName - New HTML element tag name
	 * @param {string=} [className] - New HTML element class
	 * @returns {HTMLElement} The newly-created HTML element
	 */
	Tree.prototype.createHtmlElement_ = function(parent, tagName, className) {
		var elem = document.createElement(tagName);
		parent.appendChild(elem);

		if(className) {
			elem.className = className;
		}

		return elem;
	};

	/**
	 * Iterates through nodes in the tree in pre-order.
	 * @param {Object|Number} node - node at which to start the iteration.
	 * @param {function(Object, HTMLElement)} callback - callback function for each iterated node.
	 */
	Tree.prototype.iterate = function(node, callback) {
		// roodId === 0 is a valid root node
		if(node === undefined || node === null) {
			return;
		}
		if(this.myDelegate.shouldCreateTreeNode(node)) {
			var elem = this.getElementForNode(node);
			if(elem) {
				callback(node, elem);

				var scope = this;
				this.myDelegate.forEachChild(node, function(child) {
					scope.iterate(child, callback);
				});
			}
		}
	};

	zvp.Tree = avu.Tree = Tree;

})();;
(function() {
	'use strict';

	var zv = ZhiUTech.Viewing;
	var avu = ZhiUTech.Viewing.UI;
	var zvp = ZhiUTech.Viewing.Private;

	var ELEMENT_POOL_LENGHT = 150;
	var SCROLL_SAFE_PADDING = 300; // Pixels

	/**
	 * TreeOnDemand view control
	 * It takes ownership of the contents in parentContainer.
	 * 
	 * @constructor
	 * @param {HTMLElement} scrollContainer - DOM element parent of the tree.
	 */
	function TreeOnDemand(scrollContainer, options) {

		this.dirty = false;
		this.nextFrameId = 0;
		this.scrollY = 0;
		this.delegates = [];
		this.idToDelegate = {};
		this.options = options;

		// Initialize root container.
		this.rootContainer = document.createElement('div');
		this.rootContainer.classList.add('docking-panel-container-gradient');
		this.rootContainer.classList.add('treeview');
		this.rootContainer.classList.add('on-demand');
		scrollContainer.appendChild(this.rootContainer);

		this.paddingDiv = document.createElement('div');
		this.paddingDiv.style['border'] = 0;
		this.paddingDiv.style['margin'] = 0;
		this.paddingDiv.style['padding'] = 0;
		this.sizedDiv = scrollContainer.parentNode; // Just a reference, we are not supposed to change it.

		// Initialize common tables across all delegates.
		// These are tables to share CSS strings between nodes.
		this.nodeCssTable = [
			[],
			['group'],
			['leaf']
		];
		this.cssStringToNodeCssTable = {
			'': 0,
			'group': 1,
			'leaf': 2
		};
		this.nodeIndexToNodeCssTables = {}; // Contains Typed-Arrays per model id.

		// Creates element pools.
		var elementsPool = [];
		var elementsPoolCount = ELEMENT_POOL_LENGHT;

		for(var i = 0; i < elementsPoolCount; ++i) {
			var element = createNodeHTmlElement();
			elementsPool[i] = element;
			//console.log(" >LJason< 日志：",element);
		}

		this.elementsPool = elementsPool;
		this.elementsUsed = 0;

		this.spinner = new avu.LoadingSpinner(scrollContainer);
		this.spinner.addClass('tree-loading-spinner');

		// Add input event listeners.
		var touchDevice = zv.isTouchDevice();

		if(touchDevice) {
			this.hammer = new Hammer.Manager(this.rootContainer, {
				recognizers: [
					zv.GestureRecognizers.doubletap,
					zv.GestureRecognizers.press
				],
				inputClass: zv.isIE11 ? Hammer.PointerEventInput : Hammer.TouchInput
			});
		}


        // console.log(" >LJason< 日志：看看对象池字？？？",elementsPool);

		for(var i = 0; i < elementsPoolCount; ++i) {
			var element = elementsPool[i];

			if(touchDevice) {
				this.hammer.on('doubletap', onElementDoubleTap.bind(this));
				this.hammer.on('press', onElementPress.bind(this));
			}

			element.addEventListener('click', onElementClick.bind(this));
			element.addEventListener('dblclick', onElementDoubleClick.bind(this));
			element.addEventListener('contextmenu', onElementContextMenu.bind(this));

			element.icon.addEventListener('click', onElementIconClick.bind(this));
			element.icon.addEventListener('mousedown', onElementIconMouseDown.bind(this));
			// console.log(" >LJason< 日志：看看元素？",this);
		}


		// console.log(" >LJason< 日志：让我看看树长啥样 ",this);
		redraw(this);
	};

	var proto = TreeOnDemand.prototype;
	proto.constructor = TreeOnDemand;

	/**
	 * A delegate is added whenever a new model is loaded into the scene.
	 * The instanceTree is not available at this point.
	 */
	proto.pushDelegate = function(delegate) {

		this.delegates.push(delegate);
		this.idToDelegate[delegate.model.id] = delegate;
		redraw(this);
	};

	/**
	 * Removes the delegate and tree-ui for a given model id.
	 */
	proto.removeDelegate = function(modelId) {
		for(var i = 0; i < this.delegates.length; ++i) {
			var delegate = this.delegates[i];
			if(delegate.model.id === modelId) {
				this.delegates.splice(i, 1);
				delete this.idToDelegate[modelId];
				delete this.nodeIndexToNodeCssTables[modelId];
				redraw(this);
				return;
			}
		}
	};

	/**
	 * Specifies that the model associated to the delegate doesn't have a tree structure.
	 * Probably because the property database wasn't loaded or is broken somehow.
	 */
	proto.setInstanceTree = function(delegate, instanceTree) {

		delegate.setInstanceTree(instanceTree);
		redraw(this);

		if(!instanceTree)
			return;

		// Initialize per/delegate table mapping.
		// It complements the CSS tables created in the constructor.
		var nodeIndexToNodeCssTable = new Uint8Array(delegate.getTreeNodeCount());

		var createTables = function(nodeId) {
			var nodeIndex = delegate.getTreeNodeIndex(nodeId);
			nodeIndexToNodeCssTable[nodeIndex] = delegate.isTreeNodeGroup(nodeId) ? 1 : 2;
			delegate.forEachChild(nodeId, createTables);
			return true;
		};

		var rootId = delegate.instanceTree.getRootId();
		createTables(rootId);

		var modelId = delegate.model.id;
		this.nodeIndexToNodeCssTables[modelId] = nodeIndexToNodeCssTable;

		var childId = 0;
		var childCount = 0;
		instanceTree.enumNodeChildren(rootId, function(child) {
			if(!childCount) {
				childId = child;
			}
			childCount++;
		});

		// Initialize collapsed states.
		this.setAllCollapsed(delegate, true);

		var excludeRoot = this.options.excludeRoot;
		var startCollapsed = this.options.startCollapsed;

		if(excludeRoot) {
			this.setCollapsed(delegate, rootId, false);
			if(!startCollapsed) {
				this.setCollapsed(delegate, childId, false);
			}
		} else {
			if(!startCollapsed) {
				this.setCollapsed(delegate, rootId, false);
			}
		}

		redraw(this, true);
	};

	/**
	 * Show/hide the tree control
	 * @param {boolean} show - true to show the tree control, false to hide it
	 */
	proto.show = function(show) {

		this.rootContainer.style.display = 'show' ? block : 'none';
	};

	/**
	 * Get the root container
	 * @nosideeffects
	 * @returns {string}
	 */
	proto.getRootContainer = function() {

		return this.rootContainer;
	};

	/**
	 * Get the tree delegate
	 * 
	 * @nosideeffects
	 * @returns {TreeDelegate}
	 */
	proto.getDelegate = function(modelId) {

		return this.idToDelegate[parseInt(modelId)];
	};

	/**
	 * Is the given group node in the tree collapsed?
	 * @nosideeffects
	 * @param {Object} group -The group node
	 * @returns {boolean} true if group node is collapsed, false if expanded
	 */
	proto.isCollapsed = function(delegate, group) {

		var css = getNodeCss(this, delegate, group);
		return css && css.indexOf('collapsed') !== -1;
	};

	/**
	 * Collapse/expand the given group node in the tree
	 * @param {Object} delegate
	 * @param {Object} group - the group node
	 * @param {boolean} collapsed - true to collapse the group node, false to expand it
	 */
	proto.setCollapsed = function(delegate, group, collapsed, recursive) {

		// TODO: If need, we can optimize going trough the tree only once.
		if(collapsed) {
			this.addClass(delegate, group, 'collapsed', recursive);
			this.removeClass(delegate, group, 'expanded', recursive);
		} else {
			this.addClass(delegate, group, 'expanded', recursive);
			this.removeClass(delegate, group, 'collapsed', recursive);
		}
	};

	/**
	 * Collapse/expand all group nodes in the tree
	 * @param {object} delegate
	 * @param {boolean} collapsed - true to collapse tree, false to expand it
	 */
	proto.setAllCollapsed = function(delegate, collapsed) {

		var collapse = collapsed ?
			function(node) {
				this.addClass(delegate, node, 'collapsed', false);
				this.removeClass(delegate, node, 'expanded', false);
			}.bind(this) :
			function(node) {
				this.addClass(delegate, node, 'collapsed', false);
				this.removeClass(delegate, node, 'expanded', false);
			}.bind(this);

		var rootId = delegate.instanceTree.getRootId();
		this.iterate(delegate, rootId, function(node) {
			delegate.isTreeNodeGroup(node) && collapse(node);
			return true;
		});
	};

	/**
	 * Add the given nodes to the current selection
	 * @param {Array.<Object>} nodes - nodes to add to the current selection
	 */
	proto.addToSelection = function(delegate, nodes) {

		var nodesCount = nodes.length;

		for(var i = 0; i < nodesCount; ++i) {
			this.addClass(delegate, nodes[i], 'selected', false);
		}

		redraw(this);
	};

	/**
	 * Remove the given nodes from the current selection
	 * @param {Array.<Object>} nodes - The nodes to remove from the current selection
	 */
	proto.removeFromSelection = function(delegate, nodes) {

		var nodesCount = nodes.length;

		for(var i = 0; i < nodesCount; ++i) {
			this.removeClass(delegate, nodes[i], 'selected', false);
		}

		redraw(this);
	};

	/**
	 * Set the current selection
	 * @param {Array.<Object>} nodes - nodes to make currently selected
	 */
	proto.setSelection = function(delegate, nodes) {

		this.clearSelection(delegate);
		this.addToSelection(delegate, nodes);

		return this.selectedNodes;
	};

	/**
	 * Clear the current selection
	 */
	proto.clearSelection = function(delegate) {

		// In order to optimize memmory, we send one at a time (the whole model could be selected).
		var nodeToRemove = [];
		var unselect = function(nodeId) {

			var css = getNodeCss(this, delegate, nodeId);

			if(css && css.indexOf('selected') !== -1) {
				nodeToRemove[0] = nodeId;
				this.removeFromSelection(delegate, nodeToRemove);
			}

			delegate.forEachChild(nodeId, unselect);
			return true;
		}.bind(this);

		var rootId = delegate.instanceTree.getRootId();
		unselect(rootId);
	};

	/**
	 * Is the given node selected?
	 * @nosideeffects
	 * @param {Object} node - The tree node
	 * @returns {boolean} - true if node is selected, false otherwise
	 */
	proto.isSelected = function(node) {

		var css = getNodeCss(this, delegate, node)
		return css && css.indexOf('selected') !== -1;
	};

	/**
	 * Expands the Tree to have the node UI be visible.
	 * It also returns the pixel height required to scroll in orther to get the element visible. 
	 * 
	 * @param {Object} nodeId - The node id
	 * @param {ZhiUTech.Viewing.Model} model - The model that owns the id.
	 * 
	 * @returns {number} the pixel height required to scroll the container to allow the nodeId to be visible.
	 */
	proto.scrollTo = function(nodeId, model) {

		var delegate = this.getDelegate(model.id);
		var nodeFound = false;
		var expandedHeightStack = []; // Heights of the visible branches and nodes before node.

		var getNodeScrollTop = function(candidateId, iDelegate) {

			nodeFound = nodeFound || nodeId === candidateId;
			if(nodeFound) {
				return;
			}

			expandedHeightStack.push(iDelegate.getTreeNodeClientHeight(candidateId));

			var stackSize = expandedHeightStack.length;
			var elementExpanded = (
				iDelegate.isTreeNodeGroup(candidateId) &&
				getNodeCss(this, iDelegate, candidateId).indexOf('expanded') !== -1);

			iDelegate.forEachChild(candidateId, function(id) {
				getNodeScrollTop(id, iDelegate);
			});

			if(!elementExpanded && !nodeFound) {
				if(expandedHeightStack.length > stackSize) {
					expandedHeightStack.splice(stackSize);
				}
			}
		}.bind(this);
		this.setCollapsed(delegate, nodeId, false, true);

		// Calculate and set the container's parent scroll top.
		var rootId = delegate.getRootId();
		getNodeScrollTop(rootId, delegate);
		if(!nodeFound) {
			return -1;
		}

		var scrollTop = 0;
		var expandedHeightStackCount = expandedHeightStack.length;
		for(var i = this.isExcludeRoot() ? 1 : 0; i < expandedHeightStackCount; ++i) {
			scrollTop += expandedHeightStack[i];
		}

		// If single model, early return...
		if(this.delegates.length === 1) {
			redraw(this, true);
			return scrollTop;
		}

		// Multi model treatment, take into account other models on top
		for(var i = 0; i < this.delegates.length; ++i) {

			var otherDelegate = this.delegates[i];
			if(otherDelegate === delegate) {
				break;
			}

			expandedHeightStack = [];
			nodeId = -1;
			nodeFound = false;
			rootId = otherDelegate.getRootId();
			getNodeScrollTop(rootId, otherDelegate);

			expandedHeightStackCount = expandedHeightStack.length;
			var othersHeight = 0;
			for(var j = 0; j < expandedHeightStackCount; ++j) {
				othersHeight += expandedHeightStack[j];
			}
			scrollTop += othersHeight;
		}

		// Avoid scrolling
		redraw(this, true);
		return scrollTop;
	};

	/**
	 * Add a class to a node
	 * @param {object} delegate
	 * @param {Number|Object} node - The tree node
	 * @param {string} className
	 * @returns {boolean} - true if the class was added, false otherwise
	 */
	proto.addClass = function(delegate, node, className, recursive) {

		function add(tree, nodeId, className) {

			var css = getNodeCss(tree, delegate, nodeId);
			if(!css) {
				return;
			}

			var cssIndex = css.indexOf(className);
			if(cssIndex !== -1) {
				return;
			}

			css = css.slice(0);
			css.push(className);
			css.sort();

			setNodeCss(tree, delegate, nodeId, css);
		}

		// It is intentional that the recursive add starts at the parent.
		if(recursive) {
			var parentId = delegate.getTreeNodeParentId(getNodeId(this, node));
			while(parentId) {
				add(this, parentId, className);
				parentId = delegate.getTreeNodeParentId(parentId);
			}
		} else {
			add(this, node, className);
		}

		redraw(this);
		return true;
	};

	/**
	 * Remove a class from a node
	 * @param {object} delegate
	 * @param {Number|Object} node - The tree node or its dbId
	 * @param {string} className
	 * @returns {boolean} - true if the class was removed, false otherwise
	 */
	proto.removeClass = function(delegate, node, className, recursive) {

		function remove(tree, nodeId, className) {

			var css = getNodeCss(tree, delegate, nodeId);

			if(!css) {
				return;
			}

			var cssIndex = css.indexOf(className);

			if(cssIndex === -1) {
				return;
			}

			css = css.slice(0);
			css.splice(cssIndex, 1);

			setNodeCss(tree, delegate, nodeId, css);
		};

		//It is intentional that the recursive add starts at the parent.
		if(recursive) {
			var parentId = delegate.getTreeNodeParentId(getNodeId(this, node));
			while(parentId) {
				remove(this, parentId, className);
				parentId = delegate.getTreeNodeParentId(parentId);
			}
		} else {
			remove(this, node, className);
		}

		redraw(this);
		return true;
	};

	/**
	 * Does the node have the given class?
	 * @nosideeffects
	 * @param {Number|Object} node - The node or its dbId
	 * @param {string} className
	 * @returns {boolean} true if the node has the given class, false otherwise
	 */
	proto.hasClass = function(node, className) {

		return getNodeCss(this, delegate, node).indexOf(className) !== 1;
	};

	/**
	 * Clears the contents of the tree
	 */
	proto.clear = function() {

		var container = this.rootContainer;
		var child;
		while(child = container.lastChild) {
			container.removeChild(child);
		}

		// clear children of delegate divs
		for(var i = 0; i < this.delegates.length; ++i) {
			this.delegates[i].clean();
		}

		this.elementsUsed = 0;
	};

	/**
	 * Iterates through nodes in the tree in pre-order.
	 * @param {Object} delegate
	 * @param {Object|Number} node - node at which to start the iteration.
	 * @param {function(Object)} callback - callback function for each iterated node, if callbak returns false, node's chidren are not visited.
	 */
	proto.iterate = function(delegate, node, callback) {

		// roodId === 0 is a valid root node
		if(node === undefined || node === null) {
			return;
		}

		if(!delegate.shouldCreateTreeNode(node)) {
			return;
		}

		if(!callback(node)) {
			return;
		}

		delegate.forEachChild(node, function(child) {
			this.iterate(delegate, child, callback);
		}.bind(this));
	};

	proto.forEachDelegate = function(callback) {

		for(var i = 0; i < this.delegates.length; ++i) {
			callback(this.delegates[i]);
		}
	};

	proto.destroy = function() {
		this.clear();
		cancelAnimationFrame(this.nextFrameId);

		var scrollContainer = this.rootContainer.parentNode;
		scrollContainer.removeChild(this.rootContainer);

		this.rootContainer = null;
		this.rootId = -1;
		this.nodeCssTable = null;
		this.nodeIndexToNodeCssTables = null;
		this.cssStringToNodeCssTable = null;
		this.elementsPool = null;
		this.elementsUsed = -1;
		this.scrollY = -1;

		if(this.hammer) {
			this.hammer.destroy();
			this.hammer = null;
		}
	};

	proto.setScroll = function(scrollY) {

		// Avoid re-building the tree unless we have scrolled far enough.
		if(Math.abs(this.scrollY - scrollY) > SCROLL_SAFE_PADDING) {
			this.scrollY = scrollY;
			redraw(this);
		}
	};

	proto.displayNoProperties = function(display) {

		if(display) {
			if(!this.divNoProps) {
				this.divNoProps = document.createElement('div');
				var msgKey = 'Model Browser is not available.';
				this.divNoProps.innerText = ZhiUTech.Viewing.i18n.translate(msgKey);
				this.divNoProps.setAttribute('data-i18n', msgKey);
				this.divNoProps.classList.add('lmv-no-properties');
			}
			if(!this.divNoProps.parentNode) {
				var scrollContainer = this.rootContainer.parentNode;
				scrollContainer.appendChild(this.divNoProps);
			}
		} else {
			if(this.divNoProps && this.divNoProps.parentNode) {
				this.divNoProps.parentNode.removeChild(this.divNoProps);
			}
		}
	};

	proto.isExcludeRoot = function() {
		return this.delegates.length === 1 ? this.options.excludeRoot : false;
	};

	proto.getDelegateCount = function() {
		return this.delegates.length;
	};

	function getTreeNodeParentMaxSize(tree) {
		return {
			width: tree.sizedDiv.clientWidth | 0x0,
			height: tree.sizedDiv.clientHeight | 0x0
		}
	}

	/**
	 * @private
	 * Renders the current state of the tree and its delegates (if any)
	 * Handles rendering when there are no delegates and when there is only 1 in loading state.
	 * Delegates most of the hard rendering to createVisibleElements()
	 * 
	 * @param {*} tree 
	 */
	function renderNow(tree) {

		// Clear
		tree.dirty = false;
		clearElementTree(tree);

		// Special case 1: There are no models loaded into LMV
		if(tree.delegates.length === 0) {
			// An empty panel is all we want.
			tree.spinner.setVisible(false);
			return;
		}

		// Special case 2: Single model, properties are still loading
		if(tree.delegates.length === 1 && tree.delegates[0].isLoading()) {
			tree.spinner.setVisible(true)
			return;
		}

		// Special case 3: Single model, properties failed to load
		if(tree.delegates.length === 1 && tree.delegates[0].isNotAvailable()) {
			tree.spinner.setVisible(false);
			tree.displayNoProperties(true);
			return;
		}

		// Will render the tree delegate items at this point...
		tree.spinner.setVisible(false);
		tree.displayNoProperties(false);

		// Render InstanceTree nodes
		createVisibleElements(tree);
	}

	/**
	 * @private
	 * Generates the visible DIVs for the model browser.
	 * 
	 * @param {*} tree 
	 */
	function createVisibleElements(tree) {

		var container = tree.rootContainer;
		var parentDimensions = getTreeNodeParentMaxSize(tree);
		var CONTAINER_HEIGHT = parentDimensions.height;
		var currentHeight = 0;
		var paddingHeight = 0;
		var adding = true;

		// Add a top-padding element that stretches until the first element shows
		container.appendChild(tree.paddingDiv);

		var delegates = tree.delegates.slice(0);
		var excludeRoot = tree.isExcludeRoot();

		while(delegates.length) {

			var delegate = delegates.shift();

			// Each tree element gets added into its parent model-div
			var modelDiv = delegate.modelDiv;
			container.appendChild(modelDiv);

			var ids = [delegate.getRootId()];
			var depth = {
				curr: excludeRoot ? -1 : 0,
				popIds: []
			};

			while(ids.length && adding) {

				// Any more room vertically?
				if(currentHeight > tree.scrollY + CONTAINER_HEIGHT + SCROLL_SAFE_PADDING) {
					adding = false;
					break;
				}

				// Any more DIVs in the pool?
				if(tree.elementsUsed === tree.elementsPool.length) {
					adding = false;
					break;
				}

				var id = ids.shift();
				var elemHeight = depth.curr === -1 ? 0 : delegate.getTreeNodeClientHeight(id);
				var elemTop = currentHeight;
				var elemBtm = elemTop + elemHeight;

				// render this node
				if((elemHeight > 0) && (elemBtm + SCROLL_SAFE_PADDING) >= tree.scrollY) {

					// Actually add the element...
					var element = tree.elementsPool[tree.elementsUsed++];
					element.setAttribute("lmv-nodeId", id);

					delegate.createTreeNode(id, element.header);
					var css = delegate.getTreeNodeClass(id);
					if(css) {
						element.classList.add(css);
					}

					var elementClasses = getNodeCss(tree, delegate, id);
					if(elementClasses) {
						var elementClassesCount = elementClasses.length;
						for(var i = 0; i < elementClassesCount; ++i) {
							element.classList.add(elementClasses[i]);
						}
					}

					var offset = delegate.getTreeNodeDepthOffset(id, depth.curr);
					element.header.style.paddingLeft = offset + 'px';

					modelDiv.appendChild(element);
				}

				if(elemBtm + SCROLL_SAFE_PADDING < tree.scrollY) {
					paddingHeight = elemBtm;
				}

				// move height counter
				currentHeight = elemBtm;

				// Children will get a new level of indentation
				var childIds = enqueueChildrenIds(tree, delegate, id);

				// Inden when id has children and they are visible to the end user
				if(childIds && childIds.length > 0) {
					depth.curr++;

					var lastChildId = childIds[childIds.length - 1];

					// Edge case if this node was supposed to pop a level, 
					// then transfer the count to the next generation
					var top = depth.popIds.length - 1;
					while(top >= 0 && depth.popIds[top] === id) {
						depth.popIds[top--] = lastChildId;
					}

					// Remember when to pop depth back
					depth.popIds.push(lastChildId);

					// Add children to iteration
					ids = childIds.concat(ids);
				}

				while(depth.popIds.length > 0 && id === depth.popIds[depth.popIds.length - 1]) {
					depth.popIds.pop();
					depth.curr--;
				}

			} // while-ids

			// Update top-padding height.
			tree.paddingDiv.style.height = paddingHeight + 'px';

			// If there are ids left, we need to process them to get the total height
			while(ids.length) {

				var id = ids.shift();
				var elemHeight = depth.curr === -1 ? 0 : delegate.getTreeNodeClientHeight(id);
				var elemTop = currentHeight;
				var elemBtm = elemTop + elemHeight;

				// move height counter
				currentHeight = elemBtm;

				// enqueue children (if any)
				var childIds = enqueueChildrenIds(tree, delegate, id);
				if(childIds && childIds.length) {
					ids = childIds.concat(ids);
				}
				//console.log(" >LJason< 日志：-----------测试情况-----------------",id,ids);
			}

		} // while-delegates

		container.style.height = currentHeight + 'px';
	}

	function enqueueChildrenIds(tree, delegate, id) {

		var isGroup = delegate.isTreeNodeGroup(id);
		if(!isGroup)
			return null;

		var collapsed = tree.isCollapsed(delegate, id);
		if(collapsed)
			return null;

		var childIds = [];
		delegate.forEachChild(id, function(cId) {
			childIds.push(cId);
		});

		return childIds;
	}

	function clearElementTree(tree) {
		var elementsUsed = tree.elementsUsed;
		var elementsPool = tree.elementsPool;

		// Return used elements to the elements pool.
		for(var i = 0; i < elementsUsed; ++i) {

			// Remove node id, just in case.
			var element = elementsPool[i];
			element.setAttribute('lmv-nodeId', '');

			// Remove css classes.
			element.className = '';

			// Remove all controls and listeners added by tree delegate, we spare the icon.
			var header = element.header;
			var childrenToRemove = header.childNodes.length - 1;

			for(var j = 0; j < childrenToRemove; ++j) {
				header.removeChild(header.lastChild);
			}
		}
		tree.clear();
	}

	/**
	 *
	 * @param {*} tree
	 * @param {*} initial
	 */
	function redraw(tree, immediate) {

		// If the panel is not dirty, marked as dirty and schedule an update during next frame.
		if(tree.dirty && !immediate) {
			return;
		}

		if(immediate) {
			renderNow(tree);
		} else {
			tree.dirty = true;

			// All update requests are executed as one during next frame.
			tree.nextFrameId = requestAnimationFrame(function() {
				renderNow(tree);
			});
		}
	}

	/**
	 * Get the id of the node if it's an object or returns input parameter if it's string or number.
	 * @private
	 * @param {*} node - A node object or a string or number with the id of the node.
	 * @returns {number} The id of the node
	 */
	function getNodeId(tree, node) {

		if(typeof node !== "number" && typeof node !== "string") {
			return tree.threeDelegate.getTreeNodeId(node | 0x0);
		}
		return node;
	}

	/**
	 * Returns the node associated to the html element provided
	 * @private
	 * @param {*} tree - A TreeOnDemand object instance.
	 * @param {*} element - A node object or a string or number with the id of the node.
	 * @returns {Number} Node object associated with with the html control.
	 */
	function getNodeIdFromElement(tree, element) {

		var nodeElement = null;

		while(element && element !== tree.rootContainer) {
			if(element.hasAttribute("lmv-nodeId")) {
				nodeElement = element;
				break;
			}
			element = element.parentElement;
		}

		if(!nodeElement) {
			return null;
		}

		var nodeId = nodeElement.getAttribute("lmv-nodeId");
		return parseFloat(nodeId);
	};

	function getModelIdFromElement(tree, element) {

		var nodeElement = null;

		while(element && element !== tree.rootContainer) {
			if(element.hasAttribute("lmv-modelId")) {
				nodeElement = element;
				break;
			}
			element = element.parentElement;
		}

		if(!nodeElement) {
			return null;
		}

		var modelId = nodeElement.getAttribute("lmv-modelId");
		return parseInt(modelId);
	};

	/**
	 * Get the css array from the css table.
	 * @private
	 * @param {*} tree - A TreeOnDemand object instance.
	 * @param {*} delegate
	 * @param {Number} nodeId - A node id to whome state will be retrived.
	 * @returns {Array} Array of strings with the css classes
	 */
	function getNodeCss(tree, delegate, node) {
		if(delegate.isControlId(node))
			return delegate.getControlIdCss(node);
		var nodeIndex = delegate.getTreeNodeIndex(node);
		return tree.nodeCssTable[tree.nodeIndexToNodeCssTables[delegate.model.id][nodeIndex]];
	}

	/**
	 * Adds a new css entry table is needed and associate the css table index to node.
	 * @private
	 * @param {*} tree - A TreeOnDemand object instance.
	 * @param {*} delegate
	 * @param {Number} nodeId - A node id to whome state will be retrived.
	 * @param {string} css
	 */
	function setNodeCss(tree, delegate, node, css) {

		var key = css.join(' ');
		var index = tree.cssStringToNodeCssTable[key] || tree.nodeCssTable.length;

		if(index === tree.nodeCssTable.length) {
			tree.nodeCssTable.push(css);
			tree.cssStringToNodeCssTable[key] = index;
		}

		var nodeIndex = delegate.getTreeNodeIndex(node);
		tree.nodeIndexToNodeCssTables[delegate.model.id][nodeIndex] = index;
	}

	/**
	 * Given a node, create the corresponding HTML elements for the node and all of its descendants
	 * @private
	 * @param {Object} tree - TreeOnDemand node
	 * @param {Object=} [options] - An optional dictionary of options.  Current parameters:
	 *                              {boolean} [localize] - when true, localization is attempted for the given node; false by default.
	 * @param {Number} [depth]
	 */
	function createNodeHTmlElement(tree, options) {

		var header = document.createElement('lmvheader');

		var icon = document.createElement('icon');
		header.appendChild(icon);

        var element = document.createElement('div');
        element.header = header;
        element.icon = icon;
        element.appendChild(header);
        // console.log(" >LJason< 日志：看看元素？",element);
        return element;
	};

	/**
	 *
	 * @param {*} event
	 */
	function onElementDoubleTap(event) {

		var nodeId = getNodeIdFromElement(this, event.target);
		if(!nodeId) {
			return;
		}

		var modelId = getModelIdFromElement(this, event.target);
		var delegate = this.getDelegate(modelId);
		if(!delegate) {
			return;
		}

		delegate.onTreeNodeDoubleClick(this, nodeId, event);
	}

	/**
	 *
	 * @param {*} event
	 */
	function onElementPress(event) {

		var nodeId = getNodeIdFromElement(this, event.target);
		if(!nodeId) {
			return;
		}

		var modelId = getModelIdFromElement(this, event.target);
		var delegate = this.getDelegate(modelId);
		if(!delegate) {
			return;
		}

		delegate.onTreeNodeRightClick(this, nodeId, event);
	}

	/**
	 *
	 * @param {*} event
	 */
	function onElementClick(event) {

		// Click has to be done over the children of the tree elements.
		// Group and leaf nodes are only containers to layout consumer content.
		if(event.target.classList.contains('group') ||
			event.target.classList.contains('leaf')) {
			return;
		}

		var nodeId = getNodeIdFromElement(this, event.target);
		if(!nodeId) {
			return;
		}

		var modelId = getModelIdFromElement(this, event.target);
		var delegate = this.getDelegate(modelId);
		if(!delegate) {
			return;
		}

		delegate.onTreeNodeClick(this, nodeId, event);
		event.stopPropagation();
		event.preventDefault();
	}

	/**
	 *
	 * @param {*} event
	 */
	function onElementDoubleClick(event) {

		// Click has to be done over the children of the tree elements.
		// Group and leaf nodes are only containers to layout consumer content.
		if(event.target.classList.contains('group') ||
			event.target.classList.contains('leaf')) {
			return;
		}

		var nodeId = getNodeIdFromElement(this, event.target);
		if(!nodeId) {
			return;
		}

		var modelId = getModelIdFromElement(this, event.target);
		var delegate = this.getDelegate(modelId);
		if(!delegate) {
			return;
		}

		delegate.onTreeNodeDoubleClick(this, nodeId, event);
		event.stopPropagation();
		event.preventDefault();
	}

	/**
	 *
	 * @param {*} event
	 */
	function onElementContextMenu(event) {

		// Click has to be done over the children of the tree elements.
		// Group and leaf nodes are only containers to layout consumer content.
		if(event.target.classList.contains('group') ||
			event.target.classList.contains('leaf')) {
			return;
		}

		var nodeId = getNodeIdFromElement(this, event.target);
		if(!nodeId) {
			return;
		}

		var modelId = getModelIdFromElement(this, event.target);
		var delegate = this.getDelegate(modelId);
		if(!delegate) {
			return;
		}

		delegate.onTreeNodeRightClick(this, nodeId, event);
		event.stopPropagation();
		event.preventDefault();
	}

	/**
	 *
	 * @param {*} event
	 */
	function onElementIconClick(event) {

		var nodeId = getNodeIdFromElement(this, event.target);
		if(!nodeId) {
			return;
		}

		var modelId = getModelIdFromElement(this, event.target);
		var delegate = this.getDelegate(modelId);
		if(!delegate) {
			return;
		}

		delegate.onTreeNodeIconClick(this, nodeId, event);
		event.stopPropagation();
		event.preventDefault();
	}

	/**
	 *
	 * @param {*} event
	 */
	function onElementIconMouseDown(event) {

		event.stopPropagation();
		event.preventDefault();
	}

	// Alias Tree/TreeDelegate from Private namespace into UI namespace.
	// This is temporary and should be removed eventually.
	//
	zvp.TreeOnDemand = avu.TreeOnDemand = TreeOnDemand;

})();;
(function() {

	"use strict";

	var avu = ZhiUTech.Viewing.UI;

	/**
	 * UI panel that is movable and resizable within the bounds of its parent container.
	 * @constructor
	 * @alias ZhiUTech.Viewing.UI.DockingPanel
	 * @param {HTMLElement} parentContainer - The container for this panel.
	 * @param {string} id - The id to assign this panel.
	 * @param {string} title - The title of this panel.
	 * @param {object=} [options] - An optional dictionary of options.
	 * @param {boolean} [options.localizeTitle=true] - When true, localization is attempted for the given title.
	 * @param {boolean} [options.addFooter=true] - When true, adds a footer to the panel with resizing handler.
	 * @category UI
	 * @example
	  // Example of a simple DockingPanel that displays the given content.
	  // The titlebar and move behavior are overridden in initialize(), which also
	  // creates a custom close button.
	  //
	  SimplePanel = function(parentContainer, id, title, content, x, y)
	  {
	      this.content = content;
	      ZhiUTech.Viewing.UI.DockingPanel.call(this, parentContainer, id, '');

	      // Auto-fit to the content and don't allow resize.  Position at the coordinates given.
	      //
	      this.container.style.height = "auto";
	      this.container.style.width = "auto";
	      this.container.style.resize = "none";
	      this.container.style.left = x + "px";
	      this.container.style.top = y + "px";
	  };

	  SimplePanel.prototype = Object.create(ZhiUTech.Viewing.UI.DockingPanel.prototype);
	  SimplePanel.prototype.constructor = SimplePanel;

	  SimplePanel.prototype.initialize = function()
	  {
	      // Override DockingPanel initialize() to:
	      // - create a standard title bar
	      // - click anywhere on the panel to move
	      // - create a close element at the bottom right
	      //
	      this.title = this.createTitleBar(this.titleLabel || this.container.id);
	      this.container.appendChild(this.title);

	      this.container.appendChild(this.content);
	      this.initializeMoveHandlers(this.container);

	      this.closer = document.createElement("div");
	      this.closer.className = "simplePanelClose";
	      this.closer.textContent = "Close";
	      this.initializeCloseHandler(this.closer);
	      this.container.appendChild(this.closer);
	  };
	 */
	var DockingPanel = function(parentContainer, id, title, options) {

		// Constants
		this.kMinWdth = 100;
		this.kMinHeight = 100;

		this.visibilityCallbacks = [];
		this.movedSinceLastClick = false;

		this.parentContainer = parentContainer;

		this.container = document.createElement("div");
		this.container.id = id;
		this.container.lastWidth = "";
		this.container.dockRight = false;
		this.container.dockBottom = false;
		this.titleLabel = title;

		// By default, localize the title.
		//
		options = options || {};

		if(!options.hasOwnProperty('localizeTitle')) {
			options.localizeTitle = true;
		}

		if(!options.hasOwnProperty('addFooter')) {
			options.addFooter = true;
		}

		this.options = options;

		this.container.classList.add('docking-panel');

		parentContainer.appendChild(this.container);
		this.listeners = [];

		this.initialize();

		// The panel is not visible initially.  The child class may still be constructing
		// the elements, so let it decide when to show.
		//
		this.setVisible(false);
	};

	/**
	 * Creates the sub-elements of this DockingPanel.  Override this in derived classes.
	 * The default implementation is to create a title bar with the title or id provided
	 * in the constructor.  The title bar also acts as the move handler for the DockingPanel.
	 * Finally, a close button is added to the top right corner.
	 */
	DockingPanel.prototype.initialize = function() {
		this.title = this.createTitleBar(this.titleLabel || this.container.id);
		this.container.appendChild(this.title);
		this.initializeMoveHandlers(this.title);
		this.setTitle(this.titleLabel || this.container.id, this.options);

		this.closer = this.createCloseButton();
		this.container.appendChild(this.closer);

		if(this.options.addFooter) {
			this.footer = this.createFooter();
			this.container.appendChild(this.footer);
		}
	};

	/**
	 * Performs any clean up necessary.  This can include disconnecting UI elements, unregistering event callbacks, etc.
	 */
	DockingPanel.prototype.uninitialize = function() {
		// Remove all of the listeners we're aware of.
		//
		for(var i = 0; i < this.listeners.length; ++i) {
			var listener = this.listeners[i];
			listener.target.removeEventListener(listener.eventId, listener.callback);
		}
		this.listeners = [];
		this.visibilityCallbacks = [];

		// Disconnect our DOM tree from our parent.
		//
		this.parentContainer.removeChild(this.container);
		this.parentContainer = null;
		this.container = null;
		this.title = null;
		this.closer = null;
	};

	/**
	 * Adds a callback to call when this DockingPanel changes visibility.
	 * @param {function} callback - A function that takes in a single boolean parameter
	 * indicating the current visibility state.
	 */
	DockingPanel.prototype.addVisibilityListener = function(callback) {
		this.visibilityCallbacks.push(callback);
	};

	/**
	 * Sets the new visibility state of this DockingPanel.
	 * @param {boolean} show - The desired visibility state.
	 */
	DockingPanel.prototype.setVisible = function(show) {

		if(show) {
			var parentBox = this.getContainerBoundingRect();

			if(this.container.dockRight) {
				var screenw = parentBox.width;
				var wi2 = 300;

				var wi = this.container.lastWidth || this.container.style.width;
				if(!wi)
					wi = this.container.getBoundingClientRect().width;
				if(wi)
					wi2 = parseInt(wi);

				this.container.style.left = (screenw - wi2) + "px";
			}
			if(this.container.dockBottom) {
				var screenh = parentBox.height;
				var hi2 = 300;

				var hi = this.container.lastHeight || this.container.style.height;
				if(!hi)
					hi = this.container.getBoundingClientRect().height;
				if(hi)
					hi2 = parseInt(hi);

				var hi3 = screenh - hi2;
				this.container.style.top = hi3 > 0 ? hi3 + "px" : 0;
			}

			this.container.style.maxHeight = parentBox.height + "px";
			this.container.style.maxWidth = parentBox.width + "px";
			this.container.style.display = "block";

		} else {
			this.container.lastWidth = this.container.style.width;
			this.container.lastHeight = this.container.style.height;
			this.container.style.display = "none";
		}

		for(var i = 0; i < this.visibilityCallbacks.length; i++) {
			this.visibilityCallbacks[i](show);
		}
	};

	/**
	 * Gets the new visibility state of this DockingPanel.
	 * @returns {boolean} Whether or not the panel is visible.
	 */
	DockingPanel.prototype.isVisible = function() {
		return(this.container.style.display === "block");
	};

	/**
	 * Notification that visibility has been changed by external sources.
	 */
	DockingPanel.prototype.visibilityChanged = function() {};

	/**
	 * Initializes the given HTMLDomElement as the move handle for this DockingPanel.
	 * When this element is clicked and dragged, this DockingPanel is moved.
	 *
	 * @param {HTMLElement} mover - The DOM element that will act as the move handle.
	 */
	DockingPanel.prototype.initializeMoveHandlers = function(mover) {
		var x, y;
		var lastX, lastY;
		var startX, startY;
		var deltaX, deltaY;
		var container = this.container;
		var self = this;

		// This gets scoped under window during the handleMove event handler
		function handleMove(e) {
			var minWidth = container.style.minWidth ? parseInt(container.style.minWidth) : self.kMinWdth,
				minHeight = container.style.minHeight ? parseInt(container.style.minHeight) : self.kMinHeight,
				parentRect = self.getContainerBoundingRect();

			if(container.style.maxWidth && parseInt(container.style.width) > parseInt(container.style.maxWidth)) {
				container.style.width = container.style.maxWidth;
			}
			if(container.style.maxHeight && parseInt(container.style.height) > parseInt(container.style.maxHeight)) {
				container.style.height = container.style.maxHeight;
			}

			if(parseInt(container.style.width) < minWidth) {
				container.style.width = minWidth + "px";
			}
			if(parseInt(container.style.height) < minHeight) {
				container.style.height = minHeight + "px";
			}
			if(e.type === "touchmove") {
				e.screenX = e.touches[0].screenX;
				e.screenY = e.touches[0].screenY;
			}

			deltaX += e.screenX - lastX;
			deltaY += e.screenY - lastY;

			x = startX + deltaX;
			y = startY + deltaY;

			var wi = parseInt(container.style.width);
			var hi = parseInt(container.style.height);

			if(isNaN(wi)) {
				wi = self.container.getBoundingClientRect().width;
			}
			if(isNaN(hi)) {
				hi = self.container.getBoundingClientRect().height;
			}

			// check left, top
			if(x < 5)
				x = 0;

			if(y < 5)
				y = 0;

			container.dockRight = false;
			container.dockBottom = false;

			// check bottom, right
			if(parentRect.width - 5 < x + wi) {
				x = parentRect.width - wi;
				container.dockRight = true;
			}

			if(parentRect.height - 5 < y + hi) {
				y = parentRect.height - hi;
				container.dockBottom = true;
			}
			/*
			        if (self.scrollContainer) {
			            if (x == 0) {
			                self.scrollContainer.classList.remove("right");
			                self.scrollContainer.classList.add("left");
			            }
			            else {
			                self.scrollContainer.classList.remove("left");
			                self.scrollContainer.classList.add("right");
			            }
			        }
			*/
			container.style.left = x + "px";
			container.style.top = y + "px";
			container.style.maxWidth = (parentRect.width - x) + "px";
			container.style.maxHeight = (parentRect.height - y) + "px";

			//TODO: check for right side
			//TODO: handle docking and bounds check against the canvas element

			lastX = e.screenX;
			lastY = e.screenY;

			self.onMove(e, x, y);
		}

		function handleUp(e) {
			window.removeEventListener('mousemove', handleMove);
			window.removeEventListener('mouseup', handleUp);
			window.removeEventListener('touchmove', handleMove);
			window.removeEventListener('touchend', handleUp);
			self.onEndMove(e, x, y);
		}

		function handleDown(e) {
			if(e.type === "touchstart") {
				e.screenX = e.touches[0].screenX;
				e.screenY = e.touches[0].screenY;
			}
			lastX = e.screenX;
			lastY = e.screenY;

			deltaX = 0;
			deltaY = 0;

			// Save the current panel position relative to its parent container.
			//
			startX = self.container.offsetLeft;
			startY = self.container.offsetTop;

			window.addEventListener('mousemove', handleMove, false);
			window.addEventListener('mouseup', handleUp, false);
			window.addEventListener('touchmove', handleMove, false);
			window.addEventListener('touchend', handleUp, false);

			e.preventDefault();

			self.onStartMove(e, startX, startY);
		}

		// We'll keep track of the mousedown event listener as this one is always active.
		// The mousemove and mouseup listeners above are temporary so we don't need to track them.
		//
		self.addEventListener(mover, 'mousedown', handleDown);
		self.addEventListener(mover, 'touchstart', handleDown);
	};

	/**
	 * Initializes the given HTMLDomElement as the close handle for this DockingPanel.
	 * When this element is clicked, this DockingPanel is hidden.
	 *
	 * @param {HTMLElement} closer - The DOM element that will act as the close handle.
	 */
	DockingPanel.prototype.initializeCloseHandler = function(closer) {
		var self = this;
		self.addEventListener(closer, 'click', function(e) {
			self.setVisible(false);
		}, false);
	};

	/**
	 * Creates a scroll container element to add to this DockingPanel.  Call this method during
	 * initialize() if a scroll container is needed. The function will create the scroll container
	 * and make it available via the "scrollContainer" property of the DockingPanel.
	 *
	 * @param {object} [options] - An optional dictionary of options.
	 * @param {boolean} [options.left=false] - When true, the scrollbar appears on the left.
	 * @param {number} [options.heightAdjustment=0] - The scroll container height is 100% of the panel
	 * minus the height adjustment. Provide a value to account for other elements in the panel like a title bar.
	 * @param {number} [options.marginTop=0] - The marginTop setting for the scroll container's CSS style, in pixels.
	 * @param {number} [options.scrollEaseCurve] - The easing function expressed as a 4-values array.
	 * @param {number} [options.scrollEaseSpeed] - The marginTop setting for the scroll container's CSS style, in pixels.
	 */
	DockingPanel.prototype.createScrollContainer = function(options) {
		var scrollContainer = document.createElement("div"),
			classList = scrollContainer.classList;
		classList.add('docking-panel-scroll');
		classList.add('docking-panel-container-solid-color-a');
		classList.add((options && options.left) ? 'left' : 'right');

		if(options && options.heightAdjustment) {
			scrollContainer.style.height = "calc(100% - " + options.heightAdjustment + "px)";
		}

		if(options && options.marginTop) {
			scrollContainer.style.marginTop = options.marginTop + "px";
		}

		scrollContainer.id = this.container.id + '-scroll-container';

		this.container.appendChild(scrollContainer);
		this.scrollContainer = scrollContainer;
		this.scrollEaseCurve = options && options.scrollEaseCurve || [0, 0, .29, 1];
		this.scrollEaseSpeed = options && options.scrollEaseSpeed || 0.003;

		return scrollContainer; //for backwards compatibility we still return that, though it's no longer documented that way.
	};

	/**
	 * Creates a title bar element to add to this DockingPanel. Call this method during
	 * initialize() if a standard title bar is desired, and then add it to an existing container.
	 * @param {string} title - The text to use in the title bar.
	 * @returns {HTMLElement} The created title bar.
	 */
	DockingPanel.prototype.createTitleBar = function(title) {
		var titleBar = document.createElement("div");
		titleBar.classList.add("docking-panel-title");
		titleBar.textContent = title;

		var that = this;
		that.addEventListener(titleBar, 'click', function(event) {
			if(!that.movedSinceLastClick) {
				that.onTitleClick(event);
			}
			that.movedSinceLastClick = false;
		});

		that.addEventListener(titleBar, 'dblclick', function(event) {
			that.onTitleDoubleClick(event);
		});

		return titleBar;
	};

	/**
	 * Creates a footer element to add to this DockingPanel. Footer provides a resize handler. 
	 * Call this method during initialize() if a standard title bar is desired, and then add it to an existing container.
	 * @returns {HTMLElement} The created footer.
	 */
	DockingPanel.prototype.createFooter = function() {
		var footer = new zvp.ResizeFooter(this.container);
		this.container.style.resize = 'none';
		return footer.footer;
	}

	/**
	 * Sets the title for this panel.
	 *
	 * @param {string} text - The title for this panel.
	 * @param {Object} [options] - An optional dictionary of options.
	 * @param {boolean} [options.localizeTitle=false] - When true, localization is attempted for the given text.
	 */
	DockingPanel.prototype.setTitle = function(text, options) {
		if(options && options.localizeTitle) {
			this.title.setAttribute('data-i18n', text);
			text = ZhiUTech.Viewing.i18n.translate(text);
		} else {
			this.title.removeAttribute('data-i18n');
		}
		this.title.textContent = text;
	};

	/**
	 * Creates a close button to add to this DockingPanel.  When clicked, this DockingPanel
	 * is hidden.  Call this method during initialize() if a standard close button is desired,
	 * and then add it to an existing container.
	 *
	 * @returns {HTMLElement} The created close button.
	 */
	DockingPanel.prototype.createCloseButton = function() {
		var closeButton = document.createElement("div");
		closeButton.className = "docking-panel-close";
		this.initializeCloseHandler(closeButton);
		return closeButton;
	};

	/**
	 * Override this event to be notified when this panel begins a move operation.
	 *
	 * @param {MouseEvent} event - The mousedown event.
	 * @param {number} startX - The starting x position of the panel in pixels.
	 * @param {number} startY - The starting y position of the panel in pixels.
	 */
	DockingPanel.prototype.onStartMove = function(event, startX, startY) {};

	/**
	 * Override this event to be notified when this panel ends a move operation.
	 *
	 * @param {MouseEvent} event - The mouseup event.
	 * @param {number} endX - The ending x position of the panel in pixels.
	 * @param {number} endY - The ending y position of the panel in pixels.
	 */
	DockingPanel.prototype.onEndMove = function(event, endX, endY) {};

	/**
	 * Override this to be notified when this panel is moved.  Note, do not forget to call
	 * this base class method in the overriding method.
	 *
	 * @param {MouseEvent} event - The mousemove event.
	 * @param {number} currentX - The current x position of the panel in pixels.
	 * @param {number} currentY - The current y position of the panel in pixels.
	 */
	DockingPanel.prototype.onMove = function(event, currentX, currentY) {
		this.movedSinceLastClick = true;
	};

	/**
	 * Override this method to be notified when the user clicks on the title.
	 * @param {Event} event
	 */
	DockingPanel.prototype.onTitleClick = function(event) {};

	/**
	 * Override this method to be notified when the user double-clicks on the title.
	 * @param {Event} event
	 */
	DockingPanel.prototype.onTitleDoubleClick = function(event) {};

	/**
	 * Adds an event listener to a given target that has an addEventListener(event, callback) API.
	 * These event listeners are tracked by the DockingPanel and are automatically removed on uninitialize.
	 *
	 * @param {object} target - The target that will fire the event.
	 * @param {string} eventId - The event to be listened to.
	 * @param {function} callback - The callback to execute when the event is fired.
	 */
	DockingPanel.prototype.addEventListener = function(target, eventId, callback) {
		target.addEventListener(eventId, callback);
		this.listeners.push({
			target: target,
			eventId: eventId,
			callback: callback
		});
	};

	/**
	 * Removes an existing event listener added using DockingPanel.addEventListener.
	 *
	 * @param {object} target - The target with the event listener.
	 * @param {string} eventId - The id of the event being listened to.
	 * @param {function} callback - The callback executed when the event is fired.
	 * @returns {boolean} True if the listener was removed successfully; false otherwise.
	 */
	DockingPanel.prototype.removeEventListener = function(target, eventId, callback) {
		for(var i = 0; i < this.listeners.length; ++i) {
			var listener = this.listeners[i];
			if(listener.target === target && listener.eventId === eventId && listener.callback === callback) {
				target.removeEventListener(eventId, callback);
				this.listeners.splice(i, 1);
				return true;
			}
		}
		return false;
	};

	/**
	 * Override this method to return the width and height to use when resizing the panel to the content.
	 * @returns {object} `{height: number, width: number}`.
	 */
	DockingPanel.prototype.getContentSize = function() {
		return {
			height: this.container.clientHeight,
			width: this.container.clientWidth
		};
	};

	/**
	 * Resizes the panel to the current content.  Currently this only works on height.
	 * @param {object} [options] - An optional dictionary of options.
	 * @param {number} [options.maxHeight] - The maximum height to resize this panel.
	 */
	DockingPanel.prototype.resizeToContent = function(options) {

		if(!this.isVisible())
			return;

		var dimensions = this.getContentSize(),
			newHeight = dimensions.height,
			panelRect = this.container.getBoundingClientRect(),
			parentRect = this.getContainerBoundingRect();

		// Add footer size.
		var footer = this.container.querySelector('.docking-panel-footer');
		if(footer) {
			newHeight += footer.getBoundingClientRect().height;
		}

		var toolbarHeight = 75; // hardcoded clearance for the toolbar at the bottom

		var maxHeight = parentRect.height;
		maxHeight -= (panelRect.top - parentRect.top) + toolbarHeight;

		if(options && options.maxHeight !== undefined) {
			maxHeight = Math.min(maxHeight, options.maxHeight);
		}

		if(newHeight > maxHeight) {
			newHeight = maxHeight;
		}

		// TODO: Once toolbar can be positioned anywhere, we will also need to
		// do the same for the width.
		this.container.style.maxHeight = maxHeight.toString() + 'px';
		this.container.style.height = newHeight.toString() + 'px';
	};

	/**
	 * Returns the parent's container bounding rectangle.
	 * @returns {ClientRect} Bounding rectangle of the parent.
	 */
	DockingPanel.prototype.getContainerBoundingRect = function() {
		return this.parentContainer.getBoundingClientRect();
	};

	/**
	 * 
	 * @param {Number} startY - Starting scrolling position
	 * @param {Number} endY - Starting ending position
	 * @param {Options} [callbackFn] - Callback function with a single (y:Number) argument
	 */
	DockingPanel.prototype.animateScroll = function(startY, endY, callbackFn) {

		function cubicBezier(p, t) {
			var cy = 3.0 * p[1];
			var by = 3.0 * (p[3] - p[1]) - cy;
			var ay = 1.0 - cy - by;

			return((ay * t + by) * t + cy) * t;
		}

		var _easeCurve = this.scrollEaseCurve;
		var _easeSpeed = this.scrollEaseSpeed;
		var scrollContainer = this.scrollContainer;

		function tickScroll(now) {

			var t = (now - begin) * _easeSpeed;
			t = Math.min(t, 1.0);
			var te = cubicBezier(_easeCurve, t);

			var y = startY + (endY - startY) * te;
			scrollContainer.scrollTop = y;
			callbackFn && callbackFn(y);

			if(t < 1.0)
				requestAnimationFrame(tickScroll);
		}

		// Schedule to next frame
		var begin = performance.now();
		requestAnimationFrame(tickScroll);
	};

	ZhiUTech.Viewing.UI.DockingPanel = DockingPanel;

})();;
(function() {
	'use strict';

	var avu = ZhiUTech.Viewing.UI,
		zv = ZhiUTech.Viewing,
		zvp = ZhiUTech.Viewing.Private;

	// Constants - State 
	var STATE_LOADING = 1;
	var STATE_AVAILABLE = 2;
	var STATE_NOT_AVAILABLE = 3;

	// Constants - ids
	// All valid ids in the instanceTree are based off of 1.
	// Using negative values to detect special situations.
	var ID_LOADING = -1;
	var ID_NOT_AVAILABLE = -2;

	var ModelStructureTreeDelegate = function(panel, model) {
		avu.TreeDelegate.call();

		this.panel = panel;
		this.model = model;

		this.modelDiv = document.createElement('div');
		this.modelDiv.classList.add('model-div');
		this.modelDiv.setAttribute('lmv-modelId', model.id);

		this.instanceTree = null;
		this.rootId = ID_LOADING;
		this.state = STATE_LOADING;
	};

	ModelStructureTreeDelegate.prototype = Object.create(avu.TreeDelegate.prototype);
	ModelStructureTreeDelegate.prototype.constructor = ModelStructureTreeDelegate;

	ModelStructureTreeDelegate.prototype.isLoading = function() {
		return this.state === STATE_LOADING;
	};

	ModelStructureTreeDelegate.prototype.isAvailable = function() {
		return this.state === STATE_AVAILABLE;
	};

	ModelStructureTreeDelegate.prototype.isNotAvailable = function() {
		return this.state === STATE_NOT_AVAILABLE;
	};

	ModelStructureTreeDelegate.prototype.isControlId = function(dbId) {
		return dbId === ID_LOADING || dbId === ID_NOT_AVAILABLE;
	};

	ModelStructureTreeDelegate.prototype.getControlIdCss = function(dbId) {
		if(dbId === ID_LOADING) {

		}
		if(dbId === ID_NOT_AVAILABLE) {

		}
		return null;
	};

	ModelStructureTreeDelegate.prototype.getRootId = function() {
		return this.rootId;
	};

	ModelStructureTreeDelegate.prototype.getTreeNodeId = function(node) {
		if(typeof node == "object") {
			zvp.logger.warn("Object used instead of dbId. Fix it.");
			return node.dbId;
		} else
			return node;
	};

	ModelStructureTreeDelegate.prototype.getTreeNodeIndex = function(nodeId) {
		return this.instanceTree.nodeAccess.dbIdToIndex[nodeId];
	};

	ModelStructureTreeDelegate.prototype.getTreeNodeLabel = function(dbId) {
		if(dbId === ID_LOADING) {
			var modelName = getModelNameOverride(this.model);
			if(!modelName) {
				modelName = getModelName(this.model);
			}
			return zv.i18n.translate('Loading model', {
				name: modelName
			});
		}
		if(dbId === ID_NOT_AVAILABLE) {
			var modelName = getModelNameOverride(this.model);
			if(!modelName) {
				modelName = getModelName(this.model);
			}
			return modelName; // Just show the file name, without any children.
		}

		// For multi-model cases allow overriding of the model display name.
		// Used where only host application knows true model display name.
		if(dbId === this.getRootId()) {
			var modelName = getModelNameOverride(this.model);
			if(modelName) {
				return modelName;
			}
		}

		// Special case...
		if(dbId == -1e10) { // Replace Object -10000000000 with Object 0
			return 'Object 0';
		}

		var res = this.instanceTree.getNodeName(dbId);
		return res || ('Object ' + dbId);
	};

	ModelStructureTreeDelegate.prototype.getTreeNodeClass = function(dbId) {
		if(dbId === ID_LOADING || dbId === ID_NOT_AVAILABLE)
			return 'message-unexpected';

		return '';
	};

	ModelStructureTreeDelegate.prototype.getTreeNodeParentId = function(nodeId) {
		return this.instanceTree.nodeAccess.getParentId(nodeId);
	}

	ModelStructureTreeDelegate.prototype.getTreeNodeCount = function() {
		return this.instanceTree.nodeAccess.getNumNodes();
	}

	ModelStructureTreeDelegate.prototype.getTreeNodeClientHeight = function(dbId) {
		return 36;
	}

	ModelStructureTreeDelegate.prototype.getTreeNodeDepthOffset = function(node, depth) {
		return 13 + 25 * depth;
	}

	ModelStructureTreeDelegate.prototype.isTreeNodeGroup = function(dbId) {
		if(this.isControlId(dbId)) {
			return false;
		}
		return this.instanceTree.getChildCount(dbId) > 0;
	};

	ModelStructureTreeDelegate.prototype.shouldCreateTreeNode = function(dbId) {
		return true;
	};

	ModelStructureTreeDelegate.prototype.createTreeNode = function(id, parent) {

		// hightlight.
		parent.addEventListener('mousedown', function() {

			var onMouseUp = function() {
				this.classList.remove('highlight');
				document.removeEventListener('mouseup', onMouseUp);
			}.bind(parent);

			parent.classList.add('highlight');
			document.addEventListener('mouseup', onMouseUp);
		});

		// visibility button.
		if(!this.isControlId(id)) {
			var button = document.createElement('div');
			button.dbId = id;
			button.classList.add('visibility');

			button.addEventListener('mousedown', function(event) {
				event.preventDefault();
				event.stopPropagation();
			});

			button.addEventListener('click', function(event) {
				event.preventDefault();
				event.stopPropagation();
				var dbId = parseInt(event.target.dbId);
				this.panel.onEyeIcon(dbId, this.model);
			}.bind(this));

			parent.appendChild(button);
		}

		// Add loading spinner
		if(id === ID_LOADING) {
			var img = document.createElement('img');
			img.src = zvp.getResourceUrl('res/ui/spinner.png');
			img.style.animation = 'lmv-spinner-perpetual-motion 1s infinite linear';
			img.style.float = 'right';
			img.style.marginRight = '5px';
			img.style.width = '20px';
			parent.appendChild(img);
		}

		// Delegate rest of the node creation.
		var opts = {
			localize: (id === ID_LOADING || id === ID_NOT_AVAILABLE)
		};
		avu.TreeDelegate.prototype.createTreeNode.call(this, id, parent, opts);
	};

	ModelStructureTreeDelegate.prototype.onTreeNodeRightClick = function(tree, node, event) {
		if(!this.isControlId(node)) {
			this.panel.onTreeNodeRightClick(tree, node, this.model, event);
		}
	};

	ModelStructureTreeDelegate.prototype.onTreeNodeClick = function(tree, dbId, event) {
		if(!this.isControlId(dbId)) {
			this.panel.onTreeNodeClick(tree, dbId, this.model, event);
		}
	};

	ModelStructureTreeDelegate.prototype.onTreeNodeDoubleClick = function(tree, node, event) {
		// nothing.
	};

	ModelStructureTreeDelegate.prototype.onTreeNodeIconClick = function(tree, node, event) {
		if(this.isTreeNodeGroup(node)) {
			var isCollapsed = tree.isCollapsed(this, node);
			tree.setCollapsed(this, node, !isCollapsed);
		}
	};

	ModelStructureTreeDelegate.prototype.onTreeNodeReized = function(tree) {
		// nothing.
	};

	ModelStructureTreeDelegate.prototype.forEachChild = function(dbId, callback) {
		if(!this.isControlId(dbId)) {
			this.instanceTree.enumNodeChildren(dbId, callback);
		}
	};

	ModelStructureTreeDelegate.prototype.setInstanceTree = function(instanceTree) {
		this.instanceTree = instanceTree;
		this.state = instanceTree ? STATE_AVAILABLE : STATE_NOT_AVAILABLE;
		this.rootId = instanceTree ? instanceTree.getRootId() : ID_NOT_AVAILABLE;
		setInstanceTreeAux(this)
	};

	function setInstanceTreeAux(delegate) {
		var instanceTree = delegate.instanceTree;

		if(!instanceTree)
			return;

		var rootId = delegate.rootId;
		var rootName = instanceTree.getNodeName(rootId);
		var childName;
		var childId = 0;
		var childCount = 0;
		instanceTree.enumNodeChildren(rootId, function(child) {
			if(!childCount) {
				childName = instanceTree.getNodeName(child);
				childId = child;
			}
			childCount++;
		});

		// Detect Fusion models which have a root inside a root
		delegate.hasDoubleRoot = (childCount === 1 && rootName === childName);
		delegate.rootId = delegate.hasDoubleRoot ? childId : rootId;
	};

	ModelStructureTreeDelegate.prototype.clean = function() {
		var container = this.modelDiv;
		var child;
		while(child = container.lastChild) {
			container.removeChild(child);
		}
	};

	/**
	 * Helper function that returns the name of the seed file as registered in DS/OSS.
	 * @param {*} model 
	 */
	function getModelName(model) {
		var modelData = model.getData();
		if(!modelData) {
			return '';
		}

		var urn = modelData.urn;
		try {
			// It will fail in some cases.
			urn = atob(modelData.urn);
		} catch(ee) {
			// nothing, just use modelData.urn as-is
		}

		var index = urn.lastIndexOf('/');
		if(index === -1) {
			return urn;
		}

		urn = urn.substr(index + 1);
		index = urn.indexOf('?');
		if(index !== -1) {
			urn = urn.substr(0, index);
		}

		return urn;
	};

	/**
	 * Helper function that returns model name override.
	 * Used for cases where only the host application knows the true model name.
	 * @param {*} model 
	 */
	function getModelNameOverride(model) {
		var modelData = model.getData();
		if(modelData && modelData.loadOptions && modelData.loadOptions.modelNameOverride) {
			return modelData.loadOptions.modelNameOverride;
		}
		return '';
	};

	// export
	avu.ModelStructureTreeDelegate = ModelStructureTreeDelegate;
})();;
(function() {

	"use strict";

	var avu = ZhiUTech.Viewing.UI;
	var zvp = ZhiUTech.Viewing.Private;

	/**
	 * The Model Structure Panel allows users to explore and set the visibility and selection states of the nodes defined in the loaded model.
	 *
	 * @alias ZhiUTech.Viewing.UI.ModelStructurePanel
	 * @augments ZhiUTech.Viewing.UI.DockingPanel
	 * @param {HTMLElement} parentContainer - The container for this panel.
	 * @param {string} id - The id for this panel.
	 * @param {string} title - The initial title for this panel.
	 * @param {object} [options] - An optional dictionary of options.
	 * @param {boolean} [options.startCollapsed=true] - When true, collapses all of the nodes under the root.
	 * @constructor
	 * @category UI
	 */
	var ModelStructurePanel = function(parentContainer, id, title, options) {
		avu.DockingPanel.call(this, parentContainer, id, title, options);

		this.container.classList.add('model-structure-panel');

		options = options || {};
		if(!options.heightAdjustment)
			options.heightAdjustment = 40;
		if(!options.marginTop)
			options.marginTop = 0;
		options.left = true;

		this.createScrollContainer(options);
		this.onScroll = this.onScroll.bind(this);
		this.scrollContainer.addEventListener('scroll', this.onScroll);
		this.scrollContainer.style['overflow-x'] = 'hidden';

		this.options = options;
		this.tree = null;
		this._pendingModels = [];
		this.uiCreated = false;

		var that = this;
		this.addVisibilityListener(function(show) {
			if(show) {
				if(!that.uiCreated) {
					that.createUI();
				}

				that.resizeToContent();
			}
		});
	};

	ModelStructurePanel.prototype = Object.create(avu.DockingPanel.prototype);
	ModelStructurePanel.prototype.constructor = ModelStructurePanel;

	ModelStructurePanel.prototype.uninitialize = function(model) {
		this.scrollContainer.addEventListener('scroll', this.onScroll);
		this.scrollContainer.parentNode.removeChild(this.scrollContainer);

		avu.DockingPanel.prototype.uninitialize.call(this);
	};

	/**
	 * Handler for when a model gets added into the scene.
	 *
	 * @param {ZhiUTech.Viewing.Model} model - The model being added into the scene.
	 */
	ModelStructurePanel.prototype.addModel = function(model) {
		if(!model)
			return;

		if(this.uiCreated) {
			this.createTreeUI(model);
		} else {
			this._pendingModels.push(model);
		}
	};

	/**
	 * Handler for when a model gets removed from the scene.
	 * 
	 * @param {ZhiUTech.Viewing.Model} model - The model being added into the scene.
	 */
	ModelStructurePanel.prototype.unloadModel = function(model) {
		if(!model)
			return;

		if(this.uiCreated) {
			this.removeTreeUI(model);
		} else {
			var index = this._pendingModels.indexOf(model);
			if(index === -1)
				return;
			this._pendingModels.splice(index, 1);
		}
	};

	/**
	 * Used for delayed initialization of the HTML DOM tree
	 * @private
	 */
	ModelStructurePanel.prototype.createUI = function() {
		if(this.uiCreated)
			return;

		// Title
		var title = "";
		var localizeTitle = true;
		if(this.options && this.options.defaultTitle) {
			title = this.options.defaultTitle;
			localizeTitle = !!this.options.localizeTitle;
		} else {
			title = this.modelTitle;
			localizeTitle = false;
		}
		if(!title) {
			title = "Browser";
		}

		this.setTitle(title, {
			localizeTitle: localizeTitle
		});
		this.uiCreated = true;

        // console.log(" >LJason< 日志：￥￥￥￥￥￥￥貌似找到地方了？？？？￥￥￥￥￥￥￥￥￥\n",this.scrollContainer,this.options);

        this.tree = new avu.TreeOnDemand(this.scrollContainer, this.options);

		if(this._pendingModels.length === 0) {
			// Do nothing, we get an empty model browser panel.
			return;
		}

		// Create Tree UI for models
		for(var i = 0; i < this._pendingModels.length; ++i) {
			this.createTreeUI(this._pendingModels[i]);
		}
		this._pendingModels = [];
	};

	ModelStructurePanel.prototype.createTreeUI = function(model) {

		var delegate = new avu.ModelStructureTreeDelegate(this, model);
		this.tree.pushDelegate(delegate);

		var _this = this;
		model.getObjectTree(
			function onSuccess(instanceTree) {
				_this.setInstanceTree(delegate, instanceTree);
			},
			function onFailure() {
				_this.setInstanceTree(delegate, null);
			}
		);
	};

	/**
	 * Can be overriden by sub-classes
	 */
	ModelStructurePanel.prototype.setInstanceTree = function(delegate, instanceTree) {
		this.tree.setInstanceTree(delegate, instanceTree);
	};

	ModelStructurePanel.prototype.removeTreeUI = function(model) {
		this.tree.removeDelegate(model.id);
		this.scrollContainer.scrollTop = 0;
		this.onScroll();
	};

	ModelStructurePanel.prototype.onScroll = function(event) {
		this.tree.setScroll(this.scrollContainer.scrollTop);
	};

	/**
	 * Override this method to specify the label for a node.
	 * By default, this is the node's name, or 'Object ' + object id if the name
	 * is blank.
	 *
	 * @param {Object} node - A node in an ZhiUTech.Viewing.Model
	 * @returns {string} Label of the tree node
	 */
	ModelStructurePanel.prototype.getNodeLabel = function(node) {
		return this.myDelegate.getNodeLabel(node);
	};

	ModelStructurePanel.prototype.onTreeNodeClick = function(tree, dbId, model, event) {
		throw new Error('Method must be overriden.');
	};

	ModelStructurePanel.prototype.onTreeNodeRightClick = function(tree, node, model, event) {
		throw new Error('Method must be overriden.');
	};

	/**
	 * Override this method to be notified when the user clicks on the title.
	 * @override
	 * @param {Event} event
	 */
	ModelStructurePanel.prototype.onTitleClick = function(event) {
		// Do nothing by default.
	};

	/**
	 * Override this method to be notified when the user double-clicks on the title.
	 * @override
	 * @param {Event} event
	 */
	ModelStructurePanel.prototype.onTitleDoubleClick = function(event) {
		// Do nothing by default.
	};

	ZhiUTech.Viewing.UI.ModelStructurePanel = ModelStructurePanel;

})();;
(function() {

	"use strict";

	var avu = ZhiUTech.Viewing.UI;

	/**
	 * The Property Panel displays properties from the whole model or specific parts of it.
	 * 
	 * @alias ZhiUTech.Viewing.UI.PropertyPanel
	 * @augments ZhiUTech.Viewing.UI.DockingPanel
	 * @param {HTMLElement} parentContainer - The container for this panel.
	 * @param {string} id - The id for this panel.
	 * @param {string} title - The initial title for this panel.
	 * @param {object} [options] - An optional dictionary of options. Currently unused.
	 * @constructor
	 * @category UI
	 */
	var PropertyPanel = function(parentContainer, id, title, options) {
		avu.DockingPanel.call(this, parentContainer, id, title, options);

		this.title.classList.add("docking-panel-delimiter-shadow");
		this.container.classList.add('property-panel');
		this.container.dockRight = true;

		this.createScrollContainer({
			left: false,
			heightAdjustment: 70,
			marginTop: 0
		});

		this.highlightableElements = {};

		var that = this;

		function createDelegate() {
			var delegate = new avu.TreeDelegate();

			function isCategory(object) {
				return object.type === 'category';
			}

			delegate.getTreeNodeId = function(node) {
				return node.name + (node.hasOwnProperty('value') ? node.value : '') + (node.hasOwnProperty('category') ? node.category : '');
			};

			delegate.getTreeNodeClass = function(node) {
				return isCategory(node) ? that.getCategoryClass(node) : that.getPropertyClass(node);
			};

			delegate.isTreeNodeGroup = function(node) {
				return isCategory(node);
			};

			delegate.onTreeNodeClick = function(tree, node, event) {
				if(isCategory(node)) {
					that.onCategoryClick(node, event);
				} else {
					that.onPropertyClick(node, event);
				}
			};

			delegate.onTreeNodeRightClick = function(tree, node, event) {
				if(isCategory(node)) {
					that.onCategoryRightClick(node, event);
				} else {
					that.onPropertyRightClick(node, event);
				}
			};

			delegate.onTreeNodeDoubleClick = function(tree, node, event) {
				if(isCategory(node)) {
					that.onCategoryDoubleClick(node, event);
				} else {
					that.onPropertyDoubleClick(node, event);
				}
			};

			delegate.onTreeNodeIconClick = function(tree, node, event) {
				if(isCategory(node)) {
					that.onCategoryIconClick(node, event);
				} else {
					that.onPropertyIconClick(node, event);
				}
			};

			delegate.createTreeNode = function(node, parent, options) {
				var highlightableElements = null;
				if(isCategory(node)) {
					highlightableElements = that.displayCategory(node, parent, options);
				} else {
					highlightableElements = that.displayProperty(node, parent, options);
				}

				if(highlightableElements) {
					that.highlightableElements[this.getTreeNodeId(node)] = highlightableElements;
				}
			};

			return delegate;
		}

		var delegate = createDelegate();
		this.tree = new avu.Tree(delegate, null, this.scrollContainer, {});
	};

	PropertyPanel.prototype = Object.create(avu.DockingPanel.prototype);
	PropertyPanel.prototype.constructor = PropertyPanel;

	/**
	 * Adds the given properties to the display panel.
	 * @param {Array} properties - An array of properties, each property represented as {displayName: name, displayValue: value}.
	 * @param {Object=} [options] - An optional dictionary of options.  Currently unused.
	 */
	PropertyPanel.prototype.setProperties = function(properties, options) {
		this.removeAllProperties();

		// Check if any categories need to be displayed.
		//
		var withCategories = [];
		var withoutCategories = [];

		for(var i = 0; i < properties.length; i++) {
			var property = properties[i];
			if(!property.hidden) {
				var category = properties[i].displayCategory;
				if(category && typeof category === 'string' && category !== '') {
					withCategories.push(property);
				} else {
					withoutCategories.push(property);
				}
			}
		}

		if((withCategories.length + withoutCategories.length) === 0) {
			this.showNoProperties();
			return;
		}

		for(var i = 0; i < withCategories.length; i++) {
			var property = withCategories[i];
			var precision = property.precision || ZhiUTech.Viewing.Private.calculatePrecision(property.displayValue);
			var value = ZhiUTech.Viewing.Private.formatValueWithUnits(property.displayValue, property.units, property.type, precision);
			this.addProperty(property.displayName, value, property.displayCategory);
		}

		var hasCategories = (withCategories.length > 0);
		for(var i = 0; i < withoutCategories.length; i++) {
			var property = withoutCategories[i];
			var precision = property.precision || ZhiUTech.Viewing.Private.calculatePrecision(property.displayValue);
			var value = ZhiUTech.Viewing.Private.formatValueWithUnits(property.displayValue, property.units, property.type, precision);
			this.addProperty(property.displayName, value, hasCategories ? 'Other' : '', hasCategories ? {
				localizeCategory: true
			} : {});
		}
	};

	/**
	 * Displays only the "No properties" item.
	 */
	PropertyPanel.prototype.showNoProperties = function() {
		this.removeAllProperties();
		var rootContainer = this.tree.myRootContainer;

		var message = document.createElement('div');
		message.className = 'no-properties';

		var text = 'No properties to display'; // string localized below
		message.setAttribute('data-i18n', text);
		message.textContent = ZhiUTech.Viewing.i18n.translate(text);

		rootContainer.appendChild(message);
	};

	/**
	 * Override this to display the default properties.  The current default is to display no properties.
	 */
	PropertyPanel.prototype.showDefaultProperties = function() {
		this.showNoProperties();

		this.resizeToContent();
	};

	/**
	 * Override this to return true if the default properties are being displayed.
	 */
	PropertyPanel.prototype.areDefaultPropertiesShown = function() {
		return !this.hasProperties();
	};

	/**
	 * Adds a property to this panel.  The property is defined by its name, value, and category.  The
	 * add will fail if a property with the same name, value, and category already exists.
	 *
	 * @param {string} name - The name of the property to add.
	 * @param {string} value - The value of the property to add.
	 * @param {string} category - The category of the property to add.
	 * @param {Object=} [options] - An optional dictionary of options.
	 * @param {boolean} [options.localizeCategory=false] - When true, localization is attempted for the given category
	 * @param {boolean} [options.localizeProperty=false] - When true, localization is attempted for the given property
	 * @returns {boolean} - true if the property was added, false otherwise.
	 */
	PropertyPanel.prototype.addProperty = function(name, value, category, options) {
		var element = this.tree.getElementForNode({
			name: name,
			value: value,
			category: category
		});
		if(element) {
			return false;
		}

		var parent = null;
		var property = {
			name: name,
			value: value,
			type: 'property'
		};

		if(category) {
			parent = this.tree.getElementForNode({
				name: category
			});
			if(!parent) {
				parent = this.tree.createElement_({
					name: category,
					type: 'category'
				}, this.tree.myRootContainer, options && options.localizeCategory ? {
					localize: true
				} : null);
			}
			property.category = category;
		} else {
			parent = this.tree.myRootContainer;
		}

		this.tree.createElement_(property, parent, options && options.localizeProperty ? {
			localize: true
		} : null);

		return true;
	};

	/**
	 * Returns whether this property panel currently has properties.
	 *
	 * @returns {boolean} - true if there are properties to display, false otherwise.
	 */
	PropertyPanel.prototype.hasProperties = function() {
		for(var property in this.highlightableElements) {
			return true;
		}
		return false;
	};

	/**
	 * Removes a property from this panel.  The property is defined by its name, value, and category.
	 *
	 * @param {string} name - The name of the property to remove.
	 * @param {string} value - The value of the property to remove.
	 * @param {string} category - The category of the property to remove.
	 * @param {Object=} [options] - An optional dictionary of options.  Currently unused.
	 * @returns {boolean} - true if the property was removed, false otherwise.
	 */
	PropertyPanel.prototype.removeProperty = function(name, value, category, options) {
		var property = {
			name: name,
			value: value,
			category: category
		};
		var element = this.tree.getElementForNode(property);
		if(element) {
			delete this.highlightableElements[this.tree.delegate().getTreeNodeId(property)];
			element.parentNode.removeChild(element);
			return true;
		}
		return false;
	};

	/**
	 * Removes all properties from the panel.
	 */
	PropertyPanel.prototype.removeAllProperties = function() {
		this.highlightableElements = {};
		this.tree.clear();
	};

	/**
	 * Sets the collapse state of the given category.
	 *
	 * @param {Object} category - A category object.
	 * @param {boolean} collapsed - The new collapse state.
	 */
	PropertyPanel.prototype.setCategoryCollapsed = function(category, collapsed) {
		var id = this.tree.delegate().getTreeNodeId(category);
		this.tree.setCollapsed(id, collapsed);
	};

	/**
	 * Returns whether the given category is currently collapsed.
	 *
	 * @param {Object} category - A category object.
	 * @returns {boolean} - true if the category is collapsed, false otherwise.
	 */
	PropertyPanel.prototype.isCategoryCollapsed = function(category) {
		var id = this.tree.delegate().getTreeNodeId(category);
		return this.tree.isCollapsed(id);
	};

	/**
	 * Returns the width and height to be used when resizing the panel to the content.
	 *
	 * @returns {{height: number, width: number}}
	 */
	PropertyPanel.prototype.getContentSize = function() {
		// For the PropertyPanel, it's the size of the tree + some padding value for the height.
		//
		var treeContainer = this.tree.myRootContainer;
		return {
			height: treeContainer.clientHeight + 55,
			width: treeContainer.clientWidth
		};
	};

	/**
	 * Highlights the given text if found in the property name or value.
	 *
	 * @param {string} text - The text to highlight.
	 * @param {Object=} [options] - An optional dictionary of options.  Currently unused.
	 */
	PropertyPanel.prototype.highlight = function(text, options) {
		function highlightElement(element) {
			var current = element.innerHTML;
			var unhighlighted = current.replace(/(<highlight>|<\/highlight>)/igm, "");
			if(current !== unhighlighted) {
				element.innerHTML = unhighlighted;
			}

			if(text && text !== "") {
				var query = new RegExp("(\\b" + text + "\\b)", "gim");
				var highlighted = unhighlighted.replace(query, "<highlight>$1</highlight>");
				element.innerHTML = highlighted;
			}
		}

		for(var property in this.highlightableElements) {
			var elements = this.highlightableElements[property];
			for(var i = 0; i < elements.length; ++i) {
				highlightElement(elements[i]);
			}
		}
	};

	/**
	 * Creates and adds the HTML elements to display the given category.
	 *
	 * @param {Object} category - A category object.
	 * @param {HTMLElement} parent - The parent to attach the new HTML elements.
	 * @param {Object=} [options] - An optional dictionary of options.
	 * @param {boolean} [options.localize=false] - When true, localization is attempted for the given category name.
	 *
	 * @returns {Array} elementList - the list of HTML elements to include when highlighting.
	 *                                Warning:  ensure no event listeners are attached to these elements
	 *                                as they will be lost during highlighting.
	 */
	PropertyPanel.prototype.displayCategory = function(category, parent, options) {
		var name = document.createElement('div');

		var text = category.name;
		if(options && options.localize) {
			name.setAttribute('data-i18n', text);
			text = ZhiUTech.Viewing.i18n.translate(text);
		}

		name.textContent = text;
		name.title = text;
		name.className = 'category-name';
		parent.appendChild(name);

		// Make the category name highlightable.
		//
		return [name];
	};

	function replaceUrls(s) {
		s = String(s); // Make sure we only get Strings here!
		var t = ' target="blank" class="propertyLink" ';
		var patternMap = [{
			pattern: /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim,
			value: '<a' + t + 'href="$&">$&</a>'
		}, {
			pattern: /(^|[^\/])(www\.[\S]+(\b|$))/gim,
			value: '$1<a' + t + 'href="http://$2">$2</a>'
		}];
		return patternMap.reduce(function(a, b) {
			return a.replace(b.pattern, b.value);
		}, s);
	}

	/**
	 * Creates and adds the HTML elements to display the given property.
	 *
	 * @param {Object} property - A property object.
	 * @param {HTMLElement} parent - The parent to attach the new HTML elements.
	 * @param {Object=} [options] - An optional dictionary of options.
	 * @param {boolean} [options.localize=false] - When true, localization is attempted for the given property name.
	 *
	 * @returns {Array} elementList - the list of HTML elements to include when highlighting.
	 *                                Warning:  ensure no event listeners are attached to these elements
	 *                                as they will be lost during highlighting.
	 */
	PropertyPanel.prototype.displayProperty = function(property, parent, options) {
		var name = document.createElement('div');

		var text = property.name;
		if(options && options.localize) {
			name.setAttribute('data-i18n', text);
			text = ZhiUTech.Viewing.i18n.translate(text);
		}

		name.textContent = text;
		name.title = text;
		name.className = 'property-name';

		var separator = document.createElement('div');
		separator.className = 'separator';

		var value = document.createElement('div');
		value.textContent = property.value;

		var s = property.value;
		value.title = s;
		s = replaceUrls(s);
		value.innerHTML = s;

		value.className = 'property-value';

		parent.appendChild(name);
		parent.appendChild(separator);
		parent.appendChild(value);

		// Make the property name and value highlightable.
		//
		return [name, value];
	};

	/**
	 * Override this to specify the CSS classes of a category. This way, in CSS, the designer
	 * can specify custom styling for specific category types.
	 *
	 * @param {Object} category
	 * @returns {string} - CSS classes for the category.
	 */
	PropertyPanel.prototype.getCategoryClass = function(category) {
		return 'category';
	};

	/**
	 * Override this to specify the CSS classes of a property. This way, in CSS, the designer
	 * can specify custom styling for specific property types.
	 *
	 * @param {Object} property
	 * @returns {string} - CSS classes for the property.
	 */
	PropertyPanel.prototype.getPropertyClass = function(property) {
		return 'property';
	};

	/**
	 * Override this method to do something when the user clicks on a category.  The default
	 * implementation is to toggle the collapse state of the category.
	 *
	 * @param {Object} category
	 * @param {Event} event
	 */
	PropertyPanel.prototype.onCategoryClick = function(category, event) {
		this.setCategoryCollapsed(category, !this.isCategoryCollapsed(category));
	};

	/**
	 * Override this method to do something when the user clicks on a property.
	 *
	 * @param {Object} property
	 * @param {Event} event
	 */
	PropertyPanel.prototype.onPropertyClick = function(property, event) {};

	/**
	 * Override this method to do something when the user clicks on a category's icon.  The default
	 * implementation is to toggle the collapse state of the category.
	 *
	 * @param {Object} category
	 * @param {Event} event
	 */
	PropertyPanel.prototype.onCategoryIconClick = function(category, event) {
		this.setCategoryCollapsed(category, !this.isCategoryCollapsed(category));
	};

	/**
	 * Override this method to do something when the user clicks on a property's icon.
	 *
	 * @param {Object} property
	 * @param {Event} event
	 */
	PropertyPanel.prototype.onPropertyIconClick = function(property, event) {};

	/**
	 * Override this method to do something when the user double clicks on a category.
	 *
	 * @param {Object} category
	 * @param {Event} event
	 */
	PropertyPanel.prototype.onCategoryDoubleClick = function(category, event) {};

	/**
	 * Override this method to do something when the user double clicks on a property.
	 *
	 * @param {Object} property
	 * @param {Event} event
	 */
	PropertyPanel.prototype.onPropertyDoubleClick = function(property, event) {};

	/**
	 * Override this method to do something when the user right clicks on a category.
	 *
	 * @param {Object} category
	 * @param {Event} event
	 */
	PropertyPanel.prototype.onCategoryRightClick = function(category, event) {};

	/**
	 * Override this method to do something when the user right clicks on a property.
	 *
	 * @param {Object} property
	 * @param {Event} event
	 */
	PropertyPanel.prototype.onPropertyRightClick = function(property, event) {};

	ZhiUTech.Viewing.UI.PropertyPanel = PropertyPanel;

})();;
(function() {

	var zv = ZhiUTech.Viewing;
	var zvp = ZhiUTech.Viewing.Private;

	/** @constructor */
	var ContextMenu = function(viewer) {
		this.viewer = viewer;
		this.menus = [];
		this.container = null;
		this.open = false;
	};

	ContextMenu.prototype.constructor = ContextMenu;

	ContextMenu.prototype.show = function(event, menu) {
		var viewport = this.viewer.container.getBoundingClientRect();

		// Normalize Hammer events
		if(Array.isArray(event.changedPointers) && event.changedPointers.length > 0) {
			event.clientX = event.changedPointers[0].clientX;
			event.clientY = event.changedPointers[0].clientY;
		}

		var x = event.clientX - viewport.left;
		var y = event.clientY - viewport.top;

		if(!this.open) {
			this.showMenu(menu, x, y);
			this.open = true;
		}
	};

	ContextMenu.prototype.showMenu = function(menu, x, y) {

		var menuItem;
		var submenus = [];

		// Create a menu container of the size of the viewer to eat the next click event
		// to close the menu.
		var container = document.createElement('div');
		container.style.left = '0';
		container.style.top = '0';
		container.style.width = '100%';
		container.style.height = '100%';
		container.style.position = 'absolute';
		container.style.zIndex = '10';

		var menuDiv = document.createElement('div');
		menuDiv.classList.add('menu');
		menuDiv.classList.add('docking-panel');
		menuDiv.classList.add('docking-panel-container-solid-color-a');
		container.appendChild(menuDiv);

		this.viewer.container.appendChild(container);
		this.container = container;

		this.menus.push(menuDiv);

		for(var i = 0; i < menu.length; ++i) {
			var defn = menu[i],
				title = defn.title,
				target = defn.target,
				icon = defn.icon,
				shortcut = defn.shortcut;

			menuItem = this.createMenuItem(title, icon, shortcut);
			menuDiv.appendChild(menuItem);

			if(typeof target === 'function') {
				this.addCallbackToMenuItem(menuItem, target);
			} else if(Array.isArray(target)) {
				submenus.push({
					menuItem: menuItem,
					target: target
				});
			} else {
				zvp.logger.warn("Invalid context menu option:", title, target);
			}
		}

		var rect = menuDiv.getBoundingClientRect(),
			menuDivWidth = rect.width,
			menuDivHeight = rect.height,
			viewerRect = this.viewer.container.getBoundingClientRect(),
			viewerWidth = viewerRect.width,
			viewerHeight = viewerRect.height,
			shiftLeft = zv.isTouchDevice() && !this.viewer.navigation.getUseLeftHandedInput();

		if(shiftLeft) {
			x -= menuDivWidth;
		}

		if(x < 0) {
			x = 0;
		}
		if(viewerWidth < x + menuDivWidth) {
			x = viewerWidth - menuDivWidth;
			if(x < 0) {
				x = 0;
			}
		}

		if(y < 0) {
			y = 0;
		}
		if(viewerHeight < y + menuDivHeight) {
			y = viewerHeight - menuDivHeight;
			if(y < 0) {
				y = 0;
			}
		}

		menuDiv.style.top = Math.round(y) + "px";
		menuDiv.style.left = Math.round(x) + "px";

		for(i = 0; i < submenus.length; ++i) {
			var submenu = submenus[i];

			menuItem = submenu.menuItem;
			rect = menuItem.getBoundingClientRect();
			x = Math.round((shiftLeft ? rect.left : rect.right) - viewerRect.left);
			y = Math.round(rect.top - viewerRect.top);

			this.addSubmenuCallbackToMenuItem(menuItem, submenu.target, x, y);
		}

		this.OnHide = function(event) {
			if(event.target.className !== "menu-item" && event.button === 0) {
				this.hide(event);
			}
		}.bind(this);

		this.OnMove = function(event) {
			if(event.target.className !== "menu-item") {
				this.hide(event);
				this.show(event, menu);
			}
		}.bind(this);

		this.container.addEventListener('touchend', this.OnHide);
		this.container.addEventListener('click', this.OnHide);
		this.container.addEventListener('contextmenu', this.OnMove);
	};

	/**
	 * @param text - the menu item description
	 * @param icon (optional) - className: a CSS class with a content field referencing an icon
	 * @param shortcut (optional) - the menu item keyboard shortcut
	 * @returns menuItem - div element containing the menu item elements
	 */
	ContextMenu.prototype.createMenuItem = function(text, icon, shortcut) {
		var menuItem = document.createElement("div");
		menuItem.className = "menu-item";
		shortcut = shortcut || '';

		this.setMenuItemIcon(menuItem, icon);
		this.setMenuItemText(menuItem, text);
		this.setMenuItemShortcut(menuItem, shortcut);

		return menuItem;
	};

	ContextMenu.prototype.setMenuItemIcon = function(menuItem, iconClass) {
		var menuItemIcon = document.createElement("div");
		menuItemIcon.classList.add("menu-item-icon");

		if(iconClass) {
			menuItemIcon.classList.add(iconClass);
		}

		menuItem.appendChild(menuItemIcon);
	};

	ContextMenu.prototype.setMenuItemText = function(menuItem, text) {
		var menuItemText = document.createElement("div");
		menuItemText.classList.add("menu-item-text");
		menuItemText.setAttribute("data-i18n", text);
		menuItemText.textContent = ZhiUTech.Viewing.i18n.translate(text);
		menuItem.appendChild(menuItemText);
	};

	ContextMenu.prototype.setMenuItemShortcut = function(menuItem, shortcut) {
		var menuItemShortcut = document.createElement("div");
		menuItemShortcut.classList.add("menu-item-shortcut");
		menuItemShortcut.textContent = shortcut;
		menuItem.appendChild(menuItemShortcut);
	};

	ContextMenu.prototype.addCallbackToMenuItem = function(menuItem, target) {
		var that = this;

		menuItem.addEventListener('click', function(event) {
			that.hide();
			target();
			event.preventDefault();
			return false;
		}, false);
	};

	ContextMenu.prototype.addSubmenuCallbackToMenuItem = function(menuItem, menu, x, y) {
		var that = this;

		menuItem.addEventListener('click', function() {
			that.showMenu(menu, x, y);
		}, false);
	};

	ContextMenu.prototype.hide = function() {
		if(this.open) {
			this.menus = [];
			this.open = false;
			this.container.removeEventListener('touchend', this.OnHide);
			this.container.removeEventListener('click', this.OnHide);
			this.container.removeEventListener('contextmenu', this.OnMove);
			this.container.parentNode.removeChild(this.container);
			this.container = null;
			return true;
		}
		return false;
	};

	ZhiUTech.Viewing.Private.ContextMenu = ContextMenu;

})();;
(function() {

	"use strict";

	var avu = ZhiUTech.Viewing.UI,
		zvp = ZhiUTech.Viewing.Private;

	/**
	 * Context Menu object is the base class for the viewer's context menus.
	 *
	 * @alias ZhiUTech.Viewing.UI.ObjectContextMenu
	 * @param {ZhiUTech.Viewing.Viewer3D} viewer - Viewer instance.
	 * @constructor
	 * @category UI
	 */
	var ObjectContextMenu = function(viewer) {
		this.viewer = viewer;
		this.contextMenu = new zvp.ContextMenu(viewer);
	};

	ObjectContextMenu.prototype.constructor = ObjectContextMenu;

	/**
	 * Shows the context menu.
	 * @param {Event} event - Browser event that requested the context menu.
	 */
	ObjectContextMenu.prototype.show = function(event) {
		var numSelected = this.viewer.getSelectionCount(),
			visibility = this.viewer.getSelectionVisibility(),
			status = {
				numSelected: numSelected,
				hasSelected: (0 < numSelected),
				hasVisible: visibility.hasVisible,
				hasHidden: visibility.hasHidden
			},
			menu = this.buildMenu(event, status);

		this.viewer.runContextMenuCallbacks(menu, status);

		if(menu && 0 < menu.length) {
			this.contextMenu.show(event, menu);
		}
	};

	/**
	 * Hides the context menu.
	 * @returns {boolean} True if the context menu was open, false otherwise.
	 */
	ObjectContextMenu.prototype.hide = function() {
		return this.contextMenu.hide();
	};

	/**
	 * Builds the context menu to be displayed.
	 * Override this method to change the context menu.
	 *
	 * Sample menu item:
	 * `{title: 'This is a menu item', target: function () {alert('Menu item clicked');}}`.
	 * A submenu can be specified by providing an array of submenu items as the target.
	 * @param {Event} event - Browser event that requested the context menu.
	 * @param {object} status - Information about nodes.
	 * @param {number} status.numSelected - The number of selected objects.
	 * @param {boolean} status.hasSelected - True if there is at least one selected object.
	 * @param {boolean} status.hasVisible - True if at least one selected object is visible.
	 * @param {boolean} status.hasHidden - True if at least one selected object is hidden.
	 * @returns {array} An array of menu items.
	 */
	ObjectContextMenu.prototype.buildMenu = function(event, status) {
		return null;
	};

	ZhiUTech.Viewing.UI.ObjectContextMenu = ObjectContextMenu;

})();;
/**
 * Application preferences.
 *
 * Optionally uses web storage.
 *
 * Each preference value can have tags associated to them. Developer supported tags are:
 * - 'ignore-producer'
 * - 'no-storage'
 * - '2d'
 * - '3d'
 *
 * Use tag 'ignore-producer' in extensions to avoid having developer-defined
 * render settings overridden by the loaded file.
 *
 * Use tag 'no-storage' in extensions to avoid having User Preferences (from Settings Panel) override
 * default or developer-defined preferences. Useful for render settings.
 *
 * Preferences may apply to all model types, only 2D models (with tag '2d') or 3D models only (with tag '3d').
 *
 * @constructor
 * @param {ZhiUTech.Viewing.Viewer3D} viewer - Viewer instance.
 * @param {object} options - Contains configuration parameters used to do initializations.
 * @param {boolean} [options.localStorage] - Whether values get stored and loaded back
 * from localStorage. Defaults to `true`.
 * @param {string} [options.prefix] - A string to prefix preference names in web storage.
 * Defaults to `'ZhiUTech.Viewing.Preferences.'`.
 * @category Core
 */
ZhiUTech.Viewing.Private.Preferences = function(viewer, options) {

	// Backwards compatibility for when the 2nd argument was 'prefix' string
	if(typeof options === 'string') {
		options = {
			prefix: options
		}
	}
	if(!options) {
		options = {};
	}

	if(!options.prefix) {
		options.prefix = 'ZhiUTech.Viewing.Preferences.';
	}
	if(!options.hasOwnProperty('localStorage')) {
		options.localStorage = true;
	}

	var zv = ZhiUTech.Viewing;
	var zvp = ZhiUTech.Viewing.Private;

	// from stackoverflow:
	// http://stackoverflow.com/questions/14555347/html5-localstorage-error-with-safari-quota-exceeded-err-dom-exception-22-an
	//
	function isLocalStorageSupported() {
		var testKey = options.prefix + 'test';
		try {
			var storage = window.localStorage; // This may assert if browsers disallow sites from setting data.
			storage.setItem(testKey, '1');
			storage.removeItem(testKey);
			return true;

		} catch(error) {
			return false;
		}
	}

	var defaults = {}, // Default values
		callbacks = {}, // Changed and Reset listeners
		tags = {},
		useLocalStorage = options.localStorage && isLocalStorageSupported(),
		that = this;

	// TODO: callbacks should be array, not single
	// Would need to deal with issue of registering same callback twice
	//
	viewer.addEventListener(zv.PREF_CHANGED_EVENT, function(event) {
		var callbacksForName = callbacks[event.name];
		if(callbacksForName) {
			var callback = callbacksForName.changed;
			if(callback) {
				callback(event.value);
			}
		}
	});

	viewer.addEventListener(zv.PREF_RESET_EVENT, function(event) {
		var callbacksForName = callbacks[event.name];
		if(callbacksForName) {
			var callback = callbacksForName.reset;
			if(callback) {
				callback(event.value);
			}
		}
	});

	viewer.addEventListener(zv.RESTORE_DEFAULT_SETTINGS_EVENT, function(event) {
		var tag = viewer.model.is2d() ? '2d' : '3d';
		that.reset(tag);
	});

	/**
	 * Get/set preference value in web storage.
	 * No-Op if tag 'no-storage' is associated to the name.
	 * @param {string} name - Preference name.
	 * @param {*} [value] - Preference value.
	 * @returns {*} Preference value or undefined if not available.
	 * @private
	 */
	function webStorage(name, value) {
		if(useLocalStorage) {

			// Avoid storage for 'no-storage' tags
			if(that.hasTag(name, 'no-storage')) {
				return undefined;
			}

			// Prefix our names, so we don't pollute the localStorage of the embedding application
			var prefixedName = options.prefix + name;

			if(typeof(value) !== "undefined") {
				// If value is specified, we set this value in localStorage
				localStorage[prefixedName] = value;

			} else {
				// If no value is specified we return the value from localStorage
				value = localStorage[prefixedName];
			}
			return value;
		}
		return undefined;
	}

	/**
	 * Adds a preference name + default value, tries to load value from web storage.
	 * @param {string} name
	 * @param {*} defaultValue
	 * @private
	 */
	function addPref(name, defaultValue) {
		if(typeof name !== 'string' || typeof that[name] === 'function') {
			zvp.logger.log('Preferences: invalid name=' + name);
			return;
		}

		// Use default if nothing in web storage.
		//
		var value = webStorage(name);
		var ok = false;

		if(value !== undefined) {
			try {
				value = JSON.parse(value);
				ok = true;
			} catch(e) {}
		}
		that[name] = ok ? value : defaultValue;
		tags[name] = {};
	}

	/**
	 * Load preference values from web storage/defaults.
	 * @param {object} defaultValues - Preference names and their default values.
	 */
	this.load = function(defaultValues) {
		defaults = defaultValues;
		for(var name in defaults) {
			if(defaults.hasOwnProperty(name)) {
				addPref(name, defaults[name]);
			}
		}
	};

	/**
	 * Adds a tag to the specified preferences.
	 * These are used by reset().
	 * @param {string} tag
	 * @param {string[]|string} [names] - Preference names, default all preferences.
	 */
	this.tag = function(tag, names) {
		if(tag) {
			if(!names) {
				names = Object.keys(defaults);
			} else if(!Array.isArray(names)) {
				names = [names];
			}
			for(var i = 0; i < names.length; ++i) {
				tags[names[i]][tag] = true;
			}
		}
	};

	/**
	 * Removes a tag from the specified preferences.
	 * These are used by reset().
	 * @param {string} tag
	 * @param {string[]|string} [names] - Preference names, default all preferences.
	 */
	this.untag = function(tag, names) {
		if(tag) {
			if(!names) {
				names = Object.keys(defaults);
			} else if(!Array.isArray(names)) {
				names = [names];
			}
			for(var i = 0; i < names.length; ++i) {
				tags[names[i]][tag] = false;
			}
		}
	};

	/**
	 * Checks whether a tag is associated to a name
	 * @param {string} name - Preference name
	 * @param {string} tag - The tag to check for
	 */
	this.hasTag = function(name, tag) {
		var nameKey = tags[name];
		if(nameKey) {
			return nameKey[tag] === true;
		}
		return false;
	};

	/**
	 * Adds a new preference name + default value.
	 * This preference was not previously loaded via load().
	 * @param {string} name - Preference name.
	 * @param {*} defaultValue - Preference default value.
	 * @param {string[]|string} [tags] - Optional tags.
	 * @returns {boolean} True if the preference was added.
	 */
	this.add = function(name, defaultValue, tags) {
		if(defaults.hasOwnProperty(name)) {
			zvp.logger.log("Preferences: " + name + " already exists");

		} else {
			defaults[name] = defaultValue;
			addPref(name, defaultValue);

			if(tags) {
				if(!Array.isArray(tags)) {
					tags = [tags];
				}
				for(var i = 0; i < tags.length; ++i) {
					this.tag(tags[i], name);
				}
			}
			return true;
		}
		return false;
	};

	/**
	 * Removes an existing preference.
	 * @param {string} name - Preference name.
	 * @param {boolean} [removeFromWebStorage=false] - True to clear the web storage entry for this preference.
	 * @returns {boolean} True if the preference was removed.
	 */
	this.remove = function(name, removeFromWebStorage) {
		if(defaults.hasOwnProperty(name)) {
			delete defaults[name];
			delete tags[name];
			delete this[name];

			if(removeFromWebStorage) {
				deleteFromWebStorage(name);
			}

			return true;
		}
		return false;
	};

	function deleteFromWebStorage(name) {
		if(useLocalStorage) {
			name = options.prefix + name;
			delete localStorage[name];
		}
	}

	/**
	 * Reset preferences to default values.
	 * If a tag is specified, then only certain preferences are reset.
	 * @param {string} [tag] Optional tag.
	 * @param {boolean} [include=true] True to reset only preferences with matching tags.
	 */
	this.reset = function(tag, include) {
		if(tag && include === undefined) {
			include = true;
		}

		for(var name in defaults) {
			if(defaults.hasOwnProperty(name)) {
				if(tag) {
					var tagged = !!tags[name][tag];
					if((include && !tagged) || (!include && tagged)) {
						continue;
					}
				}

				if(this.set(name, defaults[name], false)) {
					viewer.dispatchEvent({
						type: zv.PREF_RESET_EVENT,
						name: name,
						value: this[name]
					});
				}

				deleteFromWebStorage(name);
			}
		}
	};

	/**
	 * Get named preference value.
	 * Shortcut: prefs[name]
	 * @returns {*} Preference value.
	 */
	this.get = function(name) {
		return this[name];
	};

	/**
	 * Set named preference value.
	 * Value is not persisted if tag 'no-storage' is set.
	 * Do not use shortcut prefs[name] = value.
	 * @param {string} name - Preference name.
	 * @param {*} value - Preference value.
	 * @param {boolean} [notify=true] - If true then zv.PREF_CHANGED_EVENT is fired.
	 * @returns {boolean} True if the value changed, false otherwise.
	 */
	this.set = function(name, value, notify) {
		// Updates the cached value as well as the value in the web storage
		if(this[name] !== value) {
			this[name] = value;
			webStorage(name, value);

			if(notify === undefined || notify) {
				viewer.dispatchEvent({
					type: zv.PREF_CHANGED_EVENT,
					name: name,
					value: value
				});
			}

			return true;
		}
		return false;
	};

	/**
	 * Listen for preference changed and reset events.
	 * @param {string} name - Preferences name.
	 * @param {function} onChangedCallback - Function called when preferences are changed.
	 * @param {function} onResetCallback - Function called when preferences are reset.
	 */
	this.addListeners = function(name, onChangedCallback, onResetCallback) {
		callbacks[name] = {
			changed: onChangedCallback,
			reset: onResetCallback
		};
	};

	/**
	 * Remove listeners for preference changed and reset events.
	 * @param {string} name - Preferences name.
	 */
	this.removeListeners = function(name) {
		if(callbacks[name] !== undefined) {
			delete callbacks[name];
		}
	};
};;
ZhiUTechNamespace('ZhiUTech.Viewing.Private');

(function() {

	var zv = ZhiUTech.Viewing,
		zvp = ZhiUTech.Viewing.Private;

	/** @constructor */
	zvp.OptionSlider = function(caption, min, max, parentTbody, options) {
		var self = this;
		this.tbody = parentTbody;

		var atIndex = options && options.insertAtIndex ? options.insertAtIndex : -1;
		this.sliderRow = this.tbody.insertRow(atIndex);

		var cell = this.sliderRow.insertCell(0);
		this.caption = document.createElement("div");
		this.caption.setAttribute("data-i18n", caption);
		this.caption.textContent = zv.i18n.translate(caption);

		this.sliderElement = document.createElement("input");
		this.sliderElement.type = "range";
		this.sliderElement.id = caption + "_slider";
		this.sliderElement.min = min;
		this.sliderElement.max = max;
		//this.sliderElement.style.width = "95%";
		cell.appendChild(this.caption);
		cell.appendChild(this.sliderElement);

		cell = this.sliderRow.insertCell(1);
		this.stepperElement = document.createElement("input");
		this.stepperElement.type = "number";
		this.stepperElement.id = caption + "_stepper";
		this.stepperElement.min = min;
		this.stepperElement.max = max;
		this.stepperElement.step = 1;
		//this.stepperElement.style.resize = "none";
		this.stepperElement.style.width = "64px";
		cell.appendChild(this.stepperElement);

		this.blockEvent = false;

		this.stepperElement.addEventListener("change",
			function(e) {
				if(e.target != self.sliderElement)
					self.sliderElement.value = self.stepperElement.value;
				self.fireChangeEvent();
			}, false);

		function changeHandler(e) {
			if(e.target != self.stepperElement)
				self.stepperElement.value = self.sliderElement.value;
			self.fireChangeEvent();
		}

		this.sliderElement.addEventListener("change", changeHandler, false);
		this.sliderElement.addEventListener("input", changeHandler, false);
	};

	zvp.OptionSlider.prototype.constructor = zvp.OptionSlider;
	zv.EventDispatcher.prototype.apply(zvp.OptionSlider.prototype);

	zvp.OptionSlider.prototype.fireChangeEvent = function() {
		if(!this.blockEvent) {
			this.value = this.sliderElement.value;
			var e = new CustomEvent("change", {
				detail: {
					target: this,
					value: this.sliderElement.value
				}
			});
			this.dispatchEvent(e);
		}
	};

	zvp.OptionSlider.prototype.setValue = function(v) {
		this.blockEvent = true;
		this.value = v;
		this.sliderElement.value = v;
		this.stepperElement.value = v;
		this.blockEvent = false;
	};

	zvp.OptionSlider.prototype.setDisabled = function(v) {
		this.sliderElement.disabled = v;
		this.stepperElement.disabled = v;
		this.caption.disabled = v;
	};

	//==========================================================================================================
	//==========================================================================================================
	//==========================================================================================================

	/** @constructor */
	zvp.OptionCheckbox = function(caption, parentTbody, initialState, description, options) {
		var self = this;
		this.tbody = parentTbody;

		var atIndex = options && options.insertAtIndex ? options.insertAtIndex : -1;
		this.sliderRow = this.tbody.insertRow(atIndex);
		this.sliderRow.classList.add("switch-slider-row");

		var cell = this.sliderRow.insertCell(0);
		this.caption = document.createElement("div");
		this.caption.setAttribute("data-i18n", caption);
		this.caption.textContent = zv.i18n.translate(caption);

		cell.appendChild(this.caption);

		cell = this.sliderRow.insertCell(1);

		if(description) {
			this.description = document.createElement("div");
			this.description.setAttribute("data-i18n", description);
			this.description.textContent = zv.i18n.translate(description);

			cell.appendChild(this.description);
			cell = this.sliderRow.insertCell(2);
		}

		var label = document.createElement("label");
		label.classList.add("switch");

		this.checkElement = document.createElement("input");
		this.checkElement.type = "checkbox";
		this.checkElement.id = caption + "_check";
		this.checkElement.checked = initialState;
		label.appendChild(this.checkElement);

		var div = document.createElement("div");
		div.classList.add("slider");
		label.appendChild(div);

		cell.appendChild(label);

		this.blockEvent = false;
		this.checked = initialState;

		this.checkElement.addEventListener("change",
			function(e) {
				self.fireChangeEvent();
			}, false);

		if(zv.isTouchDevice()) {
			// Tap on a checkbox is handled by the browser so we don't hav to do anything for it.

			this.sliderRowHammer = new Hammer.Manager(this.sliderRow, {
				recognizers: [
					[Hammer.Tap]
				],
				inputClass: zv.isIE11 ? Hammer.PointerEventInput : Hammer.TouchInput
			});
			this.sliderRowHammer.on("tap", function(e) {
				e.preventDefault();
				//e.stopPropagation(); // Doesn't exist for tap events.
				e.target.click();
			});
		}

		this.checkElement.addEventListener("click", function(event) {
			event.stopPropagation();
		}, false);

		// Make the slider row clickable as well so that when
		// clicking on the row, the checkbox is toggled.
		this.sliderRow.addEventListener("click",
			function(e) {
				if(!self.checkElement.disabled) {
					self.checkElement.checked = !self.checkElement.checked;
					self.fireChangeEvent();
				}
			}, false);
	};

	zvp.OptionCheckbox.prototype.constructor = zvp.OptionCheckbox;
	zv.EventDispatcher.prototype.apply(zvp.OptionCheckbox.prototype);

	zvp.OptionCheckbox.prototype.fireChangeEvent = function() {
		if(!this.blockEvent) {
			this.checked = this.checkElement.checked;
			var e = new CustomEvent("change", {
				detail: {
					target: this,
					value: this.checkElement.checked
				}
			});
			this.dispatchEvent(e);
		}
	};

	zvp.OptionCheckbox.prototype.setChecked = function(check) {
		if(this.checkElement.checked != check) {
			this.checkElement.checked = check;
			this.fireChangeEvent();
		};
	}

	zvp.OptionCheckbox.prototype.setValue = function(v) {
		this.blockEvent = true;
		this.checked = v;
		this.checkElement.checked = v;
		this.blockEvent = false;
	};

	zvp.OptionCheckbox.prototype.getValue = function() {
		var v = this.checkElement.checked;
		return v;
	};

	zvp.OptionCheckbox.prototype.setDisabled = function(v) {
		this.checkElement.disabled = v;
		this.caption.disabled = v;
	};

	zvp.OptionCheckbox.prototype.setVisibility = function(isVisible) {
		if(isVisible)
			this.sliderRow.style.display = "table-row";
		else
			this.sliderRow.style.display = "none";
	};

	//==========================================================================================================
	//==========================================================================================================
	//==========================================================================================================    
	/** @constructor */
	zvp.OptionLabel = function(caption, parentTbody, options) {

		this.tbody = parentTbody;

		var atIndex = options && options.insertAtIndex ? options.insertAtIndex : -1;
		this.sliderRow = this.tbody.insertRow(atIndex);

		var cell = this.sliderRow.insertCell(0);
		this.caption = document.createElement("div");
		this.caption.setAttribute("data-i18n", caption);
		this.caption.textContent = zv.i18n.translate(caption);
		cell.appendChild(this.caption);

		cell.colSpan = "3";

		this.blockEvent = false;

	};

	//==========================================================================================================
	//==========================================================================================================
	//==========================================================================================================

	zvp.OptionDropDown = function(caption, parentTbody, items, initialItemIndex, envtab, options) {

		var self = this;
		this.tbody = parentTbody;

		var atIndex = options && options.insertAtIndex ? options.insertAtIndex : -1;
		this.sliderRow = this.tbody.insertRow(atIndex);

		this.dropdownElement = document.createElement("select");
		this.dropdownElement.id = caption + "_dropdown";
		this.dropdownElement.classList.add("option-drop-down");

		for(var i = 0; i < items.length; i++) {
			var item = document.createElement("option");
			item.value = i;
			item.setAttribute("data-i18n", items[i]);
			item.textContent = zv.i18n.translate(items[i]);
			this.dropdownElement.add(item);
		}

		this.selectedIndex = this.dropdownElement.selectedIndex = initialItemIndex;

		var cell = this.sliderRow.insertCell(0);
		this.caption = document.createElement("div");
		this.caption.setAttribute("data-i18n", caption);
		this.caption.textContent = zv.i18n.translate(caption);
		cell.appendChild(this.caption);

		if(envtab) {
			cell.colSpan = "2";

			this.sliderRow = this.tbody.insertRow(atIndex);
			var cell = this.sliderRow.insertCell(0);
			cell.appendChild(this.dropdownElement);
			cell.colSpan = "2";
			this.dropdownElement.classList.add('tabcell');
		} else {
			var cell = this.sliderRow.insertCell(1);
			cell.appendChild(this.dropdownElement);
		}

		cell.style.paddingLeft = "5px";
		cell.style.paddingRight = "5px";
		this.blockEvent = false;

		this.dropdownElement.addEventListener("change",
			function(e) {
				self.fireChangeEvent();
			}, false);
	};

	zvp.OptionDropDown.prototype.constructor = zvp.OptionDropDown;
	zv.EventDispatcher.prototype.apply(zvp.OptionDropDown.prototype);

	zvp.OptionDropDown.prototype.setSelectedIndex = function(index) {
		this.blockEvent = true;
		this.selectedIndex = this.dropdownElement.selectedIndex = index;
		this.blockEvent = false;
	};

	zvp.OptionDropDown.prototype.setSelectedValue = function(value) {
		this.blockEvent = true;
		this.dropdownElement.selectedValue = value;
		this.selectedIndex = this.dropdownElement.selectedIndex;
		this.blockEvent = false;
	};

	zvp.OptionDropDown.prototype.fireChangeEvent = function() {
		if(!this.blockEvent) {
			this.selectedIndex = this.dropdownElement.selectedIndex;
			var e = new CustomEvent("change", {
				detail: {
					target: this,
					value: this.selectedIndex
				}
			});
			this.dispatchEvent(e);
		}
	};

	zvp.OptionDropDown.prototype.setDisabled = function(v) {
		this.dropdownElement.disabled = v;
		this.caption.disabled = v;
	};

})();

//==========================================================================================================
//==========================================================================================================
//==========================================================================================================

/**
 * Creates a footer element to add to this DockingPanel. Footer provides a resize handler. 
 * Call this method during initialize() if a standard title bar is desired, and then add it to an existing container.
 * @returns {HTMLElement} The created footer.
 */
zvp.ResizeFooter = function(container, resizeCallback) {
	var footer = document.createElement('div');
	footer.classList.add('docking-panel-footer');

	var resizer = document.createElement("div");
	resizer.classList.add("docking-panel-footer-resizer");

	footer.appendChild(resizer);

	var iniUpdate = false;
	var iniPanelSize = container.getBoundingClientRect();
	var iniMousePosition = {
		x: 0,
		y: 0
	};

	var resizeOverlay = document.createElement('div');
	resizeOverlay.classList.add('zu-viewing-viewer');
	resizeOverlay.classList.add('docking-panel-resize-overlay');

	var onMouseDown = function(event) {
		iniUpdate = true;
		iniPanelSize = container.getBoundingClientRect();
		document.body.appendChild(resizeOverlay);

		document.addEventListener('touchmove', onMouseMove);
		document.addEventListener('touchcancel', onMouseUp);
		document.addEventListener('touchend', onMouseUp);
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);

		event.preventDefault();
		event.stopPropagation();
	};

	var onMouseUp = function(event) {
		if(document.body.contains(resizeOverlay)) {
			document.body.removeChild(resizeOverlay);

			document.removeEventListener('touchmove', onMouseMove);
			document.removeEventListener('touchcancel', onMouseUp);
			document.removeEventListener('touchend', onMouseUp);
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);

			event.preventDefault();
			event.stopPropagation();
		}
	}

	var onMouseMove = function(event) {
		if(event.type === 'touchmove') {
			event.canvasX = event.touches[0].screenX;
			event.canvasY = event.touches[0].screenY;
		}
		if(iniUpdate) {
			iniUpdate = false;
			iniMousePosition.x = (event.canvasX || event.clientX);
			iniMousePosition.y = (event.canvasY || event.clientY);
		}

		var dx = (event.canvasX || event.clientX) - iniMousePosition.x;
		var dy = (event.canvasY || event.clientY) - iniMousePosition.y;

		var width = parseInt((iniPanelSize.width + dx));
		var height = parseInt((iniPanelSize.height + dy));

		container.style.width = width + 'px';
		container.style.height = height + 'px';

		resizeCallback && resizeCallback(width, height);

		event.preventDefault();
		event.stopPropagation();
	}

	resizer.addEventListener('touchstart', onMouseDown);
	resizer.addEventListener('mousedown', onMouseDown);

	container.style.resize = 'none';
	container.appendChild(footer);

	this.footer = footer
	this.resizer = resizer;
};

(function() {

	"use strict";

	var ProgressBar = function(container) {

		this.bg = document.createElement('div');
		this.bg.className = 'progressbg';

		this.fg = document.createElement('div');
		this.fg.className = 'progressfg';
		this.bg.appendChild(this.fg);

		var txt = document.createElement("div");
		txt.className = "txt";
		txt.id="ZhiUTech_ProgressLogo_LJason";
		this.bg.appendChild(txt);

		this.lastValue = -1;

		container.appendChild(this.bg);

		this.widthScale = this.fg.clientWidth;
	};

	ProgressBar.prototype.setPercent = function(pct) {

		if(pct == this.lastValue)
			return;

		this.lastValue = pct;

		if(pct >= 99)
			this.bg.style.visibility = "hidden";
		else {
			this.bg.style.visibility = "visible";
			this.fg.style.width = (this.widthScale * pct * 0.01) + "px";
		}
	};

	ZhiUTech.Viewing.Private.ProgressBar = ProgressBar;

})();;
ZhiUTechNamespace('ZhiUTech.Viewing.Private');

/** @constructor */
ZhiUTech.Viewing.Private.RenderOptionsPanel = function(viewer) {
	var self = this;
	var zv = ZhiUTech.Viewing;
	var zvp = ZhiUTech.Viewing.Private;
	this.viewer = viewer;
	ZhiUTech.Viewing.UI.DockingPanel.call(this, viewer.container, 'RenderOptionsPanel', 'Rendering Options');

	this.table = document.createElement("table");
	this.table.className = "zu-lmv-tftable";

	this.tbody = document.createElement("tbody");
	this.table.appendChild(this.tbody);

	// Create the scroll container.  Adjust the height so the scroll container does not overlap
	// the resize handle.  50px accounts for the titlebar and resize handle.
	//
	this.createScrollContainer({
		heightAdjustment: 70
	});

	this.scrollContainer.appendChild(this.table);

	this.container.style.width = "320px";
	this.container.style.top = "260px";
	this.container.style.left = "220px"; // just needs an initial value dock overrides value
	this.container.style.height = "460px";
	this.container.dockRight = true;

	this.postprocStyle = new zvp.OptionSlider("Postprocess Style", 0, 4, this.tbody);
	this.postprocStyle.setValue(0.0);
	this.postprocStyle.sliderElement.step = this.postprocStyle.stepperElement.step = 1.0;
	this.addEventListener(this.postprocStyle, "change", function(e) {
		var styleVal = Math.floor(parseFloat(self.postprocStyle.value));
		var style = "";
		switch(styleVal) {
			case 0:
				style = "";
				break;
			case 1:
				style = "edging";
				break;
			case 2:
				style = "cel";
				break;
			case 3:
				style = "graphite";
				break;
			case 4:
				style = "pencil";
				break;
		}
		// load them all up, since someone is fiddling with style
		viewer.impl.preloadPostProcessStyle();

		viewer.impl.setPostProcessParameter("style", style);
		//viewer.impl.renderer().composeFinalFrame();
		var enable = (styleVal != 0.0);

		self.edgesToggle.setDisabled(!enable);
		self.grayscaleToggle.setDisabled(!enable);
		self.brightness.setDisabled(!enable);
		self.contrast.setDisabled(!enable);
		self.preserveColor.setDisabled(!enable);
		self.firstParam.setDisabled(styleVal < 2.0);
		self.secondParam.setDisabled(styleVal < 3.0);

		//viewer.impl.renderer().composeFinalFrame();
	});

	this.edgesToggle = new zvp.OptionCheckbox("Display Edges", this.tbody, true);
	this.edgesToggle.setDisabled(true);
	this.addEventListener(this.edgesToggle, "change", function(e) {
		viewer.impl.setPostProcessParameter("edges", self.edgesToggle.checked);
		//viewer.impl.renderer().composeFinalFrame();
	});

	this.grayscaleToggle = new zvp.OptionCheckbox("Grayscale", this.tbody, false);
	this.grayscaleToggle.setDisabled(true);
	this.addEventListener(this.grayscaleToggle, "change", function(e) {
		viewer.impl.setPostProcessParameter("grayscale", self.grayscaleToggle.checked);
		//viewer.impl.renderer().composeFinalFrame();
	});

	this.brightness = new zvp.OptionSlider("Brightness", -1.0, 1.0, this.tbody);
	this.brightness.setValue(0.0);
	this.brightness.sliderElement.step = this.brightness.stepperElement.step = 0.01;
	this.brightness.setDisabled(true);
	this.addEventListener(this.brightness, "change", function(e) {
		viewer.impl.setPostProcessParameter("brightness", parseFloat(self.brightness.value));
		//viewer.impl.renderer().composeFinalFrame();
	});

	this.contrast = new zvp.OptionSlider("Contrast", -1.0, 1.0, this.tbody);
	this.contrast.setValue(0.0);
	this.contrast.sliderElement.step = this.contrast.stepperElement.step = 0.01;
	this.contrast.setDisabled(true);
	this.addEventListener(this.contrast, "change", function(e) {
		viewer.impl.setPostProcessParameter("contrast", parseFloat(self.contrast.value));
		//viewer.impl.renderer().composeFinalFrame();
	});

	this.preserveColor = new zvp.OptionCheckbox("Preserve Color", this.tbody, false);
	this.preserveColor.setDisabled(true);
	this.addEventListener(this.preserveColor, "change", function(e) {
		viewer.impl.setPostProcessParameter("preserveColor", self.preserveColor.checked);
		//viewer.impl.renderer().composeFinalFrame();
	});

	this.firstParam = new zvp.OptionSlider("2*Levels/Repeats", 1.0, 5.0, this.tbody);
	this.firstParam.setValue(3.0);
	this.firstParam.sliderElement.step = this.firstParam.stepperElement.step = 0.01;
	this.firstParam.setDisabled(true);
	this.addEventListener(this.firstParam, "change", function(e) {
		var styleVal = Math.floor(parseFloat(self.postprocStyle.value));
		switch(styleVal) {
			case 1: //style = "edging";
				break;
			case 2: //style = "cel";
				viewer.impl.setPostProcessParameter("levels", 2 * parseFloat(self.firstParam.value));
				break;
			case 3: //style = "graphite";
			case 4: //style = "pencil";
				viewer.impl.setPostProcessParameter("repeats", parseFloat(self.firstParam.value));
				break;
		}
		//viewer.impl.renderer().composeFinalFrame();
	});

	this.secondParam = new zvp.OptionSlider("Rotation", 0.0, 1.0, this.tbody);
	this.secondParam.setValue(0.0);
	this.secondParam.sliderElement.step = this.secondParam.stepperElement.step = 0.01;
	this.secondParam.setDisabled(true);
	this.addEventListener(this.secondParam, "change", function(e) {
		viewer.impl.setPostProcessParameter("rotation", parseFloat(self.secondParam.value));
		//viewer.impl.renderer().composeFinalFrame();
	});

	this.saoToggle = new zvp.OptionCheckbox("AO Enabled", this.tbody, true);
	this.addEventListener(this.saoToggle, "change", function(e) {
		var enable = self.saoToggle.checked;
		viewer.prefs.set("ambientShadows", enable);
		viewer.setQualityLevel(enable, viewer.impl.renderer().settings.antialias);
	});

	this.saoRadius = new zvp.OptionSlider("AO Radius", 0, 200, this.tbody);
	this.saoRadius.setValue(10);
	this.saoRadius.sliderElement.step = this.saoRadius.stepperElement.step = 0.01;
	this.addEventListener(this.saoRadius, "change", function(e) {
		viewer.impl.renderer().setAOOptions(parseFloat(self.saoRadius.value), parseFloat(self.saoIntensity.value));
		viewer.impl.renderer().composeFinalFrame();
	});

	this.saoIntensity = new zvp.OptionSlider("AO Intensity", 0, 3, this.tbody);
	this.saoIntensity.setValue(0.4);
	this.saoIntensity.sliderElement.step = this.saoIntensity.stepperElement.step = 0.01;
	this.addEventListener(this.saoIntensity, "change", function(e) {
		viewer.impl.renderer().setAOOptions(parseFloat(self.saoRadius.value), parseFloat(self.saoIntensity.value));
		viewer.impl.renderer().composeFinalFrame();
	});

	this.groundShadowAlpha = new zvp.OptionSlider("Shadow Alpha", 0, 2, this.tbody);
	this.groundShadowAlpha.setValue(1.0);
	this.groundShadowAlpha.sliderElement.step = this.groundShadowAlpha.stepperElement.step = 0.1;
	this.addEventListener(this.groundShadowAlpha, "change", function(e) {
		viewer.setGroundShadowAlpha(parseFloat(self.groundShadowAlpha.value));
	});

	this.groundShadowColor = new zvp.OptionCheckbox("Shadow Color", this.tbody);
	if(!zv.isIE11) {
		this.groundShadowColor.checkElement.value = "#000000"; // avoid warning
		this.groundShadowColor.checkElement.type = "color"; // hack
	}
	this.addEventListener(this.groundShadowColor, "change", function(e) {
		var colStr = self.groundShadowColor.checkElement.value;
		viewer.setGroundShadowColor(
			new THREE.Color(parseInt(colStr.substr(1, 7), 16))
		);
	});

	this.groundReflectionAlpha = new zvp.OptionSlider("Reflection Alpha", 0, 2, this.tbody);
	this.groundReflectionAlpha.setValue(1.0);
	this.groundReflectionAlpha.sliderElement.step = this.groundReflectionAlpha.stepperElement.step = 0.1;
	this.addEventListener(this.groundReflectionAlpha, "change", function(e) {
		viewer.setGroundReflectionAlpha(parseFloat(self.groundReflectionAlpha.value));
	});

	this.groundReflectionColor = new zvp.OptionCheckbox("Reflection Color", this.tbody);
	if(!zv.isIE11) {
		this.groundReflectionColor.checkElement.value = "#000000"; // avoid warning
		this.groundReflectionColor.checkElement.type = "color"; // hack
	}
	this.addEventListener(this.groundReflectionColor, "change", function(e) {
		var colStr = self.groundReflectionColor.checkElement.value;
		viewer.setGroundReflectionColor(
			new THREE.Color(parseInt(colStr.substr(1, 7), 16))
		);
	});

	var env_list = [];
	for(var i = 0; i < zvp.LightPresets.length; i++) {
		env_list.push(zvp.LightPresets[i].name);
	}

	this.envSelect = new zvp.OptionDropDown("Environment", this.tbody, env_list, viewer.impl.currentLightPreset());

	this.addEventListener(this.envSelect, "change", function(e) {
		var chosen = self.envSelect.selectedIndex;
		viewer.setLightPreset(chosen);
	});

	var initialTonemapMethod = viewer.impl.renderer().getToneMapMethod();

	this.toneMapMethod = new zvp.OptionDropDown("Tonemap Method", this.tbody, ["None",
			"Canon-Lum",
			"Canon-RGB"
		],
		initialTonemapMethod);

	this.addEventListener(this.toneMapMethod, "change", function() {
		// NOTE: Changing between Canon-Lum and Canon-RGB will yield no results
		// TODO: Add mechanism to make a change in those values effective in the material.
		// Best way to test this (for now) is to add an Environment with the desired toneMap value
		var method = self.toneMapMethod.selectedIndex;
		viewer.impl.setTonemapMethod(method);
	});

	this.exposureBias = new zvp.OptionSlider("Exposure Bias", -30.0, 30.0, this.tbody);
	this.exposureBias.setValue(viewer.impl.renderer().getExposureBias());
	this.exposureBias.sliderElement.step = this.exposureBias.stepperElement.step = 0.1;
	this.addEventListener(this.exposureBias, "change", function(e) {
		viewer.impl.setTonemapExposureBias(self.exposureBias.value, self.whiteScale.value);
	});
	this.exposureBias.setDisabled(initialTonemapMethod == 0);

	this.whiteScale = new zvp.OptionSlider("Light Intensity", -5.0, 20.0, this.tbody);
	var intensity = 0.0;
	if(viewer.impl.dir_light1) {
		if(viewer.impl.dir_light1.intensity != 0)
			intensity = Math.log(viewer.impl.dir_light1.intensity) / Math.log(2.0);
		else
			intensity = -1e-20;
	}
	this.whiteScale.setValue(intensity);
	this.whiteScale.sliderElement.step = this.whiteScale.stepperElement.step = 0.1;
	this.addEventListener(this.whiteScale, "change", function(e) {
		viewer.impl.dir_light1.intensity = Math.pow(2.0, self.whiteScale.value);
		viewer.impl.setTonemapExposureBias(self.exposureBias.value, self.whiteScale.value);
	});

	// 10-200mm lens range:
	this.fovAngle = new zvp.OptionSlider("FOV-degrees", 6.88, 100, this.tbody);
	this.fovAngle.setValue(viewer.getFOV());
	this.addEventListener(this.fovAngle, "change", function(e) {
		viewer.setFOV(parseFloat(self.fovAngle.value));
	});

	// progressive update rate
	this.frameRate = new zvp.OptionSlider("Frame rate:", 1, 100, this.tbody);
	this.frameRate.setValue(viewer.impl.getFrameRate());
	this.frameRate.sliderElement.step = this.frameRate.stepperElement.step = 1;
	this.addEventListener(this.frameRate, "change", function(e) {
		viewer.impl.setFrameRate(self.frameRate.value);
	});

	this.addEventListener(this.viewer, ZhiUTech.Viewing.CAMERA_CHANGE_EVENT, function(evt) {
		var myFov = parseFloat(self.fovAngle.value);
		var camFov = viewer.getFOV();

		if(myFov != camFov)
			self.fovAngle.setValue(camFov);
	});

	this.addEventListener(this.viewer, ZhiUTech.Viewing.RENDER_OPTION_CHANGED_EVENT, function(e) {
		self.syncUI();
	});

	this.addVisibilityListener(function() {
		self.resizeToContent();
	});
};

ZhiUTech.Viewing.Private.RenderOptionsPanel.prototype = Object.create(ZhiUTech.Viewing.UI.DockingPanel.prototype);
ZhiUTech.Viewing.Private.RenderOptionsPanel.prototype.constructor = ZhiUTech.Viewing.Private.RenderOptionsPanel;

/**
 * Returns the width and height to be used when resizing the panel to the content.
 *
 * @returns {{height: number, width: number}}
 */
ZhiUTech.Viewing.Private.RenderOptionsPanel.prototype.getContentSize = function() {
	return {
		height: this.table.clientHeight + 75,
		width: this.table.clientWidth
	};
};

ZhiUTech.Viewing.Private.RenderOptionsPanel.prototype.syncUI = function() {
	var impl = this.viewer.impl;

	var intensity = 0.0;
	if(impl.dir_light1) {
		if(impl.dir_light1.intensity != 0)
			intensity = Math.log(impl.dir_light1.intensity) / Math.log(2.0);
		else
			intensity = -1e-20;
	}
	this.whiteScale.setValue(intensity);

	this.exposureBias.setValue(impl.renderer().getExposureBias());

	var method = impl.renderer().getToneMapMethod();
	this.toneMapMethod.setSelectedIndex(method);
	this.envSelect.setSelectedIndex(impl.currentLightPreset());

	this.exposureBias.setDisabled(method == 0);
	this.saoToggle.setValue(impl.renderer().getAOEnabled());
	this.saoRadius.setDisabled(!impl.renderer().getAOEnabled());
	this.saoIntensity.setDisabled(!impl.renderer().getAOEnabled());

	this.saoRadius.setValue(impl.renderer().getAORadius());
	this.saoIntensity.setValue(impl.renderer().getAOIntensity());

	// NOTE_NOP: no sync value because no get methods, not necessary to implement
	this.groundShadowAlpha.setDisabled(!this.viewer.prefs.get("groundShadow"));
	this.groundShadowColor.setDisabled(!this.viewer.prefs.get("groundShadow"));
	this.groundReflectionAlpha.setDisabled(!this.viewer.prefs.get("groundReflection"));
	this.groundReflectionColor.setDisabled(!this.viewer.prefs.get("groundReflection"));

	this.fovAngle.setValue(this.viewer.getFOV());
};

ZhiUTech.Viewing.Private.RenderOptionsPanel.prototype.uninitialize = function() {
	ZhiUTech.Viewing.UI.DockingPanel.prototype.uninitialize.call(this);
	this.table = null;
	this.tbody = null;
	this.postprocStyle = null;
	this.edgesToggle = null;
	this.grayscale = null;
	this.brightness = null;
	this.contrast = null;
	this.preserveColor = null;
	this.firstParam = null;
	this.secondParam = null;
	this.saoToggle = null;
	this.saoRadius = null;
	this.saoIntensity = null;
	this.groundShadowAlpha = null;
	this.envSelect = null;
	this.toneMapMethod = null;
	this.exposureBias = null;
	this.whiteScale = null;
	this.fovAngle = null;
	this.viewer = null;
};;
(function() {
	"use strict";

	var zv = ZhiUTech.Viewing;
	var avu = ZhiUTech.Viewing.UI;

	/**
	 * The Layer Panel allows users to explore and set the visibility state of the different layers in the loaded model.
	 * A layer is identified by a string label and represents a collection of geometry grouped by some criteria.
	 *
	 * See also
	 * [getLayersRoot()]{@link ZhiUTech.Viewing.Model/#getLayersRoot}
	 * 
	 * @alias ZhiUTech.Viewing.UI.LayersPanel
	 * @augments ZhiUTech.Viewing.UI.DockingPanel
	 * @param {Viewer} viewer - The parent viewer.
	 * @param {HTMLElement} parentContainer - The container for this panel.
	 * @param {string} id - The id for this panel.
	 * @param {object} [options] - An optional dictionary of options.
	 * @constructor
	 * @category UI
	 */
	var LayersPanel = function(viewer, parentContainer, id, options) {

		this.viewer = viewer;
		this.tree = null;
		this.layersRoot = null;
		this.visibilityImages = {};
		this.isMac = (navigator.userAgent.search("Mac OS") !== -1);

		var title = "Layers"; // Gets translated by DockingPanel's constructor
		var viewableName = viewer.config.viewableName;

		// TODO: Keep it this code for now, maybe useful for multimodel support.
		//if (viewableName && viewableName !== 'W2D') { // See SPK-1304
		//    title = zv.i18n.translate(title) + ": " + viewableName;
		//    localizeTitle = false;
		//}

		avu.DockingPanel.call(this, viewer.container, id, title, options);
		this.container.classList.add('layers-panel');
		this.container.style.top = "10px";
		this.container.style.left = "10px";

		var that = this;
		if(viewer.model) {
			that.build();
		} else {
			that.addEventListener(viewer, zv.GEOMETRY_LOADED_EVENT, function() {
				that.build();
			});
		}

		var shown = false;
		this.addVisibilityListener(function() {
			if(!shown) {
				shown = true;
				that.resizeToContent();
			}
		});
	};

	LayersPanel.prototype = Object.create(avu.DockingPanel.prototype);
	LayersPanel.prototype.constructor = LayersPanel;

	/**
	 * Clean up when the layers panel is about to be removed.
	 * @override
	 */
	LayersPanel.prototype.uninitialize = function() {
		avu.DockingPanel.prototype.uninitialize.call(this);

		this.viewer = null;
		this.tree = null;
		this.layersRoot = null;
		this.scrollContainer = null;
	};

	/**
	 * Builds the layers panel.
	 */
	LayersPanel.prototype.build = function() {
		var that = this;

		function createDelegate() {
			var delegate = new avu.TreeDelegate();

			delegate.getTreeNodeId = function(node) {
				return node.id;
			};

			delegate.getTreeNodeLabel = function(node) {
				return that.getNodeLabel(node);
			};

			delegate.getTreeNodeClass = function(node) {
				return that.getNodeClass(node);
			};

			delegate.isTreeNodeGroup = function(node) {
				return that.isGroupNode(node);
			};

			delegate.shouldCreateTreeNode = function(node) {
				return that.shouldInclude(node);
			};

			delegate.onTreeNodeClick = function(tree, node, event) {
				that.onClick(node, event);
			};

			delegate.onTreeNodeRightClick = function(tree, node, event) {
				that.onRightClick(node, event);
			};

			delegate.onTreeNodeDoubleClick = function(tree, node, event) {
				that.onDoubleClick(node, event);
			};

			delegate.onTreeNodeIconClick = function(tree, node, event) {
				that.onIconClick(node, event);
			};

			delegate.createTreeNode = function(node, parent) {
				that.createNode(node, parent);
			};

			return delegate;
		}

		// All visibility button.
		var button = document.createElement('div');

		button.classList.add('visibility');
		button.title = zv.i18n.translate('Show/hide all layers');

		button.addEventListener('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			this.viewer.setLayerVisible(null, this.viewer.allLayersHidden());
		}.bind(this));

		this.container.appendChild(button);
		this.toogleAllVisibleButton = button;

		// Add filterbox.
		var searchTimer = null;
		var searchText = "";
		var viewer = that.viewer;

		function doFiltering() {

			function getMatches(node) {
				var matches = [];
				if(node.name.toLowerCase().indexOf(searchText) !== -1) {
					matches.push(node);
				} else if(!node.isLayer) {
					var children = node.children;
					for(var i = 0; i < children.length; ++i) {
						matches = matches.concat(getMatches(children[i]));
					}
				}
				return matches;
			}

			if(searchText) {
				if(layersRoot && 0 < layersRoot.childCount) {
					that.lockoutClearFilter = true;
					viewer.setLayerVisible(getMatches(layersRoot), true, true);
					that.lockoutClearFilter = false;
				}
			} else {
				// Make all the layers visible.
				viewer.setLayerVisible(null, true);
			}

			searchTimer = null;
		}

		function doIncrementalFiltering(text) {

			if(searchTimer) {
				clearTimeout(searchTimer);
			}
			searchText = text ? text.toLowerCase() : text;
			searchTimer = setTimeout(doFiltering, 500);
		}

		this.filterbox = new avu.Filterbox(this.viewer.container.id + 'LayersPanel' + '-Filterbox', {
			filterFunction: doIncrementalFiltering
		});
		this.container.appendChild(this.filterbox.container);

		// Layer tree.
		this.createScrollContainer({
			heightAdjustment: 104,
			marginTop: 0
		});

		var scrollContainerBackground = document.createElement('div');
		scrollContainerBackground.classList.add('docking-panel-container-gradient');
		scrollContainerBackground.style.width = '100%';
		scrollContainerBackground.style.height = '100%';
		this.scrollContainer.appendChild(scrollContainerBackground);
		/*
		    filterBox.addEventListener('keyup', function (e) {
		        doIncrementalSearch();
		    });

		    // This is to detect when the user clicks on the 'x' to clear.
		    filterBox.addEventListener('click', function (e) {
		        if (filterBox.value === '') {
		            viewer.setLayerVisible(null, true);
		            return;
		        }

		        // When this event is fired after clicking on the clear button
		        // the value is not cleared yet. We have to wait for it.
		        setTimeout(function () {
		            if (filterBox.value === '') {
		                viewer.setLayerVisible(null, true);
		                e.preventDefault();
		            }
		        }, 1);
		    });
		*/
		var delegate = createDelegate(),
			layersRoot = that.layersRoot = that.viewer.impl.getLayersRoot();

		if(layersRoot) {
			that.tree = new avu.Tree(delegate, layersRoot, scrollContainerBackground, {
				excludeRoot: true
			});
			that.update();

			that.addEventListener(that.viewer, zv.LAYER_VISIBILITY_CHANGED_EVENT, function() {
				that.update();
			});
		}
	};

	/**
	 * Updates the visibility states for the layers in the panel.
	 */
	LayersPanel.prototype.update = function() {
		var that = this;

		function updateLook(node, state) {
			if(state === 0) {
				that.tree.addClass(node.id, 'dim');
			} else { // state === 1 || state === -1
				that.tree.removeClass(node.id, "dim");
			}
		}

		function getItemState(items) {
			var state;

			if(0 < items.length) {
				for(var i = 0; i < items.length; ++i) {
					var item = items[i];

					if(state === undefined) {
						state = item;
					} else if(item === 0 && state === 1) {
						state = -1;
					} else if(item === 1 && state === 0) {
						state = -1;
					}

					if(state === -1) {
						break;
					}
				}
			} else {
				state = 0;
			}
			return state;
		}

		function traverse(parent) {
			var id = parent.id;
			if(parent.isLayer) {
				var visible = that.viewer.isLayerVisible(parent) ? 1 : 0;
				updateLook(parent, visible);
			} else {
				var children = parent.children;
				for(var i = 0; i < children.length; ++i) {
					traverse(children[i]);
				}
			}
		}

		// Updatea visibility buttons.
		if(this.layersRoot && 0 < this.layersRoot.childCount) {
			traverse(that.layersRoot);
		}

		if(this.viewer.allLayersHidden()) {
			this.toogleAllVisibleButton.classList.add('dim');
		} else {
			this.toogleAllVisibleButton.classList.remove('dim');
		}
	};

	/**
	 * Toggle or isolate the visibility state for a layer node.
	 * @param {?Object} node
	 * @param {boolean=} [isolate=false] true to isolate, false to toggle
	 */
	LayersPanel.prototype.setLayerVisible = function(node, isolate) {
		var visible = isolate;

		if(node !== null && !isolate) {
			visible = !this.viewer.impl.layers.isLayerVisible(node);
		}

		this.viewer.setLayerVisible(node, visible, isolate);
		//   this.filterBox.value = '';

		// Clear selection for better UX
		// Apply at the end so that it can be worked around if needed.
		this.viewer.clearSelection();
	};

	/**
	 * Override this method to specify the label for a node.
	 * @param {Object} node
	 * @returns {string} Label of the tree node
	 */
	LayersPanel.prototype.getNodeLabel = function(node) {
		return(node.isLayer || 0 === node.childCount) ? node.name : (node.name + " (" + node.childCount + ")");
	};

	/**
	 * Override this to specify the CSS classes of a node. This way, in CSS, the designer
	 * can specify custom styling per type.
	 * By default, an empty string is returned.
	 * @param {Object} node
	 * @returns {string} CSS classes for the node
	 */
	LayersPanel.prototype.getNodeClass = function(node) {
		return '';
	};

	/**
	 * Override this method to specify whether or not a node is a group node.
	 * @param {Object} node
	 * @returns {boolean} true if this node is a group node, false otherwise
	 */
	LayersPanel.prototype.isGroupNode = function(node) {
		return !node.isLayer;
	};

	/**
	 * Override this method to specify if a tree node should be created for this node.
	 * By default, every node will be displayed.
	 * @param {Object} node
	 * @returns {boolean} true if a node should be created, false otherwise
	 */
	LayersPanel.prototype.shouldInclude = function(node) {
		return true;
	};

	/**
	 * Override this to do something when the user clicks on a tree node's icon.
	 * By default, groups will be expanded/collapsed.
	 * @param {Object} node
	 * @param {Event} event
	 */
	LayersPanel.prototype.onIconClick = function(node, event) {
		this.setGroupCollapsed(node, !this.isGroupCollapsed(node));
	};

	/**
	 * Collapse/expand a group node.
	 * @param {Object} node - A node to collapse/expand in the tree.
	 * @param {boolean} collapse - true to collapse the group, false to expand it.
	 */
	LayersPanel.prototype.setGroupCollapsed = function(node, collapse) {
		var delegate = this.tree.delegate();
		if(delegate.isTreeNodeGroup(node)) {
			var id = delegate.getTreeNodeId(node);
			this.tree.setCollapsed(id, collapse);
		}
	};

	/**
	 * Returns true if the group is collapsed.
	 * @param {Object} node - The node in the tree.
	 * @returns {boolean} - true if the group is collapsed, false otherwise.
	 */
	LayersPanel.prototype.isGroupCollapsed = function(node) {
		var delegate = this.tree.delegate();
		if(delegate.isTreeNodeGroup(node)) {
			var id = delegate.getTreeNodeId(node);
			return this.tree.isCollapsed(id);
		}
		return false;
	};
	/**
	 * Override this method to do something when the user clicks on a tree node
	 * @param {Object} node
	 * @param {Event} event
	 */
	LayersPanel.prototype.onClick = function(node, event) {};

	/**
	 * Override this to do something when the user double-clicks on a tree node
	 * @param {Object} node
	 * @param {Event} event
	 */
	LayersPanel.prototype.onDoubleClick = function(node, event) {};

	/**
	 * Override this to do something when the user right-clicks on a tree node
	 * @param {Object} node
	 * @param {Event} event
	 */
	LayersPanel.prototype.onRightClick = function(node, event) {};

	/**
	 * Override this to do something when the user clicks on an image
	 * @param {Object} node
	 * @param {Event} event
	 */
	LayersPanel.prototype.onImageClick = function(node, event) {};

	/**
	 * Returns the width and height to be used when resizing the panel to the content.
	 *
	 * @returns {{height: number, width: number}}
	 */
	LayersPanel.prototype.getContentSize = function() {

		var size = {
			width: 0,
			height: this.options.heightAdjustment || 0
		};

		// Add filter size.
		var filter = this.filterbox.container;

		size.width += filter.clientWidth;
		size.height += filter.clientHeight;

		// Add treeview size.
		var layers = this.container.querySelectorAll('leaf');
		if(layers.length > 1) {
			size.height += layers[1].clientHeight * layers.length;
		}

		return size;
	};

	/**
	 * Override this to create the HTMLContent for this node for appending to the
	 * parent.  By default, a label and a visibility image are created.
	 * @param {Object} node
	 * @param {HTMLElement} parent
	 */
	LayersPanel.prototype.createNode = function(node, parent) {

		// Add visibility button.
		var button = document.createElement('div');

		button.dbId = node;
		button.classList.add('visibility');
		button.title = zv.i18n.translate("Show/hide this layer");

		button.addEventListener('mousedown', function(event) {
			event.preventDefault();
			event.stopPropagation();
		}.bind(this));

		button.addEventListener('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			this.onImageClick(node, event);
		}.bind(this));

		parent.appendChild(button);

		// Add label.
		var label = document.createElement('label');
		label.textContent = this.getNodeLabel(node);
		parent.appendChild(label);
	};

	ZhiUTech.Viewing.UI.LayersPanel = LayersPanel;
})();;
ZhiUTechNamespace('ZhiUTech.Viewing.UI');

/**
 * UI panel specifically designed for application settings.
 *
 * The user can add new options to each of the tabs.
 * @augments ZhiUTech.Viewing.UI.DockingPanel
 * @param {HTMLElement} parentContainer - The container for this panel.
 * @param {string} id - The id to assign this panel.
 * @param {string} title - The title of this panel.
 * @param {object} [options] - An optional dictionary of options.
 * @constructor
 * @category UI
 */
ZhiUTech.Viewing.UI.SettingsPanel = function(parentContainer, id, title, options) {

	var zv = ZhiUTech.Viewing;

	ZhiUTech.Viewing.UI.DockingPanel.call(this, parentContainer, id, title, options);

	this.panelTabs = [];
	this.tabIdToIndex = {};
	this.controls = {};
	this.controlIdCount = 0; // to generate unique ids for controls.
	this.shown = false;

	var settings = this;

	var minWidth = options && options.width !== undefined ? options.width : 340;

	this.container.style.maxWidth = "800px";
	this.container.style.minWidth = minWidth + "px";
	this.container.style.top = "10px";
	this.container.style.left = (parentContainer.offsetWidth / 2 - 170) + "px"; //center it horizontally
	this.container.style.position = "absolute";

	this.tabContainer = document.createElement("div");
	this.tabContainer.classList.add("docking-panel-container-solid-color-b");
	this.tabContainer.classList.add("settings-tabs");
	this.tabContainer.classList.add("docking-panel-delimiter-shadow");
	this.container.appendChild(this.tabContainer);

	this.tabs = document.createElement("ul");
	this.tabContainer.appendChild(this.tabs);

	this.heightAdjustment = options && options.heightAdjustment ? options.heightAdjustment : 179;
	this.createScrollContainer({
		left: false,
		heightAdjustment: this.heightAdjustment,
		marginTop: 0
	});

	this.tablesContainer = document.createElement("div");
	this.tablesContainer.classList.add("settings-tabs-tables-container");

	this.scrollContainer.appendChild(this.tablesContainer);

	// Add hovering effect.
	//
	this.mouseOver = false;
	this.addEventListener(this.container, "mouseover", function(event) {
		// This is the original element the event handler was assigned to
		var e = event.toElement || event.relatedTarget;
		if(settings.mouseOver)
			return true;

		// Check for all children levels (checking from bottom up)
		var index = 0;
		while(e && e.parentNode && e.parentNode != window) {
			if(e.parentNode == this || e == this) {
				if(e.preventDefault) e.preventDefault();
				settings.mouseOver = true;

				for(var index = 0; index < settings.panelTabs.length; index++)
					settings.panelTabs[index].classList.remove("selectedmouseout");
				return true;
			}
			e = e.parentNode;
		}
	});

	this.addEventListener(this.container, "mouseout", function(event) {
		// This is the original element the event handler was assigned to
		var e = event.toElement || event.relatedTarget;
		if(!settings.mouseOver)
			return;

		// Check for all children levels (checking from bottom up)
		while(e && e.parentNode && e.parentNode != window) {
			if(e.parentNode == this || e == this) {
				if(e.preventDefault) e.preventDefault();
				return false;
			}
			e = e.parentNode;
		}
		settings.mouseOver = false;

		var selectedTab = null;
		for(var index = 0; index < settings.panelTabs.length; index++) {
			if(settings.panelTabs[index].classList.contains("tabselected"))
				settings.panelTabs[index].classList.add("selectedmouseout");
		}
	});

	this.expandID = function(controlID) {
		return id + '-' + controlID;
	};
};

ZhiUTech.Viewing.UI.SettingsPanel.prototype = Object.create(ZhiUTech.Viewing.UI.DockingPanel.prototype);
ZhiUTech.Viewing.UI.SettingsPanel.prototype.constructor = ZhiUTech.Viewing.UI.SettingsPanel;

/**
 * Sets the new visibility state of this SettingsPanel.
 *
 * @param {boolean} show - The desired visibility state.
 */
ZhiUTech.Viewing.UI.SettingsPanel.prototype.setVisible = function(show) {
	if(show) {
		// Since the container does not have width and when display set to none
		// getBoundingClientRect() returns 0, set the display to block before the
		// parent calculates the position and the panel.
		// NOTE: Setting the width for the container does not work here.
		this.container.style.display = "block";
		if(!this.shown) {
			this.resizeToContent();
		}
		this.shown = true;
	}

	ZhiUTech.Viewing.UI.DockingPanel.prototype.setVisible.call(this, show);
};

/**
 * Adds a new tab to the panel.
 *
 * @param {string} tabId - id for the tab (DOM element will have an extended ID to ensure uniqueness).
 * @param {string} tabTitle
 * @param {object} [options] - optional parameter that allows for additional options for the tab:
 * - tabClassName - class name for the Dom elements
 * - minWidth - min width for the tab
 * - index - index if the tab should be inserted instead of added at the end.
 * @returns {boolean} True if the tab was added to the panel, false otherwise.
 */
ZhiUTech.Viewing.UI.SettingsPanel.prototype.addTab = function(tabId, tabTitle, options) {
	var settings = this;

	if(this.tabIdToIndex[tabId] !== undefined)
		return false;

	var tabDomClass = options && options.className !== undefined ? options.className : null;
	var minWidth = options && options.width !== undefined ? options.width : 200;
	var tabIndex = options && options.index !== undefined ? options.index : this.panelTabs.length;

	function select(e) {
		settings.selectTab(tabId);
	}

	var tab = document.createElement("li");
	tab._id = tabId; // local ID
	tab.id = this.expandID(tab._id); // DOM ID
	tab.classList.add(tabDomClass);

	var title = document.createElement("a");
	var span = document.createElement("span");
	span.setAttribute("data-i18n", tabTitle);
	span.textContent = ZhiUTech.Viewing.i18n.translate(tabTitle);
	title.appendChild(span);
	tab.appendChild(title);

	this.tabs.appendChild(tab);

	var table = document.createElement("table");
	table._id = tabId + "-table"; // local ID
	table.id = this.expandID(table._id); // DOM ID
	table.classList.add("settings-table");
	table.classList.add("zu-lmv-tftable");
	table.classList.add(tabDomClass);

	var tbody = document.createElement("tbody");
	table.appendChild(tbody);

	this.tablesContainer.appendChild(table);

	this.addEventListener(tab, "touchstart", zv.touchStartToClick);
	this.addEventListener(tab, "click", select);

	this.panelTabs.push(tab);
	this.tabIdToIndex[tabId] = tabIndex;

	// Adjust the panel's minWidth.
	var currentMinWidth = this.container.style.minWidth ? parseInt(this.container.style.minWidth) : 0;
	if(minWidth > currentMinWidth)
		this.container.style.minWidth = minWidth + "px";

	return true;
};

/**
 * Removes the given tab from the panel.
 *
 * @param {string} tabId - Tab to remove.
 * @return {boolean} True if the tab was successfully removed, false otherwise.
 */
ZhiUTech.Viewing.UI.SettingsPanel.prototype.removeTab = function(tabId) {

	var tabIndex = this.tabIdToIndex[tabId];
	if(!tabIndex)
		return false;

	this.panelTabs.splice(tabIndex, 1);

	this.tabs.removeChild(tabDom);

	// Adjust the idToIndex table and add space (right margin) to all tabs except the last one.
	this.tabIdToIndex = {};
	var tabCount = this.panelTabs.length;
	for(var index = 0; index < tabCount; index++) {
		var tab = this.panelTabs[index];
		this.tabIdToIndex[tab._id] = index;
	}
	return true;
};

/**
 * Returns true if a tab with given id exists.
 *
 * @param {string} tabId - Tab id.
 * @returns {boolean} True if the tab with given id exists, false otherwise.
 */
ZhiUTech.Viewing.UI.SettingsPanel.prototype.hasTab = function(tabId) {
	var tabIndex = this.tabIdToIndex[tabId];
	var tab = this.panelTabs[tabIndex];
	return tab !== undefined;
};

/**
 * Makes a given tab visible and hides the other ones.
 *
 * @param {string} tabId - Tab to select.
 * @returns {boolean} True if the tab was selected, false otherwise.
 *
 */
ZhiUTech.Viewing.UI.SettingsPanel.prototype.selectTab = function(tabId) {
	if(this.isTabSelected(tabId))
		return false;

	var tabCount = this.panelTabs.length;
	for(var tabIndex = 0; tabIndex < tabCount; tabIndex++) {
		var tab = this.panelTabs[tabIndex];
		var table = document.getElementById(this.expandID(tab._id + "-table"));
		if(tabId === tab._id) {
			tab.classList.add("tabselected");
			table.classList.add('settings-selected-table');
			if(!this.mouseOver) {
				tab.classList.add("selectedmouseout");
			}
		} else {
			tab.classList.remove("tabselected");
			table.classList.remove('settings-selected-table');
			if(!this.mouseOver) {
				this.panelTabs[tabIndex].classList.remove("selectedmouseout");
			}
		}
	}

	this.scrollContainer.scrollTop = 0;
	return true;
};

/**
 * Returns true if the given tab is selected (visible).
 *
 * @param {string} tabId - Tab to check.
 * @returns {boolean} True if the tab is selected, false otherwise.
 */
ZhiUTech.Viewing.UI.SettingsPanel.prototype.isTabSelected = function(tabId) {
	var tabIndex = this.tabIdToIndex[tabId];
	var tab = this.panelTabs[tabIndex];
	return tab && tab.classList.contains('tabselected');
};

/**
 * Creates a checkbox control and adds it to a given tab.
 *
 * @param {string} tabId - Tab to which to add a new checkbox.
 * @param {string} caption - The text associated with the checkbox.
 * @param {boolean} initialState - Initial value for the checkbox (checked or not).
 * @param {function} onchange - Callback that is called when the checkbox is changed.
 * @param {object|undefined} options - Additional options:
 * - insertAtIndex - index at which to insert a new checkbox
 * @returns {string} ID of a new control.
 */
ZhiUTech.Viewing.UI.SettingsPanel.prototype.addCheckbox = function(tabId, caption, initialState, onchange, description, options) {
	var tabIndex = this.tabIdToIndex[tabId];
	if(tabIndex === undefined)
		return null;

	var table = document.getElementById(this.expandID(tabId + "-table"));
	var checkBoxElem = new ZhiUTech.Viewing.Private.OptionCheckbox(caption, table.tBodies[0], initialState, description, options);
	checkBoxElem.changeListener = function(e) {
		var checked = e.detail.target.checked;
		onchange(checked);
	};
	this.addEventListener(checkBoxElem, "change", checkBoxElem.changeListener);

	return this.addControl(tabId, checkBoxElem);
};

/**
 * Creates a slider control and adds it to a given tab.
 *
 * @param {string} tabId - Tab to which to add a new slider.
 * @param {string} caption - The text associated with the slider
 * @param {number} min - Min value of the slider.
 * @param {number} max - Max value of the slider.
 * @param {number} initialValue - Initial value for the slider.
 * @param {function} onchange - Callback that is called when the slider value is changed.
 * @param {object|undefined} options - Additional options:
 * - insertAtIndex - index at which to insert a new slider
 * @returns {string} ID of a new control.
 */
ZhiUTech.Viewing.UI.SettingsPanel.prototype.addSlider = function(tabId, caption, min, max, initialValue, onchange, options) {
	var tabIndex = this.tabIdToIndex[tabId];
	if(tabIndex === undefined)
		return null;

	var table = document.getElementById(this.expandID(tabId + "-table"));

	var slider = new ZhiUTech.Viewing.Private.OptionSlider(caption, min, max, table.tBodies[0], options);
	slider.setValue(initialValue);
	slider.sliderElement.step = slider.stepperElement.step = 1;
	this.addEventListener(slider, "change", function(e) {
		onchange(e);
	});

	return this.addControl(tabId, slider);
};

/**
 * @param {string} tabId - Tab to which to add a new slider.
 * @param {string} caption - The text associated with the slider.
 * @param {array} items - List of items for the menu.
 * @param {number} initialItemIndex - Initial choice.
 * @param {function} onchange - Callback that is called when the menu selection is changed.
 * @param {object|undefined} options - Additional options:
 * - insertAtIndex - index at which to insert a new drop down menu
 * @returns {string} ID of a new control.
 */
ZhiUTech.Viewing.UI.SettingsPanel.prototype.addDropDownMenu = function(tabId, caption, items, initialItemIndex, onchange, options) {
	var tabIndex = this.tabIdToIndex[tabId];
	if(tabIndex === undefined)
		return null;

	var table = document.getElementById(this.expandID(tabId + "-table"));

	var menu = new ZhiUTech.Viewing.Private.OptionDropDown(caption, table.tBodies[0], items, initialItemIndex, options);
	this.addEventListener(menu, "change", function(e) {
		onchange(e);
	});

	return this.addControl(tabId, menu);
};

/**
 * Adds a new control to a given tab.
 *
 * @param {string} tabId - Tab to which to add a new.
 * @param {object|HTMLElement} control - Control to add to the given tab.
 * @param {object|undefined} options - Additional parameters:
 * - insertAtIndex - index at which to insert a new control
 * - caption - caption for the control
 * @returns {string} ID of the added control.
 */
ZhiUTech.Viewing.UI.SettingsPanel.prototype.addControl = function(tabId, control, options) {
	var tabIndex = this.tabIdToIndex[tabId];
	if(tabIndex === undefined)
		return null;

	// If this is a generic control (not created by one of the convenient methods
	// like addCheckbox, addSlider, etc. then add it to the table first.
	//
	if(!control.hasOwnProperty("sliderRow")) {
		var atIndex = options && options.insertAtIndex ? options.insertAtIndex : -1;
		var caption = options && options.caption ? options.caption : null;

		var table = document.getElementById(this.expandID(tabId + "-table"));
		if(atIndex > table.length)
			atIndex = -1; // add it to the end.
		var sliderRow = table.tBodies[0].insertRow(atIndex);

		var cell = sliderRow.insertCell(0);
		if(caption) {
			var domCaption = document.createElement("div");
			domCaption.setAttribute("data-i18n", caption);
			domCaption.textContent = ZhiUTech.Viewing.i18n.translate(caption);
			cell.appendChild(domCaption);
			cell = sliderRow.insertCell(1);
		} else {
			// Span the cell into 3 columns
			cell.colSpan = 3;
		}
		cell.appendChild(control);

		control.sliderRow = sliderRow;
		control.tbody = table.tBodies[0];
	}

	var controlId = this.expandID("zu_settings_control_id_" + this.controlIdCount.toString());
	this.controlIdCount = this.controlIdCount + 1;
	this.controls[controlId] = control;

	return controlId;
};

/**
 * Removes a given checkbox from the settings panel.
 *
 * @param {string|ZhiUTech.Viewing.UI.Control} checkboxId - Checkbox to remove.
 * @returns {boolean} True if the checkbox was removed, false otherwise.
 */
ZhiUTech.Viewing.UI.SettingsPanel.prototype.removeCheckbox = function(checkboxId) {
	return this.removeControl(checkboxId);
};

/**
 * Removes a given slider from the settings panel.
 *
 * @param {string|ZhiUTech.Viewing.UI.Control} sliderId - Slider control to remove.
 * @returns {boolean} True if the slider control was removed, false otherwise.
 */
ZhiUTech.Viewing.UI.SettingsPanel.prototype.removeSlider = function(sliderId) {
	return this.removeControl(sliderId);
};

/**
 * Removes a given dropdown menu from the settings panel.
 *
 * @param {string|ZhiUTech.Viewing.UI.Control} dropdownMenuId - Dropdown to remove.
 * @returns {boolean} true if the dropdown was removed, false if the dropdown was not removed.
 */
ZhiUTech.Viewing.UI.SettingsPanel.prototype.removeDropdownMenu = function(dropdownMenuId) {
	return this.removeControl(dropdownMenuId);
};

/**
 * Removes a given control from the settings panel.
 *
 * @param {string|ZhiUTech.Viewing.UI.Control} controlId - The control ID or control instance to remove.
 * @returns {boolean} true if the control was removed, false if the control was not removed.
 */
ZhiUTech.Viewing.UI.SettingsPanel.prototype.removeControl = function(controlId) {
	var control;
	if(typeof controlId === "object" && controlId.tbody) {
		control = controlId;
		for(var c in this.controls) {
			if(this.controls[c] === control) {
				controlId = c;
				break;
			}
		}
	} else {
		control = this.controls[controlId];
	}

	if(control === undefined)
		return false;

	var tbody = control.tbody;
	var sliderRow = control.sliderRow;
	var rowIndex = sliderRow.rowIndex;

	tbody.deleteRow(rowIndex);

	delete this.controls[controlId];

	return true;
};

/**
 * Returns a control with a given id.
 *
 * @param {string} controlId - Checkbox id to return.
 * @returns {object} Control object if found, null otherwise.
 */
ZhiUTech.Viewing.UI.SettingsPanel.prototype.getControl = function(controlId) {
	return this.controls[controlId] || null;
};

/**
 * Returns the width and height to be used when resizing the panel to the content.
 *
 * @returns {object} `{height: number, width: number}`.
 */
ZhiUTech.Viewing.UI.SettingsPanel.prototype.getContentSize = function() {

	var height = this.heightAdjustment;

	// If none of the tabs is selected, then take the fist one (case when
	// there is only one tab).
	var tabHeight = 0;
	for(var tabIndex = 0; tabIndex < this.panelTabs.length; tabIndex++) {
		var tab = this.panelTabs[tabIndex];
		var table = document.getElementById(this.expandID(tab._id + "-table"));
		tabHeight = Math.max(tabHeight, table.clientHeight);
	}

	return {
		height: height + tabHeight,
		width: this.container.clientWidth
	};
};;
(function() {
	"use strict";

	var zv = ZhiUTech.Viewing,
		zvp = ZhiUTech.Viewing.Private,
		avu = ZhiUTech.Viewing.UI,
		ave = ZhiUTech.Viewing.Extensions;

	var kDefaultDocStructureConfig = {
		"click": {
			"onObject": ["toggleOverlayedSelection"]
		},
		"clickShift": {
			"onObject": ["toggleMultipleOverlayedSelection"]
		},
		"clickCtrl": {
			"onObject": ["toggleMultipleOverlayedSelection"]
		}
	};

	ave.ViewerModelStructurePanel = function(viewer, title, options) {
		this.viewer = viewer;
		this.visible = false;
		this._trackNodeClick = true; // ADP

		options = options || {};
		options.defaultTitle = "Model";
		options.excludeRoot = options.excludeRoot !== undefined ? options.excludeRoot : true;
		options.startCollapsed = options.startCollapsed !== undefined ? options.startCollapsed : false;
		options.scrollEaseCurve = options.scrollEaseCurve || [0, 0, .29, 1];
		options.scrollEaseSpeed = options.scrollEaseSpeed !== undefined ? options.scrollEaseSpeed : 0.003; // 0 disables interpolation.
		options.addFooter = options.addFooter !== undefined ? options.addFooter : true;

		this.clickConfig = (options && options.docStructureConfig) ? options.docStructureConfig : kDefaultDocStructureConfig;
		this.isMac = (navigator.userAgent.search("Mac OS") !== -1);

		if(options.hideSearch) {
			options.heightAdjustment = 70;
			avu.ModelStructurePanel.call(this, viewer.container, viewer.container.id + 'ViewerModelStructurePanel', title, options);
			this.scrollContainer.classList.add('no-search');
		} else {
			options.heightAdjustment = 104; //bigger than default because of search bar
			avu.ModelStructurePanel.call(this, viewer.container, viewer.container.id + 'ViewerModelStructurePanel', title, options);

			this.searchbox = new avu.Searchbox(viewer.container.id + 'ViewerModelStructurePanel' + '-Searchbox', viewer, {
				excludeRoot: options.excludeRoot,
				searchFunction: filterIds.bind(this)
			});
			this.searchbox.addEventListener(avu.Searchbox.Events.ON_SEARCH_SELECTED, function(event) {
				var dbId = event.id;
				var model = this.viewer.impl.findModel(event.modelId);
				this.viewer.select(dbId, model);
				this.viewer.fitToView([dbId], model, false);
			}.bind(this));
			this.container.appendChild(this.searchbox.container);
		}

		this._ignoreScroll = false;

		this.selectedNodes = {};

		this.onViewerSelect = this.onViewerSelect.bind(this);
		this.onViewerIsolate = this.onViewerIsolate.bind(this);
		this.onViewerHide = this.onViewerHide.bind(this);
		this.onViewerShow = this.onViewerShow.bind(this);
	};

	ave.ViewerModelStructurePanel.prototype = Object.create(avu.ModelStructurePanel.prototype);
	ave.ViewerModelStructurePanel.prototype.constructor = ave.ViewerModelStructurePanel;
	ave.ViewerPanelMixin.call(ave.ViewerModelStructurePanel.prototype);

	/**
	 * Invoked when the panel is getting destroyed.
	 */
	ave.ViewerModelStructurePanel.prototype.uninitialize = function() {
		if(this.viewer) {
			this.viewer.removeEventListener(zv.AGGREGATE_SELECTION_CHANGED_EVENT, this.onViewerSelect);
			this.viewer.removeEventListener(zv.AGGREGATE_ISOLATION_CHANGED_EVENT, this.onViewerIsolate);
			this.viewer.removeEventListener(zv.HIDE_EVENT, this.onViewerHide);
			this.viewer.removeEventListener(zv.SHOW_EVENT, this.onViewerShow);
			this.viewer = null;
		}
		if(this.searchResults) {
			this.searchResults.uninitialize();
			this.searchResults = null;
		}
		avu.ModelStructurePanel.prototype.uninitialize.call(this);
	};

	ave.ViewerModelStructurePanel.prototype.resizeToContent = function() {

		var treeNodesContainer = this.scrollContainer;
		var rootContainer = this.tree ? this.tree.getRootContainer() : null;

		if(!treeNodesContainer || !rootContainer) {
			return;
		}

		var size = 'calc(100% + ' + treeNodesContainer.scrollLeft + 'px)';
		rootContainer.style.width = size;
	}

	ave.ViewerModelStructurePanel.prototype.createUI = function() {

		if(this.uiCreated) {
			return;
		}

		var viewer = this.viewer;
		avu.ModelStructurePanel.prototype.createUI.call(this);

		// Get container of the tree nodes, also, set its scrollbar to the left.
		var treeNodesContainer = this.scrollContainer;
		treeNodesContainer.classList.remove('left');

		// This method will resize panel according to content each frame, we could implement this in clever and more complicated way
		// but with the risk to not contemplating all the cases resizing is needed.
		var onResize = function() {
			if(this.visible) {
				this.resizeToContent();
			}
			requestAnimationFrame(onResize);
		}.bind(this);
		onResize();

		// Set position and height.
		var options = this.options;
		var toolbarSize = 0;
		var margin = 10;
		var viewerRect = viewer.container.getBoundingClientRect();
		var toolbar = viewer.getToolbar(false);
		var maxHeight = options.maxHeight ? options.maxHeight : viewerRect.height;

		if(toolbar) {
			var toolbarRect = toolbar.container.getBoundingClientRect();
			toolbarSize = viewerRect.bottom - toolbarRect.top;
		} else {
			toolbarSize = 0;
		}

		this.container.style.top = margin + 'px';
		this.container.style.left = margin + 'px';
		this.container.style.height = 'calc(100% - ' + (toolbarSize + margin * 2) + 'px)';
		this.container.style.maxHeight = 'calc(100% - ' + (toolbarSize + margin * 2) + 'px)';

		// Show context menu on right click over the panel.
		treeNodesContainer.addEventListener('contextmenu', function(event) {
			this.viewer.contextMenu.show(event);
		}.bind(this));

		// When selection changes in the viewer, the tree reflects the selection.
		this.viewer.addEventListener(zv.AGGREGATE_SELECTION_CHANGED_EVENT, this.onViewerSelect);
		this.viewer.addEventListener(zv.AGGREGATE_ISOLATION_CHANGED_EVENT, this.onViewerIsolate);
		this.viewer.addEventListener(zv.HIDE_EVENT, this.onViewerHide);
		this.viewer.addEventListener(zv.SHOW_EVENT, this.onViewerShow);
	};

	/**
	 * Viewer Event handler
	 * @private
	 */
	ave.ViewerModelStructurePanel.prototype.onViewerSelect = function(event) {
		this.setSelection(event.selections);
		if(!this._ignoreScroll) {
			this.scrollToSelection(event.selections);
		}
		this._ignoreScroll = false;
	};

	/**
	 * Viewer Event handler
	 * @private
	 */
	ave.ViewerModelStructurePanel.prototype.onViewerIsolate = function(event) {
		this.setIsolation(event.isolation);
	};

	/**
	 * Viewer Event handler
	 * @private
	 */
	ave.ViewerModelStructurePanel.prototype.onViewerHide = function(event) {
		this.setHidden(event.nodeIdArray.slice(), event.model, true);
	};

	/**
	 * Viewer Event handler
	 * @private
	 */
	ave.ViewerModelStructurePanel.prototype.onViewerShow = function(event) {
		this.setHidden(event.nodeIdArray.slice(), event.model, false);
	};

	ave.ViewerModelStructurePanel.prototype.setVisible = function(show) {

		avu.ModelStructurePanel.prototype.setVisible.call(this, show);

		if(this.visible === show) {
			return;
		}

		this.visible = show;

		if(this.visible) {
			this.sync();
		}
	};

	ave.ViewerModelStructurePanel.prototype.sync = function() {

		var isolation = this.viewer.getAggregateIsolation();
		this.setIsolation(isolation);

		if(isolation.length === 0) {
			var hidden = this.viewer.getAggregateHiddenNodes();
			for(var i = 0; i < hidden.length; ++i) {
				var model = hidden[i].model;
				var ids = hidden[i].ids;
				this.setHidden(ids, model, true);
			}
		}

		var selection = this.viewer.getAggregateSelection();
		this.setSelection(selection);
		this.scrollToSelection(selection);
	};

	ave.ViewerModelStructurePanel.prototype.removeTreeUI = function(model) {

		delete this.selectedNodes[model.id];
		avu.ModelStructurePanel.prototype.removeTreeUI.call(this, model);
	};

	ave.ViewerModelStructurePanel.prototype.setHidden = function(nodes, model, hidden) {

		var tree = this.tree;
		var delegate = tree.getDelegate(model.id);

		var action = hidden ?
			function(node) {
				tree.addClass(delegate, node, 'dim', false);
				tree.removeClass(delegate, node, 'visible', false);
				return true;
			} :
			function(node) {
				tree.removeClass(delegate, node, 'dim', false);
				tree.addClass(delegate, node, 'visible', false);
				return true;
			};

		for(var i = 0; i < nodes.length; ++i) {
			tree.iterate(delegate, nodes[i], action);
		}
	};

	ave.ViewerModelStructurePanel.prototype.setIsolation = function(isolation) {

		// Special case, nothing isolated when array is empty
		if(isolation.length === 0) {
			var tree = this.tree;
			tree.forEachDelegate(function(delegate) {

				var model = delegate.model;
				var instanceTree = delegate.instanceTree;

				if(!instanceTree)
					return;

				var rootId = instanceTree.getRootId();

				tree.iterate(delegate, rootId, function(node) {
					tree.removeClass(delegate, node, 'dim', false);
					tree.removeClass(delegate, node, 'visible', false);
					return true;
				});
				this.setHidden([rootId], model, false);
			}.bind(this));

			return;
		}

		// append missing models into the isolation array
		var fullyHidden = [];
		if(isolation.length) {
			this.tree.forEachDelegate(function(delegate) {
				var idx = -1;
				for(var j = 0; j < isolation.length; j++) {
					if(isolation[j].model === delegate.model) {
						idx = j;
						break;
					}
				}
				if(idx === -1) {
					fullyHidden.push(delegate);
				}
			}.bind(this));
		}

		// Process isolation
		for(var i = 0; i < isolation.length; ++i) {

			var model = isolation[i].model;
			var instanceTree = model.getData().instanceTree;
			var rootId = instanceTree.getRootId();

			var tree = this.tree;
			var delegate = tree.getDelegate(model.id);

			tree.iterate(delegate, rootId, function(node) {
				tree.removeClass(delegate, node, 'dim', false);
				tree.removeClass(delegate, node, 'visible', false);
				return true;
			});

			var nodes = isolation[i].ids;
			if(nodes.length === 0)
				continue;

			// If the root is isolated, we don't want to dim anything.
			//
			if(nodes.length === 1 && nodes[0] === rootId) {
				return;
			}

			this.setHidden([rootId], model, true);
			this.setHidden(nodes, model, false);
		}

		// Hide the rest of the models
		for(var i = 0; i < fullyHidden.length; ++i) {

			var tree = this.tree;
			var delegate = fullyHidden[i];
			var model = delegate.model;
			var rootId = delegate.instanceTree.getRootId();

			tree.iterate(delegate, rootId, function(node) {
				tree.removeClass(delegate, node, 'dim', false);
				tree.removeClass(delegate, node, 'visible', false);
				return true;
			});

			this.setHidden([rootId], model, true);
		}
	};

	/**
	 * Displays the given nodes as selected in this panel.
	 *
	 * @param {Array} nodes - An array of ZhiUTech.Viewing.Model nodes to display as selected
	 */
	ave.ViewerModelStructurePanel.prototype.setSelection = function(aggregatedSelection) {
		var i, k, parent, model, nodes, delegate, instanceTree;
		var tree = this.tree;

		// Un-mark the ancestors.
		//
		var scene = this.viewer.impl.modelQueue();
		for(var modelId in this.selectedNodes) {

			model = scene.findModel(parseInt(modelId));
			nodes = this.selectedNodes[modelId];
			delegate = tree.getDelegate(modelId);
			instanceTree = delegate.instanceTree;

			if(!instanceTree)
				continue;

			for(k = 0; k < nodes.length; ++k) {
				parent = instanceTree.getNodeParentId(nodes[i]);
				while(parent) {
					tree.removeClass(delegate, parent, 'ancestor-selected');
					parent = instanceTree.getNodeParentId(parent);
				}
			}

			tree.clearSelection(delegate);
		}

		// Mark the ancestors of the newly selected nodes.
		//
		this.selectedNodes = {};
		for(i = 0; i < aggregatedSelection.length; ++i) {
			model = aggregatedSelection[i].model;
			nodes = aggregatedSelection[i].dbIdArray || aggregatedSelection[i].selection;

			delegate = tree.getDelegate(model.id);
			instanceTree = delegate.instanceTree;

			if(!instanceTree)
				continue;

			for(k = 0; k < nodes.length; ++k) {
				parent = instanceTree.getNodeParentId(nodes[i]);
				while(parent) {
					tree.addClass(delegate, parent, 'ancestor-selected');
					parent = instanceTree.getNodeParentId(parent);
				}
			}

			// Mark the newly selected nodes.
			//
			tree.setSelection(delegate, nodes);

			// Bookkeeping
			this.selectedNodes[model.id] = nodes.concat();
		}
	};

	ave.ViewerModelStructurePanel.prototype.scrollToSelection = function(aggregatedSelection) {

		// Grab first selection...
		var first = aggregatedSelection[0];
		if(!first)
			return;

		var model = first.model;
		var nodes = first.dbIdArray || first.selection;

		var scrollY = this.tree.scrollTo(nodes[0], model);

		var currScroll = this.scrollContainer.scrollTop;
		this.scrollContainer.scrollTop = scrollY;
		var endScroll = this.scrollContainer.scrollTop; // scrollTop will get modified due to height constraints.
		this.scrollContainer.scrollTop = currScroll;

		if(this.options.scrollEaseSpeed > 0) {
			this.animateScroll(currScroll, endScroll, function(posY) {
				this.tree.setScroll(posY);
			}.bind(this));
		} else {
			this.scrollContainer.scrollTop = endScroll;
			this.tree.setScroll(endScroll);
		}
	};

	/**
	 * Invoked by our specialized delegate.
	 */
	ave.ViewerModelStructurePanel.prototype.onEyeIcon = function(dbId, model) {

		this.viewer.toggleVisibility(dbId, model);
	};

	/**
	 * Overrides method in base class
	 */
	ave.ViewerModelStructurePanel.prototype.onTreeNodeClick = function(tree, node, model, event) {
		if(this._trackNodeClick) {
			zvp.logger.track({
				category: 'node_selected',
				name: 'model_browser_tool'
			});
			this._trackNodeClick = false;
		}

		if(this.isMac && event.ctrlKey) {
			return;
		}

		var key = "click";
		if(this.ctrlDown(event)) {
			key += "Ctrl";
		}
		if(event.shiftKey) {
			key += "Shift";
		}
		if(event.altKey) {
			key += "Alt";
		}

		var actions = ['toggleOverlayedSelection'];
		var clickConfig = this.clickConfig[key];
		if(clickConfig) {
			actions = clickConfig["onObject"];
		}
		this.handleAction(actions, node, model);
	};

	/**
	 * Overrides method in base class
	 */
	ave.ViewerModelStructurePanel.prototype.onTreeNodeRightClick = function(tree, node, model, event) {
		// Sometimes CTRL + LMB maps to a right click on a mac. Redirect it.
		if(this.isMac && event.ctrlKey && event.button === 0) {
			if(this.clickConfig && this.clickConfig["clickCtrl"]) {
				this.handleAction(this.clickConfig["clickCtrl"]["onObject"], node, model);
			}
			return null;
		}

		return this.viewer.contextMenu.show(event);
	};

	/**
	 * @private
	 */
	ave.ViewerModelStructurePanel.prototype.handleAction = function(actionArray, dbId, model) {

		for(var action in actionArray) {
			switch(actionArray[action]) {
				case "toggleOverlayedSelection":
					this.toggleOverlayedSelection(dbId, model);
					break;
				case "toggleMultipleOverlayedSelection":
					this.toggleMultipleOverlayedSelection(dbId, model);
					break;
				case "selectOnly":
					this.viewer.select(dbId, model);
					break;
				case "deselectAll":
					this.viewer.clearSelection();
					break;
				case "selectToggle":
					this.viewer.toggleSelect(dbId, model);
					break;
				case "isolate":
					this.viewer.isolate(dbId, model);
					break;
				case "showAll":
					this.viewer.showAll();
					break;
				case "focus":
					this.viewer.fitToView();
					break;
				case "hide":
					this.viewer.hide(dbId, model);
					break;
				case "show":
					this.viewer.show(dbId, model);
					break;
				case "toggleVisibility":
					this.viewer.toggleVisibility(dbId, model);
					break;
			}
		}
	};

	/**
	 * Click handler.
	 */
	ave.ViewerModelStructurePanel.prototype.toggleOverlayedSelection = function(dbId, model) {

		var modelSelection = this.selectedNodes[model.id];
		var index = modelSelection ? modelSelection.indexOf(dbId) : -1;
		this._ignoreScroll = true;
		if(index === -1) {
			this.viewer.select(dbId, model);
			this.viewer.fitToView([dbId], model, false);
		} else {
			this.viewer.select([], undefined, model);
		}
	}

	/**
	 * Shift Click handlers
	 */
	ave.ViewerModelStructurePanel.prototype.toggleMultipleOverlayedSelection = function(dbId, model) {
		var modelSelection = this.selectedNodes[model.id];
		var index = modelSelection ? modelSelection.indexOf(dbId) : -1;
		if(index === -1) {
			if(!modelSelection) {
				modelSelection = this.selectedNodes[model.id] = [];
			}
			modelSelection.push(dbId);
		} else {
			modelSelection.splice(index, 1);
		}

		var selection = [];
		for(var modelId in this.selectedNodes) {
			if(this.selectedNodes.hasOwnProperty(modelId)) {
				var model = this.viewer.impl.findModel(parseInt(modelId));
				var ids = this.selectedNodes[modelId];
				selection.push({
					model: model,
					ids: ids
				})
			}
		}
		this._ignoreScroll = true;
		this.viewer.impl.selector.setAggregateSelection(selection);

		var aggregatedSelection = this.viewer.getAggregateSelection();
		this.viewer.fitToView(aggregatedSelection);
	};

	/**
	 * @private
	 */
	ave.ViewerModelStructurePanel.prototype.ctrlDown = function(event) {
		return(this.isMac && event.metaKey) || (!this.isMac && event.ctrlKey);
	};

	/**
	 * 
	 * @param {*} text 
	 * 
	 * @returns Array with objects containing { delegate:Delegate, ids:Array }
	 */
	function filterIds(text) {

		var tree = this.tree;
		var searchTerm = text.toLowerCase();
		var result = [];

		tree.forEachDelegate(function(delegate) {
			var rootId = delegate.getRootId();
			var ids = [];
			tree.iterate(delegate, rootId, function(id) {
				var idName = delegate.instanceTree.getNodeName(id);
				if(idName && idName.toLowerCase().indexOf(searchTerm) !== -1) {
					ids.push(id);
				}
				return true;
			});

			result.push({
				ids: ids,
				delegate: delegate
			});
		});

		return result;
	}

})();;
(function() {
	'use strict';

	var zv = ZhiUTech.Viewing;
	var avu = zv.UI;

	/** @constructor */
	var ViewerPropertyPanel = function(viewer) {
		this.viewer = viewer;
		this.currentNodeIds = [];
		this.currentModel = null;
		this.isDirty = true;
		this.propertyNodeId = null;
		this.normalTitle = 'Properties';
		this.loadingTitle = 'Object Properties Loading...';

		avu.PropertyPanel.call(this, viewer.container, 'ViewerPropertyPanel', this.loadingTitle);
	};

	ViewerPropertyPanel.prototype = Object.create(avu.PropertyPanel.prototype);
	ViewerPropertyPanel.prototype.constructor = ViewerPropertyPanel;
	zv.Extensions.ViewerPanelMixin.call(ViewerPropertyPanel.prototype);

	function isSolidWorks(model) {
		var docNode = model.getDocumentNode();
		var viewable = docNode && docNode.findViewableParent();

		if(viewable && viewable.name().toLocaleLowerCase().indexOf(".sld") !== -1) {
			return true;
		}

		return false;
	}

	ViewerPropertyPanel.prototype.initialize = function() {
		avu.PropertyPanel.prototype.initialize.call(this);

		var that = this;

		that.addEventListener(that.viewer, zv.AGGREGATE_SELECTION_CHANGED_EVENT, function(event) {

			if(event.selections && event.selections.length) {
				that.currentNodeIds = event.selections[0].dbIdArray;
				that.currentModel = event.selections[0].model;
			} else {
				that.currentNodeIds = [];
				that.currentModel = null;
			}

			that.isDirty = true;
			that.requestProperties();
		});

		that.addEventListener(that.viewer, zv.HIDE_EVENT, function(e) {
			that.isDirty = true;
			that.requestProperties();
		});

		that.addEventListener(that.viewer, zv.SHOW_EVENT, function(e) {
			that.isDirty = true;
			that.requestProperties();
		});

		// Populate the ids with the current selection.
		//
		var aggregateSelection = this.viewer.getAggregateSelection();
		if(aggregateSelection.length) {
			this.currentModel = aggregateSelection[0].model;
			this.currentNodeIds = aggregateSelection[0].selection;
		} else {
			this.currentModel = null;
			this.currentNodeIds = [];
		}
	};

	ViewerPropertyPanel.prototype.setTitle = function(title, options) {
		if(!title) {
			title = 'Object Properties'; // localized by DockingPanel.prototype.setTitle
			options = options || {};
			options.localizeTitle = true;
		}
		avu.PropertyPanel.prototype.setTitle.call(this, title, options);
	};

	ViewerPropertyPanel.prototype.setVisible = function(show) {
		avu.DockingPanel.prototype.setVisible.call(this, show);
		this.requestProperties();
	};

	ViewerPropertyPanel.prototype.visibilityChanged = function() {
		avu.DockingPanel.prototype.visibilityChanged.call(this);
		if(this.isVisible())
			this.requestProperties();
	};

	ViewerPropertyPanel.prototype.requestProperties = function() {
		if(this.isVisible() && this.isDirty) {
			if(this.currentModel && this.currentNodeIds.length > 0) {
				this.setNodeProperties(this.currentNodeIds[this.currentNodeIds.length - 1]);
			} else {
				this.showDefaultProperties();
			}
			this.isDirty = false;
		}
	};

	ViewerPropertyPanel.prototype.setNodeProperties = function(nodeId) {
		var that = this;
		this.propertyNodeId = nodeId;
		that.currentModel.getProperties(nodeId, function(result) {

			// Prevent trying to make changes after dialog was uninitialized.
			if(!that.viewer)
				return;

			// Handle __internalref__ properties to support Solidworks
			var internalRefIds = [];
			var props = result.properties;
			for(var i = 0, len = props.length; i < len; ++i) {
				var prop = props[i];
				if(prop.displayCategory === "__internalref__") {
					internalRefIds.push(prop.displayValue);
				}
			}

			var prom;
			if(isSolidWorks(that.currentModel) && internalRefIds.length > 0) {
				// Solidworks or similar file type containing a Configuration __internalref__
				// Get the properties of all the internalref nodes and merge them with the properties already fetched.
				prom = fetchAndMerge(that.currentModel, internalRefIds, result);
			} else {
				//All other files, just return the node properties
				prom = Promise.resolve(result);
			}

			prom.then(function(result) {
				that.setTitle(that.normalTitle, {
					localizeTitle: true
				});
				that.setProperties(result.properties);
				that.highlight(that.viewer.searchText);

				that.resizeToContent();
				that.respositionPanel();
			}).catch(function() {
				that.setProperties([]);
				that.highlight('');

				that.resizeToContent();
				that.respositionPanel();
			});
		});
	};

	function fetchAndMerge(model, dbIds, previousResult) {
		return new Promise(function(resolve, reject) {
			model.getBulkProperties(dbIds, {
				ignoreHidden: true
			}, function(bulkResults) {
				for(var x = 0, xLen = bulkResults.length; x < xLen; ++x) {
					var result = bulkResults[x];
					// Merge additional properties 
					for(var i = 0, len = result.properties.length; i < len; ++i) {
						var prop = result.properties[i];
						// Only merge new properties
						var isNewProperty = true;
						for(var j = 0, len2 = previousResult.properties.length; j < len2; ++j) {
							if(previousResult.properties[j].displayName === prop.displayName) {
								isNewProperty = false;
								j = len2; // aka: break;
							}
						}
						if(isNewProperty) {
							previousResult.properties.push(prop);
						}
					}
				}
				resolve(previousResult);
			});
		});
	}

	ViewerPropertyPanel.prototype.respositionPanel = function() {

		if(!this.isVisible())
			return;

		// Does the property panel overlap the mouse position? If so, then reposition
		// the property panel. Prefer a horizontal vs. vertical reposition.
		//
		var toolController = this.viewer.toolController,
			mx = toolController.lastClickX,
			my = toolController.lastClickY,
			panelRect = this.container.getBoundingClientRect(),
			px = panelRect.left,
			py = panelRect.top,
			pw = panelRect.width,
			ph = panelRect.height,
			canvasRect = this.viewer.impl.getCanvasBoundingClientRect(),
			cx = canvasRect.left,
			cy = canvasRect.top,
			cw = canvasRect.width,
			ch = canvasRect.height;

		if((px <= mx && mx < px + pw) && (py <= my && my < py + ph)) {
			if((mx < px + (pw / 2)) && (mx + pw) < (cx + cw)) {
				this.container.style.left = Math.round(mx - cx) + 'px';
				this.container.dockRight = false;
			} else if(cx <= (mx - pw)) {
				this.container.style.left = Math.round(mx - cx - pw) + 'px';
				this.container.dockRight = false;
			} else if((mx + pw) < (cx + cw)) {
				this.container.style.left = Math.round(mx - cx) + 'px';
				this.container.dockRight = false;
			} else if((my + ph) < (cy + ch)) {
				this.container.style.top = Math.round(my - cy) + 'px';
				this.container.dockBottom = false;
			} else if(cy <= (my - ph)) {
				this.container.style.top = Math.round(my - cy - ph) + 'px';
				this.container.dockBottom = false;
			}
		}
	};

	ViewerPropertyPanel.prototype.showDefaultProperties = function() {
		var rootId = this.currentModel ? this.currentModel.getRootId() : null;
		if(rootId) {
			this.setNodeProperties(rootId);
		} else {
			this.propertyNodeId = null;
			this.setTitle(this.normalTitle, {
				localizeTitle: true
			}); // localized by DockingPanel.prototype.setTitle
			avu.PropertyPanel.prototype.showDefaultProperties.call(this);
		}
	};

	ViewerPropertyPanel.prototype.areDefaultPropertiesShown = function() {
		if(!this.currentModel)
			return false;
		var rootId = this.currentModel.getRootId();
		return this.propertyNodeId === rootId;
	};

	ViewerPropertyPanel.prototype.uninitialize = function() {
		avu.PropertyPanel.prototype.uninitialize.call(this);
		this.viewer = null;
	};

	ViewerPropertyPanel.prototype.onCategoryClick = function(category, event) {
		avu.PropertyPanel.prototype.onCategoryClick.call(this, category, event);
		this.resizeToContent();
	};

	ViewerPropertyPanel.prototype.onCategoryIconClick = function(category, event) {
		avu.PropertyPanel.prototype.onCategoryIconClick.call(this, category, event);
		this.resizeToContent();
	};

	ZhiUTech.Viewing.Extensions.ViewerPropertyPanel = ViewerPropertyPanel;

})();;
(function() {

	"use strict";

	/**
	 * ViewerLayersPanel
	 * This is a panel for displaying the layers in a file.
	 * @class
	 * @augments ZhiUTech.Viewing.UI.LayersPanel
	 *
	 * @param {Viewer} viewer - The parent viewer.
	 * @constructor
	 */
	var ViewerLayersPanel = function(viewer) {
		var parentContainer = viewer.container;
		ZhiUTech.Viewing.UI.LayersPanel.call(this, viewer, parentContainer, parentContainer.id + "ViewerLayersPanel", {
			heightAdjustment: 55
		});

		this.onRestoreStateBinded = this.onRestoreState.bind(this);
		this.viewer.addEventListener(ZhiUTech.Viewing.VIEWER_STATE_RESTORED_EVENT, this.onRestoreStateBinded);
	};

	ViewerLayersPanel.prototype = Object.create(ZhiUTech.Viewing.UI.LayersPanel.prototype);
	ViewerLayersPanel.prototype.constructor = ViewerLayersPanel;
	ZhiUTech.Viewing.Extensions.ViewerPanelMixin.call(ViewerLayersPanel.prototype);

	ViewerLayersPanel.prototype.uninitialize = function() {
		if(this.onRestoreStateBinded) {
			this.viewer.removeEventListener(ZhiUTech.Viewing.VIEWER_STATE_RESTORED_EVENT, this.onRestoreStateBinded);
			this.onRestoreStateBinded = null;
		}
		ZhiUTech.Viewing.UI.LayersPanel.prototype.uninitialize.call(this);
	};

	ViewerLayersPanel.prototype.onRestoreState = function() {
		this.update();
	};

	/**
	 * Override this method to do something when the user clicks on a tree node
	 * @override
	 * @param {Object} node
	 * @param {Event} event
	 */
	ViewerLayersPanel.prototype.onClick = function(node, event) {
		if(this.isMac && event.ctrlKey) {
			return;
		}
		var isolate = !(event.shiftKey || event.metaKey || event.ctrlKey);
		this.setLayerVisible(node, isolate);
	};

	/**
	 * Override this to do something when the user right-clicks on a tree node
	 * @param {Object} node
	 * @param {Event} event
	 */
	ViewerLayersPanel.prototype.onRightClick = function(node, event) {
		var isolate = !(event.shiftKey || event.metaKey || event.ctrlKey);
		this.setLayerVisible(node, isolate);
	};

	/**
	 * Override this to do something when the user clicks on an image
	 * @override
	 * @param {Object} node
	 * @param {Event} event
	 */
	ViewerLayersPanel.prototype.onImageClick = function(node, event) {
		if(this.isMac && event.ctrlKey) {
			return;
		}
		this.setLayerVisible(node);
	};

	/**
	 * Override this method to be notified when the user clicks on the title.
	 * @override
	 * @param {Event} event
	 */
	ViewerLayersPanel.prototype.onTitleClick = function(event) {
		this.viewer.setLayerVisible(null, true);
	};

	/**
	 * Override this method to be notified when the user double-clicks on the title.
	 * @override
	 * @param {Event} event
	 */
	ViewerLayersPanel.prototype.onTitleDoubleClick = function(event) {
		this.viewer.fitToView();
	};

	ZhiUTech.Viewing.Extensions.ViewerLayersPanel = ViewerLayersPanel;

})();;
(function() {
	"use strict";

	var zv = ZhiUTech.Viewing,
		zvp = zv.Private,
		ave = ZhiUTech.Viewing.Extensions,
		avu = ZhiUTech.Viewing.UI;

	/**
	 * Viewer3dSettings Tabs.
	 *
	 * These constants are used to define the tabs in the ViewerSettingsPanel.
	 *
	 * @enum {number}
	 * @readonly
	 */
	ave.ViewerSettingTab = {
		Navigation: "navigationtab",
		Performance: "performancetab",
		Appearance: "appearance",
		Environment: "environment"

	};

	var viewerSettingsPanelInstanceCnt = 0;

	/**
	 * ViewerSettingsPanel
	 * This is a panel for displaying the settings for the viewer.
	 * @class
	 *
	 * @param {ZhiUTech.Viewing.Viewer3D} viewer - the parent viewer
	 * @param {string} model - whether it is 3d or 2d mode (acceptable strings: "2d", "3d")
	 * @constructor
	 */
	var ViewerSettingsPanel = function(viewer, model) {

		this.viewer = viewer;
		this.is3dMode = !model.is2d();
		this.visible = false;
		var self = this;

		this.modalBackground = document.createElement("div");
		this.modalBackground.classList.add("docking-panel-modal-background");

		this.modalBackground.addEventListener("click", function() {
			self.setVisible(false);
		});

		avu.SettingsPanel.call(this, viewer.container, 'ViewerSettingsPanel' + viewer.id + '-' + viewerSettingsPanelInstanceCnt++, 'Settings', {
			width: 400,
			addFooter: false,
			heightAdjustment: 90
		});
		this.container.classList.add('viewer-settings-panel');

		this.addTab(ave.ViewerSettingTab.Performance, "Performance", {
			className: "performance"
		});
		this.addTab(ave.ViewerSettingTab.Navigation, "Navigation", {
			className: "navigation"
		});
		this.addTab(ave.ViewerSettingTab.Appearance, "Appearance", {
			className: "appearance"
		});
		if(this.is3dMode) {
			this.addTab(ave.ViewerSettingTab.Environment, "Environment", {
				className: "environment"
			});
		}
		if(!this.is3dMode) {
			this.container.classList.add('for-2d-model');
		}

		this.restoreDefaultSettings();

		this.modelPreferenceCount = 0;
		this.createNavigationPanel();
		this.createPerformancePanel();
		this.createAppearancePanel();
		if(this.is3dMode) {
			this.createEnvironmentPanel();
		}
		if(this.modelPreferenceCount) {
			zvp.logger.log('Model locked (' + this.modelPreferenceCount + ') render settings in UI.');
		}
		// Setting Performance as the default tab
		this.selectTab(ave.ViewerSettingTab.Performance);
	};

	ViewerSettingsPanel.prototype = Object.create(avu.SettingsPanel.prototype);
	ViewerSettingsPanel.prototype.constructor = ViewerSettingsPanel;
	ave.ViewerPanelMixin.call(ViewerSettingsPanel.prototype);

	/**
	 * Clean up when the viewer setting  is about to be removed.
	 * @override
	 */
	ViewerSettingsPanel.prototype.uninitialize = function() {
		this.viewer = null;
		avu.SettingsPanel.prototype.uninitialize.call(this);
		this.envSelect = null;
	};

	ViewerSettingsPanel.prototype.setVisible = function(show) {
		this.visible = show;

		if(show) {
			this.viewer.container.appendChild(this.modalBackground);
		} else {
			if(this.modalBackground.parentNode) {
				this.viewer.container.removeChild(this.modalBackground);
			}
		}

		// This method will center the environments container on the tab during panel resizings. 
		// We couldn't find a way to do it with css in a satisfactory way using the provided elements.
		var onResize = function() {
			if(this.visible) {
				var environments = this.container.querySelector('.environments-container');
				var environmentsCell = this.container.querySelector('.settings-environment-cell');

				if(!environments || !environmentsCell) {
					return;
				}

				var padding = 20;

				var environmentsParentWidth = environments.parentNode.getBoundingClientRect().width;
				var environmentsCellWidth = environmentsCell.getBoundingClientRect().width;
				var environmentsWidth = Math.floor((environmentsParentWidth - padding * 2) / environmentsCellWidth) * environmentsCellWidth;

				environments.style.width = environmentsWidth + 'px';
				environments.style.left = Math.round((environmentsParentWidth - environmentsWidth) / 2) + 'px';

				requestAnimationFrame(onResize);
			}
		}.bind(this);
		onResize();

		avu.SettingsPanel.prototype.setVisible.call(this, show);
	};
	/**Yu
	 * Creates a checkbox element and adds it to the given tab.
	 *
	 * @param {number} tabId - tab id
	 * @param {string} description - the text associated with the checkbox
	 * @param {boolean} initialState - initial value for the checkbox (checked or not)
	 * @param {function} onchange - callback that is called when the checkbox is changed
	 * @param {string} saveKey - name of the preference associated with this checkbox.
	 * @returns {HTMLElement} - it returns the checkbox element.
	 *
	 */
	ViewerSettingsPanel.prototype.addCheckbox = function(tabId, name, description, initialState, onchange, saveKey) {
		var viewer = this.viewer;

		// Use the stored settings or defaults
		var storedState = viewer.prefs[saveKey];
		initialState = (typeof storedState === 'boolean') ? storedState : initialState;

		function onChangeCB(checked) {
			if(saveKey) {
				viewer.prefs.set(saveKey, checked);
			}
			onchange(checked);
		}

		var checkboxId = avu.SettingsPanel.prototype.addCheckbox.call(this, tabId, name, initialState, onChangeCB, description);
		var checkBoxElem = this.getControl(checkboxId);
		checkBoxElem.saveKey = saveKey;

		if(saveKey) {
			viewer.prefs.addListeners(saveKey, function(value) {
				checkBoxElem.setValue(value);
			}, function(value) {
				checkBoxElem.setValue(value);
				onchange(value);
			});
		} else {
			checkBoxElem.sliderRow.classList.add('logical-group');
		}

		if(viewer.prefs.hasTag(saveKey, 'no-storage')) {
			checkBoxElem.sliderRow.classList.add('no-storage');
			this.modelPreferenceCount++;
		}
		return checkboxId;
	};

	ViewerSettingsPanel.prototype.addGrid = function(caption, parentTable, items, initialItemIndex, envtab, onChange, saveKey) {

		var table = parentTable;

		var envContainer = document.createElement("div");
		envContainer.classList.add("environments-container");
		table.appendChild(envContainer);

		var envRow = document.createElement("div");
		envRow.classList.add("environments-lighting-table");
		envContainer.appendChild(envRow);
		var viewer = this.viewer;

		if(envtab) {
			for(var i = 0; i < items.length; i++) {

				var cell = document.createElement("div");
				cell.classList.add("settings-environment-cell");
				cell.index = i;

				var image = document.createElement("div");
				image.classList.add((i < 10 ? 'img0' : 'img') + i);
				image.classList.add("settings-environment-image");

				cell.appendChild(image);

				var name = document.createElement("span");
				name.textContent = items[i];
				name.classList.add("settings-environment-name");
				cell.appendChild(name);

				cell.addEventListener("click", function() {
					onChange(this.index);
					updateEnvironmentSelection();
				});

				envRow.appendChild(cell);
			}
		}

		if(saveKey) {
			this.viewer.prefs.addListeners(saveKey, function() {}, function() {
				onChange(viewer.prefs.lightPreset);
				updateEnvironmentSelection();
			});
		}

		function updateEnvironmentSelection() {
			var index = viewer.prefs.lightPreset;
			var cells = table.querySelectorAll(".settings-environment-cell");
			for(var j = 0; j < cells.length; j++) {
				if(cells[j].index === index) {
					cells[j].classList.add("border-select");
				} else {
					cells[j].classList.remove("border-select");
				}
			}
		}

		updateEnvironmentSelection();

		return envRow;
	};

	ViewerSettingsPanel.prototype.addLabel = function(tabId, name) {
		var table;

		function getIndex() {
			switch(tabId) {
				case ave.ViewerSettingTab.Performance:
					return 0;
				case ave.ViewerSettingTab.Navigation:
					return 1;
				case ave.ViewerSettingTab.Appearance:
					return 2;
				case ave.ViewerSettingTab.Environment:
					return 3;
				default:
					return -1;
			}
		}
		var index = getIndex();
		if(index === -1) {
			return false;
		}
		table = this.tablesContainer.childNodes[index];
		this.settingsLabel = new zvp.OptionLabel(name, table.tBodies[0]);
		this.settingsLabel.sliderRow.classList.add('logical-group');
	};

	/**
	 * Removes an option from the given tab.
	 *
	 * @param {HTMLElement} checkBoxElem - checkbox to remove.
	 *
	 */
	ViewerSettingsPanel.prototype.removeCheckbox = function(checkBoxElem) {
		this.viewer.prefs.removeListeners(checkBoxElem.saveKey);
		this.removeEventListener(checkBoxElem, "change", checkBoxElem.changeListener);

		return avu.SettingsPanel.prototype.removeCheckbox.call(this, checkBoxElem);
	};

	/**
	 *  Populates the navigation tab with the appropriate checkboxes.
	 */
	ViewerSettingsPanel.prototype.createNavigationPanel = function() {
		var viewer = this.viewer;
		var navTab = ave.ViewerSettingTab.Navigation;
		var table = this.tablesContainer.childNodes[1];

		if(this.is3dMode) {

			this.addLabel(navTab, "ViewCube");

			this.addCheckbox(navTab, "Show ViewCube", "Toggles availability of the ViewCube navigation control", true, function(checked) {
				viewer.displayViewCube(checked);
			}, "viewCube");

			if(!zv.isMobileDevice()) {
				this.addCheckbox(navTab, "ViewCube acts on pivot", "When enabled, the ViewCube orbits the view around the active pivot point When disabled, it orbits around the center of the view", false, function(checked) {
					viewer.setUsePivotAlways(checked);
				}, "alwaysUsePivot");
			}

			this.addLabel(navTab, "Orbit");

			this.addCheckbox(navTab, "Fusion style orbit", "Enables Fusion-style orbit overlay and gives the ability to lock orbit axis", false, function(checked) {
				if(checked)
					viewer.loadExtension('ZhiUTech.Viewing.FusionOrbit', null);
				else
					viewer.unloadExtension('ZhiUTech.Viewing.FusionOrbit', null);
			}, "fusionOrbit");

			this.addCheckbox(navTab, "Orbit past world poles", "Allows view rotation to continue past the modelâ€™s North Pole", true, function(checked) {
				viewer.setOrbitPastWorldPoles(checked);
			}, "orbitPastWorldPoles");

			if(!zv.isMobileDevice()) {
				this.addLabel(navTab, "Zoom");

				this.addCheckbox(navTab, "Zoom towards pivot", "When disabled, zooming operations are centered at the current cursor location", false, function(checked) {
					viewer.setZoomTowardsPivot(checked);
				}, "zoomTowardsPivot");

				this.addCheckbox(navTab, "Reverse mouse zoom direction", "Toggles direction of zooming in and out", false, function(checked) {
					viewer.setReverseZoomDirection(checked);
				}, "reverseMouseZoomDir");

				this.addLabel(navTab, "Mouse");

				this.addCheckbox(navTab, "Left handed mouse setup", "Swaps the buttons on the mouse", false, function(checked) {
					viewer.setUseLeftHandedInput(checked);
				}, "leftHandedMouseSetup");

				this.addCheckbox(navTab, "Set pivot with left mouse button", "Change left-click behavior to set new pivot point (overrides select object)", false, function(checked) {
					viewer.setClickToSetCOI(checked);
				}, "clickToSetCOI");
			}

			this.addCheckbox(navTab, "Open properties on select", "Always show properties upon selecting object", true, function(checked) {
				viewer.setPropertiesOnSelect(checked);
			}, "openPropertiesOnSelect");

		}
		// TODO: Remove when bimwalk becomes the default first person tool.
		if(this.is3dMode) {

			this.addLabel(navTab, "Prototypes");

			this.addCheckbox(navTab, 'New First Person Tool', "Enable new walkthrough mode.", viewer.prefs.get('useFirstPersonPrototype'), function(checked) {
				if(checked) {
					viewer.unloadExtension('ZhiUTech.FirstPerson', viewer.config);
					viewer.loadExtension('ZhiUTech.BimWalk', viewer.config);
				} else {
					viewer.unloadExtension('ZhiUTech.BimWalk', viewer.config);
					viewer.loadExtension('ZhiUTech.FirstPerson', viewer.config);
				}
			}, 'useFirstPersonPrototype');
		}

		if(!this.is3dMode) {

			this.addLabel(navTab, "Zoom");

			this.addCheckbox(navTab, "Reverse mouse zoom direction", "Toggles direction of zooming in and out", false, function(checked) {
				viewer.setReverseZoomDirection(checked);
			}, "reverseMouseZoomDir");

			this.addLabel(navTab, "Mouse");

			this.addCheckbox(navTab, "Open properties on select", "Always show properties upon selecting object", true, function(checked) {
				viewer.setPropertiesOnSelect(checked);
			}, "openPropertiesOnSelect");

			this.addCheckbox(navTab, "Left handed mouse setup", "Swaps the buttons on the mouse", false, function(checked) {
				viewer.setUseLeftHandedInput(checked);
			}, "leftHandedMouseSetup");

		}
	};

	/** Populates the performance tab with the appropriate checkboxes.
	 *
	 */
	ViewerSettingsPanel.prototype.createPerformancePanel = function() {
		var viewer = this.viewer;
		var perfTab = ave.ViewerSettingTab.Performance;
		var table = this.tablesContainer.childNodes[0];

		if(this.is3dMode) {

			this.addLabel(perfTab, "Performance Optimization");

			this.optimizeNavigationhkBoxId = this.addCheckbox(perfTab, "Smooth navigation", "Provides faster response(but degrades quality) while navigating",
				zv.isMobileDevice(),
				function(checked) {
					viewer.setOptimizeNavigation(checked);
				}, "optimizeNavigation");

			this.progressiveRenderChkBoxId = this.addCheckbox(perfTab, "Progressive display", "Shows incremental updates of the view and allows for more responsive interaction with the model (some elements may flicker) This improves perceived waiting time",
				true,
				function(checked) {
					viewer.setProgressiveRendering(checked);
				}, "progressiveRendering");

			this.addLabel(perfTab, "Display");

			this.ghosthiddenChkBoxId = this.addCheckbox(perfTab, "Ghost hidden objects", "Leave hidden objects slightly visible",
				true,
				function(checked) {
					viewer.setGhosting(checked);
				}, "ghosting");

			this.displayLinesId = this.addCheckbox(perfTab, "Display Lines", "Toggles display of line objects", true, function(checked) {
				viewer.hideLines(!checked);
			}, "lineRendering");

			this.displayPointsId = this.addCheckbox(perfTab, "Display Points", "Toggles display of point objects", true, function(checked) {
				viewer.hidePoints(!checked);
			}, "pointRendering");

			this.displayEdgesId = this.addCheckbox(perfTab, "Display edges", "Shows outline of model surfaces", false, function(checked) {
				viewer.setDisplayEdges(checked);
			}, "edgeRendering");

		}
		if(!this.is3dMode) {
			// 2D only

			this.addLabel(perfTab, "Performance Optimization");

			this.progressiveRenderChkBoxId = this.addCheckbox(perfTab, "Progressive display", "Shows incremental updates of the view and allows for more responsive interaction with the model (some elements may flicker) This improves perceived waiting time",
				true,
				function(checked) {
					viewer.setProgressiveRendering(checked);
				}, "progressiveRendering");

		}
	};
	/**
	 * Populates the appearance tab with the appropriate checkboxes.
	 */

	ViewerSettingsPanel.prototype.createAppearancePanel = function() {
		var viewer = this.viewer;
		var appearTab = ave.ViewerSettingTab.Appearance;
		var table = this.tablesContainer.childNodes[2];

		if(this.is3dMode) {

			this.addLabel(appearTab, "Visual Quality Optimization");

			this.antialiasingChkBoxId = this.addCheckbox(appearTab, "Anti-aliasing", "Remove jagged edges from lines", true, function(checked) {
				viewer.setQualityLevel(viewer.prefs.ambientShadows, checked);
			}, "antialiasing");

			this.ambientshadowsChkBoxId = this.addCheckbox(appearTab, "Ambient shadows", "Improve shading of occluded surfaces", true, function(checked) {
				viewer.setQualityLevel(checked, viewer.prefs.antialiasing);
			}, "ambientShadows");

			this.groundShadowChkBoxId = this.addCheckbox(appearTab, "Ground shadow", "Add simulated ground surface shadows", true, function(checked) {
				viewer.setGroundShadow(checked);
			}, "groundShadow");

			this.groundReflectionChkBoxId = this.addCheckbox(appearTab, "Ground reflection", "Add simulated ground surface reflections", false, function(checked) {
				viewer.setGroundReflection(checked);
			}, "groundReflection");
		}

		if(!this.is3dMode) {

			this.addLabel(appearTab, "Existing behavior");

			this.swapBlackAndWhiteChkBoxId = this.addCheckbox(appearTab, "2D Sheet Color", "Switch sheet color white to black", true, function(checked) {
				viewer.setSwapBlackAndWhite(checked);
			}, "swapBlackAndWhite");
		}
	};

	ViewerSettingsPanel.prototype.createEnvironmentPanel = function() {
		var viewer = this.viewer;
		var environmentTab = ave.ViewerSettingTab.Environment;
		var table = this.tablesContainer.childNodes[3];

		if(this.is3dMode) {

			this.addLabel(environmentTab, "Environment");

			this.envMapBackgroundChkBoxId = this.addCheckbox(environmentTab, "Environment Image Visible", "Shows lighting environment as background", true, function(checked) {
				viewer.setEnvMapBackground(checked);
				if(checked) {
					this.envSelect.classList.add("with-environment");
				} else {
					this.envSelect.classList.remove("with-environment");
				}

			}.bind(this), "envMapBackground");

			var captionRow = table.tBodies[0].insertRow(-1);

			var cell = captionRow.insertCell(0);
			this.caption = document.createElement("div");
			this.caption.setAttribute("data-i18n", "Environments and Lighting Selection");
			this.caption.textContent = zv.i18n.translate("Environments and Lighting Selection");
			this.caption.classList.add("settings-row-title");
			cell.appendChild(this.caption);
			cell.colSpan = "3";

			//========================================================================

			var env_list = [];
			for(var i = 0; i < zvp.LightPresets.length; i++) {
				env_list.push(zvp.LightPresets[i].name);
			}

			var envtab = true;
			this.envSelect = this.addGrid(
				"Environments and Lighting Selection",
				table,
				env_list,
				viewer.impl.currentLightPreset(),
				envtab,
				function onChange(index) {
					viewer.setLightPreset(index);
				},
				"lightPreset"
			);
		}
	};

	ViewerSettingsPanel.prototype.restoreDefaultSettings = function() {
		var viewer = this.viewer;

		this.restoreDiv = document.createElement('div');
		this.restoreDiv.classList.add('docking-panel-container-solid-color-b');
		this.restoreDiv.classList.add('restore-defaults-container');

		this.restoreButton = document.createElement('div');
		this.restoreButton.className = 'docking-panel-tertiary-button';
		this.restoreButton.setAttribute("data-i18n", "Restore all default settings");
		this.restoreButton.textContent = ZhiUTech.Viewing.i18n.translate("Restore all default settings");
		this.restoreDiv.appendChild(this.restoreButton);

		this.addEventListener(this.restoreDiv, 'touchstart', zv.touchStartToClick);
		this.addEventListener(this.restoreDiv, 'click', function() {
			viewer.dispatchEvent({
				type: zv.RESTORE_DEFAULT_SETTINGS_EVENT
			});
		}, false);

		this.scrollContainer.appendChild(this.restoreDiv);
	};

	/**
	 * Updates the values in the checkboxes based on what is in the prefs.
	 */
	ViewerSettingsPanel.prototype.syncUI = function() {

		var viewer = this.viewer;

		var antialiasingControl = this.getControl(this.antialiasingChkBoxId);
		if(antialiasingControl) {
			antialiasingControl.setValue(viewer.prefs.antialiasing);
		}

		var ambientshadowsgControl = this.getControl(this.ambientshadowsChkBoxId);
		if(ambientshadowsgControl) {
			ambientshadowsgControl.setValue(viewer.prefs.ambientShadows);
		}

		var groundShadowControl = this.getControl(this.groundShadowChkBoxId);
		if(groundShadowControl) {
			groundShadowControl.setValue(viewer.prefs.groundShadow);
		}

		var groundReflectionControl = this.getControl(this.groundReflectionChkBoxId);
		if(groundReflectionControl) {
			groundReflectionControl.setValue(viewer.prefs.groundReflection);
		}

		var envMapBackgroundControl = this.getControl(this.envMapBackgroundChkBoxId);
		if(envMapBackgroundControl) {
			envMapBackgroundControl.setValue(viewer.impl.isEnvMapBackground());
		}

		var progressiveRenderControl = this.getControl(this.progressiveRenderChkBoxId);
		if(progressiveRenderControl) {
			progressiveRenderControl.setValue(viewer.prefs.progressiveRendering);
		}

		var swapBlackAndWhiteControl = this.getControl(this.swapBlackAndWhiteChkBoxId);
		if(swapBlackAndWhiteControl) {
			swapBlackAndWhiteControl.setValue(viewer.prefs.swapBlackAndWhite);
		}

		var ghosthiddenControl = this.getControl(this.ghosthiddenChkBoxId);
		if(ghosthiddenControl) {
			ghosthiddenControl.setValue(viewer.prefs.ghosting);
		}
		if(this.is3dMode) {

			var lineRendering = this.getControl(this.displayLinesId);
			if(lineRendering) {
				lineRendering.setValue(viewer.prefs.lineRendering);
			}
			var pointRendering = this.getControl(this.displayPointsId);
			if(pointRendering) {
				pointRendering.setValue(viewer.prefs.pointRendering);
			}
			var edgeRendering = this.getControl(this.displayEdgesId);
			if(edgeRendering) {
				edgeRendering.setValue(viewer.prefs.edgeRendering);
			}
		}

	};

	ave.ViewerSettingsPanel = ViewerSettingsPanel;

})();;