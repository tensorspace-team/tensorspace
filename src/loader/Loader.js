function Loader( model ) {

	this.model = model;

}

Loader.prototype = {

	preLoad: function() {

		if (this.model.isInitialized) {

			this.load().then(function() {

			});

		}

		this.model.loader = this;
		this.model.hasLoader = true;
	}

};

export { Loader };