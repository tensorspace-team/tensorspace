import { MinAlpha } from "../utils/Constant";
import { colorUtils } from "../utils/ColorUtils";
import { TextFont } from "../fonts/TextFont";
import { TextHelper } from "../utils/TextHelper";

function OutputUnit(cubeSize, textSize, output, initPositions, color) {

	this.cubeSize = cubeSize;
	this.textSize = textSize;
	this.output = output;

	this.color = color;

	this.initPosition = {
		x: initPositions.x,
		y: initPositions.y,
		z: initPositions.z
	};
	this.position = {
		x: initPositions.x,
		y: initPositions.y,
		z: initPositions.z
	};

	this.isTextShown = false;

	this.font = TextFont;

	this.outputText = undefined;
	this.outputNeural = undefined;
	this.outputGroup = undefined;

	this.init();

}

OutputUnit.prototype = {

	init: function() {

		let outputGroup = new THREE.Object3D();
		outputGroup.position.set(0, 0, 0);

		let boxGeometry = new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize);

		let material = new THREE.MeshBasicMaterial({
			color: this.color,
			opacity: MinAlpha,
			transparent: true,
		});

		let cube = new THREE.Mesh(boxGeometry, material);
		cube.elementType = "outputNeural";

		cube.position.set(
			this.initPosition.x,
			this.initPosition.y,
			this.initPosition.z
		);

		this.outputNeural = cube;

		outputGroup.add(cube);
		this.outputGroup = outputGroup;

	},

	getElement: function() {
		return this.outputGroup;
	},

	updateVis: function(color) {

		this.outputNeural.material.opacity = color;
		this.outputNeural.material.needsUpdate = true;

	},

	showTextResult: function() {

		let geometry = new THREE.TextGeometry( this.output, {
			font: this.font,
			size: this.textSize,
			height: 1,
			curveSegments: 8,
		} );

		let material = new THREE.MeshBasicMaterial( { color: this.color } );

		let text = new THREE.Mesh(geometry, material);

		let textPos = TextHelper.calcOutputTextPos(
			this.output.length,
			this.textSize,
			this.cubeSize,
			{
				x: this.outputNeural.position.x,
				y: this.outputNeural.position.y,
				z: this.outputNeural.position.z
			}
		);

		text.position.set(
			textPos.x,
			textPos.y,
			textPos.z
		);

		this.outputText = text;

		this.outputGroup.add(text);
		this.isTextShown = true;

	},

	hideTextResult: function() {

		console.log("hide text for index " + this.outputNeural.outputIndex);

		this.outputGroup.remove(this.outputText);
		this.outputText = undefined;
		this.isTextShown = false;

	},

	clear: function() {

		let colors = colorUtils.getAdjustValues([0]);

		this.updateVis(colors);

		if (this.outputText !== undefined) {
			this.hideTextResult();
		}

	},

	setLayerIndex: function(layerIndex) {
		this.outputNeural.layerIndex = layerIndex;
	},

	setOutputIndex: function(outputIndex) {
		this.outputNeural.outputIndex = outputIndex;
	},

	isSelected: function() {
		return this.isTextShown;
	},

	updatePos: function(pos) {

		this.position.x = pos.x;
		this.position.y = pos.y;
		this.position.z = pos.z;
		this.outputGroup.position.set(pos.x, pos.y, pos.z);

	}

};

export { OutputUnit }