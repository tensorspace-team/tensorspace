import MapLayer from './MapLayer';
import PaddingMap from '../../elements/PaddingMap';
import ColorUtils from '../../utils/ColorUtils';

function MapPadding2d(config) {

	MapLayer.call(this, config);

	this.paddingWidth = config.padding[0];
	this.paddingHeight = config.padding[1];
	this.paddingLeft = Math.floor(config.padding[0] / 2);
	this.paddingRight = config.padding[0] - this.paddingLeft;
	this.paddingTop = Math.floor(config.padding[1] / 2);
	this.paddingBottom = config.padding[1] - this.paddingTop;

	this.contentWidth = undefined;
	this.contentHeight = undefined;

	this.depth = undefined;
	this.fmCenters = undefined;
	this.lastFmCenters = undefined;
	this.width = undefined;
	this.height = undefined;

	this.paddingMapList = [];

	console.log(22222);

	this.layerType = "padding2d";

}

MapPadding2d.prototype = Object.assign(Object.create(MapLayer.prototype), {

	init: function(center) {

		this.center = center;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		if (this.lastLayer.fmCenters !== undefined) {

			this.lastFmCenters = this.lastLayer.fmCenters;
			this.fmCenters = [];

			for (let i = 0; i < this.lastFmCenters.length; i++) {
				let fmCenter = {};
				fmCenter.x = this.lastFmCenters[i].x;
				fmCenter.y = this.lastFmCenters[i].y;
				fmCenter.z = this.lastFmCenters[i].z;
				this.fmCenters.push(fmCenter);
			}

			for (let i = 0; i < this.fmCenters.length; i++) {

				let paddingMap = new PaddingMap(
					this.width,
					this.height,
					this.fmCenters[i],
					this.paddingWidth,
					this.paddingHeight
				);
				this.paddingMapList.push(paddingMap);
				this.neuralGroup.add(paddingMap.getMapElement());

			}

		} else {

			console.log("single");

			let paddingMap = new PaddingMap(
				this.width,
				this.height,
				{x: 0, y: 0, z: 0},
				this.paddingWidth,
				this.paddingHeight
			);

			console.log(paddingMap.getMapElement());

			this.paddingMapList.push(paddingMap);
			this.neuralGroup.add(paddingMap.getMapElement());

		}

		this.scene.add(this.neuralGroup);

	},

	assemble: function(layerIndex) {

		this.layerIndex = layerIndex;

		this.contentWidth = this.lastLayer.width;
		this.contentHeight = this.lastLayer.height;
		this.depth = this.lastLayer.depth;
		this.width = this.contentWidth + this.paddingWidth;
		this.height = this.contentHeight + this.paddingHeight;

		this.outputShape = [this.width, this.height, this.depth];

	},

	updateValue: function() {

		this.neuralValue = this.lastLayer.neuralValue;

		let nonePaddingNeuralSize = this.contentWidth * this.contentHeight;
		let fmNum = this.neuralValue.length / nonePaddingNeuralSize;

		let layerOutputValues = [];

		for (let j = 0; j < fmNum; j++) {

			let referredIndex = j;

			while (referredIndex < this.neuralValue.length) {

				layerOutputValues.push(this.neuralValue[referredIndex]);

				referredIndex += fmNum;
			}

		}

		let colors = ColorUtils.getAdjustValues(layerOutputValues);

		for (let i = 0; i < fmNum; i++) {

			let paddingMap = this.paddingMapList[i];

			paddingMap.updateGrayScale(colors.slice(i * nonePaddingNeuralSize, (i + 1) * nonePaddingNeuralSize));

		}

	}

});

export default MapPadding2d;
