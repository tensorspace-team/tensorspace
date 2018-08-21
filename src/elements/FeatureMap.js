import ColorUtils from '../utils/ColorUtils';

function FeatureMap(width, height, center) {

	this.fmWidth = width;
	this.fmHeight = height;
	this.fmCenter = center;

	this.featureMap = undefined;

	this.initFeatureMap();
}

FeatureMap.prototype = {

	initFeatureMap: function() {

		let geometry = new THREE.BoxGeometry(this.fmWidth, 1, this.fmHeight, this.fmWidth, 1, this.fmHeight);
		let material = new THREE.MeshBasicMaterial({
			vertexColors: THREE.FaceColors
		});

		let cube = new THREE.Mesh(geometry, material);

		cube.position.set(this.fmCenter.x, this.fmCenter.y, this.fmCenter.z);

		this.featureMap = cube;

	},

	getMapElement: function() {
		return this.featureMap;
	},

	updateGrayScale: function(greyPixelArray) {

		for ( let i = 0; i < greyPixelArray.length; i ++ ) {

			let rgb = greyPixelArray[i];

			this.featureMap.geometry.faces[ this.fmHeight * 2 * 2 + 2 * i ].color.setRGB( rgb[0], rgb[1], rgb[2] );
			this.featureMap.geometry.faces[ this.fmHeight * 2 * 2 + 2 * i + 1 ].color.setRGB( rgb[0], rgb[1], rgb[2] );
			this.featureMap.geometry.faces[ this.fmHeight * 2 * 2 + this.fmWidth * this.fmHeight * 2 + 2 * i ].color.setRGB( rgb[0], rgb[1], rgb[2] );
			this.featureMap.geometry.faces[ this.fmHeight * 2 * 2 + this.fmWidth * this.fmHeight * 2 + 2 * i + 1 ].color.setRGB( rgb[0], rgb[1], rgb[2] );
		}
		this.featureMap.geometry.colorsNeedUpdate = true;

	},

	updateRGBScale: function(rgbPixelArray) {

		for ( let i = 0; i < rgbPixelArray.length; i += 3 ) {
			this.featureMap.geometry.faces[ this.fmHeight * 2 * 2 + 2 * i ].color.setRGB( rgbPixelArray[i], rgbPixelArray[i + 1], rgbPixelArray[i + 2] );
			this.featureMap.geometry.faces[ this.fmHeight * 2 * 2 + 2 * i + 1 ].color.setRGB( rgbPixelArray[i], rgbPixelArray[i + 1], rgbPixelArray[i + 2] );
			this.featureMap.geometry.faces[ this.fmHeight * 2 * 2 + this.fmWidth * this.fmHeight * 2 + 2 * i ].color.setRGB( rgbPixelArray[i], rgbPixelArray[i + 1], rgbPixelArray[i + 2] );
			this.featureMap.geometry.faces[ this.fmHeight * 2 * 2 + this.fmWidth * this.fmHeight * 2 + 2 * i + 1 ].color.setRGB( rgbPixelArray[i], rgbPixelArray[i + 1], rgbPixelArray[i + 2] );
		}
		this.featureMap.geometry.colorsNeedUpdate = true;

	}

};

export default FeatureMap;