/////////////////// Templates ///////////////////

var mapTemplate = _.template(
    '<div id="popup"></div>\n'
);

var formTemplate = _.template(
    '<form action=""  role="form" class="form-horizontal" onsubmit="savePoint(this)">\n' +
    '<div class="row form-group">\n' +
    '<label for="titleId" class="col-form-label col-md-1">Title</label>\n' +
    '<div class="col-md-11">\n' +
    '<input type="text" class="form-control" id="titleId" placeholder="Enter Title">\n' +
    '</div>\n' +
    '</div>\n' +
    '<div class="row form-group">\n' +
    '<label for="descriptionId" class="col-form-label col-md-2">Description</label>\n' +
    '<div class="col-md-10">\n' +
    '<input type="text" class="form-control" id="descriptionId" placeholder="Enter Description">\n' +
    '</div>\n' +
    '</div>\n' +
    '<div class="row form-group">\n' +
    '<label for="coordinateXId" class="col-form-label col-md-1">X: </label>\n' +
    '<div class="col-md-11">\n' +
    '<input type="text" class="form-control" id="coordinateXId" placeholder="123.123456">\n' +
    '</div>\n' +
    '</div>\n' +
    '<div class="row form-group">\n' +
    '<label for="coordinateYId" class="col-form-label col-md-1">Y: </label>\n' +
    '<div class="col-md-11">\n' +
    '<input type="text" class="form-control" id="coordinateYId" placeholder="123.123456">\n' +
    '</div>\n' +
    '</div>\n' +
    '<div class="row form-group">\n' +
    '<label for="chooseIconId" class="col-form-label col-md-1">Icon</label>\n' +
    '<div class="col-md-11" id="innerSelect">\n' +
    '</div>\n' +
    '</div>\n' +
    '<div class="form-group">\n' +
    '<input type="button" id="saveModelId" class="btn btn-success col-md-12" value="Save">\n' +
    '</div>\n' +
    '</form>\n');

var searchTempalte = _.template(
    '<div class="row form-group">' +
    '<input type="text" class="form-control col-md-9" id="searchValue">' +
    '<div class="col-md-3">' +
    '<input type="button" id = "searchId" class="btn btn-primary col" value="Search">' +
    '</div>' +
    '</div>');

var pageTemplate = _.template(
    '<div class="col-md-7">\n' +
    '<br/>\n' +
    '<div id="formRegion"></div>' +
    '</div>' +
    '</div>\n' +
    '<div class="col-md-5" id="r1"  class="container-fluid" >' +
    '<div id="searchRegion" class="row"></div>' +
    '<div id="listRegion"  class="row"></div>' +
    '</div>');

var pointChildViewTemplate = _.template('<div class="row">\n' +
    '<div class="card text-white bg-info mb-3" style="width: 27.5em;">\n' +
    '<div class="card-header">X: <%= x %> Y: <%= y %> ' +
    '<div style="float: right;">' +
    '<input type="button" class="btn btn-light btn-sm" style="float: left;" id="changeView" value="Change">\n' +
    '<input type="button" class="btn btn-danger btn-sm" style="float: right;" id="deleteView" value="Delete"></div>\n' +
    '</div>' +
    '<div class="card-body">\n' +
    '<h5 class="card-title"><%= title %></h5>\n' +
    '<p class="card-text"><%= description %></p>\n' +
    '</div>\n' +
    '</div>\n' +
    '</div>');

var IconChildViewTemplate = _.template('<%= title %>');

///////////////////
///////////////////  Models ///////////////////

var PointModel = Backbone.Model.extend({
    url: '/api/points/',
    parse: function (obj) {
        if (obj.data === undefined) {
            return {
                'id': obj.id,
                'title': obj.attributes.title,
                'description': obj.attributes.description,
                'icon': obj.relationships.icon.data.id,
                'x': obj.attributes.x,
                'y': obj.attributes.y
            }
        }

        return {
            'id': obj.data.id,
            'title': obj.data.attributes.title,
            'description': obj.data.attributes.description,
            'icon': obj.data.relationships.icon.data.id,
            'x': obj.data.attributes.x,
            'y': obj.data.attributes.y
        }


    }
});

var IconModel = Backbone.Model.extend({
    parse: function (obj) {
        return {
            'id': obj.id,
            'title': obj.attributes.title,
            'image': obj.attributes.image
        }
    }
});

///////////////////
/////////////////// Collections ///////////////////

var PointCollection = Backbone.Collection.extend({
    model: PointModel,
    url: '/api/points/',
});

var IconCollection = Backbone.Collection.extend({
    model: IconModel,
    url: '/api/icons/',
});

///////////////////

var MapView = Mn.View.extend({

    initialize: function (collectionPoint, collectionIcon) {
        this.collectionPoint = collectionPoint;
        this.collectionIcon = collectionIcon;
        this.test();
    },

    test: function () {
        var _this = this;

        var collectIconsFuture = [];
        var count = 0;

        _this.collectionPoint.each(function (point) {

            _this.collectionIcon.each(function (icon) {

                if (point.get('icon') === icon.get('id')) {

                    var iconFeature = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.fromLonLat([
                            +point.get('x'),
                            +point.get('y')
                        ])),
                        name: point.get('title'),
                    });
                    var iconStyle = new ol.style.Style({
                        image: new ol.style.Icon(({
                            anchor: [0, 0],
                            src: icon.get('image')
                        }))
                    });
                    iconFeature.setStyle(iconStyle);

                    collectIconsFuture[count++] = iconFeature;
                }
            })
        });

        var vectorSource = new ol.source.Vector({
            features: collectIconsFuture
        });

        var vectorLayer = new ol.layer.Vector({
            source: vectorSource
        });

        if (window.map.getLayers().getLength() > 1) {
            window.map.getLayers().removeAt(1);
        }

        window.map.addLayer(vectorLayer);
    },
});

var FormView = Mn.View.extend({
    tagName: 'form',

    className: 'form-horizontal',

    attributes: {
        'role': 'form'
    },

    template: formTemplate,

    initialize: function (collectionIcon) {
        this.collectionIcon = collectionIcon;
    },

    regions: {
        'innerSelect': '#innerSelect'
    },

    ui: {
        'saveModel': '#saveModelId',
    },

    triggers: {
        'click @ui.saveModel': 'saveModel:click'
    },

    onRender() {
        this.showChildView('innerSelect', new IconList(this.collectionIcon));
    },
});

var IconChildView = Mn.View.extend({

    tagName: 'option',
    attributes: {
        'value': function () {
            return IconChildView.arguments['0'].model.attributes.id;
        },
    },
    template: IconChildViewTemplate,
});

var IconList = Mn.CollectionView.extend({
    tagName: 'select',
    className: 'custom-select custom-select-md',
    id: 'chooseIconId',
    template: false,

    childView: IconChildView,

    initialize: function (collectionIcon) {
        this.collection = collectionIcon;
    },
});

var SearchView = Mn.View.extend({
    className: 'col',
    template: searchTempalte,

    ui: {
        'searchBtn': '#searchId'
    },

    triggers: {
        'click @ui.searchBtn': 'search:click'
    },
});

var PointChildView = Mn.View.extend({
    className: 'col',
    template: pointChildViewTemplate,

    ui: {
        'deletePoint': '#deleteView'
    },

    triggers: {
        'click @ui.deletePoint': 'delete:click'
    },
});

var ListView = Mn.CollectionView.extend({
    template: false,

    childView: PointChildView,

    initialize: function (collection) {
        this.collection = collection;
    },
});

var PageView = Mn.View.extend({

    className: 'row',

    id: 'mainPage',

    template: pageTemplate,

    regions: {
        'formRegion': '#formRegion',
        'searchRegion': '#searchRegion',
        'listRegion': '#listRegion',
    },

    childViewEvents: {
        'search:click': 'searchClick',
        'saveModel:click': 'saveModel',
        'delete:click': 'destroyPoint',
    },

    modelEvents: {
        'sync': 'collectionUpdate'
    },

    saveModel: function () {

        var model = new PointModel({
            "data": {
                'type': 'Point',
                'attributes': {
                    'title': $('#titleId').val(),
                    'description': $('#descriptionId').val(),
                    'x': $('#coordinateXId').val(),
                    'y': $('#coordinateYId').val(),
                    'icon': $('#chooseIconId').val(),
                }
            }
        });

        model.save(
            null, {
                headers: {
                    'Content-Type': 'application/vnd.api+json',
                    'Authorization': 'Token d2ca14ecfd5a10dbb26296dccc4d510b0396fe3a'
                }
            }
        );

        this.collectionPoint.unshift(model);
        this.collectionUpdate();
    },

    destroyPoint: function () {
        console.log(111)
    },

    onRender() {

        this.collectionPoint = new PointCollection();
        this.collectionPoint.parse = function (data) {
            return data.data;
        };

        this.collectionIcon = new IconCollection();
        this.collectionIcon.on('change', this.render, this);
        this.collectionIcon.parse = function (data) {
            return data.data;
        };

        this.collectionUpdate();
        this.showChildView('searchRegion', new SearchView());
    },

    searchClick: function () {
        this.collectionUpdate('?description=' + $('#searchValue').val());
    },

    collectionUpdate: function (attr) {

        var _this = this;

        if (attr !== undefined) {
            this.collectionPoint.url = '/api/points/' + attr;
        }

        this.collectionPoint.fetch({
            reset: true,
            success: function () {
                _this.collectionIcon.fetch({
                    reset: true,
                    success: function () {
                        _this.showChildView('listRegion', new ListView(_this.collectionPoint));
                        new MapView(_this.collectionPoint, _this.collectionIcon);
                        _this.showChildView('formRegion', new FormView(_this.collectionIcon));
                    },
                    error: function (e) {
                        alert('Ошибка заполнения иконок \n' + e)
                    }
                });
            },
            error: function (e) {
                alert('Ошибка заполнения точек \n' + e)
            }
        });
    }
});

var App = Mn.Application.extend({
    region: '#mainRegion',

    onBeforeStart() {
        var rasterLayer = new ol.layer.Tile({
            source: new ol.source.OSM()
        });

        window.map = new ol.Map({
            layers: [rasterLayer],
            target: document.getElementById('map'),
            view: new ol.View({
                center: ol.proj.fromLonLat([39.710919, 47.240019]),
                zoom: 15
            })
        });
    },
    onStart() {
        this.showView(new PageView());
    },
});

new App().start();


//
// window.element = document.getElementById('popup');
//
// var popup = new ol.Overlay({
//     element: element,
//     positioning: 'bottom-center',
//     stopEvent: false,
//     offset: [0, 0]
// });
//
// map.addOverlay(popup);