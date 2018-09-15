import {Add3d} from "./Add3d";
import {Concatenate3d} from "./Concatenate3d";
import {Subtract3d} from "./Subtract3d";
import {Multiply3d} from "./Multiply3d";
import {Dot3d} from "./Dot3d";
import {Maximum3d} from "./Maximum3d";
import {Average3d} from "./Average3d";

let StrategyFactory = (function() {

	function getOperationStrategy(operator, dimension, mergedElements) {

		if (dimension === 3) {

			if (operator === "add") {
				return new Add3d(mergedElements);
			} else if (operator === "concatenate") {
				return new Concatenate3d(mergedElements);
			} else if (operator === "subtract") {
				return new Subtract3d(mergedElements);
			} else if (operator === "multiply") {
				return new Multiply3d(mergedElements);
			} else if (operator === "dot") {
				return new Dot3d(mergedElements);
			} else if (operator === "maximum") {
				return new Maximum3d(mergedElements);
			} else if (operator === "average") {
				return new Average3d(mergedElements);
			}

		} else if (dimension === 2) {

		} else if (dimension === 1) {

		}

	}

	return {

		getOperationStrategy: getOperationStrategy

	}

})();

export { StrategyFactory };