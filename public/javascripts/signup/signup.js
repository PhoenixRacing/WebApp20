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

  function SignupController($http, $window, errorBus) {
    var vm = this;

    vm.isBusy = false;

    $http.post('/auth/isAuthenticated', {}).then(
      function success(response) {
        if (response.status == 200) {
          $window.location = "/";
        }
      }, function error(response) {
      }
    );

    vm.submit = function(user) {
      if (vm.isBusy) {
        return;
      }
      vm.isBusy = true;

      if (!user.email || user.email === '')
      {
        errorBus.emitError('Please provide a valid e-mail');
        vm.isBusy = false;
        return;
      }
      if (!(user.email.includes('olin.edu'))) {
        errorBus.emitError('Only Olin emails are valid for signup');
        vm.isBusy = false;
        return;
      }
      if (!user.password || user.password === '') {
        errorBus.emitError('Please provide a valid password');
        vm.isBusy = false;
        return;
      }
      if (!user.username || user.username === '') {
        errorBus.emitError('Please provide a valid username');
        vm.isBusy = false;
        return;
      }
      if (!user.major || user.major === '') {
        errorBus.emitError('Please provide a valid major');
        vm.isBusy = false;
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
            $window.location = "/uploadProfile";
          }
          vm.isBusy = false;
        }, function error(response) {
          if (response.status == 401) {
            errorBus.emitError(response.data.error);
          }
          vm.isBusy = false;
        }
      );
    }
  }
})();
