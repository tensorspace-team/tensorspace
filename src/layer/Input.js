import PixelInput from './pixel/PixelInput';
import MapInput from './map/MapInput';

function Input(config) {

	if (config.pixel) {
		return new PixelInput(config);
	} else {
		return new MapInput(config);
	}

}

export default Input;