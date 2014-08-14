angular.module( 'dados.formbuilder', [
  'ui.router',
  'dados.formbuilder.controller'
])

.config(function config( $stateProvider ) {
  $stateProvider
  .state( 'formbuilder', {
    url: '/formbuilder/:formID',
    views: {
      'main': {
        controller: 'FormBuilderCtrl',
        templateUrl: 'formbuilder/formbuilder.tpl.html'     
      }
    },
    data:{ pageTitle: 'Form Builder' }
  });
});
