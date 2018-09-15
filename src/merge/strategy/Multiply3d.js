function Multiply3d(mergedElements) {

	this.mergedElements = mergedElements;
	this.layerIndex = undefined;

}

Multiply3d.prototype = {

	setLayerIndex: function(layerIndex) {
		this.layerIndex = layerIndex;
	},

	validate: function() {

	},

	getShape: function() {

	},

	getRelativeElements: function() {

	}

};

export { Multiply3d };