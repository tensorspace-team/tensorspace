/**
 * @author syt123450 / https://github.com/syt123450
 */

import { KerasLoader } from './KerasLoader';
import { TfLoader } from './TfLoader';
import { TfjsLoader } from './TfjsLoader';
import { LiveLoader } from './LiveLoader';

let LoaderFactory = ( function() {
	
	function getLoader( tspModel, loaderConfig ) {
		
		let loader;
		
		if ( loaderConfig.type === "tfjs" ) {
			
			loader =  new TfjsLoader( tspModel, loaderConfig );
			
		} else if ( loaderConfig.type === "keras" ) {
			
			loader = new KerasLoader( tspModel, loaderConfig );
			
		} else if ( loaderConfig.type === "tensorflow" ) {
			
			loader = new TfLoader( tspModel, loaderConfig );
			
		} else if ( loaderConfig.type = "live" ) {
			
			loader = new LiveLoader( tspModel, loaderConfig );
			
		} else {
			
			console.error( "Unsupported Loader type: " + loaderConfig.type );
			
		}
		
		loader.preLoad();
		
		return loader;
		
	}
	
	return {
		
		getLoader: getLoader
		
	}
	
} )();

export { LoaderFactory };