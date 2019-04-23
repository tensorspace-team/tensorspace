/**
 * @author syt123450 / https://github.com/syt123450
 */

import { HandlerFactory } from '../event/HandlerFactory';
import { Web3DRenderer } from './Web3DRenderer';
import { WebVRRenderer } from './WebVRRenderer';

let RendererFactory = ( function() {
	
	function getRenderer( tspModel ) {
		
		let eventHandler = HandlerFactory.getEventHandler( tspModel );
		
		let renderer;
		
		if ( tspModel.configuration.renderer === "Web3D" ) {
			
			renderer = new Web3DRenderer( tspModel, eventHandler );
			
		} else if ( tspModel.configuration.renderer === "WebVR" ) {
			
			renderer = new WebVRRenderer( tspModel, eventHandler );
			
		}
		
		return renderer;
		
	}
	
	return {
		
		getRenderer: getRenderer
		
	}
	
} )();

export { RendererFactory };