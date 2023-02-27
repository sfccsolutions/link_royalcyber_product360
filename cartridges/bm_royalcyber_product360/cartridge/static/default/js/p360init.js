function getMeta(url, callback) {
	var img = new Image();
	img.src = url;
	img.onload = function() {
	callback(this.width, this.height);
	}
}
var pref = JSON.parse(jQuery('#p360Images').val());
var p360Preferences = JSON.parse(jQuery('#p360Preferences').val());
if(pref[0]){
	if (pref[0].indexOf("http://") == 0 || pref[0].indexOf("https://") == 0) {
		var imageLocation = pref[0];
	} else {
    var imageLocation = imageDir+pref[0];    
	}
	jQuery(document).ready(function(){
		getMeta(imageLocation,
				function(width, height) {
					jQuery("#p360").p360(
							{
								imageDir:imageDir,
								imageCount:length,
								canvasID:'p360canvas',
								canvasWidth:540,
								canvasHeight:540,
								p360Images:pref,
								imageWidth:width,
								imageHeight:height,
								p360Preferences:p360Preferences
							});
				});	
		});
}