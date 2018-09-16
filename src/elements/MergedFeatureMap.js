import { BasicMaterialOpacity } from "../utils/Constant";
import { colorUtils } from "../utils/ColorUtils";
import { TextHelper } from "../utils/TextHelper";
import { TextFont } from "../assets/fonts/TextFont";
import { RenderPreprocessor } from "../utils/RenderPreprocessor";
import { TextureProvider } from "../utils/TextureProvider";

function MergedFeatureMap(operator, width, height, actualWidth, actualHeight, initCenter, color) {

	this.operator = operator;

	this.fmWidth = width;
	this.fmHeight = height;

	this.actualWidth = actualWidth;
	this.actualHeight = actualHeight;
	this.color = color;

	this.neuralLength = width * height;

	this.unitLength = this.actualWidth / this.fmWidth;

	this.fmCenter = {
		x: initCenter.x,
		y: initCenter.y,
		z: initCenter.z
	};

	this.dataArray = undefined;
	this.dataTexture = undefined;
	this.featureMap = undefined;
	this.featureGroup = undefined;

	this.font = TextFont;

	this.textSize = TextHelper.calcFmTextSize(this.actualWidth);

	this.widthText = undefined;
	this.heightText = undefined;

	this.dataMaterial = undefined;
	this.clearMaterial = undefined;

	this.init();

}

MergedFeatureMap.prototype = {

	init: function() {

		let amount = this.fmWidth * this.fmHeight;
		let data = new Uint8Array(amount);
		this.dataArray = data;

		let dataTex = new THREE.DataTexture(data, this.fmWidth, this.fmHeight, THREE.LuminanceFormat, THREE.UnsignedByteType);
		this.dataTexture = dataTex;

		dataTex.magFilter = THREE.NearestFilter;
		dataTex.needsUpdate = true;

		let boxGeometry = new THREE.BoxBufferGeometry(this.actualWidth, this.unitLength, this.actualHeight);

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

		this.dataMaterial = materials;

		let operatorTexture = new THREE.TextureLoader().load( TextureProvider.getTexture(this.operator) );
		let operatorMaterial = new THREE.MeshBasicMaterial( { color: this.color, alphaMap: operatorTexture, transparent: true} );

		let clearMaterial = [
			basicMaterial,
			basicMaterial,
			operatorMaterial,
			operatorMaterial,
			basicMaterial,
			basicMaterial
		];

		this.clearMaterial = clearMaterial;

		let cube = new THREE.Mesh(boxGeometry, materials);
		cube.elementType = "featureMap";
		cube.hoverable = true;

		this.featureMap = cube;

		let featureGroup = new THREE.Object3D();
		featureGroup.position.set(this.fmCenter.x, this.fmCenter.y, this.fmCenter.z);
		featureGroup.add(cube);
		this.featureGroup = featureGroup;

		this.clear();

	},

	getElement: function() {
		return this.featureGroup;
	},

	updateVis: function(colors) {

		let renderColor = RenderPreprocessor.preProcessFmColor(colors, this.fmWidth, this.fmHeight);
		for (let i = 0; i < renderColor.length; i++) {
			this.dataArray[i] = renderColor[i] * 255;
		}
		this.dataTexture.needsUpdate = true;

		this.featureMap.material = this.dataMaterial;

	},

	updatePos: function(pos) {

		this.fmCenter.x = pos.x;
		this.fmCenter.y = pos.y;
		this.fmCenter.z = pos.z;
		this.featureGroup.position.set(pos.x, pos.y, pos.z);

	},

	clear: function() {

		let zeroValue = new Int8Array(this.neuralLength);

		let colors = colorUtils.getAdjustValues(zeroValue);

		this.updateVis(colors);

		this.featureMap.material = this.clearMaterial;

	},

	setLayerIndex: function(layerIndex) {
		this.featureMap.layerIndex = layerIndex;
	},

	setFmIndex: function(fmIndex) {
		this.featureMap.fmIndex = fmIndex;
	},

	showText: function() {

		let widthInString = this.fmWidth.toString();
		let heightInString = this.fmHeight.toString();

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
			this.actualHeight,
			{
				x: this.featureMap.position.x,
				y: this.featureMap.position.y,
				z: this.featureMap.position.z
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
			this.actualWidth,
			{
				x: this.featureMap.position.x,
				y: this.featureMap.position.y,
				z: this.featureMap.position.z
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

		this.featureGroup.add(this.widthText);
		this.featureGroup.add(this.heightText);
		this.isTextShown = true;

	},

	hideText: function() {

		this.featureGroup.remove(this.widthText);
		this.featureGroup.remove(this.heightText);
		this.widthText = undefined;
		this.heightText = undefined;

		this.isTextShown = false;

	}

};

export { MergedFeatureMap };