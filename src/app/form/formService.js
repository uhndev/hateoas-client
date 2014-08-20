angular.module('dados.form.service', ['ngResource'])
       .constant('FORM_API', 'http://localhost:1337/api/form')
       .factory('Form', ['FORM_API', '$resource', HATEOAS.createService()]);