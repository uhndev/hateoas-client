(function() {
  'use strict';
  angular
    .module('dados.collectioncentre', [
      'dados.collectioncentre.service',
      'dados.common.directives.simpleTable'
    ])
    .controller('CollectionCentreOverviewController', CollectionCentreOverviewController);

  CollectionCentreOverviewController.$inject = [
    '$scope', '$resource', '$location', 'API'
  ];

  function CollectionCentreOverviewController($scope, $resource, $location, API) {
    var vm = this;

    // bindable variables
    vm.allow = '';
    vm.title = '';
    vm.template = {};
    vm.resource = {};
    vm.centreInfo = {};
    vm.url = API.url() + $location.path();

    // bindable methods

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Resource = $resource(vm.url);

      Resource.get(function(data, headers) {
        vm.allow = headers('allow');
        vm.template = data.template;
        vm.resource = angular.copy(data);
        var robj = _.pick(data.items, 'name', 'study', 'contact');
        vm.title = data.items.name;

        vm.centreInfo = {
          tableData: _.objToPair(robj),
          columns: ['Field', 'Value'],
          rows: {
            'name': { title: 'Name', type: 'text' },
            'study': { title: 'Study', type: 'study' },
            'contact': { title: 'Contact', type: 'user' }
          }
        };

        vm.centreUsers = {
          tableData: data.items.coordinators || [],
          columns: ['Username', 'Email', 'Person', 'Role']
        };

        vm.centreSubjects = {
          tableData: data.items.subjects || [],
          columns: ['Subject ID', 'Study Mapping', 'Date of Event']
        };
      });
    }

    $scope.$on('hateoas.client.refresh', function() {
      init();
    });
  }
})();
