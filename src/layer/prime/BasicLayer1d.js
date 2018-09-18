/**
 * @author syt123450 / https://github.com/syt123450
 */

import {Layer1d} from "../abstract/Layer1d";

function BasicLayer1d(config) {

	Layer1d.call(this, config);

	this.color = 0xffffff;

	this.loadLayerConfig(config);

	this.layerType = "basicLayer1d";

}

BasicLayer1d.prototype = Object.assign(Object.create(Layer1d.prototype), {

	loadLayerConfig: function(layerConfig) {

		if (layerConfig !== undefined) {

			if (layerConfig.shape !== undefined) {
				this.width = layerConfig.shape[0];
				this.units = layerConfig.shape[0];
				this.outputShape = [this.width];
			} else {
				console.error("\"shape\" property is required for Layer1d.");
			}

		} else {
			console.error("Lack config for Layer1d.");
		}

	},

	loadModelConfig: function(modelConfig) {

		this.loadBasicModelConfig(modelConfig);

	},

	assemble: function(layerIndex) {

		this.layerIndex = layerIndex;

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.unitLength * this.width;

		if (this.lastLayer.layerDimension === 1) {

			this.lastActualWidth = this.lastLayer.lastActualWidth;
			this.lastActualHeight = this.lastLayer.lastActualHeight;
		} else {
			this.lastActualWidth = this.lastLayer.actualWidth;
			this.lastActualHeight = this.lastLayer.actualHeight;
		}

	}

});

export { BasicLayer1d };
