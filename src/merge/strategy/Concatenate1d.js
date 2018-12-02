/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergeStrategy1d } from "../abstract/MergeStrategy1d";

/**
 * Concatenate1d, can be initialized by StrategyFactory directly.
 * MergeStrategy for MergedLayer when apply Concatenate operation to 1d TensorSpace layers.
 *
 * For example:
 * ```javascript
 * let dense1 = new TSP.layers.Dense({ ...config });
 * let dense2 = new TSP.layers.Dense({ ...config });
 * let concatenateLayer = TSP.layers.Concatenate([ dense1, dense2 ], { ...config });
 * ```
 * In this example, the merged layer "concatenateLayer" apply merge strategy "Concatenate1d".
 *
 * @param mergedElements, array of TensorSpace layers. (layerList.length > 0)
 * @constructor
 */

function Concatenate1d( mergedElements ) {

	// Concatenate1d inherits from abstract strategy "MergeStrategy1d".

	MergeStrategy1d.call( this, mergedElements );

	this.strategyType = "Concatenate1d";

}

Concatenate1d.prototype = Object.assign( Object.create( MergeStrategy1d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class MergeStrategy1d's abstract method
	 *
	 * Concatenate1d overrides MergeStrategy1d's function:
	 * getOutputShape, validate, getRelativeElements
	 *
	 * ============
	 */

	/**
	 * getOutputShape(), return a 1 dimension array.
	 *
	 * @return { [ int ] }
	 */

	getOutputShape: function() {

		let units = 0;

		// add first dimension as output

		for (let i = 0; i < this.mergedElements.length; i ++) {

			units += this.mergedElements[ i ].outputShape[ 0 ];

		}

		return [ units ];

	},

	/**
	 * validate()
	 * validate whether mergedElements is suitable for merge operation.
	 *
	 * @return { boolean }
	 */

	validate: function() {

		return true;

	},

	/**
	 * getRelativeElements()
	 * Get relative element in last layer for relative lines based on given hovered element.
	 * Straight elements is used to draw straight line, curve elements is used to draw Bezier curves.
	 *
	 * Use bridge design patten:
	 * 1. "getRelativeElements" send request to previous layer for relative elements;
	 * 2. Previous layer's "provideRelativeElements" receives request, return relative elements.
	 *
	 * @param { THREE.Object } selectedElement, hovered element detected by THREE's Raycaster
	 * @return { { straight: Array, curve: Array } }
	 */

	getRelativeElements: function( selectedElement ) {

		let curveElements = [];
		let straightElements = [];

		if ( selectedElement.elementType === "aggregationElement" ||
			selectedElement.elementType === "featureLine" ) {

			let request = {

				all: true

			};

			for ( let i = 0; i < this.mergedElements.length; i ++ ) {

				let relativeResult = this.mergedElements[ i ].provideRelativeElements( request );
				let relativeElements = relativeResult.elementList;

				if ( this.mergedElements[ i ].layerLevel === this.layerContext.layerLevel - 1 ) {

					for ( let j = 0; j < relativeElements.length; j ++ ) {

						straightElements.push( relativeElements[ j ] );

					}

				} else {

					for ( let j = 0; j < relativeElements.length; j ++ ) {

						curveElements.push( relativeElements[ j ] );

					}

				}

			}

		}

		return {

			straight: straightElements,
			curve: curveElements

		};

	}

	/**
	 * ============
	 *
	 * Functions above override base class MergeStrategy1d's abstract method.
	 *
	 * ============
	 */

} );

export { Concatenate1d };