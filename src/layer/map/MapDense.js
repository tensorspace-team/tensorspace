import MapLayer from './MapLayer';
import NeuralQueue from '../../elements/NeuralQueue';
import ColorUtils from '../../utils/ColorUtils';

function MapDense(config) {

	MapLayer.call(this, config);

	this.units = config.units;
	this.depth = 1;
	this.neuralQueue = undefined;

}

MapDense.prototype = Object.assign(Object.create(MapLayer.prototype), {

	init: function(center) {

		this.center = center;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		let neuralQueue = new NeuralQueue(this.units);

		this.neuralQueue = neuralQueue;

		this.neuralGroup.add(neuralQueue.getQueueElement());

		this.scene.add(this.neuralGroup);

	},

	assemble: function(layerIndex) {

		this.layerIndex = layerIndex;

		this.outputShape = [this.units, 1, 1];

	},

	updateValue: function(value) {

		let greyPixelArray = ColorUtils.getColors(value);

		this.neuralQueue.updateGrayScale(greyPixelArray);

	}

});


export default MapDense;