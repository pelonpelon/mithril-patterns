'use strict';

var footer = {};

footer.controller = function() {
  // nada
};

footer.view = function(ctrl) {
  var vm = footer.vm;

  return m('div.credits', [
    m('span', '©pelonpelon')
  ]);
};


module.exports = footer;
