angular.module('dados.form.service', ['ngResource'])
       .constant('FORM_API', 'http://localhost:1337/api/form')
       .factory('Form', ['FORM_API', '$resource',
  function FormService(url, $resource) {
    'use strict';
    var Form = $resource(url + '/:id', {id : '@id'}, {
      'query'  : { method: 'GET', isArray: false },
      'update' : { method: 'PUT' }
    });

    Form.set = function(data, onSuccess, onError) {
      var state = new Form(data);
      if (_.has(state, 'id')) {
        state.$update().then(onSuccess).catch(onError);
      } else {
        state.$save().then(onSuccess).catch(onError);
      }
      return state;
    };

    Form.archive = function(data) {
      if (_.has(data, 'id')) {
        return Form.remove(data);
      }
      return null;
    };

    return Form;
  }
]);