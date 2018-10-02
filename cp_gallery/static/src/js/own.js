 odoo.define('cp_committee.cp_committee', function(require) {
"use strict";


$(document).ready(function (){
 $('.owl-carousel').owlCarousel({
    rtl:false,
    loop:false,
    margin:10,
    nav:true,
    responsive:{
      0:{
         items:1
        },
        600:{
         items:2
        },
        1000:{
         items:3
        }
       }
    })

})
})
