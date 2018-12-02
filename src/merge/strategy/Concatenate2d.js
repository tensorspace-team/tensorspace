/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergeStrategy2d } from "../abstract/MergeStrategy2d";

/**
 * Concatenate2d, can be initialized by StrategyFactory directly.
 * MergeStrategy for MergedLayer when apply Concatenate operation to 2d TensorSpace layers.
 *
 * For example:
 * ```javascript
 * let conv1d1 = new TSP.layers.Conv1d( { ...config } );
 * let conv1d2 = new TSP.layers.Conv1d( { ...config } );
 * let concatenateLayer = TSP.layers.Concatenate( [ conv1d1, conv1d2 ], { ...config } );
 * ```
 * In this example, the merged layer "concatenateLayer" apply merge strategy "Concatenate2d".
 *
 * @param mergedElements, array of TensorSpace layers. (layerList.length > 0)
 * @constructor
 */

function Concatenate2d( mergedElements ) {

	// Concatenate2d inherits from abstract strategy "MergeStrategy2d".

	MergeStrategy2d.call( this, mergedElements );

	this.strategyType = "Concatenate2d";

}

Concatenate2d.prototype = Object.assign( Object.create( MergeStrategy2d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class MergeStrategy2d's abstract method
	 *
	 * Concatenate2d overrides MergeStrategy2d's function:
	 * getOutputShape, validate, getRelativeElements
	 *
	 * ============
	 */

	/**
	 * getOutputShape(), return a 2 dimension array.
	 *
	 * @return { [ int, int ] }
	 */

	getOutputShape: function() {

		let width = this.mergedElements[ 0 ].outputShape[ 0 ];
		let depth = 0;

		// concatenate input layers' width and depth

		for (let i = 0; i < this.mergedElements.length; i ++) {

			depth += this.mergedElements[ i ].outputShape[ 1 ];

		}

		return [ width, depth ];

	},

	/**
	 * validate()
	 * validate whether mergedElements is suitable for merge operation.
	 *
	 * @return { boolean }
	 */

	validate: function() {

		let inputShape = this.mergedElements[ 0 ].outputShape;

		for ( let i = 0; i < this.mergedElements.length; i ++ ) {

			let layerShape = this.mergedElements[ i ].outputShape;

			if ( layerShape[ 0 ] !== inputShape[ 0 ] ) {

				return false;

			}

		}

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

		if ( selectedElement.elementType === "aggregationElement" ) {

			let request = {

				all: true

			};

			for ( let i = 0; i < this.mergedElements.length; i++ ) {

				let relativeResult = this.mergedElements[ i ].provideRelativeElements( request );
				let relativeElements = relativeResult.elementList;

				if ( this.mergedElements[ i ].layerLevel === this.layerContext.layerLevel - 1 ) {

					for ( let j = 0; j < relativeElements.length; j ++ ) {

						straightElements.push( relativeElements[ j ] );

					}

				} else {

					if ( relativeResult.isOpen ) {

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

		} else if ( selectedElement.elementType === "gridLine" ) {

			let gridIndex = selectedElement.gridIndex;

			let relativeLayer;

			for ( let i = 0; i < this.mergedElements.length; i ++ ) {

				let layerDepth = this.mergedElements[ i ].outputShape[ 1 ];

				if ( layerDepth > gridIndex ) {

					relativeLayer = this.mergedElements[ i ];
					break;

				} else {

					gridIndex -= layerDepth;

				}

			}

			let request = {

				index: gridIndex

			};

			let relativeResult = relativeLayer.provideRelativeElements( request );
			let relativeElements = relativeResult.elementList;

			if ( relativeLayer.layerLevel === this.layerContext.layerLevel - 1 ) {

				for ( let i = 0; i < relativeElements.length; i ++ ) {

					straightElements.push( relativeElements[ i ] );

				}

			} else {

				if ( relativeResult.isOpen ) {

					for ( let i = 0; i < relativeElements.length; i ++ ) {

						straightElements.push( relativeElements[ i ] );

					}

				} else {

					for ( let i = 0; i < relativeElements.length; i ++ ) {

						curveElements.push( relativeElements[ i ] );

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

export { Concatenate2d };