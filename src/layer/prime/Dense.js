import { Layer } from './Layer';
import { NeuralQueue } from '../../elements/NeuralQueue';
import { colorUtils } from '../../utils/ColorUtils';
import { DenseAggregation } from "../../elements/DenseAggregation";
import {LayerOpenFactory} from "../../animation/LayerOpen";
import {LayerCloseFactory} from "../../animation/LayerClose";

function Dense(config) {

	Layer.call(this, config);

	this.units = config.units;
	this.width = config.units;
	this.depth = 1;
	this.neuralQueue = undefined;

	this.leftMostCenter = {
		x: 0,
		y: 0,
		z: 0
	};

	this.isOpen = undefined;

}

Dense.prototype = Object.assign(Object.create(Layer.prototype), {

	init: function(center) {

		this.center = center;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		if (this.isOpen) {

			this.initSegregationElements();
			this.initCloseButton();

		} else {

			this.initAggregationElement();

		}

		this.scene.add(this.neuralGroup);

	},

	openLayer: function() {

		if (!this.isOpen) {

			LayerOpenFactory.openQueueLayer(this);

			this.isOpen = true;

		}

	},

	closeLayer: function() {

		if (this.isOpen) {

			LayerCloseFactory.closeQueueLayer(this);

			this.isOpen = false;
		}

	},

	initSegregationElements: function() {

		let neuralQueue = new NeuralQueue(this.units, this.color);
		this.neuralQueue = neuralQueue;
		this.neuralGroup.add(neuralQueue.getElement());

		if (this.neuralValue !== undefined) {
			this.updateSegregationVis();
		}

	},

	disposeSegregationElements: function() {

		console.log("dispose queue element");

		this.neuralGroup.remove(this.neuralQueue.getElement());
		this.neuralQueue = undefined;

	},

	initAggregationElement: function() {

		let aggregationHandler = new DenseAggregation(5, 5, 5, this.color);
		aggregationHandler.setLayerIndex(this.layerIndex);

		this.aggregationHandler = aggregationHandler;
		this.neuralGroup.add(this.aggregationHandler.getElement());

	},

	disposeAggregationElement: function() {

		this.neuralGroup.remove(this.aggregationHandler.getElement());
		this.aggregationHandler = undefined;

	},

	assemble: function(layerIndex, modelConfig) {

		this.layerIndex = layerIndex;

		this.outputShape = [this.units, 1, 1];

		if (this.isOpen === undefined) {
			this.isOpen = modelConfig.layerInitStatus;
		}

		if (this.color === undefined) {
			this.color = modelConfig.color.dense;
		}

	},

	updateValue: function(value) {

		this.neuralValue = value;

		if (this.isOpen) {
			this.updateSegregationVis();
		} else {
			this.updateAggregationVis();
		}

	},

	updateAggregationVis: function() {

	},

	updateSegregationVis: function() {
		let colors = colorUtils.getAdjustValues(this.neuralValue);

		this.neuralQueue.updateVis(colors);
	},

	clear: function() {

		if (this.neuralValue !== undefined) {

			if (this.isOpen) {

				let zeroValue = new Int8Array(this.neuralValue.length);
				let zeroColors = colorUtils.getAdjustValues(zeroValue);
				this.updateValue(zeroColors);

			}

			this.neuralValue = undefined;

		}

	}

});


export { Dense };