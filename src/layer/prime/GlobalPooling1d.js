import { Layer2d } from "./abstract/Layer2d";
import {MapAggregation} from "../../elements/MapAggregation";

function GlobalPooling1d(config) {

	Layer2d.call(this, config);

	this.width = 1;
	this.depth = undefined;


	this.closeCenterList = [];
	this.openCenterList = [];

	this.centerList = [];

	this.layerType = "globalPooling1d";

}

GlobalPooling1d.prototype = Object.assign(Object.create(Layer2d.prototype), {

	init: function(center, actualDepth, nextHookHandler) {

		this.center = center;
		this.actualDepth = actualDepth;
		this.nextHookHandler = nextHookHandler;
		this.lastHookHandler = this.lastLayer.nextHookHandler;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		if (this.isOpen) {

			this.initSegregationElements(this.openCenterList);
			this.initCloseButton();

		} else {

			this.initAggregationElement();

		}

		this.scene.add(this.neuralGroup);

	},

	loadModelConfig: function(modelConfig) {

		if (this.isOpen === undefined) {
			this.isOpen = modelConfig.layerInitStatus;
		}

		if (this.color === undefined) {
			this.color = modelConfig.color.pooling1d;
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

		for (let i = 0; i < this.depth; i++) {
			let closeCenter = {
				x: 0,
				y: 0,
				z: 0
			};
			this.closeCenterList.push(closeCenter);
		}

		for (let i = 0; i < this.lastLayer.openCenterList.length; i++) {

			let openCenter = {
				x: this.lastLayer.openCenterList[i].x,
				y: this.lastLayer.openCenterList[i].y,
				z: this.lastLayer.openCenterList[i].z
			};

			this.openCenterList.push(openCenter);

		}

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;

	},

	initAggregationElement: function() {

		let aggregationHandler = new MapAggregation(
			1,
			1,
			this.unitLength,
			this.unitLength,
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

	disposeAggregationElement: function() {

		this.neuralGroup.remove(this.aggregationHandler.getElement());
		this.aggregationHandler = undefined;

	},

	initSegregationElements: function(centers) {



	},

	disposeSegregationElements: function() {

		for (let i = 0; i < this.depth; i++) {
			this.neuralGroup.remove(this.queueHandlers[i].getElement());
		}
		this.queueHandlers = [];

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



	},

	updateSegregationVis: function() {



	},

	handleClick: function(clickedElement) {

		if (clickedElement.elementType === "aggregationElement") {
			this.openLayer();
		} else if (clickedElement.elementType === "closeButton") {
			this.closeLayer();
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

	showText: function(element) {

	},

	hideText: function() {

		if (this.textElementHandler !== undefined) {

			this.textElementHandler.hideText();
			this.textElementHandler = undefined;
		}

	},

	getRelativeElements: function() {

	}


});

export { GlobalPooling1d };