function PaddingQueue(length, actualLength, unitLength, padding, center, color) {

	this.length = length;
	this.actualLength = actualLength;
	this.unitLength = unitLength;
	this.padding = padding;
	this.paddingLeft = Math.floor(this.padding / 2);
	this.paddingRight = this.padding - this.paddingLeft;
	this.center = {
		x: center.x,
		y: center.y,
		z: center.z
	};
	this.color = color;

	this.dataArray = undefined;
	this.dataTexture = undefined;

	this.lengthText = undefined;

	this.queueElement = undefined;
	this.paddingGroup = undefined;

	this.init();

}

PaddingQueue.prototype = {

	init: function() {



	},

	getElement: function() {
		return this.paddingGroup;
	},

	setLayerIndex: function(layerIndex) {
		this.queueElement.layerIndex = layerIndex;
	},

	showText: function() {

	},

	hideText: function() {

	},

	setGridIndex: function(gridIndex) {
		this.queueElement.gridIndex = gridIndex;
	},

	updatePos: function(pos) {
		this.center.x = pos.x;
		this.center.y = pos.y;
		this.center.z = pos.z;
		this.paddingGroup.position.set(this.center.x, this.center.y, this.center.z);
	},

	updateVis: function(colors) {

	},

	clear: function() {

	},

	isPadding: function() {

	}

};

export { PaddingQueue };