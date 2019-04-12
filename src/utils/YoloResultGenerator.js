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

    // Ascend
    function sortBy(field) {

        return function(a,b) {

            return b[field] - a[field];

        }

    }

	function transferPrediction( prediction ) {

    	// prediction = {x:, y:, width:, height:, finalScore:, labelName:}
		// return a list of [ x1, y1, x2, y2]

    	let list = [];

    	list.push( prediction["x"] );
    	list.push( prediction["y"] );
    	list.push( prediction["x"] + prediction["width"]);
    	list.push( prediction["y"] + prediction["height"]);

    	return list;

	}

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

		let toDelete = false;

		while ( i < thresholdedPredictions.length ) {

			let nBoxesToCheck = nmsPredictions.length;

			toDelete = false;

			let j = 0;

			while ( j < nBoxesToCheck ) {

				let boxA = transferPrediction( thresholdedPredictions[i] );

				let boxB = transferPrediction( nmsPredictions[j] );

				let curIOU = iou( boxA, boxB );

				if ( curIOU > iouThreshold ) {

					toDelete = true;

				}

                j++;

			}

			if ( toDelete === false )  {

				nmsPredictions.push( thresholdedPredictions[i] );

			}

			i++;

		}

		return nmsPredictions;

	}

    function checkRange(x, range) {

        return x >= 0 && x <= range;

    }

    function getDetectedBox( neuralData, channelDepth, channelShape, outputShape,
                             anchors, classLabelList, scoreThreshold, iouThreshold,
							 isNMS) {

        // neuralData : array [71825] for coco; [21125] for VOC
        // channelShape ： array = [13, 13]
        // outputShape : array = [416, 416] output image pixel


		let gridWidth = channelShape[ 0 ];
        let gridHeight = channelShape[ 1 ];

        let thresholdedPredictions = [];

        let output = [];

		for ( let row = 0; row < gridHeight; row ++ ) {

			for ( let col = 0; col < gridWidth; col ++ ) {

				let start = row * gridWidth + col;

				let channelData = neuralData.slice( start * channelDepth, ( start + 1 ) * channelDepth );

                let len = channelData.length / 5;

				for ( let box = 0; box < anchors.length / 2; box ++ ) {

                    let index = box * len;
                    let bx = ( sigmoid( channelData[ index ] ) + col );
                    let by = ( sigmoid( channelData[ index + 1 ] ) + row );
                    let bw = anchors[ box * 2 ] * Math.exp( channelData[ index + 2 ] );
                    let bh = anchors[ box * 2 + 1 ] * Math.exp( channelData[ index + 3 ] );

                    let finalConfidence = sigmoid( channelData[ index + 4 ] );

                    let probability = channelData.slice( index + 5, index + len );

                    let classPrediction = softmax( probability );

                    let bestClassIndex = classPrediction.indexOf( Math.max( ...classPrediction ) );

                    let bestClassLabel = classLabelList[ bestClassIndex ];

                    let bestClassScore = classPrediction[ bestClassIndex ];

                    let finalScore = bestClassScore * finalConfidence;

                    let width = bw / gridWidth * outputShape[ 0 ];
                    let height = bh  / gridHeight * outputShape[ 1 ];
                    let x = bx / gridWidth * outputShape[ 0 ] - width / 2;
                    let y = by / gridHeight * outputShape[ 1 ] - height / 2;

                    if ( finalScore > scoreThreshold ) {

                        thresholdedPredictions.push( {
                            "x": x,
                            "y": y,
                            "width": width,
                            "height": height,
							"finalScore": finalScore,
							"className": bestClassLabel
                        } );

                        if ( isNMS === false ) {

                            output.push( {

                                x: x,
                                y: y,
                                width: width,
                                height: height

                            });

                        }

                    }

				}

			}

		}

		thresholdedPredictions.sort(sortBy("finalScore"));

		let nmsPredictions = nonMaximalSuppression( thresholdedPredictions, iouThreshold );

		if ( isNMS === true ) {

            for ( let i = 0; i < nmsPredictions.length; i++ ) {

                output.push( {

                    x: nmsPredictions[i]["x"],
                    y: nmsPredictions[i]["y"],
                    width: nmsPredictions[i]["width"],
                    height: nmsPredictions[i]["height"],
					finalScore: nmsPredictions[i]["finalScore"],
					className: nmsPredictions[i]["className"],

                });

            }

		}

		// console.log( output );

		return output;

	}

	function getChannelBox( channelData, channelShape, outputShape,
                            anchors, classLabelList, scoreThreshold, iouThreshold, isDrawFiveBoxes,
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

			let finalConfidence = sigmoid( channelData[ index + 4 ] );

			let classPrediction = softmax( channelData.slice( index + 5, index + len ) );

			let bestClassIndex = classPrediction.indexOf( Math.max( ...classPrediction ) );

			let bestClassScore = classPrediction[ bestClassIndex ];

			let finalScore = bestClassScore * finalConfidence;

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