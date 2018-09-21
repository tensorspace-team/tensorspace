/**
 * @author syt123450 / https://github.com/syt123450
 */

function LineGroupGeometry( lineVertices, lineColors, minOpacity ) {

	this.lineVertices = lineVertices;
	this.lineColors = lineColors;
	this.minOpacity = minOpacity;

	this.geometry = undefined;

	this.init();

}

LineGroupGeometry.prototype = {

	init: function() {

		let geometry = new THREE.Geometry( {

			transparent:true,
			opacity: this.minOpacity

		} );

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