import { SceneInitializer } from '../scene/SceneInitializer';
import { TfjsLoader } from '../loader/TfjsLoader';
import {FrozenModelLoader} from "../loader/FrozenModelLoader";

function AbstractComposite( container ) {

	this.loader = undefined;
	this.hasLoader = false;
	// set to be true when resource is loaded to visualization model
	this.isFit = false;
	this.isInitialized = false;

	// store model loaded from url
	this.resource = undefined;
	// store the predict result from resource
	this.predictResult = undefined;

	SceneInitializer.call(this, container);

}

AbstractComposite.prototype = Object.assign(Object.create( SceneInitializer.prototype ), {

	load: function(url, config) {

		if (config.type === "tfjs") {
			this.loadTfjsModel(url, config);
		}
	},

	loadFrozen: function(modelUrl, weightUrl, config) {

		let loader = new FrozenModelLoader(this);
		loader.preload(modelUrl, weightUrl, config);

	},

	loadTfjsModel: function(url, config) {

		let loader = new TfjsLoader(this);
		loader.preLoad(url, config);

	},

	setLoader: function(loader) {
		this.loader = loader;
	}

});

export { AbstractComposite };