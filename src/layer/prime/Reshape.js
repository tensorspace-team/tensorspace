import {fmCenterGenerator} from "../../utils/FmCenterGenerator";
import {FeatureMap} from "../../elements/FeatureMap";
import {MapAggregation} from "../../elements/MapAggregation";
import {colorUtils} from "../../utils/ColorUtils";
import {MapDataGenerator} from "../../utils/MapDataGenerator";
import { Layer2d } from "./abstract/Layer2d";

function Reshape(config) {

	Layer2d.call(this, config);

	this.targetShape = undefined;
	this.width = undefined;
	this.height = undefined;
	this.depth = undefined;

	// set init size to be 1
	this.totalSize = 1;
	this.inputShape = undefined;

	this.fmCenters = [];
	this.openFmCenters = [];
	this.closeFmCenters = [];
	this.aggregationStrategy = undefined;

	this.loadLayerConfig(config);

	this.layerType = "reshape";

}

Reshape.prototype = Object.assign(Object.create(Layer2d.prototype), {

	init: function(center, actualDepth, nextHookHandler) {

		this.center = center;
		this.actualDepth = actualDepth;
		this.nextHookHandler = nextHookHandler;
		this.lastHookHandler = this.lastLayer.nextHookHandler;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		if (this.isOpen) {

			for (let i = 0; i < this.openFmCenters.length; i++) {
				this.fmCenters.push(this.openFmCenters[i]);
			}
			this.initSegregationElements(this.openFmCenters);
			this.initCloseButton();

		} else {

			this.initAggregationElement();

		}

		this.scene.add(this.neuralGroup);

	},

	loadLayerConfig: function(layerConfig) {

		if (layerConfig !== undefined) {

			if (layerConfig.targetShape !== undefined) {
				this.targetShape = layerConfig.targetShape;
				this.width = layerConfig.targetShape[0];
				this.height = layerConfig.targetShape[1];
			} else {
				console.error("\"targetShape\" property is required for reshape layer");
			}

		}

	},

	loadModelConfig: function(modelConfig) {

		if (this.isOpen === undefined) {
			this.isOpen = modelConfig.layerInitStatus;
		}

		if (this.color === undefined) {
			this.color = modelConfig.color.reshape;
		}

		if (this.layerShape === undefined) {
			this.layerShape = modelConfig.layerShape;
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

		for (let i = 0; i < this.inputShape.length; i++) {
			this.totalSize *= this.inputShape[i];
		}

		this.depth = this.totalSize / (this.width * this.height);

		this.outputShape = [this.width, this.height, this.depth];

		for (let i = 0; i < this.depth; i++) {
			let closeFmCenter = {
				x: 0,
				y: 0,
				z: 0
			};
			this.closeFmCenters.push(closeFmCenter);
		}

		this.realVirtualRatio = this.lastLayer.realVirtualRatio;
		this.actualWidth = this.width * this.realVirtualRatio;
		this.actualHeight = this.height * this.realVirtualRatio;

		this.unitLength = this.actualWidth / this.width;

		this.openFmCenters = fmCenterGenerator.getFmCenters(this.layerShape, this.depth, this.actualWidth, this.actualHeight);

		this.leftMostCenter = this.openFmCenters[0];
		this.openHeight = this.actualHeight + this.openFmCenters[this.openFmCenters.length - 1].z - this.openFmCenters[0].z;

	},

	initAggregationElement: function() {

		let aggregationHandler = new MapAggregation(
			this.width,
			this.height,
			this.actualWidth,
			this.actualHeight,
			this.actualDepth,
			this.color
		);
		aggregationHandler.setLayerIndex(this.layerIndex);

		this.aggregationHandler = aggregationHandler;
		this.neuralGroup.add(aggregationHandler.getElement());

		if (this.neuralValue !== undefined) {
			this.updateAggregationVis();
		}
	},

	initSegregationElements: function(centers) {

		for (let i = 0; i < this.depth; i++) {

			let segregationHandler = new FeatureMap(
				this.width,
				this.height,
				this.actualWidth,
				this.actualHeight,
				centers[i],
				this.color
			);

			segregationHandler.setLayerIndex(this.layerIndex);
			segregationHandler.setFmIndex(i);

			this.segregationHandlers.push(segregationHandler);

			this.neuralGroup.add(segregationHandler.getElement());

		}

		if (this.neuralValue !== undefined) {
			this.updateSegregationVis();
		}

	},

	updateSegregationVis: function() {

		let layerOutputValues = MapDataGenerator.generateChannelData(this.neuralValue, this.depth);

		let colors = colorUtils.getAdjustValues(layerOutputValues);

		let featureMapSize = this.width * this.height;

		for (let i = 0; i < this.depth; i++) {

			this.segregationHandlers[i].updateVis(colors.slice(i * featureMapSize, (i + 1) * featureMapSize));

		}

	},

	handleClick: function(clickedElement) {

		if (clickedElement.elementType === "aggregationElement") {
			this.openLayer();
		} else if (clickedElement.elementType === "closeButton") {
			this.closeLayer();
		}

	},

	getRelativeElements: function(selectedElement) {

		let relativeElements = [];

		if (selectedElement.elementType === "aggregationElement") {

			if (this.lastLayer.isOpen) {

				for (let i = 0; i < this.lastLayer.segregationHandlers.length; i++) {
					relativeElements.push(this.lastLayer.segregationHandlers[i].getElement());
				}

			} else {

				relativeElements.push(this.lastLayer.aggregationHandler.getElement());

			}

		} else if (selectedElement.elementType === "featureMap") {

			// as reshape layer's feature map number is different with last layer, so if last layer is opened, will not show relation lines

			if (!this.lastLayer.isOpen) {

				relativeElements.push(this.lastLayer.aggregationHandler.getElement());

			}

		}

		return relativeElements;


	},

	showText: function(element) {

		if (element.elementType === "featureMap") {

			let fmIndex = element.fmIndex;
			this.segregationHandlers[fmIndex].showText();
			this.textElementHandler = this.segregationHandlers[fmIndex];
		}

	}

});

export { Reshape };