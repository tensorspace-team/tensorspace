import MapLayer from './MapLayer';
import FeatureMap from '../../elements/FeatureMap';

function MapConv2d(config) {

	MapLayer.call(this, config);

	console.log("construct map Conv2d");

	this.kernelSize = config.kernelSize;
	this.filters = config.filters;
	this.strides = config.strides;
	this.fmShape = undefined;
	this.width = undefined;
	this.height = undefined;
	this.fmCenters = [];
	this.depth = config.filters;
	this.layerType = "map conv2d";

}

MapConv2d.prototype = Object.assign(Object.create(MapLayer.prototype), {

	init: function(center) {

		this.center = center;
		this.fmCenters = calculateFmCenters(this.filters, this.width);

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		for (let i = 0; i < this.filters; i++) {
			let featureMap = new FeatureMap(this.width, this.height, this.fmCenters[i]);
			this.fmList.push(featureMap);
			this.neuralGroup.add(featureMap.getMapElement());
		}

		this.scene.add(this.neuralGroup);

		function calculateFmCenters(filters, width) {

			let fmCenters = [];

			let fmLength = width;
			let fmInterval = 10;
			let initXTranslate;

			initXTranslate = - (filters - 1) / 2 * (fmLength + fmInterval);

			for (let i = 0; i < filters; i++) {

				let xTranslate = initXTranslate + (fmLength + fmInterval) * i;
				let fmCenter = {};
				fmCenter.x = xTranslate;
				fmCenter.y = 0;
				fmCenter.z = 0;
				fmCenters.push(fmCenter);

			}

			return fmCenters;

		}

	},

	assemble: function(layerIndex) {

		console.log("Assemble conv2d, layer index: " + layerIndex);

		this.layerIndex = layerIndex;

		this.inputShape = this.lastLayer.outputShape;
		this.width = (this.inputShape[0] - this.kernelSize) / this.strides + 1;
		this.height = (this.inputShape[1] - this.kernelSize) / this.strides + 1;
		this.fmShape = [this.width, this.height];
		this.outputShape = [this.width, this.height, this.filters];

	},

	updateValue: function() {

	}

});

export default MapConv2d;