import { Layer2d } from "../abstract/Layer2d";

function Padding1d(config) {

	Layer2d.call(this, config);

	this.paddingLeft = undefined;
	this.paddingRight = undefined;
	this.paddingWidth = undefined;

	this.contentWidth = undefined;

	this.padding = undefined;

	this.loadLayerConfig(config);

	this.layerType = "padding1d";

}

Padding1d.prototype = Object.assign(Object.create(Layer2d.prototype), {

	loadLayerConfig: function(layerConfig) {

		if (layerConfig !== undefined) {
			if (layerConfig.padding !== undefined) {
				this.paddingLeft = layerConfig.padding;
				this.paddingRight = layerConfig.padding;
				this.paddingWidth = this.paddingLeft + this.paddingRight;
			} else {
				console.error("\"padding\" property is required for padding layer.");
			}
		} else {
			console.error("Lack config for padding1d layer.");
		}

	},

	loadModelConfig: function(modelConfig) {

		if (this.isOpen === undefined) {
			this.isOpen = modelConfig.layerInitStatus;
		}

		if (this.color === undefined) {
			this.color = modelConfig.color.padding1d;
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

		this.inputShape = this.lastLayer.outputShape;

		this.contentWidth = this.inputShape[0];
		this.width = this.contentWidth + this.paddingWidth;
		this.depth = this.inputShape[1];

		this.outputShape = [this.width, this.depth];

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;

		for (let i = 0; i < this.depth; i++) {
			let closeCenter = {
				x: 0,
				y: 0,
				z: 0
			};
			this.closeCenterList.push(closeCenter);
		}

		if (this.lastLayer.openCenterList !== undefined) {
			for (let i = 0; i < this.lastLayer.openCenterList.length; i++) {
				let openCenter = {
					x: this.lastLayer.openCenterList[i].x,
					y: this.lastLayer.openCenterList[i].y,
					z: this.lastLayer.openCenterList[i].z
				};
				this.openCenterList.push(openCenter);
			}
		} else {

			let openCenter= {
				x: 0,
				y: 0,
				z: 0
			};

			this.openCenterList.push(openCenter);

		}

	},

	getRelativeElements: function(selectedElement) {

		let relativeElements = [];

		if (selectedElement.elementType === "aggregationElement") {

			let request = {
				all: true
			};
			relativeElements = this.lastLayer.provideRelativeElements(request);

		} else if (selectedElement.elementType === "gridLine") {

			let gridIndex = selectedElement.gridIndex;
			let request = {
				index: gridIndex
			};
			relativeElements = this.lastLayer.provideRelativeElements(request);

		}

		return relativeElements;

	}

});

export { Padding1d };