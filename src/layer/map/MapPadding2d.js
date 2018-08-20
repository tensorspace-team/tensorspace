import MapLayer from './MapLayer';

function MapPadding2d(config) {

	MapLayer.call(this, config);

}

MapPadding2d.prototype = Object.assign(Object.create(MapLayer.prototype), {

});

export default MapPadding2d;

