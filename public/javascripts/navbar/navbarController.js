(function(){
  //initialize the angular app and inject dependencies.
  angular.module("olinbaja.navbar.controller", [])
    .controller('NavbarController', NavbarController);

  function NavbarController($http, $location) {
    var vm = this;
    vm.isLoggedIn = false;
    vm.isAdmin = false;
    vm.isPurchaseManaging = false;

    $http.post('/auth/user', {}).then(
      function success(response) {
        if (response.status == 200) {
          vm.isLoggedIn = true;
        }
        if (response.data.admin) {
          vm.isAdmin = true;
          vm.isPurchaseManaging = true;
        }
        if (response.data.purchaseManager) {
          vm.isPurchaseManaging = true;
        }
      }, function error(response) {
      });

    vm.isActive = function(path) {
      return path === $location.path();
    }
  }
})();
