/**
 * @author syt123450 / https://github.com/syt123450
 */

import { SequentialHandler3D } from './impl/SequentialHandler3D';
import { ModelHandler3D } from './impl/ModelHandler3D';
import { SequentialHandlerVR } from './impl/SequentialHandlerVR';
import { ModelHandlerVR } from './impl/ModelHandlerVR';

/**
 * "HandlerFactory" create the EventHandler for ModelRenderer.
 * Based on TensorSpace's modelType and renderer configuration,
 * "Factory" will create different kinds of "EventHandler".
 *
 * If the TensorSpace model is a Sequential Model renderer in "Web3DRenderer",
 * return "SequentialHandler3D";
 * If the TensorSpace model is a Functional Model renderer in "Web3DRenderer",
 * return "ModelHandler3D";
 * If the TensorSpace model is a Sequential Model renderer in "WebVRRenderer",
 * return "SequentialHandlerVR";
 * If the TensorSpace model is a Functional Model renderer in "WebVRRenderer",
 * return "ModelHandlerVR".
 */

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