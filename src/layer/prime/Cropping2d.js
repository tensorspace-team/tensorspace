/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Layer3d } from "../abstract/Layer3d";

function Cropping2d(config) {

	Layer3d.call(this, config);

	this.cropping = undefined;
	this.croppingWidth = undefined;
	this.croppingHeight = undefined;

	this.loadLayerConfig(config);

	this.layerType = "Cropping2d";

}

Cropping2d.prototype = Object.assign(Object.create(Layer3d.prototype), {

	loadLayerConfig: function(layerConfig) {

		if (layerConfig !== undefined) {

			if (layerConfig.cropping !== undefined) {
				this.cropping = layerConfig.cropping;
				this.croppingWidth = layerConfig.cropping[0][0] + layerConfig.cropping[0][1];
				this.croppingHeight = layerConfig.cropping[1][0] + layerConfig.cropping[1][1];
			} else {
				console.error("\"cropping\" property is required for cropping2d layer.");
			}

		} else {
			console.error("Lack config for cropping2d layer.");
		}

	},

	loadModelConfig: function(modelConfig) {

		this.loadBasicModelConfig(modelConfig);

		if (this.color === undefined) {
			this.color = modelConfig.color.cropping2d;
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

		this.width = this.inputShape[0] - this.croppingWidth;
		this.height = this.inputShape[1] - this.croppingHeight;

		this.depth = this.inputShape[2];

		this.outputShape = [this.width, this.height, this.depth];

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;
		this.actualHeight = this.height * this.unitLength;

		for (let i = 0; i < this.depth; i++) {

			let closeCenter = {
				x: 0,
				y: 0,
				z: 0
			};

			this.closeFmCenters.push(closeCenter);

			let openCenter = {
				x: this.lastLayer.openFmCenters[i].x,
				y: this.lastLayer.openFmCenters[i].y,
				z: this.lastLayer.openFmCenters[i].z
			};

			this.openFmCenters.push(openCenter);

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

export { Cropping2d };
