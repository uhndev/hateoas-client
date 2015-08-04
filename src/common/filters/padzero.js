(function() {
  'use strict';
  angular
    .module('dados.filters.padzero', [])
    .filter('padzero', padzero);

  function padzero() {
    return function(input, n) {
      if (_.isUndefined(input)) {
        input = "";
      }
      if (input.length >= n) {
        return input;
      }
      var zeros = "0".repeat(n);
      return (zeros + input).slice(-1 * n);
    };
  }
})();

