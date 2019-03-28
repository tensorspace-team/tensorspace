/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer2d } from "../abstract/NativeLayer2d";
import { QueueCenterGenerator } from "../../utils/QueueCenterGenerator";

/**
 * layer has 2d shape.
 *
 * @param config, user's configuration for BasicLayer2d layer
 * @constructor
 */

function BasicLayer2d( config ) {

	// "BasicLayer2d" inherits from abstract layer "NativeLayer2d".

	NativeLayer2d.call( this, config );

	// Load user's BasicLayer2d configuration.

	this.loadLayerConfig( config );

	this.layerType = "BasicLayer2d";

}

BasicLayer2d.prototype = Object.assign( Object.create( NativeLayer2d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer2d's abstract method
	 *
	 * BasicLayer2d overrides NativeLayer2d's function:
	 * assemble, loadModelConfig
	 *
	 * ============
	 */

	/**
	 * assemble() calculate the shape and parameters based on previous layer or pre-defined shape.
	 */

	assemble: function() {

		// Unit length is the same as last layer, use unit length to calculate actualWidth and actualHeight which are used to create three.js object.

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.unitLength * this.width;

		// Calculate the grid line centers for open status.

		this.openCenterList = QueueCenterGenerator.getCenterList( this.actualWidth, this.depth );

	},

	/**
	 * loadModelConfig() load model's configuration into BasicLayer2d object,
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

			this.color = modelConfig.color.basicLayer2d;

		}

		if ( this.layerShape === undefined ) {

			this.layerShape = modelConfig.layerShape;

		}

		if ( this.aggregationStrategy === undefined ) {

			this.aggregationStrategy = modelConfig.aggregationStrategy;

		}

	},

	/**
	 * ============
	 *
	 * Functions above override base class NativeLayer2d's abstract method.
	 *
	 * ============
	 */

	/**
	 * loadLayerConfig() Load user's configuration into BasicLayer2d.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for BasicLayer2d.
	 */

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			// "shape" configuration is required.

			if ( layerConfig.shape !== undefined ) {

				this.width = layerConfig.shape[ 0 ];
				this.depth = layerConfig.shape[ 1 ];

				// BasicLayer2d layer's outputShape has two dimension, that's why BasicLayer2d layer inherits from abstract layer "NativeLayer2d".

				this.outputShape = [ this.width, this.depth ];

				// Calculate the grid line centers for close status.

				for ( let i = 0; i < this.depth; i ++ ) {

					let center = {

						x: 0,
						y: 0,
						z: 0

					};

					this.closeCenterList.push( center );

				}

			} else {

				console.error( "\"shape\" property is required for NativeLayer2d." );

			}

		} else {

			console.error( "Lack config for NativeLayer2d." );

		}

	}

} );

export { BasicLayer2d };