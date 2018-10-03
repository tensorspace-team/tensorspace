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

			console.log( "start open layer" );
			layer.disposeAggregationElement();
			layer.initSegregationElements( layer.closeCenterList );
			layer.isOpen = true;

		} ).onComplete( function() {

			console.log( "end open layer" );
			layer.initCloseButton();

		} );

		openTween.start();

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

			console.log( "start close layer" );
			layer.disposeCloseButton();

		} ).onComplete( function() {

			console.log( "end close layer" );
			layer.disposeSegregationElements();
			layer.initAggregationElement();
			layer.isOpen = false;

		} );

		fmTween.start();

	}

	return {

		openLayer: openLayer,

		closeLayer: closeLayer

	}

} )();

export { QueueGroupTweenFactory };