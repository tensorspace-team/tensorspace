/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergedLineGroup } from "../../elements/MergedLineGroup";
import { Layer } from "./Layer";

/**
 * MergedLayer, abstract layer, can not be initialized by TensorSpace user.
 * Base class for MergedLayer1d, MergedLayer2d, MergedLayer3d.
 * MergedLayer add merged line group character into "Layer".
 *
 * @param config, user's configuration for MergedLayer.
 * @constructor
 */

function MergedLayer( config ) {

	// NativeLayer inherits from abstract layer "Layer"

	Layer.call( this, config.userConfig );

	/**
	 * Store handler for line group.
	 *
	 * @type { Object }
	 */

	this.lineGroupHandler = undefined;

	/**
	 * Operator for merge function.
	 * Seven kinds of merge function: add, average, concatenate, dot, maximum, multiply, subtract.
	 *
	 * @type { string }
	 */

	this.operator = undefined;

	/**
	 * Identity whether the layer is merged layer.
	 * The different between native layer and merge layer is that the the merged layer's "isMerged" attribute is true.
	 *
	 * @type { boolean }
	 */

	this.isMerged = true;

	/**
	 * Elements participle in merge function.
	 *
	 * @type { Array }
	 */

	this.mergedElements = [];

	/**
	 * layerType will be set based on operation strategy.
	 * For example: Add3d, Subtract1d, Maximum2d
	 *
	 * @type { String }
	 */

	this.layerType = undefined;

}

MergedLayer.prototype = Object.assign( Object.create( Layer.prototype ), {

	/**
	 * addLineGroup() add line merged group element to layer, store its handler.
	 */

	addLineGroup: function() {

		this.lineGroupHandler = new MergedLineGroup(

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

	init: function( center, actualDepth ) {

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
	 * ============
	 *
	 * As native layer add basic line group element to layer,
	 * the inherited layer need to implement two more abstract class than directly implement "Layer",
	 * "getRelativeElements" and "provideRelativeElements" to enable line system.
	 *
	 * ============
	 */

	/**
	 * getRelativeElements() abstract method
	 * Get relative element in last layer for relative lines based on given hovered element.
	 * Straight elements is used to draw straight line, curve elements is used to draw Bezier curves.
	 *
	 * Override this function to define relative element from previous layer.
	 *
	 * Use bridge design patten:
	 * 1. "getRelativeElements" send request to previous layer for relative elements;
	 * 2. Previous layer's "provideRelativeElements" receives request, return relative elements.
	 *
	 * @param { THREE.Object } selectedElement, hovered element detected by THREE's Raycaster
	 * @return { Object } { straight: THREE.Object[], curve: THREE.Object[] }
	 */

	getRelativeElements: function( selectedElement ) {

		return {

			straight: [],
			curve: []

		};

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

	}

} );

export { MergedLayer };