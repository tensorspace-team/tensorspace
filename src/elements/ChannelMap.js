import { BasicMaterialOpacity } from "../utils/Constant";
import { MinAlpha } from "../utils/Constant";

function ChannelMap(width, height, actualWidth, actualHeight, actualDepth, center, color, type) {

	this.width = width;
	this.height = height;
	this.actualWidth = actualWidth;
	this.actualHeight = actualHeight;
	this.actualDepth = actualDepth;
	this.center = {
		x: center.x,
		y: center.y,
		z: center.z
	};
	this.color = color;
	this.type = type;

	this.dataArray = undefined;
	this.dataTexture = undefined;
	this.channelMap = undefined;

	this.init();
}

ChannelMap.prototype = {

	init: function() {

		let amount = 3 * this.width * this.height;
		let data = new Uint8Array(amount);
		this.dataArray = data;

		for (let i = 0; i < amount; i++) {

			switch (this.type) {
				case 'R':
					if (i % 3 === 0) {
						data[i] = 255 * MinAlpha;
					}
					break;
				case 'G':
					if (i % 3 === 1) {
						data[i] = 255 * MinAlpha;
					}
					break;
				case 'B':
					if (i % 3 === 2) {
						data[i] = 255 * MinAlpha;
					}
					break;
				default:
					console.log("do not support such channel type.");
			}
		}

		let dataTex = new THREE.DataTexture(data, this.width, this.height, THREE.RGBFormat);
		this.dataTexture = dataTex;

		dataTex.magFilter = THREE.NearestFilter;
		dataTex.needsUpdate = true;

		let boxGeometry = new THREE.BoxGeometry(this.actualWidth, this.actualDepth, this.actualHeight);

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

		cube.position.set(this.center.x, this.center.y, this.center.z);
		cube.hoverable = true;

		this.channelMap = cube;

	},

	updateVis: function(colors) {

		for (let i = 0; i < colors.length; i++) {
			switch (this.type) {
				case 'R':
					this.dataArray[3 * i] = colors[i] * 255;
					break;
				case 'G':
					this.dataArray[3 * i + 1] = colors[i] * 255;
					break;
				case 'B':
					this.dataArray[3 * i + 2] = colors[i] * 255;
					break;
				default:
					console.error("do not support such channel type.");
			}
		}

		this.dataTexture.needsUpdate = true;

	},

	getElement: function() {
		return this.channelMap;
	},

	clear: function() {

		for (let i = 0; i < this.dataArray.length; i++) {

			switch (this.type) {
				case 'R':
					if (i % 3 === 0) {
						this.dataArray[i] = 255 * MinAlpha;
					}
					break;
				case 'G':
					if (i % 3 === 1) {
						this.dataArray[i] = 255 * MinAlpha;
					}
					break;
				case 'B':
					if (i % 3 === 2) {
						this.dataArray[i] = 255 * MinAlpha;
					}
					break;
				default:
					console.error("do not support such channel type.");
			}
		}

		this.dataTexture.needsUpdate = true;

	},

	updatePos: function(pos) {

		this.center.x = pos.x;
		this.center.y = pos.y;
		this.center.z = pos.z;
		this.channelMap.position.set(pos.x, pos.y, pos.z);

	},

	setLayerIndex: function(layerIndex) {
		this.channelMap.layerIndex = layerIndex;
	}
};

export { ChannelMap };