/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer3d } from "../abstract/NativeLayer3d";

/**
 * Zero-padding layer for previous 2D input layer and 3D intermediate layer.
 *
 * @param config, user's configuration for Padding2d layer
 * @constructor
 */

function Padding2d( config ) {

	// "Padding2d" inherits from abstract layer "NativeLayer3d".

	NativeLayer3d.call( this, config );

	/**
	 * padding parameters.
	 *
	 * @type { int }
	 */

	this.paddingWidth = undefined;
	this.paddingHeight = undefined;
	this.paddingLeft = undefined;
	this.paddingRight = undefined;
	this.paddingTop = undefined;
	this.paddingBottom = undefined;

	/**
	 * Actual content parameters.
	 *
	 * @type { int }
	 */

	this.contentWidth = undefined;
	this.contentHeight = undefined;

	this.layerType = "Padding2d";

}

Padding2d.prototype = Object.assign( Object.create( NativeLayer3d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer3d's abstract method
	 *
	 * padding2d overrides NativeLayer3d's function:
	 * assemble, loadModelConfig, getRelativeElements
	 *
	 * ============
	 */

	/**
	 * assemble() calculate the shape and parameters based on previous layer or pre-defined shape.
	 */

	assemble: function() {
		
		// Load user's Padding2d configuration.
		
		this.loadLayerConfig( this.config );
		
		// If user's do not define a specific 2d shape for feature map, infer layer output shape from input shape and config.

		if ( !this.isShapePredefined ) {

			// Calculate layer's shape from last layer and user's configuration.

			this.contentWidth = this.lastLayer.width;
			this.contentHeight = this.lastLayer.height;
			this.depth = this.lastLayer.depth;
			this.width = this.contentWidth + this.paddingWidth;
			this.height = this.contentHeight + this.paddingHeight;

		}

		// Padding2d layer's outputShape has three dimension, that's why Padding2d layer inherits from abstract layer "NativeLayer3d".

		this.outputShape = [ this.width, this.height, this.depth ];

		// Unit length is the same as last layer, use unit length to calculate actualWidth and actualHeight which are used to create three.js object.

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;
		this.actualHeight = this.height * this.unitLength;

		// Calculate the feature map centers for close status and open status.

		for ( let i = 0; i < this.depth; i ++ ) {

			let closeFmCenter = {

				x: 0,
				y: 0,
				z: 0

			};

			this.closeFmCenters.push( closeFmCenter );

			// Padding2d's feature map align to last layer.

			let openFmCenter = {

				x: this.lastLayer.openFmCenters[ i ].x,
				y: this.lastLayer.openFmCenters[ i ].y,
				z: this.lastLayer.openFmCenters[ i ].z

			};

			this.openFmCenters.push( openFmCenter );

		}

	},

	/**
	 * loadModelConfig() load model's configuration into Padding2d object,
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

			this.color = modelConfig.color.padding2d;

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
	 * loadLayerConfig() Load user's configuration into padding2d.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for padding2d.
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

				// "padding" configuration is required.

				if ( layerConfig.padding !== undefined ) {

					// Calculate padding parameters from user's padding config.

					this.paddingTop = layerConfig.padding[ 0 ];
					this.paddingBottom = layerConfig.padding[ 0 ];
					this.paddingLeft = layerConfig.padding[ 1 ];
					this.paddingRight = layerConfig.padding[ 1 ];

					this.paddingHeight = this.paddingTop + this.paddingBottom;
					this.paddingWidth = this.paddingLeft + this.paddingRight;

				} else {

					console.error( "\"padding\" property is required for padding layer" );

				}

			}

		}

	}

} );

export { Padding2d };