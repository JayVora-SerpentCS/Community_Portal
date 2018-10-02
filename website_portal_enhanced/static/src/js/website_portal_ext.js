odoo.define('website_blog_configuration.website_blog_configuration', function (require) {
'use strict';

var ajax = require('web.ajax');
$(document).ready(function(){

    $(".select_select2").select2();
    

    $('#image_src').change(function(){
        $('#preview_image').attr('src',"data:image/png;base64,"+$('#image_src').val());
    }).change();
    $(".js-multiple").select2();
    
    $('.btn_confirm').click(function(){
    	ajax.jsonRpc('/tags', 'call', {'tags': $('.select_select2').select2('val'), 'selected_partner': $('input[name="partner"]').val(),}).then(function(data){
    	});
    });

    $('.btn_confirm').click(function(){
    	ajax.jsonRpc('/lang_speak', 'call', {'can_speak': $('.js-multiple').select2('val')}).then(function(data){
   	});
    });

});

function handle(files) {
    var file = files[0];
    var imageType = /image.*/;
    var img = document.createElement("img");
    img.classList.add("obj");
    img.file = file;
    var reader = new FileReader();
    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result;
    $('#image_src').val((e.target.result).split(',')[1]).change();}; })(img);
    if (file){
        reader.readAsDataURL(file);
    }
};

$(document).on('click', '.profile_li', function () {
    $('.profile_li').parent().parent().find('.dropdown').addClass('open');
});


// =============================================================
//
// VALIDATION FOR MY ACCOUNT PROFILE DETAILS :
//
// =============================================================

$("#age").keypress( function(e) {
	var chr = String.fromCharCode(e.which);
    if ("1234567890".indexOf(chr) < 0)
        return false;
});

$("#body_weight").keypress( function(e) {
	var chr = String.fromCharCode(e.which);
    if ("1234567890.".indexOf(chr) < 0)
        return false;
});

$('.father_with').addClass('hidden');
$('.father_as').addClass('hidden');
$('.father_status').change(function() {
	$('.father_with').removeClass('hidden');
	$('.father_as').removeClass('hidden');
});

$('.mother_with').addClass('hidden');
$('.mother_as').addClass('hidden');
$('.mother_status').change(function() {
	$('.mother_with').removeClass('hidden');
	$('.mother_as').removeClass('hidden');
});
});
