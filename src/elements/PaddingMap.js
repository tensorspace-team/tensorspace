import { MinAlpha } from "../utils/Constant";
import { BasicMaterialOpacity } from "../utils/Constant";
import { colorUtils } from "../utils/ColorUtils";

function PaddingMap(width, height, actualWidth, actualHeight, center, paddingWidth, paddingHeight, color) {

	this.width = width;
	this.height = height;
	this.actualWidth = actualWidth;
	this.actualHeight = actualHeight;
	this.center = {
		x: center.x,
		y: center.y,
		z: center.z
	};

	this.paddingWidth = paddingWidth;
	this.paddingHeight = paddingHeight;

	this.paddingTop = Math.floor(paddingHeight / 2);
	this.paddingBottom = this.paddingHeight - this.paddingTop;
	this.paddingLeft = Math.floor(paddingWidth / 2);
	this.paddingRight = this.paddingWidth - this.paddingLeft;

	this.contentWidth = this.width - this.paddingWidth;
	this.contentHeight = this.height - this.paddingHeight;

	this.neuralLength = width * height;

	this.color = color;

	this.dataArray = undefined;
	this.dataTexture = undefined;

	this.featureMap = undefined;

	this.init();

}

PaddingMap.prototype = Object.assign(Object.create(PaddingMap.prototype), {

	init: function() {

		let amount = this.width * this.height;
		let data = new Uint8Array(amount);
		this.dataArray = data;

		for (let i = 0; i < amount; i++) {
			data[i] = 255 * MinAlpha;
		}

		let dataTex = new THREE.DataTexture(data, this.width, this.height, THREE.LuminanceFormat, THREE.UnsignedByteType);
		this.dataTexture = dataTex;

		dataTex.magFilter = THREE.NearestFilter;
		dataTex.needsUpdate = true;

		let boxGeometry = new THREE.BoxGeometry(this.actualWidth, this.actualWidth / this.width, this.actualHeight);

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
			basicMaterial,
			basicMaterial
		];

		let cube = new THREE.Mesh(boxGeometry, materials);

		cube.position.set(this.center.x, this.center.y, this.center.z);

		this.featureMap = cube;

	},

	getElement: function() {
		return this.featureMap;
	},

	updateVis: function(colors) {

		for (let i = 0; i < this.height; i++) {

			for (let j = 0; j < this.width; j++) {

				if (!this.isPadding(j, i)) {

					let correspondingIndex = this.contentWidth * ( i - this.paddingTop) + ( j - this.paddingLeft );
					this.dataArray[this.width * i + j] = 255 * colors[correspondingIndex];

				} else {
					this.dataArray[this.width * i + j] = 255 * MinAlpha;
				}

			}

		}

		this.dataTexture.needsUpdate = true;

	},

	isPadding: function(x, y) {

		if (y >= this.paddingTop &&
			y < (this.height - this.paddingBottom) &&
			x >= this.paddingLeft &&
			x < (this.width - this.paddingRight)) {
			return false;
		}

		return true;

	},

	updatePos: function(pos) {

		this.center.x = pos.x;
		this.center.y = pos.y;
		this.center.z = pos.z;
		this.featureMap.position.set(pos.x, pos.y, pos.z);

	},

	clear: function() {
		let zeroData = new Uint8Array(this.neuralLength);
		let colors = colorUtils.getAdjustValues(zeroData);

		this.updateVis(colors);
	},

	setLayerIndex: function(layerIndex) {
		this.featureMap.layerIndex = layerIndex;
	}

});

export { PaddingMap };