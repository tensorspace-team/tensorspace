$(function(){
    if (window.jQuery) {  
        /**
        * Extend jQuery object to add a function that rotates a DOM element.
        *
        * @param {number} degrees
        */
        jQuery.fn.rotate = function(degrees) {
            $(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                '-moz-transform' : 'rotate('+ degrees +'deg)',
                '-ms-transform' : 'rotate('+ degrees +'deg)',
                'transform' : 'rotate('+ degrees +'deg)'});

            return $(this);
        }  
    } 
});