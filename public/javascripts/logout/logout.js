(function(){
	//initialize the angular app and inject dependencies.
	angular.module("olinbaja.logout", ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/logout', {
          templateUrl: './pages/logout.html',
          controller: 'LogoutController',
          controllerAs: 'vm'
        })

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    })
    .controller('LogoutController', LogoutController);

  function LogoutController($http, $window) {
    var vm = this;

    console.log('hi');

    $http.post('/auth/logout', {}).then(
      function success(response) {
        $window.location = "/";
      }, function error(response) {
        $window.location = "/";
      }
    );
  }
})();