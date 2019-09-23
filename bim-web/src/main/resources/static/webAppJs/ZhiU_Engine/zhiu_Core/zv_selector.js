
(function() {

	'use strict';

	var zv = ZhiUTech.Viewing,
		zvp = zv.Private;

	/**
	 * The selector class doesn't fire any events.
	 * All events get fired by the MultiSelector class, instead.
	 * 
	 * @param {*} viewer 
	 * @param {*} model 
	 */
	function Selector(viewer, model) {

		//Selection support
		var _this = this;
		this.selectedObjectIds = {};
		this.selectionCount = 0;
		this.selectionMode = zv.SelectionMode.LEAF_OBJECT;

		var selectedParentMap = {};

		function getInstanceTree() {
			return model.getData().instanceTree;
		}

		function getFragmentMap() {
			return model.getData().instanceTree || model.getData().fragmentMap;
		}

		function unmarkObject(dbId) {

			var it = getInstanceTree();

			if(selectedParentMap[dbId] > 0) {
				selectedParentMap[dbId]--;
				if(selectedParentMap[dbId] == 0) {
					viewer.highlightObjectNode(model, dbId, false);
				}

			} else if(selectedParentMap[dbId] < 0) {
				throw("Selection State machine broken. Negatively selected object!");
			}

			if(it) {
				it.enumNodeChildren(dbId, function(childId) {
					unmarkObject(childId);
				}, false);
			}
		}

		function markObject(dbId) {

			var it = getInstanceTree();

			if(selectedParentMap[dbId]) {
				selectedParentMap[dbId]++;
			} else {
				viewer.highlightObjectNode(model, dbId, true);
				selectedParentMap[dbId] = 1;
			}

			if(it) {
				it.enumNodeChildren(dbId, function(childId) {
					markObject(childId);
				}, false);
			}
		}

		function isSelected(dbId) {

			if((dbId !== undefined) && _this.selectedObjectIds[dbId])
				return true;
		}

		function select(dbId) {

			var it = getInstanceTree();

			if(it) {
				dbId = it.findNodeForSelection(dbId, _this.selectionMode);

				if(!it.isNodeSelectable(dbId))
					return;
			}

			var found = isSelected(dbId);
			if(!found) {
				_this.selectedObjectIds[dbId] = dbId;
				_this.selectionCount++;
				markObject(dbId);
			}
		}

		function deselect(dbId) {

			var found = isSelected(dbId);
			if(found) {
				unmarkObject(dbId);
				_this.selectedObjectIds[dbId] = 0;
				_this.selectionCount--;
			}
		}

		function selectionIsEqual(dbNodeArray) {
			if(_this.selectionCount !== dbNodeArray.length)
				return false;

			for(var i = 0; i < dbNodeArray.length; i++) {
				if(!isSelected(dbNodeArray[i]))
					return false;
			}
			return true;
		}

		this.getInstanceTree = getInstanceTree;
		this.getFragmentMap = getFragmentMap;

		this.getSelectionLength = function() {
			return _this.selectionCount;
		};

		this.getSelection = function() {
			var ret = [];
			var sset = _this.selectedObjectIds;
			for(var p in sset) {
				if(sset[p]) {
					var dbId = parseInt(p);
					ret.push(dbId);
				}
			}

			return ret;
		};

		this.isSelected = function(dbId) {
			return isSelected(dbId);
		};

		this.clearSelection = function(nofire) {
			if(this.selectionCount > 0) {
				var sset = _this.selectedObjectIds;
				for(var p in sset) {
					var dbId = parseInt(p);
					if(dbId !== undefined)
						unmarkObject(dbId);
				}
				_this.selectedObjectIds = {};
				_this.selectionCount = 0;
			}
		};

		this.deselectInvisible = function() {
			var changed = false;

			var sset = _this.selectedObjectIds;
			var visMan = viewer.visibilityManager;
			for(var p in sset) {
				var dbId = parseInt(p);
				if(dbId && !visMan.isNodeVisible(model, dbId)) {
					deselect(dbId);
					changed = true;
				}
			}

			return changed;
		};

		// TODO: Optimize this so both select and toggleSelection don't have to lookup the node index.
		this.toggleSelection = function(dbId) {

			if(!dbId) {
				zvp.logger.error("Attempting to select node 0.", zv.errorCodeString(zv.ErrorCodes.VIEWER_INTERNAL_ERROR));
				return;
			}

			if(!isSelected(dbId)) {
				select(dbId);
			} else {
				deselect(dbId);
			}
		};

		this.setSelectionMode = function(mode) {
			this.clearSelection(true);
			this.selectionMode = mode;
		};

		this.setSelection = function(dbNodeArray) {

			if(selectionIsEqual(dbNodeArray))
				return;

			this.clearSelection(true);

			if(dbNodeArray == null || dbNodeArray.length === 0)
				return;

			for(var i = 0; i < dbNodeArray.length; i++) {
				select(dbNodeArray[i]);
			}
		};

		this.getSelectionBounds = function() {
			var bounds = new THREE.Box3();
			var box = new THREE.Box3();

			var fragmentMap = getFragmentMap();
			if(fragmentMap) {
				var fragList = model.getFragmentList();

				var sset = _this.selectedObjectIds;
				for(var p in sset) {
					var dbId = parseInt(p);
					fragmentMap.enumNodeFragments(dbId, function(fragId) {
						fragList.getWorldBounds(fragId, box);
						bounds.union(box);
					}, true);
				}
			}

			return bounds;
		};

		this.getSelectionVisibility = function() {
			var hasVisible = false,
				hasHidden = false;

			var sset = _this.selectedObjectIds;
			for(var p in sset) {
				var dbId = parseInt(p);
				if(dbId) {
					var map = getFragmentMap();
					if(!map || !map.isNodeHidden(dbId)) {
						hasVisible = true;
					} else {
						hasHidden = true;
					}
					if(hasVisible && hasHidden) {
						break;
					}
				}
			}

			return {
				hasVisible: hasVisible,
				hasHidden: hasHidden,
				model: model
			};
		};

		this.dtor = function() {
			this.selectedObjectIds = null;
		};

	}

	zvp.Selector = Selector;

	function MultiModelSelector(viewer) {

		var _models = [];

		this.highlightDisabled = false;
		this.highlightPaused = false;
		this.selectionDisabled = false;

		this.addModel = function(model) {
			if(_models.indexOf(model) == -1) {
				model.selector = new Selector(viewer, model);
				_models.push(model);
			}
		};

		this.removeModel = function(model) {
			var idx = _models.indexOf(model);

			// make sure that we don't keep any highlighting proxy
			var selected = model.selector.getSelection();
			model.selector.clearSelection();
			model.selector = null;
			_models.splice(idx, 1);
		};

		function warn() {
			if(_models.length > 1) {
				zvp.logger.warn("This selection call does not yet support multiple models.");
			}
		}

		function fireAggregateSelectionChangedEvent() {

			var perModel = [];

			for(var i = 0; i < _models.length; i++) {
				var dbIdArray = [];
				var fragIdsArray = [];

				var sset = _models[i].selector.selectedObjectIds;
				var map = _models[i].selector.getFragmentMap();
				for(var p in sset) {
					if(sset[p]) {
						var dbId = parseInt(p);
						if(dbId) {
							dbIdArray.push(dbId);

							if(map) {
								map.enumNodeFragments(dbId, function(fragId) {
									fragIdsArray.push(fragId);
								}, false);
							}
						}
					}
				}

				if(dbIdArray.length) {
					perModel.push({
						fragIdsArray: fragIdsArray,
						dbIdArray: dbIdArray,
						nodeArray: dbIdArray,
						model: _models[i]
					});
				}
			}

			var event;

			//For backwards compatibility, fire the old selection change event
			//when there is just one model in the scene
			if(_models.length === 1) {
				event = {
					type: zv.SELECTION_CHANGED_EVENT,
					fragIdsArray: perModel[0] ? perModel[0].fragIdsArray : [],
					dbIdArray: perModel[0] ? perModel[0].dbIdArray : [],
					nodeArray: perModel[0] ? perModel[0].dbIdArray : [],
					model: _models[0]
				};
				viewer.api.dispatchEvent(event);
			}

			//Always fire the aggregate selection changed event
			event = {
				type: zv.AGGREGATE_SELECTION_CHANGED_EVENT,
				selections: perModel
			};
			viewer.api.dispatchEvent(event);

		}

		function deselectInvisible() {

			var changed = false;

			for(var i = 0; i < _models.length; i++) {
				changed = _models[i].selector.deselectInvisible() || changed;
			}

			if(changed)
				fireAggregateSelectionChangedEvent();
		}

		this.getSelectionLength = function() {
			var total = 0;

			for(var i = 0; i < _models.length; i++) {
				total += _models[i].selector.getSelectionLength();
			}

			return total;
		};

		this.getSelection = function() {
			warn();
			if(_models.length > 1)
				zvp.logger.warn("Use getAggregateSelection instead of getSelection when there are multiple models in the scene.");
			return _models[0].selector.getSelection();
		};

		this.getAggregateSelection = function() {
			var res = [];
			for(var i = 0; i < _models.length; i++) {
				var selset = _models[i].selector.getSelection();
				if(selset && selset.length)
					res.push({
						model: _models[i],
						selection: selset
					});
			}

			return res;
		};

		this.clearSelection = function(nofire) {
			for(var i = 0; i < _models.length; i++)
				_models[i].selector.clearSelection(nofire);

			if(!nofire)
				fireAggregateSelectionChangedEvent();
		};

		this.toggleSelection = function(dbId, model) {
			if(!model) {
				warn();
				model = _models[0];
			}
			model.selector.toggleSelection(dbId);

			fireAggregateSelectionChangedEvent();
		};

		this.setSelectionMode = function(mode) {
			for(var i = 0; i < _models.length; i++)
				_models[i].selector.setSelectionMode(mode);
		};

		this.setSelection = function(dbNodeArray, model) {
			if(this.selectionDisabled) {
				return;
			}

			if(!dbNodeArray || dbNodeArray.length === 0)
				this.clearSelection(true);
			else {
				if(!model) {
					warn();
					model = _models[0];
				} else {
					for(var i = 0; i < _models.length; i++)
						if(_models[i] !== model)
							_models[i].selector.clearSelection();
				}
				model.selector.setSelection(dbNodeArray);
			}

			fireAggregateSelectionChangedEvent();
		};

		this.setAggregateSelection = function(selection) {

			if(this.selectionDisabled) {
				return;
			}

			if(!selection || selection.length === 0) {
				this.clearSelection(true);
			} else {
				for(var i = 0; i < selection.length; ++i) {
					var model = selection[i].model;
					var ids = selection[i].ids;
					model.selector.setSelection(ids);
				}
			}

			fireAggregateSelectionChangedEvent();
		};

		this.getSelectionBounds = function() {
			if(_models.length == 1)
				return _models[0].selector.getSelectionBounds();
			else {
				var bbox = new THREE.Box3();
				for(var i = 0; i < _models.length; i++) {
					var tmp = _models[i].selector.getSelectionBounds();
					bbox.union(tmp);
				}
				return bbox;
			}
		};

		this.getSelectionVisibility = function() {

			var res = {
				// Aggregated results
				hasVisible: false,
				hasHidden: false,
				// per model specifics 
				details: []
			};
			for(var i = 0; i < _models.length; i++) {
				var subRes = _models[i].selector.getSelectionVisibility();
				res.hasVisible = res.hasVisible || subRes.hasVisible;
				res.hasHidden = res.hasHidden || subRes.hasHidden;
				res.details.push(subRes);
			}
			return res;
		};

		this.dtor = function() {
			for(var i = 0; i < _models.length; i++)
				_models[i].selector.dtor();
		};

		viewer.api.addEventListener(zv.ISOLATE_EVENT, function(event) {
			deselectInvisible();
		});

		viewer.api.addEventListener(zv.HIDE_EVENT, function(event) {
			deselectInvisible();
		});

	}

	zvp.MultiModelSelector = MultiModelSelector;

})();;