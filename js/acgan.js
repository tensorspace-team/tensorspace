let model;
let labelIndex = 0;

$(function() {

	createModel();

	$("#playgroundMenu").click(function() {
		moveInHiddenContent();
	});

	$("#curtain").click(function() {
		moveOutHiddenContent();
	});

	$("#close").hover(function() {
		$("#close").attr("src", "../../assets/img/docs/close_hover.png");
	}, function() {
		$("#close").attr("src", "../../assets/img/docs/close.png");
	}).click(function() {
		moveOutHiddenContent();
	});

	$("#labelHolder > button").click(function() {
		clearPreviousIndex();
		labelIndex = parseInt($(this).attr("data-index"));

		$(this).css( {
			"background-color": "#D6FDFF",
			"color": "#000000"
		} );

	});

	$("#generateButton").click(function() {
		generateDigitImage();
	});

});

function createModel() {

	let container = document.getElementById( "modelArea" );

	model = new TSP.model.Sequential(container, {
		aggregationStrategy: "average",
		layerShape: "rect",
		layerInitStatus: "close",
		stats: true,
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

	model.init(function() {

		generateDigitImage();
		$("#loadingPad").hide();

	});

}

function moveInHiddenContent() {

	$("#playgroundNav").animate({
		left:"+=200px"
	},500);
	$("#curtain").fadeIn(500);

}

function moveOutHiddenContent() {

	$("#playgroundNav").animate({
		left:"-=200px"
	},500);
	$("#curtain").fadeOut(500);

}

function clearPreviousIndex() {

	$("#labelHolder > button").each(function() {
		$(this).css({
			"background-color": "#233D45",
			"color": "#D6FDFF"
		});
	})

}

function generateDigitImage() {

	let randomData = tf.randomNormal([1,100]).dataSync();
	model.predict( [randomData, [labelIndex]] );

}