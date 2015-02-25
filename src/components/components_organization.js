'use strict';

//model

var model = [
  {id: '1', name: 'Jack'},
  {id: '2', name: 'Jill'},
  {id: '3', name: 'Peter'},
  {id: '4', name: 'Petra'},
  {id: '5', name: 'Billy'},
  {id: '6', name: 'Tracy'},
  {id: '7', name: 'Terry'},
];

var Thing = {};
Thing.list = function() {
    // return m.request({method: 'GET', url: '/api/things'});
    return function(){return model;};
};

//filter
var filter = {};
filter.controller = function(options) {
    this.searchTerm = m.prop('');
};
filter.view = function(ctrl) {
    return m('input', {oninput: m.withAttr('value', ctrl.searchTerm)});
};

//list
var list = {};
list.controller = function(options) {
    this.items = Thing.list();
    this.visible = options.visible;
};
list.view = function(ctrl) {
    return m('table', [
        ctrl.items().filter(ctrl.visible).map(function(item) {
            return m('tr', [
                m('td', item.id),
                m('td', item.name)
            ]);
        })
    ]);
};

//top level component
var things = {};

things.controller = function() {
    var ctrl = this;

    ctrl.list = new list.controller({
        visible: function(item) {
            return item.name.toLowerCase().indexOf(ctrl.filter.searchTerm().toLowerCase()) > -1;
        }
    });

    ctrl.filter = new filter.controller();
};
things.view = function(ctrl) {
return m('.search', [
  m('.row', [
    m('.col-md-2', [
        filter.view(ctrl.filter)
    ]),
    m('.col-md-10', [
        list.view(ctrl.list)
    ])
  ])
]);
};

module.exports = things;

//run
// m.module(document.body, things)

