(function(){
  //initialize the angular app and inject dependencies.
  angular.module("olinbaja.resetPassword", ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/resetPassword', {
          templateUrl: './pages/resetPassword.html',
          controller: 'ResetPasswordController',
          controllerAs: 'vm'
        })

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    })
    .controller('ResetPasswordController', ResetPasswordController);

  function ResetPasswordController($http, $window) {
    var vm = this;

    vm.submit = function(user) {
      var body = {
        'email': user.email,
        'oldPassword': user.oldPassword,
        'newPassword': user.newPassword
      }

      $http.post('/auth/resetPassword', body).then(
        function success(response) {
          vm.user = [];
          // TODO: Post success message to user.
        }, function error(response) {
          console.log(response);
          // TODO: Show the user an error message.
        }
      );
    }

    vm.error = function(error) {
      vm.errorMessage = error;
    }
  }
})();