import { MapLayer } from './MapLayer';
import { FeatureMap } from '../../elements/FeatureMap';
import { colorUtils } from '../../utils/ColorUtils';
import { fmCenterGenerator } from '../../utils/FmCenterGenerator';
import { LayerOpenFactory } from "../../animation/LayerOpen";
import { LayerCloseFactory } from "../../animation/LayerClose";
import { MapPlaceholder } from "../../elements/MapPlaceholder";

function Conv2d(config) {

	MapLayer.call(this, config);

	console.log("construct map Conv2d");

	this.kernelSize = config.kernelSize;
	this.filters = config.filters;
	this.strides = config.strides;
	this.fmShape = undefined;
	this.width = undefined;
	this.height = undefined;
	this.depth = config.filters;

	this.fmCenters = [];
	this.openFmCenters = [];
	this.closeFmCenters = [];

	for (let i = 0; i < this.depth; i++) {
		let center = {
			x: 0,
			y: 0,
			z: 0
		};
		this.closeFmCenters.push(center);
	}

	this.layerType = "map conv2d";

	if (config.shape !== undefined) {

		this.isShapePredefined = true;
		this.fmShape = config.shape;
		this.width = this.fmShape[0];
		this.height = this.fmShape[1];
	} else {
		this.isShapePredefined = false;
	}

	this.isOpen = undefined;
	this.layerShape = undefined;

}

Conv2d.prototype = Object.assign(Object.create(MapLayer.prototype), {

	init: function (center) {

		this.center = center;
		this.openFmCenters = fmCenterGenerator.getFmCenters(this.layerShape, this.filters, this.width, this.height);

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

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

	openLayer: function () {

		console.log("open layer");

		if (!this.isOpen) {

			this.disposeLayerPlaceHolder();
			this.initLayerElements(this.closeFmCenters);
			LayerOpenFactory.openMapLayer(this);

		}


	},

	closeLayer: function () {

		console.log("close layer");

		if (this.isOpen) {

			LayerCloseFactory.closeMapLayer(this);

		}

	},

	initLayerElements: function (centers) {

		for (let i = 0; i < this.filters; i++) {
			let featureMap = new FeatureMap(this.width, this.height, centers[i], this.color);
			this.fmList.push(featureMap);
			this.neuralGroup.add(featureMap.getMapElement());
		}

		if (this.neuralValue !== undefined) {
			this.updateVis();
		}

	},

	disposeLayerElements: function () {

		let fmNum = this.fmList.length;
		for (let i = 0; i < fmNum; i++) {
			let featureMap = this.fmList[i];
			this.neuralGroup.remove(featureMap.getMapElement());
		}

		this.fmList = [];

	},

	initLayerPlaceHolder: function () {

		let placeholder = new MapPlaceholder(this.width, this.height, this.depth);
		let placeholderElement = placeholder.getPlaceholder();

		placeholderElement.elementType = "placeholder";
		placeholderElement.layerIndex = this.layerIndex;

		this.layerPlaceHolder = placeholderElement;

		this.neuralGroup.add(placeholderElement);

	},

	disposeLayerPlaceHolder: function () {

		this.neuralGroup.remove(this.layerPlaceHolder);
		this.layerPlaceHolder = undefined;

	},

	assemble: function (layerIndex, modelConfig) {

		console.log("Assemble conv2d, layer index: " + layerIndex);

		this.layerIndex = layerIndex;

		if (this.isShapePredefined) {

		} else {
			this.inputShape = this.lastLayer.outputShape;
			this.width = (this.inputShape[0] - this.kernelSize) / this.strides + 1;
			this.height = (this.inputShape[1] - this.kernelSize) / this.strides + 1;
			this.fmShape = [this.width, this.height];
		}

		this.outputShape = [this.width, this.height, this.filters];

		if (this.isOpen === undefined) {

			this.isOpen = modelConfig.layerInitStatus;
		}

		if (this.color === undefined) {
			this.color = modelConfig.color.conv;
		}

		if (this.layerShape === undefined) {
			this.layerShape = modelConfig.layerShape;
		}

	},

	updateValue: function (value) {

		this.neuralValue = value;

		if (this.isOpen) {
			this.updateVis();
		}
	},

	updateVis: function () {

		let layerOutputValues = [];

		for (let j = 0; j < this.depth; j++) {

			let referredIndex = j;

			while (referredIndex < this.neuralValue.length) {

				layerOutputValues.push(this.neuralValue[referredIndex]);

				referredIndex += this.depth;
			}

		}

		let colors = colorUtils.getAdjustValues(layerOutputValues);

		let featureMapSize = this.width * this.height;

		for (let i = 0; i < this.depth; i++) {

			let featureMap = this.fmList[i];
			featureMap.updateGrayScale(colors.slice(i * featureMapSize, (i + 1) * featureMapSize));

		}

	}

});

export { Conv2d };