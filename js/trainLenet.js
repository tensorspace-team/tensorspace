// predict digit data
let digitData;
// Mnist data set;
let data;
let selectedDiv = undefined;

let batches = 0;

let tfjsLoadModel, tfjsTrainingModel, tspModel;

let isTraining = true;

let dataIndex = "5";

$(function() {

	load();

	$("#changeTest").click(function() {
		showSelector();
	});

	$("#resetTrain").click(function() {
		isTraining = false;
		batches = 0;

		$("#batchNum").html( "0" );
		$("#lossNum").html( "?" );
		$("#accuracyNum").html( "?" );
		$("#inferenceNum").html( "?" );

		[ tfjsLoadModel, tfjsTrainingModel ] = constructorTfjsModel();

		tspModel.load( {

			type: "live",
			modelHandler: tfjsLoadModel

		}, function() {

			tspModel.predict( digitData );

		} );

	});

	$("#startTrain").click(function() {
		isTraining = true;

		train();

	});

	$("#stopTrain").click(function() {
		isTraining = false;
	});

	$("#cancelPredict").click(function() {
		hideSelector();
	});

	$("#selectorCurtain").click(function() {
		hideSelector();
	});

	$("#selector > main > div > img").click(function() {
		$(this).css("border", "1px solid #6597AF");
		if (selectedDiv !== undefined) {
			$("#data" + selectedDiv).css("border", "0");
		}
		selectedDiv = $(this).attr('id').substring(4);
	});

	$("#executePredict").click(function() {

		dataIndex = selectedDiv;
		hideSelector();
		getDigitData();

	});

	[ tfjsLoadModel, tfjsTrainingModel ] = constructorTfjsModel();
	tspModel = constructorTspModel();

	tspModel.load( {

		type: "live",
		modelHandler: tfjsLoadModel

	} );

	tspModel.init( function() {

		getDigitData();

	} );

});

function getDigitData() {

	$.ajax( {

		url: "../../assets/data/digit/" + dataIndex + ".json",
		type: 'GET',
		async: true,
		dataType: 'json',
		success: function ( data ) {

			digitData = data;
			tspModel.predict( digitData );

		}

	} );

}

function constructorTfjsModel() {

	let input = tf.input( {

		shape: [ 28, 28, 1 ],
		name: "mnistInput"
	} );

	let padding2d = tf.layers.zeroPadding2d( {

		padding: [ 2, 2 ],
		name: "myPadding"
	} );

	let conv1 = tf.layers.conv2d( {

		kernelSize: 5,
		filters: 6,
		strides: 1,
		activation: 'relu',
		kernelInitializer: 'VarianceScaling',
		name: "myConv1"

	} );

	let maxPool1 = tf.layers.maxPooling2d( {

		poolSize: [ 2, 2 ],
		strides: [ 2, 2 ],
		name: "myMaxPooling1"
	} );

	let conv2 = tf.layers.conv2d( {

		kernelSize: 5,
		filters: 16,
		strides: 1,
		activation: 'relu',
		kernelInitializer: 'VarianceScaling',
		name: "myConv2"

	} );

	let maxPool2 = tf.layers.maxPooling2d( {

		poolSize: [ 2, 2 ],
		strides: [ 2, 2 ],
		name: "myMaxPooling2"

	} );

	let flatten = tf.layers.flatten( {

		name: "myFlatten"

	} );

	let dense1 = tf.layers.dense( {

		units: 120,
		kernelInitializer: 'VarianceScaling',
		activation: 'relu',
		name: "myDense1"

	} );

	let dense2 = tf.layers.dense( {

		units: 84,
		kernelInitializer: 'VarianceScaling',
		activation: 'relu',
		name: "myDense2"

	} );

	let dense3 = tf.layers.dense( {

		units: 10,
		kernelInitializer: 'VarianceScaling',
		activation: 'softmax',
		name: "myDense3"

	} );

	let paddingOutput = padding2d.apply( input );
	let conv1Output = conv1.apply( paddingOutput );
	let maxPool1Output = maxPool1.apply( conv1Output );
	let conv2Output = conv2.apply( maxPool1Output );
	let maxPool2Output = maxPool2.apply( conv2Output );
	let flattenOutput = flatten.apply( maxPool2Output );
	let dense1Output = dense1.apply( flattenOutput );
	let dense2Output = dense2.apply( dense1Output );
	let dense3Output = dense3.apply( dense2Output );

	let tfjsLoadModel = tf.model( {

		inputs: input,
		outputs: [ paddingOutput, conv1Output, maxPool1Output, conv2Output, maxPool2Output, dense1Output, dense2Output, dense3Output ]

	} );

	let tfjsTrainingModel = tf.model( {

		inputs: input,
		outputs: dense3Output

	} );

	tfjsTrainingModel.compile( {

		optimizer: tf.train.adam( 0.0001 ),
		loss: 'categoricalCrossentropy',
		metrics: [ 'accuracy' ],

	} );

	return [ tfjsLoadModel, tfjsTrainingModel ];

}

function constructorTspModel() {

	let modelContainer = document.getElementById( "modelArea" );

	let tspModel = new TSP.models.Sequential( modelContainer, {

		animationTimeRatio: 0.1,
		stats: true

	} );

	tspModel.add( new TSP.layers.GreyscaleInput( {

		shape: [ 28, 28, 1 ],
		color: 0xFFFFFF,
		name: "initInput"

	} ) );

	tspModel.add( new TSP.layers.Padding2d( {

		padding: [ 2, 2 ],
		name: "padding"

	} ) );

	tspModel.add( new TSP.layers.Conv2d( {

		kernelSize: 5,
		filters: 6,
		strides: 1,
		name: "conv2d1",
		initStatus: "open"

	} ) );

	tspModel.add( new TSP.layers.Pooling2d( {

		poolSize: [ 2, 2 ],
		strides: [ 2, 2 ],
		name: "maxPool2d1"

	} ) );

	tspModel.add( new TSP.layers.Conv2d( {

		kernelSize: 5,
		filters: 16,
		strides: 1,
		name: "conv2d2"

	} ) );

	tspModel.add( new TSP.layers.Pooling2d( {

		poolSize: [ 2, 2 ],
		strides: [ 2, 2 ],
		name: "maxPool2d2"

	} ) );

	tspModel.add( new TSP.layers.Dense( {

		units: 120,
		name: "dense1"

	} ) );

	tspModel.add( new TSP.layers.Dense( {

		units: 84,
		name: "dense2",

	} ) );

	tspModel.add( new TSP.layers.Output1d( {

		units: 10,
		outputs: [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ],
		name: "output",
		initStatus: "open"

	} ) );

	return tspModel;

}

async function load() {

	data = new MnistData();
	await data.load();

}

async function train() {

	const BATCH_SIZE = 20;
	const TRAIN_BATCHES = 1000;

	const TEST_BATCH_SIZE = 1000;
	const TEST_ITERATION_FREQUENCY = 5;

	for ( ; batches < TRAIN_BATCHES; batches ++ ) {

		if ( !isTraining ) {
			break;
		}

		let batch = data.nextTrainBatch( BATCH_SIZE );

		let testBatch = undefined;
		let validationData = undefined;

		if ( batches % TEST_ITERATION_FREQUENCY === 0 ) {

			testBatch = tf.tidy(() => {

				return data.nextTestBatch( TEST_BATCH_SIZE );

			});

			validationData = [

				testBatch.xs.reshape( [ TEST_BATCH_SIZE, 28, 28, 1 ] ), testBatch.labels

			];

		}

		let trainingInputTensor = batch.xs.reshape( [ BATCH_SIZE, 28, 28, 1 ] );

		const history = await tfjsTrainingModel.fit(

			trainingInputTensor,
			batch.labels,
			{

				batchSize: BATCH_SIZE,
				validationData,
				epochs: 1

			}
		);

		if ( batches % TEST_ITERATION_FREQUENCY === 0 ) {

			$("#batchNum").html( batches );

			const loss = history.history.loss[0].toFixed(3);
			$("#lossNum").html(loss);

			const accuracy = history.history.acc[ 0 ].toFixed(3);
			$("#accuracyNum").html( accuracy );

			tspModel.predict( digitData, function( result ) {

				let reference = getInference( result );

				$("#inferenceNum").html( reference );

			} );

		}

		tf.dispose( batch );
		tf.dispose( trainingInputTensor );

		if ( testBatch !== undefined ) {
			tf.dispose( testBatch );
		}

		if ( validationData !== undefined ) {
			tf.dispose( validationData );
		}

	}

}

function showSelector() {
	$("#selector").show();
	$("#selectorCurtain").show();
}

function hideSelector() {
	$("#selector").hide();
	$("#selectorCurtain").hide();
	if (selectedDiv !== undefined) {
		$("#data" + selectedDiv).css("border", "0");
	}
	selectedDiv = undefined;
}

function getInference( result ) {

	let index = 0;

	for ( let i = 0; i < result.length; i ++ ) {

		index = result[ i ] > result[ index ] ? i : index;

	}

	return index;

}