import MapLayer from './MapLayer';
import FeatureMap from '../../elements/FeatureMap';
import ColorUtils from '../../utils/ColorUtils';
import FmCenterGenerator from '../../utils/FmCenterGenerator';

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

	init: function(center, layerStatus) {

		this.center = center;
		this.fmCenters = FmCenterGenerator.getFmCenters("line", this.filters, this.width, this.height);

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		if (layerStatus) {
			this.initLayerElements();
		} else {
			this.initLayerPlaceHolder();
		}

		this.scene.add(this.neuralGroup);

	},

	initLayerElements: function() {

		for (let i = 0; i < this.filters; i++) {
			let featureMap = new FeatureMap(this.width, this.height, this.fmCenters[i]);
			this.fmList.push(featureMap);
			this.neuralGroup.add(featureMap.getMapElement());
		}

	},

	disposeLayerElements: function() {

		let fmNum = this.fmList.length;
		for (let i = 0; i < fmNum; i++) {
			let featureMap = this.fmList[i];
			this.neuralGroup.remove(featureMap.getMapElement());
		}

		this.fmList = [];

	},

	initLayerPlaceHolder: function() {

		let geometry = new THREE.BoxGeometry(this.width, this.depth, this.height);
		let material = new THREE.MeshBasicMaterial({
			color: new THREE.Color( 1, 1, 1 )
		});

		let layerPlaceHolder = new THREE.Mesh(geometry, material);

		layerPlaceHolder.position.set(0, 0, 0);

		this.layerPlaceHolder = layerPlaceHolder;

		this.neuralGroup.add(layerPlaceHolder);

	},

	disposeLayerPlaceHolder: function() {

		this.neuralGroup.remove(this.layerPlaceHolder);
		this.layerPlaceHolder = undefined;

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

	updateValue: function(value) {

		this.neuralValue = value;

		let layerOutputValues = [];

		for (let j = 0; j < this.depth; j++) {

			let referredIndex = j;

			while (referredIndex < value.length) {

				layerOutputValues.push(value[referredIndex]);

				referredIndex += this.depth;
			}

		}

		let colors = ColorUtils.getAdjustValues(layerOutputValues);

		let featureMapSize = this.width * this.height;

		for (let i = 0; i < this.depth; i++) {

			let featureMap = this.fmList[i];
			featureMap.updateGrayScale(colors.slice(i * featureMapSize, (i + 1) * featureMapSize));

		}
	}

});

export default MapConv2d;