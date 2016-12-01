# object2vr

Loading 360 photos made with [object2vr](https://ggnome.com/object2vr), specifically for [Lightspeed eCommerce](https://www.lightspeedhq.nl/ecommerce/).

This loads 360 photos over the first image in the gallery of a Lightspeed product page.


## Install

1. Download object2vr and place it on your server.
2. Upload the object2vr files (containing `TDMS_out.xml` and `images/`) to your server.
3. Load the object2vr script on the Lightspeed product page

``` html
<script type="text/javascript" src="//example.com/object2vr.js"></script>
<script type="text/javascript">
	object2vr({
		locationBase: '//example.com/object2vr' + window.location.pathname,
		mimicElement: jQuery('.zoombox .images .zoom.first'),
	});
</script>
```

Note: the example uses the pathname of the current page as an identifier for finding the object2vr files.
This is an easy way to connect products to an object2vr image. However, other ways of doing this are fine as well.


## Contribute

Pull Requests or issues are welcome!

Some ideas:

- Converting to a generic script working for other CMS environments.
- Making it independent of jQuery.


## License

[MIT](/LICENSE)
