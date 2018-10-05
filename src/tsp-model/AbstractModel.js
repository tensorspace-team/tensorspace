/**
 * @author syt123450 / https://github.com/syt123450
 */

import { SceneInitializer } from '../scene/SceneInitializer';
import { TfjsLoader } from '../loader/TfjsLoader';
import { KerasLoader } from "../loader/KerasLoader";
import { TfLoader } from "../loader/TfLoader";

/**
 * AbstractModel, abstract model, can not be initialized by TensorSpace user.
 * Base class for Sequential, Model
 *
 * @param container, a DOM element where TSP model will be rendered to.
 * @constructor
 */

function AbstractModel( container ) {

	// AbstractModel mixin "SceneInitializer".

	SceneInitializer.call( this, container );

	/**
	 *	Store loader.
	 *	Three kinds of loader: TfLoader, TfjsLoader, KerasLoader.
	 *
	 * @type { Loader }
	 */

	this.loader = undefined;

	/**
	 * Sign showing whether model has a preload loader.
	 * true -- has a preload loader
	 * false -- empty model, do not have a preload loader
	 *
	 * @type { boolean }
	 */

	this.hasLoader = false;

	/**
	 * Whether model has loaded a prediction model.
	 * true -- A loader has already load a prediction to TSP model
	 * false -- Empty model, do not have a prediction for prediction
	 *
	 * @type { boolean }
	 */

	this.isInitialized = false;

	/**
	 * Actual prediction model.
	 * undefined means no prediction model.
	 *
	 * @type { model }
	 */

	this.resource = undefined;

	/**
	 * Store prediction result from prediction model.
	 *
	 * @type { undefined }
	 */

	this.predictResult = undefined;

	/**
	 * Used to trigger model prediction and get predict result
	 *
	 * @type { Predictor }
	 */

	this.predictor = undefined;

	/**
	 * Prediction model type.
	 * Three types now: "Model", "Sequential"
	 *
	 * @type { string }
	 */

	this.modelType = undefined;

}

AbstractModel.prototype = Object.assign( Object.create( SceneInitializer.prototype ), {

	/**
	 * load(), load prediction model based on "type" attribute in user's configuration.
	 *
	 * @param config
	 */

	load: function( config ) {

		if ( config.type === "tfjs" ) {

			this.loadTfjsModel( config );

		} else if ( config.type === "keras" ) {

			this.loadKerasModel( config );

		} else if ( config.type === "tensorflow" ) {

			this.loadTfModel( config );

		} else {

			console.error( "Do not support to load model type " + config.type );

		}

	},

	/**
	 * loadTfjsModel(), create TFJSLoader and execute preLoad.
	 *
	 * @param config, user's config for TfjsLoader.
	 */

	loadTfjsModel: function( config ) {

		let loader = new TfjsLoader( this, config );
		loader.preLoad();

	},

	/**
	 * loadKerasModel(), create KerasLoader and execute preLoad.
	 *
	 * @param config, user's config for KerasLoader.
	 */

	loadKerasModel: function( config ) {

		let loader = new KerasLoader( this, config );
		loader.preLoad();

	},

	/**
	 * loadTfModel(), create TfLoader and execute preLoad.
	 *
	 * @param config, user's config for TfLoader.
	 */

	loadTfModel: function( config ) {

		let loader = new TfLoader( this, config );
		loader.preLoad();

	},

	/**
	 * Store loader.
	 *
	 * @param loader
	 */

	setLoader: function( loader ) {

		this.loader = loader;

	}

} );

export { AbstractModel };