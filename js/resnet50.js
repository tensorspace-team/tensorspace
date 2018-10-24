let model;
let imagenetResult;
let predictDataKey = "dog";
let selectedDiv = undefined;

let dataLookup = {

	dog: {

		relativeDiv: "data1",
		dataUrl: "../../assets/data/dog_imagenet.json",
		imageUrl: "../../assets/img/playground/dog_imagenet.jpg"

	},

	cat: {

		relativeDiv: "data2",
		dataUrl: "../../assets/data/cat.json",
		imageUrl: "../../assets/img/playground/cat.jpg"

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

	model = new TSP.model.Sequential( container, {

		aggregationStrategy: "max",
		layerShape: "rect",
		layerInitStatus: "close",
		stats: true,

		color: {

			conv2d: 0xff00ff,
			pooling2d: 0x00ffff,
			add: 0xff0000

		}

	} );

	model.add( new TSP.layers.Input3d( {

		shape: [ 224, 224, 3 ]

	} ) );

	/* >>>>>>>>>____1____<<<<<<<<<< */

	// 0
	// conv1 ~ conv1_relu (activation_1)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 7,
		filters: 64,
		strides: 2,
		padding: "same"

	} ) );

	// 1
	// pool1 (max_pooling2d_1)

	model.add( new TSP.layers.Pooling2d( {

		poolSize: [ 3, 3 ],
		strides: [ 2, 2 ]

	} ) );

	/* >>>>>>>>>____2____<<<<<<<<<< */

	// 2
	// res2a_branch2a ~ res2a_branch2a_relu (activation_2)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 64,
		strides: 1,
		padding: "valid"

	} ) );

	// 3
	// res2a_branch2b ~ res2a_branch2b_relu (activation_3)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 64,
		strides: 1,
		padding: "same"

	} ) );

	// 4
	// res2a_branch2c ~ scale2a_branch2c (bn2a_branch2c)

	let bn2a_branch2c =new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 256,
		strides: 1,
		padding: "valid"

	} );

	model.add( bn2a_branch2c );

	// 5
	// res2a_branch1 ~ scale2a_branch1 (bn2a_branch1)

	let bn2a_branch1 = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 256,
		strides: 1,
		padding: "valid"

	} );

	model.add( bn2a_branch1 );

	// 6
	// res2a(add_1) ~ res2a_relu (activation_4)

	let activation_4 = TSP.layers.Add( [ bn2a_branch2c, bn2a_branch1 ] );
	model.add( activation_4 );

	// 7
	// res2b_branch2a ~ res2b_branch2a_relu (activation_5)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 64,
		strides: 1,
		padding: "valid"

	} ) );

	// 8
	// res2b_branch2b ~ res2b_branch2b_relu (activation_6)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 64,
		strides: 1,
		padding: "same"

	} ) );

	// 9
	// res2b_branch2c ~ scale2b_branch2c (bn2b_branch2c)

	let bn2b_branch2c = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 256,
		strides: 1,
		padding: "valid"

	} );

	model.add( bn2b_branch2c );

	// 10
	// res2b(add_2) ~ res2b_relu (activation_7)

	let activation_7 = TSP.layers.Add( [ activation_4, bn2b_branch2c ] );
	model.add( activation_7 );


	// 11
	// res2c_branch2a ~ res2c_branch2a_relu (activation_8)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 64,
		strides: 1,
		padding: "valid"

	} ) );

	// 12
	// res2c_branch2b ~ res2c_branch2b_relu (activation_9)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 64,
		strides: 1,
		padding: "same"

	} ) );

	// 13
	// res2c_branch2c ~ scale2c_branch2c (bn2c_branch2c)

	let bn2c_branch2c = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 256,
		strides: 1,
		padding: "valid"

	} );

	model.add( bn2c_branch2c );

	// 14
	// res2c(add_3) ~ res2c_relu (activation_10)

	let activation_10 = TSP.layers.Add( [ activation_7, bn2c_branch2c ] );
	model.add( activation_10 );


	/* >>>>>>>>>____3____<<<<<<<<<< */

	// 15
	// res3a_branch2a ~ res3a_branch2a_relu (activation_11)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 128,
		strides: 2,
		padding: "valid"

	} ) );

	// 16
	// res3a_branch2b ~ res3a_branch2b_relu (activation_12)

	model.add( new TSP.layers.Conv2d( {
		kernelSize: 3,
		filters: 128,
		strides: 1,
		padding: "same"
	}));

	// 17
	// res3a_branch2c ~ scale3a_branch2c (bn3a_branch2c)

	let bn3a_branch2c = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 512,
		strides: 1,
		padding: "valid"

	} );

	model.add( bn3a_branch2c );

	// 18
	// res3a_branch1 ~ scale3a_branch1 (bn3a_branch1)

	let bn3a_branch1 = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 512,
		strides: 1,
		padding: "valid"

	} );

	model.add( bn3a_branch1 );

	//19
	// res3a(add_4) ~ res3a_relu (activation_13)

	let activation_13 = TSP.layers.Add( [ bn3a_branch1, bn3a_branch2c ] );
	model.add( activation_13 );

	// 20
	// res3b_branch2a ~ res3b_branch2a_relu (activation_14)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 128,
		strides: 1,
		padding: "valid"

	} ) );

	// 21
	// res3b_branch2b ~ res3b_branch2b_relu (activation_15)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 128,
		strides: 1,
		padding: "same"

	} ) );

	// 22
	// res3b_branch2c ~ scale3b_branch2c (bn3b_branch2c)

	let bn3b_branch2c = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 512,
		strides: 1,
		padding: "valid"

	} );

	model.add( bn3b_branch2c );

	// 23
	// res3b(add_5) ~ res3b_relu (activation_16)

	let activation_16 = TSP.layers.Add( [ activation_13, bn3b_branch2c ] );
	model.add( activation_16 );

	// 24
	// res3c_branch2a ~ res3c_branch2a_relu (activation_17)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 128,
		strides: 1,
		padding: "valid"

	} ) );

	// 25
	// res3c_branch2b ~ res3c_branch2b_relu (activation_18)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 128,
		strides: 1,
		padding: "same"

	} ) );

	// 26
	// res3c_branch2c ~ scale3c_branch2c (bn3c_branch2c)

	let bn3c_branch2c = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 512,
		strides: 1,
		padding: "valid"

	} );

	model.add( bn3c_branch2c );

	// 27
	// res3c(add_6) ~ res3c_relu (activation_19)

	let activation_19 = TSP.layers.Add( [ activation_16, bn3c_branch2c ] );
	model.add( activation_19 );

	// 28
	// res3d_branch2a ~ res3d_branch2a_relu (activation_20)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 128,
		strides: 1,
		padding: "valid"

	} ) );

	// 29
	// res3d_branch2b ~ res3d_branch2b_relu (activation_21)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 128,
		strides: 1,
		padding: "same"

	} ) );

	// 30
	// res3d_branch2c ~ scale3d_branch2c (bn3d_branch2c)

	let bn3d_branch2c = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 512,
		strides: 1,
		padding: "valid"

	} );

	model.add( bn3d_branch2c );

	// 31
	// res3d(add_7) ~ res3d_relu (activation_22)

	let activation_22 = TSP.layers.Add( [ activation_19, bn3d_branch2c ] );
	model.add( activation_22 );

	/* >>>>>>>>>____4____<<<<<<<<<< */

	// 32
	// res4a_branch2a ~ res4a_branch2a_relu (activation_23)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 256,
		strides: 2,
		padding: "valid"

	} ) );

	// 33
	// res4a_branch2b ~ res4a_branch2b_relu (activation_24)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 256,
		strides: 1,
		padding: "same"

	} ) );

	// 34
	// res4a_branch2c ~ scale4a_branch2c (bn4a_branch2c)

	let bn4a_branch2c = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 1024,
		strides: 1,
		padding: "valid"

	} );

	model.add( bn4a_branch2c );

	// 35
	// res4a_branch1 ~ scale4a_branch1 (bn4a_branch1)

	let bn4a_branch1 = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 1024,
		strides: 1,
		padding: "valid"

	} );

	model.add( bn4a_branch1 );

	// 36
	// res4a(add_8) ~ res4a_relu (activation_25)

	let activation_25 = TSP.layers.Add( [ bn4a_branch1, bn4a_branch2c ] );
	model.add( activation_25 );

	// 37
	// res4b_branch2a ~ res4b_branch2a_relu (activation_26)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 256,
		strides: 1,
		padding: "valid"

	} ) );

	// 38
	// res4b_branch2b ~ res4b_branch2b_relu (activation_27)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 256,
		strides: 1,
		padding: "same"

	} ) );

	// 39
	// res4b_branch2c ~ scale4b_branch2c (bn4b_branch2c)

	let bn4b_branch2c = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 1024,
		strides: 1,
		padding: "valid"

	} );

	model.add( bn4b_branch2c );

	// 40
	// res4b(add_9) ~ res4b_relu (activation_28)

	let activation_28 = TSP.layers.Add( [ activation_25, bn4b_branch2c ] );
	model.add( activation_28 );

	// 41
	// res4c_branch2a ~ res4c_branch2a_relu (activation_29)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 256,
		strides: 1,
		padding: "valid"

	} ) );

	// 42
	// res4c_branch2b ~ res4c_branch2b_relu (activation_30)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 256,
		strides: 1,
		padding: "same"

	} ) );

	// 43
	// res4c_branch2c ~ scale4c_branch2c (bn4c_branch2c)

	let bn4c_branch2c = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 1024,
		strides: 1,
		padding: "valid"

	} );

	model.add( bn4c_branch2c );

	// 44
	// res4c(add_10) ~ res4c_relu (activation_31)

	let activation_31 = TSP.layers.Add( [ activation_28, bn4c_branch2c ] );
	model.add( activation_31 );

	// 45
	// res4d_branch2a ~ res4d_branch2a_relu (activation_32)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 256,
		strides: 1,
		padding: "valid"

	} ) );

	// 46
	// res4d_branch2b ~ res4d_branch2b_relu (activation_33)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 256,
		strides: 1,
		padding: "same"

	} ) );

	// 47
	// res4d_branch2c ~ scale4d_branch2c (bn4d_branch2c)

	let bn4d_branch2c = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 1024,
		strides: 1,
		padding: "valid"

	} );

	model.add( bn4d_branch2c );

	// 48
	// res4d(add_11) ~ res4d_relu (activation_34)

	let activation_34 = TSP.layers.Add( [ activation_31, bn4d_branch2c ] );
	model.add( activation_34 );

	// 49
	// res4e_branch2a ~ res4e_branch2a_relu (activation_35)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 256,
		strides: 1,
		padding: "valid"

	} ) );

	// 50
	// res4e_branch2b ~ res4e_branch2b_relu (activation_36)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 256,
		strides: 1,
		padding: "same"

	} ) );

	// 51
	// res4e_branch2c ~ scale4e_branch2c (bn4e_branch2c)

	let bn4e_branch2c = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 1024,
		strides: 1,
		padding: "valid"

	} );

	model.add( bn4e_branch2c );

	// 52
	// res4e(add_12) ~ res4e_relu (activation_37)

	let activation_37 = TSP.layers.Add( [ activation_34, bn4e_branch2c ] );
	model.add( activation_37 );

	// 53
	// res4f_branch2a ~ res4f_branch2a_relu (activation_38)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 256,
		strides: 1,
		padding: "valid"

	} ) );

	// 54
	// res4f_branch2b ~ res4f_branch2b_relu (activation_39)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 256,
		strides: 1,
		padding: "same"

	} ) );

	// 55
	// res4f_branch2c ~ scale4f_branch2c (bn4f_branch2c)

	let bn4f_branch2c = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 1024,
		strides: 1,
		padding: "valid"

	} );

	model.add( bn4f_branch2c );

	// 56
	// res4f(add_13) ~ res4f_relu (activation_40)

	let activation_40 = TSP.layers.Add( [ activation_37, bn4f_branch2c ] );
	model.add( activation_40 );


	/* >>>>>>>>>____5____<<<<<<<<<< */

	// 57
	// res5a_branch2a ~ res5a_branch2a_relu (activation_41)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 512,
		strides: 2,
		padding: "valid"

	} ) );

	// 58
	// res5a_branch2b ~ res5a_branch2b_relu (activation_42)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 512,
		strides: 1,
		padding: "same"

	} ) );

	// 59
	// res5a_branch2c ~ scale5a_branch2c (bn5a_branch2c)

	let bn5a_branch2c = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 2048,
		strides: 1,
		padding: "valid"

	} );

	model.add( bn5a_branch2c );

	// 60
	// res5a_branch1 ~ scale5a_branch1 (bn5a_branch1)

	let bn5a_branch1 = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 2048,
		strides: 1,
		padding: "valid"

	} );

	model.add( bn5a_branch1 );

	// 61
	// res5a(add_14) ~ res5a_relu (activation_43)

	let activation_43 = TSP.layers.Add( [ bn5a_branch1, bn5a_branch2c ] );
	model.add( activation_43 );

	// 62
	// res5b_branch2a ~ res5b_branch2a_relu (activation_44)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 512,
		strides: 1,
		padding: "valid"

	} ) );

	// 63
	// res5b_branch2b ~ res5b_branch2b_relu (activation_45)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 512,
		strides: 1,
		padding: "same"

	} ) );

	// 64
	// res5b_branch2c ~ scale5b_branch2c (bn5b_branch2c)

	let bn5b_branch2c = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 2048,
		strides: 1,
		padding: "valid"

	} );

	model.add( bn5b_branch2c );

	// 65
	// res5b(add_15) ~ res5b_relu (activation_46)

	let activation_46 = TSP.layers.Add( [ activation_43, bn5b_branch2c ] );
	model.add( activation_46 );

	// 66
	// res5c_branch2a ~ res5c_branch2a_relu (activation_47)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 512,
		strides: 1,
		padding: "valid"

	} ) );

	// 67
	// res5c_branch2b ~ res5c_branch2b_relu (activation_48)

	model.add( new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 512,
		strides: 1,
		padding: "same"

	} ) );

	// 68
	// res5c_branch2c ~ scale5c_branch2c (bn5c_branch2c)

	let bn5c_branch2c = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 2048,
		strides: 1,
		padding: "valid"

	} );

	model.add( bn5c_branch2c );

	// 69
	// res5c(add_10) ~ res5c_relu (activation_49)

	let activation_49 = TSP.layers.Add( [ activation_46, bn5c_branch2c ] );
	model.add( activation_49 );

	// 70
	// pool5 (avg_pool)

	model.add( new TSP.layers.Pooling2d( {

		poolSize: [ 7, 7 ],
		strides: [ 1, 1 ]

	} ) );

	// 71
	// fc1000 (fc1000)

	model.add( new TSP.layers.Output1d( {

		units: 1000,
		paging: true,
		segmentLength: 400,
		outputs: imagenetResult

	} ) );

	model.load( {

		type: "tfjs",
		url: '../../assets/model/resnet50/model.json'

	} );

	model.init( function() {

		getDataAndPredict( function( finalResult ) {
			$( "#loadingPad" ).hide();

			generateInference( finalResult );

		} );

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