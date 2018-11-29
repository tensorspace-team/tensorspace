/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer3d } from "../abstract/NativeLayer3d";

/**
 * Cropping layer for 2D input.
 * This layer can crop an input at the top, bottom, left and right side.
 *
 * @param config, user's configuration for Cropping2d layer
 * @constructor
 */

function Cropping2d( config ) {

	// "Cropping2d" inherits from abstract layer "NativeLayer3d".

	NativeLayer3d.call( this, config );

	/**
	 * Dimension of the cropping along the width and the height.
	 *
	 * @type { Array }
	 */

	this.cropping = undefined;

	/**
	 * Actual cropping size to width and height.
	 *
	 * @type { int }
	 */

	this.croppingWidth = undefined;
	this.croppingHeight = undefined;

	// Load user's Cropping2d configuration.

	this.loadLayerConfig( config );

	this.layerType = "Cropping2d";

}

Cropping2d.prototype = Object.assign( Object.create( NativeLayer3d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer3d's abstract method
	 *
	 * Cropping2d overrides NativeLayer3d's function:
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

		this.width = this.inputShape[ 0 ] - this.croppingWidth;
		this.height = this.inputShape[ 1 ] - this.croppingHeight;

		this.depth = this.inputShape[ 2 ];

		// Cropping2d layer's outputShape has three dimension, that's why Cropping2d layer inherits from abstract layer "NativeLayer3d".

		this.outputShape = [ this.width, this.height, this.depth ];

		// Unit length is the same as last layer, use unit length to calculate actualWidth and actualHeight which are used to create three.js object.

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;
		this.actualHeight = this.height * this.unitLength;

		// Calculate the feature map centers for close status and open status.

		for ( let i = 0; i < this.depth; i ++ ) {

			let closeCenter = {

				x: 0,
				y: 0,
				z: 0

			};

			this.closeFmCenters.push( closeCenter );

			// Cropping2d's feature map align to last layer.

			let openCenter = {

				x: this.lastLayer.openFmCenters[ i ].x,
				y: this.lastLayer.openFmCenters[ i ].y,
				z: this.lastLayer.openFmCenters[ i ].z

			};

			this.openFmCenters.push( openCenter );

		}

	},

	/**
	 * loadModelConfig() load model's configuration into Cropping2d object,
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

			this.color = modelConfig.color.cropping2d;

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
	 * loadLayerConfig() Load user's configuration into Cropping2d.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for Cropping2d.
	 */

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			// "cropping" configuration is required.

			if ( layerConfig.cropping !== undefined ) {

				this.cropping = layerConfig.cropping;
				this.croppingWidth = layerConfig.cropping[ 0 ][ 0 ] + layerConfig.cropping[ 0 ][ 1 ];
				this.croppingHeight = layerConfig.cropping[ 1 ][ 0 ] + layerConfig.cropping[ 1 ][ 1 ];

			} else {

				console.error( "\"cropping\" property is required for cropping2d layer." );

			}

		} else {

			console.error( "Lack config for cropping2d layer." );

		}

	}

} );

export { Cropping2d };