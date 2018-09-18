/**
 * @author syt123450 / https://github.com/syt123450
 */

import { FmCenterGenerator } from "../../utils/FmCenterGenerator";
import {MergedLayer} from "./MergedLayer";
import { ChannelDataGenerator } from "../../utils/ChannelDataGenerator";
import { ColorUtils } from "../../utils/ColorUtils";
import { MapTransitionFactory } from "../../animation/MapTransitionTween";
import { CloseButtonRatio } from "../../utils/Constant";
import { MergedAggregation } from "../../elements/MergedAggregation";
import { MergedFeatureMap } from "../../elements/MergedFeatureMap";
import {StrategyFactory} from "../../merge/strategy/StrategyFactory";

function MergedLayer3d(config) {

	MergedLayer.call(this, config);

	console.log("construct merged layer 3d.");

	this.width = undefined;
	this.height = undefined;
	this.depth = undefined;

	this.layerDimension = 3;

	// store all layer segregation references as a list
	this.segregationHandlers = [];

	// used to define close sphere size
	this.openHeight = undefined;

	this.openFmCenters = [];
	this.closeFmCenters = [];

	this.aggregationStrategy = undefined;

	this.mergedElements = [];

	this.operationStrategy = undefined;

	this.layerType = "mergedLayer3d";

	this.loadLayerConfig(config);

}

MergedLayer3d.prototype = Object.assign(Object.create(MergedLayer.prototype), {

	loadLayerConfig: function(layerConfig) {

		if (layerConfig !== undefined) {
			if (layerConfig.operator !== undefined) {
				this.operator = layerConfig.operator;
			}

			if (layerConfig.mergedElements !== undefined) {
				for (let i = 0; i < layerConfig.mergedElements.length; i++) {
					this.mergedElements.push(layerConfig.mergedElements[i]);
				}
			}

			this.operationStrategy = StrategyFactory.getOperationStrategy(this.operator, 3, this.mergedElements);

		}

		this.loadBasicLayerConfig(layerConfig.userConfig);

	},

	loadModelConfig: function(modelConfig) {

		this.loadBasicModelConfig(modelConfig);

		if (this.layerShape === undefined) {
			this.layerShape = modelConfig.layerShape;
		}

		if (this.aggregationStrategy === undefined) {
			this.aggregationStrategy = modelConfig.aggregationStrategy;
		}

		if (this.color === undefined) {
			this.color = modelConfig.color[this.operator];
		}

	},

	assemble: function(layerIndex) {

		this.layerIndex = layerIndex;
		this.operationStrategy.setLayerIndex(this.layerIndex);

		if(!this.operationStrategy.validate()) {
			console.error("input shape is not valid for " + this.operator + " merge function.");
		}

		this.inputShape = this.operationStrategy.getShape();

		this.width = this.inputShape[0];
		this.height = this.inputShape[1];
		this.depth = this.inputShape[2];

		this.outputShape = [this.width, this.height, this.depth];

		this.unitLength = this.mergedElements[0].unitLength;
		this.actualWidth = this.unitLength * this.width;
		this.actualHeight = this.unitLength * this.height;

		for (let i = 0; i < this.depth; i++) {
			let center = {
				x: 0,
				y: 0,
				z: 0
			};
			this.closeFmCenters.push(center);
		}

		this.openFmCenters = FmCenterGenerator.getFmCenters(this.layerShape, this.depth, this.actualWidth, this.actualHeight);

		this.leftMostCenter = this.openFmCenters[0];
		this.openHeight = this.actualHeight + this.openFmCenters[this.openFmCenters.length - 1].z - this.openFmCenters[0].z;

	},

	init: function(center, actualDepth) {

		this.center = center;
		this.actualDepth = actualDepth;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		if (this.depth === 1) {
			this.isOpen = true;
			this.initSegregationElements(this.openFmCenters);
		} else {
			if (this.isOpen) {

				this.initSegregationElements(this.openFmCenters);
				this.initCloseButton();

			} else {

				this.initAggregationElement();

			}
		}

		this.scene.add(this.neuralGroup);

	},

	openLayer: function () {

		if (!this.isOpen) {

			MapTransitionFactory.openLayer(this);

		}

	},

	closeLayer: function () {

		if (this.isOpen) {

			MapTransitionFactory.closeLayer(this);

		}

	},

	initSegregationElements: function(centers) {

		for (let i = 0; i < this.depth; i++) {

			let segregationHandler = new MergedFeatureMap(
				this.operator,
				this.width,
				this.height,
				this.actualWidth,
				this.actualHeight,
				centers[i],
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

	disposeSegregationElements: function () {

		for (let i = 0; i < this.segregationHandlers.length; i++) {
			let segregationHandler = this.segregationHandlers[i];
			this.neuralGroup.remove(segregationHandler.getElement());
		}

		this.segregationHandlers = [];

	},

	initAggregationElement: function() {

		let aggregationHandler = new MergedAggregation(
			this.operator,
			this.width,
			this.height,
			this.actualWidth,
			this.actualHeight,
			this.actualDepth,
			this.color
		);
		aggregationHandler.setLayerIndex(this.layerIndex);

		this.aggregationHandler = aggregationHandler;
		this.neuralGroup.add(aggregationHandler.getElement());

		if (this.neuralValue !== undefined) {
			this.updateAggregationVis();
		}

	},

	disposeAggregationElement: function () {

		this.neuralGroup.remove(this.aggregationHandler.getElement());
		this.aggregationHandler = undefined;

	},

	updateValue: function (value) {

		this.neuralValue = value;

		if (this.isOpen) {
			this.updateSegregationVis();
		} else {
			this.updateAggregationVis();
		}
	},

	updateAggregationVis: function() {

		let aggregationUpdateValue = ChannelDataGenerator.generateAggregationData(this.neuralValue, this.depth, this.aggregationStrategy);

		let colors = ColorUtils.getAdjustValues(aggregationUpdateValue);

		this.aggregationHandler.updateVis(colors);

	},

	updateSegregationVis: function() {

		let layerOutputValues = ChannelDataGenerator.generateChannelData(this.neuralValue, this.depth);

		let colors = ColorUtils.getAdjustValues(layerOutputValues);

		let featureMapSize = this.width * this.height;

		for (let i = 0; i < this.depth; i++) {

			this.segregationHandlers[i].updateVis(colors.slice(i * featureMapSize, (i + 1) * featureMapSize));

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

	calcCloseButtonSize: function() {
		return this.openHeight * CloseButtonRatio;
	},

	calcCloseButtonPos: function() {

		let leftMostCenter = this.openFmCenters[0];

		return {

			x: leftMostCenter.x - this.actualWidth/ 2 - 30,
			y: 0,
			z: 0

		};

	},

	clear: function() {

		if (this.neuralValue !== undefined) {
			if (this.isOpen) {
				for (let i = 0; i < this.segregationHandlers.length; i++) {
					this.segregationHandlers[i].clear();
				}
			} else {
				this.aggregationHandler.clear();
			}
			this.neuralValue = undefined;
		}

	},

	provideRelativeElements: function(request) {

		let relativeElements = [];

		if (request.all !== undefined && request.all) {

			if (this.isOpen) {

				for (let i = 0; i < this.segregationHandlers.length; i++) {
					relativeElements.push(this.segregationHandlers[i].getElement());
				}

			} else {

				relativeElements.push(this.aggregationHandler.getElement());

			}

		} else {
			if (request.index !== undefined) {

				if (this.isOpen) {
					relativeElements.push(this.segregationHandlers[request.index].getElement());
				} else {
					relativeElements.push(this.aggregationHandler.getElement());
				}

			}
		}

		return {
			isOpen: this.isOpen,
			elementList: relativeElements
		};

	},

	handleClick: function(clickedElement) {

		if (clickedElement.elementType === "aggregationElement") {
			this.openLayer();
		} else if (clickedElement.elementType === "closeButton") {
			this.closeLayer();
		}

	},

	showText: function(element) {

		if (element.elementType === "featureMap") {

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

	},

	getRelativeElements: function(selectedElement) {

		return this.operationStrategy.getRelativeElements(selectedElement);

	}

});

export { MergedLayer3d };
