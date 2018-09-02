function LineGroupGeometry(lineVertices, lineColors) {

	this.lineVertices = lineVertices;
	this.lineColors = lineColors;

	this.geometry = undefined;

	this.init();
}

LineGroupGeometry.prototype = {

	init: function() {

		let geometry = new THREE.Geometry();
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