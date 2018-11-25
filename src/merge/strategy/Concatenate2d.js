import { Strategy2d } from "../abstract/Strategy2d";

function Concatenate2d( mergedElements ) {

	Strategy2d.call( this, mergedElements );

	this.strategyType = "Concatenate2d";

}

Concatenate2d.prototype = Object.assign( Object.create( Strategy2d.prototype ), {

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

	getOutputShape: function() {

		let width = this.mergedElements[ 0 ].outputShape[ 0 ];
		let depth = 0;

		for (let i = 0; i < this.mergedElements.length; i ++) {

			depth += this.mergedElements[ i ].outputShape[ 1 ];

		}

		return [ width, depth ];

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

			if ( relativeLayer.layerIndex === this.layerIndex - 1 ) {

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

export { Concatenate2d };