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

  function PurchaseManagerController($http, $window, errorBus) {
    var vm = this;

    vm.purchases = [];

    $http.post('/auth/isPurchaseManaging', {}).then(
      function success(response) {
      }, function error(response) {
        $window.location = "/";
      });

    vm.dateToString = function(date) {
      var mm = date.getMonth() + 1; // getMonth() is zero-based
      var dd = date.getDate();

      return [(mm>9 ? '' : '0') + mm,
              (dd>9 ? '' : '0') + dd,
              date.getFullYear()
             ].join('/');
    }

    vm.reloadPurchases = function() {
      $http.post('/purchase/data', {}).then(
        function success(response) {
          vm.purchases = response.data;

          for (var i in vm.purchases) {
            var date = new Date(vm.purchases[i].date);
            vm.purchases[i].date = vm.dateToString(date);
          }
        }, function error(response) {
        });
    }

    vm.setStatus = function(purchase) {
      errorBus.clearErrors();
      console.log(purchase);

      $http.post('/purchase/update', {
        'purchaseId': purchase._id,
        'newStatus': purchase.newStatus
      }).then(
        function success(response) {
          console.log(response);
          vm.reloadPurchases();
        }, function error(response) {
          if (response.data.errorMessage) {
            return errorBus.emitError(response.data.errorMessage);
          }
        });
    }

    vm.deletePurchase = function(purchase) {
      errorBus.clearErrors();

      $http.post('/purchase/delete', {
        'purchaseId': purchase._id
      }).then(
        function success(response) {
          vm.reloadPurchases();
        }, function error(response) {
          if (response.data.errorMessage) {
            return errorBus.emitError(response.data.errorMessage);
          }
        });
    }

    vm.reloadPurchases();
  }
})();