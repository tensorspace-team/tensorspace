/**
 * @author syt123450 / https://github.com/syt123450
 */

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