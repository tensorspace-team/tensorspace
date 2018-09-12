import { Layer1d } from "../abstract/Layer1d";

function Flatten(config) {

	Layer1d.call(this, config);

	this.segments = 1;

	this.loadLayerConfig(config);

	this.layerType = "flatten";

}

Flatten.prototype = Object.assign(Object.create(Layer1d.prototype), {

	loadModelConfig: function(modelConfig) {

		this.loadBasicModelConfig(modelConfig);

		if (this.color === undefined) {
			this.color = modelConfig.color.flatten;
		}

	},

	assemble: function(layerIndex) {

		this.layerIndex = layerIndex;

		let units = 1;

		for (let i = 0; i < this.lastLayer.outputShape.length; i++) {
			units *= this.lastLayer.outputShape[i];
		}

		this.units = units;
		this.width = this.units;

		this.outputShape = [this.units];

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;

		if (this.lastLayer.layerDimension === 1) {
			this.lastActualWidth = this.lastLayer.lastActualWidth;
			this.lastActualHeight = this.lastLayer.lastActualHeight;
		} else {
			this.lastActualWidth = this.lastLayer.actualWidth;
			this.lastActualHeight = this.lastLayer.actualHeight;
		}

	},

	getRelativeElements: function(selectedElement) {

		let relativeElements = [];

		if (selectedElement.elementType === "aggregationElement" || selectedElement.elementType === "featureLine") {

			let request = {
				all: true
			};

			relativeElements = this.lastLayer.provideRelativeElements(request);
		}

		return relativeElements;
	}

});

export { Flatten };