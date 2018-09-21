/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Layer } from "./Layer";
import { QueueTransitionFactory } from "../../animation/QueueTransitionTween";
import { ColorUtils } from "../../utils/ColorUtils";
import { QueueAggregation } from "../../elements/QueueAggregation";
import { NeuralQueue } from "../../elements/NeuralQueue";
import { PaginationButton } from "../../elements/PagniationButton";
import { QueueSegment } from "../../elements/QueueSegment";

function Layer1d( config ) {

	Layer.call( this, config );

	this.layerDimension = 1;

	this.units = undefined;
	this.width = undefined;

	this.lastActualWidth = undefined;
	this.lastActualHeight = undefined;

	this.queueHandler = undefined;
	this.lastButtonHandler = undefined;
	this.nextButtonHandler = undefined;

	this.section = false;
	this.segmentLength = 200;
	this.segmentIndex = 0;
	this.totalSegments = undefined;

	this.queueLength = this.segmentLength;

	this.isTransition = false;

}

Layer1d.prototype = Object.assign( Object.create( Layer.prototype ), {

	init: function( center, actualDepth ) {

		this.center = center;
		this.actualDepth = actualDepth;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set( this.center.x, this.center.y, this.center.z );

		if ( this.isOpen ) {

			this.initQueueElement();
			this.initCloseButton();

			if ( this.section ) {

				this.showPagination();

			}

		} else {

			this.initAggregationElement();

		}

		this.createBasicLineElement();

		this.scene.add( this.neuralGroup );

	},

	loadLayer1dConfig: function( layerConfig ) {

		if ( layerConfig !== undefined ) {

			if ( layerConfig.section !== undefined ) {

				this.section = layerConfig.section;

				if ( this.section ) {

					if ( layerConfig.segmentLength !== undefined ) {

						this.segmentLength = layerConfig.segmentLength;
						this.queueLength = this.segmentLength;

					}

					if ( layerConfig.initSegmentIndex !== undefined ) {

						this.segmentIndex = layerConfig.initSegmentIndex;

					}

				}

			}

		}

	},

	showPagination: function() {

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
			this.unitLength,
			this.calculatePaginationPos( "next" ),
			this.color,
			this.minOpacity

		);

		nextButtonHandler.setLayerIndex( this.layerIndex );

		this.nextButtonHandler = nextButtonHandler;
		this.neuralGroup.add( this.nextButtonHandler.getElement() );

	},

	calculatePaginationPos: function( paginationType ) {

		if ( paginationType === "last" ) {

			return {

				x: - this.queueLength * this.unitLength / 2 - 5 * this.unitLength,
				y: 0,
				z: 0

			};

		} else {

			return {

				x: this.queueLength * this.unitLength / 2 + 5 * this.unitLength,
				y: 0,
				z: 0

			};

		}

	},

	hidePagination: function() {

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

		this.queueHandler.updateSegmentIndex( this.segmentIndex );

		if ( this.queueHandler.isLengthChanged ) {

			this.queueLength = this.queueHandler.queueLength;

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

			this.updateQueueVis();

		}

	},

	openLayer: function() {

		if ( !this.isOpen ) {

			QueueTransitionFactory.openLayer( this );

			this.isOpen = true;

		}

	},

	initQueueElement: function() {

		let queueHandler;

		if ( this.section ) {

			queueHandler = new QueueSegment(

				this.segmentLength,
				this.segmentIndex,
				this.width,
				this.unitLength,
				this.color,
				this.minOpacity

			);

			this.queueLength = queueHandler.queueLength;

		} else {

			queueHandler = new NeuralQueue(

				this.width,
				this.actualWidth,
				this.unitLength,
				this.color,
				this.minOpacity

			);

		}

		queueHandler.setLayerIndex( this.layerIndex );
		this.queueHandler = queueHandler;
		this.neuralGroup.add( queueHandler.getElement() );

		if ( this.neuralValue !== undefined ) {

			this.updateQueueVis();

		}

	},

	disposeQueueElement: function() {

		console.log("dispose queue element");

		this.neuralGroup.remove( this.queueHandler.getElement() );
		this.queueHandler = undefined;

	},

	initAggregationElement: function() {

		let aggregationHandler = new QueueAggregation(

			this.lastActualWidth,
			this.lastActualHeight,
			this.unitLength,
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

	closeLayer: function() {

		if ( this.isOpen ) {

			QueueTransitionFactory.closeLayer( this );

			this.isOpen = false;
		}

	},

	showText: function( element ) {

		if ( element.elementType === "featureLine" ) {

			this.queueHandler.showText();
			this.textElementHandler = this.queueHandler;

		}

	},

	hideText: function() {

		if ( this.textElementHandler !== undefined ) {

			this.textElementHandler.hideText();
			this.textElementHandler = undefined;

		}

	},

	handleHoverIn: function( hoveredElement ) {

		if ( this.relationSystem !== undefined && this.relationSystem ) {

			this.initLineGroup( hoveredElement );

		}

		if ( this.textSystem !== undefined && this.textSystem ) {

			this.showText( hoveredElement );

		}

	},

	handleHoverOut: function() {

		if ( this.relationSystem !== undefined && this.relationSystem ) {

			this.disposeLineGroup();

		}

		if ( this.textSystem !== undefined && this.textSystem ) {

			this.hideText();

		}

	},

	updateValue: function( value ) {

		this.neuralValue = value;

		if ( this.isOpen ) {

			this.updateQueueVis();

		}

	},

	updateQueueVis: function() {

		let colors = ColorUtils.getAdjustValues( this.neuralValue, this.minOpacity );

		if ( this.section ) {

			let segmentColors = colors.slice(

				this.segmentLength * this.segmentIndex,
				Math.min( this.segmentLength * ( this.segmentIndex + 1 ), this.width - 1 )

			);

			this.queueHandler.updateVis( segmentColors );

		} else {

			this.queueHandler.updateVis( colors );

		}

	},

	calcCloseButtonSize: function() {

		if ( this.width > 50 ) {

			return 2 * this.unitLength;

		} else {

			return 1.1 * this.unitLength;

		}

	},

	calcCloseButtonPos: function() {

		let xTranslate;

		if ( this.section ) {

			xTranslate = - this.queueLength * this.unitLength / 2 - 10 * this.unitLength;

		} else {

			xTranslate = - this.actualWidth / 2 - 10 * this.unitLength;

		}

		return {

			x: xTranslate,
			y: 0,
			z: 0

		};

	},

	clear: function() {

		if ( this.neuralValue !== undefined ) {

			if ( this.isOpen ) {

				this.queueHandler.clear();

			}

			this.neuralValue = undefined;

		}

	},

	provideRelativeElements: function( request ) {

		let relativeElements = [];

		if ( !this.isTransition ) {

			if ( this.isOpen ) {

				relativeElements.push( this.queueHandler.getElement() );

			} else {

				relativeElements.push( this.aggregationHandler.getElement() );

			}

		}

		return {

			isOpen: this.isOpen,
			elementList: relativeElements

		};

	},

	handleClick: function( clickedElement ) {

		if ( clickedElement.elementType === "aggregationElement" ) {

			this.openLayer();

		} else if ( clickedElement.elementType === "closeButton" ) {

			this.closeLayer();

		} else if ( clickedElement.elementType === "paginationButton" ) {

			this.updatePage( clickedElement.paginationType );

		}

	},

	// override this function to load user's layer config for layer2d object
	loadLayerConfig: function( layerConfig ) {

	},

	// override this function to load user's model config to layer2d object
	loadModelConfig: function( modelConfig ) {

	},

	// override this function to get information from previous layer
	assemble: function( layerIndex ) {

	}

} );

export { Layer1d };