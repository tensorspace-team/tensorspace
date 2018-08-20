import PixelPadding2d from './pixel/PixelPadding2d';
import MapPadding2d from './map/MapPadding2d';

function Pooling2d(config) {

	if (config.pixel) {
		return new PixelPadding2d(config);
	} else {
		return new MapPadding2d(config);
	}

}

export default Pooling2d;