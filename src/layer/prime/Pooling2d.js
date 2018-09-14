import { Layer3d } from "../abstract/Layer3d";

function Pooling2d(config) {

	Layer3d.call(this, config);

	this.poolSize = undefined;
	this.strides = undefined;

	this.isShapePredefined = false;

	this.padding = "valid";

	this.loadLayerConfig(config);

	this.layerType = "maxPool2d";

}

Pooling2d.prototype = Object.assign(Object.create(Layer3d.prototype), {

	loadLayerConfig: function(layerConfig) {

		if (layerConfig !== undefined) {

			if (layerConfig.poolSize !== undefined) {
				this.poolSize = layerConfig.poolSize;
			} else {
				console.error("\"poolSize\" is required for Pooling2d layer");
			}

			if (layerConfig.strides !== undefined) {
				this.strides = layerConfig.strides;
			} else {
				console.error("\"strides\" is required for Pooling2d layer");
			}

			if (layerConfig.shape !== undefined) {

				this.isShapePredefined = true;
				this.fmShape = layerConfig.shape;
				this.width = this.fmShape[0];
				this.height = this.fmShape[1];
				this.outputShape = [this.width, this.height, this.depth];
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
			this.color = modelConfig.color.pooling2d;
		}

		if (this.aggregationStrategy === undefined) {
			this.aggregationStrategy = modelConfig.aggregationStrategy;
		}
	},

	assemble: function(layerIndex) {
		this.layerIndex = layerIndex;

		this.depth = this.lastLayer.depth;

		if (this.isShapePredefined) {

		} else {
			this.inputShape = this.lastLayer.outputShape;

			if (this.padding === "valid") {

				this.width = (this.inputShape[0] - this.poolSize[0]) / this.strides[0] + 1;
				this.height = (this.inputShape[1] - this.poolSize[1]) / this.strides[1] + 1;

			} else if (this.padding === "same") {

				this.width = Math.ceil(this.inputShape[0] / this.strides[0]);
				this.height = Math.ceil(this.inputShape[1] / this.strides[1]);

			} else {
				console.error("Why padding property will be set to such value?");
			}

			this.outputShape = [this.width, this.height, this.depth];
		}

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;
		this.actualHeight = this.height * this.unitLength;

		for (let i = 0; i < this.depth; i++) {

			let center = {
				x: 0,
				y: 0,
				z: 0
			};
			this.closeFmCenters.push(center);

			let fmCenter = {
				x: this.lastLayer.openFmCenters[i].x,
				y: this.lastLayer.openFmCenters[i].y,
				z: this.lastLayer.openFmCenters[i].z
			};
			this.openFmCenters.push(fmCenter);

		}

		this.leftMostCenter = this.openFmCenters[0];
		// layer total height in z-axis
		this.openHeight = this.actualHeight + this.openFmCenters[this.openFmCenters.length - 1].z - this.openFmCenters[0].z;

	},

	getRelativeElements: function(selectedElement) {

		let relativeElements = [];

		if (selectedElement.elementType === "aggregationElement") {

			let request = {
				all: true
			};

			relativeElements = this.lastLayer.provideRelativeElements(request).elementList;

		} else if (selectedElement.elementType === "featureMap") {

			let fmIndex = selectedElement.fmIndex;
			let request = {
				index: fmIndex
			};

			relativeElements = this.lastLayer.provideRelativeElements(request).elementList;

		}

		return relativeElements;

	}

});

export { Pooling2d };