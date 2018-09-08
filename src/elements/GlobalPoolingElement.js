import { TextFont } from "../assets/fonts/TextFont";
import { TextHelper } from "../utils/TextHelper";
import { MinAlpha } from "../utils/Constant";
import { FrameColor } from "../utils/Constant";

function GlobalPoolingElement(actualLength, initCenter, color) {

	this.theoryLength = 1;
	this.actualLength = actualLength;

	this.unitLength = this.actualLength / this.theoryLength;

	this.color = color;

	this.center = {
		x: initCenter.x,
		y: initCenter.y,
		z: initCenter.z
	};

	this.font = TextFont;

	this.globalPoint = undefined;
	this.group = undefined;

	this.textSize = TextHelper.calcGlobalPoolingSize(this.unitLength);

	this.widthText = undefined;
	this.heightText = undefined;

	this.isTextShown = false;

	this.init();
}

GlobalPoolingElement.prototype = {

	init: function() {

		let geometry = new THREE.BoxBufferGeometry(this.actualLength, this.actualLength, this.actualLength);
		let material = new THREE.MeshBasicMaterial({
			color: this.color, opacity: MinAlpha, transparent: true
		});
		let cube = new THREE.Mesh(geometry, material);

		cube.position.set(0, 0, 0);
		cube.elementType = "globalPoolingElement";
		cube.hoverable = true;

		this.globalPoint = cube;

		let edgesGeometry = new THREE.EdgesGeometry(geometry);
		let edgesLine = new THREE.LineSegments(edgesGeometry, new THREE.LineBasicMaterial({
			color: FrameColor
		}));

		let group = new THREE.Object3D();
		group.add(cube);
		group.add(edgesLine);

		group.position.set(this.center.x, this.center.y, this.center.z);

		this.group = group;

		this.clear();

	},

	getElement: function() {
		return this.group;
	},

	updateVis: function(opacity) {
		this.globalPoint.material.opacity = opacity;
		this.globalPoint.material.needsUpdate = true;
	},

	updatePos: function(pos) {
		this.center.x = pos.x;
		this.center.y = pos.y;
		this.center.z = pos.z;
		this.group.position.set(this.center.x, this.center.y, this.center.z);
	},

	clear: function() {
		this.updateVis(MinAlpha);
	},

	setLayerIndex: function(layerIndex) {
		this.globalPoint.layerIndex = layerIndex;
	},

	setFmIndex: function(fmIndex) {
		this.globalPoint.fmIndex = fmIndex;
	},

	showText: function() {

		let material = new THREE.MeshBasicMaterial( { color: this.color } );

		let widthGeometry = new THREE.TextGeometry( this.theoryLength.toString(), {
			font: this.font,
			size: this.textSize,
			height: Math.min(this.unitLength, 1),
			curveSegments: 8,
		} );

		let widthText = new THREE.Mesh(widthGeometry, material);

		let widthTextPos = TextHelper.calcFmWidthTextPos(
			1,
			this.textSize,
			this.actualLength,
			{
				x: this.globalPoint.position.x,
				y: this.globalPoint.position.y,
				z: this.globalPoint.position.z
			}
		);

		widthText.position.set(
			widthTextPos.x,
			widthTextPos.y,
			widthTextPos.z
		);

		widthText.rotateX( - Math.PI / 2 );

		let heightGeometry = new THREE.TextGeometry( this.theoryLength.toString(), {
			font: this.font,
			size: this.textSize,
			height: Math.min(this.unitLength, 1),
			curveSegments: 8,
		} );

		let heightText = new THREE.Mesh(heightGeometry, material);

		let heightTextPos = TextHelper.calcFmHeightTextPos(
			1,
			this.textSize,
			this.actualLength,
			{
				x: this.globalPoint.position.x,
				y: this.globalPoint.position.y,
				z: this.globalPoint.position.z
			}
		);

		heightText.position.set(
			heightTextPos.x,
			heightTextPos.y,
			heightTextPos.z
		);

		heightText.rotateX( - Math.PI / 2 );

		this.widthText = widthText;
		this.heightText = heightText;

		this.group.add(this.widthText);
		this.group.add(this.heightText);
		this.isTextShown = true;

	},

	hideText: function() {
		this.group.remove(this.widthText);
		this.group.remove(this.heightText);
		this.widthText = undefined;
		this.heightText = undefined;

		this.isTextShown = false;
	}

};

export { GlobalPoolingElement }