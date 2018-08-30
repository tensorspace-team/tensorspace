function Placeholder(width, height, depth, color) {

	this.width = width;
	this.height = height;
	this.depth = depth;

	this.color = color;

	this.placeholder = undefined;
	this.edgesLine = undefined;

	this.init();

}

Placeholder.prototype = {

	init: function() {
		let geometry = new THREE.BoxGeometry(this.width, this.depth, this.height);
		let material = new THREE.MeshBasicMaterial({
			color: this.color, opacity: 0.3, transparent: true
		});

		let layerPlaceHolder = new THREE.Mesh(geometry, material);

		layerPlaceHolder.position.set(0, 0, 0);

		this.placeholder = layerPlaceHolder;

		let edges = new THREE.EdgesGeometry(geometry);
		let edgesLine = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
			color: 0xA5A5A5
		}));

		this.edgesLine = edgesLine;
	},

	getPlaceholder: function() {
		return this.placeholder;
	},

	getEdges: function() {
		return this.edgesLine;
	}

};

export { Placeholder };