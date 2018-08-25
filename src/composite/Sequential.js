import PixelSequential from './PixelSequential';
import MapSequential from './MapSequential';

function Sequential(container, config) {

	if ( config.pixel === true ) {
		return new PixelSequential(container, config);
	} else {
		return new MapSequential(container, config);
	}

}

export default Sequential;