function InputDepth3Object(width, height, initCenter, color) {

	this.width = width;
	this.height = height;
	this.fmCenter = {
		x: initCenter.x,
		y: initCenter.y,
		z: initCenter.z
	};

	this.neuralLength = 3 * width * height;

	this.dataArray = undefined;
	this.dataTexture = undefined;

	this.featureMap = undefined;

	this.init();

}

InputDepth3Object.prototype = {

	initFeatureMap: function() {

	},

	getMapElement: function() {
		return this.featureMap;
	},

	updateVis: function() {

	},

	clear: function(){

	}

};

export { InputDepth3Object };