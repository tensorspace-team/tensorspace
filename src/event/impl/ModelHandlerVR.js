/**
 * @author syt123450 / https://github.com/syt123450
 */

import { HandlerVR } from '../abstract/HandlerVR';

/**
 * ModelHandlerVR, event handler for Functional Model, rendered by WebVRRenderer.
 * Initialized by HandlerFactory.
 *
 * @param tspModel, TensorSpace Model reference
 * @constructor
 */

function ModelHandlerVR( tspModel ) {
	
	// ModelHandlerVR inherits from abstract handler "HandlerVR".
	
	HandlerVR.call( this, tspModel );
	
}

ModelHandlerVR.prototype = Object.assign( Object.assign( HandlerVR.prototype ),{
	
	/**
	 * ============
	 *
	 * Functions below override base class HandlerVR's abstract method
	 *
	 * ModelHandlerVR overrides HandlerVR's function:
	 * handleClick
	 *
	 * ============
	 */
	
	/**
	 * handleClick(), Handle ray click event when ray click on a TensorSpace clickable object.
	 *
	 * @param clickedElement, THREE.Object, TensorSpace clickable object, clicked by ray
	 */
	
	handleClick: function( clickedElement ) {
		
		// Let the TensorSpace Layer to handle actual click event.
		
		let clickedLayer = this.tspModel.layers[ clickedElement.layerIndex ];
		
		clickedLayer.handleClick( clickedElement );
		
		// Rearrange layer
		
		let translateTime = clickedLayer.openTime;
		let level = this.tspModel.layerLookupMap[ clickedElement.layerIndex ];
		
		this.rearrangeLayerInLevel( level, translateTime );
		
	}
	
	/**
	 * ============
	 *
	 * Functions above override base class HandlerVR's abstract method.
	 *
	 * ============
	 */

} );

export { ModelHandlerVR };