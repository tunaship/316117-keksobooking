'use strict';

(function () {

  var HOUSES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
    'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var HOUSE_TYPES = ['flat', 'house', 'bungalo'];
  var CHECKIN_HOURS = ['12:00', '13:00', '14:00'];
  var CHECKOUT_HOURS = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  window.data = {
    generateRandomOffers: function () {
      var offerData = [];

      var randHouseList = window.util.getRandomRange(HOUSES, 8);
      var avatarNumbers = window.util.getRandomRange(window.util.createRange(1, 8), 8);

      for (var i = 0; i < 8; i++) {
        var locationX = window.util.getRandom(300, 900);
        var locationY = window.util.getRandom(100, 500);

        var offerDataElement = {
          author: {
            avatar: 'img/avatars/user0' + avatarNumbers[i] + '.png'
          },
          offer: {
            title: randHouseList[i],
            address: locationX + ', ' + locationY,
            type: HOUSE_TYPES[window.util.getRandom(0, HOUSE_TYPES.length)],
            rooms: window.util.getRandom(1, 5),
            guests: window.util.getRandom(1, 5),
            checkin: CHECKIN_HOURS[window.util.getRandom(0, CHECKIN_HOURS.length)],
            checkout: CHECKOUT_HOURS[window.util.getRandom(0, CHECKOUT_HOURS.length)],
            price: window.util.getRandom(1, 1000000),
            features: window.util.getRandomRange(FEATURES, window.util.getRandom(0, FEATURES.length)),
            description: '',
            photos: []
          },

          location: {
            x: locationX,
            y: locationY
          }
        };
        offerData.push(offerDataElement);
      }
      return offerData;
    }
  };
})();
