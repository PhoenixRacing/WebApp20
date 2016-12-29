(function(){
	//initialize the angular app and inject dependencies.
	angular.module("olinbaja", [
    'olinbaja.login',
    'olinbaja.logout',
    'olinbaja.car',
    'olinbaja.admin',
    'olinbaja.team',
    'olinbaja.donor',
    'olinbaja.signup',
    'olinbaja.gallery',
    'olinbaja.purchases',
    'olinbaja.resetPassword',
    'olinbaja.forgotPassword',
    'olinbaja.profileimage',
    'olinbaja.navbar'
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
