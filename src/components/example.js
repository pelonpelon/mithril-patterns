'use strict';

//namespace
var app = {};

//model
app.PageList = function() {
  return m.request({
    method: 'GET',
    url: config.version + '/pages.json'
  });
};

//controller
app.controller = function() {
  var pages = app.PageList();
  return {
    pages: pages,
    rotate: function() {
      pages().push(pages().shift());
    }
  };
};

//view
app.view = function(ctrl) {
  return [
    m('.col(4,4,12)', [
      m('h2', 'Output'),
      m('div#example.example.output', [
        ctrl.pages().map(function(page) {
          return m('a', {
            href: page.url, config: m.route
          }, page.title);
        }),
        m('button', { onclick: ctrl.rotate }, 'Rotate links')
      ])
    ])
  ];
};

module.exports = app;
