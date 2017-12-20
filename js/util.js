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
    getRandom: function (min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    createRange: function (min, max) {
      var range = [];
      for (var i = min; i <= max; i++) {
        range.push(i);
      }
      return range;
    },
    getRandomRange: function (arr, n) {
      var randomRange = [];
      var clonedArr = arr.slice();
      for (var i = 0; i < n; i++) {
        var elemIndex = window.util.getRandom(0, clonedArr.length);
        randomRange.push(clonedArr[elemIndex]);
        clonedArr.splice(elemIndex, 1);
      }
      return randomRange;
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
