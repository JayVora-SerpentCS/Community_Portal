odoo.define('cp_committee.cp_committee', function(require) {
"use strict";
var ajax = require('web.ajax');
$(document).ready(function () {
     var Model = require('web.Model');
     var record=new Model('job.position');
     var dict=[]
     var i=1
     var flag=0
     var url = window.location.href
     var a = url.search("/page")
     var img_url = url.substr(0, a)

     record.call('search_read', [[]])
     .then(function (records) {
        _.each(records, function(rec) {
        if(rec.manager_id==false){
            dict.push({
                id:rec.responsible_person_id[0],
                parentId:null,
                Name: rec.responsible_person_id[1],
                title:rec.name,
                pic:""+img_url+"/web/image/res.partner/"+rec.responsible_person_id[0]+"/image?unique=983ffee"
            });
        }
        else{
            dict.push({
            id:rec.responsible_person_id[0],
            parentId:rec.manager_id[0],
            Name: rec.responsible_person_id[1],
            title:rec.name,
            pic:""+img_url+"/web/image?model=res.partner&id="+rec.responsible_person_id[0]+"&field=image_medium&unique=20180419114949"
            });

        }

        i=i+1
        });
     var orgchart = new getOrgChart(document.getElementById("people"),{
        photoFields: ["pic"], primaryFields: ["Name", "title"],
        dataSource: dict
        });

     })
    });
});
