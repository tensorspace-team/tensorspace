/**
 * @author botime / https://github.com/botime
 * @author syt123450 / https://github.com/syt123450
 */

describe( 'Test layer Conv2d:', () => {

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

	it( 'Should create layer \"conv2d\".', () => {

		model.add( new TSP.layers.GreyscaleInput( {

			shape: [ 28, 28 ]

		} ) );

		let conv2dLayer = new TSP.layers.Conv2d( {

			shape: [ 28, 28, 3 ]

		} );

		model.add( conv2dLayer );

		model.init( () => {

			expect(conv2dLayer.layerType).toBe('Conv2d');
			expect(conv2dLayer.inputShape[0]).toBe(28);
			expect(conv2dLayer.inputShape[1]).toBe(28);

			expect(conv2dLayer.outputShape[0]).toBe(28);
			expect(conv2dLayer.outputShape[1]).toBe(28);
			expect(conv2dLayer.outputShape[2]).toBe(3);

		} );

	} );

	it( 'Should \"GreyscaleInput\" has inputShape [28, 28].', () => {

		model.add( new TSP.layers.GreyscaleInput( {

			shape: [ 28, 28 ]

		} ) );

		let conv2dLayer = new TSP.layers.Conv2d( {

			shape: [ 28, 28, 3 ]

		} );

		model.add( conv2dLayer );

		model.init( () => {

			expect(conv2dLayer.inputShape).toEqual( [ 28, 28 ] );

		} );

	} );

	it( 'Should \"GreyscaleInput\" has outputShape [28, 28, 3].', () => {

		model.add( new TSP.layers.GreyscaleInput( {

			shape: [ 28, 28 ]

		} ) );

		let conv2dLayer = new TSP.layers.Conv2d( {

			shape: [ 28, 28, 3 ]

		} );

		model.add( conv2dLayer );

		model.init( () => {

			expect( conv2dLayer.outputShape ).toEqual( [ 28, 28, 3 ] );

		} );

	} );

	afterEach( () => {

		model = null;

	} );

} );
