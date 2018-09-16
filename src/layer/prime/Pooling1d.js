import { Layer2d } from "../abstract/Layer2d";

function Pooling1d(config) {

	Layer2d.call(this, config);

	this.shape = undefined;
	this.poolSize = undefined;
	this.strides = undefined;
	this.padding = "valid";

	this.isShapePredefined = false;

	this.loadLayerConfig(config);

	this.layerType = "pooling1d";
}

Pooling1d.prototype = Object.assign(Object.create(Layer2d.prototype), {

	loadLayerConfig: function(layerConfig) {

		if (layerConfig !== undefined) {

			if (layerConfig.poolSize !== undefined) {
				this.poolSize = layerConfig.poolSize;
			} else {
				console.error("\"poolSize\" property is required for pooling1d layer.");
			}

			if (layerConfig.strides !== undefined) {
				this.strides = layerConfig.strides;
			} else {
				console.error("\"strides\" property is required for pooling1d layer.");
			}

			if (layerConfig.padding !== undefined) {
				if (layerConfig.padding === "valid") {
					this.padding = "valid";
				} else if (layerConfig.padding === "same") {
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

		this.loadBasicModelConfig(modelConfig);

		if (this.color === undefined) {
			this.color = modelConfig.color.pooling1d;
		}

		if (this.aggregationStrategy === undefined) {
			this.aggregationStrategy = modelConfig.aggregationStrategy;
		}

	},

	assemble: function(layerIndex) {

		this.layerIndex = layerIndex;

		this.inputShape = this.lastLayer.outputShape;

		if (this.padding === "valid") {

			this.width = Math.floor((this.inputShape[0] - this.poolSize) / this.strides) + 1;

		} else if (this.padding === "same") {

			this.width = Math.ceil(this.inputShape[0] / this.strides);

		} else {
			console.error("Why padding property will be set to such value?");
		}

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

			let openCenter = {
				x: this.lastLayer.openCenterList[i].x,
				y: this.lastLayer.openCenterList[i].y,
				z: this.lastLayer.openCenterList[i].z
			};
			this.openCenterList.push(openCenter);

		}

	},

	getRelativeElements: function(selectedElement) {

		let relativeElements = [];

		if (selectedElement.elementType === "aggregationElement") {

			let request = {
				all: true
			};
			relativeElements = this.lastLayer.provideRelativeElements(request).elementList;

		} else if (selectedElement.elementType === "gridLine") {

			let gridIndex = selectedElement.gridIndex;
			let request = {
				index: gridIndex
			};
			relativeElements = this.lastLayer.provideRelativeElements(request).elementList;

		}

		return relativeElements;

	}

});

export { Pooling1d };
