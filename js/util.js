'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var TIMER = 500;
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
      divForError.className = 'error__popup';
      divForError.textContent = errorMessage;
      document.body.appendChild(divForError);
    },
    notifyOnSuccess: function () {
      var divForSuccess = document.createElement('div');
      divForSuccess.className = 'success__popup';
      divForSuccess.textContent = 'Ваше объявление успешно отправлено';
      document.body.appendChild(divForSuccess);
      setTimeout(window.util.closeNotification, 1600);
    },
    closeNotification: function () {
      var div = document.querySelector('div.success__popup');
      document.body.removeChild(div);
    },
    debounce: function (funс) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(funс, TIMER);
    }
  };
})();
