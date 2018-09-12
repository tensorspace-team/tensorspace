import {Layer} from "./Layer";
import { ChannelDataGenerator } from "../../utils/ChannelDataGenerator";
import { colorUtils } from "../../utils/ColorUtils";
import { MapTransitionFactory } from "../../animation/MapTransitionTween";
import { CloseButtonRatio } from "../../utils/Constant";
import {FeatureMap} from "../../elements/FeatureMap";
import {MapAggregation} from "../../elements/MapAggregation";

function Layer3d(config) {

	Layer.call(this, config);

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

}

Layer3d.prototype = Object.assign(Object.create(Layer.prototype), {

	init: function(center, actualDepth, nextHookHandler) {

		this.center = center;
		this.actualDepth = actualDepth;
		this.nextHookHandler = nextHookHandler;
		this.lastHookHandler = this.lastLayer.nextHookHandler;

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

		console.log("open layer");

		if (!this.isOpen) {

			this.disposeAggregationElement();
			this.initSegregationElements(this.closeFmCenters);
			MapTransitionFactory.openLayer(this);

		}

	},

	closeLayer: function () {

		console.log("close layer");

		if (this.isOpen) {

			MapTransitionFactory.closeLayer(this);

		}

	},

	initSegregationElements: function(centers) {

		for (let i = 0; i < this.depth; i++) {

			let segregationHandler = new FeatureMap(
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

		let colors = colorUtils.getAdjustValues(aggregationUpdateValue);

		this.aggregationHandler.updateVis(colors);

	},

	updateSegregationVis: function() {

		let layerOutputValues = ChannelDataGenerator.generateChannelData(this.neuralValue, this.depth);

		let colors = colorUtils.getAdjustValues(layerOutputValues);

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

		return relativeElements;

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

	// override this function to load user's layer config for layer2d object
	loadLayerConfig: function(layerConfig) {

	},

	// override this function to load user's model config to layer2d object
	loadModelConfig: function(modelConfig) {

	},

	// override this function to get information from previous layer
	assemble: function(layerIndex) {

	},

	// override this function to define relative element from previous layer
	getRelativeElements: function(selectedElement) {

		let relativeElements = [];

		return [];

	}

});

export { Layer3d };