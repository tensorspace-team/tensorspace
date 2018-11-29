/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer3d } from "../abstract/NativeLayer3d";
import { FmCenterGenerator } from "../../utils/FmCenterGenerator";

/**
 * layer has 3d shape.
 *
 * @param config, user's configuration for BasicLayer3d layer
 * @constructor
 */

function BasicLayer3d( config ) {

	// "BasicLayer3d" inherits from abstract layer "NativeLayer3d".

	NativeLayer3d.call( this, config );

	// Load user's BasicLayer3d configuration.

	this.loadLayerConfig( config );

	this.layerType = "BasicLayer3d";

}

BasicLayer3d.prototype = Object.assign( Object.create( NativeLayer3d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer3d's abstract method
	 *
	 * BasicLayer3d overrides NativeLayer3d's function:
	 * assemble, loadModelConfig
	 *
	 * ============
	 */

	/**
	 * assemble() configure layer's index in model, calculate the shape and parameters based on previous layer.
	 *
	 * @param { int } layerIndex, this layer's order in model
	 */

	assemble: function( layerIndex, layerLevel ) {

		this.layerIndex = layerIndex;
		this.layerLevel = layerLevel;

		// Unit length is the same as last layer, use unit length to calculate actualWidth and actualHeight which are used to create three.js object.

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.unitLength * this.width;
		this.actualHeight = this.unitLength * this.height;

		// Calculate the feature map centers for open status.

		this.openFmCenters = FmCenterGenerator.getFmCenters(

			this.layerShape,
			this.depth,
			this.actualWidth,
			this.actualHeight

		);

	},

	/**
	 * loadModelConfig() load model's configuration into BasicLayer3d object,
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

			this.color = modelConfig.color.basicLayer3d;

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
	 * Functions above override base class NativeLayer3d's abstract method.
	 *
	 * ============
	 */

	/**
	 * loadLayerConfig() Load user's configuration into BasicLayer3d.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for BasicLayer3d.
	 */

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			// "shape" configuration is required.

			if ( layerConfig.shape !== undefined ) {

				this.width = layerConfig.shape[ 0 ];
				this.height = layerConfig.shape[ 1 ];
				this.depth = layerConfig.shape[ 2 ];

				// BasicLayer3d layer's outputShape has three dimension, that's why BasicLayer3d layer inherits from abstract layer "NativeLayer3d".

				this.outputShape = [ this.width, this.height, this.depth ];

				// Calculate the feature map centers for close status.

				for ( let i = 0; i < this.depth; i ++ ) {

					let center = {

						x: 0,
						y: 0,
						z: 0

					};

					this.closeFmCenters.push( center );

				}

			} else {

				console.error( "\"shape\" property is required for basicLayer3d." );

			}

		} else {

			console.error( "Lack config for basicLayer3d." );

		}

	}

} );

export { BasicLayer3d };