/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer } from "../abstract/NativeLayer";
import { ModelInitWidth } from "../../utils/Constant";
import { ColorUtils } from "../../utils/ColorUtils";
import { NeuralQueue } from "../../elements/NeuralQueue";
import { QueueSegment } from "../../elements/QueueSegment";
import { PaginationButton } from "../../elements/PagniationButton";

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

	this.closeable = false;

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

		if ( this.paging ) {

			// Init pagination button when layer is in "paging mode".

			this.showPaginationButton();

		}

		// Add the wrapper object to the actual THREE.js object.

		this.context.add( this.neuralGroup );

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

		this.neuralValue = value;

		// Get colors to render the surface of aggregation.

		let colors = ColorUtils.getAdjustValues( value, this.minOpacity );

		// aggregationHandler execute update visualization process.

		this.aggregationHandler.updateVis( colors );

		if ( this.paging ) {

			// Get part of colors to render segment.

			let segmentColors = colors.slice(

				this.segmentLength * this.segmentIndex,
				Math.min( this.segmentLength * ( this.segmentIndex + 1 ), this.width - 1 )

			);

			this.aggregationHandler.updateVis( segmentColors );

		} else {

			this.aggregationHandler.updateVis( colors );

		}

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
	 * @param { JSON } layerConfig, user's configuration for RGBInput.
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

		} else {

			console.error( "Lack config for Input1d layer." );

		}

	},

	/**
	 * initAggregationElement() create layer linear input's THREE.js Object, configure it, and add it to neuralGroup in Input1d.
	 */

	initAggregationElement: function() {

		// NeuralQueue Object is a wrapper for linear input element, checkout "NeuralQueue.js" for more information.

		let aggregationHandler;

		if ( this.paging ) {

			aggregationHandler = new QueueSegment(

				this.segmentLength,
				this.segmentIndex,
				this.width,
				this.unitLength,
				this.color,
				this.minOpacity,
				this.overview

			);

			this.queueLength = aggregationHandler.queueLength;

		} else {

			aggregationHandler = new NeuralQueue(

				this.width,
				this.unitLength,
				this.color,
				this.minOpacity,
				this.overview

			);

		}

		// Set layer index to aggregation, linear input element can know which layer it has been positioned.

		aggregationHandler.setLayerIndex( this.layerIndex );

		// Store handler for aggregation for latter use.

		this.aggregationHandler = aggregationHandler;

		// Get actual THREE.js element and add it to layer wrapper Object.

		this.neuralGroup.add( aggregationHandler.getElement() );

	},

	/**
	 * handleClick() If clickable element in this layer is clicked, execute this handle function.
	 *
	 * @param { THREE.Object } clickedElement, clicked element picked by model's Raycaster.
	 */

	handleClick: function( clickedElement ) {

		if ( clickedElement.elementType === "paginationButton" ) {

			// If pagination button ("last" or "next") is clicked, update page visualization.

			this.updatePage( clickedElement.paginationType );

		}

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

	},

	/**
	 * calcPaginationButtonSize() calculate button size.
	 *
	 * @return { number } size, pagination button size
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
	 * calcPaginationButtonSize() calculate button size.
	 *
	 * @return { number } size, pagination button size
	 */

	calcPaginationButtonSize: function() {

		// To make close button's size responsive, width = 50 is the boundary.

		if ( this.width > 50 ) {

			return 2 * this.unitLength;

		} else {

			return 1.1 * this.unitLength;

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

		this.aggregationHandler.updateSegmentIndex( this.segmentIndex );

		// Check whether queue length change, situation: the page's length may different with previous page.

		if ( this.aggregationHandler.isLengthChanged ) {

			this.queueLength = this.aggregationHandler.queueLength;

			if ( this.nextButtonHandler !== undefined ) {

				let nextButtonPos = this.calcPaginationButtonPos( "next" );
				this.nextButtonHandler.updatePos( nextButtonPos );

			}

			if ( this.lastButtonHandler !== undefined ) {

				let lastButtonPos = this.calcPaginationButtonPos( "last" );
				this.lastButtonHandler.updatePos( lastButtonPos );

			}

		}

		if ( this.neuralValue !== undefined ) {

			this.updateQueueVis();

		}

	}

} );

export { Input1d };