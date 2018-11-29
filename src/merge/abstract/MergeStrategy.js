/**
 * @author syt123450 / https://github.com/syt123450
 */

function MergeStrategy( mergedElements ) {

	this.mergedElements = mergedElements;
	this.layerIndex = undefined;

}

MergeStrategy.prototype = {

	setLayerIndex: function( layerIndex ) {

		this.layerIndex = layerIndex;

	},

	validate: function() {

		return true;

	},

	getOutputShape: function() {

		return undefined;

	},

	getRelativeElements: function( selectedElement ) {

		return {

			straight: [],
			curve: []

		};

	}

};

export { MergeStrategy };