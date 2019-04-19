/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer2d } from "../abstract/NativeLayer2d";

/**
 * Zero-padding layer for previous 1D input layer and 2D intermediate layer.
 *
 * @param config, user's configuration for Padding1d layer
 * @constructor
 */

function Padding1d( config ) {

	// "Pooling1d" inherits from abstract layer "NativeLayer2d".

	NativeLayer2d.call( this, config );

	/**
	 * padding parameters.
	 *
	 * @type { int }
	 */

	this.paddingLeft = undefined;
	this.paddingRight = undefined;
	this.paddingWidth = undefined;

	/**
	 * Actual content parameters.
	 *
	 * @type { int }
	 */

	this.contentWidth = undefined;

	this.layerType = "Padding1d";

}

Padding1d.prototype = Object.assign( Object.create( NativeLayer2d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer2d's abstract method
	 *
	 * Padding1d overrides NativeLayer2d's function:
	 * assemble, loadModelConfig, getRelativeElements
	 *
	 * ============
	 */

	/**
	 * assemble() calculate the shape and parameters based on previous layer or pre-defined shape.
	 */

	assemble: function() {
		
		// Load user's Padding1d configuration.
		
		this.loadLayerConfig( this.config );
		
		this.inputShape = this.lastLayer.outputShape;

		// If user's do not define a specific shape for layer, infer layer output shape from input shape and config.

		if ( !this.isShapePredefined ) {

			// Calculate layer's shape from last layer and user's configuration.

			this.contentWidth = this.inputShape[ 0 ];
			this.width = this.contentWidth + this.paddingWidth;
			this.depth = this.inputShape[ 1 ];

		}

		// Padding1d layer's outputShape has two dimension, that's why Padding1d layer inherits from abstract layer "NativeLayer2d".

		this.outputShape = [ this.width, this.depth ];

		// Unit length is the same as last layer, use unit length to calculate actualWidth which is used to create three.js object.

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;

		// Calculate the grid line centers for close status and open status.

		for ( let i = 0; i < this.depth; i ++ ) {

			let closeCenter = {

				x: 0,
				y: 0,
				z: 0

			};

			this.closeCenterList.push( closeCenter );

			// Padding1d's grid lines align to last layer.

			let openCenter = {

				x: this.lastLayer.openCenterList[ i ].x,
				y: this.lastLayer.openCenterList[ i ].y,
				z: this.lastLayer.openCenterList[ i ].z

			};

			this.openCenterList.push( openCenter );

		}

	},

	/**
	 * loadModelConfig() load model's configuration into Padding1d object,
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

			this.color = modelConfig.color.padding1d;

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
	 * loadLayerConfig() Load user's configuration into Padding1d.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for Padding1d.
	 */

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			if ( layerConfig.shape !== undefined ) {

				// Load user's predefined shape.

				this.isShapePredefined = true;
				this.width = layerConfig.shape[ 0 ];
				this.depth = layerConfig.shape[ 1 ];

			} else {

				// "padding" configuration is required.

				if ( layerConfig.padding !== undefined ) {

					// Calculate padding parameters from user's padding config.

					this.paddingLeft = layerConfig.padding;
					this.paddingRight = layerConfig.padding;
					this.paddingWidth = this.paddingLeft + this.paddingRight;

				} else {

					console.error( "\"padding\" property is required for padding layer." );

				}

			}

		} else {

			console.error( "Lack config for padding1d layer." );

		}

	}

} );

export { Padding1d };