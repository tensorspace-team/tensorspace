/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Loader } from './Loader';
import { TfjsPredictor } from "../predictor/TfjsPredictor";

function TfjsLoader( model, config ) {

	Loader.call( this, model );

	this.url = undefined;
	this.onCompleteCallback = undefined;

	this.type = "TfjsLoader";

	this.loadLoaderConfig( config );

}

TfjsLoader.prototype = Object.assign( Object.create( Loader.prototype ), {

	loadLoaderConfig: function( loaderConfig ) {

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

		this.model.predictor = new TfjsPredictor( this.model );

	}

} );

export { TfjsLoader };