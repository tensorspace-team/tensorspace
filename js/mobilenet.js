let model;
let imagenetResult;
let predictDataKey = "panda";
let selectedDiv = undefined;

let dataLookup = {

	panda: {

		relativeDiv: "data1",
		dataUrl: "../../assets/data/panda.json",
		imageUrl: "../../assets/img/playground/panda.jpg"

	},

	tigerCat: {

		relativeDiv: "data2",
		dataUrl: "../../assets/data/tigerCat.json",
		imageUrl: "../../assets/img/playground/tigerCat.jpg"

	},

	hummingbird: {

		relativeDiv: "data3",
		dataUrl: "../../assets/data/hummingbird.json",
		imageUrl: "../../assets/img/playground/hummingbird.jpg"

	},

	peacock: {

		relativeDiv: "data4",
		dataUrl: "../../assets/data/peacock.json",
		imageUrl: "../../assets/img/playground/peacock.jpg"

	},

	squirrel: {

		relativeDiv: "data5",
		dataUrl: "../../assets/data/squirrel.json",
		imageUrl: "../../assets/img/playground/squirrel.jpg"

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

	$("#selector > main > div > img").click(function() {
		$(this).css("border", "1px solid #6597AF");
		if (selectedDiv !== undefined) {
			$("#" + selectedDiv).css("border", "0");
		}
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
			generateInference( finalResult );
		});

	});

});

function createModel() {

	let container = document.getElementById( "modelArea" );

	model = new TSP.models.Sequential( container, {

		stats: true

	} );

	model.add( new TSP.layers.RGBInput( {

		shape: [ 224, 224, 3 ]

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 32,
		strides: 2,
		padding: "same"

	} ) );

	model.add( new TSP.layers.DepthwiseConv2d( {

		kernelSize: 3,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 64,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.DepthwiseConv2d( {

		kernelSize: 3,
		strides: 2,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 128,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.DepthwiseConv2d( {

		kernelSize: 3,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 128,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.DepthwiseConv2d( {

		kernelSize: 3,
		strides: 2,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 256,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.DepthwiseConv2d( {

		kernelSize: 3,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 256,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.DepthwiseConv2d( {

		kernelSize: 3,
		strides: 2,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 512,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.DepthwiseConv2d( {

		kernelSize: 3,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 512,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.DepthwiseConv2d( {

		kernelSize: 3,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 512,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.DepthwiseConv2d( {

		kernelSize: 3,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 512,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.DepthwiseConv2d( {

		kernelSize: 3,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 512,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.DepthwiseConv2d( {

		kernelSize: 3,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 512,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.DepthwiseConv2d( {

		kernelSize: 3,
		strides: 2,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 1024,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.DepthwiseConv2d( {

		kernelSize: 3,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 1024,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.GlobalPooling2d() );

	model.add( new TSP.layers.Output1d( {

		units: 1000,
		paging: true,
		segmentLength: 200,
		outputs: imagenetResult

	} ) );

	model.load( {

		type: "tfjs",
		url: '../../assets/model/mobilenetv1/model.json'

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

function showSelector() {
	$("#selector").show();
	$("#selectorCurtain").show();
}

function hideSelector() {
	$("#selector").hide();
	$("#selectorCurtain").hide();
	if (selectedDiv !== undefined) {
		$("#" + selectedDiv).css("border", "0");
	}
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

	console.log( imagenetResult[ maxIndex ] );

	$("#PredictResult").text(imagenetResult[ maxIndex ]);

}