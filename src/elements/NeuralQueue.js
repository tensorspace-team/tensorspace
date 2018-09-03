import { MinAlpha } from "../utils/Constant";
import { BasicMaterialOpacity } from "../utils/Constant";
import { colorUtils } from "../utils/ColorUtils";
import { TextFont } from "../fonts/TextFont";
import { TextHelper } from "../utils/TextHelper";

function NeuralQueue(length, actualWidth, actualHeight, color) {

	this.queueLength = length;
	this.actualWidth = actualWidth;
	this.actualHeight = actualHeight;
	this.color = color;

	this.dataArray = undefined;
	this.dataTexture = undefined;
	this.queue = undefined;

	this.queueGroup = undefined;

	this.unitLength = this.actualWidth / this.queueLength;

	this.font = TextFont;
	this.textSize = TextHelper.calcQueueTextSize(this.unitLength);

	this.lengthText = undefined;

	this.init();
}

NeuralQueue.prototype = {

	init: function() {

		let data = new Uint8Array(this.queueLength);
		this.dataArray = data;

		for (let i = 0; i < this.queueLength; i++) {
			data[i] = 255 * MinAlpha;
		}

		let dataTex = new THREE.DataTexture(data, this.queueLength, 1, THREE.LuminanceFormat, THREE.UnsignedByteType);
		this.dataTexture = dataTex;

		dataTex.magFilter = THREE.NearestFilter;
		dataTex.needsUpdate = true;

		let boxGeometry = new THREE.BoxGeometry(this.actualWidth, this.unitLength, this.unitLength);

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
		cube.elementType = "featureLine";
		cube.hoverable = true;

		this.queue = cube;

		let queueGroup = new THREE.Object3D();
		queueGroup.add(this.queue);
		this.queueGroup = queueGroup;

	},

	getElement: function() {

		return this.queueGroup;

	},

	updateVis: function(colors) {

		for (let i = 0; i < colors.length; i++) {
			this.dataArray[i] = 255 * colors[i];
		}

		this.dataTexture.needsUpdate = true;

	},

	clear: function() {

		let zeroData = new Uint8Array(this.queueLength);
		let colors = colorUtils.getAdjustValues(zeroData);

		this.updateVis(colors);

	},

	setLayerIndex: function(layerIndex) {
		this.queue.layerIndex = layerIndex;
	},

	showTextResult: function() {

		let lengthTextContent = this.queueLength.toString();

		let geometry = new THREE.TextGeometry( lengthTextContent, {
			font: this.font,
			size: this.textSize,
			height: 1,
			curveSegments: 8,
		} );

		let material = new THREE.MeshBasicMaterial( { color: this.color } );

		let text = new THREE.Mesh(geometry, material);

		let textPos = TextHelper.calcQueueTextPos(
			lengthTextContent.length,
			this.textSize,
			this.unitLength,
			{
				x: this.queue.position.x,
				y: this.queue.position.y,
				z: this.queue.position.z
			}
		);

		text.position.set(
			textPos.x,
			textPos.y,
			textPos.z
		);

		this.lengthText = text;

		this.queueGroup.add(this.lengthText);
		this.isTextShown = true;

	},

	hideTextResult: function() {

		this.queueGroup.remove(this.lengthText);
		this.lengthText = undefined;
		this.isTextShown = false;

	}

};

export { NeuralQueue };