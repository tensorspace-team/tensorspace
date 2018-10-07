/**
 * @author syt123450 / https://github.com/syt123450
 */

let MouseCaptureHelper = ( function() {

	function getElementViewTop( element ){

		let actualTop = element.offsetTop;
		let current = element.offsetParent;

		while ( current !== null ) {

			actualTop += current.offsetTop;
			current = current.offsetParent;

		}

		let elementScrollTop;

		if ( document.compatMode === "BackCompat" ) {

			elementScrollTop = document.body.scrollTop;

		} else {

			if ( document.documentElement.scrollTop === 0 ) {

				elementScrollTop = document.body.scrollTop;

			} else {

				elementScrollTop = document.documentElement.scrollTop;

			}

		}

		return actualTop - elementScrollTop;

	}

	function getElementViewLeft( element ) {

		let actualLeft = element.offsetLeft;
		let current = element.offsetParent;

		while ( current !== null ) {

			actualLeft += current.offsetLeft;
			current = current.offsetParent;

		}

		let elementScrollLeft;

		if ( document.compatMode === "BackCompat" ) {

			elementScrollLeft = document.body.scrollLeft;

		} else {

			if ( document.documentElement.scrollTop === 0 ) {

				elementScrollLeft = document.body.scrollLeft;

			} else {

				elementScrollLeft = document.documentElement.scrollLeft;

			}

		}

		return actualLeft - elementScrollLeft;

	}

	return {

		getElementViewTop: getElementViewTop,

		getElementViewLeft: getElementViewLeft

	}

} )();

export { MouseCaptureHelper };