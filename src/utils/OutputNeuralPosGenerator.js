/**
 * @author syt123450 / https://github.com/syt123450
 */

import { OutputNeuralInterval } from "./Constant";

let OutputNeuralPosGenerator = (function() {

	function getLinePos(units, unitLength) {

		let posList = [];

		let initXTranslate = - unitLength * (units - 1) / 2 * (1 + OutputNeuralInterval);

		for (let i = 0; i < units; i++) {

			let pos = {
				x: initXTranslate + i * (1 + OutputNeuralInterval) * unitLength,
				y: 0,
				z: 0
			};

			posList.push(pos);

		}

		return posList;

	}

	return {

		getLinePos: getLinePos

	}

})();

export { OutputNeuralPosGenerator }