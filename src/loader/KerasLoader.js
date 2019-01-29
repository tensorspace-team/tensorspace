/**
 * @author syt123450 / https://github.com/syt123450
 */

import * as tf from "@tensorflow/tfjs";
import { Loader } from './Loader';
import { KerasPredictor } from "../predictor/KerasPredictor";

/**
 * Load keras model for TensorSpace.
 *
 * @param model, model context
 * @param config, user's configuration for Loader
 * @constructor
 */

function KerasLoader( model, config ) {

	// "KerasLoader" inherits from abstract Loader "Loader".

	Loader.call( this, model, config );

	/**
	 * Keras model's url (.json file's url).
	 * KerasLoader will get Keras model from this url.
	 *
	 * @type { url }
	 */

	this.url = undefined;

	// Load KerasLoader's configuration.

	this.loadKerasConfig( config );

	this.loaderType = "KerasLoader";

}

KerasLoader.prototype = Object.assign( Object.create( Loader.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class Loader's abstract method
	 *
	 * KerasLoader overrides Loader's function:
	 * load, setPredictor
	 *
	 * ============
	 */

	/**
	 * load(), load Keras model asynchronously.
	 *
	 * Three steps:
	 * 1. Load Keras model into TSP
	 * 2. Set Keras predictor to TSP
	 * 3. Fire callback function if defined.
	 *
	 * @returns { Promise.<void> }
	 */

	load: async function() {

		const loadedModel = await tf.loadModel( this.url );

		this.model.resource = loadedModel;

		if ( this.model.modelType === "Model" ) {

			this.model.outputsOrder = loadedModel.outputNames;

		}

		this.setPredictor();

		if ( this.onCompleteCallback !== undefined ) {

			this.onCompleteCallback();

		}

	},

	/**
	 * setPredictor(), create a keras predictor, config it and set the predictor for TSP model.
	 */

	setPredictor: function() {

		let kerasPredictor = new KerasPredictor( this.model, this.config );

		this.model.predictor = kerasPredictor;

	},

	/**
	 * ============
	 *
	 * Functions above override base class Predictor's abstract method.
	 *
	 * ============
	 */

	/**
	 * loadKerasConfig(), Load user's configuration into KerasLoader.
	 * The configuration load in this function sometimes has not been loaded in "Loader"'s "loadLoaderConfig".
	 *
	 * @param loaderConfig
	 */

	loadKerasConfig: function( loaderConfig ) {

		// "url" configuration is required.

		if ( loaderConfig.url !== undefined ) {

			this.url = loaderConfig.url;

		} else {

			console.error( "\"url\" property is required to load Keras model." );

		}

	}

} );

export { KerasLoader };