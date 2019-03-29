/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer1d } from "../abstract/NativeLayer1d";

/**
 * Flattens the input.
 *
 * @param config, user's configuration for Flatten layer
 * @constructor
 */

function Flatten( config ) {

	// "Flatten" inherits from abstract layer "NativeLayer1d".

	NativeLayer1d.call( this, config );

	this.layerType = "Flatten";

}

Flatten.prototype = Object.assign( Object.create( NativeLayer1d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer1d's abstract method
	 *
	 * Dense overrides NativeLayer1d's function:
	 * assemble, loadModelConfig, getRelativeElements
	 *
	 * ============
	 */

	/**
	 * assemble() calculate the shape and parameters based on previous layer or pre-defined shape.
	 */

	assemble: function() {
		
		// Load user's Flatten configuration.
		
		this.loadLayerConfig( this.config );
		
		// If user's do not define a specific shape for layer, infer layer output shape from input shape and config.

		if ( !this.isShapePredefined ) {

			let units = 1;

			// Calculate output length.

			for ( let i = 0; i < this.lastLayer.outputShape.length; i++ ) {

				units *= this.lastLayer.outputShape[ i ];

			}

			this.width = units;

		}

		if ( this.paging ) {

			this.totalSegments = Math.ceil( this.width / this.segmentLength );

		}

		// Flatten layer's outputShape has one dimension, that's why Flatten layer inherits from abstract layer "NativeLayer1d".

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
	 * loadModelConfig() load model's configuration into Dense object,
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

			this.color = modelConfig.color.flatten;

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
	 * loadLayerConfig() Load user's configuration into Dense.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for Dense.
	 */

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig.shape !== undefined ) {

			// Load user's predefined shape.

			this.isShapePredefined = true;
			this.width = layerConfig.shape[ 0 ];

		}

	}

} );

export { Flatten };