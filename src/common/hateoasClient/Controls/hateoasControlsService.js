angular.module('hateoas.controls.service', ['ngResource'])
  .service('HateoasControlsService', [ '$q', '$resource',
  function($q, $resource) {
      /**
       * Public: commit
       * Commits a HATEOAS item to the API.
       * @param   item - item to create/update on the API.
       * @returns $promise
       */
      this.commit = function commit(href, item) {
        var resource = $resource(href, null, { 'update': { method: 'PUT' } });
        var method = (_.has(item, 'id') ? 'update' : 'save');
        return resource[method](item).$promise;
      };

      /**
       * Public: archive
       * Archive a HATEOAS item from the API
       * @param   item - item to archive
       * @returns $promise
       */
      this.archive = function archive(item) {
        console.log("Not implemented!");
      };
  }]);
