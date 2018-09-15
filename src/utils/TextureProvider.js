import { CloseData } from "../assets/image/CloseData";
import { PlusData } from "../assets/image/Plus";
import { ConcatenateData } from "../assets/image/Concatenate";

let TextureProvider = (function() {

	function getTexture(name) {

		if (name === "close") {
			return CloseData;
		} else if (name === "add") {
			return PlusData;
		} else if (name === "concatenate") {
			return ConcatenateData;
		}

	}

	return {

		getTexture: getTexture

	}

})();

export { TextureProvider };