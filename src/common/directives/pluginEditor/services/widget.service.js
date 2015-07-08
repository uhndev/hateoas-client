(function() {
  'use strict';
  angular
    .module('dados.common.directives.pluginEditor.widgetService', [])
    .service('WidgetService', WidgetService);

  function WidgetService() {
    var Widget = function(label, template, properties, answer) {
      this.label = label;
      this.template = template;
      this.properties = properties;
      this.css = {};
      
      if (answer) {
        this.answer = answer;
      } else {
        this.answer = { value: undefined };
      }
      
      var self = this;
      var ctor = function() {
        var flags = ['disabled', 'required', 'readonly'];
        
        for (var index in flags) {
          var flag = flags[index];
          if (!self.properties.hasOwnProperty(flag)) {
            self.properties[flag] = undefined;
          }
        }
      };
      
      ctor();
    };
  
    return {
      categories: {
        "Text Inputs" : ["text", "hidden", "email", "telephone", "textarea", "datalist"],
        "Numeric Inputs" : ["number", "range", "date", "time"],
        "List Inputs" : ["select", "radio", "checkbox"],
        "Other" : ["image", "output", "form"]
      },
      templates: {
        "hidden" : new Widget("Hidden", "hidden", {
          type: "hidden",
          maxlength: 256
        }),
        "text" : new Widget("Text Box", "text", {
              type : "text",
              maxlength : 256,
              size: undefined,
              pattern: undefined
        }),  
      }
    };
  }
  
})();

