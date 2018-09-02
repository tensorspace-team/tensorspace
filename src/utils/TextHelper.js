import { FeatureMapTextRatio } from "./Constant";

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

	return {

		calcOutputTextPos: calcOutputTextPos,

		calcOutputTextSize: calcOutputTextSize,

		calcFmTextSize: calcFmTextSize,

		calcFmWidthTextPos: calcFmWidthTextPos,

		calcFmHeightTextPos: calcFmHeightTextPos

	}

})();

export { TextHelper }