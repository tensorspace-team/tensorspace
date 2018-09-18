/**
 * @author syt123450 / https://github.com/syt123450
 */

import { BasicMaterialOpacity } from "../utils/Constant";

function LineGroupGeometry(lineVertices, lineColors) {

	this.lineVertices = lineVertices;
	this.lineColors = lineColors;

	this.geometry = undefined;

	this.init();
}

LineGroupGeometry.prototype = {

	init: function() {

		let geometry = new THREE.Geometry({
			transparent:true, opacity: BasicMaterialOpacity
		});
		geometry.colors = this.lineColors;
		geometry.vertices = this.lineVertices;
		geometry.colorsNeedUpdate = true;
		geometry.verticesNeedUpdate = true;

		this.geometry = geometry;

	},

	getElement: function() {
		return this.geometry;
	}

};

export { LineGroupGeometry };