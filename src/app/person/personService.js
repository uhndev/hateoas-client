angular.module('dados.person.service', ['ngResource'])
       .constant('PERSON_API', 'http://localhost:1337/api/person')
       .factory('Person', 
         ['PERSON_API', '$resource', HATEOAS.createService()]);
