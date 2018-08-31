import { Layer } from './Layer';
import { PaddingMap } from '../../elements/PaddingMap';
import { colorUtils } from '../../utils/ColorUtils';
import { MapAggregation } from "../../elements/MapAggregation";
import { LayerCloseFactory } from "../../animation/LayerClose";
import { LayerOpenFactory } from "../../animation/LayerOpen";
import { CloseButton } from "../../elements/CloseButton";
import { CloseButtonHelper } from "../../utils/CloseButtonHelper";

function Padding2d(config) {

	Layer.call(this, config);

	this.paddingWidth = config.padding[0];
	this.paddingHeight = config.padding[1];
	this.paddingLeft = Math.floor(config.padding[0] / 2);
	this.paddingRight = config.padding[0] - this.paddingLeft;
	this.paddingTop = Math.floor(config.padding[1] / 2);
	this.paddingBottom = config.padding[1] - this.paddingTop;

	this.contentWidth = undefined;
	this.contentHeight = undefined;

	this.width = undefined;
	this.height = undefined;
	this.depth = undefined;

	this.fmList = [];

	this.lastOpenFmCenters = undefined;

	this.fmCenters = [];
	this.openFmCenters = [];
	this.closeFmCenters = [];

	this.isOpen = undefined;
	this.closeButton = undefined;

	this.layerType = "padding2d";

}

Padding2d.prototype = Object.assign(Object.create(Layer.prototype), {

	init: function(center) {

		this.center = center;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		if (this.lastLayer.openFmCenters !== undefined) {

			this.lastOpenFmCenters = this.lastLayer.openFmCenters;

			for (let i = 0; i < this.lastOpenFmCenters.length; i++) {
				let openFmCenter = {};
				openFmCenter.x = this.lastOpenFmCenters[i].x;
				openFmCenter.y = this.lastOpenFmCenters[i].y;
				openFmCenter.z = this.lastOpenFmCenters[i].z;
				this.openFmCenters.push(openFmCenter);

				let closeFmCenter = {};
				closeFmCenter.x = 0;
				closeFmCenter.y = 0;
				closeFmCenter.z = 0;
				this.closeFmCenters.push(closeFmCenter);

			}

		} else {

			let openFmCenter = {
				x: 0,
				y: 0,
				z: 0
			};
			this.openFmCenters.push(openFmCenter);

			let closeFmCenter = {
				x: 0,
				y: 0,
				z: 0
			};
			this.closeFmCenters.push(closeFmCenter);

		}

		if (this.isOpen) {
			this.initSegregationElements();
			this.initCloseButton();
		} else {
			this.initAggregationElement();
		}

		this.scene.add(this.neuralGroup);

	},

	openLayer: function() {

		console.log("open layer");

		if (!this.isOpen) {

			this.disposeAggregationElement();
			this.initSegregationElements(this.closeFmCenters);
			LayerOpenFactory.openMapLayer(this);

		}

	},

	closeLayer: function() {

		console.log("close layer");

		if (this.isOpen) {

			LayerCloseFactory.closeMapLayer(this);

		}

	},

	initSegregationElements: function() {

		for (let i = 0; i < this.openFmCenters.length; i++) {

			let paddingMap = new PaddingMap(
				this.width,
				this.height,
				this.openFmCenters[i],
				this.paddingWidth,
				this.paddingHeight,
				this.color
			);
			this.fmList.push(paddingMap);
			this.neuralGroup.add(paddingMap.getMapElement());

		}

		if (this.neuralValue !== undefined) {
			this.updateSegregationVis();
		}

	},

	disposeSegregationElements: function() {

		let fmNum = this.fmList.length;
		for (let i = 0; i < fmNum; i++) {
			let paddingMap = this.fmList[i];
			this.neuralGroup.remove(paddingMap.getMapElement());
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

	initAggregationElement: function() {

		let placeholder = new MapAggregation(this.width, this.height, this.depth, this.color);
		let placeholderElement = placeholder.getPlaceholder();

		placeholderElement.elementType = "aggregationElement";
		placeholderElement.layerIndex = this.layerIndex;

		this.aggregationElement = placeholderElement;
		this.aggregationEdges = placeholder.getEdges();

		this.neuralGroup.add(this.aggregationElement);
		this.neuralGroup.add(this.aggregationEdges);

	},

	disposeAggregationElement: function() {

		this.neuralGroup.remove(this.aggregationElement);
		this.neuralGroup.remove(this.aggregationEdges);
		this.aggregationElement = undefined;
		this.aggregationEdges = undefined;

	},

	assemble: function(layerIndex, modelConfig) {

		this.layerIndex = layerIndex;

		this.contentWidth = this.lastLayer.width;
		this.contentHeight = this.lastLayer.height;
		this.depth = this.lastLayer.depth;
		this.width = this.contentWidth + this.paddingWidth;
		this.height = this.contentHeight + this.paddingHeight;

		this.outputShape = [this.width, this.height, this.depth];

		if (this.isOpen === undefined) {
			this.isOpen = modelConfig.layerInitStatus;
		}

		if (this.color === undefined) {
			this.color = modelConfig.color.padding;
		}

	},

	updateValue: function() {

		this.neuralValue = this.lastLayer.neuralValue;

		if (this.isOpen) {
			this.updateSegregationVis();
		} else {
			this.updateAggregationVis();
		}

	},

	updateAggregationVis: function() {

	},

	updateSegregationVis: function() {
		let nonePaddingNeuralSize = this.contentWidth * this.contentHeight;
		let fmNum = this.neuralValue.length / nonePaddingNeuralSize;

		let layerOutputValues = [];

		for (let j = 0; j < fmNum; j++) {

			let referredIndex = j;

			while (referredIndex < this.neuralValue.length) {

				layerOutputValues.push(this.neuralValue[referredIndex]);

				referredIndex += fmNum;
			}

		}

		let colors = colorUtils.getAdjustValues(layerOutputValues);

		for (let i = 0; i < fmNum; i++) {

			let paddingMap = this.paddingMapList[i];

			paddingMap.updateGrayScale(colors.slice(i * nonePaddingNeuralSize, (i + 1) * nonePaddingNeuralSize));

		}
	}

});

export { Padding2d };
