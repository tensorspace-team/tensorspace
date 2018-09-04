import { Layer } from './Layer';
import { FeatureMap } from "../../elements/FeatureMap";
import { colorUtils } from "../../utils/ColorUtils";
import { ModelInitWidth } from "../../utils/Constant";

function Input(config) {

	Layer.call(this, config);

	this.shape = config.shape;
	this.width = config.shape[0];
	this.height = config.shape[1];
	this.depth = config.shape[2];
	this.neuralNum = config.shape[0] * config.shape[1];
	this.outputShape = config.shape;

	this.actualWidth = ModelInitWidth;
	this.actualHeight = ModelInitWidth / this.width * this.height;
	this.realVirtualRatio = this.actualWidth / this.width;

	this.fmCenter = {
		x: 0,
		y: 0,
		z: 0
	};

	this.layerType = "input";


}

Input.prototype = Object.assign(Object.create(Layer.prototype), {

	init: function(center, actualDepth, nextHookHandler) {

		this.center = center;
		this.actualDepth = actualDepth;
		this.nextHookHandler = nextHookHandler;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		this.initAggregationElement();

		this.scene.add(this.neuralGroup);

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

	assemble: function(layerIndex, modelConfig) {
		console.log("Assemble input layer");

		this.layerIndex = layerIndex;

		if (this.color === undefined) {
			this.color = modelConfig.color.input;
		}

		if (this.relationSystem === undefined) {
			this.relationSystem = modelConfig.relationSystem;
		}

		if (this.textSystem === undefined) {
			this.textSystem = modelConfig.textSystem;
		}
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

	}

});

export { Input };