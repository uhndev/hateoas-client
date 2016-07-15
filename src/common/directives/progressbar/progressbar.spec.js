describe('Progressbar directive', function() {
  var element;
  var $scope;

  beforeEach(module('dados.common.directives.progressbar'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $scope = _$rootScope_;

    element = angular.element('<uib-progressbar value="value">{{value}}%</uib-progressbar>');

    _$compile_(element)(_$rootScope_);

  }));
  it('Should update progressbar', function() {

    $scope.$broadcast('NextIndicator', 30);
    $scope.$digest();
    expect(element.html()).toBe('30%');
    $scope.$broadcast('NextIndicator', 90);
    $scope.$digest();
    expect(element.html()).toBe('90%');

  });

});
