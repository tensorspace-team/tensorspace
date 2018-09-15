import {MergedLayer3d} from "../layer/abstract/MergedLayer3d";

function Maximum(layerList, config) {

	let operatorType = "maximum";

	validate(layerList);

	return createMergedLayer(layerList, config);

	function validate(layerList) {

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

		}

	}

	function createMergedLayer(layerList, userConfig) {

		if (layerList[0].layerDimension === 1) {

		} else if (layerList[0].layerDimension === 2) {

		} else if (layerList[0].layerDimension === 3) {

			return new MergedLayer3d({
				operator: operatorType,
				mergedElements: layerList,
				userConfig: userConfig
			});

		} else {
			console.error("Do not support layer add operation more than 4 dimension.");
		}

	}

}

export { Maximum };