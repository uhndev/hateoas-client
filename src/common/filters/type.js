angular.module('dados.filters.type', [])
  .filter('isArray', function () {
    return angular.isArray;
  })
  .filter('isObject', function () {
    return angular.isObject;
  })
  .filter('isString', function () {
    return angular.isString;
  });
