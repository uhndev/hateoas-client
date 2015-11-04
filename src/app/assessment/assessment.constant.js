(function () {
    'use strict';
    angular
        .module('dados.assessment.constants', ['dados.constants'])
        .service('ASSESSMENT_API', Assessment);


    Assessment.$inject = ['API'];


    function Assessment(API) {
        return {url: API.url() + '/assessment/:id'};
    }


})();
