/**
 * @author botime / https://github.com/botime
 * @author syt123450 / https://github.com/syt123450
 */

describe( 'Test Layer GreyscaleInput:', () => {

	let container;
	let model;

	beforeAll( () => {

		// Load template.html as testing context
		document.body.innerHTML = __html__[ 'test/e2e/template.html' ];
		container = document.getElementById( "container" );

	} );

	beforeEach( () => {

		model = new TSP.models.Sequential( container );

	} );

	it( 'Should create layer \"GreyscaleInput\".', () => {

		let greyscaleInputLayer = new TSP.layers.GreyscaleInput( {

			shape: [ 28, 28 ]

		} );

		model.add( greyscaleInputLayer );

		model.init( () => {

			expect( greyscaleInputLayer.layerType ).toBe( 'GreyscaleInput' );

		} );

	} );

	it( 'Should \"GreyscaleInput\" has outputShape [28, 28].', () => {

		let greyscaleInputLayer = new TSP.layers.GreyscaleInput( {

			shape: [ 28, 28 ]

		} );

		model.add( greyscaleInputLayer );

		model.init( () => {

			expect( greyscaleInputLayer.outputShape ).toEqual([28, 28]);

		} );

	} );

	afterEach( () => {

		model = null;

	} );

} );
