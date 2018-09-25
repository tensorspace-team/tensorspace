/**
 * @author syt123450 / https://github.com/syt123450
 */

let OutputTransitionFactory = ( function() {

	function openLayer( layer ) {

		let init = {

			ratio: 0

		};

		let end = {

			ratio: 1

		};

		let openTween = new TWEEN.Tween( init )
			.to( end, layer.openTime );

		layer.disposeAggregationElement();
		layer.initOutputElement("close");
		layer.isOpen = true;

		openTween.onUpdate( function() {

			let poses = [];

			for ( let i = 0; i < layer.outputHandler.outputLength; i ++ ) {

				let pos = {

					x: init.ratio * ( layer.outputHandler.openResultPos[ i ].x - layer.outputHandler.closeResultPos[ i ].x ),
					y: init.ratio * ( layer.outputHandler.openResultPos[ i ].y - layer.outputHandler.closeResultPos[ i ].y ),
					z: init.ratio * ( layer.outputHandler.openResultPos[ i ].z - layer.outputHandler.closeResultPos[ i ].z )

				};

				poses.push( pos );

			}

			layer.outputHandler.updatePoses( poses );

		} ).onStart( function() {

			console.log( "start open output layer" );

		} ).onComplete( function() {

			console.log( "finish open output layer" );
			layer.initCloseButton();

			if ( layer.section ) {

				layer.showPagination();

			}

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

		let closeTween = new TWEEN.Tween( init )
			.to( end, layer.openTime );

		layer.disposeCloseButton();

		closeTween.onUpdate( function() {

			let poses = [];

			for ( let i = 0; i < layer.outputHandler.outputLength; i ++ ) {

				let pos = {

					x: init.ratio * ( layer.outputHandler.openResultPos[ i ].x - layer.outputHandler.closeResultPos[ i ].x ),
					y: init.ratio * ( layer.outputHandler.openResultPos[ i ].y - layer.outputHandler.closeResultPos[ i ].y ),
					z: init.ratio * ( layer.outputHandler.openResultPos[ i ].z - layer.outputHandler.closeResultPos[ i ].z )

				};

				poses.push( pos );

			}

			layer.outputHandler.updatePoses( poses );

		} ).onStart( function() {

			console.log( "start close output layer" );

			if ( layer.section ) {

				layer.hidePagination();

			}

		} ).onComplete( function() {

			console.log( "end close output layer" );
			layer.disposeOutputElement();
			layer.initAggregationElement();
			layer.isOpen = false;

		} );

		closeTween.start();

	}

	return {

		openLayer: openLayer,

		closeLayer: closeLayer

	}

} )();

export { OutputTransitionFactory }