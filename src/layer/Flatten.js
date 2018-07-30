import Layer from './Layer';

function Flatten() {

	Layer.call(this, config);

	this.length = undefined;

}

Flatten.prototype = Object.assign( Object.create( Layer.prototype ), {

	init: function(center) {

		this.center = center;

		let geometry = new THREE.BoxGeometry(1, 1, 1);
		let material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			shading: THREE.FlatShading,
			vertexColors: THREE.VertexColors,
			transparent: true
		});

		let initX = - this.length / 2;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		for (let i = 0; i < this.length; i++) {

			let cube = new THREE.Mesh(geometry, material);

			this.neuralList.push(cube);

			cube.position.set(1.3 * (i + initX), 0, 0);

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
	}

} );

export default Flatten;