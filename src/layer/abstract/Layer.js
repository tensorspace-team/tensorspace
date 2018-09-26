/**
 * @author syt123450 / https://github.com/syt123450
 */

import { CloseButton } from "../../elements/CloseButton";
import { OpenTime, SeparateTime } from "../../utils/Constant";
import { BasicLineGroup } from "../../elements/BasicLineGroup";

/**
 * Layer, abstract layer, can not be initialized by TensorSpace user.
 * Base class for Layer1d, Layer2d, Layer3d, input1d, input2d, input3d, output1d, YoloBox, YoloChannel
 *
 * @param config, user's configuration for Layer
 * @returns abstract Layer object
 */

function Layer( config ) {

	// Actual THREE.js scene.

	this.scene = undefined;

	// Layer's order in model.

	this.layerIndex = undefined;

	// Layer's center (x, y, z) relative to model.

	this.center = undefined;

	// last layer in model relative to this layer.

	this.lastLayer = undefined;

	// Store all neural value as an array, "undefined" means no value.

	this.neuralValue = undefined;

	// Important Shape for layer.

	this.inputShape = [];
	this.outputShape = [];

	// Elements wrapper for layer.

	this.neuralGroup = undefined;

	// Color for layer visualization.

	this.color = undefined;

	// Store handler for layer aggregation.

	this.aggregationHandler = undefined;

	// Store handler for close button.

	this.closeButtonHandler = undefined;

	// Config to control whether to show close button, true -- show when layer is open, false -- never show close button.

	this.hasCloseButton = true;

	// User's external control for close button, close button will multiply this size to get the final size.

	this.closeButtonSizeRatio = 1;

	// Minimum opacity to control layer's visualization effect.

	this.minOpacity = undefined;

	// Actual width and height in three.js scene.

	this.actualWidth = undefined;
	this.actualHeight = undefined;

	// Actual depth for layer aggregation.

	this.actualDepth = undefined;

	// Unit length, get from last layer, actualWidth = unitLength * width.

	this.unitLength = undefined;

	// Handler for element which is showing text.

	this.textElementHandler = undefined;

	// Store handler for line group.

	this.lineGroupHandler = undefined;

	// Config to control showing text in layer.

	this.textSystem = undefined;

	// Config to control showing relation line in layer.

	this.relationSystem = undefined;

	// Layer status, true -- open, false -- close.

	this.isOpen = undefined;

	// Parameters for animation time.

	this.animationTimeRatio = 1;
	this.openTime = OpenTime;
	this.separateTime = SeparateTime;

	// Identity whether the layer is merged layer.

	this.isMerged = false;

	// Identity whether the layer is a group for layers.

	this.isGroup = false;

	// Load user's common config into layer's attribute.

	this.loadBasicLayerConfig( config );

}

Layer.prototype = {

	/**
	 * addLineGroup() add line group element to layer, store its handler.
	 */

	addLineGroup: function() {

		this.lineGroupHandler = new BasicLineGroup(

			this,
			this.scene,
			this.neuralGroup,
			this.color,
			this.minOpacity

		);

	},

	/**
	 * loadBasicLayerConfig() Load user's common config into layer's attribute. Called by loadLayerConfig() in inherit layer.
	 *
	 * @param { JSON } config, user's layer configuration.
	 */

	loadBasicLayerConfig: function( config ) {

		if ( config !== undefined ) {

			if ( config.initStatus !== undefined ) {

				if ( config.initStatus === "open" ) {

					this.isOpen = true;

				} else if ( config.initStatus === "close" ) {

					this.isOpen = false;

				} else {

					console.error( "\"initStatus\" property do not support for " + config.initStatus + ", use \"open\" or \"close\" instead." );

				}

			}

			if ( config.color !== undefined ) {

				this.color = config.color;

			}

			if ( config.name !== undefined ) {

				this.name = config.name;

			}

			if ( config.closeButton !== undefined ) {

				if ( config.closeButton.display !== undefined ) {

					this.hasCloseButton = config.closeButton.display;

				}

				if ( config.closeButton.ratio !== undefined ) {

					this.closeButtonSizeRatio = config.closeButton.ratio;

				}

			}

			if ( config.animationTimeRatio !== undefined ) {

				if ( config.animationTimeRatio > 0 ) {

					this.animationTimeRatio = config.animationTimeRatio;

				}

				this.openTime *= this.animationTimeRatio;
				this.separateTime *= this.animationTimeRatio;

			}

			if ( config.minOpacity !== undefined ) {

				this.minOpacity = config.minOpacity;

			}

		}

	},

	/**
	 * loadBasicLayerConfig() Load model's common config into layer's attribute. Called by model before "assemble".
	 *
	 * @param { JSON } modelConfig, model's configuration, including model's default configuration and user's model configuration.
	 */

	loadBasicModelConfig: function( modelConfig ) {

		if ( this.isOpen === undefined ) {

			this.isOpen = modelConfig.layerInitStatus;

		}

		if ( this.relationSystem === undefined ) {

			this.relationSystem = modelConfig.relationSystem;

		}

		if ( this.textSystem === undefined ) {

			this.textSystem = modelConfig.textSystem;

		}

		if ( this.minOpacity === undefined ) {

			this.minOpacity = modelConfig.minOpacity;

		}

		this.openTime *= modelConfig.animationTimeRatio;
		this.separateTime *= modelConfig.animationTimeRatio;

	},

	/**
	 * setLastLayer(), store last layer's reference.
	 *
	 * @param { Layer } layer, reference of last layer which positioned before this layer in model.
	 */

	setLastLayer: function( layer ) {

		this.lastLayer = layer;

	},

	/**
	 * setEnvironment(), store THREE.js scene and model
	 *
	 * @param { THREE.Object } scene, THREE.js scene, can add elements into it.
	 * @param { Model } model, model object this layer will be added to.
	 */

	setEnvironment: function( scene, model ) {

		this.scene = scene;
		this.model = model;

	},

	/**
	 * initCloseButton() init close button, add it to layer's neural group, and store close button handler.
	 */

	initCloseButton: function() {

		if ( this.hasCloseButton ) {

			// Get close button metrics.

			let closeButtonPos = this.calcCloseButtonPos();
			let closeButtonSize = this.closeButtonSizeRatio * this.calcCloseButtonSize();

			// Create close button element.

			let closeButtonHandler = new CloseButton(

				closeButtonSize,
				this.unitLength,
				closeButtonPos,
				this.color,
				this.minOpacity

			);

			// Set layer information to close button.

			closeButtonHandler.setLayerIndex( this.layerIndex );
			closeButtonHandler.setPositionedLayer( this.layerType );

			// Store close button handler and add actual Close button element to neuralGroup.

			this.closeButtonHandler = closeButtonHandler;
			this.neuralGroup.add( this.closeButtonHandler.getElement() );

		}

	},

	/**
	 * disposeCloseButton() remove close button element, clear handler.
	 */

	disposeCloseButton: function() {

		this.neuralGroup.remove( this.closeButtonHandler.getElement() );
		this.closeButtonHandler = undefined;

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
	 * @param { THREE.Object } selectedElement, hovered element detected by THREE's Raycaster
	 * @return { THREE.Object[] } relativeElements
	 */

	getRelativeElements: function( selectedElement ) {

		return [];

	},

	/**
	 * provideRelativeElements() abstract method
	 * Return relative elements.
	 *
	 * Override this function to return relative elements based on request information.
	 *
	 * Use bridge design patten:
	 * 1. "getRelativeElements" send request to previous layer for relative elements;
	 * 2. Previous layer's "provideRelativeElements" receives request, return relative elements.
	 *
	 * @param { JSON } request, parameter configured by request layer
	 * @return { Object } { isOpen: boolean, elementList: THREE.Object[] }
	 */

	provideRelativeElements: function( request ) {

		return {

			isOpen: this.isOpen,
			elementList: []

		};

	},

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

	assemble: function( layerIndex ) {

	},

	/**
	 * handleClick() abstract method
	 * If clickable element in this layer is clicked, execute this handle function.
	 *
	 * Override this function if layer has any clicked event.
	 *
	 * @param { THREE.Object } clickedElement, clicked element picked by model's Raycaster.
	 */

	handleClick: function( clickedElement ) {

	},

	/**
	 * handleHoverIn() abstract method
	 * If hoverable element in this layer picked by Raycaster, execute this handle function.
	 *
	 * Override this function if layer has any hover event.
	 *
	 * @param { THREE.Object } hoveredElement, hovered element picked by model's Raycaster.
	 */

	handleHoverIn: function( hoveredElement ) {

	},

	/**
	 * handleHoverOut() abstract method
	 * Called by model if mouse hover out of this layer.
	 *
	 * Override this function if layer has some hover event.
	 */

	handleHoverOut: function() {

	},

	/**
	 * clear() abstract method
	 * Clear data and visualization in layer.
	 *
	 * Override this function to implement layer's own clear function.
	 */

	clear: function() {

	},

	/**
	 * calcCloseButtonSize() abstract method
	 * Called by initCloseButton function in abstract class "Layer", get close button size.
	 *
	 * Override this function to implement layer's own button size calculation strategy.
	 *
	 * @return { number } size, close button size
	 */

	calcCloseButtonSize: function() {

		return  1;

	},

	/**                                                                                                                                                 y        y                        /**
	 * calcCloseButtonPos() abstract method
	 * Called by initCloseButton function in abstract class "Layer", get close button position.
	 *
	 * Override this function to implement layer's own button position calculation strategy.
	 *
	 * @return { Object } close button position, { x: double, y: double, z: double }, relative to layer.
	 */

	calcCloseButtonPos: function() {

		return {
			x: 0,
			y: 0,
			z: 0
		};

	},

	/**
	 * updateValue() abstract method
	 * Accept layer output value from model, update layer visualization if required.
	 *
	 * Model passes layer's output value to layer through updateValue method.
	 *
	 * Override this function to implement layer's own value update strategy.
	 *
	 * @param { double[] } value, neural output value.
	 */

	updateValue: function( value ) {

	}

};

export { Layer };