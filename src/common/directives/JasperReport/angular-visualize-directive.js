/**
 The MIT License (MIT)
 Copyright (c) 2014 Rafael Garrido Romero
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 https://github.com/rgarom/angular-visualize-directive
 */

angular.module('angular-visualize-directive', [])
  .directive('visualize', function() {

    return {
      restrict: 'E',
      transclude: true,
      scope: {
        resource: '=',
        params: '='
      },
      template: '<div ng-transclude></div>',
      link: function (scope, element, attrs) {
        if (angular.isDefined(scope.resource)) {
          var opts = {
            lines: 13, // The number of lines to draw
            length: 0, // The length of each line
            width: 3, // The line thickness
            radius: 8, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb or array of colors
            speed: 1.2, // Rounds per second
            trail: 10, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: '50%', // Top position relative to parent
            left: '50%' // Left position relative to parent
          };
          var target = document.getElementById(element[0].id);
          var spinner = new Spinner(opts).spin(target);

          /* Configure your jasperserver connection */

          // var spinner = createSpinner();
          visualize(
            {
              auth: {
                name: 'calvinsu',
                password: 'S941130p',
                organization: 'organization_1'
              }
            },

            function (v) {

              var $select = buildControl('Export to: ', v.report.exportFormats),
                $button = $('#button'),

                zoom = 1,
                plus = document.getElementById('plus'),
                minus = document.getElementById('minus'),
                width = document.getElementById('width'),
                height = document.getElementById('height'),
                page = document.getElementById('page'),

                report = v.report({
                resource: scope.resource,
                params: scope.params,
                container: '#' + element[0].id,
                  scale: zoom = 0.9,

                success: function () {
                    button.removeAttribute('disabled');
                    spinner.stop();
                  },
                error: function () { //TODO handle error creating report
                }

              });

              plus.onclick = function () {
                report
                  .scale(zoom += 0.1)
                  .render();
              };

              minus.onclick = function () {
                report
                  .scale((zoom -= 0.1) > 0 ? zoom : zoom = 0.1)
                  .render();
              };

              width.onclick = function () {
                report
                  .scale('width')
                  .render();
              };

              height.onclick = function () {
                report
                  .scale('height')
                  .render();
              };

              page.onclick = function () {
                report
                  .scale('container')
                  .render();
              };

              $('#statusSelector').on('change', function () {
                report.params({
                  'Status_1': [$(this).val()]
                }).run();
              });

              var inputControls = v.inputControls({
                resource: scope.resource,
                success: renderInputControls
              });

              $button.click(function () {

                console.log($select.val());

                report.export({
                    //export options here
                    outputFormat: $select.val(),
                    //exports all pages if not specified
                    //pages: "1-2"
                  }, function (link) {
                    var url = link.href ? link.href : link;
                    window.location.href = url;
                  }, function (error) {
                    console.log(error);
                  });
              });

              function renderInputControls(data) {
                console.log(data);
                var productFamilyInputControl = _.findWhere(data, {id: 'Status_1'});
                var select = $('#statusSelector');
                _.each(productFamilyInputControl.state.options, function(option) {
                  select.append('<option ' + (option.selected ? 'selected' : '') + ' value=\'' +
                    option.value + '\'>' + option.label + '</option>');
                });
              }

              function buildControl(name, options) {

                function buildOptions(options) {
                  var template = '<option>{value}</option>';
                  return options.reduce(function (memo, option) {
                    return memo + template.replace('{value}', option);
                  }, '');
                }

                var template = '<label>{label}</label><select>{options}</select><br>',
                  content = template.replace('{label}', name)
                    .replace('{options}', buildOptions(options));

                var $control = $(content);
                $control.insertBefore($('#button'));
                //return select
                return $($control[1]);
              }

              $('#previousPage').click(function() {
                var currentPage = report.pages() || 1;

                report
                  .pages(--currentPage)
                  .run()
                  .fail(function(err) { alert(err); });
              });

              $('#nextPage').click(function() {
                var currentPage = report.pages() || 1;

                report
                  .pages(++currentPage)
                  .run()
                  .fail(function(err) { alert(err); });
              });

              report.refresh()
                .done(function () {
                  console.log('report loaded');
                  button.removeAttribute('disabled');
                  spinner.stop();
                })
                .fail(function () {
                  console.log('report error');
                })
                .always(function () {
                  spinner.stop();
                });
            },

            function (err) {
              alert('Auth error! Server said: ' + err.message);
            });
        }

        /* function createSpinner() {
           var container = $("#spinner");
           var spinner = new Spinner(opts).spin(container[0]);
           return container;
         } */
      }
    };
  });
