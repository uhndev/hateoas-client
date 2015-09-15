(function() {
  'use strict';
  angular
    .module('dados.user', [
      'dados.user.service',
      'dados.common.directives.simpleTable'
    ])
    .controller('UserOverviewController', UserOverviewController);

  UserOverviewController.$inject = [
    '$scope', '$resource', '$location', 'toastr', 'API'
  ];

  function UserOverviewController($scope, $resource, $location, toastr, API) {
    var vm = this;

    // bindable variables
    vm.allow = '';
    vm.title = '';
    vm.template = {};
    vm.resource = {};
    vm.userInfo = {};
    vm.centreAccess = {};
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

        var robj = _.pick(data.items, 'username', 'email', 'prefix', 'firstname', 'lastname', 'gender', 'dob');

        vm.title = _.camelCase(data.items.username);
        if (data.items.prefix && data.items.firstname && data.items.lastname) {
          vm.title = [data.items.prefix, data.items.firstname, data.items.lastname].join(' ');
        }

        vm.userInfo = {
          rows: {
            'username': { title: 'Username', type: 'text' },
            'email': { title: 'Email', type: 'text' },
            'prefix': { title: 'Prefix', type: 'text' },
            'firstname': { title: 'Firstname', type: 'text' },
            'lastname': { title: 'Lastname', type: 'text' },
            'gender': { title: 'Gender', type: 'text' },
            'dob': { title: 'Date of Birth', type: 'date' }
          },
          tableData: _.objToPair(robj)
        };

        vm.userStudies = {
          tableData: data.items.enrollments || [],
          columns: [
            { title: 'Study', field: 'study', type: 'text' },
            { title: 'Collection Centre', field: 'collectionCentre', type: 'text' },
            { title: 'Role', field: 'role', type: 'text' }
          ]
        };
      });
    }

    $scope.$on('hateoas.client.refresh', function() {
      init();
    });
  }
})();
