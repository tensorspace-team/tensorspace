/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer3d } from "../abstract/NativeLayer3d";
import { FmCenterGenerator } from "../../utils/FmCenterGenerator";

/**
 * Transposed convolutional layer (sometimes called Deconvolution).
 *
 * @param config, user's configuration for Conv2dTranspose layer
 * @constructor
 */

function Conv2dTranspose( config ) {

	// "Conv2dTranspose" inherits from abstract layer "NativeLayer3d".

	NativeLayer3d.call( this, config );

	/**
	 * The dimension of the convolution window.
	 * The 2d convolutional window is square.
	 *
	 * @type { int }
	 */

	this.kernelSize = undefined;

	/**
	 * The depth of the layer output.
	 *
	 * @type { int }
	 */

	this.filters = undefined;

	/**
	 * The strides of the convolution.
	 * Strides in both dimensions are equal.
	 *
	 * @type { int }
	 */

	this.strides = undefined;

	/**
	 * 2d feature map shape, stored as array.
	 * For example, [20, 20]
	 *
	 * @type { Array }
	 */

	this.fmShape = undefined;

	/**
	 * Padding mode.
	 * "valid" or "same", default to "valid".
	 *
	 * @type { string }
	 */

	this.padding = "valid";

	// Load user's Conv2dTranspose configuration.

	this.loadLayerConfig( config );

	// Init feature maps close feature centers.

	for ( let i = 0; i < this.depth; i ++ ) {

		let center = {

			x: 0,
			y: 0,
			z: 0

		};

		this.closeFmCenters.push( center );

	}

	this.layerType = "Conv2dTranspose";

}

Conv2dTranspose.prototype = Object.assign( Object.create( NativeLayer3d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer3d's abstract method
	 *
	 * Conv2dTranspose overrides NativeLayer3d's function:
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

		this.inputShape = this.lastLayer.outputShape;

		// infer layer output shape from input shape and config.

		if ( this.padding === "same" ) {

			// W * S

			this.width = this.inputShape[ 0 ] * this.strides[ 0 ];
			this.height = this.inputShape[ 1 ] * this.strides[ 1 ];

		} else if ( this.padding === "valid" ) {

			// ( W - 1 ) * S + F

			this.width = ( this.inputShape[ 0 ] - 1 ) * this.strides + this.kernelSize;
			this.height = ( this.inputShape[ 1 ] - 1 ) * this.strides + this.kernelSize;

		}

		// Conv2dTranspose layer's outputShape has three dimension, that's why Conv2dTranspose layer inherits from abstract layer "NativeLayer3d".

		this.outputShape = [ this.width, this.height, this.filters ];

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

	},

	/**
	 * loadModelConfig() load model's configuration into Conv2dTranspose object,
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

			this.color = modelConfig.color.conv2dTranspose;

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

		if ( selectedElement.elementType === "aggregationElement" || selectedElement.elementType === "featureMap" ) {

			// "all" means get all "displayed" elements from last layer.

			let request = {

				all: true

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
	 * loadLayerConfig() Load user's configuration into Conv2dTranspose.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for Conv2dTranspose.
	 */

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			// "filters" configuration is required.

			if ( layerConfig.filters !== undefined ) {

				this.filters = layerConfig.filters;
				this.depth = layerConfig.filters;

			} else {

				console.error( "\"filters\" property is required for Conv2dTranspose layer." );

			}

			// Optional configuration.

			if ( layerConfig.kernelSize !== undefined ) {

				this.kernelSize = layerConfig.kernelSize;

			}

			if ( layerConfig.strides !== undefined ) {

				this.strides = layerConfig.strides;

			}

			// Load padding mode, accept two mode: "valid" and "same", support both uppercase and lowercase.

			if ( layerConfig.padding !== undefined ) {

				if ( layerConfig.padding.toLowerCase() === "same" ) {

					this.padding = "same";

				} else if ( layerConfig.padding.toLowerCase() === "valid" ) {

					this.padding = "valid";

				} else {

					console.error( "\"padding\" property do not support for " + layerConfig.padding + ", use \"valid\" or \"same\" instead." );

				}

			}

		} else {

			console.error( "Lack config for Conv2dTranspose layer." );

		}

	}

} );

export { Conv2dTranspose };