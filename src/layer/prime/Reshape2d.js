import {fmCenterGenerator} from "../../utils/FmCenterGenerator";
import {FeatureMap} from "../../elements/FeatureMap";
import {MapAggregation} from "../../elements/MapAggregation";
import {colorUtils} from "../../utils/ColorUtils";
import {ChannelDataGenerator} from "../../utils/ChannelDataGenerator";
import { Layer3d } from "./abstract/Layer3d";

function Reshape2d(config) {

	Layer3d.call(this, config);

	this.targetShape = undefined;
	this.width = undefined;
	this.height = undefined;
	this.depth = undefined;

	// set init size to be 1
	this.totalSize = 1;

	this.fmCenters = [];
	this.openFmCenters = [];
	this.closeFmCenters = [];
	this.aggregationStrategy = undefined;

	this.loadLayerConfig(config);

	this.layerType = "reshape2d";

}

Reshape2d.prototype = Object.assign(Object.create(Layer3d.prototype), {

	init: function(center, actualDepth, nextHookHandler) {

		this.center = center;
		this.actualDepth = actualDepth;
		this.nextHookHandler = nextHookHandler;
		this.lastHookHandler = this.lastLayer.nextHookHandler;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		if (this.depth === 1) {
			this.isOpen = true;
			this.initSegregationElements(this.openFmCenters);
		} else {
			if (this.isOpen) {

				for (let i = 0; i < this.openFmCenters.length; i++) {
					this.fmCenters.push(this.openFmCenters[i]);
				}
				this.initSegregationElements(this.openFmCenters);
				this.initCloseButton();

			} else {
				this.initAggregationElement();
			}
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

		} else {
			console.error("\"Lack config for reshape layer.");
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

		if (this.totalSize % (this.width * this.height) !== 0) {
			console.error("input size " + this.totalSize + " can not be reshape to [" + this.width + ", " + this.height + "]");
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

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;
		this.actualHeight = this.height * this.unitLength;

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

		let layerOutputValues = ChannelDataGenerator.generateChannelData(this.neuralValue, this.depth);

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

			let request = {
				all: true
			};

			relativeElements = this.lastLayer.provideRelativeElements(request);

		} else if (selectedElement.elementType === "featureMap") {

			// as reshape layer's feature map number is different with last layer, will not show relation lines

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

export { Reshape2d };