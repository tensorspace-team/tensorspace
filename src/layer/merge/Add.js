import { BasicLayer1d } from "../prime/BasicLayer1d";
import { BasicLayer2d } from "../prime/BasicLayer2d";
import { BasicLayer3d } from "../prime/BasicLayer3d";
import {MergedLayer3d} from "./MergedLayer3d";

function Add(layerList) {

	let mergedElements = [];

	let depth;

	if (layerList.length > 0) {
		depth = layerList[0].layerDimension;
	} else {
		console.error("Merge Layer missing elements.");
	}

	for (let i = 0; i < layerList.length; i++) {

		if (layerList[i].layerDimension !== depth) {
			console.error("Can not add layer with different depth.");
		}

		mergedElements.push(layerList[i]);
	}

	if (mergedElements[0].layerDimension === 1) {
		return ;
	} else if (mergedElements[0].layerDimension === 2) {
		return new BasicLayer2d({shape: [100, 100]});
	} else if (mergedElements[0].layerDimension === 3) {

		let mergedLayer = new MergedLayer3d({
			operator: "add"
		});
		mergedLayer.setMergedElements(mergedElements);

		return mergedLayer;
	} else {

	}

}

Add.prototype = {

};

export { Add };