/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergeStrategy1d } from "../abstract/MergeStrategy1d";

function Concatenate1d( mergedElements ) {

	MergeStrategy1d.call( this, mergedElements );

	this.strategyType = "Concatenate1d";

}

Concatenate1d.prototype = Object.assign( Object.create( MergeStrategy1d.prototype ), {

	validate: function() {

		return true;

	},

	getOutputShape: function() {

		let units = 0;

		for (let i = 0; i < this.mergedElements.length; i ++) {

			units += this.mergedElements[ i ].outputShape[ 0 ];

		}

		return [ units ];

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

				if ( this.mergedElements[ i ].layerIndex === this.layerContext.layerIndex - 1 ) {

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

} );

export { Concatenate1d };