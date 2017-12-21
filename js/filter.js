'use strict';
(function () {
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;
  var VISIBLE_PINS_MAX_NUM = 5;
  var VISIBLE_PINS_MIN_NUM = 0;
  var filtersContainer = document.querySelector('.map__filters-container');
  var houseTypeFilter = filtersContainer.querySelector('#housing-type');
  var housePriceFilter = filtersContainer.querySelector('#housing-price');
  var houseRoomsFilter = filtersContainer.querySelector('#housing-rooms');
  var houseGuestFilter = filtersContainer.querySelector('#housing-guests');
  var featureInputs = filtersContainer.querySelector('#housing-features').querySelectorAll('input[name=features]');

  function isAnyValueAcceptable(filterValue) {
    return filterValue === 'any';
  }
  function filterByType(item) {
    var filterValue = houseTypeFilter.value;
    return (isAnyValueAcceptable(filterValue)) || (filterValue === item.offer.type);
  }

  function filterByPrice(item) {
    var filterValue = housePriceFilter.value;
    if (isAnyValueAcceptable(filterValue)) {
      return true;
    }
    var price = item.offer.price;
    if (filterValue === 'low') {
      return price < LOW_PRICE;
    } else if (filterValue === 'middle') {
      return price >= LOW_PRICE && price < HIGH_PRICE;
    } else if (filterValue === 'high') {
      return price >= HIGH_PRICE;
    }
    return true;
  }

  function filterByRooms(item) {
    var filterValue = houseRoomsFilter.value;
    return (isAnyValueAcceptable(filterValue)) || (filterValue === '' + item.offer.rooms);
  }

  function filterByGuests(item) {
    var filterValue = houseGuestFilter.value;
    return (isAnyValueAcceptable(filterValue)) || (filterValue === '' + item.offer.guests);
  }

  function filterByFeatures(item) {
    for (var i = 0; i < featureInputs.length; i++) {
      var f = featureInputs[i];
      if (f.checked && !item.offer.features.includes(f.value)) {
        return false;
      }
    }
    return true;
  }

  var filterChangeCallback = null;

  var filterChangeDebounceCallback = function () {
    window.util.debounce(function () {
      if (filterChangeCallback !== null) {
        filterChangeCallback();
      }
    });
  };

  houseTypeFilter.addEventListener('change', filterChangeDebounceCallback);

  housePriceFilter.addEventListener('change', filterChangeDebounceCallback);
  houseRoomsFilter.addEventListener('change', filterChangeDebounceCallback);
  houseGuestFilter.addEventListener('change', filterChangeDebounceCallback);
  for (var i = 0; i < featureInputs.length; i++) {
    featureInputs[i].addEventListener('change', filterChangeDebounceCallback);
  }

  window.filter = {
    applyFilter: function (src) {
      return src.filter(function (elem) {
        return filterByType(elem) && filterByPrice(elem) &&
          filterByRooms(elem) && filterByGuests(elem) && filterByFeatures(elem);
      }).slice(VISIBLE_PINS_MIN_NUM, VISIBLE_PINS_MAX_NUM);
    },
    onFilterChange: function (callback) {
      filterChangeCallback = callback;
    }
  };

})();
