import Layer from './Layer';

function MaxPool2d(config) {

	Layer.call(this, config);

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

MaxPool2d.prototype = Object.assign(Object.create(Layer.prototype), {

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

			for (let j = 0; j < this.width; j++) {

				for (let k = 0; k < this.height; k++) {

					let geometry = new THREE.BoxGeometry(1, 1, 1);
					let material = new THREE.MeshBasicMaterial({
						color: 0xffffff,
						shading: THREE.FlatShading,
						vertexColors: THREE.VertexColors,
						transparent: true
					});

					let cube = new THREE.Mesh(geometry, material);

					this.neuralList.push(cube);

					cube.position.set(1.3 * (j + initX) + fmCenter.x, fmCenter.y, 1.3 * (k + initY) + fmCenter.z);
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

	}

});

export default MaxPool2d;