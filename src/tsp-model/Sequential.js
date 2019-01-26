/**
 * @author syt123450 / https://github.com/syt123450
 */

import { AbstractModel } from './AbstractModel';
import { LayerLocator } from "../utils/LayerLocator";
import { ActualDepthCalculator } from "../utils/ActualDepthCalculator";
import { MouseCaptureHelper } from "../utils/MouseCapturer";

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
	 * initTSPModel(), call all functions required in model initialization process.
	 */

	initTSPModel: function() {

		this.depth = this.layers.length;

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

		layer.setEnvironment( this.modelContext, this );
		layer.loadModelConfig( this.configuration );

		// Add layer on top of layer stack.

		this.layers.push( layer ) ;

		// Assemble new layer.

		layer.assemble( this.layers.length, this.layers.length );

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

	}

} );

export { Sequential };