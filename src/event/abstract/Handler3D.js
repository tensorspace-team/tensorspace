/**
 * @author syt123450 / https://github.com/syt123450
 */

function Handler3D( tspModel ) {

	this.tspModel = tspModel;
	
	/**
	 * Record layer hovered by mouse now.
	 *
	 * @type { Layer }
	 */
	
	this.hoveredLayer = undefined;
	
	/**
	 * Record Emissive element.
	 *
	 * @type { THREE.Object }
	 */
	
	this.hoveredEmissive = undefined;
	
}

Handler3D.prototype = {

	handleClick: function() {
	
	},
	
	handleHover: function( intersects ) {
		
	}
	
};

export { Handler3D };