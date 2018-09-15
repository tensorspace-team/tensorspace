function Maximum3d(mergedElements) {

	this.mergedElements = mergedElements;
	this.layerIndex = undefined;

}

Maximum3d.prototype = {

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

export { Maximum3d };