(function() {
  'use strict';
  angular
    .module('dados.user', [
      'dados.user.service',
      'dados.common.directives.simpleTable'
    ])
    .controller('UserOverviewController', UserOverviewController);

  UserOverviewController.$inject = [
    '$scope', '$resource', '$location', 'API', 'HeaderService'
  ];

  function UserOverviewController($scope, $resource, $location, API, HeaderService) {
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

        // pick out only relevant user data
        var userData = _.pick(data.items, 'username', 'email', 'prefix', 'firstname', 'lastname', 'gender', 'dob');

        // data for left user panel
        vm.userInfo = {
          rows: {
            'username': {title: 'COMMON.MODELS.USER.USERNAME', type: 'text'},
            'email': {title: 'COMMON.MODELS.USER.EMAIL', type: 'text'},
            'prefix': {title: 'COMMON.MODELS.USER.PREFIX', type: 'text'},
            'firstname': {title: 'COMMON.MODELS.USER.FIRSTNAME', type: 'text'},
            'lastname': {title: 'COMMON.MODELS.USER.LASTNAME', type: 'text'},
            'gender': {title: 'COMMON.MODELS.USER.GENDER', type: 'text'},
            'dob': {title: 'COMMON.MODELS.USER.DOB', type: 'date'}
          },
          tableData: _.objToPair(userData)
        };

        // data for right user studies panel
        vm.userStudies = {
          tableData: data.items.enrollments || [],
          columns: [
            {title: 'Study', field: 'COMMON.MODELS.STUDY.IDENTITY', type: 'text'},
            {title: 'Collection Centre', field: 'COMMON.MODELS.USER_ENROLLMENT.COLLECTION_CENTRE', type: 'text'},
            {title: 'Role', field: 'COMMON.MODELS.USER_ENROLLMENT.CENTRE_ACCESS', type: 'text'}
          ]
        };

        // initialize submenu
        HeaderService.setSubmenu('user', data.links);
      });
    }

    $scope.$on('hateoas.client.refresh', function() {
      init();
    });
  }
})();
