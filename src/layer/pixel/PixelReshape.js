import { PixelLayer } from './PixelLayer';

function PixelReshape(config) {

	PixelLayer.call(this, config);

}

PixelReshape.prototype = Object.assign( Object.create( PixelLayer.prototype ), {

	init: function() {


	},

	assemble: function(layerIndex) {

	}

} );

export { PixelReshape};