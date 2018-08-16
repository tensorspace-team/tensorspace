import AbstractComposite from './AbstractComposite';

function MapSequential(container) {

	AbstractComposite.call(this, container);

}

MapSequential.prototype = Object.assign(Object.create(MapSequential), {

	add: function(layer) {

		if (this.layers.length !== 0) {

			let tailLayer = this.layers[this.layers.length - 1];
			layer.setLastLayer(tailLayer);
			tailLayer.setNextLayer(layer);
		}

		layer.setEnvironment(this.scene);
		this.layers.push(layer);
		layer.assemble(this.layers.length);

	},

	init: function() {

	},

	predict: function() {

	},



});

export default MapSequential;