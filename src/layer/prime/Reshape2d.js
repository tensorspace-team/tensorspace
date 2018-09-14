import {fmCenterGenerator} from "../../utils/FmCenterGenerator";
import { Layer3d } from "../abstract/Layer3d";

function Reshape2d(config) {

	Layer3d.call(this, config);

	this.targetShape = undefined;

	// set init size to be 1
	this.totalSize = 1;

	this.loadLayerConfig(config);

	this.layerType = "reshape2d";

}

Reshape2d.prototype = Object.assign(Object.create(Layer3d.prototype), {

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

		this.loadBasicModelConfig(modelConfig);

		if (this.color === undefined) {
			this.color = modelConfig.color.reshape;
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

	getRelativeElements: function(selectedElement) {

		let relativeElements = [];

		if (selectedElement.elementType === "aggregationElement") {

			let request = {
				all: true
			};

			relativeElements = this.lastLayer.provideRelativeElements(request).elementList;

		} else if (selectedElement.elementType === "featureMap") {

			// as reshape layer's feature map number is different with last layer, will not show relation lines

		}

		return relativeElements;

	}

});

export { Reshape2d };