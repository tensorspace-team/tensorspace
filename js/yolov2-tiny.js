let model;
let predictDataKey = "three";
let selectedDiv = undefined;
let outputDetectionLayer;

let dataLookup = {

	three: {

		relativeDiv: "data1",
		dataUrl: "../../assets/data/33.json",
		imageUrl: "../../assets/img/playground/33.jpg"

	},

	bird: {

		relativeDiv: "data2",
		dataUrl: "../../assets/data/bird.json",
		imageUrl: "../../assets/img/playground/bird.jpg"

	}

};

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
		getDataAndPredict(function() {
			$("#labelImage").attr("src", dataLookup[ predictDataKey ].imageUrl);
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

		shape: [ 416, 416, 3 ]

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 16,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Pooling2d( {

		poolSize: [ 2, 2 ],
		strides: [ 2, 2 ]

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 32,
		strides: 1,
		padding: "same"

	} ) );

	model.add( new TSP.layers.Pooling2d( {

		poolSize: [ 2, 2 ],
		strides: [ 2, 2 ]

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

	model.add( new TSP.layers.Pooling2d( {

		poolSize: [ 2, 2 ],
		strides: [ 1, 1 ],
		padding: "same"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 1024,
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

		kernelSize: 1,
		filters: 125,
		strides: 1

	} ) );

	let yoloGrid = new TSP.layers.YoloGrid( {

		anchors: [ 1.08, 1.19, 3.42, 4.41, 6.63, 11.38, 9.42, 5.11, 16.62, 10.52 ],

		//voc class label name list
		classLabelList: [ "aeroplane", "bicycle", "bird", "boat", "bottle",
			"bus", "car", "cat", "chair", "cow",
			"diningtable", "dog", "horse", "motorbike", "person",
			"pottedplant", "sheep", "sofa", "train", "tvmonitor" ],

		// defualt is 0.5
		scoreThreshold: 0.1,

		// default is true
		isDrawFiveBoxes: true,

		onCeilClicked: onYoloCeilClicked

	} );

	model.add( yoloGrid );

	outputDetectionLayer = new TSP.layers.OutputDetection();

	model.add( outputDetectionLayer );

	model.load( {

		type: "tensorflow",
		modelUrl: "../../assets/model/yolov2-tiny/tensorflowjs_model.pb",
		weightUrl: "../../assets/model/yolov2-tiny/weights_manifest.json",
		outputsName: [ "Maximum", "Const_1", "Maximum_1", "Const_2", "Maximum_2",
			"Const_3", "Maximum_3", "Const_4", "Maximum_4", "Const_5",
			"Maximum_5", "Const_6", "Const_7", "Const_8", "add_8" ],
	} );

	model.init( function() {

		getDataAndPredict( function() {
			$( "#loadingPad" ).hide();
		} )

	} );

}

function onYoloCeilClicked( ceilData, rectList ) {

	outputDetectionLayer.addRectangleList( rectList );

	if ( !outputDetectionLayer.isOpen ) {

		outputDetectionLayer.openLayer();

	}

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

function getDataAndPredict( callback ) {

	$.ajax({
		url: dataLookup[ predictDataKey ].dataUrl,
		type: 'GET',
		async: true,
		dataType: 'json',
		success: function (data) {

			model.predict( data, function(){

				if ( callback !== undefined ) {
					callback();
				}

			} );

		}
	});

}

function updatePredictDataKey() {

	for ( let key in dataLookup ) {

		if ( dataLookup[ key ].relativeDiv === selectedDiv ) {

			predictDataKey = key;
			break;

		}

	}

}