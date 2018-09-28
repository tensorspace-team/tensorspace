/**
 * @author syt123450 / https://github.com/syt123450
 */

import { QueueTransitionFactory } from "../../animation/QueueTransitionTween";
import { ColorUtils } from "../../utils/ColorUtils";
import { QueueAggregation } from "../../elements/QueueAggregation";
import { NeuralQueue } from "../../elements/NeuralQueue";
import { PaginationButton } from "../../elements/PagniationButton";
import { QueueSegment } from "../../elements/QueueSegment";
import { NativeLayer } from "./NativeLayer";

/**
 * NativeLayer1d, abstract layer, can not be initialized by TensorSpace user.
 * Base class for Dense, Flatten, Activation1d, BasicLayer1d.
 * The characteristic for classes which inherit from NativeLayer1d is that their output shape has one dimension, for example, [units].
 *
 * @param config, user's configuration for NativeLayer1d.
 * @constructor
 */

function NativeLayer1d(config ) {

	// NativeLayer1d inherits from abstract layer "NativeLayer".

	NativeLayer.call( this, config );

	/**
	 * NativeLayer1d has one output dimensions: [ width ].
	 *
	 * @type { int }
	 */

	this.width = undefined;

	/**
	 * queue element's handler.
	 * queue is an element which is displayed on the screen when layer1d is open.
	 *
	 * @type { Object }
	 */

	this.queueHandler = undefined;

	/**
	 * Decide how to display hint text.
	 *
	 * @type { boolean }
	 */

	this.overview = false;

	/**
	 * mode for how to display queue element
	 * If queue element is too long, use "paging" mode may have better visualization effect.
	 *
	 * @type { boolean }
	 */

	this.paging = false;

	/**
	 * Only take effect when this.paging = true.
	 * Segment length for "one page".
	 * Default to 200.
	 *
	 * @type { number }
	 */

	this.segmentLength = 200;

	/**
	 * Only take effect when this.paging = true.
	 * Which page NativeLayer1d displays now.
	 * Can be update when "last" or "next" buttons are clicked, initial value can be defined by user.
	 * Default to 0.
	 *
	 * @type { number }
	 */

	this.segmentIndex = 0;

	/**
	 * Only take effect when this.paging = true.
	 * How many pages in NativeLayer1d.
	 *
	 * @type { number }
	 */

	this.totalSegments = undefined;

	/**
	 * Only take effect when this.paging = true.
	 * Store handler for last button.
	 *
	 * @type { Object }
	 */

	this.lastButtonHandler = undefined;

	/**
	 * Only take effect when this.paging = true.
	 * Store handler for next button.
	 *
	 * @type { Object }
	 */

	this.nextButtonHandler = undefined;

	/**
	 * Only take effect when this.paging = true.
	 * Attribute used by tween in QueueTransitionFactory.
	 *
	 * @type { number }
	 */

	this.queueLength = this.segmentLength;

	/**
	 * aggregation's width and height.
	 * aggregation is an element which is displayed on the screen when layer1d is close.
	 *
	 * @type { number }
	 */

	this.aggregationWidth = undefined;
	this.aggregationHeight = undefined;

	/**
	 * An indicator whether layer1d is in an transition status.
	 * NativeLayer1d has a transition period between "close" and "open" when openLayer is called.
	 *
	 * @type { boolean }
	 */

	this.isTransition = false;

	// Load user's layer1d config into some layer1d's attribute.

	this.loadLayer1dConfig( config );

	this.layerDimension = 1;

}

NativeLayer1d.prototype = Object.assign( Object.create( NativeLayer.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer's abstract method
	 *
	 * NativeLayer1d overrides NativeLayer's function:
	 * init, updateValue, clear, handleClick, handleHoverIn, handleHoverOut, provideRelativeElements,
	 * calcCloseButtonSize, calcCloseButtonPos
	 *
	 * ============
	 */

	/**
	 * init() create actual THREE.Object in NativeLayer1d, warp them into a group, and add it to THREE.js's scene.
	 *
	 * Model passes two parameters, center and actualDepth, to NativeLayer1d when call init() to initialize NativeLayer1d.
	 *
	 * @param { JSON } center, layer's center (x, y, z) relative to model
	 * @param { double } actualDepth, layer aggregation's depth
	 */

	init: function(center, actualDepth ) {

		this.center = center;
		this.actualDepth = actualDepth;

		// Init a neuralGroup as the wrapper for all THREE.Object in NativeLayer1d.

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set( this.center.x, this.center.y, this.center.z );

		if ( this.isOpen ) {

			// Init queue element, when layer is open.

			this.initQueueElement();

			// Init close button.

			this.initCloseButton();

			if ( this.paging ) {

				// Init pagination button when layer is in "paging mode".

				this.showPaginationButton();

			}

		} else {

			// Init aggregation when layer is closed.

			this.initAggregationElement();

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

			// In layer1d, only queue element's visualization is relative to neural value.

			this.updateQueueVis();

		}

	},

	/**
	 * clear() clear data and visualization in layer.
	 */

	clear: function() {

		if ( this.neuralValue !== undefined ) {

			if ( this.isOpen ) {

				// Use queue's handler to clear queue element's visualization.

				this.queueHandler.clear();

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

		} else if ( clickedElement.elementType === "paginationButton" ) {

			// If pagination button ("last" or "next") is clicked, update page visualization.

			this.updatePage( clickedElement.paginationType );

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

		// If textSystem is enabled, show hint text, for example, show total neural number.

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

		// If textSystem is enabled, hide hint text, for example, hide total neural number.

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

		// To make close button's size responsive, width = 50 is the boundary.

		if ( this.width > 50 ) {

			return 2 * this.unitLength;

		} else {

			return 1.1 * this.unitLength;

		}

	},

	/**                                                                                                                                                 y        y                        /**
	 * calcCloseButtonPos() get close button position.
	 * Called by initCloseButton function in abstract class "Layer",
	 *
	 * @return { JSON } position, close button position, relative to layer.
	 */

	calcCloseButtonPos: function() {

		let xTranslate;

		// Close button is positioned in the left of layer, different strategy if layer1d is in "paging mode"

		if ( this.paging ) {

			xTranslate = - this.queueLength * this.unitLength / 2 - 10 * this.unitLength;

		} else {

			xTranslate = - this.actualWidth / 2 - 10 * this.unitLength;

		}

		return {

			x: xTranslate,
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

		// When layer1d is in transition, will not return any relative element.

		if ( !this.isTransition ) {

			if ( this.isOpen ) {

				// If layer is open, queue element is the relative element.

				relativeElements.push( this.queueHandler.getElement() );

			} else {

				// If layer is close, aggregation element is the relative element.

				relativeElements.push( this.aggregationHandler.getElement() );

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
	 * openLayer() open NativeLayer1d, switch layer status from "close" to "open".
	 *
	 * This API is exposed to TensorSpace user.
	 */

	openLayer: function() {

		if ( !this.isOpen ) {

			// QueueTransitionFactory handles actual open animation, checkout "QueueTransitionTween.js" for more information.

			QueueTransitionFactory.openLayer( this );

		}

	},

	/**
	 * closeLayer() close NativeLayer1d, switch layer status from "open" to "close".
	 *
	 * This API is exposed to TensorSpace user.
	 */

	closeLayer: function() {

		if ( this.isOpen ) {

			// QueueTransitionFactory handles actual close animation, checkout "QueueTransitionTween.js" for more information.

			QueueTransitionFactory.closeLayer( this );

		}

	},

	/**
	 * loadLayer1dConfig() Load user's common config into layer1d's attribute.
	 * Called when "NativeLayer1d" is initializing.
	 *
	 * @param { JSON } layerConfig, user's layer configuration.
	 */

	loadLayer1dConfig: function(layerConfig ) {

		if ( layerConfig !== undefined ) {

			if ( layerConfig.paging !== undefined ) {

				this.paging = layerConfig.paging;

				// If paging mode is set, load paging parameters.

				if ( this.paging ) {

					if ( layerConfig.segmentLength !== undefined ) {

						this.segmentLength = layerConfig.segmentLength;
						this.queueLength = this.segmentLength;

					}

					if ( layerConfig.initSegmentIndex !== undefined ) {

						this.segmentIndex = layerConfig.initSegmentIndex;

					}

				}

			}

			if ( layerConfig.overview !== undefined ) {

				this.overview = layerConfig.overview;

			}

		}

	},

	/**
	 * initAggregationElement() create layer aggregation's THREE.js Object, configure it, and add it to neuralGroup in NativeLayer1d.
	 */

	initAggregationElement: function() {

		// QueueAggregation Object is a wrapper for aggregation element, checkout "QueueAggregation.js" for more information.

		let aggregationHandler = new QueueAggregation(

			this.aggregationWidth,
			this.aggregationHeight,
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

	},

	/**
	 * disposeAggregationElement() remove aggregation from neuralGroup, clear its handler, and dispose its THREE.js Object in NativeLayer1d.
	 */

	disposeAggregationElement: function() {

		this.neuralGroup.remove( this.aggregationHandler.getElement() );
		this.aggregationHandler = undefined;

	},

	/**
	 * initQueueElement() create queue element's THREE.js Object, configure it, and add it to neuralGroup in NativeLayer1d.
	 */

	initQueueElement: function() {

		let queueHandler;

		// Create different elements in different mode.

		if ( this.paging ) {

			queueHandler = new QueueSegment(

				this.segmentLength,
				this.segmentIndex,
				this.width,
				this.unitLength,
				this.color,
				this.minOpacity

			);

			this.queueLength = queueHandler.queueLength;

		} else {

			queueHandler = new NeuralQueue(

				this.width,
				this.unitLength,
				this.color,
				this.minOpacity

			);

		}

		// Set layer index to queue element, queue element object can know which layer it has been positioned.

		queueHandler.setLayerIndex( this.layerIndex );

		// Store handler for queue element for latter use.

		this.queueHandler = queueHandler;

		// Get actual THREE.js element and add it to layer wrapper Object.

		this.neuralGroup.add( queueHandler.getElement() );

		// Update queue element' visualization if layer's value has already been set.

		if ( this.neuralValue !== undefined ) {

			this.updateQueueVis();

		}

	},

	/**
	 * disposeQueueElement() remove queue element from neuralGroup, clear their handlers, and dispose their THREE.js Object in NativeLayer1d.
	 */

	disposeQueueElement: function() {

		this.neuralGroup.remove( this.queueHandler.getElement() );
		this.queueHandler = undefined;

	},

	/**
	 * updateQueueVis() update queue element's visualization.
	 */

	updateQueueVis: function() {

		// Get colors to render the surface of queue element.

		let colors = ColorUtils.getAdjustValues( this.neuralValue, this.minOpacity );

		if ( this.paging ) {

			// Get part of colors to render segment.

			let segmentColors = colors.slice(

				this.segmentLength * this.segmentIndex,
				Math.min( this.segmentLength * ( this.segmentIndex + 1 ), this.width - 1 )

			);

			this.queueHandler.updateVis( segmentColors );

		} else {

			this.queueHandler.updateVis( colors );

		}

	},

	/**
	 * showText() show hint text relative to given element.
	 *
	 * @param { THREE.Object } element
	 */

	showText: function( element ) {

		if ( element.elementType === "featureLine" ) {

			this.queueHandler.showText();
			this.textElementHandler = this.queueHandler;

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
	 * showPaginationButton() conditional add "next" button and "last" button into layer1d.
	 */

	showPaginationButton: function() {

		if ( this.segmentIndex === 0 && this.segmentIndex !== this.totalSegments - 1 ) {

			// First page only show "next" button.

			this.showNextButton();

		} else if ( this.segmentIndex !== 0 && this.segmentIndex === this.totalSegments - 1 ) {

			// last page only show "last" button.

			this.showLastButton();

		} else if ( this.segmentIndex === 0 && this.segmentIndex === this.totalSegments - 1 ) {

			// If only has one page, no button.

		} else {

			// In other situational, show two button.

			this.showNextButton();
			this.showLastButton();

		}

	},

	/**
	 * showLastButton() initialize "last" button, and add it to neuralGroup.
	 */

	showLastButton: function() {

		let lastButtonHandler = new PaginationButton(

			"last",
			this.calcPaginationButtonSize(),
			this.unitLength,
			this.calcPaginationButtonPos( "last" ),
			this.color,
			this.minOpacity

		);

		// Set layer index to "last" button, button object can know which layer it has been positioned.

		lastButtonHandler.setLayerIndex( this.layerIndex );

		this.lastButtonHandler = lastButtonHandler;
		this.neuralGroup.add( this.lastButtonHandler.getElement() );

	},

	/**
	 * showNextButton() initialize "next" button, and add it to neuralGroup.
	 */

	showNextButton: function() {

		let nextButtonHandler = new PaginationButton(

			"next",
			this.calcPaginationButtonSize(),
			this.unitLength,
			this.calcPaginationButtonPos( "next" ),
			this.color,
			this.minOpacity

		);

		// Set layer index to "next" button, button object can know which layer it has been positioned.

		nextButtonHandler.setLayerIndex( this.layerIndex );

		this.nextButtonHandler = nextButtonHandler;
		this.neuralGroup.add( this.nextButtonHandler.getElement() );

	},

	/**
	 * hidePaginationButton(), hide "last" button and "next" button.
	 */

	hidePaginationButton: function() {

		this.hideNextButton();
		this.hideLastButton();

	},

	/**
	 * hideNextButton(), hide "next" button.
	 */

	hideNextButton: function() {

		if ( this.nextButtonHandler !== undefined ) {

			this.neuralGroup.remove( this.nextButtonHandler.getElement() );
			this.nextButtonHandler = undefined;

		}

	},

	/**
	 * hideLastButton(), hide "last" button.
	 */

	hideLastButton: function() {

		if ( this.lastButtonHandler !== undefined ) {

			this.neuralGroup.remove( this.lastButtonHandler.getElement() );
			this.lastButtonHandler = undefined;

		}

	},

	/**                                                                                                                                                 y        y                        /**
	 * updatePage() execute actual page update work.
	 *
	 * @param { string } paginationType, "last" or "next".
	 */

	updatePage: function( paginationType ) {

		if ( paginationType === "next" ) {

			// "next" button is clicked.

			if ( this.segmentIndex === 0 ) {

				// First page now, click "next" button will show "last" button.

				this.showLastButton();

			}

			if ( this.segmentIndex === this.totalSegments - 2 ) {

				// Is going to the last page, the last page do not have "next" button.

				this.hideNextButton();

			}

			// Update segmentIndex.

			this.segmentIndex += 1;

		} else {

			// "last" button is clicked.

			if ( this.segmentIndex === this.totalSegments - 1 ) {

				// Last page now, click "last" button will show "next" button.

				this.showNextButton();

			}

			if ( this.segmentIndex === 1 ) {

				// Is going to the first page, the first page do not have "last" button.

				this.hideLastButton();

			}

			// Update segmentIndex.

			this.segmentIndex -= 1;

		}

		// Modify segment element based on new segment index.

		this.queueHandler.updateSegmentIndex( this.segmentIndex );

		// Check whether queue length change, situation: the page's length may different with previous page.

		if ( this.queueHandler.isLengthChanged ) {

			this.queueLength = this.queueHandler.queueLength;

			if ( this.nextButtonHandler !== undefined ) {

				let nextButtonPos = this.calcPaginationButtonPos( "next" );
				this.nextButtonHandler.updatePos( nextButtonPos );

			}

			if ( this.lastButtonHandler !== undefined ) {

				let lastButtonPos = this.calcPaginationButtonPos( "last" );
				this.lastButtonHandler.updatePos( lastButtonPos );

			}

			let closeButtonPos = this.calcCloseButtonPos();
			this.closeButtonHandler.updatePos( closeButtonPos );

		}

		if ( this.neuralValue !== undefined ) {

			this.updateQueueVis();

		}

	},

	/**
	 * calcPaginationButtonSize() calculate button size.
	 *
	 * @return { number } size, pagination button size
	 */

	calcPaginationButtonSize: function() {

		// The size of pagination button is the same as close button in NativeLayer1d.

		this.calcCloseButtonSize();

	},

	/**                                                                                                                                                 y        y                        /**
	 * calcCloseButtonPos() calculate the position of pagination button based on button type.
	 *
	 * @param { string } paginationType, "last" or "next".
	 * @return { Object } pagination button position, { x: double, y: double, z: double }, relative to layer.
	 */

	calcPaginationButtonPos: function( paginationType ) {

		if ( paginationType === "last" ) {

			// "last" button is positioned in the left of the layer.

			return {

				x: - this.queueLength * this.unitLength / 2 - 5 * this.unitLength,
				y: 0,
				z: 0

			};

		} else {

			// "next" button is positioned in the right of the layer.

			return {

				x: this.queueLength * this.unitLength / 2 + 5 * this.unitLength,
				y: 0,
				z: 0

			};

		}

	},

	/**
	 * ============
	 *
	 * Functions below are abstract method for NativeLayer1d.
	 * SubClasses ( specific layers ) override these abstract method to get NativeLayer1d's characters.
	 *
	 * ============
	 */

	/**
	 * loadLayerConfig() abstract method
	 * Load layer's configuration into layer which extends NativeLayer1d.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig and loadLayer1dConfig.
	 *
	 * Override this function if there are some specific configuration for layer which extends NativeLayer1d.
	 *
	 * @param { JSON } layerConfig, user's configuration for layer.
	 */

	loadLayerConfig: function( layerConfig ) {

	},

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

export { NativeLayer1d };