let LayerTranslateFactory = ( function() {

	function translate( layer, xTranslate, translateTime ) {

		let init = {

			ratio: 0

		};
		let end = {

			ratio: 1

		};

		let startPos = layer.center;

		let translateTween = new TWEEN.Tween( init )
			.to( end, translateTime );

		translateTween.onUpdate( function() {

			let pos = {

				x: init.ratio * xTranslate + startPos.x,
				y: startPos.y,
				z: startPos.z

			};

			layer.neuralGroup.position.set( pos.x, pos.y, pos.z );

		} ).onStart( function() {

		} ).onComplete( function() {

			layer.center = {

				x: startPos.x + xTranslate,
				y: startPos.y,
				z: startPos.z

			};

		} );

		translateTween.start();

	}

	return {

		translate: translate

	}

} )();

export { LayerTranslateFactory };