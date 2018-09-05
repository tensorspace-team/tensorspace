let MapDataGenerator = (function() {

	function generateChannelData(rawValue, depth) {

		let layerOutputValues = [];

		for (let i = 0; i < depth; i++) {

			let referredIndex = i;

			while (referredIndex < rawValue.length) {

				layerOutputValues.push(rawValue[referredIndex]);

				referredIndex += depth;
			}

		}

		return layerOutputValues;

	}

	// generate channel average data for aggregation
	function generateAggregationData(rawValue, depth) {

		let aggregationValue = [];

		for (let i = 0; i < rawValue.length; i += depth) {

			let channelSum = 0;

			for (let j = 0; j < depth; j++) {

				channelSum += rawValue[i];

			}

			aggregationValue.push(channelSum / depth);

		}

		return aggregationValue;

	}

	return {

		generateChannelData: generateChannelData,

		generateAggregationData: generateAggregationData

	}

})();

export { MapDataGenerator }