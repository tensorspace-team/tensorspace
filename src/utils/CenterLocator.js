function CenterLocator() {

}

CenterLocator.prototype = {

	createLineCenters: function(filters, width) {

		let centerList = [];

		let fmLength = width;
		let fmInterval = 10;
		let initXTranslate;

		initXTranslate = - (filters - 1) / 2 * (fmLength + fmInterval);

		for (let i = 0; i < filters; i++) {

			let xTranslate = initXTranslate + (fmLength + fmInterval) * i;
			let centerPos = [];
			centerPos.push(xTranslate);
			centerPos.push(0);

			centerList.push(centerPos);
		}

		return centerList;

	},

	createSquareCenters: function() {

	}

};

let centerLocator = new CenterLocator();

export { centerLocator };