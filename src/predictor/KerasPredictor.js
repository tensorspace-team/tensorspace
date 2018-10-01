/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Predictor } from "./Predictor";

function KerasPredictor( model ) {

	Predictor.call( this, model );

}

KerasPredictor.prototype = Object.assign( Object.create( Predictor.prototype ), {

	predict: function( data, callback ) {

		let inputTensor = this.createInputTensor( data );

		let predictResult = this.model.resource.predict( inputTensor );

		if ( callback !== undefined ) {

			callback( predictResult[ predictResult.length - 1 ].dataSync() );

		}

		return predictResult;

	}

} );

export { KerasPredictor };