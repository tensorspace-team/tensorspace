import {AddStrategy3d} from "./AddStrategy3d";

let StrategyFactory = (function() {

	function getOperationStrategy(operator, dimension, mergedElements) {

		if (dimension === 3) {

			if (operator === "add") {
				return new AddStrategy3d(mergedElements);
			}

		}

	}

	return {

		getOperationStrategy: getOperationStrategy

	}

})();

export { StrategyFactory };