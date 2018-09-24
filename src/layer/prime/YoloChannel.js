/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Layer } from "../abstract/Layer";
import { YoloOutputUnit } from "../../elements/YoloOuputUnit";
import { YoloTweenFactory } from "../../animation/YoloTransitionTween";
import { QueueAggregation } from "../../elements/QueueAggregation";
import { CloseButtonRatio } from "../../utils/Constant";

function YoloChannel(config ) {

	Layer.call( this, config );

	this.segregationHandlers = [];
	this.onNeuralClicked = undefined;

	this.channelDepth = undefined;

	this.loadLayerConfig( config );

	this.leftMostCenter = {

		x: 0,
		y: 0,
		z: 0

	};

	this.closeResultPos = [];
	this.openResultPos = [];

	this.layerType = "yoloOutput";

	this.isCompositeLayer = true;
	this.composites = 2;


}

YoloChannel.prototype = Object.assign( Object.create( Layer.prototype ), {

	init: function( center, actualDepth ) {

		this.center = center;
		this.actualDepth = actualDepth;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set( this.center.x, this.center.y, this.center.z );

		if ( this.isOpen ) {

			this.initSegregationElements( this.openResultPos );
			this.initCloseButton();

		} else {

			this.initAggregationElement();

		}

		this.scene.add( this.neuralGroup );

	},

	loadLayerConfig: function ( layerConfig ) {

		this.loadBasicLayerConfig( layerConfig );

		if ( layerConfig !== undefined ) {

			if ( layerConfig.onClick !== undefined ) {

				this.onNeuralClicked = layerConfig.onClick;

			}

		}

	},

	loadModelConfig: function ( modelConfig ) {

		this.loadBasicModelConfig( modelConfig );

		if ( this.color === undefined ) {

			this.color = modelConfig.color.yoloOutput;

		}

	},

	assemble: function ( layerIndex ) {

		this.layerIndex = layerIndex;

		this.inputShape = this.lastLayer.outputShape;
		this.widthNum = this.inputShape[ 0 ];
		this.heightNum = this.inputShape[ 1 ];
		this.channelDepth = this.inputShape[ 2 ];

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.lastLayer.actualWidth;
		this.actualHeight = this.lastLayer.actualHeight;

		this.totalOutputs = this.widthNum * this.heightNum;

		for ( let i = 0; i < this.totalOutputs; i++ ) {

			this.closeResultPos.push( {

				x: 0,
				y: 0,
				z: 0

			} );

		}

		this.openResultPos = this.calcOpenResultPos();

	},

	calcOpenResultPos: function() {

		let openResultList = [];

		let initXTranslate = - 2 * ( this.widthNum - 1 ) * this.unitLength;
		let initZTranslate = - 2 * ( this.heightNum - 1 ) * this.unitLength;

		let distance = 4 * this.unitLength;

		for ( let i = 0; i < this.widthNum; i++ ) {

			for ( let j = 0; j < this.heightNum; j++ ) {

				openResultList.push( {

					x: initXTranslate + distance * j,
					y: 0,
					z: initZTranslate + distance * i

				} );

			}

		}

		return openResultList;

	},

	initAggregationElement: function() {

		let aggregationHandler = new QueueAggregation(

			this.actualWidth,
			this.actualHeight,
			this.actualDepth,
			this.color

		);

		aggregationHandler.setLayerIndex( this.layerIndex );

		this.aggregationHandler = aggregationHandler;
		this.neuralGroup.add( this.aggregationHandler.getElement() );

	},

	disposeAggregationElement: function() {

		this.neuralGroup.remove( this.aggregationHandler.getElement() );
		this.aggregationHandler = undefined;

	},

	initSegregationElements: function( centers ) {

		for ( let i = 0; i < this.totalOutputs; i++ ) {

			let segregationHandler = new YoloOutputUnit(

				this.unitLength,
				centers[ i ],
				this.color,
				this.minOpacity

			);

			segregationHandler.setLayerIndex( this.layerIndex );
			segregationHandler.setOutputIndex( i );

			this.segregationHandlers.push( segregationHandler );
			this.neuralGroup.add( segregationHandler.getElement() );

		}

	},

	disposeSegregationElements: function() {

		for ( let i = 0; i < this.segregationHandlers.length; i++ ) {

			this.neuralGroup.remove( this.segregationHandlers[ i ].getElement() );

		}

		this.segregationHandlers = [];

	},

	getRelativeElements: function ( selectedElement ) {

		let relativeElements = [];

		if ( selectedElement.elementType === "aggregationElement" || selectedElement.elementType === "outputNeural" ) {

			let request = {

				all: true

			};

			relativeElements = this.lastLayer.provideRelativeElements( request ).elementList;

		}

		return relativeElements;

	},

	handleClick: function ( clickedElement ) {

		if ( clickedElement.elementType === "aggregationElement" ) {

			this.openLayer();

		} else if ( clickedElement.elementType === "closeButton" ) {

			this.closeLayer();

		} else if ( clickedElement.elementType === "outputNeural" ) {

			if ( this.onNeuralClicked !== undefined ) {

				let outputIndex = clickedElement.outputIndex;

				let widthIndex = outputIndex % this.widthNum;
				let heightIndex = Math.floor( outputIndex / this.widthNum );

				this.onNeuralClicked( widthIndex, heightIndex, this.getNeuralOutputValue( outputIndex ) );

			}

		}

	},

	getNeuralOutputValue: function( outputIndex ) {

		let singleOutput = [];

		if ( this.neuralValue !== undefined ) {

			singleOutput = this.neuralValue.slice( this.channelDepth * outputIndex, this.channelDepth * ( outputIndex + 1 ) );

		}

		return singleOutput;

	},

	calcCloseButtonSize: function() {

		return CloseButtonRatio * ( this.openResultPos[ this.openResultPos.length - 1 ].z - this.openResultPos[ 0 ].z );

	},

	calcCloseButtonPos: function() {

		return {

			x: this.openResultPos[ 0 ].x - 10 * this.unitLength,
			y: 0,
			z: 0

		};

	},

	clear: function() {

		this.neuralValue = undefined;

	},

	openLayer: function() {

		if ( !this.isOpen ) {

			YoloTweenFactory.openLayer( this );

		}

	},

	closeLayer: function() {

		if ( this.isOpen ) {

			YoloTweenFactory.closeLayer( this );

		}

	},

	updateValue: function() {

		this.neuralValue = this.lastLayer.neuralValue;

	},

	handleHoverIn: function() {

	},

	handleHoverOut: function() {

	}

} );

export { YoloChannel };