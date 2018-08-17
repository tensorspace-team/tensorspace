import ColorUtils from '../../utils/ColorUtils';

function MapLayer(config) {
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

	// store all 2d maps in layer
	this.fmList = [];

	this.name = config.name;

	// output index to fit the layer
	this.resourceOutputIndex = undefined;
}

MapLayer.prototype = {

	setNextLayer: function(layer) {
		this.nextLayer = layer;
	},

	setLastLayer: function(layer) {
		this.lastLayer = layer;
	},

	setEnvironment: function(scene) {
		this.scene = scene;
	}

};


export default MapLayer;