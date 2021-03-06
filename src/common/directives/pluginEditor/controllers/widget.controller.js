(function() {
  'use strict';

  angular
    .module('dados.common.directives.pluginEditor.widgetController', [
      'dados.common.directives.pluginEditor.expressionModalController',
      'dados.common.directives.pluginEditor.widgetService'
    ])
    .controller('WidgetController', WidgetController);

  WidgetController.$inject = ['$scope', '$uibModal', 'WidgetService'];

  function WidgetController($scope, $uibModal, WidgetService) {
    $scope.widget = $scope.questions[$scope.selectedIndex];
    $scope.categories = WidgetService.categories;
    $scope.widgetTypes = [];
    _.each(WidgetService.categories, function (category, categoryName) {
      _.each(category, function (type) {
        $scope.widgetTypes.push({
          'name' : type.charAt(0).toUpperCase() + type.slice(1),
          'template' : type,
          'category' : categoryName,
        });
      });
    });

    $scope.unsorted = function(obj) {
      if (!obj) {
        return [];
      }
      return Object.keys(obj);
    };

    var widgetExtend = function(source) {
      var widgets = Array.prototype.slice.call(arguments);

      if (widgets && widgets.length) {
        var copy = {};
        widgets.map(function(widget) {
          for (var prop in widget) {
            if (widget.hasOwnProperty(prop)) {
              var property = widget[prop];
              /***
               * NOTE: Javascript considers Arrays as objects, so to
               * avoid converting arrays to objects, check for arrays.
               **/
              if (angular.isObject(property) && !angular.isArray(property)) {
                copy[prop] = widgetExtend(copy[prop], property);
              } else {
                copy[prop] = property;
              }
            }
          }
        });
        return copy;
      }

      return {};
    };

    var bindList = function() {
      if (angular.isDefined($scope.widget.properties.options)) {
        $scope.$broadcast('setList', $scope.widget.properties.options);
      }
    };

    $scope.$watch('widget.template', function(newType, oldType) {
      if (newType) {
        if (newType != oldType) {
          var question = widgetExtend(WidgetService.templates[newType], $scope.widget);
          $scope.questions[$scope.selectedIndex] = angular.copy(question);
          $scope.widget = $scope.questions[$scope.selectedIndex];
          bindList();
        }
      }
    });

    $scope.$on('setWidget', function(e, widget) {
      var question = widgetExtend(WidgetService.templates[newType], $scope.widget);
      $scope.widget = angular.copy(question);
    });

    $scope.$on('listControllerLoaded', function(e) {
      bindList();
    });

    $scope.$on('getWidget', function(e) {
      $scope.$emit('returnWidget', $scope.widget);
    });

    $scope.createExpression = function(property, fields) {
      var modal = $uibModal.open({
        templateUrl: 'directives/pluginEditor/partials/WidgetEditorCreateExpression.tpl.html',
        controller: 'ExpressionModalController',
        resolve: {
          title: function() {
            return [property, 'when...'].join(' ');
          },
          fieldNames: function() {
            return fields;
          },
          expression: function() {
            if (angular.isDefined($scope.widget) &&
                angular.isDefined($scope.widget.properties) &&
                angular.isDefined($scope.widget.properties[property]) &&
                angular.isString($scope.widget.properties[property])) {
              return $scope.widget.properties[property].split(' ');
            }
            return undefined;
          }
        }
      });

      modal.result.then(function(expression) {
        if (expression === undefined) {
          delete $scope.widget.properties[property];
        } else {
          $scope.widget.properties[property] = expression;
        }
      });
    };

    $scope.$watch('selectedIndex', function() {
      $scope.widget = $scope.questions[$scope.selectedIndex];
    });

    $scope.$emit('widgetControllerLoaded');
  }

})();
