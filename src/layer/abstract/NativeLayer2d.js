/**
 * @author syt123450 / https://github.com/syt123450
 */

import { QueueGroupTweenFactory } from "../../animation/QueueGroupTransitionTween";
import { ChannelDataGenerator } from "../../utils/ChannelDataGenerator";
import { ColorUtils } from "../../utils/ColorUtils";
import { GridAggregation } from "../../elements/GridAggregation";
import { GridLine } from "../../elements/GridLine";
import { NativeLayer } from "./NativeLayer";

/**
 * NativeLayer2d, abstract layer, can not be initialized by TensorSpace user.
 * Base class for Activation2d, BasicLayer2d, Conv1d, Cropping1d, GlobalPooling1d, padding1d, Pooling1d, Reshape1d, UpSampling1d.
 * The characteristic for classes which inherit from NativeLayer2d is that their output shape has one dimension, for example, [ width, depth ].
 *
 * @param config, user's configuration for NativeLayer2d.
 * @constructor
 */

function NativeLayer2d(config ) {

	// NativeLayer2d inherits from abstract layer "NativeLayer".

	NativeLayer.call( this, config );

	/**
	 * NativeLayer2d has one output dimensions: [ width, depth ].
	 *
	 * @type { int }
	 */

	this.width = undefined;
	this.depth = undefined;

	/**
	 * grid lines' handlers list
	 *
	 * @type { Array }
	 */

	this.queueHandlers = [];

	/**
	 * grid lines' centers when layer is closed.
	 *
	 * @type { Array }
	 */

	this.closeCenterList = [];

	/**
	 * grid lines' centers when layer is totally open.
	 *
	 * @type { Array }
	 */

	this.openCenterList = [];

	this.layerDimension = 2;

}

NativeLayer2d.prototype = Object.assign( Object.create( NativeLayer.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer's abstract method
	 *
	 * NativeLayer2d overrides NativeLayer's function:
	 * init, updateValue, clear, handleClick, handleHoverIn, handleHoverOut,
	 * calcCloseButtonSize, calcCloseButtonPos, provideRelativeElements,
	 *
	 * ============
	 */

	/**
	 * init() create actual THREE.Object in NativeLayer2d, warp them into a group, and add it to THREE.js's scene.
	 *
	 * Model passes two parameters, center and actualDepth, to NativeLayer2d when call init() to initialize NativeLayer2d.
	 *
	 * @param { JSON } center, layer's center (x, y, z) relative to model
	 * @param { double } actualDepth, layer aggregation's depth
	 */

	init: function( center, actualDepth ) {

		this.center = center;
		this.actualDepth = actualDepth;

		// Init a neuralGroup as the wrapper for all THREE.Object in NativeLayer2d.

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set( this.center.x, this.center.y, this.center.z );

		// depth === 1 means that there is only one grid line in NativeLayer2d, no need for aggregation, open layer, or close layer.

		if ( this.depth === 1 ) {

			// Open layer and init one grid line (depth === 1) without initializing close button.

			this.isOpen = true;
			this.initSegregationElements( this.openCenterList );

		} else {

			if ( this.isOpen ) {

				// Init all grid lines and display them to totally opened positions.

				this.initSegregationElements( this.openCenterList );

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

			// If layer is open, update queues' visualization.

			this.updateSegregationVis();

		} else {

			// If layer is closed, update aggregation's visualization.

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

				for ( let i = 0; i < this.queueHandlers.length; i ++ ) {

					this.queueHandlers[ i ].clear();

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

			this.lineGroupHandler.showLines( hoveredElement );

		}

		// If textSystem is enabled, show hint text, for example, show grid line length.

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

		// If textSystem is enabled, hide hint text, for example, hide grid line length.

		if ( this.textSystem ) {

			this.hideText();

		}

	},

	/**
	 * calcCloseButtonSize() get close button size.
	 * Called by initCloseButton function in abstract class "Layer",
	 *
	 * @return { number } size, close button size
	 */

	calcCloseButtonSize: function() {

		return 1.1 * this.unitLength;

	},

	/**                                                                                                                                                 y        y                        /**
	 * calcCloseButtonPos() get close button position.
	 * Called by initCloseButton function in abstract class "Layer",
	 *
	 * @return { JSON } position, close button position, relative to layer.
	 */

	calcCloseButtonPos: function() {

		return {

			x: - this.actualWidth / 2 - 30,
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

				for ( let i = 0; i < this.queueHandlers.length; i ++ ) {

					relativeElements.push( this.queueHandlers[ i ].getElement() );

				}

			} else {

				relativeElements.push( this.aggregationHandler.getElement() );

			}

		} else {

			if ( request.index !== undefined ) {

				if ( this.isOpen ) {

					// If index attribute is set in request, and layer is open, return grid line element which has the same index.

					relativeElements.push( this.queueHandlers[ request.index ].getElement() );

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
	 * Functions above override base class NativeLayer's abstract method.
	 *
	 * ============
	 */

	/**
	 * openLayer() open NativeLayer2d, switch layer status from "close" to "open".
	 *
	 * This API is exposed to TensorSpace user.
	 */

	openLayer: function() {

		if ( !this.isOpen ) {

			// QueueGroupTweenFactory handles actual open animation, checkout "QueueGroupTransitionTween.js" for more information.

			QueueGroupTweenFactory.openLayer( this );

			this.isOpen = true;

		}

	},

	/**
	 * closeLayer() close NativeLayer2d, switch layer status from "open" to "close".
	 *
	 * This API is exposed to TensorSpace user.
	 */

	closeLayer: function() {

		if ( this.isOpen ) {

			// QueueGroupTweenFactory handles actual close animation, checkout "QueueGroupTransitionTween.js" for more information.

			QueueGroupTweenFactory.closeLayer( this );

			this.isOpen = false;

		}

	},

	/**
	 * initSegregationElements() create grid lines's THREE.js Object, configure them, and add them to neuralGroup in NativeLayer2d.
	 *
	 * @param { JSON[] } centers, list of grid lines' center (x, y, z), relative to layer
	 */

	initSegregationElements: function( centers ) {

		this.queueHandlers = [];

		for ( let i = 0; i < this.depth; i ++ ) {

			// GridLine Object is a wrapper for grid line elements, checkout "GridLine.js" for more information.

			let queueHandler = new GridLine(

				this.width,
				this.unitLength,
				centers[ i ],
				this.color,
				this.minOpacity

			);

			// Set layer index to feature map, feature map object can know which layer it has been positioned.

			queueHandler.setLayerIndex( this.layerIndex );

			// Set queue index.

			queueHandler.setGridIndex( i );

			// Store handler for queue for latter use.

			this.queueHandlers.push( queueHandler );

			// Get actual THREE.js element and add it to layer wrapper Object.

			this.neuralGroup.add( queueHandler.getElement() );

		}

		// Update all queues' visualization if layer's value has already been set.

		if ( this.neuralValue !== undefined ) {

			this.updateSegregationVis();

		}

	},

	/**
	 * disposeSegregationElements() remove grid lines from neuralGroup, clear their handlers, and dispose their THREE.js Object in NativeLayer2d.
	 */

	disposeSegregationElements: function() {

		for ( let i = 0; i < this.depth; i ++ ) {

			// Remove queues' THREE.js object from neuralGroup.

			this.neuralGroup.remove( this.queueHandlers[ i ].getElement() );

		}

		// Clear handlers, actual objects will automatically be GC.

		this.queueHandlers = [];

	},

	/**
	 * initAggregationElement() create layer aggregation's THREE.js Object, configure it, and add it to neuralGroup in NativeLayer2d.
	 */

	initAggregationElement: function() {

		// GridAggregation Object is a wrapper for queues' aggregation, checkout "GridAggregation.js" for more information.

		let aggregationHandler = new GridAggregation(

			this.width,
			this.unitLength,
			this.color,
			this.minOpacity

		);

		// Set layer index to aggregation, aggregation object can know which layer it has been positioned.

		aggregationHandler.setLayerIndex( this.layerIndex );

		// Store handler for aggregation for latter use.

		this.aggregationHandler = aggregationHandler;

		// Get actual THREE.js element and add it to layer wrapper Object.

		this.neuralGroup.add( this.aggregationHandler.getElement() );

		// Update aggregation's visualization if layer's value has already been set.

		if ( this.neuralValue !== undefined ) {

			this.updateAggregationVis();

		}

	},

	/**
	 * disposeAggregationElement() remove aggregation from neuralGroup, clear its handler, and dispose its THREE.js Object in NativeLayer2d.
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
	 * updateSegregationVis() grid lines' visualization.
	 */

	updateSegregationVis: function() {

		// Generate grid line data from layer's raw output data. Checkout "ChannelDataGenerator.js" for more information.

		let layerOutputValues = ChannelDataGenerator.generateChannelData( this.neuralValue, this.depth );

		// Get colors to render the surface of grid lines.

		let colors = ColorUtils.getAdjustValues( layerOutputValues, this.minOpacity );

		let gridLineLength = this.width;

		// Each grid line handler execute its own update function.

		for ( let i = 0; i < this.depth; i ++ ) {

			this.queueHandlers[ i ].updateVis( colors.slice( i * gridLineLength, ( i + 1 ) * gridLineLength ) );

		}

	},

	/**
	 * showText() show hint text relative to given element.
	 *
	 * @param { THREE.Object } element
	 */

	showText: function( element ) {

		if ( element.elementType === "gridLine" ) {

			let gridIndex = element.gridIndex;

			this.queueHandlers[ gridIndex ].showText();
			this.textElementHandler = this.queueHandlers[ gridIndex ];

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

	},

	/**
	 * ============
	 *
	 * Functions below are abstract method for NativeLayer2d.
	 * SubClasses ( specific layers ) override these abstract method to get NativeLayer2d's characters.
	 *
	 * ============
	 */

	/**
	 * loadModelConfig() abstract method
	 * Load model's configuration into layer object.
	 *
	 * Override this function if there are some specific model configurations for layer.
	 *
	 * @param { JSON } modelConfig, default and user's configuration for model.
	 */

	loadModelConfig: function( modelConfig ) {

	},

	/**
	 * assemble() abstract method
	 * Configure layer's index in model, calculate the shape and parameters based on previous layer.
	 *
	 * Override this function to get information from previous layer.
	 *
	 * @param { int } layerIndex, this layer's order in model.
	 */

	assemble: function( layerIndex ) {

	},

	/**
	 * getRelativeElements() abstract method
	 * Get relative element in last layer for relative lines based on given hovered element.
	 *
	 * Override this function to define relative element from previous layer.
	 *
	 * Use bridge design patten:
	 * 1. "getRelativeElements" send request to previous layer for relative elements;
	 * 2. Previous layer's "provideRelativeElements" receives request, return relative elements.
	 *
	 * @param { THREE.Object } selectedElement, hovered element detected by THREE's Raycaster.
	 * @return { THREE.Object[] } relativeElements
	 */

	getRelativeElements: function( selectedElement ) {

		return [];

	}

} );

export { NativeLayer2d };