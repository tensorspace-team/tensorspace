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
		
	}
	
} );

export { ModelHandler3D };