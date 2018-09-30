/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer1d } from "../abstract/NativeLayer1d";

function BasicLayer1d( config ) {

	NativeLayer1d.call( this, config );

	this.color = 0xffffff;

	this.loadLayerConfig( config );

	this.layerType = "BasicLayer1d";

}

BasicLayer1d.prototype = Object.assign( Object.create( NativeLayer1d.prototype ), {

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			if ( layerConfig.shape !== undefined ) {

				this.width = layerConfig.shape[ 0 ];
				this.units = layerConfig.shape[ 0 ];
				this.outputShape = [ this.width ];

			} else {

				console.error( "\"shape\" property is required for NativeLayer1d." );

			}

		} else {

			console.error( "Lack config for NativeLayer1d." );

		}

	},

	loadModelConfig: function( modelConfig ) {

		this.loadBasicModelConfig( modelConfig );

	},

	assemble: function( layerIndex ) {

		this.layerIndex = layerIndex;

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.unitLength * this.width;

		if ( this.lastLayer.layerDimension === 1 ) {

			this.aggregationWidth = this.lastLayer.aggregationWidth;
			this.aggregationHeight = this.lastLayer.aggregationHeight;

		} else {

			this.aggregationWidth = this.lastLayer.actualWidth;
			this.aggregationHeight = this.lastLayer.actualHeight;

		}

	}

} );

export { BasicLayer1d };
