(function() {
  angular.module('olinbaja.user.directive', [])
    .directive('user', function() {
      return {
        restrict: 'E',
        templateUrl: './pages/user.html',
        css: './css/user.css',
	    scope: {
	      user: '='
	    },
      };
    });
})();
