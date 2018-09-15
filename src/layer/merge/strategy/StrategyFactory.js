import {Add3d} from "./Add3d";
import {Concatenate3d} from "./Concatenate3d";

let StrategyFactory = (function() {

	function getOperationStrategy(operator, dimension, mergedElements) {

		if (dimension === 3) {

			if (operator === "add") {
				return new Add3d(mergedElements);
			} else if (operator === "concatenate") {
				return new Concatenate3d(mergedElements);
			}

		}

	}

	return {

		getOperationStrategy: getOperationStrategy

	}

})();

export { StrategyFactory };