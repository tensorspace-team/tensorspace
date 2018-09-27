/**
 * @author syt123450 / https://github.com/syt123450
 * @author Charlesliuyx / https://github.com/Charlesliuyx
 */

let YoloResultGenerator = (function() {

    // utils function
    function sigmoid( x ) {

        return 1 / ( 1 + Math.pow( Math.E, - x ) );

    }

    function softmax( arr ) {

        const C = Math.max( ...arr );

        const d = arr.map( ( y ) => Math.exp( y - C ) ).reduce( ( a, b ) => a + b );

        return arr.map( ( value, index ) => {

            return Math.exp( value - C ) / d;

        } )

    }

    //TODO implement iou & nms

    function decode( modelOutput, featureMapSize = 13, num_class = 80 ) {

        // modelOutput : array [71825] = [13*13*5*(5+80)]

    }

    function checkRange(x, range) {

        return x >= 0 && x <= range;

    }

	function getChannelBox( channelData, channelShape, outputShape, anchors, cx, cy ) {

		let widthRange = channelShape[ 0 ];
		let heightRange = channelShape[ 1 ];

		let len = channelData.length / 5;

		let output = [];

		for ( let box = 0; box < anchors.length; box ++ ) {

			let index = box * len;
			let bx = ( sigmoid( channelData[ index ] ) + cx );
			let by = ( sigmoid( channelData[ index + 1 ] + cy) );
			let bw = anchors[ box * 2 ] * Math.exp( channelData[ index + 2 ] );
			let bh = anchors[ box * 2 + 1 ] * Math.exp( channelData[ index + 3 ] );

			if ( checkRange( bx, widthRange ) &&
				checkRange( by, heightRange ) &&
				checkRange( bw, widthRange ) &&
				checkRange( bh, heightRange ) ) {

				output.push( {

					x: bx / widthRange * outputShape[ 0 ],
					y: by / heightRange * outputShape[ 1 ],
					width: bw / widthRange * outputShape[ 0 ],
					height: bh  / heightRange * outputShape[ 1 ],

				} );

			}

		}

		return output;

	}

	return {

		getChannelBox: getChannelBox

	}

})();

export { YoloResultGenerator };