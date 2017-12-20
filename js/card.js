'use strict';

(function () {

  var HOUSE_TYPE_DESCRIPTION = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом'
  };

  var map = document.querySelector('.map');
  var cardTemplate = document.querySelector('template').content;

  window.card = {
    renderCard: function (offerData) {
      var newCard = cardTemplate.cloneNode(true);
      newCard.querySelector('h3').textContent = offerData.offer.title;
      newCard.querySelector('h3 + p > small').textContent = offerData.offer.address;
      newCard.querySelector('.popup__price').textContent = offerData.offer.price + ' ' + String.fromCharCode(0x20bd) + '/ночь';
      newCard.querySelector('h4').textContent = HOUSE_TYPE_DESCRIPTION[offerData.offer.type];
      newCard.querySelector('h4 + p').textContent = offerData.offer.rooms + ' комнаты для ' +
        offerData.offer.guests + ' гостей';
      newCard.querySelector('h4 + p + p').textContent = 'Заезд после ' + offerData.offer.checkin + ' выезд до ' +
        offerData.offer.checkout;
      var features = newCard.querySelector('.popup__features');
      features.textContent = '';
      features.appendChild(generateFeaturesList(offerData.offer.features));
      var photos = newCard.querySelector('.popup__pictures');
      photos.textContent = '';
      photos.appendChild(generatePhotosList(offerData.offer.photos));
      newCard.querySelector('p:last-of-type').textContent = offerData.offer.description;
      newCard.querySelector('.popup__avatar').setAttribute('src', offerData.author.avatar);
      newCard.querySelector('.popup__close').addEventListener('click', window.card.closeCard);
      return newCard;
    },
    closeCard: function () {
      var article = map.querySelector('.map__card');
      if (article !== null) {
        var btn = article.nextElementSibling;
        map.removeChild(btn);
        map.removeChild(article);
      }
    }
  };

  document.addEventListener('keydown', function (evt) {
    window.util.isEscEvent(evt, window.card.closeCard);
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

  function generatePhotosList(arr) {
    var photoListItems = document.createDocumentFragment();
    for (var i = 0; i < arr.length; i++) {
      var li = document.createElement('li');
      var img = document.createElement('img');
      img.src = arr[i];
      li.appendChild(img);
      photoListItems.appendChild(li);
    }
    return photoListItems;
  }

})();
