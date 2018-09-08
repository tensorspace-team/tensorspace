import {Layer} from "./Layer";
import { MapDataGenerator } from "../../../utils/MapDataGenerator";
import { colorUtils } from "../../../utils/ColorUtils";
import { MapTransitionFactory } from "../../../animation/MapTransitionTween";

function Layer2d(config) {

	Layer.call(this, config);

}

Layer2d.prototype = Object.assign(Object.create(Layer.prototype), {

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

		let aggregationUpdateValue = MapDataGenerator.generateAggregationData(this.neuralValue, this.depth, this.aggregationStrategy);

		let colors = colorUtils.getAdjustValues(aggregationUpdateValue);

		this.aggregationHandler.updateVis(colors);

	},

	updateSegregationVis: function() {

		let layerOutputValues = MapDataGenerator.generateChannelData(this.neuralValue, this.depth);

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

	}


});

export { Layer2d };