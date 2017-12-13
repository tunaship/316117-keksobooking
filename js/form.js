'use strict';

(function () {

  var SYNC_HOUSE_TYPES = ['bungalo', 'flat', 'house', 'palace'];
  var SYNC_ROOM_PRICES = [0, 1000, 5000, 10000];
  var SYNC_GUESTS = [['1'], ['1', '2'], ['1', '2', '3'], ['0']];
  var SYNC_ROOMS = ['1', '2', '3', '100'];
  var SYNC_TIME_IN_HOURS = ['12:00', '13:00', '14:00'];
  var SYNC_TIME_OUT_HOURS = ['12:00', '13:00', '14:00'];

  var fieldSetList = document.querySelectorAll('fieldset');

  window.form = {
    enableForm: function (flagEnable) {
      for (var i = 0; i < fieldSetList.length; i++) {
        if (flagEnable) {
          fieldSetList[i].removeAttribute('disabled');
        } else {
          fieldSetList[i].setAttribute('disabled', '');
        }
      }
    }
  };

  window.form.enableForm(false);

  function syncronizeFields(fieldMaster, valuesMaster, fieldSub, valuesSub, syncCallback) {
    fieldMaster.addEventListener('input', setFieldsSync);
    function setFieldsSync() {
      var mv = fieldMaster.value;
      var index = valuesMaster.indexOf(mv);
      if (index !== -1) {
        var sv = valuesSub[index];
        syncCallback(fieldSub, sv);
      }
    }
    setFieldsSync();
  }

  var timeInField = document.querySelector('select#timein');
  var timeOutField = document.querySelector('select#timeout');

  syncronizeFields(timeInField, SYNC_TIME_IN_HOURS, timeOutField, SYNC_TIME_OUT_HOURS, function (field, val) {
    field.value = val;
  });

  syncronizeFields(timeOutField, SYNC_TIME_OUT_HOURS, timeInField, SYNC_TIME_IN_HOURS, function (field, val) {
    field.value = val;
  });

  var houseTypeField = document.querySelector('select#type');
  var roomPriceField = document.querySelector('input#price');

  syncronizeFields(houseTypeField, SYNC_HOUSE_TYPES,
      roomPriceField, SYNC_ROOM_PRICES, function (field, val) {
        field.min = val;
      });

  var roomNumberField = document.querySelector('select#room_number');
  var guestNumberField = document.querySelector('select#capacity');

  syncronizeFields(roomNumberField, SYNC_ROOMS,
      guestNumberField, SYNC_GUESTS, function (field, val) {
        for (var i = 0; i < guestNumberField.length; i++) {
          var guestOption = guestNumberField.children[i];
          guestOption.style.display = (val.indexOf(guestOption.value) !== -1) ? 'block' : 'none';
        }
        if (val.indexOf(guestNumberField.value) === -1) {
          guestNumberField.value = val[0];
        }
      });

  var formFieldElements = document.querySelector('.notice__form').querySelectorAll('input, select, textarea');

  for (var i = 0; i < formFieldElements.length; i++) {
    formFieldElements[i].addEventListener('invalid', onInvalidInput);
  }

  function onInvalidInput(evt) {
    evt.target.style.border = 'dotted 2px #ff5635';
  }

})();
