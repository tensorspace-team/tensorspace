/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Predictor } from "./Predictor";

function TfPredictor( model ) {

	Predictor.call( this, model );

	this.outputsName = undefined;

}

TfPredictor.prototype = Object.assign( Object.create( Predictor.prototype ), {

	predict: function( data, inputShape, callback ) {

		let batchSize = [ 1 ];
		let predictTensorShape = batchSize.concat( inputShape );

		let predictTensor = tf.tensor( data, predictTensorShape );

		let predictResult;

		if ( this.outputsName !== undefined ) {

			predictResult = this.model.resource.execute( predictTensor, this.outputsName );

		} else {

			predictResult = this.model.resource.predict( predictTensor );

		}

		if ( callback !== undefined ) {

			callback( predictResult[ predictResult.length - 1 ].dataSync() );

		}

		return predictResult;

	},

	setOutputsName: function( names ) {

		this.outputsName = names;

	}

} );

export { TfPredictor };
