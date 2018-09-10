import {colorUtils} from "../../utils/ColorUtils";
import {ChannelDataGenerator} from "../../utils/ChannelDataGenerator";
import { FeatureMap } from "../../elements/FeatureMap";
import {fmCenterGenerator} from "../../utils/FmCenterGenerator";
import {MapAggregation} from "../../elements/MapAggregation";
import { Layer3d } from "./abstract/Layer3d";


function UpSampling2d(config) {

	Layer3d.call(this, config);

	console.log("construct upSampling layer");

	this.size = config.size;
	this.widthSize = config.size[0];
	this.heightSize = config.size[1];

	this.width = undefined;
	this.height = undefined;

	this.fmCenters = [];
	this.openFmCenters = [];
	this.closeFmCenters = [];

	this.isShapePredefined = false;

	this.aggregationStrategy = undefined;

	this.loadLayerConfig(config);

	this.layerType = "prime upSampling2d";

}

UpSampling2d.prototype = Object.assign(Object.create(Layer3d.prototype), {

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

			if (layerConfig.size !== undefined) {
				this.size = layerConfig.size;
				this.widthSize = layerConfig.size[0];
				this.heightSize = layerConfig.size[1];
			} else {
				console.error("\"size\" property is required for UpSampling layer");
			}

			if (layerConfig.shape !== undefined) {
				this.isShapePredefined = true;
				this.fmShape = layerConfig.shape;
				this.width = layerConfig.shape[0];
				this.height = layerConfig.shape[1];
			}

		}

	},

	loadModelConfig: function(modelConfig) {
		if (this.isOpen === undefined) {
			this.isOpen = modelConfig.layerInitStatus;
		}

		if (this.color === undefined) {
			this.color = modelConfig.color.upSampling2d;
		}

		if (this.layerShape === undefined) {
			this.layerShape = modelConfig.layerShape;
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
			this.width = this.lastLayer.width * this.widthSize;
			this.height = this.lastLayer.height * this.heightSize;
		}

		this.outputShape = [this.width, this.height, this.depth];

		for (let i = 0; i < this.depth; i++) {
			let center = {
				x: 0,
				y: 0,
				z: 0
			};
			this.closeFmCenters.push(center);
		}

		this.realVirtualRatio = this.lastLayer.realVirtualRatio;
		this.actualWidth = this.width * this.realVirtualRatio;
		this.actualHeight = this.height * this.realVirtualRatio;

		this.unitLength = this.actualWidth / this.width;

		this.openFmCenters = fmCenterGenerator.getFmCenters(this.layerShape, this.depth, this.actualWidth, this.actualHeight);

		this.leftMostCenter = this.openFmCenters[0];
		this.openHeight = this.actualHeight + this.openFmCenters[this.openFmCenters.length - 1].z - this.openFmCenters[0].z;

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

	updateSegregationVis: function() {

		let layerOutputValues = ChannelDataGenerator.generateChannelData(this.neuralValue, this.depth);

		let colors = colorUtils.getAdjustValues(layerOutputValues);

		let featureMapSize = this.width * this.height;

		for (let i = 0; i < this.depth; i++) {

			this.segregationHandlers[i].updateVis(colors.slice(i * featureMapSize, (i + 1) * featureMapSize));

		}

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

export { UpSampling2d }
