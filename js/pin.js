'use strict';

(function () {

  var MAP_PIN_HEIGHT = 40;
  var MAP_PIN_WIDTH = 40;
  var MAP_PIN_POINT = 18;

  window.pin = {
    renderMapPin: function (offer) {
      var newMapPin = document.createElement('button');
      newMapPin.className = 'map__pin';
      newMapPin.style.left = offer.location.x - MAP_PIN_WIDTH / 2 + 'px';
      newMapPin.style.top = offer.location.y - MAP_PIN_HEIGHT - MAP_PIN_POINT + 'px';
      var newMapPinImg = document.createElement('img');
      newMapPinImg.src = offer.author.avatar;
      newMapPinImg.width = MAP_PIN_WIDTH;
      newMapPinImg.height = MAP_PIN_HEIGHT;
      newMapPinImg.draggable = '';
      newMapPin.appendChild(newMapPinImg);
      return newMapPin;
    },
    activatePin: function (pin) {
      var activePins = document.querySelector('.map__pins').querySelectorAll('.map__pin--active');
      for (var i = 0; i < activePins.length; i++) {
        activePins[i].classList.remove('map__pin--active');
      }
      pin.classList.add('map__pin--active');
    }
  };

})();
