import { Layer } from './abstract/Layer';
import { FeatureMap } from "../../elements/FeatureMap";
import { colorUtils } from "../../utils/ColorUtils";
import { ModelInitWidth } from "../../utils/Constant";

function Input2d(config) {

	Layer.call(this, config);

	this.shape = undefined;
	this.width = undefined;
	this.height = undefined;
	this.depth = 1;
	this.outputShape = undefined;

	this.loadLayerConfig(config);

	this.actualWidth = ModelInitWidth;
	this.actualHeight = ModelInitWidth / this.width * this.height;
	this.realVirtualRatio = this.actualWidth / this.width;

	this.unitLength = this.actualWidth / this.width;

	this.fmCenter = {
		x: 0,
		y: 0,
		z: 0
	};

	this.layerType = "input";

}

Input2d.prototype = Object.assign(Object.create(Layer.prototype), {

	init: function(center, actualDepth, nextHookHandler) {

		this.center = center;
		this.actualDepth = actualDepth;
		this.nextHookHandler = nextHookHandler;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		this.initAggregationElement();

		this.scene.add(this.neuralGroup);

	},

	loadLayerConfig: function(layerConfig) {

		if (layerConfig !== undefined) {

			if (layerConfig.shape !== undefined) {
				this.shape = layerConfig.shape;
				this.width = layerConfig.shape[0];
				this.height = layerConfig.shape[1];
				this.depth = layerConfig.shape[2];
				this.outputShape = layerConfig.shape;
			} else {
				console.error("\"shape\" property is required for input layer");
			}

		}

	},

	initAggregationElement: function() {

		let aggregationHandler = new FeatureMap(
			this.width,
			this.height,
			this.actualWidth,
			this.actualHeight,
			this.fmCenter,
			this.color
		);
		aggregationHandler.setLayerIndex(this.layerIndex);

		this.aggregationHandler = aggregationHandler;
		this.neuralGroup.add(aggregationHandler.getElement());

	},

	loadModelConfig: function(modelConfig) {
		if (this.color === undefined) {
			this.color = modelConfig.color.input2d;
		}

		if (this.relationSystem === undefined) {
			this.relationSystem = modelConfig.relationSystem;
		}

		if (this.textSystem === undefined) {
			this.textSystem = modelConfig.textSystem;
		}
	},

	assemble: function(layerIndex) {
		console.log("Assemble input layer");

		this.layerIndex = layerIndex;
	},

	updateValue: function(value) {

		this.neuralValue = value;

		let colors = colorUtils.getAdjustValues(value);

		this.aggregationHandler.updateVis(colors);
	},

	clear: function() {
		console.log("clear input data");

		this.aggregationHandler.clear();
	},

	handleHoverIn: function(hoveredElement) {

		if (this.textSystem !== undefined && this.textSystem) {
			this.showText(hoveredElement);
		}

	},

	handleHoverOut: function() {

		if (this.textSystem !== undefined && this.textSystem) {
			this.hideText();
		}

	},

	showText: function(element) {

		if (element.elementType === "featureMap") {

			this.aggregationHandler.showText();
			this.textElementHandler = this.aggregationHandler;

		}
	},

	hideText: function() {

		if (this.textElementHandler !== undefined) {

			this.textElementHandler.hideText();
			this.textElementHandler = undefined;
		}

	},

	provideRelativeElements: function(request) {

		let relativeElements = [];

		relativeElements.push(this.aggregationHandler.getElement());

		return relativeElements;

	}

});

export { Input2d };