(function($){
   var P360 = function(element, options)
   {
       var view360 = $(element);
		var obj=this;
		var defaults = {
               imageDir:'images',
				imageCount:0,
				zoomPower:options.p360Preferences.P360ZoomPower,
				zoomRadius:options.p360Preferences.P360ZoomRadius,
				autoRotate:options.p360Preferences.P360AutoRotate,
				autoRotateInterval:p360Preferences.P360AutoRotateInterval,
				canvasWidth:0,
				canvasHeight:0,
				canvasID:''
					
            };
		
var newHeight;
var newWidth;
var canvas;
var loaded=false;
var context;
var iMouseX, iMouseY = 1;
var bMouseDown=false;
var _zoom = false;
var tx;
var img_Array=new Array();
var ga = 0.0;
var fadeTimerId = 0;
var auto_rotate_count=0;
var autoRotateTimeId=0;
var modulus=0;
var zoomOn=0;
var autorotate_button;
var mouseDownPos = 0;
var mouseUpPos = 0;
var _fullscreen = false;
options = $.extend(defaults, options);

 var clear = function(){ 
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}
 var removeDragToSpin = function(){
		$('.drag-to-spin').fadeOut(2000);
	} 
var getImages=function(){
	for(var i=0;i<=options.imageCount-1;i++){
		img_Array[i]=new Image();
		if (options.p360Images[i]){
				if (options.p360Images[i].indexOf("http://") == 0 || options.p360Images[i].indexOf("https://") == 0) {
					img_Array[i].src=options.p360Images[i];
			    }
	            else{
					img_Array[i].src=options.imageDir + "/" + options.p360Images[i];
	            }
		}
		
		
		clear();
			img_Array[i].onload=function(){
				context.font = '10pt Calibri';
			//	context.fillText('loading:'+(i-1)+"/"+options.imageCount, 150, 100);
				}
	}
}

var trimFileName = function(fileName){
	var lastDotPosition = fileName.lastIndexOf(".");
	fileName = fileName.substr(0, lastDotPosition);
	return fileName;
}


var showImage=function(){

clear();
width = this.newWidth;
height = this.newHeight;
image=new Image();
                image.onload = function()
                {
                    context.drawImage(image, 0, 0, width, height);
                };
                if (options.p360Images[0].indexOf("http://") == 0 || options.p360Images[0].indexOf("https://") == 0) {
		            image.src=options.p360Images[0];
                    }else{
                        image.src=options.imageDir + "/" + options.p360Images[0];
                    }
}

var init_=function(){
	view360.append("<canvas id='"+options.canvasID+"' width='" + options.canvasWidth +"' height='"+options.canvasHeight+"'></canvas>").css({cursor:'e-resize'});
	view360.css({width:options.canvasWidth + "px",height:options.canvasHeight + "px",position:'relative'});
	canvas = document.getElementById(options.canvasID);
	context = canvas.getContext('2d');
	tx = canvas.width/options.imageCount;
//view360.find('.autospin').css({position:"absolute",right:"1%",bottom:'1%',display:'block',padding:'5px'});
	clear();
	fixDimensions();
	getImages();
	showImage();

		if(options.autoRotate==true && typeof img_Array[options.imageCount] != 'undefined') {
			start_auto_rotate();
			view360.find(".autospin").text("Stop 360 Spin");
		}


	
view360.find('canvas').mousemove(function(e){
	var canvasOffset = $(canvas).offset();
	removeDragToSpin();
			iMouseX = Math.floor(e.pageX - canvasOffset.left);
		   iMouseY = Math.floor(e.pageY - canvasOffset.top);
			modulus= Math.ceil(iMouseX / tx)-mouseDownPos;
			//console.log(mouseDownPos+'+++'+modulus+'+++'+mouseUpPos+'+++'+Math.ceil(iMouseX / tx));
		if(modulus<=-1) 
		   { 
				modulus=options.imageCount-1;
		  }else if(modulus >options.imageCount-1)
		  {
			modulus=0;
		  }else{};	
				
		   if(bMouseDown==true){			   
				rotate360(modulus);
		   }
		   
		   if(_zoom==true){
			   zoom(img_Array[zoomOn]);
			}
});	



view360.find("#"+options.canvasID).mousedown(function(e){ //  mousedown event
	removeDragToSpin();
	$('body').attr('unselectable', 'on').css('user-select', 'none').on('selectstart dragstart', false);
	if(mouseDownPos==0){
			mouseDownPos = Math.ceil(iMouseX / tx);
		}else{
			mouseDownPos = Math.ceil(iMouseX / tx) - mouseUpPos;
		}
       bMouseDown = true;
    });


    $(document).mouseup(function(e) { 
    	$('body').removeAttr('unselectable').removeAttr('style');
    	mouseUpPos =  modulus;
		bMouseDown = false;
    });
	
	
}

var rotate360=function(img_no){
	clear();
	context.drawImage(img_Array[img_no], 0, 0, this.newWidth, this.newHeight);
}

var start_auto_rotate=function(){
	var autoInterval = jQuery('#P360AutoRotateIntervalProduct').val();
	options.autoRotate=true;
	autoRotateTimeId=setInterval(function(){auto_rotate360();},autoInterval);
}

function stop_auto_rotate(){
	options.autoRotate=false;
	clearInterval(autoRotateTimeId);
}

function auto_rotate360(){
	if(modulus>0 && modulus<=options.imageCount -1 && auto_rotate_count<=0){auto_rotate_count=modulus;} 
		auto_rotate_count++;
		if(auto_rotate_count>options.imageCount-1){
			auto_rotate_count=1;
		}
		rotate360(auto_rotate_count);
	}

var zoom=function(image) { 
    clear(); 
    if (_zoom) { 
        context.drawImage(image, 0 - iMouseX * (options.zoomPower - 1), 0 - iMouseY * (options.zoomPower - 1), this.newWidth * options.zoomPower, this.newHeight * options.zoomPower);
        context.globalCompositeOperation = 'destination-atop';
        context.beginPath();
        context.arc(iMouseX, iMouseY, options.zoomRadius, 0, Math.PI*2, true);
        context.closePath();
        context.fill();
    }
   context.drawImage(image, 0, 0, this.newWidth, this.newHeight);
}

var fixDimensions = function(){
    var image = {
    		width: options.imageWidth,    
	        height: options.imageHeight
    };
    var page = {
        width:$("#"+options.canvasID).width(),
        height:$("#"+options.canvasID).height()
    };
    
    var imageRatio = image.width/image.height;
    var pageRatio = page.width/page.height;
    var fixHeight = true;
    var newImage = {
        left:0,
        top:0,
        width:0,
        height:0
    };
    if(_fullscreen){
		view360.find("#"+options.canvasID).css('width', '700px');	
		newImage.height = page.width / imageRatio;
        newImage.width = page.width;
        newImage.left = -(newImage.width - page.width) / 2;
		
		if(newImage.height > page.height){
			newImage.height = page.height;
			newImage.width = page.height * imageRatio;
		}
		
	}else{
        if (fixHeight){
            newImage.height = page.width / imageRatio;
            newImage.width = page.width;
            newImage.left = -(newImage.width - page.width) / 2;
    		
    		if(newImage.height > page.height){
    			newImage.height = page.height;
    			newImage.width = page.height * imageRatio;
    		}
        } else {
            newImage.height = page.width / imageRatio;
            newImage.width = page.width;
            newImage.top = -(newImage.height - page.height) / 2;
        
        }
	}    
	var dimension = {"image": newImage};
					 
	this.newHeight = newImage.height;
	this.newWidth = newImage.width;
	
};
  
$(window).on("resize", function(){ 
	fixDimensions();
});


$(document).on("click",".rotate-left",function(e) {	
	e.preventDefault();
	removeDragToSpin();
	modulus--;
	if(modulus<=-1){ 
		modulus=options.imageCount-1;
	}  
	rotate360(modulus);
});

$(document).on("click",".rotate-right",function(e) {
	e.preventDefault();
	removeDragToSpin();
	 modulus++; 
	 if(modulus >options.imageCount-1){
		modulus=0;
	 } 
	  rotate360(modulus);
});

$(document).on("click","#tb360Zoom",function(e) {	
	 removeDragToSpin();
 if ($(this).hasClass("zoomin_button")) {
		_zoom = true;
	   $(this).addClass("zoomout_button");
	   $(this).removeClass("zoomin_button");
	   if(options.autoRotate==true){stop_auto_rotate();}
	   var canvasOffset = $(canvas).offset();
	   iMouseX = Math.floor(e.pageX - canvasOffset.left);
	   iMouseY = Math.floor(e.pageY - canvasOffset.top);
	    zoomOn=Math.ceil(iMouseX / tx);
	    //console.log("iMouseX : "+iMouseX+" iMouseY : "+iMouseY+" tx: "+tx);
	   if(zoomOn<=0) { zoomOn=1}else if(zoomOn >options.imageCount){zoomOn=options.imageCount}else{};
	    $('canvas').css({cursor:'zoom-in'});
	   $(this).css({cursor:'zoom-out'});
	} else {    
	        zoomOn=0;
			_zoom = false;
			$(this).addClass("zoomin_button");
			$(this).removeClass("zoomout_button");
			$(this).css({cursor:'e-resize'});
			view360.find("#"+options.canvasID).trigger( "mousedown" );
			view360.find("#"+options.canvasID).trigger( "mouseup" );
			 $('canvas').css({cursor:'e-resize'});
			$(this).css({cursor:'zoom-in'});
	}
});   

$(document).on("click",".autospin",function(e) {
	e.preventDefault();
	removeDragToSpin();
	if(options.autoRotate==false){
	start_auto_rotate();
	$(this).addClass("active");
	}
	else{
	stop_auto_rotate();
	$(this).removeClass("active");
	}
	});



$(document).on("click",".fullscreenbtn",function() {
	init_();
	var elem = document.getElementById("p360");	
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	  } else if (elem.webkitRequestFullscreen) { /* Safari */
		elem.webkitRequestFullscreen();
	  } else if (elem.msRequestFullscreen) { /* IE11 */
		elem.msRequestFullscreen();
	  }
	
	setTimeout(function(){
		$('#fscreen').removeClass('fullscreenbtn').addClass('minimizeScreen');	
		view360.addClass('fullscreen360');
			_fullscreen = true;
			fixDimensions();
    		getImages();
    		showImage();
    		view360.append("<ul class='rotate-links'></ul>");
    		view360.find('.rotate-links').append("<li><a href='#' class='rotate-left'></a></li>");
    		view360.find('.rotate-links').append("<li><a href='#' class='rotate-right'></a></li>");
    		view360.find('.rotate-links').append("<li><a id='tb360Zoom' class='zoomin_button' title='Zoom in / out'></a></li>").css({cursor:'e-resize'});
    		view360.find('.rotate-links').append("<li><a href='#' class='autospin'></a></li>");
    		view360.find('.rotate-links').append("<li><a href='#' id='fscreen' class='minimizeScreen'></a></li>");
    		view360.append("<div class='drag-to-spin'></div>");
    		},200);
});

$(document).on("click","#fscreen",function() {
	$('#p360canvas').addClass('fullscreen');
});

$(document).on("click",".minimizeScreen",function() {
		
			 if (document.exitFullscreen) {
				document.exitFullscreen();
			  } else if (document.webkitExitFullscreen) { /* Safari */
				document.webkitExitFullscreen();
			  } else if (document.msExitFullscreen) { /* IE11 */
				document.msExitFullscreen();
			  }
		
		setTimeout(function(){			
			$('#fscreen').removeClass('minimizeScreen').addClass('fullscreenbtn');		
			view360.removeClass('fullscreen360');
			view360.empty();
			_fullscreen = false;	
			//view360.find("#"+options.canvasID).removeAttr('style');
    		//fixDimensions();
    		//getImages();
    		//showImage();
		},500);

});

 
}; // END var P360 = function(element, options)


 	$.fn.p360 = function(options)
    {
        return this.each(function()
        {
            var element = $(this);
            if (element.data('p360')) return;
            var p360 = new P360(this, options);
            element.data('p360', p360);
        });
    };
})(jQuery);	 