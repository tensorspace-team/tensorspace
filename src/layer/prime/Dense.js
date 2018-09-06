import { Layer } from './Layer';
import { NeuralQueue } from '../../elements/NeuralQueue';
import { colorUtils } from '../../utils/ColorUtils';
import { DenseAggregation } from "../../elements/DenseAggregation";
import { QueueTransitionFactory } from "../../animation/QueueTransitionTween";

function Dense(config) {

	Layer.call(this, config);

	this.units = undefined;
	this.width = undefined;
	this.height = 1;
	this.depth = 1;

	// the default segment is 1
	this.segments = 1;

	this.neuralQueue = undefined;

	this.loadLayerConfig(config);

	this.leftMostCenter = {
		x: 0,
		y: 0,
		z: 0
	};

	this.layerType = "dense";

}

Dense.prototype = Object.assign(Object.create(Layer.prototype), {

	init: function(center, actualDepth, nextHookHandler) {

		this.center = center;
		this.actualDepth = actualDepth;
		this.nextHookHandler = nextHookHandler;
		this.lastHookHandler = this.lastLayer.nextHookHandler;

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

	loadLayerConfig: function(layerConfig) {

		if (layerConfig !== undefined) {

			if (layerConfig.units !== undefined) {
				this.units = layerConfig.units;
				this.width = layerConfig.units;
			} else {
				console.error("The \"unit\" property is required for dense layer.");
			}

			if (layerConfig.segments !== undefined) {
				this.segments = layerConfig.segments;
			}
		}

	},

	openLayer: function() {

		if (!this.isOpen) {

			QueueTransitionFactory.openLayer(this);

			this.isOpen = true;

		}

	},

	closeLayer: function() {

		if (this.isOpen) {

			QueueTransitionFactory.closeLayer(this);

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

	handleHoverIn: function(hoveredElement) {

		if (this.relationSystem !== undefined && this.relationSystem) {
			this.initLineGroup(hoveredElement);
		}

		if (this.textSystem !== undefined && this.textSystem) {
			this.showText(hoveredElement);
		}

	},

	handleHoverOut: function() {

		if (this.relationSystem !== undefined && this.relationSystem) {
			this.disposeLineGroup();
		}

		if (this.textSystem !== undefined && this.textSystem) {
			this.hideText();
		}

	},

	showText: function(element) {

		if (element.elementType === "featureLine") {
			this.segregationHandlers[0].showText();
			this.textElementHandler = this.segregationHandlers[0];
		}

	},

	hideText: function() {

		if (this.textElementHandler !== undefined) {

			this.textElementHandler.hideText();
			this.textElementHandler = undefined;
		}

	}

});


export { Dense };