/**
 * @author syt123450 / https://github.com/syt123450
 */

import { LayerGroup } from "../abstract/LayerGroup";
import { YoloChannel } from "./YoloChannel";
import { OutputDetection } from "./OutputDetection";

function YoloOutput( config ) {

	LayerGroup.call( this, config );

	this.config = config;
	this.thickness = 2;

	this.yoloChannel = undefined;
	this.yoloBox = undefined;

	this.createMembers();

	this.layerType = "YoloOutput";

	this.loadLayerConfig( config );

}

YoloOutput.prototype = Object.assign( Object.create( LayerGroup.prototype ), {

	createMembers: function() {

		let yoloChannel = new YoloChannel( this.config );
		let yoloBox = new OutputDetection( this.config );

		this.yoloChannel = yoloChannel;
		this.yoloBox = yoloBox;

	},

	init: function( centerList, actualDepth ) {

		this.yoloChannel.init( centerList[ 0 ], actualDepth );
		this.yoloBox.init( centerList[ 1 ], actualDepth );

	},

	assemble: function( layerIndex ) {

		this.yoloChannel.assemble( layerIndex );
		this.yoloBox.assemble( layerIndex );

	},

	updateValue: function( value ) {

		this.yoloChannel.updateValue( value );
		this.yoloBox.updateValue( value );

	},

	clear: function() {

		this.yoloChannel.clear();
		this.yoloBox.clear();

	},

	handleClick: function( clickedElement ) {

		if ( clickedElement.positionedLayer === "yoloChannel" ) {

			this.yoloChannel.handleClick( clickedElement );

		} else if ( clickedElement.positionedLayer === "yoloBox" ) {

			this.yoloBox.handleClick( clickedElement );

		}

	},

	handleHoverIn: function( hoveredElement ) {

		if ( hoveredElement.positionedLayer === "yoloChannel" ) {

			this.yoloChannel.handleHoverIn( hoveredElement );

		} else if ( hoveredElement.positionedLayer === "yoloBox" ) {

			this.yoloBox.handleHoverIn( hoveredElement );

		}

	},

	handleHoverOut: function() {

		this.yoloChannel.handleHoverOut();
		this.yoloBox.handleHoverOut();

	},

	setLastLayer: function( layer ) {

		this.yoloChannel.lastLayer = layer;
		this.yoloBox.lastLayer = this.yoloChannel;

		this.yoloChannel.nextLayer = this.yoloBox;

	},

	setEnvironment: function( scene, model ) {

		this.yoloChannel.setEnvironment( scene, model );
		this.yoloBox.setEnvironment( scene, model );

	},

	loadModelConfig: function( config ) {

		this.yoloChannel.loadModelConfig( config );
		this.yoloBox.loadModelConfig( config );

	},

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			this.yoloChannel.loadLayerConfig( layerConfig );
			this.yoloBox.loadLayerConfig( layerConfig );

		} else {

			console.error( "Lack config for yoloOutput layer." );

		}

	}

} );

export { YoloOutput };