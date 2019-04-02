/**
 * @author syt123450 / https://github.com/syt123450
 */

import { Reshape1d } from "./Reshape1d";
import { Reshape2d } from "./Reshape2d";
import { Reshape3d } from "./Reshape3d";

/**
 * Reshape layer, a proxy for actual layers.
 *
 * @param config, user's configuration for Reshape layer
 * @returns { Layer }, Reshape layer, a proxy for actual layer, Reshape1d, Reshape2d, or Reshape3d
 * @constructor
 */

function Reshape( config ) {
	
	this.config = config;
	
	/**
	 * Use State Pattern to handle reshape cases.
	 * Three States: Reshape1d, Reshape2d and Reshape3d
	 * Based on different states, create different `actualLayer`.
	 *
	 * @type { String }
	 */
	
	this.reshapeType = undefined;
	
	/**
	 * Reshape layer is a proxy, store reference of actual layer.
	 * Three types of actual layers: Reshape1d, Reshape2d, Reshape3d.
	 *
	 * @type { Layer }
	 */
	this.actualLayer = undefined;
	
	/**
	 * Attributes below are important layer metrics for a TensorSpace Layers,
	 * These metrics will be injected or updated by calling updateLayerMetric()
	 */
	
	this.name = undefined;
	this.neuralValue = undefined;
	this.inputShape = undefined;
	this.outputShape = undefined;
	
	this.autoOutputDetect = false;
	
	this.actualWidth = undefined;
	this.actualHeight = undefined;
	this.actualDepth = undefined;
	
	this.layerDimension = undefined;
	this.openFmCenters = undefined;
	
}

Reshape.prototype = {
	
	/**
	 * createActualLayer(), create actual reshape layer based on 'reshapeType'.
	 */
	
	createActualLayer: function() {
		
		if ( this.reshapeType === "Reshape1d" ) {
			
			this.actualLayer = new Reshape1d( this.config );
			
		} else if ( this.reshapeType === "Reshape2d" ) {
			
			this.actualLayer = new Reshape2d( this.config );
			
		} else if ( this.reshapeType === "Reshape3d" ) {
			
			this.actualLayer = new Reshape3d( this.config );
			
		} else {
			
			console.error( "Unsupported reshape type " + this.reshapeType );
			
		}
		
		this.updateLayerMetric();
		
	},
	
	/**
	 * updateLayerMetric()
	 *
	 * Get layer metric from actual layer.
	 * Set them to proxy layer's attribute.
	 */
	
	updateLayerMetric: function() {
		
		this.name = this.actualLayer.name;
		this.neuralValue = this.actualLayer.neuralValue;
		this.inputShape = this.actualLayer.inputShape;
		this.outputShape = this.actualLayer.outputShape;
		
		this.unitLength = this.actualLayer.unitLength;
		this.actualWidth = this.actualLayer.actualWidth;
		this.actualHeight = this.actualLayer.actualHeight;
		this.actualDepth = this.actualLayer.actualDepth;
		
		this.layerDimension = this.actualLayer.layerDimension;
		
		this.openFmCenters = this.actualLayer.openFmCenters;
		
	},
	
	/**
	 * ============
	 *
	 * Functions below are proxy functions.
	 *
	 * ============
	 */
	
	init: function( center, actualDepth ) {
		
		this.actualLayer.init( center, actualDepth );
		
	},
	
	clear: function() {
		
		this.actualLayer.clear();
		
	},
	
	reset: function() {
	
		this.actualLayer.reset();
		
	},
	
	updateValue: function( value ) {
		
		this.actualLayer.updateValue( value );
		
	},
	
	setLastLayer: function( lastLayer ) {
		
		this.actualLayer.setLastLayer( lastLayer );
		
	},
	
	setEnvironment: function( context, model ) {
		
		this.actualLayer.setEnvironment( context, model );
		
	},
	
	loadModelConfig: function( modelConfig ) {
		
		this.actualLayer.loadModelConfig( modelConfig );
		
	},
	
	setPositionMetrics: function( layerIndex, layerLevel ) {
		
		this.actualLayer.setPositionMetrics( layerIndex, layerLevel );
		
	},
	
	handleHoverIn: function( hoveredElement ) {
		
		this.actualLayer.handleHoverIn( hoveredElement );
		
	},
	
	handleHoverOut: function() {
		
		this.actualLayer.handleHoverOut();
		
	},
	
	handleClick: function( clickedElement ) {
		
		this.actualLayer.handleClick( clickedElement );
		
	},
	
	getRelativeElements: function( selectedElement ) {
	
		return this.actualLayer.getRelativeElements( selectedElement );
		
	},
	
	provideRelativeElements: function( request ) {
		
		return this.actualLayer.provideRelativeElements( request );
		
	},
	
	setShape: function( shape ) {
		
		// Based on shape dimension, update proxy states.
		
		if ( shape.length === 1 ) {
			
			this.reshapeType = "Reshape1d";
			
		} else if ( shape.length === 2 ) {
			
			this.reshapeType = "Reshape2d";
			
		} else if ( shape.length === 3 ) {
			
			this.reshapeType = "Reshape3d";
			
		} else {
			
			console.log( "Can not reshape with target shape dimension " + shape.length )
			
		}
		
		// Create actual reshape layer.
		
		this.createActualLayer();
		
		// Add shape attribute to actual reshape layer.
		
		this.actualLayer.setShape( shape );
		
	},
	
	assemble: function() {
		
		// If "setShape" has been called before, there is no need to check "shape" attribute or "targetShape" attribute in config.
		
		if ( this.reshapeType === undefined ) {
			
			// Check, update states, create actual layers.
			
			if ( this.config !== undefined && ( this.config.targetShape !== undefined || this.config.shape !== undefined ) ) {
				
				if ( this.config.targetShape !== undefined ) {
					
					if ( this.config.targetShape.length === 1 ) {
						
						this.reshapeType = "Reshape1d";
						
					} else if ( this.config.targetShape.length === 2 ) {
						
						this.reshapeType = "Reshape2d";
						
					} else if ( this.config.targetShape.length === 3 ) {
						
						this.reshapeType = "Reshape3d";
						
					} else {
						
						console.error( "Can not reshape with target shape dimension " + this.config.targetShape.length );
						
					}
					
				}
				
				if ( this.config.shape !== undefined ) {
					
					if ( this.config.shape.length === 1 ) {
						
						this.reshapeType = "Reshape1d";
						
					} else if ( this.config.shape.length === 2 ) {
						
						this.reshapeType = "Reshape2d";
						
					} else if ( this.config.shape.length === 3 ) {
						
						this.reshapeType = "Reshape3d";
						
					} else {
						
						console.error( "Can not reshape with target shape dimension " + this.config.shape.length );
						
					}
					
				}
				
				this.createActualLayer();
				
			} else {
				
				console.error( "\"targetShape\" property is required for Reshape layer." );
				
			}
			
		}
		
		this.actualLayer.assemble();
		this.updateLayerMetric();
		
	}

};

export { Reshape };