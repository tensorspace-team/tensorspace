import { AbstractModel } from './AbstractModel';
import { MapModelConfiguration } from "../configure/MapModelConfiguration";
import { ModelLayerInterval } from "../utils/Constant";
import { MaxDepthInLayer } from "../utils/Constant";

function Sequential(container, config) {

	AbstractModel.call(this, container);

	this.layers = [];

	this.configuration = new MapModelConfiguration(config);
	this.loadSceneConfig(this.configuration);

	this.hoveredLayer = undefined;

	this.inputValue = undefined;

	// create three.js actual scene
	this.createScene();

}

Sequential.prototype = Object.assign(Object.create(AbstractModel.prototype), {

	add: function (layer) {

		if (this.layers.length !== 0) {

			if (!layer.isMerged) {
				let tailLayer = this.layers[this.layers.length - 1];
				layer.setLastLayer(tailLayer);
			}

		}

		layer.setEnvironment(this.scene);
		layer.loadModelConfig(this.configuration);
		this.layers.push(layer);
		layer.assemble(this.layers.length);

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

		let model = this;

		model.raycaster.setFromCamera(model.mouse, model.camera);
		let intersects = model.raycaster.intersectObjects(model.scene.children, true);

		if (model.hoveredLayer !== undefined) {

			model.hoveredLayer.handleHoverOut();
			model.hoveredLayer = undefined;

		}

		for (let i = 0; i < intersects.length; i++) {

			if (intersects !== null && intersects.length > 0 && intersects[i].object.type === "Mesh") {

				let selectedElement = intersects[i].object;

				if (selectedElement.hoverable === true) {

					let selectedLayer = this.layers[selectedElement.layerIndex - 1];

					selectedLayer.handleHoverIn(selectedElement);

					this.hoveredLayer = selectedLayer;

					break;

				}

			}
		}

	},

	onClick: function (event) {

		let model = this;

		model.raycaster.setFromCamera(model.mouse, model.camera);
		let intersects = model.raycaster.intersectObjects(model.scene.children, true);

		for (let i = 0; i < intersects.length; i++) {
			if (intersects !== null && intersects.length > 0 && intersects[i].object.type === "Mesh") {

				let selectedElement = intersects[i].object;

				if (selectedElement.clickable === true) {

					let selectedLayer = this.layers[selectedElement.layerIndex - 1];

					selectedLayer.handleClick(selectedElement);

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
		let layerActualDepth = calculateDepths(this);

		for (let i = 0; i < this.layers.length; i++) {
			this.layers[i].init(layersPos[i], layerActualDepth[i]);
		}


		function calculateLayersPos(depth) {

			let layersPos = [];

			let initPos;
			if (depth % 2 === 1) {
				initPos = - ModelLayerInterval * ((depth - 1) / 2);
			} else {
				initPos = - ModelLayerInterval * (depth / 2) + ModelLayerInterval / 2;
			}
			for (let i = 0; i < depth; i++) {
				layersPos.push({
					x: 0,
					y: initPos,
					z: 0
				});
				initPos += ModelLayerInterval;
			}

			return layersPos;

		}

		function calculateDepths(model) {

			let depthList = [];
			let maxDepthValue = 0;
			let actualDepthList = [];

			for (let i = 0; i < model.layers.length; i++) {
				let layerDepth = model.layers[i].depth;

				if (layerDepth !== undefined) {
					maxDepthValue = maxDepthValue > layerDepth ? maxDepthValue : layerDepth;
					depthList.push(layerDepth);
				} else {
					depthList.push(1);
				}

			}

			for (let i = 0; i < model.layers.length; i++) {

				if (depthList[i] / maxDepthValue * MaxDepthInLayer > 1) {
					actualDepthList.push(depthList[i] / maxDepthValue * MaxDepthInLayer);
				} else {
					actualDepthList.push(1);
				}


			}

			return actualDepthList;

		}
	},

	predict: function (input) {

		this.inputValue = input;

		if (this.resource !== undefined) {

			let inputShape = this.layers[0].shape;

			this.predictResult = this.loader.predict(input, inputShape);
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

		for (let i = 1; i < this.layers.length; i++) {

			let predictValue = this.predictResult[i - 1].dataSync();

			this.layers[i].updateValue(predictValue);

		}

	},

	clear: function() {
		for (let i = 0; i < this.layers.length; i++) {
			this.layers[i].clear();
		}
	}

});

export { Sequential };