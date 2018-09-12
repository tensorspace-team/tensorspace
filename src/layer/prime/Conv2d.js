import { fmCenterGenerator } from '../../utils/FmCenterGenerator';
import { Layer3d } from "../abstract/Layer3d";

function Conv2d(config) {

	Layer3d.call(this, config);

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

	this.layerType = "prime conv2d";

}

Conv2d.prototype = Object.assign(Object.create(Layer3d.prototype), {

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

	loadModelConfig: function(modelConfig) {

		this.loadBasicModelConfig(modelConfig);

		if (this.color === undefined) {
			this.color = modelConfig.color.conv2d;
		}

		if (this.layerShape === undefined) {
			this.layerShape = modelConfig.layerShape;
		}

		if (this.aggregationStrategy === undefined) {
			this.aggregationStrategy = modelConfig.aggregationStrategy;
		}
	},

	assemble: function (layerIndex) {

		console.log("Assemble conv2d, layer index: " + layerIndex);

		this.layerIndex = layerIndex;

		if (!this.isShapePredefined) {
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

export { Conv2d };