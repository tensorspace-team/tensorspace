let model;
let imagenetResult;
let predictDataKey = "persian";
let selectedDiv = undefined;

let dataLookup = {

	persian: {

		relativeDiv: "data1",
		dataUrl: "../../assets/data/persian.json",
		imageUrl: "../../assets/img/playground/persian.jpg"

	},

	hamster: {

		relativeDiv: "data2",
		dataUrl: "../../assets/data/hamster.json",
		imageUrl: "../../assets/img/playground/hamster.jpg"

	},

	ram: {

		relativeDiv: "data3",
		dataUrl: "../../assets/data/ram.json",
		imageUrl: "../../assets/img/playground/ram.jpg"

	},

	samoyed: {

		relativeDiv: "data4",
		dataUrl: "../../assets/data/samoyed.json",
		imageUrl: "../../assets/img/playground/samoyed.jpg"

	},

	rabbit: {

		relativeDiv: "data5",
		dataUrl: "../../assets/data/rabbit.json",
		imageUrl: "../../assets/img/playground/rabbit.jpg"

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
			console.log(generateInference( finalResult ));
		});

	});

});

function createModel() {

	let container = document.getElementById("modelArea");

	let input = new TSP.layers.RGBInput({

		shape: [ 299, 299, 3 ],
		name: "Input"

	});

	let conv2d_1 = new TSP.layers.Conv2d({

		kernelSize: 3,
		filters: 32,
		strides: 2,
		padding: "valid",
		name: "conv2d_1"

	});

	conv2d_1.apply( input );

	let conv2d_2 = new TSP.layers.Conv2d({

		kernelSize: 3,
		filters: 32,
		strides: 1,
		padding: "valid",
		name: "conv2d_2"

	});

	conv2d_2.apply( conv2d_1 );

	let conv2d_3 = new TSP.layers.Conv2d({

		kernelSize: 3,
		filters: 64,
		strides: 1,
		padding: "same",
		name: "conv2d_3"

	});

	conv2d_3.apply( conv2d_2 );

	let max_pooling2d_1 = new TSP.layers.Pooling2d( {

		poolSize: [ 3, 3 ],
		strides: [ 2, 2 ],
		padding: "valid",
		name: "max_pooling2d_1"

	} );

	max_pooling2d_1.apply( conv2d_3 );

	let conv2d_4 = new TSP.layers.Conv2d({

		kernelSize: 1,
		filters: 80,
		strides: 1,
		padding: "valid",
		name: "conv2d_4"

	});

	conv2d_4.apply( max_pooling2d_1 );

	let conv2d_5 = new TSP.layers.Conv2d({

		kernelSize: 3,
		filters: 192,
		strides: 1,
		padding: "valid",
		name: "conv2d_5"

	});

	conv2d_5.apply( conv2d_4 );

	let max_pooling2d_2 = new TSP.layers.Pooling2d( {

		poolSize: [ 3, 3 ],
		strides: [ 2, 2 ],
		padding: "valid",
		name: "max_pooling2d_2"

	} );

	max_pooling2d_2.apply( conv2d_5 );

	// block 1

	let conv2d_9 = new TSP.layers.Conv2d({

		kernelSize: 1,
		filters: 64,
		strides: 1,
		padding: "same",
		name: "conv2d_9"

	});

	conv2d_9.apply( max_pooling2d_2 );

	let conv2d_10 = new TSP.layers.Conv2d({

		kernelSize: 3,
		filters: 96,
		strides: 1,
		padding: "same",
		name: "conv2d_10"

	});

	conv2d_10.apply( conv2d_9 );

	let conv2d_11 = new TSP.layers.Conv2d({

		kernelSize: 3,
		filters: 96,
		strides: 1,
		padding: "same",
		name: "conv2d_11"

	});

	conv2d_11.apply( conv2d_10 );

	let conv2d_7 = new TSP.layers.Conv2d({

		kernelSize: 1,
		filters: 48,
		strides: 1,
		padding: "same",
		name: "conv2d_7"

	});

	conv2d_7.apply( max_pooling2d_2 );

	let conv2d_8 = new TSP.layers.Conv2d({

		kernelSize: 5,
		filters: 64,
		strides: 1,
		padding: "same",
		name: "conv2d_8"

	});

	conv2d_8.apply( conv2d_7 );

	let average_pooling2d_1 = new TSP.layers.Pooling2d( {

		poolSize: [ 3, 3 ],
		strides: [ 1, 1 ],
		padding: "same",
		name: "average_pooling2d_1"

	} );

	average_pooling2d_1.apply( max_pooling2d_2 );

	let conv2d_12 = new TSP.layers.Conv2d({

		kernelSize: 1,
		filters: 32,
		strides: 1,
		padding: "same",
		name: "conv2d_12"

	});

	conv2d_12.apply( average_pooling2d_1 );

	let conv2d_6 = new TSP.layers.Conv2d({

		kernelSize: 1,
		filters: 64,
		strides: 1,
		padding: "same",
		name: "conv2d_6"

	});

	conv2d_6.apply( max_pooling2d_2 );

	let mixed0 = new TSP.layers.Concatenate([ conv2d_11, conv2d_8, conv2d_12, conv2d_6 ], {
		name: "mixed0"
	});

	// block 2

	let conv2d_16 = new TSP.layers.Conv2d({

		kernelSize: 1,
		filters: 64,
		strides: 1,
		padding: "same",
		name: "conv2d_16"

	});

	conv2d_16.apply( mixed0 );

	let conv2d_17 = new TSP.layers.Conv2d({

		kernelSize: 3,
		filters: 96,
		strides: 1,
		padding: "same",
		name: "conv2d_17"

	});

	conv2d_17.apply( conv2d_16 );

	let conv2d_18 = new TSP.layers.Conv2d({

		kernelSize: 3,
		filters: 96,
		strides: 1,
		padding: "same",
		name: "conv2d_18"

	});

	conv2d_18.apply( conv2d_17 );

	let conv2d_14 = new TSP.layers.Conv2d({

		kernelSize: 1,
		filters: 48,
		strides: 1,
		padding: "same",
		name: "conv2d_14"

	});

	conv2d_14.apply( mixed0 );

	let conv2d_15 = new TSP.layers.Conv2d({

		kernelSize: 5,
		filters: 64,
		strides: 1,
		padding: "same",
		name: "conv2d_15"

	});

	conv2d_15.apply( conv2d_14 );

	let average_pooling2d_2 = new TSP.layers.Pooling2d( {

		poolSize: [ 3, 3 ],
		strides: [ 1, 1 ],
		padding: "same",
		name: "average_pooling2d_2"

	} );

	average_pooling2d_2.apply( mixed0 );

	let conv2d_19 = new TSP.layers.Conv2d({

		kernelSize: 1,
		filters: 64,
		strides: 1,
		padding: "same",
		name: "conv2d_19"

	});

	conv2d_19.apply( average_pooling2d_2 );

	let conv2d_13 = new TSP.layers.Conv2d({

		kernelSize: 1,
		filters: 64,
		strides: 1,
		padding: "same",
		name: "conv2d_13"

	});

	conv2d_13.apply( mixed0 );

	let mixed1 = new TSP.layers.Concatenate([ conv2d_18, conv2d_15, conv2d_19, conv2d_13 ], {
		name: "mixed1"
	});

	// block 3

	let conv2d_23 = new TSP.layers.Conv2d({

		kernelSize: 1,
		filters: 64,
		strides: 1,
		padding: "same",
		name: "conv2d_23"

	});

	conv2d_23.apply( mixed1 );

	let conv2d_24 = new TSP.layers.Conv2d({

		kernelSize: 3,
		filters: 96,
		strides: 1,
		padding: "same",
		name: "conv2d_24"

	});

	conv2d_24.apply( conv2d_23 );

	let conv2d_25 = new TSP.layers.Conv2d({

		kernelSize: 3,
		filters: 96,
		strides: 1,
		padding: "same",
		name: "conv2d_25"

	});

	conv2d_25.apply( conv2d_24 );

	let conv2d_21 = new TSP.layers.Conv2d({

		kernelSize: 1,
		filters: 48,
		strides: 1,
		padding: "same",
		name: "conv2d_21"

	});

	conv2d_21.apply( mixed1 );

	let conv2d_22 = new TSP.layers.Conv2d({

		kernelSize: 5,
		filters: 64,
		strides: 1,
		padding: "same",
		name: "conv2d_22"

	});

	conv2d_22.apply( conv2d_21 );

	let average_pooling2d_3 = new TSP.layers.Pooling2d( {

		poolSize: [ 3, 3 ],
		strides: [ 1, 1 ],
		padding: "same",
		name: "average_pooling2d_3"

	} );

	average_pooling2d_3.apply( mixed1 );

	let conv2d_26 = new TSP.layers.Conv2d({

		kernelSize: 1,
		filters: 64,
		strides: 1,
		padding: "same",
		name: "conv2d_26"

	});

	conv2d_26.apply( average_pooling2d_3 );

	let conv2d_20 = new TSP.layers.Conv2d({

		kernelSize: 1,
		filters: 64,
		strides: 1,
		padding: "same",
		name: "conv2d_20"

	});

	conv2d_20.apply( mixed1 );

	let mixed2 = new TSP.layers.Concatenate([ conv2d_25, conv2d_22, conv2d_26, conv2d_20 ], {
		name: "mixed2"
	});

	// block 4

	let conv2d_28 = new TSP.layers.Conv2d({

		kernelSize: 1,
		filters: 64,
		strides: 1,
		padding: "same",
		name: "conv2d_28"

	});

	conv2d_28.apply( mixed2 );

	let conv2d_29 = new TSP.layers.Conv2d({

		kernelSize: 3,
		filters: 96,
		strides: 1,
		padding: "same",
		name: "conv2d_29"

	});

	conv2d_29.apply( conv2d_28 );

	let conv2d_30 = new TSP.layers.Conv2d({

		kernelSize: 3,
		filters: 96,
		strides: 2,
		padding: "valid",
		name: "conv2d_30"

	});

	conv2d_30.apply( conv2d_29 );

	let conv2d_27 = new TSP.layers.Conv2d({

		kernelSize: 3,
		filters: 384,
		strides: 2,
		padding: "valid",
		name: "conv2d_27"

	});

	conv2d_27.apply( mixed2 );

	let max_pooling2d_3 = new TSP.layers.Pooling2d( {

		poolSize: [ 3, 3 ],
		strides: [ 2, 2 ],
		padding: "valid",
		name: "max_pooling2d_3"

	} );

	max_pooling2d_3.apply( mixed2 );

	let mixed3 = new TSP.layers.Concatenate([ conv2d_30, conv2d_27, max_pooling2d_3 ], {
		name: "mixed3"
	});

	// block 5

	let conv2d_35 = new TSP.layers.Conv2d({

		kernelSize: 1,
		filters: 128,
		strides: 1,
		padding: "same",
		name: "conv2d_35"

	});

	conv2d_35.apply( mixed3 );

	let conv2d_36 = new TSP.layers.Conv2d({

		kernelSize: [7, 1],
		filters: 128,
		strides: 1,
		padding: "same",
		name: "conv2d_36"

	});

	conv2d_36.apply( conv2d_35 );

	let conv2d_37 = new TSP.layers.Conv2d({

		kernelSize: [1, 7],
		filters: 128,
		strides: 1,
		padding: "same",
		name: "conv2d_37"

	});

	conv2d_37.apply( conv2d_36 );

	let conv2d_38 = new TSP.layers.Conv2d({

		kernelSize: [7, 1],
		filters: 128,
		strides: 1,
		padding: "same",
		name: "conv2d_38"

	});

	conv2d_38.apply( conv2d_37 );

	let conv2d_39 = new TSP.layers.Conv2d({

		kernelSize: [1, 7],
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_39"

	});

	conv2d_39.apply( conv2d_38 );

	let conv2d_32 = new TSP.layers.Conv2d({

		kernelSize: 1,
		filters: 128,
		strides: 1,
		padding: "same",
		name: "conv2d_32"

	});

	conv2d_32.apply( mixed3 );

	let conv2d_33 = new TSP.layers.Conv2d({

		kernelSize: [1, 7],
		filters: 128,
		strides: 1,
		padding: "same",
		name: "conv2d_33"

	});

	conv2d_33.apply( conv2d_32 );

	let conv2d_34 = new TSP.layers.Conv2d({

		kernelSize: [7, 1],
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_34"

	});

	conv2d_34.apply( conv2d_33 );

	let average_pooling2d_4 = new TSP.layers.Pooling2d( {

		poolSize: [ 3, 3 ],
		strides: [ 1, 1 ],
		padding: "same",
		name: "average_pooling2d_4"

	} );

	average_pooling2d_4.apply( mixed3 );

	let conv2d_40 = new TSP.layers.Conv2d({

		kernelSize: 1,
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_40"

	});

	conv2d_40.apply( average_pooling2d_4 );

	let conv2d_31 = new TSP.layers.Conv2d({

		kernelSize: 1,
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_31"

	});

	conv2d_31.apply( mixed3 );

	let mixed4 = new TSP.layers.Concatenate([ conv2d_39, conv2d_34, conv2d_40, conv2d_31 ], {
		name: "mixed4"
	});

	// block 6

	let conv2d_45 = new TSP.layers.Conv2d({

		kernelSize: 1,
		filters: 160,
		strides: 1,
		padding: "same",
		name: "conv2d_45"

	});

	conv2d_45.apply( mixed4 );

	let conv2d_46 = new TSP.layers.Conv2d({

		kernelSize: [7, 1],
		filters: 160,
		strides: 1,
		padding: "same",
		name: "conv2d_46"

	});

	conv2d_46.apply( conv2d_45 );

	let conv2d_47 = new TSP.layers.Conv2d({

		kernelSize: [1, 7],
		filters: 160,
		strides: 1,
		padding: "same",
		name: "conv2d_47"

	});

	conv2d_47.apply( conv2d_46 );

	let conv2d_48 = new TSP.layers.Conv2d({

		kernelSize: [7, 1],
		filters: 160,
		strides: 1,
		padding: "same",
		name: "conv2d_48"

	});

	conv2d_48.apply( conv2d_47 );

	let conv2d_49 = new TSP.layers.Conv2d({

		kernelSize: [1, 7],
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_49"

	});

	conv2d_49.apply( conv2d_48 );

	let conv2d_42 = new TSP.layers.Conv2d({

		kernelSize: 1,
		filters: 160,
		strides: 1,
		padding: "same",
		name: "conv2d_42"

	});

	conv2d_42.apply( mixed4 );

	let conv2d_43 = new TSP.layers.Conv2d({

		kernelSize: [1, 7],
		filters: 160,
		strides: 1,
		padding: "same",
		name: "conv2d_43"

	});

	conv2d_43.apply( conv2d_42 );

	let conv2d_44 = new TSP.layers.Conv2d({

		kernelSize: [7, 1],
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_44"

	});

	conv2d_44.apply( conv2d_43 );

	let average_pooling2d_5 = new TSP.layers.Pooling2d( {

		poolSize: [ 3, 3 ],
		strides: [ 1, 1 ],
		padding: "same",
		name: "average_pooling2d_5"

	} );

	average_pooling2d_5.apply( mixed4 );

	let conv2d_50 = new TSP.layers.Conv2d({

		kernelSize: [1, 1],
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_50"

	});

	conv2d_50.apply( average_pooling2d_5 );

	let conv2d_41 = new TSP.layers.Conv2d({

		kernelSize: [1, 1],
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_41"

	});

	conv2d_41.apply( mixed4 );

	let mixed5 = new TSP.layers.Concatenate([ conv2d_49, conv2d_44, conv2d_50, conv2d_41 ], {
		name: "mixed5"
	});

	// block 7

	let conv2d_55 = new TSP.layers.Conv2d({

		kernelSize: [1, 1],
		filters: 160,
		strides: 1,
		padding: "same",
		name: "conv2d_55"

	});

	conv2d_55.apply( mixed5 );

	let conv2d_56 = new TSP.layers.Conv2d({

		kernelSize: [7, 1],
		filters: 160,
		strides: 1,
		padding: "same",
		name: "conv2d_56"

	});

	conv2d_56.apply( conv2d_55 );

	let conv2d_57 = new TSP.layers.Conv2d({

		kernelSize: [1, 7],
		filters: 160,
		strides: 1,
		padding: "same",
		name: "conv2d_57"

	});

	conv2d_57.apply( conv2d_56 );

	let conv2d_58 = new TSP.layers.Conv2d({

		kernelSize: [7, 1],
		filters: 160,
		strides: 1,
		padding: "same",
		name: "conv2d_58"

	});

	conv2d_58.apply( conv2d_57 );

	let conv2d_59 = new TSP.layers.Conv2d({

		kernelSize: [1, 7],
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_59"

	});

	conv2d_59.apply( conv2d_58 );

	let conv2d_52 = new TSP.layers.Conv2d({

		kernelSize: [1, 1],
		filters: 160,
		strides: 1,
		padding: "same",
		name: "conv2d_52"

	});

	conv2d_52.apply( mixed5 );

	let conv2d_53 = new TSP.layers.Conv2d({

		kernelSize: [1, 7],
		filters: 160,
		strides: 1,
		padding: "same",
		name: "conv2d_53"

	});

	conv2d_53.apply( conv2d_52 );

	let conv2d_54 = new TSP.layers.Conv2d({

		kernelSize: [7, 1],
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_54"

	});

	conv2d_54.apply( conv2d_53 );

	let average_pooling2d_6 = new TSP.layers.Pooling2d( {

		poolSize: [ 3, 3 ],
		strides: [ 1, 1 ],
		padding: "same",
		name: "average_pooling2d_6"

	} );

	average_pooling2d_6.apply( mixed5 );

	let conv2d_60 = new TSP.layers.Conv2d({

		kernelSize: [1, 1],
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_60"

	});

	conv2d_60.apply( average_pooling2d_6 );

	let conv2d_51 = new TSP.layers.Conv2d({

		kernelSize: [1, 1],
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_51"

	});

	conv2d_51.apply( mixed5 );

	let mixed6 = new TSP.layers.Concatenate([ conv2d_59, conv2d_54, conv2d_60, conv2d_51 ], {
		name: "mixed6"
	});

	// block 8

	let conv2d_65 = new TSP.layers.Conv2d({

		kernelSize: [1, 1],
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_65"

	});

	conv2d_65.apply( mixed6 );

	let conv2d_66 = new TSP.layers.Conv2d({

		kernelSize: [7, 1],
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_66"

	});

	conv2d_66.apply( conv2d_65 );

	let conv2d_67 = new TSP.layers.Conv2d({

		kernelSize: [1, 7],
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_67"

	});

	conv2d_67.apply( conv2d_66 );

	let conv2d_68 = new TSP.layers.Conv2d({

		kernelSize: [7, 1],
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_68"

	});

	conv2d_68.apply( conv2d_67 );

	let conv2d_69 = new TSP.layers.Conv2d({

		kernelSize: [1, 7],
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_69"

	});

	conv2d_69.apply( conv2d_68 );

	let conv2d_62 = new TSP.layers.Conv2d({

		kernelSize: 1,
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_62"

	});

	conv2d_62.apply( mixed6 );

	let conv2d_63 = new TSP.layers.Conv2d( {

		kernelSize: [ 1, 7 ],
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_63"

	} );

	conv2d_63.apply( conv2d_62 );

	let conv2d_64 = new TSP.layers.Conv2d( {

		kernelSize: [ 7, 1 ],
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_64"

	} );

	conv2d_64.apply( conv2d_63 );

	let average_pooling2d_7 = new TSP.layers.Pooling2d( {

		poolSize: [ 3, 3 ],
		strides: [ 1, 1 ],
		padding: "same",
		name: "average_pooling2d_7"

	} );

	average_pooling2d_7.apply( mixed6 );

	let conv2d_70 = new TSP.layers.Conv2d( {

		kernelSize: [ 1, 1 ],
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_70"

	} );

	conv2d_70.apply( average_pooling2d_7 );

	let conv2d_61 = new TSP.layers.Conv2d( {

		kernelSize: [ 1, 1 ],
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_61"

	} );

	conv2d_61.apply( mixed6 );

	let mixed7 = new TSP.layers.Concatenate([ conv2d_69, conv2d_64, conv2d_70, conv2d_61 ], {
		name: "mixed7"
	});

	// block 9

	let conv2d_73 = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_73"

	} );

	conv2d_73.apply( mixed7 );

	let conv2d_74 = new TSP.layers.Conv2d( {

		kernelSize: [ 1, 7 ],
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_74"

	} );

	conv2d_74.apply( conv2d_73 );

	let conv2d_75 = new TSP.layers.Conv2d( {

		kernelSize: [ 7, 1 ],
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_75"

	} );

	conv2d_75.apply( conv2d_74 );

	let conv2d_76 = new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 192,
		strides: 2,
		padding: "valid",
		name: "conv2d_76"

	} );

	conv2d_76.apply( conv2d_75 );

	let conv2d_71 = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_71"

	} );

	conv2d_71.apply( mixed7 );

	let conv2d_72 = new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 320,
		strides: 2,
		padding: "valid",
		name: "conv2d_72"

	} );

	conv2d_72.apply( conv2d_71 );

	let max_pooling2d_4 = new TSP.layers.Pooling2d( {

		poolSize: [ 3, 3 ],
		strides: [ 2, 2 ],
		padding: "valid",
		name: "max_pooling2d_4"

	} );

	max_pooling2d_4.apply( mixed7 );

	let mixed8 = new TSP.layers.Concatenate([ conv2d_76, conv2d_72, max_pooling2d_4 ], {
		name: "mixed8"
	});

	// block 10

	let conv2d_81 = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 448,
		strides: 1,
		padding: "same",
		name: "conv2d_81"

	} );

	conv2d_81.apply( mixed8 );

	let conv2d_82 = new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 384,
		strides: 1,
		padding: "same",
		name: "conv2d_82"

	} );

	conv2d_82.apply( conv2d_81 );

	let conv2d_83 = new TSP.layers.Conv2d( {

		kernelSize: [ 1, 3 ],
		filters: 384,
		strides: 1,
		padding: "same",
		name: "conv2d_83"

	} );

	conv2d_83.apply( conv2d_82 );

	let conv2d_84 = new TSP.layers.Conv2d( {

		kernelSize: [ 3, 1 ],
		filters: 384,
		strides: 1,
		padding: "same",
		name: "conv2d_84"

	} );

	conv2d_84.apply( conv2d_82 );

	let concatenate_1 = new TSP.layers.Concatenate([ conv2d_83, conv2d_84 ], {
		name: "concatenate_1"
	});

	let conv2d_78 = new TSP.layers.Conv2d( {

		kernelSize: [ 1, 1 ],
		filters: 384,
		strides: 1,
		padding: "same",
		name: "conv2d_78"

	} );

	conv2d_78.apply( mixed8 );

	let conv2d_79 = new TSP.layers.Conv2d( {

		kernelSize: [ 1, 3 ],
		filters: 384,
		strides: 1,
		padding: "same",
		name: "conv2d_79"

	} );

	conv2d_79.apply( conv2d_78 );

	let conv2d_80 = new TSP.layers.Conv2d( {

		kernelSize: [ 3, 1 ],
		filters: 384,
		strides: 1,
		padding: "same",
		name: "conv2d_80"

	} );

	conv2d_80.apply( conv2d_78 );

	let mixed9_0 = new TSP.layers.Concatenate([ conv2d_79, conv2d_80 ], {
		name: "mixed9_0"
	});

	let average_pooling2d_8 = new TSP.layers.Pooling2d( {

		poolSize: [ 3, 3 ],
		strides: [ 1, 1 ],
		padding: "same",
		name: "average_pooling2d_8"

	} );

	average_pooling2d_8.apply( mixed8 );

	let conv2d_85 = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_85"

	} );

	conv2d_85.apply( average_pooling2d_8 );

	let conv2d_77 = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 320,
		strides: 1,
		padding: "same",
		name: "conv2d_77"

	} );

	conv2d_77.apply( mixed8 );

	let mixed9 = new TSP.layers.Concatenate([ concatenate_1, mixed9_0, conv2d_85, conv2d_77 ], {
		name: "mixed9"
	});

	// block 11

	let conv2d_90 = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 448,
		strides: 1,
		padding: "same",
		name: "conv2d_90"

	} );

	conv2d_90.apply( mixed9 );

	let conv2d_91 = new TSP.layers.Conv2d( {

		kernelSize: 3,
		filters: 384,
		strides: 1,
		padding: "same",
		name: "conv2d_91"

	} );

	conv2d_91.apply( conv2d_90 );

	let conv2d_92 = new TSP.layers.Conv2d( {

		kernelSize: [1, 3],
		filters: 384,
		strides: 1,
		padding: "same",
		name: "conv2d_92"

	} );

	conv2d_92.apply( conv2d_91 );

	let conv2d_93 = new TSP.layers.Conv2d( {

		kernelSize: [3, 1],
		filters: 384,
		strides: 1,
		padding: "same",
		name: "conv2d_93"

	} );

	conv2d_93.apply( conv2d_91 );

	let concatenate_2 = new TSP.layers.Concatenate([ conv2d_92, conv2d_93 ], {
		name: "concatenate_2"
	});

	let conv2d_87 = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 384,
		strides: 1,
		padding: "same",
		name: "conv2d_87"

	} );

	conv2d_87.apply( mixed9 );

	let conv2d_88 = new TSP.layers.Conv2d( {

		kernelSize: [ 1, 3 ],
		filters: 384,
		strides: 1,
		padding: "same",
		name: "conv2d_88"

	} );

	conv2d_88.apply( conv2d_87 );

	let conv2d_89 = new TSP.layers.Conv2d( {

		kernelSize: [ 3, 1 ],
		filters: 384,
		strides: 1,
		padding: "same",
		name: "conv2d_89"

	} );

	conv2d_89.apply( conv2d_87 );

	let mixed9_1 = new TSP.layers.Concatenate([ conv2d_88, conv2d_89 ], {
		name: "mixed9_1"
	});

	let average_pooling2d_9 = new TSP.layers.Pooling2d( {

		poolSize: [ 3, 3 ],
		strides: [ 1, 1 ],
		padding: "same",
		name: "average_pooling2d_9"

	} );

	average_pooling2d_9.apply( mixed9 );

	let conv2d_94 = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 192,
		strides: 1,
		padding: "same",
		name: "conv2d_94"

	} );

	conv2d_94.apply( average_pooling2d_9 );

	let conv2d_86 = new TSP.layers.Conv2d( {

		kernelSize: 1,
		filters: 320,
		strides: 1,
		padding: "same",
		name: "conv2d_86"

	} );

	conv2d_86.apply( mixed9 );

	let mixed10 = new TSP.layers.Concatenate([ concatenate_2, mixed9_1, conv2d_94, conv2d_86 ], {
		name: "mixed10"
	});

	let avg_pool = new TSP.layers.GlobalPooling2d( {

		name: "avg_pool"

	} );

	avg_pool.apply( mixed10 );

	let predictions = new TSP.layers.Output1d( {

		units: 1000,
		paging: true,
		segmentLength: 400,
		outputs: imagenetResult,
		name: "predictions"

	} );

	predictions.apply( avg_pool );

	model = new TSP.models.Model( container, {

		inputs: [ input ],
		outputs: [ predictions ],
		outputsOrder: ["conv2d_1", "conv2d_2", "conv2d_3", "max_pooling2d_1", "conv2d_4", "conv2d_5", "max_pooling2d_2",
			// block 1
			"conv2d_9", "conv2d_10", "conv2d_11", "conv2d_7", "conv2d_8", "average_pooling2d_1", "conv2d_12", "conv2d_6", "mixed0",
			// block 2
			"conv2d_16", "conv2d_17", "conv2d_18", "conv2d_14", "conv2d_15", "average_pooling2d_2", "conv2d_19", "conv2d_13", "mixed1",
			// block 3
			"conv2d_23", "conv2d_24", "conv2d_25", "conv2d_21", "conv2d_22", "average_pooling2d_3", "conv2d_26", "conv2d_20", "mixed2",
			// block 4
			"conv2d_28", "conv2d_29", "conv2d_30", "conv2d_27", "max_pooling2d_3", "mixed3",
			// block 5
			"conv2d_35", "conv2d_36", "conv2d_37", "conv2d_38", "conv2d_39", "conv2d_32", "conv2d_33", "conv2d_34", "average_pooling2d_4", "conv2d_40", "conv2d_31", "mixed4",
			// block 6
			"conv2d_45", "conv2d_46", "conv2d_47", "conv2d_48", "conv2d_49", "conv2d_42", "conv2d_43", "conv2d_44", "average_pooling2d_5", "conv2d_50", "conv2d_41", "mixed5",
			// block 7
			"conv2d_55", "conv2d_56", "conv2d_57", "conv2d_58", "conv2d_59", "conv2d_52", "conv2d_53", "conv2d_54", "average_pooling2d_6", "conv2d_60", "conv2d_51", "mixed6",
			// block 8
			"conv2d_65", "conv2d_66", "conv2d_67", "conv2d_68", "conv2d_69", "conv2d_62", "conv2d_63", "conv2d_64", "average_pooling2d_7", "conv2d_70", "conv2d_61", "mixed7",
			// block 9
			"conv2d_73", "conv2d_74", "conv2d_75", "conv2d_76", "conv2d_71", "conv2d_72", "max_pooling2d_4", "mixed8",
			// block 10
			"conv2d_81", "conv2d_82", "conv2d_83", "conv2d_84", "concatenate_1", "conv2d_78", "conv2d_79", "conv2d_80", "mixed9_0", "average_pooling2d_8", "conv2d_85", "conv2d_77", "mixed9",
			// block 11
			"conv2d_90", "conv2d_91", "conv2d_92", "conv2d_93", "concatenate_2", "conv2d_87", "conv2d_88", "conv2d_89", "mixed9_1", "average_pooling2d_9", "conv2d_94", "conv2d_86", "mixed10",
			// prediction
			"avg_pool", "predictions"]

	} );

	model.load( {

		type: "keras",
		url: '../../assets/model/inception/model.json'

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

			model.predict( [ data ], function( finalResult ){

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

	$("#PredictResult").text(imagenetResult[ maxIndex ]);

}