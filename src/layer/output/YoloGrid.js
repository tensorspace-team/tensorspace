/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer } from "../abstract/NativeLayer";
import { YoloOutputUnit } from "../../elements/YoloOuputUnit";
import { YoloTweenFactory } from "../../animation/YoloTransitionTween";
import { QueueAggregation } from "../../elements/QueueAggregation";
import { CloseButtonRatio } from "../../utils/Constant";
import { YoloResultGenerator } from "../../utils/YoloResultGenerator";

/**
 * YoloGrid, output layer, can be initialized by TensorSpace user.
 * In yolo, the input image is divided into an S x S grid of cells,
 * this layer presents each ceil as an cube for user to click,
 * and get predict result in each ceil from callback function.
 *
 * @param config, user's configuration for YoloGrid.
 * @constructor
 */

function YoloGrid( config ) {

	// YoloGrid inherits from abstract layer "NativeLayer".

	NativeLayer.call( this, config );

	/**
	 * Grid ceil's handlers list.
	 *
	 * @type { Array }
	 */

	this.segregationHandlers = [];

	/**
	 * Callback function, fired when ceil are clicked.
	 *
	 * @type { function }
	 */

	this.onCeilClicked = undefined;

	/**
	 * Output shape: [ widthNum, heightNum ].
	 *
	 * @type { int }
	 */

	this.widthNum = undefined;
	this.heightNum = undefined;

	/**
	 * Total grid ceil number.
	 *
	 * @type { int }
	 */

	this.totalCeil = undefined;

	/**
	 * Depth for each grid ceil.
	 *
	 * @type { int }
	 */

	this.channelDepth = undefined;

	/**
	 * Grid ceil's centers when layer is closed.
	 *
	 * @type { Array }
	 */

	this.closeResultPos = [];

	/**
	 * Grid ceil's centers when layer is totally open.
	 *
	 * @type { Array }
	 */

	this.openResultPos = [];

	/**
	 * Sets from a predetermined set of boxes with particular height-width ratios for Yolo Detection.
	 * Stored as an array, for example,
	 * in VOC data set, anchors: [ 1.08, 1.19, 3.42, 4.41, 6.63, 11.38, 9.42, 5.11, 16.62, 10.52 ]
	 *
	 * @type { Array } float
	 */

	this.anchors = undefined;

    /**
     * The label list configuration.
     * For example, in VOC data set, label: [ "aeroplane", "bicycle", "bird", "boat", "bottle",
     * "bus", "car", "cat", "chair", "cow", "diningtable", "dog", "horse", "motorbike", "person",
     * "pottedplant", "sheep", "sofa", "train", "tvmonitor" ]
     *
     * @type { Array } string
     */

    this.classLabelList = undefined;

    /**
     * The threshold to constrain the output baseline.
     * The larger the value, the higher the confidence value of the detected object need.
     * [Default] 0.5
	 *
     * @type { float }
     */

    this.scoreThreshold = 0.5;

    /**
     * The toggle to control whether to draw all 5 boxes in each grid.
     * Usually be used to how how yolo network generate the final detective boxes.
     * [Default] false, means to draw the final result.
     * @type { bool }
     */

    this.isDrawFiveBoxes = false;

    /**
     * The toggle to control whether to apply non-maximum suppression to the detection rectangles .
     * [Default] true, means to apply nms.
     * @type { bool }
     */

    this.isNMS = true;

    /**
	 * Model's input shape, the shape is the same as model's input layer.
	 *
	 * @type { Array }
	 */

	this.modelInputShape = undefined;

	/**
	 * Label to define whether layer need an "output value" from backend model (tfjs, keras, or tf).
	 * True means that user do not need to add value for YoloGrid value when they are preprocessing multi-output for the model.
	 *
	 * @type { boolean }
	 */

	this.autoOutputDetect = true;

	// Load user's YoloGrid configuration.

	this.loadLayerConfig( config );

	this.layerType = "YoloGrid";

}

YoloGrid.prototype = Object.assign( Object.create( NativeLayer.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class NativeLayer's abstract method
	 *
	 * YoloGrid overrides NativeLayer's function:
	 * init, assemble, updateValue, clear, handleClick, handleHoverIn, handleHoverOut, loadModelConfig,
	 * calcCloseButtonSize, calcCloseButtonPos, getRelativeElements, provideRelativeElements, getBoundingWidth
	 *
	 * ============
	 */

	/**
	 * init() create actual THREE.Object in YoloGrid, warp them into a group, and add it to THREE.js's scene.
	 *
	 * Model passes two parameters, center and actualDepth, to YoloGrid when call init() to initialize YoloGrid.
	 *
	 * @param { JSON } center, layer's center (x, y, z) relative to model
	 * @param { double } actualDepth, layer aggregation's depth
	 */

	init: function( center, actualDepth ) {

		this.center = center;
		this.actualDepth = actualDepth;

		// Init a neuralGroup as the wrapper for all THREE.Object in YoloGrid.

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set( this.center.x, this.center.y, this.center.z );

		if ( this.isOpen ) {

			// Init all grid ceil and display them to totally opened positions.

			this.initSegregationElements( this.openResultPos );

			// Init close button.

			this.initCloseButton();

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

	assemble: function ( layerIndex ) {

		this.layerIndex = layerIndex;

		// Auto detect input shape from last layer.

		this.inputShape = this.lastLayer.outputShape;

		// Infer layer shape from input shape.

		this.widthNum = this.inputShape[ 0 ];
		this.heightNum = this.inputShape[ 1 ];
		this.channelDepth = this.inputShape[ 2 ];
		this.outputShape = [ this.widthNum, this.heightNum ];

		this.modelInputShape = this.model.layers[ 0 ].outputShape;

		// Unit length is the same as last layer, use unit length to calculate actualWidth and actualHeight which are used to create three.js object.

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.lastLayer.actualWidth;
		this.actualHeight = this.lastLayer.actualHeight;

		this.totalCeil = this.widthNum * this.heightNum;

		// Calculate the grid ceil's centers for closed status.

		for (let i = 0; i < this.totalCeil; i ++ ) {

			this.closeResultPos.push( {

				x: 0,
				y: 0,
				z: 0

			} );

		}

		// Calculate the grid ceil's centers for open status.

		this.openResultPos = this.calcOpenResultPos();

	},

	/**
	 * updateValue(), get layer value from last layer.
	 */

	updateValue: function() {

		this.neuralValue = this.lastLayer.neuralValue;

	},

	/**
	 * clear(), clear layer value.
	 */

	clear: function() {

		this.neuralValue = undefined;

	},

	/**
	 * handleClick() If clickable element in this layer is clicked, execute this handle function.
	 *
	 * @param { THREE.Object } clickedElement, clicked element picked by model's Raycaster.
	 */

	handleClick: function ( clickedElement ) {

		if ( clickedElement.elementType === "aggregationElement" ) {

			// If aggregation element is clicked, open layer.

			this.openLayer();

		} else if ( clickedElement.elementType === "closeButton" ) {

			// If close button is clicked, close layer.

			this.closeLayer();

		} else if ( clickedElement.elementType === "outputNeural" ) {

			// If grid ceil click, fire callback function.

			this.handleCeilClicked( clickedElement );

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
	 * loadModelConfig() load model's configuration into YoloGrid object,
	 * If one specific attribute has been set before, model's configuration will not be loaded into it.
	 *
	 * Based on the passed in modelConfig parameter
	 *
	 * @param { JSON } modelConfig, default and user's configuration for model
	 */

	loadModelConfig: function ( modelConfig ) {

		// Call super class "Layer"'s method to load common model configuration, check out "Layer.js" file for more information.

		this.loadBasicModelConfig( modelConfig );

		if ( this.color === undefined ) {

			this.color = modelConfig.color.yoloGrid;

		}

	},

	/**
	 * calcCloseButtonSize() get close button size.
	 * Called by initCloseButton function in abstract class "Layer",
	 *
	 * @return { number } size, close button size
	 */

	calcCloseButtonSize: function() {

		return CloseButtonRatio * ( this.openResultPos[ this.openResultPos.length - 1 ].z - this.openResultPos[ 0 ].z );

	},

	/**                                                                                                                                                 y        y                        /**
	 * calcCloseButtonPos() get close button position.
	 * Called by initCloseButton function in abstract class "Layer",
	 *
	 * @return { JSON } position, close button position, relative to layer.
	 */

	calcCloseButtonPos: function() {

		return {

			x: this.openResultPos[ 0 ].x - 10 * this.unitLength,
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

	getRelativeElements: function ( selectedElement ) {

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
	 * getBoundingWidth(), provide bounding box's width based on layer's status.
	 *
	 * @return { number }
	 */

	getBoundingWidth: function() {

		if ( ( this.isOpen && !this.isWaitClose ) || this.isWaitOpen ) {

			let maxX = this.openResultPos[ 0 ].x;

			for ( let i = 0; i < this.openResultPos.length; i ++ ) {

				maxX = this.openResultPos[ i ] > maxX ? this.openResultPos[ i ] : maxX;

			}

			return maxX - this.calcCloseButtonPos().x + this.calcCloseButtonSize();

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
	 * openLayer() open YoloGrid, switch layer status from "close" to "open".
	 *
	 * This API is exposed to TensorSpace user.
	 */

	openLayer: function() {

		if ( !this.isOpen ) {

			// YoloTweenFactory handles actual open animation, checkout "YoloTransitionTween.js" for more information.

			YoloTweenFactory.openLayer( this );

		}

	},

	/**
	 * closeLayer() close YoloGrid, switch layer status from "open" to "close".
	 *
	 * This API is exposed to TensorSpace user.
	 */

	closeLayer: function() {

		if ( this.isOpen ) {

			// YoloTweenFactory handles actual close animation, checkout "YoloTransitionTween.js" for more information.

			YoloTweenFactory.closeLayer( this );

		}

	},

	/**
	 * handleCeilClicked(), handle user's click on ceil element, execute callback if configured.
	 *
	 * @param { THREE.Object } clickedElement
	 */

	handleCeilClicked: function(clickedElement ) {

		if ( this.onCeilClicked !== undefined ) {

			let outputIndex = clickedElement.outputIndex;

			let widthIndex = outputIndex % this.widthNum;
			let heightIndex = Math.floor( outputIndex / this.widthNum );

			let ceilData = this.getCeilOutputValues( outputIndex );

			let rectangleList = [];

			if ( widthIndex === 0 && heightIndex === 0 ) {

				// To get the boxes with detective objects.

				rectangleList = YoloResultGenerator.getDetectedBox(
					this.neuralValue,
                    this.channelDepth,
					this.outputShape,
                    this.modelInputShape,
                    this.anchors,
                    this.classLabelList,
                    this.scoreThreshold,
					this.iouThreshold,
                    this.isNMS,
				)

			} else {

				// Use YoloResultGenerator get rects.

                rectangleList = YoloResultGenerator.getChannelBox(
                    ceilData,
                    this.outputShape,
                    this.modelInputShape,
                    this.anchors,
                    this.classLabelList,
                    this.scoreThreshold,
                    this.iouThreshold,
                    this.isDrawFiveBoxes,
                    widthIndex,
                    heightIndex
                );

            }

			// Pass two parameters, ceilData and rectangleList, to callback function.

			this.onCeilClicked( ceilData, rectangleList );

		}

	},

	/**
	 * loadLayerConfig() Load user's configuration into YoloGrid.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * @param { JSON } layerConfig, user's configuration for YoloGrid.
	 */

	loadLayerConfig: function ( layerConfig ) {

		this.loadBasicLayerConfig( layerConfig );

		if ( layerConfig !== undefined ) {

			// Load optional callback function.

			if ( layerConfig.onCeilClicked !== undefined ) {

				this.onCeilClicked = layerConfig.onCeilClicked;

			}

			// Load required anchors.

			if ( layerConfig.anchors !== undefined ) {

				this.anchors = layerConfig.anchors;

			} else {

				console.error( "\"anchors\" property is required for YoloGrid layer." );

			}

			// Load required label name list

            if ( layerConfig.classLabelList !== undefined ) {

                this.classLabelList = layerConfig.classLabelList;

            } else {

                console.error( "\"anchors\" property is required for YoloGrid layer." );

            }

            this.scoreThreshold = layerConfig.scoreThreshold;

            this.iouThreshold = layerConfig.iouThreshold;

            this.isDrawFiveBoxes = layerConfig.isDrawFiveBoxes;

			this.isNMS = layerConfig.isNMS;

		}

	},

	/**
	 * initSegregationElements() create feature maps's THREE.js Object, configure them, and add them to neuralGroup in YoloGrid.
	 *
	 * @param { JSON[] } centers, list of feature map's center (x, y, z), relative to layer
	 */

	initSegregationElements: function( centers ) {

		for (let i = 0; i < this.totalCeil; i ++ ) {

			// YoloOutputUnit is a wrapper for one grid ceil, checkout "YoloOutputUnit.js" for more information.

			let segregationHandler = new YoloOutputUnit(

				this.unitLength,
				centers[ i ],
				this.color,
				this.minOpacity

			);

			// Set layer index to YoloOutputUnit, grid ceil object can know which layer it has been positioned.

			segregationHandler.setLayerIndex( this.layerIndex );

			// Set grid ceil index.

			segregationHandler.setOutputIndex( i );

			// Store handler for grid ceil for latter use.

			this.segregationHandlers.push( segregationHandler );

			// Get actual THREE.js element and add it to layer wrapper Object.

			this.neuralGroup.add( segregationHandler.getElement() );

		}

	},

	/**
	 * disposeSegregationElements() remove feature maps from neuralGroup, clear their handlers, and dispose their THREE.js Object in YoloGrid.
	 */

	disposeSegregationElements: function() {

		for ( let i = 0; i < this.segregationHandlers.length; i ++ ) {

			// Remove grid ceil' THREE.js object from neuralGroup.

			this.neuralGroup.remove( this.segregationHandlers[ i ].getElement() );

		}

		// Clear handlers, actual objects will automatically be GC.

		this.segregationHandlers = [];

	},

	/**
	 * initAggregationElement() create layer aggregation's THREE.js Object, configure it, and add it to neuralGroup in YoloGrid.
	 */

	initAggregationElement: function() {

		// QueueAggregation Object is a wrapper for grid ceil's aggregation, checkout "QueueAggregation.js" for more information.

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
	 * disposeAggregationElement() remove aggregation from neuralGroup, clear its handler, and dispose its THREE.js Object in YoloGrid.
	 */

	disposeAggregationElement: function() {

		this.neuralGroup.remove( this.aggregationHandler.getElement() );
		this.aggregationHandler = undefined;

	},

	/**
	 * getCeilOutputValues(), generate grid ceil's value from raw yolo output.
	 *
	 * @param { int } outputIndex, grid ceil's index
	 * @returns { Array }, grid ceil value
	 */

	getCeilOutputValues: function( outputIndex ) {

		let singleOutput = [];

		if ( this.neuralValue !== undefined ) {

			singleOutput = this.neuralValue.slice( this.channelDepth * outputIndex, this.channelDepth * ( outputIndex + 1 ) );

		}

		return singleOutput;

	},

	/**
	 * Grid ceils are positioned in a square shape.
	 *
	 * @returns { Array }, positions for grid ceil element, relative to layer.
	 */

	calcOpenResultPos: function() {

		let openResultList = [];

		let initXTranslate = - 2 * ( this.widthNum - 1 ) * this.unitLength;
		let initZTranslate = - 2 * ( this.heightNum - 1 ) * this.unitLength;

		let distance = 4 * this.unitLength;

		for ( let i = 0; i < this.widthNum; i ++ ) {

			for ( let j = 0; j < this.heightNum; j ++ ) {

				openResultList.push( {

					x: initXTranslate + distance * j,
					y: 0,
					z: initZTranslate + distance * i

				} );

			}

		}

		return openResultList;

	}

} );

export { YoloGrid };