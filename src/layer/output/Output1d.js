/**
 * @author syt123450 / https://github.com/syt123450
 */

import { NativeLayer } from '../abstract/NativeLayer';
import { ColorUtils } from '../../utils/ColorUtils';
import { QueueAggregation } from "../../elements/QueueAggregation";
import { OutputTransitionFactory } from "../../animation/OutputTransitionTween";
import { OutputExtractor } from "../../utils/OutputExtractor";
import { OutputQueue } from "../../elements/OutputQueue";
import { OutputSegment } from "../../elements/OutputSegment";
import { PaginationButton } from "../../elements/PagniationButton";

function Output( config ) {

	NativeLayer.call( this, config );

	this.units = undefined;
	this.width = undefined;
	this.outputs = undefined;

	this.outputHandler = undefined;

	this.lastButtonHandler = undefined;
	this.nextButtonHandler = undefined;

	this.paging = false;
	this.segmentLength = 200;
	this.segmentIndex = 0;
	this.totalSegments = undefined;

	this.leftBoundary = undefined;
	this.rightBoundary = undefined;

	this.loadLayerConfig( config );

	this.layerType = "output1d";

}

Output.prototype = Object.assign( Object.create( NativeLayer.prototype ), {

	init: function( center, actualDepth ) {

		this.center = center;
		this.actualDepth = actualDepth;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set( this.center.x, this.center.y, this.center.z );

		if ( this.isOpen ) {

			this.initOutputElement( "open" );
			this.initCloseButton();

			if ( this.paging ) {

				this.showPaginationButton();

			}

		} else {

			this.initAggregationElement();

		}

		this.scene.add( this.neuralGroup );

		// Create relative line element.

		this.addLineGroup();

	},

	loadLayerConfig: function( layerConfig ) {

		this.loadBasicLayerConfig( layerConfig );

		if ( layerConfig !== undefined ) {

			this.units = layerConfig.units;
			this.width = layerConfig.units;
			this.outputs = layerConfig.outputs;

			if ( layerConfig.paging !== undefined ) {

				this.paging = layerConfig.paging;

				if ( this.paging ) {

					if ( layerConfig.segmentLength !== undefined ) {

						this.segmentLength = layerConfig.segmentLength;
						this.queueLength = this.segmentLength;
						this.totalSegments = Math.ceil( this.units / this.segmentLength );

					}

					if ( layerConfig.initSegmentIndex !== undefined ) {

						this.segmentIndex = layerConfig.initSegmentIndex;

					}

				}

			}

		}

	},

	showPaginationButton: function() {

		if ( this.segmentIndex === 0 && this.segmentIndex !== this.totalSegments - 1 ) {

			this.showNextButton();

		} else if ( this.segmentIndex !== 0 && this.segmentIndex === this.totalSegments - 1 ) {

			this.showLastButton();

		} else if ( this.segmentIndex === 0 && this.segmentIndex === this.totalSegments - 1 ) {

			// no button

		} else {

			this.showNextButton();
			this.showLastButton();

		}

	},

	showLastButton: function() {

		let lastButtonHandler = new PaginationButton(

			"last",
			this.calcPaginationButtonSize(),
			this.unitLength,
			this.calculatePaginationPos( "last" ),
			this.color,
			this.minOpacity

		);

		lastButtonHandler.setLayerIndex( this.layerIndex );

		this.lastButtonHandler = lastButtonHandler;
		this.neuralGroup.add( this.lastButtonHandler.getElement() );

	},

	showNextButton: function() {

		let nextButtonHandler = new PaginationButton(

			"next",
			this.calcPaginationButtonSize(),
			this.unitLength,
			this.calculatePaginationPos( "next" ),
			this.color,
			this.minOpacity

		);

		nextButtonHandler.setLayerIndex( this.layerIndex );

		this.nextButtonHandler = nextButtonHandler;
		this.neuralGroup.add( this.nextButtonHandler.getElement() );

	},

	hidePaginationButton: function() {

		this.hideNextButton();
		this.hideLastButton();

	},

	hideNextButton: function() {

		if ( this.nextButtonHandler !== undefined ) {

			this.neuralGroup.remove( this.nextButtonHandler.getElement() );
			this.nextButtonHandler = undefined;

		}

	},

	hideLastButton: function() {

		if ( this.lastButtonHandler !== undefined ) {

			this.neuralGroup.remove( this.lastButtonHandler.getElement() );
			this.lastButtonHandler = undefined;

		}

	},

	updatePage: function( paginationType ) {

		if ( paginationType === "next" ) {

			if ( this.segmentIndex < this.totalSegments - 1 ) {

				if ( this.segmentIndex === 0 ) {

					this.showLastButton();

				}

				if ( this.segmentIndex === this.totalSegments - 2 ) {

					this.hideNextButton();

				}

				this.segmentIndex += 1;

			}

		} else {

			if ( this.segmentIndex > 0 ) {

				if ( this.segmentIndex === this.totalSegments - 1 ) {

					this.showNextButton();

				}

				if ( this.segmentIndex === 1 ) {

					this.hideLastButton();

				}

				this.segmentIndex -= 1;

			}

		}

		this.outputHandler.updateSegmentIndex( this.segmentIndex );

		if ( this.outputHandler.isLengthChanged ) {

			this.leftBoundary = this.outputHandler.leftBoundary;
			this.rightBoundary = this.outputHandler.rightBoundary;

			if ( this.nextButtonHandler !== undefined ) {

				let nextButtonPos = this.calculatePaginationPos( "next" );
				this.nextButtonHandler.updatePos( nextButtonPos );

			}

			if ( this.lastButtonHandler !== undefined ) {

				let lastButtonPos = this.calculatePaginationPos( "last" );
				this.lastButtonHandler.updatePos( lastButtonPos );

			}

			let closeButtonPos = this.calcCloseButtonPos();
			this.closeButtonHandler.updatePos( closeButtonPos );

		}

		if ( this.neuralValue !== undefined ) {

			this.updateOutputVis();

		}

	},

	openLayer: function() {

		if ( !this.isOpen ) {

			OutputTransitionFactory.openLayer( this );

		}

	},

	closeLayer: function() {

		if ( this.isOpen ) {

			OutputTransitionFactory.closeLayer( this );

		}

	},

	initOutputElement: function( initStatus ) {

		let outputHandler;

		if ( this.paging ) {

			outputHandler = new OutputSegment(

				this.outputs,
				this.segmentLength,
				this.segmentIndex,
				this.units,
				this.unitLength,
				this.color,
				this.minOpacity,
				initStatus

			);

		} else {

			outputHandler = new OutputQueue(

				this.units,
				this.outputs,
				this.unitLength,
				this.color,
				this.minOpacity,
				initStatus

			);

		}

		outputHandler.setLayerIndex( this.layerIndex );

		this.leftBoundary = outputHandler.leftBoundary;
		this.rightBoundary = outputHandler.rightBoundary;

		this.outputHandler = outputHandler;

		this.neuralGroup.add( outputHandler.getElement() );

		if ( this.neuralValue !== undefined ) {

			this.updateOutputVis();

		}

	},

	disposeOutputElement: function() {

		console.log( "dispose output element" );

		this.neuralGroup.remove( this.outputHandler.getElement() );

		this.outputHandler = undefined;

	},

	initAggregationElement: function() {

		let aggregationHandler = new QueueAggregation(

			this.aggregationWidth,
			this.aggregationHeight,
			this.actualDepth,
			this.color,
			this.minOpacity

		);

		aggregationHandler.setLayerIndex( this.layerIndex );

		this.aggregationHandler = aggregationHandler;
		this.neuralGroup.add( this.aggregationHandler.getElement() );

	},

	disposeAggregationElement: function() {

		this.neuralGroup.remove( this.aggregationHandler.getElement() );
		this.aggregationHandler = undefined;

	},

	loadModelConfig: function( modelConfig ) {

		this.loadBasicModelConfig( modelConfig );

		if ( this.color === undefined ) {

			this.color = modelConfig.color.output1d;

		}

	},

	assemble: function( layerIndex ) {

		this.layerIndex = layerIndex;

		this.outputShape = [ this.units, 1, 1 ];

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.width * this.unitLength;

		if ( this.lastLayer.layerDimension === 1 ) {

			this.aggregationWidth = this.lastLayer.aggregationWidth;
			this.aggregationHeight = this.lastLayer.aggregationHeight;

		} else {

			this.aggregationWidth = this.lastLayer.actualWidth;
			this.aggregationHeight = this.lastLayer.actualHeight;

		}

	},

	updateValue: function( value ) {

		this.neuralValue = value;

		if ( this.isOpen ) {

			this.updateOutputVis();

			let maxConfidenceIndex = OutputExtractor.getMaxConfidenceIndex( value );

			if ( this.textSystem !== undefined && this.textSystem ) {

				this.outputHandler.showTextWithIndex( maxConfidenceIndex );
				this.textElementHandler = this.outputHandler;

			}

		}

	},

	updateOutputVis: function() {

		let colors = ColorUtils.getAdjustValues( this.neuralValue, this.minOpacity );

		if ( this.paging ) {

			let segmentColors = colors.slice(

				this.segmentLength * this.segmentIndex,
				Math.min( this.segmentLength * ( this.segmentIndex + 1 ), this.width - 1 )

			);

			this.outputHandler.updateVis( segmentColors );

		} else {

			this.outputHandler.updateVis( colors );

		}

	},

	getRelativeElements: function( selectedElement ) {

		let relativeElements = [];

		if ( selectedElement.elementType === "aggregationElement" || selectedElement.elementType === "outputNeural" ) {

			let request = {

				all: true

			};

			relativeElements = this.lastLayer.provideRelativeElements( request ).elementList;

		}

		return relativeElements;

	},

	showText: function( selectedNeural ) {

		this.outputHandler.showText( selectedNeural );
		this.textElementHandler = this.outputHandler;

	},

	hideText: function() {

		if( this.textElementHandler !== undefined ) {

			this.textElementHandler.hideText();
			this.textElementHandler = undefined;

		}

	},

	handleClick: function( clickedElement ) {

		if ( clickedElement.elementType === "aggregationElement" ) {

			this.openLayer();

		} else if ( clickedElement.elementType === "closeButton" ) {

			this.closeLayer();

		} else if ( clickedElement.elementType === "outputNeural" ) {

			if ( this.textSystem !== undefined && this.textSystem ) {

				this.hideText();
				this.showText( clickedElement );

			}

		} else if ( clickedElement.elementType === "paginationButton" ) {

			this.updatePage( clickedElement.paginationType );

		}

	},

	handleHoverIn: function( hoveredElement ) {

		if ( this.relationSystem !== undefined && this.relationSystem ) {

			this.lineGroupHandler.initLineGroup( hoveredElement );

		}

	},

	handleHoverOut: function() {

		if ( this.relationSystem !== undefined && this.relationSystem ) {

			this.lineGroupHandler.disposeLineGroup();

		}

	},

	calcCloseButtonSize: function() {

		return 1.1 * this.unitLength;

	},

	calcPaginationButtonSize: function() {

		return 1.1 * this.unitLength;

	},

	calcCloseButtonPos: function() {

		return {

			x: this.leftBoundary.x - 10 * this.unitLength,
			y: 0,
			z: 0

		};

	},

	calculatePaginationPos: function( paginationType ) {

		if ( paginationType === "last" ) {

			return {

				x: this.leftBoundary.x - 5 * this.unitLength,
				y: 0,
				z: 0

			};

		} else {

			return {

				x: this.rightBoundary.x + 5 * this.unitLength,
				y: 0,
				z: 0

			};

		}

	},

	clear: function() {

		if ( this.neuralValue !== undefined ) {

			if ( this.isOpen ) {

				this.outputHandler.clear();

			}

			this.neuralValue = undefined;

		}

	}

} );

export { Output };