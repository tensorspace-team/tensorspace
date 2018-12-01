/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergeValidator } from "../utils/MergeValidator";
import { MergedLayerFactory } from "./factory/MergedLayerFactory";

function Multiply( layerList, config ) {

	let operatorType = "multiply";

	MergeValidator.validate( layerList );

	let multiplyLayer = MergedLayerFactory.createMergedLayer( operatorType, layerList, config );

	return multiplyLayer;

}

export { Multiply };