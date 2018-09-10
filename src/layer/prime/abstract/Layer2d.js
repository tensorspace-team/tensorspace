import {Layer} from "./Layer";
import { QueueGroupTweenFactory } from "../../../animation/QueueGroupTransitionTween";
import { ChannelDataGenerator } from "../../../utils/ChannelDataGenerator";
import { colorUtils } from "../../../utils/ColorUtils";

function Layer2d(config) {

	Layer.call(this, config);

	this.layerDimension = 2;

	this.queueHandlers = [];

	this.closeCenterList = [];
	this.openCenterList = [];
	this.centerList = [];

}

Layer2d.prototype = Object.assign(Object.create(Layer.prototype), {

	openLayer: function() {

		if (!this.isOpen) {

			QueueGroupTweenFactory.openLayer(this);

			this.isOpen = true;

		}

	},

	closeLayer: function() {

		if (this.isOpen) {

			QueueGroupTweenFactory.closeLayer(this);

			this.isOpen = false;
		}

	},

	calcCloseButtonSize: function() {
		return 2 * this.unitLength;
	},

	calcCloseButtonPos: function() {
		return {
			x: - this.actualWidth / 2 - 30,
			y: 0,
			z: 0
		};
	},

	clear: function() {
		if (this.neuralValue !== undefined) {
			if (this.isOpen) {
				for (let i = 0; i < this.queueHandlers.length; i++) {
					this.queueHandlers[i].clear();
				}
			} else {
				this.aggregationHandler.clear();
			}
			this.neuralValue = undefined;
		}
	},

	hideText: function() {

		if (this.textElementHandler !== undefined) {

			this.textElementHandler.hideText();
			this.textElementHandler = undefined;
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

	disposeSegregationElements: function() {

		for (let i = 0; i < this.depth; i++) {
			this.neuralGroup.remove(this.queueHandlers[i].getElement());
		}
		this.queueHandlers = [];

	},

	disposeAggregationElement: function() {

		this.neuralGroup.remove(this.aggregationHandler.getElement());
		this.aggregationHandler = undefined;

	},

	updateValue: function(value) {

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

		let featureMapSize = this.width;

		for (let i = 0; i < this.depth; i++) {

			this.queueHandlers[i].updateVis(colors.slice(i * featureMapSize, (i + 1) * featureMapSize));

		}

	},

	provideRelativeElements: function(request) {

		let relativeElements = [];

		if (request.all !== undefined && request.all) {

			if (this.isOpen) {
				for (let i = 0; i < this.queueHandlers.length; i++) {
					relativeElements.push(this.queueHandlers[i].getElement());
				}
			} else {
				relativeElements.push(this.aggregationHandler.getElement());
			}

		} else {
			if (request.index !== undefined) {

				if (this.isOpen) {
					relativeElements.push(this.queueHandlers[request.index].getElement());
				} else {
					relativeElements.push(this.aggregationHandler.getElement());
				}

			}
		}

		return relativeElements;
	}

});

export { Layer2d };