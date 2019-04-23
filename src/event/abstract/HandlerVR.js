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
	
	/**
	 * Record clicked element.
	 *
	 * @type { THREE.Object }
	 */
	
	this.previousClickedElement = undefined;
	
	/**
	 * Record ray clicking time.
	 *
	 * @type { timestamp }
	 */
	
	this.previousClickedTime = Date.now();
	
	/**
	 * Double click timing difference.
	 *
	 * @type { Int }
	 */
	
	this.doubleClickDifference = 1000;
	
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
	 * handleDoubleClick(), Handle ray double click event when ray click on a TensorSpace clickable object twice in a short time.
	 *
	 * @param clickedElement, THREE.Object, TensorSpace clickable object, clicked by ray
	 */
	
	handleDoubleClick: function( clickedElement ) {
		
		let clickTimeNow = Date.now();
		
		if ( this.previousClickedElement === undefined ) { // previously click on TensorSpace unclickable element
			
			// Click on TensorSpace unclickable element twice in a short time, zoom out.
			
			if ( clickedElement === undefined ) {
				
				if ( clickTimeNow - this.previousClickedTime < this.doubleClickDifference ) {
					
					this.tspModel.modelContext.position.z -= 100;
					
				}
				
			}
			
		} else { // previous click on TensorSpace clickable element
			
			// Click on TensorSpace clickable element twice in a short time, zoom in.
			
			if ( clickedElement !== undefined &&
				this.previousClickedElement === clickedElement ) {
				
				if ( clickTimeNow - this.previousClickedTime < this.doubleClickDifference ) {
					
					this.tspModel.modelContext.position.z += 100;
					
				}
				
			}
			
		}
		
		// Record clicked element.
		
		this.previousClickedElement = clickedElement;
		this.previousClickedTime = clickTimeNow;
		
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