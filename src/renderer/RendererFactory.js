/**
 * @author syt123450 / https://github.com/syt123450
 */

import { HandlerFactory } from '../event/HandlerFactory';
import { Web3DRenderer } from './Web3DRenderer';

let RendererFactory = ( function() {
	
	function getRenderer( tspModel ) {
		
		let eventHandler = HandlerFactory.getEventHandler( tspModel );
		
		return new Web3DRenderer( tspModel, eventHandler );
		
	}
	
	return {
		
		getRenderer: getRenderer
		
	}
	
} )();

export { RendererFactory };