'use strict';
(function () {
  var SERVER_URL = 'https://1510.dump.academy/keksobooking';

  function createRequest(onSuccess, onError) {
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
    return request;
  }

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = createRequest(onLoad, onError);
      xhr.open('GET', SERVER_URL + '/data');
      xhr.send();
    },
    save: function (data, onLoad, onError) {
      var xhr = createRequest(onLoad, onError);
      xhr.open('POST', SERVER_URL);
      xhr.send(data);
    }
  };

})();
