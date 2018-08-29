import { AbstractComposite } from './AbstractComposite';

function PixelSequential(container, config) {

	AbstractComposite.call(this, container);

	this.layers = [];
	this.heightLightNeural = [];
	this.layerHighLighted = false;
	this.model = undefined;
	this.loadModel = false;

	this.inputValue = undefined;

}

PixelSequential.prototype = Object.assign(Object.create(AbstractComposite.prototype), {

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

	init: function (callback) {

		if (this.hasLoader){
			let self = this;
			this.loader.load().then(function() {
				self.initVisModel();
				if (callback !== undefined) {
					callback();
				}
			});
		} else {
			this.initVisModel();
			if (callback !== undefined) {
				callback();
			}
		}
	},

	initVisModel: function() {
		this.updateCamera(this.layers.length);
		this.createModel();
		this.registerModelEvent();
		this.registerSequentialEvent();
		this.animate();

		this.isInitialized = true;
	},

	// 根据配置情况创建模型
	createModel: function () {
		console.log("creating sequential model...");

		let layersPos = calculateLayersPos(this.layers.length);

		for (let i = 0; i < this.layers.length; i++) {
			this.layers[i].init(layersPos[i]);
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

	initLayerOutputIndex: function() {

		let paddingLayerNum = 0;

		for (let i = 1; i < this.layers.length; i++) {

			if (this.layers[i].layerType === "padding2d") {
				paddingLayerNum += 1;
			} else {
				this.layers[i].resourceOutputIndex = i - 1 - paddingLayerNum;
			}

		}

	},

	initLayerOutputIndexFromName: function(outputConfig) {

		for (let i = 1; i < this.layers.length; i++) {

			let layerName = this.layers[i].name;
			this.layers[i].resourceOutputIndex = outputConfig[layerName];

		}

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

		let init = {
			angle: 0,
			interval: 0
		};
		let end = {
			angle: Math.PI / 2,
			interval: 1
		};

		let fmTween = new TWEEN.Tween(init)
			.to(end, 2000);

		let model = this;

		fmTween.onUpdate(function () {

			for (let i = 0; i < model.layers.length; i++) {
				model.layers[i].neuralGroup.rotation.x = init.angle;
				// 参数1待定，最好是可以动态调整
				model.layers[i].neuralGroup.position.y += 1 * (i - Math.floor(model.layers.length / 2));
			}

		}).onStart(function () {
			console.log("start flatten");
		});

		fmTween.start();

	},

	restoreFlatten: function() {

		let init = {
			angle: Math.PI / 2,
			interval: 1
		};
		let end = {
			angle: 0,
			interval: 0
		};

		let fmTween = new TWEEN.Tween(init)
			.to(end, 2000);

		let model = this;

		fmTween.onUpdate(function () {

			for (let i = 0; i < model.layers.length; i++) {
				model.layers[i].neuralGroup.rotation.x = init.angle;
				model.layers[i].neuralGroup.position.y -= 1 * (i - Math.floor(model.layers.length / 2));
			}

		}).onStart(function () {
			console.log("start restore flatten");
		});

		fmTween.start();

	},

	predict: function(input) {

		this.inputValue = input;

		let batchSize = [1];
		let inputShape = this.layers[0].shape;
		let predictTensorShape = batchSize.concat(inputShape);

		let predictTensor = tf.tensor(input, predictTensorShape);

		this.predictResult = this.resource.predict(predictTensor);
		this.updateLayerVis();

	},

	updateLayerVis: function() {

		this.updateInputVis();
		this.updateLayerPredictVis();
	},

	updateLayerPredictVis: function() {

		for (let i = 1; i < this.layers.length; i++){

			if (this.layers[i].layerType === "padding2d") {
				this.layers[i].updateValue();
				continue;
			}

			let resourceOutputIndex = this.layers[i].resourceOutputIndex;
			let resourceOutputValues = this.predictResult[resourceOutputIndex].dataSync();

			let layerOutputValues;
			if (this.layers[i].depth !== 1) {

				layerOutputValues = [];

				for (let j = 0; j < this.layers[i].depth; j++) {

					let referredIndex = j;

					while (referredIndex < resourceOutputValues.length) {

						layerOutputValues.push(resourceOutputValues[referredIndex]);

						referredIndex += this.layers[i].depth;
					}

				}

			} else {

				layerOutputValues = resourceOutputValues;

			}

			this.layers[i].updateValue( layerOutputValues );

		}

	},

	updateInputVis: function() {

		let inputLayer = this.layers[0];
		inputLayer.updateValue( this.inputValue );

	},

	clear: function() {
		for (let i = 0; i < this.layers.length; i++) {
			this.layers[i].clear();
		}
	}

});

export { PixelSequential };