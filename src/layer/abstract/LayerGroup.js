function LayerGroup() {

	this.isGroup = true;
	this.thickness = undefined;

	this.members = [];

	this.createMembers();

}

LayerGroup.prototype = {

	createMembers: function() {



	},

	init: function() {

	},

	assemble: function() {

	},

	loadModelConfig: function() {

	},

	clear: function() {

	},

	updateValue: function() {

	},

	setEnvironment: function(scene) {
		this.scene = scene;

	},

	setLastLayer: function() {

	}

};

export { LayerGroup };