/**
 * @author syt123450 / https://github.com/syt123450
 */

import { DefaultCameraPos, DefaultLayerDepth } from "../utils/Constant";

function SceneInitializer( container ) {

	this.container = container;

	this.scene = undefined;
	this.camera = undefined;
	this.stats = undefined;
	this.renderer = undefined;
	this.clock = undefined;
	this.cameraControls = undefined;
	this.raycaster = undefined;
	this.mouse = undefined;

	// control whether to show Stats panel, configured by Model Configuration
	this.hasStats = undefined;

	this.backgroundColor = undefined;

	this.sceneArea = undefined;

}

SceneInitializer.prototype = {

	loadSceneConfig: function( config ) {

		this.hasStats = config.stats;
		this.backgroundColor = config.color.background;

	},

	createScene: function() {

		let sceneArea = document.createElement( "canvas" );

		this.sceneArea = sceneArea;

		let cs = getComputedStyle( this.container );

		let paddingX = parseFloat( cs.paddingLeft ) + parseFloat( cs.paddingRight );
		let paddingY = parseFloat( cs.paddingTop ) + parseFloat( cs.paddingBottom );

		let borderX = parseFloat( cs.borderLeftWidth ) + parseFloat( cs.borderRightWidth );
		let borderY = parseFloat( cs.borderTopWidth ) + parseFloat( cs.borderBottomWidth );

		sceneArea.width = this.container.clientWidth - paddingX - borderX;
		sceneArea.height = this.container.clientHeight - paddingY - borderY;
		sceneArea.style.backgroundColor = this.backgroundColor;

		this.clock = new THREE.Clock();

		this.renderer = new THREE.WebGLRenderer( {

			canvas: sceneArea,
			antialias: true

		} );

		this.renderer.setSize( sceneArea.width, sceneArea.height );
		this.container.appendChild( this.renderer.domElement );

		this.camera = new THREE.PerspectiveCamera();
		this.camera.fov = 45;
		this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
		this.camera.near = 0.1;
		this.camera.far = 10000;

		this.camera.updateProjectionMatrix();
		this.camera.name = 'defaultCamera';

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( this.backgroundColor );

		if ( this.hasStats ) {

			this.stats = new Stats();
			this.stats.showPanel( 0 );
			this.container.appendChild( this.stats.dom );

		}

		this.cameraControls = new THREE.TrackballControls( this.camera, this.renderer.domElement );
		this.cameraControls.target.set( 0, 0, 0 );

		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();

		let fogColor = new THREE.Color( 0xffffff );

		this.scene.fog = new THREE.Fog( fogColor, 0.0025, 5000 );

	},

	updateCamera: function() {

		let modelDepth = this.layers.length;
		let controlRatio = getControlRatio( modelDepth );

		this.camera.position.set(

			0,
			0,
			controlRatio * DefaultCameraPos * modelDepth / DefaultLayerDepth

		);

		// as strategy can not directly be applied to model when layer depth is too small, add a control ratio to move camera farther
		function getControlRatio( depth ) {

			if ( depth > 5 ) {

				return 1;

			} else if ( depth >= 3 && depth < 5 ) {

				return 1.5;

			} else {

				return 2;

			}

		}

	},

	// use animate scene
	animate: function() {

		let delta = this.clock.getDelta();

		this.cameraControls.update( delta );

		if ( this.hasStats ) {

			this.stats.update();

		}

		TWEEN.update();

		this.renderer.render( this.scene, this.camera );

		requestAnimationFrame( function() {

			this.animate();

		}.bind( this ) );

	},

	registerModelEvent: function() {

		window.addEventListener( 'resize', function() {

			this.onResize();

		}.bind( this ), false );

		this.sceneArea.addEventListener( 'mousemove', function( event ) {

			this.onMouseMove( event );

		}.bind( this ), true );

		this.sceneArea.addEventListener( 'click', function( event ) {

			this.onClick( event );

		}.bind( this ), true );

	},

	onResize: function() {

		this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );

	},

	/**
	 * ============
	 *
	 * Functions below are abstract method for Layer.
	 * SubClasses ( specific Model ) override these abstract methods.
	 *
	 * ============
	 */

	/**
	 * onClick(), abstract method.
	 *
	 * Override this function to add handler for click event.
	 *
	 * @param event
	 */

	onClick: function( event ) {

	},

	/**
	 * onMouseMove(), abstract method.
	 *
	 * Override this function to add handler for mouse move event.
	 *
	 * @param event
	 */

	onMouseMove: function( event ) {

	}

};

export { SceneInitializer };