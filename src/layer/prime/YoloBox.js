import { Layer } from "../abstract/Layer";
import { OutputMap3d } from "../../elements/OutputMap3d";
import { ColorUtils } from "../../utils/ColorUtils";
import {QueueAggregation} from "../../elements/QueueAggregation";
import {CloseButtonRatio} from "../../utils/Constant";

function YoloBox(config) {

	Layer.call(this, config);

	this.width = undefined;
	this.height = undefined;
	this.depth = 3;

	this.outputHandler = undefined;

	this.rectangleList = [];

	this.loadLayerConfig( config );

	this.isOpen = false;

	this.layerType = "yoloBox";

}

YoloBox.prototype = Object.assign( Object.create( Layer.prototype ), {

	loadLayerConfig: function( layerConfig ) {

	},

	init: function( center, actualDepth ) {

		this.center = center;
		this.actualDepth = actualDepth;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set( this.center.x, this.center.y, this.center.z );

		this.initAggregationElement();

		this.createBasicLineElement();

		this.scene.add( this.neuralGroup );

	},

	assemble: function(layerIndex) {

		this.layerIndex = layerIndex;

		let modelInputShape = this.model.layers[0].outputShape;

		this.width = modelInputShape[0];
		this.height = modelInputShape[1];

		this.unitLength = this.lastLayer.unitLength;
		this.actualWidth = this.lastLayer.actualWidth;
		this.actualHeight = this.lastLayer.actualHeight;

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

	initOutput: function() {

		let outputHandler = new OutputMap3d(

			this.width,
			this.height,
			this.unitLength,
			this.actualDepth,
			{

				x: 0,
				y: 0,
				z: 0

			},
			this.color,
			this.minOpacity

		);

		outputHandler.setLayerIndex( this.layerIndex );

		this.outputHandler = outputHandler;
		this.neuralGroup.add( this.outputHandler.getElement() );

		if ( this.neuralValue !== undefined ) {

			this.updateOutputVis();

		}

	},

	disposeOutput: function() {

		this.neuralGroup.remove( this.outputHandler.getElement() );
		this.outputHandler = undefined;

	},

	loadModelConfig: function( modelConfig ) {

		this.loadBasicModelConfig( modelConfig );

	},

	updateValue: function() {

		this.neuralValue = this.model.inputValue;

		this.updateOutputVis();

	},

	updateOutputVis: function() {

		this.addRectangleList();

		if (this.isOpen) {
			let colors = ColorUtils.getAdjustValues( this.neuralValue, this.minOpacity );
			this.outputHandler.updateVis( colors, this.rectangleList );
		}

	},

	addRectangleList: function() {

		this.rectangleList = [{
			x: 0,
			y: 0,
			width: 100,
			height: 150
		}, {
			x: 250,
			y: 50,
			width: 100,
			height: 50
		}, {
			x: 100,
			y: 10,
			width: 50,
			height: 100
		}, {
			x: 200,
			y: 200,
			width: 100,
			height: 200
		}, {
			x: 250,
			y: 300,
			width: 100,
			height: 80
		}];

	},

	handleClick: function(clickedElement) {

		if ( clickedElement.elementType === "aggregationElement" ) {

			this.openLayer();

		} else if ( clickedElement.elementType === "closeButton" ) {

			this.closeLayer();

		}

	},

	handleHoverIn: function() {

	},

	handleHoverOut: function() {

	},

	clear: function() {

		this.neuralValue = undefined;

		if (this.outputHandler !== undefined) {
			this.outputHandler.clear();
		}

	},

	calcCloseButtonSize: function() {

		return this.unitLength * this.width * CloseButtonRatio;

	},

	calcCloseButtonPos: function() {

		return {

			x: - this.unitLength * this.width / 2 - 20 * this.unitLength,
			y: 0,
			z: 0

		};

	},

	openLayer: function() {

		if (!this.isOpen) {

			this.isOpen = true;

			this.disposeAggregationElement();
			this.initOutput();
			this.updateOutputVis();
			this.initCloseButton();
		}

	},

	closeLayer: function() {

		if (this.isOpen) {

			this.isOpen = false;

			this.disposeOutput();
			this.disposeCloseButton();
			this.initAggregationElement();
		}

	}

} );

export { YoloBox };