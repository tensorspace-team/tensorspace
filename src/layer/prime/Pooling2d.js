import { Layer } from './Layer';
import { FeatureMap } from '../../elements/FeatureMap';
import { colorUtils } from '../../utils/ColorUtils';
import { LayerOpenFactory } from "../../animation/LayerOpen";
import { LayerCloseFactory } from "../../animation/LayerClose";
import { Placeholder } from "../../elements/Placeholder";
import { CloseButton } from "../../elements/CloseButton";
import { CloseButtonHelper } from "../../utils/CloseButtonHelper";

function Pooling2d(config) {

	Layer.call(this, config);

	this.fmCenters = [];
	this.inputShape = undefined;
	this.width = undefined;
	this.height = undefined;
	this.poolSize = config.poolSize;
	this.strides = config.strides;
	this.fmNum = undefined;

	this.depth = undefined;

	if (config.shape !== undefined) {

		this.isShapePredefined = true;
		this.fmShape = config.shape;
		this.width = this.fmShape[0];
		this.height = this.fmShape[1];
	} else {
		this.isShapePredefined = false;
	}

	this.fmList = [];

	this.fmCenters = [];
	this.openFmCenters = [];
	this.closeFmCenters = [];

	this.isOpen = undefined;
	this.closeButton = undefined;

	this.layerType = "maxPool2d";

}

Pooling2d.prototype = Object.assign(Object.create(Layer.prototype), {

	init: function(center) {

		this.center = center;

		for (let i = 0; i < this.lastLayer.openFmCenters.length; i++) {
			let fmCenter = {};
			fmCenter.x = this.lastLayer.openFmCenters[i].x;
			fmCenter.y = this.lastLayer.openFmCenters[i].y;
			fmCenter.z = this.lastLayer.openFmCenters[i].z;
			this.openFmCenters.push(fmCenter);
		}

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		if (this.isOpen) {

			for (let i = 0; i < this.openFmCenters.length; i++) {
				this.fmCenters.push(this.openFmCenters[i]);
			}
			this.initLayerElements(this.openFmCenters);
			this.initCloseButton();

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

			let featureMap = new FeatureMap(this.width, this.height, centers[i], this.color);

			this.fmList.push(featureMap);

			this.neuralGroup.add(featureMap.getMapElement());

		}

		if (this.neuralValue !== undefined) {
			this.updateVis();
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

	initCloseButton: function() {

		let closeButtonPos = CloseButtonHelper.getPosInLayer(this.openFmCenters[0], this.width);

		let closeButton = new CloseButton(closeButtonPos, this.color);
		let closeButtonElement = closeButton.getButton();
		closeButtonElement.layerIndex = this.layerIndex;

		this.closeButton = closeButtonElement;
		this.neuralGroup.add(closeButtonElement);

	},

	disposeCloseButton: function() {

		this.neuralGroup.remove(this.closeButton);
		this.closeButton = undefined;

	},

	initLayerPlaceHolder: function() {

		let placeholder = new Placeholder(this.width, this.height, this.depth, this.color);
		let placeholderElement = placeholder.getPlaceholder();

		placeholderElement.elementType = "placeholder";
		placeholderElement.layerIndex = this.layerIndex;

		this.layerPlaceHolder = placeholderElement;
		this.edgesLine = placeholder.getEdges();

		this.neuralGroup.add(this.layerPlaceHolder);
		this.neuralGroup.add(this.edgesLine);
	},

	disposeLayerPlaceHolder: function() {

		this.neuralGroup.remove(this.layerPlaceHolder);
		this.neuralGroup.remove(this.edgesLine);
		this.layerPlaceHolder = undefined;
		this.edgesLine = undefined;

	},

	assemble: function(layerIndex, modelConfig) {
		this.layerIndex = layerIndex;

		if (this.isShapePredefined) {

		} else {
			this.inputShape = this.lastLayer.outputShape;
			this.width = (this.inputShape[0] - this.poolSize[0]) / this.strides[0] + 1;
			this.height = (this.inputShape[1] - this.poolSize[1]) / this.strides[1] + 1;
			this.fmNum = this.inputShape[2];
			this.outputShape = [this.width, this.height, this.fmNum];
		}

		this.depth = this.lastLayer.depth;

		for (let i = 0; i < this.depth; i++) {

			let center = {
				x: 0,
				y: 0,
				z: 0
			};
			this.closeFmCenters.push(center);

		}

		if (this.isOpen === undefined) {
			this.isOpen = modelConfig.layerInitStatus;
		}

		if (this.color === undefined) {
			this.color = modelConfig.color.pooling;
		}

	},

	updateValue: function(value) {

		this.neuralValue = value;

		if (this.isOpen) {
			this.updateVis();
		}

	},

	updateVis: function() {

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

export { Pooling2d };