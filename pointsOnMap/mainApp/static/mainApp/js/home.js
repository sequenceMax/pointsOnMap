var icons = [
    {
        "data": {
            "type": "Icon",
            "id": "2",
            "attributes": {
                "title": "titleIcon2",
                "image": "/static/mainApp/img/education.png"
            }
        }
    }, {
        "data": {
            "type": "Icon",
            "id": "1",
            "attributes": {
                "title": "titleIcon1",
                "image": "/static/mainApp/img/food.png"
            }
        }
    }];


var xhr = new XMLHttpRequest();
xhr.open('GET', '/api/points/', false);
xhr.send(null);

points = JSON.parse(xhr.responseText)['data'];

///////////////////////////////////
// Заполнение points картинками////
///////////////////////////////////
{
    for (var i = 0; i < points.length; i++) {
        for (var j = 0; j < icons.length; j++) {
            if (points[i].relationships.icon.data.id === icons[j].data.id) {
                points[i].relationships.icon.data = icons[j].data;
            }
        }
    }
}


var collectIconsFuture = [];


for (var i = 0; i < points.length; i++) {

    var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([+points[i].attributes.x, +points[i].attributes.y])),
        name: points[i].attributes.title,
    });

    var iconPath = points[i].relationships.icon.data.attributes.image;

    var iconStyle = new ol.style.Style({
        image: new ol.style.Icon(({
            anchor: [0, 0],
            src: iconPath
        }))
    });

    iconFeature.setStyle(iconStyle);

    collectIconsFuture[i] = iconFeature;
}
var vectorSource = new ol.source.Vector({
    features: collectIconsFuture
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

// map.setLayerGroup(vectorLayer);

////////////////////////////////////////////////////////////

window.element = document.getElementById('popup');
console.log(element)

var popup = new ol.Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, 0]
});

map.addOverlay(popup);


////////////////////////!!!!!!!!!!!!!!!!!!!!!///////////
map.on('click', function (evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature) {
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
        $(element).popover('dispose');
    }
});
////////////////////////!!!!!!!!!!!!!!!!!!!!!///////////


map.on('pointermove', function (e) {
    if (e.dragging) {
        $(element).popover('dispose');
        return;
    }
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////

var PointModel = Backbone.Model.extend({
    defaults: {
        map: map,
        popup: popup
    }
});

var PointCollection = Backbone.Collection.extend({
    model: PointModel
});

var pointCollection = new PointCollection();

pointCollection.add(points);

var PointView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },
    className: 'rightInnerBlock',
    id: function () {
        return this.model.get('id');
    },
    template: _.template('<div class="row">\n' +
        '                <div class="card text-white bg-info mb-3" style="width: 30rem;">\n' +
        '                    <div class="card-header"><%= relationships.icon.data.attributes.title %></div>\n' +
        '                    <div class="card-body">\n' +
        '                        <h5 class="card-title"><%= attributes.title %></h5>\n' +
        '                        <p class="card-text"><%= attributes.description %></p>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div> '),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    events: {
        'click': 'upToPoint'
    },
    upToPoint: function () {

        var coordinates = [+this.model.get('attributes').x, +this.model.get('attributes').y];
        var map = this.model.get('map');
        map.setView(new ol.View({
            center: ol.proj.fromLonLat(coordinates),
            zoom: 14
        }));


        var popup = this.model.get('popup');
        popup.setPosition(ol.proj.fromLonLat(coordinates));

        $(element).popover({
            placement: 'top',
            html: true,
            content: this.model.get('attributes').title
        });
        $(element).popover('show');
    }
});

var PointViewCollection = Backbone.View.extend({
    tagName: 'div',
    id: 'rightBlockId',

    initialize: function () {
        this.render();
    },
    render: function () {
        this.collection.each(function (point) {
            var pointView = new PointView({
                model: point
            });
            this.$el.append(pointView.render().el);

        }, this);
    }
});

var pointViewCollection = new PointViewCollection({
    collection: pointCollection
});

$('#main').prepend(pointViewCollection.el);


function savePoint(form) {

    // var dataSend = "{\n" +
    //     "    \"data\": {\n" +
    //     "        \"type\": \"Point\",\n" +
    //     "        \"id\": \"4\",\n" +
    //     "        \"attributes\": {\n" +
    //     "            \"title\": \""+ form.titleId.value +"\",\n" +
    //     "            \"description\": \"" + form.descriptionId.value +"\",\n" +
    //     "            \"x\": \"" + form.coordinateXId.value +"\",\n" +
    //     "            \"y\": \"" + form.coordinateYId.value +"\"\n" +
    //     "        },\n" +
    //     "        \"relationships\": {\n" +
    //     "            \"icon\": {\n" +
    //     "                \"data\": {\n" +
    //     "                    \"type\": \"Icon\",\n" +
    //     "                    \"id\": \""+ form.chooseIconId.value + "\"\n" +
    //     "                }\n" +
    //     "            }\n" +
    //     "        }\n" +
    //     "    }\n" +
    //     "}";



    var dataSend = {
    "data": {
        "type": "Point",
        "id": "4",
        "attributes": {
            "title": form.titleId.value,
            "description": form.descriptionId.value,
            "x": form.coordinateXId.value ,
            "y": form.coordinateYId.value
        },
        "relationships": {
            "icon": {
                "data": {
                    "type": "Icon",
                    "id": form.chooseIconId.value
                }
            }
        }
    }
}



    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/points/', true);
    xhr.setRequestHeader('Content-Type', 'application/vnd.api+json');
    xhr.setRequestHeader('', '');

    xhr.send(JSON.stringify(dataSend));
debugger

}