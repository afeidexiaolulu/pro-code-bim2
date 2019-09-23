
/*这里可以修改了，下面是动画方面的内容
 * 
 * 
 * 
 * 
 * */
(function() {

	"use strict";

	var zvp = ZhiUTech.Viewing.Private;

	var INTERPOLATION_TYPE = {
		LINEAR: 0,
		CATMULLROM: 1,
		CATMULLROM_FORWARD: 2
	};

	var AnimationHandler = function() {
		this.animations = [];
	};

	AnimationHandler.prototype.init = function(data) {
		// return same data if initialized
		if(data.initialized === true) return data;

		// loop through all keys
		for(var h = 0; h < data.hierarchy.length; h++) {
			for(var k = 0; k < data.hierarchy[h].keys.length; k++) {
				// remove minus times
				if(data.hierarchy[h].keys[k].time < 0) {
					data.hierarchy[h].keys[k].time = 0;
				}

				// create quaternions
				if(data.hierarchy[h].keys[k].rot !== undefined &&
					!(data.hierarchy[h].keys[k].rot instanceof THREE.Quaternion)) {
					var quat = data.hierarchy[h].keys[k].rot;
					if(!Array.isArray(quat)) {
						quat = [quat._x, quat._y, quat._z, quat._w];
					}
					data.hierarchy[h].keys[k].rot = new THREE.Quaternion().fromArray(quat);
				}
			}

			// remove all keys with same time
			for(var k = 1; k < data.hierarchy[h].keys.length; k++) {
				if(data.hierarchy[h].keys[k].time === data.hierarchy[h].keys[k - 1].time) {
					data.hierarchy[h].keys.splice(k, 1);
					k--;
				}
			}

			// set index
			for(var k = 0; k < data.hierarchy[h].keys.length; k++) {
				data.hierarchy[h].keys[k].index = k;
			}
		}
		data.initialized = true;
		return data;
	};

	AnimationHandler.prototype.parse = function(root) {
		function parseRecurseHierarchy(root, hierarchy) {
			hierarchy.push(root);

			// check Object3D.children if not defined
			// do not animate camera's light node
			if(root.children && !(root instanceof THREE.Camera)) {
				for(var c = 0; c < root.children.length; c++)
					parseRecurseHierarchy(root.children[c], hierarchy);
			}
		}
		var hierarchy = [];
		parseRecurseHierarchy(root, hierarchy);
		return hierarchy;
	};

	AnimationHandler.prototype.play = function(animation) {
		if(this.animations.indexOf(animation) === -1) {
			this.animations.push(animation);
		}
	};

	AnimationHandler.prototype.stop = function(animation) {
		var index = this.animations.indexOf(animation);
		if(index !== -1) {
			this.animations.splice(index, 1);
		}
	};

	AnimationHandler.prototype.update = function(deltaTimeMS) {
		for(var i = 0; i < this.animations.length; i++) {
			this.animations[i].update(deltaTimeMS);
		}
	};

	var Animation = function(root, data, animator) {
		this.root = root;
		this.handler = animator.animationHandler;
		this.data = this.handler.init(data);
		this.hierarchy = this.handler.parse(root);
		this.viewer = animator.viewer;
		this.animator = animator;

		this.currentTime = 0;
		this.timeScale = 1;

		this.isPlaying = false;
		this.isPaused = true;
		this.loop = false;
		this.delta = 0.5;

		this.interpolationType = INTERPOLATION_TYPE.LINEAR;

		this.setStartAndEndKeyTime();
	};

	Animation.prototype.setStartAndEndKeyTime = function() {
		if(this.data.hierarchy.length > 0) {
			// root of hierarchy should have key time covering animation
			var keys = this.data.hierarchy[0].keys;
			this.startKeyTime = keys[0].time;
			this.endKeyTime = keys[keys.length - 1].time;
		} else {
			this.startKeyTime = this.endKeyTime = 0;
		}
	};

	Animation.prototype.keyTypes = [];
	Animation.prototype.defaultKey = {};

	Animation.prototype.play = function(startTime) {
		this.currentTime = startTime !== undefined ? startTime : 0;
		this.isPlaying = true;
		this.isPaused = false;
		this.reset();
		this.handler.play(this);
	};

	Animation.prototype.pause = function() {
		if(this.isPaused === true) {
			this.handler.play(this);
		} else {
			this.handler.stop(this);
		}
		this.isPaused = !this.isPaused;
	};

	Animation.prototype.stop = function() {
		this.isPlaying = false;
		this.isPaused = false;
		this.handler.stop(this);
	};

	Animation.prototype.goto = function(time) {
		if(!this.isPlaying) this.play();
		if(!this.isPaused) this.pause();
		var delta = time - this.currentTime;
		this.update(delta);
	};

	Animation.prototype.reset = function() {
		for(var h = 0, hl = this.hierarchy.length; h < hl; h++) {
			var object = this.hierarchy[h];

			if(object.animationCache === undefined) {
				object.animationCache = {};
			}

			if(object.animationCache[this.data.name] === undefined) {
				object.animationCache[this.data.name] = {
					prevKey: this.defaultKey,
					nextKey: this.defaultKey,
					originalMatrix: object.matrix
				};
			}

			// get keys to match our current time
			var animationCache = object.animationCache[this.data.name];
			for(var t = 0; t < this.keyTypes.length; t++) {
				var type = this.keyTypes[t];
				var prevKey = this.data.hierarchy[h].keys[0];
				var nextKey = this.getNextKeyWith(type, h, 1);
				while(nextKey.time < this.currentTime && nextKey.index > prevKey.index) {
					prevKey = nextKey;
					nextKey = this.getNextKeyWith(type, h, nextKey.index + 1);
				}
				animationCache.prevKey[type] = prevKey;
				animationCache.nextKey[type] = nextKey;
			}
		}

		this.setStartAndEndKeyTime();
	};

	Animation.prototype.getNextKeyWith = function(type, h, key) {
		var keys = this.data.hierarchy[h].keys;
		if(this.interpolationType === INTERPOLATION_TYPE.CATMULLROM ||
			this.interpolationType === INTERPOLATION_TYPE.CATMULLROM_FORWARD) {
			key = key < keys.length - 1 ? key : keys.length - 1;
		} else {
			key = key % keys.length;
		}

		for(; key < keys.length; key++) {
			if(keys[key][type] !== undefined) {
				return keys[key];
			}
		}
		return this.data.hierarchy[h].keys[0];
	};

	Animation.prototype.getPrevKeyWith = function(type, h, key) {
		var keys = this.data.hierarchy[h].keys;
		if(this.interpolationType === INTERPOLATION_TYPE.CATMULLROM ||
			this.interpolationType === INTERPOLATION_TYPE.CATMULLROM_FORWARD) {
			key = key > 0 ? key : 0;
		} else {
			key = key >= 0 ? key : key + keys.length;
		}

		for(; key >= 0; key--) {
			if(keys[key][type] !== undefined) {
				return keys[key];
			}
		}
		return this.data.hierarchy[h].keys[keys.length - 1];
	};

	Animation.prototype.isPlayingOutOfRange = function() {
		return(this.isPaused === false && (this.currentTime < this.startKeyTime - this.delta ||
			this.currentTime > this.endKeyTime + this.delta))
	};

	Animation.prototype.resetIfLooped = function() {
		if(this.loop === true && this.currentTime > this.endKeyTime) {
			this.currentTime %= this.endKeyTime;
			this.reset();
		}
	};

	var MeshAnimation = function(root, data, animator) {
		Animation.call(this, root, data, animator);
		//this.originalMatrix = root.matrix.clone();
		this.localMatrix = new THREE.Matrix4();

		this.root.getAnimTransform();
		this.relativeTransform = (data.custom && data.custom.transform && data.custom.transform === "abs") ? false : true;

		/*
		if (this.relativeTransform) {
		    //this.root.updateMatrixWorld();
		} else {
		    
		}
		*/
	};

	MeshAnimation.prototype = Object.create(Animation.prototype);
	MeshAnimation.prototype.constructor = MeshAnimation;
	MeshAnimation.prototype.keyTypes = ["pos", "rot", "scl"];
	MeshAnimation.prototype.defaultKey = {
		pos: 0,
		rot: 0,
		scl: 0
	};

	MeshAnimation.prototype.update = (function() {
		var points = [];
		var target;
		var newVector;
		var newQuat;
		var tmpMatrix1;
		var tmpMatrix2;

		function init_three() {
			if(target)
				return;

			target = new THREE.Vector3();
			newVector = new THREE.Vector3();
			newQuat = new THREE.Quaternion();
			tmpMatrix1 = new THREE.Matrix4();
			tmpMatrix2 = new THREE.Matrix4();
		}

		return function(delta) {
			if(this.isPlaying === false) return;

			this.currentTime += delta * this.timeScale;

			init_three();

			this.resetIfLooped();

			// bail out if out of range when playing
			if(this.isPlayingOutOfRange()) return;

			for(var h = 0, hl = this.hierarchy.length; h < hl; h++) {
				var object = this.hierarchy[h];
				var animationCache = object.animationCache[this.data.name];

				// loop through keys
				for(var t = 0; t < this.keyTypes.length; t++) {
					var type = this.keyTypes[t];
					var prevKey = animationCache.prevKey[type];
					var nextKey = animationCache.nextKey[type];

					if(nextKey.time <= this.currentTime || prevKey.time >= this.currentTime) {
						prevKey = this.data.hierarchy[h].keys[0];
						nextKey = this.getNextKeyWith(type, h, 1);

						while(nextKey.time < this.currentTime && nextKey.index > prevKey.index) {
							prevKey = nextKey;
							nextKey = this.getNextKeyWith(type, h, nextKey.index + 1);
						}
						animationCache.prevKey[type] = prevKey;
						animationCache.nextKey[type] = nextKey;
					}

					var prevXYZ = prevKey[type];
					var nextXYZ = nextKey[type];

					// skip if no key or no change in key values
					if(nextKey.time === prevKey.time || prevXYZ === undefined || nextXYZ === undefined) continue;

					var scale = (this.currentTime - prevKey.time) / (nextKey.time - prevKey.time);
					if(scale < 0) scale = 0;
					if(scale > 1) scale = 1;

					// interpolate
					if(type === "pos") {
						if(this.interpolationType === INTERPOLATION_TYPE.LINEAR) {
							newVector.x = prevXYZ[0] + (nextXYZ[0] - prevXYZ[0]) * scale;
							newVector.y = prevXYZ[1] + (nextXYZ[1] - prevXYZ[1]) * scale;
							newVector.z = prevXYZ[2] + (nextXYZ[2] - prevXYZ[2]) * scale;
							object.position.copy(newVector);
						} else
						/*if (this.interpolationType === INTERPOLATION_TYPE.CATMULLROM ||
						                       this.interpolationType === INTERPOLATION_TYPE.CATMULLROM_FORWARD)*/
						{
							points[0] = this.getPrevKeyWith("pos", h, prevKey.index - 1)["pos"];
							points[1] = prevXYZ;
							points[2] = nextXYZ;
							points[3] = this.getNextKeyWith("pos", h, nextKey.index + 1)["pos"];

							scale = scale * 0.33 + 0.33;

							var currentPoint = interpolateCatmullRom(points, scale);
							newVector.x = currentPoint[0];
							newVector.y = currentPoint[1];
							newVector.z = currentPoint[2];
							object.position.copy(newVector);

							if(this.interpolationType === INTERPOLATION_TYPE.CATMULLROM_FORWARD) {
								var forwardPoint = interpolateCatmullRom(points, scale * 1.01);

								target.set(forwardPoint[0], forwardPoint[1], forwardPoint[2]);
								target.sub(vector);
								target.y = 0;
								target.normalize();

								var angle = Math.atan2(target.x, target.z);
								object.rotation.set(0, angle, 0);
							}
						}
					} else if(type === "rot") {
						THREE.Quaternion.slerp(prevXYZ, nextXYZ, newQuat, scale);
						object.quaternion.copy(newQuat);
					} else if(type === "scl") {
						newVector.x = prevXYZ[0] + (nextXYZ[0] - prevXYZ[0]) * scale;
						newVector.y = prevXYZ[1] + (nextXYZ[1] - prevXYZ[1]) * scale;
						newVector.z = prevXYZ[2] + (nextXYZ[2] - prevXYZ[2]) * scale;
						object.scale.copy(newVector);
					}
				}

				// Note that object is expected to be a FragmentPointer here, not THREE.Object3D.

				if(!this.relativeTransform) {
					// Animation matrices in FragmentList are always applied after the world matrix.
					// If we right-multiply the worldMatrix inverse, we revert the original world matrix.

					// get anim matrix
					var animMatrix = tmpMatrix1.compose(object.position, object.quaternion, object.scale);

					// get inverse of world matrix
					var worldInv = tmpMatrix2;
					object.getOriginalWorldMatrix(worldInv);
					worldInv.getInverse(worldInv);

					// compute final anim matrix in a way that we first revert the world matrix,
					// then apply the absolute anim matrix
					var finalAnimMatrix = tmpMatrix1.multiplyMatrices(animMatrix, worldInv);

					// write back to the object
					finalAnimMatrix.decompose(object.position, object.quaternion, object.scale);
				}

				// compose local transform and multiply to original transform
				object.updateAnimTransform();

				// update world matrix so scene bounds can be set correctly
				//object.updateMatrixWorld();
			}
		};
	})();

	var CameraAnimation = function(root, data, animator) {
		Animation.call(this, root, data, animator);
	};

	CameraAnimation.prototype = Object.create(Animation.prototype);
	CameraAnimation.prototype.constructor = CameraAnimation;
	CameraAnimation.prototype.keyTypes = ["pos", "up", "target", "fov", "perspective"];
	CameraAnimation.prototype.defaultKey = {
		pos: 0,
		up: 0,
		target: 0,
		fov: 0,
		perspective: 0
	};

	CameraAnimation.prototype.update = (function() {
		var points = [];

		var target;
		var newVector;

		function init_three() {
			if(target)
				return;
			target = new THREE.Vector3();
			newVector = new THREE.Vector3();
		}

		return function(delta) {
			if(this.isPlaying === false) return;

			this.currentTime += delta * this.timeScale;

			init_three();

			this.resetIfLooped();

			// bail out if out of range when playing
			if(this.isPlayingOutOfRange()) return;

			for(var h = 0, hl = this.hierarchy.length; h < hl; h++) {
				var object = this.hierarchy[h];
				var animationCache = object.animationCache[this.data.name];

				// loop through keys
				for(var t = 0; t < this.keyTypes.length; t++) {
					var type = this.keyTypes[t];
					var prevKey = animationCache.prevKey[type];
					var nextKey = animationCache.nextKey[type];

					if(nextKey.time <= this.currentTime || prevKey.time >= this.currentTime) {
						prevKey = this.data.hierarchy[h].keys[0];
						nextKey = this.getNextKeyWith(type, h, 1);

						while(nextKey.time < this.currentTime && nextKey.index > prevKey.index) {
							prevKey = nextKey;
							nextKey = this.getNextKeyWith(type, h, nextKey.index + 1);
						}
						animationCache.prevKey[type] = prevKey;
						animationCache.nextKey[type] = nextKey;
					}

					var prevXYZ = prevKey[type];
					var nextXYZ = nextKey[type];

					// skip if no key or no change in key values
					if(nextKey.time === prevKey.time || prevXYZ === undefined || nextXYZ === undefined) continue;

					var scale = (this.currentTime - prevKey.time) / (nextKey.time - prevKey.time);
					if(scale < 0) scale = 0;
					if(scale > 1) scale = 1;

					// interpolate
					var vector;
					if(type === "pos") {
						vector = object.position;
					} else if(type === "up") {
						vector = object.up;
					} else if(type === "target") {
						vector = object.target;
					} else if(type === "fov") {
						object.setFov(prevXYZ + (nextXYZ - prevXYZ) * scale);
						continue;
					} else if(type === "perspective") {
						var mode = scale > 0.5 ? nextXYZ : prevXYZ;
						if(mode)
							object.toPerspective();
						else
							object.toOrthographic();
						continue;
					}

					if(this.interpolationType === INTERPOLATION_TYPE.LINEAR) {
						newVector.x = prevXYZ[0] + (nextXYZ[0] - prevXYZ[0]) * scale;
						newVector.y = prevXYZ[1] + (nextXYZ[1] - prevXYZ[1]) * scale;
						newVector.z = prevXYZ[2] + (nextXYZ[2] - prevXYZ[2]) * scale;
						vector.copy(newVector);
					} else
					/*if (this.interpolationType === INTERPOLATION_TYPE.CATMULLROM ||
					                   this.interpolationType === INTERPOLATION_TYPE.CATMULLROM_FORWARD)*/
					{
						points[0] = this.getPrevKeyWith(type, h, prevKey.index - 1)[type];
						points[1] = prevXYZ;
						points[2] = nextXYZ;
						points[3] = this.getNextKeyWith(type, h, nextKey.index + 1)[type];

						scale = scale * 0.33 + 0.33;

						var currentPoint = interpolateCatmullRom(points, scale);
						newVector.x = currentPoint[0];
						newVector.y = currentPoint[1];
						newVector.z = currentPoint[2];
						vector.copy(newVector);

						if(this.interpolationType === INTERPOLATION_TYPE.CATMULLROM_FORWARD) {
							var forwardPoint = interpolateCatmullRom(points, scale * 1.01);

							target.set(forwardPoint[0], forwardPoint[1], forwardPoint[2]);
							target.sub(vector);
							target.y = 0;
							target.normalize();

							var angle = Math.atan2(target.x, target.z);
							object.rotation.set(0, angle, 0);
						}
					}
				}
				object.matrixAutoUpdate = true;
				object.matrixWorldNeedsUpdate = true;
			}
			object.lookAt(object.target);
			this.animator.updateFlag |= this.animator.UPDATE_CAMERA;
		};
	})();

	var VisibilityAnimation = function(root, data, nodeId, animator) {
		Animation.call(this, root, data, animator);
		this.nodeId = nodeId;
		this.epsilon = 0.1;

		//Need to clone the material as it can be shared between many objects
		//and we need to modify it for this object specifically
		this.root.setMaterial(this.viewer.matman().cloneMaterial(root.getMaterial(), animator.viewer.model));
	};

	VisibilityAnimation.prototype = Object.create(Animation.prototype);
	VisibilityAnimation.prototype.constructor = VisibilityAnimation;
	VisibilityAnimation.prototype.keyTypes = ["vis", "opa"];
	VisibilityAnimation.prototype.defaultKey = {
		viz: 1,
		opa: 1
	};

	VisibilityAnimation.prototype.update = (function() {
		return function(delta) {
			if(this.isPlaying === false) return;

			this.currentTime += delta * this.timeScale;

			this.resetIfLooped();

			// bail out if out of range when playing
			if(this.isPlayingOutOfRange()) return;

			for(var h = 0, hl = this.hierarchy.length; h < hl; h++) {
				var object = this.hierarchy[h];
				var animationCache = object.animationCache[this.data.name];

				// loop through keys
				for(var t = 0; t < this.keyTypes.length; t++) {
					var type = this.keyTypes[t];
					var prevKey = animationCache.prevKey[type];
					var nextKey = animationCache.nextKey[type];

					if(nextKey.time <= this.currentTime || prevKey.time >= this.currentTime) {
						prevKey = this.data.hierarchy[h].keys[0];
						nextKey = this.getNextKeyWith(type, h, 1);

						while(nextKey.time < this.currentTime && nextKey.index > prevKey.index) {
							prevKey = nextKey;
							nextKey = this.getNextKeyWith(type, h, nextKey.index + 1);
						}
						animationCache.prevKey[type] = prevKey;
						animationCache.nextKey[type] = nextKey;
					}

					var prevVis = prevKey[type];
					var nextVis = nextKey[type];

					// skip if no key or no change in key values
					if(nextKey.time === prevKey.time || prevVis === undefined || nextVis === undefined) continue;

					var material = object.getMaterial();

					if(type === "vis") {
						var isNextKey = Math.abs(this.currentTime - nextKey.time) < this.epsilon;
						var key = isNextKey ? nextKey : prevKey;
						var vis = isNextKey ? nextVis : prevVis;
						this.viewer.visibilityManager.setNodeOff(this.nodeId, !vis);
					} else if(type === "opa") {
						var scale = (this.currentTime - prevKey.time) / (nextKey.time - prevKey.time);
						if(scale < 0) scale = 0;
						if(scale > 1) scale = 1;
						var opacity = prevVis + (nextVis - prevVis) * scale;

						material.transparent = (opacity !== 1);
						material.opacity = opacity;
						if(opacity > 0)
							this.viewer.visibilityManager.setNodeOff(this.nodeId, false);
					}
				}
			}
		};
	})();

	var AnnotationAnimation = function(root, data, animator) {
		function createAnnotation(data, viewer, state) {
			var container = that.container = document.createElement('div');
			var name = data.name;
			container.id = name;
			container.style.cursor = "pointer";
			container.style.visibility = state;

			var text = document.createElement('div');
			text.id = name + '-txt';
			text.style.cssText = 'display: none;position: absolute;z-index: 1;';
			container.appendChild(text);

			var icon = document.createElement('img');
			var isAttached = data.custom && data.custom.att && data.custom.att === 1;
			icon.src = isAttached ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABv1BMVEUAAAAAAAAAAAAAAAABAwEAAAAAAAAjSRkAAAAFDASJqnZhg1IqTyAjSRkpTx8hRxggRRcAAAAhRRcKFwgAAACau4R9mnFmiFUhSBgbOhMZNhIAAAAECQMgQxcAAAAAAAAAAAAHDwXB2q2jw4yfvoivyJ6fuI6mv5eSr4KAoWu2trZpiV3Nzc0wVSUhRxhNT01vb28AAAAgRBcAAAAAAAAAAAAhRxgeQBYAAAAAAAAAAAAfQRbP5MC0zqCqyJKpyJJBYje3z6WxyKOFpXF9nmkrTiG+wb5xkGVcf0xYfEg1WSpNTU0hRhgfQhYfQhZVVVVAQEAXMREcOhQcHBwSJw0AAAAAAAAWLxAVLQ8AAAAAAAAfQhYIEgYAAACbvn+DsGCGsmSUunaItGXc6dStypelxY2ZvX2Ntm2JtGnS48fB17G40aWNuWucxH6ny4mUvnPF27aPuHCEsGHV5czI3Lq52KGvzJqz1JmqyJOqzY6ew4OYwHiGs2OEsWHb29vL4LvM5bnD3q2+3KWkyoaLtWuKtmfOzs7IyMi21pyawXqPuG/g4ODX68fI4rTG4LCu0ZKszJKlx4qZwHuBnXR2iXENcZskAAAAXnRSTlMAEAIBCAsF6BUn+vPu7erjsZyBEwP99/TRk3JgRUQ1IxwO/v79/Pv6+fn09PPq08q7sqWDe2xrY01AMBj+/v7+/v37+fn59fXz8u/c1cbFxLWonZiIcm1lYVdSQT8de/EoFwAAAgVJREFUOMutklVz21AQRiNFlswYs+M6DTdN0kCDZWZmuAKDZFtgiO2YYm6TlOEHV53ptGs5j93Xc+a7e3d36P/W9prdZ/PZ17aPxphz3mR0x91G07wTG8TDo5R3HLGH3S6fGPdSo8Na/to6W2HZBEqwPCNULlu1BkFdQSyKx4qxOMoyDDJSRB/HnTcqWbSbTmVS6V3E57hvXicOBZd1gmfj6Z1kPrmTjrMMfRizumDA+k3UTcRSyWg0mkzFEgLNlU3rIIJcns0KqJjJq0I+U0SqUJlZJv8JugU3J/QnHEwu6MCMqPN1pq+H3sFxCgOC7RyT48Ev6qLUL/gmeJrJ/p0DzSnyxTtAGLMbv9dohv8zSbomSqUpOxB0AdNXsUbnGEEQmJzKq3JrLgCaJAzms5LI1enfVefEamc/YzYQYFB6/1xBUsQex3E9UZHkUvO6X48PwQjLTKEjVRVFqUqd8v6naQsMUCNcL8xTrVJZluXyl1K7OW1+7sL71x15cvVH43O7UGi3mmc8lkCE0ByMbvXazwueycbHxiXPrUdv3hLDGiF8au/d4sO7Novtnj9k0BO45uRGTp98f2JlK/RqYzN8TK8bGTjZLTXgfvDp6rMNA0ZADAOWHI6VTYwE4WAZjz/s3V5yvIxADosIPlh0BNXHSdA8LFIfDgE8WDg5hmmx9h/40fgXth2SDk3yjP4AAAAASUVORK5CYII=" :
				"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABvFBMVEUAAAAAAAADAAAAAAAAAAACAAAAAAAAAAC5PznHVE8BAAAAAADbc27NXVeUDQaZDQaRBwAAAAAAAACHBgDuhoHVa2W9RD2QCAKYCAGPBgB0BQAAAAAAAACMBgAAAAADAAD2jonWb2n2jYjYbWfmeXPNzc3RYFqzODKfFA1RUVGKBgCVBwBvb2+WBwCBBgCFBgCWBwCLBgAAAAAAAACMBgCTBwByBQCTBwBbBACEBgAAAAAAAAAoAgBSBADgeHOoOzXmfnnofnjieHPGvr63t7e0tLTidW/ebmnba2XWZWDAT0qRHBfBSkRNTU2aFxGOBgBYTEsAAACNBgBAQEAAAABbBQAcHBxyBQBKBAAAAABfBAAAAAAAAAAsAgAkAgCJBgDZRT3MOTHQPDTVQjrlUkrjUEjRPjbOOjP/bGTvXFTqV0/fTETNOjL5Zl7eS0PzYFjxXlbiT0fUQTn0e3T7aGDWXFXbSEDTRj/PQTrOPjbb29vgamTxY1zoVE3STETTQjvSPzfOzs7IyMj5g3zzaWLXY13XYVrsXlbbU0zg4OD8lZD4gXq0eHXqd3HscWv2b2jrZmDQZWDdWVLkV1C5y9+5AAAAYHRSTlMAAgUBDggMEeDsIBj+8NHJxpxAEP754tDDtIFsYDkvI/78+/j08/DfycfHxbuvr5mTjYN0bWxkWVZTTDUjEfz8+/n59fT08vHw8PDw5NzV0Mq5uLWrm5iLfX1hV0g/ODZEwKduAAACAklEQVQ4y62SVXPbQBzEa1mWZYaY49ihBhtmKjMzw92JLLBsyxxT2mCZvnCVmU59VpO37Ms97G929nb+p05WXUvTE5GJ6aWuY+yFEdoVdAZd9MjCEYi5J0L3FZutSqVZdIYiPWaj/85j2yszAACGVyq7Lo+RIMZtxRaQOZaTwZZSLbrGLR2+aX54twVykpgVpRzgYbVGz5twYMPTV2ZkKZMupDOSzAiwfNazgQesDO9VASemU6lUWuQAgnyNXsEiiBlbEwE2W9CBQpbVAfRraIZoA5ZosII6EpB6MYrVpLxOQejowKsBL9UGSK+zCnnsF4omB7wkBkQHylDZ+rcDROD3hYcYQE0NHQhQ4f8uCQVG/XF9isJKLtI1TYBQQAgdPlqJzYcWMYBYd58/YJACD6UgpsTVA+51AhvKGgt9zQGN1xN4Dajs/vbtmBXf2mIP3/jGqiW9Q0nlGtn8tXBSnwGPWHYP5PcbLMs2JHFn+6p7WQ/ARTie3/rZm9+pZ+rfP/fawi8dhOFgqLlLX87dHOz/1D9ou/vsrcNiNgBrZzbf338yOXZvbDL2xm4ljCdn6j794cpswr/62p+wWy2m/042oQeMxudedK8mSdzGAy4/9vlm/STRtjGRTz9u3nnge2U3+O2h4o9GfXG7lcLKGWZY8ycduG3sQJCk0Tb+w3S0/Qemc4+eJchuZgAAAABJRU5ErkJggg==";
			icon.id = name + '-img';
			icon.style.cssText = 'display: block;position: absolute;z-index: 1;';
			container.appendChild(icon);

			viewer.api.container.appendChild(container);

			container.addEventListener('click', function() {
				text.style.display = text.style.display === 'none' ? 'block' : 'none';
			});

			var color = 0x007F00;
			var opacity = 0.6;
			var geometry = new THREE.SphereGeometry(0.01);
			var material = new THREE.MeshPhongMaterial({
				color: color,
				ambient: color,
				opacity: opacity,
				transparent: true
			});
			var mesh = new THREE.Mesh(geometry, material);
			mesh.visible = false;

			if(viewer.overlayScenes["annotation"] === undefined) {
				// add annotation to an overlay scene
				viewer.createOverlayScene("annotation");
			}
			viewer.addOverlay("annotation", mesh);

			return mesh;
		}

		var that = this;
		if(root === null) {
			root = createAnnotation(data, animator.viewer, 'hidden');
		}
		Animation.call(this, root, data, animator);
		this.id = data.name;
		this.text = "";
		this.state = 'hidden';
		this.epsilon = 0.1;

		this.viewer.api.addEventListener(ZhiUTech.Viewing.CAMERA_CHANGE_EVENT, function(evt) {
			that.updateText(root.position, that.text);
		});
	};

	AnnotationAnimation.prototype = Object.create(Animation.prototype);
	AnnotationAnimation.prototype.constructor = AnnotationAnimation;
	AnnotationAnimation.prototype.keyTypes = ["pos", "text", "vis"];
	AnnotationAnimation.prototype.defaultKey = {
		pos: 0,
		text: "",
		vis: 1
	};

	AnnotationAnimation.prototype.stop = function() {
		Animation.prototype.stop.call(this);
		this.container.parentNode.removeChild(this.container);
		this.viewer.removeOverlay("annotation", this.root);
		this.root = null;
	};

	AnnotationAnimation.prototype.updateText = function(position, text) {
		function projectToScreen(position, camera, canvas) {
			var pos = position.clone();
			var projScreenMat = new THREE.Matrix4();
			camera.updateMatrixWorld();
			camera.matrixWorldInverse.getInverse(camera.matrixWorld);
			projScreenMat.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
			pos.applyProjection(projScreenMat);

			return {
				x: (pos.x + 1) * canvas.width / 2 + canvas.offsetLeft,
				y: (-pos.y + 1) * canvas.height / 2 + canvas.offsetTop
			};
		}
		var coord = projectToScreen(position, this.viewer.camera, this.viewer.canvas);
		var element = document.getElementById(this.id + '-txt');
		if(element) {
			element.innerHTML = text;
			element.style.left = coord.x + 'px';
			element.style.top = coord.y + 'px';
			this.text = text;
		}
		element = document.getElementById(this.id + '-img');
		if(element) {
			element.style.left = coord.x + 'px';
			element.style.top = coord.y - 24 + 'px'; // adjust based on image height
		}
	};

	AnnotationAnimation.prototype.update = (function() {
		var points = [];

		var target;
		var newVector;

		function init_three() {
			if(target)
				return;
			target = new THREE.Vector3();
			newVector = new THREE.Vector3();
		}

		return function(delta) {
			if(this.isPlaying === false) return;

			this.currentTime += delta * this.timeScale;

			init_three();

			this.resetIfLooped();

			// bail out if out of range when playing
			if(this.isPlayingOutOfRange()) return;

			// restore and return if paused before start key
			if(this.isPaused && this.currentTime < this.startKeyTime) {
				var element = document.getElementById(this.id);
				if(element) element.style.visibility = this.state;
				return;
			}

			for(var h = 0, hl = this.hierarchy.length; h < hl; h++) {
				var object = this.hierarchy[h];
				var animationCache = object.animationCache[this.data.name];

				// loop through keys
				for(var t = 0; t < this.keyTypes.length; t++) {
					var type = this.keyTypes[t];
					var prevKey = animationCache.prevKey[type];
					var nextKey = animationCache.nextKey[type];

					if(nextKey.time <= this.currentTime || prevKey.time >= this.currentTime) {
						prevKey = this.data.hierarchy[h].keys[0];
						nextKey = this.getNextKeyWith(type, h, 1);

						while(nextKey.time < this.currentTime && nextKey.index > prevKey.index) {
							prevKey = nextKey;
							nextKey = this.getNextKeyWith(type, h, nextKey.index + 1);
						}
						animationCache.prevKey[type] = prevKey;
						animationCache.nextKey[type] = nextKey;
					}

					var prevXYZ = prevKey[type];
					var nextXYZ = nextKey[type];

					// skip if no key or no change in key values
					if(nextKey.time === prevKey.time || prevXYZ === undefined || nextXYZ === undefined) continue;

					var scale = (this.currentTime - prevKey.time) / (nextKey.time - prevKey.time);
					if(scale < 0) scale = 0;
					if(scale > 1) scale = 1;

					// interpolate
					if(type === "pos") {
						if(this.interpolationType === INTERPOLATION_TYPE.LINEAR) {
							newVector.x = prevXYZ[0] + (nextXYZ[0] - prevXYZ[0]) * scale;
							newVector.y = prevXYZ[1] + (nextXYZ[1] - prevXYZ[1]) * scale;
							newVector.z = prevXYZ[2] + (nextXYZ[2] - prevXYZ[2]) * scale;
							object.position.copy(newVector);
						} else if(this.interpolationType === INTERPOLATION_TYPE.CATMULLROM ||
							this.interpolationType === INTERPOLATION_TYPE.CATMULLROM_FORWARD) {
							points[0] = this.getPrevKeyWith("pos", h, prevKey.index - 1)["pos"];
							points[1] = prevXYZ;
							points[2] = nextXYZ;
							points[3] = this.getNextKeyWith("pos", h, nextKey.index + 1)["pos"];

							scale = scale * 0.33 + 0.33;

							var currentPoint = interpolateCatmullRom(points, scale);
							newVector.x = currentPoint[0];
							newVector.y = currentPoint[1];
							newVector.z = currentPoint[2];
							object.position.copy(newVector);

							if(this.interpolationType === INTERPOLATION_TYPE.CATMULLROM_FORWARD) {
								var forwardPoint = interpolateCatmullRom(points, scale * 1.01);

								target.set(forwardPoint[0], forwardPoint[1], forwardPoint[2]);
								target.sub(vector);
								target.y = 0;
								target.normalize();

								var angle = Math.atan2(target.x, target.z);
								object.rotation.set(0, angle, 0);
							}
						}

					} else if(type === "text") {
						var text = Math.abs(this.currentTime - nextKey.time) < this.epsilon ? nextXYZ : prevXYZ;
						this.updateText(object.position, text);
					} else if(type === "vis") {
						var element = document.getElementById(this.id);
						if(element) {
							var visible = Math.abs(this.currentTime - nextKey.time) < this.epsilon ? nextXYZ : prevXYZ;
							element.style.visibility = visible ? 'visible' : 'hidden';
						}
					}
				}
				object.matrixAutoUpdate = true;
				object.matrixWorldNeedsUpdate = true;
			}
		};
	})();

	var PolylineAnimation = function(root, data, animator) {
		this.viewer = animator.viewer;
		if(root === null) {
			root = this.createPolyline([]);
		}
		Animation.call(this, root, data, animator);
		this.epsilon = 0.1;
	};

	PolylineAnimation.prototype = Object.create(Animation.prototype);
	PolylineAnimation.prototype.constructor = PolylineAnimation;
	PolylineAnimation.prototype.keyTypes = ["points", "vis"];
	PolylineAnimation.prototype.defaultKey = {
		points: [],
		vis: 1
	};

	PolylineAnimation.prototype.stop = function() {
		Animation.prototype.stop.call(this);
		this.viewer.removeOverlay("polyline", this.root);
		this.root = null;
	};

	PolylineAnimation.prototype.update = (function() {
		function removePolyline(anim) {
			if(anim.root) {
				anim.viewer.removeOverlay("polyline", anim.root);
				anim.root = null;
			}
		}

		return function(delta) {
			if(this.isPlaying === false) return;

			this.currentTime += delta * this.timeScale;

			this.resetIfLooped();

			// bail out if out of range when playing
			if(this.isPlayingOutOfRange()) return;

			// restore and return if paused before start key
			if(this.isPaused && this.currentTime < this.startKeyTime) {
				removePolyline(this);
				return;
			}

			for(var h = 0, hl = this.hierarchy.length; h < hl; h++) {
				var object = this.hierarchy[h];
				var animationCache = object.animationCache[this.data.name];

				// loop thru keys
				for(var t = 0; t < this.keyTypes.length; t++) {
					var type = this.keyTypes[t];
					var prevKey = animationCache.prevKey[type];
					var nextKey = animationCache.nextKey[type];

					if(nextKey.time <= this.currentTime || prevKey.time >= this.currentTime) {
						prevKey = this.data.hierarchy[h].keys[0];
						nextKey = this.getNextKeyWith(type, h, 1);

						while(nextKey.time < this.currentTime && nextKey.index > prevKey.index) {
							prevKey = nextKey;
							nextKey = this.getNextKeyWith(type, h, nextKey.index + 1);
						}
						animationCache.prevKey[type] = prevKey;
						animationCache.nextKey[type] = nextKey;
					}

					var prevPoints = prevKey[type];
					var nextPoints = nextKey[type];

					// skip if no key or no change in key values
					if(nextKey.time === prevKey.time || prevPoints === undefined || nextPoints === undefined) continue;

					var scale = (this.currentTime - prevKey.time) / (nextKey.time - prevKey.time);
					if(scale < 0) scale = 0;
					if(scale > 1) scale = 1;

					if(type === "points") {
						// interpolate start and end points
						var points = scale < 0.5 ? prevPoints : nextPoints;
						this.viewer.removeOverlay("polyline", this.root);
						this.root = null;
						var vertices = [];
						for(var i = 0; i < points.length; i++) {
							var pt = points[i].slice();
							if(i === 0) {
								pt[0] = prevPoints[i][0] + (nextPoints[i][0] - prevPoints[i][0]) * scale;
								pt[1] = prevPoints[i][1] + (nextPoints[i][1] - prevPoints[i][1]) * scale;
								pt[2] = prevPoints[i][2] + (nextPoints[i][2] - prevPoints[i][2]) * scale;
							} else if(i === points.length - 1) {
								var p = prevPoints.length - 1;
								var n = nextPoints.length - 1;
								pt[0] = prevPoints[p][0] + (nextPoints[n][0] - prevPoints[p][0]) * scale;
								pt[1] = prevPoints[p][1] + (nextPoints[n][1] - prevPoints[p][1]) * scale;
								pt[2] = prevPoints[p][2] + (nextPoints[n][2] - prevPoints[p][2]) * scale;
							}
							var newpt = new THREE.Vector3(pt[0], pt[1], pt[2]);
							vertices.push(newpt);
						}
						this.root = this.createPolyline(vertices);
					} else if(type === "vis") {
						var vis = Math.abs(this.currentTime - nextKey.time) < this.epsilon ? nextPoints : prevPoints;
						this.root.visible = vis;
						if(!vis) removePolyline(this);
					}
				}
			}
		};
	})();

	PolylineAnimation.prototype.createPolyline = function(points) {
		var geometry = new THREE.Geometry();
		for(var i = 0; i < points.length; i++) {
			geometry.vertices.push(points[i]);
		}
		geometry.computeLineDistances();

		var material = new THREE.LineDashedMaterial({
			color: 0x0,
			dashSize: 1,
			gapSize: 0.5,
			linewidth: 1
		});
		var line = new THREE.Line(geometry, material, THREE.LineStrip);

		// add polyline to an overlay scene
		if(this.viewer.overlayScenes["polyline"] === undefined) {
			this.viewer.createOverlayScene("polyline");
		}
		this.viewer.addOverlay("polyline", line);

		return line;
	};

	// Catmull-Rom spline
	function interpolateCatmullRom(points, scale) {
		function interpolate(p0, p1, p2, p3, t, t2, t3) {
			var v0 = (p2 - p0) * 0.5,
				v1 = (p3 - p1) * 0.5;

			return(2 * (p1 - p2) + v0 + v1) * t3 + (-3 * (p1 - p2) - 2 * v0 - v1) * t2 + v0 * t + p1;
		}

		var c = [],
			v3 = [],
			point, intPoint, weight, w2, w3,
			pa, pb, pc, pd;

		point = (points.length - 1) * scale;
		intPoint = Math.floor(point);
		weight = point - intPoint;

		c[0] = intPoint === 0 ? intPoint : intPoint - 1;
		c[1] = intPoint;
		c[2] = intPoint > points.length - 2 ? intPoint : intPoint + 1;
		c[3] = intPoint > points.length - 3 ? intPoint : intPoint + 2;

		pa = points[c[0]];
		pb = points[c[1]];
		pc = points[c[2]];
		pd = points[c[3]];

		w2 = weight * weight;
		w3 = weight * w2;

		v3[0] = interpolate(pa[0], pb[0], pc[0], pd[0], weight, w2, w3);
		v3[1] = interpolate(pa[1], pb[1], pc[1], pd[1], weight, w2, w3);
		v3[2] = interpolate(pa[2], pb[2], pc[2], pd[2], weight, w2, w3);

		return v3;
	}

	zvp.Animation = Animation;
	zvp.AnimationHandler = AnimationHandler;
	zvp.MeshAnimation = MeshAnimation;
	zvp.CameraAnimation = CameraAnimation;
	zvp.PolylineAnimation = PolylineAnimation;
	zvp.VisibilityAnimation = VisibilityAnimation;
	zvp.AnnotationAnimation = AnnotationAnimation;

})();;
(function() {

	"use strict";

	var zvp = ZhiUTech.Viewing.Private;

	/**
	 *  This is the keyframe animator class that performs keyframe animation
	 *  动画关键帧部分
	 *  @constructor
	 *  @alias ZhiUTech.Viewing.Private.KeyFrameAnimator
	 *  @param {Viewer3DImpl} viewer The viewer
	 *  @param {number} duration The duration of the animation in seconds
	 */
	var KeyFrameAnimator = function(viewer, duration) {
		this.animations = [];
		this.viewer = viewer;
		this.keys = [];
		this.isPlaying = false;
		this.isPaused = true;
		this.updateFlag = 0;
		this.duration = duration;
		this.currentTime = 0;
		this.onPlayCallback = null;
		this.animationHandler = new ZhiUTech.Viewing.Private.AnimationHandler();
		this.areCameraAnimationsPaused = false;
		this.UPDATE_SCENE = 1;
		this.UPDATE_CAMERA = 2;
	};

	/**
	 * Destructor. Releasing references to other objects.
	 */
	KeyFrameAnimator.prototype.destroy = function() {
		this.stop();
		this.viewer = null;
		this.keys = null;
		this.animations = null;
		this.isPlaying = false;
		this.isPaused = false;
		this.animationHandler = null;
	};

	/**
	 * Add an animation to the keyframe animator
	 *
	 * @param {object} animation The animation object to add
	 */
	KeyFrameAnimator.prototype.add = function(animation) {
		// return if animation has no hierarchy data or less than two keys
		if(!animation.hierarchy || animation.hierarchy.length < 1 || !animation.hierarchy[0].keys ||
			animation.hierarchy[0].keys.length < 2)
			return;

		var anim = null;
		var that = this;
		if(animation.type === "camera") {
			anim = new zvp.CameraAnimation(that.viewer.camera, animation, that);
			that.animations.push(anim);
		} else if(animation.type === "annotation") {
			anim = new zvp.AnnotationAnimation(null, animation, that);
			that.animations.push(anim);
		} else if(animation.type === "polyline") {
			anim = new zvp.PolylineAnimation(null, animation, that);
			that.animations.push(anim);
		} else if(animation.type === "mesh" || animation.type === "visibility") {

			that.viewer.model.getData().instanceTree.enumNodeFragments(animation.id, function(fragId) {

				var mesh = that.viewer.getFragmentProxy(that.viewer.model, fragId);
				if(mesh) {
					// meshes of the node will share same data
					if(animation.type === "mesh")
						anim = new zvp.MeshAnimation(mesh, animation, that);
					else
						anim = new zvp.VisibilityAnimation(mesh, animation, animation.id, that);

					that.animations.push(anim);
				}

			}, true);

		}

		// sort and remove duplicates
		function sortAndRemoveDuplicateKeys(keys) {
			function removeDuplicates(a, b, c) {
				b = a.length;
				while(c = --b)
					while(c--) a[b] !== a[c] || a.splice(c, 1);
			}

			// sort keys
			keys.sort(function(a, b) {
				return a - b
			});

			// remove duplicates
			removeDuplicates(keys);
		}

		if(anim) {
			// add keys
			for(var h = 0, hl = animation.hierarchy.length; h < hl; h++) {
				var keys = animation.hierarchy[h].keys;
				for(var i = 0; i < keys.length; i++) {
					// add user defined (non extra) keys
					if(keys[i].xk === undefined)
						that.keys.push(keys[i].time);
				}
			}
			sortAndRemoveDuplicateKeys(that.keys);
		}

		this.updateFlag |= this.UPDATE_SCENE;
	};

	/**
	 * Update all animations in the keyframe animator
	 *
	 * @param {number} time The time in second to advance
	 * @return {number} 0 for no update, 1 for scene, 2 for camera, 3 for both
	 */
	KeyFrameAnimator.prototype.update = function(time) {
		this.animationHandler.update(time);
		var update = this.updateFlag;
		if(this.isPlaying && !this.isPaused) {
			this.currentTime += time;
			this.currentTime = Math.min(this.currentTime, this.duration);
			if(this.onPlayCallback) {
				// send playback percentage
				this.onPlayCallback(this.duration > 0 ? this.currentTime / this.duration * 100 : 0);
			}
			if(this.currentTime >= this.duration) {
				this.pause();
			}
			update |= this.UPDATE_SCENE;
		}
		this.updateFlag = 0;
		return update;
	};

	/**
	 * Play all animations
	 *
	 * @param {number} startTime The time in second to start
	 */
	KeyFrameAnimator.prototype.play = function(startTime, onPlayCallback) {
		this.onPlayCallback = onPlayCallback;

		// auto-rewind and play if reached the end
		if(this.currentTime >= this.duration) {
			this.goto(0);
		}

		if(this.isPlaying) {
			this.pause();
			return;
		}

		for(var i = 0; i < this.animations.length; i++) {
			var animation = this.animations[i];
			animation.play(startTime);
		}

		this.isPlaying = true;
		this.isPaused = false;
	};

	/**
	 * Pause all animations
	 *
	 */
	KeyFrameAnimator.prototype.pause = function() {
		for(var i = 0; i < this.animations.length; i++) {
			var animation = this.animations[i];
			// pause sync with same state
			if(animation.isPaused === this.isPaused) {
				animation.pause();
			}
		}

		this.isPaused = !this.isPaused;
		this.areCameraAnimationsPaused = this.isPaused;
	};

	/**
	 * Pause camera animations
	 *
	 */
	KeyFrameAnimator.prototype.pauseCameraAnimations = function() {
		for(var i = 0; i < this.animations.length; i++) {
			var animation = this.animations[i];
			if(animation instanceof ZhiUTech.Viewing.Private.CameraAnimation) {
				animation.pause();
			}
		}

		this.areCameraAnimationsPaused = !this.areCameraAnimationsPaused;
	};

	/**
	 * Stop all animations
	 *
	 */
	KeyFrameAnimator.prototype.stop = function() {
		for(var i = 0; i < this.animations.length; i++) {
			var animation = this.animations[i];
			animation.stop();
		}

		this.isPlaying = false;
		this.isPaused = false;
	};

	/**
	 * Goto specific time in the animation
	 *
	 * @param {number} time The specific time in second
	 */
	KeyFrameAnimator.prototype.goto = function(time) {
		if(time === undefined) return;
		for(var i = 0; i < this.animations.length; i++) {
			var animation = this.animations[i];
			animation.goto(time);
		}

		this.isPlaying = true;
		this.isPaused = true;
		this.currentTime = time;
		this.updateFlag |= this.UPDATE_SCENE;
	};

	/**
	 * Step forward to next key
	 *
	 */
	KeyFrameAnimator.prototype.next = function() {
		// find next key time
		function findNextKey(time, keys) {
			var key = -1;
			for(var t = 0; t < keys.length; t++) {
				if(keys[t] > time) {
					key = keys[t];
					break;
				}
			}
			return(key < 0 ? keys[keys.length - 1] : key);
		}
		var time = findNextKey(this.currentTime, this.keys);
		this.goto(time);
	};

	/**
	 * Step backward to previous key
	 *
	 */
	KeyFrameAnimator.prototype.prev = function() {
		// find previous key time
		function findPrevKey(time, keys) {
			var key = -1;
			for(var t = keys.length - 1; t > -1; t--) {
				if(keys[t] < time) {
					key = keys[t];
					break;
				}
			}
			return(key < 0 ? keys[0] : key);
		}
		var time = findPrevKey(this.currentTime, this.keys);
		this.goto(time);
	};

	zvp.KeyFrameAnimator = KeyFrameAnimator;

})();; 




