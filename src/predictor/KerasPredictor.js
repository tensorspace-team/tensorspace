/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Predictor } from "./Predictor";

/**
 * Handle prediction for keras model.
 *
 * @param model, model context
 * @param config, Predictor config
 * @constructor
 */

function KerasPredictor( model, config ) {

	// "KerasPredictor" inherits from abstract predictor "Predictor".

	Predictor.call( this, model, config );

	this.predictorType = "KerasPredictor";

}

KerasPredictor.prototype = Object.assign( Object.create( Predictor.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class Predictor's abstract method
	 *
	 * KerasPredictor overrides Predictor's function:
	 * predict
	 *
	 * ============
	 */

	/**
	 * predict(), Called by model to get prediction result.
	 *
	 * @param data, input data
	 */

	predict: function( data ) {

		let predictor = this;

		let predictResult = tf.tidy( () => {

			// Create input tensor for prediction.

			let inputTensor = predictor.createInputTensor( data );

			// Get prediction result from loaded model.

			return predictor.model.resource.predict( inputTensor );

		} );

		return predictResult;

	}

	/**
	 * ============
	 *
	 * Functions above override base class Predictor's abstract method.
	 *
	 * ============
	 */

} );

export { KerasPredictor };