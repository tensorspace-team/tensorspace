import { GlobalPoolingElement } from "../../elements/GlobalPoolingElement";
import { Layer3d } from "../abstract/Layer3d";

function GlobalPooling2d(config) {

	Layer3d.call(this, config);

	this.width = 1;
	this.height = 1;
	this.depth = undefined;

	this.layerType = "globalPooling2d";

}

GlobalPooling2d.prototype = Object.assign(Object.create(Layer3d.prototype), {

	loadLayerConfig: function(layerConfig) {
		// globalPooling do not have layer config
	},

	loadModelConfig: function(modelConfig) {

		if (this.isOpen === undefined) {
			this.isOpen = modelConfig.layerInitStatus;
		}

		if (this.color === undefined) {
			this.color = modelConfig.color.globalPooling2d;
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

	initSegregationElements: function(centers) {

		for (let i = 0; i < this.depth; i++) {

			let segregationHandler = new GlobalPoolingElement(
				this.actualWidth,
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

	showText: function(element) {

		if (element.elementType === "globalPoolingElement") {

			let fmIndex = element.fmIndex;
			this.segregationHandlers[fmIndex].showText();
			this.textElementHandler = this.segregationHandlers[fmIndex];

		}

	},

	getRelativeElements: function(selectedElement) {

		let relativeElements = [];

		if (selectedElement.elementType === "aggregationElement") {

			let request = {
				all: true
			};

			relativeElements = this.lastLayer.provideRelativeElements(request);

		} else if (selectedElement.elementType === "featureMap") {

			let fmIndex = selectedElement.fmIndex;
			let request = {
				index: fmIndex
			};

			relativeElements = this.lastLayer.provideRelativeElements(request);

		}

		return relativeElements;

	}

});

export { GlobalPooling2d }