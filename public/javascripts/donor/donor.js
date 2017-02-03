(function(){
  //initialize the angular app and inject dependencies.
  angular.module("olinbaja.donor", ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/sponsorship', {
          templateUrl : './pages/donor.html',
          controller: 'DonorController',
          controllerAs: 'vm'
        })

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    })
    .controller('DonorController', DonorController);

  function DonorController($http) {
    var vm = this;

    vm.reloadDonors = function() {
      $http({
        method:'POST',
        url: '/donor/data'
      }).then(function successCallback(response) {
        vm.donors = response.data;
      }, function errorCallback(response) {
      });
    }

    vm.reloadDonors();
  }
})();
