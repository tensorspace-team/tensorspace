/**
 * @author syt123450 / https://github.com/syt123450
 */

import {DefaultMinAlpha} from "../../utils/Constant";
import {NeuralBoxLength} from "../../utils/Constant";
import { ColorUtils } from '../../utils/ColorUtils';
import { PixelLayer } from './PixelLayer';

function PixelPadding(config) {

	PixelLayer.call(this, config);

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

	this.nonePaddingNeuralList = [];

	this.layerType = "padding2d";

}

PixelPadding.prototype = Object.assign(Object.create(PixelLayer.prototype), {

	init: function (center) {

		this.center = center;

		let initX = -this.width / 2;
		let initY = -this.height / 2;

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

			let count = 0;

			console.log(this.fmCenters.length);
			console.log(this.width);
			console.log(this.height);

			for (let i = 0; i < this.fmCenters.length; i++) {

				for (let j = 0; j < this.width; j++) {

					for (let k = 0; k < this.height; k++) {

						let geometry = new THREE.BoxGeometry(1, 1, 1);
						let material = new THREE.MeshBasicMaterial({
							color: new THREE.Color(DefaultMinAlpha, DefaultMinAlpha, DefaultMinAlpha),
							vertexColors: THREE.VertexColors,
							flatShading: true,
							transparent: true
						});

						let cube = new THREE.Mesh(geometry, material);

						cube.position.set(NeuralBoxLength * (k + initX) + this.fmCenters[i].x, this.fmCenters[i].y, NeuralBoxLength * (j + initY) + this.fmCenters[i].z);
						cube.elementType = "neural";
						cube.layerIndex = this.layerIndex;
						cube.positionIndex = count;
						count++;

						this.neuralList.push(cube);
						this.neuralGroup.add(cube);

						if (!this.isPadding(k, j)) {
							this.nonePaddingNeuralList.push(cube);
						}

					}

				}

			}

		} else {

			let count = 0;

			for (let i = 0; i < this.width; i++) {

				for (let j = 0; j < this.width; j++) {

					let geometry = new THREE.BoxGeometry(1, 1, 1);
					let material = new THREE.MeshBasicMaterial({
						color: new THREE.Color(DefaultMinAlpha, DefaultMinAlpha, DefaultMinAlpha),
						vertexColors: THREE.VertexColors,
						flatShading: true,
						transparent: true
					});

					let cube = new THREE.Mesh(geometry, material);

					cube.position.set(NeuralBoxLength * (j + initX) + this.center.x, this.center.y, NeuralBoxLength * (i + initY) + this.center.z);
					cube.elementType = "neural";
					cube.layerIndex = this.layerIndex;
					cube.positionIndex = count;
					count++;

					this.neuralList.push(cube);
					this.neuralGroup.add(cube);

					if (!this.isPadding(j, i)) {
						this.nonePaddingNeuralList.push(cube);
					}

				}

			}

		}

		this.scene.add(this.neuralGroup);

	},

	assemble: function (layerIndex) {

		this.layerIndex = layerIndex;

		this.contentWidth = this.lastLayer.width;
		this.contentHeight = this.lastLayer.height;
		this.depth = this.lastLayer.depth;
		this.width = this.contentWidth + this.paddingWidth;
		this.height = this.contentHeight + this.paddingHeight;

		this.outputShape = [this.width, this.height, this.depth];

	},

	calculateRelativeIndex: function (positionIndex) {

		let neuralIndexList = [];

		let [X, Y, fmNum] = this.calculateXYFromIndex(positionIndex);

		if (!this.isPadding(X, Y)) {

			let relativeNeuralIndex = X - this.paddingRight +
				(Y - this.paddingRight) * this.lastLayer.width +
				fmNum * this.lastLayer.width * this.lastLayer.height;
			neuralIndexList.push(relativeNeuralIndex);

		}

		return neuralIndexList;

	},

	calculateXYFromIndex: function(positionIndex) {

		let fmNum = Math.floor(positionIndex / (this.width * this.height));
		let remaining = positionIndex % (this.width * this.height);

		let X = remaining % this.height;
		let Y = Math.floor(remaining / this.height);

		return [X, Y, fmNum];

	},

	isPadding: function (x, y) {

		if (y >= this.paddingTop &&
			y < (this.height - this.paddingBottom) &&
			x >= this.paddingLeft &&
			x < (this.width - this.paddingRight)) {
			return false;
		}

		return true;

	},

	updateValue: function() {

		this.neuralValue = this.lastLayer.neuralValue;

		let colorList = ColorUtils.getColors(this.neuralValue);

		console.log(this.nonePaddingNeuralList.length);

		for (let i = 0; i < colorList.length; i++) {

			let colorTriple = colorList[i];
			this.nonePaddingNeuralList[i].material.color.setRGB(colorTriple[0], colorTriple[1], colorTriple[2]);

		}

	}

});

export { PixelPadding };