/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergedLayer } from "./MergedLayer";
import { QueueGroupTweenFactory } from "../../animation/QueueGroupTransitionTween";
import { ChannelDataGenerator } from "../../utils/ChannelDataGenerator";
import { ColorUtils } from "../../utils/ColorUtils";
import { GridAggregation } from "../../elements/GridAggregation";
import { GridLine } from "../../elements/GridLine";
import { StrategyFactory } from "../../merge/factory/StrategyFactory";
import { QueueCenterGenerator } from "../../utils/QueueCenterGenerator";

function MergedLayer2d( config ) {

	MergedLayer.call( this, config );

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

	/**
	 * Label to define whether layer need an "output value" from backend model (tfjs, keras, or tf).
	 * False means that user need to add value for NativeLayer2d when they are preprocessing multi-output for the model.
	 *
	 * @type { boolean }
	 */

	this.autoOutputDetect = false;

	this.layerDimension = 2;

	this.initStrategy( config );

}

MergedLayer2d.prototype = Object.assign( Object.create( MergedLayer.prototype ), {

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

	assemble: function( layerIndex ) {

		this.layerIndex = layerIndex;

		// Validate whether user's input merged elements can be merged in this kind of merge operation.

		if( !this.operationStrategy.validate() ) {

			console.error( "Input shape is not valid for " + this.operator + " merge function." );

		}

		// Get output shape after merge operation.

		this.outputShape = this.operationStrategy.getOutputShape();

		this.inputShape = this.outputShape;

		// The layer's shape is based on output shape.

		this.width = this.outputShape[ 0 ];
		this.depth = this.outputShape[ 1 ];

		// Unit length is the same as merged elements, use unit length to calculate actualWidth and actualHeight which are used to create three.js object.

		this.unitLength = this.mergedElements[ 0 ].unitLength;
		this.actualWidth = this.unitLength * this.width;

		// Init close grid line centers.

		for ( let i = 0; i < this.depth; i ++ ) {

			let center = {

				x: 0,
				y: 0,
				z: 0

			};

			this.closeCenterList.push( center );

		}

		this.openCenterList = QueueCenterGenerator.getCenterList( this.actualWidth, this.depth );

	},

	updateValue: function ( value ) {

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

	handleClick: function( clickedElement ) {

		if ( clickedElement.elementType === "aggregationElement" ) {

			// If aggregation element is clicked, open layer.

			this.openLayer();

		} else if ( clickedElement.elementType === "closeButton" ) {

			// If close button is clicked, close layer.

			this.closeLayer();

		}

	},

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

	calcCloseButtonSize: function() {

		return 1.1 * this.unitLength;

	},

	calcCloseButtonPos: function() {

		return {

			x: - this.actualWidth / 2 - 30,
			y: 0,
			z: 0

		};

	},

	getRelativeElements: function( selectedElement ) {

		// As different merge functions have different relative element strategies, call concrete strategy to get relative elements.

		return this.operationStrategy.getRelativeElements( selectedElement );

	},

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

	getBoundingWidth: function() {

		if ( ( this.isOpen && !this.isWaitClose ) || this.isWaitOpen ) {

			return this.actualWidth / 2 - this.calcCloseButtonPos().x + this.calcCloseButtonSize();

		} else {

			return this.actualWidth;

		}

	},

	/**
	 * ============
	 *
	 * Functions above override base class MergedLayer's abstract method.
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

			this.operationStrategy = StrategyFactory.getOperationStrategy( this.operator, 2, this.mergedElements );

			// set layer context for operation strategy

			this.operationStrategy.setLayerContext( this );

			// Set layerType based on operation type.

			this.layerType = this.operationStrategy.strategyType;

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

		let gridLineLength = this.width;

		// Each grid line handler execute its own update function.

		for ( let i = 0; i < this.depth; i ++ ) {

			// Get colors to render the surface of grid lines.

			let colors = ColorUtils.getAdjustValues(

				layerOutputValues.slice( i * gridLineLength, ( i + 1 ) * gridLineLength ),
				this.minOpacity

			);

			this.queueHandlers[ i ].updateVis( colors );

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

	}

} );

export { MergedLayer2d };