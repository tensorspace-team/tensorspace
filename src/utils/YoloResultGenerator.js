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

    function decodeEach( outputArr, featureMapSize, imagePixelSize, cx, cy ) {

        // outputArr : array [425] for coco; [125] for VOC
        // return the format rect coordinate, weight and height
        // cx is col of feature map [13, 13]
        // cy is row of feature map [13, 13]

        let anchors_config = [ 0.57273, 0.677385,
            1.87446, 2.06253,
            3.33843, 5.47434,
            7.88282, 3.52778,
            9.77052, 9.16828 ];

        const mapWidth = featureMapSize[ 0 ];
        const mapHeight = featureMapSize[ 1 ];

        const len = outputArr.length / 5;

        const output = [];

        for ( let box = 0; box < anchors_config.length; box ++ ) {

            const index = box * len;
            const bx = ( sigmoid( outputArr[ index ] ) + cx );
            const by = ( sigmoid( outputArr[ index + 1 ] + cy) );
            const bw = anchors_config[ box * 2 ] * Math.exp( outputArr[ index + 2 ] );
            const bh = anchors_config[ box * 2 + 1 ] * Math.exp( outputArr[ index + 3 ] );

            if ( checkRange( bx, 13 ) && checkRange( by, 13 ) && checkRange( bw, 13 ) && checkRange( bh, 13 )) {

                output.push( {

                    x: bx / mapWidth * imagePixelSize,
                    y: by / mapHeight * imagePixelSize,
                    width: bw / mapWidth * imagePixelSize,
                    height: bh  / mapHeight * imagePixelSize,

                } );

            }

        }

        return output;

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