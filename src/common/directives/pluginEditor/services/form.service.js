(function() {
  'use strict';
  angular
    .module('dados.common.directives.pluginEditor.formService', [
      'dados.constants',
      'dados.form.constants',
      'dados.common.services.resource'
    ])
    .factory('FormService', FormService)
    .factory('StudyFormService', StudyFormService);

  FormService.$inject = ['ResourceFactory', 'FORM_API'];
  StudyFormService.$inject = ['$resource', 'API'];

  function FormService(ResourceFactory, FORM_API) {
    return ResourceFactory.create(FORM_API.url);
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

})();
