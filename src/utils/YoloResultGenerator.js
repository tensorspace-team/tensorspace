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

	function getChannelBox( channelData, channelShape, outputShape,
                            anchors, classLabelList, scoreThreshold, isDrawFiveBoxes,
							cx, cy ) {

        // channelData : array [425] for coco; [125] for VOC
        // channelShape ： array [2] [13, 13]
        // outputShape : array [2] [416, 416] output image pixel
        // cx is col of feature map [13, 13]
        // cy is row of feature map [13, 13]

		let widthRange = channelShape[ 0 ];
		let heightRange = channelShape[ 1 ];

		let len = channelData.length / 5;

		let output = [];

		for ( let box = 0; box < anchors.length / 2; box ++ ) {

			let index = box * len;
			let bx = ( sigmoid( channelData[ index ] ) + cx );
			let by = ( sigmoid( channelData[ index + 1 ] ) + cy );
			let bw = anchors[ box * 2 ] * Math.exp( channelData[ index + 2 ] );
			let bh = anchors[ box * 2 + 1 ] * Math.exp( channelData[ index + 3 ] );

            // console.log("------------------Index: " + index + " ----------------------");
            // console.log( "bx: " + bx + " | by: " + by );
            // console.log( "bw: " + bw + " | bh: " + bh );

			let finalConfidence = sigmoid( channelData[ index + 4 ] );

			let classPrediction = softmax( channelData.slice( index + 5, index + 5 + len ) );

			let bestClassIndex = classPrediction.indexOf( Math.max( ...classPrediction ) );

			let bestClassLabel = classLabelList[ bestClassIndex ];

			let bestClassScore = classPrediction[ bestClassIndex ];

			let finalScore = bestClassScore * finalConfidence;

            // console.log("Class name: " + bestClassLabel + "| Prediction score: " + bestClassScore);
            // console.log("Final Score: " + finalScore);

			let width = bw / widthRange * outputShape[ 0 ];
			let height = bh  / heightRange * outputShape[ 1 ];
			let x = bx / widthRange * outputShape[ 0 ] - width / 2;
			let y = by / heightRange * outputShape[ 1 ] - height / 2;

            if ( isDrawFiveBoxes ||
                ( checkRange( bx, widthRange ) &&
                    checkRange( by, heightRange ) &&
                    checkRange( bw, widthRange ) &&
                    checkRange( bh, heightRange ) &&
                    finalScore > scoreThreshold
                )
            )
            {

            	// console.log("Class name: " + bestClassLabel + " | Confidence Score: " + finalScore);

				output.push( {

					x: x,
					y: y,
					width: width,
					height: height,

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