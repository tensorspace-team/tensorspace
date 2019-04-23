/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Handler3D } from '../abstract/Handler3D';

/**
 * ModelHandler3D, event handler for Functional Model, rendered by Web3DRenderer.
 * Initialized by HandlerFactory.
 *
 * @param tspModel, TensorSpace Model reference
 * @constructor
 */

function ModelHandler3D( tspModel ) {
	
	// ModelHandler3D inherits from abstract handler "Handler3D".
	
	Handler3D.call( this, tspModel );
	
}

ModelHandler3D.prototype = Object.assign( Object.create( Handler3D.prototype ), {
	
	/**
	 * ============
	 *
	 * Functions below override base class Handler3D's abstract method
	 *
	 * ModelHandler3D overrides Handler3D's function:
	 * handleClick
	 *
	 * ============
	 */
	
	/**
	 * handleClick(), Handle mouse click event when mouse click on a TensorSpace clickable object.
	 *
	 * @param clickedElement, THREE.Object, TensorSpace clickable object, clicked by mouse
	 */
	
	handleClick: function( clickedElement ) {
		
		// Let the TensorSpace Layer to handle actual click event.
		
		let clickedLayer = this.tspModel.layers[ clickedElement.layerIndex ];
		
		clickedLayer.handleClick( clickedElement );
		
		// Rearrange layer
		
		let translateTime = clickedLayer.openTime;
		let level = this.tspModel.layerLookupMap[ clickedElement.layerIndex ];
		
		this.tspModel.rearrangeLayerInLevel( level, translateTime );
		
	}
	
	/**
	 * ============
	 *
	 * Functions above override base class Handler3D's abstract method.
	 *
	 * ============
	 */
	
} );

export { ModelHandler3D };