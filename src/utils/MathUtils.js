let MathUtils = (function() {

	function getMaxSquareRoot(n) {

		let sqrt = Math.sqrt(n);

		if (Math.floor(sqrt) === sqrt) {
			return sqrt;
		} else {
			return Math.floor(sqrt) + 1;
		}

	}

	return {

		getMaxSquareRoot: getMaxSquareRoot

	}

})();

export { MathUtils }