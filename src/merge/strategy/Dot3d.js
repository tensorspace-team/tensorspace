/**
 * @author syt123450 / https://github.com/syt123450
 */

function Dot3d( mergedElements ) {

	this.mergedElements = mergedElements;
	this.layerIndex = undefined;

}

Dot3d.prototype = {

	setLayerIndex: function( layerIndex ) {

		this.layerIndex = layerIndex;

	},

	validate: function() {

	},

	getShape: function() {

	},

	getRelativeElements: function() {

	}

};

export { Dot3d };