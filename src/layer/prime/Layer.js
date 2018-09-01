import { CloseButtonHelper } from "../../utils/CloseButtonHelper";
import { CloseButton } from "../../elements/CloseButton";
import { CloseButtonRatio } from "../../utils/Constant";

function Layer(config) {
	this.scene = undefined;
	this.layerIndex = undefined;
	this.center = undefined;
	this.nextLayer = undefined;
	this.lastLayer = undefined;

	// store all neural value as an array

	this.neuralValue = undefined;

	this.activation = undefined;
	this.neuralNum = undefined;
	this.outputShape = [];
	this.neuralGroup = undefined;

	// store the reference aggregationElement object
	this.aggregationElement = undefined;

	this.name = config.name;

	// output index to fit the layer
	this.resourceOutputIndex = undefined;

	// color for layer neural visualization
	this.color = undefined;

	// store the reference for layer aggregation
	this.aggregationHandler = undefined;

	// store all layer segregation references as a list
	this.segregationHandlers = [];

	// store the reference for close button
	this.closeButtonHandler = undefined;

	// center position is the left-most for layer, type: {x: value , y: value, z: value}
	this.leftMostCenter = undefined;

	// actual width and height in three.js scene
	this.actualWidth = undefined;
	this.actualHeight = undefined;

	// actual depth for layer aggregation
	this.actualDepth = undefined;

	// used to define close sphere size
	this.openHeight = undefined;
}

Layer.prototype = {

	setNextLayer: function(layer) {
		this.nextLayer = layer;
	},

	setLastLayer: function(layer) {
		this.lastLayer = layer;
	},

	setEnvironment: function(scene) {
		this.scene = scene;
	},

	initCloseButton: function() {

		let closeButtonPos = CloseButtonHelper.getPosInLayer(this.leftMostCenter, this.actualWidth);
		let closeButtonHandler = new CloseButton(this.openHeight * CloseButtonRatio, closeButtonPos, this.color);
		closeButtonHandler.setLayerIndex(this.layerIndex);

		this.closeButtonHandler = closeButtonHandler;
		this.neuralGroup.add(this.closeButtonHandler.getElement());

	},

	disposeCloseButton: function() {

		this.neuralGroup.remove(this.closeButtonHandler.getElement());
		this.closeButtonHandler = undefined;

	},

	clear: function() {

		if (this.neuralValue !== undefined) {
			if (this.isOpen) {
				for (let i = 0; i < this.segregationHandlers.length; i++) {
					this.segregationHandlers[i].clear();
				}
			} else {
				this.aggregationHandler.clear();
			}
			this.neuralValue = undefined;
		}

	}

};


export { Layer };