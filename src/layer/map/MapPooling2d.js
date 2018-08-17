import MapLayer from './MapLayer';
import FeatureMap from '../../elements/FeatureMap';
import ColorUtils from '../../utils/ColorUtils';

function MapPooling2d(config) {

	MapLayer.call(this, config);

	this.fmCenters = [];
	this.inputShape = undefined;
	this.width = undefined;
	this.height = undefined;
	this.poolSize = config.poolSize;
	this.strides = config.strides;
	this.fmNum = undefined;

	this.depth = undefined;

	this.layerType = "maxPool2d";

}

MapPooling2d.prototype = Object.assign(Object.create(MapLayer.prototype), {

	init: function(center) {

		this.center = center;

		for (let i = 0; i < this.lastLayer.fmCenters.length; i++) {
			let fmCenter = {};
			fmCenter.x = this.lastLayer.fmCenters[i].x;
			fmCenter.y = 0;
			fmCenter.z = 0;
			this.fmCenters.push(fmCenter);
		}

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		for (let i = 0; i < this.fmNum; i++) {

			let fmCenter = this.fmCenters[i];

			let featureMap = new FeatureMap(this.width, this.height, fmCenter);

			this.fmList.push(featureMap);

			this.neuralGroup.add(featureMap.getMapElement());

		}

		this.scene.add(this.neuralGroup);

	},

	assemble: function(layerIndex) {
		this.layerIndex = layerIndex;

		this.inputShape = this.lastLayer.outputShape;
		this.width = (this.inputShape[0] - this.poolSize[0]) / this.strides[0] + 1;
		this.height = (this.inputShape[1] - this.poolSize[1]) / this.strides[1] + 1;
		this.fmNum = this.inputShape[2];
		this.outputShape = [this.width, this.height, this.fmNum];

		this.depth = this.lastLayer.depth;
	},

	updateValue: function(value) {

		let layerOutputValues = [];

		for (let j = 0; j < this.depth; j++) {

			let referredIndex = j;

			while (referredIndex < value.length) {

				layerOutputValues.push(value[referredIndex]);

				referredIndex += this.depth;
			}

		}

		let greyPixelArray = ColorUtils.getColors(layerOutputValues);

		let featureMapSize = this.width * this.height;

		for (let i = 0; i < this.depth; i++) {

			let featureMap = this.fmList[i];
			featureMap.updateGrayScale(greyPixelArray.slice(i * featureMapSize, (i + 1) * featureMapSize));

		}

	}

});

export default MapPooling2d;