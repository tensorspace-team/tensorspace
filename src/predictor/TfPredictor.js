/**
 * @author syt123450 / https://github.com/syt123450
 * @author zchholmes / https://github.com/zchholmes
 */

import * as tf from "@tensorflow/tfjs";
import { Predictor } from "./Predictor";

/**
 * Handle prediction for tensorflow model.
 *
 * @param model, model context
 * @param config, Predictor config
 * @constructor
 */

function TfPredictor( model, config ) {

	// "TfPredictor" inherits from abstract predictor "Predictor".

	Predictor.call( this, model, config );

	/**
	 * list of output node names.
	 *
	 * @type { Array }
	 */

	this.outputsName = undefined;

	this.predictorType = "TfPredictor";

}

TfPredictor.prototype = Object.assign( Object.create( Predictor.prototype ), {

	/**
	 * ============
	 *
	 * Functions below override base class Predictor's abstract method
	 *
	 * TfPredictor overrides Predictor's function:
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

			let predictResult;

			if ( this.outputsName !== undefined ) {

				// If has outputsName, use execute to get prediction result.

				predictResult = predictor.model.resource.execute( inputTensor, this.outputsName );

			} else {

				// If outputsName is undefined, use predict to get prediction result.

				predictResult = predictor.model.resource.predict( inputTensor );

			}

			return predictResult;

		} );

		return predictResult;

	},

	/**
	 * ============
	 *
	 * Functions above override base class Predictor's abstract method.
	 *
	 * ============
	 */

	/**
	 * setOutputsName(), Store user's predefined outputsName list.
	 *
	 * @param names, { Array }, list of output node names.
	 */

	setOutputsName: function( names ) {

		this.outputsName = names;

	}

} );

export { TfPredictor };