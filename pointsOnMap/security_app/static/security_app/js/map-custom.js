(function ($) {
    // USE STRICT
    "use strict";

        $(document).ready(function () {

            // var selector_map = $('#google_map');
            // var img_pin = selector_map.attr('data-pin');
            // var data_map_x = selector_map.attr('data-map-x');
            // var data_map_y = selector_map.attr('data-map-y');
            // var scrollwhell = selector_map.attr('data-scrollwhell');
            // var draggable = selector_map.attr('data-draggable');
            //
            // if (img_pin == null) {
            //     img_pin = 'images/icons/location.png';
            // }
            // if (data_map_x == null || data_map_y == null) {
            //     data_map_x = 40.007749;
            //     data_map_y = -93.266572;
            // }
            // if (scrollwhell == null) {
            //     scrollwhell = 0;
            // }
            //
            // if (draggable == null) {
            //     draggable = 0;
            // }
            //
            // var latitude = data_map_x,
            //     longitude = data_map_y,
            //     map_zoom = 14;
            //
            // var locations = [
            //     ['Welcome', latitude, longitude, 2]
            // ];
            //
            // if (selector_map !== undefined) {
        let rasterLayer = new ol.layer.Tile({
            source: new ol.source.OSM()
        });

                window.map = new ol.Map({
            layers: [rasterLayer],
            target: document.getElementById('map'),
            view: new ol.View({
                center: ol.proj.fromLonLat([39.710919, 47.240019]),
                zoom: 15,
                minZoom: 2
            })
         });
        //     }
            //
            // var infowindow = new google.maps.InfoWindow();
            //
            // var marker, i;
            //
            // for (i = 0; i < locations.length; i++) {
            //
            //     marker = new google.maps.Marker({
            //         position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            //         map: map,
            //         icon: img_pin
            //     });
            //
            //     google.maps.event.addListener(marker, 'click', (function(marker, i) {
            //         return function() {
            //             infowindow.setContent(locations[i][0]);
            //             infowindow.open(map, marker);
            //         }
            //     })(marker, i));
            // }

        });

})(jQuery);