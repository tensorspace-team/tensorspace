import { Layer } from "./Layer";
import { fmCenterGenerator } from "../../utils/FmCenterGenerator";
import { InputMap3d } from "../../elements/InputMap3d";
import { ChannelMap } from "../../elements/ChannelMap";
import { colorUtils } from "../../utils/ColorUtils";
import { RGBTweenFactory } from "../../animation/RGBChannelTween";
import { CloseButton } from "../../elements/CloseButton";
import { CloseButtonHelper } from "../../utils/CloseButtonHelper";

function Input3d(config) {

	Layer.call(this, config);

	this.shape = config.shape;
	this.width = config.shape[0];
	this.height = config.shape[1];
	this.depth = 3;
	this.neuralNum = config.shape[0] * config.shape[1];
	this.outputShape = config.shape;

	this.fmCenters = [];
	this.closeFmCenters = [];
	this.openFmCenters = fmCenterGenerator.getFmCenters("line", 3, this.width, this.height);

	for (let i = 0; i < 3; i++) {
		this.closeFmCenters.push({
			x: 0,
			y: 0,
			z: 0
		});
	}

	this.separateTopPos = {
		x: 0,
		y: 20,
		z: 0
	};

	this.separateBottomPos = {
		x: 0,
		y: -20,
		z: 0
	};

	this.isOpen = false;

	this.colorfulMapHandler = undefined;

	this.channelHandlerList = [];

	this.layerType = "input3d";

}

Input3d.prototype = Object.assign(Object.create(Layer.prototype), {

	init: function(center) {

		this.center = center;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		this.initAggregationElement();

		this.scene.add(this.neuralGroup);

	},

	assemble: function(layerIndex, modelConfig) {

		console.log("Assemble input3d layer");

		this.layerIndex = layerIndex;

		if (this.color !== undefined) {
			this.color = modelConfig.color.input;
		}

	},

	openLayer: function() {

		if (!this.isOpen) {
			RGBTweenFactory.separate(this);
		}

	},

	closeLayer: function() {

		if (this.isOpen) {
			RGBTweenFactory.aggregate(this);
		}

	},

	initAggregationElement: function() {

		let colorfulMap = new InputMap3d(this.width, this.height, this.center, this.color);
		let mapElement = colorfulMap.getMapElement();
		mapElement.elementType = "aggregationElement";
		mapElement.layerIndex = this.layerIndex;
		this.colorfulMapHandler = colorfulMap;

		this.neuralGroup.add(this.colorfulMapHandler.getMapElement());

		if (this.neuralValue !== undefined) {
			this.updateAggregationVis();
		}

	},

	disposeAggregationElement: function() {

		this.neuralGroup.remove(this.colorfulMapHandler.getMapElement());
		this.colorfulMapHandler = undefined;

	},

	initSegregationElements: function() {

		let rChannel = new ChannelMap(this.width, this.height, this.closeFmCenters[0], this.color, "R");
		let gChannel = new ChannelMap(this.width, this.height, this.closeFmCenters[1], this.color, "G");
		let bChannel = new ChannelMap(this.width, this.height, this.closeFmCenters[2], this.color, "B");

		this.channelHandlerList.push(rChannel);
		this.channelHandlerList.push(gChannel);
		this.channelHandlerList.push(bChannel);

		if (this.neuralValue !== undefined) {

			this.updateSegregationVis();
		}

		this.neuralGroup.add(rChannel.getMapElement());
		this.neuralGroup.add(gChannel.getMapElement());
		this.neuralGroup.add(bChannel.getMapElement());

	},

	disposeSegregationElements: function() {

		for (let i = 0; i < this.channelHandlerList.length; i++) {
			this.neuralGroup.remove(this.channelHandlerList[i].getMapElement());
		}
		this.channelHandlerList = [];

	},

	initCloseButton: function() {

		let closeButtonPos = CloseButtonHelper.getPosInLayer(this.openFmCenters[0], this.width);

		let closeButton = new CloseButton(closeButtonPos, this.color);
		let closeButtonElement = closeButton.getButton();
		closeButtonElement.layerIndex = this.layerIndex;

		this.closeButton = closeButtonElement;
		this.neuralGroup.add(closeButtonElement);

	},

	disposeCloseButton: function() {

		this.neuralGroup.remove(this.closeButton);
		this.closeButton = undefined;

	},

	updateValue: function(value) {

		this.neuralValue = value;

		if (this.isOpen) {

			this.updateSegregationVis();

		} else {

			this.updateAggregationVis();

		}

	},

	updateAggregationVis: function() {

		let colors = colorUtils.getAdjustValues(this.neuralValue);
		this.colorfulMapHandler.updateVis(colors);
	},

	updateSegregationVis: function() {

		let colors = colorUtils.getAdjustValues(this.neuralValue);

		let rVal = [];
		let gVal = [];
		let bVal = [];

		for (let i = 0; i < colors.length; i++) {

			if (i % 3 === 0) {
				rVal.push(colors[i]);
			} else if (i % 3 === 1) {
				gVal.push(colors[i]);
			} else {
				bVal.push(colors[i]);
			}

		}

		this.channelHandlerList[0].updateVis(rVal);
		this.channelHandlerList[1].updateVis(gVal);
		this.channelHandlerList[2].updateVis(bVal);

	}

});

export { Input3d };