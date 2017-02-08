(function(){
	//initialize the angular app and inject dependencies.
	angular.module("olinbaja", [
    'olinbaja.login',
    'olinbaja.logout',
    'olinbaja.car',
    'olinbaja.admin',
    'olinbaja.team',
    'olinbaja.donor',
    'olinbaja.donor.add',
    'olinbaja.signup',
    'olinbaja.gallery',
    'olinbaja.purchases',
    'olinbaja.resetPassword',
    'olinbaja.forgotPassword',
    'olinbaja.error',
    'olinbaja.profileimage',
    'olinbaja.galleryimage',
    'olinbaja.navbar',
    'olinbaja.profile',
    'olinbaja.utils',
    'olinbaja.purchase.manager'
  ])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/pages/home.html'
      })
      .otherwise({
        templateUrl: '/pages/404.html'
      });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  });
})();
