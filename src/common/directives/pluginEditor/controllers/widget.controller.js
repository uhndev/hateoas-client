(function() {
  'use strict';

  angular
    .module('dados.common.directives.pluginEditor.widgetController', [
      'dados.common.directives.pluginEditor.expressionModalController',
      'dados.common.directives.pluginEditor.widgetService'
    ])
    .controller('WidgetController', WidgetController);

  WidgetController.$inject = ['$scope', '$modal', 'WidgetService'];

  function WidgetController($scope, $modal, WidgetService) {
    $scope.categories = WidgetService.categories;
    $scope.widget = $scope.questions[$scope.selectedIndex];
	
    $scope.unsorted = function(obj){
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
          $scope.questions[$scope.selectedIndex] = widgetExtend(WidgetService.templates[newType], $scope.widget);
          $scope.widget = $scope.questions[$scope.selectedIndex];
          bindList();
        }
      }
    });
    
    $scope.$on('setWidget', function(e, widget) {
      //$scope.widget = widgetExtend(WidgetService.templates[widget.template], widget);
      $scope.widget = $scope.questions[$scope.selectedIndex];
    });
    
    $scope.$on('listControllerLoaded', function(e) {
      bindList();
    });
    
    $scope.$on('getWidget', function(e) {
      $scope.$emit('returnWidget', $scope.widget);
    });
    
    $scope.createExpression = function(property, fields) {
      var modal = $modal.open({
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