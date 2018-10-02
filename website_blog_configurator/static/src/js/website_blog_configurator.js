odoo.define('website_blog_configuration.website_blog_configuration', function (require) {

var ajax = require('web.ajax');

$(window).load(function() {
    ajax.jsonRpc("/get_blogs_data", 'call', {'template_render' : false}).done(function(data) {
        var website_menu_url = window.location.href.split(":")[2].substr(4);
        if (website_menu_url == "/") {
            website_menu_url = "/page/homepage";
        }
        if (website_menu_url == "/blog/our-blog-1"){
            website_menu_url = "/blog/1";
        }
        if (data["display_blog_on"] == website_menu_url) {
        	ajax.jsonRpc("/get_blogs_data", 'call', {'template_render' : true}).done(function(view) {
                if (data["blog_display_position"] == 'top') {
                    $.when($("#wrap").before(view)).done(function( x ) {
                         flex_carousel_event(data["font_color"], data["back_color"], data['bg_image']);
                    });
                }
                else if (data["blog_display_position"] == 'bottom') {
                    $.when($("#wrap").after(view)).done(function( x ) {
                        flex_carousel_event(data["font_color"], data["back_color"], data['bg_image']);
                    });
                }
            });
        }
    });
    
});


function flex_carousel_event(textcolor, bgcolor, bgimage){
    //for background image
    if  (bgimage){
        img = "data:image/jpg;base64,"+ bgimage  
        $('.custom_bg').css('background-image', 'url(' + img + ')');
    }
    
    //for font-color
    if (textcolor == 'blue') {
        $(".text-color").css({'color':'#2a6496'})
    }
    if (textcolor == 'white') {
        $(".text-color").css({'color':'#fff'})
    }
    if (textcolor == 'yellow') {
        $(".text-color").css({'color':'#ffff00'})
    }
    if (textcolor == 'green') {
        $(".text-color").css({'color':'#009933'})
    }
    if (textcolor == 'pink') {
        $(".text-color").css({'color':'#b30086'})
    }
    if (textcolor == 'brown') {
        $(".text-color").css({'color':'#802b00'})
    }
    if (textcolor == 'gray') {
        $(".text-color").css({'color':'#666'})
    }
    if (textcolor == 'maroon') {
        $(".text-color").css({'color':'#b30000'})
    }
    if (textcolor == 'black') {
        $(".text-color").css({'color':'#000'})
    }
    if (textcolor == 'red') {
        $(".text-color").css({"color": "red"});
    }
    //for background color
    if (bgcolor == 'red') {
        $(".background-color").css({"background-color": "#F62217"});
    }
    if (bgcolor == 'blue') {
        $(".background-color").css({"background-color": "#b3c6ff"});
    }
    if (bgcolor == 'white') {
        $(".background-color").css({"background-color": "#fff"});
    }
    if (bgcolor == 'yellow') {
        $(".background-color").css({"background-color": "#ffffb3"});
    }
    if (bgcolor == 'green') {
        $(".background-color").css({"background-color": "#adebad"});
    }
    if (bgcolor == 'pink') {
        $(".background-color").css({"background-color": "#ffccff"});
    }
    if (bgcolor == 'brown') {
        $(".background-color").css({"background-color": "#b33c00"});
    }
    if (bgcolor == 'gray') {
        $(".background-color").css({"background-color": "#C8C8C8"});
    }
    if (bgcolor == 'maroon') {
        $(".background-color").css({"background-color": "#8C001A"});
    }
    if (bgcolor == 'black') {
        $(".background-color").css({"background-color": "#333"});
    }
    
    $('#blog_carousel').slick({
        autoplay:true,
        autoplaySpeed:3000,
        infinite: true,
        speed: 500,
        infinite: true,
        mobileFirst:true,
    });
    
    $('a').click(function(e){
        if ($(this).attr('href') == '#blog_carousel'){
            if ($(this).attr('data-slide') == 'prev'){
                $("#blog_carousel").slick('slickPrev');
            }
            else if ($(this).attr('data-slide') == 'next'){
                $("#blog_carousel").slick('slickNext');
            }
            e.preventDefault();
        }
    });
}
});
