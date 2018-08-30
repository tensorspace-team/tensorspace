function CloseButton(position, color) {

	this.position = {
		x: position.x,
		y: position.y,
		z: position.z
	};

	this.color = color;

	this.button = undefined;

	this.init();

}

CloseButton.prototype = {

	init: function() {
		let geometry = new THREE.SphereGeometry( 3, 32, 32 );
		let material = new THREE.MeshBasicMaterial({
			color: this.color,
			opacity: 0.3,
			transparent: true
		});

		let button = new THREE.Mesh(geometry, material);

		button.position.set(this.position.x, this.position.y, this.position.z);

		button.elementType = "closeButton";

		this.button = button;
	},

	getButton: function() {
		return this.button;
	}

};

export { CloseButton };