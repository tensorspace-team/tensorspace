import PixelPooling2d from './pixel/PixelPooling2d';
import MapPooling2d from './map/MapPooling2d';

function Pooling2d(config) {

	if (config.pixel) {
		return new PixelPooling2d(config);
	} else {
		return new MapPooling2d(config);
	}

}

export default Pooling2d;