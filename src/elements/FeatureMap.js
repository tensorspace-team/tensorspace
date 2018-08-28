import ColorUtils from '../utils/ColorUtils';
import { MinAlpha } from "../utils/Constant";

function FeatureMap(width, height, initCenter, color) {

	this.fmWidth = width;
	this.fmHeight = height;
	this.color = color;

	this.fmCenter = {
		x: initCenter.x,
		y: initCenter.y,
		z: initCenter.z
	};

	this.dataArray = undefined;
	this.dataTexture = undefined;
	this.featureMap = undefined;

	this.initFeatureMap();
}

FeatureMap.prototype = {

	initFeatureMap: function() {

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

		let boxGeometry = new THREE.BoxGeometry(this.fmWidth, 1, this.fmHeight);

		// 这里设置color可以隐约显示颜色总体的感觉

		let material = new THREE.MeshBasicMaterial({ color: this.color, alphaMap: dataTex, transparent: true });
		let basicMaterial = new THREE.MeshBasicMaterial({
			color: this.color, transparent: true, opacity: 0.2
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

	getMapElement: function() {
		return this.featureMap;
	},

	updateGrayScale: function(colors) {

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

	}

};

export default FeatureMap;