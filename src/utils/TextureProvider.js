import { CloseData } from "../assets/image/CloseData";
import { PlusData } from "../assets/image/Plus";

let TextureProvider = (function() {

	function getTexture(name) {

		if (name === "close") {
			return CloseData;
		} else if (name === "add") {
			return PlusData;
		}

	}

	return {

		getTexture: getTexture

	}

})();

export { TextureProvider };