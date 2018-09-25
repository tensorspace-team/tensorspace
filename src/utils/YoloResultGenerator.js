/**
 * @author syt123450 / https://github.com/syt123450
 * @author Charlesliuyx / https://github.com/Charlesliuyx
 */

let YoloResultGenerator = (function() {

    // utils function
    function sigmoid(x) {

        return 1 / ( 1 + Math.pow(Math.E, -x) );

    }

    function softmax(arr) {

        const C = Math.max(...arr);

        const d = arr.map( ( y ) => Math.exp( y - C ) ).reduce( (a, b) => a + b );

        return arr.map( ( value, index ) => {
            return Math.exp( value - C ) / d;
        } )

    }

    //TODO implement iou & nms
    function decode(modelOutput, featureMapSize=13, num_class=80) {
        // modelOutput : array [71825] = [13*13*5*(5+80)]

    }

    function checkRange(x, range) {

        return x >= 0 && x <= range;

    }

    function decodeEach(outputArr, featureMapSize, imagePixelSize, cx, cy) {
        // outputArr : array [425] for coco; [125] for VOC
        // return the format rect coordinate, weight and height
        // cx is col of feature map [13, 13]
        // cy is row of feature map [13, 13]

        let anchors_config = [ 0.57273, 0.677385,
            1.87446, 2.06253,
            3.33843, 5.47434,
            7.88282, 3.52778,
            9.77052, 9.16828 ];

        const W = featureMapSize[0];
        const H = featureMapSize[1];

        const len = outputArr.length / 5;

        const output = [];

        for ( let box = 0; box < 5; box++ ) {

            const index = box * len;
            const bx = ( sigmoid(outputArr[index]) + cx );
            const by = ( sigmoid(outputArr[index + 1] + cy) );
            const bw = anchors_config[box*2] * Math.exp( outputArr[index + 2] );
            const bh = anchors_config[box*2 + 1] * Math.exp( outputArr[index + 3] );

            // log for test
            console.log("---------------Index: " + box);
            console.log("bx[0-13]: " + bx);
            console.log("by[0-13]: " + by);
            console.log("bw[0-13]: " + bw);
            console.log("bh[0-13]: " + bh);
            console.log("Raw data tw: " + outputArr[index + 2]);
            console.log("Raw data th: " + outputArr[index + 3]);

            if ( checkRange( bx, 13 ) && checkRange( by, 13 ) && checkRange( bw, 13 ) && checkRange( bh, 13 )) {

                output.push({

                    x: bx / W * imagePixelSize,
                    y: by / H * imagePixelSize,
                    width: bw / W * imagePixelSize,
                    height: bh  / H * imagePixelSize,

                });

            }

        }

        return output;

    }


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