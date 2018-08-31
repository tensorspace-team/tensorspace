import { Layer } from './Layer';
import { InputMap2d } from "../../elements/InputMap2d";

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

		this.initSegregationElements();

		this.scene.add(this.neuralGroup);

	},

	initSegregationElements: function() {

		let inputElement;

		inputElement = new InputMap2d(this.width, this.height, this.fmCenters[0], this.color);
		this.fmList.push(inputElement);

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