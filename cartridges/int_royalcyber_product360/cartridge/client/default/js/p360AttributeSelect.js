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

/* global $, p360Preferences*/

$(document).ready(function () {
    $('body').on('product:afterAttributeSelect', function (e, response) {
        var p360Preferences = JSON.parse($('#p360Preferences').val());
        if (response.data.product.p360Enabled && response.data.product.P360Publish && response.data.product.P360Images) {
            var P360Images = JSON.parse(response.data.product.P360Images);
            var imageArray = P360Images.p360;
            var imageLocation;
            var autoRotateInterval;
            if (P360Images.p360.length > 0) {
                $('.carousel-item').removeClass('active');

                $('<div class="carousel-item active">'
				+ '<div class="p360init">'
				+ '<div id="p360">'
				+ '<ul class="rotate-links">'
				+ '<li><a href="#" class="rotate-left"></a></li>'
				+ '<li><a href="#" class="rotate-right"></a></li>'
				+ '<li><a id="tb360Zoom" class="zoomin_button" title="Zoom in / out" style="cursor: e-resize;"></a></li>'
				+ '<li><a href="#" class="autospin"></a></li>'
				+ '<li><a href="#" id="fscreen" class="fullscreenbtn"></a></li>'
				+ '</ul>'
				+ '<div class="drag-to-spin"></div>'
				+ '</div>'
				+ '</div>'
				+ '</div>').appendTo($('.carousel').find('.carousel-inner'));

                if (response.data.P360AutoRotateIntervalProduct) {
                    autoRotateInterval = response.data.P360AutoRotateIntervalProduct;
                } else {
                    autoRotateInterval = p360Preferences.P360AutoRotateInterval;
                }
            } else {
                response.container.find('.p360init').empty().html();
            }
            if (imageArray[0]) {
                if (imageArray[0].indexOf('http://') === 0 || imageArray[0].indexOf('https://') === 0) {
                    imageLocation = imageArray[0];
                } else {
                    imageLocation = response.data.product.basePath + imageArray[0];
                }

                getMeta(imageLocation,
							function (width, height) {
    $('#p360').p360(
        {
            imageDir: response.data.product.basePath,
            imageCount: imageArray.length,
            canvasID: 'p360canvas',
            canvasWidth: 540,
            canvasHeight: 540,
            autoRotate: false,
            p360Images: imageArray,
            imageWidth: width,
            imageHeight: height,
            p360Preferences: p360Preferences,
            autoRotateInterval: autoRotateInterval

        });
});
            }
        } else {
            response.container.find('.p360init').empty().html();
        }
    });
});
