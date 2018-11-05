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

	function iou( boxA, boxB ) {

    	// boxA = boxB = [ x1, y1, x2, y2 ]
		// (x1, y1) for left-top point
		// (x2, y2) for right-bottom point

		let xA = Math.max( boxA[0], boxB[0] );
		let yA = Math.max( boxA[1], boxB[1] );
		let xB = Math.min( boxA[2], boxB[2] );
		let yB = Math.min( boxA[3], boxB[3] );

		// Compute the area of intersection
		let intersectionArea = ( xB - xA + 1) * ( yB - yA + 1 );

		// Compute the area of both rectangles
		let boxAArea = ( boxA[2] - boxA[0] + 1 ) * ( boxA[3] - boxA[1] + 1 );
		let boxBArea = ( boxB[2] - boxB[0] + 1 ) * ( boxB[3] - boxB[1] + 1 );

		// Compute the IOU
		return intersectionArea / ( boxAArea + boxBArea - intersectionArea );

	}

	function nonMaximalSuppression( thresholdedPredictions, iouThreshold ){

    	// thresholdedPredcitions: is an array with predictive results

		let nmsPredictions = [];

		nmsPredictions.push( thresholdedPredictions[0] );

		let i = 1;

		while (i < len(thresholdedPredictions) ) {

			let nBoxesToCheck = len(nmsPredictions);

			let toDelete = false;

			let j = 0;

			while ( j < nBoxesToCheck ) {

				let curIOU = iou( thresholdedPredictions[i][0], nmsPredictions[j][0] );

				if ( curIOU > iouThreshold ) {

					toDelete = true;

					j++;

				}

			}

			if ( toDelete === false )  {

				nmsPredictions.push( thresholdedPredictions[i] );

			}

			i++

		}

		return nmsPredictions;

	}

    function decode( modelOutput, featureMapSize = 13, num_class = 80 ) {

        // modelOutput : array [71825] = [13*13*5*(5+80)]

    }

    function checkRange(x, range) {

        return x >= 0 && x <= range;

    }

    function getDetectedBox( neuralData, channelDepth, channelShape, outputShape,
                             anchors, classLabelList, scoreThreshold = 0.5 ) {

        // neuralData : array [71825] for coco; [21125] for VOC
        // channelShape ： array = [13, 13]
        // outputShape : array = [416, 416] output image pixel

        let widthRange = channelShape[ 0 ];
        let heightRange = channelShape[ 1 ];

        let thresholdedPredictions = [];

        let output = [];

		for ( let row = 1; row <= widthRange; row ++ ) {

			for ( let col = 1; col <= heightRange; col ++ ) {

				let start = row * col - 1;

				let channelData = neuralData.slice( start * channelDepth, ( start + 1 ) * channelDepth );

                let len = channelData.length / 5;

				for ( let box = 0; box < anchors.length / 2; box ++ ) {

                    let index = box * len;
                    let bx = ( sigmoid( channelData[ index ] ) + col - 1 );
                    let by = ( sigmoid( channelData[ index + 1 ] ) + row - 1 );
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

                    if ( finalScore > scoreThreshold ) {

                        // console.log("Add 1 detective object");

                        output.push( {

                            x: x,
                            y: y,
                            width: width,
                            height: height,

                        } );

                        thresholdedPredictions.push( {
                            x: x,
                            y: y,
                            width: width,
                            height: height,
							finalScore: finalScore,
							className: bestClassLabel
                        } )

                    }

				}

			}

		}

		// console.log( thresholdedPredictions );

		return output;

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

		// console.log( "cx: " + cx + "| cy: " + cy );

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
                ( checkRange( bx, widthRange ) && checkRange( by, heightRange ) &&
				  checkRange( bw, widthRange ) && checkRange( bh, heightRange ) &&
				  finalScore > scoreThreshold
                )
            ) {

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

		getChannelBox: getChannelBox,

        getDetectedBox: getDetectedBox

	}

})();

export { YoloResultGenerator };