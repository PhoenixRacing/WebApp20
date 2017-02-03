(function(){
  //initialize the angular app and inject dependencies.
  angular.module("olinbaja.admin", ['ngRoute', 'ngFileUpload'])
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

  function AdminController($http, $window, Upload) {
    var vm = this;

    function reloadTeam() {
      $http({
        method: 'POST',
        url: '/team/data'
      }).then(function successCallback(response) {
        vm.team = response.data;
      }, function errorCallback(response) {
      });
    }

    vm.editAdmin = function(user, makeAdmin) {
      $http({
        method: 'POST',
        url: '/team/editAdmin',
        data: {
          userId: user._id,
          admin: makeAdmin
        }
      }).then(function successCallback(response) {
        reloadTeam();
      }, function errorCallback(response) {
      });
    };

    vm.editPurchaser = function(user, makePurchaser) {
      $http({
        method: 'POST',
        url: '/team/editPurchaseManager',
        data: {
          userId: user._id,
          purchaseManager: makePurchaser
        }
      }).then(function successCallback(response) {
        reloadTeam();
      }, function errorCallback(response) {
      });
    };

    vm.removeUser = function(user) {
      $http({
        method:'POST',
        url: '/team/delete',
        data: {
          userId: user._id
        }
      }).then(function successCallback(response) {
        reloadTeam();
      }, function errorCallback(response) {
      });
    };

    $http.post('/auth/isAdmin', {}).then(
      function success(response) {
        reloadTeam();
      }, function error(response) {
        if (response.status == 401) {
          $window.location = "/";
        } else {
          $window.location = "/login?next=/admin";
        }
      }
    );
  }
})();