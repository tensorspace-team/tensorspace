/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * Abstract Class, can not be initialized by TensorSpace user.
 * Load model from dependent library, for example, keras, tfjs, tensorflow.
 *
 * Base class for KerasLoader, TfjsLoader, TfLoader.
 *
 * @param model, model context
 * @param config, user's configuration for loader
 * @constructor
 */

function Loader( model, config ) {

	/**
	 * Store model context.
	 *
	 * { Object }, model context
	 */

	this.model = model;

	/**
	 * Store loader config.
	 *
	 * { JSON }, user's configuration for loader.
	 */

	this.config = config;

	/**
	 * Store callback function fired when model load process is completed.
	 *
	 * @type { function }
	 */

	this.onCompleteCallback = undefined;

	// Load loader's basic configuration.

	this.loadLoaderConfig( config );

}

Loader.prototype = {

	/**
	 * Load loader's basic configuration.
	 *
	 * @param config, user's loader configuration
	 */

	loadLoaderConfig: function( config ) {

		if ( this.config !== undefined )  {

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

		// Prepare for actual load process.

		this.model.loader = this;
		this.model.hasLoader = true;

		if ( this.model.isInitialized ) {

			// Execute actual load process.

			this.load().then( function() {

			} );

		}

	},

	/**
	 * Add input shape to predictor.
	 *
	 * @param predictor
	 */

	configInputShape: function( predictor ) {

		if ( this.config.multiInput !== undefined && this.config.multiInput ) {

			this.setShapeList( predictor);

		} else {

			this.setSingleShape( predictor );

		}

	},

	/**
	 * setSingleShape(), set an input shape to predictor.
	 * If the model has only one input, get input shape from TSP model and set it to predictor.
	 *
	 * @param predictor
	 */

	setSingleShape: function( predictor ) {

		// Get input shape from TSP model's first layer.

		predictor.inputShape = this.model.layers[ 0 ].outputShape;

	},

	/**
	 * setShapeList(), set input shape list to predictor.
	 * If the model has multiple inputs, get input shapes from user's configuration and set them to predictor.
	 *
	 * @param predictor
	 */

	setShapeList: function( predictor ) {

		// Set multiple inputs identity.

		predictor.multiInputs = true;

		// Get multiple input shapes from "inputShapes" attribute.

		predictor.inputShapes = this.config.inputShapes;

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