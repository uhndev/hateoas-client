(function() {
  'use strict';

  angular
    .module('dados.common.directives.hateoasTable.controller', [
      'ngTable',
      'dados.common.services.sails'
    ])
    .controller('HateoasTableController', HateoasTableController);

  HateoasTableController.$inject = [
    '$scope', '$resource', 'API', 'ngTableParams', 'sailsNgTable'
  ];

  function HateoasTableController($scope, $resource, API, TableParams, SailsNgTable) {
    var vm = this;

    // bindable variables
    vm.url              = vm.url || '';
    vm.query            = vm.query || { 'where' : {} };
    vm.selected         = vm.selected || null;
    vm.filters          = vm.filters || {};
    vm.allow            = vm.allow || {};
    vm.template         = vm.template || {};
    vm.resource         = vm.resource || {};
    vm.onResourceLoaded = vm.onResourceLoaded || function(data) { return data; };

    // bindable methods
    vm.follow = follow;
    vm.select = select;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Resource = $resource(vm.url);
      var TABLE_SETTINGS = {
        page: 1,
        count: 10,
        filter: vm.filters
      };

      $scope.tableParams = new TableParams(TABLE_SETTINGS, {
        getData: function($defer, params) {
          var api = SailsNgTable.parse(params, vm.query);

          Resource.get(api, function(data, headers) {
            vm.selected = null;
            var permissions = headers('allow').split(',');
            _.each(permissions, function (permission) {
              vm.allow[permission] = true;
            });

            // data massage as needed
            var massagedData = vm.onResourceLoaded(angular.copy(data));

            vm.template = massagedData.template;
            vm.resource = angular.copy(massagedData);

            params.total(massagedData.total);
            $defer.resolve(massagedData.items);
          });
        }
      });
    }

    function follow(link) {
      if (link) {
        if (link.rel) {
          $location.path(_.convertRestUrl(link.href, API.prefix));
        }
      }
    }

    function select(item) {
      vm.selected = (vm.selected === item ? null : item);
    }

    // watchers
    $scope.$watchCollection('ht.query.where', function(newQuery, oldQuery) {
      if (newQuery && !_.isEqual(newQuery, oldQuery)) {
        // Page changes will trigger a reload. To reduce the calls to
        // the server, force a reload only when the user is already on
        // page 1.
        if ($scope.tableParams.page() !== 1) {
          $scope.tableParams.page(1);
        } else {
          $scope.tableParams.reload();
        }
      }
    });

    $scope.$on('hateoas.client.refresh', function(e) {
      $scope.tableParams.reload();
    });
  }

})();
