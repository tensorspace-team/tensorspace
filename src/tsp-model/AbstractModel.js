/**
 * @author syt123450 / https://github.com/syt123450
 * @author zchholmes / https://github.com/zchholmes
 */

import * as THREE from "three";
import { ModelConfiguration } from "../configure/ModelConfiguration";
import { HTMLUtils } from '../utils/HTMLUtils';
import { LoaderFactory } from '../loader/LoaderFactory';

/**
 * AbstractModel, abstract model, should not be initialized directly.
 * Base class for Sequential, Model
 *
 * @param container, a DOM element where TSP model will be rendered to.
 * @param config, user's config for model.
 * @constructor
 */

function AbstractModel( container, config ) {
	
	/**
	 * TensorSpace Model will be rendered in this HTML Dom element.
	 *
	 * @type { HTMLElement }
	 */
	
	this.container = undefined;
	
	/**
	 * Store Loader reference.
	 * Four kinds of loader: TfLoader, TfjsLoader, KerasLoader, LiveLoader.
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
	 * Two types now: "Model", "Sequential"
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
	 * Model's depth in visualization.
	 *
	 * @type { Int }
	 */
	
	this.depth = undefined;
	
	/**
	 * Model configuration.
	 * Initialized with user's model config and default model config.
	 *
	 * @type { ModelConfiguration }
	 */
	
	this.configuration = undefined;
	
	/**
	 * Model's context, containing all THREE.Object for a TSP model.
	 *
	 * @type { THREE.Object }
	 */
	
	this.modelContext = new THREE.Object3D();
	
	/**
	 * TensorSpace Model render strategy, based on `renderer` attribute in Configuration.
	 * Two Types: Web3DRenderer, WebVRRenderer.
	 * Default to Web3DRenderer.
	 *
	 * @type { ModelRenderer }
	 */
	
	this.modelRenderer = undefined;
	
	this.loadConfiguration( container, config );
	
}

AbstractModel.prototype = {
	
	loadConfiguration: function( args1, args2 ) {
		
		if ( HTMLUtils.isElement( args1 ) ) {
			
			this.container = args1;
			this.configuration = new ModelConfiguration( args2 );
			
		} else {
			
			this.configuration = new ModelConfiguration( args1 );
			
		}
		
	},
	
	/**
	 * load(), two steps:
	 * 1. get Loader from LoaderFactory;
	 * 2. store Loader in TensorSpace Model.
	 *
	 * Note:
	 * The actual pre-trained model loading will be done in model's init() time.
	 *
	 * @param config, Loader configuration
	 */
	
	load: function( config ) {
		
		this.loader = LoaderFactory.getLoader( this, config );
		this.hasLoader = true;
		
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
	 * return Actual prediction model,
	 * Developer can directly manipulate the model,
	 * for example, get model summary, make predictions.
	 */
	
	getPredictionModel: function() {
		
		return this.resource;
		
	},
	
	/**
	 * Get THREE's scene through ModelRenderer.
	 *
	 * @return { THREE.Scene }
	 */
	
	getScene: function() {
	
		return this.modelRenderer.getScene();
		
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
	 * initTSPModel(), abstract method
	 *
	 * Override to handle actual element creation.
	 */
	
	initTSPModel: function() {
	
	}
	
};

export { AbstractModel };
