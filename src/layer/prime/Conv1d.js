import { QueueTransitionFactory } from "../../animation/QueueTransitionTween";
import {NeuralQueue} from "../../elements/NeuralQueue";
import { colorUtils } from "../../utils/ColorUtils";
import { Layer2d } from "./abstract/Layer2d";

function Conv1d(config) {

	Layer2d.call(this, config);

	this.width = undefined;
	this.height = undefined;
	this.depth = undefined;

	this.shape = undefined;
	this.filters = undefined;
	this.strides = undefined;
	this.kernelSize = undefined;
	this.padding = "valid";

	this.isShapePredefined = false;

	this.loadLayerConfig(config);

}

Conv1d.prototype = Object.assign(Object.create(Layer2d.prototype), {

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

			if (layerConfig.filters !== undefined) {
				this.filters = layerConfig.filters;
			}

			if (layerConfig.strides !== undefined) {
				this.strides = layerConfig.strides;
			}

			if (layerConfig.kernelSize !== undefined) {
				this.kernelSize = layerConfig.kernelSize;
			}

			if (layerConfig.padding !== undefined) {

				if (layerConfig.padding.toLowerCase() === "valid") {
					this.padding = "valid";
				} else if (layerConfig.padding.toLowerCase() === "same") {
					this.padding = "same";
				} else {
					console.error("\"padding\" property do not support for " + layerConfig.padding + ", use \"valid\" or \"same\" instead.");
				}

			}

			if (layerConfig.shape !== undefined) {

				this.isShapePredefined = true;
				this.width = layerConfig.shape[0];
			}

		} else {
			console.error("Lack config for conv1d layer.");
		}

	},

	loadModelConfig: function(modelConfig) {

		if (this.isOpen === undefined) {
			this.isOpen = modelConfig.layerInitStatus;
		}

		if (this.color === undefined) {
			this.color = modelConfig.color.conv1d;
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

		if (!this.isShapePredefined) {

			this.inputShape = this.lastLayer.outputShape;

			if (this.padding === "valid") {

				this.width = (this.inputShape[0] - this.kernelSize) / this.strides + 1;

			} else if (this.padding === "same") {

				this.width = Math.ceil(this.inputShape[0] / this.strides);

			} else {
				console.error("Why padding property will be set to such value?");
			}
		}

		this.outputShape = [this.width];

		this.realVirtualRatio = this.lastLayer.realVirtualRatio;
		this.actualWidth = this.width * this.realVirtualRatio;
		this.actualHeight = this.height * this.realVirtualRatio;
		this.unitLength = this.actualWidth / this.width;
	},

	initAggregationElement: function() {

	},

	disposeAggregationElement: function() {

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

		this.neuralGroup.remove(this.segregationHandlers[0].getElement());
		this.segregationHandlers = [];

	},

	updateValue: function(value) {

		this.neuralValue = value;

		if (this.isOpen) {
			let colors = colorUtils.getAdjustValues(this.neuralValue);

			this.segregationHandlers[0].updateVis(colors);
		}

	},

	handleClick: function() {

	},

	handleHoverIn: function() {

	},

	handleHoverOut: function() {

	},

	showText: function() {

	},

	hideText: function() {

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

	getRelativeElements: function(selectedElement) {

	}

});

export { Conv1d };