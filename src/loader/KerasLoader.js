/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Loader } from './Loader';
import { KerasPredictor } from "../predictor/KerasPredictor";

function KerasLoader( model, config ) {

	Loader.call( this, model, config );

	this.url = undefined;
	this.onCompleteCallback = undefined;

	this.type = "KerasLoader";

	this.loadKerasConfig( config );

}

KerasLoader.prototype = Object.assign( Object.create( Loader.prototype ), {

	loadKerasConfig: function( loaderConfig ) {

		if ( loaderConfig.url !== undefined ) {

			this.url = loaderConfig.url;

		} else {

			console.error( "\"url\" property is required to load Keras model." );

		}

		if ( loaderConfig.onComplete !== undefined ) {

			this.onCompleteCallback = loaderConfig.onComplete;

		}

	},

	// load model asynchronously
	load: async function() {

		const loadedModel = await tf.loadModel( this.url );
		this.model.resource = loadedModel;
		this.model.isFit = true;

		this.model.modelType = "keras";
		this.setPredictor();

		if ( this.onCompleteCallback !== undefined ) {

			this.onCompleteCallback();

		}

	},

	setPredictor: function() {

		let kerasPredictor = new KerasPredictor( this.model );
		this.configInputShape( kerasPredictor );
		this.model.predictor = kerasPredictor;

	}

} );

export { KerasLoader };