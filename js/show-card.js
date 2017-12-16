'use strict';
(function () {
  var mapElement = document.querySelector('.map');
  var filtersContainerElement = document.querySelector('.map__filters-container');

  window.showCard = function (pin) {

    var offer = window.data.offers[pin.dataset.offerIndex];
    window.card.closePopup();
    window.pin.activatePin(pin);
    var popupElement = window.card.renderPopup(offer);
    mapElement.insertBefore(popupElement, filtersContainerElement);

  };

})();
