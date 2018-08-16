import PixelReshape from './pixel/PixelReshape';
import MapReshape from './map/MapReshape';

function Reshape(config) {

	if (config.pixel) {
		return new PixelReshape(config);
	} else {
		return new MapReshape(config);
	}

}

export default Reshape;