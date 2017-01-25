(function(){
  //initialize the angular app and inject dependencies.
  angular.module("olinbaja.purchases", ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/purchase', {
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

  function PurchasesController($http, $window, errorBus) {
    var vm = this;

    $http.post('/auth/isAuthenticated', {}).then(
      function success(response) {
      }, function error(response) {
        $window.location = "/";
      }
    );

    vm.submit = function(purchase) {
      errorBus.clearErrors();
      if (!purchase || !purchase.item_name || purchase.item_name === '')
      {
        return errorBus.emitError('Please provide a valid item name');
      }
      if (!purchase.link || purchase.link === '') {
        return errorBus.emitError('Please provide a valid purchase link');
      }
      if (!purchase.price || purchase.price === '') {
        return errorBus.emitError('Please provide a valid price');
      }
      if (!purchase.count || purchase.count === '') {
        return errorBus.emitError('Please provide a valid quantity');
      }
      if (!purchase.urgency || purchase.urgency === '') {
        return errorBus.emitError('Please provide a valid urgency');
      }
      if (!purchase.info || purchase.info === '') {
        return errorBus.emitError('Please provide a description of your purchase request');
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
            // Force removing all fields
            $window.location.reload();
            return errorBus.emitError('Purchase submitted');
          }
        }, function error(response) {
          if (response.data.errorMessage) {
            return errorBus.emitError(response.data.errorMessage);
          }
        }
      );
    };

  }
})();