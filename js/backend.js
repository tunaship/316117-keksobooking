'use strict';
(function () {
  var SERVER_URL = 'https://1510.dump.academy/keksobooking';
  var SERVER_URL_DATA = 'https://1510.dump.academy/keksobooking/data';

  function createRequest(method, url, data, onSuccess, onError) {
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.addEventListener('load', function (evt) {
      var xhr = evt.target;
      var error;
      switch (xhr.status) {
        case 200:
          onSuccess(xhr.response);
          break;
        case 400:
          error = 'Неверный запрос. Ошибка ' + xhr.status;
          break;
        case 404:
          error = 'Ничего не найдено. Ошибка ' + xhr.status;
          break;
        case 500:
          error = 'Ошибка сервера ' + xhr.status;
          break;

        default:
          error = 'Неизвестный статус: ' + xhr.status;
      }

      if (error) {
        onError(error);
      }
    });

    request.addEventListener('error', function () {
      onError('Ошибка соединения');
    });
    request.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться');
    });
    request.timeout = 10000;

    request.open(method, url);
    request.send(data);
  }

  window.backend = {
    load: function (onLoad, onError) {
      createRequest('GET', SERVER_URL_DATA, '', onLoad, onError);
    },
    save: function (data, onLoad, onError) {
      createRequest('POST', SERVER_URL, data, onLoad, onError);
    }
  };

})();
