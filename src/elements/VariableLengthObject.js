function VariableLengthObject(width, height, depth) {

	this.width = width;
	this.height = height;
	this.depth = depth;

	this.element = undefined;

	this.init();
}

VariableLengthObject.prototype = {

	init: function() {

		let geometry = new THREE.BoxGeometry(this.width, this.depth, this.height);
		let material = new THREE.MeshBasicMaterial({
			color: new THREE.Color( 1, 1, 1 )
		});

		let variableLengthObject = new THREE.Mesh(geometry, material);

		variableLengthObject.position.set(0, 0, 0);

		this.element = variableLengthObject;
	},

	getElement: function() {
		return this.element;
	}

};

export { VariableLengthObject };