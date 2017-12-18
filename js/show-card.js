'use strict';
(function () {
  var mapElement = document.querySelector('.map');
  var filtersContainerElement = document.querySelector('.map__filters-container');

  window.showCard = function (pin) {

    var offer = window.util.offers[pin.dataset.offerIndex];
    window.card.closeCard();
    window.pin.activatePin(pin);
    var cardElement = window.card.renderCard(offer);
    mapElement.insertBefore(cardElement, filtersContainerElement);

  };

})();
