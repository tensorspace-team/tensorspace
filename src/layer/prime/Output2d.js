import {Layer} from "./abstract/Layer";
import {colorUtils} from "../../utils/ColorUtils";
import {FeatureMap} from "../../elements/FeatureMap";

function Output2d(config) {

	Layer.call(this, config);

	this.shape = undefined;
	this.width = undefined;
	this.height = undefined;
	this.depth = 1;
	this.outputShape = undefined;

	this.isShapePredefined = false;

	this.loadLayerConfig(config);

	this.fmCenter = {
		x: 0,
		y: 0,
		z: 0
	};

	this.layerType = "output2d";

}

Output2d.prototype = Object.assign(Object.create(Layer.prototype), {

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

				this.isShapePredefined = true;
				this.shape = layerConfig.shape;
				this.width = layerConfig.shape[0];
				this.height = layerConfig.shape[1];
				this.outputShape = layerConfig.shape;

			}

		}

	},

	loadModelConfig: function(modelConfig) {

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

	assemble: function(layerIndex) {

		this.layerIndex = layerIndex;

		// TODO
		// how to infer output size from last layer?

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

	updateValue: function(value) {

		this.neuralValue = value;

		this.updateAggregationVis();

	},

	updateAggregationVis: function() {

		let colors = colorUtils.getAdjustValues(this.neuralValue);

		this.aggregationHandler.updateVis(colors);

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

export { Output2d };