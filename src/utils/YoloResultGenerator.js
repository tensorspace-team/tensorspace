let YoloResultGenerator = (function() {

	function getChannelBox(channelData) {

		return [{
			x: 0,
			y: 0,
			width: 100,
			height: 150
		}, {
			x: 250,
			y: 50,
			width: 100,
			height: 50
		}, {
			x: 100,
			y: 10,
			width: 50,
			height: 100
		}, {
			x: 200,
			y: 200,
			width: 100,
			height: 200
		}, {
			x: 250,
			y: 300,
			width: 100,
			height: 80
		}];

	}

	return {

		getChannelBox: getChannelBox

	}

})();

export { YoloResultGenerator };