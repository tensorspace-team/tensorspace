function NeuralQueue(length) {

	this.queueLength = length;

	this.queue = undefined;

	this.initNeuralQueue();
}

NeuralQueue.prototype = {

	initNeuralQueue: function() {

		let geometry = new THREE.BoxGeometry(this.queueLength, 1, 1, this.queueLength, 1, 1);
		let material = new THREE.MeshBasicMaterial({
			vertexColors: THREE.FaceColors
		});

		let cube = new THREE.Mesh(geometry, material);

		cube.position.set(0, 0, 0);

		this.queue = cube;

	},

	getQueueElement: function() {

		return this.queue;

	},

	updateGrayScale: function(greyPixelArray) {

		for ( let i = 0; i < greyPixelArray.length; i ++ ) {

			let rgb = greyPixelArray[i];

			this.queue.geometry.faces[ 2 * 2 + 2 * i ].color.setRGB( rgb[0], rgb[1], rgb[2] );
			this.queue.geometry.faces[ 2 * 2 + 2 * i + 1 ].color.setRGB( rgb[0], rgb[1], rgb[2] );
			this.queue.geometry.faces[ 2 * 2 + this.queueLength * 2 + 2 * i ].color.setRGB( rgb[0], rgb[1], rgb[2] );
			this.queue.geometry.faces[ 2 * 2 + this.queueLength * 2 + 2 * i + 1 ].color.setRGB( rgb[0], rgb[1], rgb[2] );
			this.queue.geometry.faces[ 2 * 2 + this.queueLength * 4 + 2 * i ].color.setRGB( rgb[0], rgb[1], rgb[2] );
			this.queue.geometry.faces[ 2 * 2 + this.queueLength * 4 + 2 * i + 1 ].color.setRGB( rgb[0], rgb[1], rgb[2] );
			this.queue.geometry.faces[ 2 * 2 + this.queueLength * 6 + 2 * i ].color.setRGB( rgb[0], rgb[1], rgb[2] );
			this.queue.geometry.faces[ 2 * 2 + this.queueLength * 6 + 2 * i + 1 ].color.setRGB( rgb[0], rgb[1], rgb[2] );
		}
		this.queue.geometry.colorsNeedUpdate = true;

	},

	updateRGBScale: function(rgbPixelArray) {

	}

};

export default NeuralQueue;