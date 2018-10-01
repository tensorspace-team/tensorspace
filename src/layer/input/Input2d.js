/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer } from '../abstract/NativeLayer';
import { FeatureMap } from "../../elements/FeatureMap";
import { ColorUtils } from "../../utils/ColorUtils";
import { ModelInitWidth } from "../../utils/Constant";

/**
 * Input2d, input layer, can be initialized by TensorSpace user.
 * Layer for gray scale image.
 *
 * @param config, user's configuration for Input2d.
 * @constructor
 */

function Input2d( config ) {

	// Input2d inherits from abstract layer "NativeLayer".

	NativeLayer.call( this, config );

	/**
	 * Input2d has two output dimensions: [ width, height ].
	 *
 	 * @type { int }
	 */

	this.width = undefined;
	this.height = undefined;

	/**
	 * This attribute not for output, for latter layer,
	 * for example, padding2d.
	 *
	 * @type { int }
	 */
	this.depth = 1;

	// Load user's Input2d configuration.

	this.loadLayerConfig( config );

	/**
	 * As Input2d is the first layer model, actualWidth is defined as a const.
	 * Use actualWidth to calculate actualHeight.
	 *
	 * @type { double }
	 */

	this.actualWidth = ModelInitWidth;
	this.actualHeight = ModelInitWidth / this.width * this.height;

	/**
	 * Calculate unitLength for latter layers.
	 *
	 * @type { double }
	 */

	this.unitLength = this.actualWidth / this.width;

	/**
	 * Set this attribute for latter layer,
	 * for example, padding2d.
	 *
	 * @type { Array }
	 */

	this.openFmCenters = [ {

		x: 0,
		y: 0,
		z: 0

	} ];

	/**
	 * Label to define whether layer need an "output value" from backend model (tfjs, keras, or tf).
	 * False means that user need to add value for Input2d when they are preprocessing multi-output for the model.
	 *
	 * @type { boolean }
	 */

	this.autoOutputDetect = false;

	this.layerDimension = 2;

	this.layerType = "Input2d";

}

Input2d.prototype = Object.assign( Object.create( NativeLayer.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer's abstract method
	 *
	 * Input2d overrides NativeLayer's function:
	 * init, assemble, updateValue, clear, handleHoverIn, handleHoverOut, loadModelConfig, provideRelativeElements
	 *
	 * ============
	 */

	/**
	 * init() create actual THREE.Object in Input2d, warp them into a group, and add it to THREE.js's scene.
	 *
	 * Model passes two parameters, center and actualDepth, to Input2d when call init() to initialize Input2d.
	 *
	 * @param { JSON } center, layer's center (x, y, z) relative to model
	 * @param { double } actualDepth, layer aggregation's depth
	 */

	init: function( center, actualDepth) {

		this.center = center;
		this.actualDepth = actualDepth;

		// Init a neuralGroup as the wrapper for all THREE.Object in Input2d.

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set( this.center.x, this.center.y, this.center.z );

		// Init grey scale map.

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

		// If textSystem is enabled, show hint text, for example, show map size.

		if ( this.textSystem ) {

			this.showText( hoveredElement );

		}

	},

	/**
	 * handleHoverOut() called by model if mouse hover out of this layer.
	 */

	handleHoverOut: function() {

		// If textSystem is enabled, hide hint text, for example, hide map size.

		if ( this.textSystem ) {

			this.hideText();

		}

	},

	/**
	 * loadModelConfig() load model's configuration into Input2d object,
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

			this.color = modelConfig.color.input2d;

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
	 * ============
	 *
	 * Functions above override base class NativeLayer's abstract method.
	 *
	 * ============
	 */

	/**
	 * loadLayerConfig() Load user's configuration into Input2d.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for Input3d.
	 */

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			// Load input shape from user's configuration.

			if ( layerConfig.shape !== undefined ) {

				this.width = layerConfig.shape[ 0 ];
				this.height = layerConfig.shape[ 1 ];
				this.outputShape = layerConfig.shape;

			} else {

				console.error( "\"shape\" property is required for Input2d layer" );

			}

		} else {

			console.error( "Lack config for Input2d layer." );

		}

	},

	/**
	 * initAggregationElement() create layer grey map's THREE.js Object, configure it, and add it to neuralGroup in Input3d.
	 */

	initAggregationElement: function() {

		// FeatureMap Object is a wrapper for grey map, checkout "FeatureMap.js" for more information.

		let aggregationHandler = new FeatureMap(

			this.width,
			this.height,
			this.unitLength,
			{

				x: 0,
				y: 0,
				z: 0

			},
			this.color,
			this.minOpacity

		);

		// Set layer index to aggregation, grey map object can know which layer it has been positioned.

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

		if ( element.elementType === "featureMap" ) {

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

export { Input2d };