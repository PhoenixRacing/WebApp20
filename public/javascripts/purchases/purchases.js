(function(){
  //initialize the angular app and inject dependencies.
  angular.module("olinbaja.purchases", ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/purchases', {
          templateUrl : './pages/purchases.html',
          controller: 'PurchasesController',
          controllerAs: 'vm'
        })

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    })
    .controller('PurchasesController', PurchasesController);

  function PurchasesController($http) {
    var vm = this;

    $http.get('/auth/isAuthenticated', {}).then(
      function success(response) {
        if (response.status != 200) {
          $window.location = "/";
        }
      }, function error(response) {
      }
    );

    vm.submit = function(purchase) {
      if (!purchase.name || purchase.name === '')
      {
        vm.error('Please provide a valid name');
        return;
      }
      if (!purchase.item_name || purchase.item_name === '')
      {
        vm.error('Please provide a valid item name');
        return;
      }
      if (!purchase.link || purchase.link === '') {
        vm.error('Please provide a valid purchase link');
        return;
      }
      if (!purchase.price || purchase.price === '') {
        vm.error('Please provide a valid price');
        return;
      }
      if (!purchase.count || purchase.count === '') {
        vm.error('Please provide a valid quantity');
        return;
      }
      if (!purchase.link || purchase.link === '') {
        vm.error('Please provide a description of your purchase request');
        return;
      }
      if (!purchase.date || purchase.date === '') {
        vm.error('Please provide a valid date');
        return;
      }
    };

    vm.error = function(error){
      vm.errorMessage = error;
    }

  }
})();