import { Layer } from './Layer';
import { NeuralQueue } from '../../elements/NeuralQueue';
import { colorUtils } from '../../utils/ColorUtils';
import { DenseAggregation } from "../../elements/DenseAggregation";
import {LayerOpenFactory} from "../../animation/LayerOpen";
import {LayerCloseFactory} from "../../animation/LayerClose";

function Dense(config) {

	Layer.call(this, config);

	this.units = config.units;
	this.width = config.units;
	this.height = 1;
	this.depth = 1;
	this.neuralQueue = undefined;

	this.leftMostCenter = {
		x: 0,
		y: 0,
		z: 0
	};

	this.isOpen = undefined;

	this.layerType = "dense";

}

Dense.prototype = Object.assign(Object.create(Layer.prototype), {

	init: function(center, actualDepth) {

		this.center = center;
		this.actualDepth = actualDepth;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		if (this.isOpen) {

			this.initSegregationElements();
			this.initCloseButton();

		} else {

			this.initAggregationElement();

		}

		this.scene.add(this.neuralGroup);

	},

	openLayer: function() {

		if (!this.isOpen) {

			LayerOpenFactory.openQueueLayer(this);

			this.isOpen = true;

		}

	},

	closeLayer: function() {

		if (this.isOpen) {

			LayerCloseFactory.closeQueueLayer(this);

			this.isOpen = false;
		}

	},

	initSegregationElements: function() {

		let segregationHandler = new NeuralQueue(
			this.width,
			this.actualWidth,
			this.actualHeight,
			this.color
		);

		segregationHandler.setLayerIndex(this.layerIndex);
		this.segregationHandlers.push(segregationHandler);
		this.neuralGroup.add(segregationHandler.getElement());

		if (this.neuralValue !== undefined) {
			this.updateSegregationVis();
		}

	},

	disposeSegregationElements: function() {

		console.log("dispose queue element");

		this.neuralGroup.remove(this.segregationHandlers[0].getElement());
		this.segregationHandlers = [];

	},

	initAggregationElement: function() {

		let aggregationHandler = new DenseAggregation(this.lastActualWidth, this.lastActualHeight, this.actualDepth, this.color);
		aggregationHandler.setLayerIndex(this.layerIndex);

		this.aggregationHandler = aggregationHandler;
		this.neuralGroup.add(this.aggregationHandler.getElement());

	},

	disposeAggregationElement: function() {

		this.neuralGroup.remove(this.aggregationHandler.getElement());
		this.aggregationHandler = undefined;

	},

	assemble: function(layerIndex, modelConfig) {

		this.layerIndex = layerIndex;

		this.outputShape = [this.units, 1, 1];

		this.realVirtualRatio = this.lastLayer.realVirtualRatio;
		this.actualWidth = this.width * this.realVirtualRatio;
		this.actualHeight = this.height * this.realVirtualRatio;

		if (this.lastLayer.layerType === "dense") {
			this.lastActualWidth = this.lastLayer.lastActualWidth;
			this.lastActualHeight = this.lastLayer.lastActualHeight;
		} else {
			this.lastActualWidth = this.lastLayer.actualWidth;
			this.lastActualHeight = this.lastLayer.actualHeight;
		}

		this.openHeight = 100;

		if (this.isOpen === undefined) {
			this.isOpen = modelConfig.layerInitStatus;
		}

		if (this.color === undefined) {
			this.color = modelConfig.color.dense;
		}

	},

	updateValue: function(value) {

		this.neuralValue = value;

		if (this.isOpen) {
			this.updateSegregationVis();
		} else {
			this.updateAggregationVis();
		}

	},

	updateAggregationVis: function() {

	},

	updateSegregationVis: function() {
		let colors = colorUtils.getAdjustValues(this.neuralValue);

		this.segregationHandlers[0].updateVis(colors);
	},

	getRelativeElements: function(selectedElement) {

		let relativeElements = [];

		if (this.lastLayer.isOpen) {

			for (let i = 0; i < this.lastLayer.segregationHandlers.length; i++) {
				relativeElements.push(this.lastLayer.segregationHandlers[i].getElement());
			}

		} else {

			relativeElements.push(this.lastLayer.aggregationHandler.getElement());

		}

		return relativeElements;
	}

});


export { Dense };