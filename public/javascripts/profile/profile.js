(function(){
  //initialize the angular app and inject dependencies.
  angular.module("olinbaja.profile", [])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/profile', {
          templateUrl: './pages/profile.html',
          controller: 'ProfileController',
          controllerAs: 'vm'
        });

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    })
    .controller('ProfileController', ProfileController);

  function ProfileController($http, $window) {
    var vm = this;

    vm.loadUser = function() {
      $http({
        method: 'POST',
        url: '/auth/user'
      }).then(function successCallback(response) {
        vm.user = response.data;
      }, function errorCallback(response) {
        $window.location = "/";
      });
    }

    vm.loadUser();
  }
})();
