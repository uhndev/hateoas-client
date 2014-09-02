angular.module('hateoas', [
  'hateoas.view',
  'hateoas.controls',
  'hateoas.controller'])
  .constant('API', { 
    protocol: 'http',
    host : 'localhost',
    port: '1337',
    prefix: '/api',
    url: function getUrl() {
      return this.protocol + "://" + 
        this.host + ":" + this.port + this.prefix;
    }
  });
