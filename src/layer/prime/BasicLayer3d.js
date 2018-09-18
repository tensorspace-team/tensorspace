/**
 * @author syt123450 / https://github.com/syt123450
 */

import {Layer3d} from "../abstract/Layer3d";
import { FmCenterGenerator } from "../../utils/FmCenterGenerator";

function BasicLayer3d(config) {

	Layer3d.call(this, config);

	console.log("construct basic 3D layer.");

	this.color = 0xffffff;

	this.loadLayerConfig(config);

	this.layerType = "basicLayer3d";

}

BasicLayer3d.prototype = Object.assign(Object.create(Layer3d.prototype), {

	loadLayerConfig: function(layerConfig) {

		if (layerConfig !== undefined) {

			if (layerConfig.shape !== undefined) {
				this.width = layerConfig.shape[0];
				this.height = layerConfig.shape[1];
				this.depth = layerConfig.shape[2];
				this.outputShape = [this.width, this.height, this.depth];

				for (let i = 0; i < this.depth; i++) {
					let center = {
						x: 0,
						y: 0,
						z: 0
					};
					this.closeFmCenters.push(center);
				}

			} else {
				console.error("\"shape\" property is required for basicLayer3d.");
			}

		} else {
			console.error("Lack config for basicLayer3d.");
		}

	},

	loadModelConfig: function(modelConfig) {

		this.loadBasicModelConfig(modelConfig);

		if (this.layerShape === undefined) {
			this.layerShape = modelConfig.layerShape;
		}

		if (this.aggregationStrategy === undefined) {
			this.aggregationStrategy = modelConfig.aggregationStrategy;
		}
	},

	assemble: function (layerIndex) {

		this.layerIndex = layerIndex;

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.unitLength * this.width;
		this.actualHeight = this.unitLength * this.height;

		this.openFmCenters = FmCenterGenerator.getFmCenters(this.layerShape, this.depth, this.actualWidth, this.actualHeight);

		this.leftMostCenter = this.openFmCenters[0];
		this.openHeight = this.actualHeight + this.openFmCenters[this.openFmCenters.length - 1].z - this.openFmCenters[0].z;

	}

});

export { BasicLayer3d };