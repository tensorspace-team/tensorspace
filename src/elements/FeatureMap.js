import { MinAlpha } from "../utils/Constant";
import { BasicMaterialOpacity } from "../utils/Constant";
import { colorUtils } from "../utils/ColorUtils";

function FeatureMap(width, height, actualWidth, actualHeight, initCenter, color) {

	this.fmWidth = width;
	this.fmHeight = height;
	this.actualWidth = actualWidth;
	this.actualHeight = actualHeight;
	this.color = color;

	this.neuralLength = width * height;

	this.fmCenter = {
		x: initCenter.x,
		y: initCenter.y,
		z: initCenter.z
	};

	this.dataArray = undefined;
	this.dataTexture = undefined;
	this.featureMap = undefined;

	this.init();
}

FeatureMap.prototype = {

	init: function() {

		let amount = this.fmWidth * this.fmHeight;
		let data = new Uint8Array(amount);
		this.dataArray = data;

		for (let i = 0; i < amount; i++) {
			data[i] = 255 * MinAlpha;
		}

		let dataTex = new THREE.DataTexture(data, this.fmWidth, this.fmHeight, THREE.LuminanceFormat, THREE.UnsignedByteType);
		this.dataTexture = dataTex;

		dataTex.magFilter = THREE.NearestFilter;
		dataTex.needsUpdate = true;

		let boxGeometry = new THREE.BoxGeometry(this.actualWidth, this.actualWidth / this.fmWidth, this.actualHeight);

		let material = new THREE.MeshBasicMaterial({ color: this.color, alphaMap: dataTex, transparent: true });
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

		this.featureMap = cube;

	},

	getElement: function() {
		return this.featureMap;
	},

	updateVis: function(colors) {

		for (let i = 0; i < colors.length; i++) {
			this.dataArray[i] = colors[i] * 255;
		}
		this.dataTexture.needsUpdate = true;

	},

	updatePos: function(pos) {

		this.fmCenter.x = pos.x;
		this.fmCenter.y = pos.y;
		this.fmCenter.z = pos.z;
		this.featureMap.position.set(pos.x, pos.y, pos.z);

	},

	clear: function() {

		let zeroValue = new Int8Array(this.neuralLength);

		let colors = colorUtils.getAdjustValues(zeroValue);

		this.updateVis(colors);

	},

	setLayerIndex: function(layerIndex) {
		this.featureMap.layerIndex = layerIndex;
	}

};

export { FeatureMap };