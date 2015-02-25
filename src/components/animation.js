'use strict';

var Velocity = require('velocity-animate');

//view helpers

var fadesIn = function(element, isInitialized, context) {
  if (!isInitialized) {
    element.style.opacity = 0;
    Velocity(element, {
      opacity: 1
    });
  }
};

var fadesOut = function(callback) {
  return function(e) {
    //don't redraw yet
    m.redraw.strategy('none');

    Velocity(e.target, {
      opacity: 0
    }, {
      complete: function() {
        //now that the animation finished, redraw
        m.startComputation();
        callback();
        m.endComputation();
      }
    });
  };
};

var fadesOutPage = function(element, isInitialized, context) {
    if (!isInitialized) {
        element.onclick = function(e) {
            e.preventDefault();
            Velocity(element.parentNode, {opacity: 0}, {
                complete: function() {
                    m.route(element.getAttribute('href'));
                    Velocity(element.parentNode, {opacity: 1}, {}); // +++ fade in 'container' on route change
                }
            });
        };
    }
};

var animation = {};

//model
animation.people = [
  {
    id: 1,
    name: 'John'
  },
  {
    id: 2,
    name: 'Mary'
  },
  {
    id: 3,
    name: 'Bob'
  }
];

//controller
animation.controller = function() {
  this.remove = function(person) {
    animation.people.splice(animation.people.indexOf(person), 1);
  };
};

//view
animation.view = function(ctrl) {
  return m('.velocity', [
    m('h2', 'Animation with velocity.js'),
    m('p', 'click on a name to remove it from the list with animation'),
    m('ul', [
      animation.people.map(function(person) {
        return m('li', {
          key: person.id,
          onclick: fadesOut(ctrl.remove.bind(this, person)),
          config: fadesIn
        }, person.name);
      })
    ]),
    m('a[href="/intro"]', { config: fadesOutPage }, 'Click here to see page transition)')

  ]);
};


module.exports = animation;
