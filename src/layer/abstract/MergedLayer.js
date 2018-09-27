/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergedLineGroup } from "../../elements/MergedLineGroup";
import { Layer } from "./Layer";

function MergedLayer( config ) {

	Layer.call( this, config );

	this.lineGroupHandler = undefined;

	// identify whether is merged layer
	this.isMerged = true;

	this.operator = undefined;

}

MergedLayer.prototype = Object.assign( Object.create( Layer.prototype ), {

	addLineGroup: function() {

		this.lineGroupHandler = new MergedLineGroup(

			this,
			this.scene,
			this.neuralGroup,
			this.color,
			this.minOpacity

		);

	}

} );

export { MergedLayer };