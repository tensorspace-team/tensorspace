/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer } from "../abstract/NativeLayer";
import { FmCenterGenerator } from "../../utils/FmCenterGenerator";
import { InputMap3d } from "../../elements/InputMap3d";
import { ChannelMap } from "../../elements/ChannelMap";
import { ColorUtils } from "../../utils/ColorUtils";
import { RGBTweenFactory } from "../../animation/RGBChannelTween";
import { ModelInitWidth } from "../../utils/Constant";
import { CloseButtonRatio } from "../../utils/Constant";

/**
 * RGBInput, input layer, can be initialized by TensorSpace user.
 * Layer for RGB image.
 * RGB image has width and height, sometimes, we consider it a 2D input,
 * however, in TensorSpace when we separate RGB image into R, G, B channel,
 * we can find that the it actual has the third dimension depth = 3.
 *
 * @param config, user's configuration for RGBInput.
 * @constructor
 */

function RGBInput( config ) {

	// RGBInput inherits from abstract layer "NativeLayer".

	NativeLayer.call( this, config );

	/**
	 * RGBInput has three output dimensions: [ width, height, depth ].
	 *
	 * @type { int }
	 */

	this.width = undefined;
	this.height = undefined;
	this.depth = 3;

	// Load user's RGBInput configuration.

	this.loadLayerConfig( config );

	/**
	 * As RGBInput is the first layer model, actualWidth is defined as a const.
	 * Use actualWidth to calculate actualHeight.
	 *
	 * @type { double }
	 */

	this.actualWidth = ModelInitWidth;
	this.actualHeight = this.actualWidth / this.width * this.height;

	/**
	 * Calculate unitLength for latter layers.
	 *
	 * @type { double }
	 */

	this.unitLength =  this.actualWidth / this.width;


	/**
	 * Channel maps's centers when layer is totally open.
	 *
	 * @type { Array }
	 */
	this.openFmCenters = FmCenterGenerator.getFmCenters( "line", 3, this.actualWidth, this.actualHeight );

	/**
	 * Channel maps' centers when layer is closed.
	 *
	 * @type { Array }
	 */

	this.closeFmCenters = [];

	for ( let i = 0; i < 3; i ++ ) {

		this.closeFmCenters.push( {

			x: 0,
			y: 0,
			z: 0

		} );

	}

	// Predefined position for channel map when separate from close position.

	this.separateTopPos = {

		x: 0,
		y: 20,
		z: 0

	};

	this.separateBottomPos = {

		x: 0,
		y: -20,
		z: 0

	};

	/**
	 * Channel map's handlers list.
	 *
	 * @type { Array }
	 */

	this.segregationHandlers = [];

	/**
	 * Label to define whether layer need an "output value" from backend model (tfjs, keras, or tf).
	 * False means that user need to add value for RGBInput when they are preprocessing multi-output for the model.
	 *
	 * @type { boolean }
	 */

	this.autoOutputDetect = false;

	this.layerDimension = 3;

	this.layerType = "RGBInput";

}

RGBInput.prototype = Object.assign( Object.create( NativeLayer.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer's abstract method
	 *
	 * RGBInput overrides NativeLayer's function:
	 * init, assemble, updateValue, clear, handleClick, handleHoverIn, handleHoverOut, loadModelConfig,
	 * calcCloseButtonSize, calcCloseButtonPos, provideRelativeElements, getBoundingWidth
	 *
	 * ============
	 */

	/**
	 * init() create actual THREE.Object in RGBInput, warp them into a group, and add it to THREE.js's scene.
	 *
	 * Model passes two parameters, center and actualDepth, to RGBInput when call init() to initialize RGBInput.
	 *
	 * @param { JSON } center, layer's center (x, y, z) relative to model
	 * @param { double } actualDepth, layer aggregation's depth
	 */

	init: function( center, actualDepth ) {

		this.center = center;
		this.actualDepth = actualDepth;

		// Init a neuralGroup as the wrapper for all THREE.Object in RGBInput.

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set( this.center.x, this.center.y, this.center.z );

		// Init RGB map element.

		this.initAggregationElement();

		// Add the wrapper object to the actual THREE.js scene.

		this.scene.add( this.neuralGroup );

	},

	/**
	 * assemble() configure layer's index in model.
	 *
	 * @param { int } layerIndex, this layer's order in model
	 */

	assemble: function( layerIndex, layerLevel ) {

		this.layerIndex = layerIndex;
		this.layerLevel = layerLevel;

	},

	/**
	 * updateValue() accept layer output value from model, update layer visualization if required.
	 *
	 * Model passes layer's output value to layer through updateValue method.
	 *
	 * @param { double[] } value, neural output value.
	 */

	updateValue: function( value ) {

		// Store layer output value in "neuralValue" attribute, this attribute can be get by TensorSpace user.

		this.neuralValue = value;

		if ( this.isOpen ) {

			// If layer is open, update Channel maps' visualization.

			this.updateSegregationVis();

		} else {

			// If layer is close, update RGB map's visualization.

			this.updateAggregationVis();

		}

	},

	/**
	 * clear() clear data and visualization in layer.
	 */

	clear: function() {

		if ( this.neuralValue !== undefined ) {

			// Use handlers to clear visualization.

			if ( this.isOpen ) {

				for ( let i = 0; i < this.segregationHandlers.length; i ++ ) {

					this.segregationHandlers[ i ].clear();

				}

			} else {

				this.aggregationHandler.clear();

			}

			// Clear layer data.

			this.neuralValue = undefined;

		}

	},

	/**
	 * handleClick() If clickable element in this layer is clicked, execute this handle function.
	 *
	 * @param { THREE.Object } clickedElement, clicked element picked by model's Raycaster.
	 */

	handleClick: function( clickedElement ) {

		if ( clickedElement.elementType === "RGBInputElement" ) {

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
	 * loadModelConfig() load model's configuration into RGBInput object,
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

			this.color = modelConfig.color.RGBInput;

		}

	},

	/**
	 * calcCloseButtonSize() get close button size.
	 * Called by initCloseButton function in abstract class "Layer",
	 *
	 * @return { number } size, close button size
	 */

	calcCloseButtonSize: function() {

		return 3 * this.actualHeight * CloseButtonRatio;

	},

	/**                                                                                                                                                 y        y                        /**
	 * calcCloseButtonPos() get close button position.
	 * Called by initCloseButton function in abstract class "Layer",
	 *
	 * @return { JSON } position, close button position, relative to layer.
	 */

	calcCloseButtonPos: function() {

		return {

			x: this.openFmCenters[ 0 ].x - this.actualWidth / 2 - 30,
			y: 0,
			z: 0

		};

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

		if ( request.all !== undefined && request.all ) {

			// When "all" attribute in request is true, return all elements displayed in this layer.

			if ( this.isOpen ) {

				for ( let i = 0; i < this.segregationHandlers.length; i ++ ) {

					relativeElements.push( this.segregationHandlers[ i ].getElement() );

				}

			} else {

				relativeElements.push( this.aggregationHandler.getElement() );

			}

		} else {

			if ( request.index !== undefined ) {

				if ( this.isOpen ) {

					// If index attribute is set in request, and layer is open, return Channel map element which has the same index.

					relativeElements.push( this.segregationHandlers[ request.index ].getElement() );

				} else {

					// If layer is closed, return aggregation element.

					relativeElements.push( this.aggregationHandler.getElement() );

				}

			}

		}

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

		if ( ( this.isOpen && !this.isWaitClose ) || this.isWaitOpen ) {

			let maxX = this.openFmCenters[ 0 ].x;

			for ( let i = 0; i < this.openFmCenters.length; i ++ ) {

				maxX = this.openFmCenters[ i ].x > maxX ? this.openFmCenters[ i ].x : maxX;

			}

			return maxX - this.calcCloseButtonPos().x + this.calcCloseButtonSize() + this.actualWidth;

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
	 * openLayer() open RGBInput, switch layer status from "close" to "open".
	 *
	 * This API is exposed to TensorSpace user.
	 */

	openLayer: function() {

		if ( !this.isOpen ) {

			// RGBTweenFactory handles actual open animation, checkout "RGBChannelTween.js" for more information.

			RGBTweenFactory.separate( this );

		}

	},

	/**
	 * closeLayer() close Output1d, switch layer status from "open" to "close".
	 *
	 * This API is exposed to TensorSpace user.
	 */

	closeLayer: function() {

		if ( this.isOpen ) {

			// RGBTweenFactory handles actual close animation, checkout "RGBChannelTween.js" for more information.

			RGBTweenFactory.aggregate( this );

		}

	},

	/**
	 * loadLayerConfig() Load user's configuration into RGBInput.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for RGBInput.
	 */

	loadLayerConfig: function( layerConfig ) {

		// Load input shape from user's configuration.

		if ( layerConfig !== undefined ) {

			this.inputShape = layerConfig.shape;
			this.width = layerConfig.shape[ 0 ];
			this.height = layerConfig.shape[ 1 ];
			this.outputShape = [ this.width, this.height, this.depth ];

		} else {

			console.error( "\"shape\" property is require for RGBInput layer." );

		}

	},

	/**
	 * initAggregationElement() create layer aggregation's THREE.js Object, configure it, and add it to neuralGroup in RGBInput.
	 */

	initAggregationElement: function() {

		// InputMap3d Object is a wrapper for RGB map element, checkout "InputMap3d.js" for more information.

		let aggregationHandler = new InputMap3d(

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

		// Set layer index to aggregation, RGB map object can know which layer it has been positioned.

		aggregationHandler.setLayerIndex( this.layerIndex );

		// Store handler for aggregation for latter use.

		this.aggregationHandler = aggregationHandler;

		// Get actual THREE.js element and add it to layer wrapper Object.

		this.neuralGroup.add( this.aggregationHandler.getElement() );

		// Update RGB map's visualization if layer's value has already been set.

		if ( this.neuralValue !== undefined ) {

			this.updateAggregationVis();

		}

	},

	/**
	 * disposeAggregationElement() remove aggregation from neuralGroup, clear its handler, and dispose its THREE.js Object in RGBInput.
	 */

	disposeAggregationElement: function() {

		this.neuralGroup.remove( this.aggregationHandler.getElement() );
		this.aggregationHandler = undefined;

	},

	/**
	 * initSegregationElements() create Channel maps' THREE.js Object, configure them, and add them to neuralGroup in RGBInput.
	 */

	initSegregationElements: function() {

		// Init r, g, b channel elements.

		let rChannel = new ChannelMap(

			this.width,
			this.height,
			this.unitLength,
			this.actualDepth,
			this.closeFmCenters[ 0 ],
			this.color,
			"R",
			this.minOpacity

		);

		let gChannel = new ChannelMap(

			this.width,
			this.height,
			this.unitLength,
			this.actualDepth,
			this.closeFmCenters[ 1 ],
			this.color,
			"G",
			this.minOpacity

		);

		let bChannel = new ChannelMap(

			this.width,
			this.height,
			this.unitLength,
			this.actualDepth,
			this.closeFmCenters[ 2 ],
			this.color,
			"B",
			this.minOpacity

		);

		// Set layer index to channel handler, channel map object can know which layer it has been positioned.

		rChannel.setLayerIndex( this.layerIndex );

		// Set channelIndex index.

		rChannel.setFmIndex( 0 );
		gChannel.setLayerIndex( this.layerIndex );
		gChannel.setFmIndex( 1 );
		bChannel.setLayerIndex( this.layerIndex );
		bChannel.setFmIndex( 2 );

		// Store handler for feature map for latter use.

		this.segregationHandlers.push( rChannel );
		this.segregationHandlers.push( gChannel );
		this.segregationHandlers.push( bChannel );

		// Get actual THREE.js element and add it to layer wrapper Object.

		this.neuralGroup.add( rChannel.getElement() );
		this.neuralGroup.add( gChannel.getElement() );
		this.neuralGroup.add( bChannel.getElement() );

		// Update all channel maps' visualization if layer's value has already been set.

		if ( this.neuralValue !== undefined ) {

			this.updateSegregationVis();

		}

	},

	/**
	 * disposeSegregationElements() remove feature maps from neuralGroup, clear their handlers, and dispose their THREE.js Object in RGBInput.
	 */

	disposeSegregationElements: function() {

		for ( let i = 0; i < this.segregationHandlers.length; i ++ ) {

			// Remove channel maps' THREE.js object from neuralGroup.

			this.neuralGroup.remove( this.segregationHandlers[ i ].getElement() );

		}

		// Clear handlers, actual objects will automatically be GC.

		this.segregationHandlers = [];

	},

	/**
	 * updateAggregationVis() update RGB map's aggregation's visualization.
	 */

	updateAggregationVis: function() {

		// Get colors to render the surface of aggregation.

		let colors = ColorUtils.getAdjustValues( this.neuralValue, this.minOpacity );

		// aggregationHandler execute update visualization process.

		this.aggregationHandler.updateVis( colors );

	},

	/**
	 * updateSegregationVis() update channel maps' visualization.
	 */

	updateSegregationVis: function() {

		let colors = ColorUtils.getAdjustValues( this.neuralValue, this.minOpacity );

		let rVal = [];
		let gVal = [];
		let bVal = [];

		for ( let i = 0; i < colors.length; i ++ ) {

			if ( i % 3 === 0 ) {

				rVal.push( colors[ i ] );

			} else if ( i % 3 === 1 ) {

				gVal.push( colors[ i ] );

			} else {

				bVal.push( colors[ i ] );

			}

		}

		this.segregationHandlers[ 0 ].updateVis( rVal );
		this.segregationHandlers[ 1 ].updateVis( gVal );
		this.segregationHandlers[ 2 ].updateVis( bVal );

	},

	/**
	 * showText() show hint text relative to given element.
	 *
	 * @param { THREE.Object } element
	 */

	showText: function( element ) {

		if ( element.elementType === "channelMap" ) {

			let fmIndex = element.fmIndex;

			this.segregationHandlers[ fmIndex ].showText();
			this.textElementHandler = this.segregationHandlers[ fmIndex ];

		} else if ( element.elementType === "RGBInputElement" ) {

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

export { RGBInput };