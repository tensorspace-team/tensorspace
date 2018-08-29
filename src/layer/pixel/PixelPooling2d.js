import { MinAlpha } from "../../utils/Constant";
import { NeuralBoxLength } from "../../utils/Constant";
import { colorUtils } from '../../utils/ColorUtils';
import { PixelLayer } from './PixelLayer';

function PixelPooling2d(config) {

	PixelLayer.call(this, config);

	this.fmCenters = [];
	this.inputShape = undefined;
	this.width = undefined;
	this.height = undefined;
	this.poolSize = config.poolSize;
	this.strides = config.strides;
	this.fmNum = undefined;

	this.depth = undefined;

	this.layerType = "maxPool2d";

}

PixelPooling2d.prototype = Object.assign(Object.create(PixelLayer.prototype), {

	init: function (center) {

		this.center = center;

		for (let i = 0; i < this.lastLayer.fmCenters.length; i++) {
			let fmCenter = {};
			fmCenter.x = this.lastLayer.fmCenters[i].x;
			fmCenter.y = 0;
			fmCenter.z = 0;
			this.fmCenters.push(fmCenter);
		}

		let initX = -this.width / 2;
		let initY = -this.height / 2;

		let count = 0;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		for (let i = 0; i < this.fmNum; i++) {

			let fmCenter = this.fmCenters[i];

			for (let j = 0; j < this.height; j++) {

				for (let k = 0; k < this.width; k++) {

					let geometry = new THREE.BoxGeometry(1, 1, 1);
					let material = new THREE.MeshBasicMaterial({
						color: new THREE.Color( MinAlpha, MinAlpha, MinAlpha ),
						vertexColors: THREE.VertexColors,
						flatShading: true,
						transparent: true
					});

					let cube = new THREE.Mesh(geometry, material);

					this.neuralList.push(cube);

					cube.position.set(NeuralBoxLength * (k + initX) + fmCenter.x, fmCenter.y, NeuralBoxLength * (j + initY) + fmCenter.z);
					cube.elementType = "neural";
					cube.layerIndex = this.layerIndex;
					cube.positionIndex = count;
					count++;

					this.neuralGroup.add(cube);

				}

			}

		}

		this.scene.add(this.neuralGroup);

	},

	assemble: function (layerIndex) {

		this.layerIndex = layerIndex;

		this.inputShape = this.lastLayer.outputShape;
		this.width = (this.inputShape[0] - this.poolSize[0]) / this.strides[0] + 1;
		this.height = (this.inputShape[1] - this.poolSize[1]) / this.strides[1] + 1;
		this.fmNum = this.inputShape[2];
		this.outputShape = [this.width, this.height, this.fmNum];

		this.depth = this.lastLayer.depth;

	},

	calculateRelativeIndex: function (positionIndex) {

		let neuralIndexList = [];

		let [xStart, yStart, fmNum] = this.calculateInputXYFromIndex(positionIndex);

		for (let i = 0; i < this.poolSize[0]; i++) {
			for (let j = 0; j < this.poolSize[1]; j++) {

				let neuralIndex = xStart + yStart * this.lastLayer.width + i + j * this.lastLayer.width;
				neuralIndex += this.lastLayer.width * this.lastLayer.height * fmNum;

				neuralIndexList.push(neuralIndex);

			}
		}

		return neuralIndexList;
	},

	calculateInputXYFromIndex: function (positionIndex) {

		let fmNum = Math.floor(positionIndex / (this.width * this.height));
		let remaining = positionIndex % (this.width * this.height);

		let fmXPos = remaining % this.height;
		let fmYPos = Math.floor(remaining / this.height);

		let inputXPos = this.strides[0] * fmXPos;
		let inputYPos = this.strides[1] * fmYPos;

		return [inputXPos, inputYPos, fmNum];

	},

	updateValue: function(value) {
		this.neuralValue = value;

		let colorList = colorUtils.getColors(value);

		for (let i = 0; i < colorList.length; i++) {

			let colorTriple = colorList[i];
			this.neuralList[i].material.color.setRGB(colorTriple[0], colorTriple[1], colorTriple[2]);

		}
	}

});

export { PixelPooling2d };