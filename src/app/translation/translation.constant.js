(function() {
  'use strict';
  angular
    .module('dados.translation.constants', ['dados.constants'])
    .service('TRANSLATION_API', Translation);

  Translation.$inject = ['API'];

  function Translation(API) {
    return { url: API.url() + '/translation/:id' };
  }

})();
