 /**
 * Function to Get Meta
 * @param {string} url - url
 * @param {string} callback - callback
 */
function getMeta(url, callback) {
    var img = new Image();
    img.src = url;
    img.onload = function () {
        callback(this.width, this.height);
    };
}

/* global pref, $, imageDir, p360Preferences, autoRotateInterval*/

var imageLocation;
var pref = JSON.parse($('#p360Images').val());
var p360Preferences = JSON.parse($('#p360Preferences').val());
if (pref[0]) {
    if (pref[0].indexOf('http://') === 0 || pref[0].indexOf('https://') === 0) {
        imageLocation = pref[0];
    } else {
        imageLocation = imageDir + pref[0];
    }

    $(document).ready(function () {
        getMeta(imageLocation,
				function (width, height) {
    $('#p360').p360(
        {
            imageDir: imageDir,
            imageCount: length,
            canvasID: 'p360canvas',
            canvasWidth: 540,
            canvasHeight: 540,
            p360Images: pref,
            imageWidth: width,
            imageHeight: height,
            p360Preferences: p360Preferences,
            autoRotateInterval: autoRotateInterval

        });
});
    });
}
