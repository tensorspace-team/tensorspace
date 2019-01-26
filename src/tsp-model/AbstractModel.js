/**
 * @author syt123450 / https://github.com/syt123450
 * @author zchholmes / https://github.com/zchholmes
 */

import { SceneInitializer } from '../scene/SceneInitializer';
import { TfjsLoader } from '../loader/TfjsLoader';
import { KerasLoader } from "../loader/KerasLoader";
import { TfLoader } from "../loader/TfLoader";
import { LiveLoader } from "../loader/LiveLoader";
import { ModelConfiguration } from "../configure/ModelConfiguration";

/**
 * AbstractModel, abstract model, should not be initialized directly.
 * Base class for Sequential, Model
 *
 * @param container, a DOM element where TSP model will be rendered to.
 * @param config, user's config for Sequential model.
 * @constructor
 */

function AbstractModel( container, config ) {

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
	 * Store user's input value for prediction.
	 *
	 * @type { Array }
	 */

	this.inputValue = undefined;

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

	/**
	 * Store all layers in Model.
	 *
	 * @type { Layer[] }
	 */

	this.layers = [];

	/**
	 * Record layer hovered by mouse now.
	 *
	 * @type { Layer }
	 */

	this.hoveredLayer = undefined;

	/**
	 * Model's depth in visualization.
	 *
	 * @type { Int }
	 */

	this.depth = undefined;

	/**
	 * Model's context, containing all THREE.Object for a TSP model.
	 *
	 * @type { THREE.Object }
	 */

	this.modelContext = undefined;

	/**
	 * Model configuration.
	 * Initialized with user's model config and default model config.
	 *
	 * @type { ModelConfiguration }
	 */

	this.configuration = new ModelConfiguration( config );

	// Pass configuration to three.js scene.

	this.loadSceneConfig( this.configuration );

	// Create actual three.js scene.

	this.createScene();

	this.modelContext = new THREE.Object3D();

	this.scene.add( this.modelContext );

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

		} else if ( config.type = "live" ) {

			this.loadLiveModel( config );

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

	loadLiveModel: function( config ) {

		let loader = new LiveLoader( this, config );
		loader.preLoad();

	},

	/**
	 * Store loader.
	 *
	 * @param loader
	 */

	setLoader: function( loader ) {

		this.loader = loader;

	},

	/**
	 * Get TSP layer stored in model by name.
	 *
	 * @param name
	 * @return { Layer }, layer with given name.
	 */

	getLayerByName: function( name ) {

		for ( let i = 0; i < this.layers.length; i ++ ) {

			if ( this.layers[ i ].name === name ) {

				return this.layers[ i ];

			}

		}

	},

	/**
	 * Get all TSP layer stored in model.
	 *
	 * @return { Layer[] }, layer list.
	 */

	getAllLayers: function() {

		return this.layers;

	},

	/**
	 * init(), Init model,
	 * As TSP is applying lazy initialization strategy, time-consuming work will be done in this process.
	 * After init process, the model will be rendered onto container.
	 *
	 * @param callback, user's predefined callback function, fired when init process completed.
	 */

	init: function( callback ) {

		if ( this.hasLoader ) {

			// If has a predefined loader, load model before init sequential elements.

			let self = this;
			this.loader.load().then( function() {

				// Init sequential elements.

				self.initTSPModel();

				// Execute callback at the end if callback function is predefined.

				if ( callback !== undefined ) {

					callback();

				}

			} );

		} else {

			// Init sequential elements.

			this.initTSPModel();

			// Execute callback at the end if callback function is predefined.

			if ( callback !== undefined ) {

				callback();

			}

		}

	},

	/**
	 * ============
	 *
	 * Functions below are abstract method for Layer.
	 * SubClasses ( specific Model ) override these abstract methods.
	 *
	 * ============
	 */

	/**
	 * predict(), abstract method
	 *
	 * Generates output predictions for the input sample.
	 *
	 * @param input, user's input data
	 * @param callback, user' predefined callback function, execute after prediction.
	 */

	predict: function( input, callback ) {


	},

	/**
	 * clear(), abstract method
	 *
	 * Override to clear all layers' visualization and model's input data.
	 */

	clear: function() {

	},

	/**
	 * reset(), abstract method
	 *
	 * Override to add reset model.
	 */

	reset: function() {

	},

	/**
	 * onClick(), abstract method.
	 *
	 * override this function to add handler for click event.
	 *
	 * @param event
	 */

	onClick: function( event ) {

	},

	/**
	 * onMouseMove(), abstract method.
	 *
	 * Override this function to add handler for mouse move event.
	 *
	 * @param event
	 */

	onMouseMove: function( event ) {

	},

	/**
	 * initTSPModel(), abstract method
	 *
	 * Override to handle actual element creation.
	 */

	initTSPModel: function() {

	}

} );

export { AbstractModel };
