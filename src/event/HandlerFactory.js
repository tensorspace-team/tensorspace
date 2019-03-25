/**
 * @author syt123450 / https://github.com/syt123450
 */

import { SequentialHandler3D } from './SequentialHandler3D';
import { ModelHandler3D } from './ModelHandler3D';

let HandlerFactory = ( function() {
	
	function getEventHandler( tspModel ) {
		
		if ( tspModel.modelType === "Sequential" ) {
			
			return new SequentialHandler3D( tspModel );
			
		} else if ( tspModel.modelType === "Model" ) {
			
			return new ModelHandler3D( tspModel );
			
		}
		
	}
	
	return {
		
		getEventHandler: getEventHandler
		
	}
	
} )();

export { HandlerFactory };