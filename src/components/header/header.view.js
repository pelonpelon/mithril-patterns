'use strict';

var header = require('./header.model');

header.view = function(ctrl) {
  return m('page-title', [
    m('h1', header.vm.title),
    m('p', header.vm.subtitle)
  ]);
};

