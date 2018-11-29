/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergeStrategy2d } from "./MergeStrategy2d";

function StableMerge2d( mergedElements ) {

	MergeStrategy2d.call( this, mergedElements );

}

StableMerge2d.prototype = Object.assign( Object.create( MergeStrategy2d.prototype ), {

	validate: function() {

		let inputShape = this.mergedElements[ 0 ].outputShape;

		for ( let i = 0; i < this.mergedElements.length; i ++ ) {

			let outputShape = this.mergedElements[ i ].outputShape;

			for ( let j = 0; j < inputShape.length; j ++ ) {

				if ( outputShape[ j ] !== inputShape[ j ] ) {

					return false;

				}

			}

		}

		return true;

	},

	getOutputShape: function() {

		return this.mergedElements[ 0 ].outputShape;

	},

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

				if ( this.mergedElements[ i ].layerIndex === this.layerContext.layerIndex - 1 ) {

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

				if ( this.mergedElements[ i ].layerIndex === this.layerContext.layerIndex - 1 ) {

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

		}

		return {

			straight: straightElements,
			curve: curveElements

		};

	}


} );

export { StableMerge2d };