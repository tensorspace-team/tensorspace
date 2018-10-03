/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer1d } from "../abstract/NativeLayer1d";

/**
 * Applies an activation function to an 1D output.
 *
 * @param config, user's configuration for Activation1d layer
 * @constructor
 */

function Activation1d( config ) {

	// "Activation1d" inherits from abstract layer "NativeLayer1d".

	NativeLayer1d.call( this, config );

	/**
	 * Name of the activation function to use.
	 *
	 * @type { string }
	 */

	this.activation = undefined;

	// Load user's Activation1d configuration.

	this.loadLayerConfig( config );

	this.layerType = "Activation1d";

}

Activation1d.prototype = Object.assign( Object.create( NativeLayer1d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer1d's abstract method
	 *
	 * Activation1d overrides NativeLayer1d's function:
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

		this.width = this.inputShape[ 0 ];

		// Activation1d layer's outputShape has one dimension, that's why Activation1d layer inherits from abstract layer "NativeLayer1d".

		this.outputShape = [ this.width ];

		// Unit length is the same as last layer, use unit length to calculate actualWidth which is used to create three.js object.

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;

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
	 * loadModelConfig() load model's configuration into Activation1d object,
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

			this.color = modelConfig.color.activation1d;

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

		if ( selectedElement.elementType === "aggregationElement" || selectedElement.elementType === "featureLine" ) {

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
	 * Functions above override base class NativeLayer1d's abstract method.
	 *
	 * ============
	 */

	/**
	 * loadLayerConfig() Load user's configuration into Activation1d.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for Activation1d.
	 */

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			// "activation" configuration is required.

			if ( layerConfig.activation !== undefined ) {

				this.activation = layerConfig.activation;

			} else {

				console.error( "\"activation\" property is required for activation1d layer." );

			}

			// TODO: add segment to Activation1d.

		} else {

			console.error( "Lack config for layer activation1d." );

		}

	}

} );

export { Activation1d };