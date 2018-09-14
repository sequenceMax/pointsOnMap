$(document).ready(function () {

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
});