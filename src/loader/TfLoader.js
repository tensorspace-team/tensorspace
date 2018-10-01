/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Loader } from './Loader';
import { TfPredictor } from "../predictor/TfPredictor";

function TfLoader( model, config ) {

	Loader.call( this, model, config );

	this.modelUrl = undefined;
	this.weightUrl = undefined;

	this.outputsName = undefined;
	this.onCompleteCallback = undefined;

	this.type = "TfLoader";

	this.loadTfConfig( config );

}

TfLoader.prototype = Object.assign( Object.create( Loader.prototype ), {

	loadTfConfig: function( loaderConfig ) {

		if ( loaderConfig.modelUrl !== undefined ) {

			this.modelUrl = loaderConfig.modelUrl;

		} else {

			console.error( "\"modelUrl\" property is required to load tensorflow model." );

		}

		if ( loaderConfig.weightUrl !== undefined ) {

			this.weightUrl = loaderConfig.weightUrl;

		} else {

			console.error( "\"weightUrl\" property is required to load tensorflow model." );

		}

		if ( loaderConfig.onComplete !== undefined ) {

			this.onCompleteCallback = loaderConfig.onComplete;

		}

		if ( loaderConfig.outputsName !== undefined ) {

			this.outputsName = loaderConfig.outputsName;

		}

	},

	load: async function() {

		const loadedModel = await tf.loadFrozenModel( this.modelUrl, this.weightUrl );
		this.model.resource = loadedModel;
		this.model.isFit = true;

		this.model.modelType = "tensorflow";
		this.setPredictor();

		if ( this.onCompleteCallback !== undefined ) {

			this.onCompleteCallback();

		}

	},

	setPredictor: function() {

		let tfPredictor = new TfPredictor( this.model );
		tfPredictor.setOutputsName( this.outputsName );

		this.configInputShape( tfPredictor );

		this.model.predictor = tfPredictor;

	}

} );

export { TfLoader };