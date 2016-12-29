(function(){
  angular.module('olinbaja.navbar.directive', [])
    .directive('navbar', function() {
      return {
        restrict: 'E',
        templateUrl: './pages/navbar.html'
      };
    });
})();
