import { FeatureMap } from "./FeatureMap";
import { colorUtils } from "../utils/ColorUtils";

function InputDepth1Object(width, height, initCenter, color) {

	FeatureMap.call(this, width, height, initCenter, color);

	this.neuralLength = width * height;
}

InputDepth1Object.prototype = Object.assign(Object.create(FeatureMap.prototype), {

	updateVis: function(value) {

		let colors = colorUtils.getAdjustValues(value);

		this.updateGrayScale(colors);

	},

	clear: function() {

		let zeroValue = new Int8Array(this.neuralLength);

		this.updateVis(zeroValue);

	}

});

export { InputDepth1Object };