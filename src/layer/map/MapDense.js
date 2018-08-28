import MapLayer from './MapLayer';
import NeuralQueue from '../../elements/NeuralQueue';
import ColorUtils from '../../utils/ColorUtils';
import {MapPlaceholder} from "../../elements/MapPlaceholder";
import {LayerOpenFactory} from "../../animation/LayerOpen";
import {LayerCloseFactory} from "../../animation/LayerClose";

function MapDense(config) {

	MapLayer.call(this, config);

	this.units = config.units;
	this.depth = 1;
	this.neuralQueue = undefined;

	this.isOpen = undefined;

}

MapDense.prototype = Object.assign(Object.create(MapLayer.prototype), {

	init: function(center) {

		this.center = center;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		if (this.isOpen) {

			this.initLayerElements();

		} else {

			this.initLayerPlaceHolder();

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

	initLayerElements: function() {

		let neuralQueue = new NeuralQueue(this.units, this.color);
		this.neuralQueue = neuralQueue;
		this.neuralGroup.add(neuralQueue.getQueueElement());

		if (this.neuralValue !== undefined) {
			this.updateVis();
		}

	},

	disposeLayerElements: function() {

		console.log("dispose queue element");

		this.neuralGroup.remove(this.neuralQueue.getQueueElement());
		this.neuralQueue = undefined;

	},

	initLayerPlaceHolder: function() {

		let placeholder = new MapPlaceholder(5, 5, 5);
		let placeholderElement = placeholder.getPlaceholder();

		placeholderElement.elementType = "placeholder";
		placeholderElement.layerIndex = this.layerIndex;

		this.layerPlaceHolder = placeholderElement;

		this.neuralGroup.add(placeholderElement);

	},

	disposeLayerPlaceHolder: function() {

		this.neuralGroup.remove(this.layerPlaceHolder);
		this.layerPlaceHolder = undefined;

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
			this.updateVis();
		}

	},

	updateVis: function() {
		let colors = ColorUtils.getAdjustValues(this.neuralValue);

		this.neuralQueue.updateGrayScale(colors);
	}

});


export default MapDense;