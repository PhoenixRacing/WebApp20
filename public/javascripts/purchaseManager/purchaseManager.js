(function(){
  //initialize the angular app and inject dependencies.
  angular.module("olinbaja.purchase.manager", ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/purchaseManager', {
          templateUrl : './pages/purchaseManager.html',
          controller: 'PurchaseManagerController',
          controllerAs: 'vm'
        })

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    })
    .controller('PurchaseManagerController', PurchaseManagerController);

  function PurchaseManagerController($http, $window) {
    var vm = this;

    $http.post('/auth/user', {}).then(
      function success(response) {
        var isPurchaseManager = false;

        if (!response.data.admin && !response.data.purchaseManager) {
          $window.location = "/"
        }
      }, function error(response) {
        $window.location = "/"
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
      if (!purchase.urgency || purchase.urgency === '') {
        vm.error('Please provide a valid urgency');
        return;
      }
      if (!purchase.info || purchase.info === '') {
        vm.error('Please provide a description of your purchase request');
        return;
      }

      var body = {
        'name': purchase.name,
        'item_name': purchase.item_name,
        'link': purchase.link,
        'price': purchase.price,
        'count': purchase.count,
        'urgency': purchase.urgency,
        'info': purchase.info,
        'date': purchase.date
      }

      $http.post('/purchase/newpurchase', body).then(
        function success(response) {
          if (response.status == 200) {
            vm.error('Purchase submitted');
          }
          console.log(response);
        }, function error(response) {
          if (response.status == 401) {
            vm.error('There was a problem with your login.');
          }
        }
      );
    };

    vm.error = function(error){
      vm.errorMessage = error;
    }

  }
})();