angular.module('dados.filters.formatter', [])
  .filter('formatter', function() {

    return function(input, template) {
      if (!_.isNull(input) && !_.isUndefined(input)) {
        if (/date/i.test(template.type)) {
          return input.substring(0, input.indexOf('T'));
        }

        if (/array/i.test(template.type)) {
          return input.length;
        }

        if (/mrn/i.test(template.type) &&
             String(input).length < 7) {
          return _.pad(input, 7);
        }
      }

      return input;
    };
  });
