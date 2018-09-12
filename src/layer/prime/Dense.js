import { NeuralQueue } from '../../elements/NeuralQueue';
import { colorUtils } from '../../utils/ColorUtils';
import { QueueAggregation } from "../../elements/QueueAggregation";
import { Layer1d } from "../abstract/Layer1d";

function Dense(config) {

	Layer1d.call(this, config);

	this.units = undefined;
	this.width = undefined;

	// the default segment is 1
	this.segments = 1;

	this.loadLayerConfig(config);

	this.leftMostCenter = {
		x: 0,
		y: 0,
		z: 0
	};

	this.layerType = "dense";

}

Dense.prototype = Object.assign(Object.create(Layer1d.prototype), {

	init: function(center, actualDepth, nextHookHandler) {

		this.center = center;
		this.actualDepth = actualDepth;
		this.nextHookHandler = nextHookHandler;
		this.lastHookHandler = this.lastLayer.nextHookHandler;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		if (this.isOpen) {

			this.initQueueElement();
			this.initCloseButton();

		} else {

			this.initAggregationElement();

		}

		this.scene.add(this.neuralGroup);

	},

	loadLayerConfig: function(layerConfig) {

		if (layerConfig !== undefined) {

			if (layerConfig.units !== undefined) {
				this.units = layerConfig.units;
				this.width = layerConfig.units;
				this.outputShape = [layerConfig.units];
			} else {
				console.error("The \"unit\" property is required for dense layer.");
			}

			if (layerConfig.segments !== undefined) {
				this.segments = layerConfig.segments;
			}
		}

	},

	initQueueElement: function() {

		let queueHandler = new NeuralQueue(
			this.width,
			this.actualWidth,
			this.unitLength,
			this.color
		);

		queueHandler.setLayerIndex(this.layerIndex);
		this.queueHandler = queueHandler;
		this.neuralGroup.add(queueHandler.getElement());

		if (this.neuralValue !== undefined) {
			this.updateQueueVis();
		}

	},

	initAggregationElement: function() {

		let aggregationHandler = new QueueAggregation(this.lastActualWidth, this.lastActualHeight, this.unitLength, this.color);
		aggregationHandler.setLayerIndex(this.layerIndex);

		this.aggregationHandler = aggregationHandler;
		this.neuralGroup.add(this.aggregationHandler.getElement());

	},

	loadModelConfig: function(modelConfig) {
		if (this.isOpen === undefined) {
			this.isOpen = modelConfig.layerInitStatus;
		}

		if (this.color === undefined) {
			this.color = modelConfig.color.dense;
		}

		if (this.relationSystem === undefined) {
			this.relationSystem = modelConfig.relationSystem;
		}

		if (this.textSystem === undefined) {
			this.textSystem = modelConfig.textSystem;
		}
	},

	assemble: function(layerIndex) {

		this.layerIndex = layerIndex;

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;

		if (this.lastLayer.layerDimension === 1) {

			this.lastActualWidth = this.lastLayer.lastActualWidth;
			this.lastActualHeight = this.lastLayer.lastActualHeight;
		} else {
			this.lastActualWidth = this.lastLayer.actualWidth;
			this.lastActualHeight = this.lastLayer.actualHeight;
		}

	},

	getRelativeElements: function(selectedElement) {

		let relativeElements = [];

		if (selectedElement.elementType === "aggregationElement" || selectedElement.elementType === "featureLine") {

			let request = {
				all: true
			};

			relativeElements = this.lastLayer.provideRelativeElements(request);

		}

		return relativeElements;
	},

	handleClick: function(clickedElement) {

		if (clickedElement.elementType === "aggregationElement") {
			this.openLayer();
		} else if (clickedElement.elementType === "closeButton") {
			this.closeLayer();
		}
	},

	showText: function(element) {

		if (element.elementType === "featureLine") {
			this.queueHandler.showText();
			this.textElementHandler = this.queueHandler;
		}

	}

});


export { Dense };