'use strict';

(function () {

  var MAIN_PIN_HEIGHT = 65;
  var MAIN_PIN_POINT = 22;
  var mapElement = document.querySelector('.map');
  var mapPinMainElement = document.querySelector('.map__pin--main');
  var formElement = document.querySelector('.notice__form');
  var filtersContainerElement = document.querySelector('.map__filters-container');
  var pinsContainerElement = document.querySelector('.map__pins');

  function renderMapPinsBlock() {
    var offers = window.data.generateRandomOffers();
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < offers.length; i++) {
      var pinElement = window.pin.renderMapPin(offers[i]);
      var offer = offers[i];
      pinElement.addEventListener('click', (function (offerData, pin) {
        return function () {
          window.card.closePopup();
          window.pin.activatePin(pin);
          var popupElement = window.card.renderPopup(offerData);
          mapElement.insertBefore(popupElement, filtersContainerElement);
        };
      })(offer, pinElement));
      fragment.appendChild(pinElement);
    }
    return fragment;
  }

  function mapActivate() {
    mapElement.classList.remove('map--faded');
    formElement.classList.remove('notice__form--disabled');
    window.form.enableForm(true);

    pinsContainerElement.appendChild(renderMapPinsBlock());
    mapPinMainElement.removeEventListener('mouseup', mapActivate);
  }

  mapPinMainElement.addEventListener('mouseup', mapActivate);
  mapPinMainElement.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, mapActivate);
  });

  mapPinMainElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      var maxLimitY = 500;
      var minLimitY = 100;
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

      if (mainPinCoordX < leftLimitX) {
        mainPinCoordX = leftLimitX;
      } else if (mainPinCoordX > rightLimitX) {
        mainPinCoordX = rightLimitX;
      }

      mapPinMainElement.style.left = mainPinCoordX + 'px';

      if (pointCoordY > maxLimitY) {
        pointCoordY = maxLimitY;
      } else if (pointCoordY < minLimitY) {
        pointCoordY = minLimitY;
      }

      mapPinMainElement.style.top = (pointCoordY - deltaY) + 'px';
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      window.form.addressField.value = 'x: ' + mapPinMainElement.offsetLeft
        + ', y: ' + (mapPinMainElement.offsetTop + (MAIN_PIN_HEIGHT + MAIN_PIN_POINT));
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

})();

