import { Layer } from "./Layer";

function UpSampling2d(config) {

	Layer.call(this, config);

	console.log("construct upSampling layer");

	this.size = config.size;
	this.width = undefined;
	this.height = undefined;

	this.fmCenters = [];
	this.openFmCenters = [];
	this.closeFmCenters = [];




}

UpSampling2d.prototype = Object.assign(Object.create(Layer.prototype), {

	init: function() {

	},

	assemble: function() {

	},

	updateValue: function() {

	},

	initAggregationElement: function() {

	},

	disposeAggregationElement: function() {

	},

	initSegregationElements: function() {

	},

	disposeSegregationElements: function() {

	},

	updateAggregationVis: function() {

	},

	updateSegregationVis: function() {

	},

	getRelativeElements: function() {

	},

	handleClick: function() {

	},

	handleHoverIn: function() {

	},

	handleHoverOut: function() {

	},

	showText: function() {

	},

	hideText: function() {

	},

	openLayer: function() {



	},

	closeLayer: function() {

	}

});
