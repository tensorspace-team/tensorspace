import AbstractComposite from './AbstractComposite';

function MapSequential(container) {

	AbstractComposite.call(this, container);

	this.layers = [];
	this.heightLightNeural = [];
	this.layerHighLighted = false;
	this.model = undefined;
	this.loadModel = false;

	this.inputValue = undefined;

}

MapSequential.prototype = Object.assign(Object.create(AbstractComposite.prototype), {

	add: function(layer) {

		if (this.layers.length !== 0) {

			let tailLayer = this.layers[this.layers.length - 1];
			layer.setLastLayer(tailLayer);
			tailLayer.setNextLayer(layer);
		}

		layer.setEnvironment(this.scene);
		this.layers.push(layer);
		layer.assemble(this.layers.length);

	},

	init: function(callback) {
		console.log("init map sequential model");

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

	createModel: function() {

		console.log("creating map sequential model...");

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

	onMouseMove: function(event) {

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


	updateInputVis: function() {
		this.layers[0].updateValue(this.inputValue);
	},

	updateLayerPredictVis: function() {

		console.log(222);

		for (let i = 1; i < this.layers.length; i++) {

			let predictValue = this.predictResult[i - 1].dataSync();

			console.log(predictValue.length);

			this.layers[i].updateValue(predictValue);

		}

	},

	initLayerOutputIndex: function() {

		for (let i = 1; i < this.layers.length; i++) {

			this.layers[i].resourceOutputIndex = i - 1;

		}

	}

});

export default MapSequential;