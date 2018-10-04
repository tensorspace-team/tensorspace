function BoundingBox() {

	this.leftBoundary = undefined;
	this.rightBoundary = undefined;

}

BoundingBox.prototype = {

	getBoxWidth: function() {

		return this.rightBoundary - this.leftBoundary;

	}

};

export { BoundingBox };