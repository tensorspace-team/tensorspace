let TextHelper = (function() {

	function calculateOutputTextSize(cubeSize) {
		return cubeSize;
	}

	function calculateOutputTextPos(textLength, textSize, cubeSize, cubePos) {

		return {

			x: cubePos.x - textLength * textSize / 2,
			y: cubePos.y + cubeSize,
			z: cubePos.z

		}

	}

	return {

		calculateOutputTextPos: calculateOutputTextPos,

		calculateOutputTextSize: calculateOutputTextSize

	}

})();

export { TextHelper }