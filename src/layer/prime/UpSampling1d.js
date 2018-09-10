import {GridLine} from "../../elements/GridLine";
import {GridAggregation} from "../../elements/GridAggregation";
import {Layer2d} from "./abstract/Layer2d";

function UpSampling1d(config) {

	Layer2d.call(this, config);

	this.width = undefined;
	this.depth = undefined;

	this.size = undefined;

	this.loadLayerConfig(config);

	this.layerType = "UpSampling1d";

}

UpSampling1d.prototype = Object.assign(Object.create(Layer2d.prototype), {

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
			if (layerConfig.size !== undefined) {
				this.size = layerConfig.size;
			} else {
				console.error("\"size\" property is required for UpSampling1d layer.");
			}
		} else {
			console.error("Lack config for UpSampling1d layer.");
		}

	},

	loadModelConfig: function(modelConfig) {

		if (this.isOpen === undefined) {
			this.isOpen = modelConfig.layerInitStatus;
		}

		if (this.color === undefined) {
			this.color = modelConfig.color.upSampling1d;
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

		this.inputShape = this.lastLayer.outputShape;

		this.width = this.inputShape[0] * this.size;
		this.depth = this.inputShape[1];

		this.outputShape = [this.width, this.depth];

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;

		for (let i = 0; i < this.depth; i++) {
			let closeCenter = {
				x: 0,
				y: 0,
				z: 0
			};
			this.closeCenterList.push(closeCenter);
		}

		for (let i = 0; i < this.lastLayer.openCenterList.length; i++) {

			let openCenter = {
				x: this.lastLayer.openCenterList[i].x,
				y: this.lastLayer.openCenterList[i].y,
				z: this.lastLayer.openCenterList[i].z
			};

			this.openCenterList.push(openCenter);

		}

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

export { UpSampling1d };