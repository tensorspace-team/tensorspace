import { MathUtils } from "./MathUtils";

function CenterLocator() {

	this.fmInterval = 10;

}

CenterLocator.prototype = {

	createLineCenters: function(filters, width) {

		let centerList = [];

		let fmLength = width;
		let initXTranslate;

		initXTranslate = - (filters - 1) / 2 * (fmLength + this.fmInterval);

		for (let i = 0; i < filters; i++) {

			let xTranslate = initXTranslate + (fmLength + this.fmInterval) * i;
			let centerPos = [];
			centerPos.push(xTranslate);
			centerPos.push(0);

			centerList.push(centerPos);
		}

		return centerList;

	},

	createSquareCenters: function(filters, width, height) {

		let centerList = [];

		let squareLength = MathUtils.getMaxSquareRoot(filters);

		console.log(squareLength);

		let initXTranslate = - (squareLength - 1) / 2 * (width + this.fmInterval);
		let initZTranslate = - (squareLength - 1) / 2 * (height + this.fmInterval);

		for (let i = 0; i < squareLength; i++) {
			for (let j = 0; j < squareLength; j++) {

				if ((i * squareLength + j + 1) > filters) {

					return centerList;
				}

				let centerPos = [];

				let xTranslate = initXTranslate + (width + this.fmInterval) * j;
				let zTranslate = initZTranslate + (height + this.fmInterval) * i;

				centerPos.push(xTranslate);
				centerPos.push(zTranslate);

				centerList.push(centerPos);
			}
		}

		return centerList;

	}

};

let centerLocator = new CenterLocator();

export { centerLocator };