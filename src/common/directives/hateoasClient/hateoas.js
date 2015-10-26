(function() {
  'use strict';
  angular.module('dados.common.directives.hateoas', [
  	'dados.common.directives.selectLoader',
    'dados.common.directives.hateoas.view',
    'dados.common.directives.hateoas.utils',
    'dados.common.directives.hateoas.controls',    
    'dados.common.directives.hateoas.controller'
  ])
  .constant('SLUG_ROUTES', ['study']);

})();
