let oldSync = Backbone.sync;
Backbone.sync = function(method, model, options){
    options.beforeSend = function(xhr){
        let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNTM2NzY1Nzc1LCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSJ9.TwMtwb4RMBFu8NEg-AjduQAy-WsjJGHZKnHzzil8zRE';
        xhr.setRequestHeader('Content-Type', 'application/vnd.api+json');
        xhr.setRequestHeader('Authorization','Token ' + token);
    };
    return oldSync(method, model, options);
};

/////////////////// Templates ///////////////////

let formTemplate = _.template(
    '<div class="labelBlock">\n' +
    '<label for="titleId">Title</label>\n' +
    '</div>' +
    '<div  class="labelBlock">\n' +
    '<input type="text" id="titleId" class="formInput inputSavePoint" placeholder="Enter Title">\n' +
    '</div>\n' +
    '<div class="labelBlock">\n' +
    '<label for="descriptionId" >Description</label>\n' +
    '</div>\n' +
    '<div class="labelBlock">\n' +
    '<textarea rows="5" cols="10" id="descriptionId" class="formInput inputSavePoint" placeholder="Enter Description"></textarea>' +
    '</div>\n' +
    '<div class="labelBlock">\n' +
    '<label for="coordinateXId" >X: </label>\n' +
    '</div>\n' +
    '<div class="labelBlock">\n' +
    '<input type="text" id="coordinateXId" class="formInput inputSavePoint" placeholder="123.123456">\n' +
    '</div>\n' +
    '<div class="labelBlock">\n' +
    '<label for="coordinateYId" >Y: </label>\n' +
    '</div>\n' +
    '<div class="labelBlock">\n' +
    '<input type="text" id="coordinateYId" class="formInput inputSavePoint" placeholder="123.123456">\n' +
    '</div>\n' +
    '<div class="labelBlock">\n' +
    '<label for="chooseIconId" >Icon</label>\n' +
    '</div>\n' +
    '<div   id="innerSelect"></div>\n' +
    '<div  id="savePoint">\n' +
    '<input type="button" id="saveModelId" class="btn btn-success" value="Save">\n' +
    '</div>\n');

let searchTempalte = _.template(
    '<div id="searchInputBlock">' +
    '<input type="text" id="searchValue" class="formInput">' +
    '</div>' +
    '<div id="searchButton">' +
    '<input type="button" class="btn btn-primary" id = "searchId" value="Search">' +
    '</div>');

let pageTemplate = _.template(
    '<div id="searchBlock" >' +
    '<div id="searchRegion"></div>' +
    '<div id="listRegion"></div>' +
    '</div>' +
    '<div id="panelSettingsGroup">' +
    '<div id="panelSettings"> ' +
    '<input id="btnSavePanel" type="button" value="+" class="btn btn-primary">' +
    '</div>' +
    '<div id="formRegion"></div>' +
    '</div>');

let pointChildViewTemplate = _.template(
    '<div class="childElementCoord"><p>X: <%= location.coordinates[0] %> <br> Y: <%= location.coordinates[1] %> </p>' +
    '</div>' +
    '<div class="btnsSetElement">' +
    '<input type="button" class="btn btn-danger " style="float: right;" id="deleteView" value="Delete">' +
    '<input type="button" class="btn btn-light" style="float: right;" id="changeView" value="Change" >\n</div>\n' +
    '<div class="childElementTitle">\n' +
    '<h4><%= title %></h4>\n' +
    '</div>' +
    '<div class="childElementDescr">' +
    '<p ><%= description %></p>\n' +
    '</div>\n');

let IconChildViewTemplate = _.template('<%= title %>');

///////////////////
///////////////////  Models ///////////////////

let PointModel = Backbone.Model.extend({
    urlRoot: function () {
        return '/api/points/';
    },
    parse: function (obj) {
        if (obj.data === undefined) {
            return {
                'id': obj.id,
                'title': obj.attributes.title,
                'description': obj.attributes.description,
                'icon': obj.relationships.icon.data.id,
                'location': {
                    'type': 'Point',
                    'coordinates': [+obj.attributes.location.coordinates[0], +obj.attributes.location.coordinates[1]]
                }
            }
        }
        return {
            'id': obj.data.id,
            'title': obj.data.attributes.title,
            'description': obj.data.attributes.description,
            'icon': obj.data.relationships.icon.data.id,
            'location': {
                'type': 'Point',
                'coordinates': [+obj.data.attributes.location.coordinates[0], +obj.data.attributes.location.coordinates[1]]
            }
        }
    }
});

let IconModel = Backbone.Model.extend({
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

///////////////////////////////////////////////////////////   params.url = _.result(model, 'url') + '/' || urlError();   в исходниках добавлен слеш

let PointCollection = Backbone.Collection.extend({
    model: PointModel,
    url: '/api/points/',
});

let IconCollection = Backbone.Collection.extend({
    model: IconModel,
    url: '/api/icons/',
});

///////////////////

let MapView = Mn.MnObject.extend({

    initialize: function (collectionPoint, collectionIcon) {
        this.collectionIcon = collectionIcon;
        this.collectionPoint = collectionPoint;

        this.test();
    },

    test: function () {

        let _this = this;

        let collectIconsFuture = [];
        let count = 0;

        _this.collectionPoint.each(function (point) {

            _this.collectionIcon.each(function (icon) {

                if (point.get('icon') === icon.get('id')) {

                    let iconFeature = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.fromLonLat([
                            +point.get('location').coordinates[0],
                            +point.get('location').coordinates[1]
                        ])),
                        name: point.get('title'),
                    });
                    let iconStyle = new ol.style.Style({
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

        let vectorSource = new ol.source.Vector({
            features: collectIconsFuture
        });

        let vectorLayer = new ol.layer.Vector({
            source: vectorSource
        });

        if (window.map.getLayers().getLength() > 1) {
            window.map.getLayers().removeAt(1);
        }

        window.map.addLayer(vectorLayer);
    },
});

let FormView = Mn.View.extend({
    tagName: 'form',

    className: 'formClass',

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
        this.showChildView('innerSelect', new IconList({collection: this.collectionIcon}));
    },
});

let IconChildView = Mn.View.extend({

    tagName: 'option',
    attributes: {
        'value': function () {
            return IconChildView.arguments['0'].model.attributes.id;
        },
    },
    template: IconChildViewTemplate,
});

let IconList = Mn.CollectionView.extend({
    tagName: 'select',
    className: 'selectClass',
    id: 'chooseIconId',
    template: false,
    childView: IconChildView,
});

let SearchView = Mn.View.extend({

    className: 'searchView',

    initialize(mapUpdateLayer) {
        this.mapUpdateLayer = mapUpdateLayer;
    },

    template: searchTempalte,

    ui: {
        'searchBtn': '#searchId'
    },

    triggers: {
        'click @ui.searchBtn': 'search:click'
    },
});

let PointChildView = Mn.View.extend({

    className: 'childElement',

    initialize(options) {
        this.mapUpdateLayer = options.mapUpdateLayer;
        this.check = false;
    },

    template: pointChildViewTemplate,

    ui: {
        'deletePoint': '#deleteView',
        'changePoint': '#changeView',
    },

    events: {
        'click @ui.deletePoint': '_delete',
        'click @ui.changePoint': '_change',
        'click': '_goToPoint',
    },

    _goToPoint: function () {

        let _this = this;
        this.coordinates = ol.proj.fromLonLat([+_this.model.get('location').coordinates[0],
            +_this.model.get('location').coordinates[1]]);

        window.eventKeysPopup[window.eventKeysPopup.length] = window.map.on('moveend', function () {

            $(window.element).popover('dispose');

            popup.setPosition(_this.coordinates);

            $(window.element).popover({
                placement: 'top',
                html: true,
                content: _this.model.get('title')
            });
            $(window.element).popover('show');
        });
        window.map.setView(new ol.View({
            center: this.coordinates,
            zoom: 15,
            minZoom: 2
        }));
    },

    _change: function () {
        let _this = this;
        if (this.check) {
            let attrib = {
                data: {
                    'type': 'Point',
                    'id': this.model.id,
                    'attributes': {
                        'title': $('#titleId').val(),
                        'description': $('#descriptionId').val(),
                        'icon': $('#chooseIconId').val(),
                        'location': {
                            'type': 'Point',
                            'coordinates': [
                                +$('#coordinateXId').val(), +$('#coordinateYId').val()
                            ]
                        },
                    }
                }
            };
            this.model.save(attrib, {
                patch: true,
                success: function () {
                    _this.render();

                    $('.btn').prop('disabled', false);
                    _this.mapUpdateLayer.test();
                    _this.check = false;

                },
                error: function (model, response, options) {
                    for (let err in response.responseJSON.errors) {
                        alert(response.responseJSON.errors[err])
                    }
                }
            });
        } else {
            $('#titleId').val(this.model.get('title'));
            $('#descriptionId').val(this.model.get('description'));
            $('#chooseIconId').val(this.model.get('icon'));
            $('#coordinateXId').val(this.model.get('location').coordinates[0]);
            $('#coordinateYId').val(this.model.get('location').coordinates[1]);
            $('.btn').prop('disabled', true);
            this.$('#changeView').prop('disabled', false);
            this.check = true;
        }
    },

    _delete: function () {
        let _this = this;
        this.model.destroy({
            success() {
                _this.mapUpdateLayer.test();
            },
        })
    },

});

let ListView = Mn.CollectionView.extend({

    id: 'listView',

    initialize(collectionPoint, mapUpdateLayer) {
        this.collection = collectionPoint;
        this.mapUpdateLayer = mapUpdateLayer;
    },

    template: false,

    childView: PointChildView,

    childViewOptions() {
        return {
            mapUpdateLayer: this.mapUpdateLayer
        };
    }
});

let PageView = Mn.View.extend({

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
    },

    modelEvents: {
        'sync': 'collectionUpdate'
    },

    saveModel: function () {
        let _this = this;
        let model = new PointModel({
            "data": {
                'type': 'Point',
                'attributes': {
                    'title': $('#titleId').val(),
                    'description': $('#descriptionId').val(),
                    'location': {
                        'type': 'Point',
                        'coordinates': [+$('#coordinateXId').val(), +$('#coordinateYId').val()]
                    },
                    'icon': $('#chooseIconId').val(),
                }
            }
        });

        model.save(
            null, {
                success: function (model) {
                    _this.collectionPoint.push(model);
                    _this.mapUpdateLayer.test()
                },
                error: function (model, response, options) {
                    for (let err in response.responseJSON.errors) {
                        alert(response.responseJSON.errors[err])
                    }
                }
            }
        )
    },

    onRender() {

        this.collectionPoint = new PointCollection({model: PointModel});
        this.collectionPoint.parse = function (data) {
            return data.data;
        };

        this.collectionIcon = new IconCollection();
        this.collectionIcon.parse = function (data) {
            return data.data;
        };

        this.collectionUpdate();
        this.showChildView('searchRegion', new SearchView());
    },

    collectionUpdate: function () {

        let _this = this;

        this.collectionPoint.fetch({
            reset: true,
            success: function () {
                _this.collectionIcon.fetch({
                    reset: true,
                    success: function () {
                        _this.mapUpdateLayer = new MapView(_this.collectionPoint, _this.collectionIcon);
                        _this.showChildView('listRegion', new ListView(_this.collectionPoint, _this.mapUpdateLayer));
                        _this.showChildView('formRegion', new FormView(_this.collectionIcon, _this.mapUpdateLayer));
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
    },

    searchClick: function () {
        let _this = this;
        this.collectionPoint.url = '/api/points/?description=' + $('#searchValue').val();
        this.collectionPoint.fetch({
            success: function () {
                _this.mapUpdateLayer.test()
            },
            error: function () {
                alert('Pizdec')
            }
        });
    },
});

let App = Mn.Application.extend({
    region: '#mainRegion',

    onBeforeStart() {

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

        window.eventKeysPopup = [];

    },
    onStart() {
        this.showView(new PageView());
    },
});

new App().start();

/////////////////////////////////////////////////////WGS84

window.element = document.getElementById('popup');

let popup = new ol.Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [10, 0]
});

window.map.addOverlay(popup);

window.map.on('click', function (evt) {
    window.deletePopups();

    let coordinates = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');

    $('#coordinateXId').val(coordinates[0]);
    $('#coordinateYId').val(coordinates[1]);

    let feature = window.map.forEachFeatureAtPixel(evt.pixel,
        function (feature) {
            return feature;
        });
    if (feature) {
        $(element).popover('dispose');
        let coordinates = feature.getGeometry().getCoordinates();
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

window.map.on('pointermove', function (e) {
    if (e.dragging) {
        $(window.element).popover('dispose');
        return;
    }
    let pixel = window.map.getEventPixel(e.originalEvent);
    let hit = window.map.hasFeatureAtPixel(pixel);
    window.map.getTarget().style.cursor = hit ? 'pointer' : '';
});

window.map.on('pointerdrag', function () {
    window.deletePopups();
});


/////////////////////////////////////////////////////

$(document).ready(function () {
    $("#changeView, #btnSavePanel").click(function () {
        $("#formRegion").slideToggle("slow");
        $(this).toggleClass("active");
    });
});


window.deletePopups = function () {
    for (let i = window.eventKeysPopup.length - 1; i >= 0; i--) {
        ol.Observable.unByKey(window.eventKeysPopup[i]);
        window.eventKeysPopup[i] = undefined;
    }
};


