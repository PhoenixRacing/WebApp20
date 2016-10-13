(function(){
	//initialize the angular app and inject dependencies.
	angular.module("olinbaja", [
    'ngRoute',
    'olinbaja.login',
    'olinbaja.car',
    'olinbaja.admin',
    'olinbaja.team',
    'olinbaja.donor',
    'olinbaja.signup',
    'olinbaja.gallery',
    'olinbaja.purchases'
  ])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: './pages/home.html'
      })
      .otherwise({
        templateUrl: './pages/404.html'
      });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  });
})();
