/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer1d } from "../abstract/NativeLayer1d";

/**
 * layer has 1d shape.
 *
 * @param config, user's configuration for BasicLayer1d layer
 * @constructor
 */

function BasicLayer1d( config ) {

	// "BasicLayer1d" inherits from abstract layer "NativeLayer1d".

	NativeLayer1d.call( this, config );

	this.layerType = "BasicLayer1d";

}

BasicLayer1d.prototype = Object.assign( Object.create( NativeLayer1d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer1d's abstract method
	 *
	 * BasicLayer1d overrides NativeLayer1d's function:
	 * assemble, loadModelConfig
	 *
	 * ============
	 */

	/**
	 * assemble() calculate the shape and parameters based on previous layer or pre-defined shape.
	 */

	assemble: function() {
		
		// Load user's BasicLayer1d configuration.
		
		this.loadLayerConfig( this.config );
		
		// Unit length is the same as last layer, use unit length to calculate actualWidth which is used to create three.js object.

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.unitLength * this.width;

		// Calculate aggregation actual size.

		if ( this.lastLayer.layerDimension === 1 ) {

			if ( this.lastLayer.layerType === "Input1d" ) {

				this.aggregationWidth = 3 * this.unitLength;
				this.aggregationHeight = 3 * this.unitLength;

			} else {

				this.aggregationWidth = this.lastLayer.aggregationWidth;
				this.aggregationHeight = this.lastLayer.aggregationHeight;

			}

		} else {

			this.aggregationWidth = this.lastLayer.actualWidth;
			this.aggregationHeight = this.lastLayer.actualHeight;

		}

	},

	/**
	 * loadModelConfig() load model's configuration into BasicLayer1d object,
	 * If one specific attribute has been set before, model's configuration will not be loaded into it.
	 *
	 * Based on the passed in modelConfig parameter
	 *
	 * @param { JSON } modelConfig, default and user's configuration for model
	 */

	loadModelConfig: function( modelConfig ) {

		// Call super class "Layer"'s method to load common model configuration, check out "Layer.js" file for more information.

		this.loadBasicModelConfig( modelConfig );

		if( this.color === undefined ) {

			this.color = modelConfig.color.basicLayer1d;

		}

	},

	/**
	 * ============
	 *
	 * Functions above override base class NativeLayer1d's abstract method.
	 *
	 * ============
	 */

	/**
	 * loadLayerConfig() Load user's configuration into BasicLayer1d.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for BasicLayer1d.
	 */

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			// "shape" configuration is required.

			if ( layerConfig.shape !== undefined ) {

				this.width = layerConfig.shape[ 0 ];

				// BasicLayer1d layer's outputShape has one dimension, that's why BasicLayer1d layer inherits from abstract layer "NativeLayer1d".

				this.outputShape = [ this.width ];

			} else {

				console.error( "\"shape\" property is required for NativeLayer1d." );

			}

			if ( this.paging ) {

				this.totalSegments = Math.ceil( this.width / this.segmentLength );

			}

		} else {

			console.error( "Lack config for NativeLayer1d." );

		}

	}

} );

export { BasicLayer1d };
