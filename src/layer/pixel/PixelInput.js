/**
 * @author syt123450 / https://github.com/syt123450
 */

import { PixelLayer } from './PixelLayer';
import { NeuralBoxLength } from "../../utils/Constant";
import { DefaultMinAlpha } from "../../utils/Constant";
import { ColorUtils } from '../../utils/ColorUtils';

function PixelInput(config) {

	PixelLayer.call(this, config);

	this.shape = config.shape;
	this.width = config.shape[0];
	this.height = config.shape[1];
	this.depth = config.shape[2];
	this.neuralNum = config.shape[0] * config.shape[1];
	this.outputShape = config.shape;
	this.layerType = "input";

}

PixelInput.prototype = Object.assign( Object.create( PixelLayer.prototype ), {

	init: function(center) {

		this.center = center;

		let initX = - this.width / 2;
		let initY = - this.height / 2;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {

				let geometry = new THREE.BoxGeometry(1, 1, 1);
				let material = new THREE.MeshBasicMaterial({
					color: new THREE.Color( DefaultMinAlpha, DefaultMinAlpha, DefaultMinAlpha ),
					vertexColors: THREE.VertexColors,
					flatShading: true,
					transparent: true
				});

				let cube = new THREE.Mesh(geometry, material);

				this.neuralList.push(cube);

				cube.position.set(NeuralBoxLength * (j + initX), 0, NeuralBoxLength * (i + initY));

				this.neuralGroup.add(cube);

			}
		}

		this.scene.add(this.neuralGroup);

	},

	getHeightLightParameters: function() {

	},

	assemble: function(layerIndex) {
		console.log("Assemble input layer");

		this.layerIndex = layerIndex;
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

export { PixelInput };