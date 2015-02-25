'use strict';

var menu = require('./menu.model.js');
menu.controller = function() {
  var pages = menu.PageList();
  return {
    pages: pages,
    rotate: function() {
      pages().push(pages().shift());
    }
  };
};
require('./menu.view.js');

module.exports = menu;
