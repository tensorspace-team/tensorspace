/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Add3d } from "../strategy/Add3d";
import { Concatenate3d } from "../strategy/Concatenate3d";
import { Subtract3d } from "../strategy/Subtract3d";
import { Multiply3d } from "../strategy/Multiply3d";
import { Dot3d } from "../strategy/Dot3d";
import { Maximum3d } from "../strategy/Maximum3d";
import { Average3d }  from "../strategy/Average3d";
import {Add2d} from "../strategy/Add2d";

let StrategyFactory = ( function() {

	function getOperationStrategy( operator, dimension, mergedElements ) {

		if ( dimension === 3 ) {

			if ( operator === "add" ) {

				return new Add3d( mergedElements );

			} else if ( operator === "concatenate" ) {

				return new Concatenate3d( mergedElements );

			} else if ( operator === "subtract" ) {

				return new Subtract3d( mergedElements );

			} else if ( operator === "multiply" ) {

				return new Multiply3d( mergedElements );

			} else if ( operator === "dot" ) {

				return new Dot3d( mergedElements );

			} else if ( operator === "maximum" ) {

				return new Maximum3d( mergedElements );

			} else if ( operator === "average" ) {

				return new Average3d( mergedElements );

			}

		} else if ( dimension === 2 ) {

			if ( operator === "add" ) {

				return new Add2d( mergedElements );

			}

		} else if ( dimension === 1 ) {

		}

	}

	return {

		getOperationStrategy: getOperationStrategy

	}

} )();

export { StrategyFactory };