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
        vm.team = response.data;
        console.log(vm.team);
        vm.leads = [];
        vm.subteamLeads = [];
        vm.general = [];
        for (var mem of vm.team) {
          console.log(mem);
          if (mem.lead) {
            vm.leads.push(mem);
          }
          else if (mem.subteamLead) {
            vm.subteamLeads.push(mem);
          }
          else {
            vm.general.push(mem);
          }
          console.log(vm.subteamLeads);
        }
      }, function error(response) {
      }
    );
  }
})();