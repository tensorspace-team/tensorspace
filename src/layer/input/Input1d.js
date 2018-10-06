/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer } from "../abstract/NativeLayer";
import { ModelInitWidth } from "../../utils/Constant";
import { ColorUtils } from "../../utils/ColorUtils";
import { NeuralQueue } from "../../elements/NeuralQueue";

/**
 * Input1d, input layer, can be initialized by TensorSpace user.
 * Layer for linear input.
 *
 * @param config, user's configuration for Input1d.
 * @constructor
 */

function Input1d( config ) {

	// Input1d inherits from abstract layer "NativeLayer".

	NativeLayer.call( this, config );

	/**
	 * Input1d has one output dimensions: [ width ].
	 *
	 * @type { int }
	 */

	this.width = undefined;
	this.outputShape = undefined;

	/**
	 * This attribute not for output, for latter layer,
	 * for example, padding1d.
	 *
	 * @type { int }
	 */

	this.depth = 1;

	// Load user's Input1d configuration.

	this.loadLayerConfig( config );

	/**
	 * As Input1d is the first layer model, actualWidth is defined as a const.
	 *
	 * @type { double }
	 */

	this.actualWidth = ModelInitWidth;

	/**
	 * Calculate unitLength for latter layers.
	 *
	 * @type { double }
	 */

	this.unitLength = this.actualWidth / this.width;

	/**
	 * Set this attribute for latter layer,
	 * for example, padding1d.
	 *
	 * @type { Array }
	 */

	this.openCenterList = [ {

		x: 0,
		y: 0,
		z: 0

	} ];

	/**
	 * Label to define whether layer need an "output value" from backend model (tfjs, keras, or tf).
	 * False means that user need to add value for Input1d when they are preprocessing multi-output for the model.
	 *
	 * @type { boolean }
	 */

	this.autoOutputDetect = false;

	this.layerDimension = 1;

	this.layerType = "Input1d";

}

Input1d.prototype = Object.assign( Object.create( NativeLayer.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer's abstract method
	 *
	 * Input1d overrides NativeLayer's function:
	 * init, assemble, updateValue, clear, handleHoverIn, handleHoverOut, loadModelConfig, getRelativeElements, getBoundingWidth
	 *
	 * ============
	 */

	/**
	 * init() create actual THREE.Object in Input1d, warp them into a group, and add it to THREE.js's scene.
	 *
	 * Model passes two parameters, center and actualDepth, to Input1d when call init() to initialize Input1d.
	 *
	 * @param { JSON } center, layer's center (x, y, z) relative to model
	 * @param { double } actualDepth, layer aggregation's depth
	 */

	init: function( center, actualDepth ) {

		this.center = center;
		this.actualDepth = actualDepth;

		// Init a neuralGroup as the wrapper for all THREE.Object in Input1d.

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set( this.center.x, this.center.y, this.center.z );

		// Init linear input element.

		this.initAggregationElement();

		// Add the wrapper object to the actual THREE.js scene.

		this.scene.add( this.neuralGroup );

	},

	/**
	 * assemble() configure layer's index in model.
	 *
	 * @param { int } layerIndex, this layer's order in model
	 */

	assemble: function( layerIndex ) {

		this.layerIndex = layerIndex;

	},

	/**
	 * updateValue() accept layer output value from model, update layer visualization if required.
	 *
	 * Model passes layer's output value to layer through updateValue method.
	 *
	 * @param { double[] } value, neural output value.
	 */

	updateValue: function( value ) {

		this.neuralValue = value;

		// Get colors to render the surface of aggregation.

		let colors = ColorUtils.getAdjustValues( value, this.minOpacity );

		// aggregationHandler execute update visualization process.

		this.aggregationHandler.updateVis( colors );

	},

	/**
	 * clear() clear data and visualization in layer.
	 */

	clear: function() {

		if ( this.neuralValue !== undefined ) {

			// Use handlers to clear visualization.

			this.aggregationHandler.clear();

			// Clear layer data.

			this.neuralValue = undefined;

		}

	},

	/**
	 * handleHoverIn() If hoverable element in this layer picked by Raycaster, execute this handle function.
	 *
	 * @param { THREE.Object } hoveredElement, hovered element picked by model's Raycaster.
	 */

	handleHoverIn: function( hoveredElement ) {

		// If textSystem is enabled, show hint text, for example, show input length.

		if ( this.textSystem ) {

			this.showText( hoveredElement );

		}

	},

	/**
	 * handleHoverOut() called by model if mouse hover out of this layer.
	 */

	handleHoverOut: function() {

		// If textSystem is enabled, hide hint text, for example, hide input length.

		if ( this.textSystem ) {

			this.hideText();

		}

	},

	/**
	 * loadModelConfig() load model's configuration into Input1d object,
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

			this.color = modelConfig.color.input1d;

		}

	},

	/**
	 * provideRelativeElements() return relative elements.
	 *
	 * Use bridge design patten:
	 * 1. "getRelativeElements" send request to previous layer for relative elements;
	 * 2. Previous layer's "provideRelativeElements" receives request, return relative elements.
	 *
	 * @param { JSON } request, parameter configured by request layer
	 * @return { Object } { isOpen: boolean, elementList: elements }
	 */

	provideRelativeElements: function( request ) {

		let relativeElements = [];

		// Return aggregation element as relative element.

		relativeElements.push( this.aggregationHandler.getElement() );

		return {

			isOpen: this.isOpen,
			elementList: relativeElements

		};

	},

	/**
	 * getBoundingWidth(), provide bounding box's width based on layer's status.
	 *
	 * @return { number }
	 */

	getBoundingWidth: function() {

		return this.actualWidth;

	},

	/**
	 * ============
	 *
	 * Functions above override base class NativeLayer's abstract method.
	 *
	 * ============
	 */

	/**
	 * loadLayerConfig() Load user's configuration into Input1d.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for Input3d.
	 */

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			// Load input shape from user's configuration.

			if ( layerConfig.shape !== undefined ) {

				this.width = layerConfig.shape[ 0 ];
				this.outputShape = [ this.width ];

			} else {

				console.error( "\"shape\" is required for input1d layer." );

			}

		} else {

			console.error( "Lack config for Input1d layer." );

		}

	},

	/**
	 * initAggregationElement() create layer linear input's THREE.js Object, configure it, and add it to neuralGroup in Input1d.
	 */

	initAggregationElement: function() {

		// NeuralQueue Object is a wrapper for linear input element, checkout "NeuralQueue.js" for more information.

		let aggregationHandler = new NeuralQueue(

			this.width,
			this.unitLength,
			this.color,
			this.minOpacity

		);

		// Set layer index to aggregation, linear input element can know which layer it has been positioned.

		aggregationHandler.setLayerIndex( this.layerIndex );

		// Store handler for aggregation for latter use.

		this.aggregationHandler = aggregationHandler;

		// Get actual THREE.js element and add it to layer wrapper Object.

		this.neuralGroup.add( aggregationHandler.getElement() );

	},

	/**
	 * showText() show hint text relative to given element.
	 *
	 * @param { THREE.Object } element
	 */

	showText: function( element ) {

		if ( element.elementType === "featureLine" ) {

			this.aggregationHandler.showText();
			this.textElementHandler = this.aggregationHandler;

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

export { Input1d };