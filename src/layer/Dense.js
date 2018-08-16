import PixelDense from './pixel/PixelDense';
import MapDense from './map/MapDense';

function Dense(config) {

	if (config.pixel) {
		return new PixelDense(config);
	} else {
		return new MapDense(config);
	}

}

export default Dense;