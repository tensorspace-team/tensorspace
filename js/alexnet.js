let model;
let imagenetResult;

$(function() {

	$.ajax({
		url: '../../assets/data/imagenet_result.json',
		type: 'GET',
		async: true,
		dataType: 'json',
		success: function (data) {

			imagenetResult = data;
			createModel();

		}
	});

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

});

function createModel() {

	let container = document.getElementById("modelArea");

	let model = new TSP.model.Sequential( container, {

		layerShape: "rect",
		layerInitStatus: "close",
		stats: true,
		color: {

			input3d: 0x00ff00,
			conv2d: 0xff00ff,
			pooling2d: 0x00ffff

		}

	} );

	model.add( new TSP.layers.Input3d( {

		shape: [ 227, 227, 3 ]

	} ) );

	model.add( new TSP.layers.Conv2d( {

		filters: 96,
		kernelSize: 11,
		strides: 4

	} ) );

	model.add( new TSP.layers.Pooling2d( {

		poolSize: [ 3, 3 ],
		strides: [ 2, 2 ]

	} ) );

	model.add( new TSP.layers.Conv2d( {

		filters: 256,
		kernelSize: 5,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Pooling2d( {

		poolSize: [ 3, 3 ],
		strides: [ 2, 2 ]

	} ) );

	model.add( new TSP.layers.Conv2d( {

		filters: 384,
		kernelSize: 3,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		filters: 384,
		kernelSize: 3,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		filters: 256,
		kernelSize: 3,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Pooling2d( {

		poolSize: [ 3, 3 ],
		strides: [ 2, 2 ]

	} ) );

	model.add( new TSP.layers.Dense( {

		units: 4096,
		paging: true,
		segmentLength: 400

	} ) );

	model.add( new TSP.layers.Dense( {

		units: 4096,
		paging: true,
		segmentLength: 400

	} ) );

	model.add( new TSP.layers.Output1d( {

		units: 1000,
		paging: true,
		segmentLength: 400,
		outputs: imagenetResult

	} ) );

	model.load( {

		type: "tensorflow",
		modelUrl: "../../assets/model/alexnet/tensorflowjs_model.pb",
		weightUrl: "../../assets/model/alexnet/weights_manifest.json",
		outputsName: [ "norm1", "pool1", "norm2", "pool2", "conv3_1", "conv4_1", "conv5_1", "pool5", "Relu", "Relu_1", "Softmax" ]

	} );

	model.init( function() {

		$.ajax({
			url: '../../assets/data/pikapika.json',
			type: 'GET',
			async: true,
			dataType: 'json',
			success: function (data) {
				model.predict( data, function(){
					$( "#loadingPad" ).hide();
				} );

			}
		});

	} );

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