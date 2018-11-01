let model, conv2d;

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

	$("#downloadNav").click(function () {

		$("#downloadNav").addClass("now");

		$('html, body').animate({
			scrollTop: $("#download").offset().top
		}, 2000);
	});

    $('#toPlayground').mouseover(function() {
		$(this).find("img").attr("src", "assets/img/index/playgroundIcon_darkB.png").delay(400);
	}).mouseout(function() {
		$(this).find("img").attr("src", "assets/img/index/playgroundIcon.png");
	});

    $("#galleryLenet").hover(function(){
		$(this).find(".img33").attr("src", "./assets/img/index/gallery_LeNet.gif");
	}, function(){
		$(this).find(".img33").attr("src", "./assets/img/index/gallery_LeNet.jpg");
	});

	$("#galleryAlexnet").hover(function(){
		$(this).find(".img33").attr("src", "./assets/img/index/gallery_AlexNet.gif");
	}, function(){
		$(this).find(".img33").attr("src", "./assets/img/index/gallery_AlexNet.jpg");
	});

	$("#galleryYolo").hover(function(){
		$(this).find(".img33").attr("src", "./assets/img/index/gallery_yolov2.gif");
	}, function(){
		$(this).find(".img33").attr("src", "./assets/img/index/gallery_yolov2.jpg");
	});

	$("#galleryVgg").hover(function(){
		$(this).find(".img33").attr("src", "./assets/img/index/gallery_VGG16.gif");
	}, function(){
		$(this).find(".img33").attr("src", "./assets/img/index/gallery_VGG16.jpg");
	});

	$("#galleryResnet").hover(function(){
		$(this).find(".img33").attr("src", "./assets/img/index/gallery_ResNet.gif");
	}, function(){
		$(this).find(".img33").attr("src", "./assets/img/index/gallery_ResNet.jpg");
	});

	$("#galleryMore").hover(function(){
		$(this).find(".img33").attr("src", "./assets/img/index/gallery_more.gif");
	}, function(){
		$(this).find(".img33").attr("src", "./assets/img/index/gallery_LeNet.jpg");
	});

	createModel();

});

function createModel() {

	let container = document.getElementById( "modelArea" );

	model = new TSP.model.Sequential( container, {

		animationTimeRatio: 0.8

	} );

	model.add( new TSP.layers.GreyscaleInput( {

		shape: [ 28, 28, 1 ],
		name: "initInput",

	} ) );

	model.add( new TSP.layers.Padding2d( {

		padding: [ 2, 2 ],

	} ) );

	conv2d =  new TSP.layers.Conv2d( {

		kernelSize: 5,
		filters: 6,
		strides: 1,
		name: "conv2d1"

	} );

	model.add( conv2d );

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
				conv2d.openLayer();
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