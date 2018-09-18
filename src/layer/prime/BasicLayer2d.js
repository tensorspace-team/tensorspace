/**
 * @author syt123450 / https://github.com/syt123450
 */

import {Layer2d} from "../abstract/Layer2d";
import {QueueCenterGenerator} from "../../utils/QueueCenterGenerator";

function BasicLayer2d(config) {

	Layer2d.call(this, config);

	this.color = 0xffffff;

	this.loadLayerConfig(config);

	this.layerType = "basicLayer2d";

}

BasicLayer2d.prototype = Object.assign(Object.create(Layer2d.prototype), {

	loadLayerConfig: function(layerConfig) {

		if (layerConfig !== undefined) {

			if (layerConfig.shape !== undefined) {
				this.width = layerConfig.shape[0];
				this.depth = layerConfig.shape[1];
				this.outputShape = [this.width, this.depth];

				for (let i = 0; i < this.depth; i++) {
					let center = {
						x: 0,
						y: 0,
						z: 0
					};
					this.closeCenterList.push(center);
				}
			} else {
				console.error("\"shape\" property is required for Layer2d.");
			}

		} else {
			console.error("Lack config for Layer2d.");
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

	assemble: function(layerIndex) {

		this.layerIndex = layerIndex;

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.unitLength * this.width;

		this.openCenterList = QueueCenterGenerator.getCenterList(this.actualWidth, this.depth);

	}

});

export { BasicLayer2d };