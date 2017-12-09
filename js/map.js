'use strict';

var HOUSE_LIST = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
  'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var HOUSE_TYPE_LIST = ['flat', 'house', 'bungalo'];
var CHECKIN_TIME = ['12:00', '13:00', '14:00'];
var CHECKOUT_TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var TYPEHOUSE_MIN_PRICE = {
  'bungalo': 0,
  'flat': 1000,
  'house': 5000,
  'palace': 10000
};

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

  var randHouseList = getRandomRange(HOUSE_LIST, 8);
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
        type: getRandomElement(HOUSE_TYPE_LIST),
        rooms: getRandomNum(1, 5),
        guests: getRandomNum(1, 5),
        checkin: getRandomElement(CHECKIN_TIME),
        checkout: getRandomElement(CHECKOUT_TIME),
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

document.querySelector('.map').classList.remove('map--faded');

function renderMapPin(dataListElem) {
  var newMapPin = document.createElement('button');
  newMapPin.className = 'map__pin';
  newMapPin.style = 'left: ' + (dataListElem.location.x - 20) + 'px; top: ' +
    (dataListElem.location.y - 40 - 18) + 'px;';
  newMapPin.innerHTML = '<img src=' + dataListElem.author.avatar +
    ' width = "40" height = "40" draggable = "false">';
  return newMapPin;
}

var dataList = generateAdsData();
var similarListElement = document.querySelector('.map__pins');

function renderMapPinsBlock() {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < dataList.length; i++) {
    fragment.appendChild(renderMapPin(dataList[i]));
  }
  similarListElement.appendChild(fragment);
}

renderMapPinsBlock();

var adTemplate = document.querySelector('template').content;
var parentList = document.querySelector('.map');
var nextDiv = document.querySelector('.map__filters-container');

var TYPE_DESCRIPTION = {
  'flat': 'Квартира',
  'bungalo': 'Бунгало',
  'house': 'Дом'
};

function generateFeaturesList(arr) {
  var featureListItems = document.createDocumentFragment();
  for (var i = 0; i < arr.length; i++) {
    var li = document.createElement('li');
    li.className = 'feature feature--' + arr[i];
    featureListItems.appendChild(li);
  }
  return featureListItems;
}

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
  return newAd;
}
var adsElem = dataList[0];
var newAd = renderNewAd(adsElem);

parentList.insertBefore(newAd, nextDiv);

var addressField = document.querySelector('input#address');
addressField.required = true;
addressField.readOnly = true;
addressField.value = 'Tokyo';

var titleField = document.querySelector('input#title');
titleField.required = true;

titleField.addEventListener('input', function (evt) {
  var target = evt.target;
  if (target.value.length < 30) {
    target.setCustomValidity('Название должно быть не короче 30 символов');
  } else if (target.value.length > 100) {
    target.setCustomValidity('Название должно быть не длиннее 100 символов');
  } else {
    target.setCustomValidity('');
  }
});

var roomPriceField = document.querySelector('input#price');
roomPriceField.required = true;
roomPriceField.addEventListener('input', function (evt) {
  var target = evt.target;
  if (target.value <= 0) {
    target.setCustomValidity('Стоимость не должна быть отрицательной');
  } else if (target.value >= 1000000) {
    target.setCustomValidity('Стоимость должна быть ниже 1000000');
  } else {
    target.setCustomValidity('');
  }
});

var timeInField = document.querySelector('select[id=timein]');
var timeOutField = document.querySelector('select[id=timeout]');

timeInField.addEventListener('change', function () {
  timeOutField.value = timeInField.value;
});

var houseTypeField = document.querySelector('select#type');
houseTypeField.addEventListener('change', function () {
  updatePriceConstraints();
});

function updatePriceConstraints() {
  var val = houseTypeField.value;
  roomPriceField.setAttribute('min', TYPEHOUSE_MIN_PRICE[val]);
}

updatePriceConstraints();

var roomNumberField = document.querySelector('select#room_number');
var guestNumberField = document.querySelector('select#capacity');

function updateRoomCapacity() {
  var roomNum = roomNumberField.value;
  for (var i = 0; i < guestNumberField.length; i++) {
    var guestOption = guestNumberField.children[i];
    var guestNum = guestOption.value;
    var optionAllowed = false;
    if (guestNum === '0') {
      optionAllowed = (roomNum === '100');
    } else {
      optionAllowed = (guestNum <= roomNum && roomNum !== '100');
    }
    guestOption.style.display = optionAllowed ? 'block' : 'none';
  }

  var currentGuestCapacity = guestNumberField.selectedIndex;
  if (guestNumberField.children[currentGuestCapacity].style.display === 'none') {
    for (i = 0; i < guestNumberField.length; i++) {
      guestOption = guestNumberField.children[i];
      if (guestOption.style.display === 'block') {
        guestNumberField.selectedIndex = i;
        break;
      }
    }
  }
}

updateRoomCapacity();

roomNumberField.addEventListener('change', function () {
  updateRoomCapacity();
});

var noticeForm = document.querySelector('.notice__form');
var formFieldElements = noticeForm.querySelectorAll('input, select, textarea');

for (var i = 0; i < formFieldElements.length; i++) {
  formFieldElements[i].addEventListener('invalid', onInvalidInput);
}

function onInvalidInput(evt) {
  evt.target.style.border = 'dotted 2px #ff5635';
}

