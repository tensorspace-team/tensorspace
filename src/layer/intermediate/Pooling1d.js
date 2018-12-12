/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer2d } from "../abstract/NativeLayer2d";

/**
 * 1D pooling.
 *
 * @param config, user's configuration for Pooling1d layer
 * @constructor
 */

function Pooling1d( config ) {

	// "Pooling1d" inherits from abstract layer "NativeLayer2d".

	NativeLayer2d.call( this, config );

	/**
	 * Size of the window to pool over.
	 *
	 * @type { int }
	 */

	this.poolSize = undefined;

	/**
	 * Period at which to sample the pooled values.
	 *
	 * @type { int }
	 */

	this.strides = undefined;

	/**
	 * Padding mode.
	 * "valid" or "same", default to "valid".
	 *
	 * @type { string }
	 */

	this.padding = "valid";

	/**
	 * Whether user directly define the layer shape.
	 * Set "true" if Pooling1d's shape is predefined by user.
	 *
	 * @type { boolean }
	 */

	this.isShapePredefined = false;

	// Load user's Pooling1d configuration.

	this.loadLayerConfig( config );

	this.layerType = "Pooling1d";

}

Pooling1d.prototype = Object.assign( Object.create( NativeLayer2d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer2d's abstract method
	 *
	 * Pooling1d overrides NativeLayer2d's function:
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

		//  If user's do not define a specific shape for layer, infer layer output shape from input shape and config.

		if ( !this.isShapePredefined ) {

			if ( this.padding === "valid" ) {

				// ceil[ ( W - F + 1 ) / S ]

				this.width = Math.ceil( ( this.inputShape[ 0 ] - this.poolSize + 1 ) / this.strides );

			} else if ( this.padding === "same" ) {

				// ceil( W / S )

				this.width = Math.ceil( this.inputShape[ 0 ] / this.strides );

			}

		}

		this.depth = this.inputShape[ 1 ];

		// Pooling1d layer's outputShape has two dimension, that's why Pooling1d layer inherits from abstract layer "NativeLayer2d".

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

			// Pooling1d's grid lines align to last layer.

			let openCenter = {

				x: this.lastLayer.openCenterList[ i ].x,
				y: this.lastLayer.openCenterList[ i ].y,
				z: this.lastLayer.openCenterList[ i ].z

			};

			this.openCenterList.push( openCenter );

		}

	},

	/**
	 * loadModelConfig() load model's configuration into Pooling1d object,
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

			this.color = modelConfig.color.pooling1d;

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
	 * loadLayerConfig() Load user's configuration into Pooling1d.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for Pooling1d.
	 */

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			if ( layerConfig.shape !== undefined ) {

				// Load user's predefined shape.

				this.isShapePredefined = true;
				this.width = layerConfig.shape[ 0 ];
				this.depth = layerConfig.shape[ 1 ];

			} else {

				// "poolSize" configuration is required.

				if ( layerConfig.poolSize !== undefined ) {

					this.poolSize = layerConfig.poolSize;

				} else {

					console.error( "\"poolSize\" property is required for pooling1d layer." );

				}

				// "strides" configuration is required.

				if ( layerConfig.strides !== undefined ) {

					this.strides = layerConfig.strides;

				} else {

					console.error( "\"strides\" property is required for pooling1d layer." );

				}

				// Load padding mode, accept two mode: "valid" and "same", support both uppercase and lowercase.

				if ( layerConfig.padding !== undefined ) {

					if ( layerConfig.padding === "valid" ) {

						this.padding = "valid";

					} else if ( layerConfig.padding === "same" ) {

						this.padding = "same";

					} else {

						console.error( "\"padding\" property do not support for " + layerConfig.padding + ", use \"valid\" or \"same\" instead." );

					}

				}

			}

		} else {

			console.error( "Lack config for Pooling1d layer." );

		}

	}

} );

export { Pooling1d };