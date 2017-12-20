'use strict';
(function () {

  var filtersContainer = document.querySelector('.map__filters-container');
  var houseTypeFilter = filtersContainer.querySelector('#housing-type');
  var housePriceFilter = filtersContainer.querySelector('#housing-price');
  var houseRoomsFilter = filtersContainer.querySelector('#housing-rooms');
  var houseGuestFilter = filtersContainer.querySelector('#housing-guests');
  var featureInputs = filtersContainer.querySelector('#housing-features').querySelectorAll('input[name=features]');

  function filterDisabled(filterValue) {
    return filterValue === 'any';
  }
  function houseTypeTest(item) {
    var filterValue = houseTypeFilter.value;
    return (filterDisabled(filterValue)) || (filterValue === item.offer.type);
  }

  function housePriceTest(item) {
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

  function houseRoomsTest(item) {
    var filterValue = houseRoomsFilter.value;
    return (filterDisabled(filterValue)) || (filterValue === '' + item.offer.rooms);
  }

  function houseGuestsTest(item) {
    var filterValue = houseGuestFilter.value;
    return (filterDisabled(filterValue)) || (filterValue === '' + item.offer.guests);
  }

  function featuresTest(item) {
    for (var i = 0; i < featureInputs.length; i++) {
      var f = featureInputs[i];
      if (f.checked && !item.offer.features.includes(f.value)) {
        return false;
      }
    }
    return true;
  }

  window.filter = {
    offers: [],
    filteredOffers: [],
    applyFilter: function (src) {
      return src.filter(function (elem) {
        return houseTypeTest(elem) && housePriceTest(elem) &&
          houseRoomsTest(elem) && houseGuestsTest(elem) && featuresTest(elem);
      });
    },
    setupFilters: function (filterCallback) {
      houseTypeFilter.addEventListener('input', function () {
        window.filter.onFilterChange(filterCallback);
      });
      housePriceFilter.addEventListener('input', function () {
        window.filter.onFilterChange(filterCallback);
      });
      houseRoomsFilter.addEventListener('input', function () {
        window.filter.onFilterChange(filterCallback);
      });
      houseGuestFilter.addEventListener('input', function () {
        window.filter.onFilterChange(filterCallback);
      });
      for (var i = 0; i < featureInputs.length; i++) {
        featureInputs[i].addEventListener('change', function () {
          window.filter.onFilterChange(filterCallback);
        });
      }
    },
    onFilterChange: function (filterCallback) {
      window.util.debounce(filterCallback);
    }
  };
})();
