$(function() {

	let container = document.getElementById( "modelArea" );

	let model = new TSP.model.Sequential(container, {
		aggregationStrategy: "average",
		layerShape: "rect",
		layerInitStatus: "close",
		color: {
			conv2d: 0xff00ff,
			pooling2d: 0x00ffff
		}
	});

	// input_1: [1,100]
	model.add(new TSP.layers.Input1d({
		shape: [100]
	}));

	// 0
	// output: (128*7*7=) 6272
	model.add(new TSP.layers.Dense({
		units: 6272,
		paging: true,
		segmentLength: 400,
		overview: true
	}));

	// 1
	// output: 128*7*7 = 6272
	model.add(new TSP.layers.Reshape({
		targetShape: [7, 7]
	}));

	// 2
	// output: 128*14*14 = 25088
	model.add(new TSP.layers.UpSampling2d({
		size: [2, 2]
	}));

	// 3
	// output: 128*14*14 = 25088
	model.add(new TSP.layers.Conv2d({
		kernelSize: 3,
		filters: 128,
		strides: 1,
		padding: "same"
	}));

	// 4
	// output: 128*28*28 = 100352
	model.add(new TSP.layers.UpSampling2d({
		size: [2, 2]
	}));

	// 5
	// output: 64*28*28 = 50176
	model.add(new TSP.layers.Conv2d({
		kernelSize: 3,
		filters: 64,
		strides: 1,
		padding: "same"
	}));

	// 6
	// output: 1*28*28 = 784
	model.add(new TSP.layers.Conv2d({
		kernelSize: 3,
		filters: 1,
		strides: 1,
		padding: "same"
	}));

	model.load({
		type: "tfjs",
		url: '../../assets/model/acgan/model.json',
		multiInputs: true,
		inputShapes: [[100], [1]]
	});

	let randomData = tf.randomNormal([1,100]).dataSync();

	model.init(function() {

		model.predict( [randomData, [0]] );
		$("#loadingPad").hide();

	});

});