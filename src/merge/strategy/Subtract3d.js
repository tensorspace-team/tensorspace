function Subtract3d(mergedElements) {

	this.mergedElements = mergedElements;
	this.layerIndex = undefined;

}

Subtract3d.prototype = {

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

export { Subtract3d };