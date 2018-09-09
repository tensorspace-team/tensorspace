import {Layer} from "./Layer";
import { QueueTransitionFactory } from "../../../animation/QueueTransitionTween";
import { colorUtils } from "../../../utils/ColorUtils";

function Layer1d(config) {

	Layer.call(this, config);

	this.layerDimension = 1;

	this.lastActualWidth = undefined;
	this.lastActualHeight = undefined;

	this.queueHandler = undefined;

}

Layer1d.prototype = Object.assign(Object.create(Layer.prototype), {

	openLayer: function() {

		if (!this.isOpen) {

			QueueTransitionFactory.openLayer(this);

			this.isOpen = true;

		}

	},

	closeLayer: function() {

		if (this.isOpen) {

			QueueTransitionFactory.closeLayer(this);

			this.isOpen = false;
		}

	},

	hideText: function() {

		if (this.textElementHandler !== undefined) {

			this.textElementHandler.hideText();
			this.textElementHandler = undefined;
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

	updateValue: function(value) {

		this.neuralValue = value;

		if (this.isOpen) {
			this.updateQueueVis();
		}

	},

	updateQueueVis: function() {
		let colors = colorUtils.getAdjustValues(this.neuralValue);

		this.queueHandler.updateVis(colors);
	},

	disposeAggregationElement: function() {

		this.neuralGroup.remove(this.aggregationHandler.getElement());
		this.aggregationHandler = undefined;

	},

	disposeQueueElement: function() {

		console.log("dispose queue element");

		this.neuralGroup.remove(this.queueHandler.getElement());
		this.queueHandler = undefined;

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
	}

});

export { Layer1d };