/**
 * @author syt123450 / https://github.com/syt123450
 */

import { EventHandler } from './EventHandler';

/**
 * Handler3D, abstract handler, should not be initialized by HandlerFactory.
 * Base class for SequentialHandlerVR, ModelHandlerVR.
 *
 * @param tspModel, TensorSpace Model reference
 * @constructor
 */

function HandlerVR( tspModel ) {
	
	// HandlerVR inherits from abstract handler "EventHandler".
	
	EventHandler.call( this, tspModel );
	
	/**
	 * Record TensorSpace Layer hovered by ray now.
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

HandlerVR.prototype = Object.assign( Object.create( EventHandler.prototype ), {
	
	/**
	 * handleHoverIn(), Handler for hover element event.
	 *
	 * @param hoveredElement, THREE.Object, TensorSpace hoverable object, caught by ray
	 */
	
	handleHoverIn: function( hoveredElement ) {
		
		const eventHandler = this;
		
		// Let the layer to handle actual hover event.
		
		const selectedLayer = this.tspModel.layers[ hoveredElement.layerIndex ];
		
		if ( this.hoveredLayer === undefined ) {
			
			selectedLayer.handleHoverIn( hoveredElement );
			
		} else {
			
			if ( this.hoveredLayer !== selectedLayer ) {
				
				this.handleHoverOut();
				selectedLayer.handleHoverIn( hoveredElement );
				
			}
			
		}
		
		// Record hovered Layer for the latter usage of clearing hover effect.
		
		this.hoveredLayer = selectedLayer;
		
		// If hovered element is emissiveable, emissive it, and record this element.
		
		if ( hoveredElement.emissiveable ) {
			
			if ( this.hoveredEmissive !== undefined ) {
				
				if ( this.hoveredEmissive !== hoveredElement ) {
					
					handleDarken();
					handleEmissive( hoveredElement );
					
				}
				
			} else {
				
				handleEmissive( hoveredElement );
				
			}
			
		} else {
			
			if ( this.hoveredEmissive !== undefined ) {
				
				handleDarken();
				
			}
			
		}
		
		function handleEmissive( element ) {
			
			element.context.emissive();
			eventHandler.hoveredEmissive = element;
			
		}
		
		function handleDarken() {
			
			eventHandler.hoveredEmissive.context.darken();
			eventHandler.hoveredEmissive = undefined;
			
		}
		
	},
	
	/**
	 * handleHoverOut(), Remove hover effect from the previous hovered element.
	 */
	
	handleHoverOut: function() {
		
		if ( this.hoveredLayer !== undefined ) {
			
			this.hoveredLayer.handleHoverOut();
			this.hoveredLayer = undefined;
			
		}
		
	},
	
	/**
	 * ============
	 *
	 * Functions below are abstract method for HandlerVR.
	 * SubClasses ( specific HandlerVR ) override these abstract methods.
	 *
	 * ============
	 */
	
	/**
	 * handleClick(), Handle ray click event when ray click on a TensorSpace clickable object.
	 *
	 * @param clickedElement, THREE.Object, TensorSpace clickable object, clicked by ray
	 */
	
	handleClick: function( clickedElement ) {
	
	}
	
} );

export { HandlerVR };