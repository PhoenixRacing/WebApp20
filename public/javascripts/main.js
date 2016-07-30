(function(){
	//initialize the angular app and inject dependencies.
	var app = angular.module("olinbaja", [
    'ngRoute',
    'olinbaja.login',
    'olinbaja.car',
    'olinbaja.admin',
    'olinbaja.team'
  ]);

	app.config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl : './pages/home.html'
      })

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  });
})();