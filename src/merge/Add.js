/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergeValidator } from "../utils/MergeValidator";
import { MergedLayerFactory } from "./factory/MergedLayerFactory";

/**
 * Performs element-wise addition on layers.
 *
 * @param layerList, input a list of layers.
 * @param config, user's config for add function
 * @constructor
 */

function Add( layerList, config ) {

	let operatorType = "add";

	MergeValidator.validate( layerList );

	let addLayer = MergedLayerFactory.createMergedLayer( operatorType, layerList, config );

	return addLayer;

}

export { Add };