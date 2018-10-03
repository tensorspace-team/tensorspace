import { AbstractModel } from "./AbstractModel";

// TODO functional model API

function Model( container, config ) {

	AbstractModel.call( this, container );

}

Model.prototype = Object.assign( Object.create( AbstractModel.prototype ), {

	init: function() {

	},

	add: function() {

	},

	onClick: function() {

	},

	onMouseMove: function() {

	},

	clear: function() {

	},

	reset: function() {

	}

} );

export { Model };