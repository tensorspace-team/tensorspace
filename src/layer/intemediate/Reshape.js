/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Reshape1d } from "./Reshape1d";
import { Reshape2d } from "./Reshape2d";

/**
 * Create actual reshape layer based on user's targetShape dimension.
 *
 * @param config, user's configuration for Reshape layer
 * @returns { Layer }, actual Reshape Layer, Reshape1d or Reshape2d
 * @constructor
 */

function Reshape( config ) {

	return this.proxy( config );

}

Reshape.prototype = {

	proxy: function( config ) {

		// Check and create Reshape layer.

		if ( config !== undefined && config.targetShape !== undefined ) {

			if ( config.targetShape.length === 1 ) {

				// If targetShape dimension is 1, create Reshape1d.

				return new Reshape1d( config );

			} else if ( config.targetShape.length === 2 ) {

				// If targetShape dimension is 2, create Reshape2d.

				return new Reshape2d( config );

			} else {

				console.error( "Can not reshape with target shape dimension " + config.targetShape.length );

			}

		} else {

			console.error( "\"targetShape\" property is required for Reshape layer." );

		}

	}

};

export { Reshape };