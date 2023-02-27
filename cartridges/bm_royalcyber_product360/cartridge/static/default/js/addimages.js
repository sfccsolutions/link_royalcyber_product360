 
 jQuery(document).ready(function() {
	 jQuery("#remove_selected").hide();
	 jQuery("#remoteUrlExample").css('opacity', '0');
	 jQuery("#remoteUrlExample").css('display', 'none');
	 jQuery("input[type='radio']").change(function() {
                if (jQuery(this).val() == "local") {
                	jQuery("#remoteDiv").hide();
                	jQuery("#localDiv").show(500);
                	} else {
                	jQuery("#localDiv").hide();
                	jQuery("#remoteDiv").show(500);
                }
            });
	 jQuery("#LocaleID")
		.change(
				function() {
					var locale = jQuery("#LocaleID :selected").val();
					jQuery('#localeSelected').val(locale);
					if(jQuery("#getVariantsOf").val() == "null"){
						jQuery("#getVariantsOf").val("");
					}
					jQuery("#addImages").submit(); 
					
				});
});
 
 
 jQuery("#remoteExampleHandle").click(function(){
	 jQuery("#remoteUrlExample").css('display', 'block');
	 setTimeout(function() {
		 jQuery("#remoteUrlExample").css('opacity', '1');
	 }, 50);
 });
 

 jQuery(document).on('click', '#selectAll', function() {
	  
	    if (jQuery(this).val() == 'Select All') {
	    	jQuery('.selectImage').prop('checked', true);
	    	jQuery(this).val('Deselect');
	    	jQuery(this).html('Deselect');
	    	jQuery("#remove_selected").toggle( jQuery('input[name="selectImage"]').is(":checked") );
	    } else {
	    	jQuery('.selectImage').prop('checked', false);
	    	jQuery(this).val('Select All');
	    	jQuery(this).html('Select All');
	    	jQuery("#remove_selected").toggle( jQuery('input[name="selectImage"]').is(":checked") );
	    }
	  });

 
 jQuery('input[name="selectImage"]').click(function() {
	 jQuery("#remove_selected").toggle( jQuery('input[name="selectImage"]').is(":checked") );
 });
 	
 
 jQuery('#uploadImagesSubmit').click(function() {
	 	
	 	var imageType = jQuery("input[name=imagePath]:checked").val();
			 if(imageType == "remote"){
			 	var remoteImages = jQuery('#p360RemoteImage').val().split('\n');	
				jQuery("#p360RemoteImage_hidden").val(JSON.stringify(remoteImages));
			 }
 		jQuery('#uploadImages').submit();
 	  });
 	
 	jQuery('#remove_selected').click(function() {
 		var selectedImagesArray = [];
 		jQuery("input:checkbox[name=selectImage]:checked").each(function(){
 			selectedImagesArray.push(jQuery(this).val());
 			});
 		jQuery("#selectedImagesArray_hidden").val(JSON.stringify(selectedImagesArray));
 		jQuery('#removeSelectedImages').submit();
 	  });

   jQuery('#saveimages').click(function() {
    let data = {};
    var titles = jQuery('span[id^=title]').map(function(idx, elem) {
      return jQuery(elem).text();
    }).get();
    data['p360'] = titles;

    var p360Images = JSON.stringify(data);
    jQuery('#p360ImageObj').val(p360Images);
    jQuery('.sortWarning').hide(400);
    jQuery('#updateimages').submit();
    
  });
  
   
 P360imageslist = document.getElementById('P360images-list'),
  
  new Sortable(P360imageslist, {
  	animation: 150,
  	onUpdate: function () {
		jQuery('.sortWarning').show(400);
  		}
  });
 
 jQuery(document).ready(function() {
	jQuery("#uploadImages").validate({
		rules : {
			p360Image : {
				required : true,
				extension : "jpg, png, jpeg"
			},
			imagePath: {
				required : true
			},
			p360RemoteImage : {
				required : true
			}
		},
		messages : {
			p360Image : {
				required : "Please Choose a file",
				extension : "Please upload valid Image file format"
			},
			imagePath : {
				required : "Please select file type"
			},
			p360RemoteImage : {
				required : "Please enter a file address",
				
			}
		}

	});
});

