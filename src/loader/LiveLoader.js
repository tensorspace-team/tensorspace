/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Loader } from "./Loader";
import { LivePredictor } from "../predictor/LivePredictor";

/**
 * Load live model for TensorSpace.
 * As keras and tensorflow model can not run in the browser, this live loader works for tfjs model.
 *
 * @param tspModel, TensorSpace Model
 * @param config, user's configuration for Loader
 * @constructor
 */

function LiveLoader( tspModel, config ) {

	// "LiveLoader" inherits from abstract Loader "Loader".

	Loader.call( this, tspModel, config );

	/**
	 * tfjs model's reference
	 * LiveLoader will store tfjs model's reference into TensorSpace model.
	 *
	 * @type { reference }
	 */

	this.modelHandler = undefined;

	this.loadLiveConfig( config );

	this.loaderType = "liveLoader";

}

LiveLoader.prototype = Object.assign( Object.create( Loader.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class Loader's abstract method
	 *
	 * LiveLoader overrides Loader's function:
	 * load, setPredictor
	 *
	 * ============
	 */

	/**
	 * load(), load a live tfjs model.
	 * Its an synchronous process, to make it compatible with other loader, use async method.
	 *
	 * Three steps:
	 * 1. Load tfjs model into TSP
	 * 2. Set live predictor to TSP
	 * 3. Fire callback function if defined.
	 *
	 * @returns { Promise.<void> }
	 */

	load: async function() {

		this.model.resource = this.modelHandler;

		if ( this.model.modelType === "Model" ) {

			this.model.outputsOrder = this.model.outputNames;

		}

		this.setPredictor();

		if ( this.onCompleteCallback !== undefined ) {

			this.onCompleteCallback();

		}

	},

	/**
	 * setPredictor(), create a live predictor, config it and set the predictor for TSP model.
	 */

	setPredictor: function() {

		let livePredictor = new LivePredictor( this.model, this.config );

		this.model.predictor = livePredictor;

	},

	/**
	 * ============
	 *
	 * Functions above override base class Predictor's abstract method.
	 *
	 * ============
	 */

	/**
	 * loadLiveConfig(), Load user's configuration into LiveLoader.
	 * The configuration load in this function sometimes has not been loaded in "Loader"'s "loadLoaderConfig".
	 *
	 * @param loaderConfig
	 */

	loadLiveConfig: function( loaderConfig ) {

		// "modelHandler" configuration is required.

		if ( loaderConfig.modelHandler !== undefined ) {

			this.modelHandler = loaderConfig.modelHandler;

		} else {

			console.error( "\"modelHandler\" property is required to load live model." );

		}

	}

} );

export { LiveLoader };