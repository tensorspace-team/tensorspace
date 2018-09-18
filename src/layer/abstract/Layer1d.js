/**
 * @author syt123450 / https://github.com/syt123450
 */

import {Layer} from "./Layer";
import { QueueTransitionFactory } from "../../animation/QueueTransitionTween";
import { ColorUtils } from "../../utils/ColorUtils";
import {QueueAggregation} from "../../elements/QueueAggregation";
import {NeuralQueue} from "../../elements/NeuralQueue";

function Layer1d(config) {

	Layer.call(this, config);

	this.layerDimension = 1;

	this.units = undefined;
	this.width = undefined;

	this.lastActualWidth = undefined;
	this.lastActualHeight = undefined;

	this.queueHandler = undefined;

	this.isTransition = false;

}

Layer1d.prototype = Object.assign(Object.create(Layer.prototype), {

	init: function(center, actualDepth) {

		this.center = center;
		this.actualDepth = actualDepth;
		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		if (this.isOpen) {

			this.initQueueElement();
			this.initCloseButton();

		} else {

			this.initAggregationElement();

		}

		this.scene.add(this.neuralGroup);

	},

	openLayer: function() {

		if (!this.isOpen) {

			QueueTransitionFactory.openLayer(this);

			this.isOpen = true;

		}

	},

	initQueueElement: function() {

		let queueHandler = new NeuralQueue(
			this.width,
			this.actualWidth,
			this.unitLength,
			this.color
		);

		queueHandler.setLayerIndex(this.layerIndex);
		this.queueHandler = queueHandler;
		this.neuralGroup.add(queueHandler.getElement());

		if (this.neuralValue !== undefined) {
			this.updateQueueVis();
		}

	},

	disposeQueueElement: function() {

		console.log("dispose queue element");

		this.neuralGroup.remove(this.queueHandler.getElement());
		this.queueHandler = undefined;

	},

	initAggregationElement: function() {

		let aggregationHandler = new QueueAggregation(this.lastActualWidth, this.lastActualHeight, this.unitLength, this.color);
		aggregationHandler.setLayerIndex(this.layerIndex);

		this.aggregationHandler = aggregationHandler;
		this.neuralGroup.add(this.aggregationHandler.getElement());

	},

	disposeAggregationElement: function() {

		this.neuralGroup.remove(this.aggregationHandler.getElement());
		this.aggregationHandler = undefined;

	},

	closeLayer: function() {

		if (this.isOpen) {

			QueueTransitionFactory.closeLayer(this);

			this.isOpen = false;
		}

	},

	showText: function(element) {

		if (element.elementType === "featureLine") {
			this.queueHandler.showText();
			this.textElementHandler = this.queueHandler;
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
		let colors = ColorUtils.getAdjustValues(this.neuralValue);

		this.queueHandler.updateVis(colors);
	},

	calcCloseButtonSize: function() {

		if (this.width > 50) {
			return 2 * this.unitLength;
		} else {
			return 1.1 * this.unitLength;
		}

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
				this.queueHandler.clear();
			}
			this.neuralValue = undefined;
		}

	},

	provideRelativeElements: function(request) {

		let relativeElements = [];

		if (!this.isTransition) {
			if (this.isOpen) {
				relativeElements.push(this.queueHandler.getElement());
			} else {
				relativeElements.push(this.aggregationHandler.getElement());
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

	// override this function to load user's layer config for layer2d object
	loadLayerConfig: function(layerConfig) {

	},

	// override this function to load user's model config to layer2d object
	loadModelConfig: function(modelConfig) {

	},

	// override this function to get information from previous layer
	assemble: function(layerIndex) {

	}

});

export { Layer1d };