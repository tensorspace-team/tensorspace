/**
 * @author syt123450 / https://github.com/syt123450
 */

const HTMLUtils = ( function() {
	
	function isElement( o ){
		
		return (
			
			typeof HTMLElement === "object" ? o instanceof HTMLElement :
				o &&
				typeof o === "object" &&
				o !== null &&
				o.nodeType === 1 &&
				typeof o.nodeName==="string"
		
		);
		
	}
	
	return {
		
		isElement: isElement
		
	}
	
} )();

export { HTMLUtils };