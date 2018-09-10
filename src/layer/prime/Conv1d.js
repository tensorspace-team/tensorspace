import { Layer2d } from "./abstract/Layer2d";
import { QueueCenterGenerator } from "../../utils/QueueCenterGenerator";
import { GridAggregation } from "../../elements/GridAggregation";
import {GridLine} from "../../elements/GridLine";

function Conv1d(config) {

	Layer2d.call(this, config);

	this.width = undefined;
	this.depth = undefined;

	this.shape = undefined;
	this.filters = undefined;
	this.strides = undefined;
	this.kernelSize = undefined;
	this.padding = "valid";

	this.isShapePredefined = false;

	this.loadLayerConfig(config);

	for (let i = 0; i < this.depth; i++) {
		let center = {
			x: 0,
			y: 0,
			z: 0
		};

		this.closeCenterList.push(center);

	}

	this.layerType = "conv1d";

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

			this.initSegregationElements(this.openCenterList);
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
				this.depth = layerConfig.filters;
			} else {
				console.error("\"filters\" property is required for conv1d layer.");
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

		if (this.aggregationStrategy === undefined) {
			this.aggregationStrategy = modelConfig.aggregationStrategy;
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

		this.outputShape = [this.width, this.depth];

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;

		this.openCenterList = QueueCenterGenerator.getCenterList(this.actualWidth, this.depth);
	},

	initAggregationElement: function() {

		let aggregationHandler = new GridAggregation(
			this.width,
			this.actualWidth,
			this.unitLength,
			this.color
		);
		aggregationHandler.setLayerIndex(this.layerIndex);

		this.aggregationHandler = aggregationHandler;
		this.neuralGroup.add(this.aggregationHandler.getElement());

		if (this.neuralValue !== undefined) {
			this.updateAggregationVis();
		}

	},

	initSegregationElements: function(centers) {

		this.queueHandlers = [];

		for (let i = 0; i < this.depth; i++) {

			let queueHandler = new GridLine(
				this.width,
				this.actualWidth,
				this.unitLength,
				centers[i],
				this.color
			);

			queueHandler.setLayerIndex(this.layerIndex);
			queueHandler.setGridIndex(i);
			this.queueHandlers.push(queueHandler);
			this.neuralGroup.add(queueHandler.getElement());

		}

		if (this.neuralValue !== undefined) {
			this.updateSegregationVis();
		}

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

	showText: function(element) {

		if (element.elementType === "gridLine") {

			let gridIndex = element.gridIndex;

			this.queueHandlers[gridIndex].showText();
			this.textElementHandler = this.queueHandlers[gridIndex];
		}

	},

	getRelativeElements: function(selectedElement) {

		let relativeElements = [];

		if (selectedElement.elementType === "aggregationElement" || selectedElement.elementType === "gridLine") {

			if (this.lastLayer.isOpen) {

				// for (let i = 0; i < this.lastLayer.segregationHandlers.length; i++) {
				//
				// 	relativeElements.push(this.lastLayer.segregationHandlers[i].getElement());
				//
				// }

			} else {

				// relativeElements.push(this.lastLayer.aggregationHandler.getElement());

			}

		}

		return relativeElements;

	}

});

export { Conv1d };