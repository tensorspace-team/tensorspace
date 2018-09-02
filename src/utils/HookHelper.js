let HookHelper = (function() {

	function align(hook1, hook2) {

		if (hook1.pos.x >= hook2.pos.x) {
			hook2.updateHorizonPos(hook1.pos.x);
		} else {
			hook1.updateHorizonPos(hook2.pos.x);
		}

	}

	return {

		align: align

	}

})();

export { HookHelper }