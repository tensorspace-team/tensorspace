let model;
let signaturePad;

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

	$("#clear").click(function() {

		signaturePad.clear();
		model.clear();
		clearResult();

	});

	signaturePad = new SignaturePad( document.getElementById( 'signature-pad' ), {

		minWidth: 10,
		backgroundColor: 'rgba(255, 255, 255, 0)',
		penColor: 'rgb(214, 253, 255)',
		onEnd: executePredict

	} );

});

function createModel() {

	let container = document.getElementById( "modelArea" );

	model = new TSP.model.Sequential( container, {

		layerInitStatus: "close",
		aggregationStrategy: "max",
		layerShape: "rect",
		textSystem: "enable",
		relationSystem: "enable",
		animationTimeRatio: 0.1,
		stats: true,

		color: {

			background: 0x000000,
			conv2d: 0xffff2E,
			pooling2d: 0x00ffff,
			dense: 0x00ff00,
			padding2d: 0x6eb6ff

		}

	} );

	model.add( new TSP.layers.Input2d( {

		shape: [ 28, 28, 1 ],
		name: "initInput",
		color: 0xFFFFFF,

	} ) );

	model.add( new TSP.layers.Padding2d( {

		padding: [ 2, 2 ],

	} ) );

	let convLayer = new TSP.layers.Conv2d( {

		kernelSize: 5,
		filters: 6,
		strides: 1,
		name: "conv2d1",
		// initStatus: "open"

	} );

	model.add( convLayer );
// model.add( new TSP.layers.Conv2d( {
//
// 	kernelSize: 5,
// 	filters: 6,
// 	strides: 1,
// 	name: "conv2d1"
//
// } ) );

	model.add( new TSP.layers.Pooling2d( {

		poolSize: [ 2, 2 ],
		strides: [ 2, 2 ],

		name: "maxPool2d1"

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 5,
		filters: 16,
		strides: 1,
		name: "conv2d2"

	} ) );

	model.add( new TSP.layers.Pooling2d( {

		poolSize: [ 2, 2 ],
		strides: [ 2, 2 ],

		name: "maxPool2d2"

	} ) );

	let denseLayer = new TSP.layers.Dense( {

		units: 120,
		name: "dense1",
		animationTimeRatio: 1,

	} );

	model.add( denseLayer );

	model.add( new TSP.layers.Dense( {

		units: 84,
		name: "dense2",

	} ) );

	model.add( new TSP.layers.Output1d( {

		units: 10,
		outputs: [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ],
		name: "output"

	} ) );

	model.load( {

		type: "tfjs",
		url: '../../assets/model/lenet/mnist.json',

	} );

	model.init();

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

function executePredict() {

	let canvas = document.getElementById( "signature-pad" );
	let context = canvas.getContext( '2d' );
	let imgData = context.getImageData( 0, 0, canvas.width, canvas.height );

	let signatureData = [];

	for ( let i = 0; i < 224; i += 8 ) {

		for ( let j = 3; j < 896; j += 32 ) {

			signatureData.push( imgData.data[ 896 * i + j ] / 255 );

		}

	}

	model.predict( signatureData, function( predictResult ) {

		let index = getMaxConfidentNumber(predictResult);
		clearResult();
		highLightResult(index);

	});

}

function getMaxConfidentNumber( predictResult ) {

	let maxIndex = 0;

	for ( let i = 1; i < predictResult.length; i ++ ) {

		maxIndex = predictResult[ i ] > predictResult[ maxIndex ] ? i : maxIndex;

	}

	return maxIndex;

}

function highLightResult( index ) {

	let idString = "result" + index;
	$("#" + idString).css( {
		"color": "#D6FDFF"
	} );

}

function clearResult() {

	for ( let i = 0; i < 10; i ++ ) {

		let idString = "result" + i;
		$("#" + idString).css({
			"color": "#456989"
		});

	}

}