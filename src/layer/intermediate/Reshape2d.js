/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer2d } from "../abstract/NativeLayer2d";
import { QueueCenterGenerator } from "../../utils/QueueCenterGenerator";

/**
 * Reshape an input to a certain 2d shape.
 *
 * @param config, user's configuration for Reshape2d layer
 * @constructor
 */

function Reshape2d( config ) {

	// "Reshape2d" inherits from abstract layer "NativeLayer3d".

	NativeLayer2d.call( this, config );

	/**
	 * Certain 2d shape the input will be reshape into.
	 * For example: [ 3, 3 ]
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

	this.layerType = "Reshape2d";

}

Reshape2d.prototype = Object.assign( Object.create( NativeLayer2d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer2d's abstract method
	 *
	 * Reshape2d overrides NativeLayer2d's function:
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

		if ( this.totalSize !== this.width * this.depth ) {

			console.error( "input size " + this.totalSize + " can not be reshape to [" + this.width + ", " + this.depth + "]" );

		}

		// Unit length is the same as last layer, use unit length to calculate actualWidth and actualHeight which are used to create three.js object.

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;

		// Calculate the grid line centers for close status.

		for ( let i = 0; i < this.depth; i ++ ) {

			let closeCenter = {

				x: 0,
				y: 0,
				z: 0

			};

			this.closeCenterList.push( closeCenter );

		}

		// Calculate the grid line centers for open status.

		this.openCenterList = QueueCenterGenerator.getCenterList( this.actualWidth, this.depth );

	},

	/**
	 * loadModelConfig() load model's configuration into Reshape2d object,
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

			// As reshape layer's feature map number is different with last layer, will not show relation lines

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
	 * loadLayerConfig() Load user's configuration into Reshape2d.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for Reshape2d.
	 */

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			// "targetShape" configuration is required.

			if ( layerConfig.targetShape !== undefined ) {

				this.targetShape = layerConfig.targetShape;
				this.width = layerConfig.targetShape[ 0 ];
				this.depth = layerConfig.targetShape[ 1 ];

				// Reshape2d layer's outputShape has two dimension, that's why Reshape2d layer inherits from abstract layer "NativeLayer2d".

				this.outputShape = [ this.width, this.depth ];

			} else {

				console.error( "\"targetShape\" property is required for reshape layer" );

			}

		} else {

			console.error( "\"Lack config for reshape layer." );

		}

	}

} );

export { Reshape2d };