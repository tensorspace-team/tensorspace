/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Handler3D } from '../abstract/Handler3D';

function SequentialHandler3D( tspModel ) {
	
	Handler3D.call( this, tspModel );
	
}

SequentialHandler3D.prototype = Object.assign( Object.create( Handler3D.prototype ), {
	
	handleClick: function( selectedElement ) {
		
		// Let the layer to handle actual click event.
		
		let selectedLayer = this.tspModel.layers[ selectedElement.layerIndex ];
		
		selectedLayer.handleClick( selectedElement );
		
	}
	
} );

export { SequentialHandler3D };