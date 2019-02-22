/**
 * @author syt123450 / https://github.com/syt123450
 */

import * as TWEEN from '@tweenjs/tween.js';

let RGBTweenFactory = ( function() {

	function separate( layer ) {

		let separateInit = {

			ratio: 0

		};
		let separateEnd = {

			ratio: 1

		};

		let separateTween = new TWEEN.Tween( separateInit )
			.to( separateEnd, layer.separateTime );

		separateTween.onUpdate( function() {

			layer.fmCenters = [];

			let rChannel = layer.segregationHandlers[ 0 ];
			let rCloseFmCenter = layer.closeFmCenters[ 0 ];
			let separateTopPos = layer.separateTopPos;

			let rTempPos = {

				x: separateInit.ratio * ( separateTopPos.x - rCloseFmCenter.x ),
				y: separateInit.ratio * ( separateTopPos.y - rCloseFmCenter.y ),
				z: separateInit.ratio * ( separateTopPos.z - rCloseFmCenter.z )

			};

			rChannel.updatePos( rTempPos );
			layer.fmCenters.push( rTempPos) ;

			layer.fmCenters.push( {

				x: 0,
				y: 0,
				z: 0

			} );

			let bChannel = layer.segregationHandlers[ 2 ];
			let bCloseFmCenter = layer.closeFmCenters[ 2 ];
			let separateBottomPos = layer.separateBottomPos;

			let bTempPos = {

				x: separateInit.ratio * ( separateBottomPos.x - bCloseFmCenter.x ),
				y: separateInit.ratio * ( separateBottomPos.y - bCloseFmCenter.y ),
				z: separateInit.ratio * ( separateBottomPos.z - bCloseFmCenter.z )

			};

			bChannel.updatePos( bTempPos );
			layer.fmCenters.push( bTempPos );

		} ).onStart( function() {

			layer.disposeAggregationElement();
			layer.initSegregationElements();

			layer.isWaitOpen = false;
			layer.isOpen = true;

		} ).onComplete( function() {

		} );

		let journeyInit = {

			ratio: 0

		};

		let journeyEnd = {

			ratio: 1

		};

		let journeyTween = new TWEEN.Tween( journeyInit )
			.to( journeyEnd, layer.openTime );

		journeyTween.onUpdate( function() {

			layer.fmCenters = [];

			let rChannel = layer.segregationHandlers[ 0 ];
			let separateTopPos = layer.separateTopPos;
			let rOpenFmCenter = layer.openFmCenters[ 0 ];

			let rTempPos = {

				x: journeyInit.ratio * ( rOpenFmCenter.x - separateTopPos.x ) + separateTopPos.x,
				y: journeyInit.ratio * ( rOpenFmCenter.y - separateTopPos.y ) + separateTopPos.y,
				z: journeyInit.ratio * ( rOpenFmCenter.z - separateTopPos.z ) + separateTopPos.z

			};

			rChannel.updatePos( rTempPos );
			layer.fmCenters.push( rTempPos );

			layer.fmCenters.push( {

				x: 0,
				y: 0,
				z: 0

			} );

			let bChannel = layer.segregationHandlers[ 2 ];
			let separateBottomPos = layer.separateBottomPos;
			let bOpenFmCenter = layer.openFmCenters[ 2 ];

			let bTempPos = {

				x: journeyInit.ratio * ( bOpenFmCenter.x - separateBottomPos.x ) + separateBottomPos.x,
				y: journeyInit.ratio * ( bOpenFmCenter.y - separateBottomPos.y ) + separateBottomPos.y,
				z: journeyInit.ratio * ( bOpenFmCenter.z - separateBottomPos.z ) + separateBottomPos.z

			};

			bChannel.updatePos( bTempPos );
			layer.fmCenters.push( bTempPos );

		} ).onStart( function() {

		} ).onComplete( function() {

			if ( layer.hasCloseButton ) {
				
				layer.initCloseButton();
				
			}

		} );

		separateTween.chain( journeyTween );
		separateTween.start();

		layer.isWaitOpen = true;

	}

	function aggregate( layer ) {

		let homingInit = {

			ratio: 1

		};

		let homingEnd = {

			ratio: 0

		};

		let homingTween = new TWEEN.Tween( homingInit )
			.to( homingEnd, layer.openTime );

		homingTween.onUpdate( function() {

			layer.fmCenters = [];

			let rChannel = layer.segregationHandlers[ 0 ];
			let separateTopPos = layer.separateTopPos;
			let rOpenFmCenter = layer.openFmCenters[ 0 ];

			let rTempPos = {

				x: homingInit.ratio * ( rOpenFmCenter.x - separateTopPos.x ) + separateTopPos.x,
				y: homingInit.ratio * ( rOpenFmCenter.y - separateTopPos.y ) + separateTopPos.y,
				z: homingInit.ratio * ( rOpenFmCenter.z - separateTopPos.z ) + separateTopPos.z

			};

			rChannel.updatePos( rTempPos );
			layer.fmCenters.push( rTempPos );

			layer.fmCenters.push( {

				x: 0,
				y: 0,
				z: 0

			} );

			let bChannel = layer.segregationHandlers[ 2 ];
			let separateBottomPos = layer.separateBottomPos;
			let bOpenFmCenter = layer.openFmCenters[ 2 ];

			let bTempPos = {

				x: homingInit.ratio * ( bOpenFmCenter.x - separateBottomPos.x ) + separateBottomPos.x,
				y: homingInit.ratio * ( bOpenFmCenter.y - separateBottomPos.y ) + separateBottomPos.y,
				z: homingInit.ratio * ( bOpenFmCenter.z - separateBottomPos.z ) + separateBottomPos.z

			};

			bChannel.updatePos( bTempPos );
			layer.fmCenters.push( bTempPos );

		} ).onStart(function() {

			if ( layer.hasCloseButton ) {
				
				layer.disposeCloseButton();
				
			}

		} ).onComplete( function() {

		} );

		let aggregateInit = {

			ratio: 1

		};

		let aggregateEnd = {

			ratio: 0

		};

		let aggregateTween = new TWEEN.Tween( aggregateInit )
			.to( aggregateEnd, layer.separateTime );

		aggregateTween.onUpdate( function() {

			layer.fmCenters = [];

			let rChannel = layer.segregationHandlers[ 0 ];
			let rCloseFmCenter = layer.closeFmCenters[ 0 ];
			let separateTopPos = layer.separateTopPos;

			let rTempPos = {

				x: aggregateInit.ratio * ( separateTopPos.x - rCloseFmCenter.x ),
				y: aggregateInit.ratio * ( separateTopPos.y - rCloseFmCenter.y ),
				z: aggregateInit.ratio * ( separateTopPos.z - rCloseFmCenter.z )

			};

			rChannel.updatePos( rTempPos );
			layer.fmCenters.push( rTempPos );

			layer.fmCenters.push( {

				x: 0,
				y: 0,
				z: 0

			} );

			let bChannel = layer.segregationHandlers[ 2 ];
			let bCloseFmCenter = layer.closeFmCenters[ 2 ];
			let separateBottomPos = layer.separateBottomPos;

			let bTempPos = {

				x: aggregateInit.ratio * ( separateBottomPos.x - bCloseFmCenter.x ),
				y: aggregateInit.ratio * ( separateBottomPos.y - bCloseFmCenter.y ),
				z: aggregateInit.ratio * ( separateBottomPos.z - bCloseFmCenter.z )

			};

			bChannel.updatePos( bTempPos );
			layer.fmCenters.push( bTempPos );

		} ).onStart( function() {

		} ).onComplete(function() {

			layer.disposeSegregationElements();
			layer.initAggregationElement();

			layer.isWaitClose = false;
			layer.isOpen = false;

		} );

		homingTween.chain( aggregateTween );
		homingTween.start();

		layer.isWaitClose = true;

	}

	return {

		separate: separate,

		aggregate: aggregate

	}

} )();

export { RGBTweenFactory };