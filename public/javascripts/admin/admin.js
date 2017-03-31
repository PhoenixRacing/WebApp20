(function(){
  //initialize the angular app and inject dependencies.
  angular.module("olinbaja.admin", ['ngRoute', 'ngFileUpload'])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/admin', {
          templateUrl: './pages/admin.html',
          controller: 'AdminController',
          controllerAs: 'vm',
          css: './css/admin.css'
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

    vm.edit = function(user, key, value) {
      var body = {
        userId: user._id,
      };
      body[key] = value;

      $http({
        method: 'POST',
        url: '/team/edit',
        data: body
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