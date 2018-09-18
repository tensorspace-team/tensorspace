/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Predictor } from "./Predictor";

function KerasPredictor( model ) {

	Predictor.call( this, model );

}

KerasPredictor.prototype = Object.assign( Object.create( Predictor.prototype ), {

	predict: function( data, inputShape, callback ) {

		let batchSize = [ 1 ];
		let predictTensorShape = batchSize.concat( inputShape );

		let predictTensor = tf.tensor( data, predictTensorShape );

		let predictResult = this.model.resource.predict( predictTensor );

		if ( callback !== undefined ) {

			callback( predictResult[ predictResult.length - 1 ].dataSync() );

		}

		return predictResult;

	}

} );

export { KerasPredictor };

