'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeout;

  window.util = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },
    onError: function (errorMessage) {
      var divForError = document.createElement('div');
      var header = document.querySelector('header');
      divForError.className = 'error__popup';
      divForError.textContent = errorMessage;
      document.body.insertBefore(divForError, header);
    },
    debounce: function (funс) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(funс, DEBOUNCE_INTERVAL);
    }
  };
})();
