/**
 * @author syt123450 / https://github.com/syt123450
 */

function Strategy2d( mergedElements ) {

	this.mergedElements = mergedElements;
	this.layerIndex = undefined;

}

Strategy2d.prototype = {

	setLayerIndex: function( layerIndex ) {

		this.layerIndex = layerIndex;

	},

	validate: function() {

		return true;

	},

	getOutputShape: function() {

		return [ 1, 1 ];

	},

	getRelativeElements: function( selectedElement ) {

		return {

			straight: [],
			curve: []

		};

	}

};

export { Strategy2d };