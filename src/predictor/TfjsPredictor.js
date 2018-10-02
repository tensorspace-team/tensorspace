/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Predictor } from "./Predictor";

/**
 * Handle prediction for tfjs model.
 *
 * @param model, model context
 * @constructor
 */

function TfjsPredictor( model ) {

	// "TfjsPredictor" inherits from abstract predictor "Predictor".

	Predictor.call( this, model );

	this.predictorType = "TfjsPredictor";

}

TfjsPredictor.prototype = Object.assign( Object.create( Predictor.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class Predictor's abstract method
	 *
	 * TfjsPredictor overrides Predictor's function:
	 * predict
	 *
	 * ============
	 */

	/**
	 * predict(), Called by model to get prediction result.
	 *
	 * @param data, input data
	 * @param callback, callback function fired when finishing prediction.
	 */

	predict: function( data, callback ) {

		// Create input tensor for prediction.

		let inputTensor = this.createInputTensor( data );

		// Get prediction result from loaded model.

		let predictResult = this.model.resource.predict( inputTensor );

		// Execute callback function if defined.

		if ( callback !== undefined ) {

			callback( predictResult[ predictResult.length - 1 ].dataSync() );

		}

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

export { TfjsPredictor };