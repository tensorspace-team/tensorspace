let MathUtils = (function() {

	function getMaxSquareRoot(n) {

		let sqrt = Math.sqrt(n);

		if (Math.floor(sqrt) === sqrt) {
			return sqrt;
		} else {
			return Math.floor(sqrt) + 1;
		}

	}

	function getTest() {
	    return 777;
    }

    function getClosestTwoFactors(n) {

	    let sqrt = Math.sqrt(n);
	    let base = sqrt;
	    let limit = Math.floor(Math.sqrt(n/2));      // force maximum width:height < 2:1

	    if (Math.floor(base) === sqrt) {    // perfect square
	        return [base, base];
        } else {
	        base = Math.floor(base);
	        while (n % base !==0 && base > limit) {
	            base--;
            }
            if (Math.floor(n /base) !== n /base) {
                return [Math.ceil(sqrt), Math.ceil(sqrt)];
            } else {
                return [n /base, base];         // [0]: width; [1]: height (shorter)
            }
        }
    }

	return {

		getMaxSquareRoot: getMaxSquareRoot,

        getTest: getTest,

        getClosestTwoFactors: getClosestTwoFactors

	}

})();

export { MathUtils }