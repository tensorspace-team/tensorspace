import {LayerGroup} from "../abstract/LayerGroup";
import { YoloChannel } from "../prime/YoloChannel";
import { YoloBox } from "../prime/YoloBox";

function YoloOutput( config ) {

	LayerGroup.call( this, config );

	this.config = config;
	this.thickness = 2;


}

YoloOutput.prototype = Object.assign( Object.create( LayerGroup.prototype ), {

	createMembers: function() {

		let yoloChannel = new YoloChannel( this.config );
		let yoloBox = new YoloBox( this.config );

	},

	init: function(centerList, actualDepth) {


	},

	assemble: function(layerIndex, model) {



	},

	updateValue: function() {

	},

	clear: function() {

	},

	handleClick: function() {

	},

	handleHoverIn: function() {

	},

	handleHoverOut: function() {

	}

} );

export { YoloOutput };