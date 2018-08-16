import PixelConv2d from './pixel/PixelConv2d';
import MapConv2d from './map/MapConv2d';

function Conv2d(config) {

	if (config.pixel) {
		return new PixelConv2d(config);
	} else {
		return new MapConv2d(config);
	}

}

export default Conv2d;