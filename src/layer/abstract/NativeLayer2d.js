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
 * @returns NativeLayer2d layer object
 */

function NativeLayer2d(config ) {

	// NativeLayer2d inherits from abstract layer "NativeLayer".

	NativeLayer.call( this, config );

	/**
	 * NativeLayer1d has one output dimensions: [ width, depth ].
	 *
	 * @type { int }
	 */

	this.width = undefined;
	this.depth = undefined;

	/**
	 * queue's handlers list
	 *
	 * @type { Array }
	 */

	this.queueHandlers = [];

	/**
	 * queue's centers when layer is closed.
	 *
	 * @type { Array }
	 */

	this.closeCenterList = [];

	/**
	 * queue's centers when layer is totally open.
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
	 * Functions below override base class Layer's abstract method
	 *
	 * NativeLayer2d overrides Layer's function:
	 * init, updateValue, clear, handleClick, handleHoverIn, handleHoverOut, provideRelativeElements,
	 * calcCloseButtonSize, calcCloseButtonPos
	 *
	 * ============
	 */

	init: function( center, actualDepth ) {

		this.center = center;
		this.actualDepth = actualDepth;

		// Init a neuralGroup as the wrapper for all THREE.Object in NativeLayer2d.

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set( this.center.x, this.center.y, this.center.z );

		// depth === 1 means that there is only one queue in NativeLayer2d, no need for aggregation, open layer, or close layer.

		if ( this.depth === 1 ) {

			// Open layer and init one queue (depth === 1) without initializing close button.

			this.isOpen = true;
			this.initSegregationElements( this.openCenterList );

		} else {

			if ( this.isOpen ) {

				// Init all queues and display them to totally opened positions.

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

		if ( this.relationSystem !== undefined && this.relationSystem ) {

			this.lineGroupHandler.initLineGroup( hoveredElement );

		}

		// If textSystem is enabled, show hint text, for example, show queue length.

		if ( this.textSystem !== undefined && this.textSystem ) {

			this.showText( hoveredElement );

		}
	},

	/**
	 * handleHoverOut() called by model if mouse hover out of this layer.
	 */

	handleHoverOut: function() {

		// If relationSystem is enabled, hide relation lines.

		if ( this.relationSystem !== undefined && this.relationSystem ) {

			this.lineGroupHandler.disposeLineGroup();

		}

		// If textSystem is enabled, hide hint text, for example, hide queue length.

		if ( this.textSystem !== undefined && this.textSystem ) {

			this.hideText();

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

		if ( request.all !== undefined && request.all ) {

			// When "all" attribute in request is true, return all elements displayed in this layer.

			if ( this.isOpen ) {

				for ( let i = 0; i < this.queueHandlers.length; i++ ) {

					relativeElements.push( this.queueHandlers[ i ].getElement() );

				}

			} else {

				relativeElements.push( this.aggregationHandler.getElement() );

			}

		} else {

			if ( request.index !== undefined ) {

				if ( this.isOpen ) {

					// If index attribute is set in request, and layer is open, return queue element which has the same index.

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
	 * ============
	 *
	 * Functions above override base class Layer's abstract method
	 *
	 * ============
	 */

	openLayer: function() {

		if ( !this.isOpen ) {

			QueueGroupTweenFactory.openLayer( this );

			this.isOpen = true;

		}

	},

	closeLayer: function() {

		if ( this.isOpen ) {

			QueueGroupTweenFactory.closeLayer( this );

			this.isOpen = false;

		}

	},

	initSegregationElements: function( centers ) {

		this.queueHandlers = [];

		for ( let i = 0; i < this.depth; i++ ) {

			let queueHandler = new GridLine(

				this.width,
				this.unitLength,
				centers[ i ],
				this.color,
				this.minOpacity

			);

			queueHandler.setLayerIndex( this.layerIndex );
			queueHandler.setGridIndex( i );

			this.queueHandlers.push( queueHandler );
			this.neuralGroup.add( queueHandler.getElement() );

		}

		if ( this.neuralValue !== undefined ) {

			this.updateSegregationVis();

		}

	},

	disposeSegregationElements: function() {

		for ( let i = 0; i < this.depth; i++ ) {

			this.neuralGroup.remove( this.queueHandlers[ i ].getElement() );

		}

		this.queueHandlers = [];

	},

	initAggregationElement: function() {

		let aggregationHandler = new GridAggregation(

			this.width,
			this.unitLength,
			this.color,
			this.minOpacity

		);
		aggregationHandler.setLayerIndex( this.layerIndex );

		this.aggregationHandler = aggregationHandler;
		this.neuralGroup.add( this.aggregationHandler.getElement() );

		if ( this.neuralValue !== undefined ) {

			this.updateAggregationVis();

		}

	},

	disposeAggregationElement: function() {

		this.neuralGroup.remove( this.aggregationHandler.getElement() );
		this.aggregationHandler = undefined;

	},

	updateAggregationVis: function() {

		let aggregationUpdateValue = ChannelDataGenerator.generateAggregationData(

			this.neuralValue,
			this.depth,
			this.aggregationStrategy

		);

		let colors = ColorUtils.getAdjustValues( aggregationUpdateValue, this.minOpacity );

		this.aggregationHandler.updateVis( colors );

	},

	updateSegregationVis: function() {

		let layerOutputValues = ChannelDataGenerator.generateChannelData( this.neuralValue, this.depth );

		let colors = ColorUtils.getAdjustValues( layerOutputValues, this.minOpacity );

		let featureMapSize = this.width;

		for ( let i = 0; i < this.depth; i++ ) {

			this.queueHandlers[ i ].updateVis( colors.slice( i * featureMapSize, ( i + 1 ) * featureMapSize ) );

		}

	},

	showText: function( element ) {

		if ( element.elementType === "gridLine" ) {

			let gridIndex = element.gridIndex;

			this.queueHandlers[ gridIndex ].showText();
			this.textElementHandler = this.queueHandlers[ gridIndex ];

		}

	},

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
	 * loadLayerConfig() abstract method
	 * Load layer's configuration into layer which extends NativeLayer2d.
	 * The configuration load in this function sometimes has not been loaded in loadBasicLayerConfig.
	 *
	 * Override this function if there are some specific configuration for layer which extends NativeLayer2d.
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

export { NativeLayer2d };