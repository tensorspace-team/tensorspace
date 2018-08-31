function MapAggregation(width, height, depth, color) {

	this.width = width;
	this.height = height;
	this.depth = depth;

	this.color = color;

	this.aggregationElement = undefined;
	this.aggregationEdges = undefined;

	this.init();

}

MapAggregation.prototype = {

	init: function() {
		let geometry = new THREE.BoxGeometry(this.width, this.depth, this.height);
		let material = new THREE.MeshBasicMaterial({
			color: this.color, opacity: 0.3, transparent: true
		});

		let layerPlaceHolder = new THREE.Mesh(geometry, material);

		layerPlaceHolder.position.set(0, 0, 0);

		this.aggregationElement = layerPlaceHolder;

		let edges = new THREE.EdgesGeometry(geometry);
		let edgesLine = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
			color: 0xA5A5A5
		}));

		this.aggregationEdges = edgesLine;
	},

	getPlaceholder: function() {
		return this.aggregationElement;
	},

	getEdges: function() {
		return this.aggregationEdges;
	}

};

export { MapAggregation };