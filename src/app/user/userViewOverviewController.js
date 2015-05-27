(function() {
  'use strict';
  angular
    .module('dados.user', [
      'dados.user.service',
      'dados.common.directives.simpleTable',
      'dados.common.directives.listEditor'
    ])
    .controller('UserOverviewController', UserOverviewController);
  
  UserOverviewController.$inject = [
    '$scope', '$resource', '$location', 'UserService', 'toastr', 'API'
  ];
  
  function UserOverviewController($scope, $resource, $location, User, toastr, API) {
    var vm = this;

    // bindable variables
    vm.allow = '';
    vm.title = '';
    vm.template = {};
    vm.resource = {};
    vm.userInfo = {};
    vm.centreAccess = {};
    vm.savedData = {};
    vm.url = API.url() + $location.path();

    // bindable methods
    vm.saveChanges = saveChanges;
    vm.revertChanges = revertChanges;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Resource = $resource(vm.url);

      Resource.get(function(data, headers) {
        vm.allow = headers('allow');
        vm.template = data.template;
        vm.resource = angular.copy(data);
        var robj = _.pick(data.items, 'username', 'email', 'prefix', 'firstname', 'lastname');
        
        vm.title = _.camelCase(data.items.username);
        if (data.items.prefix && data.items.firstname && data.items.lastname) {
          vm.title = [data.items.prefix, data.items.firstname, data.items.lastname].join(' ');
        }
        
        vm.userInfo = {
          columns: [ 'Name', 'Value' ],
          tableData: parseData(robj)
        };

        vm.centreAccess = {
          tableData: data.items.centreAccess || [],
          columns: [
            { title: 'Study', field: 'study', type: 'text' },
            { title: 'Role', field: 'role', type: 'text' },
            { title: 'Collection Centre', field: 'collectionCentre', type: 'text' }
          ]
        };
        
        vm.savedData = {
          forceReload: false,
          data: angular.copy(vm.centreAccess)
        };

        // initialize submenu
        if (_.has(data.items, 'links')) {
          var submenu = {
            href: data.items.slug,
            name: data.items.name,
            links: data.items.links
          };
          angular.copy(submenu, $scope.dados.submenu);
        }
      });
    }

    function parseData(robj) {
      return _.map(_.keys(robj), function (k) {
        return { 
          name: 'User ' + _.camelCase(k),
          value: robj[k]
        };
      });
    }

    function generateReport() {
      alert('Generating report');
    }

    function saveChanges() {
      angular.copy(vm.centreAccess, vm.savedData.data);
      var user = new User({ 'centreAccess': vm.centreAccess.tableData });
      user.$update({ id: vm.resource.items.id }).then(function (data) {
        toastr.success('Updated user studies successfully!', 'Study');
      }).catch(function (err) {
        toastr.error(err, 'Study');
      });
    }

    function revertChanges() {
      angular.copy(vm.savedData.data, vm.centreAccess);
      vm.savedData.forceReload = !vm.savedData.forceReload;
    }
  }
})();