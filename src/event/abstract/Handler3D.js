/**
 * @author syt123450 / https://github.com/syt123450
 */

import { EventHandler } from './EventHandler';

/**
 * Handler3D, abstract handler, should not be initialized by HandlerFactory.
 * Base class for SequentialHandler3D, ModelHandler3D.
 *
 * @param tspModel, TensorSpace Model reference
 * @constructor
 */

function Handler3D( tspModel ) {
	
	// Handler3D inherits from abstract handler "EventHandler".
	
	EventHandler.call( this, tspModel );
	
	/**
	 * Record TensorSpace Layer hovered by mouse now.
	 *
	 * @type { Layer }
	 */
	
	this.hoveredLayer = undefined;
	
	/**
	 * Record Emissive element.
	 *
	 * @type { THREE.Object }
	 */
	
	this.hoveredEmissive = undefined;
	
}

Handler3D.prototype = Object.assign( Object.create( EventHandler.prototype ), {
	
	/**
	 * handleHover(), Handle mouse hover event when mouse move on Model Container.
	 *
	 * @param intersects, THREE.Mesh intersected by raycaster
	 */
	
	handleHover: function( intersects ) {
		
		// Clear previous hovered effect.
		
		if ( this.hoveredLayer !== undefined ) {
			
			this.hoveredLayer.handleHoverOut();
			this.hoveredLayer = undefined;
			
		}
		
		// Clear previous emissive effect.
		
		if ( this.hoveredEmissive !== undefined ) {
			
			this.hoveredEmissive.context.darken();
			this.hoveredEmissive = undefined;
			
		}
		
		// Traverse intersected object to get the first TensorSpace hoverable element.
		
		for ( let i = 0; i < intersects.length; i ++ ) {
			
			if ( intersects !== null && intersects.length > 0 && intersects[ i ].object.type === "Mesh" ) {
				
				const selectedElement = intersects[ i ].object;
				
				if ( selectedElement.hoverable === true ) {
				
					// If hovered element is emissiveable, emissive it, and record this element.
					
					if ( selectedElement.emissiveable ) {
						
						this.hoveredEmissive = selectedElement;
						selectedElement.context.emissive();
						
					}
					
					const selectedLayer = this.tspModel.layers[ selectedElement.layerIndex ];
					
					// Let the layer to handle actual hover event.
					
					selectedLayer.handleHoverIn( selectedElement );
					
					// Record hovered Layer for the latter usage of clearing hover effect.
					
					this.hoveredLayer = selectedLayer;
					
					break;
					
				}
				
			}
			
		}
		
	},
	
	/**
	 * ============
	 *
	 * Functions below are abstract method for Handler3D.
	 * SubClasses ( specific Handler3D ) override these abstract methods.
	 *
	 * ============
	 */
	
	/**
	 * handleClick(), Handle mouse click event when mouse click on a TensorSpace clickable object.
	 *
	 * @param clickedElement, THREE.Object, TensorSpace clickable object, clicked by mouse
	 */
	
	handleClick: function( clickedElement ) {
	
	}
	
} );

export { Handler3D };