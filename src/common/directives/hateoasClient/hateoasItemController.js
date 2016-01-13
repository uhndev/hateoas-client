(function() {
  'use strict';
  angular
    .module('dados.common.directives.hateoas.item.controller', [])
    .controller('HateoasItemController', HateoasItemController);

  HateoasItemController.$inject = [
    '$resource', '$location', 'API', 'HeaderService'
  ];

  function HateoasItemController($resource, $location, API, HeaderService) {
    var vm = this;

    // bindable variables
    vm.url = API.url() + $location.path();
    vm.allow = '';
    vm.template = {};
    vm.resource = {};

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var systemFields = ['id', 'rel', 'href'];

      var Resource = $resource(vm.url);
      Resource.get(function(data, headers) {
        vm.selected = null;
        vm.allow = headers('allow');
        vm.template = data.template;
        vm.resource = angular.copy(data);

        HeaderService.setSubmenu(vm.template.rel, data.links);

        vm.itemInfo = {
          rows: {},
          tableData: []
        };

        // build simple-table data for non-system fields
        _.forIn(data.items, function (value, key) {
          if (!_.contains(systemFields, key)) {
            vm.itemInfo.rows[key] = {
              title: _.startCase(key),
              type: 'text'
            };

            var template = _.find(vm.template.data, { name: key });
            if (!_.isUndefined(template)) {
              vm.itemInfo.rows[key].type = template.type;
            }
          }
        });

        // populate tableData with non-system fields
        _.each(_.objToPair(data.items), function (row) {
          if (!_.contains(systemFields, row.name)) {
            vm.itemInfo.tableData.push(row);
          }
        });
      });
    }
  }

})();
