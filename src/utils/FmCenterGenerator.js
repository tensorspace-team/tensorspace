/**
 * @author syt123450 / https://github.com/syt123450
 */

import { CenterLocator } from "./CenterLocator";

let FmCenterGenerator = ( function() {

	let defaultYPos = 0;

	function getFmCenters( shape, filters, width, height ) {

		if ( shape === "line" ) {

			let centerList = CenterLocator.createLineCenters( filters, width );
			let fmCenters = create3DCenters( centerList );

			return fmCenters;

		} else if ( shape === "rect" ) {

			let centerList = CenterLocator.createRectangleCenters( filters, width, height );
            let fmCenters = create3DCenters( centerList );

            return fmCenters;

		} else {

			console.error( "do not support shape " + shape );

		}

	}

	function create3DCenters( centerList ) {

		let fmCenters = [];

		for ( let i = 0; i < centerList.length; i++ ) {

			let center2d = centerList[ i ];
			let center3d = {};
			center3d.x = center2d[ 0 ];
			center3d.y = defaultYPos;
			center3d.z = center2d[ 1 ];
			fmCenters.push( center3d );

		}

		return fmCenters;

	}

	return {

		getFmCenters: getFmCenters

	}

} )();

export { FmCenterGenerator };