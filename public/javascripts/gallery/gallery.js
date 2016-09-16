

(function(){
  //initialize the angular app and inject dependencies.
  angular.module("olinbaja.gallery", ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/gallery', {
          templateUrl : './pages/gallery.html',
          controller: 'GalleryController',
          controllerAs: 'vm'
        })

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    })
    .controller('GalleryController', GalleryController);

  function GalleryController($http) {
    var vm = this;

    vm.reloadImages = function() {
      $http({
        method:'POST',
        url: '/gallery/data'
      }).then(function successCallback(response) {
        console.log(response);
        vm.images = response.data;
      }, function errorCallback(response) {
        console.log(response);
      });
    }

    vm.reloadImages();
  }
})();
