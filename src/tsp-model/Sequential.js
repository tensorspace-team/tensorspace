/**
 * @author syt123450 / https://github.com/syt123450
 */

import { AbstractModel } from './AbstractModel';
import { ModelConfiguration } from "../configure/ModelConfiguration";
import { LayerLocator } from "../utils/LayerLocator";
import { ActualDepthCalculator } from "../utils/ActualDepthCalculator";

/**
 * A model with linear stack of layers.
 *
 * @param container, a DOM element where TSP model will be rendered to.
 * @param config, user's config for Sequential model.
 * @constructor
 */

function Sequential( container, config ) {

	// "Sequential" inherits from abstract Model "AbstractModel".

	AbstractModel.call( this, container );

	/**
	 * Store all layers in the sequential in order.
	 *
	 * @type { Layer[] }
	 */

	this.layers = [];

	/**
	 * Model configuration.
	 * Initialized with user's model config and default model config.
	 *
	 * @type { ModelConfiguration }
	 */

	this.configuration = new ModelConfiguration( config );

	/**
	 * Record layer hovered by mouse now.
	 *
	 * @type { Layer }
	 */

	this.hoveredLayer = undefined;

	/**
	 * Store user's input value for prediction.
	 *
	 * @type { Array }
	 */

	this.inputValue = undefined;

	// Pass configuration to three.js scene.

	this.loadSceneConfig( this.configuration );

	// Create actual three.js scene.

	this.createScene();

	this.modelType = "Sequential";

}

Sequential.prototype = Object.assign( Object.create( AbstractModel.prototype ), {

	/**
	 * add(), add a new TSP layer to sequential model
	 *
	 * Four main task in adding process:
	 * 1. Set previous layer for the new TSP layer.
	 * 2. Config environment for new TSP layer.
	 * 3. Add a TSP layer instance on top of the layer stack.
	 * 4. Assemble new layer, which mean that calculate the layer's shape.
	 *
	 * @param layer, new TSP layer
	 */

	add: function( layer ) {

		// Set last layer for native layer.

		if ( this.layers.length !== 0 ) {

			if ( !layer.isMerged ) {

				let tailLayer = this.layers[ this.layers.length - 1 ];
				layer.setLastLayer( tailLayer );

			}

		}

		// Config environment for new layer.

		layer.setEnvironment( this.scene, this );
		layer.loadModelConfig( this.configuration );

		// Add layer on top of layer stack.

		this.layers.push( layer ) ;

		// Assemble new layer.

		layer.assemble( this.layers.length );

	},

	/**
	 * init(), Init sequential model,
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
	 * onMouseMove(), Handler for mouse move event.
	 *
	 * @param event
	 */

	onMouseMove: function( event ) {

		// calculate mouse position..

		this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		let model = this;

		if ( model.hoveredLayer !== undefined ) {

			model.hoveredLayer.handleHoverOut();
			model.hoveredLayer = undefined;

		}

		// Use Raycaster to capture hovered element.

		model.raycaster.setFromCamera( model.mouse, model.camera );
		let intersects = model.raycaster.intersectObjects( model.scene.children, true );

		for ( let i = 0; i < intersects.length; i ++ ) {

			if ( intersects !== null && intersects.length > 0 && intersects[ i ].object.type === "Mesh" ) {

				let selectedElement = intersects[ i ].object;

				if ( selectedElement.hoverable === true ) {

					let selectedLayer = this.layers[ selectedElement.layerIndex - 1 ];

					// Let the layer to handle actual hover event.

					selectedLayer.handleHoverIn( selectedElement );

					this.hoveredLayer = selectedLayer;

					break;

				}

			}

		}

	},

	/**
	 * onClick(), Handler for move click event.
	 *
	 * @param event
	 */

	onClick: function ( event ) {

		let model = this;

		// Use Raycaster to capture clicked element.

		model.raycaster.setFromCamera( model.mouse, model.camera );
		let intersects = model.raycaster.intersectObjects( model.scene.children, true );

		for ( let i = 0; i < intersects.length; i ++ ) {

			if ( intersects !== null && intersects.length > 0 && intersects[ i ].object.type === "Mesh" ) {

				let selectedElement = intersects[ i ].object;

				if ( selectedElement.clickable === true ) {

					// Let the layer to handle actual click event.

					let selectedLayer = this.layers[ selectedElement.layerIndex - 1 ];

					selectedLayer.handleClick( selectedElement );

					break;

				}

 			}

		}

	},

	/**
	 * initTSPModel(), call all functions required in model initialization process.
	 */

	initTSPModel: function() {

		this.updateCamera( this.layers.length );
		this.createModelElements();
		this.registerModelEvent();
		this.animate();

		this.isInitialized = true;

	},

	/**
	 * createModelElements(), get layer configure and init layer elements.
	 *
	 * Three steps:
	 * 1. Calculate layer center position in the scene.
	 * 2. Calculate layer aggregation's depth based on its depth
	 * 3. Call all layers' init
	 */

	createModelElements: function() {

		let layersPos = LayerLocator.calculateLayersPos( this.layers );
		let layerActualDepth = ActualDepthCalculator.calculateDepths( this );

		for ( let i = 0; i < this.layers.length; i ++ ) {

			this.layers[ i ].init( layersPos[ i ], layerActualDepth[ i ] );

		}

	},

	/**
	 * predict(), Generates output predictions for the input sample.
	 *
	 * @param input
	 * @param callback
	 */

	predict: function( input, callback ) {

		this.inputValue = input;

		if ( this.resource !== undefined ) {

			// If a prediction model has already been loaded into TSP, use predictor to get the prediction result.

			this.predictResult = this.predictor.predict( input, callback );

			// Update all layer's visualization.

			this.updateLayerVis();

		} else {

			// If no prediction model be loaded into TSP, just update the input layer.

			this.updateInputVis();

		}

	},

	/**
	 * updateLayerVis(), update input layer and other layer separately based on input and prediction result.
	 */

	updateLayerVis: function() {

		// Update input layer's visualization.

		this.updateInputVis();

		// Update other layer's visualization.

		this.updateLayerPredictVis();

	},

	/**
	 * updateInputVis(), update input layer's visualizatiion.
	 */

	updateInputVis: function() {

		if ( this.predictor.multiInputs ) {

			this.layers[ 0 ].updateValue( this.inputValue[ 0 ] );

		} else {

			this.layers[ 0 ].updateValue( this.inputValue );

		}

	},

	/**
	 * updateLayerPredictVis(), update layer's visualization except input layer.
	 */

	updateLayerPredictVis: function() {

		let outputCount = 0;

		for ( let i = 1; i < this.layers.length; i ++ ) {

			if ( !this.layers[ i ].autoOutputDetect ) {

				// Pass the prediction result to layers which need a output value from model.

				let predictValue = this.predictResult[ outputCount ].dataSync();

				this.layers[ i ].updateValue( predictValue );

				outputCount ++;

			} else {

				// Directly call updateValue function without pass a value for autoOutputDetect layer.

				this.layers[ i ].updateValue();

			}

		}

	},

	/**
	 * clear(), clear all layers' visualization and model's input data.
	 */

	clear: function() {

		for ( let i = 0; i < this.layers.length; i ++ ) {

			this.layers[ i ].clear();

		}

		this.inputValue = undefined;

	},

	/**
	 * reset(), reset the model.
	 *
	 * Three steps:
	 * 1. clear the layer visualization;
	 * 2. reset TrackballControl;
	 * 3. update camera setting in TSP.
	 */

	reset: function() {

		this.clear();
		this.cameraControls.reset();
		this.updateCamera();

	}

} );

export { Sequential };