(function() {
  'use strict';

  angular
    .module('dados.common.directives.pluginEditor.uiListEditorController', [
    ])
    .controller('UiListEditorController', UiListEditorController);

  UiListEditorController.$inject = ['$scope', '$element'];

  function UiListEditorController($scope, $element) {
    /** private variable: template
     * This variable is a buffer for the template structure. We can
     * modify this to ensure that the data models are synchronized.
     * Whenever the template is modified, the item structure should be
     * modified. 
     * 
     * Currently, this is done manually by calling "resetItem",
     * however, when complexity increases, consider using a watch on
     * $scope.template. That way, any time $scope.template changes,
     * $scope.item will automatically update.
     */
    var template = { 
      name: {
        label: 'Item Name',
        template: 'text',
        name: 'ITEM_NAME',
        canRename: false,
        answer : { value: '' },
        properties : {
          title: 'Provide a name for this item.'
        }
      }, 
      value: {
        label: 'Item Value',
        template: 'text',
        name: 'ITEM_VALUE',
        canRename: false,
        answer: { value : '' },
        properties : {
          title: 'Provide a value for this item.'
        }
      }
    };
    
    /** public variable canEditProperties
     * Specifies whether or not to enable editting of object properties.
     */
    $scope.canEditProperties = $scope.canEditProperties() || false;
    
    /** public variable list
     * A temporary object that must have the same key structure as 
     * template. Used to store data that will be added to the list.
     */
    $scope.item = {};
    
    /** public variable itemBuffer
     * A temporary object that contains a copy of the item being
     * edited. 
     */
    $scope.itemBuffer = {};
    
    /** public variable editMode
     * A pointer to an item in the list that is currently being modified.
     * Whenever an item isn't being modified, this should be set to -1.
     */
    $scope.editMode = -1;
    
    /**
     * Adds an item to the list
     */
    $scope.addItem = function() {
      var item = {};
      for (var key in $scope.item) {
        item[key] = $scope.item[key].value;
      }
      $scope.list.push(item);
      $scope.resetItem();
    };
    
    /**
     * Initializes an item for editting
     */
    $scope.editItem = function(index) {
      $scope.editMode = index;
      $scope.itemBuffer = {};
      var item = $scope.list[index];
      for (var key in item) {
        $scope.itemBuffer[key] = { value: item[key] };
      }
    };
    
    /**
     * Removes an item from the list
     */
    $scope.removeItem = function(index) {
      $scope.list.splice(index, 1);
    };
    
    /**
     * Since list is bound to the UI, clears the item
     */
    $scope.updateItem = function(index) {
      $scope.list[index] = {};
      var buffer = $scope.itemBuffer;
      for (var key in buffer) {
        $scope.list[index][key] = buffer[key].value;
      }
      $scope.cancelEditItem();
    };
    
    /**
     * Adds a property to the item object model. All item objects will
     * default to a text box input. For future, allow it to be 
     * configurable
     */
    $scope.addProperty = function(key) {
      if ($scope.canEditProperties) {
        if (!template.hasOwnProperty(key)) {
          template[key] = {
              label: 'Item ' + capitalize(key),
              template: 'text',
              name: 'ITEM_' + key.toUpperCase(),
              canRename: true,
              answer : { value: '' },
              properties : {
                title: 'Provide a name for this item.'
              }
          };
          angular.forEach($scope.list, function(item) {
            item[key] = undefined;
          });
          $scope.resetItem();
        }
      }
    };
    
    /**
     * Remove a property from the item object model.
     */
    $scope.removeProperty = function(key) {
      if ($scope.canEditProperties) {
        if (template.hasOwnProperty(key)) {
          delete template[key];
          angular.forEach($scope.list, function(item) {
            delete item[key];
          });
        }
        $scope.resetItem();
      }
    };
    
    /**
     * Rename a property from the item object model.
     */
    $scope.renameProperty = function(oldKey, newKey) {
      if ($scope.canEditProperties) {
        if (!template.hasOwnProperty(newKey)) {
          template[newKey] = angular.copy(template[oldKey]);
          angular.forEach($scope.list, function(item) {
            item[newKey] = angular.copy(item[oldKey]);
          });
          $scope.removeProperty(oldKey);
        }
      }
    };

    /**
     * Cancels editting of an item object
     */
    $scope.cancelEditItem = function() {
      $scope.editMode = -1;
      $scope.itemBuffer = {};
    };
    
    /**
     * Resets the item back to its default template
     */
    $scope.resetItem = function() {
      $scope.template = angular.copy ( template );
      $scope.item = {};
      angular.forEach($scope.template, function(value, key) {
        $scope.item[key] = { value: '' };
      });
    };
    
    /**
     * Checks the item to see if all fields are filled out.
     */
    $scope.canAdd = function() {
      var result = true;
      angular.forEach($scope.item, function(item) {
        result = result && (item.value.length > 0);
      });
      return result;
    };
    
    if (angular.isDefined($scope.template())) {
      template = angular.copy ($scope.template());
      
    }
    $scope.template = angular.copy(template);
    
    $scope.resetItem();
  }

})();