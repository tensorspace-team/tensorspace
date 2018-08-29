import { Layer } from './Layer';
import { InputDepth1Object } from "../../elements/InputDepth1Object";
import { InputDepth3Object } from "../../elements/InputDepth3Object";

function Input(config) {

	Layer.call(this, config);

	this.shape = config.shape;
	this.width = config.shape[0];
	this.height = config.shape[1];
	this.depth = config.shape[2];
	this.neuralNum = config.shape[0] * config.shape[1];
	this.outputShape = config.shape;

	this.fmCenters = [{
		x: 0,
		y: 0,
		z: 0
	}];

	this.layerType = "input";
}

Input.prototype = Object.assign(Object.create(Layer.prototype), {

	init: function(center) {

		this.center = center;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		this.initLayerElements();

		this.scene.add(this.neuralGroup);

	},

	initLayerElements: function() {

		let inputElement;

		if (this.depth === 1) {
			inputElement = new InputDepth1Object(this.width, this.height, this.fmCenters[0], this.color);
			this.fmList.push(inputElement);
		} else if (this.depth === 3) {
			inputElement = new InputDepth3Object(this.width, this.height, this.fmCenters[0], this.color);
			this.fmList.push(inputElement);
		} else {
			// do we need to create a default element ?
			console.log("layer depth must 1 or 3 for image");
		}

		this.fmList.push(inputElement);
		this.neuralGroup.add(inputElement.getMapElement());

	},

	assemble: function(layerIndex, modelConfig) {
		console.log("Assemble input layer");

		this.layerIndex = layerIndex;

		if (this.color !== undefined) {
			this.color = modelConfig.color.input;
		}
	},

	updateValue: function(value) {

		this.neuralValue = value;

		this.fmList[0].updateVis(value);
	},

	clear: function() {
		console.log("clear input data");

		this.fmList[0].clear();
	}

});

export { Input };