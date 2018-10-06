/**
 * @author syt123450 / https://github.com/syt123450
 * @author zchholmes / https://github.com/zchholmes
 */

import { Layer } from "./Layer";
import { BasicLineGroup } from "../../elements/BasicLineGroup";

/**
 * NativeLayer, abstract layer, should not be initialized directly.
 * NativeLayer inherits from "Layer".
 * NativeLayer extends "Layer" to include basic line group.
 * Base class for:
 *      NativeLayer1d, NativeLayer2d, NativeLayer3d,
 *      Input1d, Input2d, Input3d,
 *      Output1d, Output2d,
 *      OutputDetection, YoloGrid.
 *
 * @param config, user's configuration for NativeLayer.
 * @constructor
 */

function NativeLayer( config ) {

	// NativeLayer inherits from abstract layer "Layer"

	Layer.call( this, config );

	/**
	 * Hold handler for line group.
	 *
	 * @type { Object }
	 */

	this.lineGroupHandler = undefined;

	/**
	 * Identify whether layer is a merged layer or not.
     * If it's a NativeLayer, "isMerged" is always false.
	 *
	 * @type {boolean}
	 */

	this.isMerged = false;

}

NativeLayer.prototype = Object.assign( Object.create( Layer.prototype ), {

	/**
	 * addLineGroup() adds basic line group element to layer and holds the handler.
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
	 * Functions below are abstract for Layer.
	 * SubClasses ( specific layers ) override these abstract functions to get Layer's features.
	 *
	 * ============
	 */

	/**
	 * init() abstract method
	 * Create actual THREE.Object, wrap them into a group, and add to THREE.js scene.
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
	 * Configure layer index in the model
     * Calculate the shape and parameters based on previous layer.
	 *
	 * Override this function to get information from previous layer.
	 *
	 * @param { int } layerIndex, this layer's order in model
	 */

	assemble: function( layerIndex ) {

	},

	/**
	 * updateValue() abstract method
	 * Accept layer output value from model, update layer visualization if necessary.
	 *
	 * Model passes layer output value to layer through updateValue method.
	 *
     * Override for customized layer update strategy.
	 *
	 * @param { double[] } value, neural output value.
	 */

	updateValue: function( value ) {

	},

	/**
	 * clear() abstract method
	 * Clear data and visualization in layer.
	 *
     * Override for customized layer clean up.
	 */

	clear: function() {

	},

	/**
	 * handleClick() abstract method
     * Event callback, be executed if any clickable element is clicked.
	 *
     * Override for any clicked event required.
	 *
	 * @param { THREE.Object } clickedElement, clicked element from Raycaster.
	 */

	handleClick: function( clickedElement ) {

	},

	/**
	 * handleHoverIn() abstract method
     * Event callback, be executed if any hoverable element is detected by Raycaster.
	 *
	 * Override for any hover event required.
	 *
	 * @param { THREE.Object } hoveredElement, hovered element from Raycaster.
	 */

	handleHoverIn: function( hoveredElement ) {

	},

	/**
	 * handleHoverOut() abstract method.
     * Event callback, called when mouse hover out.
	 *
     * Override for any hover out event required.
	 */

	handleHoverOut: function() {

	},

	/**
	 * loadModelConfig() abstract method.
     * Load model configurations to layer object.
	 *
     * Override for any customized model configurations for layer.
	 *
	 * @param { JSON } modelConfig, default and user's configuration for model
	 */

	loadModelConfig: function( modelConfig ) {

	},

	/**
	 * calcCloseButtonSize() abstract method.
     * Called for providing close button size to initCloseButton in "Layer".
	 *
     * Override for customized button size calculation strategy.
	 *
	 * @return { number } size, close button size
	 */

	calcCloseButtonSize: function() {

		return  1;

	},

	/**                                                                                                                                                 y        y                        /**
	 * calcCloseButtonPos() abstract method
     * Called for providing close button position to initCloseButton in "Layer".
	 *
     * Override for customized button position calculation strategy.
	 *
	 * @return { Object } close button position, { x: double, y: double, z: double }, relative to layer position.
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
     * Since NativeLayer adds basic line group based on "Layer",
     * it is required to implement "getRelativeElements" and "provideRelativeElements" to enable line system.
	 *
	 * ============
	 */

	/**
	 * getRelativeElements() abstract function
	 * Get relative element in last layer for relative lines based on given hovered element.
	 *
	 * Override this function to define relative element from previous layer.
     * Override to define relative element from previous layer.
	 *
	 * Bridge design patten:
	 * 1. "getRelativeElements" request for relative elements from previous layer;
	 * 2. "provideRelativeElements" of previous layer response to request, returns relative elements.
	 *
	 * @param { THREE.Object } selectedElement, hovered element detected by Raycaster
	 * @return { THREE.Object[] } relativeElements
	 */

	getRelativeElements: function( selectedElement ) {

		return [];

	},

	/**
	 * provideRelativeElements() abstract function
	 * Return relative elements.
	 *
	 * Override this function to return relative elements based on request information.
     * Override to return relative elements based on request.
	 *
     * Bridge design patten:
     * 1. "getRelativeElements" request for relative elements from previous layer;
     * 2. "provideRelativeElements" of previous layer response to request, returns relative elements.
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

export { NativeLayer };
