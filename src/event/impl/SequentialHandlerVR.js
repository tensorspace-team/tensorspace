/**
 * @author syt123450 / https://github.com/syt123450
 */

import { HandlerVR } from '../abstract/HandlerVR';

function SequentialHandlerVR( tspModel ) {
	
	HandlerVR.call( this, tspModel );
	
}

SequentialHandlerVR.prototype = Object.assign( Object.create( HandlerVR.prototype ), {
	
	handleClick: function( clickedElement ) {
		
		let selectedLayer = this.tspModel.layers[ clickedElement.layerIndex ];
		
		selectedLayer.handleClick( clickedElement );
		
	}
	
} );

export { SequentialHandlerVR };