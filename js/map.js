'use strict';

(function () {

  var MAIN_PIN_HEIGHT = 65;
  var MAIN_PIN_POINT = 22;
  var MAX_LIMIT_Y = 500;
  var MIN_LIMIT_Y = 100;
  var mapElement = document.querySelector('.map');
  var mapPinMainElement = document.querySelector('.map__pin--main');
  var formElement = document.querySelector('.notice__form');
  var pinsContainerElement = document.querySelector('.map__pins');
  var startCoords;

  mapPinMainElement.addEventListener('mouseup', mapActivate);
  mapPinMainElement.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, mapActivate);
  });

  function mapActivate() {
    mapElement.classList.remove('map--faded');
    formElement.classList.remove('notice__form--disabled');
    window.form.enableForm(true);
    window.backend.load(function (data) {
      window.util.offers = data;
      pinsContainerElement.appendChild(renderMapPinsBlock());
    },
    window.util.onError);

    mapPinMainElement.removeEventListener('mouseup', mapActivate);

    mapPinMainElement.addEventListener('mousedown', function (evt) {
      evt.preventDefault();
      startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      document.addEventListener('mousemove', onMouseMove);
    });

    document.addEventListener('mouseup', onMouseUp);
  }

  function renderMapPinsBlock() {
    var offers = window.util.offers;
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < offers.length; i++) {
      var pinElement = window.pin.renderMapPin(offers[i]);
      pinElement.dataset.offerIndex = i;
      pinElement.addEventListener('click', (function (pin) {
        return function () {
          window.showCard(pin);
        };
      })(pinElement));
      fragment.appendChild(pinElement);
    }
    return fragment;
  }

  function onMouseMove(moveEvt) {
    moveEvt.preventDefault();

    var leftLimitX = pinsContainerElement.clientLeft;
    var rightLimitX = pinsContainerElement.clientWidth;

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var mainPinCoordX = mapPinMainElement.offsetLeft - shift.x;
    var mainPinCoordY = mapPinMainElement.offsetTop - shift.y;

    var deltaY = MAIN_PIN_HEIGHT + MAIN_PIN_POINT;
    var pointCoordY = mainPinCoordY + deltaY;

    mapPinMainElement.style.left = Math.min(rightLimitX, Math.max(leftLimitX, mainPinCoordX)) + 'px';

    mapPinMainElement.style.top = (Math.min(MAX_LIMIT_Y, Math.max(MIN_LIMIT_Y, pointCoordY)) - deltaY) + 'px';
  }

  function onMouseUp(upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    window.form.addressField.value = 'x: ' + mapPinMainElement.offsetLeft
      + ', y: ' + (mapPinMainElement.offsetTop + (MAIN_PIN_HEIGHT + MAIN_PIN_POINT));
  }
})();

