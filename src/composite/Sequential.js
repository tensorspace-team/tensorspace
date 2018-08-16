import PixelSequential from './PixelSequential';
import MapSequential from './MapSequential';

function Sequential(container, config) {

	if ( config.pixel === true ) {
		return new PixelSequential(container);
	} else {
		return new MapSequential(container);
	}

}

export default Sequential;