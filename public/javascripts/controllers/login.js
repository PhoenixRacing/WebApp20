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

  function LoginController($rootScope, $http, $window) {
    var vm = this;

    $http.post('/auth/isAuthenticated', {}).then(
      function success(response) {
        if (response.status == 200) {
          $window.location = "/";
        }
      }, function error(response) {
      }
    );

    vm.submit = function(user) {
      $rootScope.errorMessages = [];
      if (!user || !user.email || user.email === '')
      {
        $rootScope.errorMessages.push('Please provide a valid e-mail');
        return;
      }
      if (!user.password || user.password === '') {
        $rootScope.errorMessages.push('Please provide a valid password');
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
            $window.location = "/";
          }
        }, function error(response) {
          if (response.status == 401) {
            $rootScope.errorMessages.push('There was a problem with your login.');
          }
        }
      );
    }
  }
})();
