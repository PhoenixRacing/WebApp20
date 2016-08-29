(function(){
	//initialize the angular app and inject dependencies.
	angular.module("olinbaja.team", ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/team', {
          templateUrl : './pages/team.html',
          controller: 'TeamController',
          controllerAs: 'vm'
        })

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    })
    .controller('TeamController', TeamController);

  function TeamController($http) {
    var vm = this;

    $http.post('/team/data', {}).then(
      function success(response) {
        console.log(response);
        vm.team = response.data;
      }, function error(response) {
        console.log(status);
      }
    );
  }
})();