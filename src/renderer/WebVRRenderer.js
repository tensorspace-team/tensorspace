/**
 * @author syt123450 / https://github.com/syt123450
 */

import { ModelRenderer } from './ModelRenderer';

function WebVRRenderer( tspModel, handlers ) {
	
	ModelRenderer.call( this, tspModel, handlers );
	
	this.container = tspModel.container;
	
	this.scene = undefined;
	this.camera = undefined;
	this.renderer = undefined;
	this.raycaster = undefined;
	
	this.backgroundColor = undefined;
	
	this.sceneArea = undefined;
	
	this.controller = undefined;
	
	this.tempMatrix = undefined;
	
	this.selecting = false;
	
	this.selectStartObject = undefined;
	
	this.controllerAngle = {
		
		x: undefined,
		y: undefined,
		z: undefined
		
	};
	
	this.previousClicked = undefined;
	this.clickTime = undefined;
	
}

WebVRRenderer.prototype = Object.assign( Object.create( ModelRenderer.prototype ), {
	
	init: function() {
		
		this.createScene();
		this.registerEvent();
		this.animate();
		
	},
	
	reset: function() {
	
	
	
	},
	
	createScene: function() {
		
		// Must include "viewport". Otherwise display of VR activation button will be incorrect
		
		let link = document.createElement( 'meta' );
		link.name = "viewport";
		link.content = "width=device-width, initial-scale=1.0, user-scalable=no";
		document.getElementsByTagName( 'head' )[ 0 ].appendChild( link );
		
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
		
		this.renderer = new THREE.WebGLRenderer( {
			
			canvas: sceneArea,
			antialias: true
			
		} );
		
		this.renderer.setSize( sceneArea.width, sceneArea.height );
		this.renderer.vr.enabled = true;
		this.container.appendChild( this.renderer.domElement );
		
		this.camera = new THREE.PerspectiveCamera();
		this.camera.fov = 45;
		this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
		this.camera.near = 0.1;
		this.camera.far = 10000;
		
		this.camera.updateProjectionMatrix();
		this.camera.name = 'defaultCamera';
		
		this.scene = new THREE.Scene();
		
		this.raycaster = new THREE.Raycaster();
		
		document.body.appendChild( WEBVR.createButton( this.renderer ) );
		
		this.controller = this.renderer.vr.getController( 0 );
		this.scene.add( this.controller );
		
		let geometry = new THREE.BufferGeometry().setFromPoints( [
			
			new THREE.Vector3( 0, 0, 0 ),
			new THREE.Vector3( 0, 0, - 1 )
		
		] );
		
		let line = new THREE.Line( geometry );
		line.name = 'line';
		line.scale.z = 1000;
		
		this.controller.add( line );
		
		this.tempMatrix = new THREE.Matrix4();
		this.clickTime = Date.now();
		
		this.tspModel.modelContext.position.set(0, 0, - 500);
		
		this.scene.add( this.tspModel.modelContext );
		
	},
	
	animate: function() {
		
		this.intersectObjects( this.controller );
		
		TWEEN.update();
		
		this.renderer.render( this.scene, this.camera );
		this.renderer.setAnimationLoop( function() {
			
			this.animate();
			
		}.bind( this ) );
		
	},
	
	registerEvent: function() {
		
		window.addEventListener( 'resize', function() {
			
			this.onResize();
			
		}.bind( this ), false );
		
		this.controller.addEventListener( 'selectstart', function( event ) {
			
			this.onSelectStart( event );
			
		}.bind( this ) );
		
		this.controller.addEventListener( 'selectend', function( event ) {
			
			this.onSelectEnd( event );
			
		}.bind( this ) );
		
	},
	
	onResize: function() {
		
		this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
		
	},
	
	onSelectStart: function( event ) {
		
		let controller = event.target;
		let intersections = this.getIntersections( controller );
		let hasSelected = false;
		let clickedElement = undefined;
		
		if ( intersections.length > 0 ) {
			
			for ( let i = 0; i < intersections.length; i ++ ) {
				
				if ( intersections[ i ].object.type === "Mesh" &&
					intersections[ i ].object.ignore === undefined ) {
					
					if ( intersections[ i ].object.draggable ) {
						
						this.selectStartObject = intersections[ i ].object;
						this.tempMatrix.getInverse( controller.matrixWorld );
						
						let object = this.tspModel.modelContext;
						object.matrix.premultiply( this.tempMatrix );
						object.matrix.decompose( object.position, object.quaternion, object.scale );
						controller.add( object );
						
						controller.userData.selected = object;
						
					}
					
					hasSelected = true;
					
					clickedElement = intersections[ i ].object;
					
					break;
					
				}
				
			}
			
		}
		
		this.handleDoubleClick( clickedElement );
		
		this.controllerAngle.x = controller.rotation._x;
		this.controllerAngle.y = controller.rotation._y;
		this.controllerAngle.z = controller.rotation._z;
		
		this.selecting = true;
		
	},
	
	onSelectEnd: function( event ) {
		
		let controller = event.target;
		
		if ( controller.userData.selected !== undefined ) {
			
			let object = controller.userData.selected;
			object.matrix.premultiply( controller.matrixWorld );
			object.matrix.decompose( object.position, object.quaternion, object.scale );
			this.scene.add( this.tspModel.modelContext );
			
			controller.userData.selected = undefined;
			
			let intersections = this.getIntersections( controller );
			
			if ( intersections.length > 0 ) {
				
				for ( let i = 0; i < intersections.length; i ++ ) {
					
					if ( intersections[ i ].object.clickable &&
						this.selectStartObject === intersections[ i ].object ) {
						
						this.handlers.handleClick( this.selectStartObject );
						
					}
					
				}
				
			}
			
		}
		
		this.selecting = false;
		
		this.controllerAngle.x = undefined;
		this.controllerAngle.y = undefined;
		this.controllerAngle.z = undefined;
		
		this.selectStartObject = undefined;
		
	},
	
	getIntersections: function ( controller ) {
		
		this.tempMatrix.identity().extractRotation( controller.matrixWorld );
		this.raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
		this.raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( this.tempMatrix );
		
		return this.raycaster.intersectObjects( this.scene.children, true );
		
	},
	
	intersectObjects: function ( controller ) {
		
		if ( this.selecting && this.selectStartObject === undefined ) {
			
			this.rotateModel( controller );
			
		}
		
		let line = controller.getObjectByName( 'line' );
		let intersections = this.getIntersections( controller );
		
		let hasHoverable = false;
		
		if ( intersections.length > 0 ) {
			
			for ( let i = 0; i < intersections.length; i ++ ) {
				
				let intersection = intersections[ i ];
				
				if ( intersection.object.type === "Mesh" &&
					intersection.object.hoverable ) {
					
					let object = intersection.object;
					line.scale.z = intersection.distance;
					
					this.handlers.handleHoverIn(object);
					
					hasHoverable = true;
					
					break;
					
				}
				
			}
			
		}
		
		if ( !hasHoverable ) {
			
			this.handlers.handleHoverOut();
			
		}
		
	},
	
	rotateModel: function( controller ) {
		
		let xDiff = controller.rotation._x - this.controllerAngle.x;
		let yDiff = controller.rotation._y - this.controllerAngle.y;
		let zDiff = controller.rotation._z - this.controllerAngle.z;
		
		this.tspModel.modelContext.rotateX( - xDiff );
		this.tspModel.modelContext.rotateY( - yDiff );
		this.tspModel.modelContext.rotateZ( - zDiff );
		
		this.controllerAngle.x = controller.rotation._x;
		this.controllerAngle.y = controller.rotation._y;
		this.controllerAngle.z = controller.rotation._z;
		
	},
	
	handleDoubleClick: function( clickedElement ) {
		
		let clickTimeNow = Date.now();
		
		if ( this.previousClicked === undefined ) {
			
			if ( clickedElement === undefined ) {
				
				if ( clickTimeNow - this.clickTime < 1000 ) {
					
					this.tspModel.modelContext.position.z -= 100;
					
				}
				
			}
			
		} else {
			
			if ( clickedElement !== undefined &&
				this.previousClicked === clickedElement ) {
				
				if ( clickTimeNow - this.clickTime < 1000 ) {
					
					this.tspModel.modelContext.position.z += 100;
					
				}
				
			}
			
		}
		
		this.previousClicked = clickedElement;
		this.clickTime = clickTimeNow;
		
	}
	
} );

export { WebVRRenderer };