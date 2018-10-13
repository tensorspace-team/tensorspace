$(function() {

	let container = document.getElementById( "modelArea" );

	let model = new TSP.model.Sequential( container, {

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

});