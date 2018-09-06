import { Layer } from './Layer';
import { PaddingMap } from '../../elements/PaddingMap';
import { colorUtils } from '../../utils/ColorUtils';
import { MapAggregation } from "../../elements/MapAggregation";
import { MapTransitionFactory } from "../../animation/MapTransitionTween";
import {MapDataGenerator} from "../../utils/MapDataGenerator";

function Padding2d(config) {

	Layer.call(this, config);

	this.paddingWidth = undefined;
	this.paddingHeight = undefined;
	this.paddingLeft = undefined;
	this.paddingRight = undefined;
	this.paddingTop = undefined;
	this.paddingBottom = undefined;

	this.contentWidth = undefined;
	this.contentHeight = undefined;

	this.width = undefined;
	this.height = undefined;
	this.depth = undefined;

	this.lastOpenFmCenters = undefined;

	this.fmCenters = [];
	this.openFmCenters = [];
	this.closeFmCenters = [];
	this.aggregationStrategy = undefined;

	this.loadLayerConfig(config);

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

	loadLayerConfig: function(layerConfig) {

		if (layerConfig !== undefined) {

			if (config.padding !== undefined) {
				this.paddingWidth = config.padding[0];
				this.paddingHeight = config.padding[1];
				this.paddingLeft = Math.floor(config.padding[0] / 2);
				this.paddingRight = config.padding[0] - this.paddingLeft;
				this.paddingTop = Math.floor(config.padding[1] / 2);
				this.paddingBottom = config.padding[1] - this.paddingTop;
			} else {
				console.error("\npadding\" property is required for padding layer");
			}

		}

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

			segregationHandler.setLayerIndex(this.layerIndex);
			segregationHandler.setFmIndex(i);

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

		if (this.neuralValue !== undefined) {
			this.updateAggregationVis();
		}

	},

	disposeAggregationElement: function() {

		this.neuralGroup.remove(this.aggregationHandler.getElement());
		this.aggregationHandler = undefined;

	},

	loadModelConfig: function(modelConfig) {
		if (this.isOpen === undefined) {
			this.isOpen = modelConfig.layerInitStatus;
		}

		if (this.color === undefined) {
			this.color = modelConfig.color.padding2d;
		}

		if (this.relationSystem === undefined) {
			this.relationSystem = modelConfig.relationSystem;
		}

		if (this.textSystem === undefined) {
			this.textSystem = modelConfig.textSystem;
		}

		if (this.aggregationStrategy === undefined) {
			this.aggregationStrategy = modelConfig.aggregationStrategy;
		}
	},

	assemble: function(layerIndex) {

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

		let aggregationUpdateValue = MapDataGenerator.generateChannelData(this.neuralValue, this.depth, this.aggregationStrategy);

		let colors = colorUtils.getAdjustValues(aggregationUpdateValue);

		this.aggregationHandler.updateVis(colors);

	},

	updateSegregationVis: function() {

		let layerOutputValues = MapDataGenerator.generateChannelData(this.neuralValue, this.depth);

		let colors = colorUtils.getAdjustValues(layerOutputValues);

		for (let i = 0; i < this.segregationHandlers.length; i++) {

			this.segregationHandlers[i].updateVis(colors.slice(i * this.contentWidth * this.contentHeight, (i + 1) * this.contentWidth * this.contentHeight));

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

		} else if (selectedElement.elementType === "paddingMap") {

			if (this.lastLayer.isOpen) {

				let relativeElement = this.lastLayer.segregationHandlers[
					selectedElement.fmIndex
					].getElement();
				relativeElements.push(relativeElement);

			} else {

				relativeElements.push(this.lastLayer.aggregationHandler.getElement());

			}

		}

		return relativeElements;
	},

	handleClick: function(clickedElement) {

		if (clickedElement.elementType === "aggregationElement") {

			this.openLayer();
		} else if (clickedElement.elementType === "closeButton") {
			this.closeLayer();
		}

	},

	handleHoverIn: function(hoveredElement) {

		if (this.relationSystem !== undefined && this.relationSystem) {
			this.initLineGroup(hoveredElement);
		}

		if (this.textSystem !== undefined && this.textSystem) {
			this.showText(hoveredElement);
		}

	},

	handleHoverOut: function() {

		if (this.relationSystem !== undefined && this.relationSystem) {
			this.disposeLineGroup();
		}

		if (this.textSystem !== undefined && this.textSystem) {
			this.hideText();
		}

	},

	showText: function(element) {

		if (element.elementType === "paddingMap") {

			let fmIndex = element.fmIndex;
			this.segregationHandlers[fmIndex].showText();
			this.textElementHandler = this.segregationHandlers[fmIndex];

		}

	},

	hideText: function() {

		if (this.textElementHandler !== undefined) {

			this.textElementHandler.hideText();
			this.textElementHandler = undefined;
		}

	}

});

export { Padding2d };
