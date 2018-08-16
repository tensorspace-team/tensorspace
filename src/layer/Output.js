import PixelOutput from './pixel/PixelOutput';
import MapOutput from './map/MapOutput';

function Output(config) {

	if (config.pixel) {
		return new PixelOutput(config);
	} else {
		return new MapOutput(config);
	}

}

export default Output;