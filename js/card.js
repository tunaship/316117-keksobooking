'use strict';

(function () {

  var HOUSE_TYPE_DESCRIPTION = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом'
  };

  var mapCardElement = document.querySelector('.map');
  var popupTemplate = document.querySelector('template').content;

  window.card = {
    renderPopup: function (offerData) {
      var newPopup = popupTemplate.cloneNode(true);
      newPopup.querySelector('h3').textContent = offerData.offer.title;
      newPopup.querySelector('h3 + p > small').textContent = offerData.offer.address;
      newPopup.querySelector('.popup__price').textContent = offerData.offer.price + ' ' + String.fromCharCode(0x20bd) + '/ночь';
      newPopup.querySelector('h4').textContent = HOUSE_TYPE_DESCRIPTION[offerData.offer.type];
      newPopup.querySelector('h4 + p').textContent = offerData.offer.rooms + ' комнаты для ' +
        offerData.offer.guests + ' гостей';
      newPopup.querySelector('h4 + p + p').textContent = 'Заезд после ' + offerData.offer.checkin + ' выезд до ' +
        offerData.offer.checkout;
      var f = newPopup.querySelector('.popup__features');
      f.textContent = '';
      f.appendChild(generateFeaturesList(offerData.offer.features));
      newPopup.querySelector('p:last-of-type').textContent = offerData.offer.description;
      newPopup.querySelector('.popup__avatar').setAttribute('src', offerData.author.avatar);
      newPopup.querySelector('.popup__close').addEventListener('click', window.card.closePopup);
      return newPopup;
    },
    closePopup: function () {
      var article = mapCardElement.querySelector('.map__card');
      if (article !== null) {
        var btn = article.nextElementSibling;
        mapCardElement.removeChild(btn);
        mapCardElement.removeChild(article);
      }
    }
  };

  document.addEventListener('keydown', function (evt) {
    window.util.isEscEvent(evt, window.card.closePopup);
  });

  function generateFeaturesList(arr) {
    var featureListItems = document.createDocumentFragment();
    for (var i = 0; i < arr.length; i++) {
      var li = document.createElement('li');
      li.className = 'feature feature--' + arr[i];
      featureListItems.appendChild(li);
    }
    return featureListItems;
  }
})();
