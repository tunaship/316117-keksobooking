'use strict';

var HOUSES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
  'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var HOUSE_TYPES = ['flat', 'house', 'bungalo'];
var CHECKIN_HOURS = ['12:00', '13:00', '14:00'];
var CHECKOUT_HOURS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var TYPE_DESCRIPTION = {
  'flat': 'Квартира',
  'bungalo': 'Бунгало',
  'house': 'Дом'
};
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
    randomRange[i] = clonedArr[elemIndex];
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

function generateAdsData() {
  var adsDataArr = [];

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
        address: locationX + ',' + locationY,
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
    adsDataArr.push(elemArr);
  }
  return adsDataArr;
}

var similarListElement = document.querySelector('.map__pins');
var adTemplate = document.querySelector('template').content;
var mapElement = document.querySelector('.map');
var nextDiv = document.querySelector('.map__filters-container');

function renderMapPin(dataListElem) {
  var newMapPin = document.createElement('button');
  newMapPin.className = 'map__pin';
  newMapPin.style = 'left: ' + (dataListElem.location.x - 20) + 'px; top: ' +
    (dataListElem.location.y - 40 - 18) + 'px;';
  newMapPin.innerHTML = '<img src=' + dataListElem.author.avatar +
    ' width = "40" height = "40" draggable = "false">';
  newMapPin.addEventListener('click', onMapPinClick);
  newMapPin.addEventListener('kewdown', onMapPinEnterPress);
  return newMapPin;
}

var dataList = generateAdsData();

function renderMapPinsBlock() {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < dataList.length; i++) {
    var pinElement = renderMapPin(dataList[i]);
    pinElement.advertisementIndex = i;
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
  renderMapPinsBlock();
}
mapPinMain.addEventListener('mouseup', mapActivate);
mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    mapActivate();
  }
});

var closePopup = function () {
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
};

function showPopupForPin(pin) {
  closePopup();
  pin.classList.add('map__pin--active');
  var adsElem = dataList[pin.advertisementIndex];
  var newAd = renderNewAd(adsElem);
  mapElement.insertBefore(newAd, nextDiv);
}

var onMapPinClick = function (evt) {
  var pinElement = evt.currentTarget;
  showPopupForPin(pinElement);
};

var onMapPinEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    var pinElement = evt.currentTarget;
    showPopupForPin(pinElement);
  }
};

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
});

function renderNewAd(adsElement) {
  var newAd = adTemplate.cloneNode(true);
  newAd.querySelector('h3').textContent = adsElement.offer.title;
  newAd.querySelector('h3 + p > small').textContent = adsElement.offer.address;
  newAd.querySelector('.popup__price').innerHTML = adsElement.offer.price + ' &#x20bd;/ночь';
  newAd.querySelector('h4').textContent = TYPE_DESCRIPTION[adsElement.offer.type];
  newAd.querySelector('h4 + p').textContent = adsElement.offer.rooms + ' комнаты для ' +
   adsElement.offer.guests + ' гостей';
  newAd.querySelector('h4 + p + p').textContent = 'Заезд после ' + adsElement.offer.checkin + ' выезд до ' +
    adsElement.offer.checkout;
  var f = newAd.querySelector('.popup__features');
  f.textContent = '';
  f.appendChild(generateFeaturesList(adsElement.offer.features));
  newAd.querySelector('p:last-of-type').textContent = adsElement.offer.description;
  newAd.querySelector('.popup__avatar').setAttribute('src', adsElement.author.avatar);
  newAd.querySelector('.popup__close').addEventListener('click', closePopup);
  return newAd;
}

