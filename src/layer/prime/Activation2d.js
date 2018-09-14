import {Layer2d} from "../abstract/Layer2d";

function Activation2d(config) {

	Layer2d.call(this, config);

	this.activation = undefined;

	this.layerType = "Activation2d";

}

Activation2d.prototype = Object.assign(Object.create(Layer2d.prototype), {

	loadLayerConfig: function(layerConfig) {

		if (layerConfig !== undefined) {
			if (layerConfig.activation !== undefined) {
				this.activation = layerConfig.activation;
			} else {
				console.error("\"activation\" property is required for activation1d layer.");
			}
		} else {
			console.error("Lack config for activation2d layer.");
		}

	},

	loadModelConfig: function(modelConfig) {

		this.loadBasicModelConfig(modelConfig);

		if (this.color === undefined) {
			this.color = modelConfig.color.activation2d;
		}

		if (this.layerShape === undefined) {
			this.layerShape = modelConfig.layerShape;
		}

		if (this.aggregationStrategy === undefined) {
			this.aggregationStrategy = modelConfig.aggregationStrategy;
		}

	},

	assemble: function(layerIndex) {

		this.layerIndex = layerIndex;

		this.inputShape = this.lastLayer.outputShape;

		this.width = this.inputShape[0];
		this.depth = this.inputShape[1];

		this.outputShape = [this.width, this.depth];

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.unitLength * this.width;

		for (let i = 0; i < this.depth; i++) {
			this.closeCenterList.push({
				x: 0,
				y: 0,
				z: 0
			});
			this.openCenterList.push({
				x: this.lastLayer.openCenterList[i].x,
				y: this.lastLayer.openCenterList[i].y,
				z: this.lastLayer.openCenterList[i].z
			});
		}

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

export { Activation2d };