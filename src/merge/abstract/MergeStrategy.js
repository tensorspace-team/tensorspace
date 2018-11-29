/**
 * @author syt123450 / https://github.com/syt123450
 */

function MergeStrategy( mergedElements ) {

	this.layerContext = undefined;
	this.mergedElements = mergedElements;

}

MergeStrategy.prototype = {

	setLayerContext: function( layer ) {

		this.layerContext = layer;

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