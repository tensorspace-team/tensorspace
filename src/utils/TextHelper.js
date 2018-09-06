import { FeatureMapTextRatio } from "./Constant";
import { FeatureQueueTextRatio } from "./Constant";

let TextHelper = (function() {

	function calcOutputTextSize(cubeSize) {
		return cubeSize;
	}

	function calcOutputTextPos(textLength, textSize, cubeSize, cubePos) {

		return {

			x: cubePos.x - textLength * textSize / 2,
			y: cubePos.y + cubeSize,
			z: cubePos.z

		};

	}

	function calcFmTextSize(actualFmWidth) {
		return FeatureMapTextRatio * actualFmWidth;
	}

	function calcFmWidthTextPos(textLength, textSize, actualFmWidth, fmPos) {

		return {
			x: fmPos.x - actualFmWidth / 2 - textLength * textSize,
			y: fmPos.y,
			z: fmPos.z
		};

	}

	function calcFmHeightTextPos(textLength, textSize, actualFmHeight, fmPos) {

		return {
			x: fmPos.x - textLength * textSize / 2,
			y: fmPos.y,
			z: fmPos.z - actualFmHeight / 2 - textSize
		};

	}

	function calcQueueTextSize(unitLength) {

		return FeatureQueueTextRatio * unitLength;

	}

	function calcGlobalPoolingSize(unitLength) {

		return unitLength;

	}

	function calcQueueTextPos(textLength, textSize, unitLength, queueCenter) {

		return {
			x: queueCenter.x - textLength * textSize / 2,
			y: queueCenter.y + 2 * unitLength,
			z: queueCenter.z
		}

	}

	return {

		calcOutputTextPos: calcOutputTextPos,

		calcOutputTextSize: calcOutputTextSize,

		calcFmTextSize: calcFmTextSize,

		calcFmWidthTextPos: calcFmWidthTextPos,

		calcFmHeightTextPos: calcFmHeightTextPos,

		calcQueueTextSize: calcQueueTextSize,

		calcQueueTextPos: calcQueueTextPos,

		calcGlobalPoolingSize: calcGlobalPoolingSize

	}

})();

export { TextHelper }