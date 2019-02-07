/**
 * @author syt123450 / https://github.com/syt123450
 * @author zchholmes / https://github.com/zchholmes
 */

import * as THREE from "three";
import { ChannelDataGenerator } from "../../utils/ChannelDataGenerator";
import { ColorUtils } from "../../utils/ColorUtils";
import { MapTransitionFactory } from "../../animation/MapTransitionTween";
import { CloseButtonRatio } from "../../utils/Constant";
import { FeatureMap } from "../../elements/FeatureMap";
import { MapAggregation } from "../../elements/MapAggregation";
import { NativeLayer } from "./NativeLayer";

/**
 * NativeLayer3d, abstract layer, should not be initialized directly.
 * Output shape of NativeLayer3d is 3 dimensional: [width, height, depth]
 * Base class for:
 *      Conv2d, GlobalPooling2d, Pooling2d,
 *      Reshape2d, UpSampling2d, Cropping2d,
 *      Activation3d, BasicLayer3d.
 *
 * @param config, user's configuration for NativeLayer3d
 * @constructor
 */

function NativeLayer3d( config ) {

	// NativeLayer3d inherits from abstract layer "NativeLayer"

	NativeLayer.call( this, config );

	/**
	 * NativeLayer3d has three output dimensions: [ width, height, depth ]
	 *
	 * @type { int }
	 */

	this.width = undefined;
	this.height = undefined;
	this.depth = undefined;

	/**
     * Handler list of feature map.
	 *
	 * @type { Array }
	 */

	this.segregationHandlers = [];

	/**
     * Feature map centers while this.isOpen === true.
	 *
	 * @type { Array }
	 */

	this.openFmCenters = [];

	/**
     * Feature map centers while this.isOpen === false.
	 *
	 * @type { Array }
	 */

	this.closeFmCenters = [];

	/**
	 * Feature map shapes while expanded
	 * "line" or "rect", default to "rect".
	 * Check "ModelConfiguration.js" for more details.
	 *
	 * @type { string }
	 */

	this.layerShape = undefined;

	/**
	 * Aggregation mode.
	 * "max" or "average", default to "average".
     * Check "ModelConfiguration.js" for more details.
	 *
	 * @type { string }
	 */

	this.aggregationStrategy = undefined;

	/**
	 * Label to define whether layer need an "output value" from ML model (tfjs, keras, or tf).
	 * False means that user need to add value for NativeLayer3d when they are preprocessing multi-output for the model.
     *
     * Config on whether to calculate the output shape automatically or not.
     * "false" means user has to provide outputShape while preprocessing ML model.
	 *
	 * @type { boolean }
	 */

	this.autoOutputDetect = false;

	this.layerDimension = 3;

}

NativeLayer3d.prototype = Object.assign( Object.create( NativeLayer.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override abstract functions of base class NativeLayer.
	 *
	 * NativeLayer3d overrides (from NativeLayer):
	 * init, updateValue, clear, handleClick, handleHoverIn, handleHoverOut
	 * calcCloseButtonSize, calcCloseButtonPos, provideRelativeElements, getBoundingWidth
	 *
	 * ============
	 */

	/**
	 * init() creates actual THREE.Object in NativeLayer3d, warp them into a group, and add it to Model context.
	 *
	 * Model passes two parameters, center and actualDepth, to NativeLayer3d when call init() to initialize NativeLayer3d.
	 *
	 * @param { JSON } center, layer's center (x, y, z) relative to model
	 * @param { double } actualDepth, layer aggregation's depth
	 */

	init: function(center, actualDepth ) {

		this.center = center;
		this.actualDepth = actualDepth;

		// Init a neuralGroup as the wrapper for all THREE.Objects in NativeLayer3d.

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set( this.center.x, this.center.y, this.center.z );

		// depth === 1 means that there is only one feature map in NativeLayer3d, no need for aggregation, open layer, or close layer.

		if ( this.depth === 1 ) {

			// Open layer and init one feature map (depth === 1) without initializing close button.

			this.isOpen = true;
			this.closeable = false;
			this.initSegregationElements( this.openFmCenters );

		} else {

			if ( this.isOpen ) {

                // Init feature maps with expanded positions.

				this.initSegregationElements( this.openFmCenters );

				// Init close button.

				this.initCloseButton();

			} else {

				// Init aggregation.

				this.initAggregationElement();

			}

		}

		// Add wrapper object to THREE.js object.

		this.context.add( this.neuralGroup );

		// Create relative line element.

		this.addLineGroup();

	},

	/**
	 * updateValue() accepts layer output value from model, updates layer visualization if required.
	 *
	 * Model passes layer's output value to layer through updateValue method.
	 *
	 * @param { double[] } value, neural output value.
	 */

	updateValue: function( value ) {

        // Provide external accessibility of layer output

		this.neuralValue = value;

		if ( this.isOpen ) {

			// If open, refresh and render feature maps.

			this.updateSegregationVis();

		} else {

			// If close, refresh and render aggregation.

			this.updateAggregationVis();

		}

	},

	/**
	 * clear() clear data and visualization in layer.
	 */

	clear: function() {

		if ( this.neuralValue !== undefined ) {

            // Clean up feature maps by handlers.

			if ( this.isOpen ) {

				for ( let i = 0; i < this.segregationHandlers.length; i ++ ) {

					this.segregationHandlers[ i ].clear();

				}

			} else {

				this.aggregationHandler.clear();

			}

			// Clean up layer data.

			this.neuralValue = undefined;

		}

	},

	/**
     * handleClick() be executed while clickable element is clicked.
	 *
	 * @param { THREE.Object } clickedElement, clicked element from Raycaster.
	 */

	handleClick: function( clickedElement ) {

		if ( clickedElement.elementType === "aggregationElement" ) {

			// If clicked aggregation element, open layer.

			this.openLayer();

		} else if ( clickedElement.elementType === "closeButton" ) {

			// If clicked close button, close layer.

			this.closeLayer();

		}

	},

	/**
     * handleHoverIn() be executed while any hoverable element is detected by Raycaster.
	 *
	 * @param { THREE.Object } hoveredElement, hovered element from Raycaster.
	 */

	handleHoverIn: function( hoveredElement ) {

		// To enable relationSystem to show relation lines.

		if ( this.relationSystem ) {

			this.lineGroupHandler.showLines( hoveredElement );

		}

        // To enable textSystem to show hint text. For example, to show feature map size.

		if ( this.textSystem ) {

			this.showText( hoveredElement );

		}

	},

	/**
     * handleHoverOut() called when mouse hover out.
	 */

	handleHoverOut: function() {

		// To enable relationSystem to hide relation lines.

		if ( this.relationSystem ) {

			this.lineGroupHandler.hideLines();

		}

		// To enable textSystem to hide hint text. For example, to hide feature map size.

		if ( this.textSystem ) {

			this.hideText();

		}

	},

	/**
	 * calcCloseButtonSize() calculate close button size.
     * Called by "initCloseButton" from "Layer"
	 *
	 * @return { number } size, calculated close button size
	 */

	calcCloseButtonSize: function() {

		// Total height when layer is open.

		let openHeight = this.actualHeight + this.openFmCenters[ this.openFmCenters.length - 1 ].z - this.openFmCenters[ 0 ].z;

		return  openHeight * CloseButtonRatio;

	},

	/**                                                                                                                                                 y        y                        /**
	 * calcCloseButtonPos() calculate close button position.
     * Called by "initCloseButton" from "Layer"
	 *
	 * @return { JSON } position, calculated close button position, relative to layer.
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
	 * provideRelativeElements() return relative elements.
	 *
     * Bridge design patten:
     * 1. "getRelativeElements" request for relative elements from previous layer;
     * 2. "provideRelativeElements" of previous layer response to request, returns relative elements.
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

                // If index attribute is set in request.

				if ( this.isOpen ) {

					// If layer is open, return feature map element with the same index.

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
	 * Functions above override abstract functions of base class "NativeLayer".
	 *
	 * ============
	 */

	/**
	 * openLayer() open NativeLayer3d, switch layer status from "close" to "open".
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
	 * closeLayer() to collapse feature maps of NativeLayer3d. Switch layer status from "open" to "close".
	 */

	closeLayer: function() {

		if ( this.isOpen ) {

			// MapTransitionFactory handles close animation, checkout "MapTransitionTween.js" for more details.

			MapTransitionFactory.closeLayer( this );

		}

	},

	/**
	 * initSegregationElements() create feature maps's THREE.js Object, configure them, and add them to neuralGroup in NativeLayer3d.
	 *
	 * @param { JSON[] } centers, list of feature map's center (x, y, z), relative to layer
	 */

	initSegregationElements: function( centers ) {

		for ( let i = 0; i < this.depth; i ++ ) {

			// FeatureMap Object is a wrapper for one feature map, checkout "FeatureMap.js" for more information.

			let segregationHandler = new FeatureMap(

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

			// Store handler for feature map for latter use.

			this.segregationHandlers.push( segregationHandler );

			// Get actual THREE.js element and add it to layer wrapper Object.

			this.neuralGroup.add( segregationHandler.getElement() );

		}

		// Update all feature maps' visualization if layer's value has already been set.

		if ( this.neuralValue !== undefined ) {

			this.updateSegregationVis();

		}

	},

	/**
	 * disposeSegregationElements() remove feature maps from neuralGroup, clear their handlers, and dispose their THREE.js Object in NativeLayer3d.
	 */

	disposeSegregationElements: function () {

		for ( let i = 0; i < this.segregationHandlers.length; i ++ ) {

			// Remove feature maps' THREE.js object from neuralGroup.

			let segregationHandler = this.segregationHandlers[ i ];
			this.neuralGroup.remove( segregationHandler.getElement() );

		}

		// Clear handlers, actual objects will automatically be GC.

		this.segregationHandlers = [];

	},

	/**
	 * initAggregationElement() create layer aggregation's THREE.js Object, configure it, and add it to neuralGroup in NativeLayer3d.
	 */

	initAggregationElement: function() {

		// MapAggregation Object is a wrapper for feature maps' aggregation, checkout "MapAggregation.js" for more information.

		let aggregationHandler = new MapAggregation(

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
	 * disposeAggregationElement() remove aggregation from neuralGroup, clear its handler, and dispose its THREE.js Object in NativeLayer3d.
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

		let featureMapSize = this.width * this.height;

		// Each feature map handler execute its own update function.

		for ( let i = 0; i < this.depth; i ++ ) {

			// Get colors to render the surface of feature maps.

			let colors = ColorUtils.getAdjustValues(

				layerOutputValues.slice( i * featureMapSize, ( i + 1 ) * featureMapSize ),
				this.minOpacity

			);

			this.segregationHandlers[ i ].updateVis( colors );

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

	},

	/**
	 * ============
	 *
	 * Functions below are abstract method for NativeLayer1d.
	 * SubClasses ( specific layers ) override these abstract method to get NativeLayer3d's characters.
	 *
	 * ============
	 */

	/**
	 * loadModelConfig() abstract method
	 * Load model's configuration into layer object.
	 *
	 * Override this function if there are some specific model configurations for layer.
	 *
	 * @param { JSON } modelConfig, default and user's configuration for model
	 */

	loadModelConfig: function( modelConfig ) {

	},

	/**
	 * assemble() abstract method
	 * Configure layer's index in model, calculate the shape and parameters based on previous layer.
	 *
	 * Override this function to get information from previous layer
	 *
	 * @param { int } layerIndex, this layer's order in model
	 */

	assemble: function( layerIndex, layerLevel ) {

	},

	/**
	 * getRelativeElements() abstract method
	 * Get relative element in last layer for relative lines based on given hovered element.
	 *
	 * Override this function to define relative element from previous layer
	 *
	 * Use bridge design patten:
	 * 1. "getRelativeElements" send request to previous layer for relative elements;
	 * 2. Previous layer's "provideRelativeElements" receives request, return relative elements.
	 *
	 * @param { THREE.Object } selectedElement, hovered element detected by THREE's Raycaster
	 * @return { THREE.Object[] } relativeElements
	 */

	getRelativeElements: function( selectedElement ) {

		return [];

	}

} );

export { NativeLayer3d };
