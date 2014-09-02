angular.module('dados.form', [])
  .factory('FormControlsControllerLaunch', function($location) {
    return function(button, selected) {
      if (button.method === 'delete') {
        console.log("Delete"); 
      } else {
        if (button.method === 'post') {
          $location.url('/formbuilder');
        } else {
          $location.url('/formbuilder?id=' + selected.id);
        }
      }
    };
  });
