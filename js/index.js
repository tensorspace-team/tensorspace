let model;

$(function() {

	$("#more").click(function() {

		if ($("#nav-collapse").is(":visible")) {
			$("#nav-collapse").slideUp(function() {
				$("#smallGuide").show();
			});
		} else {
			$("#nav-collapse").slideDown();
			$("#smallGuide").hide();
		}

	});

	$("#logo").click(function() {
		window.location.href = "../../index.html";
	});

	$("#downloadNav").click(function () {

		$("#downloadNav").addClass("now");

		$('html, body').animate({
			scrollTop: $("#download").offset().top
		}, 2000);
	});

	createModel();

});

function createModel() {

	let container = document.getElementById( "modelArea" );

	model = new TSP.model.Sequential( container, {

		animationTimeRatio: 0.1

	} );

	model.add( new TSP.layers.Input2d( {

		shape: [ 28, 28, 1 ],
		name: "initInput",

	} ) );

	model.add( new TSP.layers.Padding2d( {

		padding: [ 2, 2 ],

	} ) );

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 5,
		filters: 6,
		strides: 1,
		initStatus: "open",
		name: "conv2d1"

	} ) );

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

	model.add( new TSP.layers.Dense( {

		units: 120,
		name: "dense1",

	} ) );

	model.add( new TSP.layers.Dense( {

		units: 84,
		name: "dense2",

	} ) );

	model.add( new TSP.layers.Output1d( {

		units: 10,
		outputs: [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ],
		initStatus: "open",
		name: "output"

	} ) );

	model.load( {

		type: "tfjs",
		url: './assets/model/lenet/mnist.json',

	} );

	model.init(function() {

		$.ajax({
			url: "./assets/data/digit/5.json",
			type: 'GET',
			async: true,
			dataType: 'json',
			success: function (data) {

				model.predict( data );
				launchPredictor();

			}
		});

	});

}

function launchPredictor() {

	setInterval(function() {

		let digit = Math.floor(10 * Math.random());
		$.ajax({
			url: "./assets/data/digit/" + digit + ".json",
			type: 'GET',
			async: true,
			dataType: 'json',
			success: function (data) {

				model.predict( data );

			}
		});

	}, 3000);

}