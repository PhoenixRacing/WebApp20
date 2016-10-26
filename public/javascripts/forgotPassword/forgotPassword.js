(function(){
  //initialize the angular app and inject dependencies.
  angular.module("olinbaja.forgotPassword", ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/forgotPassword', {
          templateUrl: './pages/forgotPassword.html',
          controller: 'ForgotPasswordController',
          controllerAs: 'vm'
        })

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    })
    .controller('ForgotPasswordController', ForgotPasswordController);

  function ForgotPasswordController($http, $window) {
    var vm = this;

    $http.post('/auth/isAuthenticated', {}).then(
      function success(response) {
        if (response.status == 200) {
          $window.location = "/";
        }
      }, function error(response) {
      }
    );

    vm.submit = function(email) {
      var body = {
        'email': email
      }

      $http.post('/auth/forgotPassword', body).then(
        function success(response) {
          $window.location = '/login';
        }, function error(response) {
          console.log(response);
          // TODO: Show error.
        }
      );
    }

    vm.error = function(error) {
      vm.errorMessage = error;
    }
  }
})();