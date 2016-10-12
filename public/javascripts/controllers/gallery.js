

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
    vm.isAdmin = false;

    vm.reloadImages = function() {
      $http({
        method:'POST',
        url: '/gallery/data'
      }).then(function successCallback(response) {
        vm.images = response.data;
      }, function errorCallback(response) {
      });
    }

    vm.reloadAdmin = function() {
      $http({
        method:'POST',
        url: '/auth/isAdmin'
      }).then(function successCallback(response) {
        if (response.status == 200) {
          vm.isAdmin = true;
        }
      }, function errorCallback(response) {
      });
    }

    vm.deleteImage = function(image) {
      $http({
        method:'POST',
        url: '/gallery/delete',
        data: {
          'imageId': image._id
        }
      }).then(function successCallback(response) {
        vm.reloadImages();
      }, function errorCallback(response) {
      });
    }

    vm.reloadAdmin();
    vm.reloadImages();
  }
})();
