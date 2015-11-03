(function() {
	'use strict';
	angular
    .module('dados.study', [
      'dados.study.controller',
      'dados.study.user',
      'dados.study.subject',
      'dados.study.form',
      'dados.study.survey',
      'dados.study.service'
    ])
    .config(function config( $translatePartialLoaderProvider ) {
      $translatePartialLoaderProvider.addPart('study-overview');
    });
})();
