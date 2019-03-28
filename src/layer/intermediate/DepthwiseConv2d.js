import { FmCenterGenerator } from '../../utils/FmCenterGenerator';
import { NativeLayer3d } from "../abstract/NativeLayer3d";

/**
 * Depthwise 2D Convolution.
 *
 * @param config, user's configuration for DepthwiseConv2d layer
 * @constructor
 */

function DepthwiseConv2d( config ) {

	// "DepthwiseConv2d" inherits from abstract layer "NativeLayer3d".

	NativeLayer3d.call( this, config );

	/**
	 * The dimension of the convolution window.
	 * The 2d convolutional window is rectangle.
	 * Default to [ 1, 1 ].
	 *
	 * @type { int }
	 */

	this.kernelSize = [ 1, 1 ];

	/**
	 * The number of depthwise convolution output channels for each input channel.
	 * Default to 1.
	 *
	 * @type { int }
	 */

	this.depthMultiplier = 1;

	/**
	 * The strides of the convolution.
	 * Strides in both dimensions may be different.
	 * Default to [ 1, 1 ].
	 *
	 * @type { int }
	 */

	this.strides = [ 1, 1 ];

	/**
	 * Padding mode.
	 * "valid" or "same", default to "valid".
	 *
	 * @type { string }
	 */

	this.padding = "valid";

	// Load user's DepthwiseConv2d configuration.

	this.loadLayerConfig( config );

	this.layerType = "DepthwiseConv2d";

}

DepthwiseConv2d.prototype = Object.assign( Object.create( NativeLayer3d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer3d's abstract method
	 *
	 * DepthwiseConv2d overrides NativeLayer3d's function:
	 * assemble, loadModelConfig, getRelativeElements
	 *
	 * ============
	 */

	/**
	 * assemble() calculate the shape and parameters based on previous layer or pre-defined shape.
	 */

	assemble: function() {

		this.inputShape = this.lastLayer.outputShape;

		// If user's do not define a specific 2d shape for feature map, infer layer output shape from input shape and config.

		if ( !this.isShapePredefined ) {

			// Two padding mode is the same as TensorFlow

			if ( this.padding === "valid" ) {

				// ceil[ ( W - F + 1 ) / S ]

				this.width = Math.ceil( ( this.inputShape[ 0 ] - this.kernelSize[ 0 ] + 1 ) / this.strides[ 0 ] );
				this.height = Math.ceil( ( this.inputShape[ 1 ] - this.kernelSize[ 1 ] + 1 ) / this.strides[ 1 ] );

			} else if ( this.padding === "same" ) {

				// ceil( W / S )

				this.width = Math.ceil( this.inputShape[ 0 ] / this.strides[ 0 ] );
				this.height = Math.ceil( this.inputShape[ 1 ] / this.strides[ 0 ] );

			}

			this.depth = this.inputShape[ 2 ] * this.depthMultiplier;

		} else {

			this.depthMultiplier = this.depth / this.inputShape[ 2 ];

		}

		// DepthwiseConv2d layer's outputShape has three dimension, that's why DepthwiseConv2d layer inherits from abstract layer "NativeLayer3d".

		this.outputShape = [ this.width, this.height, this.depth ];

		// Unit length is the same as last layer, use unit length to calculate actualWidth and actualHeight which are used to create three.js object.

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;
		this.actualHeight = this.height * this.unitLength;

		// Calculate the feature map centers for open status.

		this.openFmCenters = FmCenterGenerator.getFmCenters(

			this.layerShape,
			this.depth,
			this.actualWidth,
			this.actualHeight

		);

		// Init close feature map centers.

		for ( let i = 0; i < this.depth; i ++ ) {

			let center = {

				x: 0,
				y: 0,
				z: 0

			};

			this.closeFmCenters.push( center );

		}

	},

	/**
	 * loadModelConfig() load model's configuration into DepthwiseConv2d object,
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

			this.color = modelConfig.color.depthwiseConv2d;

		}

		if ( this.layerShape === undefined ) {

			this.layerShape = modelConfig.layerShape;

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

			// Get element relative to fmIndex.

			let fmIndex = selectedElement.fmIndex;

			let request = {

				index: Math.floor( fmIndex / this.depthMultiplier )

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
	 * loadLayerConfig() Load user's configuration into DepthwiseConv2d.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for DepthwiseConv2d.
	 */

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			if ( layerConfig.shape !== undefined ) {

				// Load user's predefined layer shape.

				this.isShapePredefined = true;
				this.width = layerConfig.shape[0];
				this.height = layerConfig.shape[1];
				this.depth = layerConfig.shape[2];

			} else {

				// Optional configuration.

				if ( layerConfig.kernelSize !== undefined ) {

					if ( layerConfig.kernelSize instanceof Array ) {

						this.kernelSize[ 0 ] = layerConfig.kernelSize[ 0 ];
						this.kernelSize[ 1 ] = layerConfig.kernelSize[ 1 ];

					} else {

						this.kernelSize[ 0 ] = layerConfig.kernelSize;
						this.kernelSize[ 1 ] = layerConfig.kernelSize;

					}

				}

				if ( layerConfig.strides !== undefined ) {

					if ( layerConfig.strides instanceof Array ) {

						this.strides[ 0 ] = layerConfig.strides[ 0 ];
						this.strides[ 1 ] = layerConfig.strides[ 1 ];

					} else {

						this.strides[ 0 ] = layerConfig.strides;
						this.strides[ 1 ] = layerConfig.strides;

					}

				}

				if ( layerConfig.depthMultiplier !== undefined ) {

					this.depthMultiplier = layerConfig.depthMultiplier;

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

		} else {

			// Some configuration is required for Conv2d layer.

			console.error( "Lack config for DepthwiseConv2d layer." );

		}

	}

} );

export { DepthwiseConv2d };