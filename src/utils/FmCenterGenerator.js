import { centerLocator } from "./CenterLocator";

function FmCenterGenerator() {

	this.defaultYPos = 0;

}

FmCenterGenerator.prototype = {

	getFmCenters: function(shape, filters, width, height) {
		if (shape === "line") {

			let centerList = centerLocator.createLineCenters(filters, width);
			let fmCenters = this.create3DCenters(centerList);

			return fmCenters;

		} else if (shape === "square") {

		} else {
			console.error("do not support shape " + shape);
		}
	},

	create3DCenters: function(centerList) {

		let fmCenters = [];

		for (let i = 0; i < centerList.length; i++) {

			let center2d = centerList[i];
			let center3d = {};
			center3d.x = center2d[0];
			center3d.y = this.defaultYPos;
			center3d.z = center2d[1];
			fmCenters.push(center3d);

		}

		return fmCenters;

	}

};

let fmCenterGenerator = new FmCenterGenerator();

export default fmCenterGenerator;