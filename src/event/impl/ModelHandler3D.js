/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Handler3D } from '../abstract/Handler3D';

function ModelHandler3D( tspModel ) {

	Handler3D.call( this, tspModel );
	
}

ModelHandler3D.prototype = Object.assign( Object.create( Handler3D.prototype ), {
	
	handleClick: function( selectedElement ) {
		
		// Let the layer to handle actual click event.
		
		let selectedLayer = this.tspModel.layers[ selectedElement.layerIndex ];
		
		selectedLayer.handleClick( selectedElement );
		
		// Rearrange layer
		
		let translateTime = selectedLayer.openTime;
		let level = this.tspModel.layerLookupMap[ selectedElement.layerIndex ];
		
		this.tspModel.rearrangeLayerInLevel( level, translateTime );
		
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

export { ModelHandler3D };