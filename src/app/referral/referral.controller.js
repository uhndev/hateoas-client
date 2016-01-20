/**
 * Created by calvinsu on 2016-01-11.
 */
(function () {
    'use strict';

    angular
        .module('altum.referral',[])
        .controller('ReferralController', ReferralController);

    ReferralController.$inject = ['$scope', '$resource', '$location', 'API', 'HeaderService', 'AltumAPIService'];

    /* @ngInject */
    function ReferralController($scope, $resource, $location, API, HeaderService,AltumAPI) {
        var vm = this;
        vm.title = 'ReferralController';
        vm.url = API.url() + $location.path();
        vm.noteUrl = vm.url + '/notes';
        vm.noteTypes = AltumAPI.NoteType.query({});

        init();

        ////////////////

        function init() {
            var Resource = $resource(vm.url);

            Resource.get(function(data, headers) {
                vm.allow = headers('allow');
                vm.template = data.template;
                vm.resource = angular.copy(data);
             //   var robj = _.pick(data.items, 'name', 'study', 'contact');
                vm.title = data.items.name;
                vm.notes = data.items.notes;
                //test data
             //   vm.noteTypes = [{id: 1, name: 'Internal', iconClass: 'fa fa-edit'},{id: 2, name: 'External', iconClass: 'fa fa-external-link'}];

                // initialize submenu
                HeaderService.setSubmenu('client', data.links);


            });
        }

        $scope.$on('hateoas.client.refresh', function() {
            init();
        });
    }

})();

