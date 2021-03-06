'use strict';

var heredoc = require('heredoc');
var style = require('insert-css');


var submodule = function(module, args) {
	return module.view.bind(this, new module.controller(args));
};

var Modal = (function() { // changing to IIFE instead of 'new function'
	var Modal = {};

	var bind = function(fn, args) {return fn.bind(this, args);};
	var subview = function() {};

	Modal.module = (function(store) {// changing to IIFE instead of 'new function'
		return function(module, args) {
			if (arguments.length) {
				store = module;
				if (store) {
					subview = submodule(module);
				}
			}
			return store;
		};
	}());

	Modal.controller = function() {};

	Modal.view = function(ctrl, args) {
		args = args || {};
		return [
			m('.modal', {
				class: [
					Modal.module() ? 'modal-visible' : '',
					args.class
				].join(' '),
				onclick: bind(Modal.module, null),
				config: Modal.config()
			}, [
				m('.modal-dialog', [
					m('a.modal-close[href=javascript:;]', {onclick: bind(Modal.module, null)}, '×'),
					subview()
				])
			]),
			m('.modal-overlay')
		];
	};

	Modal.config = function() {
		return function(element, isInitialized, context) {
			if (!isInitialized) {
				var handleKey = function(e) {
					if (e.keyCode == 27) {
						Modal.module(null);
						m.redraw();
					}
				};

				document.body.addEventListener('keyup', handleKey)

				context.onunload = function() {
					document.body.removeEventListener('keyup', handleKey);
				};
			}
		};
	};

	return Modal;
}());

// demo originally required a complete module, now the module is created (sm)
var demo = function(inner){
  var sm = {
    controller: function(){},
    view: function(){
      return inner;
    }
  };
  var demo = {};
  demo.controller =  function() {
    this.modal = submodule(Modal);
  };
  demo.view = function(ctrl) {
    return [
      m('button[type=button]', {onclick: Modal.module.bind(this, sm)}, 'Click to show modal'),
      ctrl.modal({class: 'modal-animation-8'})
    ];
  };
  return demo;
};

// export Modal and submodule for more control
module.exports = { demo: demo };

var css = heredoc(function(){/*
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 320px;
  height: auto;
  z-index: 10;
  visibility: hidden;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform: translateX(-50%) translateY(-50%);
  -moz-transform: translateX(-50%) translateY(-50%);
  -ms-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
}

.modal-dialog {
  position: relative;
}

.modal-visible {
  visibility: visible;
}

.modal-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  visibility: hidden;
  top: 0;
  left: 0;
  z-index: 9;
  opacity: 0;
}

.modal-close {
  color: inherit;
  font-size: 1.6em;
  font-weight: bold;
  right: 10px;
  position: absolute;
  text-decoration: none;
  top: 5px;
}

.modal-visible ~ .modal-overlay {
  opacity: 1;
  visibility: visible;
}

.modal-dialog {background:silver;min-height:400px;padding:10px;width:400px;}


.modal-overlay {
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

// Effect 1: Fade in and scale up
.modal-animation-1 .modal-dialog {
  -webkit-transform: scale(0.7);
  -moz-transform: scale(0.7);
  -ms-transform: scale(0.7);
  transform: scale(0.7);
  opacity: 0;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

.modal-visible.modal-animation-1 .modal-dialog {
  -webkit-transform: scale(1);
  -moz-transform: scale(1);
  -ms-transform: scale(1);
  transform: scale(1);
  opacity: 1;
}

// Effect 2: Slide from the right
.modal-animation-2 .modal-dialog {
  -webkit-transform: translateX(20%);
  -moz-transform: translateX(20%);
  -ms-transform: translateX(20%);
  transform: translateX(20%);
  opacity: 0;
  -webkit-transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
  -moz-transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
  transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
}

.modal-visible.modal-animation-2 .modal-dialog {
  -webkit-transform: translateX(0);
  -moz-transform: translateX(0);
  -ms-transform: translateX(0);
  transform: translateX(0);
  opacity: 1;
}

// Effect 3: Slide from the bottom
.modal-animation-3 .modal-dialog {
  -webkit-transform: translateY(20%);
  -moz-transform: translateY(20%);
  -ms-transform: translateY(20%);
  transform: translateY(20%);
  opacity: 0;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

.modal-visible.modal-animation-3 .modal-dialog {
  -webkit-transform: translateY(0);
  -moz-transform: translateY(0);
  -ms-transform: translateY(0);
  transform: translateY(0);
  opacity: 1;
}

// Effect 4: Newspaper
.modal-animation-4 .modal-dialog {
  -webkit-transform: scale(0) rotate(720deg);
  -moz-transform: scale(0) rotate(720deg);
  -ms-transform: scale(0) rotate(720deg);
  transform: scale(0) rotate(720deg);
  opacity: 0;
}

.modal-visible.modal-animation-4 ~ .modal-overlay,
.modal-animation-4 .modal-dialog {
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
}

.modal-visible.modal-animation-4 .modal-dialog {
  -webkit-transform: scale(1) rotate(0deg);
  -moz-transform: scale(1) rotate(0deg);
  -ms-transform: scale(1) rotate(0deg);
  transform: scale(1) rotate(0deg);
  opacity: 1;
}

// Effect 5: fall
.modal-animation-5 {
  -webkit-perspective: 1300px;
  -moz-perspective: 1300px;
  perspective: 1300px;
}

.modal-animation-5 .modal-dialog {
  -webkit-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-transform: translateZ(600px) rotateX(20deg);
  -moz-transform: translateZ(600px) rotateX(20deg);
  -ms-transform: translateZ(600px) rotateX(20deg);
  transform: translateZ(600px) rotateX(20deg);
  opacity: 0;
}

.modal-visible.modal-animation-5 .modal-dialog {
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
  -webkit-transform: translateZ(0px) rotateX(0deg);
  -moz-transform: translateZ(0px) rotateX(0deg);
  -ms-transform: translateZ(0px) rotateX(0deg);
  transform: translateZ(0px) rotateX(0deg);
  opacity: 1;
}

// Effect 6: side fall
.modal-animation-6 {
  -webkit-perspective: 1300px;
  -moz-perspective: 1300px;
  perspective: 1300px;
}

.modal-animation-6 .modal-dialog {
  -webkit-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-transform: translate(30%) translateZ(600px) rotate(10deg);
  -moz-transform: translate(30%) translateZ(600px) rotate(10deg);
  -ms-transform: translate(30%) translateZ(600px) rotate(10deg);
  transform: translate(30%) translateZ(600px) rotate(10deg);
  opacity: 0;
}

.modal-visible.modal-animation-6 .modal-dialog {
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
  -webkit-transform: translate(0%) translateZ(0) rotate(0deg);
  -moz-transform: translate(0%) translateZ(0) rotate(0deg);
  -ms-transform: translate(0%) translateZ(0) rotate(0deg);
  transform: translate(0%) translateZ(0) rotate(0deg);
  opacity: 1;
}

// Effect 7:  slide and stick to top
.modal-animation-7{
  top: 0;
  -webkit-transform: translateX(-50%);
  -moz-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  transform: translateX(-50%);
}

.modal-animation-7 .modal-dialog {
  -webkit-transform: translateY(-200%);
  -moz-transform: translateY(-200%);
  -ms-transform: translateY(-200%);
  transform: translateY(-200%);
  -webkit-transition: all .3s;
  -moz-transition: all .3s;
  transition: all .3s;
  opacity: 0;
}

.modal-visible.modal-animation-7 .modal-dialog {
  -webkit-transform: translateY(0%);
  -moz-transform: translateY(0%);
  -ms-transform: translateY(0%);
  transform: translateY(0%);
  border-radius: 0 0 3px 3px;
  opacity: 1;
}

// Effect 8: 3D flip horizontal
.modal-animation-8 {
  -webkit-perspective: 1300px;
  -moz-perspective: 1300px;
  perspective: 1300px;
}

.modal-animation-8 .modal-dialog {
  -webkit-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-transform: rotateY(-70deg);
  -moz-transform: rotateY(-70deg);
  -ms-transform: rotateY(-70deg);
  transform: rotateY(-70deg);
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
  opacity: 0;
}

.modal-visible.modal-animation-8 .modal-dialog {
  -webkit-transform: rotateY(0deg);
  -moz-transform: rotateY(0deg);
  -ms-transform: rotateY(0deg);
  transform: rotateY(0deg);
  opacity: 1;
}

// Effect 9: 3D flip vertical
.modal-animation-9 {
  -webkit-perspective: 1300px;
  -moz-perspective: 1300px;
  perspective: 1300px;
}

.modal-animation-9 .modal-dialog {
  -webkit-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-transform: rotateX(-70deg);
  -moz-transform: rotateX(-70deg);
  -ms-transform: rotateX(-70deg);
  transform: rotateX(-70deg);
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
  opacity: 0;
}

.modal-visible.modal-animation-9 .modal-dialog {
  -webkit-transform: rotateX(0deg);
  -moz-transform: rotateX(0deg);
  -ms-transform: rotateX(0deg);
  transform: rotateX(0deg);
  opacity: 1;
}

// Effect 10: 3D sign
.modal-animation-10 {
  -webkit-perspective: 1300px;
  -moz-perspective: 1300px;
  perspective: 1300px;
}

.modal-animation-10 .modal-dialog {
  -webkit-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-transform: rotateX(-60deg);
  -moz-transform: rotateX(-60deg);
  -ms-transform: rotateX(-60deg);
  transform: rotateX(-60deg);
  -webkit-transform-origin: 50% 0;
  -moz-transform-origin: 50% 0;
  transform-origin: 50% 0;
  opacity: 0;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

.modal-visible.modal-animation-10 .modal-dialog {
  -webkit-transform: rotateX(0deg);
  -moz-transform: rotateX(0deg);
  -ms-transform: rotateX(0deg);
  transform: rotateX(0deg);
  opacity: 1;
}

// Effect 11: Super scaled
.modal-animation-11 .modal-dialog {
  -webkit-transform: scale(2);
  -moz-transform: scale(2);
  -ms-transform: scale(2);
  transform: scale(2);
  opacity: 0;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

.modal-visible.modal-animation-11 .modal-dialog {
  -webkit-transform: scale(1);
  -moz-transform: scale(1);
  -ms-transform: scale(1);
  transform: scale(1);
  opacity: 1;
}

// Effect 12:  Just me
.modal-animation-12 .modal-dialog {
  -webkit-transform: scale(0.8);
  -moz-transform: scale(0.8);
  -ms-transform: scale(0.8);
  transform: scale(0.8);
  opacity: 0;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

.modal-visible.modal-animation-12 ~ .modal-overlay {
  background: #e74c3c;
}

.modal-animation-12 .modal-dialog h3,
.modal-animation-12 .modal-dialog {
  background: transparent;
}

.modal-visible.modal-animation-12 .modal-dialog {
  -webkit-transform: scale(1);
  -moz-transform: scale(1);
  -ms-transform: scale(1);
  transform: scale(1);
  opacity: 1;
}

// Effect 13: 3D slit
.modal-animation-13 {
  -webkit-perspective: 1300px;
  -moz-perspective: 1300px;
  perspective: 1300px;
}

.modal-animation-13 .modal-dialog {
  -webkit-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-transform: translateZ(-3000px) rotateY(90deg);
  -moz-transform: translateZ(-3000px) rotateY(90deg);
  -ms-transform: translateZ(-3000px) rotateY(90deg);
  transform: translateZ(-3000px) rotateY(90deg);
  opacity: 0;
}

.modal-visible.modal-animation-13 .modal-dialog {
  -webkit-animation: slit .7s forwards ease-out;
  -moz-animation: slit .7s forwards ease-out;
  animation: slit .7s forwards ease-out;
}

@-webkit-keyframes slit {
  50% { -webkit-transform: translateZ(-250px) rotateY(89deg); opacity: .5; -webkit-animation-timing-function: ease-out;}
  100% { -webkit-transform: translateZ(0) rotateY(0deg); opacity: 1; }
}

@-moz-keyframes slit {
  50% { -moz-transform: translateZ(-250px) rotateY(89deg); opacity: .5; -moz-animation-timing-function: ease-out;}
  100% { -moz-transform: translateZ(0) rotateY(0deg); opacity: 1; }
}

@keyframes slit {
  50% { transform: translateZ(-250px) rotateY(89deg); opacity: 1; animation-timing-function: ease-in;}
  100% { transform: translateZ(0) rotateY(0deg); opacity: 1; }
}

// Effect 14:  3D Rotate from bottom
.modal-animation-14 {
  -webkit-perspective: 1300px;
  -moz-perspective: 1300px;
  perspective: 1300px;
}

.modal-animation-14 .modal-dialog {
  -webkit-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-transform: translateY(100%) rotateX(90deg);
  -moz-transform: translateY(100%) rotateX(90deg);
  -ms-transform: translateY(100%) rotateX(90deg);
  transform: translateY(100%) rotateX(90deg);
  -webkit-transform-origin: 0 100%;
  -moz-transform-origin: 0 100%;
  transform-origin: 0 100%;
  opacity: 0;
  -webkit-transition: all 0.3s ease-out;
  -moz-transition: all 0.3s ease-out;
  transition: all 0.3s ease-out;
}

.modal-visible.modal-animation-14 .modal-dialog {
  -webkit-transform: translateY(0%) rotateX(0deg);
  -moz-transform: translateY(0%) rotateX(0deg);
  -ms-transform: translateY(0%) rotateX(0deg);
  transform: translateY(0%) rotateX(0deg);
  opacity: 1;
}

// Effect 15:  3D Rotate in from left
.modal-animation-15 {
  -webkit-perspective: 1300px;
  -moz-perspective: 1300px;
  perspective: 1300px;
}

.modal-animation-15 .modal-dialog {
  -webkit-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-transform: translateZ(100px) translateX(-30%) rotateY(90deg);
  -moz-transform: translateZ(100px) translateX(-30%) rotateY(90deg);
  -ms-transform: translateZ(100px) translateX(-30%) rotateY(90deg);
  transform: translateZ(100px) translateX(-30%) rotateY(90deg);
  -webkit-transform-origin: 0 100%;
  -moz-transform-origin: 0 100%;
  transform-origin: 0 100%;
  opacity: 0;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

.modal-visible.modal-animation-15 .modal-dialog {
  -webkit-transform: translateZ(0px) translateX(0%) rotateY(0deg);
  -moz-transform: translateZ(0px) translateX(0%) rotateY(0deg);
  -ms-transform: translateZ(0px) translateX(0%) rotateY(0deg);
  transform: translateZ(0px) translateX(0%) rotateY(0deg);
  opacity: 1;
}

// Effect 16:  Blur
.modal-visible.modal-animation-16 ~ .modal-overlay {
  background: rgba(180,46,32,0.5);
}

.modal-visible.modal-animation-16 ~ .container {
  -webkit-filter: blur(3px);
  -moz-filter: blur(3px);
  filter: blur(3px);
}

.modal-animation-16 .modal-dialog {
  -webkit-transform: translateY(-5%);
  -moz-transform: translateY(-5%);
  -ms-transform: translateY(-5%);
  transform: translateY(-5%);
  opacity: 0;
}

.modal-visible.modal-animation-16 ~ .container,
.modal-animation-16 .modal-dialog {
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

.modal-visible.modal-animation-16 .modal-dialog {
  -webkit-transform: translateY(0);
  -moz-transform: translateY(0);
  -ms-transform: translateY(0);
  transform: translateY(0);
  opacity: 1;
}

*/});
style(css, {prepend: true})
