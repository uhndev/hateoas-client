(function () {
  'use strict';

  angular
    .module('dados.common.directives.selectLoader.controller', [
      'ui.select',
      'ngAnimate',
      'dados.constants',
      'dados.common.directives.selectLoader.service'
    ])
    .controller('SelectController', SelectController);

  SelectController.$inject = ['$animate', '$scope', 'API', 'SelectService'];

  function SelectController($animate, $scope, API, SelectService) {
    $animate.enabled(false);

    var vm = this;
    var maxLimit;
    var DEFAULT_RANGE = 10; // if given vm.values, pre-search for given id +/- this amount

    // bindable variables
    vm.loadError = false;
    vm.href = (vm.url) ? API.url() + '/' + vm.url : null;
    vm.input = vm.input || [];
    vm.baseQuery = vm.query || null;
    vm.placeholder = vm.placeholder || 'COMMON.HATEOAS.QUERY.SEARCH.' + _.startCase(vm.url).toUpperCase();
    vm.labels = vm.labels || 'name';
    vm.skip = 0;
    vm.limit = 20;

    // bindable methods
    vm.parseValues = parseValues;
    vm.fetchData = fetchData;
    vm.loadMore = loadMore;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * parseValues
     * @description Takes potential object or collection and parses to return strictly ids or arrays of ids
     * @param values Input data from ng-model
     * @returns {Number|Array}
     */
    function parseValues(values) {
      var searchIds;
      if (vm.isAtomic) {
        // for singleselect, check if input was an object or id, and return just an id
        searchIds = _.has(values, 'id') ? values.id : values || '';
      } else {
        // for multiselect, check if input was an array of objects or and array of ids, and return just an array of ids
        searchIds = _.has(_.first(values), 'id') ? _.pluck(values, 'id') : values || [];
        if (!_.isArray(searchIds)) {
          searchIds = [searchIds];
        }
      }
      return searchIds;
    }

    /**
     * fetchData
     * @description Refresh function called to fetch data on load and search updates.
     * @param query Sails search query to pass through
     * @param select ui-select object
     * @param loadMore boolean denoting request came via scroll action
     */
    function fetchData(query, select, loadMore) {
      // set optional expiry in minutes (5 by default)
      SelectService.setExpiry(parseInt(vm.expiresIn) || 5);

      // initial request for when no ids passed in
      var promise = SelectService.loadSelect(vm.href, vm.baseQuery, {limit: vm.limit}, query);

      var searchIds = parseValues(vm.values);
      var hasIds = (vm.isAtomic) ? _.isNumber(searchIds) : !_.isEmpty(searchIds);

      // if values passed in, set initial search
      if (hasIds && !_.isUndefined(searchIds) && _.isEmpty(vm.baseQuery) && !query) {
        var initQuery = {
          limit: vm.limit,
          skip: vm.skip
        };

        // for singleselect, take range of id - some DEFAULT_RANGE; for multiselect, take min ranged id as lower bound
        if (!loadMore) {
          initQuery.sort = 'id ASC';
          if (vm.isAtomic) {
            initQuery.skip = (searchIds - DEFAULT_RANGE < 0) ? 0 : searchIds - DEFAULT_RANGE;
          } else {
            initQuery.limit = _.max(searchIds) + vm.limit;
          }
        }

        // apply temp initQuery as baseQuery
        promise = SelectService.loadSelect(vm.href, vm.baseQuery, initQuery, query)
          .then(function (data) {
            maxLimit = data.total;
            return {
              total: data.total,
              items: _.sortBy(data.items, vm.labels)
            };
          });
      }

      promise.then(function (data) {
        maxLimit = data.total;
        var ids = parseValues(vm.values);
        vm.input = _.filter(data.items, function (item) {
          return !_.contains(ids, item.id);
        });
        if (select) { // bugfix for ui-select. See https://github.com/angular-ui/ui-select/issues/962
          select.refreshItems();
        }
      }).catch(function (err) {
        vm.loadError = true;
        $scope.$parent.loadError = true;
      });
    }

    /**
     * loadMore
     * @description Fetches additional results from remote and appends to result list
     * @param {Object} select Instance of ui-select's $select object
     */
    function loadMore(select) {
      if (vm.limit <= maxLimit) {
        vm.limit += DEFAULT_RANGE;
        fetchData(null, select, true);
      }
    }
  }

})();
