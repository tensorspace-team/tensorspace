/**
 * @author syt123450 / https://github.com/syt123450
 * @author zchholmes / https://github.com/zchholmes
 */

import { CloseButton } from "../../elements/CloseButton";
import { LayerTranslateFactory } from "../../animation/LayerTranslateTween";

/**
 * Layer, abstract layer, should not be initialized directly.
 * Base class for NativeLayer, MergedLayer
 *
 * @param config, customized configuration for Layer
 * @constructor
 */

function Layer( config ) {

	/**
	 * model object of THREE.js.
	 *
	 * @type { THREE.Object }
	 */

	this.context = undefined;

	/**
	 * Order index number of the layer in model.
	 *
	 * @type { number }
	 */

	this.layerIndex = undefined;

	/**
	 * The center (x, y, z) coordinates of the layer, related to the model.
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
     * Important property
     * Shape describes input and output dimensions of the layer.
	 *
	 * @type { Array }
	 */

	this.inputShape = [];
	this.outputShape = [];

	/**
     * Wrapper object represented the layer object in scene.
     * All Three.js objects within the layer should be added to neuralGroup.
	 *
	 * @type { THREE.Object }
	 */

	this.neuralGroup = undefined;

	/**
     * Color of the layer for visualization.
	 *
	 * @type { HEX }
	 */

	this.color = undefined;

	/**
	 * Handler for layer aggregation.
	 *
	 * @type { Object }
	 */

	this.aggregationHandler = undefined;

	/**
	 * Handler for close button.
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
     * Config of close button size.
     * Close button size is multiplied by the ratio number
	 *
	 * @type { number }
	 */

	this.closeButtonSizeRatio = 1;

	/**
	 * Minimum opacity of the layer.
	 *
	 * @type { double } [0, 1]
	 */

	this.minOpacity = undefined;

	/**
	 * Width and height in Three.js scene.
     * actualWidth = unitLength * width
	 * (1d layer and 2d layer do not have actualHeight).
	 *
	 * @type { double }
	 */

	this.actualWidth = undefined;
	this.actualHeight = undefined;

	/**
	 * Depth of the layer object in the scene.
	 *
	 * @type { double }
	 */

	this.actualDepth = undefined;

	/**
	 * Unit length used to render layer object.
	 *
	 * If the layer is not the first layer in model, value is from last layer.
	 * this.unitLength = this.lastLayer.unitLength;
	 *
	 * If layer is the first layer in model, checkout input layer for more information.
	 * this.unitLength = this.actualWidth / this.width;
	 *
	 * @type { double }
	 */

	this.unitLength = undefined;

	/**
	 * Handler for object which is showing text.
	 *
	 * @type { Object }
	 */

	this.textElementHandler = undefined;

	/**
	 * Handler for line group.
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
	 * Config of whether show relation line or not.
     * true -- show relation lines.
     * false -- do not show relation lines.
	 *
	 * @type { boolean }
	 */

	this.relationSystem = undefined;

	/**
	 * Layer status on whether the layer is expanded or collapsed.
	 * true -- expanded;
	 * false -- collapsed.
	 *
	 * @type { boolean }
	 */

	this.isOpen = undefined;

	/**
     * Config on the speed of layer expansion and collapsion.
	 *
	 * @type { number }
	 */
	
	this.openTime = undefined;
	this.separateTime = undefined;

	/**
     * Whether the layer is a group or not.
	 *
	 * @type { boolean }
	 */

	this.isGroup = false;

	/**
	 * Label to define whether layer need an "output value" from backend model (tfjs, keras, or tf).
	 * For example, YoloGrid can automatically detect the output from last layer,
	 * users do not need to add value for YoloGrid value when they are preprocessing multi-output for the model.
	 *
	 * @type { boolean }
	 */

	this.autoOutputDetect = undefined;

	/**
	 * name of the layer.
	 *
	 * @type { String }
	 */

	this.name = undefined;

	/**
	 * Type of layer, each layer class has a specific layerType.
	 * For example, "Conv2d", "Pooling2d".
	 *
	 * @type { String }
	 */

	this.layerType = undefined;

	/**
	 * The place for Layer in model, measured by y-axis in 3d scene.
	 * For Sequential model:
	 * 		the "layerLevel" will be the same as "layerIndex".
	 * 		the layerLevel will be unique for all layers.
	 * For Functional model:
	 * 		the "layerLevel" may be the same for several layers.
	 * 		these layers has different "layerIndex".
	 *
	 * @type { Int }
	 */

	this.layerLevel = undefined;

	/**
	 * True - layer has closeLayer() method, and this method can be called.
	 * False - layer do not has closeLayer() method, or closeLayer() can not be called.
	 * Default to True.
	 *
	 * @type { boolean }
	 */

	this.closeable = true;

	/**
	 * Layer's initial status, only take effect when layer is closeable.
	 * For example, for input1d layer this attribute will not take effect.
	 *
	 * "open": show all feature maps, or neural lines, or grid lines.
	 * "close": show aggregation when layer is initialized
	 *
	 * @type { String }
	 */

	this.initStatus = "close";

	/**
	 * Whether user directly define the layer shape.
	 * Set "true" if Layer's shape is predefined by user.
	 *
	 * @type { boolean }
	 */

	this.isShapePredefined = false;
	
	this.isEmissive = false;

	// Load layer config.

	this.loadBasicLayerConfig( config );

}

Layer.prototype = {

	/**
	 * loadBasicLayerConfig() Load layer config.
     * execute while initialization
	 *
	 * @param { JSON } config, layer config.
	 */

	loadBasicLayerConfig: function( config ) {

		if ( config !== undefined ) {

			if ( config.initStatus !== undefined ) {

				if ( config.initStatus === "open" ) {

					this.initStatus = "open";
					this.isOpen = true;

				} else if ( config.initStatus === "close" ) {

					this.initStatus = "close";
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

			if ( config.animeTime !== undefined ) {

				if ( config.animeTime > 0 ) {

					this.animeTime = config.animeTime;
                    this.openTime *= this.animeTime;
                    this.separateTime *= this.animeTime / 2;

				}

			}

			if ( config.minOpacity !== undefined ) {

				this.minOpacity = config.minOpacity;

			}

		}

	},

	/**
	 * loadBasicLayerConfig() Load model config for layers. Model execute before "assemble".
	 *
	 * @param { JSON } modelConfig, model config, including default and customized model config.
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
		
		if ( this.openTime === undefined ) {
            
            this.openTime = modelConfig.animeTime;
            this.separateTime = modelConfig.animeTime / 2;
			
		}
		
		if ( modelConfig.hasCloseButton !== undefined ) {
			
			this.hasCloseButton = modelConfig.hasCloseButton;
			
		}

	},

	/**
	 * setLastLayer(), hold reference for last layer.
	 *
	 * @param { Layer } layer, reference of last layer which positioned before current layer in model.
	 */

	setLastLayer: function( layer ) {

		this.lastLayer = layer;

	},

	/**
	 * setEnvironment(), hold ref of THREE.js scene and model
	 *
	 * @param { THREE.Object } context, THREE.js object.
	 * @param { Model } model, the model object current layer be added.
	 */

	setEnvironment: function( context, model ) {

		this.context = context;
		this.model = model;

	},

	/**
	 * initCloseButton() init close button, add to neural group, and store close button handler.
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
	 * translateLayer(), translate layer to a target center.
	 *
	 * @param targetCenter, target center the layer is moving to
	 * @param translateTime, animation time
	 */

	translateLayer: function( targetCenter, translateTime ) {

		// LayerTranslateFactory handles actual translate animation, checkout "LayerTranslateTween.js" for more information.

		LayerTranslateFactory.translate( this, targetCenter, translateTime );

	},

	/**
	 * reset(), reset layer to init status.
	 *
	 * Called when model's reset() method is called.
	 */

	reset: function() {

		this.clear();

		if ( this.closeable && this.initStatus === "close" ) {

			this.closeLayer();

		}

		if ( !this.isOpen && this.initStatus === "open" ) {

			this.openLayer();

		}

	},
	
	setPositionMetrics: function( layerIndex, layerLevel ) {
		
		this.layerIndex = layerIndex;
		this.layerLevel = layerLevel;
		
	},

	/**
	 * ============
	 *
	 * Functions below are abstract method for Layer.
	 * SubClasses ( specific layers ) override these abstract methods.
	 *
	 * ============
	 */

	/**
	 * init() abstract method
	 * Initialize THREE.Object in Layer, warp them into a group, and add to Model context.
	 *
	 * Model passes two parameters, center and actualDepth.
	 *
	 * @param { JSON } center, layer's center (x, y, z) relative to model
	 * @param { double } actualDepth, layer aggregation's depth
	 */

	init: function(center, actualDepth ) {

	},

	/**
	 * assemble() abstract method
	 * calculate the shape and parameters based on previous layer or pre-defined shape.
	 *
	 * Override this function to get information from previous layer
	 */

	assemble: function() {

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

	},

	/**
	 * getBoundingWidth(), abstract method
	 *
	 * Override this function to provide layer's bounding width based on layer's status.
	 *
	 * @return { number }
	 */

	getBoundingWidth: function() {

		return 100;

	},
	
	emissive: function() {
	
	},
	
	darken: function() {
	
	}

};

export { Layer };
