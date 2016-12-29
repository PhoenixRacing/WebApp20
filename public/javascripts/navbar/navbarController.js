(function(){
  //initialize the angular app and inject dependencies.
  angular.module("olinbaja.navbar.controller", [])
    .controller('NavbarController', NavbarController);

  function NavbarController($http, $location) {
    var vm = this;
    vm.isLoggedIn = false;
    vm.isAdmin = false;

    $http.post('/auth/isAuthenticated', {}).then(
      function success(response) {
        if (response.status == 200) {
          vm.isLoggedIn = true;
        }
      }, function error(response) {
      }
    );

    $http.post('/auth/isAdmin', {}).then(
      function success(response) {
        if (response.status == 200) {
          vm.isAdmin = true;
        }
      }, function error(response) {
      }
    );

    vm.isActive = function(path) {
      return path === $location.path();
    }
  }
})();
