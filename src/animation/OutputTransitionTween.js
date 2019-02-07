/**
 * @author syt123450 / https://github.com/syt123450
 */

import * as TWEEN from '@tweenjs/tween.js';

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

			layer.isWaitOpen = false;
			layer.isOpen = true;

		} ).onComplete( function() {

			layer.initCloseButton();

			if ( layer.paging ) {

				layer.showPaginationButton();

			}

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

			if ( layer.paging ) {

				layer.hidePaginationButton();

			}

		} ).onComplete( function() {
			
			layer.disposeOutputElement();
			layer.initAggregationElement();

			layer.isWaitClose = false;
			layer.isOpen = false;

		} );

		closeTween.start();

		layer.isWaitClose = true;

	}

	return {

		openLayer: openLayer,

		closeLayer: closeLayer

	}

} )();

export { OutputTransitionFactory }