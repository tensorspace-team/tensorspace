/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer2d } from "../abstract/NativeLayer2d";

/**
 * Applies an activation function to an 2D output.
 *
 * @param config, user's configuration for Activation2d layer
 * @constructor
 */

function Activation2d( config ) {

	// "Activation2d" inherits from abstract layer "NativeLayer2d".

	NativeLayer2d.call( this, config );

	/**
	 * Name of the activation function to use.
	 *
	 * @type { string }
	 */

	this.activation = undefined;

	// Load user's Activation2d configuration.

	this.loadLayerConfig( config );

	this.layerType = "Activation2d";

}

Activation2d.prototype = Object.assign( Object.create( NativeLayer2d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer2d's abstract method
	 *
	 * Activation2d overrides NativeLayer2d's function:
	 * assemble, loadModelConfig, getRelativeElements
	 *
	 * ============
	 */

	/**
	 * assemble() calculate the shape and parameters based on previous layer or pre-defined shape.
	 */

	assemble: function() {

		this.inputShape = this.lastLayer.outputShape;

		// If user's do not define a specific shape for layer, infer layer output shape from input shape and config.

		if ( !this.isShapePredefined ) {

			// Calculate layer's shape from last layer.

			this.width = this.inputShape[ 0 ];
			this.depth = this.inputShape[ 1 ];

		}

		// Activation2d layer's outputShape has two dimension, that's why Activation2d layer inherits from abstract layer "NativeLayer2d".

		this.outputShape = [ this.width, this.depth ];

		// Unit length is the same as last layer, use unit length to calculate actualWidth and actualHeight which are used to create three.js object.

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.unitLength * this.width;

		// Calculate the grid line centers for close status and open status.

		for ( let i = 0; i < this.depth; i ++ ) {

			this.closeCenterList.push( {

				x: 0,
				y: 0,
				z: 0

			} );

			// Activation2d's grid lines align to last layer.

			this.openCenterList.push( {

				x: this.lastLayer.openCenterList[ i ].x,
				y: this.lastLayer.openCenterList[ i ].y,
				z: this.lastLayer.openCenterList[ i ].z

			} );

		}

	},

	/**
	 * loadModelConfig() load model's configuration into Activation2d object,
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

			this.color = modelConfig.color.activation2d;

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

		} else if ( selectedElement.elementType === "gridLine" ) {

			// Get element which has the same index.

			let gridIndex = selectedElement.gridIndex;

			let request = {

				index: gridIndex

			};

			relativeElements = this.lastLayer.provideRelativeElements( request ).elementList;

		}

		return relativeElements;

	},

	/**
	 * ============
	 *
	 * Functions above override base class NativeLayer2d's abstract method.
	 *
	 * ============
	 */

	/**
	 * loadLayerConfig() Load user's configuration into Activation2d.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for Activation2d.
	 */

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			if ( layerConfig.shape !== undefined ) {

				// Load user's predefined layer shape.

				this.isShapePredefined = true;
				this.width = layerConfig.shape[ 0 ];
				this.depth = layerConfig.shape[ 1 ];

			} else {

				// "activation" configuration is required.

				if ( layerConfig.activation !== undefined ) {

					this.activation = layerConfig.activation;

				} else {

					console.error( "\"activation\" property is required for activation1d layer." );

				}

			}

		} else {

			console.error( "Lack config for activation2d layer." );

		}

	}

} );

export { Activation2d };