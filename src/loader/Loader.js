/**
 * @author syt123450 / https://github.com/syt123450
 */

function Loader( model, config ) {

	this.model = model;

	this.config = config;

}

Loader.prototype = {

	preLoad: function() {

		if ( this.model.isInitialized ) {

			this.load().then( function() {

			} );

		}

		this.model.loader = this;
		this.model.hasLoader = true;

	},

	configInputShape: function( predictor ) {

		if ( this.config.multiInput !== undefined && this.config.multiInput ) {

			this.setShapeList( predictor);

		} else {

			this.setSingleShape( predictor );

		}

	},

	setSingleShape: function( predictor ) {

		predictor.inputShape = this.model.layers[ 0 ].outputShape;

	},

	setShapeList: function( predictor ) {

		predictor.multiInputs = true;
		predictor.inputShapes = this.config.inputShapes;

	}

};

export { Loader };