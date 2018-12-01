/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergeValidator } from "../utils/MergeValidator";
import { MergedLayerFactory } from "./factory/MergedLayerFactory";

function Subtract( layerList, config ) {

	let operatorType = "subtract";

	MergeValidator.validate( layerList );

	let subtractLayer = MergedLayerFactory.createMergedLayer( operatorType, layerList, config );

	return subtractLayer;

}

export { Subtract };