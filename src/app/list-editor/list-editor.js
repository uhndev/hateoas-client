angular.module( 'dados.list-editor', [
  'ui.router',
  'ui.bootstrap',
  'nglist-editor'
])

.config(function config( $stateProvider ) {
  $stateProvider
  .state( 'list-editor', {
    url: '/list-editor',
    views: {
      'main': {
        controller: 'ListCtrl',
        templateUrl: 'list-editor/list-editor.tpl.html'     
      }
    },
    data:{ pageTitle: 'List Editor' }
  });
})

.controller('ListCtrl', function ($scope) {
  $scope.list = [
    {name: "Moroni", age: 50},
    {name: "Tiancum", age: 43, weight: 189, complexion: "dark"},
    {name: "Jacob", age: 27},
    {name: "Nephi", age: 29, complexion: "fair"}
  ];
  
  $scope.columns = [
    { title: 'Name of Person', field: 'name', type: 'text'},
    { title: 'Age of Person', field: 'age', type: 'number'}
  ];
});
