/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Loader } from './Loader';
import { TfjsPredictor } from "../predictor/TfjsPredictor";

/**
 * Load tfjs model for TensorSpace.
 *
 * @param model, model context
 * @param config, user's configuration for Loader
 * @constructor
 */

function TfjsLoader( model, config ) {

	// "TfjsLoader" inherits from abstract Loader "Loader".

	Loader.call( this, model, config );

	/**
	 * tfjs model's url (.json file's url).
	 * TfjsLoader will get tfjs model from this url.
	 *
	 * @type { url }
	 */

	this.url = undefined;

	// Load TfjsLoader's configuration.

	this.loadTfjsConfig( config );

	this.loaderType = "TfjsLoader";

}

TfjsLoader.prototype = Object.assign( Object.create( Loader.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class Loader's abstract method
	 *
	 * TfjsLoader overrides Loader's function:
	 * load, setPredictor
	 *
	 * ============
	 */

	/**
	 * load(), load tfjs model asynchronously.
	 *
	 * Three steps:
	 * 1. Load tfjs model into TSP
	 * 2. Set tfjs predictor to TSP
	 * 3. Fire callback function if defined.
	 *
	 * @returns { Promise.<void> }
	 */

	load: async function() {

		const loadedModel = await tf.loadModel( this.url );

		this.model.resource = loadedModel;

		this.setPredictor();

		if ( this.onCompleteCallback !== undefined ) {

			this.onCompleteCallback();

		}

	},

	/**
	 * setPredictor(), create a tfjs predictor, config it and set the predictor for TSP model.
	 */

	setPredictor: function() {

		let tfjsPredictor = new TfjsPredictor( this.model, this.config );

		this.model.predictor = tfjsPredictor;

	},

	/**
	 * ============
	 *
	 * Functions above override base class Predictor's abstract method.
	 *
	 * ============
	 */

	/**
	 * loadTfjsConfig(), Load user's configuration into TfjsLoader.
	 * The configuration load in this function sometimes has not been loaded in "Loader"'s "loadLoaderConfig".
	 *
	 * @param loaderConfig
	 */

	loadTfjsConfig: function( loaderConfig ) {

		// "url" configuration is required.

		if ( loaderConfig.url !== undefined ) {

			this.url = loaderConfig.url;

		} else {

			console.error( "\"url\" property is required to load tensorflow.js model." );

		}

	}

} );

export { TfjsLoader };