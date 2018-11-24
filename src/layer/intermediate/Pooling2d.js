/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer3d } from "../abstract/NativeLayer3d";

/**
 * 2D pooling.
 *
 * @param config, user's configuration for Pooling2d layer
 * @constructor
 */

function Pooling2d( config ) {

	// "Pooling2d" inherits from abstract layer "NativeLayer3d".

	NativeLayer3d.call( this, config );

	/**
	 * Factors by which to downscale in each dimension.
	 * For example: [2, 3], 2 for width, 3 for height.
	 * Default to [ 1, 1 ].
	 *
	 * @type { Array }
	 */

	this.poolSize = [ 1, 1 ];

	/**
	 * The size of the stride in each dimension of the pooling window.
	 * For example: [2, 2]
	 * Default to [ 1, 1 ].
	 *
	 * @type { Array }
	 */

	this.strides = [ 1, 1 ];

	/**
	 * Padding mode.
	 * "valid" or "same", default to "valid".
	 *
	 * @type { string }
	 */

	this.padding = "valid";

	/**
	 * Whether user directly define the layer shape.
	 * Set "true" if Pooling2d's shape is predefined by user.
	 *
	 * @type { boolean }
	 */

	this.isShapePredefined = false;

	// Load user's Pooling2d configuration.

	this.loadLayerConfig( config );

	this.layerType = "Pooling2d";

}

Pooling2d.prototype = Object.assign( Object.create( NativeLayer3d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer3d's abstract method
	 *
	 * Pooling2d overrides NativeLayer3d's function:
	 * assemble, loadModelConfig, getRelativeElements
	 *
	 * ============
	 */

	/**
	 * assemble() configure layer's index in model, calculate the shape and parameters based on previous layer.
	 *
	 * @param { int } layerIndex, this layer's order in model
	 */

	assemble: function( layerIndex ) {

		this.layerIndex = layerIndex;

		this.depth = this.lastLayer.depth;

		this.inputShape = this.lastLayer.outputShape;

		// If user's do not define a specific 2d shape for feature map, infer layer output shape from input shape and config.

		if ( !this.isShapePredefined ) {

			if ( this.padding === "valid" ) {

				// ceil[ ( W - F + 1 ) / S ]

				this.width = Math.ceil( ( this.inputShape[ 0 ] - this.poolSize[ 0 ] + 1 ) / this.strides[ 0 ] );
				this.height = Math.ceil( ( this.inputShape[ 1 ] - this.poolSize[ 1 ] + 1 ) / this.strides[ 1 ] );

			} else if ( this.padding === "same" ) {

				// ceil( W / S )

				this.width = Math.ceil( this.inputShape[ 0 ] / this.strides[ 0 ] );
				this.height = Math.ceil( this.inputShape[ 1 ] / this.strides[ 1 ] );

			}

		}

		// Pooling2d layer's outputShape has three dimension, that's why Pooling2d layer inherits from abstract layer "NativeLayer3d".

		this.outputShape = [ this.width, this.height, this.depth ];

		// Unit length is the same as last layer, use unit length to calculate actualWidth and actualHeight which are used to create three.js object.

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;
		this.actualHeight = this.height * this.unitLength;

		// Calculate the feature map centers for close status and open status.

		for ( let i = 0; i < this.depth; i ++ ) {

			let center = {

				x: 0,
				y: 0,
				z: 0

			};

			this.closeFmCenters.push( center );

			// Pooling2d's feature maps align to last layer.

			let fmCenter = {

				x: this.lastLayer.openFmCenters[ i ].x,
				y: this.lastLayer.openFmCenters[ i ].y,
				z: this.lastLayer.openFmCenters[ i ].z

			};

			this.openFmCenters.push( fmCenter );

		}

	},

	/**
	 * loadModelConfig() load model's configuration into Pooling2d object,
	 * If one specific attribute has been set before, model's configuration will not be loaded into it.
	 *
	 * Based on the passed in modelConfig parameter
	 *
	 * @param { JSON } modelConfig, default and user's configuration for model
	 */

	loadModelConfig: function( modelConfig ) {

		// Call super class "Layer"'s method to load common model configuration, check out "Layer.js" file for more information.

		this.loadBasicModelConfig( modelConfig );

		if ( this.color === undefined ) {

			this.color = modelConfig.color.pooling2d;

		}

		if ( this.aggregationStrategy === undefined ) {

			this.aggregationStrategy = modelConfig.aggregationStrategy;

		}

	},

	/**
	 * getRelativeElements() get relative element in last layer for relative lines based on given hovered element.
	 *
	 * Use bridge design patten:
	 * 1. "getRelativeElements" send request to previous layer for relative elements;
	 * 2. Previous layer's "provideRelativeElements" receives request, return relative elements.
	 *
	 * @param { THREE.Object } selectedElement, hovered element detected by THREE's Raycaster.
	 * @return { THREE.Object[] } relativeElements
	 */

	getRelativeElements: function( selectedElement ) {

		let relativeElements = [];

		if ( selectedElement.elementType === "aggregationElement" ) {

			// "all" means get all "displayed" elements from last layer.

			let request = {

				all: true

			};

			relativeElements = this.lastLayer.provideRelativeElements( request ).elementList;

		} else if ( selectedElement.elementType === "featureMap" ) {

			// Get element which has the same index.

			let fmIndex = selectedElement.fmIndex;

			let request = {

				index: fmIndex

			};

			relativeElements = this.lastLayer.provideRelativeElements( request ).elementList;

		}

		return relativeElements;

	},

	/**
	 * ============
	 *
	 * Functions above override base class NativeLayer3d's abstract method.
	 *
	 * ============
	 */

	/**
	 * loadLayerConfig() Load user's configuration into Pooling2d.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for Pooling2d.
	 */

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			// "poolSize" configuration is required.

			if ( layerConfig.poolSize !== undefined ) {

				if ( layerConfig.poolSize instanceof Array ) {

					this.poolSize[ 0 ] = layerConfig.poolSize[ 0 ];
					this.poolSize[ 1 ] = layerConfig.poolSize[ 1 ];

				} else {

					this.poolSize[ 0 ] = layerConfig.poolSize;
					this.poolSize[ 1 ] = layerConfig.poolSize;

				}

			} else {

				console.error( "\"poolSize\" is required for Pooling2d layer" );

			}

			// "strides" configuration is required.

			if ( layerConfig.strides !== undefined ) {

				if ( layerConfig.strides instanceof Array ) {

					this.strides[ 0 ] = layerConfig.strides[ 0 ];
					this.strides[ 1 ] = layerConfig.strides[ 1 ];

				} else {

					this.strides[ 0 ] = layerConfig.strides;
					this.strides[ 1 ] = layerConfig.strides;

				}

			} else {

				console.error( "\"strides\" is required for Pooling2d layer" );

			}

			// Load user's predefined 2d shape.

			if ( layerConfig.shape !== undefined ) {

				this.isShapePredefined = true;
				this.width = layerConfig.shape[ 0 ];
				this.height = layerConfig.shape[ 1 ];

			}

			// Load padding mode, accept two mode: "valid" and "same", support both uppercase and lowercase.

			if ( layerConfig.padding !== undefined ) {

				if ( layerConfig.padding.toLowerCase() === "valid" ) {

					this.padding = "valid";

				} else if ( layerConfig.padding.toLowerCase() === "same" ) {

					this.padding = "same";

				} else {

					console.error( "\"padding\" property do not support for " + layerConfig.padding + ", use \"valid\" or \"same\" instead." );

				}

			}

		}

	}

} );

export { Pooling2d };