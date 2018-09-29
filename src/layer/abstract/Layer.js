/**
 * @author syt123450 / https://github.com/syt123450
 */

import { CloseButton } from "../../elements/CloseButton";
import { OpenTime, SeparateTime } from "../../utils/Constant";

/**
 * Layer, abstract layer, can not be initialized by TensorSpace user.
 * Base class for NativeLayer, MergedLayer
 *
 * @param config, user's configuration for Layer
 * @constructor
 */

function Layer( config ) {

	/**
	 * Actual THREE.js scene.
	 *
	 * @type { THREE.Scene }
	 */

	this.scene = undefined;

	/**
	 * Layer's order in model.
	 *
	 * @type { number }
	 */

	this.layerIndex = undefined;

	/**
	 * Layer's center (x, y, z) relative to model.
	 *
	 * @type { Object } {x: double, y: double, z: double}
	 */

	this.center = undefined;

	/**
	 * last layer in model relative to this layer.
	 *
	 * @type { Layer }
	 */

	this.lastLayer = undefined;

	/**
	 * Store all neural value as an array.
	 * "undefined" means no value.
	 *
	 * @type { double[] }
	 */

	this.neuralValue = undefined;

	/**
	 * Important Shape for layer.
	 * Shape length depends on layer's dimension.
	 *
	 * @type { Array }
	 */

	this.inputShape = [];
	this.outputShape = [];

	/**
	 * Elements wrapper for layer.
	 * All actual element in layer will be add to this group.
	 *
	 * @type { THREE.Object }
	 */

	this.neuralGroup = undefined;

	/**
	 * Color for layer visualization.
	 *
	 * @type { HEX }
	 */

	this.color = undefined;

	/**
	 * Store handler for layer aggregation.
	 *
	 * @type { Object }
	 */

	this.aggregationHandler = undefined;

	/**
	 * Store handler for close button.
	 *
	 * @type { Object }
	 */

	this.closeButtonHandler = undefined;

	/**
	 * Config to control whether to show close button.
	 * true -- show close button when layer is open.
	 * false -- never show close button.
	 *
	 * @type { boolean }
	 */

	this.hasCloseButton = true;

	/**
	 * User's external control for close button.
	 * Close button will multiply this size to get the final size.
	 *
	 * @type { number }
	 */

	this.closeButtonSizeRatio = 1;

	/**
	 * Minimum opacity to control layer's visualization effect.
	 *
	 * @type { double } [0, 1]
	 */

	this.minOpacity = undefined;

	/**
	 * Actual width and height in three.js scene.
	 * 1d layer and 2d layer do not have actualHeight.
	 *
	 * @type { double }
	 */

	this.actualWidth = undefined;
	this.actualHeight = undefined;

	/**
	 * Actual depth for layer aggregation.
	 *
	 * @type { double }
	 */

	this.actualDepth = undefined;

	/**
	 * Unit length, quantitatively, actualWidth = unitLength * width.
	 *
	 * If layer is not the first layer in model, value is get from last layer.
	 * this.unitLength = this.lastLayer.unitLength;
	 *
	 * If layer is the first layer in model, checkout input layer for more information.
	 * this.unitLength = this.actualWidth / this.width;
	 *
	 * @type { double }
	 */

	this.unitLength = undefined;

	/**
	 * Handler for element which is showing text.
	 *
	 * @type { Object }
	 */

	this.textElementHandler = undefined;

	/**
	 * Store handler for line group.
	 *
	 * @type { Object }
	 */

	this.lineGroupHandler = undefined;

	/**
	 * Config to control showing text in layer.
	 *
	 * @type { boolean }
	 */

	this.textSystem = undefined;

	/**
	 * Config to control showing relation line in layer.
	 *
	 * @type { boolean }
	 */

	this.relationSystem = undefined;

	/**
	 * Layer status.
	 * true -- open;
	 * false -- close.
	 *
	 * @type { boolean }
	 */

	this.isOpen = undefined;

	/**
	 * Parameters for animation time.
	 *
	 * @type { number }
	 */

	this.animationTimeRatio = 1;
	this.openTime = OpenTime;
	this.separateTime = SeparateTime;

	/**
	 * Identity whether the layer is a group for layers.
	 *
	 * @type { boolean }
	 */

	this.isGroup = false;

	/**
	 * Label to define whether layer need an "output value" from backend model (tfjs, keras, or tf).
	 * For example, YoloGrid can automatically detect the output from last layer,
	 * user do not need to add value for YoloGrid value when they are preprocessing multi-output for the model.
	 *
	 * @type { boolean }
	 */

	this.autoOutputDetect = undefined;

	// Load user's common config into layer's attribute.

	this.loadBasicLayerConfig( config );

}

Layer.prototype = {

	/**
	 * loadBasicLayerConfig() Load user's common config into layer's attribute.
	 * Called when "Layer" is initializing.
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
	 * ============
	 *
	 * Functions below are abstract method for Layer.
	 * SubClasses ( specific layers ) override these abstract method to get Layer's characters.
	 *
	 * ============
	 */

	/**
	 * init() abstract method
	 * Create actual THREE.Object in Layer, warp them into a group, and add it to THREE.js's scene.
	 *
	 * Model passes two parameters, center and actualDepth, to Layer when call init() to initialize Layer.
	 *
	 * @param { JSON } center, layer's center (x, y, z) relative to model
	 * @param { double } actualDepth, layer aggregation's depth
	 */

	init: function(center, actualDepth ) {

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
	 * handleClick() abstract method
	 * Event callback, if clickable element in this layer is clicked, execute this handle function.
	 *
	 * Override this function if layer has any clicked event.
	 *
	 * @param { THREE.Object } clickedElement, clicked element picked by model's Raycaster.
	 */

	handleClick: function( clickedElement ) {

	},

	/**
	 * handleHoverIn() abstract method
	 * Event callback, if hoverable element in this layer picked by Raycaster, execute this handle function.
	 *
	 * Override this function if layer has any hover event.
	 *
	 * @param { THREE.Object } hoveredElement, hovered element picked by model's Raycaster.
	 */

	handleHoverIn: function( hoveredElement ) {

	},

	/**
	 * handleHoverOut() abstract method
	 * Event callback, called by model if mouse hover out of this layer.
	 *
	 * Override this function if layer has some hover event.
	 */

	handleHoverOut: function() {

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

	}

};

export { Layer };