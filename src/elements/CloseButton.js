import { MinAlpha } from "../utils/Constant";
import { CloseData } from "../assets/image/CloseData";

function CloseButton(size, thickness, position, color) {

	this.size = size;
	this.thickness = thickness;

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

		let texture = new THREE.TextureLoader().load( CloseData );

		let materialSide = new THREE.MeshBasicMaterial( { color: this.color, opacity: MinAlpha, transparent: true } );
		let materialTop = new THREE.MeshBasicMaterial( { color: this.color, alphaMap: texture, transparent: true } );

		let materials = [];

		materials.push(materialSide);
		materials.push(materialTop);
		materials.push(materialTop);

		let geometry = new THREE.CylinderBufferGeometry( this.size, this.size, 2 * this.thickness, 32 );
		let cylinderButton = new THREE.Mesh( geometry, materials );

		cylinderButton.position.set(this.position.x, this.position.y, this.position.z);
		cylinderButton.clickable = true;
		cylinderButton.hoverable = true;
		cylinderButton.elementType = "closeButton";
		cylinderButton.rotateY(- Math.PI / 2);

		this.button = cylinderButton;
	},

	getElement: function() {
		return this.button;
	},

	setLayerIndex: function(layerIndex) {
		this.button.layerIndex = layerIndex;
	}

};

export { CloseButton };