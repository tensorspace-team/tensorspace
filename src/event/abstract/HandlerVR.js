/**
 * @author syt123450 / https://github.com/syt123450
 */

import { EventHandler } from './EventHandler';

function HandlerVR( tspModel ) {
	
	EventHandler.call( this, tspModel );
	
	/**
	 * Record layer hovered by mouse now.
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
	
	handleClick: function( clickedElement ) {
	
	},
	
	/**
	 * handleHoverIn(), Handler for hover element event.
	 *
	 * @param hoveredElement
	 */
	
	handleHoverIn: function( hoveredElement ) {
		
		let selectedLayer = this.tspModel.layers[ hoveredElement.layerIndex ];
		
		if ( this.hoveredLayer === undefined ) {
			
			selectedLayer.handleHoverIn( hoveredElement );
			
		} else {
			
			if ( this.hoveredLayer !== selectedLayer ) {
				
				this.handleHoverOut();
				selectedLayer.handleHoverIn( hoveredElement );
				
			}
			
		}
		
		this.hoveredLayer = selectedLayer;
		
		if ( hoveredElement.emissiveable ) {
			
			if ( this.hoveredEmissive !== undefined ) {
				
				if ( this.hoveredEmissive !== hoveredElement ) {
					
					this.handleDarken();
					this.handleEmissive( hoveredElement );
					
				}
				
			} else {
				
				this.handleEmissive( hoveredElement );
				
			}
			
		} else {
			
			if ( this.hoveredEmissive !== undefined ) {
				
				this.handleDarken();
				
			}
			
		}
		
	},
	
	/**
	 * handleHoverOut(), remove hover effect from a previously hovered element.
	 */
	
	handleHoverOut: function() {
		
		if ( this.hoveredLayer !== undefined ) {
			
			this.hoveredLayer.handleHoverOut();
			this.hoveredLayer = undefined;
			
		}
		
	},
	
	handleEmissive: function( element ) {
		
		element.context.emissive();
		this.hoveredEmissive = element;
		
	},
	
	handleDarken: function() {
		
		this.hoveredEmissive.context.darken();
		this.hoveredEmissive = undefined;
		
	}
	
} );

export { HandlerVR };