import { Layer } from './Layer';
import { NeuralQueue } from '../../elements/NeuralQueue';
import { colorUtils } from '../../utils/ColorUtils';
import {Placeholder} from "../../elements/Placeholder";
import {LayerOpenFactory} from "../../animation/LayerOpen";
import {LayerCloseFactory} from "../../animation/LayerClose";
import { CloseButton } from "../../elements/CloseButton";
import { CloseButtonHelper } from "../../utils/CloseButtonHelper";

function Dense(config) {

	Layer.call(this, config);

	this.units = config.units;
	this.width = config.units;
	this.depth = 1;
	this.neuralQueue = undefined;

	this.isOpen = undefined;

}

Dense.prototype = Object.assign(Object.create(Layer.prototype), {

	init: function(center) {

		this.center = center;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		if (this.isOpen) {

			this.initLayerElements();
			this.initCloseButton();

		} else {

			this.initLayerPlaceHolder();

		}

		this.scene.add(this.neuralGroup);

	},

	openLayer: function() {

		if (!this.isOpen) {

			LayerOpenFactory.openQueueLayer(this);

			this.isOpen = true;

		}

	},

	closeLayer: function() {

		if (this.isOpen) {

			LayerCloseFactory.closeQueueLayer(this);

			this.isOpen = false;
		}

	},

	initLayerElements: function() {

		let neuralQueue = new NeuralQueue(this.units, this.color);
		this.neuralQueue = neuralQueue;
		this.neuralGroup.add(neuralQueue.getQueueElement());

		if (this.neuralValue !== undefined) {
			this.updateVis();
		}

	},

	disposeLayerElements: function() {

		console.log("dispose queue element");

		this.neuralGroup.remove(this.neuralQueue.getQueueElement());
		this.neuralQueue = undefined;

	},

	initCloseButton: function() {

		console.log("init dense close button");

		let closeButtonPos = CloseButtonHelper.getPosInLayer(this.center, this.width);

		let closeButton = new CloseButton(closeButtonPos, this.color);
		let closeButtonElement = closeButton.getButton();
		closeButtonElement.layerIndex = this.layerIndex;

		this.closeButton = closeButtonElement;
		this.neuralGroup.add(closeButtonElement);

	},

	disposeCloseButton: function() {

		this.neuralGroup.remove(this.closeButton);
		this.closeButton = undefined;

	},

	initLayerPlaceHolder: function() {

		let placeholder = new Placeholder(5, 5, 5, this.color);
		let placeholderElement = placeholder.getPlaceholder();

		placeholderElement.elementType = "placeholder";
		placeholderElement.layerIndex = this.layerIndex;

		this.layerPlaceHolder = placeholderElement;
		this.edgesLine = placeholder.getEdges();

		this.neuralGroup.add(this.layerPlaceHolder);
		this.neuralGroup.add(this.edgesLine);

	},

	disposeLayerPlaceHolder: function() {

		this.neuralGroup.remove(this.layerPlaceHolder);
		this.neuralGroup.remove(this.edgesLine);
		this.layerPlaceHolder = undefined;
		this.edgesLine = undefined;

	},

	assemble: function(layerIndex, modelConfig) {

		this.layerIndex = layerIndex;

		this.outputShape = [this.units, 1, 1];

		if (this.isOpen === undefined) {
			this.isOpen = modelConfig.layerInitStatus;
		}

		if (this.color === undefined) {
			this.color = modelConfig.color.dense;
		}

	},

	updateValue: function(value) {

		this.neuralValue = value;

		if (this.isOpen) {
			this.updateVis();
		}

	},

	updateVis: function() {
		let colors = colorUtils.getAdjustValues(this.neuralValue);

		this.neuralQueue.updateGrayScale(colors);
	}

});


export { Dense };