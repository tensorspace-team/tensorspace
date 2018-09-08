import { FeatureMap } from '../../elements/FeatureMap';
import { fmCenterGenerator } from '../../utils/FmCenterGenerator';
import { MapAggregation } from "../../elements/MapAggregation";
import { Layer3d } from "./abstract/Layer3d";
import { MapDataGenerator } from "../../utils/MapDataGenerator";
import { colorUtils } from "../../utils/ColorUtils";

function Conv2d(config) {

	Layer3d.call(this, config);

	console.log("construct prime Conv2d");

	this.kernelSize = undefined;
	this.filters = undefined;
	this.strides = undefined;
	this.fmShape = undefined;
	this.width = undefined;
	this.height = undefined;
	this.depth = undefined;

	this.fmCenters = [];
	this.openFmCenters = [];
	this.closeFmCenters = [];

	this.isShapePredefined = false;

	this.layerShape = undefined;
	this.closeButton = undefined;

	this.aggregationStrategy = undefined;

	this.padding = "valid";

	this.loadLayerConfig(config);

	for (let i = 0; i < this.depth; i++) {
		let center = {
			x: 0,
			y: 0,
			z: 0
		};
		this.closeFmCenters.push(center);
	}

	this.layerType = "prime conv2d";

}

Conv2d.prototype = Object.assign(Object.create(Layer3d.prototype), {

	init: function (center, actualDepth, nextHookHandler) {

		this.center = center;

		console.log(actualDepth);

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

			this.kernelSize = layerConfig.kernelSize;
			this.filters = layerConfig.filters;
			this.strides = layerConfig.strides;
			this.depth = layerConfig.filters;

			if (layerConfig.shape !== undefined) {

				this.isShapePredefined = true;
				this.fmShape = layerConfig.shape;
				this.width = this.fmShape[0];
				this.height = this.fmShape[1];

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

		}

	},

	initSegregationElements: function (centers) {

		for (let i = 0; i < this.filters; i++) {
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

	initAggregationElement: function () {

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
		this.neuralGroup.add(this.aggregationHandler.getElement());

		if (this.neuralValue !== undefined) {
			this.updateAggregationVis();
		}

	},

	loadModelConfig: function(modelConfig) {

		if (this.isOpen === undefined) {
			this.isOpen = modelConfig.layerInitStatus;
		}

		if (this.color === undefined) {
			this.color = modelConfig.color.conv2d;
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

	assemble: function (layerIndex) {

		console.log("Assemble conv2d, layer index: " + layerIndex);

		this.layerIndex = layerIndex;

		if (this.isShapePredefined) {

		} else {

			this.inputShape = this.lastLayer.outputShape;

			if (this.padding === "valid") {

				this.width = (this.inputShape[0] - this.kernelSize) / this.strides + 1;
				this.height = (this.inputShape[1] - this.kernelSize) / this.strides + 1;

			} else if (this.padding === "same") {

				this.width = Math.ceil(this.inputShape[0] / this.strides);
				this.height = Math.ceil(this.inputShape[1] / this.strides);

			} else {
				console.error("Why padding property will be set to such value?");
			}

			this.fmShape = [this.width, this.height];


		}

		this.outputShape = [this.width, this.height, this.filters];

		this.realVirtualRatio = this.lastLayer.realVirtualRatio;
		this.actualWidth = this.width * this.realVirtualRatio;
		this.actualHeight = this.height * this.realVirtualRatio;
		this.unitLength = this.actualWidth / this.width;

		this.openFmCenters = fmCenterGenerator.getFmCenters(this.layerShape, this.depth, this.actualWidth, this.actualHeight);

		this.leftMostCenter = this.openFmCenters[0];
		this.openHeight = this.actualHeight + this.openFmCenters[this.openFmCenters.length - 1].z - this.openFmCenters[0].z;

	},

	updateSegregationVis: function() {

		let layerOutputValues = MapDataGenerator.generateChannelData(this.neuralValue, this.depth);

		let colors = colorUtils.getAdjustValues(layerOutputValues);

		let featureMapSize = this.width * this.height;

		for (let i = 0; i < this.depth; i++) {

			this.segregationHandlers[i].updateVis(colors.slice(i * featureMapSize, (i + 1) * featureMapSize));

		}

	},

	getRelativeElements: function(selectedElement) {

		let relativeElements = [];

		if (selectedElement.elementType === "aggregationElement" || selectedElement.elementType === "featureMap") {

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
		if (element.elementType === "featureMap") {

			let fmIndex = element.fmIndex;
			this.segregationHandlers[fmIndex].showText();
			this.textElementHandler = this.segregationHandlers[fmIndex];

		}
	}

});

export { Conv2d };