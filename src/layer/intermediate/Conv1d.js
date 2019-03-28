/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer2d } from "../abstract/NativeLayer2d";
import { QueueCenterGenerator } from "../../utils/QueueCenterGenerator";

/**
 * 1D Convolution.
 *
 * @param config, user's configuration for Conv1d layer
 * @constructor
 */

function Conv1d( config ) {

	// "Conv1d" inherits from abstract layer "NativeLayer2d".

	NativeLayer2d.call( this, config );

	/**
	 * The depth of the layer output.
	 *
	 * @type { int }
	 */

	this.filters = undefined;

	/**
	 * The strides length of the convolution.
	 *
	 * @type { int }
	 */

	this.strides = undefined;

	/**
	 * The width of the convolution window.
	 *
	 * @type { int }
	 */

	this.kernelSize = undefined;

	/**
	 * Padding mode.
	 * "valid" or "same", default to "valid".
	 *
	 * @type { string }
	 */

	this.padding = "valid";

	/**
	 * Whether user directly define the layer shape.
	 * Set "true" if Conv1d's shape is predefined by user.
	 *
	 * @type { boolean }
	 */

	this.isShapePredefined = false;

	// Load user's Conv1d configuration.

	this.loadLayerConfig( config );

	// Init close grid line centers.

	for ( let i = 0; i < this.depth; i ++ ) {

		let center = {

			x: 0,
			y: 0,
			z: 0

		};

		this.closeCenterList.push( center );

	}

	this.layerType = "Conv1d";

}

Conv1d.prototype = Object.assign( Object.create( NativeLayer2d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer2d's abstract method
	 *
	 * Conv1d overrides NativeLayer2d's function:
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

			// Two padding mode is the same as TensorFlow

			if ( this.padding === "valid" ) {

				// ceil[ ( W - F + 1 ) / S ]

				this.width = Math.ceil( ( this.inputShape[ 0 ] - this.kernelSize + 1 ) / this.strides );

			} else if ( this.padding === "same" ) {

				// ceil( W / S )

				this.width = Math.ceil( this.inputShape[ 0 ] / this.strides );

			}

		}

		// Conv1d layer's outputShape has two dimension, that's why Conv1d layer inherits from abstract layer "NativeLayer2d".

		this.outputShape = [ this.width, this.depth ];

		// Unit length is the same as last layer, use unit length to calculate actualWidth which is used to create three.js object.

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;

		// Calculate the grid line centers for open status.

		this.openCenterList = QueueCenterGenerator.getCenterList( this.actualWidth, this.depth );

	},

	/**
	 * loadModelConfig() load model's configuration into Conv1d object,
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

			this.color = modelConfig.color.conv1d;

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

		if ( selectedElement.elementType === "aggregationElement" || selectedElement.elementType === "gridLine" ) {

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
	 * Functions above override base class NativeLayer2d's abstract method.
	 *
	 * ============
	 */

	/**
	 * loadLayerConfig() Load user's configuration into Conv1d.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for Conv1d.
	 */

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			if ( layerConfig.shape !== undefined ) {

				// Load user's predefined shape.

				this.isShapePredefined = true;
				this.width = layerConfig.shape[ 0 ];
				this.filters = layerConfig.shape[ 1 ];
				this.depth = layerConfig.shape[ 1 ];

			} else {

				// "filters" configuration is required.

				if ( layerConfig.filters !== undefined ) {

					this.filters = layerConfig.filters;
					this.depth = layerConfig.filters;

				} else {

					console.error( "\"filters\" property is required for conv1d layer." );

				}

				// Optional configuration.

				if ( layerConfig.strides !== undefined ) {

					this.strides = layerConfig.strides;

				}

				if ( layerConfig.kernelSize !== undefined ) {

					this.kernelSize = layerConfig.kernelSize;

				}

				// Load padding mode, accept two mode: "valid" and "same", support both uppercase and lowercase.

				if ( layerConfig.padding !== undefined ) {

					if ( layerConfig.padding.toLowerCase() === "valid" ) {

						this.padding = "valid";

					} else if ( layerConfig.padding.toLowerCase() === "same" ) {

						this.padding = "same";

					} else {

						console.error( "\"padding\" property do not support for " + layerConfig.padding + ", use \"valid\" or \"same\" instead." );

					}

				}

			}

		} else {

			console.error( "Lack config for conv1d layer." );

		}

	}

} );

export { Conv1d };