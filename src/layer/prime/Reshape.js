import {Layer } from "./Layer";

function Reshape(config) {

	Layer.call(this, config);

}

Reshape.prototype = Object.assign(Object.create(Layer.prototype), {

	init: function() {

	},

	loadModelConfig: function() {

	},

	assemble: function() {

	},

	openLayer: function() {

	},

	closeLayer: function() {

	},

	initAggregationElement: function() {

	},

	disposeAggregationElement: function() {

	},

	initSegregationElements: function() {

	},

	disposeSegregationElements: function() {

	},

	updateValue: function() {

	},

	updateAggregationVis: function() {

	},

	updateSegregationVis: function() {

	},

	handleClick: function() {

	},

	handleHoverIn: function() {

	},

	handleHoverOut: function() {

	},

	getRelativeElements: function() {

	},

	showText: function() {

	},

	hideText: function() {

	}

});

export { Reshape };