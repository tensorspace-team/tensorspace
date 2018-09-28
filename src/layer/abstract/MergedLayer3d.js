/**
 * @author syt123450 / https://github.com/syt123450
 */

import { FmCenterGenerator } from "../../utils/FmCenterGenerator";
import { MergedLayer } from "./MergedLayer";
import { ChannelDataGenerator } from "../../utils/ChannelDataGenerator";
import { ColorUtils } from "../../utils/ColorUtils";
import { MapTransitionFactory } from "../../animation/MapTransitionTween";
import { CloseButtonRatio } from "../../utils/Constant";
import { MergedAggregation } from "../../elements/MergedAggregation";
import { MergedFeatureMap } from "../../elements/MergedFeatureMap";
import { StrategyFactory } from "../../merge/factory/StrategyFactory";

/**
 * MergedLayer3d, can not be initialized by TensorSpace user, initialized by merge function.
 * MergedLayer3d is actually a context in strategy design pattern.
 * Different merge functions has different concrete strategies for mergedLayer3d.
 * Can add Add3d, Average3d, Concatenate3d, Dot3d, Maximum3d, Subtract3d strategy to MergedLayer3d.
 * Checkout "merge" folder for more information.
 *
 * @param config, user's configuration for merge function
 * @constructor
 */

function MergedLayer3d( config ) {

	// NativeLayer3d inherits from abstract layer "MergedLayer"

	MergedLayer.call( this, config );

	/**
	 * mergedLayer3d has three output dimensions: [ width, height, depth ].
	 *
	 * @type { int }
	 */

	this.width = undefined;
	this.height = undefined;
	this.depth = undefined;

	/**
	 * Feature map's handlers list.
	 *
	 * @type { Array }
	 */

	this.segregationHandlers = [];

	/**
	 * Feature maps's centers when layer is totally open.
	 *
	 * @type { Array }
	 */

	this.openFmCenters = [];

	/**
	 * Feature maps' centers when layer is closed.
	 *
	 * @type { Array }
	 */

	this.closeFmCenters = [];

	/**
	 * Elements participle in merge function.
	 *
	 * @type { Array }
	 */

	this.mergedElements = [];

	/**
	 * Concrete strategy in runtime.
	 * Initialized in MergedLayer3d's initStrategy period.
	 * Applicable strategy: Add3d, Average3d, Concatenate3d, Dot3d, Maximum3d, Multiply3d, Subtract3d.
	 *
	 * @type { Object }, Strategy3d
	 */

	this.operationStrategy = undefined;

	// Init concrete strategy based on config.

	this.initStrategy( config );

	this.layerDimension = 3;

	this.layerType = "mergedLayer3d";

}

MergedLayer3d.prototype = Object.assign( Object.create( MergedLayer.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class MergedLayer's abstract method
	 *
	 * MergedLayer3d overrides MergedLayer's function:
	 * init, assemble, updateValue, clear, handleClick, handleHoverIn, handleHoverOut, loadModelConfig, getRelativeElements,
	 * provideRelativeElements, calcCloseButtonSize, calcCloseButtonPos
	 *
	 * ============
	 */

	/**
	 * init() create actual THREE.Object in MergedLayer3d, warp them into a group, and add it to THREE.js's scene.
	 *
	 * Model passes two parameters, center and actualDepth, to MergedLayer3d when call init() to initialize MergedLayer3d.
	 *
	 * @param { JSON } center, layer's center (x, y, z) relative to model
	 * @param { double } actualDepth, layer aggregation's depth
	 */

	init: function( center, actualDepth ) {

		this.center = center;
		this.actualDepth = actualDepth;

		// Init a neuralGroup as the wrapper for all THREE.Object in MergedLayer3d.

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set( this.center.x, this.center.y, this.center.z );

		// depth === 1 means that there is only one feature map in MergedLayer3d, no need for aggregation, open layer, or close layer.

		if ( this.depth === 1 ) {

			// Open layer and init one feature map (depth === 1) without initializing close button.

			this.isOpen = true;
			this.initSegregationElements( this.openFmCenters );

		} else {

			if ( this.isOpen ) {

				// Init all feature maps and display them to totally opened positions.

				this.initSegregationElements( this.openFmCenters );

				// Init close button.

				this.initCloseButton();

			} else {

				// Init aggregation when layer is closed.

				this.initAggregationElement();

			}

		}

		// Add the wrapper object to the actual THREE.js scene.

		this.scene.add( this.neuralGroup );

		// Create relative line element.

		this.addLineGroup();

	},

	/**
	 * assemble() configure layer's index in model, calculate the shape and parameters based on previous layer.
	 *
	 * @param { int } layerIndex, this layer's order in model
	 */

	assemble: function( layerIndex ) {

		this.layerIndex = layerIndex;

		// Set layer index to strategy, operationStrategy can know which layer it has been positioned.

		this.operationStrategy.setLayerIndex( this.layerIndex );

		// Validate whether user's input merged elements can be merged in this kind of merge operation.

		if( !this.operationStrategy.validate() ) {

			console.error( "Input shape is not valid for " + this.operator + " merge function." );

		}

		// Get output shape after merge operation.

		this.outputShape = this.operationStrategy.getOutputShape();
		this.inputShape = this.outputShape;

		// The layer's shape is based on output shape.

		this.width = this.outputShape[ 0 ];
		this.height = this.outputShape[ 1 ];
		this.depth = this.outputShape[ 2 ];

		// Unit length is the same as merged elements, use unit length to calculate actualWidth and actualHeight which are used to create three.js object.

		this.unitLength = this.mergedElements[ 0 ].unitLength;
		this.actualWidth = this.unitLength * this.width;
		this.actualHeight = this.unitLength * this.height;

		// Calculate the feature map centers for close status.

		for ( let i = 0; i < this.depth; i ++ ) {

			let center = {

				x: 0,
				y: 0,
				z: 0

			};

			this.closeFmCenters.push( center );

		}

		// Calculate the feature map centers for open status.

		this.openFmCenters = FmCenterGenerator.getFmCenters(

			this.layerShape,
			this.depth,
			this.actualWidth,
			this.actualHeight

		);

	},

	/**
	 * updateValue() accept layer output value from model, update layer visualization if required.
	 *
	 * Model passes layer's output value to layer through updateValue method.
	 *
	 * @param { double[] } value, neural output value.
	 */

	updateValue: function ( value ) {

		// Store layer output value in "neuralValue" attribute, this attribute can be get by TensorSpace user.

		this.neuralValue = value;

		if ( this.isOpen ) {

			// If layer is open, update feature maps' visualization.

			this.updateSegregationVis();

		} else {

			// If layer is closed, update feature maps' aggregation's visualization.

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

			this.lineGroupHandler.initLineGroup( hoveredElement );

		}

		// If textSystem is enabled, show hint text, for example, show feature map size.

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

			this.lineGroupHandler.disposeLineGroup();

		}

		// If textSystem is enabled, hide hint text, for example, hide feature map size.

		if ( this.textSystem ) {

			this.hideText();

		}

	},

	/**
	 * loadModelConfig() load model's configuration into MergedLayer3d object,
	 * If one specific attribute has been set before, model's configuration will not be loaded into it.
	 *
	 * Based on the passed in modelConfig parameter
	 *
	 * @param { JSON } modelConfig, default and user's configuration for model
	 */

	loadModelConfig: function( modelConfig ) {

		// Call super class "Layer"'s method to load common model configuration, check out "Layer.js" file for more information.

		this.loadBasicModelConfig( modelConfig );

		if ( this.layerShape === undefined ) {

			this.layerShape = modelConfig.layerShape;

		}

		if ( this.aggregationStrategy === undefined ) {

			this.aggregationStrategy = modelConfig.aggregationStrategy;

		}

		if ( this.color === undefined ) {

			this.color = modelConfig.color[ this.operator ];

		}

	},

	/**
	 * calcCloseButtonSize() get close button size.
	 * Called by initCloseButton function in abstract class "Layer",
	 *
	 * @return { number } size, close button size
	 */

	calcCloseButtonSize: function() {

		// Total height when layer is open.

		let openHeight = this.actualHeight + this.openFmCenters[ this.openFmCenters.length - 1 ].z - this.openFmCenters[ 0 ].z;

		return openHeight * CloseButtonRatio;

	},

	/**                                                                                                                                                 y        y                        /**
	 * calcCloseButtonPos() get close button position.
	 * Called by initCloseButton function in abstract class "Layer",
	 *
	 * @return { JSON } position, close button position, relative to layer.
	 */

	calcCloseButtonPos: function() {

		let leftMostCenter = this.openFmCenters[ 0 ];
		let buttonSize = this.calcCloseButtonSize();

		return {

			x: leftMostCenter.x - this.actualWidth / 2 - 2 * buttonSize,
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

		// As different merge functions have different relative element strategies, call concrete strategy to get relative elements.

		return this.operationStrategy.getRelativeElements( selectedElement );

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

					// If index attribute is set in request, and layer is open, return feature map element which has the same index.

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
	 * ============
	 *
	 * Functions above override base class MergedLayer's abstract method.
	 *
	 * ============
	 */

	/**
	 * loadLayerConfig() init concrete strategy for MergedLayer3d.
	 * Create Strategy object and set it to MergedLayer3d based on layerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration and merge function's configuration for MergedLayer3d.
	 */

	initStrategy: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			// Get operator.

			if ( layerConfig.operator !== undefined ) {

				this.operator = layerConfig.operator;

			}

			// Get mergedElements.

			if ( layerConfig.mergedElements !== undefined ) {

				for ( let i = 0; i < layerConfig.mergedElements.length; i ++ ) {

					this.mergedElements.push( layerConfig.mergedElements[ i ] );

				}

			}

			// Get concrete strategy from factory.

			this.operationStrategy = StrategyFactory.getOperationStrategy( this.operator, 3, this.mergedElements );

		}

	},

	/**
	 * openLayer() open MergedLayer3d, switch layer status from "close" to "open".
	 *
	 * This API is exposed to TensorSpace user.
	 */

	openLayer: function() {

		if ( !this.isOpen ) {

			// MapTransitionFactory handles actual open animation, checkout "MapTransitionTween.js" for more information.

			MapTransitionFactory.openLayer( this );

		}

	},

	/**
	 * closeLayer() close MergedLayer3d, switch layer status from "open" to "close".
	 *
	 * This API is exposed to TensorSpace user.
	 */

	closeLayer: function() {

		if ( this.isOpen ) {

			// MapTransitionFactory handles actual close animation, checkout "MapTransitionTween.js" for more information.

			MapTransitionFactory.closeLayer( this );

		}

	},

	/**
	 * initSegregationElements() create feature maps's THREE.js Object, configure them, and add them to neuralGroup in MergedLayer3d.
	 *
	 * @param { JSON[] } centers, list of feature map's center (x, y, z), relative to layer
	 */

	initSegregationElements: function( centers ) {

		for ( let i = 0; i < this.depth; i ++ ) {

			// MergedFeatureMap Object is a wrapper for one feature map in mergedLayer3d, checkout "MergedFeatureMap.js" for more information.

			let segregationHandler = new MergedFeatureMap(

				this.operator,
				this.width,
				this.height,
				this.unitLength,
				centers[ i ],
				this.color,
				this.minOpacity

			);

			// Set layer index to feature map, feature map object can know which layer it has been positioned.

			segregationHandler.setLayerIndex( this.layerIndex );

			// Set feature map index.

			segregationHandler.setFmIndex( i );

			// Store handler for merged feature map for latter use.

			this.segregationHandlers.push( segregationHandler );

			// Get actual THREE.js element and add it to layer wrapper Object.

			this.neuralGroup.add( segregationHandler.getElement() );

		}

		// Update all merged feature maps' visualization if layer's value has already been set.

		if ( this.neuralValue !== undefined ) {

			this.updateSegregationVis();

		}

	},

	/**
	 * disposeSegregationElements() remove merged feature maps from neuralGroup, clear their handlers, and dispose their THREE.js Object in MergedLayer3d.
	 */

	disposeSegregationElements: function() {

		for ( let i = 0; i < this.segregationHandlers.length; i ++ ) {

			// Remove feature maps' THREE.js object from neuralGroup.

			let segregationHandler = this.segregationHandlers[ i ];
			this.neuralGroup.remove( segregationHandler.getElement() );

		}

		// Clear handlers, actual objects will automatically be GC.

		this.segregationHandlers = [];

	},

	/**
	 * initAggregationElement() create layer aggregation's THREE.js Object, configure it, and add it to neuralGroup in MergedLayer3d.
	 */

	initAggregationElement: function() {

		// MergedAggregation Object is a wrapper for merged feature maps's aggregation, checkout "MergedAggregation.js" for more information.

		let aggregationHandler = new MergedAggregation(

			this.operator,
			this.width,
			this.height,
			this.unitLength,
			this.actualDepth,
			this.color,
			this.minOpacity

		);

		// Set layer index to aggregation, aggregation object can know which layer it has been positioned.

		aggregationHandler.setLayerIndex( this.layerIndex );

		// Store handler for aggregation for latter use.

		this.aggregationHandler = aggregationHandler;

		// Get actual THREE.js element and add it to layer wrapper Object.

		this.neuralGroup.add( aggregationHandler.getElement() );

		// Update aggregation's visualization if layer's value has already been set.

		if ( this.neuralValue !== undefined ) {

			this.updateAggregationVis();

		}

	},

	/**
	 * disposeAggregationElement() remove aggregation from neuralGroup, clear its handler, and dispose its THREE.js Object in MergedLayer3d.
	 */

	disposeAggregationElement: function() {

		this.neuralGroup.remove( this.aggregationHandler.getElement() );
		this.aggregationHandler = undefined;

	},

	/**
	 * updateAggregationVis() update feature maps' aggregation's visualization.
	 */

	updateAggregationVis: function() {

		// Generate aggregation data from layer's raw output data. Checkout "ChannelDataGenerator.js" for more information.

		let aggregationUpdateValue = ChannelDataGenerator.generateAggregationData(

			this.neuralValue,
			this.depth,
			this.aggregationStrategy

		);

		// Get colors to render the surface of aggregation.

		let colors = ColorUtils.getAdjustValues( aggregationUpdateValue, this.minOpacity );

		// aggregationHandler execute update visualization process.

		this.aggregationHandler.updateVis( colors );

	},

	/**
	 * updateSegregationVis() update feature maps' visualization.
	 */

	updateSegregationVis: function() {

		// Generate feature map data from layer's raw output data. Checkout "ChannelDataGenerator.js" for more information.

		let layerOutputValues = ChannelDataGenerator.generateChannelData( this.neuralValue, this.depth );

		// Get colors to render the surface of feature maps.

		let colors = ColorUtils.getAdjustValues( layerOutputValues, this.minOpacity );

		let featureMapSize = this.width * this.height;

		// Each feature map handler execute its own update function.

		for ( let i = 0; i < this.depth; i ++ ) {

			this.segregationHandlers[ i ].updateVis( colors.slice( i * featureMapSize, ( i + 1 ) * featureMapSize ) );

		}

	},

	/**
	 * showText() show hint text relative to given element.
	 *
	 * @param { THREE.Object } element
	 */

	showText: function( element ) {

		if ( element.elementType === "featureMap" ) {

			let fmIndex = element.fmIndex;
			this.segregationHandlers[ fmIndex ].showText();
			this.textElementHandler = this.segregationHandlers[ fmIndex ];

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

export { MergedLayer3d };