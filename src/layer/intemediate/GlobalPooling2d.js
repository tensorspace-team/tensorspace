/**
 * @author syt123450 / https://github.com/syt123450
 */

import { GlobalPoolingElement } from "../../elements/GlobalPoolingElement";
import { Layer3d } from "../abstract/Layer3d";

function GlobalPooling2d( config ) {

	Layer3d.call( this, config );

	this.width = 1;
	this.height = 1;
	this.depth = undefined;

	this.layerType = "globalPooling2d";

}

GlobalPooling2d.prototype = Object.assign( Object.create( Layer3d.prototype ), {

	loadModelConfig: function( modelConfig ) {

		this.loadBasicModelConfig( modelConfig );

		if ( this.color === undefined ) {

			this.color = modelConfig.color.globalPooling2d;

		}

		if ( this.aggregationStrategy === undefined ) {

			this.aggregationStrategy = modelConfig.aggregationStrategy;

		}

	},

	assemble: function( layerIndex ) {

		this.layerIndex = layerIndex;

		this.depth = this.lastLayer.depth;
		this.outputShape = [ 1, 1, this.depth ];

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;
		this.actualHeight = this.height * this.unitLength;

		for ( let i = 0; i < this.depth; i++ ) {

			let center = {

				x: 0,
				y: 0,
				z: 0

			};

			this.closeFmCenters.push( center );

			let fmCenter = {

				x: this.lastLayer.openFmCenters[ i ].x,
				y: this.lastLayer.openFmCenters[ i ].y,
				z: this.lastLayer.openFmCenters[ i ].z

			};

			this.openFmCenters.push( fmCenter );

		}

	},

	initSegregationElements: function( centers ) {

		for ( let i = 0; i < this.depth; i++ ) {

			let segregationHandler = new GlobalPoolingElement(

				this.actualWidth,
				centers[ i ],
				this.color,
				this.minOpacity

			);

			segregationHandler.setLayerIndex( this.layerIndex );
			segregationHandler.setFmIndex( i );

			this.segregationHandlers.push( segregationHandler );

			this.neuralGroup.add( segregationHandler.getElement() );

		}

		if ( this.neuralValue !== undefined ) {

			this.updateSegregationVis();

		}

	},

	showText: function( element ) {

		if ( element.elementType === "globalPoolingElement" ) {

			let fmIndex = element.fmIndex;
			this.segregationHandlers[ fmIndex ].showText();
			this.textElementHandler = this.segregationHandlers[ fmIndex ];

		}

	},

	getRelativeElements: function( selectedElement ) {

		let relativeElements = [];

		if ( selectedElement.elementType === "aggregationElement" ) {

			let request = {

				all: true

			};

			relativeElements = this.lastLayer.provideRelativeElements( request ).elementList;

		} else if ( selectedElement.elementType === "featureMap" ) {

			let fmIndex = selectedElement.fmIndex;

			let request = {

				index: fmIndex

			};

			relativeElements = this.lastLayer.provideRelativeElements( request ).elementList;

		}

		return relativeElements;

	}

} );

export { GlobalPooling2d }