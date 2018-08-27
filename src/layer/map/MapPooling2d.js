import MapLayer from './MapLayer';
import FeatureMap from '../../elements/FeatureMap';
import ColorUtils from '../../utils/ColorUtils';
import { LayerOpenFactory } from "../../animation/LayerOpen";
import { LayerCloseFactory } from "../../animation/LayerClose";
import { MapPlaceholder } from "../../elements/MapPlaceholder";

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

	this.fmList = [];

	this.fmCenters = [];
	this.openFmCenters = [];
	this.closeFmCenters = [];

	this.isOpen = undefined;

	this.layerType = "maxPool2d";

}

MapPooling2d.prototype = Object.assign(Object.create(MapLayer.prototype), {

	init: function(center, layerStatus) {

		this.center = center;

		for (let i = 0; i < this.lastLayer.openFmCenters.length; i++) {
			let fmCenter = {};
			fmCenter.x = this.lastLayer.openFmCenters[i].x;
			fmCenter.y = 0;
			fmCenter.z = 0;
			this.openFmCenters.push(fmCenter);
		}

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		this.isOpen = layerStatus;

		if (this.isOpen) {

			for (let i = 0; i < this.openFmCenters.length; i++) {
				this.fmCenters.push(this.openFmCenters[i]);
			}
			this.initLayerElements(this.openFmCenters);

		} else {

			this.initLayerPlaceHolder();

		}

		this.scene.add(this.neuralGroup);

	},

	openLayer: function() {

		console.log("open layer");

		if (!this.isOpen) {

			this.disposeLayerPlaceHolder();
			this.initLayerElements(this.closeFmCenters);
			LayerOpenFactory.openMapLayer(this);

		}

	},

	closeLayer: function() {

		console.log("close layer");

		if (this.isOpen) {

			LayerCloseFactory.closeMapLayer(this);

		}

	},

	initLayerElements: function(centers) {

		for (let i = 0; i < this.fmNum; i++) {

			let featureMap = new FeatureMap(this.width, this.height, centers[i]);

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

		let placeholder = new MapPlaceholder(this.width, this.height, this.depth);
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

	assemble: function(layerIndex) {
		this.layerIndex = layerIndex;

		this.inputShape = this.lastLayer.outputShape;
		this.width = (this.inputShape[0] - this.poolSize[0]) / this.strides[0] + 1;
		this.height = (this.inputShape[1] - this.poolSize[1]) / this.strides[1] + 1;
		this.fmNum = this.inputShape[2];
		this.outputShape = [this.width, this.height, this.fmNum];

		this.depth = this.lastLayer.depth;

		for (let i = 0; i < this.depth; i++) {

			let center = {
				x: 0,
				y: 0,
				z: 0
			};
			this.closeFmCenters.push(center);

		}

		console.log(this.closeFmCenters);
	},

	updateValue: function(value) {

		this.neuralValue = value;

		if (this.isOpen) {
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

	}

});

export default MapPooling2d;