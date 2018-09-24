/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Layer2d } from "../abstract/Layer2d";

function Cropping1d( config ) {

	Layer2d.call( this, config );

	this.cropping = undefined;
	this.croppingWidth = undefined;

	this.loadLayerConfig( config );

	this.layerType = "Cropping1d";

}

Cropping1d.prototype = Object.assign( Object.create( Layer2d.prototype ), {

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			if ( layerConfig !== undefined ) {

				this.cropping = layerConfig.cropping;
				this.croppingWidth = layerConfig.cropping[ 0 ] + layerConfig.cropping[ 1 ];

			} else {

				console.error( "\"cropping\" property is required for cropping1d layer." );

			}

		} else {

			console.error( "Lack config for cropping1d layer." );

		}

	},

	loadModelConfig: function( modelConfig ) {

		this.loadBasicModelConfig( modelConfig );

		if ( this.color === undefined ) {

			this.color = modelConfig.color.cropping1d;

		}

		if ( this.aggregationStrategy === undefined ) {

			this.aggregationStrategy = modelConfig.aggregationStrategy;

		}

	},

	assemble: function( layerIndex ) {

		this.layerIndex = layerIndex;

		this.inputShape = this.lastLayer.outputShape;

		this.width = this.inputShape[ 0 ] - this.croppingWidth;
		this.depth = this.inputShape[ 1 ];

		this.outputShape = [ this.width, this.depth ];

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;

		for ( let i = 0; i < this.depth; i++ ) {

			let closeCenter = {

				x: 0,
				y: 0,
				z: 0
			};

			this.closeCenterList.push( closeCenter );

			let openCenter = {

				x: this.lastLayer.openCenterList[ i ].x,
				y: this.lastLayer.openCenterList[ i ].y,
				z: this.lastLayer.openCenterList[ i ].z

			};

			this.openCenterList.push( openCenter );

		}

	},

	getRelativeElements: function( selectedElement ) {

		let relativeElements = [];

		if ( selectedElement.elementType === "aggregationElement" ) {

			let request = {

				all: true

			};

			relativeElements = this.lastLayer.provideRelativeElements( request ).elementList;

		} else if ( selectedElement.elementType === "gridLine" ) {

			let gridIndex = selectedElement.gridIndex;

			let request = {

				index: gridIndex

			};

			relativeElements = this.lastLayer.provideRelativeElements( request ).elementList;

		}

		return relativeElements;

	}

} );

export { Cropping1d };