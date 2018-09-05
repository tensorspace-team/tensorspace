import { AbstractComposite } from './AbstractComposite';
import { MapModelConfiguration } from "../configure/MapModelConfiguration";
import { ModelLayerInterval } from "../utils/Constant";
import { MaxDepthInLayer } from "../utils/Constant";
import { LineGroupGeometry } from "../elements/LineGroupGeometry";
import { HookPosRatio } from "../utils/Constant";
import { LineHook } from "../elements/LineHook";

function Sequential(container, config) {

	AbstractComposite.call(this, container);

	this.layers = [];
	this.heightLightNeural = [];
	this.layerHighLighted = false;
	this.model = undefined;
	this.loadModel = false;

	this.configuration = new MapModelConfiguration(config);

	this.hoveredLayer = undefined;

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
		let hookHandlerList = calculateHookList(this, layersPos);
		let layerActualDepth = calculateDepths(this);

		for (let i = 0; i < this.layers.length; i++) {
			this.layers[i].init(layersPos[i], layerActualDepth[i], hookHandlerList[i]);
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

				maxDepthValue = maxDepthValue > layerDepth ? maxDepthValue : layerDepth;
				depthList.push(layerDepth);

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

		function calculateHookList(model, layersPos) {

			let hookHandlerList = [];

			for (let i = 0; i < layersPos.length; i++) {

				let hookPos = {
					x: layersPos[i].x,
					y: layersPos[i].y + HookPosRatio * ModelLayerInterval,
					z: layersPos[i].z
				};

				let hookHandler = new LineHook(hookPos);
				model.scene.add(hookHandler.getElement());

				hookHandlerList.push(hookHandler);

			}

			return hookHandlerList;
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