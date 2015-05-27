(function() {
  'use strict';
  angular
    .module('dados.common.services.sails', [])
    .service('sailsNgTable', sailsNgTable);

  function sailsNgTable() {

    return {
      parse: function(params, query) {
        var pagination = {
          limit: params.count(),
          skip: ((params.page() - 1) * params.count())
        };

        if (params.sorting()) {
          pagination = _.reduce(params.sorting(), 
            function(query, value, key) {
              query.sort = [key, value].join(' ');
              return query;
          }, pagination);
        }

        if (query && 
            _.has(query, 'where') && 
            !_.isEmpty(query.where)) {
          pagination = _.merge(pagination, query);
        } else {
          if (params.filter()) {
            pagination = _.merge(pagination, params.filter());
          }
        }

        return pagination;
      }
    };
  }
})();
