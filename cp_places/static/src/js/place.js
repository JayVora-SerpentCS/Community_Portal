
    jQuery(function($) {
        // Asynchronously Load the map API 
        var script = document.createElement('script');
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBZib4Lvp0g1L8eskVBFJ0SEbnENB6cJ-g&callback=initialize&libraries=places";
        document.body.appendChild(script);
    });

    function initialize() {
    odoo.define('places.place', function(require) {
"use strict";
    var ajax = require('web.ajax');
    $(document).ready(function (){

        var Model = require('web.Model');
        var record=new Model('places.place');
        var marker_arr=[]
        var i=0
        var h=''
        var j=0
        var map;
        var mapOptions={}
        var transitLayer
        var markers=[]
        var mapOptions={}
        var bounds = new google.maps.LatLngBounds();

         // Display a map on the page

        ajax.jsonRpc("/page/test", 'call', {'pname':$("#pdata").val()
        }).done(function(records){
            _.each(records, function(rec) {
                markers.push(records);
            });
            mapOptions = {
            zoom:15,
            center: {lat:parseFloat(records[1]), lng: parseFloat(records[2])},
            mapTypeId: 'roadmap',
            };

        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        map.setTilt(45);

        // Multiple Markers

        // Info Window Content
        var infoWindowContent = [
            ['<div class="info_content">' +
                '<h3 class="info_location_name">'+records[0]+'</h3>' +
                '<p class="info_location_text">758, Shady Pines Drive Martinsville, Ahmedabad</p>' +
                '<p class="info_location_call"><span><i class="fa fa-phone"></i></span>(800) 123-4567</p>' +
                '<a href="#" class="btn-link">View Location</a>' +
                '</div>'
            ]
        ];
        // Display multiple markers on a map
        var infoWindow = new google.maps.InfoWindow({ maxWidth: 280 }),
            marker, i;

        // Loop through our array of markers & place each one on the map
        for (i = 0; i < markers.length; i++) {
            var position = new google.maps.LatLng(markers[i][1],
                markers[i][2], markers[i][3], markers[i][4]);
            bounds.extend(position);
            marker = new google.maps.Marker({
                position: position,
                map: map,
                title: markers[i][0]
            });

            // Allow each marker to have an info window
            google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
                return function() {
                    infoWindow.setContent(infoWindowContent[i][0]);
                    infoWindow.open(map, marker);
                }
            })(marker, i));

            // Automatically center the map fitting all markers on the screen
            map.fitBounds(bounds);
        }

        // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
        var  tilesloadedListener = google.maps.event.addListener((map),  'tilesloaded', function(event) {
            this.setZoom(12);
            google.maps.event.removeListener(tilesloadedListener);
        });


});
    });
       });
    }

