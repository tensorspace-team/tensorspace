import {Layer3d} from "../abstract/Layer3d";
import {fmCenterGenerator} from "../../utils/FmCenterGenerator";

function Conv2dTranspose(config) {

	Layer3d.call(this, config);

	console.log("construct Conv2dTranspose");

	this.kernelSize = undefined;
	this.filters = undefined;
	this.strides = undefined;
	this.fmShape = undefined;

	this.isShapePredefined = false;

	this.layerShape = undefined;

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

	this.layerType = "conv2dTranspose";

}

Conv2dTranspose.prototype = Object.assign(Object.create(Layer3d.prototype), {

	loadLayerConfig: function(layerConfig) {

		if (layerConfig !== undefined) {

			if (layerConfig.filters !== undefined) {
				this.filters = layerConfig.filters;
				this.depth = layerConfig.filters;
			} else {
				console.error("\"filters\" property is required for Conv2dTranspose layer.");
			}

			if (layerConfig.kernelSize !== undefined) {
				this.kernelSize = layerConfig.kernelSize;
			}

			if (layerConfig.strides !== undefined) {
				this.strides = layerConfig.strides;
			}

			if (layerConfig.padding !== undefined) {

				if (layerConfig.padding === "same") {
					this.padding = "same";
				} else if (layerConfig.padding === "valid") {
					this.padding = "valid";
				} else {
					console.error("\"padding\" property do not support for " + layerConfig.padding + ", use \"valid\" or \"same\" instead.");
				}

			}

			if (layerConfig.shape !== undefined) {

				this.isShapePredefined = true;
				this.fmShape = layerConfig.shape;
				this.width = this.fmShape[0];
				this.height = this.fmShape[1];

			}

		} else {
			console.error("Lack config for Conv2dTranspose layer.");
		}

	},

	loadModelConfig: function(modelConfig) {

		if (this.isOpen === undefined) {
			this.isOpen = modelConfig.layerInitStatus;
		}

		if (this.color === undefined) {
			this.color = modelConfig.color.conv2dTranspose;
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

		if (!this.isShapePredefined) {

			this.inputShape = this.lastLayer.outputShape;

			if (this.padding === "same") {

				this.width = this.inputShape[0] * this.strides[0];
				this.height = this.inputShape[1] * this.strides[1];

			} else if (this.padding === "valid") {

				this.width = (this.inputShape[0] - 1) * this.strides + this.kernelSize;
				this.height = (this.inputShape[1] - 1) * this.strides + this.kernelSize;

			} else {
				console.error("Why padding property will be set to such value?");
			}

			this.fmShape = [this.width, this.height];
		}

		this.outputShape = [this.width, this.height, this.filters];

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;
		this.actualHeight = this.height * this.unitLength;

		this.openFmCenters = fmCenterGenerator.getFmCenters(this.layerShape, this.depth, this.actualWidth, this.actualHeight);

		this.leftMostCenter = this.openFmCenters[0];
		this.openHeight = this.actualHeight + this.openFmCenters[this.openFmCenters.length - 1].z - this.openFmCenters[0].z;

	},

	getRelativeElements: function(selectedElement) {

		let relativeElements = [];

		if (selectedElement.elementType === "aggregationElement" || selectedElement.elementType === "featureMap") {

			let request = {
				all: true
			};

			relativeElements = this.lastLayer.provideRelativeElements(request);

		}

		return relativeElements;

	}

});

export { Conv2dTranspose };