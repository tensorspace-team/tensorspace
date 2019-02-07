/**
 * @author syt123450 / https://github.com/syt123450
 */

import * as tf from "@tensorflow/tfjs";

/**
 * Abstract Class, can not be initialized by TensorSpace user.
 * Handle predict for model.
 *
 * Base class for KerasPredictor, TfjsPredictor, TfPredictor.
 *
 * @param model, model context
 * @param config, Predictor config, get it from loader
 * @constructor
 */

function Predictor( model, config ) {

	/**
	 * Store model context.
	 *
	 * { Object }, model context
	 */

	this.model = model;

	/**
	 * Identity whether model needs multiple inputs for prediction.
	 *
	 * @type { boolean }
	 */

	this.inputNum = undefined;

	/**
	 * Input shapes if model has multiple inputs.
	 *
	 * @type { Array }
	 */

	this.inputShapes = undefined;

	// Load Predictor's basic configuration.

	this.loadPredictorConfig( config );

}

Predictor.prototype = {

	/**
	 * Load Predictor's basic configuration.
	 *
	 * @param config, user's Predictor configuration
	 */

	loadPredictorConfig: function( config ) {

		let inputShapes = [];

		if ( this.model.configuration.predictDataShapes !== undefined ) {

			let shapes = this.model.configuration.predictDataShapes;

			for ( let i = 0; i < shapes.length; i ++ ) {

				inputShapes.push( [ 1 ].concat( shapes[ i ] ) );

			}

		} else {

			let loadedModel = this.model.resource;

			let inputs = loadedModel.inputs;

			this.inputNum = inputs.length;

			for ( let i = 0; i < inputs.length; i ++ ) {

				let inputShape = inputs[ i ].shape;

				// Support predict one input data at a time, set batch size to be 1.

				inputShape[ 0 ] = 1;

				inputShapes.push( inputShape );

			}

		}

		this.inputShapes = inputShapes;

	},

	/**
	 * createInputTensor(), create tfjs Tensor which can be used for prediction.
	 *
	 * @param data, user's raw prediction data
	 * @returns { tf.Tensor }
	 */

	createInputTensor: function( data ) {

		let inputData;

		if ( this.model.modelType === "Sequential" && this.inputNum == 1 ) {

			inputData = [ data ];

		} else {

			inputData = data;

		}

		return this.createInputTensorList( inputData, this.inputShapes );

	},

	/**
	 * createInputTensorList(), transfer data arrays into a Tensors based on tensor shapes.
	 *
	 * @param data, input data list, for example, [[...], [...], ..., [...]]
	 * @param inputShapes
	 * @returns { tf.Tensor[] }
	 */

	createInputTensorList: function( data, inputShapes ) {

		let tensorList = [];

		for ( let i = 0; i < inputShapes.length; i ++ ) {

			tensorList.push( tf.tensor( data[ i ], inputShapes[ i ] ));

		}

		return tensorList;

	},

	/**
	 * ============
	 *
	 * Functions below are abstract method for Predictor.
	 * SubClasses ( specific Predictor ) override these abstract method to get Predictor's characters.
	 *
	 * ============
	 */

	/**
	 * predict(), Called by model to get prediction result.
	 *
	 * Override this function to implement actual prediction work
	 *
	 * @param data, input data
	 */

	predict: function( data ) {

		return [];

	}

};

export { Predictor };