/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer2d } from "../abstract/NativeLayer2d";
import { GlobalPoolingElement } from "../../elements/GlobalPoolingElement";

/**
 * 1D Global pooling.
 *
 * @param config, user's configuration for GlobalPooling1d layer
 * @constructor
 */

function GlobalPooling1d( config ) {

	// "GlobalPooling1d" inherits from abstract layer "NativeLayer2d".

	NativeLayer2d.call( this, config );

	/**
	 * Global pooling's width is const ( 1 ).
	 *
	 * @type { int }
	 */

	this.width = 1;

	this.layerType = "GlobalPooling1d";

}

GlobalPooling1d.prototype = Object.assign( Object.create( NativeLayer2d.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer2d's abstract method
	 *
	 * GlobalPooling1d overrides NativeLayer2d's function:
	 * assemble, loadModelConfig, getRelativeElements
	 *
	 * ============
	 */

	/**
	 * assemble() configure layer's index in model, calculate the shape and parameters based on previous layer.
	 *
	 * @param { int } layerIndex, this layer's order in model
	 */

	assemble: function( layerIndex ) {

		this.layerIndex = layerIndex;

		this.inputShape = this.lastLayer.outputShape;
		this.depth = this.inputShape[ 1 ];

		// GlobalPooling1d layer's outputShape has two dimension, that's why GlobalPooling1d layer inherits from abstract layer "NativeLayer2d".

		this.outputShape = [ 1, this.depth ];

		// Unit length is the same as last layer, use unit length to calculate actualWidth and actualHeight which are used to create three.js object.

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;

		// Calculate the elements centers for close status and open status.

		for ( let i = 0; i < this.depth; i ++ ) {

			let closeCenter = {

				x: 0,
				y: 0,
				z: 0

			};

			this.closeCenterList.push( closeCenter );

			// GlobalPooling1d's elements align to last layer.

			let openCenter = {

				x: this.lastLayer.openCenterList[ i ].x,
				y: this.lastLayer.openCenterList[ i ].y,
				z: this.lastLayer.openCenterList[ i ].z

			};

			this.openCenterList.push( openCenter );

		}

	},

	/**
	 * loadModelConfig() load model's configuration into GlobalPooling1d object,
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

			this.color = modelConfig.color.globalPooling1d;

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
	 * As global pooling has different element compared with other 2d layer,
	 * So global pooling override NativeLayer3d's "initSegregationElements" function.
	 *
	 * @param centers
	 */

	initSegregationElements: function( centers ) {

		for ( let i = 0; i < centers.length; i ++ ) {

			// GlobalPoolingElement is a wrapper for one feature map, checkout "GlobalPoolingElement.js" for more information.

			let queueHandler = new GlobalPoolingElement(

				this.actualWidth,
				centers[ i ],
				this.color,
				this.minOpacity

			);

			// Set layer index to GlobalPoolingElement, element can know which layer it has been positioned.

			queueHandler.setLayerIndex( this.layerIndex );

			// Set element index in layer.

			queueHandler.setFmIndex( i );

			// Store handler for feature map for latter use.

			this.queueHandlers.push( queueHandler );

			// Get actual THREE.js element and add it to layer wrapper Object.

			this.neuralGroup.add( queueHandler.getElement() );

		}

		// Update all GlobalPoolingElement's visualization if layer's value has already been set.

		if ( this.neuralValue !== undefined ) {

			this.updateSegregationVis();

		}

	},

	/**
	 * As global pooling has different element compared with other 2d layer,
	 * So global pooling override NativeLayer3d's "showText" function.
	 *
	 * @param element
	 */

	showText: function( element ) {

		if ( element.elementType === "globalPoolingElement" ) {

			let fmIndex = element.fmIndex;
			this.queueHandlers[ fmIndex ].showText();
			this.textElementHandler = this.queueHandlers[ fmIndex ];

		}

	}

} );

export { GlobalPooling1d };