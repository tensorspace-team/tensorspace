/**
 * @author syt123450 / https://github.com/syt123450
 */

import { DefaultMinAlpha } from "../../utils/Constant";
import { NeuralBoxLength } from "../../utils/Constant";
import { ColorUtils } from '../../utils/ColorUtils';
import { PixelLayer } from './PixelLayer';

function PixelConv2d(config) {

	PixelLayer.call(this, config);

	console.log("construct Conv2d");

	this.kernelSize = config.kernelSize;
	this.filters = config.filters;
	this.strides = config.strides;
	this.fmShape = undefined;
	this.width = undefined;
	this.height = undefined;
	this.fmCenters = [];
	this.depth = config.filters;
	this.layerType = "conv2d";

}

PixelConv2d.prototype = Object.assign(Object.create(PixelLayer.prototype), {

	init: function (center) {

		console.log("init conv2d");

		this.center = center;
		this.fmCenters = calculateFmCenters(this.filters, this.width);

		let initX = -this.width / 2;
		let initY = -this.height / 2;

		let count = 0;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		for (let i = 0; i < this.filters; i++) {

			let fmCenter = this.fmCenters[i];

			for (let j = 0; j < this.height; j++) {

				for (let k = 0; k < this.width; k++) {

					let geometry = new THREE.BoxGeometry(1, 1, 1);
					let material = new THREE.MeshBasicMaterial({
						color: new THREE.Color( DefaultMinAlpha, DefaultMinAlpha, DefaultMinAlpha ),
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

		function calculateFmCenters(filters, width) {

			let fmCenters = [];

			let fmLength = NeuralBoxLength * width;
			let fmInterval = 10;
			let initXTranslate;

			initXTranslate = - (filters - 1) / 2 * (fmLength + fmInterval);

			for (let i = 0; i < filters; i++) {

				let xTranslate = initXTranslate + (fmLength + fmInterval) * i;
				let fmCenter = {};
				fmCenter.x = xTranslate;
				fmCenter.y = 0;
				fmCenter.z = 0;
				fmCenters.push(fmCenter);

			}

			return fmCenters;

		}

	},

	assemble: function (layerIndex) {

		console.log("Assemble conv2d, layer index: " + layerIndex);

		this.layerIndex = layerIndex;

		this.inputShape = this.lastLayer.outputShape;
		this.width = (this.inputShape[0] - this.kernelSize) / this.strides + 1;
		this.height = (this.inputShape[1] - this.kernelSize) / this.strides + 1;
		this.fmShape = [this.width, this.height];
		this.outputShape = [this.width, this.height, this.filters];

	},

	calculateRelativeIndex: function (positionIndex) {

		let neuralIndexList = [];

		let [xStart, yStart] = this.calculateInputXYFromIndex(positionIndex);

		for (let i = 0; i < this.kernelSize; i++) {
			for (let j = 0; j < this.kernelSize; j++) {

				for (let k = 0; k < this.lastLayer.depth; k++) {
					let neuralIndex = xStart + yStart * this.lastLayer.width + i + j * this.lastLayer.width;
					neuralIndex = neuralIndex + this.lastLayer.width * this.lastLayer.height * k;

					neuralIndexList.push(neuralIndex);
				}

			}
		}

		return neuralIndexList;
	},

	calculateInputXYFromIndex: function (positionIndex) {

		let remaining = positionIndex % (this.width * this.height);

		let fmXPos = remaining % this.width;
		let fmYPos = Math.floor(remaining / this.width);

		let inputXPos = this.strides * fmXPos;
		let inputYPos = this.strides * fmYPos;

		return [inputXPos, inputYPos];

	},

	updateValue: function(value) {
		this.neuralValue = value;

		let colorList = ColorUtils.getColors(value);

		for (let i = 0; i < colorList.length; i++) {

			let colorTriple = colorList[i];
			this.neuralList[i].material.color.setRGB(colorTriple[0], colorTriple[1], colorTriple[2]);

		}
	}

});

export { PixelConv2d };