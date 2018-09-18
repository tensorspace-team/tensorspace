/**
 * @author syt123450 / https://github.com/syt123450
 */

let OutputExtractor = (function() {

	function getMaxConfidenceIndex(values) {

		let index = 0;
		let maxValue = 0;

		for (let i = 0; i < values.length; i++) {

			if (values[i] >= maxValue) {
				index = i;
				maxValue = values[i];
			}

		}

		return index;
	}

	return {

		getMaxConfidenceIndex: getMaxConfidenceIndex

	}

})();

export { OutputExtractor };