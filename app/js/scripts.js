/*!
Mailchimp Ajax Submit
jQuery Plugin
Author: Siddharth Doshi

Use:
===
$('#form_id').ajaxchimp(options);

- Form should have one <input> element with attribute 'type=email'
- Form should have one label element with attribute 'for=email_input_id' (used to display error/success message)
- All options are optional.

Options:
=======
options = {
    language: 'en',
    callback: callbackFunction,
    url: 'http://blahblah.us1.list-manage.com/subscribe/post?u=5afsdhfuhdsiufdba6f8802&id=4djhfdsh99f'
}

Notes:
=====
To get the mailchimp JSONP url (undocumented), change 'post?' to 'post-json?' and add '&c=?' to the end.
For e.g. 'http://blahblah.us1.list-manage.com/subscribe/post-json?u=5afsdhfuhdsiufdba6f8802&id=4djhfdsh99f&c=?',
*/

(function ($) {
    'use strict';

    $.ajaxChimp = {
        responses: {
            'We have sent you a confirmation email'                                             : 0,
            'Please enter a value'                                                              : 1,
            'An email address must contain a single @'                                          : 2,
            'The domain portion of the email address is invalid (the portion after the @: )'    : 3,
            'The username portion of the email address is invalid (the portion before the @: )' : 4,
            'This email address looks fake or invalid. Please enter a real email address'       : 5
        },
        translations: {
            'en': null
        },
        init: function (selector, options) {
            $(selector).ajaxChimp(options);
        }
    };

    $.fn.ajaxChimp = function (options) {
        $(this).each(function(i, elem) {
            var form = $(elem);
            var email = form.find('input[type=email]');
            var label = form.find('label[for=' + email.attr('id') + ']');

            var settings = $.extend({
                'url': form.attr('action'),
                'language': 'en'
            }, options);

            var url = settings.url.replace('/post?', '/post-json?').concat('&c=?');

            form.attr('novalidate', 'true');
            email.attr('name', 'EMAIL');

            form.submit(function () {
                var msg;
                function successCallback(resp) {
                    if (resp.result === 'success') {
                        msg = 'We have sent you a confirmation email';
                        label.removeClass('error').addClass('valid');
                        email.removeClass('error').addClass('valid');
                    } else {
                        email.removeClass('valid').addClass('error');
                        label.removeClass('valid').addClass('error');
                        var index = -1;
                        try {
                            var parts = resp.msg.split(' - ', 2);
                            if (parts[1] === undefined) {
                                msg = resp.msg;
                            } else {
                                var i = parseInt(parts[0], 10);
                                if (i.toString() === parts[0]) {
                                    index = parts[0];
                                    msg = parts[1];
                                } else {
                                    index = -1;
                                    msg = resp.msg;
                                }
                            }
                        }
                        catch (e) {
                            index = -1;
                            msg = resp.msg;
                        }
                    }

                    // Translate and display message
                    if (
                        settings.language !== 'en'
                        && $.ajaxChimp.responses[msg] !== undefined
                        && $.ajaxChimp.translations
                        && $.ajaxChimp.translations[settings.language]
                        && $.ajaxChimp.translations[settings.language][$.ajaxChimp.responses[msg]]
                    ) {
                        msg = $.ajaxChimp.translations[settings.language][$.ajaxChimp.responses[msg]];
                    }
                    label.html(msg);

                    label.show(2000);
                    if (settings.callback) {
                        settings.callback(resp);
                    }
                }

                var data = {};
                var dataArray = form.serializeArray();
                $.each(dataArray, function (index, item) {
                    data[item.name] = item.value;
                });

                $.ajax({
                    url: url,
                    data: data,
                    success: successCallback,
                    dataType: 'jsonp',
                    error: function (resp, text) {
                        console.log('mailchimp ajax submit error: ' + text);
                    }
                });

                // Translate and display submit message
                var submitMsg = 'Submitting...';
                if(
                    settings.language !== 'en'
                    && $.ajaxChimp.translations
                    && $.ajaxChimp.translations[settings.language]
                    && $.ajaxChimp.translations[settings.language]['submit']
                ) {
                    submitMsg = $.ajaxChimp.translations[settings.language]['submit'];
                }
                label.html(submitMsg).show(2000);

                return false;
            });
        });
        return this;
    };
})(jQuery);

/*!
 * animsition v4.0.2
 * A simple and easy jQuery plugin for CSS animated page transitions.
 * http://blivesta.github.io/animsition
 * License : MIT
 * Author : blivesta (http://blivesta.com/)
 */
;(function (factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
}(function ($) {
  'use strict';
  var namespace = 'animsition';
  var __ = {
    init: function(options){
      options = $.extend({
        inClass               :   'fade-in',
        outClass              :   'fade-out',
        inDuration            :    1500,
        outDuration           :    800,
        linkElement           :   '.animsition-link',
        // e.g. linkElement   :   'a:not([target="_blank"]):not([href^="#"])'
        loading               :    true,
        loadingParentElement  :   'body', //animsition wrapper element
        loadingClass          :   'animsition-loading',
        loadingInner          :   '', // e.g '<img src="loading.svg" />'
        timeout               :   false,
        timeoutCountdown      :   5000,
        onLoadEvent           :   true,
        browser               : [ 'animation-duration', '-webkit-animation-duration'],
        // "browser" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
        // The default setting is to disable the "animsition" in a browser that does not support "animation-duration".
        overlay               :   false,
        overlayClass          :   'animsition-overlay-slide',
        overlayParentElement  :   'body',
        transition            :   function(url){ window.location.href = url; }
      }, options);

      __.settings = {
        timer: false,
        data: {
          inClass: 'animsition-in-class',
          inDuration: 'animsition-in-duration',
          outClass: 'animsition-out-class',
          outDuration: 'animsition-out-duration',
          overlay: 'animsition-overlay'
        },
        events: {
          inStart: 'animsition.inStart',
          inEnd: 'animsition.inEnd',
          outStart: 'animsition.outStart',
          outEnd: 'animsition.outEnd'
        }
      };

      // Remove the "Animsition" in a browser
      // that does not support the "animaition-duration".
      var support = __.supportCheck.call(this, options);

      if(!support && options.browser.length > 0){
        if(!support || !this.length){
          // If do not have a console object to object window
          if (!('console' in window)) {
            window.console = {};
            window.console.log = function(str){ return str; };
          }
          if(!this.length) console.log('Animsition: Element does not exist on page.');
          if(!support) console.log('Animsition: Does not support this browser.');
          return __.destroy.call(this);
        }
      }

      var overlayMode = __.optionCheck.call(this, options);

      if (overlayMode && $('.' + options.overlayClass).length <= 0) {
        __.addOverlay.call(this, options);
      }

      if (options.loading && $('.' + options.loadingClass).length <= 0) {
        __.addLoading.call(this, options);
      }

      return this.each(function(){
        var _this = this;
        var $this = $(this);
        var $window = $(window);
        var $document = $(document);
        var data = $this.data(namespace);

        if (!data) {
          options = $.extend({}, options);

          $this.data(namespace, { options: options });

          if(options.timeout) __.addTimer.call(_this);

          if(options.onLoadEvent) {
            $window.on('load.' + namespace, function() {
              if(__.settings.timer) clearTimeout(__.settings.timer);
              __.in.call(_this);
            });
          }

          $window.on('pageshow.' + namespace, function(event) {
            if(event.originalEvent.persisted) __.in.call(_this);
          });

          // Firefox back button issue #4
          $window.on('unload.' + namespace, function() { });

          $document.on('click.' + namespace, options.linkElement, function(event) {
            event.preventDefault();
            var $self = $(this);
            var url = $self.attr('href');

            // middle mouse button issue #24
            // if(middle mouse button || command key || shift key || win control key)
            if (event.which === 2 || event.metaKey || event.shiftKey || navigator.platform.toUpperCase().indexOf('WIN') !== -1 && event.ctrlKey) {
              window.open(url, '_blank');
            } else {
              __.out.call(_this, $self, url);
            }

          });
        }
      }); // end each
    },

    addOverlay: function(options){
      $(options.overlayParentElement)
        .prepend('<div class="' + options.overlayClass + '"></div>');
    },

    addLoading: function(options){
      $(options.loadingParentElement)
        .append('<div class="' + options.loadingClass + '">' + options.loadingInner + '</div>');
    },

    removeLoading: function(){
      var $this     = $(this);
      var options   = $this.data(namespace).options;
      var $loading  = $(options.loadingParentElement).children('.' + options.loadingClass);

      $loading.fadeOut().remove();
    },

    addTimer: function(){
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;

      __.settings.timer = setTimeout(function(){
        __.in.call(_this);
        $(window).off('load.' + namespace);
      }, options.timeoutCountdown);
    },

    supportCheck: function(options){
      var $this = $(this);
      var props = options.browser;
      var propsNum = props.length;
      var support  = false;

      if (propsNum === 0) {
        support = true;
      }
      for (var i = 0; i < propsNum; i++) {
        if (typeof $this.css(props[i]) === 'string') {
          support = true;
          break;
        }
      }
      return support;
    },

    optionCheck: function(options){
      var $this = $(this);
      var overlayMode;
      if(options.overlay || $this.data(__.settings.data.overlay)){
        overlayMode = true;
      } else {
        overlayMode = false;
      }
      return overlayMode;
    },

    animationCheck : function(data, stateClass, stateIn){
      var $this = $(this);
      var options = $this.data(namespace).options;
      var dataType = typeof data;
      var dataDuration = !stateClass && dataType === 'number';
      var dataClass = stateClass && dataType === 'string' && data.length > 0;

      if(dataDuration || dataClass){
        data = data;
      } else if(stateClass && stateIn) {
        data = options.inClass;
      } else if(!stateClass && stateIn) {
        data = options.inDuration;
      } else if(stateClass && !stateIn) {
        data = options.outClass;
      } else if(!stateClass && !stateIn) {
        data = options.outDuration;
      }
      return data;
    },

    in: function(){
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;
      var thisInDuration = $this.data(__.settings.data.inDuration);
      var thisInClass = $this.data(__.settings.data.inClass);
      var inDuration = __.animationCheck.call(_this, thisInDuration, false, true);
      var inClass = __.animationCheck.call(_this, thisInClass, true, true);
      var overlayMode = __.optionCheck.call(_this, options);
      var outClass = $this.data(namespace).outClass;

      if(options.loading) __.removeLoading.call(_this);

      if(outClass) $this.removeClass(outClass);

      if(overlayMode) {
        __.inOverlay.call(_this, inClass, inDuration);
      } else {
        __.inDefault.call(_this, inClass, inDuration);
      }
    },

    inDefault: function(inClass, inDuration){
      var $this = $(this);

      $this
        .css({ 'animation-duration' : inDuration + 'ms' })
        .addClass(inClass)
        .trigger(__.settings.events.inStart)
        .animateCallback(function(){
          $this
            .removeClass(inClass)
            .css({ 'opacity' : 1 })
            .trigger(__.settings.events.inEnd);
        });
    },

    inOverlay: function(inClass, inDuration){
      var $this = $(this);
      var options = $this.data(namespace).options;

      $this
        .css({ 'opacity' : 1 })
        .trigger(__.settings.events.inStart);

      $(options.overlayParentElement)
        .children('.' + options.overlayClass)
        .css({ 'animation-duration' : inDuration + 'ms' })
        .addClass(inClass)
        .animateCallback(function(){
          $this
            .trigger(__.settings.events.inEnd);
        });
    },

    out: function($self, url){
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;
      var selfOutClass = $self.data(__.settings.data.outClass);
      var thisOutClass = $this.data(__.settings.data.outClass);
      var selfOutDuration = $self.data(__.settings.data.outDuration);
      var thisOutDuration = $this.data(__.settings.data.outDuration);
      var isOutClass = selfOutClass ? selfOutClass : thisOutClass;
      var isOutDuration = selfOutDuration ? selfOutDuration : thisOutDuration;
      var outClass = __.animationCheck.call(_this, isOutClass, true, false);
      var outDuration = __.animationCheck.call(_this, isOutDuration, false, false);
      var overlayMode = __.optionCheck.call(_this, options);

      $this.data(namespace).outClass = outClass;

      if(overlayMode) {
        __.outOverlay.call(_this, outClass, outDuration, url);
      } else {
        __.outDefault.call(_this, outClass, outDuration, url);
      }
    },

    outDefault: function(outClass, outDuration, url){
      var $this = $(this);
      var options = $this.data(namespace).options;

      // (outDuration + 1) | #55 outDuration: 0 crashes on Safari only
      $this
        .css({ 'animation-duration' : (outDuration + 1)  + 'ms' })
        .addClass(outClass)
        .trigger(__.settings.events.outStart)
        .animateCallback(function(){
          $this.trigger(__.settings.events.outEnd);
          options.transition(url);
        });
    },


    outOverlay: function(outClass, outDuration, url){
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;
      var thisInClass = $this.data(__.settings.data.inClass);
      var inClass = __.animationCheck.call(_this, thisInClass, true, true);

      // (outDuration + 1) | #55 outDuration: 0 crashes animsition on Safari only
      $(options.overlayParentElement)
        .children('.' + options.overlayClass)
        .css({ 'animation-duration' : (outDuration + 1) + 'ms' })
        .removeClass(inClass)
        .addClass(outClass)
        .trigger(__.settings.events.outStart)
        .animateCallback(function(){
          $this.trigger(__.settings.events.outEnd);
          options.transition(url);
        });
    },

    destroy: function(){
      return this.each(function(){
        var $this = $(this);
        $(window).off('.'+ namespace);
        $this
          .css({'opacity': 1})
          .removeData(namespace);
      });
    }

  };

  $.fn.animateCallback = function(callback){
    var end = 'animationend webkitAnimationEnd';
    return this.each(function() {
      var $this = $(this);
      $this.on(end, function(){
        $this.off(end);
        return callback.call(this);
      });
    });
  };

  $.fn.animsition = function(method){
    if ( __[method] ) {
      return __[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return __.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.'+namespace);
    }
  };

}));

/*!
 * clipboard.js v2.0.0
 * https://zenorocha.github.io/clipboard.js
 * 
 * Licensed MIT © Zeno Rocha
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ClipboardJS"] = factory();
	else
		root["ClipboardJS"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, __webpack_require__(7)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
        factory(module, require('select'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.select);
        global.clipboardAction = mod.exports;
    }
})(this, function (module, _select) {
    'use strict';

    var _select2 = _interopRequireDefault(_select);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var ClipboardAction = function () {
        /**
         * @param {Object} options
         */
        function ClipboardAction(options) {
            _classCallCheck(this, ClipboardAction);

            this.resolveOptions(options);
            this.initSelection();
        }

        /**
         * Defines base properties passed from constructor.
         * @param {Object} options
         */


        _createClass(ClipboardAction, [{
            key: 'resolveOptions',
            value: function resolveOptions() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                this.action = options.action;
                this.container = options.container;
                this.emitter = options.emitter;
                this.target = options.target;
                this.text = options.text;
                this.trigger = options.trigger;

                this.selectedText = '';
            }
        }, {
            key: 'initSelection',
            value: function initSelection() {
                if (this.text) {
                    this.selectFake();
                } else if (this.target) {
                    this.selectTarget();
                }
            }
        }, {
            key: 'selectFake',
            value: function selectFake() {
                var _this = this;

                var isRTL = document.documentElement.getAttribute('dir') == 'rtl';

                this.removeFake();

                this.fakeHandlerCallback = function () {
                    return _this.removeFake();
                };
                this.fakeHandler = this.container.addEventListener('click', this.fakeHandlerCallback) || true;

                this.fakeElem = document.createElement('textarea');
                // Prevent zooming on iOS
                this.fakeElem.style.fontSize = '12pt';
                // Reset box model
                this.fakeElem.style.border = '0';
                this.fakeElem.style.padding = '0';
                this.fakeElem.style.margin = '0';
                // Move element out of screen horizontally
                this.fakeElem.style.position = 'absolute';
                this.fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
                // Move element to the same position vertically
                var yPosition = window.pageYOffset || document.documentElement.scrollTop;
                this.fakeElem.style.top = yPosition + 'px';

                this.fakeElem.setAttribute('readonly', '');
                this.fakeElem.value = this.text;

                this.container.appendChild(this.fakeElem);

                this.selectedText = (0, _select2.default)(this.fakeElem);
                this.copyText();
            }
        }, {
            key: 'removeFake',
            value: function removeFake() {
                if (this.fakeHandler) {
                    this.container.removeEventListener('click', this.fakeHandlerCallback);
                    this.fakeHandler = null;
                    this.fakeHandlerCallback = null;
                }

                if (this.fakeElem) {
                    this.container.removeChild(this.fakeElem);
                    this.fakeElem = null;
                }
            }
        }, {
            key: 'selectTarget',
            value: function selectTarget() {
                this.selectedText = (0, _select2.default)(this.target);
                this.copyText();
            }
        }, {
            key: 'copyText',
            value: function copyText() {
                var succeeded = void 0;

                try {
                    succeeded = document.execCommand(this.action);
                } catch (err) {
                    succeeded = false;
                }

                this.handleResult(succeeded);
            }
        }, {
            key: 'handleResult',
            value: function handleResult(succeeded) {
                this.emitter.emit(succeeded ? 'success' : 'error', {
                    action: this.action,
                    text: this.selectedText,
                    trigger: this.trigger,
                    clearSelection: this.clearSelection.bind(this)
                });
            }
        }, {
            key: 'clearSelection',
            value: function clearSelection() {
                if (this.trigger) {
                    this.trigger.focus();
                }

                window.getSelection().removeAllRanges();
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.removeFake();
            }
        }, {
            key: 'action',
            set: function set() {
                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'copy';

                this._action = action;

                if (this._action !== 'copy' && this._action !== 'cut') {
                    throw new Error('Invalid "action" value, use either "copy" or "cut"');
                }
            },
            get: function get() {
                return this._action;
            }
        }, {
            key: 'target',
            set: function set(target) {
                if (target !== undefined) {
                    if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target.nodeType === 1) {
                        if (this.action === 'copy' && target.hasAttribute('disabled')) {
                            throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                        }

                        if (this.action === 'cut' && (target.hasAttribute('readonly') || target.hasAttribute('disabled'))) {
                            throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                        }

                        this._target = target;
                    } else {
                        throw new Error('Invalid "target" value, use a valid Element');
                    }
                }
            },
            get: function get() {
                return this._target;
            }
        }]);

        return ClipboardAction;
    }();

    module.exports = ClipboardAction;
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var is = __webpack_require__(6);
var delegate = __webpack_require__(5);

/**
 * Validates all params and calls the right
 * listener function based on its target type.
 *
 * @param {String|HTMLElement|HTMLCollection|NodeList} target
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listen(target, type, callback) {
    if (!target && !type && !callback) {
        throw new Error('Missing required arguments');
    }

    if (!is.string(type)) {
        throw new TypeError('Second argument must be a String');
    }

    if (!is.fn(callback)) {
        throw new TypeError('Third argument must be a Function');
    }

    if (is.node(target)) {
        return listenNode(target, type, callback);
    }
    else if (is.nodeList(target)) {
        return listenNodeList(target, type, callback);
    }
    else if (is.string(target)) {
        return listenSelector(target, type, callback);
    }
    else {
        throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
    }
}

/**
 * Adds an event listener to a HTML element
 * and returns a remove listener function.
 *
 * @param {HTMLElement} node
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNode(node, type, callback) {
    node.addEventListener(type, callback);

    return {
        destroy: function() {
            node.removeEventListener(type, callback);
        }
    }
}

/**
 * Add an event listener to a list of HTML elements
 * and returns a remove listener function.
 *
 * @param {NodeList|HTMLCollection} nodeList
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNodeList(nodeList, type, callback) {
    Array.prototype.forEach.call(nodeList, function(node) {
        node.addEventListener(type, callback);
    });

    return {
        destroy: function() {
            Array.prototype.forEach.call(nodeList, function(node) {
                node.removeEventListener(type, callback);
            });
        }
    }
}

/**
 * Add an event listener to a selector
 * and returns a remove listener function.
 *
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenSelector(selector, type, callback) {
    return delegate(document.body, selector, type, callback);
}

module.exports = listen;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, __webpack_require__(0), __webpack_require__(2), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
        factory(module, require('./clipboard-action'), require('tiny-emitter'), require('good-listener'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.clipboardAction, global.tinyEmitter, global.goodListener);
        global.clipboard = mod.exports;
    }
})(this, function (module, _clipboardAction, _tinyEmitter, _goodListener) {
    'use strict';

    var _clipboardAction2 = _interopRequireDefault(_clipboardAction);

    var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

    var _goodListener2 = _interopRequireDefault(_goodListener);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var Clipboard = function (_Emitter) {
        _inherits(Clipboard, _Emitter);

        /**
         * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
         * @param {Object} options
         */
        function Clipboard(trigger, options) {
            _classCallCheck(this, Clipboard);

            var _this = _possibleConstructorReturn(this, (Clipboard.__proto__ || Object.getPrototypeOf(Clipboard)).call(this));

            _this.resolveOptions(options);
            _this.listenClick(trigger);
            return _this;
        }

        /**
         * Defines if attributes would be resolved using internal setter functions
         * or custom functions that were passed in the constructor.
         * @param {Object} options
         */


        _createClass(Clipboard, [{
            key: 'resolveOptions',
            value: function resolveOptions() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                this.action = typeof options.action === 'function' ? options.action : this.defaultAction;
                this.target = typeof options.target === 'function' ? options.target : this.defaultTarget;
                this.text = typeof options.text === 'function' ? options.text : this.defaultText;
                this.container = _typeof(options.container) === 'object' ? options.container : document.body;
            }
        }, {
            key: 'listenClick',
            value: function listenClick(trigger) {
                var _this2 = this;

                this.listener = (0, _goodListener2.default)(trigger, 'click', function (e) {
                    return _this2.onClick(e);
                });
            }
        }, {
            key: 'onClick',
            value: function onClick(e) {
                var trigger = e.delegateTarget || e.currentTarget;

                if (this.clipboardAction) {
                    this.clipboardAction = null;
                }

                this.clipboardAction = new _clipboardAction2.default({
                    action: this.action(trigger),
                    target: this.target(trigger),
                    text: this.text(trigger),
                    container: this.container,
                    trigger: trigger,
                    emitter: this
                });
            }
        }, {
            key: 'defaultAction',
            value: function defaultAction(trigger) {
                return getAttributeValue('action', trigger);
            }
        }, {
            key: 'defaultTarget',
            value: function defaultTarget(trigger) {
                var selector = getAttributeValue('target', trigger);

                if (selector) {
                    return document.querySelector(selector);
                }
            }
        }, {
            key: 'defaultText',
            value: function defaultText(trigger) {
                return getAttributeValue('text', trigger);
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.listener.destroy();

                if (this.clipboardAction) {
                    this.clipboardAction.destroy();
                    this.clipboardAction = null;
                }
            }
        }], [{
            key: 'isSupported',
            value: function isSupported() {
                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['copy', 'cut'];

                var actions = typeof action === 'string' ? [action] : action;
                var support = !!document.queryCommandSupported;

                actions.forEach(function (action) {
                    support = support && !!document.queryCommandSupported(action);
                });

                return support;
            }
        }]);

        return Clipboard;
    }(_tinyEmitter2.default);

    /**
     * Helper function to retrieve attribute value.
     * @param {String} suffix
     * @param {Element} element
     */
    function getAttributeValue(suffix, element) {
        var attribute = 'data-clipboard-' + suffix;

        if (!element.hasAttribute(attribute)) {
            return;
        }

        return element.getAttribute(attribute);
    }

    module.exports = Clipboard;
});

/***/ }),
/* 4 */
/***/ (function(module, exports) {

var DOCUMENT_NODE_TYPE = 9;

/**
 * A polyfill for Element.matches()
 */
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
    var proto = Element.prototype;

    proto.matches = proto.matchesSelector ||
                    proto.mozMatchesSelector ||
                    proto.msMatchesSelector ||
                    proto.oMatchesSelector ||
                    proto.webkitMatchesSelector;
}

/**
 * Finds the closest parent that matches a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @return {Function}
 */
function closest (element, selector) {
    while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
        if (typeof element.matches === 'function' &&
            element.matches(selector)) {
          return element;
        }
        element = element.parentNode;
    }
}

module.exports = closest;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var closest = __webpack_require__(4);

/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function _delegate(element, selector, type, callback, useCapture) {
    var listenerFn = listener.apply(this, arguments);

    element.addEventListener(type, listenerFn, useCapture);

    return {
        destroy: function() {
            element.removeEventListener(type, listenerFn, useCapture);
        }
    }
}

/**
 * Delegates event to a selector.
 *
 * @param {Element|String|Array} [elements]
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function delegate(elements, selector, type, callback, useCapture) {
    // Handle the regular Element usage
    if (typeof elements.addEventListener === 'function') {
        return _delegate.apply(null, arguments);
    }

    // Handle Element-less usage, it defaults to global delegation
    if (typeof type === 'function') {
        // Use `document` as the first parameter, then apply arguments
        // This is a short way to .unshift `arguments` without running into deoptimizations
        return _delegate.bind(null, document).apply(null, arguments);
    }

    // Handle Selector-based usage
    if (typeof elements === 'string') {
        elements = document.querySelectorAll(elements);
    }

    // Handle Array-like based usage
    return Array.prototype.map.call(elements, function (element) {
        return _delegate(element, selector, type, callback, useCapture);
    });
}

/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, selector, type, callback) {
    return function(e) {
        e.delegateTarget = closest(e.target, selector);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
    }
}

module.exports = delegate;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/**
 * Check if argument is a HTML element.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.node = function(value) {
    return value !== undefined
        && value instanceof HTMLElement
        && value.nodeType === 1;
};

/**
 * Check if argument is a list of HTML elements.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.nodeList = function(value) {
    var type = Object.prototype.toString.call(value);

    return value !== undefined
        && (type === '[object NodeList]' || type === '[object HTMLCollection]')
        && ('length' in value)
        && (value.length === 0 || exports.node(value[0]));
};

/**
 * Check if argument is a string.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.string = function(value) {
    return typeof value === 'string'
        || value instanceof String;
};

/**
 * Check if argument is a function.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.fn = function(value) {
    var type = Object.prototype.toString.call(value);

    return type === '[object Function]';
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

function select(element) {
    var selectedText;

    if (element.nodeName === 'SELECT') {
        element.focus();

        selectedText = element.value;
    }
    else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
        var isReadOnly = element.hasAttribute('readonly');

        if (!isReadOnly) {
            element.setAttribute('readonly', '');
        }

        element.select();
        element.setSelectionRange(0, element.value.length);

        if (!isReadOnly) {
            element.removeAttribute('readonly');
        }

        selectedText = element.value;
    }
    else {
        if (element.hasAttribute('contenteditable')) {
            element.focus();
        }

        var selection = window.getSelection();
        var range = document.createRange();

        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);

        selectedText = selection.toString();
    }

    return selectedText;
}

module.exports = select;


/***/ })
/******/ ]);
});
/*!
 * jQuery Easter Egg
 * http://unindented.github.com/jquery-easteregg/
 *
 * Copyright 2012, Daniel Perez Alvarez
 * Licensed under the Apache License, Version 2.0
 */

(function ($, undefined) {

  'use strict';

  // # jQuery Easter Egg

  // Allows you to trigger a callback when the user presses a certain sequence
  // of keys.

  var plugin = {

    // ## Default options

    options : {
      sequence : [38, 38, 40, 40, 37, 39, 37, 39, 66, 65] // Konami Code
    }

    // ## Setup

  , setup : function (elem, options) {
      $.extend(this.options, options);

      this.index = 0;
      this.elem  = elem;

      $(this.elem).on('keydown.easteregg', $.proxy(this.onKeyDown, this));

      return this;
    }

    // ## Teardown

  , teardown : function () {
      $(this.elem).off('.easteregg');

      return this;
    }

    // ## Key listener

  , onKeyDown : function (evt) {
      var options  = this.options;
      var sequence = options.sequence;
      var callback = options.callback;

      if (evt.which === sequence[this.index]) {
        // If the user presses the right key, advance the index...
        this.index += 1;
        if (this.index === sequence.length) {
          // ... until we reach the end of the sequence.
          this.index = 0;
          if (callback != null) {
            callback.call(this.elem);
          }
        }
      } else {
        // If the user presses the wrong key, reset the index.
        this.index = 0;
      }
    }

  };

  // ## Object.create polyfill

  // Covers the main use case, which is creating a new object for which the
  // prototype has been chosen, but doesn't take the second argument into
  // account.
  if (typeof Object.create !== 'function') {
    Object.create = function (object) {
      var F = function () {};
      F.prototype = object;
      return new F();
    };
  }

  // ## Pluginize

  // Creates a jQuery plugin based on a defined object.
  $.pluginize = function (name, object) {
    $.fn[name] = function (options) {
      return this.each(function () {
        var plugin;
        if (!$(this).data(name)) {
          plugin = Object.create(object).setup(this, options);
          $(this).data(name, plugin);
        }
      });
    };
    return object;
  };

  $.pluginize('easteregg', plugin);

}(jQuery));

!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.feather=n():e.feather=n()}("undefined"!=typeof self?self:this,function(){return function(e){function n(t){if(i[t])return i[t].exports;var l=i[t]={i:t,l:!1,exports:{}};return e[t].call(l.exports,l,l.exports,n),l.l=!0,l.exports}var i={};return n.m=e,n.c=i,n.d=function(e,i,t){n.o(e,i)||Object.defineProperty(e,i,{configurable:!1,enumerable:!0,get:t})},n.n=function(e){var i=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(i,"a",i),i},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=49)}([function(e,n,i){var t=i(36)("wks"),l=i(15),r=i(1).Symbol,o="function"==typeof r;(e.exports=function(e){return t[e]||(t[e]=o&&r[e]||(o?r:l)("Symbol."+e))}).store=t},function(e,n){var i=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=i)},function(e,n){e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},function(e,n,i){var t=i(1),l=i(7),r=i(8),o=i(10),a=i(11),c=function(e,n,i){var y,p,h,x,s=e&c.F,u=e&c.G,f=e&c.S,d=e&c.P,v=e&c.B,g=u?t:f?t[n]||(t[n]={}):(t[n]||{}).prototype,m=u?l:l[n]||(l[n]={}),M=m.prototype||(m.prototype={});u&&(i=n);for(y in i)p=!s&&g&&void 0!==g[y],h=(p?g:i)[y],x=v&&p?a(h,t):d&&"function"==typeof h?a(Function.call,h):h,g&&o(g,y,h,e&c.U),m[y]!=h&&r(m,y,x),d&&M[y]!=h&&(M[y]=h)};t.core=l,c.F=1,c.G=2,c.S=4,c.P=8,c.B=16,c.W=32,c.U=64,c.R=128,e.exports=c},function(e,n,i){var t=i(9),l=i(29),r=i(31),o=Object.defineProperty;n.f=i(5)?Object.defineProperty:function(e,n,i){if(t(e),n=r(n,!0),t(i),l)try{return o(e,n,i)}catch(e){}if("get"in i||"set"in i)throw TypeError("Accessors not supported!");return"value"in i&&(e[n]=i.value),e}},function(e,n,i){e.exports=!i(12)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(e,n){var i={}.hasOwnProperty;e.exports=function(e,n){return i.call(e,n)}},function(e,n){var i=e.exports={version:"2.5.3"};"number"==typeof __e&&(__e=i)},function(e,n,i){var t=i(4),l=i(14);e.exports=i(5)?function(e,n,i){return t.f(e,n,l(1,i))}:function(e,n,i){return e[n]=i,e}},function(e,n,i){var t=i(2);e.exports=function(e){if(!t(e))throw TypeError(e+" is not an object!");return e}},function(e,n,i){var t=i(1),l=i(8),r=i(6),o=i(15)("src"),a=Function.toString,c=(""+a).split("toString");i(7).inspectSource=function(e){return a.call(e)},(e.exports=function(e,n,i,a){var y="function"==typeof i;y&&(r(i,"name")||l(i,"name",n)),e[n]!==i&&(y&&(r(i,o)||l(i,o,e[n]?""+e[n]:c.join(String(n)))),e===t?e[n]=i:a?e[n]?e[n]=i:l(e,n,i):(delete e[n],l(e,n,i)))})(Function.prototype,"toString",function(){return"function"==typeof this&&this[o]||a.call(this)})},function(e,n,i){var t=i(32);e.exports=function(e,n,i){if(t(e),void 0===n)return e;switch(i){case 1:return function(i){return e.call(n,i)};case 2:return function(i,t){return e.call(n,i,t)};case 3:return function(i,t,l){return e.call(n,i,t,l)}}return function(){return e.apply(n,arguments)}}},function(e,n){e.exports=function(e){try{return!!e()}catch(e){return!0}}},function(e,n){e.exports={}},function(e,n){e.exports=function(e,n){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:n}}},function(e,n){var i=0,t=Math.random();e.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++i+t).toString(36))}},function(e,n,i){var t=i(34),l=i(19);e.exports=function(e){return t(l(e))}},function(e,n,i){var t=i(11),l=i(38),r=i(39),o=i(9),a=i(22),c=i(40),y={},p={},n=e.exports=function(e,n,i,h,x){var s,u,f,d,v=x?function(){return e}:c(e),g=t(i,h,n?2:1),m=0;if("function"!=typeof v)throw TypeError(e+" is not iterable!");if(r(v)){for(s=a(e.length);s>m;m++)if((d=n?g(o(u=e[m])[0],u[1]):g(e[m]))===y||d===p)return d}else for(f=v.call(e);!(u=f.next()).done;)if((d=l(f,g,u.value,n))===y||d===p)return d};n.BREAK=y,n.RETURN=p},function(e,n){var i=Math.ceil,t=Math.floor;e.exports=function(e){return isNaN(e=+e)?0:(e>0?t:i)(e)}},function(e,n){e.exports=function(e){if(void 0==e)throw TypeError("Can't call method on  "+e);return e}},function(e,n,i){"use strict";var t=i(52),l=i(3),r=i(10),o=i(8),a=i(6),c=i(13),y=i(53),p=i(24),h=i(59),x=i(0)("iterator"),s=!([].keys&&"next"in[].keys()),u=function(){return this};e.exports=function(e,n,i,f,d,v,g){y(i,n,f);var m,M,w,b=function(e){if(!s&&e in k)return k[e];switch(e){case"keys":case"values":return function(){return new i(this,e)}}return function(){return new i(this,e)}},A=n+" Iterator",_="values"==d,z=!1,k=e.prototype,S=k[x]||k["@@iterator"]||d&&k[d],H=!s&&S||b(d),V=d?_?b("entries"):H:void 0,O="Array"==n?k.entries||S:S;if(O&&(w=h(O.call(new e)))!==Object.prototype&&w.next&&(p(w,A,!0),t||a(w,x)||o(w,x,u)),_&&S&&"values"!==S.name&&(z=!0,H=function(){return S.call(this)}),t&&!g||!s&&!z&&k[x]||o(k,x,H),c[n]=H,c[A]=u,d)if(m={values:_?H:b("values"),keys:v?H:b("keys"),entries:V},g)for(M in m)M in k||r(k,M,m[M]);else l(l.P+l.F*(s||z),n,m);return m}},function(e,n,i){var t=i(55),l=i(37);e.exports=Object.keys||function(e){return t(e,l)}},function(e,n,i){var t=i(18),l=Math.min;e.exports=function(e){return e>0?l(t(e),9007199254740991):0}},function(e,n,i){var t=i(36)("keys"),l=i(15);e.exports=function(e){return t[e]||(t[e]=l(e))}},function(e,n,i){var t=i(4).f,l=i(6),r=i(0)("toStringTag");e.exports=function(e,n,i){e&&!l(e=i?e:e.prototype,r)&&t(e,r,{configurable:!0,value:n})}},function(e,n,i){var t=i(19);e.exports=function(e){return Object(t(e))}},function(e,n,i){var t=i(35),l=i(0)("toStringTag"),r="Arguments"==t(function(){return arguments}()),o=function(e,n){try{return e[n]}catch(e){}};e.exports=function(e){var n,i,a;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(i=o(n=Object(e),l))?i:r?t(n):"Object"==(a=t(n))&&"function"==typeof n.callee?"Arguments":a}},function(e,n,i){"use strict";function t(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var l=i(86),r=t(l),o=i(88),a=t(o),c=i(89),y=t(c);n.default=Object.keys(a.default).map(function(e){return new r.default(e,a.default[e],y.default[e])}).reduce(function(e,n){return e[n.name]=n,e},{})},function(e,n,i){"use strict";var t=i(51)(!0);i(20)(String,"String",function(e){this._t=String(e),this._i=0},function(){var e,n=this._t,i=this._i;return i>=n.length?{value:void 0,done:!0}:(e=t(n,i),this._i+=e.length,{value:e,done:!1})})},function(e,n,i){e.exports=!i(5)&&!i(12)(function(){return 7!=Object.defineProperty(i(30)("div"),"a",{get:function(){return 7}}).a})},function(e,n,i){var t=i(2),l=i(1).document,r=t(l)&&t(l.createElement);e.exports=function(e){return r?l.createElement(e):{}}},function(e,n,i){var t=i(2);e.exports=function(e,n){if(!t(e))return e;var i,l;if(n&&"function"==typeof(i=e.toString)&&!t(l=i.call(e)))return l;if("function"==typeof(i=e.valueOf)&&!t(l=i.call(e)))return l;if(!n&&"function"==typeof(i=e.toString)&&!t(l=i.call(e)))return l;throw TypeError("Can't convert object to primitive value")}},function(e,n){e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},function(e,n,i){var t=i(9),l=i(54),r=i(37),o=i(23)("IE_PROTO"),a=function(){},c=function(){var e,n=i(30)("iframe"),t=r.length;for(n.style.display="none",i(58).appendChild(n),n.src="javascript:",e=n.contentWindow.document,e.open(),e.write("<script>document.F=Object<\/script>"),e.close(),c=e.F;t--;)delete c.prototype[r[t]];return c()};e.exports=Object.create||function(e,n){var i;return null!==e?(a.prototype=t(e),i=new a,a.prototype=null,i[o]=e):i=c(),void 0===n?i:l(i,n)}},function(e,n,i){var t=i(35);e.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==t(e)?e.split(""):Object(e)}},function(e,n){var i={}.toString;e.exports=function(e){return i.call(e).slice(8,-1)}},function(e,n,i){var t=i(1),l=t["__core-js_shared__"]||(t["__core-js_shared__"]={});e.exports=function(e){return l[e]||(l[e]={})}},function(e,n){e.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(e,n,i){var t=i(9);e.exports=function(e,n,i,l){try{return l?n(t(i)[0],i[1]):n(i)}catch(n){var r=e.return;throw void 0!==r&&t(r.call(e)),n}}},function(e,n,i){var t=i(13),l=i(0)("iterator"),r=Array.prototype;e.exports=function(e){return void 0!==e&&(t.Array===e||r[l]===e)}},function(e,n,i){var t=i(26),l=i(0)("iterator"),r=i(13);e.exports=i(7).getIteratorMethod=function(e){if(void 0!=e)return e[l]||e["@@iterator"]||r[t(e)]}},function(e,n,i){var t=i(0)("iterator"),l=!1;try{var r=[7][t]();r.return=function(){l=!0},Array.from(r,function(){throw 2})}catch(e){}e.exports=function(e,n){if(!n&&!l)return!1;var i=!1;try{var r=[7],o=r[t]();o.next=function(){return{done:i=!0}},r[t]=function(){return o},e(r)}catch(e){}return i}},function(e,n){n.f={}.propertyIsEnumerable},function(e,n){e.exports=function(e,n){return{value:n,done:!!e}}},function(e,n,i){var t=i(10);e.exports=function(e,n,i){for(var l in n)t(e,l,n[l],i);return e}},function(e,n){e.exports=function(e,n,i,t){if(!(e instanceof n)||void 0!==t&&t in e)throw TypeError(i+": incorrect invocation!");return e}},function(e,n,i){var t=i(15)("meta"),l=i(2),r=i(6),o=i(4).f,a=0,c=Object.isExtensible||function(){return!0},y=!i(12)(function(){return c(Object.preventExtensions({}))}),p=function(e){o(e,t,{value:{i:"O"+ ++a,w:{}}})},h=function(e,n){if(!l(e))return"symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!r(e,t)){if(!c(e))return"F";if(!n)return"E";p(e)}return e[t].i},x=function(e,n){if(!r(e,t)){if(!c(e))return!0;if(!n)return!1;p(e)}return e[t].w},s=function(e){return y&&u.NEED&&c(e)&&!r(e,t)&&p(e),e},u=e.exports={KEY:t,NEED:!1,fastKey:h,getWeak:x,onFreeze:s}},function(e,n,i){var t=i(2);e.exports=function(e,n){if(!t(e)||e._t!==n)throw TypeError("Incompatible receiver, "+n+" required!");return e}},function(e,n,i){var t,l;/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
!function(){"use strict";var i=function(){function e(){}function n(e,n){for(var i=n.length,t=0;t<i;++t)r(e,n[t])}function i(e,n){e[n]=!0}function t(e,n){for(var i in n)a.call(n,i)&&(e[i]=!!n[i])}function l(e,n){for(var i=n.split(c),t=i.length,l=0;l<t;++l)e[i[l]]=!0}function r(e,r){if(r){var o=typeof r;"string"===o?l(e,r):Array.isArray(r)?n(e,r):"object"===o?t(e,r):"number"===o&&i(e,r)}}function o(){for(var i=arguments.length,t=Array(i),l=0;l<i;l++)t[l]=arguments[l];var r=new e;n(r,t);var o=[];for(var a in r)r[a]&&o.push(a);return o.join(" ")}e.prototype=Object.create(null);var a={}.hasOwnProperty,c=/\s+/;return o}();void 0!==e&&e.exports?e.exports=i:(t=[],void 0!==(l=function(){return i}.apply(n,t))&&(e.exports=l))}()},function(e,n,i){i(50),i(62),i(66),e.exports=i(85)},function(e,n,i){i(28),i(60),e.exports=i(7).Array.from},function(e,n,i){var t=i(18),l=i(19);e.exports=function(e){return function(n,i){var r,o,a=String(l(n)),c=t(i),y=a.length;return c<0||c>=y?e?"":void 0:(r=a.charCodeAt(c),r<55296||r>56319||c+1===y||(o=a.charCodeAt(c+1))<56320||o>57343?e?a.charAt(c):r:e?a.slice(c,c+2):o-56320+(r-55296<<10)+65536)}}},function(e,n){e.exports=!1},function(e,n,i){"use strict";var t=i(33),l=i(14),r=i(24),o={};i(8)(o,i(0)("iterator"),function(){return this}),e.exports=function(e,n,i){e.prototype=t(o,{next:l(1,i)}),r(e,n+" Iterator")}},function(e,n,i){var t=i(4),l=i(9),r=i(21);e.exports=i(5)?Object.defineProperties:function(e,n){l(e);for(var i,o=r(n),a=o.length,c=0;a>c;)t.f(e,i=o[c++],n[i]);return e}},function(e,n,i){var t=i(6),l=i(16),r=i(56)(!1),o=i(23)("IE_PROTO");e.exports=function(e,n){var i,a=l(e),c=0,y=[];for(i in a)i!=o&&t(a,i)&&y.push(i);for(;n.length>c;)t(a,i=n[c++])&&(~r(y,i)||y.push(i));return y}},function(e,n,i){var t=i(16),l=i(22),r=i(57);e.exports=function(e){return function(n,i,o){var a,c=t(n),y=l(c.length),p=r(o,y);if(e&&i!=i){for(;y>p;)if((a=c[p++])!=a)return!0}else for(;y>p;p++)if((e||p in c)&&c[p]===i)return e||p||0;return!e&&-1}}},function(e,n,i){var t=i(18),l=Math.max,r=Math.min;e.exports=function(e,n){return e=t(e),e<0?l(e+n,0):r(e,n)}},function(e,n,i){var t=i(1).document;e.exports=t&&t.documentElement},function(e,n,i){var t=i(6),l=i(25),r=i(23)("IE_PROTO"),o=Object.prototype;e.exports=Object.getPrototypeOf||function(e){return e=l(e),t(e,r)?e[r]:"function"==typeof e.constructor&&e instanceof e.constructor?e.constructor.prototype:e instanceof Object?o:null}},function(e,n,i){"use strict";var t=i(11),l=i(3),r=i(25),o=i(38),a=i(39),c=i(22),y=i(61),p=i(40);l(l.S+l.F*!i(41)(function(e){Array.from(e)}),"Array",{from:function(e){var n,i,l,h,x=r(e),s="function"==typeof this?this:Array,u=arguments.length,f=u>1?arguments[1]:void 0,d=void 0!==f,v=0,g=p(x);if(d&&(f=t(f,u>2?arguments[2]:void 0,2)),void 0==g||s==Array&&a(g))for(n=c(x.length),i=new s(n);n>v;v++)y(i,v,d?f(x[v],v):x[v]);else for(h=g.call(x),i=new s;!(l=h.next()).done;v++)y(i,v,d?o(h,f,[l.value,v],!0):l.value);return i.length=v,i}})},function(e,n,i){"use strict";var t=i(4),l=i(14);e.exports=function(e,n,i){n in e?t.f(e,n,l(0,i)):e[n]=i}},function(e,n,i){i(63),e.exports=i(7).Object.assign},function(e,n,i){var t=i(3);t(t.S+t.F,"Object",{assign:i(64)})},function(e,n,i){"use strict";var t=i(21),l=i(65),r=i(42),o=i(25),a=i(34),c=Object.assign;e.exports=!c||i(12)(function(){var e={},n={},i=Symbol(),t="abcdefghijklmnopqrst";return e[i]=7,t.split("").forEach(function(e){n[e]=e}),7!=c({},e)[i]||Object.keys(c({},n)).join("")!=t})?function(e,n){for(var i=o(e),c=arguments.length,y=1,p=l.f,h=r.f;c>y;)for(var x,s=a(arguments[y++]),u=p?t(s).concat(p(s)):t(s),f=u.length,d=0;f>d;)h.call(s,x=u[d++])&&(i[x]=s[x]);return i}:c},function(e,n){n.f=Object.getOwnPropertySymbols},function(e,n,i){i(67),i(28),i(68),i(71),i(78),i(81),i(83),e.exports=i(7).Set},function(e,n,i){"use strict";var t=i(26),l={};l[i(0)("toStringTag")]="z",l+""!="[object z]"&&i(10)(Object.prototype,"toString",function(){return"[object "+t(this)+"]"},!0)},function(e,n,i){for(var t=i(69),l=i(21),r=i(10),o=i(1),a=i(8),c=i(13),y=i(0),p=y("iterator"),h=y("toStringTag"),x=c.Array,s={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},u=l(s),f=0;f<u.length;f++){var d,v=u[f],g=s[v],m=o[v],M=m&&m.prototype;if(M&&(M[p]||a(M,p,x),M[h]||a(M,h,v),c[v]=x,g))for(d in t)M[d]||r(M,d,t[d],!0)}},function(e,n,i){"use strict";var t=i(70),l=i(43),r=i(13),o=i(16);e.exports=i(20)(Array,"Array",function(e,n){this._t=o(e),this._i=0,this._k=n},function(){var e=this._t,n=this._k,i=this._i++;return!e||i>=e.length?(this._t=void 0,l(1)):"keys"==n?l(0,i):"values"==n?l(0,e[i]):l(0,[i,e[i]])},"values"),r.Arguments=r.Array,t("keys"),t("values"),t("entries")},function(e,n,i){var t=i(0)("unscopables"),l=Array.prototype;void 0==l[t]&&i(8)(l,t,{}),e.exports=function(e){l[t][e]=!0}},function(e,n,i){"use strict";var t=i(72),l=i(47);e.exports=i(74)("Set",function(e){return function(){return e(this,arguments.length>0?arguments[0]:void 0)}},{add:function(e){return t.def(l(this,"Set"),e=0===e?0:e,e)}},t)},function(e,n,i){"use strict";var t=i(4).f,l=i(33),r=i(44),o=i(11),a=i(45),c=i(17),y=i(20),p=i(43),h=i(73),x=i(5),s=i(46).fastKey,u=i(47),f=x?"_s":"size",d=function(e,n){var i,t=s(n);if("F"!==t)return e._i[t];for(i=e._f;i;i=i.n)if(i.k==n)return i};e.exports={getConstructor:function(e,n,i,y){var p=e(function(e,t){a(e,p,n,"_i"),e._t=n,e._i=l(null),e._f=void 0,e._l=void 0,e[f]=0,void 0!=t&&c(t,i,e[y],e)});return r(p.prototype,{clear:function(){for(var e=u(this,n),i=e._i,t=e._f;t;t=t.n)t.r=!0,t.p&&(t.p=t.p.n=void 0),delete i[t.i];e._f=e._l=void 0,e[f]=0},delete:function(e){var i=u(this,n),t=d(i,e);if(t){var l=t.n,r=t.p;delete i._i[t.i],t.r=!0,r&&(r.n=l),l&&(l.p=r),i._f==t&&(i._f=l),i._l==t&&(i._l=r),i[f]--}return!!t},forEach:function(e){u(this,n);for(var i,t=o(e,arguments.length>1?arguments[1]:void 0,3);i=i?i.n:this._f;)for(t(i.v,i.k,this);i&&i.r;)i=i.p},has:function(e){return!!d(u(this,n),e)}}),x&&t(p.prototype,"size",{get:function(){return u(this,n)[f]}}),p},def:function(e,n,i){var t,l,r=d(e,n);return r?r.v=i:(e._l=r={i:l=s(n,!0),k:n,v:i,p:t=e._l,n:void 0,r:!1},e._f||(e._f=r),t&&(t.n=r),e[f]++,"F"!==l&&(e._i[l]=r)),e},getEntry:d,setStrong:function(e,n,i){y(e,n,function(e,i){this._t=u(e,n),this._k=i,this._l=void 0},function(){for(var e=this,n=e._k,i=e._l;i&&i.r;)i=i.p;return e._t&&(e._l=i=i?i.n:e._t._f)?"keys"==n?p(0,i.k):"values"==n?p(0,i.v):p(0,[i.k,i.v]):(e._t=void 0,p(1))},i?"entries":"values",!i,!0),h(n)}}},function(e,n,i){"use strict";var t=i(1),l=i(4),r=i(5),o=i(0)("species");e.exports=function(e){var n=t[e];r&&n&&!n[o]&&l.f(n,o,{configurable:!0,get:function(){return this}})}},function(e,n,i){"use strict";var t=i(1),l=i(3),r=i(10),o=i(44),a=i(46),c=i(17),y=i(45),p=i(2),h=i(12),x=i(41),s=i(24),u=i(75);e.exports=function(e,n,i,f,d,v){var g=t[e],m=g,M=d?"set":"add",w=m&&m.prototype,b={},A=function(e){var n=w[e];r(w,e,"delete"==e?function(e){return!(v&&!p(e))&&n.call(this,0===e?0:e)}:"has"==e?function(e){return!(v&&!p(e))&&n.call(this,0===e?0:e)}:"get"==e?function(e){return v&&!p(e)?void 0:n.call(this,0===e?0:e)}:"add"==e?function(e){return n.call(this,0===e?0:e),this}:function(e,i){return n.call(this,0===e?0:e,i),this})};if("function"==typeof m&&(v||w.forEach&&!h(function(){(new m).entries().next()}))){var _=new m,z=_[M](v?{}:-0,1)!=_,k=h(function(){_.has(1)}),S=x(function(e){new m(e)}),H=!v&&h(function(){for(var e=new m,n=5;n--;)e[M](n,n);return!e.has(-0)});S||(m=n(function(n,i){y(n,m,e);var t=u(new g,n,m);return void 0!=i&&c(i,d,t[M],t),t}),m.prototype=w,w.constructor=m),(k||H)&&(A("delete"),A("has"),d&&A("get")),(H||z)&&A(M),v&&w.clear&&delete w.clear}else m=f.getConstructor(n,e,d,M),o(m.prototype,i),a.NEED=!0;return s(m,e),b[e]=m,l(l.G+l.W+l.F*(m!=g),b),v||f.setStrong(m,e,d),m}},function(e,n,i){var t=i(2),l=i(76).set;e.exports=function(e,n,i){var r,o=n.constructor;return o!==i&&"function"==typeof o&&(r=o.prototype)!==i.prototype&&t(r)&&l&&l(e,r),e}},function(e,n,i){var t=i(2),l=i(9),r=function(e,n){if(l(e),!t(n)&&null!==n)throw TypeError(n+": can't set as prototype!")};e.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(e,n,t){try{t=i(11)(Function.call,i(77).f(Object.prototype,"__proto__").set,2),t(e,[]),n=!(e instanceof Array)}catch(e){n=!0}return function(e,i){return r(e,i),n?e.__proto__=i:t(e,i),e}}({},!1):void 0),check:r}},function(e,n,i){var t=i(42),l=i(14),r=i(16),o=i(31),a=i(6),c=i(29),y=Object.getOwnPropertyDescriptor;n.f=i(5)?y:function(e,n){if(e=r(e),n=o(n,!0),c)try{return y(e,n)}catch(e){}if(a(e,n))return l(!t.f.call(e,n),e[n])}},function(e,n,i){var t=i(3);t(t.P+t.R,"Set",{toJSON:i(79)("Set")})},function(e,n,i){var t=i(26),l=i(80);e.exports=function(e){return function(){if(t(this)!=e)throw TypeError(e+"#toJSON isn't generic");return l(this)}}},function(e,n,i){var t=i(17);e.exports=function(e,n){var i=[];return t(e,!1,i.push,i,n),i}},function(e,n,i){i(82)("Set")},function(e,n,i){"use strict";var t=i(3);e.exports=function(e){t(t.S,e,{of:function(){for(var e=arguments.length,n=new Array(e);e--;)n[e]=arguments[e];return new this(n)}})}},function(e,n,i){i(84)("Set")},function(e,n,i){"use strict";var t=i(3),l=i(32),r=i(11),o=i(17);e.exports=function(e){t(t.S,e,{from:function(e){var n,i,t,a,c=arguments[1];return l(this),n=void 0!==c,n&&l(c),void 0==e?new this:(i=[],n?(t=0,a=r(c,arguments[2],2),o(e,!1,function(e){i.push(a(e,t++))})):o(e,!1,i.push,i),new this(i))}})}},function(e,n,i){"use strict";function t(e){return e&&e.__esModule?e:{default:e}}var l=i(27),r=t(l),o=i(90),a=t(o),c=i(91),y=t(c);e.exports={icons:r.default,toSvg:a.default,replace:y.default}},function(e,n,i){"use strict";function t(e){return e&&e.__esModule?e:{default:e}}function l(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e){return Object.keys(e).map(function(n){return n+'="'+e[n]+'"'}).join(" ")}Object.defineProperty(n,"__esModule",{value:!0});var o=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var i=arguments[n];for(var t in i)Object.prototype.hasOwnProperty.call(i,t)&&(e[t]=i[t])}return e},a=function(){function e(e,n){for(var i=0;i<n.length;i++){var t=n[i];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}return function(n,i,t){return i&&e(n.prototype,i),t&&e(n,t),n}}(),c=i(48),y=t(c),p=i(87),h=t(p),x=function(){function e(n,i){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];l(this,e),this.name=n,this.contents=i,this.tags=t,this.attrs=o({},h.default,{class:"feather feather-"+n})}return a(e,[{key:"toSvg",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return"<svg "+r(o({},this.attrs,e,{class:(0,y.default)(this.attrs.class,e.class)}))+">"+this.contents+"</svg>"}},{key:"toString",value:function(){return this.contents}}]),e}();n.default=x},function(e,n){e.exports={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"}},function(e,n){e.exports={activity:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>',airplay:'<path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path><polygon points="12 15 17 21 7 21 12 15"></polygon>',"alert-circle":'<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line>',"alert-octagon":'<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line>',"alert-triangle":'<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12" y2="17"></line>',"align-center":'<line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line>',"align-justify":'<line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line>',"align-left":'<line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line>',"align-right":'<line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line>',anchor:'<circle cx="12" cy="5" r="3"></circle><line x1="12" y1="22" x2="12" y2="8"></line><path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>',aperture:'<circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>',archive:'<polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line>',"arrow-down-circle":'<circle cx="12" cy="12" r="10"></circle><polyline points="8 12 12 16 16 12"></polyline><line x1="12" y1="8" x2="12" y2="16"></line>',"arrow-down-left":'<line x1="17" y1="7" x2="7" y2="17"></line><polyline points="17 17 7 17 7 7"></polyline>',"arrow-down-right":'<line x1="7" y1="7" x2="17" y2="17"></line><polyline points="17 7 17 17 7 17"></polyline>',"arrow-down":'<line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline>',"arrow-left-circle":'<circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line>',"arrow-left":'<line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>',"arrow-right-circle":'<circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line>',"arrow-right":'<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>',"arrow-up-circle":'<circle cx="12" cy="12" r="10"></circle><polyline points="16 12 12 8 8 12"></polyline><line x1="12" y1="16" x2="12" y2="8"></line>',"arrow-up-left":'<line x1="17" y1="17" x2="7" y2="7"></line><polyline points="7 17 7 7 17 7"></polyline>',"arrow-up-right":'<line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline>',"arrow-up":'<line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline>',"at-sign":'<circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>',award:'<circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>',"bar-chart-2":'<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>',"bar-chart":'<line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line>',"battery-charging":'<path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"></path><line x1="23" y1="13" x2="23" y2="11"></line><polyline points="11 6 7 12 13 12 9 18"></polyline>',battery:'<rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect><line x1="23" y1="13" x2="23" y2="11"></line>',"bell-off":'<path d="M8.56 2.9A7 7 0 0 1 19 9v4m-2 4H2a3 3 0 0 0 3-3V9a7 7 0 0 1 .78-3.22M13.73 21a2 2 0 0 1-3.46 0"></path><line x1="1" y1="1" x2="23" y2="23"></line>',bell:'<path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>',bluetooth:'<polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"></polyline>',bold:'<path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>',"book-open":'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>',book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>',bookmark:'<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>',box:'<path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"></path><polyline points="2.32 6.16 12 11 21.68 6.16"></polyline><line x1="12" y1="22.76" x2="12" y2="11"></line>',briefcase:'<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>',calendar:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',"camera-off":'<line x1="1" y1="1" x2="23" y2="23"></line><path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56"></path>',camera:'<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle>',cast:'<path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path><line x1="2" y1="20" x2="2" y2="20"></line>',"check-circle":'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',"check-square":'<polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>',check:'<polyline points="20 6 9 17 4 12"></polyline>',"chevron-down":'<polyline points="6 9 12 15 18 9"></polyline>',"chevron-left":'<polyline points="15 18 9 12 15 6"></polyline>',"chevron-right":'<polyline points="9 18 15 12 9 6"></polyline>',"chevron-up":'<polyline points="18 15 12 9 6 15"></polyline>',"chevrons-down":'<polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline>',"chevrons-left":'<polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline>',"chevrons-right":'<polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline>',"chevrons-up":'<polyline points="17 11 12 6 7 11"></polyline><polyline points="17 18 12 13 7 18"></polyline>',chrome:'<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>',circle:'<circle cx="12" cy="12" r="10"></circle>',clipboard:'<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>',clock:'<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',"cloud-drizzle":'<line x1="8" y1="19" x2="8" y2="21"></line><line x1="8" y1="13" x2="8" y2="15"></line><line x1="16" y1="19" x2="16" y2="21"></line><line x1="16" y1="13" x2="16" y2="15"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="12" y1="15" x2="12" y2="17"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>',"cloud-lightning":'<path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path><polyline points="13 11 9 17 15 17 11 23"></polyline>',"cloud-off":'<path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>',"cloud-rain":'<line x1="16" y1="13" x2="16" y2="21"></line><line x1="8" y1="13" x2="8" y2="21"></line><line x1="12" y1="15" x2="12" y2="23"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>',"cloud-snow":'<path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="8" y1="20" x2="8" y2="20"></line><line x1="12" y1="18" x2="12" y2="18"></line><line x1="12" y1="22" x2="12" y2="22"></line><line x1="16" y1="16" x2="16" y2="16"></line><line x1="16" y1="20" x2="16" y2="20"></line>',cloud:'<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>',code:'<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>',codepen:'<polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon><line x1="12" y1="22" x2="12" y2="15.5"></line><polyline points="22 8.5 12 15.5 2 8.5"></polyline><polyline points="2 15.5 12 8.5 22 15.5"></polyline><line x1="12" y1="2" x2="12" y2="8.5"></line>',command:'<path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>',compass:'<circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>',copy:'<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>',"corner-down-left":'<polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path>',"corner-down-right":'<polyline points="15 10 20 15 15 20"></polyline><path d="M4 4v7a4 4 0 0 0 4 4h12"></path>',"corner-left-down":'<polyline points="14 15 9 20 4 15"></polyline><path d="M20 4h-7a4 4 0 0 0-4 4v12"></path>',"corner-left-up":'<polyline points="14 9 9 4 4 9"></polyline><path d="M20 20h-7a4 4 0 0 1-4-4V4"></path>',"corner-right-down":'<polyline points="10 15 15 20 20 15"></polyline><path d="M4 4h7a4 4 0 0 1 4 4v12"></path>',"corner-right-up":'<polyline points="10 9 15 4 20 9"></polyline><path d="M4 20h7a4 4 0 0 0 4-4V4"></path>',"corner-up-left":'<polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>',"corner-up-right":'<polyline points="15 14 20 9 15 4"></polyline><path d="M4 20v-7a4 4 0 0 1 4-4h12"></path>',cpu:'<rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>',"credit-card":'<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>',crop:'<path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"></path><path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"></path>',crosshair:'<circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line>',database:'<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>',delete:'<path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line>',disc:'<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle>',"dollar-sign":'<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>',"download-cloud":'<polyline points="8 17 12 21 16 17"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path>',download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>',droplet:'<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>',"edit-2":'<polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon>',"edit-3":'<polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line>',edit:'<path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>',"external-link":'<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>',"eye-off":'<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>',eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>',facebook:'<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>',"fast-forward":'<polygon points="13 19 22 12 13 5 13 19"></polygon><polygon points="2 19 11 12 2 5 2 19"></polygon>',feather:'<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17" y1="15" x2="9" y2="15"></line>',"file-minus":'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line>',"file-plus":'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line>',"file-text":'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>',file:'<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline>',film:'<rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line>',filter:'<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>',flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line>',"folder-minus":'<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="9" y1="14" x2="15" y2="14"></line>',"folder-plus":'<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line>',folder:'<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>',gift:'<polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>',"git-branch":'<line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path>',"git-commit":'<circle cx="12" cy="12" r="4"></circle><line x1="1.05" y1="12" x2="7" y2="12"></line><line x1="17.01" y1="12" x2="22.96" y2="12"></line>',"git-merge":'<circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M6 21V9a9 9 0 0 0 9 9"></path>',"git-pull-request":'<circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line>',github:'<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>',gitlab:'<path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"></path>',globe:'<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>',grid:'<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>',"hard-drive":'<line x1="22" y1="12" x2="2" y2="12"></line><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" y1="16" x2="6" y2="16"></line><line x1="10" y1="16" x2="10" y2="16"></line>',hash:'<line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line>',headphones:'<path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>',heart:'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>',"help-circle":'<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12" y2="17"></line>',home:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',image:'<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>',inbox:'<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>',info:'<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line>',instagram:'<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line>',italic:'<line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line>',layers:'<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>',layout:'<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>',"life-buoy":'<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>',"link-2":'<path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path><line x1="8" y1="12" x2="16" y2="12"></line>',link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>',linkedin:'<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>',list:'<line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3" y2="6"></line><line x1="3" y1="12" x2="3" y2="12"></line><line x1="3" y1="18" x2="3" y2="18"></line>',loader:'<line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>',lock:'<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>',"log-in":'<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line>',"log-out":'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>',mail:'<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>',"map-pin":'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>',map:'<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line>',"maximize-2":'<polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line>',maximize:'<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>',menu:'<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>',"message-circle":'<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>',"message-square":'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>',"mic-off":'<line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>',mic:'<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>',"minimize-2":'<polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line>',minimize:'<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>',"minus-circle":'<circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line>',"minus-square":'<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line>',minus:'<line x1="5" y1="12" x2="19" y2="12"></line>',monitor:'<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>',moon:'<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>',"more-horizontal":'<circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>',"more-vertical":'<circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle>',move:'<polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line>',music:'<path d="M9 17H5a2 2 0 0 0-2 2 2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm12-2h-4a2 2 0 0 0-2 2 2 2 0 0 0 2 2h2a2 2 0 0 0 2-2z"></path><polyline points="9 17 9 5 21 3 21 15"></polyline>',"navigation-2":'<polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>',navigation:'<polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>',octagon:'<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>',package:'<path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"></path><polyline points="2.32 6.16 12 11 21.68 6.16"></polyline><line x1="12" y1="22.76" x2="12" y2="11"></line><line x1="7" y1="3.5" x2="17" y2="8.5"></line>',paperclip:'<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>',"pause-circle":'<circle cx="12" cy="12" r="10"></circle><line x1="10" y1="15" x2="10" y2="9"></line><line x1="14" y1="15" x2="14" y2="9"></line>',pause:'<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>',percent:'<line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle>',"phone-call":'<path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',"phone-forwarded":'<polyline points="19 1 23 5 19 9"></polyline><line x1="15" y1="5" x2="23" y2="5"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',"phone-incoming":'<polyline points="16 2 16 8 22 8"></polyline><line x1="23" y1="1" x2="16" y2="8"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',"phone-missed":'<line x1="23" y1="1" x2="17" y2="7"></line><line x1="17" y1="1" x2="23" y2="7"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',"phone-off":'<path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="23" y1="1" x2="1" y2="23"></line>',"phone-outgoing":'<polyline points="23 7 23 1 17 1"></polyline><line x1="16" y1="8" x2="23" y2="1"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',"pie-chart":'<path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path>',"play-circle":'<circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon>',play:'<polygon points="5 3 19 12 5 21 5 3"></polygon>',"plus-circle":'<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>',"plus-square":'<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>',plus:'<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>',pocket:'<path d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z"></path><polyline points="8 10 12 14 16 10"></polyline>',power:'<path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line>',printer:'<polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect>',radio:'<circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>',"refresh-ccw":'<polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>',"refresh-cw":'<polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>',repeat:'<polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path>',rewind:'<polygon points="11 19 2 12 11 5 11 19"></polygon><polygon points="22 19 13 12 22 5 22 19"></polygon>',"rotate-ccw":'<polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>',"rotate-cw":'<polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>',rss:'<path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle>',save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>',scissors:'<circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line>',search:'<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>',send:'<line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>',server:'<rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6" y2="6"></line><line x1="6" y1="18" x2="6" y2="18"></line>',settings:'<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',"share-2":'<circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>',share:'<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line>',"shield-off":'<path d="M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18"></path><path d="M4.73 4.73L4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38"></path><line x1="1" y1="1" x2="23" y2="23"></line>',shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>',"shopping-bag":'<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path>',"shopping-cart":'<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>',shuffle:'<polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line>',sidebar:'<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line>',"skip-back":'<polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line>',"skip-forward":'<polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line>',slack:'<path d="M22.08 9C19.81 1.41 16.54-.35 9 1.92S-.35 7.46 1.92 15 7.46 24.35 15 22.08 24.35 16.54 22.08 9z"></path><line x1="12.57" y1="5.99" x2="16.15" y2="16.39"></line><line x1="7.85" y1="7.61" x2="11.43" y2="18.01"></line><line x1="16.39" y1="7.85" x2="5.99" y2="11.43"></line><line x1="18.01" y1="12.57" x2="7.61" y2="16.15"></line>',slash:'<circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>',sliders:'<line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>',smartphone:'<rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12" y2="18"></line>',speaker:'<rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><circle cx="12" cy="14" r="4"></circle><line x1="12" y1="6" x2="12" y2="6"></line>',square:'<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>',star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>',"stop-circle":'<circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect>',sun:'<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>',sunrise:'<path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="2" x2="12" y2="9"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="8 6 12 2 16 6"></polyline>',sunset:'<path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="9" x2="12" y2="2"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="16 5 12 9 8 5"></polyline>',tablet:'<rect x="4" y="2" width="16" height="20" rx="2" ry="2" transform="rotate(180 12 12)"></rect><line x1="12" y1="18" x2="12" y2="18"></line>',tag:'<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7" y2="7"></line>',target:'<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>',terminal:'<polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line>',thermometer:'<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>',"thumbs-down":'<path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>',"thumbs-up":'<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>',"toggle-left":'<rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="8" cy="12" r="3"></circle>',"toggle-right":'<rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="16" cy="12" r="3"></circle>',"trash-2":'<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>',trash:'<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>',"trending-down":'<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline>',"trending-up":'<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>',triangle:'<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>',truck:'<rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>',tv:'<rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline>',twitter:'<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>',type:'<polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line>',umbrella:'<path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"></path>',underline:'<path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line>',unlock:'<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path>',"upload-cloud":'<polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline>',upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>',"user-check":'<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline>',"user-minus":'<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="23" y1="11" x2="17" y2="11"></line>',"user-plus":'<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line>',"user-x":'<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line>',user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',"video-off":'<path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path><line x1="1" y1="1" x2="23" y2="23"></line>',video:'<polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>',voicemail:'<circle cx="5.5" cy="11.5" r="4.5"></circle><circle cx="18.5" cy="11.5" r="4.5"></circle><line x1="5.5" y1="16" x2="18.5" y2="16"></line>',"volume-1":'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>',"volume-2":'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>',"volume-x":'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>',volume:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>',watch:'<circle cx="12" cy="12" r="7"></circle><polyline points="12 9 12 12 13.5 13.5"></polyline><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"></path>',"wifi-off":'<line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12" y2="20"></line>',wifi:'<path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12" y2="20"></line>',wind:'<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>',"x-circle":'<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',"x-square":'<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line>',x:'<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',youtube:'<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>',"zap-off":'<polyline points="12.41 6.75 13 2 10.57 4.92"></polyline><polyline points="18.57 12.91 21 10 15.66 10"></polyline><polyline points="8 8 3 14 12 14 11 22 16 16"></polyline><line x1="1" y1="1" x2="23" y2="23"></line>',zap:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>',"zoom-in":'<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line>',"zoom-out":'<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line>'}},function(e,n){e.exports={activity:["pulse","health","action","motion"],airplay:["stream","cast","mirroring"],"alert-circle":["warning"],"alert-octagon":["warning"],"alert-triangle":["warning"],"at-sign":["mention"],award:["achievement","badge"],aperture:["camera","photo"],bell:["alarm","notification"],"bell-off":["alarm","notification","silent"],bluetooth:["wireless"],"book-open":["read"],book:["read","dictionary","booklet","magazine"],bookmark:["read","clip","marker","tag"],briefcase:["work","bag","baggage","folder"],clipboard:["copy"],clock:["time","watch","alarm"],"cloud-drizzle":["weather","shower"],"cloud-lightning":["weather","bolt"],"cloud-rain":["weather"],"cloud-snow":["weather","blizzard"],cloud:["weather"],codepen:["logo"],command:["keyboard","cmd"],compass:["navigation","safari","travel"],copy:["clone","duplicate"],"corner-down-left":["arrow"],"corner-down-right":["arrow"],"corner-left-down":["arrow"],"corner-left-up":["arrow"],"corner-right-down":["arrow"],"corner-right-up":["arrow"],"corner-up-left":["arrow"],"corner-up-right":["arrow"],"credit-card":["purchase","payment","cc"],crop:["photo","image"],crosshair:["aim","target"],database:["storage"],delete:["remove"],disc:["album","cd","dvd","music"],"dollar-sign":["currency","money","payment"],droplet:["water"],edit:["pencil","change"],"edit-2":["pencil","change"],"edit-3":["pencil","change"],eye:["view","watch"],"eye-off":["view","watch"],"external-link":["outbound"],facebook:["logo"],"fast-forward":["music"],film:["movie","video"],"folder-minus":["directory"],"folder-plus":["directory"],folder:["directory"],gift:["present","box","birthday","party"],"git-branch":["code","version control"],"git-commit":["code","version control"],"git-merge":["code","version control"],"git-pull-request":["code","version control"],github:["logo","version control"],gitlab:["logo","version control"],global:["world","browser","language","translate"],"hard-drive":["computer","server"],hash:["hashtag","number","pound"],headphones:["music","audio"],heart:["like","love"],"help-circle":["question mark"],home:["house"],image:["picture"],inbox:["email"],instagram:["logo","camera"],"life-bouy":["help","life ring","support"],linkedin:["logo"],lock:["security","password"],"log-in":["sign in","arrow"],"log-out":["sign out","arrow"],mail:["email"],"map-pin":["location","navigation","travel","marker"],map:["location","navigation","travel"],maximize:["fullscreen"],"maximize-2":["fullscreen","arrows"],menu:["bars","navigation","hamburger"],"message-circle":["comment","chat"],"message-square":["comment","chat"],"mic-off":["record"],mic:["record"],minimize:["exit fullscreen"],"minimize-2":["exit fullscreen","arrows"],monitor:["tv"],moon:["dark","night"],"more-horizontal":["ellipsis"],"more-vertical":["ellipsis"],move:["arrows"],navigation:["location","travel"],"navigation-2":["location","travel"],octagon:["stop"],package:["box"],paperclip:["attachment"],pause:["music","stop"],"pause-circle":["music","stop"],play:["music","start"],"play-circle":["music","start"],plus:["add","new"],"plus-circle":["add","new"],"plus-square":["add","new"],pocket:["logo","save"],power:["on","off"],radio:["signal"],rewind:["music"],rss:["feed","subscribe"],save:["floppy disk"],send:["message","mail","paper airplane"],settings:["cog","edit","gear","preferences"],shield:["security"],"shield-off":["security"],"shopping-bag":["ecommerce","cart","purchase","store"],"shopping-cart":["ecommerce","cart","purchase","store"],shuffle:["music"],"skip-back":["music"],"skip-forward":["music"],slash:["ban","no"],sliders:["settings","controls"],speaker:["music"],star:["bookmark","favorite","like"],sun:["brightness","weather","light"],sunrise:["weather"],sunset:["weather"],tag:["label"],target:["bullseye"],terminal:["code","command line"],"thumbs-down":["dislike","bad"],"thumbs-up":["like","good"],"toggle-left":["on","off","switch"],"toggle-right":["on","off","switch"],trash:["garbage","delete","remove"],"trash-2":["garbage","delete","remove"],triangle:["delta"],truck:["delivery","van","shipping"],twitter:["logo"],umbrella:["rain","weather"],"video-off":["camera","movie","film"],video:["camera","movie","film"],voicemail:["phone"],volume:["music","sound","mute"],"volume-1":["music","sound"],"volume-2":["music","sound"],"volume-x":["music","sound","mute"],watch:["clock","time"],wind:["weather","air"],"x-circle":["cancel","close","delete","remove","times"],"x-square":["cancel","close","delete","remove","times"],x:["cancel","close","delete","remove","times"],youtube:["logo","video","play"],"zap-off":["flash","camera","lightning"],zap:["flash","camera","lightning"]}},function(e,n,i){"use strict";function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(console.warn("feather.toSvg() is deprecated. Please use feather.icons[name].toSvg() instead."),!e)throw new Error("The required `key` (icon name) parameter is missing.");if(!r.default[e])throw new Error("No icon matching '"+e+"'. See the complete list of icons at https://feathericons.com");return r.default[e].toSvg(n)}Object.defineProperty(n,"__esModule",{value:!0});var l=i(27),r=function(e){return e&&e.__esModule?e:{default:e}}(l);n.default=t},function(e,n,i){"use strict";function t(e){return e&&e.__esModule?e:{default:e}}function l(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if("undefined"==typeof document)throw new Error("`feather.replace()` only works in a browser environment.");var n=document.querySelectorAll("[data-feather]");Array.from(n).forEach(function(n){return r(n,e)})}function r(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=o(e),t=i["data-feather"];delete i["data-feather"];var l=h.default[t].toSvg(a({},n,i,{class:(0,y.default)(n.class,i.class)})),r=(new DOMParser).parseFromString(l,"image/svg+xml"),c=r.querySelector("svg");e.parentNode.replaceChild(c,e)}function o(e){return Array.from(e.attributes).reduce(function(e,n){return e[n.name]=n.value,e},{})}Object.defineProperty(n,"__esModule",{value:!0});var a=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var i=arguments[n];for(var t in i)Object.prototype.hasOwnProperty.call(i,t)&&(e[t]=i[t])}return e},c=i(48),y=t(c),p=i(27),h=t(p);n.default=l}])});
//# sourceMappingURL=feather.min.js.map
/*!
 * fullPage 3.0.3 - Extensions 0.1.7
 * https://github.com/alvarotrigo/fullPage.js
 * @license http://alvarotrigo.com/fullPage/extensions/#license
 *
 * Copyright (C) 2015 alvarotrigo.com - A project by Alvaro Trigo
 */
!function(e,t,n,o,r){"function"==typeof define&&define.amd?define(function(){return e.fullpage=o(t,n),e.fullpage}):"object"==typeof exports?module.exports=o(t,n):t.fullpage=o(t,n)}(this,window,document,function(e,t){"use strict";var n="fullpage-wrapper",o="."+n,r="fp-responsive",i="fp-notransition",l="fp-destroyed",a="fp-enabled",s="fp-viewing",c="active",u="."+c,f="fp-completely",d="."+f,v=".section",p="fp-section",h="."+p,g=h+u,m="fp-tableCell",S="."+m,b="fp-auto-height",w="fp-normal-scroll",y="fp-nav",E="#"+y,x="fp-tooltip",L="."+x,A="fp-show-active",M=".slide",T="fp-slide",O="."+T,k=O+u,C="fp-slides",H="."+C,R="fp-slidesContainer",I="."+R,z="fp-table",B="fp-initial",N="fp-slidesNav",j="."+N,P=j+" a",Y="fp-controlArrow",D="."+Y,W="fp-prev",V=Y+" "+W,X=D+("."+W),Z="fp-next",G=Y+" "+Z,F=D+".fp-next";function U(t,n){e.console&&e.console[t]&&e.console[t]("fullPage: "+n)}function _(e,n){return(n=arguments.length>1?n:t)?n.querySelectorAll(e):null}function Q(e){e=e||{};for(var t=1;t<arguments.length;t++){var n=arguments[t];if(n)for(var o in n)n.hasOwnProperty(o)&&("object"==typeof n[o]&&null!=n[o]?e[o]=Q(e[o],n[o]):e[o]=n[o])}return e}function J(e,t){return null!=e&&(e.classList?e.classList.contains(t):new RegExp("(^| )"+t+"( |$)","gi").test(e.className))}function K(){return"innerHeight"in e?e.innerHeight:t.documentElement.offsetHeight}function q(e,t){var n;for(n in e=le(e),t)if(t.hasOwnProperty(n)&&null!==n)for(var o=0;o<e.length;o++){e[o].style[n]=t[n]}return e}function $(e,t,n){for(var o=e[n];o&&!Ae(o,t);)o=o[n];return o}function ee(e,t){return $(e,t,"previousElementSibling")}function te(e,t){return $(e,t,"nextElementSibling")}function ne(e,t){if(null==t)return e.previousElementSibling;var n=ne(e);return n&&Ae(n,t)?n:null}function oe(e,t){if(null==t)return e.nextElementSibling;var n=oe(e);return n&&Ae(n,t)?n:null}function re(e){return e[e.length-1]}function ie(e,t){e=ce(e)?e[0]:e;for(var n=null!=t?_(t,e.parentNode):e.parentNode.childNodes,o=0,r=0;r<n.length;r++){if(n[r]==e)return o;1==n[r].nodeType&&o++}return-1}function le(e){return ce(e)?e:[e]}function ae(e){e=le(e);for(var t=0;t<e.length;t++)e[t].style.display="none";return e}function se(e){e=le(e);for(var t=0;t<e.length;t++)e[t].style.display="block";return e}function ce(e){return"[object Array]"===Object.prototype.toString.call(e)||"[object NodeList]"===Object.prototype.toString.call(e)}function ue(e,t){e=le(e);for(var n=0;n<e.length;n++){var o=e[n];o.classList?o.classList.add(t):o.className+=" "+t}return e}function fe(e,t){e=le(e);for(var n=t.split(" "),o=0;o<n.length;o++){t=n[o];for(var r=0;r<e.length;r++){var i=e[r];i.classList?i.classList.remove(t):i.className=i.className.replace(new RegExp("(^|\\b)"+t.split(" ").join("|")+"(\\b|$)","gi")," ")}}return e}function de(e,t){t.appendChild(e)}function ve(e,n,o){var r;n=n||t.createElement("div");for(var i=0;i<e.length;i++){var l=e[i];(o&&!i||!o)&&(r=n.cloneNode(!0),l.parentNode.insertBefore(r,l)),r.appendChild(l)}return e}function pe(e,t){ve(e,t,!0)}function he(e,t){for("string"==typeof t&&(t=Te(t)),e.appendChild(t);e.firstChild!==t;)t.appendChild(e.firstChild)}function ge(e,t){return e&&1===e.nodeType?Ae(e,t)?e:ge(e.parentNode,t):null}function me(e,t){be(e,e.nextSibling,t)}function Se(e,t){be(e,e,t)}function be(e,t,n){ce(n)||("string"==typeof n&&(n=Te(n)),n=[n]);for(var o=0;o<n.length;o++)e.parentNode.insertBefore(n[o],t)}function we(){var n=t.documentElement;return(e.pageYOffset||n.scrollTop)-(n.clientTop||0)}function ye(e){return Array.prototype.filter.call(e.parentNode.children,function(t){return t!==e})}function Ee(e){e.preventDefault?e.preventDefault():e.returnValue=!1}function xe(e){if("function"==typeof e)return!0;var t=Object.prototype.toString(e);return"[object Function]"===t||"[object GeneratorFunction]"===t}function Le(n,o,r){var i;r=void 0===r?{}:r,"function"==typeof e.CustomEvent?i=new CustomEvent(o,{detail:r}):(i=t.createEvent("CustomEvent")).initCustomEvent(o,!0,!0,r),n.dispatchEvent(i)}function Ae(e,t){return(e.matches||e.matchesSelector||e.msMatchesSelector||e.mozMatchesSelector||e.webkitMatchesSelector||e.oMatchesSelector).call(e,t)}function Me(e,t){if("boolean"==typeof t)for(var n=0;n<e.length;n++)e[n].style.display=t?"block":"none";return e}function Te(e){var n=t.createElement("div");return n.innerHTML=e.trim(),n.firstChild}function Oe(e){e=le(e);for(var t=0;t<e.length;t++){var n=e[t];n&&n.parentElement&&n.parentNode.removeChild(n)}}function ke(e,t,n){for(var o=e[n],r=[];o;)(Ae(o,t)||null==t)&&r.push(o),o=o[n];return r}function Ce(e,t){return ke(e,t,"nextElementSibling")}function He(e,t){return ke(e,t,"previousElementSibling")}function Re(e,t){e.insertBefore(t,e.firstChild)}return e.NodeList&&!NodeList.prototype.forEach&&(NodeList.prototype.forEach=function(t,n){n=n||e;for(var o=0;o<this.length;o++)t.call(n,this[o],o,this)}),e.fp_utils={$:_,deepExtend:Q,hasClass:J,getWindowHeight:K,css:q,until:$,prevUntil:ee,nextUntil:te,prev:ne,next:oe,last:re,index:ie,getList:le,hide:ae,show:se,isArrayOrList:ce,addClass:ue,removeClass:fe,appendTo:de,wrap:ve,wrapAll:pe,wrapInner:he,closest:ge,after:me,before:Se,insertBefore:be,getScrollTop:we,siblings:ye,preventDefault:Ee,isFunction:xe,trigger:Le,matches:Ae,toggle:Me,createElementFromHTML:Te,remove:Oe,filter:function(e,t){Array.prototype.filter.call(e,t)},untilAll:ke,nextAll:Ce,prevAll:He,showError:U,prependTo:Re,toggleClass:function(e,t,n){if(e.classList&&null==n)e.classList.toggle(t);else{var o=J(e,t);o&&null==n||!n?fe(e,t):(!o&&null==n||n)&&ue(e,t)}}},function(Y,Z){var $=Z&&new RegExp("([\\d\\w]{8}-){3}[\\d\\w]{8}|OPEN-SOURCE-GPLV3-LICENSE").test(Z.licenseKey)||t.domain.indexOf("alvarotrigo.com")>-1;if(!J(_("html"),a)){var le=_("html, body"),ce=_("body")[0],ve={};Z=Q({menu:!1,anchors:[],lockAnchors:!1,navigation:!1,navigationPosition:"right",navigationTooltips:[],showActiveTooltip:!1,slidesNavigation:!1,slidesNavPosition:"bottom",scrollBar:!1,hybrid:!1,css3:!0,scrollingSpeed:700,autoScrolling:!0,fitToSection:!0,fitToSectionDelay:1e3,easing:"easeInOutCubic",easingcss3:"ease",loopBottom:!1,loopTop:!1,loopHorizontal:!0,continuousVertical:!1,continuousHorizontal:!1,scrollHorizontally:!1,interlockedSlides:!1,dragAndMove:!1,offsetSections:!1,resetSliders:!1,fadingEffect:!1,normalScrollElements:null,scrollOverflow:!1,scrollOverflowReset:!1,scrollOverflowHandler:e.fp_scrolloverflow?e.fp_scrolloverflow.iscrollHandler:null,scrollOverflowOptions:null,touchSensitivity:5,normalScrollElementTouchThreshold:5,bigSectionsDestination:null,keyboardScrolling:!0,animateAnchor:!0,recordHistory:!0,controlArrows:!0,controlArrowColor:"#fff",verticalCentered:!0,sectionsColor:[],paddingTop:0,paddingBottom:0,fixedElements:null,responsive:0,responsiveWidth:0,responsiveHeight:0,responsiveSlides:!1,parallax:!1,parallaxOptions:{type:"reveal",percentage:62,property:"translate"},sectionSelector:v,slideSelector:M,v2compatible:!1,afterLoad:null,onLeave:null,afterRender:null,afterResize:null,afterReBuild:null,afterSlideLoad:null,onSlideLeave:null,afterResponsive:null,lazyLoading:!0},Z);var be,ke,Ie,ze,Be=!1,Ne=navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/),je="ontouchstart"in e||navigator.msMaxTouchPoints>0||navigator.maxTouchPoints,Pe="string"==typeof Y?_(Y)[0]:Y,Ye=K(),De=!1,We=!0,Ve=!0,Xe=[],Ze={m:{up:!0,down:!0,left:!0,right:!0}};Ze.k=Q({},Ze.m);var Ge,Fe,Ue,_e,Qe,Je,Ke,qe,$e,et=Jn(),tt={touchmove:"ontouchmove"in e?"touchmove":et.move,touchstart:"ontouchstart"in e?"touchstart":et.down},nt=!1,ot='a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]',rt=Q({},Z),it={};so(),e.fp_easings=Q(e.fp_easings,{easeInOutCubic:function(e,t,n,o){return(e/=o/2)<1?n/2*e*e*e+t:n/2*((e-=2)*e*e+2)+t}}),Pe&&(ve.version="3.0.2",ve.setAutoScrolling=St,ve.setRecordHistory=bt,ve.setScrollingSpeed=wt,ve.setFitToSection=yt,ve.setLockAnchors=function(e){Z.lockAnchors=e},ve.setMouseWheelScrolling=Et,ve.setAllowScrolling=xt,ve.setKeyboardScrolling=At,ve.moveSectionUp=Mt,ve.moveSectionDown=Tt,ve.silentMoveTo=Ot,ve.moveTo=kt,ve.moveSlideRight=Ct,ve.moveSlideLeft=Ht,ve.fitToSection=Xt,ve.reBuild=Rt,ve.setResponsive=It,ve.getFullpageData=function(){return{options:Z,internals:{container:Pe,canScroll:Ve,isScrollAllowed:Ze,getDestinationPosition:$t,isTouch:je,c:mn,getXmovement:Yn,removeAnimation:Nn,getTransforms:eo,lazyLoad:sn,addAnimation:Bn,performHorizontalMove:Rn,landscapeScroll:kn,silentLandscapeScroll:qn,keepSlidesPosition:qt,silentScroll:$n,styleSlides:Pt,scrollHandler:Vt,getEventsPage:Kn,getMSPointer:Jn,isReallyTouch:Ut,usingExtension:oo,toggleControlArrows:Cn,touchStartHandler:_t,touchMoveHandler:Ft}}},ve.destroy=function(n){Le(Pe,"destroy",n),St(!1,"internal"),xt(!0),Lt(!1),At(!1),ue(Pe,l),clearTimeout(_e),clearTimeout(Ue),clearTimeout(Fe),clearTimeout(Qe),clearTimeout(Je),e.removeEventListener("scroll",Vt),e.removeEventListener("hashchange",wn),e.removeEventListener("resize",In),t.removeEventListener("keydown",En),t.removeEventListener("keyup",xn),["click","touchstart"].forEach(function(e){t.removeEventListener(e,zt)}),["mouseenter","touchstart","mouseleave","touchend"].forEach(function(e){t.removeEventListener(e,Nt,!0)}),oo("dragAndMove")&&ve.dragAndMove.destroy(),clearTimeout(_e),clearTimeout(Ue),n&&($n(0),_("img[data-src], source[data-src], audio[data-src], iframe[data-src]",Pe).forEach(function(e){an(e,"src")}),_("img[data-srcset]").forEach(function(e){an(e,"srcset")}),Oe(_(E+", "+j+", "+D)),q(_(h),{height:"","background-color":"",padding:""}),q(_(O),{width:""}),q(Pe,{height:"",position:"","-ms-touch-action":"","touch-action":""}),q(le,{overflow:"",height:""}),fe(_("html"),a),fe(ce,r),ce.className.split(/\s+/).forEach(function(e){0===e.indexOf(s)&&fe(ce,e)}),_(h+", "+O).forEach(function(e){Z.scrollOverflowHandler&&Z.scrollOverflowHandler.remove(e),fe(e,z+" "+c+" "+f);var t=e.getAttribute("data-fp-styles");t&&e.setAttribute("style",e.getAttribute("data-fp-styles"))}),no(Pe),[S,I,H].forEach(function(e){_(e,Pe).forEach(function(e){e.outerHTML=e.innerHTML})}),e.scrollTo(0,0),[p,T,R].forEach(function(e){fe(_("."+e),e)}))},ve.getActiveSection=function(){return new vo(_(g)[0])},ve.getActiveSlide=function(){return on(_(k,_(g)[0])[0])},ve.landscapeScroll=kn,ve.test={top:"0px",translate3d:"translate3d(0px, 0px, 0px)",translate3dH:function(){for(var e=[],t=0;t<_(Z.sectionSelector,Pe).length;t++)e.push("translate3d(0px, 0px, 0px)");return e}(),left:function(){for(var e=[],t=0;t<_(Z.sectionSelector,Pe).length;t++)e.push(0);return e}(),options:Z,setAutoScrolling:St},ve.shared={afterRenderActions:Wt},e.fullpage_api=ve,jt("continuousHorizontal"),jt("scrollHorizontally"),jt("resetSliders"),jt("interlockedSlides"),jt("responsiveSlides"),jt("fadingEffect"),jt("dragAndMove"),jt("offsetSections"),jt("scrollOverflowReset"),jt("parallax"),oo("dragAndMove")&&ve.dragAndMove.init(),Z.css3&&(Z.css3=function(){var n,o=t.createElement("p"),r={webkitTransform:"-webkit-transform",OTransform:"-o-transform",msTransform:"-ms-transform",MozTransform:"-moz-transform",transform:"transform"};for(var i in o.style.display="block",t.body.insertBefore(o,null),r)void 0!==o.style[i]&&(o.style[i]="translate3d(1px,1px,1px)",n=e.getComputedStyle(o).getPropertyValue(r[i]));return t.body.removeChild(o),void 0!==n&&n.length>0&&"none"!==n}()),Z.scrollBar=Z.scrollBar||Z.hybrid,function(){if(!Z.anchors.length){var e="[data-anchor]",t=_(Z.sectionSelector.split(",").join(e+",")+e,Pe);t.length&&t.forEach(function(e){Z.anchors.push(e.getAttribute("data-anchor").toString())})}if(!Z.navigationTooltips.length){var e="[data-tooltip]",n=_(Z.sectionSelector.split(",").join(e+",")+e,Pe);n.length&&n.forEach(function(e){Z.navigationTooltips.push(e.getAttribute("data-tooltip").toString())})}}(),function(){q(Pe,{height:"100%",position:"relative"}),ue(Pe,n),ue(_("html"),a),Ye=K(),fe(Pe,l),ue(_(Z.sectionSelector,Pe),p),ue(_(Z.slideSelector,Pe),T),ro("parallax","init");for(var e=_(h),r=0;r<e.length;r++){var i=r,s=e[r],u=_(O,s),f=u.length;s.setAttribute("data-fp-styles",s.getAttribute("style")),m=s,(S=i)||null!=_(g)[0]||ue(m,c),ze=_(g)[0],q(m,{height:Yt(m)+"px"}),Z.paddingTop&&q(m,{"padding-top":Z.paddingTop}),Z.paddingBottom&&q(m,{"padding-bottom":Z.paddingBottom}),void 0!==Z.sectionsColor[S]&&q(m,{"background-color":Z.sectionsColor[S]}),void 0!==Z.anchors[S]&&m.setAttribute("data-anchor",Z.anchors[S]),d=s,v=i,void 0!==Z.anchors[v]&&J(d,c)&&jn(Z.anchors[v],v),Z.menu&&Z.css3&&null!=ge(_(Z.menu)[0],o)&&ce.appendChild(_(Z.menu)[0]),f>0?Pt(s,u,f):Z.verticalCentered&&Dn(s)}var d,v,m,S;Z.fixedElements&&Z.css3&&_(Z.fixedElements).forEach(function(e){ce.appendChild(e)}),Z.navigation&&function(){var e=t.createElement("div");e.setAttribute("id",y);var n=t.createElement("ul");e.appendChild(n),de(e,ce);var o=_(E)[0];ue(o,"fp-"+Z.navigationPosition),Z.showActiveTooltip&&ue(o,A);for(var r="",i=0;i<_(h).length;i++){var l="";Z.anchors.length&&(l=Z.anchors[i]),r+='<li><a href="#'+l+'"><span class="fp-sr-only">'+Dt(i,"Section")+"</span><span></span></a>";var a=Z.navigationTooltips[i];void 0!==a&&""!==a&&(r+='<div class="'+x+" fp-"+Z.navigationPosition+'">'+a+"</div>"),r+="</li>"}_("ul",o)[0].innerHTML=r,q(_(E),{"margin-top":"-"+_(E)[0].offsetHeight/2+"px"}),ue(_("a",_("li",_(E)[0])[ie(_(g)[0],h)]),c)}(),_('iframe[src*="youtube.com/embed/"]',Pe).forEach(function(e){var t,n,o;n="enablejsapi=1",o=(t=e).getAttribute("src"),t.setAttribute("src",o+(/\?/.test(o)?"&":"?")+n)}),Z.fadingEffect&&ve.fadingEffect&&ve.fadingEffect.apply(),Z.scrollOverflow?Ge=Z.scrollOverflowHandler.init(Z):Wt()}(),xt(!0),Lt(!0),St(Z.autoScrolling,"internal"),zn(),Qn(),"complete"===t.readyState&&bn(),e.addEventListener("load",bn),e.addEventListener("scroll",Vt),e.addEventListener("hashchange",wn),e.addEventListener("blur",Tn),e.addEventListener("resize",In),t.addEventListener("keydown",En),t.addEventListener("keyup",xn),["click","touchstart"].forEach(function(e){t.addEventListener(e,zt)}),Z.normalScrollElements&&(["mouseenter","touchstart"].forEach(function(e){Bt(e,!1)}),["mouseleave","touchend"].forEach(function(e){Bt(e,!0)})),oo("dragAndMove")&&ve.dragAndMove.turnOffTouch());var lt,at,st,ct=!1,ut=0,ft=0,dt=0,vt=0,pt=(new Date).getTime(),ht=0,gt=0,mt=Ye;return ve}function St(e,t){e||$n(0),ao("autoScrolling",e,t);var n=_(g)[0];if(Z.autoScrolling&&!Z.scrollBar)q(le,{overflow:"hidden",height:"100%"}),bt(rt.recordHistory,"internal"),q(Pe,{"-ms-touch-action":"none","touch-action":"none"}),null!=n&&$n(n.offsetTop);else if(q(le,{overflow:"visible",height:"initial"}),bt(!1,"internal"),q(Pe,{"-ms-touch-action":"","touch-action":""}),no(Pe),null!=n){var o=rn(n.offsetTop);o.element.scrollTo(0,o.options)}Le(Pe,"setAutoScrolling",e)}function bt(e,t){ao("recordHistory",e,t)}function wt(e,t){"internal"!==t&&Z.fadingEffect&&ve.fadingEffect&&ve.fadingEffect.update(e),ao("scrollingSpeed",e,t)}function yt(e,t){ao("fitToSection",e,t)}function Et(n){n?(function(){var n,o="";e.addEventListener?n="addEventListener":(n="attachEvent",o="on");var r="onwheel"in t.createElement("div")?"wheel":void 0!==t.onmousewheel?"mousewheel":"DOMMouseScroll";"DOMMouseScroll"==r?t[n](o+"MozMousePixelScroll",Jt,!1):t[n](o+r,Jt,!1)}(),Pe.addEventListener("mousedown",Ln),Pe.addEventListener("mouseup",An)):(t.addEventListener?(t.removeEventListener("mousewheel",Jt,!1),t.removeEventListener("wheel",Jt,!1),t.removeEventListener("MozMousePixelScroll",Jt,!1)):t.detachEvent("onmousewheel",Jt),Pe.removeEventListener("mousedown",Ln),Pe.removeEventListener("mouseup",An))}function xt(e,t){void 0!==t?(t=t.replace(/ /g,"").split(",")).forEach(function(t){to(e,t,"m")}):to(e,"all","m"),Le(Pe,"setAllowScrolling",{value:e,directions:t})}function Lt(e){e?(Et(!0),(Ne||je)&&(Z.autoScrolling&&(ce.removeEventListener(tt.touchmove,Gt,{passive:!1}),ce.addEventListener(tt.touchmove,Gt,{passive:!1})),_(o)[0].removeEventListener(tt.touchstart,_t),_(o)[0].removeEventListener(tt.touchmove,Ft,{passive:!1}),_(o)[0].addEventListener(tt.touchstart,_t),_(o)[0].addEventListener(tt.touchmove,Ft,{passive:!1}))):(Et(!1),(Ne||je)&&(Z.autoScrolling&&(ce.removeEventListener(tt.touchmove,Ft,{passive:!1}),ce.removeEventListener(tt.touchmove,Gt,{passive:!1})),_(o)[0].removeEventListener(tt.touchstart,_t),_(o)[0].removeEventListener(tt.touchmove,Ft,{passive:!1})))}function At(e,t){void 0!==t?(t=t.replace(/ /g,"").split(",")).forEach(function(t){to(e,t,"k")}):(to(e,"all","k"),Z.keyboardScrolling=e)}function Mt(){var e=ee(_(g)[0],h);e||!Z.loopTop&&!Z.continuousVertical||(e=re(_(h))),null!=e&&en(e,null,!0)}function Tt(){var e=te(_(g)[0],h);e||!Z.loopBottom&&!Z.continuousVertical||(e=_(h)[0]),null!=e&&en(e,null,!1)}function Ot(e,t){wt(0,"internal"),kt(e,t),wt(rt.scrollingSpeed,"internal")}function kt(e,t){var n=Xn(e);void 0!==t?Zn(e,t):null!=n&&en(n)}function Ct(e){Kt("right",e)}function Ht(e){Kt("left",e)}function Rt(t){if(!J(Pe,l)){De=!0,Ye=K();for(var n=_(h),o=0;o<n.length;++o){var r=n[o],i=_(H,r)[0],a=_(O,r);Z.verticalCentered&&q(_(S,r),{height:Wn(r)+"px"}),q(r,{height:Yt(r)+"px"}),a.length>1&&kn(i,_(k,i)[0])}Z.scrollOverflow&&Ge.createScrollBarForAll();var s=ie(_(g)[0],h);s&&!oo("fadingEffect")&&Ot(s+1),De=!1,xe(Z.afterResize)&&t&&Z.afterResize.call(Pe,e.innerWidth,e.innerHeight),xe(Z.afterReBuild)&&!t&&Z.afterReBuild.call(Pe),Le(Pe,"afterRebuild")}}function It(e){var t=J(ce,r);e?t||(St(!1,"internal"),yt(!1,"internal"),ae(_(E)),ue(ce,r),xe(Z.afterResponsive)&&Z.afterResponsive.call(Pe,e),Z.responsiveSlides&&ve.responsiveSlides&&ve.responsiveSlides.toSections(),Le(Pe,"afterResponsive",e),Z.scrollOverflow&&Ge.createScrollBarForAll()):t&&(St(rt.autoScrolling,"internal"),yt(rt.autoScrolling,"internal"),se(_(E)),fe(ce,r),xe(Z.afterResponsive)&&Z.afterResponsive.call(Pe,e),Z.responsiveSlides&&ve.responsiveSlides&&ve.responsiveSlides.toSlides(),Le(Pe,"afterResponsive",e))}function zt(e){var t=e.target;t&&ge(t,E+" a")?function(e){Ee(e);var t=ie(ge(this,E+" li"));en(_(h)[t])}.call(t,e):Ae(t,L)?function(){Le(ne(this),"click")}.call(t):Ae(t,D)?function(){var e=ge(this,h);J(this,W)?Ze.m.left&&Ht(e):Ze.m.right&&Ct(e)}.call(t,e):(Ae(t,P)||null!=ge(t,P))&&function(e){Ee(e);var t=_(H,ge(this,h))[0],n=_(O,t)[ie(ge(this,"li"))];kn(t,n)}.call(t,e)}function Bt(e,n){t["fp_"+e]=n,t.addEventListener(e,Nt,!0)}function Nt(e){e.target!=t&&Z.normalScrollElements.split(",").forEach(function(n){Ae(e.target,n)&&Lt(t["fp_"+e.type])})}function jt(t){var n="fp_"+t+"Extension";it[t]=Z[t+"Key"],ve[t]=void 0!==e[n]?new e[n]:null,ve[t]&&ve[t].c(t)}function Pt(e,n,o){var r=100*o,i=100/o,l=t.createElement("div");l.className=C,pe(n,l);var a,s,u=t.createElement("div");u.className=R,pe(n,u),q(_(I,e),{width:r+"%"}),o>1&&(Z.controlArrows&&(a=e,s=[Te('<div class="'+V+'"></div>'),Te('<div class="'+G+'"></div>')],me(_(H,a)[0],s),"#fff"!==Z.controlArrowColor&&(q(_(F,a),{"border-color":"transparent transparent transparent "+Z.controlArrowColor}),q(_(X,a),{"border-color":"transparent "+Z.controlArrowColor+" transparent transparent"})),Z.loopHorizontal||ae(_(X,a))),Z.slidesNavigation&&function(e,t){de(Te('<div class="'+N+'"><ul></ul></div>'),e);var n=_(j,e)[0];ue(n,"fp-"+Z.slidesNavPosition);for(var o=0;o<t;o++)de(Te('<li><a href="#"><span class="fp-sr-only">'+Dt(o,"Slide")+"</span><span></span></a></li>"),_("ul",n)[0]);q(n,{"margin-left":"-"+n.innerWidth/2+"px"}),ue(_("a",_("li",n)[0]),c)}(e,o)),n.forEach(function(e){q(e,{width:i+"%"}),Z.verticalCentered&&Dn(e)});var f=_(k,e)[0];null!=f&&(0!==ie(_(g),h)||0===ie(_(g),h)&&0!==ie(f))?(qn(f,"internal"),ue(f,B)):ue(n[0],c)}function Yt(e){return Z.offsetSections&&ve.offsetSections?Math.round(ve.offsetSections.getWindowHeight(e)):K()}function Dt(e,t){return Z.navigationTooltips[e]||Z.anchors[e]||t+" "+(e+1)}function Wt(){var e,t=_(g)[0];ue(t,f),sn(t),cn(t),Z.scrollOverflow&&Z.scrollOverflowHandler.afterLoad(),(!(e=Xn(yn().section))||void 0!==e&&ie(e)===ie(ze))&&xe(Z.afterLoad)&&tn("afterLoad",{activeSection:null,element:t,direction:null,anchorLink:t.getAttribute("data-anchor"),sectionIndex:ie(t,h)}),xe(Z.afterRender)&&tn("afterRender"),Le(Pe,"afterRender")}function Vt(){var e;if(Le(Pe,"onScroll"),(!Z.autoScrolling||Z.scrollBar||oo("dragAndMove"))&&!lo()){var t=oo("dragAndMove")?Math.abs(ve.dragAndMove.getCurrentScroll()):we(),n=0,o=t+K()/2,r=(oo("dragAndMove")?ve.dragAndMove.getDocumentHeight():ce.offsetHeight-K())===t,i=_(h);if(r)n=i.length-1;else if(t)for(var l=0;l<i.length;++l)i[l].offsetTop<=o&&(n=l);else n=0;if(!J(e=i[n],c)){ct=!0;var a,s,u=_(g)[0],f=ie(u,h)+1,d=Pn(e),v=e.getAttribute("data-anchor"),p=ie(e,h)+1,m=_(k,e)[0],S={activeSection:u,sectionIndex:p-1,anchorLink:v,element:e,leavingSection:f,direction:d};m&&(s=m.getAttribute("data-anchor"),a=ie(m)),Ve&&(ue(e,c),fe(ye(e),c),ro("parallax","afterLoad"),xe(Z.onLeave)&&tn("onLeave",S),xe(Z.afterLoad)&&tn("afterLoad",S),Z.resetSliders&&ve.resetSliders&&ve.resetSliders.apply({localIsResizing:De,leavingSection:f}),fn(u),sn(e),cn(e),jn(v,p-1),Z.anchors.length&&(be=v),Fn(a,s,v)),clearTimeout(Qe),Qe=setTimeout(function(){ct=!1},100)}Z.fitToSection&&(clearTimeout(Je),Je=setTimeout(function(){Z.fitToSection&&_(g)[0].offsetHeight<=Ye&&Xt()},Z.fitToSectionDelay))}}function Xt(){Ve&&(De=!0,en(_(g)[0]),De=!1)}function Zt(e){if(Ze.m[e]){var t="down"===e?Tt:Mt;if(ve.scrollHorizontally&&(t=ve.scrollHorizontally.getScrollSection(e,t)),Z.scrollOverflow){var n=Z.scrollOverflowHandler.scrollable(_(g)[0]),o="down"===e?"bottom":"top";if(null!=n){if(!Z.scrollOverflowHandler.isScrolled(o,n))return!0;t()}else t()}else t()}}function Gt(e){Z.autoScrolling&&Ut(e)&&Ee(e)}function Ft(t){var n=ge(t.target,h);if(Ut(t)){Z.autoScrolling&&Ee(t);var o=Kn(t);dt=o.y,vt=o.x,_(H,n).length&&Math.abs(ft-vt)>Math.abs(ut-dt)?!Be&&Math.abs(ft-vt)>e.innerWidth/100*Z.touchSensitivity&&(ft>vt?Ze.m.right&&Ct(n):Ze.m.left&&Ht(n)):Z.autoScrolling&&Ve&&Math.abs(ut-dt)>e.innerHeight/100*Z.touchSensitivity&&(ut>dt?Zt("down"):dt>ut&&Zt("up"))}}function Ut(e){return void 0===e.pointerType||"mouse"!=e.pointerType}function _t(e){if(Z.fitToSection&&($e=!1),Ut(e)){var t=Kn(e);ut=t.y,ft=t.x}}function Qt(e,t){for(var n=0,o=e.slice(Math.max(e.length-t,1)),r=0;r<o.length;r++)n+=o[r];return Math.ceil(n/t)}function Jt(t){var n=(new Date).getTime(),o=J(_(d)[0],w);if(!Ze.m.down&&!Ze.m.up)return Ee(t),!1;if(Z.autoScrolling&&!Ie&&!o){var r=(t=t||e.event).wheelDelta||-t.deltaY||-t.detail,i=Math.max(-1,Math.min(1,r)),l=void 0!==t.wheelDeltaX||void 0!==t.deltaX,a=Math.abs(t.wheelDeltaX)<Math.abs(t.wheelDelta)||Math.abs(t.deltaX)<Math.abs(t.deltaY)||!l;Xe.length>149&&Xe.shift(),Xe.push(Math.abs(r)),Z.scrollBar&&Ee(t);var s=n-pt;return pt=n,s>200&&(Xe=[]),Ve&&!io()&&Qt(Xe,10)>=Qt(Xe,70)&&a&&Zt(i<0?"down":"up"),!1}Z.fitToSection&&($e=!1)}function Kt(e,t){var n=null==t?_(g)[0]:t,o=_(H,n)[0];if(!(null==o||io()||Be||_(O,o).length<2)){var r=_(k,o)[0],i=null;if(null==(i="left"===e?ee(r,O):te(r,O))){if(!Z.loopHorizontal)return;var l=ye(r);i="left"===e?l[l.length-1]:l[0]}Be=!ve.test.isTesting,kn(o,i,e)}}function qt(){for(var e=_(k),t=0;t<e.length;t++)qn(e[t],"internal")}function $t(e){var t=e.offsetHeight,n=e.offsetTop,o=n,r=oo("dragAndMove")&&ve.dragAndMove.isGrabbing?ve.dragAndMove.isScrollingDown():n>ht,i=o-Ye+t,l=Z.bigSectionsDestination;return t>Ye?(r||l)&&"bottom"!==l||(o=i):(r||De&&null==oe(e))&&(o=i),Z.offsetSections&&ve.offsetSections&&(o=ve.offsetSections.getSectionPosition(r,o,e)),ht=o,o}function en(e,t,n){if(null!=e){var r,i,l={element:e,callback:t,isMovementUp:n,dtop:$t(e),yMovement:Pn(e),anchorLink:e.getAttribute("data-anchor"),sectionIndex:ie(e,h),activeSlide:_(k,e)[0],activeSection:_(g)[0],leavingSection:ie(_(g),h)+1,localIsResizing:De};if(!(l.activeSection==e&&!De||Z.scrollBar&&we()===l.dtop&&!J(e,b))){if(null!=l.activeSlide&&(r=l.activeSlide.getAttribute("data-anchor"),i=ie(l.activeSlide)),xe(Z.onLeave)&&!l.localIsResizing){var a=l.yMovement;if(void 0!==n&&(a=n?"up":"down"),l.direction=a,!1===tn("onLeave",l))return}ro("parallax","apply",l),Z.autoScrolling&&Z.continuousVertical&&void 0!==l.isMovementUp&&(!l.isMovementUp&&"up"==l.yMovement||l.isMovementUp&&"down"==l.yMovement)&&((u=l).isMovementUp?Se(_(g)[0],Ce(u.activeSection,h)):me(_(g)[0],He(u.activeSection,h).reverse()),$n(_(g)[0].offsetTop),qt(),u.wrapAroundElements=u.activeSection,u.dtop=u.element.offsetTop,u.yMovement=Pn(u.element),u.leavingSection=ie(u.activeSection,h)+1,u.sectionIndex=ie(u.element,h),Le(_(o)[0],"onContinuousVertical",u),l=u),oo("scrollOverflowReset")&&ve.scrollOverflowReset.setPrevious(l.activeSection),l.localIsResizing||fn(l.activeSection),Z.scrollOverflow&&Z.scrollOverflowHandler.beforeLeave(),ue(e,c),fe(ye(e),c),sn(e),Z.scrollOverflow&&Z.scrollOverflowHandler.onLeave(),Ve=ve.test.isTesting,Fn(i,r,l.anchorLink,l.sectionIndex),function(e){if(Z.css3&&Z.autoScrolling&&!Z.scrollBar){var t="translate3d(0px, -"+Math.round(e.dtop)+"px, 0px)";Vn(t,!0),Z.scrollingSpeed?(clearTimeout(Ue),Ue=setTimeout(function(){ln(e)},Z.scrollingSpeed)):ln(e)}else{var n=rn(e.dtop);ve.test.top=-e.dtop+"px",co(n.element,n.options,Z.scrollingSpeed,function(){Z.scrollBar?setTimeout(function(){ln(e)},30):ln(e)})}}(l),be=l.anchorLink,jn(l.anchorLink,null!=(s=l).wrapAroundElements?s.isMovementUp?_(h).length-1:0:s.sectionIndex)}}var s,u}function tn(e,t){var n,o,r,i,l=(o=e,r=t,(i=Z.v2compatible?{afterRender:function(){return[Pe]},onLeave:function(){return[r.activeSection,r.leavingSection,r.sectionIndex+1,r.direction]},afterLoad:function(){return[r.element,r.anchorLink,r.sectionIndex+1]},afterSlideLoad:function(){return[r.destiny,r.anchorLink,r.sectionIndex+1,r.slideAnchor,r.slideIndex]},onSlideLeave:function(){return[r.prevSlide,r.anchorLink,r.sectionIndex+1,r.prevSlideIndex,r.direction,r.slideIndex]}}:{afterRender:function(){return{section:nn(_(g)[0]),slide:on(_(k,_(g)[0])[0])}},onLeave:function(){return{origin:nn(r.activeSection),destination:nn(r.element),direction:r.direction}},afterLoad:function(){return i.onLeave()},afterSlideLoad:function(){return{section:nn(r.section),origin:on(r.prevSlide),destination:on(r.destiny),direction:r.direction}},onSlideLeave:function(){return i.afterSlideLoad()}})[o]());if(Z.v2compatible){if(!1===Z[e].apply(l[0],l.slice(1)))return!1}else if(Le(Pe,e,l),!1===Z[e].apply(l[Object.keys(l)[0]],(n=l,Object.keys(n).map(function(e){return n[e]}))))return!1;return!0}function nn(e){return e?new vo(e):null}function on(e){return e?new function(e){fo.call(this,e,O)}(e):null}function rn(t){var n={};return Z.autoScrolling&&!Z.scrollBar?(n.options=-t,n.element=_(o)[0]):(n.options=t,n.element=e),n}function ln(e){var t;null!=(t=e).wrapAroundElements&&(t.isMovementUp?Se(_(h)[0],t.wrapAroundElements):me(_(h)[_(h).length-1],t.wrapAroundElements),$n(_(g)[0].offsetTop),qt(),t.sectionIndex=ie(t.element,h),t.leavingSection=ie(t.activeSection,h)+1),xe(Z.afterLoad)&&!e.localIsResizing&&tn("afterLoad",e),Z.scrollOverflow&&Z.scrollOverflowHandler.afterLoad(),ro("parallax","afterLoad"),oo("scrollOverflowReset")&&ve.scrollOverflowReset.reset(),oo("resetSliders")&&ve.resetSliders.apply(e),e.localIsResizing||cn(e.element),ue(e.element,f),fe(ye(e.element),f),Ve=!0,xe(e.callback)&&e.callback()}function an(e,t){e.setAttribute(t,e.getAttribute("data-"+t)),e.removeAttribute("data-"+t)}function sn(e){Z.lazyLoading&&_("img[data-src], img[data-srcset], source[data-src], source[data-srcset], video[data-src], audio[data-src], iframe[data-src]",dn(e)).forEach(function(e){if(["src","srcset"].forEach(function(t){var n=e.getAttribute("data-"+t);null!=n&&n&&an(e,t)}),Ae(e,"source")){var t=ge(e,"video, audio");t&&t.load()}})}function cn(e){var t=dn(e);_("video, audio",t).forEach(function(e){e.hasAttribute("data-autoplay")&&"function"==typeof e.play&&e.play()}),_('iframe[src*="youtube.com/embed/"]',t).forEach(function(e){e.hasAttribute("data-autoplay")&&un(e),e.onload=function(){e.hasAttribute("data-autoplay")&&un(e)}})}function un(e){e.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}',"*")}function fn(e){var t=dn(e);_("video, audio",t).forEach(function(e){e.hasAttribute("data-keepplaying")||"function"!=typeof e.pause||e.pause()}),_('iframe[src*="youtube.com/embed/"]',t).forEach(function(e){/youtube\.com\/embed\//.test(e.getAttribute("src"))&&!e.hasAttribute("data-keepplaying")&&e.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}',"*")})}function dn(e){var t=_(k,e);return t.length&&(e=t[0]),e}function vn(e){var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";function n(e){var n,o,r,i,l,a,s="",c=0;for(e=e.replace(/[^A-Za-z0-9+/=]/g,"");c<e.length;)n=t.indexOf(e.charAt(c++))<<2|(i=t.indexOf(e.charAt(c++)))>>4,o=(15&i)<<4|(l=t.indexOf(e.charAt(c++)))>>2,r=(3&l)<<6|(a=t.indexOf(e.charAt(c++))),s+=String.fromCharCode(n),64!=l&&(s+=String.fromCharCode(o)),64!=a&&(s+=String.fromCharCode(r));return s=function(e){for(var t,n="",o=0,r=0,i=0;o<e.length;)(r=e.charCodeAt(o))<128?(n+=String.fromCharCode(r),o++):r>191&&r<224?(i=e.charCodeAt(o+1),n+=String.fromCharCode((31&r)<<6|63&i),o+=2):(i=e.charCodeAt(o+1),t=e.charCodeAt(o+2),n+=String.fromCharCode((15&r)<<12|(63&i)<<6|63&t),o+=3);return n}(s)}function o(e){return e.slice(3).slice(0,-3)}return function(e){var t=e.split("_");if(t.length>1){var r=t[1];return e.replace(o(t[1]),"").split("_")[0]+"_"+n(r.slice(3).slice(0,-3))}return o(e)}(n(e))}function pn(e){var n=function(){if(t.domain.length){for(var e=t.domain.replace(/^(www\.)/,"").split(".");e.length>2;)e.shift();return e.join(".").replace(/(^\.*)|(\.*$)/g,"")}return""}(),o=["MTM0bG9jYWxob3N0MjM0","MTM0MC4xMjM0","MTM0anNoZWxsLm5ldDIzNA==","UDdDQU5ZNlNN"],r=vn(o[0]),i=vn(o[1]),l=vn(o[2]),a=vn(o[3]),s=[r,i,l].indexOf(n)<0&&0!==n.length,c=void 0!==it[e]&&it[e].length;if(!c&&s)return!1;var u=c?vn(it[e]):"",f=(u=u.split("_")).length>1&&u[1].indexOf(e,u[1].length-e.length)>-1;return!(u[0].indexOf(n,u[0].length-n.length)<0&&s&&a!=u[0])&&f||!s}function hn(e){e.forEach(function(e){e.removedNodes[0]&&e.removedNodes[0].isEqualNode(at)&&(clearTimeout(st),st=setTimeout(gn,900))})}function gn(){nt=!1}function mn(n){at=t.createElement("div"),lt=vn("MTIzPGRpdj48YSBocmVmPSJodHRwOi8vYWx2YXJvdHJpZ28uY29tL2Z1bGxQYWdlL2V4dGVuc2lvbnMvIiBzdHlsZT0iY29sb3I6ICNmZmYgIWltcG9ydGFudDsgdGV4dC1kZWNvcmF0aW9uOm5vbmUgIWltcG9ydGFudDsiPlVubGljZW5zZWQgZnVsbFBhZ2UuanMgRXh0ZW5zaW9uPC9hPjwvZGl2PjEyMw=="),at.innerHTML=lt,at=at.firstChild,"MutationObserver"in e&&new MutationObserver(hn).observe(t.body,{childList:!0,subtree:!1}),oo(n)&&ve[n]&&(pn(n)||(Sn(),setInterval(Sn,2e3)))}function Sn(){at&&(nt||(Math.random()<.5?Re(ce,at):de(at,ce),nt=!0),at.setAttribute("style",vn("MTIzei1pbmRleDo5OTk5OTk5O3Bvc2l0aW9uOmZpeGVkO3RvcDoyMHB4O2JvdHRvbTphdXRvO2xlZnQ6MjBweDtyaWdodDphdXRvO2JhY2tncm91bmQ6cmVkO3BhZGRpbmc6N3B4IDE1cHg7Zm9udC1zaXplOjE0cHg7Zm9udC1mYW1pbHk6YXJpYWw7Y29sb3I6I2ZmZjtkaXNwbGF5OmlubGluZS1ibG9jazt0cmFuc2Zvcm06dHJhbnNsYXRlM2QoMCwwLDApO29wYWNpdHk6MTtoZWlnaHQ6YXV0bzt3aWR0aDphdXRvO3pvb206MTttYXJnaW46YXV0bztib3JkZXI6bm9uZTt2aXNpYmlsaXR5OnZpc2libGU7Y2xpcC1wYXRoOm5vbmU7MTIz").replace(/;/g,vn("MTIzICFpbXBvcnRhbnQ7MzQ1"))))}function bn(){var e=yn(),t=e.section,n=e.slide;t&&(Z.animateAnchor?Zn(t,n):Ot(t,n))}function wn(){if(!ct&&!Z.lockAnchors){var e=yn(),t=e.section,n=e.slide,o=void 0===be,r=void 0===be&&void 0===n&&!Be;t&&t.length&&(t&&t!==be&&!o||r||!Be&&ke!=n)&&Zn(t,n)}}function yn(){var t,n,o=e.location.hash;if(o.length){var r=o.replace("#","").split("/"),i=o.indexOf("#/")>-1;t=i?"/"+r[1]:decodeURIComponent(r[0]);var l=i?r[2]:r[1];l&&l.length&&(n=decodeURIComponent(l))}return{section:t,slide:n}}function En(e){clearTimeout(Ke);var n=t.activeElement,o=e.keyCode;9===o?function(e){var n,o,r,i,l,a,s,c=e.shiftKey,u=t.activeElement,f=Mn(dn(_(g)[0]));function d(e){return Ee(e),f[0]?f[0].focus():null}(n=e,o=Mn(t),r=o.indexOf(t.activeElement),i=n.shiftKey?r-1:r+1,l=o[i],a=on(ge(l,O)),s=nn(ge(l,h)),a||s)&&(u?null==ge(u,g+","+g+" "+k)&&(u=d(e)):d(e),(!c&&u==f[f.length-1]||c&&u==f[0])&&Ee(e))}(e):Ae(n,"textarea")||Ae(n,"input")||Ae(n,"select")||"true"===n.getAttribute("contentEditable")||""===n.getAttribute("contentEditable")||!Z.keyboardScrolling||!Z.autoScrolling||([40,38,32,33,34].indexOf(o)>-1&&Ee(e),Ie=e.ctrlKey,Ke=setTimeout(function(){!function(e){var t=e.shiftKey;if(Ve||!([37,39].indexOf(e.keyCode)<0))switch(e.keyCode){case 38:case 33:Ze.k.up&&Mt();break;case 32:if(t&&Ze.k.up){Mt();break}case 40:case 34:Ze.k.down&&Tt();break;case 36:Ze.k.up&&kt(1);break;case 35:Ze.k.down&&kt(_(h).length);break;case 37:Ze.k.left&&Ht();break;case 39:Ze.k.right&&Ct()}}(e)},150))}function xn(e){We&&(Ie=e.ctrlKey)}function Ln(e){2==e.which&&(gt=e.pageY,Pe.addEventListener("mousemove",On))}function An(e){2==e.which&&Pe.removeEventListener("mousemove",On)}function Mn(e){return[].slice.call(_(ot,e)).filter(function(e){return"-1"!==e.getAttribute("tabindex")&&null!==e.offsetParent})}function Tn(){We=!1,Ie=!1}function On(e){Ve&&(e.pageY<gt&&Ze.m.up?Mt():e.pageY>gt&&Ze.m.down&&Tt()),gt=e.pageY}function kn(e,t,n){var o=ge(e,h),r={slides:e,destiny:t,direction:n,destinyPos:{left:t.offsetLeft},slideIndex:ie(t),section:o,sectionIndex:ie(o,h),anchorLink:o.getAttribute("data-anchor"),slidesNav:_(j,o)[0],slideAnchor:_n(t),prevSlide:_(k,o)[0],prevSlideIndex:ie(_(k,o)[0]),localIsResizing:De};r.xMovement=Yn(r.prevSlideIndex,r.slideIndex),r.localIsResizing||(Ve=!1),ro("parallax","applyHorizontal",r),Z.onSlideLeave&&!r.localIsResizing&&"none"!==r.xMovement&&xe(Z.onSlideLeave)&&!1===tn("onSlideLeave",r)?Be=!1:(ue(t,c),fe(ye(t),c),r.localIsResizing||(fn(r.prevSlide),sn(t)),Cn(r),J(o,c)&&!r.localIsResizing&&Fn(r.slideIndex,r.slideAnchor,r.anchorLink,r.sectionIndex),ve.continuousHorizontal&&ve.continuousHorizontal.apply(r),lo()?Hn(r):Rn(e,r,!0),Z.interlockedSlides&&ve.interlockedSlides&&(oo("continuousHorizontal")&&void 0!==n&&n!==r.xMovement||ve.interlockedSlides.apply(r)))}function Cn(e){!Z.loopHorizontal&&Z.controlArrows&&(Me(_(X,e.section),0!==e.slideIndex),Me(_(F,e.section),null!=oe(e.destiny)))}function Hn(e){var t,n;ve.continuousHorizontal&&ve.continuousHorizontal.afterSlideLoads(e),t=e.slidesNav,n=e.slideIndex,Z.slidesNavigation&&null!=t&&(fe(_(u,t),c),ue(_("a",_("li",t)[n]),c)),e.localIsResizing||(ro("parallax","afterSlideLoads"),xe(Z.afterSlideLoad)&&tn("afterSlideLoad",e),Ve=!0,cn(e.destiny)),Be=!1,oo("interlockedSlides")&&ve.interlockedSlides.apply(e)}function Rn(e,t,n){var o=t.destinyPos;if(Z.css3){var r="translate3d(-"+Math.round(o.left)+"px, 0px, 0px)";ve.test.translate3dH[t.sectionIndex]=r,q(Bn(_(I,e)),eo(r)),_e=setTimeout(function(){n&&Hn(t)},Z.scrollingSpeed)}else ve.test.left[t.sectionIndex]=Math.round(o.left),co(e,Math.round(o.left),Z.scrollingSpeed,function(){n&&Hn(t)})}function In(){if(Le(Pe,"onResize"),zn(),Ne){var e=t.activeElement;if(!Ae(e,"textarea")&&!Ae(e,"input")&&!Ae(e,"select")){var n=K();Math.abs(n-mt)>20*Math.max(mt,n)/100&&(Rt(!0),mt=n)}}else clearTimeout(Fe),Fe=setTimeout(function(){Rt(!0)},350)}function zn(){var t=Z.responsive||Z.responsiveWidth,n=Z.responsiveHeight,o=t&&e.innerWidth<t,r=n&&e.innerHeight<n;t&&n?It(o||r):t?It(o):n&&It(r)}function Bn(e){var t="all "+Z.scrollingSpeed+"ms "+Z.easingcss3;return fe(e,i),q(e,{"-webkit-transition":t,transition:t})}function Nn(e){return ue(e,i)}function jn(e,t){var n,o,r,i;n=e,o=_(Z.menu)[0],Z.menu&&null!=o&&(fe(_(u,o),c),ue(_('[data-menuanchor="'+n+'"]',o),c)),r=e,i=t,Z.navigation&&null!=_(E)[0]&&(fe(_(u,_(E)[0]),c),ue(r?_('a[href="#'+r+'"]',_(E)[0]):_("a",_("li",_(E)[0])[i]),c))}function Pn(e){var t=ie(_(g)[0],h),n=ie(e,h);return t==n?"none":t>n?"up":"down"}function Yn(e,t){return e==t?"none":e>t?"left":"right"}function Dn(e){if(!J(e,z)){var n=t.createElement("div");n.className=m,n.style.height=Wn(e)+"px",ue(e,z),he(e,n)}}function Wn(e){var t=Yt(e);if(Z.paddingTop||Z.paddingBottom){var n=e;J(n,p)||(n=ge(e,h)),t-=parseInt(getComputedStyle(n)["padding-top"])+parseInt(getComputedStyle(n)["padding-bottom"])}return t}function Vn(e,t){t?Bn(Pe):Nn(Pe),clearTimeout(qe),q(Pe,eo(e)),ve.test.translate3d=e,qe=setTimeout(function(){fe(Pe,i)},10)}function Xn(e){var t=_(h+'[data-anchor="'+e+'"]',Pe)[0];if(!t){var n=void 0!==e?e-1:0;t=_(h)[n]}return t}function Zn(e,t){var n=Xn(e);if(null!=n){var o,r,i,l=(null==(i=_(O+'[data-anchor="'+(o=t)+'"]',r=n)[0])&&(o=void 0!==o?o:0,i=_(O,r)[o]),i);_n(n)===be||J(n,c)?Gn(l):en(n,function(){Gn(l)})}}function Gn(e){null!=e&&kn(ge(e,H),e)}function Fn(e,t,n,o){var r="";Z.anchors.length&&!Z.lockAnchors&&(e?(null!=n&&(r=n),null==t&&(t=e),ke=t,Un(r+"/"+t)):null!=e?(ke=t,Un(n)):Un(n)),Qn()}function Un(t){if(Z.recordHistory)location.hash=t;else if(Ne||je)e.history.replaceState(void 0,void 0,"#"+t);else{var n=e.location.href.split("#")[0];e.location.replace(n+"#"+t)}}function _n(e){if(!e)return null;var t=e.getAttribute("data-anchor"),n=ie(e);return null==t&&(t=n),t}function Qn(){var e=_(g)[0],t=_(k,e)[0],n=_n(e),o=_n(t),r=String(n);t&&(r=r+"-"+o),r=r.replace("/","-").replace("#","");var i=new RegExp("\\b\\s?"+s+"-[^\\s]+\\b","g");ce.className=ce.className.replace(i,""),ue(ce,s+"-"+r)}function Jn(){return e.PointerEvent?{down:"pointerdown",move:"pointermove"}:{down:"MSPointerDown",move:"MSPointerMove"}}function Kn(e){var t=[];return t.y=void 0!==e.pageY&&(e.pageY||e.pageX)?e.pageY:e.touches[0].pageY,t.x=void 0!==e.pageX&&(e.pageY||e.pageX)?e.pageX:e.touches[0].pageX,je&&Ut(e)&&Z.scrollBar&&void 0!==e.touches&&(t.y=e.touches[0].pageY,t.x=e.touches[0].pageX),t}function qn(e,t){wt(0,"internal"),void 0!==t&&(De=!0),kn(ge(e,H),e),void 0!==t&&(De=!1),wt(rt.scrollingSpeed,"internal")}function $n(e){var t=Math.round(e);if(Z.css3&&Z.autoScrolling&&!Z.scrollBar)Vn("translate3d(0px, -"+t+"px, 0px)",!1);else if(Z.autoScrolling&&!Z.scrollBar)q(Pe,{top:-t+"px"}),ve.test.top=-t+"px";else{var n=rn(t);uo(n.element,n.options)}}function eo(e){return{"-webkit-transform":e,"-moz-transform":e,"-ms-transform":e,transform:e}}function to(e,t,n){"all"!==t?Ze[n][t]=e:Object.keys(Ze[n]).forEach(function(t){Ze[n][t]=e})}function no(e){return q(e,{"-webkit-transition":"none",transition:"none"})}function oo(e){return null!==Z[e]&&"[object Array]"===Object.prototype.toString.call(Z[e])?Z[e].length&&ve[e]:Z[e]&&ve[e]}function ro(e,t,n){if(oo(e))return ve[e][t](n)}function io(){return oo("dragAndMove")&&ve.dragAndMove.isAnimating}function lo(){return oo("dragAndMove")&&ve.dragAndMove.isGrabbing}function ao(e,t,n){Z[e]=t,"internal"!==n&&(rt[e]=t)}function so(){$||(U("error","Fullpage.js version 3 has changed its license to GPLv3 and it requires a `licenseKey` option. Read about it here:"),U("error","https://github.com/alvarotrigo/fullPage.js#options.")),J(_("html"),a)?U("error","Fullpage.js can only be initialized once and you are doing it multiple times!"):(Z.continuousVertical&&(Z.loopTop||Z.loopBottom)&&(Z.continuousVertical=!1,U("warn","Option `loopTop/loopBottom` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled")),!Z.scrollOverflow||!Z.scrollBar&&Z.autoScrolling||U("warn","Options scrollBar:true and autoScrolling:false are mutually exclusive with scrollOverflow:true. Sections with scrollOverflow might not work well in Firefox"),!Z.continuousVertical||!Z.scrollBar&&Z.autoScrolling||(Z.continuousVertical=!1,U("warn","Scroll bars (`scrollBar:true` or `autoScrolling:false`) are mutually exclusive with `continuousVertical`; `continuousVertical` disabled")),Z.scrollOverflow&&null==Z.scrollOverflowHandler&&(Z.scrollOverflow=!1,U("error","The option `scrollOverflow:true` requires the file `scrolloverflow.min.js`. Please include it before fullPage.js.")),Z.anchors.forEach(function(e){var t=[].slice.call(_("[name]")).filter(function(t){return t.getAttribute("name")&&t.getAttribute("name").toLowerCase()==e.toLowerCase()}),n=[].slice.call(_("[id]")).filter(function(t){return t.getAttribute("id")&&t.getAttribute("id").toLowerCase()==e.toLowerCase()});(n.length||t.length)&&(U("error","data-anchor tags can not have the same value as any `id` element on the site (or `name` element for IE)."),n.length&&U("error",'"'+e+'" is is being used by another element `id` property'),t.length&&U("error",'"'+e+'" is is being used by another element `name` property'))}))}function co(t,n,o,r){var i,l=(i=t).self!=e&&J(i,C)?i.scrollLeft:!Z.autoScrolling||Z.scrollBar?we():i.offsetTop,a=n-l,s=0;$e=!0;var c=function(){if($e){var i=n;s+=20,o&&(i=e.fp_easings[Z.easing](s,l,a,o)),uo(t,i),s<o?setTimeout(c,20):void 0!==r&&r()}else s<o&&r()};c()}function uo(t,n){!Z.autoScrolling||Z.scrollBar||t.self!=e&&J(t,C)?t.self!=e&&J(t,C)?t.scrollLeft=n:t.scrollTo(0,n):t.style.top=n+"px"}function fo(e,t){this.anchor=e.getAttribute("data-anchor"),this.item=e,this.index=ie(e,t),this.isLast=this.index===_(t).length-1,this.isFirst=!this.index}function vo(e){fo.call(this,e,h)}so()}}),window.jQuery&&window.fullpage&&function(e,t){"use strict";e&&t?e.fn.fullpage=function(n){var o=new t("#"+e(this).attr("id"),n);Object.keys(o).forEach(function(t){e.fn.fullpage[t]=o[t]})}:window.fp_utils.showError("error","jQuery is required to use the jQuery fullpage adapter!")}(window.jQuery,window.fullpage);
/*!
 * fullpage.js Parallax Effect Extension 0.1.4 for fullPage.js v3
 * https://github.com/alvarotrigo/fullPage.js
 *
 * @license This code has been bought from www.alvarotrigo.com/fullPage/extensions/ and it is not free to use or distribute.
 * Copyright (C) 2016 alvarotrigo.com - A project by Alvaro Trigo
 */
window.fp_parallaxExtension=function(){var e,t,n,o,i,a,r,l,s,f,c=this,d=fp_utils,u=fp_utils.$,p=fullpage_api.getFullpageData(),v=p.options,m=p.internals,g=".fullpage-wrapper",x="active",h="."+x,E=".fp-section",b=E+h,S="fp-slide",y="."+S,L=y+h,w="fp-notransition",A=".fp-bg",M="reveal",R="cover",C="fp-parallax-stylesheet",N="fp-parallax-transitions",T="#"+N,I="fp-parallax-transition-class",z="#"+I,O=0,B=!1,H=!1,F=!0,k=!0,q=!1,W=!1,_=!1,V=!1,G=!1,X=!0===v.parallax||"slides"===v.parallax,Y=d.closest,D=d.addClass,P=d.removeClass,U=d.hasClass,$=d.css,j=d.nextAll,J=d.prevAll;function K(e){return{cover:{offsetNormal:e?0:t},reveal:{offsetNormal:e?-t:0}}}function Q(e){return{cover:{offsetNormal:e?0:n},reveal:{offsetNormal:e?-n:0}}}function Z(e){return e*o/100}function ee(e){return e*i/100}function te(){return window.innerWidth||document.documentElement.clientWidth||document.getElementsByTagName("body")[0].clientWidth}function ne(){r&&ye(u(b).length?u(b)[0]:u(E)[0],0)}function oe(){var t=u(b).length?u(b)[0]:u(E)[0],n=e===M,o=n?j(t):J(t),i=n?J(t):j(t);o.forEach(function(t){ye(t,K(n)[e].offsetNormal,"silent")}),i.forEach(function(e){ye(e,0,"silent")}),X&&u(E).forEach(function(e){u(y,e).length&&ie(u(L,e).length?u(L,e)[0]:u(y,e)[0])})}function ie(t){var n=e===M,o=n?j(t):J(t),i=n?J(t):j(t);o.forEach(function(t){Le(t,Q(n)[e].offsetNormal,"silent")}),i.forEach(function(e){Le(e,0,"silent")})}function ae(e){var t=e.detail;i=te(),t&&!v.scrollBar?(me(),ge()):xe()}function re(e){c.destroy(),q=!1}function le(){var e=v.verticalCentered?".fp-tableCell":".fp-scrollable";u(e).forEach(function(e){var t=u(A,e)[0];u(".fp-scrollable",e).length&&null!=t&&d.prependTo(e.parentNode,t)})}function se(e){e.detail?xe():V=!0}function fe(e){e.detail,u(A).forEach(function(e){e.setAttribute("data-final-x",0),e.setAttribute("data-final-y",0)}),a=u(E),oe()}function ce(e){var t=e.detail;G=!0,ye(t,0,"silent");var n=u(y,t);n.length&&n.forEach(function(e){ye(e,0,"silent")}),H=!0}function de(e){var t=e.detail;c.afterSlideLoads(u(y,t)[0]),G=!1}function ue(e){var t=e.detail;W=!0,ie("left"===t.xMovement?u(y,u(b)[0])[0]:d.last(u(y,u(b)[0]))),setTimeout(function(){c.applyHorizontal(t)})}function pe(e){var t=e.detail;_=!0,oe(),setTimeout(function(){c.apply(t)})}function ve(){q&&(v.scrollBar||!v.autoScrolling||m.usingExtension("dragAndMove"))&&function(){var n=m.usingExtension("dragAndMove")?Math.abs(window.fp_dragAndMoveExtension.getCurrentScroll()):d.getScrollTop(),i=O>n,r=d.index(u(b)[0],E),l=o+n;O=n;for(var s=0;s<a.length;++s){var f=a[s],c=o+f.offsetTop;!i&&f.offsetTop<=l?r=s:i&&c>=n&&f.offsetTop<n&&a.length>s+1&&(r=s+1)}var p=(o-(a[r].offsetTop-n))*t/o;e!==M&&(r-=1);var v=e!==M?p:-t+p;r>-1&&ye(u(E)[r],v),r-1>=0&&ye(a[r-1],K(!1)[e].offsetNormal),void 0!==a[r+1]&&ye(a[r+1],K(!0)[e].offsetNormal)}()}function me(){var e=".fp-bg{transition: transform "+v.scrollingSpeed+"ms "+v.easingcss3+";}.fp-slide, .fp-section{transition: background-position "+v.scrollingSpeed+"ms "+v.easingcss3+";}";v.autoScrolling&&!v.scrollBar&&we(N,e)}function ge(){var e=".fp-bg-animate{ transition: all "+v.scrollingSpeed+"ms "+v.easingcss3+"}";we(I,e)}function xe(){d.remove(u(T))}function he(){clearTimeout(f),f=setTimeout(Ee,350)}function Ee(){o=d.getWindowHeight(),i=te(),t=Z(v.parallaxOptions.percentage),n=ee(v.parallaxOptions.percentage),ne(),oe(),be()}function be(){$(u(A),{height:o+"px"})}function Se(e){return Math.round(2*e)/2}function ye(e,t,n){var o=Se(t),i=u(y,e);if(i.length){var a=u(L,e)[0];e=null!=a?a:i[0]}if(r)$(e,{"background-position-y":o+"px"});else if(!U(e,S)||U(e,x)||void 0!==n){var l=u(A,e)[0];if(l){var s=null!=l.getAttribute("data-final-x")?l.getAttribute("data-final-x"):0;d.toggleClass(l,w,void 0!==n),$(l,{transform:"translateX("+s+"px) translateY("+o+"px)"}),l.setAttribute("data-final-x",s),l.setAttribute("data-final-y",o)}}}function Le(e,t,n){var o=Se(t),i=r?e:u(A,e)[0];if(i)if(!v.scrollBar&&v.autoScrolling||D(i,"fp-bg-animate"),r)d.toggleClass(i,w,void 0!==n),$(i,{"background-position-x":o+"px"});else{var a=0,l=i.getAttribute("data-final-y");"none"!==l&&null!=l&&(a=l),d.toggleClass(i,w,void 0!==n||G),$(i,{transform:"translateX("+o+"px) translateY("+a+"px)"}),i.setAttribute("data-final-x",o),i.setAttribute("data-final-y",a)}}function we(e,t){if(!u("#"+e).length){var n=document.head||document.getElementsByTagName("head")[0];d.appendTo((o=e,i=t,(a=document.createElement("style")).type="text/css",a.id=o,a.styleSheet?a.styleSheet.cssText=i:a.appendChild(document.createTextNode(i)),a),n)}var o,i,a}s=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,window.requestAnimationFrame=s,c.apply=function(t){if(V&&me(),!t.localIsResizing&&!v.scrollBar&&v.autoScrolling)if(("up"===t.yMovement||t.sectionIndex)&&(!t.isMovementUp||t.leavingSection-1)||!v.continuousVertical||_){var n=K(B="up"===t.yMovement)[e].offsetNormal;ye(u(E)[t.sectionIndex],0),ye(u(E)[t.leavingSection-1],n),F=1===Math.abs(t.leavingSection-1-t.sectionIndex);for(var o=Math.min(t.leavingSection-1,t.sectionIndex)+1;o<Math.max(t.leavingSection-1,t.sectionIndex);o++)ye(u(E)[o],0,"silent")}else;},c.applyHorizontal=function(t){if(X&&(!t.localIsResizing||G)&&"none"!=t.xMovement)if((l=void 0!==t.direction&&t.direction!==t.xMovement)&&v.continuousHorizontal&&!W)l=!1;else{var n=Q(H=l?"left"===t.direction:"left"===t.xMovement)[e].offsetNormal;if(Le(u(y,t.section)[t.slideIndex],0),Le(u(y,t.section)[t.prevSlideIndex],n),!(k=1===Math.abs(t.slideIndex-t.prevSlideIndex))&&!G)for(var o=Math.min(t.slideIndex,t.prevSlideIndex)+1;o<Math.max(t.slideIndex,t.prevSlideIndex);o++)Le(u(y,t.section)[o],0,"silent")}},c.init=function(){var l;o=d.getWindowHeight(),i=te(),e=v.parallaxOptions.type,t=Z(v.parallaxOptions.percentage),n=ee(v.parallaxOptions.percentage),a=u(v.sectionSelector),r="background"===v.parallaxOptions.property,be(),(l=u(g)[0]).addEventListener("setAutoScrolling",ae),l.addEventListener("destroy",re),l.addEventListener("onScroll",ve),l.addEventListener("afterResponsive",fe),l.addEventListener("onGrab",se),l.addEventListener("onContinuousVertical",pe),l.addEventListener("onResize",he),l.addEventListener("afterRender",le),l.addEventListener("afterRebuild",le),l.addEventListener("onResetSliders",ce),X&&(l.addEventListener("onContinuosHorizontal",ue),l.addEventListener("onEndResetSliders",de)),r||(we(C,".fp-bg{top:0;bottom:0;width: 100%;position:absolute;z-index: -1;}.fp-section, .fp-slide, .fp-section.fp-table, .fp-slide.fp-table, .fp-section .fp-tableCell, .fp-slide .fp-tableCell {position:relative;overflow: hidden;}"),me()),ge(),ne(),oe(),q=!0},c.destroy=function(){xe(),d.remove(u(z)),t=Z(0),n=ee(0),oe(),d.css(u(A),{height:""}),clearTimeout(f);var e=u(g)[0];e.removeEventListener("setAutoScrolling",ae),e.removeEventListener("destroy",re),e.removeEventListener("onScroll",ve),e.removeEventListener("afterResponsive",fe),e.removeEventListener("onGrab",se),e.removeEventListener("onContinuousVertical",pe),e.removeEventListener("onResize",he),e.removeEventListener("afterRender",le),e.removeEventListener("afterRebuild",le),e.removeEventListener("onResetSliders",ce),X&&(e.removeEventListener("onContinuosHorizontal",ue),e.removeEventListener("onEndResetSliders",de))},c.setOption=function(o,i){"offset"===o?(v.parallaxOptions.percentage=i,t=Z(i),n=ee(i)):"type"===o&&(v.parallaxOptions.type=i,e=i),oe()},c.applyProperties=ye,c.afterSlideLoads=function(t){var n,o=void 0!==t?t:u(L,u(b)[0])[0],i=Y(o,E);if((r?(n=i,u(y,n).length?u(y,n):[n]):u(A,i)).forEach(function(e){P(e,"fp-bg-animate")}),(W||l)&&(ie(o),W=!1),!k){var a=Q(H)[e].offsetNormal,s=o,f=H?j(s):J(s);(e===M&&H||e===R&&!H||G)&&f.forEach(function(e){Le(e,a,"silent")})}},c.afterLoad=function(){if((!v.scrollBar||!v.autoScrolling||m.usingExtension("dragAndMove"))&&((_||l)&&(oe(),_=!1),!F)){var t=K(B)[e].offsetNormal,n=B?j(u(b)[0]):J(u(b)[0]);(e===M&&B||e===R&&!B)&&n.forEach(function(e){ye(e,t,"silent")})}},c.c=m.c;var Ae=c["common".charAt(0)];return"complete"===document.readyState&&Ae("parallax"),window.addEventListener("load",function(){Ae("parallax")}),c};
//set animation timing
var animationDelay = 2500,
    //loading bar effect
    barAnimationDelay = 3800,
    barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
    //letters effect
    lettersDelay = 50,
    //type effect
    typeLettersDelay = 15000,
    selectionDuration = 500,
    typeAnimationDelay = selectionDuration + 800,
    //clip effect
    revealDuration = 600,
    revealAnimationDelay = 3000;
initHeadline();

function initHeadline() {
    //insert <i> element for each letter of a changing word
    singleLetters($('.shift.letters').find('b'));
    //initialise headline animation
    animateHeadline($('.word-shift'));
}

function singleLetters($words) {
    $words.each(function(){
        var word = $(this),
            letters = word.text().split(''),
            selected = word.hasClass('is-visible');
        for (i in letters) {
            if(word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
            letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>': '<i>' + letters[i] + '</i>';
        }
        var newLetters = letters.join('');
        word.html(newLetters).css('opacity', 1);
    });
}

function animateHeadline($headlines) {
    var duration = animationDelay;
    $headlines.each(function(){
        var headline = $(this);

        if(headline.hasClass('loading-bar')) {
            duration = barAnimationDelay;
            setTimeout(function(){ headline.find('.word-shift').addClass('is-loading') }, barWaiting);
        } else if (headline.hasClass('clip')){
            var spanWrapper = headline.find('.word-shift'),
                newWidth = spanWrapper.width() + 10
            spanWrapper.css('width', newWidth);
        } else if (!headline.hasClass('type') ) {
            //assign to .word-shift the width of its longest word
            var words = headline.find('.word-shift b'),
                width = 0;
            words.each(function(){
                var wordWidth = $(this).width();
                if (wordWidth > width) width = wordWidth;
            });
            headline.find('.word-shift').css('width', width);
        };

        //trigger animation
        setTimeout(function(){ hideWord( headline.find('.is-visible').eq(0) ) }, duration);
    });
}

function hideWord($word) {
    var nextWord = takeNext($word);

    if($word.parents('.shift').hasClass('type')) {
        var parentSpan = $word.parent('.word-shift');
        parentSpan.addClass('selected').removeClass('waiting');
        setTimeout(function(){
            parentSpan.removeClass('selected');
            $word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
        }, selectionDuration);
        setTimeout(function(){ showWord(nextWord, typeLettersDelay) }, typeAnimationDelay);

    } else if($word.parents('.shift').hasClass('letters')) {
        var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
        hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
        showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

    }  else if($word.parents('.shift').hasClass('clip')) {
        $word.parents('.word-shift').animate({ width : '2px' }, revealDuration, function(){
            switchWord($word, nextWord);
            showWord(nextWord);
        });

    } else if ($word.parents('.shift').hasClass('loading-bar')){
        $word.parents('.word-shift').removeClass('is-loading');
        switchWord($word, nextWord);
        setTimeout(function(){ hideWord(nextWord) }, barAnimationDelay);
        setTimeout(function(){ $word.parents('.word-shift').addClass('is-loading') }, barWaiting);

    } else {
        switchWord($word, nextWord);
        setTimeout(function(){ hideWord(nextWord) }, animationDelay);
    }
}

function showWord($word, $duration) {
    if($word.parents('.shift').hasClass('type')) {
        showLetter($word.find('i').eq(0), $word, false, $duration);
        $word.addClass('is-visible').removeClass('is-hidden');

    }  else if($word.parents('.shift').hasClass('clip')) {
        $word.parents('.word-shift').animate({ 'width' : $word.width() + 10 }, revealDuration, function(){
            setTimeout(function(){ hideWord($word) }, revealAnimationDelay);
        });
    }
}

function takeNext($word) {
    return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
}

function takePrev($word) {
    return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
}

function switchWord($oldWord, $newWord) {
    $oldWord.removeClass('is-visible').addClass('is-hidden');
    $newWord.removeClass('is-hidden').addClass('is-visible');
}