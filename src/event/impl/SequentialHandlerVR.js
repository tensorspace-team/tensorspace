/**
 * @author syt123450 / https://github.com/syt123450
 */

import { HandlerVR } from '../abstract/HandlerVR';

/**
 * SequentialHandlerVR, event handler for Sequential Model, rendered by WebVRRenderer.
 * Initialized by HandlerFactory.
 *
 * @param tspModel, TensorSpace Model reference
 * @constructor
 */

function SequentialHandlerVR( tspModel ) {
	
	// SequentialHandlerVR inherits from abstract handler "HandlerVR".
	
	HandlerVR.call( this, tspModel );
	
}

SequentialHandlerVR.prototype = Object.assign( Object.create( HandlerVR.prototype ), {
	
	/**
	 * ============
	 *
	 * Functions below override base class HandlerVR's abstract method
	 *
	 * SequentialHandlerVR overrides HandlerVR's function:
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
		
	}
	
	/**
	 * ============
	 *
	 * Functions above override base class HandlerVR's abstract method.
	 *
	 * ============
	 */
	
} );

export { SequentialHandlerVR };