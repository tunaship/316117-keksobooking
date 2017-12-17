'use strict';
(function () {
  window.syncronizeFields = function (fieldMaster, fieldSub, valuesMaster, valuesSub, syncCallback) {
    fieldMaster.addEventListener('input', setFieldsSync);
    function setFieldsSync() {
      var mv = fieldMaster.value;
      var index = valuesMaster.indexOf(mv);
      if (index !== -1) {
        var sv = valuesSub[index];
        syncCallback(fieldSub, sv);
      }
    }
    setFieldsSync();
  };
})();
