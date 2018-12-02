/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergeStrategy3d } from "../abstract/MergeStrategy3d";

/**
 * Concatenate3d, can be initialized by StrategyFactory directly.
 * MergeStrategy for MergedLayer when apply Concatenate operation to 3d TensorSpace layers.
 *
 * For example:
 * ```javascript
 * let conv2d1 = new TSP.layers.Conv2d( { ...config } );
 * let conv2d2 = new TSP.layers.Conv2d( { ...config } );
 * let concatenateLayer = TSP.layers.Concatenate( [ conv2d1, conv2d2 ], { ...config } );
 * ```
 * In this example, the merged layer "concatenateLayer" apply merge strategy "Concatenate3d".
 *
 * @param mergedElements, array of TensorSpace layers. (layerList.length > 0)
 * @constructor
 */

function Concatenate3d( mergedElements ) {

	// Concatenate3d inherits from abstract strategy "MergeStrategy3d".

	MergeStrategy3d.call( this, mergedElements );

	this.strategyType = "Concatenate3d";

}

Concatenate3d.prototype = Object.assign( Object.create( MergeStrategy3d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class MergeStrategy3d's abstract method
	 *
	 * Concatenate3d overrides MergeStrategy3d's function:
	 * getOutputShape, validate, getRelativeElements
	 *
	 * ============
	 */

	/**
	 * getOutputShape(), return a 3 dimension array.
	 *
	 * @return { [ int, int, int ] }
	 */

	getOutputShape: function() {

		let width = this.mergedElements[ 0 ].outputShape[ 0 ];
		let height = this.mergedElements[ 0 ].outputShape[ 1 ];
		let depth = 0;

		// concatenate input layers' width, height and depth

		for (let i = 0; i < this.mergedElements.length; i ++) {

			depth += this.mergedElements[ i ].outputShape[ 2 ];

		}

		return [ width, height, depth ];

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

			if ( layerShape[ 0 ] !== inputShape[ 0 ] || layerShape[ 1 ] !== inputShape[ 1 ] ) {

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

		} else if ( selectedElement.elementType === "featureMap" ) {

			let fmIndex = selectedElement.fmIndex;

			let relativeLayer;

			for ( let i = 0; i < this.mergedElements.length; i ++ ) {

				let layerDepth = this.mergedElements[ i ].outputShape[ 2 ];

				if ( layerDepth > fmIndex ) {

					relativeLayer = this.mergedElements[ i ];
					break;

				} else {

					fmIndex -= layerDepth;

				}

			}

			let request = {

				index: fmIndex

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

export { Concatenate3d };