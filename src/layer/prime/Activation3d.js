import {Layer3d} from "../abstract/Layer3d";
import { fmCenterGenerator } from "../../utils/FmCenterGenerator";

function Activation3d(config) {

	Layer3d.call(this, config);

	this.activation = undefined;

	this.layerType = "Activation3d";

}

Activation3d.prototype = Object.assign(Object.create(Layer3d.prototype), {

	loadLayerConfig: function(layerConfig) {

		if (layerConfig !== undefined) {
			if (layerConfig.activation !== undefined) {
				this.activation = layerConfig.activation;
			} else {
				console.error("\"activation\" property is required for activation3d layer.");
			}
		} else {
			console.error("Lack config for ")
		}

	},

	loadModelConfig: function(modelConfig) {

		this.loadBasicModelConfig(modelConfig);

		if (this.color === undefined) {
			this.color = modelConfig.color.activation3d;
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
		this.height = this.inputShape[1];
		this.depth = this.inputShape[2];

		this.outputShape = [this.width, this.height, this.depth];

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.unitLength * this.width;
		this.actualHeight = this.unitLength * this.height;

		for (let i = 0; i < this.depth; i++) {
			this.closeFmCenters.push({
				x: 0,
				y: 0,
				z: 0
			});
			this.openFmCenters.push({
				x: this.lastLayer.openFmCenters[i].x,
				y: this.lastLayer.openFmCenters[i].y,
				z: this.lastLayer.openFmCenters[i].z
			});
		}

		this.leftMostCenter = this.openFmCenters[0];
		this.openHeight = this.actualHeight + this.openFmCenters[this.openFmCenters.length - 1].z - this.openFmCenters[0].z;

	},

	getRelativeElements: function(selectedElement) {

		let relativeElements = [];

		if (selectedElement.elementType === "aggregationElement") {

			let request = {
				all: true
			};

			relativeElements = this.lastLayer.provideRelativeElements(request);

		} else if (selectedElement.elementType === "featureMap") {

			let fmIndex = selectedElement.fmIndex;
			let request = {
				index: fmIndex
			};
			relativeElements = this.lastLayer.provideRelativeElements(request);

		}

		return relativeElements;
	}

});

export { Activation3d };