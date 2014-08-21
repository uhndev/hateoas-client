angular.module( 'dados.formbuilder', [
  'ui.router',
  'dados.formbuilder.controller'
])

.config(function config( $stateProvider ) {
  $stateProvider
  .state( 'formbuilder', {
    url: '/formbuilder',
    views: {
      'main': {
        controller: 'FormBuilderController',
        templateUrl: 'formbuilder/formbuilder.tpl.html'     
      }
    },
    data:{ pageTitle: 'Form Builder' }
  })
  .state( 'formbuilder.edit', {
    url: '/edit?formURL',
    views: {
      'main': {
        controller: 'FormBuilderController',
        templateUrl: 'formbuilder/formbuilder.tpl.html'     
      }
    },
    data:{ pageTitle: 'Form Builder' }
  });
});
