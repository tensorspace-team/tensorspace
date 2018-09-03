import { Layer } from './Layer';
import { colorUtils } from '../../utils/ColorUtils';
import { DenseAggregation } from "../../elements/DenseAggregation";
import { OutputUnit } from "../../elements/OutputUnit";
import { OutputNeuralPosGenerator } from "../../utils/OutputNeuralPosGenerator";
import {TextHelper} from "../../utils/TextHelper";
import { OutputTransitionFactory } from "../../animation/OutputTransitionTween";

function Output(config) {

	Layer.call(this, config);

	this.units = config.units;
	this.width = config.units;
	this.height = 1;
	this.depth = 1;

	this.unitLength = undefined;

	this.leftMostCenter = {
		x: 0,
		y: 0,
		z: 0
	};

	this.outputs = config.outputs;

	this.closeResultPos = [];
	this.openResultPos = [];

	for (let i = 0; i < this.units; i++) {
		this.closeResultPos.push({
			x: 0,
			y: 0,
			z: 0
		})
	}

	this.isOpen = undefined;

	this.layerType = "output";

}

Output.prototype = Object.assign(Object.create(Layer.prototype), {

	init: function(center, actualDepth) {

		this.center = center;
		this.actualDepth = actualDepth;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		if (this.isOpen) {

			this.initSegregationElements(this.openResultPos);
			this.initCloseButton();

		} else {

			this.initAggregationElement();

		}

		this.scene.add(this.neuralGroup);

	},

	openLayer: function() {

		if (!this.isOpen) {

			OutputTransitionFactory.openLayer(this);

		}

	},

	closeLayer: function() {

		if (this.isOpen) {

			OutputTransitionFactory.closeLayer(this);

		}

	},

	initSegregationElements: function(positions) {

		let textSize = TextHelper.calcOutputTextSize(this.unitLength);

		for (let i = 0; i < this.units; i++) {

			let segregationHandler = new OutputUnit(
				this.unitLength,
				textSize,
				this.outputs[i],
				positions[i],
				this.color
			);

			segregationHandler.setLayerIndex(this.layerIndex);
			segregationHandler.setOutputIndex(i);
			this.segregationHandlers.push(segregationHandler);
			this.neuralGroup.add(segregationHandler.getElement());

		}

		if (this.neuralValue !== undefined) {
			this.updateSegregationVis();
		}

	},

	disposeSegregationElements: function() {

		console.log("dispose output element");

		for (let i = 0; i < this.segregationHandlers.length; i++) {
			this.neuralGroup.remove(this.segregationHandlers[i].getElement());
		}

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

		this.unitLength = this.actualWidth / this.width;
		this.openResultPos = OutputNeuralPosGenerator.getLinePos(this.units, this.actualWidth / this.width);

		console.log("===");
		console.log(this.openResultPos);
		console.log("===");


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

		for (let i = 0; i < this.segregationHandlers.length; i++) {

			this.segregationHandlers[i].updateVis([colors[i]]);

		}
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
	},

	showResultText: function(selectedNeural) {

		for (let i = 0; i < this.segregationHandlers.length; i++) {
			if (this.segregationHandlers[i].isSelected()) {
				this.segregationHandlers[i].hideTextResult();
				break;
			}
		}

		let selectedIndex = selectedNeural.outputIndex;

		this.segregationHandlers[selectedIndex].showTextResult();

	},

	handleClick: function(clickedElement) {

		if (clickedElement.elementType === "aggregationElement") {

			this.openLayer();
		}

		if (clickedElement.elementType === "closeButton") {

			this.closeLayer();

		}

		if (clickedElement.elementType === "outputNeural") {

			this.showResultText(clickedElement);

		}

	},

	handleHoverIn: function(hoveredElement) {

		this.initLineGroup(hoveredElement);

	},

	handleHoverOut: function() {

		this.disposeLineGroup();

	}


});

export { Output };