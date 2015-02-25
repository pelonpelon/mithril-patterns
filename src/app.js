// app.js
'use strict';

window.config = require('../gulp-config.js');
require('./styles/app.styl');

window.m = require('../mithril_pxp.js');

var intro = require('./components/intro.js');
intro.INTRO = {}; // marker to identify component in dev tools
// var example = require('./components/example.js');
// example.EXAMPLE = {}; // marker to identify component in dev tools
var animation = require('./components/animation.js');
animation.ANIMATION = {}; // marker to identify component in dev tools
var components = require('./components/components_organization.js');
components.COMPONENTS = {}; // marker to identify component in dev tools
var binding = require('./components/bi-directional_data-binding.js');
binding.BINDING = {}; // marker to identify component in dev tools
var modal = require('./components/modal.js').demo;
modal.MODAL = {}; // marker to identify component in dev tools

var example = {};
var lazyload = function (route) {
  console.log('inside example: ' + window.location.search);
  if (window.location.search.replace(/\?/, '') === '/' + route) {
    console.log('passed if');
    require.ensure([], function () { // this syntax is weird but it works
      return require('./components/' + route).show(); // when this function is called, the module is guaranteed to be synchronously available.
    });
  }
  console.log('failed if: ' + window.location.search);
};

m.route(document.getElementById('content'), '/', {
  '/': intro,
  '/example': lazyload(example),
  '/animation': animation,
  '/components': components,
  '/binding': binding,
  '/modal': modal(m('div', 'There\'s more to this Hobbit than meets the eye.'))
});

var header = require('./components/header/header.controller.js');
header.HEADER = {}; // marker to identify component in dev tools
m.module(document.getElementById('header'), header);
var menu = require('./components/menu/menu.controller.js');
menu.MENU = {}; // marker to identify component in dev tools
m.module(document.getElementById('menu'), menu);
var footer = require('./components/footer/footer.controller.js');
footer.FOOTER = {}; // marker to identify component in dev tools
m.module(document.getElementById('footer'), footer);


