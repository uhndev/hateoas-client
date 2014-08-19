angular.module( 'dados.forms', [
  'ui.router',
  'nglist-editor',
  'dados.form.controller'
])

.config(function config( $stateProvider ) {
  $stateProvider
  .state( 'forms', {
    url: '/forms',
    views: {
      'main': {
        controller: 'FormCtrl',
        templateUrl: 'form/form.tpl.html'     
      }
    },
    data:{ pageTitle: 'Form' }
  });
});
