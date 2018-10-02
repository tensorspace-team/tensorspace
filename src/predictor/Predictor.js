/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * Abstract Class, can not be initialized by TensorSpace user.
 * Handle predict for model.
 *
 * Base class for KerasPredictor, TfjsPredictor, TfPredictor.
 *
 * @param model, model context
 * @constructor
 */

function Predictor( model ) {

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

	this.multiInputs = false;

	/**
	 * Input shapes if model has multiple inputs.
	 *
	 * @type { Array }
	 */

	this.inputShapes = undefined;

	/**
	 * Input shape if model has only one input.
	 *
	 * @type { Array }
	 */

	this.inputShape = undefined;

}

Predictor.prototype = {

	/**
	 * createInputTensor(), create tfjs Tensor which can be used for prediction.
	 *
	 * @param data, user's raw prediction data
	 * @returns { tf.Tensor }
	 */

	createInputTensor: function( data ) {

		if ( this.multiInputs ) {

			return this.createInputTensorList( data, this.inputShapes );

		} else {

			return this.createOneInputTensor( data, this.inputShape );

		}

	},

	/**
	 * createOneInputTensor(), transfer an data array into a Tensor based on tensor shape.
	 *
	 * @param data, a list of input data, for example, [ 0.1, 0.15 ......, 0.2 ]
	 * @param inputShape
	 * @returns { tf.Tensor }
	 */

	createOneInputTensor: function( data, inputShape ) {

		// Support predict one input data at a time, set batch size to be 1.

		let batchSize = [ 1 ];
		let predictTensorShape = batchSize.concat( inputShape );

		return tf.tensor( data, predictTensorShape );

	},

	/**
	 * createInputTensorList(), transfer data arrays into a Tensors based on tensor shapes.
	 *
	 * @param data, input data list, for example, [[...], [...], ..., [...]]
	 * @param inputShapes
	 * @returns { tf.Tensor }
	 */

	createInputTensorList: function( data, inputShapes ) {

		let tensorList = [];

		for ( let i = 0; i < inputShapes.length; i ++ ) {

			tensorList.push( this.createOneInputTensor( data[ i ], inputShapes[ i ] ) );

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
	 * @param callback, callback function fired when finishing prediction.
	 */

	predict: function( data, callback ) {

		return [];

	}

};

export { Predictor };