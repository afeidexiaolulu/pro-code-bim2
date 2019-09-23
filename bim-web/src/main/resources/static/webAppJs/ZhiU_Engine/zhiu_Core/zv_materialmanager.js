
(function() {

	"use strict";

	var zv = ZhiUTech.Viewing,
		zvp = zv.Private;

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//====================================================================================================
	//
	//
	// DO NOT ADD STUFF TO THIS CLASS. IT WILL GO AWAY.
	//非专业人士不要修改下面的内容
	//
	//====================================================================================================
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	/** @constructor */
	function MaterialManager(renderer) {
		WGS.MaterialManager.call(this, renderer);

		var _super = WGS.MaterialManager.prototype;
		var _2dSelectionColor = new THREE.Color("#0000FF");

		var setColor = function(value, color) {
			value.x = color.r;
			value.y = color.g;
			value.z = color.b;
			value.w = 1;
		};

		this.create2DMaterial = function(model, material, isIdMaterial, selectionTexture, onReady) {
			var esd = model ? model.getData() : null;

			//Create a hash string of the material to see if we have
			//already created it
			var name = "__lineMaterial__";
			if(material.image)
				name += "|image:" + material.image.name;
			if(material.clip)
				name += "|clip:" + JSON.stringify(material.clip);
			if(isIdMaterial)
				name += "|id";
			if(selectionTexture)
				name += "|selection";
			if(material.skipEllipticals)
				name += "|skipEllipticals";
			if(material.skipCircles)
				name += "|skipCircles";
			if(material.skipTriangleGeoms)
				name += "|skipTriangleGeoms";
			if(material.useInstancing)
				name += "|useInstancing";

			var hash = this._getMaterialHash(model, name);

			if(!this._materials.hasOwnProperty(hash)) {
				var zvs = zv.Shaders;
				var lineMaterial = zvs.createShaderMaterial(zvs.LineShader);
				lineMaterial.is2d = true;
				lineMaterial.transparent = true;
				lineMaterial.depthWrite = false;
				lineMaterial.depthTest = false;
				lineMaterial.side = THREE.DoubleSide;
				lineMaterial.blending = THREE.NormalBlending;

				if(isIdMaterial) {
					//Is the caller requesting the special case of
					//shader that outputs just IDs (needed when MRT not available)?
					lineMaterial.defines["ID_COLOR"] = 1;
					lineMaterial.blending = THREE.NoBlending;
				} else if(selectionTexture) {
					lineMaterial.uniforms["tSelectionTexture"].value = selectionTexture;
					lineMaterial.uniforms["vSelTexSize"].value.set(selectionTexture.image.width, selectionTexture.image.height);
					lineMaterial.defines["SELECTION_RENDERER"] = 1;
					lineMaterial.uniforms["selectionColor"].value = new THREE.Vector4(0, 0, 1, 1);
				} else {
					setColor(lineMaterial.uniforms.selectionColor.value, _2dSelectionColor);
					if(renderer && renderer.supportsMRT()) {
						//If the renderer can do MRT, enable it in the shader
						//so we don't have to draw the ID buffer separately.
						lineMaterial.mrtIdBuffer = this._mrtIdBuffer;
					}
				}

				if(!material.skipEllipticals) {
					lineMaterial.defines["HAS_ELLIPTICALS"] = 1;
				}

				if(!material.skipCircles) {
					lineMaterial.defines["HAS_CIRCLES"] = 1;
				}

				if(!material.skipTriangleGeoms) {
					lineMaterial.defines["HAS_TRIANGLE_GEOMS"] = 1;
				}

				if(material.useInstancing) {
					lineMaterial.defines["USE_INSTANCING"] = 1;
				}

				if(material.image) {

					var onTexLoad = function(texture) {

						texture.wrapS = THREE.ClampToEdgeWrapping;
						texture.wrapT = THREE.ClampToEdgeWrapping;
						texture.minFilter = THREE.LinearMipMapLinearFilter;
						texture.magFilter = THREE.LinearFilter;
						texture.anisotropy = 1; // renderer.getMaxAnisotropy();
						texture.flipY = true;
						texture.generateMipmaps = true;

						texture.needsUpdate = true;

						lineMaterial.defines["HAS_RASTER_QUADS"] = 1;
						lineMaterial.uniforms["tRaster"].value = texture;
						if(material.image.dataURI.indexOf("png") !== -1)
							lineMaterial.transparent = true;
						lineMaterial.needsUpdate = true;
						if(onReady) {
							onReady(texture);
						}
					};

					WGS.TextureLoader.loadTextureWithSecurity(material.image.dataURI, false, THREE.UVMapping, onTexLoad, esd.acmSessionId, zvp.initLoadContext);
				}

				lineMaterial.modelScale = material.modelScale || 1;

				_super.addLineMaterial.call(this, hash, lineMaterial);
			}

			return name;
		};

		this.set2dSelectionColor = function(color) {
			_2dSelectionColor = new THREE.Color(color);
			this.forEach(function(material) {
				if(material.is2d && material.uniforms) {
					var selectionColor = material.uniforms.selectionColor;
					if(selectionColor) {
						setColor(selectionColor.value, _2dSelectionColor);
						material.needsUpdate = true;
					}
				}
			});
		};

		//this.initLineStyleTexture();

	}

	// Helper function that postpones the setup of MaterialManager's prototype chain
	// (because it depends on WGS.MaterialManager which is loaded as a dependency).
	function createMaterialManager(renderer) {
		if(!zvp.hasOwnProperty('MaterialManager')) {
			MaterialManager.prototype = new WGS.MaterialManager(renderer);
			MaterialManager.prototype.constructor = MaterialManager;
			zvp.MaterialManager = MaterialManager;
		}
		return new zvp.MaterialManager(renderer);
	}

	ZhiUTech.Viewing.Private.createMaterialManager = createMaterialManager;

})();;