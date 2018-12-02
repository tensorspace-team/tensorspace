/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergeStrategy2d } from "./MergeStrategy2d";
import { MergeValidator } from "../../utils/MergeValidator";

/**
 * StableMerge2d, abstract strategy, should not be initialized by StrategyFactory directly.
 * Base class for Add2d, Subtract2d, Maximum2d, Multiply2d, Average2d.
 * The calculated outputShape in StableMerge is the same as the outputShapes of layers in input layer list,
 * that's why named as StableMerge, keep the outputShape stable, would not change in merge operation.
 *
 * @param mergedElements, array of TensorSpace layers. (layerList.length > 0)
 * @constructor
 */

function StableMerge2d( mergedElements ) {

	// StableMerge2d inherits from abstract strategy "MergeStrategy2d".

	MergeStrategy2d.call( this, mergedElements );

}

StableMerge2d.prototype = Object.assign( Object.create( MergeStrategy2d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class MergeStrategy2d's abstract method
	 *
	 * StableMerge2d overrides MergeStrategy2d's function:
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

		return this.mergedElements[ 0 ].outputShape;

	},

	/**
	 * validate()
	 * validate whether mergedElements is suitable for merge operation.
	 *
	 * @return { boolean }
	 */

	validate: function() {

		return MergeValidator.validateStableShape( this.mergedElements );

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

			for ( let i = 0; i < this.mergedElements.length; i ++ ) {

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

			let request = {

				index: gridIndex

			};

			for ( let i = 0; i < this.mergedElements.length; i ++ ) {

				let relativeResult = this.mergedElements[ i ].provideRelativeElements( request );
				let relativeElements = relativeResult.elementList;

				if ( this.mergedElements[ i ].layerLevel === this.layerContext.layerLevel - 1 ) {

					for ( let j = 0; j < relativeElements.length; j ++ ) {

						straightElements.push( relativeElements[ j ] );

					}

				} else {

					if ( relativeResult.isOpen && !this.layerContext.isOpen ) {

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

		}

		return {

			straight: straightElements,
			curve: curveElements

		};

	}

	/**
	 * ============
	 *
	 * Functions above override base class MergeStrategy2d's abstract method.
	 *
	 * ============
	 */

} );

export { StableMerge2d };