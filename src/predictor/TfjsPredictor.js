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

	predict: function( data, callback ) {

		let inputTensor = this.createInputTensor( data );

		let predictResult = this.model.resource.predict( inputTensor );

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