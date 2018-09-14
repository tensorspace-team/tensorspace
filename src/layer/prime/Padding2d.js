import { Layer3d } from "../abstract/Layer3d";

function Padding2d(config) {

	Layer3d.call(this, config);

	this.paddingWidth = undefined;
	this.paddingHeight = undefined;
	this.paddingLeft = undefined;
	this.paddingRight = undefined;
	this.paddingTop = undefined;
	this.paddingBottom = undefined;

	this.contentWidth = undefined;
	this.contentHeight = undefined;

	this.loadLayerConfig(config);

	this.layerType = "padding2d";

}

Padding2d.prototype = Object.assign(Object.create(Layer3d.prototype), {

	loadLayerConfig: function(layerConfig) {

		if (layerConfig !== undefined) {

			if (layerConfig.padding !== undefined) {

				this.paddingTop = layerConfig.padding[0];
				this.paddingBottom = layerConfig.padding[0];
				this.paddingLeft = layerConfig.padding[1];
				this.paddingRight = layerConfig.padding[1];

				this.paddingHeight = this.paddingTop + this.paddingBottom;
				this.paddingWidth = this.paddingLeft + this.paddingRight;

			} else {
				console.error("\npadding\" property is required for padding layer");
			}

		}

	},

	loadModelConfig: function(modelConfig) {

		this.loadBasicModelConfig(modelConfig);

		if (this.color === undefined) {
			this.color = modelConfig.color.padding2d;
		}

		if (this.aggregationStrategy === undefined) {
			this.aggregationStrategy = modelConfig.aggregationStrategy;
		}
	},

	assemble: function(layerIndex) {

		this.layerIndex = layerIndex;

		this.contentWidth = this.lastLayer.width;
		this.contentHeight = this.lastLayer.height;
		this.depth = this.lastLayer.depth;
		this.width = this.contentWidth + this.paddingWidth;
		this.height = this.contentHeight + this.paddingHeight;

		this.outputShape = [this.width, this.height, this.depth];

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;
		this.actualHeight = this.height * this.unitLength;

		for (let i = 0; i < this.depth; i++) {

			let closeFmCenter = {
				x: 0,
				y: 0,
				z: 0
			};
			this.closeFmCenters.push(closeFmCenter);

			let openFmCenter = {
				x: this.lastLayer.openFmCenters[i].x,
				y: this.lastLayer.openFmCenters[i].y,
				z: this.lastLayer.openFmCenters[i].z
			};
			this.openFmCenters.push(openFmCenter);

		}

		this.leftMostCenter = this.openFmCenters[0];
		this.openHeight = this.actualHeight + this.openFmCenters[this.openFmCenters.length - 1].z - this.openFmCenters[0].z;

	},

	getRelativeElements: function(selectedElement) {

		let relativeElements = [];

		if (selectedElement.elementType === "aggregationElement") {

			let request = {
				all: true
			};

			relativeElements = this.lastLayer.provideRelativeElements(request).elementList;

		} else if (selectedElement.elementType === "featureMap") {

			let fmIndex = selectedElement.fmIndex;
			let request = {
				index: fmIndex
			};
			relativeElements = this.lastLayer.provideRelativeElements(request).elementList;

		}

		return relativeElements;
	}

});

export { Padding2d };
