/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer2d } from "../abstract/NativeLayer2d";

/**
 * Cropping layer for 1D input.
 * This layer can crop an input at the left and right side.
 *
 * @param config, user's configuration for Cropping1d layer
 * @constructor
 */

function Cropping1d( config ) {

	// "Cropping1d" inherits from abstract layer "NativeLayer2d".

	NativeLayer2d.call( this, config );

	/**
	 * Dimension of the cropping along the width.
	 *
	 * @type { Array }
	 */

	this.cropping = undefined;

	/**
	 * Actual cropping size to width.
	 *
	 * @type { int }
	 */

	this.croppingWidth = undefined;

	// Load user's Cropping1d configuration.

	this.loadLayerConfig( config );

	this.layerType = "Cropping1d";

}

Cropping1d.prototype = Object.assign( Object.create( NativeLayer2d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer2d's abstract method
	 *
	 * Cropping1d overrides NativeLayer2d's function:
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
		this.depth = this.inputShape[ 1 ];

		// Cropping1d layer's outputShape has two dimension, that's why Cropping1d layer inherits from abstract layer "NativeLayer2d".

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

			// Cropping1d's grid lines align to last layer.

			let openCenter = {

				x: this.lastLayer.openCenterList[ i ].x,
				y: this.lastLayer.openCenterList[ i ].y,
				z: this.lastLayer.openCenterList[ i ].z

			};

			this.openCenterList.push( openCenter );

		}

	},

	/**
	 * loadModelConfig() load model's configuration into Cropping1d object,
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

			this.color = modelConfig.color.cropping1d;

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
	 * loadLayerConfig() Load user's configuration into Cropping1d.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for Cropping1d.
	 */

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			// "cropping" configuration is required.

			if ( layerConfig !== undefined ) {

				this.cropping = layerConfig.cropping;
				this.croppingWidth = layerConfig.cropping[ 0 ] + layerConfig.cropping[ 1 ];

			} else {

				console.error( "\"cropping\" property is required for cropping1d layer." );

			}

		} else {

			console.error( "Lack config for cropping1d layer." );

		}

	}

} );

export { Cropping1d };