/**
 * @author syt123450 / https://github.com/syt123450
 */

import * as THREE from "three";
import { NativeLayer } from "../abstract/NativeLayer";
import { OutputMap3d } from "../../elements/OutputMap3d";
import { ColorUtils } from "../../utils/ColorUtils";
import { QueueAggregation } from "../../elements/QueueAggregation";
import { CloseButtonRatio } from "../../utils/Constant";

/**
 * OutputDetection, output layer, can be initialized by TensorSpace user.
 *
 * 2D output, shape is the same as input, can draw rectangles on it, can be used to show object detection result.
 *
 * @param config, user's configuration for OutputDetection.
 * @constructor
 */

function OutputDetection( config ) {

	// OutputDetection inherits from abstract layer "NativeLayer".

	NativeLayer.call( this, config );

	/**
	 * OutputDetection has three output dimensions: [ width, height, depth ]
	 *
	 * @type { int }
	 */

	this.width = undefined;
	this.height = undefined;
	this.depth = 3;

	/**
	 * Store outputMap handler.
	 *
	 * @type { Object }
	 */

	this.outputHandler = undefined;

	/**
	 * Store rectangle parameters drawn on it.
	 * Each rectangle has a JSON parameter, the parameter is like:
	 * {
	 * 		x: x,
	 * 		y: y,
	 * 		width: width,
	 * 		height: height,
	 * }
	 *
	 * @type { Array }
	 */

	this.rectangleList = [];

	/**
	 * Label to define whether layer need an "output value" from backend model (tfjs, keras, or tf).
	 * True means that user do not need to add value for OutputDetection value when they are preprocessing multi-output for the model.
	 *
	 * @type { boolean }
	 */

	this.autoOutputDetect = true;

	// Load user's OutputDetection configuration.

	this.loadLayerConfig( config );

	this.layerType = "OutputDetection";

}

OutputDetection.prototype = Object.assign( Object.create( NativeLayer.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer's abstract method
	 *
	 * OutputDetection overrides NativeLayer's function:
	 * init, assemble, updateValue, clear, handleClick, handleHoverIn, handleHoverOut,
	 * calcCloseButtonSize, calcCloseButtonPos, getRelativeElements, getBoundingWidth
	 *
	 * ============
	 */

	/**
	 * init() create actual THREE.Object in OutputDetection, warp them into a group, and add it to THREE.js's scene.
	 *
	 * Model passes two parameters, center and actualDepth, to OutputDetection when call init() to initialize OutputDetection.
	 *
	 * @param { JSON } center, layer's center (x, y, z) relative to model
	 * @param { double } actualDepth, layer aggregation's depth
	 */

	init: function( center, actualDepth ) {

		this.center = center;
		this.actualDepth = actualDepth;

		// Init a neuralGroup as the wrapper for all THREE.Object in OutputDetection.

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set( this.center.x, this.center.y, this.center.z );

		if ( this.isOpen ) {

			// Init output element.

			this.initOutput();

			// Init close button.

			this.initCloseButton();

		} else {

			// Init aggregation when layer is closed.

			this.initAggregationElement();

		}

		// Add the wrapper object to the actual THREE.js object.

		this.context.add( this.neuralGroup );

		// Create relative line element.

		this.addLineGroup();

	},

	/**
	 * assemble() configure layer's index in model, calculate the shape and parameters based on previous layer.
	 *
	 * @param { int } layerIndex, this layer's order in model
	 */

	assemble: function( layerIndex, layerLevel ) {

		this.layerIndex = layerIndex;
		this.layerLevel = layerLevel;

		// Automatically detect model's input shape as outputShape.

		let modelInputShape = this.model.layers[ 0 ].outputShape;

		this.width = modelInputShape[ 0 ];
		this.height = modelInputShape[ 1 ];

		this.inputShape = this.lastLayer.outputShape;

		this.outputShape = [ this.width, this.height, this.depth ];

		// Unit length is the same as last layer, use unit length to calculate actualWidth and actualHeight which are used to create three.js object.

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.lastLayer.actualWidth;
		this.actualHeight = this.lastLayer.actualHeight;

	},

	/**
	 * updateValue(), get layer value from model's input value.
	 */

	updateValue: function() {

		this.neuralValue = this.model.inputValue;

		this.updateOutputVis();

	},

	/**
	 * clear(), clear layer value and visualization.
	 */

	clear: function() {

		this.neuralValue = undefined;

		if ( this.outputHandler !== undefined ) {

			this.outputHandler.clear();

		}

	},

	/**
	 * handleClick() If clickable element in this layer is clicked, execute this handle function.
	 *
	 * @param { THREE.Object } clickedElement, clicked element picked by model's Raycaster.
	 */

	handleClick: function( clickedElement ) {

		if ( clickedElement.elementType === "aggregationElement" ) {

			// If aggregation element is clicked, open layer.

			this.openLayer();

		} else if ( clickedElement.elementType === "closeButton" ) {

			// If close button is clicked, close layer.

			this.closeLayer();

		}

	},

	/**
	 * handleHoverIn() If hoverable element in this layer picked by Raycaster, execute this handle function.
	 *
	 * @param { THREE.Object } hoveredElement, hovered element picked by model's Raycaster.
	 */

	handleHoverIn: function( hoveredElement ) {

		// If relationSystem is enabled, show relation lines.

		if ( this.relationSystem ) {

			this.lineGroupHandler.showLines( hoveredElement );

		}

		// If textSystem is enabled, show hint text, for example, show output map size.

		if ( this.textSystem ) {

			this.showText( hoveredElement );

		}

	},

	/**
	 * handleHoverOut() called by model if mouse hover out of this layer.
	 */

	handleHoverOut: function() {

		// If relationSystem is enabled, hide relation lines.

		if ( this.relationSystem ) {

			this.lineGroupHandler.hideLines();

		}

		// If textSystem is enabled, hide hint text, for example, hide output map size.

		if ( this.textSystem ) {

			this.hideText();

		}

	},

	/**
	 * loadModelConfig() load model's configuration into OutputDetection object,
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

			this.color = modelConfig.color.outputDetection;

		}

	},

	/**
	 * calcCloseButtonSize() get close button size.
	 * Called by initCloseButton function in abstract class "Layer",
	 *
	 * @return { number } size, close button size
	 */

	calcCloseButtonSize: function() {

		return this.unitLength * this.width * CloseButtonRatio;

	},

	/**                                                                                                                                                 y        y                        /**
	 * calcCloseButtonPos() get close button position.
	 * Called by initCloseButton function in abstract class "Layer",
	 *
	 * @return { JSON } position, close button position, relative to layer.
	 */

	calcCloseButtonPos: function() {

		return {

			x: - this.unitLength * this.width / 2 - 20 * this.unitLength,
			y: 0,
			z: 0

		};

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

		if ( selectedElement.elementType === "aggregationElement" || selectedElement.elementType === "outputMap3d" ) {

			// "all" means get all "displayed" elements from last layer.

			let request = {

				all: true

			};

			relativeElements = this.lastLayer.provideRelativeElements( request ).elementList;

		}

		return relativeElements;

	},

	/**
	 * getBoundingWidth(), provide bounding box's width based on layer's status.
	 *
	 * @return { number }
	 */

	getBoundingWidth: function() {

		if ( ( this.isOpen && !this.isWaitClose ) || this.isWaitOpen ) {

			return this.width * this.unitLength / 2 - this.calcCloseButtonPos().x + this.calcCloseButtonSize();

		} else {

			return this.actualWidth;

		}

	},

	/**
	 * ============
	 *
	 * Functions above override base class NativeLayer's abstract method.
	 *
	 * ============
	 */

	/**
	 * addRectangleList() add rectangles to output map.
	 * Each rectangle has a JSON parameter, the parameter is like:
	 * {
	 * 		x: x,
	 * 		y: y,
	 * 		width: width,
	 * 		height: height,
	 * }
	 *
	 * This API is exposed to TensorSpace user.
	 *
	 * @param { Array } rectList, rectangle parameters list.
	 */

	addRectangleList: function( rectList ) {

		// Store rectangle parameters data.

		this.rectangleList = rectList;

		// If layer is open, update output map's visualization.

		if ( this.isOpen ) {

			this.updateOutputVis();

		}

	},

	/**
	 * openLayer() open OutputDetection, switch layer status from "close" to "open".
	 *
	 * This API is exposed to TensorSpace user.
	 */

	openLayer: function() {

		if ( !this.isOpen ) {

			this.isOpen = true;

			this.disposeAggregationElement();
			this.initOutput();
			this.updateOutputVis();
			this.initCloseButton();

		}

	},

	/**
	 * closeLayer() close OutputDetection, switch layer status from "open" to "close".
	 *
	 * This API is exposed to TensorSpace user.
	 */

	closeLayer: function() {

		if ( this.isOpen ) {

			this.isOpen = false;

			this.disposeOutput();
			this.disposeCloseButton();
			this.initAggregationElement();

		}

	},

	loadLayerConfig: function( layerConfig ) {



	},

	/**
	 * initAggregationElement() create layer aggregation's THREE.js Object, configure it, and add it to neuralGroup in OutputDetection.
	 */

	initAggregationElement: function() {

		// QueueAggregation Object is a wrapper for aggregation, checkout "QueueAggregation.js" for more information.

		let aggregationHandler = new QueueAggregation(

			this.actualWidth,
			this.actualHeight,
			this.actualDepth,
			this.color,
			this.minOpacity

		);

		// Set layer index to aggregation, aggregation object can know which layer it has been positioned.

		aggregationHandler.setLayerIndex( this.layerIndex );

		// Store handler for aggregation for latter use.

		this.aggregationHandler = aggregationHandler;

		// Get actual THREE.js element and add it to layer wrapper Object.

		this.neuralGroup.add( this.aggregationHandler.getElement() );

	},

	/**
	 * disposeAggregationElement() remove aggregation from neuralGroup, clear its handler, and dispose its THREE.js Object in OutputDetection.
	 */

	disposeAggregationElement: function() {

		this.neuralGroup.remove( this.aggregationHandler.getElement() );
		this.aggregationHandler = undefined;

	},

	/**
	 * initOutput() create layer output map's THREE.js Object, configure it, and add it to neuralGroup in OutputDetection.
	 */

	initOutput: function() {

		// OutputMap3d Object is a wrapper for output map, checkout "MapAggregation.js" for more information.

		let outputHandler = new OutputMap3d(

			this.width,
			this.height,
			this.unitLength,
			this.actualDepth,
			{

				x: 0,
				y: 0,
				z: 0

			},
			this.color,
			this.minOpacity

		);

		// Set layer index to output map, output map object can know which layer it has been positioned.

		outputHandler.setLayerIndex( this.layerIndex );

		// Store handler for output map for latter use.

		this.outputHandler = outputHandler;

		// Get actual THREE.js element and add it to layer wrapper Object.

		this.neuralGroup.add( this.outputHandler.getElement() );

		// Update output map's visualization if layer's value has already been set.

		if ( this.neuralValue !== undefined ) {

			this.updateOutputVis();

		}

	},

	/**
	 * disposeOutput() remove output map from neuralGroup, clear its handler, and dispose its THREE.js Object in OutputDetection.
	 */

	disposeOutput: function() {

		this.neuralGroup.remove( this.outputHandler.getElement() );
		this.outputHandler = undefined;

	},

	/**
	 * updateSegregationVis() update output map's visualization.
	 */

	updateOutputVis: function() {

		if ( this.isOpen ) {

			// Get colors to render the surface of output map.

			let colors = ColorUtils.getAdjustValues( this.neuralValue, this.minOpacity );

			// handler execute update.

			this.outputHandler.updateVis( colors, this.rectangleList );

		}

	},

	/**
	 * showText() show hint text relative to given element.
	 *
	 * @param { THREE.Object } element
	 */

	showText: function(element) {

		if ( element.elementType === "outputMap3d" ) {

			this.outputHandler.showText();
			this.textElementHandler = this.outputHandler;

		}

	},

	/**
	 * hideText() hide hint text.
	 */

	hideText: function() {

		if ( this.textElementHandler !== undefined ) {

			this.textElementHandler.hideText();
			this.textElementHandler = undefined;

		}

	}

} );

export { OutputDetection };