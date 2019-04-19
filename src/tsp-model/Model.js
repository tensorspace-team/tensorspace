/**
 * @author syt123450 / https://github.com/syt123450
 */

import * as tf from "@tensorflow/tfjs";
import { AbstractModel } from "./AbstractModel";
import { LayerStackGenerator } from "../utils/LayerStackGenerator";
import { LevelStackGenerator } from "../utils/LevelStackGenerator";
import { ActualDepthCalculator } from "../utils/ActualDepthCalculator";
import { LayerLocator } from "../utils/LayerLocator";
import { InLevelAligner } from "../utils/InLevelAligner";
import { RendererFactory } from '../renderer/RendererFactory';
import { LayerShapeGenerator } from '../utils/LayerShapeGenerator';

/**
 * A Model is a directed, acyclic graph.
 *
 * @param container, a DOM element where TSP model will be rendered to.
 * @param config, user's config for Functional Model.
 * @constructor
 */

function Model( container, config ) {
	
	// "Model" inherits from abstract Model "AbstractModel".
	
	AbstractModel.call( this, container, config );
	
	this.inputs = undefined;
	this.outputs = undefined;
	
	this.outputsOrder = undefined;
	
	this.levelMap = undefined;
	this.layerLookupMap = undefined;
	
	this.modelDepth = undefined;
	
	this.levelCenters = undefined;
	
	this.modelType = "Model";
	
	this.loadModelConfig( config );
	
}

Model.prototype = Object.assign( Object.create( AbstractModel.prototype ), {
	
	/**
	 * ============
	 *
	 * Functions below override base class AbstractModel's abstract method
	 *
	 * Functional Model overrides AbstractModel's function:
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
	 * Four steps:
	 * 1. reset renderer assets.
	 * 2. clear the layer visualization;
	 * 3. set layer to "initStatus", "close" or "open".
	 * 4. rearrange layers in the same level
	 */
	
	reset: function() {
		
		this.modelRenderer.reset();
		
		for ( let i = 0; i < this.layers.length; i ++ ) {
			
			this.layers[ i ].reset();
			
			let translateTime = this.layers[ i ].openTime;
			let level = this.layerLookupMap[ this.layers[ i ].layerIndex ];
			
			this.rearrangeLayerInLevel( level, translateTime );
			
		}
		
	},
	
	/**
	 * initTSPModel(), call all functions required in model initialization process.
	 */
	
	initTSPModel: function() {
		
		this.createGraph();
		
		if ( this.hasLoader ) {

			const shapeGroup = LayerShapeGenerator.getShapes( this );
			this.configureLayerShape( shapeGroup );

		}

		this.assembleLayers();

		this.depth = this.levelMap.length;

		this.createModelElements();
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
	
	loadModelConfig: function( config ) {
		
		if ( config.inputs !== undefined ) {
			
			this.inputs = config.inputs;
			
		} else {
			
			console.error( "\"inputs\" is required for Model." );
			
		}
		
		if ( config.outputs !== undefined ) {
			
			this.outputs = config.outputs;
			
		} else {
			
			console.error( "\"outputs\" is required for Model." );
			
		}
		
	},
	
	createGraph: function() {
		
		this.layers = LayerStackGenerator.createStack( this.outputs );
		
		let levelMetric = LevelStackGenerator.createStack( this.layers, this.inputs, this.outputs );

		this.levelMap = levelMetric.levelMap;
		this.layerLookupMap = levelMetric.layerLookupMap;

		this.modelDepth = this.levelMap.length;

		this.levelCenters = LayerLocator.calculateLevelCenters( this.modelDepth );
		
	},
	
	assembleLayers: function() {
		
		for ( let i = 0; i < this.levelMap.length; i ++ ) {
			
			let layerIndexList = this.levelMap[ i ];
			
			for ( let j = 0; j < layerIndexList.length; j ++ ) {
				
				let layerIndex = layerIndexList[ j ];
				let layerLevel = i;
				
				let layer = this.layers[ layerIndex ];
				
				layer.setEnvironment( this.modelContext, this );
				layer.loadModelConfig( this.configuration );
				
				layer.setPositionMetrics(  layerIndex, layerLevel  );
				
				layer.assemble();
				
			}
			
		}
		
	},
	
	createModelElements: function() {
		
		let centers = this.createLayerCenters();
		
		let depths = ActualDepthCalculator.calculateDepths( this.layers );
		
		for ( let i = 0; i < this.layers.length; i ++ ) {
			
			this.layers[ i ].init( centers[ i ], depths[ i ] );
			
		}
		
	},
	
	updateVis: function() {
		
		this.updateInputVis();
		this.updateLayerVis();
		
	},
	
	updateInputVis: function() {
		
		if ( this.configuration.feedInputs !== undefined ) {
			
			for ( let i = 0; i < this.inputs.length; i ++ ) {
				
				let feedIndex = this.configuration.feedInputs[ i ];
				this.inputs[ i ].updateValue( this.inputValue[ feedIndex ] );
				
			}
			
		} else {
			
			for ( let i = 0; i < this.inputs.length; i ++ ) {
				
				this.inputs[ i ].updateValue( this.inputValue[ i ] );
				
			}
			
		}
		
	},
	
	updateLayerVis: function() {
		
		for ( let i = 0; i < this.predictResult.length; i ++ ) {
			
			let layer = this.getLayerByName( this.outputsOrder[ i ] );
			
			layer.updateValue( this.predictResult[ i ].dataSync() );
			
		}
		
	},
	
	createLayerCenters: function() {
		
		let layerCenters = [];
		
		for ( let i = 0; i < this.layers.length; i ++ ) {
			
			layerCenters.push( {  } );
			
		}
		
		for ( let i = 0; i < this.levelMap.length; i ++ ) {
			
			let levelLayers = [];
			
			for ( let j = 0; j < this.levelMap[ i ].length; j ++ ) {
				
				levelLayers.push( this.layers[ this.levelMap[ i ][ j ] ] );
				
			}
			
			let xTranslateList = InLevelAligner.getXTranslate( levelLayers );
			
			for ( let j = 0; j < this.levelMap[ i ].length; j ++ ) {
				
				layerCenters[ this.levelMap[ i ][ j ] ] = {
					
					x: this.levelCenters[i].x + xTranslateList[ j ],
					y: this.levelCenters[i].y,
					z: this.levelCenters[i].z
					
				};
				
			}
			
		}
		
		return layerCenters;
		
	},
	
	rearrangeLayerInLevel: function( level, translateTime ) {
		
		let layerIndexList = this.levelMap[ level ];
		
		let levelLayers = [];
		
		for ( let i = 0; i < layerIndexList.length; i ++ ) {
			
			levelLayers.push( this.layers[ layerIndexList[ i ] ] );
			
		}
		
		let xTranslateList = InLevelAligner.getXTranslate( levelLayers );
		
		let layerCenters = [];
		
		for ( let i = 0; i < this.levelMap[ level ].length; i ++ ) {
			
			layerCenters.push( {
				
				x: this.levelCenters[ level ].x + xTranslateList[ i ],
				y: this.levelCenters[ level ].y,
				z: this.levelCenters[ level ].z
				
			} );
			
		}
		
		for ( let i = 0; i < levelLayers.length; i ++ ) {
			
			levelLayers[ i ].translateLayer( layerCenters[ i ], translateTime );
			
		}
		
	},
	
	configureLayerShape: function( shapeGroup ) {
		
		const inputShapes = shapeGroup.inputShapes;
		
		if ( this.configuration.feedInputs !== undefined ) {
			
			for ( let i = 0; i < this.inputs.length; i ++ ) {
				
				let feedIndex = this.configuration.feedInputs[ i ];
				this.inputs[ i ].setShape( inputShapes[ feedIndex ] );
				
			}
			
		} else {
			
			for ( let i = 0; i < this.inputs.length; i ++ ) {
				
				this.inputs[ i ].setShape( inputShapes[ i ] );
				
			}
			
		}
		
		const outputShapes = shapeGroup.outputShapes;
		
		for ( let i = 0; i < outputShapes.length; i ++ ) {
			
			let layer = this.getLayerByName( this.outputsOrder[ i ] );
			
			layer.setShape( outputShapes[ i ] );
			
		}
		
	}
	
} );

export { Model };