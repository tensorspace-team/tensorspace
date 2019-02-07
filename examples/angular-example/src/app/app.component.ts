import { Component, AfterViewInit} from '@angular/core';
import * as TSP from 'tensorspace';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})

export class AppComponent implements AfterViewInit {
	title = 'Tensorspace - Hellp Angular';

	constructor() { }

	ngAfterViewInit() {

		let container = document.getElementById('container');
		let model = new TSP.models.Sequential( container );

		model.add( new TSP.layers.GreyscaleInput({ shape: [28, 28, 1] }) );
		model.add( new TSP.layers.Padding2d({ padding: [2, 2] }) );
		model.add( new TSP.layers.Conv2d({ kernelSize: 5, filters: 6, strides: 1 }) );
		model.add( new TSP.layers.Pooling2d({ poolSize: [2, 2], strides: [2, 2] }) );
		model.add( new TSP.layers.Conv2d({ kernelSize: 5, filters: 16, strides: 1 }) );
		model.add( new TSP.layers.Pooling2d({ poolSize: [2, 2], strides: [2, 2] }) );
		model.add( new TSP.layers.Dense({ units: 120 }) );
		model.add( new TSP.layers.Dense({ units: 84 }) );
		model.add( new TSP.layers.Output1d({
			units: 10,
			outputs: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
		}) );

		// Load model
		model.load({

			type: "tfjs",
			url: './assets/model/mnist.json',
			onComplete: function() {
				console.log( "\"Hello Angular!\" from TensorSpace Loader." );
			}

		});

		// Load data
		model.init( function() {

			fetch('./assets/data/5.json')
				.then(res => res.json())
				.then(data => {
						model.predict(data);
				});

		} );

	}

}
