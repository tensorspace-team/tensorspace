/**
 * @author syt123450 / https://github.com/syt123450
 */

import { FmCenterGenerator } from '../../utils/FmCenterGenerator';
import { Layer3d } from "../abstract/Layer3d";

/**
 * 2D Convolution
 *
 * @param config user's configuration for Conv2d layer
 * @returns Conv2d layer object
 */

function Conv2d( config ) {

	// "Conv2d" inherit from abstract layer "Layer3d"

	Layer3d.call( this, config );

	// The dimension of the convolution window. The 2d convolutional window is square.

	this.kernelSize = undefined;

	// The depth of the layer output.

	this.filters = undefined;

	// The strides of the convolution, strides in both dimensions are equal.

	this.strides = undefined;

	// 2d feature map shape, stored as array, for example, [20, 20]

	this.fmShape = undefined;

	// Padding mode, "valid" or "same", default to "valid".

	this.padding = "valid";

	// Set "true" if Conv2d's shape is predefined by user.

	this.isShapePredefined = false;

	// Load user's Conv2d configuration

	this.loadLayerConfig( config );

	// Init close feature map centers

	for ( let i = 0; i < this.depth; i ++ ) {

		let center = {

			x: 0,
			y: 0,
			z: 0

		};

		this.closeFmCenters.push( center );

	}

	this.layerType = "conv2d";

}

Conv2d.prototype = Object.assign( Object.create( Layer3d.prototype ), {

	/**
	 * loadLayerConfig() check user's configuration and load it into Conv2d object.
	 *
	 * Based on the passed in layerConfig parameter.
	 *
	 * @param { JSON } layerConfig
	 */

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			// Optional configuration.

			this.kernelSize = layerConfig.kernelSize;
			this.strides = layerConfig.strides;
			this.depth = layerConfig.filters;

			// "filters" configuration is required.

			if ( layerConfig.filters !== undefined ) {

				this.filters = layerConfig.filters;

			} else {

				console.error( "\"filters\" property is required for Conv2d layer." );

			}

			// Load user's predefined 2d shape.

			if ( layerConfig.shape !== undefined ) {

				this.isShapePredefined = true;
				this.fmShape = layerConfig.shape;
				this.width = this.fmShape[ 0 ];
				this.height = this.fmShape[ 1 ];

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

		} else {

			// Some configuration is required for Conv2d layer.

			console.error( "Lack config for Conv2d layer." );

		}

	},

	/**
	 * loadModelConfig() load model's configuration into Conv2d object,
	 * If one specific attribute has been set before, model's configuration will not be loaded into it.
	 *
	 * Based on the passed in modelConfig parameter
	 *
	 * @param { JSON } modelConfig
	 */

	loadModelConfig: function( modelConfig ) {

		// Call super class "Layer"'s method to load common model configuration, check out "Layer.js" file for more information.

		this.loadBasicModelConfig( modelConfig );

		if ( this.color === undefined ) {

			this.color = modelConfig.color.conv2d;

		}

		if ( this.layerShape === undefined ) {

			this.layerShape = modelConfig.layerShape;

		}

		if ( this.aggregationStrategy === undefined ) {

			this.aggregationStrategy = modelConfig.aggregationStrategy;

		}

	},

	/**
	 * assemble() configure layer's index in model, calculate the shape and parameters based on previous layer.
	 *
	 * @param { int } layerIndex
	 */

	assemble: function ( layerIndex ) {

		this.layerIndex = layerIndex;

		// If user's do not define a specific 2d shape for feature map,

		if ( !this.isShapePredefined ) {

			this.inputShape = this.lastLayer.outputShape;

			// Two padding mode is the same as TensorFlow

			if ( this.padding === "valid" ) {

				// ceil[ ( W - F + 1 ) / S ]

				this.width = Math.floor( ( this.inputShape[ 0 ] - this.kernelSize ) / this.strides ) + 1;
				this.height = Math.floor( ( this.inputShape[ 1 ] - this.kernelSize) / this.strides ) + 1;

			} else if ( this.padding === "same" ) {

				// ceil( W / S )

				this.width = Math.ceil( this.inputShape[ 0 ] / this.strides );
				this.height = Math.ceil( this.inputShape[ 1 ] / this.strides );

			}

			this.fmShape = [ this.width, this.height ];

		}

		// Conv2d layer's outputShape has three dimension, that's why Conv2d layer inherits from abstract layer "Layer3d".

		this.outputShape = [ this.width, this.height, this.filters ];

		// Unit length is the same as last layer, use unit length to calculate actualWidth and actualHeight which are used to create three.js object

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;
		this.actualHeight = this.height * this.unitLength;

		// Calculate the feature map centers for open status

		this.openFmCenters = FmCenterGenerator.getFmCenters(

			this.layerShape,
			this.depth,
			this.actualWidth,
			this.actualHeight

		);

	},

	/**
	 * getRelativeElements() get relative element in last layer for relative lines based on given hovered element.
	 *
	 * Use bridge design patten:
	 * 1. "getRelativeElements" send request to previous layer for relative elements;
	 * 2. Previous layer's "provideRelativeElements" receives request, return relative elements.
	 *
	 * @param { THREE.Object } selectedElement
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

	}

} );

export { Conv2d };