import { BasicMaterialOpacity } from "../utils/Constant";
import { MinAlpha } from "../utils/Constant";

function InputMap3d(width, height, initCenter, color) {

	this.width = width;
	this.height = height;
	this.depth = 3;
	this.fmCenter = {
		x: initCenter.x,
		y: initCenter.y,
		z: initCenter.z
	};

	this.color = color;

	this.neuralLength = 3 * width * height;

	this.dataArray = undefined;
	this.dataTexture = undefined;

	this.colorMap = undefined;

	this.init();

}

InputMap3d.prototype = {

	init: function() {

		let amount = 3 * this.width * this.height;

		console.log(amount);

		let data = new Uint8Array(amount);
		this.dataArray = data;

		for (let i = 0; i < amount; i++) {

			data[i] = 255 * MinAlpha;

		}

		let dataTex = new THREE.DataTexture(data, this.width, this.height, THREE.RGBFormat);
		this.dataTexture = dataTex;

		dataTex.magFilter = THREE.NearestFilter;
		dataTex.needsUpdate = true;

		let boxGeometry = new THREE.BoxGeometry(this.width, 1, this.height);

		let material = new THREE.MeshBasicMaterial({ map: dataTex });
		let basicMaterial = new THREE.MeshBasicMaterial({
			color: this.color, transparent: true, opacity: BasicMaterialOpacity
		});

		let materials = [
			basicMaterial,
			basicMaterial,
			material,
			material,
			basicMaterial,
			basicMaterial
		];

		let cube = new THREE.Mesh(boxGeometry, materials);

		cube.position.set(this.fmCenter.x, this.fmCenter.y, this.fmCenter.z);
		cube.elementType = "aggregationElement";

		this.colorMap = cube;

	},

	getElement: function() {
		return this.colorMap;
	},

	updateVis: function(colors) {

		for (let i = 0; i < this.dataArray.length; i++) {
			this.dataArray[i] = 255 * colors[i];
		}

		this.dataTexture.needsUpdate = true;

	},

	clear: function(){

		for (let i = 0; i < this.dataArray.length; i++) {

			this.dataArray[i] = 255 * MinAlpha;

		}

		this.dataTexture.needsUpdate = true;

	},

	setLayerIndex: function(layerIndex) {
		this.colorMap.layerIndex = layerIndex;
	}

};

export { InputMap3d };