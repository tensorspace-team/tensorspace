function MapPlaceholder(width, height, depth) {

	this.width = width;
	this.height = height;
	this.depth = depth;

	this.placeholder = undefined;

	this.init();

}

MapPlaceholder.prototype = {

	init: function() {
		let geometry = new THREE.BoxGeometry(this.width, this.depth, this.height);
		let material = new THREE.MeshBasicMaterial({
			color: new THREE.Color( 1, 1, 1 )
		});

		let layerPlaceHolder = new THREE.Mesh(geometry, material);

		layerPlaceHolder.position.set(0, 0, 0);

		this.placeholder = layerPlaceHolder;
	},

	getPlaceholder: function() {
		return this.placeholder;
	}

};

export { MapPlaceholder };