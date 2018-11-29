/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer1d } from "../abstract/NativeLayer1d";
import { QueueCenterGenerator } from "../../utils/QueueCenterGenerator";

/**
 * Reshape an input to a certain 1d shape.
 *
 * @param config, user's configuration for Reshape1d layer
 * @constructor
 */

function Reshape1d( config ) {

	// "Reshape1d" inherits from abstract layer "NativeLayer1d".

	NativeLayer1d.call( this, config );

	/**
	 * Certain 1d shape the input will be reshape into.
	 * For example: [ 3 ]
	 *
	 * @type { Array }
	 */

	this.targetShape = undefined;

	/**
	 * Total Neural number in layer, calculated in assemble period based on input shape.
	 * Set init size to be 1.
	 *
	 * @type { int }
	 */

	this.totalSize = 1;

	// Load user's Reshape configuration.

	this.loadLayerConfig( config );

	this.layerType = "Reshape1d";

}

Reshape1d.prototype = Object.assign( Object.create( NativeLayer1d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer1d's abstract method
	 *
	 * Reshape1d overrides NativeLayer1d's function:
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

		this.inputShape = this.lastLayer.outputShape;

		// Calculate layer's shape from last layer and user's configuration.

		for ( let i = 0; i < this.inputShape.length; i ++ ) {

			this.totalSize *= this.inputShape[ i ];

		}

		// Check whether the input shape can be reshape into target shape.

		if ( this.totalSize !== this.width ) {

			console.error( "input size " + this.totalSize + " can not be reshape to [" + this.width + "]" );

		}

		// Unit length is the same as last layer, use unit length to calculate actualWidth and actualHeight which are used to create three.js object.

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
	 * loadModelConfig() load model's configuration into Reshape1d object,
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

			this.color = modelConfig.color.reshape;

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
	 * loadLayerConfig() Load user's configuration into Reshape1d.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for Reshape1d.
	 */

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			// "targetShape" configuration is required.

			if ( layerConfig.targetShape !== undefined ) {

				this.targetShape = layerConfig.targetShape;
				this.width = layerConfig.targetShape[ 0 ];

				// Reshape1d layer's outputShape has one dimension, that's why Reshape1d layer inherits from abstract layer "NativeLayer1d".

				this.outputShape = [ this.width ];

			} else {

				console.error( "\"targetShape\" property is required for reshape layer" );

			}

		} else {

			console.error( "\"Lack config for reshape layer." );

		}

	}

} );

export { Reshape1d }