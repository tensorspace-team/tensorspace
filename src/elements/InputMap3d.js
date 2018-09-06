import { BasicMaterialOpacity } from "../utils/Constant";
import { MinAlpha } from "../utils/Constant";
import { TextFont } from "../fonts/TextFont";
import { TextHelper } from "../utils/TextHelper";
import {RenderPreprocessor} from "../utils/RenderPreprocessor";

function InputMap3d(width, height, actualWidth, actualHeight, actualDepth, initCenter, color) {

	this.width = width;
	this.height = height;
	this.depth = 3;
	this.actualWidth = actualWidth;
	this.actualHeight = actualHeight;
	this.actualDepth = actualDepth;

	this.unitLength = this.actualWidth / this.width;

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
	this.colorGroup = undefined;

	this.font = TextFont;
	this.textSize = TextHelper.calcFmTextSize(this.actualWidth);

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

		let boxGeometry = new THREE.BoxBufferGeometry(this.actualWidth, this.actualDepth, this.actualHeight);

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

		cube.elementType = "input3dElement";
		cube.clickable = true;
		cube.hoverable = true;

		this.colorMap = cube;

		let colorGroup = new THREE.Object3D();
		colorGroup.position.set(this.fmCenter.x, this.fmCenter.y, this.fmCenter.z);
		colorGroup.add(this.colorMap);

		this.colorGroup = colorGroup;

	},

	getElement: function() {
		return this.colorGroup;
	},

	updateVis: function(colors) {

		let renderData = RenderPreprocessor.preProcessInput3dColor(colors, this.width, this.height);

		for (let i = 0; i < this.dataArray.length; i++) {
			this.dataArray[i] = 255 * renderData[i];
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
				x: this.colorMap.position.x,
				y: this.colorMap.position.y,
				z: this.colorMap.position.z
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
				x: this.colorMap.position.x,
				y: this.colorMap.position.y,
				z: this.colorMap.position.z
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

		this.colorGroup.add(this.widthText);
		this.colorGroup.add(this.heightText);
		this.isTextShown = true;

	},

	hideText: function() {

		this.colorGroup.remove(this.widthText);
		this.colorGroup.remove(this.heightText);
		this.widthText = undefined;
		this.heightText = undefined;

		this.isTextShown = false;

	}

};

export { InputMap3d };