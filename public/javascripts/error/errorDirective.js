(function() {
  angular.module('olinbaja.error.directive', [])
    .directive('errorMessage', function() {
      return {
        restrict: 'E',
        templateUrl: './pages/error.html'
      };
    });
})();
