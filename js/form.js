'use strict';

(function () {

  var SYNC_HOUSE_TYPES = ['bungalo', 'flat', 'house', 'palace'];
  var SYNC_ROOM_PRICES = [0, 1000, 5000, 10000];
  var SYNC_GUESTS = [['1'], ['1', '2'], ['1', '2', '3'], ['0']];
  var SYNC_ROOMS = ['1', '2', '3', '100'];
  var SYNC_TIME_IN_HOURS = ['12:00', '13:00', '14:00'];
  var SYNC_TIME_OUT_HOURS = ['12:00', '13:00', '14:00'];

  var noticeForm = document.querySelector('.notice__form');
  var fieldSetList = document.querySelectorAll('fieldset');


  window.form = {
    enableForm: function (flagEnable) {
      if (flagEnable) {
        noticeForm.classList.remove('notice__form--disabled');
        avatarPhoto.addEventListener('dragenter', onDragEnter, false);
        avatarPhoto.addEventListener('dragleave', onDragLeave, false);
        avatarPhoto.addEventListener('dragover', onDragOver, false);
        avatarPhoto.addEventListener('drop', onDrop, false);
        photoDropZone.addEventListener('dragover', onDragOver, false);
        photoDropZone.addEventListener('dragenter', onDragEnter, false);
        photoDropZone.addEventListener('dragleave', onDragLeave, false);
        photoDropZone.addEventListener('drop', onImagesDrop, false);
        avatarInput.addEventListener('change', onPullAvatarImage);
        housePhotosInput.addEventListener('change', onPullHouseImages);
      } else {
        noticeForm.classList.add('notice__form--disabled');
      }
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

  var avatarContainer = document.querySelector('.notice__preview');
  var avatarPhoto = document.querySelector('.notice__header').querySelector('label.drop-zone');
  var photoContainer = document.querySelector('.form__photo-container');
  var photoDropZone = photoContainer.querySelector('label.drop-zone');
  var divContainer = photoContainer.querySelector('div.container');
  var housePhotosInput = document.querySelector('input#images');
  var avatarInput = document.querySelector('input#avatar');

  function onDragEnter(evt) {
    evt.target.style.backgroundColor = 'pink';
    evt.stopPropagation();
    evt.preventDefault();

  }

  function onDragLeave(evt) {
    evt.target.style.backgroundColor = '';
  }

  function onDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
  }

  function onDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.target.style.backgroundColor = '';
    var dt = evt.dataTransfer;
    if (dt.files.length > 0) {
      var file = dt.files[0];
      setAvatarPhoto(file, avatarContainer);
    }
  }

  function onPullAvatarImage() {
    var fileInput = document.querySelector('input#avatar');
    if (fileInput.files.length > 0) {
      var file = fileInput.files[0];
      setAvatarPhoto(file, avatarContainer);
    }
  }

  function setAvatarPhoto(file, container) {
    var img = container.querySelector('img');
    readPhotoFiles(file, img);
  }

  function onImagesDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.target.style.backgroundColor = '';
    var dt = evt.dataTransfer;
    var files = dt.files;
    putImagesToContainer(files, divContainer);
  }

  function putImagesToContainer(files, container) {
    for (i = 0; i < files.length; i++) {
      var file = files[i];
      var li = document.createElement('li');
      var img = document.createElement('img');
      li.appendChild(img);
      container.appendChild(li);
      readPhotoFiles(file, img);
    }
  }

  function onPullHouseImages() {
    var fileInput = document.querySelector('input#images');
    putImagesToContainer(fileInput.files, divContainer);
  }


  function readPhotoFiles(file, img) {
    img.file = file;
    var reader = new FileReader();
    reader.onload = (function (aImg) {
      return function (evt) {
        aImg.src = evt.target.result;
      };
    })(img);
    reader.readAsDataURL(file);
  }

  function onFormReset() {
    avatarContainer.querySelector('img').src = 'img/muffin.png';
    photoContainer.querySelector('div.container').textContent = '';
  }

  form.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(form), function () {
      form.reset();
      onFormReset();
    }, window.util.onError);
    evt.preventDefault();
  });

  var resetButton = document.querySelector('button.form__reset');
  resetButton.addEventListener('click', onFormReset);

})();
