;(function($){
'use strict';
	/**
	 * load object2vr 360 photos
	 * 
	 * @see https://ggnome.com/object2vr
	 * 
	 * @param  {object} options:
	 * - locationBase: path where all 360 photos are located
	 *                 this can be absolute/relative and external/local
	 *                 @note include trailing slash
	 * - mimicElement: overlay the object2vr over this element
	 *                 its properties are taken and the 360 is display on top
	 *                 @note must be a jQuery object
	 */
	window.object2vr = function(options) {
		if (options.length < 1 || options.locationBase == undefined || options.mimicElement == undefined) {
			console.notice('object2vr: missing options, provide locationBase and mimicElement');
			return;
		}
		
		if (options.mimicElement.length < 1) {
			console.notice('object2vr: can\'t find mimicElement, note it should be a jQuery object');
			return;
		}
		
		bootstrap(options);
	}
	
	/**
	 * private below
	 */
	
	var locationBase  = '';
	var mimicElement  = undefined;
	var firstPhoto    = undefined;
	var container     = undefined;
	var loadedScripts = 0;
	
	/**
	 * handle events
	 */
	jQuery('.zoombox').on('mousedown', '.thumbs a', function(event){ switchImages(event.target); });
	
	/**
	 * bootstraps and loads the object2vr
	 */
	function bootstrap(options) {
		locationBase = options.locationBase;
		mimicElement = options.mimicElement;
		
		if (locationBase.substr(-1) !== '/') {
			locationBase += '/';
		}
		
		prepareImageSwitching();
		prepareContainer();
		
		jQuery.getScript(locationBase + 'object2vr_player.js', load);
		jQuery.getScript(locationBase + 'skin.js', load);
	}
	
	/**
	 * finds the first photo in the gallery as that one needs special treatment
	 */
	function prepareImageSwitching() {
		firstPhoto = jQuery('.zoombox .thumbs > *:first img')[0]
	}
	
	/**
	 * mimic the styling of another element
	 */
	function prepareContainer() {
		container = jQuery('<div id="object2vr-container-360"></div>');
		
		container.css('display',  'none');
		container.css('position', 'absolute');
		container.css('z-index',  10);
		container.css('top',      mimicElement.offset().top);
		container.css('left',     mimicElement.offset().left);
		container.css('width',    mimicElement.width());
		container.css('height',   mimicElement.height());
		
		jQuery('body').append(container);
	}
	
	/**
	 * load the object2vr xml and show the 360 photo
	 */
	function load() {
		// wait for all scripts to load
		loadedScripts += 1;
		if (loadedScripts < 2) {
			return;
		}
		
		// sanity check in case the xml can not be found
		// this should not happen as the player and skin js files did succesfully load by now
		catchAlerts(function(){
			var player = new object2vrPlayer(container.attr('id'));
			var skin   = new object2vrSkin(player, locationBase);
			player.readConfigUrl(locationBase + 'TDMS_out.xml');
		}, function(){
			container.css('display', 'block');
		});
	}
	
	/**
	 * hides the object2vr as other images are clicked
	 * or shows when the first placeholder image is click
	 */
	function switchImages(clickedImage) {
		var newDisplay = (clickedImage == firstPhoto) ? 'block' : 'none';
		container.css('display', newDisplay);
	};
	
	/**
	 * execute code which might trigger alerts and catch those
	 * executes the successCallback only if no alerts were triggered
	 */
	function catchAlerts(executeCallback, successCallback) {
		var alertErrors = [];
		var originalAlertFunction = window.alert;
		window.alert = function(message) {
			alertErrors.push(message);
		};
		
		executeCallback();
		
		window.alert = originalAlertFunction;
		
		if (alertErrors.length == 0) {
			successCallback();
		}
	}
})(jQuery);
