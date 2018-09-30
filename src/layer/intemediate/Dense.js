/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer1d } from "../abstract/NativeLayer1d";

function Dense( config ) {

	NativeLayer1d.call( this, config );

	this.loadLayerConfig( config );

	this.layerType = "	Dense";

}

Dense.prototype = Object.assign( Object.create( NativeLayer1d.prototype ), {

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			if ( layerConfig.units !== undefined ) {

				this.width = layerConfig.units;
				this.outputShape = [ layerConfig.width ];

				this.totalSegments = Math.ceil( this.width / this.segmentLength );

			} else {

				console.error( "The \"unit\" property is required for dense layer." );

			}

		}

	},

	loadModelConfig: function( modelConfig ) {

		this.loadBasicModelConfig( modelConfig );

		if ( this.color === undefined ) {

			this.color = modelConfig.color.dense;

		}

	},

	assemble: function( layerIndex ) {

		this.layerIndex = layerIndex;

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

export { Dense };