import MapLayer from './MapLayer';
import FeatureMap from '../../elements/FeatureMap';

function MapInput(config) {

	MapLayer.call(this, config);

	this.shape = config.shape;
	this.width = config.shape[0];
	this.height = config.shape[1];
	this.depth = config.shape[2];
	this.neuralNum = config.shape[0] * config.shape[1];
	this.outputShape = config.shape;
	this.layerType = "input";
}

MapInput.prototype = Object.assign(Object.create(MapLayer.prototype), {

	init: function(center, layerIndex) {

		this.center = center;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		let inputMap = new FeatureMap(this.width, this.height, this.center);

		this.fmList.push(inputMap);

		this.neuralGroup.add(inputMap.getMapElement());

		this.scene.add(this.neuralGroup);

	},

	assemble: function(layerIndex) {
		console.log("Assemble input layer");

		this.layerIndex = layerIndex;
	},

	updateValue: function() {

	}

});

export default MapInput;