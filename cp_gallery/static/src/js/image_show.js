
odoo.define('cp_committee.cp_committee', function(require) {
"use strict";
    $(document).ready(function (){
        var modal = document.getElementById('myModal');
        var modalImg = document.getElementById("img01");
        var captionText = document.getElementById("caption");
        $('.images').click(function(){
            modal.style.display = "block";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
        });
        $('#myModal').click(function(){
            modal.style.display = "none";
        });
    });
});
