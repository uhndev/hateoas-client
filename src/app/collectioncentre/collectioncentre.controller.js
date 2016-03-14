(function() {
  'use strict';
  angular
    .module('dados.collectioncentre', [
      'dados.collectioncentre.service',
      'dados.common.directives.simpleTable'
    ])
    .controller('CollectionCentreOverviewController', CollectionCentreOverviewController);

  CollectionCentreOverviewController.$inject = [
    '$scope', '$resource', '$location', 'API', 'HeaderService'
  ];

  function CollectionCentreOverviewController($scope, $resource, $location, API, HeaderService) {
    var vm = this;

    // bindable variables
    vm.allow = '';
    vm.title = '';
    vm.template = {};
    vm.resource = {};
    vm.centreInfo = {};
    vm.url = API.url() + $location.path();

    // bindable methods

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Resource = $resource(vm.url);

      Resource.get(function(data, headers) {
        vm.allow = headers('allow');
        vm.template = data.template;
        vm.resource = angular.copy(data);
        var robj = _.pick(data.items, 'name', 'study', 'contact');
        vm.title = data.items.name;

        // initialize submenu
        HeaderService.setSubmenu('study', data.links);

        vm.centreInfo = {
          rows: {
            'name': {title: 'COMMON.MODELS.COLLECTION_CENTRE.NAME', type: 'text'},
            'study': {title: 'COMMON.MODELS.STUDY.IDENTITY', type: 'study'},
            'contact': {title: 'COMMON.MODELS.COLLECTION_CENTRE.CONTACT', type: 'user'}
          },
          tableData: _.objToPair(robj)
        };

        vm.centreUsers = {
          tableData: data.items.coordinators || [],
          columns: ['Username', 'Email', 'Person', 'Role']
        };

        var subjectColumns = ['Subject ID'];
        // add columns for keys in studyMapping
        _.forIn(_.first(data.items.subjects).studyMapping, function (value, key) {
          subjectColumns.push(_.capitalize(key));
        });
        subjectColumns.push('Date of Event');

        var modSubjects = _.map(data.items.subjects, function (subject) {
          subject.subjectNumber = _.pad(subject.subjectNumber, 7);
          return subject;
        });

        vm.centreSubjects = {
          tableData: modSubjects || [],
          columns: subjectColumns
        };
      });
    }

    $scope.$on('hateoas.client.refresh', function() {
      init();
    });
  }
})();
