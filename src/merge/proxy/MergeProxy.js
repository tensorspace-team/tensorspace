/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergedLayerFactory } from '../factory/MergedLayerFactory';
import { MergeValidator } from '../../utils/MergeValidator';

function MergeProxy( operatorType, layerList, config ) {
	
	this.operatorType = operatorType;
	this.layerList = layerList;
	this.config = config;
	
	/**
	 * Reshape layer is a proxy, store reference of actual layer.
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
	
	this.isMerged = true;
	
}

MergeProxy.prototype = {
	
	/**
	 * createActualLayer(), create actual merged layer through MergedLayerFactory.
	 */
	
	createActualLayer: function() {
		
		this.actualLayer = MergedLayerFactory.createMergedLayer(
			
			this.operatorType,
			this.layerList,
			this.config
			
		);
		
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
		
		// make sure the input elements have the same dimension.
		
		MergeValidator.validateDimension( this.layerList );
		this.createActualLayer();
		this.updateLayerMetric();
		
		this.actualLayer.setShape( shape );
		
	},
	
	assemble: function() {
		
		if ( this.actualLayer === undefined ) {
			
			// make sure the input elements have the same dimension.
			
			MergeValidator.validateDimension( this.layerList );
			this.createActualLayer();
			this.updateLayerMetric();
			
		}
		
		this.actualLayer.assemble();
		this.updateLayerMetric();
		
	}
	
};

export { MergeProxy };