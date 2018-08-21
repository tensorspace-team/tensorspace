import MapLayer from './MapLayer';

function MapPadding2d(config) {

	MapLayer.call(this, config);

}

MapPadding2d.prototype = Object.assign(Object.create(MapLayer.prototype), {

	init: function(center) {

	},

	assemble: function(layerIndex) {

	},

	updateValue: function() {



	}

});

export default MapPadding2d;

