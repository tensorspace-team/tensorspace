/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Layer1d } from "../abstract/Layer1d";

function Activation1d( config ) {

	Layer1d.call( this, config );

	this.activation = undefined;

	this.layerType = "Activation1d";

}

Activation1d.prototype = Object.assign( Object.create( Layer1d.prototype ), {

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			if ( layerConfig.activation !== undefined ) {

				this.activation = layerConfig.activation;

			} else {

				console.error( "\"activation\" property is required for activation1d layer." );

			}

		} else {

			console.error( "Lack config for layer activation1d." );

		}

	},

	loadModelConfig: function( modelConfig ) {

		this.loadBasicModelConfig( modelConfig );

		if ( this.color === undefined ) {

			this.color = modelConfig.color.activation1d;

		}

	},

	assemble: function( layerIndex ) {

		this.layerIndex = layerIndex;

		this.inputShape = this.lastLayer.outputShape;

		this.width = this.inputShape[ 0 ];
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

export { Activation1d };