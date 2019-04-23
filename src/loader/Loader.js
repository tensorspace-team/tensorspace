/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * Abstract Class, can not be initialized by TensorSpace user.
 * Load model from dependent library, for example, keras, tfjs, tensorflow.
 *
 * Base class for KerasLoader, TfjsLoader, TfLoader.
 *
 * @param tspModel, TensorSpace Model
 * @param config, user's configuration for loader
 * @constructor
 */

function Loader( tspModel, config ) {

	/**
	 * Store TensorSpace Model reference.
	 *
	 * { Model }, TensorSpace Model
	 */

	this.model = tspModel;

	/**
	 * Store loader config.
	 *
	 * { JSON }, user's configuration for Loader.
	 */

	this.config = config;

	/**
	 * Store callback function fired when model load process is completed.
	 *
	 * @type { function }
	 */

	this.onCompleteCallback = undefined;
	
	/**
	 * Store callback function fired periodically before load process is completed.
	 *
	 * @type { function }
	 */
	
	this.onProgressCallBack = undefined;
	
	/**
	 * Tfjs LoadOption object.
	 *
	 * @type { Object }
	 */
	
	this.tfjsLoadOption = {};

	// Load loader's basic configuration.

	this.loadLoaderConfig( config );

}

Loader.prototype = {

	/**
	 * Load Loader's basic configuration.
	 *
	 * @param config, user's Loader configuration
	 */

	loadLoaderConfig: function( config ) {

		if ( this.config !== undefined )  {
			
			// If onProgress is defined by user, store it.
			
			if ( config.onProgress !== undefined ) {
				
				this.onProgressCallBack = config.onProgress;
				this.tfjsLoadOption.onProgress = config.onProgress;
				
			}
			
			// If onComplete callback is defined by user, store it.

			if ( config.onComplete !== undefined ) {

				this.onCompleteCallback = config.onComplete;

			}

		}

	},

	/**
	 * Conditional execute load process.
	 *
	 * If model has not been initialized,
	 * prepare for actual load process, the actual load process will be executed in model's init period.
	 *
	 * If model has already bee initialized,
	 * execute actual load process.
	 *
	 */

	preLoad: function() {

		if ( this.model.isInitialized ) {
			
			this.model.loader = this;
			this.model.hasLoader = true;
			
			// Execute actual load process.

			this.load().then( function() {

			} );

		}

	},

	/**
	 * ============
	 *
	 * Functions below are abstract method for Predictor.
	 * SubClasses ( specific Loader ) override these abstract method to get Loader's characters.
	 *
	 * ============
	 */

	/**
	 * load(), load model asynchronously.
	 *
	 * Basically, has three steps:
	 * 1. Load model into TSP
	 * 2. Set predictor to TSP
	 * 3. Fire callback function if defined.
	 *
	 * @returns { Promise.<void> }
	 */

	load: async function() {

	},

	/**
	 * setPredictor(), create a predictor, config it and set the predictor for TSP model.
	 */

	setPredictor: function() {

	}

};

export { Loader };