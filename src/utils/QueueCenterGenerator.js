import { GridIntervalRatio } from "./Constant";

let QueueCenterGenerator = (function() {

	function getCenterList(actualLength, number) {

		let centerList = [];

		let interval = GridIntervalRatio * actualLength;

		let initZTranslation = - interval * (number - 1) / 2;

		for (let i = 0; i < number; i++) {

			let center = {
				x: 0,
				y: 0,
				z: initZTranslation + interval * i
			};

			centerList.push(center);

		}

		console.log(centerList);

		return centerList;

	}

	return  {

		getCenterList: getCenterList

	}

})();

export { QueueCenterGenerator }