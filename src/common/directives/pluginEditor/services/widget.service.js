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
        "email" : new Widget("E-Mail", "email", {
          type : "email",
          maxlength: 256,
          size: undefined,
          pattern: undefined
        }),
        "telephone" : new Widget("Telephone", "telephone",  {
          type : "tel",
          maxlength: 256,
          size: undefined,
          pattern: undefined
        }),
        "textarea" : new Widget("Text Area", "textarea", {
          type : 'textarea',
          cols : 20,
          rows : 3,
          maxlength : 2048
        }),
        "number" : new Widget("Number", "number", {
          type : "number",
          min: undefined,
          max: undefined,
          step: 1,
          pattern: undefined
        }),
        "range" : new Widget("Range", "range", {
          type : "range",
          min: 0,
          max: 100,
          step: 1,
          units: undefined
        }, { value : undefined }),
        "date" : new Widget("Date", "date",  {
          type : "date",
          min: undefined,
          max: undefined
        }),
        "time" : new Widget("Time", "time", {
          type : "time",
          min: undefined,
          max: undefined
        }),
        "button" : new Widget("Button", "button", {type : "button"}),
        "reset" : new Widget("Reset", "reset", {type : "button"}),    
        "submit" : new Widget("Submit", "submit", {type : "button"}),
        "datalist" : new Widget("Data List", "datalist", {
          type : "text", 
          options: [],
          autocomplete: true
        }),
        "select" : new Widget("Drop Down List", "select", {
          type: "select", 
          options: []
        }),
        "radio" : new Widget("Radio List", "radio", {
          type : "radio", 
          options: [],
          cols: 1
        }),
        "checkbox" : new Widget("Check List", "checkbox", {
          type : "checkbox", 
          options: [],
          cols: 1
        }, {value: []}),
        "subform" : new Widget("Subform", "subform", {
          form : {}
        }),
        "image" : new Widget("Image", "image", {type : "image", data : ""}),
        "form" : new Widget("Sub-Form", "form", {
          type: "form",
          idForm: ""}),
        "output" : new Widget("Output", "output", {
          type: "output",
          expression: undefined
        })
      }
    };
  }
  
})();

