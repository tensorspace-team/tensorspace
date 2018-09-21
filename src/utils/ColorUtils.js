/**
 * @author syt123450 / https://github.com/syt123450
 */

let ColorUtils = ( function() {

	function getAdjustValues( values, minAlpha ) {

		let max = values[ 0 ], min = values[ 0 ];

		for ( let i = 1; i < values.length; i++ ) {

			if ( values[ i ] > max ) {

				max = values[i];

			}

			if ( values[ i ] < min ) {

				min = values[ i ];

			}

		}

		let adjustValues = [];
		let distance = max - min;

		for ( let i = 0; i < values.length; i++ ) {

			if ( distance === 0 ) {

				adjustValues.push( min );

			} else {

				adjustValues.push( ( values[ i ] - min ) / distance );

			}

		}

		for ( let i = 0; i < adjustValues.length; i++ ) {

			adjustValues[ i ] = minAlpha + adjustValues[ i ] * ( 1 - minAlpha );

		}

		// console.log(adjustValues);

		return adjustValues;

	}

	function getColors( values ) {

		let adjustValues = this.getAdjustValues( values );

		let colorList = [];

		for ( let i = 0; i < adjustValues.length; i++ ) {

			let rgbTriple = [];

			for ( let j = 0; j < 3; j++ ) {

				rgbTriple.push( adjustValues[ i ] );

			}

			colorList.push( rgbTriple );

		}

		return colorList;

	}

	return {

		getAdjustValues: getAdjustValues,

		getColors: getColors

	}

} )();

export { ColorUtils };