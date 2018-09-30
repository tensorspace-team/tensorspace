/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer2d } from "../abstract/NativeLayer2d";
import { QueueCenterGenerator } from "../../utils/QueueCenterGenerator";

function Reshape1d( config ) {

	NativeLayer2d.call( this, config );

	this.targetShape = undefined;

	// set init size to be 1
	this.totalSize = 1;

	this.loadLayerConfig( config );

	this.layerType = "Reshape1d";

}

Reshape1d.prototype = Object.assign( Object.create( NativeLayer2d.prototype ), {

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			if ( layerConfig.targetShape !== undefined ) {

				this.targetShape = layerConfig.targetShape;
				this.width = layerConfig.targetShape[ 0 ];

			} else {

				console.error( "\"targetShape\" property is required for reshape layer" );

			}

		} else {

			console.error( "\"Lack config for reshape layer." );

		}

	},

	loadModelConfig: function( modelConfig ) {

		this.loadBasicModelConfig( modelConfig );

		if ( this.color === undefined ) {

			this.color = modelConfig.color.reshape;

		}

		if ( this.layerShape === undefined ) {

			this.layerShape = modelConfig.layerShape;

		}

		if ( this.aggregationStrategy === undefined ) {

			this.aggregationStrategy = modelConfig.aggregationStrategy;

		}

	},

	assemble: function( layerIndex ) {

		this.layerIndex = layerIndex;

		this.inputShape = this.lastLayer.outputShape;

		for ( let i = 0; i < this.inputShape.length; i++ ) {

			this.totalSize *= this.inputShape[ i ];

		}

		if ( this.totalSize % this.width !== 0 ) {

			console.error( "input size " + this.totalSize + " can not be reshape to [" + this.width + "]" );

		}

		this.depth = this.totalSize / this.width;

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

		}

		this.openCenterList = QueueCenterGenerator.getCenterList( this.actualWidth, this.depth );

	},

	getRelativeElements: function( selectedElement ) {

		let relativeElements = [];

		if ( selectedElement.elementType === "aggregationElement" ) {

			let request = {

				all: true

			};

			relativeElements = this.lastLayer.provideRelativeElements( request ).elementList;

		} else if ( selectedElement.elementType === "gridLine" ) {

			// as reshape layer's feature map number is different with last layer, will not show relation lines

		}

		return relativeElements;

	}

} );

export { Reshape1d }