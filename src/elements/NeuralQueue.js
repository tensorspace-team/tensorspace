import { MinAlpha } from "../utils/Constant";
import { BasicMaterialOpacity } from "../utils/Constant";

function NeuralQueue(length, color) {

	this.queueLength = length;
	this.color = color;

	this.dataArray = undefined;
	this.dataTexture = undefined;
	this.queue = undefined;

	this.initNeuralQueue();
}

NeuralQueue.prototype = {

	initNeuralQueue: function() {

		let data = new Uint8Array(this.queueLength);
		this.dataArray = data;

		for (let i = 0; i < this.queueLength; i++) {
			data[i] = 255 * MinAlpha;
		}

		let dataTex = new THREE.DataTexture(data, this.queueLength, 1, THREE.LuminanceFormat, THREE.UnsignedByteType);
		this.dataTexture = dataTex;

		dataTex.magFilter = THREE.NearestFilter;
		dataTex.needsUpdate = true;

		let boxGeometry = new THREE.BoxGeometry(this.queueLength, 1, 1);

		// 这里设置color可以隐约显示颜色总体的感觉

		let material = new THREE.MeshBasicMaterial({ color: this.color, alphaMap: dataTex, transparent: true });
		let basicMaterial = new THREE.MeshBasicMaterial({
			color: this.color, transparent: true, opacity: BasicMaterialOpacity
		});

		let materials = [
			basicMaterial,
			basicMaterial,
			material,
			material,
			material,
			material
		];

		let cube = new THREE.Mesh(boxGeometry, materials);

		cube.position.set(0, 0, 0);

		this.queue = cube;

	},

	getQueueElement: function() {

		return this.queue;

	},

	updateGrayScale: function(colors) {

		for (let i = 0; i < colors.length; i++) {
			this.dataArray[i] = 255 * colors[i];
		}

		this.dataTexture.needsUpdate = true;

	}

};

export { NeuralQueue };