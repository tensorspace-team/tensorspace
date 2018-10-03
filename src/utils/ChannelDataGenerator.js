/**
 * @author syt123450 / https://github.com/syt123450
 */

let ChannelDataGenerator = ( function() {

	function generateChannelData( rawValue, depth ) {

		let layerOutputValues = [];

		for ( let i = 0; i < depth; i ++ ) {

			let referredIndex = i;

			while ( referredIndex < rawValue.length)  {

				layerOutputValues.push( rawValue[ referredIndex ] );
				referredIndex += depth;

			}

		}

		return layerOutputValues;

	}

	// generate channel average data for aggregation
	function generateMaxAggregationData( rawValue, depth ) {

		let aggregationValue = [];

		for ( let i = 0; i < rawValue.length; i += depth ) {

			let channelSum = 0;

			for ( let j = 0; j < depth; j ++ ) {

				channelSum += rawValue[ i + j ];

			}

			aggregationValue.push( channelSum / depth );

		}

		return aggregationValue;

	}

	// generate channel max data for aggregation
	function generateAverageAggregationData( rawValue, depth ) {

		let aggregationValue = [];

		for ( let i = 0; i < rawValue.length; i += depth ) {

			let max = rawValue[ i ];

			for ( let j = 0; j < depth; j++ ) {

				max = max > rawValue[ i + j ] ? max : rawValue[ i + j ];

			}

			aggregationValue.push( max );

		}

		return aggregationValue;

	}

	function generateAggregationData( rawValue, depth, strategy ) {

		if ( strategy === "average" ) {

			return generateAverageAggregationData( rawValue, depth );

		} else if ( strategy === "max" ) {

			return generateMaxAggregationData( rawValue, depth );

		} else {

			console.error( "Do not support \"aggregationStrategy\": " + strategy + ", use \"average\" or \"max\" max instead." );

		}

	}

	return {

		generateChannelData: generateChannelData,

		generateAggregationData: generateAggregationData

	}

} )();

export { ChannelDataGenerator }