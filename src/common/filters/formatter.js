angular.module('dados.filters.formatter', [])
  .filter('formatter', function() {

    function pad(input, width, padding) {
      padding = padding || '0';
      input = input + '';

      return (input.length >= width ? 
                input : 
                new Array(width - input.length + 1)
                  .join(padding) + input);
    }

    return function(input, template) {
      if (!_.isNull(input) && !_.isUndefined(input)) {
        if (/date/i.test(template.type)) {
          return input.substring(0, input.indexOf('T'));
        }
  
        if (/array/i.test(template.type)) {
          return input.length;
        }
  
        if (/mrn/i.test(template.name) && 
             String(input).length < 7) {
          return pad(input, 7);
        }
      }

      return input;
    };
  });
