/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * EventHandler, abstract handler, should not be initialized by HandlerFactory.
 * Base class for Handler3D, HandlerVR.
 *
 * @param tspModel, TensorSpace Model reference
 * @constructor
 */

function EventHandler( tspModel ) {
	
	/**
	 * Store TensorSpace Model reference.
	 *
	 * @type { Model }
	 */
	
	this.tspModel = tspModel;
	
}

export { EventHandler };