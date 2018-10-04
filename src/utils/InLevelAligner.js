let InLevelAligner = ( function() {

	function getXTranslate( layerList ) {

		let translateList = [];

		let layerLength = layerList.length;

		let layerInterval = 50;

		let layerWidth = 0;

		for ( let i = 0; i < layerList.length; i ++ ) {

			layerWidth += layerList[ i ].getBoundingWidth();

		}

		layerWidth += layerInterval * ( layerList.length - 1 );

		let initX = - layerWidth / 2;

		let previousLength = 0;

		for ( let i = 0; i < layerLength; i ++ ) {

			let xTranslate = initX + previousLength + layerList[ i ].getBoundingWidth() / 2;
			translateList.push( xTranslate );

			previousLength += layerList[ i ].getBoundingWidth() + layerInterval;

		}

		return translateList;

	}

	return {

		getXTranslate: getXTranslate

	}

} )();

export { InLevelAligner };