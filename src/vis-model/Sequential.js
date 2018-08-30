import { AbstractComposite } from './AbstractComposite';
import { MapModelConfiguration } from "../configure/MapModelConfiguration";

function Sequential(container, config) {

	AbstractComposite.call(this, container);

	this.layers = [];
	this.heightLightNeural = [];
	this.layerHighLighted = false;
	this.model = undefined;
	this.loadModel = false;

	this.configuration = new MapModelConfiguration(config);

	console.log(this.configuration);

	this.inputValue = undefined;

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
		layer.assemble(this.layers.length, this.configuration);

	},

	init: function (callback) {
		console.log("init prime sequential model");

		if (this.hasLoader) {
			let self = this;
			this.loader.load().then(function () {
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

	registerSequentialEvent: function () {

		document.addEventListener('mousemove', function (event) {
			this.onMouseMove(event);
		}.bind(this), true);

		document.addEventListener('click', function (event) {
			this.onClick(event);
		}.bind(this), true);

	},

	onMouseMove: function (event) {

		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	},

	onClick: function (event) {

		let model = this;

		model.raycaster.setFromCamera(model.mouse, model.camera);
		let intersects = model.raycaster.intersectObjects(model.scene.children, true);

		for (let i = 0; i < intersects.length; i++) {
			if (intersects !== null && intersects.length > 0 && intersects[i].object.type === "Mesh") {

				let selectedElement = intersects[i].object;

				if (selectedElement.elementType === "placeholder") {

					let selectLayer = this.layers[selectedElement.layerIndex - 1];

					selectLayer.openLayer();

					break;

				}

				if (selectedElement.elementType === "closeButton") {

					let selectedLayer = this.layers[selectedElement.layerIndex - 1];

					selectedLayer.closeLayer();

					break;
				}
			}

		}
	},

	initVisModel: function () {

		this.updateCamera(this.layers.length);
		this.createModel();
		this.registerModelEvent();
		this.registerSequentialEvent();
		this.animate();

		this.isInitialized = true;

	},

	createModel: function () {

		console.log("creating prime sequential model...");

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

	predict: function (input) {

		this.inputValue = input;

		if (this.resource !== undefined) {
			let batchSize = [1];
			let inputShape = this.layers[0].shape;
			let predictTensorShape = batchSize.concat(inputShape);

			let predictTensor = tf.tensor(input, predictTensorShape);

			this.predictResult = this.resource.predict(predictTensor);
		}

		this.updateLayerVis();

	},

	updateLayerVis: function () {

		this.updateInputVis();
		this.updateLayerPredictVis();

	},


	updateInputVis: function () {
		this.layers[0].updateValue(this.inputValue);
	},

	updateLayerPredictVis: function () {

		let paddingLayerNum = 0;

		for (let i = 1; i < this.layers.length; i++) {

			if (this.layers[i].layerType === "padding2d") {
				paddingLayerNum += 1;
				this.layers[i].updateValue();
				continue;
			}

			let predictValue = this.predictResult[i - 1 - paddingLayerNum].dataSync();

			this.layers[i].updateValue(predictValue);

		}

	},

	initLayerOutputIndex: function () {

		let paddingLayerNum = 0;

		for (let i = 1; i < this.layers.length; i++) {

			if (this.layers[i].layerType === "padding2d") {
				paddingLayerNum += 1;
			} else {
				this.layers[i].resourceOutputIndex = i - 1 - paddingLayerNum;
			}

		}

	},

	clear: function() {
		this.layers[0].clear();
		for (let i = 1; i < this.layers.length; i++) {
			this.layers[i].clear();
		}
	}

});

export { Sequential };