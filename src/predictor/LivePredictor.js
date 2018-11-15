import { TfjsPredictor } from "./TfjsPredictor";

/**
 * Handle prediction for live model (tfjs model, as only tfjs can train in the browser).
 * May be there will other training library can run in the browser, so use a new Predictor.
 *
 * @param model, model context
 * @param config, Predictor config
 * @constructor
 */

function LivePredictor( model, config ) {

	// "LivePredictor" inherits from abstract predictor "TfjsPredictor".

	TfjsPredictor.call( this, model, config );

	this.predictorType = "LivePredictor";

}

LivePredictor.prototype = Object.assign( Object.create( TfjsPredictor.prototype ), {


} );

export { LivePredictor };