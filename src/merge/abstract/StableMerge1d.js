/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Strategy1d } from "./Strategy1d";

function StableMerge1d( mergedElements ) {

	Strategy1d.call( this, mergedElements );

}

StableMerge1d.prototype = Object.assign( Object.create( Strategy1d.prototype ), {

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

		if ( selectedElement.elementType === "aggregationElement" ||
			selectedElement.elementType === "featureLine" ) {

			let request = {

				all: true

			};

			for ( let i = 0; i < this.mergedElements.length; i ++ ) {

				let relativeResult = this.mergedElements[ i ].provideRelativeElements( request );
				let relativeElements = relativeResult.elementList;

				if ( this.mergedElements[ i ].layerIndex === this.layerIndex - 1 ) {

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

export { StableMerge1d };