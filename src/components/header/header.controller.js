'use strict';

var header = require('./header.model'); //returns object with obj.model
require('./header.view'); // load the view

header.controller = function() {
  header.vm.init();
};

module.exports = header;
