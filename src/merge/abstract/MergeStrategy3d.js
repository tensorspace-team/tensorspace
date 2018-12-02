/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergeStrategy } from "./MergeStrategy";

/**
 * MergeStrategy3d, abstract strategy, should not be initialized by StrategyFactory directly.
 * Base class for StableMerge3d, Concatenate3d.
 * The getOutputShape() of MergeStrategy3d will return a 3 dimension array,
 * For example, [ 224, 224, 3 ]
 *
 * @param mergedElements, array of TensorSpace layers. (layerList.length > 0)
 * @constructor
 */

function MergeStrategy3d( mergedElements ) {

	// MergeStrategy3d inherits from abstract strategy "MergeStrategy".

	MergeStrategy.call( this, mergedElements );

}

MergeStrategy3d.prototype = Object.assign( Object.create( MergeStrategy.prototype ), {

	/**
	 * ============
	 *
	 * Functions below are abstract method for MergeStrategy3d.
	 * SubClasses ( concrete MergeStrategy3d ) override these abstract methods.
	 *
	 * ============
	 */

	/**
	 * getOutputShape(), return a 3 dimension array.
	 * Different MergeStrategy3d subclass will have different ways to outputShape calculate.
	 * For example, Add3d and Concatenate3d's getOutputShape() method are different.
	 *
	 * @return { [ int, int, int ] }
	 */
	
	getOutputShape: function() {

		return [ 1, 1, 1 ];

	},

	/**
	 * validate() abstract method
	 * validate whether mergedElements is suitable for merge operation.
	 * Different merge operation may have different validate strategy.
	 * Such as:
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

} );

export { MergeStrategy3d };