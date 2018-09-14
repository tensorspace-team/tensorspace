import { Layer2d } from "../abstract/Layer2d";
import {MapAggregation} from "../../elements/MapAggregation";
import {GlobalPoolingElement} from "../../elements/GlobalPoolingElement";

function GlobalPooling1d(config) {

	Layer2d.call(this, config);

	this.width = 1;

	this.layerType = "globalPooling1d";

}

GlobalPooling1d.prototype = Object.assign(Object.create(Layer2d.prototype), {

	loadModelConfig: function(modelConfig) {

		this.loadBasicModelConfig(modelConfig);

		if (this.color === undefined) {
			this.color = modelConfig.color.globalPooling1d;
		}

		if (this.aggregationStrategy === undefined) {
			this.aggregationStrategy = modelConfig.aggregationStrategy;
		}

	},

	assemble: function(layerIndex) {

		this.layerIndex = layerIndex;

		this.inputShape = this.lastLayer.outputShape;
		this.depth = this.inputShape[1];

		this.outputShape = [1, this.depth];

		for (let i = 0; i < this.depth; i++) {

			let closeCenter = {
				x: 0,
				y: 0,
				z: 0
			};
			this.closeCenterList.push(closeCenter);

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

	initSegregationElements: function(centers) {

		for (let i = 0; i < centers.length; i++) {

			let queueHandler = new GlobalPoolingElement(
				this.actualWidth,
				centers[i],
				this.color
			);

			queueHandler.setLayerIndex(this.layerIndex);
			queueHandler.setFmIndex(i);

			this.queueHandlers.push(queueHandler);

			this.neuralGroup.add(queueHandler.getElement());

		}

		if (this.neuralValue !== undefined) {
			this.updateSegregationVis();
		}

	},

	showText: function(element) {

		if (element.elementType === "globalPoolingElement") {

			let fmIndex = element.fmIndex;
			this.queueHandlers[fmIndex].showText();
			this.textElementHandler = this.queueHandlers[fmIndex];

		}

	},

	getRelativeElements: function(selectedElement) {

		let relativeElements = [];

		if (selectedElement.elementType === "aggregationElement") {

			let request = {
				all: true
			};
			relativeElements = this.lastLayer.provideRelativeElements(request).elementList;

		} else if (selectedElement.elementType === "gridLine") {

			let gridIndex = selectedElement.gridIndex;
			let request = {
				index: gridIndex
			};
			relativeElements = this.lastLayer.provideRelativeElements(request).elementList;

		}

		return relativeElements;

	}


});

export { GlobalPooling1d };