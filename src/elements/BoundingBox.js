/**
 * @author syt123450 / https://github.com/syt123450
 */

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