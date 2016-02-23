(function() {
  'use strict';
  angular.module('dados.common.directives.hateoas.controller', [
    'ngTable',
    'dados.common.directives.hateoas.utils',
    'dados.common.services.sails'
  ])
  .controller('HateoasController', HateoasController);

  HateoasController.$inject = [
    '$scope', '$resource', '$location', 'HeaderService',
    'ResourceFactory', 'API', 'ngTableParams', 'sailsNgTable'
  ];

  function HateoasController($scope, $resource, $location, HeaderService,
                              ResourceFactory, API, TableParams, SailsNgTable) {
    var vm = this;

    // bindable variables
    vm.url = API.url() + $location.path();
    vm.query = {'where' : {}};
    vm.selected = null;
    vm.filters = {};
    vm.allow = '';
    vm.template = {};
    vm.resource = {};

    // bindable methods
    vm.follow = follow;
    vm.select = select;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var modelName = null;
      var modelID = null;
      var pathArray = _.pathnameToArray($location.path());

      // if trying to render a hateoas collection, take note of parent base model in url
      if (pathArray.length >= 2) {
        modelName = pathArray[0];
        modelID = pathArray[1];
      }

      var Resource = $resource(vm.url);
      var TABLE_SETTINGS = {
        page: 1,
        count: 10,
        filter: vm.filters
      };

      $scope.tableParams = new TableParams(TABLE_SETTINGS, {
        getData: function($defer, params) {
          var api = SailsNgTable.parse(params, vm.query);
          var state = {};

          /**
           * if dadosHeader was set from queryBuilder, modify angular resource to include the
           * X-UHN-Deep-Query dadosHeader containing a JSON object of the form:
           * {
           *    collection: 'users',  // collection attribute on model to populate
           *    where: {              // where clause to conditionally populate on
           *      id: 1
           *    }
           * }
           */
          if (!_.isEmpty(vm.headers)) {
            Resource = $resource(vm.url, {}, {
              'get': {
                method: 'GET',
                isArray: false,
                headers: {'X-UHN-Deep-Query': JSON.stringify(vm.headers)}
              }
            });
          } else { // otherwise, use vanilla angular resource to fetch data
            Resource = $resource(vm.url);
          }

          Resource.get(api, function(data, headers) {
            vm.selected = null;
            vm.allow = headers('allow');
            vm.template = data.template;
            vm.resource = angular.copy(data);
            params.total(data.total);
            $defer.resolve(data.items);

            // if on model subpage, include model name in template
            // to be able to prepend to appropriate rest calls
            if (modelName && modelID) {
              var Model = ResourceFactory.create(API.url(modelName));

              Model.get({id: modelID}).$promise.then(function (model) {
                vm.template.model = modelName;
                vm.template.modelID = modelID;
                HeaderService.setSubmenu(modelName, data.links);
              });
            } else {
              // initialize submenu
              HeaderService.setSubmenu(modelName, data.links);
            }
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
      if (_.has(vm.selected, 'links')) {
        HeaderService.setSubmenu(vm.selected.rel, vm.selected.links);
      }
    }

    // watchers
    $scope.$watchCollection('hateoas.query.where', function(newQuery, oldQuery) {
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

    $scope.$watch('hateoas.headers', function(newVal, oldVal) {
      if (newVal && !_.isEqual(newVal, oldVal)) {
        $scope.tableParams.reload();
      }
    });

    $scope.$on('hateoas.client.refresh', function(e) {
      $scope.tableParams.reload();
    });
  }

})();
