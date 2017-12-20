'use strict';

(function () {

  var MAIN_PIN_HEIGHT = 65;
  var MAIN_PIN_POINT = 22;
  var MAX_LIMIT_Y = 500;
  var MIN_LIMIT_Y = 100;
  var map = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');
  var form = document.querySelector('.notice__form');
  var pinsContainer = document.querySelector('.map__pins');
  var startCoords;

  mapPinMain.addEventListener('mouseup', mapActivate);
  mapPinMain.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, mapActivate);
  });

  function onDataLoad(data) {
    window.filter.offers = data;
    window.filter.setupFilters(function () {
      window.filter.filteredOffers = window.filter.applyFilter(data);
      renderMapPinsBlock();
    });
    window.filter.filteredOffers = window.filter.applyFilter(data);
    renderMapPinsBlock();
  }

  function mapActivate() {
    map.classList.remove('map--faded');
    form.classList.remove('notice__form--disabled');
    window.form.enableForm(true);
    window.backend.load(onDataLoad, window.util.onError);

    mapPinMain.removeEventListener('mouseup', mapActivate);

    mapPinMain.addEventListener('mousedown', function (evt) {
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
    var btns = pinsContainer.querySelectorAll('.map__pin');
    for (i = 0; i < btns.length; i++) {
      if (!btns[i].classList.contains('map__pin--main')) {
        pinsContainer.removeChild(btns[i]);
      }
    }
    var offers = window.filter.filteredOffers;
    window.pin.offers = offers.slice(0, 5);
    offers = window.pin.offers;
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < offers.length; i++) {
      var newPin = window.pin.renderMapPin(offers[i]);
      newPin.dataset.offerIndex = i;
      newPin.addEventListener('click', (function (pin) {
        return function () {
          window.showCard(pin);
        };
      })(newPin));
      fragment.appendChild(newPin);
    }
    pinsContainer.appendChild(fragment);
  }

  function onMouseMove(moveEvt) {
    moveEvt.preventDefault();

    var leftLimitX = pinsContainer.clientLeft;
    var rightLimitX = pinsContainer.clientWidth;

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var mainPinCoordX = mapPinMain.offsetLeft - shift.x;
    var mainPinCoordY = mapPinMain.offsetTop - shift.y;

    var deltaY = MAIN_PIN_HEIGHT + MAIN_PIN_POINT;
    var pointCoordY = mainPinCoordY + deltaY;

    mapPinMain.style.left = Math.min(rightLimitX, Math.max(leftLimitX, mainPinCoordX)) + 'px';

    mapPinMain.style.top = (Math.min(MAX_LIMIT_Y, Math.max(MIN_LIMIT_Y, pointCoordY)) - deltaY) + 'px';
  }

  function onMouseUp(upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    window.form.addressField.value = 'x: ' + mapPinMain.offsetLeft
      + ', y: ' + (mapPinMain.offsetTop + (MAIN_PIN_HEIGHT + MAIN_PIN_POINT));
  }
})();

