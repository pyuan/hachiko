/**
 * This plugin clones the specified element anc creates a clone that could be fixed positioned on the screen 
 */
(function($) {
	
	$.fn.hachiko = function(options) 
	{
		var opts = $.extend({}, $.fn.hachiko.options, options);
		
		return this.each(function() {
			opts.element = $(this);
			
			if(!isDestroyCommand(opts)) {
				$.hachiko._createClone(opts);
			}
			
			//destroy sticky cloned element
			else {
				$.hachiko._destroy(opts);
			}
	    });
	
		/**
		 * check to see if options is a destroy command
		 * @param options, object
		 * @return isDestroyCommand, boolean
		 */
	    function isDestroyCommand(options) 
	    {
	    	var command = "";
	    	for(var i=0; i<=$.hachiko.DESTROY_COMMAND.length; i++)
	    	{
	    		if(!options.hasOwnProperty(i)){
	    			break;
	    		}
	    		command += options[i];
	    	}
	    	return command == $.hachiko.DESTROY_COMMAND;
	    }
	}
	
	/**
	 * customization options
	 * @param top, int, distance in px from the top, if specified overrides bottom
	 * @param bottom, int, distance in px from the bottom
	 * @param left, int, distance in px from the left, if specified overrides right
	 * @param right, int, distance in px from the right
	 * @param element, DOM element to insert the message
	 */
	$.fn.hachiko.options = 
	{
		top: null,
		bottom: null,
		left: null,
		right: null,
		element: "",
	}

})(jQuery);

/**
 * hachiko specific functions
 */
jQuery.extend({
	
    hachiko: 
    {
    	/**** constants ****/
    	NAMESPACE : "hachiko",
    	ATTRIBUTE_CLONE_CLASS : "data-hachiko-clone",
    	ORIGINAL_ELEMENT_CLASS : "hachiko_original_element",
    	DESTROY_COMMAND : "destroy",
    	
    	/**
    	 * make the original element invisible and create the clone with a fixed position
    	 * @param options, object
    	 */
    	_createClone: function(options)
    	{
    		var element = options && options.element ? options.element : undefined;
    		if(element) {
    			//remove any previous clone
    			this._destroy(options);
    			
    			//create clone
    			var cloneClass = this.NAMESPACE + "_" + Math.round(Math.random() * 10000000);
    			var clone = $(element).clone(true, true); //deep cloning with data and events
    			$(clone).addClass(cloneClass).css("position", "fixed");
    			
    			//defaults if nothing is set
    			if(options.top == null && options.bottom == null) {
    				options.top = 0;
    			}
    			if(options.left == null && options.right == null) {
    				options.left = 0;
    			}
    			
    			//apply user defined positions
    			if(options.top != null) {
    				$(clone).css("top", options.top);
    			}
    			if(options.bottom != null) {
    				$(clone).css("bottom", options.bottom);
    			}
    			if(options.left != null) {
    				$(clone).css("left", options.left);
    			}
    			if(options.bottom != null) {
    				$(clone).css("bottom", options.bottom);
    			}
    			
    			//add clone to page
    			$("body").append(clone);
    			$(element).css("visibility", "hidden").attr(this.ATTRIBUTE_CLONE_CLASS, cloneClass)
    				.addClass(this.ORIGINAL_ELEMENT_CLASS); //add class so it can be selected on window scroll
    			
    			//attach window scroll event handler
    			var self = this;
    			var scrollEvent = "scroll." + this.NAMESPACE;
    			$(window).on(scrollEvent, function(event){
    				self._onWindowScroll(event);
    			}).trigger(scrollEvent);
    		}
    	},
    	
    	/**
    	 * when window scroll is detected
    	 * go through all hachiko elements and determine if their clone should be shown
    	 * @param event, window scroll event 
    	 */
    	_onWindowScroll: function(event) 
    	{
    		var self = this;
    		var elements = $("." + this.ORIGINAL_ELEMENT_CLASS);
    		$(elements).each(function(){
    			var cloneClass = $(this).attr(self.ATTRIBUTE_CLONE_CLASS);
    			var clone = $("." + cloneClass);
    			var originalTop = $(this).offset().top;
    			var currentTop = $(window).scrollTop();
    			
    			if(currentTop >= originalTop) {
    				$(this).css("visibility", "hidden");
    				$(clone).show();
    			}
    			else {
    				$(this).css("visibility", "visible");
    				$(clone).hide();
    			}
    		});
    	},
    	
    	/**
    	 * destroy the current message and remove all items from queue
    	 * if no element is specified, destroy all instances of the toast message
    	 * @param options, object
    	 */
    	_destroy: function(options)
    	{
    		var element = options && options.element ? options.element : undefined;
    		if(element){
    			var cloneClass = $(element).attr(this.ATTRIBUTE_CLONE_CLASS);
    			$("." + cloneClass).remove();
    			$(element).css("visibility", "").removeClass(this.ORIGINAL_ELEMENT_CLASS).removeAttr(this.ATTRIBUTE_CLONE_CLASS);
    		}
    	},
    	
    	/**
    	 * change the defaults for the plugin
    	 * @param newDefaults, object
    	 */
    	setDefaults: function(newDefaults)
    	{
    		var defaults = $.extend({}, $.fn.hachiko.options, newDefaults);
    		$.fn.hachiko.options = defaults;
    	}
		
    }
    
});






