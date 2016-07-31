(function(){
	//initialize the angular app and inject dependencies.
	angular.module("olinbaja.login", ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/login', {
          templateUrl: './pages/login.html',
          controller: 'LoginController',
          controllerAs: 'vm'
        })

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    })
    .controller('LoginController', LoginController);

  function LoginController($http, $window) {
    var vm = this;

    $http.get('/auth/isAuthenticated', {}).then(
      function success(response) {
        if (response.status == 200) {
          $window.location = "/profile";
        }
      }, function error(response) {
      }
    );

    vm.submit = function(user) {
      console.log(user.email);
      if (!user.email || user.email === '')
      {
        vm.error('Please provide a valid e-mail');
        return;
      }
      if (!user.password || user.password === '') {
        vm.error('Please provide a valid password');
        return;
      }

      vm.login(user);
    };

    vm.login = function(user) {
      var body = {
        'email': user.email,
        'password': user.password
      }

      $http.post('/auth/login', body).then(
        function success(response) {
          if (response.status == 200) {
            $window.location = "/profile";
          }
          console.log(response);
        }, function error(response) {
          if (response.status == 401) {
            vm.error('There was a problem with your login.');
          }
        }
      );
    }

    vm.error = function(error) {
      vm.errorMessage = error;
    }
  }
})();