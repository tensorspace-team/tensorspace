/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergeValidator } from "../utils/MergeValidator";
import { MergedLayerFactory } from "./factory/MergedLayerFactory";

function Concatenate( layerList, config ) {

	let operatorType = "concatenate";

	MergeValidator.validate( layerList );

	let concatenateLayer = MergedLayerFactory.createMergedLayer( operatorType, layerList, config );

	return concatenateLayer;

}

export { Concatenate };