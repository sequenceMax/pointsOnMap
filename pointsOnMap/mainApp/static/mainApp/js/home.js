// var xhr = new XMLHttpRequest();
// xhr.open('GET', '/api/points/', false);
// xhr.send(null);

// var points = JSON.parse(xhr.responseText)['data'];
//
// var xhr = new XMLHttpRequest();
// xhr.open('GET', '/api/icons/', false);
// xhr.send(null);
//
// var icons = JSON.parse(xhr.responseText)['data'];
//
// ///////////////////////////////////
// // Заполнение points картинками////
// ///////////////////////////////////
// {
//     for (var i = 0; i < points.length; i++) {
//         for (var j = 0; j < icons.length; j++) {
//             if (points[i].relationships.icon.data.id === icons[j].id) {
//                 points[i].relationships.icon.data = icons[j];
//             }
//         }
//     }
// }
//
// var collectIconsFuture = [];
//
// for (var i = 0; i < points.length; i++) {
//
//     var iconFeature = new ol.Feature({
//         geometry: new ol.geom.Point(ol.proj.fromLonLat([+points[i].attributes.x, +points[i].attributes.y])),
//         name: points[i].attributes.title,
//     });
//
//     var iconPath = points[i].relationships.icon.data.attributes.image;
//
//     var iconStyle = new ol.style.Style({
//         image: new ol.style.Icon(({
//             anchor: [0, 0],
//             src: iconPath
//         }))
//     });
//
//     iconFeature.setStyle(iconStyle);
//
//     collectIconsFuture[i] = iconFeature;
// }
//
// var vectorSource = new ol.source.Vector({
//     features: collectIconsFuture
// });
//
// var vectorLayer = new ol.layer.Vector({
//     source: vectorSource
// });
//
// var rasterLayer = new ol.layer.Tile({
//     source: new ol.source.OSM()
// });
//
// var map = new ol.Map({
//     layers: [rasterLayer, vectorLayer],  // слои
//     target: document.getElementById('map'),
//     view: new ol.View({
//         center: ol.proj.fromLonLat([39.710919, 47.240019]),
//         zoom: 15
//     })
// });
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
//
// ////////////////////////!!!!!!!!!!!!!!!!!!!!!///////////
//
// map.on('click', function (evt) {
//     var feature = map.forEachFeatureAtPixel(evt.pixel,
//         function (feature) {
//             return feature;
//         });
//
//     if (feature) {
//         var coordinates = feature.getGeometry().getCoordinates();
//
//         popup.setPosition(coordinates);
//
//         $(element).popover({
//             placement: 'top',
//             html: true,
//             content: feature.get('name')
//         });
//         $(element).popover('show');
//     } else {
//         $(element).popover('dispose');
//     }
// });
//
// ////////////////////////!!!!!!!!!!!!!!!!!!!!!///////////
//
// map.on('pointermove', function (e) {
//     if (e.dragging) {
//         $(element).popover('dispose');
//         return;
//     }
//     var pixel = map.getEventPixel(e.originalEvent);
//     var hit = map.hasFeatureAtPixel(pixel);
//     map.getTarget().style.cursor = hit ? 'pointer' : '';
// });
//
// //////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// var PointModel = Backbone.Model.extend({
//     parse: function (obj) {
//         return {
//             'id': obj.id,
//             'title': obj.attributes.title,
//             'description': obj.attributes.description,
//             'icon': obj.relationships.icon.data.id,
//             'x': obj.attributes.x,
//             'y': obj.attributes.y
//         }
//     }
// });
//
// var PointCollection = Backbone.Collection.extend({
//     model: PointModel,
//     url: '/api/points/'
// });
//
// var pointCollection = new PointCollection();
//
// var PointView = Backbone.View.extend({
//
//     className: 'rightInnerBlock',
//
//     id: function () {
//         return this.model.get('id');
//     },
//     template: _.template('<div class="row">\n' +
//         '<div class="card text-white bg-info mb-3" style="width: 36rem;">\n' +
//         '<div class="card-header">X: <%= x %> Y: <%= y %> ' +
//         '<button type="button" class="btn btn-light btn-sm" style="float: right;">Изменить</button>' +
//         '<button type="button" class="btn btn-danger btn-sm" style="float: right;">Удалить</button></div>\n' +
//         '<div class="card-body">\n' +
//         '<h5 class="card-title"><%= title %></h5>\n' +
//         '<p class="card-text"><%= description %></p>\n' +
//         '</div>\n' +
//         '</div>\n' +
//         '</div> '),
//
//     render: function () {
//         this.$el.html(this.template(this.model.toJSON()));
//         return this;
//     },
//     // events: {
//     //     'click': 'upToPoint'
//     // },
//     // upToPoint: function () {
//     //
//     //     var coordinates = [+this.model.get('attributes').x, +this.model.get('attributes').y];
//     //     var map = this.model.get('map');
//     //     map.setView(new ol.View({
//     //         center: ol.proj.fromLonLat(coordinates),
//     //         zoom: 15
//     //     }));
//     //
//     //     var popup = this.model.get('popup');
//     //     popup.setPosition(ol.proj.fromLonLat(coordinates));
//     //
//     //     $(element).popover({
//     //         placement: 'top',
//     //         html: true,
//     //         content: this.model.get('attributes').title
//     //     });
//     //     $(element).popover('show');
//     // }
// });
//
// var PointViewCollection = Backbone.View.extend({
//     id: 'rightBlockId',
//
//     template: _.template('<form action="" role="form" class="form-horizontal">' +
//         '<div class="row form-group">' +
//         '<input type="text" class="form-control col-md-9">' +
//         '<div class="col-md-3">' +
//         '<input type="button" id = "searchId" class="btn btn-primary col" value="Search">' +
//         '</div>' +
//         '</div>' +
//         '</form><div class ="list"></div>'),
//
//     // events: {
//     //     'click #searchId': 'searchAndRender'
//     // },
//
//     // searchAndRender: function () {
//     //     // console.log($('#popup'));
//     // },
//
//     region: {
//         list: '.list'
//     },
//
//     onRender: function () {
//         var _this = this;
//         this.collection.on('change', this.render, this);
//         this.collection.parse = function (data) {
//             return data.data;
//         };
//         this.collection.fetch({
//             success: function () {
//                 _this.showChildView('firstRegion', new SubView({collection: _this.collection}));
//             }
//         });
//
//         this.$el.html(this.template());
//
//         debugger;
//         var test = this.collection.length;
//
//         console.log(this.collection.length);
//
//         for (var i = 0; i < test.length; i++) {
//
//         }
//
//
//         // this.collection.each(function (point) {
//         //     console.log(point);
//         //     var pointView = new PointView({
//         //         model: point
//         //     });
//         //     this.$el.append(pointView.render().el);
//         // }, this);
//     }
// });
//
// var pointViewCollection = new PointViewCollection({
//     collection: pointCollection
// });
//
//
// $('#r1').prepend(pointViewCollection.el);
//
// // function savePoint(form) {
// //
// //     var dataSend = {
// //         "data": {
// //             "type": "Point",
// //             "attributes": {
// //                 "title": form.titleId.value,
// //                 "description": form.descriptionId.value,
// //                 "x": form.coordinateXId.value,
// //                 "y": form.coordinateYId.value,
// //                 "icon": form.chooseIconId.value
// //             }
// //         }
// //     };
// //     var xhr = new XMLHttpRequest();
// //     xhr.open('POST', '/api/points/', false);
// //     xhr.setRequestHeader('Content-Type', 'application/vnd.api+json');
// //     xhr.setRequestHeader('Authorization', 'Token d2ca14ecfd5a10dbb26296dccc4d510b0396fe3a');
// //     xhr.send(JSON.stringify(dataSend));
// // }
// //
// //
// // $('#chooseIconId').html(function () {
// //     var options = '';
// //     for (var i = 0; i < icons.length; i++) {
// //         options += '<option value="' + icons[i].id + '">' + icons[i].attributes.title + '</option>';
// //     }
// //     console.log(options);
// //     return options;
// // });
//
//
// //////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////
//
// var PointsModel = Backbone.Model.extend({
//     urlRoot: 'api'
// });
//
// var Result = Mn.View.extend({
//
//     className: 'col',
//
//     template: _.template('<span><%= count %></span>'),
//
//     initialize(ops) {
//
//         this.count = ops.count || 0;
//     },
//
//     templateContext() {
//         return {
//             count: this.count
//         }
//     },
// });
//
// var Btn = Mn.View.extend({
//
//     tagName: 'button',
//
//     className: 'btn btn-primary',
//
//     template: _.template('Click'),
//
//     triggers: {
//         'click': 'button:click'
//     },
//
//     onButtonClick(view, event) {
//
//     },
// });
//
// var pointTemplate = _.template('<div id="huiId">hui</div><div id="qew"></div>');
//
// var Points = Mn.View.extend({
//
//     initialize() {
//         this.count = 0;
//     },
//
//     template: pointTemplate,
//
//     regions: {
//         'btnRegion': '#qew',
//         'resultRegion': '#huiId'
//     },
//
//     childViewEvents: {
//         'button:click': 'onClick'
//     },
//
//     renderResult(count) {
//         this.showChildView('resultRegion', new Result({count: count}));
//     },
//
//     onClick(view, event) {
//         this.count += 1;
//         this.renderResult(this.count);
//     },
//
//     onRender() {
//         var btn = new Btn();
//         this.showChildView('btnRegion', btn);
//         this.renderResult(this.count);
//     }
// });
//
// var App = Mn.Application.extend({
//
//     onBeforeStart() {
//
//     },
//
//     region: 'body',
//
//     onStart() {
//         console.log(11)
//         this.showView(new Points())
//     },
// });
//
// new App().start();

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

var rasterLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

window.map = new ol.Map({
    layers: [rasterLayer],
    view: new ol.View({
        center: ol.proj.fromLonLat([39.710919, 47.240019]),
        zoom: 15
    })
});


/////////////////// Templates

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
    '<div class="col-md-11">\n' +
    '<select class="custom-select custom-select-md" id="chooseIconId">\n' +
    '</select>\n' +
    '</div>\n' +
    '</div>\n' +
    '<div class="form-group">\n' +
    '<input type="button" class="btn btn-success col-md-12" value="Save">\n' +
    '</div>\n' +
    '</form>\n');

var searchTempalte = _.template(
    '<div class="row form-group">' +
    '<input type="text" class="form-control col-md-9">' +
    '<div class="col-md-3">' +
    '<input type="button" id = "searchId" class="btn btn-primary col" value="Search">' +
    '</div>' +
    '</div>');

var pageTemplate = _.template(
    '<div class="col-md-7">\n' +
    '<div id ="mapRegion"></div>\n' + //// Вставка карты
    '<br/>\n' +
    '<div id="formRegion"></div>' +
    '</div>' +
    '</div>\n' +
    '<div class="col-md-5" id="r1"  class="container-fluid" >' +
    '<div id="searchRegion" class="row"></div>' +
    '<div id="listRegion"  class="row"></div>' +
    '</div>');

var pointChildViewTemplate = _.template('<div class="row">\n' +
    '<div class="card text-white bg-info mb-3" style="width: 32em;">\n' +
    '<div class="card-header">X: <%= x %> Y: <%= y %> ' +
    '<button type="button" class="btn btn-light btn-sm" style="float: right;">Изменить</button>' +
    '<button type="button" class="btn btn-danger btn-sm" style="float: right;">Удалить</button></div>\n' +
    '<div class="card-body">\n' +
    '<h5 class="card-title"><%= title %></h5>\n' +
    '<p class="card-text"><%= description %></p>\n' +
    '</div>\n' +
    '</div>\n' +
    '</div>');

///////////////////
//////////////////////////// models

var PointModel = Backbone.Model.extend({
    parse: function (obj) {
        return {
            'id': obj.id,
            'title': obj.attributes.title,
            'description': obj.attributes.description,
            'icon': {
                'id': obj.relationships.icon.data.id,
            },
            'x': obj.attributes.x,
            'y': obj.attributes.y
        }
    }
});

var IconModel = Backbone.Model.extend({
    parse: function (obj) {
        return {
            'id': obj.id,
            'image': obj.attributes.image
        }
    }
});

////////////////////////////

var PointCollection = Backbone.Collection.extend({
    model: PointModel,
    url: '/api/points/',
});

var IconCollection = Backbone.Collection.extend({
    model: IconModel,
    url: '/api/icons/',
});


var MapView = Mn.View.extend({
    tagName: 'div',

    id: 'map',

    className: 'map',

    initialize(collectionPoint, collectionIcon) {
        this.collectionPoint = collectionPoint;
        this.collectionIcon = collectionIcon;
    },

    onRender() {
        var _this = this;

        var collectIconsFuture = [];
        var count = 0;

        _this.collectionPoint.each(function (point) {

            _this.collectionIcon.each(function (icon) {

                if (point.get('icon').id === icon.get('id')) {

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

        window.map.addLayer(vectorLayer);
        window.map.setTarget(this.$el[0]);
    },

    template: mapTemplate,
});

var FormView = Mn.View.extend({
    tagName: 'form',

    className: 'form-horizontal',

    attributes: {
        'role': 'form'
    },

    template: formTemplate,
});

var SearchView = Mn.View.extend({
    className: 'col',
    template: searchTempalte,
});

var PointChildView = Mn.View.extend({
    className: 'col',
    template: pointChildViewTemplate,
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
        'mapRegion': '#mapRegion',
        'formRegion': '#formRegion',
        'searchRegion': '#searchRegion',
        'listRegion': '#listRegion',
    },

    onRender() {
        this.collectionPoint = new PointCollection();
        this.collectionPoint.on('change', this.render, this);
        this.collectionPoint.parse = function (data) {
            return data.data;
        };

        this.collectionIcon = new IconCollection();
        this.collectionIcon.on('change', this.render, this);
        this.collectionIcon.parse = function (data) {
            return data.data;
        };

        var _this = this;
        this.collectionPoint.fetch({
            success: function () {
                _this.collectionIcon.fetch({
                    success: function () {
                        _this.showChildView('listRegion', new ListView(_this.collectionPoint));
                        _this.showChildView('mapRegion', new MapView(_this.collectionPoint, _this.collectionIcon));
                    }
                });
            }
        });
        var formView = new FormView();
        var searchView = new SearchView();
        this.showChildView('formRegion', formView);
        this.showChildView('searchRegion', searchView);
    },
});

var App = Mn.Application.extend({
    region: '#mainRegion',
    onStart() {
        this.showView(new PageView());
    },
});

new App().start();


//     var iconFeature = new ol.Feature({
//         geometry: new ol.geom.Point(ol.proj.fromLonLat([+points[i].attributes.x, +points[i].attributes.y])),
//         name: points[i].attributes.title,
//     });


//
//     var iconStyle = new ol.style.Style({
//         image: new ol.style.Icon(({
//             anchor: [0, 0],
//             src: iconPath
//         }))
//     });
//
//     iconFeature.setStyle(iconStyle);
//
//     collectIconsFuture[i] = iconFeature;
// }
//
// var vectorSource = new ol.source.Vector({
//     features: collectIconsFuture
// });
//
// var vectorLayer = new ol.layer.Vector({
//     source: vectorSource
// });
//
// var rasterLayer = new ol.layer.Tile({
//     source: new ol.source.OSM()
// });
//
// var map = new ol.Map({
//     layers: [rasterLayer, vectorLayer],  // слои
//     target: document.getElementById('map'),
//     view: new ol.View({
//         center: ol.proj.fromLonLat([39.710919, 47.240019]),
//         zoom: 15
//     })
// });
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