/**
 * @author syt123450 / https://github.com/syt123450
 */

import * as tf from "@tensorflow/tfjs";
import { AbstractModel } from './AbstractModel';
import { LayerLocator } from "../utils/LayerLocator";
import { ActualDepthCalculator } from "../utils/ActualDepthCalculator";
import { RendererFactory } from '../renderer/RendererFactory';
import { LayerShapeGenerator } from '../utils/LayerShapeGenerator';

/**
 * A model with linear stack of layers.
 *
 * @param container, a DOM element where TSP model will be rendered to.
 * @param config, user's config for Sequential model.
 * @constructor
 */

function Sequential( container, config ) {
	
	// "Sequential" inherits from abstract Model "AbstractModel".
	
	AbstractModel.call( this, container, config );
	
	this.modelType = "Sequential";
	
}

Sequential.prototype = Object.assign( Object.create( AbstractModel.prototype ), {
	
	/**
	 * ============
	 *
	 * Functions below override base class AbstractModel's abstract method
	 *
	 * Sequential overrides AbstractModel's function:
	 * predict, clear, reset, initTSPModel
	 *
	 * ============
	 */
	
	/**
	 * predict(), Generates output predictions for the input sample.
	 *
	 * @param input
	 * @param callback
	 */
	
	predict: function( input, callback ) {
		
		this.clear();
		
		this.inputValue = input;
		
		if ( this.resource !== undefined ) {
			
			// If a prediction model has already been loaded into TSP, use predictor to get the prediction result.
			
			this.predictResult = this.predictor.predict( input );
			
			// Update all layer's visualization.
			
			this.updateVis();
			
		} else {
			
			// If no prediction model be loaded into TSP, just update the input layer.
			
			this.updateInputVis();
			
		}
		
		if ( callback !== undefined ) {
			
			callback( this.predictResult[ this.predictResult.length - 1 ].dataSync() );
			
		}
		
	},
	
	/**
	 * clear(), clear all layers' visualization and model's input data.
	 */
	
	clear: function() {
		
		if ( this.predictResult !== undefined ) {
			
			for ( let i = 0; i < this.predictResult.length; i ++ ) {
				
				tf.dispose( this.predictResult[ i ] );
				
			}
			
			this.predictResult = undefined;
			
		}
		
		for ( let i = 0; i < this.layers.length; i ++ ) {
			
			this.layers[ i ].clear();
			
		}
		
		this.inputValue = undefined;
		
	},
	
	/**
	 * reset(), reset the model.
	 *
	 * Three steps:
	 * 1. reset renderer assets;
	 * 2. clear the layer visualization;
	 * 3. set layer to "initStatus", "close" or "open".
	 */
	
	reset: function() {
		
		this.modelRenderer.reset();
		
		for ( let i = 0; i < this.layers.length; i ++ ) {
			
			this.layers[ i ].reset();
			
		}
		
	},
	
	/**
	 * initTSPModel(), call all functions required in model initialization process.
	 *
	 * Seven Steps:
	 * 1. Calculate Sequential depth.
	 * 2. If already load a model, get layer shapes and set them to layers.
	 * 3. Set previous layer for the new TSP layer (only for native layers).
	 * 4. Set layer metrics.
	 * 5. Assemble layers.
	 * 6. Init layers.
	 * 7. Create Renderer and render tsp model.
	 */
	
	initTSPModel: function() {
		
		// Calculate Sequential depth.
		
		this.depth = this.layers.length;
		
		// If already load a model, get layer shapes and set them to layers.
		
		if ( this.hasLoader ) {
			
			const shapeGroup = LayerShapeGenerator.getShapes( this );
			this.configureLayerShape( shapeGroup );
			
		}
		
		for ( let i = 0; i < this.layers.length; i ++ ) {
			
			// Set previous layer for the new TSP layer (only for native layers).
			
			if ( this.layers.length !== 0 ) {
				
				if ( !this.layers[ i ].isMerged ) {
					
					this.layers[ i ].setLastLayer( this.layers[ i - 1 ] );
					
				}
				
			}
			
			// Set layer metrics.
			
			this.layers[ i ].setEnvironment( this.modelContext, this );
			this.layers[ i ].loadModelConfig( this.configuration );
			this.layers[ i ].setPositionMetrics( i + 1, i + 1 );
			
		}
		
		// Assemble layers.
		
		for ( let i = 0; i < this.layers.length; i ++ ) {
			
			this.layers[ i ].assemble();
			
		}
		
		// Init layers.
		
		this.createModelElements();
		
		// Create Renderer and render tsp model.
		
		this.modelRenderer = RendererFactory.getRenderer( this );
		this.modelRenderer.init();
		
		this.isInitialized = true;
		
	},
	
	/**
	 * ============
	 *
	 * Functions below are abstract method for Model.
	 * SubClasses ( specific Model ) override these abstract methods.
	 *
	 * ============
	 */
	
	/**
	 * add(), add a new TSP layer to sequential model.
	 *
	 * @param layer, new TSP layer
	 */
	
	add: function( layer ) {
		
		// Add layer on top of layer stack.
		
		this.layers.push( layer );
		
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
		let layerActualDepth = ActualDepthCalculator.calculateDepths( this.layers );
		
		for ( let i = 0; i < this.layers.length; i ++ ) {
			
			this.layers[ i ].init( layersPos[ i ], layerActualDepth[ i ] );
			
		}
		
	},
	
	/**
	 * updateVis(), update input layer and other layer separately based on input and prediction result.
	 */
	
	updateVis: function() {
		
		// Update input layer's visualization.
		
		this.updateInputVis();
		
		// Update other layer's visualization.
		
		this.updateLayerPredictVis();
		
	},
	
	/**
	 * updateInputVis(), update input layer's visualizatiion.
	 */
	
	updateInputVis: function() {
		
		if ( this.configuration.feedInputs !== undefined ) {
			
			let feedIndex = this.configuration.feedInputs[ 0 ];
			this.layers[ 0 ].updateValue( this.inputValue[ feedIndex ] );
			
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
	
	configureLayerShape: function( shapeGroup ) {
		
		const inputShapes = shapeGroup.inputShapes;
		
		if ( this.configuration.feedInputs !== undefined ) {
			
			let feedIndex = this.configuration.feedInputs[ 0 ];
			this.layers[ 0 ].setShape( inputShapes[ feedIndex ] );
			
		} else {
			
			this.layers[ 0 ].setShape( inputShapes[ 0 ] );
			
		}
		
		const outputShapes = shapeGroup.outputShapes;
		
		for ( let i = 0; i < outputShapes.length; i ++ ) {
			
			this.layers[ i + 1 ].setShape( outputShapes[ i ] );
			
		}
	
	}
	
} );

export { Sequential };