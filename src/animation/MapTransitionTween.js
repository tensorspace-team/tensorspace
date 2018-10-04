/**
 * @author syt123450 / https://github.com/syt123450
 */

let MapTransitionFactory = ( function() {

	function openLayer( layer ) {

		layer.disposeAggregationElement();
		layer.initSegregationElements( layer.closeFmCenters );

		let init = {

			ratio: 0

		};
		let end = {

			ratio: 1

		};

		let fmTween = new TWEEN.Tween( init )
			.to( end, layer.openTime );

		fmTween.onUpdate( function() {

			for ( let i = 0; i < layer.segregationHandlers.length; i ++ ) {

				let tempPos = {

					x: init.ratio * ( layer.openFmCenters[ i ].x - layer.closeFmCenters[ i ].x ),
					y: init.ratio * ( layer.openFmCenters[ i ].y - layer.closeFmCenters[ i ].y ),
					z: init.ratio * ( layer.openFmCenters[ i ].z - layer.closeFmCenters[ i ].z )

				};

				layer.segregationHandlers[ i ].updatePos( tempPos );

			}

		} ).onStart( function() {

			layer.isWaitOpen = false;
			layer.isOpen = true;

		} ).onComplete( function() {

			layer.initCloseButton();

		} );

		fmTween.start();

		layer.isWaitOpen = true;

	}

	function closeLayer( layer ) {

		let init = {

			ratio: 1

		};
		let end = {

			ratio: 0

		};

		let fmTween = new TWEEN.Tween( init )
			.to( end, layer.openTime );

		fmTween.onUpdate( function() {

			for ( let i = 0; i < layer.segregationHandlers.length; i ++ ) {

				let tempPos = {

					x: init.ratio * ( layer.openFmCenters[ i ].x - layer.closeFmCenters[ i ].x ),
					y: init.ratio * ( layer.openFmCenters[ i ].y - layer.closeFmCenters[ i ].y ),
					z: init.ratio * ( layer.openFmCenters[ i ].z - layer.closeFmCenters[ i ].z )

				};

				layer.segregationHandlers[ i ].updatePos( tempPos );

			}

		} ).onStart( function() {

			layer.disposeCloseButton();

		} ).onComplete( function() {

			layer.disposeSegregationElements();
			layer.initAggregationElement();
			layer.isWaitClose = false;
			layer.isOpen = false;

		} );

		fmTween.start();

		layer.isWaitClose = true;

	}

	return {

		openLayer: openLayer,

		closeLayer: closeLayer

	}

} )();

export { MapTransitionFactory };