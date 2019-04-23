/**
 * @author syt123450 / https://github.com/syt123450
 */

import { SequentialHandler3D } from './impl/SequentialHandler3D';
import { ModelHandler3D } from './impl/ModelHandler3D';
import { SequentialHandlerVR } from './impl/SequentialHandlerVR';
import { ModelHandlerVR } from './impl/ModelHandlerVR';

let HandlerFactory = ( function() {
	
	function getEventHandler( tspModel ) {
		
		if ( tspModel.configuration.renderer === "Web3D" ) {
			
			if ( tspModel.modelType === "Sequential" ) {
				
				return new SequentialHandler3D( tspModel );
				
			} else if ( tspModel.modelType === "Model" ) {
				
				return new ModelHandler3D( tspModel );
				
			}
			
		} else if ( tspModel.configuration.renderer === "WebVR" ) {
			
			if ( tspModel.modelType === "Sequential" ) {
				
				return new SequentialHandlerVR( tspModel );
				
			} else if ( tspModel.modelType === "Model" ) {
				
				return new ModelHandlerVR( tspModel );
				
			}
			
		}
		
	}
	
	return {
		
		getEventHandler: getEventHandler
		
	}
	
} )();

export { HandlerFactory };