(function () {
  'use strict';

  angular
    .module('altum.report.controller',[])
    .controller('RecommendationReportController', RecommendationReportController);

  RecommendationReportController.$inject = ['$scope'];

  /* @ngInject */
  function RecommendationReportController($scope) {
    var vm = this;
    vm.title = 'Recommendation Report';
    $scope.report = {
      //resource: "/public/Samples/Reports/9.CustomerDetailReport",
      //params:{"customerId": [4031]}
      resource: '/reports/Altum_CMS_Report',
      params: {'status': ['approved']}
    };

    activate();

    ////////////////

    function activate() {
    }
  }

})();

