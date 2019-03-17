/**
 * @author syt123450 / https://github.com/syt123450
 */

import * as tf from "@tensorflow/tfjs";
import { Loader } from './Loader';
import { TfPredictor } from "../predictor/TfPredictor";

/**
 * Load tensorflow model for TensorSpace.
 *
 * @param model, model context
 * @param config, user's configuration for Loader
 * @constructor
 */

function TfLoader( model, config ) {

	// "TfLoader" inherits from abstract Loader "Loader".

	Loader.call( this, model, config );

	/**
	 * tensorflow model's url (.pb file's url).
	 * Important parameter for TfLoader to get tensorflow model.
	 *
	 * @type { url }
	 */

	this.url = undefined;

	/**
	 * User's predefined outputsName list.
	 * If set, TfLoader will set this name list to TfPredictor.
	 *
	 * @type { Array }
	 */

	this.outputsName = undefined;

	// Load TfLoader's configuration.

	this.loadTfConfig( config );

	this.loaderType = "TfLoader";

}

TfLoader.prototype = Object.assign( Object.create( Loader.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class Loader's abstract method
	 *
	 * TfLoader overrides Loader's function:
	 * load, setPredictor
	 *
	 * ============
	 */

	/**
	 * load(), load tensorflow model asynchronously.
	 *
	 * Three steps:
	 * 1. Load tensorflow model into TSP
	 * 2. Set tensorflow predictor to TSP
	 * 3. Fire callback function if defined.
	 *
	 * @returns { Promise.<void> }
	 */

	load: async function() {

		let loadedModel;
		
		if ( this.outputsName !== undefined ) {
			
			loadedModel = await tf.loadGraphModel( this.url, this.tfjsLoadOption );
			
		} else {
			
			loadedModel = await tf.loadLayersModel( this.url, this.tfjsLoadOption );
			
		}

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
	 * setPredictor(), create a tensorflow predictor, config it and set the predictor for TSP model.
	 */

	setPredictor: function() {

		let tfPredictor = new TfPredictor( this.model, this.config );
		tfPredictor.setOutputsName( this.outputsName );

		this.model.predictor = tfPredictor;

	},

	/**
	 * ============
	 *
	 * Functions above override base class Predictor's abstract method.
	 *
	 * ============
	 */

	/**
	 * loadTfConfig(), Load user's configuration into TfLoader.
	 * The configuration load in this function sometimes has not been loaded in "Loader"'s "loadLoaderConfig".
	 *
	 * @param loaderConfig
	 */

	loadTfConfig: function( loaderConfig ) {

		// "url" configuration is required.

		if ( loaderConfig.url !== undefined ) {

			this.url = loaderConfig.url;

		} else {

			console.error( "\"url\" property is required to load tensorflow model." );

		}

		// Optional configuration.

		if ( loaderConfig.outputsName !== undefined ) {

			this.outputsName = loaderConfig.outputsName;

		}

	}

} );

export { TfLoader };