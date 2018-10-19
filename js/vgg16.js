let model;
let imagenetResult;
let predictDataKey = "diling";
let selectedDiv = undefined;

let dataLookup = {

	diling: {

		relativeDiv: "data1",
		dataUrl: "../../assets/data/dilingdiling.json",
		imageUrl: "../../assets/img/playground/dilingdiling.jpg"

	},

	doraemon: {

		relativeDiv: "data2",
		dataUrl: "../../assets/data/doraemon.json",
		imageUrl: "../../assets/img/playground/doraemon.jpg"

	}

};

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

	$("#selector > main > div > img").click(function() {
		$(this).css("border", "1px solid #6597AF");
		selectedDiv = $(this).attr('id');
	});

	$("#cancelPredict").click(function() {
		hideSelector()
	});

	$("#selectorCurtain").click(function() {
		hideSelector();
	});

	$("#selectorTrigger").click(function() {
		showSelector();
	});

	$("#executePredict").click(function() {

		updatePredictDataKey();
		hideSelector();
		getDataAndPredict(function(finalResult) {
			$("#labelImage").attr("src", dataLookup[ predictDataKey ].imageUrl);
			console.log(generateInference( finalResult ));
		});

	});

});

function createModel() {

	let container = document.getElementById( "modelArea" );

	model = new TSP.model.Sequential( container, {

		aggregationStrategy: "average",
		layerShape: "rect",
		layerInitStatus: "close",
		stats: true,
		color: {

			conv2d: 0xff00ff,
			pooling2d: 0x00ffff

		}

	} );

	model.add( new TSP.layers.Input3d( {

		shape: [ 224, 224, 3 ]

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 64,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 64,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Pooling2d( {

		poolSize: [ 2, 2 ],
		strides: [ 2, 2 ]

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 128,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 128,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Pooling2d( {

		poolSize: [ 2, 2 ],
		strides: [ 2, 2 ]

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 256,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 256,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 256,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Pooling2d( {

		poolSize: [ 2, 2 ],
		strides: [ 2, 2 ]

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 512,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 512,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 512,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Pooling2d( {

		poolSize: [ 2, 2 ],
		strides: [ 2, 2 ]

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 512,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 512,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 512,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Pooling2d( {

		poolSize: [ 2, 2 ],
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

		type: "tfjs",
		url: '../../assets/model/vgg16/model.json'

	} );

	model.init( function() {

		getDataAndPredict( function( finalResult ) {
			$( "#loadingPad" ).hide();

			generateInference( finalResult );

		} );

	} );

}

function getDataAndPredict( callback ) {

	$.ajax({
		url: dataLookup[ predictDataKey ].dataUrl,
		type: 'GET',
		async: true,
		dataType: 'json',
		success: function (data) {

			model.predict( data, function( finalResult ){

				if ( callback !== undefined ) {
					callback( finalResult );
				}

			} );

		}
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

function showSelector() {
	$("#selector").show();
	$("#selectorCurtain").show();
}

function hideSelector() {
	$("#selector").hide();
	$("#selectorCurtain").hide();
	selectedDiv = undefined;
}

function updatePredictDataKey() {

	for ( let key in dataLookup ) {

		if ( dataLookup[ key ].relativeDiv === selectedDiv ) {

			predictDataKey = key;
			break;

		}

	}

}

function generateInference( finalResult ) {

	let maxIndex = 0;

	for ( let i = 1; i < finalResult.length; i ++ ) {

		maxIndex = finalResult[ i ] > finalResult[ maxIndex ] ? i : maxIndex;

	}

	$("#PredictResult").text(imagenetResult[ maxIndex ]);

}