import { FeatureMap } from '../../elements/FeatureMap';
import { MapAggregation } from "../../elements/MapAggregation";
import { Layer3d } from "./abstract/Layer3d";
import { ChannelDataGenerator } from "../../utils/ChannelDataGenerator";
import { colorUtils } from "../../utils/ColorUtils";

function Pooling2d(config) {

	Layer3d.call(this, config);

	this.inputShape = undefined;
	this.width = undefined;
	this.height = undefined;
	this.poolSize = undefined;
	this.strides = undefined;
	this.depth = undefined;

	this.isShapePredefined = false;

	this.fmCenters = [];
	this.openFmCenters = [];
	this.closeFmCenters = [];

	this.aggregationStrategy = undefined;

	this.padding = "valid";

	this.loadLayerConfig(config);

	this.layerType = "maxPool2d";

}

Pooling2d.prototype = Object.assign(Object.create(Layer3d.prototype), {

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

				for (let i = 0; i < this.openFmCenters.length; i++) {
					this.fmCenters.push(this.openFmCenters[i]);
				}
				this.initSegregationElements(this.openFmCenters);
				this.initCloseButton();

			} else {

				this.initAggregationElement();

			}
		}

		this.scene.add(this.neuralGroup);

	},

	loadLayerConfig: function(layerConfig) {

		if (layerConfig !== undefined) {

			if (layerConfig.poolSize !== undefined) {
				this.poolSize = layerConfig.poolSize;
			} else {
				console.error("\"poolSize\" is required for Pooling2d layer");
			}

			if (layerConfig.strides !== undefined) {
				this.strides = layerConfig.strides;
			} else {
				console.error("\"strides\" is required for Pooling2d layer");
			}

			if (layerConfig.shape !== undefined) {

				this.isShapePredefined = true;
				this.fmShape = layerConfig.shape;
				this.width = this.fmShape[0];
				this.height = this.fmShape[1];
				this.outputShape = [this.width, this.height, this.depth];
			}

			if (layerConfig.padding !== undefined) {

				if (layerConfig.padding.toLowerCase() === "valid") {
					this.padding = "valid";
				} else if (layerConfig.padding.toLowerCase() === "same") {
					this.padding = "same";
				} else {
					console.error("\"padding\" property do not support for " + layerConfig.padding + ", use \"valid\" or \"same\" instead.");
				}

			}

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

	loadModelConfig: function(modelConfig) {
		if (this.isOpen === undefined) {
			this.isOpen = modelConfig.layerInitStatus;
		}

		if (this.color === undefined) {
			this.color = modelConfig.color.pooling2d;
		}

		if (this.relationSystem === undefined) {
			this.relationSystem = modelConfig.relationSystem;
		}

		if (this.textSystem === undefined) {
			this.textSystem = modelConfig.textSystem;
		}

		if (this.aggregationStrategy === undefined) {
			this.aggregationStrategy = modelConfig.aggregationStrategy;
		}
	},

	assemble: function(layerIndex) {
		this.layerIndex = layerIndex;

		this.depth = this.lastLayer.depth;

		if (this.isShapePredefined) {

		} else {
			this.inputShape = this.lastLayer.outputShape;

			if (this.padding === "valid") {

				this.width = (this.inputShape[0] - this.poolSize[0]) / this.strides[0] + 1;
				this.height = (this.inputShape[1] - this.poolSize[1]) / this.strides[1] + 1;

			} else if (this.padding === "same") {

				this.width = Math.ceil(this.inputShape[0] / this.strides[0]);
				this.height = Math.ceil(this.inputShape[1] / this.strides[1]);

			} else {
				console.error("Why padding property will be set to such value?");
			}

			this.outputShape = [this.width, this.height, this.depth];
		}

		for (let i = 0; i < this.depth; i++) {

			let center = {
				x: 0,
				y: 0,
				z: 0
			};
			this.closeFmCenters.push(center);

		}

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;
		this.actualHeight = this.height * this.unitLength;

		for (let i = 0; i < this.lastLayer.openFmCenters.length; i++) {
			let fmCenter = {};
			fmCenter.x = this.lastLayer.openFmCenters[i].x;
			fmCenter.y = this.lastLayer.openFmCenters[i].y;
			fmCenter.z = this.lastLayer.openFmCenters[i].z;
			this.openFmCenters.push(fmCenter);
		}

		this.leftMostCenter = this.openFmCenters[0];
		// layer total height in z-axis
		this.openHeight = this.actualHeight + this.openFmCenters[this.openFmCenters.length - 1].z - this.openFmCenters[0].z;

	},

	getRelativeElements: function(selectedElement) {

		let relativeElements = [];

		if (selectedElement.elementType === "aggregationElement") {

			if (this.lastLayer.isOpen) {

				for (let i = 0; i < this.lastLayer.segregationHandlers.length; i++) {
					relativeElements.push(this.lastLayer.segregationHandlers[i].getElement());
				}

			} else {

				relativeElements.push(this.lastLayer.aggregationHandler.getElement());

			}

		} else if (selectedElement.elementType === "featureMap") {

			if (this.lastLayer.isOpen) {

				let relativeElement = this.lastLayer.segregationHandlers[
						selectedElement.fmIndex
					].getElement();
				relativeElements.push(relativeElement);

			} else {

				relativeElements.push(this.lastLayer.aggregationHandler.getElement());

			}

		}

		return relativeElements;

	},

	updateSegregationVis: function() {

		let layerOutputValues = ChannelDataGenerator.generateChannelData(this.neuralValue, this.depth);

		let colors = colorUtils.getAdjustValues(layerOutputValues);

		let featureMapSize = this.width * this.height;

		for (let i = 0; i < this.depth; i++) {

			this.segregationHandlers[i].updateVis(colors.slice(i * featureMapSize, (i + 1) * featureMapSize));

		}

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

	}

});

export { Pooling2d };