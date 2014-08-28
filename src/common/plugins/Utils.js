/**
 * Utility functions that can be reused as a lodash mixin
 * usage: _.capitalize(str);
 */
(function() {
  _.mixin({ 

    "capitalize" : function(string) {
      return string.replace(/[^\s\\]/, function(m){ return m.toUpperCase() });
    }

  });
})();

