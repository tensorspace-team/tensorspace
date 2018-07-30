import Layer from './Layer';

function Input(config) {

	Layer.call(this, config);

	this.shape = config.shape;
	this.width = config.shape[0];
	this.height = config.shape[1];
	this.depth = config.shape[2];
	this.neuralNum = config.shape[0] * config.shape[1];
	this.outputShape = config.shape;
	this.layerType = "input";

}

Input.prototype = Object.assign( Object.create( Layer.prototype ), {

	init: function(center, layerIndex) {

		this.center = center;
		this.layerIndex = layerIndex;

		let initX = - this.width / 2;
		let initY = - this.height / 2;

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {

				let geometry = new THREE.BoxGeometry(1, 1, 1);
				let material = new THREE.MeshBasicMaterial({
					color: 0xffffff,
					shading: THREE.FlatShading,
					vertexColors: THREE.VertexColors,
					transparent: true
				});

				let cube = new THREE.Mesh(geometry, material);

				this.neuralList.push(cube);

				cube.position.set(1.3 * (i + initX), 0, 1.3 * (j + initY));

				this.neuralGroup.add(cube);

			}
		}

		this.scene.add(this.neuralGroup);

	},

	getHeightLightParameters: function() {

	},

	assemble: function(layerIndex) {
		console.log("Assemble input layer");
	}

} );

export default Input;