import AbstractComposite from './AbstractComposite';

function Sequential(container) {

	AbstractComposite.call(this, container);

	this.layers = [];
	this.heightLightNeural = [];
	this.layerHighLighted = false;

}

Sequential.prototype = Object.assign(Object.create(AbstractComposite.prototype), {

	add: function (layer) {

		if (this.layers.length !== 0) {

			let tailLayer = this.layers[this.layers.length - 1];
			layer.setLastLayer(tailLayer);
			tailLayer.setNextLayer(layer);
		}

		layer.setEnvironment(this.scene);
		this.layers.push(layer);
		layer.assemble(this.layers.length);
	},

	init: function () {
		this.updateCamera(this.layers.length);
		this.createModel();
		this.registerModelEvent();
		this.registerSequentialEvent();
		this.animate();
	},

	// 根据配置情况创建模型
	createModel: function () {
		console.log("creating sequential model...");

		let layersPos = calculateLayersPos(this.layers.length);

		for (let i = 0; i < this.layers.length; i++) {
			this.layers[i].init(layersPos[i], i + 1);
		}

		function calculateLayersPos(depth) {

			let layersPos = [];

			let initPos;
			if (depth % 2 === 1) {
				initPos = -20 * ((depth - 1) / 2);
			} else {
				initPos = -20 * (depth / 2) + 10;
			}
			for (let i = 0; i < depth; i++) {
				layersPos.push({
					x: 0,
					y: initPos,
					z: 0
				});
				initPos += 20;
			}

			return layersPos;

		}
	},

	registerSequentialEvent: function () {

		document.addEventListener('mousemove', function (event) {
			this.onMouseMove(event);
		}.bind(this), true);

	},

	heightLightLayer: function (layerName) {

		if (this.layerHighLighted) {
			this.resetLayer();
		}

		this.layerHighLighted = true;

	},

	resetLayer: function () {

		this.layerHighLighted = false;

	},

	onMouseMove: function (event) {

		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		let model = this;
		pickNeural(model);

		function pickNeural(model) {
			model.raycaster.setFromCamera(model.mouse, model.camera);
			let intersects = model.raycaster.intersectObjects(model.scene.children, true);

			let picked = false;

			for (let i = 0; i < intersects.length; i++) {
				if (intersects !== null && intersects.length > 0 && intersects[i].object.type === "Mesh") {
					if (intersects[i].object.elementType === "neural") {

						picked = true;

						clearHighLight(model);

						let selectedNeural = intersects[i].object;

						highLight(model, selectedNeural);
					}

					break;
				}
			}

			if (!picked) {
				clearHighLight(model);
			}

			function highLight(model, selectedNeural) {

				let selectedLayer = model.layers[selectedNeural.layerIndex - 1];

				let lightLightParameters = selectedLayer.getHeightLightParameters(selectedNeural.positionIndex);

				for (let j = 0; j < lightLightParameters.heightLightList.length; j++) {

					lightLightParameters.heightLightList[j].scale.set(1.5, 1.5, 1.5);

					lightLightParameters.heightLightList[j].material.color.setHex( 0x000000 );

					model.heightLightNeural.push(lightLightParameters.heightLightList[j]);
				}

				model.line.geometry = new THREE.Geometry();
				model.line.geometry.colors = lightLightParameters.lineColors;
				model.line.geometry.vertices = lightLightParameters.lineVertices;
				model.line.material.needsUpdate = true;
				model.line.geometry.colorsNeedUpdate = true;
				model.line.geometry.verticesNeedUpdate = true;
				model.scene.add(model.line);

			}

			function clearHighLight(model) {
				if (model.heightLightNeural.length > 0) {
					for (let i = 0; i < model.heightLightNeural.length; i++) {
						model.heightLightNeural[i].scale.set(1, 1, 1);
					}
				}

				model.heightLightNeural = [];

				model.line.geometry.dispose();
				model.scene.remove(model.line);
			}
		}

	},

	flatten: function() {



	}

});

export default Sequential;