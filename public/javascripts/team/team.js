(function(){
	//initialize the angular app and inject dependencies.
	angular.module("olinbaja.team", [
    'ngRoute',
    'olinbaja.user.directive'
  ])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/team', {
          templateUrl : './pages/team.html',
          controller: 'TeamController',
          controllerAs: 'vm',
          css: './css/team.css'
        })

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    })
    .controller('TeamController', TeamController);

  function TeamController($http) {
    var vm = this;

    vm.reloadPurchaseManager = function() {
      $http({
        method:'POST',
        url: '/auth/purchaseManager'
      }).then(function successCallback(response) {
        vm.purchaseManager = response.data;
      }, function errorCallback(response) {
      });
    }

    $http.post('/team/data', {}).then(
      function success(response) {
        vm.team = response.data;
        vm.teamCaptains = [];
        vm.systemLeads = [];
        vm.generalMembers = [];

        for (var i in vm.team) {
          var member = vm.team[i];

          if (member.teamCaptain) {
            vm.teamCaptains.push(member);
          } else if (member.systemLead) {
            vm.systemLeads.push(member);
          } else {
            vm.generalMembers.push(member);
          }
        }
      }, function error(response) {
      }
    );

    vm.reloadPurchaseManager();
  }
})();