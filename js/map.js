'use strict';

(function () {
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

})();
