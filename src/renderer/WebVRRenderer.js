/**
 * @author syt123450 / https://github.com/syt123450
 */

import { ModelRenderer } from './ModelRenderer';

function WebVRRenderer( tspModel, handlers ) {
	
	ModelRenderer.call( this, tspModel, handlers );
	
}

WebVRRenderer.prototype = Object.assign( Object.create( ModelRenderer.prototype ), {
	
	init: function() {
	
	},
	
	reset: function() {
	
	}
	
} );

export { WebVRRenderer };