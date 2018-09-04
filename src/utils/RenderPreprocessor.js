let RenderPreprocessor = (function() {

	function preProcessMapColor(colors, width, height) {

		let renderData = [];

		for (let i = 0; i < height; i++) {
			let dataLine = colors.slice(width * i, width * (i + 1));
			renderData = dataLine.concat(renderData);
		}

		return renderData;

	}

	function preProcessMap3dColor(colors, width, height) {

		let renderData = [];

		for (let i = 0; i < height; i++) {
			let dataLine = colors.slice(3 * i * width, 3 * (i + 1) * width);
			renderData = dataLine.concat(renderData);
		}

		return renderData;

	}

	return {

		preProcessFmColor: preProcessMapColor,

		preProcessChannelColor: preProcessMapColor,

		preProcessPaddingColor: preProcessMapColor,

		preProcessInput3dColor: preProcessMap3dColor

	}

})();

export { RenderPreprocessor }