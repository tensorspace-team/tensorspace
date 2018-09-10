import { QueueAggregation } from "../../elements/QueueAggregation";
import { NeuralQueue } from "../../elements/NeuralQueue";
import { Layer1d } from "./abstract/Layer1d";
import { colorUtils } from "../../utils/ColorUtils";

function Flatten(config) {

	Layer1d.call(this, config);

	this.units = undefined;
	this.width = undefined;

	this.unitLength = undefined;

	this.segments = 1;

	this.loadLayerConfig(config);

	this.leftMostCenter = {
		x: 0,
		y: 0,
		z: 0
	};

}

Flatten.prototype = Object.assign(Object.create(Layer1d.prototype), {

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

	initQueueElement: function() {

		let queueHandler = new NeuralQueue(
			this.width,
			this.actualWidth,
			this.unitLength,
			this.color
		);

		queueHandler.setLayerIndex(this.layerIndex);
		this.queueHandler = queueHandler;
		this.neuralGroup.add(this.queueHandler.getElement());

		if (this.neuralValue !== undefined) {
			this.updateSegregationVis();
		}

	},

	initAggregationElement: function() {

		let aggregationHandler = new QueueAggregation(this.lastActualWidth, this.lastActualHeight, this.actualDepth, this.color);
		aggregationHandler.setLayerIndex(this.layerIndex);

		this.aggregationHandler = aggregationHandler;
		this.neuralGroup.add(this.aggregationHandler.getElement());

	},

	loadModelConfig: function(modelConfig) {
		if (this.isOpen === undefined) {
			this.isOpen = modelConfig.layerInitStatus;
		}

		if (this.color === undefined) {
			this.color = modelConfig.color.flatten;
		}

		if (this.relationSystem === undefined) {
			this.relationSystem = modelConfig.relationSystem;
		}

		if (this.textSystem === undefined) {
			this.textSystem = modelConfig.textSystem;
		}
	},

	loadLayerConfig: function(layerConfig) {



	},

	assemble: function(layerIndex) {

		this.layerIndex = layerIndex;

		let units = 1;

		for (let i = 0; i < this.lastLayer.outputShape.length; i++) {
			units *= this.lastLayer.outputShape[i];
		}

		this.units = units;
		this.width = this.units;

		this.outputShape = [this.units];

		this.realVirtualRatio = this.lastLayer.realVirtualRatio;
		this.actualWidth = this.width * this.realVirtualRatio;

		this.unitLength = this.actualWidth / this.width;

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
			if (this.lastLayer.isOpen) {

				for (let i = 0; i < this.lastLayer.segregationHandlers.length; i++) {
					relativeElements.push(this.lastLayer.segregationHandlers[i].getElement());
				}

			} else {

				relativeElements.push(this.lastLayer.aggregationHandler.getElement());

			}
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

export { Flatten };