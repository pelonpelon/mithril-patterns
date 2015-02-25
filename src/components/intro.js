'use strict';

// redraw_all:
function redrawDiff() {
  console.log('called redrawAll');
  m.startComputation();
  m.redraw.strategy('diff');
  m.endComputation();
}

function redrawAll() {
  console.log('called redrawAll');
  m.startComputation();
  m.redraw.strategy('all');
  m.endComputation();
}

function redrawNone() {
  console.log('called redrawNone');
  m.startComputation();
  m.redraw.strategy('none');
  m.endComputation();
}

var template = [
  m('h2', 'Intro'),
  m('p', 'This is the intro'),
  m('p', 'And this is a very long paragraph that I am using to check to see if wrap is turned off'),
  m('a[href="javascript:;"]', { onclick: redrawDiff }, 'Redraw_diff'),
  m('a[href="javascript:;"]', { onclick: redrawAll }, 'Redraw_all'),
  m('a[href="javascript:;"]', { onclick: redrawNone }, 'Redraw_none')
];

var intro = {};

intro.controller = function() {

};

intro.view = function(ctrl) {
  return [
    m('.intro', template)
  ];
};

module.exports = intro;
