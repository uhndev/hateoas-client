(function() {
  'use strict';
  angular
    .module('dados.common.directives.pluginEditor.formService', [
      'dados.constants',
      'dados.common.services.resource'
    ])
    .service('FormService', FormService)
    .service('StudyFormService', StudyFormService)
    .service('FormVersionService', FormVersionService);

  FormService.$inject = ['ResourceFactory', 'API'];
  StudyFormService.$inject = ['$resource', 'API'];
  FormVersionService.$inject = ['$resource', 'API'];

  function FormService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('form'));
  }

  function StudyFormService($resource, API) {
    return $resource(
      API.url() + '/study/:studyID/forms/:formID',
      {
        formID: '@formID',
        studyID: '@studyID'
      },
      {
        'save' : {
          method: 'POST',
          isArray: false,
          transformResponse: _.transformHateoas
        },
        'delete' : {
          method: 'DELETE',
          isArray: false,
          transformResponse: _.transformHateoas
        }
      }
    );
  }

  function FormVersionService($resource, API) {
    return $resource(API.url() + '/formversion');
  }

})();
