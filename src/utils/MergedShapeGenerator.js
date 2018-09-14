let MergedShapeGenerator = (function() {

	function getAddShape(mergedElements) {

		return mergedElements[0].outputShape;

	}

	function getShape(operator, mergedElements) {

		if (operator === "add") {
			return getAddShape(mergedElements);
		}

	}

	return {

		getShape: getShape

	}

})();

export { MergedShapeGenerator };