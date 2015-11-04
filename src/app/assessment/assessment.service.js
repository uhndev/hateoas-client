/**
 * Data service for handling all Assessment data
 */
(function() {
  'use strict';

  angular
    .module('dados.arm.assessment.service',
      [
          'dados.assessment.constants',
          'dados.common.services.resource'
      ])
      .service('AssessmentService', AssessmentService);

  AssessmentService.$inject = ['ResourceFactory','ASSESSMENT_API'];

  function AssessmentService(ResourceFactory,ASSESSMENT_API) {
    return ResourceFactory.create(ASSESSMENT_API.url);
  }


})();
