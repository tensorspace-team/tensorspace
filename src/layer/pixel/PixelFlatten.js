import { MinAlpha } from "../../utils/Constant";
import { NeuralBoxLength } from "../../utils/Constant";
import { colorUtils } from '../../utils/ColorUtils';
import { PixelLayer } from './PixelLayer';

function PixelFlatten() {

	PixelLayer.call(this, config);

	this.length = undefined;
	this.depth = 1;

}

PixelFlatten.prototype = Object.assign( Object.create( PixelLayer.prototype ), {

	init: function(center) {

		this.center = center;

		let geometry = new THREE.BoxGeometry(1, 1, 1);
		let material = new THREE.MeshBasicMaterial({
			color: new THREE.Color( MinAlpha, MinAlpha, MinAlpha ),
			vertexColors: THREE.VertexColors,
			flatShading: true,
			transparent: true
		});

		let initX = - this.length / 2;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		for (let i = 0; i < this.length; i++) {

			let cube = new THREE.Mesh(geometry, material);

			this.neuralList.push(cube);

			cube.position.set(NeuralBoxLength * (i + initX), 0, 0);

			this.neuralGroup.add(cube);
		}

		this.scene.add(this.neuralGroup);

	},

	assemble: function(layerIndex) {

		this.layerIndex = layerIndex;

		this.inputShape = this.lastLayer.outputShape;
		this.length = this.lastLayer.outputShape[0] * this.lastLayer.outputShape[1] * this.lastLayer.outputShape[2];
		this.outputShape = [this.length, 1, 1];

	},

	calculateRelativeIndex: function (positionIndex) {

		let neuralIndexList = [];

		neuralIndexList.push(positionIndex);

		return neuralIndexList;
	},

	updateValue: function(value) {
		this.neuralValue = value;

		let colorList = colorUtils.getColors(value);

		for (let i = 0; i < colorList.length; i++) {

			let colorTriple = colorList[i];
			this.neuralList[i].material.color.setRGB(colorTriple[0], colorTriple[1], colorTriple[2]);

		}
	}

} );

export { PixelFlatten };