/**
 * @author syt123450 / https://github.com/syt123450
 */

let LayerTranslateFactory = ( function() {

	function translate( layer, targetCenter, translateTime ) {

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

				x: init.ratio * ( targetCenter.x - startPos.x ) + startPos.x,
				y: init.ratio * ( targetCenter.y - startPos.y ) + startPos.y,
				z: init.ratio * ( targetCenter.z - startPos.z ) + startPos.z

			};

			layer.neuralGroup.position.set( pos.x, pos.y, pos.z );

		} ).onStart( function() {

		} ).onComplete( function() {

			layer.center = {

				x: targetCenter.x,
				y: targetCenter.y,
				z: targetCenter.z

			};

		} );

		translateTween.start();

	}

	return {

		translate: translate

	}

} )();

export { LayerTranslateFactory };