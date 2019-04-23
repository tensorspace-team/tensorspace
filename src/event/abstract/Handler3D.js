/**
 * @author syt123450 / https://github.com/syt123450
 */

import { EventHandler } from './EventHandler';

function Handler3D( tspModel ) {
	
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

Handler3D.prototype = Object.assign( Object.create( EventHandler.prototype ), {

	handleClick: function() {
	
	},
	
	handleHover: function( intersects ) {
		
		if ( this.hoveredLayer !== undefined ) {
			
			this.hoveredLayer.handleHoverOut();
			this.hoveredLayer = undefined;
			
		}
		
		if ( this.hoveredEmissive !== undefined ) {
			
			this.hoveredEmissive.context.darken();
			this.hoveredEmissive = undefined;
			
		}
		
		for ( let i = 0; i < intersects.length; i ++ ) {
			
			if ( intersects !== null && intersects.length > 0 && intersects[ i ].object.type === "Mesh" ) {
				
				let selectedElement = intersects[ i ].object;
				
				if ( selectedElement.hoverable === true ) {
					
					if ( selectedElement.emissiveable ) {
						
						this.hoveredEmissive = selectedElement;
						selectedElement.context.emissive();
						
					}
					
					let selectedLayer = this.tspModel.layers[ selectedElement.layerIndex ];
					
					// Let the layer to handle actual hover event.
					
					selectedLayer.handleHoverIn( selectedElement );
					
					this.hoveredLayer = selectedLayer;
					
					break;
					
				}
				
			}
			
		}
		
	}
	
} );

export { Handler3D };