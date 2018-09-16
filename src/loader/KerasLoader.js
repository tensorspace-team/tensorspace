import { Loader } from './Loader';
import {KerasPredictor} from "../predictor/KerasPredictor";

function KerasLoader( model, config ) {

	Loader.call(this, model);
	this.url = undefined;
	this.onCompleteCallback = undefined;

	this.type = "KerasLoader";

	this.loadLoaderConfig(config);

}

KerasLoader.prototype = Object.assign(Object.create(Loader.prototype), {

	loadLoaderConfig: function(loaderConfig) {

		if (loaderConfig.url !== undefined) {
			this.url = loaderConfig.url;
		} else {
			console.error("\"url\" property is required to load Keras model.");
		}

		if (loaderConfig.onComplete !== undefined) {
			this.onCompleteCallback = loaderConfig.onComplete;
		}
	},

	// load model asynchronously
	load: async function() {

		const loadedModel = await tf.loadModel(this.url);
		this.model.resource = loadedModel;
		this.model.isFit = true;

		this.model.modelType = "keras";
		this.setPredictor();

		if (this.onCompleteCallback !== undefined) {
			this.onCompleteCallback();
		}

	},

	setPredictor: function() {
		this.model.predictor = new KerasPredictor(this.model);
	}

});

export { KerasLoader };