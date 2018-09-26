import { CenterLocator } from "../../src/utils/CenterLocator";
import chai from "chai"

describe('Test Conv2d', function () {

	console.log(555);

	it('Should has a 3d output shape', function () {

		let outputDimension = 3;

		console.log(777);

		chai.expect( 3 ).to.equal(outputDimension);

	});
});