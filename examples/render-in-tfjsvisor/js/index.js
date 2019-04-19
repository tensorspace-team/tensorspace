let tensorSpaceSurface, chartSurface, summarySurface;
let tspModel;
let barChart;
let signaturePad;
let prediction = undefined;

$(function() {
	
	initSignaturePad();
	bindControlEvent();
	initVisor();
	tfvis.visor().close();
	$("#tfjs-visor-container").addClass('show');
	
});

function initSignaturePad() {
	
	signaturePad = new SignaturePad( document.getElementById( 'signature-pad' ), {
		
		minWidth: 10,
		backgroundColor: 'rgba(255, 255, 255, 0)',
		penColor: '#6E6E6E',
		onEnd: getImage
		
	} );
	
}

function initVisor() {
	
	tensorSpaceSurface = tfvis.visor().surface(
		{
			name: 'LeNet',
			tab: 'TensorSpace Model',
			styles: {
				height: 500,
				width: "95%"
			}
		});
	
	chartSurface = tfvis.visor().surface(
		{
			name: 'Digit Prediction Confidence',
			tab: 'Confidence'
		});
	
	summarySurface = tfvis.visor().surface(
		{
			name: 'Model Summary',
			tab: 'Model Inspection'
		});
	
	tfvis.visor().setActiveTab("TensorSpace Model");
	
	createBarChart( chartSurface );
	createTensorSpaceModel( tensorSpaceSurface );
	
}

function createTensorSpaceModel( surface ) {
	
	let modelContainer = surface.drawArea;
	
	tspModel = new TSP.models.Sequential( modelContainer, {
		stats: true
	} );
	
	tspModel.add( new TSP.layers.GreyscaleInput() );
	tspModel.add( new TSP.layers.Padding2d() );
	tspModel.add( new TSP.layers.Conv2d({
		initStatus: "open"
	}) );
	tspModel.add( new TSP.layers.Pooling2d() );
	tspModel.add( new TSP.layers.Conv2d() );
	tspModel.add( new TSP.layers.Pooling2d() );
	tspModel.add( new TSP.layers.Dense() );
	tspModel.add( new TSP.layers.Dense() );
	tspModel.add( new TSP.layers.Output1d({
		outputs: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
		initStatus: "open"
	}) );
	
	tspModel.load({
		type: "tfjs",
		url: './model/mnist.json',
		onComplete: function() {
			
			tfvis.show.modelSummary(summarySurface, tspModel.getPredictionModel());
			
		}
	});
	tspModel.init();
	
}

function createBarChart( surface ) {
	
	var canvas = document.createElement('canvas');
	
	surface.drawArea.appendChild( canvas );
	
	barChart = new Chart(canvas.getContext('2d'), {
		type: 'bar',
		data: {
			labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
			datasets: [{
				label: '# of Confidence',
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)',
					'rgba(200, 100, 44, 0.2)',
					'rgba(255, 140, 132, 0.2)',
					'rgba(75, 192, 100, 0.2)',
					'rgba(150, 162, 235, 0.2)'
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)',
					'rgba(200, 100, 44, 1)',
					'rgba(255, 140, 132, 1)',
					'rgba(75, 192, 100, 1)',
					'rgba(150, 162, 235, 1)'
				],
				borderWidth: 1
			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			},
			responsive: true
		}
	});
	
}

function getImage() {
	
	let canvas = document.getElementById( "signature-pad" );
	let context = canvas.getContext( '2d' );
	let imgData = context.getImageData( 0, 0, canvas.width, canvas.height );
	
	let signatureData = [];
	
	for ( let i = 0; i < 280; i += 10 ) {
		
		for ( let j = 3; j < 1120; j += 40 ) {
			
			signatureData.push( imgData.data[ 1120 * i + j ] / 255 );
			
		}
		
	}
	
	tspModel.predict( signatureData, function( predictions ) {
		updateChartData( predictions );
		const predictedDigit = getPredictedDigit( predictions );
		addRiffle( predictedDigit );
	} );
	
}

function bindControlEvent() {

	$("#clear").click(function() {
		clear();
	});
	
	$("#metrics").click(function() {
		tfvis.visor().open();
	});
	
}

function updateChartData( data ) {
	
	barChart.data.datasets[0].data = data;
	barChart.update();
	
}

function clear() {

	const chartClearData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	updateChartData( chartClearData );
	
	tspModel.reset();
	signaturePad.clear();
	
	if ( prediction !== undefined ) {
		
		$(prediction).removeClass( "animate" );
		
	}
	
	prediction = undefined;
	
}

function getPredictedDigit( data ) {
	
	let maxIndex = 0;
	let maxConfidence = data[ 0 ];
	
	for ( let i = 1; i < data.length; i ++ ) {
		
		if ( data[ i ] > maxConfidence ) {
			
			maxConfidence = data[ i ];
			maxIndex = i;
			
		}
		
	}
	
	return maxIndex;
	
}

function addRiffle( index ) {
	
	if ( prediction !== undefined ) {
		
		$(prediction).removeClass( "animate" );
		
	}
	
	prediction = "#data" + index;
	
	$(prediction).addClass("animate");

}