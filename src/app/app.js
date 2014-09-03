angular.module( 'dados', [
	'templates-app',
	'templates-common',
  'status',
	'dados.auth',
	'dados.header',
  'dados.workflow',
  'dados.formbuilder',
	'dados.error',
    'dados.filters.formatter',
    'dados.filters.type',
   'hateoas',
    'hateoas.queryBuilder',
	// 'dados.common.services.csrf'
])
// Configure all Providers
//.config( function myAppConfig () { })
// Initialize application
//.run( function run () { })
.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {

  if (_.isEmpty($location.path())) {
    $location.path('/study');
  }

  $scope.$on('$locationChangeSuccess', function(e, current, prev) {
    $scope.pageTitle = _.titleCase($location.path()
                                     .replace(/\//g, ' ')
                                     .toLowerCase()
                                     .trim());
  });

  $scope.test = function() {
    $scope.$broadcast('status.update', {
      note: 'Hello, World!',
      type: 'info'
    });
  };

});
