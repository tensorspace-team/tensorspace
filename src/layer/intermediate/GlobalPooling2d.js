/**
 * @author syt123450 / https://github.com/syt123450
 */

import { GlobalPoolingElement } from "../../elements/GlobalPoolingElement";
import { NativeLayer3d } from "../abstract/NativeLayer3d";

/**
 * 2D Global pooling.
 *
 * @param config, user's configuration for GlobalPooling2d layer
 * @constructor
 */

function GlobalPooling2d( config ) {

	// "GlobalPooling2d" inherits from abstract layer "NativeLayer3d".

	NativeLayer3d.call( this, config );

	/**
	 * Global pooling's width and height is const ( 1 ).
	 *
	 * @type { int }
	 */

	this.width = 1;
	this.height = 1;

	this.layerType = "GlobalPooling2d";

}

GlobalPooling2d.prototype = Object.assign( Object.create( NativeLayer3d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer3d's abstract method
	 *
	 * GlobalPooling2d overrides NativeLayer3d's function:
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

		// If user's do not define a specific shape for layer, infer layer output shape from input shape and config.

		if ( !this.isShapePredefined ) {

			this.depth = this.lastLayer.depth;

		}

		this.outputShape = [ this.depth ];

		// Unit length is the same as last layer, use unit length to calculate actualWidth and actualHeight which are used to create three.js object.

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;
		this.actualHeight = this.height * this.unitLength;

		// Calculate the elements centers for close status and open status.

		for ( let i = 0; i < this.depth; i ++ ) {

			let center = {

				x: 0,
				y: 0,
				z: 0

			};

			this.closeFmCenters.push( center );

			// GlobalPooling2d's elements align to last layer.

			let fmCenter = {

				x: this.lastLayer.openFmCenters[ i ].x,
				y: this.lastLayer.openFmCenters[ i ].y,
				z: this.lastLayer.openFmCenters[ i ].z

			};

			this.openFmCenters.push( fmCenter );

		}

	},

	/**
	 * loadModelConfig() load model's configuration into GlobalPooling2d object,
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

			this.color = modelConfig.color.globalPooling2d;

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

		} else if ( selectedElement.elementType === "globalPoolingElement" ) {

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
	 * As global pooling has different element compared with other 3d layer,
	 * So global pooling override NativeLayer3d's "initSegregationElements" function.
	 *
	 * @param centers
	 */

	initSegregationElements: function( centers ) {

		for ( let i = 0; i < this.depth; i ++ ) {

			// GlobalPoolingElement is a wrapper for one feature map, checkout "GlobalPoolingElement.js" for more information.

			let segregationHandler = new GlobalPoolingElement(

				this.actualWidth,
				centers[ i ],
				this.color,
				this.minOpacity

			);

			// Set layer index to GlobalPoolingElement, element can know which layer it has been positioned.

			segregationHandler.setLayerIndex( this.layerIndex );

			// Set element index in layer.

			segregationHandler.setFmIndex( i );

			// Store handler for feature map for latter use.

			this.segregationHandlers.push( segregationHandler );

			// Get actual THREE.js element and add it to layer wrapper Object.

			this.neuralGroup.add( segregationHandler.getElement() );

		}

		// Update all GlobalPoolingElement's visualization if layer's value has already been set.

		if ( this.neuralValue !== undefined ) {

			this.updateSegregationVis();

		}

	},

	/**
	 * As global pooling has different element compared with other 3d layer,
	 * So global pooling override NativeLayer3d's "showText" function.
	 *
	 * @param element
	 */

	showText: function( element ) {

		if ( element.elementType === "globalPoolingElement" ) {

			let fmIndex = element.fmIndex;
			this.segregationHandlers[ fmIndex ].showText();
			this.textElementHandler = this.segregationHandlers[ fmIndex ];

		}

	},

	/**
	 * loadLayerConfig() Load user's configuration into GlobalPooling2d.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for GlobalPooling2d.
	 */

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			if ( layerConfig.shape !== undefined ) {

				// Load user's predefined shape.

				this.isShapePredefined = true;
				this.depth = layerConfig.shape[ 0 ];

			}

		}

	}

} );

export { GlobalPooling2d }