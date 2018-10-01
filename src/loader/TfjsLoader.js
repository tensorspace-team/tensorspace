/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Loader } from './Loader';
import { TfjsPredictor } from "../predictor/TfjsPredictor";

function TfjsLoader( model, config ) {

	Loader.call( this, model, config );

	this.url = undefined;
	this.onCompleteCallback = undefined;

	this.type = "TfjsLoader";

	this.loadTfjsConfig( config );

}

TfjsLoader.prototype = Object.assign( Object.create( Loader.prototype ), {

	loadTfjsConfig: function( loaderConfig ) {

		if ( loaderConfig.url !== undefined ) {

			this.url = loaderConfig.url;

		} else {

			console.error( "\"url\" property is required to load tensorflow.js model." );

		}

		if ( loaderConfig.onComplete !== undefined ) {

			this.onCompleteCallback = loaderConfig.onComplete;

		}

	},

	load: async function() {

		const loadedModel = await tf.loadModel( this.url );
		this.model.resource = loadedModel;
		this.model.isFit = true;

		this.model.modelType = "tfjs";
		this.setPredictor();

		if ( this.onCompleteCallback !== undefined ) {

			this.onCompleteCallback();

		}

	},

	setPredictor: function() {

		let tfjsPredictor = new TfjsPredictor( this.model );
		this.configInputShape( tfjsPredictor );

		this.model.predictor = tfjsPredictor;

	}

} );

export { TfjsLoader };