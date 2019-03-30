/**
 * @author syt123450 / https://github.com/syt123450
 */

const LayerShapeGenerator = ( function() {
	
	function getShapes( tspModel ) {
		
		const loadedModel = tspModel.resource;
		
		const inputs = loadedModel.inputs;
		let inputShapes;
		
		const isDynamicalShape = checkInputShapes( inputs );
		
		if ( !isDynamicalShape ) {
			
			inputShapes = [];
			
			for ( let i = 0; i < inputs.length; i ++ ) {
				
				inputShapes.push( inputs[ i ].shape.slice( 1 ) );
				
			}
			
		} else {
		
			if ( tspModel.modelType === "Sequential" ) {
				
				inputShapes = tspModel.layers[ 0 ].config.shape;
				
			} else {
				
				inputShapes = [];
				
				const inputTspLayers = tspModel.inputs;
				
				for ( let i = 0; i < inputTspLayers.length; i ++ ) {
					
					inputShapes.push( inputTspLayers[ i ].config.shape );
					
				}
			
			}
		
		}
		
		const outputShapes = [];
		
		let predictInput;
		
		if ( inputShapes.length === 1 && tspModel.modelType === "Sequential" ) {
			
			const shape = inputShapes[ 0 ];
			const flattenLength = getShapeFlattenLength( shape );
			
			predictInput = new Float32Array( flattenLength );
			
		} else {
			
			predictInput = [];
			
			for ( let i = 0; i < inputShapes.length; i ++ ) {
				
				const shape = inputShapes[ i ];
				const flattenLength = getShapeFlattenLength( shape );
				
				predictInput.push( new Float32Array( flattenLength ) );
				
			}
			
		}
		
		const predictResult = tspModel.predictor.predict( predictInput );
		
		for ( let i = 0; i < predictResult.length; i ++ ) {
			
			outputShapes.push( predictResult[ i ].shape.slice( 1 ) );
			
		}
		
		return {
			
			inputShapes: inputShapes,
			outputShapes: outputShapes
			
		}
		
	}
	
	function getShapeFlattenLength( shape ) {
		
		let length = 1;
		
		for ( let i = 0; i < shape.length; i ++ ) {
			
			length *= shape[ i ];
			
		}
		
		return length;
 	
	}
	
	function checkInputShapes( inputs ) {
		
		for ( let i = 0; i < inputs.length; i ++ ) {
			
			const inputShape = inputs[ i ].shape;
			
			for ( let j = 1; j < inputShape.length; j ++ ) {
			
				if ( inputShape[ j ] === null ) {
					
					return true;
					
				}
			
			}
			
		}
		
		return false;
		
	}
	
	return {
		
		getShapes: getShapes
		
	}
	
} )();

export { LayerShapeGenerator };