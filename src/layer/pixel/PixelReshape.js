import { Layer } from './PixelLayer';

function PixelReshape(config) {

	Layer.call(this, config);

}

PixelReshape.prototype = Object.assign( Object.create( Layer.prototype ), {

	init: function() {


	},

	assemble: function(layerIndex) {

	}

} );

export { PixelReshape};