angular.module( 'dados', [
	'templates-app',
	'templates-common',
	'dados.header',
	'dados.home',
	'dados.about',
	'dados.list-editor',
	'dados.formbuilder',
	'dados.workflow',
	'dados.error',
	'ui.router',
	// 'dados.common.services.csrf'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
	$urlRouterProvider.otherwise( '/home' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
		if ( angular.isDefined( toState.data.pageTitle ) ) {
			$scope.pageTitle = toState.data.pageTitle + ' | dados' ;
		}
	});
});

