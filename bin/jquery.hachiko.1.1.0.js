/**
 * This plugin clones the specified element anc creates a clone that could be fixed positioned on the screen 
 */
(function($) {
	
	$.fn.hachiko = function(options) 
	{
		var opts = $.extend({}, $.fn.hachiko.options, options);
		
		return this.each(function() {
			opts.element = $(this);
			
			$.hachiko._updateOriginalToMatchClone(opts); //always make sure to update original in case there is already a clone
			if(!isDestroyCommand(opts)) {
				$.hachiko._init(opts);
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
	 * @param parent, DOM elment to insert the clone, if not set, the body will be used
	 */
	$.fn.hachiko.options = 
	{
		top: null,
		bottom: null,
		left: null,
		right: null,
		element: "",
		parent: null,
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
    	DATA_CLONE_REFERENCE : "hachiko_clone_reference", 
    	ORIGINAL_ELEMENT_CLASS : "hachiko_original_element",
    	DESTROY_COMMAND : "destroy",
    	
    	/**
    	 * initialize by storing the options in the DOM
    	 * @param options, object 
    	 */
    	_init: function(options)
    	{
    		var element = options && options.element ? options.element : undefined;
    		if(element)
    		{
    			//remove any previous clone
    			this._destroy(options);
    			
    			//store options in the DOM
    			$(element).data(this.NAMESPACE, options).addClass(this.ORIGINAL_ELEMENT_CLASS);
    			
    			//attach window scroll event handler
    			var self = this;
    			var scrollEvent = "scroll." + this.NAMESPACE;
    			$(window).on(scrollEvent, function(event){
    				self._onWindowScroll(event);
    			}).trigger(scrollEvent);
    		}
    	},
    	
    	/**
    	 * make the original element invisible and create the clone with a fixed position
    	 * only create a clone if element doesn't already have a clone on the page
    	 * @param options, object
    	 */
    	_createClone: function(options)
    	{
    		var element = options && options.element ? options.element : undefined;
    		var hasClone = $(element).attr(this.ATTRIBUTE_CLONE_CLASS);
    		if(element && !hasClone) 
    		{
    			//create clone
    			var cloneClass = this.NAMESPACE + "_" + Math.round(Math.random() * 10000000);
    			var clone = $(element).clone(true, true); //deep cloning with data and events
    			$(clone).removeClass(this.ORIGINAL_ELEMENT_CLASS).addClass(cloneClass).css("position", "fixed");
    			
    			//defaults if nothing is set
    			if(options.top == null && options.bottom == null) {
    				options.top = 0;
    			}
    			if(options.left == null && options.right == null) {
    				options.left = 0;
    			}
    			if(!options.parent) {
    				options.parent = $("body");
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
    			if(options.right != null) {
    				$(clone).css("right", options.right);
    			}
    			
    			//add clone to page
    			$(options.parent).append(clone);
    			$(element).attr(this.ATTRIBUTE_CLONE_CLASS, cloneClass); //add class so it can be selected on window scroll
    			$(element).data(this.DATA_CLONE_REFERENCE, clone);
    		}
    	},
    	
    	/**
    	 * remove the clone from the page
    	 * does not remove the options from the original element
    	 * @param options, object 
    	 */
    	_removeClone: function(options)
    	{
    		var element = options && options.element ? options.element : undefined;
    		if(element){
    			var cloneClass = $(element).attr(this.ATTRIBUTE_CLONE_CLASS);
    			$("." + cloneClass).remove();
    			$(element).removeAttr(this.ATTRIBUTE_CLONE_CLASS);
    			$(element).removeData(this.DATA_CLONE_REFERENCE);
    		}
    	},
    	
    	/**
    	 * clone the clone and append it to where the original element was in the DOM
    	 * so the state could be preserved
    	 * @param options, object 
    	 */
    	_updateOriginalToMatchClone: function(options)
    	{
    		var element = options && options.element ? options.element : undefined;
    		if(element){
    			var cloneClass = $(element).attr(this.ATTRIBUTE_CLONE_CLASS);
    			var clone = $("." + cloneClass);
    			if(clone.size() > 0)
    			{
    				var clone2 = $(clone).clone(true, true);
	    			$(clone2).attr(this.ATTRIBUTE_CLONE_CLASS, cloneClass).removeClass(cloneClass)
	    				.addClass(this.ORIGINAL_ELEMENT_CLASS); //make the clone an original element
	    			$(clone2).css({position: "", top: "", bottom: "", left: "", right: ""}); //remove all added css from hachiko
	    			$(element).after(clone2).remove();
	    			options.element = $(clone2);
    			}
    		}
    	},
    	
    	/**
    	 * when window scroll is detected
    	 * go through all hachiko elements and determine if a clone should be created/shown or removed
    	 * @param event, window scroll event 
    	 */
    	_onWindowScroll: function(event) 
    	{
    		var self = this;
    		var elements = $("." + this.ORIGINAL_ELEMENT_CLASS);
    		$(elements).each(function(){
    			var options = $(this).data(self.NAMESPACE);
    			var originalTop = $(this).offset().top;
    			var currentTop = $(window).scrollTop();
    			
    			var amount = options.top != null ? options.top : 0;
    			if( currentTop >= (originalTop - amount) ) {
    				self._createClone(options);
    				$(this).css("visibility", "hidden");
    			}
    			else {
    				self._updateOriginalToMatchClone(options); //will show original by default
    				self._removeClone(options);
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
    			this._removeClone(options);
    			$(element).css("visibility", "").removeClass(this.ORIGINAL_ELEMENT_CLASS).data(this.NAMESPACE, null);
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
    	},
    	
    	/**
    	 * get the reference to the clone DOM element
    	 * @param element, sticky DOM element 
    	 * @return clone, DOM element
    	 */
    	getStickiedElement: function(element) {
    		var clone = $(element).data(this.DATA_CLONE_REFERENCE);
    		return clone;
    	}
		
    }
    
});






