/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Layer } from "./Layer";
import { QueueGroupTweenFactory } from "../../animation/QueueGroupTransitionTween";
import { ChannelDataGenerator } from "../../utils/ChannelDataGenerator";
import { ColorUtils } from "../../utils/ColorUtils";
import { GridAggregation } from "../../elements/GridAggregation";
import { GridLine } from "../../elements/GridLine";

function Layer2d( config ) {

	Layer.call( this, config );

	this.layerDimension = 2;

	this.width = undefined;
	this.depth = undefined;

	this.queueHandlers = [];

	this.closeCenterList = [];
	this.openCenterList = [];

}

Layer2d.prototype = Object.assign( Object.create( Layer.prototype ), {

	init: function( center, actualDepth ) {

		this.center = center;
		this.actualDepth = actualDepth;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		if ( this.depth === 1 ) {

			this.isOpen = true;
			this.initSegregationElements( this.openCenterList );

		} else {

			if ( this.isOpen ) {

				this.initSegregationElements( this.openCenterList );
				this.initCloseButton();

			} else {

				this.initAggregationElement();

			}

		}

		this.createBasicLineElement();

		this.scene.add( this.neuralGroup );

	},

	openLayer: function() {

		if ( !this.isOpen ) {

			QueueGroupTweenFactory.openLayer( this );

			this.isOpen = true;

		}

	},

	closeLayer: function() {

		if ( this.isOpen ) {

			QueueGroupTweenFactory.closeLayer( this );

			this.isOpen = false;

		}

	},

	calcCloseButtonSize: function() {

		return 1.1 * this.unitLength;

	},

	calcCloseButtonPos: function() {

		return {

			x: - this.actualWidth / 2 - 30,
			y: 0,
			z: 0

		};

	},

	clear: function() {

		if ( this.neuralValue !== undefined ) {

			if ( this.isOpen ) {

				for ( let i = 0; i < this.queueHandlers.length; i++ ) {

					this.queueHandlers[ i ].clear();

				}

			} else {

				this.aggregationHandler.clear();

			}

			this.neuralValue = undefined;

		}

	},

	showText: function( element ) {

		if ( element.elementType === "gridLine" ) {

			let gridIndex = element.gridIndex;

			this.queueHandlers[ gridIndex ].showText();
			this.textElementHandler = this.queueHandlers[ gridIndex ];

		}

	},

	hideText: function() {

		if ( this.textElementHandler !== undefined ) {

			this.textElementHandler.hideText();
			this.textElementHandler = undefined;

		}

	},

	handleClick: function( clickedElement ) {

		if ( clickedElement.elementType === "aggregationElement" ) {

			this.openLayer();

		} else if ( clickedElement.elementType === "closeButton" ) {

			this.closeLayer();

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

	initSegregationElements: function( centers ) {

		this.queueHandlers = [];

		for ( let i = 0; i < this.depth; i++ ) {

			let queueHandler = new GridLine(

				this.width,
				this.unitLength,
				centers[ i ],
				this.color,
				this.minOpacity

			);

			queueHandler.setLayerIndex( this.layerIndex );
			queueHandler.setGridIndex( i );

			this.queueHandlers.push( queueHandler );
			this.neuralGroup.add( queueHandler.getElement() );

		}

		if ( this.neuralValue !== undefined ) {

			this.updateSegregationVis();

		}

	},

	disposeSegregationElements: function() {

		for ( let i = 0; i < this.depth; i++ ) {

			this.neuralGroup.remove( this.queueHandlers[ i ].getElement() );

		}

		this.queueHandlers = [];

	},

	initAggregationElement: function() {

		let aggregationHandler = new GridAggregation(

			this.width,
			this.unitLength,
			this.color,
			this.minOpacity

		);
		aggregationHandler.setLayerIndex( this.layerIndex );

		this.aggregationHandler = aggregationHandler;
		this.neuralGroup.add( this.aggregationHandler.getElement() );

		if ( this.neuralValue !== undefined ) {

			this.updateAggregationVis();

		}

	},

	disposeAggregationElement: function() {

		this.neuralGroup.remove( this.aggregationHandler.getElement() );
		this.aggregationHandler = undefined;

	},

	updateValue: function( value ) {

		this.neuralValue = value;

		if ( this.isOpen ) {

			this.updateSegregationVis();

		} else {

			this.updateAggregationVis();

		}

	},

	updateAggregationVis: function() {

		let aggregationUpdateValue = ChannelDataGenerator.generateAggregationData(

			this.neuralValue,
			this.depth,
			this.aggregationStrategy

		);

		let colors = ColorUtils.getAdjustValues( aggregationUpdateValue, this.minOpacity );

		this.aggregationHandler.updateVis( colors );

	},

	updateSegregationVis: function() {

		let layerOutputValues = ChannelDataGenerator.generateChannelData( this.neuralValue, this.depth );

		let colors = ColorUtils.getAdjustValues( layerOutputValues, this.minOpacity );

		let featureMapSize = this.width;

		for ( let i = 0; i < this.depth; i++ ) {

			this.queueHandlers[ i ].updateVis( colors.slice( i * featureMapSize, ( i + 1 ) * featureMapSize ) );

		}

	},

	provideRelativeElements: function( request ) {

		let relativeElements = [];

		if ( request.all !== undefined && request.all ) {

			if ( this.isOpen ) {

				for ( let i = 0; i < this.queueHandlers.length; i++ ) {

					relativeElements.push( this.queueHandlers[ i ].getElement() );

				}

			} else {

				relativeElements.push( this.aggregationHandler.getElement() );

			}

		} else {

			if ( request.index !== undefined ) {

				if ( this.isOpen ) {

					relativeElements.push( this.queueHandlers[ request.index ].getElement() );

				} else {

					relativeElements.push( this.aggregationHandler.getElement() );

				}

			}

		}

		return {

			isOpen: this.isOpen,
			elementList: relativeElements

		};

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

export { Layer2d };