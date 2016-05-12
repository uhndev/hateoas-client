(function () {
  'use strict';

  angular
    .module('dados.common.services.email', [
      'dados.constants'
    ]).service('EmailService', EmailService);

  EmailService.$inject = ['API', '$http', 'toastr'];

  function EmailService(API, $http, toastr) {
    return {
      sendEmail: function (emailData) {

        $http.post(API.url() + '/email', emailData).then(function success(response) {
          toastr.success('Email sent');

        }, function error(response) {
          toastr.error('There is something wrong please contact your admin');

        });
      }
    };
  }
})();
