/**
 * @author syt123450 / https://github.com/syt123450
 */

import { CloseButton } from "../../elements/CloseButton";
import { BasicLineGroupController } from "./BasicLineGroupController";
import {OpenTime, SeparateTime} from "../../utils/Constant";

function Layer(config) {

	BasicLineGroupController.call(this);

	this.scene = undefined;
	this.layerIndex = undefined;
	this.center = undefined;
	this.lastLayer = undefined;

	// store all neural value as an array
	this.neuralValue = undefined;

	this.activation = undefined;
	this.inputShape = [];
	this.outputShape = [];
	this.neuralGroup = undefined;

	// color for layer neural visualization
	this.color = undefined;

	// store the reference for layer aggregation
	this.aggregationHandler = undefined;

	// store the reference for close button
	this.closeButtonHandler = undefined;
	this.hasCloseButton = true;
	this.closeButtonSizeRatio = 1;

	// actual width and height in three.js scene
	this.actualWidth = undefined;
	this.actualHeight = undefined;

	// actual depth for layer aggregation
	this.actualDepth = undefined;

	// actualWidth / width
	this.unitLength = undefined;

	// handler for element showing text
	this.textElementHandler = undefined;

	// config for text and relation line
	this.textSystem = undefined;
	this.relationSystem = undefined;

	this.isOpen = undefined;

	// actualWidth / width
	this.unitLength = undefined;

	// identify whether is merged layer
	this.isMerged = false;

	this.animationTimeRatio = 1;
	this.openTime = OpenTime;
	this.separateTime = SeparateTime;

	this.loadBasicLayerConfig(config);

}

Layer.prototype = Object.assign(Object.create(BasicLineGroupController.prototype), {

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

			if (config.closeButton !== undefined) {

				if (config.closeButton.display !== undefined) {
					this.hasCloseButton = config.closeButton.display;
				}

				if (config.closeButton.ratio !== undefined) {
					this.closeButtonSizeRatio = config.closeButton.ratio;
				}

			}

			if (config.animationTimeRatio !== undefined) {
				if (config.animationTimeRatio > 0) {
					this.animationTimeRatio = config.animationTimeRatio;
				}
				this.openTime *= this.animationTimeRatio;
				this.separateTime *= this.animationTimeRatio;
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

		this.openTime *= modelConfig.animationTimeRatio;
		this.separateTime *= modelConfig.animationTimeRatio;

	},

	setLastLayer: function(layer) {
		this.lastLayer = layer;
	},

	setEnvironment: function(scene) {
		this.scene = scene;
	},

	initCloseButton: function() {

		if (this.hasCloseButton) {
			let closeButtonPos = this.calcCloseButtonPos();
			let closeButtonSize = this.closeButtonSizeRatio * this.calcCloseButtonSize();
			let closeButtonHandler = new CloseButton(closeButtonSize, this.unitLength, closeButtonPos, this.color);
			closeButtonHandler.setLayerIndex(this.layerIndex);

			this.closeButtonHandler = closeButtonHandler;
			this.neuralGroup.add(this.closeButtonHandler.getElement());
		}

	},

	disposeCloseButton: function() {

		this.neuralGroup.remove(this.closeButtonHandler.getElement());
		this.closeButtonHandler = undefined;

	}

});


export { Layer };