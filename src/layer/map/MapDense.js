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

	init: function(center, layerStatus) {

		this.center = center;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		if (layerStatus) {

			let neuralQueue = new NeuralQueue(this.units);
			this.neuralQueue = neuralQueue;
			this.neuralGroup.add(neuralQueue.getQueueElement());

		} else {

			let geometry = new THREE.BoxGeometry(10, 10, 10);
			let material = new THREE.MeshBasicMaterial({
				color: new THREE.Color( 1, 1, 1 )
			});

			let layerPlaceHolder = new THREE.Mesh(geometry, material);

			layerPlaceHolder.position.set(0, 0, 0);

			this.neuralGroup.add(layerPlaceHolder);

		}


		this.scene.add(this.neuralGroup);

	},

	assemble: function(layerIndex) {

		this.layerIndex = layerIndex;

		this.outputShape = [this.units, 1, 1];

	},

	updateValue: function(value) {

		this.neuralValue = value;

		let colors = ColorUtils.getAdjustValues(value);

		this.neuralQueue.updateGrayScale(colors);

	}

});


export default MapDense;