Hachiko
=======

![Hachiko logo](http://www.paulyuan.ca/hachiko/example/logo_hachiko.gif)

A jQuery sticky plugin that allows a relatively positioned element to be stickied onto the screen when the element is scrolled outside of the viewport. Instead of changing the position of the element on window scroll, this plugin creates a clone of the original element and set the clone to be fixed positioned so the original layout is always preserved. [Example](http://paulyuan.ca/hachiko/example) 


## Required Files
	<script type="text/javascript" src="jquery.js"></script>
	<script type="text/javascript" src="jquery.hachiko.1.0.0.min.js"></script>


## Sample Usage
	
    $(DOM element).hachiko( {options} );

The following would perform keep the element with the id "element" on the screen at 0px from the top and 0px from the left:

	$("#element").hachiko({top: 0});


## Options
* **"top"** - integer value in pixels to position the element from the top after it's stickied on the screen. If specified will take precedence over "bottom".
* **"left"** - integer value in pixels to position the element from the left after it's stickied on the screen. If specified will take precedence over "right".
* **"right"** - integer value in pixels to position the element from the right after it's stickied on the screen.
* **"bottom"** - integer value in pixels to position the element from the bottom after it's stickied on the screen.
* **"parent"** - selector string or reference to the DOM element for which to insert the stickied element. This option is optional, if not specified, "body" would be used. 


## FAQ
**If I have event binding on my original element, will the sticky element retain those bindings?**
> Yes, Hachiko uses the deep clone option so all event binding will be cloned to the sticky element.

**What is "Hachiko"?**
> Hachiko is inspired from the movie about a dog (Hachiko) who waited at the train station for his owner every single day even after the owner has passed away for years. Really cool movie, based on a true story, [check it out](http://en.wikipedia.org/wiki/Hachi:_A_Dog's_Tale).


[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/5b72dbc7960186250cff181ba2cad0ac "githalytics.com")](http://githalytics.com/pyuan/hachiko)
