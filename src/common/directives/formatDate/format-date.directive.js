/**
 * @name format-date
 * @description Used for bound input date fields whose ng-model may not necessarily be a date object.
 * @example
 *    <input type="date" ng-model="possibleDate" format-date/>
 *
 */
(function () {
  'use strict';

  angular
    .module('dados.common.directives.formatDate', [])
    .directive('formatDate', formatDate);

  formatDate.$inject = ['$parse'];

  function formatDate($parse) {
    var directive = {
      restrict: 'A',
      require: ['ngModel'],
      link: link
    };

    return directive;

    ///////////////////////////////////////////////////////////////////////////

    function link(scope, element, attr, ctrls) {
      var ngModelController = ctrls[0];

      // called with a JavaScript Date object when picked from the datepicker
      ngModelController.$parsers.push(function (viewValue) {
        // undo the timezone adjustment we did during the formatting
        viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());

        if (_.has(attr, 'type') && attr.type === 'datetime-local' || attr.type === 'datetime') {
          // we just want a local datetime in ISO format
          return viewValue;
        } else {
          // we just want a local date in ISO format
          return viewValue.toISOString().substring(0, 10);
        }
      });

      // called with a 'yyyy-mm-dd' string to format
      ngModelController.$formatters.push(function (modelValue) {
        if (!modelValue) {
          return undefined;
        }
        // date constructor will apply timezone deviations from UTC (i.e. if locale is behind UTC 'dt' will be one day behind)
        var datetime = new Date(modelValue);
        // 'undo' the timezone offset again (so we end up on the original date again)
        datetime.setMinutes(datetime.getMinutes() + datetime.getTimezoneOffset());
        return datetime;
      });
    }
  }

})();

