'use strict';

var HOUSES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
  'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var HOUSE_TYPES = ['flat', 'house', 'bungalo'];
var CHECKIN_HOURS = ['12:00', '13:00', '14:00'];
var CHECKOUT_HOURS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var HOUSE_TYPE_DESCRIPTION = {
  'flat': 'Квартира',
  'bungalo': 'Бунгало',
  'house': 'Дом'
};
var MAP_PIN_HEIGHT = 40;
var MAP_PIN_WIDTH = 40;
var MAP_PIN_POINT = 18;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomIndex(arr) {
  return getRandomNum(0, arr.length);
}

function getRandomElement(arr) {
  return arr[getRandomIndex(arr)];
}

function getRandomRange(arr, n) {
  var randomRange = [];
  var clonedArr = arr.slice();
  for (var i = 0; i < n; i++) {
    var elemIndex = getRandomIndex(clonedArr);
    randomRange.push(clonedArr[elemIndex]);
    clonedArr.splice(elemIndex, 1);
  }
  return randomRange;
}

function createRange(min, max) {
  var range = [];
  for (var i = min; i <= max; i++) {
    range.push(i);
  }
  return range;
}

function generateRandomOffers() {
  var offerDataArr = [];

  var randHouseList = getRandomRange(HOUSES, 8);
  var avatarNumbers = getRandomRange(createRange(1, 8), 8);

  for (var i = 0; i < 8; i++) {
    var locationX = getRandomNum(300, 900);
    var locationY = getRandomNum(100, 500);

    var elemArr = {
      author: {
        avatar: 'img/avatars/user0' + avatarNumbers[i] + '.png'
      },

      offer: {
        title: randHouseList[i],
        address: locationX + ', ' + locationY,
        type: getRandomElement(HOUSE_TYPES),
        rooms: getRandomNum(1, 5),
        guests: getRandomNum(1, 5),
        checkin: getRandomElement(CHECKIN_HOURS),
        checkout: getRandomElement(CHECKOUT_HOURS),
        price: getRandomNum(1, 1000000),
        features: getRandomRange(FEATURES, getRandomNum(0, FEATURES.length)),
        description: '',
        photos: []
      },

      location: {
        x: locationX,
        y: locationY
      }
    };
    offerDataArr.push(elemArr);
  }
  return offerDataArr;
}

var similarListElement = document.querySelector('.map__pins');
var popupTemplate = document.querySelector('template').content;
var mapElement = document.querySelector('.map');
var nextDiv = document.querySelector('.map__filters-container');

function renderMapPin(offer) {
  var newMapPin = document.createElement('button');
  newMapPin.className = 'map__pin';
  newMapPin.style = 'left: ' + (offer.location.x - MAP_PIN_WIDTH / 2) + 'px; top: ' +
    (offer.location.y - MAP_PIN_HEIGHT - MAP_PIN_POINT) + 'px;';
  var newMapPinImg = document.createElement('img');
  newMapPinImg.src = offer.author.avatar;
  newMapPinImg.width = '40';
  newMapPinImg.height = '40';
  newMapPinImg.draggable = '';
  newMapPin.appendChild(newMapPinImg);
  newMapPin.addEventListener('click', function () {
    showPopupForPin(newMapPin, offer);
  });
  return newMapPin;
}

var offers = generateRandomOffers();

function renderMapPinsBlock(offersList) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < offersList.length; i++) {
    var pinElement = renderMapPin(offersList[i]);
    fragment.appendChild(pinElement);
  }
  similarListElement.appendChild(fragment);
}

function generateFeaturesList(arr) {
  var featureListItems = document.createDocumentFragment();
  for (var i = 0; i < arr.length; i++) {
    var li = document.createElement('li');
    li.className = 'feature feature--' + arr[i];
    featureListItems.appendChild(li);
  }
  return featureListItems;
}

var fieldSetList = document.getElementsByTagName('fieldset');

function setFormEnabled(enable) {
  for (var i = 0; i < fieldSetList.length; i++) {
    if (enable) {
      fieldSetList[i].removeAttribute('disabled');
    } else {
      fieldSetList[i].setAttribute('disabled', '');
    }
  }
}

setFormEnabled(false);

var mapPinMain = document.querySelector('.map__pin--main');
var formElement = document.querySelector('.notice__form');

function mapActivate() {
  mapElement.classList.remove('map--faded');
  formElement.classList.remove('notice__form--disabled');
  setFormEnabled(true);
  renderMapPinsBlock(offers);
}

mapPinMain.addEventListener('mouseup', mapActivate);
mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    mapActivate();
  }
});

function closePopup() {
  var article = mapElement.querySelector('.map__card');
  if (article !== null) {
    var btn = article.nextElementSibling;
    mapElement.removeChild(btn);
    mapElement.removeChild(article);
  }
  var activePins = similarListElement.querySelectorAll('.map__pin--active');
  for (var i = 0; i < activePins.length; i++) {
    activePins[i].classList.remove('map__pin--active');
  }
}

function showPopupForPin(pin, offer) {
  closePopup();
  pin.classList.add('map__pin--active');
  var popupElement = renderPopup(offer);
  mapElement.insertBefore(popupElement, nextDiv);
}

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
});

function renderPopup(offerData) {
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
  newPopup.querySelector('.popup__close').addEventListener('click', closePopup);
  return newPopup;
}

