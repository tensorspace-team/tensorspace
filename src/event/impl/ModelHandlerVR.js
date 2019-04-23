/**
 * @author syt123450 / https://github.com/syt123450
 */

import { HandlerVR } from '../abstract/HandlerVR';

function ModelHandlerVR( tspModel ) {
	
	HandlerVR.call( this, tspModel );
	
}

ModelHandlerVR.prototype = Object.assign( Object.assign( HandlerVR.prototype ),{



} );

export { ModelHandlerVR };