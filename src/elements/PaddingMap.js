import { MinAlpha } from "../utils/Constant";

function PaddingMap(width, height, center, paddingWidth, paddingHeight) {

	this.width = width;
	this.height = height;
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

	this.dataArray = undefined;
	this.dataTexture = undefined;

	this.featureMap = undefined;

	this.initFeatureMap();

}

PaddingMap.prototype = Object.assign(Object.create(PaddingMap.prototype), {

	initFeatureMap: function() {

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

		let boxGeometry = new THREE.BoxGeometry(this.width, 1, this.height);

		// 这里设置color可以隐约显示颜色总体的感觉

		let material = new THREE.MeshBasicMaterial({ color: 0xffffff, alphaMap: dataTex, transparent: true });
		let basicMaterial = new THREE.MeshBasicMaterial({
			color: 0xffffff
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

	getMapElement: function() {
		return this.featureMap;
	},

	updateGrayScale: function(colors) {

		console.log("update");

		console.log(colors);

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

		console.log(this.dataArray);

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

	}

});

export default PaddingMap;