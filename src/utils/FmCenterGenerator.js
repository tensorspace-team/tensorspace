function FmCenterGenerator() {

}

FmCenterGenerator.prototype = {

	getLineShape: function(filters, width) {

		let fmCenters = [];

		let fmLength = width;
		let fmInterval = 10;
		let initXTranslate;

		initXTranslate = - (filters - 1) / 2 * (fmLength + fmInterval);

		for (let i = 0; i < filters; i++) {

			let xTranslate = initXTranslate + (fmLength + fmInterval) * i;
			let fmCenter = {};
			fmCenter.x = xTranslate;
			fmCenter.y = 0;
			fmCenter.z = 0;
			fmCenters.push(fmCenter);

		}

		return fmCenters;

	},

	getSquareShape: function() {

	}

};

let fmCenterGenerator = new FmCenterGenerator();

export default fmCenterGenerator;