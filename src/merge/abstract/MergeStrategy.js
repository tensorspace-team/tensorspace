/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * MergeStrategy, abstract strategy, should not be initialized by StrategyFactory directly.
 * Base class for MergedStrategy1d, MergedStrategy2d, MergedStrategy3d.
 * For a specific merge operation, will return a "merge layer",
 * each "merge layer" corresponding to a specific "merge strategy",
 * these MergeStrategies are subClass of "MergeStrategy".
 *
 * @param mergedElements, array of TensorSpace layers. (layerList.length > 0)
 * @constructor
 */

function MergeStrategy( mergedElements ) {

	/**
	 * Strategy's context, store Layer's reference in strategy.
	 *
	 * @type { MergedLayer }
	 */

	this.layerContext = undefined;

	/**
	 * Array of TensorSpace layers, store user's inputList for merge function.
	 *
	 * @type { Layer[] }
	 */
	this.mergedElements = mergedElements;

}

MergeStrategy.prototype = {

	/**
	 * setLayerContext(), Layer is Strategy's context, store Layer's reference in strategy.
	 * This method will be called by MergedLayer, after initializing the Strategy.
	 *
	 * @param layer
	 */

	setLayerContext: function( layer ) {

		this.layerContext = layer;

	},

	/**
	 * ============
	 *
	 * Functions below are abstract method for MergeStrategy.
	 * SubClasses ( concrete MergeStrategy ) override these abstract methods.
	 *
	 * ============
	 */

	/**
	 * getOutputShape() abstract method
	 * Different merge strategies will have their own way to calculate outputShape.
	 * Such as:
	 * - MergeStrategy1d has one dimension outputShape, for example, [100].
	 * - MergeStrategy2d has two dimension outputShape, for example, [28, 28].
	 * - MergeStrategy3d has three dimension outputShape, for example, [224, 224, 3].
	 *
	 * @return { undefined }
	 */

	getOutputShape: function() {

		return undefined;

	},

	/**
	 * validate() abstract method
	 * validate whether mergedElements is suitable for merge operation.
	 * Different merge operation may have different validate strategy.
	 * Such as:
	 * - Add3d and Add2d have different validate strategies.
	 * - Add3d and Concatenate3d have different validate strategies.
	 *
	 * @return { boolean }
	 */

	validate: function() {

		return true;

	},

	/**
	 * getRelativeElements() abstract method
	 * Get relative element in last layer for relative lines based on given hovered element.
	 * Straight elements is used to draw straight line, curve elements is used to draw Bezier curves.
	 *
	 * Override this function to define relative element from previous layer.
	 *
	 * Use bridge design patten:
	 * 1. "getRelativeElements" send request to previous layer for relative elements;
	 * 2. Previous layer's "provideRelativeElements" receives request, return relative elements.
	 *
	 * @param { THREE.Object } selectedElement, hovered element detected by THREE's Raycaster
	 * @return { { straight: Array, curve: Array } }
	 */

	getRelativeElements: function( selectedElement ) {

		return {

			straight: [],
			curve: []

		};

	}

};

export { MergeStrategy };