(function() {
  'use strict';

  angular
    .module('dados.subjectportal', [
      'dados.subjectportal.controller',
      'dados.subjectportal.surveys.controller',
      'dados.subjectportal.profile.controller',
      'dados.subjectportal.service'
    ])
    .config(function config( $urlRouterProvider, $stateProvider, $mdThemingProvider ) {
      $mdThemingProvider.definePalette('dadosPalette', {
        '50': 'ffebee',
        '100': 'ffcdd2',
        '200': 'ef9a9a',
        '300': 'e57373',
        '400': 'ef5350',
        '500': 'f44336',
        '600': 'e53935',
        '700': 'd32f2f',
        '800': 'c62828',
        '900': 'b71c1c',

        'A100': '00538B', // header
        'A200': '3B7EAC', // subheader
        'A400': 'B1CBDF', // submenu
        'A700': 'E79949', // accent
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                            // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
          '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
      });

      $mdThemingProvider.theme('header')
        .accentPalette('orange')
        .primaryPalette('light-blue', {
          'default': '800'
        });
      //.accentPalette('dadosPalette', {
      //  'default': 'A200'
      //});

      // Configure a dark theme with primary foreground yellow
      $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('light-blue')
        .dark();

      $urlRouterProvider.when('/subjectportal', '/subjectportal/surveys');
      $stateProvider
        .state( 'subjectportal' , {
          abstract: true,
          url: '/subjectportal',
          controller: 'SubjectPortalController',
          controllerAs: 'sp',
          templateUrl: 'subjectportal/subjectportal.tpl.html'
        })
        .state( 'subjectportal.surveys', { // default child state for subject portal
          url: '/surveys',
          controller: 'SubjectPortalScheduleController',
          controllerAs: 'schedule',
          templateUrl: 'subjectportal/surveys/surveys.tpl.html',
          data: {
            fullUrl: '/subjectportal/surveys'
          }
        })
        .state( 'subjectportal.profile', {
          url: '/profile',
          controller: 'SubjectPortalProfileController',
          controllerAs: 'profile',
          templateUrl: 'subjectportal/profile/profile.tpl.html',
          data: {
            fullUrl: '/subjectportal/profile'
          }
        });
    });

})();
