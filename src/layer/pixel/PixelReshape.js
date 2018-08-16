import Layer from './PixelLayer';

function Reshape(config) {

	Layer.call(this, config);

}

Reshape.prototype = Object.assign( Object.create( Layer.prototype ), {

	init: function() {


	},

	assemble: function(layerIndex) {

	}

} );

export default Reshape;