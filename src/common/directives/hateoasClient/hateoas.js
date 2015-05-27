(function() {
  'use strict';
  angular.module('dados.common.directives.hateoas', [
    'dados.common.directives.hateoas.view',
    'dados.common.directives.hateoas.utils',
    'dados.common.directives.hateoas.controls',    
    'dados.common.directives.hateoas.controller'
  ])
  .constant('API', { 
    protocol: 'http',
    host : 'localhost',
    port: '1337',
    prefix: '/api',
    url: function getUrl() {
      return this.protocol + "://" + 
        this.host + ":" + this.port + this.prefix;
    }
  })
  .constant('SLUG_ROUTES', ['study']);

})();
