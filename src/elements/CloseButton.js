import { MinAlpha } from "../utils/Constant";

function CloseButton(size, position, color) {

	this.size = size;

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
		let geometry = new THREE.SphereBufferGeometry( this.size, 32, 32 );
		let material = new THREE.MeshBasicMaterial({
			color: this.color,
			opacity: MinAlpha,
			transparent: true
		});

		let button = new THREE.Mesh(geometry, material);

		button.position.set(this.position.x, this.position.y, this.position.z);
		button.clickable = true;
		button.hoverable = true;
		button.elementType = "closeButton";

		this.button = button;
	},

	getElement: function() {
		return this.button;
	},

	setLayerIndex: function(layerIndex) {
		this.button.layerIndex = layerIndex;
	}

};

export { CloseButton };