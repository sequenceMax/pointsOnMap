// import Feature from 'ol.Feature.js';
//       import Map from 'ol.Map.js';
//       import Overlay from 'ol.Overlay.js';
//       import View from 'ol.View.js';
//       import Point from 'ol.geom.Point.js';
//       import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
//       import TileJSON from 'ol/source/TileJSON.js';
//       import VectorSource from 'ol/source/Vector.js';
//       import {Icon, Style} from 'ol/style.js';


//
// var map = new ol.Map({
//         target: 'map',
//         layers: [
//           new ol.layer.Tile({
//             source: new ol.source.OSM()
//           })
//         ],
//         view: new ol.View({
//           center: ol.proj.fromLonLat([39.710919, 47.240019]),
//           zoom: 15
//         })
//       });
//
//
// var icons = [
//     {
//         "id": 1,
//         "title": "food",
//         "path": "/icons/dictionary.png"
//     },
//     {
//         "id": 2,
//         "title": "title2",
//         "path": "path2"
//     }
// ];
//
//
// var data = [
//     {
//         "icon_id": "1",
//         "longitude": 39.710949,
//         "latitude": 47.240049,
//     }
// ];


////////////////////////////////////////////////



      var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(39.710919, 47.240019),
        name: 'Null Island',
      });

      var iconStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {module:ol/style/Icon~Options} */ ({
          anchor: [0, 0],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: '/static/mainApp/js/img/food.png'
        }))
      });

      iconFeature.setStyle(iconStyle);

      var vectorSource = new ol.source.Vector({
        features: [iconFeature] //
      });

      var vectorLayer = new ol.layer.Vector({
        source: vectorSource
      });

      var rasterLayer = new ol.layer.Tile({
        source: new ol.source.OSM()
      });

      var map = new ol.Map({
        layers: [rasterLayer, vectorLayer],  // слои
        target: document.getElementById('map'),
        view: new ol.View({
          center: ol.proj.fromLonLat([39.710919, 47.240019]),
          zoom: 14
        })
      });


      // var map = new ol.Map({
//         target: 'map',
//         layers: [
//           new ol.layer.Tile({
//             source: new ol.source.OSM()
//           })
//         ],
//         view: new ol.View({
//           center: ol.proj.fromLonLat([39.710919, 47.240019]),
//           zoom: 15
//         })
//       });



      var element = document.getElementById('popup');

      var popup = new ol.Overlay({
        element: element,
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -50]
      });
      map.addOverlay(popup);

      // display popup on click
      map.on('click', function(evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel,
          function(feature) {
            return feature;
          });
        if (feature) {
          var coordinates = feature.getGeometry().getCoordinates();
          popup.setPosition(coordinates);
          $(element).popover({
            placement: 'top',
            html: true,
            content: feature.get('name')
          });
          $(element).popover('show');
        } else {
          $(element).popover('destroy');
        }
      });

      // change mouse cursor when over marker
      map.on('pointermove', function(e) {
        if (e.dragging) {
          $(element).popover('destroy');
          return;
        }
        var pixel = map.getEventPixel(e.originalEvent);
        var hit = map.hasFeatureAtPixel(pixel);
        map.getTarget().style.cursor = hit ? 'pointer' : '';
      });