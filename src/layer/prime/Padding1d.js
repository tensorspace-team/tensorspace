import { Layer2d } from "./abstract/Layer2d";

function Padding1d(config) {

	Layer2d.call(this, config);

	this.width = undefined;
	this.depth = undefined;

	this.paddingLeft = undefined;
	this.paddingRight = undefined;
	this.paddingWidth = undefined;

	this.contentWidth = undefined;

	this.padding = undefined;
	this.closeCenterList = [];
	this.openCenterList = [];
	this.centerList = [];

	this.loadLayerConfig(config);

	this.layerType = "padding1d";

}

Padding1d.prototype = Object.assign(Object.create(Layer2d.prototype), {

	init: function(center, actualDepth, nextHookHandler) {

		this.center = center;
		this.actualDepth = actualDepth;
		this.nextHookHandler = nextHookHandler;
		this.lastHookHandler = this.lastLayer.nextHookHandler;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);



		this.scene.add(this.neuralGroup);

	},

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

	initAggregationElement: function() {

	},

	disposeAggregationElement: function() {

	},

	initSegregationElements: function(centers) {

	},

	disposeSegregationElements: function() {

	},

	handleClick: function() {

	},

	handleHoverIn: function() {

	},

	handleHoverOut: function() {

	},

	showText: function() {

	},

	hideText: function() {

	},

	getRelativeElements: function() {

	}

});

export { Padding1d };