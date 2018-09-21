/**
 * @author syt123450 / https://github.com/syt123450
 */

import { CloseButton } from "../../elements/CloseButton";
import { MergeLineGroupController } from "./MergedLineGroupController";

function MergedLayer( config ) {

	MergeLineGroupController.call( this );

	this.scene = undefined;
	this.layerIndex = undefined;
	this.center = undefined;
	this.lastLayer = undefined;

	// store all neural value as an array
	this.neuralValue = undefined;

	this.activation = undefined;
	this.inputShape = [];
	this.outputShape = [];
	this.neuralGroup = undefined;

	// color for layer neural visualization
	this.color = undefined;

	// store the reference for layer aggregation
	this.aggregationHandler = undefined;

	// store the reference for close button
	this.closeButtonHandler = undefined;
	this.hasCloseButton = true;
	this.closeButtonSizeRatio = 1;

	// center position is the left-most for layer, type: {x: value , y: value, z: value}
	this.leftMostCenter = undefined;

	// actual width and height in three.js scene
	this.actualWidth = undefined;
	this.actualHeight = undefined;

	// actual depth for layer aggregation
	this.actualDepth = undefined;

	// actualWidth / width
	this.unitLength = undefined;

	// store hook between layers
	this.nextHookHandler = undefined;
	this.lastHookHandler = undefined;

	// handler for element showing text
	this.textElementHandler = undefined;

	// config for text and relation line
	this.textSystem = undefined;
	this.relationSystem = undefined;

	this.isOpen = undefined;

	// actualWidth / width
	this.unitLength = undefined;

	// identify whether is merged layer
	this.isMerged = true;

	this.operator = undefined;

	this.minOpacity = undefined;

	this.loadBasicLayerConfig( config );

}

MergedLayer.prototype = Object.assign( Object.create( MergeLineGroupController.prototype ), {

	loadBasicLayerConfig: function( config ) {

		if ( config !== undefined ) {

			if ( config.initStatus !== undefined ) {

				if ( config.initStatus === "open" ) {

					this.isOpen = true;

				} else if ( config.initStatus === "close" ) {

					this.isOpen = false;

				} else {

					console.error( "\"initStatus\" property do not support for " + config.initStatus + ", use \"open\" or \"close\" instead." );

				}

			}

			if ( config.color !== undefined ) {

				this.color = config.color;

			}

			if ( config.name !== undefined ) {

				this.name = config.name;

			}

			if ( config.closeButton !== undefined ) {

				if ( config.closeButton.display !== undefined ) {

					this.hasCloseButton = config.closeButton.display;

				}

				if ( config.closeButton.ratio !== undefined ) {

					this.closeButtonSizeRatio = config.closeButton.ratio;

				}

			}

			if ( config.minOpacity !== undefined ) {

				this.minOpacity = config.minOpacity;

			}

		}

	},

	loadBasicModelConfig: function( modelConfig ) {

		if ( this.isOpen === undefined ) {

			this.isOpen = modelConfig.layerInitStatus;

		}

		if ( this.relationSystem === undefined ) {

			this.relationSystem = modelConfig.relationSystem;

		}

		if ( this.textSystem === undefined ) {

			this.textSystem = modelConfig.textSystem;

		}

		if ( this.minOpacity === undefined ) {

			this.minOpacity = modelConfig.minOpacity;

		}

	},

	setEnvironment: function( scene ) {

		this.scene = scene;

	},

	initCloseButton: function() {

		if ( this.hasCloseButton ) {

			let closeButtonPos = this.calcCloseButtonPos();
			let closeButtonSize = this.closeButtonSizeRatio * this.calcCloseButtonSize();

			let closeButtonHandler = new CloseButton(

				closeButtonSize,
				this.unitLength,
				closeButtonPos,
				this.color,
				this.minOpacity

			);

			closeButtonHandler.setLayerIndex( this.layerIndex );

			this.closeButtonHandler = closeButtonHandler;
			this.neuralGroup.add( this.closeButtonHandler.getElement() );

		}

	},

	disposeCloseButton: function() {

		this.neuralGroup.remove( this.closeButtonHandler.getElement() );
		this.closeButtonHandler = undefined;

	}

} );

export { MergedLayer };