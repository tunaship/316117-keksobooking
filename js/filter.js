'use strict';
(function () {

  var i;
  var filtersContainer = document.querySelector('.map__filters-container');
  var houseTypeFilter = filtersContainer.querySelector('#housing-type');
  var housePriceFilter = filtersContainer.querySelector('#housing-price');
  var houseRoomsFilter = filtersContainer.querySelector('#housing-rooms');
  var houseGuestFilter = filtersContainer.querySelector('#housing-guests');
  var featureInputs = filtersContainer.querySelector('#housing-features').querySelectorAll('input[name=features]');

  function filterDisabled(filterValue) {
    return filterValue === 'any';
  }
  function typeFilter(item) {
    var filterValue = houseTypeFilter.value;
    return (filterDisabled(filterValue)) || (filterValue === item.offer.type);
  }

  function priceFilter(item) {
    var filterValue = housePriceFilter.value;
    if (filterDisabled(filterValue)) {
      return true;
    }
    var price = item.offer.price;
    if (filterValue === 'low') {
      return price < 10000;
    } else if (filterValue === 'middle') {
      return price >= 10000 && price < 50000;
    } else if (filterValue === 'high') {
      return price >= 50000;
    }
    return true;
  }

  function roomFilter(item) {
    var filterValue = houseRoomsFilter.value;
    return (filterDisabled(filterValue)) || (filterValue === '' + item.offer.rooms);
  }

  function guestFilter(item) {
    var filterValue = houseGuestFilter.value;
    return (filterDisabled(filterValue)) || (filterValue === '' + item.offer.guests);
  }

  function featuresFilter(item) {
    for (i = 0; i < featureInputs.length; i++) {
      var f = featureInputs[i];
      if (f.checked && !item.offer.features.includes(f.value)) {
        return false;
      }
    }
    return true;
  }

  var filterChangeCallback = function () {};

  houseTypeFilter.addEventListener('input', function () {
    filterChangeCallback();
  });
  housePriceFilter.addEventListener('input', function () {
    filterChangeCallback();
  });
  houseRoomsFilter.addEventListener('input', function () {
    filterChangeCallback();
  });
  houseGuestFilter.addEventListener('input', function () {
    filterChangeCallback();
  });
  for (i = 0; i < featureInputs.length; i++) {
    featureInputs[i].addEventListener('change', function () {
      filterChangeCallback();
    });
  }

  window.filter = {
    applyFilter: function (src) {
      return src.filter(function (elem) {
        return typeFilter(elem) && priceFilter(elem) &&
          roomFilter(elem) && guestFilter(elem) && featuresFilter(elem);
      }).slice(0, 5);
    },
    onFilterChange: function (filterCallback) {
      filterChangeCallback = function () {
        window.util.debounce(filterCallback);
      };
    }
  };
})();
