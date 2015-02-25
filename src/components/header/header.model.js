'use strict';

var header = {};

header.vm = (function() {
  var vm = {};

  vm.init = function() {
    vm.title = 'Mithril Patterns';
    vm.subtitle = 'Conventions, in mithril development';

    // nothing

    return vm;
  };

  return vm;
}());

module.exports = header;
