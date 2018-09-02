function LineHook(initPos) {

	this.initPos = {
		x: initPos.x,
		y: initPos.y,
		z: initPos.z
	};

	this.pos = {
		x: initPos.x,
		y: initPos.y,
		z: initPos.z
	};

	this.hookElement = undefined;

	this.init();

}

LineHook.prototype = {

	init: function() {

		let geometry = new THREE.BoxGeometry(1, 1, 1);
		let material = new THREE.MeshBasicMaterial({
			color: 0x000000, opacity: 0, transparent: true
		});

		let hook = new THREE.Mesh(geometry, material);

		hook.position.set(0, 0, 0);
		hook.elementType = "hook";

		this.hookElement = hook;

	},

	reset: function() {

		this.pos = {
			x: this.initPos.x,
			y: this.initPos.y,
			z: this.initPos.z
		};

		this.updateElementPos();

	},

	setPos: function(pos) {

		this.pos = {
			x: pos.x,
			y: pos.y,
			z: pos.z
		};

		this.updateElementPos();

	},

	getElement: function() {
		return this.hookElement;
	},

	updateElementPos: function() {
		this.hookElement.position.set(
			this.pos.x,
			this.pos.y,
			this.pos.z
		);
	},

	updateHorizonPos: function(x) {
		this.pos.x = x;
		this.updateElementPos();
	}

};

export { LineHook }