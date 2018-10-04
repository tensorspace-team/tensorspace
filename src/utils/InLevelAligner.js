let InLevelAligner = ( function() {

	function getXTranslate( layerList ) {

		let translateList = [];

		let layerLength = layerList.length;

		let xInterval = 300;
		let initX = - xInterval * ( layerLength - 1 ) / 2;

		for ( let i = 0; i < layerLength; i ++ ) {

			translateList.push( initX + xInterval * i )

		}

		return translateList;

	}

	return {

		getXTranslate: getXTranslate

	}

} )();

export { InLevelAligner };