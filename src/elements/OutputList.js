import { MinAlpha } from "../utils/Constant";
import { colorUtils } from "../utils/ColorUtils";
import { TextFont } from "../fonts/TextFont";
import { TextHelper } from "../utils/TextHelper";

function OutputList(length, actualSize, outputs, initPositions, color) {

	this.length = length;
	this.actualSize = actualSize;
	this.outputs = outputs;

	this.color = color;

	this.initPositions = [];
	this.positions = [];

	this.font = TextFont;

	for (let i = 0; i < initPositions.length; i++) {

		let initPos = {
			x: initPositions[i].x,
			y: initPositions[i].y,
			z: initPositions[i].z
		};
		let pos = {
			x: initPositions[i].x,
			y: initPositions[i].y,
			z: initPositions[i].z
		};
		this.initPositions.push(initPos);
		this.positions.push(pos);

	}

	this.textSize = TextHelper.calculateOutputTextSize(actualSize);

	this.outputNeuralList = [];
	this.outputGroup = undefined;

	this.init();

}

OutputList.prototype = {

	init: function() {

		let boxGeometry = new THREE.BoxGeometry(this.actualSize, this.actualSize, this.actualSize);

		let outputGroup = new THREE.Group();
		outputGroup.position.set(0, 0, 0);

		for (let i = 0; i < this.length; i++) {
			let material = new THREE.MeshBasicMaterial({
				color: this.color,
				transparent: true,
				opacity: MinAlpha
			});

			let cube = THREE.Mesh(boxGeometry, material);
			cube.elementType = "resultNeural";
			cube.outputIndex = i;

			cube.position.set(
				this.initPositions[i].x,
				this.initPositions[i].y,
				this.initPositions[i].z
			);

			this.outputNeuralList.push(cube);
			outputGroup.add(cube);
		}

	},

	getElement: function() {
		return this.outputGroup;
	},

	updateVis: function(colors) {

		for (let i = 0; i < colors.length; i++) {

			this.outputNeuralList[i].material.opacity = colors[i];
			this.outputNeuralList[i].material.needsUpdate = true;

		}

	},

	showTextResult: function(selectedOutputNeural) {

		let resultIndex = selectedOutputNeural.outputIndex;

		let geometry = new THREE.TextGeometry( this.outputs[resultIndex], {
			font: this.font,
			size: this.textSize,
			height: 1,
			curveSegments: 8,
		} );

		let text = new THREE.Mesh(geometry, material);

		let textPos = TextHelper.calculateOutputTextPos(
			this.outputs[resultIndex].length,
			this.textSize,
			this.actualSize,
			{
				x: this.outputNeuralList[resultIndex].position.x,
				y: this.outputNeuralList[resultIndex].position.y,
				z: this.outputNeuralList[resultIndex].position.z
			}
		);

		text.position.set(
			textPos.x,
			textPos.y,
			textPos.z
		);

		this.outputGroup.add(text);


	},

	clear: function() {

		let zeroValue = new Uint8Array(this.length);
		let colors = colorUtils.getAdjustValues(zeroValue);

		this.updateVis(colors);

	},

	setLayerIndex: function(layerIndex) {
		for (let i = 0; i < this.outputNeuralList.length; i++) {
			this.outputNeuralList[i].layerIndex = layerIndex;
		}
	}


};

export { OutputList }