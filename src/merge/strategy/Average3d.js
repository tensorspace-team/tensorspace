function Average3d(mergedElements) {

	this.mergedElements = mergedElements;
	this.layerIndex = undefined;

}

Average3d.prototype = {

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

export { Average3d };