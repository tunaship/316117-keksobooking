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
    },
    addressField: document.querySelector('input#address')
  };

  window.form.enableForm(false);

  var timeInField = document.querySelector('select#timein');
  var timeOutField = document.querySelector('select#timeout');

  window.syncronizeFields(timeInField, timeOutField, SYNC_TIME_IN_HOURS, SYNC_TIME_OUT_HOURS, function (field, val) {
    field.value = val;
  });

  window.syncronizeFields(timeOutField, timeInField, SYNC_TIME_OUT_HOURS, SYNC_TIME_IN_HOURS, function (field, val) {
    field.value = val;
  });

  var houseTypeField = document.querySelector('select#type');
  var roomPriceField = document.querySelector('input#price');

  window.syncronizeFields(houseTypeField, roomPriceField, SYNC_HOUSE_TYPES, SYNC_ROOM_PRICES, function (field, val) {
    field.min = val;
  });

  var roomNumberField = document.querySelector('select#room_number');
  var guestNumberField = document.querySelector('select#capacity');

  window.syncronizeFields(roomNumberField, guestNumberField, SYNC_ROOMS,
      SYNC_GUESTS, function (field, val) {
        for (var i = 0; i < guestNumberField.length; i++) {
          var guestOption = guestNumberField.children[i];
          guestOption.style.display = (val.indexOf(guestOption.value) !== -1) ? 'block' : 'none';
        }
        if (val.indexOf(guestNumberField.value) === -1) {
          guestNumberField.value = val[0];
        }
      });
  var form = document.querySelector('.notice__form');
  var formFields = form.querySelectorAll('input, select, textarea');

  for (var i = 0; i < formFields.length; i++) {
    formFields[i].addEventListener('invalid', onInvalidInput);
  }

  function onInvalidInput(evt) {
    evt.target.style.border = 'dotted 2px #ff5635';
  }

  form.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(form), function () {
      form.reset();
    }, window.util.onError);
    evt.preventDefault();
  });

  var avatarContainer = document.querySelector('.notice__preview');
  var avatarPhoto = document.querySelector('label.drop-zone');
  avatarPhoto.addEventListener('dragenter', onDragEnter, false);
  avatarPhoto.addEventListener('dragover', onDragOver, false);
  avatarPhoto.addEventListener('drop', function (evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var dt = evt.dataTransfer;
    var files = dt.files;
    handleFiles(files, avatarContainer);
    evt.target.classList.add('hidden');
  }, false);

  function onDragEnter(evt) {
    evt.target.style.backgroundColor = 'pink';
    evt.stopPropagation();
    evt.preventDefault();
  }
  function onDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
  }

  function handleFiles(files, container) { // планируется универсальной, в т.ч. для фоток жилья
    for (i = 0; i < files.length; i++) {
      var file = files[i];
      var img = container.querySelector('img');
      img.file = file;

      var reader = new FileReader();
      reader.onload = (function (aImg) {
        return function (evt) {
          aImg.src = evt.target.result;
        };
      })(img);
      reader.readAsDataURL(file);
    }
  }

})();
