/**
 * @author syt123450 / https://github.com/syt123450
 */

import { AbstractModel } from "./AbstractModel";
import { LayerStackGenerator } from "../utils/LayerStackGenerator";
import { LevelStackGenerator } from "../utils/LevelStackGenerator";
import { ActualDepthCalculator } from "../utils/ActualDepthCalculator";
import { LayerLocator } from "../utils/LayerLocator";
import { InLevelAligner } from "../utils/InLevelAligner";
import { MouseCaptureHelper } from "../utils/MouseCapturer";

/**
 * A Model is a directed, acyclic graph.
 *
 * @param container, a DOM element where TSP model will be rendered to.
 * @param config, user's config for Model.
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
	 * Sequential overrides AbstractModel's function:
	 * predict, clear, reset, onClick, onMouseMove, initTSPModel
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
	 * 1. clear the layer visualization;
	 * 2. reset TrackballControl;
	 * 3. update camera setting in TSP.
	 * 4. set layer to "initStatus", "close" or "open".
	 */

	// TODO: add rearrange.

	reset: function() {

		this.cameraControls.reset();
		this.updateCamera();

		for ( let i = 0; i < this.layers.length; i ++ ) {

			this.layers[ i ].reset();

		}

	},

	/**
	 * onClick(), Handler for move click event.
	 *
	 * @param event
	 */

	onClick: function( event ) {

		let model = this;

		// Use Raycaster to capture clicked element.

		model.raycaster.setFromCamera( model.mouse, model.camera );
		let intersects = model.raycaster.intersectObjects( model.scene.children, true );

		for ( let i = 0; i < intersects.length; i ++ ) {

			if ( intersects !== null && intersects.length > 0 && intersects[ i ].object.type === "Mesh" ) {

				let selectedElement = intersects[ i ].object;

				if ( selectedElement.clickable === true ) {

					// Let the layer to handle actual click event.

					let selectedLayer = this.layers[ selectedElement.layerIndex ];

					selectedLayer.handleClick( selectedElement );

					// Rearrange layer

					let translateTime = selectedLayer.openTime;
					let level = this.layerLookupMap[ selectedElement.layerIndex ];

					model.rearrangeLayerInLevel( level, translateTime );

					break;

				}

			}

		}

	},

	/**
	 * onMouseMove(), Handler for mouse move event.
	 *
	 * @param event
	 */

	onMouseMove: function( event ) {

		// calculate mouse position.

		this.mouse.x = ( ( event.clientX - MouseCaptureHelper.getElementViewLeft( this.sceneArea ) ) / this.sceneArea.clientWidth ) * 2 - 1;
		this.mouse.y = - ( ( event.clientY - MouseCaptureHelper.getElementViewTop( this.sceneArea ) )  / this.sceneArea.clientHeight ) * 2 + 1;

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

					let selectedLayer = this.layers[ selectedElement.layerIndex ];

					// Let the layer to handle actual hover event.

					selectedLayer.handleHoverIn( selectedElement );

					this.hoveredLayer = selectedLayer;

					break;

				}

			}

		}

	},

	/**
	 * initTSPModel(), call all functions required in model initialization process.
	 */

	initTSPModel: function() {

		this.createGraph();
		this.assembleLayers();

		this.depth = this.levelMap.length;

		this.updateCamera();
		this.createModelElements();
		this.registerModelEvent();
		this.animate();

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

		if ( config.outputsOrder !== undefined ) {

			this.outputsOrder = config.outputsOrder;

		} else {

			console.error( "\"outputsOrder\" is required for Model." );

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

				layer.setEnvironment( this.scene, this );
				layer.loadModelConfig( this.configuration );
				layer.assemble( layerIndex, layerLevel );

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

		for ( let i = 0; i < this.inputs.length; i ++ ) {

			this.inputs[ i ].updateValue( this.inputValue[ i ] );

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

	}

} );

export { Model };