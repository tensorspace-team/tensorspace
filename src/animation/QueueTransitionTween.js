/**
 * @author syt123450 / https://github.com/syt123450
 */

import { VariableLengthObject } from "../elements/VariableLengthObject";

let QueueTransitionFactory = ( function() {

	function openLayer( layer ) {

		let init = {

			scale: 1

		};

		let scale;

		if ( layer.paging ) {

			scale = layer.queueLength;

		} else {

			scale = layer.width;

		}

		let end = {

			scale: scale

		};

		let variableLengthObject = ( new VariableLengthObject(

			layer.unitLength,
			layer.unitLength,
			layer.unitLength,
			layer.color,
			layer.minOpacity

		) ).getElement();

		let fmTween = new TWEEN.Tween( init )
			.to( end, layer.openTime );

		fmTween.onUpdate( function() {

			variableLengthObject.scale.x = init.scale;

		} ).onStart( function() {

			console.log( "start open queue layer" );
			layer.disposeAggregationElement();
			layer.neuralGroup.add( variableLengthObject );
			layer.isTransition = true;

		} ).onComplete( function() {

			console.log( "end open queue layer" );
			layer.neuralGroup.remove( variableLengthObject );
			layer.initQueueElement();
			layer.initCloseButton();

			if ( layer.paging ) {

				layer.showPaginationButton();

			}

			layer.isTransition = false;
			layer.isOpen = true;

		} );

		fmTween.start();

	}

	function closeLayer( layer ) {

		let init = {

			scale: 1

		};

		let scale;

		if ( layer.paging ) {

			scale = layer.queueLength;

		} else {

			scale = layer.width;

		}

		let end = {

			scale: 1 / scale

		};

		let variableLength;

		if ( layer.paging ) {

			variableLength = layer.queueLength;

		} else {

			variableLength = layer.width;

		}

		let variableLengthObject = ( new VariableLengthObject(

			variableLength * layer.unitLength,
			layer.unitLength,
			layer.unitLength,
			layer.color,
			layer.minOpacity

		) ).getElement();

		let fmTween = new TWEEN.Tween( init )
			.to( end, layer.openTime );

		fmTween.onUpdate( function() {

			variableLengthObject.scale.x = init.scale;

		} ).onStart( function() {

			layer.disposeQueueElement();
			layer.neuralGroup.add( variableLengthObject );
			layer.disposeCloseButton();

			if ( layer.paging ) {

				layer.hidePaginationButton();

			}

			layer.isTransition = true;

		} ).onComplete( function() {

			layer.neuralGroup.remove( variableLengthObject );
			layer.initAggregationElement();
			layer.isTransition = false;
			layer.isOpen = false;

		} );

		fmTween.start();

	}

	return {

		openLayer: openLayer,

		closeLayer: closeLayer

	}

} )();

export { QueueTransitionFactory };