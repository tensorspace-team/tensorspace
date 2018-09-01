import { DefaultCameraPos } from "../utils/Constant";
import { DefaultLayerDepth } from "../utils/Constant";

function SceneInitializer(container ) {

	this.container = container;
	this.animateFrame = undefined;

	this.scene = undefined;
	this.camera = undefined;
	this.stats = undefined;
	this.renderer = undefined;
	this.clock = undefined;
	this.cameraControls = undefined;
	this.raycaster = undefined;
	this.mouse = undefined;
	this.lines = undefined;

	this.createScene();

}

SceneInitializer.prototype = {

	dispose: function() {
		window.cancelAnimationFrame(this.animateFrame);
	},

	createScene: function() {
		console.log("creating scene...");

		let sceneArea = document.createElement( "canvas" );

		let cs = getComputedStyle( this.container );

		let paddingX = parseFloat( cs.paddingLeft ) + parseFloat( cs.paddingRight );
		let paddingY = parseFloat( cs.paddingTop ) + parseFloat( cs.paddingBottom );

		let borderX = parseFloat( cs.borderLeftWidth ) + parseFloat( cs.borderRightWidth );
		let borderY = parseFloat( cs.borderTopWidth ) + parseFloat( cs.borderBottomWidth );

		sceneArea.width = this.container.clientWidth - paddingX - borderX;
		sceneArea.height = this.container.clientHeight - paddingY - borderY;
		sceneArea.style.backgroundColor = "#ffffff";

		this.clock = new THREE.Clock();
		this.renderer = new THREE.WebGLRenderer({canvas: sceneArea, antialias: true});
		this.renderer.setSize(sceneArea.width, sceneArea.height);
		container.appendChild(this.renderer.domElement);

		this.camera = new THREE.PerspectiveCamera();
		this.camera.fov = 45;
		this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
		this.camera.near = 0.1;
		this.camera.far = 10000;

		this.camera.updateProjectionMatrix();
		this.camera.name = 'defaultCamera';

		this.scene = new THREE.Scene();

		this.stats = new Stats();
		this.stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
		container.appendChild( this.stats.dom );

		this.cameraControls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
		this.cameraControls.target.set(0, 0, 0);

		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();

		let lineMat = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1, linewidth: 20, vertexColors: THREE.VertexColors } );
		let lineGeom = new THREE.Geometry();
		lineGeom.dynamic = true;
		this.line = new THREE.Line(lineGeom, lineMat);

		this.scene.add(this.line);

		let fogColor = new THREE.Color(0xffffff);

		this.scene.fog = new THREE.Fog(fogColor, 0.0025, 5000);

	},

	updateCamera: function() {
		console.log("update camera.");

		let modelDepth = this.layers.length;
		this.camera.position.set(0, 0, 600 * (modelDepth - 1) / (DefaultLayerDepth - 1));

	},

	// 使用animate scene
	animate: function() {

		let delta = this.clock.getDelta();

		this.cameraControls.update(delta);
		this.stats.update();
		TWEEN.update();

		this.renderer.render(this.scene, this.camera);

		this.animateFrame = requestAnimationFrame( function() {
			this.animate();
		}.bind(this) );
	},

	registerModelEvent: function() {
		window.addEventListener( 'resize', function() {
			this.onResize();
		}.bind(this), false );
	},

	onResize: function() {
		this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
	},

	resetCamera: function() {
		console.log("Reset camera position.");
	}

};

export { SceneInitializer };