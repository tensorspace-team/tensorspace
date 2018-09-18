/**
 * @author syt123450 / https://github.com/syt123450
 */

import {Reshape1d} from "./Reshape1d";
import {Reshape2d} from "./Reshape2d";

function Reshape(config) {

	return this.proxy(config);

}

Reshape.prototype = {

	proxy: function(config) {

		if (config !== undefined && config.targetShape !== undefined) {

			if (config.targetShape.length === 1) {
				return new Reshape1d(config);
			} else if (config.targetShape.length === 2) {
				return new Reshape2d(config);
			} else {
				console.error("Can not reshape with target shape dimension " + config.targetShape.length);
			}

		} else {
			console.error("\"targetShape\" property is required for Reshape layer.");
		}

	}

};

export { Reshape };