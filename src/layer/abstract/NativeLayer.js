import { Layer } from "./Layer";
import { BasicLineGroup } from "../../elements/BasicLineGroup";

function NativeLayer(config) {

	Layer.call(this, config);

	/**
	 * Store handler for line group.
	 *
	 * @type { Object }
	 */

	this.lineGroupHandler = undefined;

	/**
	 * Identity whether the layer is merged layer.
	 *
	 * @type {boolean}
	 */

	this.isMerged = false;

}

NativeLayer.prototype = Object.assign( Object.create( Layer.prototype ), {

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


} );

export { NativeLayer };