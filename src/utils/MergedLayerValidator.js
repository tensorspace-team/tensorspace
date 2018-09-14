let MergedLayerValidator = (function() {

	function validateAdd(mergedElements) {

		let inputShape;

		if (mergedElements.length > 0) {
			inputShape = mergedElements[0].outputShape;
		} else {
			console.error("Merge Layer missing elements.");
		}

		for (let i = 0; i < mergedElements.length; i++) {

			let outputShape = mergedElements[i].outputShape;

			for (let j = 0; j < inputShape.length; j++) {

				if (outputShape[j] !== inputShape[j]) {
					return false;
				}

			}

		}

		return true;

	}

	function validate(operator, mergedElements) {
		if (operator === "add") {
			return validateAdd(mergedElements);
		}
	}

	return {
		validate: validate
	}

})();

export { MergedLayerValidator };