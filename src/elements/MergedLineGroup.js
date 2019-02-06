/**
 * @author syt123450 / https://github.com/syt123450
 */

function MergedLineGroup( layer, context, neuralGroup, color, minOpacity ) {

	this.layer = layer;
	this.context = context;
	this.neuralGroup = neuralGroup;
	this.color = color;
	this.minOpacity = minOpacity;

	this.straightLineGroup = undefined;
	this.curveLineGroup = undefined;

	this.init();

}

MergedLineGroup.prototype = {

	init: function() {

		let lineMat = new THREE.LineBasicMaterial( {

			opacity: this.minOpacity,
			transparent:true,
			vertexColors: THREE.VertexColors

		} );

		let straightLineGeo = new THREE.Geometry();
		straightLineGeo.dynamic = true;
		this.straightLineGroup = new THREE.Line( straightLineGeo, lineMat );

		let curveLineGeo = new THREE.Geometry();
		curveLineGeo.dynamic = true;
		this.curveLineGroup = new THREE.Line( curveLineGeo, lineMat );

	},

	getLineGroupParameters: function( selectedElement ) {

		this.context.updateMatrixWorld();

		let straightLineColors = [];
		let straightLineVertices = [];

		let curveLineColors = [];
		let curveLineVertices = [];

		let relatedElements = this.layer.getRelativeElements( selectedElement );

		let straightElements = relatedElements.straight;
		let curveElements = relatedElements.curve;
        
        selectedElement.parent.updateMatrixWorld();
		
        let lineStartPos = new THREE.Vector3();
        selectedElement.getWorldPosition( lineStartPos );
        this.neuralGroup.worldToLocal( lineStartPos );

		for ( let i = 0; i < straightElements.length; i ++ ) {

			straightLineColors.push( new THREE.Color( this.color ) );
			straightLineColors.push( new THREE.Color( this.color ) );
            
            straightElements[ i ].parent.updateMatrixWorld();
            
            let relativePos = new THREE.Vector3();
            straightElements[ i ].getWorldPosition( relativePos );
            this.neuralGroup.worldToLocal( relativePos );

			straightLineVertices.push( relativePos );
			straightLineVertices.push( lineStartPos );

		}

		for ( let i = 0; i < curveElements.length; i ++ ) {

			let startPos = lineStartPos;
            
            curveElements[ i ].parent.updateMatrixWorld();
			
			let endPos = new THREE.Vector3();
			curveElements[ i ].getWorldPosition( endPos );
            this.neuralGroup.worldToLocal( endPos );
			
			let startEndDistance = startPos.y - endPos.y;
			let controlTranslateXVector;

			if ( startPos.x >= 0 ) {

				controlTranslateXVector = new THREE.Vector3( this.layer.actualWidth + startEndDistance, 0, 0 );

			} else {

				controlTranslateXVector = new THREE.Vector3( - this.layer.actualWidth - startEndDistance, 0, 0 );

			}

			let firstControlPointPos = startPos.clone().add( controlTranslateXVector );
			let secondControlPointPos = endPos.clone().add( controlTranslateXVector );

			let curve = new THREE.CubicBezierCurve3(

				startPos,
				firstControlPointPos,
				secondControlPointPos,
				endPos

			);

			let points = curve.getPoints( 50 );

			for ( let i = 0; i < points.length; i ++ ) {

				curveLineVertices.push( points[ i ] );
				curveLineColors.push( new THREE.Color( this.color ) );

			}

			for ( let i = points.length - 1; i >= 0; i -- ) {

				curveLineVertices.push( points[ i ] );
				curveLineColors.push( new THREE.Color( this.color ) );

			}

		}

		return {

			straight: {

				lineColors: straightLineColors,
				lineVertices: straightLineVertices

			},

			curve: {

				lineColors: curveLineColors,
				lineVertices: curveLineVertices

			}

		}

	},

	showLines: function( selectedElement ) {

		let lineGroupParameters = this.getLineGroupParameters( selectedElement );

		let straightParameters = lineGroupParameters.straight;
		let curveParameters = lineGroupParameters.curve;

		this.straightLineGroup.geometry = this.createGroupGeometry(

			straightParameters.lineVertices,
			straightParameters.lineColors

		);

		this.straightLineGroup.material.needsUpdate = true;

		this.neuralGroup.add( this.straightLineGroup );

		this.curveLineGroup.geometry = this.createGroupGeometry(

			curveParameters.lineVertices,
			curveParameters.lineColors

		);

		this.curveLineGroup.material.needsUpdate = true;

		this.neuralGroup.add( this.curveLineGroup );

	},

	hideLines: function() {

		this.straightLineGroup.geometry.dispose();
		this.neuralGroup.remove( this.straightLineGroup );

		this.curveLineGroup.geometry.dispose();
		this.neuralGroup.remove( this.curveLineGroup );

	},

	createGroupGeometry: function( lineVertices, lineColors) {

		let geometry = new THREE.Geometry( {

			transparent:true,
			opacity: this.minOpacity

		} );

		geometry.colors = lineColors;
		geometry.vertices = lineVertices;
		geometry.colorsNeedUpdate = true;
		geometry.verticesNeedUpdate = true;

		return geometry;

	}

};

export { MergedLineGroup };