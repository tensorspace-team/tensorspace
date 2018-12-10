/**
 * @author syt123450 / https://github.com/syt123450
 */

import { FmCenterGenerator } from "../../utils/FmCenterGenerator";
import { NativeLayer3d } from "../abstract/NativeLayer3d";

/**
 * 2D Upsampling layer for layer inputs.
 * Repeats the rows and columns of the data.
 *
 * @param config, user's configuration for UpSampling2d layer
 * @constructor
 */

function UpSampling2d( config ) {

	// "UpSampling2d" inherits from abstract layer "NativeLayer3d".

	NativeLayer3d.call( this, config );

	/**
	 * The upsampling factors for width and height.
	 * For example: [ 2, 2 ].
	 *
	 * @type { Array }
	 */

	this.size = undefined;

	/**
	 * The upsampling factors for width and height separately.
	 *
	 * @type { int }
	 */

	this.widthSize = undefined;
	this.heightSize = undefined;

	/**
	 * Whether user directly define the layer shape.
	 * Set "true" if UpSampling2d's shape is predefined by user.
	 *
	 * @type { boolean }
	 */

	this.isShapePredefined = false;

	// Load user's UpSampling2d configuration.

	this.loadLayerConfig( config );

	this.layerType = "UpSampling2d";

}

UpSampling2d.prototype = Object.assign( Object.create( NativeLayer3d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer3d's abstract method
	 *
	 * UpSampling2d overrides NativeLayer3d's function:
	 * assemble, loadModelConfig, getRelativeElements
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

		this.depth = this.lastLayer.depth;

		this.inputShape = this.lastLayer.outputShape;

		// If user's do not define a specific 2d shape for feature map, infer layer output shape from input shape and config.

		if ( !this.isShapePredefined ) {

			this.width = this.lastLayer.width * this.widthSize;
			this.height = this.lastLayer.height * this.heightSize;

		}

		// UpSampling2d layer's outputShape has three dimension, that's why UpSampling2d layer inherits from abstract layer "NativeLayer3d".

		this.outputShape = [ this.width, this.height, this.depth ];

		// Unit length is the same as last layer, use unit length to calculate actualWidth and actualHeight which are used to create three.js object.

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;
		this.actualHeight = this.height * this.unitLength;

		// Calculate the feature map centers for close status.

		for ( let i = 0; i < this.depth; i ++ ) {

			let center = {

				x: 0,
				y: 0,
				z: 0

			};

			this.closeFmCenters.push( center );

		}

		// Calculate the feature map centers for open status.

		this.openFmCenters = FmCenterGenerator.getFmCenters(

			this.layerShape,
			this.depth,
			this.actualWidth,
			this.actualHeight

		);

	},

	/**
	 * loadModelConfig() load model's configuration into UpSampling2d object,
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

			this.color = modelConfig.color.upSampling2d;

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
	 * loadLayerConfig() Load user's configuration into UpSampling2d.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for UpSampling2d.
	 */

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			// "size" configuration is required.

			if ( layerConfig.size !== undefined ) {

				this.size = layerConfig.size;
				this.widthSize = layerConfig.size[ 0 ];
				this.heightSize = layerConfig.size[ 1 ];

			} else {

				console.error( "\"size\" property is required for UpSampling layer" );

			}

			// Load user's predefined 2d shape.

			if ( layerConfig.shape !== undefined ) {

				this.isShapePredefined = true;
				this.width = layerConfig.shape[ 0 ];
				this.height = layerConfig.shape[ 1 ];

			}

		}

	}

} );

export { UpSampling2d }