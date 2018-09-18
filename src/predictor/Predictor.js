/**
 * @author syt123450 / https://github.com/syt123450
 */

function Predictor( model ) {

	this.model = model;

}

Predictor.prototype = {

	// predictor need to override this function to implement actual prediction work
	predict: function( data, inputShape ) {

	}

};

export { Predictor };