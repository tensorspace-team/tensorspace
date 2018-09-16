function Loader( model ) {

	this.model = model;

}

Loader.prototype = {

	preLoad: function() {

		this.model.initLayerOutputIndex();

		if (this.model.isInitialized) {

			this.load().then(function() {

			});

		}

		this.model.loader = this;
		this.model.hasLoader = true;
	},

};

export { Loader };