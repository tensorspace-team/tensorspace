import PixelFlatten from './pixel/PixelFlatten';
import MapFlatten from './map/MapFlatten';

function Flatten(config) {

	if (config.pixel) {
		return new PixelFlatten(config);
	} else {
		return new MapFlatten(config);
	}

}

export default Flatten;