/**
 * @author syt123450 / https://github.com/syt123450
 */

import { HandlerVR } from '../abstract/HandlerVR';

function ModelHandlerVR( tspModel ) {
	
	HandlerVR.call( this, tspModel );
	
}

ModelHandlerVR.prototype = Object.assign( Object.assign( HandlerVR.prototype ),{
	
	handleClick: function( clickedElement ) {
		
		// Let the layer to handle actual click event.
		
		let selectedLayer = this.tspModel.layers[ clickedElement.layerIndex ];
		
		selectedLayer.handleClick( clickedElement );
		
		// Rearrange layer
		
		let translateTime = selectedLayer.openTime;
		let level = this.tspModel.layerLookupMap[ clickedElement.layerIndex ];
		
		this.rearrangeLayerInLevel( level, translateTime );
		
	}

} );

export { ModelHandlerVR };