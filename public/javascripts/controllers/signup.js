(function(){
	//initialize the angular app and inject dependencies.
	angular.module("olinbaja.signup", ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/signup', {
          templateUrl: './pages/signup.html',
          controller: 'SignupController',
          controllerAs: 'vm'
        })

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    })
    .controller('SignupController', SignupController);

  function SignupController($http, $window) {
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
      if (!user.email || user.email === '')
      {
        vm.error('Please provide a valid e-mail');
        return;
      }
      if (!user.password || user.password === '') {
        vm.error('Please provide a valid password');
        return;
      }
      if (!user.username || user.username === '') {
        vm.error('Please provide a valid username');
        return;
      }
      if (!user.major || user.major === '') {
        vm.error('Please provide a valid major');
        return;
      }

      vm.signup(user);
    };

    vm.signup = function(user) {
      var body = {
        'email': user.email,
        'password': user.password,
        'username': user.username,
        'major': user.major
      }

      $http.post('/auth/signup', body).then(
        function success(response) {
          if (response.status == 200) {
            $window.location = "/";
          }
        }, function error(response) {
          if (response.status == 401) {
            vm.error('There was a problem with your signup.');
          }
        }
      );
    }

    vm.error = function(error) {
      vm.errorMessage = error;
    }
  }
})();