import { MathUtils } from "../../src/utils/MathUtils";
import chai from "chai"

describe('Test MathUtils', function () {

	it('Should calculate right max square root', function () {

		let root = 5;

		chai.expect( MathUtils.getMaxSquareRoot( 17 ) ).to.equal( root );

	});
});