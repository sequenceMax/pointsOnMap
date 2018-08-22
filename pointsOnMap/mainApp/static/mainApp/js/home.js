var xhr = new XMLHttpRequest();
xhr.open('GET', '/api/points/', false);
xhr.send(null);

points = JSON.parse(xhr.responseText)['data'];

xhr = new XMLHttpRequest();
xhr.open('GET', '/api/icons/', false);
xhr.send(null);

icons = JSON.parse(xhr.responseText)['data'];

///////////////////////////////////
// Заполнение points картинками////
///////////////////////////////////
{
    for (var i = 0; i < points.length; i++) {
        for (var j = 0; j < icons.length; j++) {
            if (points[i].relationships.icon.data.id === icons[j].id) {
                points[i].relationships.icon.data = icons[j];
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

window.element = document.getElementById('popup');

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

    className: 'rightInnerBlock',
    id: function () {
        return this.model.get('id');
    },
    template: _.template('<div class="row">\n' +
        '<div class="card text-white bg-info mb-3" style="width: 36rem;">\n' +
        '<div class="card-header">X: <%= attributes.x %> Y: <%= attributes.y %></div>\n' +
        '<div class="card-body">\n' +
        '<h5 class="card-title"><%= attributes.title %></h5>\n' +
        '<p class="card-text"><%= attributes.description %></p>\n' +
        '</div>\n' +
        '</div>\n' +
        '</div> '),
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
        this.collection.on('change', this.render, this);
        this.render();
    },

    template: _.template('<form action="" role="form" class="form-horizontal">' +
        '<div class="row form-group">' +
        '<input type="text" class="form-control col-md-9">' +
        '<div class="col-md-3">' +
        '<input type="button" id = "searchId" class="btn btn-primary col" value="Search">' +
        '</div>' +
        '</div>' +
        '</form>'),

    events: {
        'click': 'searchAndRender'
    },

    searchAndRender: function () {
        console.log(this.collection);
        this.collection.model.destroy();
        console.log(this.collection);
    },

    render: function () {

        this.$el.html(this.template());

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

$('#r1').prepend(pointViewCollection.el);

function savePoint(form) {

    var dataSend = {
        "data": {
            "type": "Point",
            "attributes": {
                "title": form.titleId.value,
                "description": form.descriptionId.value,
                "x": form.coordinateXId.value,
                "y": form.coordinateYId.value,
                "icon": form.chooseIconId.value
            }
        }
    };
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/points/', false);
    xhr.setRequestHeader('Content-Type', 'application/vnd.api+json');
    xhr.setRequestHeader('Authorization', 'Token d2ca14ecfd5a10dbb26296dccc4d510b0396fe3a');
    xhr.send(JSON.stringify(dataSend));
}


$('#chooseIconId').html(function () {
    var options = '';
    for (var i = 0; i < icons.length; i++) {
        options += '<option value="' + icons[i].id + '">' + icons[i].attributes.title + '</option>';
    }
    console.log(options);
    return options;
});
