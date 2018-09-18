/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MinAlpha } from "../../utils/Constant";
import { NeuralBoxLength } from "../../utils/Constant";
import { ColorUtils } from '../../utils/ColorUtils';
import { PixelLayer } from './PixelLayer';

function PixelDense(config) {

	PixelLayer.call(this, config);

	this.units = config.units;
	this.depth = 1;

}

PixelDense.prototype = Object.assign( Object.create( PixelLayer.prototype ), {

	init: function(center) {

		this.center = center;

		let initX = - this.units / 2;

		let count = 0;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		for (let i = 0; i < this.units; i++) {

			let geometry = new THREE.BoxGeometry(1, 1, 1);
			let material = new THREE.MeshBasicMaterial({
				color: new THREE.Color( MinAlpha, MinAlpha, MinAlpha ),
				vertexColors: THREE.VertexColors,
				flatShading: true,
				transparent: true
			});

			let cube = new THREE.Mesh(geometry, material);

			this.neuralList.push(cube);

			cube.position.set(NeuralBoxLength * (i + initX), 0, 0);
			cube.elementType = "neural";
			cube.layerIndex = this.layerIndex;
			cube.positionIndex = count;
			count++;

			this.neuralGroup.add(cube);
		}

		this.scene.add(this.neuralGroup);
	},

	assemble: function(layerIndex) {

		this.layerIndex = layerIndex;

		this.outputShape = [this.units, 1, 1];

	},

	calculateRelativeIndex: function (positionIndex) {

		let neuralIndexList = [];

		for (let i = 0; i < this.lastLayer.neuralList.length; i++) {
			neuralIndexList.push(i);
		}

		return neuralIndexList;
	},

	updateValue: function(value) {
		this.neuralValue = value;

		let colorList = ColorUtils.getColors(value);

		for (let i = 0; i < colorList.length; i++) {

			let colorTriple = colorList[i];
			this.neuralList[i].material.color.setRGB(colorTriple[0], colorTriple[1], colorTriple[2]);

		}
	}

} );

export { PixelDense };