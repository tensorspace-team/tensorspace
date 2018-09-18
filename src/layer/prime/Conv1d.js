/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Layer2d } from "../abstract/Layer2d";
import { QueueCenterGenerator } from "../../utils/QueueCenterGenerator";

function Conv1d( config ) {

	Layer2d.call( this, config );

	this.shape = undefined;
	this.filters = undefined;
	this.strides = undefined;
	this.kernelSize = undefined;
	this.padding = "valid";

	this.isShapePredefined = false;

	this.loadLayerConfig( config );

	for ( let i = 0; i < this.depth; i++ ) {

		let center = {

			x: 0,
			y: 0,
			z: 0

		};

		this.closeCenterList.push( center );

	}

	this.layerType = "conv1d";

}

Conv1d.prototype = Object.assign( Object.create( Layer2d.prototype ), {

	loadLayerConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			if ( layerConfig.filters !== undefined ) {

				this.filters = layerConfig.filters;
				this.depth = layerConfig.filters;

			} else {

				console.error( "\"filters\" property is required for conv1d layer." );

			}

			if ( layerConfig.strides !== undefined ) {

				this.strides = layerConfig.strides;

			}

			if ( layerConfig.kernelSize !== undefined ) {

				this.kernelSize = layerConfig.kernelSize;

			}

			if ( layerConfig.padding !== undefined ) {

				if ( layerConfig.padding.toLowerCase() === "valid" ) {

					this.padding = "valid";

				} else if ( layerConfig.padding.toLowerCase() === "same" ) {

					this.padding = "same";

				} else {

					console.error( "\"padding\" property do not support for " + layerConfig.padding + ", use \"valid\" or \"same\" instead." );

				}

			}

			if ( layerConfig.shape !== undefined ) {

				this.isShapePredefined = true;
				this.width = layerConfig.shape[ 0 ];

			}

		} else {

			console.error( "Lack config for conv1d layer." );

		}

	},

	loadModelConfig: function( modelConfig ) {

		this.loadBasicModelConfig( modelConfig );

		if ( this.color === undefined ) {

			this.color = modelConfig.color.conv1d;

		}

		if ( this.aggregationStrategy === undefined ) {

			this.aggregationStrategy = modelConfig.aggregationStrategy;

		}

	},

	assemble: function( layerIndex ) {

		this.layerIndex = layerIndex;

		if ( !this.isShapePredefined ) {

			this.inputShape = this.lastLayer.outputShape;

			if ( this.padding === "valid" ) {

				this.width = Math.floor( ( this.inputShape[ 0 ] - this.kernelSize ) / this.strides ) + 1;

			} else if ( this.padding === "same" ) {

				this.width = Math.ceil( this.inputShape[ 0 ] / this.strides );

			} else {

				console.error( "Why padding property will be set to such value?" );

			}
		}

		this.outputShape = [ this.width, this.depth ];

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;

		this.openCenterList = QueueCenterGenerator.getCenterList( this.actualWidth, this.depth );

	},

	getRelativeElements: function( selectedElement ) {

		let relativeElements = [];

		if ( selectedElement.elementType === "aggregationElement" || selectedElement.elementType === "gridLine" ) {

			let request = {

				all: true

			};

			relativeElements = this.lastLayer.provideRelativeElements( request ).elementList;

		}

		return relativeElements;

	}

} );

export { Conv1d };