import {Layer} from "./Layer";
import { ChannelDataGenerator } from "../../../utils/ChannelDataGenerator";
import { colorUtils } from "../../../utils/ColorUtils";
import { MapTransitionFactory } from "../../../animation/MapTransitionTween";
import { CloseButtonRatio } from "../../../utils/Constant";

function Layer3d(config) {

	Layer.call(this, config);

	this.layerDimension = 3;

	// store all layer segregation references as a list
	this.segregationHandlers = [];

	// used to define close sphere size
	this.openHeight = undefined;

}

Layer3d.prototype = Object.assign(Object.create(Layer.prototype), {

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

	disposeSegregationElements: function () {

		for (let i = 0; i < this.segregationHandlers.length; i++) {
			let segregationHandler = this.segregationHandlers[i];
			this.neuralGroup.remove(segregationHandler.getElement());
		}

		this.segregationHandlers = [];

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

	hideText: function() {

		if (this.textElementHandler !== undefined) {

			this.textElementHandler.hideText();
			this.textElementHandler = undefined;
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

});

export { Layer3d };