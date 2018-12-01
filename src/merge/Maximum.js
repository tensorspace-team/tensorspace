/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergeValidator } from "../utils/MergeValidator";
import { MergedLayerFactory } from "./factory/MergedLayerFactory";

function Maximum( layerList, config ) {

	let operatorType = "maximum";

	MergeValidator.validate( layerList );

	let maximumLayer = MergedLayerFactory.createMergedLayer( operatorType, layerList, config );

	return maximumLayer;

}

export { Maximum };