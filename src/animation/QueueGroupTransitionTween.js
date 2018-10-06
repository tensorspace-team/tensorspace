/**
 * @author syt123450 / https://github.com/syt123450
 */

let QueueGroupTweenFactory = ( function() {

	function openLayer( layer ) {

		let init = {

			ratio: 0

		};
		let end = {

			ratio: 1

		};

		let openTween = new TWEEN.Tween( init )
			.to( end, layer.openTime );

		openTween.onUpdate( function() {

			for ( let i = 0; i < layer.queueHandlers.length; i ++ ) {

				let tempPos = {

					x: init.ratio * ( layer.openCenterList[ i ].x - layer.closeCenterList[ i ].x ),
					y: init.ratio * ( layer.openCenterList[ i ].y - layer.closeCenterList[ i ].y ),
					z: init.ratio * ( layer.openCenterList[ i ].z - layer.closeCenterList[ i ].z )

				};

				layer.queueHandlers[ i ].updatePos( tempPos );

			}

		} ).onStart( function() {

			layer.disposeAggregationElement();
			layer.initSegregationElements( layer.closeCenterList );

			layer.isWaitOpen = false;
			layer.isOpen = true;

		} ).onComplete( function() {

			layer.initCloseButton();

		} );

		openTween.start();

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

			for ( let i = 0; i < layer.queueHandlers.length; i ++ ) {

				let tempPos = {

					x: init.ratio * ( layer.openCenterList[ i ].x - layer.closeCenterList[ i ].x ),
					y: init.ratio * ( layer.openCenterList[ i ].y - layer.closeCenterList[ i ].y ),
					z: init.ratio * ( layer.openCenterList[ i ].z - layer.closeCenterList[ i ].z )

				};

				layer.queueHandlers[ i ].updatePos( tempPos );

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

export { QueueGroupTweenFactory };