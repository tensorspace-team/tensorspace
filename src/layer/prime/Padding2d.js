import { Layer } from './Layer';
import { PaddingMap } from '../../elements/PaddingMap';
import { colorUtils } from '../../utils/ColorUtils';
import { MapAggregation } from "../../elements/MapAggregation";
import { MapTransitionFactory } from "../../animation/MapTransitionTween";

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

	this.lastOpenFmCenters = undefined;

	this.fmCenters = [];
	this.openFmCenters = [];
	this.closeFmCenters = [];

	this.isOpen = undefined;

	this.layerType = "padding2d";

}

Padding2d.prototype = Object.assign(Object.create(Layer.prototype), {

	init: function(center, actualDepth, nextHookHandler) {

		this.center = center;
		this.actualDepth = actualDepth;
		this.nextHookHandler = nextHookHandler;
		this.lastHookHandler = this.lastLayer.nextHookHandler;

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

		this.leftMostCenter = this.openFmCenters[0];
		this.openHeight = this.actualHeight + this.openFmCenters[this.openFmCenters.length - 1].z - this.openFmCenters[0].z;

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
			MapTransitionFactory.openLayer(this);

		}

	},

	closeLayer: function() {

		console.log("close layer");

		if (this.isOpen) {

			MapTransitionFactory.closeLayer(this);

		}

	},

	initSegregationElements: function() {

		for (let i = 0; i < this.openFmCenters.length; i++) {

			let segregationHandler = new PaddingMap(
				this.width,
				this.height,
				this.actualWidth,
				this.actualHeight,
				this.openFmCenters[i],
				this.paddingWidth,
				this.paddingHeight,
				this.color
			);
			this.segregationHandlers.push(segregationHandler);
			this.neuralGroup.add(segregationHandler.getElement());

		}

		if (this.neuralValue !== undefined) {
			this.updateSegregationVis();
		}

	},

	disposeSegregationElements: function() {

		for (let i = 0; i < this.segregationHandlers.length; i++) {
			this.neuralGroup.remove(this.segregationHandlers[i].getElement());
		}

		this.segregationHandlers = [];

	},

	initAggregationElement: function() {

		let aggregationHandler = new MapAggregation(
			this.width,
			this.height,
			this.actualWidth,
			this.actualHeight,
			this.actualDepth,
			this.color
		);
		aggregationHandler.setLayerIndex(this.layerIndex);

		this.aggregationHandler = aggregationHandler;
		this.neuralGroup.add(this.aggregationHandler.getElement());

	},

	disposeAggregationElement: function() {

		this.neuralGroup.remove(this.aggregationHandler.getElement());
		this.aggregationHandler = undefined;

	},

	assemble: function(layerIndex, modelConfig) {

		this.layerIndex = layerIndex;

		this.contentWidth = this.lastLayer.width;
		this.contentHeight = this.lastLayer.height;
		this.depth = this.lastLayer.depth;
		this.width = this.contentWidth + this.paddingWidth;
		this.height = this.contentHeight + this.paddingHeight;

		this.outputShape = [this.width, this.height, this.depth];

		this.realVirtualRatio = this.lastLayer.realVirtualRatio;
		this.actualWidth = this.width * this.realVirtualRatio;
		this.actualHeight = this.height * this.realVirtualRatio;

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

			this.segregationHandlers[i].updateVis(colors.slice(i * nonePaddingNeuralSize, (i + 1) * nonePaddingNeuralSize));

		}
	},

	getRelativeElements: function(selectedElement) {

		let relativeElements = [];

		if (selectedElement.elementType === "aggregationElement") {

			if (this.lastLayer.isOpen) {

				for (let i = 0; i < this.lastLayer.segregationHandlers.length; i++) {
					relativeElements.push(this.lastLayer.segregationHandlers[i].getElement());
				}

			} else {

				relativeElements.push(this.lastLayer.aggregationHandler.getElement());

			}

		} else if (selectedElement.elementType === "featureMap") {

			if (this.lastLayer.isOpen) {

				let relativeElement = this.lastLayer.segregationHandlers[
					selectedElement.fmIndex
					].getElement();
				relativeElements.push(relativeElement);

			} else {

				relativeElements.push(this.lastLayer.aggregationHandler.getElement());

			}

		} else {
			console.error("Oops, why raycaster selected this element?");
		}

		return relativeElements;
	}

});

export { Padding2d };
