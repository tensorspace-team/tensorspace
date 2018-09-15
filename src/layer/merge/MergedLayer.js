import { CloseButton } from "../../elements/CloseButton";
import { LineGroupGeometry } from "../../elements/LineGroupGeometry";
import { BasicMaterialOpacity } from "../../utils/Constant";
import { MergeLineGroupController } from "./MergeLineGroupController";

function MergedLayer(config) {

	MergeLineGroupController.call(this);

	this.scene = undefined;
	this.layerIndex = undefined;
	this.center = undefined;
	this.nextLayer = undefined;
	this.lastLayer = undefined;

	// store all neural value as an array

	this.neuralValue = undefined;

	this.activation = undefined;
	this.neuralNum = undefined;
	this.inputShape = [];
	this.outputShape = [];
	this.neuralGroup = undefined;

	// output index to fit the layer
	this.resourceOutputIndex = undefined;

	// color for layer neural visualization
	this.color = undefined;

	// store the reference for layer aggregation
	this.aggregationHandler = undefined;

	// store the reference for close button
	this.closeButtonHandler = undefined;

	// center position is the left-most for layer, type: {x: value , y: value, z: value}
	this.leftMostCenter = undefined;

	// actual width and height in three.js scene
	this.actualWidth = undefined;
	this.actualHeight = undefined;

	// actual depth for layer aggregation
	this.actualDepth = undefined;

	// actualWidth / width
	this.unitLength = undefined;

	// store hook between layers
	this.nextHookHandler = undefined;
	this.lastHookHandler = undefined;

	// handler for element showing text
	this.textElementHandler = undefined;

	// config for text and relation line
	this.textSystem = undefined;
	this.relationSystem = undefined;

	this.isOpen = undefined;

	// actualWidth / width
	this.unitLength = undefined;

	// identify whether is merged layer
	this.isMerged = true;

	this.operator = undefined;


	this.loadBasicLayerConfig(config);


}

MergedLayer.prototype = Object.assign(Object.create(MergeLineGroupController.prototype), {

	loadBasicLayerConfig: function(config) {

		if (config !== undefined) {

			if (config.initStatus !== undefined) {

				if (config.initStatus === "open") {
					this.isOpen = true;
				} else if (config.initStatus === "close") {
					this.isOpen = false;
				} else {
					console.error("\"initStatus\" property do not support for " + config.initStatus + ", use \"open\" or \"close\" instead.");
				}

			}

			if (config.color !== undefined) {
				this.color = config.color;
			}

			if (config.name !== undefined) {
				this.name = config.name;
			}

		}

	},

	loadBasicModelConfig: function(modelConfig) {

		if (this.isOpen === undefined) {
			this.isOpen = modelConfig.layerInitStatus;
		}

		if (this.relationSystem === undefined) {
			this.relationSystem = modelConfig.relationSystem;
		}

		if (this.textSystem === undefined) {
			this.textSystem = modelConfig.textSystem;
		}

	},

	setEnvironment: function(scene) {
		this.scene = scene;
	},

	initCloseButton: function() {

		let closeButtonPos = this.calcCloseButtonPos();
		let closeButtonSize = this.calcCloseButtonSize();
		let closeButtonHandler = new CloseButton(closeButtonSize, this.unitLength, closeButtonPos, this.color);
		closeButtonHandler.setLayerIndex(this.layerIndex);

		this.closeButtonHandler = closeButtonHandler;
		this.neuralGroup.add(this.closeButtonHandler.getElement());

	},

	disposeCloseButton: function() {

		this.neuralGroup.remove(this.closeButtonHandler.getElement());
		this.closeButtonHandler = undefined;

	}

});

export { MergedLayer };