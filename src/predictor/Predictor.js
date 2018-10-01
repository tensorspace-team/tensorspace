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


	this.inputShapes = [];

	this.inputShape = undefined;

}

Predictor.prototype = {

	createInputTensor: function( data ) {

		if ( this.multiInputs ) {

			return this.createInputTensorList( data, this.inputShapes );

		} else {

			return this.createOneInputTensor( data, this.inputShape );

		}

	},

	createOneInputTensor: function( data, inputShape ) {

		let batchSize = [ 1 ];
		let predictTensorShape = batchSize.concat( inputShape );

		return tf.tensor( data, predictTensorShape );

	},

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
	 * Called by model to get prediction result.
	 *
	 * Override this function to implement actual prediction work
	 *
	 * @param data
	 * @param inputShape
	 */

	predict: function( data, inputShape ) {

	}

};

export { Predictor };