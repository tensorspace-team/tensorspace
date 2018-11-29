/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergeStrategy3d } from "../abstract/MergeStrategy3d";

function Concatenate3d( mergedElements ) {

	MergeStrategy3d.call( this, mergedElements );

	this.strategyType = "Concatenate3d";

}

Concatenate3d.prototype = Object.assign( Object.create( MergeStrategy3d.prototype ), {

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

	getOutputShape: function() {

		let width = this.mergedElements[ 0 ].outputShape[ 0 ];
		let height = this.mergedElements[ 0 ].outputShape[ 1 ];
		let depth = 0;

		for (let i = 0; i < this.mergedElements.length; i ++) {

			depth += this.mergedElements[ i ].outputShape[ 2 ];

		}

		return [ width, height, depth ];

	},

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

} );

export { Concatenate3d };