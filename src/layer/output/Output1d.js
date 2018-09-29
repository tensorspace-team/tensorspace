/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer } from '../abstract/NativeLayer';
import { ColorUtils } from '../../utils/ColorUtils';
import { QueueAggregation } from "../../elements/QueueAggregation";
import { OutputTransitionFactory } from "../../animation/OutputTransitionTween";
import { OutputExtractor } from "../../utils/OutputExtractor";
import { OutputQueue } from "../../elements/OutputQueue";
import { OutputSegment } from "../../elements/OutputSegment";
import { PaginationButton } from "../../elements/PagniationButton";

/**
 * Output1d, output layer, can be initialized by TensorSpace user.
 *
 * @param config, user's configuration for Output1d.
 * @constructor
 */

function Output1d( config ) {

	// Output1d inherits from abstract layer "NativeLayer".

	NativeLayer.call( this, config );

	/**
	 * Layer's output units.
	 *
	 * @type { int }
	 */

	this.width = undefined;

	/**
	 * Class names for each output unit.
	 *
	 * @type { Array }
	 */

	this.outputs = undefined;

	/**
	 * Output group's handler.
	 *
	 * @type { Object }
	 */

	this.outputHandler = undefined;

	/**
	 * aggregation's width and height.
	 * aggregation is an element which is displayed on the screen when Output1d is closed.
	 *
	 * @type { number }
	 */

	this.aggregationWidth = undefined;
	this.aggregationHeight = undefined;

	/**
	 * mode for how to display queue element
	 * If there is too many output units, use "paging" mode may have better visualization effect.
	 *
	 * @type { boolean }
	 */

	this.paging = false;

	/**
	 * Only take effect when this.paging = true.
	 * Segment length for "one page".
	 * Default to 200.
	 *
	 * @type { int }
	 */

	this.segmentLength = 200;

	/**
	 * Only take effect when this.paging = true.
	 * Which page NativeLayer1d displays now.
	 * Can be update when "last" or "next" buttons are clicked, initial value can be defined by user.
	 * Default to 0.
	 *
	 * @type { int }
	 */

	this.segmentIndex = 0;

	/**
	 * Only take effect when this.paging = true.
	 * How many pages in NativeLayer1d.
	 *
	 * @type { int }
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

	// Load user's Output1d configuration.

	this.loadLayerConfig( config );

	this.layerType = "output1d";

}

Output1d.prototype = Object.assign( Object.create( NativeLayer.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer's abstract method
	 *
	 * Output1d overrides NativeLayer's function:
	 * init, assemble, updateValue, clear, handleClick, handleHoverIn, handleHoverOut,
	 * calcCloseButtonSize, calcCloseButtonPos, getRelativeElements
	 *
	 * ============
	 */

	/**
	 * init() create actual THREE.Object in Output1d, warp them into a group, and add it to THREE.js's scene.
	 *
	 * Model passes two parameters, center and actualDepth, to Output1d when call init() to initialize Output1d.
	 *
	 * @param { JSON } center, layer's center (x, y, z) relative to model
	 * @param { double } actualDepth, layer aggregation's depth
	 */

	init: function( center, actualDepth ) {

		this.center = center;
		this.actualDepth = actualDepth;

		// Init a neuralGroup as the wrapper for all THREE.Object in Output1d.

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set( this.center.x, this.center.y, this.center.z );

		if ( this.isOpen ) {

			// Init output units, when layer is open, and put them into open position.

			this.initOutputElement( "open" );

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
	 * assemble() configure layer's index in model, calculate the shape and parameters based on previous layer.
	 *
	 * @param { int } layerIndex, this layer's order in model
	 */

	assemble: function( layerIndex ) {

		this.layerIndex = layerIndex;

		// Conv2d layer's outputShape has one dimension.

		this.outputShape = [ this.width ];

		// Unit length is the same as last layer, use unit length to calculate actualWidth which is used to create three.js object.

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;

		if ( this.lastLayer.layerDimension === 1 ) {

			this.aggregationWidth = this.lastLayer.aggregationWidth;
			this.aggregationHeight = this.lastLayer.aggregationHeight;

		} else {

			this.aggregationWidth = this.lastLayer.actualWidth;
			this.aggregationHeight = this.lastLayer.actualHeight;

		}

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

			// When Output1d is open, update visualization.

			this.updateOutputVis();

			// If text system is enabled, show max confident neural class text.

			let maxConfidenceIndex = OutputExtractor.getMaxConfidenceIndex( value );

			if ( this.textSystem ) {

				this.hideText();
				this.outputHandler.showTextWithIndex( maxConfidenceIndex );
				this.textElementHandler = this.outputHandler;

			}

		}

	},

	/**
	 * clear() clear data and visualization in layer.
	 */

	clear: function() {

		if ( this.neuralValue !== undefined ) {

			if ( this.isOpen ) {

				// Use outputHandler to clear output units' visualization.

				this.outputHandler.clear();

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

		} else if ( clickedElement.elementType === "outputNeural" ) {

			if ( this.textSystem ) {

				// If output unit is clicked and text system is enabled, show class name relative to the clicked unit.

				this.hideText();
				this.showText( clickedElement );

			}

		} else if ( clickedElement.elementType === "paginationButton" ) {

			// If pagination button is clicked, update segment.

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

			this.lineGroupHandler.showLines( hoveredElement );

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

	},

	/**
	 * loadModelConfig() load model's configuration into Output1d object,
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

			this.color = modelConfig.color.output1d;

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

		return {

			x: this.outputHandler.leftBoundary.x - 10 * this.unitLength,
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

		if ( selectedElement.elementType === "aggregationElement" || selectedElement.elementType === "outputNeural" ) {

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
	 * Functions above override base class NativeLayer's abstract method.
	 *
	 * ============
	 */

	/**
	 * openLayer() open Output1d, switch layer status from "close" to "open".
	 *
	 * This API is exposed to TensorSpace user.
	 */

	openLayer: function() {

		if ( !this.isOpen ) {

			// OutputTransitionFactory handles actual open animation, checkout "OutputTransitionTween.js" for more information.

			OutputTransitionFactory.openLayer( this );

		}

	},

	/**
	 * closeLayer() close Output1d, switch layer status from "open" to "close".
	 *
	 * This API is exposed to TensorSpace user.
	 */

	closeLayer: function() {

		if ( this.isOpen ) {

			// OutputTransitionFactory handles actual close animation, checkout "OutputTransitionTween.js" for more information.

			OutputTransitionFactory.closeLayer( this );

		}

	},

	/**
	 * loadLayerConfig() Load user's configuration into Output1d.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for Output1d.
	 */

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			if ( layerConfig.units !== undefined ) {

				this.width = layerConfig.units;

			} else {

				console.error( "\"units\" property is required for Ouput1d layer." );

			}

			this.outputs = layerConfig.outputs;

			if ( layerConfig.paging !== undefined ) {

				this.paging = layerConfig.paging;

				if ( this.paging ) {

					// If paging mode is set, load paging parameters.

					if ( layerConfig.segmentLength !== undefined ) {

						this.segmentLength = layerConfig.segmentLength;
						this.queueLength = this.segmentLength;
						this.totalSegments = Math.ceil( this.width / this.segmentLength );

					}

					if ( layerConfig.initSegmentIndex !== undefined ) {

						this.segmentIndex = layerConfig.initSegmentIndex;

					}

				}

			}

		}

	},

	/**
	 * initOutputElement() create output units's group, which is a THREE.js Object, configure it, and add it to neuralGroup in Output1d.
	 * Based on paging mode, outputHandler will be different.
	 *
	 * @param { string } initStatus, "open" or "close".
	 */

	initOutputElement: function( initStatus ) {

		let outputHandler;

		// Create different outputHandler in different mode.

		if ( this.paging ) {

			outputHandler = new OutputSegment(

				this.outputs,
				this.segmentLength,
				this.segmentIndex,
				this.width,
				this.unitLength,
				this.color,
				this.minOpacity,
				initStatus

			);

		} else {

			outputHandler = new OutputQueue(

				this.width,
				this.outputs,
				this.unitLength,
				this.color,
				this.minOpacity,
				initStatus

			);

		}

		// Set layer index to outputHandler, output units group object can know which layer it has been positioned.

		outputHandler.setLayerIndex( this.layerIndex );

		// Store handler for output group element for latter use.

		this.outputHandler = outputHandler;

		// Get actual THREE.js element and add it to layer wrapper Object.

		this.neuralGroup.add( outputHandler.getElement() );

		// Update output units group' visualization if layer's value has already been set.

		if ( this.neuralValue !== undefined ) {

			this.updateOutputVis();

		}

	},

	/**
	 * disposeOutputElement() remove output units group from neuralGroup, clear their handlers, and dispose their THREE.js Object in Output1d.
	 */

	disposeOutputElement: function() {

		this.neuralGroup.remove( this.outputHandler.getElement() );
		this.outputHandler = undefined;

	},

	/**
	 * initAggregationElement() create layer aggregation's THREE.js Object, configure it, and add it to neuralGroup in Output1d.
	 */

	initAggregationElement: function() {

		// QueueAggregation Object is a wrapper for aggregation element, checkout "QueueAggregation.js" for more information.

		let aggregationHandler = new QueueAggregation(

			this.aggregationWidth,
			this.aggregationHeight,
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
	 * disposeAggregationElement() remove aggregation from neuralGroup, clear its handler, and dispose its THREE.js Object in Output1d.
	 */

	disposeAggregationElement: function() {

		this.neuralGroup.remove( this.aggregationHandler.getElement() );
		this.aggregationHandler = undefined;

	},

	/**
	 * updateOutputVis() update output units group's visualization.
	 */

	updateOutputVis: function() {

		// Get colors to render the surface of output units.

		let colors = ColorUtils.getAdjustValues( this.neuralValue, this.minOpacity );

		if ( this.paging ) {

			// Get part of colors to render segment.

			let segmentColors = colors.slice(

				this.segmentLength * this.segmentIndex,
				Math.min( this.segmentLength * ( this.segmentIndex + 1 ), this.width - 1 )

			);

			this.outputHandler.updateVis( segmentColors );

		} else {

			this.outputHandler.updateVis( colors );

		}

	},

	/**
	 * showText() show hint text relative to given element.
	 *
	 * @param { THREE.Object } element
	 */

	showText: function( element ) {

		this.outputHandler.showText( element );
		this.textElementHandler = this.outputHandler;

	},

	/**
	 * hideText() hide hint text.
	 */

	hideText: function() {

		if( this.textElementHandler !== undefined ) {

			this.textElementHandler.hideText();
			this.textElementHandler = undefined;

		}

	},

	/**
	 * showPaginationButton() conditional add "next" button and "last" button into Output1d.
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
			this.calculatePaginationPos( "last" ),
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
			this.calculatePaginationPos( "next" ),
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

				// The Last page now, click "last" button will show "next" button.

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

		this.outputHandler.updateSegmentIndex( this.segmentIndex );

		// Check whether queue length change, situation: the page's length may different with previous page.

		if ( this.outputHandler.isLengthChanged ) {

			if ( this.nextButtonHandler !== undefined ) {

				let nextButtonPos = this.calculatePaginationPos( "next" );
				this.nextButtonHandler.updatePos( nextButtonPos );

			}

			if ( this.lastButtonHandler !== undefined ) {

				let lastButtonPos = this.calculatePaginationPos( "last" );
				this.lastButtonHandler.updatePos( lastButtonPos );

			}

			let closeButtonPos = this.calcCloseButtonPos();
			this.closeButtonHandler.updatePos( closeButtonPos );

		}

		if ( this.neuralValue !== undefined ) {

			this.updateOutputVis();

		}

	},

	/**
	 * calcPaginationButtonSize() calculate button size.
	 *
	 * @return { number } size, pagination button size
	 */

	calcPaginationButtonSize: function() {

		// The size of pagination button is the same as close button in Output1d.

		return this.calcCloseButtonSize();

	},

	/**                                                                                                                                                 y        y                        /**
	 * calcCloseButtonPos() calculate the position of pagination button based on button type.
	 *
	 * @param { string } paginationType, "last" or "next".
	 * @return { Object } pagination button position, { x: double, y: double, z: double }, relative to layer.
	 */

	calculatePaginationPos: function( paginationType ) {

		if ( paginationType === "last" ) {

			// "last" button is positioned in the left of the layer.

			return {

				x: this.outputHandler.leftBoundary.x - 5 * this.unitLength,
				y: 0,
				z: 0

			};

		} else {

			// "next" button is positioned in the right of the layer.

			return {

				x: this.outputHandler.rightBoundary.x + 5 * this.unitLength,
				y: 0,
				z: 0

			};

		}

	}

} );

export { Output1d };