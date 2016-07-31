(function(){
  //initialize the angular app and inject dependencies.
  angular.module("olinbaja.admin", ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/admin', {
          templateUrl: './pages/admin.html',
          controller: 'AdminController',
          controllerAs: 'vm'
        });

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    })
    .controller('AdminController', AdminController);

  function AdminController($http, $window) {
    var vm = this;

    function reloadTeam() {
      $http({
        method:'GET',
        url: '/teamdata'
      }).then(function successCallback(response) {
        vm.team = response.data;
      }, function errorCallback(response) {
        console.log(response);
      });
    }

    vm.editAdmin = function(user, isAdmin) {
      console.log(user);
      $http({
        method:'POST',
        url: '/admin/edit',
        data: { 
          userId: user._id,
          isAdmin: isAdmin
        }
      }).then(function successCallback(response) {
        console.log(response);
        reloadTeam();
      }, function errorCallback(response) {
        console.log(response);
      });
    };

    vm.removeUser = function(user) {
      $http({
        method:'POST',
        url: '/admin/deleteUser',
        data: { 
          userId: user._id
        }
      }).then(function successCallback(response) {
        console.log(response);
        reloadTeam();
      }, function errorCallback(response) {
        console.log(response);
      });
    };

    $http.get('/auth/isAdmin', {}).then(
      function success(response) {
        console.log(response);
        reloadTeam();
      }, function error(response) {
        console.log(status);
        if (response.status == 401) {
          $window.location = "/";
        } else {
          $window.location = "/login?next=/#/admin";
        }
      }
    );
  }
})();