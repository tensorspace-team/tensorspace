/**
 * @author botime / https://github.com/botime
 * @author syt123450 / https://github.com/syt123450
 */

describe( 'Test TensorSpace container initialization:', () => {

	let container;

	beforeAll( () => {

		document.body.innerHTML = __html__[ 'test/template.html' ];
		container = document.getElementById( "container" );

	} );

	it( 'Div \"container\" should be created.', () => {

		expect( container ).not.toBeNull();
		expect( container.nodeName ).toBe( 'DIV' );

	} );

} );
