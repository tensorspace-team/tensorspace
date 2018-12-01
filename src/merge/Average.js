/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergeValidator } from "../utils/MergeValidator";
import { MergedLayerFactory } from "./factory/MergedLayerFactory";

function Average( layerList, config ) {

	let operatorType = "average";

	MergeValidator.validate( layerList );

	let averageLayer = MergedLayerFactory.createMergedLayer( operatorType, layerList, config );

	return averageLayer;

}

export { Average };