/* global jQuery*/
/* eslint-disable no-param-reassign */
(function ($) {
    var P360 = function (element, options) {
        var view360 = $(element);
        var defaults = {
            imageDir: 'images',
            imageCount: 0,
            zoomPower: options.p360Preferences.P360ZoomPower,
            zoomRadius: options.p360Preferences.P360ZoomRadius,
            autoRotate: options.p360Preferences.P360AutoRotate,
            autoRotateInterval: options.autoRotateInterval,
            canvasWidth: 0,
            canvasHeight: 0,
            canvasID: ''

        };

        var canvas;
        var context;
        var iMouseX = 1;
        var iMouseY = 1;
        var bMouseDown = false;
        var zoom360 = false;
        var tx;
        var imgArray = [];
        var autoRotateCount = 0;
        var autoRotateTimeId = 0;
        var modulus = 0;
        var zoomOn = 0;
        var mouseDownPos = 0;
        var mouseUpPos = 0;
        var fullscreen = false;
        options = $.extend(defaults, options);

        var clear = function () {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        };
        var removeDragToSpin = function () {
            $('.drag-to-spin').fadeOut(2000);
        };
        var getImages = function () {
            for (var i = 0; i <= options.imageCount - 1; i++) {
                imgArray[i] = new Image();
                if (options.p360Images[i]) {
                    if (options.p360Images[i].indexOf('http://') === 0 || options.p360Images[i].indexOf('https://') === 0) {
                        imgArray[i].src = options.p360Images[i];
                    } else {
                        imgArray[i].src = options.imageDir + '/' + options.p360Images[i];
                    }
                }


                clear();
                // eslint-disable-next-line no-loop-func
                imgArray[i].onload = function () {
                    context.font = '10pt Calibri';
                };
            }
        };


        var showImage = function () {
            clear();
            var width = this.newWidth;
            var height = this.newHeight;
            var image = new Image();
            image.onload = function () {
                context.drawImage(image, 0, 0, width, height);
            };
            if (options.p360Images[0].indexOf('http://') === 0 || options.p360Images[0].indexOf('https://') === 0) {
                image.src = options.p360Images[0];
            } else {
                image.src = options.imageDir + '/' + options.p360Images[0];
            }
        };

        var fixDimensions = function () {
            var image = {
                width: options.imageWidth,
                height: options.imageHeight
            };
            var page = {
                width: $('#' + options.canvasID).width(),
                height: $('#' + options.canvasID).height()
            };

            var imageRatio = image.width / image.height;
            var fixHeight = true;
            var newImage = {
                left: 0,
                top: 0,
                width: 0,
                height: 0
            };
            if (fullscreen) {
                view360.find('#' + options.canvasID).css('width', '700px');
                newImage.height = page.width / imageRatio;
                newImage.width = page.width;
                newImage.left = -(newImage.width - page.width) / 2;

                if (newImage.height > page.height) {
                    newImage.height = page.height;
                    newImage.width = page.height * imageRatio;
                }
            } else if (fixHeight) {
                newImage.height = page.width / imageRatio;
                newImage.width = page.width;
                newImage.left = -(newImage.width - page.width) / 2;

                if (newImage.height > page.height) {
                    newImage.height = page.height;
                    newImage.width = page.height * imageRatio;
                }
            } else {
                newImage.height = page.width / imageRatio;
                newImage.width = page.width;
                newImage.top = -(newImage.height - page.height) / 2;
            }

            this.newHeight = newImage.height;
            this.newWidth = newImage.width;
        };

        var rotate360 = function (imgNo) {
            clear();
            context.drawImage(imgArray[imgNo], 0, 0, this.newWidth, this.newHeight);
        };

        /**
         * function Auto Rotate 360 Degree
        */
        function autoRotate360() {
            if (modulus > 0 && modulus <= options.imageCount - 1 && autoRotateCount <= 0) { autoRotateCount = modulus; }
            autoRotateCount++;
            if (autoRotateCount > options.imageCount - 1) {
                autoRotateCount = 1;
            }
            rotate360(autoRotateCount);
        }

        var startAutoRotate = function () {
            options.autoRotate = true;
            $('.autospin').addClass('active');
            autoRotateTimeId = setInterval(function () { autoRotate360(); }, options.autoRotateInterval);
        };

        /**
         * function Stop Auto Rotate 360 Degree
        */
        function stopAutoRotate() {
            options.autoRotate = false;
            clearInterval(autoRotateTimeId);
        }

        var zoom = function (image) {
            clear();
            if (zoom360) {
                context.drawImage(image, (0 - iMouseX) * (options.zoomPower - 1), (0 - iMouseY) * (options.zoomPower - 1), this.newWidth * options.zoomPower, this.newHeight * options.zoomPower);
                context.globalCompositeOperation = 'destination-atop';
                context.beginPath();
                context.arc(iMouseX, iMouseY, options.zoomRadius, 0, Math.PI * 2, true);
                context.closePath();
                context.fill();
            }
            context.drawImage(image, 0, 0, this.newWidth, this.newHeight);
        };

        var initialize = function () {
            view360.append("<canvas id='" + options.canvasID + "' width='" + options.canvasWidth + "' height='" + options.canvasHeight + "'></canvas>").css({ cursor: 'e-resize' });
            view360.css({ width: options.canvasWidth + 'px', height: options.canvasHeight + 'px', position: 'relative' });
            canvas = document.getElementById(options.canvasID);
            context = canvas.getContext('2d');
            tx = canvas.width / options.imageCount;
            clear();
            fixDimensions();
            getImages();

            showImage();

            if (options.autoRotate === true && imgArray.length > 1) {
                startAutoRotate();
            }


            $(document).on('click', '.fullscreenbtn', function () {
                var elem = document.getElementById('p360');
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) { /* Safari */
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) { /* IE11 */
                    elem.msRequestFullscreen();
                }

                setTimeout(function () {
                    $('#fscreen').removeClass('fullscreenbtn').addClass('minimizeScreen');
                    view360.addClass('fullscreen360');
                    fullscreen = true;
                    fixDimensions();
                    getImages();
                    showImage();
                }, 500);
            });
            $('#fscreen').click(function () {
                $('#p360canvas').addClass('fullscreen');
            });

            $(document).on('click', '.minimizeScreen', function () {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) { /* Safari */
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { /* IE11 */
                    document.msExitFullscreen();
                }


                setTimeout(function () {
                    $('#fscreen').removeClass('minimizeScreen').addClass('fullscreenbtn');
                    view360.removeClass('fullscreen360');
                    fullscreen = false;
                    view360.find('#' + options.canvasID).removeAttr('style');
                    fixDimensions();
                    getImages();
                    showImage();
                }, 500);
            });

            view360.find('canvas').mousemove(function (e) {
                var canvasOffset = $(canvas).offset();
                removeDragToSpin();
                iMouseX = Math.floor(e.pageX - canvasOffset.left);
                iMouseY = Math.floor(e.pageY - canvasOffset.top);
                modulus = Math.ceil(iMouseX / tx) - mouseDownPos;
			// console.log(mouseDownPos+'+++'+modulus+'+++'+mouseUpPos+'+++'+Math.ceil(iMouseX / tx));
                if (modulus <= -1) 		   {
                    modulus = options.imageCount - 1;
                } else if (modulus > options.imageCount - 1)		  {
                    modulus = 0;
                }

                if (bMouseDown === true) {
                    rotate360(modulus);
                }

                if (zoom360 === true) {
                    zoom(imgArray[zoomOn]);
                }
            });

            view360.find('.rotate-right').click(function (e) {
                e.preventDefault();
                removeDragToSpin();
                modulus++;
                if (modulus > options.imageCount - 1) {
                    modulus = 0;
                }
                rotate360(modulus);
            });

            view360.find('.rotate-left').click(function (e) {
                e.preventDefault();
                removeDragToSpin();
                modulus--;
                if (modulus <= -1) {
                    modulus = options.imageCount - 1;
                }
                rotate360(modulus);
            });
            view360.find('#' + options.canvasID).mousedown(function () { //  mousedown event
                removeDragToSpin();
                $('body').attr('unselectable', 'on').css('user-select', 'none').on('selectstart dragstart', false);
                if (mouseDownPos === 0) {
                    mouseDownPos = Math.ceil(iMouseX / tx);
                } else {
                    mouseDownPos = Math.ceil(iMouseX / tx) - mouseUpPos;
                }
                bMouseDown = true;
            });


            $(document).mouseup(function () {
                $('body').removeAttr('unselectable').removeAttr('style');
                mouseUpPos = modulus;
                bMouseDown = false;
            });


            view360.find('#tb360Zoom').click(function (e) {
                removeDragToSpin();
                if ($(this).hasClass('zoomin_button')) {
                    zoom360 = true;
                    $(this).addClass('zoomout_button');
                    $(this).removeClass('zoomin_button');
                    if (options.autoRotate === true) { stopAutoRotate(); }
                    var canvasOffset = $(canvas).offset();
                    iMouseX = Math.floor(e.pageX - canvasOffset.left);
                    iMouseY = Math.floor(e.pageY - canvasOffset.top);
                    zoomOn = Math.ceil(iMouseX / tx);
                    if (zoomOn <= 0) { zoomOn = 1; } else if (zoomOn > options.imageCount) { zoomOn = options.imageCount; }
                    $('canvas').css({ cursor: 'zoom-in' });
                    $(this).css({ cursor: 'zoom-out' });
                } else {
                    zoomOn = 0;
                    zoom360 = false;
                    $(this).addClass('zoomin_button');
                    $(this).removeClass('zoomout_button');
                    $(this).css({ cursor: 'e-resize' });
                    view360.find('#' + options.canvasID).trigger('mousedown');
                    view360.find('#' + options.canvasID).trigger('mouseup');
                    $('canvas').css({ cursor: 'e-resize' });
                    $(this).css({ cursor: 'zoom-in' });
                }
            });

            view360.find('.autospin').click(function (e) {
                e.preventDefault();
                removeDragToSpin();
                if (options.autoRotate === false) {
                    startAutoRotate();
                    $(this).addClass('active');
                }		else {
                    stopAutoRotate();
                    $(this).removeClass('active');
                }
            });
        };

        $(window).on('resize', function () {
            fixDimensions();
        });

        initialize();
    };
    $.fn.p360 = function (options) {
        return this.each(function () {
            var element = $(this);
            if (element.data('p360')) return;
            var p360 = new P360(this, options);
            element.data('p360', p360);
        });
    };
}(jQuery));
