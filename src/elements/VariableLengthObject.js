/**
 * @author syt123450 / https://github.com/syt123450
 */

import { BasicMaterialOpacity } from "../utils/Constant";

function VariableLengthObject(width, height, depth, color) {

	this.width = width;
	this.height = height;
	this.depth = depth;

	this.color = color;

	this.element = undefined;

	this.init();
}

VariableLengthObject.prototype = {

	init: function() {

		let geometry = new THREE.BoxBufferGeometry(this.width, this.depth, this.height);
		let material = new THREE.MeshBasicMaterial({
			color: this.color, opacity: BasicMaterialOpacity, transparent: true
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