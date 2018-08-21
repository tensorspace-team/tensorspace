import { MinAlpha } from "../../utils/Constant";

function Layer(config) {

	this.scene = undefined;
	this.layerIndex = undefined;
	this.center = undefined;
	this.nextLayer = undefined;
	this.lastLayer = undefined;
	this.neuralValue = undefined;
	this.neuralList = [];
	this.activation = undefined;
	this.neuralNum = undefined;
	this.outputShape = [];
	this.neuralGroup = undefined;

	this.name = config.name;

	// output index to fit the layer
	this.resourceOutputIndex = undefined;

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

	getHeightLightParameters: function(positionIndex) {

		let heightLightNeuralList = [];
		let lineColors = [];
		let lineVertices = [];

		let relativaNeruals = this.getRelativeNeurals(positionIndex);
		heightLightNeuralList.push(this.neuralList[positionIndex]);
		for (let i = 0; i < relativaNeruals.length; i++) {
			heightLightNeuralList.push(relativaNeruals[i]);
		}

		let startPosition = this.neuralList[positionIndex].getWorldPosition();

		for (let i = 0; i < relativaNeruals.length; i++) {

			lineColors.push(new THREE.Color( 1, 1, 1 ));
			lineColors.push(new THREE.Color( 1, 1, 1 ));

			lineVertices.push(startPosition);
			lineVertices.push(relativaNeruals[i].getWorldPosition());

		}

		return {
			heightLightList: heightLightNeuralList,
			lineColors: lineColors,
			lineVertices: lineVertices
		}

	},

	getRelativeNeurals: function(positionIndex) {

		let neurals = [];

		let neuralIndexList = this.calculateRelativeIndex(positionIndex);
		for (let i = 0; i < neuralIndexList.length; i++) {
			neurals.push(this.lastLayer.neuralList[neuralIndexList[i]]);
		}

		return neurals;

	},

	clear: function() {
		for (let i = 0; i < this.neuralList.length; i++) {
			this.neuralList[i].material.color.setRGB(MinAlpha, MinAlpha, MinAlpha);
		}
	}

};

export default Layer;