let CloseButtonHelper = (function() {

	let distance = 10;

	return {

		getPosInLayer: function(relativePos, width) {

			return {

				x: relativePos.x - width / 2 - distance,
				y: 0,
				z: 0

			}

		}

	}

})();

export { CloseButtonHelper }