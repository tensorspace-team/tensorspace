import { MinAlpha } from "../utils/Constant";
import { BasicMaterialOpacity } from "../utils/Constant";
import { colorUtils } from "../utils/ColorUtils";
import { TextHelper } from "../utils/TextHelper";
import { TextFont } from "../fonts/TextFont";
import {RenderPreprocessor} from "../utils/RenderPreprocessor";

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

	this.unitLength = this.actualWidth / this.width;

	this.font = TextFont;
	this.textSize = TextHelper.calcFmTextSize(this.actualWidth);

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

	this.paddingMap = undefined;
	this.widthText = undefined;
	this.heightText = undefined;

	this.paddingGroup = undefined;

	this.isTextShown = false;

	this.init();

}

PaddingMap.prototype = Object.assign(Object.create(PaddingMap.prototype), {

	init: function() {

		let paddingGroup = new THREE.Object3D();

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
		cube.hoverable = true;
		cube.elementType = "paddingMap";

		this.paddingMap = cube;

		this.paddingGroup = paddingGroup;
		this.paddingGroup.position.set(this.center.x, this.center.y, this.center.z);
		this.paddingGroup.add(this.paddingMap);

	},

	getElement: function() {
		return this.paddingGroup;
	},

	updateVis: function(colors) {

		let renderColor = RenderPreprocessor.preProcessPaddingColor(colors, this.contentWidth, this.contentHeight);

		for (let i = 0; i < this.height; i++) {

			for (let j = 0; j < this.width; j++) {

				if (!this.isPadding(j, i)) {

					let correspondingIndex = this.contentWidth * ( i - this.paddingTop) + ( j - this.paddingLeft );
					this.dataArray[this.width * i + j] = 255 * renderColor[correspondingIndex];

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
		this.paddingGroup.position.set(pos.x, pos.y, pos.z);

	},

	clear: function() {
		let zeroData = new Uint8Array(this.neuralLength);
		let colors = colorUtils.getAdjustValues(zeroData);

		this.updateVis(colors);
	},

	setLayerIndex: function(layerIndex) {
		this.paddingMap.layerIndex = layerIndex;
	},

	setFmIndex: function(fmIndex) {
		this.paddingMap.fmIndex = fmIndex;
	},

	showText: function() {

		let widthInString = this.width.toString();
		let heightInString = this.height.toString();

		let material = new THREE.MeshBasicMaterial( { color: this.color } );

		let widthGeometry = new THREE.TextGeometry( widthInString, {
			font: this.font,
			size: this.textSize,
			height: Math.min(this.unitLength, 1),
			curveSegments: 8,
		} );

		let widthText = new THREE.Mesh(widthGeometry, material);

		let widthTextPos = TextHelper.calcFmWidthTextPos(
			widthInString.length,
			this.textSize,
			this.actualWidth,
			{
				x: this.paddingMap.position.x,
				y: this.paddingMap.position.y,
				z: this.paddingMap.position.z
			}
		);

		widthText.position.set(
			widthTextPos.x,
			widthTextPos.y,
			widthTextPos.z
		);

		widthText.rotateX( - Math.PI / 2 );

		let heightGeometry = new THREE.TextGeometry( heightInString, {
			font: this.font,
			size: this.textSize,
			height: Math.min(this.unitLength, 1),
			curveSegments: 8,
		} );

		let heightText = new THREE.Mesh(heightGeometry, material);

		let heightTextPos = TextHelper.calcFmHeightTextPos(
			heightInString.length,
			this.textSize,
			this.actualHeight,
			{
				x: this.paddingMap.position.x,
				y: this.paddingMap.position.y,
				z: this.paddingMap.position.z
			}
		);

		heightText.position.set(
			heightTextPos.x,
			heightTextPos.y,
			heightTextPos.z
		);

		heightText.rotateX( - Math.PI / 2 );

		this.widthText = widthText;
		this.heightText = heightText;

		this.paddingGroup.add(this.widthText);
		this.paddingGroup.add(this.heightText);
		this.isTextShown = true;

	},

	hideText: function() {

		this.paddingGroup.remove(this.widthText);
		this.paddingGroup.remove(this.heightText);
		this.widthText = undefined;
		this.heightText = undefined;

		this.isTextShown = false;

	}

});

export { PaddingMap };