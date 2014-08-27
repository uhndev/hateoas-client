angular.module( 'dados.formbuilder', [
  'ui.router',
  'dados.formbuilder.controller'
])

.config(function config( $stateProvider ) {
  $stateProvider
  .state( 'formbuilder', {
    url: '/formbuilder',
    controller: 'FormBuilderController',
    templateUrl: 'formbuilder/formbuilder.tpl.html',
    data:{ pageTitle: 'Form Builder' },
    resolve: {
      Resource: function($resource) {
        return $resource('http://localhost:1337/api/form');
      }
    }
  })
  .state( 'formbuilder.edit', {
    url: '/edit?formURL',
    controller: 'FormBuilderController',
    templateUrl: 'formbuilder/formbuilder.tpl.html',
    data:{ pageTitle: 'Form Builder' }
  });
});
