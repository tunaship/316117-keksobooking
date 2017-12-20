'use strict';
(function () {
  var map = document.querySelector('.map');
  var filtersContainer = document.querySelector('.map__filters-container');

  window.showCard = function (pin) {

    var offer = window.filter.filteredOffers[pin.dataset.offerIndex];
    window.card.closeCard();
    window.pin.activatePin(pin);
    var newCard = window.card.renderCard(offer);
    map.insertBefore(newCard, filtersContainer);
  };

})();
