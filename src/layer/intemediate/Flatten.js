/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Layer1d } from "../abstract/Layer1d";

function Flatten( config ) {

	Layer1d.call( this, config );

	this.loadLayerConfig( config );

	this.layerType = "flatten";

}

Flatten.prototype = Object.assign( Object.create( Layer1d.prototype ), {

	loadModelConfig: function( modelConfig ) {

		this.loadBasicModelConfig( modelConfig );

		if ( this.color === undefined ) {

			this.color = modelConfig.color.flatten;

		}

	},

	assemble: function( layerIndex ) {

		this.layerIndex = layerIndex;

		let units = 1;

		for ( let i = 0; i < this.lastLayer.outputShape.length; i++ ) {

			units *= this.lastLayer.outputShape[ i ];

		}

		this.width = units;

		this.outputShape = [ this.width ];

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;

		if ( this.lastLayer.layerDimension === 1 ) {

			this.aggregationWidth = this.lastLayer.aggregationWidth;
			this.aggregationHeight = this.lastLayer.aggregationHeight;

		} else {

			this.aggregationWidth = this.lastLayer.actualWidth;
			this.aggregationHeight = this.lastLayer.actualHeight;

		}

	},

	getRelativeElements: function( selectedElement ) {

		let relativeElements = [];

		if ( selectedElement.elementType === "aggregationElement" || selectedElement.elementType === "featureLine" ) {

			let request = {

				all: true

			};

			relativeElements = this.lastLayer.provideRelativeElements( request ).elementList;

		}

		return relativeElements;

	}

} );

export { Flatten };